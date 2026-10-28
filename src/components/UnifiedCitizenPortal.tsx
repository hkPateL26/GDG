"use client";

import { useState, useEffect } from "react";
import { CitizenLedgerProfile } from "@/lib/large-datasets";
import CitizenLoginShield from "@/components/CitizenLoginShield";
import OfficerLoginShield, { OfficerProfile } from "@/components/OfficerLoginShield";
import CitizenPortalHeader from "@/components/CitizenPortalHeader";
import TrackVaultView from "@/components/TrackVaultView";
import DocumentServicePortal from "@/components/DocumentServicePortal";
import EligibilityLedgerView from "@/components/EligibilityLedgerView";
import SmartKacheriLocatorBanner from "@/components/SmartKacheriLocatorBanner";
import AdminHierarchyDesk from "@/components/AdminHierarchyDesk";
import { User, Building2, X, ExternalLink, ArrowLeftRight } from "lucide-react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

export type PortalTabType = "track" | "documents" | "eligibility";

interface UnifiedCitizenPortalProps {
  initialTab?: PortalTabType;
  initialMode?: "citizen" | "officer";
  initialPaymentOpen?: boolean;
}

export default function UnifiedCitizenPortal({
  initialTab = "track",
  initialMode = "citizen",
  initialPaymentOpen = false,
}: UnifiedCitizenPortalProps) {
  const [activeTab, setActiveTab] = useState<PortalTabType>(initialTab);
  const [authMode, setAuthMode] = useState<"citizen" | "officer">(initialMode);
  const [citizenSession, setCitizenSession] = useState<CitizenLedgerProfile | null>(null);
  const [officerSession, setOfficerSession] = useState<OfficerProfile | null>(null);
  const [isLocatorModalOpen, setIsLocatorModalOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  // Freeze background scrolling when locator modal is open
  useBodyScrollLock(isLocatorModalOpen);

  // Restore and sync session from storage
  useEffect(() => {
    const syncSession = () => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get("mode");

        // 1. Citizen Session (localStorage)
        const savedCitizen = localStorage.getItem("nagrik_citizen_session");
        let parsedCitizen: CitizenLedgerProfile | null = null;
        if (savedCitizen) {
          try {
            const parsed = JSON.parse(savedCitizen);
            if (parsed && (parsed.mobile || parsed.citizenName)) {
              parsedCitizen = parsed.citizen || parsed;
            }
          } catch {
            parsedCitizen = null;
          }
        }
        setCitizenSession(parsedCitizen);

        // 2. Officer Session (sessionStorage)
        const savedOfficer = sessionStorage.getItem("nagrik_officer_session");
        let parsedOfficer: OfficerProfile | null = null;
        if (savedOfficer) {
          try {
            const parsed = JSON.parse(savedOfficer);
            if (parsed && (parsed.id || parsed.name)) {
              parsedOfficer = parsed;
            }
          } catch {
            parsedOfficer = null;
          }
        }
        setOfficerSession(parsedOfficer);

        // Strict URL Precedence: If URL explicitly dictates mode, NEVER override it!
        if (modeParam === "officer" || modeParam === "admin") {
          setAuthMode("officer");
        } else if (modeParam === "citizen") {
          setAuthMode("citizen");
        } else if (initialMode === "officer") {
          setAuthMode("officer");
        } else if (initialMode === "citizen") {
          setAuthMode("citizen");
        } else if (parsedOfficer && !parsedCitizen) {
          setAuthMode("officer");
        } else {
          setAuthMode("citizen");
        }

        setIsRestoring(false);
      }
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("nagrik_auth_change", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("nagrik_auth_change", syncSession);
    };
  }, [initialMode]);

  // Listen to browser Back/Forward navigation (BUG-012)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const path = window.location.pathname.replace(/^\//, "");
        if (path === "track" || path === "documents" || path === "eligibility") {
          setActiveTab(path as PortalTabType);
        }
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get("mode");
        if (modeParam === "officer" || modeParam === "admin") {
          setAuthMode("officer");
        } else if (modeParam === "citizen") {
          setAuthMode("citizen");
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleTabChange = (tab: PortalTabType) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.history.pushState({ tab }, "", "/" + tab);
    }
  };

  const handleSwitchMode = (mode: "citizen" | "officer") => {
    setAuthMode(mode);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      window.history.replaceState({}, "", url.toString());
      window.dispatchEvent(new Event("nagrik_auth_change"));
    }
  };

  const handleCitizenLogout = () => {
    localStorage.removeItem("nagrik_citizen_session");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("nagrik_auth_change"));
    setCitizenSession(null);
  };

  const handleOfficerLogout = () => {
    fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout_officer" }),
    }).catch(() => {});

    sessionStorage.removeItem("nagrik_officer_session");
    sessionStorage.removeItem("nagrik_authenticated_officer");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("nagrik_auth_change"));
    setOfficerSession(null);
  };

  if (isRestoring) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // BRANCH 1: OFFICER DESK (authMode === "officer")
  // ══════════════════════════════════════════════════════════════
  if (authMode === "officer") {
    if (officerSession) {
      return (
        <main className="min-h-screen bg-slate-100 text-slate-900 pb-24 sm:pb-16 overflow-x-hidden">
          {/* Official Officer Top Bar */}
          <div className="bg-slate-950 border-b border-amber-400/40 px-3 py-2 text-white flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-black text-amber-300 text-xs sm:text-sm">
                🏛️ કચેરી એડમિન ડેસ્ક ({officerSession.name})
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
                અધિકૃત સ્ક્રુટિની પોર્ટલ
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                સુરક્ષિત સત્ર (Active Session)
              </span>
            </div>
          </div>

          <div className="w-full px-2 sm:px-4 lg:px-6 py-2 sm:py-5 space-y-3 sm:space-y-4 animate-in fade-in duration-300">
            <AdminHierarchyDesk
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              initialOfficer={officerSession as any}
              onLogout={handleOfficerLogout}
            />
          </div>
        </main>
      );
    }

    // Officer Not Logged In
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-16 overflow-x-hidden">
        <div className="max-w-xl mx-auto px-2 sm:px-6 py-1.5 sm:py-8 animate-in fade-in duration-300 space-y-2">
          {/* Top Segmented Mode Switcher */}
          <div className="bg-slate-200/80 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex items-center gap-1 shadow-inner border border-slate-300">
            <button
              type="button"
              onClick={() => handleSwitchMode("citizen")}
              className="flex-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-white/60 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User size={13} className="shrink-0" />
              <span>નાગરિક 2FA લૉગિન</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode("officer")}
              className="flex-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black bg-slate-900 text-amber-300 shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Building2 size={13} className="shrink-0" />
              <span>અધિકારી લૉગિન</span>
            </button>
          </div>

          <OfficerLoginShield
            onSuccess={(officer) => setOfficerSession(officer)}
            onCitizenClick={() => handleSwitchMode("citizen")}
          />
        </div>
      </main>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // BRANCH 2: CITIZEN DESK (authMode === "citizen")
  // ══════════════════════════════════════════════════════════════
  if (citizenSession) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden">
        {/* Dual-Tab Live Simulation Top Bar */}
        <div className="bg-emerald-950 border-b border-emerald-500/40 px-3 py-2 text-white flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-black text-emerald-200 text-xs sm:text-sm">
              👤 નાગરિક પોર્ટલ & ડિજિટલ વોલ્ટ ({citizenSession.citizenNameGu || citizenSession.citizenName})
            </span>
            <span className="hidden md:inline-block text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
              નાગરિક ટેબ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/portal?mode=officer"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="બીજી ટેબમાં કચેરી ડેસ્ક ખોલો અને લાઈવ અરજી ચકાસો (Open Officer Tab)"
            >
              <span>🏛️ નવી ટેબમાં કચેરી ડેસ્ક ખોલો (Live Officer Desk)</span>
              <ExternalLink size={13} />
            </a>
            {officerSession && (
              <button
                type="button"
                onClick={() => handleSwitchMode("officer")}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                title="કચેરી સ્ક્રુટિની ડેસ્ક પર સ્વિચ કરો"
              >
                <ArrowLeftRight size={12} />
                <span>કચેરી ડેસ્ક</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-5 space-y-3 sm:space-y-5 animate-in fade-in duration-300">
          <CitizenPortalHeader
            citizen={citizenSession}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={handleCitizenLogout}
            onOpenLocator={() => setIsLocatorModalOpen(true)}
          />

          {/* AI Kacheri Locator Modal - ONLY appears when user explicitly clicks! */}
          {isLocatorModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setIsLocatorModalOpen(false)}
            >
              <div
                className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-50 rounded-3xl shadow-2xl border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3 border-b border-slate-200 flex items-center justify-between rounded-t-3xl shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
                    <h3 className="font-black text-sm text-slate-900">
                      🏛️ AI કચેરી નેવિગેટર (તમારા સ્થાનથી સૌથી નજીકની કચેરી & GPS રસ્તો)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLocatorModalOpen(false)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer text-xs font-bold flex items-center gap-1.5"
                    title="બંધ કરો"
                  >
                    <span>બંધ કરો</span>
                    <X size={15} />
                  </button>
                </div>

                <div className="p-3 sm:p-5">
                  <SmartKacheriLocatorBanner
                    citizen={citizenSession}
                    defaultExpanded={true}
                    onClose={() => setIsLocatorModalOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "track" && (
            <TrackVaultView
              citizen={citizenSession}
              onNavigateToDocuments={() => handleTabChange("documents")}
              onNavigateToEligibility={() => handleTabChange("eligibility")}
            />
          )}

          {activeTab === "documents" && (
            <DocumentServicePortal hideCitizenHeader={true} initialPaymentOpen={initialPaymentOpen} />
          )}

          {activeTab === "eligibility" && (
            <EligibilityLedgerView
              citizen={citizenSession}
              onNavigateToDocuments={() => handleTabChange("documents")}
            />
          )}
        </div>
      </main>
    );
  }

  // Citizen Not Logged In
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-16 overflow-x-hidden">
      <div className="max-w-xl mx-auto px-2 sm:px-6 py-1.5 sm:py-8 animate-in fade-in duration-300 space-y-2">
        <div className="bg-slate-200/80 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex items-center gap-1 shadow-inner border border-slate-300">
          <button
            type="button"
            onClick={() => handleSwitchMode("citizen")}
            className="flex-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <User size={13} className="shrink-0" />
            <span>નાગરિક 2FA લૉગિન</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode("officer")}
            className="flex-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-white/60 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Building2 size={13} className="shrink-0" />
            <span>અધિકારી લૉગિન</span>
          </button>
        </div>

        <CitizenLoginShield
          serviceTitle="નાગરિક સેવા પોર્ટલ (Citizen Single Sign-On)"
          onSuccess={(citizen) => setCitizenSession(citizen)}
          onOfficerClick={() => handleSwitchMode("officer")}
        />
      </div>
    </main>
  );
}
