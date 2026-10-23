"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllActiveSchemes } from "@/lib/schemes-data";
import { Scheme } from "@/types";
import {
  LayoutGrid,
  ChevronRight,
} from "lucide-react";

interface DynamicFeaturedSchemesProps {
  variant: "mobile-cards" | "desktop-sidebar";
}

export default function DynamicFeaturedSchemes({ variant }: DynamicFeaturedSchemesProps) {
  const [schemes, setSchemes] = useState<Scheme[]>(() => {
    return getAllActiveSchemes().slice(0, 6);
  });

  useEffect(() => {
    let active = true;
    async function loadLiveSchemes() {
      try {
        const res = await fetch("/api/schemes");
        if (res.ok) {
          const data = await res.json();
          if (active && data.success && Array.isArray(data.schemes)) {
            setSchemes(data.schemes.slice(0, 6));
          }
        }
      } catch (err) {
        console.warn("Could not fetch dynamic featured schemes:", err);
      }
    }

    loadLiveSchemes();

    const handleUpdate = () => {
      loadLiveSchemes();
    };

    window.addEventListener("nagrik_schemes_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("nagrik_schemes_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  if (variant === "mobile-cards") {
    return (
      <div className="space-y-2 pt-0.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <LayoutGrid size={14} className="text-orange-500 shrink-0" />
            <span>મુખ્ય સરકારી યોજનાઓ (સ્વાઈપ કરો)</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            ← સ્વાઈપ →
          </span>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-1.5 no-scrollbar touch-pan-x -mx-3 px-3">
          {schemes.map((scheme) => (
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
                    {scheme.icon || "📋"}
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

                {scheme.benefits && scheme.benefits.length > 0 && (
                  <div className="mt-2 bg-amber-50/80 border border-amber-200/60 rounded-xl px-2.5 py-1.5">
                    <p className="text-[11px] font-bold text-amber-900 truncate">
                      ✨ {scheme.benefits[0]}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[10.5px] font-bold text-orange-600">
                <span className="text-slate-400 font-medium truncate max-w-[130px]">
                  📋 {scheme.documents?.length || 0} દસ્તાવેજો
                </span>
                <span className="flex items-center gap-0.5 whitespace-nowrap">
                  વિગત જુઓ <ChevronRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Desktop Sidebar Variant
  return (
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
        {schemes.slice(0, 5).map((scheme) => (
          <Link
            key={scheme.id}
            href={`/schemes/${scheme.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition group"
          >
            <span className="text-xl flex-shrink-0 w-7 text-center">{scheme.icon || "📋"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate group-hover:text-orange-600">
                {scheme.nameGu}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {scheme.benefits?.[0] || scheme.description}
              </p>
            </div>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-orange-400 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
