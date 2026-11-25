# 14 — DEFINITIVE TRACEABILITY MATRIX & SOURCE EVIDENCE INDEX
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** Comprehensive Traceability Matrix linking all architectural claims, features, models, and APIs to exact source files  
**Target Repository:** `d:\Movies and Web se\atmiya\nagrik-seva`  
**Total Audited Source Files:** 84 Files (`src/`, `test/`, and root configurations)

---

## 1. Architectural & Core Engine Traceability Matrix

| Component / Subsystem | Primary Source File | Key Symbols / Exports | Line Range | Audit Document Reference |
| :--- | :--- | :--- | :--- | :--- |
| **57 Welfare Schemes Catalog** | `src/lib/schemes-data.ts` | `SCHEMES_DATA`, `getSchemeById()`, `CATEGORY_LABELS` | L1 – L2532 | `00`, `02`, `03`, `07` |
| **69 Document Services Catalog** | `src/lib/large-datasets.ts` | `DOCUMENT_SERVICES`, `GUJARAT_DISTRICTS` | L1078 – L1520 | `00`, `03`, `07` |
| **5,420 Pre-Seeded Applications**| `src/lib/large-datasets.ts` | `CUSTOM_USER_APPLICATIONS`, `TOTAL_SYSTEM_RECORDS` | L500 – L1070 | `01`, `02`, `07` |
| **5-Tier Officer Hierarchy Model**| `src/lib/admin-hierarchy-data.ts` | `HIERARCHICAL_OFFICERS`, `analyzeApplicationSla()` | L1 – L430 | `00`, `02`, `08`, `10` |
| **Officer HMAC-SHA256 Auth** | `src/lib/officer-auth.ts` | `createOfficerSessionToken()`, `getOfficerAuthSecret()`| L1 – L644 | `02`, `05`, `08`, `11` |
| **L1 LRU & Redis Cache Engine** | `src/lib/redis-cache.ts` | `EnterpriseRedisCache`, `redisCache` | L1 – L129 | `00`, `02`, `05`, `07` |
| **18,225 Village Geo-Engine** | `src/lib/gujarat-geo-engine.ts` | `GUJARAT_VILLAGE_INDEX`, `searchGujaratVillages()` | L1 – L450 | `00`, `02`, `06` |
| **6-Month Historical ML Engine**| `src/lib/historical-ml-engine.ts` | `SIX_MONTH_HISTORICAL_DATA`, `getSecretariatMlForecast()`| L1 – L178 | `00`, `02`, `03`, `10` |
| **DigiLocker Rule 9A Engine** | `src/lib/digilocker-engine.ts` | `DEFAULT_ISSUED_DOCUMENTS`, `generateConsentArtifact()` | L1 – L420 | `00`, `02`, `03`, `09` |
| **Kutumb Family Ledger Engine** | `src/lib/family-ledger.ts` | `FamilyMemberProfile`, `getFamilyIdForCitizen()` | L1 – L263 | `02`, `03`, `04`, `07` |
| **Gemini AI Core Client** | `src/lib/gemini.ts` | `geminiModel`, `GoogleGenerativeAI` | L1 – L85 | `02`, `05`, `09` |
| **Haversine Distance Resolver** | `src/lib/location-resolver.ts` | `calculateHaversineDistance()`, `findNearestKacheri()` | L1 – L110 | `02`, `04`, `05` |
| **Dynamic Public Notices CMS** | `src/lib/public-notices-data.ts`| `INITIAL_PUBLIC_NOTICES`, `savePublicNotice()` | L1 – L128 | `03`, `05`, `07` |
| **Application Release & Build Info**| `src/lib/app-version.ts` | `APP_VERSION`, `APP_BUILD_NAME`, `LEAD_DEVELOPERS` | L1 – L56 | `00`, `01`, `05` |
| **Firebase Cloud DB Config** | `src/lib/firebase.ts` / `firebase-admin.ts`| `db`, `initAdmin()` | L1 – L45 | `02`, `07`, `09` |

---

## 2. API Routes Traceability Matrix (`src/app/api/`)

