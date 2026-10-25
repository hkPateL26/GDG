// =========================================================================
// NagrikSeva AI - Citizen Entitlement Passbook (નાગરિક અધિકાર પાસબુક) Engine
// Aggregates lifetime social protection, DBT disbursements, health covers,
// asset grants, and proactive statutory renewal/KYC alerts across the family.
// =========================================================================

import type { CitizenLedgerProfile, CitizenBenefitRecord } from "./large-datasets.ts";
import { generateCertificateSeal } from "./digital-notary.ts";

export type EntitlementCategory = "dbt_cash" | "insurance_cover" | "housing_asset" | "in_kind_subsidy";

export interface FamilyEntitlementItem {
  id: string;
  schemeId: string;
  schemeNameGu: string;
  schemeNameEn: string;
  beneficiaryNameGu: string;
  beneficiaryRelationGu: string;
  memberId: string;
  category: EntitlementCategory;
  categoryLabelGu: string;
  amount: number;
  financialYear: string;
  disbursedDate: string;
  referenceNo: string;
  departmentGu: string;
  status: "credited" | "active_cover" | "approved_grant";
  statusLabelGu: string;
  remarksGu: string;
}

export interface StatutoryRenewalAlert {
  id: string;
  schemeId: string;
  schemeNameGu: string;
  alertType: "urgent_renewal" | "window_open" | "verified";
  titleGu: string;
  dueDeadlineGu: string;
  daysRemaining: number;
  actionUrl: string;
  actionTextGu: string;
  mandatoryRuleGu: string;
}

export interface EntitlementSummary {
  kutumbId: string;
  headNameGu: string;
  totalLifetimeValue: number;
  dbtCashTotal: number;
  insuranceCoverTotal: number;
  housingAssetTotal: number;
  inKindSubsidyTotal: number;
  totalBenefitsCount: number;
  activeRenewalsCount: number;
  cryptographicSeal: string;
  items: FamilyEntitlementItem[];
  renewalAlerts: StatutoryRenewalAlert[];
}

