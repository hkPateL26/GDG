// =========================================================================
// NAGRIKSEVA AI — CRYPTOGRAPHIC OFFICER AUTHENTICATION & AUTHORIZATION ENGINE
// P0 Security Fix: Stateless HMAC-SHA256 Server Sessions, Strict RBAC,
// Jurisdictional Boundaries, and State Transition Enforcement.
// =========================================================================

import crypto from "crypto";
import type { NextRequest } from "next/server";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  type AdminRole,
  type OfficerNode,
  HIERARCHICAL_OFFICERS,
} from "./admin-hierarchy-data";

export const OFFICER_COOKIE_NAME = "nagrik_officer_token";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 Hours

export interface OfficerSessionPayload {
  sessionId: string; // Cryptographically unique session identifier
  officerId: string;
  role: AdminRole;
  tierLevel: 1 | 2 | 3 | 4 | 5;
  name: string;
  designation: string;
  district: string;
  districtGu?: string;
  taluka?: string;
  talukaGu?: string;
  panchayat?: string;
  panchayatGu?: string;
  canApproveEsign: boolean;
  canVerifyPayment: boolean;
  canModifyPolicy: boolean;
  canViewAllDistricts: boolean;
  issuedAt: number; // Unix timestamp ms
  expiresAt: number; // Unix timestamp ms
}

// Deterministic runtime fallback secret for dev/test environments only
let runtimeEphemeralSecret: string | null = null;

/**
 * Resolves the cryptographic secret used to sign and verify officer tokens.
 * Security enforcement:
 * - In production: Strict requirement for OFFICER_AUTH_SECRET or AUTH_SECRET (min 32 chars).
 *   Fails safely if missing or weak.
 * - In dev/test: Uses env var if valid, or a generated runtime key with warning.
 */
export function getOfficerAuthSecret(): string {
  const secret = process.env.OFFICER_AUTH_SECRET || process.env.AUTH_SECRET;

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 32) {
      throw new Error(
        "FATAL: OFFICER_AUTH_SECRET is not configured or shorter than 32 characters in production. Refusing to operate in insecure mode."
      );
    }
    return secret;
  }

  // Non-production environment
  if (secret && secret.length >= 16) {
    return secret;
  }

  if (!runtimeEphemeralSecret) {
    runtimeEphemeralSecret = crypto.randomBytes(32).toString("hex");
    console.warn(
      "[SECURITY NOTICE] OFFICER_AUTH_SECRET not configured. Using ephemeral in-memory secret for development/testing session tokens."
    );
  }
  return runtimeEphemeralSecret;
}
function withFirestoreTimeout<T>(promise: Promise<T>, ms = 650): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

// Shared in-memory revocation store with expiration timestamps
const REVOKED_OFFICER_SESSIONS = new Map<string, number>();

/**
 * Revokes an officer session token so it cannot authorize sensitive actions,
 * even if copied before logout.
 */
export async function revokeOfficerSession(sessionId: string, expiresAt?: number): Promise<void> {
  if (!sessionId) return;
  const exp = expiresAt || Date.now() + SESSION_TTL_SECONDS * 1000;
  REVOKED_OFFICER_SESSIONS.set(sessionId, exp);

  // Sync to Cloud Firestore if connected (for multi-instance deployments)
  if (db) {
    try {
      const docRef = doc(db, "officer_revocations", sessionId);
      await withFirestoreTimeout(
        setDoc(docRef, {
          sessionId,
          revokedAt: Date.now(),
          expiresAt: exp,
        }),
        650
      );
    } catch (dbErr) {
      console.warn("Firestore session revocation sync fallback:", dbErr);
    }
  }
}

/**
 * Synchronous check for session revocation in active process memory.
 */
export function isOfficerSessionRevokedSync(sessionId: string): boolean {
  if (!sessionId) return false;
  const exp = REVOKED_OFFICER_SESSIONS.get(sessionId);
  if (!exp) return false;
  if (Date.now() > exp) {
    REVOKED_OFFICER_SESSIONS.delete(sessionId);
    return false;
  }
  return true;
}

/**
 * Asynchronous check for session revocation across memory and Firestore.
 */
