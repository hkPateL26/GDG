# NagrikSeva AI — Post-Fix Security Verification Report (READ-ONLY)

**Investigation Timestamp**: 2026-10-11T18:30:00+05:30  
**Target Application**: NagrikSeva AI (`nagrik-seva`)  
**Investigation Mode**: READ-ONLY Source Code Inspection, Dynamic Runtime Analysis, and Threat Verification  
**Evaluation Scope**: Post-Fix Verification of P0 Admin API Authorization Security Patch  

---

## Executive Summary

A comprehensive, evidence-based post-fix security verification of the NagrikSeva AI application was performed to validate the recent P0 Admin API authorization patch. 

The investigation confirmed that the primary P0 vulnerability—**the complete bypass of server-side authorization via body attributes (`pin: "GJ2026"`, `operatorId: "JSK-OP-8921"`, and caller-supplied role strings)**—has been **successfully eliminated**. All sensitive mutations on citizen applications (`PATCH /api/track`) now require a cryptographically signed HMAC-SHA256 session token, checked via either an `HttpOnly` cookie or `Authorization: Bearer <token>` header, and validated against server-side role-based access control (RBAC), 5-tier administrative jurisdictional boundaries, and state transition guards.

However, the deep runtime and architectural verification uncovered **two critical residual security and privacy weaknesses** that require clear documentation:
1. **Bearer Token Replay Post-Logout**: While logging out clears the browser's `HttpOnly` session cookie, the underlying session tokens are stateless JWTs without server-side revocation list tracking. A Bearer token intercepted or retained prior to logout **remains valid and capable of authorizing administrative mutations until its 8-hour expiry**.
2. **Public Tracking Unauthenticated Data Exposure & Predictable IDs**: The unauthenticated `GET /api/track?id=...` and `GET /api/track?page=...` endpoints expose citizen names, Aadhaar last-4 digits, precise village locations, welfare amounts, internal officer scrutiny remarks, and document verification scores. Furthermore, application IDs have a narrow, predictable pseudo-random range (`APP-GUJ-[5425..9925]`), allowing unauthenticated enumeration across synthetic citizen records.

The prototype is **SAFE for local demonstration using synthetic data**, but is **NOT production-ready for real citizen PII** until token revocation and public tracking data minimization are implemented.

---

## 1. Review of the Actual Patch and Codebase Verification

Every reported fix was inspected directly in the current codebase and verified via Git diff:

```text
git diff --stat
 src/app/api/auth/otp/route.ts           |  50 ++++++-
 src/app/api/track/route.ts              | 227 +++++++++++++++++++++++++++-----
 src/components/AdminHierarchyDesk.tsx   |  44 +++----
 src/components/TrackVaultView.tsx       |  15 +--
 src/components/UnifiedCitizenPortal.tsx |   6 +
 src/lib/large-datasets.ts               |  40 ++++++
 6 files changed, 316 insertions(+), 66 deletions(-)
```

### Verified Patch Artifacts:

1. **`src/lib/officer-auth.ts` (New Core Engine, 465 lines)**:
   - **Token Generation (`createOfficerSessionToken`)**: Generates HMAC-SHA256 tokens using claims (`officerId`, `role`, `tierLevel`, `district`, `taluka`, `panchayat`, `canApproveEsign`, `canVerifyPayment`) sourced directly from `HIERARCHICAL_OFFICERS`. Caller-supplied roles are completely ignored.
   - **Token Verification (`verifyOfficerSessionToken`)**: Enforces HMAC-SHA256 cryptographic verification using `crypto.timingSafeEqual` to prevent timing attacks, checks expiration timestamps, and validates officer registry presence.
   - **Jurisdictional Validation (`isOfficerJurisdictionValid`)**: Server-enforces the 5-tier Gujarat administrative hierarchy:
     - Tier 1 (`state_admin`): State-wide jurisdiction.
     - Tier 2 (`district_collector`): Rajkot district only.
     - Tier 3 (`sdm_prant`): Gondal Sub-Division (Gondal, Kotda Sangani, Lodhika).
     - Tier 4 (`mamlatdar`): Gondal taluka only.
     - Tier 5 (`talati`): Gomta Gram Panchayat only.
   - **Role Action Constraints (`canOfficerPerformAction`)**: Specifically blocks Stage 3 approvals if `canApproveEsign` is `false` (blocking Talati Mantri from e-Sign approval).
   - **State Transition Guard (`isWorkflowTransitionValid`)**: Disallows duplicate approvals on already approved applications and rejects invalid target stages.
   - **Fail-Safe Secret Resolution (`getOfficerAuthSecret`)**: In `NODE_ENV === "production"`, strictly enforces `OFFICER_AUTH_SECRET` (minimum 32 characters) and throws a fatal process error rather than running insecurely.

