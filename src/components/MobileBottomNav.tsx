"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Home,
  LayoutGrid,
  Bot,
  MapPin,
  User,
  Sparkles,
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
      key: "chat",
      href: "/chat",
      label: isEn ? "AI Chat" : isHi ? "AI सहायक" : "AI સહાયક",
      icon: Bot,
      highlight: true,
    },
    {
      key: "locator",
      href: "/locator",
      label: isEn ? "Offices" : isHi ? "कार्यालय" : "કચેરી",
      icon: MapPin,
    },
    {
      key: "login",
      href: "/portal",
      label: citizenSession
        ? isEn ? "Vault" : isHi ? "वॉल्ट" : "વોલ્ટ"
        : officerSession
        ? isEn ? "Desk" : isHi ? "डेस्क" : "ડેસ્ક"
        : isEn ? "Login" : isHi ? "लॉगिन" : "લૉગિન",
      icon: User,
      badge: citizenSession ? "2FA" : officerSession ? (isEn ? "OFFICER" : isHi ? "अधिकारी" : "કચેરી") : undefined,
    },
  ];

  const isItemActive = (key: string) => {
    if (key === "home") return pathname === "/";
    if (key === "schemes") return pathname.startsWith("/schemes");
    if (key === "chat") return pathname.startsWith("/chat");
    if (key === "locator") return pathname.startsWith("/locator");
    if (key === "login") return pathname.startsWith("/portal") || pathname.startsWith("/admin");
    return false;
  };

  // Strictly show Bottom Menu ONLY when running inside the Installed App (PWA Standalone mode)
  if (!isStandalone) return null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/88 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(15,23,42,0.07)] px-1.5 pt-1.5 pb-[max(env(safe-area-inset-bottom,8px),8px)] print:hidden select-none"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto w-full gap-0.5">
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
                    className={`relative w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30 scale-105"
                        : "bg-slate-900 text-amber-300 hover:bg-slate-800 shadow-xs"
                    }`}
                  >
                    <IconComponent size={19} className="stroke-[2.3]" />
                    <Sparkles
                      size={10}
                      className="absolute top-1 right-2 text-amber-300 animate-pulse"
                    />
                  </div>
                  <span
                    className={`text-[10.5px] leading-tight mt-1 transition-colors whitespace-nowrap truncate max-w-full px-0.5 ${
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
                  className={`relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-orange-100/95 text-orange-600 shadow-2xs"
                      : "bg-transparent text-slate-500"
                  }`}
                >
                  <IconComponent
                    size={19}
                    className={`transition-transform duration-200 ${
                      isActive ? "stroke-[2.5] scale-105" : "stroke-[1.9]"
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute -top-1 right-1 text-[8px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full leading-tight shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10.5px] leading-tight tracking-tight mt-1 transition-all whitespace-nowrap truncate max-w-full px-0.5 ${
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
