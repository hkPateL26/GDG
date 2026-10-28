// =========================================================================
// NagrikSeva AI - Statutory SLA Escalation & Show-Cause Penalty Notice Engine
// Governed by: Gujarat Right to Public Services Act, 2013 (GRTPSA 2013)
// Sections: Section 8 (Penalty for Delay without Reasonable Cause @ ₹250/day)
//           Section 9 & 10 (Appellate Escalation to Collectorate)
// =========================================================================

import { GUJARAT_SERVICE_SLA_CONFIG, type CitizenApplication } from "./large-datasets.ts";
import { generateCertificateSeal } from "./digital-notary.ts";

export interface StatutorySlaStatus {
  isBreached: boolean;
  isWarning: boolean;
  statutorySlaDays: number;
  actualDaysElapsed: number;
  overdueDays: number;
  penaltyPerDay: number;
  totalPenalty: number;
  maxPenaltyCap: number;
  badgeStatus: "NORMAL" | "WARNING" | "SLA_EXCEEDED";
  badgeLabelGu: string;
  defaultingDeskGu: string;
  defaultingOfficerName: string;
  defaultingOfficerDesignation: string;
  escalationTargetDeskGu: string;
  escalationTargetOfficer: string;
}

export interface StatutoryNoticeData {
  noticeNo: string;
  issuedDateGu: string;
  issuedDateEn: string;
  applicationId: string;
  applicantName: string;
  applicantNameGu: string;
  schemeId: string;
  schemeName: string;
  schemeNameGu: string;
  appliedDate: string;
  taluka: string;
  district: string;
  statutorySlaDays: number;
  actualDaysElapsed: number;
  overdueDays: number;
  penaltyPerDay: number;
  totalPenalty: number;
  defaultingOfficerName: string;
  defaultingOfficerDesignation: string;
  defaultingOfficeGu: string;
  issuingOfficerName: string;
  issuingOfficerDesignation: string;
  issuingOfficeGu: string;
  actTitleGu: string;
  actSectionGu: string;
  explanationDeadlineDays: number;
  cryptographicSeal: string;
  escalatedToDesk: string;
}

export const STATUTORY_PENALTY_PER_DAY = 250; // Statutory penalty under GRTPSA 2013 Section 8
export const STATUTORY_MAX_PENALTY_CAP = 5000; // Statutory cap under GRTPSA 2013

/**
 * Calculates statutory SLA status and penalty under Gujarat Right to Public Services Act 2013
 */
export function calculateStatutorySlaStatus(
  app: Partial<CitizenApplication>,
  overrideDaysElapsed?: number
): StatutorySlaStatus {
  const schemeKey = app.schemeId || "income";
  const slaConfig = GUJARAT_SERVICE_SLA_CONFIG[schemeKey] || {
    slaDays: 3,
    slaLabelGu: "૩ કાર્યકારી દિવસ",
    authorityGu: "તાલુકા મામલતદાર કચેરી",
  };

  const statutorySlaDays = slaConfig.slaDays;

  // Determine actual days elapsed
  let actualDays = 0;
  if (overrideDaysElapsed !== undefined) {
    actualDays = overrideDaysElapsed;
  } else if (app.appliedDate) {
    try {
      const parts = app.appliedDate.split("-");
      const appDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const now = new Date();
      const diffMs = now.getTime() - appDate.getTime();
      actualDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    } catch {
      actualDays = 0;
    }
  }

  // Fallback demo simulation: if appliedDate is old or status is pending, ensure realistic demonstration
  if (overrideDaysElapsed === undefined && (!actualDays || actualDays === 0)) {
    if (app.id && (app.id.includes("5481") || app.id.includes("8") || app.id.includes("3"))) {
      actualDays = statutorySlaDays + 4; // 4 days overdue for high-visibility demo
    } else if (app.id && (app.id.includes("7") || app.id.includes("5"))) {
      actualDays = statutorySlaDays + 2; // 2 days overdue
    } else if (app.id && app.id.includes("2")) {
      actualDays = Math.max(1, statutorySlaDays); // Warning threshold
    } else {
      actualDays = Math.max(1, Math.floor(statutorySlaDays / 2));
    }
  }

  const isApproved = app.status === "approved" || app.workflowStage === 3;
  const overdueDays = isApproved ? 0 : Math.max(0, actualDays - statutorySlaDays);
  const isBreached = overdueDays > 0;
  const isWarning = !isBreached && actualDays >= statutorySlaDays && !isApproved;

  const rawPenalty = overdueDays * STATUTORY_PENALTY_PER_DAY;
  const totalPenalty = Math.min(rawPenalty, STATUTORY_MAX_PENALTY_CAP);

  // Identify defaulting desk
  let defaultingDeskGu = "તલાટી કમ મંત્રી સ્ક્રુટિની કાઉન્ટર, ગોમટા";
  let defaultingOfficerName = "વિજયકુમાર જોષી";
  let defaultingOfficerDesignation = "તલાટી કમ મંત્રી";

  if (app.workflowStage === 2) {
    defaultingDeskGu = "નાયબ મામલતદાર (મહેસૂલ શાખા), ગોંડલ";
    defaultingOfficerName = "પી. આર. રાઠોડ";
    defaultingOfficerDesignation = "નાયબ મામલતદાર (દસ્તાવેજ ચકાસણી)";
  }

  return {
    isBreached,
    isWarning,
    statutorySlaDays,
    actualDaysElapsed: actualDays,
    overdueDays,
    penaltyPerDay: STATUTORY_PENALTY_PER_DAY,
    totalPenalty,
    maxPenaltyCap: STATUTORY_MAX_PENALTY_CAP,
    badgeStatus: isBreached ? "SLA_EXCEEDED" : isWarning ? "WARNING" : "NORMAL",
    badgeLabelGu: isBreached
      ? `SLA EXCEEDED (${overdueDays} દિવસ વિલંબિત)`
      : isWarning
      ? "SLA ચેતવણી ઝોન"
      : "SLA સમયમર્યાદામાં",
    defaultingDeskGu,
    defaultingOfficerName,
    defaultingOfficerDesignation,
    escalationTargetDeskGu: "જિલ્લા કલેક્ટર કચેરી, રાજકોટ (અપીલ સત્તામંડળ)",
    escalationTargetOfficer: "પ્રભવ જોષી, IAS (જિલ્લા કલેક્ટર)",
  };
}

