"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  User,
  KeyRound,
  ShieldCheck,
  X,
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
  const [demoAllowed, setDemoAllowed] = useState<boolean | null>(null);
  const [demoGateUnlocked, setDemoGateUnlocked] = useState<boolean>(false);
  const [showGateModal, setShowGateModal] = useState(false);
  const [gatePasscode, setGatePasscode] = useState("");
  const [gateLoading, setGateLoading] = useState(false);
  const [gateError, setGateError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/otp")
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data.success) {
          setDemoAllowed(Boolean(data.demoCredentialsAllowed));
          setDemoGateUnlocked(Boolean(data.demoGateUnlocked));
        }
      })
      .catch(() => {
        if (mounted) {
          const clientAllowed =
            process.env.NODE_ENV !== "production" ||
            process.env.NEXT_PUBLIC_ALLOW_DEMO_CREDENTIALS === "true";
          setDemoAllowed(clientAllowed);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleUnlockDemoGate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gatePasscode.trim()) {
      setGateError("ડેમો ગેટ પાસકોડ દાખલ કરો.");
      return;
    }

    setGateLoading(true);
    setGateError("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unlock_demo_gate",
          passcode: gatePasscode.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDemoAllowed(true);
        setDemoGateUnlocked(true);
        setShowGateModal(false);
        setGatePasscode("");
        setError("");
        setSuccessMsg("અધિકૃત ડેમો ગેટ સફળતાપૂર્વક અનલૉક થયો!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setGateError(data.error || "અમાન્ય ડેમો પાસકોડ. સાચો પાસકોડ દાખલ કરો.");
      }
    } catch {
      setGateError("ડેમો ગેટ અનલૉક કરવામાં ક્ષતિ આવી.");
    } finally {
      setGateLoading(false);
    }
  };

  const handleLockDemoGate = async () => {
    setGateLoading(true);
    try {
      await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lock_demo_gate" }),
      });
      setDemoGateUnlocked(false);
      const res = await fetch("/api/auth/otp");
      const data = await res.json();
      setDemoAllowed(Boolean(data.demoCredentialsAllowed));
    } catch {
      // ignore
    } finally {
      setGateLoading(false);
    }
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
        {/* Environment Notice when Demo PIN is Disabled in Production */}
        {demoAllowed === false && (
          <div className="p-2.5 sm:p-3 bg-amber-50 border border-amber-300 rounded-xl sm:rounded-2xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs">
                <AlertTriangle size={14} className="text-amber-700 shrink-0" />
                <span>સુરક્ષા નીતિ: પ્રોડક્શન વાતાવરણ (Production Mode)</span>
              </div>
              <span className="text-[9.5px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                ડેમો PIN લૉક
              </span>
            </div>
            <p className="text-[10.5px] text-amber-900 leading-snug">
              સામાન્ય સુરક્ષા હેઠળ શેર્ડ ડેમો PIN (GJ2026) લૉક છે. લાઈવ ડેમો/હેકાથોન પ્રસ્તુતિ માટે અધિકૃત ડેમો ગેટ અનલૉક કરો.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowGateModal(true);
                setGateError("");
              }}
              className="w-full py-1.5 px-3 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <KeyRound size={13} className="text-amber-300" />
              <span>🏛️ અધિકૃત ડેમો ગેટ અનલૉક કરો (Unlock Demo Gate)</span>
            </button>
          </div>
        )}

        {/* Fast Demo Banner for 5 Administrative Tiers */}
        <div className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2.5 shadow-2xs border ${
          demoAllowed === false
            ? "bg-slate-50 border-slate-200 opacity-60"
            : "bg-amber-50 border-amber-300"
        }`}>
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles size={13} className="text-amber-700 shrink-0" />
              <p className="text-[11px] sm:text-xs font-black text-amber-950 truncate">
                ૫ વહીવટી સ્તર ડેમો (1-Click Fill):
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {demoAllowed === true && (
                <span className="text-[9.5px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  ડેમો સક્રિય
                </span>
              )}
              {demoGateUnlocked && (
                <button
                  type="button"
                  onClick={handleLockDemoGate}
                  disabled={gateLoading}
                  className="text-[9.5px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-2 py-0.2 rounded-full border border-slate-300 flex items-center gap-1 cursor-pointer transition"
                  title="ડેમો સત્ર લૉક કરો"
                >
                  🔒 લૉક કરો
                </button>
              )}
              <span className="text-[9.5px] sm:text-[10px] bg-amber-200 text-amber-900 font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0">
                PIN: GJ2026
              </span>
            </div>
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
              {demoAllowed === false ? (
                <span className="text-amber-800 font-medium">
                  🔒 પ્રોડક્શન વાતાવરણ: ડેમો PIN લૉક છે. ડેમો ગેટ અનલૉક કરો અથવા સત્તાવાર સરકારી પાસવર્ડ વાપરો.
                </span>
              ) : (
                <span>
                  સત્તાવાર ડેમો PIN: <strong className="font-mono text-slate-800">GJ2026</strong>
                </span>
              )}
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

      {/* ── Demo Gate Passcode Modal ── */}
      {showGateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border-2 border-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    અધિકૃત ડેમો ગેટ
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    લાઈવ ડેમો એક્સેસ પાસકોડ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              લાઈવ વેબસાઇટ પર સરકારી અધિકારીઓ સમક્ષ ડેમો રજૂ કરવા માટે સુરક્ષિત ડેમો પાસકોડ દાખલ કરો:
              <div className="mt-1 font-mono font-bold text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded text-center">
                GUJ-DEMO-2026
              </div>
            </div>

            <form onSubmit={handleUnlockDemoGate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  ડેમો પાસકોડ (Demo Passcode)
                </label>
                <input
                  type="text"
                  value={gatePasscode}
                  onChange={(e) => {
                    setGatePasscode(e.target.value.toUpperCase());
                    if (gateError) setGateError("");
                  }}
                  placeholder="GUJ-DEMO-2026"
                  autoFocus
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {gateError && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[11px] flex items-center gap-1.5">
                  <AlertTriangle size={13} className="shrink-0" />
                  <span>{gateError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowGateModal(false)}
                  className="w-1/2 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  disabled={gateLoading}
                  className="w-1/2 py-2 bg-slate-900 hover:bg-black text-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {gateLoading ? (
                    <Loader2 size={14} className="animate-spin text-amber-300" />
                  ) : (
                    <ShieldCheck size={14} />
                  )}
                  <span>અનલૉક કરો</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
