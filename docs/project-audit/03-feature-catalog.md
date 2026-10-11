# 03 — Feature Catalogue & Functional Audit

---

## 1. Feature Inventory Summary

| # | Feature Identifier | Domain | Target Roles | Implementation Status | Primary Source File |
|---|---|---|---|---|---|
| F-01 | Citizen Aadhaar 2FA Authentication | Identity & Access | Citizen | Complete (Simulated UIDAI) | [`CitizenLoginShield.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/CitizenLoginShield.tsx) |
| F-02 | Officer Desk Credentials Login | Identity & Access | Officer | Complete (RBAC Verified) | [`OfficerLoginShield.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/OfficerLoginShield.tsx) |
| F-03 | Kutumb Unified Family Ledger & PoR | Family Management | Citizen | Complete | [`FamilyMemberManagerBar.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/FamilyMemberManagerBar.tsx) |
| F-04 | Gemini AI Conversational Assistant | Artificial Intelligence | All Roles | Complete (Multi-Model Race) | [`ChatBot.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/ChatBot.tsx) |
| F-05 | Multimodal AI Document Pre-Scrutiny | Artificial Intelligence | Citizen, Officer | Complete (Gemini Vision) | [`src/app/api/verify-doc/route.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/verify-doc/route.ts) |
| F-06 | 69+ Government Document Services Portal| Citizen Services | Citizen | Complete | [`DocumentServicePortal.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/DocumentServicePortal.tsx) |
| F-07 | Cyber Treasury (e-Grass) Payment Gateway| Financial / Treasury | Citizen, Officer | Complete (Instant Fallback) | [`DocumentServicePortal.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/DocumentServicePortal.tsx) |
| F-08 | 26 Major Welfare Schemes Directory | Welfare Discovery | All Roles | Complete (Cloud Synced) | [`src/app/schemes/page.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/schemes/page.tsx) |
| F-09 | Dynamic Scheme Detail & Application Modal| Welfare Application | Citizen | Complete | [`src/app/schemes/[id]/page.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/schemes/%5Bid%5D/page.tsx) |
| F-10 | Proactive Eligibility Engine & Ledger | Decision Engine | Citizen | Complete | [`EligibilityLedgerView.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/EligibilityLedgerView.tsx) |
| F-11 | Annual Family Benefit Calculator | Financial Planning | Citizen | Complete | [`src/app/benefit-calculator/page.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/benefit-calculator/page.tsx) |
| F-12 | Citizen Track Vault & SLA Monitor | Application Tracking | Citizen | Complete | [`TrackVaultView.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/TrackVaultView.tsx) |
| F-13 | 5-Tier Administrative Hierarchy Desk | Governance / Admin | Officer | Complete | [`AdminHierarchyDesk.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/AdminHierarchyDesk.tsx) |
| F-14 | AI Administrative Bottleneck Monitor | Analytics / Ops | Officer | Complete | [`AiBottleneckMonitor.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/AiBottleneckMonitor.tsx) |
| F-15 | Smart Kacheri & Jan Seva Locator | Spatial / Navigation | All Roles | Complete (GPS + OSM) | [`SmartKacheriLocatorBanner.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/SmartKacheriLocatorBanner.tsx) |
| F-16 | Official Certificate & PVC Card Engine | Public Documents | Citizen, Officer | Complete | [`OfficialGovernmentCertificate.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/OfficialGovernmentCertificate.tsx) |
| F-17 | Printable Government Receipt Slip | Public Documents | Citizen | Complete | [`GovernmentReceiptSlip.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/GovernmentReceiptSlip.tsx) |
| F-18 | Native PWA Super-App & Haptics Engine | Platform Experience | All Roles | Complete | [`ServiceWorkerRegister.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/ServiceWorkerRegister.tsx) |
| F-19 | 16-Language Multilingual Engine | Localization | All Roles | Complete | [`LanguageContext.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/context/LanguageContext.tsx) |
| F-20 | System Telemetry & Forced Update Pipeline| Security / Governance| All Roles | Complete | [`OfficialGovernmentUpdateModal.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/OfficialGovernmentUpdateModal.tsx) |

