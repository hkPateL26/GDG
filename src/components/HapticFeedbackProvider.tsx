"use client";

import { useEffect } from "react";
import { triggerHaptic } from "@/lib/haptic";

export default function HapticFeedbackProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Ignore long-presses or drag gestures
      const touchDuration = Date.now() - touchStartTime;
      if (touchDuration > 600) return;

      // Ignore scroll or swipe gestures (movement > 12px)
      if (e.changedTouches.length > 0) {
        const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
        const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
        if (deltaX > 12 || deltaY > 12) return;
      }

      // Detect if user tapped an interactive element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, [role="button"], [role="tab"], input[type="checkbox"], input[type="radio"], select, .cursor-pointer'
      );

      if (interactive) {
        triggerHaptic("light");
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return null;
}
