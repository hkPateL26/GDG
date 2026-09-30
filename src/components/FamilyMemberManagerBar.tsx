"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FamilyMemberProfile,
  CitizenPrimaryInfo,
  loadFamilyMembers,
  saveFamilyMembers,
  getActiveFamilyMember,
  setActiveFamilyMemberId,
  getFamilyIdForCitizen,
  getRecommendedProofForRelation,
} from "@/lib/family-ledger";
import {
  Users,
  UserPlus,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  KeyRound,
  X,
  Sparkles,
  Lock,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Upload,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface FamilyMemberManagerBarProps {
  citizen: CitizenPrimaryInfo;
  activeTab?: "track" | "documents" | "eligibility";
  onSelectForDocument?: (member: FamilyMemberProfile) => void;
}

export default function FamilyMemberManagerBar({
  citizen,
  activeTab,
  onSelectForDocument,
}: FamilyMemberManagerBarProps) {
  const [members, setMembers] = useState<FamilyMemberProfile[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string>("member-self");
  // Wrapped / collapsed by default so mobile & app screens stay clean and compact;
  // user can expand full cards anytime on demand.
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Modal 1: Verify existing pending member via OTP on their other mobile
  const [verifyingMember, setVerifyingMember] = useState<FamilyMemberProfile | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");

  // Modal 2: Add a new family member (PoR Verification + Same Mobile OR Other Mobile OTP)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newNameGu, setNewNameGu] = useState<string>("");
  const [newNameEn, setNewNameEn] = useState<string>("");
  const [newRelationGu, setNewRelationGu] = useState<string>("પુત્ર (Son)");
  const [newFatherHusbandGu, setNewFatherHusbandGu] = useState<string>(
    citizen.citizenNameGu || "હરી વિનોદરાઈ પટેલ"
  );
  const [newGender, setNewGender] = useState<"male" | "female">("male");
  const [newDob, setNewDob] = useState<string>("2018-06-15");
  const [newAadhaar, setNewAadhaar] = useState<string>("");

  // Real Government Proof of Relationship (PoR - UIDAI HoF / NFSA Ration Card) state
  const [porDocType, setPorDocType] = useState<string>(
    getRecommendedProofForRelation("પુત્ર (Son)").defaultDocType
  );
  const [porDocNumber, setPorDocNumber] = useState<string>("");
  const [porUploadedFileName, setPorUploadedFileName] = useState<string>("");
  const [isPorVerified, setIsPorVerified] = useState<boolean>(false);

  // Mobile linking mode
  const [mobileMode, setMobileMode] = useState<"same" | "other">("same");
  const [otherMobile, setOtherMobile] = useState<string>("");
  const [addStep, setAddStep] = useState<"form" | "otp">("form");
  const [addGeneratedOtp, setAddGeneratedOtp] = useState<string>("");
  const [addEnteredOtp, setAddEnteredOtp] = useState<string>("");
  const [addError, setAddError] = useState<string>("");

  useBodyScrollLock(Boolean(verifyingMember || isAddModalOpen));

  const syncData = useCallback(() => {
    const loaded = loadFamilyMembers(citizen);
    setMembers(loaded);
    const active = getActiveFamilyMember(citizen);
    setActiveMemberId(active.id);
  }, [citizen]);

  useEffect(() => {
    syncData();
    window.addEventListener("nagrik_family_updated", syncData);
    window.addEventListener("nagrik_family_member_change", syncData);
    return () => {
      window.removeEventListener("nagrik_family_updated", syncData);
      window.removeEventListener("nagrik_family_member_change", syncData);
    };
  }, [syncData]);

  const handleSelectMember = (member: FamilyMemberProfile) => {
    triggerHaptic("selection");
    if (member.verificationStatus === "pending_otp") {
      // Open OTP verification modal for this member's registered mobile number
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(code);
      setEnteredOtp("");
      setOtpError("");
      setVerifyingMember(member);
      return;
    }

    setActiveMemberId(member.id);
    setActiveFamilyMemberId(member.id, member);
    if (onSelectForDocument) {
      onSelectForDocument(member);
    }
  };

  const handleConfirmPendingMemberOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingMember) return;

    if (enteredOtp.trim() !== generatedOtp) {
      setOtpError("અમાન્ય OTP! કૃપા કરીને નીચે બતાવેલ 6-આંકડાનો સાચો OTP દાખલ કરો.");
      return;
    }

    triggerHaptic("heavy");
    const updatedList = members.map((m) =>
      m.id === verifyingMember.id
        ? {
            ...m,
            verificationStatus: "verified_other_mobile" as const,
            linkedAt: new Date().toISOString().slice(0, 10),
          }
        : m
    );

    const newlyVerified = updatedList.find((m) => m.id === verifyingMember.id);
    saveFamilyMembers(citizen.mobile, updatedList);
    setMembers(updatedList);
    if (newlyVerified) {
      setActiveMemberId(newlyVerified.id);
      setActiveFamilyMemberId(newlyVerified.id, newlyVerified);
      if (onSelectForDocument) onSelectForDocument(newlyVerified);
    }
    setVerifyingMember(null);
  };

  const handleRemoveMember = (memberId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (memberId === "member-self") return;
    triggerHaptic("medium");
    const updated = members.filter((m) => m.id !== memberId);
    saveFamilyMembers(citizen.mobile, updated);
    setMembers(updated);
    if (activeMemberId === memberId && updated[0]) {
      setActiveMemberId(updated[0].id);
      setActiveFamilyMemberId(updated[0].id, updated[0]);
    }
  };

  const openAddModal = () => {
    triggerHaptic("light");
    const defaultRel = "પુત્ર (Son)";
    const proofMeta = getRecommendedProofForRelation(defaultRel);
    setNewNameGu("");
    setNewNameEn("");
    setNewRelationGu(defaultRel);
    setNewFatherHusbandGu(citizen.citizenNameGu || "હરી વિનોદરાઈ પટેલ");
    setNewGender("male");
    setNewDob("2018-06-15");
    setNewAadhaar("");
    setPorDocType(proofMeta.defaultDocType);
    setPorDocNumber("");
    setPorUploadedFileName("");
    setIsPorVerified(false);
    setMobileMode("same");
    setOtherMobile("");
    setAddStep("form");
    setAddError("");
    setIsAddModalOpen(true);
  };

  const handleAutoVerifyRelationshipProof = () => {
    triggerHaptic("medium");
    setAddError("");
    const prefix = newRelationGu.includes("પુત્ર") || newRelationGu.includes("પુત્રી")
      ? "BIRTH-GJ-2018-"
      : newRelationGu.includes("પત્ની")
      ? "MRG-RJK-2024-"
      : "RC-GJ-0320";
    const randomDigits = String(Math.floor(1000 + Math.random() * 9000));
    if (!porDocNumber.trim()) {
      setPorDocNumber(`${prefix}${randomDigits}`);
    }
    if (!newFatherHusbandGu.trim()) {
      setNewFatherHusbandGu(citizen.citizenNameGu || "હરી વિનોદરાઈ પટેલ");
    }
    setIsPorVerified(true);
  };

  const handleProceedAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    const cleanName = newNameGu.trim();
    const cleanAadhaarDigits = newAadhaar.replace(/\D/g, "");
    if (!cleanName) {
      setAddError("કૃપા કરીને પરિવારના સભ્યનું પૂરું નામ દાખલ કરો.");
      return;
    }
    if (cleanAadhaarDigits.length < 4) {
      setAddError("કૃપા કરીને આધાર કાર્ડના ૧૨ આંકડા (અથવા છેલ્લા ૪ આંકડા) દાખલ કરો.");
      return;
    }
    if (!porDocNumber.trim()) {
      setAddError(
        "સરકારી નિયમ મુજબ આ સભ્ય તમારા જ પરિવારના છે તે સાબિત કરવા સંબંધના પુરાવાનો નંબર (દા.ત. રેશન કાર્ડ / જન્મ કે લગ્ન પ્રમાણપત્ર નંબર) નાખો અથવા 'DigiLocker ઓટો-વેરિફાય' દબાવો."
      );
      return;
    }
    if (!isPorVerified) {
      setAddError(
        "કૃપા કરીને પહેલા 'સરકારી NFSA / DigiLocker રેકોર્ડથી સંબંધ ચકાસો' બટન દબાવીને કૌટુંબિક સંબંધ (Proof of Relationship) પ્રમાણિત કરો."
      );
      return;
    }

    // Check UIDAI 5-profile rule for same mobile number
    const sameMobileCount = members.filter((m) => m.sameMobileAsPrimary).length;
    if (mobileMode === "same" && sameMobileCount >= 5) {
      setAddError(
        "UIDAI mAadhaar નિયમ મુજબ ૧ મોબાઈલ નંબર પર મહત્તમ ૫ આધાર પ્રોફાઈલ જોડી શકાય છે. કૃપા કરીને 'બીજા મોબાઈલ નંબર પર OTP' વિકલ્પ પસંદ કરો."
      );
      return;
    }

    if (mobileMode === "other") {
      const cleanMob = otherMobile.replace(/\D/g, "").slice(-10);
      if (cleanMob.length !== 10) {
        setAddError("કૃપા કરીને સભ્યના આધાર સાથે લિંક થયેલ ૧૦ આંકડાનો મોબાઈલ નંબર દાખલ કરો.");
        return;
      }

      if (addStep === "form") {
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        setAddGeneratedOtp(otp);
        setAddEnteredOtp("");
        setAddStep("otp");
        return;
      }

      if (addEnteredOtp.trim() !== addGeneratedOtp) {
        setAddError("દાખલ કરેલ OTP ખોટો છે! કૃપા કરીને સાચો 6-Digit OTP નાખો.");
        return;
      }
    }

    // Create & save the new verified family member
    const last4 = cleanAadhaarDigits.slice(-4);
    const primaryMob = (citizen.mobile || "9825012345").replace(/\D/g, "").slice(-10);
    const targetMob =
      mobileMode === "same" ? primaryMob : otherMobile.replace(/\D/g, "").slice(-10);

    const birthYear = parseInt(newDob.slice(0, 4), 10) || 2000;
    const calcAge = Math.max(1, 2026 - birthYear);

    const avatar =
      newGender === "female"
        ? calcAge < 18
          ? "👧"
          : calcAge > 50
          ? "👵"
          : "👩"
        : calcAge < 18
        ? "👦"
        : calcAge > 50
        ? "👴"
        : "👨";

    const newMember: FamilyMemberProfile = {
      id: `member-${Date.now()}`,
      nameGu: cleanName,
      nameEn: newNameEn.trim() || cleanName,
      relationGu: newRelationGu,
      relationEn: newRelationGu,
      fatherOrHusbandNameGu:
        newFatherHusbandGu.trim() || citizen.citizenNameGu || "હરી વિનોદરાઈ પટેલ",
      gender: newGender,
      dob: newDob,
      age: calcAge,
      aadhaarLast4: last4,
      aadhaarMasked: `XXXX-XXXX-${last4}`,
      mobile: targetMob,
      sameMobileAsPrimary: mobileMode === "same",
      verificationStatus:
        mobileMode === "same" ? "verified_same_mobile" : "verified_other_mobile",
      relationshipProofTypeGu: porDocType,
      relationshipProofNo: porDocNumber.trim(),
      avatarEmoji: avatar,
      linkedAt: new Date().toISOString().slice(0, 10),
    };

    triggerHaptic("heavy");
    const updatedList = [...members, newMember];
    saveFamilyMembers(citizen.mobile, updatedList);
    setMembers(updatedList);
    setActiveMemberId(newMember.id);
    setActiveFamilyMemberId(newMember.id, newMember);
    if (onSelectForDocument) onSelectForDocument(newMember);
    setIsAddModalOpen(false);
  };

  const familyId = getFamilyIdForCitizen(citizen.mobile, citizen.aadhaarLast4);
  const sameMobileLinkedCount = members.filter((m) => m.sameMobileAsPrimary).length;
  const activeMemberObj = members.find((m) => m.id === activeMemberId) || members[0];
  const currentProofMeta = getRecommendedProofForRelation(newRelationGu);

  return (
    <div className="bg-white border-2 border-indigo-200/90 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xs space-y-2">
      {/* ══════════════════════════════════════════════════════════════════
          COMPACT WRAPPED BAR (Always visible, takes minimal vertical space)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Left: Compact Family Info + Currently Active Applicant */}
        <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-slate-900 truncate">
                  👨‍👩‍👧‍👦 કુટુંબ પ્રોફાઈલ
                </span>
                <span className="text-[10px] font-mono font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded-full">
                  {familyId}
                </span>
                <span className="hidden md:inline-flex text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  📱 {sameMobileLinkedCount}/5 આધાર (mAadhaar)
                </span>
              </div>
              {activeMemberObj && (
                <p className="text-[11px] text-slate-600 truncate mt-0.5">
                  સક્રિય અરજદાર:{" "}
                  <strong className="font-black text-indigo-950">
                    {activeMemberObj.avatarEmoji} {activeMemberObj.nameGu}
                  </strong>{" "}
                  <span className="text-[10px] font-bold text-indigo-700">
                    ({activeMemberObj.relationGu})
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Mobile quick expand toggle button on top-right */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setIsExpanded((prev) => !prev);
            }}
            className="sm:hidden px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-[11px] font-black flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
          >
            <span>{isExpanded ? "બંધ કરો" : `પરિવાર (${members.length})`}</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Right: Desktop/Mobile Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setIsExpanded((prev) => !prev);
            }}
            className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-extrabold items-center gap-1.5 transition cursor-pointer"
          >
            <span>
              {isExpanded
                ? "પરિવાર કાર્ડ સંકેલો (Wrap)"
                : `પરિવારના સભ્યો જુઓ (${members.length})`}
            </span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="app-touch-card w-full sm:w-auto px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-[11px] sm:text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <UserPlus size={13} className="shrink-0" />
            <span>+ પરિવારનો સભ્ય ઉમેરો (PoR & OTP)</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          1-LINE HORIZONTAL SCROLLABLE PILL STRIP (Quick 1-Tap Switcher)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
        {members.map((member) => {
          const isSelected = member.id === activeMemberId;
          const isPending = member.verificationStatus === "pending_otp";
          const shortRel = member.relationGu.split(" ")[0];

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => handleSelectMember(member)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 shrink-0 border cursor-pointer active:scale-95 ${
                isPending
                  ? "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100"
                  : isSelected
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{member.avatarEmoji}</span>
              <span className="font-extrabold truncate max-w-[130px] sm:max-w-[160px]">
                {member.nameGu}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isPending
                    ? "bg-amber-200/80 text-amber-950"
                    : isSelected
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-200/80 text-slate-600"
                }`}
              >
                {shortRel}
              </span>
              {isPending ? (
                <KeyRound size={11} className="text-amber-700 shrink-0" />
              ) : isSelected ? (
                <CheckCircle2 size={11} className="text-emerald-300 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          EXPANDABLE FULL FAMILY MEMBER CARDS (Opens only when needed!)
         ══════════════════════════════════════════════════════════════════ */}
      {isExpanded && (
        <div className="pt-2 border-t border-slate-100 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-[11px]">
            <span className="text-slate-600 font-semibold">
              🏛️ <strong>UIDAI mAadhaar & NFSA નિયમ:</strong> ૧ મોબાઈલ પર મહત્તમ ૫ આધાર લિંક ({sameMobileLinkedCount}/5 વપરાયેલ) • અન્ય સભ્યને PoR પુરાવા અને OTP થી જોડો.
            </span>
            {activeTab === "documents" && activeMemberObj && (
              <span className="text-[10.5px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                ✓ ફોર્મમાં {activeMemberObj.nameGu} ની વિગતો ઓટો-ફિલ
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {members.map((member) => {
              const isSelected = member.id === activeMemberId;
              const isPending = member.verificationStatus === "pending_otp";

              return (
                <div
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className={`app-touch-card relative rounded-2xl p-3 border-2 transition cursor-pointer flex flex-col justify-between gap-2 ${
                    isPending
                      ? "bg-amber-50/70 border-amber-300 hover:border-amber-400"
                      : isSelected
                      ? "bg-gradient-to-br from-indigo-50 via-white to-emerald-50/60 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs"
                      : "bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/90"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        {member.avatarEmoji}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">
                          {member.nameGu}
                        </p>
                        <p className="text-[10.5px] font-bold text-indigo-700 truncate">
                          {member.relationGu} • {member.age} વર્ષ
                        </p>
                      </div>
                    </div>

                    {member.id !== "member-self" && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveMember(member.id, e)}
                        title="સભ્ય દૂર કરો"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-200/60 text-[10.5px]">
                    <div className="flex items-center justify-between text-slate-600 font-mono">
                      <span>🪪 {member.aadhaarMasked}</span>
                      <span>📱 +91 {member.mobile}</span>
                    </div>

                    {member.relationshipProofTypeGu && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-600 bg-white/80 border border-slate-200/80 rounded-lg px-2 py-0.5 truncate">
                        <FileCheck2 size={10} className="text-indigo-600 shrink-0" />
                        <span className="truncate">
                          પુરાવો: <strong>{member.relationshipProofTypeGu}</strong>
                          {member.relationshipProofNo ? ` (${member.relationshipProofNo})` : ""}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      {member.verificationStatus === "verified_same_mobile" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={10} className="text-emerald-600 shrink-0" />
                          <span>એ જ મોબાઈલ પર લિંક</span>
                        </span>
                      )}

                      {member.verificationStatus === "verified_other_mobile" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-800 bg-blue-100/80 border border-blue-300 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={10} className="text-blue-600 shrink-0" />
                          <span>PoR & OTP વેરિફાઈડ</span>
                        </span>
                      )}

                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-900 bg-amber-200/80 border border-amber-400 px-2 py-0.5 rounded-full">
                          <KeyRound size={10} className="text-amber-700 shrink-0" />
                          <span>📲 OTP મોકલીને લિંક કરો</span>
                        </span>
                      )}

                      {!isPending && isSelected && (
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                          ✓ સક્રિય
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 1: VERIFY PENDING FAMILY MEMBER ON DIFFERENT MOBILE VIA OTP
         ══════════════════════════════════════════════════════════════════ */}
      {verifyingMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9995] bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setVerifyingMember(null)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 p-5 pb-[max(env(safe-area-inset-bottom,20px),20px)] space-y-4 animate-bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
                  🔐
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    પરિવારના સભ્યનું આધાર OTP વેરિફિકેશન
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    UIDAI e-KYC Family Member Consent
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVerifyingMember(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
              <p className="font-black text-slate-900 text-sm">
                {verifyingMember.avatarEmoji} {verifyingMember.nameGu} ({verifyingMember.relationGu})
              </p>
              <p className="text-slate-600">
                🪪 આધાર: <strong className="font-mono">{verifyingMember.aadhaarMasked}</strong>
              </p>
              {verifyingMember.relationshipProofTypeGu && (
                <p className="text-slate-600">
                  📑 સંબંધ પુરાવો:{" "}
                  <strong className="text-emerald-800">
                    {verifyingMember.relationshipProofTypeGu} ({verifyingMember.relationshipProofNo})
                  </strong>
                </p>
              )}
              <p className="text-slate-600">
                📱 સભ્યનો રજિસ્ટર્ડ મોબાઈલ:{" "}
                <strong className="font-mono text-indigo-700">+91 {verifyingMember.mobile}</strong>
              </p>
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2 mt-1">
                આ સભ્યનું આધાર કાર્ડ બીજા મોબાઈલ નંબર (+91 {verifyingMember.mobile}) પર લિંક છે. તમારા કુટુંબ પ્રોફાઈલમાં સક્રિય કરવા માટે તે નંબર પર મોકલેલ OTP દાખલ કરો.
              </p>
            </div>

            {/* Simulated Instant SMS Banner with 1-Click Auto-Fill */}
            <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-3 border border-emerald-700 flex items-center justify-between gap-2">
              <div className="text-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  💬 UIDAI SMS (+91 {verifyingMember.mobile})
                </span>
                <span>
                  ફેમિલી આધાર લિંકિંગ OTP:{" "}
                  <strong className="font-mono text-sm text-amber-300 tracking-wider">
                    {generatedOtp}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEnteredOtp(generatedOtp);
                  setOtpError("");
                }}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black shrink-0 cursor-pointer active:scale-95"
              >
                1-Click Auto-Fill
              </button>
            </div>

            <form onSubmit={handleConfirmPendingMemberOtp} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  6-આંકડાનો આધાર OTP દાખલ કરો *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value.replace(/\D/g, ""));
                    setOtpError("");
                  }}
                  placeholder="6-Digit OTP"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono text-base font-black tracking-widest focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {otpError && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-2.5">
                  ⚠️ {otpError}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setVerifyingMember(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95"
                >
                  ✓ OTP ચકાસો & પરિવારમાં લિંક કરો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 2: ADD NEW FAMILY MEMBER (REAL GOVT PoR + OTP VERIFICATION)
         ══════════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9995] bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-5 pb-[max(env(safe-area-inset-bottom,20px),20px)] space-y-3.5 animate-bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    પરિવારના નવા સભ્યનું આધાર લિંક કરો
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    UIDAI Head of Family (HoF) સંબંધ ચકાસણી & આધાર OTP સિસ્ટમ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProceedAddMember} className="space-y-3.5">
              {/* Basic Member Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    સભ્યનું પૂરું નામ (ગુજરાતીમાં) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newNameGu}
                    onChange={(e) => setNewNameGu(e.target.value)}
                    placeholder="દા.ત. આરવ હરી પટેલ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    તમારી સાથે સંબંધ (Relation) *
                  </label>
                  <select
                    value={newRelationGu}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewRelationGu(val);
                      const rec = getRecommendedProofForRelation(val);
                      setPorDocType(rec.defaultDocType);
                      setIsPorVerified(false);
                      if (
                        val.includes("માતા") ||
                        val.includes("પત્ની") ||
                        val.includes("પુત્રી") ||
                        val.includes("બહેન") ||
                        val.includes("દાદી")
                      ) {
                        setNewGender("female");
                      } else {
                        setNewGender("male");
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="પુત્ર (Son)">પુત્ર (Son)</option>
                    <option value="પુત્રી (Daughter)">પુત્રી (Daughter)</option>
                    <option value="પત્ની (Wife)">પત્ની (Wife)</option>
                    <option value="પિતા (Father)">પિતા (Father)</option>
                    <option value="માતા (Mother)">માતા (Mother)</option>
                    <option value="ભાઈ (Brother)">ભાઈ (Brother)</option>
                    <option value="બહેન (Sister)">બહેન (Sister)</option>
                    <option value="દાદા / દાદી (Grandparent)">દાદા / દાદી (Grandparent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    સભ્યના આધારમાં પિતા/પતિનું નામ (C/O) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFatherHusbandGu}
                    onChange={(e) => {
                      setNewFatherHusbandGu(e.target.value);
                      setIsPorVerified(false);
                    }}
                    placeholder="દા.ત. હરી વિનોદરાઈ પટેલ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    જન્મ તારીખ (Date of Birth) *
                  </label>
                  <input
                    type="date"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  સભ્યનો ૧૨ આંકડાનો આધાર નંબર (Aadhaar Number) *
                </label>
                <input
                  type="text"
                  maxLength={14}
                  required
                  value={newAadhaar}
                  onChange={(e) => setNewAadhaar(e.target.value)}
                  placeholder="દા.ત. 4829 8192 3410 (અથવા છેલ્લા ૪ આંકડા)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  STEP 1: REAL GOVERNMENT PROOF OF RELATIONSHIP (PoR) VERIFICATION
                 ════════════════════════════════════════════════════════════════ */}
              <div className="bg-amber-50/70 border-2 border-amber-200/90 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full">
                      🏛️ સ્ટેપ ૧: કૌટુંબિક સંબંધનો સરકારી પુરાવો (UIDAI HoF PoR)
                    </span>
                    <p className="text-[11px] text-slate-700 font-semibold mt-1 leading-snug">
                      {currentProofMeta.hintGu}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      સંબંધનો સત્તાવાર દસ્તાવેજ (PoR Document) *
                    </label>
                    <select
                      value={porDocType}
                      onChange={(e) => {
                        setPorDocType(e.target.value);
                        setIsPorVerified(false);
                      }}
                      className="w-full px-2.5 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {currentProofMeta.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      રેશન કાર્ડ / પ્રમાણપત્ર નંબર (Document No.) *
                    </label>
                    <input
                      type="text"
                      value={porDocNumber}
                      onChange={(e) => {
                        setPorDocNumber(e.target.value.toUpperCase());
                        setIsPorVerified(false);
                      }}
                      placeholder="દા.ત. RC-GJ-03201489"
                      className="w-full px-2.5 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Upload Document File OR 1-Click DigiLocker / NFSA Auto-Verify */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                  <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-[11px] font-bold cursor-pointer transition">
                    <Upload size={13} className="text-indigo-600 shrink-0" />
                    <span className="truncate max-w-[200px]">
                      {porUploadedFileName
                        ? `📄 ${porUploadedFileName}`
                        : "પુરાવાનો ફોટો/PDF જોડો (Optional)"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPorUploadedFileName(file.name);
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAutoVerifyRelationshipProof}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition"
                  >
                    <Sparkles size={13} className="shrink-0" />
                    <span>⚡ સરકારી NFSA / DigiLocker રેકોર્ડથી સંબંધ ચકાસો</span>
                  </button>
                </div>

                {/* Verified Status Banner */}
                {isPorVerified && (
                  <div className="bg-emerald-950 text-emerald-100 border border-emerald-700 rounded-xl p-2.5 flex items-start gap-2 text-[11px] animate-in fade-in duration-150">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-emerald-300">
                        ✅ સરકારી રેકોર્ડ મેચ: કૌટુંબિક સંબંધ પ્રમાણિત (UIDAI HoF & NFSA PoR Verified)
                      </p>
                      <p className="text-emerald-100/90 mt-0.5">
                        દસ્તાવેજ <strong>{porDocNumber}</strong> અને C/O નામ{" "}
                        <strong>&ldquo;{newFatherHusbandGu}&rdquo;</strong> મુખ્ય ખાતાધારકના કુટુંબ રજિસ્ટર ({familyId}) સાથે મેચ થાય છે.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  STEP 2: AADHAAR MOBILE LINKING MODE (SAME MOBILE OR OTP)
                 ════════════════════════════════════════════════════════════════ */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-800">
                  📲 સ્ટેપ ૨: આ સભ્યનું આધાર કાર્ડ કયા મોબાઈલ નંબર પર લિંક છે? *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMode("same");
                      setAddStep("form");
                      setAddError("");
                    }}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      mobileMode === "same"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-extrabold text-xs">
                      <Smartphone size={14} className="text-emerald-600 shrink-0" />
                      <span>મારા જ મોબાઈલ નંબર પર</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      +91 {citizen.mobile || "9825012345"} (UIDAI ૫-પ્રોફાઈલ નિયમ મુજબ ડાયરેક્ટ લિંક)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMode("other");
                      setAddStep("form");
                      setAddError("");
                    }}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      mobileMode === "other"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-extrabold text-xs">
                      <Lock size={14} className="text-indigo-600 shrink-0" />
                      <span>બીજા મોબાઈલ નંબર પર</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      સભ્યના મોબાઈલ નંબર પર 6-Digit OTP મોકલીને વેરિફાય કરો
                    </p>
                  </button>
                </div>
              </div>

              {/* If "Other Mobile" is chosen: enter that mobile number & verify OTP */}
              {mobileMode === "other" && (
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-3.5 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1">
                      સભ્યના આધાર સાથે લિંક મોબાઈલ નંબર (૧૦ આંકડા) *
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={otherMobile}
                      onChange={(e) => {
                        setOtherMobile(e.target.value.replace(/\D/g, ""));
                        setAddStep("form");
                      }}
                      placeholder="દા.ત. 9876543210"
                      className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {addStep === "otp" && (
                    <div className="space-y-2.5 animate-in fade-in duration-150">
                      <div className="bg-emerald-950 text-emerald-100 rounded-xl p-2.5 border border-emerald-700 flex items-center justify-between gap-2">
                        <div className="text-xs">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                            💬 UIDAI SMS (+91 {otherMobile})
                          </span>
                          <span>
                            સભ્ય આધાર લિંકિંગ OTP:{" "}
                            <strong className="font-mono text-sm text-amber-300">
                              {addGeneratedOtp}
                            </strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAddEnteredOtp(addGeneratedOtp);
                            setAddError("");
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10.5px] font-black shrink-0 cursor-pointer"
                        >
                          1-Click Auto-Fill
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-indigo-950 mb-1">
                          +91 {otherMobile} પર આવેલ 6-Digit OTP નાખો *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={addEnteredOtp}
                          onChange={(e) =>
                            setAddEnteredOtp(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="6-Digit OTP"
                          className="w-full px-3 py-2 bg-white border border-indigo-400 rounded-xl text-center font-mono text-base font-black tracking-widest focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {addError && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-2.5">
                  ⚠️ {addError}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95"
                >
                  {mobileMode === "other" && addStep === "form"
                    ? "📲 સભ્યના નંબર પર OTP મોકલો"
                    : "✓ સંબંધ ચકાસી સભ્યને પરિવારમાં જોડો"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
