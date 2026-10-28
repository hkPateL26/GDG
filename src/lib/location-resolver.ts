// ============================================
// NagrikSeva AI - Gujarat Live Geolocation Resolver
// Maps GPS coordinates (Lat/Lng) to Gujarat Village, Taluka & District
// ============================================

import { OFFICES_DATA, ExtendedOffice } from "./offices-data";

export interface ResolvedLocation {
  village: string;
  villageGu: string;
  taluka: string;
  talukaGu: string;
  district: string;
  districtGu: string;
  nearestOffice: string;
  nearestOfficeGu: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
}

// Haversine distance formula in Kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

const DISTRICT_NAMES_GU: Record<string, string> = {
  Rajkot: "રાજકોટ",
  Ahmedabad: "અમદાવાદ",
  Surat: "સુરત",
  Vadodara: "વડોદરા",
  Bhavnagar: "ભાવનગર",
  Jamnagar: "જામનગર",
  Junagadh: "જૂનાગઢ",
  Gandhinagar: "ગાંધીનગર",
  Amreli: "અમરેલી",
  Kutch: "કચ્છ",
  Mehsana: "મહેસાણા",
  Patan: "પાટણ",
  Banaskantha: "બનાસકાંઠા",
  Sabarkantha: "સાબરકાંઠા",
  Aravalli: "અરવલ્લી",
  Anand: "આણંદ",
  Kheda: "ખેડા",
  Panchmahal: "પંચમહાલ",
  Dahod: "દાહોદ",
  Mahisagar: "મહીસાગર",
  Bharuch: "ભરૂચ",
  Narmada: "નર્મદા",
  Navsari: "નવસારી",
  Valsad: "વલસાડ",
  Dang: "ડાંગ",
  Tapi: "તાપી",
  Morbi: "મોરબી",
  Surendranagar: "સુરેન્દ્રનગર",
  Porbandar: "પોરબંદર",
  DevbhumiDwarka: "દેવભૂમિ દ્વારકા",
  GirSomnath: "ગીર સોમનાથ",
  Botad: "બોટાદ",
  ChhotaUdepur: "છોટા ઉદેપુર",
};

const TALUKA_NAMES_GU: Record<string, string> = {
  Gondal: "ગોંડલ",
  Rajkot: "રાજકોટ",
  KotdaSangani: "કોટડા સાંગાણી",
  Jasdan: "જસદણ",
  Jetpur: "જેતપુર",
  Dhoraji: "ધોરાજી",
  Upleta: "ઉપલેટા",
  Lodhika: "લોધિકા",
  Paddhari: "પડધરી",
  Vinchhiya: "વિંછીયા",
  Sanand: "સાણંદ",
  Daskroi: "દસક્રોઈ",
  Dholka: "ધોળકા",
  Dhandhuka: "ધંધુકા",
  Bavla: "બાવળા",
  Viramgam: "વિરમગામ",
  Mandal: "માંડલ",
  Detroj: "દેત્રોજ",
};

export function resolveLocationFromCoordinates(
  lat: number,
  lng: number
): ResolvedLocation {
  let closestOffice: ExtendedOffice | null = null;
  let minDistance = Infinity;

  for (const office of OFFICES_DATA) {
    if (office.lat !== undefined && office.lng !== undefined) {
      const dist = calculateDistanceKm(lat, lng, office.lat, office.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestOffice = office;
      }
    }
  }

  // Fallback to Gondal / Gomta / Rajkot if coordinates are nearest to Rajkot district
  const distName = closestOffice?.district || "Rajkot";
  const talName = closestOffice?.taluka || "Gondal";

  // If closest is Gomta Gram Panchayat or near Gondal
  const isGomta =
    closestOffice?.id === "gomta-gram-panchayat" ||
    (talName === "Gondal" && minDistance < 15);

  const village = isGomta ? "Gomta" : closestOffice?.city || "Gomta";
  const villageGu = isGomta ? "ગોમટા" : "ગોમટા";

  const districtGu = DISTRICT_NAMES_GU[distName] || distName;
  const talukaGu = TALUKA_NAMES_GU[talName] || talName;

  return {
    village,
    villageGu,
    taluka: talName,
    talukaGu,
    district: distName,
    districtGu,
    nearestOffice:
      closestOffice?.name || "Taluka Seva Sadan & Mamlatdar Office, Gondal",
    nearestOfficeGu:
      closestOffice?.nameGu || "તાલુકા સેવા સદન & મામલતદાર કચેરી, ગોંડલ",
    distanceKm: minDistance === Infinity ? 0 : minDistance,
    latitude: lat,
    longitude: lng,
  };
}