---

## 2. In-Depth Feature Specifications

### F-01: Citizen Aadhaar 2FA Authentication
- **Purpose:** Secure single sign-on (SSO) for citizens to access personalized vaults, family applications, and scheme recommendations.
- **Module:** [`CitizenLoginShield.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/CitizenLoginShield.tsx).
- **APIs Called:** `POST /api/auth/otp` (`action: "send_otp"`, `action: "verify_otp"`).
- **Behavior:** 
  1. Citizen enters 10-digit mobile and last 4 digits of Aadhaar.
  2. Server verifies association against the citizen ledger (`large-datasets.ts`).
  3. Server sends a 6-digit OTP (simulated SMS response).
  4. Entering the correct OTP issues an authenticated citizen profile persisted in `localStorage.nagrik_citizen_session`.
- **Validation Rules:** Mobile must be exactly 10 digits; Aadhaar must be exactly 4 digits; OTP must be 6 digits.

---

### F-02: Officer Desk Credentials Login
- **Purpose:** Dedicated back-office login for Gujarat administrative officers across 5 tiers.
- **Module:** [`OfficerLoginShield.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/OfficerLoginShield.tsx).
- **APIs Called:** `POST /api/auth/otp` (`action: "verify_officer"`).
- **Behavior:** Validates officer ID (e.g., `GUJ-MAM-7003`, `GUJ-COL-3001`) and secure PIN (`GJ2026`). Upon verification, establishes an officer session stored in `sessionStorage.nagrik_officer_session`.
- **Access Restrictions:** Access granted strictly according to officer tier level (`canApproveEsign`, `canVerifyPayment`, `canModifyPolicy`, `canViewAllDistricts`).

---

### F-03: Kutumb Unified Family Ledger & Proof of Relationship (PoR)
- **Purpose:** Enables the head of the household to manage up to 5 family profiles under a single mobile login, in compliance with UIDAI mAadhaar and NFSA Kutumb rules.
- **Module:** [`FamilyMemberManagerBar.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/FamilyMemberManagerBar.tsx), supported by [`src/lib/family-ledger.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/family-ledger.ts).
- **APIs Called:** `POST /api/verify-doc` (dynamic PoR document AI vision check).
- **Behavior:**
  1. Displays horizontal quick-select pills (`હરી વિનોદરાઈ પટેલ (પોતે)`, `વિનોદરાઈ (પિતા)`, `ભાવનાબેન (માતા)`, `પ્રિયાબેન (પત્ની)`, `આરવ (પુત્ર)`).
  2. Clicking "સભ્ય ઉમેરો (Add Member)" prompts relation selection (`પુત્ર`, `પત્ની`, `પિતા`, `માતા`, etc.).
  3. Dynamically recommends governing Proof of Relationship (Birth Certificate, Marriage Certificate, School LC, or Ration Card).
  4. Includes **Live AI Vision OCR (`🤖 AI દ્વારા ચકાસો`)** that checks the uploaded PoR document to ensure names and relationships match before linking.
  5. When switching active family members, dispatches `nagrik_family_member_change` to auto-prefill application forms.

---

### F-04: Gemini AI Conversational Assistant
- **Purpose:** 24/7 conversational civic assistant answering questions regarding schemes, rules, and procedures in Gujarati, Hindi, or English.
- **Module:** [`ChatBot.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/ChatBot.tsx), supported by [`src/app/api/chat/route.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/chat/route.ts).
- **Behavior:**
  1. Accepts typed text or voice input via Web Speech API.
  2. Detects intent: If user inputs an Application ID (`APP-GUJ-8038`), directly extracts and renders a rich status card with SLA timer and desk details.
  3. If user uploads a document image, triggers Gemini Vision analysis and returns an audit checklist.
  4. Multi-model race queries `gemini-flash-lite-latest`, `gemini-3.5-flash-lite`, `gemini-3.7-flash` with 15s timeout.
  5. Formats replies with official Act citations (GRTSA 2013, NFSA 2013, PM-KISAN, PM-JAY).
  6. Attaches dynamic action buttons (`🚀 આવકના દાખલા માટે અરજી કરો`, `💰 લાભ કેલ્ક્યુલેટર`, `📍 કચેરી લોકેટર`).
  7. Persists conversation history to `/api/chat/history`.

