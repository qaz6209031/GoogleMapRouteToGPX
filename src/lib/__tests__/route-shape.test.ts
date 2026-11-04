import { describe, expect, it } from "vitest";
import { generateGpx } from "@/lib/gpx-generator";
import { parseGpxTrack, projectRoute } from "@/lib/route-shape";

describe("parseGpxTrack", () => {
  it("reads track points from generated GPX", () => {
    const gpx = generateGpx([
      { lat: 51.5, lng: -0.12 },
      { lat: 51.51, lng: -0.1 },
    ]);
    expect(parseGpxTrack(gpx)).toEqual([
      { lat: 51.5, lon: -0.12 },
      { lat: 51.51, lon: -0.1 },
    ]);
  });

  it("returns an empty list for GPX without track points", () => {
    expect(parseGpxTrack("<gpx></gpx>")).toEqual([]);
  });
});

describe("projectRoute", () => {
  const track = [
    { lat: 0, lon: 0 },
    { lat: 0, lon: 0.5 },
    { lat: 0.5, lon: 0.5 },
  ];

  it("fits the route inside the padded box, north up", () => {
    const shape = projectRoute(track, 800, 600, 40)!;
    expect(shape).not.toBeNull();
    for (const p of [shape.start, shape.end, ...shape.ticks]) {
      expect(p.x).toBeGreaterThanOrEqual(40 - 0.01);
      expect(p.x).toBeLessThanOrEqual(760 + 0.01);
      expect(p.y).toBeGreaterThanOrEqual(40 - 0.01);
      expect(p.y).toBeLessThanOrEqual(560 + 0.01);
    }
    // The end is further north than the start, so it sits higher on screen.
    expect(shape.end.y).toBeLessThan(shape.start.y);
  });

  it("keeps ticks at a round interval and at most twelve of them", () => {
    const shape = projectRoute(track, 800, 600, 40)!;
    // ~111 km of route: 10 km ticks.
    expect(shape.tickKm).toBe(10);
    expect(shape.ticks.length).toBeLessThanOrEqual(12);
    expect(shape.ticks.length).toBeGreaterThan(0);
  });

  it("gives a round scale bar no wider than a quarter of the box", () => {
    const shape = projectRoute(track, 800, 600, 40)!;
    expect([0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100]).toContain(shape.scaleKm);
    expect(shape.scaleWidth).toBeLessThanOrEqual((800 - 80) / 4 + 0.01);
  });

  it("returns null for a single point or a zero-length route", () => {
    expect(projectRoute([{ lat: 1, lon: 1 }], 800, 600, 40)).toBeNull();
    expect(projectRoute([{ lat: 1, lon: 1 }, { lat: 1, lon: 1 }], 800, 600, 40)).toBeNull();
  });
});
