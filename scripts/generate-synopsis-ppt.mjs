// =========================================================================
// NAGRIKSEVA AI — OFFICIAL SYNOPSIS PPT GENERATOR
// Seva First Innovation Challenge (SFIC 2026-27 / SSIP 2.0 - Govt. of Gujarat)
// Format strictly complies with official 8-slide synopsis template
// =========================================================================

import pptxgen from "pptxgenjs";
import path from "path";

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9"; // 10 x 5.625 inches
pptx.author = "Hari Patel";
pptx.company = "Atmiya University - NagrikSeva AI Team (TM000826)";
pptx.title = "NagrikSeva AI - Official Synopsis SFIC 2026";
pptx.subject = "Seva First Innovation Challenge 2026 Synopsis Presentation";

// Common Styling Constants
const FONT_PRIMARY = "Arial";
const COLOR_NAVY = "0F172A";
const COLOR_SAFFRON = "EA580C";
const COLOR_GREEN = "059669";
const COLOR_BLUE = "0284C7";
const COLOR_MUTED = "475569";
const COLOR_LIGHT_BG = "F8FAFC";
const COLOR_BORDER = "CBD5E1";

// Helper: Add Standard Top Header to slides 2-8
function addStandardHeader(slide, sectionTag, subtitleText) {
  // Top Banner Bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.38,
    fill: { color: "0F172A" },
  });

  slide.addText("Education Dept, Govt. of Gujarat • SSIP 2.0", {
    x: 0.4,
    y: 0.05,
    w: 5.5,
    h: 0.28,
    fontSize: 9.5,
    fontFace: FONT_PRIMARY,
    color: "EA580C",
    bold: true,
  });

  slide.addText("PROBLEM STATEMENT CODE: PS0001  |  TEAM ID: TM000826", {
    x: 5.5,
    y: 0.05,
    w: 4.1,
    h: 0.28,
    fontSize: 9.5,
    fontFace: FONT_PRIMARY,
    color: "F8FAFC",
    align: "right",
    bold: true,
  });

  // Section Tag & Title
  slide.addText(sectionTag, {
    x: 0.4,
    y: 0.45,
    w: 9.2,
    h: 0.35,
    fontSize: 16,
    fontFace: FONT_PRIMARY,
    color: COLOR_NAVY,
    bold: true,
  });

  slide.addText(subtitleText, {
    x: 0.4,
    y: 0.8,
    w: 9.2,
    h: 0.25,
    fontSize: 10,
    fontFace: FONT_PRIMARY,
    color: COLOR_SAFFRON,
    bold: true,
  });

  // Subtle separator line
  slide.addShape(pptx.ShapeType.line, {
    x: 0.4,
    y: 1.08,
    w: 9.2,
    h: 0,
    line: { color: "E2E8F0", width: 1 },
  });
}

