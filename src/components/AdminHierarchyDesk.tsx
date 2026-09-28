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
    if (initialOfficer) return initialOfficer;
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("nagrik_officer_session");
        if (saved) {
          const parsed = JSON.parse(saved);
          const found = HIERARCHICAL_OFFICERS.find((o) => o.id === parsed.id);
          if (found) return found;
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
  const [activeTab, setActiveTab] = useState<"queue" | "sla" | "policy" | "audit">("queue");

  // Cascading Filters
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    currentOfficer.canViewAllDistricts ? "all" : currentOfficer.district
  );
  const [selectedTaluka, setSelectedTaluka] = useState<string>(
    currentOfficer.taluka || "all"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [slaFilterOnly, setSlaFilterOnly] = useState<boolean>(false);

  // Data & Modal States
  const [applications, setApplications] = useState<CitizenApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<CitizenApplication | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [certificateModalApp, setCertificateModalApp] = useState<CitizenApplication | null>(null);
  const [receiptModalApp, setReceiptModalApp] = useState<CitizenApplication | null>(null);

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
        setApplications(data.records);
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

    if (target.district && target.district !== "All") {
      setSelectedDistrict(target.district);
    } else {
      setSelectedDistrict("all");
    }

    if (target.taluka) {
      setSelectedTaluka(target.taluka);
    } else {
      setSelectedTaluka("all");
    }

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
      // Simulate rejection update
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
    return applications.filter((app) => {
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Officer Identity Header & Administrative Tier ── */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border-2 border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Officer Details */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400/30 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {currentOfficer.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-lg text-white">{currentOfficer.name}</h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                  {currentOfficer.tierNameGu}
                </span>
                {isOnLeave ? (
                  <span className="text-[10.5px] bg-rose-500 text-white font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                    ⚠️ રજા પર (On Leave)
                  </span>
                ) : (
                  <span className="text-[10.5px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ફરજ પર હાજર
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-normal">
                {currentOfficer.designation} &bull; ID:{" "}
                <strong className="font-mono text-amber-300">{currentOfficer.id}</strong> ({currentOfficer.officeGu})
              </p>
            </div>
          </div>

          {/* Quick Actions: Leave Protocol & Logout */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Leave Protocol Toggle */}
            <button
              type="button"
              onClick={handleToggleLeave}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isOnLeave
                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              <span>{isOnLeave ? "ફરજ પર પાછા આવો" : "રજા નોંધાવો (Delegation)"}</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <LogOut size={13} />
              <span>લૉગઆઉટ</span>
            </button>
          </div>
        </div>

        {/* ── Role Switcher Bar (5 Administrative Tiers) ── */}
        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <Shield size={14} className="text-amber-400" />
            <span>વહીવટી હોદ્દો બદલો (Demo Switcher):</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {HIERARCHICAL_OFFICERS.map((officer) => (
              <button
                key={officer.id}
                type="button"
                onClick={() => handleRoleSwitch(officer.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-[11px] ${
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
        </div>

        {/* Leave Protocol Alert Banner if Officer is on Leave */}
        {isOnLeave && (
          <div className="bg-rose-950/80 border-2 border-rose-500/80 p-3.5 rounded-2xl text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-rose-300">
                ડેલિગેશન પ્રોટોકોલ સક્રિય: આપ હાલ રજા પર છો.
              </p>
              <p className="text-[11px] text-rose-200/90 mt-0.5">
                તમારા ડેસ્ક પર આવનારી તમામ અરજીઓ આપમેળે માન્ય ઇન-ચાર્જ અધિકારી{" "}
                <strong className="text-white">{actingOfficerName}</strong> ના ડેસ્ક પર ફોરવર્ડ થઈ રહી છે,
                જેથી જાહેર જનતાનું કોઈ પણ કામ અટકશે નહીં.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Global Alert Bar ── */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl text-emerald-950 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "queue"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText size={15} />
          <span>૧. અરજી સ્ક્રુટિની & મંજૂરી ડેસ્ક</span>
          <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full font-black">
            {filteredApplications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sla")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "sla"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <AlertTriangle size={15} className="text-rose-500" />
          <span>૨. AI ૧૫-મિનિટ બોટલનેક મોનિટર</span>
        </button>

        {currentOfficer.canModifyPolicy && (
          <button
            type="button"
            onClick={() => setActiveTab("policy")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "policy"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sliders size={15} />
            <span>૩. ડાયનેમિક પોલિસી CMS</span>
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: APPLICATION QUEUE & SCRUTINY
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          {/* Cascading Filter Controls */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* District Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  જિલ્લો (District Jurisdiction)
                </label>
                <select
                  value={selectedDistrict}
                  disabled={!currentOfficer.canViewAllDistricts}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
                >
                  {currentOfficer.canViewAllDistricts && <option value="all">તમામ ૩૩ જિલ્લા</option>}
                  {GUJARAT_DISTRICTS.map((d) => (
                    <option key={d.en} value={d.en}>
                      {d.gu} ({d.en})
                    </option>
                  ))}
                </select>
              </div>

              {/* Taluka Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  તાલુકો (Taluka Jurisdiction)
                </label>
                <select
                  value={selectedTaluka}
                  onChange={(e) => setSelectedTaluka(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                >
                  <option value="all">તમામ તાલુકા</option>
                  <option value="Gondal">ગોંડલ (Gondal)</option>
                  <option value="Rajkot Urban">રાજકોટ અર્બન (Rajkot Urban)</option>
                  <option value="Rajkot Rural">રાજકોટ ગ્રામ્ય (Rajkot Rural)</option>
                  <option value="Jetpur">જેતપુર (Jetpur)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  સ્થિતિ (Application Status)
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                >
                  <option value="all">તમામ અરજીઓ</option>
                  <option value="processing">ચકાસણી હેઠળ (Processing)</option>
                  <option value="pending">પેન્ડિંગ (Pending)</option>
                  <option value="approved">મંજૂર (Approved)</option>
                  <option value="rejected">સુધારણા જરૂરી (Rejected)</option>
                </select>
              </div>

              {/* Search Bar */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  અરજી ID / નાગરિક નામ
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="દા.ત. APP-GUJ-8421"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Quick 15-Minute SLA Toggle Pill */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSlaFilterOnly((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  slaFilterOnly
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <AlertTriangle size={13} className={slaFilterOnly ? "text-white" : "text-rose-500"} />
                <span>🚨 ફક્ત ૧૫+ મિનિટથી અટવાયેલી અરજીઓ (SLA Breached Only)</span>
              </button>

              <span className="text-xs text-slate-500">
                કુલ દર્શાવેલ રેકર્ડ્સ: <strong>{filteredApplications.length}</strong>
              </span>
            </div>
          </div>

          {/* Table / Queue with Skeleton UI */}
          {loading ? (
            <SkeletonAdminTable />
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                📭
              </div>
              <h4 className="font-black text-slate-900 text-base">કોઈ અરજી મળી નથી</h4>
              <p className="text-xs text-slate-500 mt-1">પસંદ કરેલા ફિલ્ટર્સ મુજબ કોઈ ડેટા ઉપલબ્ધ નથી.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white font-bold">
                    <tr>
                      <th className="p-3.5">અરજી ક્રમાંક & નાગરિક</th>
                      <th className="p-3.5">સેવા & કચેરી</th>
                      <th className="p-3.5">ચુકવણી & રસીદ સ્થિતિ</th>
                      <th className="p-3.5">૧૫-મિનિટ SLA ટ્રેકિંગ</th>
                      <th className="p-3.5">તબક્કો (Stage)</th>
                      <th className="p-3.5 text-right">કાર્યવાહી</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => {
                      const sla = analyzeApplicationSla(app);
                      const isPaid = app.paymentStatus === "paid";
                      const isApproved = app.status === "approved" || app.workflowStage === 3;

                      return (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition">
                          {/* App ID & Citizen */}
                          <td className="p-3.5">
                            <span className="font-mono font-black text-slate-900 block">{app.id}</span>
                            <span className="font-bold text-slate-700 text-[11.5px]">
                              {app.citizenNameGu || app.citizenName}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              UID: XXXX-{app.aadhaarLast4 || "1413"}
                            </span>
                          </td>

                          {/* Scheme & Office */}
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 block">
                              {app.schemeNameGu || app.schemeName}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {app.taluka}, {app.districtGu || app.district}
                            </span>
                          </td>

                          {/* Payment & Receipt Gate */}
                          <td className="p-3.5">
                            {isPaid ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[10.5px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 size={11} /> ચુકવણી પ્રમાણિત (Paid)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setReceiptModalApp(app)}
                                  className="text-[10.5px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 block cursor-pointer"
                                >
                                  <Printer size={10} /> સરકારી પાવતી જુઓ
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[10.5px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                  <Clock size={11} /> ચુકવણી બાકી / ચલણ
                                </span>
                                {currentOfficer.canVerifyPayment && (
                                  <button
                                    type="button"
                                    onClick={() => handleVerifyPayment(app)}
                                    className="text-[10px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2 py-0.5 rounded-lg transition cursor-pointer"
                                  >
                                    ચુકવણી કન્ફર્મ કરો
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* 15-Minute SLA Status */}
                          <td className="p-3.5">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-1 text-[10.5px] font-black px-2.5 py-0.5 rounded-full ${
                                  sla.isBreached
                                    ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                <Clock size={11} />
                                {sla.elapsedMinutes} મિનિટ પેન્ડિંગ
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
                                {sla.currentDeskGu}
                              </span>
                            </div>
                          </td>

                          {/* Workflow Stage */}
                          <td className="p-3.5">
                            {isApproved ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[10.5px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                                  <Award size={11} /> મંજૂર (e-Signed)
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
                              <span className="inline-flex items-center gap-1 text-[10.5px] bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                                સુધારણા જરૂરી (Returned)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10.5px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                                તબક્કો {app.workflowStage || 1}: સ્ક્રુટિની
                              </span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="p-3.5 text-right">
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
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                ⚙️ ગુજરાત સરકાર ઈ-ગવર્નન્સ પોલિસી એડમિન CMS
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                સરકારી ફી, જરૂરી પુરાવા નિયમો અને ૧૫-મિનિટ SLA મર્યાદા ડેવલપર વિના સીધા અહીંથી સંચાલિત કરો.
              </p>
            </div>
            {policySavedAlert && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-xl flex items-center gap-1">
                <CheckCircle2 size={13} /> પોલિસી સફળતાપૂર્વક અપડેટ થઈ ગઈ!
              </span>
            )}
          </div>

          {/* Service Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {Object.keys(policyConfigs).map((key) => {
              const cfg = policyConfigs[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPolicyKey(key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
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
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
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
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
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
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Mandatory Documents List */}
              <div className="text-xs space-y-2">
                <label className="block font-bold text-slate-700">
                  ફરજિયાત દસ્તાવેજો (Mandatory Upload Checklist)
                </label>
                <div className="space-y-1.5">
                  {policyConfigs[selectedPolicyKey].mandatoryDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200"
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
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSavePolicy(policyConfigs[selectedPolicyKey])}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>પોલિસી નિયમો સેવ કરો</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          APPLICATION REVIEW MODAL (OFFICER ACTION COCKPIT)
          ══════════════════════════════════════════════════════════════ */}
      {reviewModalOpen && selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-300 text-slate-900 p-5 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="font-black text-base text-slate-900">
                  અરજી વિગત & અધિકારી ખરાઈ ડેસ્ક &bull; {selectedApp.id}
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

            {/* Applicant Profile Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">અરજદારનું નામ:</span>
                <strong className="font-bold text-slate-900">
                  {selectedApp.citizenNameGu || selectedApp.citizenName}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">નાગરિક ઓળખ ક્રમાંક:</span>
                <strong className="font-mono font-bold text-amber-700">
                  GUJ-CIT-{selectedApp.aadhaarLast4 || "1413"}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">સ્થળ:</span>
                <strong className="font-bold text-slate-900">
                  {selectedApp.village}, {selectedApp.taluka}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">અરજી તારીખ:</span>
                <strong className="font-bold text-slate-900">{selectedApp.appliedDate}</strong>
              </div>
            </div>

            {/* 15-Minute SLA Status in Modal */}
            {(() => {
              const modalSla = analyzeApplicationSla(selectedApp);
              return (
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                    modalSla.isBreached
                      ? "bg-rose-50 border-rose-300 text-rose-950"
                      : "bg-amber-50 border-amber-300 text-amber-950"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={modalSla.isBreached ? "text-rose-600" : "text-amber-600"} />
                    <div>
                      <span className="font-black">
                        ૧૫-મિનિટ SLA સમયગાળો: {modalSla.elapsedMinutes} મિનિટ વીતી ગયા છે.
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5">{modalSla.stuckReasonGu}</p>
                    </div>
                  </div>
                  {modalSla.isBreached && (
                    <span className="text-[10.5px] bg-rose-600 text-white font-black px-2.5 py-1 rounded-full">
                      SLA બ્રીચ
                    </span>
                  )}
                </div>
              );
            })()}

            {/* Uploaded Documents List */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wide">
                અપલોડ કરેલા દસ્તાવેજો (AI સ્ક્રુટિની સ્થિતિ)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(selectedApp.documentsVerified && selectedApp.documentsVerified.length > 0
                  ? selectedApp.documentsVerified
                  : [
                      { name: "ઓળખ પુરાવો (આધાર કાર્ડ)", verified: true, qualityScore: 98 },
                      { name: "રહેઠાણ પુરાવો (લાઈટ બિલ)", verified: true, qualityScore: 95 },
                      { name: "તલાટી આવક પંચનામું", verified: true, qualityScore: 92 },
                    ]
                ).map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  >
                    <span className="font-bold text-slate-800">{doc.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> AI પ્રમાણિત ({doc.qualityScore}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gated Workflow Actions */}
            <div className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wide">
                સત્તાવાર અધિકારી કાર્યવાહી (Action Gates)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Gate 1: Payment Verification */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    ૧. સરકારી ચુકવણી ખરાઈ (Payment Gate)
                  </span>
                  {selectedApp.paymentStatus === "paid" ? (
                    <div className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> ચુકવણી પ્રમાણિત થઈ ચૂકી છે
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={() => handleVerifyPayment(selectedApp)}
                      className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg transition cursor-pointer active:scale-95"
                    >
                      💰 ચુકવણી ખરાઈ કરો & પાવતી અનલૉક કરો
                    </button>
                  )}
                </div>

                {/* Gate 2: Mamlatdar Digital e-Sign */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    ૨. ડિજિટલ e-Sign & પ્રમાણપત્ર ઇશ્યૂ
                  </span>
                  {selectedApp.workflowStage === 3 || selectedApp.status === "approved" ? (
                    <div className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <Award size={14} /> પ્રમાણપત્ર ઇ-સાઇન સાથે ઇશ્યૂ થયેલ છે
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessingAction || !currentOfficer.canApproveEsign}
                      onClick={() => handleApproveEsign(selectedApp)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg transition cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      🖋️ ડિજિટલ સહી (e-Sign) સાથે મંજૂર કરો
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AI Local Gujarati Rejection Translator Cockpit */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-amber-50/20">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-amber-600" />
                <h4 className="font-black text-xs text-slate-900">
                  AI સ્થાનિક ગુજરાતી ભાષાંતરકાર (સુધારણા / રિજેક્શન નોંધ)
                </h4>
              </div>

              <p className="text-[11px] text-slate-500">
                અધિકારી ટેકનિકલ અથવા અંગ્રેજીમાં કારણ લખશે તો AI આપમેળે તેને નાગરિક સમજી શકે તેવી નમ્ર, સ્પષ્ટ
                ગુજરાતી ભાષામાં રૂપાંતરિત કરશે.
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="દા.ત. Electricity bill address does not match 7/12 land record"
                  value={rejectionInput}
                  onChange={(e) => setRejectionInput(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTranslateRejection}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles size={12} />
                    <span>AI ગુજરાતીમાં રૂપાંતર કરો</span>
                  </button>
                </div>
              </div>

              {/* Translated Output Preview */}
              {translatedRejection && (
                <div className="bg-white p-3.5 rounded-xl border-2 border-amber-300 space-y-2 text-xs animate-in fade-in duration-200">
                  <span className="font-black text-amber-900 block">
                    {translatedRejection.gujaratiTitle}
                  </span>
                  <p className="text-slate-800 leading-relaxed">
                    {translatedRejection.gujaratiExplanation}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-bold">
                    આગલું પગલું: {translatedRejection.nextStepGu}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={() => handleSubmitRejection(selectedApp)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95"
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
