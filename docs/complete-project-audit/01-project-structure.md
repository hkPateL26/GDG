# 01 — WORKSPACE & PROJECT STRUCTURE
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** Codebase Inventory, File Tree, and Build Configuration  
**Active Repository Root:** `d:\Movies and Web se\atmiya\nagrik-seva`  
**Git Remote:** `https://github.com/hkPateL26/GDG.git` (Branch: `main`)

---

## 1. Repository Layout & Workspace Context

The parent workspace (`d:\Movies and Web se\atmiya`) serves as the master project umbrella containing presentation assets, pitch decks, demo videos, and datasets. The primary executable application resides within the `nagrik-seva/` subfolder, which constitutes a standalone Next.js 16 (App Router) full-stack software repository:

```
d:\Movies and Web se\atmiya\
├── nagrik-seva/                   <-- Next.js 16 Enterprise Application Root
│   ├── .next/                     <-- Turbopack build outputs and route manifest
│   ├── docs/                      <-- Project audit & technical documentation
│   │   ├── complete-project-audit/ <-- Active v2.9.0 15-document audit suite
│   │   └── project-audit/         <-- Historical v2.5.9 audit archive
│   ├── public/                    <-- Static assets, PWA manifest, service worker
│   ├── src/                       <-- Application source code (TypeScript)
│   │   ├── app/                   <-- Next.js App Router (Pages & API Routes)
│   │   ├── components/            <-- UI Components & Feature Modules
│   │   ├── context/               <-- React State Contexts (Language, etc.)
│   │   ├── lib/                   <-- Domain Services, Datasets, & Engines
│   │   └── types/                 <-- Global TypeScript Interface Definitions
│   ├── test/                      <-- Native ESM Test Suites
│   ├── .env.example               <-- Environment configuration blueprint
│   ├── .gitignore                 <-- Version control exclusion patterns
│   ├── eslint.config.mjs          <-- ESLint 9 configuration
│   ├── next.config.ts             <-- Next.js runtime & security header config
│   ├── package.json               <-- Project manifest & dependencies
│   ├── postcss.config.mjs         <-- Tailwind CSS PostCSS plugin config
│   └── tsconfig.json              <-- TypeScript 5 compiler options
└── [Workspace Media / Presentations / Decks / Demos]
```

---

## 2. Source Code Inventory (`src/`)

The application codebase comprises **84 TypeScript/TSX source files** structured into five core sub-directories:

### 2.1 Route Definitions (`src/app/`)
Next.js 16 App Router handles both UI pages and RESTful serverless API endpoints:

```
src/app/
├── admin/
│   └── page.tsx                   # Officer Hierarchy Desk Entry Point (294 bytes)
├── api/
│   ├── auth/otp/route.ts          # Aadhaar 2FA OTP Generation & Verification (9.3 KB)
│   ├── chat/route.ts              # Gemini 2.5 Flash Multilingual Chat Stream (47.2 KB)
│   ├── chat/history/route.ts      # Cloud Firestore Chat Log Retrieval (4.9 KB)
│   ├── digilocker/route.ts        # DigiLocker & MeriPehchaan Auth & Fetch (12.5 KB)
│   ├── geo/villages/route.ts      # Gujarat 18,225 Village Geo-Resolution (2.5 KB)
│   ├── location/resolve/route.ts  # Lat/Long GPS to Taluka/District Resolver (3.8 KB)
│   ├── notices/route.ts           # Dynamic Circulars & Public Notice Engine (1.8 KB)
│   ├── offices/route.ts           # Government Office & Kacheri Directory (8.0 KB)
│   ├── schemes/route.ts           # 57 Welfare Schemes Catalog & Search (10.6 KB)
│   ├── schemes/[id]/route.ts      # Dynamic Scheme Specification Resolver (1.7 KB)
│   ├── system-health/route.ts     # Edge Cache, Firestore & ML Telemetry (2.6 KB)
│   ├── track/route.ts             # Application Tracking & Officer Decision (33.4 KB)
│   ├── tts/route.ts               # Google Cloud Text-to-Speech Engine (4.3 KB)
│   ├── verify-doc/route.ts        # Gemini Vision Multimodal OCR Pre-Audit (47.8 KB)
│   └── version/route.ts           # Dynamic Build Hash & Commit Telemetry (1.7 KB)
├── benefit-calculator/
│   └── page.tsx                   # Multi-Category Welfare Benefit Calculator (99.5 KB)
├── chat/
│   └── page.tsx                   # Fullscreen AI Conversational Assistant (1.9 KB)
├── documents/
│   └── page.tsx                   # 12 Revenue Services Citizen Gateway (274 bytes)
├── eligibility/
│   └── page.tsx                   # Quick Rule-Based Scheme Screener (278 bytes)
├── locator/
│   └── page.tsx                   # Jan Seva Kendra & Kacheri Map Directory (10.1 KB)
├── portal/
│   └── page.tsx                   # Unified Citizen Service Portal View (274 bytes)
├── schemes/
│   ├── page.tsx                   # 57 Welfare Schemes Search & Filtering (12.9 KB)
│   └── [id]/page.tsx              # Deep Scheme Dossier, Rules & Apply Modal (44.3 KB)
├── track/
│   └── page.tsx                   # Citizen Application Tracking Vault (266 bytes)
├── globals.css                    # Tailwind CSS v4 directives & Gov design tokens
├── layout.tsx                     # Root App Shell, PWA Providers, Splash & Modals
└── page.tsx                       # Master Landing Page / Citizen Super-App Shell
```