// =========================================================================
// SLIDE 1: Title Slide & Team Dossier
// =========================================================================
{
  const slide = pptx.addSlide();

  // Top Bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.4,
    fill: { color: "0F172A" },
  });

  slide.addText("Education Dept, Govt. of Gujarat • SSIP 2.0", {
    x: 0.5,
    y: 0.05,
    w: 5.0,
    h: 0.3,
    fontSize: 10,
    fontFace: FONT_PRIMARY,
    color: "EA580C",
    bold: true,
  });

  slide.addText("PROBLEM STATEMENT CODE: PS0001", {
    x: 5.2,
    y: 0.05,
    w: 4.3,
    h: 0.3,
    fontSize: 10,
    fontFace: FONT_PRIMARY,
    color: "FFFFFF",
    align: "right",
    bold: true,
  });

  // Official Badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 0.65,
    w: 5.5,
    h: 0.35,
    fill: { color: "FEF3C7" },
    line: { color: "F59E0B", width: 1 },
    rectRadius: 0.08,
  });
  slide.addText("SEVA FIRST INNOVATION CHALLENGE 2026 • OFFICIAL SYNOPSIS", {
    x: 0.6,
    y: 0.7,
    w: 5.3,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_PRIMARY,
    color: "B45309",
    bold: true,
  });

  // Project Title
  slide.addText("NagrikSeva AI: Multimodal AI-Powered Digital Public Infrastructure", {
    x: 0.5,
    y: 1.15,
    w: 9.0,
    h: 0.55,
    fontSize: 18,
    fontFace: FONT_PRIMARY,
    color: COLOR_NAVY,
    bold: true,
  });

  slide.addText("Zero-Queue Vernacular Citizen Welfare Delivery and Predictive Statutory SLA Governance under GRTSA 2013", {
    x: 0.5,
    y: 1.7,
    w: 9.0,
    h: 0.45,
    fontSize: 13,
    fontFace: FONT_PRIMARY,
    color: COLOR_SAFFRON,
    bold: true,
  });

  // Mission Statement Box
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 2.25,
    w: 9.0,
    h: 0.75,
    fill: { color: "F1F5F9" },
    line: { color: "CBD5E1", width: 1 },
  });
  slide.addText(
    "Mission: Transforming citizen welfare and revenue service delivery across Gujarat's 18,225 villages through Gemini Vision AI pre-scrutiny, DigiLocker Rule 9A integration, 5-tier territorial administration, and predictive ML governance.",
    {
      x: 0.7,
      y: 2.32,
      w: 8.6,
      h: 0.6,
      fontSize: 10.5,
      fontFace: FONT_PRIMARY,
      color: "334155",
      italic: true,
    }
  );

  // 4 Team Dossier Metadata Cards
  const cardData = [
    { label: "TEAM ID", value: "TM000826", bg: "EFF6FF", border: "3B82F6", text: "1D4ED8" },
    { label: "TRACK CATEGORY", value: "College Track (Track 2: Open Innovation)", bg: "F0FDF4", border: "22C55E", text: "15803D" },
    { label: "INSTITUTION / ORGANIZATION", value: "Atmiya University, Rajkot, Gujarat", bg: "FFF7ED", border: "F97316", text: "C2410C" },
    { label: "TEAM LEADER", value: "Hari Patel (haripatel267998@gmail.com • +91 9974442291)", bg: "FAF5FF", border: "A855F7", text: "7E22CE" },
  ];

  cardData.forEach((c, idx) => {
    const x = 0.5 + (idx % 2) * 4.6;
    const y = 3.25 + Math.floor(idx / 2) * 1.05;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 4.4,
      h: 0.9,
      fill: { color: c.bg },
      line: { color: c.border, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText(c.label, {
      x: x + 0.2,
      y: y + 0.1,
      w: 4.0,
      h: 0.25,
      fontSize: 9,
      fontFace: FONT_PRIMARY,
      color: c.text,
      bold: true,
    });
    slide.addText(c.value, {
      x: x + 0.2,
      y: y + 0.35,
      w: 4.0,
      h: 0.45,
      fontSize: 10.5,
      fontFace: FONT_PRIMARY,
      color: COLOR_NAVY,
      bold: true,
    });
  });
}

