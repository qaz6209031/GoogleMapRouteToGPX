import { describe, expect, it } from "vitest";
import {
  MAX_INTERMEDIATE_WAYPOINTS,
  limitIntermediateWaypoints,
} from "../google-directions-client";
import { UserInputError } from "../errors";
import type { RoutePoint } from "../types";

function makePoints(count: number, via = false): RoutePoint[] {
  return Array.from({ length: count }, (_, i) => ({ lat: i, lng: i, via }));
}

describe("limitIntermediateWaypoints", () => {
  it("returns the list unchanged when within the limit", () => {
    const points = makePoints(5);
    expect(limitIntermediateWaypoints(points)).toBe(points);
  });

  it("throws UserInputError when stops alone exceed the limit", () => {
    const points = makePoints(MAX_INTERMEDIATE_WAYPOINTS + 1);
    expect(() => limitIntermediateWaypoints(points)).toThrow(UserInputError);
  });

  it("downsamples vias evenly to fit, keeping every stop", () => {
    const stops = makePoints(5, false);
    const vias = makePoints(30, true).map((v) => ({ ...v, lat: v.lat + 100 }));
    const intermediates = [...stops, ...vias];

    const result = limitIntermediateWaypoints(intermediates);

    expect(result.length).toBe(MAX_INTERMEDIATE_WAYPOINTS);
    const keptStops = result.filter((w) => !w.via);
    const keptVias = result.filter((w) => w.via);
    expect(keptStops).toHaveLength(5);
    expect(keptVias).toHaveLength(MAX_INTERMEDIATE_WAYPOINTS - 5);
    for (const stop of stops) {
      expect(keptStops).toContainEqual(stop);
    }
  });
});
