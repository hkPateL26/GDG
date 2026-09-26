// ============================================
// Universal Firestore Seeding Script (Web SDK)
// Run: node --env-file=.env.local scripts/seed-firestore-web.mjs
// ============================================

import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";
import fs from "fs";

// Read .env.local if not already in process.env
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    envFile.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [k, ...v] = trimmed.split("=");
        if (k && v.length) process.env[k.trim()] = v.join("=").trim();
      }
    });
  } catch (err) {
    console.warn("Could not read .env.local file directly");
  }
}

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("🔥 Initializing Firebase with Project ID:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const SCHEMES = [
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    nameGu: "PM કિસાન સન્માન નિધિ",
    nameHi: "PM किसान सम्मान निधि",
    category: "agriculture",
    description: "Financial support of Rs.6000/year to farmer families",
    benefits: ["Rs.6000 per year in 3 installments", "Direct bank transfer", "All small/marginal farmers"],
    eligibility: { occupation: ["farmer"], minAge: 18, maxAge: 99, incomeLimit: 0 },
    documents: ["Aadhaar Card", "Bank Passbook", "Land Records (7/12)", "Mobile Number"],
    applicationUrl: "https://pmkisan.gov.in",
    icon: "🌾",
    ministry: "Ministry of Agriculture",
    isActive: true,
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    nameGu: "આયુષ્માન ભારત PM-JAY",
    nameHi: "आयुष्मान भारत PM-JAY",
    category: "health",
    description: "Rs.5 lakh health insurance for poor and vulnerable families",
    benefits: ["Rs.5 lakh cover per family per year", "Cashless treatment at 2000+ hospitals", "No age limit"],
    eligibility: { incomeLimit: 200000, minAge: 0, maxAge: 99 },
    documents: ["Aadhaar Card", "Ration Card", "Income Certificate", "SECC Verification"],
    applicationUrl: "https://pmjay.gov.in",
    icon: "🏥",
    ministry: "Ministry of Health",
    isActive: true,
  },
  {
    id: "pm-awas-gramin",
    name: "PM Awas Yojana Gramin",
    nameGu: "PM આવાસ યોજના ગ્રામ",
    nameHi: "PM आवास योजना ग्रामीण",
    category: "housing",
    description: "Financial assistance for pucca house construction in rural areas",
    benefits: ["Rs.1.2 lakh (plain areas)", "Rs.1.3 lakh (hilly/NE)", "Additional toilet grant"],
    eligibility: { incomeLimit: 300000, minAge: 18, maxAge: 99 },
    documents: ["Aadhaar Card", "SECC/BPL List", "Bank Account", "Land Documents"],
    applicationUrl: "https://pmayg.nic.in",
    icon: "🏠",
    ministry: "Ministry of Rural Development",
    isActive: true,
  },
  {
    id: "ujjwala-yojana",
    name: "PM Ujjwala Yojana 2.0",
    nameGu: "PM ઉજ્જવલા યોજના",
    nameHi: "PM उज्ज्वला योजना",
    category: "energy",
    description: "Free LPG connection to women from BPL households",
    benefits: ["Free LPG connection", "First refill free", "Subsidy on subsequent refills"],
    eligibility: { gender: "female", incomeLimit: 200000, minAge: 18, maxAge: 99 },
    documents: ["Aadhaar Card", "BPL Ration Card", "Bank Passbook", "Self-declaration form"],
    applicationUrl: "https://pmuy.gov.in",
    icon: "🔥",
    ministry: "Ministry of Petroleum",
    isActive: true,
  },
  {
    id: "mudra-loan",
    name: "PM Mudra Yojana",
    nameGu: "PM મુદ્રા યોજના",
    nameHi: "PM मुद्रा योजना",
    category: "business",
    description: "Micro loans for non-farm small/micro enterprises",
    benefits: ["Shishu: up to Rs.50,000", "Kishore: Rs.50K-5L", "Tarun: Rs.5L-10L", "No collateral"],
    eligibility: { minAge: 18, maxAge: 65 },
    documents: ["Aadhaar + PAN Card", "Business Plan", "Bank Statement 6 months", "Address Proof"],
    applicationUrl: "https://mudra.org.in",
    icon: "💼",
    ministry: "Ministry of Finance",
    isActive: true,
  },
  {
    id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana",
    nameGu: "સુકન્યા સમૃદ્ધિ યોજના",
    nameHi: "सुकन्या समृद्धि योजना",
    category: "women",
    description: "Savings scheme for girl child education and marriage expenses",
    benefits: ["8.2% interest (tax-free)", "Tax benefit under Sec 80C", "Partial withdrawal at age 18"],
    eligibility: { gender: "female", maxAge: 10, minAge: 0 },
    documents: ["Girl Child Birth Certificate", "Parent Aadhaar + PAN", "Address Proof", "Photo"],
    applicationUrl: "https://www.indiapost.gov.in",
    icon: "👧",
    ministry: "Ministry of Finance",
    isActive: true,
  },
  {
    id: "fasal-bima",
    name: "PM Fasal Bima Yojana",
    nameGu: "PM ફસલ વીમા યોજના",
    nameHi: "PM फसल बीमा योजना",
    category: "agriculture",
    description: "Comprehensive crop insurance against natural calamities",
    benefits: ["Low premium: 2% Kharif, 1.5% Rabi", "Full sum insured coverage", "Quick claim settlement"],
    eligibility: { occupation: ["farmer"], minAge: 18, maxAge: 99 },
    documents: ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"],
    applicationUrl: "https://pmfby.gov.in",
    icon: "🌱",
    ministry: "Ministry of Agriculture",
    isActive: true,
  },
  {
    id: "jan-dhan",
    name: "PM Jan Dhan Yojana",
    nameGu: "PM જન ધન યોજના",
    nameHi: "PM जन धन योजना",
    category: "social",
    description: "Zero balance bank account with insurance and overdraft facility",
    benefits: ["Zero balance account", "Rs.2 lakh accident insurance", "Rs.10,000 overdraft", "Rupay debit card"],
    eligibility: { minAge: 10, maxAge: 99 },
    documents: ["Aadhaar Card", "1 Passport Photo", "Mobile Number"],
    applicationUrl: "https://pmjdy.gov.in",
    icon: "🏦",
    ministry: "Ministry of Finance",
    isActive: true,
  },
  {
    id: "skill-india",
    name: "PM Kaushal Vikas Yojana",
    nameGu: "PM કૌશલ્ય વિકાસ યોજના",
    nameHi: "PM कौशल विकास योजना",
    category: "education",
    description: "Free skill training and government certification for youth",
    benefits: ["Free training", "Government-recognized certificate", "Placement assistance", "Rs.8000 reward"],
    eligibility: { minAge: 15, maxAge: 45 },
    documents: ["Aadhaar Card", "Educational Certificate", "Bank Account", "Passport Photo"],
    applicationUrl: "https://pmkvyofficial.org",
    icon: "🎓",
    ministry: "Ministry of Skill Development",
    isActive: true,
  },
  {
    id: "atal-pension",
    name: "Atal Pension Yojana",
    nameGu: "અટલ પેન્શન યોજના",
    nameHi: "અટલ પેન્શન યોજના",
    category: "social",
    description: "Monthly pension scheme for unorganized sector workers",
    benefits: ["Rs.1000-5000 monthly pension", "Government co-contribution (50%)", "Spouse pension on death"],
    eligibility: { minAge: 18, maxAge: 40 },
    documents: ["Aadhaar Card", "Savings Bank Account", "Mobile Number"],
    applicationUrl: "https://npscra.nsdl.co.in",
    icon: "👴",
    ministry: "Ministry of Finance",
    isActive: true,
  },
];

