"use client";

import { useState, useEffect } from "react";
import { APP_VERSION, APP_BUILD_NAME } from "@/lib/app-version";
import { useLanguage } from "@/context/LanguageContext";

export default function AppSplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const { currentLang } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const isEn = currentLang === "en";
  const isHi = currentLang === "hi";

  const t = {
    topTag: isEn ? "GOVT OF GUJARAT • DPI NETWORK" : isHi ? "गुजरात सरकार • DPI नेटवर्क" : "GOVT OF GUJARAT • DPI NETWORK",
    subtitle: isEn ? "Gujarat Public Service e-Governance Portal" : isHi ? "गुजरात लोक सेवा e-Governance पोर्टल" : "ગુજરાત જાહેર સેવા e-Governance",
    loading: isEn ? "Initializing System..." : isHi ? "सिस्टम सक्रिय हो रहा है..." : "સિસ્ટમ સક્રિય થઈ રહી છે...",
    release: isEn ? "OFFICIAL DPI RELEASE" : isHi ? "आधिकारिक विमोचन" : "સત્તાવાર પ્રકાશન",
    dpi: "Digital Public Infrastructure",
  };

  return (
    <div
      role="dialog"
      aria-label="App Launching Splash Screen"
      className={`fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-between text-white select-none px-4 pt-[max(env(safe-area-inset-top,24px),24px)] pb-[max(env(safe-area-inset-bottom,28px),28px)] transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* ── Top Spacer ── */}
      <div className="w-full flex justify-between items-center opacity-40 text-[10px] tracking-wider font-mono">
        <span>🇮🇳 {t.topTag}</span>
        <span>2FA SSO</span>
      </div>

      {/* ── Center: Branded App Emblem & Title (WhatsApp-Style Solid Centering) ── */}
      <div className="flex flex-col items-center justify-center text-center -mt-6">
        {/* Crisp Logo Container with subtle glow */}
        <div className="relative mb-4 shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500/25 via-amber-500/20 to-emerald-500/25 rounded-3xl blur-lg animate-pulse" />
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl flex items-center justify-center p-2">
            {/* Standard img avoids preload warnings */}
            <img
              src="/icon.svg"
              alt="NagrikSeva AI Official Emblem"
              width="64"
              height="64"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow"
            />
          </div>
        </div>

        {/* Clean, Non-wrapping Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-none">
          Nagrik<span className="text-orange-500">Seva</span>{" "}
          <span className="text-emerald-400">AI</span>
        </h1>

        {/* Subtitle in selected language */}
        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2 leading-tight max-w-[280px]">
          {t.subtitle}
        </p>

        {/* Subtle Animated Modern Indicator */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="text-[11px] text-slate-400 font-mono tracking-wide">
            {t.loading}
          </span>
        </div>
      </div>

      {/* ── Bottom Section: Official Version & Authoritative DPI Footer ── */}
      <div className="flex flex-col items-center justify-center text-center space-y-1 shrink-0">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
          {t.release}
        </p>
        <p className="text-xs font-bold text-slate-200 tracking-wide">
          {t.dpi}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span className="bg-slate-900 text-amber-400 border border-slate-800 px-2 py-0.5 rounded-full font-bold">
            {APP_VERSION}
          </span>
          <span>•</span>
          <span className="text-slate-400">{APP_BUILD_NAME}</span>
        </div>
      </div>
    </div>
  );
}
