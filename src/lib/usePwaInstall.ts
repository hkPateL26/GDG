"use client";

import { useState, useEffect } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let globalPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    globalPrompt = e as BeforeInstallPromptEvent;
    (window as unknown as { __pwaPrompt?: BeforeInstallPromptEvent }).__pwaPrompt = globalPrompt;
    window.dispatchEvent(new CustomEvent("nagrik_pwa_prompt_ready"));
  });
}

export function getNativeInstallPrompt(): BeforeInstallPromptEvent | null {
  if (typeof window === "undefined") return null;
  return globalPrompt || (window as unknown as { __pwaPrompt?: BeforeInstallPromptEvent }).__pwaPrompt || null;
}

export async function executeNativePwaInstall(): Promise<"installed" | "dismissed" | "unavailable"> {
  const prompt = getNativeInstallPrompt();
  if (!prompt) return "unavailable";

  try {
    await prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === "accepted") {
      markPwaInstalled();
      globalPrompt = null;
      if (typeof window !== "undefined") {
        (window as unknown as { __pwaPrompt?: null }).__pwaPrompt = null;
      }
      return "installed";
    }
    return "dismissed";
  } catch {
    return "unavailable";
  }
}

export function checkIsStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

export function useIsPwaInstalled() {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const checkInstalled = () => {
      if (typeof window === "undefined") return false;

      const standalone = checkIsStandaloneApp();
      setIsStandalone(standalone);

      // Only mark as installed when actually running in standalone app mode
      // or right after appinstalled event in current session
      setIsInstalled(standalone);
      return standalone;
    };

    const timer = setTimeout(() => {
      setIsMounted(true);
      checkInstalled();
    }, 0);

    // Listen to changes in display mode (when app opens in standalone)
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
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
      clearTimeout(timer);
      try {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } catch {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return { isInstalled, isStandalone, isMounted };
}

export function markPwaInstalled() {
  if (typeof window !== "undefined") {
    localStorage.setItem("nagrikseva_pwa_installed", "true");
    window.dispatchEvent(new Event("appinstalled"));
  }
}
