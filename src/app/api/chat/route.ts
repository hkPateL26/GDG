import { getChatModel, AVAILABLE_MODELS } from "@/lib/gemini";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import { ChatHistory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

function getLocalFallbackReply(query: string): string {
  const q = query.toLowerCase();

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
      (q.includes("gas") && s.id === "pm-ujjwala") ||
      (q.includes("ગેસ") && s.id === "pm-ujjwala") ||
      (q.includes("સિલિન્ડર") && s.id === "pm-ujjwala") ||
      (q.includes("loan") && s.id === "pm-mudra") ||
      (q.includes("લોન") && s.id === "pm-mudra") ||
      (q.includes("ration") && q.includes("card")) ||
      (q.includes("રેશન") && q.includes("કાર્ડ"))
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

    // Try available models with a 6-second per-model timeout
    let lastError: any = null;
    const fastModels = ["gemini-3.7-flash", "gemini-3.8-flash", "gemini-3.6-flash"];
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

        const result: any = await Promise.race([sendPromise, timeoutPromise]);
        const reply = result.response.text();
        if (reply?.trim()) {
          return NextResponse.json({ reply, success: true });
        }
      } catch (err: any) {
        lastError = err;
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
