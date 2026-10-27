import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/locales";
import { LocalizablePath, localizedPath } from "@/i18n/paths";

export const SITE_URL = "https://www.maptogpx.com";
export const SITE_NAME = "MapsToGPX";

/** Explicit because the shared image lives outside the locale root layouts. */
export const SOCIAL_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Google Maps Route to GPX File",
};

/** Shared across every root layout (one per locale route group). */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: { images: [SOCIAL_IMAGE] },
  twitter: { card: "summary_large_image", images: [SOCIAL_IMAGE] },
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
};

export interface SiteRoute {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  /** Per-route hreflang alternates, keyed by locale, populated once locale routes exist. */
  languages?: Record<string, string>;
}

/** Absolute hreflang map (incl. x-default) for a localizable page, for sitemap.ts. */
function hreflangFor(path: LocalizablePath): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = `${SITE_URL}${localizedPath(locale, path)}`;
  }
  languages["x-default"] = `${SITE_URL}${localizedPath(DEFAULT_LOCALE, path)}`;
  return languages;
}

/**
 * All publicly indexable routes, consumed by sitemap.ts.
 */
export const PUBLIC_ROUTES: SiteRoute[] = [
  { path: "/", changeFrequency: "monthly", priority: 1, languages: hreflangFor("/") },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6, languages: hreflangFor("/faq") },
  { path: "/id", changeFrequency: "monthly", priority: 1, languages: hreflangFor("/") },
  { path: "/es", changeFrequency: "monthly", priority: 1, languages: hreflangFor("/") },
  { path: "/ja", changeFrequency: "monthly", priority: 1, languages: hreflangFor("/") },
  { path: "/id/faq", changeFrequency: "monthly", priority: 0.6, languages: hreflangFor("/faq") },
  { path: "/es/faq", changeFrequency: "monthly", priority: 0.6, languages: hreflangFor("/faq") },
  { path: "/ja/faq", changeFrequency: "monthly", priority: 0.6, languages: hreflangFor("/faq") },
];
