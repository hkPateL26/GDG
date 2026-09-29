"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  LayoutGrid,
  Bot,
  FolderLock,
  Building2,
  Sparkles,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [citizenSession, setCitizenSession] = useState<boolean>(false);
  const [officerSession, setOfficerSession] = useState<boolean>(false);

  useEffect(() => {
    const checkSessions = () => {
      if (typeof window !== "undefined") {
        setCitizenSession(Boolean(localStorage.getItem("nagrik_citizen_session")));
        setOfficerSession(Boolean(sessionStorage.getItem("nagrik_officer_session")));
      }
    };
    checkSessions();
    window.addEventListener("storage", checkSessions);
    return () => window.removeEventListener("storage", checkSessions);
  }, []);

  const navItems = [
    {
      href: "/",
      label: "હોમ",
      englishLabel: "Home",
      icon: Home,
      exact: true,
    },
    {
      href: "/schemes",
      label: "યોજનાઓ",
      englishLabel: "Schemes",
      icon: LayoutGrid,
      exact: false,
    },
    {
      href: "/chat",
      label: "AI સહાયક",
      englishLabel: "AI Chat",
      icon: Bot,
      highlight: true,
      exact: false,
    },
    {
      href: "/portal?mode=citizen",
      altHref: "/track",
      label: citizenSession ? "વોલ્ટ" : "ટ્રેક",
      englishLabel: "Vault",
      icon: FolderLock,
      exact: false,
      badge: citizenSession ? "પ્રમાણિત" : undefined,
    },
    {
      href: "/portal?mode=officer",
      altHref: "/admin",
      label: officerSession ? "ડેસ્ક" : "કચેરી",
      englishLabel: "Admin",
      icon: Building2,
      exact: false,
      badge: officerSession ? "કચેરી" : undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[max(env(safe-area-inset-bottom,8px),8px)] print:hidden"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href.split("?")[0]) ||
              (item.altHref && pathname.startsWith(item.altHref));

          const IconComponent = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-3 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 ${
                    isActive
                      ? "bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 text-white ring-4 ring-orange-200"
                      : "bg-slate-900 text-amber-300 hover:bg-slate-800"
                  }`}
                >
                  <IconComponent size={22} className="stroke-[2.2]" />
                  <Sparkles
                    size={11}
                    className="absolute top-2 right-2 text-amber-300 animate-pulse"
                  />
                </div>
                <span
                  className={`text-[10px] font-black mt-1 transition-colors ${
                    isActive ? "text-orange-600 font-black" : "text-slate-600"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer relative ${
                isActive ? "text-orange-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className="relative">
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
                className={`text-[10px] tracking-tight mt-1 transition-all ${
                  isActive ? "font-black scale-105" : "font-semibold"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 bg-orange-600 rounded-full mt-0.5 animate-in zoom-in duration-150" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
