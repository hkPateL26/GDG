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
import { useIsPwaInstalled, executeNativePwaInstall } from "@/lib/usePwaInstall";
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

  const handleInstallClick = async () => {
    // 1. Direct 1-Click native install on Android / Chromium
    const outcome = await executeNativePwaInstall();
    if (outcome === "installed" || outcome === "dismissed") {
      return;
    }
    // 2. If iOS Safari or desktop, open the guided modal
    setShowInstallModal(true);
  };
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
      <nav className="bg-white shadow-sm border-b-2 border-orange-500 sticky top-0 z-50" suppressHydrationWarning>
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* ── Logo ── */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center gap-2 min-w-0 shrink-0"
          >
            <img
              src="/icon.svg"
              alt="National Emblem"
              width="28"
              height="28"
              className="w-7 h-7 object-contain shrink-0"
            />
            <div className="min-w-0">
              <p className="font-extrabold text-gray-800 text-sm sm:text-base leading-tight whitespace-nowrap">
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
                onClick={handleInstallClick}
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
                onClick={handleInstallClick}
                className="pwa-install-element flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 shadow-xs active:scale-95 cursor-pointer"
                title="મોબાઈલ એપ ઇન્સ્ટોલ કરો"
              >
                <Smartphone size={13} className="shrink-0" />
                <span className="hidden sm:inline" suppressHydrationWarning>{t.nav.installApp}</span>
                <span className="sm:hidden text-[10.5px]" suppressHydrationWarning>ઇન્સ્ટોલ</span>
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-92 transition shrink-0 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </div>
      </nav>

      <EnterpriseSystemHealthBar />

      {/* ── Mobile & Tablet Native Bottom Sheet Drawer (GPay / DigiLocker Style) ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="xl:hidden fixed inset-0 z-[9990] bg-slate-950/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl shadow-2xl border-t border-slate-200 p-4 pb-[max(env(safe-area-inset-bottom,20px),20px)] space-y-3.5 animate-bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bottom Sheet Drag Handle */}
            <div className="w-full flex justify-center pb-0.5">
              <div className="w-11 h-1.5 bg-slate-300 rounded-full" />
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                📌 {currentLang === "en" ? "Quick Citizen Services" : currentLang === "hi" ? "त्वरित नागरिक सेवाएं" : "ઝડપી નાગરિક સેવાઓ"}
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2x2 Bento Quick Service Grid inside Bottom Sheet */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  href: "/benefit-calculator",
                  label: currentLang === "en" ? "Benefit Calculator" : currentLang === "hi" ? "लाभ कैलकुलेटर" : "લાભ ગણો (કેલ્ક્યુલેટર)",
                  sub: currentLang === "en" ? "Family Pass" : currentLang === "hi" ? "परिवार पास" : "કુટુંબ સહાય પાસ",
                  Icon: IndianRupee,
                  bg: "bg-emerald-50 border-emerald-200/80 text-emerald-700",
                },
                {
                  href: "/track",
                  label: currentLang === "en" ? "Track Status" : currentLang === "hi" ? "आवेदन ट्रैक करें" : "અરજી ટ્રેકિંગ",
                  sub: currentLang === "en" ? "Live SLA Stage" : currentLang === "hi" ? "लाइव स्थिति" : "લાઈવ સ્ટેટસ",
                  Icon: Search,
                  bg: "bg-blue-50 border-blue-200/80 text-blue-700",
                },
                {
                  href: "/documents",
                  label: currentLang === "en" ? "Document Guide" : currentLang === "hi" ? "दस्तावेज़ गाइड" : "દસ્તાવેજ ગાઈડ",
                  sub: currentLang === "en" ? "Ration & Health" : currentLang === "hi" ? "राशन व आयुष्मान" : "રેશન & આયુષ્માન",
                  Icon: FolderLock,
                  bg: "bg-purple-50 border-purple-200/80 text-purple-700",
                },
                {
                  href: "/eligibility",
                  label: currentLang === "en" ? "Check Eligibility" : currentLang === "hi" ? "पात्रता जांचें" : "પાત્રતા ચકાસો",
                  sub: currentLang === "en" ? "1-Min AI Check" : currentLang === "hi" ? "१ मिनट में जांचें" : "૧ મિનિટમાં ચેક",
                  Icon: ClipboardCheck,
                  bg: "bg-orange-50 border-orange-200/80 text-orange-700",
                },
              ].map(({ href, label, sub, Icon, bg }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={(e) => {
                      setIsOpen(false);
                      handleNavClick(e, href);
                    }}
                    className={`app-touch-card flex items-center gap-2.5 p-3 rounded-2xl border transition ${
                      active
                        ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                        : "bg-slate-50/90 hover:bg-slate-100 border-slate-200/80 text-slate-800"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                        active ? "bg-white/20 border-white/30 text-white" : bg
                      }`}
                    >
                      <Icon size={17} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold truncate leading-tight" suppressHydrationWarning>
                        {label}
                      </p>
                      <p
                        className={`text-[10px] truncate mt-0.5 ${
                          active ? "text-orange-100" : "text-slate-500"
                        }`}
                        suppressHydrationWarning
                      >
                        {sub}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-1">
              <a
                href="tel:14567"
                onClick={() => setIsOpen(false)}
                className="app-touch-card flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200/80 hover:bg-orange-100 whitespace-nowrap transition"
              >
                <Phone size={15} className="shrink-0 text-orange-600" />
                <span suppressHydrationWarning>{t.nav.helpline} – 14567 (Free 24/7)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 📱 Interactive Install App Modal with QR Code Scanner */}
      {!isInstalled && (
        <InstallAppModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
        />
      )}
    </>
  );
}
