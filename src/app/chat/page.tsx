"use client";

import ChatBot from "@/components/ChatBot";
import Navbar from "@/components/Navbar";

export default function ChatPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100dvh-4rem)] bg-gradient-to-br from-orange-50 via-white to-green-50 py-1.5 sm:py-5 lg:py-6 px-1.5 sm:px-4 flex flex-col justify-start">
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto flex-1 flex flex-col">
          <div className="text-center mb-1.5 sm:mb-4 px-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
              🤖 AI <span className="text-orange-500">Chat</span> Assistant
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
              ગુજરાત જાહેર સેવા & સરકારી યોજના સહાયક (GRTSA ૨૦૧૩, NFSA ૨૦૧૩)
            </p>
          </div>
          <div className="flex-1 w-full min-h-0 flex flex-col">
            <ChatBot />
          </div>
          <div className="mt-1.5 sm:mt-3 text-center text-[10px] sm:text-xs text-gray-400">
            Powered by Google Gemini AI • 24/7 સત્તાવાર નાગરિક સહાય
          </div>
        </div>
      </main>
    </>
  );
}
