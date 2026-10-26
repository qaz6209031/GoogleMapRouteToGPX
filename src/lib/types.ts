export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Waypoint {
  label: string;
  coordinate?: Coordinate;
  address?: string;
  /** Pass-through point (e.g. from dragging the route), not a stop */
  via?: boolean;
}

/** A resolved waypoint ready to send to the router */
export interface RoutePoint extends Coordinate {
  via?: boolean;
}

export type TravelMode = "driving" | "bicycling" | "walking" | "transit";

export type AvoidOption = "highways" | "tolls" | "ferries";

export interface ParsedRoute {
  waypoints: Waypoint[];
  routeIndex: number;
  travelMode: TravelMode;
  avoid: AvoidOption[];
  /** Dragged via points that couldn't be matched to a path segment while parsing. */
  pendingVias?: Coordinate[];
}

export interface RouteResult {
  coordinates: Coordinate[];
  distanceMeters: number;
  durationSeconds: number;
  warnings: string[];
  cacheStatus: CacheStatus;
}

/** Whether a cached external API result was reused, missed, or the cache layer was skipped entirely. */
export type CacheStatus = "HIT" | "MISS" | "BYPASS";
