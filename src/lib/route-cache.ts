import { getCache } from "@vercel/functions";
import { createHash } from "crypto";
import { CacheStatus } from "./types";

/**
 * Caches identical external API requests (Directions, geocoding) so repeat
 * conversions of the same route don't re-hit quota-limited services.
 *
 * Backed by Vercel's Runtime Cache (`getCache`, shared per region, free on
 * Hobby) with a small bounded LRU in front of it. The LRU serves
 * back-to-back requests on the same warm instance without a round trip and
 * keeps memory bounded in local dev, where Runtime Cache isn't configured
 * and `getCache` falls back to an unbounded process-local cache on its own.
 * Any Runtime Cache failure is swallowed — a cache miss or "BYPASS" just
 * means we fetch fresh, never a broken request.
 */

const CACHE_KEY_VERSION = "v1";
export const LOCAL_CACHE_MAX_ENTRIES = 200;

interface Envelope<T> {
  value: T;
  expiresAt: number;
}

/** Fixed-size LRU: evicts the least-recently-used entry once over capacity. */
class BoundedLru<V> {
  private readonly entries = new Map<string, V>();

  constructor(private readonly maxEntries: number) {}

  get(key: string): V | undefined {
    const value = this.entries.get(key);
    if (value === undefined) return undefined;
    // Refresh recency on read.
    this.entries.delete(key);
    this.entries.set(key, value);
    return value;
  }

  set(key: string, value: V): void {
    this.entries.delete(key);
    this.entries.set(key, value);
    if (this.entries.size > this.maxEntries) {
      const oldestKey = this.entries.keys().next().value;
      if (oldestKey !== undefined) this.entries.delete(oldestKey);
    }
  }

  clear(): void {
    this.entries.clear();
  }
}

let localCache = new BoundedLru<Envelope<unknown>>(LOCAL_CACHE_MAX_ENTRIES);

function isEnvelope(value: unknown): value is Envelope<unknown> {
  return typeof value === "object" && value !== null && "expiresAt" in value && "value" in value;
}

function unwrap<T>(raw: unknown): T | undefined {
  if (!isEnvelope(raw) || raw.expiresAt <= Date.now()) return undefined;
  return raw.value as T;
}

async function cacheGet<T>(key: string): Promise<T | undefined> {
  const local = unwrap<T>(localCache.get(key));
  if (local !== undefined) return local;

  const remote = await getCache().get(key);
  const remoteValue = unwrap<T>(remote);
  if (remoteValue !== undefined) {
    localCache.set(key, remote as Envelope<unknown>);
  }
  return remoteValue;
}

async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const envelope: Envelope<T> = { value, expiresAt: Date.now() + ttlSeconds * 1000 };
  localCache.set(key, envelope);
  await getCache().set(key, envelope, { ttl: ttlSeconds });
}

/** Build a stable, versioned, hashed cache key from arbitrary normalized parts. */
export function buildCacheKey(namespace: string, parts: unknown): string {
  const hash = createHash("sha256").update(JSON.stringify(parts)).digest("hex");
  return `${namespace}:${CACHE_KEY_VERSION}:${hash}`;
}

/**
 * Read-through cache around an async fetcher. On a hit, `fetcher` is never
 * called. On a miss, `fetcher` runs and its result is cached only if
 * `shouldCache` approves it (e.g. not for error responses). A failure
 * reading the cache falls back to calling `fetcher` directly and reports
 * "BYPASS" rather than failing the request; a failure writing the cache is
 * logged and otherwise ignored.
 */
export async function cachedFetch<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
  shouldCache: (value: T) => boolean = () => true
): Promise<{ value: T; status: CacheStatus }> {
  try {
    const cached = await cacheGet<T>(key);
    if (cached !== undefined) {
      console.log(`[cache] HIT ${key}`);
      return { value: cached, status: "HIT" };
    }
  } catch (err) {
    console.warn(`[cache] read failed for ${key}, bypassing`, err);
    const value = await fetcher();
    return { value, status: "BYPASS" };
  }

  const value = await fetcher();
  try {
    if (shouldCache(value)) {
      await cacheSet(key, value, ttlSeconds);
    }
  } catch (err) {
    console.warn(`[cache] write failed for ${key}`, err);
  }
  console.log(`[cache] MISS ${key}`);
  return { value, status: "MISS" };
}

/** Test-only: clear the local LRU so test cases don't leak into each other. */
export function __resetCacheForTests(): void {
  localCache = new BoundedLru<Envelope<unknown>>(LOCAL_CACHE_MAX_ENTRIES);
}
