"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import GujaratiVoiceHotlineModal from "@/components/GujaratiVoiceHotlineModal";
import {
  HOTLINE_CURATED_TOPICS,
  HOTLINE_GOV_CONTACTS,
} from "@/lib/voice-hotline-engine";
import {
  Headphones,
  Mic,
  Volume2,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { triggerHaptic } from "@/lib/haptic";

export default function HotlinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>();

  const openHotlineWithPrompt = (prompt?: string) => {
    triggerHaptic("heavy");
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-600/30 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-600/50 backdrop-blur-sm border border-emerald-400/40 px-3.5 py-1 rounded-full text-xs font-bold mb-3 text-yellow-300">
                <Headphones size={15} />
                <span>ડિજિટલ પબ્લિક ઇન્ફ્રાસ્ટ્રક્ચર (DPI) વૉઇસ ગેટવે</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
                જન-સંવાદ વૉઇસ હેલ્પલાઇન
              </h1>
              <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed mb-6">
                ગ્રામીણ, વડીલો અને વાંચવા-લખવામાં મુશ્કેલી અનુભવતા નાગરિકો માટે ખાસ તૈયાર કરાયેલી ટુ-વે વૉઇસ સેવા. ફક્ત માઈક દબાવીને બોલો — AI તમને શુદ્ધ ગુજરાતીમાં બોલીને સમજાવશે.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openHotlineWithPrompt()}
                  className="inline-flex items-center gap-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black px-6 py-3.5 rounded-2xl shadow-xl transition-all active:scale-95 text-sm sm:text-base"
                >
                  <Mic size={20} className="text-slate-900" />
                  <span>વાતચીત શરૂ કરો (Start Voice Talk)</span>
                </button>
                <Link
                  href="/schemes"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3.5 rounded-2xl border border-white/20 transition text-sm"
                >
                  <span>બધી યોજનાઓ</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className="absolute right-4 -bottom-6 opacity-15 hidden sm:block pointer-events-none">
              <Headphones size={220} />
            </div>
          </div>

          {/* 6 Curated Voice Topics Grid */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <span>લોકપ્રિય સરકારી વિષયો (૧-ક્લિકમાં બોલીને સાંભળો)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  કોઈપણ પ્રશ્ન પર ટેપ કરો, AI તરત જ જવાબ બોલશે
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ગુજરાતી વાણી
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {HOTLINE_CURATED_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {topic.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => openHotlineWithPrompt(topic.spokenPromptGu)}
                        className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200 px-2 py-1 rounded-lg transition"
                      >
                        <Volume2 size={12} />
                        <span>સાંભળો</span>
                      </button>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-900 leading-snug">
                      "{topic.spokenPromptGu}"
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {topic.shortAnswerGu}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => openHotlineWithPrompt(topic.spokenPromptGu)}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Mic size={12} />
                      <span>બોલીને ચર્ચા કરો</span>
                    </button>
                    <Link
                      href={topic.actionUrl}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <span>{topic.actionLabelGu}</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory 24x7 Gujarat Toll-Free Helplines Strip */}
          <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <PhoneCall size={18} className="text-amber-700" />
              <h3 className="text-sm font-black text-amber-950">
                સત્તાવાર ગુજરાત સરકાર ટોલ-ફ્રી હેલ્પલાઇન નંબરો:
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
              <div className="p-3 bg-white rounded-2xl border border-amber-200 text-center">
                <div className="text-2xs text-slate-500">મુખ્યમંત્રી હેલ્પલાઇન</div>
                <a href={`tel:${HOTLINE_GOV_CONTACTS.cmHelpline}`} className="text-emerald-700 font-black text-sm">
                  {HOTLINE_GOV_CONTACTS.cmHelpline}
                </a>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-amber-200 text-center">
                <div className="text-2xs text-slate-500">કિસાન કોલ સેન્ટર</div>
                <a href={`tel:${HOTLINE_GOV_CONTACTS.farmerKisanCallCenter}`} className="text-emerald-700 font-black text-sm">
                  {HOTLINE_GOV_CONTACTS.farmerKisanCallCenter}
                </a>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-amber-200 text-center">
                <div className="text-2xs text-slate-500">આયુષ્માન ભારત હેલ્પલાઇન</div>
                <a href={`tel:${HOTLINE_GOV_CONTACTS.ayushmanTollFree}`} className="text-emerald-700 font-black text-sm">
                  {HOTLINE_GOV_CONTACTS.ayushmanTollFree}
                </a>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-amber-200 text-center">
                <div className="text-2xs text-slate-500">181 અભયમ મહિલા હેલ્પ</div>
                <a href={`tel:${HOTLINE_GOV_CONTACTS.womenHelpline}`} className="text-emerald-700 font-black text-sm">
                  {HOTLINE_GOV_CONTACTS.womenHelpline}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Modal */}
      <GujaratiVoiceHotlineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialQuery={selectedPrompt}
      />
    </>
  );
}
