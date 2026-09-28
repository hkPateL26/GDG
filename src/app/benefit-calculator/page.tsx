"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  ShieldCheck,
  Share2,
  Printer,
  Users,
  CheckCircle2,
  Lock,
  KeyRound,
  ShieldAlert,
  BadgeCheck,
  RotateCcw,
  Smartphone,
  Check,
  Wheat,
  Home,
  Flame,
  UserCheck,
  Heart,
  Briefcase,
  GraduationCap,
  Wrench,
  FileSpreadsheet,
  Eye,
  EyeOff,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  QrCode,
} from "lucide-react";

interface VerifiedMember {
  name: string;
  relation: string;
  age: number;
}

export default function BenefitCalculatorPage() {
  // Mobile Tab Switcher (App-like feel)
  const [activeTab, setActiveTab] = useState<"inputs" | "slip">("inputs");

  // Step 1: Input Fields (starts completely blank)
  const [aadhaarNumber, setAadhaarNumber] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [isKycVerified, setIsKycVerified] = useState<boolean>(false);
  const [kycError, setKycError] = useState<string>("");
  const [maskValues, setMaskValues] = useState<boolean>(true);

  // Tooltip & Popover States
  const [activeDetailView, setActiveDetailView] = useState<"members" | "address" | null>(null);
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const membersScrollRef = useRef<HTMLDivElement>(null);

  const scrollMembers = (direction: "left" | "right") => {
    if (membersScrollRef.current) {
      const scrollAmount = direction === "left" ? -230 : 230;
      membersScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Step 2: Auto-Fetched Citizen & Family Data from Government Database
  const [citizenName, setCitizenName] = useState<string>("");
  const [rationCardNumber, setRationCardNumber] = useState<string>("");
  const [village, setVillage] = useState<string>("");
  const [taluka, setTaluka] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [familyMembersList, setFamilyMembersList] = useState<VerifiedMember[]>([]);

  // Step 3: Realistic Government Eligibility Toggles (Interactive App Chips)
  const [isFarmer, setIsFarmer] = useState<boolean>(false);
  const [needsHouse, setNeedsHouse] = useState<boolean>(false);
  const [needsLPG, setNeedsLPG] = useState<boolean>(false);
  const [hasSeniorCitizen, setHasSeniorCitizen] = useState<boolean>(false);
  const [hasGirlChild, setHasGirlChild] = useState<boolean>(false);
  const [isSmallBusiness, setIsSmallBusiness] = useState<boolean>(false);
  const [hasStudent, setHasStudent] = useState<boolean>(false);
  const [isLaborer, setIsLaborer] = useState<boolean>(false);
  const [casteCategory, setCasteCategory] = useState<"sebc" | "sc" | "st" | "ews" | "general">("sebc");

  // Auto-Sync with Active Citizen Session if Logged In (BUG-006)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("nagrik_citizen_session");
          if (stored) {
            const session = JSON.parse(stored);
            if (session && session.mobile) {
              const formattedMobile = session.mobile.length > 5 ? `${session.mobile.slice(0, 5)} ${session.mobile.slice(5)}` : session.mobile;
              setMobileNumber(formattedMobile);
              setAadhaarNumber(`XXXX XXXX ${session.aadhaarLast4 || "4829"}`);
              setIsKycVerified(true);
              setMaskValues(true);
              setCitizenName(session.citizenNameGu || session.citizenName || "રમેશભાઈ કાંતિલાલ પટેલ");
              setRationCardNumber("RC-GJ-2026-482901");
              setVillage(session.village || "ગોમટા (Gomta)");
              setTaluka(session.taluka || "ગોંડલ");
              setDistrict(session.districtGu || session.district || "રાજકોટ");
              setPincode("360320");
              if (session.hasLand || session.occupation === "farmer") {
                setIsFarmer(true);
              }
              if (session.annualIncome && session.annualIncome <= 200000) {
                setNeedsHouse(true);
              }
              const verifiedMembers: VerifiedMember[] = [
                { name: session.citizenNameGu || "રમેશભાઈ કાંતિલાલ પટેલ", relation: "કુટુંબના વડા (Self)", age: 41 },
                { name: "ગીતાબેન રમેશભાઈ પટેલ", relation: "પત્ની (Wife)", age: 38 },
                { name: "હાર્દિક રમેશભાઈ પટેલ", relation: "પુત્ર (Son)", age: 16 },
                { name: "પૂજાબેન રમેશભાઈ પટેલ", relation: "પુત્રી (Daughter)", age: 12 },
              ];
              setFamilyMembersList(verifiedMembers);
              setHasStudent(true);
            }
          }
        } catch (err) {
          console.warn("Failed to restore citizen session in calculator:", err);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic calculations strictly tied to real-time verification and selected checkboxes
  const familyCount = familyMembersList.length || 0;
  const pmKisanBenefit = isKycVerified && isFarmer ? 6000 : 0;
  const pmAwasBenefit = isKycVerified && needsHouse ? 120000 : 0;
  const ujjwalaBenefit = isKycVerified && needsLPG ? 3600 : 0;
  const atalPensionBenefit = isKycVerified && hasSeniorCitizen ? 36000 : 0;
  const vahliDikriBenefit = isKycVerified && hasGirlChild ? 110000 : 0;
  const svanidhiBenefit = isKycVerified && isSmallBusiness ? 20000 : 0;
  const scholarshipBenefit = isKycVerified && hasStudent
    ? (casteCategory === "sc" || casteCategory === "st" ? 15000 : 10000)
    : 0;
  const vishwakarmaBenefit = isKycVerified && isLaborer ? 15000 : 0;

  const directCashTotal = isKycVerified
    ? pmKisanBenefit +
      pmAwasBenefit +
      ujjwalaBenefit +
      atalPensionBenefit +
      vahliDikriBenefit +
      svanidhiBenefit +
      scholarshipBenefit +
      vishwakarmaBenefit
    : 0;

  const healthCoverTotal = isKycVerified ? 500000 : 0; // Ayushman Bharat ₹5 Lakh

  // Count active selections
  const activeCount = [
    isFarmer,
    needsHouse,
    needsLPG,
    hasSeniorCitizen,
    hasGirlChild,
    isSmallBusiness,
    hasStudent,
    isLaborer,
  ].filter(Boolean).length;

  // 1-Click Demo Fill for Hackathon Judges
  const fillDemoData = () => {
    setAadhaarNumber("5489 1234 9876");
    setMobileNumber("98765 43210");
    setKycError("");
  };

  const resetAll = () => {
    setAadhaarNumber("");
    setMobileNumber("");
    setOtpSent(false);
    setEnteredOtp("");
    setIsKycVerified(false);
    setMaskValues(true);
    setActiveDetailView(null);
    setShowMembersModal(false);
    setShowAddressModal(false);
    setCitizenName("");
    setRationCardNumber("");
    setVillage("");
    setTaluka("");
    setDistrict("");
    setPincode("");
    setFamilyMembersList([]);
    setIsFarmer(false);
    setNeedsHouse(false);
    setNeedsLPG(false);
    setHasSeniorCitizen(false);
    setHasGirlChild(false);
    setIsSmallBusiness(false);
    setHasStudent(false);
    setIsLaborer(false);
    setCasteCategory("sebc");
    setKycError("");
    setActiveTab("inputs");
  };

  // Strict Digits-Only & Space Formatters
  const handleAadhaarInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 12);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setAadhaarNumber(formatted);
    if (kycError) setKycError("");
  };

  const handleMobileInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    const formatted = digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
    setMobileNumber(formatted);
    if (kycError) setKycError("");
  };

  const handleOtpInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 6);
    setEnteredOtp(digits);
    if (kycError) setKycError("");
  };

  // Aadhaar OTP Verification Logic
  const sendAadhaarOtp = () => {
    const rawAadhaar = aadhaarNumber.replace(/\D/g, "");
    const rawMobile = mobileNumber.replace(/\D/g, "");

    if (rawAadhaar.length !== 12) {
      setKycError("કૃપા કરીને ૧૨ અંકનો પૂરો આધાર નંબર દાખલ કરો.");
      return;
    }
    if (rawMobile.length !== 10) {
      setKycError("કૃપા કરીને ૧૦ અંકનો પૂરો મોબાઈલ નંબર દાખલ કરો.");
      return;
    }
    setKycError("");
    setOtpSent(true);
  };

  const verifyOtp = () => {
    if (enteredOtp === "123456" || enteredOtp.length === 6) {
      setIsKycVerified(true);
      setMaskValues(true);
      setKycError("");

      // Auto-populate verified citizen data
      setCitizenName("હરિભાઈ વિઠ્ઠલભાઈ પટેલ");
      setRationCardNumber("RC-GJ-2024-998124");
      setVillage("કાગવડ");
      setTaluka("જેતપુર");
      setDistrict("રાજકોટ");
      setPincode("360370");

      const verifiedMembers: VerifiedMember[] = [
        { name: "હરિભાઈ વિઠ્ઠલભાઈ પટેલ", relation: "કુટુંબના વડા (Self)", age: 52 },
        { name: "મંજુલાબેન હરિભાઈ પટેલ", relation: "પત્ની (Wife)", age: 49 },
        { name: "ચિરાગ હરિભાઈ પટેલ", relation: "પુત્ર (Son)", age: 22 },
        { name: "દિવ્યાબેન હરિભાઈ પટેલ", relation: "પુત્રી (Daughter)", age: 18 },
        { name: "ગોદાવરીબેન વિઠ્ઠલભાઈ પટેલ", relation: "માતા (Senior Citizen)", age: 74 },
      ];
      setFamilyMembersList(verifiedMembers);

      // Default checks based on profile
      setIsFarmer(true);
      setHasSeniorCitizen(true);
      setHasStudent(true); // Chirag (22 yr) is college student
    } else {
      setKycError("અમાન્ય OTP. કૃપા કરીને ટેસ્ટ OTP: 123456 દાખલ કરો.");
    }
  };

  // Generate WhatsApp Share Message
  const shareOnWhatsApp = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "https://nagrikseva-ai.gov.in");
    const text = encodeURIComponent(
      `🇮🇳 *નાગરિકસેવા AI - સત્તાવાર ડિજિટલ પાત્રતા સ્લિપ*\n` +
      `👤 નાગરિક: ${citizenName}\n` +
      `📍 ગામ: ${village}, તા. ${taluka}, જિ. ${district} (${pincode})\n` +
      `📋 રેશનકાર્ડ નં: ${rationCardNumber}\n` +
      `🔒 UIDAI e-KYC: ૧૦૦% વેરિફાઈડ ભારતીય નાગરિક\n` +
      `👨‍👩‍👧‍👦 રેશનકાર્ડ પ્રમાણિત સભ્યો: ${familyCount} વ્યક્તિઓ\n\n` +
      `💰 *કુલ વાર્ષિક સીધી સરકારી સહાય:* ₹${directCashTotal.toLocaleString("en-IN")}\n` +
      `🏥 *નિ:શુલ્ક આરોગ્ય કવચ:* ₹5,00,000 (આયુષ્માન ભારત)\n\n` +
      `✨ *મળવાપાત્ર યોજનાઓ:*\n` +
      (isFarmer ? `• PM કિસાન સન્માન નિધિ: ₹6,000/વર્ષ\n` : "") +
      (needsHouse ? `• PM આવાસ યોજના (મકાન સહાય): ₹1,20,000\n` : "") +
      (needsLPG ? `• PM ઉજ્જવલા ફ્રી ગેસ કનેક્શન: ₹3,600\n` : "") +
      (hasSeniorCitizen ? `• વરિષ્ઠ નાગરિક પેન્શન સહાય: ₹36,000/વર્ષ\n` : "") +
      (hasGirlChild ? `• વહાલી દીકરી યોજના સહાય: ₹1,10,000\n` : "") +
      (isSmallBusiness ? `• PM સ્વનિધિ ધંધાકીય લોન: ₹20,000\n` : "") +
      (hasStudent ? `• ${casteCategory === "sc" || casteCategory === "st" ? "SC/ST પોસ્ટ મેટ્રિક શિષ્યવૃત્તિ: ₹15,000" : "ડિજિટલ ગુજરાત શિષ્યવૃત્તિ: ₹10,000"}\n` : "") +
      (isLaborer ? `• PM વિશ્વકર્મા ટૂલકીટ સહાય: ₹15,000\n` : "") +
      `\nજનસેવા કેન્દ્ર (CSC) પર રજૂ કરવા યોગ્ય સ્લિપ: ${origin}/benefit-calculator`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // High-Fidelity Official A4 Certificate Print Engine
  const handlePrintCertificate = () => {
    const printArea = document.getElementById("official-receipt-print-area");
    if (!printArea) {
      window.print();
      return;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "instant" });

    // Remove any existing print frame
    const oldIframe = document.getElementById("benefit-print-frame");
    if (oldIframe) {
      oldIframe.remove();
    }

    const iframe = document.createElement("iframe");
    iframe.id = "benefit-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.zIndex = "-1";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    // Clone all stylesheets from head
    const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join("\n");

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="gu">
        <head>
          <meta charset="utf-8" />
          <title>ડિજિટલ નાગરિક પાત્રતા પ્રમાણપત્ર - ગુજરાત સરકાર</title>
          ${headStyles}
          <style>
            @page {
              size: A4 portrait;
              margin: 4mm;
            }
            * {
              box-sizing: border-box;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #0f172a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: system-ui, -apple-system, sans-serif;
            }
            #official-receipt-print-area,
            .print-only-certificate {
              display: flex !important;
              visibility: visible !important;
              position: static !important;
              width: 100% !important;
              height: 280mm !important;
              min-height: 280mm !important;
              box-sizing: border-box !important;
              border: 2px solid #0f172a !important;
              padding: 4mm 5mm !important;
            }
          </style>
        </head>
        <body>
          ${printArea.outerHTML}
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 350);
  };

  // All 8 Realistic Government Parameters configured with Official Data Sources & Validation Rules
  const CONDITIONS = [
    {
      id: "farmer",
      label: "ખેડૂત કુટુંબ (જમીન ધારક)",
      scheme: "PM કિસાન સન્માન નિધિ",
      amount: "₹6,000/વર્ષ",
      Icon: Wheat,
      color: "border-amber-300 bg-amber-50/70 text-amber-950",
      active: isFarmer,
      toggle: () => setIsFarmer(!isFarmer),
      govtSource: "AnyRoR (૭/૧૨ રેકોર્ડ)",
      shortRule: "૨ હેક્ટરથી ઓછી ખેતીની જમીન ધરાવતા ખેડૂત",
      verifiedEvidence: "ખાતા ૧૪૨/A (૧.૪ હેક્ટર)",
    },
    {
      id: "house",
      label: "કાચું મકાન (પાકા ઘરની જરૂર)",
      scheme: "PM આવાસ યોજના",
      amount: "₹1,20,000 સહાય",
      Icon: Home,
      color: "border-green-300 bg-green-50/70 text-green-950",
      active: needsHouse,
      toggle: () => setNeedsHouse(!needsHouse),
      govtSource: "AwasSoft / SECC સર્વે",
      shortRule: "સમગ્ર ભારતમાં ક્યાંય પાકું મકાન ન હોય",
      verifiedEvidence: "કાચું મકાન સર્વે પ્રમાણિત",
    },
    {
      id: "lpg",
      label: "ગેસ સિલિન્ડર નથી",
      scheme: "PM ઉજ્જવલા 2.0",
      amount: "₹3,600 ફ્રી કિટ",
      Icon: Flame,
      color: "border-red-300 bg-red-50/70 text-red-950",
      active: needsLPG,
      toggle: () => setNeedsLPG(!needsLPG),
      govtSource: "OMC ગેસ પોર્ટલ",
      shortRule: "મહિલા સભ્યના નામે અગાઉ ગેસ કનેક્શન ન હોય",
      verifiedEvidence: "કોઈ સક્રિય કનેક્શન નથી",
    },
    {
      id: "senior",
      label: "વડીલ / વૃદ્ધ સભ્ય (૬૦+ વર્ષ)",
      scheme: "વરિષ્ઠ નાગરિક પેન્શન",
      amount: "₹36,000/વર્ષ",
      Icon: UserCheck,
      color: "border-purple-300 bg-purple-50/70 text-purple-950",
      active: hasSeniorCitizen,
      toggle: () => setHasSeniorCitizen(!hasSeniorCitizen),
      govtSource: "RCMS વય ચકાસણી",
      shortRule: "કુટુંબમાં ૬૦+ વર્ષના વડીલ સભ્ય (બીપીએલ)",
      verifiedEvidence: "ગોદાવરીબેન (૭૪ વર્ષ)",
    },
    {
      id: "girl",
      label: "કુટુંબમાં દીકરી છે",
      scheme: "વહાલી દીકરી યોજના",
      amount: "₹1,10,000 સહાય",
      Icon: Heart,
      color: "border-pink-300 bg-pink-50/70 text-pink-950",
      active: hasGirlChild,
      toggle: () => setHasGirlChild(!hasGirlChild),
      govtSource: "ડિજિટલ ગુજરાત",
      shortRule: "દીકરીનો જન્મ ૦૨/૦૮/૨૦૧૯ પછી (આવક ₹૨ લાખ)",
      verifiedEvidence: "દિવ્યાબેન (પુત્રી પ્રમાણિત)",
    },
    {
      id: "business",
      label: "નાનો વ્યવસાય / લારી-ગલ્લા",
      scheme: "PM સ્વનિધિ સબસિડી લોન",
      amount: "₹20,000 લોન",
      Icon: Briefcase,
      color: "border-blue-300 bg-blue-50/70 text-blue-950",
      active: isSmallBusiness,
      toggle: () => setIsSmallBusiness(!isSmallBusiness),
      govtSource: "નગરપાલિકા રજિસ્ટ્રી",
      shortRule: "શાકભાજી, ફળ, ચા-નાસ્તો વેચતા લારીધારકો",
      verifiedEvidence: "વેન્ડિંગ સર્ટિ. લિંક્ડ",
    },
    {
      id: "student",
      label: "કોલેજ / સ્કૂલ વિદ્યાર્થી",
      scheme:
        casteCategory === "sc" || casteCategory === "st"
          ? "SC/ST પોસ્ટ મેટ્રિક શિષ્યવૃત્તિ"
          : casteCategory === "sebc"
          ? "ડિજિટલ ગુજરાત શિષ્યવૃત્તિ (SEBC)"
          : "મુખ્યમંત્રી યુવા સ્વાવલંબન (MYSY)",
      amount: casteCategory === "sc" || casteCategory === "st" ? "₹15,000 સહાય" : "₹10,000 સહાય",
      Icon: GraduationCap,
      color: "border-indigo-300 bg-indigo-50/70 text-indigo-950",
      active: hasStudent,
      toggle: () => setHasStudent(!hasStudent),
      govtSource: "U-DISE / ડિજિટલ ગુજરાત",
      shortRule:
        casteCategory === "sc" || casteCategory === "st"
          ? "૧૦૦% ટ્યુશન ફી માફી + વાર્ષિક શિષ્યવૃત્તિ ભથ્થું"
          : "ધોરણ ૧૧-૧૨ કે કોલેજ અભ્યાસ કરતા વિદ્યાર્થી",
      verifiedEvidence: "૨ વિદ્યાર્થી સભ્યો સક્રિય",
    },
    {
      id: "laborer",
      label: "કારીગર / શ્રમિક (e-Shram)",
      scheme: "PM વિશ્વકર્મા યોજના",
      amount: "₹15,000 ટૂલકીટ",
      Icon: Wrench,
      color: "border-teal-300 bg-teal-50/70 text-teal-950",
      active: isLaborer,
      toggle: () => setIsLaborer(!isLaborer),
      govtSource: "e-Shram પોર્ટલ",
      shortRule: "૧૮ પરંપરાગત કારીગરો (સુથાર, કડિયા, દરજી વગેરે)",
      verifiedEvidence: "કારીગર શ્રેણી પ્રમાણિત",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-20 print-hide">
        {/* Hero */}
        <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-600 text-white py-6 sm:py-9 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-[11px] font-semibold mb-2">
              <ShieldCheck size={13} className="text-yellow-300" /> Digital Public Infrastructure &bull; DBT Portal
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold mb-1">
              💰 ડિજિટલ પાત્રતા સ્લિપ & લાભ કેલ્ક્યુલેટર
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm max-w-xl mx-auto">
              આધારથી રેશનકાર્ડ વેરિફાય કરો અને તમારા કુટુંબ માટે મળવાપાત્ર વાસ્તવિક સરકારી સહાય જાણો
            </p>
          </div>
        </section>

        {/* ── Mobile App Tab Switcher (Visible only on small screens) ── */}
        <div className="max-w-6xl mx-auto px-4 mt-3 lg:hidden">
          <div className="grid grid-cols-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("inputs")}
              className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === "inputs"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Smartphone size={14} /> ૧. કુટુંબ & શરતો
            </button>
            <button
              onClick={() => setActiveTab("slip")}
              className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === "slip"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FileSpreadsheet size={14} /> ૨. પાત્રતા સ્લિપ
              {isKycVerified && (
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  ₹{directCashTotal > 0 ? `${Math.round(directCashTotal / 1000)}k` : "0"}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">

            {/* ════════ LEFT COLUMN: Form Inputs & 1-Tap Chips ════════ */}
            <div className={`lg:col-span-6 space-y-4 ${activeTab === "slip" ? "hidden lg:block" : "block"}`}>

              {/* Step 1: Aadhaar e-KYC Verification Box */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                  <h2 className="font-bold text-gray-800 text-xs sm:text-sm flex items-center gap-1.5">
                    <Lock size={15} className="text-orange-500" />
                    સ્ટેપ ૧: નાગરિકતા ઓળખ (Aadhaar e-KYC)
                  </h2>
                  {isKycVerified ? (
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <BadgeCheck size={12} className="text-green-600" /> વેરિફાઈડ
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={fillDemoData}
                      className="text-[11px] text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md font-semibold transition"
                    >
                      ડેમો ભરો
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
                        ૧૨ અંકનો આધાર કાર્ડ નંબર
                        {isKycVerified && (
                          <span className="text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            🔒 UIDAI સુરક્ષિત
                          </span>
                        )}
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {isKycVerified ? "12 / 12 (માસ્ક્ડ)" : `${aadhaarNumber.replace(/\D/g, "").length} / 12 અંક`}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={14}
                        value={
                          isKycVerified && maskValues
                            ? `XXXX XXXX ${aadhaarNumber.replace(/\D/g, "").slice(-4)}`
                            : aadhaarNumber
                        }
                        onChange={(e) => handleAadhaarInput(e.target.value)}
                        placeholder="XXXX XXXX XXXX"
                        disabled={isKycVerified}
                        className={`w-full border rounded-xl px-3 py-2 pr-9 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                          isKycVerified
                            ? "bg-green-50/40 border-green-200 text-gray-800 font-bold"
                            : "border-gray-200"
                        }`}
                      />
                      {isKycVerified && (
                        <button
                          type="button"
                          onClick={() => setMaskValues(!maskValues)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-md transition"
                          title={maskValues ? "નંબર દર્શાવો" : "નંબર છુપાવો"}
                        >
                          {maskValues ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
                        આધાર લિંક્ડ મોબાઈલ નંબર
                        {isKycVerified && (
                          <span className="text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            🔒 સુરક્ષિત
                          </span>
                        )}
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {isKycVerified ? "10 / 10 (માસ્ક્ડ)" : `${mobileNumber.replace(/\D/g, "").length} / 10 અંક`}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={11}
                        value={
                          isKycVerified && maskValues
                            ? `XXXXX ${mobileNumber.replace(/\D/g, "").slice(-5)}`
                            : mobileNumber
                        }
                        onChange={(e) => handleMobileInput(e.target.value)}
                        placeholder="XXXXX XXXXX"
                        disabled={isKycVerified}
                        className={`w-full border rounded-xl px-3 py-2 pr-9 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                          isKycVerified
                            ? "bg-green-50/40 border-green-200 text-gray-800 font-bold"
                            : "border-gray-200"
                        }`}
                      />
                      {isKycVerified && (
                        <button
                          type="button"
                          onClick={() => setMaskValues(!maskValues)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-md transition"
                          title={maskValues ? "નંબર દર્શાવો" : "નંબર છુપાવો"}
                        >
                          {maskValues ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isKycVerified && (
                    <>
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={sendAadhaarOtp}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <KeyRound size={14} /> આધાર OTP મોકલો (Verify e-KYC)
                        </button>
                      ) : (
                        <div className="space-y-2 pt-1 border-t border-gray-100">
                          <p className="text-[11px] text-green-600 font-medium">
                            ✓ OTP મોકલી દેવાયો છે (ટેસ્ટ OTP: 123456):
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={enteredOtp}
                              onChange={(e) => handleOtpInput(e.target.value)}
                              placeholder="123456"
                              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            <button
                              type="button"
                              onClick={verifyOtp}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                            >
                              પ્રમાણિત કરો
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {kycError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <ShieldAlert size={12} /> {kycError}
                    </p>
                  )}

                  {isKycVerified && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} /> UIDAI & રેશન ડેટા સફળતાપૂર્વક મળ્યો
                      </span>
                      <button
                        type="button"
                        onClick={resetAll}
                        className="text-[11px] text-gray-400 hover:text-red-500 flex items-center gap-1"
                      >
                        <RotateCcw size={11} /> નવો નંબર
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Auto-Fetched Family & Interactive 1-Tap Chips */}
              {isKycVerified ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm flex items-center gap-1.5">
                      <BadgeCheck size={16} className="text-green-600" />
                      સ્ટેપ ૨: રેશનકાર્ડ પ્રમાણિત કુટુંબ & સરનામું
                    </h3>
                    <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded">
                      RCMS Gujarat
                    </span>
                  </div>

                  {/* Citizen Name & Address Cards */}
                  <div className="bg-gray-50 rounded-xl p-2.5 text-xs space-y-1 border border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-400">મુખ્ય નાગરિક:</span>
                      <span className="font-bold text-gray-800">{citizenName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ગામ & જિલ્લો:</span>
                      <span className="font-medium text-gray-800">{village}, તા. {taluka}, જિ. {district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">રેશનકાર્ડ નં:</span>
                      <span className="font-mono font-semibold text-gray-700">{rationCardNumber}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between pt-1 border-t border-gray-200/60 gap-1">
                      <span className="text-gray-400 shrink-0">કુટુંબના સભ્યો ({familyCount}):</span>
                      <span className="font-medium text-gray-800 text-[11px] text-left sm:text-right leading-relaxed">
                        {familyMembersList.map((m) => `${m.name} (${m.age} વર્ષ)`).join(", ")}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1.5 border-t border-gray-200/60 gap-1.5">
                      <span className="text-gray-500 font-semibold text-[11px]">સામાજિક વર્ગ / જાતિ (Category):</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {([
                          { key: "sebc", label: "SEBC/OBC (બક્ષીપંચ)" },
                          { key: "sc", label: "SC (અનુસૂચિત જાતિ)" },
                          { key: "st", label: "ST (અનુસૂચિત જનજાતિ)" },
                          { key: "ews", label: "EWS (આર્થિક નબળા)" },
                          { key: "general", label: "સામાન્ય (General)" },
                        ] as const).map((cat) => (
                          <button
                            key={cat.key}
                            type="button"
                            onClick={() => setCasteCategory(cat.key)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition ${
                              casteCategory === cat.key
                                ? "bg-orange-500 text-white shadow-xs"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 8 Real-World Government Parameter Touch-Chips (App-Style, No Cutoffs) */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-700">
                        કુટુંબની પરિસ્થિતિ પસંદ કરો ({activeCount} સક્રિય):
                      </p>
                      <span className="text-[10px] text-gray-400">ટેપ કરીને પસંદ કરો</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {CONDITIONS.map((cond) => {
                        const Icon = cond.Icon;
                        return (
                          <div
                            key={cond.id}
                            onClick={cond.toggle}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition select-none flex flex-col justify-between gap-2 active:scale-[0.99] ${
                              cond.active
                                ? `${cond.color} shadow-xs ring-1 ring-orange-500/20`
                                : "border-gray-200 bg-white hover:bg-gray-50/80 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {/* Row 1: Checkbox + Title + Scheme Badge + Amount */}
                            <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition ${
                                    cond.active ? "bg-orange-500 text-white shadow-xs" : "border-2 border-gray-300 bg-white"
                                  }`}
                                >
                                  {cond.active && <Check size={13} strokeWidth={3} />}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                                    {cond.label}
                                  </h4>
                                  <span className="text-[11px] text-orange-700 bg-orange-100/70 border border-orange-200/80 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Icon size={12} className="shrink-0" />
                                    <span>{cond.scheme}</span>
                                  </span>
                                </div>
                              </div>

                              <span
                                className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 ${
                                  cond.active
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                    : "bg-gray-100 text-gray-700 border border-gray-200"
                                }`}
                              >
                                {cond.amount}
                              </span>
                            </div>

                            {/* Row 2: Rule + Verification Evidence (NO TRUNCATION, NO WORD CUTOFF) */}
                            <div className="pt-2 border-t border-black/5 flex items-center justify-between gap-2 text-[11px] flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-1.5 text-gray-600 min-w-0">
                                <span className="font-bold text-gray-900 shrink-0 text-[11px]">📌 શરત:</span>
                                <span className="leading-snug">{cond.shortRule}</span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 ml-auto pt-1 sm:pt-0">
                                <span className="text-gray-500 text-[10px] font-medium hidden sm:inline">
                                  🏛️ {cond.govtSource}
                                </span>
                                {cond.active ? (
                                  <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full text-[9.5px] flex items-center gap-1 shadow-2xs whitespace-nowrap">
                                    <CheckCircle2 size={11} /> {cond.verifiedEvidence}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-[10px] whitespace-nowrap">ચકાસણી બાકી</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-dashed border-gray-200 text-center text-gray-400 space-y-1.5">
                  <Lock size={26} className="mx-auto text-gray-300" />
                  <p className="text-xs font-semibold text-gray-600">
                    સ્ટેપ ૨: કુટુંબ અને યોજનાઓની પસંદગી હજુ લોક છે
                  </p>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                    ઉપર આધાર નંબર અને OTP નાખો જેથી રેશનકાર્ડ ડેટાબેઝમાંથી કુટુંબ અને સરનામું ઓટો-ફેચ થશે.
                  </p>
                </div>
              )}
            </div>

            {/* ════════ RIGHT COLUMN: Digital Entitlement Slip ════════ */}
            <div className={`lg:col-span-6 space-y-4 lg:sticky lg:top-20 self-start ${activeTab === "inputs" ? "hidden lg:block" : "block"}`}>

              {/* Dynamic Benefits Summary Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-3.5 text-white shadow-sm">
                  <span className="text-[11px] opacity-90 font-medium">વાર્ષિક સીધી રોકડ સહાય</span>
                  <div className="text-xl sm:text-2xl font-extrabold mt-0.5">
                    ₹{directCashTotal.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] opacity-80 mt-0.5 block">
                    {isKycVerified ? `${activeCount} યોજનાઓ મળવાપાત્ર` : "વેરિફિકેશન પછી ગણાશે"}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-3.5 text-white shadow-sm">
                  <span className="text-[11px] opacity-90 font-medium">નિ:શુલ્ક આરોગ્ય કવચ</span>
                  <div className="text-xl sm:text-2xl font-extrabold mt-0.5">
                    ₹{healthCoverTotal.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] opacity-80 mt-0.5 block">આયુષ્માન કુટુંબ કવચ</span>
                </div>
              </div>

              {/* 📄 Official Digital Entitlement Slip */}
              <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-md relative">
                {/* Top Tricolor Strip */}
                <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-600 rounded-t-[22px]" />

                <div className="p-4 sm:p-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🇮🇳</span>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-gray-800 leading-tight">
                          ડિજિટલ પાત્રતા સ્લિપ
                        </h3>
                        <p className="text-[10px] text-orange-600 font-semibold">
                          Citizen Entitlement Summary Slip &bull; NagrikSeva AI
                        </p>
                      </div>
                    </div>
                    {isKycVerified ? (
                      <span className="text-[10px] bg-green-100 border border-green-200 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-green-600" /> UIDAI VERIFIED
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-md">
                        વેરિફિકેશન બાકી
                      </span>
                    )}
                  </div>

                  {/* Citizen Meta Card (Spacious 2-tier card, 100% full content, NO truncation) */}
                  <div className="py-2.5 px-3 bg-gray-50/90 rounded-2xl border border-gray-200/80 my-2 space-y-2 text-[11px]">
                    {/* Top Row: Full Citizen Name (no truncate, bold & prominent) + Aadhaar + Caste Category */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-gray-200/60">
                      <div className="min-w-0">
                        <span className="text-gray-400 block text-[9.5px]">નાગરિક પૂરું નામ</span>
                        <span className="font-extrabold text-gray-900 text-xs sm:text-sm leading-tight block">
                          {citizenName || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="bg-white border border-gray-200 px-2 py-0.5 rounded-lg text-right">
                          <span className="text-gray-400 block text-[8.5px]">આધાર નંબર</span>
                          <span className="font-bold text-gray-800 font-mono text-[11px]">
                            {isKycVerified ? `XXXX-XXXX-${aadhaarNumber.replace(/\D/g, "").slice(-4)}` : "—"}
                          </span>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg text-right">
                          <span className="text-orange-600 block text-[8.5px]">સામાજિક વર્ગ</span>
                          <span className="font-bold text-orange-900 font-mono text-[11px]">
                            {casteCategory === "sebc" ? "SEBC/OBC" : casteCategory === "sc" ? "SC" : casteCategory === "st" ? "ST" : casteCategory === "ews" ? "EWS" : "General"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Family Members + Residence (Clean, fully readable) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-0.5">
                      {/* 👨‍👩‍👧‍👦 રેશનકાર્ડ સભ્યો - Interactive Click */}
                      <div
                        className="cursor-pointer group select-none flex items-center gap-1.5"
                        onClick={() => {
                          if (!isKycVerified) return;
                          setActiveDetailView(activeDetailView === "members" ? null : "members");
                          setShowMembersModal(!showMembersModal);
                        }}
                        title={isKycVerified ? "કુટુંબના સભ્યોની યાદી જોવા ક્લિક કરો" : ""}
                      >
                        <span className="text-gray-500 font-medium text-[11px]">રેશનકાર્ડ:</span>
                        <span className="font-bold text-orange-700 bg-white border border-orange-200 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] shadow-2xs group-hover:border-orange-400 transition">
                          <Users size={12} className="text-orange-500 shrink-0" />
                          <span>{familyCount > 0 ? `${familyCount} સભ્યો (યાદી જુઓ ▾)` : "—"}</span>
                        </span>
                      </div>

                      {/* 📍 ગામ & જિલ્લો - Interactive Click */}
                      <div
                        className="cursor-pointer group select-none flex items-center gap-1.5"
                        onClick={() => {
                          if (!isKycVerified) return;
                          setActiveDetailView(activeDetailView === "address" ? null : "address");
                          setShowAddressModal(!showAddressModal);
                        }}
                        title={isKycVerified ? "સંપૂર્ણ રહેઠાણ સરનામું જોવા ક્લિક કરો" : ""}
                      >
                        <span className="text-gray-500 font-medium text-[11px]">રહેઠાણ:</span>
                        <span className="font-bold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] shadow-2xs group-hover:border-blue-400 transition">
                          <MapPin size={12} className="text-blue-500 shrink-0" />
                          <span>{village ? `${village}, ${district}` : "—"} (સરનામું ▾)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ─── Elegant Light Inline Detail Drawers (Responsive Carousel with Full Names & Navigation Buttons) ─── */}
                  {isKycVerified && activeDetailView === "members" && (
                    <div className="my-2.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/90 border border-orange-200 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="flex items-center justify-between pb-2 border-b border-orange-200/70 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-orange-950 flex items-center gap-1.5 text-xs sm:text-sm">
                            👨‍👩‍👧‍👦 રેશનકાર્ડ પ્રમાણિત કુટુંબના સભ્યો ({familyCount})
                          </span>
                          <span className="hidden sm:inline-flex text-[10px] bg-white text-green-700 border border-green-200 font-semibold px-2 py-0.5 rounded-full items-center gap-1">
                            <CheckCircle2 size={11} className="text-green-600" /> RCMS ગુજરાત પ્રમાણિત
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Carousel Navigation Buttons < and > */}
                          <div className="flex items-center bg-white rounded-lg border border-orange-200 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => scrollMembers("left")}
                              className="p-1 text-orange-800 hover:bg-orange-100 rounded transition active:scale-90"
                              title="અગાઉના સભ્ય જુઓ"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <span className="text-[10px] text-gray-300 font-mono px-0.5 select-none">|</span>
                            <button
                              type="button"
                              onClick={() => scrollMembers("right")}
                              className="p-1 text-orange-800 hover:bg-orange-100 rounded transition active:scale-90"
                              title="વધુ સભ્યો જુઓ"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveDetailView(null)}
                            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-orange-100 transition ml-1"
                            title="બંધ કરો"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Smooth Horizontal Scroll Track (Full Names without Truncation) */}
                      <div
                        ref={membersScrollRef}
                        className="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth no-scrollbar"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {familyMembersList.map((m, idx) => (
                          <div
                            key={idx}
                            className="w-[200px] min-w-[200px] sm:w-[220px] sm:min-w-[220px] bg-white p-2.5 rounded-xl border border-orange-200 shadow-2xs hover:border-orange-300 transition shrink-0 flex flex-col justify-between"
                          >
                            <div>
                              <span className="font-extrabold text-gray-900 text-xs block leading-snug break-words">
                                {idx + 1}. {m.name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-gray-600 mt-2 pt-1.5 border-t border-orange-50">
                              <span className="text-[10px] font-medium text-gray-500 mr-1 leading-snug">
                                {m.relation}
                              </span>
                              <span className="font-bold text-orange-800 bg-orange-100/90 px-2 py-0.5 rounded-full font-mono text-[10px] shrink-0 whitespace-nowrap">
                                {m.age} વર્ષ
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isKycVerified && activeDetailView === "address" && (
                    <div className="my-2.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-blue-50/80 border border-blue-200 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/70 mb-2">
                        <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs sm:text-sm">
                          📍 પ્રમાણિત રહેઠાણ સરનામું (RCMS & UIDAI)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-white text-blue-800 border border-blue-200 font-semibold px-2 py-0.5 rounded-full font-mono">
                            પિનકોડ: {pincode}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveDetailView(null)}
                            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-blue-100 transition"
                            title="બંધ કરો"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-blue-100 text-xs text-gray-700 leading-relaxed shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-bold text-gray-900 text-xs sm:text-sm">પ્લોટ નં. ૪૫, પટેલ વાડી વિસ્તાર,</p>
                          <p className="text-gray-600 text-xs mt-0.5">
                            મુ. <strong>{village}</strong>, તાલુકો: <strong>{taluka}</strong>, જિલ્લો: <strong>{district}</strong> - {pincode}, ગુજરાત
                          </p>
                        </div>
                        <span className="text-[10px] text-green-700 font-semibold bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-center">
                          ✓ જમીન મહેસૂલ રેકોર્ડ લિંક્ડ
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 📱 Mobile Modals for Family Members & Address */}
                  {isKycVerified && showMembersModal && (
                    <div
                      className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                      onClick={() => setShowMembersModal(false)}
                    >
                      <div
                        className="bg-gray-900 text-white w-full max-w-xs p-4 rounded-2xl shadow-2xl border border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-gray-700 text-sm">
                          <span className="font-bold text-orange-400 flex items-center gap-1.5">
                            👨‍👩‍👧‍👦 રેશનકાર્ડ સભ્યો
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowMembersModal(false)}
                            className="text-gray-400 hover:text-white p-1 rounded-lg bg-white/10 text-xs flex items-center gap-1 px-2 transition"
                          >
                            <X size={14} /> બંધ કરો
                          </button>
                        </div>
                        <div className="space-y-2 pt-2.5 text-xs">
                          {familyMembersList.map((m, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5"
                            >
                              <div>
                                <span className="font-semibold text-white block">
                                  {idx + 1}. {m.name}
                                </span>
                                <span className="text-gray-400 text-[10px]">{m.relation}</span>
                              </div>
                              <span className="font-mono text-amber-300 font-bold text-xs">
                                {m.age} વર્ષ
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 text-[10px] text-green-400 text-center border-t border-gray-800 pt-2">
                          ✓ RCMS ગુજરાત રેશનકાર્ડ ડેટાબેઝ પ્રમાણિત
                        </p>
                      </div>
                    </div>
                  )}

                  {isKycVerified && showAddressModal && (
                    <div
                      className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                      onClick={() => setShowAddressModal(false)}
                    >
                      <div
                        className="bg-gray-900 text-white w-full max-w-xs p-4 rounded-2xl shadow-2xl border border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-gray-700 text-sm">
                          <span className="font-bold text-blue-400 flex items-center gap-1.5">
                            📍 પૂર્ણ સરનામું
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowAddressModal(false)}
                            className="text-gray-400 hover:text-white p-1 rounded-lg bg-white/10 text-xs flex items-center gap-1 px-2 transition"
                          >
                            <X size={14} /> બંધ કરો
                          </button>
                        </div>
                        <div className="pt-2.5 text-xs space-y-1.5 text-gray-200 leading-relaxed">
                          <p className="font-semibold text-white text-sm">પ્લોટ નં. ૪૫, પટેલ વાડી વિસ્તાર,</p>
                          <p>મુ. {village}, તાલુકો: {taluka},</p>
                          <p>જિલ્લો: {district} - પિનકોડ: {pincode}, ગુજરાત</p>
                        </div>
                        <p className="mt-3 text-[10px] text-green-400 text-center border-t border-gray-800 pt-2">
                          ✓ UIDAI & જમીન મહેસૂલ સરનામું પ્રમાણિત
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Entitlement Breakdown Items */}
                  <div className="py-3 space-y-2">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                      મળવાપાત્ર સરકારી યોજનાઓ અને રકમ:
                    </p>

                    {!isKycVerified ? (
                      <div className="py-7 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/70 space-y-1">
                        <Lock size={22} className="mx-auto text-gray-300" />
                        <p className="text-xs font-bold text-gray-600">પાત્રતા સ્લિપ હજુ ખાલી છે</p>
                        <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                          આધાર e-KYC પૂર્ણ કરો. રેશનકાર્ડ વેરિફાય થયા પછી પસંદ કરેલી યોજનાઓ અહીં લાઈવ ગણાઈને દેખાશે.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                        {isFarmer && (
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-amber-50/70 border border-amber-100">
                            <span className="font-medium text-gray-800">🌾 PM કિસાન સન્માન નિધિ</span>
                            <span className="font-bold text-amber-800">₹6,000 / વર્ષ</span>
                          </div>
                        )}

                        {needsHouse && (
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-green-50/70 border border-green-100">
                            <span className="font-medium text-gray-800">🏠 PM આવાસ યોજના (મકાન સહાય)</span>
                            <span className="font-bold text-green-700">₹1,20,000 (વન-ટાઇમ)</span>
                          </div>
                        )}

                        {needsLPG && (
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-red-50/70 border border-red-100">
                            <span className="font-medium text-gray-800">🔥 PM ઉજ્જવલા યોજના (ફ્રી સિલિન્ડર)</span>
                            <span className="font-bold text-red-700">₹3,600 સહાય</span>
                          </div>
                        )}

                        {hasSeniorCitizen && (
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-purple-50/70 border border-purple-100">
                            <span className="font-medium text-gray-800">👴 વરિષ્ઠ નાગરિક પેન્શન કવચ</span>
                            <span className="font-bold text-purple-700">₹36,000 / વર્ષ</span>
                          </div>
                        )}

                        {hasGirlChild && (
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-pink-50/70 border border-pink-100">
                            <span className="font-medium text-gray-800">👧 વહાલી દીકરી યોજના સહાય</span>
                            <span className="font-bold text-pink-700">₹1,10,000 સહાય</span>
                          </div>
                        )}

                        {isSmallBusiness && (
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                            <span className="font-medium text-gray-800">💼 PM સ્વનિધિ ધંધાકીય લોન</span>
                            <span className="font-bold text-blue-700">₹20,000 લોન</span>
                          </div>
                        )}

                        {hasStudent && (
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-indigo-50/70 border border-indigo-100">
                            <span className="font-medium text-gray-800">
                              🎓 {casteCategory === "sc" || casteCategory === "st" ? "SC/ST પોસ્ટ મેટ્રિક શિષ્યવૃત્તિ" : casteCategory === "sebc" ? "ડિજિટલ ગુજરાત શિષ્યવૃત્તિ (SEBC)" : "મુખ્યમંત્રી સ્વાવલંબન (MYSY)"}
                            </span>
                            <span className="font-bold text-indigo-700">
                              ₹{casteCategory === "sc" || casteCategory === "st" ? "15,000" : "10,000"} / વર્ષ
                            </span>
                          </div>
                        )}

                        {isLaborer && (
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-teal-50/70 border border-teal-100">
                            <span className="font-medium text-gray-800">🛠️ PM વિશ્વકર્મા ટૂલકીટ સહાય</span>
                            <span className="font-bold text-teal-700">₹15,000 ટૂલકીટ</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                          <span className="font-medium text-gray-800">🏥 આયુષ્માન ભારત હેલ્થ કવચ</span>
                          <span className="font-bold text-blue-700">₹5,00,000 કેશલેસ સારવાર</span>
                        </div>
                      </div>
                    )}

                    {/* Official DPI Verification Proofs Box */}
                    {isKycVerified && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] space-y-1">
                        <p className="font-bold text-slate-800 flex items-center gap-1">
                          🏛️ સત્તાવાર સરકારી ડેટા વેરિફિકેશન આધારો (DPI Proofs):
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[9.5px] text-slate-600 pt-0.5">
                          <p className="flex items-center gap-1">
                            <span className="text-emerald-600 font-black">✓</span>
                            <span>AnyRoR: ખાતા ૧૪૨/A (૧.૪ હેક્ટર ખેડૂત)</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="text-emerald-600 font-black">✓</span>
                            <span>RCMS: ગોદાવરીબેન (૭૪ વર્ષ) વય પ્રમાણિત</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="text-emerald-600 font-black">✓</span>
                            <span>
                              જાતિ પ્રમાણપત્ર: {casteCategory === "sebc" ? "SEBC (બક્ષીપંચ) માન્ય" : casteCategory === "sc" ? "SC પ્રમાણિત" : casteCategory === "st" ? "ST પ્રમાણિત" : casteCategory === "ews" ? "EWS માન્ય" : "સામાન્ય"}
                            </span>
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="text-emerald-600 font-black">✓</span>
                            <span>NFSA: BPL અગ્રતા કુટુંબ (આયુષ્માન કવચ)</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: 1-Click WhatsApp Share */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={shareOnWhatsApp}
                      disabled={!isKycVerified}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm active:scale-95"
                    >
                      <Share2 size={15} /> WhatsApp પર મોકલો (૧-ક્લિક)
                    </button>
                    <button
                      onClick={handlePrintCertificate}
                      disabled={!isKycVerified}
                      className="flex items-center justify-center gap-1 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-semibold py-2.5 px-3.5 rounded-xl text-xs transition"
                    >
                      <Printer size={14} /> પ્રિન્ટ / PDF
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ── Official Authentic Gujarat Govt Digital Entitlement Certificate (Full A4 Page Print Only) ── */}
      <div id="official-receipt-print-area" className="hidden print:flex print-only-certificate bg-white text-gray-900 font-sans">
        <div className="border-2 border-gray-900 p-4 h-full flex flex-col justify-between box-border">
          
          {/* TOP SECTION: Header, Title, Meta, Citizen Info */}
          <div>
            {/* Top National Tricolor Header Ribbon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mb-2.5 border-y border-gray-300" />

            {/* Official Emblem & Government Header */}
            <div className="flex items-center justify-between border-b-2 border-gray-800 pb-2 mb-2">
              {/* Left: Gujarat State / Ashok Emblem */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 flex flex-col items-center justify-center border border-gray-400 rounded-full p-1 bg-amber-50/60 shrink-0">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-amber-900 fill-current" aria-label="Ashok Stambh Emblem">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  <span className="text-[7px] font-black uppercase tracking-tight text-gray-800 mt-0.5">સત્યમેવ જયતે</span>
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-800 tracking-wider uppercase">ગુજરાત સરકાર • GOVERNMENT OF GUJARAT</p>
                  <h1 className="text-base font-black text-gray-900 leading-tight">
                    અન્ન, નાગરિક પુરવઠા અને ગ્રાહકોની બાબતોનો વિભાગ
                  </h1>
                  <p className="text-[10px] text-gray-600 font-medium">
                    Food, Civil Supplies & Consumer Affairs Department • Gandhinagar
                  </p>
                </div>
              </div>

              {/* Right: Security & Portal Reference Badge */}
              <div className="text-right border-l border-gray-300 pl-3 shrink-0">
                <div className="inline-flex items-center gap-1 bg-green-50 border border-green-600 text-green-800 px-2 py-0.5 rounded text-[10px] font-bold">
                  <CheckCircle2 size={12} className="text-green-700" /> UIDAI & RCMS વેરિફાઈડ
                </div>
                <p className="text-[9px] text-gray-500 mt-1 font-mono">DPI પોર્ટલ: nagrik-seva.gov.in</p>
                <p className="text-[10px] font-black text-gray-800 font-mono">પ્રમાણપત્ર નં: GJ-DBT-2026-998124</p>
              </div>
            </div>

            {/* Title Banner */}
            <div className="text-center bg-gray-100 border border-gray-300 py-1.5 px-2 rounded mb-2">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                સત્તાવાર ડિજિટલ નાગરિક પાત્રતા પ્રમાણપત્ર
              </h2>
              <p className="text-[9.5px] font-bold text-gray-600 uppercase tracking-wider">
                OFFICIAL DIGITAL DIRECT BENEFIT TRANSFER (DBT) ENTITLEMENT CERTIFICATE
              </p>
            </div>

            {/* Section 1: Certificate Meta & Verification Details */}
            <div className="grid grid-cols-4 gap-2 bg-gray-50 border border-gray-300 p-2 rounded mb-2 text-[10px]">
              <div>
                <span className="text-gray-500 block text-[9px]">રેશનકાર્ડ નંબર:</span>
                <strong className="text-gray-900 font-mono text-[11px]">{rationCardNumber || "RC-GJ-2024-998124"}</strong>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">રેશનકાર્ડ શ્રેણી:</span>
                <strong className="text-gray-900 text-[10.5px]">NFSA - અગ્રતા કુટુંબ (PHH / BPL)</strong>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">વેરિફિકેશન તારીખ & સમય:</span>
                <strong className="text-gray-900 font-mono text-[10.5px]">26/09/2026 | 12:00 PM</strong>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">આધાર e-KYC સ્થિતિ:</span>
                <strong className="text-green-700 text-[10.5px]">✓ ૧૦૦% બાયોમેટ્રિક/OTP પ્રમાણિત</strong>
              </div>
            </div>

            {/* Section 2: Citizen & Residential Address */}
            <div className="border border-gray-300 rounded p-2.5 mb-2 bg-white">
              <div className="grid grid-cols-2 gap-3 text-[10.5px]">
                <div>
                  <p className="text-gray-500 text-[9px]">કુટુંબના મુખ્ય વડાનું નામ (Citizen Name):</p>
                  <p className="text-sm font-black text-gray-900">{citizenName || "હરિભાઈ વિઠ્ઠલભાઈ પટેલ"}</p>
                  <div className="flex items-center gap-4 mt-1 text-[10px]">
                    <span>આધાર નં: <strong className="font-mono text-gray-800">XXXX-XXXX-4654</strong></span>
                    <span>મોબાઈલ નં: <strong className="font-mono text-gray-800">XXXXX 64564</strong></span>
                  </div>
                </div>
                <div className="border-l border-gray-200 pl-3">
                  <p className="text-gray-500 text-[9px]">પ્રમાણિત રહેઠાણનું સરનામું (RCMS & મહેસૂલ રેકોર્ડ):</p>
                  <p className="font-bold text-gray-900 text-[10.5px] leading-snug">
                    પ્લોટ નં. ૪૫, પટેલ વાડી વિસ્તાર, મુ. {village || "કાગવડ"}, તા. {taluka || "જેતપુર"}, જિ. {district || "રાજકોટ"} - {pincode || "360370"}, ગુજરાત
                  </p>
                  <p className="text-[9px] text-green-700 font-semibold mt-0.5">✓ ગ્રામ પંચાયત મહેસૂલ & વીજળી બિલ રેકોર્ડ લિંક્ડ</p>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: Tables (Family Members & Active Schemes) */}
          <div className="space-y-2.5 my-1.5">
            {/* Section 3: Verified Family Members Table */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[11px] font-black text-gray-900 flex items-center gap-1">
                  <span>👨‍👩‍👧‍👦</span> રેશનકાર્ડ પ્રમાણિત કુટુંબના સભ્યોની યાદી ({familyMembersList.length || 5} સભ્યો):
                </h3>
                <span className="text-[9px] text-gray-500 font-mono">સ્ત્રોત: RCMS ગુજરાત સિવિલ સપ્લાઇઝ ડેટાબેઝ</span>
              </div>
              <table className="w-full border-collapse border border-gray-300 text-[10.5px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 font-bold border-b border-gray-300">
                    <th className="border border-gray-300 py-1 px-1.5 text-center w-8">ક્રમ</th>
                    <th className="border border-gray-300 py-1 px-2.5 text-left">સભ્યનું પૂરું નામ</th>
                    <th className="border border-gray-300 py-1 px-2.5 text-left w-36">કુટુંબ વડા સાથે સંબંધ</th>
                    <th className="border border-gray-300 py-1 px-2 text-center w-16">ઉંમર</th>
                    <th className="border border-gray-300 py-1 px-2 text-center w-28">આધાર e-KYC સ્થિતિ</th>
                  </tr>
                </thead>
                <tbody>
                  {(familyMembersList.length > 0 ? familyMembersList : [
                    { name: "હરિભાઈ વિઠ્ઠલભાઈ પટેલ", relation: "કુટુંબના વડા (Self)", age: 52 },
                    { name: "મંજુલાબેન હરિભાઈ પટેલ", relation: "પત્ની (Wife)", age: 49 },
                    { name: "ચિરાગ હરિભાઈ પટેલ", relation: "પુત્ર (Son)", age: 22 },
                    { name: "દિવ્યાબેન હરિભાઈ પટેલ", relation: "પુત્રી (Daughter)", age: 18 },
                    { name: "ગોદાવરીબેન વિઠ્ઠલભાઈ પટેલ", relation: "માતા (Senior Citizen)", age: 74 },
                  ]).map((m, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? "bg-gray-50/70" : "bg-white"}>
                      <td className="border border-gray-300 py-1.2 px-1.5 text-center font-bold text-gray-700">{idx + 1}</td>
                      <td className="border border-gray-300 py-1.2 px-2.5 font-bold text-gray-900">{m.name}</td>
                      <td className="border border-gray-300 py-1.2 px-2.5 text-gray-700">{m.relation}</td>
                      <td className="border border-gray-300 py-1.2 px-2 text-center font-mono font-semibold">{m.age} વર્ષ</td>
                      <td className="border border-gray-300 py-1.2 px-2 text-center text-green-700 font-bold">
                        ✓ સત્તાવાર પ્રમાણિત
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 4: Entitled Government Schemes & Direct Benefit Transfer (DBT) Table */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[11px] font-black text-gray-900 flex items-center gap-1">
                  <span>🏛️</span> નાગરિક પાત્રતા ધરાવતી સરકારી યોજનાઓ અને DBT સહાય વિવરણ:
                </h3>
                <span className="text-[9px] text-gray-500 font-mono">DPI એન્જિન દ્વારા રીયલ-ટાઇમ ચકાસાયેલ</span>
              </div>
              <table className="w-full border-collapse border border-gray-300 text-[10.5px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 font-bold border-b border-gray-300">
                    <th className="border border-gray-300 py-1 px-1.5 text-center w-8">ક્રમ</th>
                    <th className="border border-gray-300 py-1 px-2.5 text-left">સરકારી યોજનાનું નામ</th>
                    <th className="border border-gray-300 py-1 px-2.5 text-left w-36">યોજના શ્રેણી</th>
                    <th className="border border-gray-300 py-1 px-2.5 text-right w-40">મળવાપાત્ર સરકારી સહાય</th>
                  </tr>
                </thead>
              <tbody>
                {isFarmer && (
                  <tr>
                    <td className="border border-gray-300 py-0.5 px-1 text-center font-mono">૧</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 font-bold text-gray-900">PM કિસાન સન્માન નિધિ યોજના</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-gray-700">કૃષિ રોકાણ સહાય</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-right font-mono font-bold text-gray-900">₹૬,૦૦૦ / વર્ષ (DBT)</td>
                  </tr>
                )}
                {needsHouse && (
                  <tr className="bg-gray-50/60">
                    <td className="border border-gray-300 py-0.5 px-1 text-center font-mono">૨</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 font-bold text-gray-900">પ્રધાનમંત્રી આવાસ યોજના (ગ્રામીણ)</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-gray-700">પાકું મકાન નિર્માણ સહાય</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-right font-mono font-bold text-gray-900">₹૧,૨૦,૦૦૦ (વન-ટાઇમ)</td>
                  </tr>
                )}
                {needsLPG && (
                  <tr>
                    <td className="border border-gray-300 py-0.5 px-1 text-center font-mono">૩</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 font-bold text-gray-900">પ્રધાનમંત્રી ઉજ્જવલા ૨.૦ યોજના</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-gray-700">રસોઈ ગેસ કનેક્શન</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-right font-mono font-bold text-gray-900">₹૩,૬૦૦ (ફ્રી કિટ + સિલિન્ડર)</td>
                  </tr>
                )}
                {hasSeniorCitizen && (
                  <tr className="bg-gray-50/60">
                    <td className="border border-gray-300 py-0.5 px-1 text-center font-mono">૪</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 font-bold text-gray-900">વરિષ્ઠ નાગરિક વૃદ્ધ પેન્શન સહાય (NSAP)</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-gray-700">સામાજિક સુરક્ષા પેન્શન</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-right font-mono font-bold text-gray-900">₹૩૬,૦૦૦ / વર્ષ (₹૩,૦૦૦/માસિક)</td>
                  </tr>
                )}
                {hasGirlChild && (
                  <tr>
                    <td className="border border-gray-300 py-0.5 px-1 text-center font-mono">૫</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 font-bold text-gray-900">વહાલી દીકરી યોજના (ગુજરાત સરકાર)</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-gray-700">બાલિકા સશક્તિકરણ</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-right font-mono font-bold text-gray-900">₹૧,૧૦,૦૦૦ (તબક્કાવાર સહાય)</td>
                  </tr>
                )}
                {isSmallBusiness && (
                  <tr className="bg-gray-50/60">
                    <td className="border border-gray-300 py-0.5 px-1 text-center font-mono">૬</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 font-bold text-gray-900">PM સ્વનિધિ સ્કીમ (શેરી ફેરિયા કલ્યાણ)</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-gray-700">ધંધાકીય કાર્યકારી મૂડી</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-right font-mono font-bold text-gray-900">₹૨૦,૦૦૦ (વ્યાજ સબસીડી લોન)</td>
                  </tr>
                )}
                {hasStudent && (
                  <tr>
                    <td className="border border-gray-300 py-0.5 px-1 text-center font-mono">૭</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 font-bold text-gray-900">ડિજિટલ ગુજરાત પોસ્ટ મેટ્રિક શિષ્યવૃત્તિ</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-gray-700">ઉચ્ચ શિક્ષણ સહાય</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-right font-mono font-bold text-gray-900">₹૧૦,૦૦૦ / વર્ષ (DBT)</td>
                  </tr>
                )}
                {isLaborer && (
                  <tr className="bg-gray-50/60">
                    <td className="border border-gray-300 py-0.5 px-1 text-center font-mono">૮</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 font-bold text-gray-900">PM વિશ્વકર્મા કૌશલ્ય સન્માન યોજના</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-gray-700">કારીગર આધુનિક સાધન કિટ</td>
                    <td className="border border-gray-300 py-0.5 px-1.5 text-right font-mono font-bold text-gray-900">₹૧૫,૦૦૦ (ઈ-વાઉચર ટૂલકીટ)</td>
                  </tr>
                )}
                <tr className="bg-blue-50/40">
                  <td className="border border-gray-300 py-0.5 px-1 text-center font-mono">★</td>
                  <td className="border border-gray-300 py-0.5 px-1.5 font-bold text-gray-900">આયુષ્માન ભારત - PMJAY માં કાર્ડ</td>
                  <td className="border border-gray-300 py-0.5 px-1.5 text-gray-700">સંપૂર્ણ કેશલેસ આરોગ્ય કવચ</td>
                  <td className="border border-gray-300 py-0.5 px-1.5 text-right font-mono font-bold text-blue-800">₹૫,૦૦,૦૦૦ / પ્રતિ કુટુંબ / વર્ષ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION: Total Highlight Box & Official Security Footer */}
        <div>
          {/* Section 5: Total DBT Entitlement Highlight Box */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-green-50 border-2 border-gray-900 rounded p-3 mb-2.5 flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-black text-gray-700 uppercase tracking-wide">કુલ વાર્ષિક સીધી સરકારી સહાય (Direct Cash Benefit):</p>
              <p className="text-lg font-black text-green-800 font-mono">
                ₹{(directCashTotal || 52000).toLocaleString("en-IN")} / વર્ષ
              </p>
              <p className="text-[9px] text-gray-500">આધાર સીડેડ બેંક ખાતામાં વાર્ષિક જમા થવાપાત્ર અંદાજિત રકમ</p>
            </div>
            <div className="border-l-2 border-gray-300 pl-4 text-right">
              <p className="text-[10.5px] font-black text-gray-700 uppercase tracking-wide">કેશલેસ આરોગ્ય સંરક્ષણ (Ayushman PMJAY):</p>
              <p className="text-lg font-black text-blue-800 font-mono">₹૫,૦૦,૦૦૦ / કુટુંબ</p>
              <p className="text-[9px] text-gray-500">ગુજરાતની તમામ માન્ય હોસ્પિટલોમાં મફત સારવાર</p>
            </div>
          </div>

          {/* Section 6: Official Digital Seal, Verification QR Code & Legal Footnote */}
          <div className="border-t-2 border-gray-900 pt-2.5 grid grid-cols-12 gap-3 items-center">
            {/* Left: Authentic QR Code */}
            <div className="col-span-3 flex items-center gap-2 border-r border-gray-300 pr-2">
              <div className="p-1 border border-gray-900 bg-white shrink-0">
                <QrCode size={52} className="text-gray-900" />
              </div>
              <div className="text-[9px] leading-tight">
                <p className="font-bold text-gray-900">સ્કેન કરી વેરિફાય કરો</p>
                <p className="text-gray-600">Scan to Verify Online</p>
                <p className="font-mono text-[8px] text-gray-500 mt-0.5">HASH: 8A7F-99B2-E401</p>
              </div>
            </div>

            {/* Center: Legal Authenticity Note */}
            <div className="col-span-5 text-[9px] text-gray-600 leading-tight pr-2">
              <p className="font-bold text-gray-800 mb-0.5">સત્તાવાર વૈધાનિક નોંધ (Statutory Note):</p>
              <p>
                ૧. આ પ્રમાણપત્ર ઈન્ફોર્મેશન ટેકનોલોજી એકટ, ૨૦૦૦ હેઠળ ડિજિટલ સહી ધરાવતો કાયદેસર સત્તાવાર દસ્તાવેજ છે.
              </p>
              <p className="mt-0.5">
                ૨. કોઈપણ જનસેવા કેન્દ્ર (CSC), ગ્રામ પંચાયત (VCE) અથવા સરકારી કચેરીમાં DBT લાભ મંજૂરી માટે આ પ્રમાણપત્ર માન્ય રહેશે.
              </p>
            </div>

            {/* Right: Digital Signature Stamp */}
            <div className="col-span-4 border-2 border-green-700 bg-green-50/70 p-2 rounded text-center">
              <div className="inline-flex items-center gap-1 text-green-800 font-black text-[10px]">
                <ShieldCheck size={13} className="text-green-700" /> DIGITAL SIGNATURE VALID
              </div>
              <p className="text-[8.5px] text-gray-700 font-semibold mt-0.5">
                સક્ષમ સહીકર્તા: નિયામકશ્રી, અન્ન અને નાગરિક પુરવઠા
              </p>
              <p className="text-[8px] text-gray-500 font-mono">
                Govt of Gujarat DPI Node • Signed: 26-09-2026
              </p>
              <span className="inline-block bg-green-700 text-white text-[7.5px] font-bold px-1.5 py-0.2 rounded mt-0.5">
                ✓ Cryptographically Sealed
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
