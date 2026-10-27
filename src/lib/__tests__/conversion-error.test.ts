import { describe, expect, it } from "vitest";
import { classifyConversionError } from "../conversion-error";

describe("classifyConversionError", () => {
  it("classifies a missing status (network/fetch failure) as network", () => {
    expect(classifyConversionError({})).toBe("network");
    expect(classifyConversionError({ message: "Network error. Please try again." })).toBe(
      "network"
    );
  });

  it("classifies 502 (short-link resolution fetch failed) as network", () => {
    expect(classifyConversionError({ status: 502, message: "Failed to resolve URL" })).toBe(
      "network"
    );
  });

  it("classifies 429 as rate_limited regardless of message", () => {
    expect(
      classifyConversionError({ status: 429, message: "Too many requests. Please try again in a moment." })
    ).toBe("rate_limited");
  });

  it("classifies a geocoding miss as not_found", () => {
    expect(
      classifyConversionError({ status: 400, message: 'Could not find location: "123 Nowhere St"' })
    ).toBe("not_found");
  });

  it("classifies a routeless pair of points as not_found", () => {
    expect(
      classifyConversionError({
        status: 400,
        message: "Google could not find a route between these locations.",
      })
    ).toBe("not_found");
  });

  it("classifies other 400s as invalid_url", () => {
    expect(
      classifyConversionError({
        status: 400,
        message: "Could not parse Google Maps URL. Please paste a directions URL from Google Maps.",
      })
    ).toBe("invalid_url");
    expect(
      classifyConversionError({ status: 400, message: "This Google Maps link is too complex to convert" })
    ).toBe("invalid_url");
    expect(
      classifyConversionError({ status: 400, message: "This route has too many stops (30)." })
    ).toBe("invalid_url");
  });

  it("classifies everything else (403, 500, etc.) as unknown", () => {
    expect(classifyConversionError({ status: 500, message: "An unexpected error occurred." })).toBe(
      "unknown"
    );
    expect(classifyConversionError({ status: 403, message: "Forbidden" })).toBe("unknown");
  });
});
