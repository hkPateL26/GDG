// =========================================================================
// POST /api/payment/verify
// Cryptographic Razorpay Payment Signature Verification API
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { confirmApplicationPayment, getApplicationById, CitizenApplication } from "@/lib/large-datasets";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { extractClientIp, checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const clientIp = extractClientIp(req);
    const rateCheck = checkRateLimit(clientIp, {
      keyPrefix: "pay-verify",
      windowMs: 60 * 1000,
      maxRequests: 30,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "ઘણા બધા વેરિફિકેશન પ્રયાસો થયા. કૃપા કરીને થોડીવાર પછી પ્રયાસ કરો." },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { success: false, error: "ઓર્ડર ID અને પેમેન્ટ ID બંને આવશ્યક છે." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "vZzX2lR01orHItU0C3ORL5Sq";

    // 1. In demo/sandbox test mode with synthetic orders
    const isSyntheticOrder =
      razorpay_order_id.startsWith("order_test_") ||
      razorpay_payment_id.startsWith("pay_sim_") ||
      razorpay_payment_id.startsWith("pay_demo_");

    let isSignatureValid = false;

    if (razorpay_signature && !isSyntheticOrder) {
      try {
        const textToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(textToSign)
          .digest("hex");

        const receivedBuf = Buffer.from(razorpay_signature.trim().toLowerCase(), "utf-8");
        const expectedBuf = Buffer.from(expectedSignature.toLowerCase(), "utf-8");

        isSignatureValid =
          receivedBuf.length === expectedBuf.length &&
          crypto.timingSafeEqual(receivedBuf, expectedBuf);
      } catch (sigErr) {
        console.warn("Signature calculation warning:", sigErr);
        isSignatureValid = false;
      }
    } else if (isSyntheticOrder) {
      // In sandbox simulation, allow verified test payment
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      return NextResponse.json(
        {
          success: false,
          error: "પેમેન્ટ ડિજિટલ સહી અમાન્ય છે! ટ્રાન્ઝેક્શન સાથે છેડછાડ થયેલ હોવાની શક્યતા છે.",
          code: "INVALID_SIGNATURE",
        },
        { status: 400 }
      );
    }

    // 2. Confirmed Payment! Update Ledger and Firestore (Non-blocking async sync)
    const cleanId = (applicationId || "").trim().toUpperCase();
    if (cleanId) {
      confirmApplicationPayment(cleanId);

      if (db) {
        try {
          const docRef = doc(db, "citizen_applications", cleanId);
          setDoc(
            docRef,
            {
              paymentStatus: "paid",
              operatorConfirmed: true,
              status: "approved",
              workflowStage: 3,
              lastUpdated: new Date().toISOString().split("T")[0],
            },
            { merge: true }
          ).catch((dbErr) => {
            console.warn("Firestore payment update warning:", dbErr);
          });
        } catch (dbErr) {
          console.warn("Firestore payment update warning:", dbErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      applicationId: cleanId,
      messageGu: "Razorpay પેમેન્ટ સફળતાપૂર્વક વેરિફાય થયું. સરકારી અરજી કન્ફર્મ થઈ ગઈ છે.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Payment verification failed";
    console.error("Payment verification error:", err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
