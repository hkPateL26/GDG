"use client";

import { INDIAN_LANGUAGES } from "./languages";

export const DEFAULT_LANGUAGE = "gu";
const STORAGE_KEY = "nagrikseva_selected_lang";

export function getStoredLanguage(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && INDIAN_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Sets Google Translate cookies correctly.
 * Note: Never set `domain=localhost` or Chrome/RFC 6265 will reject the cookie!
 */
export function setGoogleTranslateCookies(targetLang: string) {
  if (typeof window === "undefined") return;

  const cookieGu = `/gu/${targetLang}`;
  const cookieAuto = `/auto/${targetLang}`;

  // Standard root cookies
  document.cookie = `googtrans=${cookieGu}; path=/; SameSite=Lax;`;
  document.cookie = `googtrans=${cookieAuto}; path=/; SameSite=Lax;`;

  // Only set domain if on a legitimate multi-part hostname (e.g. atmiya.gov.in)
  // NEVER on localhost, 127.0.0.1, or single hostnames
  const hostname = window.location.hostname;
  if (
    hostname &&
    hostname.includes(".") &&
    !hostname.endsWith("localhost") &&
    !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    document.cookie = `googtrans=${cookieGu}; path=/; domain=.${hostname}; SameSite=Lax;`;
    document.cookie = `googtrans=${cookieAuto}; path=/; domain=.${hostname}; SameSite=Lax;`;
  }
}

/**
 * Clears all Google Translate cookies across root and domain paths.
 */
export function clearGoogleTranslateCookies() {
  if (typeof window === "undefined") return;

  const expired = "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;";
  document.cookie = `googtrans${expired}`;

  const hostname = window.location.hostname;
  if (
    hostname &&
    hostname.includes(".") &&
    !hostname.endsWith("localhost") &&
    !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    document.cookie = `googtrans${expired} domain=.${hostname};`;
    document.cookie = `googtrans${expired} domain=${hostname};`;
  }
}

/**
 * Applies the selected language across the entire application:
 * 1. Updates localStorage & fires React context event.
 * 2. If target is default Gujarati: clears translation cookies, resets combo, and reloads cleanly.
 * 3. If target is another language: sets cookies, triggers Google Translate combo, polling if needed.
 */
export function applyLanguage(targetLang: string) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, targetLang);
  } catch {
    // ignore
  }

  // Notify React LanguageContext immediately so UI labels update
  window.dispatchEvent(
    new CustomEvent("nagrikseva:languageChange", { detail: targetLang })
  );

  // Case 1: Switching back to Gujarati (native default)
  if (targetLang === DEFAULT_LANGUAGE) {
    clearGoogleTranslateCookies();

    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      // In Google Translate, empty value ("") means "Restore Original"
      combo.value = "";
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // Quick reload ensures all DOM text nodes return to authentic Gujarati without Google artifacts
    setTimeout(() => {
      window.location.reload();
    }, 150);
    return;
  }

  // Case 2: Switching to another language (e.g. Hindi, English, Marathi)
  setGoogleTranslateCookies(targetLang);

  const triggerCombo = (combo: HTMLSelectElement) => {
    combo.value = targetLang;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (combo) {
    triggerCombo(combo);
  } else {
    // Script might still be loading or mounting: poll every 50ms for up to 2500ms
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const lateCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (lateCombo) {
        clearInterval(interval);
        triggerCombo(lateCombo);
      } else if (attempts >= 50) {
        clearInterval(interval);
        // Fallback: reload with googtrans cookie already set in document.cookie
        window.location.reload();
      }
    }, 50);
  }
}
