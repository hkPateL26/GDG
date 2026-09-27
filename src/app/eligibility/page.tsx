"use client";

import Navbar from "@/components/Navbar";
import UnifiedCitizenPortal from "@/components/UnifiedCitizenPortal";

export default function EligibilityPage() {
  return (
    <>
      <Navbar />
      <UnifiedCitizenPortal initialTab="eligibility" />
    </>
  );
}
