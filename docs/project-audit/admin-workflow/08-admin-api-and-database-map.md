# NagrikSeva AI — Admin & Officer Side Deep Investigation
## Document 08: Admin APIs & Data Persistence Architecture

> **Audit Date:** October 2026  
> **Target Scope:** Server API Endpoints, Request/Response Payloads, In-Memory Caching, Firestore Asynchronous Synchronization, and Storage Schemas.  
> **Source Files Audited:** `src/app/api/auth/otp/route.ts`, `src/app/api/track/route.ts`, `src/lib/large-datasets.ts`, `src/lib/firebase.ts`.  

---

### 1. Administrative API Endpoints Map

NagrikSeva AI provides three primary route handlers serving the Admin Desk:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. POST /api/auth/otp                                                       │
│    Action: verify_officer                                                   │
│    Payload: { action: "verify_officer", officerId: string, pin: string }    │
│    Source: src/app/api/auth/otp/route.ts                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. GET /api/track                                                           │
│    Query Params: ?search=...&district=...&taluka=...&village=...            │
│                  &status=...&page=...&limit=...&stats=...&id=...            │
│    Source: src/app/api/track/route.ts                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. PATCH /api/track                                                         │
│    Actions: confirm_cash_payment | advance_stage                            │
│    Payload: { id: string, action: string, pin: string, stage?: number, ... }│
│    Source: src/app/api/track/route.ts                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Detailed API Specifications

#### A. Officer Authentication (`POST /api/auth/otp`)
- **Request Body:**
  ```json
  {
    "action": "verify_officer",
    "officerId": "GUJ-GOV-9012",
    "pin": "GJ2026"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "officer": {
      "id": "GUJ-GOV-9012",
      "name": "એચ. વી. પટેલ, GAS",
      "designation": "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ",
      "district": "Rajkot",
      "districtGu": "રાજકોટ",
      "taluka": "Gondal",
      "talukaGu": "ગોંડલ",
      "office": "જન સેવા કેન્દ્ર & તાલુકા સેવા સદન, ગોંડલ",
      "role": "mamlatdar",
      "tierLevel": 4,
      "tierNameGu": "તાલુકા સ્તર - મામલતદાર કચેરી",
      "avatarEmoji": "🖋️"
    }
  }
  ```
- **Failure Response (`401 Unauthorized`):**
  ```json
  {
    "success": false,
    "error": "અમાન્ય કર્મચારી ID અથવા સત્તાવાર સુરક્ષા PIN. (ડેમો PIN: GJ2026)"
  }
  ```

#### B. Queue Query (`GET /api/track`)
- **Request:** `GET /api/track?district=Rajkot&taluka=Gondal&status=processing&limit=100`
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "records": [
      {
        "id": "APP-GUJ-5829",
        "citizenName": "Hari Vinodrai Patel",
        "citizenNameGu": "હરી વિનોદરાઈ પટેલ",
        "schemeName": "Income Certificate",
        "schemeNameGu": "આવકનું પ્રમાણપત્ર",
        "district": "Rajkot",
        "districtGu": "રાજકોટ",
        "taluka": "Gondal",
        "village": "Gomta",
        "aadhaarLast4": "1413",
        "status": "processing",
        "workflowStage": 1,
        "paymentStatus": "paid",
        "appliedDate": "2026-09-28",
        "lastUpdated": "2026-09-28",
        "officerDesignation": "નાયબ મામલતદાર (દસ્તાવેજ સ્ક્રુટિની શાખા), Gondal"
      }
    ],
    "total": 1,
    "page": 1,
    "totalPages": 1
  }
  ```

#### C. Stage Advancement (`PATCH /api/track`)
- **Request Body:**
  ```json
  {
    "id": "APP-GUJ-5829",
    "action": "advance_stage",
    "stage": 3,
    "officerRole": "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ (એચ. વી. પટેલ, GAS)",
    "officerName": "એચ. વી. પટેલ, GAS",
    "officerId": "GUJ-GOV-9012",
    "pin": "GJ2026"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "application": {
      "id": "APP-GUJ-5829",
      "status": "approved",
      "workflowStage": 3,
      "lastUpdated": "2026-10-11",
      "remarksGu": "મામલતદાર કચેરી Gondal દ્વારા તમામ ચકાસણી પૂર્ણ કરી ડિજિટલ હસ્તાક્ષર (e-Sign) સાથે અરજી મંજૂર કરવામાં આવેલ છે. સત્તાવાર પ્રમાણપત્ર / સહાય માન્ય ઠરેલ છે."
    },
    "message": "તાલુકા મામલતદાર સાહેબ દ્વારા ડિજિટલ સહી (e-Sign) સાથે અરજી સંપૂર્ણપણે મંજૂર કરવામાં આવી!"
  }
  ```

---

### 3. Data Persistence Architecture

```mermaid
graph TD
    UI["Frontend (React / Next.js)"]
    API["Next.js Route Handlers (/api/track)"]
    Mem["In-Memory Ledger (large-datasets.ts)"]
    FS["Firebase Cloud Firestore ('applications' collection)"]
    LStore["Client LocalStorage ('nagrik_user_applications')"]
    SStore["Client SessionStorage ('nagrik_officer_session')"]

    UI -->|Session State| SStore
    UI -->|Instant Local Cache| LStore
    UI -->|REST Calls| API
    API <-->|0ms Synchronous Reads & Writes| Mem
    API -.->|Non-Blocking Async Sync (650ms Timeout)| FS
```

#### Dual-Tier Persistence Mechanics
1. **Tier 1 (In-Memory Array):**
   - High-performance memory arrays `CUSTOM_USER_APPLICATIONS` and `cachedSystemDataset`.
   - Zero database latency; instant search across 5,420+ records.
2. **Tier 2 (Cloud Firestore with Non-Blocking Timeout):**
   - Implemented via `withFirestoreTimeout(promise, 650)`.
   - If Firebase takes longer than 650ms (or if offline/misconfigured), the API does **not block** and gracefully falls back to memory.
   - Large base64 images (> 120KB) are filtered out via `cleanForFirestore` to prevent Firestore's 1MB document size limit exception.
3. **Tier 3 (Browser LocalStorage):**
   - `nagrik_user_applications`: Holds user-submitted applications created on the device.
   - `nagrik_policy_configs`: Holds dynamically updated policy CMS settings.
