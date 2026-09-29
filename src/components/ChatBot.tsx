"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message, ChatHistory } from "@/types";
import { SkeletonChatMessage } from "@/components/Skeleton";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Share2,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const SPEECH_LANG_MAP: Record<string, string> = {
  gu: "gu-IN",
  hi: "hi-IN",
  en: "en-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
  or: "or-IN",
  ur: "ur-IN",
  as: "as-IN",
  sa: "sa-IN",
  ne: "ne-NP",
};

interface CitizenSession {
  citizenName?: string;
  citizenNameGu?: string;
  mobile?: string;
  district?: string;
  taluka?: string;
  village?: string;
  aadhaarLast4?: string;
}

const CATEGORY_PROMPTS: Record<string, { label: string; query: string; icon: string }[]> = {
  gu: [
    { label: "ખેડૂત યોજનાઓ", query: "ખેડૂતો માટે PM કિસાન અને સબસિડીના સત્તાવાર કાયદા અને નિયમો શું છે?", icon: "🌾" },
    { label: "આયુષ્માન ભારત", query: "આયુષ્માન ભારત PM-JAY હેઠળ ₹10 લાખ કેશલેસ સારવારની પાત્રતા અને નિયમો શું છે?", icon: "🏥" },
    { label: "રેશનકાર્ડ સહાય", query: "રેશનકાર્ડમાં નવું નામ ઉમેરવા અથવા સુધારા માટે કયો કાયદો અને પુરાવા જોઈએ?", icon: "📜" },
    { label: "PM આવાસ યોજના", query: "PM આવાસ યોજના હેઠળ પાકા મકાન માટે ₹1.20 લાખ સહાયના નિયમો શું છે?", icon: "🏠" },
    { label: "અરજી ટ્રેકિંગ", query: "મારી અરજી APP-GUJ-8038 લાઈવ ટ્રેક કરો", icon: "🔍" },
  ],
  hi: [
    { label: "किसान योजनाएं", query: "किसानों के लिए PM किसान योजना और सब्सिडी के नियम क्या हैं?", icon: "🌾" },
    { label: "आयुष्मान भारत", query: "आयुष्मान भारत कार्ड के तहत ₹10 लाख मुफ्त इलाज के नियम और पात्रता क्या है?", icon: "🏥" },
    { label: "राशन कार्ड सेवा", query: "राशन कार्ड में नया नाम जोड़ने के लिए आवश्यक दस्तावेज क्या हैं?", icon: "📜" },
    { label: "PM आवास योजना", query: "PM आवास योजना के तहत मकान निर्माण सहायता के नियम क्या हैं?", icon: "🏠" },
    { label: "आवेदन ट्रैकिंग", query: "मेरा आवेदन APP-GUJ-8038 लाइव ट्रैक करें", icon: "🔍" },
  ],
  en: [
    { label: "Farmer Schemes", query: "What are the official rules and eligibility for PM Kisan Samman Nidhi?", icon: "🌾" },
    { label: "Ayushman Card", query: "How to check eligibility for Ayushman Bharat PM-JAY Rs 10 Lakh health cover?", icon: "🏥" },
    { label: "Ration Card", query: "What are the rules and documents to add a new member to Ration Card under NFSA?", icon: "📜" },
    { label: "Housing (PMAY)", query: "What are the eligibility criteria and subsidy under PM Awas Yojana?", icon: "🏠" },
    { label: "Track Application", query: "Track my application APP-GUJ-8038 status live", icon: "🔍" },
  ],
};

