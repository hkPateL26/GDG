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
} from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden">
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
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileCheck2 size={14} className="text-orange-600" /> સરકારી ચકાસણી ટાઈમલાઈન (Audit Trail):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 size={14} /> ૧. અરજી સબમિટ
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">ઓનલાઇન પોર્ટલ સ્વીકાર</p>
                  </div>

                  <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 size={14} /> ૨. દસ્તાવેજ ખરાઈ
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">આધાર + આવક દાખલો</p>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl border ${
                      selectedApp.status === "approved" || selectedApp.status === "processing"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {selectedApp.status === "approved" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Clock size={14} className="animate-spin" />
                      )}
                      <span>૩. મામલતદાર મંજૂરી</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">સ્થળ તપાસ રીપોર્ટ</p>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl border ${
                      selectedApp.status === "approved"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : selectedApp.status === "rejected"
                        ? "bg-rose-50 border-rose-200 text-rose-800"
                        : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {selectedApp.status === "approved" ? (
                        <CheckCircle2 size={14} />
                      ) : selectedApp.status === "rejected" ? (
                        <XCircle size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                      <span>૪. DBT સહાય જમા</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">PFMS બેંક ક્રેડિટ</p>
                  </div>
                </div>
              </div>

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
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  પ્રિન્ટ પહોંચ (Print Slip)
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
                          {cfg.labelGu}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 flex items-center gap-1.5 text-slate-700 font-medium">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">
                            {app.districtGu} &bull; {app.taluka}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-emerald-700 font-bold">
                            ₹{app.benefitAmount.toLocaleString("en-IN")}
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition"
                          />
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
    </>
  );
}
