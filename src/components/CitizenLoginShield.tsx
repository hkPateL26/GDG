"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Smartphone,
  Lock,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Building2,
  FileText,
  IndianRupee,
} from "lucide-react";
import { CitizenLedgerProfile } from "@/lib/large-datasets";

interface CitizenLoginShieldProps {
  onSuccess: (citizen: CitizenLedgerProfile) => void;
  onOfficerClick?: () => void;
  serviceTitle?: string;
}

export default function CitizenLoginShield({
  onSuccess,
  onOfficerClick,
  serviceTitle = "સરકારી સેવા પોર્ટલ",
}: CitizenLoginShieldProps) {
  const [loginMobile, setLoginMobile] = useState("9825012345");
  const [loginAadhaar, setLoginAadhaar] = useState("4829");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedSmsOtp, setSimulatedSmsOtp] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(180);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  // OTP Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, otpCountdown]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthSuccessMsg("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_otp",
          mobile: loginMobile,
          aadhaarLast4: loginAadhaar,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setSimulatedSmsOtp(data.simulatedOtp);
        setOtpCountdown(180);
        setAttemptsLeft(3);
        setAuthSuccessMsg(data.message || "OTP સફળતાપૂર્વક મોકલાયો છે.");
      } else {
        setAuthError(data.error || "OTP મોકલવામાં ક્ષતિ આવી.");
      }
    } catch {
      setAuthError("સર્વર સાથે કનેક્ટ થઈ શક્યું નથી.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginOtp.trim()) {
      setAuthError("કૃપા કરીને ૬ આંકડાનો OTP દાખલ કરો.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_otp",
          mobile: loginMobile,
          otp: loginOtp,
          aadhaarLast4: loginAadhaar,
        }),
      });

      const data = await res.json();
      if (data.success && data.citizen) {
        // Save session globally
        localStorage.setItem("nagrik_citizen_session", JSON.stringify(data.citizen));
        window.dispatchEvent(new Event("storage"));
        onSuccess(data.citizen);
      } else {
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        setAuthError(data.error || "અમાન્ય OTP. કૃપા કરીને પુનઃ પ્રયાસ કરો.");
      }
    } catch {
      setAuthError("સર્વર પ્રમાણીકરણમાં ક્ષતિ.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFastDemoCitizen = () => {
    setLoginMobile("9825012345");
    setLoginAadhaar("4829");
    setAuthError("");
  };

  const handleAutoFillOtp = () => {
    if (simulatedSmsOtp) {
      setLoginOtp(simulatedSmsOtp);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden my-4 sm:my-8 animate-in fade-in duration-300">
      {/* Top National DPI Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white p-6 sm:p-7 text-center space-y-2">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
          🛡️
        </div>
        {serviceTitle && (
          <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            {serviceTitle}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-black">નાગરિક સેવા સુરક્ષિત લૉગિન (2FA)</h2>
        <p className="text-xs sm:text-sm text-orange-100 max-w-md mx-auto leading-relaxed">
          સરકારી ડેટા સુરક્ષા અધિનિયમ (DPDP Act 2023) મુજબ ૧-વખત લૉગિન કરો અને તમારી તમામ સેવાઓ સીધી મેળવો.
        </p>

        {/* 3 Unified Services Highlight */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 text-[10px] sm:text-[11px] text-white/90">
          <div className="bg-white/10 rounded-xl p-1.5 backdrop-blur-xs flex items-center justify-center gap-1">
            <FileText size={12} />
            <span className="truncate">અરજી ટ્રેકિંગ</span>
          </div>
          <div className="bg-white/10 rounded-xl p-1.5 backdrop-blur-xs flex items-center justify-center gap-1">
            <Sparkles size={12} />
            <span className="truncate">દસ્તાવેજ સેવા</span>
          </div>
          <div className="bg-white/10 rounded-xl p-1.5 backdrop-blur-xs flex items-center justify-center gap-1">
            <IndianRupee size={12} />
            <span className="truncate">DBT લાભ લેજર</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
        {/* 1-Click Fast Demo Pill */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-orange-900">
            <Sparkles size={16} className="text-orange-600 shrink-0" />
            <span>
              <strong>હેકાથોન જજ લાઈવ ડેમો:</strong> ૧-ક્લિકમાં રમેશભાઈ પટેલની વિગતો ભરો
            </span>
          </div>
          <button
            type="button"
            onClick={handleFastDemoCitizen}
            className="shrink-0 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
          >
            ડેમો ભરો ✓
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              📱 રજિસ્ટર્ડ ૧૦ આંકડાનો મોબાઈલ નંબર
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={loginMobile}
                onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ""))}
                disabled={otpSent}
                placeholder="૯૮૨૫૦ ૧૨૩૪૫"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              🪪 આધાર કાર્ડના છેલ્લા ૪ આંકડા (Two-Factor Binding)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                XXXX - XXXX -
              </span>
              <input
                type="text"
                maxLength={4}
                value={loginAadhaar}
                onChange={(e) => setLoginAadhaar(e.target.value.replace(/\D/g, ""))}
                disabled={otpSent}
                placeholder="૪૮૨૯"
                className="w-full pl-32 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* If OTP Sent, Show OTP Input and Live Simulated SMS Badge */}
          {otpSent && (
            <div className="space-y-3 pt-2 animate-in fade-in duration-300">
              {/* Live Simulated SMS Notification */}
              {simulatedSmsOtp && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-4 space-y-2 text-xs text-emerald-950 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-300 pb-2">
                    <span className="font-black flex items-center gap-1.5 text-emerald-900">
                      <Smartphone size={15} />
                      <span>ગુજરાત સરકાર સુરક્ષિત SMS (UIDAI / DPI Gateway)</span>
                    </span>
                    <span className="bg-emerald-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                      LIVE SMS
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    નમસ્તે રમેશભાઈ, તમારી નાગરિક સેવાઓ અનલૉક કરવાનો સત્તાવાર OTP:{" "}
                    <strong className="font-mono text-base text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      {simulatedSmsOtp}
                    </strong>
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700">આ કોડ કોઈ સાથે શેર કરશો નહીં.</span>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-3 py-1 rounded-lg text-xs transition"
                    >
                      કોડ આપોઆપ ભરો ✓
                    </button>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    🔐 ૬ આંકડાનો OTP દાખલ કરો
                  </label>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-orange-600 flex items-center gap-1">
                      <Clock size={12} /> {otpCountdown}s
                    </span>
                    <span className="text-slate-400">| પ્રયાસો: {attemptsLeft}/3</span>
                  </div>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={loginOtp}
                  onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="દા.ત. 123456"
                  autoFocus
                  className="w-full text-center tracking-widest text-xl font-mono font-black py-3 bg-white border-2 border-orange-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Feedback Alerts */}
          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && !authError && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          {!otpSent ? (
            <button
              type="submit"
              disabled={authLoading || loginMobile.length !== 10 || loginAadhaar.length !== 4}
              className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-95 text-white font-extrabold rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>OTP મોકલાઈ રહ્યો છે...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>સુરક્ષિત OTP મેળવો (Get Secure OTP)</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <button
                type="submit"
                disabled={authLoading || loginOtp.length !== 6}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>ચકાસણી ચાલુ છે...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>સેવાઓ અનલૉક કરો (Access All Citizen Services)</span>
                  </>
                )}
              </button>

              <div className="flex justify-between items-center text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setLoginOtp("");
                    setSimulatedSmsOtp(null);
                  }}
                  className="text-slate-500 hover:text-slate-800 underline"
                >
                  મોબાઈલ નંબર બદલો
                </button>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpCountdown > 150}
                  className="text-orange-600 hover:text-orange-700 font-bold disabled:opacity-40"
                >
                  નવો OTP મોકલો (Resend)
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Office Mode Switch Option for Judges */}
        {onOfficerClick && (
          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onOfficerClick}
              className="text-xs font-bold text-slate-500 hover:text-orange-600 transition inline-flex items-center gap-1.5"
            >
              <Building2 size={13} />
              <span>સરકારી કર્મચારી / મામલતદાર છો? [અધિકારી લૉગિન કરો]</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
