"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getStoredLanguage, applyLanguage, DEFAULT_LANGUAGE } from "@/lib/translation";

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
  const pathname = usePathname();

  // When a translated language is active, ensure navigation uses full clean navigation
  // This eliminates the violent React SPA DOM swap conflict and stops the "jatko" (jolt/flash) completely!
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
      const cookieValue = `/gu/${savedLang}`;
      const hostname = window.location.hostname;
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`;
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

          // If a language was previously stored and is not default, trigger combo
          if (savedLang && savedLang !== DEFAULT_LANGUAGE) {
            setTimeout(() => {
              const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
              if (combo) {
                if (combo.value !== savedLang) {
                  combo.value = savedLang;
                  combo.dispatchEvent(new Event("change"));
                }
                // Restore visibility after translation applies (~500ms for Google to translate DOM)
                setTimeout(() => {
                  document.documentElement.style.opacity = "1";
                }, 600);
              } else {
                // Fallback: show page anyway if combo not found
                document.documentElement.style.opacity = "1";
              }
            }, 800);
          } else {
            // Default language (Gujarati): restore immediately
            document.documentElement.style.opacity = "1";
          }
        }
      } catch (err) {
        console.error("Google Translate init error:", err);
      }
    };

    // Load external Google Translate engine script safely
    if (!document.getElementById("google-translate-api-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-api-script";
      script.type = "text/javascript";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none", position: "absolute", top: "-9999px", left: "-9999px" }}
      aria-hidden="true"
    />
  );
}
