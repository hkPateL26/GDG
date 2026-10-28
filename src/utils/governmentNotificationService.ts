/**
 * NagrikSeva AI - Official Government Push & Status Bar Notification Engine
 * (ગુજરાત સરકાર સત્તાવાર પુશ & શટર નોટિફિકેશન સિસ્ટમ)
 *
 * Supports:
 * 1. Android Native Status Bar / Pull-Down Shutter via NagrikNativeBridge
 * 2. Web Notifications / PWA Service Worker via Notification API
 * 3. Cross-Tab & Cross-Device Sync via BroadcastChannel & LocalStorage
 * 4. High-Fidelity Official Audio Chime via Web Audio API (Offline Synthesized)
 * 5. Device Haptic Vibration Patterns
 */

export interface GovNotificationPayload {
  id: string;
  appId: string;
  serviceNameGu: string;
  status: "approved" | "rejected" | "submitted" | "in_review";
  title: string;
  headerGu: string;
  message: string;
  officerName?: string;
  remarksGu?: string;
  timestamp: number;
  url?: string;
}

// 1. Synthesize crisp, authentic double-tone Government Chime (100% offline, zero external MP3 latency)
export function playGovNotificationSound(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First Tone: Clean Saffron Chime (E5 - 659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.32);

    // Second Tone: Higher Resonance Harmonics (A5 - 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(880.0, now + 0.16);
    gain2.gain.setValueAtTime(0.3, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.16);
    osc2.stop(now + 0.65);
  } catch (err) {
    console.warn("[GovNotification] AudioContext sound error:", err);
  }
}

// 2. Device Haptic Feedback
export function triggerNotificationHaptic(): void {
  if (typeof window === "undefined" || !("navigator" in window)) return;
  try {
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate([150, 100, 200]);
    }
  } catch (err) {
    console.warn("[GovNotification] Haptic vibrate error:", err);
  }
}

// 3. Request Browser Notification Permission Gracefully
export async function requestWebNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted") {
    return "granted";
  }
  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return "denied";
    }
  }
  return Notification.permission;
}

// 4. Main Dispatcher: Sends official government notification through all available channels
export function triggerOfficialGovNotification(payload: Omit<GovNotificationPayload, "id" | "timestamp"> & { id?: string; timestamp?: number }): GovNotificationPayload {
  const fullPayload: GovNotificationPayload = {
    id: payload.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: payload.timestamp || Date.now(),
    url: payload.url || `/track?id=${payload.appId}`,
    ...payload,
  };

  if (typeof window === "undefined") return fullPayload;

  // A. Trigger Sound & Haptics
  playGovNotificationSound();
  triggerNotificationHaptic();

  // B. Native Android Status Bar / Pull-Down Shutter Bridge
  try {
    const nativeBridge = (
      window as unknown as {
        NagrikNativeBridge?: {
          triggerGovNotification?: (title: string, message: string, appId: string, status: string) => void;
        };
      }
    ).NagrikNativeBridge;

    if (nativeBridge && typeof nativeBridge.triggerGovNotification === "function") {
      nativeBridge.triggerGovNotification(
        fullPayload.title,
        fullPayload.message,
        fullPayload.appId,
        fullPayload.status
      );
    }
  } catch (nativeErr) {
    console.warn("[GovNotification] Android Native Bridge error:", nativeErr);
  }

  // C. Web Push / Service Worker Notification
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(fullPayload.title, {
            body: fullPayload.message,
            icon: "/icon-192.png",
            badge: "/icon.svg",
            tag: `gov-notif-${fullPayload.appId}`,
            data: { url: fullPayload.url },
            // Vibration handled via navigator.vibrate
          });
        }).catch(() => {
          new Notification(fullPayload.title, {
            body: fullPayload.message,
            icon: "/icon.svg",
          });
        });
      } else {
        new Notification(fullPayload.title, {
          body: fullPayload.message,
          icon: "/icon.svg",
        });
      }
    }
  } catch (webNotifErr) {
    console.warn("[GovNotification] Web Notification error:", webNotifErr);
  }

  // D. LocalStorage & Multi-Tab Broadcast Channel Sync
  try {
    localStorage.setItem("nagrik_latest_gov_notification", JSON.stringify(fullPayload));

    // Append to notification history
    const historyRaw = localStorage.getItem("nagrik_gov_notification_history");
    const history: GovNotificationPayload[] = historyRaw ? JSON.parse(historyRaw) : [];
    const updatedHistory = [fullPayload, ...history.filter((n) => n.id !== fullPayload.id)].slice(0, 25);
    localStorage.setItem("nagrik_gov_notification_history", JSON.stringify(updatedHistory));

    // BroadcastChannel for instant cross-tab sync
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel("nagrik_gov_notifications");
      channel.postMessage(fullPayload);
      channel.close();
    }

    // Custom DOM Event for instant in-tab React UI response
    window.dispatchEvent(new CustomEvent("nagrik_gov_notification", { detail: fullPayload }));
  } catch (storageErr) {
    console.warn("[GovNotification] LocalStorage/Broadcast error:", storageErr);
  }

  return fullPayload;
}

