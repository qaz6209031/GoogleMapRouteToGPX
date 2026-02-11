import { Coordinate } from "./types";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate a GPX 1.1 XML string from coordinates.
 * Compatible with Garmin, Bryton, and Wahoo devices.
 */
export function generateGpx(
  coordinates: Coordinate[],
  name: string = "Google Maps Route"
): string {
  const timestamp = new Date().toISOString();

  const trackpoints = coordinates
    .map((c) => {
      return `      <trkpt lat="${c.lat.toFixed(7)}" lon="${c.lng.toFixed(7)}">\n      </trkpt>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"
     version="1.1"
     creator="GoogleMapsToGPX">
  <metadata>
    <name>${escapeXml(name)}</name>
    <time>${timestamp}</time>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <trkseg>
${trackpoints}
    </trkseg>
  </trk>
</gpx>`;
}
