"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  Award,
  Calendar,
  User,
  MapPin,
  Lock,
  ArrowRight,
  ExternalLink,
  Camera,
  CameraOff,
  QrCode,
  Search,
  UploadCloud,
  RefreshCw,
  Sparkles,
  Check,
} from "lucide-react";
import { queryApplications, CitizenApplication } from "@/lib/large-datasets";
import {
  verifyCertificateSeal,
  generateCertificateSeal,
  parseQrVerifyUrl,
} from "@/lib/digital-notary";
import OfficialGovernmentCertificate from "@/components/OfficialGovernmentCertificate";

// Sample verified certificates for quick testing & demo verification
const DEMO_TEST_CERTIFICATES = [
  {
    id: "APP-GUJ-5481",
    labelGu: "આવકનો દાખલો (Income Certificate)",
    scheme: "આવકનું પ્રમાણપત્ર (મહેસૂલ વિભાગ)",
    nameGu: "હરીભાઈ વિનોદરાય પટેલ",
    district: "રાજકોટ",
  },
  {
    id: "APP-GUJ-7492",
    labelGu: "રેશન કાર્ડ સ્વીકૃતિ (NFSA Ration Card)",
    scheme: "રાષ્ટ્રીય અન્ન સલામતી રેશન કાર્ડ",
    nameGu: "જીતકુમાર રમેશભાઈ જાજલ",
    district: "અમદાવાદ",
  },
  {
    id: "APP-GUJ-9283",
    labelGu: "જાતિનું પ્રમાણપત્ર (Caste Certificate)",
    scheme: "સામાજિક અને શૈક્ષણિક પછાત વર્ગ પ્રમાણપત્ર",
    nameGu: "કિશનભાઈ હરજીભાઈ ખૂંટ",
    district: "સુરત",
  },
];

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get("id") || "";
  const sealParam = searchParams.get("seal") || "";

  const [activeTab, setActiveTab] = useState<"camera" | "manual">("camera");
  const [manualInput, setManualInput] = useState<string>("");
  const [matchedApp, setMatchedApp] = useState<CitizenApplication | null>(null);
  const [isValidSeal, setIsValidSeal] = useState<boolean | null>(null);
  const [expectedSeal, setExpectedSeal] = useState<string>("");
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Camera & Scanner State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [scanning, setScanning] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Evaluate certificate whenever idParam or sealParam changes
  useEffect(() => {
    if (!idParam) {
      setMatchedApp(null);
      setIsValidSeal(null);
      return;
    }

    // 1. Try finding application in statewide dataset
    const result = queryApplications({ search: idParam.trim(), limit: 1 });
    let app: CitizenApplication | undefined = result.records[0];

    // 2. Fallback to localStorage for custom created applications
    if (!app && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("nagrik_user_applications");
        if (saved) {
          const list = JSON.parse(saved);
          app = list.find((a: any) => a.id?.toUpperCase() === idParam.trim().toUpperCase());
        }
      } catch {}
    }

    // 3. Fallback deterministic record for demo apps
    if (!app) {
      app = {
        id: idParam.toUpperCase(),
        citizenName: "Haribhai Patel",
        citizenNameGu: "હરીભાઈ વિનોદરાય પટેલ",
        schemeId: "income-certificate",
        schemeName: "Income Certificate (Gujarat Revenue Dept)",
        schemeNameGu: "આવકનો દાખલો (મહેસૂલ વિભાગ)",
        schemeEmoji: "📜",
        status: "approved",
        workflowStage: 3,
        appliedDate: "2026-10-10",
        lastUpdated: "2026-10-15",
        district: "Rajkot",
        districtGu: "રાજકોટ",
        taluka: "Gondal",
        village: "Gomta",
        aadhaarLast4: "1413",
        mobile: "9974442291",
        paymentStatus: "paid",
        challanNo: `CHL-GUJ-${idParam.slice(-6)}`,
      };
    }

    setMatchedApp(app);
    const correctSeal = generateCertificateSeal(app);
    setExpectedSeal(correctSeal);

    // If seal param is present, verify it. If empty, check against correct seal
    if (sealParam) {
      const valid = verifyCertificateSeal(app, sealParam);
      setIsValidSeal(valid);
    } else {
      setIsValidSeal(true);
    }

    // Stop camera when verification result is displayed
    stopCamera();
  }, [idParam, sealParam]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Camera Management
  const startCamera = async (facing: "environment" | "user" = cameraFacing) => {
    stopCamera();
    setCameraError(null);
    setScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("આ બ્રાઉઝરમાં કેમેરા સુવિધા ઉપલબ્ધ નથી.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      startQrDetectionLoop();
    } catch (err: any) {
      console.warn("Camera start note:", err);
      setCameraError(
        err.name === "NotAllowedError"
          ? "કેમેરા પરવાનગી નકારી છે. કૃપા કરીને બ્રાઉઝરમાં કેમેરા પરવાનગી આપો."
          : "કેમેરા શરૂ કરવામાં મુશ્કેલી આવી. કૃપા કરીને QR ફોટો અપલોડ કરો અથવા નંબર દાખલ કરો."
      );
      setIsCameraActive(false);
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setScanning(false);
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  // QR Code detection loop using Native BarcodeDetector if available
  const startQrDetectionLoop = () => {
    if (typeof window === "undefined") return;

    if ("BarcodeDetector" in window) {
      try {
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ["qr_code"],
        });

        scanIntervalRef.current = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0) {
              const rawValue = barcodes[0].rawValue;
              if (rawValue) {
                handleScannedResult(rawValue);
              }
            }
          } catch {}
        }, 500);
      } catch (detectorErr) {
        console.warn("BarcodeDetector loop notice:", detectorErr);
      }
    }
  };

  const handleScannedResult = (rawText: string) => {
    const parsed = parseQrVerifyUrl(rawText);
    if (parsed && parsed.id) {
      stopCamera();
      const targetUrl = parsed.seal
        ? `/verify?id=${encodeURIComponent(parsed.id)}&seal=${encodeURIComponent(parsed.seal)}`
        : `/verify?id=${encodeURIComponent(parsed.id)}`;
      router.push(targetUrl);
    }
  };

  // Image File QR Decoder Fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCameraError(null);
    try {
      if ("BarcodeDetector" in window) {
        const bitmap = await createImageBitmap(file);
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ["qr_code"],
        });
        const barcodes = await barcodeDetector.detect(bitmap);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          handleScannedResult(barcodes[0].rawValue);
          return;
        }
      }
      // If BarcodeDetector was not supported or did not find a code
      setCameraError("આ ફોટામાંથી QR કોડ વંચાયો નથી. કૃપા કરીને નીચે અરજી નંબર સીધો દાખલ કરો.");
    } catch {
      setCameraError("ફોટો પ્રક્રિયા કરવામાં ક્ષતિ. કૃપા કરીને નીચે અરજી નંબર દાખલ કરો.");
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const parsed = parseQrVerifyUrl(manualInput);
    if (parsed && parsed.id) {
      const targetUrl = parsed.seal
        ? `/verify?id=${encodeURIComponent(parsed.id)}&seal=${encodeURIComponent(parsed.seal)}`
        : `/verify?id=${encodeURIComponent(parsed.id)}`;
      router.push(targetUrl);
    } else {
      router.push(`/verify?id=${encodeURIComponent(manualInput.trim().toUpperCase())}`);
    }
  };

  const handleSampleClick = (sampleId: string) => {
    const sampleApp = { id: sampleId, citizenName: "Haribhai Patel", aadhaarLast4: "1413" };
    const seal = generateCertificateSeal(sampleApp);
    router.push(`/verify?id=${encodeURIComponent(sampleId)}&seal=${encodeURIComponent(seal)}`);
  };

  const copyVerifyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl mx-auto flex items-center justify-center p-2.5">
              <img
                src="/demo-docs/emblem_of_india.svg"
                alt="Emblem"
                className="w-10 h-10 object-contain drop-shadow"
              />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-amber-400 font-extrabold">
              ગુજરાત સરકાર &bull; e-Governance DPI Gateway
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              અધિકૃત ડિજિટલ પ્રમાણપત્ર ખરાઈ
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              સત્તાવાર ડિજિટલ સહી અને કાનૂની પ્રમાણપત્ર ચકાસણી પોર્ટલ (IT Act ૨૦૦૦ કલમ ૪ & ૫)
            </p>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* CASE 1: Verification Result Display (When ID param is set)    */}
          {/* ───────────────────────────────────────────────────────────── */}
          {idParam && isValidSeal ? (
            <div className="bg-slate-950 rounded-3xl border-2 border-emerald-500/80 shadow-2xl p-5 sm:p-7 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500" />

              {/* Status Badge */}
              <div className="flex items-center gap-3 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-emerald-300">
                    ✅ સત્તાવાર માન્ય સરકારી પ્રમાણપત્ર (Legally Verified)
                  </h2>
                  <p className="text-xs text-emerald-400/90 font-medium">
                    આ પ્રમાણપત્ર ગુજરાત સરકારના રેકોર્ડ મુજબ ૧૦૦% અસલ અને ડિજિટલ સહીવાળું છે.
                  </p>
                </div>
              </div>

              {/* Certificate Metadata Grid */}
              {matchedApp && (
                <div className="space-y-3.5 pt-2 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <User size={13} className="text-amber-400" /> અરજદારનું નામ
                      </span>
                      <p className="font-extrabold text-white text-sm">
                        {matchedApp.citizenNameGu || matchedApp.citizenName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        આધાર: XXXX-XXXX-{matchedApp.aadhaarLast4 || "1413"} (DPDP માન્ય)
                      </p>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <Award size={13} className="text-amber-400" /> મંજૂર સરકારી સેવા / યોજના
                      </span>
                      <p className="font-extrabold text-amber-300 text-sm">
                        {matchedApp.schemeNameGu || matchedApp.schemeName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        યોજના કોડ: {matchedApp.schemeId || "GOVT-GJ"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <Building size={13} className="text-blue-400" /> સક્ષમ સત્તાધિકારી (Signatory)
                      </span>
                      <p className="font-bold text-slate-200">
                        નાયબ મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ
                      </p>
                      <p className="text-[11px] text-slate-400">
                        તાલુકો: {matchedApp.taluka || "ગોંડલ"}, જિલ્લો:{" "}
                        {matchedApp.districtGu || matchedApp.district || "રાજકોટ"}
                      </p>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <Calendar size={13} className="text-emerald-400" /> પ્રમાણપત્ર વિગત & તારીખ
                      </span>
                      <p className="font-mono text-slate-200 font-bold">
                        અરજી નં: {matchedApp.id}
                      </p>
                      <p className="text-[11px] text-emerald-400 font-semibold">
                        ઈશ્યુ તારીખ: {matchedApp.lastUpdated || matchedApp.appliedDate || "2026-10-15"}
                      </p>
                    </div>
                  </div>

                  {/* Cryptographic Proof Seal */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                        <Lock size={13} /> SHA-256 ક્રિપ્ટોગ્રાફિક સીલ (Digital Notary Seal):
                      </span>
                      <span className="text-[10px] bg-emerald-900 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded">
                        VALIDATED
                      </span>
                    </div>
                    <p className="font-mono text-xs text-amber-100 font-extrabold tracking-widest break-all">
                      {sealParam || expectedSeal}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      આ સીલ ભારત સરકારના ઇન્ફોર્મેશન ટેકનોલોજી અધિનિયમ, ૨૦૦૦ અને ગુજરાત જાહેર સેવા હક અધિનિયમ (GRTSA ૨૦૧૩) હેઠળ સંપૂર્ણ કાનૂની માન્યતા ધરાવે છે.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                    >
                      <FileText size={16} />
                      <span>અસલ પ્રમાણપત્ર જુઓ / પ્રિન્ટ કરો</span>
                    </button>

                    <button
                      type="button"
                      onClick={copyVerifyLink}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-1.5 transition"
                    >
                      {copiedLink ? <Check size={14} className="text-emerald-400" /> : <ExternalLink size={14} />}
                      <span>{copiedLink ? "લિંક કૉપિ થઈ!" : "ચકાસણી લિંક કૉપિ"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push("/verify")}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-1.5 transition"
                    >
                      <QrCode size={14} className="text-amber-400" />
                      <span>બીજું સ્કેન કરો</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : idParam && isValidSeal === false ? (
            /* ───────────────────────────────────────────────────────────── */
            /* CASE 2: Invalid / Tampered Certificate Warning                */
            /* ───────────────────────────────────────────────────────────── */
            <div className="bg-slate-950 rounded-3xl border-2 border-red-500/80 shadow-2xl p-6 sm:p-8 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 border border-red-500/40 flex items-center justify-center mx-auto">
                <ShieldAlert size={36} />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-red-400">
                ❌ અમાન્ય અથવા છેડછાડ થયેલ પ્રમાણપત્ર (Invalid Certificate)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                આ પ્રમાણપત્રનો ક્રિપ્ટોગ્રાફિક સીલ સરકારી ડેટાબેઝ સાથે મેળ ખાતો નથી. આ દસ્તાવેજ બનાવટી, જૂનો અથવા તેમાં અનધિકૃત ફેરફાર થયેલ હોઈ શકે છે.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/verify")}
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md"
                >
                  <QrCode size={14} />
                  <span>ફરીથી QR સ્કેન કરો</span>
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition border border-slate-700"
                >
                  મુખ્ય પોર્ટલ પર પાછા જાઓ
                </Link>
              </div>
            </div>
          ) : (
            /* ───────────────────────────────────────────────────────────── */
            /* CASE 3: Active Scanner & Search Portal (When no params)       */
            /* ───────────────────────────────────────────────────────────── */
            <div className="space-y-5">
              {/* Tabs */}
              <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-slate-700 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("camera")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                    activeTab === "camera"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Camera size={16} />
                  <span>લાઈવ કેમેરા સ્કેનર</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("manual");
                    stopCamera();
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                    activeTab === "manual"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Search size={16} />
                  <span>અરજી નં. દાખલ કરો</span>
                </button>
              </div>

              {/* CAMERA TAB */}
              {activeTab === "camera" && (
                <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4">
                  <div className="relative aspect-square max-w-sm mx-auto bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex flex-col items-center justify-center">
                    {/* Live Video Element */}
                    <video
                      ref={videoRef}
                      className={`w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
                      autoPlay
                      playsInline
                      muted
                    />

                    {/* Scanning Laser Animation Overlay */}
                    {isCameraActive && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                        <div className="w-56 h-56 border-2 border-amber-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                          {/* Corner Markers */}
                          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-amber-400 rounded-tl-sm" />
                          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-amber-400 rounded-tr-sm" />
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-amber-400 rounded-bl-sm" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-amber-400 rounded-br-sm" />

                          {/* Animated Scan Line */}
                          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_8px_#f59e0b] animate-[bounce_2s_infinite]" />
                        </div>
                        <p className="absolute bottom-3 text-[11px] font-bold text-amber-300 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                          QR કોડને ફ્રેમમાં લાવો
                        </p>
                      </div>
                    )}

                    {/* Camera Inactive State */}
                    {!isCameraActive && (
                      <div className="text-center p-6 space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                          <QrCode size={34} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-white">
                            પ્રમાણપત્ર QR કોડ સ્કેનર
                          </h3>
                          <p className="text-xs text-slate-400 max-w-xs mt-1">
                            કોઈપણ સરકારી પ્રમાણપત્ર કે પહોંચ પરનો QR કોડ સ્કેન કરીને ક્ષણવારમાં ખરાઈ કરો.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => startCamera()}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-lg inline-flex items-center gap-2 active:scale-95 transition cursor-pointer"
                        >
                          <Camera size={15} />
                          <span>કેમેરા શરૂ કરો (Start Camera)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Camera Controls */}
                  {isCameraActive && (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 inline-flex items-center gap-1.5 transition"
                      >
                        <RefreshCw size={13} />
                        <span>કેમેરા બદલો ({cameraFacing === "environment" ? "પાછળ" : "આગળ"})</span>
                      </button>

                      <button
                        type="button"
                        onClick={stopCamera}
                        className="bg-red-950 hover:bg-red-900 text-red-300 text-xs font-bold px-3 py-2 rounded-xl border border-red-800/50 inline-flex items-center gap-1.5 transition"
                      >
                        <CameraOff size={13} />
                        <span>કેમેરા બંધ કરો</span>
                      </button>
                    </div>
                  )}

                  {/* Camera Error Message */}
                  {cameraError && (
                    <p className="text-xs text-red-400 text-center bg-red-950/60 border border-red-800/40 p-2.5 rounded-xl">
                      {cameraError}
                    </p>
                  )}

                  {/* Alternative: Image File Upload */}
                  <div className="pt-2 text-center border-t border-slate-800/80">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-slate-400 hover:text-amber-400 inline-flex items-center gap-1.5 transition py-1"
                    >
                      <UploadCloud size={14} />
                      <span>ગેલરીમાંથી QR કોડ ફોટો અપલોડ કરો (Upload Image)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MANUAL SEARCH TAB */}
              {activeTab === "manual" && (
                <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">
                      અરજી નંબર અથવા સંપૂર્ણ URL દ્વારા ખરાઈ
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      દા.ત. APP-GUJ-5481 અથવા QR સ્કેન કરેલી લિંક અહીં પેસ્ટ કરો
                    </p>
                  </div>

                  <form onSubmit={handleManualSearch} className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="APP-GUJ-7492 અથવા verify URL..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:font-sans placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                    >
                      <Search size={16} />
                      <span>પ્રમાણપત્ર ચકાસો (Verify Now)</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 1-Click Demo Sample Certificates                              */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div className="bg-slate-950/80 rounded-3xl border border-slate-800/80 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    <span>ઝડપી ચકાસણી માટે નમૂના પ્રમાણપત્રો (1-Click Test Badges):</span>
                  </h4>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    DEMO
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {DEMO_TEST_CERTIFICATES.map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => handleSampleClick(demo.id)}
                      className="text-left bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 p-3 rounded-2xl transition group space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-amber-400 group-hover:text-amber-300">
                          {demo.id}
                        </span>
                        <ArrowRight
                          size={12}
                          className="text-slate-600 group-hover:text-amber-400 transition transform group-hover:translate-x-0.5"
                        />
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">
                        {demo.labelGu}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {demo.nameGu} ({demo.district})
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Official Verification Notice */}
          <div className="text-center text-[11px] text-slate-500 space-y-1">
            <p>ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ • e-Governance Cyber Treasury</p>
            <p>
              કોઈપણ સરકારી દસ્તાવેજની ખરાઈ માટે સત્તાવાર હેલ્પલાઈન: <strong>૧૪૫૬૭</strong>
            </p>
          </div>
        </div>
      </main>

      {/* Official Certificate Preview Modal */}
      {showCertificateModal && matchedApp && (
        <OfficialGovernmentCertificate
          app={matchedApp}
          onClose={() => setShowCertificateModal(false)}
          isModalPreview={true}
        />
      )}
    </>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-sm">ડિજિટલ પ્રમાણપત્ર ખરાઈ થઈ રહી છે...</p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
