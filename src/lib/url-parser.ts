import { Coordinate, ParsedRoute, TravelMode, Waypoint } from "./types";

const COORD_REGEX = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;

function parseCoordinate(str: string): Coordinate | null {
  const match = str.trim().match(COORD_REGEX);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
    return { lat, lng };
  }
  return null;
}

function makeWaypoint(raw: string): Waypoint {
  const decoded = decodeURIComponent(raw).replace(/\+/g, " ");
  const coord = parseCoordinate(decoded);
  if (coord) {
    return { label: decoded, coordinate: coord };
  }
  return { label: decoded, address: decoded };
}

/**
 * Extract "named place" coordinates from the data= parameter.
 * These are coordinates that resolve path segment addresses.
 * Pattern: !1s<placeId>!2m2!1d<lng>!2d<lat>
 */
function extractNamedPlaceCoordinates(urlString: string): Coordinate[] {
  const coords: Coordinate[] = [];
  const matches = urlString.matchAll(
    /!1s[^!]+!2m2!1d(-?\d+\.?\d+)!2d(-?\d+\.?\d+)/g
  );
  for (const m of matches) {
    const lng = parseFloat(m[1]);
    const lat = parseFloat(m[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      coords.push({ lat, lng });
    }
  }
  return coords;
}

/**
 * Extract "via waypoint" coordinates from the data= parameter.
 * These are intermediate points the user dragged or added, identified by !4e1.
 * Pattern: !1m2!1d<lng>!2d<lat>...!4e1
 */
function extractViaWaypoints(urlString: string): Coordinate[] {
  const coords: Coordinate[] = [];
  // Via waypoints have !1m2!1d<lng>!2d<lat> followed eventually by !4e1
  const matches = urlString.matchAll(
    /!1m2!1d(-?\d+\.?\d+)!2d(-?\d+\.?\d+)[^!]*(?:![^!]*)*?!4e1/g
  );
  for (const m of matches) {
    const lng = parseFloat(m[1]);
    const lat = parseFloat(m[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      coords.push({ lat, lng });
    }
  }
  return coords;
}

/**
 * Extract the route alternative index from the data= parameter.
 * Google Maps encodes this as !5i<N> where N is the 0-based route index.
 */
function extractRouteIndex(urlString: string): number {
  const match = urlString.match(/!5i(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Extract travel mode from a Google Maps URL.
 * Data parameter: !3e0 = driving, !3e1 = bicycling, !3e2 = walking, !3e3 = transit
 * Query parameter: travelmode=driving|bicycling|walking|transit
 */
function extractTravelMode(url: URL, urlString: string): TravelMode {
  // Check query parameter first (used in API-style URLs)
  const queryMode = url.searchParams.get("travelmode");
  if (queryMode && ["driving", "bicycling", "walking", "transit"].includes(queryMode)) {
    return queryMode as TravelMode;
  }

  // Check data parameter encoding: !3e<N>
  const dataMatch = urlString.match(/!3e(\d)/);
  if (dataMatch) {
    const modeMap: Record<string, TravelMode> = {
      "0": "driving",
      "1": "bicycling",
      "2": "walking",
      "3": "transit",
    };
    return modeMap[dataMatch[1]] ?? "driving";
  }

  return "driving";
}

/**
 * Parse a Google Maps directions URL into waypoints.
 *
 * Supported formats:
 * 1. Path-based: /maps/dir/OriginAddr/WaypointAddr/DestAddr/@viewparams
 * 2. Query-based: /maps?saddr=A&daddr=B+to:C+to:D
 * 3. Query-based: /maps/dir/?api=1&origin=A&destination=B&waypoints=C|D
 * 4. Data parameter with coordinates embedded
 */
export function parseGoogleMapsUrl(urlString: string): ParsedRoute {
  const url = new URL(urlString);

  // Extract coordinates from the data= parameter
  const namedPlaceCoords = extractNamedPlaceCoordinates(urlString);
  const viaWaypoints = extractViaWaypoints(urlString);
  const routeIndex = extractRouteIndex(urlString);
  const travelMode = extractTravelMode(url, urlString);

  // Query-based format: ?api=1&origin=...&destination=...&waypoints=...|...
  const origin = url.searchParams.get("origin");
  const destination = url.searchParams.get("destination");
  if (origin && destination) {
    const waypoints: Waypoint[] = [makeWaypoint(origin)];
    const wp = url.searchParams.get("waypoints");
    if (wp) {
      for (const w of wp.split("|")) {
        if (w.trim()) waypoints.push(makeWaypoint(w));
      }
    }
    waypoints.push(makeWaypoint(destination));
    return { waypoints, routeIndex, travelMode };
  }

  // Legacy query format: ?saddr=A&daddr=B+to:C+to:D
  const saddr = url.searchParams.get("saddr");
  const daddr = url.searchParams.get("daddr");
  if (saddr && daddr) {
    const parts = daddr.split("+to:");
    const waypoints: Waypoint[] = [makeWaypoint(saddr)];
    for (const p of parts) {
      if (p.trim()) waypoints.push(makeWaypoint(p));
    }
    return { waypoints, routeIndex, travelMode };
  }

  // Path-based format: /maps/dir/Place1/Place2/Place3/@lat,lng,zoom
  const pathname = decodeURIComponent(url.pathname);
  const dirMatch = pathname.match(/\/maps\/dir\/(.*)/);
  if (dirMatch) {
    const allSegments = dirMatch[1].split("/");
    // Take segments only until we hit @ (viewport) or data= (metadata)
    const segments: string[] = [];
    for (const s of allSegments) {
      if (!s || s.startsWith("@") || s.startsWith("data=")) break;
      segments.push(s);
    }

    if (segments.length >= 2) {
      // Resolve path segments to waypoints, using named place coordinates
      // from the data parameter to resolve addresses
      const namedCoords = [...namedPlaceCoords];
      const waypoints: Waypoint[] = [];

      for (const s of segments) {
        const wp = makeWaypoint(s);
        if (!wp.coordinate && wp.address && namedCoords.length > 0) {
          // Use the next named place coordinate to resolve this address
          const coord = namedCoords.shift()!;
          waypoints.push({ label: wp.label, coordinate: coord });
        } else {
          waypoints.push(wp);
        }
      }

      // Insert via waypoints (from dragged routes) before the destination
      if (viaWaypoints.length > 0) {
        const dest = waypoints.pop()!;
        for (const coord of viaWaypoints) {
          waypoints.push({ label: `${coord.lat},${coord.lng}`, coordinate: coord });
        }
        waypoints.push(dest);
      }

      return { waypoints, routeIndex, travelMode };
    }
  }

  throw new Error(
    "Could not parse Google Maps URL. Please paste a directions URL from Google Maps."
  );
}

async function nominatimSearch(query: string): Promise<Coordinate | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({
        q: query,
        format: "json",
        limit: "1",
      }),
    {
      headers: {
        "User-Agent": "GoogleMapsToGPX/1.0",
      },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  if (!data.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

/**
 * Geocode an address using Nominatim (OpenStreetMap).
 * Retries by stripping the business name prefix if the full query fails,
 * since Nominatim often can't resolve "Business Name, 123 Street..." format.
 */
export async function geocodeAddress(address: string): Promise<Coordinate> {
  // Try full address first
  const result = await nominatimSearch(address);
  if (result) return result;

  // Try stripping business name: "Business, 123 Street, City" → "123 Street, City"
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 3) {
    // Try without the first part (likely business name)
    const withoutBusiness = parts.slice(1).join(", ");
    const result2 = await nominatimSearch(withoutBusiness);
    if (result2) return result2;
  }

  // Try with just the street number onward (strip suite numbers etc.)
  const streetMatch = address.match(/(\d+\s+\w[\w\s]+(?:Ave|St|Rd|Blvd|Dr|Ln|Way|Ct|Pl|Pkwy|Hwy)[\w\s]*,[\s\S]*)/i);
  if (streetMatch) {
    const result3 = await nominatimSearch(streetMatch[1]);
    if (result3) return result3;
  }

  throw new Error(`Could not find location: "${address}"`);
}

/**
 * Resolve all waypoints to coordinates, geocoding addresses as needed.
 */
export async function resolveWaypoints(
  waypoints: Waypoint[]
): Promise<Coordinate[]> {
  const resolved: Coordinate[] = [];
  for (const wp of waypoints) {
    if (wp.coordinate) {
      resolved.push(wp.coordinate);
    } else if (wp.address) {
      const coord = await geocodeAddress(wp.address);
      resolved.push(coord);
    }
  }
  return resolved;
}
