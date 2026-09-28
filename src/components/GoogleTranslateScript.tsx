"use client";

import { useEffect } from "react";
import {
  getStoredLanguage,
  setGoogleTranslateCookies,
  DEFAULT_LANGUAGE,
} from "@/lib/translation";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              autoDisplay: boolean;
              layout?: unknown;
            },
            elementId: string
          ): void;
          InlineLayout?: {
            SIMPLE: unknown;
          };
        };
      };
    };
  }
}

export default function GoogleTranslateScript() {
  // When a translated language is active, ensure navigation uses full clean navigation
  // This eliminates the violent React SPA DOM swap conflict and stops the "jatko" (jolt/flash) completely
  useEffect(() => {
    const handleGlobalLinkClick = (e: MouseEvent) => {
      const savedLang = getStoredLanguage();
      if (savedLang === DEFAULT_LANGUAGE) return; // Gujarati is native: keep blazing fast SPA transitions

      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Only handle internal application routes
      if (
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("/api") &&
        !target.hasAttribute("download") &&
        target.getAttribute("target") !== "_blank"
      ) {
        e.preventDefault();
        window.location.href = href;
      }
    };

    document.addEventListener("click", handleGlobalLinkClick, true);
    return () => document.removeEventListener("click", handleGlobalLinkClick, true);
  }, []);

  useEffect(() => {
    const savedLang = getStoredLanguage();

    // Ensure cookie is in sync with stored language before script initializes
    if (savedLang && savedLang !== DEFAULT_LANGUAGE) {
      setGoogleTranslateCookies(savedLang);
    }

    // Set callback for Google Translate initialization
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "gu",
              includedLanguages: "gu,hi,en,mr,bn,te,ta,kn,ml,pa,or,ur,as,sa,ne",
              autoDisplay: false,
            },
            "google_translate_element"
          );

          // Always check fresh stored language from localStorage
          const activeLang = getStoredLanguage();
          if (activeLang && activeLang !== DEFAULT_LANGUAGE) {
            let attempts = 0;
            const checkInterval = setInterval(() => {
              attempts++;
              const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
              if (combo) {
                clearInterval(checkInterval);
                if (combo.value !== activeLang) {
                  combo.value = activeLang;
                  combo.dispatchEvent(new Event("change", { bubbles: true }));
                }
                setTimeout(() => {
                  window.dispatchEvent(new Event("nagrikseva:pageReady"));
                }, 400);
              } else if (attempts >= 40) {
                clearInterval(checkInterval);
                window.dispatchEvent(new Event("nagrikseva:pageReady"));
              }
            }, 50);
          } else {
            window.dispatchEvent(new Event("nagrikseva:pageReady"));
          }
        }
      } catch (err) {
        console.error("Google Translate init error:", err);
        window.dispatchEvent(new Event("nagrikseva:pageReady"));
      }
    };

    const loadScript = () => {
      if (!document.getElementById("google-translate-api-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-api-script";
        script.type = "text/javascript";
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.onerror = () => {
          // Silently handle if client adblocker or local network blocks google translate
          window.dispatchEvent(new Event("nagrikseva:pageReady"));
        };
        document.body.appendChild(script);
      }
    };

    // Preload Google Translate script unconditionally so combo is pre-warmed & ready
    loadScript();

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const newLang = customEvent.detail;
      if (newLang && newLang !== DEFAULT_LANGUAGE) {
        loadScript();
      }
    };

    window.addEventListener("nagrikseva:languageChange", handleLangChange);
    return () => window.removeEventListener("nagrikseva:languageChange", handleLangChange);
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -9999,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
