"use client";

import { useState, useEffect } from "react";
import { PhoneCall, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CitizenInfo {
  citizenNameGu?: string;
  citizenName?: string;
  mobile?: string;
  village?: string;
  districtGu?: string;
  district?: string;
}

interface OfficerInfo {
  name?: string;
  designation?: string;
  role?: string;
}

export default function MobileGreetingCard() {
  const { currentLang } = useLanguage();
  const [citizen, setCitizen] = useState<CitizenInfo | null>(null);
  const [officer, setOfficer] = useState<OfficerInfo | null>(null);

  useEffect(() => {
    const syncSession = () => {
      if (typeof window === "undefined") return;

      // 1. Check Citizen Session
      const savedCitizen = localStorage.getItem("nagrik_citizen_session");
      if (savedCitizen) {
        try {
          const parsed = JSON.parse(savedCitizen);
          const profile = parsed?.citizen || parsed;
          if (profile && (profile.citizenNameGu || profile.citizenName || profile.mobile)) {
            setCitizen(profile);
          } else {
            setCitizen(null);
          }
        } catch {
          setCitizen(null);
        }
      } else {
        setCitizen(null);
      }

      // 2. Check Officer Session
      const savedOfficer = sessionStorage.getItem("nagrik_officer_session");
      if (savedOfficer) {
        try {
          const parsed = JSON.parse(savedOfficer);
          if (parsed && (parsed.name || parsed.id)) {
            setOfficer(parsed);
          } else {
            setOfficer(null);
          }
        } catch {
          setOfficer(null);
        }
      } else {
        setOfficer(null);
      }
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("nagrik_auth_change", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("nagrik_auth_change", syncSession);
    };
  }, []);

  const loggedInName = (
    citizen?.citizenNameGu ||
    citizen?.citizenName ||
    officer?.name ||
    ""
  ).trim();

  const isMr = currentLang === "mr";
  const isHi = currentLang === "hi";
  const isEn = currentLang === "en";

  const greetingTitle = loggedInName
    ? isMr
      ? `नमस्कार, ${loggedInName}\u00A0🙏`
      : isHi
      ? `नमस्ते, ${loggedInName}\u00A0🙏`
      : isEn
      ? `Namaste, ${loggedInName}\u00A0🙏`
      : `નમસ્તે, ${loggedInName}\u00A0🙏`
    : isMr
    ? "नमस्कार नागरिक\u00A0🙏"
    : isHi
    ? "नमस्ते नागरिक\u00A0🙏"
    : isEn
    ? "Welcome Citizen\u00A0🙏"
    : "નમસ્તે નાગરિક\u00A0🙏";

  const greetingSubtitle = isMr
    ? "सरकारी योजना, पात्रता तपासणी आणि डिजिटल प्रमाणपत्रे — सर्व एकाच ठिकाणी"
    : isHi
    ? "सरकारी योजनाएं, पात्रता जांच और डिजिटल प्रमाणपत्र — सब एक ही स्थान पर"
    : isEn
    ? "Government Schemes, Eligibility & Digital Certificates — All in One Portal"
    : "સરકારી યોજનાઓ, પાત્રતા ચકાસણી અને ડિજિટલ પ્રમાણપત્રો — બધું એક જ જગ્યાએ";

  const helplineText = isMr
    ? "14567 हेल्पलाइन"
    : isHi
    ? "14567 हेल्पलाइन"
    : isEn
    ? "14567 Helpline"
    : "14567 હેલ્પલાઈન";

  const verifiedBadgeText = officer
    ? isMr
      ? "अधिकारी"
      : isHi
      ? "अधिकारी"
      : isEn
      ? "Officer"
      : "અધિકારી"
    : isMr
    ? "2FA प्रमाणित"
    : isHi
    ? "2FA प्रमाणित"
    : isEn
    ? "2FA Verified"
    : "2FA પ્રમાણિત";

  return (
    <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-emerald-600 rounded-3xl p-4 text-white shadow-md relative overflow-hidden">
      {/* Row 1: Top Status Badges + 14567 Helpline Pill */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full whitespace-nowrap">
            Digital Gujarat DPI
          </span>
          {(citizen || officer) && (
            <span className="text-xs font-extrabold bg-emerald-950/45 border border-emerald-300/40 text-emerald-100 px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 size={12} className="text-emerald-300 shrink-0" />
              <span>{verifiedBadgeText}</span>
            </span>
          )}
        </div>

        <a
          href="tel:14567"
          className="app-touch-card flex items-center gap-1.5 bg-slate-950/40 hover:bg-slate-950/60 border border-white/30 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition"
        >
          <PhoneCall size={12} className="text-amber-300 shrink-0" />
          <span>{helplineText}</span>
        </a>
      </div>

      {/* Row 2: Full-Width Emblem + Greeting Name + Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-white/95 p-2 flex items-center justify-center shrink-0 shadow-sm">
          <img
            src="/icon.svg"
            alt="National Emblem"
            width="32"
            height="32"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-black tracking-tight leading-snug text-white">
            {greetingTitle}
          </h1>
          <p className="text-xs text-orange-50 leading-relaxed mt-0.5">
            {greetingSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
