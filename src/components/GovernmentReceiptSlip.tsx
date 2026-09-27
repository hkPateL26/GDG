"use client";

import { CitizenApplication } from "@/lib/large-datasets";
import { CheckCircle2, QrCode, Download, Printer } from "lucide-react";

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
  const receiptNo = `GJ-DPI-2026-${app.id}`;
  const verifyUrl = `https://nagrikseva-ai-one.vercel.app/track?id=${encodeURIComponent(app.id)}`;

  return (
    <div
      className={`bg-white text-slate-900 font-sans print-only-certificate ${
        isModalPreview
          ? "w-full max-w-3xl mx-auto p-3 sm:p-6 rounded-2xl shadow-2xl border border-slate-300 relative max-h-[92vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none"
          : ""
      }`}
    >
      {/* On-screen modal action bar (hidden in print) */}
      {isModalPreview && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200 print:hidden sticky top-0 bg-white/95 backdrop-blur-sm z-10 gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span>🏛️</span>
              <span>સત્તાવાર સરકારી પહોંચ (Official e-Challan Slip)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Download size={15} />
              <span>📥 PDF ડાઉનલોડ / પ્રિન્ટ કરો (Save as PDF)</span>
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

      {/* Main A4 Document Outer Border - STRICT SINGLE PAGE PRINT ID */}
      <div
        id="official-receipt-print-area"
        className="border-2 border-slate-900 p-3.5 sm:p-5 print:p-2.5 bg-white relative box-border flex flex-col justify-between h-full min-h-0 text-slate-900 overflow-hidden"
      >
        {/* Subtle Security Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
          <p className="text-5xl sm:text-6xl font-black text-slate-900 -rotate-45 text-center leading-tight">
            GOVERNMENT OF GUJARAT<br />VERIFIED CITIZEN RECORD
          </p>
        </div>

        <div>
          {/* Top National Tricolor Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] border-y border-slate-300 mb-2 print:mb-1" />

          {/* Official Government Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2 mb-2 print:pb-1.5 print:mb-1.5 gap-2">
            {/* Left: Ashoka Stambh Emblem */}
            <div className="flex items-center gap-2.5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 print:w-10 print:h-10 rounded-full border-2 border-slate-800 p-0.5 flex flex-col items-center justify-center bg-amber-50/50 shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7 print:w-5 print:h-5 text-amber-950 fill-current" aria-label="Ashok Emblem">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span className="text-[6.5px] print:text-[5.5px] font-black uppercase text-slate-900 tracking-tighter">
                  સત્યમેવ જયતે
                </span>
              </div>

              <div>
                <p className="text-[10px] print:text-[8.5px] font-black text-slate-900 tracking-wider uppercase leading-tight">
                  ગુજરાત સરકાર • GOVERNMENT OF GUJARAT
                </p>
                <h1 className="text-sm sm:text-base print:text-[12px] font-black text-slate-900 leading-tight">
                  પંચાયત, ગ્રામ ગૃહનિર્માણ અને નાગરિક કલ્યાણ વિભાગ
                </h1>
                <p className="text-[10px] print:text-[8px] text-slate-600 font-semibold leading-tight">
                  Department of Panchayat & Citizen Welfare • Gandhinagar, Gujarat
                </p>
                <p className="text-[9px] print:text-[7.5px] text-orange-700 font-bold tracking-wide">
                  ડિજિટલ પબ્લિક ઇન્ફ્રાસ્ટ્રક્ચર સેવા પોર્ટલ (Digital Public Infrastructure)
                </p>
              </div>
            </div>

            {/* Right: Barcode & Verification Badge */}
            <div className="text-right shrink-0 border-l border-slate-200 pl-2">
              <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-600 text-emerald-800 px-1.5 py-0.2 rounded text-[9px] print:text-[8px] font-bold">
                <CheckCircle2 size={11} className="text-emerald-700" /> ડિજિટલ પ્રમાણિત
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
          <div className="text-center bg-slate-100 border border-slate-300 py-1 px-2 rounded-md mb-2 print:py-0.5 print:mb-1">
            <h2 className="text-xs sm:text-sm print:text-[11px] font-black text-slate-900 uppercase tracking-wide">
              સત્તાવાર સરકારી સહાય અરજી પહોંચ અને ચકાસણી પત્રક
            </h2>
            <p className="text-[8.5px] print:text-[7.5px] font-bold text-slate-600 uppercase tracking-wider">
              OFFICIAL GOVERNMENT WELFARE SCHEME ACKNOWLEDGMENT & AUDIT CERTIFICATE
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-50 border border-slate-300 p-2 rounded-md mb-2 print:p-1.5 print:mb-1 text-[10.5px] print:text-[9px]">
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-bold">પહોંચ ક્રમાંક (Receipt No):</span>
              <strong className="text-slate-900 font-mono text-[10.5px] print:text-[9px]">{receiptNo}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-bold">અરજી નંબર (App ID):</span>
              <strong className="text-orange-700 font-mono text-[11px] print:text-[9.5px]">{app.id}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-bold">અરજી તારીખ (Date):</span>
              <strong className="text-slate-900 font-mono text-[10px] print:text-[8.5px]">{app.appliedDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-bold">આધાર e-KYC ખરાઈ:</span>
              <strong className="text-emerald-700 text-[10px] print:text-[8.5px]">✓ UIDAI બાયોમેટ્રિક પ્રમાણિત</strong>
            </div>
          </div>

          {/* Section 1: Applicant Details Table */}
          <div className="border border-slate-300 rounded-md overflow-hidden mb-2 print:mb-1">
            <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10.5px] print:text-[8.5px] font-bold tracking-wide uppercase">
              ૧. અરજદાર અને રહેઠાણની વિગતો (Applicant Particulars)
            </div>
            <div className="p-2 print:p-1.5 grid grid-cols-2 sm:grid-cols-3 gap-2 print:gap-1 text-xs print:text-[8.5px] bg-white">
              <div>
                <span className="text-slate-500 text-[9.5px] print:text-[7.5px] block">અરજદારનું પૂરું નામ:</span>
                <p className="font-bold text-slate-900 leading-tight">{app.citizenNameGu}</p>
                <p className="text-[9px] print:text-[7.5px] text-slate-500 leading-tight">{app.citizenName}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[9.5px] print:text-[7.5px] block">આધાર કાર્ડ સંદર્ભ:</span>
                <p className="font-mono font-bold text-slate-900 leading-tight">XXXX-XXXX-{app.aadhaarLast4}</p>
                <p className="text-[9px] print:text-[7.5px] text-emerald-600 font-semibold leading-tight">e-KYC સફળ</p>
              </div>
              <div>
                <span className="text-slate-500 text-[9.5px] print:text-[7.5px] block">લિંગ / જાતિ:</span>
                <p className="font-bold text-slate-900 leading-tight">{app.gender === "female" ? "મહિલા (Female)" : "પુરુષ (Male)"}</p>
                <p className="text-[9px] print:text-[7.5px] text-slate-500 leading-tight">સામાજિક કલ્યાણ કેટેગરી</p>
              </div>
              <div>
                <span className="text-slate-500 text-[9.5px] print:text-[7.5px] block">ગામ / વોર્ડ:</span>
                <p className="font-bold text-slate-800 leading-tight">{app.village}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[9.5px] print:text-[7.5px] block">તાલુકો:</span>
                <p className="font-bold text-slate-800 leading-tight">{app.taluka}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[9.5px] print:text-[7.5px] block">જિલ્લો:</span>
                <p className="font-bold text-slate-800 leading-tight">{app.districtGu} ({app.district})</p>
              </div>
            </div>
          </div>

          {/* Section 2: Scheme & Benefit Particulars */}
          <div className="border border-slate-300 rounded-md overflow-hidden mb-2 print:mb-1">
            <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10.5px] print:text-[8.5px] font-bold tracking-wide uppercase flex justify-between items-center">
              <span>૨. યોજના અને સહાય મંજૂરી વિગત (Scheme & Sanction Details)</span>
              <span className="text-amber-300 text-[9.5px] print:text-[8px]">DBT Code: {app.schemeId.toUpperCase()}</span>
            </div>
            <div className="p-2 print:p-1.5 bg-white space-y-1.5 print:space-y-1 text-xs print:text-[8.5px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-1.5 print:pb-1 gap-1">
                <div>
                  <span className="text-slate-500 text-[9px] print:text-[7.5px] block">યોજનાનું નામ:</span>
                  <p className="font-extrabold text-xs sm:text-sm print:text-[10px] text-slate-900 leading-tight">{app.schemeNameGu}</p>
                  <p className="text-[10px] print:text-[8px] text-slate-600 leading-tight">{app.schemeName}</p>
                </div>
                <div className="text-left sm:text-right bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <span className="text-[9px] print:text-[7.5px] text-emerald-800 font-bold block">મંજૂર સહાય રકમ (Sanctioned Amount):</span>
                  <span className="text-sm print:text-xs font-black text-emerald-700">₹ {app.benefitAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[9px] print:text-[7.5px] block">વિભાગીય નોંધ / ચકાસણી અભિપ્રાય (Officer Remarks):</span>
                <p className="text-slate-800 font-medium text-[10.5px] print:text-[8px] bg-slate-50 p-1.5 print:p-1 rounded border border-slate-200 mt-0.5 leading-tight">
                  {app.remarksGu}
                </p>
              </div>

              {/* Cyber Treasury Payment Receipt Details */}
              <div className="bg-slate-50 border border-slate-300 rounded p-1.5 print:p-1 flex items-center justify-between text-[10px] print:text-[8px]">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800">સરકારી સાયબર ટ્રેઝરી ચુકવણી પહોંચ (Treasury e-Challan):</span>
                  <p className="font-mono text-slate-600">
                    Txn Ref: <strong className="text-slate-900">{app.txnId || `TXN-GUJ-${app.id.replace(/\D/g, "") || "928401"}`}</strong> • GRN: <strong className="text-slate-900">{app.challanNo || `GRN-2026-${app.aadhaarLast4 || "4829"}`}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.2 rounded text-[9px] print:text-[7.5px]">
                    ✓ ભરપાઈ થયેલ (PAID: ₹{app.feeAmount || 50})
                  </span>
                </div>
              </div>

              {/* Official e-Gram VCE Biometric Authorization & Zero Cash Notice */}
              <div className="bg-amber-50/80 border border-amber-300 rounded p-1.5 print:p-1 text-[9.5px] print:text-[8px] space-y-0.5 text-slate-800">
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <span>📍 સ્થાનિક ગ્રામ પંચાયત e-Gram કેન્દ્ર પ્રમાણીકરણ (Zero Cash Protocol):</span>
                  <span className="bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-mono text-[7.5px] font-bold">
                    Govt. Authorized
                  </span>
                </div>
                <p className="leading-tight text-slate-700">
                  <strong className="text-emerald-800">અરજદારે સ્થાનિક કેન્દ્ર પર કોઈ વધારાની રોકડ રકમ ચૂકવવાની રહેતી નથી.</strong> આ અરજીની નિયત સરકારી ફી સાયબર ટ્રેઝરી પોર્ટલ મારફતે ઓનલાઇન જમા થઈ ચૂકી છે.
                </p>
                <p className="text-[8px] print:text-[7px] text-slate-600 font-medium">
                  આ સત્તાવાર પહોંચ ગ્રામ પંચાયતના e-Gram કેન્દ્ર ખાતે દર્શાવીને ૨ મિનિટમાં બાયોમેટ્રિક ખરાઈ કરાવી શકાશે. હેલ્પલાઇન: CM ૧૦૭૦ / પંચાયત ૧૮૦૦-૨૩૩-૫૫૦૦.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Audit Trail & Stage Clearance */}
          <div className="border border-slate-300 rounded-md overflow-hidden mb-2 print:mb-1">
            <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10.5px] print:text-[8.5px] font-bold tracking-wide uppercase">
              ૩. સરકારી પ્રક્રિયા અને ઓડિટ સ્ટેટસ (Verification Stages)
            </div>
            <table className="w-full text-[10px] print:text-[8px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                  <th className="p-1 print:p-0.5 font-bold">તબક્કો (Stage)</th>
                  <th className="p-1 print:p-0.5 font-bold">ચકાસણી ઓથોરિટી</th>
                  <th className="p-1 print:p-0.5 font-bold">ખરાઈ પદ્ધતિ</th>
                  <th className="p-1 print:p-0.5 font-bold text-right">સ્થિતિ (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-1 print:p-0.5 font-medium">૧. અરજી સબમિશન</td>
                  <td className="p-1 print:p-0.5 text-slate-600">જન સેવા કેન્દ્ર / CSC VLE</td>
                  <td className="p-1 print:p-0.5 text-slate-600">ડિજિટલ પોર્ટલ પોઇન્ટ</td>
                  <td className="p-1 print:p-0.5 text-right font-bold text-emerald-700">✓ પૂર્ણ (Cleared)</td>
                </tr>
                <tr>
                  <td className="p-1 print:p-0.5 font-medium">૨. દસ્તાવેજ ખરાઈ</td>
                  <td className="p-1 print:p-0.5 text-slate-600">તલાટી કમ મંત્રી / ગ્રામ સેવક</td>
                  <td className="p-1 print:p-0.5 text-slate-600">૭/૧૨, ૮-અ, આવક દાખલો</td>
                  <td className="p-1 print:p-0.5 text-right font-bold text-emerald-700">✓ પ્રમાણિત (Verified)</td>
                </tr>
                <tr>
                  <td className="p-1 print:p-0.5 font-medium">૩. વહીવટી મંજૂરી</td>
                  <td className="p-1 print:p-0.5 text-slate-600">{app.officerDesignation}</td>
                  <td className="p-1 print:p-0.5 text-slate-600">સક્ષમ અધિકારી સમીક્ષા</td>
                  <td className="p-1 print:p-0.5 text-right font-bold text-emerald-700">
                    {app.status === "approved" ? "✓ મંજૂર (Approved)" : "⏳ પ્રક્રિયા હેઠળ"}
                  </td>
                </tr>
                <tr>
                  <td className="p-1 print:p-0.5 font-medium">૪. DBT સહાય ચુકવણી</td>
                  <td className="p-1 print:p-0.5 text-slate-600">PFMS / સ્ટેટ ટ્રેઝરી પોર્ટલ</td>
                  <td className="p-1 print:p-0.5 text-slate-600">આધાર લિંક્ડ બેંક એકાઉન્ટ</td>
                  <td className="p-1 print:p-0.5 text-right font-bold text-emerald-700">
                    {app.status === "approved" ? "✓ સફળ ટ્રાન્સફર" : "⏳ શિડ્યુલ પ્રક્રિયા"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION: Authentic Rubber Stamp & Digital Signature */}
        <div className="pt-1.5 print:pt-1 border-t-2 border-slate-900 mt-1 print:mt-0.5">
          <div className="grid grid-cols-3 gap-2 items-center">
            {/* Left: Verification QR Code */}
            <div className="flex items-center gap-1.5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 print:w-10 print:h-10 p-0.5 bg-white border border-slate-400 rounded flex flex-col items-center justify-center shrink-0">
                <QrCode size={36} className="text-slate-900" />
              </div>
              <div className="text-[8px] print:text-[6.5px] text-slate-600 leading-tight">
                <p className="font-bold text-slate-900">QR કોડ સ્કેન કરો</p>
                <p>મોબાઈલ દ્વારા પહોંચની સત્યતા તપાસો.</p>
                <p className="font-mono text-[7px] text-orange-700 truncate max-w-[110px]">
                  nagrik-seva.gov.in
                </p>
              </div>
            </div>

            {/* Center: Authentic Circular Rubber Stamp (સિક્કો) */}
            <div className="flex justify-center">
              <div className="relative -rotate-6 select-none">
                <div className="w-20 h-20 sm:w-22 sm:h-22 print:w-15 print:h-15 rounded-full border-2 border-dashed border-blue-800 p-0.5 flex flex-col items-center justify-center text-center text-blue-900 bg-blue-50/20 shadow-xs">
                  <div className="w-full h-full rounded-full border border-blue-800 p-0.5 flex flex-col items-center justify-center">
                    <span className="text-[6px] print:text-[4.5px] font-black uppercase tracking-widest text-blue-900">
                      ★ MAMLATDAR OFFICE ★
                    </span>
                    <span className="text-[8px] print:text-[6px] font-black uppercase text-blue-900 my-0.2">
                      OFFICIAL SEAL
                    </span>
                    <span className="text-[7px] print:text-[5px] font-bold text-blue-800 uppercase">
                      {app.taluka}
                    </span>
                    <span className="text-[6px] print:text-[4.5px] font-mono text-blue-700 mt-0.2">
                      {app.lastUpdated}
                    </span>
                    <span className="text-[5.5px] print:text-[4px] font-bold text-blue-900 tracking-tighter">
                      GOVT. OF GUJARAT
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-900 text-white text-[6.5px] print:text-[5px] font-bold px-1 py-0.2 rounded uppercase">
                  VERIFIED
                </div>
              </div>
            </div>

            {/* Right: Digital Signature (સહી) */}
            <div className="text-right space-y-0.5">
              <div className="inline-flex items-center gap-1 text-[8.5px] print:text-[6.5px] text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.2 rounded font-bold">
                <CheckCircle2 size={10} className="text-emerald-700" /> e-Sign પ્રમાણિત
              </div>
              <div>
                {/* Simulated Cursive Official Signature */}
                <p className="font-serif italic text-sm sm:text-base print:text-[11px] text-slate-800 leading-none select-none font-bold">
                  K. R. Vaghela
                </p>
                <div className="border-t border-slate-400 mt-0.5 pt-0.2">
                  <p className="text-[9.5px] print:text-[7.5px] font-black text-slate-900">સક્ષમ સત્તાધિકારી</p>
                  <p className="text-[8px] print:text-[6.5px] text-slate-600">{app.officerDesignation}</p>
                  <p className="text-[7px] print:text-[5.5px] text-slate-500 font-mono">
                    DSC ID: GJ-GOV-AUTH-{app.aadhaarLast4}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Legal Disclaimer */}
          <div className="border-t border-slate-200 mt-1 print:mt-0.5 pt-1 print:pt-0.5 flex flex-col sm:flex-row items-center justify-between text-[7.5px] print:text-[6.5px] text-slate-500 gap-0.5 text-center sm:text-left">
            <p>
              આ કમ્પ્યુટર દ્વારા તૈયાર થયેલ કાયદેસર સત્તાવાર ડિજિટલ પહોંચ છે. તેને સહી કે સ્ટેમ્પ વિના પણ તમામ સરકારી કચેરીઓમાં માન્ય ગણવામાં આવે છે.
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
