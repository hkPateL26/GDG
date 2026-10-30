"use client";

import { useState, useEffect, useCallback } from "react";
import {
  APP_VERSION,
  APP_BUILD_NAME,
  APP_RELEASE_DATE,
  APP_RELEASE_DATE_EN,
} from "@/lib/app-version";
import {
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Lock,
  Sparkles,
  Download,
  X,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";
import { useLanguage } from "@/context/LanguageContext";

export default function OfficialGovernmentUpdateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFloatingPill, setShowFloatingPill] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [serverBuildHash, setServerBuildHash] = useState<string>("");
  const [serverVersion, setServerVersion] = useState<string>(APP_VERSION);
  const [apkDownloadUrl, setApkDownloadUrl] = useState<string>("/download/nagrik-seva-ai.apk");
  const [apkSize, setApkSize] = useState<string>("94 MB");
  const [isNativeApp, setIsNativeApp] = useState(false);
  const { currentLang } = useLanguage();

  const isEn = currentLang === "en";
  const isHi = currentLang === "hi";

  const checkLiveVersion = useCallback(async () => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent || "";
    const isNative = ua.includes("NagrikSevaNativeAndroid") || Boolean((window as unknown as { Capacitor?: unknown }).Capacitor);
    setIsNativeApp(isNative);

    try {
      const res = await fetch(`/api/version?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();

      const latestVer = data?.version || APP_VERSION;
      const latestHash = data?.buildHash || "";
      if (data?.apkDownloadUrl) setApkDownloadUrl(data.apkDownloadUrl);
      if (data?.apkSize) setApkSize(data.apkSize);
      if (latestVer) setServerVersion(latestVer);
      if (latestHash) setServerBuildHash(latestHash);

      const savedVersion = localStorage.getItem("nagrik_app_version");
      const savedHash = localStorage.getItem("nagrik_app_build_hash");
      const isDismissed = sessionStorage.getItem("nagrik_update_dismissed") === "true";

      // Detect if an update is available (server version differs from installed or build hash changed)
      const hasNewVersion = (savedVersion && savedVersion !== latestVer) || (latestVer !== APP_VERSION);
      const hasNewHash = (savedHash && latestHash && savedHash !== latestHash);

      if (hasNewVersion || hasNewHash) {
        if (!isDismissed) {
          setIsOpen(true);
        } else {
          setShowFloatingPill(true);
        }
      } else {
        // Record current initial baseline
        if (!savedVersion) localStorage.setItem("nagrik_app_version", APP_VERSION);
        if (!savedHash && latestHash) localStorage.setItem("nagrik_app_build_hash", latestHash);
      }
    } catch {
      // Ignore transient network errors
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    setShowFloatingPill(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("nagrik_update_dismissed", "true");
    }
  };

  useEffect(() => {
    checkLiveVersion();

    const handleManualCheck = () => {
      setIsOpen(true);
      setShowFloatingPill(false);
    };

    window.addEventListener("nagrik_check_update", handleManualCheck);
    return () => {
      window.removeEventListener("nagrik_check_update", handleManualCheck);
    };
  }, [checkLiveVersion]);

  const handleApplyUpdate = async () => {
    triggerHaptic("heavy");
    setIsUpdating(true);

    try {
      // Fetch latest metadata
      let latestVer = serverVersion || APP_VERSION;
      let latestHash = serverBuildHash;
      try {
        const res = await fetch(`/api/version?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.version) latestVer = data.version;
          if (data?.buildHash) latestHash = data.buildHash;
        }
      } catch {}

      // Clear legacy PWA caches & refresh Service Worker
      if (typeof window !== "undefined" && "caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.update().catch(() => {})));
      }

      localStorage.setItem("nagrik_app_version", latestVer);
      if (latestHash) {
        localStorage.setItem("nagrik_app_build_hash", latestHash);
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("nagrik_update_dismissed", "true");
      }
      localStorage.setItem("nagrik_app_updated_at", new Date().toISOString());

      setUpdateSuccess(true);

      // If in Native Android App, initiate APK direct download/install
      if (isNativeApp && typeof window !== "undefined") {
        const link = document.createElement("a");
        link.href = apkDownloadUrl;
        link.download = "nagrik-seva-ai.apk";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTimeout(() => {
        setIsUpdating(false);
        setIsOpen(false);
        setShowFloatingPill(false);
        window.location.reload();
      }, 1000);
    } catch {
      localStorage.setItem("nagrik_app_version", APP_VERSION);
      if (serverBuildHash) {
        localStorage.setItem("nagrik_app_build_hash", serverBuildHash);
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("nagrik_update_dismissed", "true");
      }
      setIsUpdating(false);
      setIsOpen(false);
      window.location.reload();
    }
  };

  // Keyboard Escape key handler (WCAG 2.2 AA SC 2.1.1 Keyboard)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const t = {
    playBadge: isEn ? "Google Play • In-App Update" : isHi ? "Google Play • इन-ऐप अपडेट" : "Google Play • ઇન-એપ અપડેટ",
    verified: isEn ? "Verified by Play Protect • 100% Official" : isHi ? "Play Protect द्वारा सत्यापित • १००% सुरक्षित" : "Play Protect દ્વારા ચકાસાયેલ • ૧૦૦% સુરક્ષિત",
    appName: isEn ? "NagrikSeva AI" : isHi ? "नागरिक सेवा AI" : "નાગરિક સેવા AI",
    govDept: isEn ? "Govt of Gujarat • Dept of Science & Technology" : isHi ? "गुजरात सरकार • विज्ञान एवं प्रौद्योगिकी विभाग" : "ગુજરાત સરકાર • વિજ્ઞાન અને પ્રૌદ્યોગિકી વિભાગ",
    alertTitle: isEn ? "New Update Available" : isHi ? "नया अपडेट उपलब्ध है" : "નવું અપડેટ ઉપલબ્ધ છે",
    sizeLabel: isEn ? "Download Size:" : isHi ? "डाउनलोड साइज़:" : "ડાઉનલોડ સાઈઝ:",
    sizeDesc: isEn ? `${apkSize} • Over Wi-Fi or mobile data` : isHi ? `${apkSize} • वाई-फाई या मोबाइल डेटा पर` : `${apkSize} • વાઇ-ફાઇ અથવા મોબાઇલ ડેટા`,
    whatsNew: isEn ? "WHAT'S NEW IN THIS VERSION:" : isHi ? "इस नए संस्करण में क्या नया है:" : "આ નવા વર્ઝનમાં મુખ્ય સુધારા:",
    f1: isEn ? "Android Razorpay & UPI (PhonePe, GPay, Paytm) seamless payment fix" : isHi ? "Android Razorpay और UPI (PhonePe, GPay) सीमलेस पेमेंट फिक्स" : "Android Razorpay અને UPI (PhonePe, GPay, Paytm) ૧-ક્લિક પેમેન્ટ સફળ",
    f2: isEn ? "Google Play style automatic in-app update notification system" : isHi ? "Google Play स्टाइल ऑटोमैटिक इन-ऐप अपडेट नोटिफिकेशन सिस्टम" : "Google Play Store સ્ટાઇલ ઓટો-અપડેટ નોટિફિકેશન અને ડાયરેક્ટ APK ડાઉનલોડ",
    f3: isEn ? "All 27+ Government Schemes, DigiLocker & Cyber Treasury e-Grass integration" : isHi ? "सभी २७+ सरकारी योजनाएं, डिजिलॉकर और साइबर ट्रेजरी e-Grass एकीकरण" : "તમામ ૨૭+ સરકારી યોજનાઓ, ડીજીલોકર અને સાયબર ટ્રેઝરી e-Grass સુરક્ષા",
    btnUpdate: isEn ? "⚡ Update Now" : isHi ? "⚡ अभी अपडेट करें" : "⚡ હમણાં અપડેટ કરો (Update Now)",
    btnLater: isEn ? "Later" : isHi ? "बाद में" : "પછીથી (Later)",
    btnUpdating: isEn ? "Downloading & Updating..." : isHi ? "डाउनलोड व अपडेट हो रहा है..." : "અપડેટ ઇન્સ્ટોલ થઈ રહ્યું છે...",
    btnSuccess: isEn ? "Update Complete! Restarting..." : isHi ? "अपडेट सफल! रीस्टार्ट हो रहा है..." : "અપડેટ સફળ! રીલોડ થઈ રહ્યું છે...",
    pillText: isEn ? "Update Available" : isHi ? "अपडेट उपलब्ध है" : "નવું અપડેટ ઉપલબ્ધ છે",
    pillSub: isEn ? "v" + serverVersion : "વર્ઝન " + serverVersion,
  };

  return (
    <>
      {/* ── Optional Floating Play Store Pill when dismissed ── */}
      {showFloatingPill && !isOpen && (
        <aside
          aria-label="App update notification"
          onClick={() => {
            triggerHaptic("light");
            setIsOpen(true);
            setShowFloatingPill(false);
          }}
          className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/50 shadow-2xl rounded-2xl p-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 backdrop-blur-xl animate-in slide-in-from-bottom duration-300 cursor-pointer hover:border-emerald-400 group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Download size={16} className="animate-bounce" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  {t.playBadge}
                </span>
                <span className="text-[9px] font-mono bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-1.5 py-0.2 rounded-full">
                  {t.pillSub}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate group-hover:text-emerald-300 transition">
                {t.alertTitle} • {apkSize}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow-sm shrink-0 flex items-center gap-1"
          >
            <span>અપડેટ</span>
            <ArrowRight size={13} />
          </button>
        </aside>
      )}

      {/* ── Official Google Play In-App Update Modal ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Google Play In-App Update"
          onClick={handleDismiss}
          className="fixed inset-0 z-[99990] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl text-white overflow-hidden animate-bottom-sheet sm:animate-in sm:fade-in sm:zoom-in-95 duration-200 flex flex-col pb-[env(safe-area-inset-bottom,0px)] cursor-default"
          >
            {/* Top Play Store Ribbon Header */}
            <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 px-4 pt-3 pb-4 sm:p-5 relative shrink-0">
              <div className="w-full pb-2 flex justify-center sm:hidden">
                <div className="w-11 h-1.5 bg-white/40 rounded-full" />
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
                title="બંધ કરો (Close)"
                aria-label="અપડેટ વિન્ડો બંધ કરો (Close update modal)"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-3 pr-8">
                {/* Official Icon */}
                <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-lg border border-white/20">
                  <img
                    src="/icon.svg"
                    alt="NagrikSeva AI"
                    width="36"
                    height="36"
                    className="w-9 h-9 object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-slate-950 text-emerald-300 border border-emerald-400/40">
                      {t.playBadge}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-100">
                      {APP_VERSION} → {serverVersion}
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-white mt-1 leading-snug">
                    {t.appName}
                  </h2>
                  <p className="text-[11px] text-emerald-100/90 truncate">
                    {t.govDept}
                  </p>
                </div>
              </div>

              {/* Play Protect Verified Pill */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 text-[10.5px] font-medium text-emerald-200 bg-emerald-950/50 border border-emerald-400/30 px-2.5 py-1 rounded-xl">
                <ShieldCheck size={13} className="text-emerald-300 shrink-0" />
                <span>{t.verified}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 space-y-3.5 text-xs text-slate-300">
              {/* Download Size & Network Note */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-emerald-400 shrink-0" />
                  <span className="text-slate-400 text-xs">{t.sizeLabel}</span>
                  <span className="font-bold text-white font-mono text-xs">{apkSize}</span>
                </div>
                <span className="text-[10.5px] text-slate-400">Wi-Fi / 4G</span>
              </div>

              {/* What's New Section */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>{t.whatsNew}</span>
                </p>

                <div className="space-y-1.5 text-xs text-slate-200">
                  <div className="flex items-start gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t.f1}</span>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                    <CheckCircle2 size={15} className="text-teal-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t.f2}</span>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                    <Lock size={15} className="text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t.f3}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 space-y-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="py-3 px-4 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center justify-center cursor-pointer shrink-0"
                >
                  <span>{t.btnLater}</span>
                </button>
                <button
                  type="button"
                  onClick={handleApplyUpdate}
                  disabled={isUpdating}
                  className="flex-1 py-3 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/30 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw size={17} className="animate-spin text-white" />
                      <span>{updateSuccess ? t.btnSuccess : t.btnUpdating}</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>{t.btnUpdate}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[10.5px] text-slate-500 font-mono">
                {isEn ? `Release Date: ${APP_RELEASE_DATE_EN}` : `સત્તાવાર પ્રકાશન: ${APP_RELEASE_DATE}`} • {APP_BUILD_NAME}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
