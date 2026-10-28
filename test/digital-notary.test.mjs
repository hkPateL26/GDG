import test from "node:test";
import assert from "node:assert/strict";
import {
  generateCertificateSeal,
  verifyCertificateSeal,
  computeSha256Hex,
  parseQrVerifyUrl,
} from "../src/lib/digital-notary.ts";

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

  await t.test("Parses QR verify URLs and extracts ID and Seal accurately", () => {
    // 1. Full production URL
    const fullUrl = "https://nagrikseva-ai-one.vercel.app/verify?id=APP-GUJ-7492&seal=SEC-01234567-89ABCDEF";
    const res1 = parseQrVerifyUrl(fullUrl);
    assert.deepEqual(res1, { id: "APP-GUJ-7492", seal: "SEC-01234567-89ABCDEF" });

    // 2. Relative query string
    const relUrl = "/verify?id=APP-GUJ-8812&seal=SEC-A1B2C3D4-E5F67890";
    const res2 = parseQrVerifyUrl(relUrl);
    assert.deepEqual(res2, { id: "APP-GUJ-8812", seal: "SEC-A1B2C3D4-E5F67890" });

    // 3. Raw Application ID
    const rawId = "APP-GUJ-9921";
    const res3 = parseQrVerifyUrl(rawId);
    assert.deepEqual(res3, { id: "APP-GUJ-9921", seal: "" });

    // 4. Invalid or null text
    assert.equal(parseQrVerifyUrl(""), null);
    assert.equal(parseQrVerifyUrl("hello world"), null);
  });
});
