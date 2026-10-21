# 06 — COMPLETE API REFERENCE & REQUEST LIFECYCLES
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** REST API Endpoint Specification, Request/Response Contracts, and Source Traceability  
**Base Protocol:** HTTPS / JSON REST APIs  
**Serverless Engine:** Next.js 16.3.6 App Router Handlers (`src/app/api/*`)

---

## 1. API Route Index & Authentication Overview

| # | HTTP Method | Endpoint Route | Auth Type | Primary Responsibility |
| :- | :--- | :--- | :--- | :--- |
| 1 | `POST` | `/api/auth/otp` | Public / Session | Citizen 2FA OTP, profile lookup, and officer login/logout |
| 2 | `POST` | `/api/chat` | Public / Rate-Limited | Gemini 2.5 Flash streaming multilingual AI responses |
| 3 | `GET` | `/api/chat/history` | Citizen Mobile | Retrieves persistent conversational history from Firestore |
| 4 | `POST` | `/api/digilocker` | Public / Consent | MeriPehchaan SSO, 2FA OTP, MPIN, and Rule 9A document fetching |
| 5 | `GET` | `/api/geo/villages` | Public / Cached | Cascading resolution across Gujarat's 18,225 revenue villages |
| 6 | `POST` | `/api/location/resolve` | Public | Haversine formula calculation resolving GPS coordinates to nearest kacheri |
| 7 | `GET` / `POST` | `/api/notices` | Public / Officer RBAC| Fetch circulars (`GET`) or publish/update dynamic notices (`POST`) |
| 8 | `GET` / `POST` | `/api/offices` | Public / Officer RBAC| Query Gujarat kacheri directory (`GET`) or update office metadata (`POST`) |
| 9 | `GET` / `POST` | `/api/schemes` | Public / Officer RBAC| Search 57 schemes (`GET`) or modify scheme rules in CMS (`POST`) |
| 10 | `GET` | `/api/schemes/[id]` | Public / Cached | Fetch deep statutory dossier, SLA metrics, and rules for a single scheme |
| 11 | `GET` | `/api/system-health` | Public / Telemetry | Telemetry metrics for Redis cache, Firestore, and AI inference latency |
| 12 | `GET` / `POST` | `/api/track` | Secret / Officer HMAC| Citizen tracking query (`GET`) or officer lifecycle status transition (`POST`)|
| 13 | `POST` | `/api/tts` | Public / Rate-Limited | Google Cloud Text-to-Speech audio generation in authentic Gujarati |
| 14 | `POST` | `/api/verify-doc` | Public / Rate-Limited | Gemini 2.5 Flash multimodal vision OCR and document pre-scrutiny |
| 15 | `GET` | `/api/version` | Public / No-Cache | Real-time build hash, Git commit SHA, and release deployment metadata |

---

## 2. Exhaustive Endpoint Specifications

### 2.1 Citizen Authentication & Officer Login (`POST /api/auth/otp`)
- **Source File:** `src/app/api/auth/otp/route.ts` (Lines 20–221).
- **Access Control:** Public for Citizen OTP; Protected by Employee PIN for Officer Login.
- **Actions Supported:** `send_otp`, `verify_otp`, `get_citizen_profile`, `officer_login`, `officer_logout`, `demo_gate_verify`.

#### Action: `send_otp`
- **Request Body:**
  ```json
  {
    "action": "send_otp",
    "mobile": "9876543210",
    "aadhaarLast4": "4921"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OTP સફળતાપૂર્વક મોકલાઈ ગયો છે. (ડેમો OTP: 123456)",
    "expiresIn": 300
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "error": "મોબાઈલ નંબર અને આધારના છેલ્લા ૪ આંકડા બંને ફરજિયાત છે."
  }
  ```

#### Action: `officer_login`
- **Request Body:**
  ```json
  {
    "action": "officer_login",
    "officerId": "GUJ-GOV-9012",
    "pin": "GJ2026"
  }
  ```
- **Success Response (200 OK):**
  - Sets `Set-Cookie: nagrik_officer_token=<base64>.<hmac_sha256>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`.
  ```json
  {
    "success": true,
    "officer": {
      "id": "GUJ-GOV-9012",
      "name": "એચ. વી. પટેલ, GAS",
      "designation": "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ",
      "district": "Rajkot",
      "taluka": "Gondal",
      "role": "mamlatdar",
      "tierLevel": 4
    }
  }
  ```

---

