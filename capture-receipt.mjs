import puppeteer from "puppeteer";
import path from "path";

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });

  await page.goto("http://localhost:3000/track", { waitUntil: "networkidle2" });
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
        aadhaarLast4: "1413"
      })
    );
  });

  await page.goto("http://localhost:3000/track", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  // Find receipt buttons
  const buttons = await page.$$("button");
  let clicked = false;
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text && (text.includes("રસીદ") || text.includes("વિગત") || text.includes("ટ્રેક"))) {
      await b.click();
      clicked = true;
      await new Promise((r) => setTimeout(r, 1200));
      break;
    }
  }

  const outPath = path.join("D:\\Movies and Web se\\atmiya\\perfect_screenshots", "10_receipt_or_detail.png");
  await page.screenshot({ path: outPath });
  console.log("Captured at:", outPath, "clicked:", clicked);

  await browser.close();
}

run().catch((e) => console.error(e));
