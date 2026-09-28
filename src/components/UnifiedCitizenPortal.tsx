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
import { User, Building2, LogOut, X } from "lucide-react";

export type PortalTabType = "track" | "documents" | "eligibility";

interface UnifiedCitizenPortalProps {
  initialTab?: PortalTabType;
  initialMode?: "citizen" | "officer";
}

export default function UnifiedCitizenPortal({
  initialTab = "track",
  initialMode = "citizen",
}: UnifiedCitizenPortalProps) {
  const [activeTab, setActiveTab] = useState<PortalTabType>(initialTab);
  const [authMode, setAuthMode] = useState<"citizen" | "officer">(initialMode);
  const [citizenSession, setCitizenSession] = useState<CitizenLedgerProfile | null>(null);
  const [officerSession, setOfficerSession] = useState<OfficerProfile | null>(null);
  const [isLocatorModalOpen, setIsLocatorModalOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore and sync session from storage
  useEffect(() => {
    const syncSession = () => {
      if (typeof window !== "undefined") {
        // Read URL mode if specified
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get("mode");
        if (modeParam === "officer" || modeParam === "admin") {
          setAuthMode("officer");
        } else if (modeParam === "citizen") {
          setAuthMode("citizen");
        }

        // 1. Citizen Session (localStorage)
        const savedCitizen = localStorage.getItem("nagrik_citizen_session");
        if (savedCitizen) {
          try {
            const parsed = JSON.parse(savedCitizen);
            if (parsed && (parsed.mobile || parsed.citizenName)) {
              setCitizenSession(parsed.citizen || parsed);
            } else {
              setCitizenSession(null);
            }
          } catch {
            setCitizenSession(null);
          }
        } else {
          setCitizenSession(null);
        }

        // 2. Officer Session (sessionStorage)
        const savedOfficer = sessionStorage.getItem("nagrik_officer_session");
        if (savedOfficer) {
          try {
            const parsed = JSON.parse(savedOfficer);
            if (parsed && (parsed.id || parsed.name)) {
              setOfficerSession(parsed);
              setAuthMode("officer");
            } else {
              setOfficerSession(null);
            }
          } catch {
            setOfficerSession(null);
          }
        } else {
          setOfficerSession(null);
        }

        setIsRestoring(false);
      }
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  // Listen to browser Back/Forward navigation (BUG-012)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const path = window.location.pathname.replace(/^\//, "");
        if (path === "track" || path === "documents" || path === "eligibility") {
          setActiveTab(path as PortalTabType);
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

  const handleCitizenLogout = () => {
    localStorage.removeItem("nagrik_citizen_session");
    window.dispatchEvent(new Event("storage"));
    setCitizenSession(null);
  };

  const handleOfficerLogout = () => {
    sessionStorage.removeItem("nagrik_officer_session");
    window.dispatchEvent(new Event("storage"));
    setOfficerSession(null);
    setAuthMode("citizen");
  };

  if (isRestoring) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // STATE A: OFFICER LOGGED IN (Mamlatdar Scrutiny Portal)
  // ══════════════════════════════════════════════════════════════
  if (officerSession) {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900 pb-16 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
          {/* Officer Dashboard Header */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border-2 border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 bg-amber-400/20 border border-amber-400/30 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-black text-base sm:text-lg text-white">
                    {officerSession.name || "H. V. Patel, GAS"}
                  </h2>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                    મામલતદાર કચેરી
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> અધિકૃત એક્ટિવ સત્ર
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {officerSession.designation || "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ"} &bull; ID:{" "}
                  <strong className="font-mono text-amber-300">{officerSession.id || "GUJ-GOV-9012"}</strong> ({officerSession.taluka}, {officerSession.district})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOfficerLogout}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <LogOut size={13} />
                <span>કચેરી લૉગઆઉટ</span>
              </button>
            </div>
          </div>

          {/* Full Officer Scrutiny Desk Component */}
          <TrackVaultView
            citizen={citizenSession as CitizenLedgerProfile}
            onNavigateToDocuments={() => {}}
            onNavigateToEligibility={() => {}}
          />
        </div>
      </main>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // STATE B: CITIZEN LOGGED IN (Citizen 3-Pillar Dashboard)
  // ══════════════════════════════════════════════════════════════
  if (citizenSession) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
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
            <DocumentServicePortal hideCitizenHeader={true} />
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

  // ══════════════════════════════════════════════════════════════
  // STATE C: UNAUTHENTICATED (Unified Login Gateway with Mode Selector)
  // ══════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden">
      <div className="max-w-xl mx-auto px-3 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300 space-y-4">
        {/* Top Segmented Mode Switcher */}
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner border border-slate-300">
          <button
            type="button"
            onClick={() => setAuthMode("citizen")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              authMode === "citizen"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md font-black"
                : "text-slate-700 hover:bg-white/60"
            }`}
          >
            <User size={15} />
            <span>નાગરિક 2FA લૉગિન</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode("officer")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              authMode === "officer"
                ? "bg-slate-900 text-amber-300 shadow-md font-black"
                : "text-slate-700 hover:bg-white/60"
            }`}
          >
            <Building2 size={15} />
            <span>અધિકારી / એડમિન લૉગિન</span>
          </button>
        </div>

        {/* Dynamic Login Shield */}
        {authMode === "citizen" ? (
          <CitizenLoginShield
            serviceTitle="નાગરિક સેવા પોર્ટલ (Citizen Single Sign-On)"
            onSuccess={(citizen) => {
              setCitizenSession(citizen);
            }}
            onOfficerClick={() => setAuthMode("officer")}
          />
        ) : (
          <OfficerLoginShield
            onSuccess={(officer) => {
              setOfficerSession(officer);
            }}
            onCitizenClick={() => setAuthMode("citizen")}
          />
        )}
      </div>
    </main>
  );
}
