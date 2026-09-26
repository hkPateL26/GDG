"use client";

import { useState, useEffect } from "react";
import { Download, X, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

const InstallAppModal = dynamic(() => import("./InstallAppModal"), { ssr: false });

export default function FloatingInstallBanner() {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Don't show if already in standalone app mode
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;

      const isDismissed = sessionStorage.getItem("pwa_install_banner_dismissed");

      if (!isStandalone && !isDismissed) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("pwa_install_banner_dismissed", "true");
  };

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:max-w-md sm:left-auto sm:right-6 animate-in slide-in-from-bottom duration-300">
          <div className="bg-gray-900 text-white p-3.5 rounded-2xl shadow-2xl border border-orange-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-green-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
                🇮🇳
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-white truncate flex items-center gap-1">
                  નાગરિકસેવા AI એપ
                  <span className="text-[9px] bg-orange-500/30 text-orange-400 border border-orange-500/30 px-1 rounded">PWA</span>
                </p>
                <p className="text-[10px] text-gray-300 truncate">
                  ફોનમાં ૧-ક્લિકમાં ઇન્સ્ટોલ કરો
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setShowModal(true)}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition shadow-sm cursor-pointer"
              >
                <Download size={13} /> ઇન્સ્ટોલ
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition"
                title="બંધ કરો"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Install Modal (QR Code for Desktop, Direct Prompt for Mobile) */}
      <InstallAppModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
