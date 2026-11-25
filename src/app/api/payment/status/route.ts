// =========================================================================
// GET /api/payment/status
// Real-time Razorpay Order Status & Auto-Capture Engine for NagrikSeva
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import { confirmApplicationPayment } from "@/lib/large-datasets";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const applicationId = searchParams.get("applicationId");

    if (!orderId) {
      return NextResponse.json({ success: false, error: "orderId is required" }, { status: 400 });
    }

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      "rzp_test_ToAhkTKBIwxENQ";
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      "vZzX2lR01orHItU0C3ORL5Sq";

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    // Fetch payments for this specific order from Razorpay
    const rzpRes = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
      headers: { Authorization: `Basic ${basicAuth}` },
      cache: "no-store",
    });

    if (!rzpRes.ok) {
      return NextResponse.json({ success: true, paid: false, status: "pending" });
    }

    const data = await rzpRes.json();
    const payments = data.items || [];

    // Find any payment that is captured or authorized
    let successfulPayment = payments.find(
      (p: { status: string }) => p.status === "captured"
    );

    // If payment is authorized but not captured, capture it immediately!
    if (!successfulPayment) {
      const authorizedPayment = payments.find(
        (p: { status: string }) => p.status === "authorized"
      );

      if (authorizedPayment) {
        try {
          const capRes = await fetch(
            `https://api.razorpay.com/v1/payments/${authorizedPayment.id}/capture`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: authorizedPayment.amount,
                currency: authorizedPayment.currency || "INR",
              }),
            }
          );
          if (capRes.ok) {
            successfulPayment = await capRes.json();
          } else {
            successfulPayment = authorizedPayment;
          }
        } catch (capErr) {
          console.warn("Auto-capture during status check warning:", capErr);
          successfulPayment = authorizedPayment;
        }
      }
    }

    if (successfulPayment) {
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
                razorpayPaymentId: successfulPayment.id,
              },
              { merge: true }
            ).catch((dbErr) => {
              console.warn("Firestore status update warning:", dbErr);
            });
          } catch (dbErr) {
            console.warn("Firestore status update warning:", dbErr);
          }
        }
      }

      return NextResponse.json({
        success: true,
        paid: true,
        status: successfulPayment.status,
        paymentId: successfulPayment.id,
        orderId: orderId,
        amount: successfulPayment.amount,
      });
    }

    return NextResponse.json({
      success: true,
      paid: false,
      status: payments.length > 0 ? payments[0].status : "created",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Status check failed";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
