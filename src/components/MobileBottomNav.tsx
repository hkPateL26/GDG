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

export default function MobileBottomNav() {
  const pathname = usePathname();
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
    window.addEventListener("popstate", syncState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", syncState);
      window.removeEventListener("popstate", syncState);
    };
  }, [syncState, pathname]);

  const navItems = [
    {
      key: "home",
      href: "/",
      label: "હોમ",
      englishLabel: "Home",
      icon: Home,
    },
    {
      key: "schemes",
      href: "/schemes",
      label: "યોજનાઓ",
      englishLabel: "Schemes",
      icon: LayoutGrid,
    },
    {
      key: "chat",
      href: "/chat",
      label: "AI સહાયક",
      englishLabel: "AI Chat",
      icon: Bot,
      highlight: true,
    },
    {
      key: "locator",
      href: "/locator",
      label: "કચેરી",
      englishLabel: "Offices",
      icon: MapPin,
    },
    {
      key: "login",
      href: "/portal",
      label: citizenSession ? "વોલ્ટ" : officerSession ? "ડેસ્ક" : "લૉગિન",
      englishLabel: "Login",
      icon: User,
      badge: citizenSession ? "2FA" : officerSession ? "કચેરી" : undefined,
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

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom,8px),8px)] print:hidden"
    >
      <div className="grid grid-cols-5 items-end max-w-md mx-auto w-full">
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
                  className="flex flex-col items-center justify-end relative -top-3 group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 ${
                      isActive
                        ? "bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 text-white ring-4 ring-orange-200 shadow-orange-500/30"
                        : "bg-slate-900 text-amber-300 hover:bg-slate-800 shadow-slate-900/20"
                    }`}
                  >
                    <IconComponent size={22} className="stroke-[2.2]" />
                    <Sparkles
                      size={11}
                      className="absolute top-2 right-2 text-amber-300 animate-pulse"
                    />
                  </div>
                  <span
                    className={`text-[10px] font-black mt-1 transition-colors whitespace-nowrap text-center ${
                      isActive ? "text-orange-600" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          }

          return (
            <div key={item.key} className="flex justify-center">
              <Link
                href={item.href}
                onClick={() => {
                  triggerHaptic("selection");
                }}
                className={`w-full flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer relative text-center ${
                  isActive ? "text-orange-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className="relative flex items-center justify-center w-6 h-6">
                  <IconComponent
                    size={20}
                    className={`transition-transform duration-200 ${
                      isActive ? "stroke-[2.5] scale-110" : "stroke-[1.8]"
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3 text-[8px] bg-emerald-600 text-white font-black px-1 py-0.2 rounded-full leading-tight">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-1 transition-all whitespace-nowrap ${
                    isActive ? "font-black scale-105" : "font-semibold"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-4 h-0.5 bg-orange-600 rounded-full mt-0.5 animate-in zoom-in duration-150" />
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
