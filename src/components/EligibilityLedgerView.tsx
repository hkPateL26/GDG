"use client";

import { useState, useEffect } from "react";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import { Scheme } from "@/types";
import { CitizenBenefitRecord, CitizenLedgerProfile } from "@/lib/large-datasets";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter,
  RotateCcw,
  IndianRupee,
  User,
  Briefcase,
  ShieldCheck,
  History,
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

  useEffect(() => {
    if (citizen) {
      if (citizen.annualIncome) setAnnualIncome(citizen.annualIncome);
      if (citizen.occupation) setOccupation(citizen.occupation);
      if (citizen.category) setCategory(citizen.category);
      if (citizen.hasLand !== undefined) setHasLand(citizen.hasLand);
      if (citizen.hasBPL !== undefined) setHasBPL(citizen.hasBPL);
    }
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
          (scheme.id === "ayushman-bharat" && b.schemeId.includes("ayushman"))
      );

      // 1. Age Check
      if (scheme.eligibility.minAge !== undefined || scheme.eligibility.maxAge !== undefined) {
        totalChecks++;
        const min = scheme.eligibility.minAge ?? 0;
        const max = scheme.eligibility.maxAge ?? 100;
        if (numericAge >= min && numericAge <= max) {
          checksPassed++;
          reasons.push(`તમારી ઉંમર (${numericAge} વર્ષ) માન્ય શ્રેણી (${min}-${max}) માં આવે છે.`);
        } else {
          failedReasons.push(`ઉંમર ${min} થી ${max} વર્ષ વચ્ચે હોવી જરૂરી છે.`);
        }
      }

      // 2. Gender Check
      if (scheme.eligibility.gender && scheme.eligibility.gender !== "all") {
        totalChecks++;
        if (gender === scheme.eligibility.gender) {
          checksPassed++;
          reasons.push(`આ યોજના ફક્ત ${scheme.eligibility.gender === "female" ? "મહિલાઓ" : "પુરુષો"} માટે છે (લાગુ પડે છે).`);
        } else {
          failedReasons.push(`આ યોજના ફક્ત ${scheme.eligibility.gender === "female" ? "મહિલાઓ" : "પુરુષો"} માટે છે.`);
        }
      }

      // 3. Income Check
      if (scheme.eligibility.incomeLimit && scheme.eligibility.incomeLimit > 0) {
        totalChecks++;
        if (numericIncome <= scheme.eligibility.incomeLimit) {
          checksPassed++;
          reasons.push(`વાર્ષિક આવક (₹${numericIncome.toLocaleString("en-IN")}) મર્યાદા (₹${scheme.eligibility.incomeLimit.toLocaleString("en-IN")}) ની અંદર છે.`);
        } else {
          failedReasons.push(`વાર્ષિક આવક ₹${scheme.eligibility.incomeLimit.toLocaleString("en-IN")} થી ઓછી હોવી જોઈએ.`);
        }
      }

      // 4. Occupation Check
      if (scheme.eligibility.occupation && scheme.eligibility.occupation.length > 0) {
        totalChecks++;
        if (scheme.eligibility.occupation.includes(occupation)) {
          checksPassed++;
          reasons.push(`વ્યવસાય (${occupation}) પાત્રતા ધરાવે છે.`);
        } else {
          failedReasons.push(`આ યોજના ખાસ કરીને ${scheme.eligibility.occupation.join(", ")} માટે છે.`);
        }
      }

      // 5. Special condition checks
      if (scheme.id === "pm-kisan" || scheme.id === "fasal-bima") {
        totalChecks++;
        if (hasLand) {
          checksPassed++;
          reasons.push("ખેતીની જમીન (7/12 રેકોર્ડ) ધરાવો છો.");
        } else {
          failedReasons.push("ખેતીની જમીન (7/12 રેકોર્ડ) હોવી અનિવાર્ય છે.");
        }
      }

      if (scheme.id === "pm-awas" || scheme.id === "ayushman-bharat") {
        totalChecks++;
        if (hasBPL || numericIncome <= 200000) {
          checksPassed++;
          reasons.push("આર્થિક વર્ગ (SECC / BPL / અલ્પ આવક) ધોરણો પરિપૂર્ણ થાય છે.");
        } else {
          failedReasons.push("BPL કાર્ડ અથવા વાર્ષિક આવક ₹૨,૦૦,૦૦૦ થી ઓછી હોવી જરૂરી છે.");
        }
      }

      if (scheme.id === "sukanya-samriddhi") {
        totalChecks++;
        if (hasGirlChild) {
          checksPassed++;
          reasons.push("કુટુંબમાં ૧૦ વર્ષથી નાની દીકરી ઉપલબ્ધ છે.");
        } else {
          failedReasons.push("૧૦ વર્ષથી ઓછી ઉંમરની દીકરી હોવી જરૂરી છે.");
        }
      }

      const isEligible = totalChecks === 0 || checksPassed === totalChecks;
      const score = totalChecks === 0 ? 100 : Math.round((checksPassed / totalChecks) * 100);

      return {
        scheme,
        isEligible,
        score,
        reasons,
        failedReasons,
        alreadyAvailed: Boolean(availedRecord),
        availedRecord,
      };
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Citizen DBT Ledger & Profile Form */}
        <div className="lg:col-span-5 space-y-4">
          {/* ── 1. Secure Aadhaar & Mobile DBT Ledger Box ── */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-700 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-amber-400">
                    સત્તાવાર DBT લાભ ખાતું (Verified Ledger)
                  </h3>
                  <p className="text-[10px] text-slate-300">
                    De-duplication & Past Benefits Ledger (UIDAI / e-KYC)
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded font-mono font-bold">
                ✓ 2FA લિંક્ડ
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block text-sm">
                    {citizen.citizenNameGu || citizen.citizenName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    આધાર: XXXX-XXXX-{citizen.aadhaarLast4} • +91 {citizen.mobile}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold">
                  {citizen.village}, {citizen.districtGu || citizen.district}
                </span>
              </div>

              {/* Past Availed Benefits Ledger List */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <History size={13} /> ભૂતકાળમાં લીધેલ સત્તાવાર સરકારી લાભો (DBT Ledger):
                </p>
                <div className="space-y-1.5">
                  {citizen.availedBenefits.map((b, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/60 border border-slate-700/80 rounded-lg p-2 text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{b.schemeNameGu}</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          ₹{b.amountDisbursed.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
                        <span>તારીખ: {b.disbursedDate}</span>
                        <span>Ref: {b.certOrInstallmentNo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 text-[10px]">
                  🔒 DBT De-duplication Rule Active
                </span>
                <span className="text-emerald-400 text-[10px] font-medium">
                  {citizen.availedBenefits.length} સહાય જમા રેકોર્ડ્સ
                </span>
              </div>
            </div>
          </div>

          {/* ── 2. Citizen Profile Form ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <Filter size={16} className="text-orange-500" />
                <span>નાગરિક પ્રોફાઇલ વિગતો</span>
              </h2>
              <button
                onClick={resetForm}
                className="text-xs text-slate-400 hover:text-orange-600 flex items-center gap-1 transition"
              >
                <RotateCcw size={12} /> રીસેટ
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ઉંમર (વર્ષ)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">જાતિ / લિંગ</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="male">પુરુષ (Male)</option>
                    <option value="female">મહિલા (Female)</option>
                    <option value="all">અન્ય (Other)</option>
                  </select>
                </div>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  વાર્ષિક કૌટુંબિક આવક (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step={10000}
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : "")}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">મુખ્ય વ્યવસાય</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="farmer">ખેડૂત / કૃષિ (Farmer)</option>
                  <option value="labourer">શ્રમિક / મજૂર (Labourer)</option>
                  <option value="student">વિદ્યાર્થી (Student)</option>
                  <option value="self-employed">વેપારી / સ્વરોજગાર (Self-Employed)</option>
                  <option value="unemployed">બેરોજગાર (Unemployed)</option>
                  <option value="homemaker">ગૃહિણી (Homemaker)</option>
                </select>
              </div>

              {/* Social Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">સામાજિક કેટેગરી</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="General">સામાન્ય (General)</option>
                  <option value="OBC">ઓબીસી / સા.શૈ.પ. (SEBC / OBC)</option>
                  <option value="SC">અનુસૂચિત જાતિ (SC)</option>
                  <option value="ST">અનુસૂચિત જનજાતિ (ST)</option>
                  <option value="EWS">આર્થિક નબળા વર્ગ (EWS)</option>
                </select>
              </div>

              {/* Special Checkboxes */}
              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLand}
                    onChange={(e) => setHasLand(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span>ખેતીની જમીન ધરાવો છો (7/12 રેકોર્ડ)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBPL}
                    onChange={(e) => setHasBPL(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span>BPL / અંત્યોદય રેશનકાર્ડ ધરાવો છો</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGirlChild}
                    onChange={(e) => setHasGirlChild(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span>કુટુંબમાં ૧૦ વર્ષથી નાની દીકરી છે</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Matched Schemes & Results */}
        <div className="lg:col-span-7 space-y-5">
          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-extrabold tracking-wider text-orange-100">
                AI પાત્રતા ચકાસણી પરિણામ
              </p>
              <h2 className="text-lg sm:text-xl font-black mt-0.5">
                તમે {eligibleSchemes.length} સરકારી યોજનાઓ માટે પાત્ર છો!
              </h2>
              <p className="text-xs text-orange-100 mt-1">
                આ પ્રોફાઇલ મુજબ તમને સીધો DBT લાભ મળી શકે છે.
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">
              {eligibleSchemes.length}
            </div>
          </div>

          {/* 1. Eligible Schemes List */}
          <div className="space-y-3.5">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>સંપૂર્ણ પાત્રતા ધરાવતી યોજનાઓ ({eligibleSchemes.length})</span>
            </h3>

            {eligibleSchemes.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
                <p className="text-sm text-slate-500">આ પ્રોફાઇલ મુજબ કોઈ સીધી યોજના મળી નથી.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {eligibleSchemes.map(({ scheme, reasons, alreadyAvailed, availedRecord }) => (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl border-2 border-emerald-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 bg-emerald-50 rounded-2xl border border-emerald-100 shrink-0">
                          {scheme.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-base text-slate-900">
                              {scheme.nameGu}
                            </h4>
                            {alreadyAvailed ? (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                ✓ અગાઉ લાભ મળેલ છે (₹{availedRecord?.amountDisbursed.toLocaleString("en-IN")})
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                                ✓ ૧૦૦% પાત્ર (Eligible)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{scheme.name}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-black text-emerald-700 block">
                          {scheme.benefits?.[0] || "સરકારી સહાય"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{scheme.ministry}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {scheme.description}
                    </p>

                    {/* Matched Checklist */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-emerald-800">પરિપૂર્ણ થયેલ શરતો:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-emerald-700">
                        {reasons.map((r, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="text-emerald-500 shrink-0">✓</span>
                            <span className="truncate">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">
                        જરૂરી દસ્તાવેજો: <strong>{(scheme.documents || []).slice(0, 2).join(", ")}...</strong>
                      </span>

                      {onNavigateToDocuments ? (
                        <button
                          type="button"
                          onClick={onNavigateToDocuments}
                          className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition inline-flex items-center gap-1 active:scale-95 shadow-2xs"
                        >
                          <span>ઓનલાઇન અરજી કરો</span> <ArrowRight size={13} />
                        </button>
                      ) : (
                        <Link
                          href="/documents"
                          className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition inline-flex items-center gap-1 active:scale-95 shadow-2xs"
                        >
                          <span>ઓનલાઇન અરજી કરો</span> <ArrowRight size={13} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Ineligible Schemes with exact reasons */}
          <div className="pt-3 space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-2">
              <XCircle size={16} className="text-slate-400" />
              <span>હાલમાં અપાત્ર યોજનાઓ (શા માટે પાત્ર નથી તેનું કારણ)</span>
            </h3>

            <div className="space-y-2.5">
              {otherSchemes.map(({ scheme, failedReasons }) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 opacity-80 hover:opacity-100 transition space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">{scheme.icon}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                          {scheme.nameGu}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{scheme.name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded shrink-0">
                      અપાત્ર
                    </span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 text-xs">
                    <p className="text-[10px] font-bold text-rose-500 mb-0.5">
                      અપાત્રતાનું કારણ:
                    </p>
                    {failedReasons.map((f, i) => (
                      <p key={i} className="text-[11px] text-rose-600 flex items-start gap-1">
                        <span>✕</span> <span>{f}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
