"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Bot,
  Phone,
  Menu,
  X,
  MapPin,
  IndianRupee,
  Smartphone,
  Lock,
  ChevronDown,
  User,
  Building2,
  Search,
  FolderLock,
  ClipboardCheck,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useIsPwaInstalled } from "@/lib/usePwaInstall";
import { useLanguage } from "@/context/LanguageContext";
import { DEFAULT_LANGUAGE } from "@/lib/translation";
import LanguageSelector from "./LanguageSelector";
import EnterpriseSystemHealthBar from "./EnterpriseSystemHealthBar";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

const InstallAppModal = dynamic(() => import("./InstallAppModal"), { ssr: false });

export default function Navbar() {
  const { isInstalled } = useIsPwaInstalled();
  const { currentLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  useBodyScrollLock(isOpen);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [citizenSession, setCitizenSession] = useState<{
    citizenNameGu?: string;
    citizenName?: string;
    mobile?: string;
  } | null>(null);
  const [officerSession, setOfficerSession] = useState<{
    name?: string;
    designation?: string;
    id?: string;
    role?: string;
  } | null>(null);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = () => {
      if (typeof window !== "undefined") {
        // 1. Citizen Session
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

        // 2. Officer Session
        const savedOfficer = sessionStorage.getItem("nagrik_officer_session");
        if (savedOfficer) {
          try {
            const parsed = JSON.parse(savedOfficer);
            setOfficerSession(parsed);
          } catch {
            setOfficerSession(null);
          }
        } else {
          setOfficerSession(null);
        }
      }
    };

    checkSession();
    window.addEventListener("storage", checkSession);
    window.addEventListener("nagrik_auth_change", checkSession);
    return () => {
      window.removeEventListener("storage", checkSession);
      window.removeEventListener("nagrik_auth_change", checkSession);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (currentLang !== DEFAULT_LANGUAGE) {
      e.preventDefault();
      window.location.href = href;
    }
  };

  const navLinks = [
    { href: "/",                   label: t.nav.home,        Icon: Home },
    { href: "/schemes",            label: t.nav.schemes,     Icon: LayoutGrid },
    { href: "/benefit-calculator",  label: t.nav.benefits,    Icon: IndianRupee },
    { href: "/locator",            label: t.nav.offices,     Icon: MapPin },
    { href: "/chat",               label: t.nav.chat,        Icon: Bot },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b-2 border-orange-500 sticky top-0 z-50 notranslate" translate="no" suppressHydrationWarning>
      <div className="w-full px-3 sm:px-6 lg:px-8">
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
          <div className="hidden xl:flex items-center gap-1.5 shrink-0">
            {navLinks.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                    active
                      ? "bg-orange-50 text-orange-600 font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                  }`}
                >
                  <Icon size={14} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                  <span suppressHydrationWarning>{label}</span>
                </Link>
              );
            })}

            <a
              href="tel:14567"
              className="ml-1 flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition shadow-xs"
              title="24/7 Helpline"
            >
              <Phone size={13} className="shrink-0" />
              14567
            </a>

            {/* 🌐 Desktop Language Selector */}
            <div className="ml-1 shrink-0">
              <LanguageSelector variant="desktop" />
            </div>

            {/* 🔐 Single Unified Entry (Login / Dashboard / Officer Desk) */}
            {officerSession ? (
              <Link
                href="/portal?mode=officer"
                className="ml-1.5 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border-2 border-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition shadow-xs hover:shadow"
                title="કચેરી એડમિન સ્ક્રુટિની ડેસ્ક ખોલો"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span className="max-w-[220px] truncate">
                  {officerSession.name || "કચેરી એડમિન"} (
                  {officerSession.role === "talati"
                    ? "તલાટી"
                    : officerSession.role === "district_collector"
                    ? "કલેક્ટર"
                    : officerSession.role === "sdm_prant"
                    ? "SDM/પ્રાંત"
                    : officerSession.role === "state_admin"
                    ? "મુખ્ય સચિવ"
                    : "મામલતદાર"}
                  )
                </span>
              </Link>
            ) : citizenSession ? (
              <Link
                href="/portal?mode=citizen"
                className="ml-1.5 flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition shadow-xs hover:shadow"
                title="તમારું નાગરિક પોર્ટલ અને વોલ્ટ ખોલો"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="max-w-[220px] truncate">{citizenSession.citizenNameGu || citizenSession.citizenName || "નાગરિક પોર્ટલ"} (વોલ્ટ)</span>
              </Link>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setShowLoginDropdown(true)}
                onMouseLeave={() => setShowLoginDropdown(false)}
              >
                <button
                  type="button"
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="ml-1.5 flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition shadow-sm hover:shadow active:scale-95 cursor-pointer"
                  title="લૉગિન પોર્ટલ પસંદ કરો"
                >
                  <Lock size={13} className="shrink-0" />
                  <span>🔐 લૉગિન</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${showLoginDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu on Cursor Hover or Click */}
                {showLoginDropdown && (
                  <div className="absolute right-0 top-full pt-1.5 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 space-y-1">
                      {/* Option 1: Citizen Login */}
                      <Link
                        href="/portal?mode=citizen"
                        onClick={() => setShowLoginDropdown(false)}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-orange-50 transition group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition">
                          <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 text-xs">નાગરિક લૉગિન</span>
                            <span className="text-[9.5px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.2 rounded-full">2FA SSO</span>
                          </div>
                          <p className="text-[10.5px] text-gray-500 leading-snug mt-0.5">
                            આધાર OTP, અરજી ટ્રેકિંગ & ડિજિટલ વોલ્ટ
                          </p>
                        </div>
                      </Link>

                      <div className="border-t border-gray-100 my-1" />

                      {/* Option 2: Officer / Admin Login */}
                      <Link
                        href="/portal?mode=officer"
                        onClick={() => setShowLoginDropdown(false)}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 transition group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition">
                          <Building2 size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">અધિકારી / એડમિન લૉગિન</span>
                            <span className="text-[9.5px] bg-slate-900 text-amber-300 font-bold px-1.5 py-0.2 rounded-full">કચેરી</span>
                          </div>
                          <p className="text-[10.5px] text-gray-500 leading-snug mt-0.5">
                            તાલુકા મામલતદાર, અરજી સ્ક્રુટિની & મંજૂરી
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
                <span suppressHydrationWarning>{t.nav.installApp}</span>
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
                <span suppressHydrationWarning>{t.nav.installApp}</span>
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
          <div className="xl:hidden border-t border-gray-100 py-2.5 space-y-1.5 max-h-[80vh] overflow-y-auto">

            {/* 📌 વિશેષ નાગરિક સેવાઓ (Dedicated Services - Login is moved exclusively to Bottom Dock) */}
            <div className="space-y-1">
              <p className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider px-1">
                📌 નાગરિક સેવાઓ:
              </p>
              {[
                {
                  href: "/benefit-calculator",
                  label: currentLang === "en" ? "Eligibility & Benefit Calculator" : currentLang === "hi" ? "पात्रता और लाभ कैलकुलेटर" : "💰 લાભ ગણો (સહાય કેલ્ક્યુલેટર)",
                  Icon: IndianRupee,
                },
                {
                  href: "/track",
                  label: currentLang === "en" ? "Track Application Status" : currentLang === "hi" ? "आवेदन स्थिति ट्रैक करें" : "અરજી ટ્રેકિંગ (Track Status)",
                  Icon: Search,
                },
                {
                  href: "/documents",
                  label: currentLang === "en" ? "Digital Vault & Certificates" : currentLang === "hi" ? "डिजिटल वॉल्ट और दस्तावेज़" : "ડિજિટલ વોલ્ટ & પ્રમાણપત્રો",
                  Icon: FolderLock,
                },
                {
                  href: "/eligibility",
                  label: currentLang === "en" ? "Scheme Eligibility Check" : currentLang === "hi" ? "योजना पात्रता जांचें" : "યોજના પાત્રતા ચકાસો",
                  Icon: ClipboardCheck,
                },
              ].map(({ href, label, Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={(e) => {
                      setIsOpen(false);
                      handleNavClick(e, href);
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      active
                        ? "bg-orange-50 text-orange-600 font-bold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                    }`}
                  >
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} className="shrink-0 text-orange-600" />
                    <span suppressHydrationWarning>{label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <a
                href="tel:14567"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-orange-600 bg-orange-50/60 hover:bg-orange-100 whitespace-nowrap transition"
              >
                <Phone size={15} className="shrink-0 text-orange-600" />
                <span suppressHydrationWarning>{t.nav.helpline} – 14567 (Free 24/7)</span>
              </a>
            </div>
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
      <EnterpriseSystemHealthBar />
    </>
  );
}
