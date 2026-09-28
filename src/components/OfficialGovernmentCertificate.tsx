"use client";

import React, { useState } from "react";
import { CitizenApplication } from "@/lib/large-datasets";
import { CheckCircle2, Download, Printer, X, ShieldCheck, Award, QrCode, Phone, Mail, Globe, Scissors, CreditCard } from "lucide-react";

interface OfficialGovernmentCertificateProps {
  app: CitizenApplication;
  onClose?: () => void;
  isModalPreview?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTIC VECTOR ASSETS: ASHOKA PILLAR & UIDAI LOGOS
// ─────────────────────────────────────────────────────────────────────────────
function AshokaEmblem({ className = "w-10 h-14" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3 Lions representation */}
      <path
        d="M60 12 C50 12 42 18 42 28 C42 38 48 45 46 52 C44 58 38 62 38 70 C38 78 45 84 52 86 C54 75 66 75 68 86 C75 84 82 78 82 70 C82 62 76 58 74 52 C72 45 78 38 78 28 C78 18 70 12 60 12 Z"
        fill="#334155"
      />
      <circle cx="50" cy="32" r="3" fill="#ffffff" />
      <circle cx="70" cy="32" r="3" fill="#ffffff" />
      <path d="M52 46 C56 50 64 50 68 46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      {/* Side Lions */}
      <path d="M26 28 C26 38 32 46 36 54 C32 60 26 66 26 74 C26 80 30 84 36 86 C38 76 44 70 44 60 C44 48 38 40 38 28 C38 22 34 20 30 20 C27 20 26 24 26 28 Z" fill="#475569" />
      <path d="M94 28 C94 38 88 46 84 54 C88 60 94 66 94 74 C94 80 90 84 84 86 C82 76 76 70 76 60 C76 48 82 40 82 28 C82 22 86 20 90 20 C93 20 94 24 94 28 Z" fill="#475569" />
      {/* Abacus Platform */}
      <rect x="18" y="90" width="84" height="14" rx="2" fill="#1e293b" />
      {/* Central Ashoka Chakra on Abacus */}
      <circle cx="60" cy="97" r="5" stroke="#ffffff" strokeWidth="1" fill="#3b82f6" />
      <circle cx="60" cy="97" r="1.5" fill="#ffffff" />
      {/* Bull and Horse decorations */}
      <ellipse cx="36" cy="97" rx="6" ry="3" fill="#94a3b8" />
      <ellipse cx="84" cy="97" rx="6" ry="3" fill="#94a3b8" />
      {/* Lotus Base */}
      <path d="M24 104 C30 114 44 118 60 118 C76 118 90 114 96 104 Z" fill="#334155" />
      {/* Plinth */}
      <rect x="20" y="118" width="80" height="7" rx="1.5" fill="#0f172a" />
      {/* Motto text: सत्यमेव जयते */}
      <text x="60" y="142" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f172a" fontFamily="serif" letterSpacing="0.5">
        सत्यमेव जयते
      </text>
    </svg>
  );
}

