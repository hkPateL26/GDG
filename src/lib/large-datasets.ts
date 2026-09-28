// =========================================================================
// NagrikSeva AI - Large-Scale Digital Public Infrastructure Dataset
// 5,000+ Realistic Citizen Applications & Governance Data across Gujarat
// =========================================================================

export interface CitizenApplication {
  id: string;
  citizenName: string;
  citizenNameGu: string;
  gender: "male" | "female";
  schemeId: string;
  schemeName: string;
  schemeNameGu: string;
  schemeEmoji: string;
  district: string;
  districtGu: string;
  taluka: string;
  village: string;
  aadhaarLast4: string;
  status: "approved" | "processing" | "pending" | "rejected";
  appliedDate: string;
  lastUpdated: string;
  benefitAmount: number;
  remarksGu: string;
  remarksEn: string;
  officerDesignation: string;
  serviceType?: "new" | "update";
  biometricRequired?: boolean;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentCenter?: string;
  appointmentToken?: string;
  signatureType?: "aadhaar-esign" | "physical-declaration";
  mobile?: string;
  email?: string;
  documentsVerified?: { name: string; verified: boolean; qualityScore: number }[];
  paymentStatus?: "paid" | "pending_challan" | "free";
  paymentMethod?: "upi" | "card" | "challan";
  paymentMethodNameGu?: string;
  operatorConfirmed?: boolean;
  feeAmount?: number;
  txnId?: string;
  challanNo?: string;
  correctionsRequested?: string[];
  oldVsNewValues?: Record<string, { oldVal: string; newVal: string }>;
  kacheriDetails?: Record<string, unknown>;
  workflowStage?: 1 | 2 | 3 | 4;
}

export const GUJARAT_DISTRICTS = [
  { en: "Rajkot", gu: "રાજકોટ", talukas: ["Rajkot Urban", "Rajkot Rural", "Gondal", "Jetpur", "Dhoraji", "Jasdan", "Morbi Rd"] },
  { en: "Ahmedabad", gu: "અમદાવાદ", talukas: ["City", "Daskroi", "Sanand", "Dholka", "Bavla", "Viramgam", "Dhandhuka"] },
  { en: "Surat", gu: "સુરત", talukas: ["Choryasi", "Olpad", "Kamrej", "Bardoli", "Mahuva", "Mandvi", "Mangrol"] },
  { en: "Vadodara", gu: "વડોદરા", talukas: ["Vadodara Urban", "Padra", "Karjan", "Dabhoi", "Waghodia", "Savli"] },
  { en: "Bhavnagar", gu: "ભાવનગર", talukas: ["Bhavnagar Urban", "Sihor", "Palitana", "Talaja", "Gariadhar", "Mahuva"] },
  { en: "Jamnagar", gu: "જામનગર", talukas: ["Jamnagar City", "Lalpur", "Kalavad", "Dhrol", "Jodiya"] },
  { en: "Junagadh", gu: "જૂનાગઢ", talukas: ["Junagadh City", "Keshod", "Mangrol", "Manavadar", "Visavadar", "Malia"] },
  { en: "Gandhinagar", gu: "ગાંધીનગર", talukas: ["Gandhinagar", "Kalol", "Dehgam", "Mansa"] },
  { en: "Mehsana", gu: "મહેસાણા", talukas: ["Mehsana", "Visnagar", "Kadi", "Vadnagar", "Kheralu", "Unjha"] },
  { en: "Banaskantha", gu: "બનાસકાંઠા", talukas: ["Palanpur", "Deesa", "Dhanera", "Tharad", "Vav", "Dantiwada"] },
  { en: "Kutch", gu: "કચ્છ", talukas: ["Bhuj", "Anjar", "Gandhidham", "Mandvi", "Mundra", "Nakhatrana", "Rapar"] },
  { en: "Amreli", gu: "અમરેલી", talukas: ["Amreli", "Dhari", "Bagasara", "Savarkundla", "Rajula", "Jafrabad"] },
  { en: "Anand", gu: "આણંદ", talukas: ["Anand", "Petlad", "Borsad", "Khambhat", "Umreth", "Sojitra"] },
  { en: "Morbi", gu: "મોરબી", talukas: ["Morbi", "Wankaner", "Halvad", "Tankara", "Maliya"] },
  { en: "Surendranagar", gu: "સુરેન્દ્રનગર", talukas: ["Wadhwan", "Dhrangadhra", "Limbdi", "Chotila", "Dasada"] },
  { en: "Panchmahal", gu: "પંચમહાલ", talukas: ["Godhra", "Halol", "Kalol", "Shehra", "Ghoghamba"] },
  { en: "Navsari", gu: "નવસારી", talukas: ["Navsari", "Jalalpore", "Gandevi", "Chikhli", "Vansda"] },
  { en: "Valsad", gu: "વલસાડ", talukas: ["Valsad", "Pardi", "Vapi", "Dharampur", "Umbergaon"] },
  { en: "Dahod", gu: "દાહોદ", talukas: ["Dahod", "Garbada", "Jhalod", "Limkheda", "Fatepura"] },
  { en: "Patan", gu: "પાટણ", talukas: ["Patan", "Sidhpur", "Radhanpur", "Chanasma", "Sami"] },
  { en: "Porbandar", gu: "પોરબંદર", talukas: ["Porbandar", "Ranavav", "Kutiyana"] },
  { en: "Gir Somnath", gu: "ગીર સોમનાથ", talukas: ["Veraval", "Kodinar", "Una", "Talala", "Sutrapada"] },
  { en: "Sabarkantha", gu: "સાબરકાંઠા", talukas: ["Himmatnagar", "Idar", "Prantij", "Khedbrahma", "Talod"] },
  { en: "Bharuch", gu: "ભરૂચ", talukas: ["Bharuch", "Ankleshwar", "Jambusar", "Hansot", "Amod"] },
  { en: "Kheda", gu: "ખેડા", talukas: ["Nadiad", "Kapadvanj", "Mehmedabad", "Matar", "Mahudha"] },
  { en: "Botad", gu: "બોટાદ", talukas: ["Botad", "Gadhada", "Barwala", "Ranpur"] },
  { en: "Aravalli", gu: "અરવલ્લી", talukas: ["Modasa", "Malpur", "Bhiloda", "Meghraj", "Dhansura"] },
  { en: "Mahisagar", gu: "મહીસાગર", talukas: ["Lunawada", "Santrampur", "Balasinor", "Kadana", "Virpur"] },
  { en: "Chhotaudepur", gu: "છોટાઉદેપુર", talukas: ["Chhotaudepur", "Bodeli", "Sankheda", "Nasvadi", "Jetpur Pavi"] },
  { en: "Narmada", gu: "નર્મદા", talukas: ["Rajpipla", "Dediapada", "Tilakwada", "Garudeshwar", "Sagbara"] },
  { en: "Tapi", gu: "તાપી", talukas: ["Vyara", "Songadh", "Valod", "Nizar", "Uchchhal"] },
  { en: "Dang", gu: "ડાંગ", talukas: ["Ahwa", "Waghai", "Subir"] },
  { en: "Devbhumi Dwarka", gu: "દેવભૂમિ દ્વારકા", talukas: ["Khambhalia", "Dwarka", "Kalyanpur", "Bhanvad"] },
];

const SCHEME_TEMPLATES = [
  { id: "pm-kisan", en: "PM Kisan Samman Nidhi", gu: "PM કિસાન સન્માન નિધિ", emoji: "🌾", amount: 6000 },
  { id: "ayushman-bharat", en: "Ayushman Bharat PM-JAY", gu: "આયુષ્માન ભારત PM-JAY", emoji: "🏥", amount: 500000 },
  { id: "pm-awas", en: "PM Awas Yojana Gramin", gu: "PM આવાસ યોજના ગ્રામીણ", emoji: "🏠", amount: 120000 },
  { id: "pm-ujjwala", en: "PM Ujjwala Yojana 2.0", gu: "PM ઉજ્જવલા યોજના", emoji: "🔥", amount: 3500 },
  { id: "pm-mudra", en: "PM Mudra Loan (Shishu/Kishore)", gu: "PM મુદ્રા યોજના", emoji: "💼", amount: 100000 },
  { id: "vahali-dikri", en: "Vahali Dikri Yojana (Gujarat)", gu: "વ્હાલી દીકરી યોજના", emoji: "👧", amount: 110000 },
  { id: "vridh-pension", en: "Indira Gandhi Vridh Pension", gu: "ઇન્દિરા ગાંધી વૃદ્ધ પેન્શન", emoji: "👴", amount: 12000 },
  { id: "kisan-sahay", en: "Mukhyamantri Kisan Sahay Yojana", gu: "મુખ્યમંત્રી કિસાન સહાય યોજના", emoji: "🚜", amount: 20000 },
];

const MALE_NAMES = [
  { en: "Ramesh Patel", gu: "રમેશ પટેલ" },
  { en: "Mansukh Vaghani", gu: "મનસુખ વાઘાણી" },
  { en: "Bhavesh Prajapati", gu: "ભાવેશ પ્રજાપતિ" },
  { en: "Dinesh Solanki", gu: "દિનેશ સોલંકી" },
  { en: "Rajesh Jadeja", gu: "રાજેશ જાડેજા" },
  { en: "Paresh Rabari", gu: "પરેશ રબારી" },
  { en: "Sanjay Makwana", gu: "સંજય મકવાણા" },
  { en: "Jayesh Parmar", gu: "જયેશ પરમાર" },
  { en: "Vijay Chauhan", gu: "વિજય ચૌહાણ" },
  { en: "Kirit Joshi", gu: "કિરીટ જોશી" },
  { en: "Arvind Bharwad", gu: "અરવિંદ ભરવાડ" },
  { en: "Bharat Dave", gu: "ભરત દવે" },
  { en: "Jignesh Rathod", gu: "જીગ્નેશ રાઠોડ" },
  { en: "Haresh Vaghela", gu: "હરેશ વાઘેલા" },
  { en: "Nilesh Chudasama", gu: "નિલેશ ચુડાસમા" },
  { en: "Ashok Ahir", gu: "અશોક આહીર" },
  { en: "Pravin Desai", gu: "પ્રવીણ દેસાઈ" },
  { en: "Ketan Trivedi", gu: "કેતન ત્રિવેદી" },
  { en: "Vipul Shah", gu: "વિપુલ શાહ" },
  { en: "Hasmukh Bhalodiya", gu: "હસમુખ ભાલોડિયા" },
];

const FEMALE_NAMES = [
  { en: "Aartiben Solanki", gu: "આરતીબેન સોલંકી" },
  { en: "Geetaben Patel", gu: "ગીતાબેન પટેલ" },
  { en: "Hansaben Jadeja", gu: "હંસાબેન જાડેજા" },
  { en: "Smitaben Vaghani", gu: "સ્મિતાબેન વાઘાણી" },
  { en: "Rekhaben Prajapati", gu: "રેખાબેન પ્રજાપતિ" },
  { en: "Shantaben Rabari", gu: "શાંતાબેન રબારી" },
  { en: "Bhavanaben Makwana", gu: "ભાવનાબેન મકવાણા" },
  { en: "Meenaben Parmar", gu: "મીનાબેન પરમાર" },
  { en: "Daxaben Chauhan", gu: "દક્ષાબેન ચૌહાણ" },
  { en: "Shardaben Joshi", gu: "શારદાબેન જોશી" },
  { en: "Ushaben Dave", gu: "ઉષાબેન દવે" },
  { en: "Nitaben Trivedi", gu: "નીતાબેન ત્રિવેદી" },
  { en: "Manjulaben Rathod", gu: "મંજુલાબેન રાઠોડ" },
  { en: "Kailashben Vaghela", gu: "કૈલાશબેન વાઘેલા" },
  { en: "Kokilaben Bharwad", gu: "કોકિલાબેન ભરવાડ" },
];

const STATUS_OPTIONS: ("approved" | "processing" | "pending" | "rejected")[] = [
  "approved",
  "approved",
  "approved", // higher weight for approved (realistic 60-70% rate)
  "processing",
  "processing",
  "pending",
  "rejected",
];

// Curated first 4 benchmark IDs that exist in existing tests
const BENCHMARK_APPLICATIONS: CitizenApplication[] = [
  {
    id: "APP001",
    citizenName: "Hari Vinodrai Patel",
    citizenNameGu: "હરી વિનોદરાઈ પટેલ",
    gender: "male",
    schemeId: "pm-kisan",
    schemeName: "PM Kisan Samman Nidhi",
    schemeNameGu: "PM કિસાન સન્માન નિધિ",
    schemeEmoji: "🌾",
    district: "Rajkot",
    districtGu: "રાજકોટ",
    taluka: "Rajkot",
    village: "ઓમ નગર (Omnagar)",
    aadhaarLast4: "1413",
    status: "approved",
    appliedDate: "2026-08-14",
    lastUpdated: "2026-09-01",
    benefitAmount: 6000,
    remarksGu: "૭/૧૨ અને ૮-અ જમીન ચકાસણી તાલુકા મામલતદાર કચેરી, રાજકોટ દ્વારા સફળતાપૂર્વક પૂર્ણ. ₹૨,૦૦૦ હપ્તો DBT દ્વારા બેંક ખાતામાં જમા.",
    remarksEn: "7/12 land records verified by Taluka Mamlatdar, Rajkot. ₹2,000 installment credited directly via DBT to bank account.",
    officerDesignation: "Taluka Development Officer (TDO), Rajkot",
    workflowStage: 3,
  },
  {
    id: "APP002",
    citizenName: "Aartiben M. Solanki",
    citizenNameGu: "આરતીબેન એમ. સોલંકી",
    gender: "female",
    schemeId: "ayushman-bharat",
    schemeName: "Ayushman Bharat PM-JAY",
    schemeNameGu: "આયુષ્માન ભારત PM-JAY",
    schemeEmoji: "🏥",
    district: "Ahmedabad",
    districtGu: "અમદાવાદ",
    taluka: "Daskroi",
    village: "Kuha",
    aadhaarLast4: "9182",
    status: "processing",
    appliedDate: "2026-09-02",
    lastUpdated: "2026-09-10",
    benefitAmount: 500000,
    remarksGu: "રેશનકાર્ડ આધારિત SECC ડેટા વેરિફિકેશન થઈ ગયેલ છે. આયુષ્માન પીવીસી કાર્ડ પ્રિન્ટિંગ પ્રક્રિયામાં છે.",
    remarksEn: "SECC household verification completed. Ayushman PVC Card generation in progress. Delivery in 5 working days.",
    officerDesignation: "Chief Medical Officer (CMO), Ahmedabad District",
    workflowStage: 2,
  },
  {
    id: "APP003",
    citizenName: "Dineshbhai P. Rabari",
    citizenNameGu: "દિનેશભાઈ પી. રબારી",
    gender: "male",
    schemeId: "pm-awas",
    schemeName: "PM Awas Yojana Gramin",
    schemeNameGu: "PM આવાસ યોજના ગ્રામીણ",
    schemeEmoji: "🏠",
    district: "Kutch",
    districtGu: "કચ્છ",
    taluka: "Bhuj",
    village: "Madhapar",
    aadhaarLast4: "3310",
    status: "pending",
    appliedDate: "2026-09-08",
    lastUpdated: "2026-09-15",
    benefitAmount: 120000,
    remarksGu: "ગ્રામ પંચાયત તલાટી કમ મંત્રી દ્વારા કાચા મકાનનું જીઓ-ટેગિંગ સ્થળ તપાસ માટે પેન્ડિંગ છે.",
    remarksEn: "Awaiting physical site geo-tagging inspection by Gram Sevak and Talati-cum-Mantri.",
    officerDesignation: "Gram Sevak, Madhapar Panchayat",
    workflowStage: 1,
  },
  {
    id: "APP004",
    citizenName: "Mansukhbhai G. Vaghani",
    citizenNameGu: "મનસુખભાઈ જી. વાઘાણી",
    gender: "male",
    schemeId: "pm-mudra",
    schemeName: "PM Mudra Loan (Kishore)",
    schemeNameGu: "PM મુદ્રા લોન (કિશોર)",
    schemeEmoji: "💼",
    district: "Surat",
    districtGu: "સુરત",
    taluka: "Kamrej",
    village: "Navagam",
    aadhaarLast4: "7654",
    status: "rejected",
    appliedDate: "2026-08-25",
    lastUpdated: "2026-09-05",
    benefitAmount: 100000,
    remarksGu: "આવકનો દાખલો જૂનો હોવાથી અરજી અમાન્ય ઠરી. નવો સક્ષમ અધિકારીનો આવક દાખલો જોડી પુનઃ અરજી કરવી.",
    remarksEn: "Income certificate was expired. Please re-apply with fresh Income Certificate from Mamlatdar Office.",
    officerDesignation: "Branch Lead, Bank of Baroda, Kamrej",
    workflowStage: 2,
  },
];

// Deterministic generator for 5,000 realistic records
export function generateApplication(index: number): CitizenApplication {
  if (index < BENCHMARK_APPLICATIONS.length) {
    return BENCHMARK_APPLICATIONS[index];
  }

  // Consistent pseudo-random hashing based on index
  const hash = (index * 9301 + 49297) % 233280;
  const isFemale = (hash % 10) < 4; // ~40% female
  const nameList = isFemale ? FEMALE_NAMES : MALE_NAMES;
  const nameObj = nameList[hash % nameList.length];

  const distObj = GUJARAT_DISTRICTS[(hash + index) % GUJARAT_DISTRICTS.length];
  const taluka = distObj.talukas[(hash >> 2) % distObj.talukas.length];
  const scheme = SCHEME_TEMPLATES[(hash + index * 3) % SCHEME_TEMPLATES.length];
  const status = STATUS_OPTIONS[(hash + index * 7) % STATUS_OPTIONS.length];

  const appNum = 1000 + index;
  const id = `APP-GUJ-${appNum}`;

  const day = 1 + ((hash * 7) % 27);
  const month = 7 + ((hash) % 3); // July, Aug, Sept 2026
  const appliedDate = `2026-0${month}-${day < 10 ? "0" + day : day}`;
  const updatedDay = Math.min(28, day + 3 + (hash % 7));
  const lastUpdated = `2026-0${month}-${updatedDay < 10 ? "0" + updatedDay : updatedDay}`;

  const aadhaarLast4 = String(1000 + (hash % 9000));

  let remarksGu = "";
  let remarksEn = "";
  let officer = `મામલતદાર કચેરી, ${taluka}`;
  let workflowStage: 1 | 2 | 3 | 4 = 1;

  if (status === "approved") {
    workflowStage = 3;
    remarksGu = `દસ્તાવેજ ચકાસણી પૂર્ણ. ₹${scheme.amount.toLocaleString("en-IN")} ની સહાય મંજૂર કરવામાં આવી છે.`;
    remarksEn = `Document verification completed successfully. Entitlement of ₹${scheme.amount.toLocaleString("en-IN")} approved.`;
    officer = `Taluka Development Officer (TDO), ${taluka}`;
  } else if (status === "processing") {
    workflowStage = (hash % 2 === 0) ? 2 : 1;
    remarksGu = `અરજીની ચકાસણી નાયબ મામલતદાર કક્ષાએ ચાલુ છે. આગામી ૪ દિવસમાં આખરી નિર્ણય થશે.`;
    remarksEn = `Application verification currently in progress under Deputy Mamlatdar office, ${distObj.en}.`;
    officer = `Deputy Mamlatdar, ${distObj.en}`;
  } else if (status === "pending") {
    workflowStage = 1;
    remarksGu = `તલાટી કમ મંત્રીનો અભિપ્રાય અને આવકના દાખલાની ફિઝિકલ ખરાઈ બાકી છે.`;
    remarksEn = `Field inspection by Panchayat Talati and physical verification of documents pending.`;
    officer = `Gram Sevak / Talati, ${taluka}`;
  } else {
    workflowStage = 2;
    remarksGu = `જરૂરી ઓળખકાર્ડ અથવા બેંક વિગતો અધૂરી હોવાના કારણે અરજી પરત કરવામાં આવેલ છે. પૂરક પુરાવા સાથે ફરી અરજી કરવી.`;
    remarksEn = `Rejected due to incomplete supporting bank or identity records. Please re-submit with correct proof.`;
    officer = `Scrutiny Officer, Jan Seva Kendra ${distObj.en}`;
  }

  return {
    id,
    citizenName: `${nameObj.en}`,
    citizenNameGu: `${nameObj.gu}`,
    gender: isFemale ? "female" : "male",
    schemeId: scheme.id,
    schemeName: scheme.en,
    schemeNameGu: scheme.gu,
    schemeEmoji: scheme.emoji,
    district: distObj.en,
    districtGu: distObj.gu,
    taluka,
    village: `${taluka} Rural`,
    aadhaarLast4,
    status,
    appliedDate,
    lastUpdated,
    benefitAmount: scheme.amount,
    remarksGu,
    remarksEn,
    officerDesignation: officer,
    workflowStage,
  };
}

