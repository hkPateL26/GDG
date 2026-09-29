"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  OfficerNode,
  HIERARCHICAL_OFFICERS,
  analyzeApplicationSla,
  translateRejectionToGujarati,
  getPolicyConfigs,
  savePolicyConfig,
  ServicePolicyConfig,
} from "@/lib/admin-hierarchy-data";
import {
  GUJARAT_DISTRICTS,
  CitizenApplication,
  getVillagesForTaluka,
} from "@/lib/large-datasets";
import {
  Shield,
  Building2,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  LogOut,
  Sparkles,
  Printer,
  ChevronDown,
  X,
  Send,
  Zap,
  Lock,
  ArrowRight,
  FileText,
  Sliders,
  Award,
  RefreshCw,
  Eye,
  Maximize2,
  FileCheck,
  Receipt,
  Smartphone,
  Check,
} from "lucide-react";
import AiBottleneckMonitor from "@/components/AiBottleneckMonitor";
import OfficialGovernmentCertificate from "@/components/OfficialGovernmentCertificate";
import GovernmentReceiptSlip from "@/components/GovernmentReceiptSlip";
import {
  SkeletonAdminStats,
  SkeletonAdminTable,
  SkeletonReviewModal,
} from "@/components/Skeleton";

const GUJARATI_NAME_MAP: Record<string, string> = {
  "rameshbhai kantilal patel": "રમેશભાઈ કાંતિલાલ પટેલ",
  "rameshbhai k. patel": "રમેશભાઈ કે. પટેલ",
  "ramesh patel": "રમેશ પટેલ",
  "hari vinodrai patel": "હરી વિનોદરાઈ પટેલ",
  "aartiben m. solanki": "આરતીબેન એમ. સોલંકી",
  "dineshbhai p. rabari": "દિનેશભાઈ પી. રબારી",
  "mansukhbhai g. vaghani": "મનસુખભાઈ જી. વાઘાણી",
  "bhavnaben j. radadiya": "ભાવનાબેન જે. રાદડિયા",
  "jayeshbhai l. sojitra": "જયેશભાઈ એલ. સોજીત્રા",
  "kantibhai p. savaliya": "કાંતિભાઈ પી. સાવલિયા",
  "ashwinbhai d. vaghasia": "અશ્વિનભાઈ ડી. વઘાસિયા",
  "maheshbhai v. gajera": "મહેશભાઈ વી. ગજેરા",
  "prakashbhai r. khunt": "પ્રકાશભાઈ આર. ખૂંટ",
  "nareshbhai d. chovatiya": "નરેશભાઈ ડી. ચોવટીયા",
  "gitaben r. patel": "ગીતાબેન આર. પટેલ",
  "vipulbhai m. thummar": "વિપુલભાઈ એમ. ઠુમ્મર",
  "dharmendrasinh j. jadeja": "ધર્મેન્દ્રસિંહ જે. જાડેજા",
};

function formatCitizenNameGu(app: CitizenApplication): string {
  if (app.citizenNameGu && /[\u0A80-\u0AFF]/.test(app.citizenNameGu)) {
    return app.citizenNameGu;
  }
  const raw = (app.citizenName || (app as unknown as { applicantName?: string }).applicantName || "").trim();
  const lower = raw.toLowerCase();
  if (GUJARATI_NAME_MAP[lower]) return GUJARATI_NAME_MAP[lower];
  if (app.citizenNameGu) return app.citizenNameGu;
  if (raw) return raw;
  return "હરી વિનોદરાઈ પટેલ";
}

function cleanVillageOnly(village?: string): string {
  if (!village) return "મોમટા";
  const v = village.replace(/\s*\([^)]*\)/g, "").trim();
  const villageMap: Record<string, string> = {
    momta: "મોમટા",
    gomta: "મોમટા",
    movaiya: "મોવૈયા",
    biliyala: "બીલીયાળા",
    charakhadi: "ચરખડી",
    derdi: "ડેરડી કુંભાજી",
    shrinathgadh: "શ્રીનાથગઢ",
    ribda: "રીબડા",
    hadamtala: "હડમતાળા",
    bandra: "બાંદ્રા",
    daiya: "દૈય્યા",
    kolithad: "કોલીથડ",
    gondal: "ગોંડલ",
    anandpar: "આનંદપર",
    kuha: "કુહા",
    madhapar: "માધાપર",
  };
  return villageMap[v.toLowerCase()] || v;
}

function formatGujaratiLocation(
  village?: string,
  taluka?: string,
  districtGu?: string,
  district?: string
): string {
  const cleanV = cleanVillageOnly(village);
  const t = (taluka || "").trim();
  const talukaMap: Record<string, string> = {
    gondal: "ગોંડલ",
    "rajkot rural": "રાજકોટ ગ્રામ્ય",
    "rajkot urban": "રાજકોટ શહેર",
    jetpur: "જેતપુર",
    dhoraji: "ધોરાજી",
    upleta: "ઉપલેટા",
    "kotda sangani": "કોટડા સાંગાણી",
    lodhika: "લોધિકા",
    jasdan: "જસદણ",
    vinchhiya: "વીંછીયા",
    paddhari: "પડધરી",
    jamkandorna: "જામકંડોરણા",
    daskroi: "દસક્રોઈ",
    sanand: "સાણંદ",
    dholka: "ધોળકા",
    bavla: "બાવળા",
    "ahmedabad city": "અમદાવાદ શહેર",
    "surat city": "સુરત શહેર",
    choryasi: "ચોર્યાસી",
    kamrej: "કામરેજ",
    bardoli: "બારડોલી",
    "vadodara urban": "વડોદરા શહેર",
    "vadodara rural": "વડોદરા ગ્રામ્ય",
    padra: "પાદરા",
    bhuj: "ભુજ",
    anjar: "અંજાર",
    gandhidham: "ગાંધીધામ",
    morbi: "મોરબી",
    amreli: "અમરેલી",
    anand: "આણંદ",
  };
  const tLower = t.toLowerCase();
  const tGu = talukaMap[tLower] || t || "ગોંડલ";
  const dist = getDistrictForTaluka(t, districtGu, district);

  if (!cleanV || cleanV.toLowerCase() === tLower || cleanV === tGu || cleanV === `${tGu} શહેર`) {
    return `તા. ${tGu} (જિ. ${dist})`;
  }

  return `મુ. ${cleanV}, તા. ${tGu} (જિ. ${dist})`;
}

function getDistrictForTaluka(
  taluka?: string,
  fallbackDistGu?: string,
  fallbackDist?: string
): string {
  if (!taluka) return fallbackDistGu || fallbackDist || "રાજકોટ";
  const tClean = taluka.toLowerCase().replace(/\s*\(.*\)/g, "").trim();
  for (const d of GUJARAT_DISTRICTS) {
    if (
      d.talukas.some(
        (t) =>
          t.toLowerCase() === tClean ||
          tClean.includes(t.toLowerCase()) ||
          t.toLowerCase().includes(tClean)
      )
    ) {
      return d.gu;
    }
  }
  return fallbackDistGu || fallbackDist || "રાજકોટ";
}

function cleanTalukaName(taluka?: string): string {
  if (!taluka) return "ગોંડલ";
  const talukaMap: Record<string, string> = {
    gondal: "ગોંડલ",
    "rajkot rural": "રાજકોટ ગ્રામ્ય",
    "rajkot urban": "રાજકોટ શહેર",
    jetpur: "જેતપુર",
    dhoraji: "ધોરાજી",
    upleta: "ઉપલેટા",
    "kotda sangani": "કોટડા સાંગાણી",
    lodhika: "લોધિકા",
    jasdan: "જસદણ",
    vinchhiya: "વીંછીયા",
    paddhari: "પડધરી",
    jamkandorna: "જામકંડોરણા",
    daskroi: "દસક્રોઈ",
    sanand: "સાણંદ",
    dholka: "ધોળકા",
    bavla: "બાવળા",
    "ahmedabad city": "અમદાવાદ શહેર",
    "surat city": "સુરત શહેર",
    choryasi: "ચોર્યાસી",
    kamrej: "કામરેજ",
    bardoli: "બારડોલી",
    "vadodara urban": "વડોદરા શહેર",
    "vadodara rural": "વડોદરા ગ્રામ્ય",
    padra: "પાદરા",
    bhuj: "ભુજ",
    anjar: "અંજાર",
    gandhidham: "ગાંધીધામ",
    morbi: "મોરબી",
    amreli: "અમરેલી",
    anand: "આણંદ",
  };
  return talukaMap[taluka.toLowerCase().trim()] || taluka;
}

