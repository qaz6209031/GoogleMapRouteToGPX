import { describe, expect, it } from "vitest";
import { checkRateLimit, getClientIp } from "../rate-limit";

describe("checkRateLimit", () => {
  it("allows requests up to the limit then blocks with a retry-after", () => {
    const bucket = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(bucket, "1.2.3.4", 3).allowed).toBe(true);
    }
    const blocked = checkRateLimit(bucket, "1.2.3.4", 3);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", () => {
    const bucket = `test-${Math.random()}`;
    expect(checkRateLimit(bucket, "a", 1).allowed).toBe(true);
    expect(checkRateLimit(bucket, "a", 1).allowed).toBe(false);
    expect(checkRateLimit(bucket, "b", 1).allowed).toBe(true);
  });

  it("tracks separate buckets independently for the same key", () => {
    const key = `key-${Math.random()}`;
    expect(checkRateLimit("bucket-a", key, 1).allowed).toBe(true);
    expect(checkRateLimit("bucket-a", key, 1).allowed).toBe(false);
    expect(checkRateLimit("bucket-b", key, 1).allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("uses the first entry of x-forwarded-for", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip then unknown", () => {
    const withRealIp = new Request("https://example.com", {
      headers: { "x-real-ip": "203.0.113.9" },
    });
    expect(getClientIp(withRealIp)).toBe("203.0.113.9");

    const bare = new Request("https://example.com");
    expect(getClientIp(bare)).toBe("unknown");
  });
});
