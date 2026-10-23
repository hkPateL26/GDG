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

  const cookieVal = `/gu/${targetLang}`;

  // 1. Root path cookie (primary)
  document.cookie = `googtrans=${cookieVal}; path=/;`;

  // 2. Domain cookie if valid hostname
  const hostname = window.location.hostname;
  if (
    hostname &&
    hostname.includes(".") &&
    !hostname.endsWith("localhost") &&
    !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`;
  }
}

/**
 * Clears all Google Translate cookies across root and domain paths.
 */
export function clearGoogleTranslateCookies() {
  if (typeof window === "undefined") return;

  const expired = "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = `googtrans${expired}`;

  const hostname = window.location.hostname;
  if (hostname) {
    document.cookie = `googtrans${expired} domain=${hostname};`;
    document.cookie = `googtrans${expired} domain=.${hostname};`;
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
      combo.value = "";
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // Quick reload ensures all DOM text nodes return to authentic Gujarati without Google artifacts
    setTimeout(() => {
      window.location.reload();
    }, 120);
    return;
  }

  // Case 2: Switching to another language (e.g. Hindi, English, Marathi)
  setGoogleTranslateCookies(targetLang);

  const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  // If the Google Translate combo is already loaded with options, trigger it immediately
  if (combo && combo.options && combo.options.length > 1) {
    combo.value = targetLang;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    if (typeof combo.onchange === "function") {
      combo.onchange(new Event("change"));
    }
  } else {
    // Clean reload ensures Google Translate loads on boot with the googtrans cookie
    setTimeout(() => {
      window.location.reload();
    }, 120);
  }
}