### 2.2 UI Components (`src/components/`)
A library of 35 specialized React 19 components executing client interactions:

| Component | Size | Architectural Responsibility |
| :--- | :--- | :--- |
| `AdminHierarchyDesk.tsx` | 111.5 KB | 5-Tier Officer Workbench: Scrutiny Queue, SLA Timers, e-Sign, & Rejection Modals. |
| `AdminPortalCmsManager.tsx`| 100.5 KB | 4-Tab Dynamic CMS: Manage Schemes, Kacheri Offices, Government Notices, & Policies. |
| `AiBottleneckMonitor.tsx` | 17.2 KB | Live Telemetry tracking taluka-level file backlogs and officer clearance speed. |
| `AppSplashScreen.tsx` | 4.8 KB | PWA Launch Screen displaying Ashok Stambh emblem and Gujarat State crest. |
| `ChatBot.tsx` | 76.8 KB | Streaming AI Assistant with Web Speech API input and Google TTS voice synthesis. |
| `CitizenLoginShield.tsx` | 17.7 KB | Aadhaar 2FA OTP & MeriPehchaan citizen authentication modal. |
| `CitizenPortalHeader.tsx` | 8.6 KB | Top navigation bar with active citizen profile, language pill, and quick links. |
| `DigiLockerGatewayModal.tsx`| 64.6 KB | IT Act Rule 9A Gateway for pulling authentic documents directly from DigiLocker. |
| `DocumentServicePortal.tsx`| 217.5 KB | Master Citizen Application Gateway for 12 statutory Revenue/Panchayat services. |
| `DynamicFeaturedSchemes.tsx`| 6.0 KB | Client component rendering dynamic top-priority government welfare schemes. |
| `EligibilityLedgerView.tsx`| 24.0 KB | Family ledger eligibility cross-checker against income and caste thresholds. |
| `EnterpriseSystemHealthBar.tsx`| 13.7 KB| Live telemetry bar indicating Redis, Firestore, and AI engine response latencies. |
| `FamilyMemberManagerBar.tsx`| 64.2 KB | Kutumb Family Ledger: Add/remove family members and synchronize their credentials. |
| `GovernmentReceiptSlip.tsx`| 39.3 KB | Official Cyber Treasury e-Grass cash/online receipt with barcode and CRN. |
| `LanguageSelector.tsx` | 11.8 KB | 16-Language selection switcher with native script typography. |
| `OfficialGovernmentCertificate.tsx`| 61.2 KB | High-resolution official state certificate with QR code, hash, and print styles. |
| `OfficialGovernmentUpdateModal.tsx`| 14.0 KB| Version changelog and DPI update modal announcing recent platform features. |
| `SecretariatApexBiDashboard.tsx`| 15.4 KB| Executive dashboard for Chief Secretary / IAS with 6-month ML delay prediction. |
| `SmartKacheriLocatorBanner.tsx`| 34.8 KB| Geolocation banner locating nearest Taluka Seva Sadan or Jan Seva Kendra. |
| `TrackVaultView.tsx` | 81.5 KB | Citizen status tracker with tracking secrets, appeal filing, and receipt downloads. |
| `UnifiedCitizenPortal.tsx` | 18.1 KB | State-gated citizen shell coordinating login shields and service selection. |

### 2.3 Domain Services & Core Engines (`src/lib/`)
Contains business logic, data structures, caching layers, and external service clients:

