export const APP_VERSION = "v2.9.9";
export const APP_BUILD_NAME = "National DPI Release v2.9.9 - Seamless Android Razorpay & Play Store In-App Updates";
export const APP_RELEASE_DATE = "૨૭ ઓક્ટોબર ૨૦૨૬";
export const APP_RELEASE_DATE_EN = "27 October 2026";
export const APP_GOV_DEPT = "ગુજરાત સરકાર - વિજ્ઞાન અને પ્રૌદ્યોગિકી વિભાગ (DST) & e-Governance";

export interface TeamMember {
  sr: number;
  name: string;
  nameGu: string;
  designation: "LEADER" | "MEMBER";
  role: string;
  roleGu: string;
  email: string;
  mobile: string;
  institute: string;
  semester: string;
  branch: string;
}

export const SFIC_TEAM_INFO = {
  challenge: "Seva First Innovation Challenge (SFIC 2026-27)",
  organizer: "SSIP Cell, Gujarat Knowledge Society & Education Dept., Govt. of Gujarat",
  teamCode: "TM000826",
  track: "COLLEGE TRACK",
  problemId: "PS0001",
  problemStatement: "NagrikSeva AI: Multimodal AI-Powered Digital Public Infrastructure for Zero-Queue Vernacular Citizen Welfare Delivery and Predictive Statutory SLA Governance under GRTPSA 2013",
  institution: "Atmiya University, Rajkot",
  facultyMentor: {
    name: "Prof. Bhojani Aarati",
    nameGu: "પ્રો. ભોજાણી આરતી",
    email: "aarti.kaneriya@atmiyauni.ac.in",
    mobile: "+91 9558880958",
    designation: "Faculty Mentor / Guide",
    department: "Department of Computer Science / MCA",
    institute: "Atmiya University, Rajkot",
  },
};