const APPLICATIONS = [
  {
    id: "APP001",
    scheme: "PM Kisan Samman Nidhi",
    schemeEmoji: "🌾",
    status: "approved",
    date: "2026-09-01",
    remarks: "₹2000 successfully credited to your linked bank account.",
  },
  {
    id: "APP002",
    scheme: "Ayushman Bharat PM-JAY",
    schemeEmoji: "🏥",
    status: "processing",
    date: "2026-09-10",
    remarks: "Documents under verification. Expected in 7 working days.",
  },
  {
    id: "APP003",
    scheme: "PM Awas Yojana",
    schemeEmoji: "🏠",
    status: "pending",
    date: "2026-09-15",
    remarks: "Awaiting field officer verification at your address.",
  },
  {
    id: "APP004",
    scheme: "Mudra Loan (Kishore)",
    schemeEmoji: "💼",
    status: "rejected",
    date: "2026-09-05",
    remarks: "Income proof document missing. Please reapply with proper documents.",
  },
];

async function seed() {
  console.log("🚀 Starting Firestore Seeding (Schemes + Applications)...");
  const batch = writeBatch(db);

  for (const s of SCHEMES) {
    const sRef = doc(db, "schemes", s.id);
    batch.set(sRef, s);
    console.log(`  ➕ Queued Scheme: ${s.name}`);
  }

  for (const a of APPLICATIONS) {
    const aRef = doc(db, "applications", a.id);
    batch.set(aRef, a);
    console.log(`  ➕ Queued Application: ${a.id} (${a.scheme})`);
  }

  const metaRef = doc(db, "meta", "stats");
  batch.set(metaRef, {
    totalSchemes: SCHEMES.length,
    totalApplications: APPLICATIONS.length,
    seededAt: new Date().toISOString(),
    appName: "NagrikSeva AI",
  });

  console.log("💾 Committing batch to Cloud Firestore...");
  await batch.commit();

  console.log("\n🎉 SUCCESS! All schemes, applications & metadata are now LIVE in Cloud Firestore!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seeding Error:", e);
  process.exit(1);
});