2. **`src/app/api/auth/otp/route.ts`**:
   - In `action === "verify_officer"`: Validates credentials and calls `createOfficerSessionToken`, setting the `nagrik_officer_token` cookie with `httpOnly: true`, `sameSite: "lax"`, and `secure` in production.
   - In `action === "logout_officer"`: Clears the cookie with `maxAge: 0`.
   - In `action === "get_officer_session"`: Returns active verified session.

3. **`src/app/api/track/route.ts`**:
   - In `PATCH`: Replaced all request body PIN (`GJ2026`) and operator (`JSK-OP-8921`) checks with `getOfficerSessionFromRequest(req)`. Unauthenticated requests immediately return `401 Unauthorized` (`code: "UNAUTHORIZED"`).
   - Enforces `isOfficerJurisdictionValid(officer, targetApp)` (returns `403 Forbidden`).
   - Enforces `canOfficerPerformAction(officer, action, targetStage)` (returns `403 Forbidden`).
   - Enforces `isWorkflowTransitionValid` (returns `400 Bad Request`).
   - Handles `action === "reject"` by persisting officer rejection remarks to database via `rejectApplication`.
   - In `GET`: Scopes officer work queues to their assigned jurisdiction if an officer session is present.

4. **Frontend Components Alignment**:
   - `AdminHierarchyDesk.tsx`: Stripped `pin: "GJ2026"`, `operatorId`, `officerId`, and `officerRole` from `handleVerifyPayment` and `handleApproveEsign`. Wired `handleSubmitRejection` to `PATCH /api/track` (`action: "reject"`).
   - `TrackVaultView.tsx`: Stripped hardcoded body attributes; wired `handleOfficerLogout` to invoke `POST /api/auth/otp` (`logout_officer`).
   - `UnifiedCitizenPortal.tsx`: Wired `handleOfficerLogout` to trigger `POST /api/auth/otp` (`logout_officer`).

---

## 2. Bearer Token and Logout Verification

### 2.1 Token Exposure to Client-Side JavaScript
- **API Response Body Exposure**: In `src/app/api/auth/otp/route.ts` (lines 66-70), the endpoint sets the `HttpOnly` cookie AND returns the token in the response JSON:
  ```ts
  const response = NextResponse.json({
    success: true,
    officer: res.officer,
    token, // <-- EXPOSED IN RESPONSE BODY
  });
  response.cookies.set(cookieConfig.name, token, cookieConfig);
  ```
- **Client Storage Inspection**:
  - `OfficerLoginShield.tsx` extracts `data.officer` and writes it to `sessionStorage` (`"nagrik_officer_session"` and `"nagrik_authenticated_officer"`). It **does not** explicitly write `data.token` to storage.
  - However, because `token` is included in the JSON payload, it is exposed in browser memory, network inspectors, and accessible to any third-party script or XSS payload executing on the page.

### 2.2 Token Invalidation and Logout Analysis
- **Cookie Invalidation**: When an officer logs out, `action: "logout_officer"` sets `nagrik_officer_token` cookie `maxAge: 0`. The browser drops the cookie.
- **Server Token State**: The session tokens are self-contained HMAC-SHA256 JWTs. The server maintains **no session state, database revocation table, or blocklist**.

### 2.3 Empirical Token Replay Test After Logout
A dedicated test was executed against the live Next.js server on port 3009:

```javascript
// Test Procedure:
// 1. Authenticate officer GUJ-GOV-9012 (Mamlatdar) -> receive cookie + Bearer token
// 2. Create test application in Gondal taluka (APP-GUJ-6258)
// 3. Officer logs out via POST /api/auth/otp { action: "logout_officer" } -> cookie cleared
// 4. Attempt mutation with cleared cookie -> 401 Unauthorized (PASSED)
// 5. Attempt mutation using retained Bearer token -> Authorization: Bearer <token>
```

