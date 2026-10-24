// =========================================================================
// POST & GET /api/payment/callback
// Official Razorpay Server Callback Redirect Handler for Android WebView & Web
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import { confirmApplicationPayment } from "@/lib/large-datasets";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

function buildHtmlRedirect(receiptUrl: string, titleGu: string, messageGu: string, isError = false) {
  const icon = isError ? "✕" : "✅";
  const iconColor = isError ? "#ef4444" : "#10b981";
  const titleColor = isError ? "#f87171" : "#34d399";
  const btnGradient = isError
    ? "linear-gradient(135deg, #ef4444, #dc2626)"
    : "linear-gradient(135deg, #10b981, #059669)";

  return `<!DOCTYPE html>
<html lang="gu">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleGu} • NagrikSeva AI</title>
  <style>
    * { box-sizing: border-box; }
    body {
      background: #020617;
      color: #ffffff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .card {
      background: #0f172a;
      border: 1px solid ${isError ? "#ef4444" : "#10b981"};
      border-radius: 24px;
      padding: 36px 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .icon {
      font-size: 50px;
      line-height: 1;
      margin-bottom: 16px;
      color: ${iconColor};
    }
    h2 {
      font-size: 20px;
      margin: 0 0 10px;
      color: ${titleColor};
      font-weight: 800;
    }
    p {
      font-size: 14px;
      color: #94a3b8;
      margin: 0 0 24px;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      background: ${btnGradient};
      color: white;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 14px;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 16px auto 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h2>${titleGu}</h2>
    <p>${messageGu}</p>
    <a href="${receiptUrl}" class="btn" id="directLink">અહીં ક્લિક કરો</a>
    <div class="spinner"></div>
  </div>
  <script>
    (function() {
      var target = "${receiptUrl}";
      try {
        if (window.top && window.top !== window) {
          window.top.location.href = target;
        } else {
          window.location.replace(target);
        }
      } catch (e) {
        window.location.href = target;
      }
      // Safety fallback in case immediate navigation was queued
      setTimeout(function() {
        try {
          if (window.top) window.top.location.href = target;
          else window.location.href = target;
        } catch(e) {
          window.location.href = target;
        }
      }, 300);
    })();
  </script>
</body>
</html>`;
}

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

    // 1. Handle error descriptions from Razorpay callback
    if (errorDesc && !paymentId) {
      console.warn("Razorpay callback returned error:", errorDesc);
      const errReceiptUrl = `/payment/receipt?error=${encodeURIComponent(errorDesc)}&id=${encodeURIComponent(targetAppId)}`;
      const html = buildHtmlRedirect(
        errReceiptUrl,
        "પેમેન્ટ પ્રક્રિયા પૂર્ણ થઈ શકી નથી",
        decodeURIComponent(errorDesc),
        true
      );
      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Security-Policy": "frame-ancestors *",
          "X-Frame-Options": "ALLOWALL",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    if (!paymentId) {
      const fallbackUrl = `/documents`;
      const html = buildHtmlRedirect(fallbackUrl, "અરજી પોર્ટલ પર પાછા ફરી રહ્યા છીએ", "પેમેન્ટ ID મળેલ નથી.", true);
      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Security-Policy": "frame-ancestors *",
          "X-Frame-Options": "ALLOWALL",
        },
      });
    }

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      "rzp_test_ToAhkTKBIwxENQ";
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      "vZzX2lR01orHItU0C3ORL5Sq";

    // 2. Explicit Capture Check: Ensure payment is captured on Razorpay
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

    // 3. Update Application Record in memory & Firestore
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

    // 4. Return HTML redirect designed to break out of Razorpay iframe cleanly
    const receiptUrl = `/payment/receipt?id=${encodeURIComponent(targetAppId)}&paymentId=${encodeURIComponent(paymentId)}&orderId=${encodeURIComponent(orderId)}&verified=true`;
    const html = buildHtmlRedirect(
      receiptUrl,
      "પેમેન્ટ સફળતાપૂર્વક પૂર્ણ થયું!",
      "સાયબર ટ્રેઝરીમાં ફી જમા થઈ ગઈ છે. સત્તાવાર ડિજિટલ પહોંચ ખુલી રહી છે..."
    );

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": "frame-ancestors *",
        "X-Frame-Options": "ALLOWALL",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err: unknown) {
    console.error("Razorpay callback error:", err);
    const html = buildHtmlRedirect("/documents", "અરજી પોર્ટલ", "પુનઃપ્રયાસ કરો.", true);
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": "frame-ancestors *",
        "X-Frame-Options": "ALLOWALL",
      },
    });
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

  const receiptUrl = `/payment/receipt?id=${encodeURIComponent(targetAppId)}&paymentId=${encodeURIComponent(paymentId)}&orderId=${encodeURIComponent(orderId)}&verified=true`;
  const html = buildHtmlRedirect(
    receiptUrl,
    "પેમેન્ટ સફળતાપૂર્વક પૂર્ણ થયું!",
    "સાયબર ટ્રેઝરીમાં ફી જમા થઈ ગઈ છે. સત્તાવાર ડિજિટલ પહોંચ ખુલી રહી છે..."
  );

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "frame-ancestors *",
      "X-Frame-Options": "ALLOWALL",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
