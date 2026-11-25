# 03 — COMPLETE FEATURE & FUNCTIONALITY AUDIT
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** Comprehensive Feature Catalog & Statutory Services Inventory  
**Audited Datasets:** 57 Welfare Schemes (`schemes-data.ts`) & 69 Administrative Services (`large-datasets.ts`)

---

## 1. Feature Architecture Overview

NagrikSeva AI operates as a dual-portal Digital Public Infrastructure (DPI) platform designed to eliminate citizen queues and streamline officer workflows. The functional perimeter is structured into three primary operational domains:
1. **Citizen Welfare Services (57 Schemes):** Comprehensive eligibility scoring, benefits analysis, and application submission across Central and Gujarat State welfare programs.
2. **Citizen Administrative Gateway (69 Services):** Multi-step statutory certificate applications (Income, Caste, Ration, Land Records, Police, Transport, Panchayat) with DigiLocker document pulls and Gemini Vision AI pre-scrutiny.
3. **Officer Hierarchy Desk (5 Tiers):** An administrative workbench providing territorial application processing, statutory SLA breach tracking, official digital certificate issuance, dynamic CMS management, and Secretariat-level machine learning analytics.

---

## 2. Welfare Schemes Catalog (57 Modeled Schemes)

Every scheme in `src/lib/schemes-data.ts` is modeled with dual statutory turnaround limits (`officialSlaDays` vs `planningEstimateDays`), implementing authorities, targeted demographic groups, eligibility thresholds, and document requirements.

### 2.1 Agriculture & Allied Services (11 Schemes)
1. **PM Kisan Samman Nidhi (`pm-kisan`):** ₹6,000/yr direct income support in 3 equal DBT installments. SLA: 30 days statutory (5-7 days platform estimate). Authority: Ministry of Agriculture.
2. **PM Fasal Bima Yojana (`fasal-bima`):** Comprehensive crop insurance against droughts and floods with 1.5%–2% premium. SLA: 45 days. Authority: PMFBY Portal / Agriculture Dept.
3. **Kisan Credit Card (`kisan-credit-card`):** Concessional agricultural credit up to ₹3 Lakhs at 4% interest subvention. SLA: 14 days. Authority: NABARD & Commercial Banks.
4. **Sat Pagla Khedut Kalyan Gujarat (`khedut-sat-pagla`):** Gujarat state package including ₹900/mo cow maintenance grant and ₹30,000 godown subsidy. SLA: 30 days. Authority: i-Khedut Portal / Gujarat Agriculture Dept.
5. **Mukhyamantri Kisan Sahay Yojana (`kisan-sahay-guj`):** Zero-premium state disaster compensation for crop damage exceeding 33%. SLA: 30 days. Authority: Gujarat Revenue & Agriculture Depts.
6. **Agro Solar Pump Subsidy (`agro-solar-pump`):** 75% to 90% capital grant for off-grid solar irrigation pumps under PM-KUSUM. SLA: 30 days. Authority: GUVNL / GEDA.
7. **Pashu Palak Credit & Cattle Aid (`pashupalan-subsidy`):** Subsidized milch cattle purchase loans and dairy equipment incentives. SLA: 21 days. Authority: Animal Husbandry Directorate.
8. **Drip & Micro Irrigation Subsidy (`micro-irrigation-ggrc`):** 70% subsidy for micro-irrigation systems. SLA: 21 days. Authority: Gujarat Green Revolution Company (GGRC).
9. **Khedut Tractor & Tool Kit Sahay (`khedut-tractor-subsidy`):** ₹45,000 to ₹60,000 direct subsidy for purchasing agricultural tractors and implements. SLA: 30 days. Authority: i-Khedut Portal.
10. **Tar Fencing & Crop Protection (`tar-fencing-sahay`):** Financial grant of ₹200/meter or up to ₹2 Lakhs for cluster farm wire fencing. SLA: 30 days. Authority: Gujarat Agriculture Dept.
11. **Gau Samvardhan & Desi Cow Aid (`desi-gay-sahay`):** ₹10,800 annual assistance for farmers rearing indigenous Gir/Kankrej cows. SLA: 15 days. Authority: Animal Husbandry Dept.

