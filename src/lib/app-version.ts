export const APP_VERSION = "v2.9.4";
export const APP_BUILD_NAME = "National DPI Release v2.9.4 - Live Camera QR Code Scanner & Statutory Verification Gateway";
export const APP_RELEASE_DATE = "૧૭ ઓક્ટોબર ૨૦૨૬";
export const APP_RELEASE_DATE_EN = "17 October 2026";
export const APP_GOV_DEPT = "ગુજરાત સરકાર - વિજ્ઞાન અને પ્રૌદ્યોગિકી વિભાગ (DST) & e-Governance";

export interface LeadDeveloper {
  name: string;
  nameGu: string;
  role: string;
  roleGu: string;
}

export const LEAD_DEVELOPERS: LeadDeveloper[] = [
  {
    name: "Hari Patel",
    nameGu: "હરિ પટેલ",
    role: "Chief System Architect & AI Engineer",
    roleGu: "મુખ્ય સિસ્ટમ આર્કિટેક્ટ & AI એન્જિનિયર",
  },
  {
    name: "Jeet Jajal",
    nameGu: "જીત જાજલ",
    role: "Lead Full-Stack & Cloud Infrastructure Engineer",
    roleGu: "લીડ ફુલ-સ્ટેક & ક્લાઉડ ઇન્ફ્રાસ્ટ્રક્ચર એન્જિનિયર",
  },
];

