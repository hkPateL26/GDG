"use client";

import { useEffect } from "react";

let activeLocks = 0;
let originalBodyOverflow = "";
let originalHtmlOverflow = "";
let originalBodyPaddingRight = "";

function preventBackdropTouch(e: TouchEvent) {
  let target = e.target as HTMLElement | null;
  let canScroll = false;
  while (target && target !== document.body && target !== document.documentElement) {
    if (target.scrollHeight > target.clientHeight) {
      const style = window.getComputedStyle(target);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        canScroll = true;
        break;
      }
    }
    target = target.parentElement;
  }
  if (!canScroll) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }
}

function preventBackdropWheel(e: WheelEvent) {
  let target = e.target as HTMLElement | null;
  let canScroll = false;
  while (target && target !== document.body && target !== document.documentElement) {
    if (target.scrollHeight > target.clientHeight) {
      const style = window.getComputedStyle(target);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        const atTop = target.scrollTop <= 0 && e.deltaY < 0;
        const atBottom =
          target.scrollTop + target.clientHeight >= target.scrollHeight - 1 && e.deltaY > 0;
        if (!atTop && !atBottom) {
          canScroll = true;
        }
        break;
      }
    }
    target = target.parentElement;
  }
  if (!canScroll) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }
}

export function lockBodyScroll() {
  if (typeof document === "undefined") return;

  if (activeLocks === 0) {
    originalBodyOverflow = document.body.style.overflow;
    originalHtmlOverflow = document.documentElement.style.overflow;
    originalBodyPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift on desktop when scrollbar disappears
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("touchmove", preventBackdropTouch, { passive: false });
    window.addEventListener("wheel", preventBackdropWheel, { passive: false });
  }

  activeLocks++;
}

export function unlockBodyScroll() {
  if (typeof document === "undefined") return;

  activeLocks = Math.max(0, activeLocks - 1);

  if (activeLocks === 0) {
    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
    document.body.style.overflow = originalBodyOverflow;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;

    window.removeEventListener("touchmove", preventBackdropTouch);
    window.removeEventListener("wheel", preventBackdropWheel);
  }
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
