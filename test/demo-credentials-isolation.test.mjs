// =========================================================================
// UNIT TEST: Demo Credential Isolation in Production Mode
// Verifies that shared PIN GJ2026 is strictly disabled in production
// unless explicitly permitted via ALLOW_DEMO_CREDENTIALS=true.
// =========================================================================

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { verifyOfficerPin } from "../src/lib/large-datasets.ts";

describe("Demo Credentials Production Isolation", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalDemo = process.env.ALLOW_DEMO_CREDENTIALS;
  const originalPublicDemo = process.env.NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS;

  it("Rejects shared PIN GJ2026 in production mode when ALLOW_DEMO_CREDENTIALS is not set", () => {
    try {
      process.env.NODE_ENV = "production";
      delete process.env.ALLOW_DEMO_CREDENTIALS;
      delete process.env.NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS;

      const res = verifyOfficerPin("GUJ-GOV-9012", "GJ2026");
      assert.equal(res.success, false, "Production must reject demo PIN GJ2026");
      assert.ok(res.error.includes("ઉત્પાદન વાતાવરણમાં ડેમો PIN અક્ષમ"));
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalDemo !== undefined) process.env.ALLOW_DEMO_CREDENTIALS = originalDemo;
      if (originalPublicDemo !== undefined) process.env.NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS = originalPublicDemo;
    }
  });

  it("Rejects shared PIN GJ2026 in production mode when ALLOW_DEMO_CREDENTIALS is false", () => {
    try {
      process.env.NODE_ENV = "production";
      process.env.ALLOW_DEMO_CREDENTIALS = "false";
      process.env.NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS = "false";

      const res = verifyOfficerPin("GUJ-GOV-9012", "GJ2026");
      assert.equal(res.success, false, "Production must reject demo PIN when flag is false");
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalDemo !== undefined) process.env.ALLOW_DEMO_CREDENTIALS = originalDemo;
      if (originalPublicDemo !== undefined) process.env.NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS = originalPublicDemo;
    }
  });

  it("Allows shared PIN GJ2026 in production mode when ALLOW_DEMO_CREDENTIALS is explicitly true", () => {
    try {
      process.env.NODE_ENV = "production";
      process.env.ALLOW_DEMO_CREDENTIALS = "true";

      const res = verifyOfficerPin("GUJ-GOV-9012", "GJ2026");
      assert.equal(res.success, true, "Must allow demo PIN when explicitly enabled for staging/demo");
      assert.equal(res.officer.id, "GUJ-GOV-9012");
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalDemo !== undefined) process.env.ALLOW_DEMO_CREDENTIALS = originalDemo;
    }
  });

  it("Allows all 5 displayed officer roles with demo PIN when ALLOW_DEMO_CREDENTIALS is true", () => {
    try {
      process.env.NODE_ENV = "production";
      process.env.ALLOW_DEMO_CREDENTIALS = "true";

      const demoRoles = [
        { id: "GUJ-STATE-001", expectedRole: "state_admin", expectedTier: 1 },
        { id: "GUJ-COL-3001", expectedRole: "district_collector", expectedTier: 2 },
        { id: "GUJ-SDM-5002", expectedRole: "sdm_prant", expectedTier: 3 },
        { id: "GUJ-GOV-9012", expectedRole: "mamlatdar", expectedTier: 4 },
        { id: "GUJ-TAL-7089", expectedRole: "talati", expectedTier: 5 },
      ];

      for (const roleTest of demoRoles) {
        const res = verifyOfficerPin(roleTest.id, "GJ2026");
        assert.equal(res.success, true, `Officer ${roleTest.id} must authenticate successfully`);
        assert.equal(res.officer.id, roleTest.id);
        assert.equal(res.officer.role, roleTest.expectedRole);
        assert.equal(res.officer.tierLevel, roleTest.expectedTier);
      }
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalDemo !== undefined) process.env.ALLOW_DEMO_CREDENTIALS = originalDemo;
    }
  });

  it("Rejects unknown or unsupported officer IDs even with demo PIN GJ2026", () => {
    try {
      process.env.NODE_ENV = "production";
      process.env.ALLOW_DEMO_CREDENTIALS = "true";

      const res = verifyOfficerPin("GUJ-FAKE-9999", "GJ2026");
      assert.equal(res.success, false, "Unknown officer ID must be rejected");
      assert.ok(res.error.includes("અમાન્ય કર્મચારી ID"));
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalDemo !== undefined) process.env.ALLOW_DEMO_CREDENTIALS = originalDemo;
    }
  });

  it("Always rejects invalid PIN (e.g. 000000 or wrong PIN) regardless of environment", () => {
    process.env.ALLOW_DEMO_CREDENTIALS = "true";
    const res = verifyOfficerPin("GUJ-GOV-9012", "999999");
    assert.equal(res.success, false);
  });

  it("Allows demo PIN when isDemoAuthorized flag is true (via Demo Gate) even in production without env var", () => {
    try {
      process.env.NODE_ENV = "production";
      delete process.env.ALLOW_DEMO_CREDENTIALS;
      delete process.env.NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS;

      // With isDemoAuthorized = true
      const resAllowed = verifyOfficerPin("GUJ-GOV-9012", "GJ2026", true);
      assert.equal(resAllowed.success, true, "Gate authorization must allow demo PIN in production");
      assert.equal(resAllowed.officer.id, "GUJ-GOV-9012");

      // With isDemoAuthorized = false
      const resBlocked = verifyOfficerPin("GUJ-GOV-9012", "GJ2026", false);
      assert.equal(resBlocked.success, false, "Without gate authorization, production must reject demo PIN");
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalDemo !== undefined) process.env.ALLOW_DEMO_CREDENTIALS = originalDemo;
      if (originalPublicDemo !== undefined) process.env.NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS = originalPublicDemo;
    }
  });
});

