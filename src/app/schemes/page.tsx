"use client";

import { useState } from "react";
import { SCHEMES_DATA, CATEGORY_LABELS, getSchemesByCategory } from "@/lib/schemes-data";
import SchemeCard from "@/components/SchemeCard";
import { SkeletonCard } from "@/components/Skeleton";
import Navbar from "@/components/Navbar";

const CATEGORIES = Object.keys(CATEGORY_LABELS);

function SchemesGrid({ schemes }: { schemes: typeof SCHEMES_DATA }) {
  if (schemes.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {schemes.map((scheme) => (
        <SchemeCard key={scheme.id} scheme={scheme} />
      ))}
    </div>
  );
}

export default function SchemesPage() {
  const [selected, setSelected] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filtered = SCHEMES_DATA.filter((s) => {
    const matchCat = selected === "all" || s.category === selected;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(q) ||
      s.nameGu.includes(search) ||
      s.nameHi.includes(search) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchCat && matchSearch && s.isActive;
  });

  const handleCategoryChange = (cat: string) => {
    setIsLoading(true);
    setSelected(cat);
    // Simulate brief loading for skeleton demo
    setTimeout(() => setIsLoading(false), 400);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">

        {/* Hero */}
        <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-8 sm:py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              🏛️ Government Schemes
            </h1>
            <p className="text-orange-100 text-sm sm:text-base mb-5">
              સરકારી યોજનાઓ શોધો • Find schemes you are eligible for
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search: PM Kisan, Ayushman, Housing..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

          {/* Category Filter – horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                selected === "all"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 border hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              🌐 All&nbsp;({SCHEMES_DATA.length})
            </button>
            {CATEGORIES.map((cat) => {
              const info = CATEGORY_LABELS[cat];
              const count = getSchemesByCategory(cat).length;
              if (!count) return null;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                    selected === cat
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-white text-gray-600 border hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {info.icon}&nbsp;{info.label}&nbsp;({count})
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            {isLoading ? "Loading..." : `${filtered.length} scheme${filtered.length !== 1 ? "s" : ""} found`}
          </p>

          {/* Skeleton or Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <SchemesGrid schemes={filtered} />
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-base font-medium">No schemes found</p>
              <p className="text-sm mt-1">Try searching with a different keyword</p>
              <button
                onClick={() => { setSearch(""); setSelected("all"); }}
                className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
