# 13 — BILINGUAL GLOSSARY & DEVELOPER ONBOARDING RUNBOOK
**Project:** NagrikSeva AI (નાગરિક સેવા AI)  
**Document Classification:** Bilingual Administrative Lexicon, Local Environment Setup, and Developer Guide  
**Language Scope:** Authentic Gujarati (ગુજરાતી) & Official English Administrative Terminology

---

## 1. Bilingual Governance & Administrative Glossary

| Term (Gujarati) | Term (English) | Administrative Definition & Context |
| :--- | :--- | :--- |
| **મામલતદાર (Mamlatdar)** | Taluka Mamlatdar | Chief Executive Magistrate and revenue officer of a Taluka (Tier 4). Has statutory authority to grant certificates, approve mutations, and issue official e-Sign seals. |
| **તલાટી કમ મંત્રી (Talati cum Mantri)** | Village Panchayat Secretary | Village-level revenue and panchayat executive (Tier 5). Conducts primary field inquiries, compiles panchnama reports, and maintains village land registers. |
| **પ્રાંત અધિકારી / SDM** | Sub-Divisional Magistrate | Head of a Revenue Sub-Division comprising multiple talukas (Tier 3). Serves as the First Appellate Authority under the Gujarat Right to Services Act. |
| **જન સેવા કેન્દ્ર (Jan Seva Kendra / ATVT)** | Citizen Service Centre | One-stop civic facilitation counters operating at Taluka Seva Sadans under the *Aapno Taluka Vibrant Taluka* (ATVT) initiative. |
| **AnyRoR (એની આર.ઓ.આર.)** | Any Records of Rights | Official Government of Gujarat digital land record portal providing 7/12 (RoR), 8A (Khatedar Account), and VF-6 (Mutation Entry) extracts. |
| **પેઢીનામું (Pedhinama)** | Genealogical Family Tree / Pedigree | Legal affidavit and inquiry report enumerating surviving direct heirs of a deceased person, mandatory for inheritance and land succession. |
| **પંચનામું (Panchnama)** | Field Witness Report | Official on-site inquiry document recorded by the Talati in the presence of independent local village witnesses (Panchas). |
| **ઈ-ગ્રાસ (e-Grass)** | Electronic Government Receipts Accounting System | Official Gujarat Cyber Treasury gateway used to deposit statutory application fees via treasury challans with 14-digit CRNs. |
| **ગુજરાત સેવાઓનો અધિકાર અધિનિયમ (GRTSA 2013)** | Gujarat Right to Services Act | State statute guaranteeing time-bound delivery of public services (e.g. 7-day SLA for income certificates) with statutory penalties for officer default. |
| **કુટુંબ ફેમિલી લેજર (Kutumb Family Ledger)** | Unified Family Welfare Registry | Digital record uniting a household under a single family ID, allowing joint income calculations and multi-member welfare tracking. |
| **કચેરી (Kacheri)** | Administrative Office / Secretariat | Government revenue or panchayat administrative premises (e.g., Mamlatdar Kacheri, Prant Kacheri, Collectorate). |
| **સચિવાલય (Sachivalaya)** | State Secretariat | Apex executive headquarters in Swarnim Sankul, Gandhinagar, housing the Chief Secretary and Principal Secretaries (Tier 1). |
| **ગંગા સ્વરૂપા સહાય (Ganga Swarupa Sahay)** | Widow Pension Scheme | Gujarat state monthly financial grant (₹1,250/mo) provided to widowed women without deductions. |
| **આકારણી રજીસ્ટર (Akarani Register)** | Property Assessment Register | Gram Panchayat register recording residential property tax valuation and ownership. |
| **નોન-ક્રીમીલેયર પ્રમાણપત્ર (NCLC)** | Non-Creamy Layer Certificate | Statutory certificate issued to SEBC/OBC citizens verifying household income does not exceed ₹8 Lakhs/year for reservation benefits. |

---

## 2. Developer Onboarding & Local Environment Setup

### 2.1 Prerequisites
Ensure the development workstation satisfies the following requirements:
1. **Node.js:** Version `20.10.0 LTS` or higher (`node -v`).
2. **Package Manager:** `npm` version `10.x` or higher (`npm -v`).
3. **Git:** Installed and configured (`git --version`).
4. **Operating System:** Windows, macOS, or Linux.
5. **Code Editor:** VS Code / Antigravity with Tailwind CSS v4 and TypeScript extensions.

---

### 2.2 Step-by-Step Installation Runbook

#### Step 1: Navigate to Repository Root
```bash
cd "d:\Movies and Web se\atmiya\nagrik-seva"
```

#### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Edit `.env.local` with appropriate credentials:
- Set `GOOGLE_GENAI_API_KEY` to an active Gemini API key.
- Set `OFFICER_AUTH_SECRET` to a 32+ character random string (e.g., generated via `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`).
- Set `ALLOW_DEMO_CREDENTIALS=true` for local development.

#### Step 3: Install Dependencies
```bash
npm install
```

#### Step 4: Run Static Type Verification
Ensure all TypeScript definitions and schemas compile cleanly:
```bash
npx tsc --noEmit
```
*Expected Output: Exits with code 0 (zero errors).*

#### Step 5: Execute Automated Test Suites
Run the core cryptographic and isolation tests:
```bash
node test/officer-auth-config.test.mjs
node test/demo-credentials-isolation.test.mjs
```
*Expected Output: 2/2 passed on auth config; 10/10 passed on demo isolation.*

#### Step 6: Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Demo Accounts & Development Credentials

When `ALLOW_DEMO_CREDENTIALS=true` is enabled in development, use the following credentials to inspect various role-based portals:

| Portal Area | Target Role | Employee ID | PIN / Passcode | Administrative Jurisdiction |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen App** | Rural Citizen | Mobile: `9825012345` | Aadhaar: `4829` (OTP: `123456`)| Village: Gomta, Taluka: Gondal |
| **Tier 1 Admin**| Chief Secretary (IAS) | `GUJ-STATE-1001` | `GJ2026` | Entire Gujarat State (33 Districts) |
| **Tier 2 Admin**| District Collector (IAS)| `GUJ-COL-3001` | `GJ2026` | Rajkot District (All 11 Talukas) |
| **Tier 3 Admin**| Prant Officer / SDM (GAS)| `GUJ-SDM-5002` | `GJ2026` | Gondal Sub-Division |
| **Tier 4 Admin**| Taluka Mamlatdar (GAS) | `GUJ-GOV-9012` | `GJ2026` | Gondal Taluka (All Villages) |
| **Tier 5 Admin**| Talati cum Mantri | `GUJ-TAL-7089` | `GJ2026` | Gomta Gram Panchayat |

---

## 4. Common Troubleshooting & Debugging Tips

1. **Firestore Connection Timeouts:**
   - In offline development or when Google Cloud Firebase is unreachable, the system automatically triggers its 650ms – 1200ms `firestoreTimeout` race and falls back to static in-memory datasets (`large-datasets.ts`). Application functionality remains 100% operational.
2. **Next.js Path Aliases:**
   - Always use `@/` path prefixes (e.g., `import { SCHEMES_DATA } from "@/lib/schemes-data"`). TypeScript is configured with `"paths": { "@/*": ["./src/*"] }`.
3. **Tailwind CSS v4 Directives:**
   - Tailwind v4 does not use `tailwind.config.js`. Theme tokens, fonts, and custom animations are declared directly in `src/app/globals.css`.
4. **Haptic Feedback on Desktop:**
   - `navigator.vibrate` is automatically bypassed without throwing errors when running in desktop browsers lacking vibration hardware.
