// =========================================================================
// NagrikSeva AI - Official DigiLocker & MeriPehchaan Engine
// Compliant with MeitY, NeGD API Setu & IT Act 2000 (DigiLocker Rules 2016, Rule 9A)
// =========================================================================

export interface DigiLockerSignature {
  signedBy: string;
  designation: string;
  certAuthority: string;
  timestamp: string;
  status: "VALID" | "REVOKED";
  sha256: string;
}

export interface DigiLockerExtractedData {
  fullName: string;
  fullNameGu: string;
  fatherName?: string;
  fatherNameGu?: string;
  dob: string;
  gender: "male" | "female";
  address: string;
  district: string;
  taluka: string;
  village: string;
  pincode: string;
  aadhaarLast4: string;
  annualIncome?: number;
  rationCardNo?: string;
  rationCategory?: string;
  fpsShopNo?: string;
  khataNumber?: string;
  surveyNumber?: string;
  landArea?: string;
  subCaste?: string;
  consumerNumber?: string;
  panNumber?: string;
  photoUrl?: string;
}

export interface DigiLockerDocument {
  id: string; // e.g., 'aadhaar', 'income', 'ration', 'land_records', 'electricity', 'pan', 'caste'
  name: string;
  nameGu: string;
  category: "identity" | "revenue" | "civil_supplies" | "utility" | "taxation" | "social";
  docType: string; // 'ADHAR', 'INCRM', 'RATN', 'ROR7', 'ELPBL', 'PANCR', 'CAST'
  uri: string; // Official URI format: in.gov.gujarat.revenue-INCRM-2026-GJ-08921
  issuer: string;
  issuerGu: string;
  issuerCode: string;
  docNumber: string;
  issueDate: string;
  validTill: string;
  digitalSignature: DigiLockerSignature;
  extractedData: DigiLockerExtractedData;
  filePreviewUrl?: string;
  userUploadedBase64?: string;
  isCustomLinked?: boolean;
  fileName?: string;
  fileSize?: string;
  fileMimeType?: string;
  sha256Hash?: string;
}

export interface SlotCompatibilityResult {
  isCompatible: boolean;
  isStrictMismatch: boolean; // e.g. Trying to put a PDF into a passport photo slot
  warningMessageGu?: string;
  matchScore: number; // 0 to 100
}

// ─────────────────────────────────────────────────────────────────────────
// DigiLocker Slot Availability Checker
// Returns true ONLY if the document requirement can be satisfied via DigiLocker.
// Returns false for offline/physical revenue papers (e.g. Tippan, Panchnama, Affidavit).
// ─────────────────────────────────────────────────────────────────────────
export function isSlotSupportedByDigiLocker(
  slotId: string,
  slotNameEn: string = "",
  slotNameGu: string = ""
): boolean {
  const s = `${slotId} ${slotNameEn} ${slotNameGu}`.toLowerCase();

  // EXPLICIT OFFLINE / PHYSICAL REVENUE DOCUMENTS -> NOT IN DIGILOCKER
  // (Only pure offline records like Tippan, Village Map, Police Panchnama, Affidavit, Pedhinama, Site Sketch)
  const isPureOffline =
    s.includes("tippan") ||
    s.includes("ટિપ્પન") ||
    s.includes("નકશો") ||
    (s.includes("map") && !s.includes("bitmap")) ||
    s.includes("panchnama") ||
    s.includes("પંચનામું") ||
    s.includes("affidavit") ||
    s.includes("સોગંદનામું") ||
    s.includes("pedhinama") ||
    s.includes("પેઢીનામું") ||
    s.includes("sketch") ||
    s.includes("પ્લાન") ||
    s.includes("site_plan") ||
    s.includes("challan") ||
    s.includes("ચલણ") ||
    s.includes("medical_cert") ||
    s.includes("doctor_cert");

  // If pure offline and does not contain light bill / address / photo / aadhaar, return false
  if (
    isPureOffline &&
    !s.includes("electricity") &&
    !s.includes("લાઈટ") &&
    !s.includes("વીજળી") &&
    !s.includes("address") &&
    !s.includes("સરનામ")
  ) {
    return false;
  }

  // SUPPORTED OFFICIAL DIGILOCKER CATEGORIES
  if (
    s.includes("photo") ||
    s.includes("ફોટો") ||
    s.includes("aadhaar") ||
    s.includes("આધાર") ||
    s.includes("income") ||
    s.includes("આવક") ||
    s.includes("salary") ||
    s.includes("ration") ||
    s.includes("રેશન") ||
    s.includes("7_12") ||
    s.includes("૭/૧૨") ||
    s.includes("8_a") ||
    s.includes("૮-અ") ||
    s.includes("ror") ||
    s.includes("ઉતારો") ||
    s.includes("caste") ||
    s.includes("જાતિ") ||
    s.includes("non_creamy") ||
    s.includes("ક્રીમીલેયર") ||
    s.includes("domicile") ||
    s.includes("ડોમિસાઇલ") ||
    s.includes("electricity") ||
    s.includes("વીજળી") ||
    s.includes("light") ||
    s.includes("લાઈટ") ||
    s.includes("address") ||
    s.includes("સરનામ") ||
    s.includes("residence") ||
    s.includes("રહેઠાણ") ||
    s.includes("update") ||
    s.includes("સુધારા") ||
    s.includes("driving") ||
    s.includes("લાયસન્સ") ||
    s.includes("rc") ||
    s.includes("vehicle") ||
    s.includes("વાહન") ||
    s.includes("ssc") ||
    s.includes("hsc") ||
    s.includes("marksheet") ||
    s.includes("ગુણપત્રક") ||
    s.includes("10th") ||
    s.includes("12th") ||
    s.includes("disability") ||
    s.includes("દિવ્યાંગ") ||
    s.includes("udid") ||
    s.includes("pan") ||
    s.includes("પાન") ||
    s.includes("ayushman") ||
    s.includes("pmjay") ||
    s.includes("આયુષ્માન") ||
    s.includes("birth") ||
    s.includes("જન્મ") ||
    s.includes("pension") ||
    s.includes("પેન્શન") ||
    s.includes("ppo") ||
    s.includes("voter") ||
    s.includes("ચૂંટણી") ||
    s.includes("epic") ||
    s.includes("identity") ||
    s.includes("ઓળખ")
  ) {
    return true;
  }

  return false;
}

