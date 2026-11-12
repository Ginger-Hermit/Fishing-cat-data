// Patch note: saves phone pictures of every tab (newest iPhone in Safari's engine, newest Pixel in Chrome; light, dark, big text).
// GitHub keeps them 30 days: Actions -> Check -> the run -> phone-pictures. By hand: node tests/pictures.js (writes to pictures/).
const fs = require("fs"), path = require("path"), pw = require("playwright");
const URL = "file://" + path.resolve(__dirname, "..", "index.html"), OUT = path.resolve(__dirname, "..", "pictures");
const newest = (re) => Object.keys(pw.devices).filter((k) => re.test(k)).sort((a, b) => parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, ""))).pop();
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (const [engine, re] of [["webkit", /^iPhone \d+$/], ["chromium", /^Pixel \d+$/]]) {
    let browser; try { browser = await pw[engine].launch(); } catch (e) { console.log("skip " + engine + ": not installed"); continue; }
    const phone = newest(re), dev = { ...pw.devices[phone] }; delete dev.defaultBrowserType;
    for (const look of ["light", "dark", "bigtext"]) {
      // big text: same phone at 150% zoom (narrower screen, bigger pixels)
      const opts = look === "bigtext" ? { ...dev, viewport: { width: Math.round(dev.viewport.width / 1.5), height: Math.round(dev.viewport.height / 1.5) }, deviceScaleFactor: dev.deviceScaleFactor * 1.5 } : { ...dev, colorScheme: look };
      const ctx = await browser.newContext(opts), page = await ctx.newPage();
      await page.goto(URL);
      for (const tab of ["home", "sheet", "bill", "discord", "help", "settings"]) {
        await page.evaluate((t) => { showTab(t); scrollTo(0, 0); }, tab); await page.waitForTimeout(150);
        await page.screenshot({ path: path.join(OUT, `${phone.replace(/ /g, "")}-${look}-${tab}.png`), fullPage: true }); n++;
      }
      await ctx.close();
    }
    await browser.close();
  }
  console.log(n + " pictures in pictures/");
})().catch((e) => { console.log("FAIL pictures: " + e); process.exit(1); });
