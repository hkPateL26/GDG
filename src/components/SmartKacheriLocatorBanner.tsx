"use client";

import { useState } from "react";
import {
  findNearestOffices,
  NearestOfficeResult,
  calculateHaversineKm,
  OFFICES_DATA,
} from "@/lib/offices-data";
import {
  MapPin,
  Navigation,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  LocateFixed,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface SmartKacheriLocatorBannerProps {
  citizen: {
    citizenName?: string;
    citizenNameGu?: string;
    mobile?: string;
    aadhaarLast4?: string;
    district?: string;
    districtGu?: string;
    taluka?: string;
    village?: string;
  };
}

// Official Home Coordinates for citizen (Gomta village, Gondal taluka, Rajkot)
const HOME_COORDS = {
  lat: 21.9125,
  lng: 70.7654,
  labelGu: "મુ. ગોમટા, તા. ગોંડલ (ઘરે)",
};

// Simulation coordinates for testing outside location (Rajkot City)
const OUTSIDE_TEST_COORDS = {
  lat: 22.2858,
  lng: 70.7725,
  labelGu: "રાજકોટ શહેર (બહારગામ)",
};

export default function SmartKacheriLocatorBanner({ citizen }: SmartKacheriLocatorBannerProps) {
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(HOME_COORDS);
  const [currentLocationName, setCurrentLocationName] = useState<string>(HOME_COORDS.labelGu);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Check if citizen is physically outside home taluka/village (distance > 5km)
  const distanceFromHome = calculateHaversineKm(
    currentCoords.lat,
    currentCoords.lng,
    HOME_COORDS.lat,
    HOME_COORDS.lng
  );
  const isOutsideHome = distanceFromHome > 5.0;

  // 1. Home Jurisdiction Nearest Office (Aadhaar Registered)
  const homeResults: NearestOfficeResult[] = findNearestOffices(
    HOME_COORDS.lat,
    HOME_COORDS.lng,
    citizen.district || "Rajkot",
    citizen.taluka || "Gondal"
  );
  const homeNearest = homeResults[0];

  // Official Taluka Mamlatdar Office for legal approval
  const homeMamlatdarOffice =
    OFFICES_DATA.find(
      (o) =>
        o.taluka?.toLowerCase() === (citizen.taluka || "gondal").toLowerCase() &&
        o.category === "mamlatdar"
    ) || homeNearest.office;

  // 2. Current Location Nearest Office (Live GPS or Current Spot)
  const currentResults: NearestOfficeResult[] = findNearestOffices(
    currentCoords.lat,
    currentCoords.lng,
    citizen.district || "Rajkot",
    citizen.taluka || "Gondal"
  );
  const currentNearest = currentResults[0];

  // The active office to display in the header
  const activeOffice = isOutsideHome ? currentNearest : homeNearest;

  // Browser HTML5 Geolocation API Handler
  const handleDetectLiveGps = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsError("આ બ્રાઉઝરમાં જીપીએસ ઉપલબ્ધ નથી.");
      return;
    }

    setIsGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });

        const dist = calculateHaversineKm(latitude, longitude, HOME_COORDS.lat, HOME_COORDS.lng);
        if (dist <= 5.0) {
          setCurrentLocationName(HOME_COORDS.labelGu);
        } else {
          setCurrentLocationName(`📍 લાઈવ GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
        }
        setIsGpsLoading(false);
      },
      (err) => {
        console.warn("Geolocation permission error:", err);
        setIsGpsLoading(false);
        setGpsError("જીપીએસ પરવાનગી ન મળતાં આધાર કાયમી સરનામું (ગોંડલ) યથાવત્ રાખેલ છે.");
        setTimeout(() => setGpsError(null), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleResetToHome = () => {
    setCurrentCoords(HOME_COORDS);
    setCurrentLocationName(HOME_COORDS.labelGu);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-300">
      {/* ── Top Header / Quick Status Bar ── */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50 p-4 sm:p-5 border-b border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-600 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
            🏛️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-orange-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                AI કચેરી નેવિગેટર
              </span>
              <span className="text-xs font-black text-slate-800">
                ગુજરાતના ૩૩ જિલ્લા & ૨૫૨ તાલુકા અધિકારક્ષેત્ર
              </span>
              {isOutsideHome ? (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  📍 લાઈવ: બહારગામ ({distanceFromHome} km દૂર)
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  🏠 ઘરે (કાયદેસર સરનામે)
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5 leading-snug">
              સૌથી નજીકની કચેરી / જન સેવા કેન્દ્ર:{" "}
              <span className="text-orange-700 underline decoration-orange-300 underline-offset-2">
                {activeOffice?.office.nameGu || activeOffice?.office.name}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-slate-700 font-bold">
                <Navigation size={12} className="text-orange-600" />
                અંતર: {activeOffice?.distanceKm} કિમી ({activeOffice?.travelTimeMins} મિનિટ)
              </span>
              &bull;
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Clock size={12} /> ૧૦:૩૦ AM - ૦૬:૧૦ PM (🟢 ખુલ્લી છે)
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls & GPS Trigger */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={handleDetectLiveGps}
            disabled={isGpsLoading}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
            title="હાલનું લાઈવ GPS લોકેશન મેળવો"
          >
            <LocateFixed size={14} className={isGpsLoading ? "animate-spin text-orange-600" : "text-orange-600"} />
            <span>{isGpsLoading ? "લોકેશન..." : "લાઈવ GPS શોધો"}</span>
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              activeOffice?.office.mapQuery || "Mamlatdar Office Gondal"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Navigation size={13} />
            <span>રસ્તો (Google Maps)</span>
            <ExternalLink size={11} className="opacity-75" />
          </a>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title={isExpanded ? "વિગતો સંકોચો" : "વિગતવાર અધિકારક્ષેત્ર જુઓ"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 flex items-center justify-between">
          <span>⚠️ {gpsError}</span>
          <button type="button" onClick={() => setGpsError(null)} className="font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* ── AI Jurisdiction Smart Insight Pill ── */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-800">
          <span className="p-1 bg-amber-100 text-amber-800 rounded-md font-bold text-[10px] flex items-center gap-1 shrink-0">
            <Sparkles size={11} /> AI અધિકારક્ષેત્ર સલાહ
          </span>
          <p className="text-slate-700 leading-snug">
            {isOutsideHome
              ? `તમે હાલ તમારા મૂળ તાલુકા (${citizen.taluka || "ગોંડલ"}) થી બહાર છો. આ સેન્ટર પરથી તમે બાયોમેટ્રિક્સ કે ફી ચલણ ભરી શકો છો, જ્યારે સત્તાવાર આખરી મંજૂરી મૂળ ગોંડલ તાલુકામાંથી થશે.`
              : `તમે તમારા આધાર અધિકારક્ષેત્ર (${citizen.taluka || "ગોંડલ"}, ${citizen.districtGu || "રાજકોટ"}) માં છો. તમામ સત્તાવાર પ્રમાણપત્રો અને જમીન હક્કની મંજૂરી અહીંથી થશે.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-500 font-medium">
          <span>સ્થાન: <strong className="text-slate-900">{currentLocationName}</strong></span>
        </div>
      </div>

      {/* ── Details Section ── */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5 bg-white animate-in fade-in duration-200">
          {/* CASE A: Citizen is AT HOME (Only 1 Single Clean Home Kacheri Card - No Outside Box!) */}
          {!isOutsideHome ? (
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/30 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-xs shrink-0">
                    🏠
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      આધાર કાયદેસર સરનામું (Home Domicile)
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                      મુ. {citizen.village || "ગોમટા"}, તાલુકો: {citizen.taluka || "ગોંડલ"}, જિલ્લો: {citizen.districtGu || citizen.district || "રાજકોટ"}
                    </h4>
                  </div>
                </div>
                <span className="self-start sm:self-center text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  તમે હાલ તમારા ઘરના સરનામે જ છો
                </span>
              </div>

              {/* Two centers available in Home jurisdiction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Taluka Mamlatdar Office */}
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      સત્તાવાર તાલુકા કચેરી (મેજિસ્ટ્રેટ)
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                      ૪.૨ કિમી
                    </span>
                  </div>
                  <h5 className="text-sm font-extrabold text-slate-900">
                    {homeMamlatdarOffice.nameGu || homeMamlatdarOffice.name}
                  </h5>
                  <p className="text-xs text-slate-600">
                    📍 {homeMamlatdarOffice.address}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium pt-1.5 border-t border-emerald-50">
                    ✓ તમામ સત્તાવાર પ્રમાણપત્રો (આવક, જાતિ, ૭/૧૨) ની આખરી ડિજિટલ મંજૂરી આ તાલુકામાંથી જ થશે.
                  </p>
                </div>

                {/* 2. Gomta Gram Panchayat */}
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      સ્થાનિક પંચાયત / ઈ-ગ્રામ કેન્દ્ર
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                      ગામમાં જ (૦.૦ કિમી)
                    </span>
                  </div>
                  <h5 className="text-sm font-extrabold text-slate-900">
                    ગોમટા ગ્રામ પંચાયત & ઈ-ગ્રામ વિશ્વગ્રામ કેન્દ્ર
                  </h5>
                  <p className="text-xs text-slate-600">
                    📍 મુ. ગોમટા ગામ પંચાયત ભવન, તા. ગોંડલ
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium pt-1.5 border-t border-emerald-50">
                    ✓ તલાટી પંચનામું, જન્મ-મરણ દાખલો અને પ્રાથમિક અરજી અહીં સીધી જમા કરાવી શકાય છે.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                  <Sparkles size={12} className="text-emerald-600" />
                  <span>તમે ઘરે હોવાથી બહારગામનું કોઈ અલગ બોક્સ દર્શાવવાની જરૂર નથી.</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      homeMamlatdarOffice.mapQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1 shadow-2xs"
                  >
                    <Navigation size={12} />
                    <span>મામલતદાર કચેરીનો રસ્તો (Maps)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentCoords(OUTSIDE_TEST_COORDS);
                      setCurrentLocationName(OUTSIDE_TEST_COORDS.labelGu);
                    }}
                    className="px-2.5 py-1 text-slate-500 hover:text-orange-700 hover:underline text-[11px] font-semibold transition cursor-pointer"
                    title="જો તમે કામ અર્થે બહારગામ હોવ તો લાઈવ સેન્ટર ટેસ્ટ કરો"
                  >
                    (ટેસ્ટ: જો બહાર હોવ તો?)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* CASE B: Citizen is OUTSIDE HOME (Show Both: Home Jurisdiction vs Current Outside Spot) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* 1. Official Aadhaar Registered Jurisdiction */}
              <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    ૧. આધાર કાયદેસર સરનામું (મૂળ તાલુકો)
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    સત્તાવાર રેકોર્ડ
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    મુ. {citizen.village || "ગોમટા"}, તાલુકો: {citizen.taluka || "ગોંડલ"}, જિલ્લો: {citizen.districtGu || citizen.district || "રાજકોટ"}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    સત્તાવાર કચેરી: <strong>{homeMamlatdarOffice.nameGu}</strong> (~૪.૨ કિમી)
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-200 text-xs text-emerald-950 font-medium">
                  ✓ તમામ પ્રમાણપત્રો (આવક, જાતિ, ૭/૧૨) ની સત્તાવાર ડિજિટલ મંજૂરી અને સહી તમારા આ મૂળ તાલુકાના મામલતદાર દ્વારા જ થશે.
                </div>
              </div>

              {/* 2. Real-Time Location & Nearest Public Service Point Outside */}
              <div className="p-4 rounded-2xl border-2 border-orange-300 bg-orange-50/50 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-800 flex items-center gap-1.5">
                    <MapPin size={14} className="text-orange-600" />
                    ૨. હાલનું લાઈવ લોકેશન (બહારગામ)
                  </span>
                  <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full border border-orange-300">
                    હાલનું સ્થાન ({currentNearest.distanceKm} km)
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>📍 {currentLocationName}</span>
                  </h4>
                  <p className="text-xs text-slate-700 mt-1">
                    હાલના સ્થાનથી સૌથી નજીક: <strong>{currentNearest?.office.nameGu}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    અંતર: {currentNearest?.distanceKm} કિમી ({currentNearest?.travelTimeMins} મિનિટ)
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-orange-100/70 border border-orange-200 text-xs text-orange-950 font-medium">
                  💡 <strong>સુવિધા:</strong> તમે બહાર હોવા છતાં, બાયોમેટ્રિક્સ સ્કેન કે ચલણ ફી આ નજીકના કેન્દ્ર પર જઈને ભરી શકો છો.
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      currentNearest?.office.mapQuery || ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1 shadow-2xs"
                  >
                    <Navigation size={12} />
                    <span>હાલના સેન્ટરનો રસ્તો (Maps)</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleResetToHome}
                    className="px-2.5 py-1 text-slate-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>🏠 ઘેર પાછા જાઓ (રીસેટ)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nearest Offices Top 3 Table */}
          <div className="space-y-2.5 pt-1 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
              <span>🏛️ તમારા નજીકના ઉપલબ્ધ સરકારી કેન્દ્રો (Nearby Service Centers)</span>
              <Link href="/locator" className="text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1">
                <span>બધા ૩૩ જિલ્લા જુઓ →</span>
              </Link>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(isOutsideHome ? currentResults : homeResults).slice(0, 3).map((res) => {
                const off = res.office;
                return (
                  <div
                    key={off.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-orange-300 bg-white space-y-2 shadow-2xs transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 leading-snug">
                        {off.nameGu || off.name}
                      </span>
                      <span className="text-[10px] bg-slate-100 font-mono font-bold text-slate-700 px-2 py-0.5 rounded-full shrink-0">
                        {res.distanceKm} km
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-tight">
                      📍 {off.address}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-medium">
                        📞 {off.phone || "1800-233-5500"}
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(off.mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <span>મેપ</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