export const DEFAULT_FAMILY_ENTITLEMENTS: FamilyEntitlementItem[] = [
  {
    id: "ENT-2026-001",
    schemeId: "pm-kisan",
    schemeNameGu: "PM કિસાન સન્માન નિધિ (ખેડૂત સહાય)",
    schemeNameEn: "PM Kisan Samman Nidhi",
    beneficiaryNameGu: "હરી વિનોદરાઈ પટેલ",
    beneficiaryRelationGu: "મુખ્ય અરજદાર (પોતે)",
    memberId: "member-self",
    category: "dbt_cash",
    categoryLabelGu: "DBT બેંક જમા",
    amount: 6000,
    financialYear: "2026-27",
    disbursedDate: "૧૪ ઓગસ્ટ ૨૦૨૬",
    referenceNo: "GJ-PMK-2026-4829",
    departmentGu: "કૃષિ અને સહકાર વિભાગ",
    status: "credited",
    statusLabelGu: "ખાતામાં જમા",
    remarksGu: "૭/૧૨ જમીન આધારિત વાર્ષિક સહાય (હપ્તો ૧૭/૧૮/૧૯ ચુકવાઈ ગયા).",
  },
  {
    id: "ENT-2026-002",
    schemeId: "ayushman-bharat",
    schemeNameGu: "આયુષ્માન ભારત PM-JAY (MAA કાર્ડ)",
    schemeNameEn: "Ayushman Bharat PM-JAY",
    beneficiaryNameGu: "સમગ્ર કુટુંબ (૫ સભ્યો)",
    beneficiaryRelationGu: "કુટુંબ કવચ",
    memberId: "family-all",
    category: "insurance_cover",
    categoryLabelGu: "કેશલેસ આરોગ્ય કવચ",
    amount: 500000,
    financialYear: "2026-27",
    disbursedDate: "૨૦ નવેમ્બર ૨૦૨૫",
    referenceNo: "PMJAY-GJ-84920194",
    departmentGu: "આરોગ્ય અને પરિવાર કલ્યાણ વિભાગ",
    status: "active_cover",
    statusLabelGu: "સક્રિય આરોગ્ય કવચ",
    remarksGu: "પ્રત્યેક પરિવારને પ્રતિ વર્ષ ₹૫ લાખ સુધીનું મફત સારવાર કવચ સક્રિય છે.",
  },
  {
    id: "ENT-2026-003",
    schemeId: "swachh-bharat",
    schemeNameGu: "સ્વચ્છ ભારત મિશન (ગ્રામીણ શૌચાલય સહાય)",
    schemeNameEn: "Swachh Bharat Gramin Toilet Grant",
    beneficiaryNameGu: "વિનોદરાઈ કરશનભાઈ પટેલ",
    beneficiaryRelationGu: "પિતા",
    memberId: "member-father",
    category: "housing_asset",
    categoryLabelGu: "આવાસ / પાયાની ગ્રાન્ટ",
    amount: 12000,
    financialYear: "2024-25",
    disbursedDate: "૧૦ માર્ચ ૨૦૨૫",
    referenceNo: "SBM-GJ-2025-11029",
    departmentGu: "પંચાયત, ગ્રામ ગૃહનિર્માણ અને ગ્રામ વિકાસ વિભાગ",
    status: "credited",
    statusLabelGu: "સહાય ચુકવાઈ ગઈ",
    remarksGu: "વ્યક્તિગત પારિવારિક શૌચાલય નિર્માણ પ્રોત્સાહક સહાય ₹૧૨,૦૦૦ DBT જમા.",
  },
  {
    id: "ENT-2026-004",
    schemeId: "namo-saraswati",
    schemeNameGu: "નમો સરસ્વતી વિજ્ઞાન પ્રવાહ શિષ્યવૃત્તિ",
    schemeNameEn: "Namo Saraswati Science Stream Scholarship",
    beneficiaryNameGu: "અનુરાધા હરી પટેલ",
    beneficiaryRelationGu: "પુત્રી",
    memberId: "member-daughter",
    category: "dbt_cash",
    categoryLabelGu: "DBT શિક્ષણ સહાય",
    amount: 20000,
    financialYear: "2026-27",
    disbursedDate: "૦૫ જુલાઈ ૨૦૨૬",
    referenceNo: "NSS-GJ-2026-9812",
    departmentGu: "શિક્ષણ વિભાગ, ગુજરાત સરકાર",
    status: "credited",
    statusLabelGu: "ખાતામાં જમા",
    remarksGu: "ધોરણ ૧૧-૧૨ વિજ્ઞાન પ્રવાહમાં અભ્યાસ કરતી વિદ્યાર્થિની માટે વાર્ષિક શિષ્યવૃત્તિ.",
  },
  {
    id: "ENT-2026-005",
    schemeId: "pm-surya-ghar",
    schemeNameGu: "PM સૂર્ય ઘર - મફત વીજળી યોજના (સોલર સબસિડી)",
    schemeNameEn: "PM Surya Ghar Muft Bijli Yojana",
    beneficiaryNameGu: "હરી વિનોદરાઈ પટેલ",
    beneficiaryRelationGu: "મુખ્ય અરજદાર (પોતે)",
    memberId: "member-self",
    category: "housing_asset",
    categoryLabelGu: "ઊર્જા સબસિડી ગ્રાન્ટ",
    amount: 78000,
    financialYear: "2025-26",
    disbursedDate: "૧૮ જાન્યુઆરી ૨૦૨૬",
    referenceNo: "PMSG-GJ-2026-3021",
    departmentGu: "ઊર્જા અને પેટ્રોકેમિકલ્સ વિભાગ (PGVCL)",
    status: "approved_grant",
    statusLabelGu: "ગ્રાન્ટ મંજૂર & સ્થાપિત",
    remarksGu: "૩ કિલોવોટ રૂફટોપ સોલાર સિસ્ટમ સ્થાપન પેટે કેન્દ્ર-રાજ્ય સંયુક્ત સબસિડી જમા.",
  },
  {
    id: "ENT-2026-006",
    schemeId: "nfsa-ration",
    schemeNameGu: "NFSA અન્નપૂર્ણા યોજના (વાર્ષિક અનાજ રાહત)",
    schemeNameEn: "NFSA National Food Security Subsidy",
    beneficiaryNameGu: "ભાવનાબેન વિનોદરાઈ પટેલ",
    beneficiaryRelationGu: "માતા",
    memberId: "member-mother",
    category: "in_kind_subsidy",
    categoryLabelGu: "સબસિડીયુક્ત ખાદ્યાન્ન",
    amount: 4200,
    financialYear: "2026-27",
    disbursedDate: "ચાલુ માસિક વિતરણ",
    referenceNo: "RC-GJ-03201489",
    departmentGu: "અન્ન, નાગરિક પુરવઠા અને ગ્રાહક બાબતોનો વિભાગ",
    status: "credited",
    statusLabelGu: "નિયમિત વિતરણ",
    remarksGu: "પ્રતિ માસ ૨૫ કિલો ઘઉં, ચોખા અને ૧ કિલો ચણા વાર્ષિક બજાર કિંમત રાહત ₹૪,૨૦૦.",
  },
  {
    id: "ENT-2026-007",
    schemeId: "pm-suraksha-bima",
    schemeNameGu: "પ્રધાનમંત્રી સુરક્ષા વીમા યોજના (PMSBY)",
    schemeNameEn: "Pradhan Mantri Suraksha Bima Yojana",
    beneficiaryNameGu: "હરી વિનોદરાઈ પટેલ",
    beneficiaryRelationGu: "મુખ્ય અરજદાર (પોતે)",
    memberId: "member-self",
    category: "insurance_cover",
    categoryLabelGu: "અકસ્માત વીમા કવચ",
    amount: 200000,
    financialYear: "2026-27",
    disbursedDate: "૦૧ જૂન ૨૦૨૬",
    referenceNo: "PMSBY-SBI-49201",
    departmentGu: "નાણાંકીય સેવાઓ વિભાગ (DFS)",
    status: "active_cover",
    statusLabelGu: "સક્રિય અકસ્માત કવચ",
    remarksGu: "વાર્ષિક ₹૨૦ ના પ્રીમિયમ સામે ₹૨,૦૦,૦૦૦ નું આકસ્મિક મૃત્યુ/અપંગતા વીમા કવચ.",
  },
];

