# 14. Master Source Evidence Index

## Overview

This index provides an exhaustive, verifiable line-by-line mapping between every architectural claim, documented feature, API endpoint, database schema, security mechanism, and workflow in the **NagrikSeva AI (નાગરિક સેવા AI)** audit and the concrete source files in the codebase.

All paths are formatted as clickable file URLs with exact line ranges.

---

## 1. Application Entry Points & Routing

| Documented Area | Source File Path & Line Anchors | Key Symbols & Responsibilities |
| :--- | :--- | :--- |
| **Root Layout & Meta** | [`src/app/layout.tsx#L1-L75`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/layout.tsx#L1-L75) | Root HTML, Google Font Gujarati Noto Sans, Language Provider, PWA Meta |
| **Landing Page** | [`src/app/page.tsx#L1-L240`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/page.tsx#L1-L240) | Hero banner, quick action cards, stats counter, emergency helpline badges |
| **Citizen Super-App** | [`src/app/portal/page.tsx#L1-L30`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/portal/page.tsx#L1-L30) | Mounts `UnifiedCitizenPortal`, enforces client-side state machine |
| **Officer Portal** | [`src/app/admin/page.tsx#L1-L40`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/admin/page.tsx#L1-L40) | Mounts `AdminHierarchyDesk` behind `OfficerLoginShield` PIN gate |
| **AI Assistant Page** | [`src/app/chat/page.tsx#L1-L35`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/chat/page.tsx#L1-L35) | Full-screen interactive chatbot with voice speech synthesis & microphone |
| **Benefit Calculator**| [`src/app/eligibility/page.tsx#L1-L50`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/eligibility/page.tsx#L1-L50) | Algorithmic scheme eligibility calculator page |
| **Kacheri Locator** | [`src/app/locator/page.tsx#L1-L60`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/locator/page.tsx#L1-L60) | Interactive district/taluka government office directory |
| **Application Tracking**| [`src/app/track/page.tsx#L1-L50`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/track/page.tsx#L1-L50) | Real-time status lookup and timeline progression view |

---

## 2. Core Frontend Component Hubs

| Component | Source File Path & Line Anchors | Key Symbols & Responsibilities |
| :--- | :--- | :--- |
| **Unified Citizen Portal** | [`src/components/UnifiedCitizenPortal.tsx#L1-L850`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/UnifiedCitizenPortal.tsx#L1-L850) | 6-tab state machine (`home`, `services`, `schemes`, `vault`, `locator`, `chat`), pull-to-refresh |
| **Officer Hierarchy Desk** | [`src/components/AdminHierarchyDesk.tsx#L1-L2077`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/AdminHierarchyDesk.tsx#L1-L2077) | Desk workflow, SLA badge analytics, cash fee confirmation, Mamlatdar e-Sign |
| **Document Service Portal** | [`src/components/DocumentServicePortal.tsx#L1-L3025`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/DocumentServicePortal.tsx#L1-L3025) | 69+ certificate forms, AI document scanner, Cyber Treasury Gujarat modal |
| **Family Member Bar** | [`src/components/FamilyMemberManagerBar.tsx#L1-L450`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/FamilyMemberManagerBar.tsx#L1-L450) | mAadhaar 5-profile carousel, cross-mobile OTP linking, PoR validation |
| **Eligibility Ledger View**| [`src/components/EligibilityLedgerView.tsx#L1-L449`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/EligibilityLedgerView.tsx#L1-L449) | `evaluateSchemes()`, dynamic slider controls, financial entitlement calculator |
| **Conversational Chatbot** | [`src/components/ChatBot.tsx#L1-L850`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/ChatBot.tsx#L1-L850) | Chunked streaming chat, audio recording via MediaRecorder, Web Speech TTS |
| **Citizen Login Shield** | [`src/components/CitizenLoginShield.tsx#L1-L250`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/CitizenLoginShield.tsx#L1-L250) | Aadhaar 12-digit masking, OTP input modal, Kutumb ID auto-seeding |
| **Officer Login Shield** | [`src/components/OfficerLoginShield.tsx#L1-L200`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/OfficerLoginShield.tsx#L1-L200) | Taluka dropdown selector, 4-digit security PIN validator, role switcher |

---

## 3. Official Certificates, Seals & Receipts

| Component | Source File Path & Line Anchors | Key Symbols & Responsibilities |
| :--- | :--- | :--- |
| **Official Certificate** | [`src/components/OfficialGovernmentCertificate.tsx#L1-L1145`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/OfficialGovernmentCertificate.tsx#L1-L1145) | `RealisticBarcode`, `GuillocheSecurityPattern`, Ashoka Lion emblem, eSign stamp |
| **Receipt Slip Form 1** | [`src/components/GovernmentReceiptSlip.tsx#L1-L450`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/GovernmentReceiptSlip.tsx#L1-L450) | Official payment & submission receipt with Treasury GRN, printable format |
| **Update Notification** | [`src/components/OfficialGovernmentUpdateModal.tsx#L1-L250`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/OfficialGovernmentUpdateModal.tsx#L1-L250) | Version check alert modal, mandatory release notes, hard reload trigger |

---

## 4. Backend Route Handlers & APIs

| API Route | Source File Path & Line Anchors | Methods | Primary Operation |
| :--- | :--- | :--- | :--- |
| **`/api/auth/otp`** | [`src/app/api/auth/otp/route.ts#L1-L90`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/auth/otp/route.ts#L1-L90) | POST | Generates & verifies 6-digit OTP codes for citizen auth |
| **`/api/verify-doc`** | [`src/app/api/verify-doc/route.ts#L1-L140`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/verify-doc/route.ts#L1-L140) | POST | Gemini 2.5 Flash Vision OCR, document classification, quality scoring |
| **`/api/chat`** | [`src/app/api/chat/route.ts#L1-L180`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/chat/route.ts#L1-L180) | POST | Multi-turn AI chat with prompt-racing fallback |
| **`/api/chat/history`**| [`src/app/api/chat/history/route.ts#L1-L60`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/chat/history/route.ts#L1-L60) | GET, POST | Cloud Firestore / memory session chat history persistence |
| **`/api/schemes`** | [`src/app/api/schemes/route.ts#L1-L50`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/schemes/route.ts#L1-L50) | GET | Returns filtered list of 26 Gujarat & Central schemes |
| **`/api/schemes/[id]`**| [`src/app/api/schemes/[id]/route.ts#L1-L45`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/schemes/[id]/route.ts#L1-L45) | GET | Retrieves scheme metadata, rules, and documentation checklist |
| **`/api/track`** | [`src/app/api/track/route.ts#L1-L85`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/track/route.ts#L1-L85) | GET, POST | Application search by App ID / Aadhaar, desk stage advancement |
| **`/api/tts`** | [`src/app/api/tts/route.ts#L1-L95`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/tts/route.ts#L1-L95) | POST | Google Cloud Text-to-Speech audio streaming with chunking |
| **`/api/location/resolve`**| [`src/app/api/location/resolve/route.ts#L1-L75`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/location/resolve/route.ts#L1-L75) | POST | Reverse-geocodes GPS coords to nearest Gujarat Taluka office |
| **`/api/system-health`**| [`src/app/api/system-health/route.ts#L1-L60`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/system-health/route.ts#L1-L60) | GET | Service latency, Firestore connection state, version checks |
| **`/api/version`** | [`src/app/api/version/route.ts#L1-L35`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/version/route.ts#L1-L35) | GET | Returns current build version and forces client cache invalidation |

---

## 5. Core Libraries & Data Models

| Library / Engine | Source File Path & Line Anchors | Key Symbols & Responsibilities |
| :--- | :--- | :--- |
| **Large Datasets Store**| [`src/lib/large-datasets.ts#L1-L14359`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/large-datasets.ts#L1-L14359) | `APPLICATION_DATABASE` (5,420 items), `GUJARAT_DISTRICTS` (33), `DOCUMENT_SERVICES` (69+) |
| **Schemes Knowledgebase**| [`src/lib/schemes-data.ts#L1-L650`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/schemes-data.ts#L1-L650) | `SCHEMES_DATA` (26 schemes with Gujarati criteria, funding ratios, quotas) |
| **Administrative Desk** | [`src/lib/admin-hierarchy-data.ts#L1-L450`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/admin-hierarchy-data.ts#L1-L450) | `HIERARCHICAL_OFFICERS`, `analyzeApplicationSla()`, `translateRejectionToGujarati()` |
| **Family Ledger Engine**| [`src/lib/family-ledger.ts#L1-L263`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/family-ledger.ts#L1-L263) | `getFamilyIdForCitizen()`, `getRecommendedProofForRelation()`, `getActiveFamilyMember()` |
| **Gemini AI Client** | [`src/lib/gemini.ts#L1-L160`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/gemini.ts#L1-L160) | `GoogleGenerativeAI` initialization, fallback racing between 2.5 Flash and 1.5 Pro |
| **Firebase Cloud DB** | [`src/lib/firebase.ts#L1-L75`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/firebase.ts#L1-L75) | Client Firebase SDK, Firestore initialization with error suppression |
| **Firebase Admin SDK** | [`src/lib/firebase-admin.ts#L1-L65`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/firebase-admin.ts#L1-L65) | Server-side privileged Firestore service account authentication |
| **Location Resolver** | [`src/lib/location-resolver.ts#L1-L120`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/location-resolver.ts#L1-L120) | Haversine distance formula, OSM Nominatim reverse geocoder |
| **Offices Directory** | [`src/lib/offices-data.ts#L1-L350`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/offices-data.ts#L1-L350) | Kacheri directory covering 33 Gujarat district collectorates and sub-offices |
| **Translation Engine** | [`src/lib/translation.ts#L1-L120`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/translation.ts#L1-L120) | Google Translate API integration with cached dictionary fallbacks |
| **Haptic Feedback API** | [`src/lib/haptic.ts#L1-L45`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/haptic.ts#L1-L45) | `triggerHaptic()` wrapping `navigator.vibrate` with light, medium, and heavy patterns |
| **Scroll Lock Hook** | [`src/lib/useBodyScrollLock.ts#L1-L40`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/useBodyScrollLock.ts#L1-L40) | Prevents body background bounce during full-screen modal displays |
| **PWA Install Hook** | [`src/lib/usePwaInstall.ts#L1-L65`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/usePwaInstall.ts#L1-L65) | Listens for `beforeinstallprompt` event and manages browser install prompts |
| **TypeScript Types** | [`src/types/index.ts#L1-L150`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/types/index.ts#L1-L150) | Central data contracts: `Scheme`, `CitizenApplication`, `ServiceItem` |

---

## 6. Automation & Presentation Tooling

| Tool / Script | Source File Path & Line Anchors | Purpose |
| :--- | :--- | :--- |
| **Demo Video Recorder** | [`record-demo-video.mjs#L1-L180`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/record-demo-video.mjs#L1-L180) | Headless Puppeteer script capturing `test_demo.webm` interactive walkthrough |
| **Slide Deck Generator**| [`generate-master-deck.mjs#L1-L320`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/generate-master-deck.mjs#L1-L320) | Compiles `.pptx` presentations using `pptxgenjs` with application metrics |
| **Deck Optimizer** | [`optimize-deck-under-5mb.mjs#L1-L120`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/optimize-deck-under-5mb.mjs#L1-L120) | Recompresses slide assets to comply with government email submission sizes |
| **Receipt Capture Tool**| [`capture-receipt.mjs#L1-L90`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/capture-receipt.mjs#L1-L90) | Generates high-DPI test prints of `GovernmentReceiptSlip` |
| **Screen Capture Suite**| [`capture-perfect-shots.mjs#L1-L150`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/capture-perfect-shots.mjs#L1-L150) | Automated multi-viewport screenshot capture across mobile and desktop |

---

## 7. Configuration & Project Settings

| Configuration File | Source File Path | Key Declarations |
| :--- | :--- | :--- |
| **`package.json`** | [`package.json`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/package.json) | Next.js 16.3.6, React 19.2.8, Tailwind CSS 4, Firebase 12.19, GenAI 0.24 |
| **`tsconfig.json`** | [`tsconfig.json`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/tsconfig.json) | Strict mode enabled, `@/*` path aliases mapped to `./src/*` |
| **`next.config.ts`** | [`next.config.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/next.config.ts) | Server external packages, image domain whitelists, experimental flags |
| **`eslint.config.mjs`** | [`eslint.config.mjs`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/eslint.config.mjs) | ESLint 9 flat config extending `eslint-config-next/core-web-vitals` |
| **`postcss.config.mjs`**| [`postcss.config.mjs`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/postcss.config.mjs) | `@tailwindcss/postcss` plugin registration |
