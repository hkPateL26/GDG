import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const rootDir = "D:\\Movies and Web se\\atmiya";
const outDir = path.join(rootDir, "perfect_screenshots");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log("1. Capturing Homepage Hero & Chatbot...");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });
  await page.screenshot({ path: path.join(outDir, "01_home_hero.png"), fullPage: false });

  // Open Chatbot and send a tracking query
  console.log("2. Capturing Chatbot with Tracking & Voice UI...");
  try {
    // Look for chatbot toggle button if any
    const chatBtn = await page.$("button[aria-label*='chat' i], button:has(svg), .fixed button");
    if (chatBtn) {
      await chatBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
    }
  } catch (e) {
    console.log("Chatbot auto-click note:", e.message);
  }
  await page.screenshot({ path: path.join(outDir, "02_voice_chat.png"), fullPage: false });

  // 3. Citizen Login Shield (OTP screen)
  console.log("3. Capturing Citizen OTP Login Shield...");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto("http://localhost:3000/documents", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, "03_login_otp.png"), fullPage: false });

  // 4. Logged-in Citizen Track Vault
  console.log("4. Capturing Logged-in Track Vault...");
  await page.evaluate(() => {
    localStorage.setItem(
      "nagrik_citizen_session",
      JSON.stringify({
        mobile: "9974442291",
        citizenName: "Ramesh Patel",
        citizenNameGu: "રમેશ પટેલ",
        district: "Rajkot",
        districtGu: "રાજકોટ",
        taluka: "Gondal",
        village: "Gondal Rural",
        aadhaarLast4: "1413",
        annualIncome: 180000,
        occupation: "farmer",
        category: "OBC",
        hasLand: true,
        hasBPL: false,
        availedBenefits: [
          { schemeId: "pm-kisan", schemeName: "PM Kisan", amount: 6000, date: "2026-01-15" }
        ]
      })
    );
  });
  await page.goto("http://localhost:3000/track", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, "04_track_vault.png"), fullPage: false });

  // 5. Document Service Portal (Logged-in)
  console.log("5. Capturing Document Service Portal...");
  await page.goto("http://localhost:3000/documents", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, "05_doc_portal.png"), fullPage: false });

  // 6. Officer Scrutiny Portal (/admin)
  console.log("6. Capturing Officer / Mamlatdar Scrutiny Portal...");
  await page.evaluate(() => {
    sessionStorage.setItem(
      "nagrik_officer_session",
      JSON.stringify({
        id: "OFF-MAM-01",
        name: "H. V. Patel, GAS",
        designation: "મામલતદાર (Mamlatdar)",
        district: "Rajkot",
        taluka: "Gondal"
      })
    );
  });
  await page.goto("http://localhost:3000/admin?mode=officer", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, "06_officer_admin.png"), fullPage: false });

  // 7. Family Benefit Calculator
  console.log("7. Capturing Family Benefit Calculator...");
  await page.goto("http://localhost:3000/benefit-calculator", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, "07_benefit_calculator.png"), fullPage: false });

  // 8. Smart Kacheri GPS Locator
  console.log("8. Capturing Smart Kacheri GPS Locator...");
  await page.goto("http://localhost:3000/locator", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, "08_kacheri_locator.png"), fullPage: false });

  await browser.close();
  console.log("All perfect screenshots captured successfully in:", outDir);
}

run().catch((err) => {
  console.error("Puppeteer error:", err);
  process.exit(1);
});
