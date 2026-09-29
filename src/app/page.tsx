import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import MobileGreetingCard from "@/components/MobileGreetingCard";
import Link from "next/link";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import {
  LayoutGrid,
  Bot,
  FileText,
  ChevronRight,
  Sparkles,
  MapPin,
  IndianRupee,
  HeartPulse,
  Search,
} from "lucide-react";

const QUICK_SERVICES = [
  { icon: Sparkles,    label: "પાત્રતા કેલ્ક્યુલેટર (Eligibility)", href: "/eligibility" },
  { icon: IndianRupee, label: "💰 કુટુંબ લાભ કેલ્ક્યુલેટર & પાસ", href: "/benefit-calculator" },
  { icon: MapPin,      label: "નજીકની કચેરી (Jan Seva Locator)",   href: "/locator" },
  { icon: FileText,    label: "રેશન કાર્ડ ગાઈડ & ચેકલિસ્ટ",        href: "/documents?type=ration" },
  { icon: HeartPulse,  label: "આયુષ્માન કાર્ડ કેવી રીતે કઢાવવું?",  href: "/documents?type=health" },
];

/* ── PhonePe / UMANG Style 4-Column Quick Services (ONLY unique items NOT in Bottom Nav) ── */
const SUPER_APP_GRID = [
  {
    icon: Sparkles,
    label: "પાત્રતા",
    href: "/eligibility",
    bg: "bg-orange-50 text-orange-600 border-orange-200/70",
  },
  {
    icon: IndianRupee,
    label: "લાભ ગણો",
    href: "/benefit-calculator",
    bg: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
  },
  {
    icon: Search,
    label: "અરજી ટ્રેક",
    href: "/track",
    bg: "bg-purple-50 text-purple-600 border-purple-200/70",
  },
  {
    icon: FileText,
    label: "દસ્તાવેજ",
    href: "/documents?type=ration",
    bg: "bg-amber-50 text-amber-600 border-amber-200/70",
  },
];

const STATS = [
  { num: "26+",  label: "સરકારી યોજનાઓ",          shortLabel: "યોજનાઓ",   emoji: "📋" },
  { num: "16",   label: "ભાષાઓ (ગુજ/હિં/અંગ્રેજી)", shortLabel: "ભાષાઓ",    emoji: "🗣️" },
  { num: "24/7", label: "AI & વોઈસ સપોર્ટ",        shortLabel: "AI વોઈસ",  emoji: "🎙️" },
  { num: "100%", label: "મફત નાગરિક સેવા",          shortLabel: "મફત સેવા", emoji: "✅" },
];

