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
  kacheriDetails?: Record<string, any>;
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
    citizenName: "Rameshbhai K. Patel",
    citizenNameGu: "રમેશભાઈ કે. પટેલ",
    gender: "male",
    schemeId: "pm-kisan",
    schemeName: "PM Kisan Samman Nidhi",
    schemeNameGu: "PM કિસાન સન્માન નિધિ",
    schemeEmoji: "🌾",
    district: "Rajkot",
    districtGu: "રાજકોટ",
    taluka: "Gondal",
    village: "Gomta",
    aadhaarLast4: "4829",
    status: "approved",
    appliedDate: "2026-08-14",
    lastUpdated: "2026-09-01",
    benefitAmount: 6000,
    remarksGu: "૭/૧૨ અને ૮-અ જમીન ચકાસણી તાલુકા મામલતદાર કચેરી દ્વારા સફળતાપૂર્વક પૂર્ણ. ₹૨,૦૦૦ હપ્તો DBT દ્વારા બેંક ખાતામાં જમા.",
    remarksEn: "7/12 land records verified by Taluka Mamlatdar. ₹2,000 installment credited directly via DBT to bank account.",
    officerDesignation: "Taluka Development Officer (TDO), Gondal",
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
  serviceSpecificDetails: Record<string, any>;
}