### 2.2 Health & Nutrition (6 Schemes)
12. **Ayushman Bharat PM-JAY / Mukhyamantri Amrutam (`ayushman-bharat`):** ₹10,00,000 annual cashless hospitalization cover for low-income and middle-class families. SLA: 7 days. Authority: National Health Authority & Gujarat Health Dept.
13. **Janani Suraksha Yojana (`janani-suraksha`):** Cash incentive (₹1,400 rural / ₹1,000 urban) for institutional deliveries. SLA: 7 days. Authority: Health & Family Welfare.
14. **Pradhan Mantri Matru Vandana Yojana (`pm-matru-vandana`):** ₹5,000 maternity benefit in DBT installments for first living child. SLA: 15 days. Authority: Women & Child Development.
15. **Mukhyamantri Amrutam Vatsalya (`maa-vatsalya`):** Universal tertiary health coverage for non-PMJAY households earning up to ₹4 Lakhs. SLA: 7 days. Authority: Gujarat Health Dept.
16. **Niramay Gujarat Abhiyan (`niramay-gujarat`):** Free screening and medication for non-communicable diseases (diabetes, hypertension, cancer). SLA: 3 days. Authority: District Health Society.
17. **Suposhan Gujarat & Doodh Sanjeevani (`suposhan-gujarat`):** Fortified milk and nutrient-dense rations for tribal mothers and children. SLA: 7 days. Authority: ICDS Gujarat.

### 2.3 Housing & Urban/Rural Shelter (6 Schemes)
18. **Pradhan Mantri Awas Yojana Gramin (`pm-awas-gramin`):** ₹1,20,000 direct grant in 3 installments for constructing pucca houses in rural areas. SLA: 30 days. Authority: Ministry of Rural Development & DRDA.
19. **Pradhan Mantri Awas Yojana Urban (`pm-awas-urban`):** Up to ₹2.67 Lakh interest subsidy under Credit Linked Subsidy Scheme (CLSS). SLA: 45 days. Authority: Housing & Urban Affairs.
20. **Dr. Ambedkar Awas Yojana (`ambedkar-awas`):** ₹1,20,000 housing assistance for rural SC families without pucca shelter. SLA: 30 days. Authority: Scheduled Caste Welfare Directorate.
21. **Pandit Deendayal Upadhyay Awas (`deendayal-awas`):** ₹1,20,000 state grant for SEBC / EWS rural households to build houses. SLA: 30 days. Authority: Developing Castes Welfare Dept.
22. **Shramik Basera Yojana (`shramik-basera`):** Temporary subsidized night shelters and rental dormitories for migrant construction laborers. SLA: 3 days. Authority: Gujarat Building & Other Construction Workers Board.
23. **Mukhyamantri Gramya Gruh Nirman (`gramya-gruh-nirman`):** Free residential plots (100 sq. yards) for landless agricultural laborers. SLA: 30 days. Authority: Gujarat Panchayats Dept.

### 2.4 Education & Student Scholarships (8 Schemes)
24. **Digital Gujarat Post-Matric Scholarship (`digital-guj-scholarship`):** 100% tuition reimbursement and maintenance allowances for SC/ST/OBC college students. SLA: 30 days. Authority: Digital Gujarat Portal.
25. **MYSY — Mukhyamantri Yuva Swavalamban (`mysy-gujarat`):** 50% tuition assistance (up to ₹2 Lakhs/yr) for higher education students with >80 percentile. SLA: 21 days. Authority: Knowledge Consortium of Gujarat.
26. **Kanya Kelavani & Vidya Lakshmi Bond (`vidya-lakshmi-bond`):** ₹2,000 bond for girl child primary school enrollment in low female literacy talukas. SLA: 14 days. Authority: Gujarat Education Dept.
27. **RTE Gujarat 25% Free Admission (`rte-gujarat`):** Free admission in private schools from Class 1 to 8 with state-funded fee reimbursement. SLA: 21 days. Authority: Director of Primary Education.
28. **Foreign Higher Education Study Loan (`foreign-study-loan`):** Concessional 4% loan up to ₹15 Lakhs for overseas postgraduate studies. SLA: 30 days. Authority: Gujarat Unreserved Educational & Economic Development Corp (GUEEDC).
29. **Tablet Sahay for College Freshers (`namo-tablet-sahay`):** Subsidized branded tablets at token ₹1,000 fee for 1st-year college students. SLA: 15 days. Authority: Higher Education Dept.
30. **Saraswati Sadhana Cycle Yojana (`saraswati-sadhana-cycle`):** Free bicycles for SC/ST/SEBC girls enrolled in Class 9. SLA: 15 days. Authority: Social Justice Dept.
31. **Videsh Abhyas Loan for SC/ST Students (`sc-st-foreign-loan`):** 100% subsidized education loans up to ₹15 Lakhs for tribal and Dalit youth. SLA: 30 days. Authority: Tribal Development Dept.

