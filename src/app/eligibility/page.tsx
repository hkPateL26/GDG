"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import { Scheme } from "@/types";
import { CitizenBenefitRecord, CitizenLedgerProfile } from "@/lib/large-datasets";
import Link from "next/link";
import CitizenPortalHeader from "@/components/CitizenPortalHeader";
import CitizenLoginShield from "@/components/CitizenLoginShield";
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
  ShieldCheck,
  History,
  Smartphone,
  Lock,
  Loader2,
  Receipt,
} from "lucide-react";

interface EligibilityResult {
  scheme: Scheme;
  isEligible: boolean;
  score: number; // percentage match
  reasons: string[];
  failedReasons: string[];
  alreadyAvailed?: boolean;
  availedRecord?: CitizenBenefitRecord;
}

export default function EligibilityPage() {
  // Citizen Profile Form State
  const [age, setAge] = useState<number | "">(41);
  const [gender, setGender] = useState<"all" | "male" | "female">("male");
  const [annualIncome, setAnnualIncome] = useState<number | "">(180000);
  const [occupation, setOccupation] = useState<string>("farmer");
  const [category, setCategory] = useState<string>("OBC");
  const [hasLand, setHasLand] = useState<boolean>(true);
  const [hasBPL, setHasBPL] = useState<boolean>(false);
  const [hasGirlChild, setHasGirlChild] = useState<boolean>(false);

  // DBT Ledger Linking State
  const [inputMobile, setInputMobile] = useState("9825012345");
  const [inputAadhaar, setInputAadhaar] = useState("4829");
  const [isLinking, setIsLinking] = useState(false);
  const [linkedCitizen, setLinkedCitizen] = useState<CitizenLedgerProfile | null>(null);
  const [linkMessage, setLinkMessage] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Restore saved session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nagrik_citizen_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.mobile) {
            setInputMobile(parsed.mobile);
            setInputAadhaar(parsed.aadhaarLast4 || "4829");
            fetchLedger(parsed.mobile, parsed.aadhaarLast4 || "4829");
          }
        } catch (e) {
          console.error("Session restore error:", e);
        }
      }
    }
  }, []);

  const fetchLedger = async (mobile: string, aadhaarLast4: string) => {
    setIsLinking(true);
    setLinkError(null);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_citizen_profile",
          mobile,
          aadhaarLast4,
        }),
      });
      const data = await res.json();
      if (data.success && data.citizen) {
        setLinkedCitizen(data.citizen);
        setAge(41);
        setGender("male");
        setAnnualIncome(data.citizen.annualIncome || 180000);
        setOccupation(data.citizen.occupation || "farmer");
        setCategory(data.citizen.category || "OBC");
        setHasLand(data.citizen.hasLand !== undefined ? data.citizen.hasLand : true);
        setHasBPL(data.citizen.hasBPL || false);
        setLinkMessage("✓ સરકારી DBT લાભ ખાતું સફળતાપૂર્વક લિંક થયું! અગાઉ લીધેલ લાભો અને ડિ-ડુપ્લિકેશન રેકોર્ડ ચકાસાયો.");
        setTimeout(() => setLinkMessage(null), 5000);
      } else {
        setLinkError(data.error || "ખાતું લિંક કરવામાં મુશ્કેલી આવી.");
      }
    } catch (e) {
      setLinkError("સર્વર કનેક્શનમાં ક્ષતિ.");
    } finally {
      setIsLinking(false);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLedger(inputMobile, inputAadhaar);
  };

  const handleFastDemoLink = () => {
    setInputMobile("9825012345");
    setInputAadhaar("4829");
    fetchLedger("9825012345", "4829");
  };

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
      const availedRecord = linkedCitizen?.availedBenefits.find(
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
    setAge(28);
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
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white py-10 px-4 shadow-md">
          <div className="max-w-5xl mx-auto text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-semibold">
              <Sparkles size={14} className="text-yellow-300" /> Gujarat DPI Citizen Entitlement Engine
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              🏛️ સરકારી યોજના પાત્રતા & DBT લાભ હિસ્ટ્રી
            </h1>
            <p className="text-orange-100 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
              તમારા આધાર & મોબાઈલથી ભૂતકાળમાં મળેલા લાભો ચકાસો અને નવી મળવાપાત્ર યોજનાઓ શોધો.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
          {!linkedCitizen ? (
            <CitizenLoginShield
              serviceTitle="સરકારી યોજના પાત્રતા & DBT લાભ લેજર"
              onSuccess={(cit) => {
                setLinkedCitizen(cit);
                setInputMobile(cit.mobile);
                setInputAadhaar(cit.aadhaarLast4 || "4829");
                fetchLedger(cit.mobile, cit.aadhaarLast4 || "4829");
              }}
            />
          ) : (
            <>
              <CitizenPortalHeader
                citizen={linkedCitizen}
                onLogout={() => {
                  localStorage.removeItem("nagrik_citizen_session");
                  window.dispatchEvent(new Event("storage"));
                  setLinkedCitizen(null);
                }}
              />

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
                        સત્તાવાર DBT લાભ ખાતું લિંક કરો
                      </h3>
                      <p className="text-[10px] text-slate-300">
                        De-duplication & Past Benefits Ledger (UIDAI / e-KYC)
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono">
                    DPDP 2023
                  </span>
                </div>

                {linkMessage && (
                  <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs p-2.5 rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>{linkMessage}</span>
                  </div>
                )}

                {linkError && (
                  <div className="bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs p-2.5 rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-400 shrink-0" />
                    <span>{linkError}</span>
                  </div>
                )}

                {!linkedCitizen ? (
                  <form onSubmit={handleLinkSubmit} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-300 font-semibold mb-1">
                          મોબાઈલ નંબર (૧૦ આંકડા)
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          value={inputMobile}
                          onChange={(e) => setInputMobile(e.target.value)}
                          placeholder="9825012345"
                          className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-300 font-semibold mb-1">
                          આધાર છેલ્લા ૪ આંકડા
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={inputAadhaar}
                          onChange={(e) => setInputAadhaar(e.target.value)}
                          placeholder="4829"
                          className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleFastDemoLink}
                        className="text-[11px] text-amber-300 hover:text-amber-200 underline font-medium"
                      >
                        ⚡ ૧-ક્લિક ડેમો (રમેશભાઈ પટેલ)
                      </button>

                      <button
                        type="submit"
                        disabled={isLinking}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-lg transition active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isLinking ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                        <span>ખાતું ચકાસો & લિંક કરો</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block text-sm">
                          {linkedCitizen.citizenNameGu}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          આધાર: XXXX-XXXX-{linkedCitizen.aadhaarLast4} • +91 {linkedCitizen.mobile}
                        </span>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded text-[10px] font-bold">
                        ✓ લિંક્ડ (Verified)
                      </span>
                    </div>

                    {/* Past Availed Benefits Ledger List */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <History size={13} /> ભૂતકાળમાં લીધેલ સત્તાવાર સરકારી લાભો (DBT Ledger):
                      </p>
                      <div className="space-y-1.5">
                        {linkedCitizen.availedBenefits.map((b, idx) => (
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
                      <button
                        type="button"
                        onClick={() => setLinkedCitizen(null)}
                        className="text-slate-400 hover:text-white underline text-[10px]"
                      >
                        બીજું ખાતું બદલો
                      </button>
                    </div>
                  </div>
                )}
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

                <div className="space-y-3.5">
                  {/* Age */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <User size={13} className="text-slate-400" /> તમારી ઉંમર (Age in Years)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      લિંગ (Gender)
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setGender("male")}
                        className={`py-2 px-3 rounded-xl border transition ${
                          gender === "male"
                            ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        પુરુષ (Male)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("female")}
                        className={`py-2 px-3 rounded-xl border transition ${
                          gender === "female"
                            ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        મહિલા (Female)
                      </button>
                    </div>
                  </div>

                  {/* Annual Income */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <IndianRupee size={13} className="text-slate-400" /> કુટુંબની વાર્ષિક આવક (Annual Income ₹)
                    </label>
                    <input
                      type="number"
                      step={5000}
                      min={0}
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : "")}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      દાખલા મુજબ: ₹ {typeof annualIncome === "number" ? annualIncome.toLocaleString("en-IN") : "0"}
                    </p>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Briefcase size={13} className="text-slate-400" /> મુખ્ય વ્યવસાય (Occupation)
                    </label>
                    <select
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      <option value="farmer">ખેડૂત / પશુપાલક (Farmer)</option>
                      <option value="student">વિદ્યાર્થી (Student)</option>
                      <option value="laborer">મજૂર / બાંધકામ શ્રમિક (Laborer)</option>
                      <option value="business">વેપારી / સ્વરોજગાર (Small Business)</option>
                      <option value="unemployed">બેરોજગાર (Unemployed)</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      સામાજિક કેટેગરી (Social Category)
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                      {["General", "OBC", "SC", "ST"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`py-1.5 rounded-lg border transition ${
                            category === cat
                              ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Conditions Checkboxes */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-600">વિશેષ પરિસ્થિતિઓ:</p>

                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasLand}
                        onChange={(e) => setHasLand(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-400"
                      />
                      <span>મારી પાસે પોતાની ખેતીની જમીન છે (7/12 રેકોર્ડ)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasBPL}
                        onChange={(e) => setHasBPL(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-400"
                      />
                      <span>BPL / અંત્યોદય રેશન કાર્ડ ધરાવું છું</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasGirlChild}
                        onChange={(e) => setHasGirlChild(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-400"
                      />
                      <span>કુટુંબમાં ૧૦ વર્ષથી નાની દીકરી છે</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Matching Results & De-duplication Ledger */}
            <div className="lg:col-span-7 space-y-5">
              {/* Summary Stats Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                    પાત્રતા પરિણામ & De-duplication વિશ્લેષણ
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    કુલ {results.length} સરકારી યોજનાઓમાંથી તમારી પ્રોફાઇલ મુજબ:
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="text-center px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="block text-lg font-black text-emerald-700">
                      {eligibleSchemes.length}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">પાત્ર યોજના</span>
                  </div>
                  <div className="text-center px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="block text-lg font-black text-slate-600">
                      {otherSchemes.length}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">અપાત્ર</span>
                  </div>
                </div>
              </div>

              {/* 1. Fully Eligible Schemes */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-black text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>તમે આ યોજનાઓ માટે પાત્ર છો ({eligibleSchemes.length})</span>
                </h3>

                {eligibleSchemes.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300 text-slate-400 space-y-1">
                    <AlertCircle size={32} className="mx-auto text-slate-300" />
                    <p className="text-sm font-semibold">તમારી દાખલ કરેલી વિગતો મુજબ કોઈ યોજના સાથે મેળ મળ્યો નથી.</p>
                    <p className="text-xs">કૃપા કરીને આવક કે વ્યવસાયમાં સાચી વિગતો તપાસો.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {eligibleSchemes.map(({ scheme, reasons, alreadyAvailed, availedRecord }) => (
                      <div
                        key={scheme.id}
                        className={`bg-white rounded-2xl border-2 p-4 sm:p-5 shadow-xs hover:shadow-md transition space-y-3 ${
                          alreadyAvailed ? "border-amber-400 bg-amber-50/20" : "border-emerald-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl sm:text-3xl p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                              {scheme.icon}
                            </span>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                                {scheme.nameGu}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate">{scheme.name}</p>
                            </div>
                          </div>

                          {alreadyAvailed ? (
                            <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full shrink-0 flex items-center gap-1">
                              <History size={12} /> અગાઉ લાભ લીધેલ છે
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full shrink-0">
                              ✓ પાત્ર (Eligible)
                            </span>
                          )}
                        </div>

                        {/* If already availed: De-duplication Note */}
                        {alreadyAvailed && availedRecord && (
                          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span>📌 DBT ડિ-ડુપ્લિકેશન રેકોર્ડ (અગાઉ લાભ મળેલ):</span>
                              <span className="font-mono text-emerald-800">₹{availedRecord.amountDisbursed.toLocaleString("en-IN")} ચુકવાયેલ</span>
                            </div>
                            <p className="text-[11px] text-amber-900 leading-relaxed">
                              સરકારી રેકોર્ડ Ref: <strong className="font-mono">{availedRecord.certOrInstallmentNo}</strong> (મંજૂરી તારીખ: {availedRecord.disbursedDate}). સરકારી નિયમ અનુસાર આ યોજનાનો લાભ તમે અગાઉ લઈ ચૂક્યા છો તેથી પુનઃ અરજીની જરૂર નથી.
                            </p>
                          </div>
                        )}

                        {/* Benefits list */}
                        <div className="bg-emerald-50/60 rounded-xl p-2.5 sm:p-3 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                          <p className="font-bold flex items-center gap-1 text-[11px]">
                            ✨ મુખ્ય સરકારી લાભો:
                          </p>
                          {scheme.benefits.slice(0, 2).map((b, i) => (
                            <p key={i} className="flex items-start gap-1 leading-snug">
                              • <span>{b}</span>
                            </p>
                          ))}
                        </div>

                        {/* Why eligible list */}
                        <div className="space-y-1 text-xs text-slate-600">
                          <p className="font-semibold text-slate-700 text-[11px]">શા માટે તમે પાત્ર છો?</p>
                          {reasons.slice(0, 3).map((r, i) => (
                            <p key={i} className="flex items-start gap-1 text-emerald-700 text-[11px] leading-tight">
                              <span className="text-emerald-500 font-bold">✓</span> {r}
                            </p>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
                          <span className="text-[11px] text-slate-400">
                            📄 {scheme.documents.length} અધિકૃત દસ્તાવેજો જરૂરી
                          </span>

                          <div className="flex gap-2">
                            {alreadyAvailed ? (
                              <Link
                                href="/track"
                                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition inline-flex items-center gap-1"
                              >
                                <Receipt size={13} /> સત્તાવાર પહોંચ / ટ્રેકિંગ જુઓ
                              </Link>
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
        </>
      )}
    </div>
      </main>
    </>
  );
}
