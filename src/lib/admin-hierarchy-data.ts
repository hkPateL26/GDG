// =========================================================================
// GUJARAT ADMINISTRATIVE HIERARCHY & RBAC STORE
// 5-Tier Governance Architecture:
// 1. State Secretariat (મુખ્ય સચિવાલય - ગાંધીનગર)
// 2. District Collectorate (જિલ્લા કલેક્ટર કચેરી - રાજકોટ)
// 3. Sub-Divisional Magistrate / SDM (પ્રાંત કચેરી - રાજકોટ ગ્રામ્ય / ગોંડલ)
// 4. Taluka Mamlatdar & TDO (તાલુકા મામલતદાર કચેરી - ગોંડલ)
// 5. Gram Panchayat / Talati / VCE (ગ્રામ પંચાયત - મોમટા / જન સેવા કેન્દ્ર)
// =========================================================================

export type AdminRole =
  | "state_admin"         // Tier 1: State Super Admin (Gandhinagar)
  | "district_collector"   // Tier 2: District Collector / DDO
  | "sdm_prant"           // Tier 3: Sub-Divisional Magistrate / Prant Officer
  | "mamlatdar"           // Tier 4: Taluka Mamlatdar / Executive Magistrate / TDO
  | "talati";             // Tier 5: Gram Panchayat Talati Mantri / VCE / Desk Operator

export interface OfficerNode {
  id: string;
  name: string;
  designation: string;
  role: AdminRole;
  tierLevel: 1 | 2 | 3 | 4 | 5;
  tierNameGu: string;
  district: string;
  districtGu: string;
  taluka?: string;
  talukaGu?: string;
  panchayat?: string;
  panchayatGu?: string;
  office: string;
  officeGu: string;
  email: string;
  mobile: string;
  isOnLeave: boolean;
  actingOfficerId?: string;
  actingOfficerName?: string;
  avatarEmoji: string;
  canApproveEsign: boolean;
  canVerifyPayment: boolean;
  canModifyPolicy: boolean;
  canViewAllDistricts: boolean;
}

