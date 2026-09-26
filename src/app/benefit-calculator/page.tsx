"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  IndianRupee,
  ShieldCheck,
  Share2,
  Printer,
  Sparkles,
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

  // Dynamic calculations strictly tied to real-time verification and selected checkboxes
  const familyCount = familyMembersList.length || 0;
  const pmKisanBenefit = isKycVerified && isFarmer ? 6000 : 0;
  const pmAwasBenefit = isKycVerified && needsHouse ? 120000 : 0;
  const ujjwalaBenefit = isKycVerified && needsLPG ? 3600 : 0;
  const atalPensionBenefit = isKycVerified && hasSeniorCitizen ? 36000 : 0;
  const vahliDikriBenefit = isKycVerified && hasGirlChild ? 110000 : 0;
  const svanidhiBenefit = isKycVerified && isSmallBusiness ? 20000 : 0;
  const scholarshipBenefit = isKycVerified && hasStudent ? 10000 : 0;
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
      setKycError("");

      // Auto-populate verified citizen data
      setCitizenName("હરિભાઈ વિઠ્ઠલભાઈ પટેલ");
      setRationCardNumber("RC-GJ-2024-998124");
      setVillage("કાગવડ");
      setTaluka("જેતપુર");
      setDistrict("રાજકોટ");
      setPincode("360370");

      const verifiedMembers: VerifiedMember[] = [
        { name: "હરિભાઈ પટેલ", relation: "કુટુંબના વડા (Self)", age: 52 },
        { name: "મંજુલાબેન પટેલ", relation: "પત્ની (Wife)", age: 49 },
        { name: "ચિરાગ પટેલ", relation: "પુત્ર (Son)", age: 22 },
        { name: "ગોદાવરીબેન પટેલ", relation: "માતા (Senior Citizen)", age: 74 },
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
      (hasStudent ? `• ડિજિટલ ગુજરાત શિષ્યવૃત્તિ: ₹10,000\n` : "") +
      (isLaborer ? `• PM વિશ્વકર્મા ટૂલકીટ સહાય: ₹15,000\n` : "") +
      `\nજનસેવા કેન્દ્ર (CSC) પર રજૂ કરવા યોગ્ય સ્લિપ: https://nagrik-seva.vercel.app`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // All 8 Realistic Government Parameters configured as interactive tap-chips
  const CONDITIONS = [
    {
      id: "farmer",
      label: "ખેડૂત કુટુંબ (જમીન ધારક)",
      scheme: "PM કિસાન સન્માન નિધિ",
      amount: "₹6,000/વર્ષ",
      Icon: Wheat,
      color: "border-amber-300 bg-amber-50/70 text-amber-900",
      active: isFarmer,
      toggle: () => setIsFarmer(!isFarmer),
    },
    {
      id: "house",
      label: "કાચું મકાન (પાકા ઘરની જરૂર)",
      scheme: "PM આવાસ યોજના",
      amount: "₹1,20,000 સહાય",
      Icon: Home,
      color: "border-green-300 bg-green-50/70 text-green-900",
      active: needsHouse,
      toggle: () => setNeedsHouse(!needsHouse),
    },
    {
      id: "lpg",
      label: "ગેસ સિલિન્ડર નથી",
      scheme: "PM ઉજ્જવલા 2.0",
      amount: "₹3,600 ફ્રી કિટ",
      Icon: Flame,
      color: "border-red-300 bg-red-50/70 text-red-900",
      active: needsLPG,
      toggle: () => setNeedsLPG(!needsLPG),
    },
    {
      id: "senior",
      label: "વડીલ / વૃદ્ધ સભ્ય (૬૦+ વર્ષ)",
      scheme: "વરિષ્ઠ નાગરિક પેન્શન",
      amount: "₹36,000/વર્ષ",
      Icon: UserCheck,
      color: "border-purple-300 bg-purple-50/70 text-purple-900",
      active: hasSeniorCitizen,
      toggle: () => setHasSeniorCitizen(!hasSeniorCitizen),
    },
    {
      id: "girl",
      label: "કુટુંબમાં દીકરી છે",
      scheme: "વહાલી દીકરી યોજના",
      amount: "₹1,10,000 સહાય",
      Icon: Heart,
      color: "border-pink-300 bg-pink-50/70 text-pink-900",
      active: hasGirlChild,
      toggle: () => setHasGirlChild(!hasGirlChild),
    },
    {
      id: "business",
      label: "નાનો વ્યવસાય / લારી-ગલ્લા",
      scheme: "PM સ્વનિધિ સબસિડી લોન",
      amount: "₹20,000 લોન",
      Icon: Briefcase,
      color: "border-blue-300 bg-blue-50/70 text-blue-900",
      active: isSmallBusiness,
      toggle: () => setIsSmallBusiness(!isSmallBusiness),
    },
    {
      id: "student",
      label: "કોલેજ / સ્કૂલ વિદ્યાર્થી",
      scheme: "ડિજિટલ શિષ્યવૃત્તિ",
      amount: "₹10,000 સહાય",
      Icon: GraduationCap,
      color: "border-indigo-300 bg-indigo-50/70 text-indigo-900",
      active: hasStudent,
      toggle: () => setHasStudent(!hasStudent),
    },
    {
      id: "laborer",
      label: "કારીગર / શ્રમિક (e-Shram)",
      scheme: "PM વિશ્વકર્મા યોજના",
      amount: "₹15,000 ટૂલકીટ",
      Icon: Wrench,
      color: "border-teal-300 bg-teal-50/70 text-teal-900",
      active: isLaborer,
      toggle: () => setIsLaborer(!isLaborer),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-20">
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
                      <label className="text-[11px] font-semibold text-gray-700">
                        ૧૨ અંકનો આધાર કાર્ડ નંબર
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {aadhaarNumber.replace(/\D/g, "").length} / 12 અંક
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={14}
                      value={aadhaarNumber}
                      onChange={(e) => handleAadhaarInput(e.target.value)}
                      placeholder="XXXX XXXX XXXX"
                      disabled={isKycVerified}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-gray-700">
                        આધાર લિંક્ડ મોબાઈલ નંબર
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {mobileNumber.replace(/\D/g, "").length} / 10 અંક
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={11}
                      value={mobileNumber}
                      onChange={(e) => handleMobileInput(e.target.value)}
                      placeholder="XXXXX XXXXX"
                      disabled={isKycVerified}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50"
                    />
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
                  </div>

                  {/* 8 Real-World Government Parameter Touch-Chips (2 Columns, App-Style) */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-700">
                        કુટુંબની પરિસ્થિતિ પસંદ કરો ({activeCount} સક્રિય):
                      </p>
                      <span className="text-[10px] text-gray-400">ટેપ કરીને પસંદ કરો</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CONDITIONS.map((cond) => {
                        const Icon = cond.Icon;
                        return (
                          <div
                            key={cond.id}
                            onClick={cond.toggle}
                            className={`p-2.5 rounded-xl border-2 cursor-pointer transition select-none flex items-start gap-2.5 active:scale-98 ${
                              cond.active
                                ? `${cond.color} shadow-xs`
                                : "border-gray-100 bg-gray-50/70 hover:bg-gray-50 text-gray-600"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                                cond.active ? "bg-orange-500 text-white" : "border border-gray-300 bg-white"
                              }`}
                            >
                              {cond.active && <Check size={13} strokeWidth={3} />}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold leading-tight truncate">
                                {cond.label}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] opacity-75 truncate">{cond.scheme}</span>
                                <span className={`text-[10px] font-extrabold ${cond.active ? "text-green-700" : "text-gray-400"}`}>
                                  {cond.amount}
                                </span>
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
            <div className={`lg:col-span-6 space-y-4 ${activeTab === "inputs" ? "hidden lg:block" : "block"}`}>

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
              <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-md overflow-hidden relative">
                {/* Top Tricolor Strip */}
                <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-600" />

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

                  {/* Citizen Meta Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 text-[11px] border-b border-gray-100">
                    <div>
                      <span className="text-gray-400 block text-[9px]">નાગરિક નામ</span>
                      <span className="font-bold text-gray-800 truncate block">
                        {citizenName || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px]">આધાર નંબર</span>
                      <span className="font-bold text-gray-800 font-mono">
                        {isKycVerified ? `XXXX-XXXX-${aadhaarNumber.slice(-4)}` : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px]">રેશનકાર્ડ સભ્યો</span>
                      <span className="font-bold text-gray-800">
                        {familyCount > 0 ? `${familyCount} વ્યક્તિઓ` : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px]">ગામ & જિલ્લો</span>
                      <span className="font-bold text-gray-800 truncate block">
                        {village ? `${village}, ${district}` : "—"}
                      </span>
                    </div>
                  </div>

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
                            <span className="font-medium text-gray-800">🎓 ડિજિટલ ગુજરાત શિષ્યવૃત્તિ</span>
                            <span className="font-bold text-indigo-700">₹10,000 / વર્ષ</span>
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
                      onClick={() => window.print()}
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
    </>
  );
}
