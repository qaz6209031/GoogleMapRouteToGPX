import { Coordinate, ElevatedCoordinate } from "./types";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/elevation";
const MAX_POINTS_PER_REQUEST = 100;
const TARGET_ELEVATION_POINTS = 500;

/**
 * Downsample an array of coordinates to approximately targetCount points,
 * always keeping the first and last points.
 */
function downsample(
  coords: Coordinate[],
  targetCount: number
): { sampled: Coordinate[]; indices: number[] } {
  if (coords.length <= targetCount) {
    return {
      sampled: [...coords],
      indices: coords.map((_, i) => i),
    };
  }

  const indices: number[] = [0];
  const step = (coords.length - 1) / (targetCount - 1);

  for (let i = 1; i < targetCount - 1; i++) {
    indices.push(Math.round(i * step));
  }
  indices.push(coords.length - 1);

  return {
    sampled: indices.map((i) => coords[i]),
    indices,
  };
}

/**
 * Linearly interpolate elevation values for all coordinates
 * based on known elevation at sampled indices.
 */
function interpolateElevations(
  coords: Coordinate[],
  sampledIndices: number[],
  sampledElevations: number[]
): ElevatedCoordinate[] {
  const result: ElevatedCoordinate[] = coords.map((c) => ({ ...c }));

  // Set known elevations
  for (let i = 0; i < sampledIndices.length; i++) {
    result[sampledIndices[i]].ele = sampledElevations[i];
  }

  // Interpolate between known points
  for (let s = 0; s < sampledIndices.length - 1; s++) {
    const fromIdx = sampledIndices[s];
    const toIdx = sampledIndices[s + 1];
    const fromEle = sampledElevations[s];
    const toEle = sampledElevations[s + 1];

    for (let i = fromIdx + 1; i < toIdx; i++) {
      const t = (i - fromIdx) / (toIdx - fromIdx);
      result[i].ele = fromEle + t * (toEle - fromEle);
    }
  }

  return result;
}

/**
 * Fetch elevation data from Open-Meteo for a batch of coordinates.
 */
async function fetchElevationBatch(
  coords: Coordinate[]
): Promise<number[]> {
  const latitudes = coords.map((c) => c.lat.toFixed(6)).join(",");
  const longitudes = coords.map((c) => c.lng.toFixed(6)).join(",");

  const res = await fetch(
    `${OPEN_METEO_URL}?latitude=${latitudes}&longitude=${longitudes}`,
    {
      headers: { "User-Agent": "GoogleMapsToGPX/1.0" },
    }
  );

  if (!res.ok) {
    throw new Error(`Elevation API failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.elevation as number[];
}

/**
 * Add elevation data to route coordinates.
 * Downsamples to ~500 points, fetches elevation, then interpolates.
 * If the API fails, returns coordinates without elevation.
 */
export async function addElevation(
  coords: Coordinate[]
): Promise<{ elevated: ElevatedCoordinate[]; elevationGain: number }> {
  try {
    const { sampled, indices } = downsample(coords, TARGET_ELEVATION_POINTS);

    // Fetch in batches of MAX_POINTS_PER_REQUEST
    const allElevations: number[] = [];
    for (let i = 0; i < sampled.length; i += MAX_POINTS_PER_REQUEST) {
      const batch = sampled.slice(i, i + MAX_POINTS_PER_REQUEST);
      const elevations = await fetchElevationBatch(batch);
      allElevations.push(...elevations);
    }

    const elevated = interpolateElevations(coords, indices, allElevations);

    // Calculate elevation gain
    let elevationGain = 0;
    for (let i = 1; i < elevated.length; i++) {
      const diff = (elevated[i].ele ?? 0) - (elevated[i - 1].ele ?? 0);
      if (diff > 0) elevationGain += diff;
    }

    return { elevated, elevationGain: Math.round(elevationGain) };
  } catch {
    // Fallback: return without elevation
    return {
      elevated: coords.map((c) => ({ ...c })),
      elevationGain: 0,
    };
  }
}
