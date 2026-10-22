"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AndroidNativeBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent || "";
    const isCapacitor =
      (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.() === true ||
      ua.includes("NagrikSevaNativeAndroid") ||
      /Capacitor|NagrikSeva/i.test(ua);

    if (isCapacitor) {
      document.documentElement.classList.add("is-native-android", "is-capacitor");
      document.body.classList.add("is-native-android", "is-capacitor");
    }

    let cleanupBackButton: (() => void) | undefined;

    async function initCapacitor() {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform() && !ua.includes("NagrikSevaNativeAndroid")) return;

        // 1. Status Bar styling
        try {
          const { StatusBar, Style } = await import("@capacitor/status-bar");
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#020617" });
        } catch (e) {
          console.warn("StatusBar plugin error:", e);
        }

        // 2. Hide Splash Screen after hydration
        try {
          const { SplashScreen } = await import("@capacitor/splash-screen");
          await SplashScreen.hide();
        } catch (e) {
          console.warn("SplashScreen plugin error:", e);
        }

        // 3. Hardware Back Button Handling
        try {
          const { App: CapApp } = await import("@capacitor/app");
          const listener = await CapApp.addListener("backButton", ({ canGoBack }) => {
            // Check if any modal is currently visible on screen
            const modalBackdrop =
              document.querySelector("[data-modal-backdrop='true']") ||
              document.querySelector(".fixed.inset-0.z-50") ||
              document.querySelector("[role='dialog']");
            if (modalBackdrop) {
              const closeButton = modalBackdrop.querySelector(
                "button[aria-label='Close'], button[title*='બંધ'], button.close-modal-btn"
              ) as HTMLButtonElement | null;
              if (closeButton) {
                closeButton.click();
                return;
              }
            }

            // If not at home, go back in router history
            if (window.location.pathname !== "/" && window.history.length > 1) {
              window.history.back();
            } else {
              // At root or cannot go back -> exit app
              CapApp.exitApp();
            }
          });

          cleanupBackButton = () => {
            listener.remove();
          };
        } catch (e) {
          console.warn("Capacitor App back button error:", e);
        }
      } catch (err) {
        console.warn("Capacitor native bridge initialization error:", err);
      }
    }

    initCapacitor();

    return () => {
      if (cleanupBackButton) cleanupBackButton();
    };
  }, [pathname, router]);

  return null;
}
