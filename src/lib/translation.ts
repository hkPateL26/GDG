"use client";

import { INDIAN_LANGUAGES, IndianLanguage } from "./languages";

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

export function applyLanguage(targetLang: string) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, targetLang);
  } catch {
    // ignore
  }

  // Handle Default Gujarati: clear translation cookies so original authentic text is served
  if (targetLang === DEFAULT_LANGUAGE) {
    clearGoogleTranslateCookies();

    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      combo.value = DEFAULT_LANGUAGE;
      combo.dispatchEvent(new Event("change"));
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      window.location.reload();
    }
    return;
  }

  // Set googtrans cookie for target language
  const cookieValue = `/gu/${targetLang}`;
  const hostname = window.location.hostname;

  document.cookie = `googtrans=${cookieValue}; path=/;`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`;
  if (hostname.includes(".")) {
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${hostname};`;
  }

  const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (combo) {
    combo.value = targetLang;
    combo.dispatchEvent(new Event("change"));
  } else {
    window.location.reload();
  }

  window.dispatchEvent(
    new CustomEvent("nagrikseva:languageChange", { detail: targetLang })
  );
}

function clearGoogleTranslateCookies() {
  const hostname = window.location.hostname;
  const expired = "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  document.cookie = `googtrans${expired}`;
  document.cookie = `googtrans${expired} domain=${hostname};`;
  if (hostname.includes(".")) {
    document.cookie = `googtrans${expired} domain=.${hostname};`;
  }
}
