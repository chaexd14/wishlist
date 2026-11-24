import { chromium } from "playwright-core";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const baseUrl = process.env.PHASE_E_TEST_URL ?? "http://localhost:3001";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env.local", import.meta.url), "utf8").split(/\r?\n/).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
  const separator = line.indexOf("=");
  return [line.slice(0, separator), line.slice(separator + 1).replace(/^['"]|['"]$/g, "")];
}));
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const browser = await chromium.launch({ executablePath: fs.existsSync(edge) ? edge : undefined, headless: true });
const createdIds = [];
const cart = [{ id: "phase-e-bag", giftId: "everyday-bag", title: "Everyday bag", quantity: 1, maxQuantity: 1, availability: "available", selections: { color: "rose", size: "regular" }, customizations: {} }];

try {
  for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}/checkout`, { waitUntil: "domcontentloaded" });
    await page.evaluate((items) => localStorage.setItem("birthday-wishlist-cart-v1", JSON.stringify(items)), cart);
    await page.reload({ waitUntil: "networkidle" });
    await page.getByLabel(/note \(optional\)/i).fill("Please keep the ribbon.");
    await page.getByRole("button", { name: /send my birthday list/i }).click();
    await page.waitForURL(/\/confirmation\/[0-9a-f-]{36}$/i, { timeout: 20_000 });
    const submissionId = page.url().split("/").at(-1);
    createdIds.push(submissionId);
    await page.getByRole("heading", { name: /birthday wishes are on their way/i }).waitFor();
    await page.getByRole("heading", { name: "Everyday bag" }).waitFor();
    await page.getByText("Rose", { exact: true }).waitFor();
    await page.getByText("Regular", { exact: true }).waitFor();
    await page.getByText(/please keep the ribbon/i).waitFor();
    const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, cart: localStorage.getItem("birthday-wishlist-cart-v1") }));
    if (layout.overflow) throw new Error(`Confirmation overflowed at ${viewport.width}px.`);
    if (layout.cart !== "[]") throw new Error("Cart was not cleared after live submission.");
    await page.goto(`${baseUrl}/checkout`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: /open my saved confirmation/i }).waitFor();
    console.log(`Phase E confirmation passed at ${viewport.width}px.`);
    await page.close();
  }
} finally {
  if (createdIds.length) {
    await admin.from("submission_items").delete().in("submission_id", createdIds);
    await admin.from("submissions").delete().in("id", createdIds);
  }
  await browser.close();
}
