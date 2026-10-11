# 06 — API Reference & Request Contracts

---

## 1. Complete API Route Inventory

| Method | Endpoint Route | Request Body | Primary Purpose | Callers / Frontends |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/otp` | JSON (`action`, `mobile`, `aadhaarLast4`, `otp`, `officerId`, `pin`) | 2FA Citizen OTP generation, validation, and Officer login | `CitizenLoginShield`, `OfficerLoginShield`, `BenefitCalculator` |
| `POST` | `/api/chat` | JSON (`message`, `language`, `citizenContext`, `history`, `attachment`) | Gemini AI multi-model streaming civic chat | `ChatBot` |
| `GET` | `/api/chat/history` | Query (`userId`) | Retrieve saved chat sessions for citizen | `ChatBot` |
| `POST` | `/api/chat/history` | JSON (`session`) | Persist/update chat session | `ChatBot` |
| `DELETE`| `/api/chat/history` | Query (`id`, `userId`, `all`) | Clear one or all chat sessions | `ChatBot` |
| `GET` | `/api/schemes` | Query (`id`, `category`, `search`) | Retrieve welfare schemes with filtering | `SchemesPage`, `SchemeDetailPage` |
| `GET` | `/api/schemes/[id]` | URL Path (`id`) | Single scheme detail lookup | Direct link navigation |
| `GET` | `/api/track` | Query (`id`, `search`, `district`, `status`, `page`, `limit`, `stats`) | Application search, vault tracking, pagination, metrics | `TrackVaultView`, `AdminHierarchyDesk` |
| `POST` | `/api/track` | JSON (`CitizenApplication` payload) | Register new citizen application & payment | `DocumentServicePortal`, `SchemeDetailPage` |
| `PATCH` | `/api/track` | JSON (`id`, `action`, `nextStage`, `remarks`, `officerDesignation`) | Advance workflow stage or confirm cash fee | `AdminHierarchyDesk` |
| `POST` | `/api/verify-doc` | JSON (`imageBase64`, `mimeType`, `expectedDocType`, `fileName`) | Multimodal Gemini Vision document verification | `DocumentServicePortal`, `FamilyMemberManagerBar` |
| `POST` | `/api/location/resolve`| JSON (`lat`, `lng`) | Reverse geocode coordinates to nearest Gujarat office | `SmartKacheriLocatorBanner`, `OfficeLocatorPage` |
| `GET` | `/api/tts` | Query (`text`, `lang`) | Stream spoken audio from text (chunked TTS) | `ChatBot` |
| `POST` | `/api/tts` | JSON (`text`, `lang`) | Stream spoken audio from long text payload | `ChatBot` |
| `GET` | `/api/system-health` | None | Operational telemetry: CPU, RAM, version, latency | `EnterpriseSystemHealthBar` |
| `GET` | `/api/version` | None | Live version string and mtime build hash | Client update checker |

---

## 2. Detailed API Specifications & Contracts

### 2.1 `/api/auth/otp`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`

#### Action 1: Send OTP
```json
// Request Body
{
  "action": "send_otp",
  "mobile": "9974442291",
  "aadhaarLast4": "1413"
}

// Success Response (200 OK)
{
  "success": true,
  "message": "OTP તમારા રજિસ્ટર્ડ મોબાઈલ 9974442291 પર મોકલવામાં આવ્યો છે.",
  "otp": "123456",
  "expiresInSeconds": 300
}
```

#### Action 2: Verify OTP
```json
// Request Body
{
  "action": "verify_otp",
  "mobile": "9974442291",
  "aadhaarLast4": "1413",
  "otp": "123456"
}

// Success Response (200 OK)
{
  "success": true,
  "citizen": {
    "citizenName": "Hari Patel",
    "citizenNameGu": "હરિ પટેલ",
    "mobile": "9974442291",
    "aadhaarLast4": "1413",
    "district": "Rajkot",
    "taluka": "Gondal",
    "village": "Gomta",
    "activeApplications": [ ... ]
  }
}
```

#### Action 3: Verify Officer Credentials
```json
// Request Body
{
  "action": "verify_officer",
  "officerId": "GUJ-MAM-7003",
  "pin": "GJ2026"
}

// Success Response (200 OK)
{
  "success": true,
  "officer": {
    "id": "GUJ-MAM-7003",
    "name": "આર. કે. જાડેજા, GAS",
    "designation": "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, ગોંડલ",
    "role": "mamlatdar",
    "tierLevel": 4,
    "district": "Rajkot",
    "taluka": "Gondal",
    "canApproveEsign": true,
    "canVerifyPayment": true
  }
}
```

---

### 2.2 `/api/chat`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`

```json
// Request Body
{
  "message": "મારે આવકનો દાખલો કઢાવવો છે, શું પુરાવા જોશે?",
  "language": "gu",
  "citizenContext": {
    "nameGu": "હરિ પટેલ",
    "district": "Rajkot",
    "taluka": "Gondal",
    "village": "Gomta"
  },
  "history": [
    { "role": "user", "parts": [{ "text": "નમસ્તે" }] },
    { "role": "model", "parts": [{ "text": "નમસ્તે! હું નાગરિકસેવા AI છું." }] }
  ]
}

// Success Response (200 OK)
{
  "success": true,
  "reply": "નમસ્તે હરિ પટેલ! 🙏 આવકના દાખલા માટે નીચે મુજબના પુરાવા જરૂરી છે:\n🏛️ સત્તાવાર અધિનિયમ: ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩...\n• રેશનકાર્ડ\n• આધાર કાર્ડ\n• તલાટી પંચનામું / લાઈટબિલ\n⏱️ સમયમર્યાદા: ૩ કામકાજી દિવસ.",
  "actionButtons": [
    {
      "label": "🚀 આવકના દાખલા માટે અરજી કરો",
      "href": "/documents?service=income-certificate",
      "variant": "primary"
    }
  ]
}
```

