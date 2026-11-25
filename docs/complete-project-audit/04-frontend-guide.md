# 04 — FRONTEND DEEP DIVE & UI/UX NAVIGATION GUIDE
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** Page-by-Page Screen Guide, Client State, Forms, Modals, and UX Routing  
**UI Framework:** Next.js 16.3.6 (App Router), React 19.2.8, Tailwind CSS v4, Lucide React

---

## 1. Frontend Architecture & Initialization

The application UI is structured as a high-performance, mobile-first Progressive Web App (PWA). It is designed to match the tactile responsiveness of native Android apps while maintaining full desktop parity.

### 1.1 Root Layout Shell Initialization (`src/app/layout.tsx`)
Every page in the application is wrapped within `RootLayout`, executing client initialization providers and global services:
- **`LanguageProvider` (`src/context/LanguageContext.tsx`):** Coordinates bilingual state (Gujarati `gu` / English `en`), broadcasting language toggle events across all UI components.
- **`AppSplashScreen.tsx`:** Displays a 1.2-second state emblem launch screen upon first cold load.
- **`OfficialGovernmentUpdateModal.tsx`:** Checks version telemetry and displays the latest release notes (`v2.8.5` / `v2.9.0`) to users.
- **`ServiceWorkerRegister.tsx`:** Automatically registers `public/sw.js` for offline asset caching and PWA installation.
- **`HapticFeedbackProvider.tsx`:** Intercepts critical user actions (button clicks, form approvals, error alerts) and triggers subtle device vibrations via `navigator.vibrate([15, 30])`.
- **`GlobalModalScrollLocker.tsx`:** Eliminates background page scroll-bleed whenever full-screen modals (e.g., DigiLocker, e-Grass receipts) are mounted.
- **`MobileBottomNav.tsx`:** Fixed bottom navigation bar for mobile viewports displaying 5 primary tabs: Home, Schemes, Apply, Track, and AI Chat.
- **`FloatingInstallBanner.tsx`:** Prompts Android/iOS users to install the application to their home screen.

---

## 2. Navigation & Route Hierarchy Map

```
APPLICATION ROUTE TREE:
├── /                                   # Citizen Super-App Shell & Master Landing
├── /admin                              # 5-Tier Officer Administrative Hierarchy Desk
├── /schemes                            # 57 Welfare Schemes Catalog & Multi-Filter Search
│   └── /schemes/[id]                   # Detailed Scheme Dossier, Rules & Direct Apply Modal
├── /documents                          # 69 Citizen Revenue & Administrative Services Gateway
├── /benefit-calculator                 # Multi-Category Welfare Entitlement Calculator
├── /track                              # Citizen Application Tracking Vault & GRTSA Appeal
├── /locator                            # Jan Seva Kendra, ATVT & Kacheri Map Directory
├── /chat                               # Fullscreen Gemini Multilingual Voice AI Assistant
├── /eligibility                        # Quick Rule-Based Scheme Eligibility Screener
└── /portal                             # Alternate Service Gateway View
```

---

## 3. Comprehensive Page-by-Page Screen Guide

### 3.1 Screen 1: Master Landing / Citizen Super-App (`/`)
- **Source Files:** `src/app/page.tsx`, `src/components/UnifiedCitizenPortal.tsx`, `src/components/DynamicFeaturedSchemes.tsx`, `src/components/SmartKacheriLocatorBanner.tsx`.
- **Target Audience:** All Gujarat citizens seeking government services or information.
- **Key UI Sections:**
  1. **Top Citizen Header:** Displays the Gujarat Government crest, active citizen login badge, language switcher, and DigiLocker status.
  2. **Personalized Mobile Greeting Card (`MobileGreetingCard.tsx`):** Greets the citizen in authentic Gujarati (e.g., *"નમસ્તે, રમેશભાઈ પટેલ"*), displaying their registered village, active application count, and family profile quick-link.
  3. **Smart Kacheri Locator Banner (`SmartKacheriLocatorBanner.tsx`):** Automatically detects user GPS coordinates or allows manual taluka selection to surface the nearest Taluka Seva Sadan, Mamlatdar office hours, and contact numbers.
  4. **Dynamic Featured Schemes Grid (`DynamicFeaturedSchemes.tsx`):** Renders high-priority welfare programs with direct "Apply Now" triggers.
  5. **Quick Service Tiles:** 1-click access to Income Certificates, 7/12 Land Records, Ration Card Services, and Caste Certificates.

