# 02 — SYSTEM ARCHITECTURE & DESIGN PATTERNS
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** System Architecture, Data Flow, Layering, and Resiliency Patterns  
**Reference Architecture:** India Stack 2.0 & National Digital Public Infrastructure (DPI)

---

## 1. High-Level Architectural Philosophy

NagrikSeva AI is architected in alignment with the **Open Digital Public Infrastructure (DPI)** design principles pioneered by the Government of India and the Government of Gujarat:
1. **Zero-Queue Paperless Citizen Access:** Eliminates physical paperwork by pairing citizen-consented DigiLocker pulls with automated multimodal vision AI pre-scrutiny.
2. **Deterministic Time-Bound Governance:** Enforces statutory turnaround deadlines under the **Gujarat Right to Services Act (GRTSA 2013)** via proactive algorithmic countdowns and automatic hierarchical escalations.
3. **Resilient Hybrid-Edge Data Storage:** Designed to maintain sub-second operational uptime even in low-bandwidth rural Taluka/Panchayat environments by combining L1 in-memory edge caching, Upstash Redis clusters, Google Cloud Firestore, and client-side offline vaults.
4. **Strict Territorial Role-Based Access Control (RBAC):** Restricts field officer access strictly to applications originating within their assigned administrative boundaries (District, Taluka, or Village Panchayat).

---

## 2. End-to-End System Architecture

```
                                  CITIZEN OR OFFICER CLIENTS
               +---------------------------------------------------------------+
               |                     Browser / Mobile PWA                      |
               +-------------------------------+-------------------------------+
                                               |
                                               v
                                 NEXT.JS 16 APP ROUTER
               +---------------------------------------------------------------+
               |                    Edge Routing & SSR/CSR                     |
               |  - Security Headers (nosniff, DENY, strict-origin)            |
               |  - Dynamic Route Handlers (/api/*)                            |
               |  - Page Renderers (/schemes, /documents, /admin, etc.)        |
               +-------------------------------+-------------------------------+
                                               |
        +--------------------------------------+--------------------------------------+
        |                                                                             |
        v                                                                             v
CITIZEN SUPER-APP LAYER                                                     OFFICER HIERARCHY DESK LAYER
+-----------------------------------+                                       +-----------------------------------+
| - UnifiedCitizenPortal            |                                       | - AdminHierarchyDesk (5-Tier)     |
| - DocumentServicePortal (12 Svcs) |                                       | - Scrutiny Queue & SLA Watchdog   |
| - DigiLockerGatewayModal (Rule 9A)|                                       | - AdminPortalCmsManager (4 Tabs)  |
| - Kutumb Family Ledger            |                                       | - SecretariatApexBiDashboard (IAS)|
| - Multilingual ChatBot (Gemini)   |                                       | - Official Certificate e-Sign     |
+-----------------+-----------------+                                       +-----------------+-----------------+
                  |                                                                           |
                  +-----------------------------------+---------------------------------------+
                                                      |
                                                      v
                                        CORE API & DOMAIN LAYER
               +-------------------------------------------------------------------------------+
               | - /api/auth/otp         - /api/verify-doc      - /api/track                   |
               | - /api/digilocker       - /api/schemes         - /api/offices                 |
               | - /api/chat             - /api/geo/villages    - /api/notices                 |
               +--------------------------------------+----------------------------------------+
                                                      |
                  +-----------------------------------+-----------------------------------+
                  |                                                                       |
                  v                                                                       v
     RESILIENT CACHING & STORAGE LAYER                                           EXTERNAL CLOUD SERVICES
+-------------------------------------------+                             +-----------------------------------+
| 1. L1 Edge LRU Memory Cache (5000 max)    |                             | 1. Google Gemini 2.5 Flash API    |
| 2. Upstash Redis Distributed Cache        |                             | 2. Google Cloud Firestore         |
| 3. Pre-Seeded Datasets (5,420 records)    |                             | 3. MeriPehchaan / DigiLocker      |
| 4. Client Offline LocalStorage Vault      |                             | 4. Google Cloud Text-to-Speech    |
+-------------------------------------------+                             +-----------------------------------+
```

---

## 3. Layered Architectural Decomposition