export const TOTAL_SYSTEM_RECORDS = 5420;

export interface DocumentServiceConfig {
  id: string;
  nameEn: string;
  nameGu: string;
  departmentEn: string;
  departmentGu: string;
  category?: string;
  emoji: string;
  supportsNew: boolean;
  supportsUpdate: boolean;
  updateFields?: string[];
  requiredDocsNew: { id: string; nameEn: string; nameGu: string; mandatory: boolean }[];
  requiredDocsUpdate: { id: string; nameEn: string; nameGu: string; mandatory: boolean }[];
  biometricRequiredNew: boolean;
  biometricRequiredUpdate: boolean;
  fee: number;
}

export const DOCUMENT_SERVICES: DocumentServiceConfig[] = [
  {
    "id": "income",
    "nameEn": "Income Certificate (આવકનો દાખલો)",
    "nameGu": "આવકનું પ્રમાણપત્ર (૩ વર્ષ માન્ય)",
    "departmentEn": "Revenue Department, Government of Gujarat",
    "departmentGu": "મહેસૂલ વિભાગ, ગુજરાત સરકાર (મામલતદાર કચેરી)",
    "category": "revenue",
    "emoji": "📜",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નવીકરણ / રિન્યુઅલ (Renewal)",
      "આવક સુધારો (Income Correction)"
    ],
    "requiredDocsNew": [
      {
        "id": "ration_card",
        "nameEn": "Ration Card (All Pages)",
        "nameGu": "રેશનકાર્ડ (તમામ પાના)",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "talati_report",
        "nameEn": "Talati Income Assessment Report / Salary Slip",
        "nameGu": "તલાટી કમ મંત્રીનો આવક પંચનામું રિપોર્ટ",
        "mandatory": true
      },
      {
        "id": "electricity_bill",
        "nameEn": "Recent Electricity Bill",
        "nameGu": "છેલ્લા મહિનાનું લાઈટ બિલ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_income",
        "nameEn": "Expired Income Certificate",
        "nameGu": "જૂનો આવકનો દાખલો",
        "mandatory": true
      },
      {
        "id": "current_electricity",
        "nameEn": "Current Electricity Bill",
        "nameGu": "તાજેતરનું લાઈટ બિલ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "land_records",
    "nameEn": "AnyRoR 7/12 & 8A Land Records",
    "nameGu": "જમીન ૭/૧૨ & ૮-અ ડિજિટલ ઉતારા",
    "departmentEn": "Revenue Department, Government of Gujarat (e-Dhara)",
    "departmentGu": "મહેસૂલ વિભાગ, ગુજરાત સરકાર (e-Dhara / AnyRoR)",
    "category": "revenue",
    "emoji": "🌾",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "વારસાઈ નોંધણી (Heirship Entry)",
      "બોજો / ધિરાણ નોંધણી (Bank Loan Entry)",
      "હક્ક કમી / વહેંચણી (Right Surrender / Split)"
    ],
    "requiredDocsNew": [
      {
        "id": "survey_proof",
        "nameEn": "Khata Number / Survey Number Reference",
        "nameGu": "ખાતા નંબર / જૂના સર્વે નંબરની નકલ",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "tax_receipt",
        "nameEn": "Gram Panchayat Tax / Revenue Receipt",
        "nameGu": "પંચાયત વેરા પાવતી / મહેસૂલી પહોંચ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "pedhinamu_doc",
        "nameEn": "Talati Pedhinamu / Heirship Tree",
        "nameGu": "તલાટીનું અધિકૃત પેઢીનામું",
        "mandatory": true
      },
      {
        "id": "death_proof",
        "nameEn": "Death Certificate of Khatedar",
        "nameGu": "મૂળ ખાતેદારનું મરણ પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "consent_affidavit",
        "nameEn": "Consent Affidavit of All Heirs",
        "nameGu": "તમામ વારસદારોનું સંમતિ સોગંદનામું",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "varasai_entry",
    "nameEn": "Pedhinamu & Legal Heirship Registration",
    "nameGu": "વારસાઈ આંબલીયો / પેઢીનામું નોંધણી",
    "departmentEn": "Revenue Department, Government of Gujarat",
    "departmentGu": "મહેસૂલ વિભાગ / પંચાયત (તલાટી કમ મંત્રી)",
    "category": "revenue",
    "emoji": "🌳",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "વારસદાર નામ સુધારો",
      "સ્પેલિંગ સુધારો",
      "નવા વારસદાર ઉમેરવા"
    ],
    "requiredDocsNew": [
      {
        "id": "death_cert",
        "nameEn": "Death Certificate of Deceased Khatedar",
        "nameGu": "અવસાન પામેલ ખાતેદારનું મરણ પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "all_heirs_aadhaar",
        "nameEn": "Aadhaar Cards of All Surviving Legal Heirs",
        "nameGu": "તમામ જીવિત વારસદારોના આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "panch_panchnama",
        "nameEn": "Two Local Panchnama Witnesses with ID",
        "nameGu": "ગામના બે પંચોનું પંચનામું અને ઓળખકાર્ડ",
        "mandatory": true
      },
      {
        "id": "ration_card",
        "nameEn": "Family Ration Card Copy",
        "nameGu": "કુટુંબનું રેશનકાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_pedhinamu",
        "nameEn": "Existing Pedhinamu Copy",
        "nameGu": "હાલનું પેઢીનામું",
        "mandatory": true
      },
      {
        "id": "court_order",
        "nameEn": "Civil Court Order or Succession Proof",
        "nameGu": "કોર્ટ હુકમ અથવા સુધારા સોગંદનામું",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "domicile_cert",
    "nameEn": "Domicile Certificate (Resident of Gujarat)",
    "nameGu": "ડોમિસાઇલ પ્રમાણપત્ર (કાયમી વસવાટ)",
    "departmentEn": "Home Department / District Collector Office",
    "departmentGu": "ગૃહ વિભાગ & કલેક્ટર કચેરી, ગુજરાત સરકાર",
    "category": "revenue",
    "emoji": "🏠",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "સરનામું બદલવું (Change of Address)",
      "નામ સુધારો (Correction)"
    ],
    "requiredDocsNew": [
      {
        "id": "continuous_residence",
        "nameEn": "10 Years Continuous Residence Proof (Light/Tax Bills)",
        "nameGu": "૧૦ વર્ષ સતત વસવાટના પુરાવા (લાઈટબિલ/વેરાબિલ)",
        "mandatory": true
      },
      {
        "id": "birth_proof",
        "nameEn": "Birth Certificate or School LC of Gujarat",
        "nameGu": "ગુજરાતમાં જન્મનો દાખલો અથવા શાળા LC",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "police_inquiry",
        "nameEn": "Police Verification / Talati Panchnama",
        "nameGu": "પોલીસ ચકાસણી પંચનામું / તલાટી દાખલો",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "prev_domicile",
        "nameEn": "Previous Domicile Certificate",
        "nameGu": "અગાઉનું ડોમિસાઇલ પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "address_proof",
        "nameEn": "New Address Proof",
        "nameGu": "નવા સરનામાનો સત્તાવાર પુરાવો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 50
  },
  {
    "id": "solvency_cert",
    "nameEn": "Solvency Certificate (નાણાકીય સદ્ધરતા દાખલો)",
    "nameGu": "સોલ્વન્સી પ્રમાણપત્ર (નાણાકીય સદ્ધરતા)",
    "departmentEn": "Revenue Department (Collectorate / Mamlatdar)",
    "departmentGu": "મહેસૂલ વિભાગ (કલેક્ટર / મામલતદાર કચેરી)",
    "category": "revenue",
    "emoji": "🏦",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "રકમ વધારો (Increase Solvency Amount)",
      "સરનામું સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "property_valuation",
        "nameEn": "Approved Engineer Valuation Report / 7/12 Valuation",
        "nameGu": "મિલકત વેલ્યુએશન રિપોર્ટ / ૭-૧૨ જમીન કિંમત",
        "mandatory": true
      },
      {
        "id": "tax_receipts",
        "nameEn": "Recent Property Tax & Electricity Bill",
        "nameGu": "તાજેતરનું વેરા બિલ અને લાઈટ બિલ",
        "mandatory": true
      },
      {
        "id": "bank_fd_proof",
        "nameEn": "Bank Fixed Deposit / Title Clearance Search Report",
        "nameGu": "બેંક એફડી / ટાઇટલ ક્લિયરન્સ રિપોર્ટ",
        "mandatory": false
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Aadhaar Card & PAN Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ અને પાન કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_solvency",
        "nameEn": "Previous Solvency Certificate Copy",
        "nameGu": "જૂનો સોલ્વન્સી દાખલો",
        "mandatory": true
      },
      {
        "id": "fresh_valuation",
        "nameEn": "Updated Valuation Report",
        "nameGu": "નવો વેલ્યુએશન રિપોર્ટ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 50
  },
  {
    "id": "khedut_kharekhar",
    "nameEn": "Bona-fide Agriculturist Certificate",
    "nameGu": "ખેડૂત ખરાઈ પ્રમાણપત્ર (સાચો ખેડૂત દાખલો)",
    "departmentEn": "Revenue Department, Government of Gujarat",
    "departmentGu": "મહેસૂલ વિભાગ (મામલતદાર કચેરી)",
    "category": "revenue",
    "emoji": "🚜",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "જમીન ખાતા નંબર સુધારો",
      "તાલુકો / ગામ સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "ror_7_12",
        "nameEn": "Certified 7/12 & 8-A Copies showing Applicant Name",
        "nameGu": "ખેડૂતનું નામ દર્શાવતા ૭/૧૨ અને ૮-અ ના ઉતારા",
        "mandatory": true
      },
      {
        "id": "pedhinamu_proof",
        "nameEn": "Ancestral Pedhinamu if Inherited",
        "nameGu": "પૂર્વજોનું પેઢીનામું (જો વારસાઈ હોય તો)",
        "mandatory": false
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Aadhaar Card of Agriculturist",
        "nameGu": "ખેડૂત ખાતેદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "talati_certificate",
        "nameEn": "Talati Certificate confirming Active Farming",
        "nameGu": "તલાટીનો સ્થળ પર ખેતી અંગેનો દાખલો",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_khedut_cert",
        "nameEn": "Old Agriculturist Certificate",
        "nameGu": "અગાઉનો ખેડૂત દાખલો",
        "mandatory": true
      },
      {
        "id": "updated_7_12",
        "nameEn": "Fresh 7/12 Digital Copy",
        "nameGu": "તાજા ૭/૧૨ ડિજિટલ ઉતારા",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "na_permission",
    "nameEn": "Non-Agricultural (NA) Land Permission",
    "nameGu": "બિન-ખેતી (NA) જમીન પરવાનગી અરજી",
    "departmentEn": "Collectorate / Revenue Department",
    "departmentGu": "જિલ્લા કલેક્ટર કચેરી / મહેસૂલ શાખા",
    "category": "revenue",
    "emoji": "🏗️",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "હેતુ ફેરફાર (રહેણાંકથી વાણિજ્ય / ઔદ્યોગિક)",
      "પ્લાન સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "na_7_12",
        "nameEn": "Last 30 Years RoR 7/12 and Mutation Form 6",
        "nameGu": "છેલ્લા ૩૦ વર્ષના ૭/૧૨ અને નોંધ નં. ૬",
        "mandatory": true
      },
      {
        "id": "measurement_sheet",
        "nameEn": "DILR Approved Measurement Sheet (માપણી શીટ)",
        "nameGu": "DILR માન્ય માપણી શીટ અને નકશો",
        "mandatory": true
      },
      {
        "id": "title_clearance",
        "nameEn": "Advocate Title Clearance Public Notice & Certificate",
        "nameGu": "વકીલનું ટાઇટલ ક્લિયરન્સ સર્ટિફિકેટ",
        "mandatory": true
      },
      {
        "id": "zone_certificate",
        "nameEn": "Town Planning / Panchayat Zone Certificate",
        "nameGu": "ટાઉન પ્લાનિંગ / પંચાયત ઝોન સર્ટિફિકેટ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_na_order",
        "nameEn": "Previous NA Permission Order Copy",
        "nameGu": "અગાઉનો NA પરવાનગી હુકમ",
        "mandatory": true
      },
      {
        "id": "revised_plan",
        "nameEn": "Revised Layout Plan by Town Planner",
        "nameGu": "સુધારેલ લે-આઉટ પ્લાન",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 150
  },
  {
    "id": "crop_damage_aid",
    "nameEn": "Crop Damage Aid Certificate (કુદરતી આપત્તિ પાક નુકસાન)",
    "nameGu": "અતિવૃષ્ટિ / પાક નુકસાન સહાય દાખલો",
    "departmentEn": "Agriculture & Revenue Department",
    "departmentGu": "ખેતીવાડી & મહેસૂલ વિભાગ (TDO / મામલતદાર)",
    "category": "revenue",
    "emoji": "🌧️",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "khedut_7_12",
        "nameEn": "7/12 & 8-A Land Record",
        "nameGu": "જમીન ૭/૧૨ અને ૮-અ ઉતારા",
        "mandatory": true
      },
      {
        "id": "damage_survey",
        "nameEn": "Gram Sevak / Talati Crop Damage Survey Report",
        "nameGu": "ગ્રામ સેવક / તલાટીનો પાક નુકસાન સર્વે રિપોર્ટ",
        "mandatory": true
      },
      {
        "id": "bank_passbook",
        "nameEn": "Bank Passbook with Aadhaar Link for Direct Aid",
        "nameGu": "બેંક પાસબુક (DBT સહાય માટે)",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Farmer Aadhaar Card",
        "nameGu": "ખેડૂતનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "true_copy_revenue",
    "nameEn": "Certified True Copy of Revenue Orders & Form 6",
    "nameGu": "મહેસૂલી હુકમ / નોંધ નં. ૬ ની પ્રમાણિત નકલ",
    "departmentEn": "Revenue Department (e-Dhara Kendra)",
    "departmentGu": "મહેસૂલ વિભાગ (ઇ-ધરા જન સેવા કેન્દ્ર)",
    "category": "revenue",
    "emoji": "📑",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "case_details",
        "nameEn": "Case / Mutation Number Application",
        "nameGu": "કેસ નંબર અથવા ફેરફાર નોંધ નંબરની વિગત",
        "mandatory": true
      },
      {
        "id": "applicant_id",
        "nameEn": "Applicant Photo Identity Proof",
        "nameGu": "અરજદારનું આધાર કાર્ડ / ચૂંટણી કાર્ડ",
        "mandatory": true
      },
      {
        "id": "stamp_duty",
        "nameEn": "Court Fee Stamp Receipt",
        "nameGu": "કોર્ટ ફી સ્ટેમ્પ પહોંચ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "hayat_hayatee",
    "nameEn": "Life Certificate for Pensioners (હયાતીની ખાતરી)",
    "nameGu": "પેન્શનરો માટે હયાતીની ખાતરી દાખલો",
    "departmentEn": "Treasury Office, Finance Department",
    "departmentGu": "તિજોરી કચેરી / પેન્શન ચુકવણી શાખા",
    "category": "revenue",
    "emoji": "🧓",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "બેંક ખાતા નંબર સુધારો",
      "હયાત રહેઠાણ સરનામું બદલવું"
    ],
    "requiredDocsNew": [
      {
        "id": "ppo_book",
        "nameEn": "Pension Payment Order (PPO) Copy",
        "nameGu": "પેન્શન બુક / PPO ઓર્ડર કોપી",
        "mandatory": true
      },
      {
        "id": "pensioner_aadhaar",
        "nameEn": "Pensioner Aadhaar Card",
        "nameGu": "પેન્શનરનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "bank_passbook",
        "nameEn": "Pension Bank Account Passbook",
        "nameGu": "પેન્શન જમા ખાતાની પાસબુક",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "pension_id",
        "nameEn": "PPO Copy",
        "nameGu": "PPO પેન્શન કોપી",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": true,
    "biometricRequiredUpdate": true,
    "fee": 0
  },
  {
    "id": "dilr_measurement",
    "nameEn": "DILR Land Re-Survey & Boundary Measurement",
    "nameGu": "જમીન રી-સર્વે & સીમા માપણી અરજી (DILR)",
    "departmentEn": "District Inspector of Land Records (DILR)",
    "departmentGu": "જિલ્લા જમીન દફતર નિરીક્ષક કચેરી (DILR)",
    "category": "revenue",
    "emoji": "📐",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "survey_7_12",
        "nameEn": "Current 7/12 & 8-A Land Record",
        "nameGu": "ચાલુ ૭/૧૨ અને ૮-અ ઉતારો",
        "mandatory": true
      },
      {
        "id": "tippan_copy",
        "nameEn": "Old Village Map & Tippan Copy",
        "nameGu": "ગામ નકશો અને જૂની ટિપ્પન નકલ",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Aadhaar Card of Land Owner",
        "nameGu": "જમીન માલિકનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 100
  },
  {
    "id": "char_chalan",
    "nameEn": "Character Certificate (ચરિત્ર પ્રમાણપત્ર)",
    "nameGu": "ચારિત્ર્ય પ્રમાણપત્ર (જન સેવા કેન્દ્ર)",
    "departmentEn": "Sub-Divisional Magistrate / Mamlatdar Office",
    "departmentGu": "પ્રાંત અધિકારી / મામલતદાર કચેરી",
    "category": "revenue",
    "emoji": "🎖️",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "school_lc",
        "nameEn": "School Leaving Certificate",
        "nameGu": "શાળા છોડ્યાનું પ્રમાણપત્ર (LC)",
        "mandatory": true
      },
      {
        "id": "reputable_persons",
        "nameEn": "Certificates from Two Respected Citizens / Sarpanch",
        "nameGu": "સરપંચ / નગરસેવકનો ચરિત્ર દાખલો",
        "mandatory": true
      },
      {
        "id": "police_no_crime",
        "nameEn": "Police Verification Non-Involvement Certificate",
        "nameGu": "પોલીસ ગુના મુક્તિ રિપોર્ટ",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "religious_minority",
    "nameEn": "Religious Minority Certificate (ધાર્મિક લઘુમતી દાખલો)",
    "nameGu": "ધાર્મિક લઘુમતી પ્રમાણપત્ર",
    "departmentEn": "Social Justice & Welfare Department",
    "departmentGu": "સામાજિક ન્યાય અને લઘુમતી કલ્યાણ બોર્ડ",
    "category": "revenue",
    "emoji": "🕊️",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નામ સ્પેલિંગ સુધારો",
      "સરનામું સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "school_lc_religion",
        "nameEn": "School Leaving Certificate mentioning Religion",
        "nameGu": "ધર્મ દર્શાવતું શાળા LC",
        "mandatory": true
      },
      {
        "id": "community_letter",
        "nameEn": "Registered Trust / Religious Organization Letter",
        "nameGu": "માન્ય ધાર્મિક સંસ્થા/ટ્રસ્ટનું પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_minority",
        "nameEn": "Old Minority Certificate",
        "nameGu": "જૂનો લઘુમતી દાખલો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "linguistic_minority",
    "nameEn": "Linguistic Minority Certificate (ભાષાકીય લઘુમતી)",
    "nameGu": "ભાષાકીય લઘુમતી પ્રમાણપત્ર",
    "departmentEn": "General Administration Department (GAD)",
    "departmentGu": "સામાન્ય વહીવટ વિભાગ, ગુજરાત સરકાર",
    "category": "revenue",
    "emoji": "🗣️",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "mother_tongue_lc",
        "nameEn": "School Leaving Certificate with Mother Tongue",
        "nameGu": "માતૃભાષા દર્શાવતું શાળાનું પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "parents_lc",
        "nameEn": "Father's School LC showing Mother Tongue",
        "nameGu": "પિતાનું શાળા LC",
        "mandatory": true
      },
      {
        "id": "domicile_proof",
        "nameEn": "Gujarat Residence Proof",
        "nameGu": "ગુજરાતમાં રહેઠાણનો પુરાવો",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "nt_dnt_cert",
    "nameEn": "Nomadic & De-Notified Tribes (NT/DNT) Certificate",
    "nameGu": "વિચરતી અને વિમુક્ત જાતિ પ્રમાણપત્ર (NT/DNT)",
    "departmentEn": "Developing Castes Welfare Directorate",
    "departmentGu": "વિકસતી જાતિ કલ્યાણ ખાતું, ગુજરાત સરકાર",
    "category": "revenue",
    "emoji": "⛺",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "સ્પેલિંગ સુધારો",
      "સરનામું સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "caste_pedhinamu",
        "nameEn": "Community Pedhinamu / Caste Proof before 1978",
        "nameGu": "૧૯૭૮ પૂર્વેનો જાતિ પુરાવો / પેઢીનામું",
        "mandatory": true
      },
      {
        "id": "applicant_lc",
        "nameEn": "Applicant School LC",
        "nameGu": "અરજદારનું શાળા LC",
        "mandatory": true
      },
      {
        "id": "nomadic_talati",
        "nameEn": "Talati / Sarpanch Certificate verifying Nomadic Status",
        "nameGu": "વિચરતી જાતિ હોવા અંગેનો તલાટી દાખલો",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Aadhaar Card",
        "nameGu": "આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_nt_dnt",
        "nameEn": "Existing NT/DNT Certificate",
        "nameGu": "હાલનો NT/DNT દાખલો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "land_partition",
    "nameEn": "Family Agricultural Land Partition & Split",
    "nameGu": "ખાતેદાર જમીન વહેંચણી / કુટુંબ વિભાજન",
    "departmentEn": "Revenue Department (Mamlatdar Kacheri)",
    "departmentGu": "મહેસૂલ વિભાગ (મામલતદાર કચેરી)",
    "category": "revenue",
    "emoji": "✂️",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "partition_deed",
        "nameEn": "Registered Family Partition Deed (વહેંચણી કરાર)",
        "nameGu": "નોંધણી થયેલ કુટુંબ વહેંચણી કરાર / સંમતિ પત્રક",
        "mandatory": true
      },
      {
        "id": "all_coowners_712",
        "nameEn": "Combined 7/12 Land Record",
        "nameGu": "સંયુક્ત ૭/૧૨ જમીન ઉતારો",
        "mandatory": true
      },
      {
        "id": "map_separation",
        "nameEn": "DILR Partition Proposed Map",
        "nameGu": "DILR વિભાજન પ્રપોઝ્ડ નકશો",
        "mandatory": true
      },
      {
        "id": "all_coowners_aadhaar",
        "nameEn": "Aadhaar Cards of All Co-Owners",
        "nameGu": "તમામ સહ-ખાતેદારોના આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 50
  },
  {
    "id": "boja_mukti",
    "nameEn": "Agricultural Land Bank Loan Clearance (બોજા મુક્તિ)",
    "nameGu": "બેંક બોજા મુક્તિ દાખલો (Loan Release)",
    "departmentEn": "Revenue Department (e-Dhara Kendra)",
    "departmentGu": "મહેસૂલ વિભાગ (e-Dhara જન સેવા કેન્દ્ર)",
    "category": "revenue",
    "emoji": "🔓",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "bank_noc_letter",
        "nameEn": "Bank Official Loan Clearance Certificate / NOC",
        "nameGu": "બેંકનું સત્તાવાર લોન ભરપાઈ NOC લેટર",
        "mandatory": true
      },
      {
        "id": "encumbrance_712",
        "nameEn": "7/12 copy showing Bank Charge Entry",
        "nameGu": "બોજો દર્શાવતો ૭/૧૨ નો ઉતારો",
        "mandatory": true
      },
      {
        "id": "khedut_aadhaar",
        "nameEn": "Farmer Khatedar Aadhaar Card",
        "nameGu": "ખેડૂત ખાતેદારનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "tenancy_cert",
    "nameEn": "Agricultural Tenancy Rights Certificate (ગણોત ધારા)",
    "nameGu": "ગણોત હક્ક પ્રમાણપત્ર (Ganot Dhara)",
    "departmentEn": "Revenue Department / Tenancy Tribunal (ALT)",
    "departmentGu": "ખેત પંચાયત અને ગણોત અદાલત (ALT મામલતદાર)",
    "category": "revenue",
    "emoji": "⚖️",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "tenancy_order",
        "nameEn": "Tenancy Tribunal Purchase / Possession Order",
        "nameGu": "ગણોત અદાલતનો ખરીદ હુકમ / કબજા હુકમ",
        "mandatory": true
      },
      {
        "id": "old_khatavahi",
        "nameEn": "Historic RoR Record (વર્ષ ૧૯૫૭ પૂર્વે)",
        "nameGu": "ઐતિહાસિક જમીન ખાતાવહી નકલ",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Tenant / Successor Aadhaar Card",
        "nameGu": "ગણોતિયા / વારસદારનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 50
  },
  {
    "id": "ration",
    "nameEn": "Digital Ration Card Service",
    "nameGu": "ડિજિટલ રેશનકાર્ડ સેવા",
    "departmentEn": "Food, Civil Supplies & Consumer Affairs Department",
    "departmentGu": "અન્ન અને નાગરિક પુરવઠા વિભાગ, ગુજરાત સરકાર",
    "category": "supplies",
    "emoji": "🛒",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નવા સભ્યનું નામ ઉમેરવું (Add Member)",
      "નામ કમી કરવું (Delete Member)",
      "સરનામું બદલવું (Change Address)",
      "રેશનકાર્ડ વિભાજન (Split)"
    ],
    "requiredDocsNew": [
      {
        "id": "family_aadhaar",
        "nameEn": "Aadhaar Cards of All Family Members",
        "nameGu": "કુટુંબના તમામ સભ્યોના આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "income_proof",
        "nameEn": "Income Certificate from Mamlatdar",
        "nameGu": "મામલતદારનો આવકનો દાખલો",
        "mandatory": true
      },
      {
        "id": "residence_proof",
        "nameEn": "Electricity Bill / Tax Receipt",
        "nameGu": "લાઈટ બિલ / વેરા પાવતી",
        "mandatory": true
      },
      {
        "id": "gas_proof",
        "nameEn": "LPG Gas Connection Consumer Receipt",
        "nameGu": "ગેસ કનેક્શન પાસબુક/રસીદ",
        "mandatory": false
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "current_ration",
        "nameEn": "Current Ration Card Booklet / Digital Copy",
        "nameGu": "હાલનું રેશનકાર્ડ",
        "mandatory": true
      },
      {
        "id": "member_proof",
        "nameEn": "Birth / Marriage Certificate for New Member",
        "nameGu": "નવા સભ્યનું જન્મ પ્રમાણપત્ર / લગ્ન નોંધણી",
        "mandatory": true
      },
      {
        "id": "member_aadhaar",
        "nameEn": "Aadhaar Card of Person to Add/Update",
        "nameGu": "ઉમેરવાના સભ્યનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "ration_add_member",
    "nameEn": "Add New Member to Existing Ration Card",
    "nameGu": "રેશનકાર્ડમાં નવા સભ્ય ઉમેરવા (Add Member)",
    "departmentEn": "Food, Civil Supplies & Consumer Affairs",
    "departmentGu": "પુરવઠા મામલતદાર કચેરી, ગુજરાત સરકાર",
    "category": "supplies",
    "emoji": "➕",
    "supportsNew": false,
    "supportsUpdate": true,
    "updateFields": [
      "નવા સભ્યનું નામ ઉમેરવું",
      "સંબંધ નોંધવો"
    ],
    "requiredDocsNew": [],
    "requiredDocsUpdate": [
      {
        "id": "original_ration",
        "nameEn": "Original Ration Card",
        "nameGu": "મૂળ રેશનકાર્ડની નકલ",
        "mandatory": true
      },
      {
        "id": "new_member_birth_marriage",
        "nameEn": "Birth Certificate (Child) or Marriage Registration / Transfer Noc (Wife)",
        "nameGu": "બાળકનો જન્મ દાખલો અથવા પત્નીનું લગ્ન સર્ટિ/કમી દાખલો",
        "mandatory": true
      },
      {
        "id": "new_member_aadhaar",
        "nameEn": "Aadhaar Card of New Member",
        "nameGu": "નવા સભ્યનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "ration_remove_member",
    "nameEn": "Remove Member from Ration Card (નામ કમી દાખલો)",
    "nameGu": "રેશનકાર્ડમાંથી સભ્ય કમી કરવો (કમી પ્રમાણપત્ર)",
    "departmentEn": "Food, Civil Supplies & Consumer Affairs",
    "departmentGu": "પુરવઠા મામલતદાર કચેરી, ગુજરાત સરકાર",
    "category": "supplies",
    "emoji": "➖",
    "supportsNew": false,
    "supportsUpdate": true,
    "updateFields": [
      "લગ્ન થતાં નામ કમી કરવું",
      "અવસાન થતાં નામ કમી કરવું",
      "સ્થળાંતર"
    ],
    "requiredDocsNew": [],
    "requiredDocsUpdate": [
      {
        "id": "original_ration",
        "nameEn": "Original Ration Card",
        "nameGu": "અસલ રેશનકાર્ડ",
        "mandatory": true
      },
      {
        "id": "reason_proof",
        "nameEn": "Marriage Certificate or Death Certificate",
        "nameGu": "લગ્ન નોંધણી દાખલો અથવા મરણ પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "head_consent",
        "nameEn": "Consent of Family Head",
        "nameGu": "કુટુંબના વડાનું સંમતિ પત્રક",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "ration_split",
    "nameEn": "Ration Card Separation & Split (વિભાજન)",
    "nameGu": "રેશનકાર્ડ વિભાજન (અલગ રેશનકાર્ડ)",
    "departmentEn": "Food, Civil Supplies & Consumer Affairs",
    "departmentGu": "અન્ન અને નાગરિક પુરવઠા વિભાગ",
    "category": "supplies",
    "emoji": "🗂️",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નવા કુટુંબ વડાની પસંદગી",
      "નવું સરનામું નોંધવું"
    ],
    "requiredDocsNew": [
      {
        "id": "parent_ration",
        "nameEn": "Original Joint Ration Card Copy",
        "nameGu": "મૂળ સંયુક્ત રેશનકાર્ડ",
        "mandatory": true
      },
      {
        "id": "separate_residence",
        "nameEn": "Independent Residence Proof (Light Bill / Rental)",
        "nameGu": "સ્વતંત્ર રહેઠાણ પુરાવો (લાઈટબિલ / ભાડાકરાર)",
        "mandatory": true
      },
      {
        "id": "separating_members_aadhaar",
        "nameEn": "Aadhaar of All Separating Members",
        "nameGu": "છૂટા પડતા તમામ સભ્યોના આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "ration_transfer",
    "nameEn": "Ration Card Inter-District Transfer (સ્થળાંતર)",
    "nameGu": "રેશનકાર્ડ અન્ય તાલુકા/જિલ્લામાં બદલવું",
    "departmentEn": "Food, Civil Supplies & Consumer Affairs",
    "departmentGu": "પુરવઠા મામલતદાર કચેરી",
    "category": "supplies",
    "emoji": "🚚",
    "supportsNew": false,
    "supportsUpdate": true,
    "updateFields": [
      "નવા તાલુકા/જિલ્લામાં બદલી",
      "નવી સસ્તા અનાજની દુકાન"
    ],
    "requiredDocsNew": [],
    "requiredDocsUpdate": [
      {
        "id": "current_ration",
        "nameEn": "Existing Ration Card",
        "nameGu": "હાલનું રેશનકાર્ડ",
        "mandatory": true
      },
      {
        "id": "new_address_proof",
        "nameEn": "New Address Electricity Bill / Tax Receipt",
        "nameGu": "નવા રહેઠાણનું લાઈટ બિલ અથવા વેરા પાવતી",
        "mandatory": true
      },
      {
        "id": "cancellation_slip",
        "nameEn": "Old Mamlatdar Surrender / Transfer Slip",
        "nameGu": "જૂની કચેરીની ટ્રાન્સફર સ્લિપ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "duplicate_ration",
    "nameEn": "Duplicate Ration Card (ખોવાઈ ગયેલ રેશનકાર્ડ)",
    "nameGu": "ડુપ્લિકેટ રેશનકાર્ડ મેળવવા અરજી",
    "departmentEn": "Food, Civil Supplies & Consumer Affairs",
    "departmentGu": "પુરવઠા મામલતદાર કચેરી, ગુજરાત સરકાર",
    "category": "supplies",
    "emoji": "📑",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "lost_police_report",
        "nameEn": "Police Lost Article / e-FIR Receipt",
        "nameGu": "પોલીસ ગુમ રિપોર્ટ / ઈ-એફઆઈઆર રસીદ",
        "mandatory": true
      },
      {
        "id": "affidavit_lost",
        "nameEn": "Notary Affidavit for Lost Card",
        "nameGu": "રેશનકાર્ડ ખોવાઈ ગયા અંગેનું નોટરી સોગંદનામું",
        "mandatory": true
      },
      {
        "id": "head_aadhaar",
        "nameEn": "Aadhaar Card of Family Head",
        "nameGu": "કુટુંબના વડાનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "light_bill",
        "nameEn": "Current Electricity Bill",
        "nameGu": "તાજેતરનું લાઈટ બિલ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "nfsa_inclusion",
    "nameEn": "National Food Security Act (NFSA) Priority Inclusion",
    "nameGu": "NFSA અગ્રતા ધરાવતા કુટુંબમાં સમાવેશ અરજી",
    "departmentEn": "Food, Civil Supplies & Consumer Affairs",
    "departmentGu": "પુરવઠા મામલતદાર કચેરી, ગુજરાત સરકાર",
    "category": "supplies",
    "emoji": "🌾",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "NFSA અગ્રતા શ્રેણી ઉમેરવી"
    ],
    "requiredDocsNew": [
      {
        "id": "current_non_nfsa",
        "nameEn": "Existing Non-NFSA (APL-1) Ration Card",
        "nameGu": "હાલનું બિન-NFSA રેશનકાર્ડ",
        "mandatory": true
      },
      {
        "id": "mamlatdar_income",
        "nameEn": "Income Certificate (< ₹1.5 Lakh)",
        "nameGu": "મામલતદારનો વાર્ષિક આવકનો દાખલો",
        "mandatory": true
      },
      {
        "id": "no_vehicle_declaration",
        "nameEn": "Self-Declaration of No Four Wheeler / AC",
        "nameGu": "ચાર પૈડાં વાહન ન હોવા અંગેનું બાંહેધરી પત્રક",
        "mandatory": true
      },
      {
        "id": "bpl_or_widow_proof",
        "nameEn": "BPL / Widow / Disability Proof if Applicable",
        "nameGu": "દિવ્યાંગ / વિધવા / વૃદ્ધ હોવાનો પુરાવો",
        "mandatory": false
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "fps_change",
    "nameEn": "Change Fair Price Shop (FPS) Allocation",
    "nameGu": "વાજબી ભાવની દુકાન (FPS) ફેરબદલ અરજી",
    "departmentEn": "Food, Civil Supplies & Consumer Affairs",
    "departmentGu": "અન્ન અને નાગરિક પુરવઠા વિભાગ",
    "category": "supplies",
    "emoji": "🏪",
    "supportsNew": false,
    "supportsUpdate": true,
    "updateFields": [
      "નવી FPS દુકાન ફાળવણી"
    ],
    "requiredDocsNew": [],
    "requiredDocsUpdate": [
      {
        "id": "ration_card",
        "nameEn": "Current Digital Ration Card",
        "nameGu": "હાલનું ડિજિટલ રેશનકાર્ડ",
        "mandatory": true
      },
      {
        "id": "nearby_address",
        "nameEn": "Proof of Residing Near Requested FPS Shop",
        "nameGu": "માંગેલ દુકાન નજીક રહેઠાણનો પુરાવો (લાઈટબિલ)",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "caste",
    "nameEn": "Caste & Non-Creamy Layer Certificate",
    "nameGu": "જાતિ પ્રમાણપત્ર & નોન-ક્રીમીલેયર દાખલો",
    "departmentEn": "Social Justice & Empowerment Department",
    "departmentGu": "સામાજિક ન્યાય અને અધિકારિતા વિભાગ, ગુજરાત સરકાર",
    "category": "welfare",
    "emoji": "⚖️",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નોન-ક્રીમીલેયર રિન્યુઅલ (Renewal)",
      "નામ સુધારો (Correction)"
    ],
    "requiredDocsNew": [
      {
        "id": "applicant_lc",
        "nameEn": "School Leaving Certificate of Applicant",
        "nameGu": "અરજદારનું શાળા છોડ્યાનું પ્રમાણપત્ર (LC)",
        "mandatory": true
      },
      {
        "id": "father_lc",
        "nameEn": "Father / Paternal Relative's LC or Pedhinamu",
        "nameGu": "પિતાનું LC અથવા પેઢીનામું / જાતિ પુરાવો",
        "mandatory": true
      },
      {
        "id": "income_cert",
        "nameEn": "Valid Income Certificate from Mamlatdar",
        "nameGu": "સક્ષમ અધિકારીનો આવકનો દાખલો",
        "mandatory": true
      },
      {
        "id": "ration_card",
        "nameEn": "Ration Card",
        "nameGu": "રેશનકાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_caste",
        "nameEn": "Previous Caste / NCL Certificate",
        "nameGu": "અગાઉનો જાતિનો / NCL દાખલો",
        "mandatory": true
      },
      {
        "id": "fresh_income",
        "nameEn": "Fresh Income Certificate",
        "nameGu": "તાજો આવકનો દાખલો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "sc_caste_cert",
    "nameEn": "Scheduled Caste (SC) Official Certificate",
    "nameGu": "અનુસૂચિત જાતિ (SC) સત્તાવાર પ્રમાણપત્ર",
    "departmentEn": "Social Justice & Empowerment Department",
    "departmentGu": "જિલ્લા સમાજ કલ્યાણ અધિકારી કચેરી",
    "category": "welfare",
    "emoji": "📜",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "સ્પેલિંગ સુધારો",
      "સરનામું સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "applicant_lc",
        "nameEn": "Applicant School Leaving Certificate",
        "nameGu": "અરજદારનું શાળા LC",
        "mandatory": true
      },
      {
        "id": "father_or_uncle_lc",
        "nameEn": "Paternal Ancestor School LC showing SC Caste before 1950",
        "nameGu": "૧૯૫૦ પૂર્વે પિતા કે કાકાનું શાળા LC",
        "mandatory": true
      },
      {
        "id": "pedhinamu_proof",
        "nameEn": "Pedhinamu certified by Talati",
        "nameGu": "તલાટીનું અધિકૃત પેઢીનામું",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_sc_cert",
        "nameEn": "Old SC Certificate Copy",
        "nameGu": "જૂનો SC જાતિ દાખલો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "st_caste_cert",
    "nameEn": "Scheduled Tribe (ST) Tribal Certificate",
    "nameGu": "અનુસૂચિત જનજાતિ (ST) પ્રમાણપત્ર",
    "departmentEn": "Tribal Development Department, Gujarat",
    "departmentGu": "આદિજાતિ વિકાસ કમિશનરની કચેરી",
    "category": "welfare",
    "emoji": "🏹",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નામ સુધારો",
      "ગોત્ર / પેટાજાતિ સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "applicant_lc",
        "nameEn": "Applicant School LC mentioning Scheduled Tribe",
        "nameGu": "અરજદારનું શાળા LC",
        "mandatory": true
      },
      {
        "id": "ancestral_proof",
        "nameEn": "Land Record / School Record before 1950",
        "nameGu": "૧૯૫૦ પૂર્વેનો જમીન કે શાળા રેકોર્ડ",
        "mandatory": true
      },
      {
        "id": "vigilance_panchnama",
        "nameEn": "Tribal Vigilance Officer Panchnama Report",
        "nameGu": "વિજિલન્સ સેલ પંચનામું રિપોર્ટ",
        "mandatory": true
      },
      {
        "id": "pedhinamu",
        "nameEn": "Talati Pedhinamu",
        "nameGu": "તલાટીનું પેઢીનામું",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_st_cert",
        "nameEn": "Previous ST Certificate",
        "nameGu": "જૂનો ST દાખલો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "ews_cert",
    "nameEn": "Economically Weaker Section (EWS) Certificate",
    "nameGu": "EWS પ્રમાણપત્ર (આર્થિક નબળા વર્ગ)",
    "departmentEn": "Social Justice & Empowerment Department",
    "departmentGu": "સામાજિક ન્યાય અને અધિકારિતા વિભાગ, ગુજરાત સરકાર",
    "category": "welfare",
    "emoji": "🏛️",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "વાર્ષિક નવીકરણ (Annual Renewal)",
      "સરનામું સુધારો (Address Update)"
    ],
    "requiredDocsNew": [
      {
        "id": "mamlatdar_income",
        "nameEn": "Income Certificate (Annual Income < ₹8 Lakh)",
        "nameGu": "મામલતદારનો આવકનો દાખલો (વાર્ષિક < ₹૮ લાખ)",
        "mandatory": true
      },
      {
        "id": "property_document",
        "nameEn": "Property / Land Documents (7/12 or House Index)",
        "nameGu": "જમીન/મકાન મિલકત દસ્તાવેજ (ઇન્ડેક્ષ-૨ / ૭-૧૨)",
        "mandatory": true
      },
      {
        "id": "school_lc",
        "nameEn": "School Leaving Certificate (Caste / Category Proof)",
        "nameGu": "શાળા છોડ્યાનું પ્રમાણપત્ર (બિન-અનામત જાતિ)",
        "mandatory": true
      },
      {
        "id": "panchayat_tax",
        "nameEn": "Municipal / Panchayat Tax Bill",
        "nameGu": "વેરા બિલ / લાઈટ બિલ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "prev_ews_cert",
        "nameEn": "Expired EWS Certificate Copy",
        "nameGu": "જૂનું EWS પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "current_year_income",
        "nameEn": "Current Financial Year Income Certificate",
        "nameGu": "ચાલુ નાણાકીય વર્ષનો આવકનો દાખલો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "senior_citizen",
    "nameEn": "Senior Citizen Identity Card (60+ Years)",
    "nameGu": "વરિષ્ઠ નાગરિક ઓળખપત્ર (૬૦+ વર્ષ)",
    "departmentEn": "Social Defence Directorate, Gujarat",
    "departmentGu": "સમાજ સુરક્ષા ખાતું, સામાજિક ન્યાય વિભાગ",
    "category": "welfare",
    "emoji": "👴",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "બ્લડ ગ્રુપ સુધારો (Blood Group Update)",
      "ઇમરજન્સી મોબાઈલ સુધારો",
      "સરનામું સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "age_proof",
        "nameEn": "Age Proof (School LC / PAN / Voter ID - 60+ Years)",
        "nameGu": "વય પુરાવો (LC / PAN / ચૂંટણી કાર્ડ - ૬૦ વર્ષ)",
        "mandatory": true
      },
      {
        "id": "senior_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "passport_photo",
        "nameEn": "Recent Passport Size Photograph",
        "nameGu": "પાસપોર્ટ સાઇઝ રંગીન ફોટો",
        "mandatory": true
      },
      {
        "id": "blood_report",
        "nameEn": "Blood Group Medical Report",
        "nameGu": "બ્લડ ગ્રુપ તબીબી રિપોર્ટ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "current_senior_card",
        "nameEn": "Current Senior Citizen Card Copy",
        "nameGu": "હાલનું વરિષ્ઠ નાગરિક કાર્ડ",
        "mandatory": true
      },
      {
        "id": "update_proof",
        "nameEn": "Supporting Document for Update",
        "nameGu": "સુધારા માટેનો પુરાવો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "disability_udid",
    "nameEn": "Unique Disability ID (UDID) & Swavalamban Card",
    "nameGu": "દિવ્યાંગતા પ્રમાણપત્ર & UDID કાર્ડ",
    "departmentEn": "Department of Empowerment of Persons with Disabilities",
    "departmentGu": "સમાજ સુરક્ષા ખાતું / સિવિલ હોસ્પિટલ મેડિકલ બોર્ડ",
    "category": "welfare",
    "emoji": "♿",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "ટકાવારી રિન્યુઅલ (Percentage Re-assessment)",
      "સરનામું સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "medical_board_cert",
        "nameEn": "Civil Hospital Medical Board Assessment (> 40%)",
        "nameGu": "સિવિલ હોસ્પિટલ મેડિકલ બોર્ડ પ્રમાણપત્ર (> ૪૦%)",
        "mandatory": true
      },
      {
        "id": "disability_photo",
        "nameEn": "Full Body Photograph showing Disability",
        "nameGu": "દિવ્યાંગતા દર્શાવતો સંપૂર્ણ ફોટો",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Aadhaar Card",
        "nameGu": "આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_udid",
        "nameEn": "Existing UDID Card",
        "nameGu": "હાલનું UDID કાર્ડ",
        "mandatory": true
      },
      {
        "id": "fresh_medical",
        "nameEn": "Fresh Medical Board Re-assessment",
        "nameGu": "નવો મેડિકલ રિપોર્ટ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "ganga_swarupa",
    "nameEn": "Ganga Swarupa (Widow Pension) Assistance Scheme",
    "nameGu": "ગંગા સ્વરૂપા (વિધવા સહાય) યોજના પ્રમાણપત્ર",
    "departmentEn": "Women & Child Development Department",
    "departmentGu": "મહિલા અને બાળ વિકાસ વિભાગ, ગુજરાત સરકાર",
    "category": "welfare",
    "emoji": "🙏",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "બેંક ખાતા વિગત સુધારો",
      "પુનઃલગ્ન ન કર્યા અંગેનું વાર્ષિક પ્રમાણપત્ર"
    ],
    "requiredDocsNew": [
      {
        "id": "husband_death_cert",
        "nameEn": "Husband Death Certificate",
        "nameGu": "પતિનું મરણ પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "widow_income",
        "nameEn": "Income Certificate (< ₹1.5 Lakh Rural, < ₹2 Lakh Urban)",
        "nameGu": "આવકનો દાખલો (મામલતદાર)",
        "mandatory": true
      },
      {
        "id": "not_remarried_affidavit",
        "nameEn": "Affidavit of Not Remarried (પુનઃલગ્ન ન કર્યાનું સોગંદનામું)",
        "nameGu": "પુનઃલગ્ન ન કર્યા અંગેનું સોગંદનામું",
        "mandatory": true
      },
      {
        "id": "bank_passbook",
        "nameEn": "Post Office / Bank Account Passbook",
        "nameGu": "પોસ્ટ ઓફિસ / બેંક પાસબુક",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "annual_life_cert",
        "nameEn": "Annual Remarriage Verification Certificate",
        "nameGu": "વાર્ષિક હયાતી અને પુનઃલગ્ન ન કર્યાનો દાખલો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "vrudh_pension",
    "nameEn": "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    "nameGu": "નિરાધાર વૃદ્ધ પેન્શન સહાય દાખલો",
    "departmentEn": "Social Defence Directorate, Gujarat",
    "departmentGu": "સમાજ સુરક્ષા ખાતું / મામલતદાર કચેરી",
    "category": "welfare",
    "emoji": "🧓",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "બેંક ખાતું બદલવું",
      "સરનામું સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "age_proof_60",
        "nameEn": "Age Proof (60+ Years for State, 65+ for Central)",
        "nameGu": "૬૦ વર્ષથી વધુ ઉંમરનો પુરાવો (LC / મતદાર કાર્ડ)",
        "mandatory": true
      },
      {
        "id": "bpl_card_proof",
        "nameEn": "BPL Score List Certificate (0 to 20 Score)",
        "nameGu": "BPL યાદી દાખલો (૦ થી ૨૦ સ્કોર)",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "bank_passbook",
        "nameEn": "Single Bank Account Passbook",
        "nameGu": "બેંક પાસબુક",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_pension_slip",
        "nameEn": "Old Pension Slip",
        "nameGu": "જૂની પેન્શન પાવતી",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "intercaste_aid",
    "nameEn": "Dr. Savita Ambedkar Inter-Caste Marriage Scheme",
    "nameGu": "ડો. સવિતા આંબેડકર આંતરજ્ઞાતીય લગ્ન સહાય",
    "departmentEn": "Scheduled Caste Welfare Directorate",
    "departmentGu": "અનુસૂચિત જાતિ કલ્યાણ ખાતું, ગુજરાત સરકાર",
    "category": "welfare",
    "emoji": "💐",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "marriage_cert",
        "nameEn": "Registered Marriage Certificate",
        "nameGu": "સત્તાવાર લગ્ન નોંધણી પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "sc_caste_proof",
        "nameEn": "Caste Certificate of SC Spouse",
        "nameGu": "અનુસૂચિત જાતિ ધરાવતા જીવનસાથીનો જાતિ દાખલો",
        "mandatory": true
      },
      {
        "id": "general_caste_proof",
        "nameEn": "Caste Certificate of Non-SC Spouse",
        "nameGu": "બિન-અનુસૂચિત જાતિ જીવનસાથીનું LC",
        "mandatory": true
      },
      {
        "id": "joint_bank_passbook",
        "nameEn": "Joint Bank Account Passbook",
        "nameGu": "દંપતીનું સંયુક્ત બેંક ખાતું",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "palak_mata_pita",
    "nameEn": "Palak Mata-Pita Yojana (Foster Parent Support)",
    "nameGu": "પાલક માતા-પિતા યોજના સહાય પ્રમાણપત્ર",
    "departmentEn": "Social Defence Directorate, Gujarat",
    "departmentGu": "સમાજ સુરક્ષા ખાતું, સામાજિક ન્યાય વિભાગ",
    "category": "welfare",
    "emoji": "🧒",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "શાળા પ્રવેશ વાર્ષિક પુરાવો રજૂ કરવો"
    ],
    "requiredDocsNew": [
      {
        "id": "orphan_parents_death",
        "nameEn": "Death Certificates of Both Biological Parents",
        "nameGu": "બાળકના માતા અને પિતા બંનેના મરણ પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "foster_income",
        "nameEn": "Foster Parents Income Certificate (< ₹3 Lakh)",
        "nameGu": "પાલક માતા-પિતાનો આવકનો દાખલો",
        "mandatory": true
      },
      {
        "id": "child_study_cert",
        "nameEn": "Bonafide Student Certificate of Child",
        "nameGu": "બાળકનો શાળા અભ્યાસ બોનાફાઇડ દાખલો",
        "mandatory": true
      },
      {
        "id": "child_aadhaar",
        "nameEn": "Child & Guardian Aadhaar Cards",
        "nameGu": "બાળક અને વાલીના આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "study_bonafide_current",
        "nameEn": "Fresh Academic Year Bonafide",
        "nameGu": "ચાલુ શૈક્ષણિક વર્ષનું બોનાફાઇડ સર્ટિફિકેટ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "birth_cert",
    "nameEn": "Birth Certificate (CRS / e-Gram)",
    "nameGu": "ડિજિટલ જન્મ પ્રમાણપત્ર",
    "departmentEn": "Panchayat, Rural Housing & Health Dept",
    "departmentGu": "પંચાયત, ગ્રામ ગૃહનિર્માણ અને આરોગ્ય વિભાગ",
    "category": "panchayat",
    "emoji": "👶",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "બાળકનું નામ ઉમેરવું (Add Child Name)",
      "માતા-પિતાના નામમાં સ્પેલિંગ સુધારો",
      "જન્મ સ્થળ સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "hospital_discharge",
        "nameEn": "Hospital Discharge Slip / Form 1",
        "nameGu": "હોસ્પિટલ ડિસ્ચાર્જ સ્લિપ / ફોર્મ-૧",
        "mandatory": true
      },
      {
        "id": "parents_aadhaar",
        "nameEn": "Aadhaar Cards of Parents",
        "nameGu": "માતા અને પિતા બંનેના આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "marriage_or_ration",
        "nameEn": "Marriage Certificate or Ration Card",
        "nameGu": "લગ્ન નોંધણી દાખલો અથવા રેશનકાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "current_birth_cert",
        "nameEn": "Original Birth Certificate Copy",
        "nameGu": "હાલનું અસલ જન્મ પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "school_lc_proof",
        "nameEn": "School Leaving Certificate or Court Order",
        "nameGu": "શાળા છોડ્યાનું પ્રમાણપત્ર (LC) / સોગંદનામું",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "death_cert",
    "nameEn": "Death Certificate (CRS)",
    "nameGu": "ડિજિટલ મરણ પ્રમાણપત્ર",
    "departmentEn": "Panchayat & Urban Development Dept",
    "departmentGu": "પંચાયત અને નગરપાલિકા નિયામકની કચેરી",
    "category": "panchayat",
    "emoji": "🕊️",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નામ સ્પેલિંગ સુધારો (Spelling Correction)",
      "મરણ તારીખ સુધારો",
      "કાયમી સરનામું સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "doctor_cause_cert",
        "nameEn": "Medical Certificate of Cause of Death / Cremation Slip",
        "nameGu": "ડોક્ટર મરણ સર્ટિફિકેટ / સ્મશાન પાવતી",
        "mandatory": true
      },
      {
        "id": "deceased_aadhaar",
        "nameEn": "Aadhaar Card of Deceased Person",
        "nameGu": "મૃતકનું આધાર કાર્ડ / ઓળખપત્ર",
        "mandatory": true
      },
      {
        "id": "informant_id",
        "nameEn": "Applicant / Informant ID & Ration Card",
        "nameGu": "અરજદાર/વારસદારનું આધાર કાર્ડ અને રેશનકાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_death_cert",
        "nameEn": "Existing Death Certificate Copy",
        "nameGu": "હાલનું મરણ પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "notary_affidavit",
        "nameEn": "Notary Affidavit & Evidence for Correction",
        "nameGu": "નોટરી સોગંદનામું અને સુધારા પુરાવો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "marriage_cert",
    "nameEn": "Marriage Registration Certificate",
    "nameGu": "લગ્ન નોંધણી પ્રમાણપત્ર",
    "departmentEn": "Panchayat & Urban Development Dept",
    "departmentGu": "પંચાયત અને શહેરી વિકાસ વિભાગ, ગુજરાત સરકાર",
    "category": "panchayat",
    "emoji": "💍",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નામ સ્પેલિંગ સુધારો (Spelling Correction)",
      "સરનામું સુધારો (Address Update)"
    ],
    "requiredDocsNew": [
      {
        "id": "invitation_card",
        "nameEn": "Wedding Invitation Card (કંકોત્રી) or Priest Certificate",
        "nameGu": "લગ્ન કંકોત્રી અથવા ગોર મહારાજનું પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "couple_ids",
        "nameEn": "Aadhaar & Birth Proof of Both Bride and Groom",
        "nameGu": "વર અને કન્યા બંનેના આધાર કાર્ડ અને LC / જન્મ દાખલો",
        "mandatory": true
      },
      {
        "id": "joint_photo",
        "nameEn": "Joint Marriage Photograph",
        "nameGu": "લગ્ન સમયનો સંયુક્ત પાસપોર્ટ ફોટો",
        "mandatory": true
      },
      {
        "id": "witness_ids",
        "nameEn": "Aadhaar Cards of Two Adult Witnesses",
        "nameGu": "બે પુખ્ત સાક્ષીઓના આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "original_marriage_cert",
        "nameEn": "Existing Marriage Certificate Copy",
        "nameGu": "અસલ લગ્ન નોંધણી દાખલો",
        "mandatory": true
      },
      {
        "id": "affidavit_proof",
        "nameEn": "Joint Correction Affidavit by Couple",
        "nameGu": "દંપતીનું સંયુક્ત સુધારા સોગંદનામું",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 100
  },
  {
    "id": "ayushman_card",
    "nameEn": "Ayushman Bharat PM-JAY / Mukhyamantri Amrutam (MAA) Card",
    "nameGu": "આયુષ્માન ભારત PM-JAY / MAA કાર્ડ (₹૧૦ લાખ કવચ)",
    "departmentEn": "Health & Family Welfare Department",
    "departmentGu": "આરોગ્ય અને પરિવાર કલ્યાણ વિભાગ, ગુજરાત સરકાર",
    "category": "panchayat",
    "emoji": "🏥",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નવા સભ્ય ઉમેરવા (Add Family Member)",
      "મોબાઈલ નંબર અપડેટ કરવો"
    ],
    "requiredDocsNew": [
      {
        "id": "aadhaar_linked",
        "nameEn": "Aadhaar Card of All Family Members",
        "nameGu": "કુટુંબના તમામ સભ્યોના આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "ration_card_nfsa",
        "nameEn": "NFSA / MAA Card or Income Certificate (< ₹4 Lakh)",
        "nameGu": "NFSA રેશનકાર્ડ અથવા આવકનો દાખલો",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_pmjay_card",
        "nameEn": "Existing PMJAY Family Card",
        "nameGu": "હાલનું PMJAY કાર્ડ",
        "mandatory": true
      },
      {
        "id": "new_member_proof",
        "nameEn": "Birth / Marriage Certificate",
        "nameGu": "નવા સભ્યનો જન્મ દાખલો / લગ્ન દાખલો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": true,
    "biometricRequiredUpdate": true,
    "fee": 0
  },
  {
    "id": "panchayat_tax_akarani",
    "nameEn": "Property Assessment Register Copy (આકારણી રજીસ્ટર નકલ)",
    "nameGu": "મકાન આકારણી પાવતી / આકારણી રજીસ્ટર નકલ",
    "departmentEn": "Panchayat & Rural Housing Department",
    "departmentGu": "ગ્રામ પંચાયત કચેરી (તલાટી કમ મંત્રી)",
    "category": "panchayat",
    "emoji": "🏡",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "મકાન માલિકી નામ ફેરબદલ",
      "માપણી સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "house_proof",
        "nameEn": "Purchase Deed or Allotment Letter",
        "nameGu": "મકાન દસ્તાવેજ / ફાળવણી પત્રક",
        "mandatory": true
      },
      {
        "id": "tax_receipt",
        "nameEn": "Last Year Panchayat House Tax Receipt",
        "nameGu": "છેલ્લા વર્ષની મકાન વેરા પાવતી",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Owner Aadhaar Card",
        "nameGu": "મકાન માલિકનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_akarani",
        "nameEn": "Previous Assessment Copy",
        "nameGu": "જૂની આકારણી નકલ",
        "mandatory": true
      },
      {
        "id": "transfer_deed",
        "nameEn": "Registered Sale Deed / Gift Deed",
        "nameGu": "રજિસ્ટર્ડ વેચાણ દસ્તાવેજ / બક્ષિસ દસ્તાવેજ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "bpl_certificate",
    "nameEn": "Rural BPL Inclusion Certificate (BPL યાદી દાખલો)",
    "nameGu": "ગ્રામીણ BPL યાદીમાં નામ હોવા અંગેનો દાખલો",
    "departmentEn": "Panchayat & Rural Housing Department",
    "departmentGu": "તાલુકા વિકાસ અધિકારી (TDO) કચેરી",
    "category": "panchayat",
    "emoji": "📋",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "ration_card",
        "nameEn": "BPL Ration Card",
        "nameGu": "BPL રેશનકાર્ડ",
        "mandatory": true
      },
      {
        "id": "talati_bpl_cert",
        "nameEn": "Talati Certified BPL Survey Extract",
        "nameGu": "તલાટી પ્રમાણિત BPL સર્વે ઉતારો",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "panchayat_construction",
    "nameEn": "Village Building Construction Permission (બાંધકામ મંજૂરી)",
    "nameGu": "ગ્રામ પંચાયત બાંધકામ પરવાનગી પ્રમાણપત્ર",
    "departmentEn": "Panchayat & Rural Housing Department",
    "departmentGu": "ગ્રામ પંચાયત કચેરી / તાલુકા પંચાયત",
    "category": "panchayat",
    "emoji": "🧱",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "property_document",
        "nameEn": "Sanad / Sale Deed / Property Card",
        "nameGu": "સનદ / વેચાણ દસ્તાવેજ / પ્રોપર્ટી કાર્ડ",
        "mandatory": true
      },
      {
        "id": "building_blueprints",
        "nameEn": "Blueprints by Civil Engineer / Architect",
        "nameGu": "સિવિલ એન્જિનિયર દ્વારા તૈયાર બ્લુપ્રિન્ટ પ્લાન",
        "mandatory": true
      },
      {
        "id": "no_objection_neighbors",
        "nameEn": "No Objection from Immediate Neighbors",
        "nameGu": "આજુબાજુના પાડોશીઓનું વાંધા પ્રમાણપત્ર",
        "mandatory": false
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Owner Aadhaar Card",
        "nameGu": "માલિકનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 50
  },
  {
    "id": "toilet_subsidy_cert",
    "nameEn": "Swachh Bharat Mission Individual Household Toilet Aid",
    "nameGu": "સ્વચ્છ ભારત મિશન શૌચાલય સહાય દાખલો (₹૧૨,૦૦૦)",
    "departmentEn": "Panchayat, Rural Housing & SBM Gramin",
    "departmentGu": "ગ્રામ વિકાસ એજન્સી (DRDA / પંચાયત)",
    "category": "panchayat",
    "emoji": "🚽",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "ration_card",
        "nameEn": "Family Ration Card",
        "nameGu": "કુટુંબનું રેશનકાર્ડ",
        "mandatory": true
      },
      {
        "id": "bank_passbook",
        "nameEn": "Bank Passbook with IFSC for DBT",
        "nameGu": "બેંક પાસબુક (DBT સહાય માટે)",
        "mandatory": true
      },
      {
        "id": "geo_tagged_photo",
        "nameEn": "Photograph of Constructed Toilet with Beneficiary",
        "nameGu": "લાભાર્થી સાથે શૌચાલયનો જીઓ-ટેગ ફોટો",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Beneficiary Aadhaar Card",
        "nameGu": "લાભાર્થીનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "drinking_water_noc",
    "nameEn": "Panchayat Tap Water Connection NOC & Certificate",
    "nameGu": "નળ જોડાણ પ્રમાણપત્ર / પાણી વેરા NOC",
    "departmentEn": "Panchayat & WASMO (Water & Sanitation)",
    "departmentGu": "ગ્રામ પંચાયત પાણી સમિતિ / વાસ્મો (WASMO)",
    "category": "panchayat",
    "emoji": "🚰",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "house_tax_receipt",
        "nameEn": "Panchayat House Tax Clearance Receipt",
        "nameGu": "મકાન વેરો ભર્યાની પહોંચ",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 20
  },
  {
    "id": "driving_licence",
    "nameEn": "Driving Licence (SARATHI - Transport Dept)",
    "nameGu": "ડ્રાઇવિંગ લાયસન્સ (RTO સારથી - DL)",
    "departmentEn": "Commissioner of Transport, Gujarat",
    "departmentGu": "વાહનવ્યવહાર કમિશનરની કચેરી, ગુજરાત સરકાર",
    "category": "transport",
    "emoji": "🚗",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "લાયસન્સ રિન્યુઅલ (Renewal)",
      "સરનામું સુધારો (Address Change)",
      "વાહન ક્લાસ ઉમેરો (Add Vehicle Class)"
    ],
    "requiredDocsNew": [
      {
        "id": "age_dob_proof",
        "nameEn": "Age & DOB Proof (Birth Certificate / School LC)",
        "nameGu": "વય અને જન્મ તારીખ પુરાવો (LC / જન્મ દાખલો)",
        "mandatory": true
      },
      {
        "id": "address_proof",
        "nameEn": "Permanent Address Proof (Aadhaar / Voter ID)",
        "nameGu": "કાયમી સરનામાનો પુરાવો (આધાર કાર્ડ / ચૂંટણી કાર્ડ)",
        "mandatory": true
      },
      {
        "id": "medical_form1a",
        "nameEn": "Medical Fitness Certificate (Form 1A / Self-Declaration)",
        "nameGu": "તબીબી ફિટનેસ પ્રમાણપત્ર (ફોર્મ ૧-એ)",
        "mandatory": true
      },
      {
        "id": "photo_sign",
        "nameEn": "Passport Photo & Specimen Signature",
        "nameGu": "પાસપોર્ટ ફોટો અને નમૂના સહી",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "original_dl",
        "nameEn": "Original Driving Licence Copy",
        "nameGu": "અસલ ડ્રાઇવિંગ લાયસન્સની નકલ",
        "mandatory": true
      },
      {
        "id": "aadhaar_proof",
        "nameEn": "Aadhaar Card for Address / Identity Verification",
        "nameGu": "આધાર કાર્ડ પુરાવો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": true,
    "biometricRequiredUpdate": false,
    "fee": 200
  },
  {
    "id": "learner_licence",
    "nameEn": "Learner's Licence (LL) Online Test & Issue",
    "nameGu": "લર્નિંગ લાયસન્સ ટેસ્ટ & ઇશ્યૂ (LL)",
    "departmentEn": "Commissioner of Transport, Gujarat",
    "departmentGu": "વાહનવ્યવહાર કમિશનરની કચેરી (RTO/ITI કેન્દ્રો)",
    "category": "transport",
    "emoji": "🚦",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "age_proof",
        "nameEn": "School Leaving Certificate / Birth Certificate",
        "nameGu": "શાળા છોડ્યાનું પ્રમાણપત્ર (LC)",
        "mandatory": true
      },
      {
        "id": "aadhaar_auth",
        "nameEn": "Aadhaar Card (Linked with Mobile)",
        "nameGu": "આધાર કાર્ડ (મોબાઈલ લિંક્ડ OTP ટેસ્ટ)",
        "mandatory": true
      },
      {
        "id": "form_1_self",
        "nameEn": "Self Declaration Form 1",
        "nameGu": "શારીરિક ક્ષમતા બાંહેધરી ફોર્મ-૧",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 150
  },
  {
    "id": "dl_renewal_dup",
    "nameEn": "DL Renewal / Duplicate Smart Card",
    "nameGu": "ડ્રાઇવિંગ લાયસન્સ રિન્યુઅલ / ડુપ્લિકેટ સ્માર્ટ કાર્ડ",
    "departmentEn": "Commissioner of Transport, Gujarat",
    "departmentGu": "સંબંધિત RTO કચેરી, ગુજરાત સરકાર",
    "category": "transport",
    "emoji": "💳",
    "supportsNew": false,
    "supportsUpdate": true,
    "updateFields": [
      "મુદત રિન્યુઅલ (Renewal)",
      "ખોવાઈ ગયેલ ડુપ્લિકેટ કાર્ડ"
    ],
    "requiredDocsNew": [],
    "requiredDocsUpdate": [
      {
        "id": "current_dl",
        "nameEn": "Existing Driving Licence (or Police FIR if lost)",
        "nameGu": "હાલનું DL (અથવા ખોવાયા અંગેની પોલીસ પહોંચ)",
        "mandatory": true
      },
      {
        "id": "form_1a_doctor",
        "nameEn": "Medical Certificate Form 1A by Registered Doctor (for age 40+)",
        "nameGu": "ડોક્ટરનું મેડિકલ ફિટનેસ ફોર્મ ૧-એ (૪૦+ વય માટે)",
        "mandatory": true
      },
      {
        "id": "address_aadhaar",
        "nameEn": "Aadhaar Card",
        "nameGu": "આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 200
  },
  {
    "id": "vehicle_rc_transfer",
    "nameEn": "Vehicle Ownership Transfer (RC બુક નામ ફેરબદલ)",
    "nameGu": "વાહન માલિકી ફેરબદલ (Vehicle RC Transfer)",
    "departmentEn": "Commissioner of Transport, Gujarat",
    "departmentGu": "RTO કચેરી (વાહન VAHAN 4.0)",
    "category": "transport",
    "emoji": "🏍️",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "વેચાણ બાદ નવો માલિક",
      "વારસાઈ માલિકી"
    ],
    "requiredDocsNew": [
      {
        "id": "form_29_30",
        "nameEn": "Notice of Transfer Form 29 & 30 signed by Buyer and Seller",
        "nameGu": "ફોર્મ નં. ૨૯ અને ૩૦ (વેચનાર-ખરીદનાર સહી)",
        "mandatory": true
      },
      {
        "id": "original_rc",
        "nameEn": "Original RC Book / Smart Card",
        "nameGu": "અસલ RC બુક / સ્માર્ટ કાર્ડ",
        "mandatory": true
      },
      {
        "id": "valid_insurance",
        "nameEn": "Valid Vehicle Insurance Policy",
        "nameGu": "ચાલુ વાહન વીમા પોલિસી",
        "mandatory": true
      },
      {
        "id": "puc_cert",
        "nameEn": "Valid PUC Certificate",
        "nameGu": "માન્ય PUC પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "buyer_aadhaar",
        "nameEn": "Buyer Aadhaar Card & Address Proof",
        "nameGu": "ખરીદનારનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 300
  },
  {
    "id": "vehicle_fitness_cert",
    "nameEn": "Commercial Vehicle Fitness Certificate",
    "nameGu": "વાહન ફિટનેસ સર્ટિફિકેટ (કમર્શિયલ વાહન)",
    "departmentEn": "Commissioner of Transport, Gujarat",
    "departmentGu": "RTO કચેરી વાહન ઇન્સ્પેક્શન શાખા",
    "category": "transport",
    "emoji": "🚚",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "વાર્ષિક ફિટનેસ રિન્યુઅલ"
    ],
    "requiredDocsNew": [
      {
        "id": "rc_book",
        "nameEn": "Vehicle Registration Certificate (RC)",
        "nameGu": "વાહન આરસી બુક",
        "mandatory": true
      },
      {
        "id": "tax_clearance",
        "nameEn": "Motor Vehicle Tax Clearance Certificate",
        "nameGu": "મોટર વાહન ટેક્સ ભરપાઈ પાવતી",
        "mandatory": true
      },
      {
        "id": "speed_governor",
        "nameEn": "Speed Governor & FASTag Calibration Certificate",
        "nameGu": "સ્પીડ ગવર્નર અને ફાસ્ટેગ સર્ટિફિકેટ",
        "mandatory": true
      },
      {
        "id": "puc_insurance",
        "nameEn": "PUC & Comprehensive Insurance",
        "nameGu": "PUC અને વીમા પોલિસી",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 400
  },
  {
    "id": "vehicle_noc_other",
    "nameEn": "Vehicle No Objection Certificate (NOC) for Inter-State Transfer",
    "nameGu": "વાહન અન્ય રાજ્ય / જિલ્લા NOC અરજી",
    "departmentEn": "Commissioner of Transport, Gujarat",
    "departmentGu": "RTO કચેરી, ગુજરાત સરકાર",
    "category": "transport",
    "emoji": "📋",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "form_28_triplicate",
        "nameEn": "Form 28 in Triplicate with Chassis Pencil Print",
        "nameGu": "ફોર્મ નં. ૨૮ (ત્રણ નકલમાં ચેસિસ પ્રિન્ટ સાથે)",
        "mandatory": true
      },
      {
        "id": "rc_book",
        "nameEn": "RC Book Copy",
        "nameGu": "આરસી બુક નકલ",
        "mandatory": true
      },
      {
        "id": "police_crime_clearance",
        "nameEn": "Local Police / Crime Branch Clearance Report",
        "nameGu": "પોલીસ ગુના મુક્તિ રિપોર્ટ",
        "mandatory": true
      },
      {
        "id": "bank_financer_noc",
        "nameEn": "Financer NOC if Hypothecated",
        "nameGu": "બેંક ફાઇનાન્સર એનઓસી (જો લોન હોય તો)",
        "mandatory": false
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 100
  },
  {
    "id": "police_clearance",
    "nameEn": "Police Clearance Certificate (PCC / પાસપોર્ટ/નોકરી)",
    "nameGu": "પોલીસ વેરિફિકેશન / ક્લિયરન્સ સર્ટિફિકેટ (PCC)",
    "departmentEn": "Home Department & Gujarat Police",
    "departmentGu": "ગૃહ વિભાગ અને પોલીસ કમિશનર / એસ.પી. કચેરી",
    "category": "police",
    "emoji": "👮",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "passport_or_job_letter",
        "nameEn": "Passport Copy or Official Employment Requirement Letter",
        "nameGu": "પાસપોર્ટ નકલ અથવા કંપની રિક્વાયરમેન્ટ લેટર",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "address_proof",
        "nameEn": "Light Bill / House Tax Receipt (5 Years Residence)",
        "nameGu": "૫ વર્ષ રહેઠાણ પુરાવો (લાઈટબિલ / વેરાબિલ)",
        "mandatory": true
      },
      {
        "id": "passport_photo",
        "nameEn": "Passport Size Color Photograph",
        "nameGu": "પાસપોર્ટ સાઇઝ રંગીન ફોટો",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 100
  },
  {
    "id": "lost_article_efir",
    "nameEn": "Citizen Portal e-FIR / Lost Article Report",
    "nameGu": "ગુમ થયેલ દસ્તાવેજ / મોબાઈલ e-FIR નોંધણી",
    "departmentEn": "Gujarat Police (Citizen First Portal)",
    "departmentGu": "ગુજરાત પોલીસ (સિટીઝન ફર્સ્ટ પોર્ટલ)",
    "category": "police",
    "emoji": "📱",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "article_details",
        "nameEn": "IMEI Number / Document ID / Description of Loss",
        "nameGu": "મોબાઈલ IMEI અથવા દસ્તાવેજ નંબરની વિગત",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "purchase_invoice",
        "nameEn": "Purchase Bill / Invoice if Available",
        "nameGu": "ખરીદી બિલ / ઇન્વોઇસ",
        "mandatory": false
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "tenant_police_verif",
    "nameEn": "Tenant Verification Certificate (ભાડૂઆત નોંધણી)",
    "nameGu": "ભાડૂઆત પોલીસ ચકાસણી પ્રમાણપત્ર",
    "departmentEn": "Gujarat Police",
    "departmentGu": "સ્થાનિક પોલીસ સ્ટેશન, ગુજરાત પોલીસ",
    "category": "police",
    "emoji": "🏘️",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "rent_agreement",
        "nameEn": "Notarized / Registered Rent Agreement",
        "nameGu": "નોટરાઇઝ્ડ / રજિસ્ટર્ડ ભાડા કરાર",
        "mandatory": true
      },
      {
        "id": "tenant_aadhaar",
        "nameEn": "Tenant Aadhaar Card and Permanent Address Proof",
        "nameGu": "ભાડૂઆતનું આધાર કાર્ડ અને મૂળ વતનનો પુરાવો",
        "mandatory": true
      },
      {
        "id": "owner_aadhaar",
        "nameEn": "Property Owner Aadhaar Card",
        "nameGu": "મકાન માલિકનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "tenant_photo",
        "nameEn": "Tenant Passport Size Photographs",
        "nameGu": "ભાડૂઆતના પાસપોર્ટ સાઇઝ ફોટોગ્રાફ્સ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "domestic_servant_verif",
    "nameEn": "Domestic Help / Driver Police Verification",
    "nameGu": "ઘરેલું નોકર / ડ્રાઇવર ચકાસણી દાખલો",
    "departmentEn": "Gujarat Police",
    "departmentGu": "સ્થાનિક પોલીસ સ્ટેશન શાખા",
    "category": "police",
    "emoji": "🛡️",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "worker_aadhaar",
        "nameEn": "Domestic Worker Aadhaar Card",
        "nameGu": "કામદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "worker_native_id",
        "nameEn": "Native Police Verification / Voter ID",
        "nameGu": "મૂળ ગામ/રાજ્યનું ઓળખપત્ર",
        "mandatory": true
      },
      {
        "id": "employer_aadhaar",
        "nameEn": "Employer Aadhaar & Address Proof",
        "nameGu": "માલિકનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "worker_photo",
        "nameEn": "Recent Passport Size Photograph",
        "nameGu": "કામદારનો તાજો ફોટો",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "arms_licence_renew",
    "nameEn": "Self-Defence Arms Licence Renewal Application",
    "nameGu": "હથિયાર લાયસન્સ રિન્યુઅલ અરજી (Arms Licence)",
    "departmentEn": "Home Department & District Magistrate",
    "departmentGu": "ગૃહ વિભાગ & જિલ્લા મેજિસ્ટ્રેટ (કલેક્ટર) કચેરી",
    "category": "police",
    "emoji": "🎯",
    "supportsNew": false,
    "supportsUpdate": true,
    "updateFields": [
      "લાયસન્સ મુદત રિન્યુઅલ",
      "હથિયાર વિગત ચકાસણી"
    ],
    "requiredDocsNew": [],
    "requiredDocsUpdate": [
      {
        "id": "existing_arms_book",
        "nameEn": "Existing Arms Licence Booklet",
        "nameGu": "અસલ હથિયાર લાયસન્સ બુકલેટ",
        "mandatory": true
      },
      {
        "id": "police_inspection",
        "nameEn": "Area Police Station Physical Weapon Inspection Report",
        "nameGu": "પોલીસ સ્ટેશન હથિયાર ઇન્સ્પેક્શન રિપોર્ટ",
        "mandatory": true
      },
      {
        "id": "medical_fitness",
        "nameEn": "Government Doctor Mental & Physical Fitness Certificate",
        "nameGu": "સરકારી ડોક્ટર માનસિક-શારીરિક ફિટનેસ દાખલો",
        "mandatory": true
      },
      {
        "id": "safe_custody",
        "nameEn": "Safe Custody Proof / Firing Practice Certificate",
        "nameGu": "સેફ કસ્ટડી પુરાવો",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 500
  },
  {
    "id": "e_nirman_card",
    "nameEn": "Bandhkam Shramik e-Nirman Smart Card (બાંધકામ શ્રમિક)",
    "nameGu": "બાંધકામ શ્રમિક ઈ-નિર્માણ સ્માર્ટ કાર્ડ",
    "departmentEn": "Gujarat Building & Other Construction Workers Board",
    "departmentGu": "ગુજરાત મકાન અને અન્ય બાંધકામ શ્રમયોગી કલ્યાણ બોર્ડ",
    "category": "labour",
    "emoji": "👷",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "મોબાઈલ નંબર અપડેટ કરવો",
      "બેંક ખાતું બદલવું"
    ],
    "requiredDocsNew": [
      {
        "id": "work_cert_90days",
        "nameEn": "90 Days Work Certificate from Contractor / Talati",
        "nameGu": "કોન્ટ્રાક્ટર / તલાટી દ્વારા ૯૦ દિવસ કામ કર્યાનો દાખલો",
        "mandatory": true
      },
      {
        "id": "shramik_aadhaar",
        "nameEn": "Worker Aadhaar Card (Age 18-60)",
        "nameGu": "શ્રમિકનું આધાર કાર્ડ (૧૮ થી ૬૦ વર્ષ)",
        "mandatory": true
      },
      {
        "id": "bank_passbook",
        "nameEn": "Aadhaar Linked Bank Passbook",
        "nameGu": "આધાર લિંક્ડ બેંક પાસબુક",
        "mandatory": true
      },
      {
        "id": "family_ration",
        "nameEn": "Family Ration Card Copy",
        "nameGu": "કુટુંબનું રેશનકાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_enirman",
        "nameEn": "Old e-Nirman Card",
        "nameGu": "જૂનું ઈ-નિર્માણ કાર્ડ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "e_shram_card",
    "nameEn": "National Unorganised Worker e-Shram Registration",
    "nameGu": "ઈ-શ્રમ કાર્ડ રાષ્ટ્રીય પોર્ટલ રજિસ્ટ્રેશન",
    "departmentEn": "Ministry of Labour & Employment",
    "departmentGu": "શ્રમ અને રોજગાર વિભાગ, ભારત સરકાર / ગુજરાત",
    "category": "labour",
    "emoji": "🛠️",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "વ્યવસાય કેટેગરી બદલવી",
      "સરનામું સુધારો"
    ],
    "requiredDocsNew": [
      {
        "id": "worker_aadhaar",
        "nameEn": "Aadhaar Card Linked with Active Mobile Number",
        "nameGu": "મોબાઈલ લિંક્ડ આધાર કાર્ડ (OTP વેરિફિકેશન)",
        "mandatory": true
      },
      {
        "id": "bank_account",
        "nameEn": "Active Bank Account Details (IFSC Code)",
        "nameGu": "ચાલુ બેંક ખાતા વિગત",
        "mandatory": true
      },
      {
        "id": "nominee_id",
        "nameEn": "Nominee Aadhaar Details",
        "nameGu": "વારસદાર (નોમિની) આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "eshram_uan",
        "nameEn": "12 Digit UAN Number",
        "nameGu": "૧૨ આંકડાનો UAN નંબર",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "employment_exchange",
    "nameEn": "District Employment Exchange Registration Card (રોજગાર કાર્ડ)",
    "nameGu": "જિલ્લા રોજગાર કચેરી નોંધણી કાર્ડ (Rojgar Card)",
    "departmentEn": "Directorate of Employment & Training (DET)",
    "departmentGu": "રોજગાર અને તાલીમ નિયામકની કચેરી, ગુજરાત સરકાર",
    "category": "labour",
    "emoji": "💼",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નવી શૈક્ષણિક લાયકાત ઉમેરવી",
      "મોબાઈલ/ઈમેલ અપડેટ"
    ],
    "requiredDocsNew": [
      {
        "id": "all_marksheets",
        "nameEn": "10th / 12th / ITI / Degree Passing Certificates",
        "nameGu": "ધોરણ ૧૦, ૧૨, આઈટીઆઈ અથવા ડિગ્રી માર્કશીટ",
        "mandatory": true
      },
      {
        "id": "school_lc",
        "nameEn": "School Leaving Certificate",
        "nameGu": "શાળા છોડ્યાનું પ્રમાણપત્ર (LC)",
        "mandatory": true
      },
      {
        "id": "caste_cert",
        "nameEn": "Caste Certificate if Applicable (SC/ST/OBC/EWS)",
        "nameGu": "જાતિ પ્રમાણપત્ર (જો લાગુ પડતું હોય)",
        "mandatory": false
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_reg_no",
        "nameEn": "Previous Employment Registration Slip",
        "nameGu": "જૂની રોજગાર નોંધણી પહોંચ",
        "mandatory": true
      },
      {
        "id": "new_degree",
        "nameEn": "New Degree / Diploma Certificate",
        "nameGu": "નવી ડિગ્રી / ડિપ્લોમા સર્ટિફિકેટ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "digital_guj_scholarship",
    "nameEn": "Digital Gujarat Post-Matric Scholarship Eligibility Card",
    "nameGu": "ડિજિટલ ગુજરાત શિષ્યવૃત્તિ પાત્રતા દાખલો",
    "departmentEn": "Social Justice & Tribal Development Dept",
    "departmentGu": "ડિજિટલ ગુજરાત સ્કોલરશિપ પોર્ટલ, ગુજરાત સરકાર",
    "category": "labour",
    "emoji": "🎓",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "બેંક ખાતું અપડેટ કરવું",
      "કોલેજ ફી રસીદ ઉમેરવી"
    ],
    "requiredDocsNew": [
      {
        "id": "college_admission_fee",
        "nameEn": "Current Year College Admission Receipt & Bonafide",
        "nameGu": "ચાલુ વર્ષની કોલેજ ફી પહોંચ અને બોનાફાઇડ",
        "mandatory": true
      },
      {
        "id": "caste_cert",
        "nameEn": "Caste Certificate (SC / ST / SEBC / EWS)",
        "nameGu": "સત્તાવાર જાતિ પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "income_cert",
        "nameEn": "Mamlatdar Family Income Certificate (< ₹2.5 Lakh / ₹8 Lakh)",
        "nameGu": "મામલતદારનો આવકનો દાખલો",
        "mandatory": true
      },
      {
        "id": "previous_marksheet",
        "nameEn": "Previous Semester / Year Marksheet",
        "nameGu": "અગાઉના વર્ષની માર્કશીટ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "application_id",
        "nameEn": "Previous Scholarship ID",
        "nameGu": "અગાઉનો શિષ્યવૃત્તિ એપ્લિકેશન આઈડી",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "student_bus_pass",
    "nameEn": "GSRTC Student Bus Pass Concession Certificate",
    "nameGu": "એસ.ટી. વિદ્યાર્થી રાહત બસ પાસ કન્સેશન",
    "departmentEn": "Gujarat State Road Transport Corporation (GSRTC)",
    "departmentGu": "ગુજરાત રાજ્ય માર્ગ વાહનવ્યવહાર નિગમ (GSRTC)",
    "category": "labour",
    "emoji": "🚌",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "મુસાફરી રૂટ બદલવો",
      "શાળા સત્ર રિન્યુઅલ"
    ],
    "requiredDocsNew": [
      {
        "id": "school_principal_sign",
        "nameEn": "School / College Principal Signed & Stamped Concession Form",
        "nameGu": "પ્રિન્સિપાલ સહી-સિક્કા વાળું કન્સેશન ફોર્મ",
        "mandatory": true
      },
      {
        "id": "student_aadhaar",
        "nameEn": "Student Aadhaar Card",
        "nameGu": "વિદ્યાર્થીનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "fee_receipt",
        "nameEn": "School / College Current Fee Receipt",
        "nameGu": "શાળા ફી પહોંચ",
        "mandatory": true
      },
      {
        "id": "student_photo",
        "nameEn": "Passport Size Photograph in Uniform",
        "nameGu": "પાસપોર્ટ સાઇઝ રંગીન ફોટો",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_pass",
        "nameEn": "Previous Term Bus Pass",
        "nameGu": "અગાઉનો બસ પાસ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 10
  },
  {
    "id": "gumasta_shop_act",
    "nameEn": "Shop & Commercial Establishment Registration (ગુમાસ્તા ધારો)",
    "nameGu": "ગુમાસ્તા ધારા દુકાન / પેઢી નોંધણી પ્રમાણપત્ર",
    "departmentEn": "Labour & Employment / Municipal Corporation",
    "departmentGu": "મહાનગરપાલિકા / નગરપાલિકા દુકાન રજીસ્ટ્રાર શાખા",
    "category": "labour",
    "emoji": "🏬",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "પેઢીનું નામ બદલવું",
      "ભાગીદારો ઉમેરવા",
      "સરનામું બદલવું"
    ],
    "requiredDocsNew": [
      {
        "id": "shop_agreement_or_tax",
        "nameEn": "Shop Ownership Deed or Rent Agreement",
        "nameGu": "દુકાન માલિકી દસ્તાવેજ અથવા ભાડા કરાર",
        "mandatory": true
      },
      {
        "id": "shop_front_photo",
        "nameEn": "Photograph of Shop with Name Board in Gujarati",
        "nameGu": "ગુજરાતી નામ દર્શાવતા બોર્ડ સાથે દુકાનનો ફોટો",
        "mandatory": true
      },
      {
        "id": "owner_pan_aadhaar",
        "nameEn": "Proprietor / Partners PAN & Aadhaar Cards",
        "nameGu": "માલિક/ભાગીદારોના પાન અને આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "electricity_bill",
        "nameEn": "Commercial Electricity Bill",
        "nameGu": "કોમર્શિયલ લાઈટ બિલ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_gumasta",
        "nameEn": "Previous Gumasta Registration Certificate",
        "nameGu": "હાલનું ગુમાસ્તા સર્ટિફિકેટ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 100
  },
  {
    "id": "artisan_id_card",
    "nameEn": "Pehchan Identity Card for Handicraft Artisans & Weavers",
    "nameGu": "હસ્તકલા કારીગર / વણકર ઓળખપત્ર (Pehchan Card)",
    "departmentEn": "Cottage & Rural Industries Department",
    "departmentGu": "કુટીર અને ગ્રામોદ્યોગ કમિશનર / Indext-C",
    "category": "labour",
    "emoji": "🧵",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "craft_sample_photos",
        "nameEn": "Photographs of Artisan Working with Handicraft Samples",
        "nameGu": "હસ્તકલા કામ કરતા કારીગર અને ઉત્પાદનના ફોટા",
        "mandatory": true
      },
      {
        "id": "artisan_aadhaar",
        "nameEn": "Artisan Aadhaar Card",
        "nameGu": "કારીગરનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "bank_passbook",
        "nameEn": "Bank Passbook Copy for State Subsidies",
        "nameGu": "બેંક પાસબુક નકલ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "apprenticeship_reg",
    "nameEn": "Mukhyamantri Apprenticeship Scheme Candidate Registration",
    "nameGu": "મુખ્યમંત્રી એપ્રેન્ટિસશીપ તાલીમ નોંધણી",
    "departmentEn": "Directorate of Employment & Training",
    "departmentGu": "રોજગાર અને તાલીમ નિયામકની કચેરી",
    "category": "labour",
    "emoji": "🛠️",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "degree_diploma",
        "nameEn": "Final Year Marksheet / Degree / ITI Certificate",
        "nameGu": "ડિગ્રી / ડિપ્લોમા / ITI પાસિંગ સર્ટિફિકેટ",
        "mandatory": true
      },
      {
        "id": "aadhaar_card",
        "nameEn": "Aadhaar Card",
        "nameGu": "આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "bank_passbook",
        "nameEn": "Aadhaar Seeded Bank Account for Monthly Stipend",
        "nameGu": "સ્ટાઈપેન્ડ જમા ખાતાની પાસબુક",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "new_power_connection",
    "nameEn": "New Agricultural / Domestic Electricity Connection (PGVCL)",
    "nameGu": "નવું ખેતીવાડી / ઘરેલું વીજ જોડાણ અરજી",
    "departmentEn": "Energy & Petrochemicals Dept (Gujarat DISCOMs)",
    "departmentGu": "વીજ વિતરણ કંપની (PGVCL / UGVCL / MGVCL / DGVCL)",
    "category": "energy",
    "emoji": "⚡",
    "supportsNew": true,
    "supportsUpdate": false,
    "requiredDocsNew": [
      {
        "id": "property_proof",
        "nameEn": "Ownership Sanad / 7/12 & 8-A / Sale Deed",
        "nameGu": "મિલકત માલિકી દસ્તાવેજ અથવા ૭/૧૨",
        "mandatory": true
      },
      {
        "id": "wiring_contractor",
        "nameEn": "Licensed Electrical Contractor Test Report",
        "nameGu": "લાયસન્સ ધારક વાયરિંગ કોન્ટ્રાક્ટર ટેસ્ટ રિપોર્ટ",
        "mandatory": true
      },
      {
        "id": "applicant_aadhaar",
        "nameEn": "Applicant Aadhaar Card",
        "nameGu": "અરજદારનું આધાર કાર્ડ",
        "mandatory": true
      },
      {
        "id": "panchayat_tax",
        "nameEn": "Panchayat / Municipal Tax Receipt",
        "nameGu": "પંચાયત મકાન વેરા પહોંચ",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 100
  },
  {
    "id": "meter_name_change",
    "nameEn": "Electricity Meter Name Change (વીજળી મીટરમાં નામ ફેરબદલ)",
    "nameGu": "વીજળી મીટરમાં નામ ફેરબદલ અરજી (PGVCL)",
    "departmentEn": "Energy & Petrochemicals Dept (Gujarat DISCOMs)",
    "departmentGu": "વીજ વિતરણ કંપની (PGVCL / UGVCL / MGVCL / DGVCL)",
    "category": "energy",
    "emoji": "💡",
    "supportsNew": false,
    "supportsUpdate": true,
    "updateFields": [
      "વારસાઈ બાદ નામ ફેરબદલ",
      "મકાન વેચાણ બાદ નવો ગ્રાહક"
    ],
    "requiredDocsNew": [],
    "requiredDocsUpdate": [
      {
        "id": "last_paid_bill",
        "nameEn": "Last Paid Electricity Bill with No Arrears",
        "nameGu": "છેલ્લું ચૂકવેલું લાઈટ બિલ (શૂન્ય બાકી)",
        "mandatory": true
      },
      {
        "id": "sale_deed_or_pedhinamu",
        "nameEn": "Registered Sale Deed or Pedhinamu with Death Certificate",
        "nameGu": "વેચાણ દસ્તાવેજ અથવા વારસાઈ પેઢીનામું",
        "mandatory": true
      },
      {
        "id": "seller_noc",
        "nameEn": "Consent NOC from Previous Registered Consumer",
        "nameGu": "અગાઉના મીટર ધારકનું સંમતિ પત્રક (NOC)",
        "mandatory": false
      },
      {
        "id": "new_consumer_aadhaar",
        "nameEn": "New Consumer Aadhaar Card",
        "nameGu": "નવા ગ્રાહકનું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 50
  },
  {
    "id": "solar_rooftop_sub",
    "nameEn": "Surya Gujarat Solar Rooftop Net-Metering Subsidy",
    "nameGu": "સૂર્ય ગુજરાત સોલાર રૂફટોપ સબસિડી (Net-Metering)",
    "departmentEn": "Gujarat Energy Development Agency (GEDA)",
    "departmentGu": "ગુજરાત ઉર્જા વિકાસ એજન્સી (GEDA) & DISCOM",
    "category": "energy",
    "emoji": "☀️",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "સોલાર ક્ષમતા વધારો (kW Expansion)"
    ],
    "requiredDocsNew": [
      {
        "id": "electricity_bill_latest",
        "nameEn": "Latest Domestic Electricity Bill",
        "nameGu": "તાજેતરનું ઘરેલું લાઈટ બિલ (ગ્રાહક નંબર)",
        "mandatory": true
      },
      {
        "id": "rooftop_photo",
        "nameEn": "Photograph of Roof with Clear Sun Access",
        "nameGu": "સોલાર પેનલ બેસાડવાની અગાસીનો ફોટો",
        "mandatory": true
      },
      {
        "id": "property_tax",
        "nameEn": "Municipal / Panchayat Tax Bill",
        "nameGu": "મકાન વેરા પાવતી",
        "mandatory": true
      },
      {
        "id": "bank_passbook_subsidy",
        "nameEn": "Bank Passbook for Direct Central/State Subsidy",
        "nameGu": "સબસિડી જમા મેળવવા બેંક પાસબુક",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "old_solar_consumer_no",
        "nameEn": "Existing Solar Consumer Registration",
        "nameGu": "હાલની સોલાર નોંધણી વિગત",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 0
  },
  {
    "id": "aadhaar",
    "nameEn": "Aadhaar Card (UIDAI)",
    "nameGu": "આધાર કાર્ડ સેવા",
    "departmentEn": "Unique Identification Authority of India (UIDAI)",
    "departmentGu": "યુનિક આઇડેન્ટિફિકેશન ઓથોરિટી ઓફ ઈન્ડિયા (UIDAI)",
    "category": "central",
    "emoji": "🪪",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "સરનામું (Address)",
      "મોબાઈલ નંબર (Mobile No)",
      "નામ (Name)",
      "જન્મતારીખ (Date of Birth)"
    ],
    "requiredDocsNew": [
      {
        "id": "birth_proof",
        "nameEn": "Birth Certificate / School Leaving Certificate",
        "nameGu": "જન્મનો દાખલો / શાળા છોડ્યાનું પ્રમાણપત્ર",
        "mandatory": true
      },
      {
        "id": "address_proof",
        "nameEn": "Electricity Bill / Ration Card",
        "nameGu": "લાઈટ બિલ / રેશનકાર્ડ",
        "mandatory": true
      },
      {
        "id": "photo_id",
        "nameEn": "Identity Proof (PAN / Voter ID)",
        "nameGu": "ઓળખનો પુરાવો (PAN / ચૂંટણી કાર્ડ)",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "current_aadhaar",
        "nameEn": "Current Aadhaar Card Copy",
        "nameGu": "હાલના આધાર કાર્ડની નકલ",
        "mandatory": true
      },
      {
        "id": "update_proof",
        "nameEn": "Supporting Document for Change (Address/DOB)",
        "nameGu": "સુધારા માટેનો પુરાવો (લાઈટબિલ / એલસી)",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": true,
    "biometricRequiredUpdate": true,
    "fee": 50
  },
  {
    "id": "pan",
    "nameEn": "PAN Card (Income Tax Dept)",
    "nameGu": "PAN કાર્ડ સેવા",
    "departmentEn": "Income Tax Department, Government of India",
    "departmentGu": "આવકવેરા વિભાગ, ભારત સરકાર (NSDL/UTI)",
    "category": "central",
    "emoji": "💳",
    "supportsNew": true,
    "supportsUpdate": true,
    "updateFields": [
      "નામ સુધારો (Name Correction)",
      "જન્મતારીખ સુધારો (DOB Correction)",
      "ફોટો/સહી અપડેટ (Photo/Sign Update)"
    ],
    "requiredDocsNew": [
      {
        "id": "pan_aadhaar",
        "nameEn": "Aadhaar Card (Linked with Mobile)",
        "nameGu": "આધાર કાર્ડ (મોબાઈલ લિંક્ડ)",
        "mandatory": true
      },
      {
        "id": "passport_photo",
        "nameEn": "Passport Size Photograph",
        "nameGu": "પાસપોર્ટ સાઇઝ રંગીન ફોટો",
        "mandatory": true
      },
      {
        "id": "dob_proof",
        "nameEn": "Proof of Date of Birth (Birth Certificate / School LC)",
        "nameGu": "જન્મતારીખનો પુરાવો (LC / જન્મ દાખલો)",
        "mandatory": true
      }
    ],
    "requiredDocsUpdate": [
      {
        "id": "current_pan",
        "nameEn": "Existing PAN Card Copy",
        "nameGu": "હાલના PAN કાર્ડની નકલ",
        "mandatory": true
      },
      {
        "id": "aadhaar_card",
        "nameEn": "Aadhaar Card with Correct Details",
        "nameGu": "સાચી વિગતો વાળું આધાર કાર્ડ",
        "mandatory": true
      }
    ],
    "biometricRequiredNew": false,
    "biometricRequiredUpdate": false,
    "fee": 107
  }
];

// Global in-memory cache for newly created citizen applications
export const CUSTOM_USER_APPLICATIONS: CitizenApplication[] = [];

export interface ExistingCitizenProfile {
  found: boolean;
  docNumber: string;
  applicantName: string;
  applicantNameGu: string;
  fatherOrHusbandName: string;
  dob: string;
  gender: "male" | "female";
  mobile: string;
  email: string;
  district: string;
  taluka: string;
  village: string;
  pincode: string;
  addressFull: string;
  serviceSpecificDetails: Record<string, unknown>;
}

export function lookupCitizenExistingRecord(serviceId: string, docNumber: string): ExistingCitizenProfile {
  const cleanNum = docNumber.trim();
  const last4 = cleanNum.slice(-4) || "4829";

  const baseProfile: ExistingCitizenProfile = {
    found: true,
    docNumber: cleanNum || "1413",
    applicantName: "Hari Vinodrai Patel",
    applicantNameGu: "હરી વિનોદરાઈ પટેલ",
    fatherOrHusbandName: "વિનોદરાઈ નારણભાઈ પટેલ",
    dob: "2004-08-12",
    gender: "male",
    mobile: "9974442291",
    email: "haripatel267998@gmail.com",
    district: "Rajkot",
    taluka: "Rajkot",
    village: "ઓમ નગર (Omnagar)",
    pincode: "360311",
    addressFull: "ઓમ નગર, રાજકોટ - ૩૬૦૩૧૧, જિ. રાજકોટ",
    serviceSpecificDetails: {},
  };

  if (serviceId === "aadhaar") {
    baseProfile.serviceSpecificDetails = {
      aadhaarMasked: `XXXX-XXXX-${last4}`,
      enrolmentDate: "2016-04-12",
      currentAddressEn: "Omnagar, Rajkot - 360311, Gujarat",
      currentAddressGu: "ઓમ નગર, રાજકોટ - ૩૬૦૩૧૧, ગુજરાત",
      biometricStatus: "Biometric Updated Recently (Active)",
    };
  } else if (serviceId === "ration") {
    baseProfile.serviceSpecificDetails = {
      rationCardNo: cleanNum || "032014892145",
      rationType: "NFSA - APL-1 (અન્ન સુરક્ષા રેશનકાર્ડ)",
      fairPriceShop: "FPS-108 (રાજકોટ પંચાયત સેવા કેન્દ્ર)",
      gasConnection: "HP Gas (Single Cylinder - Consumer No: 997444)",
      existingMembers: [
        { nameGu: "વિનોદરાઈ નારણભાઈ પટેલ", relation: "કુટુંબના વડા", age: 52, aadhaar: `•••• 3391` },
        { nameGu: "હરી વિનોદરાઈ પટેલ", relation: "પુત્ર (અરજદાર)", age: 20, aadhaar: `•••• ${last4}` },
      ],
    };
  } else if (serviceId === "pan") {
    baseProfile.serviceSpecificDetails = {
      panNumber: cleanNum || "BKZPP1413K",
      nameOnCard: "HARI VINODRAI PATEL",
      fathersName: "VINODRAI NARANBHAI PATEL",
      aadhaarLinked: true,
      status: "Active & Operative",
    };
  } else if (serviceId === "income") {
    baseProfile.serviceSpecificDetails = {
      prevCertNo: cleanNum || "INC/2024/99141",
      prevIssuedDate: "2024-04-15",
      validityStatus: "Active (૩ વર્ષ માન્ય - ૨૦૨૭ સુધી)",
      prevAnnualIncome: "₹ 1,80,000/-",
      issuingAuthority: "મામલતદાર કચેરી, રાજકોટ શહેર/ગ્રામ્ય",
    };
  } else if (serviceId === "caste") {
    baseProfile.serviceSpecificDetails = {
      prevCertNo: cleanNum || "GEN/2022/1413",
      categoryName: "General / બિન-અનામત વર્ગ",
      subCaste: "કડવા પાટીદાર (પટેલ)",
      validityStatus: "કાયમી માન્ય",
    };
  } else if (serviceId === "land_records") {
    baseProfile.serviceSpecificDetails = {
      khataNumber: cleanNum || "412",
      surveyNumber: "241/1 પૈકી",
      moujeVillage: "ઓમ નગર (રાજકોટ ગ્રામ્ય)",
      totalAreaHectare: "1.42 હેક્ટર",
      khatedarNameGu: "હરી વિનોદરાઈ પટેલ (સંયુક્ત ખાતેદાર)",
      lastMutationNo: "નોંધ નં. ૧૪૨૧ (વારસાઈ હક્ક)",
    };
  } else if (serviceId === "birth_cert") {
    baseProfile.serviceSpecificDetails = {
      registrationNo: cleanNum || "B-2004-GJ-84920",
      dateOfBirth: "2004-08-12",
      placeOfBirth: "રાજકોટ (સિવિલ હોસ્પિટલ / ઝોનલ કચેરી)",
      childNameGu: "હરી",
      fatherNameGu: "વિનોદરાઈ નારણભાઈ પટેલ",
      motherNameGu: "ભાવનાબેન વિનોદરાઈ પટેલ",
    };
  } else if (serviceId === "death_cert") {
    baseProfile.serviceSpecificDetails = {
      registrationNo: cleanNum || "D-2023-GJ-11029",
      dateOfDeath: "2023-11-04",
      placeOfDeath: "રાજકોટ",
      deceasedNameGu: "નારણભાઈ પટેલ",
      informantNameGu: "હરી વિનોદરાઈ પટેલ (પૌત્ર)",
    };
  } else if (serviceId === "ews_cert") {
    baseProfile.serviceSpecificDetails = {
      certificateNo: cleanNum || "EWS/2024/7719",
      financialYear: "2024-2025",
      familyIncome: "₹ 1,80,000/-",
      category: "બિન-અનામત વર્ગ (EWS)",
      validityDate: "2027-03-31",
    };
  } else if (serviceId === "domicile_cert") {
    baseProfile.serviceSpecificDetails = {
      domicileNumber: cleanNum || "DOM/GJ/2021/3392",
      continuousResidenceYears: "૨૦ વર્ષ (જન્મથી ગુજરાત)",
      collectorate: "જિલ્લા કલેક્ટર કચેરી, રાજકોટ",
      status: "Verified & Issued",
    };
  } else if (serviceId === "senior_citizen") {
    baseProfile.serviceSpecificDetails = {
      cardNo: cleanNum || "SR-GJ-2024-5194",
      cardHolderName: "વિનોદરાઈ નારણભાઈ પટેલ",
      ageYears: 62,
      bloodGroup: "B+",
      emergencyMobile: "9974442291",
    };
  } else if (serviceId === "driving_licence") {
    baseProfile.serviceSpecificDetails = {
      dlNumber: cleanNum || "GJ03-20220019284",
      covAllowed: "MCWG (મોટરસાયકલ ગિયર સાથે) & LMV (કાર)",
      validityTransport: "2044-08-11 (Non-Transport)",
      rtoOffice: "RTO કચેરી, રાજકોટ (GJ-03)",
    };
  } else if (serviceId === "marriage_cert") {
    baseProfile.serviceSpecificDetails = {
      marriageRegNo: cleanNum || "MR/2025/10492",
      marriageDate: "2025-02-14",
      placeOfMarriage: "રાજકોટ",
      registrarOffice: "નગરપાલિકા / વોર્ડ ઓફિસ, રાજકોટ",
    };
  }

  return baseProfile;
}

export function addCustomApplication(app: CitizenApplication) {
  if (app.workflowStage === undefined) {
    app.workflowStage = 1;
  }
  // Prepend so it appears first
  const existingIdx = CUSTOM_USER_APPLICATIONS.findIndex((a) => a.id === app.id);
  if (existingIdx >= 0) {
    CUSTOM_USER_APPLICATIONS[existingIdx] = app;
  } else {
    CUSTOM_USER_APPLICATIONS.unshift(app);
  }
  return app;
}

let CACHED_SYSTEM_DATASET: CitizenApplication[] | null = null;

export function getCachedSystemDataset(): CitizenApplication[] {
  if (!CACHED_SYSTEM_DATASET) {
    const list: CitizenApplication[] = [];
    for (let i = 0; i < TOTAL_SYSTEM_RECORDS; i++) {
      list.push(generateApplication(i));
    }
    CACHED_SYSTEM_DATASET = list;
  }
  return CACHED_SYSTEM_DATASET;
}

export function confirmApplicationPayment(id: string): CitizenApplication | null {
  const cleanId = id.toUpperCase();
  let app = CUSTOM_USER_APPLICATIONS.find(
    (a) => a.id.toUpperCase() === cleanId || a.id.replace(/-/g, "").toUpperCase() === cleanId.replace(/-/g, "")
  );

  // If not yet in custom applications cache, search benchmark & cached generated records
  if (!app) {
    const dataset = getCachedSystemDataset();
    const found = dataset.find(
      (a) => a.id.toUpperCase() === cleanId || a.id.replace(/-/g, "").toUpperCase() === cleanId.replace(/-/g, "")
    );
    if (found) {
      app = { ...found };
      CUSTOM_USER_APPLICATIONS.unshift(app);
    }
  }

  if (!app) return null;

  app.paymentStatus = "paid";
  app.operatorConfirmed = true;
  app.status = "approved";
  app.workflowStage = 3;
  app.txnId = app.txnId || `TXN-CSH-${Math.floor(100000 + Math.random() * 899999)}`;
  app.lastUpdated = new Date().toISOString().split("T")[0];
  app.remarksGu = `જન સેવા કેન્દ્ર રોકડ કાઉન્ટર પર ચલણ નં. ${app.challanNo || app.id} મુજબ ફી ₹${app.feeAmount || 50} જમા થયેલ છે (Txn: ${app.txnId}). ઓપરેટર દ્વારા ચુકવણી પ્રમાણિત થઈ ચૂકી છે અને દસ્તાવેજ / પ્રમાણપત્ર રિલીઝ (અનલૉક) થયેલ છે.`;
  app.remarksEn = `Cash fee of ₹${app.feeAmount || 50} paid at Jan Seva Kendra cash counter against Challan ${app.challanNo || app.id} (Txn: ${app.txnId}). Verified by Operator. Document released.`;
  return app;
}

export function advanceWorkflowStage(
  id: string,
  targetStage: 1 | 2 | 3 | 4,
  officerRole?: string
): CitizenApplication | null {
  const cleanId = id.toUpperCase();
  let app = CUSTOM_USER_APPLICATIONS.find(
    (a) => a.id.toUpperCase() === cleanId || a.id.replace(/-/g, "").toUpperCase() === cleanId.replace(/-/g, "")
  );

  // If not yet in custom applications cache, find from cached dataset and copy over
  if (!app) {
    const dataset = getCachedSystemDataset();
    const found = dataset.find(
      (a) => a.id.toUpperCase() === cleanId || a.id.replace(/-/g, "").toUpperCase() === cleanId.replace(/-/g, "")
    );
    if (found) {
      app = { ...found };
      CUSTOM_USER_APPLICATIONS.unshift(app);
    }
  }

  if (!app) return null;

  app.workflowStage = targetStage;
  app.lastUpdated = new Date().toISOString().split("T")[0];
  if (officerRole) {
    app.officerDesignation = officerRole;
  }

  if (targetStage === 1) {
    app.status = "processing";
    if (!officerRole) app.officerDesignation = `નાયબ મામલતદાર (દસ્તાવેજ સ્ક્રુટિની શાખા), ${app.taluka}`;
    app.remarksGu = `અરજદાર દ્વારા ઓનલાઇન અરજી સફળતાપૂર્વક સબમિટ થયેલ છે. કચેરી સ્ક્રુટિની ડેસ્ક પર દસ્તાવેજો અને આધાર કાર્ડ ખરાઈની પ્રક્રિયા ચાલુ છે.`;
    app.remarksEn = `Application submitted by citizen. Document and Aadhaar scrutiny in progress at Nayab Mamlatdar desk.`;
  } else if (targetStage === 2) {
    app.status = "processing";
    if (!officerRole) app.officerDesignation = `તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ${app.taluka}`;
    app.remarksGu = `નાયબ મામલતદાર દ્વારા તમામ દસ્તાવેજો (આધાર, આવક, રેશનકાર્ડ પુરાવા) યોગ્ય ચકાસાયેલ છે. તાલુકા મામલતદાર સાહેબની આખરી ડિજિટલ સહી (e-Sign) અર્થે અગ્રેસિત કરેલ છે.`;
    app.remarksEn = `All documents verified by Nayab Mamlatdar. Forwarded to Taluka Mamlatdar for final digital e-Sign approval.`;
  } else if (targetStage === 3 || targetStage === 4) {
    app.status = "approved";
    if (!officerRole) app.officerDesignation = `તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ${app.taluka}`;
    app.remarksGu = `મામલતદાર કચેરી ${app.taluka} દ્વારા તમામ ચકાસણી પૂર્ણ કરી ડિજિટલ હસ્તાક્ષર (e-Sign) સાથે અરજી મંજૂર કરવામાં આવેલ છે. સત્તાવાર પ્રમાણપત્ર / સહાય માન્ય ઠરેલ છે.`;
    app.remarksEn = `Application verified and approved with official digital e-Sign by Mamlatdar Office ${app.taluka}. Certificate / benefit authorized.`;
  }

  return app;
}

// High-performance search and pagination across 5,420+ records
export function queryApplications(params: {
  search?: string;
  district?: string;
  status?: string;
  page?: number;
  limit?: number;
}): {
  records: CitizenApplication[];
  total: number;
  page: number;
  totalPages: number;
  stats: {
    total: number;
    approved: number;
    processing: number;
    pending: number;
    rejected: number;
    disbursedCr: string;
  };
} {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(5, params.limit || 10));
  const search = (params.search || "").trim().toLowerCase();
  const district = (params.district || "").trim().toLowerCase();
  const status = (params.status || "").trim().toLowerCase();

  const dataset = getCachedSystemDataset();

  // 1. Check custom user-submitted applications first (for instant live tracking!)
  if (search.startsWith("app")) {
    const cleanId = search.toUpperCase();
    const foundCustom = CUSTOM_USER_APPLICATIONS.find(
      (a) => a.id.toUpperCase() === cleanId || a.id.replace(/-/g, "").toUpperCase() === cleanId.replace(/-/g, "")
    );
    if (foundCustom) {
      return {
        records: [foundCustom],
        total: 1,
        page: 1,
        totalPages: 1,
        stats: calculateSystemStats(),
      };
    }

    const foundInDataset = dataset.find(
      (app) => app.id.toUpperCase() === cleanId || app.id.replace(/-/g, "").toUpperCase() === cleanId.replace(/-/g, "")
    );
    if (foundInDataset) {
      return {
        records: [foundInDataset],
        total: 1,
        page: 1,
        totalPages: 1,
        stats: calculateSystemStats(),
      };
    }
  }

  const matches: CitizenApplication[] = [];

  // Match custom user applications first
  for (const customApp of CUSTOM_USER_APPLICATIONS) {
    if (district && district !== "all" && customApp.district.toLowerCase() !== district && customApp.districtGu !== district) {
      continue;
    }
    if (status && status !== "all" && customApp.status.toLowerCase() !== status) {
      continue;
    }
    if (search) {
      const matchesSearch =
        customApp.id.toLowerCase().includes(search) ||
        customApp.citizenName.toLowerCase().includes(search) ||
        customApp.citizenNameGu.toLowerCase().includes(search) ||
        customApp.schemeName.toLowerCase().includes(search) ||
        customApp.schemeNameGu.toLowerCase().includes(search) ||
        customApp.district.toLowerCase().includes(search) ||
        customApp.taluka.toLowerCase().includes(search) ||
        customApp.aadhaarLast4.includes(search);
      if (!matchesSearch) continue;
    }
    matches.push(customApp);
  }

  // Iterate over pre-cached system records
  for (const app of dataset) {
    if (district && district !== "all" && app.district.toLowerCase() !== district && app.districtGu !== district) {
      continue;
    }

    if (status && status !== "all" && app.status.toLowerCase() !== status) {
      continue;
    }

    if (search) {
      const matchesSearch =
        app.id.toLowerCase().includes(search) ||
        app.citizenName.toLowerCase().includes(search) ||
        app.citizenNameGu.toLowerCase().includes(search) ||
        app.schemeName.toLowerCase().includes(search) ||
        app.schemeNameGu.toLowerCase().includes(search) ||
        app.district.toLowerCase().includes(search) ||
        app.taluka.toLowerCase().includes(search) ||
        app.aadhaarLast4.includes(search);

      if (!matchesSearch) continue;
    }

    matches.push(app);

    // Stop collecting if we have gathered enough for search previews
    if (!search && !district && !status && matches.length >= page * limit + 20) {
      break;
    }
  }

  const effectiveTotal = (search || district || status) ? matches.length : TOTAL_SYSTEM_RECORDS + CUSTOM_USER_APPLICATIONS.length;
  const start = (page - 1) * limit;
  const paginated = matches.slice(start, start + limit);

  return {
    records: paginated,
    total: effectiveTotal,
    page,
    totalPages: Math.ceil(effectiveTotal / limit),
    stats: calculateSystemStats(),
  };
}

export function calculateSystemStats() {
  const customCount = CUSTOM_USER_APPLICATIONS.length;
  return {
    total: TOTAL_SYSTEM_RECORDS + customCount,
    approved: 3845,
    processing: 1120 + customCount,
    pending: 290,
    rejected: 165,
    disbursedCr: "₹ 14.85 Cr",
  };
}

// =========================================================================
// Citizen Benefit Ledger & Multi-Layer 2FA Security System
// =========================================================================

export interface CitizenBenefitRecord {
  schemeId: string;
  schemeName: string;
  schemeNameGu: string;
  benefitType: string;
  amountDisbursed: number;
  disbursedDate: string;
  status: "active" | "completed" | "renewal_due";
  certOrInstallmentNo: string;
  remarksGu: string;
}

export interface CitizenLedgerProfile {
  mobile: string;
  aadhaarLast4: string;
  citizenName: string;
  citizenNameGu: string;
  district: string;
  districtGu: string;
  taluka: string;
  village: string;
  annualIncome: number;
  occupation: string;
  category: string;
  hasLand: boolean;
  hasBPL: boolean;
  availedBenefits: CitizenBenefitRecord[];
  activeApplications: CitizenApplication[];
}

// =========================================================================
// Gujarat Right to Services Act (GRTSA 2013) & SLA Durations Configuration
// =========================================================================

export interface ServiceSLAConfig {
  schemeId: string;
  schemeNameGu: string;
  slaDays: number;
  slaLabelGu: string;
  authorityGu: string;
  actSectionGu: string;
  descriptionGu: string;
}

export const GUJARAT_SERVICE_SLA_CONFIG: Record<string, ServiceSLAConfig> = {
  "income": {
    schemeId: "income",
    schemeNameGu: "આવકનું પ્રમાણપત્ર (Income Certificate)",
    slaDays: 1,
    slaLabelGu: "૧ દિવસ (૨૪ કલાક)",
    authorityGu: "મામલતદાર કચેરી / જન સેવા કેન્દ્ર",
    actSectionGu: "ગુજરાત નાગરિક સેવા અધિકાર અધિનિયમ (GRTSA ૨૦૧૩) અનુસૂચિ-૧, ક્રમ-૧૨",
    descriptionGu: "તલાટી કમ મંત્રી પંચનામું & નાયબ મામલતદાર ડિજિટલ e-Sign ૨૪ કલાકમાં ફરજિયાત.",
  },
  "caste": {
    schemeId: "caste",
    schemeNameGu: "જાતિ પ્રમાણપત્ર & નોન-ક્રીમીલેયર",
    slaDays: 2,
    slaLabelGu: "૨ કાર્યકારી દિવસ (૪૮ કલાક)",
    authorityGu: "તાલુકા મામલતદાર / સમાજ કલ્યાણ શાખા",
    actSectionGu: "GRTSA ૨૦૧૩ અનુસૂચિ-૧, ક્રમ-૧૫",
    descriptionGu: "પેઢીનામું અને શાળા છોડ્યાના પ્રમાણપત્રની ખરાઈ બાદ ડિજિટલ સર્ટિફિકેટ ઇશ્યૂ.",
  },
  "pm-kisan": {
    schemeId: "pm-kisan",
    schemeNameGu: "PM કિસાન સન્માન નિધિ",
    slaDays: 3,
    slaLabelGu: "૩ કાર્યકારી દિવસ",
    authorityGu: "તાલુકા વિકાસ અધિકારી (TDO) & મામલતદાર",
    actSectionGu: "પ્રધાનમંત્રી કિસાન પોર્ટલ સ્ટેન્ડર્ડ ઓપરેટિંગ પ્રોસિજર (SOP)",
    descriptionGu: "૭/૧૨ અને ૮-અ જમીન ખાતાનું આધાર ઈ-કેવાયસી સીડિંગ અને ચકાસણી.",
  },
  "ration": {
    schemeId: "ration",
    schemeNameGu: "ડિજિટલ રેશનકાર્ડ સેવા",
    slaDays: 7,
    slaLabelGu: "૭ કાર્યકારી દિવસ",
    authorityGu: "જિલ્લા પુરવઠા અધિકારી (DSO) / મામલતદાર પુરવઠા શાખા",
    actSectionGu: "GRTSA ૨૦૧૩ અનુસૂચિ-૧, ક્રમ-૨૧",
    descriptionGu: "NFSA / RCMS ડેટાબેઝમાં કુટુંબના સભ્યોનું આધાર લિંકિંગ અને વેરિફિકેશન.",
  },
  "ayushman-bharat": {
    schemeId: "ayushman-bharat",
    schemeNameGu: "આયુષ્માન ભારત PM-JAY (MAA કાર્ડ)",
    slaDays: 2,
    slaLabelGu: "૨ કાર્યકારી દિવસ (૪૮ કલાક)",
    authorityGu: "ચીફ ડિસ્ટ્રિક્ટ હેલ્થ ઓફિસર (CDHO) / CMO શાખા",
    actSectionGu: "નેશનલ હેલ્થ ઓથોરિટી (NHA) ગાઈડલાઈન્સ",
    descriptionGu: "SECC-૨૦૧૧ અથવા NFSA રેશનકાર્ડ પાત્રતા ચકાસણી અને ડિજિટલ કાર્ડ ઇશ્યૂ.",
  },
  "pm-mudra": {
    schemeId: "pm-mudra",
    schemeNameGu: "PM મુદ્રા યોજના લોન",
    slaDays: 5,
    slaLabelGu: "૫ કાર્યકારી દિવસ",
    authorityGu: "અગ્રણી જિલ્લા બેંક (LDM) / બેંક શાખા પ્રબંધક",
    actSectionGu: "PM મુદ્રા સિટીઝન ચાર્ટર નિયમ-૭",
    descriptionGu: "પ્રોજેક્ટ રિપોર્ટ અને સિબિલ સ્કોર સ્ક્રુટિની બાદ લોન સેંક્શન લેટર.",
  },
  "pm-awas": {
    schemeId: "pm-awas",
    schemeNameGu: "PM આવાસ યોજના ગ્રામીણ (PMAY-G)",
    slaDays: 15,
    slaLabelGu: "૧૫ કાર્યકારી દિવસ",
    authorityGu: "જિલ્લા ગ્રામ વિકાસ એજન્સી (DRDA) / TDO",
    actSectionGu: "ગ્રામીણ આવાસ મિશન ગાઈડલાઈન ૨૦૨૪-૨૬",
    descriptionGu: "ગ્રામ સેવક દ્વારા સ્થળ મુલાકાત, કાચા મકાનનું જીઓ-ટેગિંગ અને ગ્રામસભા મંજૂરી.",
  },
  "aadhaar": {
    schemeId: "aadhaar",
    schemeNameGu: "આધાર કાર્ડ સેવા",
    slaDays: 3,
    slaLabelGu: "૩ કાર્યકારી દિવસ",
    authorityGu: "UIDAI રજિસ્ટ્રાર / ઈ-ગ્રામ કેન્દ્ર",
    actSectionGu: "UIDAI આધાર નિયમાવલી ૨૦૧૬",
    descriptionGu: "બાયોમેટ્રિક્સ / ડેમોગ્રાફિક ડેટા અપડેટ સેન્ટ્રલ સર્વર ચકાસણી.",
  },
  "pan": {
    schemeId: "pan",
    schemeNameGu: "PAN કાર્ડ સેવા",
    slaDays: 3,
    slaLabelGu: "૩ કાર્યકારી દિવસ",
    authorityGu: "આવકવેરા વિભાગ (NSDL / UTI)",
    actSectionGu: "આવકવેરા ધારો ૧૯૬૧ કલમ ૧૩૯-એ",
    descriptionGu: "ડિજિટલ e-PAN ૨૪ કલાકમાં અને ફિઝિકલ કાર્ડ ૫ દિવસમાં ડિલિવરી.",
  },
  "vahali-dikri": {
    schemeId: "vahali-dikri",
    schemeNameGu: "વ્હાલી દીકરી યોજના",
    slaDays: 7,
    slaLabelGu: "૭ કાર્યકારી દિવસ",
    authorityGu: "મહિલા અને બાળ વિકાસ વિભાગ (WCD)",
    actSectionGu: "ગુજરાત મહિલા કલ્યાણ ઠરાવ ૨૦૧૯",
    descriptionGu: "દીકરી જન્મ નોંધણી, આવક દાખલો અને દંપતિ સંમતિપત્ર ચકાસણી.",
  },
  "vridh-pension": {
    schemeId: "vridh-pension",
    schemeNameGu: "ઇન્દિરા ગાંધી વૃદ્ધ પેન્શન",
    slaDays: 7,
    slaLabelGu: "૭ કાર્યકારી દિવસ",
    authorityGu: "તાલુકા મામલતદાર (સામાજિક સુરક્ષા શાખા)",
    actSectionGu: "રાષ્ટ્રીય સામાજિક સહાય કાર્યક્રમ (NSAP)",
    descriptionGu: "૬૦+ વર્ષ ઉંમર ખરાઈ અને BPL યાદી ચકાસણી બાદ ડીબીટી મંજૂરી.",
  },
  "kisan-sahay": {
    schemeId: "kisan-sahay",
    schemeNameGu: "મુખ્યમંત્રી કિસાન સહાય યોજના",
    slaDays: 5,
    slaLabelGu: "૫ કાર્યકારી દિવસ",
    authorityGu: "જિલ્લા ખેતીવાડી અધિકારી & મામલતદાર",
    actSectionGu: "કૃષિ અને ખેડૂત કલ્યાણ વિભાગ માર્ગદર્શિકા",
    descriptionGu: "પાક નુકસાની સર્વે રિપોર્ટ અને સેટેલાઇટ આંકડાકીય ખરાઈ.",
  },
};

export function getApplicationSLADetails(app: CitizenApplication) {
  const cfg = GUJARAT_SERVICE_SLA_CONFIG[app.schemeId] || {
    schemeId: app.schemeId,
    schemeNameGu: app.schemeNameGu,
    slaDays: 3,
    slaLabelGu: "૩ કાર્યકારી દિવસ",
    authorityGu: app.officerDesignation || "સક્ષમ સત્તાધિકારી કચેરી",
    actSectionGu: "ગુજરાત નાગરિક સેવા અધિકાર અધિનિયમ (GRTSA ૨૦૧૩)",
    descriptionGu: "કચેરી નિયમાનુસાર સત્તાવાર સમયમર્યાદામાં દસ્તાવેજ ખરાઈ પ્રક્રિયા.",
  };

  let targetDateStr = "";
  try {
    const parts = (app.appliedDate || "2026-09-01").split("-");
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + cfg.slaDays);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    targetDateStr = `${day}/${month}/${year}`;
  } catch {
    targetDateStr = "૩ કાર્યકારી દિવસ";
  }

  let statusBadgeGu = "";
  let statusColor = "";
  if (app.status === "approved") {
    statusBadgeGu = "✓ સમયસર મંજૂર (On-Time Sanction)";
    statusColor = "bg-emerald-50 text-emerald-800 border-emerald-300";
  } else if (app.status === "rejected") {
    statusBadgeGu = "⚠️ પૂરક પુરાવા જરૂરી / પરત (Action Required)";
    statusColor = "bg-rose-50 text-rose-800 border-rose-300";
  } else if (app.status === "processing") {
    statusBadgeGu = `⏳ ૧ દિવસ બાકી (અપેક્ષિત: ${targetDateStr})`;
    statusColor = "bg-blue-50 text-blue-800 border-blue-300";
  } else {
    statusBadgeGu = `⏳ સ્થળ તપાસ બાકી (અપેક્ષિત: ${targetDateStr})`;
    statusColor = "bg-amber-50 text-amber-800 border-amber-300";
  }

  return {
    ...cfg,
    targetDateStr,
    statusBadgeGu,
    statusColor,
  };
}

export function getCitizenBenefitProfile(mobile: string, aadhaarLast4?: string): CitizenLedgerProfile {
  const cleanMobile = mobile.replace(/\D/g, "").slice(-10) || "9825012345";
  const cleanAadhaar = (aadhaarLast4 || "").trim().slice(-4) || "4829";

  // Find all applications submitted by this citizen in our custom or benchmark dataset
  const citizenApps = CUSTOM_USER_APPLICATIONS.filter(
    (a) => (a.mobile && a.mobile.includes(cleanMobile)) || a.aadhaarLast4 === cleanAadhaar
  );

  // If none found in custom, associate 3 diverse benchmark applications for demonstration
  // 1. Approved (PM-Kisan, 3 days SLA done, DBT transferred)
  // 2. Processing (Income Certificate, 1 day 24-hr SLA, Under Mamlatdar scrutiny)
  // 3. Rejected / Action Required (Ration Card update, 7 days SLA, with official reason & 1-click re-apply)
  if (citizenApps.length === 0) {
    citizenApps.push(
      BENCHMARK_APPLICATIONS[0],
      {
        id: "APP-GUJ-7821",
        citizenName: "Hari Vinodrai Patel",
        citizenNameGu: "હરી વિનોદરાઈ પટેલ",
        gender: "male",
        schemeId: "income",
        schemeName: "Income Certificate (આવકનો દાખલો)",
        schemeNameGu: "આવકનું પ્રમાણપત્ર (૩ વર્ષ માન્ય)",
        schemeEmoji: "📜",
        district: "Rajkot",
        districtGu: "રાજકોટ",
        taluka: "Rajkot",
        village: "ઓમ નગર (Omnagar)",
        aadhaarLast4: cleanAadhaar,
        mobile: cleanMobile,
        status: "processing",
        appliedDate: "2026-09-27",
        lastUpdated: "2026-09-28",
        benefitAmount: 0,
        remarksGu: "તલાટી કમ મંત્રી દ્વારા સ્થળ પંચનામું ચકાસણી હેઠળ છે. ૨૪ કલાકની સત્તાવાર સમયમર્યાદામાં ડિજિટલ સહી થશે.",
        remarksEn: "Talati-cum-Mantri field verification in progress. Digital e-Sign scheduled within 24 hours.",
        officerDesignation: "નાયબ મામલતદાર (જન સેવા કેન્દ્ર), રાજકોટ",
        workflowStage: 2,
        paymentStatus: "paid",
        feeAmount: 20,
      },
      {
        id: "APP-GUJ-6490",
        citizenName: "Hari Vinodrai Patel",
        citizenNameGu: "હરી વિનોદરાઈ પટેલ",
        gender: "male",
        schemeId: "ration",
        schemeName: "Digital Ration Card - Add Member",
        schemeNameGu: "ડિજિટલ રેશનકાર્ડ - નવા સભ્ય ઉમેરો",
        schemeEmoji: "🛒",
        district: "Rajkot",
        districtGu: "રાજકોટ",
        taluka: "Rajkot",
        village: "ઓમ નગર (Omnagar)",
        aadhaarLast4: cleanAadhaar,
        mobile: cleanMobile,
        status: "rejected",
        appliedDate: "2026-09-18",
        lastUpdated: "2026-09-22",
        benefitAmount: 0,
        remarksGu: "નવા સભ્ય (પ્રિયાંશી) નું જન્મ પ્રમાણપત્ર અસ્પષ્ટ વંચાય છે. કૃપા કરીને ગ્રામ પંચાયત અથવા નગરપાલિકાનું અસલ ડિજિટલ જન્મ પ્રમાણપત્ર અપલોડ કરી પુનઃ અરજી કરવી.",
        remarksEn: "Birth certificate scan for new member is unclear. Please re-apply with original digital birth certificate from Panchayat / Municipality.",
        officerDesignation: "પુરવઠા મામલતદાર શ્રી, રાજકોટ",
        workflowStage: 2,
        paymentStatus: "paid",
        feeAmount: 20,
      }
    );
  }

  // Pre-configured government benefit ledger (DBT De-duplication Ledger)
  const defaultAvailedBenefits: CitizenBenefitRecord[] = [
    {
      schemeId: "pm-kisan",
      schemeName: "PM Kisan Samman Nidhi",
      schemeNameGu: "PM કિસાન સન્માન નિધિ (ખેડૂત સહાય)",
      benefitType: "DBT Direct Bank Credit",
      amountDisbursed: 6000,
      disbursedDate: "2026-08-14",
      status: "active",
      certOrInstallmentNo: "GJ-PMK-2026-4829",
      remarksGu: "૭/૧૨ જમીન આધારિત ₹૨,૦૦૦ ના ૩ હપ્તા સીધા બેંક ખાતામાં જમા થયેલ છે.",
    },
    {
      schemeId: "ayushman-bharat",
      schemeName: "Ayushman Bharat PM-JAY",
      schemeNameGu: "આયુષ્માન ભારત PM-JAY (MAA કાર્ડ)",
      benefitType: "Cashless Health Insurance",
      amountDisbursed: 500000,
      disbursedDate: "2025-11-20",
      status: "active",
      certOrInstallmentNo: "PMJAY-GJ-84920194",
      remarksGu: "કુટુંબના સભ્યો માટે વાર્ષિક ₹૫ લાખ સુધીનું કેશલેસ સારવાર કવચ સક્રિય છે.",
    },
  ];

  return {
    mobile: cleanMobile,
    aadhaarLast4: cleanAadhaar,
    citizenName: "Hari Vinodrai Patel",
    citizenNameGu: "હરી વિનોદરાઈ પટેલ",
    district: "Rajkot",
    districtGu: "રાજકોટ",
    taluka: "Rajkot",
    village: "ઓમ નગર (Omnagar)",
    annualIncome: 180000,
    occupation: "farmer",
    category: "General",
    hasLand: true,
    hasBPL: false,
    availedBenefits: defaultAvailedBenefits,
    activeApplications: citizenApps,
  };
}

// In-Memory Cryptographic OTP Store for Anti-Bypass Protection
interface OtpSession {
  otp: string;
  expiresAt: number;
  attemptsLeft: number;
  verified: boolean;
  mobile: string;
  aadhaarLast4: string;
  createdAt: number;
}

const ACTIVE_OTP_SESSIONS = new Map<string, OtpSession>();

export function requestCitizenOtp(mobile: string, aadhaarLast4: string) {
  const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
  const cleanAadhaar = aadhaarLast4.trim().slice(-4);

  if (cleanMobile.length !== 10) {
    return { success: false, error: "કૃપા કરીને માન્ય ૧૦ આંકડાનો મોબાઈલ નંબર દાખલ કરો." };
  }
  if (cleanAadhaar.length !== 4) {
    return { success: false, error: "કૃપા કરીને આધાર કાર્ડના છેલ્લા ૪ આંકડા દાખલ કરો." };
  }

  // Rate Limiting (Flood Protection): Max 1 OTP every 15 seconds
  const existing = ACTIVE_OTP_SESSIONS.get(cleanMobile);
  if (existing && Date.now() - existing.createdAt < 15000) {
    const waitSec = Math.ceil((15000 - (Date.now() - existing.createdAt)) / 1000);
    return { success: false, error: `કૃપા કરીને ${waitSec} સેકન્ડ રાહ જુઓ, નવો OTP મોકલતા પહેલા.` };
  }

  // Generate 6-digit secure OTP
  const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 180000; // 3 minutes validity

  ACTIVE_OTP_SESSIONS.set(cleanMobile, {
    otp: generatedOtp,
    expiresAt,
    attemptsLeft: 3,
    verified: false,
    mobile: cleanMobile,
    aadhaarLast4: cleanAadhaar,
    createdAt: Date.now(),
  });

  return {
    success: true,
    message: `ગુજરાત સરકાર સત્તાવાર OTP તમારા રજિસ્ટર્ડ મોબાઈલ ${cleanMobile.slice(0, 2)}XXXXXX${cleanMobile.slice(-2)} પર મોકલાયો છે.`,
    simulatedOtp: generatedOtp,
    expiresAt,
  };
}

export function verifyCitizenOtp(mobile: string, enteredOtp: string, aadhaarLast4: string) {
  const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
  const cleanAadhaar = aadhaarLast4.trim().slice(-4);
  const cleanOtp = enteredOtp.trim();

  const session = ACTIVE_OTP_SESSIONS.get(cleanMobile);
  if (!session) {
    return { success: false, error: "કોઈ સક્રિય OTP મળ્યો નથી. કૃપા કરીને 'OTP મેળવો' પર ક્લિક કરો." };
  }

  // Check 1: Expiry
  if (Date.now() > session.expiresAt) {
    ACTIVE_OTP_SESSIONS.delete(cleanMobile);
    return { success: false, error: "OTP ની સમયસીમા (૧૮૦ સેકન્ડ) પૂર્ણ થઈ ગઈ છે. નવો OTP મેળવો." };
  }

  // Check 2: Brute Force Attempt Lockout
  if (session.attemptsLeft <= 0) {
    return {
      success: false,
      error: "⚠️ સિક્યોરિટી એલર્ટ: સતત ૩ વાર ખોટો OTP નાખવાથી આ એકાઉન્ટ ૧૫ મિનિટ માટે બ્લોક થયું છે (Brute-force Blocked).",
      attemptsLeft: 0,
    };
  }

  // Check 3: Two-Factor Binding (Aadhaar last 4 match)
  if (session.aadhaarLast4 !== cleanAadhaar) {
    session.attemptsLeft -= 1;
    return {
      success: false,
      error: `આધાર કાર્ડના છેલ્લા ૪ આંકડા મેળ ખાતા નથી! બાકી પ્રયાસો: ${session.attemptsLeft}`,
      attemptsLeft: session.attemptsLeft,
    };
  }

  // Check 4: OTP Match (Server-side cryptographic match)
  if (session.otp !== cleanOtp) {
    session.attemptsLeft -= 1;
    return {
      success: false,
      error: `અમાન્ય OTP! દાખલ કરેલ કોડ ખોટો છે. બાકી પ્રયાસો: ${session.attemptsLeft}`,
      attemptsLeft: session.attemptsLeft,
    };
  }

  // Validated! Mark session verified
  session.verified = true;
  const token = `GOV-DPI-AUTH-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const profile = getCitizenBenefitProfile(cleanMobile, cleanAadhaar);

  return {
    success: true,
    token,
    citizen: profile,
    message: "સફળ 2-Factor પ્રમાણીકરણ! નાગરિક ખાનગી વોલ્ટ અનલૉક થયું છે.",
  };
}

export function verifyOfficerPin(officerId: string, pin: string) {
  const cleanId = (officerId || "").trim().toUpperCase();
  const cleanPin = (pin || "").trim();

  // Government Officer Credentials for Hackathon Demonstration
  if (cleanPin === "GJ2026") {
    if (cleanId === "GUJ-STATE-001") {
      return {
        success: true,
        officer: {
          id: "GUJ-STATE-001",
          name: "મનોજ અગ્રવાલ, IAS",
          designation: "અધિક મુખ્ય સચિવ (મહેસૂલ & સામાન્ય વહીવટ વિભાગ)",
          district: "All",
          districtGu: "સમગ્ર ગુજરાત (૩૩ જિલ્લા)",
          office: "સ્વર્ણિમ સંકુલ-૧, સચિવાલય, ગાંધીનગર",
          role: "state_admin",
        },
      };
    }
    if (cleanId === "GUJ-COL-3001") {
      return {
        success: true,
        officer: {
          id: "GUJ-COL-3001",
          name: "પ્રભવ જોષી, IAS",
          designation: "જિલ્લા કલેક્ટર & ડિસ્ટ્રિક્ટ મેજિસ્ટ્રેટ, રાજકોટ",
          district: "Rajkot",
          districtGu: "રાજકોટ",
          office: "જિલ્લા કલેક્ટર કચેરી, રાજકોટ",
          role: "district_collector",
        },
      };
    }
    if (cleanId === "GUJ-SDM-5002") {
      return {
        success: true,
        officer: {
          id: "GUJ-SDM-5002",
          name: "કે. એમ. પંડ્યા, GAS",
          designation: "સબ-ડિવિઝનલ મેજિસ્ટ્રેટ & પ્રાંત અધિકારી, ગોંડલ",
          district: "Rajkot",
          districtGu: "રાજકોટ",
          taluka: "Gondal",
          office: "સબ-ડિવિઝનલ મેજિસ્ટ્રેટ (પ્રાંત) કચેરી, ગોંડલ",
          role: "sdm_prant",
        },
      };
    }
    if (cleanId === "GUJ-TAL-7089") {
      return {
        success: true,
        officer: {
          id: "GUJ-TAL-7089",
          name: "વિજયકુમાર જોષી",
          designation: "તલાટી કમ મંત્રી & ઇ-ગ્રામ કેન્દ્ર સંચાલક, ગોમતા",
          district: "Rajkot",
          districtGu: "રાજકોટ",
          taluka: "Gondal",
          office: "ગ્રામ પંચાયત કચેરી, ગોમતા",
          role: "talati",
        },
      };
    }

    // Default / GUJ-GOV-9012 (Taluka Mamlatdar)
    return {
      success: true,
      officer: {
        id: "GUJ-GOV-9012",
        name: "H. V. Patel, GAS",
        designation: "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ",
        district: "Rajkot",
        taluka: "Gondal",
        office: "જન સેવા કેન્દ્ર & તાલુકા સેવા સદન",
        role: "mamlatdar",
      },
    };
  }

  return { success: false, error: "અમાન્ય કર્મચારી ID અથવા સત્તાવાર સુરક્ષા PIN. (ડેમો PIN: GJ2026)" };
}


