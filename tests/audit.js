// Audit: speed, unused code, dead CSS, dead ids. Report only (never edits). Run: node tests/audit.js
// Needs playwright for the speed part (skipped if missing).
const fs = require("fs"), path = require("path");
const R = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");
const js = R("app.js"), html = R("index.html"), css = R("style.css");
const out = [], add = (k, a) => out.push(a.length ? k + " (" + a.length + "): " + a.slice(0, 25).join(", ") + (a.length > 25 ? " ..." : "") : k + ": none");
const count = (s, w) => (s.match(new RegExp("(?<![\\w$])" + w.replace(/\$/g, "\\$") + "(?![\\w$])", "g")) || []).length;
// 1 functions and consts used only where defined
const defs = [...js.matchAll(/(?:^|\n)\s*(?:async\s+)?function\s+([\w$]+)/g)].map((m) => m[1]);
const consts = [...js.matchAll(/(?:^|\n)(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=/g)].map((m) => m[1]);
add("Unused functions", defs.filter((n) => count(js, n) < 2));
add("Unused top-level consts", consts.filter((n) => count(js, n) < 2));
// 2 ids in html never used by app.js or css
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
add("Ids never used", ids.filter((i) => !js.includes(i) && !css.includes("#" + i)));
// 3 css classes never in html or app.js (classes built at run time by string are listed as maybe)
const cls = [...new Set([...css.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]))];
add("CSS classes maybe unused", cls.filter((c) => !html.includes(c) && !js.includes(c)));
// 4 leftovers
add("console.log left in app.js", js.split("\n").map((l, i) => /console\.log\(/.test(l) ? "line " + (i + 1) : "").filter(Boolean));
add("TODO/FIXME/XXX", js.split("\n").map((l, i) => /TODO|FIXME|XXX/.test(l) ? "line " + (i + 1) : "").filter(Boolean));
add("Big commented-out code lines", js.split("\n").map((l, i) => /^\s*\/\/\s*(const|let|if|for|function|return)\b.*[;{}]\s*$/.test(l) ? "line " + (i + 1) : "").filter(Boolean));
const dup = {}; for (const m of js.matchAll(/(?:^|\n)\s*(?:async\s+)?function\s+([\w$]+)/g)) dup[m[1]] = (dup[m[1]] || 0) + 1;
add("Functions defined twice", Object.keys(dup).filter((k) => dup[k] > 1));
// 5 size
out.push("Size: app.js " + Math.round(js.length / 1024) + " KB, style.css " + Math.round(css.length / 1024) + " KB, index.html " + Math.round(html.length / 1024) + " KB");
// 6 speed
(async () => {
  let pw; try { pw = require("playwright"); } catch (e) { out.push("Speed: skipped (no playwright)"); return; }
  const b = await pw.chromium.launch(), p = await b.newPage({ viewport: { width: 390, height: 844 } }), errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 80))); p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 80)));
  const t0 = Date.now(); await p.goto("file://" + path.resolve(__dirname, "..", "index.html")); await p.waitForLoadState("load");
  const load = Date.now() - t0, tabs = await p.$$eval(".tabs.main .tab", (x) => x.map((y) => y.id)), slow = [];
  for (const id of tabs) { const t = Date.now(); await p.click("#" + id); await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); const d = Date.now() - t; if (d > 150) slow.push(id + " " + d + "ms"); }
  const nodes = await p.evaluate(() => document.querySelectorAll("*").length);
  out.push("Speed: page load " + load + " ms" + (load > 1500 ? " (SLOW)" : "") + ", " + nodes + " elements");
  add("Slow tab switches (>150ms)", slow); add("Page errors", errs); await b.close();
})().finally(() => { console.log(out.join("\n")); });
