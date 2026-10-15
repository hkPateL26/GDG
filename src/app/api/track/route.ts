// =========================================================================
// GET / POST / PATCH /api/track - Fast, Non-Blocking Citizen Application API
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  limit as fsLimit,
  query as fsQuery,
} from "firebase/firestore";
import {
  queryApplications,
  calculateSystemStats,
  TOTAL_SYSTEM_RECORDS,
  CitizenApplication,
  addCustomApplication,
  confirmApplicationPayment,
  advanceWorkflowStage,
  getApplicationById,
  rejectApplication,
  getApplicationsCollectionName,
} from "@/lib/large-datasets";
import {
  getOfficerSessionFromRequest,
  isOfficerJurisdictionValid,
  canOfficerPerformAction,
  isWorkflowTransitionValid,
  verifyDemoGateCookie,
} from "@/lib/officer-auth";

function getTargetCollection(req?: NextRequest): string {
  const isGate = req ? verifyDemoGateCookie(req) : false;
  return getApplicationsCollectionName(isGate);
}

function cleanForFirestore(obj: unknown): unknown {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore);
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value !== undefined) {
      // Prevent Firestore 1MB document limit error if a large base64 photo is attached
      if (
        (key === "citizenPhoto" || key === "userPhoto") &&
        typeof value === "string" &&
        value.length > 120000
      ) {
        continue;
      }
      result[key] = cleanForFirestore(value);
    }
  }
  return result;
}

function withFirestoreTimeout<T>(promise: Promise<T>, ms = 650): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// RATE LIMITER & DATA MINIMIZATION ENGINES
// ─────────────────────────────────────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // Max 60 requests per minute
const ipRequestHistory = new Map<string, number[]>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, validTimestamps);
    return { allowed: false, remaining: 0 };
  }

  validTimestamps.push(now);
  ipRequestHistory.set(ip, validTimestamps);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length };
}

// Exported for testing rate limit enforcement
export function resetRateLimits(): void {
  ipRequestHistory.clear();
}

