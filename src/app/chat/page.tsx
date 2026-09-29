"use client";

import ChatBot from "@/components/ChatBot";
import Navbar from "@/components/Navbar";

export default function ChatPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl lg:max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              🤖 AI <span className="text-orange-500">Chat</span> Assistant
            </h1>
            <p className="text-gray-500 mt-1">
              Ask anything about government schemes in Gujarati, Hindi or English
            </p>
          </div>
          <ChatBot />
          <div className="mt-4 text-center text-xs text-gray-400">
            Powered by Google Gemini AI • Available 24/7 • Free to use
          </div>
        </div>
      </main>
    </>
  );
}
