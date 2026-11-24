import { chromium } from "playwright-core";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const baseUrl = process.env.PHASE_H_TEST_URL ?? "http://localhost:3001";
const password = process.env.PHASE_H_ADMIN_PASSWORD;
if (!password) throw new Error("PHASE_H_ADMIN_PASSWORD is required.");
const security = Object.fromEntries(fs.readFileSync(new URL("../../.env.development.local", import.meta.url), "utf8").split(/\r?\n/).filter((line) => line.includes("=")).map((line) => {
  const separator = line.indexOf("="); return [line.slice(0, separator), line.slice(separator + 1)];
}));
const email = security.ADMIN_EMAILS.split(",")[0];
const project = Object.fromEntries(fs.readFileSync(new URL("../../.env.local", import.meta.url), "utf8").split(/\r?\n/).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => { const separator = line.indexOf("="); return [line.slice(0, separator), line.slice(separator + 1).replace(/^['"]|['"]$/g, "")]; }));
const supabase = createClient(project.NEXT_PUBLIC_SUPABASE_URL, project.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const browser = await chromium.launch({ executablePath: fs.existsSync(edge) ? edge : undefined, headless: true });
const createdIds = [];

try {
  const recipient = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const recipientPage = await recipient.newPage();
  const inviteResponse = await recipientPage.goto(`${baseUrl}/invite`, { waitUntil: "domcontentloaded" });
  if (inviteResponse?.status() !== 404) throw new Error(`Expected /invite to return 404, got ${inviteResponse?.status()}.`);
  await recipientPage.goto(`${baseUrl}/gifts`, { waitUntil: "networkidle" });
  await recipientPage.waitForURL(`${baseUrl}/gifts`);
  await recipientPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await recipientPage.getByRole("heading", { name: /birthday letter/i }).waitFor();
  await recipientPage.goto(`${baseUrl}/checkout`, { waitUntil: "domcontentloaded" });
  await recipientPage.evaluate(() => localStorage.setItem("birthday-wishlist-cart-v1", JSON.stringify([{ id: "phase-h-bag", giftId: "everyday-bag", title: "Everyday bag", quantity: 1, maxQuantity: 1, availability: "available", selections: { color: "rose", size: "regular" }, customizations: {} }])));
  await recipientPage.reload({ waitUntil: "networkidle" });
  await recipientPage.getByLabel(/note \(optional\)/i).fill("Final release verification");
  await recipientPage.getByRole("button", { name: /send my birthday list/i }).click();
  await recipientPage.waitForURL(/\/confirmation\/[0-9a-f-]{36}$/i, { timeout: 20_000 });
  createdIds.push(recipientPage.url().split("/").at(-1));
  await recipientPage.getByRole("heading", { name: /birthday wishes are on their way/i }).waitFor();
  await recipientPage.getByText("Rose", { exact: true }).waitFor();
  const recipientOverflow = await recipientPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (recipientOverflow) throw new Error("Recipient storefront overflowed on phone.");
  console.log("Direct recipient storefront and wishlist submission passed.");
  await recipient.close();

  const admin = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const adminPage = await admin.newPage();
  await adminPage.goto(`${baseUrl}/auth/login`, { waitUntil: "networkidle" });
  await adminPage.getByLabel(/admin email/i).fill(email);
  await adminPage.getByLabel(/password/i).fill(password);
  await adminPage.getByRole("button", { name: /open admin workspace/i }).click();
  await adminPage.waitForURL(`${baseUrl}/admin`, { timeout: 20_000 });
  await adminPage.getByRole("heading", { name: /birthday wishlist studio/i }).waitFor();
  await adminPage.getByRole("link", { name: /gifts/i }).first().click();
  await adminPage.waitForURL(`${baseUrl}/admin/gifts`);
  await adminPage.getByRole("heading", { name: /manage gifts/i }).waitFor();
  console.log("Allowed admin authentication and catalog access passed.");
  await admin.close();
} finally {
  if (createdIds.length) {
    await supabase.from("submission_items").delete().in("submission_id", createdIds);
    await supabase.from("submissions").delete().in("id", createdIds);
  }
  await browser.close();
}