export const HIERARCHICAL_OFFICERS: OfficerNode[] = [
  {
    id: "GUJ-STATE-001",
    name: "મનોજ અગ્રવાલ, IAS",
    designation: "અધિક મુખ્ય સચિવ (મહેસૂલ & સામાન્ય વહીવટ વિભાગ)",
    role: "state_admin",
    tierLevel: 1,
    tierNameGu: "રાજ્ય સ્તર - મુખ્ય સચિવાલય",
    district: "All",
    districtGu: "સમગ્ર ગુજરાત (૩૩ જિલ્લા)",
    office: "સ્વર્ણિમ સંકુલ-૧, સચિવાલય, ગાંધીનગર",
    officeGu: "સ્વર્ણિમ સંકુલ-૧, સચિવાલય, ગાંધીનગર",
    email: "acs-revenue@gujarat.gov.in",
    mobile: "9879100001",
    isOnLeave: false,
    avatarEmoji: "🏛️",
    canApproveEsign: true,
    canVerifyPayment: true,
    canModifyPolicy: true,
    canViewAllDistricts: true,
  },
  {
    id: "GUJ-COL-3001",
    name: "પ્રભવ જોષી, IAS",
    designation: "જિલ્લા કલેક્ટર & ડિસ્ટ્રિક્ટ મેજિસ્ટ્રેટ, રાજકોટ",
    role: "district_collector",
    tierLevel: 2,
    tierNameGu: "જિલ્લા સ્તર - કલેક્ટર કચેરી",
    district: "Rajkot",
    districtGu: "રાજકોટ",
    office: "કલેક્ટર કચેરી, કોર્ટ કમ્પાઉન્ડ, રાજકોટ",
    officeGu: "જિલ્લા કલેક્ટર કચેરી, રાજકોટ",
    email: "collector-raj@gujarat.gov.in",
    mobile: "9879103001",
    isOnLeave: false,
    avatarEmoji: "🏢",
    canApproveEsign: true,
    canVerifyPayment: true,
    canModifyPolicy: true,
    canViewAllDistricts: false,
  },
  {
    id: "GUJ-SDM-5002",
    name: "કે. એમ. પંડ્યા, GAS",
    designation: "સબ-ડિવિઝનલ મેજિસ્ટ્રેટ & પ્રાંત અધિકારી, ગોંડલ સબ-ડિવિઝન",
    role: "sdm_prant",
    tierLevel: 3,
    tierNameGu: "સબ-ડિવિઝન સ્તર - પ્રાંત કચેરી",
    district: "Rajkot",
    districtGu: "રાજકોટ",
    taluka: "Gondal",
    talukaGu: "ગોંડલ",
    office: "પ્રાંત અધિકારી કચેરી, જેલ ચોક, ગોંડલ",
    officeGu: "સબ-ડિવિઝનલ મેજિસ્ટ્રેટ (પ્રાંત) કચેરી, ગોંડલ",
    email: "sdm-gondal@gujarat.gov.in",
    mobile: "9879105002",
    isOnLeave: false,
    avatarEmoji: "⚖️",
    canApproveEsign: true,
    canVerifyPayment: true,
    canModifyPolicy: false,
    canViewAllDistricts: false,
  },
  {
    id: "GUJ-GOV-9012",
    name: "એચ. વી. પટેલ, GAS",
    designation: "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ",
    role: "mamlatdar",
    tierLevel: 4,
    tierNameGu: "તાલુકા સ્તર - મામલતદાર કચેરી",
    district: "Rajkot",
    districtGu: "રાજકોટ",
    taluka: "Gondal",
    talukaGu: "ગોંડલ",
    office: "મામલતદાર કચેરી & જન સેવા કેન્દ્ર, ગોંડલ",
    officeGu: "તાલુકા મામલતદાર કચેરી, ગોંડલ",
    email: "mam-gondal@gujarat.gov.in",
    mobile: "9879109012",
    isOnLeave: false,
    actingOfficerId: "GUJ-SDM-5002",
    actingOfficerName: "કે. એમ. પંડ્યા, GAS (ઇન-ચાર્જ)",
    avatarEmoji: "🖋️",
    canApproveEsign: true,
    canVerifyPayment: true,
    canModifyPolicy: false,
    canViewAllDistricts: false,
  },
  {
    id: "GUJ-TAL-7089",
    name: "વિજયકુમાર જોષી",
    designation: "તલાટી કમ મંત્રી & ઇ-ગ્રામ કેન્દ્ર સંચાલક, મોમટા",
    role: "talati",
    tierLevel: 5,
    tierNameGu: "પંચાયત સ્તર - તલાટી કમ મંત્રી",
    district: "Rajkot",
    districtGu: "રાજકોટ",
    taluka: "Gondal",
    talukaGu: "ગોંડલ",
    panchayat: "Momta",
    panchayatGu: "મોમટા ગ્રામ પંચાયત",
    office: "ગ્રામ પંચાયત ભવન, મોમટા, જિ. રાજકોટ",
    officeGu: "ગ્રામ પંચાયત કચેરી, મોમટા",
    email: "talati-momta@gujarat.gov.in",
    mobile: "9879107089",
    isOnLeave: false,
    actingOfficerId: "GUJ-GOV-9012",
    actingOfficerName: "એચ. વી. પટેલ (નાયબ મામલતદાર)",
    avatarEmoji: "📋",
    canApproveEsign: false,
    canVerifyPayment: true,
    canModifyPolicy: false,
    canViewAllDistricts: false,
  },
];

// =========================================================================
// 1-HOUR (DEMO) AI SLA BOTTLENECK MONITOR ENGINE
// Detects applications stuck > 60 minutes without officer action
// =========================================================================

export interface SlaBottleneckAnalysis {
  isBreached: boolean;
  elapsedMinutes: number;
  remainingMinutes: number;
  slaLimitMinutes: number;
  currentDeskGu: string;
  currentOfficerName: string;
  currentOfficerDesignation: string;
  stuckReasonGu: string;
  aiDiagnosisGu: string;
  recommendedActionGu: string;
  urgencyLevel: "normal" | "warning" | "critical";
  canAutoEscalate: boolean;
  escalationTargetOfficer: string;
}

