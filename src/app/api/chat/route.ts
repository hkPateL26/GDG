import { getChatModel } from "@/lib/gemini";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import { ChatHistory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

function getLocalFallbackReply(query: string): string {
  const q = query.toLowerCase();

  // 1. Specialized Direct Handling for Gujarat Civil Supplies / Ration Card (BUG-021)
  if (
    q.includes("ration") ||
    q.includes("રેશન") ||
    q.includes("રાશન") ||
    q.includes("બારકોડેડ રેશનકાર્ડ")
  ) {
    return `📜 **ગુજરાત અન્ન અને નાગરિક પુરવઠા સેવાઓ - રેશનકાર્ડ સહાય**\n\n` +
      `📌 **મુખ્ય ઑનલાઇન સેવાઓ:**\n` +
      `• નવા બારકોડેડ રેશનકાર્ડ માટે નવી અરજી\n` +
      `• કુટુંબમાં નવા સભ્ય (બાળક/પત્ની) નું નામ ઉમેરવું\n` +
      `• લગ્ન કે અવસાન બાદ નામ કમી કરાવવું\n` +
      `• અલગ રહેતા કુટુંબ માટે રેશનકાર્ડ વિભાજન (Split Card)\n` +
      `• સરનામું ફેરબદલી અથવા વાજબી ભાવની દુકાન (FPS) ટ્રાન્સફર\n\n` +
      `📄 **જરૂરી આધાર પુરાવા:**\n` +
      `• અરજદાર તથા તમામ સભ્યોના આધાર કાર્ડ\n` +
      `• રહેઠાણ પુરાવો (લાઈટબિલ / વેરા પાવતી)\n` +
      `• નામ ઉમેરવા માટે જન્મ દાખલો / લગ્ન નોંધણી પ્રમાણપત્ર\n` +
      `• જૂના રેશનકાર્ડની નકલ\n\n` +
      `🌐 **સત્તાવાર પોર્ટલ:** [Digital Gujarat Portal](https://www.digitalgujarat.gov.in)\n` +
      `💡 તમે આ પોર્ટલના **"દસ્તાવેજ સેવાઓ"** ટેબમાંથી પણ રેશનકાર્ડ સુધારા માટે સીધી અરજી કરી શકો છો.`;
  }

  // 2. Exact Scheme Match
  const matchedScheme = SCHEMES_DATA.find((s) => {
    return (
      q.includes(s.name.toLowerCase()) ||
      q.includes(s.nameGu.toLowerCase()) ||
      (s.nameHi && q.includes(s.nameHi.toLowerCase())) ||
      q.includes(s.category.toLowerCase()) ||
      (q.includes("kisan") && s.id === "pm-kisan") ||
      (q.includes("ખેડૂત") && s.id === "pm-kisan") ||
      (q.includes("ayushman") && s.id === "ayushman-bharat") ||
      (q.includes("આયુષ્માન") && s.id === "ayushman-bharat") ||
      (q.includes("awas") && s.id.includes("awas")) ||
      (q.includes("આવાસ") && s.id.includes("awas")) ||
      (q.includes("મકાન") && s.id.includes("awas")) ||
      (q.includes("gas") && (s.id === "ujjwala-yojana" || s.id === "pm-ujjwala")) ||
      (q.includes("ગેસ") && (s.id === "ujjwala-yojana" || s.id === "pm-ujjwala")) ||
      (q.includes("સિલિન્ડર") && (s.id === "ujjwala-yojana" || s.id === "pm-ujjwala")) ||
      (q.includes("loan") && (s.id === "mudra-loan" || s.id === "pm-mudra")) ||
      (q.includes("લોન") && (s.id === "mudra-loan" || s.id === "pm-mudra"))
    );
  });

  if (matchedScheme) {
    return `📋 **${matchedScheme.nameGu} (${matchedScheme.name})**\n\n` +
      `📌 **મુખ્ય લાભો:**\n` +
      matchedScheme.benefits.map((b) => `• ${b}`).join("\n") +
      `\n\n📄 **જરૂરી દસ્તાવેજો:**\n` +
      matchedScheme.documents.map((d) => `• ${d}`).join("\n") +
      `\n\n🌐 **સત્તાવાર પોર્ટલ:** [${matchedScheme.applicationUrl}](${matchedScheme.applicationUrl})\n` +
      `💡 વધુ માહિતી માટે નજીકના જનસેવા કેન્દ્ર (CSC) અથવા ઈ-ગ્રામ કેન્દ્રની મુલાકાત લો.`;
  }

  return `નમસ્તે! 🙏 NagrikSeva AI સહાયક સેવા કાર્યરત છે.\n\n` +
    `તમે નીચેની કોઈપણ લોકપ્રિય સરકારી યોજનાઓ અથવા સેવાઓ વિશે પૂછી શકો છો:\n` +
    `• 🌾 **PM કિસાન સન્માન નિધિ** (ખેડૂતોને વાર્ષિક ₹6,000 સહાય)\n` +
    `• 🏥 **આયુષ્માન ભારત PM-JAY** (વાર્ષિક ₹5 લાખ સુધી કેશલેસ સારવાર)\n` +
    `• 🏠 **PM આવાસ યોજના** (પાકા મકાન બાંધકામ સહાય)\n` +
    `• 🔥 **PM ઉજ્જવલા યોજના** (મફત ગેસ સિલિન્ડર અને ચૂલ્હો)\n` +
    `• 💼 **PM મુદ્રા યોજના** (ધંધા-રોજગાર માટે વગર ગેરંટી લોન)\n` +
    `• 📜 **રેશનકાર્ડ સેવાઓ** (નવા નામ ઉમેરવા/કમી કરવા, વિભાજન)\n\n` +
    `તમારો પ્રશ્ન ગુજરાતી, હિન્દી કે અંગ્રેજીમાં લખો, અમે તરત જ માર્ગદર્શન આપીશું!`;
}

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      history,
      language,
    }: { message: string; history: ChatHistory[]; language?: string } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Gemini requires chat history to start with 'user' and alternate properly
    let sanitizedHistory: ChatHistory[] = [];
    if (Array.isArray(history)) {
      const firstUserIdx = history.findIndex((h) => h.role === "user");
      if (firstUserIdx !== -1) {
        sanitizedHistory = history.slice(firstUserIdx).filter((h, idx, arr) => {
          if (idx === 0) return h.role === "user";
          return h.role !== arr[idx - 1].role;
        });
      }
    }

    // Try available active models with a 6-second per-model timeout
    let lastError: Error | null = null;
    const fastModels = ["gemini-3.8-flash", "gemini-3.7-flash"];
    const langPrompt =
      language && language !== "gu"
        ? `\n\n[Instruction: Respond in '${language}' language accurately with easy-to-understand terms.]`
        : "";

    for (const modelName of fastModels) {
      try {
        const model = getChatModel(modelName);
        const chat = model.startChat({ history: sanitizedHistory });

        const sendPromise = chat.sendMessage(message + langPrompt);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on model ${modelName}`)), 6000)
        );

        const result = await Promise.race([sendPromise, timeoutPromise]);
        const reply = result.response.text();
        if (reply?.trim()) {
          return NextResponse.json({ reply, success: true });
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Continue to try next model in fallback list
      }
    }

    // If external models are busy/offline (e.g. 503 high demand), provide curated intelligent response
    console.warn("External Gemini API busy, serving intelligent local fallback:", lastError?.message || lastError);
    const fallbackReply = getLocalFallbackReply(message);
    return NextResponse.json({ reply: fallbackReply, success: true, isLocalFallback: true });
  } catch (error) {
    console.error("Chat API Fatal Error:", error);
    // Always return 200 with friendly message so browser never logs 500 error
    return NextResponse.json({
      reply: "નમસ્તે! 🙏 હાલમાં નેટવર્ક જોડાણમાં વિલંબ થઈ રહ્યો છે. કૃપા કરીને થોડીવાર પછી ફરી પ્રયાસ કરો અથવા નજીકના જનસેવા કેન્દ્રનો સંપર્ક કરો.",
      success: true,
      errorHandled: true,
    });
  }
}
