#!/usr/bin/env node

const puppeteer = require("puppeteer-core");
const KnownDevices = puppeteer.KnownDevices;
const iPhone = KnownDevices["iPhone 14 Pro"];
const sharp = require("sharp");
const { mkdir } = require("fs/promises");
const { existsSync } = require("fs");
const { join } = require("path");
const { homedir } = require("os");

const VIEWPORTS = [
  { width: 1456, height: 816, name: "desktop" },
  { width: 390, height: 844, name: "mobile" },
];

const CHROME_PATH = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = process.env.OUTPUT_DIR || join(homedir(), "Downloads", "screenshots");

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return "screenshot";
  }
}

async function captureScreenshots(url, outputDir, baseName) {
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH,
  });

  const savedFiles = [];

  try {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage();

      if (viewport.name === "mobile") {
        // Émulation mobile complète (User-Agent + viewport + touch)
        await page.emulate(iPhone);
      } else {
        // Desktop : viewport simple
        await page.setViewport({
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: 2,
        });
      }

      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

      const screenshotBuffer = await page.screenshot({
        type: "png",
        fullPage: false,
      });

      const outputPath = `${outputDir}/${baseName}-${viewport.name}.png`;
      await sharp(screenshotBuffer)
        .png({ compressionLevel: 9 })
        .toFile(outputPath);

      savedFiles.push(outputPath);
      await page.close();
    }
  } finally {
    await browser.close();
  }

  return savedFiles;
}

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error(JSON.stringify({ error: "URL is required" }));
    process.exit(1);
  }

  let validUrl = url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    validUrl = `https://${url}`;
  }

  try {
    new URL(validUrl);
  } catch {
    console.error(JSON.stringify({ error: "Invalid URL" }));
    process.exit(1);
  }

  try {
    const baseName = extractDomain(validUrl);
    const files = await captureScreenshots(validUrl, OUTPUT_DIR, baseName);
    console.log(JSON.stringify({ success: true, files }));
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

main();
