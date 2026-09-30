// =========================================================================
// GET / POST / PATCH /api/track - Fast, Non-Blocking Citizen Application API
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
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
} from "@/lib/large-datasets";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();
    const search = searchParams.get("search")?.trim() || "";
    const district = searchParams.get("district")?.trim() || "";
    const taluka = searchParams.get("taluka")?.trim() || "";
    const village = searchParams.get("village")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const statsOnly = searchParams.get("stats") === "true";

    // Pre-sync recent applications from Cloud Firestore into in-memory ledger (bounded by 650ms timeout)
    if (db) {
      try {
        const colRef = collection(db, "applications");
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

    // 1. If stats requested
    if (statsOnly) {
      return NextResponse.json({
        success: true,
        stats: calculateSystemStats(),
        totalRecords: TOTAL_SYSTEM_RECORDS,
      });
    }

    // 2. If single application ID is requested
    if (id) {
      const cleanId = id.toUpperCase();

      // Check in-memory dataset first for instant response
      const result = queryApplications({ search: cleanId, page: 1, limit: 1 });
      if (result.records.length > 0) {
        const item = result.records[0];
        return NextResponse.json({
          application: {
            ...item,
            id: item.id,
            scheme: item.schemeName,
            schemeGu: item.schemeNameGu,
            schemeEmoji: item.schemeEmoji,
            status: item.status,
            date: item.appliedDate,
            lastUpdated: item.lastUpdated,
            citizenName: item.citizenName,
            citizenNameGu: item.citizenNameGu,
            district: item.district,
            districtGu: item.districtGu,
            taluka: item.taluka,
            village: item.village,
            aadhaarLast4: item.aadhaarLast4,
            remarks: item.remarksGu,
            remarksEn: item.remarksEn,
            benefitAmount: item.benefitAmount,
            officerDesignation: item.officerDesignation,
            workflowStage:
              item.workflowStage !== undefined
                ? item.workflowStage
                : item.status === "approved"
                ? 3
                : 1,
          },
          source: "enterprise-dataset",
          success: true,
        });
      }

      // Check Firestore if configured (bounded by 650ms timeout)
      if (db) {
        try {
          const docRef = doc(db, "applications", cleanId);
          const snap = await withFirestoreTimeout(getDoc(docRef), 650);
          if (snap && snap.exists()) {
            return NextResponse.json({
              application: snap.data(),
              source: "cloud-firestore",
              success: true,
            });
          }
        } catch (dbErr) {
          console.warn("Firestore lookup failed:", dbErr);
        }
      }

      return NextResponse.json(
        {
          error: `No application found for "${id}". Please check your application ID.`,
          success: false,
        },
        { status: 404 }
      );
    }

    // 3. Otherwise return paginated enterprise query
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
    } = body;

    const resolvedCitizenName = citizenName || applicantName || "Citizen Applicant";
    const resolvedCitizenNameGu = citizenNameGu || applicantName || citizenName || "નાગરિક અરજદાર";
    const resolvedPaymentStatus = paymentMethod === "challan" ? "pending_challan" : paymentStatus;

    // Generate unique official Application ID
    const randomSuffix = Math.floor(5425 + Math.random() * 4500);
    const id = `APP-GUJ-${randomSuffix}`;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

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
    };

    // 1. Save immediately into server large-dataset in-memory cache (0ms latency)
    addCustomApplication(newApp);

    // 2. Sync to Firebase Cloud Firestore asynchronously in background so it NEVER blocks payment confirmation!
    if (db) {
      setDoc(
        doc(db, "applications", id),
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
    const smsMessage = `Govt of Gujarat: નમસ્તે ${resolvedCitizenNameGu || resolvedCitizenName}, તમારી ${schemeNameGu} માટેની અરજી (${id}) સફળતાપૂર્વક સ્વીકારાઈ છે. સ્ટેટસ ટ્રેક કરવા: ${origin}/track?id=${id}`;
    const emailSubject = `સરકારી પહોંચ સ્વીકૃતિ: ${schemeNameGu} (અરજી ક્રમાંક: ${id})`;

    return NextResponse.json({
      success: true,
      application: newApp,
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
// PATCH /api/track - Confirm offline cash payment & Advance Workflow Stage
// =========================================================================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, operatorId, officerId, pin } = body;

    // 1. Confirm offline cash payment (Operator Verification)
    if (action === "confirm_cash_payment" && id) {
      const isOperatorAuthorized =
        operatorId === "JSK-OP-8921" ||
        (officerId && (String(officerId).toUpperCase().startsWith("GUJ") || pin === "GJ2026"));

      if (!isOperatorAuthorized) {
        return NextResponse.json(
          { error: "અનધિકૃત ઍક્સેસ! માન્ય ઓપરેટર અથવા કચેરી ઓળખપત્ર જરૂરી છે.", success: false },
          { status: 401 }
        );
      }

      const updated = confirmApplicationPayment(id);
      if (updated) {
        if (db) {
          setDoc(
            doc(db, "applications", id.toUpperCase()),
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

    // 2. Advance Workflow Stage
    if ((action === "update_workflow_stage" || action === "advance_stage") && id) {
      const isOfficerAuthorized =
        (officerId && (String(officerId).toUpperCase().startsWith("GUJ") || pin === "GJ2026")) ||
        operatorId === "JSK-OP-8921" ||
        (body.officerRole && String(body.officerRole).includes("મામલતદાર")) ||
        (body.officerName && String(body.officerName).includes("મામલતદાર"));

      if (!isOfficerAuthorized) {
        return NextResponse.json(
          { error: "અનધિકૃત ઍક્સેસ! સત્તાવાર અધિકારી લૉગિન જરૂરી છે.", success: false },
          { status: 401 }
        );
      }

      const stage = Number(body.stage ?? body.newStage) as 1 | 2 | 3 | 4;
      const officerRole = body.officerRole ?? body.officerName ?? "તાલુકા મામલતદાર";
      const updated = advanceWorkflowStage(id, stage, officerRole);

      if (updated) {
        if (db) {
          setDoc(
            doc(db, "applications", id.toUpperCase()),
            cleanForFirestore(updated) as Record<string, unknown>,
            { merge: true }
          ).catch((fbErr) => {
            console.warn("Firestore async update fallback:", fbErr);
          });
        }

        let stageMsg = "";
        if (stage === 2) {
          stageMsg = "નાયબ મામલતદાર દ્વારા દસ્તાવેજ ખરાઈ મંજૂર થઈ! અરજી મામલતદાર સાહેબને ફોરવર્ડ થઈ.";
        } else if (stage === 3) {
          stageMsg = "તાલુકા મામલતદાર સાહેબ દ્વારા ડિજિટલ સહી (e-Sign) સાથે અરજી સંપૂર્ણપણે મંજૂર કરવામાં આવી!";
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

    return NextResponse.json({ error: "Invalid action", success: false }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Server error";
    console.error("Failed to update application:", err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
