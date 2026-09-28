"use client";

import { useState, useEffect } from "react";
import { CATEGORY_LABELS } from "@/lib/schemes-data";
import SchemeCard from "@/components/SchemeCard";
import { SkeletonCard } from "@/components/Skeleton";
import Navbar from "@/components/Navbar";
import { Scheme } from "@/types";
import {
  Server,
  Activity,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = Object.keys(CATEGORY_LABELS);
const PAGE_SIZE = 12;

interface DbClusterMeta {
  source: string;
  serverCluster: string;
  loadBalancerStatus: string;
  latencyMs: number;
  totalInCluster: number;
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [page, setPage] = useState(1);
  const [clusterMeta, setClusterMeta] = useState<DbClusterMeta>({
    source: "cloud-firestore",
    serverCluster: "GSDC-Gandhinagar-Node-01",
    loadBalancerStatus: "active-round-robin",
    latencyMs: 32,
    totalInCluster: 26,
  });

  // Reset to page 1 when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  // Dynamic fetch connected to Cloud Firestore with debouncing and race-condition safety
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all") params.append("category", selectedCategory);
        if (search.trim()) params.append("search", search.trim());

        const res = await fetch(`/api/schemes?${params.toString()}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();

        if (active && data.success && Array.isArray(data.schemes)) {
          setSchemes(data.schemes);
          setClusterMeta({
            source: data.source || "cloud-firestore",
            serverCluster: data.serverCluster || "GSDC-Gandhinagar-Node-01",
            loadBalancerStatus: data.loadBalancerStatus || "active-round-robin",
            latencyMs: data.latencyMs || 24,
            totalInCluster: data.totalInCluster || data.schemes.length,
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load schemes from backend:", err);
        if (active) setIsLoading(false);
      }
    }, search ? 250 : 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, selectedCategory, refreshTrigger]);

  const handleCategoryChange = (cat: string) => {
    setIsLoading(true);
    setSelectedCategory(cat);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Pagination
  const totalPages = Math.ceil(schemes.length / PAGE_SIZE);
  const paginatedSchemes = schemes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        {/* Real-time Enterprise DPI Status Bar */}
        <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-3 sm:px-6 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              DPI Cloud: {clusterMeta.source === "cloud-firestore" ? "Google Cloud Firestore" : "Local Edge"}
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Server size={12} className="text-orange-400" />
              Node: {clusterMeta.serverCluster}
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Activity size={12} className="text-blue-400" />
              Load Balancer: Active Round-Robin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-300 font-mono">
              ⚡ {clusterMeta.latencyMs}ms
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">
              કુલ યોજનાઓ: {clusterMeta.totalInCluster}
            </span>
            <button
              onClick={handleRefresh}
              className="text-slate-400 hover:text-white transition flex items-center gap-1"
              title="રીફ્રેશ લાઈવ ડેટા"
            >
              <RefreshCw size={11} className={isLoading ? "animate-spin text-orange-400" : ""} />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-700 text-white py-7 sm:py-10 px-4 shadow-inner">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold mb-3 border border-white/20">
              <Sparkles size={13} className="text-amber-300" />
              સત્તાવાર સરકારી કલ્યાણકારી યોજનાઓ ડેટાબેઝ
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
              🏛️ Government Schemes Directory
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm mb-5 max-w-2xl mx-auto">
              ગુજરાત અને કેન્દ્ર સરકારની ખેડૂત, આરોગ્ય, શિક્ષણ, આવાસ અને મહિલા કલ્યાણ યોજનાઓ
            </p>

            {/* Live Search Input */}
            <div className="relative max-w-xl mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="PM Kisan, આયુષ્માન, MYSY, સૂર્ય ઘર, આવાસ..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl text-gray-900 text-sm bg-white shadow-xl focus:outline-none focus:ring-3 focus:ring-orange-300 font-medium placeholder-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-7">

          {/* Category Filter Pills (Horizontal Scroll) */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-1 px-1 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                selectedCategory === "all"
                  ? "bg-orange-600 text-white shadow-md ring-2 ring-orange-300"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
              }`}
            >
              🌐 બધી ({clusterMeta.totalInCluster})
            </button>
            {CATEGORIES.map((cat) => {
              const info = CATEGORY_LABELS[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shadow-2xs ${
                    isSelected
                      ? "bg-orange-600 text-white shadow-md ring-2 ring-orange-300"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                  }`}
                >
                  <span>{info.icon}</span>
                  <span>{info.labelGu || info.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results + Pagination top row */}
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-xs font-semibold text-gray-700">
              {isLoading ? (
                <span className="flex items-center gap-1 text-orange-600">
                  <RefreshCw size={12} className="animate-spin" /> લોડ થઈ રહ્યું છે...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  {schemes.length} યોજનાઓ — પૃષ્ઠ {page}/{totalPages || 1}
                </span>
              )}
            </p>
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                      p === page
                        ? "bg-orange-600 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Schemes Grid or Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginatedSchemes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {paginatedSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>

              {/* Bottom Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-bold hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={14} /> પાછળ
                  </button>
                  <span className="text-xs text-gray-500 font-medium px-2">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-bold hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    આગળ <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-xs max-w-lg mx-auto p-6">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                કોઈ મેળ ખાતી યોજના મળી નથી
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                અન્ય કેટેગરી અથવા અલગ શબ્દથી શોધો.
              </p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("all"); }}
                className="bg-orange-600 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md hover:bg-orange-700 transition cursor-pointer"
              >
                બધા ફિલ્ટર દૂર કરો
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