export const DEFAULT_RENEWAL_ALERTS: StatutoryRenewalAlert[] = [
  {
    id: "REN-001",
    schemeId: "ration",
    schemeNameGu: "NFSA ડિજિટલ રેશન કાર્ડ",
    alertType: "urgent_renewal",
    titleGu: "વાર્ષિક કુટુંબ e-KYC બાયોમેટ્રિક ચકાસણી બાકી છે",
    dueDeadlineGu: "૩૧ ઓક્ટોબર ૨૦૨૬",
    daysRemaining: 6,
    actionUrl: "/documents",
    actionTextGu: "૧-ક્લિક e-KYC શરૂ કરો",
    mandatoryRuleGu: "સરકારી નિયમ: ૧૦૦% રેશન લાભ ચાલુ રાખવા તમામ સભ્યોનું આધાર સીડિંગ જરૂરી છે.",
  },
  {
    id: "REN-002",
    schemeId: "pm-kisan",
    schemeNameGu: "PM કિસાન સન્માન નિધિ",
    alertType: "verified",
    titleGu: "આધાર NPCI બેંક ખાતું સક્રિય & ચકાસાયેલ છે",
    dueDeadlineGu: "માન્ય (૨૦૨૭ સુધી)",
    daysRemaining: 180,
    actionUrl: "/track",
    actionTextGu: "સ્ટેટસ જુઓ",
    mandatoryRuleGu: "તમારું બેંક ખાતું DBT ચૂકવણી માટે પ્રમાણિત છે.",
  },
  {
    id: "REN-003",
    schemeId: "fasal-bima",
    schemeNameGu: "પ્રધાનમંત્રી ફસલ બીમા યોજના (PMFBY)",
    alertType: "window_open",
    titleGu: "રવિ પાક (ઘઉં, જીરું, ચણા) વીમા નોંધણી વિન્ડો ખુલ્લી છે",
    dueDeadlineGu: "૧૫ ડિસેમ્બર ૨૦૨૬",
    daysRemaining: 51,
    actionUrl: "/schemes",
    actionTextGu: "પાક વીમો લો",
    mandatoryRuleGu: "કુદરતી આપત્તિ સામે પાક સુરક્ષા માટે નિયત તારીખ પહેલાં પ્રીમિયમ ભરવું ફરજિયાત છે.",
  },
];

/**
 * Computes unified entitlement summary for a given citizen profile
 */
export function getCitizenEntitlementSummary(
  citizen?: Partial<CitizenLedgerProfile>
): EntitlementSummary {
  const cleanMobile = (citizen?.mobile || "9825012345").replace(/\D/g, "").slice(-4);
  const cleanAadhaar = (citizen?.aadhaarLast4 || "4829").replace(/\D/g, "").slice(-4);
  const kutumbId = `GJ-KUTUMB-${cleanMobile}-${cleanAadhaar}`;
  const headNameGu = citizen?.citizenNameGu || citizen?.citizenName || "હરી વિનોદરાઈ પટેલ";

  const items = DEFAULT_FAMILY_ENTITLEMENTS;
  const renewalAlerts = DEFAULT_RENEWAL_ALERTS;

  let dbtCashTotal = 0;
  let insuranceCoverTotal = 0;
  let housingAssetTotal = 0;
  let inKindSubsidyTotal = 0;

  for (const item of items) {
    if (item.category === "dbt_cash") {
      dbtCashTotal += item.amount;
    } else if (item.category === "insurance_cover") {
      insuranceCoverTotal += item.amount;
    } else if (item.category === "housing_asset") {
      housingAssetTotal += item.amount;
    } else if (item.category === "in_kind_subsidy") {
      inKindSubsidyTotal += item.amount;
    }
  }

  const totalLifetimeValue = dbtCashTotal + insuranceCoverTotal + housingAssetTotal + inKindSubsidyTotal;

  const cryptographicSeal = generateCertificateSeal({
    id: kutumbId,
    citizenName: headNameGu,
  });

  return {
    kutumbId,
    headNameGu,
    totalLifetimeValue,
    dbtCashTotal,
    insuranceCoverTotal,
    housingAssetTotal,
    inKindSubsidyTotal,
    totalBenefitsCount: items.length,
    activeRenewalsCount: renewalAlerts.filter((a) => a.alertType === "urgent_renewal").length,
    cryptographicSeal,
    items,
    renewalAlerts,
  };
}
