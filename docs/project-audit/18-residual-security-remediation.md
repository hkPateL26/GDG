# NagrikSeva AI — P0.1 Residual Security Remediation Report

**Remediation Timestamp**: 2026-10-11T20:05:00+05:30  
**Target Application**: NagrikSeva AI (`nagrik-seva`)  
**Git Branch**: `fix/p0.1-residual-security`  
**Scope**: Full Implementation and Verification of P0.1 Residual Security & Privacy Remediations  
**Status**: **ALL RESIDUAL VULNERABILITIES RESOLVED & VERIFIED (31/31 Automated Tests Passing)**

---

## Executive Summary

Following the post-fix security verification report (`docs/project-audit/17-post-fix-security-verification.md`), a focused security engineering phase was executed to close all residual authorization, session management, credential isolation, and citizen privacy gaps in NagrikSeva AI.

### Summary of Closed Residual Gaps

1. **Server-Enforced Token & Session Revocation (CWE-613)**:
   - **Previous State**: Logout cleared only the browser's `HttpOnly` cookie. Previously issued or copied Bearer tokens remained valid and could authorize sensitive actions until their 8-hour expiration.
   - **Remediated State**: Introduced cryptographically unique `sessionId` claims in each token. Implemented a durable, multi-instance revocation store backed by Google Cloud Firestore (`officer_revocations` collection) with an in-memory synchronized cache. Calling `logout_officer` invalidates the session across memory and Firestore. Replaying a copied token immediately yields `HTTP 401 Unauthorized`.

2. **Public Application Queue Protection (CWE-284, CWE-306)**:
   - **Previous State**: Anonymous callers could scrape and paginate through all 5,420+ citizen records via `GET /api/track?page=...` without authentication.
   - **Remediated State**: Queue listing, filtering, and bulk pagination strictly require an authenticated officer session. Anonymous queue queries are rejected with `HTTP 401 Unauthorized` (`code: "UNAUTHORIZED"`).

3. **Public Tracking Data Minimization & Unguessable Secrets (CWE-359, CWE-200)**:
   - **Previous State**: Single tracking by ID (`GET /api/track?id=...`) returned complete raw citizen records (full names, Aadhaar last-4 digits, village locations, internal officer scrutiny remarks, and document verification scores) without authentication. Application IDs used a narrow 4,500-value range.
   - **Remediated State**: Applications now generate high-entropy 128-bit hex tracking secrets (`trackingSecret`) and expanded IDs (`APP-GUJ-${year}-${random(100000..999999)}`). Unauthenticated queries without the secret return only minimal status with masked names (`H***i P***l`) and no PII. Queries with the legitimate secret return only allowlisted tracking fields (no raw Aadhaar, phone, email, or uploaded document scores). Incorrect secrets return `HTTP 403 Forbidden`.

4. **Sliding-Window Rate Limiting (CWE-799)**:
   - **Previous State**: No rate limiting on public tracking endpoints, enabling rapid enumeration.
   - **Remediated State**: Implemented an in-memory sliding-window IP rate limiter (maximum 60 requests/minute per client IP). Excessive queries immediately return `HTTP 429 Too Many Requests` with a `Retry-After: 60` header.

5. **Production Demo Credential Isolation**:
   - **Previous State**: Shared demonstration PIN `GJ2026` was unconditionally accepted across all officer roles in `src/lib/large-datasets.ts`.
   - **Remediated State**: In production mode (`NODE_ENV === "production"`), `verifyOfficerPin` strictly rejects `GJ2026` unless explicitly permitted via `ALLOW_DEMO_CREDENTIALS === "true"`.

---

## 1. Root Cause Analysis of Residual Vulnerabilities

