/**
 * Client-safe helpers for recognizing Google Maps URLs. No server-only
 * imports here — this is shared between ConverterForm (browser) and the
 * API routes (server) so the hostname rules stay in one place.
 */

const SHORT_HOSTS = new Set(["goo.gl", "maps.app.goo.gl"]);

// Matches google.com, www.google.com, maps.google.com, and country domains
// like google.co.uk, www.google.co.uk, google.com.tw, maps.google.com.au.
// Anchored so lookalikes (evil-google.com, google.com.evil.com) don't match.
const GOOGLE_DOMAIN_REGEX = /^(maps\.|www\.)?google\.(com|[a-z]{2})(\.[a-z]{2})?$/i;

const MAPS_GOOGLE_HOST_REGEX = /^maps\.google\.(com|[a-z]{2})(\.[a-z]{2})?$/i;

function isHttpUrl(u: URL): boolean {
  return u.protocol === "https:" || u.protocol === "http:";
}

export function isShortGoogleMapsHost(hostname: string): boolean {
  return SHORT_HOSTS.has(hostname.toLowerCase());
}

export function isGoogleDomainHost(hostname: string): boolean {
  return GOOGLE_DOMAIN_REGEX.test(hostname.toLowerCase());
}

export function isMapsGoogleHost(hostname: string): boolean {
  return MAPS_GOOGLE_HOST_REGEX.test(hostname.toLowerCase());
}

export function isGoogleMapsPath(pathname: string): boolean {
  return pathname.startsWith("/maps");
}

/** True for any http(s) URL whose host is a Google Maps domain or short-link host. */
export function isGoogleMapsUrl(urlString: string): boolean {
  try {
    const u = new URL(urlString);
    return isHttpUrl(u) && (isGoogleDomainHost(u.hostname) || isShortGoogleMapsHost(u.hostname));
  } catch {
    return false;
  }
}

/** True for a short-link URL (goo.gl / maps.app.goo.gl) that needs server-side resolution. */
export function isShortUrl(urlString: string): boolean {
  try {
    const u = new URL(urlString);
    return isHttpUrl(u) && isShortGoogleMapsHost(u.hostname);
  } catch {
    return false;
  }
}