---

### F-05: Multimodal AI Document Pre-Scrutiny
- **Purpose:** Strict pre-submission image analysis to eliminate application rejections caused by blurred, cropped, mismatched, or counterfeit documents.
- **Module:** [`src/app/api/verify-doc/route.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/verify-doc/route.ts).
- **Behavior:**
  1. Receives image base64, MIME type, `expectedDocType`, and `fileName`.
  2. Dispatches to Gemini Vision with `STRICT_VERIFICATION_PROMPT` (Temperature `0.1`).
  3. Enforces negative constraints:
     - Marksheet uploaded when Birth Certificate / LC requested -> `matchesExpected: false`, `isValidForGovt: false`, `qualityScore: 15`.
     - Electricity bill uploaded when Photo ID requested -> `matchesExpected: false`, `isValidForGovt: false`.
     - Signature or document uploaded when Passport Photo requested -> `qualityScore: 5`, `actionableAdvice: "સહી ફોટા તરીકે અસ્વીકાર્ય છે"`.
  4. Returns structured JSON with `qualityScore` (0–100), `isValidForGovt`, `actionableAdviceGu`, and `verificationPoints[]`.
  5. Client displays green valid badge (`પ્રમાણિત 90%`) or red warning badge (`અમાન્ય`) with precise Gujarati instructions.

---

### F-06: 69+ Government Document Services Portal
- **Purpose:** One-stop citizen application wizard for 69+ Gujarat revenue and panchayat certificates (Income, NCL, Caste, Domicile, Senior Citizen, Varsai, EWS, Ration, Agriculture).
- **Module:** [`DocumentServicePortal.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/DocumentServicePortal.tsx).
- **Behavior:**
  1. Service catalog with category filtering (`મહેસૂલ`, `પંચાયત`, `સમાજ કલ્યાણ`, `અન્ન & પુરવઠો`).
  2. DigiLocker auto-fetch / simulated registry pre-fill.
  3. Dynamic field rendering based on service type (e.g., land details for farmers, shop number for ration cards).
  4. Correction mode: Enables comparing old values with requested new values.
  5. Required document upload with integrated Gemini AI smart checking.
  6. Aadhaar eSign declaration.
  7. Dispatches to Cyber Treasury payment gateway and prints official receipt.

---

### F-07: Cyber Treasury (e-Grass) Payment Gateway
- **Purpose:** Official government revenue fee collection with instant receipt generation.
- **Module:** Integrated inside [`DocumentServicePortal.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/DocumentServicePortal.tsx#L720-L920).
- **Behavior:**
  1. Supports 3 payment methods:
     - **UPI Bharat QR:** Displays QR code for Google Pay, PhonePe, Paytm with dynamic countdown timer.
     - **Card / Net Banking:** Cyber Treasury e-Grass simulation.
     - **Cash at Counter (Challan):** Generates official cash challan (`GRN-2026-XXXXX`) for physical payment at Jan Seva Kendra.
  2. Dispatches `POST /api/track` with `3000ms` `AbortController` timeout.
  3. Server non-blocking persistence returns application ID (`APP-GUJ-XXXX`) and challan number immediately.
  4. Client syncs to `localStorage` and immediately displays the official printable receipt modal.

---

### F-08: 26 Major Welfare Schemes Directory
- **Purpose:** Searchable, categorized repository of major Gujarat and national welfare schemes.
- **Module:** [`src/app/schemes/page.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/schemes/page.tsx).
- **APIs Called:** `GET /api/schemes?category={cat}&search={query}`.
- **Behavior:** Debounced search (250ms), category pills (Agriculture, Health, Housing, Education, Women, Business, Social, Energy), pagination (12 items per page), and live cluster latency indicator.