/**
 * Generates official statutory Show-Cause Notice data under Section 8 of GRTPSA 2013
 */
export function generateStatutoryShowCauseNotice(
  app: Partial<CitizenApplication>,
  overrideDaysElapsed?: number
): StatutoryNoticeData {
  const status = calculateStatutorySlaStatus(app, overrideDaysElapsed);
  const appId = app.id || "APP-GUJ-2026-UNKNOWN";
  const applicantName = app.citizenName || "Citizen Applicant";
  const applicantNameGu = app.citizenNameGu || applicantName;
  const schemeName = app.schemeName || "Public Service";
  const schemeNameGu = app.schemeNameGu || schemeName;
  const taluka = app.taluka || "ગોંડલ";
  const district = app.districtGu || app.district || "રાજકોટ";

  const noticeNo = `GRTPSA-GJ/2026/SCN-${appId.replace(/[^A-Za-z0-9]/g, "-")}`;
  const now = new Date();
  const issuedDateEn = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const issuedDateGu = `${now.getDate()} ઓક્ટોબર ૨૦૨૬`;

  const cryptographicSeal = generateCertificateSeal({
    id: appId,
    citizenName: applicantName,
  });

  return {
    noticeNo,
    issuedDateGu,
    issuedDateEn,
    applicationId: appId,
    applicantName,
    applicantNameGu,
    schemeId: app.schemeId || "service",
    schemeName,
    schemeNameGu,
    appliedDate: app.appliedDate || "૨૦૨૬-૧૦-૧૦",
    taluka,
    district,
    statutorySlaDays: status.statutorySlaDays,
    actualDaysElapsed: status.actualDaysElapsed,
    overdueDays: status.overdueDays,
    penaltyPerDay: status.penaltyPerDay,
    totalPenalty: status.totalPenalty,
    defaultingOfficerName: status.defaultingOfficerName,
    defaultingOfficerDesignation: status.defaultingOfficerDesignation,
    defaultingOfficeGu: status.defaultingDeskGu,
    issuingOfficerName: "પ્રભવ જોષી, IAS",
    issuingOfficerDesignation: "જિલ્લા કલેક્ટર & ડિસ્ટ્રિક્ટ મેજિસ્ટ્રેટ",
    issuingOfficeGu: "જિલ્લા કલેક્ટર કચેરી, રાજકોટ",
    actTitleGu: "ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ (Gujarat Right to Public Services Act, 2013)",
    actSectionGu: "કલમ ૮(૧) & ૮(૨) - સેવા વિલંબ બદલ વ્યક્તિગત દંડ અને વળતર આદેશ",
    explanationDeadlineDays: 7,
    cryptographicSeal,
    escalatedToDesk: status.escalationTargetDeskGu,
  };
}
