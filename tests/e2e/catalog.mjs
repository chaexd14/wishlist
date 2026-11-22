import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright-core";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = process.env.CATALOG_TEST_URL ?? "http://localhost:3001";
const outputDirectory = path.resolve(".impeccable/review/catalog");
const viewports = [
  { name: "phone", width: 375, height: 812 },
  { name: "ipad-portrait", width: 768, height: 1024 },
  { name: "ipad-landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ executablePath: edgePath, headless: true });
let failed = false;

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}/gifts`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const initialCards = await page.locator(".gift-card").count();
    await page.getByRole("combobox", { name: /search the gift journal/i }).fill("journal");
    const searchedCards = await page.locator(".gift-card").count();
    await page.getByRole("combobox", { name: /search the gift journal/i }).fill("");
    await page.locator(".gift-catalog__filters button", { hasText: "Accessories" }).click();
    const categoryCards = await page.locator(".gift-card").count();
    await page.locator(".gift-catalog__filters button", { hasText: "All" }).click();

    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    const passed = initialCards === 6 && searchedCards === 1 && categoryCards === 2 && dimensions.documentWidth <= dimensions.viewportWidth + 1;
    failed ||= !passed;
    console.log(JSON.stringify({ viewport: viewport.name, initialCards, searchedCards, categoryCards, ...dimensions, passed }, null, 2));

    await page.screenshot({ path: path.join(outputDirectory, `${viewport.name}.png`), fullPage: true });
    await page.locator('.gift-card a[href="/gifts/everyday-bag"]').click();
    await page.waitForURL("**/gifts/everyday-bag");
    const detailOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    failed ||= detailOverflow;
    await page.close();
  }
} finally {
  await browser.close();
}

if (failed) process.exitCode = 1;
