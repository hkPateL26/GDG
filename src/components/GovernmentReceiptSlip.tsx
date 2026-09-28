"use client";

import { CitizenApplication } from "@/lib/large-datasets";
import { CheckCircle2, Download, Clock } from "lucide-react";

interface GovernmentReceiptSlipProps {
  app: CitizenApplication;
  onClose?: () => void;
  isModalPreview?: boolean;
}

export default function GovernmentReceiptSlip({
  app,
  onClose,
  isModalPreview = false,
}: GovernmentReceiptSlipProps) {
  const isChallanPending = app.paymentStatus === "pending_challan";
  const receiptNo = isChallanPending
    ? `GJ-CHALLAN-2026-${app.challanNo || app.id}`
    : `GJ-DPI-2026-${app.id}`;
  const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "https://nagrikseva-ai.gov.in");
  const verifyUrl = `${origin}/track?id=${encodeURIComponent(app.id)}`;

  // Payment Mode Label in Gujarati
  const getPaymentModeLabel = () => {
    if (isChallanPending) {
      return "કચેરીએ ઓફલાઇન રોકડ ચલણ (Jan Seva Kendra Cash Counter)";
    }
    if (app.paymentMethod === "upi") {
      return "UPI / Bharat QR (NPCI Direct • cybertreasury.gujarat@sbi)";
    }
    if (app.paymentMethod === "card") {
      return "નેટ બેંકિંગ / ડેબિટ કાર્ડ (Cyber Treasury State Bank Gateway)";
    }
    return "ઓનલાઇન સાયબર ટ્રેઝરી ગેટવે (Cyber Treasury e-Grass)";
  };

  // High-Fidelity Isolated A4 Full-Page Print Engine
  const handlePrintDocument = () => {
    const printArea = document.getElementById("official-receipt-print-area");
    if (!printArea) {
      window.print();
      return;
    }

    // Scroll window and modal container to top
    window.scrollTo({ top: 0, behavior: "instant" });

    // Remove any existing print frame
    const oldIframe = document.getElementById("receipt-print-frame");
    if (oldIframe) {
      oldIframe.remove();
    }

    const iframe = document.createElement("iframe");
    iframe.id = "receipt-print-frame";
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

    // Collect all stylesheets and Tailwind links from the head
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
          <title>${isChallanPending ? "Govt_Cash_Challan" : "Official_Govt_Receipt"}_${app.id}</title>
          ${styleTags}
          <style>
            @page {
              size: A4 portrait;
              margin: 6mm 8mm;
            }
            *, *::before, *::after {
              box-sizing: border-box;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
              width: 100% !important;
              height: 100% !important;
              overflow: hidden !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #official-receipt-print-area {
              position: static !important;
              width: 100% !important;
              max-width: 100% !important;
              height: 282mm !important;
              min-height: 282mm !important;
              max-height: 282mm !important;
              margin: 0 auto !important;
              padding: 4mm 5mm !important;
              box-sizing: border-box !important;
              border: 2px solid #0f172a !important;
              background: #ffffff !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              overflow: hidden !important;
            }
          </style>
        </head>
        <body>
          ${printArea.outerHTML}
        </body>
      </html>
    `);
    doc.close();

    // Trigger print
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn("Iframe print error fallback:", err);
        window.print();
      }
    }, 300);
  };

  return (
    <div
      className={`bg-white text-slate-900 font-sans print-only-certificate ${
        isModalPreview
          ? "w-full max-w-3xl mx-auto p-3 sm:p-6 rounded-2xl shadow-2xl border border-slate-300 relative max-h-[94vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none"
          : ""
      }`}
    >
      {/* On-screen modal action bar (hidden in print) */}
      {isModalPreview && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200 print:hidden sticky top-0 bg-white/95 backdrop-blur-sm z-10 gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                isChallanPending
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              <span>{isChallanPending ? "🏛️" : "📜"}</span>
              <span>
                {isChallanPending
                  ? "સત્તાવાર ઓફલાઇન રોકડ ચલણ (Official Cash Challan)"
                  : "સત્તાવાર સરકારી પહોંચ (Official e-Challan Slip)"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDocument}
              className={`flex-1 sm:flex-initial px-4 py-2 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 ${
                isChallanPending
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              }`}
            >
              <Download size={15} />
              <span>
                {isChallanPending
                  ? "📥 રોકડ ચલણ ડાઉનલોડ / પ્રિન્ટ (Save Challan PDF)"
                  : "📥 PDF ડાઉનલોડ / પ્રિન્ટ કરો (Save as PDF)"}
              </span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition shrink-0"
              >
                બંધ કરો
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main A4 Document Outer Border - Fills Full Page Gracefully */}
      <div
        id="official-receipt-print-area"
        className="border-2 border-slate-900 p-3.5 sm:p-5 bg-white relative box-border flex flex-col justify-between h-full min-h-0 text-slate-900 overflow-hidden"
      >
        {/* Subtle Security Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
          <p className="text-5xl sm:text-6xl font-black text-slate-900 -rotate-45 text-center leading-tight">
            GOVERNMENT OF GUJARAT<br />
            {isChallanPending ? "OFFLINE CASH CHALLAN" : "VERIFIED CITIZEN RECORD"}
          </p>
        </div>

        <div>
          {/* Top National Tricolor Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] border-y border-slate-300 mb-2" />

          {/* Official Government Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2 mb-2 gap-2">
            {/* Left: Ashoka Stambh Emblem */}
            <div className="flex items-center gap-2.5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-slate-800 p-0.5 flex flex-col items-center justify-center bg-amber-50/50 shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-amber-950 fill-current" aria-label="Ashok Emblem">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span className="text-[6.5px] font-black uppercase text-slate-900 tracking-tighter">
                  સત્યમેવ જયતે
                </span>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-900 tracking-wider uppercase leading-tight">
                  ગુજરાત સરકાર • GOVERNMENT OF GUJARAT
                </p>
                <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  પંચાયત, ગ્રામ ગૃહનિર્માણ અને નાગરિક કલ્યાણ વિભાગ
                </h1>
                <p className="text-[10px] text-slate-600 font-semibold leading-tight">
                  Department of Panchayat & Citizen Welfare • Gandhinagar, Gujarat
                </p>
                <p className="text-[9px] text-orange-700 font-bold tracking-wide">
                  ડિજિટલ પબ્લિક ઇન્ફ્રાસ્ટ્રક્ચર સેવા પોર્ટલ (Digital Public Infrastructure)
                </p>
              </div>
            </div>

            {/* Right: Barcode & Verification Badge */}
            <div className="text-right shrink-0 border-l border-slate-200 pl-2.5">
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-bold border ${
                  isChallanPending
                    ? "bg-amber-50 border-amber-600 text-amber-900"
                    : "bg-emerald-50 border-emerald-600 text-emerald-800"
                }`}
              >
                {isChallanPending ? (
                  <>
                    <Clock size={11} className="text-amber-700" />
                    <span>ચુકવણી બાકી (Unpaid)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={11} className="text-emerald-700" />
                    <span>ડિજિટલ પ્રમાણિત</span>
                  </>
                )}
              </div>
              <p className="text-[8px] text-slate-500 mt-0.5 font-mono">DPI Portal: nagrik-seva.gov.in</p>
              {/* Simulated Barcode */}
              <div className="font-mono text-[10px] tracking-widest text-slate-800 font-black mt-0.5">
                ||| | ||||| || |||||| | ||
              </div>
              <p className="text-[9.5px] font-mono font-bold text-slate-700">{app.id}</p>
            </div>
          </div>

          {/* Title Banner */}
          <div
            className={`text-center py-1.5 px-2.5 rounded-md mb-2 border ${
              isChallanPending
                ? "bg-amber-100/70 border-amber-300"
                : "bg-slate-100 border-slate-300"
            }`}
          >
            <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide leading-tight">
              {isChallanPending
                ? "સત્તાવાર સરકારી ફી ઓફલાઇન ચલણ અને કામચલાઉ અરજી પાવતી"
                : "સત્તાવાર સરકારી સહાય અરજી પહોંચ અને ચકાસણી પત્રક"}
            </h2>
            <p className="text-[8.5px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
              {isChallanPending
                ? "OFFICIAL GOVERNMENT OFFLINE CASH CHALLAN & PROVISIONAL CITIZEN RECEIPT"
                : "OFFICIAL GOVERNMENT WELFARE SCHEME ACKNOWLEDGMENT & AUDIT CERTIFICATE"}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-300 p-2 rounded-md mb-2 text-[10px] sm:text-[10.5px]">
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-bold">
                {isChallanPending ? "ચલણ ક્રમાંક (Challan No):" : "પહોંચ ક્રમાંક (Receipt No):"}
              </span>
              <strong className="text-slate-900 font-mono text-[10px]">{receiptNo}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-bold">અરજી નંબર (App ID):</span>
              <strong className="text-orange-700 font-mono text-[10.5px]">{app.id}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-bold">અરજી તારીખ (Date):</span>
              <strong className="text-slate-900 font-mono text-[10px]">{app.appliedDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-bold">આધાર e-KYC ખરાઈ:</span>
              <strong className="text-emerald-700 text-[10px]">✓ UIDAI બાયોમેટ્રિક પ્રમાણિત</strong>
            </div>
          </div>

          {/* Section 1: Applicant Details Table */}
          <div className="border border-slate-300 rounded-md overflow-hidden mb-2">
            <div className="bg-slate-800 text-white px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
              ૧. અરજદાર અને રહેઠાણની વિગતો (Applicant Particulars)
            </div>
            <div className="p-2 sm:p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-white">
              <div>
                <span className="text-slate-500 text-[9px] block">અરજદારનું પૂરું નામ:</span>
                <p className="font-bold text-slate-900 leading-tight">{app.citizenNameGu}</p>
                <p className="text-[9px] text-slate-500 leading-tight">{app.citizenName}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[9px] block">આધાર નોંધણી સંદર્ભ:</span>
                {app.aadhaarLast4 === "NEW" || app.schemeId.startsWith("aadhaar-new") ? (
                  <>
                    <p className="font-mono font-bold text-orange-700 leading-tight">UIDAI EID: 2026-4829</p>
                    <p className="text-[9px] text-emerald-600 font-semibold leading-tight">નવી નોંધણી માન્ય (EID Gen)</p>
                  </>
                ) : (
                  <>
                    <p className="font-mono font-bold text-slate-900 leading-tight">XXXX-XXXX-{app.aadhaarLast4}</p>
                    <p className="text-[9px] text-emerald-600 font-semibold leading-tight">e-KYC સફળ</p>
                  </>
                )}
              </div>
              <div>
                <span className="text-slate-500 text-[9px] block">લિંગ / કેટેગરી:</span>
                <p className="font-bold text-slate-900 leading-tight">{app.gender === "female" ? "મહિલા (Female)" : "પુરુષ (Male)"}</p>
                <p className="text-[9px] text-slate-500 leading-tight">સામાજિક કલ્યાણ કેટેગરી</p>
              </div>
              <div>
                <span className="text-slate-500 text-[9px] block">ગામ / વોર્ડ:</span>
                <p className="font-bold text-slate-800 leading-tight">{app.village}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[9px] block">તાલુકો:</span>
                <p className="font-bold text-slate-800 leading-tight">{app.taluka}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[9px] block">જિલ્લો:</span>
                <p className="font-bold text-slate-800 leading-tight">{app.districtGu} ({app.district})</p>
              </div>
            </div>
          </div>

          {/* Section 2: Scheme & Benefit Particulars */}
          <div className="border border-slate-300 rounded-md overflow-hidden mb-2">
            <div className="bg-slate-800 text-white px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase flex justify-between items-center">
              <span>૨. સેવા અને ફી વિગત (Service & Treasury Payment Details)</span>
              <span className="text-amber-300 text-[9px]">CODE: {app.schemeId.toUpperCase()}</span>
            </div>
            <div className="p-2 sm:p-2.5 bg-white space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-1.5 gap-1">
                <div>
                  <span className="text-slate-500 text-[9px] block">યોજના / સેવાનું નામ:</span>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">{app.schemeNameGu}</p>
                  <p className="text-[10px] text-slate-600 leading-tight">{app.schemeName}</p>
                </div>
                <div className="text-left sm:text-right bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                  <span className="text-[9px] text-slate-600 font-bold block">નિયત સરકારી ફી (Mandated Fee):</span>
                  <span className="text-sm font-black text-orange-600">₹ {app.feeAmount || 50}.00</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[9px] block">વિભાગીય નોંધ / ચકાસણી અભિપ્રાય (Officer Remarks):</span>
                <p className="text-slate-800 font-medium text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200 mt-0.5 leading-tight">
                  {app.remarksGu}
                </p>
              </div>

              {/* Explicit Cyber Treasury Payment Mode Box */}
              <div
                className={`border rounded p-2 text-[10px] space-y-1.5 ${
                  isChallanPending
                    ? "bg-amber-50/90 border-amber-300 text-amber-950"
                    : "bg-emerald-50/60 border-emerald-300 text-emerald-950"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-1.5">
                  <div>
                    <span className="font-bold text-slate-900 block text-[10px]">
                      {isChallanPending
                        ? "🏛️ સરકારી સાયબર ટ્રેઝરી ઓફલાઇન રોકડ ચલણ (Offline Treasury Challan):"
                        : "🏛️ સરકારી સાયબર ટ્રેઝરી ઓનલાઇન ચુકવણી પહોંચ (Cyber Treasury e-Receipt):"}
                    </span>
                    <p className="text-[9.5px] text-slate-700 mt-0.5">
                      <strong>ચુકવણી માધ્યમ (Payment Mode):</strong> {getPaymentModeLabel()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    {isChallanPending ? (
                      <span className="inline-block bg-amber-600 text-white font-bold px-2.5 py-0.5 rounded text-[9.5px]">
                        ⏳ ફી ભરપાઈ બાકી (UNPAID: ₹{app.feeAmount || 50})
                      </span>
                    ) : (
                      <span className="inline-block bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded text-[9.5px]">
                        ✓ સફળ ભરપાઈ (PAID: ₹{app.feeAmount || 50})
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[9px]">
                  <div>
                    <span className="text-slate-500 font-sans block text-[8px]">ટ્રેઝરી GRN / ચલણ ક્રમાંક:</span>
                    <strong className="text-slate-900 font-bold">{app.challanNo || `GRN-2026-${app.aadhaarLast4 === "NEW" ? "4829" : app.aadhaarLast4 || "4829"}`}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans block text-[8px]">ટ્રાન્ઝેક્શન રેફરન્સ (Txn Ref):</span>
                    <strong className="text-slate-900 font-bold">
                      {isChallanPending ? "PENDING-CASH-AT-KACHERI" : app.txnId || `TXN-GUJ-${app.id.replace(/\D/g, "") || "928401"}`}
                    </strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-500 font-sans block text-[8px]">દસ્તાવેજ રિલીઝ સ્થિતિ:</span>
                    <strong className={isChallanPending ? "text-amber-800 font-sans font-bold" : "text-emerald-700 font-sans font-bold"}>
                      {isChallanPending ? "🔒 લૉક (ચુકવણી બાદ રિલીઝ)" : "✓ અનલૉક (ડિજિટલી રિલીઝ)"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Conditional Notice: Strict Lock for Challan VS Zero Cash for Paid */}
              {isChallanPending ? (
                <div className="bg-amber-100/70 border border-amber-300 rounded p-2 text-[9.5px] space-y-0.5 text-amber-950">
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span>⚠️ કાનૂની સૂચના - ઓફલાઇન રોકડ ચુકવણી પ્રોટોકોલ (Statutory Challan Rule):</span>
                    <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono text-[8px] font-bold">
                      Document Locked
                    </span>
                  </div>
                  <p className="leading-tight text-slate-800 font-medium">
                    <strong>આ અરજીની સરકારી ફી ઓનલાઇન ચૂકવેલ નથી.</strong> અરજદારે આ ચલણ તાલુકા જન સેવા કેન્દ્રના રોકડ કાઉન્ટર પર રજૂ કરી નિયત ફી ₹{app.feeAmount || 50} રોકડા ભરવાના રહેશે.
                  </p>
                  <p className="text-[8.5px] text-amber-900 font-bold">
                    કચેરી ઓપરેટર દ્વારા સિસ્ટમમાં &apos;Payment Received&apos; માર્ક થયા બાદ જ પ્રમાણપત્ર / સુધારેલ દસ્તાવેજ રિલીઝ (અનલૉક) થશે.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50/70 border border-emerald-300 rounded p-2 text-[9.5px] space-y-0.5 text-slate-800">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span>📍 સ્થાનિક ગ્રામ પંચાયત e-Gram કેન્દ્ર પ્રમાણીકરણ (Zero Cash Protocol):</span>
                    <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-mono text-[8px] font-bold">
                      Govt. Authorized
                    </span>
                  </div>
                  <p className="leading-tight text-slate-700">
                    <strong className="text-emerald-800">અરજદારે સ્થાનિક કેન્દ્ર પર કોઈ વધારાની રોકડ રકમ ચૂકવવાની રહેતી નથી.</strong> આ અરજીની નિયત સરકારી ફી સાયબર ટ્રેઝરી પોર્ટલ મારફતે ઓનલાઇન જમા થઈ ચૂકી છે.
                  </p>
                  <p className="text-[8.5px] text-slate-600 font-medium">
                    આ સત્તાવાર પહોંચ ગ્રામ પંચાયતના e-Gram કેન્દ્ર ખાતે દર્શાવીને ૨ મિનિટમાં બાયોમેટ્રિક ખરાઈ કરાવી શકાશે. હેલ્પલાઇન: CM ૧૦૭૦ / પંચાયત ૧૮૦૦-૨૩૩-૫૫૦૦.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Audit Trail & Stage Clearance */}
          <div className="border border-slate-300 rounded-md overflow-hidden mb-2">
            <div className="bg-slate-800 text-white px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
              ૩. સરકારી પ્રક્રિયા અને ઓડિટ સ્ટેટસ (Verification Stages)
            </div>
            <table className="w-full text-[10px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                  <th className="p-1.5 font-bold">તબક્કો (Stage)</th>
                  <th className="p-1.5 font-bold">ચકાસણી ઓથોરિટી</th>
                  <th className="p-1.5 font-bold">ખરાઈ પદ્ધતિ</th>
                  <th className="p-1.5 font-bold text-right">સ્થિતિ (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-1.5 font-medium">૧. અરજી સબમિશન</td>
                  <td className="p-1.5 text-slate-600">જન સેવા કેન્દ્ર / CSC VLE</td>
                  <td className="p-1.5 text-slate-600">ડિજિટલ પોર્ટલ પોઇન્ટ</td>
                  <td className="p-1.5 text-right font-bold text-emerald-700">✓ પૂર્ણ (Cleared)</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-medium">૨. દસ્તાવેજ ખરાઈ</td>
                  <td className="p-1.5 text-slate-600">તલાટી કમ મંત્રી / ગ્રામ સેવક</td>
                  <td className="p-1.5 text-slate-600">આધાર + નિયત સરકારી પુરાવા</td>
                  <td className="p-1.5 text-right font-bold text-emerald-700">✓ પ્રમાણિત (Verified)</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-medium">૩. વહીવટી સમીક્ષા</td>
                  <td className="p-1.5 text-slate-600">{app.officerDesignation}</td>
                  <td className="p-1.5 text-slate-600">સક્ષમ અધિકારી સમીક્ષા</td>
                  <td className="p-1.5 text-right font-bold text-emerald-700">
                    {app.status === "approved" ? "✓ મંજૂર (Approved)" : "⏳ પ્રક્રિયા હેઠળ"}
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 font-medium">૪. ચુકવણી & રિલીઝ</td>
                  <td className="p-1.5 text-slate-600">
                    {isChallanPending ? "જન સેવા કેન્દ્ર રોકડ કાઉન્ટર" : "સાયબર ટ્રેઝરી પોર્ટલ"}
                  </td>
                  <td className="p-1.5 text-slate-600">
                    {isChallanPending ? "ચલણ રજૂ કરી રોકડ ચુકવણી" : "ઓનલાઇન સાયબર ટ્રેઝરી"}
                  </td>
                  <td className="p-1.5 text-right font-bold">
                    {isChallanPending ? (
                      <span className="text-amber-800 font-extrabold">🔒 લૉક (રોકડ ચુકવણી બાકી)</span>
                    ) : (
                      <span className="text-emerald-700 font-extrabold">✓ સફળ (પ્રમાણપત્ર ઉપલબ્ધ)</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION: Authentic Rubber Stamp & Digital Signature (FULL SIZE, CLEAR & PROPORTIONAL) */}
        <div className="pt-2 border-t-2 border-slate-900 mt-2">
          <div className="grid grid-cols-3 gap-2 items-center">
            {/* Left: Verification QR Code */}
            <div className="flex items-center gap-2">
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="ઓનલાઇન પહોંચ ચકાસો"
                className="w-14 h-14 sm:w-15 sm:h-15 p-1 bg-white border border-slate-400 rounded flex flex-col items-center justify-center shrink-0 hover:border-orange-500 transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verifyUrl)}`}
                  alt="Official Verification QR"
                  className="w-12 h-12 object-contain"
                />
              </a>
              <div className="text-[8.5px] text-slate-600 leading-tight">
                <p className="font-bold text-slate-900">QR કોડ સ્કેન કરો</p>
                <p>મોબાઈલ દ્વારા પહોંચની સત્યતા તપાસો.</p>
                <a
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[8px] text-orange-700 underline truncate max-w-[120px] block"
                >
                  {verifyUrl}
                </a>
              </div>
            </div>

            {/* Center: Authentic Circular Rubber Stamp (સિક્કો) */}
            <div className="flex justify-center">
              <div className="relative -rotate-3 select-none">
                <div
                  className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-dashed p-1 flex flex-col items-center justify-center text-center shadow-xs ${
                    isChallanPending
                      ? "border-amber-700 text-amber-900 bg-amber-50/30"
                      : "border-blue-800 text-blue-900 bg-blue-50/20"
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-full border p-0.5 flex flex-col items-center justify-center ${
                      isChallanPending ? "border-amber-700" : "border-blue-800"
                    }`}
                  >
                    <span className="text-[6px] font-black uppercase tracking-widest leading-none">
                      {isChallanPending ? "★ JAN SEVA KENDRA ★" : "★ MAMLATDAR OFFICE ★"}
                    </span>
                    <span className="text-[8px] font-black uppercase my-0.5 leading-tight">
                      {isChallanPending ? "CASH CHALLAN" : "OFFICIAL SEAL"}
                    </span>
                    <span className="text-[7px] font-bold uppercase leading-none">
                      {app.taluka}
                    </span>
                    <span className="text-[6px] font-mono mt-0.5 leading-none">
                      {app.lastUpdated}
                    </span>
                    <span className="text-[5.5px] font-bold tracking-tighter leading-none">
                      GOVT. OF GUJARAT
                    </span>
                  </div>
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 text-white text-[7px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    isChallanPending ? "bg-amber-800" : "bg-blue-900"
                  }`}
                >
                  {isChallanPending ? "PENDING CASH" : "VERIFIED"}
                </div>
              </div>
            </div>

            {/* Right: Digital Signature (સહી) */}
            <div className="text-right space-y-0.5">
              <div
                className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded font-bold border ${
                  isChallanPending
                    ? "text-amber-800 bg-amber-50 border-amber-300"
                    : "text-emerald-800 bg-emerald-50 border-emerald-300"
                }`}
              >
                <CheckCircle2 size={11} className={isChallanPending ? "text-amber-700" : "text-emerald-700"} />
                <span>{isChallanPending ? "ચલણ ઓથોરિટી" : "e-Sign પ્રમાણિત"}</span>
              </div>
              <div>
                {/* Simulated Cursive Official Signature */}
                <p className="font-serif italic text-base sm:text-lg text-slate-800 leading-none select-none font-bold">
                  K. R. Vaghela
                </p>
                <div className="border-t border-slate-400 mt-1 pt-0.5">
                  <p className="text-[9.5px] font-black text-slate-900">
                    {isChallanPending ? "ચલણ ઇશ્યૂઇંગ ઓથોરિટી" : "સક્ષમ સત્તાધિકારી"}
                  </p>
                  <p className="text-[8.5px] text-slate-600">{app.officerDesignation}</p>
                  <p className="text-[7.5px] text-slate-500 font-mono">
                    DSC ID: GJ-{isChallanPending ? "CHALLAN" : "GOV"}-AUTH-{app.aadhaarLast4 === "NEW" ? "EID2026" : app.aadhaarLast4}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Legal Disclaimer */}
          <div className="border-t border-slate-200 mt-1.5 pt-1 flex flex-col sm:flex-row items-center justify-between text-[8px] text-slate-500 gap-0.5 text-center sm:text-left leading-tight">
            <p>
              આ કમ્પ્યુટર દ્વારા તૈયાર થયેલ કાયદેસર સત્તાવાર ડિજિટલ દસ્તાવેજ છે. તેને સહી કે સ્ટેમ્પ વિના પણ તમામ સરકારી કચેરીઓમાં માન્ય ગણવામાં આવે છે.
            </p>
            <p className="shrink-0 font-bold text-slate-700">
              હેલ્પલાઇન: 1800-233-5500 | CM Helpline: 1070
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
