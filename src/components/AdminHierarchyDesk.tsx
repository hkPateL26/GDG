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

interface AdminHierarchyDeskProps {
  initialOfficer?: OfficerNode;
  onLogout: () => void;
}

export default function AdminHierarchyDesk({
  initialOfficer,
  onLogout,
}: AdminHierarchyDeskProps) {
  // Current active officer state (allows switching between 5 tiers)
  const [currentOfficer, setCurrentOfficer] = useState<OfficerNode>(() => {
    if (initialOfficer) {
      const match = HIERARCHICAL_OFFICERS.find((o) => o.id === initialOfficer.id);
      if (match) {
        return {
          ...match,
          ...initialOfficer,
          avatarEmoji: match.avatarEmoji,
          tierNameGu: match.tierNameGu,
          officeGu: match.officeGu,
        };
      }
      return initialOfficer;
    }
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("nagrik_officer_session");
        if (saved) {
          const parsed = JSON.parse(saved);
          const found = HIERARCHICAL_OFFICERS.find((o) => o.id === parsed.id);
          if (found) {
            return {
              ...found,
              ...parsed,
              avatarEmoji: found.avatarEmoji,
              tierNameGu: found.tierNameGu,
              officeGu: found.officeGu,
            };
          }
        }
      } catch {
        // fallback
      }
    }
    return HIERARCHICAL_OFFICERS[3]; // Default: Taluka Mamlatdar (H.V. Patel, GAS)
  });

  const [isOnLeave, setIsOnLeave] = useState<boolean>(currentOfficer.isOnLeave || false);
  const [actingOfficerName, setActingOfficerName] = useState<string>(
    currentOfficer.actingOfficerName || "કે. એમ. પંડ્યા, GAS (ઇન-ચાર્જ)"
  );

  // Active Desk Tab
  const [activeTab, setActiveTab] = useState<"queue" | "sla" | "policy">("queue");

  // Cascading Filters
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    return currentOfficer.canViewAllDistricts || currentOfficer.district === "All"
      ? "all"
      : currentOfficer.district;
  });
  const [selectedTaluka, setSelectedTaluka] = useState<string>(
    currentOfficer.taluka || "all"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [slaFilterOnly, setSlaFilterOnly] = useState<boolean>(false);

  // Dynamic real talukas for the selected district
  const availableTalukas = useMemo(() => {
    if (selectedDistrict === "all") {
      return Array.from(new Set(GUJARAT_DISTRICTS.flatMap((d) => d.talukas))).sort();
    }
    const distObj = GUJARAT_DISTRICTS.find(
      (d) => d.en.toLowerCase() === selectedDistrict.toLowerCase() || d.gu === selectedDistrict
    );
    return distObj ? distObj.talukas : [];
  }, [selectedDistrict]);

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

  // Fetch applications list
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDistrict !== "all") params.append("district", selectedDistrict);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("limit", "25");

      const res = await fetch(`/api/track?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.records) {
        let serverRecords: CitizenApplication[] = data.records;

        // Also merge client-side locally submitted applications so new submissions show immediately
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
  }, [selectedDistrict, selectedStatus, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 150);
    return () => clearTimeout(timer);
  }, [fetchApplications]);

  // Role Switcher Handler
  const handleRoleSwitch = (officerId: string) => {
    const target = HIERARCHICAL_OFFICERS.find((o) => o.id === officerId);
    if (!target) return;
    setCurrentOfficer(target);
    setIsOnLeave(target.isOnLeave);
    setActingOfficerName(target.actingOfficerName || "ઇન-ચાર્જ અધિકારી");

    if (target.canViewAllDistricts || target.district === "All") {
      setSelectedDistrict("all");
    } else {
      setSelectedDistrict(target.district);
    }

    // Default to "all" so switching role does not arbitrarily hide other talukas in the district
    setSelectedTaluka("all");

    sessionStorage.setItem("nagrik_officer_session", JSON.stringify(target));
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
          "તાલુકા મામલતદાર ડિજિટલ સહી (e-Sign) સફળ! સત્તાવાર પ્રમાણપત્ર જનરેટ થઈ ગયું છે અને નાગરિક માટે અનલૉક થયું."
        );
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

  // Filtered List with 15-Min SLA condition
  const filteredApplications = useMemo(() => {
    const seen = new Set<string>();
    return applications.filter((app) => {
      if (!app || !app.id || seen.has(app.id)) return false;
      seen.add(app.id);

      // Taluka filter
      if (selectedTaluka !== "all" && app.taluka !== selectedTaluka) return false;

      // 15-Minute SLA check
      if (slaFilterOnly) {
        const sla = analyzeApplicationSla(app);
        if (!sla.isBreached) return false;
      }
      return true;
    });
  }, [applications, selectedTaluka, slaFilterOnly]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 animate-in fade-in duration-200">
      {/* ── Officer Identity Header & Administrative Tier (Compact & Responsive) ── */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Officer Details */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
              {currentOfficer.avatarEmoji || "🏛️"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-base text-white truncate">{currentOfficer.name}</h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  {currentOfficer.tierNameGu}
                </span>
                {isOnLeave ? (
                  <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    ⚠️ રજા પર
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    ફરજ પર
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                {currentOfficer.designation} &bull; ID:{" "}
                <strong className="font-mono text-amber-300">{currentOfficer.id}</strong> (
                {currentOfficer.officeGu || currentOfficer.office || "કચેરી ડેસ્ક"})
              </p>
            </div>
          </div>

          {/* Quick Actions: Leave Protocol & Logout */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={handleToggleLeave}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isOnLeave
                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              <span>{isOnLeave ? "ફરજ પર હાજર" : "રજા નોંધાવો"}</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={12} />
              <span>લૉગઆઉટ</span>
            </button>
          </div>
        </div>

        {/* ── Role Switcher Bar (Compact Horizontal Slider) ── */}
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] text-slate-400 font-bold px-2 shrink-0 flex items-center gap-1">
            <Shield size={12} className="text-amber-400" /> સ્તર બદલો:
          </span>

          {HIERARCHICAL_OFFICERS.map((officer) => (
            <button
              key={officer.id}
              type="button"
              onClick={() => handleRoleSwitch(officer.id)}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition cursor-pointer text-[10.5px] ${
                currentOfficer.id === officer.id
                  ? "bg-amber-400 text-slate-950 shadow-xs font-black"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              <span>
                {officer.avatarEmoji} {officer.tierNameGu.split("-")[1] || officer.tierNameGu}
              </span>
            </button>
          ))}
        </div>

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

      {/* ── Navigation Tabs (Compact) ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === "queue"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText size={14} />
          <span>૧. અરજી સ્ક્રુટિની ડેસ્ક</span>
          <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
            {filteredApplications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sla")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === "sla"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <AlertTriangle size={14} className={activeTab === "sla" ? "text-white" : "text-rose-500"} />
          <span>૨. AI ૧૫-મિનિટ બોટલનેક મોનિટર</span>
        </button>

        {currentOfficer.canModifyPolicy && (
          <button
            type="button"
            onClick={() => setActiveTab("policy")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "policy"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sliders size={14} />
            <span>૩. ડાયનેમિક પોલિસી CMS</span>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {/* District Dropdown */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
                  જિલ્લો (District)
                </label>
                <select
                  value={selectedDistrict}
                  disabled={!currentOfficer.canViewAllDistricts}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedTaluka("all");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400 disabled:opacity-60 text-xs"
                >
                  {currentOfficer.canViewAllDistricts && <option value="all">તમામ ૩૩ જિલ્લા</option>}
                  {GUJARAT_DISTRICTS.map((d) => (
                    <option key={d.en} value={d.en}>
                      {d.gu} ({d.en})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Real Talukas Dropdown */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
                  તાલુકો (Taluka - {availableTalukas.length})
                </label>
                <select
                  value={selectedTaluka}
                  onChange={(e) => setSelectedTaluka(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400 text-xs"
                >
                  <option value="all">તમામ તાલુકા ({availableTalukas.length})</option>
                  {availableTalukas.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
                  સ્થિતિ (Status)
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400 text-xs"
                >
                  <option value="all">તમામ સ્થિતિ</option>
                  <option value="processing">ચકાસણી હેઠળ</option>
                  <option value="pending">સ્થળ તપાસ પેન્ડિંગ</option>
                  <option value="approved">મંજૂર (Approved)</option>
                  <option value="rejected">સુધારણા જરૂરી</option>
                </select>
              </div>

              {/* Search Bar */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
                  અરજી ID / નામ
                </label>
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="દા.ત. APP001..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-slate-900 font-bold focus:outline-hidden focus:ring-1 focus:ring-amber-400 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Quick 15-Minute SLA Toggle Pill */}
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
                <span>🚨 ૧૫+ મિ. અટવાયેલી (SLA Breached Only)</span>
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
              <div className="hidden md:block max-h-[560px] overflow-y-auto">
                <table className="w-full text-left text-xs">
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
                      const citizenNameDisplay = app.citizenNameGu || app.citizenName || "હરી વિનોદરાઈ પટેલ";
                      const schemeNameDisplay = app.schemeNameGu || app.schemeName || "આવકનું પ્રમાણપત્ર";
                      const locationDisplay = `${app.taluka || "ગોંડલ"}, ${app.districtGu || app.district || "રાજકોટ"}`;

                      return (
                        <tr key={`${app.id}-${idx}`} className="hover:bg-slate-50/80 transition">
                          {/* App ID & Citizen */}
                          <td className="p-3">
                            <span className="font-mono font-black text-slate-900 block">{app.id}</span>
                            <span className="font-bold text-slate-700 text-xs">
                              {citizenNameDisplay}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              UID: XXXX-{app.aadhaarLast4 || "1413"}
                            </span>
                          </td>

                          {/* Scheme & Office */}
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                              {schemeNameDisplay}
                            </span>
                            <span className="text-[10.5px] text-slate-500 block">
                              {locationDisplay}
                            </span>
                          </td>

                          {/* Payment & Receipt Gate */}
                          <td className="p-3">
                            {isPaid ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 size={10} /> ચુકવણી પ્રમાણિત
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setReceiptModalApp(app)}
                                  className="text-[10.5px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 block cursor-pointer"
                                >
                                  <Receipt size={10} /> સરકારી પાવતી જુઓ
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                  <Clock size={10} /> ચલણ ભરપાઈ બાકી
                                </span>
                                {currentOfficer.canVerifyPayment && (
                                  <button
                                    type="button"
                                    onClick={() => handleVerifyPayment(app)}
                                    className="text-[10px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2 py-0.5 rounded-lg transition cursor-pointer block"
                                  >
                                    ચુકવણી કન્ફર્મ કરો
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* 15-Minute SLA Status */}
                          <td className="p-3">
                            <div className="space-y-0.5">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  sla.isBreached
                                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                <Clock size={10} />
                                {sla.elapsedMinutes} મિ. પેન્ડિંગ
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                                {sla.currentDeskGu}
                              </span>
                            </div>
                          </td>

                          {/* Workflow Stage */}
                          <td className="p-3">
                            {isApproved ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                  <Award size={10} /> e-Signed (મંજૂર)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCertificateModalApp(app)}
                                  className="text-[10.5px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 block cursor-pointer"
                                >
                                  <Award size={10} /> સત્તાવાર પ્રમાણપત્ર
                                </button>
                              </div>
                            ) : app.status === "rejected" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                                સુધારણા જરૂરી
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                                તબક્કો {app.workflowStage || 1}: સ્ક્રુટિની
                              </span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedApp(app);
                                setReviewModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-95 shadow-xs"
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

              {/* Mobile Responsive Cards View (No cramped horizontal breakage!) */}
              <div className="md:hidden divide-y divide-slate-100 max-h-[560px] overflow-y-auto p-2 space-y-2">
                {filteredApplications.map((app, idx) => {
                  const sla = analyzeApplicationSla(app);
                  const isPaid = app.paymentStatus === "paid";
                  const isApproved = app.status === "approved" || app.workflowStage === 3;
                  const citizenNameDisplay = app.citizenNameGu || app.citizenName || "હરી વિનોદરાઈ પટેલ";
                  const schemeNameDisplay = app.schemeNameGu || app.schemeName || "આવકનું પ્રમાણપત્ર";
                  const locationDisplay = `${app.taluka || "ગોંડલ"}, ${app.districtGu || app.district || "રાજકોટ"}`;

                  return (
                    <div key={`${app.id}-${idx}`} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-slate-900">{app.id}</span>
                        <span
                          className={`text-[9.5px] font-black px-2 py-0.5 rounded-full ${
                            sla.isBreached
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          ⏱️ {sla.elapsedMinutes} મિ.
                        </span>
                      </div>

                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-snug">{citizenNameDisplay}</p>
                        <p className="text-slate-600 text-xs">{schemeNameDisplay}</p>
                        <p className="text-[11px] text-slate-500">{locationDisplay}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        {isPaid ? (
                          <span className="text-[10px] text-emerald-700 font-bold">✓ ફી ભરપાઈ</span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-bold">⚠️ ફી બાકી</span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewModalOpen(true);
                          }}
                          className="px-3 py-1 bg-slate-900 text-white font-bold rounded-lg text-xs"
                        >
                          ફાઇલ ખોલો →
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
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl my-auto bg-white rounded-3xl shadow-2xl border border-slate-300 text-slate-900 p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Applicant Profile Card (Zero Blank Fields!) */}
            <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">અરજદારનું નામ:</span>
                <strong className="font-bold text-slate-900">
                  {selectedApp.citizenNameGu || selectedApp.citizenName || "હરી વિનોદરાઈ પટેલ"}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">નાગરિક ઓળખ:</span>
                <strong className="font-mono font-bold text-amber-700">
                  GUJ-CIT-{selectedApp.aadhaarLast4 || "1413"}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">સ્થળ:</span>
                <strong className="font-bold text-slate-900">
                  {selectedApp.village || "ગોમતા"}, {selectedApp.taluka || "ગોંડલ"}, {selectedApp.districtGu || selectedApp.district || "રાજકોટ"}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">અરજી તારીખ:</span>
                <strong className="font-bold text-slate-900">{selectedApp.appliedDate || "2026-09-28"}</strong>
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
                        ૧૫-મિનિટ SLA સમયગાળો: {modalSla.elapsedMinutes} મિનિટ પેન્ડિંગ
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
                              "સરનામું": `${selectedApp.village || "ગોમતા"}, ${selectedApp.taluka || "ગોંડલ"}`,
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
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Award size={13} /> સત્તાવાર પ્રમાણપત્ર ખોલો
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessingAction || !currentOfficer.canApproveEsign}
                      onClick={() => handleApproveEsign(selectedApp)}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg transition cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      🖋️ ડિજિટલ સહી (e-Sign) મંજૂર કરો
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
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
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
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <OfficialGovernmentCertificate
            app={certificateModalApp}
            onClose={() => setCertificateModalApp(null)}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          OFFICIAL RECEIPT SLIP MODAL PREVIEW
          ══════════════════════════════════════════════════════════════ */}
      {receiptModalApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <GovernmentReceiptSlip
            app={receiptModalApp}
            onClose={() => setReceiptModalApp(null)}
          />
        </div>
      )}
    </div>
  );
}
