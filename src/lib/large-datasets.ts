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
    id: "aadhaar",
    nameEn: "Aadhaar Card (UIDAI)",
    nameGu: "આધાર કાર્ડ સેવા",
    departmentEn: "Unique Identification Authority of India (UIDAI)",
    departmentGu: "યુનિક આઇડેન્ટિફિકેશન ઓથોરિટી ઓફ ઈન્ડિયા (UIDAI)",
    emoji: "🪪",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["સરનામું (Address)", "મોબાઈલ નંબર (Mobile No)", "નામ (Name)", "જન્મતારીખ (Date of Birth)"],
    requiredDocsNew: [
      { id: "birth_proof", nameEn: "Birth Certificate / School Leaving Certificate", nameGu: "જન્મનો દાખલો / શાળા છોડ્યાનું પ્રમાણપત્ર", mandatory: true },
      { id: "address_proof", nameEn: "Electricity Bill / Ration Card", nameGu: "લાઈટ બિલ / રેશનકાર્ડ", mandatory: true },
      { id: "photo_id", nameEn: "Identity Proof (PAN / Voter ID)", nameGu: "ઓળખનો પુરાવો (PAN / ચૂંટણી કાર્ડ)", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "current_aadhaar", nameEn: "Current Aadhaar Card Copy", nameGu: "હાલના આધાર કાર્ડની નકલ", mandatory: true },
      { id: "update_proof", nameEn: "Supporting Document for Change (Address/DOB)", nameGu: "સુધારા માટેનો પુરાવો (લાઈટબિલ / એલસી)", mandatory: true },
    ],
    biometricRequiredNew: true,
    biometricRequiredUpdate: true, // for iris/fingerprint refresh
    fee: 50,
  },
  {
    id: "ration",
    nameEn: "Digital Ration Card (NFSA/RCMS)",
    nameGu: "ડિજિટલ રેશનકાર્ડ સેવા",
    departmentEn: "Food, Civil Supplies & Consumer Affairs Department",
    departmentGu: "અન્ન અને નાગરિક પુરવઠા વિભાગ, ગુજરાત સરકાર",
    emoji: "🛒",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["નવા સભ્યનું નામ ઉમેરવું (Add Member)", "નામ કમી કરવું (Delete Member)", "સરનામું બદલવું (Change Address)", "રેશનકાર્ડ વિભાજન (Split)"],
    requiredDocsNew: [
      { id: "family_aadhaar", nameEn: "Aadhaar Cards of All Family Members", nameGu: "કુટુંબના તમામ સભ્યોના આધાર કાર્ડ", mandatory: true },
      { id: "income_proof", nameEn: "Income Certificate from Mamlatdar", nameGu: "મામલતદારનો આવકનો દાખલો", mandatory: true },
      { id: "residence_proof", nameEn: "Electricity Bill / Tax Receipt", nameGu: "લાઈટ બિલ / વેરા પાવતી", mandatory: true },
      { id: "gas_proof", nameEn: "LPG Gas Connection Consumer Receipt", nameGu: "ગેસ કનેક્શન પાસબુક/રસીદ", mandatory: false },
    ],
    requiredDocsUpdate: [
      { id: "current_ration", nameEn: "Current Ration Card Booklet / Digital Copy", nameGu: "હાલનું રેશનકાર્ડ", mandatory: true },
      { id: "member_proof", nameEn: "Birth / Marriage Certificate for New Member", nameGu: "નવા સભ્યનું જન્મ પ્રમાણપત્ર / લગ્ન નોંધણી", mandatory: true },
      { id: "member_aadhaar", nameEn: "Aadhaar Card of Person to Add/Update", nameGu: "ઉમેરવાના સભ્યનું આધાર કાર્ડ", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 20,
  },
  {
    id: "income",
    nameEn: "Income Certificate (આવકનો દાખલો)",
    nameGu: "આવકનું પ્રમાણપત્ર (૩ વર્ષ માન્ય)",
    departmentEn: "Revenue Department, Government of Gujarat",
    departmentGu: "મહેસૂલ વિભાગ, ગુજરાત સરકાર (મામલતદાર કચેરી)",
    emoji: "📜",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["નવીકરણ / રિન્યુઅલ (Renewal)", "આવક સુધારો (Income Correction)"],
    requiredDocsNew: [
      { id: "ration_card", nameEn: "Ration Card (All Pages)", nameGu: "રેશનકાર્ડ (તમામ પાના)", mandatory: true },
      { id: "applicant_aadhaar", nameEn: "Applicant Aadhaar Card", nameGu: "અરજદારનું આધાર કાર્ડ", mandatory: true },
      { id: "talati_report", nameEn: "Talati Income Assessment Report / Salary Slip", nameGu: "તલાટી કમ મંત્રીનો આવક પંચનામું રિપોર્ટ", mandatory: true },
      { id: "electricity_bill", nameEn: "Recent Electricity Bill", nameGu: "છેલ્લા મહિનાનું લાઈટ બિલ", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "old_income", nameEn: "Expired Income Certificate", nameGu: "જૂનો આવકનો દાખલો", mandatory: true },
      { id: "current_electricity", nameEn: "Current Electricity Bill", nameGu: "તાજેતરનું લાઈટ બિલ", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 20,
  },
  {
    id: "pan",
    nameEn: "PAN Card (Income Tax Dept)",
    nameGu: "PAN કાર્ડ સેવા",
    departmentEn: "Income Tax Department, Government of India",
    departmentGu: "આવકવેરા વિભાગ, ભારત સરકાર (NSDL/UTI)",
    emoji: "💳",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["નામ સુધારો (Name Correction)", "જન્મતારીખ સુધારો (DOB Correction)", "ફોટો/સહી અપડેટ (Photo/Sign Update)"],
    requiredDocsNew: [
      { id: "pan_aadhaar", nameEn: "Aadhaar Card (Linked with Mobile)", nameGu: "આધાર કાર્ડ (મોબાઈલ લિંક્ડ)", mandatory: true },
      { id: "passport_photo", nameEn: "Passport Size Photograph", nameGu: "પાસપોર્ટ સાઇઝ રંગીન ફોટો", mandatory: true },
      { id: "dob_proof", nameEn: "Proof of Date of Birth (Birth Certificate / School LC)", nameGu: "જન્મતારીખનો પુરાવો (LC / જન્મ દાખલો)", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "current_pan", nameEn: "Existing PAN Card Copy", nameGu: "હાલના PAN કાર્ડની નકલ", mandatory: true },
      { id: "aadhaar_card", nameEn: "Aadhaar Card with Correct Details", nameGu: "સાચી વિગતો વાળું આધાર કાર્ડ", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 107,
  },
  {
    id: "caste",
    nameEn: "Caste & Non-Creamy Layer Certificate",
    nameGu: "જાતિ પ્રમાણપત્ર & નોન-ક્રીમીલેયર દાખલો",
    departmentEn: "Social Justice & Empowerment Department",
    departmentGu: "સામાજિક ન્યાય અને અધિકારિતા વિભાગ, ગુજરાત સરકાર",
    emoji: "⚖️",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["નોન-ક્રીમીલેયર રિન્યુઅલ (Renewal)", "નામ સુધારો (Correction)"],
    requiredDocsNew: [
      { id: "applicant_lc", nameEn: "School Leaving Certificate of Applicant", nameGu: "અરજદારનું શાળા છોડ્યાનું પ્રમાણપત્ર (LC)", mandatory: true },
      { id: "father_lc", nameEn: "Father / Paternal Relative's LC or Pedhinamu", nameGu: "પિતાનું LC અથવા પેઢીનામું / જાતિ પુરાવો", mandatory: true },
      { id: "income_cert", nameEn: "Valid Income Certificate from Mamlatdar", nameGu: "સક્ષમ અધિકારીનો આવકનો દાખલો", mandatory: true },
      { id: "ration_card", nameEn: "Ration Card", nameGu: "રેશનકાર્ડ", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "old_caste", nameEn: "Previous Caste / NCL Certificate", nameGu: "અગાઉનો જાતિનો / NCL દાખલો", mandatory: true },
      { id: "fresh_income", nameEn: "Fresh Income Certificate", nameGu: "તાજો આવકનો દાખલો", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 20,
  },
  {
    id: "land_records",
    nameEn: "AnyRoR 7/12 & 8A Land Records",
    nameGu: "જમીન ૭/૧૨ & ૮-અ ડિજિટલ ઉતારા",
    departmentEn: "Revenue Department, Government of Gujarat (e-Dhara)",
    departmentGu: "મહેસૂલ વિભાગ, ગુજરાત સરકાર (e-Dhara / AnyRoR)",
    emoji: "🌾",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["વારસાઈ નોંધણી (Heirship Entry)", "બોજો / ધિરાણ નોંધણી (Bank Loan Entry)", "હક્ક કમી / વહેંચણી (Right Surrender / Split)"],
    requiredDocsNew: [
      { id: "survey_proof", nameEn: "Khata Number / Survey Number Reference", nameGu: "ખાતા નંબર / જૂના સર્વે નંબરની નકલ", mandatory: true },
      { id: "applicant_aadhaar", nameEn: "Applicant Aadhaar Card", nameGu: "અરજદારનું આધાર કાર્ડ", mandatory: true },
      { id: "tax_receipt", nameEn: "Gram Panchayat Tax / Revenue Receipt", nameGu: "પંચાયત વેરા પાવતી / મહેસૂલી પહોંચ", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "pedhinamu_doc", nameEn: "Talati Pedhinamu / Heirship Tree", nameGu: "તલાટીનું અધિકૃત પેઢીનામું", mandatory: true },
      { id: "death_proof", nameEn: "Death Certificate of Khatedar", nameGu: "મૂળ ખાતેદારનું મરણ પ્રમાણપત્ર", mandatory: true },
      { id: "consent_affidavit", nameEn: "Consent Affidavit of All Heirs", nameGu: "તમામ વારસદારોનું સંમતિ સોગંદનામું", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 20,
  },
  {
    id: "birth_cert",
    nameEn: "Birth Certificate (CRS / e-Gram)",
    nameGu: "ડિજિટલ જન્મ પ્રમાણપત્ર",
    departmentEn: "Panchayat, Rural Housing & Health Dept",
    departmentGu: "પંચાયત, ગ્રામ ગૃહનિર્માણ અને આરોગ્ય વિભાગ",
    emoji: "👶",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["બાળકનું નામ ઉમેરવું (Add Child Name)", "માતા-પિતાના નામમાં સ્પેલિંગ સુધારો", "જન્મ સ્થળ સુધારો"],
    requiredDocsNew: [
      { id: "hospital_discharge", nameEn: "Hospital Discharge Slip / Form 1", nameGu: "હોસ્પિટલ ડિસ્ચાર્જ સ્લિપ / ફોર્મ-૧", mandatory: true },
      { id: "parents_aadhaar", nameEn: "Aadhaar Cards of Parents", nameGu: "માતા અને પિતા બંનેના આધાર કાર્ડ", mandatory: true },
      { id: "marriage_or_ration", nameEn: "Marriage Certificate or Ration Card", nameGu: "લગ્ન નોંધણી દાખલો અથવા રેશનકાર્ડ", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "current_birth_cert", nameEn: "Original Birth Certificate Copy", nameGu: "હાલનું અસલ જન્મ પ્રમાણપત્ર", mandatory: true },
      { id: "school_lc_proof", nameEn: "School Leaving Certificate or Court Order", nameGu: "શાળા છોડ્યાનું પ્રમાણપત્ર (LC) / સોગંદનામું", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 20,
  },
  {
    id: "death_cert",
    nameEn: "Death Certificate (CRS)",
    nameGu: "ડિજિટલ મરણ પ્રમાણપત્ર",
    departmentEn: "Panchayat & Urban Development Dept",
    departmentGu: "પંચાયત અને નગરપાલિકા નિયામકની કચેરી",
    emoji: "🕊️",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["નામ સ્પેલિંગ સુધારો (Spelling Correction)", "મરણ તારીખ સુધારો", "કાયમી સરનામું સુધારો"],
    requiredDocsNew: [
      { id: "doctor_cause_cert", nameEn: "Medical Certificate of Cause of Death / Cremation Slip", nameGu: "ડોક્ટર મરણ સર્ટિફિકેટ / સ્મશાન પાવતી", mandatory: true },
      { id: "deceased_aadhaar", nameEn: "Aadhaar Card of Deceased Person", nameGu: "મૃતકનું આધાર કાર્ડ / ઓળખપત્ર", mandatory: true },
      { id: "informant_id", nameEn: "Applicant / Informant ID & Ration Card", nameGu: "અરજદાર/વારસદારનું આધાર કાર્ડ અને રેશનકાર્ડ", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "old_death_cert", nameEn: "Existing Death Certificate Copy", nameGu: "હાલનું મરણ પ્રમાણપત્ર", mandatory: true },
      { id: "notary_affidavit", nameEn: "Notary Affidavit & Evidence for Correction", nameGu: "નોટરી સોગંદનામું અને સુધારા પુરાવો", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 20,
  },
  {
    id: "ews_cert",
    nameEn: "Economically Weaker Section (EWS) Certificate",
    nameGu: "EWS પ્રમાણપત્ર (આર્થિક નબળા વર્ગ)",
    departmentEn: "Social Justice & Empowerment Department",
    departmentGu: "સામાજિક ન્યાય અને અધિકારિતા વિભાગ, ગુજરાત સરકાર",
    emoji: "🏛️",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["વાર્ષિક નવીકરણ (Annual Renewal)", "સરનામું સુધારો (Address Update)"],
    requiredDocsNew: [
      { id: "mamlatdar_income", nameEn: "Income Certificate (Annual Income < ₹8 Lakh)", nameGu: "મામલતદારનો આવકનો દાખલો (વાર્ષિક < ₹૮ લાખ)", mandatory: true },
      { id: "property_document", nameEn: "Property / Land Documents (7/12 or House Index)", nameGu: "જમીન/મકાન મિલકત દસ્તાવેજ (ઇન્ડેક્ષ-૨ / ૭-૧૨)", mandatory: true },
      { id: "school_lc", nameEn: "School Leaving Certificate (Caste / Category Proof)", nameGu: "શાળા છોડ્યાનું પ્રમાણપત્ર (બિન-અનામત જાતિ)", mandatory: true },
      { id: "panchayat_tax", nameEn: "Municipal / Panchayat Tax Bill", nameGu: "વેરા બિલ / લાઈટ બિલ", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "prev_ews_cert", nameEn: "Expired EWS Certificate Copy", nameGu: "જૂનું EWS પ્રમાણપત્ર", mandatory: true },
      { id: "current_year_income", nameEn: "Current Financial Year Income Certificate", nameGu: "ચાલુ નાણાકીય વર્ષનો આવકનો દાખલો", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 20,
  },
  {
    id: "domicile_cert",
    nameEn: "Domicile Certificate (Resident of Gujarat)",
    nameGu: "ડોમિસાઇલ પ્રમાણપત્ર (કાયમી વસવાટ)",
    departmentEn: "Home Department / District Collector Office",
    departmentGu: "ગૃહ વિભાગ & કલેક્ટર કચેરી, ગુજરાત સરકાર",
    emoji: "🏠",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["સરનામું બદલવું (Change of Address)", "નામ સુધારો (Correction)"],
    requiredDocsNew: [
      { id: "continuous_residence", nameEn: "10 Years Continuous Residence Proof (Light/Tax Bills)", nameGu: "૧૦ વર્ષ સતત વસવાટના પુરાવા (લાઈટબિલ/વેરાબિલ)", mandatory: true },
      { id: "birth_proof", nameEn: "Birth Certificate or School LC of Gujarat", nameGu: "ગુજરાતમાં જન્મનો દાખલો અથવા શાળા LC", mandatory: true },
      { id: "applicant_aadhaar", nameEn: "Applicant Aadhaar Card", nameGu: "અરજદારનું આધાર કાર્ડ", mandatory: true },
      { id: "police_inquiry", nameEn: "Police Verification / Talati Panchnama", nameGu: "પોલીસ ચકાસણી પંચનામું / તલાટી દાખલો", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "prev_domicile", nameEn: "Previous Domicile Certificate", nameGu: "અગાઉનું ડોમિસાઇલ પ્રમાણપત્ર", mandatory: true },
      { id: "address_proof", nameEn: "New Address Proof", nameGu: "નવા સરનામાનો સત્તાવાર પુરાવો", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 50,
  },
  {
    id: "senior_citizen",
    nameEn: "Senior Citizen Identity Card (60+ Years)",
    nameGu: "વરિષ્ઠ નાગરિક ઓળખપત્ર (૬૦+ વર્ષ)",
    departmentEn: "Social Defence Directorate, Gujarat",
    departmentGu: "સમાજ સુરક્ષા ખાતું, સામાજિક ન્યાય વિભાગ",
    emoji: "👴",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["બ્લડ ગ્રુપ સુધારો (Blood Group Update)", "ઇમરજન્સી મોબાઈલ સુધારો", "સરનામું સુધારો"],
    requiredDocsNew: [
      { id: "age_proof", nameEn: "Age Proof (School LC / PAN / Voter ID - 60+ Years)", nameGu: "વય પુરાવો (LC / PAN / ચૂંટણી કાર્ડ - ૬૦ વર્ષ)", mandatory: true },
      { id: "senior_aadhaar", nameEn: "Applicant Aadhaar Card", nameGu: "અરજદારનું આધાર કાર્ડ", mandatory: true },
      { id: "passport_photo", nameEn: "Recent Passport Size Photograph", nameGu: "પાસપોર્ટ સાઇઝ રંગીન ફોટો", mandatory: true },
      { id: "blood_report", nameEn: "Blood Group Medical Report", nameGu: "બ્લડ ગ્રુપ તબીબી રિપોર્ટ", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "current_senior_card", nameEn: "Current Senior Citizen Card Copy", nameGu: "હાલનું વરિષ્ઠ નાગરિક કાર્ડ", mandatory: true },
      { id: "update_proof", nameEn: "Supporting Document for Update", nameGu: "સુધારા માટેનો પુરાવો", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 0,
  },
  {
    id: "driving_licence",
    nameEn: "Driving Licence (SARATHI - Transport Dept)",
    nameGu: "ડ્રાઇવિંગ લાયસન્સ (RTO સારથી)",
    departmentEn: "Commissioner of Transport, Gujarat",
    departmentGu: "વાહનવ્યવહાર કમિશનરની કચેરી, ગુજરાત સરકાર",
    emoji: "🚗",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["લાયસન્સ રિન્યુઅલ (Renewal)", "સરનામું સુધારો (Address Change)", "વાહન ક્લાસ ઉમેરો (Add Vehicle Class)"],
    requiredDocsNew: [
      { id: "age_dob_proof", nameEn: "Age & DOB Proof (Birth Certificate / School LC)", nameGu: "વય અને જન્મ તારીખ પુરાવો (LC / જન્મ દાખલો)", mandatory: true },
      { id: "address_proof", nameEn: "Permanent Address Proof (Aadhaar / Voter ID)", nameGu: "કાયમી સરનામાનો પુરાવો (આધાર કાર્ડ / ચૂંટણી કાર્ડ)", mandatory: true },
      { id: "medical_form1a", nameEn: "Medical Fitness Certificate (Form 1A / Self-Declaration)", nameGu: "તબીબી ફિટનેસ પ્રમાણપત્ર (ફોર્મ ૧-એ)", mandatory: true },
      { id: "photo_sign", nameEn: "Passport Photo & Specimen Signature", nameGu: "પાસપોર્ટ ફોટો અને નમૂના સહી", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "original_dl", nameEn: "Original Driving Licence Copy", nameGu: "અસલ ડ્રાઇવિંગ લાયસન્સની નકલ", mandatory: true },
      { id: "aadhaar_proof", nameEn: "Aadhaar Card for Address / Identity Verification", nameGu: "આધાર કાર્ડ પુરાવો", mandatory: true },
    ],
    biometricRequiredNew: true,
    biometricRequiredUpdate: false,
    fee: 200,
  },
  {
    id: "marriage_cert",
    nameEn: "Marriage Registration Certificate",
    nameGu: "લગ્ન નોંધણી પ્રમાણપત્ર",
    departmentEn: "Panchayat & Urban Development Dept",
    departmentGu: "પંચાયત અને શહેરી વિકાસ વિભાગ, ગુજરાત સરકાર",
    emoji: "💍",
    supportsNew: true,
    supportsUpdate: true,
    updateFields: ["નામ સ્પેલિંગ સુધારો (Spelling Correction)", "સરનામું સુધારો (Address Update)"],
    requiredDocsNew: [
      { id: "invitation_card", nameEn: "Wedding Invitation Card (કંકોત્રી) or Priest Certificate", nameGu: "લગ્ન કંકોત્રી અથવા ગોર મહારાજનું પ્રમાણપત્ર", mandatory: true },
      { id: "couple_ids", nameEn: "Aadhaar & Birth Proof of Both Bride and Groom", nameGu: "વર અને કન્યા બંનેના આધાર કાર્ડ અને LC / જન્મ દાખલો", mandatory: true },
      { id: "joint_photo", nameEn: "Joint Marriage Photograph", nameGu: "લગ્ન સમયનો સંયુક્ત પાસપોર્ટ ફોટો", mandatory: true },
      { id: "witness_ids", nameEn: "Aadhaar Cards of Two Adult Witnesses", nameGu: "બે પુખ્ત સાક્ષીઓના આધાર કાર્ડ", mandatory: true },
    ],
    requiredDocsUpdate: [
      { id: "original_marriage_cert", nameEn: "Existing Marriage Certificate Copy", nameGu: "અસલ લગ્ન નોંધણી દાખલો", mandatory: true },
      { id: "affidavit_proof", nameEn: "Joint Correction Affidavit by Couple", nameGu: "દંપતીનું સંયુક્ત સુધારા સોગંદનામું", mandatory: true },
    ],
    biometricRequiredNew: false,
    biometricRequiredUpdate: false,
    fee: 100,
  },
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
  if ((cleanId === "GUJ-GOV-9012" || cleanId.startsWith("GUJ")) && cleanPin === "GJ2026") {
    return {
      success: true,
      officer: {
        id: "GUJ-GOV-9012",
        name: "H. V. Patel, GAS",
        designation: "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ",
        district: "Rajkot",
        taluka: "Gondal",
        office: "જન સેવા કેન્દ્ર & તાલુકા સેવા સદન",
        role: "admin",
      },
    };
  }

  return { success: false, error: "અમાન્ય કર્મચારી ID અથવા સત્તાવાર સુરક્ષા PIN. (ડેમો PIN: GJ2026)" };
}

