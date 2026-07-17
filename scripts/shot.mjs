import { chromium } from "playwright";
import fs from "fs";

const OUT = "/tmp/shots";
fs.mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3000";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));

async function snap(name) {
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log("shot:", name);
}

// 1. Customer landing (no table)
await page.goto(base + "/", { waitUntil: "networkidle" }).catch(() => {});
await snap("01-landing");

// 2. Customer menu with a table slug
await page.goto(base + "/?table=1", { waitUntil: "networkidle" }).catch(() => {});
await page.waitForTimeout(1500);
await snap("02-customer-table");

// 3. Staff kiosk gate
await page.goto(base + "/?admin=1", { waitUntil: "networkidle" }).catch(() => {});
await snap("03-staff-gate");

// 4. Staff login -> console
try {
  const pin = page.locator('input[placeholder="Staff PIN"]');
  await pin.fill("8034", { timeout: 5000 });
  await page.getByText("Open floor layout", { exact: false }).click({ timeout: 5000 });
  await page.waitForTimeout(2000);
  await snap("04-staff-console");

  for (const [label, name] of [
    ["Onboarding", "05-onboarding"],
    ["Theme Studio", "06-theme"],
    ["Menu", "07-menu"],
  ]) {
    try {
      // open the sidebar drawer each time (it closes on selection)
      const opener = page.locator('button[aria-label="Open staff menu"]');
      if (await opener.count()) await opener.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(400);
      await page.getByRole("button", { name: new RegExp("^" + label, "i") }).first().click({ timeout: 4000 });
      await snap(name);
    } catch (e) {
      console.log("nav fail", label, e.message);
    }
  }

  // Theme Studio: apply a preset to show live retheme
  try {
    const opener = page.locator('button[aria-label="Open staff menu"]');
    if (await opener.count()) await opener.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: /^Theme Studio/i }).first().click({ timeout: 4000 });
    await page.waitForTimeout(500);
    await page.getByText("Vineyard", { exact: false }).click({ timeout: 3000 });
    await snap("08-theme-preset");
  } catch (e) {
    console.log("preset fail", e.message);
  }
} catch (e) {
  console.log("login flow failed:", e.message);
}

await browser.close();
console.log("DONE");
