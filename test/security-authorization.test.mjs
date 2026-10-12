// =========================================================================
// NAGRIKSEVA AI — P0 ADMIN AUTHORIZATION & SECURITY TEST SUITE
// Tests end-to-end cryptographic authentication, HttpOnly cookies,
// role-based permissions (RBAC), jurisdictional boundaries, and state machines.
// =========================================================================

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";

const BASE_URL = process.env.TEST_APP_URL || "http://localhost:3009";

/**
 * Helper to extract Cookie header from Set-Cookie in Response
 */
function extractCookie(response) {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) return "";
  const match = setCookie.match(/nagrik_officer_token=[^;]+/);
  return match ? match[0] : "";
}

/**
 * Creates a synthetic forged JWT token signed with an arbitrary attacker key
 */
function createForgedToken(payload, attackerSecret = "fake-attacker-secret-key-1234567890") {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const message = `${header}.${body}`;
  const signature = crypto.createHmac("sha256", attackerSecret).update(message).digest("base64url");
  return `${message}.${signature}`;
}

describe("P0 Admin API Authorization Security Tests", () => {

  // ───────────────────────────────────────────────────────────────────────────
  // 1. UNAUTHENTICATED & FORGED BODY ATTEMPTS (CWE-306, CWE-284)
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 1: Unauthenticated attempt to advance workflow stage is rejected with 401", async () => {
    const res = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "APP010",
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(res.status, 401, "Expected 401 Unauthorized");
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.code, "UNAUTHORIZED");
  });

  it("Test 2: Supplying shared PIN 'GJ2026' alone in request body is rejected with 401", async () => {
    const res = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "APP010",
        action: "advance_stage",
        stage: 3,
        pin: "GJ2026",
      }),
    });

    assert.equal(res.status, 401, "PIN in body must not grant authorization");
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.code, "UNAUTHORIZED");
  });

  it("Test 3: Supplying operatorId 'JSK-OP-8921' in request body is rejected with 401", async () => {
    const res = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "APP015",
        action: "confirm_cash_payment",
        operatorId: "JSK-OP-8921",
        pin: "GJ2026",
      }),
    });

    assert.equal(res.status, 401, "Hardcoded operatorId in body must not grant authorization");
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.code, "UNAUTHORIZED");
  });

  it("Test 4: Forged officer ID or Gujarati role string in request body is rejected with 401", async () => {
    const res = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "APP010",
        action: "advance_stage",
        stage: 3,
        officerId: "GUJ-GOV-9012",
        officerRole: "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ",
        officerName: "એચ. વી. પટેલ, GAS",
        pin: "GJ2026",
      }),
    });

    assert.equal(res.status, 401, "Caller-supplied officer details must be rejected");
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.code, "UNAUTHORIZED");
  });

  it("Test 5: Tampered / forged JWT token is rejected with 401", async () => {
    const forgedToken = createForgedToken({
      officerId: "GUJ-GOV-9012",
      role: "mamlatdar",
      tierLevel: 4,
      name: "Attacker Forged",
      canApproveEsign: true,
      canVerifyPayment: true,
      expiresAt: Date.now() + 3600000,
    });

    const res = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${forgedToken}`,
      },
      body: JSON.stringify({
        id: "APP010",
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(res.status, 401, "Forged token signature must be rejected");
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.code, "UNAUTHORIZED");
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 2. AUTHENTICATION & SESSION MANAGEMENT
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 6: Valid officer authentication issues HttpOnly cookie and Bearer token", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-GOV-9012",
        pin: "GJ2026",
      }),
    });

    assert.equal(res.status, 200, "Officer authentication must succeed");
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.token, "Token must be returned");
    assert.equal(json.officer.id, "GUJ-GOV-9012");
    assert.equal(json.officer.role, "mamlatdar");

    const setCookie = res.headers.get("set-cookie");
    assert.ok(setCookie, "Set-Cookie header must be present");
    assert.ok(setCookie.includes("nagrik_officer_token="), "Must set nagrik_officer_token cookie");
    assert.ok(setCookie.toLowerCase().includes("httponly"), "Cookie must be HttpOnly");
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSION ENFORCEMENT
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 7: Talati Mantri (Tier 5, canApproveEsign: false) CANNOT approve Stage 3 e-Sign", async () => {
    // Login as Talati Gomta
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-TAL-7089",
        pin: "GJ2026",
      }),
    });
    assert.equal(loginRes.status, 200);
    const { token } = await loginRes.json();

    // Create a benchmark/test application in Gomta village
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Gomta Resident",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Gomta",
        schemeId: "income-certificate",
        schemeName: "Income Certificate",
      }),
    });
    assert.equal(createRes.status, 200);
    const { application } = await createRes.json();

    // Talati attempts Stage 3 approval
    const approveRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(approveRes.status, 403, "Talati must be forbidden from Stage 3 e-Sign approval");
    const approveJson = await approveRes.json();
    assert.equal(approveJson.success, false);
    assert.equal(approveJson.code, "FORBIDDEN_ROLE");
    assert.ok(approveJson.error.includes("e-Sign"));
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. JURISDICTIONAL BOUNDARY ENFORCEMENT (5-TIER HIERARCHY)
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 8: Talati Gomta CANNOT modify application outside Gomta village", async () => {
    // Login as Talati Gomta
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-TAL-7089",
        pin: "GJ2026",
      }),
    });
    const { token } = await loginRes.json();

    // Create application in Ribda village (same taluka Gondal, but NOT Gomta)
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Ribda Resident",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Ribda",
        schemeId: "income-certificate",
      }),
    });
    const { application } = await createRes.json();

    // Gomta Talati attempts to modify Ribda application
    const mutateRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "advance_stage",
        stage: 2,
      }),
    });

    assert.equal(mutateRes.status, 403, "Talati Gomta cannot touch Ribda village records");
    const json = await mutateRes.json();
    assert.equal(json.code, "FORBIDDEN_JURISDICTION");
    assert.ok(json.error.includes("અધિકારક્ષેત્ર"));
  });

  it("Test 9: Mamlatdar Gondal CANNOT modify application in Rajkot Rural taluka", async () => {
    // Login as Mamlatdar Gondal
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-GOV-9012",
        pin: "GJ2026",
      }),
    });
    const { token } = await loginRes.json();

    // Create application in Rajkot Rural taluka
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Rural Resident",
        district: "Rajkot",
        taluka: "Rajkot Rural",
        village: "Anandpar",
        schemeId: "pm-kisan",
      }),
    });
    const { application } = await createRes.json();

    // Mamlatdar Gondal attempts to approve Rajkot Rural application
    const mutateRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(mutateRes.status, 403, "Mamlatdar Gondal cannot touch Rajkot Rural records");
    const json = await mutateRes.json();
    assert.equal(json.code, "FORBIDDEN_JURISDICTION");
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. WORKFLOW STATE MACHINE & TRANSITION VALIDATION
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 10: Invalid target stage (e.g. stage 5) is rejected with 400", async () => {
    // Login as Mamlatdar Gondal
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-GOV-9012",
        pin: "GJ2026",
      }),
    });
    const { token } = await loginRes.json();

    // Create Gondal application
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Gondal Citizen",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Gondal City",
        schemeId: "income-certificate",
      }),
    });
    const { application } = await createRes.json();

    // Attempt invalid stage 5
    const mutateRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "advance_stage",
        stage: 5,
      }),
    });

    assert.equal(mutateRes.status, 400, "Invalid stage must be rejected");
    const json = await mutateRes.json();
    assert.equal(json.success, false);
  });

  it("Test 11: Re-approving an already approved application is rejected with 400", async () => {
    // Login as Mamlatdar Gondal
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-GOV-9012",
        pin: "GJ2026",
      }),
    });
    const { token } = await loginRes.json();

    // Create Gondal application
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Gondal Applicant",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Gondal City",
        schemeId: "income-certificate",
      }),
    });
    const { application } = await createRes.json();

    // First Approval (Stage 3)
    const firstRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "advance_stage",
        stage: 3,
      }),
    });
    assert.equal(firstRes.status, 200, "First approval should succeed");

    // Second Duplicate Approval
    const secondRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(secondRes.status, 400, "Duplicate approval must be rejected");
    const json = await secondRes.json();
    assert.equal(json.code, "INVALID_TRANSITION");
    assert.ok(json.error.includes("પહેલેથી જ"));
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. VALID AUTHORIZED OPERATIONS (AUTHORIZED PATHS)
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 12: Authorized Mamlatdar approving Gondal application succeeds with verified session", async () => {
    // Login as Mamlatdar Gondal
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-GOV-9012",
        pin: "GJ2026",
      }),
    });
    const cookieHeader = extractCookie(loginRes);
    const { token } = await loginRes.json();

    // Create Gondal application
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Kishorbhai Radadiya",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Gondal City",
        schemeId: "income-certificate",
      }),
    });
    const { application } = await createRes.json();

    // Approve using HttpOnly Cookie
    const approveRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        id: application.id,
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(approveRes.status, 200, "Authorized approval must return 200");
    const approveJson = await approveRes.json();
    assert.equal(approveJson.success, true);
    assert.equal(approveJson.application.status, "approved");
    assert.equal(approveJson.application.workflowStage, 3);
    assert.ok(
      approveJson.application.officerDesignation.includes("મામલતદાર"),
      "Officer designation must be stamped from server session"
    );
  });

  it("Test 13: Authorized officer rejection succeeds and updates citizen timeline", async () => {
    // Login as Mamlatdar Gondal
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-GOV-9012",
        pin: "GJ2026",
      }),
    });
    const { token } = await loginRes.json();

    // Create Gondal application
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Rameshbhai Gondaliya",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Gondal City",
        schemeId: "income-certificate",
      }),
    });
    const { application } = await createRes.json();

    // Reject application
    const rejectRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "reject",
        remarksGu: "આવકનો દાખલો સ્પષ્ટ દેખાતો નથી, પુનઃ અપલોડ કરો.",
        remarksEn: "Income certificate not legible. Please re-upload.",
      }),
    });

    assert.equal(rejectRes.status, 200, "Rejection must return 200");
    const rejectJson = await rejectRes.json();
    assert.equal(rejectJson.success, true);
    assert.equal(rejectJson.application.status, "rejected");
    assert.equal(rejectJson.application.remarksGu, "આવકનો દાખલો સ્પષ્ટ દેખાતો નથી, પુનઃ અપલોડ કરો.");
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 7. CITIZEN WORKFLOW PRESERVATION
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 14: Citizen can submit new application without authentication", async () => {
    const res = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Citizen Public User",
        mobile: "9876543210",
        aadhaarLast4: "4321",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Gomta",
        schemeId: "pm-kisan",
        feeAmount: 50,
      }),
    });

    assert.equal(res.status, 200, "Citizen submission must remain public");
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.application.id.startsWith("APP-GUJ-"));
    assert.equal(json.application.citizenName, "Citizen Public User");
  });

  it("Test 15: Public tracking of an application ID enforces data minimization and tracking secret", async () => {
    // 1. Submit application
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Public Tracking User",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Gomta",
        schemeId: "income-certificate",
      }),
    });
    const { application, trackingSecret } = await createRes.json();
    assert.ok(trackingSecret, "Tracking secret must be generated on submission");

    // 2. Track publicly without secret (minimal safe status, masked name, PII omitted)
    const trackRes = await fetch(`${BASE_URL}/api/track?id=${application.id}`);
    assert.equal(trackRes.status, 200, "Public tracking must return 200");
    const trackJson = await trackRes.json();
    assert.equal(trackJson.success, true);
    assert.equal(trackJson.application.id, application.id);
    assert.ok(trackJson.application.maskedCitizenName, "Must return masked citizen name");
    assert.equal(trackJson.application.citizenName, undefined, "Raw citizenName must NOT be exposed");

    // 3. Track with tracking secret (allowlisted tracking details, PII omitted)
    const secretRes = await fetch(`${BASE_URL}/api/track?id=${application.id}&secret=${trackingSecret}`);
    assert.equal(secretRes.status, 200, "Secret tracking must return 200");
    const secretJson = await secretRes.json();
    assert.equal(secretJson.success, true);
    assert.equal(secretJson.application.id, application.id);
    assert.ok(secretJson.application.maskedCitizenName);
    assert.equal(secretJson.application.citizenName, undefined, "Raw citizenName must NOT be exposed");
    assert.equal(secretJson.application.aadhaarLast4, undefined, "Aadhaar must NOT be exposed publicly");
  });

  it("Test 16: Public system statistics request succeeds without officer session", async () => {
    const res = await fetch(`${BASE_URL}/api/track?stats=true`);
    assert.equal(res.status, 200, "System stats must remain public");
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.stats.total > 0);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 8. LOGOUT & SESSION INVALIDATION
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 17: Officer logout clears session cookie; subsequent actions are rejected", async () => {
    // 1. Login
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-GOV-9012",
        pin: "GJ2026",
      }),
    });
    const cookieHeader = extractCookie(loginRes);

    // 2. Logout
    const logoutRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ action: "logout_officer" }),
    });
    assert.equal(logoutRes.status, 200);

    const logoutCookie = logoutRes.headers.get("set-cookie");
    assert.ok(logoutCookie, "Logout must set cookie to expire");
    assert.ok(logoutCookie.includes("Max-Age=0") || logoutCookie.includes("expires="));

    // 3. Mutate after logout
    const mutateRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // No cookie / cleared cookie
      },
      body: JSON.stringify({
        id: "APP010",
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(mutateRes.status, 401, "Action after logout must be rejected");
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 9. TOKEN EXPIRATION & ADDITIONAL JURISDICTIONAL HIERARCHY TESTS
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 18: Expired session token is rejected with 401", async () => {
    // Generate token with expiration in the past (-10 seconds)
    const secret = process.env.OFFICER_AUTH_SECRET || "9f83b271d44a2c5e03947b1e8461b2e6734d8a1c905e32b45f1a7d6e8b2c9a1f";
    const expiredPayload = {
      officerId: "GUJ-GOV-9012",
      role: "mamlatdar",
      tierLevel: 4,
      name: "એચ. વી. પટેલ, GAS",
      designation: "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ",
      district: "Rajkot",
      taluka: "Gondal",
      canApproveEsign: true,
      canVerifyPayment: true,
      canModifyPolicy: false,
      canViewAllDistricts: false,
      issuedAt: Date.now() - 3600000,
      expiresAt: Date.now() - 10000, // Expired 10s ago
    };

    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const body = Buffer.from(JSON.stringify(expiredPayload)).toString("base64url");
    const message = `${header}.${body}`;
    const signature = crypto.createHmac("sha256", secret).update(message).digest("base64url");
    const expiredToken = `${message}.${signature}`;

    const res = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${expiredToken}`,
      },
      body: JSON.stringify({
        id: "APP010",
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(res.status, 401, "Expired token must be rejected");
    const json = await res.json();
    assert.equal(json.code, "UNAUTHORIZED");
  });

  it("Test 19: Authorized Talati Mantri CAN confirm cash payment for Gomta village application", async () => {
    // Login as Talati Gomta
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-TAL-7089",
        pin: "GJ2026",
      }),
    });
    const { token } = await loginRes.json();

    // Create application in Gomta village
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Gomta Offline Applicant",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Gomta",
        schemeId: "pm-awas",
        paymentMethod: "challan",
      }),
    });
    const { application } = await createRes.json();

    // Talati confirms cash payment
    const confirmRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "confirm_cash_payment",
      }),
    });

    assert.equal(confirmRes.status, 200, "Talati must be allowed to confirm cash payment in Gomta");
    const json = await confirmRes.json();
    assert.equal(json.success, true);
    assert.equal(json.application.paymentStatus, "paid");
    assert.equal(json.application.operatorConfirmed, true);
  });

  it("Test 20: District Collector Rajkot CAN modify application in Rajkot Rural taluka", async () => {
    // Login as Collector Rajkot
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-COL-3001",
        pin: "GJ2026",
      }),
    });
    const { token } = await loginRes.json();

    // Create application in Rajkot Rural taluka
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Rural Citizen",
        district: "Rajkot",
        taluka: "Rajkot Rural",
        village: "Anandpar",
        schemeId: "pm-kisan",
      }),
    });
    const { application } = await createRes.json();

    // Collector approves
    const approveRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(approveRes.status, 200, "Collector must have jurisdiction over entire Rajkot district");
    const json = await approveRes.json();
    assert.equal(json.success, true);
    assert.equal(json.application.status, "approved");
  });

  it("Test 21: District Collector Rajkot CANNOT modify application in Surat district", async () => {
    // Login as Collector Rajkot
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-COL-3001",
        pin: "GJ2026",
      }),
    });
    const { token } = await loginRes.json();

    // Create application in Surat district
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Surat Citizen",
        district: "Surat",
        districtGu: "સુરત",
        taluka: "Chorasi",
        village: "Dumas",
        schemeId: "pm-kisan",
      }),
    });
    const { application } = await createRes.json();

    // Collector Rajkot attempts to modify Surat application
    const approveRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: application.id,
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(approveRes.status, 403, "Collector Rajkot cannot modify Surat application");
    const json = await approveRes.json();
    assert.equal(json.code, "FORBIDDEN_JURISDICTION");
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 9. P0.1 RESIDUAL SECURITY PROPERTY TESTS
  // ───────────────────────────────────────────────────────────────────────────

  it("Test 22: Copied Bearer token CANNOT authorize actions after officer logout (Token Revocation)", async () => {
    // 1. Officer logs in and copies Bearer token
    const loginRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_officer",
        officerId: "GUJ-GOV-9012",
        pin: "GJ2026",
      }),
    });
    assert.equal(loginRes.status, 200);
    const { token } = await loginRes.json();
    assert.ok(token);

    // 2. Token works initially for session check
    const checkRes1 = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "get_officer_session" }),
    });
    assert.equal(checkRes1.status, 200, "Active session should be valid before logout");

    // 3. Officer logs out
    const logoutRes = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "logout_officer" }),
    });
    assert.equal(logoutRes.status, 200, "Logout should succeed");

    // 4. Attacker replays copied Bearer token on sensitive action
    const replayRes = await fetch(`${BASE_URL}/api/track`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: "APP010",
        action: "advance_stage",
        stage: 3,
      }),
    });

    assert.equal(replayRes.status, 401, "Revoked token must be rejected with 401");
    const replayJson = await replayRes.json();
    assert.equal(replayJson.code, "UNAUTHORIZED");

    // 5. Attacker replays token on session verification
    const checkRes2 = await fetch(`${BASE_URL}/api/auth/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "get_officer_session" }),
    });
    assert.equal(checkRes2.status, 401, "Session verification must reject revoked token");
  });

  it("Test 23: Anonymous queue browsing and pagination is strictly blocked with 401 Unauthorized", async () => {
    // Attempt 1: Query queue without authentication
    const res1 = await fetch(`${BASE_URL}/api/track`);
    assert.equal(res1.status, 401, "Anonymous queue access must return 401");
    const json1 = await res1.json();
    assert.equal(json1.success, false);
    assert.equal(json1.code, "UNAUTHORIZED");

    // Attempt 2: Paginate queue without authentication (?page=2)
    const res2 = await fetch(`${BASE_URL}/api/track?page=2&limit=20`);
    assert.equal(res2.status, 401, "Anonymous pagination must return 401");
    const json2 = await res2.json();
    assert.equal(json2.code, "UNAUTHORIZED");

    // Attempt 3: Filter by district without authentication
    const res3 = await fetch(`${BASE_URL}/api/track?district=Rajkot`);
    assert.equal(res3.status, 401, "Anonymous filtering must return 401");
  });

  it("Test 24: Supplying an incorrect tracking secret returns 403 Forbidden", async () => {
    // 1. Create test application
    const createRes = await fetch(`${BASE_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizenName: "Secret Test Citizen",
        district: "Rajkot",
        taluka: "Gondal",
        village: "Gomta",
        schemeId: "income-certificate",
      }),
    });
    const { application } = await createRes.json();

    // 2. Query with wrong secret
    const res = await fetch(`${BASE_URL}/api/track?id=${application.id}&secret=wrong-attacker-secret-xyz`);
    assert.equal(res.status, 403, "Incorrect secret must return 403 Forbidden");
    const json = await res.json();
    assert.equal(json.success, false);
  });

  it("Test 25: Excessive requests to tracking endpoint trigger rate limiting (429 Too Many Requests)", async () => {
    // Fire rapid burst of requests from test runner to trigger sliding window limit
    let hit429 = false;
    for (let i = 0; i < 70; i++) {
      const res = await fetch(`${BASE_URL}/api/track?stats=true`, {
        headers: { "x-forwarded-for": "198.51.100.99" },
      });
      if (res.status === 429) {
        hit429 = true;
        const retryAfter = res.headers.get("retry-after");
        assert.ok(retryAfter, "Retry-After header should be present on 429 response");
        break;
      }
    }
    assert.ok(hit429, "Rate limiter must trigger 429 after threshold exceeded");
  });
});
