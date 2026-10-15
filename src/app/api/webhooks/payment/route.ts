// =========================================================================
// POST /api/webhooks/payment
// National Payment Gateway Webhook Receiver & Cryptographic Verifier
// Compatible with Razorpay, PayGov, Cyber Treasury & NPCI Webhook Standards
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, generateTestWebhookSignature, getWebhookSecret } from "@/lib/webhook-verifier";
import { confirmApplicationPayment, getApplicationById, addCustomApplication, CitizenApplication } from "@/lib/large-datasets";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { extractClientIp, checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (Prevents Webhook Endpoint Flooding/DoS)
    const clientIp = extractClientIp(req);
    const rateCheck = checkRateLimit(clientIp, {
      keyPrefix: "webhook-payment",
      windowMs: 60 * 1000,
      maxRequests: 120, // High throughput for payment webhooks
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many webhook requests from this IP" },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
      );
    }

    // 2. Read Raw Request Body
    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json(
        { success: false, error: "Empty webhook payload" },
        { status: 400 }
      );
    }

    // 3. Extract Signature & Timestamp Headers
    // Supports standard headers across Razorpay ('x-razorpay-signature') and CyberTreasury/PayGov ('x-webhook-signature')
    const signature =
      req.headers.get("x-webhook-signature") ||
      req.headers.get("x-razorpay-signature") ||
      req.headers.get("x-paygov-signature");

    const timestamp =
      req.headers.get("x-webhook-timestamp") ||
      req.headers.get("x-razorpay-timestamp");

    // 4. Cryptographic HMAC-SHA256 Verification with Replay Attack Prevention
    const verification = verifyWebhookSignature(rawBody, signature, timestamp);

    if (!verification.isValid) {
      console.warn(`[SECURITY ALERT] Rejected spoofed webhook from ${clientIp}:`, verification.errorCode);
      return NextResponse.json(
        {
          success: false,
          error: "Cryptographic signature verification failed",
          errorCode: verification.errorCode,
          messageGu: verification.errorMessageGu,
        },
        { status: 401 }
      );
    }

    // 5. Signature Verified! Process the Payment Event Safely
    const event = verification.payload;
    const eventType = event.event || event.type || "payment.captured";
    const paymentData = event.payload?.payment?.entity || event.data || event;

    // Identify application ID from payment metadata or notes
    const applicationId =
      paymentData.notes?.application_id ||
      paymentData.notes?.applicationId ||
      paymentData.applicationId ||
      paymentData.id;

    if (applicationId && (eventType === "payment.captured" || eventType === "order.paid" || eventType === "challan.cleared")) {
      const cleanId = String(applicationId).trim().toUpperCase();

      // Update in-memory ledger
      confirmApplicationPayment(cleanId);

      // Sync to Cloud Firestore if connected
      if (db) {
        try {
          const docRef = doc(db, "citizen_applications", cleanId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data() as CitizenApplication;
            data.paymentStatus = "paid";
            data.operatorConfirmed = true;
            data.status = "approved";
            data.workflowStage = 3;
            data.lastUpdated = new Date().toISOString().split("T")[0];
            await setDoc(docRef, data, { merge: true });
          }
        } catch (dbErr) {
          console.warn("Firestore webhook sync warning:", dbErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      event: eventType,
      applicationId: applicationId || null,
      messageGu: "ડિજિટલ સહી ચકાસણી સફળ. પેમેન્ટ વેબહૂક સુરક્ષિત રીતે પ્રોસેસ થયું.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Webhook processing error";
    console.error("Webhook processing error:", err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

/**
 * GET /api/webhooks/payment
 * Security Endpoint Diagnostics & Test Signature Generator for Local Developers
 */
export async function GET() {
  const samplePayload = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_test_901284",
          amount: 5000,
          currency: "INR",
          status: "captured",
          notes: {
            application_id: "APP-GUJ-2026-102941",
          },
        },
      },
    },
    created_at: Math.floor(Date.now() / 1000),
  });

  const sampleSignature = generateTestWebhookSignature(samplePayload);

  return NextResponse.json({
    status: "active",
    protocol: "HMAC-SHA256 Webhook Verification Engine",
    specifications: {
      algorithm: "HMAC-SHA256",
      acceptedHeaders: ["x-webhook-signature", "x-razorpay-signature", "x-paygov-signature"],
      timestampHeader: "x-webhook-timestamp",
      replayToleranceSeconds: 300,
    },
    demoTestSimulator: {
      samplePayload,
      sampleSignature,
      hint: "POST the samplePayload to this endpoint with header 'x-webhook-signature: " + sampleSignature + "'",
    },
  });
}
