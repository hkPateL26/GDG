# 13. Domain Glossary & Developer Onboarding Guide

## Overview

This guide serves as a comprehensive reference manual for software engineers, product managers, and civil technology specialists onboarding onto the **NagrikSeva AI (નાગરિક સેવા AI)** platform. It bridges the gap between public administration domain concepts in Gujarat and the underlying Next.js 16 / React 19 codebase.

---

## Part 1: Government Domain & Administrative Glossary

| Term | Gujarati Term | Definition & Legal / Administrative Context |
| :--- | :--- | :--- |
| **GRTSA 2013** | ગુજરાત સેવાઓનો અધિકાર અધિનિયમ | **Gujarat Right to Services Act, 2013**. State legislation guaranteeing timely public service delivery. Specifies statutory SLAs (typically 3–15 days) and penalizes administrative delays with mandatory appeals to Prant Officers. |
| **NFSA 2013** | રાષ્ટ્રીય ખાદ્ય સુરક્ષા કાયદો | **National Food Security Act, 2013**. Establishes targeted public distribution of food grains. In this system, NFSA Ration Cards serve as the foundational Proof of Relationship (PoR) for the multi-member family ledger. |
| **AnyRoR** | એની આર.ઓ.આર. | **Any Records of Rights Anywhere in Gujarat**. The official government land records portal. Issues Village Form No. 7/12 (ownership details) and 8-A (khata holding ledger) required for farmer welfare schemes. |
| **Jan Seva Kendra (JSK)** | જન સેવા કેન્દ્ર | Offline citizen facilitation counters operating at District Collectorates and Taluka Mamlatdar offices. NagrikSeva AI bridges in-person JSK visits with digital self-service. |
| **Kutumb ID** | કુટુંબ આઈડી | Family Ledger identifier (`GJ-KUTUMB-XXXX-YYYY`) created in NagrikSeva AI by hashing primary citizen Aadhaar and mobile data, enabling unified family management. |
| **Digital Gujarat Portal** | ડિજિટલ ગુજરાત પોર્ટલ | The state web portal providing 70+ citizen certificates. NagrikSeva AI provides a conversational, AI-driven front-end layer over these statutory schemas. |
| **i-Khedut** | આઈ-ખેડૂત પોર્ટલ | State portal for agriculture, horticulture, and animal husbandry subsidies. Referenced in NagrikSeva AI's Scheme Engine. |
| **Talati Mantri** | તલાટી મંત્રી | The grassroots Village Panchayat Secretary and Revenue Officer. Responsible for primary ground verification, 7/12 land checks, and initial scrutiny (Stage 1). |
| **Nayab Mamlatdar** | નાયબ મામલતદાર | Deputy Mamlatdar at the Taluka level. Conducts legal and administrative scrutiny of applications forwarded by Talatis (Stage 2). |
| **Mamlatdar** | મામલતદાર | The Executive Magistrate and Chief Revenue Officer of the Taluka. Possesses final statutory authority to approve certificates and apply digital e-Sign stamps (Stage 3). |
| **Cyber Treasury Gujarat** | સાયબર ટ્રેઝરી ગુજરાત | The state government's centralized online treasury portal for collecting statutory application fees, stamp duties, and challan payments. |
| **Non-Creamy Layer (NCL)** | નોન-ક્રીમી લેયર | Official certificate proving that an SEBC/OBC applicant's family income falls below the statutory limit (currently ₹8,00,000/year) to qualify for state reservation benefits. |
| **e-Pramaan / UIDAI AUA** | ઈ-પ્રમાણ / આધાર સેવા | National standards for identity authentication. Authentication User Agency (AUA) is a licensed entity authorized to initiate Aadhaar OTP and biometric auth. |

---

## Part 2: Developer Onboarding & Local Environment Setup

### 1. System Requirements & Prerequisites
- **Node.js**: `v20.x` or `v22.x` recommended (minimum `v18.18.0` for Next.js 16).
- **Package Manager**: `npm` (v10+), `pnpm` (v9+), or `yarn` (v1.22+).
- **OS**: Windows, macOS, or Linux (cross-platform tested).
- **RAM**: Minimum 8GB (16GB recommended due to parsing large static datasets).

### 2. Repository Clone & Directory Navigation
```bash
# Clone the repository
git clone <repository-url>

# Navigate into the core Next.js application workspace
cd nagrik-seva
```