**Observed Runtime Output**:
```text
Login success: true
Token returned in response body: true
Cookie set: true
Cookie HttpOnly: true
Created test app: APP-GUJ-6258
Logout response: true
Status without Bearer (cookie cleared): 401
Status with Bearer header AFTER logout (Token Replay): 200
Bearer after logout success: true
```

### 2.4 Token Verification Findings Summary
| Metric | Observed Property | Evaluation |
| :--- | :--- | :--- |
| **Token Format** | HMAC-SHA256 (3-part dot-delimited JWT) | Valid cryptographic design |
| **Signature Validation** | `crypto.timingSafeEqual` against server secret | Timing attack protected |
| **Token Expiry** | 8 Hours (`SESSION_TTL_SECONDS = 28800`) | Enforced on server |
| **Expired Token Rejection** | Tested with expired timestamp (-10s) | Rejected with `401 Unauthorized` |
| **Forged Signature Rejection** | Tested with tampered signature | Rejected with `401 Unauthorized` |
| **Cookie Flags** | `HttpOnly=true`, `SameSite=Lax`, `Path=/`, `Secure` in prod | Standard cookie protection |
| **Post-Logout Token Invalidation** | **No server-side blocklist** | **VULNERABLE**: Retained Bearer token authorized Stage 2 advance with HTTP 200 after logout |

---

## 3. Public Tracking and Privacy Review

### 3.1 Unauthenticated Endpoint Audit: `GET /api/track?id=...`
Tested using synthetic records (`APP001` and newly registered `APP-GUJ-9595`).

When any unauthenticated client queries `GET /api/track?id=<ID>`, the server returns:
```json
{
  "application": {
    "id": "APP001",
    "citizenName": "Hari Vinodrai Patel",
    "citizenNameGu": "હરી વિનોદરાઈ પટેલ",
    "gender": "male",
    "schemeId": "pm-kisan",
    "schemeName": "PM Kisan Samman Nidhi",
    "schemeNameGu": "PM કિસાન સન્માન નિધિ",
    "schemeEmoji": "🌾",
    "district": "Rajkot",
    "districtGu": "રાજકોટ",
    "taluka": "Rajkot Rural",
    "village": "આનંદપર (Anandpar)",
    "aadhaarLast4": "1413",
    "status": "approved",
    "appliedDate": "2026-08-14",
    "lastUpdated": "2026-09-01",
    "benefitAmount": 6000,
    "remarksGu": "૭/૧૨ અને ૮-અ જમીન ચકાસણી તાલુકા પંચાયત દ્વારા પૂર્ણ. હપ્તો જમા.",
    "remarksEn": "7/12 land records verified by Taluka Panchayat. Installment credited.",
    "officerDesignation": "Taluka Development Officer (TDO), Rajkot Rural",
    "workflowStage": 3,
    "txnId": "TXN-GUJ-806166",
    "documentsVerified": [
      { "name": "Aadhaar Card", "verified": true, "qualityScore": 95 }
    ]
  },
  "source": "enterprise-dataset",
  "success": true
}
```

### 3.2 Unauthenticated Bulk Listing Audit: `GET /api/track?page=1&limit=5`
When an unauthenticated caller requests `GET /api/track` without an `id` or officer session:
- **Observed Result**: Returns `200 OK` with full application arrays across all 5,420+ records in the system!
- **Evidence**: `GET /api/track?page=1&limit=5` returned `records.length: 5, total: 5422` with zero authentication required.

### 3.3 Predictability of Application IDs
- In `POST /api/track`:
  ```ts
  const randomSuffix = Math.floor(5425 + Math.random() * 4500);
  const id = `APP-GUJ-${randomSuffix}`;
  ```
- **Range**: `APP-GUJ-5425` to `APP-GUJ-9925` (~4,500 total discrete integers).
- **Benchmark IDs**: `APP001`, `APP002`, ..., `APP020`.
- **Predictability Risk**: Because the search space is only 4,500 IDs with sequential/predictable formatting, an automated script can enumerate and harvest the entire synthetic citizen dataset in less than 30 seconds.

### 3.4 Data Minimization Matrix for Public Citizen Self-Service Tracking

