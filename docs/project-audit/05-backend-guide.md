# 05 — Backend Architecture & Application Logic

---

## 1. Backend Runtime & Bootstrap Model

NagrikSeva AI operates on Next.js 16 Route Handlers executed in Node.js / Vercel Serverless Function environments:
- **Server Entry Point:** Next.js HTTP server routing incoming requests via the App Router convention (`src/app/api/**/route.ts`).
- **Execution Lifecycle:** Stateless serverless invocations with cold-start mitigation through global in-memory singletons and L1 memory caches.
- **Environment Variables:** Loaded securely at runtime from `.env.local` or Vercel Secret Management:
  - `GOOGLE_GENAI_API_KEY`: Used for Gemini 1.5 Pro and Flash vision models.
  - `NEXT_PUBLIC_FIREBASE_*`: Public project identifiers for Firebase Client SDK.
  - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`: Private service account credentials for Firebase Admin SDK.

---

## 2. API Route Structure & Responsibilities

The backend comprises 11 dedicated API routes:

```
src/app/api/
├── auth/
│   └── otp/route.ts            → POST: 2FA OTP, Citizen Profile, Officer Verification
├── chat/
│   ├── route.ts                → POST: Multi-Model Gemini AI Chat, Location Injection, Act Citations
│   └── history/route.ts        → GET, POST, DELETE: Chat Session Management & Isolation
├── location/
│   └── resolve/route.ts        → POST: Reverse Geocoding & Spatial Revenue Office Lookup
├── schemes/
│   ├── route.ts                → GET: Filtered Scheme Directory & Firestore Cache
│   └── [id]/route.ts           → GET: Single Scheme Detail Lookup
├── system-health/route.ts       → GET: Operational Telemetry Beacon & Version Checker
├── track/route.ts               → GET, POST, PATCH: Application Management, Payments, SLA
├── tts/route.ts                 → GET, POST: Audio Stream Generation via Chunked Google TTS
├── verify-doc/route.ts          → POST: Strict Multimodal Document Verification
└── version/route.ts             → GET: Live Build Hash & File Mtime Check
```

---

## 3. Detailed Subsystem Implementation

### 3.1 Authentication & Profile Engine (`/api/auth/otp/route.ts`)
Dispatches operations based on the `action` field in the JSON request body:
1. `action: "send_otp"`: Validates 10-digit mobile and 4-digit Aadhaar. Invokes `requestCitizenOtp()` from `large-datasets.ts`, returning a 6-digit verification code.
2. `action: "verify_otp"`: Matches entered OTP against the issued code. Returns the complete `CitizenLedgerProfile` (name, address, active applications, eligible schemes).
3. `action: "get_citizen_profile"`: Returns the stored citizen profile and benefit history without re-issuing an OTP for active sessions.
4. `action: "verify_officer"`: Validates `officerId` and `pin` against `HIERARCHICAL_OFFICERS` in `admin-hierarchy-data.ts`, returning officer permissions and jurisdiction.

### 3.2 Conversational AI & Streaming Router (`/api/chat/route.ts`)
Orchestrates conversations with rich civic domain intelligence:
- **Location Context Injection:** Injects live citizen location (`Village`, `Taluka`, `District`) into the system prompt:
  `[LIVE CITIZEN LOCATION: Village/City: Gomta, Taluka: Gondal, District: Rajkot]`.
- **Statutory Law Citations:** Instructs Gemini to cite governing laws (NFSA 2013, GRTSA 2013, PM-KISAN, PM-JAY).
- **Multi-Model Fallback Race:** Dispatches to `gemini-flash-lite-latest`, `gemini-3.5-flash-lite`, and `gemini-3.7-flash` with a 15-second timeout.
- **Deterministic Local Fallback:** If cloud APIs encounter rate limits, falls back to `getLocalFallbackReply()`, which performs regex matching for schemes, application tracking, and documents.

### 3.3 Strict Document Pre-Scrutiny Engine (`/api/verify-doc/route.ts`)
Implements strict administrative document validation:
- Cleans base64 headers (`data:image/jpeg;base64,...`).
- Prepares prompt with `EXPECTED DOCUMENT REQUIREMENT FOR THIS SLOT: "${expectedDocType}"`.
- Uses low temperature (`0.1`) for deterministic outputs.
- Extracts JSON containing `qualityScore`, `isValidForGovt`, `matchesExpected`, `actionableAdviceGu`, and `verificationPoints[]`.
- Enforces code-level double safeguard: If `matchesExpected === false`, forces `isValidForGovt = false` and caps `qualityScore` to `15`.

### 3.4 Application Tracking & Payment Processing (`/api/track/route.ts`)
Manages the application lifecycle across 3 HTTP methods:
- **`GET /api/track`:** Supports searching by ID (`APP-GUJ-XXXX`), filtering by district, taluka, village, and status, with pagination and system metrics. Pre-syncs recent Firestore entries with a `650ms` timeout.
- **`POST /api/track`:** Creates a new application.
  1. Assigns unique application ID (`APP-GUJ-XXXX`) and challan number (`GRN-2026-XXXXX`).
  2. Sets initial stage to Stage 1 (*Submission*) or Stage 2 (*Scrutiny*).
  3. Writes immediately to in-memory `addCustomApplication()`.
  4. Dispatches background `setDoc()` to Firestore with stripped large photos.
  5. Returns SMS and Email receipt notifications.
- **`PATCH /api/track`:** Handles stage advancement and operator cash fee payment:
  1. `action: "advance_stage"`: Moves workflow to next stage, updating officer designation and remarks.
  2. `action: "confirm_cash_payment"`: Sets `paymentStatus: "paid"`, `operatorConfirmed: true`.

### 3.5 Text-to-Speech Streaming Engine (`/api/tts/route.ts`)
Converts long Gujarati, Hindi, and English responses into speech:
- Strips markdown formatting, links, URLs, and emojis (`[\u{1F300}-\u{1F9FF}]`).
- Splits text into sentence chunks (maximum 160 characters per chunk).
- Fetches audio chunks concurrently from Google TTS (`translate.google.com/translate_tts?tl=gu&q=...`).
- Concatenates audio buffers using `Buffer.concat()` and streams back as `audio/mpeg` with `Cache-Control: public, max-age=86400`.

### 3.6 Spatial Geo-Resolver (`/api/location/resolve/route.ts`)
Resolves citizen coordinates (`lat`, `lng`) to Gujarat administrative units:
- Queries OpenStreetMap Nominatim reverse geocoding with a `3000ms` timeout.
- Filters out generic administrative terms (`તાલુકા`, `ગ્રામ્ય`, `district`).
- Matches against `resolveLocationFromCoordinates()` in `location-resolver.ts` using Haversine distance calculations across all taluka headquarters.
- Returns nearest Jan Seva Kendra, road distance in kilometers, and coordinates.

---

## 4. Error Handling, Timeouts & Graceful Degradation

Every backend endpoint incorporates deterministic fallbacks to guarantee uninterrupted service:

| Endpoint | Primary Failure Mode | Timeout Limit | Fallback Behavior |
| :--- | :--- | :--- | :--- |
| `/api/chat` | Gemini 429 Quota / 503 Overload | `15,000ms` | Returns local statutory rule engine reply with Act citations |
| `/api/verify-doc` | Vision API Rate Limit / Network | `10,000ms` | Filename heuristic evaluation + structured fallback report |
| `/api/track` (POST) | Firestore gRPC Network Hang | `3,000ms` (Client) | Writes to in-memory ledger + client localStorage sync |
| `/api/track` (GET) | Firestore Query Slowdown | `650ms` (Server) | Serves query from cached in-memory 5,420 record dataset |
| `/api/schemes` | Firestore Connection Loss | `30,000ms` (L1 Cache) | Serves 26 schemes from bundled `schemes-data.ts` |
| `/api/location/resolve`| OSM Nominatim Timeout | `3,000ms` | Local Haversine lookup against Gujarat revenue centers |
| `/api/tts` | Google TTS Chunk Failure | `5,000ms` | Client Web Speech API (`window.speechSynthesis`) fallback |
