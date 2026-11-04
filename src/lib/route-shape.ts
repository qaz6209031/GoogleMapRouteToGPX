/**
 * Turns a generated GPX track into an SVG path fitted to a box, so the
 * converted route can be drawn back to the user. Runs client-side on the GPX
 * string the convert API already returns; nothing here leaves the browser.
 */

export interface LatLon {
  lat: number;
  lon: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface RouteShape {
  /** SVG path data in box coordinates. */
  d: string;
  start: Point;
  end: Point;
  /** Evenly spaced points along the route, at `tickKm` intervals. */
  ticks: Point[];
  tickKm: number;
  /** A round scale-bar length and its width in box units. */
  scaleKm: number;
  scaleWidth: number;
}

const KM_PER_DEG_LAT = 110.574;
const KM_PER_DEG_LON_AT_EQUATOR = 111.32;
const NICE_KM = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000];
const MAX_POINTS = 1200;
const MAX_TICKS = 12;

/** Reads `<trkpt lat lon>` pairs from the GPX the generator emits. */
export function parseGpxTrack(gpx: string): LatLon[] {
  const points: LatLon[] = [];
  const re = /<trkpt\s+lat="(-?[\d.]+)"\s+lon="(-?[\d.]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(gpx)) !== null) {
    const lat = Number(match[1]);
    const lon = Number(match[2]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) points.push({ lat, lon });
  }
  return points;
}

function downsample<T>(points: T[], max: number): T[] {
  if (points.length <= max) return points;
  const step = (points.length - 1) / (max - 1);
  const out: T[] = [];
  for (let i = 0; i < max; i++) out.push(points[Math.round(i * step)]);
  return out;
}

function niceAtMost(value: number): number {
  let best = NICE_KM[0];
  for (const n of NICE_KM) if (n <= value) best = n;
  return best;
}

/**
 * Equirectangular projection around the route's mean latitude, north up,
 * scaled uniformly to fit `width` x `height` with `pad` on every side.
 * Returns null when there are fewer than two distinct points.
 */
export function projectRoute(
  track: LatLon[],
  width: number,
  height: number,
  pad: number,
): RouteShape | null {
  if (track.length < 2) return null;
  const pts = downsample(track, MAX_POINTS);

  const lat0 = pts.reduce((sum, p) => sum + p.lat, 0) / pts.length;
  const kmPerDegLon = KM_PER_DEG_LON_AT_EQUATOR * Math.cos((lat0 * Math.PI) / 180);
  const km = pts.map((p) => ({ x: p.lon * kmPerDegLon, y: -p.lat * KM_PER_DEG_LAT }));

  const minX = Math.min(...km.map((p) => p.x));
  const maxX = Math.max(...km.map((p) => p.x));
  const minY = Math.min(...km.map((p) => p.y));
  const maxY = Math.max(...km.map((p) => p.y));
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  if (spanX === 0 && spanY === 0) return null;

  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const unitsPerKm = Math.min(
    spanX > 0 ? innerW / spanX : Infinity,
    spanY > 0 ? innerH / spanY : Infinity,
  );
  const offsetX = pad + (innerW - spanX * unitsPerKm) / 2;
  const offsetY = pad + (innerH - spanY * unitsPerKm) / 2;
  const box = km.map((p) => ({
    x: offsetX + (p.x - minX) * unitsPerKm,
    y: offsetY + (p.y - minY) * unitsPerKm,
  }));

  const d = box
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join("");

  // Cumulative length in km, for ticks.
  const cumulative = [0];
  for (let i = 1; i < km.length; i++) {
    cumulative.push(cumulative[i - 1] + Math.hypot(km[i].x - km[i - 1].x, km[i].y - km[i - 1].y));
  }
  const totalKm = cumulative[cumulative.length - 1];
  // Smallest round interval that keeps the tick count at or under MAX_TICKS.
  const tickKm =
    NICE_KM.find((n) => n >= totalKm / MAX_TICKS) ?? NICE_KM[NICE_KM.length - 1];
  const ticks: Point[] = [];
  let seg = 1;
  for (let at = tickKm; at < totalKm; at += tickKm) {
    while (seg < cumulative.length - 1 && cumulative[seg] < at) seg++;
    const span = cumulative[seg] - cumulative[seg - 1];
    const t = span > 0 ? (at - cumulative[seg - 1]) / span : 0;
    ticks.push({
      x: box[seg - 1].x + (box[seg].x - box[seg - 1].x) * t,
      y: box[seg - 1].y + (box[seg].y - box[seg - 1].y) * t,
    });
  }

  const scaleKm = niceAtMost(innerW / 4 / unitsPerKm);
  return {
    d,
    start: box[0],
    end: box[box.length - 1],
    ticks,
    tickKm,
    scaleKm,
    scaleWidth: scaleKm * unitsPerKm,
  };
}