### 3. Environment Variable Configuration
The application is architected to run immediately in **Zero-Configuration Mode** using bundled mock datasets. To enable live AI vision scanning, live chat, or cloud database sync, create a `.env.local` file in `nagrik-seva/`:

```env
# ==============================================================================
# NAGRIKSEVA AI - ENVIRONMENT CONFIGURATION (.env.local)
# ==============================================================================

# 1. Google Gemini AI Models (Required for live chat & document verification)
# Get your free key from https://aistudio.google.com/
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# 2. Google Cloud Speech & Translation (Optional fallbacks exist)
GOOGLE_TTS_API_KEY=""
GOOGLE_TRANSLATE_API_KEY=""

# 3. Firebase Cloud Firestore (Optional - runs in-memory if omitted)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""

# 4. Firebase Admin SDK Service Account (Optional for server-side direct DB)
FIREBASE_CLIENT_EMAIL=""
FIREBASE_PRIVATE_KEY=""
```

### 4. Dependency Installation
```bash
# Install exact pinned dependencies
npm install
```

### 5. Running the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Part 3: Architecture Conventions & Key File Locations

```text
nagrik-seva/
├── src/
│   ├── app/                      # Next.js 16 App Router Pages & API Routes
│   │   ├── page.tsx              # Public Homepage & Feature Highlights
│   │   ├── portal/page.tsx       # Unified Citizen Super-App (/portal)
│   │   ├── admin/page.tsx        # Officer Hierarchy Desk (/admin)
│   │   ├── chat/page.tsx         # Voice & Text Citizen Chat Assistant (/chat)
│   │   ├── eligibility/page.tsx  # Dynamic Welfare Calculator (/eligibility)
│   │   ├── locator/page.tsx      # Smart Geo-Kacheri Locator (/locator)
│   │   └── api/                  # 11 REST API Route Handlers
│   ├── components/               # React 19 Client Components
│   │   ├── UnifiedCitizenPortal.tsx   # Central citizen experience hub
│   │   ├── AdminHierarchyDesk.tsx     # Officer dashboard & workflow desk
│   │   ├── DocumentServicePortal.tsx  # Document upload & payment portal
│   │   ├── FamilyMemberManagerBar.tsx # mAadhaar 5-profile & Kutumb ID switcher
│   │   ├── OfficialGovernmentCertificate.tsx # SVG guilloche eSign certificate
│   │   └── ChatBot.tsx                # Streaming multilingual AI assistant
│   ├── lib/                      # Core Business Logic & Data Stores
│   │   ├── large-datasets.ts          # 5,420 mock applications & Gujarat geography
│   │   ├── schemes-data.ts            # 26 Gujarat & Central scheme definitions
│   │   ├── admin-hierarchy-data.ts    # Officer profiles & SLA benchmark rules
│   │   ├── family-ledger.ts           # Family profile store & relation engine
│   │   └── gemini.ts                  # Gemini 2.5 Flash model client & racing
│   └── types/                    # Shared TypeScript interfaces (index.ts)
```

---

## Part 4: Common Developer FAQs & Pitfalls

### FAQ 1: Can I run and test the application without Firebase or Gemini keys?
**Yes.** The system was deliberately designed with a **Graceful Degradation Architecture**. If no API keys are present:
- Document scanning falls back to heuristic client checks with 88% default confidence.
- Database runs against `APPLICATION_DATABASE` with 5,420 pre-seeded Gujarat citizen records.
- Audio speech falls back to the native browser Web Speech API.

### FAQ 2: Why does `large-datasets.ts` take time to open in VS Code?
`large-datasets.ts` is 14,359 lines long because it contains comprehensive geographic data (all 33 Gujarat districts, 248 talukas, and 18,000+ villages) as well as 5,420 simulated citizen records. It is recommended to use symbol search (`Ctrl+P` -> `@functionName`) rather than scrolling through the entire file.

### FAQ 3: How do I test the Officer Portal?
Navigate to `/admin`. Select any jurisdiction (e.g. `Rajkot -> Gondal`) and enter demo PIN `1234` or `7890`.

### FAQ 4: How do I trigger audio speech output in Gujarati?
Click the speaker icon next to any AI assistant message. Ensure your browser allows auto-playing audio, or ensure the voice toggle is active in `/chat`.
