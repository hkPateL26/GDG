// ============================================
// NagrikSeva AI - Government Office & Jan Seva Kendra Database
// Gujarat Government Administrative Hierarchy & Field Formations
// ============================================

import { GovernmentOffice } from "@/types";

export interface ExtendedOffice extends GovernmentOffice {
  nameGu?: string;
  district: string;
  taluka?: string;
  category: "jan-seva" | "mamlatdar" | "collector" | "panchayat" | "aadhaar";
  mapQuery: string;
  lat?: number;
  lng?: number;
  crowdLevel?: "low" | "medium" | "high";
  estimatedWaitMins?: number;
  lunchBreak?: string;
  holidaysGu?: string;
  helpline?: string;
  tokenTimingsGu?: string;
}

export const OFFICES_DATA: ExtendedOffice[] = [
  {
    id: "gondal-taluka-mamlatdar",
    name: "Taluka Seva Sadan & Mamlatdar Office, Gondal",
    nameGu: "તાલુકા સેવા સદન & મામલતદાર કચેરી, ગોંડલ",
    type: "Mamlatdar & Jan Seva Kendra",
    district: "Rajkot",
    taluka: "Gondal",
    category: "mamlatdar",
    address: "Opposite Circuit House, Station Road, Gondal, District Rajkot",
    city: "Gondal",
    state: "Gujarat",
    pincode: "360311",
    phone: "02825-220032",
    helpline: "1800-233-5500",
    timings: "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા",
    tokenTimingsGu: "૧૦:૩૦ AM થી ૦૩:૩૦ PM (ટોકન/ચલણ) | ૦૩:૩૦ થી ૦૬:૧૦ PM (પ્રમાણપત્ર વિતરણ)",
    services: [
      "આવકનો દાખલો (Income Certificate)",
      "જાતિ & નોન-ક્રીમીલેયર પ્રમાણપત્ર",
      "૭/૧૨ અને ૮-અ જમીન હક્ક પત્રક",
      "રેશનકાર્ડ સુધારો & સભ્ય ઉમેરો",
      "જન સેવા કેન્દ્ર રોકડ ચલણ & e-Sign",
    ],
    mapQuery: "Mamlatdar+Office+Gondal+Rajkot",
    lat: 21.9619,
    lng: 70.7997,
    crowdLevel: "medium",
    estimatedWaitMins: 15,
  },
  {
    id: "gomta-gram-panchayat",
    name: "Gomta Gram Panchayat & e-Gram Vishwagram Centre",
    nameGu: "ગોમટા ગ્રામ પંચાયત & ઈ-ગ્રામ વિશ્વગ્રામ કેન્દ્ર",
    type: "Gram Panchayat & e-Gram",
    district: "Rajkot",
    taluka: "Gondal",
    category: "panchayat",
    address: "મુ. ગોમટા ગામ પંચાયત ભવન, તા. ગોંડલ, જિ. રાજકોટ",
    city: "Gomta",
    state: "Gujarat",
    pincode: "360320",
    phone: "02825-274112",
    helpline: "1800-233-5500",
    timings: "૦૯:૦૦ AM - ૦૬:૦૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "તમામ રવિવારે રજા (તલાટી પંચનામું: સોમવાર & ગુરુવાર)",
    tokenTimingsGu: "૦૯:૩૦ AM થી ૦૫:૩૦ PM (દાખલા નકલ & વેરા પાવતી)",
    services: [
      "તલાટી કમ મંત્રી આવક પંચનામું",
      "જન્મ-મરણ નોંધણી દાખલો",
      "૭/૧૨ કમ્પ્યુટરાઇઝ્ડ નકલ",
      "વીજળી બિલ & પંચાયત વેરા પાવતી",
    ],
    mapQuery: "Gomta+Panchayat+Gondal+Rajkot",
    lat: 21.9125,
    lng: 70.7654,
    crowdLevel: "low",
    estimatedWaitMins: 5,
  },
  {
    id: "rajkot-taluka-mamlatdar",
    name: "Taluka Mamlatdar & Executive Magistrate Office - Kalawad Road, Rajkot",
    nameGu: "તાલુકા મામલતદાર કચેરી, બહુમાળી ભવન / આત્મીય કોલેજ સામે, કાલાવડ રોડ, રાજકોટ",
    type: "Mamlatdar Office",
    district: "Rajkot",
    taluka: "Rajkot Rural",
    category: "mamlatdar",
    address: "Multi-Storey Building (Bahumali Bhavan), Opp. Atmiya College, Kalawad Road, Rajkot",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360005",
    phone: "0281-2451234",
    helpline: "0281-2476566 / 1076",
    timings: "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા",
    tokenTimingsGu: "૧૦:૩૦ AM થી ૦૩:૩૦ PM (અરજી સ્વીકાર & ચલણ)",
    services: [
      "૭/૧૨ & ૮-અ જમીન દસ્તાવેજો (AnyRoR)",
      "ખેડૂત ખરાઈ પ્રમાણપત્ર",
      "મહેસૂલી કેસ & સ્ટે ઓર્ડર",
      "રેશનકાર્ડ વિભાજન & ઈ-કેવાયસી",
    ],
    mapQuery: "Mamlatdar+Office+Kalawad+Road+Rajkot",
    lat: 22.2858,
    lng: 70.7725,
    crowdLevel: "medium",
    estimatedWaitMins: 20,
  },
  {
    id: "rajkot-jan-seva-collector",
    name: "District Collector Office & Jan Seva Kendra, Rajkot",
    nameGu: "કલેક્ટર કચેરી & જન સેવા કેન્દ્ર, રેસકોર્સ, રાજકોટ",
    type: "Jan Seva Kendra / Collectorate",
    district: "Rajkot",
    taluka: "Rajkot Urban",
    category: "jan-seva",
    address: "Opposite Police Commissioner Office, Race Course Ring Road, Rajkot",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360001",
    phone: "0281-2473900",
    helpline: "0281-2471800 / 1076",
    timings: "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા",
    tokenTimingsGu: "૧૦:૩૦ AM થી ૦૩:૩૦ PM (બાયોમેટ્રિક્સ & રોકડ બારી)",
    services: [
      "આવકનો દાખલો (Income Certificate)",
      "સામાજિક અને શૈક્ષણિક પછાત વર્ગ (SEBC) દાખલો",
      "નોન-ક્રીમીલેયર પ્રમાણપત્ર (ગુજરાત સરકાર)",
      "વરિષ્ઠ નાગરિક પ્રમાણપત્ર (Senior Citizen Card)",
      "આધાર કાર્ડ નવું & સુધારો",
    ],
    mapQuery: "District+Collector+Office+Rajkot",
    lat: 22.3039,
    lng: 70.8022,
    crowdLevel: "high",
    estimatedWaitMins: 35,
  },
  {
    id: "rajkot-csc-city",
    name: "Common Service Centre (CSC) - RK University Road",
    nameGu: "ડિજિટલ સેવા કેન્દ્ર (CSC) - આર.કે. યુનિવર્સિટી રોડ, રાજકોટ",
    type: "Digital Seva Kendra",
    district: "Rajkot",
    taluka: "Rajkot East",
    category: "jan-seva",
    address: "Shop No. 4, Shivalik Complex, Bhavnagar Highway, Near RK University, Rajkot",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360020",
    phone: "0281-2970555",
    helpline: "1800-121-3468",
    timings: "૦૯:૦૦ AM - ૦૭:૦૦ PM (તમામ ૭ દિવસ કાર્યરત)",
    lunchBreak: "૦૨:૦૦ PM - ૦૨:૩૦ PM",
    holidaysGu: "જાહેર રજાના દિવસે પણ ઓનલાઇન સેવા ચાલુ",
    tokenTimingsGu: "૦૯:૦૦ AM થી ૦૭:૦૦ PM (ઓનલાઇન કિયોસ્ક)",
    services: [
      "આયુષ્માન ભારત PM-JAY કાર્ડ",
      "પીએમ કિસાન e-KYC & રજીસ્ટ્રેશન",
      "પાન કાર્ડ નવું & સુધારો",
      "વીજળી બિલ & પાણી વેરા ભરપાઈ",
      "ડિજિટલ જીવન પ્રમાણપત્ર (Jeevan Pramaan)",
    ],
    mapQuery: "Common+Service+Center+Bhavnagar+Road+Rajkot",
    lat: 22.2801,
    lng: 70.8354,
    crowdLevel: "low",
    estimatedWaitMins: 10,
  },
  {
    id: "ahmedabad-jan-seva-ashram",
    name: "Jan Seva Kendra - Ahmedabad Collectorate",
    nameGu: "કલેક્ટર કચેરી & જન સેવા કેન્દ્ર, સુભાષ બ્રિજ, આશ્રમ રોડ, અમદાવાદ",
    type: "Jan Seva Kendra",
    district: "Ahmedabad",
    taluka: "Sabarmati",
    category: "jan-seva",
    address: "Near Subhash Bridge Circle, Ashram Road, Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380027",
    phone: "079-27551681",
    helpline: "079-27552682 / 1076",
    timings: "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા",
    tokenTimingsGu: "૧૦:૩૦ AM થી ૦૩:૩૦ PM",
    services: [
      "તમામ મહેસૂલી દાખલાઓ & પ્રમાણપત્રો",
      "રેશનકાર્ડ બાયોમેટ્રિક્સ & KYC",
      "ડોમિસાઇલ (કાયમી વસવાટ) પ્રમાણપત્ર",
      "સ્ટેમ્પ ડ્યુટી & દસ્તાવેજ ચકાસણી",
    ],
    mapQuery: "Collector+Office+Subhash+Bridge+Ahmedabad",
    lat: 23.0645,
    lng: 72.5815,
    crowdLevel: "high",
    estimatedWaitMins: 30,
  },
  {
    id: "surat-mamlatdar-city",
    name: "Mamlatdar Office & Jan Seva Kendra - Surat City",
    nameGu: "મામલતદાર કચેરી & જન સેવા કેન્દ્ર, નાનપુરા સેવા સદન, સુરત",
    type: "Mamlatdar Office",
    district: "Surat",
    taluka: "Choryasi",
    category: "mamlatdar",
    address: "Nanpura Seva Sadan, Athwa Lines, Surat",
    city: "Surat",
    state: "Gujarat",
    pincode: "395001",
    phone: "0261-2465321",
    helpline: "0261-2471810 / 1076",
    timings: "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા",
    tokenTimingsGu: "૧૦:૩૦ AM થી ૦૩:૩૦ PM",
    services: [
      "રેશનકાર્ડ ઓનલાઇન ટ્રાન્સફર",
      "આવક & કાયમી રહેઠાણ પ્રમાણપત્ર",
      "EWS આર્થિક નબળા વર્ગ દાખલો",
      "ચૂંટણી કાર્ડ સુધારો & નામ ઉમેરો",
    ],
    mapQuery: "Nanpura+Seva+Sadan+Surat",
    lat: 21.1865,
    lng: 72.8188,
    crowdLevel: "high",
    estimatedWaitMins: 25,
  },
  {
    id: "vadodara-kuber-bhavan",
    name: "Kuber Bhavan Civic Centre & Jan Seva Kendra, Vadodara",
    nameGu: "કુબેર ભવન નાગરિક સુવિધા કેન્દ્ર & જન સેવા, વડોદરા",
    type: "District Administrative Centre",
    district: "Vadodara",
    taluka: "Vadodara Urban",
    category: "collector",
    address: "Kuber Bhavan, Kothi Compound, Raopura, Vadodara",
    city: "Vadodara",
    state: "Gujarat",
    pincode: "390001",
    phone: "0265-2431200",
    helpline: "0265-2412850 / 1076",
    timings: "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા",
    tokenTimingsGu: "૧૦:૩૦ AM થી ૦૩:૩૦ PM",
    services: [
      "આધાર નોંધણી & અપડેટ",
      "સરકારી યોજના સબસિડી ચકાસણી",
      "સમાજ કલ્યાણ & પેન્શન વેરિફિકેશન",
    ],
    mapQuery: "Kuber+Bhavan+Vadodara",
    lat: 22.3072,
    lng: 73.1812,
    crowdLevel: "medium",
    estimatedWaitMins: 20,
  },
  {
    id: "gandhinagar-jan-seva-swarnim",
    name: "Swarnim Sankul & Gandhinagar Jan Seva Kendra",
    nameGu: "સ્વર્ણિમ સંકુલ & ગાંધીનગર જન સેવા કેન્દ્ર (સેક્ટર-૧૧)",
    type: "Jan Seva Kendra / Collectorate",
    district: "Gandhinagar",
    taluka: "Gandhinagar",
    category: "jan-seva",
    address: "Sector 11, Near GH-4 Circle, Gandhinagar",
    city: "Gandhinagar",
    state: "Gujarat",
    pincode: "382011",
    phone: "079-23253333",
    helpline: "079-23253335 / 1076",
    timings: "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા",
    tokenTimingsGu: "૧૦:૩૦ AM થી ૦૩:૩૦ PM",
    services: [
      "સચિવાલય સંબંધિત દાખલાઓ",
      "આવક/જાતિ/નોન-ક્રીમીલેયર દાખલા",
      "આધાર સુધારો & ઈ-કેવાયસી",
    ],
    mapQuery: "Collector+Office+Gandhinagar",
    lat: 23.2156,
    lng: 72.6369,
    crowdLevel: "low",
    estimatedWaitMins: 10,
  },
  {
    id: "bhavnagar-jan-seva-collector",
    name: "District Collectorate & Jan Seva Kendra, Bhavnagar",
    nameGu: "કલેક્ટર કચેરી & જન સેવા કેન્દ્ર, નવાપરા, ભાવનગર",
    type: "Jan Seva Kendra / Collectorate",
    district: "Bhavnagar",
    taluka: "Bhavnagar",
    category: "collector",
    address: "Opp. Town Hall, Nawapara, Bhavnagar",
    city: "Bhavnagar",
    state: "Gujarat",
    pincode: "364001",
    phone: "0278-2428822",
    helpline: "0278-2424101 / 1076",
    timings: "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા",
    tokenTimingsGu: "૧૦:૩૦ AM થી ૦૩:૩૦ PM",
    services: [
      "આવક અને જાતિના દાખલા",
      "૭/૧૨ કમ્પ્યુટરાઇઝ્ડ નકલ",
      "રેશનકાર્ડ ઓનલાઇન અરજી",
    ],
    mapQuery: "Collector+Office+Bhavnagar",
    lat: 21.7645,
    lng: 72.1519,
    crowdLevel: "medium",
    estimatedWaitMins: 15,
  },
  {
    id: "junagadh-taluka-mamlatdar",
    name: "Taluka Seva Sadan & Mamlatdar Office, Junagadh",
    nameGu: "તાલુકા સેવા સદન & મામલતદાર કચેરી, સરદારબાગ, જૂનાગઢ",
    type: "Mamlatdar Office",
    district: "Junagadh",
    taluka: "Junagadh",
    category: "mamlatdar",
    address: "Near Sardar Baug, Court Road, Junagadh",
    city: "Junagadh",
    state: "Gujarat",
    pincode: "362001",
    phone: "0285-2630130",
    helpline: "0285-2630600 / 1076",
    timings: "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)",
    lunchBreak: "૦૧:૩૦ PM - ૦૨:૦૦ PM",
    holidaysGu: "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા",
    tokenTimingsGu: "૧૦:૩૦ AM થી ૦૩:૩૦ PM",
    services: [
      "જમીન મહેસૂલ & સ્ટે ઓર્ડર",
      "ખેડૂત ખરાઈ દાખલો",
      "આવક & કાયમી વસવાટ પ્રમાણપત્ર",
    ],
    mapQuery: "Mamlatdar+Office+Junagadh",
    lat: 21.5222,
    lng: 70.4579,
    crowdLevel: "medium",
    estimatedWaitMins: 20,
  },
];

