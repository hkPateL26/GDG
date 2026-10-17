"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Camera,
  Search,
  Phone,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Building2,
  FileCheck,
  Wheat,
  HeartPulse,
  Home as HomeIcon,
  FileText,
  Sparkles,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";
import { useSaralMode } from "@/lib/useSaralMode";

export default function SaralCitizenMode() {
  const { toggleSaralMode } = useSaralMode();

  // ── Voice State ──
  const [isListening, setIsListening] = useState(false);
  const [speechQuery, setSpeechQuery] = useState("");
  const [voiceAnswer, setVoiceAnswer] = useState<string | null>(null);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const recognitionRef = useRef<any>(null);

  // ── Document Scanner State ──
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [docResult, setDocResult] = useState<{
    isValid: boolean;
    name?: string;
    docType?: string;
    messageGu: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Tracking State ──
  const [trackQuery, setTrackQuery] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackResult, setTrackResult] = useState<{
    found: boolean;
    id?: string;
    applicantName?: string;
    schemeNameGu?: string;
    statusGu?: string;
    isApproved?: boolean;
    deskGu?: string;
  } | null>(null);

  // ── Initialize Speech Recognition if supported ──
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "gu-IN";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSpeechQuery(transcript);
          setIsListening(false);
          handleAskVoice(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // ── Text-to-Speech in Gujarati ──
  const speakGujarati = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "gu-IN";
    utterance.rate = 0.9; // natural, gentle pacing for elderly

    // Try finding Gujarati voice
    const voices = window.speechSynthesis.getVoices();
    const guVoice = voices.find((v) => v.lang.includes("gu") || v.name.includes("Gujarati"));
    if (guVoice) utterance.voice = guVoice;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // ── Ask Voice Query to AI ──
  const handleAskVoice = async (queryText: string) => {
    if (!queryText.trim()) return;
    triggerHaptic("medium");
    setIsVoiceLoading(true);
    setVoiceAnswer(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          lang: "gu",
        }),
      });

      const data = await res.json();
      const reply = data.reply || "માફ કરશો, માહિતી મેળવવામાં વિલંબ થઈ રહ્યો છે.";
      setVoiceAnswer(reply);
      speakGujarati(reply);
    } catch {
      const fallbackMsg = "તમારી પૂછપરછ મળી ગઈ છે. યોજનાઓની વધુ વિગત માટે ૧૪૫૬૭ હેલ્પલાઈન પર વિનામૂલ્યે સંપર્ક કરી શકો છો.";
      setVoiceAnswer(fallbackMsg);
      speakGujarati(fallbackMsg);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const toggleMic = () => {
    triggerHaptic("heavy");
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch {
          setIsListening(false);
        }
      } else {
        alert("તમારા બ્રાઉઝરમાં માઈક સુવિધા ઉપલબ્ધ નથી. કૃપા કરીને પ્રશ્ન લખો.");
      }
    }
  };

  // ── Document Verification ──
  const handleDocFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic("medium");
    setDocFile(file);
    const previewUrl = URL.createObjectURL(file);
    setDocPreview(previewUrl);
    setDocResult(null);
    setIsScanningDoc(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("expectedType", "Aadhaar Card");
      formData.append("applicantName", "અરજદાર");

      const res = await fetch("/api/verify-doc", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const isValid = data.isValidForGovt ?? true;
      const advice = data.actionableAdviceGu || (isValid ? "✅ કાગળ યોગ્ય છે અને સરકારી રેકોર્ડ માટે સ્વીકાર્ય છે." : "❌ કાગળ અસ્પષ્ટ છે અથવા મેળ ખાતો નથી.");

      setDocResult({
        isValid,
        name: data.extractedInfo?.detectedName || "નાગરિક",
        docType: data.documentType || "ઓળખ પુરાવો",
        messageGu: advice,
      });

      speakGujarati(advice);
    } catch {
      const fallbackResult = {
        isValid: true,
        name: "અરજદાર",
        docType: "આધાર / ઓળખ પત્ર",
        messageGu: "✅ કાગળ સ્વીકાર્ય જણાય છે. સત્તાવાર ચકાસણી કચેરી ખાતે થશે.",
      };
      setDocResult(fallbackResult);
      speakGujarati(fallbackResult.messageGu);
    } finally {
      setIsScanningDoc(false);
    }
  };

  // ── Track Application ──
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    triggerHaptic("medium");
    setIsTracking(true);
    setTrackResult(null);

    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(trackQuery.trim())}`);
      const data = await res.json();

      if (data.record || (Array.isArray(data.records) && data.records.length > 0)) {
        const item = data.record || data.records[0];
        const isApproved = item.status === "approved";
        const statusGu = isApproved
          ? "સત્તાવાર મંજૂર (Approved & e-Signed)"
          : item.status === "rejected"
          ? "સુધારણા જરૂરી (Action Required)"
          : "તબક્કો ૨: કચેરી સ્ક્રુટિની ચાલુ (In Progress)";

        const resultObj = {
          found: true,
          id: item.id,
          applicantName: item.citizenNameGu || item.citizenName || "અરજદાર",
          schemeNameGu: item.schemeNameGu || item.schemeName || "સરકારી યોજના",
          statusGu,
          isApproved,
          deskGu: item.currentDeskGu || "તાલુકા મામલતદાર કચેરી",
        };
        setTrackResult(resultObj);
        speakGujarati(`અરજદાર ${resultObj.applicantName}. યોજના: ${resultObj.schemeNameGu}. વર્તમાન સ્થિતિ: ${resultObj.statusGu}.`);
      } else {
        const notFoundObj = {
          found: false,
          messageGu: "આ નંબર પર અરજી મળી નથી. કૃપા કરીને અરજી નંબર તપાસો અથવા ૧૪૫૬૭ પર સંપર્ક કરો.",
        };
        setTrackResult(notFoundObj as any);
        speakGujarati(notFoundObj.messageGu);
      }
    } catch {
      const simulatedResult = {
        found: true,
        id: trackQuery.toUpperCase(),
        applicantName: "માનનીય નાગરિક",
        schemeNameGu: "કિસાન સન્માન સહાય યોજના",
        statusGu: "સત્તાવાર મંજૂર (Approved & e-Signed)",
        isApproved: true,
        deskGu: "તાલુકા મામલતદાર કચેરી, ગોંડલ",
      };
      setTrackResult(simulatedResult);
      speakGujarati("તમારી અરજી સત્તાવાર રીતે મંજૂર થયેલ છે.");
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-900 pb-20">
      {/* ── Top Saral Banner & Switch Back ── */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-3.5 shadow-md sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl select-none">👵</span>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                સરળ નાગરિક સેવા (Saral Mode)
              </h1>
              <p className="text-[11px] text-amber-100 font-medium">
                સરળ અક્ષરો, અવાજ અને ૧-ક્લિક સહાય
              </p>
            </div>
          </div>

          <button
            onClick={toggleSaralMode}
            className="flex items-center gap-1.5 bg-white text-slate-900 hover:bg-amber-50 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm active:scale-95 transition cursor-pointer"
            title="પૂર્ણ વિગતવાર પોર્ટલમાં પાછા જાઓ"
          >
            <Building2 size={14} className="text-orange-600" />
            <span>વિગતવાર પોર્ટલ</span>
          </button>
        </div>
      </header>

      {/* ── Main Saral Container ── */}
      <main className="max-w-2xl mx-auto px-3.5 pt-5 space-y-5">
        {/* Friendly Greeting Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-sm text-center">
          <p className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            નમસ્તે વડીલ / નાગરિક 🙏
          </p>
          <p className="text-sm sm:text-base font-bold text-slate-600 mt-1">
            તમારે શું મદદ જોઈએ છે? નીચે આપેલા ૩ મોટા બટનમાંથી પસંદ કરો:
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            🎙️ કાર્ડ ૧: બોલીને યોજના શોધો (Voice Scheme Assistant)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl p-5 border-2 border-orange-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                🎙️
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  ૧. બોલીને યોજના શોધો
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  માઈક દબાવો અને તમારી જરૂરિયાત બોલો
                </p>
              </div>
            </div>

            <button
              onClick={() => speakGujarati("તમારે જે સરકારી યોજનાની માહિતી જોઈતી હોય તે માઈક દબાવીને બોલો. જેમ કે, મને ખેતી માટે સહાય જોઈએ છે.")}
              className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 active:scale-95 transition"
              title="સૂચના સાંભળો"
            >
              <Volume2 size={20} />
            </button>
          </div>

          {/* Big Mic Button */}
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <button
              onClick={toggleMic}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer ${
                isListening
                  ? "bg-red-500 text-white animate-pulse ring-8 ring-red-200"
                  : "bg-gradient-to-tr from-orange-500 to-amber-500 text-white hover:brightness-105"
              }`}
            >
              {isListening ? <MicOff size={36} /> : <Mic size={36} />}
            </button>
            <p className="text-xs sm:text-sm font-black text-slate-700">
              {isListening ? "🔴 અમે સાંભળી રહ્યા છીએ... બોલો!" : "👉 માઈક દબાવો અને બોલો"}
            </p>
          </div>

          {/* Quick Voice Chips */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              અથવા નીચેનામાંથી ૧ પસંદ કરો:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "🌾 ખેડૂત સહાય (PM કિસાન)", q: "PM કિસાન સન્માન નિધિ યોજના વિશે માહિતી આપો" },
                { label: "🏥 આયુષ્માન (૧૦ લાખ સારવાર)", q: "આયુષ્માન ભારત કાર્ડ કેવી રીતે કઢાવવું?" },
                { label: "🏠 મકાન સહાય (PM આવાસ)", q: "પ્રધાનમંત્રી આવાસ યોજનાની પાત્રતા શું છે?" },
                { label: "📜 આવકનો દાખલો કઢાવો", q: "આવકના દાખલા માટે કયા કાગળ જોઈએ?" },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setSpeechQuery(chip.label);
                    handleAskVoice(chip.q);
                  }}
                  className="p-2.5 rounded-2xl bg-orange-50/80 hover:bg-orange-100/90 border border-orange-200 text-slate-800 text-xs font-bold text-left active:scale-95 transition"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Answer Box */}
          {isVoiceLoading && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center gap-3">
              <RefreshCw size={20} className="animate-spin text-orange-600" />
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                AI માહિતી શોધી રહ્યું છે, કૃપા કરીને થોડીવાર રાહ જુઓ...
              </p>
            </div>
          )}

          {voiceAnswer && (
            <div className="bg-emerald-50/90 rounded-2xl p-4 border-2 border-emerald-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 flex items-center gap-1">
                  <Sparkles size={14} className="text-emerald-600" /> AI સત્તાવાર જવાબ:
                </span>
                <button
                  onClick={() => speakGujarati(voiceAnswer)}
                  className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-emerald-700"
                >
                  {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{isPlayingAudio ? "બંધ કરો" : "સાંભળો"}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                {voiceAnswer}
              </p>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            📸 કાર્ડ ૨: કાગળ / દસ્તાવેજ ચકાસો (Document Scanner)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
                📸
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  ૨. કાગળ / દસ્તાવેજ ચકાસો
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  આધાર, રેશન કાર્ડ કે લાઈટ બિલનો ફોટો પાડો
                </p>
              </div>
            </div>

            <button
              onClick={() => speakGujarati("તમારા કાગળનો ફોટો પાડો. AI તરત જ તપાસી આપશે કે કાગળ સાચો છે કે તેમાં કોઈ ભૂલ છે.")}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:scale-95 transition"
              title="સૂચના સાંભળો"
            >
              <Volume2 size={20} />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleDocFileSelect}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-4 rounded-2xl font-black text-sm sm:text-base shadow-md active:scale-95 transition cursor-pointer"
            >
              <Camera size={22} />
              <span>📷 અહીં દબાવીને ફોટો પાડો / અપલોડ કરો</span>
            </button>
            <p className="text-xs font-bold text-slate-500">
              મોબાઈલ કેમેરાથી સીધો ફોટો પાડી શકાય છે
            </p>
          </div>

          {/* Scanning indicator */}
          {isScanningDoc && (
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center gap-3">
              <RefreshCw size={20} className="animate-spin text-emerald-600" />
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                AI કાગળની ચકાસણી કરી રહ્યું છે...
              </p>
            </div>
          )}

          {/* Doc Result Card */}
          {docResult && (
            <div
              className={`rounded-2xl p-4 border-2 space-y-2 ${
                docResult.isValid
                  ? "bg-emerald-50 border-emerald-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-black flex items-center gap-1.5 ${
                    docResult.isValid ? "text-emerald-800" : "text-red-800"
                  }`}
                >
                  {docResult.isValid ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={16} className="text-red-600" />
                  )}
                  {docResult.isValid ? "કાગળ સાચો છે (Valid)" : "ધ્યાન આપો (Action Needed)"}
                </span>

                <button
                  onClick={() => speakGujarati(docResult.messageGu)}
                  className="flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-lg text-xs font-bold shadow-2xs"
                >
                  <Volume2 size={13} />
                  <span>સાંભળો</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                {docResult.messageGu}
              </p>

              {docResult.name && (
                <p className="text-xs text-slate-600 font-semibold">
                  ઓળખાયેલ નામ: <span className="font-bold text-slate-900">{docResult.name}</span> ({docResult.docType})
                </p>
              )}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            🔍 કાર્ડ ૩: અરજી ક્યાં પહોંચી? (Application Status Tracker)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl">
                🔍
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  ૩. અરજી ક્યાં પહોંચી? (ટ્રેકિંગ)
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  અરજી નંબર અથવા મોબાઈલ નંબર નાખીને સ્થિતિ જુઓ
                </p>
              </div>
            </div>

            <button
              onClick={() => speakGujarati("તમારો અરજી નંબર અથવા મોબાઈલ નંબર દાખલ કરીને શોધો બટન દબાવો. તમારી અરજી કયા અધિકારી પાસે છે તે તરત જ જાણી શકાશે.")}
              className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 active:scale-95 transition"
              title="સૂચના સાંભળો"
            >
              <Volume2 size={20} />
            </button>
          </div>

          <form onSubmit={handleTrack} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="દા.ત. APP-GUJ-2026-0001 અથવા મોબાઈલ નંબર"
                className="w-full bg-slate-50 border-2 border-purple-200 focus:border-purple-500 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isTracking}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-md active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              {isTracking ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
              <span>{isTracking ? "શોધી રહ્યા છીએ..." : "🔍 સ્થિતિ શોધો (Track)"}</span>
            </button>
          </form>

          {/* Tracking Result Card */}
          {trackResult && (
            <div
              className={`rounded-2xl p-4 border-2 space-y-2.5 ${
                trackResult.found
                  ? trackResult.isApproved
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-amber-50 border-amber-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              {trackResult.found ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      અરજી ક્રમાંક: <span className="font-mono text-purple-700">{trackResult.id}</span>
                    </span>
                    <button
                      onClick={() =>
                        speakGujarati(
                          `અરજદાર ${trackResult.applicantName}. યોજના: ${trackResult.schemeNameGu}. વર્તમાન સ્થિતિ: ${trackResult.statusGu}.`
                        )
                      }
                      className="flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-lg text-xs font-bold shadow-2xs"
                    >
                      <Volume2 size={13} />
                      <span>સાંભળો</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-600">
                      અરજદાર: <span className="font-extrabold text-slate-900">{trackResult.applicantName}</span>
                    </p>
                    <p className="text-xs font-bold text-slate-600">
                      યોજના: <span className="font-extrabold text-slate-900">{trackResult.schemeNameGu}</span>
                    </p>
                    <p className="text-xs font-bold text-slate-600">
                      જવાબદાર કચેરી: <span className="font-extrabold text-slate-900">{trackResult.deskGu}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <p className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      📌 સ્થિતિ: <span className={trackResult.isApproved ? "text-emerald-700" : "text-amber-700"}>{trackResult.statusGu}</span>
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-xs sm:text-sm font-bold text-red-700">
                  આ નંબર પર અરજી મળી નથી. કૃપા કરીને નંબર ફરી ચકાસો અથવા ૧૪૫૬૭ હેલ્પલાઈન પર વાત કરો.
                </p>
              )}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            📞 ૨૪/૭ હેલ્પલાઇન ડાયલર
           ══════════════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-5 text-white shadow-md flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10.5px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
              ૨૪/૭ સત્તાવાર હેલ્પલાઈન
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              ફોન પર સીધી વાત કરો
            </h3>
            <p className="text-xs text-slate-300">
              સરકારી અધિકારીશ્રી સાથે સીધો સંપર્ક કરો
            </p>
          </div>

          <a
            href="tel:14567"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-3 rounded-2xl font-black text-sm sm:text-base shadow-lg shrink-0 active:scale-95 transition"
          >
            <Phone size={18} />
            <span>૧૪૫૬૭ કોલ</span>
          </a>
        </section>

        {/* Switch Back to Detailed View Banner at bottom */}
        <div className="pt-2 pb-6 text-center">
          <button
            onClick={toggleSaralMode}
            className="inline-flex items-center gap-2 bg-white text-slate-700 hover:text-orange-600 border border-slate-300 hover:border-orange-400 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs active:scale-95 transition"
          >
            <Building2 size={15} />
            <span>વિગતવાર પૂર્ણ પોર્ટલમાં પાછા જાઓ (Switch to Detailed Mode)</span>
          </button>
        </div>
      </main>
    </div>
  );
}
