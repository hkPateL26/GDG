"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Globe, Check, ChevronDown, X, Sparkles, Search } from "lucide-react";
import { INDIAN_LANGUAGES } from "@/lib/languages";
import { useLanguage } from "@/context/LanguageContext";
import { DEFAULT_LANGUAGE } from "@/lib/translation";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

export default function LanguageSelector({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile-bar" | "drawer";
}) {
  const { currentLang: selectedCode, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  useBodyScrollLock(isOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const currentLang =
    INDIAN_LANGUAGES.find((l) => l.code === selectedCode) || INDIAN_LANGUAGES[0];

  const handleSelectLanguage = (langCode: string) => {
    setIsOpen(false);
    setLanguage(langCode);
  };

  const filteredLanguages = INDIAN_LANGUAGES.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.englishName.toLowerCase().includes(q) ||
      l.state.toLowerCase().includes(q)
    );
  });

  // Variant: Mobile Drawer Section (Horizontal pill buttons + more modal)
  if (variant === "drawer") {
    return (
      <div className="p-3 bg-gradient-to-br from-orange-50/70 to-green-50/70 border border-orange-200/60 rounded-2xl mb-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Globe size={14} className="text-orange-600" />
            ભાષા પસંદ કરો (Language)
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-white px-2 py-0.5 rounded-md border border-orange-200 shadow-2xs"
          >
            બધી {INDIAN_LANGUAGES.length} ભાષાઓ »
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {INDIAN_LANGUAGES.slice(0, 6).map((lang) => {
            const isSelected = selectedCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`text-center py-1.5 px-1 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? "bg-orange-600 text-white shadow-xs font-bold ring-2 ring-orange-300"
                    : "bg-white text-gray-700 hover:bg-orange-100/60 border border-gray-200"
                }`}
              >
                {lang.name}
              </button>
            );
          })}
        </div>

        {isOpen && renderModal()}
      </div>
    );
  }

  // Variant: Mobile Bar Compact Button
  if (variant === "mobile-bar") {
    return (
      <div className="shrink-0" suppressHydrationWarning>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 bg-slate-100 hover:bg-orange-50 text-slate-800 border border-slate-200/90 px-2.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition active:scale-95 cursor-pointer"
          title="ભાષા બદલો / Change Language"
          aria-label="Change Language"
          suppressHydrationWarning
        >
          <Globe size={13} className="text-orange-600 shrink-0" />
          <span className="whitespace-nowrap text-[11px]" suppressHydrationWarning>{currentLang.name}</span>
          <ChevronDown size={11} className="text-slate-500 shrink-0" />
        </button>

        {isOpen && renderModal()}
      </div>
    );
  }

  // Variant: Desktop Navigation Button
  return (
    <div className="shrink-0" suppressHydrationWarning>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-800 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition shadow-2xs active:scale-95 cursor-pointer"
        title="ભાષા બદલો / Select Indian Language"
        suppressHydrationWarning
      >
        <Globe size={14} className="text-orange-600 shrink-0" />
        <span className="font-semibold text-gray-900 whitespace-nowrap" suppressHydrationWarning>{currentLang.name}</span>
        {currentLang.isDefault && (
          <span className="text-[9px] bg-green-100 text-green-800 px-1 py-0.2 rounded font-bold whitespace-nowrap" suppressHydrationWarning>
            મૂળ
          </span>
        )}
        <ChevronDown size={12} className="text-gray-400 shrink-0" />
      </button>

      {isOpen && renderModal()}
    </div>
  );

  function renderModal() {
    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[9995] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
        onClick={() => setIsOpen(false)}
      >
        <div
          ref={modalRef}
          className="bg-white text-gray-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-gray-200 overflow-hidden relative flex flex-col max-h-[85vh] sm:max-h-[88vh] animate-bottom-sheet pb-[env(safe-area-inset-bottom,0px)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Native Mobile Bottom Sheet Drag Handle */}
          <div className="w-full pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
            <div className="w-11 h-1.5 bg-slate-300 rounded-full" />
          </div>

          {/* Indian Tricolor Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600 shrink-0" />

          {/* Modal Header */}
          <div className="px-4 py-3.5 sm:p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-green-600 p-0.5 shadow-xs flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-lg">
                  🌐
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-lg font-black text-gray-900 leading-tight truncate">
                  ભારતીય ભાષાઓ (Select Language)
                </h3>
                <p className="text-[11px] text-gray-500 truncate">
                  બાય-ડિફોલ્ટ ગુજરાતી • ૧ ક્લિકમાં ભાષા બદલો
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 bg-slate-50 border-b border-gray-100 shrink-0">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ભાષા શોધો / Search (Hindi, Marathi, Tamil, etc.)..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Languages Grid */}
          <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2 modal-scrollable">
            <div className="grid grid-cols-2 gap-2">
              {filteredLanguages.map((lang) => {
                const isSelected = selectedCode === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition cursor-pointer active:scale-96 ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-500 ring-2 ring-orange-400/60 shadow-xs"
                        : "bg-white hover:bg-gray-50/80 border-gray-200 hover:border-orange-200 shadow-2xs"
                    }`}
                  >
                    <div className="min-w-0 pr-1.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="font-extrabold text-xs sm:text-sm text-gray-900 truncate">
                          {lang.name}
                        </span>
                        {lang.isDefault && (
                          <span className="text-[8.5px] font-bold bg-green-100 text-green-800 border border-green-300 px-1.5 py-0.2 rounded-full whitespace-nowrap">
                            મૂળ
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-gray-500 truncate mt-0.5">
                        {lang.englishName}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredLanguages.length === 0 && (
              <div className="py-8 text-center text-xs text-gray-400">
                કોઈ મેળ ખાતી ભાષા મળી નથી. કૃપા કરીને બીજી ભાષા શોધો.
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 shrink-0">
            <span className="flex items-center gap-1 text-[11px] truncate">
              <Sparkles size={12} className="text-orange-500 shrink-0" />
              Digital Public Infrastructure (Bhashini)
            </span>
            <button
              onClick={() => handleSelectLanguage(DEFAULT_LANGUAGE)}
              className="text-[11px] text-orange-600 hover:underline font-bold whitespace-nowrap ml-2"
            >
              ગુજરાતી (Default)
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }
}
