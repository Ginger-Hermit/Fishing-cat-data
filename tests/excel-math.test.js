// Patch note: checks the Excel maths (points parsing, Change, % Change, Summary box). Run: npm install exceljs@4.4.0, then node tests/excel-math.test.js
const fs = require("fs"), os = require("os"), path = require("path"), cp = require("child_process"), assert = require("assert");
let EJ; try { EJ = require("exceljs"); } catch (e) { console.error("Run once: npm install exceljs@4.4.0 (test tool only, not used by the page)"); process.exit(1); }
const html = "<script>" + fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8") + "</script>";
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];
const grab = (name) => { const i = js.indexOf(name); let d = 0, j = js.indexOf("{", i); for (; j < js.length; j++) { if (js[j] === "{") d++; if (js[j] === "}" && !--d) break; } return js.slice(i, j + 1); };
const { parsePoints, buildWorkbook, readPrevious, nameClose, dayBase } = new Function(js.match(/^const okName = .*$/m)[0] + "\n" + ["function parsePoints", "function buildWorkbook", "function readPrevious", "function zipCheck", "function readHistory", "function colL", "function weekStart", "function mergeHist", "function nameClose", "function fixNames", "function dayBase", "function weekBase"].map(grab).join("\n").replace("function readPrevious", "async function readPrevious") + "\nreturn {parsePoints, buildWorkbook, readPrevious, nameClose, dayBase};")();

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
  pm.hist.dates[0] -= 7 * 864e5;
  await buildWorkbook(EJ, rows, pm, { clan: "T", game: "G" }, "today").xlsx.writeFile(path.join(dir, "h2.xlsx")); recalc("h2.xlsx");
  const w2 = new EJ.Workbook(); await w2.xlsx.readFile(path.join(dir, "rc", "h2.xlsx"));
  assert.deepStrictEqual(w2.worksheets.map((x) => x.name), ["Clan Members", "Top 10", "Points history", "Help"]);
  const Hs = w2.getWorksheet("Points history"), hv = (r, c) => { const x = Hs.getCell(r, c).value; return x && typeof x === "object" && "result" in x ? x.result : x; };
  assert.strictEqual(hv(3, 2), "Player"); assert.strictEqual(hv(4, 2), "Ann"); assert.strictEqual(hv(4, 3), 100000); assert.strictEqual(hv(4, 4), 20000);
  assert.strictEqual(hv(4, 5), 80000); assert.strictEqual(hv(4, 6), 100000); assert.strictEqual(hv(7, 4), "new"); assert.strictEqual(hv(8, 2), "Old");
  assert.strictEqual(hv(9, 2), "Clan total"); assert.strictEqual(hv(9, 5), 139000); assert.strictEqual(hv(9, 6), 175000);
  const T = w2.getWorksheet("Top 10"), tv = (a) => T.getCell(a).value;
  assert.strictEqual(tv("F6"), "Ann"); assert.strictEqual(tv("G6"), 100000); assert.strictEqual(tv("G16"), 175000);
  const again = await readPrevious(EJ, fs.readFileSync(path.join(dir, "rc", "h2.xlsx")));
  assert.strictEqual(again.hist.dates.length, 2); assert.strictEqual(again.hist.players.length, 5); assert.strictEqual(new Map(again.hist.players).get("old").vals[0], 9000);
  const Hp = w2.getWorksheet("Help"); let seen = false; Hp.eachRow((row) => row.eachCell((c) => { if (String(c.value).includes("Ann")) seen = true; }));
  assert.ok(seen, "Help example uses the top player");
  // Fold: two reads in one earlier week become one column (the week score)
  const t0 = new Date(), m1 = Date.UTC(t0.getFullYear(), t0.getMonth(), t0.getDate()) - 21 * 864e5, fri = m1 - ((new Date(m1).getUTCDay() - 5 + 7) % 7) * 864e5, rv = (c) => { const x = c.value; return x && typeof x === "object" && "result" in x ? x.result : x; };
  const fm = new Map([["ann", 80000]]);
  fm.hist = { dates: [fri, fri + 864e5], players: [["ann", { name: "Ann", vals: [70000, 80000] }], ["bob", { name: "Bob", vals: [50000, null] }]] };
  await buildWorkbook(EJ, rows, fm, { clan: "T", game: "G" }, "today").xlsx.writeFile(path.join(dir, "h3.xlsx")); recalc("h3.xlsx");
  const w3 = new EJ.Workbook(); await w3.xlsx.readFile(path.join(dir, "rc", "h3.xlsx"));
  const H3 = w3.getWorksheet("Points history");
  assert.ok(rv(H3.getCell(3, 6)) instanceof Date); assert.ok(!(rv(H3.getCell(3, 7)) instanceof Date), "earlier week folded");
  assert.strictEqual(rv(H3.getCell(4, 5)), 80000);
  assert.ok(rv(wb.getWorksheet("Points history").getCell(3, 5)) instanceof Date, "earlier sheet without history becomes the first column");
  // After the weekly reset the earlier sheet counts as 0 (no fake drops)
  const wm = new Map([["ann", 90000]]); wm.hist = { dates: [Date.UTC(t0.getFullYear(), t0.getMonth(), t0.getDate()) - 8 * 864e5], players: [] };
  assert.strictEqual(dayBase(wm).get("ann"), 0, "last week counts as 0 after the reset");
  // One misread letter = same player
  assert.ok(nameClose("healthles", "healthies") && nameClose("xxxluffyxcx", "xxkluffyxcx") && !nameClose("kiviix", "kiviiy2x") && !nameClose("abcde", "abcdf"));
  const nm = new Map([["healthles", 65690]]);
  await buildWorkbook(EJ, [{ rank: 1, name: "Healthies", role: "", points: "83.73K" }], nm, { clan: "T", game: "G" }, "t").xlsx.writeFile(path.join(dir, "n.xlsx"));
  const wn = new EJ.Workbook(); await wn.xlsx.readFile(path.join(dir, "n.xlsx"));
  assert.strictEqual(wn.getWorksheet("Clan Members").getCell("F4").value, 65690, "misread name matched to earlier name");
  assert.strictEqual(wn.getWorksheet("Clan Members").getCell("B4").value, "healthles", "misread name keeps the earlier spelling");
  { const w1 = buildWorkbook(EJ, rows, null, { clan: "S", game: "G", season: "1.63M", crank: "21" }, "today"); const b1 = await w1.xlsx.writeBuffer();
    const pv = await readPrevious(EJ, b1); assert.deepStrictEqual([pv.hist.season.slice(-1)[0], pv.hist.crank.slice(-1)[0]], [1630000, 21], "season points and clan rank saved in Points history"); }
  console.log("All Excel maths checks passed.");
})().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
