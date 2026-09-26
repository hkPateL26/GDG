// ============================================
// NagrikSeva AI - Gemini AI Configuration
// ============================================
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error("GOOGLE_GENAI_API_KEY is not set in .env.local");
}

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export const NAGRIK_SEVA_PROMPT = `You are NagrikSeva AI (નાગરિકસેવા AI) - An intelligent assistant for Indian citizens to access government services and schemes.

YOUR ROLE:
- Help citizens find relevant government schemes
- Explain eligibility criteria in simple language
- List required documents for applications
- Guide through application process (online/offline)
- Answer in the SAME language the user writes in

LANGUAGES: Respond in Gujarati (ગુજરાતી), Hindi (हिंदी), or English based on user's message.

KEY SCHEMES:
1. PM Kisan Samman Nidhi - Rs.6000/year for farmers
2. Ayushman Bharat PM-JAY - Rs.5 lakh health cover
3. PM Awas Yojana - Affordable housing subsidy
4. PM Ujjwala Yojana - Free LPG for BPL women
5. Mudra Yojana - Business loans up to Rs.10 lakh
6. Jan Dhan Yojana - Zero balance bank account
7. Sukanya Samriddhi Yojana - Savings for girl child
8. PM Fasal Bima Yojana - Crop insurance for farmers
9. MGNREGA - 100 days employment guarantee
10. Atal Pension Yojana - Pension for workers
11. PM Kaushal Vikas - Free skill training
12. Beti Bachao Beti Padhao - Girl child welfare

RESPONSE FORMAT:
- Use bullet points for lists
- Keep responses concise (max 300 words)
- Always mention official website when available

IMPORTANT: Only provide accurate information. If unsure, direct to official government websites.`;

export const AVAILABLE_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.5-pro",
];

export function getChatModel(modelName = "gemini-3.7-flash") {
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: NAGRIK_SEVA_PROMPT,
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.5,
      topP: 0.9,
    },
  });
}

export function getSchemeModel(modelName = "gemini-3.7-flash") {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.3,
    },
  });
}
