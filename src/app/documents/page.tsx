"use client";

import Navbar from "@/components/Navbar";
import UnifiedCitizenPortal from "@/components/UnifiedCitizenPortal";

export default function DocumentsPage() {
  return (
    <>
      <Navbar />
      <UnifiedCitizenPortal initialTab="documents" />
    </>
  );
}
