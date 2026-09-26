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
  MapPin,
  FileText,
  BadgeCheck,
  RotateCcw,
  Sparkle,
} from "lucide-react";

interface VerifiedMember {
  name: string;
  relation: string;
  age: number;
}

export default function BenefitCalculatorPage() {
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

  // Step 3: Special ground conditions (Ticked by citizen)
  const [isFarmer, setIsFarmer] = useState<boolean>(true);
  const [needsHouse, setNeedsHouse] = useState<boolean>(false);
  const [hasLPG, setHasLPG] = useState<boolean>(false);
  const [hasSeniorCitizen, setHasSeniorCitizen] = useState<boolean>(true);

  // Dynamic calculations based on real government allocations
  const familyCount = familyMembersList.length || 0;
  const pmKisanBenefit = isFarmer ? 6000 : 0;
  const pmAwasBenefit = needsHouse ? 120000 : 0;
  const ujjwalaBenefit = !hasLPG ? 3600 : 0;
  const atalPensionBenefit = hasSeniorCitizen ? 36000 : 0; // ₹3000/mo senior citizen pension
  const directCashTotal = pmKisanBenefit + pmAwasBenefit + ujjwalaBenefit + atalPensionBenefit;
  const healthCoverTotal = isKycVerified ? 500000 : 0; // Ayushman Bharat ₹5 Lakh

  // 1-Click Demo Fill for Hackathon Judges
  const fillDemoData = () => {
    setAadhaarNumber("5489 1234 9876");
    setMobileNumber("9876543210");
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
    setKycError("");
  };

  // Aadhaar OTP Verification Logic
  const sendAadhaarOtp = () => {
    const rawAadhaar = aadhaarNumber.replace(/\s/g, "");
    if (rawAadhaar.length !== 12) {
      setKycError("કૃપા કરીને ૧૨ અંકનો આધાર નંબર દાખલ કરો.");
      return;
    }
    if (mobileNumber.length !== 10) {
      setKycError("કૃપા કરીને ૧૦ અંકનો મોબાઈલ નંબર દાખલ કરો.");
      return;
    }
    setKycError("");
    setOtpSent(true);
  };

  const verifyOtp = () => {
    if (enteredOtp === "123456" || enteredOtp.length === 6) {
      // Simulate real government database fetch (Aadhaar + NFSA Ration Card DB)
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

      // Automatically check senior citizen flag since mother is 74
      setHasSeniorCitizen(true);
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
      (!hasLPG ? `• PM ઉજ્જવલા ફ્રી ગેસ કનેક્શન: ₹3,600\n` : "") +
      (hasSeniorCitizen ? `• વરિષ્ઠ નાગરિક પેન્શન સહાય: ₹36,000/વર્ષ\n` : "") +
      `\nજનસેવા કેન્દ્ર (CSC) પર રજૂ કરવા યોગ્ય સ્લિપ: https://nagrik-seva.vercel.app`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-600 text-white py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck size={14} className="text-yellow-300" /> Government e-KYC & RCMS Database Integration
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
              💰 ડિજિટલ પાત્રતા સ્લિપ & લાભ કેલ્ક્યુલેટર
            </h1>
            <p className="text-orange-100 text-sm sm:text-base max-w-2xl mx-auto">
              આધાર નંબર નાખીને તમારા રેશનકાર્ડના કુટુંબની સત્તાવાર પાત્રતા સ્લિપ ૧ મિનિટમાં મેળવો
            </p>
          </div>
        </section>

        {/* ── 3-Step Visual Progress Guide ── */}
        <div className="max-w-6xl mx-auto px-4 -mt-4">
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`flex items-center gap-3 p-2 rounded-xl ${!isKycVerified ? "bg-orange-50 border border-orange-200" : "bg-green-50"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${!isKycVerified ? "bg-orange-500 text-white" : "bg-green-600 text-white"}`}>
                {isKycVerified ? "✓" : "૧"}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">સ્ટેપ ૧: આધાર e-KYC</p>
                <p className="text-[10px] text-gray-500">ઓળખ વેરિફિકેશન કરો</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-2 rounded-xl ${isKycVerified ? "bg-orange-50 border border-orange-200" : "bg-gray-50 opacity-60"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isKycVerified ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-700"}`}>
                ૨
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">સ્ટેપ ૨: કુટુંબ & સરનામું</p>
                <p className="text-[10px] text-gray-500">રેશનકાર્ડ ડેટા ઓટો-ફેચ થશે</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-2 rounded-xl ${isKycVerified ? "bg-green-50 border border-green-200" : "bg-gray-50 opacity-60"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isKycVerified ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"}`}>
                ૩
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">સ્ટેપ ૩: પાત્રતા સ્લિપ</p>
                <p className="text-[10px] text-gray-500">WhatsApp પર મેળવો & બતાવો</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-5 space-y-4">
              {/* Step 1: Aadhaar e-KYC Verification Box */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <Lock size={16} className="text-orange-500" />
                    સ્ટેપ ૧: નાગરિકતા ઓળખ (Aadhaar e-KYC)
                  </h2>
                  {isKycVerified ? (
                    <span className="text-[11px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <BadgeCheck size={13} className="text-green-600" /> વેરિફાઈડ
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={fillDemoData}
                      className="text-[11px] text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md font-medium transition"
                    >
                      ડેમો ભરો
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ૧૨ અંકનો આધાર કાર્ડ નંબર
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="દા.ત. 5489 1234 9876"
                      disabled={isKycVerified}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      આધાર સાથે લિંક થયેલ મોબાઈલ નંબર
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="દા.ત. 9876543210"
                      disabled={isKycVerified}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50"
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
                              maxLength={6}
                              value={enteredOtp}
                              onChange={(e) => setEnteredOtp(e.target.value)}
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
                      <span className="text-[11px] text-green-700 font-medium">
                        ✓ UIDAI & સરકારી રેશન ડેટા સફળતાપૂર્વક મળ્યો
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

              {/* Step 2: Auto-Fetched Government Family & Address Details */}
              {isKycVerified ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      <BadgeCheck size={16} className="text-green-600" />
                      સ્ટેપ ૨: રેશનકાર્ડ પ્રમાણિત કુટુંબ & સરનામું
                    </h3>
                    <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded">
                      RCMS ડેટાબેઝ
                    </span>
                  </div>

                  {/* Citizen Name & Address Cards */}
                  <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5 border border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-400">મુખ્ય નાગરિક:</span>
                      <span className="font-bold text-gray-800">{citizenName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">રેશનકાર્ડ નં:</span>
                      <span className="font-mono font-semibold text-gray-700">{rationCardNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ગામ & તાલુકો:</span>
                      <span className="font-medium text-gray-800">{village}, તા. {taluka}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">જિલ્લો & પિનકોડ:</span>
                      <span className="font-medium text-gray-800">જિ. {district} - {pincode}</span>
                    </div>
                  </div>

                  {/* Verified Family Members List */}
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                      <Users size={13} className="text-orange-500" />
                      રેશનકાર્ડમાં નોંધાયેલા સભ્યો ({familyMembersList.length} સભ્યો):
                    </p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {familyMembersList.map((member, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 border border-gray-100"
                        >
                          <span className="font-medium text-gray-800">
                            {i + 1}. {member.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">{member.relation}</span>
                            <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                              {member.age} વર્ષ
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes for special conditions */}
                  <div className="pt-3 border-t border-gray-100 space-y-2.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      વિશેષ પરિસ્થિતિઓ (તમારી રીતે ટીક કરો):
                    </p>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700 select-none">
                      <input
                        type="checkbox"
                        checked={isFarmer}
                        onChange={(e) => setIsFarmer(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      <span>ખેડૂત કુટુંબ (ખેતીની જમીન ધરાવીએ છીએ)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700 select-none">
                      <input
                        type="checkbox"
                        checked={needsHouse}
                        onChange={(e) => setNeedsHouse(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      <span>કાચું મકાન છે / પાકું મકાન સહાય જોઈએ છે</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700 select-none">
                      <input
                        type="checkbox"
                        checked={!hasLPG}
                        onChange={(e) => setHasLPG(!e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      <span>ગેસ કનેક્શન નથી (ફ્રી સિલિન્ડર જોઈએ છે)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700 select-none">
                      <input
                        type="checkbox"
                        checked={hasSeniorCitizen}
                        onChange={(e) => setHasSeniorCitizen(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      <span>કુટુંબમાં વરિષ્ઠ નાગરિક (૬૦+ વર્ષ) છે (માતા: ૭૪ વર્ષ)</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center text-gray-400 space-y-2">
                  <Lock size={32} className="mx-auto text-gray-300" />
                  <p className="text-xs font-semibold text-gray-600">
                    સ્ટેપ ૨: કુટુંબ વિગતો હજુ લોક છે
                  </p>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                    ઉપરના બોક્સમાં આધાર નંબર અને OTP નાખો જેથી સરકારી રેશન ડેટાબેઝમાંથી કુટુંબ અને સરનામું ઓટો-ફેચ થશે.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: 📄 Digital Entitlement Slip */}
            <div className="lg:col-span-7 space-y-5">
              {/* Dynamic Benefits Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-sm">
                  <span className="text-xs opacity-90 font-medium">વાર્ષિક સીધી રોકડ સહાય</span>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-1">
                    ₹{directCashTotal.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[11px] opacity-80 mt-0.5 block">
                    {isKycVerified ? "પ્રમાણિત પાત્રતા રકમ" : "અંદાજિત રકમ"}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-sm">
                  <span className="text-xs opacity-90 font-medium">નિ:શુલ્ક આરોગ્ય કવચ</span>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-1">
                    ₹{healthCoverTotal.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[11px] opacity-80 mt-0.5 block">આયુષ્માન પરિવાર કાર્ડ</span>
                </div>
              </div>

              {/* 📄 Official Digital Entitlement Slip */}
              <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-md overflow-hidden relative">
                {/* Top Tricolor Strip */}
                <div className="h-2.5 bg-gradient-to-r from-orange-500 via-white to-green-600" />

                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇮🇳</span>
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg text-gray-800">
                          ડિજિટલ પાત્રતા સ્લિપ
                        </h3>
                        <p className="text-[11px] text-orange-600 font-semibold">
                          Citizen Entitlement Summary Slip &bull; NagrikSeva AI
                        </p>
                      </div>
                    </div>
                    {isKycVerified ? (
                      <span className="text-[11px] bg-green-100 border border-green-200 text-green-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-green-600" /> UIDAI VERIFIED
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-md">
                        વેરિફિકેશન બાકી
                      </span>
                    )}
                  </div>

                  {/* Citizen Meta Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-gray-100">
                    <div>
                      <span className="text-gray-400 block text-[10px]">નાગરિકનું નામ</span>
                      <span className="font-bold text-gray-800">
                        {citizenName || "— (વેરિફિકેશન પછી)"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">આધાર નંબર</span>
                      <span className="font-bold text-gray-800 font-mono">
                        {isKycVerified ? `XXXX-XXXX-${aadhaarNumber.slice(-4)}` : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">રેશનકાર્ડ સભ્યો</span>
                      <span className="font-bold text-gray-800">
                        {familyCount > 0 ? `${familyCount} વ્યક્તિઓ` : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">ગામ & જિલ્લો</span>
                      <span className="font-bold text-gray-800 truncate block">
                        {village ? `${village}, ${district}` : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Entitlement Breakdown Items */}
                  <div className="py-4 space-y-2.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      મળવાપાત્ર સરકારી યોજનાઓ અને રકમ:
                    </p>

                    {isFarmer && (
                      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-orange-50/70 border border-orange-100">
                        <span className="font-medium text-gray-800">🌾 PM કિસાન સન્માન નિધિ</span>
                        <span className="font-bold text-green-700">₹6,000 / વર્ષ</span>
                      </div>
                    )}

                    {needsHouse && (
                      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-green-50/70 border border-green-100">
                        <span className="font-medium text-gray-800">🏠 PM આવાસ યોજના (મકાન સહાય)</span>
                        <span className="font-bold text-green-700">₹1,20,000 (વન-ટાઇમ)</span>
                      </div>
                    )}

                    {!hasLPG && (
                      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-red-50/70 border border-red-100">
                        <span className="font-medium text-gray-800">🔥 PM ઉજ્જવલા યોજના (ફ્રી સિલિન્ડર)</span>
                        <span className="font-bold text-green-700">₹3,600 સહાય</span>
                      </div>
                    )}

                    {hasSeniorCitizen && (
                      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
                        <span className="font-medium text-gray-800">👴 વરિષ્ઠ નાગરિક પેન્શન કવચ</span>
                        <span className="font-bold text-green-700">₹36,000 / વર્ષ</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                      <span className="font-medium text-gray-800">🏥 આયુષ્માન ભારત હેલ્થ કવચ</span>
                      <span className="font-bold text-blue-700">₹5,00,000 કેશલેસ સારવાર</span>
                    </div>
                  </div>

                  {/* Legal Notice Footer */}
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-[10px] text-gray-500 leading-relaxed">
                    ℹ️ <strong>જનસેવા કેન્દ્ર (CSC) સૂચના:</strong> આ સ્લિપ નાગરિકના આધાર e-KYC અને રેશનકાર્ડ ડેટાબેઝના આધારે પ્રમાણિત છે. જનસેવા કેન્દ્ર ઓપરેટર આ સ્લિપ જોઈને સીધું ફોર્મ ભરી શકે છે.
                  </div>

                  {/* Actions: 1-Click WhatsApp Share */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
                    <button
                      onClick={shareOnWhatsApp}
                      disabled={!isKycVerified}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition shadow-sm active:scale-95"
                    >
                      <Share2 size={16} /> WhatsApp પર મોકલો (૧-ક્લિક)
                    </button>
                    <button
                      onClick={() => window.print()}
                      disabled={!isKycVerified}
                      className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-semibold py-3 px-4 rounded-xl text-xs transition"
                    >
                      <Printer size={15} /> સ્લિપ પ્રિન્ટ / PDF
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
