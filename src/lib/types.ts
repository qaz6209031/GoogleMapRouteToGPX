export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Waypoint {
  label: string;
  coordinate?: Coordinate;
  address?: string;
}

export type TravelMode = "driving" | "bicycling" | "walking" | "transit";

export interface ParsedRoute {
  waypoints: Waypoint[];
  routeIndex: number;
  travelMode: TravelMode;
}

export interface RouteResult {
  coordinates: Coordinate[];
  distanceMeters: number;
  durationSeconds: number;
}

export interface ConversionResult {
  gpx: string;
  distanceKm: number;
}

export interface ConversionProgress {
  step: string;
  detail: string;
}
