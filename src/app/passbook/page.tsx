"use client";

import Navbar from "@/components/Navbar";
import UnifiedCitizenPortal from "@/components/UnifiedCitizenPortal";

export default function PassbookPage() {
  return (
    <>
      <Navbar />
      <UnifiedCitizenPortal initialTab="passbook" />
    </>
  );
}
