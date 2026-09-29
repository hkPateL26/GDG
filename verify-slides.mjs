import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, "..", "presentation.html");
const outDir = path.resolve(__dirname, "..", "preview_verify");

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]
});

const page = await browser.newPage();
await page.setViewport({ width: 1536, height: 864, deviceScaleFactor: 1 });
await page.goto("file:///" + htmlPath.replace(/\\/g, "/"), { waitUntil: "networkidle0" });

const slideIds = ["slide-2", "slide-3", "slide-7", "slide-13", "slide-14", "slide-15"];
for (const id of slideIds) {
  const el = await page.$(`#${id}`);
  if (el) {
    await el.screenshot({ path: path.join(outDir, `${id}.png`) });
    console.log(`Captured ${id}`);
  }
}

await browser.close();
console.log("Done capturing verification previews!");
