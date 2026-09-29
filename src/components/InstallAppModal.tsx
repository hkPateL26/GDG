"use client";

import { useState, useEffect } from "react";
import { Download, QrCode, X, CheckCircle2, Sparkles, Share2 } from "lucide-react";

import { markPwaInstalled, useIsPwaInstalled, executeNativePwaInstall } from "@/lib/usePwaInstall";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

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
  useBodyScrollLock(isOpen);
  const { isInstalled } = useIsPwaInstalled();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== "undefined") {
      return (window as unknown as { __pwaPrompt?: BeforeInstallPromptEvent }).__pwaPrompt || null;
    }
    return null;
  });
  const [isMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  });
  const [isIos] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
  });
  const [currentUrl] = useState<string>(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      return window.location.origin;
    }
    return "https://nagrikseva-ai-one.vercel.app";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    const outcome = await executeNativePwaInstall();
    if (outcome === "installed" || outcome === "dismissed") {
      onClose();
      return;
    }
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
                /* iOS Safari Interactive Visual Card */
                <div className="bg-gradient-to-b from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-3xl p-4 text-xs text-blue-950 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-sm flex items-center gap-1.5 text-blue-900">
                      <Share2 size={16} className="text-blue-600" />
                      <span>iPhone પર ૧-સેકન્ડ ઇન્સ્ટોલ:</span>
                    </p>
                    <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                      Apple Safari
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-blue-200 shadow-2xs">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                        ૧
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs">સફારીમાં નીચે Share બટન દબાવો</p>
                        <p className="text-[10.5px] text-blue-600 font-mono mt-0.5">
                          સ્ક્રીનમાં નીચેનું ચોરસ તીર વાળું [ ⎋ ] આઇકોન
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-blue-200 shadow-2xs">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                        ૨
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs">&apos;Add to Home Screen&apos; (+) દબાવો</p>
                        <p className="text-[10.5px] text-gray-500 mt-0.5">
                          ઉપર &apos;Add&apos; ક્લિક કરો — એપ હોમ સ્ક્રીન પર આવી જશે!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pulsing indicator pointing down to Safari toolbar */}
                  <div className="text-center pt-1 animate-bounce">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600 bg-white px-3 py-1 rounded-full border border-blue-200 shadow-xs">
                      👇 નીચે સફારીના Share બટન (⎋) પર ટેપ કરો
                    </span>
                  </div>
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
                  {/* Scannable Dynamic QR Code */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`}
                    alt="Scan to install NagrikSeva AI"
                    width={144}
                    height={144}
                    className="w-36 h-36 mx-auto rounded-lg object-contain"
                  />
                  <p className="text-[10px] font-mono font-bold text-gray-600 mt-1 truncate max-w-[144px]">
                    {currentUrl.replace(/^https?:\/\//, "")}
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
