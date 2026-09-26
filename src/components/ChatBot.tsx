"use client";

import { useState, useRef, useEffect } from "react";
import { Message, ChatHistory } from "@/types";
import { SkeletonChatMessage } from "@/components/Skeleton";
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles } from "lucide-react";

const QUICK_SUGGESTIONS = [
  "PM Kisan Yojana શું છે?",
  "Ayushman Bharat કાર્ડ કેવી રીતે મળે?",
  "Mudra Loan eligibility",
  "રેશનકાર્ડમાં નામ ઉમેરવા શું જોઈએ?",
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "નમસ્તે! 🙏 હું NagrikSeva AI છું.\n\nહું તમને સરકારી યોજનાઓ, પાત્રતા, નિયમો અને જરૂરી દસ્તાવેજો શોધવામાં મદદ કરીશ.\n\nતમે ગુજરાતી, હિન્દી કે અંગ્રેજીમાં બોલીને (Mic 🎙️) અથવા ટાઈપ કરીને પૂછી શકો છો! 🇮🇳",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    // Never scroll on initial page mount/load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Scroll ONLY the interior chat container, never the browser window
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Voice Input (Speech to Text)
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("તમારા બ્રાઉઝરમાં વોઈસ ઈનપુટ સપોર્ટ નથી. કૃપા કરીને Chrome અથવા Edge વાપરો.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "gu-IN"; // Gujarati recognition
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto send speech input
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

  // Text to Speech (Audio voice output)
  const speakMessage = (text: string, index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~]/g, ""); // strip markdown
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Prefer Indian voices if available
    const voices = window.speechSynthesis.getVoices();
    const guVoice = voices.find((v) => v.lang.startsWith("gu") || v.lang.startsWith("hi"));
    if (guVoice) utterance.voice = guVoice;

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(index);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMessage: Message = { role: "user", text: msg, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const firstUserIndex = messages.findIndex((m) => m.role === "user");
      const history: ChatHistory[] = (firstUserIndex === -1 ? [] : messages.slice(firstUserIndex)).map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.reply ?? data.error ?? "Something went wrong.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "⚠️ જોડાણમાં ખામી આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        inputRef.current?.focus({ preventScroll: true });
      }
    }
  };

  return (
    <div className="flex flex-col h-[580px] sm:h-[620px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 p-3 sm:p-4 text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg flex-shrink-0">
            🤖
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-base leading-tight flex items-center gap-1.5">
              NagrikSeva AI <Sparkles size={13} className="text-yellow-300" />
            </h2>
            <p className="text-xs text-orange-100 truncate">
              સરકારી યોજના સહાયક (Voice & Multilingual Enabled)
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span className="text-xs text-white/80">Online</span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50 overscroll-contain"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm relative group ${
                msg.role === "user"
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
              }`}
            >
              {msg.text}

              {/* Audio Listen Button for AI response */}
              {msg.role === "model" && (
                <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">નાગરિકસેવા અવાજ</span>
                  <button
                    onClick={() => speakMessage(msg.text, i)}
                    title={isSpeaking === i ? "અવાજ બંધ કરો" : "સાંભળો (Listen)"}
                    className="inline-flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md font-medium transition"
                  >
                    {isSpeaking === i ? (
                      <>
                        <VolumeX size={12} className="text-red-500" /> બંધ કરો
                      </>
                    ) : (
                      <>
                        <Volume2 size={12} /> સાંભળો 🔊
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Skeleton while loading */}
        {loading && <SkeletonChatMessage />}
      </div>

      {/* ── Quick Suggestions ── */}
      {messages.length <= 2 && !loading && (
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="flex-shrink-0 text-xs bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-3 py-1.5 hover:bg-orange-100 active:scale-95 transition whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input + Voice Controls ── */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-2 items-center">
          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Listening... Click to stop" : "બોલીને પૂછો (Speak in Gujarati)"}
            className={`p-2.5 rounded-xl transition flex-shrink-0 ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600"
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={
              isListening
                ? "સાંભળી રહ્યું છે... બોલો (Listening in Gujarati)..."
                : "ગુજરાતી, હિન્દી કે અંગ્રેજીમાં લખો અથવા બોલો..."
            }
            className="flex-1 min-w-0 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-gray-400"
            disabled={loading}
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-95 flex items-center gap-1.5"
          >
            <Send size={15} />
            <span className="hidden sm:inline">મોકલો</span>
          </button>
        </div>

        {isListening && (
          <p className="text-[11px] text-red-500 mt-1.5 text-center font-medium animate-pulse">
            🎙️ તમારો અવાજ રેકોર્ડ થઈ રહ્યો છે... સ્પષ્ટ ગુજરાતીમાં બોલો...
          </p>
        )}
      </div>
    </div>
  );
}
