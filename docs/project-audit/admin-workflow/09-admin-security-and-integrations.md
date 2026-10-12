# NagrikSeva AI — Admin & Officer Side Deep Investigation
## Document 09: Security, Authentication & Government Integration Reality

> **Audit Date:** October 2026  
> **Target Scope:** Threat Modeling, Credential Handling, Session Storage Vulnerability, Server Authorization Gaps, and Government API Integration Reality.  
> **Source Files Audited:** `src/app/api/auth/otp/route.ts`, `src/app/api/track/route.ts`, `src/components/OfficerLoginShield.tsx`, `src/lib/large-datasets.ts`.  

---

### 1. Security Architecture & Threat Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ADMIN SECURITY AUDIT ASSESSMENT                       │
├────────────────────────────────┬──────────────────────┬─────────────────────┤
│ Security Dimension             │ Current Status       │ Production Risk     │
├────────────────────────────────┼──────────────────────┼─────────────────────┤
│ Officer Authentication         │ Hardcoded PIN GJ2026 │ 🔴 High (Demo Only) │
│ Session Storage                │ Browser sessionStorage│ 🟡 Medium (XSS Risk)│
│ Server Authorization           │ PIN & Prefix Check   │ 🔴 High (No Claims) │
│ Rate Limiting on Login         │ Not Implemented      │ 🟡 Medium (Brute)   │
│ Audit Trail Immutability       │ In-Place Record Edit │ 🟡 Medium (No Hash) │
│ PII Protection (Aadhaar/Phone) │ Masked Display XXXX  │ 🟢 Good Design      │
│ Document Size DOS Guard        │ > 120KB Base64 Strip │ 🟢 Good Protection  │
└────────────────────────────────┴──────────────────────┴─────────────────────┘
```

---

### 2. Deep Dive: Authentication & Credential Storage

#### How Officer Credentials Work
In [`src/lib/large-datasets.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/large-datasets.ts#L5308-L5410):
```typescript
export function verifyOfficerPin(officerId: string, pin: string) {
  const cleanId = (officerId || "").trim().toUpperCase();
  const cleanPin = (pin || "").trim();

  if (cleanPin === "GJ2026") {
    if (cleanId === "GUJ-STATE-001") return { success: true, officer: ... };
    if (cleanId === "GUJ-COL-3001")  return { success: true, officer: ... };
    if (cleanId === "GUJ-SDM-5002")  return { success: true, officer: ... };
    if (cleanId === "GUJ-TAL-7089")  return { success: true, officer: ... };
    return { success: true, officer: ... }; // Default: Taluka Mamlatdar
  }
  return { success: false, error: "..." };
}
```

#### Vulnerability Analysis
1. **Static Shared PIN:** All 5 administrative tiers authenticate using the same static string `GJ2026`.
2. **Client-Side Session Storage:** Upon successful response, the officer profile is stored in plain JSON in `sessionStorage.getItem("nagrik_officer_session")`.
3. **No Signature or Expiry:** The session object carries no cryptographic HMAC signature, issuance timestamp, or expiration token. Any script executing in the page context can modify `sessionStorage`.

---

### 3. Server Authorization Reality in Route Handlers

In [`src/app/api/track/route.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/track/route.ts#L397-L407):
```typescript
const isOfficerAuthorized =
  (officerId && (String(officerId).toUpperCase().startsWith("GUJ") || pin === "GJ2026")) ||
  operatorId === "JSK-OP-8921" ||
  (body.officerRole && String(body.officerRole).includes("મામલતદાર")) ||
  (body.officerName && String(body.officerName).includes("મામલતદાર"));

if (!isOfficerAuthorized) {
  return NextResponse.json(
    { error: "અનધિકૃત ઍક્સેસ! સત્તાવાર અધિકારી લૉગિન જરૂરી છે.", success: false },
    { status: 401 }
  );
}
```

#### Findings
- The server does not maintain an active session table or verify a session cookie.
- If an HTTP request provides `pin: "GJ2026"` in the JSON body, the server treats the request as fully authorized regardless of whether the user actually logged in.
- The server does not check whether the calling officer ID actually possesses jurisdiction over the specific taluka of the application being modified.

---

### 4. Government External Integration Reality Check

| External Agency / System | Displayed in Prototype UI | Real Integration Status | What Production Integration Entails |
| :--- | :--- | :--- | :--- |
| **Digital Gujarat Portal** | Single Sign-On / Revenue Services | **Simulated / Offline** | SAML 2.0 / OAuth2 OpenID Connect with State Data Centre (SDC) |
| **UIDAI (Aadhaar e-KYC)** | 2FA Aadhaar Verification & e-Aadhaar | **Simulated / Offline** | Authorized KUA / ASA license with Aadhaar Auth API 2.5 XML over HTTPS |
| **Licensed ESP (e-Sign)** | Digital Seal & Mamlatdar Signature | **Simulated / Offline** | eMudhra / CDAC / NSDL API with PKCS#7 signed PDF output |
| **Cyber Treasury Gujarat** | Fee receipt & transaction ID | **Simulated / Offline** | IFMS Cyber Treasury payment gateway with merchant hash validation |
| **PFMS / NPCI DBT** | Availed benefit ledger & 2FA link | **Simulated / Offline** | Secure SFTP / API tunnel with Public Financial Management System |
| **NIC / CDAC SMS Gateway** | Mobile delivery alert notifications | **Simulated / Offline** | CDAC Mobile Seva (MSDG) SMPP / HTTPS transactional push API |

---

### 5. Production Hardening Roadmap

To elevate the application from demonstration-grade to government compliance:
1. **Migrate to JWT Auth with HttpOnly Cookies:** Issue a signed RS256 JWT cookie (`__Host-nagrik-auth`) upon PIN validation.
2. **Server-Side RBAC Middleware:** Inspect the JWT on every API request. Ensure `officer.district === app.district` and `officer.taluka === app.taluka`.
3. **Database-Backed Credentials:** Store officer records in PostgreSQL with Argon2id password hashes and enforce Multi-Factor Authentication (MFA) via SMS OTP or hardware FIDO2 tokens.
