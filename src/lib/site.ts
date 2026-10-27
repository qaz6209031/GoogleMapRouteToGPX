export const SITE_URL = "https://www.maptogpx.com";
export const SITE_NAME = "MapsToGPX";

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

/**
 * All publicly indexable routes, consumed by sitemap.ts. Later PRs append
 * /guides/[device] and locale-prefixed routes here instead of touching
 * sitemap.ts directly.
 */
export const PUBLIC_ROUTES: SiteRoute[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides", changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides/bryton", changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides/wahoo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides/garmin", changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides/karoo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides/coros", changeFrequency: "monthly", priority: 0.6 },
];
