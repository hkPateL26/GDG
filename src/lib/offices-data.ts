// ============================================
// NagrikSeva AI - Government Office & Jan Seva Kendra Database
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
    timings: "10:30 AM - 06:10 PM (સોમ થી શનિ)",
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
    timings: "09:00 AM - 06:00 PM (સોમ થી શનિ)",
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
    id: "rajkot-jan-seva-collector",
    name: "District Collector Office & Jan Seva Kendra",
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
    timings: "10:30 AM - 05:30 PM (Mon to Sat)",
    services: [
      "Income Certificate (આવકનો દાખલો)",
      "Caste Certificate (જાતિનો દાખલો)",
      "Non-Creamy Layer Certificate",
      "Ration Card Addition/Deletion",
      "Senior Citizen Certificate",
    ],
    mapQuery: "District+Collector+Office+Rajkot",
    lat: 22.3039,
    lng: 70.8022,
    crowdLevel: "high",
    estimatedWaitMins: 35,
  },
  {
    id: "rajkot-taluka-mamlatdar",
    name: "Taluka Mamlatdar Office - Rajkot Rural",
    nameGu: "તાલુકા મામલતદાર કચેરી, બહુમાળી ભવન, કાલાવડ રોડ, રાજકોટ",
    type: "Mamlatdar Office",
    district: "Rajkot",
    taluka: "Rajkot Rural",
    category: "mamlatdar",
    address: "Multi-Storey Building, Near Kotecha Chowk, Kalawad Road, Rajkot",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360005",
    phone: "0281-2451234",
    timings: "10:30 AM - 05:00 PM (Working days)",
    services: [
      "7/12 & 8-A Land Records (જમીનના દસ્તાવેજો)",
      "Farmer Certificate (ખેડૂત પ્રમાણપત્ર)",
      "Revenue Matters",
      "Disaster Relief Applications",
    ],
    mapQuery: "Mamlatdar+Office+Rajkot",
    lat: 22.2858,
    lng: 70.7725,
    crowdLevel: "medium",
    estimatedWaitMins: 20,
  },
  {
    id: "rajkot-csc-city",
    name: "Common Service Centre (CSC) - RK University Road",
    type: "Digital Seva Kendra",
    district: "Rajkot",
    category: "jan-seva",
    address: "Shop No. 4, Shivalik Complex, Bhavnagar Highway, Rajkot",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360020",
    phone: "0281-2970555",
    timings: "09:00 AM - 07:00 PM (All 7 days)",
    services: [
      "Ayushman PM-JAY Card Generation",
      "PM Kisan e-KYC & Registration",
      "PAN Card New & Correction",
      "Electricity / Water Bill Payments",
      "Digital Life Certificate (Jeevan Pramaan)",
    ],
    mapQuery: "Common+Service+Center+Bhavnagar+Road+Rajkot",
  },
  {
    id: "ahmedabad-jan-seva-ashram",
    name: "Jan Seva Kendra - Ahmedabad Collectorate",
    type: "Jan Seva Kendra",
    district: "Ahmedabad",
    category: "jan-seva",
    address: "Near Subhash Bridge, Ashram Road, Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380027",
    phone: "079-27551681",
    timings: "10:30 AM - 05:30 PM",
    services: [
      "All Revenue Certificates",
      "Ration Card Biometric & KYC",
      "Domicile Certificate",
      "Stamp Duty & Registration Verification",
    ],
    mapQuery: "Collector+Office+Subhash+Bridge+Ahmedabad",
  },
  {
    id: "surat-mamlatdar-city",
    name: "Mamlatdar & Jan Seva Kendra - Surat City",
    type: "Mamlatdar Office",
    district: "Surat",
    category: "mamlatdar",
    address: "Nanpura Seva Sadan, Athwa Lines, Surat",
    city: "Surat",
    state: "Gujarat",
    pincode: "395001",
    phone: "0261-2465321",
    timings: "10:30 AM - 05:30 PM",
    services: [
      "Ration Card Online Transfers",
      "Income & Domicile Certificates",
      "EWS Certificate Issuance",
    ],
    mapQuery: "Nanpura+Seva+Sadan+Surat",
  },
  {
    id: "vadodara-kuber-bhavan",
    name: "Kuber Bhavan Civic Centre & Jan Seva",
    type: "District Administrative Centre",
    district: "Vadodara",
    category: "collector",
    address: "Kuber Bhavan, Kothi Compound, Raopura, Vadodara",
    city: "Vadodara",
    state: "Gujarat",
    pincode: "390001",
    phone: "0265-2431200",
    timings: "10:30 AM - 05:00 PM",
    services: [
      "Aadhaar Enrollment & Updates",
      "Government Scheme Subsidies",
      "Social Welfare & Pension Verifications",
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
    timings: "10:30 AM - 05:30 PM (સોમ થી શનિ)",
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
];

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
