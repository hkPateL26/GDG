import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateStatutorySlaStatus,
  generateStatutoryShowCauseNotice,
  STATUTORY_PENALTY_PER_DAY,
  STATUTORY_MAX_PENALTY_CAP,
} from "../src/lib/statutory-sla-engine.ts";
import { verifyCertificateSeal } from "../src/lib/digital-notary.ts";

test("Gujarat Right to Public Services Act (GRTPSA 2013) Statutory SLA Suite", async (t) => {
  await t.test("Calculates standard within-SLA status accurately", () => {
    const app = {
      id: "APP-GUJ-2026-1001",
      schemeId: "income",
      appliedDate: "2026-10-23",
      status: "processing",
    };

    // Override 0 days elapsed
    const status = calculateStatutorySlaStatus(app, 0);

    assert.equal(status.isBreached, false);
    assert.equal(status.totalPenalty, 0);
    assert.equal(status.badgeStatus, "NORMAL");
    assert.equal(status.statutorySlaDays, 1); // 1 day for income certificate
  });

  await t.test("Triggers SLA EXCEEDED and computes statutory penalty at ₹250/day (Section 8)", () => {
    const app = {
      id: "APP-GUJ-2026-5481",
      schemeId: "income", // 1 day SLA
      citizenName: "Haribhai Patel",
      citizenNameGu: "હરીભાઈ પટેલ",
      status: "pending",
    };

    // 5 days elapsed (1 statutory day + 4 days overdue)
    const status = calculateStatutorySlaStatus(app, 5);

    assert.equal(status.isBreached, true);
    assert.equal(status.statutorySlaDays, 1);
    assert.equal(status.actualDaysElapsed, 5);
    assert.equal(status.overdueDays, 4);
    assert.equal(status.penaltyPerDay, 250);
    assert.equal(status.totalPenalty, 4 * 250); // ₹1,000 penalty
    assert.equal(status.badgeStatus, "SLA_EXCEEDED");
    assert.match(status.badgeLabelGu, /SLA EXCEEDED \(4 દિવસ વિલંબિત\)/);
    assert.match(status.escalationTargetOfficer, /પ્રભવ જોષી, IAS/);
  });

  await t.test("Enforces statutory maximum penalty cap of ₹5,000 under GRTPSA 2013", () => {
    const app = {
      id: "APP-GUJ-2026-9999",
      schemeId: "ration", // 7 days SLA
      status: "pending",
    };

    // 50 days overdue: 50 * 250 = ₹12,500 -> must cap at ₹5,000
    const status = calculateStatutorySlaStatus(app, 57);

    assert.equal(status.isBreached, true);
    assert.equal(status.overdueDays, 50);
    assert.equal(status.totalPenalty, STATUTORY_MAX_PENALTY_CAP);
    assert.equal(status.totalPenalty, 5000);
  });

  await t.test("Approved applications never incur statutory SLA penalty", () => {
    const app = {
      id: "APP-GUJ-2026-8888",
      schemeId: "income",
      status: "approved",
      workflowStage: 3,
    };

    const status = calculateStatutorySlaStatus(app, 20);

    assert.equal(status.isBreached, false);
    assert.equal(status.overdueDays, 0);
    assert.equal(status.totalPenalty, 0);
  });

  await t.test("Generates complete statutory Show-Cause Notice with verifiable cryptographic seal", () => {
    const app = {
      id: "APP-GUJ-2026-5481",
      schemeId: "income",
      schemeName: "Income Certificate",
      schemeNameGu: "આવકનો દાખલો",
      citizenName: "Haribhai Patel",
      citizenNameGu: "હરીભાઈ પટેલ",
      taluka: "ગોંડલ",
      districtGu: "રાજકોટ",
      status: "pending",
    };

    const notice = generateStatutoryShowCauseNotice(app, 5);

    assert.match(notice.noticeNo, /^GRTPSA-GJ\/2026\/SCN-APP-GUJ-2026-5481$/);
    assert.equal(notice.applicationId, "APP-GUJ-2026-5481");
    assert.equal(notice.applicantNameGu, "હરીભાઈ પટેલ");
    assert.equal(notice.totalPenalty, 1000);
    assert.equal(notice.explanationDeadlineDays, 7);
    assert.match(notice.actSectionGu, /કલમ ૮/);
    assert.match(notice.issuingOfficerName, /પ્રભવ જોષી, IAS/);

    // Verify cryptographic notary seal
    const isSealValid = verifyCertificateSeal(
      { id: notice.applicationId, citizenName: notice.applicantName },
      notice.cryptographicSeal
    );
    assert.equal(isSealValid, true, "Notice cryptographic seal must be legally verifiable");
  });
});
