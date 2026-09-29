"use client";

import { useState, useEffect } from "react";
import {
  APP_VERSION,
  APP_BUILD_NAME,
  APP_RELEASE_DATE,
} from "@/lib/app-version";
import {
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { triggerHaptic } from "@/lib/haptic";

export default function OfficialGovernmentUpdateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    // 1. Mandatory Check: If user has not updated to latest APP_VERSION, enforce popup
    if (typeof window !== "undefined") {
      const lastVersion = localStorage.getItem("nagrik_app_version");
      if (!lastVersion || lastVersion !== APP_VERSION) {
        // Appears smoothly right after splash screen finishes (1.5s)
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }

    // 2. Global event listener for manual trigger (from HealthBar or Footer)
    const handleManualCheck = () => {
      setIsOpen(true);
    };

    window.addEventListener("nagrik_check_update", handleManualCheck);
    return () => {
      window.removeEventListener("nagrik_check_update", handleManualCheck);
    };
  }, []);

  const handleApplyUpdate = async () => {
    triggerHaptic("heavy");
    setIsUpdating(true);

    try {
      // Clear legacy PWA caches
      if (typeof window !== "undefined" && "caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Record latest version to unlock the app
      localStorage.setItem("nagrik_app_version", APP_VERSION);
      localStorage.setItem("nagrik_app_updated_at", new Date().toISOString());

      setUpdateSuccess(true);

      setTimeout(() => {
        setIsUpdating(false);
        setIsOpen(false);
        // Clean reload to ensure latest JS chunks & manifests are loaded
        window.location.reload();
      }, 900);
    } catch {
      localStorage.setItem("nagrik_app_version", APP_VERSION);
      setIsUpdating(false);
      setIsOpen(false);
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="સત્તાવાર સરકારી ફરજિયાત અપડેટ"
      className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md notranslate select-none"
      translate="no"
    >
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* ── Compact Official Gov Header ── */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-4 sm:p-5 relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
              <Image
                src="/icon.svg"
                alt="Gov Emblem"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 border border-amber-400/40">
                  ફરજિયાત અપડેટ
                </span>
                <span className="text-xs font-mono font-bold text-orange-100">
                  {APP_VERSION}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-white mt-0.5 leading-snug">
                ગુજરાત સરકાર e-Governance DPI
              </h2>
            </div>
          </div>
        </div>

        {/* ── Clean, Minimal & Compact Body Content ── */}
        <div className="p-4 sm:p-5 space-y-3.5 text-xs text-slate-300">
          
          {/* Important Security Notice Badge */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-3 flex items-start gap-2.5">
            <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-amber-300 text-xs">
                નવીનતમ વર્ઝન અપડેટ કરવું ફરજિયાત છે
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                સરકારી સુરક્ષા માર્ગદર્શિકા અને નવી યોજનાઓનો અવિરત લાભ લેવા માટે આ અપડેટ જરૂરી છે.
              </p>
            </div>
          </div>

          {/* Clean 3-Item Bullet List (No bulky oversized cards) */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              નવા મુખ્ય સુધારાઓ:
            </p>

            <div className="space-y-1.5 text-xs text-slate-200">
              <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span className="truncate">૨૬+ નવી સરકારી યોજનાઓ & NFSA કાયદા નિયમો</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                <Sparkles size={15} className="text-amber-400 shrink-0" />
                <span className="truncate">અલ્ટ્રા-સ્પીડ Gemini AI & ગુજરાતી વોઇસ સહાયક</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                <Lock size={15} className="text-blue-400 shrink-0" />
                <span className="truncate">2FA આધાર સુરક્ષા અને ડિજિટલ વોલ્ટ સિંક</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Single Full-Width Compulsory Action Button ── */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 space-y-2 shrink-0">
          <button
            type="button"
            onClick={handleApplyUpdate}
            disabled={isUpdating}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isUpdating ? (
              <>
                <RefreshCw size={17} className="animate-spin text-white" />
                <span>
                  {updateSuccess ? "અપડેટ સફળ! રીલોડ થઈ રહ્યું છે..." : "અપડેટ ઇન્સ્ટોલ થઈ રહ્યું છે..."}
                </span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>⚡ હમણાં જ અપડેટ કરો (Update Now)</span>
              </>
            )}
          </button>

          <p className="text-center text-[10.5px] text-slate-500 font-mono">
            સત્તાવાર પ્રકાશન: {APP_RELEASE_DATE} • {APP_BUILD_NAME}
          </p>
        </div>

      </div>
    </div>
  );
}
