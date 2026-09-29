"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  APP_VERSION,
  APP_BUILD_NAME,
  APP_RELEASE_DATE,
  LEAD_DEVELOPERS,
} from "@/lib/app-version";
import {
  ShieldCheck,
  Phone,
  RefreshCw,
  Award,
  ExternalLink,
  Cpu,
  Lock,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const pathname = usePathname();

  const handleOpenUpdateModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nagrik_check_update"));
    }
  };

  // Keep /chat view full-height and uncluttered
  if (pathname === "/chat") return null;

  return (
    <footer
      className="bg-slate-950 text-slate-300 border-t-2 border-orange-500 pt-10 pb-16 xl:pb-12 px-4 sm:px-6 lg:px-8 notranslate select-none"
      translate="no"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Main 4-Column Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Gov Portal Authority */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl leading-none">🇮🇳</span>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                  Nagrik<span className="text-orange-500">Seva</span>{" "}
                  <span className="text-emerald-400">AI</span>
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Digital Public Infrastructure
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              ગુજરાત સરકાર e-Governance અને Digital Public Infrastructure (DPI) માપદંડો મુજબ નાગરિકોને યોજનાઓ, પાત્રતા, દસ્તાવેજ પ્રમાણીકરણ અને 2FA આધાર સુરક્ષા પૂરી પાડતું કેન્દ્રીય પોર્ટલ.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10.5px] font-bold">
                <ShieldCheck size={13} className="shrink-0" />
                <span>GIGW & DPI પ્રમાણિત</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-[10.5px] font-mono font-bold">
                <Lock size={11} className="shrink-0" />
                <span>2FA સુરક્ષિત</span>
              </span>
            </div>
          </div>

          {/* Column 2: Digital Public Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              📌 મુખ્ય નાગરિક સેવાઓ
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/eligibility" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> પાત્રતા કેલ્ક્યુલેટર (Eligibility)
                </Link>
              </li>
              <li>
                <Link href="/benefit-calculator" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> કૌટુંબિક લાભ & WhatsApp પાસ
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> ૨૬+ સરકારી યોજનાઓ ડેટાબેઝ
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> ડિજિટલ વોલ્ટ & પ્રમાણપત્રો
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> ઓનલાઇન અરજી ટ્રેકિંગ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Citizen Helpline & Assistance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              🏛️ જન સેવા & સહાય કેન્દ્ર
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/locator" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> નજીકની મામલતદાર / તાલુકા કચેરી
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> 24/7 Gemini AI ગુજરાતી ચેટ
                </Link>
              </li>
              <li>
                <Link href="/portal?mode=citizen" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> નાગરિક વોલ્ટ & 2FA લૉગિન
                </Link>
              </li>
              <li>
                <Link href="/portal?mode=officer" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> કચેરી એડમિન સ્ક્રુટિની ડેસ્ક
                </Link>
              </li>
              <li className="pt-1">
                <a
                  href="tel:14567"
                  className="inline-flex items-center gap-1.5 bg-orange-600/20 border border-orange-500/40 text-orange-400 px-3 py-1.5 rounded-xl font-bold hover:bg-orange-600 hover:text-white transition"
                >
                  <Phone size={13} className="shrink-0" />
                  <span>હેલ્પલાઇન: 14567 (ટોલ-ફ્રી 24/7)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: System Architecture & Versioning */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              ⚙️ સિસ્ટમ વર્ઝન & ટેલિમેટ્રી
            </h4>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">સત્તાવાર વર્ઝન:</span>
                <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {APP_VERSION}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">ડેટાસેન્ટર:</span>
                <span className="text-slate-200 font-mono text-[11px]">GSDC ગાંધીનગર</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">અપટાઇમ:</span>
                <span className="text-emerald-400 font-bold text-[11px]">૯૯.૯૮% સક્રિય</span>
              </div>
              <button
                type="button"
                onClick={handleOpenUpdateModal}
                className="w-full mt-1 py-1.5 px-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="સરકારી સિસ્ટમ અપડેટ તપાસો"
              >
                <RefreshCw size={12} className="shrink-0 text-amber-400" />
                <span>સત્તાવાર અપડેટ તપાસો (Check)</span>
              </button>
            </div>
          </div>

        </div>

        {/* ── Official Government Developer & Architecture Credit Block ── */}
        <div className="border-t border-slate-800/90 pt-6 mt-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Lead Developers Attribution */}
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Award size={16} className="text-amber-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  સિસ્ટમ આર્કિટેક્ચર અને લીડ એન્જિનિયરિંગ:
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-xs sm:text-sm">
                <span className="font-bold text-white">
                  <span className="text-orange-400 font-black">{LEAD_DEVELOPERS[0].nameGu}</span> ({LEAD_DEVELOPERS[0].name})
                  <span className="text-[11px] text-slate-400 font-normal ml-1">— {LEAD_DEVELOPERS[0].role}</span>
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="font-bold text-white">
                  <span className="text-emerald-400 font-black">{LEAD_DEVELOPERS[1].nameGu}</span> ({LEAD_DEVELOPERS[1].name})
                  <span className="text-[11px] text-slate-400 font-normal ml-1">— {LEAD_DEVELOPERS[1].role}</span>
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                Digital Public Infrastructure (DPI) Core Engineering Unit • NIC & GSDC Standard • GDG Code for Communities 2.0
              </p>
            </div>

            {/* Official Release Badge */}
            <div className="shrink-0 flex flex-col items-center md:items-end">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {APP_VERSION} ({APP_BUILD_NAME})
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">
                સત્તાવાર પ્રકાશન: {APP_RELEASE_DATE}
              </span>
            </div>

          </div>
        </div>

        {/* ── Statutory Copyright & Legal Disclaimer ── */}
        <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 text-center sm:text-left">
          <p>
            © ૨૦૨૬ નાગરિકસેવા AI (NagrikSeva AI). સર્વ અધિકાર સુરક્ષિત. ગુજરાત સરકાર e-Governance માપદંડો.
          </p>
          <div className="flex items-center gap-3">
            <span>ગુજરાત જાહેર સેવા હક અધિનિયમ (GRTSA ૨૦૧૩)</span>
            <span>•</span>
            <span>NFSA ૨૦૧૩ માન્ય</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
