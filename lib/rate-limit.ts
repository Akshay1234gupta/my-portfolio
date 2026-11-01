/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * NOTE: on serverless platforms (Vercel) each instance has its own memory, so this is a
 * best-effort speed bump, not a hard guarantee. For strict limits swap the body of `rateLimit`
 * for Upstash/Redis — the signature stays the same.
 */

const hits = new Map<string, number[]>();
let lastSweep = 0;

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  if (now - lastSweep > 60_000) {
    lastSweep = now;
    for (const [k, times] of hits) {
      if (times.every((t) => now - t > windowMs * 2)) hits.delete(k);
    }
  }

  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfterSeconds: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfterSeconds: 0 };
}