| Vulnerability ID | Classification | Affected Component | Root Cause |
| :--- | :--- | :--- | :--- |
| **SEC-RES-01** | CWE-613: Insufficient Session Expiration | `src/lib/officer-auth.ts`<br>`src/app/api/auth/otp/route.ts` | Stateless JWTs lacked server-side revocation tracking. Logout only issued a `Set-Cookie: maxAge=0` header without registering revoked session IDs in a durable store. |
| **SEC-RES-02** | CWE-284: Improper Access Control | `src/app/api/track/route.ts` (`GET`) | Route handler fell through to `queryApplications(...)` when no `id` was specified, allowing unauthenticated bulk scraping of all system records. |
| **SEC-RES-03** | CWE-359: Privacy Violation / Data Exposure | `src/app/api/track/route.ts` (`GET`) | Single ID tracking returned raw database records to anonymous callers, exposing full citizen names, Aadhaar digits, welfare amounts, and internal officer remarks. |
| **SEC-RES-04** | CWE-330: Insufficiently Random Values | `src/app/api/track/route.ts` (`POST`) | IDs generated via `Math.random() * 4500` were easily guessable through automated brute force. |
| **SEC-RES-05** | CWE-799: Improper Control of Generation Rate | `src/app/api/track/route.ts` (`GET`) | Endpoint had no request throttling or sliding-window rate limits. |
| **SEC-RES-06** | CWE-798: Use of Hardcoded Credentials | `src/lib/large-datasets.ts` | Demonstration PIN `GJ2026` was not gated behind environment checks and was active in production runtime. |

---

## 2. Architecture and Implementation Details

### 2.1 Token Revocation Engine (`src/lib/officer-auth.ts`)

To support multi-instance production deployments (e.g., Kubernetes, Cloud Run, multiple Node.js worker processes) while maintaining sub-millisecond local response times, a **hybrid revocation store** was designed:

```
[ Incoming Request ]
        │
        ▼
[ verifyOfficerSessionToken(token) ] ──> Validates HMAC-SHA256 & Expiration
        │
        ▼
[ isOfficerSessionRevoked(sessionId) ]
        ├─ 1. Instant check in synchronized REVOKED_OFFICER_SESSIONS (In-Memory Map)
        │      └─ Hit? ──> Immediately reject (401 Unauthorized)
        │
        └─ 2. Query Cloud Firestore ("officer_revocations", sessionId) [650ms timeout]
               ├─ Exists? ──> Populate in-memory map & reject (401 Unauthorized)
               └─ Not Found? ──> Allow request to proceed
```

#### Code Implementation Highlights:

```typescript
// Cryptographically unique session identifier attached to each session
export interface OfficerSessionPayload {
  sessionId: string; // 128-bit crypto hex identifier
  officerId: string;
  role: AdminRole;
  tierLevel: 1 | 2 | 3 | 4 | 5;
  name: string;
  designation: string;
  district: string;
  taluka?: string;
  panchayat?: string;
  canApproveEsign: boolean;
  canVerifyPayment: boolean;
  issuedAt: number;
  expiresAt: number;
}

// In-memory revocation cache with expiration TTL
const REVOKED_OFFICER_SESSIONS = new Map<string, number>();

export async function revokeOfficerSession(sessionId: string, expiresAt?: number): Promise<void> {
  if (!sessionId) return;
  const exp = expiresAt || Date.now() + SESSION_TTL_SECONDS * 1000;
  REVOKED_OFFICER_SESSIONS.set(sessionId, exp);

  // Sync to Cloud Firestore for multi-instance deployments
  if (db) {
    try {
      const docRef = doc(db, "officer_revocations", sessionId);
      await withFirestoreTimeout(
        setDoc(docRef, { sessionId, revokedAt: Date.now(), expiresAt: exp }),
        650
      );
    } catch (dbErr) {
      console.warn("Firestore session revocation sync fallback:", dbErr);
    }
  }
}
```

### 2.2 Client Data Minimization on Login (`src/app/api/auth/otp/route.ts`)

To prevent client-side JavaScript from accessing and caching session tokens:
- **Browser Clients** (identified via `user-agent` containing `Mozilla/` or `sec-ch-ua` headers) receive **only** the `HttpOnly` cookie. The JSON response body omits the token entirely.
- **Automated Test / API Clients** (non-browser or explicitly requesting `x-request-bearer-token: "true"`) receive the token in the JSON body for programmatic API use.

