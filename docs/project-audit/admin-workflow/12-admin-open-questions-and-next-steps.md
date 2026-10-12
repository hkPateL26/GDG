# NagrikSeva AI — Admin & Officer Side Deep Investigation
## Document 12: Open Questions, Technical Debt & Next Steps

> **Audit Date:** October 2026  
> **Target Scope:** Production Readiness Gaps, Architectural Tradeoffs, High-Priority Fixes, and Migration Roadmap.  

---

### 1. Key Architectural Questions & Unresolved Decisions

#### Question 1: Server-Side RBAC Enforcement vs. Client Route Guards
- **Current State:** The client (`AdminHierarchyDesk.tsx`) strictly locks filters and prevents unauthorized supervisory switching based on `authenticatedOfficer.tierLevel`. However, `/api/track` (PATCH) checks only the shared PIN `GJ2026` or ID prefix `GUJ`.
- **Architectural Question:** Should NagrikSeva AI implement NextAuth.js (Auth.js v5) with Gujarat State Data Centre (SDC) LDAP/OAuth2, or should it use stateless RS256 JWT tokens with embedded claims `{ sub: officerId, role: roleKey, tier: tierLevel, taluka: talukaName }`?
- **Recommendation:** Implement stateless RS256 JWT cookies verified by a Next.js middleware function at `src/middleware.ts`.

#### Question 2: Cryptographic e-Sign Architecture
- **Current State:** Approvals render a visual green seal and QR code in the browser DOM. No cryptographically signed PDF file is produced or stored.
- **Architectural Question:** Which licensed Certifying Authority (CA) or eSign Service Provider (ESP) should be integrated?
- **Recommendation:** Integrate with **CDAC e-Hastakshar** (National e-Sign Service) or **eMudhra eSign API**. Upon Mamlatdar approval, the backend should submit the PDF hash to the ESP and receive a signed PKCS#7 CMS token embedded directly into an archival PDF/A document.

#### Question 3: Long-Term Persistence Strategy
- **Current State:** Relies on an in-memory cache of 5,420+ synthetic records, an optional Cloud Firestore collection with a 650ms timeout race, and client `localStorage` for citizen-created applications.
- **Architectural Question:** When scaling to millions of Gujarati citizens, how should tenancy and jurisdictional scoping be partitioned?
- **Recommendation:** Deploy a managed **PostgreSQL** database (via Supabase or AWS RDS) with Row-Level Security (RLS) policies scoped by district and taluka.

---

### 2. High-Priority Technical Debt

1. **Shared Demo Credentials:**
   - *Risk:* All 5 officer presets share PIN `GJ2026`.
   - *Fix:* Remove hardcoded PIN validation from production builds; enforce individual hashed passwords and 2FA OTP for each government officer.
2. **Local Storage Dependency for Newly Created Applications:**
   - *Risk:* Applications submitted on one device only appear in that specific browser's administrative queue unless successfully synced to Firestore.
   - *Fix:* Ensure `POST /api/track` writes synchronously to a persistent database before returning a success response to the client.
3. **Hardcoded OCR Scores in Review Modal:**
   - *Risk:* Static sample document previews display fixed confidence scores (94%–98%).
   - *Fix:* Wire `DocumentServicePortal` uploads to the existing Google Cloud Vision / Tesseract API endpoint (`/api/verify-doc`) and pass dynamic OCR scores into the application record.

---

### 3. Step-by-Step Production Roadmap

```
PHASE 1: AUTHENTICATION HARDENING (Weeks 1–2)
├── Implement Next.js Auth Middleware (src/middleware.ts)
├── Replace sessionStorage with HttpOnly Secure Cookies
└── Restrict /api/track mutations to verified JWT officer claims

PHASE 2: DATABASE MIGRATION (Weeks 3–4)
├── Deploy PostgreSQL with Prisma ORM
├── Migrate 5,420 benchmark records to indexed relational tables
└── Establish application_audit_logs with SHA-256 chain sealing

PHASE 3: TRUE e-SIGN & OCR PIPELINE (Weeks 5–6)
├── Integrate eMudhra / CDAC ESP eSign API
├── Generate cryptographically signed PAdES PDF/A documents
└── Connect Google Cloud Vision API for live document OCR scoring

PHASE 4: STATE GOVERNANCE INTERFACES (Weeks 7–8)
├── Interface with Cyber Treasury Gujarat (IFMS) Payment Gateway
├── Connect CDAC Mobile Seva (MSDG) SMS Gateway for citizen alerts
└── Establish PFMS / NPCI APB integration for live DBT disbursements
```