export function analyzeApplicationSla(
  app: {
    appliedDate?: string;
    submittedAtMs?: number;
    lastUpdated?: string;
    workflowStage?: number;
    status?: string;
    officerDesignation?: string;
    paymentStatus?: string;
    schemeNameGu?: string;
  },
  overrideMinutes?: number
): SlaBottleneckAnalysis {
  const SLA_LIMIT_MINUTES = 60; // 1-Hour SLA (Demo Mode)

  // Determine elapsed time (either mock elapsed or computed from submission)
  let elapsed = overrideMinutes ?? 0;
  if (!overrideMinutes) {
    if (app.submittedAtMs) {
      elapsed = Math.floor((Date.now() - app.submittedAtMs) / 60000);
    } else {
      // Deterministic realistic simulated duration based on stage and status
      if (app.status === "pending" || app.paymentStatus === "pending_challan") {
        elapsed = 74; // Breached 60 min!
      } else if (app.workflowStage === 1) {
        elapsed = 68; // Breached 60 min!
      } else if (app.workflowStage === 2) {
        elapsed = 48; // 48 mins, warning
      } else {
        elapsed = 25;
      }
    }
  }

  const isBreached = elapsed >= SLA_LIMIT_MINUTES;
  const remaining = Math.max(0, SLA_LIMIT_MINUTES - elapsed);

  let currentDeskGu = "તલાટી કમ મંત્રી સ્ક્રુટિની કાઉન્ટર, મોમટા ગ્રામ પંચાયત";
  let currentOfficerName = "વિજયકુમાર જોષી (તલાટી)";
  let currentOfficerDesignation = "તલાટી કમ મંત્રી";
  let stuckReasonGu = "દસ્તાવેજ અપલોડ થયા બાદ તલાટી દ્વારા પ્રાથમિક સ્ક્રુટિની શરૂ થઈ નથી.";
  let aiDiagnosisGu =
    "અરજી આવ્યાને ૧ કલાક (૬૦ મિનિટ) કરતા વધુ સમય થઈ ગયો છે. તલાટી ડેસ્ક પર દસ્તાવેજ ચકાસણી પેન્ડિંગ હોવાથી આગળનું મામલતદાર e-Sign અટકેલું છે.";
  let recommendedActionGu = "નાયબ મામલતદાર અથવા ઇન-ચાર્જ તલાટીને તાત્કાલિક રી-રૂટ કરો.";
  let escalationTargetOfficer = "એચ. વી. પટેલ, GAS (તાલુકા મામલતદાર)";

  if (app.workflowStage === 2) {
    currentDeskGu = "નાયબ મામલતદાર (મહેસૂલ શાખા), ગોંડલ";
    currentOfficerName = "પી. આર. રાઠોડ";
    currentOfficerDesignation = "નાયબ મામલતદાર (દસ્તાવેજ ચકાસણી)";
    stuckReasonGu = "પ્રાથમિક તલાટી રિપોર્ટ મંજૂર થયો છે પરંતુ મામલતદાર સાહેબને ફોરવર્ડ કરવાનું પેન્ડિંગ છે.";
    aiDiagnosisGu = "નાયબ મામલતદાર ડેસ્ક પર ૪૫+ મિનિટથી ફાઈલ રજૂ થઈ નથી.";
    recommendedActionGu = "મામલતદાર ડેસ્ક પર ડાયરેક્ટ પુશ કરો.";
    escalationTargetOfficer = "એચ. વી. પટેલ, GAS (મામલતદાર)";
  } else if (app.workflowStage === 3 || app.status === "approved") {
    currentDeskGu = "તાલુકા મામલતદાર ચેમ્બર (ડિજિટલ e-Sign ડેસ્ક)";
    currentOfficerName = "એચ. વી. પટેલ, GAS";
    currentOfficerDesignation = "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ";
    stuckReasonGu = "ડિજિટલ સિગ્નેચર (DSC Token) પ્રમાણીકરણ સંપન્ન.";
    aiDiagnosisGu = "પ્રમાણપત્ર તૈયાર છે. નાગરિક પ્રોફાઇલમાં ડાઉનલોડ માટે ઉપલબ્ધ.";
    recommendedActionGu = "કોઈ કાર્યવાહી બાકી નથી.";
    escalationTargetOfficer = "કોઈ નહીં";
  }

  let urgencyLevel: "normal" | "warning" | "critical" = "normal";
  if (isBreached) {
    urgencyLevel = "critical";
  } else if (elapsed >= 45) {
    urgencyLevel = "warning";
  }

  return {
    isBreached,
    elapsedMinutes: elapsed,
    remainingMinutes: remaining,
    slaLimitMinutes: SLA_LIMIT_MINUTES,
    currentDeskGu,
    currentOfficerName,
    currentOfficerDesignation,
    stuckReasonGu,
    aiDiagnosisGu,
    recommendedActionGu,
    urgencyLevel,
    canAutoEscalate: isBreached,
    escalationTargetOfficer,
  };
}

// =========================================================================
// AI LOCAL GUJARATI REJECTION TRANSLATOR
// Converts technical / English rejection reasons into courteous, clear Gujarati
// =========================================================================

