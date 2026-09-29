import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, "..", "presentation.html");
const pdfPath = path.resolve(__dirname, "..", "NagrikSeva_AI_Official_Deck.pdf");

console.log("Launching Puppeteer for high-res PDF generation...");
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]
});

const page = await browser.newPage();
await page.setViewport({ width: 1536, height: 864, deviceScaleFactor: 2 });
await page.goto("file:///" + htmlPath.replace(/\\/g, "/"), { waitUntil: "networkidle0" });

console.log("Exporting to PDF: 16in x 9in landscape...");
await page.pdf({
  path: pdfPath,
  width: "16in",
  height: "9in",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0in", right: "0in", bottom: "0in", left: "0in" }
});

await browser.close();
console.log("PDF export complete! Saved to:", pdfPath);
