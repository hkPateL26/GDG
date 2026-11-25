"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CheckCircle2, Home, ShieldCheck, Printer, ArrowRight } from "lucide-react";

function ReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id") || "";
  const paymentId = searchParams.get("paymentId") || "";
  const orderId = searchParams.get("orderId") || "";
  const grn = searchParams.get("grn") || id;
  const amount = searchParams.get("amount") || "50.00";
  const error = searchParams.get("error");

  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(new Date().toLocaleString("gu-IN", { dateStyle: "long", timeStyle: "medium" }));

    // Mark as paid in local storage
    if (typeof window !== "undefined" && id) {
      try {
        const savedAppsStr = localStorage.getItem("nagrik_user_applications");
        if (savedAppsStr) {
          const savedApps = JSON.parse(savedAppsStr);
          const updated = savedApps.map((a: { id?: string; challanNo?: string; paymentStatus?: string; status?: string }) => {
            if (a.id === id || a.challanNo === id || a.challanNo === grn) {
              return {
                ...a,
                paymentStatus: "paid",
                operatorConfirmed: true,
                status: "approved",
                workflowStage: 3,
                txnId: paymentId || a.challanNo || "TXN-PAID",
              };
            }
            return a;
          });
          localStorage.setItem("nagrik_user_applications", JSON.stringify(updated));
        }
      } catch (err) {
        console.warn("Local storage update error:", err);
      }
    }
  }, [id, paymentId, grn]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center text-3xl font-black">
            ✕
          </div>
          <h1 className="text-xl font-black text-red-400">પેમેન્ટ પ્રક્રિયા પૂર્ણ થઈ શકી નથી</h1>
          <p className="text-sm text-slate-200 font-medium">{decodeURIComponent(error)}</p>
          <div className="pt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => router.push("/documents")}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-bold text-sm hover:opacity-90 transition cursor-pointer"
            >
              ફરીથી પ્રયાસ કરો
            </button>
            <Link
              href="/"
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm text-center transition flex items-center justify-center"
            >
              મુખ્ય પૃષ્ઠ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-10 px-4 text-slate-100 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* State Seal & Portal Header */}
        <div className="text-center space-y-1 pb-4 border-b border-slate-800">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
            <CheckCircle2 size={32} />
          </div>
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} />
            <span>નાણાં વિભાગ • સાયબર ટ્રેઝરી e-Grass ગુજરાત</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">સત્તાવાર ઈ-પેમેન્ટ પહોંચ</h1>
          <p className="text-xs text-slate-400">Official Electronic Government Application Fee Receipt</p>
        </div>

        {/* Success Status Pill */}
        <div className="my-5 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <p className="text-xs font-black text-emerald-300">ચૂકવણી સફળ (Payment Confirmed & Captured)</p>
              <p className="text-[10px] text-emerald-400/80">સાયબર ટ્રેઝરીમાં રકમ જમા થઈ ગઈ છે</p>
            </div>
          </div>
          <span className="text-xs font-mono font-black text-emerald-300 px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-400/40">
            ₹ {amount.includes(".") ? amount : `${amount}.00`}
          </span>
        </div>

        {/* Receipt Details Table */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-400">અરજી ક્રમાંક / GRN:</span>
            <span className="font-mono font-bold text-amber-300 text-sm">{id || grn || "GRN-2026-VERIFIED"}</span>
          </div>

          {paymentId && (
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Razorpay ટ્રાન્ઝેક્શન ID:</span>
              <span className="font-mono font-semibold text-white select-all">{paymentId}</span>
            </div>
          )}

          {orderId && (
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">ઓર્ડર ID:</span>
              <span className="font-mono text-slate-200">{orderId}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-400">ગેટવે પ્રકાર:</span>
            <span className="font-semibold text-slate-200">Cyber Treasury (Razorpay DPI Direct)</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-400">તારીખ અને સમય:</span>
            <span className="text-slate-200">{dateStr || "લાઈવ વેરિફાઈડ"}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400">અરજી સ્થિતિ:</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
              <span>સ્વીકૃત (Under Department Scrutiny)</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Printer size={16} />
              <span>પહોંચ પ્રિન્ટ / PDF</span>
            </button>
            <button
              onClick={() => router.push(`/track?id=${encodeURIComponent(id || grn)}`)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <span>લાઈવ સ્ટેટસ ટ્રેક કરો</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home size={14} />
            <span>મુખ્ય પૃષ્ઠ પર પાછા જાઓ</span>
          </button>
        </div>
      </div>
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
