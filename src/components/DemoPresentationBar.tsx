"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  User,
  Building2,
  X,
  Check,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";

export interface DemoRoleOption {
  id: string;
  role: "citizen" | "talati" | "mamlatdar" | "sdm_prant" | "district_collector" | "state_admin";
  officerId?: string;
  labelGu: string;
  labelEn: string;
  subGu: string;
  icon: string;
  tierBadge: string;
  bgActive: string;
}

export const DEMO_ROLES: DemoRoleOption[] = [
  {
    id: "citizen",
    role: "citizen",
    labelGu: "નાગરિક",
    labelEn: "Citizen",
    subGu: "હરી પટેલ (વોલ્ટ & પાસબુક)",
    icon: "👤",
    tierBadge: "વોલ્ટ",
    bgActive: "bg-emerald-600 text-white border-emerald-500",
  },
  {
    id: "talati",
    role: "talati",
    officerId: "GUJ-TAL-7089",
    labelGu: "તલાટી મંત્રી",
    labelEn: "Talati",
    subGu: "વિજય જોષી (ગોમટા પંચાયત)",
    icon: "📋",
    tierBadge: "Tier 5",
    bgActive: "bg-amber-600 text-white border-amber-500",
  },
  {
    id: "mamlatdar",
    role: "mamlatdar",
    officerId: "GUJ-GOV-9012",
    labelGu: "મામલતદાર",
    labelEn: "Mamlatdar",
    subGu: "એચ. વી. પટેલ (ગોંડલ e-Sign)",
    icon: "🖋️",
    tierBadge: "Tier 4",
    bgActive: "bg-amber-700 text-white border-amber-600",
  },
  {
    id: "sdm_prant",
    role: "sdm_prant",
    officerId: "GUJ-SDM-5002",
    labelGu: "પ્રાંત / SDM",
    labelEn: "SDM",
    subGu: "કે. એમ. પંડ્યા (ગોંડલ સબ-ડિવિઝન)",
    icon: "⚖️",
    tierBadge: "Tier 3",
    bgActive: "bg-purple-700 text-white border-purple-600",
  },
  {
    id: "district_collector",
    role: "district_collector",
    officerId: "GUJ-COL-3001",
    labelGu: "જિલ્લા કલેક્ટર",
    labelEn: "Collector",
    subGu: "પ્રભવ જોષી, IAS (રાજકોટ જિલ્લો)",
    icon: "🏢",
    tierBadge: "Tier 2",
    bgActive: "bg-indigo-700 text-white border-indigo-600",
  },
  {
    id: "state_admin",
    role: "state_admin",
    officerId: "GUJ-STATE-001",
    labelGu: "રાજ્ય સચિવાલય",
    labelEn: "State Apex",
    subGu: "મનોજ અગ્રવાલ, IAS (મુખ્ય સચિવ & BI)",
    icon: "🏛️",
    tierBadge: "Tier 1",
    bgActive: "bg-slate-900 text-amber-300 border-amber-400",
  },
];