// =========================================================================
// SLIDE 2: CHALLENGE DEFINITION
// =========================================================================
{
  const slide = pptx.addSlide();
  addStandardHeader(slide, "CHALLENGE DEFINITION", "Focus: Root Cause & Citizen Friction • Problem Statement & Real-World Context");

  // Left Card: The Ground Challenge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.4,
    y: 1.2,
    w: 4.45,
    h: 4.15,
    fill: { color: "FFFFFF" },
    line: { color: "CBD5E1", width: 1 },
    rectRadius: 0.08,
  });

  slide.addText("The Ground Challenge", {
    x: 0.6,
    y: 1.35,
    w: 4.0,
    h: 0.3,
    fontSize: 12,
    fontFace: FONT_PRIMARY,
    color: COLOR_NAVY,
    bold: true,
  });

  slide.addText(
    "• Severe Citizen Friction: Across Gujarat's 33 districts and 18,225 villages, 6.5+ Crore citizens face repeated bureaucratic friction accessing 57+ welfare schemes and 69 statutory revenue services (Income, Caste, 7/12, Ration).\n\n" +
    "• Travel Overhead & Wage Losses: Rural citizens must travel 15–40 km to Taluka Seva Sadans or Jan Seva Kendras (ATVT), standing in long physical queues and losing ₹350–500 in daily agricultural wages.\n\n" +
    "• High Document Rejection: 42% of citizen applications suffer rejection or multi-week delays due to unreadable photocopies, missing attested affidavits, or minor name spelling mismatches between Aadhaar and revenue records.\n\n" +
    "• Statutory SLA Breaches: Gujarat Right to Services Act (GRTSA 2013) mandates 3 to 30 days disposal, but manual office backlogs routinely breach deadlines without automated escalation.",
    {
      x: 0.6,
      y: 1.7,
      w: 4.05,
      h: 2.7,
      fontSize: 9.2,
      fontFace: FONT_PRIMARY,
      color: "334155",
      lineSpacingMultiple: 1.15,
    }
  );

  // Evidence Highlight Box
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55,
    y: 4.48,
    w: 4.15,
    h: 0.72,
    fill: { color: "EFF6FF" },
    line: { color: "93C5FD", width: 1 },
  });
  slide.addText("Evidence: Over 40% initial rejection rate at ATVT centers; 15-day average manual backlog across talukas; routine breaches of GRTSA 2013 legal citizen charters.", {
    x: 0.65,
    y: 4.52,
    w: 3.95,
    h: 0.62,
    fontSize: 8.5,
    fontFace: FONT_PRIMARY,
    color: "1E40AF",
    bold: true,
  });

  // Right Card: Target Beneficiaries & Flaws
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 5.15,
    y: 1.2,
    w: 4.45,
    h: 4.15,
    fill: { color: "FFFFFF" },
    line: { color: "CBD5E1", width: 1 },
    rectRadius: 0.08,
  });

  slide.addText("Target Beneficiaries & Existing Flaws", {
    x: 5.35,
    y: 1.35,
    w: 4.0,
    h: 0.3,
    fontSize: 12,
    fontFace: FONT_PRIMARY,
    color: COLOR_NAVY,
    bold: true,
  });

  slide.addText(
    "Target Beneficiaries:\n" +
    "• 6.5+ Crore Gujarat Citizens: Smallholder farmers (PM-Kisan, i-Khedut), students (scholarships), senior citizens, widowed women (Ganga Swarupa), construction workers (e-Nirman).\n" +
    "• Governance Stakeholders: Village Talati-cum-Mantris, Taluka Mamlatdars, SDMs (Prant Officers), District Collectors, and Sachivalaya IAS Officers.\n\n" +
    "Existing Flaws in Market / Legacy Portals:\n" +
    "• Blind Document Submission: Portals accept blurry photos blindly; defects are only discovered days later upon manual review.\n" +
    "• Linguistic & Tech Divide: Complex English portals alienate Gujarati vernacular citizens, driving them to exploitative cyber cafe agents.\n" +
    "• No Unified Family Ledger: Citizens repeatedly re-upload identical family proofs for every single dependent and scheme.",
    {
      x: 5.35,
      y: 1.7,
      w: 4.05,
      h: 2.7,
      fontSize: 9.2,
      fontFace: FONT_PRIMARY,
      color: "334155",
      lineSpacingMultiple: 1.15,
    }
  );

  // Gap Highlight Box
  slide.addShape(pptx.ShapeType.rect, {
    x: 5.3,
    y: 4.48,
    w: 4.15,
    h: 0.72,
    fill: { color: "FEF2F2" },
    line: { color: "FCA5A5", width: 1 },
  });
  slide.addText("Market Gap: Existing systems lack real-time AI OCR pre-scrutiny, mobile vernacular voice guidance, 5-tier territorial RBAC, and proactive machine learning delay forecasting.", {
    x: 5.4,
    y: 4.52,
    w: 3.95,
    h: 0.62,
    fontSize: 8.5,
    fontFace: FONT_PRIMARY,
    color: "991B1B",
    bold: true,
  });
}