function getOfficerJurisdictionInfo(officer: OfficerNode) {
  switch (officer.role) {
    case "talati":
      return {
        badge: "મોમટા ગ્રામ પંચાયત (માત્ર મોમટા ગામ)",
        description: "માત્ર મોમટા ગ્રામ પંચાયત",
        icon: "📋",
      };
    case "mamlatdar":
      return {
        badge: "ગોંડલ તાલુકો (તમામ ગામડાં & શહેર)",
        description: "ગોંડલ તાલુકો",
        icon: "🖋️",
      };
    case "sdm_prant":
      return {
        badge: "ગોંડલ સબ-ડિવિઝન (ગોંડલ, કોટડા સાંગાણી, લોધિકા)",
        description: "ગોંડલ પ્રાંતના ૩ તાલુકા",
        icon: "⚖️",
      };
    case "district_collector":
      return {
        badge: "રાજકોટ જિલ્લો (૧૧ તાલુકા)",
        description: "સમગ્ર રાજકોટ જિલ્લો",
        icon: "🏢",
      };
    default:
      return {
        badge: "સમગ્ર ગુજરાત રાજ્ય (૩૩ જિલ્લા)",
        description: "સમગ્ર ગુજરાત",
        icon: "🏛️",
      };
  }
}

function resolveOfficerNode(raw?: Partial<OfficerNode> | null): OfficerNode {
  if (!raw) return HIERARCHICAL_OFFICERS[3]; // Default: Taluka Mamlatdar (H.V. Patel, GAS)
  const match = HIERARCHICAL_OFFICERS.find(
    (o) => (raw.id && o.id === raw.id) || (raw.role && o.role === raw.role)
  );
  if (match) {
    return {
      ...match,
      ...raw,
      avatarEmoji: match.avatarEmoji,
      tierNameGu: match.tierNameGu,
      officeGu: match.officeGu,
      tierLevel: match.tierLevel,
    };
  }
  return HIERARCHICAL_OFFICERS[3];
}

interface AdminHierarchyDeskProps {
  initialOfficer?: OfficerNode;
  onLogout: () => void;
}