### 2.5 Social Security & Welfare Pensions (8 Schemes)
32. **Ganga Swarupa (Widow Pension) Sahay (`ganga-swarupa`):** ₹1,250 monthly DBT pension for widowed women with zero deduction. SLA: 15 days. Authority: Women & Child Development Dept.
33. **Indira Gandhi Old Age Pension (`ignaps-old-age`):** Monthly pension of ₹750 (60-79 yrs) and ₹1,000 (80+ yrs) for BPL elderly citizens. SLA: 21 days. Authority: Social Security Directorate.
34. **Sant Surdas Divyang Pension (`sant-surdas-pension`):** ₹1,000 monthly DBT financial aid for persons with >80% disability. SLA: 15 days. Authority: Social Defence Directorate.
35. **Niradhar Vrudh Pension Gujarat (`niradhar-vrudh-guj`):** State supplementary allowance for destitute senior citizens without family support. SLA: 15 days. Authority: Revenue Department (Mamlatdar).
36. **Palak Mata-Pita Yojana (`palak-mata-pita`):** ₹4,000 per month support per child for foster families raising orphaned children. SLA: 15 days. Authority: Social Defence Directorate.
37. **Dr. Savita Ambedkar Inter-Caste Marriage (`savita-ambedkar-marriage`):** ₹2,50,000 financial incentive for Hindu inter-caste marriages. SLA: 30 days. Authority: Scheduled Caste Welfare.
38. **Kunwarbai nu Mameru (`kunwarbai-mameru`):** ₹12,000 direct bank grant to eligible backward caste girls upon marriage. SLA: 15 days. Authority: Social Justice & Empowerment.
39. **Sankat Mochan Sahay (`sankat-mochan-sahay`):** Lump sum emergency relief of ₹20,000 upon death of the primary family breadwinner. SLA: 10 days. Authority: Revenue Dept (Mamlatdar).

### 2.6 Labour, Employment & Business Finance (10 Schemes)
40. **PM Mudra Loan Scheme (`pm-mudra`):** Collateral-free business loans under Shishu (up to ₹50k), Kishore (₹50k-₹5L), and Tarun (₹5L-₹10L). SLA: 14 days. Authority: Ministry of Finance.
41. **PM SVANidhi Micro-Credit (`pm-svanidhi`):** Working capital loans for street vendors starting from ₹10,000 to ₹50,000 with 7% interest subsidy. SLA: 7 days. Authority: MoHUA.
42. **PM Vishwakarma Kaushal Samman (`pm-vishwakarma`):** ₹15,000 toolkit voucher, 5-7 days skill stipend (₹500/day), and 5% collateral-free loans up to ₹3 Lakhs for 18 traditional artisans. SLA: 15 days. Authority: Ministry of MSME.
43. **Manav Garima Yojana (`manav-garima`):** Free professional toolkits (worth ₹4,000 to ₹20,000) for 28 cottage professions without loans. SLA: 21 days. Authority: Developing Castes Welfare.
44. **Bandhkam Shramik e-Nirman Smart Card (`e-nirman-card`):** Welfare registration providing accidental death cover, delivery allowance, and tool subsidies. SLA: 7 days. Authority: Gujarat Building Workers Board.
45. **National e-Shram Registration (`e-shram-card`):** Universal unorganized worker UAN card with ₹2 Lakh accidental insurance. SLA: 3 days. Authority: Ministry of Labour.
46. **Shramik Annapurna Yojana (`shramik-annapurna`):** Hot nutritious meals at nominal ₹5 cost across 100+ Kadia Naka construction worker centers. SLA: Instant. Authority: Gujarat Labour Dept.
47. **Mukhyamantri Mahila Utkarsh Yojana (`mahila-utkarsh-matsy`):** 0% interest loans up to ₹1,00,000 for Joint Liability Earning Groups (JLEG) of women. SLA: 15 days. Authority: Gujarat Livelihood Promotion Co.
48. **Dattopant Thengadi Artisan Loan (`artisan-loan-guj`):** Low-interest bank loans up to ₹1 Lakh with 8% interest subsidy for cottage artisans. SLA: 21 days. Authority: Cottage & Rural Industries.
49. **Vajpayee Bankable Scheme (`vajpayee-bankable`):** Up to ₹8 Lakh loan subsidy for rural/urban youth starting cottage and service enterprises. SLA: 30 days. Authority: District Industries Centre (DIC).

