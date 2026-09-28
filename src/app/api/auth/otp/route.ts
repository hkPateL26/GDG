import { NextRequest, NextResponse } from "next/server";
import {
  requestCitizenOtp,
  verifyCitizenOtp,
  getCitizenBenefitProfile,
  verifyOfficerPin,
} from "@/lib/large-datasets";

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
      return NextResponse.json(res, { status: res.success ? 200 : 401 });
    }

    return NextResponse.json({ success: false, error: "અમાન્ય વિનંતી (Invalid Action)" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Auth OTP API error:", err);
    const message = err instanceof Error ? err.message : "સર્વર ક્ષતિ";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
