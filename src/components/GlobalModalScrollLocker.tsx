"use client";

import { useEffect } from "react";
import { lockBodyScroll, forceUnlockBodyScroll } from "@/lib/useBodyScrollLock";

export default function GlobalModalScrollLocker() {
  useEffect(() => {
    if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
      return;
    }

    let isCurrentlyLocked = false;

    const checkModals = () => {
      // Only lock when an explicit aria-modal="true" dialog is actively visible
      const modalElements = document.querySelectorAll('[aria-modal="true"]');

      let hasVisibleModal = false;
      for (let i = 0; i < modalElements.length; i++) {
        const el = modalElements[i] as HTMLElement;
        if (el.getAttribute("data-pwa-install") === "true") {
          continue;
        }
        const style = window.getComputedStyle(el);
        if (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          style.pointerEvents !== "none" &&
          el.offsetWidth > 0 &&
          el.offsetHeight > 0
        ) {
          hasVisibleModal = true;
          break;
        }
      }

      if (hasVisibleModal && !isCurrentlyLocked) {
        lockBodyScroll();
        isCurrentlyLocked = true;
      } else if (!hasVisibleModal) {
        // Always ensure body is unlocked when no modal is visible
        if (
          isCurrentlyLocked ||
          document.body.classList.contains("modal-open") ||
          document.documentElement.classList.contains("modal-open") ||
          document.body.style.overflow === "hidden"
        ) {
          forceUnlockBodyScroll();
          isCurrentlyLocked = false;
        }
      }
    };

    checkModals();

    const observer = new MutationObserver(() => {
      checkModals();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "hidden"],
    });

    return () => {
      observer.disconnect();
      forceUnlockBodyScroll();
    };
  }, []);

  return null;
}
