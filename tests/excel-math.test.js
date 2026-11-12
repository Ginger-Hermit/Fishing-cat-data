// Patch note: checks the Excel maths (points parsing, Change, % Change, Summary box). Run: npm install exceljs@4.4.0, then node tests/excel-math.test.js
const fs = require("fs"), os = require("os"), path = require("path"), cp = require("child_process"), assert = require("assert");
let EJ; try { EJ = require("exceljs"); } catch (e) { console.error("Run once: npm install exceljs@4.4.0 (test tool only, not used by the page)"); process.exit(1); }
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];
const grab = (name) => { const i = js.indexOf(name); let d = 0, j = js.indexOf("{", i); for (; j < js.length; j++) { if (js[j] === "{") d++; if (js[j] === "}" && !--d) break; } return js.slice(i, j + 1); };
const { parsePoints, buildWorkbook, readPrevious } = new Function(["function parsePoints", "function buildWorkbook", "function readPrevious", "function readHistory", "function colL", "function mergeHist"].map(grab).join("\n").replace("function readPrevious", "async function readPrevious") + "\nreturn {parsePoints, buildWorkbook, readPrevious};")();

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
  // History: run 1 (a week ago, with Old who then leaves) carried into run 2
  const recalc = (f) => cp.execSync(`soffice --headless --convert-to xlsx:"Calc MS Excel 2007 XML" --outdir "${dir}/rc" "${dir}/${f}"`, { stdio: "ignore" });
  const r1 = [["Ann", "80K"], ["Bob", "50K"], ["Old", "9K"]].map(([name, points], i) => ({ rank: i + 1, name, role: "", points }));
  await buildWorkbook(EJ, r1, null, { clan: "T", game: "G" }, "then").xlsx.writeFile(path.join(dir, "h1.xlsx")); recalc("h1.xlsx");
  const pm = await readPrevious(EJ, fs.readFileSync(path.join(dir, "rc", "h1.xlsx")));
  assert.strictEqual(pm.get("ann"), 80000); assert.strictEqual(pm.hist.dates.length, 1);
  pm.hist.dates[0] -= 7 * 864e5;
  await buildWorkbook(EJ, rows, pm, { clan: "T", game: "G" }, "today").xlsx.writeFile(path.join(dir, "h2.xlsx")); recalc("h2.xlsx");
  const w2 = new EJ.Workbook(); await w2.xlsx.readFile(path.join(dir, "rc", "h2.xlsx"));
  assert.deepStrictEqual(w2.worksheets.map((x) => x.name), ["Leaderboard", "Clan Members", "Points history", "About this sheet", "How it's worked out"]);
  const L = w2.getWorksheet("Leaderboard"), lv = (a) => { const x = L.getCell(a).value; return x && typeof x === "object" && "formula" in x ? (x.result === undefined ? 0 : x.result) : x; };
  assert.strictEqual(lv("B4"), "Ann"); assert.strictEqual(lv("C4"), 100000); assert.strictEqual(lv("D4"), 20000); assert.strictEqual(lv("E4"), 20000);
  assert.ok(Math.abs(lv("G4") - 20000 / 7) < 1e-6);
  const names = [4, 5, 6, 7, 8].map((n) => lv("B" + n));
  assert.strictEqual(names[4], "Old"); assert.strictEqual(lv("C8"), 9000); assert.strictEqual(lv("D8"), 0);
  const Hs = w2.getWorksheet("Points history"), hv = (r, c) => { const x = Hs.getCell(r, c).value; return x && typeof x === "object" && "result" in x ? x.result : x; };
  assert.strictEqual(hv(4, 3), 80000); assert.strictEqual(hv(4, 4), 100000); assert.strictEqual(hv(5, 4), 20000);
  assert.strictEqual(hv(14, 1), "Clan total"); assert.strictEqual(hv(14, 3), 139000); assert.strictEqual(hv(14, 4), 175000); assert.strictEqual(hv(15, 4), 36000);
  const again = await readPrevious(EJ, fs.readFileSync(path.join(dir, "rc", "h2.xlsx")));
  assert.strictEqual(again.hist.dates.length, 2); assert.strictEqual(again.hist.players.length, 5);
  const How = w2.getWorksheet("How it's worked out"), ex = How.getCell("C7").value;
  assert.ok(String(ex && ex.result).includes("Ann"), "worked example: " + JSON.stringify(ex));
  console.log("All Excel maths checks passed.");
})().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
