"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import {
  GovNotificationPayload,
  playGovNotificationSound,
  triggerNotificationHaptic,
} from "@/utils/governmentNotificationService";

export default function OfficialGovNotificationBanner() {
  const router = useRouter();
  const [activeNotification, setActiveNotification] = useState<GovNotificationPayload | null>(null);
  const [isDismissing, setIsDismissing] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Handler for incoming notification
    const handleNotification = (notif: GovNotificationPayload) => {
      setActiveNotification(notif);
      setIsDismissing(false);
      playGovNotificationSound();
      triggerNotificationHaptic();
    };

    // 1. Custom DOM Event listener (current window/tab)
    const domEventListener = (e: Event) => {
      const customEvent = e as CustomEvent<GovNotificationPayload>;
      if (customEvent.detail) {
        handleNotification(customEvent.detail);
      }
    };
    window.addEventListener("nagrik_gov_notification", domEventListener);

    // 2. BroadcastChannel listener (cross-tab in modern browsers)
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        broadcastChannel = new BroadcastChannel("nagrik_gov_notifications");
        broadcastChannel.onmessage = (event) => {
          if (event.data) {
            handleNotification(event.data);
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel not supported", e);
      }
    }

    // 3. Storage event listener (fallback for multi-tab sync)
    const storageListener = (e: StorageEvent) => {
      if (e.key === "nagrik_latest_gov_notification" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleNotification(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", storageListener);

    return () => {
      window.removeEventListener("nagrik_gov_notification", domEventListener);
      window.removeEventListener("storage", storageListener);
      if (broadcastChannel) broadcastChannel.close();
    };
  }, []);

  // Auto-dismiss after 14 seconds
  useEffect(() => {
    if (!activeNotification) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 14000);
    return () => clearTimeout(timer);
  }, [activeNotification]);

  const handleClose = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setActiveNotification(null);
      setIsDismissing(false);
    }, 300);
  };

  const handleActionClick = () => {
    if (!activeNotification) return;
    const targetUrl = activeNotification.url || `/track?id=${activeNotification.appId}`;
    handleClose();
    router.push(targetUrl);
  };

  if (!activeNotification) return null;

  const isApproved = activeNotification.status === "approved";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[99999] w-[95%] sm:w-full max-w-xl transition-all duration-300 ease-out ${
        isDismissing ? "opacity-0 -translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100 animate-in slide-in-from-top-6"
      }`}
    >
      <div
        className={`rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md border-2 relative overflow-hidden ${
          isApproved
            ? "bg-slate-900/95 text-white border-emerald-500 shadow-emerald-950/40"
            : "bg-slate-900/95 text-white border-amber-500 shadow-amber-950/40"
        }`}
      >
        {/* Top Official Header Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                isApproved ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
              }`}
            >
              {isApproved ? <Award size={16} /> : <AlertTriangle size={16} />}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black tracking-wide uppercase text-amber-300 flex items-center gap-1.5 truncate">
                <BellRing size={12} className="animate-bounce" />
                <span>{activeNotification.title}</span>
              </span>
              <p className="text-[10px] text-slate-300 font-medium truncate">
                {activeNotification.headerGu}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-200 border border-white/10 font-bold">
              {activeNotification.appId}
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              aria-label="બંધ કરો"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notification Body Message */}
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
            {activeNotification.message}
          </p>

          {/* Quick Action Footer */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>સત્તાવાર ડિજિટલ પુશ સૂચના</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                પછી જુઓ
              </button>
              <button
                type="button"
                onClick={handleActionClick}
                className={`px-4 py-1.5 text-xs font-black rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  isApproved
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white"
                }`}
              >
                <span>{isApproved ? "સત્તાવાર પ્રમાણપત્ર જુઓ" : "અરજીમાં સુધારો કરો"}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