// =========================================================================
// SLIDE 3: SOLUTION APPROACH
// =========================================================================
{
  const slide = pptx.addSlide();
  addStandardHeader(slide, "SOLUTION APPROACH", "Ethos: Frugal, Accessible, Scalable • Proposed Solution & Innovation Novelty");

  // Executive Summary Banner
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.4,
    y: 1.2,
    w: 9.2,
    h: 0.75,
    fill: { color: "F8FAFC" },
    line: { color: "0284C7", width: 1.5 },
  });
  slide.addText("HIGH-LEVEL EXECUTIVE SUMMARY", {
    x: 0.6,
    y: 1.25,
    w: 8.8,
    h: 0.2,
    fontSize: 8.5,
    fontFace: FONT_PRIMARY,
    color: "0284C7",
    bold: true,
  });
  slide.addText(
    "NagrikSeva AI is an enterprise-grade Digital Public Infrastructure (DPI) platform featuring a mobile-first vernacular citizen super-app paired with a 5-tier officer hierarchy workbench. It eliminates queues via 1-click DigiLocker document pulls, Gemini 2.5 Flash multimodal vision pre-scrutiny, and algorithmic GRTSA 2013 SLA countdown governance.",
    {
      x: 0.6,
      y: 1.45,
      w: 8.8,
      h: 0.45,
      fontSize: 9.5,
      fontFace: FONT_PRIMARY,
      color: COLOR_NAVY,
      bold: true,
    }
  );

  // 3 Innovation Pillars
  const pillars = [
    {
      title: "Core Novelty",
      sub: "Multimodal Vision AI Pre-Audit",
      color: "0284C7",
      bg: "F0F9FF",
      border: "BAE6FD",
      text: "Deterministic Gemini 2.5 Flash AI pre-scrutiny (/api/verify-doc) audits uploaded proofs for clarity (0-100 score), detects state seals/Ashok Stambh, extracts bilingual Gujarati/English text, and verifies applicant names before submission. Reduces rejection rates from 42% to <5%."
    },
    {
      title: "Technical Moat",
      sub: "Sub-Millisecond Edge Architecture",
      color: "EA580C",
      bg: "FFF7ED",
      border: "FFEDD5",
      text: "L1 in-memory LRU & Upstash Redis caching engine (<0.8ms latency), non-blocking Firestore timeout race protection (650ms), and a 6-month historical Linear Regression ML model (R² = 0.941) forecasting statewide intake surges and taluka-level delay risks."
    },
    {
      title: "\"Seva First\" Value",
      sub: "Grassroots Access & SLA Justice",
      color: "059669",
      bg: "F0FDF4",
      border: "BBF7D0",
      text: "100% free citizen access with authentic Gujarati voice synthesis, Kutumb Family Ledger, live & test Razorpay UPI/Cards payments, Cyber Treasury e-Grass challan generation, and 1-click statutory appellate filing under GRTSA 2013 directly to the Sub-Divisional Magistrate."
    }
  ];

  pillars.forEach((p, idx) => {
    const x = 0.4 + idx * 3.15;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.05,
      w: 2.9,
      h: 2.45,
      fill: { color: p.bg },
      line: { color: p.border, width: 1.5 },
      rectRadius: 0.08,
    });
    slide.addText(p.title, {
      x: x + 0.15,
      y: 2.15,
      w: 2.6,
      h: 0.25,
      fontSize: 11,
      fontFace: FONT_PRIMARY,
      color: p.color,
      bold: true,
    });
    slide.addText(p.sub, {
      x: x + 0.15,
      y: 2.4,
      w: 2.6,
      h: 0.25,
      fontSize: 9,
      fontFace: FONT_PRIMARY,
      color: COLOR_NAVY,
      bold: true,
    });
    slide.addText(p.text, {
      x: x + 0.15,
      y: 2.7,
      w: 2.6,
      h: 1.7,
      fontSize: 8.8,
      fontFace: FONT_PRIMARY,
      color: "334155",
      lineSpacingMultiple: 1.15,
    });
  });

  // Video Demo Banner
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.4,
    y: 4.6,
    w: 9.2,
    h: 0.7,
    fill: { color: "0F172A" },
  });
  slide.addText("Proposed Solution Explanation & Live Demonstration Repository", {
    x: 0.6,
    y: 4.65,
    w: 5.5,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_PRIMARY,
    color: "FFFFFF",
    bold: true,
  });
  slide.addText("Live Codebase: https://github.com/hkPateL26/GDG.git  |  Demonstration Video Link: http://bit.ly/nagrikseva-demo", {
    x: 0.6,
    y: 4.92,
    w: 8.8,
    h: 0.3,
    fontSize: 9,
    fontFace: FONT_PRIMARY,
    color: "38BDF8",
    bold: true,
  });
}

// =========================================================================
// SLIDE 4: SYSTEM ARCHITECTURE
// =========================================================================
{
  const slide = pptx.addSlide();
  addStandardHeader(slide, "SYSTEM ARCHITECTURE", "End-to-End System Pipeline • Technical Architecture || Methodology");

  // 6 Pipeline Cards across the screen
  const steps = [
    { num: "01", name: "Citizen Super-App", role: "Mobile PWA with 16 languages, Aadhaar 2FA, MeriPehchaan SSO, and Gujarati Voice Assistant.", color: "0284C7" },
    { num: "02", name: "DigiLocker Rule 9A", role: "One-click retrieval of verified legal electronic documents directly from DigiLocker repository URIs.", color: "0D9488" },
    { num: "03", name: "Gemini Vision OCR", role: "Multimodal pre-audit checking document blur, official state seal/emblem, and phonetic name match.", color: "7C3AED" },
    { num: "04", name: "Razorpay & e-Grass", role: "Statutory fee payment via Razorpay (Live & Test Sandbox: UPI/GPay/Cards) with Cyber Treasury 14-digit CRN & barcode.", color: "D97706" },
    { num: "05", name: "Edge & Resilient Cache", role: "Next.js 16 API routes with L1 in-memory LRU + Upstash Redis (<0.8ms) & non-blocking Firestore.", color: "EA580C" },
    { num: "06", name: "5-Tier Officer Desk", role: "State -> Collector -> SDM -> Mamlatdar -> Talati with strict territorial RBAC & e-Sign certificates.", color: "059669" },
  ];

  steps.forEach((s, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 0.4 + col * 3.15;
    const y = 1.25 + row * 1.95;

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 2.9,
      h: 1.8,
      fill: { color: "FFFFFF" },
      line: { color: "CBD5E1", width: 1.5 },
      rectRadius: 0.08,
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.15,
      y: y + 0.15,
      w: 0.55,
      h: 0.35,
      fill: { color: s.color },
      rectRadius: 0.05,
    });
    slide.addText(s.num, {
      x: x + 0.15,
      y: y + 0.17,
      w: 0.55,
      h: 0.3,
      fontSize: 10,
      fontFace: FONT_PRIMARY,
      color: "FFFFFF",
      align: "center",
      bold: true,
    });

    slide.addText(s.name, {
      x: x + 0.8,
      y: y + 0.18,
      w: 1.95,
      h: 0.3,
      fontSize: 10.5,
      fontFace: FONT_PRIMARY,
      color: COLOR_NAVY,
      bold: true,
    });

    slide.addText(s.role, {
      x: x + 0.15,
      y: y + 0.58,
      w: 2.6,
      h: 1.15,
      fontSize: 8.8,
      fontFace: FONT_PRIMARY,
      color: "334155",
      lineSpacingMultiple: 1.15,
    });
  });

  // Bottom Flow Banner
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.4,
    y: 5.1,
    w: 9.2,
    h: 0.35,
    fill: { color: "EFF6FF" },
    line: { color: "93C5FD", width: 1 },
  });
  slide.addText("Pipeline Flow: Citizen Input -> DigiLocker Fetch -> AI Vision Pre-Audit -> Razorpay (Live/Test) -> Scrutiny Queue -> SLA Watchdog -> e-Sign", {
    x: 0.5,
    y: 5.15,
    w: 9.0,
    h: 0.25,
    fontSize: 8.5,
    fontFace: FONT_PRIMARY,
    color: "1E40AF",
    bold: true,
    align: "center",
  });
}

