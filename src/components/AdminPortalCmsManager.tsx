"use client";

import { useState, useEffect, useMemo } from "react";
import { OfficerNode } from "@/lib/admin-hierarchy-data";
import { Scheme, SchemeCategory } from "@/types";
import { ExtendedOffice, getAllActiveOffices } from "@/lib/offices-data";
import { getAllActiveSchemes, CATEGORY_LABELS } from "@/lib/schemes-data";
import { GUJARAT_DISTRICTS } from "@/lib/large-datasets";
import {
  getPolicyConfigs,
  savePolicyConfig,
  ServicePolicyConfig,
} from "@/lib/admin-hierarchy-data";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  X,
  FileText,
  Building,
  Sliders,
  Sparkles,
  ShieldAlert,
  Loader2,
  Check,
  RefreshCw,
} from "lucide-react";

interface AdminPortalCmsManagerProps {
  currentOfficer: OfficerNode;
}

export default function AdminPortalCmsManager({ currentOfficer }: AdminPortalCmsManagerProps) {
  const [subTab, setSubTab] = useState<"schemes" | "offices" | "policy">("schemes");

  // Feedback Notification Banner
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4500);
  };

  // ══════════════════════════════════════════════════════════════
  // SECTION 1: SCHEMES CMS STATE & HANDLERS
  // ══════════════════════════════════════════════════════════════
  const [schemes, setSchemes] = useState<Scheme[]>(() => getAllActiveSchemes());
  const [schemeSearch, setSchemeSearch] = useState("");
  const [schemeCategoryFilter, setSchemeCategoryFilter] = useState("all");
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);
  const [isSavingScheme, setIsSavingScheme] = useState(false);

  // Scheme Form Fields
  const [formSchemeId, setFormSchemeId] = useState("");
  const [formSchemeNameGu, setFormSchemeNameGu] = useState("");
  const [formSchemeName, setFormSchemeName] = useState("");
  const [formSchemeCategory, setFormSchemeCategory] = useState<SchemeCategory>("agriculture");
  const [formSchemeIcon, setFormSchemeIcon] = useState("🌾");
  const [formSchemeMinistry, setFormSchemeMinistry] = useState("કૃષિ અને સહકાર વિભાગ, ગુજરાત સરકાર");
  const [formSchemeDesc, setFormSchemeDesc] = useState("");
  const [formSchemeBenefits, setFormSchemeBenefits] = useState("");
  const [formSchemeMinAge, setFormSchemeMinAge] = useState(18);
  const [formSchemeMaxAge, setFormSchemeMaxAge] = useState(99);
  const [formSchemeGender, setFormSchemeGender] = useState<"all" | "male" | "female">("all");
  const [formSchemeOccupation, setFormSchemeOccupation] = useState("farmer");
  const [formSchemeIncomeLimit, setFormSchemeIncomeLimit] = useState<number>(0);
  const [formSchemeDocuments, setFormSchemeDocuments] = useState("");
  const [formSchemeUrl, setFormSchemeUrl] = useState("");
  const [formSchemeActive, setFormSchemeActive] = useState(true);

  // Fetch live schemes from API
  const refreshSchemes = async () => {
    try {
      const res = await fetch("/api/schemes");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.schemes)) {
          setSchemes(data.schemes);
        }
      }
    } catch (e) {
      console.warn("Could not refresh schemes:", e);
    }
  };

  useEffect(() => {
    refreshSchemes();
  }, []);

  const openAddSchemeModal = () => {
    setEditingSchemeId(null);
    setFormSchemeId("");
    setFormSchemeNameGu("");
    setFormSchemeName("");
    setFormSchemeCategory("agriculture");
    setFormSchemeIcon("🌾");
    setFormSchemeMinistry("કૃષિ અને સહકાર વિભાગ, ગુજરાત સરકાર");
    setFormSchemeDesc("");
    setFormSchemeBenefits("₹6,000 પ્રતિ વર્ષ (૩ સમાન હપ્તા)\nસીધા બેંક ખાતામાં DBT મારફતે જમા\nસરળ ઓનલાઇન પોર્ટલ સુવિધા");
    setFormSchemeMinAge(18);
    setFormSchemeMaxAge(99);
    setFormSchemeGender("all");
    setFormSchemeOccupation("farmer");
    setFormSchemeIncomeLimit(0);
    setFormSchemeDocuments("આધાર કાર્ડ (Aadhaar Card)\nબેંક પાસબુક (Bank Passbook)\nજમીન ૭/૧૨ અને ૮-અ નકલ\nમોબાઈલ નંબર");
    setFormSchemeUrl("https://ikhedut.gujarat.gov.in");
    setFormSchemeActive(true);
    setIsSchemeModalOpen(true);
  };

  const openEditSchemeModal = (s: Scheme) => {
    setEditingSchemeId(s.id);
    setFormSchemeId(s.id);
    setFormSchemeNameGu(s.nameGu || "");
    setFormSchemeName(s.name || "");
    setFormSchemeCategory(s.category || "agriculture");
    setFormSchemeIcon(s.icon || "📋");
    setFormSchemeMinistry(s.ministry || "ગુજરાત સરકાર");
    setFormSchemeDesc(s.description || "");
    setFormSchemeBenefits((s.benefits || []).join("\n"));
    setFormSchemeMinAge(s.eligibility?.minAge || 18);
    setFormSchemeMaxAge(s.eligibility?.maxAge || 99);
    setFormSchemeGender(s.eligibility?.gender || "all");
    setFormSchemeOccupation((s.eligibility?.occupation || []).join(", ") || "farmer");
    setFormSchemeIncomeLimit(s.eligibility?.incomeLimit || 0);
    setFormSchemeDocuments((s.documents || []).join("\n"));
    setFormSchemeUrl(s.applicationUrl || "");
    setFormSchemeActive(s.isActive !== false);
    setIsSchemeModalOpen(true);
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSchemeNameGu.trim() || !formSchemeName.trim()) {
      alert("કૃપા કરીને યોજનાનું ગુજરાતી અને અંગ્રેજી નામ દાખલ કરો.");
      return;
    }

    setIsSavingScheme(true);

    const cleanId = formSchemeId.trim() ||
      formSchemeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const benefitsArray = formSchemeBenefits
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    const docsArray = formSchemeDocuments
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const occupationsArray = formSchemeOccupation
      .split(/[,;\n]/)
      .map((o) => o.trim())
      .filter(Boolean);

    const newScheme: Scheme = {
      id: cleanId,
      name: formSchemeName.trim(),
      nameGu: formSchemeNameGu.trim(),
      nameHi: formSchemeName.trim(),
      category: formSchemeCategory,
      icon: formSchemeIcon.trim() || "📋",
      ministry: formSchemeMinistry.trim(),
      description: formSchemeDesc.trim(),
      benefits: benefitsArray.length > 0 ? benefitsArray : ["રાજ્ય સરકાર દ્વારા નિયત સહાય"],
      eligibility: {
        minAge: Number(formSchemeMinAge) || 18,
        maxAge: Number(formSchemeMaxAge) || 99,
        gender: formSchemeGender,
        occupation: occupationsArray.length > 0 ? occupationsArray : ["all"],
        incomeLimit: formSchemeIncomeLimit ? Number(formSchemeIncomeLimit) : undefined,
      },
      documents: docsArray.length > 0 ? docsArray : ["આધાર કાર્ડ (Aadhaar Card)"],
      applicationUrl: formSchemeUrl.trim(),
      isActive: formSchemeActive,
    };

    try {
      const res = await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newScheme),
      });

      if (res.ok) {
        // Update local list
        setSchemes((prev) => {
          const idx = prev.findIndex((s) => s.id === cleanId);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = newScheme;
            return updated;
          }
          return [newScheme, ...prev];
        });

        // Broadcast cross-tab sync
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("nagrik_schemes_updated"));
          localStorage.setItem("nagrik_last_scheme_sync", Date.now().toString());
        }

        showFeedback(`યોજના "${newScheme.nameGu}" સફળતાપૂર્વક સાચવવામાં આવી છે અને Firestore માં સિંક થઈ ગઈ છે!`);
        setIsSchemeModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "યોજના સાચવવામાં ક્ષતિ આવી.");
      }
    } catch (err) {
      console.error("Save scheme error:", err);
      alert("સર્વર સાથે સંપર્ક થઈ શક્યો નહીં.");
    } finally {
      setIsSavingScheme(false);
    }
  };

  const handleDeleteScheme = async (id: string, nameGu: string) => {
    if (!confirm(`શું તમે ખરેખર "${nameGu}" યોજના રદ (Delete) કરવા માંગો છો?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/schemes?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSchemes((prev) => prev.filter((s) => s.id !== id));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("nagrik_schemes_updated"));
        }
        showFeedback(`યોજના "${nameGu}" સફળતાપૂર્વક રદ કરવામાં આવી છે.`);
      } else {
        alert("યોજના રદ કરવામાં ક્ષતિ આવી.");
      }
    } catch (e) {
      console.error("Delete scheme error:", e);
      alert("યોજના રદ કરવામાં ક્ષતિ આવી.");
    }
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchCat = schemeCategoryFilter === "all" || s.category === schemeCategoryFilter;
      const q = schemeSearch.toLowerCase();
      const matchSearch =
        !schemeSearch ||
        s.name.toLowerCase().includes(q) ||
        (s.nameGu && s.nameGu.includes(schemeSearch)) ||
        s.description.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [schemes, schemeCategoryFilter, schemeSearch]);

  // ══════════════════════════════════════════════════════════════
  // SECTION 2: OFFICES / KACHERI CMS STATE & HANDLERS
  // ══════════════════════════════════════════════════════════════
  const [offices, setOffices] = useState<ExtendedOffice[]>(() => getAllActiveOffices());
  const [officeSearch, setOfficeSearch] = useState("");
  const [officeDistrictFilter, setOfficeDistrictFilter] = useState("All");
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [editingOfficeId, setEditingOfficeId] = useState<string | null>(null);
  const [isSavingOffice, setIsSavingOffice] = useState(false);

  // Office Form Fields
  const [formOfficeId, setFormOfficeId] = useState("");
  const [formOfficeNameGu, setFormOfficeNameGu] = useState("");
  const [formOfficeName, setFormOfficeName] = useState("");
  const [formOfficeDistrict, setFormOfficeDistrict] = useState("Rajkot");
  const [formOfficeTaluka, setFormOfficeTaluka] = useState("Gondal");
  const [formOfficeCategory, setFormOfficeCategory] = useState<"jan-seva" | "mamlatdar" | "collector" | "panchayat">("jan-seva");
  const [formOfficeAddress, setFormOfficeAddress] = useState("");
  const [formOfficePincode, setFormOfficePincode] = useState("360311");
  const [formOfficePhone, setFormOfficePhone] = useState("02825-220032");
  const [formOfficeTimings, setFormOfficeTimings] = useState("૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)");
  const [formOfficeServices, setFormOfficeServices] = useState("");

  const refreshOffices = async () => {
    try {
      const res = await fetch("/api/offices");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.offices)) {
          setOffices(data.offices);
        }
      }
    } catch (e) {
      console.warn("Could not refresh offices:", e);
    }
  };

  useEffect(() => {
    refreshOffices();
  }, []);

  const openAddOfficeModal = () => {
    setEditingOfficeId(null);
    setFormOfficeId("");
    setFormOfficeNameGu("");
    setFormOfficeName("");
    setFormOfficeDistrict("Rajkot");
    setFormOfficeTaluka("Gondal");
    setFormOfficeCategory("jan-seva");
    setFormOfficeAddress("તાલુકા સેવા સદન કમ્પાઉન્ડ, ગોંડલ");
    setFormOfficePincode("360311");
    setFormOfficePhone("1800-233-5500");
    setFormOfficeTimings("૧૦:૩૦ AM - ૦૬:૧૦ PM (સોમ થી શનિ)");
    setFormOfficeServices("આવકનો દાખલો (Income Certificate)\nજાતિ & નોન-ક્રીમીલેયર પ્રમાણપત્ર\nરેશનકાર્ડ સેવાઓ & નવું નામ ઉમેરો\nડિજિટલ ગુજરાત સેવાઓ\nજન સેવા કેન્દ્ર રોકડ ચલણ & e-Sign");
    setIsOfficeModalOpen(true);
  };

  const openEditOfficeModal = (o: ExtendedOffice) => {
    setEditingOfficeId(o.id);
    setFormOfficeId(o.id);
    setFormOfficeNameGu(o.nameGu || o.name);
    setFormOfficeName(o.name);
    setFormOfficeDistrict(o.district);
    setFormOfficeTaluka(o.taluka || "");
    setFormOfficeCategory(o.category as unknown as "jan-seva" | "mamlatdar" | "collector" | "panchayat");
    setFormOfficeAddress(o.address || "");
    setFormOfficePincode(o.pincode || "360001");
    setFormOfficePhone(o.phone || "1800-233-5500");
    setFormOfficeTimings(o.timings || "૧૦:૩૦ AM - ૦૫:૩૦ PM");
    setFormOfficeServices((o.services || []).join("\n"));
    setIsOfficeModalOpen(true);
  };

  const handleSaveOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOfficeNameGu.trim() || !formOfficeName.trim()) {
      alert("કૃપા કરીને કચેરીનું નામ દાખલ કરો.");
      return;
    }

    setIsSavingOffice(true);

    const cleanId = formOfficeId.trim() ||
      `${formOfficeDistrict.toLowerCase()}-${formOfficeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    const servicesArray = formOfficeServices
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const newOffice: ExtendedOffice = {
      id: cleanId,
      name: formOfficeName.trim(),
      nameGu: formOfficeNameGu.trim(),
      type: "Jan Seva Kendra & Government Office",
      district: formOfficeDistrict.trim(),
      taluka: formOfficeTaluka.trim(),
      category: formOfficeCategory,
      address: formOfficeAddress.trim(),
      city: formOfficeTaluka.trim() || formOfficeDistrict.trim(),
      state: "Gujarat",
      pincode: formOfficePincode.trim(),
      phone: formOfficePhone.trim(),
      timings: formOfficeTimings.trim(),
      services: servicesArray.length > 0 ? servicesArray : ["જન સેવા કેન્દ્ર સેવાઓ"],
      mapQuery: `${formOfficeName}+${formOfficeDistrict}+Gujarat`,
      lat: 22.3039,
      lng: 70.8022,
      crowdLevel: "medium",
      estimatedWaitMins: 15,
    };

    try {
      const res = await fetch("/api/offices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOffice),
      });

      if (res.ok) {
        setOffices((prev) => {
          const idx = prev.findIndex((o) => o.id === cleanId);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = newOffice;
            return updated;
          }
          return [newOffice, ...prev];
        });

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("nagrik_offices_updated"));
        }

        showFeedback(`કચેરી "${newOffice.nameGu}" સફળતાપૂર્વક સાચવવામાં આવી છે અને Firestore માં સિંક થઈ ગઈ છે!`);
        setIsOfficeModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "કચેરી સાચવવામાં ક્ષતિ આવી.");
      }
    } catch (err) {
      console.error("Save office error:", err);
      alert("સર્વર સાથે સંપર્ક થઈ શક્યો નહીં.");
    } finally {
      setIsSavingOffice(false);
    }
  };

  const handleDeleteOffice = async (id: string, nameGu: string) => {
    if (!confirm(`શું તમે ખરેખર "${nameGu}" કચેરી રદ (Delete) કરવા માંગો છો?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/offices?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOffices((prev) => prev.filter((o) => o.id !== id));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("nagrik_offices_updated"));
        }
        showFeedback(`કચેરી "${nameGu}" સફળતાપૂર્વક રદ કરવામાં આવી છે.`);
      } else {
        alert("કચેરી રદ કરવામાં ક્ષતિ આવી.");
      }
    } catch (e) {
      console.error("Delete office error:", e);
      alert("કચેરી રદ કરવામાં ક્ષતિ આવી.");
    }
  };

  const filteredOffices = useMemo(() => {
    return offices.filter((o) => {
      const matchDist =
        officeDistrictFilter === "All" || o.district.toLowerCase() === officeDistrictFilter.toLowerCase();
      const q = officeSearch.toLowerCase();
      const matchSearch =
        !officeSearch ||
        o.name.toLowerCase().includes(q) ||
        (o.nameGu && o.nameGu.includes(officeSearch)) ||
        o.address.toLowerCase().includes(q) ||
        (o.taluka && o.taluka.toLowerCase().includes(q)) ||
        o.services.some((s) => s.toLowerCase().includes(q) || s.includes(officeSearch));
      return matchDist && matchSearch;
    });
  }, [offices, officeDistrictFilter, officeSearch]);

  // ══════════════════════════════════════════════════════════════
  // SECTION 3: SLA & FEE POLICY STATE & HANDLERS
  // ══════════════════════════════════════════════════════════════
  const [policyConfigs, setPolicyConfigs] = useState<Record<string, ServicePolicyConfig>>(() => getPolicyConfigs());
  const [selectedPolicyKey, setSelectedPolicyKey] = useState<string>("income-certificate");

  const handleSavePolicy = (cfg: ServicePolicyConfig) => {
    const updated = { ...cfg, serviceId: selectedPolicyKey };
    savePolicyConfig(updated);
    setPolicyConfigs(getPolicyConfigs());
    showFeedback(`સેવા "${cfg.serviceNameGu}" ની ફી અને SLA પોલિસી સફળતાપૂર્વક અપડેટ થઈ ગઈ!`);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-5">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              🏛️ ગુજરાત સચિવાલય - સત્તાવાર પોર્ટલ & પોલિસી CMS
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
              {currentOfficer.designation}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            નવી સરકારી કલ્યાણકારી યોજનાઓ, જન સેવા કેન્દ્રો અને પ્રમાણપત્ર નિયમો સીધા Google Cloud Firestore ડેટાબેઝમાં લાઈવ સેવ કરો.
          </p>
        </div>

        {/* Global Feedback Alert */}
        {feedback && (
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in duration-200 ${
              feedback.type === "success"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-rose-100 text-rose-800 border border-rose-300"
            }`}
          >
            <CheckCircle2 size={14} className="shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}
      </div>

      {/* ── Top Sub-Tab Navigation Bar ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setSubTab("schemes")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            subTab === "schemes"
              ? "bg-orange-500 text-white shadow-sm ring-1 ring-orange-600"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Sparkles size={14} />
          <span>૧. સરકારી યોજનાઓ ({schemes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("offices")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            subTab === "offices"
              ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Building size={14} />
          <span>૨. કચેરી & જન સેવા કેન્દ્ર ({offices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("policy")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            subTab === "policy"
              ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Sliders size={14} />
          <span>૩. પ્રમાણપત્ર SLA & ફી પોલિસી</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SUB-TAB 1: SCHEMES CMS
          ══════════════════════════════════════════════════════════════ */}
      {subTab === "schemes" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Action Row: Launch Button + Search + Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={schemeSearch}
                  onChange={(e) => setSchemeSearch(e.target.value)}
                  placeholder="યોજના શોધો (Search schemes by title or dept)..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <select
                value={schemeCategoryFilter}
                onChange={(e) => setSchemeCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden"
              >
                <option value="all">તમામ કેટેગરી (All)</option>
                {Object.keys(CATEGORY_LABELS).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat].labelGu}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={openAddSchemeModal}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus size={15} />
              <span>➕ નવી સરકારી યોજના બહાર પાડો (Launch Scheme)</span>
            </button>
          </div>

          {/* Schemes Count & Status Strip */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1">
            <span>કુલ ઉપલબ્ધ સરકારી યોજનાઓ: {filteredSchemes.length}</span>
            <span className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={12} /> Google Cloud Firestore લાઈવ સિંક
            </span>
          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-slate-50 border border-slate-200/90 hover:border-orange-300 rounded-2xl p-3.5 flex flex-col justify-between transition shadow-2xs group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="w-8 h-8 rounded-xl bg-orange-100/70 border border-orange-200 text-lg flex items-center justify-center shrink-0">
                      {scheme.icon || "📋"}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {CATEGORY_LABELS[scheme.category]?.labelGu || scheme.category}
                      </span>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                          scheme.isActive !== false
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {scheme.isActive !== false ? "સક્રિય" : "બંધ"}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-black text-slate-900 text-xs line-clamp-1 group-hover:text-orange-600 transition">
                    {scheme.nameGu}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mb-1.5">
                    {scheme.name}
                  </p>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2">
                    {scheme.description || "કોઈ પરિચય ઉપલબ્ધ નથી."}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1 bg-white p-2 rounded-xl border border-slate-200/60 text-[10.5px]">
                    <div className="text-amber-900 font-bold line-clamp-1">
                      ✨ {scheme.benefits?.[0] || "સરકારી સહાય"}
                    </div>
                    <div className="text-slate-500 font-medium flex items-center justify-between">
                      <span>📋 {scheme.documents?.length || 0} જરૂરી પુરાવા</span>
                      <span>ઉંમર: {scheme.eligibility?.minAge || 18}-{scheme.eligibility?.maxAge || 99}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200/80 gap-1.5 text-xs">
                  <a
                    href={`/schemes/${scheme.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                    title="નાગરિક વ્યુ પૂર્વાવલોકન"
                  >
                    <span>પોર્ટલ લિંક</span>
                    <ExternalLink size={11} />
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditSchemeModal(scheme)}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      title="યોજના સુધારો"
                    >
                      <Edit2 size={11} />
                      <span>સુધારો</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteScheme(scheme.id, scheme.nameGu)}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      title="યોજના રદ કરો"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SUB-TAB 2: OFFICES / KACHERI CMS
          ══════════════════════════════════════════════════════════════ */}
      {subTab === "offices" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Action Row: Add Office + Search + District Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={officeSearch}
                  onChange={(e) => setOfficeSearch(e.target.value)}
                  placeholder="કચેરી શોધો (Search by name or services)..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <select
                value={officeDistrictFilter}
                onChange={(e) => setOfficeDistrictFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden"
              >
                <option value="All">તમામ ૩૩ જિલ્લા (All)</option>
                {GUJARAT_DISTRICTS.map((d) => (
                  <option key={d.en} value={d.en}>
                    {d.gu} ({d.en})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={openAddOfficeModal}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus size={15} />
              <span>➕ નવી કચેરી / જન સેવા કેન્દ્ર ઉમેરો (Add Office)</span>
            </button>
          </div>

          {/* Offices List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredOffices.map((office) => (
              <div
                key={office.id}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between transition shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5 mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {office.district} {office.taluka ? `• ${office.taluka}` : ""}
                    </span>
                    <span className="text-[9.5px] font-bold text-slate-500 capitalize">
                      {office.category}
                    </span>
                  </div>

                  <h4 className="font-black text-slate-900 text-xs line-clamp-1 mt-1">
                    {office.nameGu || office.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 line-clamp-1">
                    {office.name}
                  </p>

                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1.5">
                    📍 {office.address}
                  </p>

                  <div className="mt-2 bg-white p-2 rounded-xl border border-slate-200/60 text-[10.5px] space-y-0.5 text-slate-700">
                    <div>🕒 {office.timings || "૧૦:૩૦ AM - ૦૫:૩૦ PM"}</div>
                    <div>📞 {office.phone || "1800-233-5500"}</div>
                    <div className="text-[10px] text-slate-500 truncate">
                      🛠️ {office.services?.slice(0, 3).join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200/80 gap-1.5 text-xs">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(office.mapQuery || office.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>નકશો (Map)</span>
                    <ExternalLink size={11} />
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditOfficeModal(office)}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={11} />
                      <span>સુધારો</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOffice(office.id, office.nameGu || office.name)}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SUB-TAB 3: SLA & FEE POLICY
          ══════════════════════════════════════════════════════════════ */}
      {subTab === "policy" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Service Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Object.keys(policyConfigs).map((key) => {
              const cfg = policyConfigs[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPolicyKey(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    selectedPolicyKey === key
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <span>{cfg.serviceNameGu}</span>
                </button>
              );
            })}
          </div>

          {/* Policy Editor Form */}
          {policyConfigs[selectedPolicyKey] && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Official Fee */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    સરકારી ફી (₹ Government Fee)
                  </label>
                  <input
                    type="number"
                    value={policyConfigs[selectedPolicyKey].officialFee}
                    onChange={(e) =>
                      setPolicyConfigs((prev) => ({
                        ...prev,
                        [selectedPolicyKey]: {
                          ...prev[selectedPolicyKey],
                          officialFee: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* SLA Days */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    GRTSA કાનૂની નિકાલ દિવસો (SLA Days)
                  </label>
                  <input
                    type="number"
                    value={policyConfigs[selectedPolicyKey].slaDays}
                    onChange={(e) =>
                      setPolicyConfigs((prev) => ({
                        ...prev,
                        [selectedPolicyKey]: {
                          ...prev[selectedPolicyKey],
                          slaDays: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* 15-Minute SLA Alert */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    AI બોટલનેક એલર્ટ મર્યાદા (મિનિટ)
                  </label>
                  <input
                    type="number"
                    value={policyConfigs[selectedPolicyKey].slaAlertMinutes}
                    onChange={(e) =>
                      setPolicyConfigs((prev) => ({
                        ...prev,
                        [selectedPolicyKey]: {
                          ...prev[selectedPolicyKey],
                          slaAlertMinutes: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Mandatory Documents List */}
              <div className="text-xs space-y-1.5">
                <label className="block font-bold text-slate-700">
                  ફરજિયાત દસ્તાવેજો (Mandatory Checklist)
                </label>
                <div className="space-y-1">
                  {policyConfigs[selectedPolicyKey].mandatoryDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200"
                    >
                      <span className="font-bold text-slate-800">{doc}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        ફરજિયાત
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSavePolicy(policyConfigs[selectedPolicyKey])}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>પોલિસી સેવ કરો</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT WELFARE SCHEME
          ══════════════════════════════════════════════════════════════ */}
      {isSchemeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setIsSchemeModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-300 text-slate-900 p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {editingSchemeId ? "સરકારી યોજનામાં સુધારો કરો (Edit Scheme)" : "નવી સરકારી યોજના બહાર પાડો (Launch Welfare Scheme)"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    સીધું ગુજરાત સરકાર Google Cloud Firestore માં લાઈવ પબ્લિશ થશે.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSchemeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveScheme} className="space-y-3.5 text-xs">
              {/* Row 1: Gujarati Name & English Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    યોજનાનું ગુજરાતી નામ (Name in Gujarati) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSchemeNameGu}
                    onChange={(e) => setFormSchemeNameGu(e.target.value)}
                    placeholder="દા.ત. PM કિસાન સન્માન નિધિ"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    અંગ્રેજી નામ (Name in English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSchemeName}
                    onChange={(e) => setFormSchemeName(e.target.value)}
                    placeholder="e.g. PM Kisan Samman Nidhi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Row 2: Category, Emoji Icon, Scheme ID (Slug) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    કેટેગરી (Category) *
                  </label>
                  <select
                    value={formSchemeCategory}
                    onChange={(e) => setFormSchemeCategory(e.target.value as SchemeCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                  >
                    {Object.keys(CATEGORY_LABELS).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat].labelGu}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    આઇકન / ઈમોજી (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formSchemeIcon}
                    onChange={(e) => setFormSchemeIcon(e.target.value)}
                    placeholder="🌾, 🚜, 🏥, 🏠..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-center text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    આઈડી / સ્લગ (Unique ID)
                  </label>
                  <input
                    type="text"
                    value={formSchemeId}
                    onChange={(e) => setFormSchemeId(e.target.value)}
                    placeholder="દા.ત. pm-kisan (ઓટોમેટિક)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Ministry / Department */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  મંત્રાલય / વિભાગ (Department / Ministry)
                </label>
                <input
                  type="text"
                  value={formSchemeMinistry}
                  onChange={(e) => setFormSchemeMinistry(e.target.value)}
                  placeholder="દા.ત. કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  યોજનાનો પરિચય / વિગત (Overview & Description)
                </label>
                <textarea
                  rows={2}
                  value={formSchemeDesc}
                  onChange={(e) => setFormSchemeDesc(e.target.value)}
                  placeholder="આ યોજનાનો મુખ્ય ઉદ્દેશ્ય અને વિગતો અહીં લખો..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Benefits (multi-line) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  મળવાપાત્ર મુખ્ય લાભો (Benefits - દર લાઈન પર ૧ લાભ લખો)
                </label>
                <textarea
                  rows={3}
                  value={formSchemeBenefits}
                  onChange={(e) => setFormSchemeBenefits(e.target.value)}
                  placeholder="₹6,000 પ્રતિ વર્ષ (વાર્ષિક સહાય)&#10;સીધા બેંક ખાતામાં DBT મારફતે જમા&#10;સરકારી રાહત દર..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500 font-mono text-[11px]"
                />
              </div>

              {/* Eligibility Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    લઘુત્તમ ઉંમર (Min Age)
                  </label>
                  <input
                    type="number"
                    value={formSchemeMinAge}
                    onChange={(e) => setFormSchemeMinAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-1.5 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    મહત્તમ ઉંમર (Max Age)
                  </label>
                  <input
                    type="number"
                    value={formSchemeMaxAge}
                    onChange={(e) => setFormSchemeMaxAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-1.5 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    લિંગ (Gender)
                  </label>
                  <select
                    value={formSchemeGender}
                    onChange={(e) => setFormSchemeGender(e.target.value as "all" | "male" | "female")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-1.5 font-bold"
                  >
                    <option value="all">તમામ (All)</option>
                    <option value="male">પુરુષ (Male)</option>
                    <option value="female">મહિલા (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    આવક મર્યાદા (₹ Limit)
                  </label>
                  <input
                    type="number"
                    value={formSchemeIncomeLimit}
                    onChange={(e) => setFormSchemeIncomeLimit(Number(e.target.value))}
                    placeholder="0 = કોઈ મર્યાદા નહિ"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-1.5 text-center font-bold"
                  />
                </div>
              </div>

              {/* Required Documents (multi-line) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  અરજી માટે જરૂરી સરકારી દસ્તાવેજો (Documents - દર લાઈન પર ૧ પુરાવો)
                </label>
                <textarea
                  rows={3}
                  value={formSchemeDocuments}
                  onChange={(e) => setFormSchemeDocuments(e.target.value)}
                  placeholder="આધાર કાર્ડ (Aadhaar Card)&#10;બેંક પાસબુક (Bank Passbook)&#10;૭/૧૨ અને ૮-અ નકલ&#10;રેશનકાર્ડ"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500 font-mono text-[11px]"
                />
              </div>

              {/* Application Portal URL & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    સત્તાવાર અરજી પોર્ટલ લિંક (Online Application URL)
                  </label>
                  <input
                    type="url"
                    value={formSchemeUrl}
                    onChange={(e) => setFormSchemeUrl(e.target.value)}
                    placeholder="https://ikhedut.gujarat.gov.in"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono text-slate-900"
                  />
                </div>
                <div className="pt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="schemeActiveChk"
                    checked={formSchemeActive}
                    onChange={(e) => setFormSchemeActive(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="schemeActiveChk" className="font-bold text-slate-800 cursor-pointer select-none">
                    સત્તાવાર યોજના સક્રિય (Active)
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSchemeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  રદ કરો (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSavingScheme}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingScheme ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>સેવ થઈ રહ્યું છે...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingSchemeId ? "ફેરફારો સેવ કરો (Update)" : "સરકારી ડેટાબેઝમાં પબ્લિશ કરો (Publish)"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT GOVERNMENT OFFICE (KACHERI)
          ══════════════════════════════════════════════════════════════ */}
      {isOfficeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setIsOfficeModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-300 text-slate-900 p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏛️</span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {editingOfficeId ? "કચેરી વિગત સુધારો (Edit Office)" : "નવી કચેરી / જન સેવા કેન્દ્ર ઉમેરો (Add Office)"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    સમગ્ર ગુજરાતના નાગરિકો માટે Kacheri Locator માં તાત્કાલિક લાઈવ થશે.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOfficeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveOffice} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    કચેરીનું નામ ગુજરાતી *
                  </label>
                  <input
                    type="text"
                    required
                    value={formOfficeNameGu}
                    onChange={(e) => setFormOfficeNameGu(e.target.value)}
                    placeholder="દા.ત. તાલુકા સેવા સદન & મામલતદાર કચેરી"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Name in English *
                  </label>
                  <input
                    type="text"
                    required
                    value={formOfficeName}
                    onChange={(e) => setFormOfficeName(e.target.value)}
                    placeholder="e.g. Taluka Seva Sadan, Gondal"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    જિલ્લો (District) *
                  </label>
                  <select
                    value={formOfficeDistrict}
                    onChange={(e) => setFormOfficeDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900"
                  >
                    {GUJARAT_DISTRICTS.map((d) => (
                      <option key={d.en} value={d.en}>
                        {d.gu} ({d.en})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    તાલુકો (Taluka)
                  </label>
                  <input
                    type="text"
                    value={formOfficeTaluka}
                    onChange={(e) => setFormOfficeTaluka(e.target.value)}
                    placeholder="દા.ત. Gondal"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    કેટેગરી (Type)
                  </label>
                  <select
                    value={formOfficeCategory}
                    onChange={(e) => setFormOfficeCategory(e.target.value as "jan-seva" | "mamlatdar" | "collector" | "panchayat")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900"
                  >
                    <option value="jan-seva">જન સેવા કેન્દ્ર (Jan Seva)</option>
                    <option value="mamlatdar">મામલતદાર કચેરી (Mamlatdar)</option>
                    <option value="collector">કલેક્ટર કચેરી (Collectorate)</option>
                    <option value="panchayat">ગ્રામ પંચાયત (Gram Panchayat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  સરનામું (Address)
                </label>
                <input
                  type="text"
                  value={formOfficeAddress}
                  onChange={(e) => setFormOfficeAddress(e.target.value)}
                  placeholder="દા.ત. સ્ટેશન રોડ, સર્કિટ હાઉસ સામે, ગોંડલ"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    પિનકોડ (Pincode)
                  </label>
                  <input
                    type="text"
                    value={formOfficePincode}
                    onChange={(e) => setFormOfficePincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ફોન / હેલ્પલાઇન (Phone)
                  </label>
                  <input
                    type="text"
                    value={formOfficePhone}
                    onChange={(e) => setFormOfficePhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    કચેરી સમય (Timings)
                  </label>
                  <input
                    type="text"
                    value={formOfficeTimings}
                    onChange={(e) => setFormOfficeTimings(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ઉપલબ્ધ સેવાઓ (Services List - દર લાઈન પર ૧ સેવા)
                </label>
                <textarea
                  rows={3}
                  value={formOfficeServices}
                  onChange={(e) => setFormOfficeServices(e.target.value)}
                  placeholder="આવકનો દાખલો (Income Certificate)&#10;જાતિનો દાખલો (Caste Certificate)&#10;રેશનકાર્ડ સુધારો..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsOfficeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  disabled={isSavingOffice}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingOffice ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>સેવ થઈ રહ્યું છે...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>કચેરી સેવ કરો (Save to Firestore)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
