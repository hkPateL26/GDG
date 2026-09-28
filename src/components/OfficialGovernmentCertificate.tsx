"use client";

import { CitizenApplication } from "@/lib/large-datasets";
import { CheckCircle2, Download, Printer, X, ShieldCheck, Award } from "lucide-react";

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
  const validUntilDate = "2029-03-31"; // Standard 3-year validity in Gujarat

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
          <title>સત્તાવાર સરકારી પ્રમાણપત્ર - ${certNumber}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ${styleTags}
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: system-ui, -apple-system, sans-serif !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .cert-border {
              border: 4px double #1e293b !important;
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
              }, 250);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-auto bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
      {/* ── Top Bar with Actions ── */}
      <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-amber-400" />
          <span className="font-bold text-xs sm:text-sm">
            ગુજરાત સરકાર ડિજિટલ પ્રમાણપત્ર &bull; કાનૂની દસ્તાવેજ
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          >
            <Printer size={13} />
            <span>PDF ડાઉનલોડ / પ્રિન્ટ</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Certificate Printable Body ── */}
      <div className="p-4 sm:p-8 max-h-[80vh] overflow-y-auto bg-amber-50/20">
        <div
          id="official-cert-print-area"
          className="relative bg-white border-4 border-double border-slate-900 p-6 sm:p-10 shadow-lg rounded-2xl overflow-hidden"
        >
          {/* Watermark Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
            <span className="text-[260px] font-black leading-none">🏛️</span>
          </div>

          {/* Header with National / State Emblem */}
          <div className="text-center border-b-2 border-slate-800 pb-5 mb-5 relative">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-800 flex items-center justify-center shadow-xs text-3xl">
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

          {/* Certificate Title & Meta */}
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

          {/* Certificate Type Banner */}
          <div className="text-center my-6">
            <span className="inline-block bg-slate-900 text-amber-300 font-black text-base sm:text-lg px-6 py-2 rounded-xl border-2 border-amber-400 shadow-xs">
              {app.schemeNameGu || app.schemeName || "સત્તાવાર સરકારી પ્રમાણપત્ર"}
            </span>
          </div>

          {/* Formal Legal Body */}
          <div className="text-xs sm:text-sm leading-relaxed text-slate-800 space-y-4 px-2 sm:px-4">
            <p className="text-justify indent-8">
              આથી પ્રમાણિત કરવામાં આવે છે કે શ્રી/શ્રીમતી{" "}
              <strong className="text-slate-950 font-black underline decoration-amber-400 decoration-2 underline-offset-4">
                {app.citizenNameGu || app.citizenName}
              </strong>
              , રહેવાસી:{" "}
              <strong>
                ગામ: {app.village || "ગોમતા"}, તાલુકો: {app.taluka || "ગોંડલ"}, જિલ્લો:{" "}
                {app.districtGu || app.district}
              </strong>
              , આધાર કાર્ડ છેલ્લા ૪ આંકડા:{" "}
              <strong className="font-mono">XXXX-XXXX-{app.aadhaarLast4 || "1413"}</strong> દ્વારા સદર
              કચેરી સમક્ષ કરવામાં આવેલ અરજી સંદર્ભે તલાટી કમ મંત્રીશ્રીના રૂબરૂ પંચનામા તથા રેકર્ડ ખરાઈ અન્વયે સક્ષમ
              સત્તાધિકારી દ્વારા ખરાઈ કરવામાં આવેલ છે.
            </p>

            {/* Income or Benefit detail if applicable */}
            {app.benefitAmount > 0 ? (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-emerald-950">
                <p>
                  <strong>મંજૂર સહાય/રકમ:</strong> ₹ {app.benefitAmount.toLocaleString("en-IN")}/- (અક્ષરે:{" "}
                  {app.benefitAmount} રૂપિયા પુરા) Direct Benefit Transfer (DBT) મારફત અરજદારના આધાર સંલગ્ન બેંક
                  ખાતામાં જમા કરવામાં આવેલ છે.
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900">
                <p>
                  <strong>ચકાસણી હેતુ:</strong> નાગરિક દ્વારા રજૂ કરેલ પુરાવા કાયદેસર અને માન્ય ઠરેલ છે. આ
                  પ્રમાણપત્ર તમામ સરકારી/અર્ધસરકારી યોજનાઓ, શૈક્ષણિક પ્રવેશ તથા ઓળખ ખરાઈ માટે સંપૂર્ણપણે કાનૂની
                  માન્યતા ધરાવે છે.
                </p>
              </div>
            )}

            <p className="text-xs text-slate-600 italic">
              નોંધ: આ પ્રમાણપત્ર ગુજરાત સરકારના આઇટી અને મહેસૂલ પોર્ટલ દ્વારા ઇ-સાઇન ટેક્નોલોજીથી ડિજિટલ રીતે તૈયાર થયેલ
              હોવાથી સહી-સિક્કાની પ્રત્યક્ષ ભૌતિક જરૂરિયાત રહેતી નથી (Information Technology Act 2000 ની કલમ ૫ મુજબ
              કાયદેસર).
            </p>
          </div>

          {/* Footer: Digital e-Sign Seal & QR Verification */}
          <div className="mt-8 pt-6 border-t-2 border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Left: QR Verification */}
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
                <p className="font-mono text-[9px] text-slate-400 mt-1 truncate">
                  SHA-256: 8F4C-9201-E8A1
                </p>
              </div>
            </div>

            {/* Right: Digital Signature Stamp */}
            <div className="border-2 border-emerald-600 bg-emerald-50/70 p-3.5 rounded-xl text-[11px] leading-tight text-emerald-950 relative">
              <div className="flex items-center gap-1.5 font-black text-emerald-800 mb-1">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span className="uppercase tracking-wider">✔ DIGITALLY SIGNED</span>
              </div>
              <p className="font-bold text-slate-900">
                અધિકારી: એચ. વી. પટેલ, GAS
              </p>
              <p className="text-slate-600 text-[10px]">
                તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ
              </p>
              <p className="text-[9.5px] font-mono text-emerald-700 mt-1">
                e-Sign Timestamp: {issueDate} 15:42:19 IST
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                Cert Serial: 4A7B-98F1-2C3D-E4F5
              </p>
            </div>
          </div>

          {/* Barcode Strip */}
          <div className="mt-5 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>||||||| | ||||| |||||| |||| |||||||| |||| | ||||||||</span>
            <span>NAGRIK-SEVA-GOV-GJ-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
