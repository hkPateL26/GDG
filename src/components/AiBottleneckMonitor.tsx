"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  Building2,
  Send,
  Zap,
} from "lucide-react";
import { CitizenApplication } from "@/lib/large-datasets";
import { analyzeApplicationSla, SlaBottleneckAnalysis } from "@/lib/admin-hierarchy-data";

interface AiBottleneckMonitorProps {
  applications: CitizenApplication[];
  onSelectApplication?: (app: CitizenApplication) => void;
  onEscalate?: (appId: string, newTargetDesk: string) => void;
}

export default function AiBottleneckMonitor({
  applications,
  onSelectApplication,
  onEscalate,
}: AiBottleneckMonitorProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "breached" | "warning">("breached");
  const [escalatedAppIds, setEscalatedAppIds] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Analyze all active applications
  const seenIds = new Set<string>();
  const activeApps = applications.filter((a) => {
    if (!a || !a.id || seenIds.has(a.id)) return false;
    seenIds.add(a.id);
    return a.status === "processing" || a.status === "pending";
  });
  
  const analyzedApps = activeApps.map((app) => {
    // Generate deterministic minute offsets for demonstration
    let mockOffsetMinutes = 6;
    if (app.id.includes("8") || app.id.includes("3") || app.paymentStatus === "pending_challan") {
      mockOffsetMinutes = 18; // > 15 mins breached
    } else if (app.id.includes("7") || app.id.includes("5")) {
      mockOffsetMinutes = 16; // > 15 mins breached
    } else if (app.id.includes("2")) {
      mockOffsetMinutes = 12; // warning
    }

    const slaAnalysis = analyzeApplicationSla(app, mockOffsetMinutes);
    return { app, sla: slaAnalysis };
  });

  const breachedCount = analyzedApps.filter((item) => item.sla.isBreached).length;
  const warningCount = analyzedApps.filter(
    (item) => !item.sla.isBreached && item.sla.urgencyLevel === "warning"
  ).length;

  const filteredApps = analyzedApps.filter((item) => {
    if (activeFilter === "breached") return item.sla.isBreached;
    if (activeFilter === "warning") return item.sla.urgencyLevel === "warning";
    return true;
  });

  const handleEscalateAction = (appId: string, targetOfficer: string) => {
    setEscalatedAppIds((prev) => ({
      ...prev,
      [appId]: `સફળતાપૂર્વક ${targetOfficer} ને એસ્કેલેટ કરવામાં આવી!`,
    }));
    if (onEscalate) {
      onEscalate(appId, targetOfficer);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* ── AI Bot Header & SLA Rule Banner ── */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white">
                  AI ૧૫-મિનિટ બોટલનેક મોનિટર & ઓટો-એસ્કેલેશન બોટ
                </h3>
                <span className="text-[10px] bg-rose-500 text-white font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" /> લાઈવ ૧૫-મિનિટ ટ્રેકર
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 mt-1 max-w-2xl leading-relaxed">
                ગુજરાત સરકાર ઈ-ગવર્નન્સ નિયમ: કોઈ પણ નાગરિક અરજી આવ્યાના ૧૫ મિનિટમાં અધિકારી સ્તરે કાર્યવાહી
                ન થાય તો AI બોટ આપમેળે કારણ શોધી ઉપરી કચેરી (મામલતદાર/કલેક્ટર) ને તાકીદ કરે છે.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/50 rounded-xl text-xs font-bold text-indigo-200 transition cursor-pointer self-start sm:self-auto shrink-0 active:scale-95"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
            <span>AI રી-સ્કેન</span>
          </button>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">કુલ સક્રિય અરજીઓ</span>
            <span className="text-xl font-black text-white">{activeApps.length}</span>
          </div>

          <div
            onClick={() => setActiveFilter("breached")}
            className={`p-3 rounded-2xl border transition cursor-pointer ${
              activeFilter === "breached"
                ? "bg-rose-950/70 border-rose-500/80 shadow-xs"
                : "bg-slate-900/80 border-slate-800 hover:border-rose-900"
            }`}
          >
            <span className="text-[11px] text-rose-300 block font-bold flex items-center gap-1">
              <AlertTriangle size={12} className="text-rose-400" /> ૧૫+ મિ. અટવાયેલી (SLA બ્રીચ)
            </span>
            <span className="text-xl font-black text-rose-400">{breachedCount}</span>
          </div>

          <div
            onClick={() => setActiveFilter("warning")}
            className={`p-3 rounded-2xl border transition cursor-pointer ${
              activeFilter === "warning"
                ? "bg-amber-950/70 border-amber-500/80 shadow-xs"
                : "bg-slate-900/80 border-slate-800 hover:border-amber-900"
            }`}
          >
            <span className="text-[11px] text-amber-300 block font-bold flex items-center gap-1">
              <Clock size={12} className="text-amber-400" /> ચેતવણી ઝોન (૧૦-૧૪ મિ.)
            </span>
            <span className="text-xl font-black text-amber-400">{warningCount}</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-emerald-300 block font-medium flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" /> નિયત સમયમાં (૧૫ મિ. અંદર)
            </span>
            <span className="text-xl font-black text-emerald-400">
              {Math.max(0, activeApps.length - breachedCount - warningCount)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter Pills (Mobile-App Touch Carousel) ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none touch-pan-x pb-1.5">
        <button
          type="button"
          onClick={() => setActiveFilter("breached")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[40px] select-none ${
            activeFilter === "breached"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-95"
          }`}
        >
          <AlertTriangle size={13} />
          <span>૧૫+ મિનિટથી અટવાયેલી ({breachedCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("warning")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[40px] select-none ${
            activeFilter === "warning"
              ? "bg-amber-500 text-slate-950 shadow-xs font-black"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-95"
          }`}
        >
          <Clock size={13} />
          <span>૧૦-૧૪ મિનિટ ચેતવણી ({warningCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 min-h-[40px] select-none ${
            activeFilter === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-95"
          }`}
        >
          <span>તમામ સક્રિય અરજીઓ ({activeApps.length})</span>
        </button>
      </div>

      {/* ── Applications Stuck Table / Cards ── */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
            🎉
          </div>
          <h4 className="font-black text-slate-900 text-base">કોઈ અરજી ૧૫ મિનિટથી વધુ અટવાયેલી નથી!</h4>
          <p className="text-xs text-slate-500 mt-1">
            તમામ કચેરીઓ (તલાટી, નાયબ મામલતદાર, મામલતદાર) નિયત ૧૫-મિનિટ SLA મર્યાદામાં ઝડપથી કામ કરી રહી છે.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredApps.map(({ app, sla }, idx) => {
            const isEscalated = Boolean(escalatedAppIds[app.id]);

            return (
              <div
                key={`${app.id}-${idx}`}
                className={`bg-white rounded-2xl border-2 p-4 sm:p-5 shadow-xs transition hover:shadow-md ${
                  sla.isBreached
                    ? "border-rose-200 hover:border-rose-400"
                    : "border-amber-200 hover:border-amber-400"
                }`}
              >
                {/* Card Top: ID + Badge + Timer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {app.id}
                    </span>
                    <span className="font-bold text-xs text-slate-700">
                      {app.citizenNameGu || app.citizenName}
                    </span>
                    <span className="text-[10.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {app.schemeNameGu || app.schemeName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs ${
                        sla.isBreached
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      <Clock size={13} className={sla.isBreached ? "text-rose-600 animate-spin" : ""} />
                      <span>{sla.elapsedMinutes} મિનિટથી પેન્ડિંગ</span>
                      {sla.isBreached && <span className="text-[10px] text-rose-600 font-bold">(SLA બ્રીચ)</span>}
                    </span>
                  </div>
                </div>

                {/* Card Body: Where is it stuck? (કામ ક્યાં પહોંચ્યું?) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 py-3 text-xs">
                  {/* Column 1: Current Desk Location */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                      🏛️ હાલ ક્યાં અટવાયું છે? (Current Desk)
                    </span>
                    <p className="font-bold text-slate-900 leading-snug">{sla.currentDeskGu}</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      અધિકારી: <strong>{sla.currentOfficerName}</strong>
                    </p>
                  </div>

                  {/* Column 2: AI Root Cause Analysis */}
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                    <span className="text-[10.5px] font-bold text-amber-800 uppercase tracking-wide block mb-1 flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-600" /> AI બોટલનેક નિદાન (Root Cause)
                    </span>
                    <p className="text-slate-800 leading-relaxed text-[11.5px]">{sla.aiDiagnosisGu}</p>
                  </div>

                  {/* Column 3: AI Recommended Action & Escalation */}
                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10.5px] font-bold text-indigo-900 uppercase tracking-wide block mb-1 flex items-center gap-1">
                        <Zap size={11} className="text-indigo-600" /> AI ભલામણ (Action Required)
                      </span>
                      <p className="text-slate-800 text-[11.5px] leading-snug">{sla.recommendedActionGu}</p>
                    </div>

                    {isEscalated ? (
                      <div className="mt-2 p-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[10.5px] font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        <span>{escalatedAppIds[app.id]}</span>
                      </div>
                    ) : (
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEscalateAction(app.id, sla.escalationTargetOfficer)}
                          className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 min-h-[40px]"
                        >
                          <Send size={12} />
                          <span>તાત્કાલિક એસ્કેલેટ કરો</span>
                        </button>
                        {onSelectApplication && (
                          <button
                            type="button"
                            onClick={() => onSelectApplication(app)}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-95 min-h-[40px]"
                          >
                            ફાઇલ ખોલો
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
