import { NextRequest } from "next/server";

/**
 * True when the request's Origin header matches this site's origin.
 * Used to keep the API routes from being called by other sites or scripts.
 */
export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}