### 2.7 Energy, Environment & Civil Infrastructure (8 Schemes)
50. **Surya Gujarat Solar Rooftop (`surya-gujarat-solar`):** 40% state/central subsidy for residential rooftop solar systems up to 3 kW, 20% from 3 to 10 kW. SLA: 21 days. Authority: GUVNL / DISCOMs.
51. **PM Surya Ghar Muft Bijli Yojana (`pm-surya-ghar`):** ₹78,000 direct subsidy for 3 kW residential rooftop installations with 300 free monthly units. SLA: 15 days. Authority: Ministry of New & Renewable Energy.
52. **PM Ujjwala Yojana 2.0 (`pm-ujjwala`):** Free LPG connection, first cylinder refill, and stove for BPL and poor rural women. SLA: 7 days. Authority: Ministry of Petroleum & OMCs.
53. **Nal Se Jal / Har Ghar Jal Gujarat (`nal-se-jal-gujarat`):** Functional household tap water connections with 55 liters per capita daily supply. SLA: 14 days. Authority: Water & Sanitation Management Org (WASMO).
54. **Swachh Bharat Mission Gramin Toilet Grant (`sbm-toilet-subsidy`):** ₹12,000 individual household latrine incentive. SLA: 15 days. Authority: Rural Development Dept.
55. **Pradhan Mantri Gram Sadak Yojana (`pmgsy-roads`):** All-weather asphalt road connectivity to unconnected habitations. SLA: Statutory Infra. Authority: Roads & Buildings Dept.
56. **Gram Jyoti Agricultural Power Guarantee (`gram-jyoti-power`):** 8-hour continuous three-phase power supply for agricultural tube-wells. SLA: 7 days. Authority: Gujarat DISCOMs (PGVCL/UGVCL).
57. **Namami Gange & Gujarat River Cleanliness (`river-conservation`):** Sanitation and sewage treatment infrastructure across major river basins. SLA: Continuous Infra. Authority: Urban Development.

---

## 3. Statutory Administrative Services Catalog (69 Services)

In `src/lib/large-datasets.ts` (`DOCUMENT_SERVICES`), 69 individual services are structured across 9 departments, specifying fees, required documents, update capabilities, and biometric requirements:

| Department | Service Name & Code | Fee (INR) | Mandatory Proofs |
| :--- | :--- | :--- | :--- |
| **Revenue** | Income Certificate (`income`) | ₹20 | Ration card, Aadhaar, Talati inquiry report, Electricity bill |
| **Revenue** | AnyRoR 7/12 & 8A Land Records (`land_records`) | ₹20 | 7/12 land entry, Khatedar Aadhaar, Mutation register |
| **Revenue** | Caste & Non-Creamy Layer (`caste`) | ₹20 | School leaving certificate, Father's caste proof, Income slip |
| **Revenue** | Scheduled Caste (SC) Certificate (`sc_caste_cert`) | ₹20 | Pedigree (Pedhinama), School LC, Ration card |
| **Revenue** | Scheduled Tribe (ST) Certificate (`st_caste_cert`) | ₹20 | Tribal pedigree, 1950 domicile proof, Gram Sevak report |
| **Revenue** | EWS Certificate (`ews_cert`) | ₹20 | Income certificate, Property valuation, Land records |
| **Revenue** | Domicile Certificate (`domicile`) | ₹20 | 10-year residency proof, School LC, Electricity bills |
| **Revenue** | Legal Heirship / Pedhinama (`varasai`) | ₹20 | Death certificate, Panchkyas panchnama, Family affidavit |
| **Supplies** | New Ration Card (`ration_new`) | ₹20 | Electricity bill, Aadhaar cards of all members, Gas book |
| **Supplies** | Member Addition in Ration (`ration_add_member`) | ₹20 | Birth certificate / Marriage certificate, Aadhaar card |
| **Supplies** | Member Deletion / Surrender (`ration_del_member`) | ₹20 | Marriage certificate / Death certificate, Surrender form |
| **Supplies** | Ration Card Split (`ration_split`) | ₹20 | Separate electricity bill, Proof of separate residence |
| **Supplies** | Inter-District Transfer (`ration_transfer`) | ₹20 | NOC from previous DSO, New residence electricity bill |
| **Supplies** | Duplicate Ration Card (`duplicate_ration`) | ₹20 | Police lost article report / e-FIR, Self-declaration |
| **Supplies** | NFSA Priority Inclusion (`nfsa_inclusion`) | ₹20 | BPL score / Income proof, Kutumb ledger declaration |
| **Supplies** | FPS Fair Price Shop Change (`fps_change`) | ₹20 | Change of residence proof, Current ration card |
| **Welfare** | Senior Citizen ID Card (`senior_citizen`) | ₹0 (Free)| Age proof (Aadhaar / Voter ID), Passport photo |
| **Welfare** | UDID Swavalamban Disability Card (`disability_udid`)| ₹0 (Free)| Civil Surgeon disability report, Aadhaar, Passport photo |
| **Welfare** | Ganga Swarupa Widow Pension (`ganga_swarupa`) | ₹0 (Free)| Husband death certificate, Talati non-remarriage report |
| **Welfare** | Indira Gandhi Old Age Pension (`vrudh_pension`) | ₹0 (Free)| BPL card, Age proof, Single bank passbook |
| **Panchayat**| Digital Birth Certificate (`birth_cert`) | ₹20 | Hospital birth slip, Parents Aadhaar cards |
| **Panchayat**| Digital Death Certificate (`death_cert`) | ₹20 | Medical cause of death slip, Cremation / Burial slip |
| **Panchayat**| Marriage Registration (`marriage_cert`) | ₹100 | Wedding invitation card, Couple photos, 3 witness IDs |
| **Panchayat**| Property Assessment Copy (`panchayat_tax_akarani`)| ₹20 | Old property tax receipt, House ownership document |
| **Panchayat**| Rural BPL Certificate (`bpl_certificate`) | ₹20 | Gram Panchayat resolution, 2002-2007 BPL list page |
| **Transport**| Driving Licence (`driving_licence`) | ₹200 | Learner's licence number, Form 1A medical cert |
| **Transport**| Learner's Licence (`learner_licence`) | ₹150 | Age proof, Address proof, Form 1 physical fitness |
| **Transport**| Vehicle RC Transfer (`vehicle_rc_transfer`) | ₹300 | Form 29 & 30, Original RC, Valid PUC, Insurance |
| **Police** | Police Clearance Certificate (`police_clearance`)| ₹100 | Passport copy, Proof of residence, Fingerprint form |
| **Police** | Lost Article e-FIR (`lost_article_efir`) | ₹0 (Free)| Complainant Aadhaar, Device IMEI / Document details |
| **Police** | Tenant Verification (`tenant_police_verif`) | ₹0 (Free)| Landlord agreement, Tenant Aadhaar & photo |
| **Labour** | e-Nirman Smart Card (`e_nirman_card`) | ₹0 (Free)| Construction employer certificate, Bank passbook |
| **Labour** | District Rojgar Card (`employment_exchange`) | ₹0 (Free)| Highest educational marksheets, Caste cert, Aadhaar |
| **Energy** | New Power Connection (`new_power_connection`) | ₹100 | Ownership registry / 7/12, Test report from wireman |
| **Energy** | Meter Name Change (`meter_name_change`) | ₹50 | No dues NOC, Sale deed / Legal heir cert, Last bill |
| **Central** | Aadhaar Update / Enrollment (`aadhaar`) | ₹50 | UIDAI standard address/identity proof list |
| **Central** | New PAN Card (`pan`) | ₹107 | Form 49A, Proof of identity, Address, Date of birth |

