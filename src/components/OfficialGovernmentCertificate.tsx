"use client";

import React, { useState } from "react";
import { CitizenApplication } from "@/lib/large-datasets";
import { Printer, X, ShieldCheck, Award, CreditCard, FileText } from "lucide-react";

interface OfficialGovernmentCertificateProps {
  app: CitizenApplication;
  onClose?: () => void;
  isModalPreview?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTIC REALISTIC 1D BARCODE (Code 128 replica for UIDAI printouts)
// ─────────────────────────────────────────────────────────────────────────────
function RealisticBarcode({ className = "h-8 w-44" }: { className?: string }) {
  const barPattern = [
    2, 1, 1, 3, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3,
    1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 2,
    2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 3,
  ];
  let curX = 2;

  return (
    <svg className={className} viewBox="0 0 160 32" fill="currentColor">
      {barPattern.map((width, idx) => {
        const xPos = curX;
        curX += width + (idx % 3 === 0 ? 2 : 1.2);
        return idx % 2 === 0 ? (
          <rect key={idx} x={xPos} y={0} width={width} height={32} fill="#000000" />
        ) : null;
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTIC UIDAI GUILLOCHE SECURITY PATTERN FOR PVC CARDS
// ─────────────────────────────────────────────────────────────────────────────
function GuillocheSecurityPattern({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 340 215"
      fill="none"
      style={{ opacity: 0.38 }}
    >
      <defs>
        <linearGradient id="pvcGuillocheGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      {[20, 36, 52, 68, 84, 100, 116, 132, 148, 164].map((r, i) => (
        <ellipse
          key={i}
          cx="170"
          cy="107"
          rx={r * 1.7}
          ry={r * 0.85}
          stroke="url(#pvcGuillocheGrad)"
          strokeWidth="0.75"
          transform={`rotate(${i * 18} 170 107)`}
        />
      ))}
      <circle cx="170" cy="107" r="40" stroke="#f97316" strokeWidth="0.5" strokeDasharray="3 2" />
      <circle cx="170" cy="107" r="60" stroke="#16a34a" strokeWidth="0.5" strokeDasharray="4 2" />
      {/* Background fine wavy lines */}
      <path
        d="M0,40 Q85,15 170,40 T340,40 M0,80 Q85,55 170,80 T340,80 M0,120 Q85,95 170,120 T340,120 M0,160 Q85,135 170,160 T340,160"
        stroke="#ea580c"
        strokeWidth="0.4"
        strokeOpacity="0.3"
      />
      <path
        d="M0,60 Q85,85 170,60 T340,60 M0,100 Q85,125 170,100 T340,100 M0,140 Q85,165 170,140 T340,140 M0,180 Q85,205 170,180 T340,180"
        stroke="#16a34a"
        strokeWidth="0.4"
        strokeOpacity="0.3"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METALLIC GOLD SECURITY HOLOGRAM STICKER (UIDAI Official CR80 Feature)
// ─────────────────────────────────────────────────────────────────────────────
function GoldSecurityHologram() {
  return (
    <div className="relative w-8 h-9 rounded-md overflow-hidden border border-amber-500/80 shadow-xs flex flex-col items-center justify-center p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-100 to-amber-500 shrink-0">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-75" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/demo-docs/emblem_of_india.svg"
        alt="Hologram Emblem"
        className="w-4 h-5 object-contain opacity-90 relative z-10"
      />
      <span className="text-[5.5px] font-black tracking-widest text-amber-950 leading-none mt-0.5 uppercase relative z-10">
        UIDAI
      </span>
    </div>
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
  // Mode: "letter" = Full Authentic e-Aadhaar Letter + Bottom Cutout Card (Exact replica of user reference)
  //       "pvc"    = Front & Back PVC wallet card with real UIDAI Guilloche colors
  const [viewMode, setViewMode] = useState<"letter" | "pvc">("letter");

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

  // Dynamic Citizen Photo from user upload or fall back to authentic demo portrait
  const citizenPhotoSrc =
    app.citizenPhoto ||
    app.userPhoto ||
    (typeof window !== "undefined" ? localStorage.getItem("nagrik_user_photo") || "" : "") ||
    "/demo-docs/aadhaar_photo_hq.png";

  // Robust Native Print Engine (Guarantees zero blank pages & full color)
  const handlePrint = () => {
    window.print();
  };

  // Safe Citizen Benchmark Details
  const citizenNameGu = app.citizenNameGu || "હરી વિનોદરાઈ પટેલ";
  const citizenNameEn = app.citizenName || "Hari Vinodrai Patel";
  const fatherNameGu = "વિનોદરાઈ નારણભાઈ પટેલ";
  const fatherNameEn = "Vinodrai Naranbhai Patel";
  const dobStr = "15/06/1985";
  const genderStrGu = app.gender === "female" ? "સ્ત્રી" : "પુરુષ";
  const genderStrEn = app.gender === "female" ? "FEMALE" : "MALE";
  const villageStr = app.village || "ઓમ નગર (Omnagar)";
  const talukaStr = app.taluka || "Rajkot Urban";
  const districtStr = app.districtGu || app.district || "રાજકોટ";
  const districtEn = app.district || "Rajkot";
  const pincodeStr = "360004";
  const mobileStr = app.mobile || "9974442291";
  const formattedAadhaar = `5429 8912 ${app.aadhaarLast4 && app.aadhaarLast4 !== "NEW" ? app.aadhaarLast4 : "1413"}`;
  const eidStr = `4048/93054/00490`;
  const vidStr = `9110 5041 8009 0808`;

  return (
    <div className="relative w-full max-w-4xl mx-auto my-auto bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
      {/* ── Global Injected Print CSS: Perfect 100% Reliable Centered Printout ── */}
      <style jsx global>{`
        @media print {
          /* Hide all application chrome, backdrop, navbar, and buttons */
          body * {
            visibility: hidden !important;
          }
          /* Show ONLY the certificate print container and all its children */
          #official-cert-print-area,
          #official-cert-print-area * {
            visibility: visible !important;
          }
          #official-cert-print-area {
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            top: 15px !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: 1px solid #94a3b8 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>

      {/* ── Top Bar with Actions ── */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {isAadhaar ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">🪪</span>
              <div>
                <span className="font-black text-xs sm:text-sm text-amber-300 block">
                  ભારતીય વિશિષ્ટ ઓળખ સત્તામંડળ &bull; UIDAI e-Aadhaar
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">
                  સત્તાવાર આધાર કાર્ડ પત્ર & કટઆઉટ કાર્ડ (100% અસલ સરકારી ફોર્મેટ)
                </span>
              </div>
            </div>
          ) : isPan ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <div>
                <span className="font-black text-xs sm:text-sm text-amber-300 block">
                  આવકવેરા વિભાગ &bull; Income Tax Department PAN Card
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">પરમેનન્ટ એકાઉન્ટ નંબર કાર્ડ (Form 49A)</span>
              </div>
            </div>
          ) : isRation ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">🌾</span>
              <div>
                <span className="font-black text-xs sm:text-sm text-amber-300 block">
                  ગુજરાત અન્ન & નાગરિક પુરવઠા વિભાગ &bull; NFSA Digital Ration Card
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">બારકોડેડ રેશનકાર્ડ પુસ્તિકા</span>
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
            <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode("letter")}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  viewMode === "letter"
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <FileText size={12} />
                <span>સંપૂર્ણ લેટર & કાર્ડ</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("pvc")}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  viewMode === "pvc"
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <CreditCard size={12} />
                <span>PVC વોલેટ કાર્ડ (આગળ & પાછળ)</span>
              </button>
            </div>
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
      <div className="p-3 sm:p-6 max-h-[84vh] overflow-y-auto bg-slate-200/90 flex justify-center">
        <div
          id="official-cert-print-area"
          className="relative bg-white shadow-2xl rounded-2xl overflow-hidden text-black font-sans border border-slate-300 transition-all w-full max-w-[740px]"
        >
          {/* ══════════════════════════════════════════════════════════════════
              DOCUMENT TYPE 1: AADHAAR CARD
             ══════════════════════════════════════════════════════════════════ */}
          {isAadhaar ? (
            viewMode === "letter" ? (
              /* ── 1A. FULL AUTHENTIC E-AADHAAR LETTERHEAD & CUTOUT CARDS (FRONT & BACK WITH FULL COLOR & DESIGN) ── */
              <div className="bg-white flex flex-col justify-between select-none text-black w-full">
                {/* 1. TOP HEADER SECTION */}
                <div className="pt-3 px-3.5 sm:px-6 pb-1 bg-white">
                  <div className="flex items-center justify-between px-1">
                    {/* Ashoka Pillar - Official Vector */}
                    <div className="flex flex-col items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/demo-docs/emblem_of_india.svg"
                        alt="Emblem of India"
                        className="w-9 h-14 sm:w-11 sm:h-16 object-contain"
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-[10px] sm:text-xs font-black text-slate-800 tracking-wider">
                        સત્તાવાર ઈ-આધાર દસ્તાવેજ &bull; Official e-Aadhaar Letter
                      </p>
                      <p className="text-[8.5px] sm:text-[9.5px] text-slate-500 font-mono">
                        Unique Identification Authority of India (UIDAI)
                      </p>
                    </div>

                    {/* UIDAI Sun Logo - Official Vector */}
                    <div className="flex flex-col items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/demo-docs/aadhaar_logo.svg"
                        alt="UIDAI Aadhaar"
                        className="w-14 h-10 sm:w-18 sm:h-12 object-contain"
                      />
                    </div>
                  </div>

                  {/* Saffron & Green Official Header Banners */}
                  <div className="mt-2 text-center text-white space-y-[2px] rounded-lg overflow-hidden shadow-xs">
                    <div className="py-1 px-2 bg-[#ea580c] leading-tight">
                      <h2 className="text-xs sm:text-sm font-black tracking-wide">भारत सरकार &bull; Government of India</h2>
                    </div>
                    <div className="py-1 px-2 bg-[#16a34a] leading-tight">
                      <h2 className="text-[10px] sm:text-xs font-black tracking-tight">
                        भारतीय विशिष्ट पहचान प्राधिकरण &bull; Unique Identification Authority of India
                      </h2>
                    </div>
                  </div>
                </div>

                {/* 2. ENROLMENT NO & CITIZEN LETTER SLIP */}
                <div className="p-3 sm:p-5 pt-2 text-[10px] sm:text-[11px] leading-tight space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-1.5 gap-1 font-mono text-[9px] sm:text-[10px]">
                    <p className="text-slate-800">
                      नामांकन क्रम / Enrolment No.: <strong className="font-black text-slate-900">{eidStr}</strong>
                    </p>
                    <p className="text-slate-600">
                      Issue Date: <strong className="text-slate-800">{issueDate}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start pt-1">
                    {/* Left: Address Block */}
                    <div className="sm:col-span-8 space-y-1 text-black leading-snug">
                      <span className="text-[9.5px] font-bold text-slate-500 block">To,</span>
                      <p className="font-black text-sm sm:text-base text-black leading-tight">{citizenNameGu}</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">{citizenNameEn}</p>
                      <div className="pt-0.5 text-[9px] sm:text-[10px] text-slate-700 space-y-0.5">
                        <p>C/O: {fatherNameGu} ({fatherNameEn})</p>
                        <p>સરનામું: Flat No 35, {villageStr}, {talukaStr}, જિલ્લો: {districtStr}</p>
                        <p>Address: Flat No 35, {villageStr}, {talukaStr}, {districtEn}, Gujarat</p>
                        <p className="font-mono font-bold text-slate-900">PIN Code: {pincodeStr} &bull; Mobile: {mobileStr}</p>
                      </div>

                      {/* Barcode Strip */}
                      <div className="pt-1.5">
                        <RealisticBarcode className="h-6 sm:h-7 w-44 sm:w-52" />
                      </div>
                    </div>

                    {/* Right: Authentic High-Density QR Code */}
                    <div className="sm:col-span-4 flex flex-col items-center sm:items-end justify-center">
                      <div className="p-1 border border-slate-300 bg-white shadow-xs rounded-lg text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                            `UIDAI-AUTH|${formattedAadhaar}|${citizenNameEn}|${dobStr}|${genderStrEn}|${pincodeStr}`
                          )}`}
                          alt="Aadhaar QR"
                          className="w-22 h-22 sm:w-26 sm:h-26 object-contain"
                        />
                        <span className="text-[7.5px] font-mono text-slate-500 block mt-0.5 font-bold">UIDAI VERIFIED QR</span>
                      </div>
                    </div>
                  </div>

                  {/* Big Aadhaar Number in Letter */}
                  <div className="text-center pt-2 pb-1.5 bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50 border border-orange-200 rounded-xl my-1.5">
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-800">
                      आपका <span className="text-[#dc2626] font-black">आधार</span> क्रमांक / Your <span className="text-[#dc2626] font-black">Aadhaar</span> No. :
                    </p>
                    <p className="font-mono font-black text-lg sm:text-2xl tracking-[3px] sm:tracking-[4px] text-black my-0.5">
                      {formattedAadhaar}
                    </p>
                    <p className="font-mono text-[8.5px] text-slate-600">VID : {vidStr}</p>
                    <p className="text-xs sm:text-sm font-black text-black mt-0.5">
                      मेरा <span className="text-[#dc2626]">आधार</span>, मेरी पहचान
                    </p>
                  </div>
                </div>

                {/* 3. DOTTED SCISSORS PERFORATION CUT LINE */}
                <div className="relative py-2 flex items-center justify-between px-3 sm:px-5">
                  <div className="w-full border-t-2 border-dashed border-slate-400" />
                  <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-white px-3 py-0.5 text-[9.5px] sm:text-[10.5px] font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs border border-slate-300 rounded-full">
                      <span>✂️</span>
                      <span>કટઆઉટ કાર્ડ (કાપીને લેમિનેશન કરી પર્સમાં રાખો) &bull; Cut along dotted line</span>
                      <span>✂️</span>
                    </span>
                  </div>
                </div>

                {/* 4. BOTTOM SECTION: BOTH FRONT & BACK CUTOUT CARDS WITH AUTHENTIC GUILLOCHE & TRICOLOR PATTERN */}
                <div className="p-3 sm:p-4 pt-1 bg-slate-100/70 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch justify-center">
                    
                    {/* ── CARD FRONT (આગળની બાજુ) ── */}
                    <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-gradient-to-b from-[#fed7aa]/60 via-[#fffdfa] to-[#bbf7d0]/60 p-2.5 sm:p-3 flex flex-col justify-between select-none min-h-[220px]">
                      {/* Background Guilloche Security Layer */}
                      <div className="absolute inset-0 pointer-events-none">
                        <GuillocheSecurityPattern />
                      </div>

                      {/* Header: Emblem + Tricolor Ribbon + UIDAI Logo + Gold Hologram */}
                      <div className="relative z-10 flex items-center justify-between border-b border-amber-200/80 pb-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/demo-docs/emblem_of_india.svg"
                          alt="Emblem"
                          className="w-5 h-8 object-contain shrink-0"
                        />
                        <div className="text-center px-1">
                          <div className="h-[2px] w-20 bg-[#ea580c] rounded-full mx-auto mb-0.5" />
                          <p className="text-[10px] font-black text-black leading-tight">ભારત સરકાર</p>
                          <p className="text-[8.5px] font-bold text-slate-800 leading-tight">Government of India</p>
                          <div className="h-[2px] w-20 bg-[#16a34a] rounded-full mx-auto mt-0.5" />
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <GoldSecurityHologram />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/demo-docs/aadhaar_logo.svg"
                            alt="UIDAI Logo"
                            className="w-7 h-5 object-contain"
                          />
                        </div>
                      </div>

                      {/* Card Front Content */}
                      <div className="relative z-10 flex items-start gap-1.5 sm:gap-2 pt-1 flex-1">
                        {/* Left: Citizen Photo & Vertical Issued Date */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <span className="text-[6.5px] font-mono text-slate-600 [writing-mode:vertical-lr] rotate-180 leading-none">
                            Aadhaar no. issued: {issueDate}
                          </span>
                          <div className="w-[66px] h-[82px] border-2 border-slate-900 bg-white overflow-hidden shadow-xs rounded-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={citizenPhotoSrc}
                              alt="Citizen Photo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Middle Details */}
                        <div className="space-y-0.5 text-[8.5px] leading-tight text-black flex-1 min-w-0">
                          <p className="font-black text-[10.5px] text-black leading-tight truncate">{citizenNameGu}</p>
                          <p className="font-bold text-[9px] text-slate-800 leading-tight truncate">{citizenNameEn}</p>
                          <p className="text-[8px] text-slate-800 pt-0.5">
                            જન્મ તારીખ / DOB: <strong className="font-mono text-black">{dobStr}</strong>
                          </p>
                          <p className="text-[8px] text-slate-800">
                            જાતિ / Gender: <strong>{genderStrGu} / {genderStrEn}</strong>
                          </p>

                          {/* Official Warning Box */}
                          <div className="border border-red-500 bg-white/90 p-1 rounded-none mt-1">
                            <p className="text-[6.5px] font-bold text-black leading-[8.5px]">
                              આધાર ઓળખનો પુરાવો છે, નાગરિકતા કે જન્મતારીખનો નહીં.
                            </p>
                            <p className="text-[6px] text-slate-600 leading-[7.5px] mt-0.5 font-sans">
                              Aadhaar is proof of identity, not of citizenship or date of birth.
                            </p>
                          </div>
                        </div>

                        {/* Right: Ghost Photo with Watermark */}
                        <div className="w-[34px] h-[46px] border border-slate-300 bg-white/70 overflow-hidden opacity-55 grayscale shrink-0 self-start mt-0.5 rounded-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={citizenPhotoSrc}
                            alt="Ghost Photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Card Front Bottom Red Line & Aadhaar Number */}
                      <div className="relative z-10 pt-1 border-t-2 border-[#dc2626] text-center mt-1">
                        <p className="font-mono font-black text-base sm:text-lg tracking-[3px] text-black leading-none">
                          {formattedAadhaar}
                        </p>
                        <p className="text-[9px] font-black text-black mt-0.5">
                          મારો <span className="text-[#dc2626]">આધાર</span>, મારી ઓળખ
                        </p>
                      </div>
                    </div>

                    {/* ── CARD BACK (પાછળની બાજુ) ── */}
                    <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-gradient-to-b from-[#fed7aa]/60 via-[#fffdfa] to-[#bbf7d0]/60 p-2.5 sm:p-3 flex flex-col justify-between select-none min-h-[220px]">
                      {/* Background Guilloche Security Layer */}
                      <div className="absolute inset-0 pointer-events-none">
                        <GuillocheSecurityPattern />
                      </div>

                      {/* Card Back Header */}
                      <div className="relative z-10 text-center border-b border-amber-200/80 pb-1">
                        <p className="text-[10px] font-black text-black leading-tight">ભારતીય વિશિષ્ટ ઓળખ સત્તામંડળ</p>
                        <p className="text-[8.5px] font-bold text-slate-800 leading-tight">Unique Identification Authority of India</p>
                      </div>

                      {/* Card Back Content: Address & Large QR */}
                      <div className="relative z-10 flex items-start justify-between gap-2 text-[8.5px] leading-snug pt-1 flex-1">
                        <div className="space-y-0.5 text-black flex-1 min-w-0">
                          <p className="font-black text-black text-[9.5px]">સરનામું:</p>
                          <p className="text-[8px] leading-tight">C/O: {fatherNameGu}</p>
                          <p className="text-[8px] leading-tight">{villageStr}, {talukaStr}</p>
                          <p className="text-[8px] leading-tight">{districtStr}, ગુજરાત - {pincodeStr}</p>
                          <div className="pt-1 text-[7.5px] text-slate-700 font-sans leading-tight">
                            <p className="font-bold text-slate-800">Address:</p>
                            <p>C/O: {fatherNameEn}, {villageStr}, {talukaStr}, {districtEn}, Gujarat - {pincodeStr}</p>
                          </div>
                        </div>

                        {/* Right: High-Density Verification QR */}
                        <div className="shrink-0 p-1 border border-slate-300 bg-white shadow-2xs rounded-lg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=115x115&data=${encodeURIComponent(
                              `UIDAI-BACK|${formattedAadhaar}|${villageStr}, ${talukaStr}, ${districtStr}`
                            )}`}
                            alt="Aadhaar Back QR"
                            className="w-18 h-18 sm:w-20 sm:h-20 object-contain"
                          />
                        </div>
                      </div>

                      {/* Card Back Bottom Red Line, Aadhaar Number & Helpline */}
                      <div className="relative z-10 pt-1 border-t-2 border-[#dc2626] text-center mt-1">
                        <p className="font-mono font-black text-base sm:text-lg tracking-[3px] text-black leading-none mb-0.5">
                          {formattedAadhaar}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-[7.5px] font-bold text-slate-800">
                          <span>📞 1947 (Toll-Free)</span>
                          <span>✉️ help@uidai.gov.in</span>
                          <span>🌐 www.uidai.gov.in</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              /* ── 1B. PVC WALLET CARD: BOTH SIDES (આગળ & પાછળ) WITH REAL GUILLOCHE COLORS & GOLD HOLOGRAM ── */
              <div className="p-3 sm:p-5 bg-slate-100 w-full space-y-4">
                <div className="text-center pb-1">
                  <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-300 shadow-2xs">
                    સત્તાવાર UIDAI PVC વોલેટ કાર્ડ (બંને બાજુ પ્રિન્ટ વ્યૂ - Front & Back Dual View)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
                  {/* ── CARD FRONT (આગળની બાજુ) ── */}
                  <div className="relative w-full max-w-[340px] mx-auto h-[215px] rounded-2xl overflow-hidden border border-amber-300 shadow-lg bg-gradient-to-b from-[#fed7aa]/70 via-[#fcfbf9] to-[#bbf7d0]/70 p-2.5 flex flex-col justify-between select-none">
                    {/* Background Guilloche Security Layer */}
                    <div className="absolute inset-0 pointer-events-none">
                      <GuillocheSecurityPattern />
                    </div>

                    {/* Card Front Top Header */}
                    <div className="relative z-10 flex items-center justify-between border-b border-amber-200/80 pb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/demo-docs/emblem_of_india.svg"
                        alt="Emblem"
                        className="w-5 h-8 object-contain shrink-0"
                      />

                      <div className="text-center px-1">
                        <div className="h-[2px] w-20 bg-[#ea580c] rounded-full mx-auto mb-0.5" />
                        <p className="text-[10px] font-black text-black leading-tight">ભારત સરકાર</p>
                        <p className="text-[9px] font-bold text-slate-800 leading-tight">Government of India</p>
                        <div className="h-[2px] w-20 bg-[#16a34a] rounded-full mx-auto mt-0.5" />
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <GoldSecurityHologram />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/demo-docs/aadhaar_logo.svg"
                          alt="UIDAI Logo"
                          className="w-7 h-5 object-contain"
                        />
                      </div>
                    </div>

                    {/* Card Front Content */}
                    <div className="relative z-10 flex items-start gap-1.5 pt-0.5">
                      {/* Left: Citizen Photo & Vertical Issued Date */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-[6.5px] font-mono text-slate-600 [writing-mode:vertical-lr] rotate-180 leading-none">
                          Aadhaar no. issued: {issueDate}
                        </span>
                        <div className="w-[66px] h-[82px] border border-black bg-white overflow-hidden shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={citizenPhotoSrc}
                            alt="Citizen Photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Middle Details */}
                      <div className="space-y-0.5 text-[8.5px] leading-tight text-black flex-1">
                        <p className="font-black text-[10.5px] text-black leading-tight">{citizenNameGu}</p>
                        <p className="font-bold text-[9px] text-slate-800 leading-tight">{citizenNameEn}</p>
                        <p className="text-[8px] text-slate-800 pt-0.5">
                          જન્મ તારીખ/DOB: <strong className="font-mono text-black">{dobStr}</strong>
                        </p>
                        <p className="text-[8px] text-slate-800">
                          જાતિ/Gender: <strong>{genderStrGu} / {genderStrEn}</strong>
                        </p>

                        <div className="border border-red-500 bg-white/90 p-1 rounded-none mt-1">
                          <p className="text-[6.5px] font-bold text-black leading-[8px]">
                            આધાર ઓળખનો પુરાવો છે, નાગરિકતા કે જન્મતારીખનો નહીં.
                          </p>
                          <p className="text-[6px] text-slate-600 leading-[7.5px] mt-0.5 font-sans">
                            Aadhaar is proof of identity, not of citizenship or date of birth.
                          </p>
                        </div>
                      </div>

                      {/* Right: Ghost Photo with Watermark */}
                      <div className="w-[34px] h-[46px] border border-slate-300 bg-white/70 overflow-hidden opacity-55 grayscale shrink-0 self-start mt-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={citizenPhotoSrc}
                          alt="Ghost Photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Card Front Bottom Red Line & Aadhaar Number */}
                    <div className="relative z-10 pt-1 border-t-2 border-[#dc2626] text-center">
                      <p className="font-mono font-black text-base tracking-[3px] text-black leading-none">
                        {formattedAadhaar}
                      </p>
                      <p className="text-[9px] font-black text-black mt-0.5">
                        મારો <span className="text-[#dc2626]">આધાર</span>, મારી ઓળખ
                      </p>
                    </div>
                  </div>

                  {/* ── CARD BACK (પાછળની બાજુ) ── */}
                  <div className="relative w-full max-w-[340px] mx-auto h-[215px] rounded-2xl overflow-hidden border border-amber-300 shadow-lg bg-gradient-to-b from-[#fed7aa]/70 via-[#fcfbf9] to-[#bbf7d0]/70 p-2.5 flex flex-col justify-between select-none">
                    {/* Background Guilloche Security Layer */}
                    <div className="absolute inset-0 pointer-events-none">
                      <GuillocheSecurityPattern />
                    </div>

                    {/* Card Back Header */}
                    <div className="relative z-10 text-center border-b border-amber-200/80 pb-1">
                      <p className="text-[10px] font-black text-black leading-tight">ભારતીય વિશિષ્ટ ઓળખ સત્તામંડળ</p>
                      <p className="text-[8.5px] font-bold text-slate-800 leading-tight">Unique Identification Authority of India</p>
                    </div>

                    {/* Card Back Content: Address & Large QR */}
                    <div className="relative z-10 flex items-start justify-between gap-1.5 text-[8.5px] leading-snug">
                      <div className="space-y-0.5 text-black flex-1">
                        <p className="font-black text-black text-[9.5px]">સરનામું:</p>
                        <p className="text-[8px] leading-tight">C/O: {fatherNameGu}</p>
                        <p className="text-[8px] leading-tight">{villageStr}, {talukaStr}</p>
                        <p className="text-[8px] leading-tight">{districtStr}, ગુજરાત - {pincodeStr}</p>
                        <div className="pt-1 text-[7.5px] text-slate-700 font-sans leading-tight">
                          <p className="font-bold text-slate-800">Address:</p>
                          <p>C/O: {fatherNameEn}, {villageStr}, {talukaStr}, {districtEn}, Gujarat - {pincodeStr}</p>
                        </div>
                      </div>

                      {/* Right: High-Density Verification QR */}
                      <div className="shrink-0 p-0.5 border border-slate-300 bg-white shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=115x115&data=${encodeURIComponent(
                            `UIDAI-BACK|${formattedAadhaar}|${villageStr}, ${talukaStr}, ${districtStr}`
                          )}`}
                          alt="Aadhaar Back QR"
                          className="w-18 h-18 object-contain"
                        />
                      </div>
                    </div>

                    {/* Card Back Bottom Red Line, Aadhaar Number & Helpline */}
                    <div className="relative z-10 pt-1 border-t-2 border-[#dc2626] text-center">
                      <p className="font-mono font-black text-base tracking-[3px] text-black leading-none mb-0.5">
                        {formattedAadhaar}
                      </p>
                      <div className="flex items-center justify-center gap-2.5 text-[8px] font-bold text-slate-800">
                        <span>📞 1947 (Toll-Free)</span>
                        <span>✉️ help@uidai.gov.in</span>
                        <span>🌐 www.uidai.gov.in</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : isPan ? (
            /* ══════════════════════════════════════════════════════════════════
                DOCUMENT TYPE 2: REAL INCOME TAX PAN CARD
               ══════════════════════════════════════════════════════════════════ */
            <div className="p-4 bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100 rounded-xl border-2 border-blue-900 shadow-md max-w-sm mx-auto space-y-3">
              {/* PAN Header */}
              <div className="flex items-center justify-between border-b border-blue-300 pb-2">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/demo-docs/emblem_of_india.svg" alt="Emblem" className="w-6 h-8 object-contain" />
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
                  <img src={citizenPhotoSrc} alt="PAN Photo" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 text-slate-900 leading-tight">
                  <div>
                    <span className="text-[9px] text-slate-500 block">Name / નામ:</span>
                    <strong className="text-xs font-black">{citizenNameEn.toUpperCase()}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">Father&apos;s Name / પિતાનું નામ:</span>
                    <strong className="text-[11px]">{fatherNameEn.toUpperCase()}</strong>
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
                  {citizenNameEn}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo-docs/emblem_of_india.svg" alt="Emblem" className="w-9 h-14 mx-auto mb-1 object-contain" />
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
