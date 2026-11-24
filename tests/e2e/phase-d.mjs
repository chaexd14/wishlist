import { chromium } from "playwright-core";
import fs from "node:fs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const baseUrl = process.env.PHASE_D_TEST_URL ?? "http://localhost:3001";
const browser = await chromium.launch({ executablePath: fs.existsSync(edge) ? edge : undefined, headless: true });
const cart = [{
  id: "phase-d-bag",
  giftId: "everyday-bag",
  title: "Everyday bag",
  quantity: 1,
  maxQuantity: 1,
  availability: "available",
  selections: { color: "rose", size: "regular" },
  customizations: {},
}];

try {
  for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}/cart`, { waitUntil: "domcontentloaded" });
    await page.evaluate((items) => localStorage.setItem("birthday-wishlist-cart-v1", JSON.stringify(items)), cart);
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("link", { name: /review and send/i }).click();
    await page.waitForURL("**/checkout");
    await page.getByRole("heading", { name: /review my birthday list/i }).waitFor();

    const invalidResponse = await page.evaluate(async () => {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: [] }) });
      return { status: response.status, body: await response.json() };
    });
    if (invalidResponse.status !== 422 || !invalidResponse.body.error) throw new Error(`Expected a helpful 422 response, received ${JSON.stringify(invalidResponse)}`);

    await page.route("**/api/submissions", (route) => route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: "00000000-0000-0000-0000-000000000001", reference: "BDAYTEST01" }) }));
    await page.getByRole("button", { name: /send my birthday list/i }).click();
    await page.waitForURL("**/confirmation/00000000-0000-0000-0000-000000000001");
    const result = await page.evaluate(() => ({ cart: localStorage.getItem("birthday-wishlist-cart-v1"), overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth }));
    if (result.cart !== "[]") throw new Error("The local cart was not cleared after a successful submission.");
    if (result.overflow) throw new Error(`Checkout overflowed at ${viewport.width}px.`);
    console.log(`Phase D checkout passed at ${viewport.width}px.`);
    await page.close();
  }
} finally {
  await browser.close();
}