export default function DemoPresentationBar({
  onRoleChange,
}: {
  onRoleChange?: (roleId: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<string>("citizen");
  const [isSwitching, setIsSwitching] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);

  useEffect(() => {
    // Check if Demo Mode is unlocked
    if (typeof window !== "undefined") {
      const isSessionDemo = sessionStorage.getItem("nagrik_demo_active") === "true";
      const hasCookie = document.cookie.includes("nagrik_demo_gate");
      const urlParams = new URLSearchParams(window.location.search);
      const isUrlDemo = urlParams.get("demo") === "true";

      const active = isSessionDemo || hasCookie || isUrlDemo;
      setIsDemoActive(active);

      // Detect current role from storage
      const officerStr = sessionStorage.getItem("nagrik_officer_session");
      if (officerStr) {
        try {
          const off = JSON.parse(officerStr);
          if (off.role) {
            setActiveRole(off.role);
          }
        } catch {
          // ignore
        }
      } else {
        const citizenStr = localStorage.getItem("nagrik_citizen_session");
        if (citizenStr) {
          setActiveRole("citizen");
        }
      }
    }
  }, [pathname]);

  if (!isDemoActive) return null;

  const handleRoleSelect = async (roleOpt: DemoRoleOption) => {
    if (isSwitching) return;
    setIsSwitching(true);
    triggerHaptic("medium");

    try {
      if (roleOpt.role === "citizen") {
        // Switch to Demo Citizen (Hari Patel)
        sessionStorage.removeItem("nagrik_officer_session");
        sessionStorage.removeItem("nagrik_authenticated_officer");

        // Set demo citizen profile
        const demoCitizen = {
          citizenName: "Hari Vinodrai Patel",
          citizenNameGu: "હરી વિનોદરાઈ પટેલ",
          mobile: "9974442291",
          aadhaarLast4: "1413",
          district: "Rajkot",
          taluka: "Gondal",
          village: "Gomta",
          annualIncome: 180000,
        };
        localStorage.setItem("nagrik_citizen_session", JSON.stringify(demoCitizen));
        setActiveRole("citizen");

        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("nagrik_auth_change"));

        if (onRoleChange) onRoleChange("citizen");
        router.push("/portal?mode=citizen&demo=true");
      } else {
        // Switch to Officer Tier (Talati, Mamlatdar, SDM, Collector, State Admin)
        localStorage.removeItem("nagrik_citizen_session");

        const res = await fetch("/api/auth/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "verify_officer",
            officerId: roleOpt.officerId,
            pin: "GJ2026",
          }),
        });

        const data = await res.json();
        if (data.success && data.officer) {
          sessionStorage.setItem("nagrik_officer_session", JSON.stringify(data.officer));
          sessionStorage.setItem("nagrik_authenticated_officer", JSON.stringify(data.officer));
          setActiveRole(roleOpt.role);

          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("nagrik_auth_change"));

          if (onRoleChange) onRoleChange(roleOpt.role);
          router.push("/admin?demo=true");
        }
      }
    } catch (err) {
      console.error("Demo role switch error:", err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleExitDemo = async () => {
    triggerHaptic("heavy");
    setIsSwitching(true);

    try {
      await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lock_demo_gate" }),
      }).catch(() => {});

      await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout_officer" }),
      }).catch(() => {});

      sessionStorage.removeItem("nagrik_demo_active");
      sessionStorage.removeItem("nagrik_officer_session");
      sessionStorage.removeItem("nagrik_authenticated_officer");
      localStorage.removeItem("nagrik_citizen_session");

      setIsDemoActive(false);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("nagrik_auth_change"));

      router.push("/");
    } catch {
      // fallback
      router.push("/");
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="sticky top-14 sm:top-16 z-40 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white border-b-2 border-amber-400/70 shadow-lg px-2 sm:px-4 py-2 select-none print:hidden no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs animate-pulse">
            🧪
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-300 tracking-wide uppercase">
                સત્તાવાર ડેમો & પ્રેઝન્ટેશન મોડ
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 border border-amber-400/40 px-1.5 py-0.2 rounded-md font-mono font-bold">
                Sandbox
              </span>
            </div>
            <p className="text-[10px] text-slate-300">
              જ્યુરી/અધિકારી સામે ડેમો માટે ૧-ક્લિકમાં કોઈપણ રોલ સ્વિચ કરો
            </p>
          </div>
        </div>

        {/* Center: 6 Role Switcher Chips */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full py-0.5 no-scrollbar">
          {DEMO_ROLES.map((roleOpt) => {
            const isSelected = activeRole === roleOpt.role || activeRole === roleOpt.id;
            return (
              <button
                key={roleOpt.id}
                type="button"
                disabled={isSwitching}
                onClick={() => handleRoleSelect(roleOpt)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all shrink-0 active:scale-95 cursor-pointer disabled:opacity-50 ${
                  isSelected
                    ? `${roleOpt.bgActive} shadow-md ring-2 ring-amber-300/60`
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-500"
                }`}
                title={roleOpt.subGu}
              >
                <span>{roleOpt.icon}</span>
                <span className="whitespace-nowrap">{roleOpt.labelGu}</span>
                <span className="text-[9.5px] opacity-75 font-mono hidden sm:inline">
                  ({roleOpt.tierBadge})
                </span>
                {isSelected && <Check size={12} className="stroke-[3] text-amber-300" />}
              </button>
            );
          })}
        </div>

        {/* Right: Exit Demo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isSwitching}
            onClick={handleExitDemo}
            className="flex items-center gap-1 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/50 hover:border-red-400 px-2.5 py-1 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer disabled:opacity-50"
            title="ડેમો મોડ બંધ કરો અને વાસ્તવિક પબ્લિક પોર્ટલ પર પાછા જાઓ"
          >
            <X size={13} />
            <span>ડેમો બંધ કરો</span>
          </button>
        </div>
      </div>
    </div>
  );
}
