/**
 * Rate limiter em memória por chave (IP hash ou e-mail).
 * Adequado para uma única instância (Render free/Starter). Para múltiplas
 * instâncias, substituir por Redis — fronteira isolada neste módulo.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const globalForRateLimit = globalThis as unknown as {
  vixtRateLimit: Map<string, Bucket> | undefined;
};

const buckets = (globalForRateLimit.vixtRateLimit ??= new Map<string, Bucket>());

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const bucket: Bucket = { count: 1, resetAt: now + windowMs };
    buckets.set(key, bucket);
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  existing.count += 1;
  const allowed = existing.count <= limit;

  // Limpeza oportunista para não crescer sem limite.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }

  return {
    allowed,
    limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}
