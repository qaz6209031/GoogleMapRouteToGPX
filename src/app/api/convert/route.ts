import { NextRequest, NextResponse } from "next/server";
import { assignViasToNearestLeg, parseGoogleMapsUrl, resolveWaypoints } from "@/lib/url-parser";
import { getRoute } from "@/lib/google-directions-client";
import { generateGpx } from "@/lib/gpx-generator";
import { isSameOriginRequest } from "@/lib/same-origin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { UserInputError } from "@/lib/errors";

const RATE_LIMIT_PER_MINUTE = 10;

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rate = checkRateLimit("convert", getClientIp(request), RATE_LIMIT_PER_MINUTE);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a moment." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { url } = body as { url?: unknown };

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A Google Maps URL is required" },
        { status: 400 }
      );
    }

    // 1. Parse the URL into waypoints
    const parsed = parseGoogleMapsUrl(url);

    if (parsed.waypoints.length < 2) {
      throw new UserInputError("Need at least an origin and destination");
    }

    // 2. Resolve addresses to coordinates
    let coordinates = await resolveWaypoints(parsed.waypoints);
    if (parsed.pendingVias?.length) {
      coordinates = assignViasToNearestLeg(coordinates, parsed.pendingVias);
    }

    // 3. Get route from Google Directions API
    const route = await getRoute(
      coordinates,
      parsed.routeIndex,
      parsed.travelMode,
      parsed.avoid
    );

    // 4. Generate GPX
    const gpx = generateGpx(route.coordinates);

    return NextResponse.json({
      gpx,
      stats: {
        distanceKm: Math.round(route.distanceMeters / 100) / 10,
        waypointCount: parsed.waypoints.filter((w) => !w.via).length,
        ...(route.warnings.length ? { warnings: route.warnings } : {}),
      },
    });
  } catch (e) {
    if (e instanceof UserInputError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error("Conversion failed", e);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
