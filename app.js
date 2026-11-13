// Patch note: Small layout fixes: arrows match, more space, no repeated Bills line
// Start-up display of each box (was style="display:..." in index.html): set it as the element's own style so show/hide code works.
document.querySelectorAll("[data-d]").forEach((e) => { e.style.display = e.dataset.d; e.removeAttribute("data-d"); });
const MODEL = "claude-haiku-5-5";
// Anthropic is tested. Gemini and OpenAI are not. Names can be changed under Settings.
const PROVIDERS = {
  anthropic: { name: "Anthropic", model: MODEL, tested: true },
  gemini: { name: "Google Gemini", model: "gemini-3.8-flash", tested: true },
  openai: { name: "OpenAI", model: "gpt-5.5", tested: false }
};
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
const LOOK_KEYS = ["fcd_theme", "fcd_size", "fcd_read", "fcd_nosave", "fcd_expire"];
const isSecret = (k) => /^fcd_key_/.test(k) || k === "fcd_hook";
function lsSet(k, v) {
  if (lsGet("fcd_nosave") === "1" && !LOOK_KEYS.includes(k)) return;
  try { localStorage.setItem(k, v); if (isSecret(k)) localStorage.setItem("fcd_stamp", String(Date.now())); } catch (e) {}
}
// Saved keys and links forget themselves after the time chosen in Settings (7 days unless changed).
function expireCheck() {
  try {
    const d = lsGet("fcd_expire") || "7", keys = Object.keys(localStorage).filter(isSecret), st = Number(lsGet("fcd_stamp"));
    if (!keys.length) { localStorage.removeItem("fcd_stamp"); return; }
    if (!st) { try { localStorage.setItem("fcd_stamp", String(Date.now())); } catch (e) {} return; }
    if (d !== "never" && Date.now() - st > Number(d) * 864e5) keys.concat("fcd_stamp").forEach((k) => localStorage.removeItem(k));
  } catch (e) {}
}
expireCheck();
let PROMPT = "";
function buildPrompt(p) {
  const rankLine = p.ranks ? 'a rank like "#12"' : "no rank number (set rank to 0)";
  const roleLine = p.extra ? 'a column called "' + p.extra + '" (copy it exactly as shown; use "?" if unreadable or hidden)' : "a role under the name";
  return `These images show the member list of a Roblox game clan screen.
Each row shows ${rankLine}, a username, ${roleLine} and a points number (like 52.51K, 1.307M or 507).
The list may scroll: later images often show lower rows. Read EVERY image to the last one, and EVERY row that is fully visible in each. Skip rows cut off at the top or bottom edge. Keep rows in the order shown, top first.
Copy usernames exactly, letter by letter. Roblox names use only letters, digits and one underscore "_" (never dots or spaces). Look closely at 1 vs l vs I and 0 vs O; a digit next to other digits is usually a digit. If you are not sure of any letter in a name, add "unsure": true to that row. Points: copy exactly as shown. Never guess; use "?" if unreadable.
If a member count is shown on screen (like "Members 49"), add one last object {"members_on_screen": 49}.
Answer with ONLY a JSON array, no other text:
[{"rank": 12, "name": "example_name", "role": "${p.extra ? "value" : "Member"}", "points": "16.6K"}, ...]`;
}
// Newest 5 only. The full history is in CHANGELOG.md.
let lastKind = "sheet";
function showTab(which) {
  const shown = { home: "hometab", sheet: "sheet", bill: "billtab", discord: "discordtab", help: "helptab", settings: "settingstab", privacy: "privacytab", safety: "safetytab", legal: "legaltab" };
  const btn = { home: "t0", sheet: "t1", bill: "t3", discord: "t6", help: "t4", settings: "t5" };
  for (const k in shown) {
    document.getElementById(shown[k]).style.display = k === which ? "" : "none";
    const b = btn[k] && document.getElementById(btn[k]);
    if (b) { b.classList.toggle("on", k === which); b.setAttribute("aria-selected", k === which); }
  }
  if (which === "discord") document.getElementById("discordtab").appendChild(document.getElementById("logbox"));
  if (which === "sheet" || which === "bill") { const t = document.getElementById(which === "bill" ? "billtab" : "sheet"); t.appendChild(document.getElementById("logbox")); lastKind = which; }
  if (which === "discord") { const r = document.querySelector('input[name=dcsrc]:checked'); if (!r) document.querySelector('input[name=dcsrc][value='+(pv ? "sheet" : bp ? "bill" : "files")+']').checked = true; dcShow(); }
  if (which === "settings") { renderSaved(); $("wipemsg").textContent = ""; }
  { const ib = document.getElementById("introbox"), on = which === "sheet" || which === "bill"; ib.style.display = on ? "" : "none"; if (on) { document.getElementById("introtxt").textContent = which === "bill" ? "Turns photos of household bills into a sheet with a summary." : "Turns screenshots or a video of your Roblox clan list into an Excel sheet."; } }
  document.getElementById("keybox").style.display = which === "sheet" || which === "bill" ? "" : "none";
}
document.querySelector(".tabs").setAttribute("role", "tablist");
["t0", "t1", "t3", "t6", "t4", "t5"].forEach(id => document.getElementById(id).setAttribute("role", "tab"));
document.getElementById("t0").setAttribute("aria-selected", "true");
document.getElementById("t0").onclick = () => showTab("home");
document.getElementById("t1").onclick = () => showTab("sheet");
document.getElementById("t3").onclick = () => showTab("bill");
document.getElementById("t6").onclick = () => showTab("discord");
document.getElementById("t4").onclick = () => showTab("help");
document.getElementById("t5").onclick = () => showTab("settings");
document.querySelectorAll("[data-go]").forEach(a => { a.onclick = (e) => { e.preventDefault(); showTab(a.dataset.go); window.scrollTo(0, 0); }; });
showTab("home");

// Settings: theme and text size, remembered on this device only (never the key).
const THEMES = [["auto", "Auto"], ["light", "Light"], ["dark", "Dark"], ["ocean", "Ocean"], ["forest", "Forest"], ["berry", "Berry"]];
const SIZES = [["normal", "Normal"], ["large", "Large"]];
const READS = [["normal", "Normal"], ["easy", "Easier"]];
function loadSetting(k, list, d) {
  const v = lsGet(k);
  return list.some(x => x[0] === v) ? v : d;
}
let theme = loadSetting("fcd_theme", THEMES, "auto");
let size = loadSetting("fcd_size", SIZES, "normal");
let read = loadSetting("fcd_read", READS, "normal");
function applyLook() {
  const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = theme === "auto" ? (dark ? "dark" : "light") : theme;
  document.documentElement.dataset.size = size;
  document.documentElement.dataset.read = read;
  for (const [box, list, cur] of [["themeBtns", THEMES, theme], ["sizeBtns", SIZES, size], ["readBtns", READS, read]]) {
    document.getElementById(box).innerHTML = list.map(x => `<button class="tab${x[0] === cur ? " on" : ""}" data-v="${x[0]}">${x[1]}</button>`).join("");
  }
}
document.getElementById("themeBtns").onclick = (e) => { const v = e.target.dataset.v; if (v) { theme = v; lsSet("fcd_theme", v); applyLook(); } };
document.getElementById("sizeBtns").onclick = (e) => { const v = e.target.dataset.v; if (v) { size = v; lsSet("fcd_size", v); applyLook(); } };
document.getElementById("nosave").checked = lsGet("fcd_nosave") === "1";
document.getElementById("nosave").onchange = () => { lsSet("fcd_nosave", document.getElementById("nosave").checked ? "1" : "0"); if (document.getElementById("nosave").checked) wipe("private"); renderSaved(); };
document.getElementById("expire").value = lsGet("fcd_expire") || "7";
document.getElementById("expire").onchange = () => { lsSet("fcd_expire", document.getElementById("expire").value); expireCheck(); renderSaved(); };
document.getElementById("readBtns").onclick = (e) => { const v = e.target.dataset.v; if (v) { read = v; lsSet("fcd_read", v); applyLook(); } };
applyLook();
// Update check: compares this page's BUILD with version.txt on the same site (nothing about you is sent).
const BUILD = "1.1.17";
document.getElementById("autoref").checked = lsGet("fcd_autoref") === "1";
document.getElementById("autoref").onchange = () => lsSet("fcd_autoref", document.getElementById("autoref").checked ? "1" : "0");
document.getElementById("reloadnow").onclick = (e) => { e.preventDefault(); location.reload(); };
if (lsGet("fcd_justupdated") === "1") {
  try { localStorage.removeItem("fcd_justupdated"); } catch (e) {}
  const nv = document.getElementById("newver");
  nv.textContent = "The page just updated to the newest version.";
  nv.style.display = "block";
  setTimeout(() => { nv.style.display = "none"; }, 8000);
}
async function checkUpdate() {
  try {
    const r = await fetch("version.txt?t=" + Date.now(), { cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!r.ok) return;
    const v = (await r.text()).trim();
    if (!/^[\w.-]{1,40}$/.test(v) || v === BUILD) return;
    const busy = typeof images !== "undefined" && images.length > 0;
    if (document.getElementById("autoref").checked && !busy) {
      lsSet("fcd_justupdated", "1");
      const nv = document.getElementById("newver"); nv.textContent = "Updating to the newest version in 3 seconds..."; nv.style.display = "block";
      setTimeout(() => location.reload(), 3000); return;
    }
    document.getElementById("newver").style.display = "block";
  } catch (e) {}
}
if (location.protocol.startsWith("http")) { checkUpdate(); setInterval(checkUpdate, 5 * 60 * 1000); }
// Console: a plain list of what the page did. Nothing here is sent anywhere.
function scrub(t) { // remove the typed key and anything that looks like a key
  t = String(t);
  try { const k = document.getElementById("key").value.trim(); if (k.length >= 6) t = t.split(k).join("[key removed]"); } catch (e) {}
  return t.replace(/sk-[\w-]{8,}|AIza[\w-]{8,}/g, "[key removed]").replace(/https:\/\/discord\.com\/api\/webhooks\/\S+/g, "[link removed]");
}
function clog(text, priv) {
  let t = new Date().toLocaleTimeString();
  try { if (prog.t0) t = ((Date.now() - prog.t0) / 1000).toFixed(1) + "s"; } catch (e) {}
  const box = document.getElementById("console"), line = scrub(text), first = line.split("\n")[0];
  const bad = /error|failed|stopped|blocked|violation|could not|couldn't|BLOCKED/i.test(first), warn = !bad && /warn|check:/i.test(first);
  const row = document.createElement("span");
  if (bad) row.style.color = "#ff6b6b"; else if (warn) row.style.color = "#fbbf24";
  row.textContent = t.padStart(6) + "   " + line + "\n";
  if (priv) row.dataset.priv = "1";
  box.appendChild(row);
  while (box.firstChild && box.childNodes.length > 1 && box.textContent.length > 80000) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
  if (bad) { try { document.getElementById("logbox").open = true; document.getElementById("ghbug").textContent = "Report this error on GitHub"; } catch (e) {} }
}
function envInfo() {
  const n = navigator, c = n.connection || {};
  let mdl = "?"; try { mdl = modelFor(provider()); } catch (e) {}
  return "Page version: " + BUILD + "\nModel: " + mdl + "\nWindow: " + innerWidth + "x" + innerHeight + " at " + devicePixelRatio + "x, screen " + screen.width + "x" + screen.height
    + "\nOnline: " + n.onLine + (c.effectiveType ? ", connection " + c.effectiveType + ", about " + c.rtt + " ms delay, " + c.downlink + " Mbit/s" : "")
    + "\nComputer: " + (n.hardwareConcurrency || "?") + " cores" + (n.deviceMemory ? ", " + n.deviceMemory + " GB" : "") + ", " + n.language;
}
const why = (e) => (e && e.message ? e.message : String(e)) + (e && e.stack ? "\n" + String(e.stack).split("\n").slice(0, 4).join("\n") : "");
addEventListener("error", (e) => { try { clog("PAGE ERROR: " + e.message + " at " + String(e.filename).split("/").pop() + ":" + e.lineno + ":" + e.colno + (e.error && e.error.stack ? "\n" + String(e.error.stack).split("\n").slice(0, 4).join("\n") : "")); } catch (x) {} });
addEventListener("unhandledrejection", (e) => { try { clog("PAGE ERROR (promise): " + why(e.reason)); } catch (x) {} });
addEventListener("securitypolicyviolation", (e) => { try { clog("BLOCKED by the page's security rules: " + e.violatedDirective + " -> " + e.blockedURI + " (" + String(e.sourceFile).split("/").pop() + ":" + e.lineNumber + ")"); } catch (x) {} });
addEventListener("error", (e) => { try { const el = e.target; if (el && el !== window && (el.src || el.href)) clog("FAILED to load: " + (el.src || el.href)); } catch (x) {} }, true);
["error", "warn"].forEach((k) => { const o = console[k]; console[k] = (...a) => { try { clog((k === "error" ? "CONSOLE ERROR: " : "CONSOLE WARN: ") + a.map((x) => x && x.stack ? String(x.stack).split("\n").slice(0, 4).join("\n") : typeof x === "object" ? JSON.stringify(x).slice(0, 300) : String(x)).join(" ")); } catch (x) {} o.apply(console, a); }; });
let images = [];
const MAX_FILES = 30;

const $ = (id) => document.getElementById(id);
// A fault inside the page itself: plain words on screen, the real error goes in the Log.
const plain = (err) => (err instanceof TypeError || err instanceof SyntaxError || err instanceof RangeError || err instanceof ReferenceError) ? "Something went wrong on this page. Tap Copy error to send, and send it to the author." : err.message;
// Live steps under the button while a sheet is being made (nothing is sent anywhere)
const prog = {
  start(id, steps) { this.el = $(id); this.steps = steps; this.i = 0; this.t0 = Date.now(); clearInterval(this.timer); this.timer = setInterval(() => this.draw(), 1000); this.draw(); $("logbox").open = true; clog("Step: " + steps[0]); },
  next() { this.i++; this.draw(); if (this.steps[this.i]) clog("Step: " + this.steps[this.i]); },
  stop(ok) { clearInterval(this.timer); if (ok) this.i = this.steps.length; this.draw(ok ? 1 : 2); this.t0 = 0; },
  draw(end) {
    if (!this.el) return;
    const sec = Math.round((Date.now() - this.t0) / 1000);
    this.el.textContent = "";
    this.steps.forEach((n, k) => {
      const d = document.createElement("div"), now = k === this.i && end !== 1;
      d.className = k < this.i ? "dn" : now ? "now" : "";
      d.textContent = (k < this.i ? "\u2713 " : now ? (end === 2 ? "\u2717 " : "\u25B6 ") : "\u2022 ") + n + (now && end !== 2 ? " (" + sec + "s)" : "");
      this.el.appendChild(d);
    });
    if (end === 1) { const d = document.createElement("div"); d.className = "now"; d.textContent = "Done in " + sec + "s"; this.el.appendChild(d); }
  }
};
const dcSay = (text) => { if ($("discordtab").style.display !== "none") $("hookmsg").textContent = text; };
const setMsg = (text, bad) => { dcSay(text); $("msg").textContent = text; $("msg").className = "msg" + (bad ? " err" : ""); $("copyerr").style.display = bad ? "block" : "none"; if (bad) $("logbox").open = true; };

function showCount(id, n, clear) {
  const box = $(id);
  if (!n) { box.className = ""; box.replaceChildren(); return; }
  box.className = "ok";
  const span = document.createElement("span");
  span.textContent = "\u2713 " + n + " file(s) ready";
  const b = document.createElement("button");
  b.className = "tab"; b.textContent = "Clear"; b.onclick = clear;
  box.replaceChildren(span, b);
}
// running = an AI run is in progress: every start button and the company list stay locked until it ends.
let running = false, billPics = [];
function refresh() {
  showCount("list", images.length, () => { images = []; $("files").value = ""; refresh(); });
  showCount("billlist", billPics.length, () => { billPics = []; $("billfiles").value = ""; refresh(); });
  const key = $("key").value.trim();
  $("go").disabled = running || !(key && images.length);
  $("testgo").disabled = $("go").disabled;
  $("billgo").disabled = running || !(key && billPics.length);
  $("billtest").disabled = running || !(key && billPics.length);
  $("provider").disabled = running;
}

// The Excel part is big, so it loads only when it is needed.
let excelWait = null;
function loadExcel() {
  if (!excelWait) excelWait = new Promise(ok => { const s = document.createElement("script"); s.src = "exceljs.bare.min.js"; s.onload = () => ok(); s.onerror = () => { excelWait = null; ok(); }; document.head.appendChild(s); });
  return excelWait;
}

const vidId = (f) => f.name + "|" + f.size + "|" + f.lastModified;
function usedVids() { try { return JSON.parse(lsGet("fcd_usedvids")) || {}; } catch (e) { return {}; } }
function markUsedVids() {
  const u = usedVids(), day = new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" });
  images.filter((f) => f.type.startsWith("video/")).forEach((f) => { u[vidId(f)] = day; });
  const k = Object.keys(u); k.slice(0, Math.max(0, k.length - 200)).forEach((x) => delete u[x]);
  lsSet("fcd_usedvids", JSON.stringify(u));
}
function addFiles(fileList) {
  loadExcel();
  const seen = usedVids(), old = [];
  for (const f of fileList) {
    if (f.type && f.type.startsWith("video/") && seen[vidId(f)]) old.push(f.name + " (" + seen[vidId(f)] + ")");
    if (!f.size || (!f.type.startsWith("image/") && !f.type.startsWith("video/"))) continue;
    if (images.length >= MAX_FILES) { setMsg("Up to " + MAX_FILES + " files at a time. Tap Clear to start again.", true); break; }
    images.push(f);
  }
  refresh();
  if (old.length) setMsg("Already used: " + old.join(", ") + ". Tap Clear if that was a mistake.", true);
}

// Tiny 192x108 copy (small enough to be quick, big enough to see a few rows scroll in a small clan panel) of a picture, used to tell if two pictures are nearly the same.
function tinyPix(src) { const c = document.createElement("canvas"); c.width = 192; c.height = 108; const x = c.getContext("2d"); x.drawImage(src, 0, 0, 192, 108); return x.getImageData(0, 0, 192, 108).data; }
// Same picture = almost no pixel changed a lot. (A scrolling list only changes a small patch, so an average over the whole screen would call it "same".)
function samePic(a, b) { if (!a || !b) return false; let n = 0; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 60) n++; return n < 6; }

// Pull still frames from a video in the browser: looks about 8 times a second (up to 60 looks), keeps the ones that changed, at most 24 spread over the whole video.
function videoFrames(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.muted = true;
    v.preload = "auto";
    v.src = url;
    v.onerror = () => reject(new Error("This video could not be opened. Try an MP4 recording."));
    v.onloadedmetadata = async () => {
      try {
        const d = v.duration;
        if (!Number.isFinite(d) || !v.videoWidth) throw new Error("This video could not be read. Try an MP4 recording, or use screenshots.");
        const n = Math.min(60, Math.max(8, Math.ceil(d * 8))); // 8 a second: a quick scroll must not skip rows (repeats are dropped below)
        const scale = Math.min(1, 1280 / v.videoWidth);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(v.videoWidth * scale);
        canvas.height = Math.round(v.videoHeight * scale);
        const ctx = canvas.getContext("2d");
        const out = []; let last = null;
        for (let i = 0; i < n; i++) {
          const seeked = new Promise((ok, bad) => { v.onseeked = ok; setTimeout(() => bad(new Error("This video got stuck while reading. Try an MP4 recording, or use screenshots.")), 8000); });
          v.currentTime = ((i + 0.5) * d) / n;
          await seeked;
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
          const tp = tinyPix(canvas);
          if (samePic(last, tp)) continue;
          last = tp;
          out.push({ type: "image/jpeg", data: canvas.toDataURL("image/jpeg", 0.85).split(",")[1] });
        }
        // Too many? Keep 24 spread over the whole video, so the end of the list is not lost.
        resolve(out.length > 24 ? Array.from({ length: 24 }, (_, k) => out[Math.round(k * (out.length - 1) / 23)]) : out);
      } catch (e) { reject(e); } finally { URL.revokeObjectURL(url); }
    };
  });
}

