import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";

const rootDir = "D:\\Movies and Web se\\atmiya";
const shotsDir = path.join(rootDir, "perfect_screenshots");
const teamLogoPath = path.join(rootDir, "team_logo.jpg");

const s1_home = path.join(shotsDir, "01_home_hero.png");
const s2_chat = path.join(shotsDir, "02_voice_chat.png");
const s3_otp = path.join(shotsDir, "03_login_otp.png");
const s4_track = path.join(shotsDir, "04_track_vault.png");
const s5_doc = path.join(shotsDir, "05_doc_portal.png");
const s6_admin = path.join(shotsDir, "06_officer_admin.png");
const s7_benefit = path.join(shotsDir, "07_benefit_calculator.png");
const s8_locator = path.join(shotsDir, "08_kacheri_locator.png");
const s10_receipt = path.join(shotsDir, "10_receipt_or_detail.png");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Team JustCode (Hari Patel & Jeet)";
pptx.company = "Atmiya University, Rajkot - GDG Hackathon 2026";
pptx.title = "NagrikSeva AI - End-to-End Product & Governance Deck";

// Color Palette
const C_ORANGE = "EA580C"; // Saffron
const C_AMBER = "F59E0B";  // Gold
const C_GREEN = "059669";  // Emerald Green
const C_NAVY = "0F172A";   // Deep Slate Navy
const C_SLATE = "475569";  // Medium Slate
const C_LIGHT = "F8FAFC";  // Light Background
const C_WHITE = "FFFFFF";

