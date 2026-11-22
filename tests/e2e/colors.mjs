import { chromium } from "playwright-core";
import fs from "node:fs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const baseUrl = process.env.COLOR_TEST_URL ?? "http://localhost:3001";
const browser = await chromium.launch({ executablePath: fs.existsSync(edge) ? edge : undefined, headless: true });
const moods = { coffee: "#a8472f", pink: "#a63b67", purple: "#68499a", sky: "#2e6f8a" };
const surfaceRoutes = [
  { route: "/", surface: "mat", hasSwitcher: false },
  { route: "/gifts", surface: "notebook", hasSwitcher: true },
  { route: "/gifts/everyday-bag", surface: "notebook", hasSwitcher: true },
  { route: "/cart", surface: "notebook", hasSwitcher: true },
  { route: "/design-system", surface: "kraft", hasSwitcher: true },
];

try {
  for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    page.setDefaultTimeout(10_000);
    for (const { route, surface, hasSwitcher } of surfaceRoutes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      await page.waitForFunction((expected) => document.documentElement.dataset.plopSurface === expected, surface)
        .catch(() => { throw new Error(`${route}: expected data-plop-surface="${surface}"`); });
      const switcherCount = await page.locator(".palette-switcher").count();
      if (!hasSwitcher) {
        if (switcherCount !== 0) throw new Error(`${route}: expected no theme switcher, found ${switcherCount}`);
        continue;
      }
      const moodInputs = page.locator('input[name="storefront-palette"], input[name="lab-palette"]');
      await moodInputs.first().waitFor().catch(() => { throw new Error(`${route}: journal mood switcher was not rendered`); });
      for (const [mood, action] of Object.entries(moods)) {
        await page.locator(".palette-option").filter({ has: page.locator(`input[value="${mood}"]`) }).first().click();
        await page.waitForFunction((expected) => document.documentElement.dataset.journalPalette === expected, mood)
          .catch(() => { throw new Error(`${route}: selecting ${mood} did not update the document palette`); });
        const result = await page.evaluate(() => ({
          mood: document.documentElement.dataset.journalPalette,
          surface: document.documentElement.dataset.plopSurface,
          action: getComputedStyle(document.documentElement).getPropertyValue("--journal-action").trim(),
          canvas: getComputedStyle(document.documentElement).getPropertyValue("--journal-canvas").trim(),
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        }));
        if (result.mood !== mood) throw new Error(`${route}: expected ${mood}, received ${result.mood}`);
        if (result.surface !== surface) throw new Error(`${route}: expected surface ${surface}, received ${result.surface}`);
        if (result.action !== action) throw new Error(`${route}: ${mood} action was ${result.action}`);
        if (result.canvas !== "#f7eedb") throw new Error(`${route}: canvas changed to ${result.canvas}`);
        if (result.overflow) throw new Error(`${route}: ${mood} overflowed at ${viewport.width}px`);
      }
    }
    await page.close();
    console.log(`Color moods and surfaces passed at ${viewport.width}px.`);
  }
} finally {
  await browser.close();
}
