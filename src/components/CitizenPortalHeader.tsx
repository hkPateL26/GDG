"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Sparkles,
  IndianRupee,
  ShieldCheck,
  LogOut,
  Building2,
  CheckCircle2,
} from "lucide-react";

interface CitizenPortalHeaderProps {
  citizen: {
    citizenName?: string;
    citizenNameGu?: string;
    mobile?: string;
    aadhaarLast4?: string;
    district?: string;
    districtGu?: string;
    taluka?: string;
    village?: string;
  };
  onLogout: () => void;
  onOfficerClick?: () => void;
}

export default function CitizenPortalHeader({
  citizen,
  onLogout,
  onOfficerClick,
}: CitizenPortalHeaderProps) {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/track",
      id: "track",
      titleGu: "૧. મારી અરજીઓ & ટ્રેકિંગ",
      subGu: "લાઈવ સ્ટેટસ, પહોંચ & ચલણ",
      icon: FileText,
      active: pathname === "/track",
    },
    {
      href: "/documents",
      id: "documents",
      titleGu: "૨. નવી સેવા / દસ્તાવેજ અરજી",
      subGu: "આધાર, રેશન, આવક, જાતિ",
      icon: Sparkles,
      active: pathname === "/documents",
    },
    {
      href: "/eligibility",
      id: "eligibility",
      titleGu: "૩. પાત્રતા & DBT લાભ લેજર",
      subGu: "અગાઉ મળેલ સહાય & નવી યોજનાઓ",
      icon: IndianRupee,
      active: pathname === "/eligibility",
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* ── Verified Citizen Profile Top Banner ── */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              👤
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {citizen.citizenNameGu || citizen.citizenName || "રમેશભાઈ પટેલ"}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" /> 2FA પ્રમાણિત
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  UIDAI: XXXX-XXXX-{citizen.aadhaarLast4 || "4829"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 truncate">
                📱 +91 {citizen.mobile || "9825012345"} &bull; 📍 {citizen.village || "ગોમટા"}, તા. {citizen.taluka || "ગોંડલ"}, જિ. {citizen.districtGu || citizen.district || "રાજકોટ"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onOfficerClick && (
              <button
                type="button"
                onClick={onOfficerClick}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Building2 size={13} />
                <span>કચેરી એડમિન</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
              title="સત્ર સમાપ્ત કરો"
            >
              <LogOut size={13} />
              <span>લૉગઆઉટ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Unified Smart 3-Tab Navigator (Crystal Clear Layout) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition text-left ${
                tab.active
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md font-black"
                  : "bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 font-bold border border-slate-100"
              }`}
            >
              <span
                className={`p-2 rounded-lg shrink-0 ${
                  tab.active ? "bg-white/20 text-white" : "bg-white text-orange-600 shadow-2xs"
                }`}
              >
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm leading-tight truncate">{tab.titleGu}</p>
                <p
                  className={`text-[10px] truncate mt-0.5 ${
                    tab.active ? "text-orange-100 font-medium" : "text-slate-400"
                  }`}
                >
                  {tab.subGu}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
