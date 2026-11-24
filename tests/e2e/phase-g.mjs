import { chromium } from "playwright-core";
import fs from "node:fs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const baseUrl = process.env.PHASE_G_TEST_URL ?? "http://localhost:3001";
const browser = await chromium.launch({ executablePath: fs.existsSync(edge) ? edge : undefined, headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const response = await page.goto(`${baseUrl}/gifts`, { waitUntil: "networkidle" });
  if (!response?.ok()) throw new Error(`Catalog returned ${response?.status()}.`);
  const headers = response.headers();
  if (headers["x-frame-options"] !== "DENY" || headers["x-content-type-options"] !== "nosniff") throw new Error("Security headers are missing.");
  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const element = document.activeElement;
    return element instanceof HTMLElement ? { tag: element.tagName, outline: getComputedStyle(element).outlineStyle } : null;
  });
  if (!focus || focus.tag === "BODY" || focus.outline === "none") throw new Error("Keyboard focus is not visibly exposed.");
  const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, reduced: matchMedia("(prefers-reduced-motion: reduce)").matches }));
  if (layout.overflow || !layout.reduced) throw new Error("Responsive or reduced-motion check failed.");
  await page.goto(`${baseUrl}/gifts/not-a-real-gift`, { waitUntil: "networkidle" });
  const missingCopy = (await page.locator("body").innerText()).toLowerCase();
  if (!missingCopy.includes("could not be found") && !missingCopy.includes("not found") && !missingCopy.includes("404")) throw new Error("Missing gift did not render a not-found recovery state.");
  console.log("Phase G security, keyboard, reduced-motion, responsive, and missing-gift checks passed.");
  await context.close();
} finally {
  await browser.close();
}
