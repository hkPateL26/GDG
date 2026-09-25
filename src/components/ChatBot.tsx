"use client";

import { useState, useRef, useEffect } from "react";
import { Message, ChatHistory } from "@/types";
import { SkeletonChatMessage } from "@/components/Skeleton";

const QUICK_SUGGESTIONS = [
  "PM Kisan Yojana શું છે?",
  "Ayushman Bharat",
  "Mudra Loan eligibility",
  "Ration Card documents",
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "નમસ્તે! 🙏 હું NagrikSeva AI છું.\n\nHello! I help you find government schemes, check eligibility & required documents.\n\nAsk me anything in Gujarati, Hindi or English! 🇮🇳",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMessage: Message = { role: "user", text: msg, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const history: ChatHistory[] = messages.map((m) => ({
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
        { role: "model", text: "⚠️ Connection error. Please try again.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
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
            <h2 className="font-bold text-base leading-tight">NagrikSeva AI</h2>
            <p className="text-xs text-orange-100 truncate">
              Government Schemes Assistant
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span className="text-xs text-white/80">Online</span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50 overscroll-contain">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                msg.role === "user"
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Skeleton while loading */}
        {loading && <SkeletonChatMessage />}

        <div ref={bottomRef} />
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

      {/* ── Input ── */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask in Gujarati, Hindi or English..."
            className="flex-1 min-w-0 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-gray-400"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-95"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
