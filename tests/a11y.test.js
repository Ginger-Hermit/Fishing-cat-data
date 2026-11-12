// Patch note: checks every tab in every colour theme for hard-to-read text, tiny or unlabelled buttons (axe-core, WCAG 2.2 incl. thumb-size), and sideways scroll at 150% text. Runs on GitHub after every push.
// By hand: npm i --no-save playwright axe-core@4.10.2 && node tests/a11y.test.js
const path = require("path");
const pw = require("playwright");
const AXE = require.resolve("axe-core/axe.min.js");
const URL = "file://" + path.resolve(__dirname, "..", "index.html");
const THEMES = ["light", "dark", "ocean", "forest", "berry"];
(async () => {
  const browser = await pw.chromium.launch(), seen = new Map();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const th of THEMES) {
    await page.goto(URL);
    await page.evaluate((t) => localStorage.setItem("fcd_theme", t), th);
    await page.reload();
    const tabs = await page.$$eval(".tabs.main .tab", (b) => b.map((x) => x.id));
    for (const id of tabs) {
      await page.click("#" + id); await page.waitForTimeout(150);
      await page.addScriptTag({ path: AXE });
      const v = await page.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] })).violations
        .filter((x) => x.impact === "serious" || x.impact === "critical")
        .map((x) => [x.id, x.help, x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")]));
      for (const [rule, help, where] of v) { const k = rule + " | " + where; if (!seen.has(k)) seen.set(k, th + "/" + id + ": " + help + " -> " + where); }
    }
  }
  // big text: a 390px phone zoomed to 150% is 260px wide; nothing may scroll sideways
  const big = await browser.newPage({ viewport: { width: 260, height: 844 } });
  await big.goto(URL);
  for (const id of await big.$$eval(".tabs.main .tab", (b) => b.map((x) => x.id))) {
    await big.click("#" + id); await big.waitForTimeout(150);
    const w = await big.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (w > 0) seen.set("big " + id, "big text/" + id + ": scrolls sideways by " + w + "px");
  }
  await browser.close();
  for (const s of seen.values()) console.log("FAIL " + s.slice(0, 220));
  console.log(seen.size ? seen.size + " problem(s)." : "PASS no serious problems in " + THEMES.length + " themes.");
  process.exit(seen.size ? 1 : 0);
})();
