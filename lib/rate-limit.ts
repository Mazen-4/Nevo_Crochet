/**
 * Best-effort, in-memory sliding-window rate limiter.
 *
 * State lives in the server instance, so on serverless hosts each instance counts
 * separately and counts reset on cold starts. It stops simple floods without adding a
 * paid service; durable per-email limits are enforced against the database instead.
 */
const hits = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 5000;

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep memory bounded: drop the oldest-inserted keys once the map grows too large.
  if (hits.size > MAX_TRACKED_KEYS) {
    for (const oldKey of hits.keys()) {
      hits.delete(oldKey);
      if (hits.size <= MAX_TRACKED_KEYS / 2) break;
    }
  }

  return true;
}

/** The caller's IP as reported by the hosting proxy (Vercel sets `x-forwarded-for`). */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown';
}
