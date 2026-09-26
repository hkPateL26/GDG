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

  // Instant re-trigger on Next.js route change to prevent flash of untranslated text
  useEffect(() => {
    const savedLang = getStoredLanguage();
    if (savedLang && savedLang !== DEFAULT_LANGUAGE) {
      const trigger = () => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (combo) {
          combo.value = savedLang;
          combo.dispatchEvent(new Event("change"));
        }
      };

      trigger();
      const t1 = setTimeout(trigger, 100);
      const t2 = setTimeout(trigger, 300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [pathname]);

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
              if (combo && combo.value !== savedLang) {
                combo.value = savedLang;
                combo.dispatchEvent(new Event("change"));
              }
            }, 800);
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
