// Patch note: walks every tab with only the keyboard. Every stop must show where focus is, the main controls must be reachable, and Enter on a Home card must open its page. Runs on GitHub after every push.
// By hand: npm i --no-save playwright && node tests/keys.test.js
const path = require("path");
const pw = require("playwright");
const URL = "file://" + path.resolve(__dirname, "..", "index.html");
const MUST = { t1: ["#key"], t3: ["summary(2. Add bills)"], t6: ["#hookbox", "#dcgo"], t5: ["#autoref"] };
(async () => {
  const browser = await pw.chromium.launch(), bad = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(URL);
  for (const id of await page.$$eval(".tabs.main .tab", (b) => b.map((x) => x.id))) {
    await page.click("#" + id); await page.waitForTimeout(150);
    await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
    const seen = new Set();
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press("Tab");
      const f = await page.evaluate(() => {
        const e = document.activeElement; if (!e || e === document.body) return null;
        const c = getComputedStyle(e), ring = (c.outlineStyle !== "none" && parseFloat(c.outlineWidth) > 0) || (c.boxShadow && c.boxShadow !== "none");
        return { who: e.id ? "#" + e.id : e.tagName.toLowerCase() + (e.textContent ? "(" + e.textContent.trim().slice(0, 20) + ")" : ""), ring: !!ring };
      });
      if (!f) break;
      if (seen.has(f.who)) continue;
      seen.add(f.who);
      if (!f.ring) bad.push(id + ": no visible focus on " + f.who);
    }
    for (const sel of MUST[id] || []) if (!seen.has(sel)) bad.push(id + ": keyboard never reached " + sel);
    if (seen.size < 5) bad.push(id + ": only " + seen.size + " keyboard stops");
  }
  await page.click("#t0"); await page.waitForTimeout(150);
  await page.focus(".dc-bill"); await page.keyboard.press("Enter"); await page.waitForTimeout(150);
  if (!(await page.isVisible("#billtab"))) bad.push("Home: Enter on the Bills card did not open Bills");
  await browser.close();
  for (const b of bad) console.log("FAIL " + b);
  console.log(bad.length ? bad.length + " problem(s)." : "PASS keyboard walk on every tab.");
  process.exit(bad.length ? 1 : 0);
})();
