export const GA_MEASUREMENT_ID = "G-E4P5HTG25D";
export const ANALYTICS_HOSTS = ["maptogpx.com", "www.maptogpx.com"];

type AnalyticsEvent = "route_conversion" | "gpx_download" | "feedback_submit";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      event: AnalyticsEvent,
      parameters: { send_to: string },
    ) => void;
  }
}

// Only send event names; route URLs, coordinates, and errors stay out of analytics.
export function trackEvent(event: AnalyticsEvent) {
  if (
    process.env.NODE_ENV !== "production" ||
    typeof window === "undefined" ||
    !ANALYTICS_HOSTS.includes(window.location.hostname)
  ) {
    return;
  }

  window.gtag?.("event", event, { send_to: GA_MEASUREMENT_ID });
}
