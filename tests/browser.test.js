// Opens the real page in Chrome, Firefox and Safari's engine with a pretend AI, and checks the main jobs work.
// Runs on GitHub after every push. To run by hand: npm i --no-save playwright && npx playwright install && node tests/browser.test.js
const path = require("path");
const pw = require("playwright");
const URL = "file://" + path.resolve(__dirname, "..", "index.html");
const LAYOUT = '{"clan_name":"Loki","game_name":"Gym League","ranks_shown":true,"extra_column":""}';
const ROWS = '[{"rank":1,"name":"Ann","role":"Owner","points":"52.51K"},{"rank":2,"name":"Bo","role":"Member","points":"507"}]';
const BILL = JSON.stringify({ bills: [{ supplier: "Example Power", currency: "NZD", decimal_mark: ".", period_days: "31", total_due: "122.89", lines: [{ energy: "electricity", charge: "Usage", used: "425", unit: "kWh", amount: "94.99" }, { energy: "gas", charge: "Gas", used: "360", unit: "MJ", amount: "20.00" }, { energy: "electricity", charge: "Daily", used: "31", unit: "days", amount: "27.90" }], notes: ["A power bill."] }] });
// kind: what the pretend AI does. Each case: [button, kind, should it end in an error?]
const CASES = [["go", "good", false], ["test", "good", false], ["bill", "good", false], ["go", "empty", true], ["bill", "empty", true], ["go", "h401", true], ["bill", "h429", true], ["go", "network", true], ["bill", "notjson", true], ["go", "hang", true], ["bill", "hang", true], ["go", "cut", false]];

async function runCase(page, flow, kind) {
  return page.evaluate(async ([flow, kind, LAYOUT, ROWS, BILL]) => {
    window.__dl = null;
    HTMLAnchorElement.prototype.click = function () { window.__dl = this.download; };
    const good = flow === "bill" ? BILL : ROWS;
    const body = { good, empty: "", cut: good.slice(0, good.length - 20) }[kind];
    let n = 0;
    window.fetch = (u, o) => new Promise((ok, bad) => {
      const first = n++ === 0 && flow !== "bill";
      if (kind === "hang") { o.signal.addEventListener("abort", () => bad(o.signal.reason)); return; }
      if (kind === "network") return bad(new TypeError("Failed to fetch"));
      if (kind === "h401" || kind === "h429") return ok({ ok: false, status: +kind.slice(1), json: async () => ({ error: { message: "quota" } }) });
      if (kind === "notjson") return ok({ ok: true, status: 200, json: async () => { throw new SyntaxError("Unexpected token <"); } });
      ok({ ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: first ? LAYOUT : body }] } }] }) });
    });
    const c = document.createElement("canvas"); c.width = c.height = 80; c.getContext("2d").fillRect(0, 0, 20, 20);
    const pic = new File([await new Promise(r => c.toBlob(r, "image/png"))], "p.png", { type: "image/png" });
    images = flow === "bill" ? [] : [pic]; billPics = flow === "bill" ? [pic] : [];
    document.getElementById("provider").value = "gemini"; applyProvider(true);
    document.getElementById("key").value = "AIzaTESTKEY123456"; refresh();
    aiWait = kind === "hang" ? 300 : 180000;
    const btn = document.getElementById(flow === "bill" ? "billgo" : flow === "test" ? "testgo" : "go"), box = document.getElementById(flow === "bill" ? "billmsg" : "msg");
    box.textContent = ""; btn.click();
    const locked = document.getElementById("go").disabled && document.getElementById("billgo").disabled && document.getElementById("provider").disabled;
    for (let k = 0; k < 600; k++) { await new Promise(r => setTimeout(r, 25)); if (box.textContent && !/^Reading|^Test read: looking/.test(box.textContent)) break; }
    const dlb = document.getElementById(flow === "go" ? "pvgo" : flow === "bill" ? "bpgo" : "none");
    if (dlb && !box.className.includes("err")) { dlb.click(); for (let k = 0; k < 400 && !window.__dl; k++) await new Promise(r => setTimeout(r, 25)); }
    aiWait = 180000;
    return { msg: box.textContent, err: box.className.includes("err"), file: window.__dl, locked, unlocked: !running && !btn.disabled };
  }, [flow, kind, LAYOUT, ROWS, BILL]);
}

(async () => {
  const only = process.env.BROWSERS ? process.env.BROWSERS.split(",") : ["chromium", "firefox", "webkit"];
  let failed = 0, ran = 0;
  for (const name of only) {
    const browser = await pw[name].launch(process.env.CHROME_PATH && name === "chromium" ? { executablePath: process.env.CHROME_PATH } : {});
    const page = await browser.newPage();
    const pageErrors = [];
    page.on("pageerror", e => pageErrors.push(String(e)));
    await page.goto(URL);
    const check = (what, ok, detail) => { ran++; if (!ok) { failed++; console.log("FAIL " + name + ": " + what + (detail ? " -> " + detail : "")); } };
    // every tab opens, and nothing scrolls sideways at phone width
    await page.setViewportSize({ width: 360, height: 740 });
    const tabs = await page.evaluate(async () => { const bad = []; for (const t of ["sheet", "bill", "help", "settings", "safety", "privacy", "legal"]) { showTab(t); await new Promise(r => setTimeout(r, 10)); if (document.documentElement.scrollWidth > innerWidth + 1) bad.push(t); } showTab("sheet"); return bad; });
    check("tabs fit a phone screen", tabs.length === 0, tabs.join(","));
    for (const [flow, kind, wantErr] of CASES) {
      const r = await runCase(page, flow, kind), tag = flow + " / " + kind;
      check(tag + ": has a message", !!r.msg);
      check(tag + ": plain words", !/undefined|TypeError|SyntaxError|\[object|NaN|Unexpected|Cannot read/.test(r.msg), r.msg);
      check(tag + ": " + (wantErr ? "ends in an error" : "works"), r.err === wantErr, r.msg);
      check(tag + ": locked during the run, unlocked after", r.locked && r.unlocked);
      if (!wantErr && flow !== "test") check(tag + ": file made", !!r.file && r.file.endsWith(".xlsx"), String(r.file));
      if (wantErr) check(tag + ": no file on error", !r.file);
    }
    // the Excel file has the right numbers and formulas
    const cells = await page.evaluate(async (BILL) => { const wb = buildBillBook(window.ExcelJS, parseBills(BILL), "today"); const b2 = new ExcelJS.Workbook(); await b2.xlsx.load(await wb.xlsx.writeBuffer()); const s = b2.getWorksheet("Bills"); return [s.getCell("J4").value, s.getCell("K5").value.formula, s.getCell("N4").value, b2.getWorksheet("Summary").getCell("B11").value.formula.includes("SUMIFS")].join("|"); }, BILL);
    check("bill sheet numbers", cells === '425|IF(J5="","",J5/3.6)|94.99|true', cells);
    check("no page errors", pageErrors.length === 0, pageErrors.slice(0, 2).join(" ; "));
    await browser.close();
    console.log(name + ": done");
  }
  console.log(ran + " checks, " + failed + " failed");
  process.exit(failed ? 1 : 0);
})().catch(e => { console.log("FAIL test runner: " + e); process.exit(1); });
