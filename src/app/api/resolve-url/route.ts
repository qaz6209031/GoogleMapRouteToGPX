import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/same-origin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  isGoogleDomainHost,
  isGoogleMapsPath,
  isMapsGoogleHost,
  isShortGoogleMapsHost,
} from "@/lib/google-hosts";

const RATE_LIMIT_PER_MINUTE = 10;
const FETCH_TIMEOUT_MS = 5000;

function isHttpUrl(u: URL): boolean {
  return u.protocol === "https:" || u.protocol === "http:";
}

/** Only ever fetch known Google Maps short-link hosts. */
function isAllowedShortUrl(urlString: string): boolean {
  try {
    const u = new URL(urlString);
    return isHttpUrl(u) && isShortGoogleMapsHost(u.hostname);
  } catch {
    return false;
  }
}

/** The redirect must land on an actual Google Maps page, not just a google.* host. */
function isValidResolvedMapsUrl(urlString: string): boolean {
  try {
    const u = new URL(urlString);
    if (!isHttpUrl(u) || !isGoogleDomainHost(u.hostname)) return false;
    return isGoogleMapsPath(u.pathname) || isMapsGoogleHost(u.hostname);
  } catch {
    return false;
  }
}

/**
 * Resolve short Google Maps URLs (goo.gl/XXX, maps.app.goo.gl/XXX) by
 * following redirects. This must be done server-side because browsers
 * block cross-origin redirects.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rate = checkRateLimit("resolve-url", getClientIp(request), RATE_LIMIT_PER_MINUTE);
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
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!isAllowedShortUrl(url)) {
      return NextResponse.json(
        { error: "Please provide a goo.gl or maps.app.goo.gl short link" },
        { status: 400 }
      );
    }

    let res: Response;
    try {
      res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; GoogleMapsToGPX/1.0)",
        },
      });
    } catch {
      return NextResponse.json({ error: "Failed to resolve URL" }, { status: 502 });
    }

    const finalUrl = res.url;

    if (!isValidResolvedMapsUrl(finalUrl)) {
      return NextResponse.json(
        { error: "URL did not resolve to a Google Maps page" },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: finalUrl });
  } catch {
    return NextResponse.json({ error: "Failed to resolve URL" }, { status: 500 });
  }
}
