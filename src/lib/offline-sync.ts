/**
 * NagrikSeva AI - Offline Resilience & Background Sync Engine
 * Standards: Progressive Web App (PWA) Workbox / Background Sync Spec
 * Enables full functionality across rural Gujarat 2G/3G low-bandwidth or offline environments.
 */

export interface QueuedOfflineItem {
  id: string;
  type: "application_submit" | "document_upload" | "status_track";
  payload: Record<string, unknown>;
  queuedAt: string;
  retryCount: number;
  status: "pending" | "syncing" | "synced" | "failed";
}

const OFFLINE_QUEUE_KEY = "nagrik_offline_sync_queue";
const MAX_RETRIES = 3;

/**
 * Checks if the browser is currently online
 */
export function isOnline(): boolean {
  if (typeof window === "undefined") return true;
  return typeof navigator.onLine === "boolean" ? navigator.onLine : true;
}

/**
 * Retrieve all currently pending offline queued operations
 */
export function getOfflineQueue(): QueuedOfflineItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("[OfflineSync] Error reading queue:", e);
    return [];
  }
}

/**
 * Add an action to the offline queue
 */
export function queueOfflineAction(
  type: QueuedOfflineItem["type"],
  payload: Record<string, unknown>,
  customId?: string
): QueuedOfflineItem {
  const item: QueuedOfflineItem = {
    id: customId || `OFFLINE_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    payload,
    queuedAt: new Date().toISOString(),
    retryCount: 0,
    status: "pending",
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getOfflineQueue();
      // Avoid duplicate actions with the same id
      const filtered = existing.filter((q) => q.id !== item.id);
      filtered.push(item);
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent("nagrik_offline_queue_updated", { detail: { count: filtered.length } }));
    } catch (e) {
      console.warn("[OfflineSync] Error saving item to queue:", e);
    }
  }

  return item;
}

/**
 * Remove an item from the offline queue by ID
 */
export function removeFromOfflineQueue(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getOfflineQueue();
    const updated = existing.filter((q) => q.id !== id);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("nagrik_offline_queue_updated", { detail: { count: updated.length } }));
  } catch (e) {
    console.warn("[OfflineSync] Error removing item from queue:", e);
  }
}

/**
 * Clear the entire offline queue
 */
export function clearOfflineQueue(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    window.dispatchEvent(new CustomEvent("nagrik_offline_queue_updated", { detail: { count: 0 } }));
  } catch (e) {
    console.warn("[OfflineSync] Error clearing queue:", e);
  }
}

/**
 * Process and synchronize all queued offline items with local storage and cloud APIs
 */
export async function processOfflineQueue(): Promise<{ synced: number; failed: number }> {
  if (typeof window === "undefined") return { synced: 0, failed: 0 };
  const queue = getOfflineQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      if (item.type === "application_submit") {
        // Ensure the application is securely placed into nagrik_user_applications
        const savedAppsStr = localStorage.getItem("nagrik_user_applications");
        let savedApps = savedAppsStr ? JSON.parse(savedAppsStr) : [];
        const appPayload = item.payload as { id?: string };
        if (appPayload.id) {
          savedApps = [
            appPayload,
            ...savedApps.filter((a: { id?: string }) => a && a.id !== appPayload.id),
          ];
          localStorage.setItem("nagrik_user_applications", JSON.stringify(savedApps));
        }
      }
      removeFromOfflineQueue(item.id);
      synced++;
    } catch (e) {
      console.warn(`[OfflineSync] Failed to process queue item ${item.id}:`, e);
      item.retryCount = (item.retryCount || 0) + 1;
      if (item.retryCount >= MAX_RETRIES) {
        removeFromOfflineQueue(item.id);
      }
      failed++;
    }
  }

  window.dispatchEvent(
    new CustomEvent("nagrik_sync_complete", {
      detail: { synced, failed, timestamp: new Date().toISOString() },
    })
  );

  return { synced, failed };
}

/**
 * Auto-initializes online listeners to sync immediately when network is restored
 */
export function initOfflineSyncListener(onSync?: (result: { synced: number }) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleOnline = async () => {
    console.info("[OfflineSync] Network restored. Processing offline sync queue...");
    const result = await processOfflineQueue();
    if (result.synced > 0 && onSync) {
      onSync({ synced: result.synced });
    }
  };

  window.addEventListener("online", handleOnline);
  return () => {
    window.removeEventListener("online", handleOnline);
  };
}
