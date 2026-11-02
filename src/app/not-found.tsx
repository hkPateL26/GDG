"use client";

import Link from "next/link";
import { Home, FileText, Search, ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-linear-to-b from-orange-50/50 via-white to-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-orange-100 text-center relative overflow-hidden">
        {/* Top Saffron / Green Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-orange-500 via-white to-emerald-600" />

        {/* Official Emblem Icon */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-orange-100/80 border border-orange-200 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-10 h-10 text-orange-600" />
        </div>

        {/* 404 Badge */}
        <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black rounded-full mb-3 uppercase tracking-wider">
          ૪૦૪ • Error 404
        </span>

        {/* Headings */}
        <h1 className="text-2xl font-black text-slate-800 mb-2">
          પૃષ્ઠ મળ્યું નથી (Page Not Found)
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          તમે જે સરનામું દાખલ કર્યું છે તે ઉપલબ્ધ નથી. કૃપા કરીને નીચે આપેલા સત્તાવાર લિંક્સ દ્વારા આગળ વધો:
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mb-6 text-left">
          <Link
            href="/portal"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all"
          >
            <FileText className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-black leading-tight">નાગરિક સેવા પોર્ટલ</div>
              <div className="text-[11px] text-orange-100 font-normal">નવી અરજીઓ અને દસ્તાવેજો</div>
            </div>
          </Link>

          <Link
            href="/track"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all"
          >
            <Search className="w-5 h-5 text-slate-600 shrink-0" />
            <div>
              <div className="font-black leading-tight">અરજી ટ્રેકિંગ વૉલ્ટ</div>
              <div className="text-[11px] text-slate-500 font-normal">લાઈવ કચેરી સ્ટેટસ અને રસીદ</div>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 p-3 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>મુખ્ય હોમ પેજ પર પાછા જાઓ</span>
          </Link>
        </div>

        {/* Footer Support Note */}
        <div className="pt-4 border-t border-slate-100 text-slate-400 text-[11px]">
          સહાયતા માટે હેલ્પલાઇન: <span className="font-bold text-slate-600 font-mono">1800-GUJ-SEVA</span>
        </div>
      </div>
    </div>
  );
}
