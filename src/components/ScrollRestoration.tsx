"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Disable automatic scroll restoration so browser never restores previous scroll on refresh or back
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Immediately scroll to the top of the page on initial load and route changes
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

  return null;
}