$("drop").onclick = () => $("files").click();
$("files").onchange = (e) => addFiles(e.target.files);
$("drop").ondragover = (e) => e.preventDefault();
$("drop").ondrop = (e) => { e.preventDefault(); addFiles(e.dataTransfer.files); };
$("clanbox").value = lsGet("fcd_clan") || "";
$("clanbox").oninput = () => lsSet("fcd_clan", clean($("clanbox").value, 40));
// Privacy: see and clear what is saved on this device. Values are never shown or sent anywhere.
function savedKeys() { const out = []; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith("fcd_")) out.push(k); } } catch (e) {} return out; }
let hookNow = ""; const hookGet = () => hookNow || lsGet("fcd_hook") || "";
function renderSaved() {
  const keys = savedKeys(), lines = [];
  keys.filter(k => k.startsWith("fcd_key_")).forEach(k => { const id = k.slice(8); lines.push("AI key (" + (PROVIDERS[id] ? PROVIDERS[id].name : "other") + ")"); });
  if (keys.includes("fcd_prev")) { let n = ""; try { n = " (" + JSON.parse(lsGet("fcd_prev")).entries.length + " members)"; } catch (e) {} lines.push("Last sheet, names, points and past runs" + n); }
  if (keys.includes("fcd_clan")) lines.push("Clan name");
  if (keys.includes("fcd_game")) lines.push("Game name");
  if (keys.includes("fcd_hook")) lines.push("Discord link");
  if (keys.includes("fcd_art")) lines.push("Discord header picture");
  if (keys.some(k => k.startsWith("fcd_model_"))) lines.push("AI model name");
  if (keys.some(k => ["fcd_theme", "fcd_size", "fcd_read", "fcd_nosave", "fcd_expire", "fcd_autoref", "fcd_provider", "fcd_hookxlsx", "fcd_pingmode", "fcd_pingrole"].includes(k))) lines.push("Look and settings");
  const box = $("saved"); box.replaceChildren();
  (lines.length ? lines : ["Nothing saved."]).forEach(t => { const d = document.createElement("div"); d.textContent = (lines.length ? "\u2022 " : "") + t; box.appendChild(d); });
  $("keepprev").checked = lsGet("fcd_keepprev") !== "0";
  $("hookbox").value = hookGet(); if (lsGet("fcd_hook")) $("hookkeep").checked = true; $("hookkeepnote").style.display = $("hookkeep").checked ? "" : "none";
  artShow();
}
$("keepprev").onchange = () => { lsSet("fcd_keepprev", $("keepprev").checked ? "1" : "0"); if (!$("keepprev").checked) { try { localStorage.removeItem("fcd_prev"); } catch (e) {} } renderSaved(); };
function wipe(what) {
  try { savedKeys().filter(k => (what === "all" && k !== "fcd_nosave" && k !== "fcd_expire") || (what === "private" && !LOOK_KEYS.includes(k)) || k.startsWith("fcd_key_")).forEach(k => localStorage.removeItem(k)); } catch (e) {}
  $("key").value = ""; $("remember").checked = false;
  if (what !== "key") { hookNow = ""; prevMap = null; prevName = ""; showPrev(); $("clanbox").value = ""; }
  refresh(); renderSaved();
  $("wipemsg").textContent = what !== "key" ? "Everything saved on this device was deleted." : "Your key was forgotten.";
}
const confirmTap = (id, label, fn) => { let t = 0; $(id).onclick = () => { if (t) { clearTimeout(t); t = 0; $(id).textContent = label; fn(); return; } $(id).textContent = "Tap again to confirm"; t = setTimeout(() => { t = 0; $(id).textContent = label; }, 4000); }; };
confirmTap("wipekey", "Forget my key", () => wipe("key"));
confirmTap("wipeall", "Delete everything saved", () => wipe("all"));
renderSaved();
$("key").oninput = () => { refresh(); if ($("remember").checked) keepKey(); };

function provider() { return $("provider").value; }
function modelFor(id) { const m = (lsGet("fcd_model_" + id) || "").trim(); return /^[\w.\-]{1,80}$/.test(m) ? m : PROVIDERS[id].model; } // odd characters could change the web address
function applyProvider(clearKey) {
  const id = provider(), p = PROVIDERS[id];
  $("keylabel").textContent = "Your AI key (" + p.name + ")";
  $("keyhelp").style.display = id === "gemini" ? "inline-block" : "none";
  $("keylimit").style.display = id === "gemini" ? "block" : "none";
  $("untested").style.display = p.tested ? "none" : "block";
  $("modelbox").placeholder = p.model;
  $("modelbox").value = lsGet("fcd_model_" + id) || "";
  lsSet("fcd_provider", id);
  const kept = lsGet("fcd_key_" + id);
  $("remember").checked = !!kept;
  $("remnote").style.display = kept ? "block" : "none";
  if (clearKey || kept) { $("key").value = kept || ""; refresh(); }
}
function keepKey() {
  const id = provider(), on = $("remember").checked;
  $("remnote").style.display = on ? "block" : "none";
  try { if (on && $("key").value.trim()) lsSet("fcd_key_" + id, $("key").value.trim()); else localStorage.removeItem("fcd_key_" + id); } catch (e) {}
}
$("remember").onchange = keepKey;
function bugReport(skipPrivate) {
  const box = $("console"); let t = "";
  box.childNodes.forEach((n) => { if (!(skipPrivate && n.dataset && n.dataset.priv)) t += n.textContent; });
  return scrub("Fishing Cat Data bug report\n" + new Date().toUTCString() + "\nError shown: " + ($("msg").className.includes("err") ? $("msg").textContent : "none") + "\nBrowser: " + navigator.userAgent + "\nCompany: " + provider() + "\n" + envInfo() + "\n\n" + (t || "(log is empty)"));
}
const bugCopy = async (btn, label) => {
  let done = "Copied! Paste it to Claude";
  try { await navigator.clipboard.writeText(bugReport(false)); } catch (e) { done = "Couldn't copy: select the log and copy by hand"; }
  btn.textContent = done; setTimeout(() => { btn.textContent = label; }, 3000);
};
// GitHub new-issue form, filled in. Opens only when tapped. Leaves out any copy of the AI's reply.
function issueUrl() {
  const full = bugReport(true), cut = full.indexOf("\n\n"), head = full.slice(0, cut).slice(0, 800), log = full.slice(cut + 2);
  const bad = log.split("\n").filter((l) => /error|failed|stopped|blocked/i.test(l)), last = bad.length ? bad[bad.length - 1].replace(/^\s*[\d.]+s?\s+/, "").slice(0, 80) : "describe it here";
  const body = "**What were you doing?** (optional)\n\n\n**Report** (made by the page; keys, pictures and AI replies are not included)\n```\n" + head + "\n\n" + log.slice(-1800) + "\n```";
  return "https://github.com/Ginger-Hermit/Fishing-cat-data/issues/new?title=" + encodeURIComponent("Problem: " + last) + "&body=" + encodeURIComponent(body);
}
$("ghbug").onclick = () => { $("ghbug").href = issueUrl(); };
$("copybug").onclick = () => bugCopy($("copybug"), "Copy bug report");
$("copyerr").onclick = () => bugCopy($("copyerr"), "Copy error to send");

const savedProvider = lsGet("fcd_provider");
if (savedProvider && PROVIDERS[savedProvider]) $("provider").value = savedProvider;
$("provider").onchange = () => applyProvider(true);
$("modelbox").oninput = () => lsSet("fcd_model_" + provider(), $("modelbox").value);
applyProvider(false);

// Warn if this page is opened from anywhere but the real address (a copy could steal keys).
const REAL_HOST = "fishing-cat-data.pages.dev";
{
  const h = location.hostname;
  if (!(location.protocol === "file:" || h === "localhost" || h === REAL_HOST || h.endsWith("." + REAL_HOST))) {
    $("fake").style.display = "block";
    $("key").disabled = true;
    $("key").placeholder = "Don't paste your key here";
  }
}