export async function isOfficerSessionRevoked(sessionId: string): Promise<boolean> {
  if (!sessionId) return false;

  // 1. Instant check in synchronized memory map
  if (isOfficerSessionRevokedSync(sessionId)) {
    return true;
  }

  // 2. Query Cloud Firestore for multi-instance deployments
  if (db) {
    try {
      const docRef = doc(db, "officer_revocations", sessionId);
      const snap = await withFirestoreTimeout(getDoc(docRef), 650);
      if (snap && snap.exists()) {
        const data = snap.data();
        const exp = Number(data?.expiresAt) || Date.now() + 3600000;
        REVOKED_OFFICER_SESSIONS.set(sessionId, exp);
        return true;
      }
    } catch (dbErr) {
      console.warn("Firestore revocation lookup fallback:", dbErr);
    }
  }

  return false;
}

/**
 * Creates a signed stateless session token for an authenticated officer.
 * The session payload is strictly populated from the authoritative HIERARCHICAL_OFFICERS
 * registry, preventing caller-supplied role/permission tampering.
 */
export function createOfficerSessionToken(
  officerInput: { id: string },
  ttlSeconds = SESSION_TTL_SECONDS
): string {
  const cleanId = (officerInput.id || "").trim().toUpperCase();
  const authoritativeNode = HIERARCHICAL_OFFICERS.find((o) => o.id === cleanId);

  if (!authoritativeNode) {
    throw new Error(`Unauthorized officer ID: ${cleanId}`);
  }

  const now = Date.now();
  const sessionId = crypto.randomBytes(16).toString("hex");
  const payload: OfficerSessionPayload = {
    sessionId,
    officerId: authoritativeNode.id,
    role: authoritativeNode.role,
    tierLevel: authoritativeNode.tierLevel,
    name: authoritativeNode.name,
    designation: authoritativeNode.designation,
    district: authoritativeNode.district,
    districtGu: authoritativeNode.districtGu,
    taluka: authoritativeNode.taluka,
    talukaGu: authoritativeNode.talukaGu,
    panchayat: authoritativeNode.panchayat,
    panchayatGu: authoritativeNode.panchayatGu,
    canApproveEsign: authoritativeNode.canApproveEsign,
    canVerifyPayment: authoritativeNode.canVerifyPayment,
    canModifyPolicy: authoritativeNode.canModifyPolicy,
    canViewAllDistricts: authoritativeNode.canViewAllDistricts,
    issuedAt: now,
    expiresAt: now + ttlSeconds * 1000,
  };

  const headerB64 = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url");
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const message = `${headerB64}.${payloadB64}`;

  const secret = getOfficerAuthSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64url");

  return `${message}.${signature}`;
}

/**
 * Cryptographically verifies an officer session token.
 * Validates HMAC signature with constant-time equality check, enforces expiration,
 * and checks session revocation.
 */
export function verifyOfficerSessionToken(
  token: string
): { valid: true; session: OfficerSessionPayload } | { valid: false; reason: string } {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "Missing token" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, reason: "Malformed token structure" };
  }

  const [headerB64, payloadB64, signature] = parts;
  const message = `${headerB64}.${payloadB64}`;

  let secret: string;
  try {
    secret = getOfficerAuthSecret();
  } catch (err) {
    return {
      valid: false,
      reason: err instanceof Error ? err.message : "Secret configuration error",
    };
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, reason: "Invalid cryptographic signature" };
  }

  try {
    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadStr) as OfficerSessionPayload;

    if (!payload.sessionId || !payload.officerId || !payload.role || !payload.expiresAt) {
      return { valid: false, reason: "Incomplete token claims" };
    }

    if (Date.now() > payload.expiresAt) {
      return { valid: false, reason: "Session token expired" };
    }

    if (payload.sessionId && isOfficerSessionRevokedSync(payload.sessionId)) {
      return { valid: false, reason: "Session token has been revoked (Logged out)" };
    }

    // Verify officer exists in authoritative registry
    const registeredNode = HIERARCHICAL_OFFICERS.find((o) => o.id === payload.officerId);
    if (!registeredNode) {
      return { valid: false, reason: "Unknown officer identity" };
    }

    return { valid: true, session: payload };
  } catch {
    return { valid: false, reason: "Corrupted token payload" };
  }
}

