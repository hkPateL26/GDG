"use client";

import { useEffect } from "react";

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    (window as unknown as { __pwaPrompt?: Event }).__pwaPrompt = e;
    window.dispatchEvent(new CustomEvent("nagrik_pwa_prompt_ready"));
  });
}

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerSw = () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((reg) => {
            reg.update().catch(() => {});
          })
          .catch((err) => console.warn("PWA SW:", err));
      };

      if (document.readyState === "complete") {
        registerSw();
      } else {
        window.addEventListener("load", registerSw);
        return () => window.removeEventListener("load", registerSw);
      }
    }
  }, []);

  return null;
}
