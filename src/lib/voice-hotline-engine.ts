/**
 * NagrikSeva AI - Interactive Gujarati Voice Hotline Engine (જન-સંવાદ હેલ્પલાઇન)
 * 
 * Purpose: Provides a two-way conversational voice gateway designed specifically
 * for rural, elderly, and low-literacy citizens who cannot easily type or read on screens.
 * Citizens speak naturally in Gujarati, the engine analyzes civic intents, and speaks back
 * in fluent, warm Gujarati audio with clear actionable steps.
 */

export interface VoiceHotlineTopic {
  id: string;
  category: "agriculture" | "health" | "social" | "revenue" | "energy" | "ration";
  iconName: string;
  spokenPromptGu: string;
  spokenPromptEn: string;
  shortAnswerGu: string;
  spokenAudioTextGu: string;
  actionUrl: string;
  actionLabelGu: string;
}

export interface VoiceHotlineResponse {
  query: string;
  lang: "gu" | "hi" | "en";
  spokenText: string;
  displayText: string;
  actionUrl?: string;
  actionLabel?: string;
  source: "curated_dpi_hotline" | "gemini_ai" | "fallback";
}

export const HOTLINE_CURATED_TOPICS: VoiceHotlineTopic[] = [
  {
    id: "farmer-ikhedut",
    category: "agriculture",
    iconName: "Tractor",
    spokenPromptGu: "મને ખેતીવાડી અને ટ્રેક્ટર ખરીદવા માટે કઈ સહાય મળશે?",
    spokenPromptEn: "What assistance can I get for farming and tractor purchase?",
    shortAnswerGu: "ગુજરાત સરકારના i-Khedut પોર્ટલ હેઠળ ખેડૂતોને ટ્રેક્ટર ખરીદવા ₹45,000 થી ₹60,000 સુધીની સબસિડી મળે છે. આ ઉપરાંત ડ્રીપ ઇરીગેશન (ટપક પદ્ધતિ) માટે 70% સહાય અને પીએમ-કિસાન યોજના હેઠળ દર વર્ષે ₹6,000 સીધા બેંક ખાતામાં જમા થાય છે.",
    spokenAudioTextGu: "નમસ્તે ખેડૂત મિત્ર. ગુજરાત સરકારના આઈ-ખેડૂત પોર્ટલ હેઠળ ખેડૂતોને ટ્રેક્ટર ખરીદવા ૪૫ હજાર થી ૬૦ હજાર રૂપિયા સુધીની સબસિડી મળે છે. આ ઉપરાંત ટપક સિંચાઈ માટે ૭૦ ટકા સહાય અને પીએમ કિસાન યોજનાના દર વર્ષે ૬ હજાર રૂપિયા સીધા બેંક ખાતામાં મળે છે. અરજી કરવા ૭-૧૨ અને આધાર કાર્ડ સાથે રાખવું.",
    actionUrl: "https://ikhedut.gujarat.gov.in",
    actionLabelGu: "i-Khedut પોર્ટલ ખોલો",
  },
  {
    id: "ayushman-card",
    category: "health",
    iconName: "HeartPulse",
    spokenPromptGu: "આયુષ્માન ભારત કાર્ડમાં ₹10 લાખ સુધી મફત સારવાર કઈ રીતે મળે?",
    spokenPromptEn: "How to get free treatment up to ₹10 Lakh with Ayushman Card?",
    shortAnswerGu: "PMJAY-મા યોજના હેઠળ ગુજરાતના દરેક પાત્ર કુટુંબને માન્ય સરકારી અને ખાનગી હોસ્પિટલમાં વાર્ષિક ₹10 લાખ સુધી કેશલેસ સારવાર મફત મળે છે. નજીકના જનસેવા કેન્દ્ર અથવા સરકારી દવાખાનેથી રેશનકાર્ડ અને આધાર કાર્ડ આપીને આયુષ્માન કાર્ડ મેળવી શકાય છે.",
    spokenAudioTextGu: "નમસ્તે. આયુષ્માન ભારત પ્રધાનમંત્રી જન આરોગ્ય યોજના હેઠળ ગુજરાતના પરિવારોને વાર્ષિક ૧૦ લાખ રૂપિયા સુધીની મફત હોસ્પિટલ સારવાર મળે છે. આ કાર્ડ કઢાવવા માટે તમારા કુટુંબનું રેશનકાર્ડ અને આધાર કાર્ડ લઈને નજીકના જનસેવા કેન્દ્ર અથવા સિવિલ હોસ્પિટલ જવું.",
    actionUrl: "/documents?service=ayushman-card",
    actionLabelGu: "આયુષ્માન સેવા વિગત",
  },
  {
    id: "widow-pension",
    category: "social",
    iconName: "Users",
    spokenPromptGu: "ગંગા સ્વરૂપા વિધવા બહેનો માટે માસિક પેન્શન કેટલું મળે છે?",
    spokenPromptEn: "How much monthly pension is given to widows under Ganga Swarupa Yojana?",
    shortAnswerGu: "ગંગા સ્વરૂપા આર્થિક સહાય યોજના હેઠળ નિરાધાર વિધવા બહેનોને દર મહિને ₹1,250 સીધા ડીબીટી (DBT) દ્વારા પોસ્ટ અથવા બેંક ખાતામાં મળે છે. ગ્રામ પંચાયતમાં તલાટી અથવા તાલુકા મામલતદાર કચેરીએ અરજી કરી શકાય છે.",
    spokenAudioTextGu: "નમસ્તે બહેન. ગંગા સ્વરૂપા વિધવા સહાય યોજના હેઠળ બહેનોને દર મહિને ૧૨૫૦ રૂપિયા સીધા બેંક ખાતામાં જમા થાય છે. આ માટે પતિના મરણનો દાખલો, આવકનો દાખલો અને આધાર કાર્ડ લઈને ગ્રામ પંચાયતમાં તલાટી કમ મંત્રી અથવા તાલુકા મામલતદાર કચેરીનો સંપર્ક કરવો.",
    actionUrl: "/schemes?category=social",
    actionLabelGu: "પેન્શન યોજના વિગત",
  },
  {
    id: "income-certificate",
    category: "revenue",
    iconName: "FileText",
    spokenPromptGu: "આવકનો દાખલો કઢાવવા કયા કાગળો જોઈએ અને કેટલા દિવસ લાગે?",
    spokenPromptEn: "What documents are needed for an Income Certificate and how long does it take?",
    shortAnswerGu: "આવકના દાખલા માટે આધાર કાર્ડ, રેશન કાર્ડ, છેલ્લા મહિનાનું લાઈટબિલ અને તલાટીનો પંચનામા રિપોર્ટ જરૂરી છે. ગુજરાત લોકસેવા હક અધિનિયમ (GRTPSA 2013) હેઠળ ૧ દિવસમાં મામલતદાર અથવા ઈ-ધરા કેન્દ્ર પરથી દાખલો મળી જાય છે.",
    spokenAudioTextGu: "નમસ્તે. આવકનો દાખલો કઢાવવા માટે આધાર કાર્ડ, રેશનકાર્ડ, લાઈટબિલ અને તલાટીનો રિપોર્ટ જરૂરી છે. ગુજરાત લોકસેવા હક કાનૂન હેઠળ આ દાખલો ૧ દિવસમાં તૈયાર કરી આપવાનો નિયમ છે. તમે જનસેવા કેન્દ્ર પરથી તરત મેળવી શકો છો.",
    actionUrl: "/documents?service=income-certificate",
    actionLabelGu: "આવક દાખલો ચેકલિસ્ટ",
  },
  {
    id: "ration-card",
    category: "ration",
    iconName: "Wheat",
    spokenPromptGu: "રેશનકાર્ડમાં નવું નામ ઉમેરવા અથવા સુધારો કરવા શું કરવું?",
    spokenPromptEn: "How to add a new name or make changes in Ration Card?",
    shortAnswerGu: "રેશનકાર્ડમાં બાળકના જન્મ દાખલા અથવા લગ્ન નોંધણીના આધારે નામ ઉમેરી શકાય છે. ડિજિટલ ગુજરાત પોર્ટલ પર ફોર્મ નંબર ૩ ભરીને અથવા મામલતદાર કચેરીના પુરવઠા વિભાગમાં જઈને સુધારો કરાવી શકાય છે.",
    spokenAudioTextGu: "નમસ્તે. રેશનકાર્ડમાં નવું નામ ઉમેરવા માટે બાળકના જન્મનો દાખલો અથવા નવા સભ્યનું આધાર કાર્ડ જરૂરી છે. આ કામ ડિજિટલ ગુજરાત વેબસાઈટ પરથી અથવા તમારા તાલુકા મામલતદાર કચેરીના અન્ન અને નાગરિક પુરવઠા વિભાગમાંથી થઈ શકે છે.",
    actionUrl: "/documents?service=ration-card",
    actionLabelGu: "રેશનકાર્ડ સેવા જુઓ",
  },
  {
    id: "solar-rooftop",
    category: "energy",
    iconName: "Sun",
    spokenPromptGu: "પીએમ સૂર્ય ઘર યોજના હેઠળ મફત વીજળી અને સબસિડી કેવી રીતે મળે?",
    spokenPromptEn: "How to get free electricity and subsidy under PM Surya Ghar Yojana?",
    shortAnswerGu: "પીએમ સૂર્ય ઘર મફત વીજળી યોજના હેઠળ ઘરની છત પર સોલાર રૂફટોપ લગાવવા પર ₹78,000 સુધીની સરકારી સબસિડી મળે છે. તેનાથી દર મહિને 300 યુનિટ સુધી મફત વીજળી મળે છે અને વીજળી બિલ શૂન્ય થઈ જાય છે.",
    spokenAudioTextGu: "નમસ્તે. પીએમ સૂર્ય ઘર મફત વીજળી યોજના હેઠળ ઘરની છત પર સોલાર પેનલ લગાવવા માટે ૭૮ હજાર રૂપિયા સુધીની સબસિડી મળે છે. તેનાથી દર મહિને ૩૦૦ યુનિટ સુધી વીજળી બિલકુલ મફત મળે છે. ઓનલાઇન પોર્ટલ પરથી અરજી કરી શકાય છે.",
    actionUrl: "/benefit-calculator",
    actionLabelGu: "સોલાર બચત ગણો",
  },
];