/**
 * Extracts and verifies the officer session from an incoming Next.js request.
 * Checks both HttpOnly cookie and Authorization: Bearer header, and enforces
 * session revocation across memory and Firestore.
 */
export async function getOfficerSessionFromRequest(
  req: NextRequest
): Promise<OfficerSessionPayload | null> {
  // 1. Check HttpOnly cookie first
  const cookieVal = req.cookies.get(OFFICER_COOKIE_NAME)?.value;
  if (cookieVal) {
    const res = verifyOfficerSessionToken(cookieVal);
    if (res.valid) {
      const revoked = await isOfficerSessionRevoked(res.session.sessionId);
      if (!revoked) return res.session;
    }
  }

  // 2. Check Authorization: Bearer header (for automated testing & API clients)
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken) {
      const res = verifyOfficerSessionToken(bearerToken);
      if (res.valid) {
        const revoked = await isOfficerSessionRevoked(res.session.sessionId);
        if (!revoked) return res.session;
      }
    }
  }

  return null;
}

/**
 * Returns security cookie options for setting/clearing the officer session token.
 */
export function getOfficerCookieConfig(req?: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const proto = req?.headers.get("x-forwarded-proto");
  const isHttps = proto === "https" || req?.url.startsWith("https");

  return {
    name: OFFICER_COOKIE_NAME,
    httpOnly: true,
    secure: isProd || isHttps,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export const DEMO_GATE_COOKIE_NAME = "nagrik_demo_gate";
export const DEFAULT_DEMO_GATE_PASSCODE = "GUJ-DEMO-2026";

/**
 * Returns security cookie options for the demo gate.
 */
export function getDemoGateCookieConfig(req?: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const proto = req?.headers.get("x-forwarded-proto");
  const isHttps = proto === "https" || req?.url.startsWith("https");

  return {
    name: DEMO_GATE_COOKIE_NAME,
    httpOnly: true,
    secure: isProd || isHttps,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 4 * 60 * 60, // 4 hours demo session
  };
}

/**
 * Creates a cryptographically signed value for the demo gate cookie.
 */
export function createDemoGateCookieValue(): string {
  const secret = getOfficerAuthSecret();
  const timestamp = Date.now().toString();
  const sig = crypto.createHmac("sha256", secret).update(`demo-gate-${timestamp}`).digest("hex");
  return `${timestamp}.${sig}`;
}

/**
 * Validates the demo gate cookie from the request.
 */
export function verifyDemoGateCookie(req: NextRequest | Request): boolean {
  try {
    let cookieVal: string | undefined;
    if ("cookies" in req && typeof (req as NextRequest).cookies?.get === "function") {
      cookieVal = (req as NextRequest).cookies.get(DEMO_GATE_COOKIE_NAME)?.value;
    } else {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(new RegExp(`${DEMO_GATE_COOKIE_NAME}=([^;]+)`));
      cookieVal = match ? match[1] : undefined;
    }

    if (!cookieVal) {
      // Also support custom header for API clients, testing, or kiosks
      const headerKey = req.headers.get("x-demo-gate-passcode");
      if (headerKey && headerKey.trim() === (process.env.DEMO_GATE_PASSCODE || DEFAULT_DEMO_GATE_PASSCODE)) {
        return true;
      }
      return false;
    }

    const [timestampStr, sig] = cookieVal.split(".");
    if (!timestampStr || !sig) return false;

    const timestamp = parseInt(timestampStr, 10);
    // Expire after 8 hours max
    if (isNaN(timestamp) || Date.now() - timestamp > 8 * 60 * 60 * 1000) {
      return false;
    }

    const secret = getOfficerAuthSecret();
    const expectedSig = crypto.createHmac("sha256", secret).update(`demo-gate-${timestampStr}`).digest("hex");

    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// JURISDICTION VALIDATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function isDistrictRajkot(district?: string, districtGu?: string): boolean {
  const d = (district || "").toLowerCase().trim();
  const dGu = (districtGu || "").trim();
  return d.includes("rajkot") || dGu.includes("રાજકોટ") || d === "rajkot" || d === "";
}

function isTalukaGondal(taluka?: string): boolean {
  if (!taluka) return false;
  const t = taluka.toLowerCase().trim();
  return t.includes("gondal") || t.includes("ગોંડલ");
}

function isTalukaInGondalPrant(taluka?: string): boolean {
  if (!taluka) return false;
  const t = taluka.toLowerCase().trim();
  return (
    t.includes("gondal") ||
    t.includes("ગોંડલ") ||
    t.includes("kotda") ||
    t.includes("કોટડા") ||
    t.includes("lodhika") ||
    t.includes("લોધિકા")
  );
}

function isVillageGomta(village?: string): boolean {
  if (!village) return false;
  const v = village.toLowerCase().trim();
  return (
    v.includes("gomta") ||
    v.includes("ગોમટા") ||
    v.includes("momta") ||
    v.includes("મોમટા")
  );
}

/**
 * Validates whether an authenticated officer possesses legitimate jurisdiction
 * over the specified application according to the 5-tier Gujarat administrative model.
 */
export function isOfficerJurisdictionValid(
  officer: OfficerSessionPayload,
  app: {
    district?: string;
    districtGu?: string;
    taluka?: string;
    village?: string;
  }
): { valid: boolean; reason?: string } {
  // Tier 1: State Secretariat (Apex Authority) — Jurisdiction over all Gujarat
  if (officer.tierLevel === 1 || officer.role === "state_admin") {
    return { valid: true };
  }

  // Tier 2: District Collector (Rajkot) — Jurisdiction over entire Rajkot district
  if (officer.tierLevel === 2 || officer.role === "district_collector") {
    if (isDistrictRajkot(app.district, app.districtGu)) {
      return { valid: true };
    }
    return {
      valid: false,
      reason: `અધિકારક્ષેત્ર બહાર: કલેક્ટર ${officer.name} માત્ર ${officer.district} જિલ્લાની અરજીઓ પર કાર્યવાહી કરી શકે છે.`,
    };
  }

  // Tier 3: SDM / Prant Officer (Gondal Sub-Division: Gondal, Kotda Sangani, Lodhika)
  if (officer.tierLevel === 3 || officer.role === "sdm_prant") {
    if (!isDistrictRajkot(app.district, app.districtGu)) {
      return {
        valid: false,
        reason: `અધિકારક્ષેત્ર બહાર: પ્રાંત અધિકારી ${officer.name} માત્ર રાજકોટ જિલ્લાની અરજીઓ સંભાળી શકે છે.`,
      };
    }
    if (isTalukaInGondalPrant(app.taluka)) {
      return { valid: true };
    }
    return {
      valid: false,
      reason: `અધિકારક્ષેત્ર બહાર: પ્રાંત અધિકારી (ગોંડલ સબ-ડિવિઝન) માત્ર ગોંડલ, કોટડા સાંગાણી અને લોધિકા તાલુકાની અરજીઓ સંભાળી શકે છે. (${app.taluka || "અજ્ઞાત"} અમાન્ય છે)`,
    };
  }

  // Tier 4: Taluka Mamlatdar (Gondal Taluka only)
  if (officer.tierLevel === 4 || officer.role === "mamlatdar") {
    if (!isDistrictRajkot(app.district, app.districtGu) || !isTalukaGondal(app.taluka)) {
      return {
        valid: false,
        reason: `અધિકારક્ષેત્ર બહાર: મામલતદાર ${officer.name} માત્ર ગોંડલ તાલુકાની અરજીઓ પર કાર્યવાહી કરી શકે છે.`,
      };
    }
    return { valid: true };
  }

  // Tier 5: Talati Mantri (Gomta Gram Panchayat only)
  if (officer.tierLevel === 5 || officer.role === "talati") {
    if (
      !isDistrictRajkot(app.district, app.districtGu) ||
      !isTalukaGondal(app.taluka) ||
      !isVillageGomta(app.village)
    ) {
      return {
        valid: false,
        reason: `અધિકારક્ષેત્ર બહાર: તલાટી ${officer.name} માત્ર ગોમટા ગ્રામ પંચાયતની અરજીઓ પર કાર્યવાહી કરી શકે છે. (${app.village || "અજ્ઞાત"} અમાન્ય છે)`,
      };
    }
    return { valid: true };
  }

  return { valid: false, reason: "અજાણી વહીવટી ભૂમિકા અથવા અધિકારક્ષેત્ર." };
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW ACTION & PERMISSION VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates whether an authenticated officer's role has permission to execute
 * the requested sensitive administrative action.
 */
export function canOfficerPerformAction(
  officer: OfficerSessionPayload,
  action: string,
  targetStage?: number
): { allowed: boolean; reason?: string } {
  if (action === "confirm_cash_payment") {
    if (!officer.canVerifyPayment) {
      return {
        allowed: false,
        reason: `અનધિકૃત કાર્યવાહી: ${officer.designation} પાસે ફી ચુકવણી પ્રમાણિત કરવાની સત્તા નથી.`,
      };
    }
    return { allowed: true };
  }

  if (action === "advance_stage" || action === "update_workflow_stage") {
    // Stage 3: Digital Approval & e-Sign Execution
    if (targetStage === 3) {
      if (!officer.canApproveEsign) {
        return {
          allowed: false,
          reason: `અનધિકૃત કાર્યવાહી: ${officer.designation} (${officer.tierLevel} સ્તર) પાસે આખરી ડિજિટલ સહી (e-Sign) મંજૂર કરવાની સત્તા નથી. મામલતદાર કે તેથી ઉચ્ચ અધિકારી લૉગિન જરૂરી છે.`,
        };
      }
      return { allowed: true };
    }

    // Stage 2: Forwarding to Mamlatdar for verification
    if (targetStage === 2) {
      return { allowed: true };
    }

    // Stage 1: Document Scrutiny reset
    if (targetStage === 1) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `અમાન્ય લક્ષ્ય તબક્કો: ${targetStage}. માત્ર તબક્કો ૧, ૨ અથવા ૩ માન્ય છે.`,
    };
  }

  if (action === "reject" || action === "request_correction") {
    // Reviewing officers can return applications for correction
    return { allowed: true };
  }

  return { allowed: false, reason: `અજાણી વહીવટી કાર્યવાહી: ${action}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE TRANSITION VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates state transitions to prevent unauthorized stage skips,
 * duplicate approvals, or invalid status mutations.
 */
export function isWorkflowTransitionValid(
  currentStage: number,
  currentStatus: string,
  action: string,
  targetStage?: number
): { valid: boolean; reason?: string } {
  // Prevent duplicate approvals
  if (currentStatus === "approved" || currentStage === 3) {
    if (action === "advance_stage" && targetStage === 3) {
      return {
        valid: false,
        reason: "અરજી પહેલેથી જ ડિજિટલ સહી (e-Sign) સાથે મંજૂર થઈ ચૂકી છે. પુનઃ મંજૂરી અમાન્ય છે.",
      };
    }
    if (action === "confirm_cash_payment") {
      return {
        valid: false,
        reason: "અરજી પહેલેથી જ મંજૂર થયેલ છે. ચુકવણી પુનરાવર્તન અમાન્ય છે.",
      };
    }
    if (action === "reject" || action === "request_correction") {
      return {
        valid: false,
        reason: "મંજૂર થયેલ અરજીને સીધી રિજેક્ટ કરી શકાતી નથી. સત્તાવાર રદ્દીકરણ પ્રક્રિયા જરૂરી છે.",
      };
    }
  }

  if (action === "advance_stage" || action === "update_workflow_stage") {
    if (targetStage === undefined || ![1, 2, 3].includes(targetStage)) {
      return {
        valid: false,
        reason: "અમાન્ય લક્ષ્ય તબક્કો. લક્ષ્ય તબક્કો ૧, ૨ અથવા ૩ હોવો આવશ્યક છે.",
      };
    }

    // Cannot advance to the exact same stage
    if (targetStage === currentStage && currentStatus !== "rejected") {
      return {
        valid: false,
        reason: `અરજી પહેલેથી જ તબક્કો ${currentStage} પર છે.`,
      };
    }
  }

  return { valid: true };
}
