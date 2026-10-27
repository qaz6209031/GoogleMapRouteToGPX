export const GA_MEASUREMENT_ID = "G-E4P5HTG25D";
export const ANALYTICS_HOSTS = ["maptogpx.com", "www.maptogpx.com"];

type AnalyticsEvent =
  | "route_conversion"
  | "gpx_download"
  | "feedback_submit"
  | "donate_click"
  | "conversion_error";

// Params must stay short, static strings (e.g. a site or link name) — never URLs or coordinates.
type AnalyticsParams = Record<string, string>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      event: AnalyticsEvent,
      parameters: { send_to: string; transport_type: "beacon" } & AnalyticsParams,
    ) => void;
  }
}

// Only send event names and short static param strings; route URLs, coordinates, and errors stay out of analytics.
export function trackEvent(event: AnalyticsEvent, params?: AnalyticsParams) {
  if (
    process.env.NODE_ENV !== "production" ||
    typeof window === "undefined" ||
    !ANALYTICS_HOSTS.includes(window.location.hostname)
  ) {
    return;
  }

  window.gtag?.("event", event, {
    send_to: GA_MEASUREMENT_ID,
    transport_type: "beacon",
    ...params,
  });
}
