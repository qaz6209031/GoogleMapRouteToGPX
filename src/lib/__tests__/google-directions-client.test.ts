import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  MAX_INTERMEDIATE_WAYPOINTS,
  buildDirectionsCacheKey,
  getRoute,
  limitIntermediateWaypoints,
} from "../google-directions-client";
import { __resetCacheForTests } from "../route-cache";
import { UserInputError } from "../errors";
import type { RoutePoint } from "../types";

vi.mock("@vercel/functions", () => ({
  getCache: () => ({
    get: vi.fn(async () => null),
    set: vi.fn(async () => {}),
    delete: vi.fn(async () => {}),
    expireTag: vi.fn(async () => {}),
  }),
}));

function makePoints(count: number, via = false): RoutePoint[] {
  return Array.from({ length: count }, (_, i) => ({ lat: i, lng: i, via }));
}

// Canonical Google polyline sample, decodes to a couple of points.
const SAMPLE_POLYLINE = "_p~iF~ps|U_ulLnnqC_mqNvxq`@";

function fakeDirectionsResponse(overrides: Record<string, unknown> = {}) {
  return {
    status: "OK",
    routes: [
      {
        legs: [
          {
            distance: { value: 1000 },
            duration: { value: 100 },
            steps: [{ polyline: { points: SAMPLE_POLYLINE } }],
          },
        ],
      },
    ],
    ...overrides,
  };
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

describe("buildDirectionsCacheKey", () => {
  it("is stable across coordinates that only differ past the rounding precision", () => {
    const a = buildDirectionsCacheKey(
      [{ lat: 1.1234561, lng: 2.6543211 }, { lat: 3, lng: 4 }],
      "driving",
      ["tolls", "highways"],
      false
    );
    const b = buildDirectionsCacheKey(
      [{ lat: 1.1234564, lng: 2.6543214 }, { lat: 3, lng: 4 }],
      "driving",
      ["highways", "tolls"],
      false
    );
    expect(a).toBe(b);
  });

  it("differs when the travel mode differs", () => {
    const points = [{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }];
    const a = buildDirectionsCacheKey(points, "driving", [], false);
    const b = buildDirectionsCacheKey(points, "walking", [], false);
    expect(a).not.toBe(b);
  });

  it("differs when the waypoint order differs", () => {
    const a = buildDirectionsCacheKey([{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }], "driving", [], false);
    const b = buildDirectionsCacheKey([{ lat: 3, lng: 4 }, { lat: 1, lng: 2 }], "driving", [], false);
    expect(a).not.toBe(b);
  });

  it("differs when a point is a via vs. a stop", () => {
    const a = buildDirectionsCacheKey(
      [{ lat: 1, lng: 2 }, { lat: 3, lng: 4, via: true }, { lat: 5, lng: 6 }],
      "driving",
      [],
      false
    );
    const b = buildDirectionsCacheKey(
      [{ lat: 1, lng: 2 }, { lat: 3, lng: 4, via: false }, { lat: 5, lng: 6 }],
      "driving",
      [],
      false
    );
    expect(a).not.toBe(b);
  });

  it("differs when the alternatives flag differs", () => {
    const points = [{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }];
    const a = buildDirectionsCacheKey(points, "driving", [], false);
    const b = buildDirectionsCacheKey(points, "driving", [], true);
    expect(a).not.toBe(b);
  });

  it("is prefixed with the namespace and a version tag", () => {
    const key = buildDirectionsCacheKey([{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }], "driving", [], false);
    expect(key).toMatch(/^directions:v1:[0-9a-f]{64}$/);
  });
});

describe("getRoute caching", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    __resetCacheForTests();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => ({
      ok: true,
      statusText: "OK",
      json: async () => fakeDirectionsResponse(),
    }));
    vi.stubGlobal("fetch", fetchMock);
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
  });

  it("reuses the cached response for an identical route instead of calling the fetcher again", async () => {
    const points: RoutePoint[] = [{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }];

    const first = await getRoute(points, 0, "driving", []);
    expect(first.cacheStatus).toBe("MISS");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const second = await getRoute(points, 0, "driving", []);
    expect(second.cacheStatus).toBe("HIT");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(second.coordinates).toEqual(first.coordinates);
  });

  it("calls the fetcher again for a different travel mode on the same waypoints", async () => {
    const points: RoutePoint[] = [{ lat: 10, lng: 20 }, { lat: 30, lng: 40 }];

    await getRoute(points, 0, "driving", []);
    await getRoute(points, 0, "walking", []);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not cache an error response, so a retry hits the network again", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      statusText: "OK",
      json: async () => ({ status: "ZERO_RESULTS" }),
    });
    const points: RoutePoint[] = [{ lat: 50, lng: 60 }, { lat: 70, lng: 80 }];

    await expect(getRoute(points, 0, "driving", [])).rejects.toThrow(UserInputError);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const retry = await getRoute(points, 0, "driving", []);
    expect(retry.cacheStatus).toBe("MISS");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
