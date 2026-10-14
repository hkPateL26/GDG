// ============================================
// NagrikSeva AI - TypeScript Types
// ============================================

export interface SchemeDocumentRequirement {
  name: string;
  nameGu: string;
  tier: "mandatory" | "conditional" | "optional";
  digiLockerSupported: boolean;
  notes?: string;
}

export interface Scheme {
  id: string;
  name: string;
  nameGu: string; // Gujarati name
  nameHi: string; // Hindi name
  category: SchemeCategory;
  description: string;
  benefits: string[];
  eligibility: EligibilityCriteria;
  documents: string[];
  applicationUrl?: string;
  icon: string;
  ministry: string;
  isActive: boolean;
  // Dual SLA Display Hierarchy (SFIC 2026 / Gujarat Citizen Charter Standards)
  officialSlaDays?: number; // Official statutory processing days under Gujarat Right to Public Services Act (GRTPSA 2013)
  planningEstimateDays?: string; // AI dynamic pendency planning estimate (e.g., "3-5 દિવસ")
  implementingAuthority?: string; // Nodal Implementing Authority / Dedicated Portal (e.g. i-Khedut, Digital Gujarat, e-Samaj Kalyan)
  targetBeneficiary?: string; // Target beneficiary group description
  documentChecklist?: SchemeDocumentRequirement[]; // 3-Tier Granular Document Architecture
}

export type SchemeCategory =
  | "agriculture"
  | "health"
  | "housing"
  | "education"
  | "women"
  | "business"
  | "social"
  | "digital"
  | "energy";

export interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  gender?: "male" | "female" | "all";
  incomeLimit?: number; // Annual income in INR
  category?: ("SC" | "ST" | "OBC" | "General")[];
  occupation?: string[];
  state?: string[]; // Empty means all India
}

export interface Document {
  id: string;
  name: string;
  nameGu: string;
  description: string;
  isMandatory: boolean;
}

export interface DocumentAttachment {
  name: string;
  type: string;
  base64: string;
  size: number;
}

export interface DocumentVerificationReport {
  documentType: string;
  documentTypeGu: string;
  isValid: boolean;
  status: "verified" | "action_required" | "rejected";
  confidence: string;
  issuingAuthority: string;
  guidelineChecklist: {
    rule: string;
    passed: boolean;
    remark: string;
  }[];
  eligibleSchemes: {
    schemeName: string;
    schemeNameGu: string;
    department: string;
  }[];
  recommendations: string[];
}

export interface ChatSessionRecord {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  citizenId?: string;
  citizenName?: string;
}

export interface Message {
  role: "user" | "model";
  text: string;
  timestamp?: Date;
  attachment?: DocumentAttachment;
  documentReport?: DocumentVerificationReport;
  applicationCard?: {
    id: string;
    citizenName: string;
    schemeName: string;
    schemeNameGu: string;
    schemeEmoji: string;
    status: string;
    statusLabelGu: string;
    workflowStage: number;
    totalStages: number;
    currentDeskGu: string;
    elapsedMinutes: number;
    isBreached: boolean;
    actCitation: string;
    village: string;
    taluka: string;
    district: string;
    paymentStatus?: string;
    submissionDate?: string;
  };
  actionButtons?: {
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "success";
    icon?: string;
  }[];
}

export interface ChatHistory {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface UserProfile {
  age?: number;
  gender?: "male" | "female";
  income?: number;
  category?: "SC" | "ST" | "OBC" | "General";
  occupation?: string;
  state?: string;
  hasLand?: boolean;
  hasBPLCard?: boolean;
}

export interface ApplicationStatus {
  applicationId: string;
  schemeName: string;
  status: "pending" | "approved" | "rejected" | "processing";
  submittedDate: string;
  lastUpdated: string;
  remarks?: string;
}

export interface GovernmentOffice {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  timings: string;
  services: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