describe("Demo Data Isolation Collections", () => {
  it("Returns production collections by default when demo is not authorized", async () => {
    const { getApplicationsCollectionName, getRevocationsCollectionName } = await import("../src/lib/large-datasets.ts");
    const originalDemo = process.env.ALLOW_DEMO_CREDENTIALS;
    const originalEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = "production";
      delete process.env.ALLOW_DEMO_CREDENTIALS;

      assert.equal(getApplicationsCollectionName(false), "applications");
      assert.equal(getRevocationsCollectionName(false), "officer_revocations");
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalDemo !== undefined) process.env.ALLOW_DEMO_CREDENTIALS = originalDemo;
    }
  });

  it("Returns isolated demo collections when demo is authorized or gate is unlocked", async () => {
    const { getApplicationsCollectionName, getRevocationsCollectionName } = await import("../src/lib/large-datasets.ts");
    assert.equal(getApplicationsCollectionName(true), "demo_applications");
    assert.equal(getRevocationsCollectionName(true), "demo_officer_revocations");
  });
});

describe("Demo Gate Cookie Signing and Verification", () => {
  it("Signs and verifies demo gate cookie with HMAC SHA-256 and constant-time comparison", async () => {
    const secret = "test-secret-key-for-demo-gate-32-chars-long";
    const timestamp = Date.now().toString();
    const sig = crypto.createHmac("sha256", secret).update(`demo-gate-${timestamp}`).digest("hex");
    const cookieValue = `${timestamp}.${sig}`;

    assert.ok(cookieValue, "Cookie value must be generated");
    assert.ok(cookieValue.includes("."), "Cookie value must be format payload.signature");

    // Verification helper matching officer-auth.ts
    const verifyCookie = (val) => {
      if (!val) return false;
      const parts = val.split(".");
      if (parts.length !== 2) return false;
      const [ts, s] = parts;
      const timeNum = parseInt(ts, 10);
      if (isNaN(timeNum) || Date.now() - timeNum > 24 * 60 * 60 * 1000) return false;
      const expected = crypto.createHmac("sha256", secret).update(`demo-gate-${ts}`).digest("hex");
      const sigBuf = Buffer.from(s);
      const expBuf = Buffer.from(expected);
      if (sigBuf.length !== expBuf.length) return false;
      return crypto.timingSafeEqual(sigBuf, expBuf);
    };

    assert.equal(verifyCookie(cookieValue), true, "Valid signed cookie must verify as true");
    assert.equal(verifyCookie(cookieValue + "tamper"), false, "Tampered cookie must fail verification");
    assert.equal(verifyCookie("invalid.cookie"), false, "Invalid format cookie must fail verification");
    assert.equal(verifyCookie(""), false, "Empty cookie must fail verification");
    // Expired timestamp
    const expiredTs = (Date.now() - (25 * 60 * 60 * 1000)).toString();
    const expiredSig = crypto.createHmac("sha256", secret).update(`demo-gate-${expiredTs}`).digest("hex");
    assert.equal(verifyCookie(`${expiredTs}.${expiredSig}`), false, "Expired cookie (>24h) must fail verification");
  });
});


