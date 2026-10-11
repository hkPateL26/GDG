# 09 — Third-Party Integrations & Infrastructure

---

## 1. External Integrations Matrix

| Provider / Integration | Primary Usage | Invocation Method | Configuration Key | Fallback Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Google Gemini AI** | Conversational Assistant, Document Vision OCR | `@google/generative-ai` SDK (HTTP/REST) | `GOOGLE_GENAI_API_KEY` | Multi-model candidate race (`15s` timeout) -> Deterministic statutory rule engine. |
| **Google Cloud Firestore** | Cloud database for schemes, applications, chat sessions | Firebase Web SDK `12.19.0` & Admin SDK `14.5.0` | `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY` | `650ms` read timeout -> In-memory server ledger -> Bundled 5,420 record dataset. |
| **Google Translate** | Multilingual DOM translation for 13 non-native Indian languages | Script injection (`GoogleTranslateScript.tsx`), `googtrans` cookie | Client-side DOM widget | Native React strings (`gu`, `hi`, `en`) via `LanguageContext`. |
| **Google TTS (Translate Audio)** | Voice generation for Gujarati, Hindi, English | HTTP GET streaming to `translate.google.com/translate_tts` | Public HTTP endpoint | Native browser Web Speech API (`window.speechSynthesis`). |
| **OpenStreetMap Nominatim** | Reverse geocoding of GPS coordinates to village/taluka | HTTP GET to `nominatim.openstreetmap.org/reverse` | Public HTTP with custom `User-Agent` | Local Haversine spatial lookup (`location-resolver.ts`) across Gujarat centers. |
| **Web Speech API** | Client-side speech-to-text input and voice output | Browser native Web API | None (Browser capability) | Typed text input. |
| **HTML5 Vibration API** | Native-feeling tactile feedback on mobile interactions | `navigator.vibrate(10)` | None (Hardware feature) | Silent click on unsupported devices (e.g., iOS Safari). |
| **Vercel Cloud Platform** | Serverless hosting, edge routing, automated TLS | `vercel.json` | Vercel Git integration | Standard Node.js server (`next start`). |

---

## 2. Integration Deep Dive & Request Lifecycles

### 2.1 Google Gemini AI Multimodal Integration
- **Client Library:** `@google/generative-ai` (`0.24.1`).
- **Configuration:** Initialized in [`src/lib/gemini.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/gemini.ts#L4-L10).
- **Vision Pipeline ([`src/app/api/verify-doc/route.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/verify-doc/route.ts)):**
  1. Base64 payload formatted as inline part (`inlineData: { data: base64Data, mimeType }`).
  2. Injected into `model.generateContent([customPrompt, inlinePart])`.
  3. Response parsed with regex: `/```(?:json)?\s*([\s\S]*?)\s*```/`.
- **Text Pipeline ([`src/app/api/chat/route.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/chat/route.ts)):**
  1. Chat initialized with historical turns (`model.startChat({ history })`).
  2. Prompt augmented with citizen geographic context and statutory law directives.
  3. Dispatched with a `15,000ms` Promise race.

### 2.2 Google Cloud Firestore Integration
- **Client SDK ([`src/lib/firebase.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/firebase.ts)):**
  Initializes `initializeApp(firebaseConfig)` with graceful fallback to `undefined` if connection fails.
- **Admin SDK ([`src/lib/firebase-admin.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/firebase-admin.ts)):**
  Initializes service account credentials with private key newline normalization (`replace(/\\n/g, "\n")`).
- **Write Sanitization:** Strips base64 image strings larger than 120KB to satisfy Firestore's 1MB document limit.

### 2.3 OpenStreetMap Nominatim Geocoding
- **Endpoint:** `https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}&accept-language=gu,en`.
- **Headers:** Mandatory `User-Agent: NagrikSevaAI-GovPortal/1.0` complying with OSM usage policy.
- **Timeout Guard:** `AbortSignal.timeout(3000)`.
- **Post-Processing:** Filters out administrative keywords (`તાલુકા`, `ગ્રામ્ય`, `district`) to extract the precise village name.

---

## 3. Local Environment Configuration

To run all integrations locally without revealing secrets:

```env
# ============================================
# NagrikSeva AI - Local Environment (.env.local)
# ============================================

# 1. Google Gemini AI API Key (Get from Google AI Studio: https://aistudio.google.com/)
GOOGLE_GENAI_API_KEY="AIzaSy..."

# 2. Firebase Client Config (Optional - system falls back to in-memory if omitted)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="nagrik-seva-ai.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="nagrik-seva-ai"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="nagrik-seva-ai.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="55663881246"
NEXT_PUBLIC_FIREBASE_APP_ID="1:55663881246:web:0a8e0c5df730e875bf520f"

# 3. Firebase Admin SDK (Optional - server falls back to memory if omitted)
FIREBASE_PROJECT_ID="nagrik-seva-ai"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@nagrik-seva-ai.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgI...\n-----END PRIVATE KEY-----\n"

# 4. App Branding
NEXT_PUBLIC_APP_NAME="NagrikSeva AI"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
