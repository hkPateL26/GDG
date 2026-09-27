"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  FileText,
  Search,
  Bot,
  Phone,
  Menu,
  X,
  Sparkles,
  MapPin,
  Camera,
  IndianRupee,
  Smartphone,
  ShieldCheck,
  Lock,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useIsPwaInstalled } from "@/lib/usePwaInstall";
import { useLanguage } from "@/context/LanguageContext";
import { DEFAULT_LANGUAGE } from "@/lib/translation";
import LanguageSelector from "./LanguageSelector";

const InstallAppModal = dynamic(() => import("./InstallAppModal"), { ssr: false });

export default function Navbar() {
  const { isInstalled } = useIsPwaInstalled();
  const { currentLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [citizenSession, setCitizenSession] = useState<{
    citizenNameGu?: string;
    citizenName?: string;
    mobile?: string;
  } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("nagrik_citizen_session");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setCitizenSession(parsed.citizen || parsed);
          } catch {
            setCitizenSession(null);
          }
        } else {
          setCitizenSession(null);
        }
      }
    };

    checkSession();
    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (currentLang !== DEFAULT_LANGUAGE) {
      e.preventDefault();
      window.location.href = href;
    }
  };

  const navLinks = [
    { href: "/",                   label: t.nav.home,        Icon: Home },
    { href: "/documents",           label: "દસ્તાવેજ સેવા",   Icon: FileText },
    { href: "/eligibility",         label: t.nav.eligibility, Icon: Sparkles },
    { href: "/verify-doc",          label: t.nav.scanner,     Icon: Camera },
    { href: "/benefit-calculator",  label: t.nav.benefits,    Icon: IndianRupee },
    { href: "/schemes",            label: t.nav.schemes,     Icon: LayoutGrid },
    { href: "/locator",            label: t.nav.offices,     Icon: MapPin },
    { href: "/track",              label: t.nav.track,       Icon: Search },
    { href: "/chat",               label: t.nav.chat,        Icon: Bot },
  ];

  return (
    <nav className="bg-white shadow-sm border-b-2 border-orange-500 sticky top-0 z-50 notranslate" translate="no">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center gap-2 min-w-0 shrink-0"
          >
            <span className="text-2xl leading-none select-none">🇮🇳</span>
            <div className="min-w-0">
              <p className="font-bold text-gray-800 text-base leading-tight whitespace-nowrap">
                Nagrik<span className="text-orange-500">Seva</span>{" "}
                <span className="text-green-600">AI</span>
              </p>
              <p className="text-[10px] text-gray-400 hidden sm:block truncate whitespace-nowrap">
                Digital Public Infrastructure
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden xl:flex items-center gap-1 shrink-0">
            {navLinks.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                    active
                      ? "bg-orange-50 text-orange-600 font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                  }`}
                >
                  <Icon size={14} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}

            <a
              href="tel:14567"
              className="ml-1 flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition"
              title="24/7 Helpline"
            >
              <Phone size={13} className="shrink-0" />
              14567
            </a>

            {/* 🌐 Desktop Language Selector */}
            <div className="ml-1 shrink-0">
              <LanguageSelector variant="desktop" />
            </div>

            {/* 🔐 Citizen 2FA Session / Login Badge */}
            {citizenSession ? (
              <Link
                href="/track"
                className="ml-1 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition"
                title="તમારું નાગરિક વોલ્ટ ખોલો"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[100px] truncate">{citizenSession.citizenNameGu || citizenSession.citizenName || "વોલ્ટ"}</span>
              </Link>
            ) : (
              <Link
                href="/track"
                className="ml-1 flex items-center gap-1 bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 hover:border-orange-300 px-2 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition"
                title="નાગરિક 2FA લૉગિન"
              >
                <Lock size={12} className="shrink-0" />
                <span>લૉગિન</span>
              </Link>
            )}

            {/* 📱 Desktop Install App Button */}
            {!isInstalled && (
              <button
                data-pwa-install="true"
                onClick={() => setShowInstallModal(true)}
                className="pwa-install-element ml-1 flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition shadow-xs active:scale-95 cursor-pointer"
                title="મોબાઈલ એપ ઇન્સ્ટોલ કરો"
              >
                <Smartphone size={13} className="shrink-0" />
                <span>{t.nav.installApp}</span>
              </button>
            )}
          </div>

          {/* ── Mobile & Tablet Toggle ── */}
          <div className="xl:hidden flex items-center gap-1.5 shrink-0">
            {/* 🌐 Mobile Language Switcher */}
            <LanguageSelector variant="mobile-bar" />

            {!isInstalled && (
              <button
                data-pwa-install="true"
                onClick={() => setShowInstallModal(true)}
                className="pwa-install-element flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 shadow-xs active:scale-95 cursor-pointer"
              >
                <Smartphone size={14} className="shrink-0" />
                <span>{t.nav.installApp}</span>
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition shrink-0"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile & Tablet Dropdown ── */}
        {isOpen && (
          <div className="xl:hidden border-t border-gray-100 py-2 space-y-1 max-h-[80vh] overflow-y-auto">
            {/* 🌐 Indian Languages Selector in Drawer */}
            <LanguageSelector variant="drawer" />

            {/* Quick Install Banner in Drawer */}
            {!isInstalled && (
              <button
                data-pwa-install="true"
                onClick={() => {
                  setIsOpen(false);
                  setShowInstallModal(true);
                }}
                className="pwa-install-element w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 whitespace-nowrap transition shadow-sm mb-1.5 cursor-pointer"
              >
                <Smartphone size={16} />
                <span>📲 {t.nav.installApp} (૧-ક્લિક)</span>
              </button>
            )}

            {/* 🔐 Citizen 2FA Session / Login Banner in Mobile Drawer */}
            {citizenSession ? (
              <Link
                href="/track"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 mb-2 shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>પ્રમાણિત સત્ર: {citizenSession.citizenNameGu || citizenSession.citizenName}</span>
                </span>
                <span className="text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">વોલ્ટ જુઓ →</span>
              </Link>
            ) : (
              <Link
                href="/track"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200 mb-2 shadow-xs"
              >
                <Lock size={14} className="text-orange-600" />
                <span>નાગરિક 2FA લૉગિન (સુરક્ષિત વોલ્ટ)</span>
              </Link>
            )}

            {navLinks.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavClick(e, href);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                    active
                      ? "bg-orange-50 text-orange-600 font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}
            <a
              href="tel:14567"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-orange-600 hover:bg-orange-50 whitespace-nowrap transition"
            >
              <Phone size={17} className="shrink-0" />
              <span>{t.nav.helpline} – 14567 (Free 24/7)</span>
            </a>
          </div>
        )}
      </div>

      {/* 📱 Interactive Install App Modal with QR Code Scanner */}
      {!isInstalled && (
        <InstallAppModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
        />
      )}
    </nav>
  );
}