### 3.2 Screen 2: 5-Tier Officer Hierarchy Desk (`/admin`)
- **Source Files:** `src/app/admin/page.tsx`, `src/components/AdminHierarchyDesk.tsx`, `src/components/OfficerLoginShield.tsx`.
- **Target Audience:** Authorized Government of Gujarat officers across 5 administrative tiers.
- **Authentication Gate:** Blocked by `OfficerLoginShield.tsx` requiring official Employee ID and Secure PIN (Demo: `GUJ-GOV-9012` / `GJ2026`).
- **4-Tab Administrative Workbench:**
  - **Tab 1: Scrutiny Queue (`activeTab === "queue"`):** Displays applications filtered strictly to the officer's jurisdiction. Each row reveals applicant name, Aadhaar last-4, village, statutory SLA days remaining, and DigiLocker badges. Clicking a row opens the **Deep Scrutiny Modal**, showing attached proofs, Gemini OCR confidence, and buttons for "Approve with e-Sign Stamp" or "Reject with Official Reason".
  - **Tab 2: SLA Breach Watchdog (`activeTab === "sla"`):** Real-time monitoring of processing times under GRTSA 2013. Displays visual countdowns, amber warnings (<2 days remaining), and red breach banners triggering automatic first-appellate escalation to the Prant Officer / SDM.
  - **Tab 3: Dynamic Policy CMS (`activeTab === "policy"`):** Mounts `AdminPortalCmsManager.tsx` (accessible to officers with `canModifyPolicy`). Allows dynamic management of Schemes, Kacheri Offices, Government Circulars, and State SLA Rules without code modifications.
  - **Tab 4: Secretariat Apex IAS BI (`activeTab === "sachivalay_bi"`):** Mounts `SecretariatApexBiDashboard.tsx` (accessible only to Tier 1 State Admins). Provides 6-month historical trend graphs and linear regression delay forecasting.

### 3.3 Screen 3: Citizen Revenue Services Gateway (`/documents`)
- **Source Files:** `src/app/documents/page.tsx`, `src/components/DocumentServicePortal.tsx` (3,709 lines).
- **Target Audience:** Citizens applying for any of the 69 statutory administrative certificates.
- **Multi-Step Form Wizard Flow:**
  - **Step 1: Service Selection:** Filter by 9 departments (Revenue, Supplies, Welfare, Panchayat, Transport, Police, Labour, Energy, Central) and select application type ("New Application" vs "Correction / Renewal").
  - **Step 2: Applicant Profile & Family Selection:** Integrates `FamilyMemberManagerBar.tsx` allowing the applicant to choose themselves or select a dependent from their Kutumb ledger.
  - **Step 3: Document Upload & AI Pre-Audit:** Citizens attach required proofs (PDF/Images) or click "Fetch from DigiLocker". Uploaded files immediately trigger `/api/verify-doc`, displaying an automated Gemini Vision confidence rating and detecting missing or blurred pages.
  - **Step 4: Cyber Treasury e-Grass Settlement:** Calculates statutory service fees (e.g., ₹20 for Revenue, ₹0 for Welfare) and displays payment options (Cash Challan at Jan Seva Kendra or Online UPI).
  - **Step 5: Submission & Receipt Issuance:** Generates a unique Application Number (e.g., `APP-REV-2026-8941`) and a private **Tracking Secret** (e.g., `SEC-7749-X9`), while mounting `GovernmentReceiptSlip.tsx` for immediate download.

### 3.4 Screen 4: Schemes Directory & Search (`/schemes`)
- **Source Files:** `src/app/schemes/page.tsx`, `src/components/SchemeCard.tsx`.
- **Target Audience:** Citizens seeking welfare opportunities.
- **Search & Filtering Engine:**
  - Full-text search matching English and Gujarati scheme titles and descriptions.
  - Multi-category chips: Agriculture, Health, Housing, Education, Social Security, Business, and Clean Energy.
  - Demographic filters: Occupation (Farmer, Student, Artisan, Unemployed), Gender, Age bracket, and Caste category (General, SEBC, SC, ST, EWS).

### 3.5 Screen 5: Scheme Deep Dossier (`/schemes/[id]`)
- **Source Files:** `src/app/schemes/[id]/page.tsx` (865 lines).
- **Target Audience:** Citizens reviewing specific scheme guidelines.
- **Key Sections:**
  - Detailed financial entitlements breakdown (e.g., ₹6,000/yr for PM-Kisan, ₹10 Lakhs for Ayushman Bharat).
  - Dual statutory SLA disclosure: Official GRTSA legal limit vs NagrikSeva AI digital processing estimate.
  - Implementing ministry and nodal office details.
  - Interactive "Apply for Scheme" modal with DigiLocker document attachment.

### 3.6 Screen 6: Welfare Benefit Calculator (`/benefit-calculator`)
- **Source Files:** `src/app/benefit-calculator/page.tsx` (99.5 KB).
- **Target Audience:** Citizens wanting an instant estimate of total monetary assistance available to their household.
- **Calculation Mechanism:**
  - Interactive questionnaire capturing land holding size, annual household income, family size, housing type (kutcha vs pucca), and social category.
  - Executes instant multi-scheme matching, presenting a consolidated **Annual Household Benefit Projection** (e.g., *"તમારા કુટુંબને વાર્ષિક ₹1,18,000 સુધી સરકારી સહાય મળવાપાત્ર છે"*).