/**
 * Calculate Great-Circle Distance (Haversine formula) in kilometers.
 */
export function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Generate a direct Google Maps Directions URL (Turn-by-turn road route).
 * Automatically plots origin -> destination route path, distance, and duration.
 */
export function getDirectionsUrl(
  destLat?: number,
  destLng?: number,
  destQuery?: string,
  userLat?: number,
  userLng?: number
): string {
  const destination =
    destLat !== undefined && destLng !== undefined
      ? `${destLat},${destLng}`
      : encodeURIComponent(destQuery || "Gujarat Government Office");

  if (userLat !== undefined && userLng !== undefined) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destination}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
}

/**
 * Real Gujarat Government Office Hours & Holiday Status Evaluator (GAD Gujarat).
 * Working Days: Monday to Saturday (Except 2nd & 4th Saturday).
 * Working Hours: 10:30 AM to 06:10 PM.
 * Lunch Break: 01:30 PM to 02:00 PM.
 */
export interface GujaratOfficeStatus {
  isOpen: boolean;
  isLunchBreak: boolean;
  isHoliday: boolean;
  statusTextGu: string;
  badgeClass: string;
  timingsGu: string;
  lunchBreakGu: string;
  holidaysGu: string;
}

export function getGujaratOfficeStatus(date?: Date): GujaratOfficeStatus {
  const now = date || new Date();
  
  // Calculate IST (Indian Standard Time UTC+5:30)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 5.5 * 3600000);
  
  const day = istDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const dateOfMonth = istDate.getDate();
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const totalMins = hours * 60 + minutes;

  const timingsGu = "૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)";
  const lunchBreakGu = "૦૧:૩૦ PM - ૦૨:૦૦ PM (ભોજન વિરામ)";
  const holidaysGu = "૨જો & ૪થો શનિવાર તેમજ તમામ રવિવારે રજા";

  // Sunday Closed
  if (day === 0) {
    return {
      isOpen: false,
      isLunchBreak: false,
      isHoliday: true,
      statusTextGu: "🔴 આજે રવિવાર (સરકારી રજા)",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
      timingsGu,
      lunchBreakGu,
      holidaysGu,
    };
  }

  // 2nd or 4th Saturday Closed
  if (day === 6) {
    const saturdayRank = Math.ceil(dateOfMonth / 7);
    if (saturdayRank === 2 || saturdayRank === 4) {
      return {
        isOpen: false,
        isLunchBreak: false,
        isHoliday: true,
        statusTextGu: `🔴 આજે ${saturdayRank === 2 ? "૨જો" : "૪થો"} શનિવાર (સરકારી રજા)`,
        badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
        timingsGu,
        lunchBreakGu,
        holidaysGu,
      };
    }
  }

  // Lunch Break: 1:30 PM (810 mins) to 2:00 PM (840 mins)
  if (totalMins >= 810 && totalMins < 840) {
    return {
      isOpen: true,
      isLunchBreak: true,
      isHoliday: false,
      statusTextGu: "🟡 ભોજન વિરામ (૦૧:૩૦ - ૦૨:૦૦ PM)",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
      timingsGu,
      lunchBreakGu,
      holidaysGu,
    };
  }

  // Working Hours: 10:30 AM (630 mins) to 6:10 PM (1090 mins)
  if (totalMins >= 630 && totalMins <= 1090) {
    return {
      isOpen: true,
      isLunchBreak: false,
      isHoliday: false,
      statusTextGu: "🟢 કચેરી ખુલ્લી છે (૧૦:૩૦ AM - ૦૬:૧૦ PM)",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      timingsGu,
      lunchBreakGu,
      holidaysGu,
    };
  }

  // Morning before opening
  if (totalMins < 630) {
    return {
      isOpen: false,
      isLunchBreak: false,
      isHoliday: false,
      statusTextGu: "🟡 આજે સવારે ૧૦:૩૦ વાગ્યે ખુલશે",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
      timingsGu,
      lunchBreakGu,
      holidaysGu,
    };
  }

  // Evening after closing
  return {
    isOpen: false,
    isLunchBreak: false,
    isHoliday: false,
    statusTextGu: "🔴 કચેરી બંધ થઈ ગઈ છે (આવતીકાલે ૧૦:૩૦ AM ખુલશે)",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    timingsGu,
    lunchBreakGu,
    holidaysGu,
  };
}

