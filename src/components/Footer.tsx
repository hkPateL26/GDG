"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  APP_VERSION,
  APP_BUILD_NAME,
  APP_RELEASE_DATE,
  APP_RELEASE_DATE_EN,
} from "@/lib/app-version";
import {
  ShieldCheck,
  Phone,
  RefreshCw,
  Award,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useIsPwaInstalled } from "@/lib/usePwaInstall";

export default function Footer() {
  const pathname = usePathname();
  const { currentLang } = useLanguage();
  const { isStandalone } = useIsPwaInstalled();

  const handleOpenUpdateModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nagrik_check_update"));
    }
  };

  // Keep /chat view full-height and uncluttered
  if (pathname === "/chat") return null;

  const isEn = currentLang === "en";
  const isHi = currentLang === "hi";

  const t = {
    dpiSub: isEn
      ? "Digital Public Infrastructure"
      : isHi
      ? "डिजिटल पब्लिक इंफ्रास्ट्रक्चर"
      : "Digital Public Infrastructure",
    description: isEn
      ? "Government of Gujarat e-Governance and Digital Public Infrastructure (DPI) compliant centralized portal providing scheme eligibility, document verification, and 2FA security to citizens."
      : isHi
      ? "गुजरात सरकार e-Governance और डिजिटल पब्लिक इंफ्रास्ट्रक्चर (DPI) मानकों के अनुरूप नागरिकों को योजना पात्रता, दस्तावेज़ सत्यापन और 2FA सुरक्षा प्रदान करने वाला केंद्रीय पोर्टल।"
      : "ગુજરાત સરકાર e-Governance અને Digital Public Infrastructure (DPI) માપદંડો મુજબ નાગરિકોને યોજનાઓ, પાત્રતા, દસ્તાવેજ પ્રમાણીકરણ અને 2FA આધાર સુરક્ષા પૂરી પાડતું કેન્દ્રીય પોર્ટલ.",
    gigw: isEn ? "GIGW & DPI Certified" : isHi ? "GIGW और DPI प्रमाणित" : "GIGW & DPI પ્રમાણિત",
    secure2fa: isEn ? "2FA Secure" : isHi ? "2FA सुरक्षित" : "2FA સુરક્ષિત",
    col2Title: isEn ? "Key Citizen Services" : isHi ? "मुख्य नागरिक सेवाएं" : "મુખ્ય નાગરિક સેવાઓ",
    eligibility: isEn ? "Eligibility Calculator" : isHi ? "पात्रता कैलकुलेटर" : "પાત્રતા કેલ્ક્યુલેટર (Eligibility)",
    benefits: isEn ? "Family Benefit Calculator & Pass" : isHi ? "पारिवारिक लाभ कैलकुलेटर और पास" : "કૌટુંબિક લાભ & WhatsApp પાસ",
    schemes: isEn ? "26+ Government Schemes Database" : isHi ? "२६+ सरकारी योजना डेटाबेस" : "૨૬+ સરકારી યોજનાઓ ડેટાબેઝ",
    vault: isEn ? "Digital Vault & Certificates" : isHi ? "डिजिटल वॉल्ट और प्रमाणपत्र" : "ડિજિટલ વોલ્ટ & પ્રમાણપત્રો",
    tracking: isEn ? "Online Application Tracking" : isHi ? "ऑनलाइन आवेदन ट्रैकिंग" : "ઓનલાઇન અરજી ટ્રેકિંગ",
    col3Title: isEn ? "Citizen Help & Service Centres" : isHi ? "जन सेवा एवं सहायता केंद्र" : "જન સેવા & સહાય કેન્દ્ર",
    offices: isEn ? "Nearest Mamlatdar / Taluka Office" : isHi ? "निकटतम मामलतदार / तहसील कार्यालय" : "નજીકની મામલતદાર / તાલુકા કચેરી",
    aiChat: isEn ? "24/7 Gemini AI Assistant" : isHi ? "24/7 Gemini AI सहायक" : "24/7 Gemini AI ગુજરાતી ચેટ",
    citizenLogin: isEn ? "Citizen Vault & 2FA Login" : isHi ? "नागरिक वॉल्ट एवं 2FA लॉगिन" : "નાગરિક વોલ્ટ & 2FA લૉગિન",
    officerDesk: isEn ? "Office Admin Scrutiny Desk" : isHi ? "कार्यालय व्यवस्थापक डेस्क" : "કચેરી એડમિન સ્ક્રુટિની ડેસ્ક",
    helpline: isEn ? "Helpline: 14567 (Toll-Free 24/7)" : isHi ? "हेल्पलाइन: 14567 (टोल-फ्री 24/7)" : "હેલ્પલાઇન: 14567 (ટોલ-ફ્રી 24/7)",
    col4Title: isEn ? "System Version & Telemetry" : isHi ? "सिस्टम संस्करण और टेलीमेट्री" : "સિસ્ટમ વર્ઝન & ટેલિમેટ્રી",
    versionLabel: isEn ? "Official Version:" : isHi ? "आधिकारिक संस्करण:" : "સત્તાવાર વર્ઝન:",
    dataCenter: isEn ? "Data Centre:" : isHi ? "डेटा सेंटर:" : "ડેટાસેન્ટર:",
    uptime: isEn ? "Uptime:" : isHi ? "अपटाइम:" : "અપટાઇમ:",
    uptimeVal: isEn ? "99.98% Active" : isHi ? "९९.९८% सक्रिय" : "૯૯.૯૮% સક્રિય",
    checkUpdate: isEn ? "Check Official Updates" : isHi ? "आधिकारिक अपडेट जांचें" : "સત્તાવાર અપડેટ તપાસો (Check)",
    architectsTitle: isEn ? "SYSTEM ARCHITECTURE & LEAD ENGINEERING:" : isHi ? "सिस्टम आर्किटेक्चर एवं मुख्य इंजीनियरिंग:" : "સિસ્ટમ આર્કિટેક્ચર અને લીડ એન્જિનિયરિંગ:",
    hariRole: isEn ? "Chief System Architect" : isHi ? "मुख्य सिस्टम आर्किटेक्ट" : "Chief System Architect",
    jeetRole: isEn ? "Lead Full-Stack Engineer" : isHi ? "मुख्य फुल-स्टैक इंजीनियर" : "Lead Full-Stack Engineer",
    unitTag: isEn
      ? "Digital Public Infrastructure (DPI) Core Engineering Unit • NIC & GSDC Standard • GDG Code for Communities 2.0"
      : isHi
      ? "डिजिटल पब्लिक इंफ्रास्ट्रक्चर (DPI) कोर इंजीनियरिंग यूनिट • NIC एवं GSDC मानक • GDG Code for Communities 2.0"
      : "Digital Public Infrastructure (DPI) Core Engineering Unit • NIC & GSDC Standard • GDG Code for Communities 2.0",
    releaseLabel: isEn ? `Official Release: ${APP_RELEASE_DATE_EN}` : isHi ? `आधिकारिक विमोचन: ${APP_RELEASE_DATE}` : `સત્તાવાર પ્રકાશન: ${APP_RELEASE_DATE}`,
    copyright: isEn
      ? `© 2026 NagrikSeva AI. All rights reserved. Government of Gujarat e-Governance Standards.`
      : isHi
      ? `© २०२६ नागरिकसेवा AI (NagrikSeva AI). सर्वाधिकार सुरक्षित। गुजरात सरकार e-Governance मानक।`
      : `© ૨૦૨૬ નાગરિકસેવા AI (NagrikSeva AI). સર્વ અધિકાર સુરક્ષિત. ગુજરાત સરકાર e-Governance માપદંડો.`,
    acts: isEn
      ? "Gujarat Right to Public Services Act (GRTSA 2013) • NFSA 2013 Certified"
      : isHi
      ? "गुजरात लोक सेवा अधिकार अधिनियम (GRTSA २०१३) • NFSA २०१३ प्रमाणित"
      : "ગુજરાત જાહેર સેવા હક અધિનિયમ (GRTSA ૨૦૧૩) • NFSA ૨૦૧૩ માન્ય",
  };

  return (
    <footer
      className={`bg-slate-950 text-slate-300 border-t-2 border-orange-500 pt-10 ${
        isStandalone ? "pb-24 xl:pb-10" : "pb-8 sm:pb-10"
      } px-4 sm:px-6 lg:px-8 select-none`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Main 4-Column Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Gov Portal Authority */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0">
                {/* Standard img tag avoids Next.js width/height aspect ratio warning on SVGs */}
                <img
                  src="/icon.svg"
                  alt="NagrikSeva Emblem"
                  width="24"
                  height="24"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                  Nagrik<span className="text-orange-500">Seva</span>{" "}
                  <span className="text-emerald-400">AI</span>
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {t.dpiSub}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t.description}
            </p>

            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10.5px] font-bold">
                <ShieldCheck size={13} className="shrink-0" />
                <span>{t.gigw}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-[10.5px] font-mono font-bold">
                <Lock size={11} className="shrink-0" />
                <span>{t.secure2fa}</span>
              </span>
            </div>
          </div>

          {/* Column 2: Digital Public Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              📌 {t.col2Title}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/eligibility" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> {t.eligibility}
                </Link>
              </li>
              <li>
                <Link href="/benefit-calculator" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> {t.benefits}
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> {t.schemes}
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> {t.vault}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> {t.tracking}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Citizen Helpline & Assistance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              🏛️ {t.col3Title}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/locator" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> {t.offices}
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> {t.aiChat}
                </Link>
              </li>
              <li>
                <Link href="/portal?mode=citizen" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> {t.citizenLogin}
                </Link>
              </li>
              <li>
                <Link href="/portal?mode=officer" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <span className="text-orange-500">•</span> {t.officerDesk}
                </Link>
              </li>
              <li className="pt-1">
                <a
                  href="tel:14567"
                  className="inline-flex items-center gap-1.5 bg-orange-600/20 border border-orange-500/40 text-orange-400 px-3 py-1.5 rounded-xl font-bold hover:bg-orange-600 hover:text-white transition"
                >
                  <Phone size={13} className="shrink-0" />
                  <span>{t.helpline}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: System Architecture & Versioning */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              ⚙️ {t.col4Title}
            </h4>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t.versionLabel}</span>
                <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {APP_VERSION}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t.dataCenter}</span>
                <span className="text-slate-200 font-mono text-[11px]">GSDC ગાંધીનગર</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t.uptime}</span>
                <span className="text-emerald-400 font-bold text-[11px]">{t.uptimeVal}</span>
              </div>
              <button
                type="button"
                onClick={handleOpenUpdateModal}
                className="w-full mt-1 py-1.5 px-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="સત્તાવાર સિસ્ટમ અપડેટ તપાસો"
              >
                <RefreshCw size={12} className="shrink-0 text-amber-400" />
                <span>{t.checkUpdate}</span>
              </button>
            </div>
          </div>

        </div>

        {/* ── Official Government Developer & Architecture Credit Block (Strict Hard Responsive) ── */}
        <div className="border-t border-slate-800/90 pt-6 mt-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Lead Developers Attribution - Clean 'હરિ પટેલ (Hari Patel)' */}
            <div className="space-y-1.5 text-center md:text-left w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Award size={16} className="text-amber-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {t.architectsTitle}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-1.5 sm:gap-3 text-xs sm:text-sm">
                <span className="font-bold text-white">
                  <span className="text-orange-400 font-black">
                    {isEn ? "Hari Patel" : isHi ? "हरि पटेल (Hari Patel)" : "હરિ પટેલ (Hari Patel)"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal ml-1">— {t.hariRole}</span>
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="font-bold text-white">
                  <span className="text-emerald-400 font-black">
                    {isEn ? "Jeet Jajal" : isHi ? "जीत जाजल (Jeet Jajal)" : "જીત જાજલ (Jeet Jajal)"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal ml-1">— {t.jeetRole}</span>
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                {t.unitTag}
              </p>
            </div>

            {/* Official Release Badge */}
            <div className="shrink-0 flex flex-col items-center md:items-end w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {APP_VERSION} ({APP_BUILD_NAME})
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {t.releaseLabel}
              </span>
            </div>

          </div>
        </div>

        {/* ── Statutory Copyright & Legal Disclaimer ── */}
        <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 text-center sm:text-left">
          <p>
            {t.copyright}
          </p>
          <div className="flex items-center gap-3">
            <span>{t.acts}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
