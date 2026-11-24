import { chromium } from "playwright-core";
import fs from "node:fs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const baseUrl = process.env.PHASE_F_TEST_URL ?? "http://localhost:3001";
const browser = await chromium.launch({ executablePath: fs.existsSync(edge) ? edge : undefined, headless: true });

try {
  for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
    await page.waitForURL(/\/auth\/login\?next=%2Fadmin|\/auth\/login\?next=\/admin/);
    await page.getByRole("heading", { name: /open the wishlist studio/i }).waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (overflow) throw new Error(`Admin login overflowed at ${viewport.width}px.`);
    console.log(`Phase F route protection passed at ${viewport.width}px.`);
    await page.close();
  }
} finally {
  await browser.close();
}
