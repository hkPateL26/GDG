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

  if (status === "approved") {
    remarksGu = `દસ્તાવેજ ચકાસણી પૂર્ણ. ₹${scheme.amount.toLocaleString("en-IN")} ની સહાય મંજૂર કરવામાં આવી છે.`;
    remarksEn = `Document verification completed successfully. Entitlement of ₹${scheme.amount.toLocaleString("en-IN")} approved.`;
    officer = `Taluka Development Officer (TDO), ${taluka}`;
  } else if (status === "processing") {
    remarksGu = `અરજીની ચકાસણી નાયબ મામલતદાર કક્ષાએ ચાલુ છે. આગામી ૪ દિવસમાં આખરી નિર્ણય થશે.`;
    remarksEn = `Application verification currently in progress under Deputy Mamlatdar office, ${distObj.en}.`;
    officer = `Deputy Mamlatdar, ${distObj.en}`;
  } else if (status === "pending") {
    remarksGu = `તલાટી કમ મંત્રીનો અભિપ્રાય અને આવકના દાખલાની ફિઝિકલ ખરાઈ બાકી છે.`;
    remarksEn = `Field inspection by Panchayat Talati and physical verification of documents pending.`;
    officer = `Gram Sevak / Talati, ${taluka}`;
  } else {
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
  };
}

export const TOTAL_SYSTEM_RECORDS = 5420;

// High-performance search and pagination across 5,420 records
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

  // If exact search by ID (like APP001 or APP-GUJ-1045), handle instantly
  if (search.startsWith("app")) {
    const cleanId = search.toUpperCase();
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

  const effectiveTotal = (search || district || status) ? matches.length : TOTAL_SYSTEM_RECORDS;
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
  return {
    total: TOTAL_SYSTEM_RECORDS,
    approved: 3845,
    processing: 1120,
    pending: 290,
    rejected: 165,
    disbursedCr: "₹ 14.85 Cr",
  };
}