// =========================================================================
// SLIDE 5: ENGINEERING STACK
// =========================================================================
{
  const slide = pptx.addSlide();
  addStandardHeader(slide, "ENGINEERING STACK", "Component Readiness & Dependencies • Technology Stack & Feasibility");

  const stackItems = [
    {
      category: "Frontend & Mobile PWA",
      items: "• Next.js 16.3.6 (Turbopack, App Router)\n• React 19.2.8 & Tailwind CSS v4\n• PWA Service Worker (Offline Cache sw.js)\n• Touch Haptic Feedback Provider\n• Lucide React Icons (Gov Design Tokens)",
      accent: "0284C7",
      bg: "F0F9FF"
    },
    {
      category: "AI, Vision & Voice Engine",
      items: "• Google Gemini 2.5 Flash Multimodal Vision\n• @google/generative-ai (v0.24.1) & Genkit\n• Web Speech API (Client Speech-to-Text)\n• Google Cloud Text-to-Speech (gu-IN)\n• Custom Document Anti-Tampering Heuristics",
      accent: "7C3AED",
      bg: "FAF5FF"
    },
    {
      category: "Backend & Serverless APIs",
      items: "• 15 Serverless REST Route Handlers (/api/*)\n• Razorpay Payment Gateway (Live & Test Sandbox Mode)\n• HMAC-SHA256 Webhook Verifier (webhook-verifier.ts)\n• Stateless HMAC-SHA256 Officer Sessions\n• Sliding-Window Rate Limiters & RBAC Guards",
      accent: "EA580C",
      bg: "FFF7ED"
    },
    {
      category: "Database & Edge Caching",
      items: "• Upstash Redis & L1 In-Memory LRU Cache\n  (5,000 capacity, <0.8ms average latency)\n• Google Cloud Firestore (Admin SDK 14.5.0)\n• 5,420 Pre-Seeded Gujarat Revenue Records\n• 18,225 Village Cascading Geographic DB",
      accent: "059669",
      bg: "F0FDF4"
    },
    {
      category: "Legal & Regulatory Compliance",
      items: "• Gujarat Right to Services Act (GRTSA 2013)\n• DigiLocker IT Act 2000 Rule 9A (Legal Records)\n• DPDP Act 2023 (Aadhaar 4-Digit Masking)\n• Cyber Treasury e-Grass 14-Digit CRN\n• Secret-Guarded Citizen Application Tracking",
      accent: "0F172A",
      bg: "F1F5F9"
    }
  ];

  stackItems.forEach((st, idx) => {
    const x = 0.4 + idx * 1.88;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.25,
      w: 1.78,
      h: 4.15,
      fill: { color: st.bg },
      line: { color: st.accent, width: 1.5 },
      rectRadius: 0.08,
    });

    slide.addShape(pptx.ShapeType.rect, {
      x,
      y: 1.25,
      w: 1.78,
      h: 0.5,
      fill: { color: st.accent },
    });

    slide.addText(st.category, {
      x: x + 0.05,
      y: 1.3,
      w: 1.68,
      h: 0.4,
      fontSize: 9,
      fontFace: FONT_PRIMARY,
      color: "FFFFFF",
      bold: true,
      align: "center",
    });

    slide.addText(st.items, {
      x: x + 0.1,
      y: 1.85,
      w: 1.58,
      h: 3.45,
      fontSize: 8.2,
      fontFace: FONT_PRIMARY,
      color: "334155",
      lineSpacingMultiple: 1.15,
    });
  });
}

