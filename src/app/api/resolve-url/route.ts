import { NextRequest, NextResponse } from "next/server";

/**
 * Resolve short Google Maps URLs (maps.app.goo.gl/XXX) by following redirects.
 * This must be done server-side because browsers block cross-origin redirects.
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Follow redirects manually to get the final URL
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GoogleMapsToGPX/1.0)",
      },
    });

    const finalUrl = res.url;

    if (!finalUrl.includes("google.com/maps") && !finalUrl.includes("maps.google.com")) {
      return NextResponse.json(
        { error: "URL did not resolve to a Google Maps page" },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: finalUrl });
  } catch {
    return NextResponse.json(
      { error: "Failed to resolve URL" },
      { status: 500 }
    );
  }
}
