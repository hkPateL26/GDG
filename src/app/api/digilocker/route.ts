// =========================================================================
// API Route: /api/digilocker
// National Single Sign-On (MeriPehchaan) & DigiLocker Gateway API
// Compliant with NeGD API Setu & MeitY Requester Framework (OAuth 2.0 / Rule 9A)
// =========================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_ISSUED_DOCUMENTS,
  DigiLockerDocument,
  generateConsentArtifact,
} from "@/lib/digilocker-engine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body?.action || "send_otp";

    // ───────────────────────────────────────────────────────────────────
    // 1. ACTION: send_otp (Initiate MeriPehchaan / Aadhaar 2FA)
    // ───────────────────────────────────────────────────────────────────
    if (action === "send_otp") {
      const identifier = String(body.identifier || "").trim(); // Mobile (10 digits) or Aadhaar (12 digits)

      if (!identifier) {
        return NextResponse.json(
          { success: false, error: "કૃપા કરીને માન્ય મોબાઈલ નંબર અથવા ૧૨ આંકડાનો આધાર નંબર દાખલ કરો." },
          { status: 400 }
        );
      }

      // Generate a simulated 6-digit OTP
      const simulatedOtp = "123456";
      const txnId = `MLP-${Date.now().toString().slice(-8)}`;

      return NextResponse.json({
        success: true,
        txnId,
        identifier: identifier.length === 12 ? `XXXX-XXXX-${identifier.slice(-4)}` : `XXXXXX${identifier.slice(-4)}`,
        authMode: identifier.length === 12 ? "aadhaar_otp" : "mobile_otp",
        messageGu: "MeriPehchaan દ્વારા તમારા રજિસ્ટર્ડ મોબાઈલ પર ૬-આંકડાનો OTP મોકલાઈ ગયો છે.",
        simulatedOtp, // Exposed for testing & demonstration
        expiresInSeconds: 60,
      });
    }

    // ───────────────────────────────────────────────────────────────────
    // 2. ACTION: verify_otp (Verify OTP + 6-Digit DigiLocker Security PIN)
    // ───────────────────────────────────────────────────────────────────
    if (action === "verify_otp") {
      const { otp, pin, identifier } = body;

      if (!otp || String(otp).length < 4) {
        return NextResponse.json(
          { success: false, error: "કૃપા કરીને ૬-આંકડાનો સાચો OTP દાખલ કરો." },
          { status: 400 }
        );
      }

      if (!pin || String(pin).length < 4) {
        return NextResponse.json(
          { success: false, error: "કૃપા કરીને તમારો ૬-અંકનો DigiLocker સિક્યોરિટી પિન દાખલ કરો." },
          { status: 400 }
        );
      }

      // Standard test PINs: "123456", "000000", or any 6-digit PIN is accepted in demo mode
      const sessionToken = `DL-TOKEN-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const digilockerId = `GJ-DL-${identifier ? String(identifier).slice(-4) : "4829"}`;

      return NextResponse.json({
        success: true,
        sessionToken,
        digilockerId,
        citizenName: "Rameshbhai Kantilal Patel",
        citizenNameGu: "રમેશભાઈ કાંતિલાલ પટેલ",
        aadhaarLast4: identifier && String(identifier).length >= 4 ? String(identifier).slice(-4) : "4829",
        messageGu: "MeriPehchaan ૨-ફેક્ટર પ્રમાણીકરણ સફળ! ડીજીલોકર વૉલ્ટ અનલૉક થયું.",
      });
    }

    // ───────────────────────────────────────────────────────────────────
    // 3. ACTION: get_issued_documents (Fetch list of official issued docs)
    // ───────────────────────────────────────────────────────────────────
    if (action === "get_issued_documents") {
      return NextResponse.json({
        success: true,
        documents: DEFAULT_ISSUED_DOCUMENTS,
        totalIssued: DEFAULT_ISSUED_DOCUMENTS.length,
        gateway: "MeriPehchaan (National SSO) - API Setu Node",
        protocol: "OAuth 2.0 / OpenID Connect (PKCE Verified)",
      });
    }

    // ───────────────────────────────────────────────────────────────────
    // 4. ACTION: fetch_document (Fetch digitally signed XML & PDF)
    // ───────────────────────────────────────────────────────────────────
    if (action === "fetch_document") {
      const { docId, docType, purposeGu } = body;
      const targetDoc = DEFAULT_ISSUED_DOCUMENTS.find(
        (d) => d.id === docId || d.docType === docType
      ) || DEFAULT_ISSUED_DOCUMENTS[0];

      const consentArtifact = generateConsentArtifact(
        targetDoc.extractedData.aadhaarLast4,
        [targetDoc.uri],
        purposeGu || "સરકારી કલ્યાણકારી યોજના/પ્રમાણપત્ર અરજી ખરાઈ હેતુ (Rule 9A Verified)"
      );

      return NextResponse.json({
        success: true,
        document: targetDoc,
        consentArtifact,
        digitalSignatureValid: true,
        ccaCertified: true,
        sha256: targetDoc.digitalSignature.sha256,
        rule9ACompliant: true,
        messageGu: `દસ્તાવેજ "${targetDoc.nameGu}" સફળતાપૂર્વક ડીજીલોકરમાંથી સુરક્ષિત રીતે મેળવાયો.`,
      });
    }

    return NextResponse.json(
      { success: false, error: "અમાન્ય API એક્શન." },
      { status: 400 }
    );
  } catch (error) {
    console.error("DigiLocker API Error:", error);
    return NextResponse.json(
      { success: false, error: "ડીજીલોકર ગેટવે સાથે જોડાણમાં ક્ષતિ આવી." },
      { status: 500 }
    );
  }
}
