import { NextRequest, NextResponse } from "next/server";
import { parseGoogleMapsUrl, resolveWaypoints } from "@/lib/url-parser";
import { getRoute } from "@/lib/google-directions-client";
import { generateGpx } from "@/lib/gpx-generator";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A Google Maps URL is required" },
        { status: 400 }
      );
    }

    // 1. Parse the URL into waypoints
    let parsed;
    try {
      parsed = parseGoogleMapsUrl(url);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Failed to parse URL" },
        { status: 400 }
      );
    }

    if (parsed.waypoints.length < 2) {
      return NextResponse.json(
        { error: "Need at least an origin and destination" },
        { status: 400 }
      );
    }

    // 2. Resolve addresses to coordinates
    const coordinates = await resolveWaypoints(parsed.waypoints);

    // 3. Get bicycle route from Google Directions API
    const route = await getRoute(coordinates, parsed.routeIndex);

    // 4. Generate GPX
    const gpx = generateGpx(route.coordinates);

    return NextResponse.json({
      gpx,
      stats: {
        distanceKm: Math.round(route.distanceMeters / 100) / 10,
        waypointCount: parsed.waypoints.length,
      },
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