// =========================================================================
// SLIDE 6: IMPACT ASSESSMENT
// =========================================================================
{
  const slide = pptx.addSlide();
  addStandardHeader(slide, "IMPACT ASSESSMENT • SFIC SECTION 05", "Quantifiable Citizen Outcomes • Socio-Economic Impact & Viability");

  const impacts = [
    {
      metric: "70%+",
      title: "Reduction in Processing Turnaround Times",
      desc: "Gemini Vision AI pre-scrutiny eliminates defective document submissions, slashing rejection rates from 42% to <5%. Standard revenue certificates are issued in 24 to 48 hours against 7 to 15-day statutory limits.",
      color: "059669",
      bg: "F0FDF4"
    },
    {
      metric: "₹350 - ₹500",
      title: "Direct Wage Loss Savings Per Application",
      desc: "By eliminating repeated 15-40 km travel to Jan Seva Kendras, daily-wage agricultural workers, construction laborers, and rural families save travel costs and prevent daily livelihood loss.",
      color: "0284C7",
      bg: "F0F9FF"
    },
    {
      metric: "100%",
      title: "Eradication of Exploitative Middlemen",
      desc: "Direct 1-click DigiLocker document pulls combined with authentic Gujarati voice AI guidance empower low-literacy citizens to submit applications independently without paying unauthorized tout fees.",
      color: "EA580C",
      bg: "FFF7ED"
    },
    {
      metric: "R² = 0.941",
      title: "Predictive Secretariat SLA Governance",
      desc: "6-month historical machine learning engine forecasts seasonal application surges (e.g., +5.4% monthly growth, 184,000 files) and flags taluka backlogs for proactive staff reallocation before SLA breaches occur.",
      color: "7C3AED",
      bg: "FAF5FF"
    }
  ];

  impacts.forEach((imp, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.4 + col * 4.7;
    const y = 1.25 + row * 2.05;

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 4.5,
      h: 1.9,
      fill: { color: imp.bg },
      line: { color: imp.color, width: 1.5 },
      rectRadius: 0.08,
    });

    slide.addText(imp.metric, {
      x: x + 0.2,
      y: y + 0.15,
      w: 1.8,
      h: 0.45,
      fontSize: 22,
      fontFace: FONT_PRIMARY,
      color: imp.color,
      bold: true,
    });

    slide.addText(imp.title, {
      x: x + 0.2,
      y: y + 0.65,
      w: 4.1,
      h: 0.3,
      fontSize: 10.5,
      fontFace: FONT_PRIMARY,
      color: COLOR_NAVY,
      bold: true,
    });

    slide.addText(imp.desc, {
      x: x + 0.2,
      y: y + 0.98,
      w: 4.1,
      h: 0.85,
      fontSize: 8.8,
      fontFace: FONT_PRIMARY,
      color: "334155",
      lineSpacingMultiple: 1.15,
    });
  });
}

