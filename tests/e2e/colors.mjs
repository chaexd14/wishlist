import { chromium } from "playwright-core";
import fs from "node:fs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const baseUrl = process.env.COLOR_TEST_URL ?? "http://localhost:3001";
const browser = await chromium.launch({ executablePath: fs.existsSync(edge) ? edge : undefined, headless: true });
const surfaceRoutes = [
  { route: "/", surface: "mat" },
  { route: "/gifts", surface: "notebook" },
  { route: "/gifts/everyday-bag", surface: "notebook" },
  { route: "/cart", surface: "notebook" },
  { route: "/design-system", surface: "kraft" },
];

try {
  for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    page.setDefaultTimeout(10_000);
    for (const { route, surface } of surfaceRoutes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      await page.waitForFunction((expected) => document.documentElement.dataset.plopSurface === expected, surface)
        .catch(() => { throw new Error(`${route}: expected data-plop-surface="${surface}"`); });
      const switcherCount = await page.locator(".palette-switcher").count();
      if (switcherCount !== 0) throw new Error(`${route}: expected no theme switcher, found ${switcherCount}`);
      const result = await page.evaluate(() => ({
        palette: document.documentElement.dataset.journalPalette,
        surface: document.documentElement.dataset.plopSurface,
        action: getComputedStyle(document.documentElement).getPropertyValue("--journal-action").trim(),
        focus: getComputedStyle(document.documentElement).getPropertyValue("--journal-focus").trim(),
        canvas: getComputedStyle(document.documentElement).getPropertyValue("--journal-canvas").trim(),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }));
      if (result.palette !== "pink") throw new Error(`${route}: expected pink, received ${result.palette}`);
      if (result.surface !== surface) throw new Error(`${route}: expected surface ${surface}, received ${result.surface}`);
      if (result.action !== "#a63b67") throw new Error(`${route}: action was ${result.action}`);
      if (result.focus !== "#71304d") throw new Error(`${route}: focus was ${result.focus}`);
      if (result.canvas !== "#f7eedb") throw new Error(`${route}: canvas changed to ${result.canvas}`);
      if (result.overflow) throw new Error(`${route}: overflowed at ${viewport.width}px`);
    }
    await page.close();
    console.log(`Pink palette and surfaces passed at ${viewport.width}px.`);
  }
} finally {
  await browser.close();
}
