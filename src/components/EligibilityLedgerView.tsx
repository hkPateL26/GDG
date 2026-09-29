"use client";

import { useState, useEffect } from "react";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import { Scheme } from "@/types";
import { CitizenBenefitRecord, CitizenLedgerProfile } from "@/lib/large-datasets";
import Link from "next/link";
import {
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  History,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface EligibilityResult {
  scheme: Scheme;
  isEligible: boolean;
  score: number;
  reasons: string[];
  failedReasons: string[];
  alreadyAvailed?: boolean;
  availedRecord?: CitizenBenefitRecord;
}

interface EligibilityLedgerViewProps {
  citizen: CitizenLedgerProfile;
  onNavigateToDocuments?: () => void;
}

export default function EligibilityLedgerView({
  citizen,
  onNavigateToDocuments,
}: EligibilityLedgerViewProps) {
  const [age, setAge] = useState<number | "">(41);
  const [gender, setGender] = useState<"all" | "male" | "female">("male");
  const [annualIncome, setAnnualIncome] = useState<number | "">(citizen.annualIncome || 180000);
  const [occupation, setOccupation] = useState<string>(citizen.occupation || "farmer");
  const [category, setCategory] = useState<string>(citizen.category || "OBC");
  const [hasLand, setHasLand] = useState<boolean>(citizen.hasLand !== undefined ? citizen.hasLand : true);
  const [hasBPL, setHasBPL] = useState<boolean>(citizen.hasBPL || false);
  const [hasGirlChild, setHasGirlChild] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"eligible" | "ineligible" | "profile">("profile");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (citizen) {
        if (citizen.annualIncome) setAnnualIncome(citizen.annualIncome);
        if (citizen.occupation) setOccupation(citizen.occupation);
        if (citizen.category) setCategory(citizen.category);
        if (citizen.hasLand !== undefined) setHasLand(citizen.hasLand);
        if (citizen.hasBPL !== undefined) setHasBPL(citizen.hasBPL);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [citizen]);

  const evaluateSchemes = (): EligibilityResult[] => {
    const numericAge = typeof age === "number" ? age : 25;
    const numericIncome = typeof annualIncome === "number" ? annualIncome : 200000;

    return SCHEMES_DATA.map((scheme) => {
      const reasons: string[] = [];
      const failedReasons: string[] = [];
      let checksPassed = 0;
      let totalChecks = 0;

      const availedRecord = citizen.availedBenefits.find(
        (b) =>
          b.schemeId === scheme.id ||
          (scheme.id === "pm-kisan" && b.schemeId.includes("kisan")) ||
          (scheme.id === "ayushman-bharat" && b.schemeId.includes("ayushman")) ||
          ((scheme.id === "pm-awas" || scheme.id === "pm-awas-gramin") && (b.schemeId.includes("awas") || b.schemeId.includes("pm-awas"))) ||
          ((scheme.id === "ujjwala-yojana" || scheme.id === "pm-ujjwala") && b.schemeId.includes("ujjwala")) ||
          ((scheme.id === "mudra-loan" || scheme.id === "pm-mudra") && b.schemeId.includes("mudra"))
      );

      if (scheme.eligibility.minAge !== undefined || scheme.eligibility.maxAge !== undefined) {
        totalChecks++;
        const min = scheme.eligibility.minAge ?? 0;
        const max = scheme.eligibility.maxAge ?? 100;
        if (numericAge >= min && numericAge <= max) { checksPassed++; reasons.push(`ઉંમર ${numericAge}વ. ✓`); }
        else failedReasons.push(`ઉંમર ${min}-${max}વ. જોઈએ`);
      }
      if (scheme.eligibility.gender && scheme.eligibility.gender !== "all") {
        totalChecks++;
        if (gender === scheme.eligibility.gender) { checksPassed++; reasons.push(`${scheme.eligibility.gender === "female" ? "મહિલા" : "પુરુષ"} ✓`); }
        else failedReasons.push(`ફક્ત ${scheme.eligibility.gender === "female" ? "મહિલા" : "પુરુષ"} માટે`);
      }
      if (scheme.eligibility.incomeLimit && scheme.eligibility.incomeLimit > 0) {
        totalChecks++;
        if (numericIncome <= scheme.eligibility.incomeLimit) { checksPassed++; reasons.push(`આવક ✓`); }
        else failedReasons.push(`આવક ₹${(scheme.eligibility.incomeLimit / 1000).toFixed(0)}K ↓ જોઈએ`);
      }
      if (scheme.eligibility.occupation && scheme.eligibility.occupation.length > 0) {
        totalChecks++;
        if (scheme.eligibility.occupation.includes(occupation)) { checksPassed++; reasons.push(`${occupation} ✓`); }
        else failedReasons.push(`ફક્ત ${scheme.eligibility.occupation.join(", ")}`);
      }
      if (scheme.id === "pm-kisan" || scheme.id === "fasal-bima") {
        totalChecks++;
        if (hasLand) { checksPassed++; reasons.push("7/12 ✓"); }
        else failedReasons.push("7/12 જમીન જોઈએ");
      }
      if (scheme.id === "pm-awas" || scheme.id === "pm-awas-gramin" || scheme.id.includes("awas") || scheme.id === "ayushman-bharat") {
        totalChecks++;
        if (hasBPL || numericIncome <= 200000) { checksPassed++; reasons.push("BPL/આવક ✓"); }
        else failedReasons.push("BPL અથવા આવક ₹2L ↓ જોઈએ");
      }
      if (scheme.id === "sukanya-samriddhi") {
        totalChecks++;
        if (hasGirlChild) { checksPassed++; reasons.push("દીકરી ✓"); }
        else failedReasons.push("10વ.↓ દીકરી જોઈએ");
      }

      const isEligible = totalChecks === 0 || checksPassed === totalChecks;
      const score = totalChecks === 0 ? 100 : Math.round((checksPassed / totalChecks) * 100);
      return { scheme, isEligible, score, reasons, failedReasons, alreadyAvailed: Boolean(availedRecord), availedRecord };
    });
  };

  const results = evaluateSchemes();
  const eligibleSchemes = results.filter((r) => r.isEligible);
  const otherSchemes = results.filter((r) => !r.isEligible);

  const resetForm = () => {
    setAge(41); setGender("male");
    setAnnualIncome(citizen.annualIncome || 180000);
    setOccupation(citizen.occupation || "farmer");
    setCategory(citizen.category || "OBC");
    setHasLand(citizen.hasLand !== undefined ? citizen.hasLand : true);
    setHasBPL(citizen.hasBPL || false);
    setHasGirlChild(false);
  };

  const tabs = [
    { id: "profile" as const,    label: "⚙️ પ્રોફાઇલ & DBT",                       color: "orange"  },
    { id: "eligible" as const,   label: `✅ પાત્ર (${eligibleSchemes.length})`,   color: "emerald" },
    { id: "ineligible" as const, label: `❌ અ-પાત્ર (${otherSchemes.length})`,    color: "slate"   },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">

      {/* ── Summary Banner ── */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[10px] uppercase font-extrabold tracking-wider text-orange-100 mb-0.5">
            AI પાત્રતા ચકાસણી — DBT De-duplication
          </p>
          <h2 className="text-xl font-black leading-tight">
            {eligibleSchemes.length} યોજનાઓ — તમે પાત્ર છો!
          </h2>
          <p className="text-xs text-orange-100 mt-0.5">
            {otherSchemes.length} અ-પાત્ર &bull; {citizen.availedBenefits.length} DBT અગાઉ પ્રાપ્ત
          </p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0">
          {eligibleSchemes.length}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setActiveTab(t.id); setExpandedId(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === t.id
                ? "bg-white shadow-sm text-slate-900 ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB: ELIGIBLE ══ */}
      {activeTab === "eligible" && (
        <div className="space-y-2">
          {eligibleSchemes.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-sm text-slate-500">
              આ પ્રોફાઇલ મુજબ કોઈ યોજના મળી નથી.
              <br />
              <button onClick={() => setActiveTab("profile")}
                className="mt-3 text-orange-600 font-bold text-xs underline">
                પ્રોફાઇલ બદલો →
              </button>
            </div>
          ) : (
            eligibleSchemes.map(({ scheme, reasons, alreadyAvailed, availedRecord }) => {
              const isOpen = expandedId === scheme.id;
              return (
                <div key={scheme.id}
                  className={`bg-white rounded-xl border-2 transition overflow-hidden ${
                    isOpen ? "border-emerald-400 shadow-md" : "border-emerald-100 hover:border-emerald-300 shadow-xs"
                  }`}>

                  {/* Compact Row */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : scheme.id)}
                    className="w-full flex items-center gap-3 p-3 cursor-pointer text-left"
                  >
                    <span className="text-2xl shrink-0">{scheme.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900">{scheme.nameGu}</span>
                        {alreadyAvailed ? (
                          <span className="text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                            ✓ ₹{availedRecord?.amountDisbursed.toLocaleString("en-IN")} અગાઉ
                          </span>
                        ) : (
                          <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0">
                            ✓ ૧૦૦% પાત્ર
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{scheme.benefits?.[0]}</p>
                    </div>
                    <span className="text-slate-300 shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>

                  {/* Expanded */}
                  {isOpen && (
                    <div className="border-t border-emerald-100 bg-emerald-50/40 px-3.5 py-3 space-y-2.5">
                      <p className="text-xs text-slate-600 leading-relaxed">{scheme.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {reasons.map((r, i) => (
                          <span key={i} className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                            {r}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        📄 {(scheme.documents || []).slice(0, 2).join(" • ")}
                        {scheme.documents.length > 2 && ` +${scheme.documents.length - 2}`}
                      </p>
                      <div className="flex gap-2 pt-0.5">
                        {onNavigateToDocuments ? (
                          <button type="button" onClick={onNavigateToDocuments}
                            className="flex-1 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1 active:scale-95">
                            ઓનલાઇન અરજી <ArrowRight size={12} />
                          </button>
                        ) : (
                          <Link href="/documents"
                            className="flex-1 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1 active:scale-95">
                            ઓનલાઇન અરજી <ArrowRight size={12} />
                          </Link>
                        )}
                        <Link href={`/schemes/${scheme.id}`}
                          className="px-4 py-1.5 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold rounded-lg text-xs transition">
                          વિગત →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ══ TAB: INELIGIBLE ══ */}
      {activeTab === "ineligible" && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 px-1">
            💡 પ્રોફાઇલ બદલો — ઘણી યોજનાઓ પાત્ર બની શકે
          </p>
          {otherSchemes.map(({ scheme, failedReasons }) => (
            <div key={scheme.id}
              className="bg-white rounded-xl border border-slate-100 p-3 flex items-start gap-3 hover:border-slate-200 transition shadow-xs">
              <span className="text-xl shrink-0 mt-0.5 opacity-60">{scheme.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-700 truncate">{scheme.nameGu}</p>
                <div className="mt-0.5 flex flex-wrap gap-1">
                  {failedReasons.slice(0, 2).map((f, i) => (
                    <span key={i} className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded-full">
                      ✕ {f}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded shrink-0 mt-1">
                અ-પાત્ર
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ══ TAB: PROFILE & DBT ══ */}
      {activeTab === "profile" && (
        <div className="space-y-4">

          {/* Profile Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-orange-500" />
                પ્રોફાઇલ ફિલ્ટર — AI ચેક
              </h3>
              <span role="button" tabIndex={0} onClick={resetForm} onKeyDown={(e) => e.key === "Enter" && resetForm()}
                className="text-xs text-slate-400 hover:text-orange-600 flex items-center gap-1 transition cursor-pointer">
                <RotateCcw size={11} /> રીસેટ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">ઉંમર (વ.)</label>
                <input type="number" min={1} max={100} value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">લિંગ</label>
                <select value={gender} onChange={(e) => setGender(e.target.value as "all" | "male" | "female")}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="male">પુરુષ</option>
                  <option value="female">મહિલા</option>
                  <option value="all">અન્ય</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">વાર્ષિક આવક (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                <input type="number" step={10000} value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : "")}
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">વ્યવસાય</label>
                <select value={occupation} onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="farmer">ખેડૂત</option>
                  <option value="labourer">શ્રમિક</option>
                  <option value="student">વિદ્યાર્થી</option>
                  <option value="self-employed">વેપારી</option>
                  <option value="unemployed">બેરોજગાર</option>
                  <option value="homemaker">ગૃહિણી</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">સામાજિક કેટેગરી</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="General">General</option>
                  <option value="OBC">OBC/SEBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              {[
                { checked: hasLand, set: setHasLand, label: "🌾 7/12 જમીન" },
                { checked: hasBPL, set: setHasBPL, label: "📋 BPL કાર્ડ" },
                { checked: hasGirlChild, set: setHasGirlChild, label: "👧 10વ.↓ દીકરી" },
              ].map(({ checked, set, label }, i) => (
                <label key={i}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 cursor-pointer transition text-center ${
                    checked ? "border-orange-400 bg-orange-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                  }`}>
                  <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="sr-only" />
                  <span className="text-base">{label.split(" ")[0]}</span>
                  <span className="text-[10px] font-bold text-slate-600 leading-tight">{label.split(" ").slice(1).join(" ")}</span>
                  <span className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${
                    checked ? "border-orange-500 bg-orange-500" : "border-slate-300"
                  }`}>
                    {checked && <span className="text-white text-[8px] font-black">✓</span>}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={() => setActiveTab("eligible")}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl text-sm transition active:scale-[0.98] shadow-sm">
              ✅ {eligibleSchemes.length} પાત્ર યોજનાઓ જુઓ →
            </button>
          </div>

          {/* DBT Ledger */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400" />
                <h3 className="font-extrabold text-sm text-amber-400">સત્તાવાર DBT ખાતું</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-mono font-bold">
                ✓ 2FA લિંક્ડ
              </span>
            </div>

            <div className="bg-slate-800 rounded-xl p-3">
              <p className="font-bold text-white text-sm">{citizen.citizenNameGu || citizen.citizenName}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                XXXX-XXXX-{citizen.aadhaarLast4} &bull; +91 {citizen.mobile}
              </p>
              <p className="text-[11px] text-emerald-400 mt-0.5">
                {citizen.village}, {citizen.districtGu || citizen.district}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                <History size={12} /> ભૂતકાળ DBT લાભો ({citizen.availedBenefits.length}):
              </p>
              {citizen.availedBenefits.map((b, idx) => (
                <div key={idx} className="bg-slate-800/70 border border-slate-700 rounded-xl p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200 truncate">{b.schemeNameGu}</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs ml-2 shrink-0">
                      ₹{b.amountDisbursed.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex justify-between">
                    <span>{b.disbursedDate}</span>
                    <span>{b.certOrInstallmentNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
