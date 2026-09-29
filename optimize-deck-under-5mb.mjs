import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "perfect_screenshots");
const optDir = path.join(rootDir, "perfect_screenshots_opt");

if (!fs.existsSync(optDir)) {
  fs.mkdirSync(optDir, { recursive: true });
}

// Convert all screenshots to high-quality compressed JPEG (width: 1080, quality: 68)
const files = fs.readdirSync(srcDir).filter(f => f.endsWith(".png"));
for (const file of files) {
  const inPath = path.join(srcDir, file);
  const outPath = path.join(optDir, file);
  await sharp(inPath)
    .resize({ width: 960, withoutEnlargement: true })
    .jpeg({ quality: 55, mozjpeg: true })
    .toFile(outPath.replace(/\.png$/, ".jpg"));
  console.log(`Optimized ${file} -> .jpg`);
}

// Create an optimized presentation HTML that points to the .jpg images and eliminates print raster bloat
let html = fs.readFileSync(path.join(rootDir, "presentation.html"), "utf-8");
html = html.replace(/\.\/perfect_screenshots\/([a-zA-Z0-9_-]+)\.png/g, "./perfect_screenshots_opt/$1.jpg");
html = html.replace("./team_logo.jpg", "./team_logo_opt.jpg");

// Inject print optimization CSS
const printOptCSS = `
<style>
@media print {
  * {
    box-shadow: none !important;
    text-shadow: none !important;
    filter: none !important;
    backdrop-filter: none !important;
  }
  .card {
    border: 1px solid #cbd5e1 !important;
  }
  .card-dark {
    border: 1px solid #334155 !important;
  }
  .hero-mockup-frame {
    border: 1.5px solid #334155 !important;
  }
}
</style>
`;
html = html.replace("</head>", printOptCSS + "\n</head>");

const optHtmlPath = path.join(rootDir, "presentation_opt.html");
fs.writeFileSync(optHtmlPath, html, "utf-8");

// Generate PDF
console.log("Generating Under-5MB PDF with Puppeteer...");
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]
});
const page = await browser.newPage();
await page.setViewport({ width: 1536, height: 864, deviceScaleFactor: 1 });
await page.goto("file:///" + optHtmlPath.replace(/\\/g, "/"), { waitUntil: "networkidle0" });

const targetPdf = path.join(rootDir, "NagrikSeva_AI_Official_Deck.pdf");
await page.pdf({
  path: targetPdf,
  width: "16in",
  height: "9in",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0in", right: "0in", bottom: "0in", left: "0in" }
});
await browser.close();

const stats = fs.statSync(targetPdf);
console.log(`Final PDF size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
