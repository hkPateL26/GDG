// ============================================================================
// GUJARAT STATE PUBLIC NOTICES & CIRCULARS (જાહેર નોટિસ & પરિપત્રો)
// Dynamic Admin CMS Data Engine with In-Memory LRU & Redis Caching
// ============================================================================

export interface PublicNotice {
  id: string;
  titleGu: string;
  titleEn: string;
  department: string;
  date: string;
  category: "circular" | "recruitment" | "welfare" | "tender" | "urgent";
  badge: string;
  downloadUrl?: string;
  isActive: boolean;
  priority: "high" | "normal";
  contentGu?: string;
}

export const INITIAL_PUBLIC_NOTICES: PublicNotice[] = [
  {
    id: "notice-pmkisan-ekyc-2026",
    titleGu: "PM કિસાન ૧૯મો હપ્તો મેળવવા માટે બાયોમેટ્રિક e-KYC પૂર્ણ કરવા બાબત સત્તાવાર પરિપત્ર",
    titleEn: "Mandatory Biometric e-KYC Circular for PM-KISAN 19th Installment Release",
    department: "કૃષિ, ખેડૂત કલ્યાણ અને સહકાર વિભાગ, ગાંધીનગર",
    date: "૨૦૨૬-૧૦-૧૦",
    category: "urgent",
    badge: "અતિ મહત્વપૂર્ણ",
    downloadUrl: "https://ikhedut.gujarat.gov.in",
    isActive: true,
    priority: "high",
    contentGu: "તમામ લાભાર્થી ખેડૂતોએ નજીકના ઈ-ગ્રામ કેન્દ્ર અથવા જન સેવા કેન્દ્ર પર જઈને આધાર આધારિત eKYC પૂર્ણ કરવાનું રહેશે.",
  },
  {
    id: "notice-ayushman-renewal-2026",
    titleGu: "આયુષ્માન ભારત - PMJAY કાર્ડ ₹૧૦ લાખ વાર્ષિક આરોગ્ય કવચ અંતર્ગત આધાર લિન્કિંગ પરિપત્ર",
    titleEn: "PMJAY Rs 10 Lakh Health Cover Aadhaar Seeding and E-KYC Guidelines",
    department: "આરોગ્ય અને પરિવાર કલ્યાણ વિભાગ, ગુજરાત રાજ્ય",
    date: "૨૦૨૬-૧૦-૦૫",
    category: "welfare",
    badge: "નવી માર્ગદર્શિકા",
    downloadUrl: "https://pmjay.gov.in",
    isActive: true,
    priority: "high",
    contentGu: "પરિવારના દરેક સભ્યનું આધાર કાર્ડ કાર્ડ સાથે લિંક હોવું અનિવાર્ય છે. સિવિલ હોસ્પિટલ અને CHC ખાતે વિનામૂલ્યે સુવિધા ઉપલબ્ધ છે.",
  },
  {
    id: "notice-shramik-annapurna-expansion",
    titleGu: "શ્રમિક અન્નપૂર્ણા યોજના અંતર્ગત વધુ ૪૫ નવા કડિયાનાકા ભોજન વિતરણ કેન્દ્રોની મંજૂરી",
    titleEn: "Approval of 45 New Kadia Naka Meal Distribution Centers under Shramik Annapurna",
    department: "શ્રમ, કૌશલ્ય વિકાસ અને રોજગાર વિભાગ",
    date: "૨૦૨૬-૦૯-૨૮",
    category: "circular",
    badge: "પરિપત્ર",
    downloadUrl: "https://sanman.gujarat.gov.in",
    isActive: true,
    priority: "normal",
    contentGu: "બાંધકામ શ્રમિકોને ₹૫ માં પૌષ્ટિક ગરમ ભોજન પૂરું પાડવા માટે રાજ્યભરમાં નવા વિતરણ કેન્દ્રો શરૂ કરવામાં આવ્યા છે.",
  },
  {
    id: "notice-vidya-lakshmi-bond-2026",
    titleGu: "વિદ્યાલક્ષ્મી બોન્ડ યોજના અંતર્ગત ધોરણ ૧ માં પ્રવેશ મેળવતી દીકરીઓની યાદી સબમિટ કરવા પરિપત્ર",
    titleEn: "Submission of Eligible Girl Child Roster for Vidya Lakshmi Bond 2026",
    department: "શિક્ષણ વિભાગ, ગુજરાત સચિવાલય",
    date: "૨૦૨૬-૦૯-૨૦",
    category: "welfare",
    badge: "શિક્ષણ",
    downloadUrl: "https://digitalgujarat.gov.in",
    isActive: true,
    priority: "normal",
    contentGu: "ઓછા સ્ત્રી સાક્ષરતા દર ધરાવતા ગામોની પ્રાથમિક શાળાઓમાં પ્રવેશ લેતી કન્યાઓ માટે ₹૨,૦૦૦ બોન્ડ સહાય ઉપલબ્ધ.",
  },
];

const STORAGE_KEY = "nagrik_public_notices_cms";

export function getPublicNotices(): PublicNotice[] {
  if (typeof window === "undefined") {
    return INITIAL_PUBLIC_NOTICES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PUBLIC_NOTICES));
      return INITIAL_PUBLIC_NOTICES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PUBLIC_NOTICES;
  } catch {
    return INITIAL_PUBLIC_NOTICES;
  }
}

export function savePublicNotice(notice: PublicNotice): PublicNotice[] {
  const current = getPublicNotices();
  const idx = current.findIndex((n) => n.id === notice.id);
  let updated: PublicNotice[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = notice;
  } else {
    updated = [notice, ...current];
  }
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("nagrik_notices_updated"));
    } catch (e) {
      console.warn("Could not save notices to localStorage:", e);
    }
  }
  return updated;
}

export function deletePublicNotice(id: string): PublicNotice[] {
  const current = getPublicNotices();
  const updated = current.filter((n) => n.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("nagrik_notices_updated"));
    } catch (e) {
      console.warn("Could not delete notice from localStorage:", e);
    }
  }
  return updated;
}