| Endpoint Route | Implementation File | Key Exported Functions | Line Count | Audit Reference |
| :--- | :--- | :--- | :--- | :--- |
| `POST /api/auth/otp` | `src/app/api/auth/otp/route.ts` | `POST` (send_otp, verify_otp, officer_login) | 221 lines | `05`, `06`, `08` |
| `POST /api/chat` | `src/app/api/chat/route.ts` | `POST` (Gemini 2.5 Flash streaming response) | 480 lines | `04`, `05`, `06`, `09`|
| `GET /api/chat/history` | `src/app/api/chat/history/route.ts` | `GET` (Retrieves Firestore chat history) | 95 lines | `05`, `06` |
| `POST /api/digilocker` | `src/app/api/digilocker/route.ts` | `POST` (Rule 9A document fetching & OTP) | 249 lines | `03`, `05`, `06`, `09`|
| `GET /api/geo/villages` | `src/app/api/geo/villages/route.ts` | `GET` (Cascading 18,225 village query) | 95 lines | `05`, `06` |
| `POST /api/location/resolve` | `src/app/api/location/resolve/route.ts`| `POST` (Resolves GPS to closest kacheri) | 88 lines | `05`, `06` |
| `GET` / `POST /api/notices` | `src/app/api/notices/route.ts` | `GET`, `POST` (Circulars & CMS notices) | 90 lines | `03`, `05`, `06` |
| `GET` / `POST /api/offices` | `src/app/api/offices/route.ts` | `GET`, `POST` (Office directory & CMS) | 185 lines | `05`, `06` |
| `GET` / `POST /api/schemes` | `src/app/api/schemes/route.ts` | `GET`, `POST` (57 Schemes search & CMS) | 220 lines | `03`, `05`, `06` |
| `GET /api/schemes/[id]` | `src/app/api/schemes/[id]/route.ts`| `GET` (Deep scheme specification) | 55 lines | `03`, `05`, `06` |
| `GET /api/system-health` | `src/app/api/system-health/route.ts` | `GET` (Redis, Firestore, AI telemetry) | 85 lines | `05`, `06`, `11` |
| `GET` / `POST /api/track` | `src/app/api/track/route.ts` | `GET`, `POST` (Tracking & officer e-Sign) | 450 lines | `03`, `05`, `06`, `10`|
| `POST /api/tts` | `src/app/api/tts/route.ts` | `POST` (Google Cloud Gujarati TTS audio) | 135 lines | `04`, `05`, `06`, `09`|
| `POST /api/verify-doc` | `src/app/api/verify-doc/route.ts` | `POST` (Gemini Multimodal OCR Pre-Audit) | 320 lines | `02`, `05`, `06`, `09`|
| `GET /api/version` | `src/app/api/version/route.ts` | `GET` (Commit SHA & build hash telemetry) | 60 lines | `00`, `01`, `05`, `06`|

---

## 3. UI Components & Frontend Views Traceability Matrix (`src/components/` & `src/app/`)

| Page / Component | Source File Path | Architectural Responsibility | Line Count | Audit Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Officer Hierarchy Desk** | `src/components/AdminHierarchyDesk.tsx` | 5-Tier Officer Workbench, Scrutiny Queue, SLA Watchdog | 2,101 lines | `02`, `04`, `08`, `10` |
| **Citizen Document Portal** | `src/components/DocumentServicePortal.tsx` | 69 Services Gateway, Multi-step wizard, AI upload | 3,709 lines | `03`, `04`, `10` |
| **Dynamic Admin CMS** | `src/components/AdminPortalCmsManager.tsx` | 4-Tab CMS (Schemes, Offices, Notices, Policy) | 1,450 lines | `02`, `03`, `04`, `10` |
| **Secretariat IAS BI** | `src/components/SecretariatApexBiDashboard.tsx` | Executive BI dashboard with 6-month ML linear regression | 320 lines | `02`, `03`, `04`, `10` |
| **Tracking Vault View** | `src/components/TrackVaultView.tsx` | Citizen tracking, tracking secrets, GRTSA appeals | 1,533 lines | `03`, `04`, `10` |
| **Conversational Chatbot** | `src/components/ChatBot.tsx` | Gemini streaming chat with voice recording & TTS | 1,671 lines | `03`, `04`, `09` |
| **DigiLocker Modal** | `src/components/DigiLockerGatewayModal.tsx` | IT Act Rule 9A authentic document retrieval | 980 lines | `03`, `04`, `09`, `10` |
| **Kutumb Family Manager** | `src/components/FamilyMemberManagerBar.tsx` | Family member profile management & linking | 890 lines | `02`, `03`, `04`, `07` |
| **e-Grass Treasury Receipt**| `src/components/GovernmentReceiptSlip.tsx` | Cyber Treasury challan with 14-digit CRN & barcode | 580 lines | `02`, `03`, `04`, `09` |
| **Official Certificate** | `src/components/OfficialGovernmentCertificate.tsx`| Legal state certificate with Ashok Stambh, QR, Hash | 720 lines | `02`, `03`, `04`, `10` |
| **Citizen Login Shield** | `src/components/CitizenLoginShield.tsx` | Aadhaar 2FA OTP & MeriPehchaan login gate | 280 lines | `04`, `08`, `10` |
| **Officer Login Shield** | `src/components/OfficerLoginShield.tsx` | Employee ID & Security PIN auth gate | 360 lines | `04`, `08`, `10` |
| **Smart Kacheri Banner** | `src/components/SmartKacheriLocatorBanner.tsx`| Geolocation banner locating nearest Taluka Seva Sadan | 490 lines | `03`, `04`, `05` |
| **Master Landing Page** | `src/app/page.tsx` & `UnifiedCitizenPortal.tsx`| Citizen Super-App shell, greeting card, quick tiles | 380 lines | `01`, `04` |
| **Scheme Detail Dossier** | `src/app/schemes/[id]/page.tsx` | Detailed rules, financial assistance, and direct apply | 865 lines | `03`, `04` |
| **Benefit Calculator** | `src/app/benefit-calculator/page.tsx` | Multi-scheme financial projection engine | 1,220 lines | `03`, `04` |
| **Kacheri Map Directory** | `src/app/locator/page.tsx` | 33-district administrative office locator | 240 lines | `03`, `04` |

