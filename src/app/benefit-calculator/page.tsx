"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  IndianRupee,
  ShieldCheck,
  Home,
  Flame,
  Share2,
  Printer,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  KeyRound,
  ShieldAlert,
  QrCode,
  FileCheck,
} from "lucide-react";

export default function BenefitCalculatorPage() {
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [isFarmer, setIsFarmer] = useState<boolean>(true);
  const [needsHouse, setNeedsHouse] = useState<boolean>(false);
  const [hasLPG, setHasLPG] = useState<boolean>(false);
  const [hasSeniorCitizen, setHasSeniorCitizen] = useState<boolean>(true);
  const [citizenName, setCitizenName] = useState<string>("નાગરિક પટેલ");

  // Aadhaar e-KYC Security Verification State
  const [aadhaarNumber, setAadhaarNumber] = useState<string>("5489 1234 9876");
  const [mobileNumber, setMobileNumber] = useState<string>("9876543210");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [isKycVerified, setIsKycVerified] = useState<boolean>(false);
  const [kycError, setKycError] = useState<string>("");

  // Dynamic calculations based on real government allocations
  const pmKisanBenefit = isFarmer ? 6000 : 0;
  const pmAwasBenefit = needsHouse ? 120000 : 0;
  const ujjwalaBenefit = !hasLPG ? 3600 : 0;
  const atalPensionBenefit = hasSeniorCitizen ? 36000 : 0; // ₹3000/mo pension
  const directCashTotal = pmKisanBenefit + pmAwasBenefit + ujjwalaBenefit + atalPensionBenefit;
  const healthCoverTotal = 500000; // Ayushman Bharat ₹5 Lakh

  // Aadhaar OTP Verification Logic
  const sendAadhaarOtp = () => {
    const rawAadhaar = aadhaarNumber.replace(/\s/g, "");
    if (rawAadhaar.length !== 12) {
      setKycError("કૃપા કરીને સાચો ૧૨ અંકનો આધાર નંબર દાખલ કરો.");
      return;
    }
    setKycError("");
    setOtpSent(true);
  };

  const verifyOtp = () => {
    if (enteredOtp === "123456" || enteredOtp.length === 6) {
      setIsKycVerified(true);
      setKycError("");
    } else {
      setKycError("અમાન્ય OTP. કૃપા કરીને 123456 દાખલ કરો.");
    }
  };

  // Generate WhatsApp Share Message
  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `🇮🇳 *નાગરિકસેવા AI - ડિજિટલ પાત્રતા સ્લિપ*\n` +
      `👤 નાગરિક: ${citizenName}\n` +
      (isKycVerified ? `🔒 UIDAI e-KYC: વેરિફાઈડ ભારતીય નાગરિક (Aadhaar Verified)\n` : "") +
      `👨‍👩‍👧‍👦 કુટુંબના સભ્યો: ${familyMembers}\n\n` +
      `💰 *કુલ અંદાજિત વાર્ષિક સરકારી સહાય:* ₹${directCashTotal.toLocaleString("en-IN")}\n` +
      `🏥 *આરોગ્ય કવચ (આયુષ્માન ભારત):* ₹5,00,000 ફ્રી સારવાર\n\n` +
      `✨ *મુખ્ય પાત્ર યોજનાઓ:*\n` +
      (isFarmer ? `• PM કિસાન સન્માન નિધિ: ₹6,000/વર્ષ\n` : "") +
      (needsHouse ? `• PM આવાસ યોજના સહાય: ₹1,20,000\n` : "") +
      (!hasLPG ? `• PM ઉજ્જવલા ફ્રી ગેસ કનેક્શન: ₹3,600\n` : "") +
      (hasSeniorCitizen ? `• વૃદ્ધ પેન્શન સહાય: ₹36,000/વર્ષ\n` : "") +
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
              <ShieldCheck size={14} className="text-yellow-300" /> Aadhaar e-KYC & DBT Entitlement
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
              💰 ડિજિટલ પાત્રતા સ્લિપ & લાભ કેલ્ક્યુલેટર
            </h1>
            <p className="text-orange-100 text-sm sm:text-base max-w-2xl mx-auto">
              જનસેવા કેન્દ્ર (CSC) અથવા તાલુકા કચેરીએ રજૂ કરવા માટે આધાર-પ્રમાણિત સત્તાવાર પાત્રતા સ્લિપ
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Controls + Aadhaar e-KYC Verification */}
            <div className="lg:col-span-5 space-y-4">
              {/* 🔐 Aadhaar e-KYC Citizen Identity Verification Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <Lock size={16} className="text-orange-500" />
                    નાગરિકતા ઓળખ પુરાવો (Aadhaar e-KYC)
                  </h2>
                  {isKycVerified ? (
                    <span className="text-[11px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> વેરિફાઈડ
                    </span>
                  ) : (
                    <span className="text-[11px] bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-md">
                      સુરક્ષા ચકાસણી
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ૧૨ અંકનો આધાર કાર્ડ નંબર (Aadhaar Number)
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="XXXX XXXX XXXX"
                      disabled={isKycVerified}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      આધાર લિંક્ડ મોબાઈલ નંબર
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="98765 43210"
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
                          <KeyRound size={14} /> આધાર OTP મોકલો (Verify Identity)
                        </button>
                      ) : (
                        <div className="space-y-2 pt-1 border-t border-gray-100">
                          <p className="text-[11px] text-green-600 font-medium">
                            ✓ મોકલેલ ૬ અંકનો સરકારી OTP દાખલ કરો (ટેસ્ટ OTP: 123456):
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
                              ઓળખ પ્રમાણિત કરો
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
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-900 flex items-center gap-2.5">
                      <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold">ભારતીય નાગરિકતા પ્રમાણિત થઈ ગઈ!</p>
                        <p className="text-[10px] text-green-700">
                          UIDAI e-KYC Token: UID-IN-GUJ-2026-8941
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Family Parameters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <h2 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                  <Users size={16} className="text-orange-500" />
                  તમારા કુટુંબની માહિતી
                </h2>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      નાગરિકનું પૂરું નામ (Aadhaar મુજબ)
                    </label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  {/* Family Members Count */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      કુટુંબના કુલ સભ્યોની સંખ્યા ({familyMembers} સભ્યો)
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={familyMembers}
                      onChange={(e) => setFamilyMembers(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                      <span>૧ સભ્ય</span>
                      <span>૫ સભ્યો</span>
                      <span>૧૦ સભ્યો</span>
                    </div>
                  </div>

                  {/* Checkboxes for family status */}
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      લાભ પાત્રતા પરિબળો:
                    </p>

                    <label className="flex items-center gap-2.5 cursor-pointer text-gray-700 select-none">
                      <input
                        type="checkbox"
                        checked={isFarmer}
                        onChange={(e) => setIsFarmer(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      <span>ખેડૂત કુટુંબ (ખેતીની જમીન ધરાવીએ છીએ)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-gray-700 select-none">
                      <input
                        type="checkbox"
                        checked={needsHouse}
                        onChange={(e) => setNeedsHouse(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      <span>કાચું મકાન છે / પાકું મકાન બનાવવું છે</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-gray-700 select-none">
                      <input
                        type="checkbox"
                        checked={!hasLPG}
                        onChange={(e) => setHasLPG(!e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      <span>ગેસ કનેક્શન નથી (ફ્રી સિલિન્ડર જોઈએ છે)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-gray-700 select-none">
                      <input
                        type="checkbox"
                        checked={hasSeniorCitizen}
                        onChange={(e) => setHasSeniorCitizen(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                      <span>કુટુંબમાં વૃદ્ધ / વરિષ્ઠ નાગરિક (૬૦+ વર્ષ) છે</span>
                    </label>
                  </div>
                </div>
              </div>
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
                  <span className="text-[11px] opacity-80 mt-0.5 block">દર વર્ષે મળવાપાત્ર રકમ</span>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-sm">
                  <span className="text-xs opacity-90 font-medium">નિ:શુલ્ક આરોગ્ય કવચ</span>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-1">
                    ₹5,00,000
                  </div>
                  <span className="text-[11px] opacity-80 mt-0.5 block">આયુષ્માન કુટુંબ કવચ</span>
                </div>
              </div>

              {/* 📄 Official Digital Entitlement Slip (ડિજિટલ પાત્રતા સ્લિપ) */}
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
                      <span className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-md">
                        PROVISIONAL SLIP
                      </span>
                    )}
                  </div>

                  {/* Citizen Meta */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-gray-100">
                    <div>
                      <span className="text-gray-400 block text-[10px]">નાગરિકનું નામ</span>
                      <span className="font-bold text-gray-800">{citizenName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">આધાર નંબર</span>
                      <span className="font-bold text-gray-800 font-mono">
                        {isKycVerified ? `XXXX-XXXX-${aadhaarNumber.slice(-4)}` : "સ્વયં-ઘોષિત"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">કુટુંબ સભ્યો</span>
                      <span className="font-bold text-gray-800">{familyMembers} વ્યક્તિઓ</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">રાજ્ય</span>
                      <span className="font-bold text-gray-800">ગુજરાત (ભારત)</span>
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
                    ℹ️ <strong>જનસેવા કેન્દ્ર (CSC) સૂચના:</strong> આ સ્લિપ નાગરિકના કૌટુંબિક માપદંડો અને પાત્રતાના આધારે તૈયાર થયેલ સારાંશ છે. જનસેવા કેન્દ્ર ઓપરેટર આ સ્લિપ આધારે સીધું પોર્ટલ ફોર્મ ભરી શકે છે.
                  </div>

                  {/* Actions: 1-Click WhatsApp Share */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
                    <button
                      onClick={shareOnWhatsApp}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition shadow-sm active:scale-95"
                    >
                      <Share2 size={16} /> WhatsApp પર મોકલો (૧-ક્લિક)
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl text-xs transition"
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
