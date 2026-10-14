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
    uri: "in.gov.uidai-ADHAR-XXXX-XXXX-4829",
    issuer: "Unique Identification Authority of India (UIDAI)",
    issuerGu: "યુનિક આઇડેન્ટિફિકેશન ઓથોરિટી ઓફ ઇન્ડિયા (UIDAI), ભારત સરકાર",
    issuerCode: "GOI-UIDAI-01",
    docNumber: "XXXX-XXXX-4829",
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
      fullName: "Rameshbhai Kantilal Patel",
      fullNameGu: "રમેશભાઈ કાંતિલાલ પટેલ",
      fatherName: "Kantilal Laljibhai Patel",
      fatherNameGu: "કાંતિલાલ લાલજીભાઈ પટેલ",
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
      fullName: "Rameshbhai Kantilal Patel",
      fullNameGu: "રમેશભાઈ કાંતિલાલ પટેલ",
      fatherName: "Kantilal Laljibhai Patel",
      fatherNameGu: "કાંતિલાલ લાલજીભાઈ પટેલ",
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
      fullName: "Rameshbhai Kantilal Patel",
      fullNameGu: "રમેશભાઈ કાંતિલાલ પટેલ",
      fatherName: "Kantilal Laljibhai Patel",
      fatherNameGu: "કાંતિલાલ લાલજીભાઈ પટેલ",
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
      fullName: "Rameshbhai Kantilal Patel",
      fullNameGu: "રમેશભાઈ કાંતિલાલ પટેલ",
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
      fullName: "Rameshbhai Kantilal Patel",
      fullNameGu: "રમેશભાઈ કાંતિલાલ પટેલ",
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
      fullName: "Ramesh Kantilal Patel",
      fullNameGu: "રમેશ કાંતિલાલ પટેલ",
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
];

// ─────────────────────────────────────────────────────────────────────────
// Vault Helper Functions
// ─────────────────────────────────────────────────────────────────────────

export function getIssuedDocuments(): DigiLockerDocument[] {
  if (typeof window === "undefined") {
    return DEFAULT_ISSUED_DOCUMENTS;
  }

  try {
    const raw = localStorage.getItem("nagrik_digilocker_vault");
    if (!raw) return DEFAULT_ISSUED_DOCUMENTS;
    const customDocs: DigiLockerDocument[] = JSON.parse(raw);

    // Merge custom user-linked documents with default documents
    const docMap = new Map<string, DigiLockerDocument>();
    DEFAULT_ISSUED_DOCUMENTS.forEach((d) => docMap.set(d.id, d));
    customDocs.forEach((d) => docMap.set(d.id, { ...d, isCustomLinked: true }));

    return Array.from(docMap.values());
  } catch {
    return DEFAULT_ISSUED_DOCUMENTS;
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
