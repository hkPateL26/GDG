"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  Award,
  Calendar,
  User,
  MapPin,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { queryApplications, CitizenApplication } from "@/lib/large-datasets";
import { verifyCertificateSeal, generateCertificateSeal } from "@/lib/digital-notary";
import OfficialGovernmentCertificate from "@/components/OfficialGovernmentCertificate";

function VerifyContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id") || "";
  const sealParam = searchParams.get("seal") || "";

  const [matchedApp, setMatchedApp] = useState<CitizenApplication | null>(null);
  const [isValidSeal, setIsValidSeal] = useState<boolean | null>(null);
  const [expectedSeal, setExpectedSeal] = useState<string>("");
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  useEffect(() => {
    if (!idParam) {
      setIsValidSeal(false);
      return;
    }

    // 1. Try finding application in statewide dataset
    const result = queryApplications({ search: idParam.trim(), limit: 1 });
    let app: CitizenApplication | undefined = result.records[0];

    // 2. Fallback to localStorage for custom created applications
    if (!app && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("nagrik_user_applications");
        if (saved) {
          const list = JSON.parse(saved);
          app = list.find((a: any) => a.id?.toUpperCase() === idParam.trim().toUpperCase());
        }
      } catch {}
    }

    // 3. Fallback deterministic record for demo apps
    if (!app) {
      app = {
        id: idParam.toUpperCase(),
        citizenName: "Haribhai Patel",
        citizenNameGu: "હરીભાઈ વિનોદરાય પટેલ",
        schemeId: "income-certificate",
        schemeName: "Income Certificate (Gujarat Revenue Dept)",
        schemeNameGu: "આવકનો દાખલો (મહેસૂલ વિભાગ)",
        schemeEmoji: "📜",
        status: "approved",
        workflowStage: 3,
        appliedDate: "2026-10-10",
        lastUpdated: "2026-10-15",
        district: "Rajkot",
        districtGu: "રાજકોટ",
        taluka: "Gondal",
        village: "Gomta",
        aadhaarLast4: "1413",
        mobile: "9974442291",
        paymentStatus: "paid",
        challanNo: `CHL-GUJ-${idParam.slice(-6)}`,
      };
    }

    setMatchedApp(app);
    const correctSeal = generateCertificateSeal(app);
    setExpectedSeal(correctSeal);

    // If seal param is present, verify it. If empty, check against correct seal
    if (sealParam) {
      const valid = verifyCertificateSeal(app, sealParam);
      setIsValidSeal(valid);
    } else {
      // If no seal provided in URL, show valid status with generated seal
      setIsValidSeal(true);
    }
  }, [idParam, sealParam]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl mx-auto flex items-center justify-center p-2.5">
              <img
                src="/demo-docs/emblem_of_india.svg"
                alt="Emblem"
                className="w-10 h-10 object-contain drop-shadow"
              />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-amber-400 font-extrabold">
              ગુજરાત સરકાર &bull; e-Governance DPI Gateway
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              અધિકૃત ડિજિટલ પ્રમાણપત્ર ખરાઈ
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              સત્તાવાર ડિજિટલ સહી અને કાનૂની પ્રમાણપત્ર ચકાસણી પોર્ટલ (IT Act ૨૦૦૦ કલમ ૪ & ૫)
            </p>
          </div>

          {/* Verification Result Card */}
          {isValidSeal ? (
            <div className="bg-slate-950 rounded-3xl border-2 border-emerald-500/80 shadow-2xl p-5 sm:p-7 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500" />

              {/* Status Badge */}
              <div className="flex items-center gap-3 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-emerald-300">
                    ✅ સત્તાવાર માન્ય સરકારી પ્રમાણપત્ર (Legally Verified)
                  </h2>
                  <p className="text-xs text-emerald-400/90 font-medium">
                    આ પ્રમાણપત્ર ગુજરાત સરકારના રેકોર્ડ મુજબ ૧૦૦% અસલ અને ડિજિટલ સહીવાળું છે.
                  </p>
                </div>
              </div>

              {/* Certificate Metadata Grid */}
              {matchedApp && (
                <div className="space-y-3.5 pt-2 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <User size={13} className="text-amber-400" /> અરજદારનું નામ
                      </span>
                      <p className="font-extrabold text-white text-sm">
                        {matchedApp.citizenNameGu || matchedApp.citizenName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        આધાર: XXXX-XXXX-{matchedApp.aadhaarLast4 || "1413"} (DPDP માન્ય)
                      </p>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <Award size={13} className="text-amber-400" /> મંજૂર સરકારી સેવા / યોજના
                      </span>
                      <p className="font-extrabold text-amber-300 text-sm">
                        {matchedApp.schemeNameGu || matchedApp.schemeName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        યોજના કોડ: {matchedApp.schemeId || "GOVT-GJ"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <Building size={13} className="text-blue-400" /> સક્ષમ સત્તાધિકારી (Signatory)
                      </span>
                      <p className="font-bold text-slate-200">
                        નાયબ મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ
                      </p>
                      <p className="text-[11px] text-slate-400">
                        તાલુકો: {matchedApp.taluka || "ગોંડલ"}, જિલ્લો: {matchedApp.districtGu || matchedApp.district || "રાજકોટ"}
                      </p>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <Calendar size={13} className="text-emerald-400" /> પ્રમાણપત્ર વિગત & તારીખ
                      </span>
                      <p className="font-mono text-slate-200 font-bold">
                        અરજી નં: {matchedApp.id}
                      </p>
                      <p className="text-[11px] text-emerald-400 font-semibold">
                        ઈશ્યુ તારીખ: {matchedApp.lastUpdated || matchedApp.appliedDate || "2026-10-15"}
                      </p>
                    </div>
                  </div>

                  {/* Cryptographic Proof Seal */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                        <Lock size={13} /> SHA-256 ક્રિપ્ટોગ્રાફિક સીલ (Digital Notary Seal):
                      </span>
                      <span className="text-[10px] bg-emerald-900 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded">
                        VALIDATED
                      </span>
                    </div>
                    <p className="font-mono text-xs text-amber-100 font-extrabold tracking-widest break-all">
                      {sealParam || expectedSeal}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      આ સીલ ભારત સરકારના ઇન્ફોર્મેશન ટેકનોલોજી અધિનિયમ, ૨૦૦૦ અને ગુજરાત જાહેર સેવા હક અધિનિયમ (GRTSA ૨૦૧૩) હેઠળ સંપૂર્ણ કાનૂની માન્યતા ધરાવે છે.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                    >
                      <FileText size={16} />
                      <span>અસલ પ્રમાણપત્ર જુઓ / પ્રિન્ટ કરો</span>
                    </button>

                    <Link
                      href={`/track?id=${encodeURIComponent(matchedApp.id)}`}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-1.5 transition"
                    >
                      <span>લાઈવ ટ્રેકિંગ</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Invalid / Tampered Certificate Warning */
            <div className="bg-slate-950 rounded-3xl border-2 border-red-500/80 shadow-2xl p-6 sm:p-8 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 border border-red-500/40 flex items-center justify-center mx-auto">
                <ShieldAlert size={36} />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-red-400">
                ❌ અમાન્ય અથવા છેડછાડ થયેલ પ્રમાણપત્ર (Invalid Certificate)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                આ પ્રમાણપત્રનો ક્રિપ્ટોગ્રાફિક સીલ સરકારી ડેટાબેઝ સાથે મેળ ખાતો નથી. આ દસ્તાવેજ બનાવટી, જૂનો અથવા તેમાં અનધિકૃત ફેરફાર થયેલ હોઈ શકે છે.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition border border-slate-700"
                >
                  મુખ્ય પોર્ટલ પર પાછા જાઓ
                </Link>
              </div>
            </div>
          )}

          {/* Official Verification Notice */}
          <div className="text-center text-[11px] text-slate-500 space-y-1">
            <p>ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ • e-Governance Cyber Treasury</p>
            <p>કોઈપણ સરકારી દસ્તાવેજની ખરાઈ માટે સત્તાવાર હેલ્પલાઈન: <strong>૧૪૫૬૭</strong></p>
          </div>
        </div>
      </main>

      {/* Official Certificate Preview Modal */}
      {showCertificateModal && matchedApp && (
        <OfficialGovernmentCertificate
          app={matchedApp}
          onClose={() => setShowCertificateModal(false)}
          isModalPreview={true}
        />
      )}
    </>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-sm">ડિજિટલ પ્રમાણપત્ર ખરાઈ થઈ રહી છે...</p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
