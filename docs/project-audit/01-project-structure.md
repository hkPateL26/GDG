# 01 — Project Structure & Repository Inventory

---

## 1. Workspace Hierarchy & Root Map

The workspace root is located at `D:\Movies and Web se\atmiya`. It contains two main categories of artifacts:
1. **The Application Monorepo (`nagrik-seva`):** The complete Next.js 16 full-stack TypeScript application, containing all source code, API handlers, UI components, static assets, and deployment configurations.
2. **Hackathon Submission & Media Deliverables (Root directory):** High-resolution video recordings, demonstration captures, optimized presentation decks, and evaluation templates for the *Google Cloud: Build with AI* hackathon.

```
D:\Movies and Web se\atmiya\
├── nagrik-seva/                           # PRIMARY CODEBASE (Next.js 16 Super-App)
│   ├── .git/                              # Git version control directory
│   ├── .next/                             # Next.js build cache and output
│   ├── node_modules/                      # Installed npm dependencies
│   ├── public/                            # Static public web assets
│   ├── scripts/                           # Database seeding and doc generation scripts
│   ├── src/                               # Application source code
│   │   ├── app/                           # App Router routes and API handlers
│   │   ├── components/                    # 30 Modular React UI components
│   │   ├── context/                       # React context providers (LanguageContext)
│   │   ├── lib/                           # Core utilities, databases, and SDK setups
│   │   └── types/                         # TypeScript interfaces and type definitions
│   ├── .env.example                       # Environment variables template
│   ├── .env.local                         # Local active secrets (ignored by git)
│   ├── .firebaserc                        # Firebase project binding
│   ├── .gitignore                         # Git exclusion rules
│   ├── AGENTS.md                          # Next.js agent rules
│   ├── CLAUDE.md                          # Agent references
│   ├── DOCUMENTATION.md                   # Legacy technical documentation
│   ├── eslint.config.mjs                  # ESLint 9 configuration
│   ├── firebase.json                      # Firebase hosting and Firestore config
│   ├── firestore.indexes.json             # Firestore index configuration
│   ├── firestore.rules                    # Firestore security rules
│   ├── next.config.ts                     # Next.js production configuration & headers
│   ├── package.json                       # Dependencies, scripts, and metadata
│   ├── postcss.config.mjs                 # PostCSS setup for Tailwind CSS v4
│   ├── README.md                          # Main repository readme
│   ├── tsconfig.json                      # TypeScript strict compiler configuration
│   └── vercel.json                        # Vercel deployment specification
│
├── screenshots/                           # UI screen captures for documentation
├── perfect_screenshots/                   # Full-page high-DPI screenshots
├── preview_verify/                        # Preview validation captures
├── Code Carnival 3.0...Template.pptx      # Official hackathon presentation slides
├── NagrikSeva AI - Master Governance.pdf  # Master presentation deck (4.4 MB)
├── Nagrikseva-AI_demo_video.mp4           # Full demo video recording (550 MB)
├── NagrikSeva_AI_Official_Deck.pdf        # Official slide deck export (4.6 MB)
└── presentation.html                      # Standalone HTML slide presentation
```

---

## 2. Monorepo Directory & Module Inventory (`nagrik-seva`)

### 2.1 `src/app/` (Next.js 16 App Router)

| Route / Path | File | Purpose & Responsibility |
| :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Main portal homepage: Hero section, dynamic citizen greeting card, PhonePe-style quick tools grid, featured welfare schemes, and stats counter. |
| `/` (Layout) | `src/app/layout.tsx` | Root layout: Injects global meta, PWA manifest, font styles, `AppSplashScreen`, `OfficialGovernmentUpdateModal`, `ServiceWorkerRegister`, `HapticFeedbackProvider`, and `GoogleTranslateScript`. |
| `/portal` | `src/app/portal/page.tsx` | Citizen single sign-on entry point. Renders `UnifiedCitizenPortal` default to `track` tab. |
| `/track` | `src/app/track/page.tsx` | Application tracker view. Renders `UnifiedCitizenPortal` with `initialTab="track"`. |
| `/documents` | `src/app/documents/page.tsx` | 69+ Government document services portal. Renders `UnifiedCitizenPortal` with `initialTab="documents"`. |
| `/eligibility` | `src/app/eligibility/page.tsx` | Welfare scheme eligibility ledger. Renders `UnifiedCitizenPortal` with `initialTab="eligibility"`. |
| `/admin` | `src/app/admin/page.tsx` | Officer & Administrative hierarchy desk. Renders `UnifiedCitizenPortal` with `initialMode="officer"`. |
| `/chat` | `src/app/chat/page.tsx` | Dedicated full-viewport Gemini AI conversational assistant page. |
| `/schemes` | `src/app/schemes/page.tsx` | Scheme directory: Category tabs, search query debouncing, pagination, and cloud cluster telemetry badge. |
| `/schemes/[id]` | `src/app/schemes/[id]/page.tsx` | Dynamic single scheme details: Statutory legal acts, eligibility, documents, benefits, and direct submission modal. |
| `/benefit-calculator`| `src/app/benefit-calculator/page.tsx` | Annual family welfare entitlement calculator, Aadhaar OTP simulation, entitlement breakdown, and printable pass. |
| `/locator` | `src/app/locator/page.tsx` | Jan Seva Kendra / Mamlatdar Kacheri locator covering all 33 districts of Gujarat. |

