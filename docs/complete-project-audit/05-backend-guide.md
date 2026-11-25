# 05 — BACKEND ARCHITECTURE & APPLICATION LOGIC GUIDE
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** Serverless & Edge API Architecture, Service Logic, Timeout Defenses, and Concurrency  
**Runtime:** Node.js 20+ / Next.js 16.3.6 App Router Route Handlers

---

## 1. Backend Execution Model

NagrikSeva AI operates on a modern **Serverless Micro-API Architecture** embedded directly within the Next.js App Router (`src/app/api/*`). Rather than maintaining an idle monolithic express/nest server, every endpoint operates as an independent, auto-scaling serverless route handler executing in isolated Node.js worker threads.

### 1.1 Architectural Highlights
- **Zero Cold-Start Degradation:** Core datasets (57 schemes, 33 districts, 250+ talukas, 18,225 villages) are loaded in-memory at process bootstrap, guaranteeing sub-millisecond query execution without waiting for external database handshakes.
- **Circuit-Breaker Firestore Timeouts (`firestoreTimeout`):** All cloud database queries are wrapped in strict 650ms – 1500ms timeout races. If Google Cloud experiences regional packet drop or API rate limiting, the request gracefully falls back to memory caches instead of stalling the client.
- **Enterprise L1/L2 Caching Pipeline (`src/lib/redis-cache.ts`):** High-frequency reads are handled by an in-memory LRU cache (capacity: 5,000 items, TTL: 300s) coupled with an optional Upstash Redis cluster.
- **Stateless HMAC-SHA256 Security:** Officer authentication uses cryptographically signed session tokens (`nagrik_officer_token`) verified statelessly on every administrative request.

---

## 2. API Route Directory & Responsibilities

The backend exposes **15 dedicated API routes**:

```
src/app/api/
├── auth/otp/route.ts          # Aadhaar 2FA OTP generation and verification
├── chat/route.ts              # Gemini 2.5 Flash streaming conversational response
├── chat/history/route.ts      # Cloud Firestore chat log retrieval and persistence
├── digilocker/route.ts        # DigiLocker & MeriPehchaan OAuth & URI document fetching
├── geo/villages/route.ts      # Cascading Gujarat 18,225 revenue village resolution
├── location/resolve/route.ts  # Haversine distance resolver mapping GPS to kacheris
├── notices/route.ts           # Dynamic government circulars, notices & CMS engine
├── offices/route.ts           # Gujarat administrative office directory & search
├── schemes/route.ts           # 57 Welfare schemes search, category filter & pagination
├── schemes/[id]/route.ts      # Deep scheme specification and document rules resolver
├── system-health/route.ts     # Real-time telemetry for Redis, Firestore & Gemini AI
├── track/route.ts             # Application status tracking & officer decisioning
├── tts/route.ts               # Google Cloud Text-to-Speech Gujarati voice synthesis
├── verify-doc/route.ts        # Gemini 2.5 Flash multimodal vision OCR & pre-scrutiny
└── version/route.ts           # Dynamic build hash, commit SHA & release telemetry
```

---

## 3. Core Service Layer Deconstruction

### 3.1 Authentication & Session Service (`/api/auth/otp` & `officer-auth.ts`)
- **Citizen Authentication:** Generates 6-digit one-time passwords for mobile/Aadhaar logins. Supports sandbox demo credentials (`123456`) when `isDemoCredentialsAllowed()` is true, and enforces sliding-window rate limits (max 5 OTP requests per 10 minutes per IP).
- **Officer Session Engine:** Operates via `src/lib/officer-auth.ts`:
  - Enforces minimum 32-character secret (`OFFICER_AUTH_SECRET` or `AUTH_SECRET`).
  - Generates tamper-proof tokens formatted as: `base64(payload).hex(hmac_sha256_signature)`.
  - Encapsulates officer designation, tier level (1 to 5), district, taluka, and granular permissions (`canApproveEsign`, `canModifyPolicy`, `canViewAllDistricts`).
  - Sets HTTP-only, secure, `SameSite=Strict` cookies with an 8-hour Time-to-Live.

### 3.2 Multimodal Document Verification Engine (`/api/verify-doc`)
- **Technology:** Google Gemini 2.5 Flash Generative AI (`@google/generative-ai`).
- **Processing Pipeline:**
  1. Accepts base64 encoded document image or PDF alongside applicant identity metadata (`citizenName`, `fatherHusbandName`, `documentType`).
  2. Executes structured prompt requesting deterministic JSON output:
     - Document legibility and blur detection (score 0–100).
     - Official emblem identification (Ashok Stambh or Gujarat State seal).
     - OCR extracted text and detected language (Gujarati / English).
     - Name match verification (phonetic and exact cross-referencing).
     - Suspicious alteration or tampering flags.
  3. Maps results to a structured `VerificationResult` containing a confidence score, approval recommendation, and audit summary.

