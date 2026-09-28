"use client";

import Navbar from "@/components/Navbar";
import UnifiedCitizenPortal from "@/components/UnifiedCitizenPortal";

export default function AdminPortalPage() {
  return (
    <>
      <Navbar />
      <UnifiedCitizenPortal initialMode="officer" initialTab="track" />
    </>
  );
}
