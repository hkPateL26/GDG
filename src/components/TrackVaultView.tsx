"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GUJARAT_DISTRICTS,
  CitizenApplication,
  CitizenLedgerProfile,
  getApplicationSLADetails,
} from "@/lib/large-datasets";
import {
  Search,
  Loader2,
  Sparkles,
  Printer,
  Lock,
  Receipt,
  X,
  Clock,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  Award,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GovernmentReceiptSlip from "@/components/GovernmentReceiptSlip";
import OfficialGovernmentCertificate from "@/components/OfficialGovernmentCertificate";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

type StatusType = "approved" | "processing" | "pending" | "rejected";

interface TrackStats {
  total: number;
  approved: number;
  processing: number;
  pending: number;
  rejected: number;
  disbursedCr: string;
}

const STATUS_CONFIG: Record<
  StatusType,
  { labelEn: string; labelGu: string; bg: string; border: string; textColor: string; badgeBg: string }
> = {
  approved: {
    labelEn: "Approved (DBT Transferred)",
    labelGu: "મંજૂર (સહાય જમા)",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    textColor: "text-emerald-800",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  processing: {
    labelEn: "In Verification",
    labelGu: "ચકાસણી ચાલુ",
    bg: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-800",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-300",
  },
  pending: {
    labelEn: "Field Verification Pending",
    labelGu: "સ્થળ તપાસ પેન્ડિંગ",
    bg: "bg-amber-50",
    border: "border-amber-200",
    textColor: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
  },
  rejected: {
    labelEn: "Action Required / Returned",
    labelGu: "પૂરક પુરાવા જરૂરી",
    bg: "bg-rose-50",
    border: "border-rose-200",
    textColor: "text-rose-800",
    badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
  },
};

interface TrackVaultViewProps {
  citizen: CitizenLedgerProfile;
  onNavigateToDocuments?: () => void;
  onNavigateToEligibility?: () => void;
  onOfficerClick?: () => void;
}

export default function TrackVaultView({
  citizen,
  onNavigateToDocuments,
}: TrackVaultViewProps) {
  const router = useRouter();
  // ── Mode: Citizen vs Officer ──
  const [authMode, setAuthMode] = useState<"citizen" | "officer">(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("nagrik_officer_session") ? "officer" : "citizen";
      } catch {
        return "citizen";
      }
    }
    return "citizen";
  });

  const [officerSession, setOfficerSession] = useState<{
    id: string;
    name: string;
    designation: string;
    district: string;
    taluka: string;
  } | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("nagrik_officer_session");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // ── Officer Modal States ──
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [officerIdInput, setOfficerIdInput] = useState("GUJ-GOV-9012");
  const [officerPinInput, setOfficerPinInput] = useState("GJ2026");
  const [officerLoading, setOfficerLoading] = useState(false);
  const [officerError, setOfficerError] = useState("");

  // ── Search & Records ──
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("id") || "";
    }
    return "";
  });
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [records, setRecords] = useState<CitizenApplication[]>([]);
  const [stats, setStats] = useState<TrackStats>({
    total: 5420,
    approved: 3845,
    processing: 1120,
    pending: 290,
    rejected: 165,
    disbursedCr: "₹ 14.85 Cr",
  });

  const [selectedApp, setSelectedApp] = useState<CitizenApplication | null>(null);
  const [showTimelineModal, setShowTimelineModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmingCash, setIsConfirmingCash] = useState(false);
  const [cashConfirmedAlert, setCashConfirmedAlert] = useState(false);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);
  const [stageUpdateAlert, setStageUpdateAlert] = useState<string | null>(null);

  // Freeze background scrolling when any modal is open
  useBodyScrollLock(Boolean(showTimelineModal || showPrintModal || showCertificateModal || showOfficerModal));

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPrintModal) {
          setShowPrintModal(false);
        } else if (showCertificateModal) {
          setShowCertificateModal(false);
        } else if (showTimelineModal) {
          setShowTimelineModal(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPrintModal, showCertificateModal, showTimelineModal]);

  // Load Citizen Vault on Mount or Citizen Prop change
  const loadCitizenVault = useCallback(async (mobile: string, aadhaarLast4?: string, targetId?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_citizen_profile",
          mobile,
          aadhaarLast4,
        }),
      });
      const data = await res.json();
      if (data.success && data.citizen) {
        const myApps: CitizenApplication[] = data.citizen.activeApplications || [];

        // Also merge client-side locally submitted applications so new submissions never vanish
        let localApps: CitizenApplication[] = [];
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("nagrik_user_applications");
            if (raw) localApps = JSON.parse(raw);
          } catch (e) {
            console.warn("Local storage parse error:", e);
          }
        }

        const combined = [...localApps, ...myApps];
        const seen = new Set<string>();
        const uniqueApps: CitizenApplication[] = [];
        for (const a of combined) {
          if (a && a.id && !seen.has(a.id)) {
            seen.add(a.id);
            uniqueApps.push(a);
          }
        }
        setRecords(uniqueApps);

        const activeTargetId = targetId || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") : "");
        if (activeTargetId) {
          const found = uniqueApps.find((a) => a.id.toLowerCase() === activeTargetId.toLowerCase());
          if (found) {
            setSelectedApp(found);
            setShowTimelineModal(true);
          }
        } else if (uniqueApps.length > 0) {
          setSelectedApp(uniqueApps[0]);
        }
      } else {
        setError(data.error || "તમારી અરજીઓ લોડ કરવામાં સમસ્યા આવી.");
      }
    } catch (err) {
      console.error("Failed to load citizen vault:", err);
      setError("સર્વર ક્ષતિ આવી.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (citizen && citizen.mobile) {
      const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const idParam = urlParams ? urlParams.get("id") || undefined : undefined;
      const timer = setTimeout(() => {
        loadCitizenVault(citizen.mobile, citizen.aadhaarLast4, idParam);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [citizen, loadCitizenVault]);

  // Load Master Registry (For Officer Mode)
  const loadOfficerData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (selectedDistrict !== "all") params.append("district", selectedDistrict);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      params.append("page", String(page));
      params.append("limit", String(limit));

      const res = await fetch(`/api/track?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        if (data.records) {
          const seen = new Set<string>();
          const uniqueRecords: CitizenApplication[] = [];
          for (const a of data.records) {
            if (a && a.id && !seen.has(a.id)) {
              seen.add(a.id);
              uniqueRecords.push(a);
            }
          }
          setRecords(uniqueRecords);
          if (data.stats) setStats(data.stats);

          if (uniqueRecords.length === 1 && searchQuery.trim().toUpperCase().startsWith("APP")) {
            setSelectedApp(uniqueRecords[0]);
          }
        } else if (data.application) {
          setSelectedApp(data.application);
          setRecords([data.application]);
        }
      } else {
        setError(data.error || "કોઈ અરજી મળી નથી.");
      }
    } catch (err) {
      console.error("Data load error:", err);
      setError("ડેટા લોડ કરવામાં મુશ્કેલી આવી.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDistrict, selectedStatus, page, limit]);

  useEffect(() => {
    if (authMode === "officer") {
      const timer = setTimeout(() => {
        loadOfficerData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [authMode, loadOfficerData]);

  const handleOfficerLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOfficerLoading(true);
    setOfficerError("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_officer",
          officerId: officerIdInput,
          pin: officerPinInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.officer) {
        sessionStorage.setItem("nagrik_officer_session", JSON.stringify(data.officer));
        sessionStorage.setItem("nagrik_authenticated_officer", JSON.stringify(data.officer));
        setOfficerSession(data.officer);
        setAuthMode("officer");
        setShowOfficerModal(false);
        loadOfficerData();
      } else {
        setOfficerError(data.error || "અમાન્ય કર્મચારી ID અથવા PIN.");
      }
    } catch {
      setOfficerError("કચેરી સર્વર કનેક્શનમાં ક્ષતિ.");
    } finally {
      setOfficerLoading(false);
    }
  };

  const handleOfficerLogout = () => {
    sessionStorage.removeItem("nagrik_officer_session");
    sessionStorage.removeItem("nagrik_authenticated_officer");
    setOfficerSession(null);
    setAuthMode("citizen");
    if (citizen) loadCitizenVault(citizen.mobile, citizen.aadhaarLast4);
  };

  const handleConfirmCashPayment = async () => {
    if (!selectedApp) return;
    setIsConfirmingCash(true);
    try {
      const res = await fetch("/api/track", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          action: "confirm_cash_payment",
          operatorId: "JSK-OP-8921",
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setSelectedApp(data.application);
        setRecords((prev) => prev.map((a) => (a.id === data.application.id ? data.application : a)));
        setCashConfirmedAlert(true);
        setTimeout(() => setCashConfirmedAlert(false), 5000);
      } else {
        alert(data.error || "રોકડ પાવતી ચકાસવામાં સમસ્યા આવી.");
      }
    } catch {
      alert("સર્વર ક્ષતિ આવી.");
    } finally {
      setIsConfirmingCash(false);
    }
  };

  const handleAdvanceStage = async (newStage: number, newStatus: string, targetApp?: CitizenApplication) => {
    const appToUpdate = targetApp || selectedApp;
    if (!appToUpdate) return;
    setIsUpdatingStage(true);
    try {
      const res = await fetch("/api/track", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appToUpdate.id,
          action: "update_workflow_stage",
          stage: newStage,
          newStage,
          newStatus,
          officerRole: officerSession?.designation || officerSession?.name || "તાલુકા મામલતદાર, ગોંડલ",
          officerName: officerSession?.name || "મામલતદાર, ગોંડલ",
          officerId: officerSession?.id || "GUJ-GOV-9012",
          pin: "GJ2026",
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setSelectedApp(data.application);
        setRecords((prev) => prev.map((a) => (a.id === data.application.id ? data.application : a)));
        setStageUpdateAlert(`અરજી તબક્કો સફળતાપૂર્વક અપડેટ થયો: ${newStatus}`);
        setTimeout(() => setStageUpdateAlert(null), 5000);
      } else {
        alert(data.error || "વર્કફ્લો અપડેટ કરવામાં ક્ષતિ આવી.");
      }
    } catch {
      alert("સર્વર ક્ષતિ આવી.");
    } finally {
      setIsUpdatingStage(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (authMode === "officer") {
      setPage(1);
      loadOfficerData();
    } else {
      const q = searchQuery.trim().toLowerCase();
      let myApps = citizen.activeApplications || [];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("nagrik_user_applications");
          if (raw) {
            const localApps = JSON.parse(raw);
            myApps = [...localApps, ...myApps];
          }
        } catch {}
      }
      if (!q) {
        setRecords(myApps);
      } else {
        const filtered = myApps.filter(
          (a) =>
            a.id.toLowerCase().includes(q) ||
            a.schemeName.toLowerCase().includes(q) ||
            a.schemeNameGu.toLowerCase().includes(q)
        );
        setRecords(filtered);
      }
    }
  };

  const handleReApply = (app: CitizenApplication) => {
    if (typeof window !== "undefined") {
      let mappedServiceId = "income";
      let mappedMode: "new" | "update" = "update";
      if (app.schemeId === "ration" || app.schemeId.includes("ration")) {
        mappedServiceId = "ration";
        mappedMode = "update";
      } else if (app.schemeId === "income" || app.schemeId.includes("income")) {
        mappedServiceId = "income";
        mappedMode = "new";
      } else if (app.schemeId === "caste" || app.schemeId.includes("caste")) {
        mappedServiceId = "caste";
        mappedMode = "new";
      } else if (app.schemeId === "pan" || app.schemeId.includes("pan")) {
        mappedServiceId = "pan";
        mappedMode = "update";
      } else if (app.schemeId === "aadhaar" || app.schemeId.includes("aadhaar")) {
        mappedServiceId = "aadhaar";
        mappedMode = "update";
      }

      sessionStorage.setItem(
        "nagrik_reapply_context",
        JSON.stringify({
          appId: app.id,
          schemeId: app.schemeId,
          serviceId: mappedServiceId,
          serviceMode: mappedMode,
          schemeNameGu: app.schemeNameGu,
          remarksGu: app.remarksGu,
          officerDesignation: app.officerDesignation,
          appliedDate: app.appliedDate,
          lastUpdated: app.lastUpdated,
        })
      );
    }

    if (onNavigateToDocuments) {
      onNavigateToDocuments();
    } else {
      router.push(`/documents?service=${app.schemeId}&reapply=${app.id}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">


      {/* ── Dynamic Alerts & Scrutiny Confirmation Notifications ── */}
      {cashConfirmedAlert && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in shadow-xs">
          <span>✓ ચલણ ફી રોકડમાં સ્વીકારી લેવાઈ છે. પ્રમાણપત્ર અનલૉક થઈ ગયું છે.</span>
          <button type="button" onClick={() => setCashConfirmedAlert(false)} className="text-emerald-700 hover:text-emerald-900 px-2 font-black">✕</button>
        </div>
      )}
      {stageUpdateAlert && (
        <div className="bg-blue-50 border border-blue-300 text-blue-800 p-3 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in shadow-xs">
          <span>{stageUpdateAlert}</span>
          <button type="button" onClick={() => setStageUpdateAlert(null)} className="text-blue-700 hover:text-blue-900 px-2 font-black">✕</button>
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 font-bold">
          <Loader2 size={14} className="animate-spin text-orange-600" />
          <span>કચેરી ડેટા લોડ થઈ રહ્યો છે...</span>
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in shadow-xs">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-rose-700 hover:text-rose-900 px-2 font-black">✕</button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODE 1: CITIZEN PRIVATE VAULT
         ══════════════════════════════════════════════════════════════ */}
      {authMode === "citizen" && (
        <div className="space-y-6">
          {/* Active Applications Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                <span>📋 મારી સરકારી અરજીઓ (My Applications)</span>
                <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {records.length} અરજી
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                તમારા દ્વારા ઓનલાઇન સબમિટ થયેલ તમામ દસ્તાવેજો અને યોજનાઓનું લાઈવ સ્ટેટસ.
              </p>
            </div>

            {/* Quick Search in My Apps */}
            <div className="w-full sm:w-64">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={handleSearchSubmit}
                  placeholder="અરજી નંબરથી ફિલ્ટર..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Citizen's Application Cards Grid */}
          {records.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
              <div className="text-4xl">📄</div>
              <h4 className="font-bold text-slate-800 text-base">કોઈ અરજી મળી નથી</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                તમે હજુ સુધી કોઈ નવી સરકારી સેવા કે સુધારા માટે અરજી કરી નથી.
              </p>
              {onNavigateToDocuments ? (
                <button
                  type="button"
                  onClick={onNavigateToDocuments}
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
                >
                  <Sparkles size={14} />
                  <span>નવા દસ્તાવેજ માટે અરજી કરો →</span>
                </button>
              ) : (
                <Link
                  href="/documents"
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
                >
                  <Sparkles size={14} />
                  <span>નવા દસ્તાવેજ માટે અરજી કરો →</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {records.map((app, idx) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.processing;
                const isSelected = selectedApp?.id === app.id;
                const sla = getApplicationSLADetails(app);

                return (
                  <div
                    key={`${app.id}-${idx}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedApp(app);
                      setShowTimelineModal(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedApp(app);
                        setShowTimelineModal(true);
                      }
                    }}
                    className={`group bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                      isSelected && showTimelineModal
                        ? "border-orange-500 ring-2 ring-orange-200 bg-orange-50/20"
                        : "border-slate-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                          {app.schemeEmoji}
                        </span>
                        <div className="min-w-0">
                          <span className="font-mono font-bold text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                            {app.id}
                          </span>
                          <h4 className="font-bold text-sm sm:text-base text-slate-800 mt-1 leading-snug">
                            {app.schemeNameGu}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{app.schemeName}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10.5px] px-2.5 py-1 rounded-full font-bold border shrink-0 ${cfg.badgeBg}`}
                      >
                        {cfg.labelGu}
                      </span>
                    </div>

                    {/* Official SLA Pill & Duration */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                        <Clock size={11} className="text-slate-500" />
                        <span>સમયમર્યાદા: {sla.slaLabelGu}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold border ${sla.statusColor}`}>
                        {sla.statusBadgeGu}
                      </span>
                    </div>

                    {/* Officer Status Highlight Callout in Card */}
                    {app.status === "rejected" && (
                      <div className="mt-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-950 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-extrabold text-rose-900 block leading-tight">
                            ⚠️ કચેરી કારણ: {app.remarksGu}
                          </span>
                          <span className="text-[10px] text-rose-700 block mt-0.5">
                            અધિકારી: {app.officerDesignation}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReApply(app);
                          }}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black rounded-lg text-[10.5px] transition shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <RotateCw size={11} />
                          <span>પુનઃ અરજી</span>
                        </button>
                      </div>
                    )}

                    {app.status === "processing" && (
                      <div className="mt-2 p-2 bg-blue-50/80 border border-blue-200 rounded-xl text-[11px] text-blue-950 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
                        <span className="truncate"><strong>સ્ક્રુટિની ચાલુ:</strong> {app.remarksGu}</span>
                      </div>
                    )}

                    {app.status === "approved" && app.benefitAmount > 0 && (
                      <div className="mt-2 p-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center justify-between">
                        <span>✓ દસ્તાવેજ ખરાઈ સફળ</span>
                        <span className="font-black text-emerald-800">DBT ₹{app.benefitAmount.toLocaleString("en-IN")} જમા</span>
                      </div>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        તારીખ: <strong className="text-slate-700">{app.appliedDate}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                            setShowPrintModal(true);
                          }}
                          className="text-xs font-bold text-slate-600 hover:text-orange-600 flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                        >
                          <Printer size={13} />
                          <span>પહોંચ (PDF)</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                            setShowTimelineModal(true);
                          }}
                          className="text-xs font-black text-orange-600 hover:text-white hover:bg-orange-600 bg-orange-50 active:scale-95 px-2.5 py-1 rounded-lg border border-orange-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Eye size={13} />
                          <span>ટ્રેકિંગ વિગતો ↗</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Citizen Application Live Timeline & Stages Detail Modal Popup ── */}
          {showTimelineModal && selectedApp && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="timeline-modal-title"
              className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowTimelineModal(false);
              }}
            >
              <div
                className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-orange-400 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ── Modal Header (Sticky) ── */}
                <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white p-3.5 sm:p-5 flex items-center justify-between gap-3 shrink-0 shadow-sm">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <span className="text-2xl sm:text-3xl p-1.5 sm:p-2 bg-white/20 backdrop-blur-xs rounded-xl sm:rounded-2xl border border-white/20 shrink-0 shadow-inner">
                      {selectedApp.schemeEmoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="font-mono font-black text-[11px] sm:text-xs text-orange-950 bg-white/95 px-2 py-0.5 rounded-md shadow-2xs">
                          અરજી નં: {selectedApp.id}
                        </span>
                        <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${(STATUS_CONFIG[selectedApp.status] || STATUS_CONFIG.processing).badgeBg}`}>
                          {(STATUS_CONFIG[selectedApp.status] || STATUS_CONFIG.processing).labelGu}
                        </span>
                      </div>
                      <h3 id="timeline-modal-title" className="text-sm sm:text-lg font-black text-white mt-1 leading-snug truncate">
                        {selectedApp.schemeNameGu}
                      </h3>
                      <p className="text-[10.5px] sm:text-xs text-orange-100 truncate">
                        {selectedApp.schemeName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTimelineModal(false)}
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-black/20 hover:bg-black/40 active:scale-95 text-white rounded-full flex items-center justify-center transition shrink-0 cursor-pointer"
                    title="બંધ કરો (Esc)"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* ── Modal Body (Scrollable, Responsive, Nothing Cut Off) ── */}
                <div className="overflow-y-auto p-3.5 sm:p-6 space-y-4 text-slate-800 touch-pan-y">
                  {/* Applicant Meta Pill */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-slate-700">
                      <span className="text-slate-500 font-medium">અરજદાર: </span>
                      <strong className="text-slate-900">{selectedApp.citizenNameGu}</strong> ({selectedApp.citizenName})
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span>📱 +91 {selectedApp.mobile}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      📍 {selectedApp.village ? `${selectedApp.village}, ` : ""}{selectedApp.taluka}, {selectedApp.districtGu}
                    </div>
                  </div>

                  {/* 1. Official SLA Duration & Guaranteed Resolution Target */}
                  {(() => {
                    const sla = getApplicationSLADetails(selectedApp);
                    return (
                      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200/70 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-xs shrink-0">
                              ⏱️
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 flex-wrap">
                                <span>સરકારી સેવા સમયમર્યાદા (Citizen Charter SLA)</span>
                                <span className="bg-orange-600 text-white text-[10px] sm:text-[10.5px] px-2 py-0.2 rounded-full font-bold">
                                  {sla.slaLabelGu}
                                </span>
                              </h4>
                              <p className="text-[10.5px] sm:text-[11px] text-slate-600 mt-0.5">
                                {sla.actSectionGu}
                              </p>
                            </div>
                          </div>

                          <span className={`text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full font-black border shadow-2xs self-start sm:self-auto ${sla.statusColor}`}>
                            {sla.statusBadgeGu}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 text-xs">
                          <div className="bg-white/90 p-2 sm:p-2.5 rounded-xl border border-orange-100 shadow-2xs">
                            <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-bold block uppercase truncate">અરજી સબમિટ તારીખ</span>
                            <strong className="text-slate-800 text-xs sm:text-sm font-mono">{selectedApp.appliedDate}</strong>
                          </div>
                          <div className="bg-white/90 p-2 sm:p-2.5 rounded-xl border border-orange-100 shadow-2xs">
                            <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-bold block uppercase truncate">અપેક્ષિત નિકાલ તારીખ</span>
                            <strong className="text-orange-700 text-xs sm:text-sm font-mono">{sla.targetDateStr}</strong>
                          </div>
                          <div className="bg-white/90 p-2 sm:p-2.5 rounded-xl border border-orange-100 shadow-2xs">
                            <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-bold block uppercase truncate">સક્ષમ કચેરી / સત્તાધિકારી</span>
                            <strong className="text-slate-800 text-[11px] sm:text-[11.5px] leading-tight block break-words" title={sla.authorityGu}>{sla.authorityGu}</strong>
                          </div>
                          <div className="bg-white/90 p-2 sm:p-2.5 rounded-xl border border-orange-100 shadow-2xs">
                            <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-bold block uppercase truncate">છેલ્લું સ્થિતિ અપડેટ</span>
                            <strong className="text-slate-800 text-xs sm:text-sm font-mono">{selectedApp.lastUpdated}</strong>
                          </div>
                        </div>

                        <p className="text-[10.5px] sm:text-[11px] text-slate-600 italic leading-snug">
                          📌 <strong>કચેરી નિયમ:</strong> {sla.descriptionGu}
                        </p>
                      </div>
                    );
                  })()}

                  {/* 2. Official Scrutiny Remarks & Officer Reasons */}
                  {selectedApp.status === "rejected" && (
                    <div className="p-3.5 sm:p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-3 shadow-xs animate-in fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-rose-200 pb-2.5">
                        <div className="flex items-center gap-2 text-rose-950">
                          <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                          <span className="font-black text-xs sm:text-sm">
                            🚨 કચેરી સ્ક્રુટિની આદેશ: અરજી પરત / પૂરક પુરાવા જરૂરી (Action Required)
                          </span>
                        </div>
                        <span className="text-[9.5px] sm:text-[10px] font-bold bg-rose-200 text-rose-950 px-2 py-0.5 rounded-full border border-rose-300 self-start sm:self-auto font-mono">
                          GJ-REV-REJ-{selectedApp.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
                          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wide block">
                            સત્તાવાર કારણ (Official Rejection Reason)
                          </span>
                          <p className="text-rose-950 font-bold leading-relaxed text-xs sm:text-[13px]">
                            {selectedApp.remarksGu}
                          </p>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block">
                            ચકાસણી કરનાર સત્તાવાર અધિકારી
                          </span>
                          <p className="text-slate-900 font-bold">
                            {selectedApp.officerDesignation}
                          </p>
                          <p className="text-[10.5px] text-slate-500">
                            સ્થળ: {selectedApp.taluka} તાલુકા સેવા સદન, {selectedApp.districtGu}
                          </p>
                        </div>
                      </div>

                      <div className="bg-rose-100/70 p-3 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="text-xs text-rose-950 space-y-0.5">
                          <p className="font-extrabold flex items-center gap-1.5">
                            <span>💡 નાગરિક માટે ત્વરિત ઉકેલ:</span>
                          </p>
                          <p className="text-[10.5px] text-rose-800 leading-snug">
                            તમારી વિગતો સુરક્ષિત છે. માત્ર માંગેલ પૂરક પુરાવો અપલોડ કરી ૧-ક્લિકમાં પુનઃ અરજી કરો.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setShowTimelineModal(false);
                            handleReApply(selectedApp);
                          }}
                          className="px-3 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 text-white font-black rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <RotateCw size={13} />
                          <span>પુનઃ અરજી કરો (Re-Apply)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === "processing" && (
                    <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2 text-xs shadow-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-blue-900 font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                          <span className="font-black text-xs sm:text-sm">કચેરી સ્ક્રુટિની & રેકોર્ડ ખરાઈ ચાલુ (Under Scrutiny)</span>
                        </div>
                        <span className="text-[10px] bg-blue-200/80 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                          તબક્કો ૨ ચાલુ
                        </span>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100 text-blue-950 space-y-1">
                        <p>
                          <strong>કચેરી નોંધ:</strong> {selectedApp.remarksGu}
                        </p>
                        <p className="text-[11px] text-blue-700">
                          <strong>ચકાસણી અધિકારી:</strong> {selectedApp.officerDesignation}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === "pending" && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs shadow-xs">
                      <div className="flex items-center gap-2 text-amber-900 font-bold">
                        <Clock size={16} className="text-amber-600 shrink-0" />
                        <span className="font-black text-xs sm:text-sm">સ્થળ તપાસ / પંચનામા રિપોર્ટ પેન્ડિંગ (Field Inspection)</span>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100 text-amber-950 space-y-1">
                        <p>
                          <strong>વિગત:</strong> {selectedApp.remarksGu}
                        </p>
                        <p className="text-[11px] text-amber-700">
                          <strong>તપાસકર્તા:</strong> {selectedApp.officerDesignation}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === "approved" && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs shadow-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold">
                          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                          <span className="font-black text-xs sm:text-sm">સત્તાવાર મંજૂરી આદેશ સંપન્ન (Sanctioned & Approved)</span>
                        </div>
                        {selectedApp.benefitAmount > 0 && (
                          <span className="bg-emerald-200 text-emerald-950 font-black px-2.5 py-0.5 rounded-full text-xs">
                            DBT સહાય: ₹{selectedApp.benefitAmount.toLocaleString("en-IN")} જમા
                          </span>
                        )}
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-emerald-950 space-y-1">
                        <p>
                          <strong>મંજૂરી નોંધ:</strong> {selectedApp.remarksGu}
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          <strong>મંજૂર કરનાર સત્તાધિકારી:</strong> {selectedApp.officerDesignation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3. Smart 3-Step Visual Progress Workflow Pipeline */}
                  {(() => {
                    const currentStage = selectedApp.workflowStage || (selectedApp.status === "approved" ? 3 : selectedApp.status === "rejected" ? 2 : 2);
                    const isRejected = selectedApp.status === "rejected";
                    const isApproved = selectedApp.status === "approved";
                    const sla = getApplicationSLADetails(selectedApp);

                    return (
                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                            <span>🏛️ લાઈવ સ્ક્રુટિની ટ્રેકિંગ પાઈપલાઈન (Live Scrutiny Pipeline)</span>
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            તબક્કો {isApproved ? "૩/૩ (પૂર્ણ)" : isRejected ? "૨/૩ (અટકેલ)" : "૨/૩ (ચાલુ)"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                          {/* Stage 1 */}
                          <div className="p-3 sm:p-3.5 rounded-2xl border bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black bg-emerald-600 text-white shrink-0">
                                ✓
                              </span>
                              <div className="min-w-0">
                                <p className="font-extrabold text-xs">તબક્કો ૧: ઓનલાઇન સ્વીકૃતિ</p>
                                <p className="text-[10px] text-emerald-700">{selectedApp.appliedDate}</p>
                              </div>
                            </div>
                            <p className="text-[11px] mt-2 text-slate-600 leading-snug">
                              અરજી સ્વીકૃત. આધાર e-KYC અને AI દસ્તાવેજ ચકાસણી ૧૦૦% સફળ.
                            </p>
                          </div>

                          {/* Stage 2 */}
                          <div className={`p-3 sm:p-3.5 rounded-2xl border shadow-2xs ${
                            isRejected
                              ? "bg-rose-50 border-rose-300 text-rose-900"
                              : isApproved || currentStage >= 2
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : "bg-blue-50 border-blue-300 text-blue-900"
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                isRejected
                                  ? "bg-rose-600 text-white"
                                  : isApproved
                                  ? "bg-emerald-600 text-white"
                                  : "bg-blue-600 text-white animate-pulse"
                              }`}>
                                {isRejected ? "✕" : isApproved ? "✓" : "૨"}
                              </span>
                              <div className="min-w-0">
                                <p className="font-extrabold text-xs">તબક્કો ૨: કચેરી સ્ક્રુટિની</p>
                                <p className="text-[10px] text-slate-500">સમયમર્યાદા: {sla.slaLabelGu}</p>
                              </div>
                            </div>
                            <p className="text-[11px] mt-2 text-slate-600 leading-snug">
                              {isRejected
                                ? "પૂરક પુરાવા જરૂરી હોવાથી અરજી પરત કરાઈ છે."
                                : isApproved
                                ? "મામલતદાર / વિસ્તરણ અધિકારી ખરાઈ સફળ."
                                : "રેકોર્ડ ખરાઈ અને સ્થળ તપાસ પ્રક્રિયા હેઠળ છે."}
                            </p>
                          </div>

                          {/* Stage 3 */}
                          <div className={`p-3 sm:p-3.5 rounded-2xl border shadow-2xs ${
                            isApproved
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : isRejected
                              ? "bg-slate-50 border-slate-200 text-slate-400"
                              : "bg-slate-50 border-slate-200 text-slate-500"
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                isApproved
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-200 text-slate-600"
                              }`}>
                                {isApproved ? "✓" : "૩"}
                              </span>
                              <div className="min-w-0">
                                <p className="font-extrabold text-xs">તબક્કો ૩: આખરી મંજૂરી / e-Sign</p>
                                <p className="text-[10px] text-slate-500">
                                  {isApproved ? selectedApp.lastUpdated : "અપેક્ષિત: " + sla.targetDateStr}
                                </p>
                              </div>
                            </div>
                            <p className="text-[11px] mt-2 text-slate-600 leading-snug">
                              {isApproved
                                ? "ડિજિટલ સહી વાળું પ્રમાણપત્ર તૈયાર / DBT સહાય જમા."
                                : isRejected
                                ? "પુનઃ અરજી બાદ જ આ તબક્કો સક્રિય થશે."
                                : "સ્ક્રુટિની પૂર્ણ થયે ડિજિટલ સર્ટિફિકેટ ઇશ્યૂ થશે."}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Cash payment action if pending challan */}
                  {selectedApp.paymentStatus === "pending_challan" && (
                    <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-amber-900">
                        <Receipt size={18} className="text-amber-700 shrink-0" />
                        <div>
                          <p className="font-extrabold text-xs">
                            ઓફલાઇન રોકડ ચલણ પાવતી ભરપાઈ બાકી (GRN: {selectedApp.challanNo})
                          </p>
                          <p className="text-[11px] text-amber-800">
                            જન સેવા કેન્દ્ર કેશ કાઉન્ટર પર રોકડા ₹{selectedApp.feeAmount} ભરી પહોંચ મેળવો.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleConfirmCashPayment}
                        disabled={isConfirmingCash}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black rounded-xl text-xs transition shrink-0 cursor-pointer"
                      >
                        {isConfirmingCash ? "ચકાસણી..." : "ઓપરેટર ચુકવણી પુષ્ટિ (Demo Confirm)"}
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Modal Footer (Sticky, Clean Actions) ── */}
                <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    {/* Gated Action 1: Payment Slip */}
                    {selectedApp.paymentStatus === "paid" ? (
                      <button
                        type="button"
                        onClick={() => setShowPrintModal(true)}
                        className="px-3 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-95 text-white font-extrabold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Printer size={13} />
                        <span>પહોંચ (PDF)</span>
                      </button>
                    ) : (
                      <span
                        title="કચેરી અધિકારી દ્વારા ચુકવણી ખરાઈ થયા બાદ જ પહોંચ અનલૉક થશે"
                        className="px-2.5 py-1.5 bg-slate-100 text-slate-400 font-bold rounded-xl text-[11px] border border-slate-200 flex items-center gap-1 cursor-not-allowed opacity-75"
                      >
                        <Lock size={12} className="text-amber-500" />
                        <span>પહોંચ લૉક</span>
                      </span>
                    )}

                    {/* Gated Action 2: Official Certificate */}
                    {selectedApp.workflowStage === 3 || selectedApp.status === "approved" ? (
                      <button
                        type="button"
                        onClick={() => setShowCertificateModal(true)}
                        className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-extrabold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                      >
                        <Award size={13} />
                        <span>📜 સરકારી પ્રમાણપત્ર (PDF)</span>
                      </button>
                    ) : (
                      <span
                        title="તાલુકા મામલતદાર સાહેબની ડિજિટલ સહી (e-Sign) બાદ જ પ્રમાણપત્ર ડાઉનલોડ થશે"
                        className="px-2.5 py-1.5 bg-slate-100 text-slate-400 font-bold rounded-xl text-[11px] border border-slate-200 flex items-center gap-1 cursor-not-allowed opacity-75"
                      >
                        <Lock size={12} className="text-slate-400" />
                        <span>પ્રમાણપત્ર લૉક</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTimelineModal(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-black rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  >
                    <X size={13} />
                    <span>બંધ કરો</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODE 2: OFFICER ADMIN SCRUTINY DESK
         ══════════════════════════════════════════════════════════════ */}
      {authMode === "officer" && (
        <div className="space-y-6">
          {/* Officer Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">કુલ અરજીઓ</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                {stats.total.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 shadow-2xs">
              <span className="text-[10px] text-emerald-800 font-bold block uppercase">મંજૂર (Approved)</span>
              <span className="text-lg sm:text-xl font-black text-emerald-700 font-mono">
                {stats.approved.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 shadow-2xs">
              <span className="text-[10px] text-blue-800 font-bold block uppercase">ચકાસણી હેઠળ</span>
              <span className="text-lg sm:text-xl font-black text-blue-700 font-mono">
                {stats.processing.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
              <span className="text-[10px] text-amber-800 font-bold block uppercase">સ્થળ તપાસ પેન્ડિંગ</span>
              <span className="text-lg sm:text-xl font-black text-amber-700 font-mono">
                {stats.pending.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[10px] text-purple-800 font-bold block uppercase">કુલ સહાય ચૂકવાઈ</span>
              <span className="text-lg sm:text-xl font-black text-purple-700 font-mono">
                {stats.disbursedCr}
              </span>
            </div>
          </div>

          {/* Officer Filter & Search Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={handleSearchSubmit}
                  placeholder="અરજી ID, નાગરિકનું નામ કે યોજના શોધો..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="all">તમામ ૩૩ જિલ્લા (All Districts)</option>
                {GUJARAT_DISTRICTS.map((d) => (
                  <option key={d.en} value={d.en}>
                    {d.gu} ({d.en})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleOfficerLogout}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer"
                title="કચેરી સત્ર સમાપ્ત કરો"
              >
                લૉગઆઉટ
              </button>

              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="all">તમામ સ્ટેટસ (All)</option>
                <option value="approved">મંજૂર</option>
                <option value="processing">ચકાસણી ચાલુ</option>
                <option value="pending">પેન્ડિંગ</option>
                <option value="rejected">પૂરક પુરાવા જરૂરી</option>
              </select>
            </div>
          </div>

          {/* Master Application Table for Officers (Responsive Table on Desktop & App Cards on Mobile) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">અરજી ID</th>
                    <th className="p-3">નાગરિકનું નામ</th>
                    <th className="p-3">યોજના</th>
                    <th className="p-3">જિલ્લો/તાલુકો</th>
                    <th className="p-3">સ્ટેટસ</th>
                    <th className="p-3 text-right">કાર્યવાહી</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((app, idx) => {
                    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.processing;
                    return (
                      <tr key={`${app.id}-${idx}`} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-bold text-orange-600">{app.id}</td>
                        <td className="p-3 font-bold text-slate-800">
                          {app.citizenNameGu}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            +91 {app.mobile}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700">
                          <span className="mr-1">{app.schemeEmoji}</span> {app.schemeNameGu}
                        </td>
                        <td className="p-3 text-slate-600">
                          {app.village ? `${app.village} • ` : ""}{app.taluka}, {app.districtGu}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badgeBg}`}>
                            {cfg.labelGu}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          {app.status === "processing" && (
                            <button
                              type="button"
                              disabled={isUpdatingStage}
                              onClick={() => {
                                setSelectedApp(app);
                                handleAdvanceStage(3, "approved", app);
                              }}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold transition"
                            >
                              {isUpdatingStage ? "પ્રક્રિયા ચાલુ..." : "✓ મંજૂર (e-Sign)"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedApp(app);
                              setShowPrintModal(true);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition"
                          >
                            પહોંચ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch Cards View (Zero Table Overflow) */}
            <div className="md:hidden p-2.5 space-y-2.5 max-h-[600px] overflow-y-auto touch-pan-y">
              {records.map((app, idx) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.processing;
                return (
                  <div
                    key={`mobile-rec-${app.id}-${idx}`}
                    className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-orange-600">{app.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badgeBg}`}>
                        {cfg.labelGu}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">{app.citizenNameGu}</p>
                      <p className="text-[11px] text-slate-500">📱 +91 {app.mobile}</p>
                      <p className="text-slate-700 font-semibold text-xs mt-1">
                        <span className="mr-1">{app.schemeEmoji}</span> {app.schemeNameGu}
                      </p>
                      <p className="text-[10.5px] text-slate-600 mt-0.5">
                        📍 {app.village ? `${app.village} • ` : ""}{app.taluka}, {app.districtGu}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-1.5">
                      {app.status === "processing" && (
                        <button
                          type="button"
                          disabled={isUpdatingStage}
                          onClick={() => {
                            setSelectedApp(app);
                            handleAdvanceStage(3, "approved", app);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-[10.5px] font-bold transition"
                        >
                          {isUpdatingStage ? "ચકાસણી..." : "✓ મંજૂર (e-Sign)"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedApp(app);
                          setShowPrintModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-[10.5px] font-bold transition"
                      >
                        પહોંચ PDF
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Officer Login Modal ── */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-slate-900">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-slate-900 text-amber-300 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-inner">
                🏛️
              </div>
              <h3 className="text-lg font-black text-slate-900">કચેરી સત્તાવાર એડમિન લૉગિન</h3>
              <p className="text-xs text-slate-500">
                તાલુકા મામલતદાર / વિસ્તરણ અધિકારી અધિકૃત પ્રવેશ
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 flex items-center justify-between">
              <span>હેકાથોન જજ માટે ડેમો ID: <strong>GUJ-GOV-9012</strong> / PIN: <strong>GJ2026</strong></span>
            </div>

            <form onSubmit={handleOfficerLogin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">કર્મચારી ID (Officer ID)</label>
                <input
                  type="text"
                  value={officerIdInput}
                  onChange={(e) => setOfficerIdInput(e.target.value)}
                  placeholder="GUJ-GOV-XXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">સુરક્ષા PIN (Security PIN)</label>
                <input
                  type="password"
                  value={officerPinInput}
                  onChange={(e) => setOfficerPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs"
                />
              </div>

              {officerError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  {officerError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfficerModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  disabled={officerLoading}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-amber-300 rounded-xl font-black shadow-md flex items-center justify-center gap-1"
                >
                  {officerLoading ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
                  <span>લૉગિન કરો</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Official Receipt Slip Modal (PDF Download / Print) ── */}
      {showPrintModal && selectedApp && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPrintModal(false);
          }}
        >
          <GovernmentReceiptSlip
            app={selectedApp}
            isModalPreview={true}
            onClose={() => setShowPrintModal(false)}
          />
        </div>
      )}

      {/* ── Official Government Certificate Modal (PDF Download / Print) ── */}
      {showCertificateModal && selectedApp && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCertificateModal(false);
          }}
        >
          <OfficialGovernmentCertificate
            app={selectedApp}
            isModalPreview={true}
            onClose={() => setShowCertificateModal(false)}
          />
        </div>
      )}
    </div>
  );
}
