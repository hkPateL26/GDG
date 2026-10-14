// =========================================================================
// NagrikSeva AI - Comprehensive Government Schemes Database (Gujarat & India)
// 26 Major Welfare Schemes across Agriculture, Health, Housing, Education,
// Women & Child, Business, Social Security, and Clean Energy.
// =========================================================================

import { Scheme } from "@/types";

export const SCHEMES_DATA: Scheme[] = [
  // ── 1. AGRICULTURE ──
  {
    id: "pm-kisan",
    officialSlaDays: 30,
    planningEstimateDays: "5-7 દિવસ",
    implementingAuthority: "PM-Kisan Portal / કૃષિ મંત્રાલય",
    targetBeneficiary: "ખેતીની જમીન ધરાવતા તમામ ખેડૂત પરિવારો",
    name: "PM Kisan Samman Nidhi",
    nameGu: "PM કિસાન સન્માન નિધિ (ખેડૂત સહાય)",
    nameHi: "PM किसान सम्मान निधि",
    category: "agriculture",
    description: "Financial support of ₹6,000/year to all farmer families having cultivable land in 3 direct bank installments.",
    benefits: [
      "₹6,000 પ્રતિ વર્ષ (₹2,000 ના ૩ સમાન હપ્તા)",
      "સીધા બેંક ખાતામાં DBT મારફતે જમા",
      "તમામ સીમાંત અને નાના ખેડૂત પરિવારો પાત્ર",
    ],
    eligibility: { occupation: ["farmer"], maxAge: 99, minAge: 18, gender: "all" },
    documents: ["આધાર કાર્ડ (Aadhaar Card)", "બેંક પાસબુક (Bank Passbook)", "જમીન દસ્તાવેજ ૭/૧૨ અને ૮-અ (7/12 & 8A)", "મોબાઈલ નંબર"],
    applicationUrl: "https://pmkisan.gov.in",
    icon: "🌾",
    ministry: "કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય (Ministry of Agriculture)",
    isActive: true,
  },
  {
    id: "fasal-bima",
    officialSlaDays: 45,
    planningEstimateDays: "10-15 દિવસ",
    implementingAuthority: "PMFBY Portal / કૃષિ વિભાગ",
    targetBeneficiary: "નોંધાયેલા પાક વાવેતર કરતા ખેડૂતો",
    name: "PM Fasal Bima Yojana",
    nameGu: "PM ફસલ વીમા યોજના (પાક વીમો)",
    nameHi: "PM फसल बीमा योजना",
    category: "agriculture",
    description: "Comprehensive financial support and crop insurance protection against non-preventable natural calamities.",
    benefits: [
      "ખરીફ પાક માટે માત્ર ૨% પ્રીમિયમ અને રવી પાક માટે ૧.૫% પ્રીમિયમ",
      "દુષ્કાળ, પૂર કે કમોસમી વરસાદ સામે ૧૦૦% વીમા કવચ",
      "દાવાની રકમ સીધી બેંક ખાતામાં જમા",
    ],
    eligibility: { occupation: ["farmer"], minAge: 18, maxAge: 99, gender: "all" },
    documents: ["આધાર કાર્ડ", "૭/૧૨, ૮-અ જમીન નકલ", "વાવેતર પ્રમાણપત્ર (તલાટી)", "બેંક પાસબુક રદ કરેલ ચેક"],
    applicationUrl: "https://pmfby.gov.in",
    icon: "🌱",
    ministry: "કૃષિ મંત્રાલય અને રાજ્ય સહકાર વિભાગ",
    isActive: true,
  },
  {
    id: "kisan-credit-card",
    officialSlaDays: 14,
    planningEstimateDays: "3-5 દિવસ",
    implementingAuthority: "રાષ્ટ્રીયકૃત & સહકારી બેંકો / નાબાર્ડ",
    targetBeneficiary: "ખેતી અને આનુષાંગિક પ્રવૃત્તિ કરતા ખેડૂતો",
    name: "Kisan Credit Card (KCC)",
    nameGu: "કિસાન ક્રેડિટ કાર્ડ (KCC સબસિડી લોન)",
    nameHi: "किसान क्रेडिट कार्ड योजना",
    category: "agriculture",
    description: "Concessional credit for agriculture and allied activities with interest subvention up to ₹3 Lakhs.",
    benefits: [
      "₹૩ લાખ સુધી માત્ર ૪% રાહત દરે ખેતી ધિરાણ",
      "કોઈપણ પ્રકારની વધારાની જામીનગીરી વિના સરળ લોન",
      "એટીએમ સાથે કિસાન ક્રેડિટ કાર્ડ સુવિધા",
    ],
    eligibility: { occupation: ["farmer"], minAge: 18, maxAge: 75, gender: "all" },
    documents: ["આધાર કાર્ડ", "૭/૧૨ ૮-અ નકલ", "તાજેતરનો પાસપોર્ટ ફોટો", "પાક વાવેતર વિગત"],
    applicationUrl: "https://agricoop.nic.in",
    icon: "💳",
    ministry: "નાણાં મંત્રાલય અને નાબાર્ડ (NABARD)",
    isActive: true,
  },
  {
    id: "khedut-sat-pagla",
    officialSlaDays: 30,
    planningEstimateDays: "7-10 દિવસ",
    implementingAuthority: "i-Khedut Portal / ગુજરાત સરકાર",
    targetBeneficiary: "ગુજરાતના નાના અને સીમાંત ખેડૂતો",
    name: "Sat Pagla Khedut Kalyan Gujarat",
    nameGu: "સાત પગલાં ખેડૂત કલ્યાણ (ગુજરાત સરકાર)",
    nameHi: "सात पगला खेड़ूत कल्याण योजना",
    category: "agriculture",
    description: "Comprehensive Gujarat Government farmer welfare package including cow maintenance subsidy and small godown grant.",
    benefits: [
      "દેશી ગાય આધારિત પ્રાકૃતિક ખેતી માટે ₹૯૦૦ પ્રતિ માસ (વાર્ષિક ₹૧૦,૮૦૦)",
      "ખેતર પર નાના ગોડાઉન બાંધવા ₹૩૦,૦૦૦ સુધી સહાય",
      "સ્માર્ટ હેન્ડ ટૂલ કીટ ખરીદવા માટે ૭૫% સબસિડી",
    ],
    eligibility: { occupation: ["farmer"], state: ["Gujarat"], minAge: 18, maxAge: 99, gender: "all" },
    documents: ["૭/૧૨ અને ૮-અ નકલ", "આધાર કાર્ડ", "ગાય ટેગિંગ આઈડી (દેશી ગાય માટે)", "બેંક એકાઉન્ટ વિગત"],
    applicationUrl: "https://ikhedut.gujarat.gov.in",
    icon: "🚜",
    ministry: "કૃષિ, ખેડૂત કલ્યાણ અને સહકાર વિભાગ, ગુજરાત સરકાર",
    isActive: true,
  },

  // ── 2. HEALTH ──
  {
    id: "ayushman-bharat",
    officialSlaDays: 3,
    planningEstimateDays: "તાત્કાલિક / ૧-૨ દિવસ",
    implementingAuthority: "NHA / આરોગ્ય વિભાગ (PM-JAY)",
    targetBeneficiary: "SECC ૨૦૧૧ અને BPL / મધ્યમવર્ગીય પરિવારો",
    name: "Ayushman Bharat PM-JAY",
    nameGu: "આયુષ્માન ભારત PM-JAY (MAA કાર્ડ)",
    nameHi: "आयुष्मान भारत PM-JAY",
    category: "health",
    description: "Free cashless healthcare coverage up to ₹5 Lakh (₹10 Lakh in Gujarat) per family per year for secondary and tertiary hospitalization.",
    benefits: [
      "ગુજરાતના પરિવારો માટે વાર્ષિક ₹૧૦ લાખ સુધી કેશલેસ સારવાર",
      "૨,૫૦૦ થી વધુ સરકારી અને ખાનગી હૉસ્પિટલમાં માન્ય",
      "દવાઓ, ઓપરેશન, ટેસ્ટ અને ICU ચાર્જ સંપૂર્ણપણે મફત",
    ],
    eligibility: { incomeLimit: 400000, gender: "all" },
    documents: ["આધાર કાર્ડ (બધા સભ્યોના)", "રેશન કાર્ડ (Ration Card)", "આવકનું પ્રમાણપત્ર", "PM-JAY પત્ર અથવા મા કાર્ડ"],
    applicationUrl: "https://pmjay.gov.in",
    icon: "🏥",
    ministry: "આરોગ્ય અને પરિવાર કલ્યાણ મંત્રાલય",
    isActive: true,
  },
  {
    id: "maa-amrutam-gujarat",
    officialSlaDays: 7,
    planningEstimateDays: "૨-૩ દિવસ",
    implementingAuthority: "આરોગ્ય અને પરિવાર કલ્યાણ વિભાગ, ગુજરાત",
    targetBeneficiary: "વાર્ષિક ₹૪ લાખ સુધીની આવક ધરાવતા પરિવારો",
    name: "Mukhyamantri Amrutam (MAA Vatsalya)",
    nameGu: "મુખ્યમંત્રી અમૃતમ (મા વાત્સલ્ય યોજના)",
    nameHi: "मुख्यमंत्री अमृतम वात्सल्य योजना",
    category: "health",
    description: "Tertiary medical treatment coverage for critical illnesses for low-income and middle-class Gujarat families.",
    benefits: [
      "ગંભીર બીમારીઓ (હૃદયરોગ, કેન્સર, કિડની, ન્યુરો) માટે ૧૦૦% મફત સારવાર",
      "મુસાફરી ભથ્થું ₹૩૦૦ પ્રતિ વિઝિટ મળવાપાત્ર",
      "કોઈપણ પ્રીમિયમ ભર્યા વિના સંપૂર્ણ સરકારી ખર્ચે સારવાર",
    ],
    eligibility: { incomeLimit: 400000, state: ["Gujarat"], gender: "all" },
    documents: ["આવકનો દાખલો (મામલતદાર માન્ય)", "રેશન કાર્ડ", "આધાર કાર્ડ", "પરિવારના ફોટોગ્રાફ"],
    applicationUrl: "https://www.magujarat.com",
    icon: "🩺",
    ministry: "આરોગ્ય અને પરિવાર કલ્યાણ વિભાગ, ગુજરાત સરકાર",
    isActive: true,
  },

  // ── 3. HOUSING ──
  {
    id: "pm-awas-gramin",
    officialSlaDays: 60,
    planningEstimateDays: "20-30 દિવસ",
    implementingAuthority: "ગ્રામ વિકાસ મંત્રાલય / PMAY-G",
    targetBeneficiary: "કાચા મકાનમાં રહેતા ગ્રામીણ બેઘર પરિવારો",
    name: "PM Awas Yojana Gramin",
    nameGu: "PM આવાસ યોજના ગ્રામીણ (ગામડાંનું પાકું મકાન)",
    nameHi: "PM आवास योजना ग्रामीण",
    category: "housing",
    description: "Financial assistance for construction of pucca house with basic amenities to all houseless households in rural areas.",
    benefits: [
      "સપાટ વિસ્તારોમાં ₹૧,૨૦,૦૦૦ અને ડુંગરાળ વિસ્તારોમાં ₹૧,૩૦,૦૦૦ સહાય",
      "શૌચાલય બનાવવા વધારાના ₹૧૨,૦૦૦ સહાય",
      "મનરેગા અંતર્ગત ૯૦ દિવસની મજૂરી (અંદાજે ₹૨૦,૦૦૦+)",
    ],
    eligibility: { incomeLimit: 300000, gender: "all", occupation: ["rural"] },
    documents: ["આધાર કાર્ડ", "BPL/SECC યાદી ક્રમાંક", "બેંક પાસબુક", "પ્લોટ/જમીન માલિકી આધાર", "હાલના કાચા મકાનનો ફોટો"],
    applicationUrl: "https://pmayg.nic.in",
    icon: "🏠",
    ministry: "ગ્રામીણ વિકાસ મંત્રાલય (Ministry of Rural Development)",
    isActive: true,
  },
  {
    id: "pm-awas-urban",
    officialSlaDays: 60,
    planningEstimateDays: "25-35 દિવસ",
    implementingAuthority: "આવાસ અને શહેરી બાબતોનું મંત્રાલય (MoHUA)",
    targetBeneficiary: "શહેરી ગરીબ અને EWS/LIG પરિવારો",
    name: "PM Awas Yojana Urban",
    nameGu: "PM આવાસ યોજના શહેરી (શહેરનું ઘર)",
    nameHi: "PM आवास योजना शहरी",
    category: "housing",
    description: "Interest subsidy and financial assistance to urban poor and middle class (EWS/LIG/MIG) for purchasing or constructing pucca houses.",
    benefits: [
      "હોમ લોન વ્યાજ પર ₹૨.૬૭ લાખ સુધી વ્યાજ સબસિડી (CLSS)",
      "સ્લમ રિડેવલપમેન્ટ હેઠળ મફત પાકું આવાસ",
      "પોતાના પ્લોટ પર બાંધકામ માટે ₹૧.૫૦ લાખ સરકારી ગ્રાન્ટ",
    ],
    eligibility: { incomeLimit: 600000, gender: "all" },
    documents: ["આધાર કાર્ડ", "પાન કાર્ડ", "આવકનો દાખલો / IT રિટર્ન", "બેંક સ્ટેટમેન્ટ ૬ માસ", "મકાન દસ્તાવેજ"],
    applicationUrl: "https://pmaymis.gov.in",
    icon: "🏢",
    ministry: "હાઉસિંગ અને શહેરી બાબતોનું મંત્રાલય",
    isActive: true,
  },
  {
    id: "deendayal-awas-gujarat",
    officialSlaDays: 45,
    planningEstimateDays: "15-20 દિવસ",
    implementingAuthority: "સામાજિક ન્યાય અને અધિકારીતા વિભાગ",
    targetBeneficiary: "SC/ST/SEBC સામાજિક રીતે પછાત વર્ગના પરિવારો",
    name: "Pandit Deendayal Upadhyay Awas Yojana",
    nameGu: "પંડિત દીનદયાળ ઉપાધ્યાય આવાસ યોજના",
    nameHi: "पंडित दीनदयाल उपाध्याय आवास योजना",
    category: "housing",
    description: "Housing assistance for Socially and Educationally Backward Classes (SEBC) and economically weaker citizens in Gujarat.",
    benefits: [
      "પોતાની માલિકીના પ્લોટ પર મકાન બાંધવા માટે ₹૧,૨૦,૦૦૦ ની સીધી સહાય",
      "૩ હપ્તામાં સીધી બેંક ખાતામાં રકમ જમા",
      "ગ્રામ્ય અને શહેરી બંને વિસ્તારના ગરીબ પરિવારો માટે ઉપલબ્ધ",
    ],
    eligibility: { incomeLimit: 150000, state: ["Gujarat"], gender: "all" },
    documents: ["જાતિનો દાખલો (SEBC/OBC/SC)", "આવકનો દાખલો", "પ્લોટ સનદ અથવા ગામ નમૂના નં ૨", "આધાર કાર્ડ"],
    applicationUrl: "https://esamajkalyan.gujarat.gov.in",
    icon: "🏘️",
    ministry: "સામાજિક ન્યાય અને અધિકારિતા વિભાગ, ગુજરાત સરકાર",
    isActive: true,
  },

  // ── 4. WOMEN & CHILD ──
  {
    id: "sukanya-samriddhi",
    officialSlaDays: 7,
    planningEstimateDays: "૧-૨ દિવસ",
    implementingAuthority: "પોસ્ટ ઓફિસ / રાષ્ટ્રીયકૃત બેંકો",
    targetBeneficiary: "૧૦ વર્ષથી નાની ઉંમરની બાળકીઓ",
    name: "Sukanya Samriddhi Yojana",
    nameGu: "સુકન્યા સમૃદ્ધિ યોજના (દીકરી ભવિષ્ય)",
    nameHi: "सुकन्या समृद्धि योजना",
    category: "women",
    description: "High-interest, tax-free small deposit scheme for girl child education and marriage.",
    benefits: [
      "વાર્ષિક ૮.૨% આકર્ષક વ્યાજ દર (સરકારી સ્કીમમાં સૌથી વધુ)",
      "કલમ 80C હેઠળ ૧૦૦% કરમુક્ત વળતર",
      "દીકરી ૧૮ વર્ષની થતાં ઉચ્ચ અભ્યાસ માટે ૫૦% ઉપાડની છૂટ",
    ],
    eligibility: { gender: "female", maxAge: 10, minAge: 0 },
    documents: ["દીકરીનું જન્મ પ્રમાણપત્ર (Birth Certificate)", "માતા/પિતાનું આધાર કાર્ડ અને પાન કાર્ડ", "સરનામાનો પુરાવો", "ફોટોગ્રાફ"],
    applicationUrl: "https://www.indiapost.gov.in",
    icon: "👧",
    ministry: "નાણાં મંત્રાલય અને ટપાલ વિભાગ",
    isActive: true,
  },
  {
    id: "vahli-dikri-gujarat",
    officialSlaDays: 30,
    planningEstimateDays: "7-10 દિવસ",
    implementingAuthority: "મહિલા અને બાળ વિકાસ વિભાગ, ગુજરાત",
    targetBeneficiary: "પ્રથમ અને દ્વિતીય પુત્રીઓ (આવક ₹૨ લાખ મર્યાદા)",
    name: "Vahli Dikri Yojana Gujarat",
    nameGu: "વ્હાલી દીકરી યોજના (ગુજરાત સરકાર)",
    nameHi: "व्हाली दीकरी योजना गुजरात",
    category: "women",
    description: "Gujarat Government initiative to improve girl child sex ratio and promote higher education with total aid of ₹1,10,000.",
    benefits: [
      "પહેલા ધોરણમાં પ્રવેશ વખતે ₹૪,૦૦૦ ની સહાય",
      "નવમા ધોરણમાં પ્રવેશ વખતે ₹૬,૦૦૦ ની સહાય",
      "૧૮ વર્ષ પૂર્ણ થતાં ઉચ્ચ અભ્યાસ/લગ્ન માટે ₹૧,૦૦,૦૦૦ ની એકમષ્ટિ સહાય",
    ],
    eligibility: { gender: "female", incomeLimit: 200000, state: ["Gujarat"], minAge: 0, maxAge: 18 },
    documents: ["દીકરીનું જન્મ પ્રમાણપત્ર", "માતા-પિતાનો આવકનો દાખલો", "રેશન કાર્ડ", "માતા-પિતાનું આધાર કાર્ડ", "બેંક પાસબુક"],
    applicationUrl: "https://wcd.gujarat.gov.in",
    icon: "🎀",
    ministry: "મહિલા અને બાળ વિકાસ વિભાગ, ગુજરાત સરકાર",
    isActive: true,
  },
  {
    id: "pm-matru-vandana",
    officialSlaDays: 21,
    planningEstimateDays: "5-7 દિવસ",
    implementingAuthority: "મહિલા અને બાળ વિકાસ મંત્રાલય (MoWCD)",
    targetBeneficiary: "પ્રથમ જીવિત બાળકના જન્મ પર સગર્ભા માતાઓ",
    name: "PM Matru Vandana Yojana",
    nameGu: "પ્રધાનમંત્રી માતૃ વંદના યોજના (PMMVY)",
    nameHi: "प्रधानमंत्री मातृ वंदना योजना",
    category: "women",
    description: "Maternity benefit scheme providing direct cash assistance of ₹5,000 to pregnant women and lactating mothers.",
    benefits: [
      "પ્રથમ બાળકના જન્મ સમયે ₹૫,૦૦૦ ની સીધી રોકડ સહાય",
      "બીજું બાળક દીકરી હોય તો વધારાના ₹૬,૦૦૦ ની સહાય",
      "પોષણ અને રસીકરણ માટે આંગણવાડી કેન્દ્ર મારફતે ઝડપી ચુકવણી",
    ],
    eligibility: { gender: "female", minAge: 19, maxAge: 45 },
    documents: ["માતૃ-બાળ સુરક્ષા કાર્ડ (MCP Card)", "ગર્ભવતી મહિલા અને પતિનું આધાર કાર્ડ", "બેંક એકાઉન્ટ પાસબુક"],
    applicationUrl: "https://pmmvy.wcd.gov.in",
    icon: "🤱",
    ministry: "મહિલા અને બાળ વિકાસ મંત્રાલય",
    isActive: true,
  },
  {
    id: "mmuy-gujarat",
    officialSlaDays: 21,
    planningEstimateDays: "7-10 દિવસ",
    implementingAuthority: "ગુજરાત મહિલા આર્થિક વિકાસ નિગમ",
    targetBeneficiary: "સ્વસહાય જૂથ (SHG) ની ૧૦ બહેનોનું જૂથ",
    name: "Mukhyamantri Mahila Utkarsh Yojana",
    nameGu: "મુખ્યમંત્રી મહિલા ઉત્કર્ષ યોજના (MMUY)",
    nameHi: "मुख्यमंत्री महिला उत्कर्ष योजना",
    category: "women",
    description: "Zero percent interest loans up to ₹1,00,000 to Joint Liability and Earning Groups (JLEG) of women in Gujarat.",
    benefits: [
      "મહિલા સ્વ-સહાય જૂથોને ₹૧,૦૦,૦૦૦ સુધીનું ૦% વ્યાજે ધિરાણ",
      "વ્યાજનો સંપૂર્ણ બોજ ગુજરાત સરકાર ભોગવશે",
      "નાના ગૃહ ઉદ્યોગ અને સ્વરોજગાર શરૂ કરવા શ્રેષ્ઠ તક",
    ],
    eligibility: { gender: "female", state: ["Gujarat"], minAge: 18, maxAge: 60 },
    documents: ["મહિલા સભ્યોના આધાર કાર્ડ", "રેશન કાર્ડ", "બેંક ખાતાની વિગત", "જૂથ સંમતિ પત્ર"],
    applicationUrl: "https://wcd.gujarat.gov.in",
    icon: "👭",
    ministry: "શહેરી વિકાસ અને ગ્રામ વિકાસ વિભાગ, ગુજરાત",
    isActive: true,
  },

  // ── 5. BUSINESS & ENTREPRENEURSHIP ──
  {
    id: "mudra-loan",
    officialSlaDays: 14,
    planningEstimateDays: "3-5 દિવસ",
    implementingAuthority: "MUDRA / તમામ કોમર્શિયલ બેંકો",
    targetBeneficiary: "નાના ઉદ્યોગસાહસિકો અને વેપારીઓ",
    name: "PM Mudra Yojana",
    nameGu: "PM મુદ્રા યોજના (ધંધાકીય લોન)",
    nameHi: "PM मुद्रा योजना",
    category: "business",
    description: "Collateral-free micro loans for non-farm, non-corporate small and micro enterprises up to ₹10 Lakhs.",
    benefits: [
      "શિશુ લોન: ₹૫૦,૦૦૦ સુધી (નાના વ્યવસાય માટે)",
      "કિશોર લોન: ₹૫૦,૦૦૦ થી ₹૫ લાખ સુધી",
      "તરુણ લોન: ₹૫ લાખ થી ₹૧૦ લાખ સુધી (કોઈપણ ગેરંટી વિના)",
    ],
    eligibility: { minAge: 18, maxAge: 65, gender: "all" },
    documents: ["આધાર કાર્ડ અને પાન કાર્ડ", "વ્યવસાયનું સરનામું / ગુમાસ્તા ધારો", "૬ મહિનાનું બેંક સ્ટેટમેન્ટ", "પ્રોજેક્ટ રિપોર્ટ"],
    applicationUrl: "https://mudra.org.in",
    icon: "💼",
    ministry: "નાણાકીય સેવાઓ વિભાગ, નાણાં મંત્રાલય",
    isActive: true,
  },
  {
    id: "pm-svanidhi",
    officialSlaDays: 7,
    planningEstimateDays: "૨-૩ દિવસ",
    implementingAuthority: "MoHUA / શહેરી વિકાસ મિશન",
    targetBeneficiary: "શહેરી વિસ્તારના શેરી ફેરિયાઓ અને પાથરણાવાળા",
    name: "PM SVANidhi Yojana",
    nameGu: "PM સ્વનિધિ યોજના (શેરી ફેરિયા લોન)",
    nameHi: "PM स्वनिधि योजना",
    category: "business",
    description: "Micro-credit facility for street vendors to restart livelihoods with working capital loans starting from ₹10,000.",
    benefits: [
      "પ્રથમ તબક્કે ₹૧૦,૦૦૦ ની કોઈપણ જામીન વગર લોન",
      "સમયસર ચુકવણી પર બીજા તબક્કે ₹૨૦,૦૦૦ અને ત્રીજા તબક્કે ₹૫૦,૦૦૦",
      "૭% વ્યાજ સબસિડી અને ડિજિટલ પેમેન્ટ પર વાર્ષિક ₹૧,૨૦૦ કેશબેક",
    ],
    eligibility: { minAge: 18, maxAge: 70, gender: "all" },
    documents: ["વેન્ડિંગ પ્રમાણપત્ર અથવા ઓળખપત્ર (ULB)", "આધાર કાર્ડ", "બેંક પાસબુક"],
    applicationUrl: "https://pmsvanidhi.mohua.gov.in",
    icon: "🛒",
    ministry: "હાઉસિંગ અને શહેરી ગરીબી નિવારણ મંત્રાલય",
    isActive: true,
  },
  {
    id: "pm-vishwakarma",
    officialSlaDays: 21,
    planningEstimateDays: "7-10 દિવસ",
    implementingAuthority: "MSME મંત્રાલય / કૌશલ્ય વિકાસ મંત્રાલય",
    targetBeneficiary: "૧૮ પરંપરાગત હાથના કારીગરો",
    name: "PM Vishwakarma Yojana",
    nameGu: "PM વિશ્વકર્મા યોજના (કારીગર કલ્યાણ)",
    nameHi: "PM विश्वकर्मा योजना",
    category: "business",
    description: "End-to-end holistic support for traditional artisans and craftspeople across 18 trades including training, toolkit, and loans.",
    benefits: [
      "આધુનિક ટૂલકીટ ખરીદવા માટે ₹૧૫,૦૦૦ ની ઈ-વાઉચર ગ્રાન્ટ",
      "તાલીમ દરમિયાન પ્રતિ દિવસ ₹૫૦૦ નું સ્ટાઈપેન્ડ",
      "માત્ર ૫% રાહત દરે ₹૩,૦૦,૦૦૦ સુધી ગેરંટી મુક્ત લોન",
    ],
    eligibility: { minAge: 18, maxAge: 99, gender: "all" },
    documents: ["આધાર કાર્ડ", "મોબાઈલ નંબર", "બેંક પાસબુક", "પરંપરાગત વ્યવસાયનું સ્વ-ઘોષણાપત્ર"],
    applicationUrl: "https://pmvishwakarma.gov.in",
    icon: "🔨",
    ministry: "સૂક્ષ્મ, લઘુ અને મધ્યમ ઉદ્યોગ મંત્રાલય (MSME)",
    isActive: true,
  },

  // ── 6. EDUCATION & YOUTH ──
  {
    id: "mysy-gujarat",
    officialSlaDays: 30,
    planningEstimateDays: "10-15 દિવસ",
    implementingAuthority: "ઉચ્ચ શિક્ષણ કમિશનરેટ / MYSY Portal",
    targetBeneficiary: "ધોરણ ૧૦/૧૨ માં ૮૦+ પર્સેન્ટાઇલ ધરાવતા તેજસ્વી વિદ્યાર્થીઓ",
    name: "Mukhyamantri Yuva Swavalamban Yojana",
    nameGu: "MYSY સ્કોલરશિપ ગુજરાત (ઉચ્ચ શિક્ષણ)",
    nameHi: "मुख्यमंत्री युवा स्वावलंबन योजना",
    category: "education",
    description: "Financial assistance for higher education tuition fees, hostel, and book expenses for bright Gujarat students.",
    benefits: [
      "મેડિકલ અને ડેન્ટલ કોર્સ માટે વાર્ષિક ₹૨,૦૦,૦૦૦ સુધી ટ્યુશન સહાય (૫૦%)",
      "એન્જિનિયરિંગ, ફાર્મસી વગેરે માટે ₹૫૦,૦૦૦ સુધી વાર્ષિક સહાય",
      "હોસ્ટેલ ભથ્થું ₹૧,૨૦૦/માસ અને પુસ્તક ખરીદી માટે ₹૧૦,૦૦૦ ગ્રાન્ટ",
    ],
    eligibility: { incomeLimit: 600000, state: ["Gujarat"], minAge: 16, maxAge: 28, gender: "all" },
    documents: ["ધોરણ ૧૦/૧૨ ની ૮૦ ટકાથી વધુ પર્સન્ટાઇલ વાળી માર્કશીટ", "આવકનો દાખલો (₹૬ લાખ સુધી)", "કોલેજ એડમિશન સ્લિપ અને ફી પહોંચ", "આધાર કાર્ડ"],
    applicationUrl: "https://mysy.guj.nic.in",
    icon: "🎓",
    ministry: "શિક્ષણ વિભાગ, ગુજરાત સરકાર",
    isActive: true,
  },
  {
    id: "digital-gujarat-scholarship",
    officialSlaDays: 30,
    planningEstimateDays: "10-15 દિવસ",
    implementingAuthority: "Digital Gujarat Portal / સામાજિક કલ્યાણ",
    targetBeneficiary: "કોલેજ અને યુનિવર્સિટીના SC/ST/OBC વિદ્યાર્થીઓ",
    name: "Digital Gujarat Post-Matric Scholarship",
    nameGu: "ડિજિટલ ગુજરાત પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ",
    nameHi: "डिजिटल गुजरात पोस्ट-मैट्रिक स्कॉलरशिप",
    category: "education",
    description: "Scholarship and freeship card scheme for SC, ST, SEBC, and EWS students studying after 10th/12th grade.",
    benefits: [
      "૧૦૦% ટ્યુશન ફી માફી અથવા સીધું રિફંડ",
      "વાર્ષિક નિર્વાહ ભથ્થું (Maintenance Allowance) સીધું બેંકમાં",
      "ડિપ્લોમા, ડિગ્રી, માસ્ટર્સ અને પીએચડી તમામ કોર્સ માન્ય",
    ],
    eligibility: { incomeLimit: 250000, state: ["Gujarat"], minAge: 15, maxAge: 35, gender: "all" },
    documents: ["જાતિ પ્રમાણપત્ર (Caste Certificate)", "આવકનો દાખલો", "છેલ્લી પાસ કરેલી પરીક્ષાની માર્કશીટ", "કોલેજ ફી રસીદ અને બોનાફાઇડ"],
    applicationUrl: "https://www.digitalgujarat.gov.in",
    icon: "📚",
    ministry: "સામાજિક ન્યાય અને આદિજાતિ વિકાસ વિભાગ, ગુજરાત",
    isActive: true,
  },
  {
    id: "skill-india",
    officialSlaDays: 14,
    planningEstimateDays: "3-5 દિવસ",
    implementingAuthority: "MSDE / NSDC કૌશલ વિકાસ કેન્દ્રો",
    targetBeneficiary: "શાળા/કોલેજ છોડેલા બેરોજગાર યુવાનો",
    name: "PM Kaushal Vikas Yojana",
    nameGu: "PM કૌશલ્ય વિકાસ યોજના (PMKVY 4.0)",
    nameHi: "PM कौशल विकास योजना",
    category: "education",
    description: "Industry-relevant short-term skill training and National Skill Qualification Framework (NSQF) certification.",
    benefits: [
      "સંપૂર્ણપણે મફત કૌશલ્ય તાલીમ (Free Practical Training)",
      "ભારત સરકાર માન્ય કૌશલ્ય પ્રમાણપત્ર",
      "તાલીમ પાસ થતાં ₹૮,૦૦૦ સુધી પ્રોત્સાહક રકમ અને પ્લેસમેન્ટ સહાય",
    ],
    eligibility: { minAge: 15, maxAge: 45, gender: "all" },
    documents: ["આધાર કાર્ડ", "શૈક્ષણિક લાયકાતનું સર્ટિફિકેટ", "બેંક પાસબુક", "પાસપોર્ટ ફોટો"],
    applicationUrl: "https://pmkvyofficial.org",
    icon: "🛠️",
    ministry: "કૌશલ્ય વિકાસ અને ઉદ્યોગસાહસિકતા મંત્રાલય",
    isActive: true,
  },

  // ── 7. SOCIAL SECURITY & PENSION ──
  {
    id: "jan-dhan",
    officialSlaDays: 3,
    planningEstimateDays: "તાત્કાલિક / ૧ દિવસ",
    implementingAuthority: "નાણાકીય સેવા વિભાગ (DFS) / તમામ બેંકો",
    targetBeneficiary: "બેંક ખાતું ન ધરાવતા તમામ પુખ્ત નાગરિકો",
    name: "PM Jan Dhan Yojana",
    nameGu: "PM જન ધન યોજના (ઝીરો બેલેન્સ ખાતું)",
    nameHi: "PM जन धन योजना",
    category: "social",
    description: "Universal banking access with zero minimum balance, RuPay debit card, and in-built accident insurance.",
    benefits: [
      "ઝીરો બેલેન્સ ખાતું (કોઈપણ મિનિમમ બેલેન્સની જરૂર નથી)",
      "₹૨,૦૦,૦૦૦ નું મફત અકસ્માત વીમા કવચ (RuPay Card સાથે)",
      "સંતોષકારક ખાતા સંચાલન પર ₹૧૦,૦૦૦ સુધીની ઓવરડ્રાફ્ટ સુવિધા",
    ],
    eligibility: { minAge: 10, maxAge: 99, gender: "all" },
    documents: ["આધાર કાર્ડ", "૧ પાસપોર્ટ સાઇઝ ફોટો", "મોબાઈલ નંબર"],
    applicationUrl: "https://pmjdy.gov.in",
    icon: "🏦",
    ministry: "નાણાંકીય સેવાઓ વિભાગ, નાણાં મંત્રાલય",
    isActive: true,
  },
  {
    id: "atal-pension",
    officialSlaDays: 7,
    planningEstimateDays: "૨-૩ દિવસ",
    implementingAuthority: "PFRDA / તમામ બેંક શાખાઓ",
    targetBeneficiary: "૧૮ થી ૪૦ વર્ષના અસંગઠિત ક્ષેત્રના કામદારો",
    name: "Atal Pension Yojana",
    nameGu: "અટલ પેન્શન યોજના (માસિક પેન્શન)",
    nameHi: "अटल पेंशन योजना",
    category: "social",
    description: "Guaranteed minimum monthly pension for unorganized sector citizens after the age of 60.",
    benefits: [
      "૬૦ વર્ષની વય બાદ આજીવન ₹૧,૦૦૦ થી ₹૫,૦૦૦ માસિક પેન્શન",
      "સભ્યના અવસાન બાદ પત્ની/પતિને આજીવન સમાન પેન્શન",
      "દંપતીના અવસાન બાદ નોમિનીને સંપૂર્ણ એકત્રિત ભંડોળ પરત",
    ],
    eligibility: { minAge: 18, maxAge: 40, gender: "all" },
    documents: ["આધાર કાર્ડ", "બચત બેંક ખાતું", "મોબાઈલ નંબર"],
    applicationUrl: "https://npscra.nsdl.co.in",
    icon: "👴",
    ministry: "પેન્શન ફંડ નિયમન અને વિકાસ સત્તામંડળ (PFRDA)",
    isActive: true,
  },
  {
    id: "shram-yogi-maandhan",
    officialSlaDays: 7,
    planningEstimateDays: "૧-૨ દિવસ",
    implementingAuthority: "શ્રમ અને રોજગાર મંત્રાલય / LIC",
    targetBeneficiary: "₹૧૫,૦૦૦ થી ઓછી માસિક આવક ધરાવતા શ્રમિકો",
    name: "PM Shram Yogi Maandhan",
    nameGu: "PM શ્રમયોગી માનધન યોજના (PMSYM)",
    nameHi: "PM श्रम योगी मानधन योजना",
    category: "social",
    description: "Old age pension protection for unorganized workers like drivers, domestic helpers, tailors, and construction workers.",
    benefits: [
      "૬૦ વર્ષ પછી નિશ્ચિત ₹૩,૦૦૦ પ્રતિ માસ પેન્શન",
      "૫૦% સરકારી સબસિડી (જેટલું પ્રીમિયમ નાગરિક ભરે તેટલું સરકાર ઉમેરે)",
      "ઈ-શ્રમ કાર્ડ ધારકો માટે તાત્કાલિક નોંધણી",
    ],
    eligibility: { incomeLimit: 180000, minAge: 18, maxAge: 40, gender: "all" },
    documents: ["આધાર કાર્ડ", "બચત બેંક પાસબુક (IFSC સાથે)", "મોબાઈલ નંબર"],
    applicationUrl: "https://maandhan.in",
    icon: "👷",
    ministry: "શ્રમ અને રોજગાર મંત્રાલય (Ministry of Labour)",
    isActive: true,
  },
  {
    id: "niradhar-vridh-pension",
    officialSlaDays: 30,
    planningEstimateDays: "10-15 દિવસ",
    implementingAuthority: "સામાજિક સુરક્ષા કચેરી / મામલતદાર",
    targetBeneficiary: "૬૦ વર્ષથી વધુ ઉંમરના નિરાધાર વૃદ્ધો",
    name: "Niradhar Vrudhh Pension Gujarat",
    nameGu: "નિરાધાર વૃદ્ધ પેન્શન સહાય (ગુજરાત)",
    nameHi: "निराधार वृद्ध पेंशन योजना गुजरात",
    category: "social",
    description: "Monthly financial pension to destitute elderly citizens in Gujarat aged 60 and above with no source of income.",
    benefits: [
      "૬૦ થી ૭૯ વર્ષના વૃદ્ધોને ₹૧,૦૦૦ પ્રતિ માસ સીધા ખાતામાં",
      "૮૦ વર્ષથી વધુ ઉંમરના વડીલોને ₹૧,૨૫૦ પ્રતિ માસ",
      "પોસ્ટ ઓફિસ અથવા બેંક મારફતે નિયમિત દર મહિને ચુકવણી",
    ],
    eligibility: { minAge: 60, maxAge: 99, state: ["Gujarat"], incomeLimit: 120000, gender: "all" },
    documents: ["ઉંમરનો પુરાવો (શાળા છોડ્યાનું પ્રમાણપત્ર/ચૂંટણી કાર્ડ)", "આવકનો દાખલો", "કોઈ પુખ્ત દીકરો ન હોવાનું સોગંદનામું", "આધાર કાર્ડ"],
    applicationUrl: "https://esamajkalyan.gujarat.gov.in",
    icon: "🧓",
    ministry: "સામાજિક ન્યાય અને અધિકારિતા વિભાગ, ગુજરાત સરકાર",
    isActive: true,
  },
  {
    id: "annapurna-yojana",
    officialSlaDays: 1,
    planningEstimateDays: "ઓન-ધ-સ્પોટ",
    implementingAuthority: "શ્રમિક અન્નપૂર્ણા કેન્દ્રો / BOCW બોર્ડ",
    targetBeneficiary: "કડીયાનાકા પર ઉપસ્થિત તમામ શ્રમિકો",
    name: "Shramik Annapurna Yojana",
    nameGu: "શ્રમિક અન્નપૂર્ણા યોજના (માત્ર ₹૫ માં ભોજન)",
    nameHi: "श्रमिक अन्नपूर्णा योजना",
    category: "social",
    description: "Nutritious and hygienic hot cooked meal to construction workers and daily wagers at Kadiyanaka across Gujarat.",
    benefits: [
      "માત્ર ₹૫ માં સંપૂર્ણ પૌષ્ટિક ગરમ ભોજન (રોટલી, શાક, દાળ, ભાત)",
      "ગુજરાતના તમામ મુખ્ય કડિયાનાકા પર વિશેષ ભોજન કેન્દ્રો",
      "શ્રમિક પરિવારજનો માટે પણ રાહત દરે ભોજન સુવિધા",
    ],
    eligibility: { occupation: ["laborer", "construction"], state: ["Gujarat"], gender: "all" },
    documents: ["ઈ-નિર્માણ કાર્ડ (E-Nirman Card)", "આધાર કાર્ડ"],
    applicationUrl: "https://enirmanbocw.gujarat.gov.in",
    icon: "🍲",
    ministry: "શ્રમ, કૌશલ્ય વિકાસ અને રોજગાર વિભાગ, ગુજરાત",
    isActive: true,
  },

  // ── 8. ENERGY & ENVIRONMENT ──
  {
    id: "ujjwala-yojana",
    officialSlaDays: 14,
    planningEstimateDays: "3-5 દિવસ",
    implementingAuthority: "પેટ્રોલિયમ મંત્રાલય / IOCL, BPCL, HPCL",
    targetBeneficiary: "BPL પરિવારોની પુખ્ત મહિલાઓ",
    name: "PM Ujjwala Yojana 2.0",
    nameGu: "PM ઉજ્જવલા યોજના (મફત ગેસ સિલિન્ડર)",
    nameHi: "PM उज्ज्वला योजना",
    category: "energy",
    description: "Free LPG gas connection with zero security deposit and first refill free for women from poor households.",
    benefits: [
      "સંપૂર્ણપણે મફત નવું ગેસ કનેક્શન (સિક્યોરિટી ડિપોઝિટ શૂન્ય)",
      "પ્રથમ ભરેલો સિલિન્ડર અને ચૂલો (Stove) તદ્દન મફત",
      "આગામી દરેક રિફિલ પર સરકાર દ્વારા સીધી સબસિડી",
    ],
    eligibility: { gender: "female", incomeLimit: 200000, minAge: 18, maxAge: 99 },
    documents: ["મહિલા અરજદારનું આધાર કાર્ડ", "BPL/SECC રેશન કાર્ડ", "બેંક પાસબુક", "પાસપોર્ટ ફોટો"],
    applicationUrl: "https://pmuy.gov.in",
    icon: "🔥",
    ministry: "પેટ્રોલિયમ અને કુદરતી ગેસ મંત્રાલય",
    isActive: true,
  },
  {
    id: "pm-surya-ghar",
    officialSlaDays: 30,
    planningEstimateDays: "7-12 દિવસ",
    implementingAuthority: "નવી અને નવીનીકરણીય ઊર્જા મંત્રાલય (MNRE)",
    targetBeneficiary: "પોતાનું પાકું છાપરું ધરાવતા વીજ ગ્રાહકો",
    name: "PM Surya Ghar: Muft Bijli Yojana",
    nameGu: "PM સૂર્ય ઘર: મફત વીજળી યોજના (સોલાર સબસિડી)",
    nameHi: "PM सूर्य घर: मुफ्त बिजली योजना",
    category: "energy",
    description: "National rooftop solar scheme providing up to 300 units of free electricity every month with upfront central subsidy up to ₹78,000.",
    benefits: [
      "પ્રતિ માસ ૩૦૦ યુનિટ સુધી મફત સૌર વીજળી (શૂન્ય લાઈટ બિલ)",
      "૧ થી ૩ કિલોવોટ રૂફટોપ સોલાર સિસ્ટમ પર ₹૩૦,૦૦૦ થી ₹૭૮,૦૦૦ સીધી સબસિડી",
      "વધારાની ઉત્પન્ન થયેલી વીજળી ગ્રીડને વેચીને વધારાની કમાણી",
    ],
    eligibility: { minAge: 18, maxAge: 99, gender: "all" },
    documents: ["છેલ્લા ૬ મહિનાનું વીજળી બિલ (Electricity Consumer No)", "ઘર માલિકીનો દસ્તાવેજ/વેરા બિલ", "આધાર કાર્ડ", "બેંક રદ કરેલ ચેક"],
    applicationUrl: "https://pmsuryaghar.gov.in",
    icon: "☀️",
    ministry: "નવી અને નવીનીકરણીય ઊર્જા મંત્રાલય (MNRE)",
    isActive: true,
  },

  // ── 9. ADDITIONAL REAL-TIME GUJARAT & CENTRAL SCHEMES (17 NEW SCHEMES) ──
  {
  id: "namo-lakshmi",
  name: "Namo Lakshmi Scheme",
  nameGu: "નમો લક્ષ્મી યોજના (વિદ્યાર્થિની સહાય)",
  nameHi: "नमो लक्ष्मी योजना",
  category: "education",
  description: "Gujarat flagship scheme to curb dropout rates of adolescent girls in secondary education (Class 9-12) with ₹50,000 financial support over 4 years.",
  benefits: [
    "૪ વર્ષમાં કુલ ₹૫૦,૦૦૦ ની સીધી સહાય (ધોરણ ૯ અને ૧૦ માટે વાર્ષિક ₹૧૦,૦૦૦, ધોરણ ૧૧ અને ૧૨ માટે વાર્ષિક ₹૧૫,૦૦૦)",
    "દર મહિને ₹૫૦૦ સીધા બેંક ખાતામાં DBT અને બોર્ડ પાસ કરવા પર એકસામટી રકમ",
    "કન્યા કેળવણી પ્રોત્સાહન અને ઉચ્ચ શિક્ષણ ડ્રોપઆઉટ રેટમાં નોંધપાત્ર ઘટાડો"
  ],
  eligibility: {
    minAge: 13,
    maxAge: 19,
    gender: "female",
    incomeLimit: 600000,
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "આધાર કાર્ડ (Aadhaar Card)",
    "શાળા બોનાફાઇડ પ્રમાણપત્ર / વિદ્યાર્થી યુનિક ID",
    "બેંક પાસબુક (વિદ્યાર્થિની/માતા સાથે સંયુક્ત)",
    "કૌટુંબિક આવકનો દાખલો"
  ],
  applicationUrl: "https://namolakshmi.gujarat.gov.in",
  icon: "👧",
  ministry: "શિક્ષણ વિભાગ, ગુજરાત સરકાર (Department of Education)",
  isActive: true,
  officialSlaDays: 15,
  planningEstimateDays: "3-5 દિવસ",
  implementingAuthority: "શિક્ષણ વિભાગ / Digital Gujarat Portal",
  targetBeneficiary: "ધોરણ ૯ થી ૧૨ માં અભ્યાસ કરતી વિદ્યાર્થિનીઓ",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "વિદ્યાર્થિનીનું આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Bonafide Certificate",
      nameGu: "શાળા પ્રવેશ/બોનાફાઇડ સર્ટિફિકેટ",
      tier: "mandatory",
      digiLockerSupported: false,
      notes: "શાળાના આચાર્ય દ્વારા સહી-સિક્કો"
    },
    {
      name: "Bank Passbook",
      nameGu: "બેંક પાસબુક / કેન્સલ ચેક",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Income Certificate",
      nameGu: "મામલતદાર/TDO આવક દાખલો",
      tier: "conditional",
      digiLockerSupported: true,
      notes: "વાર્ષિક આવક ₹૬ લાખ સુધી"
    }
  ]
},
  {
  id: "namo-saraswati",
  name: "Namo Saraswati Vigyan Sadhana Yojana",
  nameGu: "નમો સરસ્વતી વિજ્ઞાન સાધના યોજના",
  nameHi: "नमो सरस्वती विज्ञान साधना योजना",
  category: "education",
  description: "Gujarat Government scholarship scheme providing ₹25,000 financial incentive to students pursuing Higher Secondary Science Stream (Class 11 & 12).",
  benefits: [
    "ધોરણ ૧૧ અને ૧૨ સાયન્સમાં અભ્યાસ કરતા વિદ્યાર્થીઓને કુલ ₹૨૫,૦૦૦ શિષ્યવૃત્તિ",
    "ધોરણ ૧૧ માં વાર્ષિક ₹૧૦,૦૦૦ (પ્રતિ માસ ₹૧,૦૦૦) અને ધોરણ ૧૨ માં ₹૧૫,૦૦૦ DBT",
    "વિજ્ઞાન અને એન્જિનિયરિંગ/મેડિકલ ક્ષેત્રે કારકિર્દી ઘડવા આર્થિક પ્રોત્સાહન"
  ],
  eligibility: {
    minAge: 15,
    maxAge: 20,
    gender: "all",
    incomeLimit: 600000,
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "આધાર કાર્ડ",
    "ધોરણ ૧૦ બોર્ડ માર્કશીટ",
    "વિજ્ઞાન પ્રવાહ શાળા બોનાફાઇડ",
    "બેંક પાસબુક",
    "આવકનો દાખલો"
  ],
  applicationUrl: "https://gseb.org",
  icon: "🔬",
  ministry: "શિક્ષણ વિભાગ, ગુજરાત સરકાર",
  isActive: true,
  officialSlaDays: 15,
  planningEstimateDays: "3-5 દિવસ",
  implementingAuthority: "શિક્ષણ વિભાગ / GSEB / Digital Gujarat",
  targetBeneficiary: "ધોરણ ૧૧ અને ૧૨ સાયન્સના વિદ્યાર્થીઓ",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Class 10 Marksheet",
      nameGu: "ધોરણ ૧૦ માર્કશીટ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Science Bonafide",
      nameGu: "સાયન્સ સ્કૂલ બોનાફાઇડ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Bank Passbook",
      nameGu: "બેંક ખાતાની વિગત",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "rte-gujarat",
  name: "Right to Education (RTE) Free Admission",
  nameGu: "RTE (Right to Education) મફત શિક્ષણ પ્રવેશ",
  nameHi: "आरटीई मुफ्त शिक्षा प्रवेश योजना",
  category: "education",
  description: "25% mandatory reserved seats in private un-aided primary schools for children of economically weaker sections under Section 12(1)(c) of RTE Act 2009.",
  benefits: [
    "પ્રતિષ્ઠિત ખાનગી પ્રાથમિક શાળાઓમાં ધોરણ ૧ માં ૨૫% અનામત સીટો પર મફત પ્રવેશ",
    "ધોરણ ૧ થી ૮ સુધી વિનામૂલ્યે શિક્ષણ, પુસ્તકો અને ગણવેશ સહાય",
    "સરકાર દ્વારા સીધી શાળાને ફી ચૂકવણી (વાલી પર કોઈ આર્થિક બોજ નહીં)"
  ],
  eligibility: {
    minAge: 5,
    maxAge: 7,
    gender: "all",
    incomeLimit: 150000,
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "બાળકના જન્મનો દાખલો (Birth Certificate)",
    "માતા-પિતાનું આધાર કાર્ડ",
    "રહેઠાણનો પુરાવો (લાઈટબિલ/રેશનકાર્ડ)",
    "આવકનો દાખલો (રૂ. ૧.૨૦ લાખ ગ્રામ્ય / ૧.૫૦ લાખ શહેરી)",
    "જાતિ/કેટેગરી પ્રમાણપત્ર"
  ],
  applicationUrl: "https://rte.orpgujarat.com",
  icon: "🎒",
  ministry: "પ્રાથમિક શિક્ષણ નિયામકની કચેરી, ગુજરાત",
  isActive: true,
  officialSlaDays: 30,
  planningEstimateDays: "10-15 દિવસ",
  implementingAuthority: "પ્રાથમિક શિક્ષણ નિયામક / RTE Gujarat Portal",
  targetBeneficiary: "આર્થિક નબળા વર્ગ (EWS/BPL) ના ૫ થી ૭ વર્ષના બાળકો",
  documentChecklist: [
    {
      name: "Birth Certificate",
      nameGu: "બાળકના જન્મનો દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Parent Aadhaar",
      nameGu: "માતા/પિતાનું આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Address Proof",
      nameGu: "રહેઠાણનો પુરાવો (લાઈટ બિલ/વેરા બિલ)",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Income Certificate",
      nameGu: "મામલતદાર આવક દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Caste Certificate",
      nameGu: "જાતિ પ્રમાણપત્ર (SC/ST/OBC)",
      tier: "conditional",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "gyan-sadhana-scholarship",
  name: "Mukhyamantri Gyan Sadhana Scholarship",
  nameGu: "મુખ્યમંત્રી જ્ઞાન સાધના સ્કોલરશિપ",
  nameHi: "मुख्यमंत्री ज्ञान साधना छात्रवृत्ति",
  category: "education",
  description: "Merit-cum-means scholarship for meritorious students passing Class 8 from government/aided schools to complete Class 9 to 12.",
  benefits: [
    "ધોરણ ૯ અને ૧૦ માટે વાર્ષિક ₹૨૦,૦૦૦ સ્કોલરશિપ",
    "ધોરણ ૧૧ અને ૧૨ માટે વાર્ષિક ₹૨૫,૦૦૦ સ્કોલરશિપ",
    "રાજ્ય પરીક્ષા બોર્ડ (SEB) ની મેરીટ પરીક્ષા આધારે પારદર્શક DBT સહાય"
  ],
  eligibility: {
    minAge: 13,
    maxAge: 18,
    gender: "all",
    incomeLimit: 150000,
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "SEB પરીક્ષા હોલ ટિકિટ / સ્કોરકાર્ડ",
    "આધાર કાર્ડ",
    "શાળા બોનાફાઇડ પ્રમાણપત્ર",
    "આવકનો દાખલો",
    "બેંક પાસબુક"
  ],
  applicationUrl: "https://sebexam.org",
  icon: "📚",
  ministry: "શિક્ષણ વિભાગ અને રાજ્ય પરીક્ષા બોર્ડ (SEB)",
  isActive: true,
  officialSlaDays: 21,
  planningEstimateDays: "5-7 દિવસ",
  implementingAuthority: "રાજ્ય પરીક્ષા બોર્ડ (SEB) / શિક્ષણ વિભાગ",
  targetBeneficiary: "ધોરણ ૮ પાસ તેજસ્વી ગરીબ વિદ્યાર્થીઓ",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "SEB Scorecard",
      nameGu: "SEB મેરીટ સ્કોરકાર્ડ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Income Certificate",
      nameGu: "આવકનો દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Bank Passbook",
      nameGu: "બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "mksy-gujarat",
  name: "Mukhyamantri Kisan Sahay Yojana (MKSY)",
  nameGu: "મુખ્યમંત્રી કિસાન સહાય યોજના (પાક નુકસાની સહાય)",
  nameHi: "मुख्यमंत्री किसान सहाय योजना",
  category: "agriculture",
  description: "Gujarat Government zero-premium crop disaster assistance scheme providing ex-gratia compensation to farmers for drought, heavy rain, or unseasonal rain.",
  benefits: [
    "૩૩% થી ૬૦% પાક નુકસાન માટે ₹૨૦,૦૦૦ પ્રતિ હેક્ટર સહાય (મહત્તમ ૪ હેક્ટર)",
    "૬૦% થી વધુ પાક નુકસાન માટે ₹૨૫,૦૦૦ પ્રતિ હેક્ટર સહાય",
    "ખેડૂતોએ કોઈ પણ વીમા પ્રીમિયમ ચૂકવવાનું નથી, ૧૦૦% સરકારી રાહત"
  ],
  eligibility: {
    occupation: [
      "farmer"
    ],
    minAge: 18,
    maxAge: 99,
    gender: "all",
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "૭/૧૨ અને ૮-અ જમીન નકલ (AnyRoR)",
    "તલાટી વાવેતર પંચનામું / નુકસાની રિપોર્ટ",
    "આધાર કાર્ડ",
    "બેંક પાસબુક"
  ],
  applicationUrl: "https://ikhedut.gujarat.gov.in",
  icon: "🚜",
  ministry: "કૃષિ, ખેડૂત કલ્યાણ અને સહકાર વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 30,
  planningEstimateDays: "7-10 દિવસ",
  implementingAuthority: "i-Khedut Portal / રેવન્યુ વિભાગ ગુજરાત",
  targetBeneficiary: "કુદરતી આપત્તિથી અસરગ્રસ્ત તમામ ખાતેદાર ખેડૂતો",
  documentChecklist: [
    {
      name: "7/12 & 8-A RoR",
      nameGu: "૭/૧૨ અને ૮-અ જમીન ઉતારા",
      tier: "mandatory",
      digiLockerSupported: false,
      notes: "AnyRoR પોર્ટલ પરથી તાજી નકલ"
    },
    {
      name: "Crop Damage Panchnama",
      nameGu: "તલાટી પાક નુકસાની પંચનામું",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Bank Passbook",
      nameGu: "બેંક પાસબુક (Aadhaar Seeded)",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "deshi-gaay-sahay",
  name: "Deshi Gaay Natural Farming Maintenance Sahay",
  nameGu: "દેશી ગાય આધારિત પ્રાકૃતિક ખેતી નિભાવ સહાય",
  nameHi: "देशी गाय आधारित प्राकृतिक खेती सहायता",
  category: "agriculture",
  description: "Financial allowance of ₹900/month (₹10,800/year) to farmers practicing zero-budget natural farming with one indigenous cow to maintain organic fertility.",
  benefits: [
    "પ્રતિ માસ ₹૯૦૦ (વાર્ષિક કુલ ₹૧૦,૮૦૦) સીધા બેંક ખાતામાં DBT મારફતે",
    "જીવામૃત અને ઘનજીવામૃત બનાવવા માટે કિટ સહાય",
    "રસાયણમુક્ત ઝેરમુક્ત પ્રાકૃતિક ખેતીને પ્રોત્સાહન"
  ],
  eligibility: {
    occupation: [
      "farmer"
    ],
    minAge: 18,
    maxAge: 99,
    gender: "all",
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "આધાર કાર્ડ",
    "૭/૧૨ અને ૮-અ જમીન નકલ",
    "પશુ ચિકિત્સક દ્વારા ટેગિંગ સર્ટિફિકેટ (INAPH Tag)",
    "પ્રાકૃતિક કૃષિ માસ્ટર ટ્રેનર તાલીમ પ્રમાણપત્ર"
  ],
  applicationUrl: "https://ikhedut.gujarat.gov.in",
  icon: "🐄",
  ministry: "ગુજરાત પ્રાકૃતિક કૃષિ વિકાસ બોર્ડ / કૃષિ વિભાગ",
  isActive: true,
  officialSlaDays: 21,
  planningEstimateDays: "5-7 દિવસ",
  implementingAuthority: "i-Khedut / પ્રાકૃતિક કૃષિ બોર્ડ",
  targetBeneficiary: "પ્રાકૃતિક ખેતી કરતા એક દેશી ગાય ધરાવતા ખેડૂતો",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "7/12 & 8-A Land Record",
      nameGu: "૭/૧૨ અને ૮-અ જમીન રેકોર્ડ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Cow RFID Tag Certificate",
      nameGu: "ગાયનું ટેગિંગ પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: false,
      notes: "સરકારી પશુ દવાખાના દ્વારા ટેગ"
    },
    {
      name: "Natural Farming Training Certificate",
      nameGu: "તાલીમ પ્રમાણપત્ર",
      tier: "conditional",
      digiLockerSupported: false
    }
  ]
},
  {
  id: "kantali-tar-fencing",
  name: "Barbed Wire Fencing Sahay Yojana",
  nameGu: "કાંટાળી તારની વાડ સહાય યોજના (ખેતર ફેન્સિંગ)",
  nameHi: "कटीले तार की बाड़ सहायता योजना",
  category: "agriculture",
  description: "Capital subsidy for constructing barbed wire fencing around agricultural fields to protect standing crops from wild animals and stray cattle.",
  benefits: [
    "રનિંગ મીટર દીઠ ₹૨૦૦ અથવા ખરેખર ખર્ચના ૫૦% (જે ઓછું હોય તે) સરકારી સબસિડી",
    "જૂથ પદ્ધતિ (ક્લસ્ટર) થી અરજી કરતા ખેડૂતોને અગ્રતા",
    "રોઝ અને ભૂંડ જેવા જંગલી પશુઓથી પાકને કાયમી રક્ષણ"
  ],
  eligibility: {
    occupation: [
      "farmer"
    ],
    minAge: 18,
    maxAge: 99,
    gender: "all",
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "૭/૧૨, ૮-અ અને ગામ નમૂના નં. ૬ ની નકલ",
    "નકશો/ટિપ્પણ અને અક્ષાંશ-રેખાંશ",
    "ક્લસ્ટર ખેડૂતોનું સંમતિપત્રક",
    "બેંક પાસબુક અને આધાર"
  ],
  applicationUrl: "https://ikhedut.gujarat.gov.in",
  icon: "🛡️",
  ministry: "કૃષિ અને ખેડૂત કલ્યાણ વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 45,
  planningEstimateDays: "15-20 દિવસ",
  implementingAuthority: "i-Khedut Portal / બાગાયત & કૃષિ નિયામક",
  targetBeneficiary: "પાક રક્ષણ ઇચ્છુક તમામ ખાતેદાર ખેડૂતો / ખેડૂત જૂથો",
  documentChecklist: [
    {
      name: "7/12 Land Record",
      nameGu: "૭/૧૨ અને ૮-અ નકલ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Field Map / Tippan",
      nameGu: "ખેતરનો નકશો/ટિપ્પણ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Group Consent Letter",
      nameGu: "સંયુક્ત સંમતિપત્રક (ક્લસ્ટર માટે)",
      tier: "conditional",
      digiLockerSupported: false
    },
    {
      name: "Aadhaar & Bank Details",
      nameGu: "આધાર અને બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "pashupalak-kcc",
  name: "Animal Husbandry Kisan Credit Card",
  nameGu: "પશુપાલક કિસાન ક્રેડિટ કાર્ડ (KCC લોન)",
  nameHi: "पशुपालक किसान क्रेडिट कार्ड",
  category: "agriculture",
  description: "Concessional short-term working capital loan up to ₹2 Lakh at 4% subsidized interest rate for dairy farmers and cattle breeders.",
  benefits: [
    "પશુપાલન, ઘાસચારો અને પશુ દવા માટે ₹૨ લાખ સુધીની લોન માત્ર ૪% રાહત દરે",
    "કોઈપણ પ્રકારની સ્થાવર મિલકત ગીરો રાખ્યા વિના સુવિધા",
    "દૂધ મંડળીઓ અને સહકારી બેંકો મારફતે સરળ હપ્તા ભરપાઈ"
  ],
  eligibility: {
    occupation: [
      "farmer",
      "dairy_worker"
    ],
    minAge: 18,
    maxAge: 99,
    gender: "all"
  },
  documents: [
    "આધાર કાર્ડ",
    "દૂધ મંડળી પાસબુક / સભ્યપદ કાર્ડ",
    "પશુ આરોગ્ય પ્રમાણપત્ર",
    "રહેઠાણનો પુરાવો"
  ],
  applicationUrl: "https://ikhedut.gujarat.gov.in",
  icon: "🥛",
  ministry: "પશુપાલન નિયામકની કચેરી & નાબાર્ડ (NABARD)",
  isActive: true,
  officialSlaDays: 14,
  planningEstimateDays: "5-7 દિવસ",
  implementingAuthority: "પશુપાલન નિયામક / સહકારી બેંકો / NABARD",
  targetBeneficiary: "ગાય, ભેંસ કે બકરાં પાળતા સીમાંત પશુપાલકો",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Dairy Society Member Card",
      nameGu: "દૂધ મંડળી સભ્યપદ / પાસબુક",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Animal Health Card",
      nameGu: "પશુ આરોગ્ય તપાસ પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: false
    }
  ]
},
  {
  id: "ganga-swarupa-pension",
  name: "Ganga Swarupa Economic Assistance (Widow Pension)",
  nameGu: "ગંગા સ્વરૂપા આર્થિક સહાય યોજના (વિધવા પેન્શન)",
  nameHi: "गंगा स्वरूपा आर्थिक सहायता योजना",
  category: "women",
  description: "Monthly financial maintenance pension of ₹1,250 provided to destitute widow women in Gujarat to lead a life of dignity and security.",
  benefits: [
    "દર મહિને ₹૧,૨૫૦ આજીવન આર્થિક સહાય સીધી બેંક ખાતામાં જમા",
    "દર વર્ષે જુલાઈમાં પુનર્લગ્ન ન કર્યાનું ડિજિટલ સેલ્ફ-ડિક્લેરેશન સુવિધા",
    "વિધવા બહેનોના બાળકોના ઉચ્ચ શિક્ષણ માટે સરકારી શિષ્યવૃત્તિમાં પ્રાથમિકતા"
  ],
  eligibility: {
    gender: "female",
    minAge: 18,
    maxAge: 99,
    incomeLimit: 150000,
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "પતિના મરણનો દાખલો (Death Certificate)",
    "અરજદારનું આધાર કાર્ડ",
    "રેશનકાર્ડ",
    "મામલતદાર/TDO આવકનો દાખલો (વાર્ષિક ₹૧.૨૦ લાખ ગ્રામ્ય / ₹૧.૫૦ લાખ શહેરી)",
    "પુનર્લગ્ન ન કર્યા અંગેનું પ્રમાણપત્ર"
  ],
  applicationUrl: "https://digitalgujarat.gov.in",
  icon: "🧕",
  ministry: "મહિલા અને બાળ વિકાસ વિભાગ, ગુજરાત સરકાર",
  isActive: true,
  officialSlaDays: 15,
  planningEstimateDays: "5-7 દિવસ",
  implementingAuthority: "Digital Gujarat / મામલતદાર સામાજિક સુરક્ષા કચેરી",
  targetBeneficiary: "નિરાધાર વિધવા બહેનો",
  documentChecklist: [
    {
      name: "Husband Death Certificate",
      nameGu: "પતિના મરણનો દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Aadhaar Card",
      nameGu: "અરજદારનું આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Income Certificate",
      nameGu: "મામલતદાર આવક દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Non-remarriage Affidavit",
      nameGu: "પુનર્લગ્ન ન કર્યાનું સોગંદનામું/પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Ration Card",
      nameGu: "રેશનકાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "kunwarbai-mameru",
  name: "Kunwarbai nu Mameru Yojana",
  nameGu: "કુંવરબાઈનું મામેરું યોજના (કન્યા લગ્ન સહાય)",
  nameHi: "कुंवरबाई नु मामेरू योजना",
  category: "women",
  description: "Financial assistance of ₹12,000 provided by Gujarat Government to daughters belonging to SC, ST, SEBC/OBC, and EWS families upon their marriage.",
  benefits: [
    "કન્યાના લગ્ન પ્રસંગે કન્યાના બેંક ખાતામાં ₹૧૨,૦૦૦ ની સીધી સહાય DBT દ્વારા",
    "ગરીબ પરિવારો પર દીકરીના લગ્ન સમયે આર્થિક બોજ હળવો થાય છે",
    "કુટુંબની પ્રથમ બે પુત્રીઓના લગ્ન સુધી સહાય મળવાપાત્ર"
  ],
  eligibility: {
    gender: "female",
    minAge: 18,
    maxAge: 40,
    incomeLimit: 600000,
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "કન્યા અને વરનું આધાર કાર્ડ",
    "લગ્ન નોંધણી પ્રમાણપત્ર (Marriage Certificate)",
    "કન્યાના પિતાનો આવકનો દાખલો (₹૬ લાખ મર્યાદા)",
    "જાતિનું પ્રમાણપત્ર (Caste Certificate)",
    "શાળા છોડ્યાનું પ્રમાણપત્ર (LC)"
  ],
  applicationUrl: "https://esamajkalyan.gujarat.gov.in",
  icon: "💍",
  ministry: "સામાજિક ન્યાય અને અધિકારીતા વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 21,
  planningEstimateDays: "7-10 દિવસ",
  implementingAuthority: "e-Samaj Kalyan Portal / સમાજ કલ્યાણ અધિકારી",
  targetBeneficiary: "SC/ST/OBC/SEBC/EWS વર્ગની લગ્ન કરતી દીકરીઓ",
  documentChecklist: [
    {
      name: "Marriage Certificate",
      nameGu: "લગ્ન નોંધણી પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Aadhaar Card",
      nameGu: "કન્યા અને વરનું આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Income Certificate",
      nameGu: "પિતાનો આવક દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Caste Certificate",
      nameGu: "જાતિ પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Bank Passbook",
      nameGu: "કન્યાની બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "manav-garima",
  name: "Manav Garima Yojana (Toolkit Sahay)",
  nameGu: "માનવ ગરિમા યોજના (સાધન કિટ સહાય)",
  nameHi: "मानव गरिमा योजना",
  category: "business",
  description: "Self-employment equipment toolkit support worth up to ₹25,000 for 28 traditional trades (tailoring, carpentry, masonry, plumbing, salon, etc.).",
  benefits: [
    "પસંદ કરેલા વ્યવસાય માટે ₹૨૫,૦૦૦ સુધીની મફત આધુનિક ટૂલકિટ સહાય",
    "દરજીકામ, કડિયાકામ, સુથારીકામ, મોબાઈલ રિપેરિંગ સહિત ૨૮ વ્યવસાયો",
    "નાના કારીગરો પોતાની આજીવિકા શરૂ કરી આત્મનિર્ભર બની શકે છે"
  ],
  eligibility: {
    minAge: 18,
    maxAge: 60,
    gender: "all",
    incomeLimit: 600000,
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "આધાર કાર્ડ",
    "રેશનકાર્ડ",
    "જાતિનું પ્રમાણપત્ર",
    "વ્યવસાય તાલીમ અથવા અનુભવ પ્રમાણપત્ર",
    "આવકનો દાખલો (₹૬ લાખ સુધી)"
  ],
  applicationUrl: "https://esamajkalyan.gujarat.gov.in",
  icon: "🧰",
  ministry: "સામાજિક ન્યાય અને અધિકારીતા વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 30,
  planningEstimateDays: "12-15 દિવસ",
  implementingAuthority: "e-Samaj Kalyan Portal / નિયામક અનુસૂચિત જાતિ કલ્યાણ",
  targetBeneficiary: "SC/SEBC/EWS કુટિર વ્યવસાયકારો અને કારીગરો",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Income Certificate",
      nameGu: "આવકનો દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Caste Certificate",
      nameGu: "જાતિ પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Trade Experience / Training",
      nameGu: "ધંધાકીય અનુભવ/તાલીમ પ્રમાણપત્ર",
      tier: "conditional",
      digiLockerSupported: false
    }
  ]
},
  {
  id: "suposhit-mata-bal",
  name: "Suposhit Mata Swasth Bal Yojana",
  nameGu: "સુપોષિત માતા - સ્વસ્થ બાળ યોજના (પોષણ સહાય)",
  nameHi: "सुपोषित माता - स्वस्थ बाल योजना",
  category: "health",
  description: "First 1,000 days nutritional assistance program for pregnant and lactating mothers providing monthly food rations (pulses & oil) to eliminate stunting and anemia.",
  benefits: [
    "ગર્ભાવસ્થાથી બાળકના ૨ વર્ષ સુધી પ્રતિ માસ ૧ કિલો તુવેર દાળ, ૨ કિલો ચણા અને ૧ લિટર સિંગતેલ મફત",
    "આંગણવાડી કેન્દ્રો મારફતે નિયમિત પૌષ્ટિક આહાર વિતરણ અને તબીબી તપાસણી",
    "માતા અને બાળકના આરોગ્ય, વજન અને હિમોગ્લોબિન સ્તરમાં નોંધપાત્ર સુધારો"
  ],
  eligibility: {
    gender: "female",
    minAge: 18,
    maxAge: 45,
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "મમતા કાર્ડ (Mamta Health Card / TeCHO Registration)",
    "આધાર કાર્ડ",
    "આંગણવાડી નોંધણી પુરાવો",
    "બેંક પાસબુક"
  ],
  applicationUrl: "https://wcd.gujarat.gov.in",
  icon: "🤱",
  ministry: "મહિલા અને બાળ વિકાસ વિભાગ, ગુજરાત (ICDS)",
  isActive: true,
  officialSlaDays: 7,
  planningEstimateDays: "2-3 દિવસ",
  implementingAuthority: "ICDS ગુજરાત / આંગણવાડી કેન્દ્રો / TeCHO+",
  targetBeneficiary: "સગર્ભા બહેનો અને ૨ વર્ષ સુધીના બાળકની ધાત્રી માતાઓ",
  documentChecklist: [
    {
      name: "Mamta Card",
      nameGu: "મમતા કાર્ડ (TeCHO ID)",
      tier: "mandatory",
      digiLockerSupported: false,
      notes: "આંગણવાડી કાર્યકર દ્વારા નોંધણી"
    },
    {
      name: "Aadhaar Card",
      nameGu: "માતાનું આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Bank Passbook",
      nameGu: "બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "pm-garib-kalyan-anna",
  name: "PM Garib Kalyan Anna Yojana (PMGKAY)",
  nameGu: "પ્રધાનમંત્રી ગરીબ કલ્યાણ અન્ન યોજના (મફત અનાજ)",
  nameHi: "प्रधानमंत्री गरीब कल्याण अन्न योजना",
  category: "social",
  description: "Central government flagship food security entitlement providing 5 kg free foodgrains per person/month to all NFSA ration cardholders through Dec 2028.",
  benefits: [
    "NFSA રેશનકાર્ડધારકોને પ્રતિ વ્યક્તિ દર મહિને ૫ કિલો ઘઉં/ચોખા તદ્દન મફત",
    "અંત્યોદય (AAY) પરિવારોને પ્રતિ માસ ૩૫ કિલો મફત અનાજ વિતરણ",
    "FPS વાજબી ભાવની દુકાનો પર બાયોમેટ્રિક/OTP ઈ-કેવાયસી આધારિત પારદર્શક વિતરણ"
  ],
  eligibility: {
    minAge: 0,
    maxAge: 99,
    gender: "all"
  },
  documents: [
    "NFSA ડિજિટલ રેશનકાર્ડ (Ration Card)",
    "પરિવારના તમામ સભ્યોનું આધાર કાર્ડ (Aadhaar Seeding)",
    "મોબાઈલ નંબર"
  ],
  applicationUrl: "https://nfsa.gov.in",
  icon: "🍚",
  ministry: "ગ્રાહક બાબતો, અન્ન અને જાહેર વિતરણ મંત્રાલય (MoCAF&PD)",
  isActive: true,
  officialSlaDays: 7,
  planningEstimateDays: "1-2 દિવસ",
  implementingAuthority: "અન્ન અને નાગરિક પુરવઠા વિભાગ / DCS Gujarat",
  targetBeneficiary: "NFSA હેઠળ નોંધાયેલા તમામ ગરીબ અને અંત્યોદય પરિવારો",
  documentChecklist: [
    {
      name: "Digital Ration Card",
      nameGu: "ડિજિટલ રેશનકાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Aadhaar Card",
      nameGu: "પરિવારના સભ્યોનું આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "dhanvantari-rath",
  name: "Dhanvantari Aarogya Rath Seva",
  nameGu: "ધનવંતરી આરોગ્ય રથ સેવા (મોબાઇલ ક્લિનિક)",
  nameHi: "धन्वंतरि आरोग्य रथ सेवा",
  category: "health",
  description: "Mobile medical healthcare clinics delivering on-site OPD, diagnostics, and free medicines at construction sites, worker colonies, and industrial clusters.",
  benefits: [
    "બાંધકામ સાઇટ અને શ્રમિક વસાહતો પર ઘરઆંગણે સ્થળ પર મફત ઓપીડી તપાસ",
    "તાત્કાલિક લેબ ટેસ્ટ (હિમોગ્લોબિન, મેલેરિયા, સુગર, બીપી) અને મફત જેનરિક દવાઓ",
    "ગંભીર બીમારીઓમાં સિવિલ હોસ્પિટલ રેફરલ અને આયુષ્માન ભારત કાર્ડ સહાય"
  ],
  eligibility: {
    minAge: 0,
    maxAge: 99,
    gender: "all"
  },
  documents: [
    "ઈ-નિર્માણ કાર્ડ (બાંધકામ શ્રમિક) અથવા આધાર કાર્ડ / PM-JAY આયુષ્માન કાર્ડ"
  ],
  applicationUrl: "https://enirmanbocw.gujarat.gov.in",
  icon: "🚐",
  ministry: "ગુજરાત મકાન અને અન્ય બાંધકામ શ્રમયોગી કલ્યાણ બોર્ડ (BOCW)",
  isActive: true,
  officialSlaDays: 1,
  planningEstimateDays: "તાત્કાલિક / ઓન-ધ-સ્પોટ",
  implementingAuthority: "BOCW બોર્ડ / આરોગ્ય અને પરિવાર કલ્યાણ વિભાગ",
  targetBeneficiary: "બાંધકામ શ્રમિકો, સ્થળાંતરિત મજૂરો અને સ્લમ વિસ્તારોના નાગરિકો",
  documentChecklist: [
    {
      name: "e-Nirman Card / Aadhaar",
      nameGu: "ઈ-નિર્માણ કાર્ડ અથવા આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "bandhkam-shramik-sahay",
  name: "Construction Worker Accident & Demise Sahay",
  nameGu: "બાંધકામ શ્રમિક અકસ્માત અને મૃત્યુ સહાય (BOCW સહાય)",
  nameHi: "भवन निर्माण श्रमिक दुर्घटना एवं मृत्यु सहायता",
  category: "social",
  description: "Accident insurance compensation up to ₹4 Lakh for registered construction workers (e-Nirman cardholders) in case of accidental death or permanent disability.",
  benefits: [
    "ચાલુ કામે અકસ્માતે અવસાન થવાના કિસ્સામાં કાયદેસરના વારસદારને ₹૪,૦૦,૦૦૦ સહાય",
    "કાયમી સંપૂર્ણ અપંગતામાં ₹૩,૦૦,૦૦૦ અને કાયમી આંશિક અપંગતામાં ₹૧,૫૦,૦૦૦ સહાય",
    "અંતિમ સંસ્કાર સહાય તરીકે તાત્કાલિક ₹૨૫,૦૦૦ ની ચુકવણી"
  ],
  eligibility: {
    occupation: [
      "construction_worker",
      "laborer"
    ],
    minAge: 18,
    maxAge: 60,
    gender: "all",
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "ઈ-નિર્માણ કાર્ડ (e-Nirman Card)",
    "પોલીસ એફઆઈઆર / પંચનામું",
    "પોસ્ટમોર્ટમ રિપોર્ટ / સિવિલ હોસ્પિટલ ડિસેબિલિટી સર્ટિફિકેટ",
    "વારસદારનું આધાર કાર્ડ અને બેંક પાસબુક"
  ],
  applicationUrl: "https://enirmanbocw.gujarat.gov.in",
  icon: "🏗️",
  ministry: "શ્રમ, કૌશલ્ય વિકાસ અને રોજગાર વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 30,
  planningEstimateDays: "10-15 દિવસ",
  implementingAuthority: "BOCW કલ્યાણ બોર્ડ / શ્રમ કમિશનરેટ ગુજરાત",
  targetBeneficiary: "નોંધાયેલા બાંધકામ શ્રમિકો અને તેમના આશ્રિત પરિવારો",
  documentChecklist: [
    {
      name: "e-Nirman Card",
      nameGu: "ઈ-નિર્માણ કાર્ડ (BOCW)",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Police FIR / Panchnama",
      nameGu: "પોલીસ એફઆઈઆર / પંચનામું",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Post Mortem / Medical Report",
      nameGu: "પોસ્ટમોર્ટમ રિપોર્ટ / તબીબી દાખલો",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Nominee Bank Passbook",
      nameGu: "વારસદારની બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "vajpayee-bankable",
  name: "Shri Vajpayee Bankable Yojana (VBY)",
  nameGu: "વાજપેયી બેંકેબલ યોજના (સ્વરોજગાર સબસિડી લોન)",
  nameHi: "श्री वाजपेयी बैंकेबल योजना",
  category: "business",
  description: "Self-employment project loan subsidy scheme providing up to ₹8 Lakh loan for industries and ₹4 Lakh for services/business with 20% to 40% government subsidy.",
  benefits: [
    "ઉદ્યોગ ક્ષેત્રે ₹૮ લાખ અને સેવા/વેપાર ક્ષેત્રે ₹૪ લાખ સુધીની બેંક લોન સહાય",
    "સામાન્ય વર્ગ માટે ૨૦% થી ૨૫% અને મહિલાઓ/SC/ST/દિવ્યાંગો માટે ૪૦% સરકારી સબસિડી (મહત્તમ ₹૧,૨૫,૦૦૦)",
    "બેરોજગાર યુવાનો અને મહિલાઓ માટે પોતાનો સ્વતંત્ર વ્યવસાય શરૂ કરવાની સુવર્ણ તક"
  ],
  eligibility: {
    minAge: 18,
    maxAge: 65,
    gender: "all"
  },
  documents: [
    "આધાર કાર્ડ",
    "શાળા છોડ્યાનું પ્રમાણપત્ર / શૈક્ષણિક લાયકાત (ધોરણ ૪ પાસ અથવા ITI)",
    "પ્રોજેક્ટ રિપોર્ટ / ખરીદવાના સાધનોનું ક્વોટેશન",
    "જાતિનું પ્રમાણપત્ર (સબસિડી ક્લેમ માટે)",
    "બેંક પાસબુક"
  ],
  applicationUrl: "https://blp.gujarat.gov.in",
  icon: "🏪",
  ministry: "કુટીર અને ગ્રામોદ્યોગ કમિશનરેટ, ગુજરાત",
  isActive: true,
  officialSlaDays: 30,
  planningEstimateDays: "10-15 દિવસ",
  implementingAuthority: "કુટીર અને ગ્રામોદ્યોગ કમિશનરેટ / Bankable Loan Portal",
  targetBeneficiary: "૧૮ થી ૬૫ વર્ષના શિક્ષિત બેરોજગાર યુવાનો અને મહિલા ઉદ્યોગસાહસિકો",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "School Leaving / Qualification",
      nameGu: "શાળા છોડ્યાનું પ્રમાણપત્ર / માર્કશીટ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Project Quotation",
      nameGu: "સાધનોનું ક્વોટેશન / પ્રોજેક્ટ રિપોર્ટ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Caste Certificate",
      nameGu: "જાતિ પ્રમાણપત્ર (જો લાગુ પડતું હોય)",
      tier: "conditional",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "dattopant-thengadi-karigar",
  name: "Dattopant Thengadi Artisan Interest Subsidy",
  nameGu: "દત્તોપંત ઠેંગડી કારીગર વ્યાજ સહાય યોજના",
  nameHi: "दत्तोपंत ठेंगड़ी कारीगर ब्याज सहायता",
  category: "business",
  description: "Interest subvention scheme offering up to 7% annual interest subsidy for 3 years on bank loans up to ₹1 Lakh for handloom weavers and handicraft artisans.",
  benefits: [
    "હાથશાળ અને હસ્તકળા કારીગરોને બેંક ધિરાણ પર વાર્ષિક ૭% વ્યાજ સહાય (૩ વર્ષ સુધી)",
    "કારીગર ક્રેડિટ કાર્ડ અથવા મુદ્રા લોન પર વ્યાજ બોજમાં જંગી રાહત",
    "પરંપરાગત કળા, ભરતકામ, બાંધણી, માટીકામ અને કાષ્ઠકળા કારીગરોનું આર્થિક રક્ષણ"
  ],
  eligibility: {
    occupation: [
      "artisan",
      "weaver"
    ],
    minAge: 18,
    maxAge: 99,
    gender: "all",
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "કારીગર ઓળખપત્ર (Pehchan ID Card / Artisan Certificate)",
    "આધાર કાર્ડ",
    "બેંક લોન મંજૂરી પત્ર અને વ્યાજ સ્ટેટમેન્ટ",
    "બેંક પાસબુક"
  ],
  applicationUrl: "https://cottage.gujarat.gov.in",
  icon: "🧶",
  ministry: "કુટીર અને ગ્રામોદ્યોગ કમિશનરેટ, ગુજરાત",
  isActive: true,
  officialSlaDays: 21,
  planningEstimateDays: "7-10 દિવસ",
  implementingAuthority: "કુટીr કમિશનરેટ / ઇન્ડસ્ટ્રીઝ કમિશનરેટ",
  targetBeneficiary: "હાથશાળ વણકરો અને હસ્તકળાના નોંધાયેલા કારીગરો",
  documentChecklist: [
    {
      name: "Artisan Pehchan Card",
      nameGu: "કારીગર ઓળખ કાર્ડ (Pehchan Card)",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Bank Loan Sanction Letter",
      nameGu: "બેંક લોન મંજૂરી પત્ર",
      tier: "mandatory",
      digiLockerSupported: false
    }
  ]
},

  // ── 10. EXTRA EXPLORATION SCHEMES (14 ADDITIONAL EXPANSION SCHEMES) ──
  {
  id: "pmjjby",
  name: "PM Jeevan Jyoti Bima Yojana (PMJJBY)",
  nameGu: "પ્રધાનમંત્રી જીવન જ્યોતિ વીમા યોજના",
  nameHi: "प्रधानमंत्री जीवन ज्योति बीमा योजना",
  category: "social",
  description: "Affordable renewable life insurance scheme offering ₹2 Lakh life cover for death due to any cause at an annual premium of just ₹436.",
  benefits: [
    "કોઈપણ કારણસર મૃત્યુ થવાના કિસ્સામાં વારસદારને ₹૨,૦૦,૦૦૦ નું જીવન વીમા કવચ",
    "વાર્ષિક માત્ર ₹૪૩૬ નું નજીવું પ્રીમિયમ સીધું બેંક ખાતામાંથી ઓટો-ડેબિટ",
    "કોઈપણ તબીબી તપાસણી વગર ૧૮ થી ૫૦ વર્ષના નાગરિકો માટે સરળ નોંધણી"
  ],
  eligibility: {
    minAge: 18,
    maxAge: 50,
    gender: "all"
  },
  documents: [
    "આધાર કાર્ડ (Aadhaar Card)",
    "બેંક પાસબુક (Aadhaar Seeded Bank Account)",
    "વારસદારની વિગત (Nominee Details)",
    "ઓટો-ડેબિટ સંમતિપત્રક"
  ],
  applicationUrl: "https://jansuraksha.gov.in",
  icon: "☂️",
  ministry: "નાણાકીય સેવા વિભાગ (DFS), નાણાં મંત્રાલય",
  isActive: true,
  officialSlaDays: 7,
  planningEstimateDays: "૧-૨ દિવસ",
  implementingAuthority: "તમામ કોમર્શિયલ & ગ્રામીણ બેંકો / LIC",
  targetBeneficiary: "૧૮ થી ૫૦ વર્ષની વયના તમામ બેંક ખાતાધારકો",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Bank Passbook",
      nameGu: "બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Auto Debit Consent",
      nameGu: "ઓટો-ડેબિટ ફોર્મ",
      tier: "mandatory",
      digiLockerSupported: false
    }
  ]
},
  {
  id: "pmsby",
  name: "PM Suraksha Bima Yojana (PMSBY)",
  nameGu: "પ્રધાનમંત્રી સુરક્ષા વીમા યોજના (અકસ્માત વીમો)",
  nameHi: "प्रधानमंत्री सुरक्षा बीमा योजना",
  category: "social",
  description: "Accident insurance scheme providing ₹2 Lakh cover for accidental death or permanent total disability at an annual premium of just ₹20.",
  benefits: [
    "અકસ્માતે મૃત્યુ અથવા કાયમી સંપૂર્ણ અપંગતામાં ₹૨,૦૦,૦૦૦ નું આર્થિક કવચ",
    "કાયમી આંશિક અપંગતાના કિસ્સામાં ₹૧,૦૦,૦૦૦ સહાય",
    "વાર્ષિક માત્ર ₹૨૦ ના પ્રીમિયમ પર ગરીબ અને શ્રમિક પરિવારોનું સુરક્ષા કવચ"
  ],
  eligibility: {
    minAge: 18,
    maxAge: 70,
    gender: "all"
  },
  documents: [
    "આધાર કાર્ડ",
    "બચત બેંક ખાતું",
    "વારસદાર ઓળખપત્ર"
  ],
  applicationUrl: "https://jansuraksha.gov.in",
  icon: "🛡️",
  ministry: "નાણાકીય સેવા વિભાગ, ભારત સરકાર",
  isActive: true,
  officialSlaDays: 7,
  planningEstimateDays: "૧-૨ દિવસ",
  implementingAuthority: "તમામ બેંકો / જન સુરક્ષા પોર્ટલ",
  targetBeneficiary: "૧૮ થી ૭૦ વર્ષના તમામ બેંક ખાતાધારક નાગરિકો",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Bank Account Details",
      nameGu: "બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "standup-india",
  name: "Stand-Up India Scheme",
  nameGu: "સ્ટેન્ડ-અપ ઇન્ડિયા યોજના (ઉદ્યોગ સાહસિક લોન)",
  nameHi: "स्टैंड-अप इंडिया योजना",
  category: "business",
  description: "Bank loans between ₹10 Lakh and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.",
  benefits: [
    "ઉત્પાદન, સેવા અથવા વેપાર ક્ષેત્રમાં ₹૧૦ લાખ થી ₹૧ કરોડ સુધીની બેંક લોન સહાય",
    "અનુસૂચિત જાતિ (SC), અનુસૂચિત જનજાતિ (ST) અને મહિલા સાહસિકોને અગ્રતા",
    "ક્રેડિટ ગેરંટી ફંડ સ્કીમ (CGFSI) દ્વારા મુક્ત ગેરંટી કવચ"
  ],
  eligibility: {
    minAge: 18,
    maxAge: 65,
    gender: "all",
    category: [
      "SC",
      "ST"
    ]
  },
  documents: [
    "આધાર કાર્ડ અને પાન કાર્ડ",
    "જાતિનું પ્રમાણપત્ર (SC/ST માટે)",
    "પ્રોજેક્ટ રિપોર્ટ અને બિઝનેસ પ્લાન",
    "કચેરી/ફેક્ટરીનું સરનામું અને લીઝ એગ્રીમેન્ટ",
    "છેલ્લા ૩ વર્ષના આઈટી રિટર્ન / બેંક સ્ટેટમેન્ટ"
  ],
  applicationUrl: "https://standupmitra.in",
  icon: "🚀",
  ministry: "નાણાં મંત્રાલય અને સિડબી (SIDBI)",
  isActive: true,
  officialSlaDays: 30,
  planningEstimateDays: "૧૨-૧૫ દિવસ",
  implementingAuthority: "SIDBI / તમામ શેડ્યુલ્ડ કોમર્શિયલ બેંકો",
  targetBeneficiary: "SC, ST અને મહિલા ગ્રીનફિલ્ડ ઉદ્યોગસાહસિકો",
  documentChecklist: [
    {
      name: "PAN & Aadhaar",
      nameGu: "પાન અને આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Caste Certificate",
      nameGu: "જાતિ પ્રમાણપત્ર",
      tier: "conditional",
      digiLockerSupported: true
    },
    {
      name: "Project Report",
      nameGu: "પ્રોજેક્ટ રિપોર્ટ અને એસ્ટીમેટ",
      tier: "mandatory",
      digiLockerSupported: false
    }
  ]
},
  {
  id: "pmegp",
  name: "Prime Minister's Employment Generation Programme (PMEGP)",
  nameGu: "પ્રધાનમંત્રી રોજગાર નિર્માણ કાર્યક્રમ (PMEGP સબસિડી)",
  nameHi: "प्रधानमंत्री रोजगार सृजन कार्यक्रम",
  category: "business",
  description: "Credit-linked subsidy programme offering up to 35% government subsidy on project loans up to ₹50 Lakh for manufacturing and ₹20 Lakh for services.",
  benefits: [
    "મેન્યુફેક્ચરિંગ સેક્ટરમાં ₹૫૦ લાખ અને સર્વિસ સેક્ટરમાં ₹૨૦ લાખ સુધી લોન",
    "ગ્રામીણ વિસ્તારમાં સામાન્ય વર્ગ માટે ૨૫% અને અનામત વર્ગ/મહિલાઓ માટે ૩૫% સરકારી સબસિડી",
    "શહેરી વિસ્તારમાં ૧૫% થી ૨૫% કેપિટલ સબસિડી સીધી બેંકમાં જમા"
  ],
  eligibility: {
    minAge: 18,
    maxAge: 99,
    gender: "all"
  },
  documents: [
    "આધાર કાર્ડ",
    "શૈક્ષણિક લાયકાત (ધોરણ ૮ પાસ માર્કશીટ)",
    "પ્રોજેક્ટ રિપોર્ટ (DPR)",
    "સ્પેશિયલ કેટેગરી/જાતિ પ્રમાણપત્ર",
    "રૂરલ એરિયા સર્ટિફિકેટ (ગ્રામ્ય વિસ્તાર સબસિડી માટે)"
  ],
  applicationUrl: "https://kviconline.gov.in",
  icon: "🏭",
  ministry: "સૂક્ષ્મ, લઘુ અને મધ્યમ ઉદ્યોગ મંત્રાલય (MoMSME)",
  isActive: true,
  officialSlaDays: 45,
  planningEstimateDays: "૧૫-૨૦ દિવસ",
  implementingAuthority: "KVIC / KVIB / જિલ્લા ઉદ્યોગ કેન્દ્ર (DIC)",
  targetBeneficiary: "નવો સ્વરોજગાર શરૂ કરવા માંગતા ૧૮+ વર્ષના યુવાનો",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Class 8+ Marksheet",
      nameGu: "શૈક્ષણિક લાયકાત પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Detailed Project Report",
      nameGu: "પ્રોજેક્ટ વિગતવાર અહેવાલ (DPR)",
      tier: "mandatory",
      digiLockerSupported: false
    }
  ]
},
  {
  id: "pmksy-irrigation",
  name: "PM Krishi Sinchayee Yojana (Micro Irrigation)",
  nameGu: "PM કૃષિ સિંચાઈ યોજના (ટપક & ફુવારા સિંચાઈ)",
  nameHi: "प्रधानमंत्री कृषि सिंचाई योजना",
  category: "agriculture",
  description: "Comprehensive drip and sprinkler micro-irrigation subsidy scheme covering up to 70% of installation cost under 'Per Drop More Crop'.",
  benefits: [
    "ટપક (Drip) અને ફુવારા (Sprinkler) સિંચાઈ પદ્ધતિ પર ૫૫% થી ૭૦% સરકારી સબસિડી",
    "પાણી અને વીજળીની ૫૦% સુધી બચત અને પાક ઉત્પાદનમાં ૩૦% વધારો",
    "ગુજરાત ગ્રીન રિવોલ્યુશન કંપની (GGRC) દ્વારા સીધી ચુકવણી અને વોરંટી"
  ],
  eligibility: {
    occupation: [
      "farmer"
    ],
    minAge: 18,
    maxAge: 99,
    gender: "all",
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "૭/૧૨ અને ૮-અ જમીન નકલ",
    "પાણીનો સ્ત્રોત પુરાવો (કૂવો/બોરવેલ/કેનાલ સંમતિ)",
    "વીજ કનેક્શન બિલ",
    "આધાર કાર્ડ અને બેંક પાસબુક"
  ],
  applicationUrl: "https://ggrc.co.in",
  icon: "💧",
  ministry: "કૃષિ મંત્રાલય અને GGRC ગુજરાત",
  isActive: true,
  officialSlaDays: 30,
  planningEstimateDays: "૧૦-૧૨ દિવસ",
  implementingAuthority: "ગુજરાત ગ્રીન રિવોલ્યુશન કંપની (GGRC) / i-Khedut",
  targetBeneficiary: "ખેતીની જમીન અને સિંચાઈ સ્ત્રોત ધરાવતા ખેડૂતો",
  documentChecklist: [
    {
      name: "7/12 Land Record",
      nameGu: "૭/૧૨ અને ૮-અ ઉતારા",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Electricity Bill",
      nameGu: "કૃષિ વીજ કનેક્શન બિલ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "soil-health-card",
  name: "Soil Health Card Scheme",
  nameGu: "સોઇલ હેલ્થ કાર્ડ યોજના (જમીન આરોગ્ય ચકાસણી)",
  nameHi: "मृदा स्वास्थ्य कार्ड योजना",
  category: "agriculture",
  description: "Free laboratory soil nutrient testing providing scientific crop-wise fertilizer dosage recommendations to improve farm soil fertility and reduce input cost.",
  benefits: [
    "ખેતરની માટીનું ૧૨ મુખ્ય પોષક તત્વો (N, P, K, માઇક્રોન્યુટ્રિઅન્ટ્સ) માટે મફત પૃથ્થકરણ",
    "જમીનને અનુરૂપ ખાતરના સચોટ ડોઝની ભલામણ પત્રિકા (સોઈલ હેલ્થ કાર્ડ)",
    "બિનજરૂરી રાસાયણિક ખાતરોનો ખર્ચ ઘટે છે અને જમીનની ફળદ્રુપતા જળવાય છે"
  ],
  eligibility: {
    occupation: [
      "farmer"
    ],
    minAge: 18,
    maxAge: 99,
    gender: "all"
  },
  documents: [
    "૭/૧૨ જમીન નકલ",
    "આધાર કાર્ડ",
    "મોબાઈલ નંબર"
  ],
  applicationUrl: "https://soilhealth.dac.gov.in",
  icon: "🧪",
  ministry: "કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય, ભારત સરકાર",
  isActive: true,
  officialSlaDays: 21,
  planningEstimateDays: "૫-૭ દિવસ",
  implementingAuthority: "જિલ્લા માટી ચકાસણી પ્રયોગશાળા / i-Khedut",
  targetBeneficiary: "ગુજરાતના તમામ ખાતેદાર ખેડૂતો",
  documentChecklist: [
    {
      name: "7/12 RoR",
      nameGu: "૭/૧૨ જમીન નકલ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "dr-ambedkar-awas",
  name: "Dr. Ambedkar Awas Yojana",
  nameGu: "ડૉ. આંબેડકર આવાસ યોજના (મકાન બાંધકામ સહાય)",
  nameHi: "डॉ. आंबेडकर आवास योजना",
  category: "housing",
  description: "Gujarat Social Justice department financial assistance of ₹1,20,000 in 3 installments for constructing pucca house on owned plot for SC families.",
  benefits: [
    "પાકું મકાન બનાવવા માટે કુલ ₹૧,૨૦,૦૦૦ ની સીધી સરકારી સહાય (૩ હપ્તામાં)",
    "શૌચાલય બાંધકામ માટે સ્વચ્છ ભારત મિશન હેઠળ વધારાના ₹૧૨,૦૦૦ સહાય",
    "અનુસૂચિત જાતિ (SC) ના બેઘર અથવા કાચા છાપરામાં રહેતા પરિવારો માટે કાયમી આશરો"
  ],
  eligibility: {
    minAge: 18,
    maxAge: 99,
    gender: "all",
    incomeLimit: 150000,
    category: [
      "SC"
    ],
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "આધાર કાર્ડ",
    "જાતિ પ્રમાણપત્ર (SC સર્ટિફિકેટ)",
    "પ્લોટ/જમીન માલિકીનો દસ્તાવેજ અથવા સનદ",
    "આવકનો દાખલો (રૂ. ૧.૨૦ લાખ ગ્રામ્ય / ૧.૫૦ લાખ શહેરી)",
    "કાચા મકાનનો ફોટો"
  ],
  applicationUrl: "https://esamajkalyan.gujarat.gov.in",
  icon: "🏡",
  ministry: "સામાજિક ન્યાય અને અધિકારીતા વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 45,
  planningEstimateDays: "૧૫-૨૦ દિવસ",
  implementingAuthority: "e-Samaj Kalyan Portal / જિલ્લા સમાજ કલ્યાણ અધિકારી",
  targetBeneficiary: "અનુસૂચિત જાતિ (SC) ના કાચા મકાનમાં રહેતા પરિવારો",
  documentChecklist: [
    {
      name: "Caste Certificate",
      nameGu: "SC જાતિ પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Plot Ownership / Sanad",
      nameGu: "પ્લોટ માલિકી દસ્તાવેજ/સનદ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Income Certificate",
      nameGu: "આવકનો દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "saraswati-sadhana-cycle",
  name: "Saraswati Sadhana Yojana (Free Bicycle for Girls)",
  nameGu: "સરસ્વતી સાધના યોજના (કન્યાઓને મફત સાયકલ સહાય)",
  nameHi: "सरस्वती साधना योजना",
  category: "education",
  description: "Free brand-new bicycle distributed to SC and developing caste girl students studying in Class 9 to enable safe and convenient daily school commute.",
  benefits: [
    "ધોરણ ૯ માં પ્રવેશ મેળવતી દીકરીઓને વિનામૂલ્યે નવી બ્રાન્ડેડ સાયકલનું વિતરણ",
    "ગામડેથી શાળાનું અંતર કાપવામાં સરળતા અને મુસાફરી ખર્ચમાં ૧૦૦% રાહત",
    "કન્યા કેળવણીમાં ઉત્સાહ અને માધ્યમિક શાળા ડ્રોપઆઉટ રેટમાં ઘટાડો"
  ],
  eligibility: {
    minAge: 13,
    maxAge: 17,
    gender: "female",
    category: [
      "SC",
      "OBC"
    ],
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "વિદ્યાર્થિનીનું આધાર કાર્ડ",
    "ધોરણ ૮ પાસ માર્કશીટ",
    "ધોરણ ૯ શાળા પ્રવેશ/બોનાફાઇડ સર્ટિફિકેટ",
    "જાતિનું પ્રમાણપત્ર"
  ],
  applicationUrl: "https://esamajkalyan.gujarat.gov.in",
  icon: "🚲",
  ministry: "સામાજિક ન્યાય અને અધિકારીતા વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 15,
  planningEstimateDays: "૩-૫ દિવસ",
  implementingAuthority: "શાળા આચાર્ય / e-Samaj Kalyan",
  targetBeneficiary: "ધોરણ ૯ માં અભ્યાસ કરતી અનુસૂચિત અને પછાત વર્ગની દીકરીઓ",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "વિદ્યાર્થિનીનું આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "School Bonafide",
      nameGu: "ધોરણ ૯ બોનાફાઇડ સર્ટિફિકેટ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Caste Certificate",
      nameGu: "જાતિ પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "vidya-lakshmi-bond",
  name: "Vidya Lakshmi Bond Yojana",
  nameGu: "વિદ્યા લક્ષ્મી બોન્ડ યોજના (કન્યા પ્રવેશ પ્રોત્સાહન)",
  nameHi: "विद्या लक्ष्मी बॉन्ड योजना",
  category: "education",
  description: "Government incentive bond of ₹2,000 presented in the name of girl child upon enrollment in Class 1 in low female-literacy villages of Gujarat.",
  benefits: [
    "ધોરણ ૧ માં પ્રવેશ લેતી કન્યાના નામે ₹૨,૦૦૦ નો વિદ્યા લક્ષ્મી બોન્ડ",
    "ધોરણ ૮ સફળતાપૂર્વક પાસ કર્યા બાદ વ્યાજ સહિત પાકતી મુદતે નાણાં ઉપલબ્ધ",
    "ઓછી સ્ત્રી સાક્ષરતા ધરાવતા ગ્રામીણ વિસ્તારોમાં કન્યા શિક્ષણને પ્રોત્સાહન"
  ],
  eligibility: {
    minAge: 5,
    maxAge: 8,
    gender: "female",
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "બાળકીના જન્મનો દાખલો",
    "માતા-પિતાનું આધાર કાર્ડ",
    "શાળા પ્રવેશ પ્રમાણપત્ર",
    "રેશનકાર્ડ"
  ],
  applicationUrl: "https://gujaratindia.gov.in",
  icon: "📜",
  ministry: "પ્રાથમિક શિક્ષણ નિયામકની કચેરી, ગુજરાત",
  isActive: true,
  officialSlaDays: 15,
  planningEstimateDays: "૩-૫ દિવસ",
  implementingAuthority: "પ્રાથમિક શિક્ષણ વિભાગ / તાલુકા પ્રાથમિક શિક્ષણાધિકારી (TPEO)",
  targetBeneficiary: "ગ્રામીણ વિસ્તારમાં ધોરણ ૧ માં પ્રવેશ મેળવતી દીકરીઓ",
  documentChecklist: [
    {
      name: "Birth Certificate",
      nameGu: "જન્મનો દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "School Enrollment",
      nameGu: "શાળા પ્રવેશ પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: false
    }
  ]
},
  {
  id: "pak-sangrah-godown",
  name: "Mukhyamantri Pak Sangrah Sanrachna (Godown Sahay)",
  nameGu: "મુખ્યમંત્રી પાક સંગ્રહ સંરચના યોજના (ગોડાઉન સહાય)",
  nameHi: "मुख्यमंत्री फसल भंडारण संरचना योजना",
  category: "agriculture",
  description: "State capital subsidy of ₹75,000 for constructing on-farm storage godown to protect harvested agricultural produce from moisture, pests, and unseasonal rain.",
  benefits: [
    "ખેતરમાં પાક સંગ્રહ માટે ગોડાઉન બાંધવા ₹૭૫,૦૦૦ અથવા ખર્ચના ૫૦% સબસિડી સીધી DBT મારફતે",
    "લણણી પછીના પાકને વરસાદ, ભેજ, કીટકો અને ઉંદરથી સુરક્ષિત રાખી શકાય છે",
    "બજારભાવ સારા મળે ત્યાં સુધી ખેડૂત પોતાનો પાક સાચવી શકે છે (Distress Sale અટકે છે)"
  ],
  eligibility: {
    occupation: [
      "farmer"
    ],
    minAge: 18,
    maxAge: 99,
    gender: "all",
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "૭/૧૨ અને ૮-અ જમીન નકલ",
    "બાંધકામ કરવાનો નકશો અને એસ્ટીમેટ",
    "આધાર કાર્ડ અને બેંક પાસબુક",
    "બાંધકામ પૂર્ણ થયા પછી જીઓ-ટેગિંગ ફોટો"
  ],
  applicationUrl: "https://ikhedut.gujarat.gov.in",
  icon: "🏬",
  ministry: "કૃષિ અને ખેડૂત કલ્યાણ વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 30,
  planningEstimateDays: "૧૦-૧૨ દિવસ",
  implementingAuthority: "i-Khedut Portal / જિલ્લા ખેતીવાડી અધિકારી",
  targetBeneficiary: "ગુજરાતના તમામ ખાતેદાર ખેડૂતો",
  documentChecklist: [
    {
      name: "7/12 Land Record",
      nameGu: "૭/૧૨ અને ૮-અ જમીન નકલ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Godown Estimate / Plan",
      nameGu: "બાંધકામ નકશો/એસ્ટીમેટ",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Aadhaar & Bank Details",
      nameGu: "આધાર અને બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "smart-toolkit-iti",
  name: "Smart Tool Kit Sahay for ITI Trainees",
  nameGu: "ITI તાલીમાર્થીઓ માટે સ્માર્ટ ટૂલકિટ સહાય",
  nameHi: "आईटीआई प्रशिक्षुओं के लिए स्मार्ट टूलकिट सहायता",
  category: "education",
  description: "Modern professional toolkit assistance provided to ITI trainees upon successful course completion to start immediate self-employment or technical freelancing.",
  benefits: [
    "ઈલેક્ટ્રિશિયન, ફિટર, વેલ્ડર, પ્લમ્બર, ડીઝલ મિકેનિક જેવા ટ્રેડ માટે ₹૧૫,૦૦૦ સુધીની મફત ટૂલકિટ",
    "આધુનિક બ્રાન્ડેડ સાધનોથી યુવાન તાલીમ પૂરી થતાં જ તાત્કાલિક કમાણી શરૂ કરી શકે છે",
    "ઉદ્યોગસાહસિકતા અને સ્થાનિક રોજગાર નિર્માણને પ્રોત્સાહન"
  ],
  eligibility: {
    minAge: 18,
    maxAge: 35,
    gender: "all",
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "આધાર કાર્ડ",
    "ITI પાસ સર્ટિફિકેટ / નેશનલ ટ્રેડ સર્ટિફિકેટ (NTC)",
    "રેશનકાર્ડ",
    "બેંક પાસબુક"
  ],
  applicationUrl: "https://iti.gujarat.gov.in",
  icon: "🔧",
  ministry: "શ્રમ, કૌશલ્ય વિકાસ અને રોજગાર વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 21,
  planningEstimateDays: "૫-૭ દિવસ",
  implementingAuthority: "રોજગાર અને તાલીમ નિયામકની કચેરી (DET Gujarat)",
  targetBeneficiary: "સરકારી અથવા ગ્રાન્ટેડ ITI માંથી પાસ થયેલા તાલીમાર્થીઓ",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "ITI NTC Certificate",
      nameGu: "ITI પાસિંગ પ્રમાણપત્ર",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "vrudh-pension-central",
  name: "Indira Gandhi National Old Age Pension (IGNOAPS)",
  nameGu: "ઇન્દિરા ગાંધી રાષ્ટ્રીય વૃદ્ધ પેન્શન સહાય (IGNOAPS)",
  nameHi: "इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना",
  category: "social",
  description: "Central government social assistance monthly pension for BPL senior citizens aged 60 and above to provide elderly social security.",
  benefits: [
    "૬૦ થી ૭૯ વર્ષના વૃદ્ધોને પ્રતિ માસ ₹૧,૦૦૦ અને ૮૦ વર્ષથી વધુ વયના વૃદ્ધોને પ્રતિ માસ ₹૧,૨૫૦ પેન્શન",
    "સીધા બેંક અથવા પોસ્ટ ઓફિસ ખાતામાં DBT દ્વારા દર મહિને નિયમિત જમા",
    "વૃદ્ધાવસ્થામાં આર્થિક સ્વાવલંબન અને ગૌરવપૂર્ણ જીવનનો આધાર"
  ],
  eligibility: {
    minAge: 60,
    maxAge: 99,
    gender: "all",
    incomeLimit: 150000
  },
  documents: [
    "આધાર કાર્ડ / ઉંમરનો પુરાવો",
    "BPL પ્રમાણપત્ર / BPL સ્કોરકાર્ડ",
    "બેંક અથવા પોસ્ટ ઓફિસ પાસબુક",
    "રેશનકાર્ડ"
  ],
  applicationUrl: "https://nsap.nic.in",
  icon: "🧓",
  ministry: "ગ્રામ વિકાસ મંત્રાલય, ભારત સરકાર (NSAP)",
  isActive: true,
  officialSlaDays: 30,
  planningEstimateDays: "૧૦-૧૫ દિવસ",
  implementingAuthority: "NSAP / મામલતદાર સામાજિક સુરક્ષા શાખા",
  targetBeneficiary: "૬૦ વર્ષથી વધુ ઉંમરના BPL વૃદ્ધ નાગરિકો",
  documentChecklist: [
    {
      name: "Aadhaar / Age Proof",
      nameGu: "આધાર કાર્ડ / શાળા છોડ્યાનો દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "BPL Certificate",
      nameGu: "BPL કાર્ડ / યાદીમાં નામનો દાખલો",
      tier: "mandatory",
      digiLockerSupported: false
    },
    {
      name: "Bank Passbook",
      nameGu: "બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "naps-apprenticeship",
  name: "National Apprenticeship Promotion Scheme (NAPS)",
  nameGu: "રાષ્ટ્રીય એપ્રેન્ટિસશીપ પ્રોત્સાહન યોજના (NAPS સ્ટાઈપેન્ડ)",
  nameHi: "राष्ट्रीय शिक्षुता प्रोत्साहन योजना",
  category: "business",
  description: "Government stipend financial support sharing 25% of prescribed stipend up to ₹1,500/month per apprentice with industrial employers.",
  benefits: [
    "તાલીમાર્થીઓને પ્રતિ માસ ₹૬,૦૦૦ થી ₹૧૫,૦૦૦ સુધીનું નિશ્ચિત સ્ટાઈપેન્ડ",
    "સરકાર દ્વારા સીધા ખાતામાં ₹૧,૫૦૦ પ્રતિ માસ DBT સહાય",
    "ટોચની ઔદ્યોગિક કંપનીઓમાં ઓન-ધ-જોબ વ્યવહારુ કાર્ય અનુભવ"
  ],
  eligibility: {
    minAge: 16,
    maxAge: 35,
    gender: "all"
  },
  documents: [
    "આધાર કાર્ડ",
    "૧૦મું/૧૨મું/ITI/ડિપ્લોમા/ડિગ્રી માર્કશીટ",
    "બેંક પાસબુક",
    "રિઝ્યુમ / બાયોડેટા"
  ],
  applicationUrl: "https://apprenticeshipindia.gov.in",
  icon: "🎓",
  ministry: "કૌશલ્ય વિકાસ અને ઉદ્યોગસાહસિકતા મંત્રાલય (MSDE)",
  isActive: true,
  officialSlaDays: 14,
  planningEstimateDays: "૩-૫ દિવસ",
  implementingAuthority: "MSDE / NSDC / રાજ્ય એપ્રેન્ટિસશીપ એડવાઈઝર",
  targetBeneficiary: "૧૬ થી ૩૫ વર્ષના ડિપ્લોમા, આઈટીઆઈ અને ગ્રેજ્યુએટ યુવાનો",
  documentChecklist: [
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Educational Qualification",
      nameGu: "શૈક્ષણિક લાયકાત માર્કશીટ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Bank Account Details",
      nameGu: "બેંક પાસબુક",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
  {
  id: "sant-surdas-divyang",
  name: "Sant Surdas Divyang Pension Yojana",
  nameGu: "સંત સૂરદાસ દિવ્યાંગ પેન્શન સહાય યોજના",
  nameHi: "संत सूरदास दिव्यांग पेंशन योजना",
  category: "social",
  description: "Gujarat State disability pension scheme providing ₹1,000 monthly financial maintenance to severely disabled individuals with 80% or more disability.",
  benefits: [
    "૮૦% કે તેથી વધુ વિકલાંગતા ધરાવતા દિવ્યાંગ નાગરિકોને દર મહિને ₹૧,૦૦૦ આજીવન સહાય",
    "સીધા દિવ્યાંગ લાભાર્થીના બેંક ખાતામાં DBT દ્વારા માસિક જમા",
    "દિવ્યાંગ સાધનો અને કૃત્રિમ અંગો માટે શિબિરોમાં વિનામૂલ્યે સહાય"
  ],
  eligibility: {
    minAge: 0,
    maxAge: 99,
    gender: "all",
    incomeLimit: 150000,
    state: [
      "Gujarat"
    ]
  },
  documents: [
    "દિવ્યાંગતા ઓળખપત્ર (UDID Card - 80%+ સર્ટિફિકેટ)",
    "આધાર કાર્ડ",
    "આવકનો દાખલો (રૂ. ૧.૨૦ લાખ ગ્રામ્ય / ૧.૫૦ લાખ શહેરી)",
    "બેંક પાસબુક"
  ],
  applicationUrl: "https://esamajkalyan.gujarat.gov.in",
  icon: "♿",
  ministry: "સામાજિક ન્યાય અને અધિકારીતા વિભાગ, ગુજરાત",
  isActive: true,
  officialSlaDays: 21,
  planningEstimateDays: "૫-૭ દિવસ",
  implementingAuthority: "જિલ્લા સમાજ સુરક્ષા અધિકારી / e-Samaj Kalyan",
  targetBeneficiary: "૮૦% કે તેથી વધુ દિવ્યાંગતા ધરાવતા દિવ્યાંગ નાગરિકો",
  documentChecklist: [
    {
      name: "UDID Disability Card",
      nameGu: "UDID કાર્ડ (૮૦%+ સર્ટિફિકેટ)",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Aadhaar Card",
      nameGu: "આધાર કાર્ડ",
      tier: "mandatory",
      digiLockerSupported: true
    },
    {
      name: "Income Certificate",
      nameGu: "આવક દાખલો",
      tier: "mandatory",
      digiLockerSupported: true
    }
  ]
},
];

// Helper functions for offline fallback & server-side lookup
export function getSchemesByCategory(category: string): Scheme[] {
  return SCHEMES_DATA.filter((s) => s.category === category && s.isActive);
}

const globalForSchemes = globalThis as unknown as {
  __CUSTOM_SCHEMES__?: Scheme[];
  __DELETED_SCHEME_IDS__?: string[];
};

if (!globalForSchemes.__CUSTOM_SCHEMES__) {
  globalForSchemes.__CUSTOM_SCHEMES__ = [];
}
if (!globalForSchemes.__DELETED_SCHEME_IDS__) {
  globalForSchemes.__DELETED_SCHEME_IDS__ = [];
}

export function getAllActiveSchemes(): Scheme[] {
  const custom = globalForSchemes.__CUSTOM_SCHEMES__ || [];
  const deleted = new Set(globalForSchemes.__DELETED_SCHEME_IDS__ || []);

  // Map custom schemes by ID (overrides bundled or adds new)
  const customMap = new Map<string, Scheme>();
  custom.forEach((s) => customMap.set(s.id, s));

  // Merge bundled schemes (skipping deleted ones and overridden ones)
  const result: Scheme[] = [];

  // 1. Add all custom schemes first
  custom.forEach((s) => {
    if (!deleted.has(s.id)) {
      result.push(s);
    }
  });

  // 2. Add bundled schemes if not overridden and not deleted
  SCHEMES_DATA.forEach((s) => {
    if (!customMap.has(s.id) && !deleted.has(s.id)) {
      result.push(s);
    }
  });

  return result;
}

export function saveCustomScheme(scheme: Scheme): Scheme {
  if (!globalForSchemes.__CUSTOM_SCHEMES__) {
    globalForSchemes.__CUSTOM_SCHEMES__ = [];
  }
  if (!globalForSchemes.__DELETED_SCHEME_IDS__) {
    globalForSchemes.__DELETED_SCHEME_IDS__ = [];
  }

  // Remove from deleted set if re-added
  globalForSchemes.__DELETED_SCHEME_IDS__ = globalForSchemes.__DELETED_SCHEME_IDS__.filter(
    (id) => id !== scheme.id
  );

  // Replace or add to custom list
  const idx = globalForSchemes.__CUSTOM_SCHEMES__.findIndex((s) => s.id === scheme.id);
  if (idx >= 0) {
    globalForSchemes.__CUSTOM_SCHEMES__[idx] = scheme;
  } else {
    globalForSchemes.__CUSTOM_SCHEMES__.unshift(scheme);
  }

  return scheme;
}

export function deleteCustomScheme(id: string): boolean {
  if (!globalForSchemes.__CUSTOM_SCHEMES__) {
    globalForSchemes.__CUSTOM_SCHEMES__ = [];
  }
  if (!globalForSchemes.__DELETED_SCHEME_IDS__) {
    globalForSchemes.__DELETED_SCHEME_IDS__ = [];
  }

  globalForSchemes.__CUSTOM_SCHEMES__ = globalForSchemes.__CUSTOM_SCHEMES__.filter(
    (s) => s.id !== id
  );

  if (!globalForSchemes.__DELETED_SCHEME_IDS__.includes(id)) {
    globalForSchemes.__DELETED_SCHEME_IDS__.push(id);
  }

  return true;
}

export function searchSchemes(query: string): Scheme[] {
  const q = query.toLowerCase();
  const all = getAllActiveSchemes();
  return all.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.nameGu.includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.ministry.toLowerCase().includes(q)
  );
}

export function getSchemeById(id: string): Scheme | undefined {
  const cleanId = (id || "").trim();
  const deleted = new Set(globalForSchemes.__DELETED_SCHEME_IDS__ || []);
  if (deleted.has(cleanId)) return undefined;

  const custom = globalForSchemes.__CUSTOM_SCHEMES__ || [];
  const foundCustom = custom.find((s) => s.id === cleanId);
  if (foundCustom) return foundCustom;

  return SCHEMES_DATA.find((s) => s.id === cleanId);
}

export const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string; labelGu: string }> = {
  agriculture: { label: "Agriculture", icon: "🌾", color: "green", labelGu: "ખેતીવાડી & પશુપાલન" },
  health: { label: "Health", icon: "🏥", color: "red", labelGu: "આરોગ્ય & સારવાર" },
  housing: { label: "Housing", icon: "🏠", color: "orange", labelGu: "આવાસ & મકાન" },
  education: { label: "Education", icon: "🎓", color: "blue", labelGu: "શિક્ષણ & શિષ્યવૃત્તિ" },
  women: { label: "Women & Child", icon: "👩", color: "pink", labelGu: "મહિલા & બાળ કલ્યાણ" },
  business: { label: "Business & Loans", icon: "💼", color: "purple", labelGu: "રોજગાર & લોન" },
  social: { label: "Social Security", icon: "🤝", color: "teal", labelGu: "સામાજિક સુરક્ષા & પેન્શન" },
  energy: { label: "Clean Energy", icon: "⚡", color: "yellow", labelGu: "વીજળી & સૌર ઊર્જા" },
};
