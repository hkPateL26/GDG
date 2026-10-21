# 09 — INTEGRATIONS, CLOUD INFRASTRUCTURE & EXTERNAL SERVICES
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** External Service Clients, API Gateways, Cloud Infrastructure, and Deployment  
**Cloud Providers:** Google Cloud Platform, Upstash, Vercel Serverless / Node.js Runtime

---

## 1. External Services & Third-Party Integration Matrix

| Integration Name | Provider / Protocol | Implementation Path | Operational Responsibility |
| :--- | :--- | :--- | :--- |
| **Google Gemini 2.5 Flash** | Google Cloud / GenAI SDK | `src/lib/gemini.ts` & `src/app/api/verify-doc` | Multimodal document OCR, blur detection, and conversational AI streaming. |
| **National DigiLocker** | MeitY / NeGD API Setu (Rule 9A) | `src/lib/digilocker-engine.ts` & `api/digilocker` | Official 1-click document retrieval and electronic legal recognition. |
| **MeriPehchaan (National SSO)**| Digital India SSO / 2FA OTP | `src/components/DigiLockerGatewayModal.tsx` | Citizen multi-factor authentication via registered mobile/Aadhaar. |
| **Google Cloud Text-to-Speech**| Google Cloud TTS REST API | `src/app/api/tts/route.ts` | Authentic Gujarati voice synthesis with sentence chunking. |
| **Web Speech API** | W3C Standard Browser API | `src/components/ChatBot.tsx` | Voice recording input directly within the citizen chat interface. |
| **Cyber Treasury e-Grass** | Gujarat Finance Dept Protocol | `src/components/GovernmentReceiptSlip.tsx` | 14-digit Challan Reference Number (CRN) and payment receipts. |
| **Upstash Redis Cluster** | Upstash Serverless Redis REST | `src/lib/redis-cache.ts` | Distributed L2 cache cluster for high-traffic scheme lookups. |
| **Google Cloud Firestore** | Google Cloud Firebase Platform | `src/lib/firebase.ts` & `src/lib/firebase-admin.ts`| Cloud persistence for dynamic citizen applications and public notices. |

---

## 2. Deep Dive: Core Integrations

### 2.1 Google Gemini 2.5 Flash AI Pipeline
- **Packages:** `@google/generative-ai` (`^0.24.1`), `genkit` (`^1.42.0`).
- **Configuration:** Initialized in `src/lib/gemini.ts` using `GOOGLE_GENAI_API_KEY`.
- **Multimodal Document Pre-Scrutiny (`/api/verify-doc`):**
  - Accepts base64 encoded document image or PDF.
  - Constructs system instructions enforcing structured JSON output containing:
    1. Legibility score (0–100) and blur detection.
    2. Government watermark / Ashok Stambh emblem verification.
    3. Bilingual OCR extraction (Gujarati & English text).
    4. Phonetic cross-referencing between applicant legal name and document owner.
    5. Tampering and physical alteration heuristics.
- **Conversational Streaming (`/api/chat`):**
  - Uses `gemini-2.5-flash` with a system prompt primed with the complete 57-scheme Gujarat welfare corpus.
  - Returns streaming tokens via a native `ReadableStream` to deliver immediate visual feedback.

### 2.2 National DigiLocker & MeriPehchaan Gateway
- **Statutory Framework:** Operates under **Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, 2016**, granting electronic documents equal legal standing to physical originals.
- **Engine Logic (`src/lib/digilocker-engine.ts`):**
  - Parses official DigiLocker Uniform Resource Identifiers (e.g., `in.gov.uidai-adhr-492198765432`, `in.gov.gujarat.edistrict-nclc-2024098214`).
  - Implements consent logging compliant with Section 6 of the DPDP Act 2023, capturing purpose limitation (`Gujarat Welfare Scheme & Revenue Verification`) and timestamp.
  - Integrates both sandbox mock adapters (for hackathon/demo execution) and production-ready OAuth endpoints.

### 2.3 Gujarat Cyber Treasury e-Grass Challan System
- **Component:** `src/components/GovernmentReceiptSlip.tsx`.
- **Protocol:** Models the official Government of Gujarat **Electronic Government Receipts Accounting System (e-Grass)**:
  - Generates a unique 14-digit Challan Reference Number (CRN): `GJ-EGRASS-2026-XXXXXXXX`.
  - Maps statutory administrative fees to correct departmental budget heads (Major Head `0029` for Land Revenue, `0059` for Stationery & Certificates).
  - Renders a Code 128 compliant barcode and dual-counterfoil slip (Departmental Copy vs Depositor Copy).

### 2.4 Google Cloud Text-to-Speech & Vernacular Voice
- **Endpoint:** `src/app/api/tts/route.ts`.
- **Processing:**
  - Cleans input text by stripping Markdown formatting, emojis, URLs, and application reference hashes.
  - Splits text into phonetically balanced segments (`splitTextIntoSpeechChunks`) on Gujarati punctuation marks (`।`, `.`, `?`, `!`) with a maximum length of 160 characters.
  - Synthesizes audio using Google's neural voice models (`gu-IN-Standard-A` / `gu-IN-Wavenet-B`), streaming 24kHz MP3 audio back to the client.

---

## 3. Cloud Infrastructure & Hosting Architecture

### 3.1 Serverless Runtime
The application is optimized for deployment on modern serverless cloud platforms (such as **Vercel**, **Google Cloud Run**, or **Render**):
- **Node.js Environment:** Requires Node.js version `20.x` or higher.
- **Dynamic Routing:** All API routes specify `export const dynamic = "force-dynamic"` to bypass static compilation caches where live data evaluation is required.
- **Build Hash Telemetry (`/api/version`):** Automatically computes dynamic deployment hashes incorporating the active Git commit SHA (`VERCEL_GIT_COMMIT_SHA` or `RENDER_GIT_COMMIT`) and the latest source modification timestamp.

### 3.2 Progressive Web Application (PWA) Assets
- **Web App Manifest (`public/manifest.json`):** Configures standalone display mode, orientation locking, Gov.in theme colors (`#ea580c` saffron primary), and vector application icons.
- **Service Worker (`public/sw.js`):** Intercepts network requests to cache critical UI assets, Google fonts, and Lucide SVG icons, enabling the portal shell to mount instantly even in remote offline locations.

---

## 4. Environment Configuration Blueprint

The application requires specific environment variables documented in `.env.example`:

| Environment Variable | Scope | Classification | Description |
| :--- | :--- | :--- | :--- |
| `GOOGLE_GENAI_API_KEY` | Server | Secret | Google Gemini Generative AI API Key. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client | Public | Firebase Web SDK configuration key. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`| Client | Public | Firebase Cloud project ID. |
| `FIREBASE_PROJECT_ID` | Server | Secret | Firebase Admin SDK project identifier. |
| `FIREBASE_CLIENT_EMAIL` | Server | Secret | Google Cloud IAM service account email. |
| `FIREBASE_PRIVATE_KEY` | Server | Secret | Google Cloud IAM RSA private key. |
| `OFFICER_AUTH_SECRET` | Server | Secret | 32+ character HMAC-SHA256 session signing key. |
| `ALLOW_DEMO_CREDENTIALS` | Server | Control Flag | Set to `"true"` to enable demo PIN (`GJ2026`) in demo/testing environments. |
| `REDIS_URL` / `UPSTASH_REDIS_REST_URL`| Server | Secret (Opt) | Distributed Upstash Redis connection string. |