// Tidy one value from the AI: text or number only, no hidden characters, not too long.
const tidy = (v, n) => (typeof v === "string" || typeof v === "number") ? String(v).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, n) : "";
function parseRows(text) {
  text = String(text ?? "").slice(0, 100000); // real replies are small; a giant one must not freeze the page
  let rows, cut = false;
  try { rows = JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1)).flat(2); }
  catch (e) {
    // Reply was cut off or untidy: keep every complete row. It was cut off if no "]" follows the last row.
    rows = []; let end = 0;
    for (const m of text.matchAll(/\{[^{}]*\}/g)) { try { rows.push(JSON.parse(m[0])); end = m.index + m[0].length; } catch (x) {} }
    cut = !text.slice(end).includes("]");
  }
  if (!rows.length && !/\[\s*\]/.test(text)) throw new Error("The AI did not return a list of rows. Try again.");
  // Pictures overlap, so the same member can appear more than once. Keep the first one.
  const seen = new Set();
  const out = rows.filter(r => {
    if (!r || typeof r !== "object") return false;
    r.name = tidy(r.name, 60);
    if (!r.name || r.points === undefined) return false;
    const k = r.name.toLowerCase();
    if (k !== "?" && seen.has(k)) return false;
    seen.add(k);
    r.unsure = r.unsure === true;
    r.role = tidy(r.role, 40);
    r.points = tidy(r.points, 20) || "?";
    const n = Number(String(r.rank ?? "").replace(/^#\s*/, ""));
    r.rank = Number.isInteger(n) && n > 0 && n < 100000 ? n : "";
    return true;
  });
  out.cut = cut;
  return out;
}


// Excel: turn "52.51K" into 52510, read an earlier sheet, build the new one.
function parsePoints(t) {
  let u = String(t ?? "").trim().replace(/^(\d+),(\d{1,2})\s*([KkMmBbTt])$/, "$1.$2$3").replace(/,/g, "").replace(/^\+\s*/, "").replace(/\s*(pts?|points?)\.?$/i, "");
  if (/^\d{1,3}(?:[.\s\u00a0\u202f']\d{3})+$/.test(u)) u = u.replace(/\D/g, ""); // 1.234.567, 1 234, 1'234 = thousands marks
  const m = u.match(/^(\d+(?:\.\d+)?|\.\d+)\s*([KkMmBbTt]?)$/);
  if (!m) return null;
  const n = Math.round(parseFloat(m[1]) * { "": 1, k: 1e3, m: 1e6, b: 1e9, t: 1e12 }[m[2].toLowerCase()]);
  return n <= 1e15 ? n : null; // bigger than Excel can hold exactly: treat as unreadable
}

// Zip bomb guard: read the zip's own list of sizes before unpacking (an Excel file is a zip)
function zipCheck(buf) {
  const v = new DataView(buf instanceof ArrayBuffer ? buf : buf.buffer, buf.byteOffset || 0, buf.byteLength), len = v.byteLength;
  let e = len - 22; while (e >= Math.max(0, len - 65557) && v.getUint32(e, true) !== 0x06054b50) e--;
  if (e < Math.max(0, len - 65557)) throw new Error("That file is not an Excel sheet.");
  let p = v.getUint32(e + 16, true), tot = 0; const n = v.getUint16(e + 10, true);
  if (n > 2000) throw new Error("That Excel file is too big to be one of ours.");
  for (let k = 0; k < n; k++) {
    if (p + 46 > len || v.getUint32(p, true) !== 0x02014b50) throw new Error("That Excel file is damaged.");
    tot += v.getUint32(p + 24, true); p += 46 + v.getUint16(p + 28, true) + v.getUint16(p + 30, true) + v.getUint16(p + 32, true);
  }
  if (tot > 1e8) throw new Error("That Excel file is too big to be one of ours.");
}
async function readPrevious(EJ, buf) {
  if (buf && buf.byteLength > 5e6) throw new Error("That Excel file is too big to be one of ours.");
  const wb = new EJ.Workbook();
  zipCheck(buf); await wb.xlsx.load(buf);
  const ws = wb.getWorksheet("Clan Members") || wb.worksheets[0];
  let head = 0;
  ws.eachRow((row, n) => { if (!head && String(row.getCell(2).value).trim() === "Username") head = n; });
  if (!head) throw new Error("That file is not a sheet made by this page.");
  const map = new Map(), names = new Map();
  for (let r = head + 1; r <= Math.min(ws.rowCount, 5000); r++) {
    const name = ws.getCell(r, 2).value;
    let pts = ws.getCell(r, 5).value;
    if (pts && typeof pts === "object" && "result" in pts) pts = pts.result;
    if (name && typeof pts === "number") { const k = String(name).trim().toLowerCase(); map.set(k, pts); names.set(k, String(name).trim()); }
  }
  map.hist = readHistory(wb, ws, map, names);
  return dayBase(map);
}
// A sheet made earlier today is not a fair baseline (a re-run would compare with itself): use the last earlier day instead.
function dayBase(map) {
  const hh = map.hist, t = new Date(), today = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
  if (hh && hh.dates.length > 1 && hh.dates[hh.dates.length - 1] === today) {
    const col = hh.dates.length - 2, m2 = new Map();
    hh.players.forEach(([k, e]) => { if (e && typeof e.vals[col] === "number") m2.set(k, e.vals[col]); });
    if (m2.size) { m2.hist = hh; return m2; }
  }
  return map;
}

// Carries the Points history tab of the earlier sheet forward (no AI). Old sheets without it start a one-run history.
function readHistory(wb, ws, map, names) {
  const dv = (c) => { let v = c.value; if (v && typeof v === "object" && "result" in v) v = v.result; return v; };
  const day = (d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  let dates = [], players = new Map();
  const hs = wb.getWorksheet("Points history");
  if (hs) {
    for (let c = 3; c <= Math.min(hs.columnCount, 400); c++) { const v = dv(hs.getCell(3, c)); if (v instanceof Date) dates.push(day(v)); else break; }
    for (let r = 4; dates.length && r <= Math.min(hs.rowCount, 5000); r++) {
      if (String(dv(hs.getCell(r, 2))) !== "Points") continue;
      const name = dv(hs.getCell(r, 1));
      if (!name || String(name) === "Clan total") continue;
      players.set(String(name).trim().toLowerCase(), { name: String(name).trim(), vals: dates.map((_, i) => { const v = dv(hs.getCell(r, 3 + i)); return typeof v === "number" ? v : null; }) });
    }
  }
  if (!dates.length) {
    const d = dv(ws.getCell("L8"));
    dates = [day(d instanceof Date ? d : (wb.modified || wb.created || new Date()))];
  }
  const li = dates.length - 1;
  map.forEach((pts, k) => {
    let e = players.get(k);
    if (!e) { e = { name: names.get(k), vals: dates.map(() => null) }; players.set(k, e); }
    e.vals[li] = pts;
  });
  const lbs = wb.getWorksheet("Leaderboard");
  if (lbs) for (let r = 4; r <= Math.min(lbs.rowCount, 5000); r++) {
    const e = players.get(String(dv(lbs.getCell(r, 2)) ?? "").trim().toLowerCase()), d = dv(lbs.getCell(r, 8)), v = dv(lbs.getCell(r, 9));
    if (e && d instanceof Date && typeof v === "number") e.start = [day(d), v];
  }
  return { dates, players: [...players] };
}

// One letter misread by the AI (healthles / Healthies) = same player. Only for names of 6+ letters, and only when the match is unique.
function nameClose(a, b) {
  if (a.length < 6 || b.length < 6 || Math.abs(a.length - b.length) > 1) return false;
  const fold = (t) => t.replace(/q/g, "g").replace(/0/g, "o").replace(/[1i]/g, "l"); // letters the AI mixes up (pogger195 / poqqer195)
  if (a.length === b.length && fold(a) === fold(b)) return true;
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
  const [x, y] = a.length > b.length ? [a, b] : [b, a];
  return x.slice(i + 1) === y.slice(i);
}
const okName = (n) => /^[A-Za-z0-9]+(_[A-Za-z0-9]+)?$/.test(String(n).trim());
function fixNames(prev, rows) {
  if (!prev) return prev;
  const norm = (n) => String(n).trim().toLowerCase();
  const cur = new Set(rows.map((r) => norm(r.name)));
  const old = new Set([...prev.keys(), ...(prev.hist ? prev.hist.players.map(([k]) => k) : [])]);
  const free = [...old].filter((k) => !cur.has(k));
  rows.forEach((r) => {
    const k = norm(r.name);
    if (old.has(k)) return;
    const m = free.filter((f) => nameClose(f, k));
    if (m.length !== 1) return;
    // Close to a name from earlier runs = the AI misread it (l for 1 etc.), so keep the earlier spelling.
    const h = prev.hist && prev.hist.players.find(([x]) => x === m[0]);
    const was = (h && h[1] && h[1].name) || m[0];
    free.splice(free.indexOf(m[0]), 1);
    // Earlier spelling is not a possible Roblox name (dots, two underscores) but the new one is: keep the new one and move the history to it.
    if (!okName(was) && okName(r.name)) {
      if (prev.has(m[0])) { prev.set(k, prev.get(m[0])); prev.delete(m[0]); }
      if (h) { h[0] = k; if (h[1] && h[1].name) h[1].name = String(r.name).trim(); }
      return;
    }
    r.name = was;
  });
  return prev;
}

function colL(n) { let t = ""; while (n > 0) { const m = (n - 1) % 26; t = String.fromCharCode(65 + m) + t; n = Math.floor((n - 1) / 26); } return t; }

// Adds today's run to the earlier history (same day twice = replace that column).
function mergeHist(prev, rows) {
  const n = new Date(), today = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
  // An earlier sheet with no history (old sheet, or one saved before this update) becomes the first column.
  const h = prev && (prev.hist || { dates: [today], players: [...prev].map(([k, v]) => [k, { name: k, vals: [v] }]) });
  const dates = h ? h.dates.slice() : [];
  const pl = new Map(h ? h.players.map(([k, e]) => [k, { name: e.name, vals: e.vals.slice(), start: e.start || null }]) : []);
  let col = dates.length - 1;
  if (col > 0 && dates[col] === today) pl.forEach((e) => { e.vals[col] = null; });
  else { dates.push(today); col = dates.length - 1; pl.forEach((e) => e.vals.push(null)); }
  rows.forEach((r) => {
    const num = parsePoints(r.points);
    if (num === null) return;
    const k = String(r.name).trim().toLowerCase();
    let e = pl.get(k);
    if (!e) { e = { name: String(r.name).trim(), vals: dates.map(() => null) }; pl.set(k, e); }
    e.name = String(r.name).trim(); e.vals[col] = num;
  });
  pl.forEach((e) => { if (!e.start) { const i = e.vals.findIndex((v) => v !== null); if (i >= 0) e.start = [dates[i], e.vals[i]]; } });
  // Earlier months fold into one column: the last run of that month.
  const mk = (d) => { const x = new Date(d); return x.getUTCFullYear() * 12 + x.getUTCMonth(); };
  for (let i = dates.length - 2; i >= 0; i--) {
    if (mk(dates[i]) < mk(today) && mk(dates[i]) === mk(dates[i + 1])) {
      pl.forEach((e) => { if (e.vals[i + 1] === null) e.vals[i + 1] = e.vals[i]; e.vals.splice(i, 1); });
      dates.splice(i, 1);
    }
  }
  const N = dates.length;
  const list = [...pl.values()].map((e) => {
    const idx = e.vals.map((v, i) => (v === null ? -1 : i)).filter((i) => i >= 0);
    const fi = idx.length ? idx[0] : 0, li = idx.length ? idx[idx.length - 1] : 0;
    const first = e.start ? e.start[1] : null, last = e.vals[li];
    return { name: e.name, vals: e.vals, fi, li, first, last, since: e.start ? e.start[0] : dates[fi], gained: first === null ? 0 : last - first, here: e.vals[N - 1] !== null };
  }).filter((e) => e.first !== null && e.last !== null);
  list.sort((a, b) => (b.here - a.here) || (b.gained - a.gained) || (b.last - a.last));
  return { dates, list };
}

function buildWorkbook(EJ, rows, prev, p, when) {
  prev = fixNames(prev, rows);
  const wb = new EJ.Workbook();
  wb.calcProperties.fullCalcOnLoad = true;
  const NAVY = "FF1F3864", INK = "FF1F2937", GREY = "FF7F7F7F";
  const fill = (c) => ({ type: "pattern", pattern: "solid", fgColor: { argb: c } });
  const ws = wb.addWorksheet("Clan Members", { views: [{ state: "frozen", ySplit: 3 }] });
  const lb = wb.addWorksheet("Leaderboard", { views: [{ state: "frozen", ySplit: 3 }] });
  [11, 26, 18, 24, 22, 19, 14, 15, 12, 3, 29, 22].forEach((w, i) => { ws.getColumn(i + 1).width = w; });
  ws.mergeCells("A1:I1");
  ws.mergeCells("A2:I2");
  ws.getCell("A1").value = p.clan + " \u2013 Member Points";
  ws.getCell("A1").font = { bold: true, size: 16, color: { argb: NAVY } };
  ws.getCell("A2").value = p.game + "   \u00b7   Recorded " + when + "   \u00b7   " + rows.length + " members read";
  ws.getCell("A2").font = { color: { argb: GREY } };
  ["Rank", "Username", p.extra || "Role", "Points (as shown)", "Points (number)", "Previous Points", "Change", "% Change", "Trend"].forEach((h, i) => {
    const c = ws.getCell(3, i + 1);
    c.value = h; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = fill(NAVY);
  });
  const rankLook = { 1: ["FFFFF2CC", "FF7F6000"], 2: ["FFEDEDED", "FF404040"], 3: ["FFFBE5D6", "FF843C0C"] };
  rows.forEach((r, i) => {
    const n = i + 4;
    const rk = ws.getCell(n, 1);
    rk.value = r.rank;
    const look = rankLook[r.rank];
    rk.font = { bold: true, color: { argb: look ? look[1] : GREY } };
    if (look) rk.fill = fill(look[0]);
    ws.getCell(n, 2).value = r.name;
    const role = ws.getCell(n, 3);
    role.value = r.role || "";
    if (p.extra) { /* extra column: plain text */ }
    else if (/owner/i.test(role.value)) { role.font = { bold: true, color: { argb: "FF7F6000" } }; role.fill = fill("FFFFE699"); }
    else if (/coach/i.test(role.value)) { role.font = { bold: true, color: { argb: "FF843C0C" } }; role.fill = fill("FFFCE4D6"); }
    ws.getCell(n, 4).value = String(r.points);
    ws.getCell(n, 4).font = { color: { argb: GREY } };
    const num = parsePoints(r.points);
    const e = ws.getCell(n, 5);
    if (num !== null) e.value = num;
    e.numFmt = "#,##0"; e.font = { bold: true, color: { argb: INK } };
    const f = ws.getCell(n, 6);
    const before = prev && prev.get(String(r.name).trim().toLowerCase());
    if (before !== undefined && before !== false) f.value = before;
    f.numFmt = "#,##0"; f.font = { color: { argb: GREY } };
    ws.getCell(n, 7).value = { formula: `IF(OR(F${n}="",E${n}=""),"",E${n}-F${n})` };
    ws.getCell(n, 7).numFmt = "\\+#,##0;\\-#,##0;0";
    ws.getCell(n, 8).value = { formula: `IF(OR(F${n}="",E${n}="",F${n}=0),"",E${n}/F${n}-1)` };
    ws.getCell(n, 8).numFmt = "\\+0.0%;\\-0.0%;0.0%";
    const arrows = `IF(G${n}>0,"\u25b2",IF(G${n}<0,"\u25bc","\u2013"))`;
    ws.getCell(n, 9).value = { formula: prev ? `IF(G${n}="",IF(AND(E${n}<>"",F${n}=""),"new",""),${arrows})` : `IF(G${n}="","",${arrows})` };
  });
  const last = rows.length + 3;
  const LINE = { style: "thin", color: { argb: "FFD0D5DD" } };
  const box = { left: LINE, right: LINE, top: LINE, bottom: LINE };
  ws.getRow(1).height = 30; ws.getRow(2).height = 18; ws.getRow(3).height = 30;
  ws.getCell("A1").alignment = { vertical: "middle" };
  ws.getCell("A2").alignment = { vertical: "middle" };
  for (let c = 1; c <= 9; c++) {
    const h = ws.getCell(3, c);
    h.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    h.border = { left: LINE, right: LINE, top: LINE, bottom: { style: "medium", color: { argb: NAVY } } };
  }
  const aligns = ["center", "left", "left", "right", "right", "right", "center", "center", "center"];
  for (let n = 4; n <= last; n++) {
    ws.getRow(n).height = 19.5;
    for (let c = 1; c <= 9; c++) {
      const cell = ws.getCell(n, c);
      cell.border = box;
      cell.alignment = { horizontal: aligns[c - 1], vertical: "middle", indent: (c === 2 || c === 3) ? 1 : 0 };
      if (!cell.font || !cell.font.color) cell.font = Object.assign({}, cell.font, { color: { argb: INK } });
    }
  }
  ws.autoFilter = `A3:I${last}`;
  const up = { font: { color: { argb: "FF006100" } }, fill: { type: "pattern", pattern: "solid", bgColor: { argb: "FFC6EFCE" } } };
  const down = { font: { color: { argb: "FF9C0006" } }, fill: { type: "pattern", pattern: "solid", bgColor: { argb: "FFFFC7CE" } } };
  ws.addConditionalFormatting({ ref: `G4:I${last}`, rules: [
    { type: "expression", priority: 1, formulae: ["AND(ISNUMBER($G4),$G4>0)"], style: up },
    { type: "expression", priority: 2, formulae: ["AND(ISNUMBER($G4),$G4<0)"], style: down }
  ] });
  ws.addConditionalFormatting({ ref: `E4:E${last}`, rules: [
    { type: "colorScale", priority: 3, cfvo: [{ type: "min" }, { type: "max" }], color: [{ argb: "FFFFFFFF" }, { argb: "FFB7E1CD" }] }
  ] });
  ws.addConditionalFormatting({ ref: `B4:B${last} D4:I${last}`, rules: [
    { type: "expression", priority: 4, formulae: ["MOD(ROW(),2)=0"], style: { fill: { type: "pattern", pattern: "solid", bgColor: { argb: "FFF5F7FA" } } } }
  ] });
  // Clan Summary box
  const B = `B4:B${last}`, E = `E4:E${last}`, F = `F4:F${last}`, G = `G4:G${last}`;
  const head = (addr, text) => {
    const a = addr.split(":")[0];
    ws.mergeCells(addr);
    const c = ws.getCell(a);
    c.value = text; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = fill(NAVY);
    c.alignment = { horizontal: "center", vertical: "middle" };
    const row = Number(a.slice(1));
    ws.getRow(row).height = 24;
    ["K", "L"].forEach((col) => { ws.getCell(col + row).border = { left: LINE, right: LINE, top: LINE, bottom: { style: "medium", color: { argb: NAVY } } }; });
  };
  const line = (row, label, value, fmt) => {
    const k = ws.getCell("K" + row), l = ws.getCell("L" + row);
    k.value = label; k.font = { bold: true, size: 10, color: { argb: INK } }; k.fill = fill("FFF5F7FA");
    k.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    if (value !== undefined && value !== null) l.value = value;
    if (fmt) l.numFmt = fmt;
    l.font = { color: { argb: INK } }; l.alignment = { horizontal: "right", vertical: "middle" };
    k.border = box; l.border = box;
    ws.getRow(row).height = 19.5;
  };
  head("K3:L3", "Clan Summary");
  line(4, "Members", { formula: `COUNTIF(${B},"<>(not read)")` }, "0");
  line(5, "Total Points", { formula: `SUM(${E})` }, "#,##0");
  line(6, "Average Points", { formula: `IFERROR(AVERAGE(${E}),"")` }, "#,##0");
  line(7, "Total Change (returning)", { formula: `IF(COUNT(${G})=0,"",SUM(${G}))` }, "\\+#,##0;\\-#,##0;0");
  line(8, "Total % Change (returning)", { formula: `IF(OR(COUNT(${G})=0,SUM(${F})=0),"",SUM(${G})/SUM(${F}))` }, "\\+0.0%;\\-0.0%;0.0%");
  line(9, "Members Up", { formula: `IF(COUNT(${G})=0,"",COUNTIF(${G},">0"))` }, "0");
  line(10, "Members Down", { formula: `IF(COUNT(${G})=0,"",COUNTIF(${G},"<0"))` }, "0");
  line(11, "Top Gainer", { formula: `IF(COUNT(${G})=0,"",IF(MAX(${G})<=0,"",INDEX(${B},MATCH(MAX(${G}),${G},0))))` }, "@");
  line(12, "Biggest Drop", { formula: `IF(COUNT(${G})=0,"",IF(MIN(${G})>=0,"",INDEX(${B},MATCH(MIN(${G}),${G},0))))` }, "@");
  ws.getCell("K13").value = "Change values appear from the second week on. New members are left out of the change totals.";
  ws.getCell("K13").font = { italic: true, size: 9, color: { argb: GREY } };
  ["L7", "L8"].forEach((a) => {
    const rr = a.slice(1);
    ws.addConditionalFormatting({ ref: a, rules: [
      { type: "expression", priority: 5, formulae: [`AND(ISNUMBER($L$${rr}),$L$${rr}>0)`], style: up },
      { type: "expression", priority: 6, formulae: [`AND(ISNUMBER($L$${rr}),$L$${rr}<0)`], style: down }
    ] });
  });
  // Points history + Leaderboard (no AI: old numbers come from the earlier sheet, Excel does the sums)
  const H = mergeHist(prev, rows), N = H.dates.length, LC = colL(2 + N), HS = "'Points history'!";
  const hs = wb.addWorksheet("Points history", { views: [{ state: "frozen", ySplit: 3 }] }); // rows only: a frozen column would cut the how-to-read box in half
  hs.getColumn(1).width = 26; hs.getColumn(2).width = 9;
  hs.getCell("A1").value = p.clan + " \u2013 Points history"; hs.getCell("A1").font = { bold: true, size: 16, color: { argb: NAVY } };
  const KEY = (parts) => ({ richText: parts.map(([text, c, b]) => ({ text, font: { size: 10, bold: !!b, color: { argb: c || INK } } })) });
  const GRN = "FF006100", RED = "FF9C0006", SOFT = "FFF5F7FA";
  const KC = Math.max(5, 2 + N), KW = 35 + 14 * (KC - 2); // the box stops at the last run, so nothing runs off screen
  hs.mergeCells(`A1:${colL(KC)}1`);
  hs.mergeCells(`A2:${colL(KC)}2`);
  hs.getCell("A2").value = KEY([["How to read  ", NAVY, 1], ["Each column is one run. The bold number is the points that day. The small number under it is what was gained since the run before.\n"], ["Green = went up", GRN, 1], ["     "], ["Red = went down", RED, 1], ["     "], ["Gold, silver, bronze = top 3 gainers", "FF7F6000", 1], ["     "], ["Grey = left the clan", GREY, 1], ["     Earlier months show their last run only."]]);
  hs.getCell("A2").alignment = { wrapText: true, vertical: "middle", indent: 1 }; hs.getCell("A2").fill = fill(SOFT); hs.getRow(2).height = Math.max(48, (Math.ceil(135 / KW) + Math.ceil(170 / KW)) * 14 + 12); hs.getRow(1).height = 30;
  hs.getCell("A1").alignment = { vertical: "middle" };
  ["Username", ""].forEach((t, i) => { const c = hs.getCell(3, i + 1); c.value = t; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = fill(NAVY); });
  H.dates.forEach((d, i) => {
    hs.getColumn(3 + i).width = 14;
    const c = hs.getCell(3, 3 + i);
    c.value = new Date(d); c.numFmt = "d\\ mmm\\ yy"; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = fill(NAVY); c.alignment = { horizontal: "center" };
  });
  hs.getRow(3).height = 24;
  const hrow = (i) => 4 + 2 * i;
  H.list.forEach((e, i) => {
    const r = hrow(i);
    hs.mergeCells(r, 1, r + 1, 1);
    hs.getCell(r, 1).value = e.name; hs.getCell(r, 1).font = { bold: true, italic: !e.here, color: { argb: e.here ? INK : GREY } };
    hs.getCell(r, 1).alignment = { vertical: "middle", indent: 1 };
    const med = e.here && e.gained > 0 && rankLook[i + 1];
    if (med) { hs.getCell(r, 1).fill = fill(med[0]); hs.getCell(r, 1).font = { bold: true, color: { argb: med[1] } }; }
    for (let c = 1; c <= 2 + N; c++) for (const rr of [r, r + 1]) { const x = hs.getCell(rr, c); x.border = box; if (i % 2 && !(c === 1 && med)) x.fill = fill(SOFT); }
    hs.getRow(r).height = 18; hs.getRow(r + 1).height = 15;
    hs.getCell(r, 2).value = "Points"; hs.getCell(r, 2).font = { size: 9, color: { argb: GREY } };
    hs.getCell(r + 1, 2).value = "Gain"; hs.getCell(r + 1, 2).font = { size: 9, color: { argb: GREY } };
    e.vals.forEach((v, k) => {
      const c = hs.getCell(r, 3 + k);
      if (v !== null) c.value = v;
      c.numFmt = "#,##0"; c.font = { bold: true, color: { argb: INK } }; c.alignment = { horizontal: "right" };
      const g = hs.getCell(r + 1, 3 + k);
      if (k > 0) g.value = { formula: `IF(OR(${colL(2 + k)}${r}="",${colL(3 + k)}${r}=""),"",${colL(3 + k)}${r}-${colL(2 + k)}${r})` };
      g.numFmt = "\\+#,##0;\\-#,##0;0"; g.font = { size: 9, color: { argb: GREY } }; g.alignment = { horizontal: "right" };
    });
  });
  const tr = hrow(H.list.length), lastH = tr - 1;
  hs.getCell(tr, 1).value = "Clan total"; hs.getCell(tr, 2).value = "Points"; hs.getCell(tr + 1, 2).value = "Gain";
  for (let k = 0; k < N; k++) {
    const cl = colL(3 + k);
    const t = hs.getCell(tr, 3 + k);
    t.value = { formula: `SUMIF($B$4:$B$${lastH},"Points",${cl}$4:${cl}$${lastH})` }; t.numFmt = "#,##0"; t.font = { bold: true, color: { argb: NAVY } };
    if (k > 0) { const g = hs.getCell(tr + 1, 3 + k); g.value = { formula: `${cl}${tr}-${colL(2 + k)}${tr}` }; g.numFmt = "\\+#,##0;\\-#,##0;0"; g.font = { size: 9, color: { argb: GREY } }; }
  }
  hs.getCell(tr, 1).font = { bold: true, color: { argb: NAVY } }; hs.getCell(tr, 1).alignment = { indent: 1 };
  for (let c = 1; c <= 2 + N; c++) {
    hs.getCell(tr, c).border = { left: LINE, right: LINE, bottom: LINE, top: { style: "medium", color: { argb: NAVY } } }; hs.getCell(tr + 1, c).border = box;
    hs.getCell(tr, c).fill = fill("FFE8EDF5"); hs.getCell(tr + 1, c).fill = fill("FFE8EDF5");
    hs.getCell(3, c).border = { left: LINE, right: LINE, top: LINE, bottom: { style: "medium", color: { argb: NAVY } } };
  }
  hs.getCell(tr, 2).font = { size: 9, color: { argb: GREY } }; hs.getCell(tr + 1, 2).font = { size: 9, color: { argb: GREY } };
  hs.addConditionalFormatting({ ref: `C4:${LC}${tr + 1}`, rules: [
    { type: "expression", priority: 7, formulae: ['AND($B4="Gain",ISNUMBER(C4),C4>0)'], style: up },
    { type: "expression", priority: 8, formulae: ['AND($B4="Gain",ISNUMBER(C4),C4<0)'], style: down }
  ] });

  lb.getColumn(1).width = 8; lb.getColumn(2).width = 26;
  [14, 20, 14, 17, 14, 14].forEach((w, i) => { lb.getColumn(3 + i).width = w; });
  lb.getColumn(9).hidden = true; lb.getColumn(10).hidden = true;
  lb.mergeCells("A1:H1"); lb.mergeCells("A2:H2");
  lb.getCell("A1").value = p.clan + " \u2013 Leaderboard"; lb.getCell("A1").font = { bold: true, size: 16, color: { argb: NAVY } };
  lb.getCell("A2").value = KEY([["How to read  ", NAVY, 1], ["Ranked by points gained since each player's first run (" + N + (N === 1 ? " run" : " runs") + " so far). Now = points today. Best run = biggest jump between two runs. Avg / day = gained per day.\n"], ["Green = went up", GRN, 1], ["     "], ["Red = went down", RED, 1], ["     "], ["Gold, silver, bronze = top 3", "FF7F6000", 1], ["     "], ["Grey = left the clan", GREY, 1]]);
  lb.getCell("A2").alignment = { wrapText: true, vertical: "middle", indent: 1 }; lb.getCell("A2").fill = fill(SOFT); lb.getRow(2).height = 48;
  lb.getCell("A1").alignment = { vertical: "middle" };
  lb.getRow(1).height = 30;
  ["#", "Username", "Now", "Gained (all time)", "Best run", "Best run date", "Avg / day", "Since", "Started at", "Last seen"].forEach((h, i) => {
    const c = lb.getCell(3, i + 1);
    c.value = h; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = fill(NAVY);
    c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    c.border = { left: LINE, right: LINE, top: LINE, bottom: { style: "medium", color: { argb: NAVY } } };
  });
  lb.getRow(3).height = 30;
  lb.getCell("J2").value = { formula: `MAX(${HS}C3:${LC}3)` }; lb.getCell("J2").numFmt = "d\\ mmm\\ yy";
  H.list.forEach((e, i) => {
    const n = 4 + i, r = hrow(i), P = `${HS}C${r}:${LC}${r}`, G = `${HS}C${r + 1}:${LC}${r + 1}`;
    const rk = lb.getCell(n, 1); rk.value = i + 1;
    const look = e.here && rankLook[i + 1];
    rk.font = { bold: true, color: { argb: look ? look[1] : GREY } };
    if (look) rk.fill = fill(look[0]);
    lb.getCell(n, 2).value = e.name;
    lb.getCell(n, 3).value = { formula: `IFERROR(LOOKUP(2,1/(${P}<>""),${P}),"")` };
    lb.getCell(n, 4).value = { formula: `IF(OR(C${n}="",I${n}=""),"",C${n}-I${n})` };
    lb.getCell(n, 5).value = { formula: `IF(COUNT(${G})=0,"",MAX(${G}))` };
    lb.getCell(n, 6).value = { formula: `IF(COUNT(${G})=0,"",INDEX(${HS}$C$3:$${LC}$3,MATCH(MAX(${G}),${G},0)))` };
    lb.getCell(n, 7).value = { formula: `IFERROR(IF(OR(C${n}="",I${n}=""),"",(C${n}-I${n})/(J${n}-H${n})),"")` };
    // Answers are also saved in the file so phone previews show them without recalculating.
    const gs = e.vals.map((v, k) => (k > 0 && v !== null && e.vals[k - 1] !== null ? v - e.vals[k - 1] : null)), best = gs.reduce((m, g) => (g !== null && (m === null || g > m) ? g : m), null), days = (H.dates[e.li] - e.since) / 864e5;
    [e.last, e.gained, best === null ? "" : best, best === null ? "" : new Date(H.dates[gs.indexOf(best)]), days > 0 ? e.gained / days : ""].forEach((v, k) => { lb.getCell(n, 3 + k).value = Object.assign(lb.getCell(n, 3 + k).value, { result: v }); });
    lb.getCell(n, 8).value = new Date(e.since);
    lb.getCell(n, 9).value = e.first;
    lb.getCell(n, 10).value = new Date(H.dates[e.li]);
    lb.getCell(n, 3).numFmt = "#,##0"; lb.getCell(n, 4).numFmt = "\\+#,##0;\\-#,##0;0"; lb.getCell(n, 5).numFmt = "\\+#,##0;\\-#,##0;0";
    lb.getCell(n, 6).numFmt = "d\\ mmm\\ yy"; lb.getCell(n, 7).numFmt = "#,##0"; lb.getCell(n, 8).numFmt = "d\\ mmm\\ yy"; lb.getCell(n, 9).numFmt = "#,##0"; lb.getCell(n, 10).numFmt = "d\\ mmm\\ yy";
    lb.getRow(n).height = 19.5;
    for (let c = 1; c <= 8; c++) {
      const cell = lb.getCell(n, c);
      cell.border = box;
      cell.alignment = { horizontal: c === 2 ? "left" : c === 1 ? "center" : "right", vertical: "middle", indent: c === 2 ? 1 : 0 };
      if (c > 1) cell.font = { bold: c === 3 || c === 4, italic: !e.here, color: { argb: e.here ? INK : "FF9A9A9A" } };
      if (i % 2 && c > 1) cell.fill = fill(SOFT);
      if (c === 2 && look) { cell.fill = fill(look[0]); cell.font = { bold: true, color: { argb: look[1] } }; }
    }
  });
  const lastL = 3 + H.list.length;
  lb.autoFilter = `A3:H${lastL}`;
  lb.addConditionalFormatting({ ref: `D4:E${lastL}`, rules: [
    { type: "expression", priority: 9, formulae: ["AND(ISNUMBER(D4),D4>0)"], style: up },
    { type: "expression", priority: 10, formulae: ["AND(ISNUMBER(D4),D4<0)"], style: down }
  ] });

  // Shared look for the two text tabs: title, soft intro strip, navy header, boxed rows, shaded alternate rows
  const textSheet = (sh, title, intro, heads, widths) => {
    widths.forEach((w, i) => { sh.getColumn(i + 1).width = w; });
    sh.mergeCells(1, 1, 1, heads.length); sh.mergeCells(2, 1, 2, heads.length);
    sh.getCell("A1").value = title; sh.getCell("A1").font = { bold: true, size: 16, color: { argb: NAVY } };
    sh.getCell("A1").alignment = { vertical: "middle" }; sh.getRow(1).height = 30;
    sh.getCell("A2").value = intro; sh.getCell("A2").font = { size: 10, color: { argb: INK } };
    sh.getCell("A2").fill = fill("FFF5F7FA"); sh.getCell("A2").alignment = { wrapText: true, vertical: "middle", indent: 1 }; sh.getRow(2).height = 34;
    heads.forEach((t, i) => {
      const c = sh.getCell(4, i + 1); c.value = t; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = fill(NAVY);
      c.alignment = { vertical: "middle", indent: 1 }; c.border = { left: LINE, right: LINE, top: LINE, bottom: { style: "medium", color: { argb: NAVY } } };
    });
    sh.getRow(4).height = 24;
  };
  const textRow = (sh, n, cells, ncols, widths, i) => {
    let lines = 1;
    for (let c = 1; c <= ncols; c++) {
      const cell = sh.getCell(n, c);
      cell.border = box; cell.alignment = { wrapText: true, vertical: "middle", indent: 1 };
      if (i % 2) cell.fill = fill("FFF5F7FA");
      if (c === 1) cell.font = { bold: true, color: { argb: NAVY } }; else if (!cell.font || !cell.font.color) cell.font = { color: { argb: INK } };
      const len = typeof cells[c - 1] === "string" ? cells[c - 1].length : 60;
      lines = Math.max(lines, Math.ceil(len / (widths[c - 1] * 1.05)));
    }
    sh.getRow(n).height = Math.max(21, 15 * lines + 6);
  };
  const ab = wb.addWorksheet("About this sheet");
  const abw = [26, 92];
  textSheet(ab, "About this sheet", "Made with Fishing Cat Data. What is in this file and what the colours mean.", ["Tab", "What it is"], abw);
  [
    ["Clan Members", "This run's list. Fix a misread number in Points (number) and the rest updates."],
    ["Leaderboard", "Who gained the most since their first run."],
    ["Points history", "Every run side by side, with a clan total."],
    ["Trend", "\u25b2 up, \u25bc down, \u2013 same, new = not in the earlier sheet."],
    ["More detail", "See the How it's worked out tab."]
  ].forEach((r, i) => {
    ab.getCell(5 + i, 1).value = r[0]; ab.getCell(5 + i, 2).value = r[1];
    textRow(ab, 5 + i, r, 2, abw, i);
  });
  const ck = 11;
  ab.mergeCells(ck, 1, ck, 2);
  ab.getCell(ck, 1).value = "COLOURS"; ab.getCell(ck, 1).font = { bold: true, color: { argb: "FFFFFFFF" } }; ab.getCell(ck, 1).fill = fill(NAVY);
  ab.getCell(ck, 1).alignment = { vertical: "middle", indent: 1 }; ab.getRow(ck).height = 24;
  [
    ["Green", "Went up.", "FFC6EFCE", "FF006100"],
    ["Red", "Went down.", "FFFFC7CE", "FF9C0006"],
    ["Gold", "Rank 1.", "FFFFF2CC", "FF7F6000"],
    ["Silver", "Rank 2.", "FFEDEDED", "FF404040"],
    ["Bronze", "Rank 3.", "FFFBE5D6", "FF843C0C"],
    ["Grey", "Left the clan. Kept so the history stays.", "FFFFFFFF", "FF9A9A9A"]
  ].forEach((r, i) => {
    const n = ck + 1 + i;
    ab.getCell(n, 1).value = r[0]; ab.getCell(n, 2).value = r[1];
    ab.getCell(n, 1).fill = fill(r[2]); ab.getCell(n, 1).font = { bold: true, italic: r[0] === "Grey", color: { argb: r[3] } };
    ab.getCell(n, 2).font = { color: { argb: INK } };
    [1, 2].forEach((c) => { ab.getCell(n, c).border = box; ab.getCell(n, c).alignment = { vertical: "middle", indent: 1 }; });
    ab.getRow(n).height = 21;
  });
  const hw = wb.addWorksheet("How it's worked out");
  const hww = [22, 62, 62];
  textSheet(hw, "How it's worked out", "Plain words for each number. The examples use the top player on the Leaderboard and update with the sheet.", ["Column", "What it means", "Example"], hww);
  const nm = "Leaderboard!B4", fm = (a) => `TEXT(${a},"#,##0")`;
  [
    ["Change", "Points now minus points in the run before (Clan Members tab).", `IFERROR(${nm}&": "&${fm("'Clan Members'!E4")}&" now - "&${fm("'Clan Members'!F4")}&" before = "&${fm("'Clan Members'!G4")},"Needs an earlier sheet")`],
    ["% Change", "Change divided by the points in the run before.", `IFERROR(${nm}&": "&${fm("'Clan Members'!G4")}&" / "&${fm("'Clan Members'!F4")}&" = "&TEXT('Clan Members'!H4,"0.0%"),"Needs an earlier sheet")`],
    ["Gained (all time)", "Points now minus the points the player had in their first run. Players who left show their last known points.", `IFERROR(${nm}&": "&${fm("Leaderboard!C4")}&" now - "&${fm("Leaderboard!I4")}&" at the start = "&${fm("Leaderboard!D4")},"")`],
    ["Best run", "The biggest gain between two runs in a row.", `IFERROR(${nm}&": best was "&${fm("Leaderboard!E4")}&" on "&TEXT(Leaderboard!F4,"d mmm yy"),"Needs two runs")`],
    ["Avg / day", "Gained divided by the days between their first and last run.", `IFERROR(${nm}&": "&${fm("Leaderboard!D4")}&" over "&(Leaderboard!J4-Leaderboard!H4)&" days = "&${fm("Leaderboard!G4")}&" a day","Needs two runs on different days")`],
    ["Clan total", "All members' points added up for each run (Points history tab). The line under it is the clan's gain.", `"Latest run: "&${fm(`${HS}${LC}${tr}`)}`],
    ["Colours", "Green = went up. Red = went down. Grey name = left the clan (kept so the history stays).", `"Top 3 on the Leaderboard are shaded gold, silver and bronze."`]
  ].forEach((r, i) => {
    const n = 5 + i;
    hw.getCell(n, 1).value = r[0]; hw.getCell(n, 2).value = r[1]; hw.getCell(n, 3).value = { formula: r[2] };
    textRow(hw, n, [r[0], r[1], "x".repeat(70)], 3, hww, i);
  });
  return wb;
}

let prevMap = null, prevName = "";
function showPrev() {
  const box = $("previnfo");
  if (!prevMap) { box.className = ""; box.replaceChildren(); $("prevdrop").textContent = "Tap to choose an earlier sheet (.xlsx) to compare"; return; }
  box.className = "ok";
  const span = document.createElement("span");
  span.textContent = "\u2713 Last sheet ready: " + prevName + " \u00b7 " + prevMap.size + " members";
  const b = document.createElement("button");
  b.className = "tab"; b.textContent = "Remove";
  b.onclick = () => { prevMap = null; prevName = ""; try { localStorage.removeItem("fcd_prev"); } catch (e) {} showPrev(); };
  box.replaceChildren(span, b);
  $("prevdrop").textContent = "Tap to choose a different sheet";
}
$("prevdrop").onclick = () => $("prevfile").click();
for (const id of ["drop", "prevdrop", "billdrop"]) {
  const el = $(id);
  el.setAttribute("role", "button"); el.tabIndex = 0;
  el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); } };
}
$("prevfile").onchange = async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    await loadExcel();
    if (!window.ExcelJS) throw new Error("The spreadsheet part did not load. Refresh the page.");
    prevMap = await readPrevious(window.ExcelJS, await f.arrayBuffer());
    prevName = f.name; pendingPrev = null;
    if (lsGet("fcd_keepprev") !== "0") try { lsSet("fcd_prev", JSON.stringify({ name: prevName, entries: [...prevMap], hist: prevMap.hist })); } catch (e) {}
    showPrev();
    clog("Last sheet read: " + prevMap.size + " members.");
  } catch (err) {
    prevMap = null;
    showPrev();
    clog("Last sheet failed: " + err.message);
    setMsg(err instanceof Error && /made by this page|did not load/.test(err.message) ? err.message : "That file could not be read. Choose a sheet made by this page (.xlsx).", true);
  }
};
// A sheet you just made becomes the last sheet for the next run (saved now, used from the next list on, so this list's changes stay right).
let pendingPrev = null;
async function keepMade(buf, name) {
  try { await loadExcel(); const m = await readPrevious(window.ExcelJS, buf); pendingPrev = { m, name };
    if (lsGet("fcd_keepprev") !== "0") lsSet("fcd_prev", JSON.stringify({ name, entries: [...m], hist: m.hist }));
    clog("Kept this sheet as your last sheet for next time (" + m.size + " members)."); } catch (e) { clog("Could not keep this sheet as the last one: " + (e && e.message)); }
}
function adoptPending() { if (!pendingPrev) return; prevMap = pendingPrev.m; prevName = pendingPrev.name; pendingPrev = null; showPrev(); }
// Remember the last sheet on this device (names and points only), so it does not need picking again.
try {
  const d = JSON.parse(localStorage.getItem("fcd_prev"));
  if (d && Array.isArray(d.entries) && d.entries.every(e => typeof e[0] === "string" && typeof e[1] === "number")) {
    prevMap = new Map(d.entries); prevMap.hist = okHist(d.hist) ? d.hist : null; prevMap = dayBase(prevMap); prevName = String(d.name || "last sheet");
  }
} catch (e) {}
showPrev();