### 2.2 `src/app/api/` (Backend Handlers & Serverless Endpoints)

| Endpoint | File | HTTP Methods | Responsibility |
| :--- | :--- | :--- | :--- |
| `/api/chat` | `src/app/api/chat/route.ts` | `POST` | Gemini AI multi-model streaming chat with location awareness, document vision verification, and act citations. |
| `/api/chat/history` | `src/app/api/chat/history/route.ts` | `GET`, `POST`, `DELETE` | Session management with Firestore persistence and user-isolated memory fallback. |
| `/api/auth/otp` | `src/app/api/auth/otp/route.ts` | `POST` | 2FA citizen authentication: OTP generation, verification, profile fetching, and officer credentials validation. |
| `/api/schemes` | `src/app/api/schemes/route.ts` | `GET` | Schemes retrieval: Category filtering, keyword search, ID lookup, L1 memory caching, and Firestore synchronization. |
| `/api/schemes/[id]` | `src/app/api/schemes/[id]/route.ts` | `GET` | Single scheme detail lookup by slug/ID. |
| `/api/track` | `src/app/api/track/route.ts` | `GET`, `POST`, `PATCH` | Citizen application creation, tracking, status updates, fee payment confirmation, and SLA stage advancement. |
| `/api/verify-doc` | `src/app/api/verify-doc/route.ts` | `POST` | Multimodal Gemini Vision document verification against strict administrative rules. |
| `/api/location/resolve`| `src/app/api/location/resolve/route.ts` | `POST` | Reverse geocoding via OpenStreetMap Nominatim with fallback to Gujarat administrative spatial lookup. |
| `/api/tts` | `src/app/api/tts/route.ts` | `GET`, `POST` | Audio stream generation from text using Google TTS chunking in Gujarati, Hindi, and English. |
| `/api/system-health` | `src/app/api/system-health/route.ts` | `GET` | Telemetry beacon: CPU, memory, Firestore status, system uptime, and version mismatch monitoring. |
| `/api/version` | `src/app/api/version/route.ts` | `GET` | Live version check with filesystem mtime build hash generation. |

### 2.3 `src/components/` (Component Library)

The component library contains 30 dedicated components categorized by domain:

- **Navigation & Layout:** `Navbar.tsx`, `Footer.tsx`, `MobileBottomNav.tsx`, `LanguageSelector.tsx`, `AppSplashScreen.tsx`, `PageLoader.tsx`, `Skeleton.tsx`.
- **Citizen Portal & Authentication:** `UnifiedCitizenPortal.tsx`, `CitizenLoginShield.tsx`, `OfficerLoginShield.tsx`, `CitizenPortalHeader.tsx`, `MobileGreetingCard.tsx`.
- **Welfare & Document Services:** `DocumentServicePortal.tsx`, `FamilyMemberManagerBar.tsx`, `EligibilityLedgerView.tsx`, `SchemeCard.tsx`.
- **Administrative & Tracking:** `TrackVaultView.tsx`, `AdminHierarchyDesk.tsx`, `AiBottleneckMonitor.tsx`, `SmartKacheriLocatorBanner.tsx`.
- **Certificates & Receipts:** `OfficialGovernmentCertificate.tsx`, `GovernmentReceiptSlip.tsx`.
- **PWA & System Telemetry:** `EnterpriseSystemHealthBar.tsx`, `OfficialGovernmentUpdateModal.tsx`, `FloatingInstallBanner.tsx`, `InstallAppModal.tsx`, `ServiceWorkerRegister.tsx`, `HapticFeedbackProvider.tsx`, `GlobalModalScrollLocker.tsx`, `ScrollRestoration.tsx`, `GoogleTranslateScript.tsx`.
- **Conversational AI:** `ChatBot.tsx`.

