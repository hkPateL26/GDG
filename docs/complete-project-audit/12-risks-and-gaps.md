# 12 — RISKS, ARCHITECTURAL GAPS & HARDENING ROADMAP
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** Risk Matrix, Architectural Gaps, Scalability Bottlenecks, and Production Hardening Plan  
**Assessment Framework:** Enterprise Digital Public Infrastructure (DPI) Risk & Maturity Assessment

---

## 1. Prioritized Risk Assessment Matrix

| Risk ID | Risk Category | Severity | Likelihood | Impact Area | Core Risk Summary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Architecture / Persistence | **HIGH** | Medium | Citizen Application Vault | Client-side `localStorage` sync dependency when Firestore offline. |
| **RSK-02** | External Service / Scalability | **MEDIUM** | High | AI Vision Scrutiny (`/api/verify-doc`) | Gemini API rate limiting during statewide seasonal intake peaks. |
| **RSK-03** | Production Deployment | **MEDIUM** | Low | National Gateways (DigiLocker / e-Grass) | Operational reliance on sandbox adapters without live NeGD keys. |
| **RSK-04** | Cloud Security | **MEDIUM** | Medium | Direct Database Access | Firestore Security Rules must mirror API-level RBAC constraints. |
| **RSK-05** | Distributed Caching | **LOW** | Medium | Admin CMS Mutations | Multi-instance serverless L1 cache invalidation drift. |

---

## 2. Detailed Risk Analysis & Architectural Gaps

### 2.1 RSK-01: Client-Side LocalStorage Application Storage Dependency
- **Technical Observation:**  
  When a citizen submits an application, the record is stored in Google Cloud Firestore (`applications` collection) and mirrored to browser `localStorage` under `nagrik_custom_applications`. If Firestore write connectivity is unavailable or throttled, the application exists exclusively within the applicant's browser vault.
- **Vulnerability / Failure Mode:**  
  If the citizen switches devices, uses private browsing mode, or clears site cookies/storage before cloud synchronization is confirmed, the local reference to the Application ID and private Tracking Secret could be lost.
- **Recommended Remediation:**  
  Implement a background synchronization queue using the **IndexedDB Web API** combined with the Service Worker Background Sync API (`SyncManager`). When network connectivity is re-established, the worker transparently pushes queued submissions to `/api/track` and returns an SMS confirmation to the citizen's mobile.

---

### 2.2 RSK-02: Gemini AI Rate Limiting During Seasonal Intake Peaks
- **Technical Observation:**  
  The document pre-verification engine (`/api/verify-doc`) invokes `gemini-2.5-flash` synchronously upon citizen upload.
- **Vulnerability / Failure Mode:**  
  During major seasonal application cycles (such as the annual i-Khedut agricultural equipment subsidy window where 200,000+ farmers apply within 72 hours), synchronous API requests could hit Google Cloud GenAI project rate limits (RPM / TPM), resulting in HTTP 429 Too Many Requests.
- **Recommended Remediation:**  
  1. Decouple document upload from AI verification using an asynchronous message queue (such as Google Cloud Tasks, AWS SQS, or Redis BullMQ).
  2. Return an immediate HTTP 202 Accepted to the citizen with status `"verification_queued"`.
  3. Worker processes OCR verification in the background, updating application status within 60 seconds.

---

### 2.3 RSK-03: Transitioning from Simulated Gateways to Production NeGD & e-Grass
- **Technical Observation:**  
  The platform currently integrates complete, functional DigiLocker (`DigiLockerGatewayModal.tsx`) and Cyber Treasury e-Grass (`GovernmentReceiptSlip.tsx`) modules. These operate using high-fidelity simulated adapters alongside production-ready data schemas.
- **Vulnerability / Failure Mode:**  
  Transitioning to full live production requires formal administrative onboarding:
  - DigiLocker requires an approved Requester Organization Agreement from the **National e-Governance Division (NeGD)** and API Setu client credentials.
  - Cyber Treasury e-Grass requires merchant integration with the **Finance Department, Gandhinagar**.
- **Recommended Remediation:**  
  Maintain the existing adapter pattern where toggling `NEXT_PUBLIC_DIGILOCKER_ENV=production` automatically switches from simulated token endpoints to official NeGD OAuth2 authorization servers.

---

### 2.4 RSK-04: Firestore Security Rules Mirroring Serverless RBAC
- **Technical Observation:**  
  The Next.js serverless API routes (`/api/*`) enforce rigorous 5-tier RBAC, territorial jurisdiction filtering, and HMAC session token verification. However, if Firebase client-side SDK keys (`NEXT_PUBLIC_FIREBASE_API_KEY`) are exposed in the client bundle, malicious actors could theoretically attempt direct Firestore queries bypassing the Next.js API layer.
- **Recommended Remediation:**  
  Deploy strict server-side `firestore.rules` within the Firebase console:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /applications/{appId} {
        allow read: if request.auth != null;
        allow write: if false; // All mutations must route through Next.js Admin APIs
      }
      match /public_notices/{noticeId} {
        allow read: if true;
        allow write: if false;
      }
    }
  }
  ```

---

### 2.5 RSK-05: Multi-Instance Serverless L1 Cache Invalidation Drift
- **Technical Observation:**  
  The custom `EnterpriseRedisCache` (`src/lib/redis-cache.ts`) maintains an in-memory `Map` of 5,000 items as an L1 edge cache. When an administrator updates a scheme or office in `/admin`, the local instance calls `redisCache.del()`.
- **Vulnerability / Failure Mode:**  
  In a distributed serverless cluster (e.g., 20 concurrent Vercel serverless functions), invalidating memory in Container A does not instantly clear memory in Container B until the 300-second TTL expires.
- **Recommended Remediation:**  
  Ensure production deployments supply `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. When configured, cache invalidations execute Redis `DEL` across the central cluster, and L1 memory caches subscribe to Redis Pub/Sub invalidation channels.

---

## 3. Production Hardening Roadmap

```
                                 HARDENING PHASES & TIMELINE
+----------------------------------------------------------------------------------------------------+
| PHASE 1: IMMEDIATE PRODUCTION PREPARATION (Weeks 1 - 2)                                            |
| - Verify 32-character OFFICER_AUTH_SECRET across all deployment environments.                      |
| - Deploy server-side firestore.rules to lock down direct cloud database collections.               |
| - Configure Upstash Redis cluster credentials for multi-instance cache coherence.                  |
+----------------------------------------------------------------------------------------------------+
                                                 │
                                                 ▼
+----------------------------------------------------------------------------------------------------+
| PHASE 2: RESILIENT QUEUEING & NOTIFICATIONS (Weeks 3 - 6)                                         |
| - Implement IndexedDB Background Sync for offline citizen submissions.                             |
| - Offload Gemini Vision AI document parsing to Google Cloud Tasks background workers.               |
| - Integrate Gujarat State SMS Gateway (e-Dharti / Sandes) for real-time OTP and SLA alerts.        |
+----------------------------------------------------------------------------------------------------+
                                                 │
                                                 ▼
+----------------------------------------------------------------------------------------------------+
| PHASE 3: LIVE DPI ONBOARDING & PILOT (Weeks 7 - 12)                                                |
| - Complete NeGD API Setu formal security audit and activate live DigiLocker OAuth keys.           |
| - Connect live Gujarat Cyber Treasury e-Grass payment gateway API.                                 |
| - Conduct pilot rollout across Rajkot District (Gondal, Kotda Sangani, Lodhika Talukas).           |
+----------------------------------------------------------------------------------------------------+
```