### 3.3 Application Lifecycle & Scrutiny Engine (`/api/track`)
- **Dual Citizen/Officer Endpoint:**
  - **`GET /api/track?id=...&secret=...`:** Allows citizens to retrieve application status, certificate links, and officer remarks. Requires the correct `trackingSecret` to prevent unauthorized probing. Strips sensitive internal officer notes.
  - **`GET /api/track` (Officer Mode):** Verifies the officer's HMAC session cookie, resolves their territorial jurisdiction, and returns matching applications.
  - **`POST /api/track`:** Allows authorized officers to execute state transitions (`approved`, `rejected`, `processing`), attach rejection reasons, or stamp the application with an official cryptographic e-Sign hash.

### 3.4 Geographic Resolution Engine (`/api/geo/villages` & `/api/location/resolve`)
- **Village Engine (`/api/geo/villages`):** Queries `src/lib/gujarat-geo-engine.ts` containing 18,225 villages across Gujarat's 250+ talukas. Implements prefix and substring fuzzy matching, caching query responses in L1 memory.
- **Location Engine (`/api/location/resolve`):** Computes geodesic distances using the Haversine formula:
  $$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
  Identifies the closest Jan Seva Kendra or Taluka Seva Sadan within seconds.

### 3.5 Dynamic CMS & Circulars Engine (`/api/notices`, `/api/schemes`, `/api/offices`)
- **Dynamic Content Management:** Allows administrators to add, modify, or archive schemes, kacheri offices, and government circulars without touching source code.
- **Cache Invalidation:** Any mutation immediately purges the affected cache key in `redisCache`, ensuring updates reflect across the state within milliseconds.

### 3.6 Conversational AI & Multilingual Voice Service (`/api/chat` & `/api/tts`)
- **Streaming AI Chat (`/api/chat`):** Streams Gemini responses chunk-by-chunk using a `ReadableStream`, minimizing time-to-first-token (TTFT) for citizens on 4G networks.
- **Voice Synthesis (`/api/tts`):** Connects to Google Cloud Text-to-Speech API, generating authentic Gujarati audio (`gu-IN-Standard-A` / `gu-IN-Wavenet-B`) delivered as high-compression MP3 streams.

---

## 4. Middleware, Guards & Security Enforcement

```
INCOMING API REQUEST
    │
    ▼
[Next.js Security Headers] (X-Frame-Options: DENY, nosniff, strict-origin)
    │
    ▼
[Rate Limiting Guard] (Sliding-window IP check: 60 req/min for public, 5 req/10m for OTP)
    │
    ▼
[Officer Session Authenticator] (Verifies HMAC-SHA256 signature on cookie)
    │
    ├─► If Invalid: Return HTTP 401 Unauthorized
    │
    ▼
[Territorial RBAC Scope Guard]
    │
    ├─► Tier 1 (State): Statewide access granted
    ├─► Tier 2 (District): Restricted to request.officer.district
    ├─► Tier 4 (Taluka): Restricted to request.officer.taluka
    └─► Tier 5 (Village): Restricted to request.officer.panchayat
    │
    ▼
[Data Minimization Filter] (Masks full Aadhaar, strips internal secrets)
    │
    ▼
[Controller / Service Execution]
```

---

## 5. Storage Resiliency & Concurrency Management

To guarantee high availability across heterogeneous network conditions, backend data operations implement a **Circuit-Breaker Timeout Race**:

```typescript
// Typical Firestore Resiliency Pattern in NagrikSeva API Routes
export async function getOfficesData() {
  const cached = await redisCache.get("kacheri_offices_master");
  if (cached) return cached;

  try {
    // 1200ms timeout race to prevent serverless hang
    const firestorePromise = getDocs(collection(db, "offices"));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firestore timeout")), 1200)
    );

    const snapshot = await Promise.race([firestorePromise, timeoutPromise]);
    // Process and populate Redis cache...
  } catch (err) {
    console.warn("Falling back to static in-memory master office data:", err);
    return STATIC_OFFICES_DATA; // Instant zero-downtime recovery
  }
}
```

---

## 6. Standardized Response Format

Every API endpoint adheres to a standardized JSON envelope:

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2026-10-15T10:45:00.000Z"
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Statutory SLA expired or application not found within jurisdiction",
  "code": "RESOURCE_NOT_FOUND",
  "timestamp": "2026-10-15T10:45:00.000Z"
}
```
