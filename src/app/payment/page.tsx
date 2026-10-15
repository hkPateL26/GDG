"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import UnifiedCitizenPortal from "@/components/UnifiedCitizenPortal";

function PaymentContent() {
  return (
    <>
      <Navbar />
      <UnifiedCitizenPortal initialTab="documents" initialPaymentOpen={true} />
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-sm">સાયબર ટ્રેઝરી ચુકવણી પોર્ટલ લોડ થઈ રહ્યું છે...</p>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