export function lookupCitizenExistingRecord(serviceId: string, docNumber: string): ExistingCitizenProfile {
  const cleanNum = docNumber.trim();
  const last4 = cleanNum.slice(-4) || "4829";

  const baseProfile: ExistingCitizenProfile = {
    found: true,
    docNumber: cleanNum || "4829",
    applicantName: "Rameshbhai Kantilal Patel",
    applicantNameGu: "રમેશભાઈ કાંતિલાલ પટેલ",
    fatherOrHusbandName: "કાંતિલાલ લાલજીભાઈ પટેલ",
    dob: "1985-06-15",
    gender: "male",
    mobile: "9825012345",
    email: "ramesh.patel@gujarat.gov.in",
    district: "Rajkot",
    taluka: "Gondal",
    village: "ગોમટા (Gomta)",
    pincode: "360320",
    addressFull: "ઘર નં. ૧૨, પટેલ વાસ, પોસ્ટ-ગોમટા, તા. ગોંડલ, જિ. રાજકોટ - ૩૬૦૩૨૦",
    serviceSpecificDetails: {},
  };

  if (serviceId === "aadhaar") {
    baseProfile.serviceSpecificDetails = {
      aadhaarMasked: `XXXX-XXXX-${last4}`,
      enrolmentDate: "2014-03-22",
      currentAddressEn: "Plot No. 12, Patel Street, Gomta Village, Gondal, Rajkot - 360320",
      currentAddressGu: "પ્લોટ નં. ૧૨, પટેલ શેરી, ગોમટા ગામ, તા. ગોંડલ, જિ. રાજકોટ - ૩૬૦૩૨૦",
      biometricStatus: "Biometric Updated 10 yrs ago (Refresh Advised)",
    };
  } else if (serviceId === "ration") {
    baseProfile.serviceSpecificDetails = {
      rationCardNo: cleanNum || "032014892145",
      rationType: "NFSA - APL-1 (અન્ન સુરક્ષા રાશનકાર્ડ)",
      fairPriceShop: "FPS-342 (ગોમટા સેવા સહકારી મંડળી)",
      gasConnection: "HP Gas (Single Cylinder - Consumer No: 849201)",
      existingMembers: [
        { nameGu: "રમેશભાઈ કે. પટેલ", relation: "કુટુંબના વડા", age: 41, aadhaar: `•••• ${last4}` },
        { nameGu: "ગીતાબેન આર. પટેલ", relation: "પત્ની", age: 38, aadhaar: "•••• 8912" },
        { nameGu: "હર્ષ આર. પટેલ", relation: "પુત્ર", age: 16, aadhaar: "•••• 3741" },
      ],
    };
  } else if (serviceId === "pan") {
    baseProfile.serviceSpecificDetails = {
      panNumber: cleanNum || "ABCDP1234K",
      nameOnCard: "RAMESH KANTILAL PATEL",
      fathersName: "KANTILAL LALJIBHAI PATEL",
      aadhaarLinked: true,
      status: "Active & Operative",
    };
  } else if (serviceId === "income") {
    baseProfile.serviceSpecificDetails = {
      prevCertNo: cleanNum || "INC/2023/84920",
      prevIssuedDate: "2023-08-10",
      validityStatus: "Expiring Soon (૩ વર્ષ પૂર્ણતા)",
      prevAnnualIncome: "₹ 1,20,000/-",
      issuingAuthority: "મામલતદાર કચેરી, ગોંડલ",
    };
  } else if (serviceId === "caste") {
    baseProfile.serviceSpecificDetails = {
      prevCertNo: cleanNum || "CST/2021/4921",
      categoryName: "SEBC / OBC (સામાજિક અને શૈક્ષણિક રીતે પછાત વર્ગ)",
      subCaste: "કડવા પાટીદાર / લેઉવા પાટીદાર / પ્રજાપતિ",
      nclExpiryDate: "2024-03-31 (રિન્યુઅલ જરૂરી)",
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

export function confirmApplicationPayment(id: string): CitizenApplication | null {
  const cleanId = id.toUpperCase();
  const app = CUSTOM_USER_APPLICATIONS.find(
    (a) => a.id.toUpperCase() === cleanId || a.id.replace(/-/g, "").toUpperCase() === cleanId.replace(/-/g, "")
  );
  if (!app) return null;

  app.paymentStatus = "paid";
  app.operatorConfirmed = true;
  app.status = "approved";
  app.workflowStage = 3;
  app.txnId = app.txnId || `TXN-CSH-${Math.floor(100000 + Math.random() * 899999)}`;
  app.lastUpdated = new Date().toISOString().split("T")[0];
  app.remarksGu = `જન સેવા કેન્દ્ર રોકડ કાઉન્ટર પર ચલણ નં. ${app.challanNo} મુજબ ફી ₹${app.feeAmount || 50} જમા થયેલ છે (Txn: ${app.txnId}). ઓપરેટર દ્વારા ચુકવણી પ્રમાણિત થઈ ચૂકી છે અને દસ્તાવેજ / પ્રમાણપત્ર રિલીઝ (અનલૉક) થયેલ છે.`;
  app.remarksEn = `Cash fee of ₹${app.feeAmount || 50} paid at Jan Seva Kendra cash counter against Challan ${app.challanNo} (Txn: ${app.txnId}). Verified by Operator. Document released.`;
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

  // If not yet in custom applications cache, find from generated dataset and copy over
  if (!app) {
    for (let i = 0; i < TOTAL_SYSTEM_RECORDS; i++) {
      const gen = generateApplication(i);
      if (gen.id.toUpperCase() === cleanId || gen.id.replace(/-/g, "").toUpperCase() === cleanId.replace(/-/g, "")) {
        app = { ...gen };
        CUSTOM_USER_APPLICATIONS.unshift(app);
        break;
      }
    }
  }

  if (!app) return null;

  app.workflowStage = targetStage;
  app.lastUpdated = new Date().toISOString().split("T")[0];

  if (targetStage === 1) {
    app.status = "processing";
    app.officerDesignation = `નાયબ મામલતદાર (દસ્તાવેજ સ્ક્રુટિની શાખા), ${app.taluka}`;
    app.remarksGu = `અરજદાર દ્વારા ઓનલાઇન અરજી સફળતાપૂર્વક સબમિટ થયેલ છે. કચેરી સ્ક્રુટિની ડેસ્ક પર દસ્તાવેજો અને આધાર કાર્ડ ખરાઈની પ્રક્રિયા ચાલુ છે.`;
    app.remarksEn = `Application submitted by citizen. Document and Aadhaar scrutiny in progress at Nayab Mamlatdar desk.`;
  } else if (targetStage === 2) {
    app.status = "processing";
    app.officerDesignation = `તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ${app.taluka}`;
    app.remarksGu = `નાયબ મામલતદાર દ્વારા તમામ દસ્તાવેજો (આધાર, આવક, રેશનકાર્ડ પુરાવા) યોગ્ય ચકાસાયેલ છે. તાલુકા મામલતદાર સાહેબની આખરી ડિજિટલ સહી (e-Sign) અર્થે અગ્રેસિત કરેલ છે.`;
    app.remarksEn = `All documents verified by Nayab Mamlatdar. Forwarded to Taluka Mamlatdar for final digital e-Sign approval.`;
  } else if (targetStage === 3 || targetStage === 4) {
    app.status = "approved";
    app.officerDesignation = `તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ${app.taluka}`;
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

    for (let i = 0; i < TOTAL_SYSTEM_RECORDS; i++) {
      const app = generateApplication(i);
      if (app.id.toUpperCase() === cleanId || app.id.replace(/-/g, "").toUpperCase() === cleanId.replace(/-/g, "")) {
        return {
          records: [app],
          total: 1,
          page: 1,
          totalPages: 1,
          stats: calculateSystemStats(),
        };
      }
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

  // Stream through the deterministic dataset
  for (let i = 0; i < TOTAL_SYSTEM_RECORDS; i++) {
    const app = generateApplication(i);

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