| Field Name | Currently Exposed? | Necessary for Citizen Self-Service? | Security & Privacy Recommendation |
| :--- | :---: | :---: | :--- |
| `id` | Yes | **Yes** | Keep (Primary tracking identifier) |
| `schemeName` / `schemeNameGu` | Yes | **Yes** | Keep (Citizen needs to confirm service) |
| `status` / `workflowStage` | Yes | **Yes** | Keep (Current stage progress) |
| `appliedDate` / `lastUpdated` | Yes | **Yes** | Keep (Timeline context) |
| `citizenName` | Yes | **Partial** | **Mask**: E.g. `H*** V. P****` to prevent identity scraping |
| `aadhaarLast4` | Yes | **No** | **Mask or Remove**: E.g. `XXXX-XXXX-1413` or require citizen OTP to view |
| `village`, `taluka`, `district` | Yes | **Partial** | Retain District/Taluka; mask village to protect home address |
| `benefitAmount` | Yes | **No** | **Remove**: Welfare grant amounts are confidential financial data |
| `remarksGu` / `remarksEn` | Yes | **Partial** | **Filter**: Return only public citizen notices; strip internal officer scrutiny notes |
| `officerDesignation` | Yes | **Yes** | Keep (Transparency regarding reviewing office) |
| `documentsVerified` | Yes | **No** | **Remove from public view**: Only expose document checklist status inside authenticated 2FA Vault |
| `txnId` / `challanNo` | Yes | **No** | **Remove**: Mask transaction identifiers to prevent receipt tampering |
| `citizenPhoto` | Stripped in query | **No** | **Keep blocked**: Never expose biometrics/photos on public URL |

### 3.5 Public Statistics Endpoint Audit: `GET /api/track?stats=true`
- **Observed Result**: Returns aggregate summary numbers:
  ```json
  { "total": 5422, "approved": 3845, "processing": 1122, "pending": 290, "rejected": 165, "disbursedCr": "₹ 14.85 Cr" }
  ```
- **Privacy Assessment**: **Clean and safe**. Contains zero citizen PII, zero officer identifiers, and zero geographic breakdown.

---

## 4. Validation of Original Authorization Fixes

A comprehensive test matrix was run against all security requirements:

| Security Property | Test Case | Observed Result | Status |
| :--- | :--- | :--- | :---: |
| **Unauthenticated Request Blocked** | `PATCH /api/track` without credentials | `401 Unauthorized` (`code: "UNAUTHORIZED"`) | **VERIFIED** |
| **Shared PIN Body Bypass Blocked** | `PATCH /api/track` with `pin: "GJ2026"` in JSON | `401 Unauthorized` (PIN in body ignored) | **VERIFIED** |
| **Operator ID Body Bypass Blocked** | `PATCH /api/track` with `operatorId: "JSK-OP-8921"` | `401 Unauthorized` (Operator ID in body ignored) | **VERIFIED** |
| **Forged Role String Blocked** | `PATCH /api/track` with `officerRole: "મામલતદાર"` | `401 Unauthorized` (Role string ignored) | **VERIFIED** |
| **Forged Officer ID Blocked** | `PATCH /api/track` with `officerId: "GUJ-GOV-9012"` | `401 Unauthorized` (ID string ignored) | **VERIFIED** |
| **Tampered Token Blocked** | `Authorization: Bearer <tampered-jwt>` | `401 Unauthorized` (HMAC mismatch) | **VERIFIED** |
| **Expired Token Blocked** | `Authorization: Bearer <expired-jwt>` | `401 Unauthorized` (Timestamp expired) | **VERIFIED** |
| **Role Constraint Enforced** | Talati Mantri attempts Stage 3 e-Sign | `403 Forbidden` (`code: "FORBIDDEN_ROLE"`) | **VERIFIED** |
| **Village Jurisdiction Enforced** | Talati Gomta attempts mutation on Ribda app | `403 Forbidden` (`code: "FORBIDDEN_JURISDICTION"`) | **VERIFIED** |
| **Taluka Jurisdiction Enforced** | Mamlatdar Gondal attempts mutation on Rajkot Rural app | `403 Forbidden` (`code: "FORBIDDEN_JURISDICTION"`) | **VERIFIED** |
| **District Jurisdiction Enforced** | Collector Rajkot attempts mutation on Surat app | `403 Forbidden` (`code: "FORBIDDEN_JURISDICTION"`) | **VERIFIED** |
| **Invalid Stage Transition Blocked** | Target stage 5 submitted | `400 Bad Request` | **VERIFIED** |
| **Duplicate Approval Blocked** | Submitting Stage 3 approval on approved record | `400 Bad Request` (`code: "INVALID_TRANSITION"`) | **VERIFIED** |
| **Valid Payment Confirmation** | Talati confirms cash payment on Gomta challan | `200 OK` (Payment status set to `paid`) | **VERIFIED** |
| **Valid Stage Advance** | Mamlatdar advances Gondal app to Stage 2 | `200 OK` (Stage updated, designation stamped) | **VERIFIED** |
| **Valid e-Sign Approval** | Mamlatdar approves Gondal app to Stage 3 | `200 OK` (Status set to `approved`) | **VERIFIED** |
| **Valid Rejection & Persistence** | Mamlatdar rejects with Gujarati explanation | `200 OK` (Status set to `rejected`, remarks saved) | **VERIFIED** |
| **Citizen Submission Preserved** | Citizen submits application via `POST /api/track` | `200 OK` (`APP-GUJ-...` generated) | **VERIFIED** |
| **Citizen Public Tracking Preserved**| Citizen tracks by ID via `GET /api/track?id=...` | `200 OK` (Record returned) | **VERIFIED** |
| **Public Statistics Preserved** | Citizen requests stats via `GET /api/track?stats=true`| `200 OK` (Aggregate metrics returned) | **VERIFIED** |

