// =========================================================================
// UNIT TEST: Demo Credential Isolation in Production Mode
// Verifies that shared PIN GJ2026 is strictly disabled in production
// unless explicitly permitted via ALLOW_DEMO_CREDENTIALS=true.
// =========================================================================

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { verifyOfficerPin } from "../src/lib/large-datasets.ts";

describe("Demo Credentials Production Isolation", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalDemo = process.env.ALLOW_DEMO_CREDENTIALS;

  it("Rejects shared PIN GJ2026 in production mode when ALLOW_DEMO_CREDENTIALS is not set", () => {
    try {
      process.env.NODE_ENV = "production";
      delete process.env.ALLOW_DEMO_CREDENTIALS;

      const res = verifyOfficerPin("GUJ-GOV-9012", "GJ2026");
      assert.equal(res.success, false, "Production must reject demo PIN GJ2026");
      assert.ok(res.error.includes("ઉત્પાદન વાતાવરણમાં ડેમો PIN અક્ષમ"));
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalDemo !== undefined) process.env.ALLOW_DEMO_CREDENTIALS = originalDemo;
    }
  });

  it("Rejects shared PIN GJ2026 in production mode when ALLOW_DEMO_CREDENTIALS is false", () => {
    try {
      process.env.NODE_ENV = "production";
      process.env.ALLOW_DEMO_CREDENTIALS = "false";

      const res = verifyOfficerPin("GUJ-GOV-9012", "GJ2026");
      assert.equal(res.success, false, "Production must reject demo PIN when flag is false");
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalDemo !== undefined) process.env.ALLOW_DEMO_CREDENTIALS = originalDemo;
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

  it("Always rejects invalid PIN (e.g. 000000 or wrong PIN) regardless of environment", () => {
    process.env.ALLOW_DEMO_CREDENTIALS = "true";
    const res = verifyOfficerPin("GUJ-GOV-9012", "999999");
    assert.equal(res.success, false);
  });
});
