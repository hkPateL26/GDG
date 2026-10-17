import test from "node:test";
import assert from "node:assert/strict";
import { generateCertificateSeal, verifyCertificateSeal, computeSha256Hex } from "../src/lib/digital-notary.ts";

test("Digital Public Infrastructure (DPI) Cryptographic Notary Suite", async (t) => {
  await t.test("Generates deterministic SHA-256 seal format", () => {
    const app = {
      id: "APP-GUJ-2026-0001",
      citizenName: "Haribhai Patel",
      aadhaarLast4: "1413",
    };

    const seal1 = generateCertificateSeal(app);
    const seal2 = generateCertificateSeal(app);

    assert.equal(seal1, seal2, "Seal must be deterministic");
    assert.match(seal1, /^SEC-[0-9A-F]{8}-[0-9A-F]{8}$/, "Seal must match SEC-XXXXXXXX-XXXXXXXX format");
  });

  await t.test("Rejects altered or tampered parameters", () => {
    const originalApp = {
      id: "APP-GUJ-2026-0001",
      citizenName: "Haribhai Patel",
      aadhaarLast4: "1413",
    };

    const validSeal = generateCertificateSeal(originalApp);

    // Tampered applicant name
    const tamperedApp = {
      id: "APP-GUJ-2026-0001",
      citizenName: "Ramesh Patel", // Changed name
      aadhaarLast4: "1413",
    };

    assert.equal(verifyCertificateSeal(originalApp, validSeal), true, "Original must be valid");
    assert.equal(verifyCertificateSeal(tamperedApp, validSeal), false, "Tampered name must fail verification");

    // Tampered seal
    const fakeSeal = "SEC-DEADBEEF-CAFEBABE";
    assert.equal(verifyCertificateSeal(originalApp, fakeSeal), false, "Forged seal must fail verification");
  });

  await t.test("Empty or null seal is safely rejected", () => {
    const app = { id: "APP-GUJ-2026-0001" };
    assert.equal(verifyCertificateSeal(app, null), false);
    assert.equal(verifyCertificateSeal(app, ""), false);
    assert.equal(verifyCertificateSeal(app, undefined), false);
  });
});
