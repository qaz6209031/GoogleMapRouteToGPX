import { describe, expect, it } from "vitest";
import { assignViasToNearestLeg, parseGoogleMapsUrl } from "../url-parser";
import { UserInputError } from "../errors";
import type { RoutePoint } from "../types";

/**
 * Builds a Google Maps `data=` token string from a small declarative tree,
 * so tests don't have to hand-count "!<field><type><value>" sizes.
 */
interface TestNode {
  field: number;
  type: string;
  value?: string;
  children?: TestNode[];
}

function encodeNode(node: TestNode): string[] {
  if (node.type === "m") {
    const childTokens = (node.children ?? []).flatMap(encodeNode);
    return [`${node.field}m${childTokens.length}`, ...childTokens];
  }
  return [`${node.field}${node.type}${node.value ?? ""}`];
}

function buildDataParam(nodes: TestNode[]): string {
  return "!" + nodes.flatMap(encodeNode).join("!");
}

function coordinateNode(field: number, lat: number, lng: number): TestNode {
  return {
    field,
    type: "m",
    children: [
      { field: 1, type: "d", value: String(lng) },
      { field: 2, type: "d", value: String(lat) },
    ],
  };
}

function viaNode(lat: number, lng: number, id: string): TestNode {
  return {
    field: 3,
    type: "m",
    children: [coordinateNode(1, lat, lng), { field: 3, type: "s", value: id }],
  };
}

function waypointNode(opts: { coordinate?: [number, number]; vias?: [number, number, string][] }): TestNode {
  const children: TestNode[] = [];
  if (opts.coordinate) children.push(coordinateNode(2, opts.coordinate[0], opts.coordinate[1]));
  for (const [lat, lng, id] of opts.vias ?? []) children.push(viaNode(lat, lng, id));
  return { field: 1, type: "m", children };
}

function directionsDataParam(opts: {
  waypoints: ReturnType<typeof waypointNode>[];
  avoid?: { highways?: boolean; tolls?: boolean; ferries?: boolean };
  mode?: string;
  routeIndex?: number;
}): string {
  const directionsChildren: TestNode[] = [...opts.waypoints];
  if (opts.avoid) {
    const avoidChildren: TestNode[] = [];
    if (opts.avoid.highways) avoidChildren.push({ field: 1, type: "b", value: "1" });
    if (opts.avoid.tolls) avoidChildren.push({ field: 2, type: "b", value: "1" });
    if (opts.avoid.ferries) avoidChildren.push({ field: 3, type: "b", value: "1" });
    directionsChildren.push({ field: 2, type: "m", children: avoidChildren });
  }
  if (opts.mode !== undefined) directionsChildren.push({ field: 3, type: "e", value: opts.mode });
  if (opts.routeIndex !== undefined) {
    directionsChildren.push({ field: 5, type: "i", value: String(opts.routeIndex) });
  }
  const directions: TestNode = { field: 4, type: "m", children: directionsChildren };
  const outer: TestNode = { field: 4, type: "m", children: [directions] };
  return buildDataParam([outer]);
}

