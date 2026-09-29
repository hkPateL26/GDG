import { getChatModel } from "@/lib/gemini";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import { queryApplications, CitizenApplication } from "@/lib/large-datasets";
import { analyzeApplicationSla } from "@/lib/admin-hierarchy-data";
import { ChatHistory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

interface CitizenContext {
  name?: string;
  nameGu?: string;
  district?: string;
  taluka?: string;
  village?: string;
  aadhaarLast4?: string;
  mobile?: string;
}

export interface ChatActionButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "success";
  icon?: string;
}

export interface InChatApplicationCard {
  id: string;
  citizenName: string;
  schemeName: string;
  schemeNameGu: string;
  schemeEmoji: string;
  status: string;
  statusLabelGu: string;
  workflowStage: number;
  totalStages: number;
  currentDeskGu: string;
  elapsedMinutes: number;
  isBreached: boolean;
  actCitation: string;
  village: string;
  taluka: string;
  district: string;
  paymentStatus?: string;
  submissionDate?: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  gu: "Gujarati (ગુજરાતી)",
  hi: "Hindi (हिंदी)",
  en: "English",
  mr: "Marathi (मराठी)",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  kn: "Kannada (ಕನ್ನಡ)",
  ml: "Malayalam (മലയാളം)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  or: "Odia (ଓଡ଼ିଆ)",
  ur: "Urdu (اردو)",
};

function generateActionButtons(text: string): ChatActionButton[] {
  const q = text.toLowerCase();
  const buttons: ChatActionButton[] = [];

  if (q.includes("આવક") || q.includes("income") || q.includes("દાખલો") || q.includes("certificate")) {
    buttons.push({
      label: "🚀 આવકના દાખલા માટે અરજી કરો",
      href: "/documents?service=income-certificate",
      variant: "primary",
      icon: "FileText",
    });
  }

  if (q.includes("આયુષ્માન") || q.includes("ayushman") || q.includes("આરોગ્ય") || q.includes("health") || q.includes("hospital")) {
    buttons.push({
      label: "🏥 આયુષ્માન કાર્ડ સેવા & સહાય",
      href: "/documents?service=ayushman-card",
      variant: "primary",
      icon: "HeartPulse",
    });
  }

  if (q.includes("રેશન") || q.includes("ration") || q.includes("રાશન") || q.includes("અનાજ") || q.includes("fps")) {
    buttons.push({
      label: "📜 રેશનકાર્ડ સુધારા & નવી સેવા",
      href: "/documents?service=ration-card",
      variant: "primary",
      icon: "FileCheck",
    });
  }

  if (q.includes("કિસાન") || q.includes("kisan") || q.includes("ખેડૂત") || q.includes("farmer") || q.includes("ikhedut")) {
    buttons.push({
      label: "🌾 i-Khedut ખેડૂત પોર્ટલ",
      href: "https://ikhedut.gujarat.gov.in",
      variant: "secondary",
      icon: "Wheat",
    });
  }

  if (q.includes("આવાસ") || q.includes("awas") || q.includes("મકાન") || q.includes("ઘર")) {
    buttons.push({
      label: "🏠 PM આવાસ યોજના પોર્ટલ",
      href: "https://pmayg.nic.in",
      variant: "secondary",
      icon: "Home",
    });
  }

  // Universal helpful civic buttons
  if (!buttons.some((b) => b.href === "/benefit-calculator")) {
    buttons.push({
      label: "💰 કુટુંબ લાભ & પાત્રતા કેલ્ક્યુલેટર",
      href: "/benefit-calculator",
      variant: "secondary",
      icon: "IndianRupee",
    });
  }

  if (!buttons.some((b) => b.href === "/locator")) {
    buttons.push({
      label: "📍 નજીકની કચેરી & જનસેવા કેન્દ્ર",
      href: "/locator",
      variant: "secondary",
      icon: "MapPin",
    });
  }

  return buttons.slice(0, 3);
}

