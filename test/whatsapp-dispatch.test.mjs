import test from "node:test";
import assert from "node:assert/strict";
import {
  formatWhatsAppCitizenMessage,
  getWhatsAppShareUrl,
  getAppOrigin,
} from "../src/lib/whatsapp-dispatch.ts";
import { verifyCertificateSeal } from "../src/lib/digital-notary.ts";

test("NagrikSeva AI - Official WhatsApp Citizen Dispatch & Share Suite", async (t) => {
  await t.test("Formats official Gujarati WhatsApp notification correctly", () => {
    const app = {
      id: "APP-GUJ-2026-9999",
      citizenName: "Haribhai Patel",
      citizenNameGu: "હરીભાઈ પટેલ",
      schemeName: "Income Certificate",
      schemeNameGu: "આવકનો દાખલો",
      feeAmount: 50,
      challanNo: "CHALLAN-9999",
      taluka: "બારડોલી",
      districtGu: "સુરત",
      mobile: "9876543210",
      trackingSecret: "SEC-TEST-1234",
    };

    const message = formatWhatsAppCitizenMessage(app);

    // Verify statutory branding
    assert.match(message, /ગુજરાત સરકાર - ડિજિટલ સેવા/);
    assert.match(message, /હરીભાઈ પટેલ/);
    assert.match(message, /આવકનો દાખલો/);
    assert.match(message, /APP-GUJ-2026-9999/);
    assert.match(message, /CHALLAN-9999/);
    assert.match(message, /બારડોલી, સુરત/);
    assert.match(message, /GRTSA ૨૦૧૩/);

    // Verify URLs in message
    assert.ok(message.includes("/track?id=APP-GUJ-2026-9999&secret=SEC-TEST-1234"));
    assert.ok(message.includes("/verify?id=APP-GUJ-2026-9999&seal="));
  });

  await t.test("Generates valid WhatsApp API click-to-chat URL with phone number", () => {
    const app = {
      id: "APP-GUJ-2026-1234",
      citizenName: "Kishan Khunt",
      mobile: "9876543210",
    };

    const url = getWhatsAppShareUrl(app);
    assert.ok(url.startsWith("https://api.whatsapp.com/send?text="));
    assert.ok(url.includes("&phone=919876543210"));
  });

  await t.test("Generates valid WhatsApp API click-to-chat URL without phone number", () => {
    const app = {
      id: "APP-GUJ-2026-5678",
      citizenName: "Jeet Jajal",
    };

    const url = getWhatsAppShareUrl(app);
    assert.ok(url.startsWith("https://api.whatsapp.com/send?text="));
    assert.ok(!url.includes("&phone="), "Should not contain phone parameter when mobile is missing");
  });

  await t.test("Embedded verification link contains authentic verifiable cryptographic seal", () => {
    const app = {
      id: "APP-GUJ-2026-8888",
      citizenName: "Sureshbhai Vala",
    };

    const message = formatWhatsAppCitizenMessage(app);
    const verifyMatch = message.match(/\/verify\?id=([^&]+)&seal=([^\s\n]+)/);
    assert.ok(verifyMatch, "Message must contain /verify URL with seal parameter");

    const extractedId = decodeURIComponent(verifyMatch[1]);
    const extractedSeal = decodeURIComponent(verifyMatch[2]);

    assert.equal(extractedId, "APP-GUJ-2026-8888");
    const isValid = verifyCertificateSeal(
      { id: extractedId, citizenName: app.citizenName },
      extractedSeal
    );
    assert.equal(isValid, true, "Seal embedded in WhatsApp message must be cryptographically valid");
  });
});
