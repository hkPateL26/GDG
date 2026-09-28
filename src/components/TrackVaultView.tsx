"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GUJARAT_DISTRICTS,
  CitizenApplication,
  CitizenLedgerProfile,
} from "@/lib/large-datasets";
import {
  Search,
  Loader2,
  Sparkles,
  Printer,
  Lock,
  Receipt,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import Link from "next/link";
import GovernmentReceiptSlip from "@/components/GovernmentReceiptSlip";

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
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmingCash, setIsConfirmingCash] = useState(false);
  const [cashConfirmedAlert, setCashConfirmedAlert] = useState(false);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);
  const [stageUpdateAlert, setStageUpdateAlert] = useState<string | null>(null);

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
        setRecords(myApps);

        if (targetId) {
          const found = myApps.find((a) => a.id.toLowerCase() === targetId.toLowerCase());
          if (found) setSelectedApp(found);
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
          setRecords(data.records);
          if (data.stats) setStats(data.stats);

          if (data.records.length === 1 && searchQuery.trim().toUpperCase().startsWith("APP")) {
            setSelectedApp(data.records[0]);
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
      const myApps = citizen.activeApplications || [];
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
              {records.map((app) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.processing;
                const isSelected = selectedApp?.id === app.id;

                return (
                  <div
                    key={app.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedApp(isSelected ? null : app)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedApp(isSelected ? null : app);
                      }
                    }}
                    className={`group bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                      isSelected
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

                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        તારીખ: <strong className="text-slate-700">{app.appliedDate}</strong>
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                            setShowPrintModal(true);
                          }}
                          className="text-xs font-bold text-slate-600 hover:text-orange-600 flex items-center gap-1 transition"
                        >
                          <Printer size={13} />
                          <span>પહોંચ (PDF)</span>
                        </button>
                        <span
                          className={`text-xs font-bold flex items-center gap-1 transition ${
                            isSelected ? "text-orange-600" : "text-slate-500 group-hover:text-orange-600"
                          }`}
                        >
                          <span>{isSelected ? "વિગતો છુપાવો" : "લાઈવ ટ્રેકિંગ જુઓ"}</span>
                          {isSelected ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Application Timeline & Stages Detail Card */}
          {selectedApp && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-orange-400 shadow-lg space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl p-2.5 bg-orange-50 rounded-2xl border border-orange-200 shrink-0">
                    {selectedApp.schemeEmoji}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                        અરજી નં: {selectedApp.id}
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        લાઈવ સ્ક્રુટિની વિગતો
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug">
                      {selectedApp.schemeNameGu}
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal">
                      અરજદાર: {selectedApp.citizenNameGu} ({selectedApp.citizenName}) &bull; 📱 +91 {selectedApp.mobile}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPrintModal(true)}
                    className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-95 text-white font-extrabold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer size={14} />
                    <span>પહોંચ ડાઉનલોડ (PDF)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 hover:text-slate-900 font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
                    title="વિગતો બંધ કરો"
                  >
                    <X size={14} />
                    <span>બંધ કરો</span>
                  </button>
                </div>
              </div>

              {/* 3 Step Visual Progress Workflow */}
              {(() => {
                const currentStage = selectedApp.workflowStage || 1;
                return (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      🏛️ સત્તાવાર કચેરી પ્રક્રિયા તબક્કા (Live Tracking Pipeline)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Stage 1 */}
                      <div className={`p-3.5 rounded-2xl border ${
                        currentStage >= 1
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStage >= 1 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            {currentStage >= 1 ? "✓" : "૧"}
                          </span>
                          <p className="font-extrabold text-xs">તબક્કો ૧: ઓનલાઇન સ્વીકૃતિ</p>
                        </div>
                        <p className="text-[11px] mt-1 text-slate-600">
                          દસ્તાવેજો અને AI પૂર્વ-ચકાસણી સફળ.
                        </p>
                      </div>

                      {/* Stage 2 */}
                      <div className={`p-3.5 rounded-2xl border ${
                        currentStage >= 2
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : currentStage === 1
                          ? "bg-blue-50 border-blue-300 text-blue-900"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStage >= 2
                              ? "bg-emerald-600 text-white"
                              : currentStage === 1
                              ? "bg-blue-600 text-white animate-pulse"
                              : "bg-slate-200 text-slate-600"
                          }`}>
                            {currentStage >= 2 ? "✓" : "૨"}
                          </span>
                          <p className="font-extrabold text-xs">તબક્કો ૨: કચેરી સ્ક્રુટિની</p>
                        </div>
                        <p className="text-[11px] mt-1 text-slate-600">
                          મામલતદાર શાખા દ્વારા રેકોર્ડ ખરાઈ.
                        </p>
                      </div>

                      {/* Stage 3 */}
                      <div className={`p-3.5 rounded-2xl border ${
                        currentStage >= 3
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStage >= 3 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            {currentStage >= 3 ? "✓" : "૩"}
                          </span>
                          <p className="font-extrabold text-xs">તબક્કો ૩: આખરી મંજૂરી / e-Sign</p>
                        </div>
                        <p className="text-[11px] mt-1 text-slate-600">
                          ડિજિટલ સહી પ્રમાણપત્ર ઈશ્યુ / DBT સહાય જમા.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Cash payment action if pending challan */}
              {selectedApp.paymentStatus === "pending_challan" && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
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
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black rounded-xl text-xs transition shrink-0"
                  >
                    {isConfirmingCash ? "ચકાસણી..." : "ઓપરેટર ચુકવણી પુષ્ટિ (Demo Confirm)"}
                  </button>
                </div>
              )}
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

          {/* Master Application Table for Officers */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
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
                  {records.map((app) => {
                    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.processing;
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition">
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
                          {app.districtGu} &bull; {app.taluka}
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <GovernmentReceiptSlip
            app={selectedApp}
            isModalPreview={true}
            onClose={() => setShowPrintModal(false)}
          />
        </div>
      )}
    </div>
  );
}
