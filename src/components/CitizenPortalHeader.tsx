"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Sparkles,
  IndianRupee,
  LogOut,
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
  activeTab?: "track" | "documents" | "eligibility";
  onTabChange?: (tab: "track" | "documents" | "eligibility") => void;
  onLogout: () => void;
}

export default function CitizenPortalHeader({
  citizen,
  activeTab,
  onTabChange,
  onLogout,
}: CitizenPortalHeaderProps) {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/track",
      id: "track" as const,
      titleGu: "૧. મારી અરજીઓ & ટ્રેકિંગ",
      subGu: "લાઈવ સ્ટેટસ & પહોંચ",
      icon: FileText,
      active: activeTab ? activeTab === "track" : pathname === "/track",
    },
    {
      href: "/documents",
      id: "documents" as const,
      titleGu: "૨. નવી સેવા / દસ્તાવેજ અરજી",
      subGu: "આધાર, રેશન, આવક, જાતિ",
      icon: Sparkles,
      active: activeTab ? activeTab === "documents" : pathname === "/documents",
    },
    {
      href: "/eligibility",
      id: "eligibility" as const,
      titleGu: "૩. પાત્રતા & DBT લાભ લેજર",
      subGu: "મળેલ સહાય & નવી યોજનાઓ",
      icon: IndianRupee,
      active: activeTab ? activeTab === "eligibility" : pathname === "/eligibility",
    },
  ];

  return (
    <div className="space-y-3.5 animate-in fade-in duration-300">
      {/* ── Verified Citizen Profile Top Banner ── */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border-2 border-emerald-300 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              👤
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {citizen.citizenNameGu || citizen.citizenName || "રમેશભાઈ પટેલ"}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10.5px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <CheckCircle2 size={11} className="text-emerald-600 shrink-0" /> 2FA પ્રમાણિત
                </span>
                <span className="text-[11px] text-slate-500 font-mono font-bold bg-white/80 border border-slate-200 px-2 py-0.5 rounded-lg">
                  UIDAI: XXXX-XXXX-{citizen.aadhaarLast4 || "4829"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-normal">
                📱 +91 {citizen.mobile || "9825012345"} &bull; 📍 મુ. {citizen.village || "ગોમટા"}, તા. {citizen.taluka || "ગોંડલ"}, જિ. {citizen.districtGu || citizen.district || "રાજકોટ"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
              title="સત્ર સમાપ્ત કરો"
            >
              <LogOut size={13} />
              <span>લૉગઆઉટ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Unified Smart 3-Tab Navigator (Clean, Spacious, No Truncation) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const commonClasses = `flex items-center gap-3 p-3 rounded-xl transition text-left cursor-pointer w-full select-none ${
            tab.active
              ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md font-black ring-1 ring-orange-400"
              : "bg-slate-50 hover:bg-orange-50/70 text-slate-700 hover:text-orange-700 font-bold border border-slate-100"
          }`;

          const innerContent = (
            <>
              <span
                className={`p-2 rounded-lg shrink-0 ${
                  tab.active ? "bg-white/20 text-white" : "bg-white text-orange-600 shadow-2xs"
                }`}
              >
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold leading-tight">{tab.titleGu}</p>
                <p
                  className={`text-[10.5px] mt-0.5 leading-snug ${
                    tab.active ? "text-orange-100 font-medium" : "text-slate-400"
                  }`}
                >
                  {tab.subGu}
                </p>
              </div>
            </>
          );

          if (onTabChange) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={commonClasses}
              >
                {innerContent}
              </button>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={commonClasses}
            >
              {innerContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
