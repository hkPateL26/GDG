"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Check, ChevronDown, X, Sparkles, Search } from "lucide-react";
import { INDIAN_LANGUAGES, IndianLanguage } from "@/lib/languages";
import { getStoredLanguage, applyLanguage, DEFAULT_LANGUAGE } from "@/lib/translation";

export default function LanguageSelector({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile-bar" | "drawer";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>(DEFAULT_LANGUAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedCode(getStoredLanguage());

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedCode(customEvent.detail);
      }
    };

    window.addEventListener("nagrikseva:languageChange", handleLangChange);
    return () => window.removeEventListener("nagrikseva:languageChange", handleLangChange);
  }, []);

  const currentLang =
    INDIAN_LANGUAGES.find((l) => l.code === selectedCode) || INDIAN_LANGUAGES[0];

  const handleSelectLanguage = (langCode: string) => {
    setSelectedCode(langCode);
    setIsOpen(false);
    applyLanguage(langCode);
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
      <div className="notranslate shrink-0" translate="no">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 bg-gray-100 hover:bg-orange-50 text-gray-800 border border-gray-300 px-2 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition active:scale-95 cursor-pointer"
          title="ભાષા બદલો / Change Language"
          aria-label="Change Language"
        >
          <Globe size={13} className="text-orange-600 shrink-0" />
          <span className="whitespace-nowrap">{currentLang.name}</span>
          <ChevronDown size={11} className="text-gray-500 shrink-0" />
        </button>

        {isOpen && renderModal()}
      </div>
    );
  }

  // Variant: Desktop Navigation Button
  return (
    <div className="notranslate shrink-0" translate="no">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-800 px-2 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition shadow-2xs active:scale-95 cursor-pointer"
        title="ભાષા બદલો / Select Indian Language"
      >
        <Globe size={14} className="text-orange-600 shrink-0" />
        <span className="font-semibold text-gray-900 whitespace-nowrap">{currentLang.name}</span>
        {currentLang.isDefault && (
          <span className="text-[9px] bg-green-100 text-green-800 px-1 py-0.2 rounded font-bold whitespace-nowrap">
            મૂળ
          </span>
        )}
        <ChevronDown size={12} className="text-gray-400 shrink-0" />
      </button>

      {isOpen && renderModal()}
    </div>
  );

  function renderModal() {
    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
        onClick={() => setIsOpen(false)}
      >
        <div
          ref={modalRef}
          className="bg-white text-gray-900 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative flex flex-col max-h-[88vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Indian Tricolor Ribbon */}
          <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-600 shrink-0" />

          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-green-600 p-0.5 shadow-sm flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-lg">
                  🌐
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                  ભારતીય ભાષાઓ (Select Language)
                </h3>
                <p className="text-[11px] text-gray-500">
                  બાય-ડિફોલ્ટ ગુજરાતી • આખા પોર્ટલનું લખાણ તમારી ભાષામાં બદલો
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 bg-gray-50 border-b border-gray-100 shrink-0">
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
          <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredLanguages.map((lang) => {
                const isSelected = selectedCode === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition cursor-pointer active:scale-98 ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-500 ring-2 ring-orange-400 shadow-sm"
                        : "bg-white hover:bg-gray-50/80 border-gray-200 hover:border-orange-200 shadow-2xs"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-gray-900">
                          {lang.name}
                        </span>
                        {lang.isDefault && (
                          <span className="text-[9px] font-bold bg-green-100 text-green-800 border border-green-300 px-1.5 py-0.5 rounded-full">
                            મૂળ ભાષા
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {lang.englishName} • <span className="text-gray-400">{lang.state}</span>
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-300" />
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
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 shrink-0">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles size={12} className="text-orange-500" />
              Digital Public Infrastructure (Bhashini)
            </span>
            <button
              onClick={() => handleSelectLanguage(DEFAULT_LANGUAGE)}
              className="text-[11px] text-orange-600 hover:underline font-bold"
            >
              ગુજરાતી પર પાછા જાઓ
            </button>
          </div>
        </div>
      </div>
    );
  }
}
