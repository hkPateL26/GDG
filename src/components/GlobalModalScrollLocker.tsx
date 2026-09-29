"use client";

import { useEffect } from "react";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/useBodyScrollLock";

export default function GlobalModalScrollLocker() {
  useEffect(() => {
    if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
      return;
    }

    let isCurrentlyLocked = false;

    const checkModals = () => {
      // Find any modal dialog, alert dialog, or fullscreen backdrop in the DOM
      const modalElements = document.querySelectorAll(
        '[role="dialog"], [role="alertdialog"], [aria-modal="true"], .fixed.inset-0.z-50, .fixed.inset-0.z-\\[60\\], .fixed.inset-0.z-\\[70\\]'
      );

      let hasVisibleModal = false;
      for (let i = 0; i < modalElements.length; i++) {
        const el = modalElements[i] as HTMLElement;
        // Ignore mobile bottom nav bar or floating install banner
        if (el.closest("nav") || el.getAttribute("data-pwa-install") === "true") {
          continue;
        }
        const style = window.getComputedStyle(el);
        if (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
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
      } else if (!hasVisibleModal && isCurrentlyLocked) {
        unlockBodyScroll();
        isCurrentlyLocked = false;
      }
    };

    // Initial evaluation
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
      if (isCurrentlyLocked) {
        unlockBodyScroll();
      }
    };
  }, []);

  return null;
}
