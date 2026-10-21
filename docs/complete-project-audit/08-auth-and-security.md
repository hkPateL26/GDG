# 08 — AUTHENTICATION, AUTHORIZATION & SECURITY CONTROLS
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** Cryptographic Security, Officer RBAC, Privacy Guardrails, and Isolation Standards  
**Compliance Standards:** Digital Personal Data Protection Act (DPDP 2023) & NeGD IT Security Guidelines

---

## 1. Authentication Architecture Overview

NagrikSeva AI enforces strict architectural separation between citizen access and administrative officer functions:
- **Citizen Authentication:** Low-friction, privacy-preserving 2FA (Mobile OTP + Aadhaar Last-4 Binding). No citizen passwords or biometrics are ever stored.
- **Officer Authentication:** Multi-factor credential verification (Employee ID + Cryptographic PIN) yielding a stateless, cryptographically signed HMAC-SHA256 session token stored in an HTTP-only cookie.

```
+----------------------------------------------------------------------------------------------------+
|                                    DUAL AUTHENTICATION PATHWAYS                                    |
+-------------------------------------------------+--------------------------------------------------+
|              CITIZEN AUTHENTICATION             |              OFFICER AUTHENTICATION              |
|                                                 |                                                  |
|  - 10-Digit Mobile Number                       |  - Official Gujarat Employee ID (e.g. GUJ-GOV-9012)
|  - Aadhaar Last 4 Digits (DPDP Compliant)       |  - Administrative Security PIN                   |
|  - 6-Digit Time-Bound OTP                       |  - Production Demo Gate Guard Check              |
|                     │                           |                     │                            |
|                     ▼                           |                     ▼                            |
|        [Citizen Benefit Profile]                |        [HMAC-SHA256 Signed Session Token]         |
|        - Session stored in localStorage         |        - HttpOnly, Secure, SameSite=Strict       |
|        - Scoped to family Kutumb ledger         |        - Scoped by 5-Tier Territorial RBAC       |
+-------------------------------------------------+--------------------------------------------------+
```

---

## 2. 5-Tier Officer Role-Based Access Control (RBAC)

The administrative model (`src/lib/admin-hierarchy-data.ts` & `src/lib/officer-auth.ts`) enforces strict territorial and functional scoping across five governance tiers:

| Tier | Role Key | Official Cadre & Post | Territorial Jurisdiction | Scrutiny Scope | e-Sign Issuance | Dynamic Policy CMS |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | `state_admin` | Chief Secretary / Principal Secretary (IAS) | Statewide (All 33 Districts) | All Gujarat Applications | Yes | Yes (Full CMS & Policy) |
| **Tier 2** | `collector` | District Collector & DM (IAS) | Single District (e.g., Rajkot) | District Applications | Yes | Yes (District CMS) |
| **Tier 3** | `prant_officer`| Sub-Divisional Magistrate / SDM (GAS) | Sub-Division (e.g., Gondal Prant) | Prant Applications / Appeals | Yes | No |
| **Tier 4** | `mamlatdar` | Taluka Mamlatdar & Exec. Magistrate (GAS)| Single Taluka (e.g., Gondal) | Taluka Applications | Yes | No |
| **Tier 5** | `talati` | Talati cum Mantri (Panchayat Service) | Village Panchayat (e.g., Gomta) | Village Applications | No (Panchayat Inquiry Only)| No |

### Functional Permissions Enforcement:
Each officer token encapsulates explicit boolean permission flags:
- `canApproveEsign`: Required to execute the `approve` state transition and stamp certificates with an official SHA-256 hash. (Granted to Tiers 1–4; Denied to Tier 5 Talatis).
- `canVerifyPayment`: Required to confirm physical cash challans deposited at Jan Seva Kendras.
- `canModifyPolicy`: Required to access the CMS tab to modify welfare schemes, office details, and notices. (Granted to Tiers 1 & 2; Denied to Tiers 3–5).
- `canViewAllDistricts`: Granted exclusively to Tier 1 State Admins.

---

## 3. Cryptographic Officer Session Engine

Implemented in `src/lib/officer-auth.ts`, session tokens are generated and validated without database roundtrips:

### 3.1 Token Structure
```
[Base64-Encoded JSON Payload] . [HMAC-SHA256 Signature (64 Hex Characters)]
```
- **Payload Contents:**
  ```json
  {
    "sessionId": "a7b8c9d0-1234-5678-9abc-def012345678",
    "officerId": "GUJ-GOV-9012",
    "role": "mamlatdar",
    "tierLevel": 4,
    "name": "એચ. વી. પટેલ, GAS",
    "district": "Rajkot",
    "taluka": "Gondal",
    "canApproveEsign": true,
    "canModifyPolicy": false,
    "issuedAt": 1728987123456,
    "expiresAt": 1729015923456
  }
  ```

### 3.2 Secret Resolution & Key Hardening (`getOfficerAuthSecret`)
- **Production Standard:** Requires `OFFICER_AUTH_SECRET` or `AUTH_SECRET` environment variables with a minimum entropy length of **32 characters**.
- **Cryptographic Signing Algorithm:**
  $$\text{Signature} = \text{HMAC-SHA256}\left(\text{Payload}_{\text{Base64}}, \text{Secret}\right)$$
- **Cookie Security Attributes:**
  - Name: `nagrik_officer_token`
  - `HttpOnly`: True (Inaccessible to malicious JavaScript / XSS)
  - `Secure`: True in production (HTTPS-only transmission)
  - `SameSite`: `Strict` (Complete mitigation of Cross-Site Request Forgery / CSRF)
  - `Path`: `/`
  - `Max-Age`: `28800` seconds (Strict 8-hour session lifetime)

---

## 4. Data Minimization & Privacy Guardrails (DPDP Act 2023)

1. **Aadhaar Masking Standard:**
   In compliance with UIDAI regulations and the DPDP Act 2023, the platform **never stores or logs 12-digit Aadhaar numbers**. Across all database entities, in-memory models, and API responses, only the last 4 digits (`aadhaarLast4`) are persisted, formatted visually as `XXXX-XXXX-4921`.
2. **Citizen Tracking Secret Defense:**
   To prevent unauthenticated scrapers or unauthorized individuals from enumerating citizen applications via sequential IDs (e.g., querying `APP001`, `APP002`), the `/api/track` endpoint enforces a dual-key requirement:
   $$\text{Authorized Query} = \text{Application ID} + \text{Private Tracking Secret (e.g., SEC-4921-GJ)}$$
   Requests lacking the matching secret return HTTP 403 Forbidden.
3. **Data Minimization on Public APIs:**
   When citizen applications are returned via public tracking routes, all sensitive internal officer remarks, verification timestamps, and background fraud risk scores are automatically stripped before serialization.

---

## 5. Production Demo Credential Isolation

To prevent development credentials from leaking into production, `src/lib/large-datasets.ts` implements a deterministic isolation check:
- **Shared Demo PIN (`GJ2026`) Gate:**
  ```typescript
  export function isDemoCredentialsAllowed(): boolean {
    if (process.env.NODE_ENV !== "production") return true;
    return process.env.ALLOW_DEMO_CREDENTIALS === "true";
  }
  ```
- In production environments where `ALLOW_DEMO_CREDENTIALS` is not explicitly set to `"true"`, any attempt to authenticate using the demo PIN `GJ2026` is rejected with:
  *"ઉત્પાદન વાતાવરણમાં ડેમો PIN અક્ષમ છે. સત્તાવાર બાયોમેટ્રિક અથવા OTP પ્રમાણીકરણ જરૂરી છે."*

---

## 6. Denial-of-Service & Input Hardening

1. **Sliding-Window IP Rate Limiter:**
   - Public APIs (`/api/verify-doc`, `/api/chat`): Capped at 60 requests per minute per IP.
   - OTP Generation (`/api/auth/otp`): Capped at 5 OTP requests per 10 minutes per mobile/IP to prevent SMS gateway flooding.
2. **Strict Server-Side Input Sanitization:**
   - All string inputs (citizen names, IDs, taluka names) are sanitized against regex injection and length-limited (maximum 128 characters).
   - Document verification payloads are limited to 10MB base64 buffers to prevent memory exhaustion attacks.
3. **HTTP Response Security Headers (`next.config.ts`):**
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   Referrer-Policy: strict-origin-when-cross-origin
   ```
