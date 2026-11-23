import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000/ville";
const out = process.argv[3] ?? "shots/latest.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") console.log("[" + m.type() + "]", m.text());
});
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
page.on("response", (r) => { if (r.status() === 404) console.log("[404]", r.url()); });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(7000);
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);