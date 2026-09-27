// =========================================================================
// GET /api/track - Look up application status or query large-scale dataset
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  queryApplications,
  calculateSystemStats,
  TOTAL_SYSTEM_RECORDS,
  CitizenApplication,
  addCustomApplication,
} from "@/lib/large-datasets";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();
    const search = searchParams.get("search")?.trim() || "";
    const district = searchParams.get("district")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const statsOnly = searchParams.get("stats") === "true";

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

      // Check Firestore if configured
      if (db) {
        try {
          const docRef = doc(db, "applications", cleanId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            return NextResponse.json({
              application: snap.data(),
              source: "cloud-firestore",
              success: true,
            });
          }
        } catch (dbErr) {
          console.warn("Firestore lookup failed, checking large dataset:", dbErr);
        }
      }

      // Query from 5,000+ realistic dataset
      const result = queryApplications({ search: cleanId, page: 1, limit: 1 });
      if (result.records.length > 0) {
        const item = result.records[0];
        return NextResponse.json({
          application: {
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
          },
          source: "enterprise-dataset",
          success: true,
        });
      }

      return NextResponse.json(
        { error: `No application found for "${id}". Please check your application ID.`, success: false },
        { status: 404 }
      );
    }

    // 3. Otherwise return paginated enterprise query
    const data = queryApplications({
      search,
      district,
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
      feeAmount = 50,
      txnId = `TXN-GUJ-${Math.floor(100000 + Math.random() * 899999)}`,
      challanNo = `GRN-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      correctionsRequested = [],
      oldVsNewValues = {},
      kacheriDetails = {},
    } = body;

    const resolvedCitizenName = citizenName || applicantName || "Citizen Applicant";
    const resolvedCitizenNameGu = citizenNameGu || applicantName || citizenName || "નાગરિક અરજદાર";

    // Generate unique official Application ID
    const randomSuffix = Math.floor(5425 + Math.random() * 4500);
    const id = `APP-GUJ-${randomSuffix}`;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Auto-schedule biometric appointment if required
    const appointmentDate = biometricRequired ? "2026-09-29" : undefined;
    const appointmentTime = biometricRequired ? "11:30 AM" : undefined;
    const appointmentCenter = biometricRequired ? `જન સેવા કેન્દ્ર (Jan Seva Kendra), ${taluka}` : undefined;
    const appointmentToken = biometricRequired ? `TK-${Math.floor(100 + Math.random() * 899)}` : undefined;

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
      aadhaarLast4: aadhaarLast4.slice(-4),
      status: "processing", // initial active state
      appliedDate: today,
      lastUpdated: today,
      benefitAmount: Number(benefitAmount) || 0,
      remarksGu: biometricRequired
        ? `અરજી ઓનલાઇન સ્વીકારાઈ છે. ફિંગરપ્રિન્ટ/બાયોમેટ્રિક માટે ટોકન નં. ${appointmentToken} ફાળવાયો છે. ટ્રેઝરી ચલણ: ${challanNo}`
        : `તમામ દસ્તાવેજો AI વેરિફાઈડ. સરકારી ફી ₹${feeAmount} જમા થયેલ (Txn: ${txnId}). મામલતદાર કચેરી ${taluka} દ્વારા આખરી ચકાસણી પ્રક્રિયામાં છે.`,
      remarksEn: biometricRequired
        ? `Application accepted online. Biometric appointment scheduled with Token ${appointmentToken}. Treasury Challan: ${challanNo}`
        : `All documents AI-verified. Govt fee of ₹${feeAmount} received (Txn: ${txnId}). Final review in progress at Taluka Mamlatdar office.`,
      officerDesignation: `નાયબ મામલતદાર, જન સેવા કેન્દ્ર ${taluka}`,
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
      paymentStatus,
      feeAmount: Number(feeAmount) || 50,
      txnId,
      challanNo,
      correctionsRequested,
      oldVsNewValues,
      kacheriDetails,
    };

    // Save into server large-dataset in-memory cache
    addCustomApplication(newApp);

    // Save into Firebase Cloud Firestore if active
    if (db) {
      try {
        const { setDoc, doc: fsDoc } = await import("firebase/firestore");
        await setDoc(fsDoc(db, "applications", id), newApp);
      } catch (fbErr) {
        console.warn("Firestore save fallback:", fbErr);
      }
    }

    // Simulated SMS & Email Notification Payloads
    const smsMessage = `Govt of Gujarat: નમસ્તે ${resolvedCitizenNameGu || resolvedCitizenName}, તમારી ${schemeNameGu} માટેની અરજી (${id}) સફળતાપૂર્વક સ્વીકારાઈ છે. સ્ટેટસ ટ્રેક કરવા: https://nagrikseva-ai-one.vercel.app/track?id=${id}`;
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
  } catch (err: any) {
    console.error("Failed to register application:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to process application" }, { status: 500 });
  }
}
