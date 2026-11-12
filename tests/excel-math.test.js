// Patch note: checks the Excel maths (points parsing, Change, % Change, Summary box). Run: npm install exceljs@4.4.0, then node tests/excel-math.test.js
const fs = require("fs"), os = require("os"), path = require("path"), cp = require("child_process"), assert = require("assert");
let EJ; try { EJ = require("exceljs"); } catch (e) { console.error("Run once: npm install exceljs@4.4.0 (test tool only, not used by the page)"); process.exit(1); }
const html = "<script>" + fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8") + "</script>";
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];
const grab = (name) => { const i = js.indexOf(name); let d = 0, j = js.indexOf("{", i); for (; j < js.length; j++) { if (js[j] === "{") d++; if (js[j] === "}" && !--d) break; } return js.slice(i, j + 1); };
const { parsePoints, buildWorkbook, readPrevious, nameClose } = new Function(["function parsePoints", "function buildWorkbook", "function readPrevious", "function zipCheck", "function readHistory", "function colL", "function mergeHist", "function nameClose", "function fixNames", "function dayBase"].map(grab).join("\n").replace("function readPrevious", "async function readPrevious") + "\nreturn {parsePoints, buildWorkbook, readPrevious, nameClose};")();

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
  assert.strictEqual(v("L4"), 4); assert.strictEqual(v("L5"), 175000); assert.strictEqual(v("L7"), 15000);
  assert.ok(Math.abs(v("L8") - 15000 / 155000) < 1e-9);
  assert.strictEqual(v("L9"), 1); assert.strictEqual(v("L10"), 1); assert.strictEqual(v("L11"), "Ann"); assert.strictEqual(v("L12"), "Cy");
  // History: run 1 (a week ago, with Old who then leaves) carried into run 2
  const recalc = (f) => cp.execSync(`soffice --headless --convert-to xlsx:"Calc MS Excel 2007 XML" --outdir "${dir}/rc" "${dir}/${f}"`, { stdio: "ignore" });
  const r1 = [["Ann", "80K"], ["Bob", "50K"], ["Old", "9K"]].map(([name, points], i) => ({ rank: i + 1, name, role: "", points }));
  await buildWorkbook(EJ, r1, null, { clan: "T", game: "G" }, "then").xlsx.writeFile(path.join(dir, "h1.xlsx")); recalc("h1.xlsx");
  const pm = await readPrevious(EJ, fs.readFileSync(path.join(dir, "rc", "h1.xlsx")));
  assert.strictEqual(pm.get("ann"), 80000); assert.strictEqual(pm.hist.dates.length, 1);
  pm.hist.dates[0] -= 7 * 864e5; pm.hist.players.forEach(([, e]) => { e.start[0] -= 7 * 864e5; });
  await buildWorkbook(EJ, rows, pm, { clan: "T", game: "G" }, "today").xlsx.writeFile(path.join(dir, "h2.xlsx")); recalc("h2.xlsx");
  const w2 = new EJ.Workbook(); await w2.xlsx.readFile(path.join(dir, "rc", "h2.xlsx"));
  assert.deepStrictEqual(w2.worksheets.map((x) => x.name), ["Clan Members", "Leaderboard", "Points history", "About this sheet", "How it's worked out"]);
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
  // Fold: two runs last month become one column, first-run points are kept
  const t0 = new Date(), m1 = Date.UTC(t0.getFullYear(), t0.getMonth(), 1), rv = (c) => { const x = c.value; return x && typeof x === "object" && "result" in x ? x.result : x; };
  const fm = new Map([["ann", 80000]]);
  fm.hist = { dates: [m1 - 20 * 864e5, m1 - 10 * 864e5], players: [["ann", { name: "Ann", vals: [70000, 80000] }], ["bob", { name: "Bob", vals: [50000, null] }]] };
  await buildWorkbook(EJ, rows, fm, { clan: "T", game: "G" }, "today").xlsx.writeFile(path.join(dir, "h3.xlsx")); recalc("h3.xlsx");
  const w3 = new EJ.Workbook(); await w3.xlsx.readFile(path.join(dir, "rc", "h3.xlsx"));
  const H3 = w3.getWorksheet("Points history"), L3 = w3.getWorksheet("Leaderboard");
  assert.ok(rv(H3.getCell(3, 4)) instanceof Date); assert.ok(!(rv(H3.getCell(3, 5)) instanceof Date), "last month folded");
  assert.strictEqual(rv(L3.getCell("B4")), "Ann"); assert.strictEqual(rv(L3.getCell("D4")), 30000);
  const f3 = await readPrevious(EJ, fs.readFileSync(path.join(dir, "rc", "h3.xlsx")));
  assert.strictEqual(new Map(f3.hist.players).get("ann").start[1], 70000);
  assert.strictEqual(rv(wb.getWorksheet("Leaderboard").getCell("D4")), 20000, "earlier sheet without history becomes the first column");
  // One misread letter = same player
  assert.ok(nameClose("healthles", "healthies") && nameClose("xxxluffyxcx", "xxkluffyxcx") && !nameClose("kiviix", "kiviiy2x") && !nameClose("abcde", "abcdf"));
  const nm = new Map([["healthles", 65690]]);
  await buildWorkbook(EJ, [{ rank: 1, name: "Healthies", role: "", points: "83.73K" }], nm, { clan: "T", game: "G" }, "t").xlsx.writeFile(path.join(dir, "n.xlsx"));
  const wn = new EJ.Workbook(); await wn.xlsx.readFile(path.join(dir, "n.xlsx"));
  assert.strictEqual(wn.getWorksheet("Clan Members").getCell("F4").value, 65690, "misread name matched to earlier name");
  console.log("All Excel maths checks passed.");
})().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
