import { afterEach, describe, expect, it, vi } from "vitest";
import { GA_MEASUREMENT_ID, trackEvent } from "../analytics";
import { classifyConversionError } from "../conversion-error";

function stubWindow(hostname: string, gtag?: ReturnType<typeof vi.fn>) {
  vi.stubGlobal("window", { location: { hostname }, gtag });
}

describe("trackEvent", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not call gtag outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const gtag = vi.fn();
    stubWindow("maptogpx.com", gtag);

    trackEvent("gpx_download");

    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not call gtag on a host that isn't allowed", () => {
    vi.stubEnv("NODE_ENV", "production");
    const gtag = vi.fn();
    stubWindow("example.com", gtag);

    trackEvent("gpx_download");

    expect(gtag).not.toHaveBeenCalled();
  });

  it("sends the event with params, send_to, and beacon transport on an allowed host", () => {
    vi.stubEnv("NODE_ENV", "production");
    const gtag = vi.fn();
    stubWindow("maptogpx.com", gtag);

    trackEvent("donate_click", { site: "maptogpx", link: "paypal" });

    expect(gtag).toHaveBeenCalledWith("event", "donate_click", {
      send_to: GA_MEASUREMENT_ID,
      transport_type: "beacon",
      site: "maptogpx",
      link: "paypal",
    });
  });

  it("does not throw when gtag is undefined", () => {
    vi.stubEnv("NODE_ENV", "production");
    stubWindow("maptogpx.com", undefined);

    expect(() => trackEvent("feedback_submit")).not.toThrow();
  });

  it("sends conversion_error with only the classified reason, never the raw status/message/url", () => {
    vi.stubEnv("NODE_ENV", "production");
    const gtag = vi.fn();
    stubWindow("maptogpx.com", gtag);

    const reason = classifyConversionError({
      status: 400,
      message: 'Could not find location: "123 Secret Ave, Hidden City"',
    });
    trackEvent("conversion_error", { reason });

    expect(gtag).toHaveBeenCalledWith("event", "conversion_error", {
      send_to: GA_MEASUREMENT_ID,
      transport_type: "beacon",
      reason: "not_found",
    });
    const sentParams = gtag.mock.calls[0][2];
    expect(Object.keys(sentParams).sort()).toEqual(
      ["reason", "send_to", "transport_type"].sort()
    );
  });
});
