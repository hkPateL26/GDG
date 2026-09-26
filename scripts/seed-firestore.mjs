// ============================================
// Firestore Seed Script
// Run: node scripts/seed-firestore.mjs
// Seeds all government schemes into Firestore
// ============================================

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load env manually for script
import { config } from "dotenv";
config({ path: ".env.local" });

const app = initializeApp({
  credential: cert({
    projectId:   process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);

// ── Schemes Data ──────────────────────────
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
    views: 0,
    createdAt: new Date(),
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
    views: 0,
    createdAt: new Date(),
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
    views: 0,
    createdAt: new Date(),
  },
  {
    id: "ujjwala-yojana",
    name: "PM Ujjwala Yojana 2.0",
    nameGu: "PM ઉજ્જ્વલા યોજના",
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
    views: 0,
    createdAt: new Date(),
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
    views: 0,
    createdAt: new Date(),
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
    views: 0,
    createdAt: new Date(),
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
    views: 0,
    createdAt: new Date(),
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
    views: 0,
    createdAt: new Date(),
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
    views: 0,
    createdAt: new Date(),
  },
  {
    id: "atal-pension",
    name: "Atal Pension Yojana",
    nameGu: "અટલ પેન્શન યોજના",
    nameHi: "अटल पेंशन योजना",
    category: "social",
    description: "Monthly pension scheme for unorganized sector workers",
    benefits: ["Rs.1000-5000 monthly pension", "Government co-contribution (50%)", "Spouse pension on death"],
    eligibility: { minAge: 18, maxAge: 40 },
    documents: ["Aadhaar Card", "Savings Bank Account", "Mobile Number"],
    applicationUrl: "https://npscra.nsdl.co.in",
    icon: "👴",
    ministry: "Ministry of Finance",
    isActive: true,
    views: 0,
    createdAt: new Date(),
  },
];

// ── Seed Function ─────────────────────────
async function seedFirestore() {
  console.log("🔥 Starting Firestore seeding...\n");

  const batch = db.batch();

  for (const scheme of SCHEMES) {
    const ref = db.collection("schemes").doc(scheme.id);
    batch.set(ref, scheme, { merge: true });
    console.log(`  ✅ Queued: ${scheme.name}`);
  }

  await batch.commit();
  console.log(`\n🎉 Successfully seeded ${SCHEMES.length} schemes to Firestore!`);
  console.log("📊 Collection: schemes");

  // Also create a metadata doc
  await db.collection("meta").doc("stats").set({
    totalSchemes: SCHEMES.length,
    lastUpdated: new Date(),
    version: "1.0.0",
  });

  console.log("📈 Stats document created!");
  process.exit(0);
}

seedFirestore().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
