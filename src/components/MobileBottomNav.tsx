"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Home,
  LayoutGrid,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";
import { useLanguage } from "@/context/LanguageContext";
import { useIsPwaInstalled } from "@/lib/usePwaInstall";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { currentLang } = useLanguage();
  const { isStandalone } = useIsPwaInstalled();
  const [citizenSession, setCitizenSession] = useState<boolean>(false);
  const [officerSession, setOfficerSession] = useState<boolean>(false);

  const syncState = useCallback(() => {
    if (typeof window !== "undefined") {
      setCitizenSession(Boolean(localStorage.getItem("nagrik_citizen_session")));
      setOfficerSession(Boolean(sessionStorage.getItem("nagrik_officer_session")));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(syncState, 0);
    window.addEventListener("storage", syncState);
    window.addEventListener("nagrik_auth_change", syncState);
    window.addEventListener("popstate", syncState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", syncState);
      window.removeEventListener("nagrik_auth_change", syncState);
      window.removeEventListener("popstate", syncState);
    };
  }, [syncState, pathname]);

  const isEn = currentLang === "en";
  const isHi = currentLang === "hi";

  const navItems = [
    {
      key: "home",
      href: "/",
      label: isEn ? "Home" : isHi ? "होम" : "હોમ",
      icon: Home,
    },
    {
      key: "schemes",
      href: "/schemes",
      label: isEn ? "Schemes" : isHi ? "योजनाएं" : "યોજનાઓ",
      icon: LayoutGrid,
    },
    {
      key: "documents",
      href: "/documents",
      label: isEn ? "Services" : isHi ? "सेवाएं" : "અરજીઓ",
      icon: FileText,
      highlight: true,
    },
    {
      key: "track",
      href: "/track",
      label: isEn ? "Track" : isHi ? "ट्रैक" : "ટ્રેકિંગ",
      icon: Search,
    },
    {
      key: "vault",
      href: "/portal",
      label: citizenSession
        ? isEn ? "Vault" : isHi ? "वॉल्ट" : "વોલ્ટ"
        : officerSession
        ? isEn ? "Desk" : isHi ? "डेस्क" : "ડેસ્ક"
        : isEn ? "Login" : isHi ? "लॉगिन" : "લૉગિન",
      icon: ShieldCheck,
      badge: citizenSession ? "2FA" : officerSession ? (isEn ? "OFFICER" : isHi ? "અધિકારી" : "કચેરી") : undefined,
    },
  ];

  const isItemActive = (key: string) => {
    if (key === "home") return pathname === "/";
    if (key === "schemes") return pathname.startsWith("/schemes");
    if (key === "documents") return pathname.startsWith("/documents");
    if (key === "track") return pathname.startsWith("/track");
    if (key === "vault") return pathname.startsWith("/portal") || pathname.startsWith("/admin");
    return false;
  };

  // Show Bottom Menu on Mobile screens, Installed PWA, or Native Android App
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] px-2 pt-2 pb-[max(env(safe-area-inset-bottom,12px),12px)] print:hidden select-none"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto w-full gap-1">
        {navItems.map((item) => {
          const isActive = isItemActive(item.key);
          const IconComponent = item.icon;

          if (item.highlight) {
            return (
              <div key={item.key} className="flex justify-center">
                <Link
                  href={item.href}
                  onClick={() => {
                    triggerHaptic("medium");
                  }}
                  className="w-full flex flex-col items-center justify-center py-0.5 group cursor-pointer active:scale-92 transition-transform duration-150"
                >
                  {/* Material 3 / WhatsApp Active Pill with AI Sparkle */}
                  <div
                    className={`relative w-15 h-8.5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30 scale-105"
                        : "bg-slate-900 text-amber-300 hover:bg-slate-800 shadow-xs"
                    }`}
                  >
                    <IconComponent size={21} className="stroke-[2.3]" />
                    
                  </div>
                  <span
                    className={`text-xs leading-tight mt-1 transition-colors whitespace-nowrap truncate max-w-full px-0.5 ${
                      isActive ? "font-black text-orange-600" : "font-bold text-slate-700"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          }

          return (
            <div key={item.key} className="flex justify-center min-w-0">
              <Link
                href={item.href}
                onClick={() => {
                  triggerHaptic("selection");
                }}
                className={`w-full flex flex-col items-center justify-center py-0.5 rounded-2xl transition-all duration-150 active:scale-92 cursor-pointer relative text-center min-w-0 ${
                  isActive ? "text-orange-700" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {/* WhatsApp / Material 3 Active Pill Indicator */}
                <div
                  className={`relative flex items-center justify-center w-15 h-8.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-orange-100/95 text-orange-600 shadow-2xs"
                      : "bg-transparent text-slate-500"
                  }`}
                >
                  <IconComponent
                    size={21}
                    className={`transition-transform duration-200 ${
                      isActive ? "stroke-[2.5] scale-105" : "stroke-[2.0]"
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute -top-1 right-1 text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full leading-tight shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs leading-tight tracking-tight mt-1 transition-all whitespace-nowrap truncate max-w-full px-0.5 ${
                    isActive ? "font-black text-orange-700" : "font-semibold text-slate-600"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