// =========================================================================
// SLIDE 7: EXECUTION TIMELINE
// =========================================================================
{
  const slide = pptx.addSlide();
  addStandardHeader(slide, "EXECUTION TIMELINE • SFIC SECTION 06", "From Prototype to Field Rollout • Implementation Roadmap & Milestones");

  const phases = [
    {
      phase: "Phase 1: Working Prototype",
      time: "October 2026 (Completed)",
      status: "COMPLETED",
      statusColor: "059669",
      statusBg: "D1FAE5",
      bullets: "• 57 welfare schemes & 69 document services modeled\n• Gemini 2.5 Flash Vision OCR pre-audit operational\n• DigiLocker Rule 9A & Kutumb Family Ledger live\n• Razorpay Payment Gateway (Live & Sandbox Test Mode) verified\n• 5-Tier Officer Hierarchy Desk with e-Sign certificates\n• 18,225 Gujarat villages cascading geo-database\n• 100% build & TypeScript compilation pass",
    },
    {
      phase: "Phase 2: District-Level Field Pilot",
      time: "Nov – Dec 2026",
      status: "UPCOMING",
      statusColor: "0284C7",
      statusBg: "E0F2FE",
      bullets: "• Pilot deployment across Rajkot District (Gondal, Lodhika, Kotda Sangani Talukas)\n• Jan Seva Kendra operator testing & feedback loop\n• Field usability verification with 1,000+ rural citizens\n• Latency & edge caching tuning for rural 4G networks\n• Collectorate administrative review & sign-off",
    },
    {
      phase: "Phase 3: State DPI Integration",
      time: "Jan – Mar 2027",
      status: "PLANNED",
      statusColor: "D97706",
      statusBg: "FEF3C7",
      bullets: "• Live NeGD API Setu production credentials activation\n• Gujarat Cyber Treasury e-Grass live payment gateway\n• AnyRoR 7/12 direct revenue database connectivity\n• Sandes / State SMS gateway integration for alerts\n• State Data Centre (GSDC Gandhinagar) deployment",
    },
    {
      phase: "Phase 4: Statewide Scale",
      time: "April 2027 Onward",
      status: "EXPANSION",
      statusColor: "7C3AED",
      statusBg: "EDE9FE",
      bullets: "• Statewide rollout across all 33 districts & 250+ talukas\n• Complete coverage of 18,225 Village Panchayats\n• Integration with all Gujarat Secretariat departments\n• Continuous Machine Learning delay model retraining\n• Transition to zero-queue paperless public governance",
    },
  ];

  phases.forEach((ph, idx) => {
    const x = 0.4 + idx * 2.35;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.25,
      w: 2.25,
      h: 4.15,
      fill: { color: "FFFFFF" },
      line: { color: "CBD5E1", width: 1.5 },
      rectRadius: 0.08,
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.1,
      y: 1.35,
      w: 1.0,
      h: 0.25,
      fill: { color: ph.statusBg },
      line: { color: ph.statusColor, width: 1 },
      rectRadius: 0.04,
    });
    slide.addText(ph.status, {
      x: x + 0.1,
      y: 1.38,
      w: 1.0,
      h: 0.2,
      fontSize: 7.5,
      fontFace: FONT_PRIMARY,
      color: ph.statusColor,
      bold: true,
      align: "center",
    });

    slide.addText(ph.phase, {
      x: x + 0.1,
      y: 1.68,
      w: 2.05,
      h: 0.45,
      fontSize: 10,
      fontFace: FONT_PRIMARY,
      color: COLOR_NAVY,
      bold: true,
    });

    slide.addText(ph.time, {
      x: x + 0.1,
      y: 2.12,
      w: 2.05,
      h: 0.22,
      fontSize: 8.5,
      fontFace: FONT_PRIMARY,
      color: COLOR_SAFFRON,
      bold: true,
    });

    slide.addText(ph.bullets, {
      x: x + 0.1,
      y: 2.4,
      w: 2.05,
      h: 2.9,
      fontSize: 8,
      fontFace: FONT_PRIMARY,
      color: "334155",
      lineSpacingMultiple: 1.15,
    });
  });
}