/**
 * Normalizes text for clean, fluent speech playback on Gujarati/Hindi TTS engines.
 * Converts symbols, brackets, currency markers into easily spoken regional words.
 */
export function cleanTextForVoicePlayback(rawText: string, lang = "gu"): string {
  if (!rawText) return "";

  let cleaned = rawText
    // Remove markdown links [Text](URL) -> Text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove markdown styles like **, *, _, `, #, ~
    .replace(/[*#_~`>•-]/g, " ")
    // Remove raw URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove emojis
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    // Spoken replacements for symbols
    .replace(/₹\s*([0-9,]+)/g, (_match, p1) => {
      const num = p1.replace(/,/g, "");
      return lang === "gu" ? `${num} રૂપિયા` : lang === "hi" ? `${num} रुपये` : `${num} Rupees`;
    })
    .replace(/%/g, lang === "gu" ? " ટકા " : lang === "hi" ? " प्रतिशत " : " percent ")
    .replace(/PM-?JAY/gi, "પીએમ જે એ વાય")
    .replace(/DBT/gi, "ડી બી ટી")
    .replace(/KYC/gi, "કે વાય સી")
    .replace(/SLA/gi, "સમય મર્યાદા")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}

/**
 * Evaluates spoken citizen queries against the DPI Knowledge Base to produce
 * instant, reliable two-way Gujarati audio guidance even when offline or low-bandwidth.
 */
export function resolveVoiceHotlineQuery(
  rawQuery: string,
  lang: "gu" | "hi" | "en" = "gu"
): VoiceHotlineResponse {
  const q = rawQuery.toLowerCase().trim();

  // 1. Agriculture / Farmer queries
  if (
    q.includes("ખેતી") ||
    q.includes("ખેડૂત") ||
    q.includes("ટ્રેક્ટર") ||
    q.includes("farmer") ||
    q.includes("kisan") ||
    q.includes("સબસિડી") ||
    q.includes("ikhedut") ||
    q.includes("કિસાન")
  ) {
    const topic = HOTLINE_CURATED_TOPICS.find((t) => t.id === "farmer-ikhedut")!;
    return {
      query: rawQuery,
      lang,
      spokenText: topic.spokenAudioTextGu,
      displayText: topic.shortAnswerGu,
      actionUrl: topic.actionUrl,
      actionLabel: topic.actionLabelGu,
      source: "curated_dpi_hotline",
    };
  }

  // 2. Health / Ayushman queries
  if (
    q.includes("આયુષ્માન") ||
    q.includes("સારવાર") ||
    q.includes("દવાખાનું") ||
    q.includes("હોસ્પિટલ") ||
    q.includes("આરોગ્ય") ||
    q.includes("health") ||
    q.includes("ayushman") ||
    q.includes("૧૦ લાખ") ||
    q.includes("10 લાખ")
  ) {
    const topic = HOTLINE_CURATED_TOPICS.find((t) => t.id === "ayushman-card")!;
    return {
      query: rawQuery,
      lang,
      spokenText: topic.spokenAudioTextGu,
      displayText: topic.shortAnswerGu,
      actionUrl: topic.actionUrl,
      actionLabel: topic.actionLabelGu,
      source: "curated_dpi_hotline",
    };
  }

  // 3. Widow / Social pension queries
  if (
    q.includes("વિધવા") ||
    q.includes("ગંગા સ્વરૂપા") ||
    q.includes("પેન્શન") ||
    q.includes("સહાય") ||
    q.includes("widow") ||
    q.includes("pension")
  ) {
    const topic = HOTLINE_CURATED_TOPICS.find((t) => t.id === "widow-pension")!;
    return {
      query: rawQuery,
      lang,
      spokenText: topic.spokenAudioTextGu,
      displayText: topic.shortAnswerGu,
      actionUrl: topic.actionUrl,
      actionLabel: topic.actionLabelGu,
      source: "curated_dpi_hotline",
    };
  }

  // 4. Income / Revenue Certificate queries
  if (
    q.includes("આવક") ||
    q.includes("દાખલો") ||
    q.includes("સર્ટિફિકેટ") ||
    q.includes("income") ||
    q.includes("certificate") ||
    q.includes("તલાટી") ||
    q.includes("મામલતદાર")
  ) {
    const topic = HOTLINE_CURATED_TOPICS.find((t) => t.id === "income-certificate")!;
    return {
      query: rawQuery,
      lang,
      spokenText: topic.spokenAudioTextGu,
      displayText: topic.shortAnswerGu,
      actionUrl: topic.actionUrl,
      actionLabel: topic.actionLabelGu,
      source: "curated_dpi_hotline",
    };
  }

  // 5. Ration card queries
  if (
    q.includes("રેશન") ||
    q.includes("રાશન") ||
    q.includes("અનાજ") ||
    q.includes("નામ ઉમેરવું") ||
    q.includes("ration")
  ) {
    const topic = HOTLINE_CURATED_TOPICS.find((t) => t.id === "ration-card")!;
    return {
      query: rawQuery,
      lang,
      spokenText: topic.spokenAudioTextGu,
      displayText: topic.shortAnswerGu,
      actionUrl: topic.actionUrl,
      actionLabel: topic.actionLabelGu,
      source: "curated_dpi_hotline",
    };
  }

  // 6. Solar Rooftop / PM Surya Ghar queries
  if (
    q.includes("સોલાર") ||
    q.includes("સૂર્ય ઘર") ||
    q.includes("વીજળી") ||
    q.includes("બિલ") ||
    q.includes("solar") ||
    q.includes("rooftop")
  ) {
    const topic = HOTLINE_CURATED_TOPICS.find((t) => t.id === "solar-rooftop")!;
    return {
      query: rawQuery,
      lang,
      spokenText: topic.spokenAudioTextGu,
      displayText: topic.shortAnswerGu,
      actionUrl: topic.actionUrl,
      actionLabel: topic.actionLabelGu,
      source: "curated_dpi_hotline",
    };
  }

  // Universal Fallback Spoken Guidance
  const fallbackSpokenGu =
    "નમસ્તે. હું નાગરિક સેવા એઆઈ જન-સંવાદ હેલ્પલાઇન છું. તમે ખેતીવાડી સહાય, આયુષ્માન કાર્ડ, વિધવા પેન્શન, આવકનો દાખલો કે રેશનકાર્ડ વિશે પૂછી શકો છો. બોલવા માટે ફરીથી માઈક બટન દબાવો.";
  const fallbackDisplayGu =
    "નમસ્તે. નાગરિક સેવા AI જન-સંવાદ હેલ્પલાઇનમાં તમારું સ્વાગત છે. ખેતીવાડી સહાય, આયુષ્માન કાર્ડ, વિધવા સહાય, આવકનો દાખલો કે રેશનકાર્ડ વિશે સ્પષ્ટ બોલીને પૂછી શકો છો.";

  return {
    query: rawQuery,
    lang,
    spokenText: fallbackSpokenGu,
    displayText: fallbackDisplayGu,
    actionUrl: "/schemes",
    actionLabel: "બધી સરકારી યોજનાઓ જુઓ",
    source: "fallback",
  };
}

export const HOTLINE_GOV_CONTACTS = {
  cmHelpline: "1800-233-5500",
  disasterControl: "1077",
  farmerKisanCallCenter: "1800-180-1551",
  womenHelpline: "181",
  ayushmanTollFree: "14555",
};
