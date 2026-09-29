"use client";

import { useEffect } from "react";

let activeLocks = 0;

export function lockBodyScroll() {
  if (typeof document === "undefined") return;

  if (activeLocks === 0) {
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
  }

  activeLocks++;
}

export function unlockBodyScroll() {
  if (typeof document === "undefined") return;

  activeLocks = Math.max(0, activeLocks - 1);

  if (activeLocks === 0) {
    forceUnlockBodyScroll();
  }
}

export function forceUnlockBodyScroll() {
  if (typeof document === "undefined") return;
  activeLocks = 0;
  document.documentElement.classList.remove("modal-open");
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  document.body.style.paddingRight = "";
}

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isLocked]);
}
