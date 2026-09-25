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

  /* ── COMPACT MODE ── */
  if (compact) {
    return (
      <Link href={`/schemes/${scheme.id}`}>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md hover:border-orange-200 transition cursor-pointer group">
          {/* Icon */}
          <span className="text-2xl flex-shrink-0 w-9 text-center">{scheme.icon}</span>

          {/* Text – min-w-0 prevents overflow */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate group-hover:text-orange-600 leading-tight">
              {scheme.nameGu || scheme.name}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {scheme.benefits[0]}
            </p>
          </div>

          {/* Arrow */}
          <span className="text-gray-300 group-hover:text-orange-400 flex-shrink-0">›</span>
        </div>
      </Link>
    );
  }

  /* ── FULL CARD MODE ── */
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-green-50 p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <span className="text-4xl flex-shrink-0 leading-none mt-0.5">{scheme.icon}</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-800 text-base leading-snug break-words">
              {scheme.name}
            </h3>
            <p className="text-orange-600 text-sm font-medium mt-0.5 break-words">
              {scheme.nameGu}
            </p>
            {/* Static badge class */}
            <span className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium ${badgeStyle}`}>
              {cat.icon} {cat.label}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 flex-1">
        <p className="text-gray-600 text-sm leading-relaxed">{scheme.description}</p>

        {/* Benefits */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
            ✨ Benefits
          </h4>
          <ul className="space-y-1">
            {scheme.benefits.slice(0, 3).map((benefit, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                <span className="text-green-500 flex-shrink-0 mt-0.5 text-xs">✓</span>
                <span className="break-words">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-gray-400 pt-1 border-t border-gray-50">
          <span>📄 {scheme.documents.length} documents needed</span>
          <span className="text-blue-400 truncate max-w-[140px]">{scheme.ministry}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          href={`/schemes/${scheme.id}`}
          className="flex-1 text-center bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 active:scale-95 transition"
        >
          View Details
        </Link>
        {scheme.applicationUrl && (
          <a
            href={scheme.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-green-500 text-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-50 active:scale-95 transition"
          >
            Apply →
          </a>
        )}
      </div>
    </div>
  );
}
