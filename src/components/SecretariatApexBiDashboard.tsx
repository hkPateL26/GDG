"use client";

import { useState } from "react";
import {
  SIX_MONTH_HISTORICAL_DATA,
  DISTRICT_PERFORMANCE_INDEX,
  getSecretariatMlForecast,
  MonthlyHistoricalSnapshot,
} from "@/lib/historical-ml-engine";
import {
  TrendingUp,
  Brain,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";

export default function SecretariatApexBiDashboard() {
  const [selectedSnapshot, setSelectedSnapshot] = useState<MonthlyHistoricalSnapshot>(
    SIX_MONTH_HISTORICAL_DATA[SIX_MONTH_HISTORICAL_DATA.length - 1]
  );
  const mlForecast = getSecretariatMlForecast();

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* ── Apex IAS Command Center Header ── */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-2xl text-2xl shrink-0 shadow-inner">
              🏛️
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  મુખ્ય સચિવાલય • Apex IAS BI
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Brain size={11} /> ML પ્રિડિક્ટિવ એન્જિન લાઈવ ({mlForecast.modelConfidenceScore})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                ગુજરાત રાજ્ય વહીવટી પ્રદર્શન & ૬-માસિક ML એનાલિટિક્સ
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                સ્વર્ણિમ સંકુલ-૧, ગાંધીનગર • ગુજરાત જાહેર સેવા હક્ક અધિનિયમ (GRTPSA ૨૦૧૩) હેઠળ ૩૩ જિલ્લાઓનું ઐતિહાસિક સ્ક્રુટિની વિશ્લેષણ અને આગામી બોટલનેક પૂર્વાનુમાન.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-right shrink-0">
            <span className="text-[10.5px] text-slate-300 font-semibold block">રાજ્ય સરેરાશ RTS નિકાલ ગતિ</span>
            <div className="text-2xl font-black text-amber-400 flex items-center justify-end gap-1.5 mt-0.5">
              <span>{selectedSnapshot.actualAvgProcessingDays} દિવસ</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40">
                -૭૯% ઝડપી
              </span>
            </div>
            <span className="text-[10px] text-slate-400">કાયદાકીય મર્યાદા: ૧૫ દિવસ</span>
          </div>
        </div>
      </div>

      {/* ── 4 Key Performance Metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>૬-માસિક કુલ નિકાલ</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">૮,૯૩,૧૦૦</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> ૯૮.૧% કાયદાકીય સુસંગતતા
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>વાસ્તવિક સરેરાશ સમય</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">૩.૧ દિવસ</p>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            ૧૫ દિવસની સરકારી મર્યાદા સામે
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>DBT સીધા ખાતામાં સહાય</span>
            <Zap size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-600">₹૧,૯૦૨.૬ કરોડ</p>
          <span className="text-[11px] text-blue-700 font-semibold block mt-1">
            ૧૦૦% આધાર-સીડેડ બેંક ટ્રાન્સફર
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>ML પ્રિડિક્ટિવ અંદાજ</span>
            <Sparkles size={16} className="text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-600">૧,૮૪,૦૦૦</p>
          <span className="text-[11px] text-purple-700 font-semibold block mt-1">
            આગામી મહિને +૫.૪% અપેક્ષિત અરજીઓ
          </span>
        </div>
      </div>

      {/* ── 6-Month Historical Progression Table & Visual Velocity ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>📈 ૬-માસિક ઐતિહાસિક પ્રગતિ ડેટાસેટ (Oct 2025 - Mar 2026)</span>
            </h3>
            <p className="text-xs text-slate-500">
              ગુજરાત સરકાર દ્વારા ડિજિટાઇઝેશન પછી દર મહિને નિકાલની ઝડપમાં થયેલો નોંધપાત્ર વધારો
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
            લાઈવ સરકારી રિપોર્ટિંગ સિસ્ટમ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-black border-y border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">માસ / સમયગાળો</th>
                <th className="py-2.5 px-3 text-right">આવેલી અરજીઓ</th>
                <th className="py-2.5 px-3 text-right">સમયસર નિકાલ</th>
                <th className="py-2.5 px-3 text-right">પેન્ડન્સી / બ્રીચ</th>
                <th className="py-2.5 px-3 text-center">સરેરાશ દિવસો</th>
                <th className="py-2.5 px-3 text-right">DBT વિતરણ (₹ Cr)</th>
                <th className="py-2.5 px-3 text-center">સફળતા દર</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {SIX_MONTH_HISTORICAL_DATA.map((snap) => {
                const isSelected = selectedSnapshot.monthKey === snap.monthKey;
                return (
                  <tr
                    key={snap.monthKey}
                    onClick={() => setSelectedSnapshot(snap)}
                    className={`cursor-pointer transition hover:bg-amber-50/60 ${
                      isSelected ? "bg-amber-50/90 font-bold" : ""
                    }`}
                  >
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-amber-500" : "bg-slate-300"}`} />
                      <span className="text-slate-900 font-bold">{snap.monthNameGu}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      {snap.totalReceived.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-700 font-bold">
                      {snap.totalDisposedOnTime.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-rose-600 font-semibold">
                      {snap.totalSlaBreached.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold font-mono">
                        {snap.actualAvgProcessingDays} દિવસ
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-blue-700 font-bold">
                      ₹{snap.dbtDisbursedCroresINR} Cr
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {snap.complianceRatePercent}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Grid: District Index & ML Forecasting ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* District Benchmark */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Building size={16} className="text-blue-600" />
              <span>જિલ્લાવાર RTS નિકાલ ઈન્ડેક્સ (33 Districts Ranking)</span>
            </h4>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
              Secretariat Performance Tier
            </span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {DISTRICT_PERFORMANCE_INDEX.map((d, i) => (
              <div
                key={d.districtEn}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    i < 3 ? "bg-amber-400 text-slate-950 font-black" : "bg-slate-200 text-slate-700"
                  }`}>
                    #{i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{d.districtGu} ({d.districtEn})</p>
                    <p className="text-[10px] text-slate-500">
                      મુખ્ય વિભાગ: <strong className="text-slate-700">{d.primaryBottleneckDept}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold font-mono text-emerald-700 text-sm">{d.onTimeDisposalRate}%</span>
                  <span className="text-[10px] text-slate-400 block">સરેરાશ {d.avgResolutionDays} દિવસ</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Learning Predictive Risk Matrix */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Brain size={16} className="text-purple-600" />
              <span>ML પ્રિડિક્ટિવ બોટલનેક જોખમ પૂર્વાનુમાન (Predictive Matrix)</span>
            </h4>
            <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">
              AI Risk Engine
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            મશીન લર્નિંગ રિગ્રેશન મોડલ દ્વારા આગામી ૩૦ દિવસમાં કઈ યોજનામાં ફાઇલો અટકવાની શક્યતા છે તેનું વહેલું ચેતવણી એલર્ટ:
          </p>

          <div className="space-y-2.5">
            {mlForecast.schemeRiskAlerts.map((alert) => (
              <div
                key={alert.schemeCategory}
                className="p-3.5 rounded-2xl border text-xs space-y-1.5 bg-slate-50/70 border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{alert.schemeCategoryGu}</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      alert.riskLevel === "high"
                        ? "bg-rose-100 text-rose-700 border border-rose-300"
                        : alert.riskLevel === "medium"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}
                  >
                    બ્રીચ જોખમ: {alert.predictedBreachRiskPercent}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  💡 <strong>સચિવ ભલામણ:</strong> {alert.recommendedMitigation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
