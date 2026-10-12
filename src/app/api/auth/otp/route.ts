import { NextRequest, NextResponse } from "next/server";
import {
  requestCitizenOtp,
  verifyCitizenOtp,
  getCitizenBenefitProfile,
  verifyOfficerPin,
} from "@/lib/large-datasets";
import {
  createOfficerSessionToken,
  getOfficerCookieConfig,
  getOfficerSessionFromRequest,
  revokeOfficerSession,
} from "@/lib/officer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, mobile, aadhaarLast4, otp, officerId, pin } = body;

    // 1. Send 6-Digit OTP to Citizen's Mobile
    if (action === "send_otp") {
      if (!mobile || !aadhaarLast4) {
        return NextResponse.json(
          { success: false, error: "મોબાઈલ નંબર અને આધારના છેલ્લા ૪ આંકડા બંને ફરજિયાત છે." },
          { status: 400 }
        );
      }
      const res = requestCitizenOtp(mobile, aadhaarLast4);
      return NextResponse.json(res, { status: res.success ? 200 : 400 });
    }

    // 2. Cryptographically Verify OTP + Aadhaar Binding on Server
    if (action === "verify_otp") {
      if (!mobile || !otp || !aadhaarLast4) {
        return NextResponse.json(
          { success: false, error: "મોબાઈલ, OTP અને આધાર છેલ્લા ૪ આંકડા આવશ્યક છે." },
          { status: 400 }
        );
      }
      const res = verifyCitizenOtp(mobile, otp, aadhaarLast4);
      return NextResponse.json(res, { status: res.success ? 200 : 400 });
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
      const res = verifyOfficerPin(officerId, pin);
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

    return NextResponse.json({ success: false, error: "અમાન્ય વિનંતી (Invalid Action)" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Auth OTP API error:", err);
    const message = err instanceof Error ? err.message : "સર્વર ક્ષતિ";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
