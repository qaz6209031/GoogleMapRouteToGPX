import { AvoidOption, Coordinate, RouteResult, RoutePoint, TravelMode } from "./types";
import { decodePolyline } from "./polyline";
import { UserInputError } from "./errors";
import { buildCacheKey, cachedFetch } from "./route-cache";

const DIRECTIONS_BASE =
  "https://maps.googleapis.com/maps/api/directions/json";

/** Google Directions allows at most this many intermediate waypoints. */
export const MAX_INTERMEDIATE_WAYPOINTS = 25;

/**
 * How long a Directions response may stay cached. Google's Maps Platform
 * Service Specific Terms (Directions API > Caching) allow caching lat/lng
 * values from this API for up to 30 consecutive calendar days; we use a
 * much shorter TTL both to stay well inside that limit and because
 * traffic/road conditions can make a day-old route stale.
 */
export const DIRECTIONS_CACHE_TTL_SECONDS = 24 * 60 * 60;

/** Coordinates are rounded to this many decimal places (~0.1m) before hashing into a cache key. */
const COORD_CACHE_PRECISION = 6;

function roundForCacheKey(n: number): number {
  const factor = 10 ** COORD_CACHE_PRECISION;
  return Math.round(n * factor) / factor;
}

/**
 * Cache key covers exactly what determines the Directions request/response:
 * the ordered waypoints (stops and vias), travel mode, avoid options, and
 * whether alternatives were requested. `routeIndex` is deliberately
 * excluded — it only selects which already-fetched route to return.
 */
export function buildDirectionsCacheKey(
  waypoints: RoutePoint[],
  travelMode: TravelMode,
  avoid: AvoidOption[],
  wantsAlternatives: boolean
): string {
  return buildCacheKey("directions", {
    points: waypoints.map(
      (w) => `${w.via ? "via:" : ""}${roundForCacheKey(w.lat)},${roundForCacheKey(w.lng)}`
    ),
    mode: travelMode,
    avoid: [...avoid].sort(),
    alt: wantsAlternatives,
  });
}

interface GoogleDirectionsLeg {
  distance: { value: number };
  duration: { value: number };
  steps: { polyline: { points: string } }[];
}

interface GoogleDirectionsRoute {
  legs: GoogleDirectionsLeg[];
}

/**
 * Keep every stop and fit as many via points as possible within the
 * Directions API's intermediate-waypoint limit. If the stops alone exceed
 * the limit there's nothing left to drop, so that's a hard error; otherwise
 * vias are downsampled evenly so they stay spread across the whole route.
 */
export function limitIntermediateWaypoints(
  intermediates: RoutePoint[],
  max: number = MAX_INTERMEDIATE_WAYPOINTS
): RoutePoint[] {
  const stops = intermediates.filter((w) => !w.via);
  if (stops.length > max) {
    throw new UserInputError(
      `This route has too many stops (${stops.length}). Google Directions supports at most ${max} intermediate waypoints.`
    );
  }
  if (intermediates.length <= max) return intermediates;

  const vias = intermediates.filter((w) => w.via);
  const keptVias = new Set(downsampleEvenly(vias, max - stops.length));
  return intermediates.filter((w) => !w.via || keptVias.has(w));
}

function downsampleEvenly<T>(items: T[], count: number): T[] {
  if (count <= 0) return [];
  if (items.length <= count) return items;
  const step = items.length / count;
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(items[Math.floor(i * step)]);
  }
  return result;
}

/**
 * Get a route from the Google Directions API between the given waypoints.
 * Returns the exact route Google Maps would display.
 */