// Saved history must have the right shape; a damaged copy is dropped, not used.
function okHist(h) {
  const num = (v) => typeof v === "number" && isFinite(v);
  return !!h && Array.isArray(h.dates) && h.dates.every(num) && Array.isArray(h.players) && h.players.every(p => Array.isArray(p) && typeof p[0] === "string" && p[1] && typeof p[1] === "object" && Array.isArray(p[1].vals) && p[1].vals.every(v => v === null || num(v)) && (p[1].start === undefined || (Array.isArray(p[1].start) && p[1].start.every(num))));
}
function toCsv(rows) {
  // A leading ' stops Excel treating a name like =SUM(...) as a formula.
  const esc = (v) => typeof v === "number" ? String(v) : '"' + String(v ?? "").replace(/^([=+\-@\t\r])/, "'$1").replace(/"/g, '""') + '"';
  const lines = ["Rank,Name,Role,Points"];
  rows.forEach(r => lines.push([r.rank, r.name, r.role, r.points].map(esc).join(",")));
  return lines.join("\n");
}

// Make one picture ready to send: at most 2000 px on the long side, saved as JPEG (much smaller than a PNG screenshot).
async function toPic(f) {
  try {
    const t0 = performance.now(), bmp = await createImageBitmap(f), bw = bmp.width, bh = bmp.height;
    const sc = Math.min(1, 2000 / Math.max(bmp.width, bmp.height)), c = document.createElement("canvas");
    c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc);
    const x = c.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
    x.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    const out = c.toDataURL("image/jpeg", 0.9).split(",")[1];
    try { clog("Photo: " + f.type + " " + Math.round(f.size / 1024) + " KB, " + bw + "x" + bh + " -> " + c.width + "x" + c.height + " JPEG " + Math.round(out.length * 0.75 / 1024) + " KB, " + Math.round(performance.now() - t0) + " ms"); } catch (e) {}
    return { type: "image/jpeg", data: out };
  } catch (e) { throw new Error('The picture "' + tidy(f.name, 40) + '" could not be opened. Tap Clear and add the others again.'); }
}
// A PDF is sent as it is (Gemini and Anthropic read PDFs themselves).
function pdfPart(f) {
  return new Promise((ok, bad) => {
    const r = new FileReader();
    r.onload = () => ok({ type: "application/pdf", data: String(r.result).split(",")[1] });
    r.onerror = () => bad(new Error('The PDF "' + tidy(f.name, 40) + '" could not be opened. Tap Clear and add the others again.'));
    r.readAsDataURL(f);
  });
}
// Pictures made from each file are kept, so a file is only read once per run.
const picCache = new WeakMap();
// Developer mode: add ?dev to the address. Shows each still sent to the AI and the AI's raw reply.
const DEV = new URLSearchParams(location.search).has("dev");
function devPics(pics) {
  if (!DEV) return;
  let d = document.getElementById("devpics");
  if (!d) { d = document.createElement("details"); d.id = "devpics"; d.open = true; document.getElementById("logbox").after(d); }
  d.replaceChildren(Object.assign(document.createElement("summary"), { textContent: "Developer: " + pics.length + " stills sent" }));
  const cb = Object.assign(document.createElement("button"), { type: "button", textContent: "Copy bug report" });
  cb.onclick = () => bugCopy(cb, "Copy bug report"); d.appendChild(cb);
  pics.forEach((x, i) => { if (!x.type.startsWith("image/")) return; const im = new Image(); im.src = "data:" + x.type + ";base64," + x.data; im.alt = "Still " + (i + 1); im.className = "devpic"; d.appendChild(im); });
}
// Developer mode: a line at the top with this page's version, the live version, and a countdown to the next check (every 30 s, own site only).
if (DEV && location.protocol.startsWith("http")) {
  const bar = document.createElement("div"); bar.id = "devbar"; document.body.prepend(bar);
  const t0 = Date.now(); let fold = lsGet("fcd_devfold") === "1", next = 0, live = "?", lastAt = 0, ms = 0, fails = 0, checks = 0;
  const el = (t, c, tag) => Object.assign(document.createElement(tag || "span"), { textContent: t, className: c || "" });
  const ago = (s) => s < 60 ? s + " s ago" : s < 3600 ? Math.floor(s / 60) + " min ago" : Math.floor(s / 3600) + " h ago";
  const cell = (k, v) => { const d = el("", "dvc", "div"); d.append(el(k, "dvk"), el(v, "dvv")); return d; };
  const show = () => {
    const stale = live !== "?" && live !== BUILD, ok = live === BUILD;
    bar.className = (stale ? "dvnew" : ok ? "dvok" : "") + (fold ? " dvfold" : "");
    const head = el("", "dvh", "div"); head.tabIndex = 0; head.setAttribute("role", "button"); head.setAttribute("aria-expanded", fold ? "false" : "true"); const flip = () => { fold = !fold; lsSet("fcd_devfold", fold ? "1" : "0"); show(); }; head.onclick = flip; head.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } };
    head.append(el("", "dvdot"), el(stale ? "New version ready" : ok ? "Up to date" : fails ? "Can't check right now" : "Checking\u2026", "dvs"), el("Developer " + BUILD, "dvm"));
    const kids = [head];
    if (stale) { const r = el("Refresh now", "", "button"); r.type = "button"; r.onclick = () => location.reload(); kids.push(el("This page " + BUILD + ", live " + live + ".", "dvm dvp"), r); }
    else {
      const sec = (s) => s < 60 ? s + " s" : Math.floor(s / 60) + " min";
      kids.push(el("Live " + (live === "?" ? "not recorded" : live) + "  \u00b7  Checked " + (lastAt ? sec(Math.round((Date.now() - lastAt) / 1000)) + " ago" : "not yet") + "  \u00b7  " + (ms ? ms + " ms" : "not recorded") + "  \u00b7  Open " + sec(Math.round((Date.now() - t0) / 1000)) + "  \u00b7  Next check " + next + " s", "dvp"));
    }
    bar.replaceChildren(...kids);
  };
  const look = async () => { const t = Date.now(); try { const r = await fetch("version.txt?t=" + t, { cache: "no-store", signal: AbortSignal.timeout(15000) }); const v = (await r.text()).trim(); if (r.ok && /^[\w.-]{1,40}$/.test(v)) { live = v; fails = 0; ms = Date.now() - t; lastAt = Date.now(); } else fails++; } catch (e) { fails++; } checks++; next = 30; show(); };
  setInterval(() => { if (--next <= 0) look(); else show(); }, 1000); look();
}
const devReply = (text) => { if (DEV) clog("Developer, raw AI reply:\n" + String(text).slice(0, 20000), true); };
async function collectPictures(images) {
  const pics = [];
  for (const f of images) {
    if (!picCache.has(f)) picCache.set(f, f.type.startsWith("video/") ? await videoFrames(f) : f.type === "application/pdf" ? [await pdfPart(f)] : [await toPic(f)]);
    pics.push(...picCache.get(f));
  }
  if (pics.length > 100) throw new Error("Too many pictures (" + pics.length + "). The most is 100. Use one video, or fewer screenshots.");
  try { const by = {}; pics.forEach((x) => { by[x.type] = by[x.type] || [0, 0]; by[x.type][0]++; by[x.type][1] += Math.round(x.data.length * 0.75 / 1024); }); clog("Ready to send: " + Object.keys(by).map((k) => by[k][0] + " x " + k + " (" + by[k][1] + " KB)").join(", ")); } catch (e) {}
  if (pics.reduce((t, x) => t + x.data.length, 0) > 18e6) throw new Error("These pictures are too big to send in one go. Use fewer pictures or a shorter video.");
  devPics(pics);
  return pics;
}

