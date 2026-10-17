"use client";

import { useState, useEffect, useCallback } from "react";
import { triggerHaptic } from "./haptic";

const SARAL_STORAGE_KEY = "nagrik_ui_mode";
const SARAL_EVENT_NAME = "nagrik_saral_mode_change";

export function useSaralMode() {
  const [isSaralMode, setIsSaralModeState] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const checkMode = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(SARAL_STORAGE_KEY);
        setIsSaralModeState(saved === "saral");
      } catch {
        setIsSaralModeState(false);
      }
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    checkMode();

    const handleModeChange = () => checkMode();
    window.addEventListener(SARAL_EVENT_NAME, handleModeChange);
    window.addEventListener("storage", handleModeChange);

    return () => {
      window.removeEventListener(SARAL_EVENT_NAME, handleModeChange);
      window.removeEventListener("storage", handleModeChange);
    };
  }, [checkMode]);

  const toggleSaralMode = useCallback(() => {
    triggerHaptic("medium");
    if (typeof window !== "undefined") {
      const nextMode = !isSaralMode;
      try {
        localStorage.setItem(SARAL_STORAGE_KEY, nextMode ? "saral" : "detailed");
      } catch {
        // ignore storage errors
      }
      setIsSaralModeState(nextMode);
      window.dispatchEvent(new Event(SARAL_EVENT_NAME));
    }
  }, [isSaralMode]);

  const setSaralMode = useCallback((val: boolean) => {
    triggerHaptic("light");
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SARAL_STORAGE_KEY, val ? "saral" : "detailed");
      } catch {
        // ignore
      }
      setIsSaralModeState(val);
      window.dispatchEvent(new Event(SARAL_EVENT_NAME));
    }
  }, []);

  return {
    isSaralMode: isMounted ? isSaralMode : false,
    toggleSaralMode,
    setSaralMode,
    isMounted,
  };
}
