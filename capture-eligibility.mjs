import puppeteer from "puppeteer";
import path from "path";

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await page.goto("http://localhost:3000/eligibility", { waitUntil: "networkidle2" });
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

  await page.goto("http://localhost:3000/eligibility", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  const outPath = path.join("D:\\Movies and Web se\\atmiya\\perfect_screenshots", "09_eligibility_calculator.png");
  await page.screenshot({ path: outPath });
  console.log("Logged-in eligibility captured at:", outPath);

  await browser.close();
}

run().catch((e) => console.error(e));