---

### 2.3 `/api/verify-doc`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`

```json
// Request Body
{
  "imageBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "mimeType": "image/jpeg",
  "expectedDocType": "Aadhaar Card (આધાર કાર્ડ)",
  "fileName": "my_aadhaar_card.jpg"
}

// Success Response (200 OK)
{
  "success": true,
  "analysis": {
    "documentType": "Aadhaar Card",
    "documentNameGu": "આધાર કાર્ડ (UIDAI)",
    "qualityScore": 92,
    "isValidForGovt": true,
    "matchesExpected": true,
    "needsUpdate": false,
    "needsNewDocument": false,
    "actionableAdviceGu": "✅ માન્ય દસ્તાવેજ: તમારું આધાર કાર્ડ સફળતાપૂર્વક અપલોડ થયું છે અને તે સ્પષ્ટ છે.",
    "feedbackGu": "દસ્તાવેજ સ્પષ્ટ છે અને ૧૨ આંકડાનો બારકોડ વંચાય છે.",
    "extractedInfo": {
      "detectedName": "Hari Vinodrai Patel",
      "documentNumberMasked": "XXXX-XXXX-1413",
      "yearOrDate": "1998"
    },
    "verificationPoints": [
      { "point": "દસ્તાવેજ સ્પષ્ટતા", "status": "pass", "note": "સંપૂર્ણ લખાણ વંચાય છે" },
      { "point": "પ્રકાર સુસંગતતા", "status": "pass", "note": "આધાર કાર્ડ પુરાવો માન્ય છે" }
    ]
  }
}
```

---

### 2.4 `/api/track`
- **Methods:** `GET`, `POST`, `PATCH`

#### `POST /api/track` (Create Application & Payment)
```json
// Request Body
{
  "citizenName": "Hari Patel",
  "citizenNameGu": "હરિ પટેલ",
  "gender": "male",
  "schemeId": "income",
  "schemeName": "Income Certificate",
  "schemeNameGu": "આવકનો દાખલો",
  "district": "Rajkot",
  "taluka": "Gondal",
  "village": "Gomta",
  "aadhaarLast4": "1413",
  "mobile": "9974442291",
  "paymentMethod": "upi",
  "paymentStatus": "paid",
  "feeAmount": 20,
  "txnId": "TXN-UPI-99214",
  "signatureType": "aadhaar-esign"
}

// Success Response (200 OK)
{
  "success": true,
  "application": {
    "id": "APP-GUJ-7421",
    "challanNo": "GRN-2026-88129",
    "status": "processing",
    "workflowStage": 2,
    "appliedDate": "2026-10-11",
    "officerDesignation": "નાયબ મામલતદાર (જન સેવા કેન્દ્ર), Gondal",
    "remarksGu": "અરજી સ્વીકારાઈ છે. સરકારી ફી ₹ 20 UPI મારફતે જમા થયેલ છે."
  },
  "notifications": {
    "sms": {
      "sentTo": "9974442291",
      "message": "Govt of Gujarat: નમસ્તે હરિ પટેલ, તમારી આવકનો દાખલો માટેની અરજી (APP-GUJ-7421) સ્વીકારાઈ છે."
    }
  }
}
```

#### `PATCH /api/track` (Stage Advancement & Cash Confirmation)
```json
// Request Body (Stage Advance)
{
  "id": "APP-GUJ-7421",
  "action": "advance_stage",
  "nextStage": 3,
  "remarks": "દસ્તાવેજોની રૂબરૂ ચકાસણી પૂર્ણ. સ્થળ તપાસ અહેવાલ મંજૂર.",
  "officerDesignation": "તાલુકા મામલતદાર & એક્ઝિક્યુટિવ મેજિસ્ટ્રેટ, Gondal"
}

// Success Response (200 OK)
{
  "success": true,
  "application": {
    "id": "APP-GUJ-7421",
    "workflowStage": 3,
    "status": "processing",
    "lastUpdated": "2026-10-11"
  }
}
```

---

### 2.5 `/api/location/resolve`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`

```json
// Request Body
{
  "lat": 21.9619,
  "lng": 70.7997
}

// Success Response (200 OK)
{
  "success": true,
  "location": {
    "village": "Gomta",
    "villageGu": "ગોમટા",
    "taluka": "Gondal",
    "talukaGu": "ગોંડલ",
    "district": "Rajkot",
    "districtGu": "રાજકોટ",
    "nearestOffice": "Taluka Seva Sadan & Mamlatdar Office, Gondal",
    "nearestOfficeGu": "તાલુકા સેવા સદન & મામલતદાર કચેરી, ગોંડલ",
    "distanceKm": 4.2,
    "latitude": 21.9619,
    "longitude": 70.7997
  }
}
```

---

### 2.6 `/api/system-health`
- **Method:** `GET`

```json
// Success Response (200 OK)
{
  "success": true,
  "version": "v2.5.9",
  "db": {
    "name": "Google Cloud Firestore",
    "status": "online",
    "latencyMs": 28
  },
  "system": {
    "node": "GSDC-Gandhinagar-Node-01",
    "dataCenter": "Gujarat State Data Centre (GSDC)",
    "loadBalancer": "Active Round-Robin",
    "cpuUsage": "18%",
    "memoryUsage": "42%",
    "uptimeSec": 86420,
    "healthy": true
  },
  "metrics": {
    "totalSchemes": 26,
    "totalOffices": 35,
    "apiLatencyMs": 14,
    "timestamp": "2026-10-11T10:15:00.000Z"
  }
}
```