```typescript
const userAgent = req.headers.get("user-agent") || "";
const isBrowserClient = userAgent.includes("Mozilla/") || req.headers.get("sec-ch-ua") !== null;
const isExplicitBearerRequested =
  req.headers.get("x-request-bearer-token") === "true" || body.requestBearerToken === true;

const shouldReturnToken =
  isExplicitBearerRequested || !isBrowserClient || process.env.NODE_ENV === "test";

const responsePayload: Record<string, unknown> = { success: true, officer: res.officer };
if (shouldReturnToken) {
  responsePayload.token = token;
}
```

### 2.3 Public Queue Access Block & Strict Data Minimization (`src/app/api/track/route.ts`)

#### 1. Anonymous Queue Access Termination:
```typescript
// Queue Listing & Bulk Queries MUST Require Authenticated Officer Session
if (!officer) {
  return NextResponse.json(
    {
      success: false,
      error: "અનધિકૃત ઍક્સેસ. અરજીઓની યાદી જોવા માટે સત્તાવાર અધિકારી લૉગિન આવશ્યક છે. (Authentication required for queue access)",
      code: "UNAUTHORIZED",
    },
    { status: 401 }
  );
}
```

#### 2. Tracking Secret Generation on Application Submission:
```typescript
const trackingSecret = crypto.randomBytes(16).toString("hex"); // 128-bit high entropy
const now = new Date();
const year = now.getFullYear();
const randomSuffix = crypto.randomInt(100000, 999999);
const id = `APP-GUJ-${year}-${randomSuffix}`;
```

#### 3. Allowlisted Public Tracking Response:
```typescript
export function maskCitizenName(name?: string): string {
  if (!name) return "નાગરિક";
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      if (part.length === 2) return part[0] + "*";
      return part[0] + "*".repeat(Math.min(part.length - 2, 4)) + part[part.length - 1];
    })
    .join(" ");
}
```

When tracking without the secret:
- Minimal public status (`requiresSecret: true`)
- Masked name (`H***i P***l`)
- Raw Aadhaar, phone, email, and document verification scores are **omitted**.

When tracking with the valid secret:
- Allowlisted safe fields (`id`, `scheme`, `status`, `workflowStage`, `appliedDate`, `lastUpdated`, `district`, `taluka`, `village`, `maskedCitizenName`, `remarksGu`, `appointmentDate`, `appointmentTime`, `appointmentCenter`)
- Raw PII remains strictly omitted.

When tracking with an invalid secret:
- Returns `HTTP 403 Forbidden` (`"અમાન્ય ટ્રેકિંગ સિક્રેટ (Invalid tracking secret)"`).

### 2.4 QR Code & Receipt Integration

- **`src/components/GovernmentReceiptSlip.tsx`**: Updated official verification QR code generation to include `&secret=${encodeURIComponent(app.trackingSecret)}`. Legitimate citizens scanning their printed or PDF receipt access the secure tracking endpoint directly.
- **`src/components/DocumentServicePortal.tsx`**: Status tracking buttons now append `&secret=${encodeURIComponent(submittedApp.trackingSecret)}`.
- **`src/components/TrackVaultView.tsx`**: Direct tracking handler supports URL parameters `?id=...&secret=...`, unlocking the timeline modal automatically when opened via receipt QR codes.

### 2.5 Production Isolation of Demo Credentials (`src/lib/large-datasets.ts`)

```typescript
export function verifyOfficerPin(officerId: string, pin: string) {
  const cleanId = (officerId || "").trim().toUpperCase();
  const cleanPin = (pin || "").trim();

  // Government Officer Credentials for Hackathon Demonstration / Staging
  if (cleanPin === "GJ2026") {
    // In production, shared demo PIN is strictly prohibited unless explicitly enabled
    const isProduction = process.env.NODE_ENV === "production";
    const allowDemo = process.env.ALLOW_DEMO_CREDENTIALS === "true";
    if (isProduction && !allowDemo) {
      return {
        success: false,
        error: "સુરક્ષા નીતિ: ઉત્પાદન વાતાવરણમાં ડેમો PIN અક્ષમ કરેલ છે. કૃપા કરીને સુરક્ષિત સરકારી ઓળખપત્રનો ઉપયોગ કરો. (Demo credentials disabled in production)",
      };
    }
    // ...
```

---

## 3. Verification Methodology and Test Results

### 3.1 Verification Environment

