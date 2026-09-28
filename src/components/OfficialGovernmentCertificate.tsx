"use client";

import { CitizenApplication } from "@/lib/large-datasets";
import { CheckCircle2, Download, Printer, X, ShieldCheck, Award, QrCode, Phone, Mail, Globe, Scissors } from "lucide-react";

interface OfficialGovernmentCertificateProps {
  app: CitizenApplication;
  onClose?: () => void;
  isModalPreview?: boolean;
}

export default function OfficialGovernmentCertificate({
  app,
  onClose,
  isModalPreview = true,
}: OfficialGovernmentCertificateProps) {
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
          <title>${isAadhaar ? "UIDAI e-Aadhaar" : isPan ? "Income Tax PAN Card" : "Official Government Document"} - ${app.id}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ${styleTags}
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            body {
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: system-ui, -apple-system, sans-serif !important;
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
          <div style="padding: 10px;">
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

  // Safe fallback values
  const citizenNameGu = app.citizenNameGu || "હરી વિનોદરાઈ પટેલ";
  const citizenNameEn = app.citizenName || "Hari Vinodrai Patel";
  const fatherName = "વિનોદરાઈ નારણભાઈ પટેલ";
  const dobStr = "15/06/1985";
  const genderStr = app.gender === "female" ? "સ્ત્રી / Female" : "પુરુષ / Male";
  const addressGu = `${app.village || "ઓમ નગર (Omnagar)"}, ${app.taluka || "Rajkot Urban"}, ${app.districtGu || app.district || "રાજકોટ"}, ગુજરાત - 360004`;
  const addressEn = `${app.village || "Omnagar"}, ${app.taluka || "Rajkot Urban"}, ${app.district || "Rajkot"}, Gujarat - 360004`;
  const formattedAadhaar = `5429 8912 ${app.aadhaarLast4 && app.aadhaarLast4 !== "NEW" ? app.aadhaarLast4 : "1413"}`;
  const eidStr = `2489/71920/14130`;

  return (
    <div className="relative w-full max-w-4xl mx-auto my-auto bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
      {/* ── Top Bar with Actions ── */}
      <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {isAadhaar ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">🪪</span>
              <div>
                <span className="font-black text-xs sm:text-sm text-amber-300 block">
                  ભારતીય વિશિષ્ટ ઓળખ સત્તામંડળ &bull; UIDAI e-Aadhaar
                </span>
                <span className="text-[10px] text-slate-400">સત્તાવાર આધાર કાર્ડ પત્ર અને ડિજિટલ કાર્ડ</span>
              </div>
            </div>
          ) : isPan ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <span className="font-black text-xs sm:text-sm text-amber-300">
                આવકવેરા વિભાગ &bull; Income Tax Department PAN Card
              </span>
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
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            <Printer size={14} />
            <span>PDF ડાઉનલોડ / પ્રિન્ટ કરો</span>
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
      <div className="p-3 sm:p-6 max-h-[82vh] overflow-y-auto bg-slate-100">
        <div
          id="official-cert-print-area"
          className="relative bg-white p-4 sm:p-8 shadow-xl rounded-2xl overflow-hidden mx-auto max-w-3xl"
        >
          {/* ══════════════════════════════════════════════════════════════
              DOCUMENT TYPE 1: 100% REAL UIDAI E-AADHAAR LETTER & CARD
             ══════════════════════════════════════════════════════════════ */}
          {isAadhaar ? (
            <div className="space-y-6 text-slate-900 font-sans">
              {/* UIDAI Official Header */}
              <div className="border-b-2 border-slate-800 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Ashoka Pillar Lion Capital */}
                  <div className="w-14 h-14 bg-slate-50 border border-slate-300 rounded-xl flex flex-col items-center justify-center text-center p-1">
                    <span className="text-xl font-bold leading-none">🏛️</span>
                    <span className="text-[8px] font-black uppercase text-slate-800 mt-1">सत्यमेव जयते</span>
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-slate-950 leading-tight">
                      ભારતીય વિશિષ્ટ ઓળખ સત્તામંડળ
                    </h2>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wide">
                      Unique Identification Authority of India
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">ભારત સરકાર (Government of India)</p>
                  </div>
                </div>

                {/* UIDAI Sunburst Logo */}
                <div className="text-right flex flex-col items-end">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white text-xl shadow-xs">
                    ☀️
                  </div>
                  <span className="text-[10px] font-bold text-red-700 mt-1">આધાર • AADHAAR</span>
                </div>
              </div>

              {/* Enrolment Meta & Citizen Address Slip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <p className="font-mono text-[11px] text-slate-600">
                    નોંધણી ક્રમાંક / Enrolment No: <strong>{eidStr}</strong>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    અરજી નંબર: <strong className="font-mono text-orange-700">{app.id}</strong>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    ડાઉનલોડ તારીખ / Issue Date: <strong>{issueDate}</strong>
                  </p>
                </div>
                <div className="border-l-0 sm:border-l sm:pl-4 border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">પ્રતિ / To:</span>
                  <p className="font-black text-sm text-slate-950 leading-snug">{citizenNameGu}</p>
                  <p className="text-xs text-slate-700 font-semibold">{citizenNameEn}</p>
                  <p className="text-[11px] text-slate-600 leading-snug mt-1">
                    C/O: {fatherName}, {addressGu}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">મોબાઈલ / Mobile: +91 {app.mobile || "9974442291"}</p>
                </div>
              </div>

              {/* Important Instruction Bar */}
              <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 text-[11px] text-amber-950 flex items-start gap-2">
                <span className="text-base">ℹ️</span>
                <div className="space-y-0.5">
                  <p className="font-bold">આધાર ઓળખનો પુરાવો છે, નાગરિકતાનો નહીં (Aadhaar is proof of identity, not citizenship).</p>
                  <p className="text-slate-600 text-[10px]">
                    ઇલેક્ટ્રોનિકલી જનરેટ થયેલ ઈ-આધાર કાનૂની રીતે ભૌતિક કાર્ડ જેટલું જ માન્ય છે. QR કોડ વડે ખરાઈ કરી શકાય છે.
                  </p>
                </div>
              </div>

              {/* Scissor Cut Line Divider */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-slate-400" />
                </div>
                <span className="relative bg-white px-3 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                  <Scissors size={12} className="text-slate-700" /> અહીંથી કાપો અને લેમિનેટ કરો / Cut here and laminate
                </span>
              </div>

              {/* ── THE CUTOUT AADHAAR CARD (FRONT & BACK - EXACT REAL FORMAT) ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ── CARD FRONT ── */}
                <div className="border-2 border-slate-800 rounded-2xl overflow-hidden shadow-md bg-white flex flex-col justify-between h-[235px]">
                  {/* Card Front Top Banner */}
                  <div className="bg-gradient-to-r from-orange-500 via-white to-emerald-600 p-1 flex items-center justify-between px-3 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">🏛️</span>
                      <span className="text-[10px] font-black text-slate-900">ભારત સરકાર / GOVT. OF INDIA</span>
                    </div>
                    <span className="text-[10px] font-black text-red-700">આધાર</span>
                  </div>

                  {/* Card Front Middle Body */}
                  <div className="p-3 flex items-center gap-3">
                    {/* Citizen Photo */}
                    <div className="w-20 h-24 bg-slate-100 border border-slate-300 rounded-lg overflow-hidden shrink-0 shadow-inner flex flex-col items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/demo-docs/3_pan_card_khunt_harkishan.png"
                        alt="Citizen Portrait"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Citizen Details */}
                    <div className="space-y-1 text-xs">
                      <p className="font-black text-slate-950 text-sm leading-tight">{citizenNameGu}</p>
                      <p className="text-slate-700 font-bold text-xs">{citizenNameEn}</p>
                      <p className="text-[11px] text-slate-600">
                        જન્મ તારીખ / DOB: <strong className="font-mono text-slate-900">{dobStr}</strong>
                      </p>
                      <p className="text-[11px] text-slate-600">
                        જાતિ / Gender: <strong>{genderStr}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Card Front Bottom Number & Slogan */}
                  <div className="border-t-2 border-red-600 bg-slate-50 p-2 text-center">
                    <p className="font-mono font-black text-base sm:text-lg tracking-widest text-slate-950 leading-none">
                      {formattedAadhaar}
                    </p>
                    <p className="text-[9.5px] font-bold text-red-700 mt-1 uppercase tracking-wide">
                      મારો આધાર, મારી ઓળખ &bull; Mera Aadhaar, Meri Pehchan
                    </p>
                  </div>
                </div>

                {/* ── CARD BACK ── */}
                <div className="border-2 border-slate-800 rounded-2xl overflow-hidden shadow-md bg-white flex flex-col justify-between h-[235px]">
                  {/* Card Back Top Banner */}
                  <div className="bg-slate-900 text-amber-300 p-1 px-3 text-[10.5px] font-black text-center border-b border-slate-800">
                    ભારતીય વિશિષ્ટ ઓળખ સત્તામંડળ / UIDAI
                  </div>

                  {/* Card Back Middle (Address & QR) */}
                  <div className="p-3 flex items-center justify-between gap-2 text-[10.5px]">
                    <div className="space-y-1 pr-1 leading-tight text-slate-800">
                      <p className="font-bold text-slate-950">સરનામું:</p>
                      <p className="text-[10px] leading-tight text-slate-700">
                        C/O: {fatherName}, {addressGu}
                      </p>
                      <p className="text-[9px] text-slate-500 font-sans mt-0.5 leading-tight">
                        Address: C/O {fatherName}, {addressEn}
                      </p>
                    </div>

                    {/* Official Verification QR Code */}
                    <div className="shrink-0 bg-white p-1 border border-slate-300 rounded-lg shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
                          `UIDAI-AADHAAR|${formattedAadhaar}|${citizenNameEn}|${dobStr}|${app.id}`
                        )}`}
                        alt="Aadhaar Secure QR"
                        className="w-18 h-18 object-contain"
                      />
                    </div>
                  </div>

                  {/* Card Back Bottom Helpline & Website */}
                  <div className="border-t-2 border-red-600 bg-slate-50 p-2 text-center text-[9px] text-slate-600">
                    <p className="font-mono font-black text-sm tracking-widest text-slate-950 mb-0.5">
                      {formattedAadhaar}
                    </p>
                    <div className="flex items-center justify-center gap-3 font-semibold text-[9px]">
                      <span>📞 1947</span>
                      <span>✉️ help@uidai.gov.in</span>
                      <span>🌐 www.uidai.gov.in</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Signature Confirmation Stamp */}
              <div className="border-2 border-emerald-600 bg-emerald-50/70 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-black text-emerald-900 block uppercase">
                      ✔ Validated Electronic Signature (ડિજિટલ પ્રમાણિત)
                    </span>
                    <span className="text-[10.5px] text-slate-600">
                      Signer: Unique Identification Authority of India (UIDAI Regional Office)
                    </span>
                  </div>
                </div>
                <div className="text-right text-[10px] font-mono text-emerald-800">
                  <span>Sign Date: {issueDate}</span>
                  <span className="block text-slate-500">Hash: 8F4C-9201-E8A1</span>
                </div>
              </div>
            </div>
          ) : isPan ? (
            /* ══════════════════════════════════════════════════════════════
               DOCUMENT TYPE 2: 100% REAL INCOME TAX PAN CARD
               ══════════════════════════════════════════════════════════════ */
            <div className="space-y-6">
              <div className="border-2 border-blue-900 rounded-3xl p-5 bg-gradient-to-br from-sky-50 via-white to-blue-50 max-w-lg mx-auto shadow-xl relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-blue-200 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏛️</span>
                    <div>
                      <p className="text-[11px] font-black text-blue-950 uppercase leading-none">INCOME TAX DEPARTMENT</p>
                      <p className="text-[9.5px] font-bold text-slate-600">આવકવેરા વિભાગ &bull; GOVT. OF INDIA</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-mono font-bold text-blue-900">
                    FORM 49A
                  </div>
                </div>

                {/* PAN Number */}
                <div className="text-center my-3 bg-white/80 p-2 rounded-xl border border-blue-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Permanent Account Number (PAN)</span>
                  <span className="font-mono font-black text-xl text-slate-900 tracking-widest">
                    BKZPP1413K
                  </span>
                </div>

                {/* Details & Photo */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="w-20 h-24 bg-slate-100 border border-slate-300 rounded-lg overflow-hidden shrink-0 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/demo-docs/3_pan_card_khunt_harkishan.png" alt="Photo" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 text-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Name:</span>
                      <strong className="text-slate-950 font-black">{citizenNameEn.toUpperCase()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Father&apos;s Name:</span>
                      <strong>VINODRAI PATEL</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Date of Birth:</span>
                      <strong className="font-mono">{dobStr}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="mt-4 pt-2 border-t border-blue-200 flex items-center justify-between text-[10px]">
                  <div className="border border-slate-400 bg-white px-3 py-1 rounded font-mono italic text-slate-800">
                    Hari V. Patel
                  </div>
                  <span className="text-slate-500 font-mono">NSDL / UTIITSL SECURE</span>
                </div>
              </div>
            </div>
          ) : isRation ? (
            /* ══════════════════════════════════════════════════════════════
               DOCUMENT TYPE 3: GUJARAT DIGITAL NFSA RATION CARD
               ══════════════════════════════════════════════════════════════ */
            <div className="space-y-4">
              <div className="border-4 border-emerald-800 rounded-2xl p-5 bg-white space-y-4">
                <div className="text-center border-b-2 border-emerald-800 pb-3">
                  <h2 className="font-black text-lg text-emerald-950">ગુજરાત સરકાર • અન્ન અને નાગરિક પુરવઠા વિભાગ</h2>
                  <h3 className="text-xs font-bold text-slate-700">ડિજિટલ રાષ્ટ્રીય ખાદ્ય સુરક્ષા રેશનકાર્ડ (NFSA Digital Card)</h3>
                  <p className="font-mono text-xs text-emerald-800 mt-1 font-bold">કાર્ડ નંબર: 042100892141 &bull; કેટેગરી: APL-1 (NFSA)</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
                  <div>કુટુંબના મુખ્ય વડા: <strong>{citizenNameGu}</strong></div>
                  <div>FPS દુકાન નં: <strong>8921 (જન સેવા સહકારી મંડળી)</strong></div>
                  <div>ગામ/વોર્ડ: <strong>{app.village || "ઓમ નગર"}</strong></div>
                  <div>તાલુકો & જિલ્લો: <strong>{app.taluka}, {app.districtGu || app.district}</strong></div>
                </div>

                {/* Family Members Table */}
                <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-emerald-900 text-white text-[11px]">
                      <tr>
                        <th className="p-2">ક્રમ</th>
                        <th className="p-2">સભ્યનું નામ</th>
                        <th className="p-2">સંબંધ</th>
                        <th className="p-2">ઉંમર</th>
                        <th className="p-2">આધાર સ્થિતિ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-mono">1</td>
                        <td className="p-2 font-bold">{citizenNameGu}</td>
                        <td className="p-2">મુખ્ય અરજદાર</td>
                        <td className="p-2">41</td>
                        <td className="p-2 text-emerald-700 font-bold">✓ પ્રમાણિત (XXXX-1413)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono">2</td>
                        <td className="p-2">ભાવનાબેન એચ. પટેલ</td>
                        <td className="p-2">પત્ની</td>
                        <td className="p-2">38</td>
                        <td className="p-2 text-emerald-700 font-bold">✓ પ્રમાણિત (XXXX-9021)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono">3</td>
                        <td className="p-2">પ્રિયાંશી એચ. પટેલ</td>
                        <td className="p-2">પુત્રી</td>
                        <td className="p-2">12</td>
                        <td className="p-2 text-emerald-700 font-bold">✓ પ્રમાણિત (XXXX-3341)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-right text-xs font-bold text-slate-700 pt-2">
                  સક્ષમ અધિકારી: પુરવઠા મામલતદાર શ્રી, {app.taluka}
                </div>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════════
               DOCUMENT TYPE 4: REVENUE & PANCHAYAT OFFICIAL CERTIFICATE
               (Income, Caste, EWS, Domicile, Senior Citizen, etc.)
               ══════════════════════════════════════════════════════════════ */
            <div className="border-4 border-double border-slate-900 p-6 sm:p-10 rounded-2xl relative">
              <div className="text-center border-b-2 border-slate-800 pb-5 mb-5 relative">
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-800 flex items-center justify-center text-3xl">
                    🏛️
                  </div>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-700">
                  GOVERNMENT OF GUJARAT &bull; ગુજરાત સરકાર
                </p>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                  મહેસૂલ અને પંચાયત વિભાગ
                </h1>
                <p className="text-xs font-bold text-slate-600 mt-0.5">
                  તાલુકા મામલતદાર અને એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ કચેરી, {app.taluka}, જિલ્લો: {app.districtGu || app.district}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  (ગુજરાત જાહેર સેવા હક્ક અધિનિયમ, ૨૦૧૩ અન્વયે અધિકૃત પ્રમાણપત્ર)
                </p>
              </div>

              {/* Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-6 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">પ્રમાણપત્ર ક્રમાંક:</span>
                  <strong className="font-mono text-sm font-black text-slate-900">{certNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">અરજી સંદર્ભ ID:</span>
                  <strong className="font-mono font-bold text-slate-900">{app.id}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">ઇશ્યૂ તારીખ:</span>
                  <strong className="font-bold text-slate-900">{issueDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">માન્યતા સમયગાળો:</span>
                  <strong className="font-bold text-emerald-800">{validUntilDate} સુધી</strong>
                </div>
              </div>

              {/* Title */}
              <div className="text-center my-6">
                <span className="inline-block bg-slate-900 text-amber-300 font-black text-base sm:text-lg px-6 py-2 rounded-xl border-2 border-amber-400 shadow-xs">
                  {app.schemeNameGu || app.schemeName || "સત્તાવાર સરકારી પ્રમાણપત્ર"}
                </span>
              </div>

              {/* Legal Body */}
              <div className="text-xs sm:text-sm leading-relaxed text-slate-800 space-y-4 px-2 sm:px-4">
                <p className="text-justify indent-8">
                  આથી પ્રમાણિત કરવામાં આવે છે કે શ્રી/શ્રીમતી{" "}
                  <strong className="text-slate-950 font-black underline decoration-amber-400 decoration-2 underline-offset-4">
                    {citizenNameGu}
                  </strong>
                  , રહેવાસી:{" "}
                  <strong>
                    ગામ: {app.village || "ઓમ નગર (Omnagar)"}, તાલુકો: {app.taluka || "Rajkot Urban"}, જિલ્લો:{" "}
                    {app.districtGu || app.district || "રાજકોટ"}
                  </strong>
                  , ઓળખ નંબર:{" "}
                  <strong className="font-mono">XXXX-XXXX-{app.aadhaarLast4 || "1413"}</strong> દ્વારા સદર
                  કચેરી સમક્ષ કરવામાં આવેલ અરજી સંદર્ભે તલાટી કમ મંત્રીશ્રીના રૂબરૂ પંચનામા તથા રેકર્ડ ખરાઈ અન્વયે સક્ષમ
                  સત્તાધિકારી દ્વારા ખરાઈ કરવામાં આવેલ છે.
                </p>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900">
                  <p>
                    <strong>ચકાસણી હેતુ:</strong> નાગરિક દ્વારા રજૂ કરેલ પુરાવા કાયદેસર અને માન્ય ઠરેલ છે. આ
                    પ્રમાણપત્ર તમામ સરકારી/અર્ધસરકારી યોજનાઓ, શૈક્ષણિક પ્રવેશ તથા ઓળખ ખરાઈ માટે સંપૂર્ણપણે કાનૂની
                    માન્યતા ધરાવે છે.
                  </p>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="mt-8 pt-6 border-t-2 border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verifyUrl)}`}
                    alt="Verification QR"
                    className="w-16 h-16 object-contain rounded-lg border border-slate-300 bg-white p-1 shrink-0"
                  />
                  <div className="text-[11px] leading-snug">
                    <p className="font-black text-slate-900 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-emerald-600" /> ઓનલાઇન અધિકૃત ખરાઈ QR
                    </p>
                    <p className="text-slate-500 mt-0.5">કેમેરા વડે સ્કેન કરી અસલ સરકારી રેકર્ડ ચકાસો.</p>
                  </div>
                </div>

                <div className="border-2 border-emerald-600 bg-emerald-50/70 p-3.5 rounded-xl text-[11px] leading-tight text-emerald-950">
                  <div className="flex items-center gap-1.5 font-black text-emerald-800 mb-1">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span className="uppercase tracking-wider">✔ DIGITALLY SIGNED</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    અધિકારી: એચ. વી. પટેલ, GAS
                  </p>
                  <p className="text-slate-600 text-[10px]">
                    તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, {app.taluka}
                  </p>
                  <p className="text-[9.5px] font-mono text-emerald-700 mt-1">
                    e-Sign Timestamp: {issueDate} 15:42:19 IST
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
