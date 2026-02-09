import { Coordinate, OSRMRouteResult } from "./types";
import { decodePolyline } from "./polyline";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/bicycle";

/**
 * Get a bicycle route from OSRM between the given waypoints.
 * OSRM expects coordinates in lng,lat order.
 */
export async function getRoute(
  waypoints: Coordinate[]
): Promise<OSRMRouteResult> {
  if (waypoints.length < 2) {
    throw new Error("At least 2 waypoints are required for routing");
  }

  // OSRM coordinate format: lng,lat;lng,lat;...
  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(";");

  const url = `${OSRM_BASE}/${coords}?overview=full&geometries=polyline&steps=false`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "GoogleMapsToGPX/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`OSRM routing failed: ${res.statusText}`);
  }

  const data = await res.json();

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error(
      `OSRM could not find a route: ${data.code} — ${data.message || "no route found"}`
    );
  }

  const route = data.routes[0];
  const coordinates = decodePolyline(route.geometry);

  return {
    coordinates,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}
