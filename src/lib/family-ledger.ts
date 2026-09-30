// ============================================================================
// NagrikSeva AI - Official UIDAI mAadhaar (5-Profile) & NFSA Kutumb Family ID
// Multi-Member Aadhaar Linking, Cross-Mobile OTP Consent & PoR Verification Engine
// ============================================================================

export interface FamilyMemberProfile {
  id: string;
  nameGu: string;
  nameEn: string;
  relationGu: string;
  relationEn: string;
  fatherOrHusbandNameGu: string;
  gender: "male" | "female";
  dob: string;
  age: number;
  aadhaarLast4: string;
  aadhaarMasked: string;
  mobile: string;
  sameMobileAsPrimary: boolean;
  verificationStatus: "verified_same_mobile" | "verified_other_mobile" | "pending_otp";
  relationshipProofTypeGu?: string;
  relationshipProofNo?: string;
  avatarEmoji: string;
  linkedAt?: string;
}

export interface CitizenPrimaryInfo {
  citizenName?: string;
  citizenNameGu?: string;
  mobile?: string;
  aadhaarLast4?: string;
  district?: string;
  districtGu?: string;
  taluka?: string;
  village?: string;
}

const STORAGE_PREFIX = "nagrik_family_ledger_";
const ACTIVE_MEMBER_KEY = "nagrik_active_family_member";

export function getFamilyIdForCitizen(mobile?: string, aadhaarLast4?: string): string {
  const m = (mobile || "9825012345").replace(/\D/g, "").slice(-4);
  const a = (aadhaarLast4 || "4829").replace(/\D/g, "").slice(-4);
  return `GJ-KUTUMB-${m}-${a}`;
}

export function getRecommendedProofForRelation(relationGu: string): {
  defaultDocType: string;
  options: string[];
  hintGu: string;
} {
  if (relationGu.includes("પુત્ર") || relationGu.includes("પુત્રી")) {
    return {
      defaultDocType: "જન્મનું પ્રમાણપત્ર (Birth Certificate - પિતા/માતા નામ મેચ)",
      options: [
        "જન્મનું પ્રમાણપત્ર (Birth Certificate - પિતા/માતા નામ મેચ)",
        "NFSA રેશન કાર્ડ (Ration Card Member Seeding)",
        "શાળા છોડ્યાનું પ્રમાણપત્ર (School LC / Bonafide)",
        "UIDAI HoF આધાર C/O (પિતાનું નામ મેચ)",
      ],
      hintGu: "UIDAI નિયમ મુજબ બાળકના જન્મ પ્રમાણપત્ર અથવા રેશન કાર્ડમાં પિતા/માતા તરીકે તમારું નામ હોવું ફરજિયાત છે.",
    };
  }
  if (relationGu.includes("પત્ની")) {
    return {
      defaultDocType: "લગ્ન નોંધણી પ્રમાણપત્ર (Marriage Certificate)",
      options: [
        "લગ્ન નોંધણી પ્રમાણપત્ર (Marriage Certificate)",
        "NFSA રેશન કાર્ડ (પતિ તરીકે નામ મેચ)",
        "આધાર કાર્ડ C/O અથવા W/O પતિનું નામ મેચ",
        "સંયુક્ત બેંક ખાતા / પાસપોર્ટ પુરાવો",
      ],
      hintGu: "પત્નીને પરિવારમાં ઉમેરવા માટે લગ્ન પ્રમાણપત્ર અથવા રેશન કાર્ડમાં પતિ તરીકે તમારું નામ હોવું જરૂરી છે.",
    };
  }
  if (relationGu.includes("પિતા") || relationGu.includes("માતા") || relationGu.includes("દાદા")) {
    return {
      defaultDocType: "NFSA રેશન કાર્ડ (કુટુંબ રજિસ્ટર મેચ)",
      options: [
        "NFSA રેશન કાર્ડ (કુટુંબ રજિસ્ટર મેચ)",
        "તમારા આધાર કાર્ડમાં પિતાનું નામ (C/O Match)",
        "તમારું જન્મ પ્રમાણપત્ર / સ્કૂલ LC (માતા-પિતા નામ મેચ)",
      ],
      hintGu: "માતા-પિતાને જોડવા માટે તમારા આધાર કાર્ડ/રેશન કાર્ડમાં વડીલનું નામ મેચ થવું જરૂરી છે.",
    };
  }
  return {
    defaultDocType: "NFSA રેશન કાર્ડ (એક જ કુટુંબના સભ્ય)",
    options: [
      "NFSA રેશન કાર્ડ (એક જ કુટુંબના સભ્ય)",
      "આધાર કાર્ડમાં પિતાનું સરખું નામ (Same Father Name Match)",
      "તલાટી કમ મંત્રીનું પેઢીનામું (Family Pedhinama)",
    ],
    hintGu: "ભાઈ/બહેન અથવા અન્ય સભ્ય માટે રેશન કાર્ડ અથવા પેઢીનામામાં એક જ પિતાનું નામ હોવું જરૂરી છે.",
  };
}

