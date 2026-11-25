"use client";

import React, { useEffect, useState } from "react";
import {
  isOnline,
  getOfflineQueue,
  processOfflineQueue,
  initOfflineSyncListener,
} from "@/lib/offline-sync";

export default function NetworkStatusBanner() {
  const [online, setOnline] = useState<boolean>(true);
  const [showBackOnlineToast, setShowBackOnlineToast] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial check
    const currentStatus = isOnline();
    setOnline(currentStatus);
    setPendingCount(getOfflineQueue().length);

    const handleOffline = () => {
      setOnline(false);
      setShowBackOnlineToast(false);
      setPendingCount(getOfflineQueue().length);
    };

    const handleOnline = async () => {
      setOnline(true);
      setShowBackOnlineToast(true);
      setIsSyncing(true);
      try {
        await processOfflineQueue();
      } finally {
        setIsSyncing(false);
        setPendingCount(getOfflineQueue().length);
      }

      const timer = setTimeout(() => {
        setShowBackOnlineToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleQueueUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      setPendingCount(customEvent.detail?.count ?? getOfflineQueue().length);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("nagrik_offline_queue_updated", handleQueueUpdate);

    const cleanupSync = initOfflineSyncListener(() => {
      setPendingCount(getOfflineQueue().length);
    });

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("nagrik_offline_queue_updated", handleQueueUpdate);
      cleanupSync();
    };
  }, []);

  const handleManualSync = async () => {
    if (!online || isSyncing) return;
    setIsSyncing(true);
    try {
      await processOfflineQueue();
      setPendingCount(getOfflineQueue().length);
    } finally {
      setIsSyncing(false);
    }
  };

  if (online && !showBackOnlineToast) {
    return null;
  }

  return (
    <aside
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out font-sans shadow-md"
    >
      {!online ? (
        // OFFLINE BANNER
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-100"></span>
            </span>
            <svg
              className="w-4 h-4 shrink-0 text-amber-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 4.243a9 9 0 01-2.829-2.829m0 0l-2.829 2.829M3 3l18 18"
              />
            </svg>
            <span className="font-semibold tracking-wide">
              ઑફલાઇન મોડ (Offline Mode):
            </span>
            <span className="text-amber-100 hidden sm:inline">
              તમારા અગાઉ જોયેલા દસ્તાવેજો અને રસીદો ઑફલાઇન ઉપલબ્ધ છે.
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {pendingCount > 0 && (
              <span className="bg-amber-900/60 border border-amber-400/40 text-amber-100 px-2 py-0.5 rounded text-[11px] font-bold">
                {pendingCount} અરજી સિંક બાકી
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider">
              કેશ્ડ ડેટા
            </span>
          </div>
        </div>
      ) : (
        // BACK ONLINE BANNER
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-200"></span>
            <svg
              className="w-4 h-4 shrink-0 text-emerald-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-semibold">
              ઇન્ટરનેટ પુનઃસ્થાપિત થયું (Online)
            </span>
            <span className="text-emerald-100 hidden sm:inline">
              {isSyncing ? "ડેટા ક્લાઉડ સાથે સિંક થઈ રહ્યો છે..." : "તમામ સેવાઓ સક્રિય છે."}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="bg-white text-emerald-800 hover:bg-emerald-50 px-2.5 py-1 rounded text-xs font-bold transition shadow-sm"
              >
                {isSyncing ? "સિંકિંગ..." : "હવે સિંક કરો"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowBackOnlineToast(false)}
              className="text-emerald-100 hover:text-white p-1"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
