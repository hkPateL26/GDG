"use client";

import Navbar from "@/components/Navbar";
import UnifiedCitizenPortal from "@/components/UnifiedCitizenPortal";

export default function TrackPage() {
  return (
    <>
      <Navbar />
      <UnifiedCitizenPortal initialTab="track" />
    </>
  );
}