function getLocalFallbackReply(query: string, lang = "gu", citizenContext?: CitizenContext): {
  reply: string;
  applicationCard?: InChatApplicationCard;
  actionButtons: ChatActionButton[];
} {
  const q = query.toLowerCase();
  const citizenGreeting = citizenContext?.nameGu
    ? lang === "hi"
      ? `माननीय **${citizenContext.name || citizenContext.nameGu}** (${citizenContext.village || "Gomta"}), `
      : lang === "en"
      ? `Respected **${citizenContext.name || citizenContext.nameGu}** (${citizenContext.village || "Gomta"}), `
      : `માનનીય **${citizenContext.nameGu}** (${citizenContext.village || "ગોમટા"}, ${citizenContext.taluka || "ગોંડલ"}), `
    : "";

  // 1. Direct Application Tracking Match
  const appMatch = query.match(/(APP-GUJ-\d+|GUJ-\d+|GJ-\d+)/i);
  if (appMatch) {
    const targetId = appMatch[0].toUpperCase();
    const queryResult = queryApplications({ search: targetId, limit: 1 });
    const matchedApp: CitizenApplication | undefined = queryResult.records[0];

    if (matchedApp) {
      const sla = analyzeApplicationSla(matchedApp);
      const isApproved = matchedApp.status === "approved";
      const statusGu = isApproved
        ? "સત્તાવાર મંજૂર (Approved & e-Signed)"
        : matchedApp.status === "rejected"
        ? "સુધારણા જરૂરી (Action Required)"
        : "તબક્કો ૨: કચેરી સ્ક્રુટિની ચાલુ (In Progress)";

      const reply =
        `🏛️ **ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ (GRTSA) હેઠળ લાઈવ અરજી અહેવાલ**\n\n` +
        `👤 **અરજદાર:** ${matchedApp.citizenNameGu || matchedApp.citizenName}\n` +
        `📋 **યોજના:** ${matchedApp.schemeEmoji} ${matchedApp.schemeNameGu}\n` +
        `🔢 **અરજી ક્રમાંક:** \`${matchedApp.id}\`\n` +
        `📌 **વર્તમાન સ્થિતિ:** ${statusGu}\n` +
        `🏢 **જવાબદાર ડેસ્ક:** ${sla.currentDeskGu}\n` +
        `⏱️ **વિતાવેલ સમય:** ${sla.elapsedMinutes} મિનિટ (SLA સમયમર્યાદા: ૩ કામકાજી દિવસ)\n` +
        `📍 **અધિકારક્ષેત્ર:** ${matchedApp.village || "ગોમટા"}, તા. ${matchedApp.taluka || "ગોંડલ"}, જિ. ${matchedApp.district || "રાજકોટ"}\n\n` +
        (isApproved
          ? `✅ તમારી અરજી ડિજિટલ સહી (e-Sign) સાથે સત્તાવાર રીતે મંજૂર થઈ ગઈ છે. તમે નીચે આપેલા બટન પર ક્લિક કરીને મૂળ પ્રમાણપત્ર સીધું ડાઉનલોડ કરી શકો છો.`
          : `⏳ તમારી અરજી સંબંધિત સક્ષમ અધિકારીશ્રીના ટેબલ પર નિયમ મુજબ પ્રક્રિયા હેઠળ છે.`);

      const appCard: InChatApplicationCard = {
        id: matchedApp.id,
        citizenName: matchedApp.citizenNameGu || matchedApp.citizenName,
        schemeName: matchedApp.schemeName,
        schemeNameGu: matchedApp.schemeNameGu,
        schemeEmoji: matchedApp.schemeEmoji || "📋",
        status: matchedApp.status,
        statusLabelGu: statusGu,
        workflowStage: matchedApp.workflowStage || (isApproved ? 3 : 2),
        totalStages: 3,
        currentDeskGu: sla.currentDeskGu,
        elapsedMinutes: sla.elapsedMinutes,
        isBreached: sla.isBreached,
        actCitation: "ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ (GRTSA ૨૦૧૩)",
        village: matchedApp.village || "ગોમટા",
        taluka: matchedApp.taluka || "ગોંડલ",
        district: matchedApp.district || "રાજકોટ",
        paymentStatus: matchedApp.paymentStatus,
        submissionDate: matchedApp.appliedDate,
      };

      const buttons: ChatActionButton[] = [
        {
          label: "🔍 ટ્રેકિંગ વૉલ્ટમાં જુઓ",
          href: `/track?id=${encodeURIComponent(matchedApp.id)}`,
          variant: "primary",
        },
        {
          label: "📍 સંબંધિત કચેરી લોકેટર",
          href: "/locator",
          variant: "secondary",
        },
      ];

      return { reply, applicationCard: appCard, actionButtons: buttons };
    }
  }

  // 2. Ration Card
  if (q.includes("ration") || q.includes("રેશન") || q.includes("રાશન") || q.includes("બારકોડેડ રેશનકાર્ડ")) {
    const reply =
      `${citizenGreeting}📜 **રાષ્ટ્રીય ખાદ્ય સુરક્ષા અધિનિયમ, ૨૦૧૩ (NFSA 2013) - રેશનકાર્ડ સેવાઓ**\n\n` +
      `🏛️ **સત્તાવાર કાયદો:** રાષ્ટ્રીય ખાદ્ય સુરક્ષા કાયદો, ૨૦૧૩ & ગુજરાત આવશ્યક ચીજવસ્તુ નિયંત્રણ હુકમ.\n\n` +
      `📌 **મુખ્ય ઉપલબ્ધ સેવાઓ:**\n` +
      `• નવા બારકોડેડ રેશનકાર્ડ માટે અરજી\n` +
      `• કુટુંબમાં નવા સભ્ય (બાળક/પત્ની) નું નામ ઉમેરવું\n` +
      `• લગ્ન કે અવસાન બાદ નામ કમી કરાવવું\n` +
      `• અલગ રહેતા કુટુંબ માટે રેશનકાર્ડ વિભાજન (Split Card)\n` +
      `• વાજબી ભાવની દુકાન (FPS) અથવા સરનામું ફેરબદલી\n\n` +
      `📄 **જરૂરી આધાર પુરાવા:**\n` +
      `• કુટુંબના તમામ સભ્યોના આધાર કાર્ડ (UIDAI e-KYC)\n` +
      `• રહેઠાણ પુરાવો (લાઈટબિલ / મકાન વેરા પાવતી)\n` +
      `• નામ ઉમેરવા માટે: જન્મનો દાખલો અથવા લગ્ન નોંધણી પ્રમાણપત્ર\n` +
      `• રદ કરેલ જૂના રેશનકાર્ડની નકલ\n\n` +
      `⏱️ **GRTSA સમયમર્યાદા:** ૭ થી ૧૫ કામકાજી દિવસ (મામલતદાર પુરવઠા શાખા)\n` +
      `🌐 **સત્તાવાર પોર્ટલ:** [Digital Gujarat Portal](https://www.digitalgujarat.gov.in)`;

    return {
      reply,
      actionButtons: [
        { label: "🚀 રેશનકાર્ડ સેવા માટે અરજી કરો", href: "/documents?service=ration-card", variant: "primary" },
        { label: "💰 અનાજ & કલ્યાણ લાભ કેલ્ક્યુલેટર", href: "/benefit-calculator", variant: "secondary" },
        { label: "📍 પુરવઠા મામલતદાર કચેરી શોધો", href: "/locator", variant: "secondary" },
      ],
    };
  }

  // 3. Exact Scheme Match
  const matchedScheme = SCHEMES_DATA.find((s) => {
    return (
      q.includes(s.name.toLowerCase()) ||
      q.includes(s.nameGu.toLowerCase()) ||
      (s.nameHi && q.includes(s.nameHi.toLowerCase())) ||
      q.includes(s.category.toLowerCase()) ||
      ((q.includes("kisan") || q.includes("ખેડૂત") || q.includes("किसान")) && s.id === "pm-kisan") ||
      ((q.includes("ayushman") || q.includes("આયુષ્માન") || q.includes("आयुष्मान")) && s.id === "ayushman-bharat") ||
      ((q.includes("awas") || q.includes("આવાસ") || q.includes("आवास")) && s.id.includes("awas")) ||
      ((q.includes("gas") || q.includes("ગેસ") || q.includes("गैस")) && (s.id === "ujjwala-yojana" || s.id === "pm-ujjwala")) ||
      ((q.includes("loan") || q.includes("લોન") || q.includes("ऋण")) && (s.id === "mudra-loan" || s.id === "pm-mudra"))
    );
  });

  if (matchedScheme) {
    const actMap: Record<string, string> = {
      "pm-kisan": "🏛️ **સત્તાવાર અધિનિયમ:** પ્રધાનમંત્રી કિસાન સન્માન નિધિ માર્ગદર્શિકા (MoA&FW, ભારત સરકાર)",
      "ayushman-bharat": "🏛️ **સત્તાવાર અધિનિયમ:** આયુષ્માન ભારત - PMJAY (નેશનલ હેલ્થ ઓથોરિટી - NHA)",
      "pm-awas": "🏛️ **સત્તાવાર અધિનિયમ:** પ્રધાનમંત્રી આવાસ યોજના ગાઈડલાઈન્સ (MoHUA & MoRD)",
      "ujjwala-yojana": "🏛️ **સત્તાવાર અધિનિયમ:** PMUY 2.0 ઓઇલ માર્કેટિંગ કંપનીઝ કાયદો",
      "digital-gujarat-scholarship": "🏛️ **સત્તાવાર અધિનિયમ:** ગુજરાત સામાજિક ન્યાય અને અધિકારીતા વિભાગ નિયમો",
    };

    const eligList: string[] = [];
    if (matchedScheme.eligibility.incomeLimit) {
      eligList.push(`• વાર્ષિક આવક મર્યાદા: ₹${matchedScheme.eligibility.incomeLimit.toLocaleString("en-IN")}`);
    }
    if (matchedScheme.eligibility.minAge) {
      eligList.push(`• લઘુત્તમ ઉંમર: ${matchedScheme.eligibility.minAge} વર્ષ`);
    }
    if (matchedScheme.eligibility.maxAge) {
      eligList.push(`• મહત્તમ ઉંમર: ${matchedScheme.eligibility.maxAge} વર્ષ`);
    }
    if (matchedScheme.eligibility.gender && matchedScheme.eligibility.gender !== "all") {
      eligList.push(`• લાભાર્થી: ફક્ત ${matchedScheme.eligibility.gender === "female" ? "મહિલાઓ" : "પુરુષો"}`);
    }
    if (matchedScheme.eligibility.occupation && matchedScheme.eligibility.occupation.length > 0) {
      eligList.push(`• વ્યવસાય: ${matchedScheme.eligibility.occupation.join(", ")}`);
    }
    if (eligList.length === 0) {
      eligList.push("• ગુજરાતના તમામ પાત્ર નાગરિકો");
    }

    const schemeDisplayName =
      lang === "hi" && matchedScheme.nameHi
        ? `${matchedScheme.nameHi} (${matchedScheme.name})`
        : `${matchedScheme.nameGu} (${matchedScheme.name})`;

    const reply =
      `${citizenGreeting}📋 **${schemeDisplayName}**\n\n` +
      `${actMap[matchedScheme.id] || "🏛️ **સત્તાવાર સત્તા:** ગુજરાત અને ભારત સરકાર કલ્યાણકારી નિયમો"}\n\n` +
      `📌 **મુખ્ય સરકારી લાભો:**\n` +
      matchedScheme.benefits.map((b) => `• ${b}`).join("\n") +
      `\n\n🎯 **પાત્રતા નિયમો:**\n` +
      eligList.join("\n") +
      `\n\n📄 **જરૂરી આધાર પુરાવા (Checklist):**\n` +
      matchedScheme.documents.map((d) => `• ${d}`).join("\n") +
      `\n\n⏱️ **નાગરિક અધિકારપત્ર SLA:** ૧ થી ૭ કામકાજી દિવસ\n` +
      `🌐 **સત્તાવાર પોર્ટલ:** [${matchedScheme.applicationUrl}](${matchedScheme.applicationUrl})`;

    return {
      reply,
      actionButtons: generateActionButtons(matchedScheme.name + " " + matchedScheme.nameGu),
    };
  }

  // 4. Default Authenticated General Greeting
  const defaultReply =
    lang === "hi"
      ? `${citizenGreeting}नमस्ते! 🙏 NagrikSeva AI आधिकारिक ई-गवर्नेंस सहायक सेवा कार्यरत है।\n\n` +
        `🏛️ **गुजरात लोक सेवा अधिकार अधिनियम, 2013 (GRTSA)** के तहत सभी सरकारी योजनाओं, प्रमाण पत्रों और नागरिक अधिकारों की प्रामाणिक जानकारी यहाँ उपलब्ध है:\n\n` +
        `• 🌾 **PM किसान सम्मान निधि** (प्रति वर्ष ₹6,000 सीधे बैंक खाते में)\n` +
        `• 🏥 **आयुष्मान भारत PM-JAY** (प्रति वर्ष ₹5 से 10 लाख तक मुफ्त इलाज)\n` +
        `• 🏠 **PM आवास योजना** (पक्का मकान निर्माण हेतु ₹1.20 लाख सहायता)\n` +
        `• 📜 **राशन कार्ड सेवाएं** (नया नाम जोड़ना, हटाना, विभाजन - NFSA 2013)\n` +
        `• 🔍 **आवेदन स्थिति ट्रैकिंग** (उदा. लिखें: \`मेरा आवेदन APP-GUJ-8038 ट्रैक करें\`)\n\n` +
        `आप किसी भी भाषा में प्रश्न लिख सकते हैं या माइक (Mic 🎙️) से बोल सकते हैं!`
      : lang === "en"
      ? `${citizenGreeting}Namaste! 🙏 NagrikSeva AI official e-Governance assistant is ready to help.\n\n` +
        `🏛️ Under the **Gujarat Right to Public Services Act, 2013 (GRTSA)**, verified information on government welfare schemes, certificates, and entitlements is provided here:\n\n` +
        `• 🌾 **PM Kisan Samman Nidhi** (Rs. 6,000/year direct bank transfer)\n` +
        `• 🏥 **Ayushman Bharat PM-JAY** (Rs. 5 to 10 Lakhs cashless hospital cover)\n` +
        `• 🏠 **PM Awas Yojana** (Rs. 1.20 Lakh housing construction subsidy)\n` +
        `• 📜 **Ration Card Services** (Member addition, deletion, split - NFSA 2013)\n` +
        `• 🔍 **Application Tracking** (e.g. type: \`Track my application APP-GUJ-8038\`)\n\n` +
        `You can ask in English, Gujarati or Hindi, or speak via the Mic (🎙️)!`
      : `${citizenGreeting}નમસ્તે! 🙏 NagrikSeva AI સત્તાવાર ઈ-ગવર્નન્સ સહાયક સેવા કાર્યરત છે.\n\n` +
        `🏛️ **ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ (GRTSA)** હેઠળ તમામ સરકારી યોજનાઓ, પ્રમાણપત્રો અને હકોની અધિકૃત માહિતી અહીં ઉપલબ્ધ છે:\n\n` +
        `• 🌾 **PM કિસાન સન્માન નિધિ** (વાર્ષિક ₹6,000 સીધા બેંક ખાતામાં)\n` +
        `• 🏥 **આયુષ્માન ભારત PM-JAY** (વાર્ષિક ₹5 થી 10 લાખ નિ:શુલ્ક સારવાર)\n` +
        `• 🏠 **PM આવાસ યોજના** (પાકા મકાન બાંધકામ માટે ₹1.20 લાખ સહાય)\n` +
        `• 📜 **રેશનકાર્ડ સેવાઓ** (નવા નામ ઉમેરવા, કમી કરવા, વિભાજન - NFSA ૨૦૧૩)\n` +
        `• 🔍 **અરજી સ્ટેટસ ટ્રેકિંગ** (દા.ત. લખો: \`મારી અરજી APP-GUJ-8038 ટ્રેક કરો\`)\n\n` +
        `તમે કોઈપણ સવાલ તમારી પસંદગીની ભાષામાં લખી શકો છો અથવા માઇક (Mic 🎙️) વડે બોલી શકો છો!`;

  return {
    reply: defaultReply,
    actionButtons: [
      { label: "💰 મારી પાત્રતા ગણો", href: "/benefit-calculator", variant: "primary" },
      { label: "📋 બધી સરકારી યોજનાઓ જુઓ", href: "/schemes", variant: "secondary" },
      { label: "📍 નજીકની સરકારી કચેરી શોધો", href: "/locator", variant: "secondary" },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      history,
      language = "gu",
      citizenContext,
    }: {
      message: string;
      history: ChatHistory[];
      language?: string;
      citizenContext?: CitizenContext;
    } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const trimmedMsg = message.trim();
    const appMatch = trimmedMsg.match(/(APP-GUJ-\d+|GUJ-\d+|GJ-\d+)/i);

    // If direct application tracking was asked, serve exact live database record with 0 latency
    if (appMatch) {
      const liveData = getLocalFallbackReply(trimmedMsg, language, citizenContext);
      if (liveData.applicationCard) {
        return NextResponse.json({
          reply: liveData.reply,
          applicationCard: liveData.applicationCard,
          actionButtons: liveData.actionButtons,
          success: true,
          isApplicationTrack: true,
        });
      }
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

    const targetLangName = LANGUAGE_NAMES[language] || "Gujarati (ગુજરાતી)";
    const citizenInstruction = citizenContext?.nameGu
      ? `\n[CITIZEN IDENTITY: The citizen is ${citizenContext.nameGu} (${citizenContext.village || "Gomta"}, ${citizenContext.taluka || "Gondal"}, District: ${citizenContext.district || "Rajkot"}). Address them respectfully.]`
      : "";

    const systemPromptSuffix =
      `\n\n[STRICT LANGUAGE MANDATE: You MUST generate your response ENTIRELY in ${targetLangName}. Do NOT use any other language.]` +
      `\n[STRICT LAW INSTRUCTION: Cite relevant official Acts like Gujarat Right to Public Services Act (GRTSA 2013), National Food Security Act (NFSA 2013), PM-JAY Guidelines, or PM-KISAN. Format with emojis, bold headers, criteria, documents, and portal links.]` +
      citizenInstruction;

    // Fast multi-model fallback list (tries 3.7 first, then 3.8 if 503 spike)
    const fastModels = ["gemini-3.7-flash", "gemini-3.8-flash"];
    let lastError: Error | null = null;

    for (const modelName of fastModels) {
      try {
        const model = getChatModel(modelName);
        const chat = model.startChat({ history: sanitizedHistory });

        const sendPromise = chat.sendMessage(trimmedMsg + systemPromptSuffix);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on model ${modelName}`)), 15000)
        );

        const result = await Promise.race([sendPromise, timeoutPromise]);
        const reply = result.response.text();
        if (reply?.trim()) {
          const actionButtons = generateActionButtons(trimmedMsg + " " + reply);
          return NextResponse.json({
            reply,
            actionButtons,
            success: true,
          });
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    // Curated intelligent local fallback if external models are unavailable
    console.warn("External Gemini API busy, serving intelligent local fallback:", lastError?.message || lastError);
    const fallback = getLocalFallbackReply(trimmedMsg, language, citizenContext);
    return NextResponse.json({
      reply: fallback.reply,
      applicationCard: fallback.applicationCard,
      actionButtons: fallback.actionButtons,
      success: true,
      isLocalFallback: true,
    });
  } catch (error) {
    console.error("Chat API Fatal Error:", error);
    return NextResponse.json({
      reply:
        "નમસ્તે! 🙏 હાલમાં નેટવર્ક જોડાણમાં વિલંબ થઈ રહ્યો છે. ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ હેઠળ તમામ સેવાઓ જનસેવા કેન્દ્ર (CSC) અથવા ડિજિટલ ગુજરાત પોર્ટલ પર પણ ઉપલબ્ધ છે.",
      success: true,
      errorHandled: true,
      actionButtons: [
        { label: "💰 પાત્રતા કેલ્ક્યુલેટર", href: "/benefit-calculator", variant: "primary" },
        { label: "📍 કચેરી લોકેટર", href: "/locator", variant: "secondary" },
      ],
    });
  }
}
