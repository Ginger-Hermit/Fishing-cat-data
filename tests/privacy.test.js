// Patch note: checks the privacy switches. A saved key or link forgets itself after the chosen days, "Don't save anything" stops all saving, and turning it on clears saved things but keeps the look. Runs on GitHub after every push.
// By hand: npm i --no-save playwright && node tests/privacy.test.js
const path = require("path");
const pw = require("playwright");
const URL = "file://" + path.resolve(__dirname, "..", "index.html");
(async () => {
  const browser = await pw.chromium.launch(), bad = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const get = (k) => page.evaluate((x) => localStorage.getItem(x), k);
  await page.goto(URL);
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem("fcd_key_gemini", "abc"); localStorage.setItem("fcd_stamp", String(Date.now() - 8 * 864e5)); });
  await page.reload();
  if ((await get("fcd_key_gemini")) !== null) bad.push("a key older than 7 days was not forgotten");
  await page.evaluate(() => { localStorage.setItem("fcd_expire", "never"); localStorage.setItem("fcd_key_gemini", "abc"); localStorage.setItem("fcd_stamp", String(Date.now() - 99 * 864e5)); });
  await page.reload();
  if ((await get("fcd_key_gemini")) === null) bad.push("a key was forgotten even though Never was chosen");
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem("fcd_theme", "dark"); localStorage.setItem("fcd_key_gemini", "abc"); localStorage.setItem("fcd_hook", "https://discord.com/api/webhooks/1/x"); });
  await page.reload(); await page.click("#t5"); await page.check("#nosave"); await page.waitForTimeout(200);
  if ((await get("fcd_key_gemini")) !== null || (await get("fcd_hook")) !== null) bad.push("turning on Don't save anything left a key or link behind");
  if ((await get("fcd_theme")) !== "dark") bad.push("turning on Don't save anything wiped the theme");
  if ((await get("fcd_nosave")) !== "1") bad.push("the Don't save anything switch was not kept");
  await page.click("#t1"); await page.evaluate(() => { document.getElementById("keydet").open = true; }); await page.fill("#key", "abcdefghij12345"); await page.check("#remember"); await page.waitForTimeout(200);
  if ((await page.evaluate(() => Object.keys(localStorage).filter((k) => /^fcd_key_/.test(k)).length)) > 0) bad.push("a key was saved while Don't save anything was on");
  await browser.close();
  for (const b of bad) console.log("FAIL " + b);
  console.log(bad.length ? bad.length + " problem(s)." : "PASS privacy switches.");
  process.exit(bad.length ? 1 : 0);
})();
