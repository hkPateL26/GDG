import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error("GOOGLE_GENAI_API_KEY is not set in .env.local");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

const STRICT_VERIFICATION_PROMPT = `You are the STRICT Chief Document Verification Officer for NagrikSeva AI (Government of Gujarat).
Your mandate: ZERO FRAUD, ZERO MISMATCH, STRICT QUALITY CONTROL. 

Under Government of Gujarat rules:
- If an applicant uploads a Marksheet (ગુણપત્રક / પરિણામ / Statement of Marks) when a Birth Certificate (જન્મનો દાખલો) or School Leaving Certificate (શાળા છોડ્યાનું પ્રમાણપત્ર / LC) was requested, IT MUST BE STRICTLY REJECTED. A marksheet is NOT a proof of birth or school leaving certificate.
- If an applicant uploads an electricity bill when photo identity is requested, IT MUST BE REJECTED.
- If the document is blurry, fake, unreadable, or a completely different document than expected, IT MUST BE REJECTED.

CRITICAL INSTRUCTIONS:
1. Identify the EXACT type of document shown in this image or PDF:
   - "Academic Marksheet / Statement of Marks" (શૈક્ષણિક માર્કશીટ / પરિણામ / ગુણપત્રક)
   - "Birth Certificate" (જન્મનો દાખલો / જન્મ નોંધણી પ્રમાણપત્ર)
   - "School Leaving Certificate / Transfer Certificate" (શાળા છોડ્યાનું પ્રમાણપત્ર / LC)
   - "Aadhaar Card" (આધાર કાર્ડ)
   - "PAN Card" (પાન કાર્ડ)
   - "Ration Card" (રેશન કાર્ડ)
   - "Income Certificate" (આવકનો દાખલો)
   - "Caste Certificate" (જાતિનો દાખલો)
   - "Electricity Bill / Utility Bill" (લાઈટ બિલ / વીજળી બિલ)
   - "Property Tax Receipt / Index 2" (વેરા બિલ / દસ્તાવેજ)
   - "Voter ID / Election Card" (ચૂંટણી કાર્ડ)
   - "Driving License" (ડ્રાઇવિંગ લાયસન્સ)
   - "Other / Invalid Document"

2. Check strictly if it matches the EXPECTED DOCUMENT REQUIREMENT.
   - If expected is "Birth Certificate / School Leaving Certificate" and the image is a Marksheet (Statement of Marks):
     -> "matchesExpected": false
     -> "isValidForGovt": false
     -> "qualityScore": 15
     -> "actionableAdviceGu": "❌ ખોટો દસ્તાવેજ: તમે માર્કશીટ (ગુણપત્રક) અપલોડ કરી છે. અહીં માત્ર 'જન્મનો દાખલો' અથવા 'શાળા છોડ્યાનું પ્રમાણપત્ર (LC)' જ માન્ય છે. માર્કશીટ જન્મના પુરાવા તરીકે ચાલશે નહીં."
     -> "feedbackGu": "આ દસ્તાવેજ ધોરણ ૧૦ કે ૧૨ ની માર્કશીટ છે, જે સરકારી નિયમો મુજબ જન્મ અથવા શાળા છોડ્યાના પ્રમાણપત્ર તરીકે અસ્વીકાર્ય છે."

3. Return ONLY a valid JSON object matching this schema:
{
  "documentType": string,
  "documentNameGu": string,
  "qualityScore": number (0 to 100, if document does not match requirement return <= 20),
  "isValidForGovt": boolean (MUST be false if wrong document, blurry, or expired),
  "matchesExpected": boolean (MUST be false if different from expectedDocType),
  "needsUpdate": boolean,
  "needsNewDocument": boolean,
  "actionableAdviceGu": string,
  "feedbackGu": string,
  "extractedInfo": {
    "detectedName": string | null,
    "documentNumberMasked": string | null,
    "yearOrDate": string | null
  },
  "verificationPoints": [
    { "point": string, "status": "pass" | "fail", "note": string }
  ]
}

DO NOT include any markdown quotes or code blocks outside the JSON. Return only parseable JSON.`;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType = "image/jpeg", expectedDocType = "" } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Document data is required", success: false },
        { status: 400 }
      );
    }

    // Clean base64 header if present
    const base64Data = imageBase64.replace(/^data:(image|application)\/\w+;base64,/, "");

    const customPrompt = `${STRICT_VERIFICATION_PROMPT}\n\n====================\nEXPECTED DOCUMENT REQUIREMENT FOR THIS SLOT: "${expectedDocType}"\n====================`;

    // Try modern Gemini vision models with high availability
    const visionModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash"];
    let parsedData: any = null;

    for (const modelName of visionModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });

        const result = await model.generateContent([
          customPrompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType === "application/pdf" ? "application/pdf" : mimeType || "image/jpeg",
            },
          },
        ]);

        const responseText = result.response.text();
        parsedData = JSON.parse(responseText);
        if (parsedData && parsedData.documentType) {
          // Double safeguard: if matchesExpected is false, ensure isValidForGovt is strictly false
          if (!parsedData.matchesExpected) {
            parsedData.isValidForGovt = false;
            if (parsedData.qualityScore > 30) parsedData.qualityScore = 15;
          }
          break;
        }
      } catch (mErr: any) {
        console.warn(`Vision model ${modelName} failed or unavailable:`, mErr?.message || mErr);
      }
    }

    // Fallback if all Gemini models fail (e.g. temporary API quota issue)
    if (!parsedData) {
      const isBirthOrLCExpected = expectedDocType.toLowerCase().includes("birth") || expectedDocType.includes("જન્મ");
      parsedData = {
        documentType: "Document Verification Pending",
        documentNameGu: "ચકાસણી પેન્ડિંગ",
        qualityScore: 50,
        isValidForGovt: false,
        matchesExpected: false,
        needsUpdate: false,
        needsNewDocument: false,
        actionableAdviceGu: "⚠️ નેટવર્ક અથવા સર્વર વ્યસ્ત હોવાથી AI ચકાસણી થઈ શકી નથી. કૃપા કરીને ખાતરી કરો કે તમે યોગ્ય દસ્તાવેજ અપલોડ કર્યો છે.",
        extractedInfo: {
          detectedName: null,
          documentNumberMasked: null,
          yearOrDate: null,
        },
        feedbackGu: "કૃપા કરીને માંગેલ સત્તાવાર દસ્તાવેજ જ અપલોડ કરો.",
        verificationPoints: [
          { point: "દસ્તાવેજ પ્રકાર", status: "fail", note: "ચકાસણી ફરીથી કરો" },
        ],
      };
    }

    return NextResponse.json({
      success: true,
      analysis: parsedData,
    });
  } catch (error: any) {
    console.error("AI Document Verification Error:", error);

    return NextResponse.json({
      success: true,
      analysis: {
        documentType: "Unknown",
        documentNameGu: "અજ્ઞાત દસ્તાવેજ",
        qualityScore: 10,
        isValidForGovt: false,
        matchesExpected: false,
        needsUpdate: false,
        needsNewDocument: false,
        actionableAdviceGu: "❌ દસ્તાવેજ ચકાસણી નિષ્ફળ. કૃપા કરીને સ્પષ્ટ અને સાચો દસ્તાવેજ અપલોડ કરો.",
        extractedInfo: {
          detectedName: null,
          documentNumberMasked: null,
          yearOrDate: null,
        },
        feedbackGu: "દસ્તાવેજ વાંચી શકાયો નથી.",
        verificationPoints: [
          { point: "દસ્તાવેજ ચકાસણી", status: "fail", note: "અમાન્ય ફાઇલ" },
        ],
      },
    });
  }
}
