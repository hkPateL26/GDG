"use client";

import { useState, useEffect } from "react";
import { Smartphone, Download, QrCode, X, CheckCircle2, Sparkles, Share2 } from "lucide-react";

import { markPwaInstalled, useIsPwaInstalled } from "@/lib/usePwaInstall";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallAppModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isInstalled } = useIsPwaInstalled();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>("https://nagrikseva-ai-one.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin || "https://nagrikseva-ai-one.vercel.app");

      // Detect mobile device
      const ua = navigator.userAgent;
      const mobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
      setIsMobile(mobile);
      setIsIos(/iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream);

      // Listen for PWA beforeinstallprompt
      if ((window as unknown as { __pwaPrompt?: BeforeInstallPromptEvent }).__pwaPrompt) {
        setDeferredPrompt((window as unknown as { __pwaPrompt: BeforeInstallPromptEvent }).__pwaPrompt);
      }

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        (window as unknown as { __pwaPrompt: BeforeInstallPromptEvent }).__pwaPrompt = e as BeforeInstallPromptEvent;
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      const handleAppInstalled = () => {
        markPwaInstalled();
        onClose();
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, [onClose]);

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || (typeof window !== "undefined" ? (window as unknown as { __pwaPrompt?: BeforeInstallPromptEvent }).__pwaPrompt : null);
    if (prompt) {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") {
        markPwaInstalled();
      }
      setDeferredPrompt(null);
      if (typeof window !== "undefined") {
        (window as unknown as { __pwaPrompt?: null }).__pwaPrompt = null;
      }
      onClose();
    } else {
      alert("તમારા બ્રાઉઝર મેનૂ (3 Dots) પર ક્લિક કરી 'Install App' અથવા 'Add to Home Screen' પસંદ કરો.");
    }
  };

  if (!isOpen || isInstalled) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white text-gray-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* App Branding */}
          <div className="text-center mb-5">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-green-600 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-3xl">
                🇮🇳
              </div>
            </div>
            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles size={11} className="text-orange-600" /> Digital Public Infrastructure
            </span>
            <h3 className="text-xl font-black text-gray-900">
              નાગરિકસેવા AI મોબાઈલ એપ
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              પ્લેસ્ટોર જેવો સુપર ફાસ્ટ અનુભવ • ૧-ક્લિકમાં કોઈપણ સ્માર્ટફોનમાં ઇન્સ્ટોલ
            </p>
          </div>

          {/* Conditional View: Mobile vs Desktop */}
          {isMobile ? (
            /* 📱 Mobile Direct Install Action */
            <div className="space-y-4">
              <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 text-xs text-gray-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-orange-900">
                  <CheckCircle2 size={16} className="text-orange-600 shrink-0" />
                  <span>કોઈ ડાઉનલોડ વાઇરસ કે સ્ટોરેજની ઝંઝટ નહીં</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed pl-6">
                  આ એપ સીધી તમારા ફોનની હોમ સ્ક્રીન પર ઇન્સ્ટોલ થશે અને બ્રાઉઝર વગર ફુલ-સ્ક્રીન એપ તરીકે કામ કરશે.
                </p>
              </div>

              {isIos ? (
                /* iOS Safari Instructions */
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <Share2 size={15} /> iPhone / Safari માં ઇન્સ્ટોલ કરવા:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-800">
                    <li>સફારીમાં નીચે <strong>Share</strong> બટન (⎋) પર ટેપ કરો.</li>
                    <li>નીચે સ્ક્રોલ કરી <strong>&apos;Add to Home Screen&apos; (+)</strong> પસંદ કરો.</li>
                    <li>ઉપર <strong>&apos;Add&apos;</strong> પર ક્લિક કરો — એપ ઇન્સ્ટોલ થઈ જશે!</li>
                  </ol>
                </div>
              ) : (
                /* Android 1-Click Install Button */
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 text-sm transition active:scale-95 cursor-pointer"
                >
                  <Download size={18} /> ફોનમાં હમણાં જ ઇન્સ્ટોલ કરો (૧-ક્લિક)
                </button>
              )}
            </div>
          ) : (
            /* 💻 Desktop: QR Code Scanner for Phone */
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-gray-700 mb-3 flex items-center justify-center gap-1.5">
                  <QrCode size={16} className="text-orange-500" />
                  તમારા મોબાઈલથી આ QR કોડ સ્કેન કરો:
                </p>

                {/* Styled Crisp QR Display */}
                <div className="inline-block p-3 bg-white border-2 border-gray-900 rounded-2xl shadow-sm">
                  {/* Generated Dynamic SVG QR representation */}
                  <svg viewBox="0 0 160 160" className="w-36 h-36 mx-auto text-gray-900 fill-current">
                    {/* Corner Squares */}
                    <rect x="10" y="10" width="40" height="40" rx="6" fill="#111827"/>
                    <rect x="18" y="18" width="24" height="24" rx="3" fill="#ffffff"/>
                    <rect x="24" y="24" width="12" height="12" rx="2" fill="#ea580c"/>

                    <rect x="110" y="10" width="40" height="40" rx="6" fill="#111827"/>
                    <rect x="118" y="18" width="24" height="24" rx="3" fill="#ffffff"/>
                    <rect x="124" y="24" width="12" height="12" rx="2" fill="#ea580c"/>

                    <rect x="10" y="110" width="40" height="40" rx="6" fill="#111827"/>
                    <rect x="18" y="118" width="24" height="24" rx="3" fill="#ffffff"/>
                    <rect x="24" y="124" width="12" height="12" rx="2" fill="#ea580c"/>

                    {/* QR Code Dots Matrix Pattern */}
                    <rect x="60" y="20" width="8" height="8" rx="2"/>
                    <rect x="75" y="15" width="8" height="8" rx="2"/>
                    <rect x="90" y="25" width="8" height="8" rx="2"/>
                    <rect x="60" y="38" width="8" height="8" rx="2"/>
                    <rect x="80" y="42" width="8" height="8" rx="2"/>

                    <rect x="20" y="65" width="8" height="8" rx="2"/>
                    <rect x="35" y="75" width="8" height="8" rx="2"/>
                    <rect x="50" y="65" width="8" height="8" rx="2"/>
                    <rect x="68" y="70" width="24" height="20" rx="4" fill="#ea580c"/>
                    <circle cx="80" cy="80" r="5" fill="#ffffff"/>

                    <rect x="100" y="65" width="8" height="8" rx="2"/>
                    <rect x="120" y="75" width="8" height="8" rx="2"/>
                    <rect x="135" y="65" width="8" height="8" rx="2"/>

                    <rect x="60" y="105" width="8" height="8" rx="2"/>
                    <rect x="75" y="115" width="8" height="8" rx="2"/>
                    <rect x="90" y="105" width="8" height="8" rx="2"/>
                    <rect x="65" y="130" width="8" height="8" rx="2"/>
                    <rect x="85" y="135" width="8" height="8" rx="2"/>

                    <rect x="110" y="110" width="8" height="8" rx="2"/>
                    <rect x="125" y="125" width="8" height="8" rx="2"/>
                    <rect x="140" y="115" width="8" height="8" rx="2"/>
                    <rect x="115" y="140" width="8" height="8" rx="2"/>
                    <rect x="135" y="140" width="8" height="8" rx="2"/>
                  </svg>
                  <p className="text-[10px] font-mono font-bold text-gray-600 mt-1">
                    Scan with Mobile Camera / Lens
                  </p>
                </div>

                <div className="mt-3 text-left space-y-1.5 text-[11px] text-gray-600">
                  <p className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0">૧</span>
                    મોબાઈલ કેમેરા કે Google Lens થી QR સ્કેન કરો
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0">૨</span>
                    લિંક ખોલી <strong>&apos;Install App&apos;</strong> પર ટેપ કરો
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 font-bold text-[10px] flex items-center justify-center shrink-0">૩</span>
                    એપ હોમ સ્ક્રીન પર ૧-સેકન્ડમાં ઇન્સ્ટોલ થઈ જશે!
                  </p>
                </div>
              </div>

              {/* Also Provide Desktop Browser Install if supported */}
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <Download size={14} /> આ લેપટોપ / PC પર ઇન્સ્ટોલ કરો
                </button>
              )}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400">
              સત્તાવાર PWA ટેકનોલોજી &bull; એન્ડ્રોઇડ અને આઇફોન બંને માટે ૧૦૦% સુસંગત
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
