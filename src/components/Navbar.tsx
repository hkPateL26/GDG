"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home, LayoutGrid, FileText, Search, Bot, Phone, Menu, X,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/",          label: "Home",         Icon: Home },
  { href: "/schemes",   label: "Schemes",       Icon: LayoutGrid },
  { href: "/documents", label: "Documents",     Icon: FileText },
  { href: "/track",     label: "Track",         Icon: Search },
  { href: "/chat",      label: "AI Chat",       Icon: Bot },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b-2 border-orange-500 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
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
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                  }`}
                >
                  <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
            <a
              href="tel:14567"
              className="ml-2 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              <Phone size={14} />
              Helpline
            </a>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile Dropdown ── */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 py-2 space-y-0.5">
            {NAV_LINKS.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    active
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
            <a
              href="tel:14567"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-orange-600 hover:bg-orange-50 transition"
            >
              <Phone size={18} />
              Helpline – 14567
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
