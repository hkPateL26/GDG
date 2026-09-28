"use client";

import { useState, useEffect } from "react";
import {
  DOCUMENT_SERVICES,
  GUJARAT_DISTRICTS,
  CitizenApplication,
  lookupCitizenExistingRecord,
  ExistingCitizenProfile,
} from "@/lib/large-datasets";
import {
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Fingerprint,
  Sparkles,
  Smartphone,
  Eye,
  FileText,
  Printer,
  XCircle,
  Search,
  CreditCard,
  QrCode,
  Receipt,
  Building,
  Check,
  Download,
  Landmark,
  ArrowLeftRight,
  Camera,
  LogOut,
  RotateCw,
} from "lucide-react";
import Link from "next/link";
import GovernmentReceiptSlip from "@/components/GovernmentReceiptSlip";
import CitizenLoginShield from "@/components/CitizenLoginShield";

interface UploadedDocState {
  file: File | null;
  fileName: string;
  fileType: string;
  base64: string;
  status: "idle" | "analyzing" | "valid" | "warning" | "invalid";
  qualityScore?: number;
  adviceGu?: string;
  needsUpdate?: boolean;
  needsNewDocument?: boolean;
}

export default function DocumentServicePortal({
  hideCitizenHeader = false,
}: {
  hideCitizenHeader?: boolean;
} = {}) {
  // 1. Service Selection & Mode
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("nagrik_reapply_context");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.serviceId) return parsed.serviceId;
        }
      } catch {}
    }
    return "aadhaar";
  });

  const [serviceMode, setServiceMode] = useState<"new" | "update">(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("nagrik_reapply_context");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.serviceMode) return parsed.serviceMode;
        }
      } catch {}
    }
    return "update";
  });

  const [reapplyContext, setReapplyContext] = useState<{
    appId: string;
    schemeId: string;
    serviceId: string;
    serviceMode: "new" | "update";
    schemeNameGu: string;
    remarksGu: string;
    officerDesignation: string;
  } | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("nagrik_reapply_context");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // 2. Existing Card Lookup & Auto-Fetch (for Update Mode)
  const [lookupNumber, setLookupNumber] = useState<string>("");
  const [isFetchingProfile, setIsFetchingProfile] = useState<boolean>(false);
  const [fetchedProfile, setFetchedProfile] = useState<ExistingCitizenProfile | null>(null);

  // 3. Multi-Select Corrections (for Update Mode)
  const [selectedCorrections, setSelectedCorrections] = useState<string[]>(["address"]);
  const [oldVsNewValues, setOldVsNewValues] = useState<Record<string, { oldVal: string; newVal: string }>>({
    address: {
      oldVal: "ઘર નં. ૧૨, પટેલ વાસ, ગોમટા ગામ, તા. ગોંડલ, જિ. રાજકોટ - ૩૬૦૩૨૦",
      newVal: "પ્લોટ નં. ૪૫, શિવ દર્શન રેસિડેન્સી, કાલાવડ રોડ, રાજકોટ - ૩૬૦૦૦૫",
    },
    mobile: {
      oldVal: "૯૮૨૫૦ *****",
      newVal: "૯૮૨૫૦ ૧૨૩૪૫",
    },
    name: {
      oldVal: "રમેશભાઈ કાંતિલાલ પટેલ",
      newVal: "રમેશભાઈ કાંતિલાલ પટેલ (Ramesh K. Patel)",
    },
    dob: {
      oldVal: "15/06/1985",
      newVal: "15/06/1986",
    },
    add_member: {
      oldVal: "કુલ ૩ સભ્યો હયાત",
      newVal: "નવા સભ્ય: પ્રિયાંશી આર. પટેલ (પુત્રી - ઉંમર ૨ વર્ષ)",
    },
    photo_biometric: {
      oldVal: "હાલનો આધાર ફોટો & બાયોમેટ્રિક્સ (૧૦ વર્ષ જૂનું)",
      newVal: "નવો પાસપોર્ટ ફોટો & રૂબરૂ ફાસ્ટ-ટ્રેક સ્લોટ",
    },
    photo_sign: {
      oldVal: "હાલનો ફોટો & સહી (સરકારી રેકોર્ડ)",
      newVal: "નવો પાસપોર્ટ ફોટો & સહી અપલોડ",
    },
  });

  // Specialized states for Family Member additions
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberRelation, setNewMemberRelation] = useState<string>("પુત્રી (Daughter)");
  const [newMemberAge, setNewMemberAge] = useState<string>("");
  const [newMemberAadhaar, setNewMemberAadhaar] = useState<string>("");

  // 4. Kacheri Official Detailed Form Fields (Universal / New Application)
  const [applicantName, setApplicantName] = useState<string>("");
  const [applicantNameGu, setApplicantNameGu] = useState<string>("");
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState<string>("");
  const [motherName] = useState<string>("");
  const [dob, setDob] = useState<string>("1985-06-15");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [maritalStatus] = useState<string>("વિવાહિત (Married)");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [aadhaarNumber, setAadhaarNumber] = useState<string>("");

  // Detailed Kacheri Address Fields
  const [district, setDistrict] = useState<string>("Rajkot");
  const [taluka, setTaluka] = useState<string>("Gondal");
  const [village, setVillage] = useState<string>("");
  const [houseNo, setHouseNo] = useState<string>("");
  const [streetSociety, setStreetSociety] = useState<string>("");
  const [pincode, setPincode] = useState<string>("360311");

  // Service Specific Kacheri Fields
  const [rationCategory, setRationCategory] = useState<string>("NFSA - APL-1");
  const [fpsShopNo, setFpsShopNo] = useState<string>("FPS-108 (રાજકોટ પંચાયત સેવા કેન્દ્ર)");
  const [gasConnectionStatus] = useState<string>("સિંગલ બોટલ (Single Cylinder)");
  const [bankAccountNo] = useState<string>("•••• •••• 4912");
  const [bankIfsc] = useState<string>("SBIN0001249");
  const [annualIncomeVal, setAnnualIncomeVal] = useState<string>("180000");
  const [occupation, setOccupation] = useState<string>("ખેતી / વ્યવસાય (Farmer)");
  const [subCaste, setSubCaste] = useState<string>("કડવા પાટીદાર (પટેલ)");
  const [religion, setReligion] = useState<string>("હિન્દુ (Hindu)");

  // Extended Government Services Form States
  const [surveyNumber, setSurveyNumber] = useState<string>("241/1 પૈકી");
  const [khataNumber, setKhataNumber] = useState<string>("412");
  const [landArea, setLandArea] = useState<string>("1.42 હેક્ટર");
  const [childName, setChildName] = useState<string>("હરી");
  const [birthPlace, setBirthPlace] = useState<string>("સિવિલ હોસ્પિટલ, રાજકોટ");
  const [deceasedName, setDeceasedName] = useState<string>("નારણભાઈ પટેલ");
  const [deathDate, setDeathDate] = useState<string>("2023-11-04");
  const [deathPlace, setDeathPlace] = useState<string>("રાજકોટ (ઘરે)");
  const [ewsPropertyType, setEwsPropertyType] = useState<string>("રહેણાંક મકાન (< ૧૦૦૦ ચો.ફૂટ)");
  const [domicileYears, setDomicileYears] = useState<string>("૨૦ વર્ષ (જન્મથી ગુજરાત)");
  const [seniorBloodGroup, setSeniorBloodGroup] = useState<string>("B+");
  const [seniorEmergencyPhone, setSeniorEmergencyPhone] = useState<string>("9974442291");
  const [drivingClass, setDrivingClass] = useState<string>("MCWG (મોટરસાયકલ) & LMV (કાર)");
  const [rtoOfficeName, setRtoOfficeName] = useState<string>("GJ-03 RTO કચેરી, રાજકોટ");
  const [marriageDate, setMarriageDate] = useState<string>("2025-02-14");
  const [spouseName, setSpouseName] = useState<string>("પ્રિયાબેન");

  // Category and Search filter for the 69 services selector
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>("all");
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>("");

  // 5. Document Uploads & AI Inspections
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDocState>>({});

  // 6. Phygital: Signature selection
  const [signatureType, setSignatureType] = useState<"aadhaar-esign" | "physical-declaration">("aadhaar-esign");

  // 7. Payment Gateway Modal State (Cyber Treasury / Bharat BillPay)
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "challan">("upi");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [activeTxnId, setActiveTxnId] = useState<string>("");
  const [activeChallanNo, setActiveChallanNo] = useState<string>("");
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);

  // 8. Submission & Notification Alert Simulation
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<CitizenApplication | null>(null);
  const [notificationPayload, setNotificationPayload] = useState<{
    sms?: { sentTo: string; message: string; timestamp: string };
    email?: { sentTo: string; subject: string; timestamp: string };
  } | null>(null);

  const [citizenSession, setCitizenSession] = useState<{
    citizenName?: string;
    citizenNameGu?: string;
    mobile?: string;
    aadhaarLast4?: string;
    district?: string;
    taluka?: string;
    village?: string;
    annualIncome?: number;
  } | null>(null);

  // Restore authenticated citizen session and auto-prefill fields
  useEffect(() => {
    if (typeof window !== "undefined") {
      const syncSession = () => {
        const saved = localStorage.getItem("nagrik_citizen_session");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed) {
              const cit = parsed.citizen || parsed;
              setCitizenSession(cit);
              setApplicantName((prev) => prev || cit.citizenName || "Hari Vinodrai Patel");
              setApplicantNameGu((prev) => prev || cit.citizenNameGu || "હરી વિનોદરાઈ પટેલ");
              setMobileNumber((prev) => prev || cit.mobile || "9974442291");
              setAadhaarNumber((prev) => prev || `XXXX-XXXX-${cit.aadhaarLast4 || "1413"}`);
              if (cit.district) setDistrict(cit.district);
              if (cit.taluka) setTaluka(cit.taluka);
              if (cit.village) setVillage(cit.village);
              if (cit.annualIncome) setAnnualIncomeVal(String(cit.annualIncome));
            }
          } catch (e) {
            console.error("Failed to parse citizen session:", e);
          }
        } else {
          setCitizenSession(null);
        }
      };

      syncSession();
      window.addEventListener("storage", syncSession);
      return () => window.removeEventListener("storage", syncSession);
    }
  }, []);

  const handleDocLogout = () => {
    localStorage.removeItem("nagrik_citizen_session");
    window.dispatchEvent(new Event("storage"));
    setCitizenSession(null);
  };

  const service = DOCUMENT_SERVICES.find((s) => s.id === selectedServiceId) || DOCUMENT_SERVICES[0];
  const isBiometricNeeded = serviceMode === "new" ? service.biometricRequiredNew : service.biometricRequiredUpdate;
  const currentDistObj = GUJARAT_DISTRICTS.find((d) => d.en === district) || GUJARAT_DISTRICTS[0];

  // Dynamic Required Documents calculation based on service and selected corrections
  const getDynamicRequiredDocs = () => {
    if (serviceMode === "new") {
      return service.requiredDocsNew;
    }

    // Base document: existing copy of current document
    const docs = [...service.requiredDocsUpdate];

    if (selectedCorrections.includes("address")) {
      if (!docs.some((d) => d.id === "address_proof_new")) {
        docs.push({
          id: "address_proof_new",
          nameEn: "Proof of New Address (Electricity Bill / Tax Receipt / Registry)",
          nameGu: "નવા સરનામાનો અધિકૃત પુરાવો (લાઈટ બિલ / મિલકત વેરા બિલ)",
          mandatory: true,
        });
      }
    }

    if (selectedCorrections.includes("name") || selectedCorrections.includes("dob")) {
      if (!docs.some((d) => d.id === "name_dob_proof")) {
        docs.push({
          id: "name_dob_proof",
          nameEn: "Birth Certificate / School Leaving Certificate (LC) for Name/DOB Proof",
          nameGu: "જન્મનો દાખલો / શાળા છોડ્યાનું પ્રમાણપત્ર (LC - જન્મ/નામ પુરાવો)",
          mandatory: true,
        });
      }
    }

    if (selectedCorrections.includes("add_member")) {
      if (!docs.some((d) => d.id === "member_proof")) {
        docs.push({
          id: "member_proof",
          nameEn: "Birth / Marriage Certificate of New Member",
          nameGu: "ઉમેરવાના સભ્યનું જન્મ પ્રમાણપત્ર અથવા લગ્ન નોંધણી",
          mandatory: true,
        });
      }
    }

    if (selectedCorrections.includes("photo_biometric") || selectedCorrections.includes("photo_sign")) {
      if (!docs.some((d) => d.id === "photo_proof")) {
        docs.push({
          id: "photo_proof",
          nameEn: "Fresh Passport Size Color Photograph (Plain Background)",
          nameGu: "તાજો પાસપોર્ટ સાઇઝ રંગીન ફોટો (કોઈપણ સાદું બેકગ્રાઉન્ડ - સફેદ/વાદળી/લાઇટ)",
          mandatory: true,
        });
      }
    }

    return docs;
  };

  const requiredDocs = getDynamicRequiredDocs();

  // Helper for Canvas-based client-side compression (BUG-023)
  const compressImageIfNeeded = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!file.type.startsWith("image/") || file.size <= 1024 * 1024) {
          resolve(dataUrl);
          return;
        }
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1600;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle Document Upload & Gemini AI Pre-Inspection
  const handleFileUpload = async (docId: string, file: File) => {
    // 1. Client-side File Size Validation (BUG-023: Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ દસ્તાવેજ ફાઇલ સાઇઝ ૫ MB થી ઓછી હોવી જોઈએ. કૃપા કરીને નાની ફાઇલ પસંદ કરો.");
      return;
    }

    try {
      const base64Data = await compressImageIfNeeded(file);

      // Set analyzing state
      setUploadedDocs((prev) => ({
        ...prev,
        [docId]: {
          file,
          fileName: file.name,
          fileType: file.type || "image/jpeg",
          base64: base64Data,
          status: "analyzing",
        },
      }));

      const res = await fetch("/api/verify-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: file.type || "image/jpeg",
          expectedDocType: requiredDocs.find((d) => d.id === docId)?.nameEn || "",
          fileName: file.name,
        }),
      });

      if (res.status === 413) {
        throw new Error("દસ્તાવેજ ફાઇલ ખૂબ મોટી છે (Payload Too Large). કૃપા કરીને ફાઇલ કમ્પ્રેસ કરીને ફરીથી અપલોડ કરો.");
      }

      const data = await res.json();
      if (data.success && data.analysis) {
        const a = data.analysis;
        const isMismatch = a.matchesExpected === false || a.isValidForGovt === false;
        let calculatedStatus: "valid" | "warning" | "invalid" = "valid";
        if (isMismatch) {
          calculatedStatus = "invalid";
        } else if (a.needsUpdate || a.needsNewDocument) {
          calculatedStatus = "warning";
        } else {
          calculatedStatus = "valid";
        }

        setUploadedDocs((prev) => ({
          ...prev,
          [docId]: {
            file,
            fileName: file.name,
            fileType: file.type || "image/jpeg",
            base64: base64Data,
            status: calculatedStatus,
            qualityScore: a.qualityScore || (isMismatch ? 15 : 92),
            adviceGu: a.actionableAdviceGu || a.feedbackGu || "દસ્તાવેજ સફળતાપૂર્વક ચકાસાયો.",
            needsUpdate: a.needsUpdate,
            needsNewDocument: a.needsNewDocument,
          },
        }));
      } else {
        throw new Error("Verification failed");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "દસ્તાવેજ ચકાસણી સર્વર સાથે સંપર્ક થઈ શક્યો નહીં.";
      // Strict fallback on failure: do NOT mark as valid
      setUploadedDocs((prev) => ({
        ...prev,
        [docId]: {
          file,
          fileName: file.name,
          fileType: file.type || "image/jpeg",
          base64: "",
          status: "invalid",
          qualityScore: 15,
          adviceGu: `❌ ${errorMsg} કૃપા કરીને સાચો સત્તાવાર દસ્તાવેજ ફરીથી અપલોડ કરો.`,
          needsUpdate: false,
          needsNewDocument: false,
        },
      }));
    }
  };

  // Auto-Fetch Existing Document Profile from DigiLocker / Govt Registry
  const handleFetchExistingRecord = () => {
    setIsFetchingProfile(true);
    setTimeout(() => {
      const profile = lookupCitizenExistingRecord(service.id, lookupNumber || "1413");
      setFetchedProfile(profile);
      setApplicantName(profile.applicantName);
      setApplicantNameGu(profile.applicantNameGu);
      setFatherOrHusbandName(profile.fatherOrHusbandName);
      setDob(profile.dob);
      setGender(profile.gender);
      setMobileNumber(profile.mobile);
      setEmailAddress(profile.email);
      setDistrict(profile.district);
      setTaluka(profile.taluka);
      setVillage(profile.village);
      setPincode(profile.pincode);
      setStreetSociety("ઓમ નગર, ૧૫૦ ફૂટ રિંગ રોડ");
      setHouseNo("૧૦૨");

      if (service.id === "ration") {
        setRationCategory("NFSA - APL-1");
        setFpsShopNo("FPS-108 (રાજકોટ પંચાયત સેવા કેન્દ્ર)");
      } else if (service.id === "aadhaar") {
        setAadhaarNumber(lookupNumber ? lookupNumber.slice(-4) : "1413");
      } else if (service.id === "land_records") {
        setKhataNumber("412");
        setSurveyNumber("241/1 પૈકી");
        setLandArea("1.42 હેક્ટર");
      } else if (service.id === "birth_cert") {
        setChildName("હરી");
        setBirthPlace("સિવિલ હોસ્પિટલ, રાજકોટ");
      } else if (service.id === "death_cert") {
        setDeceasedName("નારણભાઈ પટેલ");
        setDeathDate("2023-11-04");
        setDeathPlace("રાજકોટ (ઘરે)");
      } else if (service.id === "senior_citizen") {
        setSeniorBloodGroup("B+");
        setSeniorEmergencyPhone("9974442291");
      } else if (service.id === "driving_licence") {
        setDrivingClass("MCWG (મોટરસાયકલ) & LMV (કાર)");
        setRtoOfficeName("GJ-03 RTO કચેરી, રાજકોટ");
      }

      setIsFetchingProfile(false);
    }, 700);
  };

  // Toggle Multi-Select Correction Checkbox
  const toggleCorrection = (id: string) => {
    setSelectedCorrections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1-Click Fast Demo Data Button (Judge Presentation)
  const handleAutoFillDemo = () => {
    setLookupNumber("982548291045");
    handleFetchExistingRecord();
    setSelectedCorrections(["address", "mobile"]);

    // Auto mark all docs as AI Verified
    const demoDocs: Record<string, UploadedDocState> = {};
    requiredDocs.forEach((d) => {
      demoDocs[d.id] = {
        file: null,
        fileName: `${d.nameEn.split(" ")[0].toLowerCase()}_verified.pdf`,
        fileType: "application/pdf",
        base64: "",
        status: "valid",
        qualityScore: 96,
        adviceGu: `${d.nameGu} - AI દ્વારા ૧૦૦% પ્રમાણિત. સરકારી પોર્ટલ માટે યોગ્ય.`,
        needsUpdate: false,
        needsNewDocument: false,
      };
    });
    setUploadedDocs(demoDocs);
  };

  // Step 1: Pre-Submission Validation & Open Government Cyber Treasury Payment Gateway
  const handleOpenPaymentGateway = (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName.trim()) {
      alert("કૃપા કરીને અરજદારનું નામ ભરો.");
      return;
    }

    // HARD RESTRICTION: Block submission if any uploaded document is marked invalid by AI
    const invalidDocs = requiredDocs.filter((d) => {
      const state = uploadedDocs[d.id];
      return state && state.status === "invalid";
    });

    if (invalidDocs.length > 0) {
      alert(
        `❌ અરજી સબમિટ થઈ શકશે નહીં:\n\nતમે અપલોડ કરેલ દસ્તાવેજ '${invalidDocs[0].nameGu}' અસ્વીકાર્ય (ખોટો દસ્તાવેજ) છે.\n\nસરકારી નિયમ મુજબ ખોટા દસ્તાવેજ (જેમ કે માર્કશીટ, અયોગ્ય બિલ) ચાલશે નહીં. કૃપા કરીને સાચો સત્તાવાર પુરાવો અપલોડ કરો.`
      );
      return;
    }

    // Check mandatory documents
    const missingDocs = requiredDocs.filter((d) => d.mandatory && !uploadedDocs[d.id]);
    if (missingDocs.length > 0) {
      alert(
        `⚠️ કૃપા કરીને તમામ ફરજિયાત (*) દસ્તાવેજો અપલોડ કરો:\n- ${missingDocs.map((d) => d.nameGu).join("\n- ")}`
      );
      return;
    }

    // If update mode, ensure at least one correction is selected
    if (serviceMode === "update" && selectedCorrections.length === 0) {
      alert("⚠️ કૃપા કરીને ઓછામાં ઓછો ૧ સુધારો (Checkbox) પસંદ કરો.");
      return;
    }

    // Generate simulated Txn & Challan numbers
    const newTxn = `TXN-GUJ-${Math.floor(100000 + Math.random() * 899999)}`;
    const newChallan = `GRN-2026-${Math.floor(10000 + Math.random() * 89999)}`;
    setActiveTxnId(newTxn);
    setActiveChallanNo(newChallan);

    // Open Payment Modal
    setShowPaymentModal(true);
  };

  // Step 2: Final Payment Confirmation & Application Registration
  const handleFinalPaymentSubmit = async () => {
    setIsProcessingPayment(true);
    setSubmitting(true);

    try {
      const payload = {
        citizenName: applicantName,
        citizenNameGu: applicantNameGu || applicantName,
        gender,
        district: currentDistObj.en,
        districtGu: currentDistObj.gu,
        taluka,
        village: village || `${taluka} ગ્રામ્ય`,
        schemeId: `${service.id}-${serviceMode}`,
        schemeName: `${service.nameEn} (${serviceMode === "new" ? "New Issuance" : "Correction/Update"})`,
        schemeNameGu: `${service.nameGu} (${serviceMode === "new" ? "નવી અરજી" : "સુધારો / ફેરફાર"})`,
        schemeEmoji: service.emoji,
        benefitAmount: 0,
        serviceType: serviceMode,
        biometricRequired: isBiometricNeeded,
        signatureType,
        mobile: mobileNumber || "9825012345",
        email: emailAddress || "citizen@gujarat.gov.in",
        aadhaarLast4:
          service.id === "aadhaar" && serviceMode === "new"
            ? "NEW"
            : aadhaarNumber
            ? aadhaarNumber.slice(-4)
            : "4829",
        paymentStatus: paymentMethod === "challan" ? "pending_challan" : "paid",
        paymentMethod,
        paymentMethodNameGu:
          paymentMethod === "upi"
            ? "UPI / Bharat QR (NPCI Direct)"
            : paymentMethod === "card"
            ? "નેટ બેંકિંગ / કાર્ડ (State Bank of India)"
            : "કચેરીએ ઓફલાઇન રોકડ ચલણ (Jan Seva Kendra Cash Counter)",
        feeAmount: service.fee,
        txnId: activeTxnId,
        challanNo: activeChallanNo,
        correctionsRequested: selectedCorrections,
        oldVsNewValues,
        kacheriDetails: {
          fatherOrHusbandName,
          motherName,
          dob,
          maritalStatus,
          houseNo,
          streetSociety,
          pincode,
          rationCategory: service.id === "ration" ? rationCategory : undefined,
          fpsShopNo: service.id === "ration" ? fpsShopNo : undefined,
          gasConnectionStatus: service.id === "ration" ? gasConnectionStatus : undefined,
          bankAccountNo: service.id === "ration" ? bankAccountNo : undefined,
          bankIfsc: service.id === "ration" ? bankIfsc : undefined,
          annualIncomeVal: service.id === "income" ? annualIncomeVal : undefined,
          occupation: service.id === "income" ? occupation : undefined,
          subCaste: service.id === "caste" ? subCaste : undefined,
          religion: service.id === "caste" ? religion : undefined,
        },
        documentsVerified: requiredDocs.map((d) => ({
          name: d.nameGu,
          verified: uploadedDocs[d.id]?.status === "valid",
          qualityScore: uploadedDocs[d.id]?.qualityScore || 90,
        })),
      };

      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.application) {
        setShowPaymentModal(false);
        setSubmittedApp(data.application);
        setNotificationPayload(data.notifications || null);
      } else {
        alert(data.error || "અરજી સબમિટ કરવામાં મુશ્કેલી આવી.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("સર્વર કનેક્શનમાં ક્ષતિ. પુનઃ પ્રયાસ કરો.");
    } finally {
      setIsProcessingPayment(false);
      setSubmitting(false);
    }
  };

  // Available corrections list for the selected service
  const getCorrectionOptions = () => {
    switch (service.id) {
      case "aadhaar":
        return [
          { id: "address", labelGu: "સરનામું / રહેઠાણ (Address)", desc: "નવા મકાન કે વિસ્તારનું સરનામું બદલવું" },
          { id: "mobile", labelGu: "મોબાઈલ નંબર & ઈમેલ (Mobile/Email)", desc: "OTP મેળવવા નવો નંબર લિંક કરવો" },
          { id: "name", labelGu: "નામ / અટક સુધારો (Name/Surname)", desc: "સ્પેલિંગ અથવા લગ્ન બાદ અટક સુધારો" },
          { id: "dob", labelGu: "જન્મ તારીખ / ઉંમર (Date of Birth)", desc: "જન્મ તારીખમાં ભૂલ સુધારવી" },
          { id: "photo_biometric", labelGu: "ફોટો / બાયોમેટ્રિક્સ તાજી કરાવવી", desc: "ફિંગરપ્રિન્ટ/આઇરિસ અપડેટ" },
        ];
      case "ration":
        return [
          { id: "add_member", labelGu: "નવા સભ્યનું નામ ઉમેરવું (Add Member)", desc: "લગ્ન બાદ પત્ની કે બાળકની નોંધણી" },
          { id: "remove_member", labelGu: "સભ્ય કમી કરવું (Delete Member)", desc: "લગ્ન/અવસાન બાદ નામ કમી કરવું" },
          { id: "change_fps", labelGu: "વાજબી ભાવની દુકાન બદલવી (Change FPS)", desc: "સ્થળાંતર થતાં સસ્તા અનાજની દુકાન બદલવી" },
          { id: "address", labelGu: "સરનામું બદલવું (Address Transfer)", desc: "નવા સરનામે રાશન ટ્રાન્સફર કરવું" },
        ];
      case "pan":
        return [
          { id: "name", labelGu: "નામમાં જોડણી સુધારો (Name Correction)", desc: "આધાર કાર્ડ મુજબ નામ એકસમાન કરવું" },
          { id: "parent_name", labelGu: "પિતા / માતાનું નામ (Parent's Name)", desc: "કાર્ડ પર પિતાનું નામ સુધારવું" },
          { id: "dob", labelGu: "જન્મ તારીખ સુધારો (DOB Correction)", desc: "જન્મ તારીખ આધાર સાથે મેળવવી" },
          { id: "photo_sign", labelGu: "ફોટો અને સહી અપડેટ (Photo & Sign)", desc: "નવી સહી અને તાજો ફોટો પ્રિન્ટ કરવો" },
        ];
      case "income":
        return [
          { id: "renew_3yr", labelGu: "૩ વર્ષની મુદત પૂર્ણ થતાં નવું પ્રમાણપત્ર (Renewal)", desc: "જૂના દાખલાની મુદત વધારવી" },
          { id: "income_change", labelGu: "વાર્ષિક આવકમાં વધારો/ઘટાડો (Income Change)", desc: "આવકમાં થયેલ ફેરફાર નોંધવો" },
        ];
      case "caste":
        return [
          { id: "renew_ncl", labelGu: "નોન-ક્રીમીલેયર રિન્યુઅલ (NCL Renewal)", desc: "૩ નાણાકીય વર્ષ પૂર્ણ થતાં નવું પ્રમાણપત્ર" },
          { id: "name_mismatch", labelGu: "LC મુજબ નામ સુધારો (Name Correction)", desc: "શાળા છોડ્યાના પ્રમાણપત્ર મુજબ સુધારો" },
        ];
      case "land_records":
        return [
          { id: "varasai", labelGu: "વારસાઈ આંબલીયો નોંધણી (Heirship Entry)", desc: "મૂળ ખાતેદાર અવસાન પામતાં વારસદારોના નામ દાખલ કરવા" },
          { id: "boja_nondh", labelGu: "બેંક બોજો / ધિરાણ નોંધણી (Bank Loan Entry)", desc: "ખેતી ધિરાણ મેળવવા બેંક બોજો નોંધવો" },
          { id: "hakk_kami", labelGu: "હક્ક કમી / વહેંચણી (Right Surrender / Partition)", desc: "જમીનમાંથી હક્ક કમી કરવો કે સર્વે વિભાજન" },
        ];
      case "birth_cert":
        return [
          { id: "add_child_name", labelGu: "બાળકનું નામ ઉમેરવું (Add Child Name)", desc: "જન્મ સમયે નામ ન લખાયું હોય તો નવું નામ દાખલ કરવું" },
          { id: "name_spelling", labelGu: "નામ / અટકમાં સ્પેલિંગ સુધારો (Spelling Correction)", desc: "શાળા એલસી અથવા આધાર મુજબ સ્પેલિંગ સુધારો" },
          { id: "dob_correction", labelGu: "જન્મ સ્થળ / તારીખ સુધારો", desc: "હોસ્પિટલ રેકોર્ડ મુજબ સુધારો કરવો" },
        ];
      case "death_cert":
        return [
          { id: "death_name_corr", labelGu: "મૃતકના નામમાં સ્પેલિંગ સુધારો", desc: "મૃતકના આધાર કાર્ડ મુજબ સુધારો કરવો" },
          { id: "death_date_corr", labelGu: "મરણ તારીખ / સ્થળ સુધારો", desc: "હોસ્પિટલ/સ્મશાન દાખલા મુજબ સુધારો" },
        ];
      case "ews_cert":
        return [
          { id: "ews_renewal", labelGu: "વાર્ષિક નવીકરણ (Annual Renewal)", desc: "આગામી નાણાકીય વર્ષ માટે EWS પ્રમાણપત્ર તાજું કરવું" },
          { id: "ews_income_update", labelGu: "આવક / મિલકત વિગત સુધારો", desc: "નવા આવક દાખલા મુજબ સુધારો" },
        ];
      case "domicile_cert":
        return [
          { id: "domicile_address", labelGu: "સરનામું બદલવું (Address Update)", desc: "ગુજરાતમાં નવું રહેઠાણ સરનામું નોંધવું" },
          { id: "domicile_name", labelGu: "નામ સુધારો (Name Correction)", desc: "સરકારી પુરાવા મુજબ નામ સુધારવું" },
        ];
      case "senior_citizen":
        return [
          { id: "senior_blood", labelGu: "બ્લડ ગ્રુપ સુધારો (Blood Group Update)", desc: "તબીબી રિપોર્ટ મુજબ બ્લડ ગ્રુપ ઉમેરવું" },
          { id: "senior_emergency", labelGu: "ઇમરજન્સી સંપર્ક નંબર બદલવો", desc: "પુત્ર/પુત્રીનો નવો મોબાઈલ નંબર નોંધવો" },
          { id: "senior_address", labelGu: "સરનામું બદલવું (Address Change)", desc: "નવા સરનામે કાર્ડ અપડેટ કરવું" },
        ];
      case "driving_licence":
        return [
          { id: "dl_renewal", labelGu: "ડ્રાઇવિંગ લાયસન્સ રિન્યુઅલ (DL Renewal)", desc: "મુદત પૂર્ણ થતાં લાયસન્સ રિન્યુ કરવું" },
          { id: "dl_address", labelGu: "લાયસન્સમાં સરનામું બદલવું (Address Change)", desc: "નવા જિલ્લા કે શહેરનું સરનામું બદલવું" },
          { id: "dl_add_class", labelGu: "વાહન ક્લાસ ઉમેરવો (Add Vehicle Class)", desc: "MCWG બાઇક અથવા LMV કાર વર્ગ ઉમેરવો" },
        ];
      case "marriage_cert":
        return [
          { id: "marriage_spelling", labelGu: "પતિ / પત્નીના નામમાં સ્પેલિંગ સુધારો", desc: "આધાર કાર્ડ મુજબ નામ સુધારવું" },
          { id: "marriage_address", labelGu: "કાયમી રહેઠાણ સરનામું સુધારો", desc: "લગ્ન નોંધણીમાં સરનામું સુધારવું" },
        ];
      default:
        return [{ id: "general", labelGu: "સામાન્ય સુધારો (Correction)", desc: "દસ્તાવેજમાં ફેરફાર" }];
    }
  };

  // If the citizen is NOT authenticated yet, show the unified 2FA Citizen Login Shield!
  if (!citizenSession) {
    return (
      <div className="max-w-xl mx-auto my-6 animate-in fade-in duration-300">
        <CitizenLoginShield
          serviceTitle="નાગરિક દસ્તાવેજ સેવા & સુધારો પોર્ટલ"
          onSuccess={(cit) => {
            setCitizenSession(cit);
            setApplicantName(cit.citizenName || "Rameshbhai Kantilal Patel");
            setApplicantNameGu(cit.citizenNameGu || "રમેશભાઈ કાંતિલાલ પટેલ");
            setMobileNumber(cit.mobile || "9825012345");
            setAadhaarNumber(`XXXX-XXXX-${cit.aadhaarLast4 || "4829"}`);
            if (cit.district) setDistrict(cit.district);
            if (cit.taluka) setTaluka(cit.taluka);
            if (cit.village) setVillage(cit.village);
            if (cit.annualIncome) setAnnualIncomeVal(String(cit.annualIncome));
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Official Cyber Treasury Payment Gateway Modal ── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 space-y-5 shadow-2xl border-2 border-orange-500 relative">
            {/* Top National Ribbon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full mb-1" />

            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏛️</span>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                      ગુજરાત સાયબર ટ્રેઝરી પોર્ટલ (Cyber Treasury e-Grass)
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      નાણાં વિભાગ, ગુજરાત સરકાર • સત્તાવાર ફી ચુકવણી ગેટવે
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Fee Breakdown Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>સેવાનું નામ:</span>
                <span className="font-bold text-slate-800">{service.nameGu} ({serviceMode === "new" ? "નવી અરજી" : "સુધારો"})</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>સરકારી નિયત ફી (Govt Mandated Fee):</span>
                <span className="font-mono font-bold text-slate-800">₹ {service.fee}.00</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>ડિજિટલ પોર્ટલ સુવિધા શુલ્ક (Convenience Fee):</span>
                <span className="font-mono font-bold text-emerald-700">₹ 0.00 (સરકારી શૂન્ય કમિશન)</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-xs sm:text-sm text-slate-900">કુલ ચૂકવવાપાત્ર રકમ:</span>
                <span className="text-base sm:text-lg font-black text-orange-600 font-mono">₹ {service.fee}.00</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">ચુકવણી પદ્ધતિ પસંદ કરો (Payment Mode):</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-2 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-1 min-h-[58px] ${
                    paymentMethod === "upi"
                      ? "bg-orange-50 border-orange-500 text-orange-900 ring-2 ring-orange-500/20 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <QrCode size={18} className="text-orange-600 shrink-0" />
                  <span className="leading-tight text-center">UPI / Bharat QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-2 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-1 min-h-[58px] ${
                    paymentMethod === "card"
                      ? "bg-orange-50 border-orange-500 text-orange-900 ring-2 ring-orange-500/20 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <CreditCard size={18} className="text-blue-600 shrink-0" />
                  <span className="leading-tight text-center">કાર્ડ / નેટ બેંકિંગ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("challan")}
                  className={`p-2 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-1 min-h-[58px] ${
                    paymentMethod === "challan"
                      ? "bg-orange-50 border-orange-500 text-orange-900 ring-2 ring-orange-500/20 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Landmark size={18} className="text-emerald-600 shrink-0" />
                  <span className="leading-tight text-center">કચેરીએ રોકડ ચલણ</span>
                </button>
              </div>

              {/* UPI QR Display - REAL SCANNABLE BHARAT QR */}
              {paymentMethod === "upi" && (
                <div className="border-2 border-orange-300 bg-orange-50/60 rounded-2xl p-3.5 sm:p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 text-center sm:text-left">
                    {/* Real Scannable Bharat QR Code Image */}
                    <div className="bg-white p-2.5 rounded-2xl border-2 border-orange-400 shadow-sm shrink-0 flex flex-col items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          `upi://pay?pa=cybertreasury.gujarat@sbi&pn=Cyber%20Treasury%20Gujarat&am=${service.fee}&cu=INR&tn=NagrikSeva%20Fee%20${activeChallanNo}`
                        )}&margin=4`}
                        alt="Cyber Treasury Gujarat Bharat QR"
                        className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-lg"
                      />
                      <span className="text-[8.5px] font-black text-orange-800 tracking-wider mt-1 uppercase">
                        🏛️ BHARAT QR • NPCI
                      </span>
                    </div>

                    <div className="space-y-2 flex-1 text-xs">
                      <div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                          ● લાઈવ સ્કેનેબલ સત્તાવાર QR
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          કોઈપણ UPI એપથી સ્કેન કરી ફી ચૂકવો
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          GPay, PhonePe, Paytm, BHIM અથવા સરકારી બેંકિંગ એપના કેમેરાથી સીધું સ્કેન કરો.
                        </p>
                      </div>

                      <div className="bg-white border border-orange-200 rounded-xl p-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">સત્તાવાર UPI VPA:</span>
                          <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                            <span>cybertreasury.gujarat@sbi</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("cybertreasury.gujarat@sbi");
                                setCopiedVpa(true);
                                setTimeout(() => setCopiedVpa(false), 2000);
                              }}
                              className="text-[9.5px] text-orange-600 hover:text-orange-700 font-bold px-1.5 py-0.5 rounded bg-orange-50 border border-orange-200"
                            >
                              {copiedVpa ? "✓ કૉપી થયું" : "કૉપી"}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">ચૂકવવાપાત્ર ફી:</span>
                          <span className="font-mono font-black text-orange-600">₹ {service.fee}.00</span>
                        </div>
                      </div>

                      {/* Mobile One-Tap Direct UPI App Opener */}
                      <a
                        href={`upi://pay?pa=cybertreasury.gujarat@sbi&pn=Cyber%20Treasury%20Gujarat&am=${service.fee}&cu=INR&tn=NagrikSeva%20Fee%20${activeChallanNo}`}
                        className="flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition sm:hidden"
                      >
                        <Smartphone size={14} />
                        <span>મોબાઈલ UPI એપમાં સીધું ખોલો (GPay / PhonePe)</span>
                      </a>
                    </div>
                  </div>

                  {/* Instant Approval Simulation / Paid Trigger Button */}
                  <button
                    type="button"
                    onClick={handleFinalPaymentSubmit}
                    disabled={isProcessingPayment}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Check size={16} />
                    <span>✓ ચુકવણી સ્કેન થઈ ગઈ? ક્લિક કરીને તરત સત્તાવાર ઈ-રસીદ જનરેટ કરો</span>
                  </button>
                </div>
              )}

              {/* Card / Netbanking Details */}
              {paymentMethod === "card" && (
                <div className="border border-slate-200 bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs">
                  <p className="font-bold text-slate-800">બેંક પસંદ કરો (State Bank of India / HDFC / BOB / ICICI):</p>
                  <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500">
                    <option>State Bank of India (Cyber Treasury Gateway)</option>
                    <option>Bank of Baroda (e-Grass Direct)</option>
                    <option>HDFC Bank NetBanking</option>
                    <option>ICICI Bank Corporate/Retail</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    🔒 RBI માન્ય ૨૫૬-બીટ SSL દ્વારા સંપૂર્ણ સુરક્ષિત પેમેન્ટ ટ્રાન્ઝેક્શન.
                  </p>
                </div>
              )}

              {/* Cash Challan Option */}
              {paymentMethod === "challan" && (
                <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-3.5 space-y-1.5 text-xs text-emerald-950">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 size={16} className="text-emerald-700" />
                    <span>ઓફલાઇન રોકડ ચલણ સુવિધા (Cash at Jan Seva Kendra)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    તમને બારકોડ વાળું ડિજિટલ ચલણ ({activeChallanNo}) મળી જશે. તમે કચેરીએ જઈને સીધા રોકડા ભરી શકશો.
                  </p>
                </div>
              )}
            </div>

            {/* Confirm & Submit Button - HARD RESPONSIVE NO CRAMPING */}
            <div className="border-t border-slate-200 pt-3 space-y-2.5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-slate-500 font-mono text-center sm:text-left">
                <div>
                  GRN: <strong className="text-slate-800">{activeChallanNo}</strong> • Ref: <strong className="text-slate-800">{activeTxnId}</strong>
                </div>
                <div className="text-emerald-700 font-bold font-sans text-[10px]">
                  🔒 RBI માન્ય ૨૫૬-બીટ સુરક્ષિત સાયબર ટ્રેઝરી
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isProcessingPayment}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap text-center shrink-0"
                >
                  રદ કરો
                </button>

                {/* Only render bottom submit button for Card and Cash Challan, as UPI has its dedicated single top button */}
                {paymentMethod !== "upi" && (
                  <button
                    type="button"
                    onClick={handleFinalPaymentSubmit}
                    disabled={isProcessingPayment}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>ચુકવણી ચકાસણી થઈ રહી છે...</span>
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        <span>
                          {paymentMethod === "challan"
                            ? "ચલણ જનરેટ કરો & સબમિટ"
                            : `ફી ₹ ${service.fee} ચૂકવો & સત્તાવાર પહોંચ મેળવો`}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Submission Success & Real-Time Alert Modal ── */}
      {submittedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className={`bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-5 shadow-2xl border-2 relative ${
            submittedApp.paymentStatus === "pending_challan" ? "border-amber-500" : "border-emerald-500"
          }`}>
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-inner ${
                submittedApp.paymentStatus === "pending_challan"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-600"
              }`}>
                {submittedApp.paymentStatus === "pending_challan" ? <Landmark size={30} /> : <CheckCircle2 size={32} />}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${
                submittedApp.paymentStatus === "pending_challan"
                  ? "text-amber-800 bg-amber-50 border-amber-300"
                  : "text-emerald-700 bg-emerald-50 border-emerald-200"
              }`}>
                {submittedApp.paymentStatus === "pending_challan"
                  ? "સત્તાવાર રોકડ ચલણ જનરેટ થયું • Cash Challan Issued"
                  : "સત્તાવાર અરજી નોંધણી સફળ • Govt Registered"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {submittedApp.paymentStatus === "pending_challan"
                  ? "ઓફલાઇન રોકડ ચલણ પાવતી સફળતાપૂર્વક જનરેટ થઈ!"
                  : "અરજી સફળતાપૂર્વક સ્વીકારાઈ ગઈ છે!"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                અરજી ક્રમાંક (Tracking ID):{" "}
                <span className="font-mono font-black text-orange-600 text-base">{submittedApp.id}</span>
              </p>
            </div>

            {/* Treasury Payment Badge */}
            {submittedApp.paymentStatus === "pending_challan" ? (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-950 block">કચેરીએ ઓફલાઇન રોકડ ચલણ (Jan Seva Kendra Cash Counter)</span>
                    <span className="text-[11px] text-amber-800 font-mono">
                      GRN / ચલણ નં: <strong>{submittedApp.challanNo || activeChallanNo}</strong>
                    </span>
                  </div>
                </div>
                <span className="bg-amber-600 text-white font-mono font-bold px-2.5 py-1 rounded-lg text-xs whitespace-nowrap">
                  ₹ {submittedApp.feeAmount || service.fee} ભરપાઈ બાકી
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900 block">
                      સરકારી ફી ભરપાઈ (Paid via {submittedApp.paymentMethod === "upi" ? "UPI Bharat QR" : "NetBanking/Card"})
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono">
                      Txn: {submittedApp.txnId || activeTxnId} • GRN: {submittedApp.challanNo || activeChallanNo}
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-600 text-white font-mono font-bold px-2.5 py-1 rounded-lg text-xs whitespace-nowrap">
                  ₹ {submittedApp.feeAmount || service.fee} PAID
                </span>
              </div>
            )}

            {/* Strict Document Lock Protocol for Cash Challan */}
            {submittedApp.paymentStatus === "pending_challan" && (
              <div className="bg-amber-50/90 border-2 border-amber-400 rounded-2xl p-3.5 sm:p-4 space-y-2 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
                  <span>🔒</span>
                  <span>પ્રમાણપત્ર લૉક પ્રોટોકોલ (Document Release Locked):</span>
                </div>
                <p className="leading-relaxed text-amber-900 font-medium">
                  સરકારી નિયમ અનુસાર ઓનલાઇન ફી ભરપાઈ ન હોવાથી તમારું નવું/સુધારેલ પ્રમાણપત્ર હાલ <strong>સંપૂર્ણ લૉક</strong> છે.
                </p>
                <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 space-y-1 text-[11px] text-slate-800">
                  <p className="font-bold text-slate-900">📌 કચેરી ખાતે અનુસરવાની પ્રક્રિયા:</p>
                  <p>૧. નીચે આપેલ બટનથી <strong>&apos;ઓફલાઇન રોકડ ચલણ&apos;</strong> ડાઉનલોડ અથવા પ્રિન્ટ કરો.</p>
                  <p>૨. તાલુકા જન સેવા કેન્દ્રના રોકડ કાઉન્ટર પર ચલણ નં. <strong className="font-mono text-orange-700">{submittedApp.challanNo || activeChallanNo}</strong> સાથે નિયત ફી <strong className="font-mono text-emerald-800">₹{submittedApp.feeAmount || service.fee}</strong> રોકડા ભરો.</p>
                  <p>૩. કચેરી ઓપરેટર સિસ્ટમમાં &apos;Payment Confirmed&apos; કરશે ત્યાર બાદ જ તમારું પ્રમાણપત્ર રિલીઝ (અનલૉક) થશે.</p>
                </div>
              </div>
            )}

            {/* Biometric Appointment Slot if applicable */}
            {submittedApp.biometricRequired && submittedApp.appointmentToken && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                  <Fingerprint size={18} className="text-blue-600" />
                  <span>બાયોમેટ્રિક ફાસ્ટ-ટ્રેક એપોઇન્ટમેન્ટ સ્લોટ ફાળવાયો</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px] block">ટોકન નંબર</span>
                    <span className="font-mono font-extrabold text-blue-700 text-sm">{submittedApp.appointmentToken}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px] block">તારીખ & સમય</span>
                    <span className="font-bold text-slate-800">{submittedApp.appointmentDate} (૧૧:૩૦ AM)</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 text-[10px] block">કેન્દ્ર</span>
                    <span className="font-semibold text-slate-800 text-[11px] truncate block">જન સેવા કેન્દ્ર, {taluka}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Citizen Notifications (SMS & Email Preview) */}
            {notificationPayload && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                  <Smartphone size={15} className="text-orange-600" />
                  <span>ઓટોમેટેડ નાગરિક સૂચનાઓ (Live SMS & Email Alert Simulated):</span>
                </h4>

                {/* SMS Simulation */}
                {notificationPayload.sms && (
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-3.5 space-y-1.5 shadow-md">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                      <span className="font-mono text-orange-400 font-bold">📱 GOVT-GUJ SMS ALERT</span>
                      <span>To: {notificationPayload.sms.sentTo}</span>
                    </div>
                    <p className="text-xs font-mono leading-relaxed text-slate-200">
                      {notificationPayload.sms.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons - Hard Responsive with Direct PDF Download */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSlipModal(true)}
                className={`flex-1 py-3 px-4 active:scale-95 text-white rounded-xl text-center font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap ${
                  submittedApp.paymentStatus === "pending_challan"
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                }`}
              >
                <Printer size={16} />
                <span>
                  {submittedApp.paymentStatus === "pending_challan"
                    ? "🖨️ ઓફલાઇન રોકડ ચલણ (PDF / પ્રિન્ટ કરો)"
                    : "🖨️ સત્તાવાર સરકારી પહોંચ / PDF ડાઉનલોડ"}
                </span>
              </button>

              <Link
                href={`/track?id=${encodeURIComponent(submittedApp.id)}`}
                className="py-3 px-4 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-center font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Eye size={15} />
                <span>લાઈવ સ્ટેટસ</span>
              </Link>

              <button
                onClick={() => setSubmittedApp(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl font-bold text-xs transition whitespace-nowrap"
              >
                નવી અરજી
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Official A4 Government Receipt Slip Modal (PDF Download / Print) ── */}
      {showSlipModal && submittedApp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <GovernmentReceiptSlip
            app={submittedApp}
            isModalPreview={true}
            onClose={() => setShowSlipModal(false)}
          />
        </div>
      )}

      {/* ── Top Bar: Fast 1-Click Demo Button for Judges ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-4 rounded-2xl border border-orange-200 shadow-xs">
        <div>
          <h2 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <span className="p-1 bg-orange-600 text-white rounded-lg text-xs">🏛️</span>
            <span>ડિજિટલ દસ્તાવેજ સેવા & સુધારો પોર્ટલ (Service Portal)</span>
          </h2>
          <p className="text-xs text-slate-600">
            હયાત દસ્તાવેજમાંથી ઓટો-ફેચ, મલ્ટીપલ સુધારા, કચેરી ફોર્મ, અને સુરક્ષિત સાયબર ટ્રેઝરી ફી ચુકવણી.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
        >
          <Sparkles size={14} />
          <span>+ ૧-ક્લિક ડેમો ડેટા ભરો (Fast Demo)</span>
        </button>
      </div>

      {/* ── Re-Apply Context Banner ── */}
      {reapplyContext && (
        <div className="bg-rose-50 border-2 border-rose-300 text-rose-950 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-md animate-in fade-in">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <RotateCw size={12} className="animate-spin-slow" />
                <span>🔄 પુનઃ અરજી મોડ (Re-Apply Mode)</span>
              </span>
              <span className="font-mono font-bold text-xs text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">
                અગાઉનો અરજી ક્રમાંક: {reapplyContext.appId}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-black text-rose-950 mt-1 leading-snug">
              કચેરી સ્ક્રુટિની આદેશ: <span className="font-semibold text-rose-900">{reapplyContext.remarksGu}</span>
            </p>
            <p className="text-[11px] text-rose-700">
              💡 <strong>સુવિધા:</strong> તમારી અગાઉની તમામ વિગતો ફોર્મમાં આપોઆપ ભરાઈ ગઈ છે. તમારે માત્ર સુધારેલો / સાચો દસ્તાવેજ અપલોડ કરવાનો રહેશે.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("nagrik_reapply_context");
              }
              setReapplyContext(null);
            }}
            className="px-3.5 py-2 bg-rose-200 hover:bg-rose-300 text-rose-950 font-bold rounded-xl text-xs transition shrink-0 cursor-pointer"
          >
            ✕ સામાન્ય મોડ
          </button>
        </div>
      )}

      {/* ── Compact Citizen Session Notification ── */}
      {citizenSession && !hideCitizenHeader && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm text-emerald-950 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">✓</span>
            <div>
              <p className="font-extrabold text-emerald-950 text-xs sm:text-sm">
                2FA પ્રમાણિત અરજદાર: {citizenSession.citizenNameGu || citizenSession.citizenName}
              </p>
              <p className="text-[11px] text-emerald-700">
                📱 +91 {citizenSession.mobile} &bull; 🪪 આધાર: XXXX-XXXX-{citizenSession.aadhaarLast4 || "4829"} (વિગતો આપોઆપ ભરાઈ ગઈ છે)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Submission Success & Real-Time Alert Modal ── */}
      {submittedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className={`bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-5 shadow-2xl border-2 relative ${
            submittedApp.paymentStatus === "pending_challan" ? "border-amber-500" : "border-emerald-500"
          }`}>
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-inner ${
                submittedApp.paymentStatus === "pending_challan"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-600"
              }`}>
                {submittedApp.paymentStatus === "pending_challan" ? <Landmark size={30} /> : <CheckCircle2 size={32} />}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${
                submittedApp.paymentStatus === "pending_challan"
                  ? "text-amber-800 bg-amber-50 border-amber-300"
                  : "text-emerald-700 bg-emerald-50 border-emerald-200"
              }`}>
                {submittedApp.paymentStatus === "pending_challan"
                  ? "સત્તાવાર રોકડ ચલણ જનરેટ થયું • Cash Challan Issued"
                  : "સત્તાવાર અરજી નોંધણી સફળ • Govt Registered"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {submittedApp.paymentStatus === "pending_challan"
                  ? "ઓફલાઇન રોકડ ચલણ પાવતી સફળતાપૂર્વક જનરેટ થઈ!"
                  : "અરજી સફળતાપૂર્વક સ્વીકારાઈ ગઈ છે!"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                અરજી ક્રમાંક (Tracking ID):{" "}
                <span className="font-mono font-black text-orange-600 text-base">{submittedApp.id}</span>
              </p>
            </div>

            {/* Treasury Payment Badge */}
            {submittedApp.paymentStatus === "pending_challan" ? (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-950 block">કચેરીએ ઓફલાઇન રોકડ ચલણ (Jan Seva Kendra Cash Counter)</span>
                    <span className="text-[11px] text-amber-800 font-mono">
                      GRN / ચલણ નં: <strong>{submittedApp.challanNo || activeChallanNo}</strong>
                    </span>
                  </div>
                </div>
                <span className="bg-amber-600 text-white font-mono font-bold px-2.5 py-1 rounded-lg text-xs whitespace-nowrap">
                  ₹ {submittedApp.feeAmount || service.fee} ભરપાઈ બાકી
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900 block">
                      સરકારી ફી ભરપાઈ (Paid via {submittedApp.paymentMethod === "upi" ? "UPI Bharat QR" : "NetBanking/Card"})
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono">
                      Txn: {submittedApp.txnId || activeTxnId} • GRN: {submittedApp.challanNo || activeChallanNo}
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-600 text-white font-mono font-bold px-2.5 py-1 rounded-lg text-xs whitespace-nowrap">
                  ₹ {submittedApp.feeAmount || service.fee} PAID
                </span>
              </div>
            )}

            {/* Strict Document Lock Protocol for Cash Challan */}
            {submittedApp.paymentStatus === "pending_challan" && (
              <div className="bg-amber-50/90 border-2 border-amber-400 rounded-2xl p-3.5 sm:p-4 space-y-2 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
                  <span>🔒</span>
                  <span>પ્રમાણપત્ર લૉક પ્રોટોકોલ (Document Release Locked):</span>
                </div>
                <p className="leading-relaxed text-amber-900 font-medium">
                  સરકારી નિયમ અનુસાર ઓનલાઇન ફી ભરપાઈ ન હોવાથી તમારું નવું/સુધારેલ પ્રમાણપત્ર હાલ <strong>સંપૂર્ણ લૉક</strong> છે.
                </p>
                <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 space-y-1 text-[11px] text-slate-800">
                  <p className="font-bold text-slate-900">📌 કચેરી ખાતે અનુસરવાની પ્રક્રિયા:</p>
                  <p>૧. નીચે આપેલ બટનથી <strong>&apos;ઓફલાઇન રોકડ ચલણ&apos;</strong> ડાઉનલોડ અથવા પ્રિન્ટ કરો.</p>
                  <p>૨. તાલુકા જન સેવા કેન્દ્રના રોકડ કાઉન્ટર પર ચલણ નં. <strong className="font-mono text-orange-700">{submittedApp.challanNo || activeChallanNo}</strong> સાથે નિયત ફી <strong className="font-mono text-emerald-800">₹{submittedApp.feeAmount || service.fee}</strong> રોકડા ભરો.</p>
                  <p>૩. કચેરી ઓપરેટર સિસ્ટમમાં &apos;Payment Confirmed&apos; કરશે ત્યાર બાદ જ તમારું પ્રમાણપત્ર રિલીઝ (અનલૉક) થશે.</p>
                </div>
              </div>
            )}

            {/* Biometric Appointment Slot if applicable */}
            {submittedApp.biometricRequired && submittedApp.appointmentToken && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                  <Fingerprint size={18} className="text-blue-600" />
                  <span>બાયોમેટ્રિક ફાસ્ટ-ટ્રેક એપોઇન્ટમેન્ટ સ્લોટ ફાળવાયો</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px] block">ટોકન નંબર</span>
                    <span className="font-mono font-extrabold text-blue-700 text-sm">{submittedApp.appointmentToken}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px] block">તારીખ & સમય</span>
                    <span className="font-bold text-slate-800">{submittedApp.appointmentDate} (૧૧:૩૦ AM)</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 text-[10px] block">કેન્દ્ર</span>
                    <span className="font-semibold text-slate-800 text-[11px] truncate block">જન સેવા કેન્દ્ર, {taluka}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Citizen Notifications (SMS & Email Preview) */}
            {notificationPayload && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                  <Smartphone size={15} className="text-orange-600" />
                  <span>ઓટોમેટેડ નાગરિક સૂચનાઓ (Live SMS & Email Alert Simulated):</span>
                </h4>

                {/* SMS Simulation */}
                {notificationPayload.sms && (
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-3.5 space-y-1.5 shadow-md">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                      <span className="font-mono text-orange-400 font-bold">📱 GOVT-GUJ SMS ALERT</span>
                      <span>To: {notificationPayload.sms.sentTo}</span>
                    </div>
                    <p className="text-xs font-mono leading-relaxed text-slate-200">
                      {notificationPayload.sms.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons - Hard Responsive with Direct PDF Download */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSlipModal(true)}
                className={`flex-1 py-3 px-4 active:scale-95 text-white rounded-xl text-center font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap ${
                  submittedApp.paymentStatus === "pending_challan"
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                }`}
              >
                <Printer size={16} />
                <span>
                  {submittedApp.paymentStatus === "pending_challan"
                    ? "🖨️ ઓફલાઇન રોકડ ચલણ (PDF / પ્રિન્ટ કરો)"
                    : "🖨️ સત્તાવાર સરકારી પહોંચ / PDF ડાઉનલોડ"}
                </span>
              </button>

              <Link
                href={`/track?id=${encodeURIComponent(submittedApp.id)}`}
                className="py-3 px-4 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-center font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Eye size={15} />
                <span>લાઈવ સ્ટેટસ</span>
              </Link>

              <button
                onClick={() => setSubmittedApp(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl font-bold text-xs transition whitespace-nowrap"
              >
                નવી અરજી
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Select Document Service ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
          ૧. સરકારી દસ્તાવેજ / સેવા પસંદ કરો (SELECT DOCUMENT SERVICE):
        </h3>

        {/* Search Bar & Category Tabs for 69 Government Services */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={serviceSearchQuery}
              onChange={(e) => setServiceSearchQuery(e.target.value)}
              placeholder="🔍 ૬૯ સરકારી સેવાઓમાંથી શોધો (દા.ત. ૭/૧૨, આવક દાખલો, રેશનકાર્ડ, પેન્શન, લાયસન્સ, જાતિ, ખેડૂત, શૌચાલય, વીજળી)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder:text-slate-400"
            />
            {serviceSearchQuery && (
              <button
                type="button"
                onClick={() => setServiceSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: "all", label: `તમામ સેવાઓ (${DOCUMENT_SERVICES.length})` },
              { id: "revenue", label: "🌾 મહેસૂલ & જમીન (૧૮)" },
              { id: "supplies", label: "🛒 અન્ન & પુરવઠો (૮)" },
              { id: "welfare", label: "⚖️ સામાજિક કલ્યાણ (૧૦)" },
              { id: "panchayat", label: "👶 પંચાયત & સિવિલ (૯)" },
              { id: "transport", label: "🚗 વાહનવ્યવહાર / RTO (૬)" },
              { id: "police", label: "👮 ગૃહ & પોલીસ (૫)" },
              { id: "labour", label: "👷 શ્રમ & શિક્ષણ (૮)" },
              { id: "energy", label: "⚡ ઉર્જા & વીજળી (૩)" },
              { id: "central", label: "🪪 કેન્દ્રીય ID (૨)" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setServiceCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                  serviceCategoryFilter === cat.id
                    ? "bg-orange-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 69 Services Responsive Grid with smooth scroll */}
        <div className="max-h-[460px] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {DOCUMENT_SERVICES.filter((s) => {
              // Category filter
              const matchesCategory = serviceCategoryFilter === "all" || s.category === serviceCategoryFilter;
              if (!matchesCategory) return false;

              // Search query filter
              if (serviceSearchQuery.trim()) {
                const q = serviceSearchQuery.toLowerCase().trim();
                const matchGu = s.nameGu.toLowerCase().includes(q);
                const matchEn = s.nameEn.toLowerCase().includes(q);
                const matchDept = (s.departmentGu || "").toLowerCase().includes(q) || (s.departmentEn || "").toLowerCase().includes(q);
                return matchGu || matchEn || matchDept;
              }
              return true;
            }).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedServiceId(s.id);
                  setFetchedProfile(null);
                  setUploadedDocs({});
                  if (s.id === "aadhaar" && serviceMode === "new") {
                    setAadhaarNumber("");
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                  selectedServiceId === s.id
                    ? "border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.emoji}</span>
                  <div className="flex items-center gap-1">
                    {selectedServiceId === s.id && (
                      <CheckCircle2 size={14} className="text-orange-600" />
                    )}
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {s.fee === 0 ? "નિઃશુલ્ક" : `₹${s.fee}`}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">{s.nameGu}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{s.nameEn}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dual Mode Switcher: New Issuance vs Correction/Update */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-slate-800 block">સેવા પ્રકાર (Service Type):</span>
            <span className="text-[11px] text-slate-500">
              {serviceMode === "new"
                ? "નવો દસ્તાવેજ મેળવવા માટેની અરજી"
                : "હયાત કાર્ડની વિગતો ઓટો-ફેચ કરીને ફેરફાર"}
            </span>
          </div>

          <div className="flex rounded-xl p-1 bg-slate-100 border border-slate-200 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setServiceMode("new");
                if (service.id === "aadhaar") {
                  setAadhaarNumber("");
                }
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                serviceMode === "new"
                  ? "bg-white text-orange-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🆕 નવું કઢાવવું (Fresh Application)</span>
            </button>
            <button
              type="button"
              onClick={() => setServiceMode("update")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                serviceMode === "update"
                  ? "bg-white text-orange-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🔄 હયાત દસ્તાવેજમાં સુધારો (Correction / Update)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Auto-Fetch & Multi-Select Corrections (When Update Mode is Active) ── */}
      {serviceMode === "update" && (
        <div className="space-y-4">
          {/* Smart Auto-Fetch Bar */}
          <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-blue-50/80 rounded-2xl border-2 border-blue-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-blue-700" />
                <div>
                  <h3 className="font-extrabold text-sm text-blue-950">
                    ૧. હયાત દસ્તાવેજ નંબર પરથી ઓટો-ફેચ (DigiLocker / Govt Database Lookup)
                  </h3>
                  <p className="text-[11px] text-blue-800">
                    હાલનો નંબર નાખો જેથી તમારી જૂની વિગતો સરકારી ડેટાબેઝમાંથી આપોઆપ ભરાઈ જશે.
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                API Auto-Sync
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={lookupNumber}
                onChange={(e) => setLookupNumber(e.target.value)}
                placeholder={
                  service.id === "aadhaar"
                    ? "દા.ત. ૧૨ આંકડાનો આધાર નંબર (અથવા છેલ્લા ૪ આંકડા 4829)"
                    : service.id === "ration"
                    ? "દા.ત. રેશન કાર્ડ નંબર (032014892145)"
                    : service.id === "pan"
                    ? "દા.ત. ૧૦ અક્ષરનો PAN નંબર (ABCDP1234K)"
                    : "હાલનો પ્રમાણપત્ર / કાર્ડ નંબર દાખલ કરો"
                }
                className="flex-1 px-3.5 py-2.5 bg-white border border-blue-300 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleFetchExistingRecord}
                disabled={isFetchingProfile}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isFetchingProfile ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>ફેચ થઈ રહ્યું છે...</span>
                  </>
                ) : (
                  <>
                    <Search size={14} />
                    <span>વિગતો મેળવો (Auto-Fetch)</span>
                  </>
                )}
              </button>
            </div>

            {/* Success Banner when profile is fetched */}
            {fetchedProfile && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3 rounded-xl flex items-center justify-between gap-2 text-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-extrabold block">
                      ✅ હયાત રેકોર્ડ મળ્યો: {fetchedProfile.applicantNameGu} ({fetchedProfile.applicantName})
                    </span>
                    <span className="text-[11px] text-emerald-800">
                      હાલનું સરનામું: {fetchedProfile.addressFull} • મોબાઈલ: {fetchedProfile.mobile}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded shrink-0">
                  વેરિફાઈડ રેકોર્ડ
                </span>
              </div>
            )}
          </div>

          {/* Multi-Select Corrections Checkboxes */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-3">
            <div className="border-b pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                  <span>☑️ ક્યા ક્યા સુધારા કરવા છે? (Select All Changes Required):</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  તમે એક સાથે એકથી વધુ સુધારા (Multi-Select) પસંદ કરી શકો છો.
                </p>
              </div>
              <span className="text-[11px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                પસંદ કરેલ: {selectedCorrections.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {getCorrectionOptions().map((opt) => {
                const isChecked = selectedCorrections.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    onClick={() => toggleCorrection(opt.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                      isChecked
                        ? "bg-orange-50 border-orange-400 ring-1 ring-orange-400 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 text-orange-600 focus:ring-orange-500 rounded"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block leading-tight">
                        {opt.labelGu}
                      </span>
                      <span className="text-[11px] text-slate-500">{opt.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Dynamic Comparison: Old Value vs New Corrected Value */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b pb-2">
              <ArrowLeftRight size={16} className="text-orange-600" />
              <span>સુધારા વિગત: હાલની વિગત (Old) vs નવી સુધારેલી વિગત (New)</span>
            </h3>

            {selectedCorrections.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                કૃપા કરીને ઉપરથી ઓછામાં ઓછો ૧ સુધારો પસંદ કરો.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedCorrections.map((corrId) => {
                  const corrOpt = getCorrectionOptions().find((o) => o.id === corrId);
                  const currentVals = oldVsNewValues[corrId] || { oldVal: "સરકારી રેકોર્ડ મુજબ", newVal: "" };

                  // ── SPECIALIZED CARD 1: Photo & Biometric Update ──
                  if (corrId === "photo_biometric" || corrId === "photo_sign") {
                    return (
                      <div key={corrId} className="bg-slate-50 border-2 border-blue-200 rounded-2xl p-4 space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                          <div className="flex items-center gap-2">
                            <Camera size={18} className="text-blue-600" />
                            <span className="font-extrabold text-xs sm:text-sm text-slate-800">
                              {corrOpt?.labelGu}
                            </span>
                          </div>
                          <span className="text-[10px] text-blue-800 bg-blue-100 font-bold px-2.5 py-0.5 rounded-full">
                            હાઇબ્રિડ સેવા (Digital Photo + In-Person Biometrics)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Left: Comparison & Guidance Notice (No Duplicate Upload Input) */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
                            <div className="space-y-2.5">
                              <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 border-b pb-1.5">
                                <Camera size={15} className="text-blue-600" />
                                <span>૧. ફોટો સુધારો વિગત (Photo Details)</span>
                              </span>

                              <div className="space-y-2 text-xs">
                                <div>
                                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                                    હાલની વિગત (Old Record):
                                  </label>
                                  <input
                                    type="text"
                                    disabled
                                    value={currentVals?.oldVal ?? "હાલનો આધાર ફોટો (૧૦ વર્ષ જૂનો સરકારી રેકોર્ડ)"}
                                    className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium cursor-not-allowed"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                                    સુધારેલી વિગત (Requested Update):
                                  </label>
                                  <input
                                    type="text"
                                    disabled
                                    value="નવો પાસપોર્ટ સાઇઝ રંગીન ફોટો & બાયોમેટ્રિક્સ ખરાઈ"
                                    className="w-full px-2.5 py-1.5 bg-emerald-50/60 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-bold cursor-not-allowed"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Pointer to Bottom Document Checklist for AI Verification */}
                            <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-2.5 space-y-1 text-[11px]">
                              <span className="font-bold text-blue-900 flex items-center gap-1">
                                <Sparkles size={13} className="text-blue-600" />
                                <span>ફોટો અપલોડ સૂચના (Document Checklist):</span>
                              </span>
                              <p className="text-[10.5px] text-blue-800 leading-relaxed">
                                તાજો પાસપોર્ટ સાઇઝ ફોટો જમણી બાજુના <strong>&apos;જરૂરી દસ્તાવેજો&apos;</strong> વિભાગમાં અપલોડ કરવાનો રહેશે, જ્યાં AI દ્વારા તેની આપમેળે ખરાઈ કરવામાં આવશે.
                              </p>
                            </div>
                          </div>

                          {/* Right: Dignified & Professional Indian Government Biometric Protocol */}
                          <div className="bg-slate-50 border border-slate-300 p-3.5 rounded-xl space-y-2.5 text-xs text-slate-900 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1.5 border-b border-slate-200 pb-1.5">
                                <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                                  <Fingerprint size={16} className="text-emerald-700" />
                                  <span>૨. બાયોમેટ્રિક્સ પ્રમાણીકરણ (e-Gram કેન્દ્ર પ્રોટોકોલ)</span>
                                </div>
                                <span className="bg-slate-800 text-white text-[9.5px] font-bold px-2 py-0.5 rounded font-mono">
                                  અધિકૃત પંચાયત સુવિધા
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                UIDAI સુરક્ષા ધારાધોરણો મુજબ આંગળીના નિશાન (Fingerprint) અને કીકી (Iris) ની રૂબરૂ ચકાસણી અનિવાર્ય છે.
                              </p>
                              
                              {/* Formal Government Directives */}
                              <div className="bg-white border border-slate-200 rounded-lg p-2.5 mt-2 space-y-1.5 text-[10.5px]">
                                <span className="font-bold text-slate-900 block border-b pb-1">
                                  સત્તાવાર સરકારી માર્ગદર્શિકા (Government Directives):
                                </span>
                                <ul className="text-slate-700 space-y-1">
                                  <li className="flex items-start gap-1.5">
                                    <span className="font-bold text-slate-900 shrink-0">• સ્થાનિક ગ્રામ્ય સુવિધા:</span>
                                    <span>નાગરિકોની સુગમતા અર્થે આપના જ ગામની ગ્રામ પંચાયતમાં કાર્યરત <strong>e-Gram VCE કેન્દ્ર</strong> ખાતે બાયોમેટ્રિક ખરાઈ ઉપલબ્ધ છે.</span>
                                  </li>
                                  <li className="flex items-start gap-1.5">
                                    <span className="font-bold text-slate-900 shrink-0">• શૂન્ય રોકડ નીતિ (Zero Cash):</span>
                                    <span>નિયત સરકારી ફી સાયબર ટ્રેઝરી પોર્ટલ મારફતે ઓનલાઇન જમા થયેલ છે. સ્થાનિક કેન્દ્ર ખાતે કોઈ રોકડ રકમ ચૂકવવાની રહેતી નથી.</span>
                                  </li>
                                  <li className="flex items-start gap-1.5">
                                    <span className="font-bold text-slate-900 shrink-0">• સત્તાવાર ડિજિટલ પહોંચ:</span>
                                    <span>અરજી પૂર્ણ થયે મળતી સત્તાવાર પહોંચ દર્શાવીને e-Gram કેન્દ્ર પર ૨ મિનિટમાં બાયોમેટ્રિક પ્રમાણીકરણ સંપન્ન થશે.</span>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="bg-slate-100 border border-slate-300 rounded-lg p-2 flex items-center justify-between text-[10px] text-slate-600">
                              <span>હેલ્પલાઇન: CM 1070 | પંચાયત 1800-233-5500</span>
                              <span className="font-bold text-slate-800">પંચાયત અને ગ્રામ ગૃહનિર્માણ વિભાગ</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // ── SPECIALIZED CARD 2: Add New Member in Ration Card ──
                  if (corrId === "add_member") {
                    return (
                      <div key={corrId} className="bg-slate-50 border-2 border-amber-200 rounded-2xl p-4 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-800">
                            🛒 {corrOpt?.labelGu}
                          </span>
                          <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded">
                            નવા સભ્યની નોંધણી
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">
                              નવા સભ્યનું પૂરું નામ *
                            </label>
                            <input
                              type="text"
                              value={newMemberName}
                              onChange={(e) => {
                                setNewMemberName(e.target.value);
                                setOldVsNewValues((prev) => ({
                                  ...prev,
                                  [corrId]: {
                                    oldVal: "કુલ ૩ સભ્યો હયાત",
                                    newVal: `${e.target.value} (${newMemberRelation})`,
                                  },
                                }));
                              }}
                              placeholder="દા.ત. પ્રિયાંશી આર. પટેલ"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">
                              વડા સાથે સંબંધ *
                            </label>
                            <select
                              value={newMemberRelation}
                              onChange={(e) => {
                                setNewMemberRelation(e.target.value);
                                setOldVsNewValues((prev) => ({
                                  ...prev,
                                  [corrId]: {
                                    oldVal: "કુલ ૩ સભ્યો હયાત",
                                    newVal: `${newMemberName || "નવા સભ્ય"} (${e.target.value})`,
                                  },
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            >
                              <option value="પુત્રી (Daughter)">પુત્રી (Daughter)</option>
                              <option value="પુત્ર (Son)">પુત્ર (Son)</option>
                              <option value="પત્ની (Wife)">પત્ની (Wife)</option>
                              <option value="પુત્રવધૂ (Daughter-in-law)">પુત્રવધૂ (Daughter-in-law)</option>
                              <option value="પૌત્ર / પૌત્રી (Grandchild)">પૌત્ર / પૌત્રી (Grandchild)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">
                              ઉંમર / જન્મ તારીખ *
                            </label>
                            <input
                              type="text"
                              value={newMemberAge}
                              onChange={(e) => setNewMemberAge(e.target.value)}
                              placeholder="દા.ત. ૨ વર્ષ (2024-05-10)"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">
                              આધાર નંબર (૧૨ આંકડા)
                            </label>
                            <input
                              type="text"
                              maxLength={12}
                              value={newMemberAadhaar}
                              onChange={(e) => setNewMemberAadhaar(e.target.value)}
                              placeholder="XXXX-XXXX-XXXX"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // ── STANDARD TEXT COMPARISON CARD (Address, Name, DOB, Mobile, etc.) ──
                  return (
                    <div key={corrId} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{corrOpt?.labelGu}</span>
                        <span className="text-[10px] text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded">
                          સુધારો લાગુ
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Old Value */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            હાલની વિગત (Old Value - સરકારી રેકોર્ડ મુજબ):
                          </label>
                          <input
                            type="text"
                            disabled
                            value={currentVals?.oldVal ?? "સરકારી રેકોર્ડ મુજબ"}
                            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium cursor-not-allowed"
                          />
                        </div>

                        {/* New Value */}
                        <div>
                          <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                            નવી સાચી વિગત (New Corrected Value) *:
                          </label>
                          <input
                            type="text"
                            value={currentVals?.newVal ?? ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setOldVsNewValues((prev) => {
                                const existing = prev[corrId] || { oldVal: "સરકારી રેકોર્ડ મુજબ", newVal: "" };
                                return {
                                  ...prev,
                                  [corrId]: { ...existing, newVal: v },
                                };
                              });
                            }}
                            placeholder="અહીં નવી સાચી વિગત દાખલ કરો"
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Step 2: Main Application Form (Official Kacheri Layout) ── */}
      <form onSubmit={handleOpenPaymentGateway} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Official Kacheri Application Particulars (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <Building size={16} className="text-orange-600" />
                    <span>અરજદારની સત્તાવાર વિગતો (Kacheri Form)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    જન સેવા કેન્દ્ર / મામલતદાર કચેરીના અસલી પત્રક મુજબ
                  </p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                  Form 1A
                </span>
              </div>

              {/* Applicant Name Fields */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    અરજદારનું પૂરું નામ (ગુજરાતીમાં) *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantNameGu || applicantName}
                    onChange={(e) => {
                      setApplicantNameGu(e.target.value);
                      if (!applicantName) setApplicantName(e.target.value);
                    }}
                    placeholder="દા.ત. રમેશભાઈ કાંતિલાલ પટેલ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    પિતા / પતિનું પૂરું નામ (Father/Husband Name) *
                  </label>
                  <input
                    type="text"
                    value={fatherOrHusbandName}
                    onChange={(e) => setFatherOrHusbandName(e.target.value)}
                    placeholder="દા.ત. કાંતિલાલ લાલજીભાઈ પટેલ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      જન્મ તારીખ (DOB) *
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">જાતિ (Gender) *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as "male" | "female")}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="male">પુરુષ (Male)</option>
                      <option value="female">સ્ત્રી (Female)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      મોબાઈલ નંબર (SMS એલર્ટ) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="9825012345"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>

                  {service.id === "aadhaar" && serviceMode === "new" ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        ઇમેઇલ સરનામું (વૈકલ્પિક)
                      </label>
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="citizen@gujarat.gov.in"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {service.id === "aadhaar"
                          ? "હાલના આધારના છેલ્લા ૪ આંકડા *"
                          : "અરજદારના આધારના છેલ્લા ૪ આંકડા (e-KYC) *"}
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        placeholder="4829"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                      />
                    </div>
                  )}
                </div>

                {service.id === "aadhaar" && serviceMode === "new" && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-600 shrink-0" />
                      <div className="text-[11px] leading-tight">
                        <strong className="block text-emerald-900">✨ નવી આધાર નોંધણી (Fresh UIDAI Application):</strong>
                        <span>નવી અરજી હોવાથી અગાઉનો કોઈ આધાર નંબર નથી; પ્રક્રિયા પૂર્ણ થયેથી UIDAI તરફથી Enrolment EID ફાળવવામાં આવશે.</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-2 py-0.5 rounded font-mono shrink-0">
                      EID Auto-Gen
                    </span>
                  </div>
                )}

                {/* District & Taluka Selectors */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">જિલ્લો (District) *</label>
                    <select
                      value={district}
                      onChange={(e) => {
                        const newDist = e.target.value;
                        setDistrict(newDist);
                        const found = GUJARAT_DISTRICTS.find((d) => d.en === newDist);
                        if (found && found.talukas.length > 0) setTaluka(found.talukas[0]);
                      }}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {GUJARAT_DISTRICTS.map((d) => (
                        <option key={d.en} value={d.en}>
                          {d.gu} ({d.en})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">તાલુકો (Taluka) *</label>
                    <select
                      value={taluka}
                      onChange={(e) => setTaluka(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {currentDistObj.talukas.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    ગામ / સોસાયટી / રહેઠાણ સરનામું *
                  </label>
                  <input
                    type="text"
                    value={village || streetSociety}
                    onChange={(e) => {
                      setVillage(e.target.value);
                      setStreetSociety(e.target.value);
                    }}
                    placeholder="દા.ત. ઘર નં. ૧૨, પટેલ વાસ, ગોમટા ગામ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Service Specific Fields */}
                {service.id === "ration" && (
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-amber-900 block">🛒 રેશનકાર્ડ કચેરી વિગત:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-amber-800 block">કેટેગરી</span>
                        <input
                          type="text"
                          value={rationCategory}
                          onChange={(e) => setRationCategory(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-amber-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-800 block">સસ્તા અનાજની દુકાન</span>
                        <input
                          type="text"
                          value={fpsShopNo}
                          onChange={(e) => setFpsShopNo(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-amber-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "income" && (
                  <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-blue-900 block">📜 આવક દાખલા પરિશિષ્ટ-૧:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-blue-800 block">કુટુંબની વાર્ષિક આવક (₹)</span>
                        <input
                          type="number"
                          value={annualIncomeVal}
                          onChange={(e) => setAnnualIncomeVal(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-blue-200 rounded text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-blue-800 block">આવકનો મુખ્ય સ્ત્રોત</span>
                        <input
                          type="text"
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-blue-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "caste" && (
                  <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-purple-900 block">⚖️ જાતિ / નોન-ક્રીમીલેયર વિગતો:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-purple-800 block">પેટા જાતિ (Sub-Caste)</span>
                        <input
                          type="text"
                          value={subCaste}
                          onChange={(e) => setSubCaste(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-purple-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-800 block">ધર્મ (Religion)</span>
                        <input
                          type="text"
                          value={religion}
                          onChange={(e) => setReligion(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-purple-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "land_records" && (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-emerald-900 block">🌾 જમીન મહેસૂલી વિગતો (e-Dhara RoR 7/12):</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-emerald-800 block">ખાતા નંબર *</span>
                        <input
                          type="text"
                          value={khataNumber}
                          onChange={(e) => setKhataNumber(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-emerald-200 rounded text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-800 block">સર્વે / બ્લોક નંબર *</span>
                        <input
                          type="text"
                          value={surveyNumber}
                          onChange={(e) => setSurveyNumber(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-emerald-200 rounded text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-800 block">ક્ષેત્રફળ (હેક્ટર)</span>
                        <input
                          type="text"
                          value={landArea}
                          onChange={(e) => setLandArea(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-emerald-200 rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "birth_cert" && (
                  <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-sky-900 block">👶 જન્મ નોંધણી વિગત (Civil Registration System):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-sky-800 block">બાળકનું નામ (Child Name)</span>
                        <input
                          type="text"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-sky-200 rounded text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-sky-800 block">જન્મ સ્થળ (હોસ્પિટલ/ઘર)</span>
                        <input
                          type="text"
                          value={birthPlace}
                          onChange={(e) => setBirthPlace(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-sky-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "death_cert" && (
                  <div className="bg-slate-100 border border-slate-300 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-slate-800 block">🕊️ મરણ નોંધણી વિગત:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-600 block">મૃતકનું પૂરું નામ *</span>
                        <input
                          type="text"
                          value={deceasedName}
                          onChange={(e) => setDeceasedName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-600 block">મરણ તારીખ *</span>
                        <input
                          type="date"
                          value={deathDate}
                          onChange={(e) => setDeathDate(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-600 block">મરણ સ્થળ</span>
                        <input
                          type="text"
                          value={deathPlace}
                          onChange={(e) => setDeathPlace(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "ews_cert" && (
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-indigo-900 block">🏛️ EWS મિલકત માપદંડ વિગતો:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-indigo-800 block">મકાન કાર્પેટ એરિયા</span>
                        <input
                          type="text"
                          value={ewsPropertyType}
                          onChange={(e) => setEwsPropertyType(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-indigo-200 rounded text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-800 block">વાર્ષિક આવક મર્યાદા</span>
                        <span className="block px-2 py-1 bg-white border border-indigo-200 rounded text-xs font-bold text-emerald-700">
                          ₹ ૧,૮૦,૦૦૦ (મર્યાદા ₹ ૮ લાખથી ઓછી)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "domicile_cert" && (
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-amber-900 block">🏠 ડોમિસાઇલ વસવાટ ખરાઈ:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-amber-800 block">ગુજરાતમાં સતત વસવાટ વર્ષો</span>
                        <input
                          type="text"
                          value={domicileYears}
                          onChange={(e) => setDomicileYears(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-amber-200 rounded text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-800 block">કલેક્ટર કચેરી</span>
                        <span className="block px-2 py-1 bg-white border border-amber-200 rounded text-xs text-slate-700">
                          જિલ્લા કલેક્ટર કચેરી, રાજકોટ
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "senior_citizen" && (
                  <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-rose-900 block">👴 વરિષ્ઠ નાગરિક આરોગ્ય & ઇમરજન્સી:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-rose-800 block">બ્લડ ગ્રુપ (Blood Group)</span>
                        <select
                          value={seniorBloodGroup}
                          onChange={(e) => setSeniorBloodGroup(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-rose-200 rounded text-xs font-bold"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-[10px] text-rose-800 block">ઇમરજન્સી સંપર્ક નંબર</span>
                        <input
                          type="tel"
                          value={seniorEmergencyPhone}
                          onChange={(e) => setSeniorEmergencyPhone(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-rose-200 rounded text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "driving_licence" && (
                  <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-teal-900 block">🚗 વાહન વર્ગ & RTO વિગત (SARATHI):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-teal-800 block">વાહન વર્ગ (Vehicle Class)</span>
                        <select
                          value={drivingClass}
                          onChange={(e) => setDrivingClass(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-teal-200 rounded text-xs font-bold"
                        >
                          <option value="MCWG">MCWG (મોટરસાયકલ ગિયરવાળી)</option>
                          <option value="LMV">LMV (લાઇટ મોટર વ્હીકલ - કાર)</option>
                          <option value="MCWG & LMV">MCWG & LMV (બાઇક અને કાર બંને)</option>
                          <option value="TRANSPORT">ટ્રાન્સપોર્ટ / કોમર્શિયલ વાહન</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-[10px] text-teal-800 block">RTO કચેરી</span>
                        <input
                          type="text"
                          value={rtoOfficeName}
                          onChange={(e) => setRtoOfficeName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-teal-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {service.id === "marriage_cert" && (
                  <div className="bg-pink-50/60 border border-pink-200 rounded-xl p-2.5 space-y-2 text-xs">
                    <span className="font-bold text-pink-900 block">💍 લગ્ન નોંધણી વિગતો:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-pink-800 block">લગ્ન તારીખ *</span>
                        <input
                          type="date"
                          value={marriageDate}
                          onChange={(e) => setMarriageDate(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-pink-200 rounded text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-pink-800 block">પત્નીનું પૂરું નામ *</span>
                        <input
                          type="text"
                          value={spouseName}
                          onChange={(e) => setSpouseName(e.target.value)}
                          placeholder="દા.ત. પ્રિયાબેન હરી પટેલ"
                          className="w-full px-2 py-1 bg-white border border-pink-200 rounded text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phygital Verification Box: Biometric + Digital Signature */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span>🔐 સત્તાવાર પ્રમાણીકરણ (Verification & Signature)</span>
              </h3>

              {/* Biometric Flag */}
              {isBiometricNeeded ? (
                serviceMode === "update" && selectedCorrections.includes("photo_biometric") ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center gap-1.5">
                      <Fingerprint size={16} className="text-emerald-700 shrink-0" />
                      <span className="font-bold">બાયોમેટ્રિક્સ: સ્થાનિક ગ્રામ પંચાયત e-Gram VCE (Zero Cash)</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded shrink-0">
                      પંચાયત માન્ય
                    </span>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                      <Fingerprint size={16} className="text-blue-600" />
                      <span>બાયોમેટ્રિક (ફિંગરપ્રિન્ટ) સુવિધા</span>
                    </div>
                    <p className="text-[11px] text-blue-800">
                      તાલુકા કચેરીએ ધક્કો ખાધા વગર: <strong>તમારા જ ગામની ગ્રામ પંચાયતમાં e-Gram VCE</strong> પાસે ૨ મિનિટમાં ફિંગરપ્રિન્ટ માન્ય થશે (નાગરિકે ₹૦ રોકડા ચૂકવવાના છે).
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>૧૦૦% ફેસલેસ ડિજિટલ પ્રક્રિયા — કચેરીએ જવાની જરૂર નથી.</span>
                </div>
              )}

              {/* Signature Mode */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700">સહી પદ્ધતિ પસંદ કરો:</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-2.5 border rounded-xl cursor-pointer hover:bg-slate-50 text-xs">
                    <input
                      type="radio"
                      name="sig_type"
                      checked={signatureType === "aadhaar-esign"}
                      onChange={() => setSignatureType("aadhaar-esign")}
                      className="mt-0.5 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {service.id === "aadhaar" && serviceMode === "new"
                          ? "મોબાઈલ OTP ઈ-પ્રમાણીકરણ (Mobile OTP Verification - ભલામણ કરેલ)"
                          : "આધાર e-Sign (OTP ડિજિટલ સહી - ભલામણ કરેલ)"}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {service.id === "aadhaar" && serviceMode === "new"
                          ? "અરજદારના નોંધાયેલા મોબાઈલ નંબર પર OTP થી ૧-સેકન્ડમાં ડિજિટલ પ્રમાણીકરણ."
                          : "IT Act 2000 હેઠળ કાયદેસર માન્ય. આધાર મોબાઈલ OTP થી ૧-સેકન્ડમાં સહી."}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 border rounded-xl cursor-pointer hover:bg-slate-50 text-xs">
                    <input
                      type="radio"
                      name="sig_type"
                      checked={signatureType === "physical-declaration"}
                      onChange={() => setSignatureType("physical-declaration")}
                      className="mt-0.5 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        પ્રી-ફિલ્ડ પત્રક ડાઉનલોડ કરીને પેનથી સહી
                      </span>
                      <span className="text-[11px] text-slate-500">
                        સિસ્ટમ દ્વારા ભરેલું ફોર્મ ડાઉનલોડ કરી સહી વાળો ફોટો અપલોડ કરવો.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Required Documents Checklist & AI Pre-Inspection (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <FileCheck2 size={18} className="text-orange-600" />
                    <span>જરૂરી દસ્તાવેજો & AI સ્માર્ટ ચેકિંગ (JPG, PNG, PDF)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    અપલોડ થતાં જ Gemini AI તરત તપાસીને જણાવશે કે દસ્તાવેજ માન્ય છે કે ખોટો છે (Zero Rejection).
                  </p>
                </div>

                <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold shrink-0">
                  કુલ જરૂરી: {requiredDocs.length} દસ્તાવેજો
                </span>
              </div>

              {/* Sample Demo Documents Quick Panel for Judges & Testing */}
              {service.id === "aadhaar" && serviceMode === "new" && (
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-700 shrink-0" />
                      <div>
                        <span className="text-xs font-black text-blue-950 block">
                          ⚡ ૧-ક્લિક ડેમો સેમ્પલ દસ્તાવેજો (ખુંટ હરકિશન વિનોદરાય):
                        </span>
                        <span className="text-[10px] text-blue-700">
                          નીચેથી દસ્તાવેજો સેવ/ડાઉનલોડ કરો અથવા સીધા જ ૧-ક્લિકમાં AI ઓટો-ચકાસણી કરો.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const demoList = [
                          { id: "birth_proof", url: "/demo-docs/1_birth_certificate_khunt_harkishan.png", name: "1_birth_certificate_khunt_harkishan.png" },
                          { id: "address_proof", url: "/demo-docs/2_electricity_bill_pgvcl_gondal.png", name: "2_electricity_bill_pgvcl_gondal.png" },
                          { id: "photo_id", url: "/demo-docs/3_pan_card_khunt_harkishan.png", name: "3_pan_card_khunt_harkishan.png" },
                        ];
                        for (const item of demoList) {
                          try {
                            const res = await fetch(item.url);
                            const blob = await res.blob();
                            const fileObj = new File([blob], item.name, { type: "image/png" });
                            await handleFileUpload(item.id, fileObj);
                          } catch (err) {
                            console.error("Demo auto-upload error:", err);
                          }
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
                    >
                      <UploadCloud size={14} />
                      <span>⚡ ૧-ક્લિક ઓટો-ટેસ્ટ (Auto-Verify All)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-blue-200/60 text-xs">
                    <a
                      href="/demo-docs/1_birth_certificate_khunt_harkishan.png"
                      download="1_birth_certificate_khunt_harkishan.png"
                      target="_blank"
                      className="p-2 bg-white hover:bg-blue-100/60 border border-blue-200 rounded-xl flex items-center justify-between font-semibold text-blue-900 transition shadow-2xs"
                    >
                      <span className="truncate text-[11px]">📥 ૧. જન્મનો દાખલો</span>
                      <Download size={13} className="text-blue-700 shrink-0 ml-1" />
                    </a>
                    <a
                      href="/demo-docs/2_electricity_bill_pgvcl_gondal.png"
                      download="2_electricity_bill_pgvcl_gondal.png"
                      target="_blank"
                      className="p-2 bg-white hover:bg-blue-100/60 border border-blue-200 rounded-xl flex items-center justify-between font-semibold text-blue-900 transition shadow-2xs"
                    >
                      <span className="truncate text-[11px]">📥 ૨. PGVCL લાઈટ બિલ</span>
                      <Download size={13} className="text-blue-700 shrink-0 ml-1" />
                    </a>
                    <a
                      href="/demo-docs/3_pan_card_khunt_harkishan.png"
                      download="3_pan_card_khunt_harkishan.png"
                      target="_blank"
                      className="p-2 bg-white hover:bg-blue-100/60 border border-blue-200 rounded-xl flex items-center justify-between font-semibold text-blue-900 transition shadow-2xs"
                    >
                      <span className="truncate text-[11px]">📥 ૩. PAN કાર્ડ (ID)</span>
                      <Download size={13} className="text-blue-700 shrink-0 ml-1" />
                    </a>
                  </div>
                </div>
              )}

              {/* Document Checklist Items */}
              <div className="space-y-3.5">
                {requiredDocs.map((docItem, index) => {
                  const docState = uploadedDocs[docItem.id];
                  const isAnalyzing = docState?.status === "analyzing";
                  const isValid = docState?.status === "valid";
                  const isWarning = docState?.status === "warning";
                  const isInvalid = docState?.status === "invalid";

                  return (
                    <div
                      key={docItem.id}
                      className={`rounded-2xl border p-3.5 sm:p-4 transition space-y-2.5 ${
                        isValid
                          ? "bg-emerald-50/40 border-emerald-300"
                          : isWarning
                          ? "bg-amber-50/50 border-amber-300"
                          : isInvalid
                          ? "bg-rose-50/50 border-rose-300"
                          : "bg-slate-50/60 border-slate-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-snug">
                              {docItem.nameGu}
                              {docItem.mandatory && <span className="text-rose-500 ml-1">*</span>}
                            </h4>
                            <p className="text-[11px] text-slate-500">{docItem.nameEn}</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isAnalyzing && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full font-bold animate-pulse">
                              <Loader2 size={13} className="animate-spin" />
                              <span>AI તપાસી રહ્યું છે...</span>
                            </span>
                          )}

                          {isValid && (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full font-bold">
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              <span>પ્રમાણિત ({docState.qualityScore}%)</span>
                            </span>
                          )}

                          {isWarning && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full font-bold">
                              <AlertTriangle size={14} className="text-amber-600" />
                              <span>ધ્યાન આપો</span>
                            </span>
                          )}

                          {isInvalid && (
                            <span className="inline-flex items-center gap-1 text-xs text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-full font-bold">
                              <XCircle size={14} className="text-rose-600" />
                              <span>અસ્વીકાર્ય (ખોટો દસ્તાવેજ)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Upload Controls (JPG, PNG, PDF) */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-black/5">
                        <div className="flex items-center gap-2 text-xs">
                          {docState?.fileName ? (
                            <span className="font-mono text-slate-700 font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 truncate max-w-[220px]">
                              <FileText size={13} className="text-orange-600" />
                              {docState.fileName}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">
                              JPG, PNG અથવા PDF અપલોડ કરો (મહત્તમ 5MB)
                            </span>
                          )}
                        </div>

                        <label className="cursor-pointer bg-white hover:bg-orange-50 border border-slate-300 hover:border-orange-400 text-slate-700 hover:text-orange-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                          <UploadCloud size={14} />
                          <span>{docState ? "બદલો (Replace)" : "અપલોડ કરો (Upload)"}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(docItem.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* AI Smart Actionable Alert Message */}
                      {docState?.adviceGu && (
                        <div
                          className={`text-xs p-3 rounded-xl border flex items-start gap-2.5 ${
                            isValid
                              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                              : isWarning
                              ? "bg-amber-100 border-amber-300 text-amber-950 font-medium"
                              : "bg-rose-50 border-2 border-rose-300 text-rose-950"
                          }`}
                        >
                          {isValid ? (
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                          ) : isWarning ? (
                            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <p className={`leading-relaxed ${isInvalid ? "font-bold text-rose-900 text-xs sm:text-sm" : ""}`}>
                              {docState.adviceGu}
                            </p>
                            {isInvalid && (
                              <p className="text-[11px] text-rose-700 font-medium">
                                ⚠️ સરકારી નિયમ: માંગેલ સત્તાવાર પુરાવા સિવાય અન્ય કોઈ દસ્તાવેજ (દા.ત. માર્કશીટ, અયોગ્ય બિલ) માન્ય ગણાશે નહીં. કૃપા કરીને &apos;બદલો (Replace)&apos; પર ક્લિક કરી સાચો દસ્તાવેજ અપલોડ કરો.
                              </p>
                            )}
                            {docState.needsUpdate && (
                              <p className="text-[11px] text-amber-800 font-bold">
                                👉 આ દસ્તાવેજમાં સુધારો કરવો પડશે. ઉપર &apos;સુધારો&apos; ટેબ પસંદ કરીને અપડેટ રિકવેસ્ટ કરી શકો છો.
                              </p>
                            )}
                            {docState.needsNewDocument && (
                              <p className="text-[11px] text-rose-800 font-bold">
                                👉 આ દસ્તાવેજ એક્સપાયર થયેલ છે, નવો કઢાવવો પડશે.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submission Section with Fee Breakdown */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                {/* Alert banner when any document is rejected */}
                {requiredDocs.some((d) => uploadedDocs[d.id]?.status === "invalid") && (
                  <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-950">
                    <XCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block">ધ્યાન આપો: અરજીમાં અસ્વીકાર્ય દસ્તાવેજ મળ્યો છે!</span>
                      <span className="text-[11px] text-rose-800">
                        અપલોડ કરેલ દસ્તાવેજ (દા.ત. માર્કશીટ/અયોગ્ય કાગળ) સરકારી નિયમો મુજબ માન્ય નથી. જ્યાં સુધી સાચો સત્તાવાર પુરાવો અપલોડ નહીં થાય ત્યાં સુધી અરજી સબમિટ કરી શકાશે નહીં.
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">સરકારી સેવા ફી: ₹ {service.fee}</p>
                    <p className="text-[11px] text-slate-500">સાયબર ટ્રેઝરી ચલણ અને GST મુક્ત</p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || requiredDocs.some((d) => uploadedDocs[d.id]?.status === "invalid")}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-sm font-extrabold shadow-md transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CreditCard size={16} />
                    <span>આગળ વધો & સરકારી ફી ચૂકવો (Proceed to Pay)</span>
                  </button>
                </div>

                <p className="text-center text-[11px] text-slate-400">
                  🔒 તમારી માહિતી UIDAI અને ગુજરાત સરકારના ડેટા સુરક્ષા ધારા હેઠળ ૧૦૦% એન્ક્રિપ્ટેડ છે.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