export const APP_CHANGELOG = [
  {
    titleGu: "લાઈવ કેમેરા QR સ્કેનર & ડિજિટલ ખરાઈ ગેટવે (v2.9.4)",
    titleEn: "Live Camera QR Code Scanner & Instant Verification Gateway",
    descGu: "કોઈપણ સરકારી પ્રમાણપત્ર કે પહોંચ પર છપાયેલ QR કોડને ફોન કેમેરાથી લાઈવ સ્કેન કરીને અથવા ફોટો અપલોડ કરીને ક્ષણવારમાં કાનૂની અસલિયત (IT Act ૨૦૦૦) ચકાસી શકાય છે.",
  },
  {
    titleGu: "ગ્રામીણ ઑફલાઇન PWA & બેકગ્રાઉન્ડ સિંક એન્જિન (v2.9.3)",
    titleEn: "Rural Offline PWA & Background Sync Resilience Engine",
    descGu: "ઇન્ટરનેટ ડાઉન હોય કે 2G નેટવર્ક હોય ત્યારે પણ તમામ સરકારી રસીદો, પ્રમાણપત્રો અને ડેટા ઑફલાઇન સુરક્ષિત રહે છે. અરજી ઑફલાઇન સબમિટ થઈને નેટવર્ક આવતાં જ આપોઆપ ક્લાઉડ સર્વર સાથે સિંક થાય છે.",
  },
  {
    titleGu: "ક્રિપ્ટોગ્રાફિક SHA-256 ડિજિટલ નોટરી & સાર્વજનિક ચકાસણી પોર્ટલ (/verify)",
    titleEn: "Cryptographic SHA-256 Digital Notary & Public Verification Gateway",
    descGu: "દરેક સરકારી પ્રમાણપત્ર અને રસીદ પર ગણતરીબદ્ધ SHA-256 સીલ અને QR કોડ જનરેટ થાય છે, જે /verify પોર્ટલ પર સ્કેન કરીને કોઈપણ સરકારી અધિકારી કે નાગરિક દ્વારા ક્ષણવારમાં પ્રમાણિત કરી શકાય છે (IT Act ૨૦૦૦).",
  },
  {
    titleGu: "૧-ક્લિક AI ઓટો-ફિલ (Zero-Typing Application)",
    titleEn: "1-Click AI Auto-Fill via Gemini Vision",
    descGu: "દસ્તાવેજ (આધાર/રેશન કાર્ડ) અપલોડ કરતાં જ Gemini Vision તમામ વિગતો (નામ, જન્મ તારીખ, સરનામું, ગામ) આપોઆપ વાંચીને ૧-ક્લિકમાં આખું ફોર્મ ભરી આપે છે.",
  },
  {
    titleGu: "સરળ મોડ (Saral Mode - Accessible View)",
    titleEn: "Saral Citizen Mode (WCAG 2.1 AAA Accessible View)",
    descGu: "વડીલો અને ગ્રામીણ નાગરિકો માટે સરળ ૩-કાર્ડ વોઈસ ઇન્ટરફેસ (WCAG AAA) ઉમેરવામાં આવી.",
  },
  {
    titleGu: "સત્તાવાર સાયબર ટ્રેઝરી યુનિફાઇડ પેમેન્ટ & /payment URL",
    titleEn: "Unified Cyber Treasury Payment & Official /payment URL",
    descGu: "વધારાના બટનો હટાવીને સત્તાવાર સાયબર ટ્રેઝરી Razorpay બટન સેટ કર્યું અને પેમેન્ટ સમયે બ્રાઉઝર એડ્રેસ બારમાં /payment URL લાઈવ સિંક કર્યું.",
  },
  {
    titleGu: "ઝીરો-લેટન્સી ઇન્સ્ટન્ટ સરકારી પહોંચ (<૧૫ms)",
    titleEn: "Zero-Latency Instant Receipt Generation (<15ms)",
    descGu: "Razorpay કે UPI ચુકવણી પૂર્ણ થતાં જ ૧ સેકન્ડની પણ રાહ જોયા વગર પહોંચ અને ચલણ તુરંત જનરેટ થાય છે, જ્યારે સહી ચકાસણી અને ક્લાઉડ સિંક બેકગ્રાઉન્ડમાં સમાંતર ચાલે છે.",
  },
  {
    titleGu: "સત્તાવાર DigiLocker & MeriPehchaan ગેટવે",
    titleEn: "Official DigiLocker & MeriPehchaan Gateway (IT Act Rule 9A)",
    descGu: "MeriPehchaan 2FA OTP + MPIN, કાયદેસર DPDP કન્સેન્ટ અને અસલ સરકારી URI સાથે ૧-ક્લિક દસ્તાવેજ ફેચ.",
  },
  {
    titleGu: "સત્તાવાર સરકારી યોજના ડેટાબેઝ અપડેટ",
    titleEn: "Official Government Schemes & Acts Update",
    descGu: "૨૬+ સરકારી યોજનાઓ, NFSA ૨૦૧૩ અને GRTSA ૨૦૧૩ કાયદાઓ સાથે સત્તાવાર માહિતી સંકલિત.",
  },
  {
    titleGu: "અલ્ટ્રા-સ્પીડ AI & વોઇસ સહાયક",
    titleEn: "Ultra-Fast Gemini AI & Gujarati Voice Engine",
    descGu: "શુદ્ધ ગુજરાતી ઉચ્ચારણ સાથે લાઇવ વોઇસ આસિસ્ટન્ટ અને ઇન્સ્ટન્ટ રિસ્પોન્સ સિસ્ટમ.",
  },
  {
    titleGu: "2FA આધાર OTP & ડિજિટલ વોલ્ટ",
    titleEn: "2FA Aadhaar OTP & DigiLocker Vault Sync",
    descGu: "નાગરિક દસ્તાવેજોની ચકાસણી અને ૧૦૦% સરકારી માન્યતા પ્રાપ્ત ડિજિટલ રસીદ.",
  },
  {
    titleGu: "Play Store Super-App UI & ડાયનેમિક પ્રોફાઇલ",
    titleEn: "Play Store Super-App UI & Dynamic Citizen Greeting",
    descGu: "લૉગિન થયેલ નાગરિકના નામ સાથે ડાયનેમિક ગ્રીટિંગ કાર્ડ, Material 3 બોટમ નેવિગેશન અને ટચ વાઇબ્રેશન.",
  },
];
