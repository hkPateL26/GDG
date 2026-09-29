"use client";

import { useEffect } from "react";
import { triggerHaptic } from "@/lib/haptic";

export default function HapticFeedbackProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastVibrateTime = 0;

    const fireHapticIfInteractive = (target: HTMLElement | null) => {
      if (!target) return;
      const now = Date.now();
      // Prevent double vibration when both touchend and click fire for the same tap
      if (now - lastVibrateTime < 120) return;

      const interactive = target.closest(
        'button, a, [role="button"], [role="tab"], input[type="checkbox"], input[type="radio"], select, .cursor-pointer, .app-touch-card'
      );

      if (interactive) {
        lastVibrateTime = now;
        triggerHaptic("light");
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchDuration = Date.now() - touchStartTime;
      if (touchDuration > 600) return;

      if (e.changedTouches.length > 0) {
        const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
        const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
        if (deltaX > 12 || deltaY > 12) return;
      }

      fireHapticIfInteractive(e.target as HTMLElement | null);
    };

    const handleClick = (e: MouseEvent) => {
      fireHapticIfInteractive(e.target as HTMLElement | null);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
