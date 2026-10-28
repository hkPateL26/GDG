"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Printer,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Download,
  Users,
  Award,
  Calendar,
  Building,
  CreditCard,
  FileText,
  X,
} from "lucide-react";
import { CitizenLedgerProfile } from "@/lib/large-datasets";
import {
  getCitizenEntitlementSummary,
  FamilyEntitlementItem,
  EntitlementCategory,
} from "@/lib/entitlement-passbook-engine";
import Link from "next/link";

interface CitizenEntitlementPassbookProps {
  citizen?: Partial<CitizenLedgerProfile>;
  className?: string;
}

export default function CitizenEntitlementPassbook({
  citizen,
  className = "",
}: CitizenEntitlementPassbookProps) {
  const summary = getCitizenEntitlementSummary(citizen);
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Distinct members for filtering
  const memberOptions = [
    { id: "all", labelGu: "👥 સમગ્ર કુટુંબ (All Members)" },
    { id: "member-self", labelGu: "👤 હરી પટેલ (પોતે)" },
    { id: "member-father", labelGu: "👴 વિનોદરાઈ પટેલ (પિતા)" },
    { id: "member-mother", labelGu: "👵 ભાવનાબેન પટેલ (માતા)" },
    { id: "member-daughter", labelGu: "👧 અનુરાધા પટેલ (પુત્રી)" },
    { id: "family-all", labelGu: "🛡️ સંયુક્ત કુટુંબ કવચ" },
  ];

  const filteredItems = summary.items.filter((item) => {
    const matchesMember =
      selectedMember === "all" ||
      item.memberId === selectedMember ||
      (selectedMember !== "all" && item.memberId === "family-all");
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesMember && matchesCategory;
  });

  const memberTotalValue = filteredItems.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePrint = () => {
    const oldIframe = document.getElementById("passbook-print-frame");
    if (oldIframe) {
      oldIframe.remove();
    }

    const iframe = document.createElement("iframe");
    iframe.id = "passbook-print-frame";
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
          <title>Citizen_Passbook_${summary.kutumbId}</title>
          ${styleTags}
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm 10mm;
            }
            body {
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: system-ui, -apple-system, sans-serif !important;
            }
            #official-passbook-print-area {
              border: 2px solid #0f172a !important;
              padding: 6mm 8mm !important;
            }
          </style>
        </head>
        <body>
          <div id="print-root">
            ${document.getElementById("official-passbook-print-area")?.outerHTML || ""}
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
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* ── Official Passbook Top Hero Card (Bank-Passbook Aesthetic) ── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-4 sm:p-7 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden">
        {/* Tricolor Government Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] absolute top-0 inset-x-0" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center text-2xl sm:text-3xl font-black shrink-0 shadow-lg border border-amber-300">
              💳
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  સત્તાવાર નાગરિક ખાતાવહી
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={11} /> 2FA UIDAI લિંક્ડ
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-1 leading-tight">
                નાગરિક અધિકાર પાસબુક (Family Entitlement Passbook)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                કુટુંબનું સત્તાવાર સોશિયલ પ્રોટેક્શન લેજર &bull; કુલ મળવાપાત્ર સરકારી સહાય, કેશલેસ સારવાર અને રિન્યુઅલ એલર્ટ્સ.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Printer size={16} />
              <span>અધિકાર પત્રક ડાઉનલોડ (PDF)</span>
            </button>
          </div>
        </div>

        {/* Kutumb Identity Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">કુટુંબ ID (Kutumb ID)</span>
            <strong className="text-amber-400 text-xs sm:text-sm">{summary.kutumbId}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">કુટુંબના વડા</span>
            <strong className="text-white text-xs sm:text-sm font-sans">{summary.headNameGu}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">ગામ / તાલુકો</span>
            <span className="text-slate-200 text-xs font-sans">ગોમટા, ગોંડલ (રાજકોટ)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">ડિજિટલ નોટરી સીલ</span>
            <span className="text-emerald-400 text-[11px] truncate block">{summary.cryptographicSeal}</span>
          </div>
        </div>

        {/* Financial Aggregation 4-Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/40 p-3.5 rounded-2xl">
            <span className="text-[10.5px] text-amber-300 font-bold block flex items-center gap-1">
              🌟 કુલ રાજ્ય સહાય & કવચ
            </span>
            <span className="text-lg sm:text-2xl font-black text-amber-400 font-mono">
              ₹{summary.totalLifetimeValue.toLocaleString("en-IN")}/-
            </span>
            <span className="text-[9.5px] text-slate-400 block mt-0.5 font-sans">આજીવન સરકારી લાભ મૂલ્ય</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-[10.5px] text-emerald-400 font-bold block flex items-center gap-1">
              🏦 DBT રોકડ જમા
            </span>
            <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono">
              ₹{summary.dbtCashTotal.toLocaleString("en-IN")}/-
            </span>
            <span className="text-[9.5px] text-slate-400 block mt-0.5 font-sans">બેંક ખાતામાં સીધા જમા</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-[10.5px] text-sky-400 font-bold block flex items-center gap-1">
              🛡️ કેશલેસ આરોગ્ય કવચ
            </span>
            <span className="text-lg sm:text-2xl font-black text-sky-300 font-mono">
              ₹{summary.insuranceCoverTotal.toLocaleString("en-IN")}/-
            </span>
            <span className="text-[9.5px] text-slate-400 block mt-0.5 font-sans">PM-JAY & અકસ્માત વીમો</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-[10.5px] text-orange-400 font-bold block flex items-center gap-1">
              ⚡ સબસિડી & આવાસ ગ્રાન્ટ
            </span>
            <span className="text-lg sm:text-2xl font-black text-orange-300 font-mono">
              ₹{(summary.housingAssetTotal + summary.inKindSubsidyTotal).toLocaleString("en-IN")}/-
            </span>
            <span className="text-[9.5px] text-slate-400 block mt-0.5 font-sans">સોલર, શૌચાલય, અનાજ</span>
          </div>
        </div>
      </div>

      {/* ── Statutory Proactive Renewal & KYC Alerts Banner ── */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <AlertTriangle size={17} />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-amber-950">
                કાનૂની રિન્યુઅલ & વાર્ષિક e-KYC સમયમર્યાદા (Statutory Renewal Alerts)
              </h4>
              <p className="text-[11px] text-amber-800">
                યોજનાના લાભો અવિરત ચાલુ રાખવા માટે સમયસર ચકાસણી કરાવો.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-rose-600 text-white font-extrabold px-2.5 py-1 rounded-full animate-pulse shadow-xs">
            {summary.activeRenewalsCount} તાકીદની કાર્યવાહી બાકી
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          {summary.renewalAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border flex flex-col justify-between gap-2 text-xs transition ${
                alert.alertType === "urgent_renewal"
                  ? "bg-rose-50/80 border-rose-300 text-rose-950"
                  : alert.alertType === "window_open"
                  ? "bg-amber-50/80 border-amber-300 text-amber-950"
                  : "bg-emerald-50/80 border-emerald-300 text-emerald-950"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-[11px] truncate">{alert.schemeNameGu}</span>
                  <span
                    className={`text-[9.5px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      alert.alertType === "urgent_renewal"
                        ? "bg-rose-600 text-white"
                        : alert.alertType === "window_open"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {alert.dueDeadlineGu}
                  </span>
                </div>
                <p className="font-extrabold text-xs leading-snug">{alert.titleGu}</p>
                <p className="text-[10.5px] text-slate-600 mt-1">{alert.mandatoryRuleGu}</p>
              </div>

              <Link
                href={alert.actionUrl}
                className="mt-1 inline-flex items-center justify-center gap-1 py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 transition active:scale-95 shadow-2xs"
              >
                <span>{alert.actionTextGu}</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── Family Member & Category Filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        {/* Family Member Pill Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none touch-pan-x">
          {memberOptions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMember(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 min-h-[36px] select-none ${
                selectedMember === m.id
                  ? "bg-slate-900 text-white shadow-xs ring-1 ring-slate-800"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {m.labelGu}
            </button>
          ))}
        </div>

        {/* Category Pill Selector */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar scrollbar-none">
          {[
            { id: "all", label: "તમામ લાભ" },
            { id: "dbt_cash", label: "DBT રોકડ" },
            { id: "insurance_cover", label: "આરોગ્ય કવચ" },
            { id: "housing_asset", label: "આવાસ/સોલર" },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0 ${
                selectedCategory === c.id
                  ? "bg-amber-400 text-slate-950 font-black shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Itemized Passbook Ledger Table & Cards ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Top Header */}
        <div className="bg-slate-50 p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-amber-600" />
            <h3 className="font-black text-xs sm:text-sm text-slate-900">
              વિગતવાર સહાય નોંધાવહી (Itemized Welfare Ledger)
            </h3>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {filteredItems.length} એન્ટ્રીઓ
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold block">પસંદ કરેલ સભ્ય કુલ:</span>
            <span className="font-mono text-sm sm:text-base font-black text-emerald-700">
              ₹{memberTotalValue.toLocaleString("en-IN")}/-
            </span>
          </div>
        </div>

        {/* Responsive Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">તારીખ & નાણાકીય વર્ષ</th>
                <th className="p-3">યોજના & અમલીકરણ વિભાગ</th>
                <th className="p-3">લાભાર્થી સભ્ય</th>
                <th className="p-3">કેટેગરી & સંદર્ભ ક્રમાંક</th>
                <th className="p-3 text-right">સહાય / કવચ રકમ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  {/* Date */}
                  <td className="p-3 align-top whitespace-nowrap">
                    <span className="font-bold text-slate-900 block">{item.disbursedDate}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">FY {item.financialYear}</span>
                  </td>

                  {/* Scheme & Dept */}
                  <td className="p-3 align-top">
                    <span className="font-black text-slate-900 block leading-snug">{item.schemeNameGu}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{item.departmentGu}</span>
                    <p className="text-[10.5px] text-slate-600 italic mt-1 leading-snug">{item.remarksGu}</p>
                  </td>

                  {/* Beneficiary */}
                  <td className="p-3 align-top whitespace-nowrap">
                    <span className="font-bold text-slate-900 block">{item.beneficiaryNameGu}</span>
                    <span className="text-[10px] text-slate-500 block">{item.beneficiaryRelationGu}</span>
                  </td>

                  {/* Category & Ref */}
                  <td className="p-3 align-top whitespace-nowrap">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                        item.category === "dbt_cash"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : item.category === "insurance_cover"
                          ? "bg-sky-100 text-sky-800 border border-sky-200"
                          : "bg-orange-100 text-orange-800 border border-orange-200"
                      }`}
                    >
                      {item.categoryLabelGu}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">{item.referenceNo}</span>
                  </td>

                  {/* Amount */}
                  <td className="p-3 align-top text-right whitespace-nowrap">
                    <span className="font-mono text-sm sm:text-base font-black text-emerald-700 block">
                      ₹{item.amount.toLocaleString("en-IN")}/-
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md inline-block mt-0.5">
                      {item.statusLabelGu}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Responsive Mobile Cards */}
        <div className="sm:hidden divide-y divide-slate-100">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-3.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`inline-block text-[9.5px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                      item.category === "dbt_cash"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : item.category === "insurance_cover"
                        ? "bg-sky-100 text-sky-800 border border-sky-200"
                        : "bg-orange-100 text-orange-800 border border-orange-200"
                    }`}
                  >
                    {item.categoryLabelGu}
                  </span>
                  <h4 className="font-black text-xs text-slate-900 leading-snug">{item.schemeNameGu}</h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-black text-emerald-700 block">
                    ₹{item.amount.toLocaleString("en-IN")}/-
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold block">{item.statusLabelGu}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">લાભાર્થી:</span>
                  <strong className="text-slate-800">{item.beneficiaryNameGu} ({item.beneficiaryRelationGu})</strong>
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-slate-500 font-sans">સંદર્ભ ક્રમાંક:</span>
                  <span className="text-slate-700">{item.referenceNo}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">તારીખ:</span>
                  <span className="text-slate-700">{item.disbursedDate}</span>
                </div>
              </div>

              <p className="text-[10.5px] text-slate-600 leading-snug italic">
                {item.remarksGu}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hidden Printable Document Layout (Used by iframe print) ── */}
      <div className="hidden">
        <div id="official-passbook-print-area" className="bg-white text-slate-900 p-6 space-y-4">
          {/* Header */}
          <div className="text-center border-b border-slate-900 pb-3 space-y-1">
            <p className="text-xl">🏛️</p>
            <h2 className="text-xs font-black tracking-widest uppercase text-slate-700">
              ગુજરાત સરકાર &bull; GOVERNMENT OF GUJARAT
            </h2>
            <h1 className="text-base font-black text-slate-900">
              સત્તાવાર નાગરિક & કુટુંબ અધિકાર પત્રક (WELFARE ENTITLEMENT PASSBOOK)
            </h1>
            <p className="text-[11px] text-slate-600">
              ડિજિટલ પબ્લિક ઇન્ફ્રાસ્ટ્રક્ચર (DPI) &bull; અખંડિત સામાજિક સુરક્ષા લેજર
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-200 pb-2">
            <div>
              <p>કુટુંબ ID: <strong>{summary.kutumbId}</strong></p>
              <p>કુટુંબના વડા: <strong>{summary.headNameGu}</strong></p>
            </div>
            <div className="text-right">
              <p>કુલ સહાય મૂલ્ય: <strong className="text-emerald-700">₹{summary.totalLifetimeValue.toLocaleString("en-IN")}/-</strong></p>
              <p>ડિજિટલ નોટરી સીલ: <strong className="font-mono text-[10px]">{summary.cryptographicSeal}</strong></p>
            </div>
          </div>

          {/* Ledger Table */}
          <table className="w-full text-left text-xs border border-slate-900 border-collapse">
            <thead className="bg-slate-100 border-b border-slate-900 font-bold">
              <tr>
                <th className="p-2 border-r border-slate-900">તારીખ</th>
                <th className="p-2 border-r border-slate-900">યોજના</th>
                <th className="p-2 border-r border-slate-900">લાભાર્થી</th>
                <th className="p-2 border-r border-slate-900">પ્રકાર</th>
                <th className="p-2 text-right">રકમ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {summary.items.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border-r border-slate-300 whitespace-nowrap">{item.disbursedDate}</td>
                  <td className="p-2 border-r border-slate-300">{item.schemeNameGu}</td>
                  <td className="p-2 border-r border-slate-300 whitespace-nowrap">{item.beneficiaryNameGu}</td>
                  <td className="p-2 border-r border-slate-300 whitespace-nowrap">{item.categoryLabelGu}</td>
                  <td className="p-2 text-right font-bold whitespace-nowrap">₹{item.amount.toLocaleString("en-IN")}/-</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex justify-between text-[10px] text-slate-500">
            <span>સત્તાવાર સરકારી ઈ-ગવર્નન્સ ઓટો-જનરેટેડ અધિકાર પત્રક (IT Act 2000)</span>
            <span>https://nagrikseva-ai-one.vercel.app/passbook</span>
          </div>
        </div>
      </div>
    </div>
  );
}