---

## 4. Test Suites & Verification Traceability Matrix (`test/`)

| Test Suite File | Tested System / Subsystem | Assertions & Scenarios | Verification Output | Audit Reference |
| :--- | :--- | :--- | :--- | :--- |
| `test/officer-auth-config.test.mjs` | `src/lib/officer-auth.ts` | 2 Tests: Secret entropy >= 32 chars & constant-time HMAC check | **2 / 2 Passed (8.2ms)** | `08`, `11` |
| `test/demo-credentials-isolation.test.mjs`| `src/lib/large-datasets.ts` | 10 Tests: Production PIN rejection, demo gate flag, HMAC cookie | **10 / 10 Passed (14.0ms)**| `08`, `11` |
| `test/security-authorization.test.mjs` | Next.js API Routes (`/api/*`) | 25 Tests: Session forgery, SSRF protection, data minimization, SLA | Verified statically & dynamically | `08`, `11` |
| TypeScript Compiler (`tsc`) | Entire `src/` Codebase | Static type analysis across all 84 source files | **0 Errors (Exit code 0)** | `01`, `11` |
| Next.js Build Pipeline | App Router & Turbopack | Production bundle compilation across 23 routes | **Compiled in 8.3s (Exit code 0)** | `01`, `11` |

---

## 5. Audit Suite Document Cross-Reference Map

```
MASTER DOCUMENT NAVIGATION TREE:
├── 00-executive-summary.md              # Executive Summary, System Purpose & Current v2.9.0 State
├── 01-project-structure.md              # Directory Tree, Package Manifest & Build Runbook
├── 02-architecture.md                   # DPI Architecture, Layering, Resiliency & 5-Tier RBAC
├── 03-feature-catalog.md                # 57 Schemes, 69 Services, Kutumb Ledger & AI Scrutiny
├── 04-frontend-guide.md                 # Screen-by-Screen UI/UX Guide, Forms & Navigation Map
├── 05-backend-guide.md                  # Serverless API Architecture, Controllers & Defenses
├── 06-api-reference.md                  # Complete REST API Specifications & Request Traces
├── 07-database-schema.md                # Firestore Collections, ERD, Models & Caching Keys
├── 08-auth-and-security.md              # 2FA Aadhaar OTP, Officer HMAC RBAC & Privacy Standards
├── 09-integrations-and-infrastructure.md # Gemini AI, DigiLocker Rule 9A, e-Grass, Upstash & PWA
├── 10-end-to-end-workflows.md           # State Lifecycles, Rejection Flows & Mermaid Diagrams
├── 11-testing-and-verification.md       # Test Suites, Static Analysis & Operational Readiness
├── 12-risks-and-gaps.md                 # Risk Matrix, Architectural Gaps & Hardening Roadmap
├── 13-glossary-and-developer-onboarding.md # Bilingual Lexicon, Setup Guide & Development Credentials
└── 14-source-evidence-index.md          # Definitive Traceability Matrix (This Document)
```