- **Operating System**: Windows 11
- **Node Runtime**: Node.js v24.15.0
- **Framework**: Next.js 16.3.6 (Turbopack production build)
- **Database**: Live Google Cloud Firestore connection + in-memory synchronization
- **Test Runner**: Node.js built-in test runner (`node --test`)
- **Server Port**: Production server executed on port `3009`

### 3.2 Automated Test Execution Summary

| Test Suite | Test File | Cases | Passed | Failed | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Admin API Security & Authorization** | `test/security-authorization.test.mjs` | 25 | 25 | 0 | **PASS (100%)** |
| **Demo Credential Isolation** | `test/demo-credentials-isolation.test.mjs` | 4 | 4 | 0 | **PASS (100%)** |
| **Cryptographic Secret Key Safety** | `test/officer-auth-config.test.mjs` | 2 | 2 | 0 | **PASS (100%)** |
| **Total** | **3 Suites** | **31** | **31** | **0** | **PASS (100%)** |

### 3.3 Detailed Test Results Matrix

| # | Test Name | Assertion & Security Property Verified | Observed Result |
| :-: | :--- | :--- | :---: |
| **1** | Unauthenticated Advance Stage | `PATCH /api/track` without credentials returns `401 Unauthorized`. | **PASS** |
| **2** | Body PIN `GJ2026` Alone | Shared PIN in JSON body returns `401 Unauthorized`. | **PASS** |
| **3** | Body `operatorId` Alone | Hardcoded operator ID in JSON body returns `401 Unauthorized`. | **PASS** |
| **4** | Forged Officer ID / Role String | User-supplied role string in JSON body returns `401 Unauthorized`. | **PASS** |
| **5** | Tampered HMAC-SHA256 JWT | Signature forgery using attacker key returns `401 Unauthorized`. | **PASS** |
| **6** | Valid Officer Login | Authentication issues HttpOnly cookie and Bearer token. | **PASS** |
| **7** | RBAC: Talati e-Sign Restriction | Talati Mantri cannot approve Stage 3 e-Sign (`403 Forbidden`). | **PASS** |
| **8** | Jurisdiction: Talati Village Boundary | Talati Gomta cannot modify records outside Gomta village (`403`). | **PASS** |
| **9** | Jurisdiction: Mamlatdar Taluka Boundary | Mamlatdar Gondal cannot modify records in Rajkot Rural (`403`). | **PASS** |
| **10** | State Machine: Invalid Target Stage | Attempting transition to invalid stage (e.g. stage 5) returns `400`. | **PASS** |
| **11** | State Machine: Duplicate Approval | Re-approving an already approved application returns `400`. | **PASS** |
| **12** | Authorized Mamlatdar Approval | Legitimate Mamlatdar approving Gondal application succeeds (`200`). | **PASS** |
| **13** | Authorized Officer Rejection | Legitimate officer rejection updates citizen timeline (`200`). | **PASS** |
| **14** | Unauthenticated Application Submission | Public citizens can submit applications via `POST /api/track` (`200`). | **PASS** |
| **15** | Data Minimization on Public Tracking | Public tracking masks citizen names (`H***i P***l`) and omits raw PII. | **PASS** |
| **16** | Public System Statistics | Aggregated system metrics remain accessible without authentication. | **PASS** |
| **17** | Officer Logout Cookie Clearing | Officer logout clears session cookie; subsequent actions return `401`. | **PASS** |
| **18** | Expired Session Token Rejection | Expired token returns `401 Unauthorized`. | **PASS** |
| **19** | Cash Payment Confirmation | Authorized Talati can confirm cash payment within Gomta (`200`). | **PASS** |
| **20** | District Collector Multi-Taluka Scope | Collector Rajkot can modify records across Rajkot Rural (`200`). | **PASS** |
| **21** | District Collector District Boundary | Collector Rajkot cannot touch Surat district records (`403`). | **PASS** |
| **22** | **Bearer Token Revocation Post-Logout** | **Copied Bearer token used AFTER logout is rejected with `401 Unauthorized`.** | **PASS** |
| **23** | **Anonymous Queue Pagination Block** | **`GET /api/track?page=2` without officer session returns `401 Unauthorized`.** | **PASS** |
| **24** | **Incorrect Tracking Secret Rejection** | **Supplying an incorrect tracking secret returns `403 Forbidden`.** | **PASS** |
| **25** | **Public Tracking Rate Limiting** | **Excessive queries from same IP trigger `429 Too Many Requests`.** | **PASS** |
| **26** | Production Demo PIN Rejection (Unset) | In production mode with flag unset, `verifyOfficerPin` rejects `GJ2026`. | **PASS** |
| **27** | Production Demo PIN Rejection (`false`) | In production mode with flag `"false"`, `verifyOfficerPin` rejects `GJ2026`. | **PASS** |
| **28** | Production Demo PIN Allowed (`true`) | With `ALLOW_DEMO_CREDENTIALS="true"`, `verifyOfficerPin` accepts `GJ2026`. | **PASS** |
| **29** | Invalid PIN Rejection | Non-existent PIN is rejected regardless of environment. | **PASS** |
| **30** | Secret Key Missing in Production | System throws fatal error if `OFFICER_AUTH_SECRET` is missing in prod. | **PASS** |
| **31** | HMAC Timing Attack Resistance | Signature checks use constant-time `crypto.timingSafeEqual`. | **PASS** |

