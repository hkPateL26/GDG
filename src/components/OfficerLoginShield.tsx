"use client";

import { useState } from "react";
import {
  Lock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  User,
  KeyRound,
} from "lucide-react";

export interface OfficerProfile {
  id: string;
  name: string;
  designation: string;
  district: string;
  taluka: string;
  office?: string;
  role?: string;
}

interface OfficerLoginShieldProps {
  onSuccess: (officer: OfficerProfile) => void;
  onCitizenClick?: () => void;
}

export default function OfficerLoginShield({
  onSuccess,
  onCitizenClick,
}: OfficerLoginShieldProps) {
  const [officerId, setOfficerId] = useState("GUJ-GOV-9012");
  const [officerPin, setOfficerPin] = useState("GJ2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleDemoFill = () => {
    setOfficerId("GUJ-GOV-9012");
    setOfficerPin("GJ2026");
    setError("");
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!officerId.trim() || !officerPin.trim()) {
      setError("કૃપા કરીને કર્મચારી ID અને સિક્યોરિટી PIN દાખલ કરો.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_officer",
          officerId: officerId.trim(),
          pin: officerPin.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.officer) {
        setSuccessMsg("અધિકૃત પ્રમાણીકરણ સફળ! કચેરી ડેસ્ક ખુલી રહ્યું છે...");
        sessionStorage.setItem("nagrik_officer_session", JSON.stringify(data.officer));
        sessionStorage.setItem("nagrik_authenticated_officer", JSON.stringify(data.officer));
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => {
          onSuccess(data.officer);
        }, 300);
      } else {
        setError(data.error || "અમાન્ય કર્મચારી ID અથવા PIN. ડેમો ID: GUJ-GOV-9012, PIN: GJ2026 વાપરો.");
      }
    } catch {
      setError("કચેરી સર્વર પ્રમાણીકરણમાં ક્ષતિ આવી.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-2 border-slate-900 overflow-hidden my-0 sm:my-4 animate-in fade-in duration-300">
      {/* ── Official Header ── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-7 text-white relative space-y-1 sm:space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-lg sm:text-2xl shadow-inner shrink-0">
              🏛️
            </div>
            <div>
              <span className="hidden sm:inline-block text-[10.5px] font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-2 py-0.2 rounded-full mb-0.5">
                ગુજરાત સરકાર &bull; વહીવટી પોર્ટલ
              </span>
              <h2 className="text-sm sm:text-2xl font-black text-white leading-tight">
                કચેરી સત્તાવાર એડમિન લૉગિન
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-300 font-medium">
                મામલતદાર, વિસ્તરણ અધિકારી & કચેરી સ્ક્રુટિની ડેસ્ક
              </p>
            </div>
          </div>
          <span className="text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-xs shrink-0">
            Govt Desk
          </span>
        </div>

        {/* Feature Badges - hidden on mobile to fit 1-screen viewport */}
        <div className="hidden sm:grid grid-cols-3 gap-2 pt-2 text-[11px] font-semibold text-slate-200">
          <div className="bg-slate-800/80 border border-slate-700 p-2 rounded-xl text-center">
            📋 અરજી સ્ક્રુટિની
          </div>
          <div className="bg-slate-800/80 border border-slate-700 p-2 rounded-xl text-center">
            ✍️ e-Sign મંજૂરી
          </div>
          <div className="bg-slate-800/80 border border-slate-700 p-2 rounded-xl text-center">
            💰 DBT સહાય ઓર્ડર
          </div>
        </div>
      </div>

      {/* ── Form Body ── */}
      <div className="p-3 sm:p-8 space-y-2.5 sm:space-y-4">
        {/* Fast Demo Banner for 5 Administrative Tiers */}
        <div className="p-2 sm:p-3.5 bg-amber-50 border border-amber-300 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles size={13} className="text-amber-700 shrink-0" />
              <p className="text-[11px] sm:text-xs font-black text-amber-950 truncate">
                ૫ વહીવટી સ્તર ડેમો (1-Click Fill):
              </p>
            </div>
            <span className="text-[9.5px] sm:text-[10px] bg-amber-200 text-amber-900 font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0">
              PIN: GJ2026
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold">
            <button
              type="button"
              onClick={() => {
                setOfficerId("GUJ-STATE-001");
                setOfficerPin("GJ2026");
                setError("");
              }}
              className={`p-1 sm:p-1.5 rounded-lg border text-left truncate transition cursor-pointer ${
                officerId === "GUJ-STATE-001"
                  ? "bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              🏛️ ૧. સચિવાલય
            </button>
            <button
              type="button"
              onClick={() => {
                setOfficerId("GUJ-COL-3001");
                setOfficerPin("GJ2026");
                setError("");
              }}
              className={`p-1 sm:p-1.5 rounded-lg border text-left truncate transition cursor-pointer ${
                officerId === "GUJ-COL-3001"
                  ? "bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              🏢 ૨. કલેક્ટર
            </button>
            <button
              type="button"
              onClick={() => {
                setOfficerId("GUJ-SDM-5002");
                setOfficerPin("GJ2026");
                setError("");
              }}
              className={`p-1 sm:p-1.5 rounded-lg border text-left truncate transition cursor-pointer ${
                officerId === "GUJ-SDM-5002"
                  ? "bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              ⚖️ ૩. પ્રાંત (SDM)
            </button>
            <button
              type="button"
              onClick={() => {
                setOfficerId("GUJ-GOV-9012");
                setOfficerPin("GJ2026");
                setError("");
              }}
              className={`p-1 sm:p-1.5 rounded-lg border text-left truncate transition cursor-pointer ${
                officerId === "GUJ-GOV-9012"
                  ? "bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              🖋️ ૪. મામલતદાર
            </button>
            <button
              type="button"
              onClick={() => {
                setOfficerId("GUJ-TAL-7089");
                setOfficerPin("GJ2026");
                setError("");
              }}
              className={`p-1 sm:p-1.5 rounded-lg border text-left truncate transition cursor-pointer ${
                officerId === "GUJ-TAL-7089"
                  ? "bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              📋 ૫. તલાટી મંત્રી
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-2.5 sm:space-y-4">
          {/* Officer ID Input */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              🏛️ સરકારી કર્મચારી ID (Officer ID)
            </label>
            <div className="relative">
              <input
                type="text"
                value={officerId}
                onChange={(e) => {
                  setOfficerId(e.target.value.toUpperCase());
                  if (error) setError("");
                }}
                placeholder="GUJ-GOV-9012"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold text-xs sm:text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                કચેરી કોડ
              </span>
            </div>
          </div>

          {/* Security PIN Input */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              🔑 કચેરી સિક્યોરિટી PIN (Govt Security PIN)
            </label>
            <div className="relative">
              <input
                type="password"
                value={officerPin}
                onChange={(e) => {
                  setOfficerPin(e.target.value);
                  if (error) setError("");
                }}
                placeholder="GJ2026"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold text-xs sm:text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
              <KeyRound size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="text-[10px] sm:text-[10.5px] text-slate-500 mt-0.5 sm:mt-1">
              સત્તાવાર ડેમો PIN: <strong className="font-mono text-slate-800">GJ2026</strong>
            </p>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="p-2 sm:p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-1.5">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2 sm:p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-1.5">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3.5 bg-slate-900 hover:bg-black active:scale-95 text-amber-300 font-black rounded-xl text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin text-amber-300" />
                <span>કચેરી ડેટા વેરિફાય થઈ રહ્યો છે...</span>
              </>
            ) : (
              <>
                <Lock size={15} />
                <span>કચેરી એડમિન લૉગિન કરો (Officer Sign In)</span>
              </>
            )}
          </button>
        </form>

        {/* Switch back to Citizen Login */}
        {onCitizenClick && (
          <div className="pt-2 sm:pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onCitizenClick}
              className="text-[11px] sm:text-xs font-bold text-slate-600 hover:text-orange-600 transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <User size={12} className="text-orange-500" />
              <span>સામાન્ય નાગરિક છો? [નાગરિક 2FA લૉગિન કરો]</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
