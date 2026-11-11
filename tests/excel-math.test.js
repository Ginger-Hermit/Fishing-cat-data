// Patch note: checks the Excel maths (points parsing, Change, % Change, Summary box). Run: npm install exceljs@4.4.0, then node tests/excel-math.test.js
const fs = require("fs"), os = require("os"), path = require("path"), cp = require("child_process"), assert = require("assert");
let EJ; try { EJ = require("exceljs"); } catch (e) { console.error("Run once: npm install exceljs@4.4.0 (test tool only, not used by the page)"); process.exit(1); }
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];
const grab = (name) => { const i = js.indexOf(name); let d = 0, j = js.indexOf("{", i); for (; j < js.length; j++) { if (js[j] === "{") d++; if (js[j] === "}" && !--d) break; } return js.slice(i, j + 1); };
const { parsePoints, buildWorkbook } = new Function(["function parsePoints", "function buildWorkbook"].map(grab).join("\n") + "\nreturn {parsePoints, buildWorkbook};")();

for (const [t, n] of [["52.51K", 52510], ["1K", 1000], ["507", 507], ["1.2M", 1200000], ["16.6k", 16600]]) assert.strictEqual(parsePoints(t), n, t);
assert.strictEqual(parsePoints("?"), null);

const rows = [["Ann", "100K"], ["Bob", "50K"], ["Cy", "20K"], ["New", "5K"]].map(([name, points], i) => ({ rank: i + 1, name, role: "", points }));
const prev = new Map([["ann", 80000], ["bob", 50000], ["cy", 25000]]);
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fcd-"));
  await buildWorkbook(EJ, rows, prev, { clan: "T", game: "G" }, "today").xlsx.writeFile(path.join(dir, "t.xlsx"));
  try { cp.execSync(`soffice --headless --convert-to xlsx:"Calc MS Excel 2007 XML" --outdir "${dir}/rc" "${dir}/t.xlsx"`, { stdio: "ignore" }); }
  catch (e) { console.log("SKIP formulas: LibreOffice not installed. Points parsing OK."); return; }
  const wb = new EJ.Workbook(); await wb.xlsx.readFile(path.join(dir, "rc", "t.xlsx"));
  const ws = wb.getWorksheet("Clan Members"), v = (a) => { const x = ws.getCell(a).value; return x && typeof x === "object" && "result" in x ? x.result : x; };
  assert.strictEqual(v("G4"), 20000); assert.ok(Math.abs(v("H4") - 0.25) < 1e-9);
  assert.strictEqual(v("I4"), "▲"); assert.strictEqual(v("I5"), "–"); assert.strictEqual(v("I6"), "▼"); assert.strictEqual(v("I7"), "new");
  assert.strictEqual(v("L19"), 4); assert.strictEqual(v("L20"), 175000); assert.strictEqual(v("L22"), 15000);
  assert.ok(Math.abs(v("L23") - 15000 / 155000) < 1e-9);
  assert.strictEqual(v("L24"), 1); assert.strictEqual(v("L25"), 1); assert.strictEqual(v("L26"), "Ann"); assert.strictEqual(v("L27"), "Cy");
  console.log("All Excel maths checks passed.");
})().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