### 2.2 Multimodal AI Document Verification (`POST /api/verify-doc`)
- **Source File:** `src/app/api/verify-doc/route.ts` (Lines 1–320).
- **Access Control:** Public; Rate limited.
- **Consumer:** `src/components/DocumentServicePortal.tsx`.
- **Request Body:**
  ```json
  {
    "documentType": "income_certificate",
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "citizenName": "Rameshbhai K. Patel",
    "citizenNameGu": "રમેશભાઈ કે. પટેલ",
    "fatherHusbandName": "Kantilal Patel",
    "district": "Rajkot",
    "taluka": "Gondal"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "confidence": 94,
    "verdict": "APPROVED",
    "qualityMetrics": {
      "legibilityScore": 96,
      "blurDetected": false,
      "emblemFound": true,
      "emblemType": "Ashok Stambh (National Emblem)",
      "tamperingDetected": false
    },
    "ocrExtractedData": {
      "detectedName": "Rameshbhai Kantilal Patel",
      "nameMatchScore": 98,
      "annualIncome": "₹ 1,20,000",
      "issuingAuthority": "Mamlatdar Office, Gondal",
      "issueDate": "2026-04-12"
    },
    "remarksGu": "દસ્તાવેજ સંપૂર્ણ સ્પષ્ટ છે. અસલ સરકારી મહોર અને તલાટી પંચનામું માન્ય છે."
  }
  ```

---

### 2.3 Application Tracking & Officer Lifecycle Transition (`GET` / `POST /api/track`)
- **Source File:** `src/app/api/track/route.ts` (Lines 1–450).

#### Citizen Query (`GET /api/track?id=APP005&secret=SEC-4921-GJ`)
- **Validation:** Both `id` and `secret` are mandatory for citizen requests. Strips internal officer notes.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "application": {
      "id": "APP005",
      "citizenName": "Rameshbhai K. Patel",
      "citizenNameGu": "રમેશભાઈ કે. પટેલ",
      "schemeName": "PM Kisan Samman Nidhi",
      "schemeNameGu": "PM કિસાન સન્માન નિધિ",
      "status": "approved",
      "appliedDate": "2026-08-25",
      "lastUpdated": "2026-09-05",
      "workflowStage": 3,
      "officerDesignation": "તાલુકા મામલતદાર, ગોંડલ",
      "statutorySlaDays": 30,
      "certificateDownloadUrl": "/api/track/cert?id=APP005",
      "receiptDownloadUrl": "/api/track/receipt?id=APP005"
    }
  }
  ```

#### Officer State Transition (`POST /api/track`)
- **Access Control:** Requires valid `nagrik_officer_token` cookie matching territorial jurisdiction.
- **Request Body:**
  ```json
  {
    "applicationId": "APP005",
    "action": "approve",
    "signatureType": "aadhaar-esign",
    "remarksGu": "તમામ પુરાવા માન્ય છે. ડિજિટલ સહીથી પ્રમાણપત્ર મંજૂર કરવામાં આવે છે.",
    "remarksEn": "All attached documents verified. Approved with cryptographic e-Sign stamp."
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "status": "approved",
    "eSignHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "approvalTimestamp": "2026-10-15T10:30:00.000Z",
    "message": "અરજી સફળતાપૂર્વક મંજૂર થઈ અને સત્તાવાર પ્રમાણપત્ર જનરેટ થઈ ગયું."
  }
  ```

---

### 2.4 DigiLocker & MeriPehchaan Gateway (`POST /api/digilocker`)
- **Source File:** `src/app/api/digilocker/route.ts` (Lines 1–249).
- **Access Control:** Public; Consent-guarded.
- **Actions:** `send_otp`, `verify_otp`, `fetch_documents`, `fetch_single_doc`.

#### Action: `fetch_documents`
- **Request Body:**
  ```json
  {
    "action": "fetch_documents",
    "identifier": "9876543210",
    "consentTimestamp": "2026-10-15T10:15:00.000Z",
    "consentPurpose": "Gujarat Welfare Scheme & Revenue Verification under DPDP Act 2023"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "documents": [
      {
        "id": "aadhaar",
        "nameEn": "Aadhaar Card",
        "nameGu": "આધાર કાર્ડ",
        "uri": "in.gov.uidai-adhr-492198765432",
        "docType": "ADHR",
        "issuer": "Unique Identification Authority of India (UIDAI)",
        "issuedDate": "2018-05-12",
        "status": "verified"
      },
      {
        "id": "caste_obc",
        "nameEn": "Non-Creamy Layer Certificate",
        "nameGu": "નોન-ક્રીમીલેયર પ્રમાણપત્ર",
        "uri": "in.gov.gujarat.edistrict-nclc-2024098214",
        "docType": "NCLC",
        "issuer": "Revenue Department, Government of Gujarat",
        "issuedDate": "2024-04-10",
        "status": "verified"
      }
    ]
  }
  ```

---

### 2.5 Cascading Village Geo-Resolver (`GET /api/geo/villages`)
- **Source File:** `src/app/api/geo/villages/route.ts` (Lines 1–95).
- **Query Parameters:**
  - `district` (string, optional): Filter by district name (e.g., `Rajkot`).
  - `taluka` (string, optional): Filter by taluka name (e.g., `Gondal`).
  - `q` (string, optional): Prefix or substring search term (e.g., `Gom`).
- **Response (200 OK):**
  - Cached via `redisCache` with key `geo_villages_${district}_${taluka}_${q}`.
  ```json
  {
    "success": true,
    "count": 1,
    "villages": [
      {
        "id": "gomta-gondal-rajkot",
        "nameEn": "Gomta",
        "nameGu": "ગોમટા",
        "taluka": "Gondal",
        "district": "Rajkot",
        "pincode": "360311"
      }
    ]
  }
  ```

---

### 2.6 Dynamic Circulars & Public Notices (`GET` / `POST /api/notices`)
- **Source File:** `src/app/api/notices/route.ts` (Lines 1–90).
- **`GET` Response:** Returns active government circulars categorized as `urgent`, `welfare`, `circular`, or `recruitment`.
- **`POST` Handler:** Requires Tier 1 or Tier 2 officer permissions. Persists newly issued circulars and flushes `notices_public_list` in Redis.

---

### 2.7 System Telemetry & Health Monitoring (`GET /api/system-health`)
- **Source File:** `src/app/api/system-health/route.ts` (Lines 1–85).
- **Success Response (200 OK):**
  ```json
  {
    "status": "healthy",
    "uptimeSeconds": 142850,
    "environment": "production",
    "redis": {
      "provider": "Redis-Compatible L1 In-Memory Edge Cache",
      "status": "healthy",
      "hitRate": "98%",
      "keysCached": 4210,
      "averageLatencyMs": 0.8
    },
    "firestore": {
      "status": "connected",
      "averageLatencyMs": 142
    },
    "aiInference": {
      "model": "gemini-2.5-flash",
      "status": "operational",
      "averageLatencyMs": 620
    }
  }
  ```

---

## 3. End-to-End Representative Request Lifecycles

### Lifecycle A: Citizen Service Application with DigiLocker Document
```
Citizen Client                  Frontend                  Next.js API (/api)              DigiLocker / Gemini
      │                             │                             │                                │
      ├─ 1. Click "Apply Online" ──►│                             │                                │
      ├─ 2. Fetch via DigiLocker ──►│ 3. POST /api/digilocker ───►│                                │
      │                             │                             ├─ 4. Verify Citizen Consent ───►│
      │                             │                             │◄─ 5. Return Signed URI & Docs ─┤
      │                             │◄─ 6. Populate Form Fields ──┤                                │
      ├─ 7. Upload Additional Proof►│                             │                                │
      │                             │ 8. POST /api/verify-doc ───►│                                │
      │                             │                             ├─ 9. Multimodal Vision OCR ────►│
      │                             │                             │◄─ 10. Return 94% Confidence ───┤
      │                             │◄─ 11. Display Quality Badge ┤                                │
      ├─ 12. Submit & Pay Challan ─►│                             │                                │
      │                             │ 13. POST /api/track ───────►│                                │
      │                             │                             ├─ 14. Assign Application ID     │
      │                             │                             ├─ 15. Generate Tracking Secret  │
      │                             │                             ├─ 16. Record to DB & Queue      │
      │                             │◄─ 17. Return APP005 & Slip ─┤                                │
      │◄─ 18. Download e-Grass Slip─┤                             │                                │
