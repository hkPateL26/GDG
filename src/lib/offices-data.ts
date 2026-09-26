// ============================================
// NagrikSeva AI - Government Office & Jan Seva Kendra Database
// ============================================

import { GovernmentOffice } from "@/types";

export interface ExtendedOffice extends GovernmentOffice {
  district: string;
  category: "jan-seva" | "mamlatdar" | "collector" | "panchayat" | "aadhaar";
  mapQuery: string;
}

export const OFFICES_DATA: ExtendedOffice[] = [
  {
    id: "rajkot-jan-seva-collector",
    name: "District Collector Office & Jan Seva Kendra",
    type: "Jan Seva Kendra / Collectorate",
    district: "Rajkot",
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
  },
  {
    id: "rajkot-taluka-mamlatdar",
    name: "Taluka Mamlatdar Office - Rajkot Rural",
    type: "Mamlatdar Office",
    district: "Rajkot",
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
  },
];