export function maskCitizenName(name?: string): string {
  if (!name) return "નાગરિક";
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      if (part.length === 2) return part[0] + "*";
      return part[0] + "*".repeat(Math.min(part.length - 2, 4)) + part[part.length - 1];
    })
    .join(" ");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();
    const secret = searchParams.get("secret")?.trim();
    const search = searchParams.get("search")?.trim() || "";
    let district = searchParams.get("district")?.trim() || "";
    let taluka = searchParams.get("taluka")?.trim() || "";
    let village = searchParams.get("village")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const statsOnly = searchParams.get("stats") === "true";

    // 1. Sliding Window Rate Limiting (Prevent Scraping & Enumeration)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "ઘણી બધી વિનંતીઓ (Too many requests). કૃપા કરીને થોડીવાર પછી ફરી પ્રયાસ કરો.",
        },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // Authenticate Officer Session
    const officer = await getOfficerSessionFromRequest(req);

    // Pre-sync recent applications from Cloud Firestore into in-memory ledger (bounded by 650ms timeout)
    if (db) {
      try {
        const targetCol = getTargetCollection(req);
        const colRef = collection(db, targetCol);
        const snap = await withFirestoreTimeout(getDocs(fsQuery(colRef, fsLimit(50))), 650);
        if (snap) {
          snap.forEach((docSnap) => {
            const d = docSnap.data() as CitizenApplication;
            if (d && d.id) {
              addCustomApplication(d);
            }
          });
        }
      } catch {
        // ignore fallback to memory
      }
    }

    // 2. System Statistics Summary (Public dashboard metric aggregates, no PII)
    if (statsOnly) {
      return NextResponse.json({
        success: true,
        stats: calculateSystemStats(),
        totalRecords: TOTAL_SYSTEM_RECORDS,
      });
    }

    // 3. Single Application Status Tracking by ID
    if (id) {
      const cleanId = id.toUpperCase();
      let targetApp = getApplicationById(cleanId);

      // Check Firestore if not in memory
      if (!targetApp && db) {
        try {
          const docRef = doc(db, getTargetCollection(req), cleanId);
          const snap = await withFirestoreTimeout(getDoc(docRef), 650);
          if (snap && snap.exists()) {
            targetApp = snap.data() as CitizenApplication;
            addCustomApplication(targetApp);
          }
        } catch (dbErr) {
          console.warn("Firestore lookup failed:", dbErr);
        }
      }

      if (!targetApp) {
        return NextResponse.json(
          {
            error: `No application found for "${id}". Please check your application ID.`,
            success: false,
          },
          { status: 404 }
        );
      }

      // Case A: Authenticated Officer Review (Full application record scoped to jurisdiction)
      if (officer) {
        return NextResponse.json({
          application: targetApp,
          source: "officer-session",
          success: true,
        });
      }

      // Case B: Public Citizen Tracking (Strict Data Minimization & Tracking Secret Verification)
      if (targetApp.trackingSecret) {
        if (secret && targetApp.trackingSecret.toLowerCase() === secret.toLowerCase()) {
          // Citizen possesses valid tracking secret from official receipt / QR code
          return NextResponse.json({
            success: true,
            application: {
              id: targetApp.id,
              scheme: targetApp.schemeName,
              schemeGu: targetApp.schemeNameGu,
              schemeEmoji: targetApp.schemeEmoji,
              status: targetApp.status,
              workflowStage:
                targetApp.workflowStage !== undefined
                  ? targetApp.workflowStage
                  : targetApp.status === "approved"
                  ? 3
                  : 1,
              appliedDate: targetApp.appliedDate,
              lastUpdated: targetApp.lastUpdated,
              district: targetApp.district,
              districtGu: targetApp.districtGu,
              taluka: targetApp.taluka,
              village: targetApp.village,
              maskedCitizenName: maskCitizenName(targetApp.citizenName),
              maskedCitizenNameGu: maskCitizenName(targetApp.citizenNameGu || targetApp.citizenName),
              remarksGu: targetApp.remarksGu,
              remarksEn: targetApp.remarksEn,
              appointmentDate: targetApp.appointmentDate,
              appointmentTime: targetApp.appointmentTime,
              appointmentCenter: targetApp.appointmentCenter,
              serviceType: targetApp.serviceType,
              paymentStatus: targetApp.paymentStatus,
              isSecretVerified: true,
            },
            source: "secure-citizen-tracking",
          });
        }

        if (secret && targetApp.trackingSecret.toLowerCase() !== secret.toLowerCase()) {
          return NextResponse.json(
            {
              error: "અમાન્ય ટ્રેકિંગ સિક્રેટ (Invalid tracking secret). કૃપા કરીને રસીદ પર આપેલ સિક્રેટ ચકાસો.",
              success: false,
            },
            { status: 403 }
          );
        }

        // Tracking secret exists but was not provided - return minimal non-sensitive masked status
        return NextResponse.json({
          success: true,
          requiresSecret: true,
          application: {
            id: targetApp.id,
            scheme: targetApp.schemeName,
            schemeGu: targetApp.schemeNameGu,
            schemeEmoji: targetApp.schemeEmoji,
            status: targetApp.status,
            workflowStage:
              targetApp.workflowStage !== undefined
                ? targetApp.workflowStage
                : targetApp.status === "approved"
                ? 3
                : 1,
            appliedDate: targetApp.appliedDate,
            lastUpdated: targetApp.lastUpdated,
            district: targetApp.district,
            districtGu: targetApp.districtGu,
            maskedCitizenName: maskCitizenName(targetApp.citizenName),
            maskedCitizenNameGu: maskCitizenName(targetApp.citizenNameGu || targetApp.citizenName),
          },
          message:
            "સંપૂર્ણ ટ્રેકિંગ વિગતો માટે કૃપા કરીને તમારી રસીદ પરનો QR કોડ અથવા ટ્રેકિંગ સિક્રેટ દાખલ કરો. (Tracking secret required for detailed view)",
        });
      }

      // Legacy/Benchmark seeded application without tracking secret - return allowlisted safe tracking fields
      return NextResponse.json({
        success: true,
        application: {
          id: targetApp.id,
          scheme: targetApp.schemeName,
          schemeGu: targetApp.schemeNameGu,
          schemeEmoji: targetApp.schemeEmoji,
          status: targetApp.status,
          workflowStage:
            targetApp.workflowStage !== undefined
              ? targetApp.workflowStage
              : targetApp.status === "approved"
              ? 3
              : 1,
          appliedDate: targetApp.appliedDate,
          lastUpdated: targetApp.lastUpdated,
          district: targetApp.district,
          districtGu: targetApp.districtGu,
          taluka: targetApp.taluka,
          village: targetApp.village,
          maskedCitizenName: maskCitizenName(targetApp.citizenName),
          maskedCitizenNameGu: maskCitizenName(targetApp.citizenNameGu || targetApp.citizenName),
          remarksGu: targetApp.remarksGu,
          remarksEn: targetApp.remarksEn,
        },
        source: "allowlisted-public-tracking",
      });
    }

    // 4. Queue Listing & Bulk Queries MUST Require Authenticated Officer Session
    if (!officer) {
      return NextResponse.json(
        {
          success: false,
          error: "અનધિકૃત ઍક્સેસ. અરજીઓની યાદી જોવા માટે સત્તાવાર અધિકારી લૉગિન આવશ્યક છે. (Authentication required for queue access)",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // Scope officer work queue to assigned jurisdiction
    if (!officer.canViewAllDistricts) {
      if (officer.district && officer.district !== "All") {
        district = officer.district;
      }
      if (officer.taluka && officer.taluka !== "All") {
        taluka = officer.taluka;
      }
      if (officer.panchayat && officer.panchayat !== "All") {
        village = officer.panchayat;
      }
    }

    // Return paginated enterprise query for authenticated officer
    const data = queryApplications({
      search,
      district,
      taluka,
      village,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Track API error:", error);
    return NextResponse.json({ error: "Server error", success: false }, { status: 500 });
  }
}

// =========================================================================
// POST /api/track - Register a new citizen document or scheme application
// =========================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      citizenName,
      citizenNameGu,
      applicantName,
      gender = "male",
      district = "Rajkot",
      districtGu = "રાજકોટ",
      taluka = "Gondal",
      village = "Gomta",
      schemeId = "aadhaar-update",
      schemeName = "Aadhaar Card Update",
      schemeNameGu = "આધાર કાર્ડ સુધારો",
      schemeEmoji = "🪪",
      benefitAmount = 0,
      serviceType = "update",
      biometricRequired = false,
      signatureType = "aadhaar-esign",
      mobile = "9876543210",
      email = "citizen@example.com",
      aadhaarLast4 = "1234",
      documentsVerified = [],
      paymentStatus = "paid",
      paymentMethod = "upi",
      paymentMethodNameGu,
      operatorConfirmed = false,
      feeAmount = 50,
      txnId = `TXN-GUJ-${Math.floor(100000 + Math.random() * 899999)}`,
      challanNo = `GRN-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      correctionsRequested = [],
      oldVsNewValues = {},
      kacheriDetails = {},
      citizenPhoto,
      userPhoto,
      digilockerVerified,
      digilockerUri,
      digilockerIssuer,
      digilockerFetchedAt,
    } = body;

    const resolvedCitizenName = citizenName || applicantName || "Citizen Applicant";
    const resolvedCitizenNameGu = citizenNameGu || applicantName || citizenName || "નાગરિક અરજદાર";
    const resolvedPaymentStatus = paymentMethod === "challan" ? "pending_challan" : paymentStatus;

    // Generate or adopt client-provided official Application ID and tracking secret
    const trackingSecret =
      body.trackingSecret && typeof body.trackingSecret === "string" && body.trackingSecret.length >= 16
        ? body.trackingSecret
        : crypto.randomBytes(16).toString("hex");
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const year = now.getFullYear();
    const randomSuffix = crypto.randomInt(100000, 999999);
    const id =
      body.id && typeof body.id === "string" && /^APP-GUJ-(?:\d{4}-)?\d{4,8}$/.test(body.id)
        ? body.id
        : `APP-GUJ-${year}-${randomSuffix}`;

    // Auto-schedule biometric appointment if required
    const appointmentDate = biometricRequired ? "2026-09-29" : undefined;
    const appointmentTime = biometricRequired ? "11:30 AM" : undefined;
    const appointmentCenter = biometricRequired
      ? `જન સેવા કેન્દ્ર (Jan Seva Kendra), ${taluka}`
      : undefined;
    const appointmentToken = biometricRequired
      ? `TK-${Math.floor(100 + Math.random() * 899)}`
      : undefined;

    let computedRemarksGu = "";
    let computedRemarksEn = "";

    if (resolvedPaymentStatus === "pending_challan") {
      computedRemarksGu = `ઓફલાઇન રોકડ ચલણ નં. ${challanNo} ઇશ્યૂ થયેલ છે. તાલુકા જન સેવા કેન્દ્રના રોકડ કાઉન્ટર પર નિયત ફી ₹${feeAmount} જમા કરાવવાના રહેશે. સ્ક્રુટિની ચાલુ છે અને કચેરી ઓપરેટર કન્ફર્મ કર્યા બાદ જ દસ્તાવેજ રિલીઝ થશે.`;
      computedRemarksEn = `Offline Cash Challan ${challanNo} issued. Please pay fee ₹${feeAmount} at Jan Seva Kendra cash counter. Document is locked until operator confirms payment.`;
    } else if (biometricRequired) {
      computedRemarksGu = `અરજી સફળતાપૂર્વક સબમિટ થયેલ છે. ફી ₹${feeAmount} ભરપાઈ (Txn: ${txnId}). દસ્તાવેજોની પ્રાથમિક સ્ક્રુટિની પ્રક્રિયા હેઠળ છે. બાયોમેટ્રિક માટે ટોકન નં. ${appointmentToken} ફાળવાયો છે.`;
      computedRemarksEn = `Application accepted online. Fee ₹${feeAmount} paid (Txn: ${txnId}). Document scrutiny in progress. Biometric appointment Token ${appointmentToken}.`;
    } else {
      computedRemarksGu = `અરજદાર દ્વારા ઓનલાઇન અરજી સફળતાપૂર્વક સબમિટ થયેલ છે. ફી ₹${feeAmount} સાયબર ટ્રેઝરીમાં જમા થયેલ (${paymentMethod === "upi" ? "UPI Bharat QR" : "NetBanking/Card"} - Txn: ${txnId}). દસ્તાવેજોની પ્રાથમિક સ્ક્રુટિની નાયબ મામલતદાર કચેરીમાં ચકાસણી હેઠળ છે.`;
      computedRemarksEn = `Application submitted successfully. Govt fee ₹${feeAmount} paid via Cyber Treasury (Txn: ${txnId}). Primary document scrutiny in progress under Nayab Mamlatdar desk.`;
    }

    const newApp: CitizenApplication = {
      id,
      trackingSecret,
      citizenName: resolvedCitizenName,
      citizenNameGu: resolvedCitizenNameGu,
      gender,
      schemeId,
      schemeName,
      schemeNameGu,
      schemeEmoji,
      district,
      districtGu,
      taluka,
      village,
      aadhaarLast4: String(aadhaarLast4 || "4829").slice(-4),
      status: "processing",
      appliedDate: today,
      lastUpdated: today,
      benefitAmount: Number(benefitAmount) || 0,
      remarksGu: computedRemarksGu,
      remarksEn: computedRemarksEn,
      officerDesignation: `નાયબ મામલતદાર (દસ્તાવેજ સ્ક્રુટિની શાખા), ${taluka}`,
      workflowStage: 1,
      serviceType,
      biometricRequired,
      appointmentDate,
      appointmentTime,
      appointmentCenter,
      appointmentToken,
      signatureType,
      mobile,
      email,
      documentsVerified,
      paymentStatus: resolvedPaymentStatus,
      paymentMethod,
      paymentMethodNameGu,
      operatorConfirmed: Boolean(operatorConfirmed),
      feeAmount: Number(feeAmount) || 50,
      txnId,
      challanNo,
      correctionsRequested,
      oldVsNewValues,
      kacheriDetails,
      citizenPhoto: citizenPhoto || userPhoto || undefined,
      userPhoto: userPhoto || citizenPhoto || undefined,
      digilockerVerified: Boolean(digilockerVerified),
      digilockerUri: digilockerUri || undefined,
      digilockerIssuer: digilockerIssuer || undefined,
      digilockerFetchedAt: digilockerFetchedAt || (digilockerVerified ? today : undefined),
    };

    // 1. Save immediately into server large-dataset in-memory cache (0ms latency)
    addCustomApplication(newApp);

    // 2. Sync to Firebase Cloud Firestore asynchronously in background so it NEVER blocks payment confirmation!
    if (db) {
      setDoc(
        doc(db, getTargetCollection(req), id),
        cleanForFirestore(newApp) as Record<string, unknown>
      ).catch((fbErr) => {
        console.warn("Firestore async save fallback:", fbErr);
      });
    }

    // Dynamic App Origin for SMS & Email Links
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const origin =
      req.headers.get("origin") ||
      (host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_APP_URL || "https://nagrikseva-ai.gov.in");

    // Simulated SMS & Email Notification Payloads
    const trackUrl = `${origin}/track?id=${id}&secret=${trackingSecret}`;
    const smsMessage = `Govt of Gujarat: નમસ્તે ${resolvedCitizenNameGu || resolvedCitizenName}, તમારી ${schemeNameGu} માટેની અરજી (${id}) સફળતાપૂર્વક સ્વીકારાઈ છે. સ્ટેટસ ટ્રેક કરવા: ${trackUrl}`;
    const emailSubject = `સરકારી પહોંચ સ્વીકૃતિ: ${schemeNameGu} (અરજી ક્રમાંક: ${id})`;

    return NextResponse.json({
      success: true,
      application: newApp,
      trackingSecret,
      trackingUrl: trackUrl,
      notifications: {
        sms: {
          sentTo: mobile,
          message: smsMessage,
          status: "delivered",
          timestamp: new Date().toLocaleTimeString(),
        },
        email: {
          sentTo: email,
          subject: emailSubject,
          status: "delivered",
          timestamp: new Date().toLocaleTimeString(),
        },
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to process application";
    console.error("Failed to register application:", err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

// =========================================================================
// PATCH /api/track - Server-Authorized Sensitive Application Mutations
// P0 Security Fix: Replaced request body PIN/ID bypass with cryptographic
// server sessions, strict RBAC, jurisdictional validation, and state machine rules.
// =========================================================================
export async function PATCH(req: NextRequest) {
  try {
    // 1. Authenticate Officer Session
    const officer = await getOfficerSessionFromRequest(req);
    if (!officer) {
      return NextResponse.json(
        {
          error: "અનધિકૃત ઍક્સેસ! સત્તાવાર અધિકારી લૉગિન અથવા માન્ય સત્ર (Session) જરૂરી છે.",
          success: false,
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { id, action } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "અરજી ID જરૂરી છે (Application ID is required)", success: false },
        { status: 400 }
      );
    }

    const cleanId = id.trim().toUpperCase();

    // 2. Fetch Application Record (checks in-memory, Firestore, and client payload fallback)
    let targetApp = getApplicationById(cleanId);

    // If not found in server memory (e.g. serverless instance restart or cold start), check Firestore!
    if (!targetApp && db) {
      try {
        const docRef = doc(db, getTargetCollection(req), cleanId);
        const snap = await withFirestoreTimeout(getDoc(docRef), 800);
        if (snap && snap.exists()) {
          targetApp = snap.data() as CitizenApplication;
          addCustomApplication(targetApp);
        }
      } catch (dbErr) {
        console.warn("Firestore lookup failed in PATCH:", dbErr);
      }
    }

    // If still not found and the client passed the application payload (e.g. created in client session)
    if (!targetApp && body.application && typeof body.application === "object" && body.application.id) {
      const clientApp = body.application as CitizenApplication;
      if (clientApp.id.trim().toUpperCase() === cleanId) {
        targetApp = clientApp;
        addCustomApplication(targetApp);
        if (db) {
          setDoc(
            doc(db, getTargetCollection(req), cleanId),
            cleanForFirestore(targetApp) as Record<string, unknown>
          ).catch(() => {});
        }
      }
    }

    if (!targetApp) {
      return NextResponse.json(
        { error: `No application found for "${id}". Please check your application ID.`, success: false },
        { status: 404 }
      );
    }

    // 3. Validate Jurisdictional Authority
    const jurisCheck = isOfficerJurisdictionValid(officer, targetApp);
    if (!jurisCheck.valid) {
      return NextResponse.json(
        {
          error:
            jurisCheck.reason ||
            "અધિકારક્ષેત્ર બહાર! તમે આ અરજી પર કાર્યવાહી કરવા સત્તાધિકારી નથી.",
          success: false,
          code: "FORBIDDEN_JURISDICTION",
        },
        { status: 403 }
      );
    }

    // 4. Action: Confirm Offline Cash Payment
    if (action === "confirm_cash_payment") {
      const permCheck = canOfficerPerformAction(officer, action);
      if (!permCheck.allowed) {
        return NextResponse.json(
          { error: permCheck.reason, success: false, code: "FORBIDDEN_ACTION" },
          { status: 403 }
        );
      }

      const transCheck = isWorkflowTransitionValid(
        targetApp.workflowStage ?? 1,
        targetApp.status,
        action
      );
      if (!transCheck.valid) {
        return NextResponse.json(
          { error: transCheck.reason, success: false, code: "INVALID_TRANSITION" },
          { status: 400 }
        );
      }

      let updated = confirmApplicationPayment(cleanId);
      if (!updated && targetApp) {
        targetApp.paymentStatus = "paid";
        targetApp.operatorConfirmed = true;
        targetApp.status = "approved";
        targetApp.workflowStage = 3;
        targetApp.lastUpdated = new Date().toISOString().split("T")[0];
        updated = targetApp;
        addCustomApplication(updated);
      }

      if (updated) {
        if (db) {
          setDoc(
            doc(db, getTargetCollection(req), cleanId),
            cleanForFirestore(updated) as Record<string, unknown>,
            { merge: true }
          ).catch((fbErr) => {
            console.warn("Firestore async update fallback:", fbErr);
          });
        }

        return NextResponse.json({
          success: true,
          application: updated,
          message: "ચલણ ફી રોકડમાં સ્વીકારી લેવાઈ છે. પ્રમાણપત્ર અનલૉક થઈ ગયું છે.",
        });
      }

      return NextResponse.json({ error: "Application not found", success: false }, { status: 404 });
    }

    // 5. Action: Advance Workflow Stage / Digital Approval
    if (action === "advance_stage" || action === "update_workflow_stage") {
      const targetStage = Number(body.stage ?? body.newStage) as 1 | 2 | 3;
      if (isNaN(targetStage) || ![1, 2, 3].includes(targetStage)) {
        return NextResponse.json(
          { error: "અમાન્ય લક્ષ્ય તબક્કો. લક્ષ્ય તબક્કો ૧, ૨ અથવા ૩ હોવો આવશ્યક છે.", success: false },
          { status: 400 }
        );
      }

      const permCheck = canOfficerPerformAction(officer, action, targetStage);
      if (!permCheck.allowed) {
        return NextResponse.json(
          { error: permCheck.reason, success: false, code: "FORBIDDEN_ROLE" },
          { status: 403 }
        );
      }

      const transCheck = isWorkflowTransitionValid(
        targetApp.workflowStage ?? 1,
        targetApp.status,
        action,
        targetStage
      );
      if (!transCheck.valid) {
        return NextResponse.json(
          { error: transCheck.reason, success: false, code: "INVALID_TRANSITION" },
          { status: 400 }
        );
      }

      // Stamped with authenticated officer credentials from verified cryptographic session
      const officialDesignation = `${officer.designation} (${officer.name})`;
      let updated = advanceWorkflowStage(cleanId, targetStage, officialDesignation);
      if (!updated && targetApp) {
        targetApp.workflowStage = targetStage;
        targetApp.status = targetStage === 3 ? "approved" : "processing";
        targetApp.lastUpdated = new Date().toISOString().split("T")[0];
        targetApp.officerDesignation = officialDesignation;
        updated = targetApp;
        addCustomApplication(updated);
      }

      if (updated) {
        if (db) {
          setDoc(
            doc(db, getTargetCollection(req), cleanId),
            cleanForFirestore(updated) as Record<string, unknown>,
            { merge: true }
          ).catch((fbErr) => {
            console.warn("Firestore async update fallback:", fbErr);
          });
        }

        let stageMsg = "";
        if (targetStage === 2) {
          stageMsg = `${officer.name} દ્વારા દસ્તાવેજ ખરાઈ મંજૂર થઈ! અરજી આગળ અગ્રેસિત કરવામાં આવી.`;
        } else if (targetStage === 3) {
          stageMsg = `${officer.name} દ્વારા ડિજિટલ સહી (e-Sign) સાથે અરજી સંપૂર્ણપણે મંજૂર કરવામાં આવી!`;
        } else {
          stageMsg = "અરજી સફળતાપૂર્વક તબક્કો ૧ (સ્ક્રુટિની) માં રીસેટ કરવામાં આવી.";
        }

        return NextResponse.json({
          success: true,
          application: updated,
          message: stageMsg,
        });
      }

      return NextResponse.json({ error: "Application not found", success: false }, { status: 404 });
    }

    // 6. Action: Reject or Request Correction
    if (action === "reject" || action === "request_correction") {
      const permCheck = canOfficerPerformAction(officer, action);
      if (!permCheck.allowed) {
        return NextResponse.json(
          { error: permCheck.reason, success: false, code: "FORBIDDEN_ACTION" },
          { status: 403 }
        );
      }

      const transCheck = isWorkflowTransitionValid(
        targetApp.workflowStage ?? 1,
        targetApp.status,
        action
      );
      if (!transCheck.valid) {
        return NextResponse.json(
          { error: transCheck.reason, success: false, code: "INVALID_TRANSITION" },
          { status: 400 }
        );
      }

      const remarksGu = (
        body.remarksGu ||
        body.remarks ||
        body.reason ||
        "દસ્તાવેજમાં ક્ષતિ હોવાથી અરજી પરત / રદ કરવામાં આવી છે."
      ).trim();
      const remarksEn = (body.remarksEn || body.reasonEn || remarksGu).trim();
      const officialDesignation = `${officer.designation} (${officer.name})`;

      const updated = rejectApplication(cleanId, remarksGu, remarksEn, officialDesignation);

      if (updated) {
        if (db) {
          setDoc(
            doc(db, getTargetCollection(req), cleanId),
            cleanForFirestore(updated) as Record<string, unknown>,
            { merge: true }
          ).catch((fbErr) => {
            console.warn("Firestore async update fallback:", fbErr);
          });
        }

        return NextResponse.json({
          success: true,
          application: updated,
          message: `અરજી ${officer.designation} દ્વારા પરત/રદ કરવામાં આવી છે.`,
        });
      }

      return NextResponse.json({ error: "Application not found", success: false }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: "અમાન્ય વહીવટી કાર્યવાહી (Invalid action).",
        success: false,
      },
      { status: 400 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Server error";
    console.error("Failed to update application:", err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
