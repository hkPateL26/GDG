"use client";

import React, { useState } from "react";
import { MessageSquare, Share2, Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";
import {
  WhatsAppApplicationData,
  formatWhatsAppCitizenMessage,
  getWhatsAppShareUrl,
} from "@/lib/whatsapp-dispatch";

interface WhatsAppDispatchCardProps {
  app: WhatsAppApplicationData;
  className?: string;
  isCompact?: boolean;
}

export default function WhatsAppDispatchCard({
  app,
  className = "",
  isCompact = false,
}: WhatsAppDispatchCardProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const formattedText = formatWhatsAppCitizenMessage(app);
  const shareUrl = getWhatsAppShareUrl(app);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenWhatsApp = () => {
    if (typeof window !== "undefined") {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`bg-slate-950 border border-emerald-600/40 rounded-2xl p-3.5 sm:p-4 text-white shadow-xl space-y-3 relative overflow-hidden ${className}`}
    >
      {/* Top Banner with WhatsApp Green Accents */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <MessageSquare size={16} className="fill-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-emerald-400">ગુજરાત સંવાદ (WhatsApp Alert)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              સત્તાવાર નાગરિક વૉટ્સએપ સૂચના &bull; 1-Click Share
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center gap-1">
          <ShieldCheck size={11} /> VERIFIED
        </span>
      </div>

      {/* Simulated WhatsApp Chat Bubble */}
      <div className="bg-[#0b141a] rounded-xl p-3 border border-emerald-900/30 text-xs font-mono leading-relaxed space-y-2 text-slate-200">
        <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold border-b border-slate-800/80 pb-1">
          <span>🏛️ GOVT OF GUJARAT e-GOVERNANCE</span>
          <span>{app.mobile ? `+91 ${app.mobile}` : "CITIZEN"}</span>
        </div>

        <div className="space-y-1 font-sans text-xs">
          <p className="text-slate-100">
            નમસ્તે <strong className="text-emerald-300">{app.citizenNameGu || app.citizenName || "નાગરિક"}</strong>, તમારી{" "}
            <strong className="text-amber-300">{app.schemeNameGu || app.schemeName}</strong> માટેની અરજી (
            <span className="font-mono text-emerald-400">{app.id}</span>) સફળતાપૂર્વક સ્વીકારાઈ છે.
          </p>
          <div className="text-[11px] text-slate-400 pt-1 space-y-0.5">
            <p>&bull; ચુકવેલ ફી: ₹{app.feeAmount || "૫૦"} ({app.challanNo || app.txnId || "સત્તાવાર રસીદ"})</p>
            <p>&bull; સક્ષમ કચેરી: {app.taluka || "તાલુકા કચેરી"}, {app.districtGu || app.district || "ગુજરાત"}</p>
          </div>
        </div>

        {/* Links Preview */}
        <div className="bg-[#111b21] p-2 rounded-lg border border-slate-800 text-[10.5px] space-y-1 text-slate-300">
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            🔍 લાઈવ ટ્રેકિંગ & 🛡️ QR ખરાઈ લિંક સાથે સંકલિત
          </p>
          <p className="text-[9.5px] text-slate-400 truncate font-mono">
            /verify?id={app.id}
          </p>
        </div>

        {/* WhatsApp Message Metadata (Timestamp + Blue Double Check) */}
        <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1 font-sans">
          <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <span className="text-sky-400 font-bold tracking-tighter">✓✓</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black py-2.5 px-3 rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
        >
          <Share2 size={14} />
          <span>વોટ્સએપ પર મેળવો (Share to WhatsApp)</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? "કૉપિ થઈ ગયું!" : "મેસેજ કૉપિ કરો"}</span>
        </button>
      </div>
    </div>
  );
}