export async function getRoute(
  waypoints: RoutePoint[],
  routeIndex: number = 0,
  travelMode: TravelMode = "driving",
  avoid: AvoidOption[] = []
): Promise<RouteResult> {
  if (waypoints.length < 2) {
    throw new Error("At least 2 waypoints are required for routing");
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Server is missing routing configuration");
  }

  const origin = waypoints[0];
  const destination = waypoints[waypoints.length - 1];

  // Google doesn't return alternative routes when intermediate waypoints are
  // present, so only ask for alternatives when there's nothing in between.
  const hasIntermediates = waypoints.length > 2;
  const wantsAlternatives = routeIndex > 0 && !hasIntermediates;
  const warnings: string[] = [];
  if (routeIndex > 0 && hasIntermediates) {
    warnings.push("Selected alternative route isn't supported with stops; used the main route.");
  }

  // Intermediate waypoints (everything between origin and destination).
  // Points dragged onto the route use via: so they shape the route without
  // becoming stops, matching how Google Maps treats them.
  const intermediates = limitIntermediateWaypoints(waypoints.slice(1, -1));

  const cacheKey = buildDirectionsCacheKey(
    [origin, ...intermediates, destination],
    travelMode,
    avoid,
    wantsAlternatives
  );

  // fetchDirectionsRoutes throws on anything other than status "OK" (including
  // ZERO_RESULTS/NOT_FOUND), so those responses never reach cachedFetch's cache
  // write and are simply never cached, not even briefly.
  const { value: routes, status: cacheStatus } = await cachedFetch(
    cacheKey,
    DIRECTIONS_CACHE_TTL_SECONDS,
    () =>
      fetchDirectionsRoutes(origin, destination, intermediates, travelMode, avoid, wantsAlternatives, apiKey),
    (routes) => routes.length > 0
  );

  let effectiveIndex = wantsAlternatives ? routeIndex : 0;
  if (effectiveIndex >= routes.length) {
    warnings.push("Selected alternative route isn't available; used the main route.");
    effectiveIndex = 0;
  }

  const route = routes[effectiveIndex];

  // Decode step-level polylines for full-resolution geometry
  // (overview_polyline is simplified and loses detail on complex routes)
  const coordinates: Coordinate[] = [];
  let distanceMeters = 0;
  let durationSeconds = 0;

  for (const leg of route.legs) {
    distanceMeters += leg.distance.value;
    durationSeconds += leg.duration.value;

    for (const step of leg.steps) {
      const stepCoords = decodePolyline(step.polyline.points);
      // Skip the first point of each step (except the very first) to avoid duplicates
      const startIndex = coordinates.length === 0 ? 0 : 1;
      for (let i = startIndex; i < stepCoords.length; i++) {
        coordinates.push(stepCoords[i]);
      }
    }
  }

  return {
    coordinates,
    distanceMeters,
    durationSeconds,
    warnings,
    cacheStatus,
  };
}

/** Issues the actual Directions API request. Only called on a cache miss. */
async function fetchDirectionsRoutes(
  origin: RoutePoint,
  destination: RoutePoint,
  intermediates: RoutePoint[],
  travelMode: TravelMode,
  avoid: AvoidOption[],
  wantsAlternatives: boolean,
  apiKey: string
): Promise<GoogleDirectionsRoute[]> {
  const params = new URLSearchParams({
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    mode: travelMode,
    key: apiKey,
    ...(wantsAlternatives ? { alternatives: "true" } : {}),
    ...(avoid.length > 0 ? { avoid: avoid.join("|") } : {}),
  });

  if (intermediates.length > 0) {
    const intermediateParam = intermediates
      .map((w) => `${w.via ? "via:" : ""}${w.lat},${w.lng}`)
      .join("|");
    params.set("waypoints", intermediateParam);
  }

  const res = await fetch(`${DIRECTIONS_BASE}?${params.toString()}`);

  if (!res.ok) {
    console.error(`Google Directions API request failed: ${res.statusText}`);
    throw new Error("Failed to get directions from Google Maps");
  }

  const data = await res.json();

  if (data.status === "NOT_FOUND" || data.status === "ZERO_RESULTS") {
    throw new UserInputError("Google could not find a route between these locations.");
  }

  if (data.status !== "OK" || !data.routes?.length) {
    console.error(
      `Google Directions API error: ${data.status} — ${data.error_message || "no route found"}`
    );
    throw new Error("Failed to get directions from Google Maps");
  }

  return data.routes;
}
