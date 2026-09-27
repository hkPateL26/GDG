"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DocumentServicePortal from "@/components/DocumentServicePortal";
import CitizenPortalHeader from "@/components/CitizenPortalHeader";
import CitizenLoginShield from "@/components/CitizenLoginShield";
import { CitizenLedgerProfile } from "@/lib/large-datasets";
import {
  FileText,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";

const DOCUMENT_GUIDES = [
  {
    id: "ration",
    title: "Ration Card",
    titleGu: "રેશન કાર્ડ",
    emoji: "🛒",
    documents: [
      { name: "Aadhaar Card (all family members)", mandatory: true },
      { name: "Passport Size Photo", mandatory: true },
      { name: "Address Proof (Electricity bill / Rent agreement)", mandatory: true },
      { name: "Income Certificate", mandatory: true },
      { name: "Gas Connection Details", mandatory: false },
    ],
    applyUrl: "https://nfsa.gov.in",
    steps: [
      "Visit nearest Taluka Mamlatdar office",
      "Fill Form No. 1 (available free)",
      "Attach all required documents",
      "Submit and get acknowledgement slip",
      "Card delivered within 30 days",
    ],
  },
  {
    id: "aadhar",
    title: "Aadhaar Update",
    titleGu: "આધાર અપડેટ",
    emoji: "🪪",
    documents: [
      { name: "Current Aadhaar Card", mandatory: true },
      { name: "Address Proof (Bank Passbook / Utility Bill)", mandatory: true },
      { name: "Proof of Identity (PAN / Driving License)", mandatory: false },
    ],
    applyUrl: "https://myaadhaar.uidai.gov.in",
    steps: [
      "Visit myaadhaar.uidai.gov.in or nearest Aadhaar centre",
      "Select update type (address / name / mobile)",
      "Upload supporting documents",
      "Pay Rs.50 fee online",
      "URN generated – track in 30 days",
    ],
  },
  {
    id: "pan",
    title: "PAN Card",
    titleGu: "PAN કાર્ડ",
    emoji: "💳",
    documents: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "Passport Size Photo (2 copies)", mandatory: true },
      { name: "Date of Birth Proof (Birth Certificate / Marksheet)", mandatory: true },
      { name: "Address Proof", mandatory: true },
    ],
    applyUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    steps: [
      "Apply online at NSDL or UTIITSL portal",
      "Fill Form 49A (Indian citizen)",
      "Upload scanned documents",
      "Pay Rs.107 (+ postage if physical card)",
      "PAN delivered in 15-20 days",
    ],
  },
  {
    id: "health",
    title: "Ayushman Health Card",
    titleGu: "આયુષ્માન હેલ્થ કાર્ડ",
    emoji: "🏥",
    documents: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "Ration Card (BPL / NFSA)", mandatory: true },
      { name: "Mobile Number linked to Aadhaar", mandatory: true },
      { name: "Passport Photo", mandatory: false },
    ],
    applyUrl: "https://beneficiary.nha.gov.in",
    steps: [
      "Check eligibility at pmjay.gov.in",
      "Visit nearest Common Service Centre (CSC)",
      "Aadhaar OTP verification",
      "Health ID (ABHA) generated instantly",
      "Download e-card from NHA portal",
    ],
  },
];

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<"apply" | "guides">("apply");
  const [expanded, setExpanded] = useState<string | null>("ration");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [citizenSession, setCitizenSession] = useState<CitizenLedgerProfile | null>(null);

  useEffect(() => {
    const syncSession = () => {
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
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("nagrik_citizen_session");
    window.dispatchEvent(new Event("storage"));
    setCitizenSession(null);
  };

  const toggle = (id: string) => setExpanded((p) => (p === id ? null : id));
  const toggleCheck = (key: string) => setChecked((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white py-8 sm:py-12 px-4 shadow-md">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                <ShieldCheck size={14} className="text-amber-200" />
                <span>સત્તાવાર સરકારી દસ્તાવેજ પોર્ટલ • Digital Citizen Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug break-words">
                📄 નાગરિક દસ્તાવેજ સેવા & AI સહાયક કેન્દ્ર
              </h1>
              <p className="text-orange-100 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed break-words">
                નવું આધાર, રેશનકાર્ડ, આવકનો દાખલો, PAN કે જાતિ પ્રમાણપત્ર કઢાવો અથવા ઘરે બેઠા સુધારો કરો — AI દ્વારા પૂર્વ-ખરાઈ સાથે.
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex gap-2 pt-6">
              <button
                type="button"
                onClick={() => setActiveTab("apply")}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm ${
                  activeTab === "apply"
                    ? "bg-white text-orange-600 shadow-md"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <Sparkles size={16} />
                <span>ઓનલાઇન અરજી & સુધારો (Apply & Update)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("guides")}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm ${
                  activeTab === "guides"
                    ? "bg-white text-orange-600 shadow-md"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <FileCheck2 size={16} />
                <span>માર્ગદર્શિકા & ચેકલિસ્ટ (Checklists)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab 1: Apply & Update with AI Check */}
        {activeTab === "apply" && (
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
            {!citizenSession ? (
              <CitizenLoginShield
                serviceTitle="નાગરિક દસ્તાવેજ સેવા & સુધારો પોર્ટલ"
                onSuccess={(cit) => setCitizenSession(cit)}
              />
            ) : (
              <>
                <CitizenPortalHeader
                  citizen={citizenSession}
                  onLogout={handleLogout}
                />
                <DocumentServicePortal hideCitizenHeader={true} />
              </>
            )}
          </div>
        )}

        {/* Tab 2: Document Guides & Checklists */}
        {activeTab === "guides" && (
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 space-y-4">
            {citizenSession && (
              <CitizenPortalHeader
                citizen={citizenSession}
                onLogout={handleLogout}
              />
            )}

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
              💡 <strong>કચેરી જતાં પહેલાં ચેકલિસ્ટ ટીક કરો:</strong> જો તમારા તમામ દસ્તાવેજો તૈયાર હોય, તો કચેરીએ એકપણ ધક્કો ખાધા વિના કામ થઈ જશે.
            </div>

            {DOCUMENT_GUIDES.map((guide) => {
              const isOpen = expanded === guide.id;
              const totalDocs = guide.documents.length;
              const checkedCount = guide.documents.filter(
                (_, i) => checked[`${guide.id}-${i}`]
              ).length;

              return (
                <div key={guide.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* Header */}
                  <button
                    onClick={() => toggle(guide.id)}
                    className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left hover:bg-slate-50 transition"
                  >
                    <span className="text-2xl flex-shrink-0">{guide.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm sm:text-base">{guide.title}</p>
                      <p className="text-orange-600 text-xs font-semibold">{guide.titleGu}</p>
                    </div>
                    {/* Progress pill */}
                    <span className="flex-shrink-0 text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-bold">
                      {checkedCount}/{totalDocs}
                    </span>
                    {isOpen
                      ? <ChevronUp size={18} className="text-slate-400 flex-shrink-0" />
                      : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
                  </button>

                  {/* Body */}
                  {isOpen && (
                    <div className="border-t border-slate-100 px-4 sm:px-5 py-4 space-y-5">
                      {/* Document Checklist */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                          <FileText size={12} /> જરૂરી દસ્તાવેજો (Required Documents)
                        </h3>
                        <ul className="space-y-2">
                          {guide.documents.map((doc, i) => {
                            const key = `${guide.id}-${i}`;
                            const isDone = checked[key];
                            return (
                              <li key={i}
                                onClick={() => toggleCheck(key)}
                                className="flex items-start gap-3 cursor-pointer group"
                              >
                                {isDone
                                  ? <CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                  : <Circle size={18} className="text-slate-300 group-hover:text-orange-300 flex-shrink-0 mt-0.5 transition" />
                                }
                                <span className={`text-sm leading-snug ${isDone ? "line-through text-slate-400" : "text-slate-700"}`}>
                                  {doc.name}
                                  {doc.mandatory && (
                                    <span className="ml-1.5 text-xs text-rose-500 font-semibold">*ફરજિયાત</span>
                                  )}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* Steps */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                          🗺️ અરજીના પગલાં (Application Steps)
                        </h3>
                        <ol className="space-y-2">
                          {guide.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mt-0.5">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Apply Button */}
                      <a href={guide.applyUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white py-3 rounded-xl text-sm font-bold transition">
                        સત્તાવાર સરકારી પોર્ટલ પર જાઓ <ExternalLink size={15} />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Helpline Box */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 text-center">
              <p className="font-bold text-blue-900 mb-1">📞 સરકારી સહાય હેલ્પલાઈન</p>
              <p className="text-sm text-blue-700">
                ટોલ ફ્રી નંબર પર કૉલ કરો:{" "}
                <a href="tel:14567" className="font-bold underline text-blue-900">14567</a>
                {" "}(૨૪ કલાક નિઃશુલ્ક)
              </p>
              <p className="text-xs text-blue-600 mt-1">
                અથવા AI સહાયકને પૂછો – <a href="/chat" className="underline font-bold">AI Chat →</a>
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
