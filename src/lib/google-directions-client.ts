import { Coordinate, RouteResult, TravelMode } from "./types";
import { decodePolyline } from "./polyline";

const DIRECTIONS_BASE =
  "https://maps.googleapis.com/maps/api/directions/json";

/**
 * Get a route from the Google Directions API between the given waypoints.
 * Returns the exact route Google Maps would display.
 */
export async function getRoute(
  waypoints: Coordinate[],
  routeIndex: number = 0,
  travelMode: TravelMode = "driving"
): Promise<RouteResult> {
  if (waypoints.length < 2) {
    throw new Error("At least 2 waypoints are required for routing");
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY environment variable is not set"
    );
  }

  const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
  const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;

  const params = new URLSearchParams({
    origin,
    destination,
    mode: travelMode,
    key: apiKey,
    ...(routeIndex > 0 ? { alternatives: "true" } : {}),
  });

  // Intermediate waypoints (everything between origin and destination)
  if (waypoints.length > 2) {
    const intermediates = waypoints
      .slice(1, -1)
      .map((w) => `${w.lat},${w.lng}`)
      .join("|");
    params.set("waypoints", intermediates);
  }

  const res = await fetch(`${DIRECTIONS_BASE}?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Google Directions API request failed: ${res.statusText}`);
  }

  const data = await res.json();

  if (data.status !== "OK" || !data.routes?.length) {
    throw new Error(
      `Google Directions API error: ${data.status} — ${data.error_message || "no route found"}`
    );
  }

  const route = data.routes[Math.min(routeIndex, data.routes.length - 1)];

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
  };
}
