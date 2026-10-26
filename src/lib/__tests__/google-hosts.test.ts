import { describe, expect, it } from "vitest";
import {
  isGoogleDomainHost,
  isGoogleMapsPath,
  isGoogleMapsUrl,
  isMapsGoogleHost,
  isShortGoogleMapsHost,
  isShortUrl,
} from "../google-hosts";

describe("isGoogleDomainHost", () => {
  it("accepts google.com and its common subdomains", () => {
    expect(isGoogleDomainHost("google.com")).toBe(true);
    expect(isGoogleDomainHost("www.google.com")).toBe(true);
    expect(isGoogleDomainHost("maps.google.com")).toBe(true);
  });

  it("accepts google country domains", () => {
    expect(isGoogleDomainHost("google.co.uk")).toBe(true);
    expect(isGoogleDomainHost("www.google.co.uk")).toBe(true);
    expect(isGoogleDomainHost("google.com.tw")).toBe(true);
    expect(isGoogleDomainHost("maps.google.com.au")).toBe(true);
  });

  it("rejects lookalike hosts", () => {
    expect(isGoogleDomainHost("evil-google.com")).toBe(false);
    expect(isGoogleDomainHost("google.com.evil.com")).toBe(false);
    expect(isGoogleDomainHost("notgoogle.com")).toBe(false);
    expect(isGoogleDomainHost("accounts.google.com")).toBe(false);
  });
});

describe("isMapsGoogleHost", () => {
  it("matches only maps.google.* hosts", () => {
    expect(isMapsGoogleHost("maps.google.com")).toBe(true);
    expect(isMapsGoogleHost("maps.google.co.uk")).toBe(true);
    expect(isMapsGoogleHost("www.google.com")).toBe(false);
    expect(isMapsGoogleHost("google.com")).toBe(false);
  });
});

describe("isShortGoogleMapsHost", () => {
  it("matches exact short-link hosts only", () => {
    expect(isShortGoogleMapsHost("goo.gl")).toBe(true);
    expect(isShortGoogleMapsHost("maps.app.goo.gl")).toBe(true);
    expect(isShortGoogleMapsHost("notgoo.gl")).toBe(false);
    expect(isShortGoogleMapsHost("goo.gl.evil.com")).toBe(false);
  });
});

describe("isGoogleMapsPath", () => {
  it("requires the path to start with /maps", () => {
    expect(isGoogleMapsPath("/maps/dir/A/B")).toBe(true);
    expect(isGoogleMapsPath("/search")).toBe(false);
  });
});

describe("isGoogleMapsUrl", () => {
  it("accepts long and short Google Maps URLs", () => {
    expect(isGoogleMapsUrl("https://www.google.com/maps/dir/A/B")).toBe(true);
    expect(isGoogleMapsUrl("https://maps.app.goo.gl/abc123")).toBe(true);
    expect(isGoogleMapsUrl("https://goo.gl/abc123")).toBe(true);
  });

  it("rejects non-Google URLs and non-http(s) schemes", () => {
    expect(isGoogleMapsUrl("https://evil.com/maps/dir/A/B")).toBe(false);
    expect(isGoogleMapsUrl("javascript:alert(1)")).toBe(false);
    expect(isGoogleMapsUrl("not a url")).toBe(false);
  });
});

describe("isShortUrl", () => {
  it("is true only for short-link hosts", () => {
    expect(isShortUrl("https://goo.gl/abc123")).toBe(true);
    expect(isShortUrl("https://www.google.com/maps/dir/A/B")).toBe(false);
  });
});