export function getDefaultFamilyMembers(citizen: CitizenPrimaryInfo): FamilyMemberProfile[] {
  const primaryMobile = (citizen.mobile || "9825012345").replace(/\D/g, "").slice(-10) || "9825012345";
  const primaryAadhaar4 = (citizen.aadhaarLast4 || "4829").replace(/\D/g, "").slice(-4) || "4829";
  const primaryNameGu = citizen.citizenNameGu || "હરી વિનોદરાઈ પટેલ";
  const primaryNameEn = citizen.citizenName || "Hari Vinodrai Patel";

  return [
    {
      id: "member-self",
      nameGu: primaryNameGu,
      nameEn: primaryNameEn,
      relationGu: "પોતે (મુખ્ય યુઝર)",
      relationEn: "Self (Head of Family)",
      fatherOrHusbandNameGu: "વિનોદરાઈ કરશનભાઈ પટેલ",
      gender: "male",
      dob: "1998-05-15",
      age: 28,
      aadhaarLast4: primaryAadhaar4,
      aadhaarMasked: `XXXX-XXXX-${primaryAadhaar4}`,
      mobile: primaryMobile,
      sameMobileAsPrimary: true,
      verificationStatus: "verified_same_mobile",
      relationshipProofTypeGu: "2FA આધાર OTP (મુખ્ય ખાતાધારક)",
      relationshipProofNo: `UIDAI-${primaryAadhaar4}`,
      avatarEmoji: "👤",
      linkedAt: "2026-01-10",
    },
    {
      id: "member-father",
      nameGu: "વિનોદરાઈ કરશનભાઈ પટેલ",
      nameEn: "Vinodrai Karshanbhai Patel",
      relationGu: "પિતા (Father)",
      relationEn: "Father",
      fatherOrHusbandNameGu: "કરશનભાઈ લાલજીભાઈ પટેલ",
      gender: "male",
      dob: "1968-03-10",
      age: 58,
      aadhaarLast4: "7314",
      aadhaarMasked: "XXXX-XXXX-7314",
      mobile: primaryMobile,
      sameMobileAsPrimary: true,
      verificationStatus: "verified_same_mobile",
      relationshipProofTypeGu: "NFSA રેશન કાર્ડ & આધાર C/O મેચ",
      relationshipProofNo: "RC-GJ-03201489",
      avatarEmoji: "👴",
      linkedAt: "2026-01-10",
    },
    {
      id: "member-mother",
      nameGu: "ભાવનાબેન વિનોદરાઈ પટેલ",
      nameEn: "Bhavnaben Vinodrai Patel",
      relationGu: "માતા (Mother)",
      relationEn: "Mother",
      fatherOrHusbandNameGu: "વિનોદરાઈ કરશનભાઈ પટેલ",
      gender: "female",
      dob: "1972-08-22",
      age: 54,
      aadhaarLast4: "9102",
      aadhaarMasked: "XXXX-XXXX-9102",
      mobile: primaryMobile,
      sameMobileAsPrimary: true,
      verificationStatus: "verified_same_mobile",
      relationshipProofTypeGu: "NFSA રેશન કાર્ડ (કુટુંબ રજિસ્ટર મેચ)",
      relationshipProofNo: "RC-GJ-03201489",
      avatarEmoji: "👵",
      linkedAt: "2026-01-10",
    },
    {
      id: "member-spouse",
      nameGu: "પ્રિયાબેન હરી પટેલ",
      nameEn: "Priyaben Hari Patel",
      relationGu: "પત્ની (Wife)",
      relationEn: "Wife",
      fatherOrHusbandNameGu: primaryNameGu,
      gender: "female",
      dob: "2000-11-14",
      age: 25,
      aadhaarLast4: "6548",
      aadhaarMasked: "XXXX-XXXX-6548",
      mobile: "9876543210",
      sameMobileAsPrimary: false,
      verificationStatus: "pending_otp",
      relationshipProofTypeGu: "લગ્ન નોંધણી પ્રમાણપત્ર & રેશન કાર્ડ",
      relationshipProofNo: "MRG-RJK-2025-1104",
      avatarEmoji: "👩",
    },
  ];
}