let aiWait = 180000, QUICK = false; // QUICK: the small first step asks Gemini for light thinking
const hdrs = (res) => { const o = []; try { res.headers.forEach((v, k) => { if (/^(content-length|content-encoding|retry-after|server-timing|x-envoy-upstream-service-time|request-id|x-request-id|x-ratelimit|anthropic-ratelimit)/i.test(k)) o.push(k + "=" + v); }); } catch (e) {} return o.length ? " [" + o.join(", ") + "]" : ""; };
function aiStats(d, secs) {
  const u = d.usageMetadata || d.usage || {}, nums = Object.keys(u).filter((k) => typeof u[k] === "number").map((k) => k + "=" + u[k]).join(" ");
  const c0 = (d.candidates || [])[0] || {}, ch0 = (d.choices || [])[0] || {};
  const out = (u.candidatesTokenCount || u.output_tokens || u.completion_tokens || 0) + (u.thoughtsTokenCount || 0);
  clog("AI says: model " + (d.modelVersion || d.model || "?") + ", finished: " + (c0.finishReason || d.stop_reason || ch0.finish_reason || "?") + ", tokens: " + (nums || "not reported") + (out ? ", about " + (out / Math.max(secs, 0.1)).toFixed(0) + " tokens a second" : "") + (d.promptFeedback && d.promptFeedback.blockReason ? ", BLOCKED: " + d.promptFeedback.blockReason : ""));
}
const GALT = ["gemini-3.7-flash", "gemini-3.5-flash-lite"]; const galt = (i) => (!QUICK && GALT[i] === GALT[1] ? undefined : GALT[i]); // the weakest model may only do the quick layout step
let gemSkip = 0, gemAt = 0; // backup model that last answered, remembered for 10 minutes
async function postJson(url, headers, body) {
  const payload = JSON.stringify(body), nap = (ms) => new Promise((r) => setTimeout(r, ms)), baseUrl = url;
  const off = Date.now() - gemAt < 6e5 && /generativelanguage/.test(url) && url.includes("/" + PROVIDERS.gemini.model + ":") ? (QUICK ? gemSkip : Math.min(gemSkip, 1)) : 0;
  if (off) { url = baseUrl.replace(PROVIDERS.gemini.model, GALT[off - 1]); clog("Starting on " + GALT[off - 1] + " because " + PROVIDERS.gemini.model + " was busy a minute ago."); }
  for (let attempt = 1; ; attempt++) { // up to 3 tries when the AI is busy or the connection drops
  let res;
  const t0 = Date.now(), sec = () => ((Date.now() - t0) / 1000).toFixed(1) + "s";
  const gAlt = galt(attempt - 1 + off), gSwap = !!gAlt && /generativelanguage/.test(baseUrl) && baseUrl.includes("/" + PROVIDERS.gemini.model + ":") && attempt < 3;
  clog("Request: POST " + url.replace(/^https:\/\//, "").replace(/\?.*$/, "") + ", " + Math.round(payload.length / 1024) + " KB" + (body.generationConfig ? ", settings " + JSON.stringify(body.generationConfig) : "") + (body.max_tokens ? ", max_tokens " + body.max_tokens : "") + ", online " + navigator.onLine + ", gives up after " + Math.round(aiWait / 1000) + "s");
  const beat = setInterval(() => clog("Still waiting for the AI (" + sec() + ")"), 10000);
  try { res = await fetch(url, { method: "POST", headers, body: payload, signal: AbortSignal.timeout(gSwap ? Math.min(aiWait, 75000) : aiWait) }); clearInterval(beat); clog("AI answered after " + sec() + ": HTTP " + res.status + " " + res.statusText + hdrs(res)); }
  catch (e) { clearInterval(beat); clog("Request failed after " + sec() + ": " + (e && e.name) + ": " + (e && e.message) + ", online " + navigator.onLine);
    if (e && e.name === "TimeoutError" && gSwap) { clog("Too slow. Switching to " + gAlt + " for the next try (try " + (attempt + 1) + " of 3)."); url = baseUrl.replace(PROVIDERS.gemini.model, gAlt); continue; }
    if (!(e && e.name === "TimeoutError") && attempt < 3) { clog("Trying again in " + attempt * 3 + "s (try " + (attempt + 1) + " of 3)."); await nap(attempt * 3000); continue; }
    throw new Error(e && e.name === "TimeoutError" ? "The AI took too long to answer. Try again, or use fewer pictures." : "Couldn't reach the AI. Check your internet and try again."); }
  if (!res.ok) {
    let raw = "", detail = "";
    try { raw = await res.text(); } catch (e) {}
    try { detail = JSON.parse(raw).error.message || ""; } catch (e) {}
    clog("AI error " + res.status + ": " + detail + "\nFull error reply: " + raw.slice(0, 1500));
    const daily = res.status === 429 && /PerDay|per day/i.test(raw), alt = galt(attempt - 1 + off);
    const canSwap = !!alt && /generativelanguage/.test(baseUrl) && baseUrl.includes("/" + PROVIDERS.gemini.model + ":");
    if (([500, 502, 503, 504].includes(res.status) || (daily && canSwap) || (res.status === 404 && url !== baseUrl)) && attempt < 3) {
      clog((daily ? "Today's free limit for this model is used up (HTTP 429)." : "The AI is busy or the backup model is gone (HTTP " + res.status + ").") + " Trying again" + (daily ? "" : " in " + attempt * 4 + "s") + " (try " + (attempt + 1) + " of 3).");
      if (canSwap) { url = baseUrl.replace(PROVIDERS.gemini.model, alt); clog("Switching to " + alt + " for the next try."); }
      await nap(daily ? 500 : attempt * 4000); continue; }
    if (daily) { const w = (raw.match(/retry in ([0-9hms]+)/i) || [])[1]; throw new Error("Google's free plan limit for today is used up (about 20 reads a day for each model)." + (w ? " It resets in about " + w + "." : "") + " Try again later, use a different model in Settings, or use a paid key."); }
    if (/credit|quota|billing/i.test(detail)) throw new Error("Your AI account is out of credit or over its limit.");
    if (res.status === 401 || res.status === 403 || /api key/i.test(detail)) throw new Error("The AI doesn't accept that key. Check it and paste it again.");
    if (res.status === 429) throw new Error("Too many requests right now. Wait a minute and try again.");
    if (res.status === 404) throw new Error("The AI model is gone or not open to your key. Change it in Settings under AI model (advanced).");
    if (res.status >= 500) throw new Error("The AI is busy or down. Try again in a few minutes.");
    if (res.status === 400 || res.status === 413) throw new Error("The AI turned the pictures down (" + res.status + "). They may be too big or too many. Try fewer pictures.");
    throw new Error("The AI said no (" + res.status + "). Check the key.");
  }
  let d = null;
  try { d = await res.json(); } catch (e) { clog("Reply was not readable JSON: " + (e && e.message)); }
  if (!d || typeof d !== "object") throw new Error("The AI sent back something unreadable. Try again.");
  clog("AI reply fully read after " + sec() + ".");
  if (/generativelanguage/.test(url)) { if (url === baseUrl) gemAt = 0; else { gemSkip = GALT.findIndex((m) => url.includes("/" + m + ":")) + 1; gemAt = Date.now(); } }
  try { aiStats(d, (Date.now() - t0) / 1000); } catch (e) {}
  return d;
  }
}

const ASKERS = {
  anthropic: async (key, model, pics) => {
    const content = pics.map(p => ({ type: p.type === "application/pdf" ? "document" : "image", source: { type: "base64", media_type: p.type, data: p.data } }));
    content.push({ type: "text", text: PROMPT });
    const d = await postJson("https://api.anthropic.com/v1/messages", {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    }, { model, max_tokens: 8000, messages: [{ role: "user", content }] });
    return (d.content || []).filter(b => b && b.type === "text").map(b => b.text).join("\n");
  },
  gemini: async (key, model, pics) => {
    const parts = pics.map(p => ({ inline_data: { mime_type: p.type, data: p.data } }));
    parts.push({ text: PROMPT });
    const d = await postJson("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent",
      { "content-type": "application/json", "x-goog-api-key": key }, { contents: [{ parts }], generationConfig: PROMPT === BILL_PROMPT ? { thinkingConfig: { thinkingLevel: "low" }, maxOutputTokens: 8192, responseMimeType: "application/json" } : { thinkingConfig: { thinkingLevel: "low" } } });
    const first = (d.candidates || [])[0];
    return ((first && first.content && first.content.parts) || []).map(p => p.text || "").join("\n");
  },
  openai: async (key, model, pics) => {
    if (pics.some(p => p.type === "application/pdf")) throw new Error("OpenAI can't read PDFs here. Use photos, or pick Google Gemini or Anthropic.");
    const content = pics.map(p => ({ type: "image_url", image_url: { url: "data:" + p.type + ";base64," + p.data } }));
    content.push({ type: "text", text: PROMPT });
    const d = await postJson("https://api.openai.com/v1/chat/completions",
      { "content-type": "application/json", authorization: "Bearer " + key }, { model, messages: [{ role: "user", content }] });
    const c = d.choices && d.choices[0] && d.choices[0].message;
    return (c && c.content) || "";
  }
};

async function readScreenshots(key, images) {
  const id = provider(), model = modelFor(id);
  clog("Using " + PROVIDERS[id].name + " (" + model + ").");
  const text = await ASKERS[id](key, model, await collectPictures(images));
  devReply(text);
  return text;
}

// The AI reads the game, clan and layout from your first picture.
const nameOf = (p) => { const d = new Date(); return p.clan + " - " + d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " " + (d.getHours() % 12 || 12) + "." + String(d.getMinutes()).padStart(2, "0") + (d.getHours() < 12 ? "am" : "pm"); };
const clean = (t, n) => (typeof t === "string" ? t : "").replace(/[\r\n"\\<>\/:*?|]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
const SETUP_PROMPT = `These images show the member list of a Roblox game clan screen.
Work out how the list is laid out. Do not copy the whole list. If several images are given, use the one that shows the member list best.
Answer with ONLY one JSON object, no other text:
{"clan_name": "name of the clan if it is clearly visible, otherwise empty", "game_name": "name of the Roblox game, read from the screen or recognised from how the screen looks, otherwise empty", "ranks_shown": true or false (is a rank number like #1 shown beside each member?), "extra_column": "the heading or label of any column besides rank, username, role and points, otherwise empty"}
Never guess the clan name or layout; use empty text if unsure.`;
function checkKey(key) { if (/[^\x21-\x7e]/.test(key)) throw new Error("That key has odd characters or spaces in it. Copy it again and paste it."); }
const todayText = () => new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).replace(/,/g, "");
function saveBlob(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click(); }
async function pickProfile(key) {
  checkKey(key);
  PROMPT = SETUP_PROMPT;
  const L = images.length, pick = [...new Set([images[0], images[L >> 1], images[L - 1]])];
  const all = await collectPictures(pick), pics = [...new Set([all[0], all[all.length >> 1], all[all.length - 1]])];
  // This step only finds the game and layout: 20 seconds at most, then carry on with the usual layout.
  let text = ""; const wait = aiWait; aiWait = Math.min(aiWait, 20000); QUICK = true;
  try { text = await ASKERS[provider()](key, modelFor(provider()), pics); }
  catch (e) { if (!/took too long|turned the pictures down/.test(e.message)) throw e; clog("Game not worked out in time. Carrying on with the usual layout."); }
  finally { aiWait = wait; QUICK = false; }
  let r = {};
  try { r = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) || {}; } catch (e) { clog("Layout not read; using the usual layout."); }
  const p = { clan: clean($("clanbox").value, 40) || clean(r.clan_name, 40) || "Clan", game: clean(r.game_name, 40) || lsGet("fcd_game") || "Game", ranks: r.ranks_shown !== false && r.ranks_shown !== "false", extra: clean(r.extra_column, 30) };
  if (clean(r.game_name, 40)) lsSet("fcd_game", p.game);
  clog("Auto layout: " + nameOf(p) + ", ranks " + (p.ranks ? "shown" : "not shown") + ", extra column " + (p.extra || "none") + ".");
  return p;
}

$("testgo").onclick = async () => {
  const key = $("key").value.trim();
  running = true; refresh();
  setMsg("Test read: looking at the first file... about 20 seconds.");
  try {
    const p = await pickProfile(key);
    PROMPT = buildPrompt(p);
    const pics = await collectPictures([images[0]]); // a video: all its stills, or the scrolled rows are lost
    const text = await ASKERS[provider()](key, modelFor(provider()), pics);
    devReply(text);
    const rows = parseRows(text);
    if (!rows.length) throw new Error("Test read: no member rows found. The picture may not show the member list.");
    const bad = rows.filter(r => r.name === "?" || parsePoints(r.points) === null).length;
    if (p.ranks === false) rows.forEach((r, i) => { r.rank = i + 1; });
    const shown = (text.match(/"members_on_screen"\s*:\s*(\d+)/) || [])[1];
    adoptPending(); pv = { rows: rows.map(r => ({ ...r })), orig: rows.map(r => ({ ...r })), p, shown };
    pvDraw();
    setMsg("Test OK: " + rows.length + " rows from the first file. Nothing was downloaded.");
  } catch (err) { clog("Test stopped: " + err.message); setMsg(plain(err), true); }
  finally { running = false; refresh(); }
};

// Excel-looking grid used by both previews (all text goes in with textContent or input values)
function xlTable(o) {
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };
  const L = (i) => String.fromCharCode(65 + i);
  const frame = el("div", "xl"), bar = el("div", "xlbar");
  bar.appendChild(el("b", "", o.file)); bar.appendChild(el("span", "", "Preview")); frame.appendChild(bar);
  const fx = el("div", "xlfx"), nm = el("span", "xlnm", "A1"), fv = el("span", "xlfv", "");
  fx.appendChild(nm); fx.appendChild(el("i", "", "fx")); fx.appendChild(fv); frame.appendChild(fx);
  const wrap = el("div", "xlg"), tb = el("table"), hl = el("tr");
  hl.appendChild(el("th", "xlc", ""));
  o.header.forEach((h, i) => hl.appendChild(el("th", "xlc", L(i))));
  hl.appendChild(el("th", "xlc", "")); tb.appendChild(hl);
  let rn = 1;
  o.titles.forEach((t, k) => { const tr = el("tr"); tr.appendChild(el("td", "xlr", String(rn++))); const td = el("td", k === 0 ? "xlt1" : "xlt2", t); td.colSpan = o.header.length + 1; tr.appendChild(td); tb.appendChild(tr); });
  const hr = el("tr"); hr.appendChild(el("td", "xlr", String(rn++)));
  o.header.forEach(h => hr.appendChild(el("td", "xlh", h))); hr.appendChild(el("td", "xlh", "")); tb.appendChild(hr);
  o.rows.forEach((r) => {
    const tr = el("tr", r.bad ? "bad" : ""), row = rn++;
    tr.appendChild(el("td", "xlr", String(row)));
    r.cells.forEach((c, i) => {
      const td = el("td", c.cls || "");
      if (c.edit) {
        const inp = el("input");
        inp.value = c.edit.value; inp.style.minWidth = c.edit.w; inp.setAttribute("aria-label", c.edit.label);
        const show = () => { nm.textContent = L(i) + row; fv.textContent = inp.value; };
        inp.onfocus = () => { td.classList.add("sel"); show(); };
        inp.onblur = () => td.classList.remove("sel");
        inp.oninput = () => { c.edit.input(inp.value); show(); };
        inp.onchange = () => o.redraw();
        td.appendChild(inp);
      } else td.textContent = c.t;
      tr.appendChild(td);
    });
    const x = el("td", "xlx"), b = el("button", "pvx", "×");
    b.type = "button"; b.setAttribute("aria-label", r.delLabel); b.onclick = r.del; x.appendChild(b); tr.appendChild(x); tb.appendChild(tr);
  });
  wrap.appendChild(tb); frame.appendChild(wrap);
  const tabs = el("div", "xltabs"); o.tabs.forEach((t, i) => tabs.appendChild(el("div", i === 0 ? "on" : "", t))); frame.appendChild(tabs);
  return frame;
}
// ---- Preview: check and fix the list before the sheet is made ----
let pv = null;
const pvBad = (r) => r.unsure || /\?/.test(String(r.name)) || !String(r.name).trim() || parsePoints(r.points) === null;
// Player text goes to Discord as plain words: no fake links, no broken code blocks
const dcMd = (v) => String(v ?? "").replace(/[\r\n]+/g, " ").replace(/`/g, "'").replace(/[\\*_~|>#\[\]()<:@-]/g, "\\$&");
const dcCode = (v) => String(v ?? "").replace(/[\r\n]+/g, " ").replace(/`/g, "'");
const dcHead = (clan, game, date, n, tot) => "## " + dcMd(clan) + " \u00b7 " + dcMd(game) + "\n-# " + date + "\n**" + n + "** members \u00b7 **" + tot + "** points";
const dcBreakdown = (sh, f) => {
  const it = sh.items, n = it.length, tot = it.reduce((a, x) => a + x.n, 0), sg = (d) => (d >= 0 ? "+" : "-") + f(Math.abs(d)), pc = (d, b) => (b ? " (" + (d > 0 ? "+" : "") + (d / b * 100).toFixed(1) + "%)" : "");
  const dt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  const blk = (sign, lines, total) => "\n```diff\n" + lines.map((l) => sign + " " + dcCode(l)).join("\n") + (total > lines.length ? "\n  and " + (total - lines.length) + " more (see the file)" : "") + "\n```";
  let t = "## " + dcMd(sh.clan) + " \u00b7 " + dcMd(sh.game) + "\n-# " + dcMd(sh.date) + " \u00b7 " + n + " members \u00b7 " + f(tot) + " points";
  const roles = {}; it.forEach((x) => { const k = x.role || "No role"; roles[k] = (roles[k] || 0) + 1; });
  t += "\n### Clan Members\n- " + Object.entries(roles).sort((x, y) => y[1] - x[1]).map(([k, c]) => c + " " + dcMd(k) + (c > 1 ? (/(s|x|ch|sh)$/i.test(k) ? "es" : "s") : "")).join(", ") + "\n- About " + f(tot / Math.max(n, 1)) + " points each";
  if (sh.any) {
    const ret = it.filter((x) => x.b !== null), fresh = it.filter((x) => x.b === null), d = ret.reduce((a, x) => a + x.n - x.b, 0), b0 = ret.reduce((a, x) => a + x.b, 0);
    const up = ret.filter((x) => x.n > x.b).sort((x, y) => (y.n - y.b) - (x.n - x.b)), dn = ret.filter((x) => x.n < x.b).sort((x, y) => (x.n - x.b) - (y.n - y.b)), same = ret.length - up.length - dn.length;
    const line = (x) => x.name + ": " + f(x.b) + " \u2192 " + f(x.n) + " (" + sg(x.n - x.b) + ")";
    t += "\n### What changed\n**Whole clan: " + sg(d) + " points" + pc(d, b0) + "**";
    if (up.length) t += "\n**Went up (" + up.length + ")**" + blk("+", up.slice(0, 10).map(line), up.length);
    if (dn.length) t += "\n**Went down (" + dn.length + ")**" + blk("-", dn.slice(0, 10).map(line), dn.length);
    if (same) t += "\n**No change (" + same + ")**";
    if (fresh.length) t += "\n**New (" + fresh.length + ")**" + blk("+", fresh.slice(0, 10).map((x) => x.name + ": " + f(x.n) + " points"), fresh.length);
  }
  const h = sh.hist;
  if (h && h.dates.length > 1) {
    const K = h.dates.length, totals = h.dates.map((_, k) => h.list.reduce((a, e) => a + (e.vals[k] || 0), 0));
    t += "\n### Points history\n- " + K + " runs saved, " + dt(h.dates[0]) + " to " + dt(h.dates[K - 1]) + "\n- Clan total: " + f(totals[0]) + " \u2192 " + f(totals[K - 1]);
    const left = h.list.filter((e) => e.vals[K - 1] === null && e.vals.some((x) => x !== null)).map((e) => e.name);
    if (left.length) t += "\n**Left the clan (" + left.length + ")**" + blk("-", left.slice(0, 10), left.length);
  }
  return t;
};
const HOOK_RE = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
const setHook = (v) => { hookNow = v; try { if (v && $("hookkeep").checked) lsSet("fcd_hook", v); else localStorage.removeItem("fcd_hook"); } catch (e) {} };
$("hookbox").onchange = () => { const v = $("hookbox").value.trim(); if (v && !HOOK_RE.test(v)) { $("hookchk").textContent = "That doesn't look like a Discord webhook link. Copy it again."; return; } setHook(v); $("hookchk").textContent = v ? "Ready." : "Removed."; renderSaved(); if (pv) pvDraw(); };
if (lsGet("fcd_pingmode") !== "role") { try { localStorage.removeItem("fcd_pingmode"); } catch (e) {} } $("dcping").value = lsGet("fcd_pingmode") === "role" ? "role" : ""; $("dcrole").value = lsGet("fcd_pingrole") || "";
const dcPingShow = () => { const on = $("dcping").value === "role"; if (on) $("dcmore").open = true; $("dcrole").style.display = on ? "" : "none"; $("dcrolehelp").style.display = on ? "" : "none"; };
dcPingShow();
$("dcping").onchange = () => { dcPingShow(); const v = $("dcping").value; if (v === "role") lsSet("fcd_pingmode", v); else try { localStorage.removeItem("fcd_pingmode"); } catch (e) {} };
$("dcrole").onchange = () => { const id = (($("dcrole").value.match(/\d{15,25}/) || [])[0]) || ""; $("dcrole").value = id; if (id) lsSet("fcd_pingrole", id); else try { localStorage.removeItem("fcd_pingrole"); } catch (e) {} };
$("hookxlsx").checked = lsGet("fcd_hookxlsx") === "1";
$("hookxlsx").onchange = () => { lsSet("fcd_hookxlsx", $("hookxlsx").checked ? "1" : "0"); renderSaved(); };
$("hookkeep").onchange = () => { setHook(HOOK_RE.test(hookGet()) ? hookGet() : ""); renderSaved(); };
$("hookforget").onclick = () => { $("hookkeep").checked = false; setHook(""); $("hookbox").value = ""; $("hookchk").textContent = "Forgotten."; renderSaved(); if (pv) pvDraw(); };
let postBusy = false;
const nap = (ms) => new Promise((r) => setTimeout(r, ms));
async function dcPost(t, files) {
  if (postBusy) throw new Error("Already posting. Wait a moment.");
  postBusy = true;
  try {
    const i = t.indexOf("\n### "); let head = i > 0 ? t.slice(0, i) : t, body = i > 0 ? t.slice(i + 1) : "";
    if (body.length > 1900) body = body.slice(0, Math.max(body.lastIndexOf("\n", 1850), 0) || 1850) + "\n-# (cut short, the rest is in the file)";
    let sent; try { sent = await hookSend(head.slice(0, 1900), files); } catch (e) { if (!/429/.test(String(e && e.message))) throw e; clog("Discord: slowing us down. Trying again in 4 seconds."); await nap(4000); sent = await hookSend(head.slice(0, 1900), files); }
    if (body) {
      try { await hookSend(body, undefined, true); } catch (e) {
        if (/429/.test(String(e && e.message))) { clog("Discord: slowing us down. Trying the breakdown again in 4 seconds."); await nap(4000); try { await hookSend(body, undefined, true); return sent; } catch (e2) { e = e2; } }
        throw new Error("The picture posted, but the breakdown did not. Wait a minute, then post again.");
      }
    }
    return sent;
  } finally { postBusy = false; }
}
async function hookPost(text, file, quiet) {
  if (postBusy) throw new Error("Already posting. Wait a moment.");
  postBusy = true; try { return await hookSend(text, file, quiet); } finally { postBusy = false; }
}
async function hookSend(text, file, quiet) {
  const url = hookGet(), pg = quiet ? "" : $("dcping").value, rid = (($("dcrole").value.match(/\d{15,25}/) || [])[0]), body = { content: (pg === "role" && rid ? "<@&" + rid + ">\n" : "") + text, allowed_mentions: { parse: [], roles: pg === "role" && rid ? [rid] : [] } };
  if (pg === "role" && !rid) throw new Error("Enter the role ID first (or pick Don't ping anyone).");
  if (!HOOK_RE.test(url)) throw new Error("Add your Discord link in Settings first.");
  const send = (body) => fetch(url + "?wait=true", { method: "POST", body, signal: AbortSignal.timeout(30000) }).catch((e) => { clog("Discord: could not reach it (" + (e && e.name) + ": " + (e && e.message) + ")."); throw e; });
  let res, fileSent = false;
  clog("Discord: sending a message" + (file ? " with " + [].concat(file).map((x) => x.name + " " + Math.round(x.blob.size / 1024) + " KB").join(", ") : " (no files)") + ".");
  if (file) { try { const f = new FormData(); f.append("payload_json", JSON.stringify(body)); [].concat(file).forEach((x, i) => f.append("files[" + i + "]", x.blob, x.name)); res = await send(f); fileSent = res.ok; } catch (e) { clog("Discord: the file could not go with the message (" + (e && e.name) + "). Trying the message alone."); if (e && e.name === "TimeoutError") throw new Error("Discord was slow. Check the channel before posting again."); } }
  if (!res || !res.ok) { try { res = await send(new Blob([JSON.stringify(body)], { type: "application/json" })); } catch (e) { throw new Error("Could not reach Discord. An ad blocker or privacy shield may be blocking it. Turn it off for this site, or try a Private window."); } }
  clog("Discord answered: HTTP " + res.status + (fileSent ? " (files went)" : " (message only)"));
  if (!res.ok) { try { clog("Discord said: " + (await res.clone().text()).slice(0, 150)); } catch (e) {} }
  if (!res.ok) throw new Error(res.status === 404 ? "Discord says that link is gone. Make a new one in Discord." : "Discord said no (" + res.status + ").");
  return fileSent;
}
// ---- Table picture for Discord: drawn on a canvas here, no AI, no package ----
function artShow() { const d = lsGet("fcd_art"), t = $("artthumb"); $("artforget").style.display = d ? "" : "none"; if (!d) $("artmsg").textContent = "No picture saved."; t.style.display = d ? "" : "none"; if (d) t.src = d; if (d && !$("artmsg").textContent) $("artmsg").textContent = "Picture saved on this device."; }
const artLoad = () => new Promise((ok) => { const d = lsGet("fcd_art"); if (!d) return ok(null); const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = d; });
$("artfile").onchange = () => {
  const f = $("artfile").files[0]; if (!f) return; const u = URL.createObjectURL(f), i = new Image();
  i.onload = () => { try {
    const w = Math.min(900, i.naturalWidth), c = document.createElement("canvas"); c.width = w; c.height = Math.round(i.naturalHeight * w / i.naturalWidth);
    c.getContext("2d").drawImage(i, 0, 0, c.width, c.height); lsSet("fcd_art", c.toDataURL("image/jpeg", 0.85)); clog("Header picture saved (" + c.width + "x" + c.height + ")."); $("artmsg").textContent = "\u2713 File selected: " + f.name + ". Saved on this device."; renderSaved();
  } catch (e) { clog("Header picture not saved: " + (e && e.name)); $("artmsg").textContent = "Too big to keep. Try a smaller picture."; } URL.revokeObjectURL(u); $("artfile").value = ""; };
  i.onerror = () => { $("artmsg").textContent = "That picture would not open."; URL.revokeObjectURL(u); };
  i.src = u;
};
$("artforget").onclick = () => { try { localStorage.removeItem("fcd_art"); } catch (e) {} $("artmsg").textContent = "Removed."; renderSaved(); artShow(); $("artmsg").textContent = "Removed."; };
// rows: {c: [cell, ...], b: bold, bg: colour}; a cell is text or [text, colour]
async function tablePic(title, sub, cols, rows) {
  const W = 830, RH = 50, HD = 46, PAD = 28, AH = 400, art = await artLoad(), cv = document.createElement("canvas");
  clog("Table picture: " + (art ? "with your header picture" : "no header picture saved") + ", " + rows.length + " rows.");
  let bg = [30, 31, 34], dw = 0, dh = 0;
  if (art) {
    try { const t = document.createElement("canvas"); t.width = t.height = 1; const tc = t.getContext("2d"); tc.drawImage(art, 2, 2, 1, 1, 0, 0, 1, 1); const d = tc.getImageData(0, 0, 1, 1).data; bg = [d[0], d[1], d[2]]; } catch (e) {}
    const sc = Math.min((W - 2 * PAD) / art.naturalWidth, AH / art.naturalHeight); dw = Math.round(art.naturalWidth * sc); dh = Math.round(art.naturalHeight * sc);
  }
  const mix = (k) => "rgb(" + bg.map((v) => Math.round(v * k)).join(",") + ")", lift = (k) => "rgb(" + bg.map((v) => Math.round(v + (255 - v) * k)).join(",") + ")";
  const top = art ? dh + 36 : 20, tableY = top + 100, TH = HD + rows.length * RH, H = tableY + TH + 64;
  cv.width = W; cv.height = H; const g = cv.getContext("2d");
  g.fillStyle = "rgb(" + bg.join(",") + ")"; g.fillRect(0, 0, W, H);
  if (art) g.drawImage(art, Math.round((W - dw) / 2), 20, dw, dh);
  const FONT = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", fit = (t, w) => { t = String(t); if (g.measureText(t).width <= w) return t; while (t.length > 1 && g.measureText(t + "…").width > w) t = t.slice(0, -1); return t + "…"; };
  g.textBaseline = "middle"; g.textAlign = "center"; g.fillStyle = "#ffffff"; g.font = "bold 36px " + FONT; g.fillText(fit(title, W - 60), W / 2, top + 30);
  g.fillStyle = lift(0.7); g.font = "20px " + FONT; g.fillText(fit(sub, W - 60), W / 2, top + 72);
  g.save(); g.beginPath(); const x0 = PAD, w0 = W - 2 * PAD, r0 = 18; g.moveTo(x0 + r0, tableY); g.arcTo(x0 + w0, tableY, x0 + w0, tableY + TH, r0); g.arcTo(x0 + w0, tableY + TH, x0, tableY + TH, r0); g.arcTo(x0, tableY + TH, x0, tableY, r0); g.arcTo(x0, tableY, x0 + w0, tableY, r0); g.closePath(); g.clip();
  g.fillStyle = mix(0.4); g.fillRect(x0, tableY, w0, HD);
  const xs = []; let x = x0 + 22; cols.forEach((c) => { xs.push(x); x += c.w; });
  g.textAlign = "left";
  const put = (t, i, yy, col, bold, size) => { const c = cols[i]; g.font = (bold ? "bold " : "") + (size || 24) + "px " + FONT; g.fillStyle = col; t = fit(t, c.w - 12); g.textAlign = c.a === "r" ? "right" : "left"; g.fillText(t, c.a === "r" ? xs[i] + c.w - 12 : xs[i], yy); g.textAlign = "left"; };
  cols.forEach((c, i) => put(c.h, i, tableY + HD / 2, lift(0.55), true, 18));
  rows.forEach((r, k) => { const y = tableY + HD + k * RH; g.fillStyle = r.bg || (k % 2 ? mix(0.58) : mix(0.46)); g.fillRect(x0, y, w0, RH);
    r.c.forEach((cell, i) => { const a = Array.isArray(cell) ? cell : [cell, "#ffffff"]; put(a[0], i, y + RH / 2, a[1], a[2] || r.b, 24); }); });
  g.restore(); g.textAlign = "center"; g.fillStyle = lift(0.45); g.font = "16px " + FONT; g.fillText("Made with Fishing Cat Data", W / 2, H - 28);
  return await new Promise((ok, no) => cv.toBlob((b) => (b ? ok(b) : no(new Error("The picture could not be drawn."))), "image/png"));
}
const chCell = (n, b) => { const sg = (v) => (v > 0 ? "+" : "-") + Math.round(Math.abs(v)).toLocaleString("en-US"); if (typeof b !== "number") return ["new", "#7fc4ff"]; return n - b > 0 ? [sg(n - b), "#6dd47e"] : n - b < 0 ? [sg(n - b), "#ff7a7a"] : ["-", "#b9b3c4"]; };
const subLine = (date, n, tot, d, any) => date + " · " + n + " members · " + Math.round(tot).toLocaleString("en-US") + " points" + (any ? " · " + (d >= 0 ? "+" : "-") + Math.round(Math.abs(d)).toLocaleString("en-US") + " since last run" : "");
async function rowsPic(items, clan, sub, name) {
  const MAX = 60, medal = ["#f5c518", "#c9c9d3", "#cd8a3c"];
  const out = items.slice(0, MAX).map((r) => { const m = r.rk >= 1 && r.rk <= 3 ? r.rk - 1 : -1, c = m >= 0 ? medal[m] : "#ffffff";
    return { c: [["#" + r.rk, c, true], [r.name, c, true], [r.role || "", "rgba(255,255,255,0.78)"], [String(r.points), "#ffffff"], r.ch] }; });
  if (items.length > MAX) out.push({ c: ["", "+" + (items.length - MAX) + " more in the sheet", "", "", ""] });
  return { blob: await tablePic((clan || "Clan") + " – Member Points", sub, [{ h: "#", w: 70 }, { h: "Username", w: 270 }, { h: "Role", w: 160 }, { h: "Points", w: 130, a: "r" }, { h: "Change", w: 100, a: "r" }], out), name };
}
async function clanPic(rows) {
  const pm = fixNames(prevMap, pv.rows); let tot = 0, d = 0, any = false;
  const items = rows.map((r, i) => { const n = parsePoints(r.points), b = pm ? pm.get(String(r.name).trim().toLowerCase()) : undefined; if (n !== null) tot += n; if (pm && n !== null && typeof b === "number") { d += n - b; any = true; }
    return { rk: Number(String(r.rank).replace(/\D/g, "")) || i + 1, name: String(r.name), role: r.role, points: r.points, ch: pm && n !== null ? chCell(n, b) : ["", "#b9b3c4"] }; });
  return rowsPic(items, pv.p.clan, subLine(todayText(), items.length, tot, d, any), nameOf(pv.p) + ".png");
}
// Read a sheet this page made (no AI): who is in it, their points, and the earlier points.
async function readSheet(buf) {
  if (buf && buf.byteLength > 5e6) throw new Error("That Excel file is too big to be one of ours.");
  await loadExcel(); if (!window.ExcelJS) throw new Error("The spreadsheet part did not load. Refresh the page.");
  const wb = new window.ExcelJS.Workbook(); zipCheck(buf); await wb.xlsx.load(buf);
  const ws = wb.getWorksheet("Clan Members") || wb.worksheets[0]; let head = 0;
  ws.eachRow((row, n) => { if (!head && String(row.getCell(2).value).trim() === "Username") head = n; });
  if (!head) throw new Error("That file is not a sheet made by this page.");
  const val = (c) => { let v = c.value; if (v && typeof v === "object" && "result" in v) v = v.result; return v; }, items = []; let any = false;
  for (let r = head + 1; r <= Math.min(ws.rowCount, 5000); r++) {
    const name = val(ws.getCell(r, 2)), n = val(ws.getCell(r, 5)), b = val(ws.getCell(r, 6)); if (!name || typeof n !== "number") continue;
    if (typeof b === "number") any = true;
    items.push({ rk: Number(val(ws.getCell(r, 1))) || items.length + 1, name: String(name), role: String(val(ws.getCell(r, 3)) || ""), points: String(val(ws.getCell(r, 4)) || n), n, b: typeof b === "number" ? b : null });
  }
  let hist = null; const hs = wb.getWorksheet("Points history");
  if (hs) { const dates = []; for (let c = 3; c <= Math.min(hs.columnCount, 400); c++) { const v = val(hs.getCell(3, c)); if (v instanceof Date) dates.push(v); else break; }
    const list = []; for (let r = 4; r <= Math.min(hs.rowCount, 5000); r += 2) { const nm = val(hs.getCell(r, 1)); if (!nm) break; list.push({ name: String(nm), vals: dates.map((_, k) => { const v = val(hs.getCell(r, 3 + k)); return typeof v === "number" ? v : null; }) }); }
    if (dates.length && list.length) hist = { dates, list }; }
  const t1 = String(val(ws.getCell(1, 1)) || ""), t2 = String(val(ws.getCell(2, 1)) || "");
  return { items, any, hist, clan: t1.split(/\s[\u2013-]\s/)[0] || "Clan", game: t2.split("\u00b7")[0].trim() || "Roblox", date: ((t2.match(/Recorded ([^\u00b7]+)/) || [])[1] || todayText()).trim() };
}
const dcPick = () => { const fs = [...$("shfile").files]; $("shsel").textContent = fs.length ? "\u2713 " + fs.map((f) => f.name).join(", ") : "No files chosen."; $("shclear").style.display = fs.length ? "" : "none"; };
$("shfile").onchange = dcPick; $("shclear").onclick = () => { $("shfile").value = ""; dcPick(); };
$("shpost").onclick = async () => {
  const fl = [...$("shfile").files], xf = fl.find((f) => /\.xlsx$/i.test(f.name)), pf = fl.find((f) => /^image\//.test(f.type) || /\.(png|jpe?g|webp|gif)$/i.test(f.name)), say = (t) => { $("hookmsg").textContent = t; };
  if (!xf && !pf) { say(fl.length ? "Those files are not an Excel sheet (.xlsx) or a picture." : "Pick an Excel sheet or a photo first."); return; }
  say("Posting...");
  try {
    const files = []; let text = "Fishing Cat Data";
    if (xf) {
      const sh = await readSheet(await xf.arrayBuffer()).catch(() => { throw new Error("That Excel file could not be read. Use a sheet this page made."); }), f = (n) => Math.round(n).toLocaleString("en-US"), tot = sh.items.reduce((t, r) => t + r.n, 0);
      text = dcBreakdown(sh, f);
      if (!pf) files.push(await rowsPic(sh.items.map((r) => ({ ...r, ch: sh.any ? chCell(r.n, r.b === null ? undefined : r.b) : ["", "#b5bac1"] })), sh.clan, subLine(sh.date, sh.items.length, tot, sh.items.filter((r) => r.b !== null).reduce((t, r) => t + r.n - r.b, 0), sh.any), sh.clan + ".png"));
    }
    if (pf) files.push({ blob: pf, name: pf.name });
    if (xf && $("hookxlsx").checked) files.push({ blob: xf, name: xf.name });
    const sent = await dcPost(text, files);
    say(files.length && !sent ? "Posted the message, but the files could not go." : "Posted.");
  } catch (err) { clog("Stopped: " + why(err)); say(plain(err)); }
};
async function billPic(bills) {
  const out = [], MAX = 60;
  bills.forEach((b) => { const cur = b.currency ? b.currency + " " : "";
    out.push({ c: [(b.supplier || "Bill") + (b.billDate ? " · " + b.billDate : ""), ""], b: true, bg: "#2b2d31" });
    b.lines.forEach((l) => out.push({ c: [String(l.charge || l.type), l.amount !== null && l.amount !== undefined ? cur + Number(l.amount).toFixed(2) : String(l.amountShown || "")] }));
    if (b.total !== null && b.total !== undefined) out.push({ c: ["Total on the bill", cur + b.total], b: true }); });
  if (out.length > MAX) { const n = out.length - MAX; out.length = MAX; out.push({ c: ["+" + n + " more rows in the sheet", ""] }); }
  return { blob: await tablePic("Bills", todayText(), [{ h: "Charge", w: 470 }, { h: "Amount", w: 200, a: "r" }], out), name: "Bills.png" };
}
const dcShow = () => { const v = document.querySelector("input[name=dcsrc]:checked").value; $("dcfiles").style.display = v === "files" ? "" : "none"; };
document.querySelectorAll("input[name=dcsrc]").forEach((r) => { r.onchange = dcShow; });
$("dcgo").onclick = () => {
  const v = document.querySelector("input[name=dcsrc]:checked").value, say = (t) => { $("hookmsg").textContent = t; };
  say("");
  if (v === "files") { $("shpost").click(); return; }
  if (v === "bill") { if (!bp) { say("Read your bills first (Bills tab)."); return; } bpPost(); return; }
  if (!pv) { say("Make a clan sheet first (Roblox clan sheet tab)."); return; }
  pvPost();
};
$("hooktest").onclick = async () => {
  const v = $("hookbox").value.trim(); if (HOOK_RE.test(v)) setHook(v); renderSaved();
  $("hookchk").textContent = "Sending...";
  try { await hookPost("Fishing Cat Data test: this link works."); $("hookchk").textContent = "Worked. Check Discord."; } catch (e) { $("hookchk").textContent = plain(e); }
};
function hookText(compact) {
  const pm = fixNames(prevMap, pv.rows), rows = pv.rows.filter((r) => String(r.name).trim()), f = (n) => Math.round(n).toLocaleString("en-US"), sg = (n) => (n > 0 ? "+" : n < 0 ? "-" : "") + f(Math.abs(n));
  const tot = rows.reduce((t, r) => t + (parsePoints(r.points) || 0), 0), up = [], dn = [], fresh = [], here = new Set();
  let same = 0, before = 0, change = 0;
  rows.forEach((r) => { const k = String(r.name).trim().toLowerCase(), n = parsePoints(r.points), b = pm ? pm.get(k) : undefined; here.add(k); if (n === null || !pm) return;
    if (typeof b !== "number") { fresh.push(r.name); return; }
    const d = n - b; before += b; change += d; if (d > 0) up.push([r.name, d, b]); else if (d < 0) dn.push([r.name, d, b]); else same++; });
  up.sort((x, y) => y[1] - x[1]); dn.sort((x, y) => x[1] - y[1]);
  const pc = (d, b) => (b ? " (" + (d > 0 ? "+" : "") + (d / b * 100).toFixed(1) + "%)" : "");
  let t = dcHead(pv.p.clan, pv.p.game, todayText(), rows.length, f(tot));
  if (pm && (up.length || dn.length || same)) {
    t += "\n**" + sg(change) + pc(change, before) + "** since last run (returning members)\nUp " + up.length + " \u00b7 Down " + dn.length + " \u00b7 Same " + same + " \u00b7 New " + fresh.length;
    if (up.length && !compact) t += "\n**Top gains**\n" + up.slice(0, 5).map((g, i) => (i + 1) + ". " + dcMd(g[0]) + " " + sg(g[1]) + pc(g[1], g[2])).join("\n");
    if (dn.length && !compact) t += "\nBiggest drops: " + dn.slice(0, 3).map((g) => dcMd(g[0]) + " " + sg(g[1])).join(", ");
    if (fresh.length) t += "\nNew: " + fresh.slice(0, 10).map(dcMd).join(", ") + (fresh.length > 10 ? " and " + (fresh.length - 10) + " more" : "");
    const left = [...pm.keys()].filter((k) => !here.has(k));
    if (left.length) t += "\nNot in this list: " + left.slice(0, 10).map(dcMd).join(", ") + (left.length > 10 ? " and " + (left.length - 10) + " more" : "");
  }
  return t.slice(0, 1900);
}
async function pvPost() {
  const rows = pv.rows.filter((r) => String(r.name).trim() || String(r.points).trim());
  if (!rows.length) { setMsg("The list is empty. Add a row or tap Reset.", true); return; }
  try {
    setMsg("Posting to Discord...");
    await loadExcel();
    let file = null, txt = hookText(false);
    if (window.ExcelJS) { const buf = await buildWorkbook(window.ExcelJS, rows, prevMap, pv.p, todayText()).xlsx.writeBuffer(), fname = nameOf(pv.p) + ".xlsx"; if ($("hookxlsx").checked) file = { blob: new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), name: fname }; await keepMade(buf, fname); try { txt = dcBreakdown(await readSheet(buf), (n) => Math.round(n).toLocaleString("en-US")); } catch (e) { clog("Breakdown skipped: " + why(e)); } }
    const pic = await clanPic(rows).catch((e) => { clog("Table picture skipped: " + why(e)); return null; });
    const sent = await dcPost(txt, [pic, file].filter(Boolean));
    setMsg(sent ? "Posted to Discord." : "Posted to Discord. The sheet file could not go, so use Download sheet.");
  } catch (err) { clog("Stopped: " + why(err)); setMsg(plain(err), true); }
}
async function makeSheet(rows, p) {
  let blob, ext = ".xlsx";
  await loadExcel();
  if (window.ExcelJS) {
    const wb = buildWorkbook(window.ExcelJS, rows, prevMap, p, todayText()), buf = await wb.xlsx.writeBuffer();
    blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    await keepMade(buf, nameOf(p) + ".xlsx");
  } else {
    ext = ".csv";
    blob = new Blob([toCsv(rows)], { type: "text/csv" });
    clog("The spreadsheet part did not load, so a CSV was made instead.");
  }
  saveBlob(blob, nameOf(p) + ext);
}
async function pvDownload() {
  const rows = pv.rows.filter(r => String(r.name).trim() || String(r.points).trim()).map(r => { const n = Number(r.rank); return { ...r, rank: String(r.rank).trim() !== "" && Number.isFinite(n) ? n : r.rank }; });
  if (!rows.length) { setMsg("The list is empty. Add a row or tap Reset.", true); return; }
  try {
    await makeSheet(rows, pv.p);
    clog("Sheet downloaded from the checked list (" + rows.length + " rows).");
    markUsedVids();
    setMsg("Done: " + rows.length + " rows. Your sheet was downloaded.");
  } catch (err) { clog("Stopped: " + why(err)); setMsg(plain(err), true); }
}
function pvDraw() {
  
  const box = $("preview");
  box.replaceChildren();
  box.style.display = pv ? "" : "none";
  if (!pv) return;
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  const pm = fixNames(prevMap, pv.rows); // same name matching as the sheet, so the preview agrees with it
  const bad = pv.rows.filter(pvBad).length, off = pv.shown && Number(pv.shown) !== pv.rows.length;
  box.appendChild(el("div", "pvt", "Roblox clan preview"));
  box.appendChild(el("div", "pvd", pv.rows.length + " rows." + (bad ? " " + bad + (bad === 1 ? " needs" : " need") + " a look (orange)." : "") + (off ? " The screen says " + pv.shown + " members." : "") + " Tap a cell to fix it."));
  const here = new Set(pv.rows.map((r) => String(r.name).trim().toLowerCase())), gone = pm ? [...(pm.hist ? pm.hist.players.map(([k]) => k) : pm.keys())].filter((k) => !here.has(k)).length : 0;
  if (gone) box.appendChild(el("div", "pvd", gone + (gone === 1 ? " earlier member is" : " earlier members are") + " not in this list (kept in the history)."));
  const rows = pv.rows.map((r, i) => {
    const n = parsePoints(r.points), b = pm ? pm.get(String(r.name).trim().toLowerCase()) : undefined, has = typeof b === "number" && n !== null, d = has ? n - b : null;
    const cl = d === null ? "" : d > 0 ? "up" : d < 0 ? "dn" : "";
    const ed = (k, w, label) => ({ edit: { value: r[k] === undefined || r[k] === null ? "" : String(r[k]), w, label: label + ", row " + (i + 1), input: (v) => { r[k] = v; if (k === "name") r.unsure = false; } } });
    const role = String(r.role || "");
    return { bad: pvBad(r), delLabel: "Delete row " + (i + 1), del: () => { pv.rows.splice(i, 1); pvDraw(); }, cells: [
      Object.assign({ cls: "r" }, ed("rank", "36px", "Rank")), ed("name", "110px", "Username"),
      Object.assign({ cls: pv.p.extra ? "" : /owner/i.test(role) ? "own" : /coach/i.test(role) ? "coach" : "" }, ed("role", "84px", "Role")), Object.assign({ cls: "r" }, ed("points", "84px", "Points")),
      { t: n === null ? "" : String(n), cls: "r" }, { t: has ? String(b) : "", cls: "r" },
      { t: d === null ? "" : (d > 0 ? "+" : "") + d, cls: "r " + cl }, { t: d === null || !b ? "" : (d > 0 ? "+" : "") + (d / b * 100).toFixed(1) + "%", cls: "r " + cl },
      { t: d !== null ? (d > 0 ? "▲" : d < 0 ? "▼" : "–") : pm && n !== null ? "new" : "", cls: "r " + cl }] };
  });
  box.appendChild(xlTable({ file: nameOf(pv.p) + ".xlsx", titles: [pv.p.clan + " – Member Points", pv.p.game + "   ·   " + pv.rows.length + " members read"], header: ["Rank", "Username", pv.p.extra || "Role", "Points (as shown)", "Points (number)", "Previous Points", "Change", "% Change", "Trend"], rows, tabs: ["Clan Members", "About this sheet"], redraw: pvDraw }));
  const bt = el("div", "pvb"), mk = (id, text, fn) => { const b = el("button", "tab", text); b.type = "button"; if (id) b.id = id; b.onclick = fn; bt.appendChild(b); return b; };
  const dl = mk("pvgo", "Download sheet", pvDownload); dl.classList.remove("tab");
  mk("pvadd", "Add row", () => { const last = Number(pv.rows.length ? pv.rows[pv.rows.length - 1].rank : 0); pv.rows.push({ rank: (Number.isFinite(last) ? last : pv.rows.length) + 1, name: "", role: "", points: "" }); pvDraw(); });
  const ask = el("div", "pvd"), inp = document.createElement("input"), sendBtn = el("button", "tab", "Send"); ask.style.display = "none"; sendBtn.type = "button";
  inp.type = "password"; inp.autocomplete = "off"; inp.placeholder = "Paste your Discord link"; inp.setAttribute("aria-label", "Discord link");
  sendBtn.onclick = () => { const v = inp.value.trim(); if (!HOOK_RE.test(v)) { setMsg("That doesn't look like a Discord webhook link. Copy it again.", true); return; } setHook(v); $("hookbox").value = v; pvPost(); };
  ask.append(inp, sendBtn, el("div", "", "Used for this visit only. Tick Remember my link in Settings to keep it."));
  mk("pvpost", "Post to Discord", () => { if (HOOK_RE.test(hookGet())) return pvPost(); ask.style.display = ask.style.display ? "" : "none"; });
  mk("pvcopy", "Copy message", async () => { try { await navigator.clipboard.writeText(hookText()); setMsg("Message copied."); } catch (e) { setMsg("Couldn't copy. Select the message and copy it by hand.", true); } });
  mk("pvreset", "Reset", () => { pv.rows = pv.orig.map(r => ({ ...r })); pvDraw(); });
  box.appendChild(bt); box.appendChild(ask);
}
$("go").onclick = async () => {
  const key = $("key").value.trim();
  running = true; refresh();
  pv = null; pvDraw();
  clog("Run started with " + images.length + " file(s).");
  setMsg("Reading " + images.length + " screenshot(s)... this can take about 20-30 seconds.");
  prog.start("prog", ["Checking pictures", "Working out the game", "Waiting for the AI to read the list", "Getting your list ready"]);
  try {
    await collectPictures(images); // checks every file opens and the total is not too big, before any AI request
    prog.next();
    const p = await pickProfile(key);
    prog.next();
    PROMPT = buildPrompt(p);
    const text = await readScreenshots(key, images);
    prog.next();
    clog("AI replied (" + text.length + " characters).");
    const rows = parseRows(text);
    if (p.ranks === false) rows.forEach((r, i) => { r.rank = i + 1; });
    const shown = (text.match(/"members_on_screen"\s*:\s*(\d+)/) || [])[1];
    clog("Found " + rows.length + " unique row(s).");
    if (!rows.length) throw new Error("No member rows were found. The pictures may not show the member list.");
    adoptPending(); pv = { rows: rows.map(r => ({ ...r })), orig: rows.map(r => ({ ...r })), p, shown };
    pvDraw();
    const bad = rows.filter(r => r.name === "?" || parsePoints(r.points) === null).length;
    let last = 0, order = false;
    for (const r of rows) { const n = Number(r.rank); if (!Number.isFinite(n) || n <= last) order = true; else last = n; }
    clog("Checks: " + bad + " unreadable row(s), ranks " + (order ? "out of order" : "in order") + ".");
    const countOff = shown && Number(shown) !== rows.length;
    if (countOff) clog("Count check: screen says " + shown + ", read " + rows.length + ".");
    if (rows.cut) clog("The AI reply was cut off or untidy; kept the complete rows.");
    prog.stop(true);
    setMsg("Check your Roblox clan preview below, then tap Download sheet." + (rows.cut ? " The AI's reply was cut short, so some members may be missing. Try fewer pictures." : "") + (countOff ? " The screen says " + shown + " members, so some may be missing. Scroll slower and try again." : "") + (bad ? " Check " + bad + " row(s) marked ?." : "") + (order ? " Some ranks look out of order, so check the list." : ""));
  } catch (err) {
    clog("Stopped: " + why(err));
    prog.stop(false);
    setMsg(plain(err), true);
  } finally {
    running = false;
    refresh();
  }
};
// ---- Energy bills: the AI copies what is printed, the sheet does the sums ----
const BILL_PROMPT = `These photos show one or more household bills (electricity, gas, water, internet, phone, rates, insurance or similar). One bill may cover several photos.
Copy what is printed. Do not do any sums or conversions yourself. Never guess; use "" if something is not shown or not readable.
Do NOT copy the customer's name, address, account or customer numbers, or bank details.
Answer with ONLY one JSON object, no other text:
{"bills": [{
"supplier": "company name",
"country": "country the bill is from, if clear",
"currency": "3-letter code such as NZD, AUD, GBP, USD, EUR, if clear",
"decimal_mark": "." or "," (whichever this bill uses for decimals),
"bill_date": "as printed",
"due_date": "as printed",
"period_days": "number of days the bill covers, only if printed",
"estimated": true or false (does the bill say a reading is estimated?),
"total_due": "the total amount due, as printed",
"lines": [{"energy": "electricity" or "gas" or "other", "kind": "only for a bill that is not electricity or gas: one word such as water, internet, phone, rates, insurance, waste or other; otherwise empty", "charge": "name of the charge as printed", "used": "quantity as printed, number only", "unit": "unit of the quantity used, as printed, e.g. kWh, MJ, m3, therms, CCF, days. Not the price rate (never c/kWh, c/unit or c/day)", "kwh_printed": "the kWh figure for this line, if the bill prints one and the unit is not already kWh", "calorific_value": "if printed", "correction_factor": "if printed", "therm_factor": "the BTU or therm factor, if printed", "amount": "money amount for this line as printed, with a minus sign if it is a credit or discount"}],
"notes": ["up to 4 short plain sentences about what this bill shows: what kind of bill it is, which charge is the biggest, any discount and its deadline, any estimated reading. No advice. No sums of your own."]
}]}
List every charge line, including daily or fixed charges, discounts, taxes and levies. Do not list payments, opening balances or the total as lines.`;
// Read a number as printed. mark is the bill's decimal mark ("." or ","). Credits (cr, minus, brackets) are negative.
function parseNum(v, mark) {
  const s = tidy(v, 30).replace(/(\d)[ \u00a0\u202f'\u2019](?=\d{3}(?!\d))/g, "$1"), m = s.match(/\d[\d.,]*|[.,]\d+/);
  if (!m) return null;
  const neg = /^\(.*\)$/.test(s) || /(^|[^a-z])cr\b/i.test(s) || /(^|[^a-z])[-−]\D{0,5}$/i.test(s.slice(0, m.index)) || /[-−]\s*$/.test(s);
  let t = m[0].replace(/[.,]+$/, "");
  if (mark !== "," && mark !== ".") mark = /^\d{1,3}(\.\d{3}){2,}(,\d+)?$/.test(t) || t.lastIndexOf(",") > t.lastIndexOf(".") && (t.includes(".") || /,\d{1,2}$/.test(t)) ? "," : ".";
  t = mark === "," ? t.replace(/\./g, "").replace(",", ".") : t.replace(/,/g, "");
  if (!/^(\d+(\.\d+)?|\.\d+)$/.test(t)) return null;
  return (neg ? -1 : 1) * parseFloat(t);
}
// How each unit becomes kWh: [what to add to the Excel formula, plain words]. Fixed physics only; gas volume needs the bill's own factors.
const KWH_RULES = { kwh: ["", "as shown"], wh: ["/1000", "Wh ÷ 1000"], mwh: ["*1000", "MWh × 1000"], mj: ["/3.6", "MJ ÷ 3.6"], gj: ["*1000/3.6", "GJ × 1000 ÷ 3.6"], therms: ["*29.3071", "therms × 29.3071"], therm: ["*29.3071", "therms × 29.3071"] };
const NOT_ENERGY = ["", "day", "days", "month", "months", "each", "kw", "kva", "tag", "tage", "monat", "jour", "jours", "mois", "dia", "dias", "d\u00edas", "mes", "giorni", "dag", "dagen"];
function kwhFor(line, mark) {
  const u = tidy(line.unit, 14).toLowerCase().replace(/[\s.]/g, "").replace("³", "3").replace(/^(c|p|ct|cts|cents?|pence|[$€£¢]|nzd|aud|usd|gbp|eur)(\/|per)/, ""); // a price rate like c/unit or c/day: use the unit after the slash
  const printed = parseNum(line.kwh_printed, mark), cv = parseNum(line.calorific_value, mark), cf = parseNum(line.correction_factor, mark), tf = parseNum(line.therm_factor, mark);
  if (KWH_RULES[u]) return { add: KWH_RULES[u][0], how: KWH_RULES[u][1] };
  if ((u === "units" || u === "unit") && line.energy === "electricity") return { add: "", how: "units = kWh" };
  if (printed !== null && printed >= 0) return { value: printed, how: "kWh printed on the bill" };
  // Factors must look like real ones, or the row is flagged instead. Heat value: 30-50 means MJ per m3, 8-14 means kWh per m3.
  const fine = (x, lo, hi) => x !== null && x >= lo && x <= hi, cfOk = cf === null || fine(cf, 0.8, 1.2);
  if (["m3", "cubicmetres", "cubicmeters"].includes(u) && cfOk && (fine(cv, 30, 50) || fine(cv, 8, 14))) { const mj = cv >= 30; return { add: "*" + (cf || 1) + "*" + cv + (mj ? "/3.6" : ""), how: "m\u00b3 \u00d7 " + (cf ? cf + " \u00d7 " : "") + cv + (mj ? " \u00f7 3.6" : "") + " (factors from the bill)" }; }
  if ((u === "ccf" || u === "mcf") && fine(tf, 0.8, 1.3)) return { add: (u === "mcf" ? "*10" : "") + "*" + tf + "*29.3071", how: u.toUpperCase() + " \u00d7 " + (u === "mcf" ? "10 \u00d7 " : "") + tf + " \u00d7 29.3071 (factor from the bill)" };
  if (NOT_ENERGY.includes(u)) return { how: "" };
  return { how: "check: can't turn " + (tidy(line.unit, 14) || "this unit") + " into kWh", check: true };
}
function parseBills(text) {
  text = String(text ?? "").slice(0, 100000);
  let d = null, cut = false;
  try { d = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)); } catch (e) { d = closeCut(text.slice(text.indexOf("{"))); cut = !!d; }
  const list = d && (Array.isArray(d.bills) ? d.bills : [d]);
  const bills = (list || []).filter(b => b && typeof b === "object" && Array.isArray(b.lines)).slice(0, 12).map(b => {
    const mark = b.decimal_mark === "," || b.decimal_mark === "." ? b.decimal_mark : "";
    const counted = new Set(); // several charges can be priced on the same usage (a levy per kWh): count that usage once
    const lines = b.lines.filter(l => l && typeof l === "object" && (tidy(l.charge, 60) || tidy(l.amount, 30))).slice(0, 60).map(l => {
      const energy = /^elec/i.test(tidy(l.energy, 20)) ? "electricity" : /^gas/i.test(tidy(l.energy, 20)) ? "gas" : "other";
      const kind = energy === "other" ? tidy(l.kind, 20).toLowerCase().replace(/[^a-z]/g, "") : "";
      let k = kind ? { how: "" } : kwhFor({ unit: l.unit, energy, kwh_printed: l.kwh_printed, calorific_value: l.calorific_value, correction_factor: l.correction_factor, therm_factor: l.therm_factor }, mark);
      const amount = parseNum(l.amount, mark), used = parseNum(l.used, mark);
      if (k.add !== undefined || k.value !== undefined) {
        const same = energy + "|" + (k.value !== undefined ? "kwh" + k.value : used + tidy(l.unit, 14).toLowerCase());
        if (counted.has(same)) k = { how: "same usage as an earlier row: not counted twice" };
        counted.add(same);
      }
      const bad = amount === null ? "check: amount not read" : (k.add !== undefined && used === null ? "check: amount used not read" : "");
      return { type: energy === "electricity" ? "Electricity" : energy === "gas" ? "Gas" : kind ? kind[0].toUpperCase() + kind.slice(1) : "Other", charge: tidy(l.charge, 60), usedShown: tidy(l.used, 30), unit: tidy(l.unit, 14), used, k, how: [k.how, bad].filter(Boolean).join("; "), amountShown: tidy(l.amount, 30), amount, check: !!(k.check || bad) };
    });
    return { supplier: tidy(b.supplier, 50) || "Not read", country: tidy(b.country, 30), currency: tidy(b.currency, 6).toUpperCase(), billDate: tidy(b.bill_date, 30), dueDate: tidy(b.due_date, 30), days: parseNum(b.period_days, mark), estimated: b.estimated === true ? "Yes" : b.estimated === false ? "No" : "", totalShown: tidy(b.total_due, 30), total: parseNum(b.total_due, mark), lines, notes: (Array.isArray(b.notes) ? b.notes : []).map(n => tidy(n, 220)).filter(Boolean).slice(0, 4) };
  }).filter(b => b.lines.length);
  if (!bills.length) throw new Error("The AI did not find any bill charges. Try a clearer, straight-on photo of the whole bill.");
  bills.cut = cut;
  return bills;
}
// A cut-off reply: keep everything up to the last complete "}" and close what is still open.
function closeCut(t) {
  for (let end = t.lastIndexOf("}"), n = 0; end > 0 && n < 200; end = t.lastIndexOf("}", end - 1), n++) {
    const s = t.slice(0, end + 1), open = []; let q = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (q) { if (c === "\\") i++; else if (c === '"') q = false; }
      else if (c === '"') q = true;
      else if (c === "{" || c === "[") open.push(c === "{" ? "}" : "]");
      else if (c === "}" || c === "]") open.pop();
    }
    if (q) continue;
    try { return JSON.parse(s + open.reverse().join("")); } catch (e) {}
  }
  return null;
}
function buildBillBook(EJ, bills, when) {
  const wb = new EJ.Workbook();
  wb.calcProperties.fullCalcOnLoad = true;
  const NAVY = "FF1F3864", GREY = "FF7F7F7F", LINE = { style: "thin", color: { argb: "FFD0D5DD" } }, box = { left: LINE, right: LINE, top: LINE, bottom: LINE };
  const fill = (c) => ({ type: "pattern", pattern: "solid", fgColor: { argb: c } });
  const headCell = (c, t) => { c.value = t; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = fill(NAVY); c.border = box; c.alignment = { vertical: "middle", wrapText: true }; };
  const title = (ws, t, sub) => { ws.getCell("A1").value = t; ws.getCell("A1").font = { bold: true, size: 16, color: { argb: NAVY } }; ws.getCell("A2").value = sub; ws.getCell("A2").font = { color: { argb: GREY } }; };
  const INK = "FF1F2937", SOFT = "FFF5F7FA", GRN = "FF2E6B3F", GRNF = "FFEAF4EC";
  const rich = (parts) => ({ richText: parts.map(([text, c, b]) => ({ text, font: { size: 10, bold: !!b, color: { argb: c || INK } } })) });
  const strip = (sh, last, parts, h) => { sh.mergeCells("A2:" + last + "2"); const c = sh.getCell("A2"); c.value = rich(parts); c.fill = fill(SOFT); c.alignment = { wrapText: true, vertical: "middle", indent: 1 }; sh.getRow(2).height = h; sh.getRow(1).height = 30; sh.getCell("A1").alignment = { vertical: "middle" }; };
  const BANDS = ["FFEAF0FA", "FFFFF8E5", "FFF0EAF7", "FFFDEBE4"];
  const sm = wb.addWorksheet("Summary");
  const ws = wb.addWorksheet("Bills", { views: [{ state: "frozen", ySplit: 3 }] });
  [7, 24, 14, 16, 16, 12, 30, 14, 9, 13, 14, 40, 16, 15, 10].forEach((w, i) => { ws.getColumn(i + 1).width = w; });
  const count = bills.reduce((t, b) => t + b.lines.length, 0);
  title(ws, "Bills", "");
  strip(ws, "O", [["How to read  ", NAVY, 1], [bills.length + (bills.length === 1 ? " bill" : " bills") + ", " + count + " charges read on " + when + ". One row per charge on the bill. Always check the numbers against the paper bill.\n"], ["Grey small text", GREY, 1], [" = exactly what the bill printed.   "], ["Bold number", INK, 1], [" = the number used for the sums.   "], ["Green columns", GRN, 1], [" = worked out by the sheet.   "], ["Red", "FF9C0006", 1], [" = check this one.   Each bill has its own row colour."]], 52);
  ["Bill", "Supplier", "Country", "Bill date", "Due date", "Type", "Charge", "Used (printed)", "Unit", "Used", "Used in kWh", "Note", "Amount (printed)", "Amount", "Currency"].forEach((h, i) => { const c = ws.getCell(3, i + 1); headCell(c, h); c.alignment = { vertical: "middle", horizontal: "center", wrapText: true }; if (i === 10 || i === 11) c.fill = fill(GRN); else if (i === 7 || i === 12) c.fill = fill("FF5B6B8C"); });
  ws.getRow(3).height = 38;
  let n = 3;
  bills.forEach((b, i) => b.lines.forEach((l) => {
    n++;
    [("Bill " + (i + 1)), b.supplier, b.country, b.billDate, b.dueDate, l.type, l.charge, l.usedShown, l.unit, l.used, null, l.how, l.amountShown, l.amount, b.currency].forEach((v, c) => {
      const cell = ws.getCell(n, c + 1);
      if (v !== null && v !== "") cell.value = v;
      cell.border = box; cell.fill = fill(BANDS[i % BANDS.length]); cell.font = { color: { argb: INK } };
      cell.alignment = { vertical: "middle", horizontal: [0, 8, 9, 10, 12, 13].includes(c) ? "right" : "left", indent: c === 0 || c === 8 ? 0 : 1 };
      if (c === 7 || c === 12) cell.font = { size: 9, color: { argb: GREY } };
      if (c === 9 || c === 13) cell.font = { bold: true, color: { argb: INK } };
      if (/gst|tax|vat/i.test(String(l.charge || ""))) { if (c >= 5 && c <= 6) cell.font = { italic: true, color: { argb: GREY } }; }
    });
    ws.getRow(n).height = 20;
    const k = ws.getCell(n, 11);
    if (l.k.value !== undefined) k.value = l.k.value;
    else if (l.k.add !== undefined) k.value = { formula: `IF(J${n}="","",J${n}${l.k.add})` };
    k.fill = fill(GRNF); k.font = { bold: true, color: { argb: GRN } }; k.alignment = { horizontal: "right", vertical: "middle" };
    ws.getCell(n, 10).numFmt = "#,##0.##"; k.numFmt = "#,##0.0"; ws.getCell(n, 14).numFmt = "#,##0.00";
    ws.getCell(n, 12).fill = fill(GRNF); ws.getCell(n, 12).font = l.check ? { bold: true, color: { argb: "FF9C0006" } } : { size: 9, color: { argb: GRN } };
  }));
  // Fewer columns on screen. The hidden ones (exactly what the bill printed, and details that repeat on every row) are still there: select the columns either side and Unhide.
  [3, 5, 8, 13].forEach((c) => { ws.getColumn(c).hidden = true; });
  ws.getCell("A" + (n + 2)).value = "Columns C, E, H and M are hidden: country, due date and the exact text the bill printed. Select the columns either side and Unhide to see them.";
  ws.getCell("A" + (n + 2)).font = { italic: true, size: 9, color: { argb: GREY } };
  ws.autoFilter = `A3:O${n}`;
  // Summary (first tab): one column per bill, in sections. Numbers are formulas; the plain words come from the AI.
  sm.getColumn(1).width = 40;
  bills.forEach((b, i) => { sm.getColumn(i + 2).width = 46; });
  title(sm, "Summary", "");
  strip(sm, colL(1 + bills.length), [["How to read  ", NAVY, 1], ["One column per bill. This tab is the answer; the Bills tab lists every charge.\n"], ["White", INK, 1], [" = copied from the bill.   "], ["Green", GRN, 1], [" = worked out by the sheet (fix a number on the Bills tab and it updates).   "], ["Blue", "FF2F5597", 1], [" = plain-words notes written by the AI. Check them, they do not update.   Money is never converted between currencies."]], 84);
  sm.getRow(3).height = 8;
  const S = "'Bills'!", R = {}, MONEY = "#,##0.00", KWH = "#,##0.0";
  let r = 4;
  const band = (t) => { for (let c = 1; c <= 1 + bills.length; c++) headCell(sm.getCell(r, c), c === 1 ? t : "Bill " + (c - 1)); sm.getRow(r).height = 22; r++; };
  const line = (key, t, green, fmt, fn) => {
    if (key) R[key] = r;
    const c = sm.getCell(r, 1); c.value = t; c.font = { bold: true, color: { argb: green ? GRN : INK } }; c.fill = fill(green ? GRNF : SOFT); c.border = box; c.alignment = { vertical: "middle", indent: 1, wrapText: true };
    bills.forEach((b, i) => {
      const x = sm.getCell(r, i + 2), v = fn(b, i + 1, colL(i + 2));
      if (v !== null && v !== undefined && v !== "") x.value = v;
      x.border = box; x.numFmt = fmt; x.alignment = { horizontal: "right", vertical: "middle", indent: 1 };
      if (green) { x.fill = fill(GRNF); x.font = { bold: true, color: { argb: GRN } }; }
    });
    r++;
  };
  const sum = (id, extra) => ({ formula: `SUMIFS(${S}N:N,${S}A:A,"Bill ${id}"${extra || ""})` });
  const kwh = (id, type) => ({ formula: `SUMIFS(${S}K:K,${S}A:A,"Bill ${id}",${S}F:F,"${type}")` });
  band("About the bill");
  line("", "Supplier", false, "@", (b) => b.supplier);
  line("", "Country", false, "@", (b) => b.country);
  line("", "Bill date", false, "@", (b) => b.billDate);
  line("", "Due date", false, "@", (b) => b.dueDate);
  line("", "Currency", false, "@", (b) => b.currency);
  line("days", "Days the bill covers", false, "0", (b) => b.days);
  band("Does it add up?");
  line("added", "All charges added up", true, MONEY, (b, id) => sum(id));
  line("total", "Total printed on the bill", false, MONEY, (b) => (b.total !== null ? b.total : b.totalShown));
  line("match", "Same as the bill?", true, "@", (b, id, L) => ({ formula: `IF(ISNUMBER(${L}${R.total}),IF(ABS(${L}${R.added}-${L}${R.total})<0.005,"Yes","No: check the charges"),"Total not read")` }));
  line("", "Was the meter reading a guess?", false, "@", (b) => b.estimated);
  sm.addConditionalFormatting({ ref: `B${R.match}:${colL(1 + bills.length)}${R.match}`, rules: [{ type: "containsText", operator: "containsText", text: "No", priority: 1, style: { font: { bold: true, color: { argb: "FF9C0006" } } } }] });
  band("Energy used");
  line("elec", "Electricity used (kWh)", true, KWH, (b, id) => kwh(id, "Electricity"));
  line("gas", "Gas used (kWh)", true, KWH, (b, id) => kwh(id, "Gas"));
  line("", "Energy used per day (kWh)", true, KWH, (b, id, L) => ({ formula: `IF(OR(${L}${R.days}="",${L}${R.days}=0),"",(${L}${R.elec}+${L}${R.gas})/${L}${R.days})` }));
  line("", "Price per kWh (electricity usage charges only)", true, "0.0000", (b, id, L) => ({ formula: `IF(${L}${R.elec}=0,"",SUMIFS(${S}N:N,${S}A:A,"Bill ${id}",${S}F:F,"Electricity",${S}K:K,">0")/${L}${R.elec})` }));
  band("Cost by type");
  [...new Set(bills.flatMap(b => b.lines.map(l => l.type)))].forEach((t) => line("", t, true, MONEY, (b, id) => sum(id, `,${S}F:F,"${t}"`)));
  band("In plain words (written by the AI, check it)");
  ["What this bill is", "The biggest charge", "Paying it"].forEach((t, k) => {
    const c = sm.getCell(r, 1); c.value = t; c.font = { bold: true, color: { argb: INK } }; c.fill = fill(SOFT); c.border = box; c.alignment = { vertical: "middle", indent: 1 };
    let tall = 1;
    bills.forEach((b, i) => { const x = sm.getCell(r, i + 2), say = b.notes[k] || ""; x.value = say; x.alignment = { wrapText: true, vertical: "top", indent: 1 }; x.border = box; x.fill = fill("FFEEF3FB"); x.font = { color: { argb: INK } }; tall = Math.max(tall, Math.ceil(say.length / 48)); });
    sm.getRow(r).height = Math.max(30, tall * 15 + 6); r++;
  });
  return wb;
}
const billSay = (text, bad) => { dcSay(text); $("billmsg").textContent = text; $("billmsg").className = "msg" + (bad ? " err" : ""); };
$("billdrop").onclick = () => $("billfiles").click();
$("billdrop").ondragover = (e) => e.preventDefault();
function addBills(fileList) {
  for (const f of fileList) {
    const pdf = f.type === "application/pdf";
    if (!f.size || !(pdf || f.type.startsWith("image/"))) continue;
    if (pdf && f.size > 8e6) { billSay("The PDF \"" + tidy(f.name, 40) + "\" is over 8 MB. Use a smaller one or take a photo.", true); continue; }
    if (billPics.length >= 12) { billSay("Up to 12 photos or PDFs at a time. Tap Clear to start again.", true); break; }
    billPics.push(f);
  }
  loadExcel();
  refresh();
}
$("billdrop").ondrop = (e) => { e.preventDefault(); addBills(e.dataTransfer.files); };
$("billfiles").onchange = (e) => addBills(e.target.files);
// ---- Bills preview: check and fix the charges before the sheet is made ----
let bp = null;
const mkEl = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
async function bpDownload() {
  const bills = bp.bills.map(b => ({ ...b, lines: b.lines.filter(l => String(l.charge).trim() || l.amount !== null).map(l => ({ ...l, type: l.type || "Other" })) })).filter(b => b.lines.length);
  if (!bills.length) { billSay("The list is empty. Add a charge or tap Reset.", true); return; }
  try {
    await loadExcel();
    if (!window.ExcelJS) throw new Error("The spreadsheet part did not load. Refresh the page.");
    const wb = buildBillBook(window.ExcelJS, bills, todayText());
    saveBlob(new Blob([await wb.xlsx.writeBuffer()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "Bills - " + (bills.length === 1 ? clean(bills[0].supplier, 40) || "bill" : bills.length + " bills") + ".xlsx");
    clog("Bills sheet downloaded from the checked list (" + bills.length + " bill(s)).");
    billSay("Done: " + bills.length + " bill(s). Your sheet was downloaded. Compare the numbers with the bill before relying on them.");
  } catch (err) { clog("Stopped: " + why(err)); billSay(plain(err), true); }
}
async function bpPost() {
  const bills = bp.bills.map(b => ({ ...b, lines: b.lines.filter(l => String(l.charge).trim() || l.amount !== null).map(l => ({ ...l, type: l.type || "Other" })) })).filter(b => b.lines.length);
  if (!bills.length) { billSay("The list is empty. Add a charge or tap Reset.", true); return; }
  try {
    billSay("Posting to Discord...");
    await loadExcel();
    if (!window.ExcelJS) throw new Error("The spreadsheet part did not load. Refresh the page.");
    const text = ("**Bills** \u00b7 " + todayText() + "\n" + bills.map((b) => dcMd(b.supplier) + (b.billDate ? " \u00b7 " + dcMd(b.billDate) : "") + " \u00b7 " + b.lines.length + " charges" + (b.total !== null ? " \u00b7 " + dcMd(b.currency || "") + " " + b.total : "")).join("\n")).slice(0, 1900);
    const name = "Bills - " + (bills.length === 1 ? clean(bills[0].supplier, 40) || "bill" : bills.length + " bills") + ".xlsx";
    const pic = await billPic(bills).catch((e) => { clog("Table picture skipped: " + why(e)); return null; });
    const sent = await hookPost(text, [pic, $("hookxlsx").checked && { blob: new Blob([await buildBillBook(window.ExcelJS, bills, todayText()).xlsx.writeBuffer()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), name }].filter(Boolean));
    billSay(sent ? "Posted to Discord." : "Posted to Discord. The sheet file could not go, so use Download sheet.");
  } catch (err) { clog("Stopped: " + why(err)); billSay(plain(err), true); }
}
function bpDraw() {
  const box = $("billpreview");
  box.replaceChildren();
  box.style.display = bp ? "" : "none";
  if (!bp) return;
  box.appendChild(mkEl("div", "pvt", "Check your charges"));
  box.appendChild(mkEl("div", "pvd", "Tap a cell to fix it. Orange means the amount was not read."));
  const rows = [];
  bp.bills.forEach((b, bi) => {
    const sum = Math.round(b.lines.reduce((t, l) => t + (l.amount || 0), 0) * 100) / 100, same = b.total !== null && Math.abs(sum - b.total) < 0.005;
    box.appendChild(mkEl("div", "pvd", "Bill " + (bi + 1) + ", " + b.supplier + ": charges add up to " + sum.toFixed(2) + ". Total on the bill: " + (b.total === null ? "not read." : b.total.toFixed(2) + (same ? ". They match." : ". They do not match, so check the charges."))));
    b.lines.forEach((l, i) => {
      const ed = (k, w, label, fix) => ({ edit: { value: l[k] === undefined || l[k] === null ? "" : String(l[k]), w, label: label + ", bill " + (bi + 1) + " row " + (i + 1), input: (v) => { l[k] = fix(v); if (k === "amountShown") l.amount = parseNum(v, ""); } } });
      rows.push({ bad: l.amount === null, delLabel: "Delete row " + (i + 1) + " of bill " + (bi + 1), del: () => { b.lines.splice(i, 1); bpDraw(); }, cells: [
        { t: String(bi + 1), cls: "r" }, ed("type", "84px", "Type", (v) => v.replace(/[^A-Za-z]/g, "").slice(0, 20)), ed("charge", "150px", "Charge", (v) => v),
        { t: (l.usedShown + " " + l.unit).trim() }, Object.assign({ cls: "r" }, ed("amountShown", "80px", "Amount", (v) => v)), { t: b.currency }] });
    });
  });
  const count = rows.length;
  box.appendChild(xlTable({ file: "Bills - " + (bp.bills.length === 1 ? clean(bp.bills[0].supplier, 40) || "bill" : bp.bills.length + " bills") + ".xlsx", titles: ["Bills", bp.bills.length + " bill(s), " + count + " charge(s) read"], header: ["Bill", "Type", "Charge", "Used", "Amount", "Currency"], rows, tabs: ["Bills", "Summary"], redraw: bpDraw }));
  const bt = mkEl("div", "pvb");
  const dl = mkEl("button", "", "Download sheet"); dl.id = "bpgo"; dl.type = "button"; dl.onclick = bpDownload; bt.appendChild(dl);
  const ask = mkEl("div", "pvd", ""), inp = document.createElement("input"), sendBtn = mkEl("button", "tab", "Send"), hk = mkEl("button", "tab", "Post to Discord");
  ask.style.cssText = "display:none;flex-basis:100%"; sendBtn.type = "button"; hk.type = "button"; inp.type = "password"; inp.autocomplete = "off"; inp.placeholder = "Paste your Discord link"; inp.setAttribute("aria-label", "Discord link");
  sendBtn.onclick = () => { const v = inp.value.trim(); if (!HOOK_RE.test(v)) { billSay("That doesn't look like a Discord webhook link. Copy it again.", true); return; } setHook(v); $("hookbox").value = v; bpPost(); };
  ask.append(inp, sendBtn, mkEl("div", "", "Used for this visit only. Bills can show private details, so check the table first."));
  hk.onclick = () => { if (HOOK_RE.test(hookGet())) return bpPost(); ask.style.display = ask.style.display ? "" : "none"; };
  bt.appendChild(hk); bt.appendChild(ask);
  bp.bills.forEach((b, bi) => {
    const add = mkEl("button", "tab", bp.bills.length > 1 ? "Add to bill " + (bi + 1) : "Add charge"); add.type = "button";
    add.onclick = () => { b.lines.push({ type: "Other", charge: "", usedShown: "", unit: "", used: null, k: { how: "" }, how: "", amountShown: "", amount: null, check: false }); bpDraw(); };
    bt.appendChild(add);
  });
  const rs = mkEl("button", "tab", "Reset"); rs.id = "bpreset"; rs.type = "button"; rs.onclick = () => { bp.bills = JSON.parse(JSON.stringify(bp.orig)); bpDraw(); }; bt.appendChild(rs);
  box.appendChild(bt);
}
$("billtest").onclick = async () => {
  const key = $("key").value.trim(), id = provider();
  running = true; refresh();
  bp = null; bpDraw();
  billSay("Test read: looking at 1 photo... this can take about 30 seconds.");
  try {
    checkKey(key);
    const pics = (await collectPictures([billPics[0]])).slice(0, 1);
    await loadExcel();
    PROMPT = BILL_PROMPT;
    const bills = parseBills(await ASKERS[id](key, modelFor(id), pics));
    if (!bills.length) throw new Error("Test read: no charges found. The photo may not show the charges part of the bill.");
    const lines = bills.reduce((t, b) => t + b.lines.length, 0);
    bp = { bills, orig: JSON.parse(JSON.stringify(bills)) };
    bpDraw();
    billSay("Test OK: " + lines + " charge(s) from 1 photo. Nothing was downloaded.");
  } catch (err) { clog("Bill test stopped: " + err.message); billSay(plain(err), true); }
  finally { running = false; refresh(); }
};

$("billgo").onclick = async () => {
  const key = $("key").value.trim(), id = provider();
  running = true; refresh();
  bp = null; bpDraw();
  clog("Bill run started with " + billPics.length + " photo(s), using " + PROVIDERS[id].name + " (" + modelFor(id) + ").");
  billSay("Reading " + billPics.length + " photo(s)... this can take about 30 seconds.");
  prog.start("billprog", ["Checking photos", "Waiting for the AI to read the bills", "Getting your charges ready"]);
  clog("Run: " + billPics.length + " file(s) [" + billPics.map((f) => f.type + " " + Math.round(f.size / 1024) + " KB").join(", ") + "], company " + id + ", model " + modelFor(id));
  try {
    checkKey(key);
    const pics = await collectPictures(billPics);
    await loadExcel();
    prog.next();
    if (!window.ExcelJS) throw new Error("The spreadsheet part did not load. Refresh the page.");
    PROMPT = BILL_PROMPT;
    const text = await ASKERS[id](key, modelFor(id), pics);
    prog.next();
    clog("AI replied (" + text.length + " characters).");
    let bills; try { bills = parseBills(text); } catch (e) { clog("Reply that could not be used (first 3000 characters): " + text.slice(0, 3000), true); throw e; }
    if (bills.cut) clog("The AI reply was cut off; kept every complete charge. Check the last bill against the paper.");
    const lines = bills.reduce((t, b) => t + b.lines.length, 0), checks = bills.reduce((t, b) => t + b.lines.filter(l => l.check).length, 0);
    bp = { bills, orig: JSON.parse(JSON.stringify(bills)) };
    bpDraw();
    clog("Bills: " + bills.length + ", charges: " + lines + ", rows to check: " + checks + ".");
    bills.forEach((b, i) => clog("Bill " + (i + 1) + ": " + b.supplier + ", " + (b.country || "country ?") + ", " + (b.currency || "currency ?") + ", " + b.lines.length + " charge(s), days " + (b.days || "?") + ", total " + (b.total !== null && b.total !== undefined ? b.total : (b.totalShown || "?")) + ", AI notes " + (b.notes || []).length + (b.lines.some((l) => l.check) ? ", rows to check: " + b.lines.filter((l) => l.check).map((l) => l.charge + " (" + l.how + ")").join("; ") : "")));
    if (checks) clog("Reply (first 3000 characters, because rows need checking): " + text.slice(0, 3000), true);
    prog.stop(true);
    billSay("Check your charges below, then tap Download sheet." + (checks ? " " + checks + " row(s) are marked check in the sheet." : ""));
  } catch (err) {
    clog("Bill run stopped: " + why(err));
    prog.stop(false);
    billSay(plain(err), true);
  } finally {
    running = false; refresh();
  }
};
$("keydet").open = !$("key").value.trim();
// Ask before opening any other website.
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest("a[href]"); if (!a || a.dataset.go) return;
  let u; try { u = new URL(a.href, location.href); } catch (x) { return; }
  if (!/^https?:$/.test(u.protocol) || u.host === location.host) return;
  e.preventDefault();
  if (confirm("This opens " + u.host + " in a new tab. Open it?")) window.open(u.href, "_blank", "noopener,noreferrer");
});