// 5. Real-Time Dynamic Live Sync Engine: Polls server to catch officer approvals / rejections across devices
let isSyncing = false;

export async function scanAndNotifyCitizenApplicationTransitions(): Promise<void> {
  if (typeof window === "undefined" || isSyncing) return;
  isSyncing = true;

  try {
    const rawApps = localStorage.getItem("nagrik_user_applications");
    let apps: any[] = rawApps ? JSON.parse(rawApps) : [];
    if (!Array.isArray(apps)) apps = [];

    // Also check active applications in citizen session
    const rawSession = localStorage.getItem("nagrik_citizen_session");
    if (rawSession) {
      try {
        const session = JSON.parse(rawSession);
        if (Array.isArray(session.activeApplications)) {
          for (const sa of session.activeApplications) {
            if (sa && sa.id && !apps.some((a) => a.id === sa.id)) {
              apps.push(sa);
            }
          }
        }
      } catch {}
    }

    if (apps.length === 0) {
      isSyncing = false;
      return;
    }

    const notifiedRaw = localStorage.getItem("nagrik_notified_app_statuses");
    const notifiedMap: Record<string, string> = notifiedRaw ? JSON.parse(notifiedRaw) : {};
    let hasUpdatedApps = false;
    let hasNewNotification = false;

    // Active cross-device server polling for each application
    for (let i = 0; i < apps.length; i++) {
      const app = apps[i];
      if (!app || !app.id) continue;

      try {
        const secretParam = app.trackingSecret ? `&secret=${encodeURIComponent(app.trackingSecret)}` : "";
        const res = await fetch(`/api/track?id=${encodeURIComponent(app.id)}${secretParam}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!res.ok) continue;
        const data = await res.json();

        if (data && data.success && data.application) {
          const serverApp = data.application;
          const oldStatus = app.status;
          const newStatus = serverApp.status;
          const oldStage = app.workflowStage ?? 1;
          const newStage = serverApp.workflowStage ?? (newStatus === "approved" ? 3 : 1);

          // Check if status or stage changed on server!
          const statusChanged = (newStatus && newStatus !== oldStatus) || (newStage !== oldStage);

          if (statusChanged || (serverApp.remarksGu && serverApp.remarksGu !== app.remarksGu)) {
            hasUpdatedApps = true;
            // Merge server attributes into local app
            apps[i] = {
              ...app,
              ...serverApp,
              status: newStatus,
              workflowStage: newStage,
              remarksGu: serverApp.remarksGu || app.remarksGu,
              remarksEn: serverApp.remarksEn || app.remarksEn,
              officerDesignation: serverApp.officerDesignation || app.officerDesignation,
              lastUpdated: serverApp.lastUpdated || new Date().toISOString().split("T")[0],
            };

            // Dispatch granular update event for any active view (e.g. TrackVaultView)
            window.dispatchEvent(
              new CustomEvent("nagrik_application_updated", {
                detail: { application: apps[i], previousStatus: oldStatus },
              })
            );
          }

          const currentRecordedNotif = notifiedMap[app.id];

          // 1. Newly Approved with e-Sign!
          if (newStatus === "approved" && currentRecordedNotif !== "approved") {
            notifiedMap[app.id] = "approved";
            hasNewNotification = true;

            triggerOfficialGovNotification({
              appId: app.id,
              serviceNameGu: serverApp.schemeGu || serverApp.schemeNameGu || app.schemeNameGu || "સરકારી સેવા",
              status: "approved",
              title: "🏛️ ગુજરાત સરકાર • ઈ-નગર પોર્ટલ",
              headerGu: "અરજી મંજૂર (Mamlatdar e-Sign પૂર્ણ)",
              message: `અભિનંદન! તમારી ${serverApp.schemeGu || serverApp.schemeNameGu || app.schemeNameGu || "સેવા"} (અરજી ક્રમાંક: ${app.id}) મામલતદારશ્રી દ્વારા ડિજિટલ સહી (e-Sign) સાથે મંજૂર કરવામાં આવી છે. સત્તાવાર ડિજિટલ પ્રમાણપત્ર તૈયાર છે.`,
              officerName: serverApp.officerDesignation || app.officerName || "તાલુકા મામલતદારશ્રી",
              remarksGu: serverApp.remarksGu,
            });
          }

          // 2. Newly Rejected or Returned for Correction
          if (newStatus === "rejected" && currentRecordedNotif !== "rejected") {
            notifiedMap[app.id] = "rejected";
            hasNewNotification = true;

            const explanation =
              serverApp.remarksGu ||
              app.remarksGu ||
              "કચેરી દ્વારા અરજીમાં સુધારણા માટે પૂરક પુરાવા માંગવામાં આવ્યા છે.";

            triggerOfficialGovNotification({
              appId: app.id,
              serviceNameGu: serverApp.schemeGu || serverApp.schemeNameGu || app.schemeNameGu || "સરકારી સેવા",
              status: "rejected",
              title: "⚠️ ગુજરાત સરકાર • કચેરી ચકાસણી સૂચના",
              headerGu: "પૂરક પુરાવા / સુધારણા જરૂરી",
              message: `તમારી ${serverApp.schemeGu || serverApp.schemeNameGu || app.schemeNameGu || "સેવા"} (અરજી ક્રમાંક: ${app.id}) માં કચેરી દ્વારા સુધારણા જરૂરી છે: ${explanation}`,
              remarksGu: explanation,
              officerName: serverApp.officerDesignation || app.officerName || "ચકાસણી અધિકારીશ્રી",
            });
          }
        }
      } catch (appSyncErr) {
        // Individual app sync error should not abort other apps
      }
    }

    if (hasUpdatedApps) {
      localStorage.setItem("nagrik_user_applications", JSON.stringify(apps));

      // Also update citizen session activeApplications if present
      if (rawSession) {
        try {
          const session = JSON.parse(rawSession);
          if (Array.isArray(session.activeApplications)) {
            session.activeApplications = session.activeApplications.map((sa: any) => {
              const matched = apps.find((a) => a.id === sa.id);
              return matched ? { ...sa, ...matched } : sa;
            });
            localStorage.setItem("nagrik_citizen_session", JSON.stringify(session));
          }
        } catch {}
      }

      window.dispatchEvent(new Event("storage"));
    }

    if (hasNewNotification) {
      localStorage.setItem("nagrik_notified_app_statuses", JSON.stringify(notifiedMap));
    }
  } catch (scanErr) {
    console.warn("[GovNotification] Live server sync error:", scanErr);
  } finally {
    isSyncing = false;
  }
}