---

### F-09: Dynamic Scheme Detail & Application Modal
- **Purpose:** Full scheme breakdown with benefits, eligibility criteria, required documents, governing ministry, and instant application form.
- **Module:** [`src/app/schemes/[id]/page.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/schemes/%5Bid%5D/page.tsx).
- **Behavior:** Displays scheme icon, direct portal link, statutory legal basis, and an "અરજી કરો (Apply Now)" modal that auto-prefills logged-in citizen information and registers the application in `/api/track`.

---

### F-10: Proactive Eligibility Engine & Ledger
- **Purpose:** Automatically matches a citizen's profile against all 26 schemes, displaying matched schemes, missing criteria, and match percentages.
- **Module:** [`EligibilityLedgerView.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/EligibilityLedgerView.tsx).
- **Behavior:** Evaluates age, gender, annual income, social category (SC/ST/OBC/General), occupation (farmer, laborer, etc.), and state residency. Generates a breakdown of eligible schemes with 1-click apply links.

---

### F-11: Annual Family Benefit Calculator
- **Purpose:** Calculates total annual entitlement in Indian Rupees across cash transfers, subsidies, and insurance coverage.
- **Module:** [`src/app/benefit-calculator/page.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/benefit-calculator/page.tsx).
- **Behavior:**
  1. Step 1: Aadhaar + Mobile 2FA unlock.
  2. Step 2: Auto-fetches Kutumb family members.
  3. Step 3: Interactive chip toggles (Farmer, House, LPG, Senior Citizen, Girl Child, Small Business, Student, Construction Laborer).
  4. Step 4: Computes total entitlement (e.g., ₹2,35,000/year) split across DBT, subsidies, and healthcare.
  5. Step 5: Generates the *રાષ્ટ્રીય કલ્યાણ અધિકાર પાસ (National Welfare Entitlement Pass)* with QR code and print support.

---

### F-12: Citizen Track Vault & Statutory SLA Monitor
- **Purpose:** Real-time visibility into submitted applications, desk progression, and GRTSA 2013 legal deadlines.
- **Module:** [`TrackVaultView.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/TrackVaultView.tsx).
- **APIs Called:** `GET /api/track?search={id}`, `POST /api/auth/otp` (`action: "get_citizen_profile"`).
- **Behavior:**
  1. Displays application status badges (`મંજૂર`, `ચકાસણી ચાલુ`, `સ્થળ તપાસ પેન્ડિંગ`, `પૂરક પુરાવા જરૂરી`).
  2. 5 workflow stages: Submission -> Document Verification -> Eligibility Check -> Officer Review -> Approval/Disbursal.
  3. Displays current officer desk, elapsed time, and statutory SLA deadline (e.g., 72 hours).
  4. Provides instant buttons to open printable receipt or download the official certificate.

---

### F-13: 5-Tier Administrative Hierarchy Desk
- **Purpose:** Officer workflow management portal covering Gram Panchayat Talati up to State Secretariat.
- **Module:** [`AdminHierarchyDesk.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/AdminHierarchyDesk.tsx).
- **APIs Called:** `GET /api/track`, `PATCH /api/track`.
- **Behavior:**
  1. Filter applications by District, Taluka, Village, and Status.
  2. Scrutiny Modal: View citizen photo, uploaded documents, AI quality score, and OCR verification points.
  3. Stage Advancement: Advance application from Stage 1 to Stage 4 with official remarks and officer designation.
  4. Cash Fee Confirmation: Counter operators can mark challans as paid.
  5. Policy Parameter Editor: Authorized officers can modify service fees and SLA limits.

---

### F-14: AI Administrative Bottleneck Monitor
- **Purpose:** Operational dashboard for District Collectors and Mamlatdars to detect pending file pile-ups and SLA breaches.
- **Module:** [`AiBottleneckMonitor.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/AiBottleneckMonitor.tsx).
- **Behavior:** Visualizes pending volume per desk, flags overdue applications exceeding GRTSA limits, and generates AI administrative recommendations.

