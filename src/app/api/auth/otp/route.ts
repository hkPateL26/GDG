import { NextRequest, NextResponse } from "next/server";
import {
  requestCitizenOtp,
  verifyCitizenOtp,
  getCitizenBenefitProfile,
  verifyOfficerPin,
  isDemoCredentialsAllowed,
} from "@/lib/large-datasets";
import {
  createOfficerSessionToken,
  getOfficerCookieConfig,
  getOfficerSessionFromRequest,
  revokeOfficerSession,
  verifyDemoGateCookie,
  createDemoGateCookieValue,
  getDemoGateCookieConfig,
  DEFAULT_DEMO_GATE_PASSCODE,
} from "@/lib/officer-auth";
import {
  extractClientIp,
  checkRateLimit,
  isAuthLocked,
  recordFailedAuthAttempt,
  resetAuthLockout,
} from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = extractClientIp(req);
    const body = await req.json();
    const { action, mobile, aadhaarLast4, otp, officerId, pin, passcode } = body;

    // 1. Send 6-Digit OTP to Citizen's Mobile (Protected against SMS Bombing)
    if (action === "send_otp") {
      if (!mobile || !aadhaarLast4) {
        return NextResponse.json(
          { success: false, error: "મોબાઈલ નંબર અને આધારના છેલ્લા ૪ આંકડા બંને ફરજિયાત છે." },
          { status: 400 }
        );
      }

      // Check Account Lockout status
      const lockCheck = isAuthLocked(mobile);
      if (lockCheck.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error: `વારંવાર ખોટા પ્રયાસોને લીધે આ નંબર ${lockCheck.remainingLockSeconds} સેકન્ડ માટે અસ્થાયી બ્લોક થયેલ છે. કૃપા કરીને થોડીવાર રાહ જુઓ.`,
          },
          { status: 423 } // HTTP 423 Locked
        );
      }

      // IP Rate Limit: Max 6 OTP sends per minute
      const rateCheck = checkRateLimit(clientIp, {
        keyPrefix: "otp-send",
        windowMs: 60 * 1000,
        maxRequests: 6,
      });

      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: `ઘણા બધા OTP મોકલવાનો પ્રયાસ થયો. સુરક્ષા ખાતર કૃપા કરીને ${rateCheck.retryAfterSeconds} સેકન્ડ પછી પ્રયાસ કરો.`,
          },
          { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
        );
      }

      const res = requestCitizenOtp(mobile, aadhaarLast4);
      return NextResponse.json(res, { status: res.success ? 200 : 400 });
    }

    // 2. Cryptographically Verify OTP + Aadhaar Binding on Server (Anti Brute-Force)
    if (action === "verify_otp") {
      if (!mobile || !otp || !aadhaarLast4) {
        return NextResponse.json(
          { success: false, error: "મોબાઈલ, OTP અને આધાર છેલ્લા ૪ આંકડા આવશ્યક છે." },
          { status: 400 }
        );
      }

      // Check if mobile is locked due to repeated failures
      const lockCheck = isAuthLocked(mobile);
      if (lockCheck.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error: `વારંવાર ખોટો OTP નાખવાને કારણે આ એકાઉન્ટ ${lockCheck.remainingLockSeconds} સેકન્ડ માટે બ્લોક છે.`,
          },
          { status: 423 }
        );
      }

      // Rate Limit verification requests: Max 12 attempts per minute per IP
      const rateCheck = checkRateLimit(clientIp, {
        keyPrefix: "otp-verify",
        windowMs: 60 * 1000,
        maxRequests: 12,
      });

      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: `વધુ પડતા વેરિફિકેશન પ્રયાસો! કૃપા કરીને ${rateCheck.retryAfterSeconds} સેકન્ડ પછી પ્રયાસ કરો.`,
          },
          { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
        );
      }

      const res = verifyCitizenOtp(mobile, otp, aadhaarLast4);

      if (!res.success) {
        const attempt = recordFailedAuthAttempt(mobile, 5, 10 * 60 * 1000);
        if (attempt.locked) {
          return NextResponse.json(
            {
              success: false,
              error: "સુરક્ષા એલર્ટ: ૫ વખત ખોટો OTP દાખલ કરવાને લીધે આ ખાતું ૧૦ મિનિટ માટે બ્લોક કરવામાં આવ્યું છે.",
            },
            { status: 423 }
          );
        }
        return NextResponse.json(
          {
            ...res,
            error: `${res.error} (બાકી રહેલા પ્રયાસો: ${attempt.remainingAttempts})`,
          },
          { status: 400 }
        );
      }

      // Reset lockout on successful verification
      resetAuthLockout(mobile);
      return NextResponse.json(res, { status: 200 });
    }

    // 3. Fetch Citizen Profile & Past Benefit Ledger (for Eligibility & Vault)
    if (action === "get_citizen_profile") {
      if (!mobile) {
        return NextResponse.json(
          { success: false, error: "મોબાઈલ નંબર જરૂરી છે." },
          { status: 400 }
        );
      }
      const profile = getCitizenBenefitProfile(mobile, aadhaarLast4);
      return NextResponse.json({ success: true, citizen: profile });
    }

    // 4. Verify Official Government Credentials (Officer Portal Access)
    if (action === "verify_officer") {
      const isGateAuthorized = verifyDemoGateCookie(req);
      const res = verifyOfficerPin(officerId, pin, isGateAuthorized);
      if (!res.success || !res.officer) {
        return NextResponse.json(res, { status: 401 });
      }

      try {
        const token = createOfficerSessionToken(res.officer);
        const cookieConfig = getOfficerCookieConfig(req);

        // Security Data Minimization:
        // Do not expose session token to client-side JavaScript for browser clients.
        // Bearer token is only returned in JSON body for automated test suites or non-browser API clients.
        const userAgent = req.headers.get("user-agent") || "";
        const isBrowserClient =
          userAgent.includes("Mozilla/") ||
          req.headers.get("sec-ch-ua") !== null;
        const isExplicitBearerRequested =
          req.headers.get("x-request-bearer-token") === "true" ||
          body.requestBearerToken === true;
        const shouldReturnToken =
          isExplicitBearerRequested ||
          !isBrowserClient ||
          process.env.NODE_ENV === "test";

        const responsePayload: Record<string, unknown> = {
          success: true,
          officer: res.officer,
        };

        if (shouldReturnToken) {
          responsePayload.token = token;
        }

        const response = NextResponse.json(responsePayload);
        response.cookies.set(cookieConfig.name, token, cookieConfig);
        return response;
      } catch (tokenErr) {
        console.error("Token creation error:", tokenErr);
        const errMsg = tokenErr instanceof Error ? tokenErr.message : "સત્ર પ્રમાણીકરણમાં ક્ષતિ";
        return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
      }
    }

    // 5. Official Officer Logout (Revokes Session & Clears HttpOnly Session Cookie)
    if (action === "logout_officer") {
      try {
        const session = await getOfficerSessionFromRequest(req);
        if (session) {
          await revokeOfficerSession(session.sessionId, session.expiresAt);
        }
      } catch (revErr) {
        console.warn("Session revocation warning on logout:", revErr);
      }

      const cookieConfig = getOfficerCookieConfig(req);
      const response = NextResponse.json({
        success: true,
        message: "અધિકારી સત્ર સફળતાપૂર્વક સમાપ્ત થયેલ છે.",
      });
      response.cookies.set(cookieConfig.name, "", { ...cookieConfig, maxAge: 0 });
      return response;
    }

    // 6. Verify Server-Side Active Officer Session
    if (action === "get_officer_session") {
      const session = await getOfficerSessionFromRequest(req);
      if (!session) {
        return NextResponse.json(
          { success: false, error: "સક્રિય અધિકારી સત્ર મળ્યું નથી. (No active session)" },
          { status: 401 }
        );
      }
      return NextResponse.json({ success: true, officer: session });
    }

    // 7. Get Environment Demo Status
    if (action === "get_demo_status") {
      const isGateUnlocked = verifyDemoGateCookie(req);
      const isDemo = isDemoCredentialsAllowed(isGateUnlocked);
      return NextResponse.json({
        success: true,
        demoCredentialsAllowed: isDemo,
        demoGateUnlocked: isGateUnlocked,
        environment: process.env.NODE_ENV || "development",
      });
    }

    // 8. Unlock Live Demo Gate (Secures Live Public Demonstrations)
    if (action === "unlock_demo_gate") {
      const cleanPass = (passcode || "").trim();
      const expectedPass = (process.env.DEMO_GATE_PASSCODE || DEFAULT_DEMO_GATE_PASSCODE).trim();
      if (!cleanPass || cleanPass !== expectedPass) {
        return NextResponse.json(
          {
            success: false,
            error: "અમાન્ય ડેમો ગેટ પાસકોડ (Invalid Demo Gate Passcode). સરકારી ડેમો પાસકોડ ચકાસો.",
          },
          { status: 403 }
        );
      }

      const cookieVal = createDemoGateCookieValue();
      const cookieConf = getDemoGateCookieConfig(req);
      const response = NextResponse.json({
        success: true,
        message: "અધિકૃત લાઈવ ડેમો મોડ સફળતાપૂર્વક અનલૉક થયો. (Live Demo Mode Unlocked)",
        demoGateUnlocked: true,
        demoCredentialsAllowed: true,
      });
      response.cookies.set(cookieConf.name, cookieVal, cookieConf);
      return response;
    }

    // 9. Lock Live Demo Gate (Re-enables Strict Production Lockout)
    if (action === "lock_demo_gate") {
      const cookieConf = getDemoGateCookieConfig(req);
      const response = NextResponse.json({
        success: true,
        message: "લાઈવ ડેમો મોડ સફળતાપૂર્વક લૉક થયો. (Live Demo Mode Locked)",
        demoGateUnlocked: false,
        demoCredentialsAllowed: isDemoCredentialsAllowed(false),
      });
      response.cookies.set(cookieConf.name, "", { ...cookieConf, maxAge: 0 });
      return response;
    }

    return NextResponse.json({ success: false, error: "અમાન્ય વિનંતી (Invalid Action)" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Auth OTP API error:", err);
    const message = err instanceof Error ? err.message : "સર્વર ક્ષતિ";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * Public Environment & Demo Mode Status (Read-Only)
 * Allows client UI to accurately detect whether demo credentials are authorized
 * in the active server environment without exposing server secrets.
 */
export async function GET(req: NextRequest) {
  const isGateUnlocked = verifyDemoGateCookie(req);
  const isDemo = isDemoCredentialsAllowed(isGateUnlocked);
  return NextResponse.json({
    success: true,
    demoCredentialsAllowed: isDemo,
    demoGateUnlocked: isGateUnlocked,
    environment: process.env.NODE_ENV || "development",
    demoPin: isDemo ? "GJ2026" : undefined,
    demoOfficers: [
      { id: "GUJ-STATE-001", nameGu: "૧. સચિવાલય (રાજ્ય સ્તર)", role: "state_admin", tier: 1 },
      { id: "GUJ-COL-3001", nameGu: "૨. કલેક્ટર (જિલ્લા સ્તર)", role: "district_collector", tier: 2 },
      { id: "GUJ-SDM-5002", nameGu: "૩. પ્રાંત / SDM (સબ-ડિવિઝન)", role: "sdm_prant", tier: 3 },
      { id: "GUJ-GOV-9012", nameGu: "૪. મામલતદાર (તાલુકા સ્તર)", role: "mamlatdar", tier: 4 },
      { id: "GUJ-TAL-7089", nameGu: "૫. તલાટી મંત્રી (પંચાયત સ્તર)", role: "talati", tier: 5 },
    ],
  });
}