---

## 4. Citizen Super-App Capabilities

### 4.1 DigiLocker & MeriPehchaan Gateway (`DigiLockerGatewayModal.tsx`)
- Complies with **IT Act Rule 9A** for legal equivalence of electronic records.
- Enables simulated and OAuth-ready 1-click document retrieval directly from DigiLocker repository URIs.
- Captures DPDP-compliant citizen consent timestamps before pulling sensitive identity credentials.

### 4.2 Kutumb Family Ledger (`FamilyMemberManagerBar.tsx` & `family-ledger.ts`)
- Manages unified family profiles with relationship tagging (Head of Household, Spouse, Son, Daughter, Mother, Father).
- Cross-references family income limits to evaluate joint household scheme eligibility.
- Allows applying on behalf of dependents with pre-filled biographical data.

### 4.3 Multimodal Gemini Vision AI Scrutiny (`DocumentServicePortal.tsx` & `/api/verify-doc`)
- Scans uploaded PDFs and JPEG/PNG images against five quality axes: legibility, blur, government emblem detection, name matching, and tampering heuristics.
- Delivers an instant visual confidence score (0–100%) and fast-tracks high-confidence applications directly to officer queues.

### 4.4 Cyber Treasury e-Grass Challan (`GovernmentReceiptSlip.tsx`)
- Generates official Gujarat State Treasury challans for service fee settlements.
- Produces unique 14-digit Challan Reference Numbers (CRN), major/minor revenue budget heads, barcodes, and print-ready cash/online counterfoil slips.

### 4.5 Application Tracking Vault (`TrackVaultView.tsx` & `/api/track`)
- Provides real-time status queries secured by a citizen-held **Tracking Secret**.
- Displays step-by-step application milestones: Submission -> AI Scrutiny -> Talati Field Verification -> Mamlatdar Approval -> Certificate Issuance.
- Offers an immediate 1-click Appeal Filing option under the Gujarat Right to Services Act if statutory SLA days are breached.

### 4.6 Conversational AI Voice Assistant (`ChatBot.tsx`, `/api/chat`, `/api/tts`)
- Natural-language query answering across all 57 schemes in authentic Gujarati and English.
- Supports Web Speech API speech-to-text input and Google Cloud TTS voice synthesis output.

---

## 5. Officer Administrative Capabilities

### 5.1 5-Tier Territorial Scrutiny Queue (`AdminHierarchyDesk.tsx`)
- Strict territorial data isolation prevents taluka or village officers from viewing records outside their administrative boundaries.
- Interactive modal displays submitted proofs, citizen photos, DigiLocker verification badges, and Gemini AI confidence scores.

### 5.2 GRTSA 2013 SLA Watchdog Engine
- Continuously calculates days remaining against statutory limits for every queued file.
- Triggers visual amber warnings when an application has less than 2 days remaining, and red alert badges for breached files, accompanied by automatic escalation flags.

### 5.3 Official Digital Certificate Generator (`OfficialGovernmentCertificate.tsx`)
- Renders legal Gujarat State certificates complete with the Ashok Stambh emblem, barcode, 64-character SHA-256 verification hash, officer digital signature stamp, and high-resolution print stylesheet.

### 5.4 4-Tab Dynamic CMS Manager (`AdminPortalCmsManager.tsx`)
- **Schemes Tab:** Create, edit, toggle, or modify eligibility criteria and benefit amounts for welfare schemes dynamically without code modification.
- **Offices Tab:** Update kacheri locations, office hours, GPS coordinates, and contact details with instant L1 cache invalidation.
- **Notices Tab:** Publish, edit, and categorize official circulars and urgent recruitment/welfare notices.
- **Policy Tab:** Adjust statewide SLA turnaround limits and regulatory notices.

### 5.5 Secretariat Apex IAS BI Dashboard (`SecretariatApexBiDashboard.tsx`)
- High-level BI interface designed for the Chief Secretary and Principal Secretaries.
- Integrates 6 months of historical disposal metrics (October 2025 – March 2026) across Gujarat's 33 districts.
- Executes linear regression forecasting ($R^2 = 0.941$) to predict application volume surges and scheme-specific bottleneck risks.
