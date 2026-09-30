import puppeteer from "puppeteer";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const FFMPEG_PATH = "D:\\DevTools\\ffmpeg\\bin\\ffmpeg.exe";
const ROOT_DIR = "D:\\Movies and Web se\\atmiya";
const WEBM_PATH = path.join(ROOT_DIR, "NagrikSeva_AI_Demo_Raw.webm");
const MP4_PATH = path.join(ROOT_DIR, "NagrikSeva_AI_Demo_Video.mp4");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function suppressPopups(page) {
  await page.evaluate(() => {
    try {
      localStorage.setItem("nagrik_app_version", "v2.5.8");
      sessionStorage.setItem("nagrik_splash_seen", "true");
    } catch {}
    let style = document.getElementById("nagrik-suppress-popups");
    if (!style) {
      style = document.createElement("style");
      style.id = "nagrik-suppress-popups";
      style.innerHTML = `
        [aria-label="Official Government Mandatory Update"],
        [aria-label="App Launching Splash Screen"] {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  });
}

async function injectDemoHud(page, stepBadge, titleEn, subtitleGu) {
  await suppressPopups(page);
  await page.evaluate(
    ({ stepBadge, titleEn, subtitleGu }) => {
      let hud = document.getElementById("nagrik-demo-hud");
      if (!hud) {
        hud = document.createElement("div");
        hud.id = "nagrik-demo-hud";
        hud.style.cssText = `
          position: fixed;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999999;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
          border: 2px solid #f59e0b;
          border-radius: 16px;
          padding: 10px 22px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          gap: 14px;
          color: #ffffff;
          font-family: system-ui, -apple-system, sans-serif;
          min-width: 660px;
          max-width: 90vw;
          pointer-events: none;
          transition: all 0.3s ease;
        `;
        document.body.appendChild(hud);
      }
      hud.innerHTML = `
        <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); color: #fff; font-weight: 900; font-size: 11.5px; padding: 6px 12px; border-radius: 10px; letter-spacing: 0.6px; white-space: nowrap; box-shadow: 0 4px 12px rgba(234,88,12,0.4);">
          ${stepBadge}
        </div>
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <div style="font-size: 14.5px; font-weight: 800; color: #f8fafc; letter-spacing: 0.2px;">
            ${titleEn}
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #fcd34d;">
            ${subtitleGu}
          </div>
        </div>
      `;
    },
    { stepBadge, titleEn, subtitleGu }
  );
}

async function smoothScroll(page, targetY, durationMs = 1800) {
  await page.evaluate(
    async ({ targetY, durationMs }) => {
      const startY = window.scrollY;
      const diff = targetY - startY;
      const steps = 35;
      const stepTime = durationMs / steps;
      for (let i = 1; i <= steps; i++) {
        const progress = i / steps;
        const ease =
          progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        window.scrollTo(0, startY + diff * ease);
        await new Promise((r) => setTimeout(r, stepTime));
      }
    },
    { targetY, durationMs }
  );
}

async function clickByText(page, selector, textSubstrings) {
  return await page.evaluate(
    ({ selector, textSubstrings }) => {
      const els = Array.from(document.querySelectorAll(selector));
      for (const el of els) {
        const txt = (el.innerText || el.textContent || "").trim();
        if (textSubstrings.some((sub) => txt.includes(sub))) {
          el.style.outline = "4px solid #f59e0b";
          el.style.outlineOffset = "3px";
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.click();
          return txt;
        }
      }
      return null;
    },
    { selector, textSubstrings }
  );
}

async function run() {
  const isVisible = process.argv.includes("--visible");
  console.log(`Starting 5-Minute NagrikSeva AI Full Prototype Demo Recording...`);

  const browser = await puppeteer.launch({
    headless: isVisible ? false : "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: { width: 1600, height: 900, deviceScaleFactor: 1 },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--window-size=1600,900",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });

  // Always suppress mandatory update modal & splash screen on every navigation
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem("nagrik_app_version", "v2.5.8");
      sessionStorage.setItem("nagrik_splash_seen", "true");
    } catch {}
    window.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.innerHTML = `
        [aria-label="Official Government Mandatory Update"],
        [aria-label="App Launching Splash Screen"] {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    });
  });

  // Pre-warm and fetch current buildHash so OfficialGovernmentUpdateModal stays closed
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("nagrik_app_version", "v2.5.8");
    sessionStorage.setItem("nagrik_splash_seen", "true");
    try {
      const r = await fetch("/api/version");
      const d = await r.json();
      if (d?.version) localStorage.setItem("nagrik_app_version", d.version);
      if (d?.buildHash) localStorage.setItem("nagrik_app_build_hash", d.buildHash);
    } catch {}
  });
  await page.reload({ waitUntil: "networkidle2" });
  await suppressPopups(page);
  await sleep(1000);

  // Start screencast
  const recorder = await page.screencast({
    path: WEBM_PATH,
    ffmpegPath: FFMPEG_PATH,
  });

  // =========================================================================
  // SCENE 1: Homepage Hero, Multilingual Governance & Overview
  // =========================================================================
  console.log("Scene 1/10: Homepage Hero & DPI Overview...");
  await injectDemoHud(
    page,
    "PART 1 / 10 • HOMEPAGE & MULTILINGUAL DPI",
    "NagrikSeva AI — Unified Digital Public Infrastructure for 70M+ Citizens",
    "નાગરિકસેવા AI: ગુજરાતી વોઈસ AI, 26+ સરકારી યોજનાઓ અને પેપરલેસ ગવર્નન્સ"
  );
  await sleep(3000);
  await smoothScroll(page, 520, 2200);
  await sleep(2500);
  await smoothScroll(page, 1100, 2200);
  await sleep(2500);
  await smoothScroll(page, 1650, 2200);
  await sleep(2500);
  await smoothScroll(page, 0, 1800);
  await sleep(1500);

  // =========================================================================
  // SCENE 2: 26+ Government Welfare Schemes Catalog (/schemes)
  // =========================================================================
  console.log("Scene 2/10: 26+ Welfare Schemes Catalog (/schemes)...");
  await page.goto("http://localhost:3000/schemes", { waitUntil: "networkidle2" });
  await injectDemoHud(
    page,
    "PART 2 / 10 • 26+ WELFARE SCHEMES CATALOG",
    "Cloud Firestore Live Scheme Repository with Statutory Rules & Category Filters",
    "ખેડૂત, આરોગ્ય, આવાસ, મહિલા અને શિક્ષણની ૨૬+ સરકારી યોજનાઓની સંપૂર્ણ માહિતી"
  );
  await sleep(2800);
  await smoothScroll(page, 480, 2000);
  await sleep(2500);
  await clickByText(page, "button", ["ખેડૂત", "Farmer", "આરોગ્ય"]);
  await sleep(2500);
  await smoothScroll(page, 900, 2000);
  await sleep(2500);
  await smoothScroll(page, 0, 1500);
  await sleep(1200);

  // =========================================================================
  // SCENE 3: Full-Screen Gemini 1.5 Flash AI Voice & Chat Assistant (/chat)
  // =========================================================================
  console.log("Scene 3/10: Gemini 1.5 Flash AI Voice & Chat Assistant (/chat)...");
  await page.goto("http://localhost:3000/chat", { waitUntil: "networkidle2" });
  await injectDemoHud(
    page,
    "PART 3 / 10 • GEMINI 1.5 FLASH VOICE & CHAT AI",
    "Multilingual Gujarati Voice & Chat Assistant — Scheme Eligibility & Live Tracking",
    "ગુજરાતીમાં બોલીને કે લખીને યોજનાના કાયદા અને અરજીનું લાઈવ સ્ટેટસ તપાસો"
  );
  await sleep(2500);
  await clickByText(page, "button", ["ખેડૂત યોજનાઓ", "Farmer Schemes"]);
  await sleep(4500);
  await smoothScroll(page, 400, 1500);
  await sleep(2500);
  await clickByText(page, "button", ["અરજી ટ્રેકિંગ", "Track Application"]);
  await sleep(4500);
  await smoothScroll(page, 700, 1500);
  await sleep(2500);

  // =========================================================================
  // SCENE 4: Citizen 2FA Aadhaar + Mobile OTP Login Flow (/documents)
  // =========================================================================
  console.log("Scene 4/10: Citizen 2FA OTP Authentication Flow...");
  await page.goto("http://localhost:3000/documents", { waitUntil: "networkidle2" });
  await injectDemoHud(
    page,
    "PART 4 / 10 • CITIZEN 2FA SSO LOGIN",
    "DPDP Act 2023 Compliant Aadhaar + Mobile Two-Factor OTP Authentication",
    "૧-ક્લિકમાં નાગરિકની વિગતો ભરો અને લાઈવ સરકારી SMS OTP વડે સુરક્ષિત લૉગિન કરો"
  );
  await sleep(2800);
  await clickByText(page, "button", ["ડેમો ભરો"]);
  await sleep(1800);
  await clickByText(page, "button", ["સુરક્ષિત OTP મેળવો", "Get Secure OTP"]);
  await sleep(3000);
  await injectDemoHud(
    page,
    "PART 4 / 10 • LIVE GOVT SMS OTP VERIFICATION",
    "Simulated Government SMS Gateway with 1-Click OTP Auto-Fill",
    "સરકારી SMS ગેટવે દ્વારા મળેલો ૬ આંકડાનો OTP આપોઆપ ભરીને સેવાઓ અનલૉક કરો"
  );
  await clickByText(page, "button", ["આપોઆપ ભરો"]);
  await sleep(2200);
  await clickByText(page, "button", ["સેવાઓ અનલૉક કરો", "Access All Services"]);
  await sleep(3200);

  // =========================================================================
  // SCENE 5: Document Service Portal & Gemini 1.5 Flash Vision OCR Scrutiny
  // =========================================================================
  console.log("Scene 5/10: Document Service Portal & Gemini Vision Auto-Verify...");
  await injectDemoHud(
    page,
    "PART 5 / 10 • GEMINI 1.5 FLASH VISION DOCUMENT OCR",
    "Auto-Fetching Citizen Profile & Pre-Validating Uploaded Documents in 3 Seconds",
    "હયાત દસ્તાવેજમાંથી ઓટો-ફેચ અને Gemini Vision AI દ્વારા દસ્તાવેજોની ખરાઈ (Zero Rejection)"
  );
  await sleep(2500);
  // Click "+ ૧-ક્લિક ડેમો ડેટા ભરો (Fast Demo)"
  await clickByText(page, "button", ["૧-ક્લિક ડેમો ડેટા ભરો", "Fast Demo"]);
  await sleep(2500);
  // Switch to "નવું કાર્ડ" / "નવી અરજી" so the 4 sample documents panel is visible
  await clickByText(page, "button", ["નવું કાર્ડ", "નવી અરજી"]);
  await sleep(2000);
  await smoothScroll(page, 650, 1800);
  await sleep(2000);
  await smoothScroll(page, 1350, 1800);
  await sleep(2000);

  // Click "⚡ ૧-ક્લિક ઓટો-ટેસ્ટ (Auto-Verify All)" to upload and analyze all 4 real documents
  await injectDemoHud(
    page,
    "PART 5 / 10 • LIVE AI VISION OCR VERIFICATION",
    "Uploading & Verifying Birth Certificate, PGVCL Electricity Bill & PAN Card via AI",
    "જન્મનો દાખલો, PGVCL લાઈટ બિલ અને PAN કાર્ડની AI દ્વારા લાઈવ ચકાસણી"
  );
  await clickByText(page, "button", ["૧-ક્લિક ઓટો-ટેસ્ટ", "Auto-Verify All"]);
  await sleep(5500);
  await smoothScroll(page, 1850, 2000);
  await sleep(3000);

  // =========================================================================
  // SCENE 6: Cyber Treasury UPI Payment & Official A4 Receipt Slip
  // =========================================================================
  console.log("Scene 6/10: Cyber Treasury Fee Payment & Official A4 Receipt Slip...");
  await injectDemoHud(
    page,
    "PART 6 / 10 • CYBER TREASURY & OFFICIAL A4 RECEIPT",
    "Bharat QR / UPI Fee Payment & Tamper-Proof A4 Government Acknowledgment Slip",
    "સાયબર ટ્રેઝરી ફી ચુકવણી, લાઈવ SMS એલર્ટ અને બારકોડ/QR વાળી સત્તાવાર સરકારી પહોંચ"
  );
  await smoothScroll(page, 2300, 1500);
  await sleep(1500);
  await clickByText(page, "button", ["આગળ વધો & સરકારી ફી ચૂકવો", "Proceed to Pay"]);
  await sleep(3000);
  // Confirm UPI payment inside modal
  await clickByText(page, "button", ["ચુકવણી સ્કેન થઈ ગઈ", "સત્તાવાર ઈ-રસીદ જનરેટ કરો"]);
  await sleep(3500);
  // Open Official A4 Receipt Slip Modal
  await clickByText(page, "button", ["સત્તાવાર સરકારી પહોંચ", "PDF ડાઉનલોડ"]);
  await sleep(4000);
  // Close receipt slip modal
  await clickByText(page, "button", ["બંધ કરો", "Close"]);
  await sleep(1500);

  // =========================================================================
  // SCENE 7: Citizen Track Vault & 5-Tier Workflow Status (/track)
  // =========================================================================
  console.log("Scene 7/10: Citizen Track Vault & 5-Tier Workflow Tracker (/track)...");
  await page.goto("http://localhost:3000/track", { waitUntil: "networkidle2" });
  await injectDemoHud(
    page,
    "PART 7 / 10 • CITIZEN DIGITAL VAULT & SLA TRACKER",
    "Real-Time 5-Tier Revenue Escalation Chain (VCE ➔ Talati ➔ Circle Officer ➔ Mamlatdar)",
    "તમારી અરજી કયા અધિકારીના ટેબલ પર છે તેનું લાઈવ ટ્રેકિંગ અને સત્તાવાર પ્રમાણપત્ર ડાઉનલોડ"
  );
  await sleep(2800);
  await smoothScroll(page, 450, 1800);
  await sleep(2800);
  await smoothScroll(page, 850, 1800);
  await sleep(2500);
  await clickByText(page, "button", ["રસીદ", "વિગત", "પ્રમાણપત્ર"]);
  await sleep(3500);
  await clickByText(page, "button", ["બંધ કરો", "Close"]);
  await sleep(1500);

  // =========================================================================
  // SCENE 8: Aadhaar e-KYC Family Benefit Calculator (/benefit-calculator)
  // =========================================================================
  console.log("Scene 8/10: Family DBT Benefit Calculator (/benefit-calculator)...");
  await page.goto("http://localhost:3000/benefit-calculator", { waitUntil: "networkidle2" });
  await injectDemoHud(
    page,
    "PART 8 / 10 • FAMILY DBT BENEFIT CALCULATOR",
    "UIDAI Aadhaar e-KYC Linked Family Ration Card & Annual Welfare Entitlement Engine",
    "આધાર e-KYC થી રેશનકાર્ડના સભ્યો ફેચ કરો અને કુટુંબને મળવાપાત્ર કુલ વાર્ષિક સહાય ગણો"
  );
  await sleep(2500);
  // Click "ડેમો ભરો" then "આધાર OTP મોકલો"
  await clickByText(page, "button", ["ડેમો ભરો"]);
  await sleep(1500);
  await clickByText(page, "button", ["આધાર OTP મોકલો", "Verify e-KYC"]);
  await sleep(2000);
  // Enter OTP 123456
  const otpInput = await page.$('input[placeholder="123456"]');
  if (otpInput) {
    await otpInput.type("123456", { delay: 120 });
  }
  await sleep(1200);
  await clickByText(page, "button", ["પ્રમાણિત કરો"]);
  await sleep(3000);
  await smoothScroll(page, 480, 1800);
  await sleep(2200);
  // Toggle additional family conditions to show dynamic DBT calculation
  await clickByText(page, "button, div", ["કાચું મકાન", "PM આવાસ યોજના"]);
  await sleep(1800);
  await clickByText(page, "button, div", ["કુટુંબમાં દીકરી છે", "વહાલી દીકરી"]);
  await sleep(2500);
  await smoothScroll(page, 0, 1500);
  await sleep(2000);

  // =========================================================================
  // SCENE 9: 33-District Smart Kacheri GPS Navigator (/locator)
  // =========================================================================
  console.log("Scene 9/10: 33-District Smart Kacheri GPS Locator (/locator)...");
  await page.goto("http://localhost:3000/locator", { waitUntil: "networkidle2" });
  await injectDemoHud(
    page,
    "PART 9 / 10 • 33-DISTRICT SMART KACHERI GPS LOCATOR",
    "Geocoded Jan Seva Kendras & Mamlatdar Offices with Timings, Services & Maps Routing",
    "ગુજરાતના તમામ ૩૩ જિલ્લાની મામલતદાર કચેરી, જન સેવા કેન્દ્ર, ફોન નંબર અને Google Maps રસ્તો"
  );
  await sleep(2500);
  await clickByText(page, "button", ["Rajkot", "રાજકોટ", "Ahmedabad"]);
  await sleep(2500);
  await smoothScroll(page, 500, 1800);
  await sleep(2800);
  await smoothScroll(page, 0, 1400);
  await sleep(1500);

  // =========================================================================
  // SCENE 10: 5-Tier Mamlatdar Officer Scrutiny Desk & Digital Certificate (/admin)
  // =========================================================================
  console.log("Scene 10/10: 5-Tier Mamlatdar Officer Scrutiny Desk & Final Certificate (/admin)...");
  await page.evaluate(() => {
    sessionStorage.setItem(
      "nagrik_officer_session",
      JSON.stringify({
        id: "OFF-MAM-01",
        name: "H. V. Patel, GAS",
        designation: "મામલતદાર (Mamlatdar)",
        district: "Rajkot",
        taluka: "Gondal",
      })
    );
  });
  await page.goto("http://localhost:3000/admin?mode=officer", { waitUntil: "networkidle2" });
  await injectDemoHud(
    page,
    "PART 10 / 10 • MAMLATDAR REVENUE OFFICER SCRUTINY DESK",
    "5-Tier Administrative Hierarchy, AI SLA Bottleneck Monitor & 1-Click e-Sign Approval",
    "મામલતદાર અધિકારી ડેશબોર્ડ: AI SLA મોનિટરિંગ, દસ્તાવેજ ખરાઈ અને ૧-ક્લિક ડિજિટલ સહી (e-Sign)"
  );
  await sleep(3000);
  await smoothScroll(page, 520, 1800);
  await sleep(2800);

  // Click "ફાઇલ ખોલો" to open the Officer Scrutiny Review Modal
  await injectDemoHud(
    page,
    "PART 10 / 10 • OFFICER FILE SCRUTINY & AI OCR INSPECTION",
    "Inspecting Citizen Documents Pre-Verified by Gemini 1.5 Flash Vision (95% Match)",
    "અધિકારી દ્વારા નાગરિકની ફાઈલ અને AI દ્વારા ચકાસાયેલા પુરાવાઓનું નિરીક્ષણ"
  );
  await clickByText(page, "button", ["ફાઇલ ખોલો"]);
  await sleep(3500);

  // Click "ડિજિટલ સહી (e-Sign) મંજૂર કરો" or "સત્તાવાર પ્રમાણપત્ર જુઓ / પ્રિન્ટ"
  await injectDemoHud(
    page,
    "FINAL OUTPUT • MAMLATDAR DIGITAL e-SIGN & ORIGINAL CERTIFICATE",
    "1-Click Digital Signature Issues QR-Verified Official Government Certificate",
    "મામલતદારની ડિજિટલ સહી થતાં જ QR કોડ અને બારકોડ સાથેનું ઓરિજિનલ પ્રમાણપત્ર તૈયાર!"
  );
  const clickedEsign = await clickByText(page, "button", [
    "ડિજિટલ સહી (e-Sign) મંજૂર કરો",
    "સત્તાવાર પ્રમાણપત્ર જુઓ",
    "સત્તાવાર પ્રમાણપત્ર",
  ]);
  console.log("Clicked Officer e-Sign / Certificate button:", clickedEsign);
  await sleep(4500);

  // If the certificate modal isn't open yet, click "સત્તાવાર પ્રમાણપત્ર" directly
  await clickByText(page, "button", ["સત્તાવાર પ્રમાણપત્ર જુઓ", "સત્તાવાર પ્રમાણપત્ર", "પ્રમાણપત્ર"]);
  await sleep(5000);

  await recorder.stop();
  await browser.close();

  // Inspect raw WebM duration using ffmpeg
  let rawDurationSec = 180;
  try {
    execFileSync(FFMPEG_PATH, ["-i", WEBM_PATH], { stdio: "pipe" });
  } catch (e) {
    const stderr = (e.stderr || "").toString();
    const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      rawDurationSec =
        parseInt(match[1], 10) * 3600 +
        parseInt(match[2], 10) * 60 +
        parseFloat(match[3]);
    }
  }

  // Target 300 seconds (5 minutes 00 seconds)
  const targetSeconds = 300;
  const ptsFactor = Math.max(1.0, Math.min(2.6, targetSeconds / rawDurationSec)).toFixed(4);
  console.log(
    `Raw WebM Duration: ${rawDurationSec.toFixed(1)}s -> Stretching with setpts=${ptsFactor}*PTS to reach ~5 minutes...`
  );

  execFileSync(FFMPEG_PATH, [
    "-y",
    "-i",
    WEBM_PATH,
    "-filter:v",
    `setpts=${ptsFactor}*PTS,fps=24`,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "fast",
    "-crf",
    "23",
    "-movflags",
    "+faststart",
    MP4_PATH,
  ]);

  const stat = fs.statSync(MP4_PATH);
  console.log(
    `✅ 5-Minute Demo Video Created: ${MP4_PATH} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`
  );
}

run().catch((err) => {
  console.error("Error recording demo video:", err);
  process.exit(1);
});