// =========================================================================
// SLIDE 8: SQUAD CAPABILITIES
// =========================================================================
{
  const slide = pptx.addSlide();
  addStandardHeader(slide, "SQUAD CAPABILITIES", "Multi-Disciplinary Team & Mentorship • Ready for Jury Review & Evaluation");

  const team = [
    {
      code: "TL",
      name: "Hari Patel",
      subhead: "LEADER | Sem-1 MCA, Atmiya University",
      role: "Chief System Architect & AI Engineer",
      skills: "Lead system architecture, Google Gemini 2.5 Flash Vision OCR integration, Next.js 16 core, DPI framework design, and statutory GRTSA 2013 compliance mapping.",
      color: "EA580C",
      bg: "FFF7ED",
      border: "FDBA74",
    },
    {
      code: "M2",
      name: "Jeet Jajal",
      subhead: "MEMBER | Sem-1 MCA, Atmiya University",
      role: "Lead Full-Stack & Cloud Infrastructure Engineer",
      skills: "Serverless REST API routes, Upstash Redis distributed caching (<0.8ms), Firestore cloud persistence, stateless HMAC-SHA256 officer auth, and performance optimization.",
      color: "0284C7",
      bg: "F0F9FF",
      border: "BAE6FD",
    },
    {
      code: "M3",
      name: "Trusha Somaiya",
      subhead: "MEMBER | Sem-1 MCA, Atmiya University",
      role: "Lead Frontend UX & Vernacular Interface Specialist",
      skills: "Mobile-first PWA design, authentic Gujarati typography, accessible Web Speech audio interfaces, touch haptic feedback, and Jan Seva Kendra citizen journey optimization.",
      color: "059669",
      bg: "F0FDF4",
      border: "BBF7D0",
    },
    {
      code: "M4",
      name: "Dimple Parmar",
      subhead: "MEMBER | Sem-1 MCA, Atmiya University",
      role: "AI Vision & Document Verification Analyst",
      skills: "Gemini 2.5 Flash OCR validation pipeline, document clarity scoring heuristics, anti-tampering detection algorithms, and DigiLocker Rule 9A integration testing.",
      color: "7C3AED",
      bg: "FAF5FF",
      border: "E9D5FF",
    },
    {
      code: "M5",
      name: "Kruti Rabadiya",
      subhead: "MEMBER | Sem-1 MCA, Atmiya University",
      role: "Database Architect & Gujarat Geo-Engine Specialist",
      skills: "Relational mapping of 33 districts, 250+ talukas, and 18,225 villages, Firestore collection schemas, in-memory LRU cache eviction, and query optimization.",
      color: "D97706",
      bg: "FFFBEB",
      border: "FDE68A",
    },
    {
      code: "M6",
      name: "Chauhan Ayushi",
      subhead: "MEMBER | Sem-1 MCA, Atmiya University",
      role: "QA, Legal Compliance & Governance Researcher",
      skills: "Gujarat Right to Services Act (GRTSA 2013) statutory SLA audit, 57 welfare scheme rules analysis, 69 revenue services modeling, and automated test suites.",
      color: "DC2626",
      bg: "FEF2F2",
      border: "FECACA",
    },
  ];

  team.forEach((tm, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 0.4 + col * 3.12;
    const y = 1.25 + row * 1.74;

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 2.96,
      h: 1.62,
      fill: { color: tm.bg },
      line: { color: tm.border, width: 1.5 },
      rectRadius: 0.08,
    });

    // Badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.12,
      y: y + 0.12,
      w: 0.48,
      h: 0.28,
      fill: { color: tm.color },
      rectRadius: 0.05,
    });
    slide.addText(tm.code, {
      x: x + 0.12,
      y: y + 0.14,
      w: 0.48,
      h: 0.24,
      fontSize: 8.5,
      fontFace: FONT_PRIMARY,
      color: "FFFFFF",
      align: "center",
      bold: true,
    });

    // Member Name
    slide.addText(tm.name, {
      x: x + 0.66,
      y: y + 0.1,
      w: 2.2,
      h: 0.26,
      fontSize: 10,
      fontFace: FONT_PRIMARY,
      color: COLOR_NAVY,
      bold: true,
    });

    // Subhead
    slide.addText(tm.subhead, {
      x: x + 0.66,
      y: y + 0.34,
      w: 2.2,
      h: 0.18,
      fontSize: 7.2,
      fontFace: FONT_PRIMARY,
      color: COLOR_MUTED,
      bold: true,
    });

    // Role
    slide.addText(tm.role, {
      x: x + 0.12,
      y: y + 0.54,
      w: 2.72,
      h: 0.24,
      fontSize: 7.8,
      fontFace: FONT_PRIMARY,
      color: tm.color,
      bold: true,
    });

    // Skills
    slide.addText(tm.skills, {
      x: x + 0.12,
      y: y + 0.78,
      w: 2.72,
      h: 0.8,
      fontSize: 7.4,
      fontFace: FONT_PRIMARY,
      color: "334155",
      lineSpacingMultiple: 1.12,
    });
  });

  // Faculty Mentor Card across bottom
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.4,
    y: 4.82,
    w: 9.2,
    h: 0.65,
    fill: { color: "0F172A" },
    line: { color: "334155", width: 1 },
    rectRadius: 0.08,
  });

  slide.addText("FACULTY MENTOR / ACADEMIC GUIDE:", {
    x: 0.6,
    y: 4.88,
    w: 2.8,
    h: 0.22,
    fontSize: 8.5,
    fontFace: FONT_PRIMARY,
    color: "EA580C",
    bold: true,
  });

  slide.addText("Faculty Mentor: [Prof. / Dr. Full Name]  •  Department of Computer Science / MCA, Atmiya University, Rajkot, Gujarat", {
    x: 0.6,
    y: 5.12,
    w: 8.8,
    h: 0.26,
    fontSize: 9,
    fontFace: FONT_PRIMARY,
    color: "FFFFFF",
    bold: true,
  });
}

// Generate the PPTX File
import fs from "fs";
const outputPathRoot = path.resolve(process.cwd(), "..", "NagrikSeva_AI_SFIC_2026_Official_Synopsis.pptx");
const outputPathSub = path.resolve(process.cwd(), "NagrikSeva_AI_SFIC_2026_Official_Synopsis.pptx");
console.log(`Writing presentation to: ${outputPathRoot}`);

pptx
  .writeFile({ fileName: outputPathRoot })
  .then((fileName) => {
    console.log(`✅ SUCCESS! Presentation successfully created at: ${fileName}`);
    try {
      fs.copyFileSync(outputPathRoot, outputPathSub);
      console.log(`✅ Also synced to: ${outputPathSub}`);
    } catch (e) {
      console.warn("Could not copy to subfolder:", e.message);
    }
  })
  .catch((err) => {
    console.error("❌ Error generating presentation:", err);
    process.exit(1);
  });
