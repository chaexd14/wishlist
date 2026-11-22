import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright-core";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = process.env.RESPONSIVE_TEST_URL ?? "http://localhost:3000/design-system";
const outputDirectory = path.resolve(".impeccable/review/responsive");
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
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.emulateMedia({ reducedMotion: "reduce" });

    const result = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const overflowing = [...document.querySelectorAll("body *")]
        .filter((element) => {
          const style = getComputedStyle(element);
          if (style.position === "fixed" || style.display === "none") return false;
          if (element.closest(".Spinner_penStrip")) return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1);
        })
        .slice(0, 12)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            element: element.tagName.toLowerCase(),
            className: typeof element.className === "string" ? element.className : "",
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          };
        });

      return {
        viewportWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        overflowing,
      };
    });

    await page.screenshot({
      path: path.join(outputDirectory, `${viewport.name}.png`),
      fullPage: true,
    });

    const hasOverflow = result.documentWidth > result.viewportWidth + 1 || result.overflowing.length > 0;
    failed ||= hasOverflow;
    console.log(JSON.stringify({ viewport: viewport.name, ...result }, null, 2));
    await page.close();
  }
} finally {
  await browser.close();
}

if (failed) process.exitCode = 1;
