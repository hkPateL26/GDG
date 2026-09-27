"use client";

import { useState } from "react";
import {
  DOCUMENT_SERVICES,
  DocumentServiceConfig,
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
  Send,
  Calendar,
  MapPin,
  Fingerprint,
  PenTool,
  MessageSquare,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Eye,
  FileText,
  Clock,
  Printer,
  XCircle,
  Search,
  CreditCard,
  QrCode,
  Receipt,
  Shield,
  Building,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Landmark,
  UserCheck,
  Layers,
  ArrowLeftRight,
  Camera,
  User,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

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

export default function DocumentServicePortal() {
  // 1. Service Selection & Mode
  const [selectedServiceId, setSelectedServiceId] = useState<string>("aadhaar");
  const [serviceMode, setServiceMode] = useState<"new" | "update">("update");

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

  // Specialized states for Photo & Family Member additions
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberRelation, setNewMemberRelation] = useState<string>("પુત્રી (Daughter)");
  const [newMemberAge, setNewMemberAge] = useState<string>("");
  const [newMemberAadhaar, setNewMemberAadhaar] = useState<string>("");

  // 4. Kacheri Official Detailed Form Fields (Universal / New Application)
  const [applicantName, setApplicantName] = useState<string>("");
  const [applicantNameGu, setApplicantNameGu] = useState<string>("");
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState<string>("");
  const [motherName, setMotherName] = useState<string>("");
  const [dob, setDob] = useState<string>("1985-06-15");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [maritalStatus, setMaritalStatus] = useState<string>("વિવાહિત (Married)");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [aadhaarNumber, setAadhaarNumber] = useState<string>("");

  // Detailed Kacheri Address Fields
  const [district, setDistrict] = useState<string>("Rajkot");
  const [taluka, setTaluka] = useState<string>("Gondal");
  const [village, setVillage] = useState<string>("");
  const [houseNo, setHouseNo] = useState<string>("");
  const [streetSociety, setStreetSociety] = useState<string>("");
  const [gramPanchayat, setGramPanchayat] = useState<string>("");
  const [pincode, setPincode] = useState<string>("360320");

  // Service Specific Kacheri Fields
  const [rationCategory, setRationCategory] = useState<string>("NFSA - APL-1");
  const [fpsShopNo, setFpsShopNo] = useState<string>("FPS-342 (ગોમટા સેવા સહકારી)");
  const [gasConnectionStatus, setGasConnectionStatus] = useState<string>("સિંગલ બોટલ (Single Cylinder)");
  const [bankAccountNo, setBankAccountNo] = useState<string>("•••• •••• 4912");
  const [bankIfsc, setBankIfsc] = useState<string>("SBIN0001249");
  const [annualIncomeVal, setAnnualIncomeVal] = useState<string>("120000");
  const [occupation, setOccupation] = useState<string>("ખેતી / પશુપાલન (Agriculture)");
  const [subCaste, setSubCaste] = useState<string>("પાટીદાર (પટેલ)");
  const [religion, setReligion] = useState<string>("હિન્દુ (Hindu)");

  // 5. Document Uploads & AI Inspections
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDocState>>({});

  // 6. Phygital: Signature selection
  const [signatureType, setSignatureType] = useState<"aadhaar-esign" | "physical-declaration">("aadhaar-esign");
  const [esignOtp, setEsignOtp] = useState<string>("");
  const [esignDone, setEsignDone] = useState<boolean>(false);

  // 7. Payment Gateway Modal State (Cyber Treasury / Bharat BillPay)
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "challan">("upi");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [activeTxnId, setActiveTxnId] = useState<string>("");
  const [activeChallanNo, setActiveChallanNo] = useState<string>("");

  // 8. Submission & Notification Alert Simulation
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<CitizenApplication | null>(null);
  const [notificationPayload, setNotificationPayload] = useState<{
    sms?: { sentTo: string; message: string; timestamp: string };
    email?: { sentTo: string; subject: string; timestamp: string };
  } | null>(null);

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
          nameEn: "Fresh Passport Size Color Photograph (White Background)",
          nameGu: "તાજો પાસપોર્ટ સાઇઝ રંગીન ફોટો (સફેદ બેકગ્રાઉન્ડ)",
          mandatory: true,
        });
      }
    }

    return docs;
  };

  const requiredDocs = getDynamicRequiredDocs();

  // Handle Document Upload & Gemini AI Pre-Inspection
  const handleFileUpload = async (docId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;

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

      try {
        const res = await fetch("/api/verify-doc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || "image/jpeg",
            expectedDocType: requiredDocs.find((d) => d.id === docId)?.nameEn || "",
          }),
        });

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
      } catch (err) {
        // Strict fallback on failure: do NOT mark as valid
        setUploadedDocs((prev) => ({
          ...prev,
          [docId]: {
            file,
            fileName: file.name,
            fileType: file.type || "image/jpeg",
            base64: base64Data,
            status: "invalid",
            qualityScore: 15,
            adviceGu: "❌ દસ્તાવેજ ચકાસણી સર્વર સાથે સંપર્ક થઈ શક્યો નહીં અથવા ફાઇલ અવાચ્ય છે. કૃપા કરીને સાચો સત્તાવાર દસ્તાવેજ ફરીથી અપલોડ કરો.",
            needsUpdate: false,
            needsNewDocument: false,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-Fetch Existing Document Profile from DigiLocker / Govt Registry
  const handleFetchExistingRecord = () => {
    setIsFetchingProfile(true);
    setTimeout(() => {
      const profile = lookupCitizenExistingRecord(service.id, lookupNumber || "4829");
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
      setStreetSociety("પટેલ શેરી, ગોમટા ગામ");
      setHouseNo("૧૨");

      if (service.id === "ration") {
        setRationCategory("NFSA - APL-1");
        setFpsShopNo("FPS-342 (ગોમટા સેવા સહકારી)");
      } else if (service.id === "aadhaar") {
        setAadhaarNumber(lookupNumber ? lookupNumber.slice(-4) : "4829");
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
    setEsignDone(true);

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
        aadhaarLast4: aadhaarNumber ? aadhaarNumber.slice(-4) : "4829",
        paymentStatus: paymentMethod === "challan" ? "pending_challan" : "paid",
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
      default:
        return [{ id: "general", labelGu: "સામાન્ય સુધારો (Correction)", desc: "દસ્તાવેજમાં ફેરફાર" }];
    }
  };

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
              <label className="block text-xs font-bold text-slate-700">ચુકવણી પદ્ધતિ પસંદ કરો:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === "upi"
                      ? "bg-orange-50 border-orange-500 text-orange-800 ring-2 ring-orange-500/20 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <QrCode size={18} className="text-orange-600" />
                  <span>UPI / Bharat QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === "card"
                      ? "bg-orange-50 border-orange-500 text-orange-800 ring-2 ring-orange-500/20 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <CreditCard size={18} className="text-blue-600" />
                  <span>કાર્ડ / નેટ બેંકિંગ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("challan")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === "challan"
                      ? "bg-orange-50 border-orange-500 text-orange-800 ring-2 ring-orange-500/20 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Landmark size={18} className="text-emerald-600" />
                  <span>કચેરીએ રોકડ ચલણ</span>
                </button>
              </div>

              {/* UPI QR Display */}
              {paymentMethod === "upi" && (
                <div className="border border-orange-200 bg-orange-50/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="bg-white p-2.5 rounded-xl border-2 border-orange-300 shadow-xs shrink-0">
                    {/* Simulated Authentic Bharat QR */}
                    <div className="w-24 h-24 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white text-[9px] font-mono p-1">
                      <QrCode size={48} className="text-white mx-auto" />
                      <span className="text-[7.5px] mt-0.5 text-orange-300">GUJ-GOV-UPI</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="font-extrabold text-slate-900">કોઈપણ UPI એપથી સ્કેન કરો</p>
                    <p className="text-[11px] text-slate-600">
                      GPay, PhonePe, Paytm, BHIM અથવા સરકારી બેંકિંગ એપ
                    </p>
                    <div className="font-mono text-[10px] bg-white border border-orange-200 px-2.5 py-1 rounded-md text-slate-700 font-bold inline-block">
                      UPI VPA: cybertreasury.gujarat@sbi
                    </div>
                    <p className="text-[10px] text-emerald-800 font-bold">
                      ✓ ચુકવણી થયા બાદ તરત જ ઈ-રસીદ જનરેટ થશે
                    </p>
                  </div>
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

            {/* Confirm & Submit Button */}
            <div className="border-t pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[10px] text-slate-500 font-mono">
                GRN: {activeChallanNo} • Ref: {activeTxnId}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isProcessingPayment}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition w-full sm:w-auto"
                >
                  રદ કરો
                </button>
                <button
                  type="button"
                  onClick={handleFinalPaymentSubmit}
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>ચુકવણી ચકાસણી થઈ રહી છે...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>
                        {paymentMethod === "challan" ? "ચલણ જનરેટ કરો & સબમિટ" : `ફી ₹ ${service.fee} ચૂકવો & સબમિટ`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Submission Success & Real-Time Alert Modal ── */}
      {submittedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-6 shadow-2xl border-2 border-emerald-500 relative">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                સત્તાવાર અરજી નોંધણી સફળ • Govt Registered
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                અરજી સફળતાપૂર્વક સ્વીકારાઈ ગઈ છે!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                અરજી ક્રમાંક (Tracking ID):{" "}
                <span className="font-mono font-black text-orange-600 text-base">{submittedApp.id}</span>
              </p>
            </div>

            {/* Treasury Payment Badge */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Receipt size={16} className="text-emerald-700" />
                <div>
                  <span className="font-bold text-emerald-900 block">સરકારી ફી ભરપાઈ (Paid Receipt)</span>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    Txn: {submittedApp.txnId || activeTxnId} • GRN: {submittedApp.challanNo || activeChallanNo}
                  </span>
                </div>
              </div>
              <span className="bg-emerald-600 text-white font-mono font-bold px-2.5 py-1 rounded-lg text-xs">
                ₹ {submittedApp.feeAmount || service.fee} PAID
              </span>
            </div>

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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href={`/track?id=${encodeURIComponent(submittedApp.id)}`}
                className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-center font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                <span>લાઈવ સ્ટેટસ ટ્રેક કરો (Track in Registry)</span>
              </Link>

              <button
                onClick={() => setSubmittedApp(null)}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                નવી અરજી કરો
              </button>
            </div>
          </div>
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

      {/* ── Step 1: Select Document Service ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
          ૧. સરકારી દસ્તાવેજ / સેવા પસંદ કરો (SELECT DOCUMENT SERVICE):
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {DOCUMENT_SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelectedServiceId(s.id);
                setFetchedProfile(null);
                setUploadedDocs({});
              }}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                selectedServiceId === s.id
                  ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{s.emoji}</span>
                {selectedServiceId === s.id && (
                  <CheckCircle2 size={16} className="text-orange-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900 leading-snug">{s.nameGu}</p>
                <p className="text-[10px] text-slate-500 truncate">{s.nameEn}</p>
              </div>
            </button>
          ))}
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
              onClick={() => setServiceMode("new")}
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
                          {/* Photo Upload Box */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                            <span className="font-bold text-xs text-slate-800 block">
                              📸 ૧. નવો પાસપોર્ટ સાઇઝ રંગીન ફોટો (Upload Fresh Photo):
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-20 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center overflow-hidden shrink-0">
                                {newPhotoPreview ? (
                                  <img src={newPhotoPreview} alt="New Photo" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="text-center p-1">
                                    <User size={22} className="text-slate-400 mx-auto" />
                                    <span className="text-[8px] text-slate-400 mt-1 block">સફેદ બેકગ્રાઉન્ડ</span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1.5 flex-1">
                                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs w-full">
                                  <UploadCloud size={14} />
                                  <span>{newPhotoPreview ? "ફોટો બદલો (Change)" : "તાજો ફોટો અપલોડ કરો"}</span>
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const r = new FileReader();
                                        r.onload = () => {
                                          setNewPhotoPreview(r.result as string);
                                          setOldVsNewValues((prev) => ({
                                            ...prev,
                                            [corrId]: {
                                              oldVal: "હાલનો આધાર ફોટો (૧૦ વર્ષ જૂનો)",
                                              newVal: "નવો પાસપોર્ટ ફોટો અપલોડ કરેલ છે (White Background)",
                                            },
                                          }));
                                        };
                                        r.readAsDataURL(e.target.files[0]);
                                      }
                                    }}
                                  />
                                </label>
                                <p className="text-[10px] text-slate-500">
                                  JPG/PNG, સાઈઝ 35x45mm, સીધો ચહેરો, બંને કાન દેખાય તેવો
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Biometrics Protocol Explanation */}
                          <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-xl space-y-1.5 text-xs text-blue-950 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                                <Fingerprint size={16} className="text-blue-700" />
                                <span>૨. ફિંગરપ્રિન્ટ & આઇરિસ સ્કેન (Biometrics Protocol)</span>
                              </div>
                              <p className="text-[11px] text-blue-900 leading-relaxed">
                                સરકારી સુરક્ષા પ્રોટોકોલ (UIDAI) મુજબ બાયોમેટ્રિક્સ સ્કેન ઓનલાઇન કેમેરાથી માન્ય નથી. આ અરજી સબમિટ થતાં જ સિસ્ટમ તમને <strong>નજીકના જન સેવા કેન્દ્રનો VIP Fast-Track સ્લોટ ટોકન (TK-XXX)</strong> ફાળવશે.
                              </p>
                            </div>
                            <div className="bg-white border border-blue-200 rounded-lg p-2 flex items-center justify-between text-[10.5px]">
                              <span className="font-semibold text-slate-700">લાઈનમાં ઊભા વગર:</span>
                              <span className="font-mono font-bold text-blue-700">૨ મિનિટ સ્લોટ (Zero Queue)</span>
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
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      આધારના છેલ્લા ૪ આંકડા *
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
                </div>

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
              </div>
            </div>

            {/* Phygital Verification Box: Biometric + Digital Signature */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span>🔐 સત્તાવાર પ્રમાણીકરણ (Verification & Signature)</span>
              </h3>

              {/* Biometric Flag */}
              {isBiometricNeeded ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                    <Fingerprint size={16} className="text-blue-600" />
                    <span>બાયોમેટ્રિક (ફિંગરપ્રિન્ટ) જરૂરી રહેશે</span>
                  </div>
                  <p className="text-[11px] text-blue-800">
                    અરજી સબમિટ થતાં જ તમને નજીકના જન સેવા કેન્દ્રનો ૨ મિનિટનો <strong>Fast-Track ટોકન</strong> મળી જશે.
                  </p>
                </div>
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
                        આધાર e-Sign (OTP ડિજિટલ સહી - ભલામણ કરેલ)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        IT Act 2000 હેઠળ કાયદેસર માન્ય. આધાર મોબાઈલ OTP થી ૧-સેકન્ડમાં સહી.
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