describe("parseGoogleMapsUrl", () => {
  it("parses api=1 origin/destination/waypoints", () => {
    const url =
      "https://www.google.com/maps/dir/?api=1&origin=47.6062,-122.3321&destination=47.6097,-122.3331&waypoints=47.61,-122.33|47.611,-122.331";
    const result = parseGoogleMapsUrl(url);
    expect(result.waypoints).toHaveLength(4);
    expect(result.waypoints[0].coordinate).toEqual({ lat: 47.6062, lng: -122.3321 });
    expect(result.waypoints[1].coordinate).toEqual({ lat: 47.61, lng: -122.33 });
    expect(result.waypoints[2].coordinate).toEqual({ lat: 47.611, lng: -122.331 });
    expect(result.waypoints[3].coordinate).toEqual({ lat: 47.6097, lng: -122.3331 });
  });

  it("decodes %25 in an origin name without double-decoding", () => {
    const url =
      "https://www.google.com/maps/dir/?api=1&origin=100%25+Pure&destination=47.6097,-122.3331";
    const result = parseGoogleMapsUrl(url);
    expect(result.waypoints[0].address).toBe("100% Pure");
  });

  it("parses path-based /maps/dir/A/B/@... URLs", () => {
    const url = "https://www.google.com/maps/dir/Seattle,+WA/Portland,+OR/@45.5,-122.6,10z";
    const result = parseGoogleMapsUrl(url);
    expect(result.waypoints).toHaveLength(2);
    expect(result.waypoints[0].address).toBe("Seattle, WA");
    expect(result.waypoints[1].address).toBe("Portland, OR");
  });

  it("keeps a %2F-encoded name as a single path segment", () => {
    const url = "https://www.google.com/maps/dir/AC%2FDC+Bar,+SF/Golden+Gate+Park/@37.7,-122.4,12z";
    const result = parseGoogleMapsUrl(url);
    expect(result.waypoints).toHaveLength(2);
    expect(result.waypoints[0].address).toBe("AC/DC Bar, SF");
  });

  it("parses saddr/daddr with +to: separators", () => {
    const url = "https://www.google.com/maps?saddr=Seattle,+WA&daddr=Tacoma,+WA+to:Olympia,+WA";
    const result = parseGoogleMapsUrl(url);
    expect(result.waypoints).toHaveLength(3);
    expect(result.waypoints[0].address).toBe("Seattle, WA");
    expect(result.waypoints[1].address).toBe("Tacoma, WA");
    expect(result.waypoints[2].address).toBe("Olympia, WA");
  });

  it("reads travelmode from the query param, overriding !3e", () => {
    const url =
      "https://www.google.com/maps/dir/?api=1&origin=47.6,-122.3&destination=47.7,-122.4&travelmode=walking";
    const result = parseGoogleMapsUrl(url);
    expect(result.travelMode).toBe("walking");
  });

  it("reads travel mode and avoid options from the data= !3e / !2m encoding", () => {
    const dataParam = directionsDataParam({
      waypoints: [waypointNode({}), waypointNode({})],
      avoid: { highways: true, tolls: true },
      mode: "1",
    });
    const url = `https://www.google.com/maps/dir/47.6,-122.3/47.7,-122.4/data=${dataParam}`;
    const result = parseGoogleMapsUrl(url);
    expect(result.travelMode).toBe("bicycling");
    expect(result.avoid.sort()).toEqual(["highways", "tolls"]);
  });

  it("assigns a named-place coordinate from data= to an address segment", () => {
    const dataParam = directionsDataParam({
      waypoints: [waypointNode({ coordinate: [47.61, -122.33] }), waypointNode({})],
    });
    const url = `https://www.google.com/maps/dir/Starbucks/47.7,-122.4/data=${dataParam}`;
    const result = parseGoogleMapsUrl(url);
    expect(result.waypoints[0].label).toBe("Starbucks");
    expect(result.waypoints[0].coordinate).toEqual({ lat: 47.61, lng: -122.33 });
    expect(result.waypoints[1].coordinate).toEqual({ lat: 47.7, lng: -122.4 });
  });

  it("places an aligned dragged via point on the leg it starts", () => {
    const dataParam = directionsDataParam({
      waypoints: [waypointNode({ vias: [[47.65, -122.35, "0x0:0x0"]] }), waypointNode({})],
    });
    const url = `https://www.google.com/maps/dir/47.6,-122.3/47.7,-122.4/data=${dataParam}`;
    const result = parseGoogleMapsUrl(url);
    expect(result.waypoints).toHaveLength(3);
    expect(result.waypoints[1].via).toBe(true);
    expect(result.waypoints[1].coordinate).toEqual({ lat: 47.65, lng: -122.35 });
    expect(result.pendingVias).toBeUndefined();
  });

  it("returns unassigned vias when data= waypoint blocks don't align with path segments", () => {
    const dataParam = directionsDataParam({
      waypoints: [
        waypointNode({
          vias: [
            [3, 2, "0x0:0x0"],
            [14, 15, "0x1:0x1"],
          ],
        }),
      ],
    });
    const url = `https://www.google.com/maps/dir/0,0/10,10/20,20/data=${dataParam}`;
    const result = parseGoogleMapsUrl(url);
    expect(result.waypoints).toHaveLength(3);
    expect(result.pendingVias).toHaveLength(2);
  });

  it("throws UserInputError for an unparseable URL", () => {
    expect(() => parseGoogleMapsUrl("https://www.google.com/")).toThrow(UserInputError);
  });

  it("throws UserInputError (not TypeError) for a malformed URL string", () => {
    expect(() => parseGoogleMapsUrl("not a url at all")).toThrow(UserInputError);
    expect(() => parseGoogleMapsUrl("not a url at all")).toThrow(/Could not parse Google Maps URL/);
  });

  it("throws UserInputError instead of crashing on a deeply nested data= segment", () => {
    const tokens = "!" + Array(20_000).fill("4m1").join("!");
    const url = `https://www.google.com/maps/dir/A/B/data=${tokens}`;
    expect(() => parseGoogleMapsUrl(url)).toThrow(UserInputError);
    expect(() => parseGoogleMapsUrl(url)).toThrow(/too complex/i);
  });
});

describe("assignViasToNearestLeg", () => {
  it("assigns each via to the leg whose straight segment it's closest to, ordered by projection", () => {
    const stops: RoutePoint[] = [
      { lat: 0, lng: 0 },
      { lat: 10, lng: 10 },
      { lat: 20, lng: 20 },
    ];
    const result = assignViasToNearestLeg(stops, [
      { lat: 3, lng: 2 },
      { lat: 14, lng: 15 },
    ]);
    expect(result).toHaveLength(5);
    expect(result[1]).toEqual({ lat: 3, lng: 2, via: true });
    expect(result[2]).toEqual(stops[1]);
    expect(result[3]).toEqual({ lat: 14, lng: 15, via: true });
    expect(result[4]).toEqual(stops[2]);
  });

  it("returns stops unchanged when there are no vias", () => {
    const stops: RoutePoint[] = [{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }];
    expect(assignViasToNearestLeg(stops, [])).toBe(stops);
  });
});
