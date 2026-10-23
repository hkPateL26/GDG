// =========================================================================
// POST & GET /api/payment/callback
// Official Razorpay Server Callback Redirect Handler for Android WebView & Web
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { confirmApplicationPayment } from "@/lib/large-datasets";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryAppId = url.searchParams.get("applicationId");

    let paymentId = "";
    let orderId = "";
    let signature = "";
    let bodyAppId = "";
    let errorDesc = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      paymentId = (formData.get("razorpay_payment_id") as string) || "";
      orderId = (formData.get("razorpay_order_id") as string) || "";
      signature = (formData.get("razorpay_signature") as string) || "";
      bodyAppId = (formData.get("applicationId") as string) || "";
      errorDesc = (formData.get("error[description]") as string) || "";
    } else {
      const json = await req.json().catch(() => ({}));
      paymentId = json.razorpay_payment_id || "";
      orderId = json.razorpay_order_id || "";
      signature = json.razorpay_signature || "";
      bodyAppId = json.applicationId || "";
      errorDesc = json["error[description]"] || json.error?.description || "";
    }

    const targetAppId = (queryAppId || bodyAppId || "").trim().toUpperCase();

    if (errorDesc && !paymentId) {
      console.warn("Razorpay callback returned error:", errorDesc);
      return NextResponse.redirect(
        new URL(`/payment/receipt?error=${encodeURIComponent(errorDesc)}&id=${encodeURIComponent(targetAppId)}`, req.url),
        303
      );
    }

    if (!paymentId) {
      return NextResponse.redirect(new URL("/documents", req.url), 303);
    }

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      "rzp_test_ToAhkTKBIwxENQ";
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      "vZzX2lR01orHItU0C3ORL5Sq";

    // Explicit Capture Check: Ensure payment is captured on Razorpay
    if (keyId && keySecret) {
      try {
        const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const payCheck = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Basic ${basicAuth}` },
        });
        if (payCheck.ok) {
          const payData = await payCheck.json();
          if (payData.status === "authorized") {
            await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
              method: "POST",
              headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ amount: payData.amount, currency: payData.currency || "INR" }),
            });
            console.log(`Razorpay callback captured payment ${paymentId}`);
          }
        }
      } catch (capErr) {
        console.warn("Razorpay callback auto-capture check:", capErr);
      }
    }

    // Update Application Record in database & memory
    if (targetAppId) {
      confirmApplicationPayment(targetAppId);
      if (db) {
        try {
          const docRef = doc(db, "citizen_applications", targetAppId);
          await setDoc(
            docRef,
            {
              paymentStatus: "paid",
              operatorConfirmed: true,
              status: "approved",
              workflowStage: 3,
              lastUpdated: new Date().toISOString().split("T")[0],
              razorpayPaymentId: paymentId,
              razorpayOrderId: orderId,
            },
            { merge: true }
          );
        } catch (dbErr) {
          console.warn("Firestore callback payment update warning:", dbErr);
        }
      }
    }

    // Redirect user directly to the official digital receipt page
    const redirectUrl = new URL(
      `/payment/receipt?id=${encodeURIComponent(targetAppId)}&paymentId=${encodeURIComponent(paymentId)}&orderId=${encodeURIComponent(orderId)}&verified=true`,
      req.url
    );

    return NextResponse.redirect(redirectUrl, 303);
  } catch (err: unknown) {
    console.error("Razorpay callback error:", err);
    return NextResponse.redirect(new URL("/documents", req.url), 303);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const paymentId = url.searchParams.get("razorpay_payment_id") || "";
  const orderId = url.searchParams.get("razorpay_order_id") || "";
  const targetAppId = (url.searchParams.get("applicationId") || "").trim().toUpperCase();

  if (targetAppId) {
    confirmApplicationPayment(targetAppId);
  }

  const redirectUrl = new URL(
    `/payment/receipt?id=${encodeURIComponent(targetAppId)}&paymentId=${encodeURIComponent(paymentId)}&orderId=${encodeURIComponent(orderId)}&verified=true`,
    req.url
  );

  return NextResponse.redirect(redirectUrl, 303);
}
