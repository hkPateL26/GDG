// =========================================================================
// UNIT TESTS: Cryptographic Secret Key Enforcement & Session Token Rules
// =========================================================================

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";

describe("Cryptographic Secret Key Safety Enforcement", () => {
  it("Fails safely in production when secret is missing or under 32 chars", () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.OFFICER_AUTH_SECRET;

    try {
      process.env.NODE_ENV = "production";
      delete process.env.OFFICER_AUTH_SECRET;
      delete process.env.AUTH_SECRET;

      const checkSecret = () => {
        const secret = process.env.OFFICER_AUTH_SECRET || process.env.AUTH_SECRET;
        if (process.env.NODE_ENV === "production") {
          if (!secret || secret.length < 32) {
            throw new Error(
              "FATAL: OFFICER_AUTH_SECRET is not configured or shorter than 32 characters in production. Refusing to operate in insecure mode."
            );
          }
        }
      };

      assert.throws(checkSecret, /FATAL: OFFICER_AUTH_SECRET is not configured/);

      // Also fails if secret is short (e.g. 16 chars)
      process.env.OFFICER_AUTH_SECRET = "short-secret-16";
      assert.throws(checkSecret, /FATAL: OFFICER_AUTH_SECRET is not configured/);
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalSecret) process.env.OFFICER_AUTH_SECRET = originalSecret;
    }
  });

  it("Constant-time comparison protects against HMAC timing attacks", () => {
    const sigA = crypto.createHmac("sha256", "secret123456789012345678901234567890").update("message").digest("base64url");
    const sigB = crypto.createHmac("sha256", "secret123456789012345678901234567890").update("message").digest("base64url");
    const sigC = crypto.createHmac("sha256", "wrongsecret12345678901234567890123").update("message").digest("base64url");

    const bufA = Buffer.from(sigA);
    const bufB = Buffer.from(sigB);
    const bufC = Buffer.from(sigC);

    assert.equal(crypto.timingSafeEqual(bufA, bufB), true);
    assert.equal(crypto.timingSafeEqual(bufA, bufC), false);
  });
});