function UidaiSunLogo({ className = "w-12 h-14" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="uidaiGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="60%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
      </defs>
      {/* Radiant Sun Rays */}
      {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((deg) => (
        <path
          key={deg}
          d="M60 48 L58 10 L60 4 L62 10 Z"
          fill="url(#uidaiGrad)"
          transform={`rotate(${deg} 60 48)`}
        />
      ))}
      {/* Central Core with fingerprint curves */}
      <circle cx="60" cy="48" r="28" fill="#ffffff" stroke="#ea580c" strokeWidth="2.5" />
      {/* Fingerprint Arcs */}
      <path d="M48 48 A12 12 0 0 1 72 48" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 48 A16 16 0 0 1 76 48" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M52 48 A8 8 0 0 1 68 48" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="48" r="3" fill="#ea580c" />
      {/* Hindi text: आधार */}
      <text x="60" y="112" textAnchor="middle" fontSize="21" fontWeight="900" fill="#dc2626" fontFamily="sans-serif">
        आधार
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CERTIFICATE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function OfficialGovernmentCertificate({
  app,
  onClose,
  isModalPreview = true,
}: OfficialGovernmentCertificateProps) {
  const [viewCardSide, setViewCardSide] = useState<"front" | "back">("front");

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL || "https://nagrikseva-ai.gov.in");

  const verifyUrl = `${origin}/track?id=${encodeURIComponent(app.id)}`;
  const certNumber = `GJ-CERT-2026-${app.id.replace("APP-GUJ-", "")}`;
  const issueDate = app.lastUpdated || "2026-09-28";
  const validUntilDate = "2029-03-31";

  // Service Detection
  const schemeId = (app.schemeId || "").toLowerCase();
  const schemeName = (app.schemeName || "").toLowerCase();
  const schemeNameGu = (app.schemeNameGu || "").toLowerCase();

  const isAadhaar =
    schemeId.includes("aadhaar") ||
    schemeName.includes("aadhaar") ||
    schemeNameGu.includes("આધાર");

  const isPan =
    schemeId.includes("pan") ||
    schemeName.includes("pan") ||
    schemeNameGu.includes("પાન");

  const isRation =
    schemeId.includes("ration") ||
    schemeName.includes("ration") ||
    schemeNameGu.includes("રેશન");

  const isAyushman =
    schemeId.includes("ayushman") ||
    schemeName.includes("ayushman") ||
    schemeId.includes("pmjay") ||
    schemeNameGu.includes("આયુષ્માન");

  const isDriving =
    schemeId.includes("driving") ||
    schemeId.includes("licence") ||
    schemeName.includes("driving") ||
    schemeNameGu.includes("ડ્રાઇવિંગ");

  // Print Engine
  const handlePrint = () => {
    const printArea = document.getElementById("official-cert-print-area");
    if (!printArea) {
      window.print();
      return;
    }

    const oldIframe = document.getElementById("cert-print-frame");
    if (oldIframe) oldIframe.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "cert-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.zIndex = "-1";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const styleTags = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map((el) => el.outerHTML)
      .join("\n");

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="gu">
        <head>
          <title>${isAadhaar ? "UIDAI e-Aadhaar Document" : isPan ? "Income Tax PAN Card" : "Government Document"} - ${app.id}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ${styleTags}
          <style>
            @page {
              size: A4 portrait;
              margin: 6mm;
            }
            body {
              background: #ffffff !important;
              color: #000000 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          </style>
        </head>
        <body>
          <div style="padding: 0;">
            ${printArea.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  // Safe Citizen Benchmark Details
  const citizenNameGu = app.citizenNameGu || "હરી વિનોદરાઈ પટેલ";
  const citizenNameEn = app.citizenName || "Hari Vinodrai Patel";
  const fatherName = "વિનોદરાઈ નારણભાઈ પટેલ";
  const dobStr = "15/06/1985";
  const genderStr = app.gender === "female" ? "સ્ત્રી / Female" : "પુરુષ / Male";
  const villageStr = app.village || "ઓમ નગર (Omnagar)";
  const talukaStr = app.taluka || "Rajkot Urban";
  const districtStr = app.districtGu || app.district || "રાજકોટ";
  const pincodeStr = "360004";
  const mobileStr = app.mobile || "9974442291";
  const formattedAadhaar = `5429 8912 ${app.aadhaarLast4 && app.aadhaarLast4 !== "NEW" ? app.aadhaarLast4 : "1413"}`;
  const eidStr = `4048/93054/00490`;
  const vidStr = `9110 5041 8009 0808`;

  return (
    <div className="relative w-full max-w-4xl mx-auto my-auto bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
      {/* ── Top Bar with Actions ── */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {isAadhaar ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">🪪</span>
              <div>
                <span className="font-black text-xs sm:text-sm text-amber-300 block">
                  ભારતીય વિશિષ્ટ ઓળખ સત્તામંડળ &bull; UIDAI e-Aadhaar Card
                </span>
                <span className="text-[10.5px] text-slate-400">સત્તાવાર આધાર કાર્ડ પત્ર & વોલેટ કાર્ડ (Exact 1:1 Format)</span>
              </div>
            </div>
          ) : isPan ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <div>
                <span className="font-black text-xs sm:text-sm text-amber-300 block">
                  આવકવેરા વિભાગ &bull; Income Tax Department PAN Card
                </span>
                <span className="text-[10.5px] text-slate-400">પરમેનન્ટ એકાઉન્ટ નંબર કાર્ડ (Form 49A)</span>
              </div>
            </div>
          ) : isRation ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">🌾</span>
              <div>
                <span className="font-black text-xs sm:text-sm text-amber-300 block">
                  ગુજરાત અન્ન & નાગરિક પુરવઠા વિભાગ &bull; NFSA Digital Ration Card
                </span>
                <span className="text-[10.5px] text-slate-400">બારકોડેડ રેશનકાર્ડ પુસ્તિકા</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-400" />
              <span className="font-bold text-xs sm:text-sm">
                ગુજરાત સરકાર ડિજિટલ પ્રમાણપત્ર &bull; કાનૂની દસ્તાવેજ
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAadhaar && (
            <button
              type="button"
              onClick={() => setViewCardSide((prev) => (prev === "front" ? "back" : "front"))}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <CreditCard size={13} />
              <span>{viewCardSide === "front" ? "કાર્ડની પાછળની બાજુ (Back)" : "કાર્ડની આગળની બાજુ (Front)"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            <Printer size={14} />
            <span>PDF ડાઉનલોડ / પ્રિન્ટ</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Document Printable Body ── */}
      <div className="p-3 sm:p-6 max-h-[84vh] overflow-y-auto bg-slate-200/80">
        <div
          id="official-cert-print-area"
          className="relative bg-white shadow-2xl rounded-sm overflow-hidden mx-auto max-w-[340px] sm:max-w-[380px] md:max-w-[420px] text-black font-sans border border-slate-300"
        >
          {/* ══════════════════════════════════════════════════════════════════
              DOCUMENT TYPE 1: EXACT 100% REPLICA OF THE USER'S AADHAAR CARD
              (Matched exactly to media_1790610371373.png)
             ══════════════════════════════════════════════════════════════════ */}
          {isAadhaar ? (
            <div className="bg-white flex flex-col justify-between select-none">
              {/* TOP HEADER SECTION */}
              <div className="p-3 pb-0">
                <div className="flex items-start justify-between px-2 pt-1">
                  <div className="flex flex-col items-center">
                    <AshokaEmblem className="w-10 h-14" />
                  </div>
                  <div className="flex flex-col items-center">
                    <UidaiSunLogo className="w-12 h-14" />
                  </div>
                </div>

                {/* Saffron & Green Official Header Banners */}
                <div className="mt-2 text-center text-white space-y-[2px]">
                  <div className="bg-[#f05a22] py-1 px-2 leading-tight">
                    <h2 className="text-sm font-black tracking-wide">ભારત સરકાર</h2>
                    <h3 className="text-xs font-bold leading-none mt-0.5">Government of India</h3>
                  </div>
                  <div className="bg-[#138808] py-1 px-2 leading-tight">
                    <h2 className="text-[11.5px] font-black tracking-tight">ભારતીય વિશિષ્ટ ઓળખ સત્તામંડળ</h2>
                    <h3 className="text-[10px] font-bold leading-none mt-0.5">Unique Identification Authority of India</h3>
                  </div>
                </div>
              </div>

              {/* ENROLMENT NO & CITIZEN LETTER SLIP */}
              <div className="p-3 pt-2 text-[11px] leading-tight space-y-2">
                <p className="font-mono text-[10.5px] text-slate-800">
                  નોંધણી ક્રમ / Enrolment No.: <strong className="font-bold">{eidStr}</strong>
                </p>

                <div className="flex items-start justify-between gap-2 pt-1">
                  {/* Left: Address Block */}
                  <div className="space-y-0.5 max-w-[210px] text-slate-900 leading-snug">
                    <span className="text-[10px] text-slate-600 block">To</span>
                    <p className="font-black text-xs text-black">{citizenNameGu}</p>
                    <p className="text-[11px] font-bold text-slate-800">{citizenNameEn}</p>
                    <p className="text-[10px] text-slate-700">C/O: {fatherName}</p>
                    <p className="text-[10px] text-slate-700">{villageStr}</p>
                    <p className="text-[10px] text-slate-700">{talukaStr}, {districtStr}</p>
                    <p className="text-[10px] text-slate-700">ગુજરાત - {pincodeStr}</p>
                    <p className="text-[10px] font-mono text-slate-800">Mobile: {mobileStr}</p>

                    {/* Barcode Strip */}
                    <div className="pt-2 font-mono text-[9px] tracking-tight">
                      <div className="h-6 flex items-center">
                        <span className="font-black tracking-[3px] text-xs">||||| | |||| ||||| ||||||| ||| ||||||</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: High-Density Verification QR */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="p-1 border border-slate-300 bg-white shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=115x115&data=${encodeURIComponent(
                          `UIDAI-AUTH|${formattedAadhaar}|${citizenNameEn}|${dobStr}|${genderStr}|${pincodeStr}`
                        )}`}
                        alt="Aadhaar QR"
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Big Aadhaar Number in Letter */}
                <div className="text-center pt-2 pb-1 border-b border-slate-200">
                  <p className="text-[11px] font-bold text-slate-800">
                    આપનો <span className="text-[#dc2626]">આધાર</span> ક્રમાંક / Your <span className="text-[#dc2626]">Aadhaar</span> No. :
                  </p>
                  <p className="font-mono font-black text-lg sm:text-xl tracking-[4px] text-black mt-0.5">
                    {formattedAadhaar}
                  </p>
                  <p className="font-mono text-[9.5px] text-slate-600 mt-0.5">VID : {vidStr}</p>
                  <p className="text-sm font-black text-black mt-0.5">
                    મારો <span className="text-[#dc2626]">આધાર</span>, મારી ઓળખ
                  </p>
                </div>
              </div>

              {/* Dotted Scissors Perforation Cut Line */}
              <div className="relative py-1 flex items-center justify-center">
                <div className="w-full border-t border-dashed border-slate-400" />
                <span className="absolute bg-white px-2 text-[10px] text-slate-500 font-bold flex items-center gap-1">
                  <Scissors size={12} className="text-slate-800" />
                </span>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  BOTTOM SECTION: THE EXACT CUTOUT AADHAAR CARD
                  (As shown in bottom half of media_1790610371373.png)
                 ───────────────────────────────────────────────────────────── */}
              {viewCardSide === "front" ? (
                /* ── CARD FRONT ── */
                <div className="m-2 mt-1 border border-slate-400 bg-white p-2.5 space-y-2 relative">
                  {/* Card Front Header */}
                  <div className="flex items-center justify-between">
                    <AshokaEmblem className="w-6 h-9 shrink-0" />
                    <div className="text-center px-1">
                      <div className="h-1 w-full bg-[#f05a22] rounded-full mb-0.5" />
                      <p className="text-[10.5px] font-black text-black leading-none">ભારત સરકાર</p>
                      <p className="text-[9.5px] font-bold text-slate-800 leading-none">Government of India</p>
                      <div className="h-1 w-full bg-[#138808] rounded-full mt-0.5" />
                    </div>
                    <UidaiSunLogo className="w-7 h-9 shrink-0" />
                  </div>

                  {/* Card Front Middle Details */}
                  <div className="flex items-start gap-2 pt-1">
                    {/* Left: Citizen Photo & Vertical Issued Date */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[7.5px] font-mono text-slate-500 [writing-mode:vertical-lr] rotate-180 leading-none">
                        Aadhaar no. issued: {issueDate}
                      </span>
                      <div className="w-18 h-22 border border-black bg-slate-100 overflow-hidden shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/demo-docs/3_pan_card_khunt_harkishan.png"
                          alt="Citizen Photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="space-y-0.5 text-[10px] leading-tight text-slate-900 flex-1">
                      <p className="font-black text-[11px] text-black">{citizenNameGu}</p>
                      <p className="font-bold text-[10px] text-slate-800">{citizenNameEn}</p>
                      <p className="text-[9.5px] text-slate-700">
                        જન્મ તારીખ/DOB: <strong className="font-mono text-black">{dobStr}</strong>
                      </p>
                      <p className="text-[9.5px] text-slate-700">
                        જાતિ/Gender: <strong>{genderStr}</strong>
                      </p>

                      {/* Official Warning Box (Exact match) */}
                      <div className="border border-red-500 bg-red-50/50 p-1 rounded-xs mt-1">
                        <p className="text-[7.5px] font-bold text-black leading-[9px]">
                          આધાર ઓળખનો પુરાવો છે, નાગરિકતા કે જન્મતારીખનો નહીં.
                        </p>
                        <p className="text-[7px] text-slate-600 leading-[8px] mt-0.5 font-sans">
                          Aadhaar is proof of identity, not of citizenship or date of birth.
                        </p>
                      </div>
                    </div>

                    {/* Right: Ghost Photo */}
                    <div className="w-10 h-14 border border-slate-300 bg-slate-50 overflow-hidden opacity-60 grayscale shrink-0 self-start mt-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/demo-docs/3_pan_card_khunt_harkishan.png"
                        alt="Ghost Photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Card Front Bottom Red Line & Giant Aadhaar Number */}
                  <div className="pt-1 border-t-2 border-red-600 text-center">
                    <p className="font-mono font-black text-lg tracking-[4px] text-black leading-none">
                      {formattedAadhaar}
                    </p>
                    <p className="text-[11px] font-black text-black mt-1">
                      મારો <span className="text-[#dc2626]">આધાર</span>, મારી ઓળખ
                    </p>
                  </div>
                </div>
              ) : (
                /* ── CARD BACK (FLIPPABLE WALLET BACK VIEW) ── */
                <div className="m-2 mt-1 border border-slate-400 bg-white p-2.5 space-y-2 relative">
                  {/* Card Back Header */}
                  <div className="text-center border-b border-slate-300 pb-1">
                    <p className="text-[10px] font-black text-black">ભારતીય વિશિષ્ટ ઓળખ સત્તામંડળ</p>
                    <p className="text-[9px] font-bold text-slate-700">Unique Identification Authority of India</p>
                  </div>

                  {/* Card Back Address & Large QR */}
                  <div className="flex items-start justify-between gap-2 text-[10px] leading-snug">
                    <div className="space-y-0.5 text-slate-800 flex-1">
                      <p className="font-black text-black text-[10px]">સરનામું:</p>
                      <p className="text-[9.5px]">C/O: {fatherName}, {villageStr}</p>
                      <p className="text-[9.5px]">{talukaStr}, {districtStr}, ગુજરાત - {pincodeStr}</p>
                      <p className="text-[8.5px] text-slate-500 font-sans mt-1">
                        Address: C/O {fatherName}, {villageStr}, {talukaStr}, {districtStr}, Gujarat - {pincodeStr}
                      </p>
                    </div>

                    <div className="shrink-0 p-1 border border-slate-300 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                          `UIDAI-BACK|${formattedAadhaar}|${villageStr}, ${talukaStr}, ${districtStr}`
                        )}`}
                        alt="Aadhaar Back QR"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                  </div>

                  {/* Card Back Bottom Helpline */}
                  <div className="pt-1 border-t-2 border-red-600 text-center">
                    <p className="font-mono font-black text-base tracking-[3px] text-black leading-none mb-1">
                      {formattedAadhaar}
                    </p>
                    <div className="flex items-center justify-center gap-3 text-[9px] font-bold text-slate-700">
                      <span>📞 1947</span>
                      <span>✉️ help@uidai.gov.in</span>
                      <span>🌐 www.uidai.gov.in</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : isPan ? (
            /* ══════════════════════════════════════════════════════════════════
                DOCUMENT TYPE 2: REAL INCOME TAX PAN CARD
               ══════════════════════════════════════════════════════════════════ */
            <div className="p-4 bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100 rounded-xl border-2 border-blue-900 shadow-md max-w-sm mx-auto space-y-3">
              {/* PAN Header */}
              <div className="flex items-center justify-between border-b border-blue-300 pb-2">
                <div className="flex items-center gap-2">
                  <AshokaEmblem className="w-6 h-8" />
                  <div>
                    <h3 className="text-[10px] font-black text-blue-950 uppercase leading-tight">INCOME TAX DEPARTMENT</h3>
                    <h4 className="text-[9px] font-bold text-slate-700 leading-none">આવકવેરા વિભાગ &bull; GOVT. OF INDIA</h4>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-blue-800">NSDL e-Gov</span>
              </div>

              {/* PAN Number */}
              <div className="text-center bg-white/90 p-2 rounded-lg border border-blue-200 shadow-2xs">
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Permanent Account Number</span>
                <span className="font-mono font-black text-xl text-slate-900 tracking-[3px]">BKZPP1413K</span>
              </div>

              {/* Photo & Details */}
              <div className="flex items-center gap-3 text-xs">
                <div className="w-18 h-22 border border-slate-400 bg-white overflow-hidden shadow-2xs shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/demo-docs/3_pan_card_khunt_harkishan.png" alt="PAN Photo" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 text-slate-900 leading-tight">
                  <div>
                    <span className="text-[9px] text-slate-500 block">Name / નામ:</span>
                    <strong className="text-xs font-black">{citizenNameEn.toUpperCase()}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">Father&apos;s Name / પિતાનું નામ:</span>
                    <strong className="text-[11px]">VINODRAI PATEL</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">Date of Birth / જન્મ તારીખ:</span>
                    <strong className="font-mono text-xs">{dobStr}</strong>
                  </div>
                </div>
              </div>

              {/* Signature Box */}
              <div className="flex items-center justify-between pt-2 border-t border-blue-200 text-[10px]">
                <div className="border border-slate-400 bg-white px-3 py-1 font-mono italic text-slate-800 rounded">
                  Hari V. Patel
                </div>
                <span className="font-mono text-[9px] text-slate-500">UTIITSL / NSDL SECURE</span>
              </div>
            </div>
          ) : isRation ? (
            /* ══════════════════════════════════════════════════════════════════
                DOCUMENT TYPE 3: GUJARAT NFSA DIGITAL RATION CARD
               ══════════════════════════════════════════════════════════════════ */
            <div className="p-4 bg-white border-2 border-emerald-800 space-y-3 text-slate-900">
              <div className="text-center border-b-2 border-emerald-800 pb-2">
                <h2 className="text-sm font-black text-emerald-950">ગુજરાત સરકાર &bull; અન્ન અને નાગરિક પુરવઠા વિભાગ</h2>
                <h3 className="text-xs font-bold text-slate-700">ડિજિટલ રાષ્ટ્રીય ખાદ્ય સુરક્ષા રેશનકાર્ડ (NFSA Barcoded Card)</h3>
                <p className="font-mono text-xs font-bold text-emerald-800 mt-1">કાર્ડ નં: 042100892141 &bull; શ્રેણી: APL-1 (NFSA)</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10.5px] bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                <div>મુખ્ય વડા: <strong>{citizenNameGu}</strong></div>
                <div>FPS દુકાન નં: <strong>8921 (જન સેવા)</strong></div>
                <div>ગામ: <strong>{villageStr}</strong></div>
                <div>તાલુકો: <strong>{talukaStr}</strong></div>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden text-[10.5px]">
                <table className="w-full text-left">
                  <thead className="bg-emerald-800 text-white text-[10px]">
                    <tr>
                      <th className="p-1.5">ક્રમ</th>
                      <th className="p-1.5">સભ્યનું નામ</th>
                      <th className="p-1.5">સંબંધ</th>
                      <th className="p-1.5">ઉંમર</th>
                      <th className="p-1.5">આધાર</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-1.5 font-mono">1</td>
                      <td className="p-1.5 font-bold">{citizenNameGu}</td>
                      <td className="p-1.5">વડા</td>
                      <td className="p-1.5">41</td>
                      <td className="p-1.5 text-emerald-700 font-bold">✓ XXXX-1413</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-mono">2</td>
                      <td className="p-1.5">ભાવનાબેન એચ. પટેલ</td>
                      <td className="p-1.5">પત્ની</td>
                      <td className="p-1.5">38</td>
                      <td className="p-1.5 text-emerald-700 font-bold">✓ XXXX-9021</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════════════
                DOCUMENT TYPE 4: REVENUE & PANCHAYAT DIGITAL CERTIFICATE
               ══════════════════════════════════════════════════════════════════ */
            <div className="border-4 border-double border-slate-900 p-5 rounded-xl space-y-4">
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <AshokaEmblem className="w-10 h-14 mx-auto mb-1" />
                <p className="text-[10px] font-black uppercase text-slate-700">GOVERNMENT OF GUJARAT &bull; ગુજરાત સરકાર</p>
                <h1 className="text-lg font-black text-slate-950">મહેસૂલ અને પંચાયત વિભાગ</h1>
                <p className="text-xs font-bold text-slate-600">તાલુકા મામલતદાર કચેરી, {talukaStr}, જિલ્લો: {districtStr}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between">
                <div>પ્રમાણપત્ર નં: <strong className="font-mono">{certNumber}</strong></div>
                <div>તારીખ: <strong>{issueDate}</strong></div>
                <div>માન્યતા: <strong className="text-emerald-700">{validUntilDate}</strong></div>
              </div>

              <div className="text-center my-3">
                <span className="bg-slate-900 text-amber-300 font-black text-sm px-4 py-1.5 rounded-lg border border-amber-400">
                  {app.schemeNameGu || app.schemeName}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-slate-800 indent-6">
                આથી પ્રમાણિત કરવામાં આવે છે કે શ્રી/શ્રીમતી <strong>{citizenNameGu}</strong>, રહેવાસી ગામ:{" "}
                <strong>{villageStr}</strong>, તાલુકો: <strong>{talukaStr}</strong>, જિલ્લો:{" "}
                <strong>{districtStr}</strong>, આધાર છેલ્લા ૪ આંકડા:{" "}
                <strong className="font-mono">XXXX-XXXX-{app.aadhaarLast4 || "1413"}</strong> દ્વારા કરવામાં આવેલ
                અરજી સંદર્ભે સક્ષમ સત્તાધિકારી દ્વારા તમામ આધાર-પુરાવા કાયદેસર અને માન્ય ઠરેલ છે.
              </p>

              <div className="pt-3 border-t-2 border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(verifyUrl)}`}
                    alt="QR"
                    className="w-14 h-14 border border-slate-300 p-0.5"
                  />
                  <div>
                    <span className="font-black text-emerald-800 flex items-center gap-1">
                      <ShieldCheck size={13} /> અધિકૃત QR
                    </span>
                    <span className="text-[10px] text-slate-500">ઓનલાઇન ખરાઈ માટે</span>
                  </div>
                </div>

                <div className="border border-emerald-600 bg-emerald-50 p-2 rounded text-[10px] text-right">
                  <span className="font-black text-emerald-900 block">✔ DIGITALLY SIGNED</span>
                  <span>મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, {talukaStr}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