export default function AdminHierarchyDesk({
  initialOfficer,
  onLogout,
}: AdminHierarchyDeskProps) {
  // Authenticated base officer who originally logged in (determines supervisory clearance)
  const [authenticatedOfficer] = useState<OfficerNode>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedAuth = sessionStorage.getItem("nagrik_authenticated_officer");
        if (savedAuth) {
          return resolveOfficerNode(JSON.parse(savedAuth));
        }
      } catch {
        // fallback
      }
    }
    if (initialOfficer) {
      return resolveOfficerNode(initialOfficer);
    }
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("nagrik_officer_session");
        if (saved) {
          return resolveOfficerNode(JSON.parse(saved));
        }
      } catch {
        // fallback
      }
    }
    return HIERARCHICAL_OFFICERS[3]; // Default: Taluka Mamlatdar (H.V. Patel, GAS)
  });

  // Current active officer state (allows switching only between allowed subordinate tiers)
  const [currentOfficer, setCurrentOfficer] = useState<OfficerNode>(() => {
    let officer = authenticatedOfficer;
    if (typeof window !== "undefined") {
      try {
        const savedSession = sessionStorage.getItem("nagrik_officer_session");
        if (savedSession) {
          officer = resolveOfficerNode(JSON.parse(savedSession));
        }
      } catch {
        // fallback
      }
    } else if (initialOfficer) {
      officer = resolveOfficerNode(initialOfficer);
    }

    // Security check: Never allow active officer to exceed authenticated officer's tier rank
    if (officer.tierLevel < authenticatedOfficer.tierLevel) {
      return authenticatedOfficer;
    }
    return officer;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("nagrik_authenticated_officer")) {
        sessionStorage.setItem("nagrik_authenticated_officer", JSON.stringify(authenticatedOfficer));
      }
    }
  }, [authenticatedOfficer]);

  // Strict Hierarchical RBAC:
  // An officer can only inspect / switch down to subordinate desks within their authority hierarchy.
  // Tier 1 (State Super Admin / Chief Secretary): Can inspect Tiers 1, 2, 3, 4, 5.
  // Tier 2 (Collector): Can inspect Tiers 2, 3, 4, 5 (Cannot access Tier 1).
  // Tier 3 (SDM / Prant): Can inspect Tiers 3, 4, 5 (Cannot access Tiers 1, 2).
  // Tier 4 (Mamlatdar): Can inspect Tiers 4, 5 (Cannot access Tiers 1, 2, 3).
  // Tier 5 (Talati Mantri): Can ONLY access Tier 5 (his own village desk, cannot access any higher office).
  const allowedOfficersToSwitch = useMemo(() => {
    const authLevel = authenticatedOfficer.tierLevel || 5;
    return HIERARCHICAL_OFFICERS.filter((o) => o.tierLevel >= authLevel);
  }, [authenticatedOfficer.tierLevel]);

  const [isOnLeave, setIsOnLeave] = useState<boolean>(currentOfficer.isOnLeave || false);
  const [actingOfficerName, setActingOfficerName] = useState<string>(
    currentOfficer.actingOfficerName || "કે. એમ. પંડ્યા, GAS (ઇન-ચાર્જ)"
  );

  // Active Desk Tab
  const [activeTab, setActiveTab] = useState<"queue" | "sla" | "policy">("queue");

  // Cascading Filters scoped by Officer Jurisdiction
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    return currentOfficer.role === "state_admin" ? "all" : (currentOfficer.district || "Rajkot");
  });
  const [selectedTaluka, setSelectedTaluka] = useState<string>(() => {
    if (currentOfficer.role === "mamlatdar" || currentOfficer.role === "talati") {
      return currentOfficer.taluka || "Gondal";
    }
    return "all";
  });
  const [selectedVillage, setSelectedVillage] = useState<string>(() => {
    if (currentOfficer.role === "talati") {
      return "મોમટા (Momta)";
    }
    return "all";
  });
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [slaFilterOnly, setSlaFilterOnly] = useState<boolean>(false);

  // Dynamic real talukas based on officer's jurisdiction zone
  const availableTalukas = useMemo(() => {
    if (currentOfficer.role === "talati" || currentOfficer.role === "mamlatdar") {
      return ["Gondal"];
    }
    if (currentOfficer.role === "sdm_prant") {
      return ["Gondal", "Kotda Sangani", "Lodhika"];
    }
    if (currentOfficer.role === "district_collector") {
      const distObj = GUJARAT_DISTRICTS.find(
        (d) => d.en.toLowerCase() === "rajkot" || d.gu === "રાજકોટ"
      );
      return distObj ? distObj.talukas : ["Gondal", "Kotda Sangani", "Lodhika", "Rajkot Rural", "Rajkot Urban", "Jetpur", "Dhoraji", "Upleta", "Jasdan", "Vinchhiya", "Paddhari", "Jamkandorna"];
    }
    // state_admin: shows talukas of selected district or all 248 talukas
    if (selectedDistrict === "all") {
      return Array.from(new Set(GUJARAT_DISTRICTS.flatMap((d) => d.talukas))).sort();
    }
    const distObj = GUJARAT_DISTRICTS.find(
      (d) => d.en.toLowerCase() === selectedDistrict.toLowerCase() || d.gu === selectedDistrict
    );
    return distObj ? distObj.talukas : [];
  }, [currentOfficer.role, selectedDistrict]);

  // Dynamic real villages for the selected taluka
  const availableVillages = useMemo(() => {
    if (currentOfficer.role === "talati") {
      return ["મોમટા (Momta)"];
    }
    const effectiveT = (currentOfficer.role === "mamlatdar") ? "Gondal" : selectedTaluka;
    if (effectiveT === "all") {
      if (selectedDistrict !== "all") {
        const distObj = GUJARAT_DISTRICTS.find(
          (d) => d.en.toLowerCase() === selectedDistrict.toLowerCase() || d.gu === selectedDistrict
        );
        if (distObj) {
          return Array.from(new Set(distObj.talukas.flatMap((t) => getVillagesForTaluka(t))));
        }
      }
      return [];
    }
    return getVillagesForTaluka(effectiveT);
  }, [currentOfficer.role, selectedDistrict, selectedTaluka]);

  // Data & Modal States
  const [applications, setApplications] = useState<CitizenApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<CitizenApplication | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [certificateModalApp, setCertificateModalApp] = useState<CitizenApplication | null>(null);
  const [receiptModalApp, setReceiptModalApp] = useState<CitizenApplication | null>(null);
  const [zoomDocImage, setZoomDocImage] = useState<{ src: string; title: string; ocrData?: Record<string, string> } | null>(null);

  // Review Modal Actions State
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [rejectionInput, setRejectionInput] = useState<string>("");
  const [translatedRejection, setTranslatedRejection] = useState<{
    gujaratiTitle: string;
    gujaratiExplanation: string;
    nextStepGu: string;
  } | null>(null);

  // Policy CMS state
  const [policyConfigs, setPolicyConfigs] = useState<Record<string, ServicePolicyConfig>>({});
  const [selectedPolicyKey, setSelectedPolicyKey] = useState<string>("income-certificate");
  const [policySavedAlert, setPolicySavedAlert] = useState<boolean>(false);

  // Load Policies
  useEffect(() => {
    setPolicyConfigs(getPolicyConfigs());
  }, []);

  // Fetch applications list with strict jurisdiction parameters
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      let qDistrict = selectedDistrict;
      let qTaluka = selectedTaluka;
      let qVillage = selectedVillage;

      if (currentOfficer.role === "district_collector" || currentOfficer.role === "sdm_prant") {
        qDistrict = "Rajkot";
      } else if (currentOfficer.role === "mamlatdar") {
        qDistrict = "Rajkot";
        qTaluka = "Gondal";
      } else if (currentOfficer.role === "talati") {
        qDistrict = "Rajkot";
        qTaluka = "Gondal";
        qVillage = "Momta";
      }

      if (qDistrict !== "all") params.append("district", qDistrict);
      if (qTaluka !== "all") params.append("taluka", qTaluka);
      if (qVillage !== "all") params.append("village", qVillage);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("limit", "100");

      const res = await fetch(`/api/track?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.records) {
        let serverRecords: CitizenApplication[] = data.records;

        // Merge and sanitize local applications
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("nagrik_user_applications");
            if (raw) {
              const localApps: CitizenApplication[] = JSON.parse(raw);
              serverRecords = [...localApps, ...serverRecords];
            }
          } catch (e) {
            console.warn("Admin local storage parse error:", e);
          }
        }

        const seen = new Set<string>();
        const unique: CitizenApplication[] = [];
        for (const item of serverRecords) {
          if (item && item.id && !seen.has(item.id)) {
            seen.add(item.id);
            unique.push(item);
          }
        }
        setApplications(unique);
      }
    } catch (e) {
      console.error("Failed to load applications:", e);
    } finally {
      setLoading(false);
    }
  }, [currentOfficer.role, selectedDistrict, selectedTaluka, selectedVillage, selectedStatus, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 150);
    return () => clearTimeout(timer);
  }, [fetchApplications]);

  // Role Switcher Handler (Auto-locks filters to the officer's administrative jurisdiction)
  const handleRoleSwitch = (officerId: string) => {
    const target = HIERARCHICAL_OFFICERS.find((o) => o.id === officerId);
    if (!target) return;

    // Strict Authority Validation: Cannot access desks above authenticated officer's tier rank
    if (target.tierLevel < authenticatedOfficer.tierLevel) {
      alert("⚠️ અનધિકૃત પ્રવેશ: તમને ઉચ્ચ કક્ષાના અધિકારીના ડેસ્ક પર પ્રવેશવાની વહીવટી સત્તા નથી.");
      return;
    }

    setCurrentOfficer(target);
    setIsOnLeave(target.isOnLeave);
    setActingOfficerName(target.actingOfficerName || "ઇન-ચાર્જ અધિકારી");

    if (target.role === "state_admin") {
      setSelectedDistrict("all");
      setSelectedTaluka("all");
      setSelectedVillage("all");
    } else if (target.role === "district_collector") {
      setSelectedDistrict(target.district || "Rajkot");
      setSelectedTaluka("all");
      setSelectedVillage("all");
    } else if (target.role === "sdm_prant") {
      setSelectedDistrict(target.district || "Rajkot");
      setSelectedTaluka("all");
      setSelectedVillage("all");
    } else if (target.role === "mamlatdar") {
      setSelectedDistrict(target.district || "Rajkot");
      setSelectedTaluka(target.taluka || "Gondal");
      setSelectedVillage("all");
    } else if (target.role === "talati") {
      setSelectedDistrict(target.district || "Rajkot");
      setSelectedTaluka(target.taluka || "Gondal");
      setSelectedVillage("મોમટા (Momta)");
    }

    sessionStorage.setItem("nagrik_officer_session", JSON.stringify(target));
  };

  const handleLogoutClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("nagrik_authenticated_officer");
      sessionStorage.removeItem("nagrik_officer_session");
    }
    onLogout();
  };

  // Toggle Leave Protocol
  const handleToggleLeave = () => {
    const newLeaveState = !isOnLeave;
    setIsOnLeave(newLeaveState);
    if (newLeaveState) {
      setActionSuccessMsg(
        `રજા નોંધાઈ ગઈ! તમારી ગેરહાજરી દરમિયાન તમામ અરજીઓ આપમેળે ઇન-ચાર્જ ${actingOfficerName} ને ડાયવર્ટ થશે.`
      );
    } else {
      setActionSuccessMsg("તમે ફરજ પર હાજર થયા છો. અરજીઓ તમારા ડેસ્ક પર રી-એક્ટિવેટ થઈ ગઈ છે.");
    }
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  // Payment Verification Handler
  const handleVerifyPayment = async (app: CitizenApplication) => {
    setIsProcessingAction(true);
    try {
      const res = await fetch("/api/track", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: app.id,
          action: "confirm_cash_payment",
          operatorId: "JSK-OP-8921",
          officerId: currentOfficer.id,
          pin: "GJ2026",
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setApplications((prev) =>
          prev.map((a) => (a.id === data.application.id ? data.application : a))
        );
        setSelectedApp(data.application);
        setActionSuccessMsg(
          "સરકારી ચુકવણી સફળતાપૂર્વક પ્રમાણિત થઈ ગઈ છે! નાગરિકના પ્રોફાઇલમાં પાવતી ડાઉનલોડ અનલૉક થઈ ગઈ."
        );
      } else {
        alert(data.error || "ચુકવણી ચકાસવામાં સમસ્યા આવી.");
      }
    } catch {
      alert("સર્વર ક્ષતિ આવી.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Advance Stage / Mamlatdar Digital e-Sign Approval
  const handleApproveEsign = async (app: CitizenApplication) => {
    setIsProcessingAction(true);
    try {
      const res = await fetch("/api/track", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: app.id,
          action: "advance_stage",
          stage: 3,
          officerRole: `${currentOfficer.designation} (${currentOfficer.name})`,
          officerName: currentOfficer.name,
          officerId: currentOfficer.id || "GUJ-GOV-9012",
          pin: "GJ2026",
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setApplications((prev) =>
          prev.map((a) => (a.id === data.application.id ? data.application : a))
        );
        setSelectedApp(data.application);

        // Also update local storage so citizen side reflects approval instantly
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("nagrik_user_applications");
            if (raw) {
              const localApps: CitizenApplication[] = JSON.parse(raw);
              const updated = localApps.map((a) =>
                a.id === data.application.id ? data.application : a
              );
              localStorage.setItem("nagrik_user_applications", JSON.stringify(updated));
            }
            const savedSessionStr = localStorage.getItem("nagrik_citizen_session");
            if (savedSessionStr) {
              const session = JSON.parse(savedSessionStr);
              if (session.activeApplications) {
                session.activeApplications = session.activeApplications.map((a: { id?: string }) =>
                  a.id === data.application.id ? data.application : a
                );
                localStorage.setItem("nagrik_citizen_session", JSON.stringify(session));
              }
            }
            window.dispatchEvent(new Event("storage"));
          } catch (storageErr) {
            console.warn("Storage sync error:", storageErr);
          }
        }

        setActionSuccessMsg(
          "તાલુકા મામલતદાર ડિજિટલ સહી (e-Sign) સફળ! સત્તાવાર પ્રમાણપત્ર જનરેટ થઈ ગયું છે."
        );

        // Automatically open the official certificate modal for instant viewing & printing!
        setCertificateModalApp(data.application);
      } else {
        alert(data.error || "મંજૂરી પ્રક્રિયામાં ક્ષતિ આવી.");
      }
    } catch {
      alert("સર્વર ક્ષતિ આવી.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  // AI Rejection Translator
  const handleTranslateRejection = () => {
    if (!rejectionInput.trim()) return;
    const translated = translateRejectionToGujarati(rejectionInput.trim());
    setTranslatedRejection(translated);
  };

  // Submit Rejection to Citizen Timeline
  const handleSubmitRejection = async (app: CitizenApplication) => {
    if (!translatedRejection) return;
    setIsProcessingAction(true);
    try {
      const updatedApp: CitizenApplication = {
        ...app,
        status: "rejected",
        workflowStage: 2,
        remarksGu: translatedRejection.gujaratiExplanation,
        remarksEn: rejectionInput,
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setApplications((prev) => prev.map((a) => (a.id === app.id ? updatedApp : a)));
      setSelectedApp(updatedApp);
      setActionSuccessMsg(
        "અરજીમાં સુધારણા માટે નાગરિકને AI ગુજરાતી સૂચના સફળતાપૂર્વક મોકલાઈ ગઈ છે."
      );
      setTranslatedRejection(null);
      setRejectionInput("");
    } catch {
      alert("ક્ષતિ આવી.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Save Policy CMS Changes
  const handleSavePolicy = (config: ServicePolicyConfig) => {
    savePolicyConfig(config);
    setPolicyConfigs(getPolicyConfigs());
    setPolicySavedAlert(true);
    setTimeout(() => setPolicySavedAlert(false), 4000);
  };

  // Filtered List strictly scoped to Officer's Jurisdictional Zone
  const filteredApplications = useMemo(() => {
    const seen = new Set<string>();
    return applications.filter((app) => {
      if (!app || !app.id || seen.has(app.id)) return false;

      // Determine authentic district & taluka of this application
      const resolvedDistGu = getDistrictForTaluka(app.taluka, app.districtGu, app.district);
      const appTaluka = (app.taluka || "").toLowerCase().trim();
      const appVillage = (app.village || "").toLowerCase().trim();

      // ── STRICT OFFICER JURISDICTION ENFORCEMENT ──
      if (currentOfficer.role === "talati") {
        // Talati only sees Momta village applications
        const isMomta = appVillage.includes("momta") || appVillage.includes("મોમટા") || appVillage.includes("gomta") || appVillage.includes("ગોમતા");
        if (!isMomta) return false;
      } else if (currentOfficer.role === "mamlatdar") {
        // Mamlatdar only sees Gondal taluka applications
        if (appTaluka !== "gondal") return false;
      } else if (currentOfficer.role === "sdm_prant") {
        // SDM / Prant Officer sees Gondal Prant talukas: Gondal, Kotda Sangani, Lodhika
        const prantTalukas = ["gondal", "kotda sangani", "lodhika"];
        if (!prantTalukas.includes(appTaluka)) return false;
      } else if (currentOfficer.role === "district_collector") {
        // Collector only sees Rajkot district applications
        const isRajkot =
          (app.district || "").toLowerCase() === "rajkot" ||
          resolvedDistGu === "રાજકોટ" ||
          (app.districtGu && app.districtGu === "રાજકોટ");
        if (!isRajkot) return false;
      }

      // ── USER UI FILTERS ──
      // District filter
      if (selectedDistrict !== "all") {
        const matchDist =
          (app.district || "").toLowerCase() === selectedDistrict.toLowerCase() ||
          resolvedDistGu === selectedDistrict ||
          (app.districtGu && app.districtGu === selectedDistrict);
        if (!matchDist) return false;
      }

      // Taluka filter
      if (selectedTaluka !== "all" && appTaluka !== selectedTaluka.toLowerCase().trim()) {
        return false;
      }

      // Village / City filter
      if (selectedVillage !== "all") {
        const vPure = selectedVillage.split("(")[0].trim().toLowerCase();
        const appVPure = appVillage.split("(")[0].trim();
        const matchesVillage =
          appVillage.includes(vPure) ||
          vPure.includes(appVPure) ||
          appVillage === selectedVillage.toLowerCase().trim();
        if (!matchesVillage) return false;
      }

      // Status filter
      if (selectedStatus !== "all" && app.status !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesQ =
          app.id.toLowerCase().includes(q) ||
          (app.citizenName || "").toLowerCase().includes(q) ||
          (app.citizenNameGu || "").toLowerCase().includes(q) ||
          (app.schemeName || "").toLowerCase().includes(q) ||
          (app.schemeNameGu || "").toLowerCase().includes(q) ||
          appVillage.includes(q) ||
          appTaluka.includes(q);
        if (!matchesQ) return false;
      }

      // 15-Minute SLA check
      if (slaFilterOnly) {
        const sla = analyzeApplicationSla(app);
        if (!sla.isBreached) return false;
      }

      seen.add(app.id);
      return true;
    });
  }, [applications, currentOfficer.role, selectedDistrict, selectedTaluka, selectedVillage, selectedStatus, searchQuery, slaFilterOnly]);

  return (
    <div className="space-y-3 sm:space-y-4 max-w-7xl mx-auto px-1 sm:px-4 animate-in fade-in duration-200">
      {/* ── Officer Identity Header & Administrative Tier (Compact & Responsive) ── */}
      <div className="bg-slate-900 text-white rounded-2xl p-3 sm:p-5 border border-slate-800 shadow-lg space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
          {/* Officer Details */}
          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0 mt-0.5 sm:mt-0">
              {currentOfficer.avatarEmoji || "🏛️"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="font-black text-sm sm:text-base text-white">{currentOfficer.name}</h2>
                <span className="text-[9px] sm:text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase shrink-0">
                  {currentOfficer.tierNameGu}
                </span>
                {isOnLeave ? (
                  <span className="text-[9px] sm:text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse shrink-0">
                    ⚠️ રજા પર
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    ફરજ પર
                  </span>
                )}
              </div>
              <p className="text-[10.5px] sm:text-[11px] text-slate-300 mt-1 leading-snug break-words">
                {currentOfficer.designation} &bull; ID:{" "}
                <strong className="font-mono text-amber-300">{currentOfficer.id}</strong>
                <span className="text-slate-400 block sm:inline sm:ml-1">
                  ({currentOfficer.officeGu || currentOfficer.office || "કચેરી ડેસ્ક"})
                </span>
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mt-1.5">
                <span className="text-[9.5px] sm:text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                  {getOfficerJurisdictionInfo(currentOfficer).icon} અધિકારક્ષેત્ર: {getOfficerJurisdictionInfo(currentOfficer).badge}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions: Leave Protocol & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-stretch sm:self-auto justify-end pt-1 sm:pt-0 border-t border-slate-800/80 sm:border-0">
            <button
              type="button"
              onClick={handleToggleLeave}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer min-h-[34px] sm:min-h-[36px] ${
                isOnLeave
                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              <span>{isOnLeave ? "ફરજ પર હાજર" : "રજા નોંધાવો"}</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer min-h-[34px] sm:min-h-[36px]"
            >
              <LogOut size={12} />
              <span>લૉગઆઉટ</span>
            </button>
          </div>
        </div>

        {/* ── Supervisor Inspection Alert Banner (When a Higher Authority is inspecting a subordinate desk) ── */}
        {currentOfficer.id !== authenticatedOfficer.id && (
          <div className="bg-amber-500/15 border border-amber-400/60 p-2.5 rounded-xl text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in duration-200 shadow-inner">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">👁️</span>
              <p className="leading-snug text-[11.5px]">
                <strong className="text-amber-300">ઉચ્ચ અધિકારી નિરીક્ષણ મોડ:</strong> આપ{" "}
                <strong className="text-white underline">{authenticatedOfficer.name}</strong> ({authenticatedOfficer.tierNameGu.split("-")[1] || authenticatedOfficer.tierNameGu}) તરીકે લૉગિન છો અને હાલ{" "}
                <strong className="text-white">{currentOfficer.name}</strong> ({currentOfficer.tierNameGu}) ના ડેસ્કનું નિરીક્ષણ કરી રહ્યા છો.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRoleSwitch(authenticatedOfficer.id)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-xs shrink-0 transition shadow-xs cursor-pointer self-start sm:self-auto active:scale-95"
            >
              મુખ્ય ડેસ્ક પર પરત ફરો ↩
            </button>
          </div>
        )}

        {/* ── Role Switcher Bar / Administrative Clearance Lock ── */}
        {allowedOfficersToSwitch.length > 1 ? (
          <div className="bg-slate-950/80 p-2 sm:p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none touch-pan-x snap-x text-xs">
            <span className="text-[11px] text-slate-400 font-bold px-1.5 shrink-0 flex items-center gap-1.5 whitespace-nowrap">
              <Shield size={13} className="text-amber-400" /> કચેરી સ્તર નિરીક્ષણ:
            </span>

            {allowedOfficersToSwitch.map((officer) => {
              const isSelf = officer.id === authenticatedOfficer.id;
              const isSelected = currentOfficer.id === officer.id;
              return (
                <button
                  key={officer.id}
                  type="button"
                  onClick={() => handleRoleSwitch(officer.id)}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs shrink-0 snap-start min-h-[38px] flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-amber-400 text-slate-950 shadow-md font-black ring-1 ring-amber-300"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 active:scale-95"
                  }`}
                >
                  <span>
                    {officer.avatarEmoji} {officer.tierNameGu.split("-")[1] || officer.tierNameGu}
                    {isSelf ? " (પોતાનું ડેસ્ક)" : " (નિરીક્ષણ)"}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-950/90 p-2 sm:p-2.5 rounded-xl border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-sm mt-0.5 sm:mt-0">
                🔒
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-emerald-300 font-bold text-[11px] sm:text-xs leading-snug break-words">
                  સત્તાવાર વહીવટી અધિકારક્ષેત્ર:{" "}
                  <span className="text-white font-black">
                    {authenticatedOfficer.panchayatGu || authenticatedOfficer.officeGu}
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  ગ્રામ સ્તરે માત્ર આપના સ્થાનિક અધિકારક્ષેત્રનું ડેસ્ક સક્રિય છે.
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto shrink-0 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-600/50 px-2 py-0.5 rounded-md">
              સિંગલ ડેસ્ક લૉક
            </span>
          </div>
        )}

        {/* Leave Protocol Alert Banner if Officer is on Leave */}
        {isOnLeave && (
          <div className="bg-rose-950/80 border border-rose-500/80 p-2.5 rounded-xl text-xs text-rose-200 flex items-center gap-2 animate-in fade-in duration-200">
            <AlertTriangle size={15} className="text-rose-400 shrink-0" />
            <p className="leading-snug">
              <strong>ડેલિગેશન સક્રિય:</strong> તમામ પેન્ડિંગ અરજીઓ આપમેળે ઇન-ચાર્જ{" "}
              <strong className="text-white">{actingOfficerName}</strong> ના ડેસ્ક પર ટ્રાન્સફર થાય છે.
            </p>
          </div>
        )}
      </div>

      {/* ── Global Alert Bar ── */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-400 p-3 rounded-xl text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ── Navigation Tabs (App-grade Responsive Touch Strip) ── */}
      <div className={`grid gap-1.5 sm:flex sm:items-center sm:gap-2 pb-2 border-b border-slate-200 ${
        currentOfficer.canModifyPolicy ? "grid-cols-3" : "grid-cols-2"
      }`}>
        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`w-full sm:w-auto px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer min-h-[38px] sm:min-h-[42px] select-none ${
            activeTab === "queue"
              ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 active:scale-95"
          }`}
        >
          <FileText size={13} className="shrink-0" />
          <span className="truncate">૧. અરજી સ્ક્રુટિની</span>
          <span className="text-[9.5px] sm:text-[10px] bg-amber-400 text-slate-950 px-1.5 sm:px-2 py-0.2 rounded-full font-black shrink-0">
            {filteredApplications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sla")}
          className={`w-full sm:w-auto px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer min-h-[38px] sm:min-h-[42px] select-none ${
            activeTab === "sla"
              ? "bg-rose-600 text-white shadow-sm ring-1 ring-rose-500"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 active:scale-95"
          }`}
        >
          <AlertTriangle size={13} className={`shrink-0 ${activeTab === "sla" ? "text-white" : "text-rose-500"}`} />
          <span className="truncate">૨. AI બોટલનેક</span>
        </button>

        {currentOfficer.canModifyPolicy && (
          <button
            type="button"
            onClick={() => setActiveTab("policy")}
            className={`w-full sm:w-auto px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer min-h-[38px] sm:min-h-[42px] select-none ${
              activeTab === "policy"
                ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 active:scale-95"
            }`}
          >
            <Sliders size={13} className="shrink-0" />
            <span className="truncate">૩. પોલિસી CMS</span>
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: APPLICATION QUEUE & SCRUTINY (RESPONSIVE & COMPACT)
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "queue" && (
        <div className="space-y-3">
          {/* Dynamic Cascading Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            {/* Officer Jurisdiction Live Status Strip */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-slate-600 font-bold">અધિકારક્ષેત્ર ઝોન:</span>
                <span className="text-[11px] bg-amber-100 text-amber-950 border border-amber-300 font-black px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 shadow-2xs">
                  {getOfficerJurisdictionInfo(currentOfficer).icon} {getOfficerJurisdictionInfo(currentOfficer).badge}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                અધિકારક્ષેત્ર હેઠળ અરજીઓ: <strong className="text-slate-900 font-mono font-black text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{filteredApplications.length}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-1.5 sm:gap-2 text-xs">
              {/* District Dropdown */}
              <div>
                <label className="block text-[10px] sm:text-[10.5px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                  <span className="truncate">જિલ્લો (District)</span>
                  {currentOfficer.role !== "state_admin" && (
                    <span className="text-[8.5px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-mono shrink-0">🔒</span>
                  )}
                </label>
                <select
                  value={selectedDistrict}
                  disabled={currentOfficer.role !== "state_admin"}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedTaluka("all");
                    setSelectedVillage("all");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 sm:p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400 disabled:opacity-75 disabled:bg-slate-100 text-[11px] sm:text-xs"
                >
                  {currentOfficer.role === "state_admin" && <option value="all">તમામ ૩૩ જિલ્લા</option>}
                  {GUJARAT_DISTRICTS.map((d) => (
                    <option key={d.en} value={d.en}>
                      {d.gu} ({d.en})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Real Talukas Dropdown */}
              <div>
                <label className="block text-[10px] sm:text-[10.5px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                  <span className="truncate">તાલુકો (Taluka)</span>
                  {(currentOfficer.role === "talati" || currentOfficer.role === "mamlatdar") && (
                    <span className="text-[8.5px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-mono shrink-0">🔒</span>
                  )}
                </label>
                <select
                  value={selectedTaluka}
                  disabled={currentOfficer.role === "talati" || currentOfficer.role === "mamlatdar"}
                  onChange={(e) => {
                    setSelectedTaluka(e.target.value);
                    setSelectedVillage("all");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 sm:p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400 disabled:opacity-75 disabled:bg-slate-100 text-[11px] sm:text-xs"
                >
                  {currentOfficer.role !== "talati" && currentOfficer.role !== "mamlatdar" && (
                    <option value="all">
                      {currentOfficer.role === "sdm_prant"
                        ? "ગોંડલ સબ-ડિવિઝન"
                        : `તમામ તાલુકા (${availableTalukas.length})`}
                    </option>
                  )}
                  {availableTalukas.map((t) => (
                    <option key={t} value={t}>
                      {cleanTalukaName(t)} ({t})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Real Villages & Cities Dropdown */}
              <div>
                <label className="block text-[10px] sm:text-[10.5px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                  <span className="truncate">ગામ / શહેર</span>
                  {currentOfficer.role === "talati" && (
                    <span className="text-[8.5px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-mono shrink-0">🔒</span>
                  )}
                </label>
                <select
                  value={selectedVillage}
                  disabled={currentOfficer.role === "talati" || availableVillages.length === 0}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 sm:p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400 disabled:opacity-75 disabled:bg-slate-100 text-[11px] sm:text-xs"
                >
                  {currentOfficer.role !== "talati" && (
                    <option value="all">
                      {selectedTaluka === "all" ? "તમામ ગામડા / શહેર" : `ગામ/શહેર (${availableVillages.length})`}
                    </option>
                  )}
                  {availableVillages.map((v) => (
                    <option key={v} value={v}>
                      {cleanVillageOnly(v)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[10px] sm:text-[10.5px] font-bold text-slate-600 mb-1">
                  <span className="truncate">સ્થિતિ (Status)</span>
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 sm:p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400 text-[11px] sm:text-xs"
                >
                  <option value="all">તમામ સ્થિતિ</option>
                  <option value="processing">ચકાસણી હેઠળ</option>
                  <option value="pending">સ્થળ તપાસ પેન્ડિંગ</option>
                  <option value="approved">મંજૂર (Approved)</option>
                  <option value="rejected">સુધારણા જરૂરી</option>
                </select>
              </div>

              {/* Search Bar - Full Width on Mobile */}
              <div className="col-span-2 sm:col-span-2 lg:col-span-1">
                <label className="block text-[10px] sm:text-[10.5px] font-bold text-slate-600 mb-1">
                  અરજી ID / નામ / ગામ
                </label>
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="દા.ત. APP001, મોમટા..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-slate-900 font-bold focus:outline-hidden focus:ring-1 focus:ring-amber-400 text-[11px] sm:text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Quick 1-Hour SLA Toggle Pill */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSlaFilterOnly((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer text-xs ${
                  slaFilterOnly
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <AlertTriangle size={12} className={slaFilterOnly ? "text-white" : "text-rose-500"} />
                <span>🚨 ૧ કલાક+ અટવાયેલી (SLA Breached Only)</span>
              </button>

              <span className="text-[11px] text-slate-500">
                રેકર્ડ્સ: <strong>{filteredApplications.length}</strong>
              </span>
            </div>
          </div>

          {/* ── Table & Cards View (Hard Responsive with Max Height & No Endless Scroll) ── */}
          {loading ? (
            <SkeletonAdminTable />
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center text-xl mx-auto mb-2">
                📭
              </div>
              <h4 className="font-bold text-slate-900 text-sm">કોઈ અરજી મળી નથી</h4>
              <p className="text-xs text-slate-500 mt-0.5">પસંદ કરેલા ફિલ્ટર્સ મુજબ કોઈ ડેટા ઉપલબ્ધ નથી.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {/* Desktop Table View (Max Height Capped for Clean Viewport) */}
              <div className="hidden md:block max-h-[580px] overflow-y-auto">
                <table className="w-full text-left text-xs table-fixed">
                  <colgroup>
                    <col className="w-[20%]" />
                    <col className="w-[23%]" />
                    <col className="w-[17%]" />
                    <col className="w-[18%]" />
                    <col className="w-[12%]" />
                    <col className="w-[10%]" />
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-slate-900 text-white font-bold text-[11px]">
                    <tr>
                      <th className="p-3">અરજી ક્રમાંક & નાગરિક</th>
                      <th className="p-3">સેવા & કચેરી</th>
                      <th className="p-3">ચુકવણી & રસીદ</th>
                      <th className="p-3">૧૫-મિનિટ SLA</th>
                      <th className="p-3">તબક્કો (Stage)</th>
                      <th className="p-3 text-right">કાર્યવાહી</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app, idx) => {
                      const sla = analyzeApplicationSla(app);
                      const isPaid = app.paymentStatus === "paid";
                      const isApproved = app.status === "approved" || app.workflowStage === 3;
                      const citizenNameDisplay = formatCitizenNameGu(app);
                      const schemeNameDisplay = app.schemeNameGu || app.schemeName || "આવકનું પ્રમાણપત્ર";

                      return (
                        <tr key={`${app.id}-${idx}`} className="hover:bg-slate-50/80 transition">
                          {/* App ID & Citizen */}
                          <td className="p-3 align-top">
                            <span className="font-mono font-black text-slate-900 block tracking-wide">{app.id}</span>
                            <span className="font-bold text-slate-800 text-xs block leading-snug break-words">
                              {citizenNameDisplay}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                UID: XXXX-{app.aadhaarLast4 || "1413"}
                              </span>
                              <span className="text-[9.5px] bg-amber-50 text-amber-900 border border-amber-200/80 px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-0.5">
                                🏡 {cleanVillageOnly(app.village)}
                              </span>
                            </div>
                          </td>

                          {/* Scheme & Office */}
                          <td className="p-3 align-top">
                            <span className="font-bold text-slate-900 block leading-snug break-words">
                              {schemeNameDisplay}
                            </span>
                            <span className="text-[11px] text-slate-600 font-medium block leading-normal mt-1">
                              📍 {formatGujaratiLocation(app.village, app.taluka, app.districtGu, app.district)}
                            </span>
                          </td>

                          {/* Payment & Receipt Gate */}
                          <td className="p-3 align-top">
                            {isPaid ? (
                              <div className="space-y-1.5">
                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                                  <CheckCircle2 size={11} className="text-emerald-700" /> ચુકવણી પ્રમાણિત
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setReceiptModalApp(app)}
                                  className="text-[10.5px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer block hover:underline"
                                >
                                  <Receipt size={11} /> સરકારી પાવતી જુઓ
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
                                  <Clock size={11} className="text-amber-700" /> ચલણ ભરપાઈ બાકી
                                </span>
                                {currentOfficer.canVerifyPayment && (
                                  <button
                                    type="button"
                                    onClick={() => handleVerifyPayment(app)}
                                    className="text-[10px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-1 rounded-lg transition cursor-pointer shadow-xs whitespace-nowrap active:scale-95 block"
                                  >
                                    ચુકવણી કન્ફર્મ કરો
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* 15-Minute SLA Status */}
                          <td className="p-3 align-top">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${
                                  sla.isBreached
                                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                <Clock size={11} />
                                {sla.elapsedMinutes >= 60
                                  ? `${Math.floor(sla.elapsedMinutes / 60)} કલાક ${sla.elapsedMinutes % 60 ? `${sla.elapsedMinutes % 60} મિ.` : ""}`
                                  : `${sla.elapsedMinutes} મિ.`}{" "}
                                પેન્ડિંગ
                              </span>
                              <span className="text-[10.5px] text-slate-600 block leading-snug whitespace-normal break-words">
                                {sla.currentDeskGu}
                              </span>
                            </div>
                          </td>

                          {/* Workflow Stage */}
                          <td className="p-3 align-top">
                            {isApproved ? (
                              <div className="space-y-1.5">
                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 whitespace-nowrap">
                                  <Award size={11} className="text-emerald-700" /> e-Signed (મંજૂર)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCertificateModalApp(app)}
                                  className="text-[10.5px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer block hover:underline"
                                >
                                  <Award size={11} /> સત્તાવાર પ્રમાણપત્ર
                                </button>
                              </div>
                            ) : app.status === "rejected" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200 whitespace-nowrap">
                                સુધારણા જરૂરી
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200 whitespace-nowrap">
                                તબક્કો {app.workflowStage || 1}: સ્ક્રુટિની
                              </span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="p-3 align-top text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedApp(app);
                                setReviewModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-95 shadow-xs whitespace-nowrap"
                            >
                              ફાઇલ ખોલો
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive Cards View (Play Store Grade Native App Card Stack) */}
              <div className="md:hidden max-h-[640px] overflow-y-auto p-2 space-y-3 touch-pan-y">
                {filteredApplications.map((app, idx) => {
                  const sla = analyzeApplicationSla(app);
                  const isPaid = app.paymentStatus === "paid";
                  const isApproved = app.status === "approved" || app.workflowStage === 3;
                  const citizenNameDisplay = formatCitizenNameGu(app);
                  const schemeNameDisplay = app.schemeNameGu || app.schemeName || "આવકનું પ્રમાણપત્ર";

                  return (
                    <div
                      key={`${app.id}-${idx}`}
                      className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 text-xs transition active:scale-[0.99]"
                    >
                      {/* Card Header: App ID & SLA Pill */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg text-xs truncate">
                            {app.id}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono font-bold">
                            XXXX-{app.aadhaarLast4 || "1413"}
                          </span>
                        </div>
                        <span
                          className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                            sla.isBreached
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          <Clock size={11} className={sla.isBreached ? "text-rose-600 animate-spin" : ""} />
                          <span>{sla.elapsedMinutes} મિ.</span>
                          {sla.isBreached && <span className="text-rose-600 font-bold">(SLA)</span>}
                        </span>
                      </div>

                      {/* Citizen & Scheme Details (No text clipping) */}
                      <div className="space-y-1">
                        <p className="font-black text-slate-900 text-sm leading-snug">
                          {citizenNameDisplay}
                        </p>
                        <p className="text-slate-700 font-bold text-xs leading-normal">
                          {schemeNameDisplay}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span className="text-[10px] bg-amber-50 text-amber-950 border border-amber-300 px-2 py-0.5 rounded-md font-bold inline-flex items-center gap-1">
                            🏡 {cleanVillageOnly(app.village)}
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium">
                            📍 {formatGujaratiLocation(app.village, app.taluka, app.districtGu, app.district)}
                          </span>
                        </div>
                      </div>

                      {/* Status Badges Row */}
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                            <CheckCircle2 size={11} /> ચુકવણી પ્રમાણિત
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10.5px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                            <Clock size={11} /> ચલણ બાકી
                          </span>
                        )}

                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                            <Award size={11} /> e-Signed મંજૂર
                          </span>
                        ) : app.status === "rejected" ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full border border-rose-300">
                            સુધારણા જરૂરી
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10.5px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                            તબક્કો {app.workflowStage || 1}: સ્ક્રુટિની
                          </span>
                        )}
                      </div>

                      {/* Action Bar (Full width touch-friendly buttons min-h 44px) */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        {isApproved && (
                          <button
                            type="button"
                            onClick={() => setCertificateModalApp(app)}
                            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1 min-h-[44px] cursor-pointer"
                          >
                            <Award size={13} />
                            <span>પ્રમાણપત્ર</span>
                          </button>
                        )}

                        {isPaid && (
                          <button
                            type="button"
                            onClick={() => setReceiptModalApp(app)}
                            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 flex items-center gap-1 min-h-[44px] cursor-pointer"
                          >
                            <Receipt size={13} />
                            <span>પાવતી</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewModalOpen(true);
                          }}
                          className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs min-h-[44px] cursor-pointer"
                        >
                          <span>ફાઇલ સ્ક્રુટિની ખોલો</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: AI 15-MINUTE BOTTLENECK MONITOR
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "sla" && (
        <AiBottleneckMonitor
          applications={applications}
          onSelectApplication={(app) => {
            setSelectedApp(app);
            setReviewModalOpen(true);
          }}
          onEscalate={(appId, targetOfficer) => {
            setActionSuccessMsg(`અરજી ${appId} ને તાત્કાલિક ${targetOfficer} ના ડેસ્ક પર એસ્કેલેટ કરાઈ.`);
            setTimeout(() => setActionSuccessMsg(null), 5000);
          }}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: DYNAMIC POLICY CMS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "policy" && currentOfficer.canModifyPolicy && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                ⚙️ ગુજરાત સરકાર ઈ-ગવર્નન્સ પોલિસી એડમિન CMS
              </h3>
              <p className="text-xs text-slate-500">
                સરકારી ફી, જરૂરી પુરાવા નિયમો અને ૧૫-મિનિટ SLA મર્યાદા ડેવલપર વિના સીધા અહીંથી લાઈવ અપડેટ કરો.
              </p>
            </div>
            {policySavedAlert && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-xl flex items-center gap-1">
                <CheckCircle2 size={13} /> પોલિસી સફળતાપૂર્વક અપડેટ થઈ ગઈ!
              </span>
            )}
          </div>

          {/* Service Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Object.keys(policyConfigs).map((key) => {
              const cfg = policyConfigs[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPolicyKey(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    selectedPolicyKey === key
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <span>{cfg.serviceNameGu}</span>
                </button>
              );
            })}
          </div>

          {/* Policy Editor Form */}
          {policyConfigs[selectedPolicyKey] && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Official Fee */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    સરકારી ફી (₹ Government Fee)
                  </label>
                  <input
                    type="number"
                    value={policyConfigs[selectedPolicyKey].officialFee}
                    onChange={(e) =>
                      setPolicyConfigs((prev) => ({
                        ...prev,
                        [selectedPolicyKey]: {
                          ...prev[selectedPolicyKey],
                          officialFee: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* SLA Days */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    GRTSA કાનૂની નિકાલ દિવસો (SLA Days)
                  </label>
                  <input
                    type="number"
                    value={policyConfigs[selectedPolicyKey].slaDays}
                    onChange={(e) =>
                      setPolicyConfigs((prev) => ({
                        ...prev,
                        [selectedPolicyKey]: {
                          ...prev[selectedPolicyKey],
                          slaDays: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* 15-Minute SLA Alert */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    AI બોટલનેક એલર્ટ મર્યાદા (મિનિટ)
                  </label>
                  <input
                    type="number"
                    value={policyConfigs[selectedPolicyKey].slaAlertMinutes}
                    onChange={(e) =>
                      setPolicyConfigs((prev) => ({
                        ...prev,
                        [selectedPolicyKey]: {
                          ...prev[selectedPolicyKey],
                          slaAlertMinutes: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Mandatory Documents List */}
              <div className="text-xs space-y-1.5">
                <label className="block font-bold text-slate-700">
                  ફરજિયાત દસ્તાવેજો (Mandatory Checklist)
                </label>
                <div className="space-y-1">
                  {policyConfigs[selectedPolicyKey].mandatoryDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200"
                    >
                      <span className="font-bold text-slate-800">{doc}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        ફરજિયાત
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSavePolicy(policyConfigs[selectedPolicyKey])}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>પોલિસી સેવ કરો</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          APPLICATION REVIEW MODAL (WITH INTERACTIVE AI DOCUMENT INSPECTOR)
          ══════════════════════════════════════════════════════════════ */}
      {reviewModalOpen && selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl my-0 sm:my-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-300 text-slate-900 p-4 sm:p-6 space-y-4 max-h-[94vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Bottom Sheet Grab Indicator */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <h3 className="font-black text-sm sm:text-base text-slate-900 truncate">
                  અરજી વિગત & અધિકારી સ્ક્રુટિની ડેસ્ક &bull; {selectedApp.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* Applicant Profile Card (Zero Blank Fields & Zero Text Chopping) */}
            <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-white/80 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[11px] font-medium">અરજદારનું નામ:</span>
                <strong className="font-black text-slate-900 text-xs sm:text-sm block break-words">
                  {formatCitizenNameGu(selectedApp)}
                </strong>
              </div>
              <div className="bg-white/80 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[11px] font-medium">નાગરિક ઓળખ:</span>
                <strong className="font-mono font-bold text-amber-700 block">
                  GUJ-CIT-{selectedApp.aadhaarLast4 || "1413"}
                </strong>
              </div>
              <div className="bg-white/80 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[11px] font-medium">સ્થળ (ગામ / શહેર):</span>
                <strong className="font-bold text-slate-900 block break-words">
                  📍 {formatGujaratiLocation(selectedApp.village, selectedApp.taluka, selectedApp.districtGu, selectedApp.district)}
                </strong>
              </div>
              <div className="bg-white/80 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[11px] font-medium">અરજી તારીખ:</span>
                <strong className="font-bold text-slate-900 block">{selectedApp.appliedDate || "2026-09-28"}</strong>
              </div>
            </div>

            {/* 15-Minute SLA Status in Modal */}
            {(() => {
              const modalSla = analyzeApplicationSla(selectedApp);
              return (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2.5 ${
                    modalSla.isBreached
                      ? "bg-rose-50 border-rose-300 text-rose-950"
                      : "bg-amber-50 border-amber-300 text-amber-950"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={modalSla.isBreached ? "text-rose-600" : "text-amber-600"} />
                    <div>
                      <span className="font-black">
                        ૧-કલાક SLA સમયગાળો:{" "}
                        {modalSla.elapsedMinutes >= 60
                          ? `${Math.floor(modalSla.elapsedMinutes / 60)} કલાક ${modalSla.elapsedMinutes % 60 ? `${modalSla.elapsedMinutes % 60} મિ.` : ""}`
                          : `${modalSla.elapsedMinutes} મિનિટ`}{" "}
                        પેન્ડિંગ
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5">{modalSla.stuckReasonGu}</p>
                    </div>
                  </div>
                  {modalSla.isBreached && (
                    <span className="text-[10px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full shrink-0">
                      SLA બ્રીચ
                    </span>
                  )}
                </div>
              );
            })()}

            {/* ── INTERACTIVE AI DOCUMENT INSPECTOR & VIEWER ── */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <FileCheck size={14} className="text-indigo-600" />
                  <span>અપલોડ કરેલા અસલ દસ્તાવેજો (AI Vision OCR ઇન્સ્પેક્ટર)</span>
                </h4>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  AI ઓટો-વેરિફાઈડ
                </span>
              </div>

              {/* 3 Real Documents with Thumbnails & OCR Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Document 1: Identity / PAN / Aadhaar */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between hover:border-indigo-400 transition space-y-2">
                  <div className="space-y-1.5">
                    <div className="relative group overflow-hidden rounded-lg border border-slate-200 h-24 bg-slate-100 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/demo-docs/3_pan_card_khunt_harkishan.png"
                        alt="PAN/Aadhaar Proof"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setZoomDocImage({
                            src: "/demo-docs/3_pan_card_khunt_harkishan.png",
                            title: "ઓળખ પુરાવો (PAN / આધાર કાર્ડ)",
                            ocrData: {
                              "નામ (Name)": selectedApp.citizenNameGu || "હરી વિનોદરાઈ પટેલ",
                              "આધાર છેલ્લા ૪": `XXXX-${selectedApp.aadhaarLast4 || "1413"}`,
                              "AI OCR સ્કોર": "98.4% Match",
                              "ચકાસણી સ્થિતિ": "અસલ દસ્તાવેજ પ્રમાણિત",
                            },
                          })
                        }
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1 cursor-pointer"
                      >
                        <Maximize2 size={13} />
                        <span>ઝૂમ કરો</span>
                      </button>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">૧. ઓળખ પુરાવો (PAN/આધાર)</p>
                    <p className="text-[10px] text-slate-500 font-mono">UID: XXXX-{selectedApp.aadhaarLast4 || "1413"}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 self-start">
                    <CheckCircle2 size={10} /> AI માન્ય (98%)
                  </span>
                </div>

                {/* Document 2: Electricity Bill */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between hover:border-indigo-400 transition space-y-2">
                  <div className="space-y-1.5">
                    <div className="relative group overflow-hidden rounded-lg border border-slate-200 h-24 bg-slate-100 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/demo-docs/2_electricity_bill_pgvcl_gondal.png"
                        alt="Electricity Bill"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setZoomDocImage({
                            src: "/demo-docs/2_electricity_bill_pgvcl_gondal.png",
                            title: "રહેઠાણ પુરાવો (PGVCL લાઈટ બિલ)",
                            ocrData: {
                              "કન્ઝ્યુમર નં.": "PGVCL-8921-0421",
                              "સરનામું": formatGujaratiLocation(selectedApp.village, selectedApp.taluka, selectedApp.districtGu, selectedApp.district),
                              "બિલ તારીખ": "ઓગસ્ટ ૨૦૨૬",
                              "AI મેળ": "સરનામું ૧૦૦% મેળ ખાય છે",
                            },
                          })
                        }
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1 cursor-pointer"
                      >
                        <Maximize2 size={13} />
                        <span>ઝૂમ કરો</span>
                      </button>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">૨. રહેઠાણ (PGVCL વીજ બિલ)</p>
                    <p className="text-[10px] text-slate-500 font-mono">Cons: 8921-0421</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 self-start">
                    <CheckCircle2 size={10} /> AI માન્ય (95%)
                  </span>
                </div>

                {/* Document 3: Birth / Income Proof */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between hover:border-indigo-400 transition space-y-2">
                  <div className="space-y-1.5">
                    <div className="relative group overflow-hidden rounded-lg border border-slate-200 h-24 bg-slate-100 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/demo-docs/1_birth_certificate_khunt_harkishan.png"
                        alt="Birth/Income Proof"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setZoomDocImage({
                            src: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
                            title: "જન્મ / આવક આધાર પુરાવો",
                            ocrData: {
                              "પ્રમાણપત્ર નં.": "GJ-BIRTH-2026-0912",
                              "તલાટી સિક્કો": "સત્તાવાર રાઉન્ડ સીલ માન્ય",
                              "AI વિશ્વસનીયતા": "૯૪% ખરાઈ સફળ",
                            },
                          })
                        }
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1 cursor-pointer"
                      >
                        <Maximize2 size={13} />
                        <span>ઝૂમ કરો</span>
                      </button>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">૩. જન્મ/આવક પંચનામું</p>
                    <p className="text-[10px] text-slate-500 font-mono">તલાટી પંચનામું</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 self-start">
                    <CheckCircle2 size={10} /> AI માન્ય (94%)
                  </span>
                </div>
              </div>
            </div>

            {/* Gated Workflow Actions */}
            <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wide">
                  સત્તાવાર અધિકારી કાર્યવાહી (Action Gates)
                </h4>
                {/* Direct Receipt Slip Preview Button */}
                <button
                  type="button"
                  onClick={() => setReceiptModalApp(selectedApp)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-800 border border-blue-300 font-bold text-[11px] rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <Receipt size={12} className="text-blue-600" />
                  <span>સરકારી ચુકવણી પાવતી જુઓ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Gate 1: Payment Verification */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    ૧. ચુકવણી ખરાઈ (Payment Gate)
                  </span>
                  {selectedApp.paymentStatus === "paid" ? (
                    <div className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> ફી પ્રમાણિત (Txn: {selectedApp.txnId || "TXN-GJ-8921"})
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={() => handleVerifyPayment(selectedApp)}
                      className="w-full py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg transition cursor-pointer active:scale-95"
                    >
                      💰 ચુકવણી ખરાઈ કરો & પાવતી અનલૉક કરો
                    </button>
                  )}
                </div>

                {/* Gate 2: Mamlatdar Digital e-Sign */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    ૨. ડિજિટલ e-Sign & પ્રમાણપત્ર
                  </span>
                  {selectedApp.workflowStage === 3 || selectedApp.status === "approved" ? (
                    <button
                      type="button"
                      onClick={() => setCertificateModalApp(selectedApp)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Award size={14} /> <span>📜 સત્તાવાર પ્રમાણપત્ર જુઓ / પ્રિન્ટ</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={() => handleApproveEsign(selectedApp)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl transition cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-1.5 disabled:opacity-75"
                    >
                      <Award size={14} />
                      <span>{isProcessingAction ? "ડિજિટલ સહી થઈ રહી છે..." : "🖋️ ડિજિટલ સહી (e-Sign) મંજૂર કરો"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AI Local Gujarati Rejection Translator Cockpit */}
            <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2.5 bg-amber-50/20">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                <h4 className="font-black text-xs text-slate-900">
                  AI સ્થાનિક ગુજરાતી ભાષાંતરકાર (સુધારણા / રિજેક્શન નોંધ)
                </h4>
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="દા.ત. Electricity bill address does not match 7/12 land record"
                  value={rejectionInput}
                  onChange={(e) => setRejectionInput(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTranslateRejection}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles size={11} />
                    <span>AI ગુજરાતીમાં રૂપાંતર કરો</span>
                  </button>
                </div>
              </div>

              {/* Translated Output Preview */}
              {translatedRejection && (
                <div className="bg-white p-3 rounded-xl border-2 border-amber-300 space-y-1.5 text-xs animate-in fade-in duration-200">
                  <span className="font-black text-amber-900 block">
                    {translatedRejection.gujaratiTitle}
                  </span>
                  <p className="text-slate-800 leading-relaxed text-[11.5px]">
                    {translatedRejection.gujaratiExplanation}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-bold">
                    આગલું પગલું: {translatedRejection.nextStepGu}
                  </p>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={() => handleSubmitRejection(selectedApp)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                    >
                      નાગરિકની ટાઈમલાઈન પર નોંધ સબમિટ કરો
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DOCUMENT ZOOM LIGHTBOX MODAL ── */}
      {zoomDocImage && (
        <div
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setZoomDocImage(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-bold text-sm text-slate-900">{zoomDocImage.title}</h4>
              <button
                type="button"
                onClick={() => setZoomDocImage(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto bg-slate-100 rounded-2xl flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomDocImage.src}
                alt={zoomDocImage.title}
                className="max-h-[56vh] object-contain rounded-lg shadow-md"
              />
            </div>

            {zoomDocImage.ocrData && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                {Object.entries(zoomDocImage.ocrData).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-slate-500 text-[10.5px] block">{k}:</span>
                    <strong className="text-slate-900 font-bold">{v}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          OFFICIAL CERTIFICATE MODAL PREVIEW
          ══════════════════════════════════════════════════════════════ */}
      {certificateModalApp && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCertificateModalApp(null);
          }}
        >
          <OfficialGovernmentCertificate
            app={certificateModalApp}
            isModalPreview={true}
            onClose={() => setCertificateModalApp(null)}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          OFFICIAL RECEIPT SLIP MODAL PREVIEW
          ══════════════════════════════════════════════════════════════ */}
      {receiptModalApp && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReceiptModalApp(null);
          }}
        >
          <GovernmentReceiptSlip
            app={receiptModalApp}
            isModalPreview={true}
            onClose={() => setReceiptModalApp(null)}
          />
        </div>
      )}
    </div>
  );
}
