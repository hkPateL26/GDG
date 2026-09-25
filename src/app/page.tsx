import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import Link from "next/link";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import {
  LayoutGrid, Bot, Search, FileText, ChevronRight,
  Wheat, HeartPulse, Home as HomeIcon, Flame, Briefcase,
} from "lucide-react";

const SCHEME_ICONS: Record<string, React.ElementType> = {
  "pm-kisan":        Wheat,
  "ayushman-bharat": HeartPulse,
  "pm-awas-gramin":  HomeIcon,
  "ujjwala-yojana":  Flame,
  "mudra-loan":      Briefcase,
};

const QUICK_SERVICES = [
  { icon: FileText, label: "Ration Card",    href: "/documents?type=ration" },
  { icon: FileText, label: "Aadhaar Update", href: "/documents?type=aadhar" },
  { icon: FileText, label: "PAN Card",       href: "/documents?type=pan" },
  { icon: HeartPulse, label: "Health Card",  href: "/documents?type=health" },
];

const STATS = [
  { num: "10+",  label: "Schemes",    emoji: "📋" },
  { num: "3",    label: "Languages",  emoji: "🗣️" },
  { num: "24/7", label: "Available",  emoji: "⏰" },
  { num: "Free", label: "Service",    emoji: "✅" },
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
            <p className="text-orange-200 text-xs sm:text-sm mb-8">
              સરકારી યોજનાઓ, સેવાઓ અને દસ્તાવેજો — બધું એક જ જગ્યાએ
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/schemes"
                className="flex items-center gap-2 bg-white text-orange-600 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-orange-50 active:scale-95 transition shadow-lg">
                <LayoutGrid size={18} /> Find Schemes
              </Link>
              <Link href="/chat"
                className="flex items-center gap-2 bg-orange-600 border-2 border-white/30 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-orange-700 active:scale-95 transition">
                <Bot size={18} /> Ask AI
              </Link>
              <Link href="/track"
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-green-700 active:scale-95 transition">
                <Search size={18} /> Track Status
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
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1 space-y-4">

            {/* Popular Schemes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <LayoutGrid size={16} className="text-orange-500" />
                  Popular Schemes
                </h2>
                <Link href="/schemes" className="text-xs text-orange-500 hover:underline flex items-center gap-0.5">
                  View All <ChevronRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {featured.map((scheme) => {
                  const Icon = SCHEME_ICONS[scheme.id] ?? LayoutGrid;
                  return (
                    <Link key={scheme.id} href={`/schemes/${scheme.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition group">
                      <span className="text-xl flex-shrink-0 w-7 text-center">{scheme.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-orange-600">
                          {scheme.nameGu}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{scheme.benefits[0]}</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-orange-400 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Services */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-blue-100">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                  <FileText size={15} className="text-blue-500" />
                  Quick Services
                </h3>
              </div>
              <div className="divide-y divide-blue-100">
                {QUICK_SERVICES.map(({ icon: Icon, label, href }) => (
                  <Link key={label} href={href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition group">
                    <Icon size={16} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 flex-1">{label}</span>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-blue-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Chat ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Bot size={18} className="text-orange-500" />
                Ask NagrikSeva AI
              </h2>
              <Link href="/chat" className="text-xs text-orange-500 hover:underline flex items-center gap-0.5">
                Full Screen <ChevronRight size={12} />
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
              Powered by Google Gemini AI &nbsp;•&nbsp; NagrikSeva AI &copy; 2026
            </p>
            <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
              <Link href="/schemes" className="hover:text-orange-400 transition">Schemes</Link>
              <Link href="/documents" className="hover:text-orange-400 transition">Documents</Link>
              <Link href="/track" className="hover:text-orange-400 transition">Track</Link>
              <Link href="/chat" className="hover:text-orange-400 transition">AI Chat</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