---

## 5. Test Evidence and Execution Log

### 5.1 Automated Security Test Execution
Executed the comprehensive test suite with Node.js built-in test runner:

**Command**:
```powershell
node --test test/*.test.mjs
```

**Output**:
```text
▶ Cryptographic Secret Key Safety Enforcement
  ✔ Fails safely in production when secret is missing or under 32 chars (2.4038ms)
  ✔ Constant-time comparison protects against HMAC timing attacks (1.2663ms)
✔ Cryptographic Secret Key Safety Enforcement (5.6786ms)
▶ P0 Admin API Authorization Security Tests
  ✔ Test 1: Unauthenticated attempt to advance workflow stage is rejected with 401 (207.2978ms)
  ✔ Test 2: Supplying shared PIN 'GJ2026' alone in request body is rejected with 401 (15.2527ms)
  ✔ Test 3: Supplying operatorId 'JSK-OP-8921' in request body is rejected with 401 (12.1913ms)
  ✔ Test 4: Forged officer ID or Gujarati role string in request body is rejected with 401 (8.6698ms)
  ✔ Test 5: Tampered / forged JWT token is rejected with 401 (13.6503ms)
  ✔ Test 6: Valid officer authentication issues HttpOnly cookie and Bearer token (13.1029ms)
  ✔ Test 7: Talati Mantri (Tier 5, canApproveEsign: false) CANNOT approve Stage 3 e-Sign (29.5353ms)
  ✔ Test 8: Talati Gomta CANNOT modify application outside Gomta village (58.2067ms)
  ✔ Test 9: Mamlatdar Gondal CANNOT modify application in Rajkot Rural taluka (27.9092ms)
  ✔ Test 10: Invalid target stage (e.g. stage 5) is rejected with 400 (27.362ms)
  ✔ Test 11: Re-approving an already approved application is rejected with 400 (31.4599ms)
  ✔ Test 12: Authorized Mamlatdar approving Gondal application succeeds with verified session (18.9601ms)
  ✔ Test 13: Authorized officer rejection succeeds and updates citizen timeline (18.0903ms)
  ✔ Test 14: Citizen can submit new application without authentication (6.4608ms)
  ✔ Test 15: Public tracking of an application ID succeeds without officer session (681.2096ms)
  ✔ Test 16: Public system statistics request succeeds without officer session (728.0642ms)
  ✔ Test 17: Officer logout clears session cookie; subsequent actions are rejected (43.3244ms)
  ✔ Test 18: Expired session token is rejected with 401 (16.0565ms)
  ✔ Test 19: Authorized Talati Mantri CAN confirm cash payment for Gomta village application (50.5447ms)
  ✔ Test 20: District Collector Rajkot CAN modify application in Rajkot Rural taluka (50.8754ms)
  ✔ Test 21: District Collector Rajkot CANNOT modify application in Surat district (42.6201ms)
✔ P0 Admin API Authorization Security Tests (2108.0334ms)

ℹ tests 23
ℹ suites 2
ℹ pass 23
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2452.5468
```