### 3.1 Presentation & Client Layer (UI/UX)
- **Framework:** Next.js 16 App Router with React 19 Client (`"use client"`) and Server Components.
- **Responsive PWA:** Mobile-first responsive architecture designed to look and feel like a native Android app (status bar integration, sticky bottom navigation `MobileBottomNav.tsx`, haptic vibration via `navigator.vibrate`, and standalone PWA manifest `/manifest.json`).
- **Bilingual Context Provider:** `LanguageProvider` (`src/context/LanguageContext.tsx`) manages dynamic translation between authentic Gujarati (`gu`) and English (`en`), supplemented by `GoogleTranslateScript.tsx` for 14 additional Indian languages.

### 3.2 Application & Business Logic Layer
- **Citizen Service Engine:** `DocumentServicePortal.tsx` (3,709 lines) encapsulates wizard forms for 12 statutory revenue services, coordinating file attachments, family member selection, fee calculation, and receipt generation.
- **Officer Administrative Workbench:** `AdminHierarchyDesk.tsx` (2,101 lines) provides a 4-tab workbench:
  1. `queue`: Real-time application scrutiny, verification of attached proofs, and e-Sign certificate issuance.
  2. `sla`: GRTSA 2013 statutory delay tracker with visual warning badges and taluka escalation meters.
  3. `policy`: Dynamic CMS for managing schemes, offices, policies, and circulars.
  4. `sachivalay_bi`: High-level BI analytics for the Chief Secretary / State Admin.
- **Kutumb Family Ledger:** `family-ledger.ts` maintains a unified family registry allowing a single head of household to manage documents and entitlements for all dependents.

### 3.3 Domain Services & Algorithmic Engines
- **Cascading Geographic Resolver:** `gujarat-geo-engine.ts` provides a relational indexing model across Gujarat's 33 districts, 250+ talukas, and 18,225 villages, supporting instantaneous fuzzy search without network latency.
- **Predictive Machine Learning Engine:** `historical-ml-engine.ts` analyzes 6 months of historical disposal trends (October 2025 – March 2026), executing linear regression forecasting ($R^2 = 0.941$) to identify potential SLA breach risks by scheme and taluka.
- **Geographic Distance Engine:** `location-resolver.ts` uses the Haversine formula to compute geodesic distances between citizen coordinates and the 11 major Gujarat revenue hubs.

### 3.4 Data Access & Resiliency Layer
To prevent database connection stalls from impacting user experience, the system utilizes a **Hybrid Multi-Tier Storage Architecture**:
1. **Tier 1 (L1 In-Memory LRU Cache):** Memory-resident map storing up to 5,000 entries with automatic LRU eviction and 5-minute TTL (`src/lib/redis-cache.ts`). Delivers `<0.8ms` response times.
2. **Tier 2 (Upstash Redis L2 Cluster):** Distributed cloud cache activated when `REDIS_URL` or `UPSTASH_REDIS_REST_URL` is configured.
3. **Tier 3 (Google Cloud Firestore):** Cloud database storing live application records (`applications`), notices (`public_notices`), and officer modifications.
4. **Tier 4 (Static Pre-Seeded Datasets):** 5,420 verified historical revenue records in `large-datasets.ts` and 57 welfare schemes in `schemes-data.ts`.
5. **Tier 5 (Client LocalStorage Vault):** Local browser storage preserving submitted citizen applications, family ledgers, and CMS notices offline.

```
STORAGE READ FALLBACK PIPELINE:
Client / API Call
    │
    ▼
[L1 Edge LRU Cache] ──(Hit: <0.8ms)──► Return Data
    │ (Miss)
    ▼
[Upstash Redis L2] ───(Hit: ~15ms)───► Populate L1 & Return
    │ (Miss / Unconfigured)
    ▼
[Firestore Query] ────(Success: ~200ms)──► Populate L1 & Return
    │ (Timeout > 1.2s or Network Error)
    ▼
[Fallback Master Dataset / LocalStorage] ──► Return Seed Data
```

---

## 4. 5-Tier Officer Administrative Hierarchy Model

The administrative layer (`src/lib/admin-hierarchy-data.ts`) strictly mirrors the Government of Gujarat's Revenue & Panchayats Department hierarchy:

```
+-----------------------------------------------------------------------------------+
| TIER 1: STATE LEVEL                                                               |
| Chief Secretary / Principal Secretary (IAS) — Sachivalaya, Gandhinagar            |
| Scope: State-wide (All 33 Districts, All 250+ Talukas, All 18,225 Villages)       |
| Permissions: Full Scrutiny, Policy CMS, Secretariat BI, State Overdue Escalations|
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| TIER 2: DISTRICT LEVEL                                                            |
| District Collector & District Magistrate (IAS) — Collectorate                     |
| Scope: Single District (e.g., Rajkot District — All 11 Talukas)                   |
| Permissions: District Queue Scrutiny, District SLA Monitoring, District CMS       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| TIER 3: SUB-DIVISIONAL LEVEL                                                      |
| Sub-Divisional Magistrate (SDM) / Prant Officer (GAS) — Prant Kacheri             |
| Scope: Sub-Division (e.g., Gondal Prant: Gondal, Kotda Sangani, Lodhika)          |
| Permissions: Sub-Divisional Queue, First Appellate Authority under GRTSA 2013      |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| TIER 4: TALUKA LEVEL                                                              |
| Taluka Mamlatdar & Executive Magistrate (GAS) — Taluka Seva Sadan                 |
| Scope: Single Taluka (e.g., Gondal Taluka — All Villages)                         |
| Permissions: Statutory Certificate Issuance, e-Sign Stamp, Revenue Scrutiny       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| TIER 5: VILLAGE PANCHAYAT LEVEL                                                   |
| Talati cum Mantri — Gram Panchayat Kacheri / e-Gram Kendra                        |
| Scope: Single Village Panchayat (e.g., Gomta Gram Panchayat)                      |
| Permissions: Primary Field Inquiry, Domicile Verification, Panchayat Endorsement |
+-----------------------------------------------------------------------------------+
```

### Territorial Jurisdiction Enforcement:
Every officer object possesses strict geographic properties:
- `tierLevel`: Integer from 1 (State) down to 5 (Village).
- `district` / `districtGu`: Scopes the officer to a specific revenue district.
- `taluka` / `talukaGu`: Scopes the officer to a specific taluka (null for State and District collectors).
- `panchayat` / `panchayatGu`: Scopes the officer to an individual village (Tier 5 only).

In `AdminHierarchyDesk.tsx`, the queue query filters applications deterministically:
```typescript
// Example: Tier 4 Mamlatdar can only view applications matching their Taluka
if (currentOfficer.tierLevel === 4) {
  filtered = filtered.filter(app => app.taluka.toLowerCase() === currentOfficer.taluka.toLowerCase());
}
// Example: Tier 5 Talati can only view applications matching their Village
if (currentOfficer.tierLevel === 5) {
  filtered = filtered.filter(app => cleanVillageOnly(app.village) === cleanVillageOnly(currentOfficer.panchayat));
}
```

---

## 5. Multimodal Vision AI Pipeline (`/api/verify-doc`)

The document verification engine (`src/app/api/verify-doc/route.ts`) replaces subjective human checks with a rigorous, deterministic AI pre-audit powered by **Google Gemini 2.5 Flash**:

```
CITIZEN UPLOADS DOCUMENT (Image / PDF)
    │
    ▼
[Base64 Encoding & Payload Construction]
    │
    ▼
[Gemini 2.5 Flash Multimodal Vision Inspection]
    │
    ├─► 1. Document Legibility & Blur Score (0 - 100)
    ├─► 2. Official Emblem / Watermark Detection (Ashok Stambh, Gujarat Crest)
    ├─► 3. Bilingual OCR Extraction (English & Gujarati Script)
    ├─► 4. Cross-Verification of Applicant Name & Father/Husband Name
    └─► 5. Tampering / Digital Alteration Heuristic Analysis
    │
    ▼
[Structured JSON Output Generation]
    │
    ▼
[Document Approval Verdict & Confidence Rating]
    ├── Confidence >= 80%: Pre-Approved (Fast-Track Routing)
    ├── Confidence 50-79%: Flagged for Physical Scrutiny
    └── Confidence < 50%: Rejected at Submission (Missing / Illegible)
```

---

## 6. Resilience & Fault Tolerance Patterns

1. **Non-Blocking Firestore Timeout Race (`firestoreTimeout`):**
   Calls to Google Cloud Firestore in API routes are wrapped in a `Promise.race` with a 1.2 – 1.5 second rejection timer. If Google Cloud experiences transient latency or quota throttling, the route automatically defaults to the in-memory master dataset, preventing HTTP 504 Gateway Timeouts.
2. **Global Singleton Cache Preservation:**
   In `src/lib/redis-cache.ts`, the `EnterpriseRedisCache` instance is anchored to `globalThis.__NAGRIK_REDIS_CACHE__`. During Next.js hot-module reloading in development, cached records and hit/miss telemetry survive without reset.
3. **PWA Offline Service Worker:**
   `public/sw.js` and `src/components/ServiceWorkerRegister.tsx` register a client-side service worker caching static CSS, SVG icons, fonts, and application manifests for offline rendering.
