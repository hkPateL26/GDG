# 🏛️ NagrikSeva AI (નાગરિકસેવા AI)
### *AI-Powered Digital Public Infrastructure & Citizen Governance Assistant*

[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20Flash-orange?logo=google)](https://aistudio.google.com/)
[![Firebase Firestore](https://img.shields.io/badge/Database-Cloud%20Firestore-yellow?logo=firebase)](https://firebase.google.com/)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2016%20App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 Project Overview
**NagrikSeva AI** is an intelligent, multilingual digital public infrastructure platform built for the **GDG Build with AI: Code for Communities 2.0 Hackathon**. It empowers rural, semi-urban, and elderly citizens across India (specifically Gujarat) to discover, understand, and apply for government schemes, track real-time applications, and locate citizen service centers without digital barriers.

---

## 🚨 The Core Problems We Solve

1. **Information Asymmetry & Language Barriers:** Government portals are often dense, bureaucratic, and in complex English. Rural citizens cannot easily identify benefits.
2. **"Am I Eligible?" Dilemma:** Citizens waste days visiting offices only to find out they don't qualify.
3. **Missing Documents & Rejected Applications:** Incomplete document submissions cause high rejection rates.
4. **Digital Literacy Barrier:** Elderly and rural citizens who cannot type on a keyboard are left behind.
5. **Office Navigation & Citizen Services:** Citizens don't know which local Mamlatdar or Jan Seva Kendra handles their exact service.

---

## ✨ Key Features & Solutions

### 1. 🤖 Conversational AI Assistant (Gujarati, Hindi & English)
- Powered by **Google Gemini 1.5 Flash** with specialized system instructions on Indian welfare schemes (PM Kisan, Ayushman Bharat, Mudra, PM Awas, etc.).
- Answers citizen queries naturally in their regional language with concise bullet points and official helpline guidance.

### 2. 🎙️ Voice Assistant (Speech-to-Text & Audio Output)
- **Voice Mic Input (🎙️):** Citizens can speak in Gujarati or Hindi; our speech recognition converts speech to text automatically.
- **Audio Read-Aloud (🔊):** Synthesizes natural regional speech so illiterate or elderly citizens can listen to the AI's answer without reading screen text.

### 3. 🎯 Smart Scheme Finder & Eligibility Matcher
- Interactive rule-based & AI calculator where citizens input their **Age, Gender, Annual Income, Occupation, and Category**.
- Instantly separates schemes into:
  - **100% Eligible Schemes (પાત્ર યોજનાઓ):** Shows personalized benefits and reason for eligibility.
  - **Ineligible Schemes:** Clearly highlights the exact criteria not met (e.g., income threshold exceeded, land record required).

### 4. 🗺️ Jan Seva Kendra & Government Office Locator
- Directory of Mamlatdar offices, Collectorates, and Common Service Centers (CSCs) across Gujarat districts (Rajkot, Ahmedabad, Surat, Vadodara).
- Displays office hours, contact numbers, list of services, and **one-click Google Maps navigation**.

### 5. 📄 Interactive Document Checklist & Guides
- Step-by-step guides for **Ration Cards, Aadhaar Updates, PAN Cards, and Health Cards**.
- Interactive checkboxes allowing citizens to tick off documents before visiting government offices.

### 6. 🔍 Real-Time Application Status Tracker
- Direct integration with **Google Cloud Firestore** to query application progress (`APP001`, `APP002`, `APP003`, `APP004`) with real-time status and departmental remarks.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                   CITIZEN USER INTERFACE                    │
│   Responsive Mobile / Web UI (Next.js 16 + Tailwind CSS)    │
│  ┌─────────────────┬──────────────────┬──────────────────┐  │
│  │ Voice & Text AI │ Eligibility Math │ Office Locator   │  │
│  │ Document Guides │ Status Tracker   │ Scheme Directory │  │
│  └─────────────────┴──────────────────┴──────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │
               API Routes (Edge & Serverless)
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│       Google Gemini AI       │        │    Google Cloud Firestore    │
│  - Gemini 1.5 Flash Model    │        │  - schemes collection        │
│  - System Prompt Governance  │        │  - applications collection   │
│  - Multilingual Translation  │        │  - meta statistics           │
└──────────────────────────────┘        └──────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend & App Framework:** Next.js 16.3 (App Router, Turbopack, React 19)
- **Styling & Design System:** Tailwind CSS, Lucide React Icons
- **Generative AI:** Google Gemini 1.5 Flash (`@google/generative-ai`)
- **Cloud Database:** Google Firebase Cloud Firestore (`firebase`, `firebase-admin`)
- **Speech Technologies:** Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
- **Deployment Platform:** Vercel / Firebase Hosting

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/hkPateL26/GDG.git
cd GDG
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
# Google Gemini API
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# Firebase Web Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Seed the Database
```bash
node scripts/seed-firestore-web.mjs
```

### 5. Run the Local Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 👨‍💻 Team Details
- **Hackathon:** Build with AI: Code for Communities 2.0 (GDG Rajkot)
- **Domain:** AI for Digital Public Infrastructure & Governance
- **College:** Atmiya University, Rajkot
- **Repository:** [https://github.com/hkPateL26/GDG](https://github.com/hkPateL26/GDG)
