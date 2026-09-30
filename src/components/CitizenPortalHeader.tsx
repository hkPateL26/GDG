"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Sparkles,
  IndianRupee,
  LogOut,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import FamilyMemberManagerBar from "@/components/FamilyMemberManagerBar";

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
  onOpenLocator?: () => void;
}

export default function CitizenPortalHeader({
  citizen,
  activeTab,
  onTabChange,
  onLogout,
  onOpenLocator,
}: CitizenPortalHeaderProps) {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/track",
      id: "track" as const,
      shortGu: "૧. મારી અરજીઓ",
      titleGu: "૧. મારી અરજીઓ & ટ્રેકિંગ",
      subGu: "લાઈવ સ્ટેટસ & પહોંચ",
      icon: FileText,
      active: activeTab ? activeTab === "track" : pathname === "/track",
    },
    {
      href: "/documents",
      id: "documents" as const,
      shortGu: "૨. નવી સેવા",
      titleGu: "૨. નવી સેવા / દસ્તાવેજ અરજી",
      subGu: "આધાર, રેશન, આવક, જાતિ",
      icon: Sparkles,
      active: activeTab ? activeTab === "documents" : pathname === "/documents",
    },
    {
      href: "/eligibility",
      id: "eligibility" as const,
      shortGu: "૩. પાત્રતા & લાભ",
      titleGu: "૩. પાત્રતા & DBT લાભ લેજર",
      subGu: "મળેલ સહાય & નવી યોજનાઓ",
      icon: IndianRupee,
      active: activeTab ? activeTab === "eligibility" : pathname === "/eligibility",
    },
  ];

  return (
    <div className="space-y-2.5 sm:space-y-3.5 animate-in fade-in duration-300">
      {/* ── Verified Citizen Profile Top Banner (Compact & Hard-Responsive on Mobile) ── */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border-2 border-emerald-300 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs">
        <div className="flex items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-emerald-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg shadow-xs shrink-0">
              👤
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm sm:text-lg font-black text-slate-900 leading-tight truncate max-w-full">
                  {citizen.citizenNameGu || citizen.citizenName || "હરી વિનોદરાઈ પટેલ"}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <CheckCircle2 size={10} className="text-emerald-600 shrink-0" /> 2FA પ્રમાણિત
                </span>
                <span className="hidden sm:inline-block text-[10.5px] text-slate-600 font-mono font-bold bg-white/90 border border-slate-200 px-2 py-0.5 rounded-lg whitespace-nowrap">
                  UIDAI: XXXX-XXXX-{citizen.aadhaarLast4 || "4829"}
                </span>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-600 mt-1 flex items-center gap-x-2 gap-y-1 flex-wrap leading-snug">
                <span className="font-mono font-bold text-slate-700 whitespace-nowrap">
                  📱 +91 {citizen.mobile || "9825012345"}
                </span>
                <span className="sm:hidden font-mono text-[10.5px] text-slate-600 bg-white/80 border border-slate-200 px-1.5 py-0.2 rounded whitespace-nowrap">
                  🪪 XXXX-{citizen.aadhaarLast4 || "4829"}
                </span>
                <span className="truncate">
                  📍 મુ. {citizen.village || "ગોમટા"}, તા. {citizen.taluka || "ગોંડલ"}, જિ.{" "}
                  {citizen.districtGu || citizen.district || "રાજકોટ"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons (Compact on Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenLocator && (
              <button
                type="button"
                onClick={onOpenLocator}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-[11px] sm:text-xs font-extrabold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                title="AI કચેરી નેવિગેટર અને GPS રસ્તો જુઓ"
              >
                <Navigation size={12} className="shrink-0" />
                <span className="hidden xs:inline sm:inline">કચેરી</span>
              </button>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 rounded-xl text-[11px] sm:text-xs font-extrabold transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-95 whitespace-nowrap"
              title="સત્ર સમાપ્ત કરો"
            >
              <LogOut size={12} className="shrink-0" />
              <span>લૉગઆઉટ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── UIDAI mAadhaar (5-Profile) & NFSA Kutumb Family Aadhaar Linking Bar ── */}
      <FamilyMemberManagerBar citizen={citizen} activeTab={activeTab} />

      {/* ── Unified Smart 3-Tab Navigator (Side-by-Side 3 Columns on Mobile & Desktop!) ── */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-2xl shadow-xs border border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const commonClasses = `flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 px-2 py-2 sm:p-3 rounded-xl transition text-center sm:text-left cursor-pointer w-full select-none ${
            tab.active
              ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm font-black ring-1 ring-orange-400"
              : "bg-slate-50 hover:bg-orange-50/70 text-slate-700 hover:text-orange-700 font-bold border border-slate-100"
          }`;

          const innerContent = (
            <>
              <span
                className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${
                  tab.active ? "bg-white/20 text-white" : "bg-white text-orange-600 shadow-2xs"
                }`}
              >
                <Icon size={15} className="sm:w-[18px] sm:h-[18px]" />
              </span>
              <div className="min-w-0 max-w-full">
                <p className="sm:hidden text-[11px] font-black leading-tight truncate">
                  {tab.shortGu}
                </p>
                <p className="hidden sm:block text-xs md:text-sm font-bold leading-tight truncate">
                  {tab.titleGu}
                </p>
                <p
                  className={`hidden sm:block text-[10.5px] mt-0.5 leading-snug truncate ${
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
            <Link key={tab.id} href={tab.href} className={commonClasses}>
              {innerContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
