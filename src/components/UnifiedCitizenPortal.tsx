"use client";

import { useState, useEffect } from "react";
import { CitizenLedgerProfile } from "@/lib/large-datasets";
import CitizenLoginShield from "@/components/CitizenLoginShield";
import CitizenPortalHeader from "@/components/CitizenPortalHeader";
import TrackVaultView from "@/components/TrackVaultView";
import DocumentServicePortal from "@/components/DocumentServicePortal";
import EligibilityLedgerView from "@/components/EligibilityLedgerView";

export type PortalTabType = "track" | "documents" | "eligibility";

interface UnifiedCitizenPortalProps {
  initialTab?: PortalTabType;
}

export default function UnifiedCitizenPortal({
  initialTab = "track",
}: UnifiedCitizenPortalProps) {
  const [activeTab, setActiveTab] = useState<PortalTabType>(initialTab);
  const [citizenSession, setCitizenSession] = useState<CitizenLedgerProfile | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore and sync session from localStorage
  useEffect(() => {
    const syncSession = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("nagrik_citizen_session");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
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

  const handleLogout = () => {
    localStorage.removeItem("nagrik_citizen_session");
    window.dispatchEvent(new Event("storage"));
    setCitizenSession(null);
  };

  if (isRestoring) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════════════
          STATE 1: UNAUTHENTICATED (Clean Standalone Login Gateway)
          NO duplicate hero section! Just the official 2FA shield.
         ══════════════════════════════════════════════════════════════ */}
      {!citizenSession ? (
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300">
          <CitizenLoginShield
            serviceTitle="નાગરિક સેવા પોર્ટલ (Citizen Single Sign-On)"
            onSuccess={(citizen) => {
              setCitizenSession(citizen);
            }}
          />
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
            STATE 2: AUTHENTICATED (Unified 3-Pillar Citizen Dashboard)
           ══════════════════════════════════════════════════════════════ */
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
          {/* Top Verified Citizen Header + 3-Tab Navigator */}
          <CitizenPortalHeader
            citizen={citizenSession}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
          />

          {/* ── Tab 1: Application Tracking & Status Vault ── */}
          {activeTab === "track" && (
            <TrackVaultView
              citizen={citizenSession}
              onNavigateToDocuments={() => handleTabChange("documents")}
              onNavigateToEligibility={() => handleTabChange("eligibility")}
            />
          )}

          {/* ── Tab 2: Document Services, Apply & Corrections ── */}
          {activeTab === "documents" && (
            <DocumentServicePortal hideCitizenHeader={true} />
          )}

          {/* ── Tab 3: Scheme Eligibility & DBT Benefits Ledger ── */}
          {activeTab === "eligibility" && (
            <EligibilityLedgerView
              citizen={citizenSession}
              onNavigateToDocuments={() => handleTabChange("documents")}
            />
          )}
        </div>
      )}
    </main>
  );
}