### 5.2 TypeScript Compilation and Production Build
**Command**:
```powershell
npm run build
```

**Output**:
```text
▲ Next.js 16.3.6 (Turbopack)
- Environments: .env.local
✓ Running next.config.ts took 125ms
  Creating an optimized production build ...
✓ Compiled successfully in 3.4s
  Running TypeScript ...
  Finished TypeScript in 14.9s ...
✓ Generating static pages using 7 workers (21/21) in 3.0s
  Finalizing page optimization ...
Route (app)
├ ƒ /api/auth/otp
├ ƒ /api/track
└ [21 routes compiled clean]
```

---

## 6. Remaining Vulnerabilities, Risks, and Recommendations

### 6.1 Confirmed Residual Vulnerabilities

1. **VULN-RES-01: Stateless Token Replay Window Post-Logout (Medium)**
   - *Description*: When an officer logs out, the client cookie is cleared, but previously issued tokens cannot be revoked on the server. If an attacker captures the Bearer token prior to logout, it can be replayed to execute authorized mutations until expiration (up to 8 hours).
   - *Remediation*: Implement a server-side token revocation blocklist in Redis or Firestore using the token signature/ID, checked during `verifyOfficerSessionToken`. Alternatively, do not return `token` in the response JSON body and rely exclusively on the `HttpOnly` cookie.

2. **VULN-RES-02: Public Application Data Exposure & Guessable IDs (Medium)**
   - *Description*: `GET /api/track?id=...` allows unauthenticated callers to view full citizen names, Aadhaar last-4, village addresses, and internal remarks. IDs are generated within a narrow 4,500 range (`APP-GUJ-[5425..9925]`). Furthermore, `GET /api/track?page=1` allows anonymous bulk pagination of all 5,420+ records.
   - *Remediation*:
     - Require citizen 2FA authentication (or matching mobile + OTP) to view sensitive application details.
     - Restrict unauthenticated `GET /api/track?id=...` to a minimized public view (status and stage only, masking names and locations).
     - Protect bulk pagination (`GET /api/track?page=...`) with mandatory officer authentication.
     - Switch ID generation to high-entropy UUIDs or cryptographically secure random codes (e.g. `APP-2026-X9K2-M7Q4`).

3. **VULN-RES-03: Hardcoded Demo Officer PIN `GJ2026` (Low / Prototype Context)**
   - *Description*: All 5 hierarchical officers share the demonstration PIN `GJ2026` in `verifyOfficerPin`.
   - *Remediation*: Before deploying beyond prototype/hackathon environments, replace static PIN matching with individual officer password hashes (Argon2id/bcrypt) or integration with the Gujarat State e-Pramaan Single Sign-On portal.

### 6.2 Potential Risks Not Confirmed / Out of Scope
- **Live Government API Integration**: External UIDAI, e-Dhara, and Cyber Treasury connections remain simulated stubs.
- **Biometric Scanner Hardware**: Thumbprint and iris verification are simulated via appointment scheduling.
- **Distributed Secret Rotation**: Key rotation across multi-region serverless clusters was not evaluated.

---

## 7. Demonstration Safety Recommendation

### Formal Verdict:
> **APPROVED FOR SYNTHETIC-DATA DEMONSTRATION ONLY**  
> **NOT APPROVED FOR PRODUCTION DEPLOYMENT WITH REAL CITIZEN DATA**

**Rationale**:
1. All critical P0 request-body authorization bypasses and forged officer ID exploits are **100% resolved and blocked by server enforcement**.
2. Demonstrating the 5-tier Gujarat administrative hierarchy (Secretariat, Collector, SDM, Mamlatdar, Talati) is functionally and architecturally secure: Talatis cannot approve Mamlatdar e-Signs, out-of-jurisdiction edits are blocked, and state transitions are strictly governed.
3. Because the current environment uses **only synthetic benchmark records** and no real citizen personal data exists in the ledger, the residual data exposure on public tracking poses **zero privacy harm during a demonstration**.
4. For any future production pilot handling real citizen PII, VULN-RES-01 (token revocation) and VULN-RES-02 (public tracking data minimization) must be implemented first.
