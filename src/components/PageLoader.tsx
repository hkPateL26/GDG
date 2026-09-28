"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * PageLoader — shows a branded loading overlay during page transitions.
 *
 * How it works:
 * - On mount: if a non-Gujarati language is stored, show overlay immediately
 *   (the page content is hidden behind the overlay, so no Gujarati flash).
 * - On route change (pathname): briefly show a thin top progress bar.
 * - Google Translate script fires a custom event `nagrikseva:pageReady`
 *   when translation is applied, which hides the overlay.
 * - Safety net: always hide after 3.5s max.
 */
export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (safetyRef.current) clearTimeout(safetyRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  const hide = () => {
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  };

  const show = () => {
    clearAll();
    setProgress(10);
    setVisible(true);

    // Animate progress bar
    let p = 10;
    progressRef.current = setInterval(() => {
      p = p < 85 ? p + Math.random() * 8 : p;
      setProgress(Math.min(p, 85));
    }, 200);

    // Safety net: always hide after 3.5s
    safetyRef.current = setTimeout(() => {
      clearAll();
      hide();
    }, 3500);
  };

  // On initial mount: if non-Gujarati language stored, show overlay
  // so the white blank page during Google Translate init is covered
  useEffect(() => {
    try {
      const lang =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("nagrikseva_selected_lang")
          : null;
      if (lang && lang !== "gu") {
        setTimeout(() => show(), 0);
      }
    } catch {
      // ignore
    }

    // Listen for page-ready signal from GoogleTranslateScript
    const onPageReady = () => {
      clearAll();
      hide();
    };
    window.addEventListener("nagrikseva:pageReady", onPageReady);
    return () => {
      window.removeEventListener("nagrikseva:pageReady", onPageReady);
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On navigation (only SPA nav - when Gujarati is default)
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Show brief progress bar for SPA navigation (Gujarati mode)
    show();
    timerRef.current = setTimeout(() => {
      clearAll();
      hide();
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      {/* Top progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #ea580c, #f97316, #fb923c)",
          zIndex: 99999,
          transition: "width 0.2s ease, opacity 0.3s ease",
          borderRadius: "0 2px 2px 0",
          boxShadow: "0 0 8px rgba(234,88,12,0.6)",
        }}
      />

      {/* Full-page overlay — covers white flash during translation */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#f9fafb",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          opacity: progress === 100 ? 0 : 1,
          transition: "opacity 0.3s ease",
          pointerEvents: progress === 100 ? "none" : "all",
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #fed7aa",
            borderTop: "4px solid #ea580c",
            borderRadius: "50%",
            animation: "nagrik-spin 0.8s linear infinite",
          }}
        />
        {/* Brand name */}
        <div
          style={{
            fontSize: "14px",
            color: "#9a3412",
            fontWeight: 600,
            letterSpacing: "0.5px",
            fontFamily: "inherit",
          }}
        >
          નાગરિકસેવા AI
        </div>

        <style>{`
          @keyframes nagrik-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
