import puppeteer from "puppeteer";
import sharp from "sharp";
import path from "path";

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("nagrik_app_version", "v2.5.8");
    sessionStorage.setItem("nagrik_splash_seen", "true");
    window.addEventListener("DOMContentLoaded", () => {
      const s = document.createElement("style");
      s.innerHTML =
        '[aria-label="Official Government Mandatory Update"], [aria-label="App Launching Splash Screen"], .fixed.bottom-4 { display: none !important; }';
      document.head.appendChild(s);
    });
  });

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });
  await page.evaluate(async () => {
    try {
      const r = await fetch("/api/version");
      const d = await r.json();
      if (d?.version) localStorage.setItem("nagrik_app_version", d.version);
      if (d?.buildHash) localStorage.setItem("nagrik_app_build_hash", d.buildHash);
    } catch {}
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
  await new Promise((r) => setTimeout(r, 1500));

  // 1. Open File Review Modal -> Click "સરકારી ચુકવણી પાવતી જુઓ" to open Official Receipt Slip
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    for (const b of btns) {
      if ((b.innerText || "").includes("ફાઇલ ખોલો")) {
        b.click();
        break;
      }
    }
  });
  await new Promise((r) => setTimeout(r, 1000));

  const clickedReceipt = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    for (const b of btns) {
      if ((b.innerText || "").includes("સરકારી ચુકવણી પાવતી જુઓ") || (b.innerText || "").includes("પાવતી જુઓ")) {
        b.click();
        return b.innerText;
      }
    }
    return null;
  });
  console.log("Clicked receipt button:", clickedReceipt);
  await new Promise((r) => setTimeout(r, 1200));
  const receiptBuf = await page.screenshot({ type: "png" });

  // 2. Reload /admin and click "સત્તાવાર પ્રમાણપત્ર" to open Official Government Certificate
  await page.goto("http://localhost:3000/admin?mode=officer", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  const clickedCert = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    for (const b of btns) {
      if ((b.innerText || "").includes("સત્તાવાર પ્રમાણપત્ર")) {
        b.click();
        return b.innerText;
      }
    }
    return null;
  });
  console.log("Clicked certificate button:", clickedCert);
  await new Promise((r) => setTimeout(r, 1200));
  const certBuf = await page.screenshot({ type: "png" });

  await browser.close();

  const leftCrop = await sharp(receiptBuf)
    .extract({ left: 520, top: 20, width: 1840, height: 1860 })
    .resize(1410, 1740, { fit: "contain", background: { r: 15, g: 23, b: 42, alpha: 1 } })
    .toBuffer();

  const rightCrop = await sharp(certBuf)
    .extract({ left: 520, top: 80, width: 1840, height: 1740 })
    .resize(1410, 1740, { fit: "contain", background: { r: 15, g: 23, b: 42, alpha: 1 } })
    .toBuffer();

  const outPath = path.join(
    "D:\\Movies and Web se\\atmiya\\perfect_screenshots",
    "10_receipt_or_detail.png"
  );
  await sharp({
    create: {
      width: 2880,
      height: 1800,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 },
    },
  })
    .composite([
      { input: leftCrop, left: 20, top: 30 },
      { input: rightCrop, left: 1450, top: 30 },
    ])
    .png()
    .toFile(outPath);

  console.log("Saved side-by-side Receipt + Certificate to:", outPath);
}

run().catch((e) => console.error(e));