### 3.7 Screen 7: Application Tracking Vault (`/track`)
- **Source Files:** `src/app/track/page.tsx`, `src/components/TrackVaultView.tsx` (81.5 KB).
- **Target Audience:** Citizens tracking submitted files.
- **Two-Factor Access Guard:** Requires both the Application ID and the private **Tracking Secret** to protect citizen privacy.
- **Interactive Capabilities:**
  - Visual timeline tracing the file through Stage 1 (Submission) -> Stage 2 (AI Pre-Audit) -> Stage 3 (Talati Verification) -> Stage 4 (Mamlatdar Approval).
  - Download official approved certificate with QR verification code.
  - Download e-Grass Cyber Treasury payment receipt.
  - File a 1-click statutory appeal under Section 8 of GRTSA 2013 if the file is delayed past the statutory SLA.

### 3.8 Screen 8: Smart Kacheri Locator (`/locator`)
- **Source Files:** `src/app/locator/page.tsx`, `src/lib/location-resolver.ts`, `src/lib/offices-data.ts`.
- **Target Audience:** Citizens needing physical assistance at an administrative center.
- **Capabilities:**
  - District and taluka dropdown selector covering all 33 Gujarat districts.
  - Geodesic distance calculation from citizen coordinates to the nearest Jan Seva Kendra.
  - Operating hours, nodal officer phone numbers, and Google Maps direction links.

### 3.9 Screen 9: Fullscreen Conversational Voice AI (`/chat`)
- **Source Files:** `src/app/chat/page.tsx`, `src/components/ChatBot.tsx` (76.8 KB).
- **Target Audience:** Low-literacy or vernacular-first citizens.
- **Capabilities:**
  - Real-time streaming response from Google Gemini 2.5 Flash via `/api/chat`.
  - Native Gujarati voice synthesis via Google Cloud TTS (`/api/tts`).
  - Voice recording input using the browser's native Web Speech API.

---

## 4. Reusable Component Hierarchy & Modals

| Component | Hierarchy Level | Invoked By | Responsibility |
| :--- | :--- | :--- | :--- |
| `DigiLockerGatewayModal.tsx` | Global Modal | `DocumentServicePortal`, `SchemeDetailPage` | IT Act Rule 9A authentic document retrieval from DigiLocker repository. |
| `FamilyMemberManagerBar.tsx`| Form Sub-Component | `DocumentServicePortal` | Kutumb Family Ledger member addition, editing, and dependent selection. |
| `GovernmentReceiptSlip.tsx` | Global Modal | `DocumentServicePortal`, `TrackVaultView` | Official e-Grass treasury challan with 14-digit CRN and barcode. |
| `OfficialGovernmentCertificate.tsx`| Global Modal | `AdminHierarchyDesk`, `TrackVaultView` | Official Gujarat State Certificate with QR code, 64-char hash, and print CSS. |
| `CitizenLoginShield.tsx` | Auth Modal | `UnifiedCitizenPortal`, `DocumentServicePortal`| Aadhaar 2FA OTP and MeriPehchaan citizen authentication gate. |
| `OfficerLoginShield.tsx` | Auth Modal | `AdminHierarchyDesk` | 5-Tier Officer Employee ID and PIN authentication gate. |
| `AdminPortalCmsManager.tsx` | Admin Sub-View | `AdminHierarchyDesk` | 4-Tab Dynamic CMS for Schemes, Offices, Notices, and Policies. |
| `SecretariatApexBiDashboard.tsx`| Admin Sub-View | `AdminHierarchyDesk` | Chief Secretary BI analytics with 6-month historical ML forecasting. |
| `AiBottleneckMonitor.tsx` | Telemetry Widget | `AdminHierarchyDesk` | Live monitoring of taluka-level backlogs and officer disposal velocity. |

---

## 5. Client State Management & Offline Resiliency

The frontend architecture deliberately avoids complex external state libraries (such as Redux) in favor of high-performance, deterministic primitives:
1. **React State & Callbacks:** Local component state (`useState`, `useCallback`, `useMemo`, `useRef`) manages dynamic UI transitions and modal visibility.
2. **Offline LocalStorage Vaults:**
   - `nagrik_citizen_session`: Stores active citizen identity, Aadhaar last-4, and authentication timestamps.
   - `nagrik_family_ledger`: Persists Kutumb family member profiles and income records across browser sessions.
   - `nagrik_custom_applications`: Stores citizen-submitted applications locally, ensuring they can be tracked even if cloud connectivity is interrupted.
   - `nagrik_public_notices_cms`: Stores published government circulars and notices locally.
3. **Cross-Tab Event Synchronization:**
   Custom DOM events (`window.dispatchEvent(new CustomEvent("nagrik_notices_updated"))`) broadcast administrative CMS updates across multiple browser tabs instantaneously without requiring manual page refreshes.