### 2.4 `src/lib/` (Core Libraries & Static Data Layers)

| Module | Lines of Code | Size | Responsibility |
| :--- | :--- | :--- | :--- |
| `large-datasets.ts` | 5,413 lines | 224 KB | 5,420 deterministic citizen applications, all 33 Gujarat districts, talukas, villages, 69+ document services config, and in-memory operations. |
| `schemes-data.ts` | 552 lines | 38 KB | 26 major state and central welfare schemes with Gujarati, Hindi, and English metadata. |
| `admin-hierarchy-data.ts`| 430 lines | 22 KB | 5-tier administrative hierarchy (Secretariat, Collector, SDM, Mamlatdar, Talati), RBAC permissions, and SLA configs. |
| `family-ledger.ts` | 263 lines | 11 KB | Kutumb Family ID generation, multi-member Aadhaar linking, PoR recommendation engine, and active member switcher. |
| `offices-data.ts` | 465 lines | 23 KB | Jan Seva Kendra and revenue office directory across Gujarat. |
| `gemini.ts` | 76 lines | 4.5 KB | Google Generative AI SDK client initialization, system prompt configuration, and model selection. |
| `firebase.ts` | 31 lines | 1.3 KB | Client-side Firebase App, Firestore, and Auth initialization. |
| `firebase-admin.ts` | 48 lines | 1.3 KB | Server-side Firebase Admin SDK initialization with service account fallback. |
| `app-version.ts` | 51 lines | 2.6 KB | Single source of truth for version number (`v2.5.9`), changelog, and developer credits. |
| `translation.ts` | 102 lines | 4.3 KB | Language switching logic, cookie management for Google Translate, and supported language lists. |
| `languages.ts` | 64 lines | 2.2 KB | Metadata definitions for 16 supported Indian languages. |
| `location-resolver.ts` | 136 lines | 4.5 KB | Haversine distance calculator and spatial coordinate resolver for Gujarat administrative centers. |
| `haptic.ts` | 52 lines | 1.6 KB | Mobile vibration feedback utility for touch actions (`navigator.vibrate`). |
| `usePwaInstall.ts` | 108 lines | 4.0 KB | React hook tracking `beforeinstallprompt` event and standalone PWA display mode. |
| `useBodyScrollLock.ts` | 33 lines | 1.1 KB | React hook freezing background body scroll during active modal displays. |

---

## 3. Configuration Files Breakdown

1. **`package.json`:**
   - Defines Next.js `16.3.6`, React `19.2.8`, `@google/generative-ai` `0.24.1`, `firebase` `12.19.0`, and `firebase-admin` `14.5.0`.
   - Scripts: `dev` (`next dev`), `build` (`next build`), `start` (`next start`), `lint` (`eslint`).
2. **`tsconfig.json`:**
   - Strict TypeScript configuration (`"strict": true`).
   - Module resolution: `"bundler"`.
   - Path alias: `"@/*": ["./src/*"]`.
3. **`next.config.ts`:**
   - Disables development indicators (`devIndicators: false`).
   - Configures permissive CORS headers for `/manifest.json` and `/icon.svg` to support PWA installation.
   - Enforces security response headers across all routes (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`).
4. **`vercel.json`:**
   - Framework preset: `"nextjs"`.
   - Build command: `"npm run build"`, output directory: `".next"`.
5. **`firebase.json` & `firestore.rules`:**
   - Binds Firestore rules and index definitions.
   - `firestore.rules` restricts all client writes: `allow read: if true; allow write: if false;`. Writes must proceed via server-side Admin SDK or server API routes.
6. **`eslint.config.mjs`:**
   - Flat configuration using `eslint/config`, `eslint-config-next/core-web-vitals`, and `eslint-config-next/typescript`.

---

## 4. Execution & Development Commands

```bash
# 1. Navigate to project root
cd "nagrik-seva"

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env.local
# Set GOOGLE_GENAI_API_KEY, NEXT_PUBLIC_FIREBASE_* in .env.local

# 4. Start local development server (runs on http://localhost:3000)
npm run dev

# 5. Execute TypeScript static validation (0 errors confirmed)
npx tsc --noEmit

# 6. Execute ESLint code checks
npm run lint

# 7. Build for production deployment
npm run build

# 8. Start production build
npm start

# 9. Seed Cloud Firestore with schemes database (optional)
node scripts/seed-firestore.mjs
```
