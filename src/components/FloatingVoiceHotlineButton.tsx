"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Headphones, PhoneCall, Mic, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { triggerHaptic } from "@/lib/haptic";

const GujaratiVoiceHotlineModal = dynamic(
  () => import("./GujaratiVoiceHotlineModal"),
  { ssr: false }
);

export default function FloatingVoiceHotlineButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleOpenHotline = (e: CustomEvent<{ query?: string }>) => {
      if (e.detail?.query) {
        setInitialQuery(e.detail.query);
      }
      setIsOpen(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut: Shift + H to open Voice Hotline
      if (e.shiftKey && (e.key === "H" || e.key === "h")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("open-voice-hotline" as any, handleOpenHotline);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-voice-hotline" as any, handleOpenHotline);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Hide inside full-screen chat page to prevent screen clutter
  if (pathname === "/chat") return null;

  return (
    <>
      {/* Floating 1-Tap Voice Hotline Trigger Button */}
      <div
        className="fixed bottom-22 sm:bottom-6 left-4 z-40 print:hidden no-print print-hide select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          onClick={() => {
            triggerHaptic("heavy");
            setInitialQuery(undefined);
            setIsOpen(true);
          }}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl border-2 border-emerald-400/50 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
          aria-label="જન-સંવાદ હેલ્પલાઇન - AI સાથે બોલીને વાત કરો"
        >
          {/* Animated Pulsating Radar Ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />

          {/* Icon with glowing badge */}
          <div className="relative w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
            <Headphones size={18} className="animate-pulse" />
          </div>

          {/* Bilingual Text Label */}
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-xs font-black tracking-wide text-white flex items-center gap-1">
              <span>જન-સંવાદ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping inline-block" />
            </span>
            <span className="text-2xs text-emerald-100 font-semibold">
              વૉઇસ હેલ્પલાઇન
            </span>
          </div>

          <Mic size={15} className="text-yellow-300 shrink-0 ml-0.5 animate-bounce" />
        </button>

        {/* Hover / Accessibility Hint */}
        {isHovered && (
          <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-slate-900 text-white text-2xs rounded-xl shadow-xl border border-slate-700 animate-in fade-in duration-150 pointer-events-none">
            🎙️ <span className="font-bold">જન-સંવાદ વૉઇસ પોર્ટલ:</span> કોઈપણ સરકારી યોજના વિશે સીધું બોલીને પૂછો (Shift+H)
          </div>
        )}
      </div>

      {/* The Hotline Modal */}
      <GujaratiVoiceHotlineModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialQuery={initialQuery}
      />
    </>
  );
}