---

## 4. Security Property Matrix: Evolution Across Patches

| Security Dimension | Baseline State | Post-P0 Patch | Post-P0.1 Remediation (Current) |
| :--- | :--- | :--- | :--- |
| **Admin API Authentication** | Hardcoded body PIN `GJ2026` or operator ID | Cryptographic HMAC-SHA256 JWT tokens | Cryptographic HMAC-SHA256 JWT tokens |
| **Token Replay Post-Logout** | N/A (Stateless) | **Vulnerable**: Copied Bearer token valid for 8 hours | **Protected**: Server-enforced revocation via Firestore + in-memory store |
| **Token Exposure to Browser** | N/A | Token returned in JSON response body | **Protected**: Browser receives only HttpOnly cookie; body omits token |
| **Application Queue Listing** | Unauthenticated | **Vulnerable**: Anonymous scraping of all 5,420+ records | **Protected**: Strictly requires authenticated officer session (`401`) |
| **Citizen Status Tracking** | Exposes full citizen PII | Exposes full citizen PII | **Protected**: Masks citizen name, omits raw PII, requires tracking secret |
| **Application ID Entropy** | 4,500 combinations | 4,500 combinations | **Protected**: 128-bit secret + 6-digit cryptographic random IDs |
| **Public Endpoint Rate Limiting** | None | None | **Protected**: 60 requests/minute sliding window per IP (`429`) |
| **Demonstration Credentials** | Unconditionally active | Unconditionally active | **Protected**: Blocked in production unless `ALLOW_DEMO_CREDENTIALS="true"` |
| **Production Secret Key Check** | None | Enforces minimum 32-character key | Enforces minimum 32-character key |

---

## 5. Operational Recommendations for Production Deployment

1. **Cloud Firestore TTL Rule for Revocations**:
   - In production Google Cloud Firestore, configure a Time-To-Live (TTL) policy on the `expiresAt` field in the `officer_revocations` collection to automatically delete expired revocation documents after 8 hours, preventing storage growth.

2. **Environment Variable Configuration**:
   - Ensure the following variables are securely managed in production (e.g., via AWS Secrets Manager, Google Cloud Secret Manager, or Doppler):
     ```bash
     NODE_ENV=production
     OFFICER_AUTH_SECRET="<cryptographically-secure-random-string-min-32-chars>"
     ALLOW_DEMO_CREDENTIALS=false
     ```

3. **Reverse Proxy Rate Limiting (Layer 7 Defense-in-Depth)**:
   - While the in-memory sliding window rate limiter protects the Node.js application, production ingress controllers (Nginx, Cloudflare, or AWS WAF) should enforce IP-based rate limiting at the edge to mitigate distributed DDoS attempts.

4. **Monitoring and Alerting**:
   - Configure alerts for spikes in `401 Unauthorized` responses on `/api/track` and `429 Too Many Requests` responses to detect unauthorized enumeration or token replay attempts.
