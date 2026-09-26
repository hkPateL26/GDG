"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import { Scheme } from "@/types";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter,
  RotateCcw,
  Building2,
  IndianRupee,
  User,
  Briefcase,
} from "lucide-react";

interface EligibilityResult {
  scheme: Scheme;
  isEligible: boolean;
  score: number; // percentage match
  reasons: string[];
  failedReasons: string[];
}

export default function EligibilityPage() {
  // Citizen Profile Form State
  const [age, setAge] = useState<number | "">(28);
  const [gender, setGender] = useState<"all" | "male" | "female">("male");
  const [annualIncome, setAnnualIncome] = useState<number | "">(180000);
  const [occupation, setOccupation] = useState<string>("farmer");
  const [category, setCategory] = useState<string>("OBC");
  const [hasLand, setHasLand] = useState<boolean>(true);
  const [hasBPL, setHasBPL] = useState<boolean>(false);
  const [hasGirlChild, setHasGirlChild] = useState<boolean>(false);

  const [hasEvaluated, setHasEvaluated] = useState<boolean>(true);

  // Evaluate schemes against citizen profile
  const evaluateSchemes = (): EligibilityResult[] => {
    const numericAge = typeof age === "number" ? age : 25;
    const numericIncome = typeof annualIncome === "number" ? annualIncome : 200000;

    return SCHEMES_DATA.map((scheme) => {
      const reasons: string[] = [];
      const failedReasons: string[] = [];
      let checksPassed = 0;
      let totalChecks = 0;

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
          reasons.push("જમીન ધારકતા (ખેતીની જમીન) ધરાવો છો.");
        } else {
          failedReasons.push("ખેતીની જમીન (7/12 રેકોર્ડ) હોવી અનિવાર્ય છે.");
        }
      }

      if (scheme.id === "ujjwala-yojana" || scheme.id === "ayushman-bharat") {
        totalChecks++;
        if (hasBPL || numericIncome <= 200000) {
          checksPassed++;
          reasons.push("BPL રેશનકાર્ડ અથવા ઓછી આવક જૂથમાં સમાવેશ થાય છે.");
        } else {
          failedReasons.push("BPL / NFSA કાર્ડ અથવા અતિગરીબ વર્ગ હોવો જરૂરી.");
        }
      }

      if (scheme.id === "sukanya-samriddhi") {
        totalChecks++;
        if (hasGirlChild) {
          checksPassed++;
          reasons.push("૧૦ વર્ષથી ઓછી ઉંમરની દીકરી છે.");
        } else {
          failedReasons.push("કુટુંબમાં ૧૦ વર્ષથી નાની દીકરી હોવી જરૂરી છે.");
        }
      }

      const score = totalChecks > 0 ? Math.round((checksPassed / totalChecks) * 100) : 100;
      const isEligible = failedReasons.length === 0;

      return {
        scheme,
        isEligible,
        score,
        reasons,
        failedReasons,
      };
    });
  };

  const results = evaluateSchemes();
  const eligibleSchemes = results.filter((r) => r.isEligible);
  const otherSchemes = results.filter((r) => !r.isEligible);

  const resetForm = () => {
    setAge(25);
    setGender("male");
    setAnnualIncome(150000);
    setOccupation("farmer");
    setCategory("General");
    setHasLand(true);
    setHasBPL(false);
    setHasGirlChild(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-600 text-white py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles size={14} className="text-yellow-300" /> AI Eligibility Matcher
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
              સરકારી યોજના પાત્રતા કેલ્ક્યુલેટર
            </h1>
            <p className="text-orange-100 text-sm sm:text-base max-w-2xl mx-auto">
              તમારી વિગતો દાખલ કરો — અમારું AI એન્જિન તમારા માટે શ્રેષ્ઠ યોજનાઓ તારવી આપશે!
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Citizen Profile Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 sticky top-24">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
                  <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <Filter size={18} className="text-orange-500" />
                    નાગરિક પ્રોફાઇલ વિગતો
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-xs text-gray-400 hover:text-orange-500 flex items-center gap-1 transition"
                  >
                    <RotateCcw size={12} /> રીસેટ
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Age */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <User size={13} className="text-gray-400" /> તમારી ઉંમર (Age in Years)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      લિંગ (Gender)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender("male")}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                          gender === "male"
                            ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        👨 પુરુષ (Male)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("female")}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                          gender === "female"
                            ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        👩 મહિલા (Female)
                      </button>
                    </div>
                  </div>

                  {/* Annual Income */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <IndianRupee size={13} className="text-gray-400" /> કુટુંબની વાર્ષિક આવક (Annual Income ₹)
                    </label>
                    <input
                      type="number"
                      step={10000}
                      value={annualIncome}
                      onChange={(e) =>
                        setAnnualIncome(e.target.value ? Number(e.target.value) : "")
                      }
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      દા.ત. ₹1,80,000 (વર્ષે)
                    </p>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Briefcase size={13} className="text-gray-400" /> વ્યવસાય / ક્ષેત્ર (Occupation)
                    </label>
                    <select
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      <option value="farmer">🌾 ખેડૂત (Farmer)</option>
                      <option value="rural">🏡 ગ્રામીણ નાગરિક (Rural Resident)</option>
                      <option value="business">💼 નાનો વ્યવસાય / વેપારી (Micro Enterprise)</option>
                      <option value="student">🎓 વિદ્યાર્થી / યુવાન (Student / Youth)</option>
                      <option value="unorganized">🛠️ અસંગઠિત ક્ષેત્રના શ્રમિક (Laborer/Worker)</option>
                      <option value="other">👤 અન્ય (Other)</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      સામાજિક શ્રેણી (Category)
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      <option value="General">સામાન્ય (General)</option>
                      <option value="OBC">OBC / SEBC</option>
                      <option value="SC">SC (અનુસૂચિત જાતિ)</option>
                      <option value="ST">ST (અનુસૂચિત જનજાતિ)</option>
                    </select>
                  </div>

                  {/* Extra Conditions Checkboxes */}
                  <div className="pt-2 border-t border-gray-100 space-y-2.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      વિશેષ પરિસ્થિતિઓ
                    </p>

                    <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasLand}
                        onChange={(e) => setHasLand(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      મારી પાસે પોતાની ખેતીની જમીન છે (7/12 રેકોર્ડ)
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasBPL}
                        onChange={(e) => setHasBPL(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      BPL / અંત્યોદય રેશન કાર્ડ ધરાવું છું
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasGirlChild}
                        onChange={(e) => setHasGirlChild(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      કુટુંબમાં ૧૦ વર્ષથી નાની દીકરી છે
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Matching Results */}
            <div className="lg:col-span-7 space-y-6">
              {/* Summary Stats Card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-base">
                    પાત્રતા પરિણામ વિશ્લેષણ
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    કુલ {results.length} સરકારી યોજનાઓમાંથી તમારી પ્રોફાઇલ મુજબ:
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center px-3 py-1.5 bg-green-50 rounded-xl border border-green-200">
                    <span className="block text-lg font-bold text-green-700">
                      {eligibleSchemes.length}
                    </span>
                    <span className="text-[10px] text-green-600 font-medium">પાત્ર યોજના</span>
                  </div>
                  <div className="text-center px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="block text-lg font-bold text-gray-600">
                      {otherSchemes.length}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">અપાત્ર</span>
                  </div>
                </div>
              </div>

              {/* 1. Fully Eligible Schemes */}
              <div>
                <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  તમે આ યોજનાઓ માટે ૧૦૦% પાત્ર છો ({eligibleSchemes.length})
                </h3>

                {eligibleSchemes.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200 text-gray-400">
                    <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">તમારી દાખલ કરેલી વિગતો મુજબ કોઈ યોજના સાથે સીધો મેળ નથી મળ્યો.</p>
                    <p className="text-xs mt-1">કૃપા કરીને આવક કે વ્યવસાયમાં સાચી વિગતો તપાસો.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eligibleSchemes.map(({ scheme, reasons }) => (
                      <div
                        key={scheme.id}
                        className="bg-white rounded-2xl border-2 border-green-200 shadow-sm p-5 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl flex-shrink-0">{scheme.icon}</span>
                            <div>
                              <h4 className="font-bold text-gray-800 text-base">
                                {scheme.nameGu}
                              </h4>
                              <p className="text-xs text-gray-500">{scheme.name}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-800 rounded-full flex-shrink-0">
                            ✓ પાત્ર (Eligible)
                          </span>
                        </div>

                        {/* Benefits list */}
                        <div className="mt-3.5 bg-green-50/60 rounded-xl p-3 border border-green-100 text-xs text-green-900 space-y-1">
                          <p className="font-semibold text-green-950 flex items-center gap-1">
                            ✨ મુખ્ય લાભો:
                          </p>
                          {scheme.benefits.slice(0, 2).map((b, i) => (
                            <p key={i} className="flex items-start gap-1">
                              • <span>{b}</span>
                            </p>
                          ))}
                        </div>

                        {/* Why eligible list */}
                        <div className="mt-3 space-y-1 text-xs text-gray-600">
                          <p className="font-semibold text-gray-700">શા માટે તમે પાત્ર છો?</p>
                          {reasons.slice(0, 3).map((r, i) => (
                            <p key={i} className="flex items-start gap-1 text-green-700">
                              <span className="text-green-500 font-bold">✓</span> {r}
                            </p>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                          <span className="text-xs text-gray-400">
                            📄 {scheme.documents.length} દસ્તાવેજો જરૂરી
                          </span>
                          <div className="flex gap-2">
                            <Link
                              href={`/documents`}
                              className="text-xs border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                            >
                              દસ્તાવેજ ચેકલિસ્ટ
                            </Link>
                            {scheme.applicationUrl && (
                              <a
                                href={scheme.applicationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-medium px-3.5 py-1.5 rounded-lg transition inline-flex items-center gap-1"
                              >
                                ઓનલાઈન અરજી <ArrowRight size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Ineligible Schemes with exact reasons */}
              <div className="pt-4">
                <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
                  <XCircle size={17} className="text-gray-400" />
                  હાલમાં અપાત્ર યોજનાઓ (શા માટે પાત્ર નથી તેનું કારણ)
                </h3>

                <div className="space-y-3">
                  {otherSchemes.map(({ scheme, failedReasons }) => (
                    <div
                      key={scheme.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 opacity-75 hover:opacity-100 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{scheme.icon}</span>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">
                              {scheme.nameGu}
                            </p>
                            <p className="text-xs text-gray-400">{scheme.name}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          અપાત્ર
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-gray-100">
                        <p className="text-[11px] font-semibold text-red-500 mb-1">
                          અપાત્રતાનું કારણ:
                        </p>
                        {failedReasons.map((f, i) => (
                          <p key={i} className="text-xs text-red-600 flex items-start gap-1">
                            <span>✕</span> {f}
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
      </main>
    </>
  );
}
