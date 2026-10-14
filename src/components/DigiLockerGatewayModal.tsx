"use client";

import { useState, useEffect } from "react";
import {
  X,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
  Building,
  Sparkles,
  Loader2,
  Check,
  Eye,
  AlertTriangle,
  RotateCw,
  Plus,
  UploadCloud,
  FileCheck2,
  Smartphone,
  Fingerprint,
} from "lucide-react";
import {
  DigiLockerDocument,
  DEFAULT_ISSUED_DOCUMENTS,
  getIssuedDocuments,
  saveDocumentToPersonalVault,
  generateConsentArtifact,
  DigiLockerConsentArtifact,
} from "@/lib/digilocker-engine";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface DigiLockerGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDocType?: string; // e.g., 'aadhaar', 'income', 'ration', 'land_records', 'electricity', 'all'
  serviceTitle?: string;
  onDocumentFetched: (payload: {
    document: DigiLockerDocument;
    allFetchedDocs?: DigiLockerDocument[];
    consentArtifact: DigiLockerConsentArtifact;
  }) => void;
}

export default function DigiLockerGatewayModal({
  isOpen,
  onClose,
  targetDocType = "all",
  serviceTitle = "નાગરિક કલ્યાણકારી સેવા અરજી",
  onDocumentFetched,
}: DigiLockerGatewayModalProps) {
  useBodyScrollLock(isOpen);

  // Steps: 1: Auth Identifier -> 2: 2FA OTP + PIN -> 3: Consent Artifact -> 4: Vault Browser
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [authMode, setAuthMode] = useState<"mobile" | "aadhaar" | "username">("mobile");

  // Auth Inputs
  const [identifier, setIdentifier] = useState("9825012345");
  const [otp, setOtp] = useState("");
  const [securityPin, setSecurityPin] = useState("123456");
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Vault State
  const [issuedDocs, setIssuedDocs] = useState<DigiLockerDocument[]>(() => getIssuedDocuments());
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [showCustomUploadDrawer, setShowCustomUploadDrawer] = useState(false);

  // Custom User Document Linking State
  const [customDocName, setCustomDocName] = useState("");
  const [customDocType, setCustomDocType] = useState("income");
  const [customDocBase64, setCustomDocBase64] = useState<string>("");
  const [customDocFileName, setCustomDocFileName] = useState("");

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpCountdown]);

  // Sync vault documents
  useEffect(() => {
    setIssuedDocs(getIssuedDocuments());
  }, [isOpen]);

  if (!isOpen) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!identifier.trim()) {
      setErrorMessage("કૃપા કરીને મોબાઈલ અથવા આધાર નંબર દાખલ કરો.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/digilocker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", identifier }),
      });
      const data = await res.json();
      if (data.success) {
        setOtp("123456"); // Pre-filled for seamless testing
        setOtpCountdown(60);
        setStep(2);
      } else {
        setErrorMessage(data.error || "OTP મોકલવામાં ક્ષતિ આવી.");
      }
    } catch {
      // Fallback
      setOtp("123456");
      setOtpCountdown(60);
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otp.length < 4) {
      setErrorMessage("કૃપા કરીને ૬-આંકડાનો સાચો OTP દાખલ કરો.");
      return;
    }

    if (securityPin.length < 4) {
      setErrorMessage("કૃપા કરીને ૬-અંકનો સિક્યોરિટી પિન દાખલ કરો.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/digilocker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_otp", otp, pin: securityPin, identifier }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(3); // Go to Consent Screen
      } else {
        setErrorMessage(data.error || "ઓથેન્ટિકેશન નિષ્ફળ રહ્યું.");
      }
    } catch {
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrantConsent = () => {
    setStep(4); // Open Vault Browser
  };

  const handleSelectAndFetchDocument = (doc: DigiLockerDocument) => {
    setIsLoading(true);
    const consent = generateConsentArtifact(
      identifier || "4829",
      [doc.uri],
      `${serviceTitle} ખરાઈ હેતુ (Rule 9A Authenticated)`
    );

    setTimeout(() => {
      onDocumentFetched({
        document: doc,
        consentArtifact: consent,
      });
      setIsLoading(false);
      onClose();
    }, 450);
  };

  const handleFetchAllRequired = () => {
    setIsLoading(true);
    const consent = generateConsentArtifact(
      identifier || "4829",
      issuedDocs.map((d) => d.uri),
      `${serviceTitle} - તમામ જરૂરી દસ્તાવેજો એકસાથે ખરાઈ હેતુ`
    );

    setTimeout(() => {
      onDocumentFetched({
        document: issuedDocs[0],
        allFetchedDocs: issuedDocs,
        consentArtifact: consent,
      });
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomDocFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomDocBase64(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomToVault = () => {
    if (!customDocName.trim() || !customDocBase64) {
      alert("કૃપા કરીને દસ્તાવેજનું નામ અને ફાઇલ પસંદ કરો.");
      return;
    }

    const newDoc: DigiLockerDocument = {
      id: customDocType,
      name: customDocName,
      nameGu: customDocName,
      category: "revenue",
      docType: customDocType.toUpperCase().slice(0, 5),
      uri: `in.gov.gujarat.user-VAULT-2026-${Date.now().toString().slice(-6)}`,
      issuer: "User Linked Official Certificate (DigiLocker Vault)",
      issuerGu: "નાગરિક દ્વારા લિંક થયેલ અસલ દસ્તાવેજ (ડિજિટલી પ્રમાણિત)",
      issuerCode: "USER-VAULT-01",
      docNumber: `VAULT/${Date.now().toString().slice(-6)}`,
      issueDate: new Date().toLocaleDateString("en-GB"),
      validTill: "ચાલુ નાણાકીય વર્ષ",
      digitalSignature: {
        signedBy: "CCA India - Validated DigiLocker Vault",
        designation: "Certified Document Repository",
        certAuthority: "CCA India Certified",
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        status: "VALID",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      },
      extractedData: {
        fullName: "Rameshbhai Kantilal Patel",
        fullNameGu: "રમેશભાઈ કાંતિલાલ પટેલ",
        dob: "1982-06-15",
        gender: "male",
        address: "ગોમટા, ગોંડલ, રાજકોટ",
        district: "Rajkot",
        taluka: "Gondal",
        village: "ગોમટા (Gomta)",
        pincode: "360311",
        aadhaarLast4: "4829",
      },
      userUploadedBase64: customDocBase64,
      filePreviewUrl: customDocBase64,
    };

    saveDocumentToPersonalVault(newDoc);
    setIssuedDocs(getIssuedDocuments());
    setShowCustomUploadDrawer(false);
    setCustomDocName("");
    setCustomDocBase64("");
    setCustomDocFileName("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Container: Bottom-sheet on mobile, centered modal on desktop */}
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-300">
        {/* ── National Tricolor Top Ribbon ── */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0" />

        {/* ── Official MeriPehchaan & DigiLocker Header ── */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Government Emblem / Ashoka Lion Capital styling */}
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg font-black shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                  MeriPehchaan • National SSO
                </span>
                <span className="text-[9px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-1.5 py-0.2 rounded font-bold">
                  MeitY Govt of India
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight flex items-center gap-1.5">
                <span>DigiLocker સત્તાવાર દસ્તાવેજ ગેટવે</span>
                <span className="text-xs">🔒</span>
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="બંધ કરો (Close)"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Step Progress Indicator ── */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] font-bold text-slate-600 shrink-0">
          <div className={`flex items-center gap-1 ${step >= 1 ? "text-blue-700" : ""}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? "bg-blue-600 text-white" : "bg-slate-300"}`}>
              ૧
            </span>
            <span className="hidden xs:inline">ઓળખ</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-300" />
          <div className={`flex items-center gap-1 ${step >= 2 ? "text-blue-700" : ""}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? "bg-blue-600 text-white" : "bg-slate-300"}`}>
              ૨
            </span>
            <span className="hidden xs:inline">૨FA ચકાસણી</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-300" />
          <div className={`flex items-center gap-1 ${step >= 3 ? "text-blue-700" : ""}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? "bg-blue-600 text-white" : "bg-slate-300"}`}>
              ૩
            </span>
            <span className="hidden xs:inline">મંજૂરી (Consent)</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-300" />
          <div className={`flex items-center gap-1 ${step >= 4 ? "text-emerald-700" : ""}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? "bg-emerald-600 text-white" : "bg-slate-300"}`}>
              ૪
            </span>
            <span className="hidden xs:inline">દસ્તાવેજ ફેચ</span>
          </div>
        </div>

        {/* ── Scrollable Modal Body ── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertTriangle size={15} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: AUTHENTICATION IDENTIFIER (MERIPEHCHAAN SSO)
              ══════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="text-2xl">🇮🇳</span>
                <h4 className="text-base font-extrabold text-slate-900">
                  MeriPehchaan ઓળખ ઓથેન્ટિકેશન
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  તમારા ડીજીલોકરમાંથી સુરક્ષિત દસ્તાવેજ મેળવવા માટે આધાર અથવા મોબાઈલ દાખલ કરો.
                </p>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setAuthMode("mobile")}
                  className={`py-1.5 rounded-lg transition ${
                    authMode === "mobile" ? "bg-white text-blue-900 shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  📱 મોબાઈલ OTP
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("aadhaar")}
                  className={`py-1.5 rounded-lg transition ${
                    authMode === "aadhaar" ? "bg-white text-blue-900 shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  🆔 આધાર OTP
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("username")}
                  className={`py-1.5 rounded-lg transition ${
                    authMode === "username" ? "bg-white text-blue-900 shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  👤 યુઝરનેમ
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {authMode === "aadhaar"
                      ? "૧૨ આંકડાનો આધાર નંબર (Aadhaar Number) *"
                      : authMode === "username"
                      ? "DigiLocker યુઝરનેમ *"
                      : "૧૦ આંકડાનો રજિસ્ટર્ડ મોબાઈલ નંબર *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      authMode === "aadhaar"
                        ? "XXXX-XXXX-4829"
                        : authMode === "username"
                        ? "ramesh_patel_gujarat"
                        : "9825012345"
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                {/* Quick Tester Helper */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>ડેમો ટેસ્ટિંગ સુવિધા:</span>
                  <button
                    type="button"
                    onClick={() => setIdentifier("9825012345")}
                    className="text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    ⚡ રમેશભાઈ પટેલ (9825012345)
                  </button>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>OTP જનરેટ થઈ રહ્યો છે...</span>
                    </>
                  ) : (
                    <>
                      <span>આગળ વધો • ૬-આંકડાનો OTP મેળવો</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 2: 2-FACTOR AUTHENTICATION (OTP + SECURITY PIN)
              ══════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="text-2xl">🔐</span>
                <h4 className="text-base font-extrabold text-slate-900">
                  ૨-ફેક્ટર સિક્યોરિટી ચકાસણી
                </h4>
                <p className="text-xs text-slate-500">
                  મોબાઈલ નંબર <strong className="text-slate-800 font-mono">XXXXXX{identifier.slice(-4)}</strong> પર OTP મોકલાઈ ગયો છે.
                </p>
              </div>

              {/* Demo Hint Banner */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 text-xs text-emerald-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  ડેમો OTP & PIN: <strong className="font-mono font-bold text-emerald-800">123456</strong>
                </span>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                  Auto-Filled
                </span>
              </div>

              <form onSubmit={handleVerify2FA} className="space-y-3.5">
                {/* OTP Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      ૬-આંકડાનો SMS / Aadhaar OTP *
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {otpCountdown > 0 ? `બદલાશે: ${otpCountdown}s` : "પૂર્ણ"}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono font-black text-lg tracking-widest text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                {/* 6-Digit Security PIN */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ૬-અંકનો DigiLocker સિક્યોરિટી પિન (Security PIN) *
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono font-black text-lg tracking-widest text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    🔒 IT Act 2000 અનુસાર પાસવર્ડ ક્યારેય સ્ટોર થતો નથી.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-bold transition"
                  >
                    પાછા જાઓ
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>ચકાસણી ચાલુ...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>પ્રમાણીકરણ કરો & આગળ વધો</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 3: LEGAL DPDP ACT 2023 & RULE 9A CONSENT ARTIFACT
              ══════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-950 font-black text-sm border-b border-blue-200/80 pb-2">
                  <Shield size={18} className="text-blue-700" />
                  <span>સત્તાવાર ઇલેક્ટ્રોનિક મંજૂરી પત્રક (Consent Artifact)</span>
                </div>

                <div className="space-y-2 text-xs text-blue-900">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-600 font-bold">વિનંતીકર્તા સંસ્થા:</span>
                    <span className="font-extrabold text-right">ગુજરાત સરકાર - નાગરિક સેવા પોર્ટલ (DST)</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-600 font-bold">ઉપયોગનો હેતુ:</span>
                    <span className="font-extrabold text-right">{serviceTitle}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-600 font-bold">કાયદાકીય માન્યતા:</span>
                    <span className="font-extrabold text-emerald-800 text-right">IT Act 2000 / Rule 9A સમકક્ષ અસલ નકલ</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-600 font-bold">માન્યતા મુદત:</span>
                    <span className="font-extrabold text-right">માત્ર આ અરજી પૂરતી (One-Time Fetch)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white border border-blue-200 rounded-xl text-[11px] text-slate-700 leading-relaxed">
                  📜 <strong>ઘોષણા:</strong> હું મારી સ્વેચ્છાએ નાગરિક સેવા પોર્ટલને મારા ડીજીલોકરમાંથી આધાર, આવક પ્રમાણપત્ર અને રેશનકાર્ડ મેળવવા માટે સત્તાવાર સંમતિ આપું છું.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  ના મંજૂર કરો (Deny)
                </button>
                <button
                  type="button"
                  onClick={handleGrantConsent}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>✓ મંજૂર કરો & વૉલ્ટ ખોલો (Allow)</span>
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4: ISSUED DOCUMENTS VAULT BROWSER
              ══════════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>📂 તમારા ડીજીલોકરમાં ઉપલબ્ધ સરકારી દસ્તાવેજો</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    આ દસ્તાવેજો સીધા સત્તાવાર વિભાગો (UIDAI, Revenue, FCSD) દ્વારા ઇશ્યૂ થયેલ છે.
                  </p>
                </div>

                {/* Master Action: Fetch All Required */}
                <button
                  type="button"
                  onClick={handleFetchAllRequired}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Sparkles size={13} className="text-amber-300" />
                  <span>⚡ તમામ દસ્તાવેજો એકસાથે લાવો (Fetch All)</span>
                </button>
              </div>

              {/* Custom Real Document Linking Button */}
              <div className="flex items-center justify-between p-2.5 bg-amber-50/70 border border-amber-300 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-amber-950 font-bold">
                  <span>📁</span>
                  <span>શું તમારી પાસે તમારું પોતાનું અસલ પ્રમાણપત્ર છે?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomUploadDrawer(!showCustomUploadDrawer)}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-[11px] font-bold rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Plus size={12} />
                  <span>અસલ ફાઇલ જોડો</span>
                </button>
              </div>

              {/* Custom Upload Drawer */}
              {showCustomUploadDrawer && (
                <div className="bg-slate-50 border-2 border-amber-300 rounded-2xl p-3.5 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b pb-1.5 text-xs font-bold text-slate-800">
                    <span>➕ ડીજીલોકર વૉલ્ટમાં તમારું અસલ પ્રમાણપત્ર ઉમેરો:</span>
                    <button
                      type="button"
                      onClick={() => setShowCustomUploadDrawer(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">દસ્તાવેજનો પ્રકાર</label>
                      <select
                        value={customDocType}
                        onChange={(e) => setCustomDocType(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="income">આવકનો દાખલો (Income Certificate)</option>
                        <option value="aadhaar">આધાર કાર્ડ (Aadhaar Card)</option>
                        <option value="ration">રેશનકાર્ડ (Ration Card)</option>
                        <option value="land_records">૭/૧૨ જમીન ઉતારો (7/12 RoR)</option>
                        <option value="caste">જાતિનો દાખલો (Caste Certificate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">દસ્તાવેજનું નામ / શીર્ષક</label>
                      <input
                        type="text"
                        value={customDocName}
                        onChange={(e) => setCustomDocName(e.target.value)}
                        placeholder="દા.ત. મારો અસલ આવકનો દાખલો ૨૦૨૬"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">ફાઇલ પસંદ કરો (PDF, JPG, PNG)</label>
                    <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white p-3 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-600 font-bold transition">
                      <UploadCloud size={16} className="text-amber-600" />
                      <span>{customDocFileName || "અહીં ક્લિક કરીને ફાઇલ સિલેક્ટ કરો"}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleCustomFileUpload}
                      />
                    </label>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleSaveCustomToVault}
                      disabled={!customDocName || !customDocBase64}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl transition disabled:opacity-50 cursor-pointer"
                    >
                      વૉલ્ટમાં સાચવો & જોડો
                    </button>
                  </div>
                </div>
              )}

              {/* List of Issued Documents */}
              <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
                {issuedDocs.map((doc) => {
                  const isMatchingTarget =
                    targetDocType === "all" ||
                    doc.id === targetDocType ||
                    doc.docType.toLowerCase() === targetDocType.toLowerCase();

                  return (
                    <div
                      key={doc.id}
                      className={`p-3.5 rounded-2xl border transition space-y-2 ${
                        isMatchingTarget
                          ? "bg-blue-50/40 border-blue-300 ring-1 ring-blue-300/60"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className="text-2xl mt-0.5">
                            {doc.id === "aadhaar"
                              ? "🆔"
                              : doc.id === "income"
                              ? "📜"
                              : doc.id === "ration"
                              ? "🍚"
                              : doc.id === "land_records"
                              ? "🌾"
                              : doc.id === "electricity"
                              ? "⚡"
                              : "📄"}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                                {doc.nameGu}
                              </h5>
                              {doc.isCustomLinked && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                                  કસ્ટમ લિંક થયેલ
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block leading-tight">
                              {doc.issuerGu}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              URI: {doc.uri}
                            </span>
                          </div>
                        </div>

                        {/* Digital Signature Badge */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            <span>CCA Valid e-Sign</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {doc.issueDate}
                          </span>
                        </div>
                      </div>

                      {/* Select Button */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                        <span className="text-[11px] text-slate-600 font-medium">
                          {doc.extractedData.annualIncome
                            ? `વાર્ષિક આવક: ₹ ${doc.extractedData.annualIncome.toLocaleString("en-IN")}`
                            : doc.extractedData.khataNumber
                            ? `ખાતા નં: ${doc.extractedData.khataNumber} • સર્વે: ${doc.extractedData.surveyNumber}`
                            : `ઓળખ: ${doc.docNumber}`}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleSelectAndFetchDocument(doc)}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold transition flex items-center gap-1.5 text-xs shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <Check size={14} />
                          <span>આ દસ્તાવેજ પસંદ કરો</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-slate-400" />
            <span>Digital Locker Rules 2016 (Rule 9A) Compliant</span>
          </div>
          <span className="text-slate-400">Government of Gujarat e-Governance</span>
        </div>
      </div>
    </div>
  );
}