export interface NearestOfficeResult {
  office: ExtendedOffice;
  distanceKm: number;
  travelTimeMins: number;
  isHomeJurisdiction: boolean;
  adviceGu: string;
}

export function findNearestOffices(
  userLat: number,
  userLng: number,
  citizenDistrict: string = "Rajkot",
  citizenTaluka: string = "Gondal"
): NearestOfficeResult[] {
  const scored = OFFICES_DATA.map((office) => {
    const oLat = office.lat || 22.3039;
    const oLng = office.lng || 70.8022;
    const distanceKm = calculateHaversineKm(userLat, userLng, oLat, oLng);
    const travelTimeMins = Math.max(3, Math.round(distanceKm * 2.2));
    const isHomeJurisdiction =
      office.district.toLowerCase() === citizenDistrict.toLowerCase() &&
      (!office.taluka || office.taluka.toLowerCase() === citizenTaluka.toLowerCase());

    let adviceGu = "";
    if (isHomeJurisdiction) {
      adviceGu = `આ કચેરી તમારા કાયદેસર આધાર અધિકારક્ષેત્ર (${citizenTaluka}, ${citizenDistrict}) ની સત્તાવાર મામલતદાર શાખા છે. તમામ દાખલાઓ અને જમીન મંજૂરી અહીંથી થશે.`;
    } else {
      adviceGu = `તમે હાલ તમારા તાલુકા (${citizenTaluka}) થી બહાર છો. આ સેન્ટર પરથી તમે આધાર બાયોમેટ્રિક્સ કે ફી ચલણ ભરી શકો છો, જ્યારે સત્તાવાર આખરી મંજૂરી મૂળ તાલુકામાંથી થશે.`;
    }

    return {
      office,
      distanceKm,
      travelTimeMins,
      isHomeJurisdiction,
      adviceGu,
    };
  });

  return scored.sort((a, b) => a.distanceKm - b.distanceKm);
}
