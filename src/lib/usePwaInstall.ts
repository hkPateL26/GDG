"use client";

import { useState, useEffect } from "react";

export function useIsPwaInstalled() {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    const checkInstalled = () => {
      if (typeof window === "undefined") return false;

      // 1. Check if running inside installed standalone PWA window
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");

      // 2. Check if previously recorded as installed in this browser
      const isStoredInstalled = localStorage.getItem("nagrikseva_pwa_installed") === "true";

      const installed = isStandalone || isStoredInstalled;
      setIsInstalled(installed);
      return installed;
    };

    checkInstalled();

    // Listen to changes in display mode (when app opens in standalone)
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        localStorage.setItem("nagrikseva_pwa_installed", "true");
        setIsInstalled(true);
      }
    };

    try {
      mediaQuery.addEventListener("change", handleMediaChange);
    } catch {
      mediaQuery.addListener(handleMediaChange);
    }

    // Listen to native appinstalled event fired when installation succeeds
    const handleAppInstalled = () => {
      localStorage.setItem("nagrikseva_pwa_installed", "true");
      setIsInstalled(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      try {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } catch {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return { isInstalled, isMounted };
}

export function markPwaInstalled() {
  if (typeof window !== "undefined") {
    localStorage.setItem("nagrikseva_pwa_installed", "true");
    window.dispatchEvent(new Event("appinstalled"));
  }
}
