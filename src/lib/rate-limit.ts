// =========================================================================
// NAGRIKSEVA AI — HIGH-PRECISION IN-MEMORY RATE LIMITER & BRUTE-FORCE SHIELD
// P0 Security: Sliding Window IP Rate Limiting & Account Lockout Defense
// Compliant with OWASP API Security Top 10 & RFC 6585
// =========================================================================

interface RateLimitConfig {
  keyPrefix?: string;
  windowMs?: number; // Time frame in milliseconds
  maxRequests?: number; // Allowed requests in this time frame
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetSeconds: number;
  retryAfterSeconds?: number;
}

// In-memory sliding window store: Key -> array of epoch millisecond timestamps
const rateLimitStore = new Map<string, number[]>();

// Brute-force lockout store: Identifier -> { failedCount: number, lockedUntil: number }
interface LockoutEntry {
  failedCount: number;
  lockedUntil: number;
}
const lockoutStore = new Map<string, LockoutEntry>();

/**
 * Periodically purge stale records every 5 minutes to prevent memory leaks.
 */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    // 1. Cleanup sliding window timestamps older than 15 minutes
    rateLimitStore.forEach((timestamps, key) => {
      const active = timestamps.filter((t) => now - t < 15 * 60 * 1000);
      if (active.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, active);
      }
    });

    // 2. Cleanup expired lockouts
    lockoutStore.forEach((entry, id) => {
      if (now > entry.lockedUntil && entry.failedCount === 0) {
        lockoutStore.delete(id);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Checks sliding-window rate limit for a client IP or composite identifier.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const windowMs = config.windowMs || 60 * 1000; // Default 1 minute
  const maxRequests = config.maxRequests || 60; // Default 60 req/min
  const prefix = config.keyPrefix || "global";
  const storageKey = `${prefix}:${identifier}`;

  const now = Date.now();
  const timestamps = rateLimitStore.get(storageKey) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  const resetSeconds = Math.ceil(
    (validTimestamps.length > 0 ? validTimestamps[0] + windowMs - now : windowMs) / 1000
  );

  if (validTimestamps.length >= maxRequests) {
    rateLimitStore.set(storageKey, validTimestamps);
    const retryAfterSeconds = Math.max(1, resetSeconds);
    return {
      allowed: false,
      remaining: 0,
      limit: maxRequests,
      resetSeconds,
      retryAfterSeconds,
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(storageKey, validTimestamps);

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - validTimestamps.length),
    limit: maxRequests,
    resetSeconds,
  };
}

/**
 * Extracts the real client IP address from request headers.
 */
export function extractClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}

/**
 * Records a failed authentication attempt (e.g. wrong OTP or wrong PIN).
 * If failed attempts exceed maxAttempts, locks out the identifier for lockTimeMs.
 */
export function recordFailedAuthAttempt(
  identifier: string,
  maxAttempts = 5,
  lockTimeMs = 10 * 60 * 1000 // 10 minutes lockout
): { locked: boolean; remainingAttempts: number; lockedUntil?: number } {
  const cleanId = identifier.trim().toLowerCase();
  const now = Date.now();
  const current = lockoutStore.get(cleanId) || { failedCount: 0, lockedUntil: 0 };

  // If already locked and lock hasn't expired
  if (current.lockedUntil > now) {
    return {
      locked: true,
      remainingAttempts: 0,
      lockedUntil: current.lockedUntil,
    };
  }

  const newCount = current.failedCount + 1;
  if (newCount >= maxAttempts) {
    const lockedUntil = now + lockTimeMs;
    lockoutStore.set(cleanId, { failedCount: newCount, lockedUntil });
    return {
      locked: true,
      remainingAttempts: 0,
      lockedUntil,
    };
  }

  lockoutStore.set(cleanId, { failedCount: newCount, lockedUntil: 0 });
  return {
    locked: false,
    remainingAttempts: Math.max(0, maxAttempts - newCount),
  };
}

/**
 * Checks if an identifier (mobile number, IP, or account ID) is currently locked out.
 */
export function isAuthLocked(identifier: string): {
  isLocked: boolean;
  remainingLockSeconds: number;
} {
  const cleanId = identifier.trim().toLowerCase();
  const entry = lockoutStore.get(cleanId);
  if (!entry || entry.lockedUntil === 0) {
    return { isLocked: false, remainingLockSeconds: 0 };
  }

  const now = Date.now();
  if (now > entry.lockedUntil) {
    // Lock has expired, reset counter
    lockoutStore.delete(cleanId);
    return { isLocked: false, remainingLockSeconds: 0 };
  }

  const remainingLockSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
  return { isLocked: true, remainingLockSeconds };
}

/**
 * Resets the failed attempts counter on successful login/verification.
 */
export function resetAuthLockout(identifier: string): void {
  const cleanId = identifier.trim().toLowerCase();
  lockoutStore.delete(cleanId);
}

/**
 * Utility helper to reset rate limit stores (useful in test suites).
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
  lockoutStore.clear();
}