export const SFIC_INNOVATOR_ROSTER: TeamMember[] = [
  {
    sr: 1,
    name: "Hari Patel",
    nameGu: "હરિ પટેલ",
    designation: "LEADER",
    role: "Chief System Architect & DPI Lead",
    roleGu: "મુખ્ય સિસ્ટમ આર્કિટેક્ટ & DPI લીડ",
    email: "haripatel267998@gmail.com",
    mobile: "9974442291",
    institute: "Atmiya university",
    semester: "sem-1/computer science",
    branch: "computer science/MCA",
  },
  {
    sr: 2,
    name: "Jeet Jajal",
    nameGu: "જીત જાજલ",
    designation: "MEMBER",
    role: "Full-Stack Engineer & Cyber Treasury Gateway",
    roleGu: "ફુલ-સ્ટેક એન્જિનિયર & સાયબર ટ્રેઝરી ગેટવે",
    email: "jajaljeet2005@gmail.com",
    mobile: "7777921239",
    institute: "Atmiya university",
    semester: "sem-1/computer science",
    branch: "computer science/MCA",
  },
  {
    sr: 3,
    name: "Trusha Somaiya",
    nameGu: "તૃષા સોમૈયા",
    designation: "MEMBER",
    role: "Vernacular Gujarati Specialist & UI/UX Accessibility",
    roleGu: "ગુજરાતી ભાષાકીય સ્પેશિયાલિસ્ટ & UI/UX એક્સેસિબિલિટી",
    email: "trushasomaiya@gmail.com",
    mobile: "8849708068",
    institute: "Atmiya university",
    semester: "sem-1/computer science",
    branch: "computer science/MCA",
  },
  {
    sr: 4,
    name: "Dimple Parmar",
    nameGu: "ડિમ્પલ પરમાર",
    designation: "MEMBER",
    role: "Frontend Form Usability & DigiLocker Vault Lead",
    roleGu: "ફ્રન્ટએન્ડ ફોર્મ યુઝેબિલિટી & ડીજીલોકર વોલ્ટ લીડ",
    email: "dimpleparmar1036@gmail.com",
    mobile: "9081735335",
    institute: "Atmiya university",
    semester: "sem-1/computer science",
    branch: "computer science/MCA",
  },
  {
    sr: 5,
    name: "Kruti Rabadiya",
    nameGu: "કૃતિ રાબડિયા",
    designation: "MEMBER",
    role: "QA Lead & GRTPSA 2013 Statutory SLA Verification",
    roleGu: "QA લીડ & GRTPSA ૨૦૧૩ કાનૂની SLA ખરાઈ",
    email: "krutirabadiya79@gmail.com",
    mobile: "9081230105",
    institute: "Atmiya university",
    semester: "sem-1/computer science",
    branch: "computer science/MCA",
  },
  {
    sr: 6,
    name: "Chauhan Ayushi",
    nameGu: "ચૌહાણ આયુષી",
    designation: "MEMBER",
    role: "AI Integration & Jan-Samvad Voice Hotline Specialist",
    roleGu: "AI ઇન્ટિગ્રેશન & જન-સંવાદ વૉઇસ હોટલાઇન સ્પેશિયાલિસ્ટ",
    email: "chauhanayushi0502@gmail.com",
    mobile: "9979421983",
    institute: "Atmiya university",
    semester: "sem-1/computer science",
    branch: "computer science/MCA",
  },
];

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
    titleGu: "એન્ડ્રોઇડ Razorpay પેમેન્ટ સુધારો & Play Store ઓટો-અપડેટ નોટિફિકેશન (v2.9.9)",
    titleEn: "Android Native Razorpay Resilient Payment & Play Store Auto-Update System",
    descGu: "Android WebView માં સત્તાવાર સાયબર ટ્રેઝરી Razorpay (UPI, GPay, PhonePe, Paytm, RuPay) પેમેન્ટ માટે અદ્યતન ફુલ-સ્ક્રીન ડાયલોગ અને એપ-રીઝ્યુમ બેકગ્રાઉન્ડ સિંક. સાથે સાથે Google Play Store જેવી ઇન-એપ ઓટો-અપડેટ નોટિફિકેશન સિસ્ટમ.",
  },
  {
    titleGu: "ઇન્ટરેક્ટિવ ગુજરાતી જન-સંવાદ વૉઇસ હેલ્પલાઇન (/hotline) (v2.9.8)",
    titleEn: "Interactive Gujarati Voice Hotline & Rural Civic Voice Gateway",
    descGu: "ગ્રામીણ અને વડીલ નાગરિકો માટે ૧-ટેપ લાઈવ માઈક્રોફોન ટુ-વે વૉઇસ સંવાદ. નાગરિક ગુજરાતીમાં બોલીને પ્રશ્ન પૂછે છે અને AI શુદ્ધ ગુજરાતી ઑડિયોમાં યોજના, સહાય અને દસ્તાવેજો બોલીને સમજાવે છે.",
  },
  {
    titleGu: "નાગરિક કલ્યાણ અધિકાર પાસબુક & સામાજિક સુરક્ષા લેજર (/passbook) (v2.9.7)",
    titleEn: "Citizen Welfare Entitlement Passbook & Proactive Renewal Ledger",
    descGu: "સરકાર તરફથી કુટુંબને મળેલા આજીવન નાણાકીય લાભો (DBT, આયુષ્માન કવર, સોલાર સહાય, NFSA) નું એકીકૃત ગોલ્ડન પાસબુક લેજર, આગામી કાનૂની KYC રીન્યુઅલ એલર્ટ અને છાપવા યોગ્ય A4 સ્ટેટમેન્ટ.",
  },
  {
    titleGu: "સત્તાવાર વોટ્સએપ નાગરિક સૂચના & ગુજરાત સંવાદ ગેટવે (v2.9.5)",
    titleEn: "Official Citizen WhatsApp Notification & Gujarat Samvaad Share Gateway",
    descGu: "અરજી જમા થતાં જ નાગરિકને લાઈવ ટ્રેકિંગ અને ડિજિટલ નોટરી ખરાઈ લિંક સાથેનો સત્તાવાર ગુજરાતી વોટ્સએપ મેસેજ ૧-ક્લિકમાં શેર અને મોકલવાની સુવિધા. સરકારી પહોંચ પરથી પણ સીધો વોટ્સએપ પર મેળવી શકાય છે.",
  },
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