function renderFormattedMessage(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const renderInline = (str: string) => {
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(str)) !== null) {
        if (match.index > lastIndex) {
          parts.push(renderBold(str.substring(lastIndex, match.index), `txt-${lineIdx}-${lastIndex}`));
        }
        const linkText = match[1];
        const linkUrl = match[2];
        parts.push(
          <a
            key={`link-${lineIdx}-${match.index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 underline font-bold hover:text-orange-700 inline-flex items-center gap-0.5 break-all"
          >
            {linkText}
          </a>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < str.length) {
        parts.push(renderBold(str.substring(lastIndex), `txt-${lineIdx}-${lastIndex}`));
      }
      return parts;
    };

    const renderBold = (str: string, keyPrefix: string) => {
      const boldParts = str.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((sub, sIdx) => {
        if (sub.startsWith("**") && sub.endsWith("**")) {
          return (
            <strong key={`${keyPrefix}-b-${sIdx}`} className="font-extrabold text-slate-900">
              {sub.slice(2, -2)}
            </strong>
          );
        }
        return <span key={`${keyPrefix}-s-${sIdx}`}>{sub}</span>;
      });
    };

    return (
      <div key={`line-${lineIdx}`} className={line.trim() === "" ? "h-2" : "min-h-[1.25rem]"}>
        {renderInline(line)}
      </div>
    );
  });
}

export default function ChatBot() {
  const { currentLang } = useLanguage();
  const [citizenSession] = useState<CitizenSession | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("nagrik_citizen_session");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.citizen || parsed;
      }
    } catch {
      // graceful ignore
    }
    return null;
  });

  const getGreetingForLang = useCallback((lang: string, cit?: CitizenSession | null) => {
    const citizenName = cit?.citizenNameGu || cit?.citizenName;
    const greeting = citizenName ? `માનનીય ${citizenName}! ` : "";

    if (lang === "hi") {
      return (
        `${greeting}नमस्ते! 🙏 मैं NagrikSeva AI हूँ।\n\n` +
        `मैं आपको सरकारी योजनाओं, पात्रता, नियमों और आधिकारिक अधिनियमों (GRTSA 2013, NFSA 2013) के तहत प्रामाणिक जानकारी और आवेदन सहायता प्रदान करूँगा।\n\n` +
        `आप किसी भी योजना के बारे में पूछ सकते हैं या आवेदन संख्या (जैसे APP-GUJ-8038) लिखकर लाइव स्टेटस ट्रैक कर सकते हैं! 🇮🇳`
      );
    }
    if (lang === "en") {
      return (
        `${greeting}Namaste! 🙏 I am NagrikSeva AI.\n\n` +
        `I provide verified government scheme guidance, legal Act citations (GRTSA 2013, NFSA 2013), eligibility criteria, required documents, and live application tracking.\n\n` +
        `You can ask in English, Gujarati or Hindi, or type your application number (e.g., APP-GUJ-8038) to track status live! 🇮🇳`
      );
    }
    return (
      `${greeting}નમસ્તે! 🙏 હું NagrikSeva AI સત્તાવાર ઈ-ગવર્નન્સ સહાયક છું.\n\n` +
      `હું તમને સરકારી યોજનાઓ, પાત્રતા, નિયમો, અને કાનૂની અધિકારો (GRTSA ૨૦૧૩, NFSA ૨૦૧૩) ની પ્રમાણિત માહિતી અને દસ્તાવેજ સહાય આપીશ.\n\n` +
      `તમે બોલીને (Mic 🎙️) અથવા ટાઈપ કરીને પૂછી શકો છો, તેમજ તમારી અરજી (દા.ત. \`APP-GUJ-8038\`) પણ સીધી ચેટમાં જ ટ્રેક કરી શકો છો! 🇮🇳`
    );
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void; start: () => void; lang: string; continuous: boolean; interimResults: boolean; onstart: (() => void) | null; onresult: ((e: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null } | null>(null);
  const isInitialMount = useRef<boolean>(true);

  // Dynamic greeting matching current selected language until citizen sends a message
  const displayMessages: Message[] =
    messages.length === 0
      ? [
          {
            role: "model",
            text: getGreetingForLang(currentLang, citizenSession),
            timestamp: new Date(),
          },
        ]
      : messages;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [displayMessages.length, loading]);

  // Voice Input (Speech to Text strictly synced with current selected language)
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;

    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => NonNullable<typeof recognitionRef.current>;
      webkitSpeechRecognition?: new () => NonNullable<typeof recognitionRef.current>;
    };
    const SpeechRecognition =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("તમારા બ્રાઉઝરમાં વોઈસ ઈનપુટ સપોર્ટ નથી. કૃપા કરીને Chrome અથવા Edge વાપરો.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    // Strict Language Alignment
    const selectedLocale = SPEECH_LANG_MAP[currentLang] || "gu-IN";
    recognition.lang = selectedLocale;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      sendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Text to Speech (Audio voice output strictly synced with current selected language)
  const speakMessage = (text: string, index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~`]/g, ""); // strip markdown
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Strictly match the selected language
    const targetLocale = SPEECH_LANG_MAP[currentLang] || "gu-IN";
    utterance.lang = targetLocale;

    const voices = window.speechSynthesis.getVoices();
    const targetTag = targetLocale.slice(0, 2);
    // Prefer matching native language voice, or Indian English/Hindi voice fallback
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith(targetTag)) ||
      voices.find((v) => v.lang.includes("IN")) ||
      voices.find((v) => v.lang.toLowerCase().startsWith("hi"));

    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleShareWhatsApp = (msgText: string, appCard?: Message["applicationCard"]) => {
    let textToSend = `*🏛️ NagrikSeva AI - સત્તાવાર સરકારી સહાય*\n\n${msgText}\n\n`;
    if (appCard) {
      textToSend +=
        `📋 *અરજી ક્રમાંક:* ${appCard.id}\n` +
        `📌 *સ્થિતિ:* ${appCard.statusLabelGu}\n` +
        `🏢 *ડેસ્ક:* ${appCard.currentDeskGu}\n` +
        `⚖️ *કાયદો:* ${appCard.actCitation}\n\n`;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "https://nagrikseva-ai-one.vercel.app";
    textToSend += `🌐 સત્તાવાર પોર્ટલ: ${origin}/chat`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToSend)}`, "_blank");
  };

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMessage: Message = { role: "user", text: msg, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const firstUserIndex = displayMessages.findIndex((m) => m.role === "user");
      const history: ChatHistory[] = (firstUserIndex === -1 ? [] : displayMessages.slice(firstUserIndex)).map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history,
          language: currentLang,
          citizenContext: citizenSession
            ? {
                name: citizenSession.citizenName,
                nameGu: citizenSession.citizenNameGu,
                district: citizenSession.district,
                taluka: citizenSession.taluka,
                village: citizenSession.village,
                mobile: citizenSession.mobile,
                aadhaarLast4: citizenSession.aadhaarLast4,
              }
            : undefined,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.reply ?? data.error ?? "Something went wrong.",
          timestamp: new Date(),
          applicationCard: data.applicationCard,
          actionButtons: data.actionButtons,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "⚠️ નેટવર્ક જોડાણમાં વિલંબ થયો છે. ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ હેઠળ તમામ સેવાઓ જનસેવા કેન્દ્ર પર પણ ઉપલબ્ધ છે.",
          timestamp: new Date(),
          actionButtons: [
            { label: "💰 પાત્રતા કેલ્ક્યુલેટર", href: "/benefit-calculator", variant: "primary" },
            { label: "📍 કચેરી લોકેટર", href: "/locator", variant: "secondary" },
          ],
        },
      ]);
    } finally {
      setLoading(false);
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        inputRef.current?.focus({ preventScroll: true });
      }
    }
  };

  const activePills = CATEGORY_PROMPTS[currentLang] || CATEGORY_PROMPTS.gu;

  return (
    <div className="flex flex-col h-[620px] sm:h-[660px] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-700 p-3.5 sm:p-4 text-white flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0 border border-white/25 shadow-inner">
              🤖
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-sm sm:text-base leading-tight flex items-center gap-1.5 truncate">
                NagrikSeva AI <Sparkles size={14} className="text-yellow-300 shrink-0" />
              </h2>
              <p className="text-[11px] text-orange-100 truncate flex items-center gap-1">
                <span>સત્તાવાર ઈ-ગવર્નન્સ સહાયક &bull; {currentLang.toUpperCase()} Mode</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {citizenSession && (
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full border border-white/30 backdrop-blur-xs">
                <UserCheck size={11} className="text-amber-300" />
                {citizenSession.citizenNameGu || citizenSession.citizenName}
              </span>
            )}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 text-[11px] font-bold border border-white/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Top Guided Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-0.5 -mx-1 px-1 scrollbar-none">
          {activePills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={() => sendMessage(pill.query)}
              className="shrink-0 px-2.5 py-1 rounded-xl text-[10.5px] font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages Container ── */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-slate-50 overscroll-contain"
      >
        {displayMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-in fade-in duration-200`}
          >
            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-xs relative group ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none shadow-sm"
                  : "bg-white text-slate-800 rounded-bl-none border border-slate-200/80 shadow-2xs"
              }`}
            >
              {/* Message text */}
              {msg.role === "model" ? renderFormattedMessage(msg.text) : msg.text}

              {/* ── IN-CHAT LIVE APPLICATION TRACKING CARD ── */}
              {msg.role === "model" && msg.applicationCard && (
                <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-3 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 p-3 sm:p-4 rounded-2xl border-2 border-orange-400 shadow-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-orange-200 pb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl sm:text-2xl p-1 bg-white rounded-xl shadow-2xs border border-orange-200 shrink-0">
                        {msg.applicationCard.schemeEmoji}
                      </span>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] font-black bg-orange-600 text-white px-1.5 py-0.5 rounded-md">
                          {msg.applicationCard.id}
                        </span>
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 mt-0.5 truncate">
                          {msg.applicationCard.schemeNameGu}
                        </h4>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                        msg.applicationCard.status === "approved"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : msg.applicationCard.status === "rejected"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      }`}
                    >
                      {msg.applicationCard.statusLabelGu}
                    </span>
                  </div>

                  {/* 3-Stage Progress Stepper */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                      <span className="text-emerald-700">૧. ઓનલાઇન અરજી ✓</span>
                      <span className={msg.applicationCard.workflowStage >= 2 ? "text-emerald-700" : "text-slate-400"}>
                        ૨. કચેરી સ્ક્રુટિની {msg.applicationCard.workflowStage >= 2 ? "✓" : "⏳"}
                      </span>
                      <span className={msg.applicationCard.workflowStage >= 3 ? "text-emerald-700" : "text-slate-400"}>
                        ૩. આખરી મંજૂરી / e-Sign {msg.applicationCard.workflowStage >= 3 ? "✓" : "⏳"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(msg.applicationCard.workflowStage / msg.applicationCard.totalStages) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] pt-1">
                    <div className="bg-white/80 p-2 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[9.5px]">અધિકૃત ડેસ્ક:</span>
                      <span className="font-bold text-slate-800">{msg.applicationCard.currentDeskGu}</span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[9.5px]">કાનૂની અધિનિયમ:</span>
                      <span className="font-bold text-orange-700">{msg.applicationCard.actCitation}</span>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <Link
                      href={`/track?id=${encodeURIComponent(msg.applicationCard.id)}`}
                      className="flex-1 min-h-[38px] px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-1 shadow-xs transition"
                    >
                      <span>ટ્રેકિંગ વૉલ્ટમાં જુઓ</span>
                      <ArrowRight size={12} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(msg.text, msg.applicationCard)}
                      className="min-h-[38px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black flex items-center gap-1 shadow-xs transition cursor-pointer"
                    >
                      <span>WhatsApp સ્ટેટસ</span>
                      <Share2 size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── INTERACTIVE ACTION BUTTONS ── */}
              {msg.role === "model" && msg.actionButtons && msg.actionButtons.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                  {msg.actionButtons.map((btn, btnIdx) => (
                    <Link
                      key={btnIdx}
                      href={btn.href}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition shadow-2xs active:scale-95 ${
                        btn.variant === "primary"
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-slate-100 hover:bg-orange-50 text-slate-800 border border-slate-300 hover:border-orange-300"
                      }`}
                    >
                      <span>{btn.label}</span>
                      <ChevronRight size={12} />
                    </Link>
                  ))}
                </div>
              )}

              {/* ── BOTTOM UTILITY BAR (Voice Speak + WhatsApp Share) ── */}
              {msg.role === "model" && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck size={11} className="text-emerald-600" />
                    પ્રમાણિત સરકારી સહાય
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* WhatsApp Share Button */}
                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(msg.text, msg.applicationCard)}
                      title="આ માહિતી WhatsApp પર મેળવો"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold transition cursor-pointer"
                    >
                      <Share2 size={11} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    {/* Speech Voice Button */}
                    <button
                      type="button"
                      onClick={() => speakMessage(msg.text, i)}
                      title={isSpeaking === i ? "અવાજ બંધ કરો" : "સાંભળો (Listen in natural voice)"}
                      className="inline-flex items-center gap-1 text-[11px] text-orange-700 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-lg font-bold transition cursor-pointer"
                    >
                      {isSpeaking === i ? (
                        <>
                          <VolumeX size={12} className="text-rose-600 animate-spin" />
                          <span>બંધ કરો</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} />
                          <span>સાંભળો 🔊</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Skeleton while waiting for LLM */}
        {loading && <SkeletonChatMessage />}
      </div>

      {/* ── Input + Voice Controls ── */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex-shrink-0">
        <div className="flex gap-2 items-center">
          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "સાંભળી રહ્યું છે... બંધ કરવા ક્લિક કરો" : `બોલીને પૂછો (${currentLang.toUpperCase()} Voice)`}
            className={`p-2.5 rounded-2xl transition flex-shrink-0 cursor-pointer shadow-xs ${
              isListening
                ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-200"
                : "bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200"
            }`}
          >
            {isListening ? <MicOff size={19} /> : <Mic size={19} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={
              isListening
                ? `સ્પષ્ટ બોલો (${currentLang.toUpperCase()} Voice listening)...`
                : "સરકારી યોજના, નિયમો, અથવા અરજી નં (APP-GUJ-...) લખો/બોલો..."
            }
            className="flex-1 min-w-0 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-slate-400 bg-slate-50 focus:bg-white transition"
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-black transition active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Send size={15} />
            <span className="hidden sm:inline">મોકલો</span>
          </button>
        </div>

        {isListening && (
          <p className="text-[11px] text-rose-600 mt-1.5 text-center font-bold animate-pulse flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            તમારો અવાજ રેકોર્ડ થઈ રહ્યો છે... સ્પષ્ટ {currentLang.toUpperCase()} માં બોલો...
          </p>
        )}
      </div>
    </div>
  );
}
