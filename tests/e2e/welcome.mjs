import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright-core";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = process.env.WELCOME_TEST_URL ?? "http://localhost:3001";
const outputDirectory = path.resolve(".impeccable/review/welcome");
const allViewports = [
  { name: "phone", width: 375, height: 812 },
  { name: "ipad-portrait", width: 768, height: 1024 },
  { name: "ipad-landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
];
const requestedViewport = process.argv[2];
const viewports = requestedViewport ? allViewports.filter((viewport) => viewport.name === requestedViewport) : allViewports;

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ executablePath: edgePath, headless: true });
let failed = false;

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.removeItem("birthday-wishlist-welcome-v1"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    await page.getByRole("button", { name: /open your birthday letter/i }).click();
    await page.locator('.envelope-scene[data-stage="reading"]').waitFor();
    await page.locator(".welcome-letter-continue button").click();
    if (viewport.name === "phone") {
      await page.locator("#welcome-email").fill("not-an-email");
      await page.locator(".welcome-email__form button[type=submit]").click();
      const hasEmailError = await page.getByText(/enter a complete email address/i).isVisible();
      failed ||= !hasEmailError;
      await page.locator("#welcome-email").fill("HER@Example.COM");
      await page.locator(".welcome-email__form button[type=submit]").click();
      const savedEmail = await page.locator(".welcome-email__saved span").textContent();
      failed ||= savedEmail !== "her@example.com";
      console.log(JSON.stringify({ viewport: viewport.name, hasEmailError, savedEmail }, null, 2));
    } else {
      await page.locator("button.welcome-text-button", { hasText: "Skip for now" }).click();
    }
    await page.getByRole("button", { name: /peel the birthday sticker/i }).click();

    const result = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      hasLetter: document.querySelector(".birthday-letter") !== null,
      hasCatalogAction: [...document.querySelectorAll("button")].some((button) => button.textContent?.includes("Open my wishlist")),
    }));

    await page.screenshot({ path: path.join(outputDirectory, `${viewport.name}.png`), fullPage: true });
    const passed = result.documentWidth <= result.viewportWidth + 1 && result.hasLetter && result.hasCatalogAction;
    failed ||= !passed;
    console.log(JSON.stringify({ viewport: viewport.name, ...result, passed }, null, 2));

    await page.getByRole("button", { name: /open my wishlist/i }).click();
    await page.waitForURL("**/gifts");
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    const hasReturnShortcut = await page.getByRole("button", { name: /continue to my wishlist/i }).isVisible();
    failed ||= !hasReturnShortcut;
    console.log(JSON.stringify({ viewport: viewport.name, hasReturnShortcut }, null, 2));
    await page.close();
  }
} finally {
  await browser.close();
}

if (failed) process.exitCode = 1;