---

### F-15: Smart Kacheri & Jan Seva Locator
- **Purpose:** Locates nearest government offices (Mamlatdar Kacheri, Taluka Seva Sadan, Jan Seva Kendra) with GPS directions.
- **Module:** [`SmartKacheriLocatorBanner.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/SmartKacheriLocatorBanner.tsx), [`src/app/locator/page.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/locator/page.tsx).
- **APIs Called:** `POST /api/location/resolve`.
- **Behavior:** Resolves user latitude/longitude against OpenStreetMap Nominatim reverse geocoding with local Haversine distance calculation across Gujarat revenue offices. Displays office timings, phone numbers, and Google Maps directions link.

---

### F-16 & F-17: Official Certificate & Receipt Engines
- **Purpose:** Generate legally verifiable public documents directly in the client browser.
- **Modules:** [`OfficialGovernmentCertificate.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/OfficialGovernmentCertificate.tsx), [`GovernmentReceiptSlip.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/GovernmentReceiptSlip.tsx).
- **Behavior:**
  1. Official A4 Government Certificate: Emblems, digital DSC sign stamp, issuing authority details, QR code.
  2. Official PVC Card Replica: CR80 card dimensions, UIDAI Guilloche security pattern, metallic gold hologram, micro-text, and 1D Code-128 barcode.
  3. Government Receipt Slip: Dual-column layout with payment transaction ID, challan number, SLA delivery timeline, and citizen details.

---

### F-18: Native PWA Super-App & Haptics Engine
- **Purpose:** Provide an installable, mobile-app experience for Android and iOS devices.
- **Modules:** [`ServiceWorkerRegister.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/ServiceWorkerRegister.tsx), [`HapticFeedbackProvider.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/HapticFeedbackProvider.tsx), [`MobileBottomNav.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/MobileBottomNav.tsx), [`AppSplashScreen.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/AppSplashScreen.tsx).
- **Behavior:** 
  - Android Chrome: Captures `beforeinstallprompt` to present 1-tap install banner.
  - iOS Safari: Displays step-by-step "Add to Home Screen" instructions.
  - WhatsApp-style splash screen on startup (2.5s).
  - Fixed 5-tab Material 3 bottom navigation bar on mobile viewports.
  - Light haptic vibration (`navigator.vibrate(10)`) triggered on button clicks.

---

### F-19: 16-Language Multilingual Engine
- **Purpose:** Ensure complete linguistic inclusion across India's constitutional languages.
- **Modules:** [`LanguageContext.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/context/LanguageContext.tsx), [`LanguageSelector.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/LanguageSelector.tsx), [`GoogleTranslateScript.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/GoogleTranslateScript.tsx).
- **Behavior:** 
  - Gujarati (`gu`), Hindi (`hi`), English (`en`) rendered natively.
  - 13 regional languages translated via DOM mutation.
  - Selected language persisted via `localStorage` and `googtrans` cookie.

---

### F-20: System Telemetry & Forced Update Pipeline
- **Purpose:** Zero-downtime, mandatory client updates upon version release.
- **Modules:** [`EnterpriseSystemHealthBar.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/EnterpriseSystemHealthBar.tsx), [`OfficialGovernmentUpdateModal.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/OfficialGovernmentUpdateModal.tsx).
- **APIs Called:** `GET /api/system-health`.
- **Behavior:** Background timer polls `/api/system-health` every 45 seconds. When the server version exceeds the client's stored version, renders an un-dismissible modal forcing a hard reload (`window.location.reload(true)`).
