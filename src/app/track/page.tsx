"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { SkeletonStatusCard } from "@/components/Skeleton";
import { Search, CheckCircle, Clock, XCircle, Loader2, ChevronRight } from "lucide-react";

type StatusType = "pending" | "approved" | "rejected" | "processing";

const STATUS_MOCK: Record<string, { scheme: string; status: StatusType; date: string; remarks: string; schemeEmoji: string }> = {
  APP001: { scheme: "PM Kisan Samman Nidhi", schemeEmoji: "🌾", status: "approved",   date: "2026-09-01", remarks: "₹2000 successfully credited to your linked bank account." },
  APP002: { scheme: "Ayushman Bharat PM-JAY", schemeEmoji: "🏥", status: "processing", date: "2026-09-10", remarks: "Documents under verification. Expected in 7 working days." },
  APP003: { scheme: "PM Awas Yojana",         schemeEmoji: "🏠", status: "pending",    date: "2026-09-15", remarks: "Awaiting field officer verification at your address." },
  APP004: { scheme: "Mudra Loan (Kishore)",   schemeEmoji: "💼", status: "rejected",   date: "2026-09-05", remarks: "Income proof document missing. Please reapply with proper documents." },
};

type StatusConfig = { label: string; bg: string; border: string; textColor: string; Icon: React.ElementType };

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  approved:   { label: "Approved",   bg: "bg-green-50",  border: "border-green-200",  textColor: "text-green-700",  Icon: CheckCircle },
  processing: { label: "Processing", bg: "bg-blue-50",   border: "border-blue-200",   textColor: "text-blue-700",   Icon: Loader2 },
  pending:    { label: "Pending",    bg: "bg-yellow-50", border: "border-yellow-200", textColor: "text-yellow-700", Icon: Clock },
  rejected:   { label: "Rejected",  bg: "bg-red-50",    border: "border-red-200",    textColor: "text-red-700",    Icon: XCircle },
};

export default function TrackPage() {
  const [appId, setAppId]     = useState("");
  const [result, setResult]   = useState<(typeof STATUS_MOCK)[string] | null>(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = () => {
    const id = appId.trim().toUpperCase();
    if (!id) { setError("Please enter your Application ID."); return; }
    setLoading(true); setError(""); setResult(null);

    setTimeout(() => {
      const found = STATUS_MOCK[id];
      if (found) setResult(found);
      else setError(`No application found for "${id}". Please check your reference number.`);
      setLoading(false);
    }, 1200);
  };

  const cfg = result ? STATUS_CONFIG[result.status] : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">

        {/* Hero */}
        <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-8 sm:py-12 px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Search size={28} /> Track Application
          </h1>
          <p className="text-orange-100 text-sm sm:text-base">
            તમારી અરજીની સ્થિતિ તપાસો &bull; Check your application status
          </p>
        </div>

        <div className="max-w-lg mx-auto px-3 sm:px-4 py-8 space-y-5">

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📋 Application / Reference Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={appId}
                onChange={(e) => { setAppId(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="e.g. APP001"
                className="flex-1 min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-gray-300"
              />
              <button
                onClick={handleTrack}
                disabled={loading}
                className="flex-shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-semibold transition active:scale-95"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {loading ? "..." : "Track"}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2.5 flex items-center gap-1">
                <XCircle size={13} /> {error}
              </p>
            )}
          </div>

          {/* Skeleton while loading */}
          {loading && <SkeletonStatusCard />}

          {/* Result Card */}
          {!loading && result && cfg && (
            <div className={`rounded-2xl border-2 p-5 sm:p-6 ${cfg.bg} ${cfg.border}`}>
              {/* Status Header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{result.schemeEmoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-base break-words">{result.scheme}</p>
                  <span className={`inline-flex items-center gap-1 text-sm font-semibold ${cfg.textColor}`}>
                    <cfg.Icon size={15} className={result.status === "processing" ? "animate-spin" : ""} />
                    {cfg.label}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span className="text-gray-500">Application ID</span>
                  <span className="font-mono font-bold text-gray-800">{appId.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span className="text-gray-500">Applied Date</span>
                  <span className="text-gray-700">{result.date}</span>
                </div>
                <div className="pt-1">
                  <p className="text-gray-500 text-xs mb-1">Remarks</p>
                  <p className={`font-medium text-sm ${cfg.textColor} break-words`}>{result.remarks}</p>
                </div>
              </div>

              {/* Action buttons */}
              {result.status === "rejected" && (
                <a href="/schemes"
                  className="mt-5 flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition">
                  Reapply – Browse Schemes <ChevronRight size={15} />
                </a>
              )}
            </div>
          )}

          {/* Demo IDs */}
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <p className="text-xs font-bold text-blue-700 mb-2.5">🧪 Try Demo IDs:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(STATUS_MOCK).map((id) => (
                <button key={id} onClick={() => { setAppId(id); setError(""); setResult(null); }}
                  className="text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 active:scale-95 transition font-mono font-medium">
                  {id}
                </button>
              ))}
            </div>
          </div>

          {/* Help */}
          <p className="text-center text-xs text-gray-400">
            Can&apos;t find your ID? Call{" "}
            <a href="tel:14567" className="text-orange-500 font-semibold underline">14567</a>
            {" "}or{" "}
            <a href="/chat" className="text-orange-500 underline">Ask AI Chat →</a>
          </p>
        </div>
      </main>
    </>
  );
}
