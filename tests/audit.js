// Audit: speed, unused code, dead CSS, dead ids. Report only (never edits). Run: node tests/audit.js
// Needs playwright for the speed part (skipped if missing).
const fs = require("fs"), path = require("path");
const R = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");
const js = R("app.js"), html = R("index.html"), css = R("style.css");
const out = [], add = (k, a) => out.push(a.length ? k + " (" + a.length + "): " + a.slice(0, 25).join(", ") + (a.length > 25 ? " ..." : "") : k + ": none");
const words = new Map(); for (const w of js.match(/[\w$]+/g)) words.set(w, (words.get(w) || 0) + 1); // one pass over app.js
const count = (s, w) => words.get(w) || 0;
// 1 functions and consts used only where defined
const defs = [...js.matchAll(/(?:^|\n)\s*(?:async\s+)?function\s+([\w$]+)/g)].map((m) => m[1]);
const consts = [...js.matchAll(/(?:^|\n)(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=/g)].map((m) => m[1]);
add("Unused functions", defs.filter((n) => count(js, n) < 2));
add("Unused top-level consts", consts.filter((n) => count(js, n) < 2));
// 2 ids in html never used by app.js or css
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const cssTok = new Set(css.match(/[\w-]+/g)), htmlTok = new Set(html.match(/[\w-]+/g)), jsStr = js;
add("Ids never used", ids.filter((i) => !jsStr.includes(i) && !cssTok.has(i)));
// 3 css classes never in html or app.js (classes built at run time by string are listed as maybe)
const cls = [...new Set([...css.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]))];
add("CSS classes maybe unused", cls.filter((c) => !htmlTok.has(c) && !jsStr.includes(c)));
// 4 leftovers
const L = js.split("\n"), lg = [], td = [], cm = [];
L.forEach((l, i) => { if (/console\.log\(/.test(l)) lg.push("line " + (i + 1)); if (/TODO|FIXME|XXX/.test(l)) td.push("line " + (i + 1)); if (/^\s*\/\/\s*(const|let|if|for|function|return)\b.*[;{}]\s*$/.test(l)) cm.push("line " + (i + 1)); });
add("console.log left in app.js", lg); add("TODO/FIXME/XXX", td); add("Big commented-out code lines", cm);
const dup = {}; for (const n of defs) dup[n] = (dup[n] || 0) + 1;
add("Functions defined twice", Object.keys(dup).filter((k) => dup[k] > 1));
// 5 size
out.push("Size: app.js " + Math.round(js.length / 1024) + " KB, style.css " + Math.round(css.length / 1024) + " KB, index.html " + Math.round(html.length / 1024) + " KB");
// 6 speed
(async () => {
  let pw; try { pw = require("playwright"); } catch (e) { out.push("Speed: skipped (no playwright)"); return; }
  const b = await pw.chromium.launch({ args: ["--disable-gpu"] }), p = await b.newPage({ viewport: { width: 390, height: 844 } }), errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 80))); p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 80)));
  const t0 = Date.now(); await p.goto("file://" + path.resolve(__dirname, "..", "index.html")); await p.waitForLoadState("load");
  const load = Date.now() - t0, tabs = await p.$$eval(".tabs.main .tab", (x) => x.map((y) => y.id)), slow = [];
  for (const id of tabs) { const t = Date.now(); await p.click("#" + id); await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); const d = Date.now() - t; if (d > 150) slow.push(id + " " + d + "ms"); }
  const nodes = await p.evaluate(() => document.querySelectorAll("*").length);
  out.push("Speed: page load " + load + " ms" + (load > 1500 ? " (SLOW)" : "") + ", " + nodes + " elements");
  add("Slow tab switches (>150ms)", slow); add("Page errors", errs); await b.close();
})().finally(() => { console.log(out.join("\n")); });