export function loadFamilyMembers(citizen: CitizenPrimaryInfo): FamilyMemberProfile[] {
  const defaults = getDefaultFamilyMembers(citizen);
  if (typeof window === "undefined") return defaults;

  const primaryMobile = (citizen.mobile || "9825012345").replace(/\D/g, "").slice(-10) || "9825012345";
  const key = `${STORAGE_PREFIX}${primaryMobile}`;

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as FamilyMemberProfile[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed[0] = {
          ...parsed[0],
          nameGu: citizen.citizenNameGu || parsed[0].nameGu,
          nameEn: citizen.citizenName || parsed[0].nameEn,
          mobile: primaryMobile,
          aadhaarLast4: citizen.aadhaarLast4 || parsed[0].aadhaarLast4,
          aadhaarMasked: `XXXX-XXXX-${citizen.aadhaarLast4 || parsed[0].aadhaarLast4}`,
        };
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }

  try {
    localStorage.setItem(key, JSON.stringify(defaults));
  } catch {
    // ignore
  }
  return defaults;
}

export function saveFamilyMembers(citizenMobile: string | undefined, members: FamilyMemberProfile[]): void {
  if (typeof window === "undefined") return;
  const primaryMobile = (citizenMobile || "9825012345").replace(/\D/g, "").slice(-10) || "9825012345";
  const key = `${STORAGE_PREFIX}${primaryMobile}`;
  try {
    localStorage.setItem(key, JSON.stringify(members));
    window.dispatchEvent(new CustomEvent("nagrik_family_updated"));
  } catch {
    // ignore
  }
}

export function getActiveFamilyMember(citizen: CitizenPrimaryInfo): FamilyMemberProfile {
  const members = loadFamilyMembers(citizen);
  if (typeof window === "undefined") return members[0];

  try {
    const savedId = localStorage.getItem(ACTIVE_MEMBER_KEY);
    if (savedId) {
      const found = members.find((m) => m.id === savedId && m.verificationStatus !== "pending_otp");
      if (found) return found;
    }
  } catch {
    // ignore
  }
  return members[0];
}

export function setActiveFamilyMemberId(memberId: string, memberObj?: FamilyMemberProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_MEMBER_KEY, memberId);
    window.dispatchEvent(
      new CustomEvent("nagrik_family_member_change", {
        detail: { memberId, member: memberObj },
      })
    );
  } catch {
    // ignore
  }
}
