import { beforeEach, describe, expect, it, vi } from "vitest";

const remoteStore = new Map<string, unknown>();
const remoteGet = vi.fn(async (key: string) => remoteStore.get(key) ?? null);
const remoteSet = vi.fn(async (key: string, value: unknown) => {
  remoteStore.set(key, value);
});

vi.mock("@vercel/functions", () => ({
  getCache: () => ({
    get: remoteGet,
    set: remoteSet,
    delete: vi.fn(async () => {}),
    expireTag: vi.fn(async () => {}),
  }),
}));

import { buildCacheKey, cachedFetch, LOCAL_CACHE_MAX_ENTRIES, __resetCacheForTests } from "../route-cache";

beforeEach(() => {
  remoteStore.clear();
  remoteGet.mockClear();
  remoteSet.mockClear();
  remoteGet.mockImplementation(async (key: string) => remoteStore.get(key) ?? null);
  remoteSet.mockImplementation(async (key: string, value: unknown) => {
    remoteStore.set(key, value);
  });
  __resetCacheForTests();
  vi.useRealTimers();
});

describe("buildCacheKey", () => {
  it("is stable for identical parts", () => {
    expect(buildCacheKey("ns", { a: 1, b: [1, 2] })).toBe(buildCacheKey("ns", { a: 1, b: [1, 2] }));
  });

  it("differs when the parts or the namespace differ", () => {
    expect(buildCacheKey("ns", { a: 1 })).not.toBe(buildCacheKey("ns", { a: 2 }));
    expect(buildCacheKey("ns1", { a: 1 })).not.toBe(buildCacheKey("ns2", { a: 1 }));
  });

  it("is prefixed with a version tag", () => {
    expect(buildCacheKey("ns", { a: 1 })).toMatch(/^ns:v1:[0-9a-f]{64}$/);
  });
});

describe("cachedFetch", () => {
  it("calls the fetcher once and reuses the cached value on the next call", async () => {
    const fetcher = vi.fn(async () => "value");
    const key = `key-${Math.random()}`;

    const first = await cachedFetch(key, 60, fetcher);
    expect(first).toEqual({ value: "value", status: "MISS" });

    const second = await cachedFetch(key, 60, fetcher);
    expect(second).toEqual({ value: "value", status: "HIT" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("does not cache a value rejected by shouldCache", async () => {
    const fetcher = vi.fn(async () => "value");
    const key = `key-${Math.random()}`;

    await cachedFetch(key, 60, fetcher, () => false);
    const second = await cachedFetch(key, 60, fetcher, () => false);

    expect(second.status).toBe("MISS");
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("propagates fetcher errors without caching them", async () => {
    const key = `key-${Math.random()}`;
    const failing = vi.fn(async () => {
      throw new Error("boom");
    });

    await expect(cachedFetch(key, 60, failing)).rejects.toThrow("boom");

    const succeeding = vi.fn(async () => "value");
    const result = await cachedFetch(key, 60, succeeding);
    expect(result).toEqual({ value: "value", status: "MISS" });
    expect(succeeding).toHaveBeenCalledTimes(1);
  });

  it("expires entries once the TTL elapses", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(async () => "value");
    const key = `key-${Math.random()}`;

    await cachedFetch(key, 1, fetcher);
    vi.advanceTimersByTime(1500);

    const result = await cachedFetch(key, 1, fetcher);
    expect(result.status).toBe("MISS");
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("bypasses the cache (without failing the request) when reading it throws", async () => {
    remoteGet.mockRejectedValueOnce(new Error("cache down"));
    const fetcher = vi.fn(async () => "value");
    const key = `key-${Math.random()}`;

    const result = await cachedFetch(key, 60, fetcher);
    expect(result).toEqual({ value: "value", status: "BYPASS" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("still succeeds (without failing the request) when writing the cache throws", async () => {
    remoteSet.mockRejectedValueOnce(new Error("cache down"));
    const fetcher = vi.fn(async () => "value");
    const key = `key-${Math.random()}`;

    const result = await cachedFetch(key, 60, fetcher);
    expect(result).toEqual({ value: "value", status: "MISS" });
  });

  it("evicts the least-recently-used local entry once the bound is exceeded", async () => {
    remoteGet.mockImplementation(async () => null); // force reliance on the local LRU only
    const fetcher = vi.fn(async (key: string) => key);

    for (let i = 0; i < LOCAL_CACHE_MAX_ENTRIES + 1; i++) {
      const key = `lru-${i}`;
      await cachedFetch(key, 60, () => fetcher(key));
    }

    // The oldest entry should have been evicted: fetching it again is a MISS.
    fetcher.mockClear();
    const oldest = await cachedFetch("lru-0", 60, () => fetcher("lru-0"));
    expect(oldest.status).toBe("MISS");
    expect(fetcher).toHaveBeenCalledTimes(1);

    // The most recently inserted entry should still be cached.
    fetcher.mockClear();
    const newestKey = `lru-${LOCAL_CACHE_MAX_ENTRIES}`;
    const newest = await cachedFetch(newestKey, 60, () => fetcher(newestKey));
    expect(newest.status).toBe("HIT");
    expect(fetcher).toHaveBeenCalledTimes(0);
  });
});
