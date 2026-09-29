"use client";

import { useState, useEffect } from "react";
import { PhoneCall, CheckCircle2 } from "lucide-react";

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

  return (
    <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-emerald-600 rounded-3xl p-3.5 text-white shadow-md relative overflow-hidden">
      {/* Row 1: Top Status Badges + 14567 Helpline Pill */}
      <div className="flex items-center justify-between gap-1.5 mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <span className="text-[9.5px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full whitespace-nowrap">
            Digital Gujarat DPI
          </span>
          {(citizen || officer) && (
            <span className="text-[9.5px] font-extrabold bg-emerald-950/45 border border-emerald-300/40 text-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 size={10} className="text-emerald-300 shrink-0" />
              <span>{officer ? "અધિકારી" : "2FA પ્રમાણિત"}</span>
            </span>
          )}
        </div>

        <a
          href="tel:14567"
          className="app-touch-card flex items-center gap-1 bg-slate-950/35 hover:bg-slate-950/50 border border-white/25 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0"
        >
          <PhoneCall size={11} className="text-amber-300 shrink-0" />
          <span>14567 હેલ્પલાઈન</span>
        </a>
      </div>

      {/* Row 2: Full-Width Emblem + Greeting Name + Subtitle */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-white/95 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
          <img
            src="/icon.svg"
            alt="National Emblem"
            width="28"
            height="28"
            className="w-7 h-7 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[15px] font-black tracking-tight leading-snug text-white">
            {loggedInName ? `નમસ્તે, ${loggedInName}\u00A0🙏` : "નમસ્તે નાગરિક\u00A0🙏"}
          </h1>
          <p className="text-[11px] text-orange-50/95 leading-snug mt-0.5">
            સરકારી યોજનાઓ, પાત્રતા ચકાસણી અને ડિજિટલ પ્રમાણપત્રો — બધું એક જ જગ્યાએ
          </p>
        </div>
      </div>
    </div>
  );
}
