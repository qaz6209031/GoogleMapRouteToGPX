import { AvoidOption, Coordinate, RouteResult, RoutePoint, TravelMode } from "./types";
import { decodePolyline } from "./polyline";
import { UserInputError } from "./errors";

const DIRECTIONS_BASE =
  "https://maps.googleapis.com/maps/api/directions/json";

/** Google Directions allows at most this many intermediate waypoints. */
export const MAX_INTERMEDIATE_WAYPOINTS = 25;

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

  const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
  const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;

  // Google doesn't return alternative routes when intermediate waypoints are
  // present, so only ask for alternatives when there's nothing in between.
  const hasIntermediates = waypoints.length > 2;
  const wantsAlternatives = routeIndex > 0 && !hasIntermediates;
  const warnings: string[] = [];
  if (routeIndex > 0 && hasIntermediates) {
    warnings.push("Selected alternative route isn't supported with stops; used the main route.");
  }

  const params = new URLSearchParams({
    origin,
    destination,
    mode: travelMode,
    key: apiKey,
    ...(wantsAlternatives ? { alternatives: "true" } : {}),
    ...(avoid.length > 0 ? { avoid: avoid.join("|") } : {}),
  });

  // Intermediate waypoints (everything between origin and destination).
  // Points dragged onto the route use via: so they shape the route without
  // becoming stops, matching how Google Maps treats them.
  if (hasIntermediates) {
    const intermediates = limitIntermediateWaypoints(waypoints.slice(1, -1));
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

  let effectiveIndex = wantsAlternatives ? routeIndex : 0;
  if (effectiveIndex >= data.routes.length) {
    warnings.push("Selected alternative route isn't available; used the main route.");
    effectiveIndex = 0;
  }

  const route = data.routes[effectiveIndex];

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
  };
}