export default function Home() {
  const featured = SCHEMES_DATA.slice(0, 6);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">

        {/* ══════════════════════════════════════════════════════════════════
            📱 MOBILE NATIVE SUPER-APP HOME (DigiLocker + UMANG + PhonePe UI)
            Zero duplication with Bottom Nav (Home, Schemes, AI Chat, Offices, Login)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="sm:hidden px-3 pt-3 pb-1 space-y-3">
          {/* 1. Compact DigiLocker-Style Greeting Card (Dynamic Logged-In Name) */}
          <MobileGreetingCard />

          {/* 2. PhonePe / UMANG 4-Column Unique Quick Services Grid (No duplicate Bottom Nav items) */}
          <div className="bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <h2 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-orange-500 shrink-0" />
                <span>ઝડપી નાગરિક સેવાઓ (Quick Tools)</span>
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                1-Click
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {SUPER_APP_GRID.map(({ icon: Icon, label, href, bg }) => (
                <Link
                  key={href}
                  href={href}
                  className="app-touch-card flex flex-col items-center justify-start group min-w-0"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-2xs transition-transform group-active:scale-92 ${bg}`}
                  >
                    <Icon size={21} strokeWidth={2.1} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-1.5 text-center whitespace-nowrap truncate w-full px-0.5">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Compact 4-Column Bento Stats Strip */}
          <div className="grid grid-cols-4 gap-2">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl py-2 px-1.5 border border-slate-200/80 shadow-2xs text-center"
              >
                <div className="text-sm font-black text-orange-600 leading-tight">
                  {s.num}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">
                  {s.shortLabel}
                </div>
              </div>
            ))}
          </div>

          {/* 4. DigiLocker-Style Horizontal Swipeable Featured Scheme Cards */}
          <div className="space-y-2 pt-0.5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <LayoutGrid size={14} className="text-orange-500 shrink-0" />
                <span>મુખ્ય સરકારી યોજનાઓ (સ્વાઈપ કરો)</span>
              </h2>
              <span className="text-[10px] font-semibold text-slate-400">
                ← સ્વાઈપ →
              </span>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-1.5 no-scrollbar touch-pan-x -mx-3 px-3">
              {featured.map((scheme) => (
                <Link
                  key={scheme.id}
                  href={`/schemes/${scheme.id}`}
                  className="app-touch-card snap-start shrink-0 w-[248px] bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-emerald-500" />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg shrink-0">
                        {scheme.icon}
                      </span>
                      <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                        ● સક્રિય યોજના
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-xs truncate">
                      {scheme.nameGu}
                    </h3>
                    <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                      {scheme.name}
                    </p>

                    <div className="mt-2 bg-amber-50/80 border border-amber-200/60 rounded-xl px-2.5 py-1.5">
                      <p className="text-[11px] font-bold text-amber-900 truncate">
                        ✨ {scheme.benefits[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[10.5px] font-bold text-orange-600">
                    <span className="text-slate-400 font-medium truncate max-w-[130px]">
                      📋 {scheme.documents.length} દસ્તાવેજો
                    </span>
                    <span className="flex items-center gap-0.5 whitespace-nowrap">
                      વિગત જુઓ <ChevronRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            💻 DESKTOP & TABLET HERO + STATS (Preserved 100% Intact)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="hidden sm:block bg-gradient-to-br from-orange-500 via-orange-400 to-green-600 text-white py-12 sm:py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/95 p-2.5 shadow-lg flex items-center justify-center select-none">
              <img
                src="/icon.svg"
                alt="National Emblem"
                width="44"
                height="44"
                className="w-11 h-11 object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
              NagrikSeva <span className="text-yellow-300">AI</span>
            </h1>
            <p className="text-orange-100 text-base sm:text-lg mb-1">
              AI-Powered Digital Public Infrastructure Assistant
            </p>
            <p className="text-orange-200 text-xs sm:text-sm mb-7">
              સરકારી યોજનાઓ, દસ્તાવેજ સહાય, પાત્રતા ચકાસણી અને સ્થિતિ ટ્રેકિંગ — બધું એક જ જગ્યાએ
            </p>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <Link
                href="/eligibility"
                className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg active:scale-95"
              >
                <Sparkles size={15} /> પાત્રતા ચકાસો (Eligibility)
              </Link>
              <Link
                href="/benefit-calculator"
                className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow active:scale-95"
              >
                💰 લાભ ગણો & WhatsApp પાસ
              </Link>
              <Link
                href="/locator"
                className="flex items-center gap-1.5 bg-orange-700/80 hover:bg-orange-800 text-white px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition border border-white/20 active:scale-95"
              >
                <MapPin size={15} /> કચેરી લોકેટર
              </Link>
            </div>
          </div>
        </section>

        {/* ── Desktop Stats ── */}
        <section className="hidden sm:block bg-white border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="py-2">
                <div className="text-xl sm:text-2xl mb-0.5">{s.emoji}</div>
                <div className="text-xl sm:text-2xl font-bold text-orange-500">{s.num}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Main Content (ChatBot + Desktop Sidebar) ── */}
        <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">

          {/* ── Sidebar (Desktop & Tablet) ── */}
          <aside className="hidden lg:block lg:col-span-1 space-y-4">

            {/* Smart Eligibility Banner */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full inline-block mb-2">
                નવું ફીચર
              </span>
              <h3 className="font-bold text-base leading-snug">
                તમે કઈ કઈ સરકારી યોજનાના હકદાર છો?
              </h3>
              <p className="text-xs text-orange-100 mt-1 mb-3">
                ઉંમર, આવક અને વ્યવસાય નાખીને ૧ મિનિટમાં જાણી લો!
              </p>
              <Link
                href="/eligibility"
                className="inline-flex items-center gap-1 bg-white text-orange-600 text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-orange-50 transition shadow-sm"
              >
                હમણાં જ ચેક કરો <ChevronRight size={13} />
              </Link>
            </div>

            {/* Popular Schemes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <LayoutGrid size={16} className="text-orange-500" />
                  મુખ્ય સરકારી યોજનાઓ
                </h2>
                <Link href="/schemes" className="text-xs text-orange-500 hover:underline flex items-center gap-0.5">
                  બધી જુઓ <ChevronRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {featured.slice(0, 5).map((scheme) => (
                  <Link
                    key={scheme.id}
                    href={`/schemes/${scheme.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition group"
                  >
                    <span className="text-xl flex-shrink-0 w-7 text-center">{scheme.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-orange-600">
                        {scheme.nameGu}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{scheme.benefits[0]}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-orange-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Services */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-blue-100">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                  <FileText size={15} className="text-blue-500" />
                  ઝડપી સેવાઓ (Quick Access)
                </h3>
              </div>
              <div className="divide-y divide-blue-100">
                {QUICK_SERVICES.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition group"
                  >
                    <Icon size={16} className="text-blue-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 flex-1 truncate">
                      {label}
                    </span>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-blue-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── ChatBot Column ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <h2 className="font-extrabold text-slate-800 text-xs sm:text-base flex items-center gap-1.5">
                <Bot size={17} className="text-orange-500 shrink-0" />
                <span>નાગરિકસેવા AI સાથે વાત કરો</span>
              </h2>
              <Link
                href="/chat"
                className="hidden sm:flex text-xs font-bold text-orange-600 hover:underline items-center gap-0.5 whitespace-nowrap"
              >
                સંપૂર્ણ સ્ક્રીનમાં ખોલો <ChevronRight size={12} />
              </Link>
            </div>
            <ChatBot />
          </div>
        </div>
      </main>
    </>
  );
}
