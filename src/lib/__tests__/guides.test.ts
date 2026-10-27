import { describe, expect, it } from "vitest";
import { DEVICE_GUIDES, GUIDE_SLUGS } from "../guides";
import { PUBLIC_ROUTES } from "../site";

describe("DEVICE_GUIDES", () => {
  it("has at least one source per guide", () => {
    for (const guide of DEVICE_GUIDES) {
      expect(guide.sources.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("has unique slugs", () => {
    expect(GUIDE_SLUGS.length).toBe(new Set(GUIDE_SLUGS).size);
  });

  it("registers every guide slug in PUBLIC_ROUTES", () => {
    const publicPaths = new Set(PUBLIC_ROUTES.map((route) => route.path));
    for (const slug of GUIDE_SLUGS) {
      expect(publicPaths.has(`/guides/${slug}`)).toBe(true);
    }
  });
});
