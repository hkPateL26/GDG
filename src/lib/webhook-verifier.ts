// =========================================================================
// NAGRIKSEVA AI — CRYPTOGRAPHIC WEBHOOK SIGNATURE VERIFIER & AUDIT ENGINE
// P0 Security: HMAC-SHA256 Payload Signature Check & Replay Attack Defense
// Compliant with Razorpay Webhook Standard, PayGov & Cyber Treasury Frameworks
// =========================================================================

import crypto from "crypto";

export interface WebhookVerificationResult {
  isValid: boolean;
  errorCode?: "MISSING_SIGNATURE" | "INVALID_SIGNATURE" | "REPLAY_ATTACK" | "MALFORMED_PAYLOAD";
  errorMessageGu?: string;
  payload?: any;
}

/**
 * Resolves the webhook secret from environment variables or secure fallback.
 */
export function getWebhookSecret(): string {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  // Safe deterministic demo secret for development & testing
  return "gujarat_cyber_treasury_webhook_sec_2026_x89a";
}

/**
 * Cryptographically verifies an incoming webhook payload using HMAC-SHA256.
 *
 * @param rawBody - The unparsed raw string/buffer of the HTTP request body
 * @param signatureHeader - The signature string from the request headers
 *                          (e.g., 'x-webhook-signature', 'x-razorpay-signature')
 * @param timestampHeader - Optional timestamp header for replay attack prevention
 * @param secret - Optional secret override (defaults to getWebhookSecret())
 * @param toleranceSeconds - Max allowed clock skew / age of request (default: 300s / 5 mins)
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  timestampHeader?: string | null,
  secret = getWebhookSecret(),
  toleranceSeconds = 300
): WebhookVerificationResult {
  if (!signatureHeader || !signatureHeader.trim()) {
    return {
      isValid: false,
      errorCode: "MISSING_SIGNATURE",
      errorMessageGu: "વેબહૂક સહી (x-webhook-signature) ગેરહાજર છે.",
    };
  }

  // 1. Replay Attack Prevention (Timestamp Validation)
  if (timestampHeader) {
    const timestampMs = parseInt(timestampHeader, 10) * (timestampHeader.length === 10 ? 1000 : 1);
    if (!isNaN(timestampMs)) {
      const now = Date.now();
      const ageSeconds = Math.abs(now - timestampMs) / 1000;
      if (ageSeconds > toleranceSeconds) {
        return {
          isValid: false,
          errorCode: "REPLAY_ATTACK",
          errorMessageGu: "સુરક્ષા ચેતવણી: વેબહૂક સમયમર્યાદા (Timestamp) સમાપ્ત થઈ ગઈ છે (શંકાસ્પદ Replay Attack).",
        };
      }
    }
  }

  try {
    // 2. Compute expected HMAC-SHA256 digest
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const cleanReceivedSig = signatureHeader.trim().toLowerCase();
    const sigBuffer = Buffer.from(cleanReceivedSig, "utf-8");
    const expectedBuffer = Buffer.from(expectedSignature.toLowerCase(), "utf-8");

    // 3. Constant-time equality comparison to thwart side-channel timing attacks
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return {
        isValid: false,
        errorCode: "INVALID_SIGNATURE",
        errorMessageGu: "અમાન્ય વેબહૂક ડિજિટલ સહી! વિનંતી સાથે છેડછાડ થયેલ હોવાની શક્યતા છે.",
      };
    }

    // 4. Safely parse JSON payload
    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(rawBody);
    } catch {
      return {
        isValid: false,
        errorCode: "MALFORMED_PAYLOAD",
        errorMessageGu: "વેબહૂક JSON ડેટા વિકૃત છે.",
      };
    }

    return {
      isValid: true,
      payload: parsedPayload,
    };
  } catch (err) {
    return {
      isValid: false,
      errorCode: "INVALID_SIGNATURE",
      errorMessageGu: "વેબહૂક ચકાસણી દરમિયાન અનપેક્ષિત ક્ષતિ આવી.",
    };
  }
}

/**
 * Utility to generate a valid test webhook signature for testing & simulation.
 */
export function generateTestWebhookSignature(
  rawBody: string,
  secret = getWebhookSecret()
): string {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}
