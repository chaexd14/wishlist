import { chromium } from "playwright-core";
import fs from "node:fs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const executablePath = fs.existsSync(edge) ? edge : undefined;
const baseUrl = process.env.PHASE_C_TEST_URL ?? "http://localhost:3001";
const browser = await chromium.launch({ executablePath, headless: true });
const allSizes = [
  { name: "phone", width: 375, height: 812 },
  { name: "ipad-portrait", width: 768, height: 1024 },
  { name: "ipad-landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 1000 },
];
const requestedSize = process.argv[2];
const sizes = requestedSize ? allSizes.filter((size) => size.name === requestedSize) : allSizes;

try {
  for (const size of sizes) {
    const page = await browser.newPage({ viewport: size });
    page.setDefaultTimeout(10_000);
    await page.goto(`${baseUrl}/gifts/everyday-bag`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.removeItem("birthday-wishlist-cart-v1"));
    await page.reload();
    await page.getByRole("button", { name: "Next gift view" }).click().catch(async () => {
      await page.locator(".gift-gallery__rail").evaluate((rail) => rail.scrollTo({ left: rail.clientWidth, behavior: "instant" }));
    });
    await page.getByRole("button", { name: "Add to my list" }).click();
    await page.getByText("Choose a color to continue.").waitFor();
    await page.getByText("Mocha", { exact: true }).click();
    await page.getByText("Regular", { exact: true }).click();
    await page.getByRole("button", { name: "Add to my list" }).click();
    await page.getByText("Saved with your choices.").waitFor();
    await page.goto(`${baseUrl}/cart`);
    await page.getByRole("heading", { name: "Everyday bag" }).waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (overflow) throw new Error(`${size.name} has horizontal overflow`);
    await page.close();
    console.log(`Passed ${size.name}`);
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultTimeout(10_000);
  await page.goto(`${baseUrl}/gifts/photo-book`, { waitUntil: "domcontentloaded" });
  await page.getByText("cannot be added to your list yet").waitFor();
  if (await page.getByRole("button", { name: "Add to my list" }).count()) throw new Error("Planned gift exposed add-to-cart action");
  console.log("Phase C detail and cart checks passed across phone, iPad, and desktop.");
} finally {
  await browser.close();
}
