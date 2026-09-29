// =========================================================================
// HAPTIC FEEDBACK ENGINE (ટચ વાઇબ્રેશન એન્જિન)
// Native Mobile Haptic Feedback for Play Store & PWA grade responsiveness
// =========================================================================

export type HapticType = "light" | "medium" | "heavy" | "success" | "warning" | "selection";

export function triggerHaptic(type: HapticType = "light"): void {
  if (typeof window === "undefined") return;

  // Check if browser/device supports Web Vibration API
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      switch (type) {
        case "selection":
        case "light":
          // Subtle, crisp 12ms tactile tap (Feels like iOS Taptic / Android Haptic tick)
          navigator.vibrate(12);
          break;
        case "medium":
          // Slightly stronger 22ms vibration for important buttons & switches
          navigator.vibrate(22);
          break;
        case "heavy":
          // 35ms press for critical approvals or deletions
          navigator.vibrate(35);
          break;
        case "success":
          // Double pulse [15ms, 40ms pause, 25ms] on OTP verified, payment success, approval
          navigator.vibrate([15, 40, 25]);
          break;
        case "warning":
          // Urgent triple buzz [30ms, 40ms pause, 30ms] on SLA breach or error
          navigator.vibrate([30, 40, 30]);
          break;
      }
    } catch {
      // Graceful fallback on devices with vibration disabled by user settings
    }
  }
}
