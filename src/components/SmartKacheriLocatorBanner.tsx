"use client";

import { useState, useEffect, useCallback } from "react";
import {
  findNearestOffices,
  NearestOfficeResult,
  calculateHaversineKm,
  getDirectionsUrl,
  getGujaratOfficeStatus,
  OFFICES_DATA,
} from "@/lib/offices-data";
import {
  Navigation,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  LocateFixed,
  ShieldCheck,
  RotateCcw,
  Phone,
  Sparkles,
  MapPin,
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
  defaultExpanded?: boolean;
  onClose?: () => void;
}

// Official Home Coordinates for citizen (Omnagar, Rajkot city)
const HOME_COORDS = {
  lat: 22.2868,
  lng: 70.7893,
  labelGu: "ઓમ નગર, રાજકોટ (ઘરે)",
};

// Simulated Outside Coordinate for testing (Rajkot City - Kalawad Road)
const OUTSIDE_TEST_COORDS = {
  lat: 22.2858,
  lng: 70.7725,
  labelGu: "રાજકોટ શહેર (કાલાવડ રોડ)",
};

export default function SmartKacheriLocatorBanner({
  citizen,
  defaultExpanded = false,
  onClose,
}: SmartKacheriLocatorBannerProps) {
  // Coordinates & Dynamic Real-time Location State
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(HOME_COORDS);
  const [currentLocationName, setCurrentLocationName] = useState<string>("લાઈવ લોકેશન મેળવી રહ્યું છે...");
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Real Gujarat Government Office Live Status (Hours, Lunch Break, 2nd/4th Sat)
  const officeStatus = getGujaratOfficeStatus();

  // Dynamic Real-time GPS Detection Handler
  const detectLiveLocation = useCallback((showFeedback: boolean = false) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      if (showFeedback) setGpsError("આ બ્રાઉઝરમાં જીપીએસ ઉપલબ્ધ નથી.");
      setCurrentLocationName(HOME_COORDS.labelGu);
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
          setCurrentLocationName(`લાઈવ GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
        }
        setIsGpsLoading(false);
      },
      (err) => {
        console.log("Geolocation permission info:", err.message);
        setIsGpsLoading(false);
        // Default seamlessly to registered home address without blocking user
        setCurrentCoords(HOME_COORDS);
        setCurrentLocationName(HOME_COORDS.labelGu);
        if (showFeedback) {
          setGpsError("જીપીએસ પરવાનગી ન મળતાં આધાર કાયમી સરનામું (ગોંડલ) સેટ કર્યું છે.");
          setTimeout(() => setGpsError(null), 4000);
        }
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  }, []);

  // ⚡ DYNAMIC AUTO-DETECTION ON LOGIN / MOUNT: Never stay static!
  useEffect(() => {
    let isMounted = true;
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isMounted) return;
          const { latitude, longitude } = pos.coords;
          setCurrentCoords({ lat: latitude, lng: longitude });

          const dist = calculateHaversineKm(latitude, longitude, HOME_COORDS.lat, HOME_COORDS.lng);
          if (dist <= 5.0) {
            setCurrentLocationName(HOME_COORDS.labelGu);
          } else {
            setCurrentLocationName(`લાઈવ GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
          }
        },
        (err) => {
          if (!isMounted) return;
          console.log("GPS permission status:", err.message);
          setCurrentLocationName(HOME_COORDS.labelGu);
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    }
    return () => {
      isMounted = false;
    };
  }, []);

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

  // 2. Current Location Nearest Office (Dynamic Real-time Nearest)
  const currentResults: NearestOfficeResult[] = findNearestOffices(
    currentCoords.lat,
    currentCoords.lng,
    citizen.district || "Rajkot",
    citizen.taluka || "Gondal"
  );
  const currentNearest = currentResults[0];

  // Active office depending on whether citizen is at home or outside
  const activeOffice = isOutsideHome ? currentNearest : homeNearest;

  // Direct turn-by-turn driving route URL (plots exact path and distance)
  const activeDirectionsUrl = getDirectionsUrl(
    activeOffice?.office.lat,
    activeOffice?.office.lng,
    activeOffice?.office.mapQuery || "",
    currentCoords.lat,
    currentCoords.lng
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300">
      {/* ── Top Header / Quick Status Bar (Clean, Airy & Spaced) ── */}
      <div className="bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-slate-50 p-4 sm:p-5 border-b border-orange-100/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Information Section */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
            🏛️
          </div>

          <div className="min-w-0 space-y-1">
            {/* Top Badges Row - Clean and Uncrowded */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-orange-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                AI કચેરી નેવિગેટર
              </span>

              {isGpsLoading ? (
                <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <LocateFixed size={10} className="animate-spin text-blue-600" />
                  લાઈવ GPS ચકાસી રહ્યું છે...
                </span>
              ) : isOutsideHome ? (
                <span className="bg-amber-100 text-amber-950 border border-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                  📍 લાઈવ: બહારગામ ({distanceFromHome} km)
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  🏠 મૂળ સરનામે (ગોંડલ)
                </span>
              )}

              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${officeStatus.badgeClass}`}>
                {officeStatus.statusTextGu}
              </span>
            </div>

            {/* Office Title */}
            <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
              {isOutsideHome ? "હાલના લાઈવ સ્થાનથી નજીકનું કેન્દ્ર: " : "સૌથી નજીકની કચેરી: "}
              <span className="text-orange-700 underline decoration-orange-300 underline-offset-2">
                {activeOffice?.office.nameGu || activeOffice?.office.name}
              </span>
            </h3>

            {/* Key Metrics - Distance, Hours & Official Phone */}
            <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap pt-0.5">
              <span className="font-extrabold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                <Navigation size={12} className="text-orange-600" />
                {activeOffice?.distanceKm} કિમી (~{activeOffice?.travelTimeMins} મિનિટ)
              </span>

              <span className="flex items-center gap-1 text-slate-700">
                <Clock size={12} className="text-emerald-700" />
                {activeOffice?.office.timings || officeStatus.timingsGu}
              </span>

              {activeOffice?.office.phone && (
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Phone size={11} className="text-blue-600" />
                  <a href={`tel:${activeOffice?.office.phone}`} className="text-blue-700 hover:underline">
                    {activeOffice?.office.phone}
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions - Driving Route & GPS Trigger */}
        <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
          {/* Main Driving Route Button */}
          <a
            href={activeDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="ગૂગલ મેપ્સમાં ડ્રાઈવિંગ રસ્તો (Path) અને લાઈવ રૂટ જુઓ"
          >
            <Navigation size={13} />
            <span>ડ્રાઈવિંગ રસ્તો (Maps)</span>
            <ExternalLink size={11} className="opacity-80" />
          </a>

          {/* GPS Refresh Button */}
          <button
            type="button"
            onClick={() => detectLiveLocation(true)}
            disabled={isGpsLoading}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl transition cursor-pointer shadow-2xs active:scale-95"
            title="લાઈવ GPS રિફ્રેશ કરો"
          >
            <LocateFixed size={15} className={isGpsLoading ? "animate-spin text-orange-600" : "text-slate-600"} />
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl transition cursor-pointer shadow-2xs"
            title={isExpanded ? "વિગતો સંકોચો" : "વિગતવાર જુઓ"}
          >
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {/* Close button if shown in modal/drawer */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 bg-white hover:bg-rose-50 border border-slate-200 text-slate-500 hover:text-rose-600 rounded-xl transition cursor-pointer shadow-2xs text-xs font-bold"
              title="કચેરી લોકેટર બંધ કરો"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {gpsError && (
        <div className="p-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 flex items-center justify-between">
          <span>⚠️ {gpsError}</span>
          <button type="button" onClick={() => setGpsError(null)} className="font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* ── Subtitle AI Insight Pill ── */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="p-1 bg-amber-100 text-amber-900 rounded-md font-bold text-[10px] flex items-center gap-1 shrink-0">
            <Sparkles size={11} /> AI સલાહ
          </span>
          <p className="leading-snug">
            {isOutsideHome
              ? `તમે હાલ તમારા મૂળ તાલુકા (${citizen.taluka || "ગોંડલ"}) થી બહાર છો. આ નજીકના સેન્ટર પર બાયોમેટ્રિક્સ કે ફી ચલણ ભરી શકો છો; સત્તાવાર આખરી મંજૂરી ગોંડલથી થશે.`
              : `તમે તમારા આધાર અધિકારક્ષેત્ર (${citizen.taluka || "ગોંડલ"}) માં છો. તમામ સત્તાવાર પ્રમાણપત્રોની મંજૂરી આ જ કચેરી દ્વારા થશે.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-500 font-medium">
          <span>સ્થાન: <strong className="text-slate-900">{currentLocationName}</strong></span>
        </div>
      </div>

      {/* ── Details Section (Spacious, Breathable & Clean) ── */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 bg-white animate-in fade-in duration-200">
          {/* CASE A: Citizen is AT HOME (Only 1 Single Clean Home Kacheri Card - No Outside Box!) */}
          {!isOutsideHome ? (
            <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 space-y-5 shadow-xs">
              {/* Home Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                    🏠
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      આધાર કાયદેસર સરનામું (Home Domicile)
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900">
                      મુ. {citizen.village || "ગોમટા"}, તાલુકો: {citizen.taluka || "ગોંડલ"}, જિલ્લો: {citizen.districtGu || citizen.district || "રાજકોટ"}
                    </h4>
                  </div>
                </div>

                <span className="self-start sm:self-center text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  તમે હાલ તમારા ઘરના સરનામે જ છો
                </span>
              </div>

              {/* Two Cleanly Spaced Sub-Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Taluka Mamlatdar Office Gondal */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
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

                    <div className="text-xs text-slate-600 space-y-1 pt-1.5 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span>સત્તાવાર ફોન:</span>
                        <a href={`tel:${homeMamlatdarOffice.phone}`} className="font-bold text-emerald-800 hover:underline">
                          {homeMamlatdarOffice.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>કચેરી સમય:</span>
                        <span className="font-medium">૧૦:૩૦ AM - ૦૬:૧૦ PM</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={getDirectionsUrl(
                      homeMamlatdarOffice.lat,
                      homeMamlatdarOffice.lng,
                      homeMamlatdarOffice.mapQuery,
                      HOME_COORDS.lat,
                      HOME_COORDS.lng
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Navigation size={12} />
                    <span>ઘરેથી કચેરીનો રસ્તો (Directions)</span>
                    <ExternalLink size={10} />
                  </a>
                </div>

                {/* 2. Gomta Gram Panchayat */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
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

                    <div className="text-xs text-slate-600 space-y-1 pt-1.5 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span>પંચાયત ફોન:</span>
                        <a href="tel:02825274112" className="font-bold text-emerald-800 hover:underline">
                          02825-274112
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>પંચાયત સમય:</span>
                        <span className="font-medium">૦૯:૦૦ AM - ૦૬:૦૦ PM</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={getDirectionsUrl(
                      21.9125,
                      70.7654,
                      "Gomta Panchayat Gondal",
                      HOME_COORDS.lat,
                      HOME_COORDS.lng
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Navigation size={12} />
                    <span>પંચાયત ભવનનો રસ્તો (Maps)</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              {/* Bottom Clean Guidance */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-100 text-xs">
                <span className="text-emerald-800 font-medium">
                  ✓ આવક, જાતિ અને ૭/૧૨ ની તમામ સત્તાવાર ડિજિટલ મંજૂરી આ જ કચેરી દ્વારા થશે.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentCoords(OUTSIDE_TEST_COORDS);
                    setCurrentLocationName(OUTSIDE_TEST_COORDS.labelGu);
                  }}
                  className="text-slate-400 hover:text-orange-700 text-[11px] underline cursor-pointer"
                  title="બહારગામ ગયા હોવ તો કેવું દેખાય તે ટેસ્ટ કરો"
                >
                  (ટેસ્ટ: જો બહાર હોવ તો?)
                </button>
              </div>
            </div>
          ) : (
            /* CASE B: Citizen is OUTSIDE HOME (Two Distinct, Breathable Cards) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Home Jurisdiction (Aadhaar Registered) */}
              <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
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
                    <p className="text-xs text-slate-600 mt-0.5">
                      સત્તાવાર કચેરી: <strong>{homeMamlatdarOffice.nameGu}</strong>
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">કચેરી ફોન:</span>
                      <a href={`tel:${homeMamlatdarOffice.phone}`} className="font-bold text-emerald-800 hover:underline">
                        {homeMamlatdarOffice.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>સમય:</span>
                      <span>૧૦:૩૦ AM - ૦૬:૧૦ PM</span>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-950 font-medium bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-200">
                    ✓ તમારી અરજીઓની આખરી ડિજિટલ મંજૂરી આ મૂળ તાલુકાના મામલતદાર દ્વારા થશે.
                  </p>
                </div>

                <a
                  href={getDirectionsUrl(
                    homeMamlatdarOffice.lat,
                    homeMamlatdarOffice.lng,
                    homeMamlatdarOffice.mapQuery,
                    currentCoords.lat,
                    currentCoords.lng
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Navigation size={12} />
                  <span>મૂળ કચેરીનો રસ્તો (Directions)</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              {/* Card 2: Current Spot Outside (Real-time Live Spot) */}
              <div className="p-5 rounded-2xl border-2 border-orange-300 bg-orange-50/50 space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
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
                    <h4 className="font-extrabold text-sm text-slate-900">
                      📍 {currentLocationName}
                    </h4>
                    <p className="text-xs text-slate-700 mt-0.5">
                      સૌથી નજીકનું કેન્દ્ર: <strong>{currentNearest?.office.nameGu}</strong>
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-orange-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">કેન્દ્ર ફોન:</span>
                      <a href={`tel:${currentNearest.office.phone}`} className="font-bold text-orange-800 hover:underline">
                        {currentNearest.office.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>સમય:</span>
                      <span>૧૦:૩૦ AM - ૦૬:૧૦ PM</span>
                    </div>
                  </div>

                  <p className="text-xs text-orange-950 font-medium bg-orange-100/70 p-2.5 rounded-xl border border-orange-200">
                    💡 બહાર હોવા છતાં, બાયોમેટ્રિક્સ સ્કેન કે રોકડ ચલણ આ નજીકના કેન્દ્ર પર ભરી શકાય છે.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getDirectionsUrl(
                      currentNearest.office.lat,
                      currentNearest.office.lng,
                      currentNearest.office.mapQuery,
                      currentCoords.lat,
                      currentCoords.lng
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Navigation size={12} />
                    <span>હાલના સેન્ટરનો રસ્તો (Maps)</span>
                    <ExternalLink size={10} />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentCoords(HOME_COORDS);
                      setCurrentLocationName(HOME_COORDS.labelGu);
                    }}
                    className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer shrink-0"
                    title="ઘરના લોકેશન પર પાછા ફરો"
                  >
                    <RotateCcw size={12} />
                    <span>રીસેટ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Compact Nearby Centers Row */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                🏛️ અન્ય નજીકના સરકારી કેન્દ્રો
              </h4>
              <Link href="/locator" className="text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1">
                <span>બધા ૩૩ જિલ્લા →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(isOutsideHome ? currentResults : homeResults).slice(0, 3).map((res) => {
                const off = res.office;
                const directionsUrl = getDirectionsUrl(
                  off.lat,
                  off.lng,
                  off.mapQuery,
                  currentCoords.lat,
                  currentCoords.lng
                );

                return (
                  <div
                    key={off.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-orange-300 bg-white space-y-2 shadow-2xs transition flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                          {off.nameGu || off.name}
                        </span>
                        <span className="text-[10px] bg-slate-100 font-mono font-bold text-slate-700 px-1.5 py-0.5 rounded-md shrink-0">
                          {res.distanceKm} km
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        📍 {off.address}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <a href={`tel:${off.phone}`} className="text-slate-600 hover:underline font-medium">
                        📞 {off.phone}
                      </a>
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <span>રસ્તો</span>
                        <ExternalLink size={9} />
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
