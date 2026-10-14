"use client";

import { use, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { getSchemeById, CATEGORY_LABELS } from "@/lib/schemes-data";
import { GUJARAT_DISTRICTS, CitizenApplication } from "@/lib/large-datasets";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Building,
  Sparkles,
  Send,
  Loader2,
  X,
  ShieldCheck,
  Camera,
  Lock,
  Clock,
  Scale,
  Award,
} from "lucide-react";
import GovernmentReceiptSlip from "@/components/GovernmentReceiptSlip";
import DigiLockerGatewayModal from "@/components/DigiLockerGatewayModal";
import { DigiLockerDocument, DigiLockerConsentArtifact } from "@/lib/digilocker-engine";
import { Scheme } from "@/types";

function getActiveCitizenSession() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("nagrik_citizen_session");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return (parsed?.citizen || parsed) ?? null;
  } catch {
    return null;
  }
}

export default function SchemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const schemeId = resolvedParams.id;

  const [scheme, setScheme] = useState<Scheme | null>(() => getSchemeById(schemeId) || null);
  const [loadingScheme, setLoadingScheme] = useState(!scheme);
  const [sourceNode, setSourceNode] = useState<string>("GSDC-Gandhinagar-Node-01");

  // Application Modal States
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<CitizenApplication | null>(null);

  // DigiLocker Gateway Integration States
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);
  const [digilockerDoc, setDigilockerDoc] = useState<DigiLockerDocument | null>(null);
  const [isDigiLockerVerified, setIsDigiLockerVerified] = useState(false);

  // Form Fields - initialized lazily from active session without cascading renders
  const [citizenName, setCitizenName] = useState(() => getActiveCitizenSession()?.citizenName || "");
  const [mobile, setMobile] = useState(() => getActiveCitizenSession()?.mobile || "");
  const [aadhaarLast4, setAadhaarLast4] = useState(() => getActiveCitizenSession()?.aadhaarLast4 || "");
  const [district, setDistrict] = useState(() => getActiveCitizenSession()?.district || "Rajkot");
  const [taluka, setTaluka] = useState(() => getActiveCitizenSession()?.taluka || "Gondal");
  const [village, setVillage] = useState(() => getActiveCitizenSession()?.village || "");
  const [annualIncome] = useState("180000");
  const [landDetails] = useState("7/12 & 8-A Verifiable");
  const [declarationChecked, setDeclarationChecked] = useState(true);
  const [citizenPhoto, setCitizenPhoto] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("nagrik_user_photo") || "";
      } catch {
        return "";
      }
    }
    return "";
  });

  // Fetch live scheme from Cloud Firestore
  useEffect(() => {
    let active = true;
    async function loadLiveScheme() {
      try {
        const res = await fetch(`/api/schemes?id=${encodeURIComponent(schemeId)}`);
        const data = await res.json();
        if (active && data.success && data.scheme) {
          setScheme(data.scheme);
          if (data.serverCluster) setSourceNode(data.serverCluster);
        }
      } catch (err) {
        console.warn("Could not fetch live scheme, keeping fallback:", err);
      } finally {
        if (active) setLoadingScheme(false);
      }
    }
    loadLiveScheme();
    return () => {
      active = false;
    };
  }, [schemeId]);

  if (!scheme && !loadingScheme) {
    return notFound();
  }

  const category = scheme ? (CATEGORY_LABELS[scheme.category] || { label: "General", icon: "🏛️", color: "orange", labelGu: "સામાન્ય" }) : null;

  // Handle DigiLocker Document Fetch & Auto-fill
  const handleDigiLockerDocumentFetched = (payload: {
    document: DigiLockerDocument;
    allFetchedDocs?: DigiLockerDocument[];
    consentArtifact: DigiLockerConsentArtifact;
  }) => {
    const doc = payload.document;
    setDigilockerDoc(doc);
    setIsDigiLockerVerified(true);
    if (doc.extractedData) {
      const ext = doc.extractedData;
      if (ext.fullName) setCitizenName(ext.fullName);
      if (ext.district) {
        const matched = GUJARAT_DISTRICTS.find(
          (d) => d.en.toLowerCase() === ext.district?.toLowerCase() || d.gu === ext.district
        );
        if (matched) setDistrict(matched.en);
      }
      if (ext.taluka) setTaluka(ext.taluka);
      if (ext.village) setVillage(ext.village);
      if (ext.aadhaarLast4) {
        setAadhaarLast4(ext.aadhaarLast4);
      }
      if (ext.photoUrl) {
        setCitizenPhoto(ext.photoUrl);
        if (typeof window !== "undefined") {
          localStorage.setItem("nagrik_user_photo", ext.photoUrl);
        }
      }
    }
    const photoCandidate = doc.userUploadedBase64 || doc.filePreviewUrl;
    if (photoCandidate && photoCandidate.startsWith("data:image/")) {
      setCitizenPhoto(photoCandidate);
      if (typeof window !== "undefined") {
        localStorage.setItem("nagrik_user_photo", photoCandidate);
      }
    }
  };

  // Handle live application submission to Cloud Firestore
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || mobile.length !== 10 || aadhaarLast4.length !== 4) {
      alert("કૃપા કરીને પૂરું નામ, ૧૦ આંકડાનો મોબાઈલ અને આધાર કાર્ડના છેલ્લા ૪ અંક દાખલ કરો.");
      return;
    }
    if (!declarationChecked) {
      alert("કૃપા કરીને સરકારી નિયમોનું બાંયધરીપત્રક સ્વીકારો.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        citizenName,
        citizenNameGu: citizenName,
        applicantName: citizenName,
        gender: scheme?.eligibility?.gender === "female" ? "female" : "male",
        district,
        districtGu: district,
        taluka: taluka || "મુખ્ય તાલુકો",
        village: village || "સ્થાનિક ગામ",
        schemeId: scheme?.id,
        schemeName: scheme?.name,
        schemeNameGu: scheme?.nameGu,
        schemeEmoji: scheme?.icon || "🏛️",
        benefitAmount: scheme?.benefits[0]?.replace(/\D/g, "") || "6000",
        serviceType: "scheme_application",
        signatureType: "aadhaar-esign",
        mobile,
        email: `${mobile}@citizen.gujarat.gov.in`,
        aadhaarLast4,
        paymentStatus: "paid",
        paymentMethod: "free_government_service",
        paymentMethodNameGu: "મફત સરકારી જનસેવા (Direct Benefit Transfer)",
        feeAmount: 0,
        kacheriDetails: {
          annualIncomeVal: annualIncome,
          landDetails,
          ministry: scheme?.ministry,
        },
        documentsVerified: scheme?.documents.map((d) => ({
          name: d,
          verified: true,
          qualityScore: 98,
        })) || [],
        citizenPhoto: citizenPhoto || undefined,
        userPhoto: citizenPhoto || undefined,
        digilockerVerified: isDigiLockerVerified,
        digilockerUri: digilockerDoc?.uri || (isDigiLockerVerified ? "in.gov.uidai-ADHAR-XXXX-XXXX-4829" : undefined),
        digilockerIssuer: digilockerDoc?.issuer || (isDigiLockerVerified ? "Unique Identification Authority of India (UIDAI)" : undefined),
        digilockerFetchedAt: isDigiLockerVerified ? new Date().toISOString() : undefined,
      };

      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.application) {
        setShowApplyModal(false);
        setSubmittedApp(data.application);
      } else {
        alert(data.error || "અરજી સબમિટ કરવામાં ક્ષતિ આવી. ફરી પ્રયાસ કરો.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("સર્વર ક્ષતિ આવી. કૃપા કરીને પુનઃ પ્રયાસ કરો.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingScheme && !scheme) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="text-center">
            <Loader2 size={36} className="animate-spin text-orange-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-700">ક્લાઉડ ફાયરસ્ટોરમાંથી યોજના લોડ થઈ રહી છે...</p>
          </div>
        </main>
      </>
    );
  }

  if (!scheme) return notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        {/* DPI Server Node Badge */}
        <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>લાઈવ સરકારી ડેટાબેઝ: <strong>Google Cloud Firestore</strong> ({sourceNode})</span>
          </div>
        </div>

        {/* Breadcrumb & Navigation */}
        <div className="bg-white border-b border-gray-100 py-3 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
            <Link
              href="/schemes"
              className="text-gray-500 hover:text-orange-600 flex items-center gap-1 font-semibold transition"
            >
              <ArrowLeft size={14} /> બધી યોજનાઓ (All Schemes)
            </Link>
            {category && (
              <span className="text-gray-500 font-medium">
                {category.icon} {category.labelGu || category.label}
              </span>
            )}
          </div>
        </div>

        {/* Hero Header */}
        <section className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-700 text-white py-10 px-4 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <span className="text-5xl sm:text-6xl bg-white/20 p-3.5 rounded-3xl backdrop-blur-xs flex-shrink-0 shadow-inner">
                {scheme.icon}
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black mb-1 leading-tight">
                  {scheme.nameGu}
                </h1>
                <p className="text-orange-100 text-base sm:text-lg mb-3 font-medium">
                  {scheme.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-white/20 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                    <Building size={13} /> {scheme.ministry}
                  </span>
                  <span className="bg-emerald-600/80 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-400/40">
                    <CheckCircle2 size={13} /> સત્તાવાર સરકારી યોજના (Active)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Dual SLA & Statutory Governance Card (Gujarat Citizen Charter / RTS Act 2013) */}
          <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                  <Scale size={18} />
                </span>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                    સરકારી કાયદાકીય સેવા હક્ક અને સમયમર્યાદા (Statutory SLA)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    ગુજરાત જાહેર સેવા હક્ક અધિનિયમ (GRTPSA 2013) અને Citizen Charter ધોરણો
                  </p>
                </div>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                ✓ કાયદેસર સુનિશ્ચિત સેવા
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                  ⏱️ સત્તાવાર કાયદાકીય SLA
                </span>
                <p className="text-xl font-black text-amber-700">
                  {scheme.officialSlaDays || 15} દિવસ
                </p>
                <span className="text-[10px] text-gray-400">Citizen Charter મર્યાદા</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                  ⚡ AI અંદાજિત સમય
                </span>
                <p className="text-xl font-black text-emerald-700">
                  {scheme.planningEstimateDays || "3-5 દિવસ"}
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">સરેરાશ વર્કફ્લો ગતિ</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-blue-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                  🏢 સત્તાવાર પોર્ટલ / સત્તા
                </span>
                <p className="text-xs font-bold text-blue-900 line-clamp-2 leading-tight">
                  {scheme.implementingAuthority || scheme.ministry}
                </p>
                <span className="text-[10px] text-gray-400">નોડલ સત્તા મંડળ</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-purple-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                  🎯 લક્ષિત લાભાર્થી જૂથ
                </span>
                <p className="text-xs font-bold text-purple-900 line-clamp-2 leading-tight">
                  {scheme.targetBeneficiary || "પાત્રતા ધરાવતા તમામ નાગરિકો"}
                </p>
                <span className="text-[10px] text-gray-400">ટાર્ગેટ ગ્રુપ</span>
              </div>
            </div>
          </div>

          {/* Overview & Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs">
            <h2 className="text-base font-extrabold text-gray-900 mb-2">
              યોજનાનો હેતુ અને પરિચય (Overview)
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed font-normal">
              {scheme.description}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs">
            <h2 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-orange-500" />
              યોજના હેઠળ મળવાપાત્ર મુખ્ય લાભો (Benefits)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scheme.benefits.map((benefit, i) => (
                <div
                  key={`${scheme.id}-benefit-${i}`}
                  className="flex items-start gap-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-emerald-950 font-medium"
                >
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs">
            <h2 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-500" />
              પાત્રતાના માપદંડો (Eligibility Criteria)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-gray-800">
              {scheme.eligibility.minAge !== undefined && (
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">ઉંમર મર્યાદા (Age Limit)</span>
                  <span className="font-bold text-gray-900">
                    {scheme.eligibility.minAge} થી {scheme.eligibility.maxAge ?? 100} વર્ષ
                  </span>
                </div>
              )}
              {scheme.eligibility.gender && (
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">લિંગ (Gender)</span>
                  <span className="font-bold text-gray-900">
                    {scheme.eligibility.gender === "female"
                      ? "ફક્ત મહિલાઓ"
                      : scheme.eligibility.gender === "male"
                      ? "ફક્ત પુરુષો"
                      : "તમામ નાગરિકો (પુરુષ / મહિલા)"}
                  </span>
                </div>
              )}
              {scheme.eligibility.incomeLimit && (
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">મહત્તમ વાર્ષિક આવક મર્યાદા</span>
                  <span className="font-bold text-gray-900">
                    ₹{scheme.eligibility.incomeLimit.toLocaleString("en-IN")} / વર્ષ
                  </span>
                </div>
              )}
              {scheme.eligibility.occupation && (
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">પાત્ર વ્યવસાય</span>
                  <span className="font-bold text-gray-900">
                    {scheme.eligibility.occupation.join(", ")}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3">
              <Link
                href="/eligibility"
                className="text-xs text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-1.5"
              >
                <span>તમારી અંગત પાત્રતા ચકાસવા માટે કેલ્ક્યુલેટર વાપરો</span> &rarr;
              </Link>
            </div>
          </div>

          {/* Required Documents — 3-Tier Checklist Architecture */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-orange-500" />
                અરજી માટે જરૂરી સરકારી દસ્તાવેજો (Document Checklist Engine)
              </h2>
              <span className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                IT Act 2000 Rule 9A • DigiLocker Enabled
              </span>
            </div>

            {scheme.documentChecklist && scheme.documentChecklist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scheme.documentChecklist.map((item, i) => (
                  <div
                    key={`${scheme.id}-checklist-${i}`}
                    className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium flex flex-col justify-between gap-1.5 transition ${
                      item.tier === "mandatory"
                        ? "bg-rose-50/50 border-rose-200 text-rose-950"
                        : item.tier === "conditional"
                        ? "bg-amber-50/50 border-amber-200 text-amber-950"
                        : "bg-blue-50/50 border-blue-200 text-blue-950"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold">{item.nameGu || item.name}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          item.tier === "mandatory"
                            ? "bg-rose-100 text-rose-700 border border-rose-300"
                            : item.tier === "conditional"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-blue-100 text-blue-700 border border-blue-300"
                        }`}
                      >
                        {item.tier === "mandatory" ? "🔴 અનિવાર્ય" : item.tier === "conditional" ? "🟡 શરતી" : "⚪ વૈકલ્પિક"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-black/5">
                      <span className="text-gray-500">{item.name}</span>
                      {item.digiLockerSupported ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[10px]">
                          ⚡ DigiLocker સપોર્ટેડ
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium text-[10px]">
                          📄 ઑફલાઇન / અપલોડ
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-[10px] text-gray-500 italic mt-0.5">ℹ️ {item.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-gray-800">
                {scheme.documents.map((doc, i) => (
                  <li
                    key={`${scheme.id}-doc-${i}`}
                    className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 px-3.5 py-3 rounded-2xl font-medium"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Direct Government Application Action Card */}
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-bold inline-block mb-2">
                ⚡ સીધી ડિજિટલ સબમિશન
              </span>
              <h3 className="font-black text-xl sm:text-2xl text-white">
                આ યોજના માટે ઓનલાઇન અરજી કરો
              </h3>
              <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl">
                તમારી અરજી સીધી ગુજરાત સરકારના લાઈવ ક્લાઉડ ફાયરસ્ટોરમાં નોંધાશે અને તાત્કાલિક એપ્લિકેશન નંબર અને રસીદ પ્રાપ્ત થશે.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-white text-gray-900 hover:bg-orange-50 font-black px-6 py-3.5 rounded-2xl text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>હમણાં જ અરજી કરો</span>
                <Send size={15} className="text-orange-600" />
              </button>
              <Link
                href="/chat"
                className="bg-black/30 hover:bg-black/40 text-white font-bold px-5 py-3.5 rounded-2xl text-xs backdrop-blur-xs transition text-center border border-white/20"
              >
                AI ને પૂછો
              </Link>
            </div>
          </div>
        </div>

        {/* ── LIVE APPLICATION FORM MODAL ── */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white text-gray-900 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
              {/* Ribbon */}
              <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wide">
                    સરકારી સહાય અરજી ફોર્મ • Live Cloud DB
                  </span>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">
                    {scheme.nameGu}
                  </h3>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleApplySubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* ── DIGILOCKER 1-CLICK VERIFICATION BANNER ── */}
                {!isDigiLockerVerified ? (
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border-2 border-indigo-200 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-start gap-2.5">
                      <span className="p-2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                        <Sparkles size={16} />
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
                          National Digital Locker Service • MeitY
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                          દસ્તાવેજોનો ફોટો નથી? DigiLocker થી ૧-ક્લિકમાં ઓટો-ફિલ કરો
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          MeriPehchaan 2FA થી આધાર, સરનામું અને વિગતો તુરંત પ્રમાણિત થઈ જશે.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDigiLockerModal(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-sm transition shrink-0 cursor-pointer"
                    >
                      <span>🔗 DigiLocker થી લાવો</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3 sm:p-3.5 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-xs">
                          <CheckCircle2 size={16} />
                        </span>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                            IT Act Rule 9A Verified
                          </span>
                          <h4 className="text-xs font-black text-emerald-950">
                            ✅ DigiLocker Authenticated
                          </h4>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDigiLockerModal(true)}
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                      >
                        બદલો / નવો દસ્તાવેજ લાવો
                      </button>
                    </div>
                    <div className="text-[11px] text-emerald-900 bg-white/80 p-2 rounded-xl border border-emerald-200 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-600">સત્તાવાર URI:</span>
                        <code className="font-mono font-bold text-emerald-800 text-[10px] break-all">
                          {digilockerDoc?.uri || "in.gov.uidai-ADHAR-XXXX-XXXX-4829"}
                        </code>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-600">જારી કરનાર:</span>
                        <span className="font-bold text-slate-800">
                          {digilockerDoc?.issuer || "Unique Identification Authority of India (UIDAI)"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    અરજદારનું પૂરું નામ (Full Name as per Aadhaar) *
                    {isDigiLockerVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[9.5px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded ml-1.5">
                        <Lock size={9} /> પ્રમાણિત
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="દા.ત. રમેશભાઈ કાંતિલાલ પટેલ"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      મોબાઈલ નંબર (૧૦ આંકડા) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="૯૮૨૫૦XXXXX"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      આધાર કાર્ડ છેલ્લા ૪ અંક *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={aadhaarLast4}
                      onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ""))}
                      placeholder="૪૮૨૯"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      જિલ્લો (District) *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {GUJARAT_DISTRICTS.map((d) => (
                        <option key={d.en} value={d.en}>
                          {d.gu} ({d.en})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      તાલુકો (Taluka) *
                    </label>
                    <input
                      type="text"
                      required
                      value={taluka}
                      onChange={(e) => setTaluka(e.target.value)}
                      placeholder="દા.ત. ગોંડલ"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ગામ / સોસાયટી / વિસ્તાર *
                  </label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="દા.ત. ગોમટા અથવા વોર્ડ નં. ૪"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Passport Photo Upload */}
                <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-dashed border-orange-300 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-2xs">
                  <div className="relative w-16 h-20 border-2 border-slate-400 bg-white rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                    {citizenPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={citizenPhoto} alt="Passport Photo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-1">
                        <Camera size={20} className="text-slate-400 mx-auto mb-0.5" />
                        <span className="text-[8px] text-slate-500 font-bold block leading-tight">પાસપોર્ટ ફોટો</span>
                      </div>
                    )}
                    {citizenPhoto && (
                      <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[7.5px] font-black text-center py-0.5">
                        ✓ અપલોડ થયેલ
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="text-xs font-black text-slate-900 block truncate">
                      અરજદારનો પાસપોર્ટ ફોટો (Passport Photo)
                    </span>
                    <p className="text-[10px] text-slate-600 leading-snug">
                      તમારો ફોટો અપલોડ કરો. આ ફોટો સત્તાવાર સરકારી દસ્તાવેજમાં લાઈવ લાગશે.
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-[11px] font-bold shadow-xs transition">
                      <Camera size={12} />
                      <span>{citizenPhoto ? "ફોટો બદલો (Change)" : "ફોટો અપલોડ કરો (Upload)"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const b64 = ev.target?.result as string;
                              setCitizenPhoto(b64);
                              if (typeof window !== "undefined") {
                                localStorage.setItem("nagrik_user_photo", b64);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldCheck size={14} className="text-amber-700" />
                    સરકારી ડિજિટલ સ્ક્રુટિની માહિતી:
                  </p>
                  <p className="text-[11px] text-amber-800">
                    આ અરજી સીધી તાલુકા મામલતદાર શાખામાં જશે. કોઈ ફી નથી (મફત સરકારી સેવા). સફળ સબમિશન પછી તરત જ રસીદ અને ટ્રેકિંગ આઈડી મળશે.
                  </p>
                </div>

                <label className="flex items-start gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declarationChecked}
                    onChange={(e) => setDeclarationChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 mt-0.5"
                  />
                  <span className="text-[11px] text-gray-600 leading-tight">
                    હું પ્રમાણિત કરું છું કે ઉપરોક્ત તમામ વિગતો સાચી છે અને હું આ યોજનાના પાત્રતાના તમામ નિયમોનું પાલન કરું છું.
                  </span>
                </label>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white font-black py-3 rounded-2xl text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>ક્લાઉડ ડેટાબેઝમાં અરજી નોંધાઈ રહી છે...</span>
                      </>
                    ) : (
                      <>
                        <span>સરકારી અરજી ફાઇનલ જમા કરો</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── OFFICIAL RECEIPT SLIP POPUP ── */}
        {submittedApp && (
          <GovernmentReceiptSlip
            app={submittedApp}
            onClose={() => setSubmittedApp(null)}
          />
        )}

        {/* ── DIGILOCKER MERIPEHCHAAN OFFICIAL GATEWAY MODAL ── */}
        <DigiLockerGatewayModal
          isOpen={showDigiLockerModal}
          onClose={() => setShowDigiLockerModal(false)}
          onDocumentFetched={handleDigiLockerDocumentFetched}
          targetDocType="aadhaar"
          serviceTitle={scheme?.nameGu || "સરકારી સહાય યોજના"}
        />
      </main>
    </>
  );
}
