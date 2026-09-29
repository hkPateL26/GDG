import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
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
} from "lucide-react";

const QUICK_SERVICES = [
  { icon: Sparkles,    label: "પાત્રતા કેલ્ક્યુલેટર (Eligibility)", href: "/eligibility" },
  { icon: IndianRupee, label: "💰 કુટુંબ લાભ કેલ્ક્યુલેટર & પાસ", href: "/benefit-calculator" },
  { icon: MapPin,      label: "નજીકની કચેરી (Jan Seva Locator)",   href: "/locator" },
  { icon: FileText,    label: "રેશન કાર્ડ ગાઈડ & ચેકલિસ્ટ",        href: "/documents?type=ration" },
  { icon: HeartPulse,  label: "આયુષ્માન કાર્ડ કેવી રીતે કઢાવવું?",  href: "/documents?type=health" },
];

const STATS = [
  { num: "10+",  label: "સરકારી યોજનાઓ",    emoji: "📋" },
  { num: "3",    label: "ભાષાઓ (ગુજ/હિં/અંગ્રેજી)",  emoji: "🗣️" },
  { num: "24/7", label: "AI & વોઈસ સપોર્ટ",  emoji: "🎙️" },
  { num: "100%", label: "મફત નાગરિક સેવા",    emoji: "✅" },
];

export default function Home() {
  const featured = SCHEMES_DATA.slice(0, 5);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">

        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-orange-500 via-orange-400 to-green-600 text-white py-12 sm:py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl sm:text-6xl mb-3 select-none">🇮🇳</div>
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

        {/* ── Stats ── */}
        <section className="bg-white border-b shadow-sm">
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

        {/* ── Main Content ── */}
        <div className="w-full px-3 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1 space-y-4">

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
                {featured.map((scheme) => (
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Bot size={18} className="text-orange-500" />
                નાગરિકસેવા AI સાથે વાત કરો
              </h2>
              <Link href="/chat" className="text-xs text-orange-500 hover:underline flex items-center gap-0.5">
                સંપૂર્ણ સ્ક્રીનમાં ખોલો <ChevronRight size={12} />
              </Link>
            </div>
            <ChatBot />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="bg-gray-800 text-white mt-4 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <p className="text-sm font-medium">
              🇮🇳 Built for{" "}
              <span className="text-orange-400">GDG Code for Communities 2.0</span>
            </p>
            <p className="text-xs text-gray-400">
              Powered by Google Gemini AI &bull; Cloud Firestore &bull; NagrikSeva AI &copy; 2026
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-gray-400">
              <Link href="/eligibility" className="hover:text-orange-400 transition">પાત્રતા કેલ્ક્યુલેટર</Link>
              <Link href="/schemes" className="hover:text-orange-400 transition">યોજનાઓ</Link>
              <Link href="/documents" className="hover:text-orange-400 transition">દસ્તાવેજો</Link>
              <Link href="/locator" className="hover:text-orange-400 transition">કચેરી લાઈબ્રેરી</Link>
              <Link href="/track" className="hover:text-orange-400 transition">ટ્રેકિંગ</Link>
              <Link href="/chat" className="hover:text-orange-400 transition">AI ચેટ</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