| Module | Size | Primary Function |
| :--- | :--- | :--- |
| `admin-hierarchy-data.ts` | 22.7 KB | 5-Tier Officer model, designations, PINs, and territorial jurisdictions. |
| `app-version.ts` | 3.0 KB | Application release metadata (`v2.8.5` / `v2.9.0`), lead developers, changelog. |
| `digilocker-engine.ts` | 57.9 KB | DigiLocker document schemas, URI parser, mock and live OAuth adapter. |
| `family-ledger.ts` | 10.9 KB | Kutumb Family Ledger local vault, member relations, and income calculation. |
| `firebase.ts` | 1.3 KB | Client-side Firebase Web SDK initialization. |
| `firebase-admin.ts` | 1.3 KB | Server-side Firebase Admin SDK initialization for secure API operations. |
| `gemini.ts` | 4.5 KB | Google Gemini API configuration, model initialization, and prompt templates. |
| `gujarat-geo-engine.ts` | 25.5 KB | Cascading geographical database: 33 districts, 250+ talukas, 18,225 villages. |
| `historical-ml-engine.ts` | 8.2 KB | 6-Month historical dataset & linear regression model for SLA breach prediction. |
| `large-datasets.ts` | 228.1 KB | Master dataset: 5,420 citizen applications, 12 service SLA configs, and demo users. |
| `location-resolver.ts` | 4.5 KB | Haversine formula distance calculations between citizen GPS and kacheri offices. |
| `officer-auth.ts` | 24.5 KB | Officer HMAC SHA-256 session management, cookie parsing, and RBAC guards. |
| `offices-data.ts` | 28.3 KB | Directory of Gujarat administrative offices with coordinates and contact details. |
| `public-notices-data.ts` | 6.4 KB | Public notices and circulars engine with local storage and API synchronization. |
| `redis-cache.ts` | 3.6 KB | L1 In-Memory LRU Cache & Upstash Redis Engine for sub-millisecond data delivery. |
| `schemes-data.ts` | 131.4 KB | Authoritative catalog of 57 Gujarat and Central government welfare schemes. |
| `translation.ts` | 4.3 KB | Bilingual translation dictionaries and helper routines. |

---

## 3. Technology Stack & Dependencies

### 3.1 Production Dependencies (`package.json`)
```json
{
  "dependencies": {
    "@genkit-ai/googleai": "^1.28.0",
    "@genkit-ai/next": "^1.42.0",
    "@google/generative-ai": "^0.24.1",
    "firebase": "^12.19.0",
    "firebase-admin": "^14.5.0",
    "genkit": "^1.42.0",
    "lucide-react": "^1.48.0",
    "next": "16.3.6",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  }
}
```

### 3.2 Development Dependencies & Build Tools
```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.6",
    "pptxgenjs": "^4.0.1",
    "puppeteer": "^25.12.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 4. Configuration Manifest

### 4.1 Next.js Configuration (`next.config.ts`)
Configures security response headers and asset access controls:
- **PWA Manifest & Icons:** Injects CORS headers (`Access-Control-Allow-Origin: *`) for `/manifest.json` and `/icon.svg` to support cross-origin service worker installation.
- **Security Headers:** Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (clickjacking mitigation), and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Turbopack Indicators:** Disables development indicators (`devIndicators: false`) for clean UI recording.

### 4.2 TypeScript Configuration (`tsconfig.json`)
- **Target & Libraries:** Target `ES2017`, libraries `["dom", "dom.iterable", "esnext"]`.
- **Strict Mode:** Enabled (`"strict": true`, `"noEmit": true`).
- **Module Resolution:** Bundler mode (`"moduleResolution": "bundler"`, `"module": "esnext"`).
- **Path Aliases:** Maps `@/*` directly to `./src/*`.

### 4.3 Tailwind CSS v4 & PostCSS Configuration
Tailwind CSS v4 replaces legacy JavaScript config files with direct CSS directives within `src/app/globals.css`. PostCSS is configured via `postcss.config.mjs`:
```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

---

## 5. System Entry Points & Request Routing

1. **Citizen Web Application Entry Point:**  
   `src/app/page.tsx` renders the primary landing shell, wrapping `UnifiedCitizenPortal.tsx`, `SmartKacheriLocatorBanner.tsx`, `DynamicFeaturedSchemes.tsx`, and `ChatBot.tsx`.
2. **Officer Administration Desk Entry Point:**  
   `src/app/admin/page.tsx` renders `AdminHierarchyDesk.tsx`, enforcing mandatory officer login through `OfficerLoginShield.tsx`.
3. **Citizen Welfare Services Gateway:**  
   `src/app/documents/page.tsx` mounts `DocumentServicePortal.tsx`, orchestrating multi-step application wizards for all 12 statutory services.
4. **API Execution Pipeline:**  
   Requests to `/api/*` bypass React rendering and execute directly within Next.js Node.js serverless functions, importing shared domain models from `src/lib/`.

---

## 6. Execution Runbook & Operational Commands

All operations are executed from `d:\Movies and Web se\atmiya\nagrik-seva`:

| Command | Command String | Purpose & Verification Standard |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Launches local development server on `http://localhost:3000` with hot-module reloading. |
| **Type Check** | `npx tsc --noEmit` | Executes static TypeScript analysis across all source files. Expected: `0 errors`. |
| **Production Build**| `npm run build` | Compiles application with Next.js Turbopack, generating static and dynamic route manifests. |
| **Production Start**| `npm run start` | Boots the optimized production server bundle on designated port. |
| **Linting** | `npm run lint` | Runs ESLint 9 against project rules. |
| **Officer Auth Test**| `node test/officer-auth-config.test.mjs` | Verifies officer RBAC secret configuration and token validation. Expected: `2/2 pass`. |
| **Isolation Test** | `node test/demo-credentials-isolation.test.mjs` | Verifies that mock credentials and demo accounts are isolated from production. Expected: `10/10 pass`. |
| **Security Test** | `node test/security-authorization.test.mjs` | 25 integration tests validating API authorization, data minimization, and SSRF defenses. |
