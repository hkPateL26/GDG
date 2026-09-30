"use client";

import ChatBot from "@/components/ChatBot";
import Navbar from "@/components/Navbar";
import { useIsPwaInstalled } from "@/lib/usePwaInstall";

export default function ChatPage() {
  const { isStandalone } = useIsPwaInstalled();

  return (
    <div
      className={`fixed inset-x-0 top-0 ${
        isStandalone
          ? "bottom-[calc(4.45rem+env(safe-area-inset-bottom,0px))] sm:pb-20"
          : "bottom-0 sm:pb-0"
      } sm:static sm:h-auto sm:min-h-screen xl:pb-0 flex flex-col overflow-hidden sm:overflow-visible bg-slate-100 sm:bg-gradient-to-br sm:from-orange-50 sm:via-white sm:to-green-50 z-30 sm:z-auto`}
    >
      <Navbar />
      <main className="flex-1 min-h-0 overflow-hidden sm:overflow-visible p-0 sm:py-5 lg:py-6 sm:px-4 flex flex-col">
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto flex-1 min-h-0 flex flex-col h-full">
          {/* Desktop Heading - Hidden on mobile to let ChatBot header be the clean single native title */}
          <div className="hidden sm:block text-center mb-3 px-2">
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
              🤖 AI <span className="text-orange-500">Chat</span> Assistant
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              ગુજરાત જાહેર સેવા & સરકારી યોજના સહાયક (GRTSA ૨૦૧૩, NFSA ૨૦૧૩)
            </p>
          </div>

          {/* Full Height ChatBot View */}
          <div className="flex-1 min-h-0 w-full flex flex-col h-full">
            <ChatBot />
          </div>

          {/* Desktop Footer */}
          <div className="hidden sm:block mt-2.5 text-center text-xs text-gray-400">
            Powered by Google Gemini AI • 24/7 સત્તાવાર નાગરિક સહાય
          </div>
        </div>
      </main>
    </div>
  );
}
