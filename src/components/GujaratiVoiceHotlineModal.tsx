"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  Sparkles,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  Activity,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  HOTLINE_CURATED_TOPICS,
  HOTLINE_GOV_CONTACTS,
  resolveVoiceHotlineQuery,
  cleanTextForVoicePlayback,
  VoiceHotlineTopic,
} from "@/lib/voice-hotline-engine";
import { triggerHaptic } from "@/lib/haptic";
import { useLanguage } from "@/context/LanguageContext";

interface GujaratiVoiceHotlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

type HotlineState = "idle" | "listening" | "thinking" | "speaking" | "error";

export default function GujaratiVoiceHotlineModal({
  isOpen,
  onClose,
  initialQuery,
}: GujaratiVoiceHotlineModalProps) {
  const { currentLang } = useLanguage();
  const [status, setStatus] = useState<HotlineState>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [spokenReply, setSpokenReply] = useState<string>("");
  const [actionUrl, setActionUrl] = useState<string | undefined>();
  const [actionLabel, setActionLabel] = useState<string | undefined>();
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "hotline"; text: string; time: string }>
  >([]);

  // Audio References
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const speechBlobUrlRef = useRef<string | null>(null);

  // Stop any active speech synthesis and audio element
  const stopAllAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (speechBlobUrlRef.current) {
      URL.revokeObjectURL(speechBlobUrlRef.current);
      speechBlobUrlRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Web Speech Fallback synthesis
  const speakWithWebSpeech = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setStatus("idle");
        return;
      }

      window.speechSynthesis.cancel();
      const clean = cleanTextForVoicePlayback(text, currentLang as any);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = currentLang === "hi" ? "hi-IN" : currentLang === "en" ? "en-IN" : "gu-IN";
      utterance.rate = speechRate;

      // Select regional voice
      const voices = window.speechSynthesis.getVoices();
      const match =
        voices.find((v) => v.lang.toLowerCase().includes("gu")) ||
        voices.find((v) => v.lang.toLowerCase().includes("hi")) ||
        voices.find((v) => v.lang.toLowerCase().includes("in"));
      if (match) utterance.voice = match;

      utterance.onstart = () => setStatus("speaking");
      utterance.onend = () => setStatus("idle");
      utterance.onerror = () => setStatus("idle");

      window.speechSynthesis.speak(utterance);
    },
    [currentLang, speechRate]
  );

  // Stream high-fidelity Gujarati Audio from /api/tts
  const playHotlineAudio = useCallback(
    async (text: string) => {
      stopAllAudio();
      setStatus("speaking");

      try {
        const clean = cleanTextForVoicePlayback(text, currentLang as any);
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: clean,
            lang: currentLang === "hi" ? "hi" : currentLang === "en" ? "en" : "gu",
          }),
        });

        if (!res.ok) {
          throw new Error("TTS endpoint returned non-200");
        }

        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        speechBlobUrlRef.current = audioUrl;

        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        audio.playbackRate = speechRate;

        audio.onended = () => {
          setStatus("idle");
          stopAllAudio();
        };

        audio.onerror = () => {
          speakWithWebSpeech(clean);
        };

        await audio.play();
      } catch (err) {
        console.warn("Hotline audio fallback to Web Speech:", err);
        speakWithWebSpeech(text);
      }
    },
    [currentLang, speechRate, stopAllAudio, speakWithWebSpeech]
  );

  // Process civic query
  const processQuery = useCallback(
    async (queryText: string) => {
      if (!queryText.trim()) return;

      triggerHaptic("medium");
      setStatus("thinking");
      setTranscript(queryText);
      setErrorMessage("");

      const now = new Date().toLocaleTimeString("gu-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setConversationHistory((prev) => [
        ...prev,
        { role: "user", text: queryText, time: now },
      ]);

      try {
        // 1. First consult local DPI Knowledge Base
        const resolved = resolveVoiceHotlineQuery(
          queryText,
          currentLang === "hi" ? "hi" : currentLang === "en" ? "en" : "gu"
        );

        setSpokenReply(resolved.displayText);
        setActionUrl(resolved.actionUrl);
        setActionLabel(resolved.actionLabel);

        setConversationHistory((prev) => [
          ...prev,
          { role: "hotline", text: resolved.displayText, time: now },
        ]);

        // Speak the response aloud in Gujarati
        await playHotlineAudio(resolved.spokenText);
      } catch (err) {
        console.error("Hotline query resolution error:", err);
        const fallbackText =
          "માફ કરશો, નેટવર્ક અથવા વાણી ઓળખમાં વિલંબ થયો છે. કૃપા કરીને ફરીથી માઈક દબાવીને પૂછો.";
        setSpokenReply(fallbackText);
        setStatus("idle");
      }
    },
    [currentLang, playHotlineAudio]
  );

  // Start speech listening
  const startListening = useCallback(() => {
    stopAllAudio();
    triggerHaptic("heavy");
    setErrorMessage("");

    if (typeof window === "undefined") return;

    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: any;
      webkitSpeechRecognition?: any;
    };
    const SpeechRecognition =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        "તમારા બ્રાઉઝરમાં માઈક્રોફોન વાણી ઓળખ સપોર્ટ નથી. નીચે આપેલા પ્રશ્નોમાંથી ૧-ક્લિક કરીને સાંભળો."
      );
      setStatus("idle");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang =
        currentLang === "hi" ? "hi-IN" : currentLang === "en" ? "en-IN" : "gu-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setStatus("listening");
        setTranscript("હું સાંભળી રહ્યો છું... બોલો...");
      };

      recognition.onresult = (event: any) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
        if (event.results[0].isFinal) {
          recognition.stop();
          processQuery(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMessage(
            "માઈક્રોફોનની પરવાનગી નકારી દીધી છે. કૃપા કરીને બ્રાઉઝર સેટિંગ્સમાં પરવાનગી આપો."
          );
        } else {
          setErrorMessage("અવાજ ઓળખવામાં મુશ્કેલી આવી. કૃપા કરીને ફરી બોલો.");
        }
        setStatus("idle");
      };

      recognition.onend = () => {
        if (status === "listening") {
          setStatus("idle");
        }
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setStatus("idle");
    }
  }, [currentLang, processQuery, status, stopAllAudio]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setStatus("idle");
  }, []);

  // Handle modal lifecycle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialQuery) {
        processQuery(initialQuery);
      } else {
        // Welcome greeting on open
        setTranscript("નમસ્તે! હું ગુજરાત જન-સંવાદ સહાયક છું.");
        setSpokenReply(
          "નમસ્તે! સરકારી યોજનાઓ, સહાય કે દાખલાઓ વિશે જાણવા માટે નીચે આપેલું માઈક બટન દબાવીને બોલો."
        );
      }
    } else {
      stopAllAudio();
      stopListening();
      document.body.style.overflow = "unset";
    }

    return () => {
      stopAllAudio();
      stopListening();
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialQuery, processQuery, stopAllAudio, stopListening]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotline-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border-2 border-emerald-500/30 overflow-hidden">
        {/* ── HEADER ── */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner text-yellow-300">
              <Headphones size={26} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="hotline-title" className="text-lg sm:text-xl font-black tracking-tight">
                  જન-સંવાદ હેલ્પલાઇન
                </h2>
                <span className="bg-emerald-500/30 text-emerald-100 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  લાઈવ વૉઇસ
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium">
                કોઈપણ યોજના વિશે બોલીને પૂછો — AI ગુજરાતીમાં બોલીને સમજાવશે
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAllAudio();
              stopListening();
              onClose();
            }}
            aria-label="હેલ્પલાઇન બંધ કરો"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── BODY SCROLL AREA ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/60">
          {/* Main Visualizer & Two-Way Status */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            {/* Background Soundwave Ripple Effect */}
            {status === "listening" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full bg-red-400/20 animate-ping" />
                <div className="w-64 h-64 rounded-full bg-red-300/10 animate-pulse" />
              </div>
            )}
            {status === "speaking" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full bg-emerald-400/20 animate-ping" />
                <div className="w-64 h-64 rounded-full bg-teal-300/10 animate-pulse" />
              </div>
            )}

            {/* Pulsating Microphone Button */}
            <div className="relative z-10 my-2">
              <button
                type="button"
                onClick={() => {
                  if (status === "listening") {
                    stopListening();
                  } else if (status === "speaking") {
                    stopAllAudio();
                    setStatus("idle");
                  } else {
                    startListening();
                  }
                }}
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 ${
                  status === "listening"
                    ? "bg-red-600 text-white ring-8 ring-red-200 scale-105"
                    : status === "speaking"
                    ? "bg-emerald-600 text-white ring-8 ring-emerald-200"
                    : status === "thinking"
                    ? "bg-amber-500 text-white ring-8 ring-amber-200 animate-spin"
                    : "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white hover:scale-105 ring-4 ring-emerald-100"
                }`}
                aria-label={
                  status === "listening"
                    ? "સાંભળવાનું રોકો"
                    : status === "speaking"
                    ? "અવાજ બંધ કરો"
                    : "બોલવા માટે માઈક શરૂ કરો"
                }
              >
                {status === "listening" ? (
                  <>
                    <Mic size={36} className="animate-bounce" />
                    <span className="text-xs font-black mt-1">રોકો</span>
                  </>
                ) : status === "speaking" ? (
                  <>
                    <Volume2 size={36} className="animate-pulse" />
                    <span className="text-xs font-black mt-1">બોલે છે</span>
                  </>
                ) : status === "thinking" ? (
                  <Activity size={36} />
                ) : (
                  <>
                    <Mic size={36} />
                    <span className="text-xs font-black mt-1">બોલો</span>
                  </>
                )}
              </button>
            </div>

            {/* Current Status Badge */}
            <div className="mt-3">
              {status === "listening" && (
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-1.5 rounded-full text-xs font-bold border border-red-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  હું ધ્યાનથી સાંભળી રહ્યો છું... ગુજરાતીમાં બોલો
                </div>
              )}
              {status === "thinking" && (
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold border border-amber-300">
                  <Activity size={14} className="animate-spin text-amber-700" />
                  તમારી યોજના અને કાનૂની માહિતી શોધી રહ્યો છું...
                </div>
              )}
              {status === "speaking" && (
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-300">
                  <Volume2 size={14} className="text-emerald-700 animate-pulse" />
                  AI સહાયક જવાબ આપી રહ્યો છે... સાંભળો
                </div>
              )}
              {status === "idle" && (
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-xs font-bold border border-slate-200">
                  <Sparkles size={14} className="text-amber-500" />
                  વાતચીત શરૂ કરવા મોટા માઈક્રોફોન પર ટેપ કરો
                </div>
              )}
            </div>

            {/* Error Notice */}
            {errorMessage && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 text-left">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Transcript & Spoken Dialog Card */}
          {(transcript || spokenReply) && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              {/* User Spoken Input Bubble */}
              {transcript && (
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl rounded-tr-xs p-3.5 max-w-[85%] text-right shadow-2xs">
                    <div className="text-xs font-bold text-emerald-800 mb-1 flex items-center justify-end gap-1.5">
                      <span>તમે પૂછ્યું (You Asked)</span>
                      <Mic size={12} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      "{transcript}"
                    </p>
                  </div>
                </div>
              )}

              {/* AI Spoken Answer Bubble */}
              {spokenReply && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-black">
                    AI
                  </div>
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 flex-1 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <Volume2 size={13} className="text-emerald-600" />
                        જન-સંવાદ ઉત્તર (Jan-Samvaad Voice Reply)
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => playHotlineAudio(spokenReply)}
                          className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 flex items-center gap-1 transition active:scale-95 shadow-2xs"
                          title="ફરીથી સાંભળો"
                        >
                          <RotateCcw size={11} /> ફરી સાંભળો
                        </button>
                        {status === "speaking" && (
                          <button
                            type="button"
                            onClick={() => {
                              stopAllAudio();
                              setStatus("idle");
                            }}
                            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-1 transition"
                            title="અવાજ બંધ કરો"
                          >
                            <VolumeX size={11} /> બંધ
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {spokenReply}
                    </p>

                    {/* Direct Action Link if scheme matched */}
                    {actionUrl && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                          સત્તાવાર સેવા લિંક:
                        </span>
                        <Link
                          href={actionUrl}
                          onClick={() => {
                            stopAllAudio();
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs transition active:scale-95"
                        >
                          <span>{actionLabel || "અહીંથી અરજી કરો"}</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── 1-CLICK CURATED VOICE TOPICS (For rural & elderly citizens) ── */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles size={13} className="text-amber-500" />
                લોકપ્રિય સરકારી પ્રશ્નો (૧-ક્લિકમાં સાંભળો)
              </h3>
              <span className="text-2xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                ટેપ કરીને સાંભળો
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HOTLINE_CURATED_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => processQuery(topic.spokenPromptGu)}
                  className="p-3 text-left rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all group flex items-start gap-2.5 active:scale-98 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 flex items-center justify-center shrink-0 border border-slate-200 transition-colors shadow-2xs">
                    <Volume2 size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 line-clamp-2 leading-snug">
                      {topic.spokenPromptGu}
                    </div>
                    <div className="text-2xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>સાંભળો & વિગત</span>
                      <ChevronRight size={10} className="group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Speech Speed & Accessibility Controls */}
          <div className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">વાણી ઝડપ (Voice Speed):</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSpeechRate(0.85)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    speechRate === 0.85
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  ધીમી (0.85x)
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechRate(1.0)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    speechRate === 1.0
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  સામાન્ય (1.0x)
                </button>
              </div>
            </div>
            <div className="text-2xs text-slate-500 flex items-center gap-1 font-medium">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>GRTPSA 2013</span>
            </div>
          </div>

          {/* Emergency Official Gujarat Toll-Free Helplines */}
          <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/80 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-amber-900 flex items-center gap-1.5">
                <PhoneCall size={13} className="text-amber-700" />
                સત્તાવાર સરકારી ટોલ-ફ્રી હેલ્પલાઇન નંબરો:
              </span>
              <span className="text-2xs font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                24x7
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-2xs font-bold">
              <a
                href={`tel:${HOTLINE_GOV_CONTACTS.cmHelpline}`}
                className="p-1.5 bg-white rounded-xl border border-amber-200 text-slate-800 hover:text-amber-800"
              >
                CM હેલ્પલાઇન: <span className="text-emerald-700">{HOTLINE_GOV_CONTACTS.cmHelpline}</span>
              </a>
              <a
                href={`tel:${HOTLINE_GOV_CONTACTS.farmerKisanCallCenter}`}
                className="p-1.5 bg-white rounded-xl border border-amber-200 text-slate-800 hover:text-amber-800"
              >
                કિસાન કોલ: <span className="text-emerald-700">{HOTLINE_GOV_CONTACTS.farmerKisanCallCenter}</span>
              </a>
              <a
                href={`tel:${HOTLINE_GOV_CONTACTS.ayushmanTollFree}`}
                className="p-1.5 bg-white rounded-xl border border-amber-200 text-slate-800 hover:text-amber-800"
              >
                આયુષ્માન: <span className="text-emerald-700">{HOTLINE_GOV_CONTACTS.ayushmanTollFree}</span>
              </a>
              <a
                href={`tel:${HOTLINE_GOV_CONTACTS.womenHelpline}`}
                className="p-1.5 bg-white rounded-xl border border-amber-200 text-slate-800 hover:text-amber-800"
              >
                મહિલા હેલ્પલાઇન: <span className="text-emerald-700">{HOTLINE_GOV_CONTACTS.womenHelpline}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── FOOTER BAR ── */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span className="font-semibold">ગુજરાત જન-સંવાદ વૉઇસ પોર્ટલ (DPI v2.9.8)</span>
          </div>
          <button
            onClick={() => {
              stopAllAudio();
              stopListening();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
          >
            બંધ કરો (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
