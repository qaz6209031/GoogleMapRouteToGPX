import {
  AvoidOption,
  Coordinate,
  ParsedRoute,
  RoutePoint,
  TravelMode,
  Waypoint,
} from "./types";

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
 * A node in Google Maps' protobuf-like data= encoding.
 * Each token is !<field><type><value>; type "m" is a nested message whose
 * value is the total number of tokens it contains.
 */
interface DataNode {
  field: number;
  type: string;
  value: string;
  children: DataNode[];
}

function parseDataTokens(tokens: string[], start: number, count: number): DataNode[] {
  const nodes: DataNode[] = [];
  let i = start;
  while (i < start + count && i < tokens.length) {
    const match = tokens[i].match(/^(\d+)([a-z])(.*)$/);
    i++;
    if (!match) continue;
    const node: DataNode = {
      field: parseInt(match[1], 10),
      type: match[2],
      value: match[3],
      children: [],
    };
    if (node.type === "m") {
      const size = parseInt(node.value, 10) || 0;
      node.children = parseDataTokens(tokens, i, size);
      i += size;
    }
    nodes.push(node);
  }
  return nodes;
}

function child(node: DataNode | undefined, field: number, type: string) {
  return node?.children.find((c) => c.field === field && c.type === type);
}

function children(node: DataNode | undefined, field: number, type: string) {
  return node?.children.filter((c) => c.field === field && c.type === type) ?? [];
}

/** Read a !1d<lng>!2d<lat> pair from a message node. */
function nodeCoordinate(node: DataNode | undefined): Coordinate | null {
  const lng = parseFloat(child(node, 1, "d")?.value ?? "");
  const lat = parseFloat(child(node, 2, "d")?.value ?? "");
  if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
    return { lat, lng };
  }
  return null;
}

interface DataWaypoint {
  /** Coordinate of a named place (!2m2!1d<lng>!2d<lat>), if present */
  coordinate: Coordinate | null;
  /** Points dragged onto the leg that starts at this waypoint */
  vias: Coordinate[];
}

interface DirectionsData {
  waypoints: DataWaypoint[];
  routeIndex?: number;
  travelMode?: TravelMode;
  avoid: AvoidOption[];
}

const DATA_TRAVEL_MODES: Record<string, TravelMode> = {
  "0": "driving",
  "1": "bicycling",
  "2": "walking",
  "3": "transit",
};

/**
 * Parse the directions part of a path-based URL's data= segment:
 *   !4m<n>!4m<n>                       directions message
 *     !1m<n>...                        one per waypoint, in path order
 *       !2m2!1d<lng>!2d<lat>           named place coordinate
 *       !3m4!1m2!1d<lng>!2d<lat>!3s..  via point dragged on the following leg
 *     !2m<n>!1b1!2b1!3b1               avoid highways / tolls / ferries
 *     !3e<N>                           travel mode
 *     !5i<N>                           selected alternative route
 */
function parseDirectionsData(url: URL): DirectionsData | null {
  const segment = url.pathname.split("/").find((s) => s.startsWith("data="));
  if (!segment) return null;

  const tokens = decodeURIComponent(segment.slice("data=".length))
    .split("!")
    .filter(Boolean);
  const root = parseDataTokens(tokens, 0, tokens.length);
  const directions = child(
    root.find((n) => n.field === 4 && n.type === "m"),
    4,
    "m"
  );
  if (!directions) return null;

  const waypoints = children(directions, 1, "m").map((wp) => ({
    coordinate: nodeCoordinate(child(wp, 2, "m")),
    vias: children(wp, 3, "m")
      .map((via) => nodeCoordinate(child(via, 1, "m")))
      .filter((c): c is Coordinate => c !== null),
  }));

  const options = child(directions, 2, "m");
  const avoid: AvoidOption[] = [];
  if (child(options, 1, "b")?.value === "1") avoid.push("highways");
  if (child(options, 2, "b")?.value === "1") avoid.push("tolls");
  if (child(options, 3, "b")?.value === "1") avoid.push("ferries");

  const mode = child(directions, 3, "e")?.value;
  const routeIndex = child(directions, 5, "i")?.value;

  return {
    waypoints,
    routeIndex: routeIndex ? parseInt(routeIndex, 10) : undefined,
    travelMode: mode ? DATA_TRAVEL_MODES[mode] : undefined,
    avoid,
  };
}

/**
 * Extract travel mode from a Google Maps URL.
 * Query parameter (travelmode=driving|bicycling|walking|transit) takes
 * precedence over the data= encoding (!3e<N>).
 */
function extractTravelMode(url: URL, data: DirectionsData | null): TravelMode {
  const queryMode = url.searchParams.get("travelmode");
  if (queryMode && ["driving", "bicycling", "walking", "transit"].includes(queryMode)) {
    return queryMode as TravelMode;
  }
  return data?.travelMode ?? "driving";
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

  // Extract waypoint coordinates, dragged via points and route options
  // from the data= parameter
  const data = parseDirectionsData(url);
  const routeIndex = data?.routeIndex ?? 0;
  const travelMode = extractTravelMode(url, data);
  const avoid = data?.avoid ?? [];

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
    return { waypoints, routeIndex, travelMode, avoid };
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
    return { waypoints, routeIndex, travelMode, avoid };
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
      const dataWaypoints = data?.waypoints ?? [];
      // The data= waypoint blocks normally line up 1:1 with the path
      // segments; if they don't, fall back to using their coordinates in order
      // and appending every via point to the last leg.
      const aligned = dataWaypoints.length === segments.length;
      const namedCoords = dataWaypoints
        .map((d) => d.coordinate)
        .filter((c): c is Coordinate => c !== null);
      const waypoints: Waypoint[] = [];

      const pushVias = (vias: Coordinate[]) => {
        for (const coord of vias) {
          waypoints.push({ label: `${coord.lat},${coord.lng}`, coordinate: coord, via: true });
        }
      };

      segments.forEach((s, i) => {
        const wp = makeWaypoint(s);
        if (!wp.coordinate && wp.address) {
          const coord = aligned ? dataWaypoints[i].coordinate : namedCoords.shift();
          waypoints.push(coord ? { label: wp.label, coordinate: coord } : wp);
        } else {
          waypoints.push(wp);
        }
        // Via points belong to the leg that starts at this waypoint
        if (aligned && i < segments.length - 1) {
          pushVias(dataWaypoints[i].vias);
        }
      });

      if (!aligned) {
        const dest = waypoints.pop()!;
        pushVias(dataWaypoints.flatMap((d) => d.vias));
        waypoints.push(dest);
      }

      return { waypoints, routeIndex, travelMode, avoid };
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
): Promise<RoutePoint[]> {
  const resolved: RoutePoint[] = [];
  for (const wp of waypoints) {
    if (wp.coordinate) {
      resolved.push({ ...wp.coordinate, via: wp.via });
    } else if (wp.address) {
      const coord = await geocodeAddress(wp.address);
      resolved.push({ ...coord, via: wp.via });
    }
  }
  return resolved;
}