// Helper for standard slide header
function addHeader(slide, category, title, dark = false) {
  // Top brand bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 0.1,
    fill: { color: C_ORANGE }
  });

  slide.addText(category.toUpperCase(), {
    x: 0.6, y: 0.25, w: 10, h: 0.25,
    fontSize: 9.5, bold: true, color: dark ? C_AMBER : C_ORANGE, fontFace: "Segoe UI"
  });

  slide.addText(title, {
    x: 0.6, y: 0.5, w: 11.5, h: 0.5,
    fontSize: 19, bold: true, color: dark ? C_WHITE : C_NAVY, fontFace: "Segoe UI"
  });

  // Footer
  slide.addText("NagrikSeva AI  |  Team JustCode (Hari Patel & Jeet)  |  GDG Build with AI 2.0", {
    x: 0.6, y: 7.15, w: 9, h: 0.25,
    fontSize: 8.5, color: dark ? "64748B" : "94A3B8", fontFace: "Segoe UI"
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 1: Title & Vision
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_NAVY };

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 0.12,
    fill: { color: C_ORANGE }
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 0.5, w: 4.8, h: 0.38, r: 0.15,
    fill: { color: "1E293B" }, line: { color: C_AMBER, width: 1.2 }
  });
  slide.addText("⚡ GDG Build with AI: Code for Communities 2.0", {
    x: 0.6, y: 0.5, w: 4.8, h: 0.38,
    fontSize: 10.5, bold: true, color: C_AMBER, align: "center", fontFace: "Segoe UI"
  });

  slide.addText("NagrikSeva AI", {
    x: 0.6, y: 1.0, w: 8.5, h: 0.9,
    fontSize: 40, bold: true, color: C_WHITE, fontFace: "Segoe UI"
  });
  slide.addText("(નાગરિકસેવા AI — AI-Powered Digital Public Infrastructure)", {
    x: 0.6, y: 1.8, w: 8.5, h: 0.45,
    fontSize: 18, bold: true, color: C_AMBER, fontFace: "Segoe UI"
  });

  slide.addText("A Next-Generation Citizen Governance Platform bridging 70M+ citizens to public welfare entitlements. Integrating Multilingual Voice AI, Gemini Vision Document Scrutiny, and Mamlatdar Officer Workflows.", {
    x: 0.6, y: 2.35, w: 8.5, h: 0.85,
    fontSize: 12.5, color: "CBD5E1", fontFace: "Segoe UI", lineSpacing: 18
  });

  // Team Box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 3.4, w: 5.5, h: 2.1, r: 0.15,
    fill: { color: "1E293B" }, line: { color: C_ORANGE, width: 1.5 }
  });
  slide.addText("DEVELOPED BY: TEAM JUSTCODE", {
    x: 0.85, y: 3.55, w: 5.0, h: 0.3,
    fontSize: 11, bold: true, color: C_ORANGE, fontFace: "Segoe UI"
  });
  slide.addText("• Hari Patel — AI & Full-Stack Lead\n• Jeet — Systems & UI/UX Lead\nInstitution: Atmiya University, Rajkot\nTrack: AI for Digital Public Infrastructure (DPI)", {
    x: 0.85, y: 3.9, w: 5.0, h: 1.45,
    fontSize: 11, color: C_WHITE, fontFace: "Segoe UI", lineSpacing: 18
  });

  // Core Google Tech Badges
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 5.7, w: 12.1, h: 0.9, r: 0.15,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 }
  });
  slide.addText("CORE TECH STACK:  Google Gemini 1.5 Flash (Vision & Chat)  •  Cloud Firestore  •  Next.js 16  •  Web Speech API  •  Tailwind CSS v4", {
    x: 0.85, y: 5.9, w: 11.6, h: 0.5,
    fontSize: 11, bold: true, color: "38BDF8", fontFace: "Segoe UI"
  });

  if (fs.existsSync(teamLogoPath)) {
    slide.addImage({
      path: teamLogoPath,
      x: 9.6, y: 1.3, w: 2.9, h: 2.9,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 2: The Human Story (Before vs After)
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addHeader(slide, "The Human Story & Empathy", "The Agony of the Physical Queue vs. The Power of NagrikSeva AI");

  // BEFORE BOX (Old Broken System)
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.2, w: 5.9, h: 5.6, r: 0.15,
    fill: { color: "FEF2F2" }, line: { color: "EF4444", width: 2 }
  });
  slide.addText("❌ BEFORE: The Legacy Reality (પહેલાંની મુશ્કેલીઓ)", {
    x: 0.85, y: 1.4, w: 5.4, h: 0.4,
    fontSize: 13, bold: true, color: "DC2626", fontFace: "Segoe UI"
  });

  const beforePoints = [
    { title: "☀️ 42°C Heat & 4-Hour Queues:", desc: "Villagers travel 25 km to Mamlatdar Kacheri and stand in queues from 7 AM just to get basic service tokens." },
    { title: "💸 Daily Wage Loss (₹500/day):", desc: "Laborers and farmers lose daily wages every time they visit government offices for status inquiries." },
    { title: "📄 40% Document Rejections:", desc: "After 20 days of waiting, applications are rejected because the clerk notes a blurry photo or a marksheet instead of LC." },
    { title: "🤝 Middlemen & Cyber-Café Charges:", desc: "Uneducated citizens pay ₹200 to ₹500 to brokers who fill simple forms incorrectly." }
  ];
  beforePoints.forEach((p, i) => {
    const y = 1.9 + i * 1.15;
    slide.addText(p.title, {
      x: 0.85, y, w: 5.4, h: 0.3,
      fontSize: 11, bold: true, color: "991B1B", fontFace: "Segoe UI"
    });
    slide.addText(p.desc, {
      x: 0.85, y: y + 0.28, w: 5.4, h: 0.75,
      fontSize: 10, color: "7F1D1D", fontFace: "Segoe UI"
    });
  });

  // AFTER BOX (NagrikSeva AI Advantage)
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.2, w: 5.9, h: 5.6, r: 0.15,
    fill: { color: "ECFDF5" }, line: { color: "10B981", width: 2 }
  });
  slide.addText("✔ AFTER: NagrikSeva AI (નાગરિકસેવા AI નો લાભ)", {
    x: 7.05, y: 1.4, w: 5.4, h: 0.4,
    fontSize: 13, bold: true, color: "059669", fontFace: "Segoe UI"
  });

  const afterPoints = [
    { title: "📱 1-Minute Service from Home Mobile:", desc: "Citizens access all 33 Gujarat districts' schemes from their mobile phones without travelling anywhere." },
    { title: "🎙️ Native Gujarati Voice AI Assistance:", desc: "Illiterate citizens simply tap the mic, speak in Gujarati, and hear spoken answers (Audio Read-Aloud)." },
    { title: "⚡ Instant 3-Second AI Document Scrutiny:", desc: "Gemini Vision catches incorrect marksheets or blurry photos immediately before submission." },
    { title: "📜 Official QR Digital Slip & ₹0 Cost:", desc: "Instant downloadable receipt with QR verification, SMS updates, and 100% free digital governance." }
  ];
  afterPoints.forEach((p, i) => {
    const y = 1.9 + i * 1.15;
    slide.addText(p.title, {
      x: 7.05, y, w: 5.4, h: 0.3,
      fontSize: 11, bold: true, color: "065F46", fontFace: "Segoe UI"
    });
    slide.addText(p.desc, {
      x: 7.05, y: y + 0.28, w: 5.4, h: 0.75,
      fontSize: 10, color: "064E3B", fontFace: "Segoe UI"
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 3: End-to-End Citizen & Officer Workflow
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_NAVY };
  addHeader(slide, "System Architecture", "End-to-End Governance Workflow: From Mobile to Mamlatdar", true);

  const steps = [
    { num: "01", title: "OTP Login Shield", desc: "Mobile + Aadhaar Last 4\nInstant 6-digit OTP\nZero password friction", color: "38BDF8" },
    { num: "02", title: "Voice & AI Inquiry", desc: "Gujarati Speech-to-Text\nGemini 1.5 Flash Chat\nLive Audio Read-Aloud", color: C_AMBER },
    { num: "03", title: "AI Doc Scrutiny", desc: "Gemini Vision OCR\nMismatch detection\nQuality score (0-100%)", color: "34D399" },
    { num: "04", title: "Official Receipt", desc: "Government seal & QR\nCyber treasury payment\nInstant PDF generation", color: "F472B6" },
    { num: "05", title: "Mamlatdar Scrutiny", desc: "Officer dashboard (/admin)\nAI-verified badge\n1-click DBT approval", color: "A78BFA" }
  ];

  steps.forEach((s, idx) => {
    const x = 0.6 + idx * 2.45;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.3, w: 2.3, h: 3.2, r: 0.15,
      fill: { color: "1E293B" }, line: { color: s.color, width: 1.5 }
    });

    slide.addText(s.num, {
      x: x + 0.15, y: 1.5, w: 2.0, h: 0.5,
      fontSize: 24, bold: true, color: s.color, fontFace: "Segoe UI"
    });

    slide.addText(s.title, {
      x: x + 0.15, y: 2.05, w: 2.0, h: 0.5,
      fontSize: 12, bold: true, color: C_WHITE, fontFace: "Segoe UI"
    });

    slide.addText(s.desc, {
      x: x + 0.15, y: 2.65, w: 2.0, h: 1.6,
      fontSize: 10, color: "CBD5E1", fontFace: "Segoe UI", lineSpacing: 16
    });
  });

  // Bottom Flow Banner
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 4.8, w: 12.1, h: 2.0, r: 0.15,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 }
  });

  slide.addText("LIVE DATA PIPELINE:", {
    x: 0.9, y: 4.95, w: 4.0, h: 0.3,
    fontSize: 10.5, bold: true, color: C_AMBER, fontFace: "Segoe UI"
  });
  slide.addText("Citizen speaks/uploads &rarr; Web Speech API + Next.js Edge &rarr; Google Gemini 1.5 Flash (Vision & Text) &rarr; Cloud Firestore live persistence &rarr; Mamlatdar Officer Review with SLA tracking &rarr; Direct Benefit Transfer (DBT) disbursement & SMS alert.", {
    x: 0.9, y: 5.3, w: 11.5, h: 1.3,
    fontSize: 11, color: "E2E8F0", fontFace: "Segoe UI", lineSpacing: 18
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 4: Step 1 - Citizen OTP Login Shield
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addHeader(slide, "Workflow Step 1", "Citizen OTP Login Shield: Secure, Passwordless Authentication");

  // Left explanation
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.2, w: 5.0, h: 5.6, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });

  slide.addText("🔐 Built for Rural Simplicity", {
    x: 0.85, y: 1.45, w: 4.5, h: 0.35,
    fontSize: 14, bold: true, color: C_NAVY, fontFace: "Segoe UI"
  });

  const otpFeatures = [
    { title: "No Passwords to Remember:", desc: "Rural citizens frequently forget passwords. Authentication is powered by Mobile Number + Aadhaar Last 4 digits." },
    { title: "Instant 6-Digit OTP Simulation:", desc: "Automated OTP SMS generation with a 180-second countdown and 3-attempt safety lock." },
    { title: "Citizen Ledger Auto-Fetch:", desc: "Instantly links to applicant profile (e.g. Ramesh Patel, Rajkot, Gondal), pulling land records, family income, and past schemes." },
    { title: "Role-Based Gateway:", desc: "Clean toggle between Citizen Portal and Mamlatdar / Talati Revenue Officer login." }
  ];

  otpFeatures.forEach((f, i) => {
    const y = 1.95 + i * 1.15;
    slide.addText(`✔ ${f.title}`, {
      x: 0.85, y, w: 4.5, h: 0.3,
      fontSize: 11, bold: true, color: C_ORANGE, fontFace: "Segoe UI"
    });
    slide.addText(f.desc, {
      x: 1.05, y: y + 0.28, w: 4.3, h: 0.75,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI"
    });
  });

  // Right: Clean uncropped screenshot of OTP Login
  if (fs.existsSync(s3_otp)) {
    slide.addImage({
      path: s3_otp,
      x: 5.9, y: 1.2, w: 6.8, h: 5.6,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 5: Step 2 - Multilingual Voice Assistant & AI Chat
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addHeader(slide, "Workflow Step 2", "Multilingual Voice Engine & Conversational AI (Gemini 1.5 Flash)");

  // Left explanation
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.2, w: 5.0, h: 5.6, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });

  slide.addText("🎙️ Voice-First for Non-Readers", {
    x: 0.85, y: 1.45, w: 4.5, h: 0.35,
    fontSize: 14, bold: true, color: C_NAVY, fontFace: "Segoe UI"
  });

  const voiceFeatures = [
    { title: "Native Gujarati Speech Recognition:", desc: "Citizens tap the mic (🎙️) and ask naturally: 'મારે રેશનકાર્ડમાં નામ ઉમેરવું છે' — Web Speech API converts to text." },
    { title: "Google Gemini 1.5 Flash Intelligence:", desc: "Trained on Gujarat government rules, eligibility criteria, required proofs, and official helplines." },
    { title: "Audio Read-Aloud Voice (🔊):", desc: "Synthesizes regional Gujarati speech output so elderly and illiterate citizens listen to answers without reading." },
    { title: "Live Application Tracking in Chat:", desc: "Type 'મારી અરજી APP-GUJ-8038 ટ્રેક કરો' — Chatbot queries Firestore and displays the live status card inside the chat!" }
  ];

  voiceFeatures.forEach((f, i) => {
    const y = 1.95 + i * 1.15;
    slide.addText(`✔ ${f.title}`, {
      x: 0.85, y, w: 4.5, h: 0.3,
      fontSize: 11, bold: true, color: C_GREEN, fontFace: "Segoe UI"
    });
    slide.addText(f.desc, {
      x: 1.05, y: y + 0.28, w: 4.3, h: 0.75,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI"
    });
  });

  // Right: Clean uncropped screenshot of Chatbot
  if (fs.existsSync(s2_chat)) {
    slide.addImage({
      path: s2_chat,
      x: 5.9, y: 1.2, w: 6.8, h: 5.6,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 6: Step 3 - Gemini Vision AI Document Scrutiny (HERO USP)
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addHeader(slide, "Workflow Step 3 (HERO USP)", "Gemini 1.5 Flash Vision OCR: Zero-Fraud Document Pre-Verification");

  // Left explanation
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.2, w: 5.0, h: 5.6, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });

  slide.addText("🛡️ Why No Other Portal Has This", {
    x: 0.85, y: 1.45, w: 4.5, h: 0.35,
    fontSize: 14, bold: true, color: C_NAVY, fontFace: "Segoe UI"
  });

  const docFeatures = [
    { title: "Strict Type Mismatch Detection:", desc: "If expected proof is 'Birth Certificate' and applicant uploads a 'Marksheet', AI immediately blocks submission (Score: 15%)." },
    { title: "Quality & Blur Scoring (0-100%):", desc: "Audits image blurriness, readability, light blue/white photo backgrounds, and government compliance standards." },
    { title: "Clear Gujarati Actionable Advice:", desc: "Outputs actionable guidance: '❌ ખોટો દસ્તાવેજ: માર્કશીટ જન્મના પુરાવા તરીકે ચાલશે નહીં. જન્મનો દાખલો અથવા LC મૂકો.'" },
    { title: "Saves 15 Days & Government Scrutiny:", desc: "Solves the #1 reason for application rejection before the file ever reaches the Mamlatdar's desk!" }
  ];

  docFeatures.forEach((f, i) => {
    const y = 1.95 + i * 1.15;
    slide.addText(`✔ ${f.title}`, {
      x: 0.85, y, w: 4.5, h: 0.3,
      fontSize: 11, bold: true, color: "DC2626", fontFace: "Segoe UI"
    });
    slide.addText(f.desc, {
      x: 1.05, y: y + 0.28, w: 4.3, h: 0.75,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI"
    });
  });

  // Right: Clean uncropped screenshot of Document Portal
  if (fs.existsSync(s5_doc)) {
    slide.addImage({
      path: s5_doc,
      x: 5.9, y: 1.2, w: 6.8, h: 5.6,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 7: Step 4 - Real-Time Application Tracking Vault
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addHeader(slide, "Workflow Step 4", "Citizen Track Vault: Real-Time Status, SLA Timelines & History");

  // Left explanation
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.2, w: 5.0, h: 5.6, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });

  slide.addText("📊 Complete Transparency for Citizens", {
    x: 0.85, y: 1.45, w: 4.5, h: 0.35,
    fontSize: 14, bold: true, color: C_NAVY, fontFace: "Segoe UI"
  });

  const trackFeatures = [
    { title: "Unified Multi-Scheme Dashboard:", desc: "Citizens view all active applications (PM Kisan, Ayushman, Ration Card, Aadhaar) in one single vault." },
    { title: "Color-Coded Status Lifecycles:", desc: "Approved (DBT Disbursed), In Verification (ચકાસણી ચાલુ), Field Verification Pending, or Returned for Correction." },
    { title: "Service Level Agreement (SLA) Tracker:", desc: "Shows exact days remaining under Gujarat Citizen Charter (Right to Public Services)." },
    { title: "Officer Remarks & 1-Click Reapply:", desc: "If returned, citizen reads Mamlatdar's Gujarati remarks and re-applies with updated proofs in 1 click." }
  ];

  trackFeatures.forEach((f, i) => {
    const y = 1.95 + i * 1.15;
    slide.addText(`✔ ${f.title}`, {
      x: 0.85, y, w: 4.5, h: 0.3,
      fontSize: 11, bold: true, color: "2563EB", fontFace: "Segoe UI"
    });
    slide.addText(f.desc, {
      x: 1.05, y: y + 0.28, w: 4.3, h: 0.75,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI"
    });
  });

  // Right: Clean uncropped screenshot of Track Vault
  if (fs.existsSync(s4_track)) {
    slide.addImage({
      path: s4_track,
      x: 5.9, y: 1.2, w: 6.8, h: 5.6,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 8: Step 5 - Official Government Receipt Slip & Certified Output
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addHeader(slide, "Workflow Step 5", "Official Government Receipt Slip & Certified Digital Output");

  // Left explanation
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.2, w: 5.0, h: 5.6, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });

  slide.addText("📜 Legal Government Acknowledgement", {
    x: 0.85, y: 1.45, w: 4.5, h: 0.35,
    fontSize: 14, bold: true, color: C_NAVY, fontFace: "Segoe UI"
  });

  const receiptFeatures = [
    { title: "Official State Emblem & Barcode:", desc: "Renders Government of Gujarat Emblem, ATVT logo, Application ID (GJ-DPI-2026-APP...), and official barcode." },
    { title: "Tamper-Proof QR Code Verification:", desc: "Anyone scanning the QR code with a phone camera is directed to the live government verification URL." },
    { title: "Cyber Treasury / Challan Integration:", desc: "Contains UPI / Bharat QR transaction IDs, Cyber Treasury SBI gateway ref, or Jan Seva cash counter challan numbers." },
    { title: "High-Fidelity A4 Printable Output:", desc: "High-resolution isolated A4 print engine matching official revenue department receipts." }
  ];

  receiptFeatures.forEach((f, i) => {
    const y = 1.95 + i * 1.15;
    slide.addText(`✔ ${f.title}`, {
      x: 0.85, y, w: 4.5, h: 0.3,
      fontSize: 11, bold: true, color: C_ORANGE, fontFace: "Segoe UI"
    });
    slide.addText(f.desc, {
      x: 1.05, y: y + 0.28, w: 4.3, h: 0.75,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI"
    });
  });

  // Right: Clean uncropped screenshot of Receipt / Detail Modal
  if (fs.existsSync(s10_receipt)) {
    slide.addImage({
      path: s10_receipt,
      x: 5.9, y: 1.2, w: 6.8, h: 5.6,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 9: Step 6 - Officer Scrutiny Portal & AI Governance Monitoring
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addHeader(slide, "Workflow Step 6", "Mamlatdar & Talati Scrutiny Portal (/admin) with AI Monitoring");

  // Left explanation
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.2, w: 5.0, h: 5.6, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });

  slide.addText("🏛️ Empowering Administrative Officers", {
    x: 0.85, y: 1.45, w: 4.5, h: 0.35,
    fontSize: 14, bold: true, color: C_NAVY, fontFace: "Segoe UI"
  });

  const officerFeatures = [
    { title: "Taluka/District Jurisdiction Filter:", desc: "Officers (e.g. H. V. Patel, GAS - Gondal Mamlatdar) filter applications solely in their administrative jurisdiction." },
    { title: "AI Pre-Scrutiny Badge & Quality Score:", desc: "Mamlatdars immediately see Gemini's pre-computed document quality score, reducing scrutiny time by 75%." },
    { title: "SLA Breach Monitoring & Backlog Alerts:", desc: "Flags files exceeding 7 days, preventing bureaucratic inertia and ensuring compliance with Citizen Charters." },
    { title: "1-Click Direct Benefit Transfer (DBT):", desc: "Instant approval dispatches DBT welfare funds and sends immediate SMS confirmation to the beneficiary." }
  ];

  officerFeatures.forEach((f, i) => {
    const y = 1.95 + i * 1.15;
    slide.addText(`✔ ${f.title}`, {
      x: 0.85, y, w: 4.5, h: 0.3,
      fontSize: 11, bold: true, color: "7C3AED", fontFace: "Segoe UI"
    });
    slide.addText(f.desc, {
      x: 1.05, y: y + 0.28, w: 4.3, h: 0.75,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI"
    });
  });

  // Right: Clean uncropped screenshot of Officer Scrutiny
  if (fs.existsSync(s6_admin)) {
    slide.addImage({
      path: s6_admin,
      x: 5.9, y: 1.2, w: 6.8, h: 5.6,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 10: Step 7 - Family Benefit Calculator & Smart GPS Locator
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addHeader(slide, "Workflow Step 7", "Family Welfare Benefit Calculator & Smart Jan Seva GPS Locator");

  // Top Left Box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.2, w: 5.9, h: 1.6, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });
  slide.addText("💰 Family Benefit Math & WhatsApp Pass", {
    x: 0.8, y: 1.35, w: 5.5, h: 0.3,
    fontSize: 12.5, bold: true, color: C_GREEN, fontFace: "Segoe UI"
  });
  slide.addText("Calculates consolidated entitlements across household members (e.g. ₹5,25,000 via Ayushman + PM Kisan + Awas) and produces a digital WhatsApp Pass with QR code.", {
    x: 0.8, y: 1.7, w: 5.5, h: 0.95,
    fontSize: 10.5, color: C_SLATE, fontFace: "Segoe UI"
  });

  // Top Right Box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.2, w: 5.9, h: 1.6, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });
  slide.addText("📍 Smart Jan Seva Kendra / Kacheri GPS Locator", {
    x: 7.0, y: 1.35, w: 5.5, h: 0.3,
    fontSize: 12.5, bold: true, color: C_ORANGE, fontFace: "Segoe UI"
  });
  slide.addText("Comprehensive GPS directory of Mamlatdar offices, Collectorates & CSC centers across all 33 Gujarat districts with operating hours, officer contacts, and 1-click Google Maps routing.", {
    x: 7.0, y: 1.7, w: 5.5, h: 0.95,
    fontSize: 10.5, color: C_SLATE, fontFace: "Segoe UI"
  });

  // Screenshots side-by-side
  if (fs.existsSync(s7_benefit)) {
    slide.addImage({
      path: s7_benefit,
      x: 0.6, y: 3.0, w: 5.9, h: 3.8,
      sizing: { type: "contain" }
    });
  }
  if (fs.existsSync(s8_locator)) {
    slide.addImage({
      path: s8_locator,
      x: 6.8, y: 3.0, w: 5.9, h: 3.8,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 11: Competitive Benchmarking vs Real Govt Systems
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addHeader(slide, "Market Analysis", "Competitive Reality Check: Why NagrikSeva AI Surpasses Existing Portals");

  const tableHeaders = [
    { text: "Core Capability", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE } },
    { text: "myScheme (MeitY)", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE } },
    { text: "Digital Gujarat Portal", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE } },
    { text: "Jugalbandi AI (WhatsApp)", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE } },
    { text: "NagrikSeva AI (Our Platform)", options: { bold: true, fill: { color: C_ORANGE }, color: C_WHITE } }
  ];

  const tableRows = [
    [
      { text: "Pre-submission AI Doc Scrutiny", options: { bold: true } },
      { text: "❌ None (No upload)" },
      { text: "❌ Blind upload (Manual review)" },
      { text: "❌ None (Text only)" },
      { text: "✔ Gemini Vision OCR (Instant)", options: { bold: true, color: C_GREEN } }
    ],
    [
      { text: "Native Gujarati Voice Engine", options: { bold: true } },
      { text: "❌ None" },
      { text: "❌ None" },
      { text: "✔ WhatsApp audio note" },
      { text: "✔ Live Speech-to-Text & Audio", options: { bold: true, color: C_GREEN } }
    ],
    [
      { text: "Dual Citizen + Mamlatdar Portal", options: { bold: true } },
      { text: "❌ None (External redirect)" },
      { text: "✔ Traditional manual backoffice" },
      { text: "❌ None" },
      { text: "✔ AI-Assisted Scrutiny & SLA", options: { bold: true, color: C_GREEN } }
    ],
    [
      { text: "Live Tracking inside AI Chat", options: { bold: true } },
      { text: "❌ None" },
      { text: "❌ Separate manual search" },
      { text: "❌ None" },
      { text: "✔ Instant query response in chat", options: { bold: true, color: C_GREEN } }
    ],
    [
      { text: "Household Benefit Math & Pass", options: { bold: true } },
      { text: "❌ Individual schemes only" },
      { text: "❌ Individual schemes" },
      { text: "❌ None" },
      { text: "✔ Full Family Math + QR Pass", options: { bold: true, color: C_GREEN } }
    ],
    [
      { text: "33-District GPS Kacheri Locator", options: { bold: true } },
      { text: "❌ None" },
      { text: "❌ Static text PDF" },
      { text: "❌ None" },
      { text: "✔ GPS Routing & Live Timing", options: { bold: true, color: C_GREEN } }
    ]
  ];

  slide.addTable([tableHeaders, ...tableRows], {
    x: 0.6, y: 1.3, w: 12.1, h: 5.4,
    colW: [2.9, 2.2, 2.3, 2.3, 2.4],
    fontSize: 10,
    fontFace: "Segoe UI",
    align: "center",
    valign: "middle",
    border: { pt: 1, color: "CBD5E1" }
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 12: Team JustCode, Demo & Conclusion
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_NAVY };
  addHeader(slide, "The Builders", "Team JustCode: Code for Community Impact", true);

  const team = [
    {
      name: "Hari Patel",
      role: "AI & Full-Stack Lead",
      tasks: "• Designed Google Gemini 1.5 Flash multimodal pipeline\n• Built strict Vision Document Verification API (/api/verify-doc)\n• Engineered Cloud Firestore application tracking vault\n• Integrated native Web Speech API voice synthesis & mic",
      college: "Atmiya University, Rajkot"
    },
    {
      name: "Jeet",
      role: "Systems & UI/UX Lead",
      tasks: "• Designed Dual Persona (Citizen & Mamlatdar Scrutiny) Portals\n• Built Family Welfare Entitlement Calculator & WhatsApp Pass\n• Engineered 33-district Gujarat Jan Seva GPS directory\n• Crafted responsive Gujarati Design System & receipt generator",
      college: "Atmiya University, Rajkot"
    }
  ];

  team.forEach((m, idx) => {
    const x = 0.6 + idx * 6.2;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.3, w: 5.9, h: 3.8, r: 0.2,
      fill: { color: "1E293B" }, line: { color: idx === 0 ? C_ORANGE : "38BDF8", width: 1.5 }
    });
    slide.addText(m.name, {
      x: x + 0.4, y: 1.6, w: 5.1, h: 0.45,
      fontSize: 22, bold: true, color: C_WHITE, fontFace: "Segoe UI"
    });
    slide.addText(m.role, {
      x: x + 0.4, y: 2.1, w: 5.1, h: 0.35,
      fontSize: 13, bold: true, color: idx === 0 ? C_AMBER : "38BDF8", fontFace: "Segoe UI"
    });
    slide.addText(m.college, {
      x: x + 0.4, y: 2.45, w: 5.1, h: 0.35,
      fontSize: 10.5, color: "94A3B8", fontFace: "Segoe UI"
    });
    slide.addText(m.tasks, {
      x: x + 0.4, y: 2.9, w: 5.1, h: 2.0,
      fontSize: 10.5, color: "E2E8F0", fontFace: "Segoe UI", lineSpacing: 18
    });
  });

  // Bottom Links
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 5.3, w: 12.1, h: 1.6, r: 0.15,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 }
  });
  slide.addText("HACKATHON SUBMISSION ARTIFACTS:", {
    x: 0.9, y: 5.45, w: 5.0, h: 0.3,
    fontSize: 11, bold: true, color: C_AMBER, fontFace: "Segoe UI"
  });
  slide.addText("• GitHub Repository: https://github.com/hkPateL26/GDG\n• Live Prototype: http://localhost:3000 (NagrikSeva AI)\n• GDG Track: Build with AI: Code for Communities 2.0 (Rajkot)\n• Thank you for empowering communities through Google AI! 🙏", {
    x: 0.9, y: 5.8, w: 11.5, h: 0.95,
    fontSize: 11, color: C_WHITE, fontFace: "Segoe UI", lineSpacing: 17
  });
}

// Write the PPTX file
const outPptxPath = path.join(rootDir, "NagrikSeva_AI_Official_Presentation.pptx");
pptx.writeFile({ fileName: outPptxPath })
  .then(() => {
    console.log("Successfully generated comprehensive PPTX at: " + outPptxPath);
  })
  .catch((err) => {
    console.error("Error writing PPTX:", err);
  });
