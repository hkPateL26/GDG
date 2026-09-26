"use client";
import Link from "next/link";
import { useState } from "react";
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
} from "lucide-react";
import dynamic from "next/dynamic";
import { useIsPwaInstalled } from "@/lib/usePwaInstall";
import LanguageSelector from "./LanguageSelector";

const InstallAppModal = dynamic(() => import("./InstallAppModal"), { ssr: false });

const NAV_LINKS = [
  { href: "/",                   label: "Home",           Icon: Home },
  { href: "/eligibility",         label: "પાત્રતા",         Icon: Sparkles },
  { href: "/verify-doc",          label: "📸 AI સ્કેનર",   Icon: Camera },
  { href: "/benefit-calculator",  label: "💰 લાભ ગણો",     Icon: IndianRupee },
  { href: "/schemes",            label: "Schemes",        Icon: LayoutGrid },
  { href: "/locator",            label: "કચેરી",          Icon: MapPin },
  { href: "/track",              label: "Track",          Icon: Search },
  { href: "/chat",               label: "AI Chat",        Icon: Bot },
];

export default function Navbar() {
  const { isInstalled } = useIsPwaInstalled();
  const [isOpen, setIsOpen] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b-2 border-orange-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <span className="text-2xl leading-none select-none">🇮🇳</span>
            <div className="min-w-0">
              <p className="font-bold text-gray-800 text-base leading-tight">
                Nagrik<span className="text-orange-500">Seva</span>{" "}
                <span className="text-green-600">AI</span>
              </p>
              <p className="text-[10px] text-gray-400 hidden sm:block truncate">
                Digital Public Infrastructure
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden xl:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    active
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                  }`}
                >
                  <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
            <a
              href="tel:14567"
              className="ml-2 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              <Phone size={13} />
              14567
            </a>

            {/* 🌐 Desktop Language Selector */}
            <div className="ml-1.5">
              <LanguageSelector variant="desktop" />
            </div>

            {/* 📱 Desktop Install App Button */}
            {!isInstalled && (
              <button
                data-pwa-install="true"
                onClick={() => setShowInstallModal(true)}
                className="pwa-install-element ml-1.5 flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
                title="મોબાઈલ એપ ઇન્સ્ટોલ કરો"
              >
                <Smartphone size={13} />
                એપ ઇન્સ્ટોલ
              </button>
            )}
          </div>

          {/* ── Mobile & Tablet Toggle ── */}
          <div className="xl:hidden flex items-center gap-1.5">
            {/* 🌐 Mobile Language Switcher */}
            <LanguageSelector variant="mobile-bar" />

            {!isInstalled && (
              <button
                data-pwa-install="true"
                onClick={() => setShowInstallModal(true)}
                className="pwa-install-element flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 cursor-pointer"
              >
                <Smartphone size={14} />
                ઇન્સ્ટોલ
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
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
                className="pwa-install-element w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition shadow-sm mb-1.5 cursor-pointer"
              >
                <Smartphone size={16} />
                📲 એપ ફોનમાં ઇન્સ્ટોલ કરો (૧-ક્લિક)
              </button>
            )}

            {NAV_LINKS.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? "bg-orange-50 text-orange-600 font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
            <a
              href="tel:14567"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-orange-600 hover:bg-orange-50 transition"
            >
              <Phone size={17} />
              હેલ્પલાઇન – 14567 (Free 24/7)
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
