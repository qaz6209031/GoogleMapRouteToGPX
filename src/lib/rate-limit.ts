/**
 * Best-effort in-memory rate limiter, keyed per named bucket + client key.
 * State lives in process memory only — on Vercel this means the limit is
 * per lambda instance, not global, so it's a soft deterrent rather than a
 * hard guarantee. There's no shared KV/Redis configured for this project.
 */

interface WindowState {
  count: number;
  resetAt: number;
}

const PRUNE_INTERVAL_MS = 5 * 60_000;

const buckets = new Map<string, Map<string, WindowState>>();
let lastPrune = Date.now();

function pruneExpired(now: number) {
  for (const [bucketName, states] of buckets) {
    for (const [key, state] of states) {
      if (state.resetAt <= now) states.delete(key);
    }
    if (states.size === 0) buckets.delete(bucketName);
  }
  lastPrune = now;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/**
 * Fixed-window rate limit check. `bucketName` separates independent limits
 * (e.g. one per API route) so they don't share a counter.
 */
export function checkRateLimit(
  bucketName: string,
  key: string,
  limit: number,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now();
  if (now - lastPrune > PRUNE_INTERVAL_MS) pruneExpired(now);

  let states = buckets.get(bucketName);
  if (!states) {
    states = new Map();
    buckets.set(bucketName, states);
  }

  let state = states.get(key);
  if (!state || state.resetAt <= now) {
    state = { count: 0, resetAt: now + windowMs };
    states.set(key, state);
  }

  state.count++;
  if (state.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((state.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client IP from proxy headers, falling back to "unknown". */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
