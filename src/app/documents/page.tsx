"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { FileText, CheckCircle, Circle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

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
  const [expanded, setExpanded] = useState<string | null>("ration");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded((p) => (p === id ? null : id));
  const toggleCheck = (key: string) => setChecked((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-8 sm:py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              📄 Document Checklist
            </h1>
            <p className="text-orange-100 text-sm sm:text-base">
              દસ્તાવેજ ચેકલિસ્ટ • Know exactly what documents you need
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8 space-y-4">
          {DOCUMENT_GUIDES.map((guide) => {
            const isOpen = expanded === guide.id;
            const totalDocs = guide.documents.length;
            const checkedCount = guide.documents.filter(
              (_, i) => checked[`${guide.id}-${i}`]
            ).length;

            return (
              <div key={guide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => toggle(guide.id)}
                  className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left hover:bg-gray-50 transition"
                >
                  <span className="text-2xl flex-shrink-0">{guide.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm sm:text-base">{guide.title}</p>
                    <p className="text-orange-500 text-xs">{guide.titleGu}</p>
                  </div>
                  {/* Progress pill */}
                  <span className="flex-shrink-0 text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full font-medium">
                    {checkedCount}/{totalDocs}
                  </span>
                  {isOpen
                    ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                </button>

                {/* Body */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-4 sm:px-5 py-4 space-y-5">

                    {/* Document Checklist */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                        <FileText size={12} /> Required Documents
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
                                ? <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                : <Circle size={18} className="text-gray-300 group-hover:text-orange-300 flex-shrink-0 mt-0.5 transition" />
                              }
                              <span className={`text-sm leading-snug ${isDone ? "line-through text-gray-400" : "text-gray-700"}`}>
                                {doc.name}
                                {doc.mandatory && (
                                  <span className="ml-1.5 text-xs text-red-500 font-medium">*required</span>
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Steps */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                        🗺️ Application Steps
                      </h3>
                      <ol className="space-y-2">
                        {guide.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
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
                      className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white py-3 rounded-xl text-sm font-semibold transition">
                      Apply Online <ExternalLink size={15} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          {/* Helpline Box */}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 text-center">
            <p className="font-bold text-blue-800 mb-1">📞 Need Help?</p>
            <p className="text-sm text-blue-600">
              Call Government Helpline:{" "}
              <a href="tel:14567" className="font-bold underline">14567</a>
              {" "}(Free, 24/7)
            </p>
            <p className="text-xs text-blue-400 mt-1">
              Or ask our AI – <a href="/chat" className="underline">AI Chat →</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
