import test from "node:test";
import assert from "node:assert/strict";
import {
  getCitizenEntitlementSummary,
  DEFAULT_FAMILY_ENTITLEMENTS,
  DEFAULT_RENEWAL_ALERTS,
} from "../src/lib/entitlement-passbook-engine.ts";
import { verifyCertificateSeal } from "../src/lib/digital-notary.ts";

test("Citizen Entitlement Passbook (નાગરિક અધિકાર પાસબુક) Suite", async (t) => {
  await t.test("Calculates unified lifetime entitlement total accurately", () => {
    const citizen = {
      mobile: "9825012345",
      aadhaarLast4: "4829",
      citizenName: "Hari Vinodrai Patel",
      citizenNameGu: "હરી વિનોદરાઈ પટેલ",
    };

    const summary = getCitizenEntitlementSummary(citizen);

    // Sum verification
    const expectedSum =
      summary.dbtCashTotal +
      summary.insuranceCoverTotal +
      summary.housingAssetTotal +
      summary.inKindSubsidyTotal;

    assert.equal(summary.totalLifetimeValue, expectedSum, "Total lifetime value must equal sum of categories");
    assert.ok(summary.totalLifetimeValue > 500000, "Lifetime value must include major welfare covers (>= ₹5 Lakh)");
    assert.equal(summary.kutumbId, "GJ-KUTUMB-2345-4829");
    assert.equal(summary.headNameGu, "હરી વિનોદરાઈ પટેલ");
  });

  await t.test("Itemized ledger includes multiple categories with valid positive values", () => {
    const summary = getCitizenEntitlementSummary();

    assert.ok(summary.items.length >= 5, "Passbook must contain multiple social protection entitlements");

    const categories = new Set(summary.items.map((i) => i.category));
    assert.ok(categories.has("dbt_cash"), "Must include DBT direct bank cash credits");
    assert.ok(categories.has("insurance_cover"), "Must include health/risk insurance coverage");
    assert.ok(categories.has("housing_asset"), "Must include asset/housing/solar grants");

    for (const item of summary.items) {
      assert.ok(item.amount > 0, `Amount for ${item.schemeId} must be positive`);
      assert.ok(item.referenceNo.length > 0, `Reference number for ${item.schemeId} must exist`);
      assert.ok(item.departmentGu.length > 0, `Department for ${item.schemeId} must exist`);
    }
  });

  await t.test("Generates authentic verifiable SHA-256 cryptographic seal for the passbook", () => {
    const citizen = {
      mobile: "9825099999",
      aadhaarLast4: "1413",
      citizenName: "Rameshbhai Patel",
      citizenNameGu: "રમેશભાઈ પટેલ",
    };

    const summary = getCitizenEntitlementSummary(citizen);

    assert.ok(summary.cryptographicSeal, "Seal must be generated");
    assert.match(summary.cryptographicSeal, /^SEC-[0-9A-F]{8}-[0-9A-F]{8}$/, "Seal must match notary format");

    const isValid = verifyCertificateSeal(
      { id: summary.kutumbId, citizenName: summary.headNameGu },
      summary.cryptographicSeal
    );
    assert.equal(isValid, true, "Passbook cryptographic seal must verify successfully");
  });

  await t.test("Tracks statutory proactive renewal alerts with countdowns", () => {
    const summary = getCitizenEntitlementSummary();

    assert.ok(summary.renewalAlerts.length > 0, "Renewal alerts must exist");

    const rationAlert = summary.renewalAlerts.find((a) => a.schemeId === "ration");
    assert.ok(rationAlert, "Must include Ration Card e-KYC alert");
    assert.equal(rationAlert.alertType, "urgent_renewal");
    assert.ok(rationAlert.daysRemaining > 0, "Days remaining must be greater than 0");
    assert.ok(rationAlert.actionUrl.startsWith("/"), "Action URL must be a valid internal path");
  });
});
