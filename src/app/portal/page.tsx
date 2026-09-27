"use client";

import Navbar from "@/components/Navbar";
import UnifiedCitizenPortal from "@/components/UnifiedCitizenPortal";

export default function CitizenPortalPage() {
  return (
    <>
      <Navbar />
      <UnifiedCitizenPortal initialTab="track" />
    </>
  );
}
