"use client";

import { useEffect } from "react";
import {
  getStoredLanguage,
  setGoogleTranslateCookies,
  clearGoogleTranslateCookies,
  DEFAULT_LANGUAGE,
} from "@/lib/translation";

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function isGoogleTranslateTelemetryUrl(urlStr: string): boolean {
  if (!urlStr) return false;
  return (
    urlStr.includes("translate.google.com/gen204") ||
    urlStr.includes("/gen204?") ||
    urlStr.includes("translate.googleapis.com/element/log") ||
    urlStr.includes("/element/log?")
  );
}

/**
 * Root-Cause Interceptor for Google Translate Telemetry Pings:
 * Google Translate's widget script (`m=el_main`) sends background analytics pings to
 * `http://translate.google.com/gen204` (via `new Image().src`) and
 * `https://translate.googleapis.com/element/log` (via `XMLHttpRequest` / `sendBeacon` / `fetch`).
 * Browser ad-blockers / Brave Shields block these telemetry URLs with `net::ERR_BLOCKED_BY_CLIENT`.
 * By short-circuiting only these telemetry pings in JS before they reach the network stack,
 * translation (`translate_a/...`) works 100% normally with zero console errors.
 */
function installGoogleTranslateTelemetrySilencer() {
  if (typeof window === "undefined") return;
  const win = window as unknown as { __gtTelemetrySilenced?: boolean };
  if (win.__gtTelemetrySilenced) return;
  win.__gtTelemetrySilenced = true;

  try {
    // 1. Intercept new Image().src = "http://translate.google.com/gen204?..."
    const imgProto = HTMLImageElement.prototype;
    const origSrcDesc = Object.getOwnPropertyDescriptor(imgProto, "src");
    if (origSrcDesc && origSrcDesc.set && origSrcDesc.get) {
      Object.defineProperty(imgProto, "src", {
        configurable: true,
        enumerable: true,
        get() {
          return origSrcDesc.get!.call(this);
        },
        set(val: string) {
          const strVal = String(val || "");
          if (isGoogleTranslateTelemetryUrl(strVal)) {
            origSrcDesc.set!.call(this, TRANSPARENT_PIXEL);
            return;
          }
          origSrcDesc.set!.call(this, val);
        },
      });
    }

    const origSetAttr = imgProto.setAttribute;
    imgProto.setAttribute = function (name: string, value: string) {
      if (
        name &&
        name.toLowerCase() === "src" &&
        isGoogleTranslateTelemetryUrl(String(value || ""))
      ) {
        return origSetAttr.call(this, name, TRANSPARENT_PIXEL);
      }
      return origSetAttr.call(this, name, value);
    };

    // 2. Intercept XMLHttpRequest to https://translate.googleapis.com/element/log
    const xhrProto = XMLHttpRequest.prototype as XMLHttpRequest & {
      __skipGtTelemetry?: boolean;
    };
    const origOpen = xhrProto.open;
    const origSend = xhrProto.send;

    xhrProto.open = function (
      method: string,
      url: string | URL,
      async: boolean = true,
      username?: string | null,
      password?: string | null
    ) {
      const urlStr = String(url || "");
      if (isGoogleTranslateTelemetryUrl(urlStr)) {
        (this as XMLHttpRequest & { __skipGtTelemetry?: boolean }).__skipGtTelemetry = true;
        return origOpen.call(
          this,
          "GET",
          "data:application/json;charset=utf-8,%7B%7D",
          async,
          username,
          password
        );
      }
      (this as XMLHttpRequest & { __skipGtTelemetry?: boolean }).__skipGtTelemetry = false;
      return origOpen.call(this, method, url, async, username, password);
    };

    xhrProto.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
      if ((this as XMLHttpRequest & { __skipGtTelemetry?: boolean }).__skipGtTelemetry) {
        // Complete silently without hitting external network
        try {
          Object.defineProperty(this, "readyState", { value: 4, configurable: true });
          Object.defineProperty(this, "status", { value: 200, configurable: true });
          Object.defineProperty(this, "responseText", { value: "{}", configurable: true });
          this.dispatchEvent(new Event("readystatechange"));
          this.dispatchEvent(new Event("load"));
        } catch {
          // ignore
        }
        return;
      }
      return origSend.call(this, body);
    };

    // 3. Intercept navigator.sendBeacon if used for telemetry
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const origBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function (url: string | URL, data?: BodyInit | null) {
        if (isGoogleTranslateTelemetryUrl(String(url || ""))) {
          return true;
        }
        return origBeacon(url, data);
      };
    }

    // 4. Intercept window.fetch if used for telemetry
    const origFetch = window.fetch.bind(window);
    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      const urlStr =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : input?.url || "";
      if (isGoogleTranslateTelemetryUrl(urlStr)) {
        return Promise.resolve(
          new Response("{}", {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
      return origFetch(input, init);
    };
  } catch {
    // Ignore if browser restricts prototype patching
  }
}

// Install immediately at module evaluation time on client
if (typeof window !== "undefined") {
  installGoogleTranslateTelemetrySilencer();
}

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
    installGoogleTranslateTelemetrySilencer();

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
    installGoogleTranslateTelemetrySilencer();
    const savedLang = getStoredLanguage();

    // Ensure cookie is in sync with stored language before script initializes
    if (savedLang && savedLang !== DEFAULT_LANGUAGE) {
      setGoogleTranslateCookies(savedLang);
    } else {
      clearGoogleTranslateCookies();
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

    // Only load Google Translate script if a non-default language is selected
    if (savedLang && savedLang !== DEFAULT_LANGUAGE) {
      loadScript();
    } else {
      window.dispatchEvent(new Event("nagrikseva:pageReady"));
    }

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const newLang = customEvent.detail;
      if (newLang && newLang !== DEFAULT_LANGUAGE) {
        setGoogleTranslateCookies(newLang);
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