export function translateRejectionToGujarati(reasonEnOrTech: string): {
  gujaratiTitle: string;
  gujaratiExplanation: string;
  nextStepGu: string;
} {
  const lower = reasonEnOrTech.toLowerCase();

  if (lower.includes("light") || lower.includes("electricity") || lower.includes("power")) {
    return {
      gujaratiTitle: "લાઈટ બિલ સરનામાની વિસંગતતા",
      gujaratiExplanation:
        "નમસ્તે, તમારા દ્વારા અપલોડ કરેલ લાઈટ બિલમાં દર્શાવેલું સરનામું અને અરજીમાં દર્શાવેલ સરનામું અથવા ૭/૧૨ રેકર્ડ મેળ ખાતું નથી. કૃપા કરીને અરજદારના નામે અથવા કુટુંબના વડાના નામે આવેલું છેલ્લા ૩ મહિનાનું નવું વીજ બિલ અપલોડ કરો.",
      nextStepGu: "તાજેતરનું સાચું લાઈટ બિલ અપલોડ કરી ફરીથી સબમિટ કરો.",
    };
  }

  if (lower.includes("income") || lower.includes("aavak") || lower.includes("salary")) {
    return {
      gujaratiTitle: "આવક પ્રમાણપત્ર અમાન્ય અથવા જૂનું",
      gujaratiExplanation:
        "તમારા દ્વારા રજૂ કરવામાં આવેલ આવકનો દાખલો ૩ વર્ષ કરતાં જૂનો છે અથવા તલાટી/મામલતદાર સાહેબનો સત્તાવાર રાઉન્ડ સીલ (સિક્કો) સ્પષ્ટ વંચાતો નથી. સરકારી નિયમ મુજબ ચાલુ નાણાકીય વર્ષનો માન્ય આવકનો દાખલો જરૂરી છે.",
      nextStepGu: "તલાટી કચેરીએથી નવો પ્રમાણિત આવકનો દાખલો કઢાવીને અપલોડ કરો.",
    };
  }

  if (lower.includes("aadhaar") || lower.includes("identity") || lower.includes("id")) {
    return {
      gujaratiTitle: "ઓળખ પુરાવો (આધાર કાર્ડ) અસ્પષ્ટ",
      gujaratiExplanation:
        "તમારા આધાર કાર્ડની બંને બાજુ (આગળ અને પાછળ) નો ફોટો યોગ્ય પ્રકાશમાં વંચાય તેવો નથી અથવા ફોટો ક્રોપ થઈ ગયેલ છે. સરકારી પ્રમાણીકરણ માટે આધાર કાર્ડના બધા અક્ષરો અને ફોટો સ્પષ્ટ હોવો આવશ્યક છે.",
      nextStepGu: "આધાર કાર્ડનો સ્પષ્ટ ઓરિજિનલ કલર ફોટો અપલોડ કરો.",
    };
  }

  if (lower.includes("ration") || lower.includes("family")) {
    return {
      gujaratiTitle: "રેશનકાર્ડમાં નામની ખામી",
      gujaratiExplanation:
        "તમારા રેશનકાર્ડના પ્રથમ પાના અને સભ્યોની યાદીવાળા પાનામાં અરજદારનું નામ સ્પષ્ટ રીતે દેખાતું નથી અથવા બારકોડ ઘસાઈ ગયો છે.",
      nextStepGu: "રેશનકાર્ડના બંને પાના સ્પષ્ટ રીતે ફરી સ્કેન કરીને અપલોડ કરો.",
    };
  }

  if (lower.includes("caste") || lower.includes("jati")) {
    return {
      gujaratiTitle: "જાતિના પુરાવામાં વિસંગતતા",
      gujaratiExplanation:
        "જાતિ પ્રમાણપત્રની અરજી સાથે પિતા/દાદાની શાળા છોડ્યાનું પ્રમાણપત્ર (L.C.) અથવા પેઢીનામું રજૂ કરેલ નથી, જેના કારણે સક્ષમ અધિકારી દ્વારા ખરાઈ થઈ શકી નથી.",
      nextStepGu: "પિતા અથવા દાદાનું L.C. / પેઢીનામું જોડીને ફરી અરજી જમા કરો.",
    };
  }

  // Fallback polite official translation
  return {
    gujaratiTitle: "પૂરક પુરાવા / દસ્તાવેજ સુધારણા જરૂરી",
    gujaratiExplanation: `અધિકારી નોંધ: "${reasonEnOrTech}". સરકારી નિયમ મુજબ તમારા દ્વારા રજૂ કરેલા દસ્તાવેજોમાં ચકાસણી દરમિયાન ક્ષતિ જણાયેલ છે. આપેલ વિગત સુધારીને ફરીથી અરજી કરવા વિનંતી છે.`,
    nextStepGu: "જરૂરી પુરાવા સુધારીને 'મારી અરજીઓ' માંથી રી-સબમિટ કરો.",
  };
}