export function validateDocSlotCompatibility(
  slotId: string,
  slotNameGu: string,
  chosenDocId: string,
  chosenDocNameGu: string,
  isPdf: boolean = false
): SlotCompatibilityResult {
  const sId = `${slotId || ""} ${slotNameGu || ""}`.toLowerCase();
  const dId = (chosenDocId || "").toLowerCase();

  // 0. CHECK IF SLOT IS EVEN IN DIGILOCKER
  if (!isSlotSupportedByDigiLocker(slotId, "", slotNameGu)) {
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ આ દસ્તાવેજ ('${slotNameGu}') ડીજીલોકરમાં ઇશ્યૂ થતો નથી. કૃપા કરીને કચેરીમાંથી મેળવેલ અસલ નકલ સીધી અપલોડ કરો.`,
    };
  }

  // 1. PASSPORT PHOTO SLOT
  if (sId.includes("photo") && !sId.includes("photo_id") && !sId.includes("identity")) {
    if (isPdf) {
      return {
        isCompatible: false,
        isStrictMismatch: true,
        matchScore: 0,
        warningMessageGu: `❌ અમાન્ય ફાઇલ પ્રકાર: 'અરજદારનો પાસપોર્ટ ફોટો' સ્લોટમાં PDF ફાઇલ માન્ય નથી! ફક્ત અરજદારનો રંગીન પાસપોર્ટ ફોટો (JPG / PNG) જ અપલોડ કરો.`,
      };
    }
    // ONLY Aadhaar (photo extract) or direct photo is allowed!
    if (dId === "aadhaar" || dId === "photo" || dId.includes("photo")) {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: 'અરજદારનો પાસપોર્ટ ફોટો' સ્લોટમાં '${chosenDocNameGu}' માન્ય નથી! ફક્ત અરજદારનો રંગીન પાસપોર્ટ ફોટો અથવા આધાર ફોટો જ માન્ય છે.`,
    };
  }

  // 2. LAND RECORD SLOT (7/12 & 8-A)
  if (sId.includes("7_12") || sId.includes("8_a") || sId.includes("ror") || sId.includes("land") || sId.includes("survey_7_12")) {
    if (dId === "land_records") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: '${slotNameGu}' સ્લોટમાં ફક્ત '૭/૧૨ અને ૮-અ જમીન ઉતારો' જ માન્ય છે. તમે '${chosenDocNameGu}' પસંદ કર્યું છે.`,
    };
  }

  // 3. INCOME PROOF SLOT
  if (sId.includes("income") || sId.includes("salary")) {
    if (dId === "income" || dId === "non_creamy_layer") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: '${slotNameGu}' સ્લોટમાં ફક્ત 'આવકનો દાખલો' જ માન્ય છે. તમે '${chosenDocNameGu}' પસંદ કર્યું છે.`,
    };
  }

  // 4. AADHAAR CARD SPECIFIC SLOT
  if (sId.includes("aadhaar") || sId.includes("aadhar") || sId.includes("applicant_aadhaar")) {
    if (dId === "aadhaar") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: '${slotNameGu}' સ્લોટમાં ફક્ત 'આધાર કાર્ડ' જ માન્ય છે. તમે '${chosenDocNameGu}' પસંદ કર્યું છે.`,
    };
  }

  // 5. RATION CARD SLOT
  if (sId.includes("ration")) {
    if (dId === "ration") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: રેશનકાર્ડ સ્લોટ માટે ફક્ત 'ડિજિટલ રેશનકાર્ડ' જ માન્ય છે.`,
    };
  }

  // 6. CASTE CERTIFICATE SLOT
  if (sId.includes("caste")) {
    if (dId === "caste") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: જાતિ સ્લોટ માટે ફક્ત 'જાતિનો દાખલો' જ માન્ય છે.`,
    };
  }

  // 7. NON CREAMY LAYER SLOT
  if (sId.includes("non_creamy") || sId.includes("ncl")) {
    if (dId === "non_creamy_layer") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: નોન-ક્રીમીલેયર સ્લોટ માટે ફક્ત 'નોન-ક્રીમીલેયર પ્રમાણપત્ર' જ માન્ય છે.`,
    };
  }

  // 8. ELECTRICITY / LIGHT BILL SLOT
  if (sId.includes("electricity") || sId.includes("light") || sId.includes("લાઈટ") || sId.includes("વીજળી")) {
    if (dId === "electricity") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    // If it's also an address or update slot, accept other residence documents from DigiLocker
    if (
      (sId.includes("address") || sId.includes("સરનામ") || sId.includes("update") || sId.includes("સુધારા")) &&
      ["ration", "domicile", "aadhaar"].includes(dId)
    ) {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 90 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: વીજળી બિલ સ્લોટ માટે ફક્ત 'વીજળી બિલ (PGVCL/UGVCL)' જ માન્ય છે.`,
    };
  }

  // 9. DOMICILE CERTIFICATE SLOT
  if (sId.includes("domicile")) {
    if (dId === "domicile") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: ડોમિસાઇલ સ્લોટ માટે ફક્ત 'ડોમિસાઇલ પ્રમાણપત્ર' જ માન્ય છે.`,
    };
  }

  // 10. DRIVING LICENCE SLOT
  if (sId.includes("driving") || sId.includes("licence")) {
    if (dId === "driving_licence") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: ડ્રાઇવિંગ લાયસન્સ સ્લોટ માટે ફક્ત 'ડ્રાઇવિંગ લાયસન્સ' જ માન્ય છે.`,
    };
  }

  // 11. VEHICLE RC BOOK SLOT
  if (sId.includes("rc_book") || sId.includes("vehicle") || sId.includes("rc")) {
    if (dId === "rc_book") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: વાહન રજિસ્ટ્રેશન સ્લોટ માટે ફક્ત 'RC બુક' જ માન્ય છે.`,
    };
  }

  // 12. BIRTH CERTIFICATE SLOT
  if (sId.includes("birth")) {
    if (dId === "birth_certificate") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: જન્મ પ્રમાણપત્ર સ્લોટ માટે ફક્ત 'જન્મ પ્રમાણપત્ર' જ માન્ય છે.`,
    };
  }

  // 13. PAN CARD SLOT
  if (sId.includes("pan") && !sId.includes("panchnama")) {
    if (dId === "pan") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: પાન કાર્ડ સ્લોટ માટે ફક્ત 'પાન કાર્ડ' જ માન્ય છે.`,
    };
  }

  // 14. GENERAL IDENTITY PROOF (Aadhaar / PAN / Voter ID / DL)
  if (sId.includes("identity") || sId.includes("photo_id")) {
    if (["aadhaar", "pan", "voter_id", "driving_licence"].includes(dId)) {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: ઓળખ પુરાવા માટે ફક્ત આધાર, પાન, ચૂંટણી કાર્ડ કે ડ્રાઇવિંગ લાયસન્સ માન્ય છે.`,
    };
  }

  // 15. GENERAL RESIDENCE / ADDRESS PROOF (Electricity / Ration / Domicile / Aadhaar)
  if (sId.includes("residence") || sId.includes("address") || sId.includes("સરનામ") || sId.includes("રહેઠાણ")) {
    if (["electricity", "ration", "domicile", "aadhaar"].includes(dId)) {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: રહેઠાણ / નવા સરનામાના પુરાવા માટે ફક્ત વીજળી બિલ, રેશનકાર્ડ, ડોમિસાઇલ કે આધાર માન્ય છે.`,
    };
  }

  // 16. UPDATE / CORRECTION PROOF (Address / DOB / Name change)
  if (sId.includes("update") || sId.includes("સુધારા")) {
    if (["electricity", "birth_certificate", "ssc_marksheet", "ration", "domicile", "aadhaar"].includes(dId)) {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: સુધારા માટે ફક્ત લાઈટ બિલ, જન્મ પ્રમાણપત્ર, ધોરણ ૧૦ માર્કશીટ, રેશનકાર્ડ કે ડોમિસાઇલ માન્ય છે.`,
    };
  }

  // 16. EDUCATION MARKSHEET (SSC / HSC)
  if (sId.includes("ssc") || sId.includes("10th")) {
    if (dId === "ssc_marksheet") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: ધોરણ ૧૦ સ્લોટ માટે ફક્ત ધોરણ ૧૦ નું ગુણપત્રક જ માન્ય છે.`,
    };
  }

  if (sId.includes("hsc") || sId.includes("12th")) {
    if (dId === "hsc_marksheet") {
      return { isCompatible: true, isStrictMismatch: false, matchScore: 100 };
    }
    return {
      isCompatible: false,
      isStrictMismatch: true,
      matchScore: 0,
      warningMessageGu: `❌ અસંગત દસ્તાવેજ: ધોરણ ૧૨ સ્લોટ માટે ફક્ત ધોરણ ૧૨ નું ગુણપત્રક જ માન્ય છે.`,
    };
  }

  // ALL OTHER UNKNOWN SLOTS: STRICT MISMATCH! ZERO LEAKAGE!
  return {
    isCompatible: false,
    isStrictMismatch: true,
    matchScore: 0,
    warningMessageGu: `❌ આ દસ્તાવેજ ('${slotNameGu}') ડીજીલોકરમાં ઇશ્યૂ થતો નથી. કૃપા કરીને કચેરીમાંથી મેળવેલ અસલ નકલ સીધી અપલોડ કરો.`,
  };
}

