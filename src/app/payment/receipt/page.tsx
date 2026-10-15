"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

function ReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      router.replace(`/track?id=${encodeURIComponent(id)}`);
    } else {
      router.replace("/documents");
    }
  }, [id, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="font-bold text-sm">સત્તાવાર સરકારી પહોંચ અને લાઈવ સ્ટેટસ લોડ થઈ રહ્યું છે...</p>
    </div>
  );
}

export default function PaymentReceiptPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-sm">સરકારી પહોંચ લોડ થઈ રહી છે...</p>
          </div>
        }
      >
        <ReceiptContent />
      </Suspense>
    </>
  );
}
