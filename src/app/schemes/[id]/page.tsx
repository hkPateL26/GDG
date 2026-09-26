"use client";

import { use } from "react";
import Navbar from "@/components/Navbar";
import { getSchemeById, SCHEMES_DATA, CATEGORY_LABELS } from "@/lib/schemes-data";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ExternalLink,
  Building,
  HelpCircle,
  Share2,
  Sparkles,
} from "lucide-react";

export default function SchemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const scheme = getSchemeById(resolvedParams.id);

  if (!scheme) {
    return notFound();
  }

  const category = CATEGORY_LABELS[scheme.category];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        {/* Breadcrumb & Navigation */}
        <div className="bg-white border-b border-gray-100 py-3 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
            <Link
              href="/schemes"
              className="text-gray-500 hover:text-orange-500 flex items-center gap-1 transition"
            >
              <ArrowLeft size={14} /> બધી યોજનાઓ (All Schemes)
            </Link>
            <span className="text-gray-400">
              {category.icon} {category.label}
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-600 text-white py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <span className="text-5xl sm:text-6xl bg-white/20 p-3 rounded-2xl backdrop-blur-sm flex-shrink-0">
                {scheme.icon}
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">
                  {scheme.nameGu}
                </h1>
                <p className="text-orange-100 text-base sm:text-lg mb-2">
                  {scheme.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-white/20 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <Building size={13} /> {scheme.ministry}
                  </span>
                  <span className="bg-green-700/60 px-3 py-1 rounded-full font-medium">
                    સક્રિય સરકારી યોજના (Active)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Overview & Description */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-2">
              યોજનાનો હેતુ અને પરિચય (Overview)
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {scheme.description}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-orange-500" />
              યોજના હેઠળ મળવાપાત્ર લાભો (Benefits)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scheme.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 bg-green-50/70 border border-green-100 rounded-xl p-3.5 text-xs text-green-900"
                >
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-500" />
              પાત્રતાના માપદંડો (Eligibility Criteria)
            </h2>
            <div className="space-y-2.5 text-xs sm:text-sm text-gray-700">
              {scheme.eligibility.minAge !== undefined && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">ઉંમર મર્યાદા (Age Limit)</span>
                  <span className="font-semibold text-gray-800">
                    {scheme.eligibility.minAge} થી {scheme.eligibility.maxAge ?? 100} વર્ષ
                  </span>
                </div>
              )}
              {scheme.eligibility.gender && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">લિંગ (Gender)</span>
                  <span className="font-semibold text-gray-800">
                    {scheme.eligibility.gender === "female"
                      ? "ફક્ત મહિલાઓ"
                      : scheme.eligibility.gender === "male"
                      ? "ફક્ત પુરુષો"
                      : "તમામ નાગરિકો"}
                  </span>
                </div>
              )}
              {scheme.eligibility.incomeLimit && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">મહત્તમ વાર્ષિક આવક મર્યાદા</span>
                  <span className="font-semibold text-gray-800">
                    ₹{scheme.eligibility.incomeLimit.toLocaleString("en-IN")} / વર્ષ
                  </span>
                </div>
              )}
              {scheme.eligibility.occupation && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">પાત્ર વ્યવસાય</span>
                  <span className="font-semibold text-gray-800">
                    {scheme.eligibility.occupation.join(", ")}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3">
              <Link
                href="/eligibility"
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
              >
                તમારી અંગત પાત્રતા ચકાસવા માટે કેલ્ક્યુલેટર વાપરો &rarr;
              </Link>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-orange-500" />
              અરજી માટે જરૂરી દસ્તાવેજો (Required Documents)
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
              {scheme.documents.map((doc, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-xl"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Footer */}
          <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-6 border border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-800 text-sm">
                શું તમે આ યોજના માટે અરજી કરવા માંગો છો?
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                સત્તાવાર સરકારી પોર્ટલ પર સીધી ઓનલાઈન અરજી કરો અથવા AI ને પ્રશ્ન પૂછો.
              </p>
            </div>
            <div className="flex gap-2.5 w-full sm:w-auto">
              <Link
                href="/chat"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border border-orange-300 text-orange-600 hover:bg-orange-100/50 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
              >
                AI ને પૂછો
              </Link>
              {scheme.applicationUrl && (
                <a
                  href={scheme.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm active:scale-95"
                >
                  ઓનલાઈન અરજી કરો <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