export interface DigiLockerConsentArtifact {
  consentId: string;
  timestamp: string;
  requesterOrg: string;
  purpose: string;
  purposeGu: string;
  dataSubject: string; // Citizen Aadhaar/Mobile
  requestedDocuments: string[]; // List of URIs or DocTypes
  retentionPeriod: string;
  legalNotice: string;
  signature: string;
}

// ─────────────────────────────────────────────────────────────────────────
// Authentic Default Issued Documents Repository (Specimen Data)
// ─────────────────────────────────────────────────────────────────────────
export const DEFAULT_ISSUED_DOCUMENTS: DigiLockerDocument[] = [
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    nameGu: "આધાર કાર્ડ (વિશિષ્ટ ઓળખ)",
    category: "identity",
    docType: "ADHAR",
    uri: "in.gov.uidai-ADHAR-XXXX-XXXX-1413",
    issuer: "Unique Identification Authority of India (UIDAI)",
    issuerGu: "યુનિક આઇડેન્ટિફિકેશન ઓથોરિટી ઓફ ઇન્ડિયા (UIDAI), ભારત સરકાર",
    issuerCode: "GOI-UIDAI-01",
    docNumber: "XXXX-XXXX-1413",
    issueDate: "15/06/2018",
    validTill: "આજીવન (Lifetime Valid)",
    digitalSignature: {
      signedBy: "CCA India - UIDAI e-Sign Authority",
      designation: "Authorized Signatory (Digital Sign 2.1)",
      certAuthority: "National Informatics Centre (NIC-CA)",
      timestamp: "2026-04-10 11:22:15 IST",
      status: "VALID",
      sha256: "9f83c12a781b0451e9412d09871fc317e0b51201aa8810e7b8f04b2c45e89d12",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Vinodrai Karshanbhai Patel",
      fatherNameGu: "વિનોદરાઈ કરશનભાઈ પટેલ",
      dob: "1982-06-15",
      gender: "male",
      address: "પ્લોટ નં. ૨૪, પટેલ ચોક, ગોમટા ગામ, તા. ગોંડલ, જિ. રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
      photoUrl: "/demo-docs/aadhaar_photo_hq.png",
    },
    filePreviewUrl: "/demo-docs/aadhaar_photo_hq.png",
  },
  {
    id: "income",
    name: "Income Certificate (Gujarat)",
    nameGu: "આવકનો દાખલો (૩ વર્ષની મુદત)",
    category: "revenue",
    docType: "INCRM",
    uri: "in.gov.gujarat.revenue-INCRM-2026-GJ-08921",
    issuer: "Office of the Mamlatdar, Gondal, Revenue Dept",
    issuerGu: "મામલતદાર કચેરી, ગોંડલ (મહેસૂલ વિભાગ, ગુજરાત સરકાર)",
    issuerCode: "GUJ-REV-GONDAL-01",
    docNumber: "INC/2026/09214",
    issueDate: "08/04/2026",
    validTill: "31/03/2029 (૩ નાણાકીય વર્ષ)",
    digitalSignature: {
      signedBy: "એચ. વી. પટેલ, GAS",
      designation: "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ",
      certAuthority: "Gujarat Informatics Limited (GIL-CA)",
      timestamp: "2026-04-08 14:10:02 IST",
      status: "VALID",
      sha256: "7b41e3d0912fbb3421ec8901aa4567c89f012e45da890123bc45ef78901234aa",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Vinodrai Karshanbhai Patel",
      fatherNameGu: "વિનોદરાઈ કરશનભાઈ પટેલ",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, તાલુકો ગોંડલ, જિલ્લો રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
      annualIncome: 180000,
    },
    filePreviewUrl: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
  },
  {
    id: "ration",
    name: "NFSA Digital Ration Card",
    nameGu: "ડિજિટલ રેશનકાર્ડ (NFSA APL-1)",
    category: "civil_supplies",
    docType: "RATN",
    uri: "in.gov.gujarat.fcs-RATN-2026-09281",
    issuer: "Food, Civil Supplies & Consumer Affairs Dept Gujarat",
    issuerGu: "અન્ન, નાગરિક પુરવઠા અને ગ્રાહક બાબતોનો વિભાગ, ગુજરાત સરકાર",
    issuerCode: "GUJ-FCS-01",
    docNumber: "GJ-03-FCS-2026-449102",
    issueDate: "10/01/2024",
    validTill: "સક્રિય કાર્ડ (Active NFSA)",
    digitalSignature: {
      signedBy: "જિલ્લા પુરવઠા અધિકારી (DSO), રાજકોટ",
      designation: "District Supply Officer",
      certAuthority: "National Informatics Centre (NIC-CA)",
      timestamp: "2024-01-10 16:45:00 IST",
      status: "VALID",
      sha256: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Vinodrai Karshanbhai Patel",
      fatherNameGu: "વિનોદરાઈ કરશનભાઈ પટેલ",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
      rationCardNo: "GJ-03-FCS-2026-449102",
      rationCategory: "NFSA - APL-1 (પ્રાધાન્ય કુટુંબ)",
      fpsShopNo: "FPS-108 (રાજકોટ પંચાયત સેવા કેન્દ્ર)",
    },
  },
  {
    id: "land_records",
    name: "AnyRoR Land Record (7/12 & 8-A)",
    nameGu: "જમીન ૭/૧૨ & ૮-અ ઉતારો (AnyRoR)",
    category: "revenue",
    docType: "ROR7",
    uri: "in.gov.gujarat.anyror-ROR7-2026-0391",
    issuer: "Revenue Department AnyRoR e-Dhara Kendra",
    issuerGu: "ઈ-ધરા મહેસૂલ કેન્દ્ર, ગોંડલ (AnyRoR ગુજરાત સરકાર)",
    issuerCode: "GUJ-EDHARA-01",
    docNumber: "EDHARA/GONDAL/412/2026",
    issueDate: "20/03/2026",
    validTill: "પ્રમાણિત ઓનલાઇન નકલ",
    digitalSignature: {
      signedBy: "સર્કલ ઓફિસર / મામલતદાર, ગોંડલ",
      designation: "e-Dhara Signing Authority",
      certAuthority: "Gujarat Informatics Limited (GIL-CA)",
      timestamp: "2026-03-20 09:30:10 IST",
      status: "VALID",
      sha256: "fedcba09876543210fedcba09876543210fedcba09876543210fedcba0987654",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા સીમ વિસ્તાર, ગોંડલ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
      khataNumber: "412",
      surveyNumber: "241/1 પૈકી",
      landArea: "1.42 હેક્ટર",
    },
  },
  {
    id: "electricity",
    name: "Electricity Bill (PGVCL)",
    nameGu: "વીજળી બિલ (PGVCL પાશ્ચિમ ગુજરાત)",
    category: "utility",
    docType: "ELPBL",
    uri: "in.gov.gujarat.energy-PGVCL-2026-88192",
    issuer: "Paschim Gujarat Vij Company Limited (PGVCL)",
    issuerGu: "પશ્ચિમ ગુજરાત વીજ કંપની લિ. (PGVCL), ગોંડલ સબ-ડિવિઝન",
    issuerCode: "GUJ-PGVCL-GONDAL",
    docNumber: "62104/8912/1",
    issueDate: "05/04/2026",
    validTill: "ચાલુ માસનું બિલ (Paid Status)",
    digitalSignature: {
      signedBy: "નાયબ ઈજનેર (Deputy Engineer), PGVCL ગોંડલ",
      designation: "Billing Authority",
      certAuthority: "CCA India Certified",
      timestamp: "2026-04-05 18:00:00 IST",
      status: "VALID",
      sha256: "8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      dob: "1982-06-15",
      gender: "male",
      address: "પ્લોટ નં. ૨૪, પટેલ ચોક, ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
      consumerNumber: "62104/8912/1",
    },
    filePreviewUrl: "/demo-docs/2_electricity_bill_pgvcl_gondal.png",
  },
  {
    id: "pan",
    name: "PAN Card",
    nameGu: "પાન કાર્ડ (PAN Card)",
    category: "taxation",
    docType: "PANCR",
    uri: "in.gov.incometax-PAN-ABCDE1234F",
    issuer: "Income Tax Department, Government of India",
    issuerGu: "આવકવેરા વિભાગ, નાણાં મંત્રાલય, ભારત સરકાર",
    issuerCode: "GOI-ITD-01",
    docNumber: "ABCDE1234F",
    issueDate: "12/08/2019",
    validTill: "આજીવન (Lifetime Valid)",
    digitalSignature: {
      signedBy: "Income Tax e-Governance NSDL/UTIITSL",
      designation: "PAN Issuing Authority",
      certAuthority: "Safescrypt CA",
      timestamp: "2019-08-12 12:00:00 IST",
      status: "VALID",
      sha256: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
      panNumber: "ABCDE1234F",
    },
    filePreviewUrl: "/demo-docs/3_pan_card_khunt_harkishan.png",
  },
  {
    id: "caste",
    name: "Caste Certificate (SC/ST/SEBC)",
    nameGu: "જાતિનો દાખલો (SC / ST / SEBC / OBC)",
    category: "social",
    docType: "CAST",
    uri: "in.gov.gujarat.sje-CAST-2026-08912",
    issuer: "Directorate of Social Welfare, Gujarat",
    issuerGu: "સામાજિક ન્યાય & અધિકારિતા વિભાગ, ગુજરાત સરકાર",
    issuerCode: "GUJ-SJE-01",
    docNumber: "SJE/CAST/2026/08912",
    issueDate: "14/02/2022",
    validTill: "આજીવન (Lifetime Valid)",
    digitalSignature: {
      signedBy: "જિલ્લા સમાજ કલ્યાણ અધિકારી, રાજકોટ",
      designation: "District Social Welfare Officer",
      certAuthority: "Gujarat Informatics Limited (GIL-CA)",
      timestamp: "2022-02-14 15:30:00 IST",
      status: "VALID",
      sha256: "33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
      subCaste: "કડવા પાટીદાર (SEBC / EWS)",
    },
    filePreviewUrl: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
  },
  {
    id: "non_creamy_layer",
    name: "Non-Creamy Layer Certificate",
    nameGu: "નોન-ક્રીમીલેયર પ્રમાણપત્ર (પરિશિષ્ટ-ક)",
    category: "social",
    docType: "NCL",
    uri: "in.gov.gujarat.revenue-NCL-2026-GJ-4412",
    issuer: "Office of the Mamlatdar, Gondal",
    issuerGu: "મામલતદાર કચેરી, મહેસૂલ વિભાગ, ગુજરાત સરકાર",
    issuerCode: "GUJ-REV-NCL",
    docNumber: "NCL/2026/04412",
    issueDate: "11/04/2026",
    validTill: "31/03/2029 (૩ નાણાકીય વર્ષ)",
    digitalSignature: {
      signedBy: "તાલુકા મામલતદાર, ગોંડલ",
      designation: "Executive Magistrate",
      certAuthority: "GIL-CA",
      timestamp: "2026-04-11 11:20:00 IST",
      status: "VALID",
      sha256: "5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
      annualIncome: 180000,
    },
    filePreviewUrl: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
  },
  {
    id: "domicile",
    name: "Gujarat Domicile Certificate",
    nameGu: "ગુજરાત રહેઠાણ પ્રમાણપત્ર (Domicile)",
    category: "identity",
    docType: "DOMC",
    uri: "in.gov.gujarat.home-DOMC-2026-7781",
    issuer: "District Collector Office, Rajkot",
    issuerGu: "જિલ્લા કલેક્ટર કચેરી, ગુજરાત સરકાર",
    issuerCode: "GUJ-COLL-01",
    docNumber: "DOMC/GJ03/2026/7781",
    issueDate: "05/01/2024",
    validTill: "આજીવન (Permanent Gujarat Resident)",
    digitalSignature: {
      signedBy: "નાયબ કલેક્ટર & સબ-ડિવિઝનલ મેજિસ્ટ્રેટ, ગોંડલ",
      designation: "Sub-Divisional Magistrate",
      certAuthority: "NIC-CA",
      timestamp: "2024-01-05 14:00:00 IST",
      status: "VALID",
      sha256: "66778899aabbccddeeff00112233445566778899aabbccddeeff001122334455",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
  },
  {
    id: "driving_licence",
    name: "Driving Licence (Gujarat)",
    nameGu: "ડ્રાઇવિંગ લાયસન્સ (વાહન ચાલક પરવાનો)",
    category: "utility",
    docType: "DRVLC",
    uri: "in.gov.morth-DRVLC-GJ0320210048291",
    issuer: "Ministry of Road Transport & Highways (MoRTH) / Gujarat RTO",
    issuerGu: "પરિવહન મંત્રાલય & વાહનવ્યવહાર કમિશનરેટ, ગુજરાત",
    issuerCode: "MORTH-GJ-03",
    docNumber: "GJ03 20210048291",
    issueDate: "18/07/2021",
    validTill: "14/06/2042 (LMV-NT, MCWG)",
    digitalSignature: {
      signedBy: "RTO Rajkot Licensing Authority",
      designation: "Assistant Regional Transport Officer",
      certAuthority: "NIC-CA",
      timestamp: "2021-07-18 16:15:00 IST",
      status: "VALID",
      sha256: "778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/3_pan_card_khunt_harkishan.png",
  },
  {
    id: "rc_book",
    name: "Vehicle Registration (RC Book)",
    nameGu: "વાહન રજિસ્ટ્રેશન પ્રમાણપત્ર (RC બુક)",
    category: "utility",
    docType: "REGCR",
    uri: "in.gov.morth-REGCR-GJ03BM4829",
    issuer: "Regional Transport Office (RTO Rajkot)",
    issuerGu: "આર.ટી.ઓ. કચેરી, વાહનવ્યવહાર વિભાગ, ગુજરાત સરકાર",
    issuerCode: "GUJ-RTO-03",
    docNumber: "GJ03BM4829",
    issueDate: "20/09/2022",
    validTill: "19/09/2037 (Fitness Valid)",
    digitalSignature: {
      signedBy: "Registering Authority, RTO Rajkot",
      designation: "ARTO Rajkot",
      certAuthority: "NIC-CA",
      timestamp: "2022-09-20 12:30:00 IST",
      status: "VALID",
      sha256: "8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/2_electricity_bill_pgvcl_gondal.png",
  },
  {
    id: "ssc_marksheet",
    name: "Class 10th (SSC) Marksheet",
    nameGu: "ધોરણ ૧૦ (SSC) બોર્ડ ગુણપત્રક",
    category: "identity",
    docType: "SSCMK",
    uri: "in.gov.gujarat.gseb-SSCMK-B892014",
    issuer: "Gujarat Secondary Education Board (GSEB)",
    issuerGu: "ગુજરાત માધ્યમિક અને ઉચ્ચતર માધ્યમિક શિક્ષણ બોર્ડ, ગાંધીનગર",
    issuerCode: "GUJ-GSEB-01",
    docNumber: "B-892014/1998",
    issueDate: "05/06/1998",
    validTill: "કાયમી રેકોર્ડ (Verified Pass)",
    digitalSignature: {
      signedBy: "પરીક્ષા સચિવ, GSEB ગાંધીનગર",
      designation: "Secretary, GSEB",
      certAuthority: "NIC-CA",
      timestamp: "2024-02-10 10:00:00 IST",
      status: "VALID",
      sha256: "99aabbccddeeff00112233445566778899aabbccddeeff001122334455667788",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
  },
  {
    id: "hsc_marksheet",
    name: "Class 12th (HSC) Marksheet",
    nameGu: "ધોરણ ૧૨ (HSC) બોર્ડ ગુણપત્રક",
    category: "identity",
    docType: "HSCMK",
    uri: "in.gov.gujarat.gseb-HSCMK-C492019",
    issuer: "Gujarat Secondary Education Board (GSEB)",
    issuerGu: "ગુજરાત માધ્યમિક અને ઉચ્ચતર માધ્યમિક શિક્ષણ બોર્ડ, ગાંધીનગર",
    issuerCode: "GUJ-GSEB-02",
    docNumber: "C-492019/2000",
    issueDate: "25/05/2000",
    validTill: "કાયમી રેકોર્ડ (Verified Pass)",
    digitalSignature: {
      signedBy: "પરીક્ષા નિયામક, GSEB ગાંધીનગર",
      designation: "Examination Controller",
      certAuthority: "NIC-CA",
      timestamp: "2024-02-10 10:30:00 IST",
      status: "VALID",
      sha256: "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
  },
  {
    id: "disability_udid",
    name: "Disability UDID Certificate",
    nameGu: "દિવ્યાંગતા પ્રમાણપત્ર (UDID Card)",
    category: "social",
    docType: "DISAB",
    uri: "in.gov.swavlamban-UDID-GJ03108920",
    issuer: "Department of Empowerment of Persons with Disabilities, GoI",
    issuerGu: "દિવ્યાંગજન સશક્તિકરણ વિભાગ, ભારત સરકાર",
    issuerCode: "GOI-UDID-01",
    docNumber: "GJ03101198200892",
    issueDate: "12/03/2021",
    validTill: "કાયમી માન્ય (Permanent Disability)",
    digitalSignature: {
      signedBy: "મુખ્ય જિલ્લા તબીબી અધિકારી (CDMO), રાજકોટ",
      designation: "Civil Surgeon & Medical Superintendent",
      certAuthority: "NIC-CA",
      timestamp: "2021-03-12 16:00:00 IST",
      status: "VALID",
      sha256: "bbccddeeff00112233445566778899aabbccddeeff00112233445566778899aa",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
  },
  {
    id: "ayushman_card",
    name: "Ayushman Bharat PMJAY / MA Card",
    nameGu: "આયુષ્માન ભારત કાર્ડ (PMJAY / MA વાત્સલ્ય)",
    category: "social",
    docType: "PMJAY",
    uri: "in.gov.pmjay-CARD-GJ-8921-4829",
    issuer: "National Health Authority (NHA) & Health Dept Gujarat",
    issuerGu: "નેશનલ હેલ્થ ઓથોરિટી & આરોગ્ય વિભાગ, ગુજરાત સરકાર",
    issuerCode: "NHA-PMJAY-GJ",
    docNumber: "PMJAY-GJ-03-882194",
    issueDate: "15/09/2023",
    validTill: "સક્રિય આયુષ્માન કવરેજ (₹૧૦ લાખ કેશલેસ)",
    digitalSignature: {
      signedBy: "સ્ટેટ હેલ્થ એજન્સી (SHA) ગુજરાત",
      designation: "CEO, State Health Agency",
      certAuthority: "NIC-CA",
      timestamp: "2023-09-15 11:45:00 IST",
      status: "VALID",
      sha256: "ccddeeff00112233445566778899aabbccddeeff00112233445566778899aabb",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/3_pan_card_khunt_harkishan.png",
  },
  {
    id: "birth_certificate",
    name: "Birth Certificate",
    nameGu: "જન્મ પ્રમાણપત્ર (પંચાયત/પાલિકા)",
    category: "identity",
    docType: "BIRTH",
    uri: "in.gov.gujarat.health-BIRTH-2026-0912",
    issuer: "Chief Registrar of Births and Deaths, Health Dept Gujarat",
    issuerGu: "જન્મ-મરણ નોંધણી શાખા, આરોગ્ય વિભાગ ગુજરાત",
    issuerCode: "GUJ-BIRTH-REG",
    docNumber: "GJ-BIRTH-2026-0912",
    issueDate: "20/06/1982",
    validTill: "આજીવન સત્તાવાર નકલ",
    digitalSignature: {
      signedBy: "રજિસ્ટ્રાર જન્મ-મરણ & તલાટી કમ મંત્રી, ગોમટા",
      designation: "Panchayat Registrar",
      certAuthority: "GIL-CA",
      timestamp: "2024-01-10 10:15:00 IST",
      status: "VALID",
      sha256: "ddeeff00112233445566778899aabbccddeeff00112233445566778899aabbcc",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Vinodrai Karshanbhai Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
  },
  {
    id: "pension_ppo",
    name: "Pension Payment Order (PPO)",
    nameGu: "પેન્શન પેમેન્ટ ઓર્ડર (PPO હુકમ)",
    category: "social",
    docType: "PNSPO",
    uri: "in.gov.gujarat.finance-PPO-2026-08129",
    issuer: "Directorate of Pension & Provident Fund, Finance Dept",
    issuerGu: "પેન્શન અને પ્રોવિડન્ટ ફંડ નિયામક, નાણાં વિભાગ ગાંધીનગર",
    issuerCode: "GUJ-DPPF-01",
    docNumber: "PPO/GJ/2026/08129",
    issueDate: "31/12/2023",
    validTill: "ચાલુ માસિક પેન્શન",
    digitalSignature: {
      signedBy: "સહાયક નિયામક, DPPF ગાંધીનગર",
      designation: "Assistant Director Pension",
      certAuthority: "NIC-CA",
      timestamp: "2023-12-31 17:00:00 IST",
      status: "VALID",
      sha256: "eeff00112233445566778899aabbccddeeff00112233445566778899aabbccdd",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/1_birth_certificate_khunt_harkishan.png",
  },
  {
    id: "voter_id",
    name: "Voter ID Card (EPIC)",
    nameGu: "ચૂંટણી ઓળખપત્ર (Voter ID / EPIC)",
    category: "identity",
    docType: "EPIC",
    uri: "in.gov.eci-EPIC-GJ-03-741029",
    issuer: "Election Commission of India (ECI)",
    issuerGu: "ભારતનું ચૂંટણી પંચ (ECI)",
    issuerCode: "GOI-ECI-01",
    docNumber: "GJ/03/074/102984",
    issueDate: "10/01/2014",
    validTill: "આજીવન (Lifetime Electoral Roll)",
    digitalSignature: {
      signedBy: "ઇલેક્ટોરલ રજીસ્ટ્રેશન ઓફિસર (ERO), ગોંડલ વિધાનસભા ૧૧૮",
      designation: "Electoral Registration Officer",
      certAuthority: "NIC-CA",
      timestamp: "2024-01-01 09:00:00 IST",
      status: "VALID",
      sha256: "ff00112233445566778899aabbccddeeff00112233445566778899aabbccddee",
    },
    extractedData: {
      fullName: "Hari Vinodrai Patel",
      fullNameGu: "હરી વિનોદરાઈ પટેલ",
      fatherName: "Kantilal Patel",
      dob: "1982-06-15",
      gender: "male",
      address: "ગોમટા, ગોંડલ, રાજકોટ",
      district: "Rajkot",
      taluka: "Gondal",
      village: "ગોમટા (Gomta)",
      pincode: "360311",
      aadhaarLast4: "4829",
    },
    filePreviewUrl: "/demo-docs/3_pan_card_khunt_harkishan.png",
  },
];

export interface MasterDocTypeOption {
  id: string;
  nameGu: string;
  nameEn: string;
  category: "identity" | "revenue" | "civil_supplies" | "utility" | "taxation" | "social";
  docType: string;
  issuerGu: string;
  issuerEn: string;
}

export const DIGILOCKER_MASTER_DOC_TYPES: MasterDocTypeOption[] = [
  { id: "income", nameGu: "આવકનો દાખલો (Income Certificate)", nameEn: "Income Certificate", category: "revenue", docType: "INCRM", issuerGu: "મામલતદાર કચેરી, મહેસૂલ વિભાગ, ગુજરાત સરકાર", issuerEn: "Mamlatdar Office, Revenue Department" },
  { id: "aadhaar", nameGu: "આધાર કાર્ડ (Aadhaar Card)", nameEn: "Aadhaar Card", category: "identity", docType: "ADHAR", issuerGu: "UIDAI, ભારત સરકાર", issuerEn: "Unique Identification Authority of India" },
  { id: "ration", nameGu: "રેશનકાર્ડ (NFSA Ration Card)", nameEn: "Ration Card", category: "civil_supplies", docType: "RATN", issuerGu: "અન્ન અને નાગરિક પુરવઠા વિભાગ, ગુજરાત સરકાર", issuerEn: "Food & Civil Supplies Department" },
  { id: "land_records", nameGu: "૭/૧૨ અને ૮-અ જમીન ઉતારો (AnyRoR Land Record)", nameEn: "7/12 & 8-A Land Record", category: "revenue", docType: "ROR7", issuerGu: "ઈ-ધરા કેન્દ્ર, મહેસૂલ વિભાગ, ગુજરાત સરકાર", issuerEn: "e-Dhara Revenue Centre, Gujarat" },
  { id: "caste", nameGu: "જાતિનો દાખલો (SC/ST/SEBC/OBC)", nameEn: "Caste Certificate", category: "social", docType: "CAST", issuerGu: "સામાજિક ન્યાય & અધિકારિતા વિભાગ, ગુજરાત સરકાર", issuerEn: "Social Justice & Empowerment Department" },
  { id: "non_creamy_layer", nameGu: "નોન-ક્રીમીલેયર પ્રમાણપત્ર (Non-Creamy Layer)", nameEn: "Non-Creamy Layer Certificate", category: "social", docType: "NCL", issuerGu: "મામલતદાર કચેરી, મહેસૂલ વિભાગ", issuerEn: "Mamlatdar Office, Revenue Dept" },
  { id: "domicile", nameGu: "ડોમિસાઇલ / રહેઠાણ પ્રમાણપત્ર (Domicile Certificate)", nameEn: "Domicile Certificate", category: "identity", docType: "DOMC", issuerGu: "કલેક્ટર કચેરી, ગુજરાત સરકાર", issuerEn: "District Collector Office" },
  { id: "electricity", nameGu: "વીજળી બિલ (PGVCL / Electricity Bill)", nameEn: "Electricity Bill", category: "utility", docType: "ELPBL", issuerGu: "પશ્ચિમ ગુજરાત વીજ કંપની લિ. (PGVCL)", issuerEn: "Paschim Gujarat Vij Co. Ltd." },
  { id: "driving_licence", nameGu: "ડ્રાઇવિંગ લાયસન્સ (Driving Licence)", nameEn: "Driving Licence", category: "utility", docType: "DRVLC", issuerGu: "વાહનવ્યવહાર કમિશનરેટ / RTO ગુજરાત", issuerEn: "Transport Commissionerate / RTO" },
  { id: "rc_book", nameGu: "વાહન રજિસ્ટ્રેશન / RC બુક (Vehicle RC)", nameEn: "Vehicle RC Book", category: "utility", docType: "REGCR", issuerGu: "પરિવહન મંત્રાલય / RTO કચેરી", issuerEn: "MoRTH / RTO" },
  { id: "ssc_marksheet", nameGu: "ધોરણ ૧૦ (SSC) બોર્ડ ગુણપત્રક", nameEn: "Class 10th (SSC) Marksheet", category: "identity", docType: "SSCMK", issuerGu: "ગુજરાત માધ્યમિક શિક્ષણ બોર્ડ (GSEB)", issuerEn: "Gujarat Secondary Education Board" },
  { id: "hsc_marksheet", nameGu: "ધોરણ ૧૨ (HSC) બોર્ડ ગુણપત્રક", nameEn: "Class 12th (HSC) Marksheet", category: "identity", docType: "HSCMK", issuerGu: "ગુજરાત માધ્યમિક શિક્ષણ બોર્ડ (GSEB)", issuerEn: "Gujarat Higher Secondary Education Board" },
  { id: "disability_udid", nameGu: "દિવ્યાંગતા પ્રમાણપત્ર (UDID Card)", nameEn: "Disability UDID Card", category: "social", docType: "DISAB", issuerGu: "દિવ્યાંગજન સશક્તિકરણ વિભાગ, ભારત સરકાર", issuerEn: "Department of Disability Affairs, GoI" },
  { id: "pan", nameGu: "પાન કાર્ડ (PAN Card)", nameEn: "PAN Card", category: "taxation", docType: "PANCR", issuerGu: "આવકવેરા વિભાગ, ભારત સરકાર", issuerEn: "Income Tax Department" },
  { id: "ayushman_card", nameGu: "આયુષ્માન ભારત કાર્ડ (PMJAY / MA Card)", nameEn: "Ayushman Bharat PMJAY Card", category: "social", docType: "PMJAY", issuerGu: "આરોગ્ય & પરિવાર કલ્યાણ વિભાગ, ગુજરાત", issuerEn: "Health & Family Welfare Department" },
  { id: "birth_certificate", nameGu: "જન્મ પ્રમાણપત્ર (Birth Certificate)", nameEn: "Birth Certificate", category: "identity", docType: "BIRTH", issuerGu: "જન્મ-મરણ નોંધણી શાખા, પંચાયત/પાલિકા", issuerEn: "Health Branch, Panchayat / Municipal Corp" },
  { id: "pension_ppo", nameGu: "પેન્શન પેમેન્ટ ઓર્ડર (Pension PPO)", nameEn: "Pension Payment Order", category: "social", docType: "PNSPO", issuerGu: "પેન્શન & પ્રોવિડન્ટ ફંડ નિયામક, નાણાં વિભાગ", issuerEn: "Directorate of Pension & PF, Finance Dept" },
  { id: "voter_id", nameGu: "ચૂંટણી ઓળખપત્ર (Voter ID / EPIC)", nameEn: "Voter ID Card (EPIC)", category: "identity", docType: "EPIC", issuerGu: "ભારતનું ચૂંટણી પંચ (ECI)", issuerEn: "Election Commission of India" },
];

// ─────────────────────────────────────────────────────────────────────────
// Vault Helper Functions
// ─────────────────────────────────────────────────────────────────────────

export function getIssuedDocuments(
  overrideNameGu?: string,
  overrideNameEn?: string,
  overrideAadhaarLast4?: string
): DigiLockerDocument[] {
  let citizenNameGu = overrideNameGu;
  let citizenNameEn = overrideNameEn;
  let aadhaarLast4 = overrideAadhaarLast4;

  if (typeof window !== "undefined") {
    try {
      const sessRaw = localStorage.getItem("nagrik_citizen_session");
      if (sessRaw) {
        const sess = JSON.parse(sessRaw);
        if (!citizenNameGu && sess.citizenNameGu) citizenNameGu = sess.citizenNameGu;
        if (!citizenNameEn && sess.citizenName) citizenNameEn = sess.citizenName;
        if (!aadhaarLast4 && sess.aadhaarLast4) aadhaarLast4 = sess.aadhaarLast4;
      }
    } catch {}
  }

  const baseDocs = DEFAULT_ISSUED_DOCUMENTS.map((doc) => {
    const updated = { ...doc };
    if (citizenNameGu || citizenNameEn || aadhaarLast4) {
      updated.extractedData = {
        ...updated.extractedData,
        fullNameGu: citizenNameGu || updated.extractedData.fullNameGu,
        fullName: citizenNameEn || updated.extractedData.fullName,
        aadhaarLast4: aadhaarLast4 || updated.extractedData.aadhaarLast4,
      };
      if (doc.id === "aadhaar" && aadhaarLast4) {
        updated.docNumber = `XXXX-XXXX-${aadhaarLast4}`;
        updated.uri = `in.gov.uidai-ADHAR-XXXX-XXXX-${aadhaarLast4}`;
      }
    }
    return updated;
  });

  if (typeof window === "undefined") {
    return baseDocs;
  }

  try {
    const raw = localStorage.getItem("nagrik_digilocker_vault");
    if (!raw) return baseDocs;
    const customDocs: DigiLockerDocument[] = JSON.parse(raw);

    // Merge custom user-linked documents with default documents
    const docMap = new Map<string, DigiLockerDocument>();
    baseDocs.forEach((d) => docMap.set(d.id, d));
    customDocs.forEach((d) => docMap.set(d.id, { ...d, isCustomLinked: true }));

    return Array.from(docMap.values());
  } catch {
    return baseDocs;
  }
}

export function saveDocumentToPersonalVault(doc: DigiLockerDocument): void {
  if (typeof window === "undefined") return;
  try {
    const current = getIssuedDocuments();
    const updated = current.filter((d) => d.id !== doc.id);
    updated.unshift({ ...doc, isCustomLinked: true });
    localStorage.setItem("nagrik_digilocker_vault", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("nagrik_digilocker_vault_updated"));
  } catch (e) {
    console.error("Failed to save document to personal vault:", e);
  }
}

export function deleteDocumentFromPersonalVault(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("nagrik_digilocker_vault");
    if (!raw) return;
    const current: DigiLockerDocument[] = JSON.parse(raw);
    const filtered = current.filter((d) => d.id !== id);
    localStorage.setItem("nagrik_digilocker_vault", JSON.stringify(filtered));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("nagrik_digilocker_vault_updated"));
  } catch (e) {
    console.error("Failed to delete document from vault:", e);
  }
}

export function generateConsentArtifact(
  dataSubject: string,
  requestedDocs: string[],
  purposeGu: string = "સરકારી કલ્યાણકારી યોજના/પ્રમાણપત્ર અરજી ખરાઈ હેતુ (Verification under Gujarat IT Rules 2016)"
): DigiLockerConsentArtifact {
  const timestamp = new Date().toISOString();
  const consentId = `CONSENT-GJ-${Date.now().toString().slice(-8)}`;

  return {
    consentId,
    timestamp,
    requesterOrg: "Department of Science and Technology (DST) & e-Governance, Gujarat",
    purpose: "Welfare scheme eligibility validation and e-District document scrutiny",
    purposeGu,
    dataSubject,
    requestedDocuments: requestedDocs,
    retentionPeriod: "One-Time Fetch (Application Lifecycle Only)",
    legalNotice:
      "IT Act 2000 & DigiLocker Rules 2016 (Rule 9A) - Documents retrieved are legally at par with original physical copies.",
    signature: `SHA256-RSA-${consentId}-${timestamp.slice(0, 10)}`,
  };
}
