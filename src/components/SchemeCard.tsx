import Link from "next/link";
import { Scheme } from "@/types";
import { CATEGORY_LABELS } from "@/lib/schemes-data";

interface SchemeCardProps {
  scheme: Scheme;
  compact?: boolean;
}

// ⚠️ FIX: Tailwind does NOT support dynamic class names like bg-${color}-100
// All category badge styles must be static
const CATEGORY_BADGE_STYLES: Record<string, string> = {
  agriculture: "bg-green-100 text-green-700",
  health:      "bg-red-100 text-red-700",
  housing:     "bg-orange-100 text-orange-700",
  education:   "bg-blue-100 text-blue-700",
  women:       "bg-pink-100 text-pink-700",
  business:    "bg-purple-100 text-purple-700",
  social:      "bg-teal-100 text-teal-700",
  digital:     "bg-indigo-100 text-indigo-700",
  energy:      "bg-yellow-100 text-yellow-700",
};

export default function SchemeCard({ scheme, compact = false }: SchemeCardProps) {
  const cat = CATEGORY_LABELS[scheme.category];
  const badgeStyle = CATEGORY_BADGE_STYLES[scheme.category] ?? "bg-gray-100 text-gray-700";

  /* ── COMPACT MODE (used in sidebars / small lists) ── */
  if (compact) {
    return (
      <Link href={`/schemes/${scheme.id}`}>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md hover:border-orange-200 transition cursor-pointer group">
          <span className="text-2xl flex-shrink-0 w-9 text-center">{scheme.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate group-hover:text-orange-600 leading-tight">
              {scheme.nameGu || scheme.name}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{scheme.benefits[0]}</p>
          </div>
          <span className="text-gray-300 group-hover:text-orange-400 flex-shrink-0">›</span>
        </div>
      </Link>
    );
  }

  /* ── FULL CARD MODE (compact height, no info loss) ── */
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition flex flex-col group">

      {/* Header — tighter, smaller icon */}
      <div className="p-3.5 border-b border-gray-100 flex items-start gap-2.5">
        <span className="text-3xl flex-shrink-0 leading-none mt-0.5">{scheme.icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-1 group-hover:text-orange-600 transition">
            {scheme.nameGu || scheme.name}
          </h3>
          <p className="text-orange-600 text-[11px] font-medium mt-0.5 line-clamp-1">
            {scheme.name !== scheme.nameGu ? scheme.name : ""}
          </p>
          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${badgeStyle}`}>
            {cat.icon} {cat.labelGu || cat.label}
          </span>
        </div>
      </div>

      {/* Body — clamped description + max 2 benefits */}
      <div className="px-3.5 pt-3 pb-2 flex-1 space-y-2">
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{scheme.description}</p>

        <ul className="space-y-0.5">
          {scheme.benefits.slice(0, 2).map((benefit, i) => (
            <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
              <span className="line-clamp-1">{benefit}</span>
            </li>
          ))}
          {scheme.benefits.length > 2 && (
            <li className="text-[11px] text-orange-500 font-medium pl-4">
              +{scheme.benefits.length - 2} વધુ લાભ →
            </li>
          )}
        </ul>

        {/* Meta row */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-50">
          <span>📄 {scheme.documents.length} દસ્તાવેજ</span>
          <span className="text-blue-500 truncate max-w-[130px] text-right">{scheme.ministry}</span>
        </div>
      </div>

      {/* Footer — single row of buttons */}
      <div className="px-3.5 pb-3.5 pt-1 flex gap-2">
        <Link
          href={`/schemes/${scheme.id}`}
          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white py-1.5 rounded-lg text-xs font-bold active:scale-95 transition"
        >
          વિગત જુઓ
        </Link>
        {scheme.applicationUrl && (
          <a
            href={scheme.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-green-600 text-green-700 hover:bg-green-50 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition"
          >
            અરજી →
          </a>
        )}
      </div>
    </div>
  );
}
