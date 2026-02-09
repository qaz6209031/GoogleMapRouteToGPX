import { Coordinate, ParsedRoute, Waypoint } from "./types";

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
 * Extract coordinates embedded in the Google Maps data= parameter.
 * Format: !1d<lng>!2d<lat> pairs for each waypoint.
 * The !2d (lat) and !1d (lng) markers encode waypoint positions.
 */
function extractDataCoordinates(urlString: string): Coordinate[] {
  const coords: Coordinate[] = [];
  // Match !2d<lng>!2d<lat> or !1d<lng>!2d<lat> patterns
  const matches = urlString.matchAll(/!1d(-?\d+\.?\d+)!2d(-?\d+\.?\d+)/g);
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

  // Extract any coordinates from the data= parameter for fallback use
  const dataCoords = extractDataCoordinates(urlString);

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
    return { waypoints };
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
    return { waypoints };
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
      const waypoints = segments.map((s, i) => {
        const wp = makeWaypoint(s);
        // If this is an address waypoint and we have a matching data coordinate, attach it
        if (!wp.coordinate && wp.address && dataCoords.length > 0) {
          // Data coordinates correspond to waypoints that have place IDs (non-coordinate waypoints)
          const coord = dataCoords.shift();
          if (coord) {
            return { label: wp.label, coordinate: coord } as Waypoint;
          }
        }
        return wp;
      });
      return { waypoints };
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
