"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Printer,
  AlertTriangle,
  Scale,
  Send,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Landmark,
} from "lucide-react";
import { CitizenApplication } from "@/lib/large-datasets";
import {
  generateStatutoryShowCauseNotice,
  StatutoryNoticeData,
} from "@/lib/statutory-sla-engine";

interface StatutoryShowCauseNoticeModalProps {
  app: CitizenApplication;
  onClose: () => void;
  onEscalate?: (appId: string, targetOfficer: string) => void;
}

export default function StatutoryShowCauseNoticeModal({
  app,
  onClose,
  onEscalate,
}: StatutoryShowCauseNoticeModalProps) {
  const [notice, setNotice] = useState<StatutoryNoticeData>(() =>
    generateStatutoryShowCauseNotice(app)
  );
  const [escalated, setEscalated] = useState<boolean>(false);

  // Keyboard Escape Key to close modal instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleEscalateToCollector = () => {
    setEscalated(true);
    if (onEscalate) {
      onEscalate(notice.applicationId, notice.issuingOfficerName);
    }
  };

  const handlePrintNotice = () => {
    const oldIframe = document.getElementById("notice-print-frame");
    if (oldIframe) {
      oldIframe.remove();
    }

    const iframe = document.createElement("iframe");
    iframe.id = "notice-print-frame";
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
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Statutory_Notice_${notice.noticeNo}</title>
          ${styleTags}
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            body {
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: system-ui, -apple-system, sans-serif !important;
            }
            #official-notice-print-area {
              border: 2px solid #0f172a !important;
              padding: 6mm 8mm !important;
            }
          </style>
        </head>
        <body>
          <div id="print-root">
            ${document.getElementById("official-notice-print-area")?.outerHTML || ""}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.print();
      }
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 rounded-3xl shadow-2xl border border-rose-500/40 text-slate-100 flex flex-col">
        {/* Sticky Top Action Bar */}
        <div className="sticky top-0 z-30 bg-slate-950 border-b border-rose-900/60 p-3 sm:p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-lg shrink-0">
              <Scale size={18} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xs sm:text-sm text-white truncate">
                  સત્તાવાર કારણ દર્શક નોટિસ (Show-Cause Notice)
                </h3>
                <span className="text-[10px] bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                  GRTPSA ૨૦૧૩ કલમ ૮
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                {notice.noticeNo} &bull; અરજી: {notice.applicationId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrintNotice}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer border border-slate-700"
            >
              <Printer size={15} />
              <span className="hidden sm:inline">પ્રિન્ટ / PDF ડાઉનલોડ</span>
              <span className="sm:hidden">પ્રિન્ટ</span>
            </button>

            {!escalated ? (
              <button
                type="button"
                onClick={handleEscalateToCollector}
                className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Send size={15} />
                <span className="hidden sm:inline">કલેક્ટર ડેસ્ક પર એસ્કેલેટ કરો</span>
                <span className="sm:hidden">એસ્કેલેટ</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-600/50 rounded-xl text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-400" />
                કલેક્ટર ડેસ્ક પર મોકલાઈ ગયું
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="બંધ કરો (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notice Body (Document Layout) */}
        <div className="p-3 sm:p-6 overflow-x-auto">
          <div
            id="official-notice-print-area"
            className="min-w-[620px] sm:min-w-0 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-slate-900 shadow-xl space-y-4 relative"
          >
            {/* National Tricolor Top Ribbon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] border-y border-slate-300" />

            {/* Official Header */}
            <div className="text-center space-y-1 border-b border-slate-800 pb-3">
              <p className="text-xl">🏛️</p>
              <h2 className="text-sm font-black tracking-wide uppercase text-slate-800">
                ગુજરાત સરકાર &bull; GOVERNMENT OF GUJARAT
              </h2>
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                જિલ્લા કલેક્ટર & ડિસ્ટ્રિક્ટ મેજિસ્ટ્રેટ કચેરી, રાજકોટ
              </h1>
              <p className="text-[11px] text-slate-600 font-bold">
                ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ (GRTPSA ૨૦૧૩) હેઠળ સક્ષમ દ્વિતીય અપીલ સત્તામંડળ
              </p>
            </div>

            {/* Notice Metadata */}
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-200 pb-2">
              <div>
                <span className="font-bold text-slate-500">નોટિસ ક્રમાંક: </span>
                <strong className="text-rose-700 font-black">{notice.noticeNo}</strong>
              </div>
              <div>
                <span className="font-bold text-slate-500">તારીખ: </span>
                <strong className="text-slate-800">{notice.issuedDateGu}</strong>
              </div>
            </div>

            {/* Statutory Red Warning Banner */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-rose-600 shrink-0" />
                <div>
                  <h4 className="font-black text-rose-900 text-xs sm:text-sm">
                    કારણ દર્શક નોટિસ (SHOW-CAUSE NOTICE - SECTION 8)
                  </h4>
                  <p className="text-[11px] text-rose-700 font-medium">
                    નિયત સમયમર્યાદા (SLA) માં સેવા ન આપવા બદલ કલમ ૮ હેઠળ વ્યક્તિગત દંડ અંગે નોટિસ.
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 font-bold block">કાનૂની દંડની રકમ</span>
                <span className="font-mono text-base font-black text-rose-700">
                  ₹{notice.totalPenalty}/-
                </span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-500 uppercase text-[10px]">પ્રતિશ્રી (કસૂરવાર અધિકારી):</p>
              <p className="text-sm font-black text-slate-900">
                {notice.defaultingOfficerName} ({notice.defaultingOfficerDesignation})
              </p>
              <p className="text-slate-600 text-xs">{notice.defaultingOfficeGu}</p>
            </div>

            {/* Application & Delay Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold">અરજી ક્રમાંક (ID)</span>
                <span className="font-mono font-black text-slate-900">{notice.applicationId}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold">નાગરિક અરજદાર</span>
                <span className="font-bold text-slate-900 truncate block">{notice.applicantNameGu}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold">કાયદેસર SLA મર્યાદા</span>
                <span className="font-black text-blue-800">{notice.statutorySlaDays} દિવસ</span>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                <span className="text-[10px] text-rose-700 block font-bold">થયેલ વિલંબ (Overdue)</span>
                <span className="font-black text-rose-700 font-mono">
                  +{notice.overdueDays} દિવસ વિલંબિત
                </span>
              </div>
            </div>

            {/* Statutory Order Body */}
            <div className="text-xs leading-relaxed text-slate-800 space-y-2 pt-1">
              <p>
                <strong>વિષય:</strong> {notice.actTitleGu} ની કલમ ૮ અન્વયે નાગરિક સેવા અરજી (
                <span className="font-mono font-bold text-slate-900">{notice.applicationId}</span>
                ) નો નિયત સમયમર્યાદામાં નિકાલ ન કરવા બદલ કારણ દર્શક નોટિસ બાબત.
              </p>
              <p>
                આથી આપને આ નોટિસ પાઠવી જણાવવામાં આવે છે કે અરજદાર <strong>{notice.applicantNameGu}</strong> દ્વારા{" "}
                <strong>{notice.schemeNameGu}</strong> મેળવવા માટે સબમિટ કરેલ અરજી આપના ડેસ્ક પર નિયત{" "}
                <strong>{notice.statutorySlaDays} દિવસ</strong> ની કાનૂની સમયમર્યાદા કરતાં{" "}
                <strong className="text-rose-700">{notice.overdueDays} દિવસ</strong> વધુ સમયથી પેન્ડિંગ છે.
              </p>
              <p className="bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium text-amber-950">
                ⚖️ <strong>GRTPSA ૨૦૧૩ કલમ ૮(૧) જોગવાઈ:</strong> સેવા આપવામાં વ્યાજબી કારણ વગર વિલંબ કરનાર
                અધિકારી સામે દૈનિક <strong>₹{notice.penaltyPerDay}/-</strong> લેખે કુલ{" "}
                <strong>₹{notice.totalPenalty}/-</strong> નો દંડ આપના માસિક પગારમાંથી શા માટે વસૂલ ન કરવો
                તેનો લેખિત ખુલાસો આ નોટિસ મળ્યાના <strong>{notice.explanationDeadlineDays} દિવસમાં</strong>{" "}
                અત્રેની કચેરીએ રૂબરૂ રજૂ કરવાનો આદેશ કરવામાં આવે છે.
              </p>
            </div>

            {/* Signature & Seal Area */}
            <div className="pt-4 border-t border-slate-200 flex items-end justify-between text-xs">
              <div className="space-y-1">
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-bold">
                  SEAL: {notice.cryptographicSeal}
                </span>
                <p className="text-[10px] text-slate-400">
                  ઈ-ગવર્નન્સ સર્ટિફાઇડ ઓટો-જનરેટેડ ડિજિટલ નોટિસ
                </p>
              </div>

              <div className="text-right space-y-0.5">
                <p className="font-black text-slate-900">{notice.issuingOfficerName}</p>
                <p className="text-[11px] text-slate-600">{notice.issuingOfficerDesignation}</p>
                <p className="text-[10px] text-slate-500">{notice.issuingOfficeGu}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
