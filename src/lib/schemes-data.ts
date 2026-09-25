// ============================================
// NagrikSeva AI - Government Schemes Database
// ============================================

import { Scheme } from "@/types";

export const SCHEMES_DATA: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    nameGu: "PM કિસાન સન્માન નિધિ",
    nameHi: "PM किसान सम्मान निधि",
    category: "agriculture",
    description: "Financial support of ₹6000/year to farmer families",
    benefits: ["₹6000 per year in 3 installments", "Direct bank transfer", "All small/marginal farmers"],
    eligibility: { occupation: ["farmer"], maxAge: 99, minAge: 18, gender: "all" },
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
    description: "₹5 lakh health insurance for poor and vulnerable families",
    benefits: ["₹5 lakh cover per family per year", "Cashless treatment", "2000+ hospitals"],
    eligibility: { incomeLimit: 200000, gender: "all" },
    documents: ["Aadhaar Card", "Ration Card", "Income Certificate", "SECC Data Verification"],
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
    description: "Financial assistance for construction of pucca house in rural areas",
    benefits: ["₹1.2 lakh (plain)", "₹1.3 lakh (hilly)", "Toilet + MGNREGA wages"],
    eligibility: { incomeLimit: 300000, gender: "all", occupation: ["rural"] },
    documents: ["Aadhaar Card", "BPL/SECC List", "Bank Account", "Land Documents", "Photo"],
    applicationUrl: "https://pmayg.nic.in",
    icon: "🏠",
    ministry: "Ministry of Rural Development",
    isActive: true,
  },
  {
    id: "ujjwala-yojana",
    name: "PM Ujjwala Yojana 2.0",
    nameGu: "PM ઉજ્જ્વલા યોજના",
    nameHi: "PM उज्ज्वला योजना",
    category: "energy",
    description: "Free LPG connection to women from BPL households",
    benefits: ["Free LPG connection", "First cylinder free", "Subsidy on refills"],
    eligibility: { gender: "female", incomeLimit: 200000 },
    documents: ["Aadhaar Card", "BPL Ration Card", "Bank Passbook", "Self-declaration"],
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
    benefits: [
      "Shishu: Up to ₹50,000",
      "Kishore: ₹50,000 to ₹5 lakh",
      "Tarun: ₹5 lakh to ₹10 lakh",
      "No collateral required",
    ],
    eligibility: { minAge: 18, maxAge: 65, gender: "all" },
    documents: ["Aadhaar + PAN", "Business Plan", "Bank Statement 6 months", "Address Proof"],
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
    description: "Savings scheme for girl child education and marriage",
    benefits: ["8.2% interest rate", "Tax exemption under 80C", "Partial withdrawal at age 18"],
    eligibility: { gender: "female", maxAge: 10 },
    documents: ["Girl Child Birth Certificate", "Parent Aadhaar & PAN", "Address Proof"],
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
    benefits: ["Low premium (Kharif: 2%, Rabi: 1.5%)", "Full coverage against loss", "Quick settlement"],
    eligibility: { occupation: ["farmer"], gender: "all" },
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
    benefits: [
      "Zero balance account",
      "₹2 lakh accident insurance",
      "₹30,000 life insurance",
      "₹10,000 overdraft",
    ],
    eligibility: { minAge: 10, gender: "all" },
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
    description: "Free skill training and certification for youth",
    benefits: ["Free training", "Government certificate", "Placement assistance", "₹8000 stipend"],
    eligibility: { minAge: 15, maxAge: 45, gender: "all" },
    documents: ["Aadhaar Card", "Educational Certificate", "Bank Account", "Photo"],
    applicationUrl: "https://pmkvyofficial.org",
    icon: "🎓",
    ministry: "Ministry of Skill Development",
    isActive: true,
  },
  {
    id: "atal-pension",
    name: "Atal Pension Yojana",
    nameGu: "અટલ પેન્શન યોજના",
    nameHi: "अटल पेंशन योजना",
    category: "social",
    description: "Pension scheme for unorganized sector workers",
    benefits: ["₹1000-₹5000 monthly pension", "Government co-contribution", "Spouse pension on death"],
    eligibility: { minAge: 18, maxAge: 40, gender: "all" },
    documents: ["Aadhaar Card", "Savings Bank Account", "Mobile Number"],
    applicationUrl: "https://npscra.nsdl.co.in",
    icon: "👴",
    ministry: "Ministry of Finance",
    isActive: true,
  },
];

// Get schemes by category
export function getSchemesByCategory(category: string): Scheme[] {
  return SCHEMES_DATA.filter((s) => s.category === category && s.isActive);
}

// Search schemes by keyword
export function searchSchemes(query: string): Scheme[] {
  const q = query.toLowerCase();
  return SCHEMES_DATA.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.nameGu.includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
  );
}

// Get scheme by ID
export function getSchemeById(id: string): Scheme | undefined {
  return SCHEMES_DATA.find((s) => s.id === id);
}

// Category labels
export const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  agriculture: { label: "Agriculture", icon: "🌾", color: "green" },
  health: { label: "Health", icon: "🏥", color: "red" },
  housing: { label: "Housing", icon: "🏠", color: "orange" },
  education: { label: "Education", icon: "🎓", color: "blue" },
  women: { label: "Women", icon: "👩", color: "pink" },
  business: { label: "Business", icon: "💼", color: "purple" },
  social: { label: "Social", icon: "🤝", color: "teal" },
  digital: { label: "Digital", icon: "💻", color: "indigo" },
  energy: { label: "Energy", icon: "⚡", color: "yellow" },
};
