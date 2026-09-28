"use client";

import { useState, useEffect } from "react";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import { Scheme } from "@/types";
import { CitizenBenefitRecord, CitizenLedgerProfile } from "@/lib/large-datasets";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Filter,
  RotateCcw,
  ShieldCheck,
  History,
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
  // Citizen Profile Form State
  const [age, setAge] = useState<number | "">(41);
  const [gender, setGender] = useState<"all" | "male" | "female">("male");
  const [annualIncome, setAnnualIncome] = useState<number | "">(citizen.annualIncome || 180000);
  const [occupation, setOccupation] = useState<string>(citizen.occupation || "farmer");
  const [category, setCategory] = useState<string>(citizen.category || "OBC");
  const [hasLand, setHasLand] = useState<boolean>(citizen.hasLand !== undefined ? citizen.hasLand : true);
  const [hasBPL, setHasBPL] = useState<boolean>(citizen.hasBPL || false);
  const [hasGirlChild, setHasGirlChild] = useState<boolean>(false);

  // UI toggles
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showIneligible, setShowIneligible] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

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

  // Evaluate schemes against citizen profile with De-duplication check
  const evaluateSchemes = (): EligibilityResult[] => {
    const numericAge = typeof age === "number" ? age : 25;
    const numericIncome = typeof annualIncome === "number" ? annualIncome : 200000;

    return SCHEMES_DATA.map((scheme) => {
      const reasons: string[] = [];
      const failedReasons: string[] = [];
      let checksPassed = 0;
      let totalChecks = 0;

      // 0. De-duplication & Past Availed Check
      const availedRecord = citizen.availedBenefits.find(
        (b) =>
          b.schemeId === scheme.id ||
          (scheme.id === "pm-kisan" && b.schemeId.includes("kisan")) ||
          (scheme.id === "ayushman-bharat" && b.schemeId.includes("ayushman")) ||
          ((scheme.id === "pm-awas" || scheme.id === "pm-awas-gramin") && (b.schemeId.includes("awas") || b.schemeId.includes("pm-awas"))) ||
          ((scheme.id === "ujjwala-yojana" || scheme.id === "pm-ujjwala") && b.schemeId.includes("ujjwala")) ||
          ((scheme.id === "mudra-loan" || scheme.id === "pm-mudra") && b.schemeId.includes("mudra"))
      );

      // 1. Age Check
      if (scheme.eligibility.minAge !== undefined || scheme.eligibility.maxAge !== undefined) {
        totalChecks++;
        const min = scheme.eligibility.minAge ?? 0;
        const max = scheme.eligibility.maxAge ?? 100;
        if (numericAge >= min && numericAge <= max) {
          checksPassed++;
          reasons.push(`ઉંમર (${numericAge}વ.) ${min}-${max} સ્વીકૃત`);
        } else {
          failedReasons.push(`ઉંમર ${min}-${max} વ. જોઈએ`);
        }
      }

      // 2. Gender Check
      if (scheme.eligibility.gender && scheme.eligibility.gender !== "all") {
        totalChecks++;
        if (gender === scheme.eligibility.gender) {
          checksPassed++;
          reasons.push(`${scheme.eligibility.gender === "female" ? "મહિલા" : "પુરુષ"} — લાગુ`);
        } else {
          failedReasons.push(`ફક્ત ${scheme.eligibility.gender === "female" ? "મહિલાઓ" : "પુરુષો"} માટે`);
        }
      }

      // 3. Income Check
      if (scheme.eligibility.incomeLimit && scheme.eligibility.incomeLimit > 0) {
        totalChecks++;
        if (numericIncome <= scheme.eligibility.incomeLimit) {
          checksPassed++;
          reasons.push(`આવક ₹${(numericIncome / 1000).toFixed(0)}K — મર્યાદા ₹${(scheme.eligibility.incomeLimit / 1000).toFixed(0)}K ની અંદર`);
        } else {
          failedReasons.push(`આવક ₹${(scheme.eligibility.incomeLimit / 1000).toFixed(0)}K+ — વધુ છે`);
        }
      }

      // 4. Occupation Check
      if (scheme.eligibility.occupation && scheme.eligibility.occupation.length > 0) {
        totalChecks++;
        if (scheme.eligibility.occupation.includes(occupation)) {
          checksPassed++;
          reasons.push(`${occupation} — વ્યવસાય પાત્ર`);
        } else {
          failedReasons.push(`ફક્ત ${scheme.eligibility.occupation.join(", ")} માટે`);
        }
      }

      // 5. Special conditions
      if (scheme.id === "pm-kisan" || scheme.id === "fasal-bima") {
        totalChecks++;
        if (hasLand) {
          checksPassed++;
          reasons.push("7/12 જમીન ✓");
        } else {
          failedReasons.push("ખેતીની જમીન (7/12) જોઈએ");
        }
      }

      if (scheme.id === "pm-awas" || scheme.id === "pm-awas-gramin" || scheme.id.includes("awas") || scheme.id === "ayushman-bharat") {
        totalChecks++;
        if (hasBPL || numericIncome <= 200000) {
          checksPassed++;
          reasons.push("BPL/અલ્પ-આવક ✓");
        } else {
          failedReasons.push("BPL અથવા આવક ₹2L ↓ જોઈએ");
        }
      }

      if (scheme.id === "sukanya-samriddhi") {
        totalChecks++;
        if (hasGirlChild) {
          checksPassed++;
          reasons.push("10 વ. ↓ દીકરી ✓");
        } else {
          failedReasons.push("10 વ. ↓ દીકરી જોઈએ");
        }
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
    setAge(41);
    setGender("male");
    setAnnualIncome(citizen.annualIncome || 180000);
    setOccupation(citizen.occupation || "farmer");
    setCategory(citizen.category || "OBC");
    setHasLand(citizen.hasLand !== undefined ? citizen.hasLand : true);
    setHasBPL(citizen.hasBPL || false);
    setHasGirlChild(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">

      {/* ── Summary Banner ── */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-extrabold tracking-wider text-orange-100">AI પાત્રતા ચકાસણી</p>
          <h2 className="text-lg font-black mt-0.5">
            {eligibleSchemes.length} યોજના — તમે પાત્ર છો!
          </h2>
          <p className="text-[11px] text-orange-100">
            {otherSchemes.length} અ-પાત્ર • {citizen.availedBenefits.length} DBT લાભ અગાઉ
          </p>
        </div>
        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">
          {eligibleSchemes.length}
        </div>
      </div>

      {/* ── DBT Ledger + Profile Form — Collapsible ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* DBT Ledger Toggle */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowLedger((v) => !v)}
            className="w-full flex items-center justify-between p-3.5 cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <ShieldCheck size={16} /> DBT ખાતું ({citizen.availedBenefits.length} રેકોર્ડ)
            </span>
            {showLedger ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {showLedger && (
            <div className="px-3.5 pb-3.5 space-y-2 border-t border-slate-700 pt-2.5">
              <div className="bg-slate-800 rounded-xl p-2.5 text-xs">
                <p className="font-bold text-white">{citizen.citizenNameGu || citizen.citizenName}</p>
                <p className="text-slate-400 font-mono text-[10px] mt-0.5">
                  XXXX-XXXX-{citizen.aadhaarLast4} • {citizen.village}, {citizen.districtGu || citizen.district}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                  <History size={11} /> ભૂતકાળ DBT લાભો:
                </p>
                {citizen.availedBenefits.map((b, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700 rounded-lg p-2 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 truncate">{b.schemeNameGu}</span>
                      <span className="font-mono text-emerald-400 font-bold ml-2 shrink-0">₹{b.amountDisbursed.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-slate-500 font-mono mt-0.5">{b.disbursedDate} • {b.certOrInstallmentNo}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Form Toggle */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setShowProfileForm((v) => !v)}
            className="w-full flex items-center justify-between p-3.5 cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Filter size={15} className="text-orange-500" /> પ્રોફાઇલ ફિલ્ટર
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); resetForm(); }}
                className="text-[10px] text-slate-400 hover:text-orange-600 flex items-center gap-0.5 transition"
              >
                <RotateCcw size={10} /> રીસેટ
              </button>
              {showProfileForm ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </div>
          </button>

          {showProfileForm && (
            <div className="px-3.5 pb-3.5 border-t border-slate-100 pt-2.5 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">ઉંમર</label>
                  <input type="number" min={1} max={100} value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">લિંગ</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value as "all" | "male" | "female")}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-400">
                    <option value="male">પુરુષ</option>
                    <option value="female">મહિલા</option>
                    <option value="all">અન્ય</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">વાર્ષિક આવક (₹)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input type="number" step={10000} value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : "")}
                    className="w-full pl-6 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-orange-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">વ્યવસાય</label>
                  <select value={occupation} onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-400">
                    <option value="farmer">ખેડૂત</option>
                    <option value="labourer">શ્રમિક</option>
                    <option value="student">વિદ્યાર્થી</option>
                    <option value="self-employed">વેપારી</option>
                    <option value="unemployed">બેરોજગાર</option>
                    <option value="homemaker">ગૃહિણી</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">કેટેગરી</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-400">
                    <option value="General">General</option>
                    <option value="OBC">OBC/SEBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100 space-y-1.5">
                {[
                  { id: "land", checked: hasLand, set: setHasLand, label: "ખેતીની જમીન (7/12)" },
                  { id: "bpl", checked: hasBPL, set: setHasBPL, label: "BPL / અંત્યોદય કાર્ડ" },
                  { id: "girl", checked: hasGirlChild, set: setHasGirlChild, label: "10 વ. ↓ દીકરી" },
                ].map(({ id, checked, set, label }) => (
                  <label key={id} className="flex items-center gap-2 text-[11px] font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)}
                      className="w-3.5 h-3.5 text-orange-600 rounded focus:ring-orange-500" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Eligible Schemes — Compact List ── */}
      <div className="space-y-2">
        <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 px-1">
          <CheckCircle2 size={16} className="text-emerald-600" />
          પાત્ર યોજનાઓ ({eligibleSchemes.length})
        </h3>

        {eligibleSchemes.length === 0 ? (
          <div className="bg-white rounded-2xl p-5 text-center border border-slate-200 text-sm text-slate-500">
            આ પ્રોફાઇલ મુજબ કોઈ સીધી યોજના મળી નથી.
          </div>
        ) : (
          <div className="space-y-2">
            {eligibleSchemes.map(({ scheme, reasons, alreadyAvailed, availedRecord }) => {
              const isExpanded = expandedCardId === scheme.id;
              return (
                <div key={scheme.id}
                  className="bg-white rounded-xl border-2 border-emerald-200 shadow-xs overflow-hidden">

                  {/* Compact row — always visible */}
                  <div className="p-3 flex items-center gap-3">
                    <span className="text-2xl shrink-0">{scheme.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-extrabold text-sm text-slate-900 leading-snug">{scheme.nameGu}</p>
                        {alreadyAvailed ? (
                          <span className="text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full shrink-0">
                            ✓ અગાઉ ₹{availedRecord?.amountDisbursed.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded-full shrink-0">
                            ✓ ૧૦૦% પાત્ર
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{scheme.benefits?.[0]}</p>
                    </div>

                    {/* Expand toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedCardId(isExpanded ? null : scheme.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-500 hover:text-orange-600 transition shrink-0"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-emerald-100 p-3 space-y-2.5 bg-emerald-50/50">
                      <p className="text-xs text-slate-600 leading-relaxed">{scheme.description}</p>

                      <div className="grid grid-cols-2 gap-1">
                        {reasons.map((r, i) => (
                          <div key={i} className="flex items-center gap-1 text-[10px] text-emerald-700">
                            <span className="text-emerald-500 shrink-0">✓</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-400">
                        📄 {(scheme.documents || []).slice(0, 2).join(" • ")}
                      </p>

                      <div className="flex gap-2">
                        {onNavigateToDocuments ? (
                          <button type="button" onClick={onNavigateToDocuments}
                            className="flex-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition inline-flex items-center justify-center gap-1 active:scale-95">
                            ઓનલાઇન અરજી <ArrowRight size={12} />
                          </button>
                        ) : (
                          <Link href="/documents"
                            className="flex-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition inline-flex items-center justify-center gap-1 active:scale-95">
                            ઓનલાઇન અરજી <ArrowRight size={12} />
                          </Link>
                        )}
                        <Link href={`/schemes/${scheme.id}`}
                          className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold rounded-lg text-xs transition">
                          વિગત →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Ineligible Schemes — Collapsed by default ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowIneligible((v) => !v)}
          className="w-full flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 transition"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <XCircle size={15} className="text-slate-400" />
            અ-પાત્ર યોજનાઓ ({otherSchemes.length}) — કારણ જુઓ
          </span>
          {showIneligible ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        {showIneligible && (
          <div className="border-t border-slate-100 p-3 space-y-1.5">
            {otherSchemes.map(({ scheme, failedReasons }) => (
              <div key={scheme.id}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-lg shrink-0 mt-0.5">{scheme.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-slate-700 truncate">{scheme.nameGu}</p>
                  <div className="mt-0.5">
                    {failedReasons.slice(0, 2).map((f, i) => (
                      <p key={i} className="text-[10px] text-rose-500 flex items-start gap-1">
                        <span className="shrink-0">✕</span> {f}
                      </p>
                    ))}
                  </div>
                </div>
                <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                  અ-પાત્ર
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
