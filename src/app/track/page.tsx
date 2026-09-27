"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { GUJARAT_DISTRICTS, CitizenApplication } from "@/lib/large-datasets";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  IndianRupee,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  User,
  Filter,
  RefreshCw,
  Sparkles,
  Printer,
  Fingerprint,
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

export default function TrackPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [records, setRecords] = useState<CitizenApplication[]>([]);
  const [totalRecords, setTotalRecords] = useState(5420);
  const [totalPages, setTotalPages] = useState(678);
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

  // Check URL query parameters (?id=APP-...) on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const idParam = urlParams.get("id");
      if (idParam) {
        setSearchQuery(idParam);
      }
    }
  }, []);

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
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setSelectedApp(data.application);
        setCashConfirmedAlert(true);
        // Also update in records list if present
        setRecords((prev) =>
          prev.map((r) => (r.id === data.application.id ? data.application : r))
        );
        setTimeout(() => setCashConfirmedAlert(false), 5000);
      } else {
        alert(data.error || "ઓપરેટર કન્ફર્મેશનમાં ક્ષતિ આવી.");
      }
    } catch (e) {
      console.error(e);
      alert("સર્વર ક્ષતિ આવી.");
    } finally {
      setIsConfirmingCash(false);
    }
  };

  const handleAdvanceStage = async (targetStage: 1 | 2 | 3 | 4, officerRole: string) => {
    if (!selectedApp) return;
    setIsUpdatingStage(true);
    try {
      const res = await fetch("/api/track", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          action: "update_workflow_stage",
          stage: targetStage,
          officerRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setSelectedApp(data.application);
        setRecords((prev) =>
          prev.map((r) => (r.id === data.application.id ? data.application : r))
        );
        setStageUpdateAlert(data.message || `તબક્કો ${targetStage} સફળતાપૂર્વક અપડેટ થયો.`);
        setTimeout(() => setStageUpdateAlert(null), 5000);
      } else {
        alert(data.error || "વર્કફ્લો અપડેટ કરવામાં ક્ષતિ આવી.");
      }
    } catch (e) {
      console.error(e);
      alert("સર્વર ક્ષતિ આવી.");
    } finally {
      setIsUpdatingStage(false);
    }
  };

  // Fetch paginated or searched records
  const loadData = useCallback(async () => {
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
          setTotalRecords(data.total);
          setTotalPages(data.totalPages);
          if (data.stats) setStats(data.stats);

          // If exact search by single ID returned 1 record, select it automatically
          if (data.records.length === 1 && searchQuery.trim().toUpperCase().startsWith("APP")) {
            setSelectedApp(data.records[0]);
          }
        } else if (data.application) {
          // Direct single lookup
          setSelectedApp(data.application);
          setRecords([data.application]);
        }
      } else {
        setError(data.error || "કોઈ અરજી મળી નથી. સાચો નંબર નાખો.");
      }
    } catch (err) {
      console.error("Data load error:", err);
      setError("ડેટા લોડ કરવામાં મુશ્કેલી આવી. કૃપા કરીને પુનઃ પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDistrict, selectedStatus, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle direct tracking input submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleQuickDemo = (id: string) => {
    setSearchQuery(id);
    setSelectedDistrict("all");
    setSelectedStatus("all");
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden print:hidden print-hide no-print">
        {/* Hero Section - 100% responsive, no text cut */}
        <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white py-8 sm:py-12 px-4 shadow-md">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                  <ShieldCheck size={14} className="text-amber-200" />
                  <span>ગુજરાત ડિજિટલ પબ્લિક ઇન્ફ્રાસ્ટ્રક્ચર • Real-time Registry</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug break-words">
                  🏛️ અરજી ટ્રેકર & જાહેર પારદર્શિતા પોર્ટલ
                </h1>
                <p className="text-orange-100 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed break-words">
                  ૫,૪૦૦+ થી વધુ સરકારી સહાય અરજીઓની લાઈવ સ્થિતિ અને જિલ્લાવાર ડેટાબેઝ ચકાસો.
                </p>
                <div className="pt-2">
                  <Link
                    href="/documents"
                    className="inline-flex items-center gap-2 bg-white text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-xl text-xs font-black shadow-md transition active:scale-95"
                  >
                    <Sparkles size={14} />
                    <span>+ નવા દસ્તાવેજ માટે અરજી / સુધારો કરો (Apply Online)</span>
                  </Link>
                </div>
              </div>

              {/* Live Count Pill */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center sm:text-right shrink-0">
                <p className="text-xs text-orange-200 uppercase font-bold tracking-wider">કુલ નોંધાયેલ અરજીઓ</p>
                <p className="text-2xl sm:text-3xl font-black text-white">{stats.total.toLocaleString("en-IN")}+</p>
                <p className="text-[11px] text-emerald-300 font-medium">સક્રિય મોનિટરિંગ હેઠળ</p>
              </div>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
                  <CheckCircle2 size={15} />
                  <span>મંજૂર અરજીઓ</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{stats.approved.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-orange-100">૭૧% સફળ મંજૂરી દર</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold mb-1">
                  <Clock size={15} />
                  <span>ચકાસણી હેઠળ</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{stats.processing.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-orange-100">મામલતદાર / TDO કક્ષાએ</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold mb-1">
                  <TrendingUp size={15} />
                  <span>સ્થળ તપાસ બાકી</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{stats.pending.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-orange-100">તલાટી કમ મંત્રી રિપોર્ટ</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 text-yellow-300 text-xs font-semibold mb-1">
                  <IndianRupee size={15} />
                  <span>DBT સહાય ચૂકવણી</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{stats.disbursedCr}</p>
                <p className="text-[11px] text-orange-100">સીધા બેંક ખાતામાં જમા</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1 min-w-0">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="અરજી નંબર (દા.ત. APP001, APP-GUJ-1025), નામ અથવા જિલ્લો શોધો..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-800 placeholder:text-slate-400 break-words"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  <span>શોધો (Search)</span>
                </button>

                {(searchQuery || selectedDistrict !== "all" || selectedStatus !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDistrict("all");
                      setSelectedStatus("all");
                      setPage(1);
                    }}
                    className="p-3 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                    title="રીસેટ કરો"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>
            </form>

            {/* Quick Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              {/* Status Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
                  <Filter size={13} /> સ્થિતિ:
                </span>
                {[
                  { id: "all", label: "બધા (All)" },
                  { id: "approved", label: "મંજૂર (Approved)" },
                  { id: "processing", label: "ચકાસણી (In Review)" },
                  { id: "pending", label: "પેન્ડિંગ (Pending)" },
                  { id: "rejected", label: "રિજેક્ટ (Rejected)" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStatus(st.id);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      selectedStatus === st.id
                        ? "bg-orange-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* District Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold shrink-0">જિલ્લો:</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
                >
                  <option value="all">તમામ ૩૩ જિલ્લા (All Gujarat)</option>
                  {GUJARAT_DISTRICTS.map((d) => (
                    <option key={d.en} value={d.en}>
                      {d.gu} ({d.en})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Demo Pill Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-bold text-orange-700 flex items-center gap-1">
                <Sparkles size={12} /> ડેમો ID અજમાવો:
              </span>
              {["APP001", "APP002", "APP003", "APP004", "APP-GUJ-1015", "APP-GUJ-1082", "APP-GUJ-2040"].map((demoId) => (
                <button
                  key={demoId}
                  onClick={() => handleQuickDemo(demoId)}
                  className="bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-md font-mono font-medium transition"
                >
                  {demoId}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Single Application Modal / Highlight View */}
          {selectedApp && (
            <div className="bg-white rounded-2xl shadow-md border-2 border-orange-400 p-4 sm:p-6 space-y-5 animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-3xl sm:text-4xl p-2 bg-orange-50 rounded-2xl border border-orange-100">
                    {selectedApp.schemeEmoji}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sm sm:text-base text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                        {selectedApp.id}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          STATUS_CONFIG[selectedApp.status]?.badgeBg || "bg-slate-100"
                        }`}
                      >
                        {STATUS_CONFIG[selectedApp.status]?.labelGu}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1 break-words">
                      {selectedApp.schemeNameGu}
                    </h3>
                    <p className="text-xs text-slate-500 break-words">{selectedApp.schemeName}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <p className="text-xs text-slate-400">મંજૂર સહાય રકમ (Benefit)</p>
                  <p className="text-lg sm:text-xl font-black text-emerald-600">
                    ₹{selectedApp.benefitAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Applicant Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <p className="text-slate-400 flex items-center gap-1">
                    <User size={12} /> અરજદારનું નામ
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5 break-words">{selectedApp.citizenNameGu}</p>
                  <p className="text-[10px] text-slate-500 break-words">{selectedApp.citizenName}</p>
                </div>
                <div>
                  <p className="text-slate-400 flex items-center gap-1">
                    <MapPin size={12} /> જિલ્લો / તાલુકો
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5 break-words">
                    {selectedApp.districtGu} ({selectedApp.district})
                  </p>
                  <p className="text-[10px] text-slate-500 break-words">{selectedApp.taluka}</p>
                </div>
                <div>
                  <p className="text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> અરજી તારીખ
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedApp.appliedDate}</p>
                  <p className="text-[10px] text-slate-500">આખરી અપડેટ: {selectedApp.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck size={12} /> આધાર ક્રમાંક
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5 font-mono">XXXX-XXXX-{selectedApp.aadhaarLast4}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">UIDAI વેરિફાઈડ</p>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              {(() => {
                const currentStage: number =
                  selectedApp.workflowStage !== undefined
                    ? selectedApp.workflowStage
                    : selectedApp.status === "approved"
                    ? 3
                    : selectedApp.status === "rejected"
                    ? 2
                    : 1;

                return (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FileCheck2 size={14} className="text-orange-600" /> સરકારી ચકાસણી ટાઈમલાઈન (Audit Trail):
                      </p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentStage === 1
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : currentStage === 2
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}>
                        {currentStage === 1
                          ? "તબક્કો ૧: સ્ક્રુટિની ચાલુ"
                          : currentStage === 2
                          ? "તબક્કો ૨: મામલતદાર મંજૂરી અર્થે"
                          : "તબક્કો ૩: ૧૦૦% મંજૂર"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                      {/* Step 1: અરજી સબમિટ */}
                      <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>૧. અરજી સબમિટ</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">ઓનલાઇન સ્વીકાર (પૂર્ણ)</p>
                      </div>

                      {/* Step 2: દસ્તાવેજ ખરાઈ */}
                      {currentStage >= 2 ? (
                        <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            <span>૨. દસ્તાવેજ ખરાઈ</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">નાયબ મામલતદાર (પૂર્ણ)</p>
                        </div>
                      ) : selectedApp.status === "rejected" ? (
                        <div className="p-2.5 rounded-xl border bg-rose-50 border-rose-300 text-rose-900 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                            <XCircle size={14} className="text-rose-600 shrink-0" />
                            <span>૨. દસ્તાવેજ ખરાઈ</span>
                          </div>
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">પૂરક પુરાવા જરૂરી</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl border bg-blue-50/90 border-blue-400 text-blue-950 shadow-xs ring-2 ring-blue-300/60 animate-pulse">
                          <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                            <Clock size={14} className="text-blue-600 animate-spin shrink-0" />
                            <span>૨. દસ્તાવેજ ખરાઈ</span>
                          </div>
                          <p className="text-[11px] text-blue-800 mt-1 font-bold">કચેરી સ્ક્રુટિની ચાલુ</p>
                        </div>
                      )}

                      {/* Step 3: મામલતદાર મંજૂરી */}
                      {currentStage >= 3 ? (
                        <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            <span>૩. મામલતદાર મંજૂરી</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">મામલતદાર e-Sign (પૂર્ણ)</p>
                        </div>
                      ) : currentStage === 2 ? (
                        <div className="p-2.5 rounded-xl border bg-amber-50/90 border-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300/60 animate-pulse">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                            <Clock size={14} className="text-amber-600 animate-spin shrink-0" />
                            <span>૩. મામલતદાર મંજૂરી</span>
                          </div>
                          <p className="text-[11px] text-amber-800 mt-1 font-bold">આખરી સહી પ્રક્રિયામાં</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl border bg-slate-100/90 border-slate-200 text-slate-400">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-500">
                            <Clock size={14} className="text-slate-400 shrink-0" />
                            <span>૩. મામલતદાર મંજૂરી</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">મંજૂરી પ્રતીક્ષામાં</p>
                        </div>
                      )}

                      {/* Step 4: DBT સહાય / પ્રમાણપત્ર */}
                      {selectedApp.paymentStatus === "pending_challan" ? (
                        <div className="p-2.5 rounded-xl border bg-amber-50 border-amber-300 text-amber-900">
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            <span>🔒</span>
                            <span>૪. કચેરી ફી & રિલીઝ</span>
                          </div>
                          <p className="text-[11px] text-amber-800 mt-1 font-bold">રોકડ ચુકવણી બાકી</p>
                        </div>
                      ) : currentStage >= 3 ? (
                        <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            <span>૪. DBT સહાય / પ્રમાણપત્ર</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">સફળ રિલીઝ / ડાઉનલોડ</p>
                        </div>
                      ) : selectedApp.status === "rejected" ? (
                        <div className="p-2.5 rounded-xl border bg-rose-50 border-rose-200 text-rose-800">
                          <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                            <XCircle size={14} className="text-rose-600 shrink-0" />
                            <span>૪. DBT સહાય / પ્રમાણપત્ર</span>
                          </div>
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">અરજી અમાન્ય ઠરેલ</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl border bg-slate-100/90 border-slate-200 text-slate-400">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-500">
                            <Clock size={14} className="text-slate-400 shrink-0" />
                            <span>૪. DBT સહાય / પ્રમાણપત્ર</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">પ્રક્રિયા હેઠળ</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Dynamic Stage Update Alert Notification */}
              {stageUpdateAlert && (
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <div>
                      <strong className="block text-emerald-950 font-bold">✓ વર્કફ્લો તબક્કો અપડેટ થયો!</strong>
                      <span>{stageUpdateAlert}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                    STAGE UPDATED
                  </span>
                </div>
              )}

              {/* Dynamic Officer Role Workflow Management Panel (Interactive Simulation) */}
              {(() => {
                const currentStage: number =
                  selectedApp.workflowStage !== undefined
                    ? selectedApp.workflowStage
                    : selectedApp.status === "approved"
                    ? 3
                    : selectedApp.status === "rejected"
                    ? 2
                    : 1;

                return (
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-md border border-slate-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏛️</span>
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-amber-400 tracking-wide flex items-center gap-1.5">
                            <span>સત્તાવાર કચેરી વર્કફ્લો મેનેજમેન્ટ (Officer Role Verification)</span>
                          </h4>
                          <p className="text-[11px] text-slate-300">
                            હોદ્દાવાર તબક્કાવાર મંજૂરી: ૧. નાયબ મામલતદાર (દસ્તાવેજ ખરાઈ) ➔ ૨. મામલતદાર (આખરી e-Sign)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-400">વર્તમાન તબક્કો:</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          currentStage === 1
                            ? "bg-blue-500/20 text-blue-300 border border-blue-400/40"
                            : currentStage === 2
                            ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                        }`}>
                          {currentStage === 1
                            ? "તબક્કો ૧: નાયબ મામલતદાર સ્ક્રુટિની ડેસ્ક"
                            : currentStage === 2
                            ? "તબક્કો ૨: મામલતદાર આખરી e-Sign ટેબલ"
                            : "તબક્કો ૩: ૧૦૦% મંજૂર (Fully Approved)"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-0.5">
                      <div className="text-xs text-slate-300 leading-relaxed max-w-xl">
                        {currentStage === 1 && (
                          <p>
                            👉 <strong>તબક્કો ૧ પેન્ડિંગ:</strong> નાગરિકે અરજી ઓનલાઇન સબમિટ કરી છે. નાયબ મામલતદાર તરીકે તમામ દસ્તાવેજો (આધાર, આવક, જન્મ તારીખ) ની સ્ક્રુટિની પૂર્ણ કરી આગળ અગ્રેસિત કરો:
                          </p>
                        )}
                        {currentStage === 2 && (
                          <p>
                            👉 <strong>તબક્કો ૨ પેન્ડિંગ:</strong> નાયબ મામલતદાર દ્વારા દસ્તાવેજ ખરાઈ પૂર્ણ થઈ ગઈ છે. હવે તાલુકા મામલતદાર (એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ) તરીકે ડિજિટલ સહી (e-Sign) સાથે આખરી મંજૂરી આપો:
                          </p>
                        )}
                        {currentStage >= 3 && (
                          <p className="text-emerald-300 font-semibold">
                            ✓ <strong>તમામ સરકારી તબક્કા સંપન્ન:</strong> મામલતદાર કચેરી દ્વારા ડિજિટલ સહી સાથે અરજી ૧૦૦% મંજૂર થયેલ છે. પ્રમાણપત્ર/સહાય માન્ય છે.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {currentStage === 1 && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStage(2, "નાયબ મામલતદાર")}
                            disabled={isUpdatingStage}
                            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                          >
                            {isUpdatingStage ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>સ્ક્રુટિની મંજૂર થઈ રહી છે...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={15} className="text-blue-200" />
                                <span>[નાયબ મામલતદાર]: દસ્તાવેજ ખરાઈ મંજૂર કરો ➔</span>
                              </>
                            )}
                          </button>
                        )}

                        {currentStage === 2 && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStage(3, "મામલતદાર")}
                            disabled={isUpdatingStage}
                            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                          >
                            {isUpdatingStage ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>e-Sign મંજૂરી થઈ રહી છે...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={15} className="text-emerald-200" />
                                <span>[તાલુકા મામલતદાર]: આખરી e-Sign મંજૂરી આપો ✓</span>
                              </>
                            )}
                          </button>
                        )}

                        {currentStage >= 3 && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStage(1, "ટેસ્ટિંગ ડેસ્ક")}
                            disabled={isUpdatingStage}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
                            title="ડેમો પુનઃપ્રારંભ કરો"
                          >
                            <RefreshCw size={12} />
                            <span>ડેમો રીસેટ (Reset to Stage 1)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Cash Confirmation Alert (Live simulated) */}
              {cashConfirmedAlert && (
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <div>
                      <strong className="block text-emerald-950 font-bold">✓ ઓપરેટર દ્વારા રોકડ ફી સ્વીકારી લેવાઈ!</strong>
                      <span>ચલણ માન્ય ગણાયું છે અને પ્રમાણપત્ર ડિજિટલી રિલીઝ (અનલૉક) થઈ ગયું છે.</span>
                    </div>
                  </div>
                  <span className="bg-emerald-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                    STATUS: APPROVED
                  </span>
                </div>
              )}

              {/* Offline Cash Challan Lock Box & Interactive Operator Simulation for Hackathon Judges */}
              {selectedApp.paymentStatus === "pending_challan" && (
                <div className="bg-amber-50/90 border-2 border-amber-400 rounded-2xl p-4 space-y-3 text-xs text-amber-950">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-amber-300 pb-2">
                    <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                      <span>🔒</span>
                      <span>દસ્તાવેજ / પ્રમાણપત્ર રિલીઝ લૉક (Payment Locked)</span>
                    </div>
                    <span className="bg-amber-200 text-amber-900 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block">
                      GRN: {selectedApp.challanNo}
                    </span>
                  </div>

                  <p className="leading-relaxed text-slate-800">
                    સરકારી નિયમ મુજબ આ અરજીની ફી ઓનલાઇન ચૂકવેલ ન હોવાથી પ્રમાણપત્ર હાલ <strong>સંપૂર્ણ લૉક</strong> છે. અરજદારે તાલુકા જન સેવા કેન્દ્રના રોકડ કાઉન્ટર પર ચલણ નં. <strong className="font-mono text-orange-700">{selectedApp.challanNo}</strong> સાથે નિયત સરકારી ફી <strong className="font-mono text-emerald-800">₹{selectedApp.feeAmount || 50}</strong> રોકડા ભરવાના રહેશે. કચેરી ઓપરેટર ચુકવણી કન્ફર્મ કરે ત્યાર બાદ જ પ્રમાણપત્ર અનલૉક થશે.
                  </p>

                  {/* Interactive Operator Demo Verification Bar for Judges */}
                  <div className="bg-white/90 p-3 rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="font-black text-slate-900 block text-xs">
                        🏛️ હેકાથોન જજ લાઈવ ડેમો (કચેરી ઓપરેટર કન્ફર્મેશન):
                      </span>
                      <p className="text-[11px] text-slate-600">
                        ઓપરેટર કાઉન્ટર પર રોકડ સ્વીકારી સિસ્ટમમાં 'Payment Verified' કરે તે સિમ્યુલેટ કરો:
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmCashPayment}
                      disabled={isConfirmingCash}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      {isConfirmingCash ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>ચુકવણી વેરિફાઈ થઈ રહી છે...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={15} />
                          <span>✓ [ઓપરેટર લૉગિન]: રોકડ સ્વીકારી પ્રમાણપત્ર અનલૉક કરો</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Biometric Appointment Slot if applicable */}
              {selectedApp.biometricRequired && selectedApp.appointmentToken && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                    <Fingerprint size={16} className="text-blue-600" />
                    <span>બાયોમેટ્રિક / રૂબરૂ ખરાઈ એપોઇન્ટમેન્ટ સ્લોટ (Fast-Track Token):</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-0.5">
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <span className="text-slate-400 text-[10px] block">ટોકન ક્રમાંક:</span>
                      <strong className="text-blue-700 font-mono text-sm">{selectedApp.appointmentToken}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <span className="text-slate-400 text-[10px] block">તારીખ & સમય:</span>
                      <strong className="text-slate-800">{selectedApp.appointmentDate} • {selectedApp.appointmentTime}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-100 col-span-2 sm:col-span-1">
                      <span className="text-slate-400 text-[10px] block">કેન્દ્ર:</span>
                      <strong className="text-slate-800 truncate block">{selectedApp.appointmentCenter}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Verified Documents Checklist */}
              {selectedApp.documentsVerified && selectedApp.documentsVerified.length > 0 && (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 space-y-1.5">
                  <p className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <FileCheck2 size={13} className="text-emerald-700" /> AI પૂર્વ-ચકાસાયેલ દસ્તાવેજો (Verified Documents):
                  </p>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {selectedApp.documentsVerified.map((doc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] bg-white border border-emerald-300 text-emerald-800 px-2.5 py-1 rounded-md font-semibold"
                      >
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>{doc.name} ({doc.qualityScore}%)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Departmental Remarks */}
              <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl space-y-1">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Building2 size={13} /> વિભાગીય રીમાર્કસ (Officer Remarks):
                </p>
                <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed break-words">
                  {selectedApp.remarksGu}
                </p>
                <p className="text-[11px] text-amber-800 italic break-words">{selectedApp.remarksEn}</p>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-amber-200/60 font-semibold">
                  અધિકારી: {selectedApp.officerDesignation}
                </p>
              </div>

              {/* Close / Action bar */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  બંધ કરો (Close)
                </button>
                <button
                  onClick={() => setShowPrintModal(true)}
                  className={`px-4 py-2 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95 ${
                    selectedApp.paymentStatus === "pending_challan"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-orange-600 hover:bg-orange-700"
                  }`}
                >
                  <Printer size={14} />
                  <span>
                    {selectedApp.paymentStatus === "pending_challan"
                      ? "ઓફલાઇન રોકડ ચલણ જુઓ & પ્રિન્ટ (Cash Challan)"
                      : "સરકારી પહોંચ જુઓ & પ્રિન્ટ (Official Slip)"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Live Enterprise Registry Feed */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <span>📋 સિટિઝન એપ્લિકેશન રજીસ્ટ્રી</span>
                  <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {totalRecords.toLocaleString("en-IN")} પરિણામો
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  કોઈપણ અરજી પર ક્લિક કરીને તેની સંપૂર્ણ ઑડિટ વિગત જુઓ.
                </p>
              </div>

              {/* Page indicator */}
              <p className="text-xs font-semibold text-slate-500">
                પેજ {page} / {totalPages}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <XCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Loading Skeleton / Spinner */}
            {loading && (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Loader2 size={28} className="animate-spin mx-auto text-orange-600" />
                <p className="text-xs">૫,૪૦૦+ ડેટાસેટમાંથી પરિણામો મેળવી રહ્યા છીએ...</p>
              </div>
            )}

            {/* Applications List Cards - 100% Mobile responsive, zero text cutoff */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {records.map((app) => {
                  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.processing;
                  const isSelected = selectedApp?.id === app.id;

                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`group bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                        isSelected
                          ? "border-orange-500 ring-2 ring-orange-200 bg-orange-50/20"
                          : "border-slate-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                            {app.schemeEmoji}
                          </span>
                          <div className="min-w-0">
                            <span className="font-mono font-bold text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                              {app.id}
                            </span>
                            <h4 className="font-bold text-sm text-slate-800 mt-1 truncate break-words">
                              {app.citizenNameGu}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">{app.citizenName}</p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${cfg.badgeBg}`}
                        >
                          {app.workflowStage === 1 && app.status === "processing"
                            ? "તબક્કો ૧: સ્ક્રુટિની ચાલુ"
                            : app.workflowStage === 2 && app.status === "processing"
                            ? "તબક્કો ૨: મામલતદાર મંજૂરી"
                            : cfg.labelGu}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 flex items-center gap-1.5 text-slate-700 font-medium">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">
                            {app.districtGu} &bull; {app.taluka}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-emerald-700 font-bold">
                            ₹{app.benefitAmount.toLocaleString("en-IN")}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                              setShowPrintModal(true);
                            }}
                            className="px-2 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded text-[10px] font-bold flex items-center gap-1 transition"
                            title="સત્તાવાર સરકારી પહોંચ જુઓ અને પ્રિન્ટ કરો"
                          >
                            <Printer size={10} /> પહોંચ
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-[11px] text-slate-500 line-clamp-1 break-words">
                        {app.remarksGu}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition shadow-xs"
                >
                  &larr; પાછળ (Prev)
                </button>

                <div className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <span>પેજ</span>
                  <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-200 font-mono">
                    {page}
                  </span>
                  <span>/ {totalPages}</span>
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition shadow-xs"
                >
                  આગળ (Next) &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Official Gujarat Govt Digital Application Receipt (Print Only & Single A4 Page) ── */}
      {selectedApp && (
        <div className="hidden print:flex print-only-certificate bg-white">
          <GovernmentReceiptSlip app={selectedApp} />
        </div>
      )}

      {/* ── On-Screen Live Modal Preview with Stamp & Signature ── */}
      {showPrintModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:hidden animate-in fade-in duration-200">
          <GovernmentReceiptSlip
            app={selectedApp}
            isModalPreview={true}
            onClose={() => setShowPrintModal(false)}
          />
        </div>
      )}
    </>
  );
}