// =========================================================================
// DYNAMIC POLICY CMS STORE (Admin Configurable on the Fly)
// Allows Super Admin to modify fees, mandatory documents & SLA without dev changes
// =========================================================================

export interface ServicePolicyConfig {
  serviceId: string;
  serviceNameGu: string;
  departmentGu: string;
  officialFee: number;
  slaDays: number;
  slaAlertMinutes: number;
  mandatoryDocs: string[];
  isActive: boolean;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export const DEFAULT_POLICY_STORE: Record<string, ServicePolicyConfig> = {
  "income-certificate": {
    serviceId: "income-certificate",
    serviceNameGu: "આવકનું પ્રમાણપત્ર (Income Certificate)",
    departmentGu: "મહેસૂલ વિભાગ",
    officialFee: 20,
    slaDays: 3,
    slaAlertMinutes: 15,
    mandatoryDocs: ["આધાર કાર્ડ (બંને બાજુ)", "તલાટી પંચનામું / આવક સોગંદનામું", "છેલ્લા મહિનાનું વીજ બિલ", "રેશનકાર્ડ"],
    isActive: true,
    lastUpdatedBy: "મનોજ અગ્રવાલ, IAS (મુખ્ય સચિવાલય)",
    lastUpdatedAt: "2026-09-28 10:30",
  },
  "caste-certificate": {
    serviceId: "caste-certificate",
    serviceNameGu: "જાતિ પ્રમાણપત્ર (SC / ST / SEBC)",
    departmentGu: "સામાજિક ન્યાય અને અધિકારીતા વિભાગ",
    officialFee: 20,
    slaDays: 7,
    slaAlertMinutes: 15,
    mandatoryDocs: ["અરજદારનું શાળા છોડ્યાનું પ્રમાણપત્ર (L.C.)", "પિતા / દાદાનું L.C. (જાતિ ઉલ્લેખ સાથે)", "આધાર કાર્ડ", "રેશનકાર્ડ"],
    isActive: true,
    lastUpdatedBy: "પ્રભવ જોષી, IAS (કલેક્ટર, રાજકોટ)",
    lastUpdatedAt: "2026-09-28 11:15",
  },
  "ration-card-split": {
    serviceId: "ration-card-split",
    serviceNameGu: "રેશનકાર્ડ વિભાજન / નવું રેશનકાર્ડ",
    departmentGu: "અન્ન અને નાગરિક પુરવઠા વિભાગ",
    officialFee: 30,
    slaDays: 5,
    slaAlertMinutes: 15,
    mandatoryDocs: ["મૂળ રેશનકાર્ડ (નામ કમી પ્રમાણપત્ર)", "ચૂંટણી ઓળખપત્ર / આધાર કાર્ડ", "નવા રહેઠાણનો પુરાવો (લાઈટ બિલ / વેરા પાવતી)"],
    isActive: true,
    lastUpdatedBy: "એચ. વી. પટેલ, GAS (મામલતદાર, ગોંડલ)",
    lastUpdatedAt: "2026-09-28 09:45",
  },
  "aadhaar-update": {
    serviceId: "aadhaar-update",
    serviceNameGu: "આધાર કાર્ડ સરનામું & મોબાઈલ અપડેટ",
    departmentGu: "ઈ-ગવર્નન્સ & આઈટી વિભાગ",
    officialFee: 50,
    slaDays: 2,
    slaAlertMinutes: 15,
    mandatoryDocs: ["માન્ય સરનામા પુરાવો (લાઈટ બિલ / પાસપોર્ટ / બેંક પાસબુક)", "અસલ આધાર કાર્ડ"],
    isActive: true,
    lastUpdatedBy: "મનોજ અગ્રવાલ, IAS (મુખ્ય સચિવાલય)",
    lastUpdatedAt: "2026-09-28 12:00",
  },
};

export function getPolicyConfigs(): Record<string, ServicePolicyConfig> {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("nagrik_policy_configs");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return DEFAULT_POLICY_STORE;
}

export function savePolicyConfig(config: ServicePolicyConfig): void {
  if (typeof window !== "undefined") {
    try {
      const current = getPolicyConfigs();
      current[config.serviceId] = {
        ...config,
        lastUpdatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      };
      localStorage.setItem("nagrik_policy_configs", JSON.stringify(current));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to save policy config:", e);
    }
  }
}
