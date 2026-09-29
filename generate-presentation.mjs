import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";

const rootDir = "D:\\Movies and Web se\\atmiya";
const screenshotsDir = path.join(rootDir, "screenshots");
const teamLogoPath = path.join(rootDir, "team_logo.jpg");

const homeShot = path.join(screenshotsDir, "home.png");
const docShot = path.join(screenshotsDir, "documents.png");
const benefitShot = path.join(screenshotsDir, "benefit.png");
const locatorShot = path.join(screenshotsDir, "locator.png");
const adminShot = path.join(screenshotsDir, "admin.png");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Team JustCode";
pptx.company = "Atmiya University - GDG Hackathon 2026";
pptx.title = "NagrikSeva AI - Official Presentation Deck";

// Color Palette
const C_ORANGE = "EA580C"; // Brand saffron orange
const C_AMBER = "F59E0B";  // Warm gold
const C_GREEN = "059669";  // Emerald governance green
const C_NAVY = "0F172A";   // Deep slate navy
const C_SLATE = "334155";  // Medium slate
const C_LIGHT = "F8FAFC";  // Light slate background
const C_WHITE = "FFFFFF";

// Helper for Slide Background & Header
function addSlideBase(slide, categoryText, titleText) {
  // Top accent bar (Tricolor gradient inspired)
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 0.12,
    fill: { color: C_ORANGE }
  });

  // Top Category / Section Tag
  if (categoryText) {
    slide.addText(categoryText.toUpperCase(), {
      x: 0.8, y: 0.35, w: 9, h: 0.3,
      fontSize: 10, bold: true, color: C_ORANGE, fontFace: "Segoe UI"
    });
  }

  // Slide Title
  if (titleText) {
    slide.addText(titleText, {
      x: 0.8, y: 0.65, w: 10, h: 0.6,
      fontSize: 22, bold: true, color: C_NAVY, fontFace: "Segoe UI"
    });
  }

  // Footer
  slide.addText("NagrikSeva AI  |  Team JustCode  |  GDG Build with AI 2.0", {
    x: 0.8, y: 7.15, w: 8, h: 0.3,
    fontSize: 9, color: "94A3B8", fontFace: "Segoe UI"
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 1: Title Slide
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_NAVY };

  // Subtle accent elements
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 0.15,
    fill: { color: C_ORANGE }
  });

  // Hackathon Badge
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.8, w: 4.8, h: 0.45, r: 0.2,
    fill: { color: "1E293B" }, line: { color: C_AMBER, width: 1.5 }
  });
  slide.addText("⚡ GDG Build with AI: Code for Communities 2.0", {
    x: 0.8, y: 0.8, w: 4.8, h: 0.45,
    fontSize: 11, bold: true, color: C_AMBER, align: "center", fontFace: "Segoe UI"
  });

  // Main Project Title
  slide.addText("NagrikSeva AI", {
    x: 0.8, y: 1.4, w: 8, h: 1.1,
    fontSize: 44, bold: true, color: C_WHITE, fontFace: "Segoe UI"
  });
  slide.addText("(નાગરિકસેવા AI)", {
    x: 0.8, y: 2.35, w: 8, h: 0.6,
    fontSize: 22, bold: true, color: C_AMBER, fontFace: "Segoe UI"
  });

  // Tagline
  slide.addText("AI-Powered Multilingual Digital Public Infrastructure & Citizen Governance Assistant\nBridging the gap between 70M+ citizens and welfare entitlements with Google Gemini 1.5 Flash.", {
    x: 0.8, y: 3.1, w: 8, h: 0.9,
    fontSize: 14, color: "CBD5E1", fontFace: "Segoe UI", lineSpacing: 20
  });

  // Tech Badges Box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.2, w: 8.5, h: 0.9, r: 0.15,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 }
  });
  slide.addText("CORE TECH STACK:  Google Gemini 1.5 Flash  •  Cloud Firestore  •  Next.js 16  •  Web Speech API  •  Tailwind CSS", {
    x: 1.0, y: 4.35, w: 8.1, h: 0.6,
    fontSize: 11, bold: true, color: "38BDF8", fontFace: "Segoe UI"
  });

  // Team Box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 5.4, w: 5.5, h: 1.6, r: 0.2,
    fill: { color: "1E293B" }, line: { color: C_ORANGE, width: 1.5 }
  });
  slide.addText("DEVELOPED BY: TEAM JUSTCODE", {
    x: 1.1, y: 5.55, w: 5.0, h: 0.35,
    fontSize: 11, bold: true, color: C_ORANGE, fontFace: "Segoe UI"
  });
  slide.addText("• Hari Patel  (AI & Full-Stack Lead)\n• Jeet  (Systems & UI/UX Lead)\nCollege: Atmiya University, Rajkot", {
    x: 1.1, y: 5.9, w: 5.0, h: 0.95,
    fontSize: 12, color: C_WHITE, fontFace: "Segoe UI"
  });

  // Team Logo Image if exists
  if (fs.existsSync(teamLogoPath)) {
    slide.addImage({
      path: teamLogoPath,
      x: 9.8, y: 1.8, w: 2.8, h: 2.8,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 2: Ground Reality & Problem Statement
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addSlideBase(slide, "The Ground Reality", "Critical Barriers in Indian Public Service Delivery");

  const problems = [
    {
      num: "40%",
      title: "Document Rejections & Delays",
      desc: "Up to 40% of citizen welfare applications get rejected at Mamlatdar level due to wrong/blurry documents (e.g. uploading marksheet instead of birth certificate). Citizens waste 15-20 days only to be returned.",
      color: "DC2626"
    },
    {
      num: "72%",
      title: "Severe Language & Literacy Gap",
      desc: "Government portals are overwhelmingly text-heavy and English-centric. Rural elderly and illiterate citizens cannot navigate complex forms or understand bureaucratic terminology.",
      color: "D97706"
    },
    {
      num: "20+",
      title: "Fragmented Welfare Portals",
      desc: "Citizens have to juggle multiple disconnected sites (Digital Gujarat, PM Kisan, Ayushman, i-Khedut, e-Gram). There is zero single-window visibility into total family entitlements.",
      color: "2563EB"
    },
    {
      num: "60h+",
      title: "Administrative Officer Overload",
      desc: "Talatis and Mamlatdars spend over 60 hours a month manually screening invalid files that could easily be filtered out at the pre-submission layer with modern AI Vision.",
      color: "4F46E5"
    }
  ];

  problems.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.9;
    const y = 1.5 + row * 2.7;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 5.6, h: 2.4, r: 0.15,
      fill: { color: C_WHITE }, line: { color: "E2E8F0", width: 1.5 }
    });

    slide.addShape(pptx.shapes.RECTANGLE, {
      x, y, w: 0.15, h: 2.4,
      fill: { color: p.color }
    });

    slide.addText(p.num, {
      x: x + 0.35, y: y + 0.2, w: 2.5, h: 0.5,
      fontSize: 26, bold: true, color: p.color, fontFace: "Segoe UI"
    });

    slide.addText(p.title, {
      x: x + 0.35, y: y + 0.75, w: 5.0, h: 0.4,
      fontSize: 13, bold: true, color: C_NAVY, fontFace: "Segoe UI"
    });

    slide.addText(p.desc, {
      x: x + 0.35, y: y + 1.15, w: 5.0, h: 1.1,
      fontSize: 11, color: C_SLATE, fontFace: "Segoe UI", lineSpacing: 16
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 3: The Solution Overview & Live Product
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addSlideBase(slide, "Our Innovation", "NagrikSeva AI: End-to-End Digital Public Infrastructure");

  // Left Content Column
  slide.addText("A unified, voice-first AI assistant integrated with official Gujarat governance workflows — solving the last-mile delivery challenge.", {
    x: 0.8, y: 1.4, w: 5.8, h: 0.8,
    fontSize: 13, color: C_SLATE, fontFace: "Segoe UI"
  });

  const features = [
    { title: "🎙️ Multilingual Voice Engine", desc: "Native Gujarati Speech-to-Text & Audio Read-Aloud for non-readers." },
    { title: "🔍 AI Document Scrutiny (OCR)", desc: "Pre-submission fraud & mismatch detection powered by Gemini Vision." },
    { title: "🏛️ Dual-Persona Officer Portal", desc: "Direct Mamlatdar scrutiny dashboard with SLA tracking and live sync." },
    { title: "💰 Family Benefit Calculator", desc: "Consolidated household welfare math with instant WhatsApp pass generation." },
    { title: "📍 Jan Seva Kendra Locator", desc: "GPS mapping across 33 Gujarat districts with direct Google Maps routing." }
  ];

  features.forEach((f, i) => {
    const y = 2.2 + i * 0.95;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y, w: 5.8, h: 0.85, r: 0.1,
      fill: { color: C_WHITE }, line: { color: "E2E8F0", width: 1 }
    });
    slide.addText(f.title, {
      x: 1.0, y: y + 0.08, w: 5.4, h: 0.35,
      fontSize: 12, bold: true, color: C_NAVY, fontFace: "Segoe UI"
    });
    slide.addText(f.desc, {
      x: 1.0, y: y + 0.42, w: 5.4, h: 0.35,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI"
    });
  });

  // Right Column: Real Website Screenshot
  if (fs.existsSync(homeShot)) {
    slide.addImage({
      path: homeShot,
      x: 7.0, y: 1.4, w: 5.6, h: 5.4,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 4: Core Innovation #1 — Gemini Vision AI Document Scrutiny
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addSlideBase(slide, "Game-Changing USP", "Gemini Vision AI: Zero-Fraud Pre-Submission Document Scrutiny");

  slide.addText("Why no other government portal has this: Existing portals blindly accept PDFs. NagrikSeva AI intercepts uploads in real time using Gemini Vision API before official submission.", {
    x: 0.8, y: 1.35, w: 11.5, h: 0.6,
    fontSize: 12, color: C_SLATE, fontFace: "Segoe UI"
  });

  const cards = [
    {
      title: "1. Type Mismatch Detection",
      desc: "If applicant uploads a Marksheet when a Birth Certificate (જન્મનો દાખલો) was requested, AI strictly flags it (Score: 15%) and blocks invalid submission.",
      badge: "STRICT ZERO-FRAUD",
      bg: "FEF2F2", border: "EF4444"
    },
    {
      title: "2. Quality & Tampering Score",
      desc: "Evaluates image blurriness, readability, resolution, and standard photo requirements (solid background, visible face) giving an actionable score (0-100%).",
      badge: "QUALITY AUDIT",
      bg: "EFF6FF", border: "3B82F6"
    },
    {
      title: "3. Actionable Gujarati Advice",
      desc: "Provides clear Gujarati feedback: '❌ ખોટો દસ્તાવેજ: તમે માર્કશીટ મૂકી છે. જન્મનો દાખલો અથવા શાળા છોડ્યાનું પ્રમાણપત્ર (LC) જ ચાલશે.'",
      badge: "VERNACULAR GUIDANCE",
      bg: "ECFDF5", border: "10B981"
    }
  ];

  cards.forEach((c, i) => {
    const x = 0.8 + i * 3.95;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.05, w: 3.8, h: 2.1, r: 0.15,
      fill: { color: c.bg }, line: { color: c.border, width: 1.5 }
    });
    slide.addText(c.badge, {
      x: x + 0.2, y: 2.2, w: 3.4, h: 0.25,
      fontSize: 9, bold: true, color: c.border, fontFace: "Segoe UI"
    });
    slide.addText(c.title, {
      x: x + 0.2, y: 2.45, w: 3.4, h: 0.4,
      fontSize: 13, bold: true, color: C_NAVY, fontFace: "Segoe UI"
    });
    slide.addText(c.desc, {
      x: x + 0.2, y: 2.85, w: 3.4, h: 1.15,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI", lineSpacing: 15
    });
  });

  // Document Portal Screenshot
  if (fs.existsSync(docShot)) {
    slide.addImage({
      path: docShot,
      x: 0.8, y: 4.35, w: 11.7, h: 2.65,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 5: Core Innovation #2 — Dual Persona: Mamlatdar Scrutiny Portal
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addSlideBase(slide, "Administrative Layer", "Mamlatdar & Talati Scrutiny Dashboard (/admin)");

  // Left Content
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.4, w: 5.6, h: 5.5, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });

  slide.addText("🏛️ Bridging Citizens & Officers", {
    x: 1.1, y: 1.6, w: 5.0, h: 0.4,
    fontSize: 15, bold: true, color: C_NAVY, fontFace: "Segoe UI"
  });

  slide.addText("Most civic apps stop at citizen submission. NagrikSeva AI includes the full administrative lifecycle used by Gujarat Revenue Officers:", {
    x: 1.1, y: 2.05, w: 5.0, h: 0.7,
    fontSize: 11, color: C_SLATE, fontFace: "Segoe UI"
  });

  const officerFeatures = [
    { title: "Taluka/District Jurisdiction Filter", desc: "Officers inspect applications specific to their jurisdiction (e.g. Rajkot Urban / Gondal)." },
    { title: "AI Quality Score Audit", desc: "Officers see Gemini's pre-computed document score, reducing review time by 75%." },
    { title: "Return for Correction with Remarks", desc: "Officer sends Gujarati feedback explaining missing proofs; citizen can 1-click re-apply." },
    { title: "Direct Benefit Transfer (DBT) Approval", desc: "Instant approval trigger updating live Firestore ledger and SMS notification." }
  ];

  officerFeatures.forEach((of, idx) => {
    const y = 2.85 + idx * 0.95;
    slide.addText(`✔ ${of.title}`, {
      x: 1.1, y, w: 5.0, h: 0.3,
      fontSize: 11, bold: true, color: C_ORANGE, fontFace: "Segoe UI"
    });
    slide.addText(of.desc, {
      x: 1.3, y: y + 0.28, w: 4.8, h: 0.55,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI"
    });
  });

  // Right: Admin Screenshot or Visual
  if (fs.existsSync(adminShot)) {
    slide.addImage({
      path: adminShot,
      x: 6.7, y: 1.4, w: 5.8, h: 5.5,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 6: Citizen Empowerment Utilities
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addSlideBase(slide, "Citizen Utilities", "Family Benefit Calculator & Smart Kacheri GPS Locator");

  // Box 1: Benefit Calculator & WhatsApp Pass
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.4, w: 5.7, h: 2.5, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });
  slide.addText("💰 Family Benefit Calculator & WhatsApp Pass", {
    x: 1.0, y: 1.55, w: 5.3, h: 0.35,
    fontSize: 13, bold: true, color: C_GREEN, fontFace: "Segoe UI"
  });
  slide.addText("• Consolidates household parameters (income, land, caste, children).\n• Calculates combined yearly benefit (e.g. ₹5,25,000 via Ayushman + PM Kisan + Awas).\n• Generates offline-ready PDF/WhatsApp digital pass with QR verification.", {
    x: 1.0, y: 1.95, w: 5.3, h: 1.8,
    fontSize: 11, color: C_SLATE, fontFace: "Segoe UI", lineSpacing: 18
  });

  // Box 2: Smart Kacheri Locator
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.4, w: 5.7, h: 2.5, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });
  slide.addText("📍 Smart Jan Seva Kendra / Kacheri Locator", {
    x: 7.0, y: 1.55, w: 5.3, h: 0.35,
    fontSize: 13, bold: true, color: C_ORANGE, fontFace: "Segoe UI"
  });
  slide.addText("• Directory of Mamlatdar offices, Collectorates & CSC centers across Gujarat.\n• Filter by District (Rajkot, Ahmedabad, Surat, etc.) and Taluka.\n• Live office hours, contact officers, and 1-click Google Maps GPS navigation.", {
    x: 7.0, y: 1.95, w: 5.3, h: 1.8,
    fontSize: 11, color: C_SLATE, fontFace: "Segoe UI", lineSpacing: 18
  });

  // Images below
  if (fs.existsSync(benefitShot)) {
    slide.addImage({
      path: benefitShot,
      x: 0.8, y: 4.1, w: 5.7, h: 2.8,
      sizing: { type: "contain" }
    });
  }
  if (fs.existsSync(locatorShot)) {
    slide.addImage({
      path: locatorShot,
      x: 6.8, y: 4.1, w: 5.7, h: 2.8,
      sizing: { type: "contain" }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 7: Technical Architecture
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_NAVY };

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 0.12,
    fill: { color: C_ORANGE }
  });
  slide.addText("SYSTEM ARCHITECTURE", {
    x: 0.8, y: 0.35, w: 9, h: 0.3,
    fontSize: 10, bold: true, color: C_AMBER, fontFace: "Segoe UI"
  });
  slide.addText("Robust, Cloud-Native Google Tech Stack", {
    x: 0.8, y: 0.65, w: 10, h: 0.6,
    fontSize: 22, bold: true, color: C_WHITE, fontFace: "Segoe UI"
  });

  const stackBoxes = [
    { title: "Presentation Layer", tech: "Next.js 16 (App Router)\nReact 19 & Turbopack\nTailwind CSS v4\nLucide Civic Icons", color: "38BDF8" },
    { title: "Intelligence Layer", tech: "Google Gemini 1.5 Flash\nMultimodal Vision OCR\nGujarati Speech Recognition\nAudio Speech Synthesis", color: C_AMBER },
    { title: "Backend & Edge", tech: "Next.js Edge API Routes\nServerless Microservices\nStrict Verification Engine\nOffline ServiceWorker PWA", color: "34D399" },
    { title: "Data & Persistence", tech: "Google Cloud Firestore\nReal-time Status Tracking\n5,000+ Civic Profiles\nRole-Based Auth (SSO)", color: "F472B6" }
  ];

  stackBoxes.forEach((b, idx) => {
    const x = 0.8 + idx * 2.95;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.5, w: 2.8, h: 3.2, r: 0.15,
      fill: { color: "1E293B" }, line: { color: b.color, width: 1.5 }
    });
    slide.addText(b.title, {
      x: x + 0.15, y: 1.7, w: 2.5, h: 0.4,
      fontSize: 12, bold: true, color: b.color, fontFace: "Segoe UI"
    });
    slide.addText(b.tech, {
      x: x + 0.15, y: 2.2, w: 2.5, h: 2.3,
      fontSize: 11, color: "E2E8F0", fontFace: "Segoe UI", lineSpacing: 18
    });
  });

  // Flow description bar at bottom
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 5.0, w: 11.6, h: 1.8, r: 0.15,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 }
  });
  slide.addText("DATA FLOW: Citizen Voice/Text Query ──> Web Speech API ──> Gemini 1.5 Flash ──> Regional Audio Response\nDOCUMENT FLOW: Citizen Upload ──> Gemini Vision OCR (Mismatch Audit) ──> Firestore ──> Mamlatdar Scrutiny ──> Instant DBT", {
    x: 1.1, y: 5.25, w: 11.0, h: 1.3,
    fontSize: 11, bold: true, color: "CBD5E1", fontFace: "Segoe UI", lineSpacing: 20
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 8: Competitive Analysis vs Government Portals
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addSlideBase(slide, "Market Analysis", "How NagrikSeva AI Surpasses Existing Solutions");

  const tableHeaders = [
    { text: "Feature / Capability", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE } },
    { text: "myScheme (Gov of India)", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE } },
    { text: "Digital Gujarat Portal", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE } },
    { text: "Jugalbandi AI (WhatsApp)", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE } },
    { text: "NagrikSeva AI (Our Platform)", options: { bold: true, fill: { color: C_ORANGE }, color: C_WHITE } }
  ];

  const tableRows = [
    [
      { text: "Pre-submission AI Doc Scrutiny", options: { bold: true } },
      { text: "❌ None (No upload)" },
      { text: "❌ Blind upload (Manual review)" },
      { text: "❌ Text only" },
      { text: "✔ Gemini Vision OCR (Instant)", options: { bold: true, color: C_GREEN } }
    ],
    [
      { text: "Regional Voice Interaction", options: { bold: true } },
      { text: "❌ None" },
      { text: "❌ None" },
      { text: "✔ Audio message only" },
      { text: "✔ Real-time Speech-to-Text & Audio", options: { bold: true, color: C_GREEN } }
    ],
    [
      { text: "Dual Officer/Mamlatdar Portal", options: { bold: true } },
      { text: "❌ None (Redirects)" },
      { text: "✔ Traditional manual backoffice" },
      { text: "❌ None" },
      { text: "✔ AI-Assisted Scrutiny & SLA", options: { bold: true, color: C_GREEN } }
    ],
    [
      { text: "Family Welfare Benefit Math", options: { bold: true } },
      { text: "❌ Individual only" },
      { text: "❌ Individual schemes" },
      { text: "❌ None" },
      { text: "✔ Full Household Calculator + Pass", options: { bold: true, color: C_GREEN } }
    ],
    [
      { text: "GPS Jan Seva Kendra Routing", options: { bold: true } },
      { text: "❌ None" },
      { text: "❌ Static PDF lists" },
      { text: "❌ None" },
      { text: "✔ Live Map Directions & Hours", options: { bold: true, color: C_GREEN } }
    ]
  ];

  slide.addTable([tableHeaders, ...tableRows], {
    x: 0.8, y: 1.5, w: 11.6, h: 5.2,
    colW: [2.8, 2.1, 2.2, 2.2, 2.3],
    fontSize: 10,
    fontFace: "Segoe UI",
    align: "center",
    valign: "middle",
    border: { pt: 1, color: "CBD5E1" }
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 9: Scalability, Social Impact & Roadmap
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_LIGHT };
  addSlideBase(slide, "Impact & Vision", "Empowering 70M+ Citizens Across Gujarat & India");

  const metrics = [
    { num: "75%", label: "Faster Application Turnaround", sub: "Pre-screened files eliminate back-and-forth returns" },
    { num: "0 km", label: "Zero Travel for Inquiries", sub: "Dial or tap from rural homes in native tongue" },
    { num: "₹0", label: "100% Free Public Good", sub: "No middleman exploitation or cyber-cafe charges" },
    { num: "33", label: "Districts Ready for Rollout", sub: "Complete administrative dataset mapped" }
  ];

  metrics.forEach((m, i) => {
    const x = 0.8 + i * 2.95;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.5, w: 2.8, h: 1.8, r: 0.15,
      fill: { color: C_WHITE }, line: { color: C_ORANGE, width: 1.5 }
    });
    slide.addText(m.num, {
      x: x + 0.1, y: 1.65, w: 2.6, h: 0.5,
      fontSize: 28, bold: true, color: C_ORANGE, align: "center", fontFace: "Segoe UI"
    });
    slide.addText(m.label, {
      x: x + 0.1, y: 2.2, w: 2.6, h: 0.4,
      fontSize: 11, bold: true, color: C_NAVY, align: "center", fontFace: "Segoe UI"
    });
    slide.addText(m.sub, {
      x: x + 0.1, y: 2.6, w: 2.6, h: 0.55,
      fontSize: 9, color: C_SLATE, align: "center", fontFace: "Segoe UI"
    });
  });

  // Roadmap Section
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 3.6, w: 11.6, h: 3.3, r: 0.15,
    fill: { color: C_WHITE }, line: { color: "CBD5E1", width: 1.5 }
  });

  slide.addText("🚀 IMPLEMENTATION ROADMAP", {
    x: 1.1, y: 3.8, w: 5.0, h: 0.35,
    fontSize: 13, bold: true, color: C_NAVY, fontFace: "Segoe UI"
  });

  const phases = [
    { phase: "Phase 1: Pilot (Current)", desc: "Deployed working MVP with Rajkot & Saurashtra districts, Gemini 1.5 Flash Vision verification, and Firestore live tracking." },
    { phase: "Phase 2: State Integration", desc: "API bridge with Digital Gujarat & e-Nagar database for auto-pulling DigiLocker verified certificates." },
    { phase: "Phase 3: National Scale", desc: "Expanding to 22 scheduled languages via Bhashini API integration, deployed across 4,00,000+ Common Service Centers (CSCs)." }
  ];

  phases.forEach((p, idx) => {
    const y = 4.25 + idx * 0.85;
    slide.addText(p.phase, {
      x: 1.1, y, w: 3.5, h: 0.3,
      fontSize: 11, bold: true, color: C_GREEN, fontFace: "Segoe UI"
    });
    slide.addText(p.desc, {
      x: 4.8, y, w: 7.2, h: 0.65,
      fontSize: 10, color: C_SLATE, fontFace: "Segoe UI"
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 10: Team JustCode & Conclusion
// ─────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: C_NAVY };

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 0.15,
    fill: { color: C_ORANGE }
  });

  slide.addText("MEET TEAM JUSTCODE", {
    x: 0.8, y: 0.6, w: 8, h: 0.4,
    fontSize: 12, bold: true, color: C_AMBER, fontFace: "Segoe UI"
  });
  slide.addText("Building Tech for Real Community Impact", {
    x: 0.8, y: 0.95, w: 10, h: 0.6,
    fontSize: 26, bold: true, color: C_WHITE, fontFace: "Segoe UI"
  });

  // Team Cards
  const teamMembers = [
    {
      name: "Hari Patel",
      role: "AI & Full-Stack Lead",
      tasks: "• Designed Gemini 1.5 Flash integration\n• Implemented Vision Document Verification API\n• Engineered Firestore application workflows\n• Developed Multilingual Voice Engine",
      college: "Atmiya University, Rajkot"
    },
    {
      name: "Jeet",
      role: "Systems & UI/UX Lead",
      tasks: "• Built Citizen & Officer Persona dashboards\n• Designed Responsive Gujarati Design System\n• Engineered Family Benefit Math & Pass\n• Managed Smart Kacheri GPS directory",
      college: "Atmiya University, Rajkot"
    }
  ];

  teamMembers.forEach((m, idx) => {
    const x = 0.8 + idx * 5.9;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.8, w: 5.6, h: 3.5, r: 0.2,
      fill: { color: "1E293B" }, line: { color: C_ORANGE, width: 1.5 }
    });
    slide.addText(m.name, {
      x: x + 0.4, y: 2.1, w: 4.8, h: 0.45,
      fontSize: 20, bold: true, color: C_WHITE, fontFace: "Segoe UI"
    });
    slide.addText(m.role, {
      x: x + 0.4, y: 2.55, w: 4.8, h: 0.35,
      fontSize: 12, bold: true, color: C_AMBER, fontFace: "Segoe UI"
    });
    slide.addText(m.college, {
      x: x + 0.4, y: 2.85, w: 4.8, h: 0.35,
      fontSize: 10, color: "94A3B8", fontFace: "Segoe UI"
    });
    slide.addText(m.tasks, {
      x: x + 0.4, y: 3.25, w: 4.8, h: 1.8,
      fontSize: 10, color: "E2E8F0", fontFace: "Segoe UI", lineSpacing: 16
    });
  });

  // Bottom Links
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 5.6, w: 11.6, h: 1.4, r: 0.15,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 }
  });
  slide.addText("PROJECT ARTIFACTS & LINKS:", {
    x: 1.1, y: 5.75, w: 5.0, h: 0.3,
    fontSize: 11, bold: true, color: C_AMBER, fontFace: "Segoe UI"
  });
  slide.addText("• GitHub Repository: https://github.com/hkPateL26/GDG\n• Live Demo: http://localhost:3000 (NagrikSeva AI)\n• Submission: GDG Build with AI: Code for Communities 2.0 (Rajkot)", {
    x: 1.1, y: 6.05, w: 11.0, h: 0.8,
    fontSize: 11, color: C_WHITE, fontFace: "Segoe UI"
  });
}

// Write the PPTX file
const outPptxPath = path.join(rootDir, "NagrikSeva_AI_Official_Presentation.pptx");
pptx.writeFile({ fileName: outPptxPath })
  .then(() => {
    console.log("Successfully generated PPTX at: " + outPptxPath);
  })
  .catch((err) => {
    console.error("Error writing PPTX:", err);
  });
