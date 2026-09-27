"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import {
  GUJARAT_DISTRICTS,
  CitizenApplication,
  CitizenLedgerProfile,
} from "@/lib/large-datasets";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  TrendingUp,
  FileCheck2,
  IndianRupee,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  User,
  Filter,
  RefreshCw,
  Sparkles,
  Printer,
  Fingerprint,
  Lock,
  Shield,
  ArrowRight,
  LogOut,
  Smartphone,
  AlertTriangle,
  Receipt,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import GovernmentReceiptSlip from "@/components/GovernmentReceiptSlip";

type StatusType = "approved" | "processing" | "pending" | "rejected";

interface TrackStats {
  total: number;
  approved: number;
  processing: number;
  pending: number;
  rejected: number;
  disbursedCr: string;
}

const STATUS_CONFIG: Record<
  StatusType,
  { labelEn: string; labelGu: string; bg: string; border: string; textColor: string; badgeBg: string }
> = {
  approved: {
    labelEn: "Approved (DBT Transferred)",
    labelGu: "મંજૂર (સહાય જમા)",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    textColor: "text-emerald-800",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  processing: {
    labelEn: "In Verification",
    labelGu: "ચકાસણી ચાલુ",
    bg: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-800",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-300",
  },
  pending: {
    labelEn: "Field Verification Pending",
    labelGu: "સ્થળ તપાસ પેન્ડિંગ",
    bg: "bg-amber-50",
    border: "border-amber-200",
    textColor: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
  },
  rejected: {
    labelEn: "Action Required / Returned",
    labelGu: "પૂરક પુરાવા જરૂરી",
    bg: "bg-rose-50",
    border: "border-rose-200",
    textColor: "text-rose-800",
    badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
  },
};

export default function TrackPage() {
  // ── 1. Authentication & Security Mode ──
  // "unauthenticated" = 2FA Login Shield
  // "citizen" = Private Citizen Vault (My Applications only)
  // "officer" = Gujarat Govt Officer Admin Scrutiny Desk (5,400+ applications)
  const [authMode, setAuthMode] = useState<"unauthenticated" | "citizen" | "officer">("unauthenticated");
  const [citizenSession, setCitizenSession] = useState<CitizenLedgerProfile | null>(null);
  const [officerSession, setOfficerSession] = useState<{
    id: string;
    name: string;
    designation: string;
    district: string;
    taluka: string;
  } | null>(null);

  // ── 2. Citizen 2FA Login States ──
  const [loginMobile, setLoginMobile] = useState("9825012345");
  const [loginAadhaar, setLoginAadhaar] = useState("4829");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedSmsOtp, setSimulatedSmsOtp] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(180);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  // ── 3. Officer Login Modal States ──
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [officerIdInput, setOfficerIdInput] = useState("GUJ-GOV-9012");
  const [officerPinInput, setOfficerPinInput] = useState("GJ2026");
  const [officerLoading, setOfficerLoading] = useState(false);
  const [officerError, setOfficerError] = useState("");

  // ── 4. Records & Enterprise Registry States (For Officer or Citizen Vault) ──
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [records, setRecords] = useState<CitizenApplication[]>([]);
  const [totalRecords, setTotalRecords] = useState(5420);
  const [totalPages, setTotalPages] = useState(678);
  const [stats, setStats] = useState<TrackStats>({
    total: 5420,
    approved: 3845,
    processing: 1120,
    pending: 290,
    rejected: 165,
    disbursedCr: "₹ 14.85 Cr",
  });

  const [selectedApp, setSelectedApp] = useState<CitizenApplication | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmingCash, setIsConfirmingCash] = useState(false);
  const [cashConfirmedAlert, setCashConfirmedAlert] = useState(false);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);
  const [stageUpdateAlert, setStageUpdateAlert] = useState<string | null>(null);

  // ── 5. Restore Session & URL params on Mount ──
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const idParam = urlParams.get("id");
      if (idParam) {
        setSearchQuery(idParam);
      }

      // Check saved citizen session
      const savedCitizen = localStorage.getItem("nagrik_citizen_session");
      if (savedCitizen) {
        try {
          const parsed = JSON.parse(savedCitizen);
          if (parsed && (parsed.mobile || parsed.citizenName)) {
            setCitizenSession(parsed);
            setAuthMode("citizen");
            setLoginMobile(parsed.mobile || "9825012345");
            setLoginAadhaar(parsed.aadhaarLast4 || "4829");
            loadCitizenVault(parsed.mobile || "9825012345", parsed.aadhaarLast4 || "4829", idParam || undefined);
            return;
          }
        } catch (e) {
          console.error("Citizen session parse error:", e);
        }
      }

      // Check officer session
      const savedOfficer = sessionStorage.getItem("nagrik_officer_session");
      if (savedOfficer) {
        try {
          const parsed = JSON.parse(savedOfficer);
          if (parsed && parsed.id) {
            setOfficerSession(parsed);
            setAuthMode("officer");
          }
        } catch (e) {
          console.error("Officer session parse error:", e);
        }
      }
    }
  }, []);

  // ── 6. OTP Countdown Timer ──
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, otpCountdown]);

  // ── 7. Load Citizen Vault (Only this citizen's own records!) ──
  const loadCitizenVault = async (mobile: string, aadhaarLast4?: string, targetId?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_citizen_profile",
          mobile,
          aadhaarLast4,
        }),
      });
      const data = await res.json();
      if (data.success && data.citizen) {
        setCitizenSession(data.citizen);
        const myApps: CitizenApplication[] = data.citizen.activeApplications || [];
        setRecords(myApps);
        setTotalRecords(myApps.length);
        setTotalPages(1);

        if (targetId) {
          const found = myApps.find((a) => a.id.toLowerCase() === targetId.toLowerCase());
          if (found) setSelectedApp(found);
          else if (myApps.length > 0) setSelectedApp(myApps[0]);
        } else if (myApps.length > 0) {
          setSelectedApp(myApps[0]);
        }
      } else {
        setError(data.error || "તમારી અરજીઓ લોડ કરવામાં સમસ્યા આવી.");
      }
    } catch (err) {
      console.error("Failed to load citizen vault:", err);
      setError("સર્વર ક્ષતિ આવી.");
    } finally {
      setLoading(false);
    }
  };

  // ── 8. Citizen 2FA Request OTP ──
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthSuccessMsg("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_otp",
          mobile: loginMobile,
          aadhaarLast4: loginAadhaar,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setSimulatedSmsOtp(data.simulatedOtp);
        setOtpCountdown(180);
        setAttemptsLeft(3);
        setAuthSuccessMsg(data.message || "OTP સફળતાપૂર્વક મોકલાયો છે.");
      } else {
        setAuthError(data.error || "OTP મોકલવામાં ક્ષતિ આવી.");
      }
    } catch (err) {
      setAuthError("સર્વર સાથે કનેક્ટ થઈ શક્યું નથી.");
    } finally {
      setAuthLoading(false);
    }
  };

  // ── 9. Citizen 2FA Verify OTP ──
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginOtp.trim()) {
      setAuthError("કૃપા કરીને ૬ આંકડાનો OTP દાખલ કરો.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_otp",
          mobile: loginMobile,
          otp: loginOtp,
          aadhaarLast4: loginAadhaar,
        }),
      });

      const data = await res.json();
      if (data.success && data.citizen) {
        // Save authenticated session
        localStorage.setItem("nagrik_citizen_session", JSON.stringify(data.citizen));
        // Also trigger window storage event so Navbar updates
        window.dispatchEvent(new Event("storage"));

        setCitizenSession(data.citizen);
        setAuthMode("citizen");
        const myApps: CitizenApplication[] = data.citizen.activeApplications || [];
        setRecords(myApps);
        setTotalRecords(myApps.length);
        setTotalPages(1);
        if (myApps.length > 0) {
          setSelectedApp(myApps[0]);
        }
      } else {
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        setAuthError(data.error || "અમાન્ય OTP. કૃપા કરીને પુનઃ પ્રયાસ કરો.");
      }
    } catch (err) {
      setAuthError("સર્વર પ્રમાણીકરણમાં ક્ષતિ.");
    } finally {
      setAuthLoading(false);
    }
  };

  // ── 10. Fast 1-Click Demo Fill ──
  const handleFastDemoCitizen = () => {
    setLoginMobile("9825012345");
    setLoginAadhaar("4829");
    setAuthError("");
  };

  const handleAutoFillOtp = () => {
    if (simulatedSmsOtp) {
      setLoginOtp(simulatedSmsOtp);
    }
  };

  // ── 11. Citizen Logout ──
  const handleCitizenLogout = () => {
    localStorage.removeItem("nagrik_citizen_session");
    window.dispatchEvent(new Event("storage"));
    setCitizenSession(null);
    setAuthMode("unauthenticated");
    setOtpSent(false);
    setLoginOtp("");
    setSimulatedSmsOtp(null);
    setSelectedApp(null);
    setRecords([]);
  };

  // ── 12. Officer Admin Mode Login ──
  const handleOfficerLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOfficerLoading(true);
    setOfficerError("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_officer",
          officerId: officerIdInput,
          pin: officerPinInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.officer) {
        sessionStorage.setItem("nagrik_officer_session", JSON.stringify(data.officer));
        setOfficerSession(data.officer);
        setAuthMode("officer");
        setShowOfficerModal(false);
        loadOfficerData();
      } else {
        setOfficerError(data.error || "અમાન્ય કર્મચારી ID અથવા PIN.");
      }
    } catch (err) {
      setOfficerError("કચેરી સર્વર કનેક્શનમાં ક્ષતિ.");
    } finally {
      setOfficerLoading(false);
    }
  };

  const handleOfficerLogout = () => {
    sessionStorage.removeItem("nagrik_officer_session");
    setOfficerSession(null);
    setAuthMode("unauthenticated");
  };

  // ── 13. Load Master Registry (For Officer Mode) ──
  const loadOfficerData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (selectedDistrict !== "all") params.append("district", selectedDistrict);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      params.append("page", String(page));
      params.append("limit", String(limit));

      const res = await fetch(`/api/track?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        if (data.records) {
          setRecords(data.records);
          setTotalRecords(data.total);
          setTotalPages(data.totalPages);
          if (data.stats) setStats(data.stats);

          if (data.records.length === 1 && searchQuery.trim().toUpperCase().startsWith("APP")) {
            setSelectedApp(data.records[0]);
          }
        } else if (data.application) {
          setSelectedApp(data.application);
          setRecords([data.application]);
        }
      } else {
        setError(data.error || "કોઈ અરજી મળી નથી.");
      }
    } catch (err) {
      console.error("Data load error:", err);
      setError("ડેટા લોડ કરવામાં મુશ્કેલી આવી.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDistrict, selectedStatus, page, limit]);

  useEffect(() => {
    if (authMode === "officer") {
      loadOfficerData();
    }
  }, [authMode, loadOfficerData]);

  // ── 14. Action Handlers (Operator Payment Confirmation & Workflow Advance) ──
  const handleConfirmCashPayment = async () => {
    if (!selectedApp) return;
    setIsConfirmingCash(true);
    try {
      const res = await fetch("/api/track", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          action: "confirm_cash_payment",
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setSelectedApp(data.application);
        setCashConfirmedAlert(true);
        setRecords((prev) =>
          prev.map((r) => (r.id === data.application.id ? data.application : r))
        );
        setTimeout(() => setCashConfirmedAlert(false), 5000);
      } else {
        alert(data.error || "ઓપરેટર કન્ફર્મેશનમાં ક્ષતિ આવી.");
      }
    } catch (e) {
      console.error(e);
      alert("સર્વર ક્ષતિ આવી.");
    } finally {
      setIsConfirmingCash(false);
    }
  };

  const handleAdvanceStage = async (targetStage: 1 | 2 | 3 | 4, officerRole: string) => {
    if (!selectedApp) return;
    setIsUpdatingStage(true);
    try {
      const res = await fetch("/api/track", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          action: "update_workflow_stage",
          stage: targetStage,
          officerRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setSelectedApp(data.application);
        setRecords((prev) =>
          prev.map((r) => (r.id === data.application.id ? data.application : r))
        );
        setStageUpdateAlert(data.message || `તબક્કો ${targetStage} સફળતાપૂર્વક અપડેટ થયો.`);
        setTimeout(() => setStageUpdateAlert(null), 5000);
      } else {
        alert(data.error || "વર્કફ્લો અપડેટ કરવામાં ક્ષતિ આવી.");
      }
    } catch (e) {
      console.error(e);
      alert("સર્વર ક્ષતિ આવી.");
    } finally {
      setIsUpdatingStage(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (authMode === "officer") {
      setPage(1);
      loadOfficerData();
    } else if (authMode === "citizen" && citizenSession) {
      // Filter within citizen's active applications
      const q = searchQuery.trim().toLowerCase();
      const myApps = citizenSession.activeApplications || [];
      if (!q) {
        setRecords(myApps);
      } else {
        const filtered = myApps.filter(
          (a) =>
            a.id.toLowerCase().includes(q) ||
            a.schemeName.toLowerCase().includes(q) ||
            a.schemeNameGu.toLowerCase().includes(q)
        );
        setRecords(filtered);
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden print:hidden print-hide no-print">
        {/* ── Top Header Section ── */}
        <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white py-8 sm:py-10 px-4 shadow-md">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                  <ShieldCheck size={14} className="text-amber-200" />
                  <span>ગુજરાત ડિજિટલ પબ્લિક ઇન્ફ્રાસ્ટ્રક્ચર • Zero-Trust Citizen Security</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug break-words">
                  {authMode === "officer"
                    ? "🏛️ તાલુકા મામલતદાર કચેરી એડમિન પોર્ટલ"
                    : authMode === "citizen"
                    ? "🔐 મારું નાગરિક સુરક્ષિત વોલ્ટ (My Applications)"
                    : "🛡️ નાગરિક અરજી ટ્રેકર & સુરક્ષા કવચ"}
                </h1>
                <p className="text-orange-100 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed break-words">
                  {authMode === "officer"
                    ? "અધિકારી સ્ક્રુટિની ડેસ્ક: તમામ ૩૩ જિલ્લાઓની ૫,૪૦૦+ અરજીઓની ચકાસણી, e-Sign મંજૂરી અને કચેરી સંચાલન."
                    : authMode === "citizen"
                    ? "તમારી તમામ સરકારી અરજીઓ, દસ્તાવેજ સુધારા, કચેરી પહોંચ અને મંજૂરી સ્ટેટસ ફક્ત તમારા પોતાના સુરક્ષિત વોલ્ટમાં ઉપલબ્ધ છે."
                    : "DPDP Act 2023 & UIDAI સુરક્ષા ધોરણો: તમારો ડેટા સુરક્ષિત છે. તમારો રજિસ્ટર્ડ મોબાઈલ અને આધાર OTP દાખલ કરી તમારો પોતાનો રેકોર્ડ જુઓ."}
                </p>

                {/* Switch View Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <Link
                    href="/documents"
                    className="inline-flex items-center gap-1.5 bg-white text-orange-700 hover:bg-orange-50 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md transition active:scale-95"
                  >
                    <Sparkles size={13} />
                    <span>+ નવી અરજી / દસ્તાવેજ સેવા (Apply)</span>
                  </Link>

                  <Link
                    href="/eligibility"
                    className="inline-flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-white border border-white/30 px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    <IndianRupee size={13} />
                    <span>DBT લાભ લેજર & પાત્રતા</span>
                  </Link>

                  {authMode !== "officer" ? (
                    <button
                      type="button"
                      onClick={() => setShowOfficerModal(true)}
                      className="inline-flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-900/80 text-amber-200 border border-amber-300/40 px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                    >
                      <Building2 size={13} />
                      <span>🏛️ કચેરી એડમિન પોર્ટલ (Officer Mode)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleOfficerLogout();
                        setAuthMode(citizenSession ? "citizen" : "unauthenticated");
                      }}
                      className="inline-flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-900 text-white border border-white/30 px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                    >
                      <User size={13} />
                      <span>👤 નાગરિક વ્યૂ પર પાછા જાઓ</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status / Session Pill */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 text-left sm:text-right shrink-0">
                {authMode === "citizen" && citizenSession ? (
                  <>
                    <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider flex items-center justify-end gap-1">
                      <ShieldCheck size={14} className="text-emerald-300" />
                      <span>સક્રિય નાગરિક સત્ર</span>
                    </p>
                    <p className="text-lg sm:text-xl font-black text-white">{citizenSession.citizenNameGu}</p>
                    <p className="text-xs text-orange-100 font-mono">+91 {citizenSession.mobile}</p>
                    <button
                      onClick={handleCitizenLogout}
                      className="mt-2 text-[11px] bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 sm:ml-auto"
                    >
                      <LogOut size={12} /> સત્ર સમાપ્ત (Logout)
                    </button>
                  </>
                ) : authMode === "officer" && officerSession ? (
                  <>
                    <p className="text-xs text-amber-300 uppercase font-bold tracking-wider flex items-center justify-end gap-1">
                      <Building2 size={14} className="text-amber-300" />
                      <span>સત્તાવાર અધિકારી લૉગિન</span>
                    </p>
                    <p className="text-sm sm:text-base font-black text-white">{officerSession.name}</p>
                    <p className="text-[11px] text-orange-100">{officerSession.designation}</p>
                    <button
                      onClick={handleOfficerLogout}
                      className="mt-2 text-[11px] bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 sm:ml-auto"
                    >
                      <LogOut size={12} /> કચેરી લૉગઆઉટ
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-orange-200 uppercase font-bold tracking-wider">સુરક્ષા સ્થિતિ</p>
                    <p className="text-base sm:text-lg font-black text-white">2FA સુરક્ષિત વોલ્ટ</p>
                    <p className="text-[11px] text-emerald-300 font-medium">શૂન્ય ડેટા લિકેજ પ્રમાણિત</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Body Container ── */}
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">

          {/* ══════════════════════════════════════════════════════════════
              VIEW 1: UNAUTHENTICATED CITIZEN 2-FACTOR AUTHENTICATION SHIELD
             ══════════════════════════════════════════════════════════════ */}
          {authMode === "unauthenticated" && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 sm:p-7 text-center space-y-2">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
                  🛡️
                </div>
                <h2 className="text-xl sm:text-2xl font-black">નાગરિક સુરક્ષા ચકાસણી (2FA Login)</h2>
                <p className="text-xs sm:text-sm text-orange-100 max-w-md mx-auto leading-relaxed">
                  સરકારી ડેટા ગોપનીયતા અધિનિયમ (DPDP Act 2023) મુજબ તમારી અરજીઓ ફક્ત તમને જ દેખાશે.
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                {/* 1-Click Fast Demo Pill */}
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-orange-900">
                    <Sparkles size={16} className="text-orange-600 shrink-0" />
                    <span>
                      <strong>હેકાથોન જજ લાઈવ ડેમો:</strong> ૧-ક્લિકમાં રમેશભાઈ પટેલની વિગતો ભરો
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFastDemoCitizen}
                    className="shrink-0 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                  >
                    ડેમો ભરો ✓
                  </button>
                </div>

                {/* Login Form */}
                <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      📱 રજિસ્ટર્ડ ૧૦ આંકડાનો મોબાઈલ નંબર
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={loginMobile}
                        onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ""))}
                        disabled={otpSent}
                        placeholder="૯૮૨૫૦ ૧૨૩૪૫"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      🪪 આધાર કાર્ડના છેલ્લા ૪ આંકડા (Two-Factor Binding)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                        XXXX - XXXX -
                      </span>
                      <input
                        type="text"
                        maxLength={4}
                        value={loginAadhaar}
                        onChange={(e) => setLoginAadhaar(e.target.value.replace(/\D/g, ""))}
                        disabled={otpSent}
                        placeholder="૪૮૨૯"
                        className="w-full pl-32 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* If OTP Sent, Show OTP Input and Live Simulated SMS Badge */}
                  {otpSent && (
                    <div className="space-y-3 pt-2 animate-in fade-in duration-300">
                      {/* Live Simulated SMS Notification */}
                      {simulatedSmsOtp && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-4 space-y-2 text-xs text-emerald-950 shadow-sm">
                          <div className="flex items-center justify-between gap-2 border-b border-emerald-300 pb-2">
                            <span className="font-black flex items-center gap-1.5 text-emerald-900">
                              <Smartphone size={15} />
                              <span>ગુજરાત સરકાર સુરક્ષિત SMS (UIDAI / DPI Gateway)</span>
                            </span>
                            <span className="bg-emerald-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                              LIVE SMS
                            </span>
                          </div>
                          <p className="leading-relaxed">
                            નમસ્તે રમેશભાઈ, તમારી નાગરિક સેવા અરજીઓ ટ્રેક કરવાનો તમારો સત્તાવાર સુરક્ષા કોડ (OTP):{" "}
                            <strong className="font-mono text-base text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                              {simulatedSmsOtp}
                            </strong>
                          </p>
                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[11px] text-emerald-700">આ કોડ અન્ય કોઈ સાથે શેર કરશો નહીં.</span>
                            <button
                              type="button"
                              onClick={handleAutoFillOtp}
                              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-3 py-1 rounded-lg text-xs transition"
                            >
                              કોડ આપોઆપ ભરો ✓
                            </button>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                            🔐 ૬ આંકડાનો OTP દાખલ કરો
                          </label>
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <span className="text-orange-600 flex items-center gap-1">
                              <Clock size={12} /> {otpCountdown}s
                            </span>
                            <span className="text-slate-400">| પ્રયાસો: {attemptsLeft}/3</span>
                          </div>
                        </div>

                        <input
                          type="text"
                          maxLength={6}
                          value={loginOtp}
                          onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ""))}
                          placeholder="દા.ત. 123456"
                          autoFocus
                          className="w-full text-center tracking-widest text-xl font-mono font-black py-3 bg-white border-2 border-orange-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Feedback Alerts */}
                  {authError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertTriangle size={15} className="shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authSuccessMsg && !authError && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 size={15} className="shrink-0" />
                      <span>{authSuccessMsg}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!otpSent ? (
                    <button
                      type="submit"
                      disabled={authLoading || loginMobile.length !== 10 || loginAadhaar.length !== 4}
                      className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-95 text-white font-extrabold rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>OTP મોકલાઈ રહ્યો છે...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          <span>સુરક્ષિત OTP મેળવો (Get Secure OTP)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="submit"
                        disabled={authLoading || loginOtp.length !== 6}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {authLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>ચકાસણી ચાલુ છે...</span>
                          </>
                        ) : (
                          <>
                            <Lock size={16} />
                            <span>વોલ્ટ અનલૉક કરો (Verify & Access My Vault)</span>
                          </>
                        )}
                      </button>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setLoginOtp("");
                            setSimulatedSmsOtp(null);
                          }}
                          className="text-slate-500 hover:text-slate-800 underline"
                        >
                          મોબાઈલ નંબર બદલો
                        </button>

                        <button
                          type="button"
                          onClick={handleRequestOtp}
                          disabled={otpCountdown > 150}
                          className="text-orange-600 hover:text-orange-700 font-bold disabled:opacity-40"
                        >
                          નવો OTP મોકલો (Resend)
                        </button>
                      </div>
                    </div>
                  )}
                </form>

                {/* Office Mode Switch Option for Judges */}
                <div className="pt-4 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => setShowOfficerModal(true)}
                    className="text-xs font-bold text-slate-500 hover:text-orange-600 transition inline-flex items-center gap-1.5"
                  >
                    <Building2 size={13} />
                    <span>સરકારી કર્મચારી / મામલતદાર છો? [અધિકારી લૉગિન કરો]</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VIEW 2: CITIZEN PRIVATE VAULT (Authenticated - Zero Data Leak)
             ══════════════════════════════════════════════════════════════ */}
          {authMode === "citizen" && citizenSession && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Authenticated Citizen Profile Pill Card */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-3xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-md">
                      👤
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                          {citizenSession.citizenNameGu}
                        </h2>
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-600" /> 2FA વેરિફાઈડ
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        📱 +91 {citizenSession.mobile} &bull; 🪪 આધાર: XXXX-XXXX-{citizenSession.aadhaarLast4} &bull; 📍 {citizenSession.village}, તા. {citizenSession.taluka}, જિ. {citizenSession.districtGu}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/documents"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <Sparkles size={14} />
                      <span>+ નવી અરજી કરો</span>
                    </Link>

                    <button
                      onClick={handleCitizenLogout}
                      className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      title="સત્ર સમાપ્ત કરો"
                    >
                      <LogOut size={13} />
                      <span>લૉગઆઉટ</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    <span>ખાનગી વોલ્ટ સુરક્ષા: અન્ય કોઈ નાગરિક તમારી અરજીઓ કે દસ્તાવેજ જોઈ શકતા નથી.</span>
                  </span>
                  <Link
                    href="/eligibility"
                    className="font-bold underline text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <span>DBT સહાય લેજર ચકાસો</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Active Applications Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <span>📋 મારી સરકારી અરજીઓ (My Applications)</span>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {records.length} અરજી
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    તમારા દ્વારા ઓનલાઇન સબમિટ થયેલ તમામ દસ્તાવેજો અને યોજનાઓનું લાઈવ સ્ટેટસ.
                  </p>
                </div>

                {/* Quick Search in My Apps */}
                <div className="w-full sm:w-64">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyUp={handleSearchSubmit}
                      placeholder="અરજી નંબરથી ફિલ્ટર..."
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Citizen's Application Cards Grid */}
              {records.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
                  <div className="text-4xl">📄</div>
                  <h4 className="font-bold text-slate-800 text-base">કોઈ અરજી મળી નથી</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    તમે હજુ સુધી કોઈ નવી સરકારી સેવા કે સુધારા માટે અરજી કરી નથી.
                  </p>
                  <Link
                    href="/documents"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
                  >
                    <Sparkles size={14} />
                    <span>નવા દસ્તાવેજ માટે અરજી કરો →</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {records.map((app) => {
                    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.processing;
                    const isSelected = selectedApp?.id === app.id;

                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className={`group bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                          isSelected
                            ? "border-orange-500 ring-2 ring-orange-200 bg-orange-50/20"
                            : "border-slate-200 hover:border-orange-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                              {app.schemeEmoji}
                            </span>
                            <div className="min-w-0">
                              <span className="font-mono font-bold text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                {app.id}
                              </span>
                              <h4 className="font-bold text-sm text-slate-800 mt-1 truncate break-words">
                                {app.schemeNameGu}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate">{app.schemeName}</p>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${cfg.badgeBg}`}
                          >
                            {app.workflowStage === 1 && app.status === "processing"
                              ? "તબક્કો ૧: સ્ક્રુટિની ચાલુ"
                              : app.workflowStage === 2 && app.status === "processing"
                              ? "તબક્કો ૨: મામલતદાર મંજૂરી"
                              : cfg.labelGu}
                          </span>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                          <div className="min-w-0 flex items-center gap-1.5 text-slate-700 font-medium">
                            <Calendar size={12} className="text-slate-400 shrink-0" />
                            <span>અરજી તારીખ: {app.appliedDate}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApp(app);
                                setShowPrintModal(true);
                              }}
                              className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                            >
                              <Printer size={12} /> પહોંચ જુઓ & પ્રિન્ટ
                            </button>
                          </div>
                        </div>

                        <p className="mt-2 text-[11px] text-slate-500 line-clamp-1 break-words">
                          {app.remarksGu}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VIEW 3: OFFICER ADMIN SCRUTINY DESK (Full 5,420+ Registry)
             ══════════════════════════════════════════════════════════════ */}
          {authMode === "officer" && officerSession && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Officer Desk Header Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-md border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md">
                      🏛️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-black text-amber-400">
                          {officerSession.name}
                        </h2>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                          {officerSession.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {officerSession.designation} &bull; જન સેવા કેન્દ્ર, {officerSession.district}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleOfficerLogout}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <LogOut size={13} />
                      <span>કચેરી લૉગઆઉટ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-1">
                    <CheckCircle2 size={15} />
                    <span>મંજૂર અરજીઓ</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.approved.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-slate-400">૭૧% સફળ મંજૂરી દર</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold mb-1">
                    <Clock size={15} />
                    <span>ચકાસણી હેઠળ</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.processing.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-slate-400">મામલતદાર / TDO કક્ષાએ</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold mb-1">
                    <TrendingUp size={15} />
                    <span>સ્થળ તપાસ બાકી</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.pending.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-slate-400">તલાટી કમ મંત્રી રિપોર્ટ</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-orange-600 text-xs font-semibold mb-1">
                    <IndianRupee size={15} />
                    <span>DBT સહાય ચૂકવણી</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.disbursedCr}</p>
                  <p className="text-[11px] text-slate-400">સીધા બેંક ખાતામાં જમા</p>
                </div>
              </div>

              {/* Master Search & Filter Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1 min-w-0">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="અરજી નંબર (દા.ત. APP001, APP-GUJ-1025), નાગરિકનું નામ અથવા જિલ્લો શોધો..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                      <span>શોધો</span>
                    </button>

                    {(searchQuery || selectedDistrict !== "all" || selectedStatus !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedDistrict("all");
                          setSelectedStatus("all");
                          setPage(1);
                        }}
                        className="p-3 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                        title="રીસેટ કરો"
                      >
                        <RefreshCw size={16} />
                      </button>
                    )}
                  </div>
                </form>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
                      <Filter size={13} /> સ્થિતિ:
                    </span>
                    {[
                      { id: "all", label: "બધા" },
                      { id: "approved", label: "મંજૂર" },
                      { id: "processing", label: "ચકાસણી હેઠળ" },
                      { id: "pending", label: "પેન્ડિંગ" },
                      { id: "rejected", label: "રિજેક્ટ" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          setSelectedStatus(st.id);
                          setPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-medium transition ${
                          selectedStatus === st.id
                            ? "bg-orange-600 text-white shadow-xs font-bold"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold shrink-0">જિલ્લો:</span>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value);
                        setPage(1);
                      }}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
                    >
                      <option value="all">તમામ ૩૩ જિલ્લા (All Gujarat)</option>
                      {GUJARAT_DISTRICTS.map((d) => (
                        <option key={d.en} value={d.en}>
                          {d.gu} ({d.en})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Master Feed Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-800 text-base">
                    સત્તાવાર અરજી ડેટાબેઝ ({totalRecords.toLocaleString("en-IN")} પરિણામો)
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    પેજ {page} / {totalPages}
                  </p>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Loader2 size={28} className="animate-spin mx-auto text-orange-600" />
                    <p className="text-xs">૫,૪૦૦+ ડેટાસેટમાંથી પરિણામો મેળવી રહ્યા છીએ...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {records.map((app) => {
                      const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.processing;
                      const isSelected = selectedApp?.id === app.id;

                      return (
                        <div
                          key={app.id}
                          onClick={() => setSelectedApp(app)}
                          className={`group bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                            isSelected
                              ? "border-orange-500 ring-2 ring-orange-200 bg-orange-50/20"
                              : "border-slate-200 hover:border-orange-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                                {app.schemeEmoji}
                              </span>
                              <div className="min-w-0">
                                <span className="font-mono font-bold text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                  {app.id}
                                </span>
                                <h4 className="font-bold text-sm text-slate-800 mt-1 truncate break-words">
                                  {app.citizenNameGu}
                                </h4>
                                <p className="text-[11px] text-slate-500 truncate">{app.citizenName}</p>
                              </div>
                            </div>

                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${cfg.badgeBg}`}
                            >
                              {app.workflowStage === 1 && app.status === "processing"
                                ? "તબક્કો ૧: સ્ક્રુટિની ચાલુ"
                                : app.workflowStage === 2 && app.status === "processing"
                                ? "તબક્કો ૨: મામલતદાર મંજૂરી"
                                : cfg.labelGu}
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                            <div className="min-w-0 flex items-center gap-1.5 text-slate-700 font-medium">
                              <MapPin size={12} className="text-slate-400 shrink-0" />
                              <span className="truncate">
                                {app.districtGu} &bull; {app.taluka}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-emerald-700 font-bold">
                                ₹{app.benefitAmount.toLocaleString("en-IN")}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedApp(app);
                                  setShowPrintModal(true);
                                }}
                                className="px-2 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded text-[10px] font-bold flex items-center gap-1 transition"
                              >
                                <Printer size={10} /> પહોંચ
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition shadow-xs"
                    >
                      &larr; પાછળ (Prev)
                    </button>

                    <div className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <span>પેજ</span>
                      <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-200 font-mono">
                        {page}
                      </span>
                      <span>/ {totalPages}</span>
                    </div>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition shadow-xs"
                    >
                      આગળ (Next) &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SHARED DETAIL MODAL (Available in Citizen & Officer View)
             ══════════════════════════════════════════════════════════════ */}
          {selectedApp && (
            <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-400 p-4 sm:p-6 space-y-5 animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-3xl sm:text-4xl p-2 bg-orange-50 rounded-2xl border border-orange-100">
                    {selectedApp.schemeEmoji}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sm sm:text-base text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                        {selectedApp.id}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          STATUS_CONFIG[selectedApp.status]?.badgeBg || "bg-slate-100"
                        }`}
                      >
                        {STATUS_CONFIG[selectedApp.status]?.labelGu}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1 break-words">
                      {selectedApp.schemeNameGu}
                    </h3>
                    <p className="text-xs text-slate-500 break-words">{selectedApp.schemeName}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <p className="text-xs text-slate-400">મંજૂર સહાય રકમ (Benefit)</p>
                  <p className="text-lg sm:text-xl font-black text-emerald-600">
                    ₹{selectedApp.benefitAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Applicant Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <p className="text-slate-400 flex items-center gap-1">
                    <User size={12} /> અરજદારનું નામ
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5 break-words">{selectedApp.citizenNameGu}</p>
                  <p className="text-[10px] text-slate-500 break-words">{selectedApp.citizenName}</p>
                </div>
                <div>
                  <p className="text-slate-400 flex items-center gap-1">
                    <MapPin size={12} /> જિલ્લો / તાલુકો
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5 break-words">
                    {selectedApp.districtGu} ({selectedApp.district})
                  </p>
                  <p className="text-[10px] text-slate-500 break-words">{selectedApp.taluka}</p>
                </div>
                <div>
                  <p className="text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> અરજી તારીખ
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedApp.appliedDate}</p>
                  <p className="text-[10px] text-slate-500">આખરી અપડેટ: {selectedApp.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck size={12} /> આધાર ક્રમાંક
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5 font-mono">XXXX-XXXX-{selectedApp.aadhaarLast4}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">UIDAI વેરિફાઈડ</p>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              {(() => {
                const currentStage: number =
                  selectedApp.workflowStage !== undefined
                    ? selectedApp.workflowStage
                    : selectedApp.status === "approved"
                    ? 3
                    : selectedApp.status === "rejected"
                    ? 2
                    : 1;

                return (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FileCheck2 size={14} className="text-orange-600" /> સરકારી ચકાસણી ટાઈમલાઈન (Audit Trail):
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          currentStage === 1
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : currentStage === 2
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {currentStage === 1
                          ? "તબક્કો ૧: સ્ક્રુટિની ચાલુ"
                          : currentStage === 2
                          ? "તબક્કો ૨: મામલતદાર મંજૂરી અર્થે"
                          : "તબક્કો ૩: ૧૦૦% મંજૂર"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                      {/* Step 1 */}
                      <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>૧. અરજી સબમિટ</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">ઓનલાઇન સ્વીકાર (પૂર્ણ)</p>
                      </div>

                      {/* Step 2 */}
                      {currentStage >= 2 ? (
                        <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            <span>૨. દસ્તાવેજ ખરાઈ</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">નાયબ મામલતદાર (પૂર્ણ)</p>
                        </div>
                      ) : selectedApp.status === "rejected" ? (
                        <div className="p-2.5 rounded-xl border bg-rose-50 border-rose-300 text-rose-900 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                            <XCircle size={14} className="text-rose-600 shrink-0" />
                            <span>૨. દસ્તાવેજ ખરાઈ</span>
                          </div>
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">પૂરક પુરાવા જરૂરી</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl border bg-blue-50/90 border-blue-400 text-blue-950 shadow-xs ring-2 ring-blue-300/60 animate-pulse">
                          <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                            <Clock size={14} className="text-blue-600 animate-spin shrink-0" />
                            <span>૨. દસ્તાવેજ ખરાઈ</span>
                          </div>
                          <p className="text-[11px] text-blue-800 mt-1 font-bold">કચેરી સ્ક્રુટિની ચાલુ</p>
                        </div>
                      )}

                      {/* Step 3 */}
                      {currentStage >= 3 ? (
                        <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            <span>૩. મામલતદાર મંજૂરી</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">મામલતદાર e-Sign (પૂર્ણ)</p>
                        </div>
                      ) : currentStage === 2 ? (
                        <div className="p-2.5 rounded-xl border bg-amber-50/90 border-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300/60 animate-pulse">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                            <Clock size={14} className="text-amber-600 animate-spin shrink-0" />
                            <span>૩. મામલતદાર મંજૂરી</span>
                          </div>
                          <p className="text-[11px] text-amber-800 mt-1 font-bold">આખરી સહી પ્રક્રિયામાં</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl border bg-slate-100/90 border-slate-200 text-slate-400">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-500">
                            <Clock size={14} className="text-slate-400 shrink-0" />
                            <span>૩. મામલતદાર મંજૂરી</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">મંજૂરી પ્રતીક્ષામાં</p>
                        </div>
                      )}

                      {/* Step 4 */}
                      {selectedApp.paymentStatus === "pending_challan" ? (
                        <div className="p-2.5 rounded-xl border bg-amber-50 border-amber-300 text-amber-900">
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            <span>🔒</span>
                            <span>૪. કચેરી ફી & રિલીઝ</span>
                          </div>
                          <p className="text-[11px] text-amber-800 mt-1 font-bold">રોકડ ચુકવણી બાકી</p>
                        </div>
                      ) : currentStage >= 3 ? (
                        <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            <span>૪. DBT સહાય / પ્રમાણપત્ર</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">સફળ રિલીઝ / ડાઉનલોડ</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl border bg-slate-100/90 border-slate-200 text-slate-400">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-500">
                            <Clock size={14} className="text-slate-400 shrink-0" />
                            <span>૪. DBT સહાય / પ્રમાણપત્ર</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">પ્રક્રિયા હેઠળ</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Dynamic Officer Simulation Box */}
              {authMode === "officer" && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 border border-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
                      <Building2 size={14} />
                      <span>અધિકારી વર્કફ્લો પ્રગતિ ડેસ્ક (Officer Scrutiny Action)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">હોદ્દાવાર સત્તાવાર એક્શન</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-300">
                      અરજીની ચકાસણી આગળ વધારવા માટે નીચે આપેલ બટન પર ક્લિક કરો:
                    </p>

                    <div className="flex items-center gap-2">
                      {selectedApp.workflowStage === 1 && (
                        <button
                          type="button"
                          onClick={() => handleAdvanceStage(2, "નાયબ મામલતદાર")}
                          disabled={isUpdatingStage}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          {isUpdatingStage ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                          <span>[નાયબ મામલતદાર]: સ્ક્રુટિની મંજૂર કરો ➔</span>
                        </button>
                      )}

                      {selectedApp.workflowStage === 2 && (
                        <button
                          type="button"
                          onClick={() => handleAdvanceStage(3, "મામલતદાર")}
                          disabled={isUpdatingStage}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          {isUpdatingStage ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                          <span>[તાલુકા મામલતદાર]: આખરી e-Sign મંજૂરી આપો ✓</span>
                        </button>
                      )}

                      {selectedApp.workflowStage === 3 && (
                        <button
                          type="button"
                          onClick={() => handleAdvanceStage(1, "ટેસ્ટિંગ ડેસ્ક")}
                          disabled={isUpdatingStage}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                        >
                          <RefreshCw size={12} />
                          <span>ડેમો રીસેટ (Reset)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Offline Cash Challan Box if applicable */}
              {selectedApp.paymentStatus === "pending_challan" && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3 text-xs text-amber-950">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <span>🔒</span>
                      <span>ઓફલાઇન રોકડ ચલણ (GRN: {selectedApp.challanNo})</span>
                    </span>
                    <span className="bg-amber-200 text-amber-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                      રૂબરૂ કાઉન્ટર ચુકવણી બાકી
                    </span>
                  </div>

                  <p className="leading-relaxed">
                    તમારું પ્રમાણપત્ર હાલ સરકારી નિયમ મુજબ <strong>લૉક</strong> છે. કૃપા કરીને જન સેવા કેન્દ્રના રોકડ કાઉન્ટર પર ચલણ નં. <strong className="font-mono text-orange-700">{selectedApp.challanNo}</strong> સાથે નિયત સરકારી ફી <strong className="font-mono text-emerald-800">₹{selectedApp.feeAmount || 50}</strong> રોકડા જમા કરાવો. કચેરી ઓપરેટર ચુકવણી કન્ફર્મ કરે ત્યાર બાદ તરત પ્રમાણપત્ર રિલીઝ થશે.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPrintModal(true)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Printer size={13} />
                      <span>રોકડ ચલણ પ્રિન્ટ કરો (Print Challan)</span>
                    </button>

                    {/* Operator live simulation for judges */}
                    <button
                      type="button"
                      onClick={handleConfirmCashPayment}
                      disabled={isConfirmingCash}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5"
                    >
                      {isConfirmingCash ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                      <span>[કચેરી ઓપરેટર]: રોકડ સ્વીકારી પ્રમાણપત્ર અનલૉક કરો</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Fast-Track Appointment Token if applicable */}
              {selectedApp.biometricRequired && selectedApp.appointmentToken && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <Fingerprint size={16} className="text-blue-600" />
                    <span>જન સેવા કેન્દ્ર ફાસ્ટ-ટ્રેક ટોકન સ્લોટ:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                      <span className="text-[10px] text-slate-400 block">ટોકન ક્રમાંક:</span>
                      <strong className="text-blue-700 font-mono text-sm">{selectedApp.appointmentToken}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                      <span className="text-[10px] text-slate-400 block">તારીખ & સમય:</span>
                      <strong className="text-slate-800">{selectedApp.appointmentDate} • {selectedApp.appointmentTime}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-blue-100 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block">કેન્દ્ર:</span>
                      <strong className="text-slate-800 truncate block">{selectedApp.appointmentCenter}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Departmental Remarks */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 size={13} /> વિભાગીય રીમાર્કસ (Officer Remarks):
                </p>
                <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed break-words">
                  {selectedApp.remarksGu}
                </p>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  અધિકારી હોદ્દો: {selectedApp.officerDesignation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  બંધ કરો (Close)
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-1.5 active:scale-95"
                >
                  <Printer size={14} />
                  <span>
                    {selectedApp.paymentStatus === "pending_challan"
                      ? "ઓફલાઇન રોકડ ચલણ જુઓ & પ્રિન્ટ"
                      : "સત્તાવાર સરકારી પહોંચ જુઓ & પ્રિન્ટ"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Official Officer Admin Login Modal (For Judges / Mamlatdar) ── */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                🏛️
              </div>
              <h3 className="text-lg font-black text-slate-900">સત્તાવાર કચેરી એડમિન લૉગિન</h3>
              <p className="text-xs text-slate-500">
                ગુજરાત સરકાર મામલતદાર / એક્ઝિક્યુટિવ સ્ક્રુટિની પોર્ટલ
              </p>
            </div>

            {/* Quick Demo Fill for Judges */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-900">
              <span><strong>ડેમો ઓળખપત્ર:</strong> GUJ-GOV-9012 (PIN: GJ2026)</span>
              <button
                type="button"
                onClick={() => {
                  setOfficerIdInput("GUJ-GOV-9012");
                  setOfficerPinInput("GJ2026");
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2 py-1 rounded text-[11px]"
              >
                ભરો ✓
              </button>
            </div>

            <form onSubmit={handleOfficerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  કર્મચારી ID (Officer ID)
                </label>
                <input
                  type="text"
                  value={officerIdInput}
                  onChange={(e) => setOfficerIdInput(e.target.value)}
                  placeholder="GUJ-GOV-9012"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  સુરક્ષા PIN (Security PIN)
                </label>
                <input
                  type="password"
                  value={officerPinInput}
                  onChange={(e) => setOfficerPinInput(e.target.value)}
                  placeholder="GJ2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {officerError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <XCircle size={15} className="shrink-0" />
                  <span>{officerError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfficerModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  disabled={officerLoading}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-amber-300 rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5"
                >
                  {officerLoading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                  <span>લૉગિન કરો</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Official Gujarat Govt Digital Application Receipt (Print Only & Single A4 Page) ── */}
      {selectedApp && (
        <div className="hidden print:flex print-only-certificate bg-white">
          <GovernmentReceiptSlip app={selectedApp} />
        </div>
      )}

      {/* ── On-Screen Live Modal Preview with Stamp & Signature ── */}
      {showPrintModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:hidden animate-in fade-in duration-200">
          <GovernmentReceiptSlip
            app={selectedApp}
            isModalPreview={true}
            onClose={() => setShowPrintModal(false)}
          />
        </div>
      )}
    </>
  );
}
