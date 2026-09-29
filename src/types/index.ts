// ============================================
// NagrikSeva AI - TypeScript Types
// ============================================

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

export interface Message {
  role: "user" | "model";
  text: string;
  timestamp?: Date;
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