```

### Lifecycle B: Officer Scrutiny & e-Sign Issuance
```
Officer Client                  AdminHierarchyDesk        Next.js API (/api/track)        Firestore & Redis
      │                                 │                             │                           │
      ├─ 1. Authenticate with PIN ─────►│ 2. POST /api/auth/otp ─────►│                           │
      │                                 │                             ├─ 3. Sign HMAC Session     │
      │                                 │◄─ 4. Set Cookie & Profile ──┤                           │
      ├─ 5. Open Scrutiny Queue ───────►│ 6. GET /api/track ─────────►│                           │
      │                                 │                             ├─ 7. Enforce Taluka Filter ┤
      │                                 │                             ├─ 8. Query Cached Queue ──►│
      │                                 │◄─ 9. Render Taluka Files ───┤                           │
      ├─ 10. Review Proofs & Click eSign►│                             │                           │
      │                                 │ 11. POST /api/track (Approve│                           │
      │                                 │     with eSign Hash) ──────►│                           │
      │                                 │                             ├─ 12. Update State to Apprv │
      │                                 │                             ├─ 13. Invalidate Redis Key ─►
      │                                 │                             ├─ 14. Commit to Firestore ──►
      │                                 │◄─ 15. Return Success ───────┤                           │
      │◄─ 16. Display Approved Certificate with QR Code and Ashok Emblem
```
