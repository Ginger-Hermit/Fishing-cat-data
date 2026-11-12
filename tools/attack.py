#!/usr/bin/env python3
"""Break-test helper for the Discord and Excel parts. Pretend Discord, no real network, about 15 seconds.
Run all:   python3 -I tools/attack.py
Narrow:    python3 -I tools/attack.py post        (groups: ping post excel secrets names role)
Prints one line per check and a one-line verdict, so the output stays tiny.
To add a check: write one chk(...) call inside a group below."""
import os, sys, json
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKEN = "abc-def_ghi"
URL = "https://discord.com/api/webhooks/123456789012345678/" + TOKEN
CORS = {"access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*"}
T = "## Clan\n-# x\n### What changed\nbody"
CALL = "async t=>{try{await dcPost(t);return 'ok'}catch(e){return e.message}}"
st = {"n": 0, "mode": "ok", "bodies": []}
out = []

def route(r):
    if r.request.method == "OPTIONS": return r.fulfill(status=204, headers=CORS)
    st["n"] += 1; n, m, code = st["n"], st["mode"], 200
    try: st["bodies"].append(json.loads(r.request.post_data or "{}"))
    except Exception: pass
    if m == "429second" and n == 2: code = 429
    if m == "failsecond" and n >= 2: code = 500
    if m == "all429": code = 429
    r.fulfill(status=code, headers=CORS, body="{}", content_type="application/json")

def chk(name, ok, info=""):
    out.append(ok); print(("PASS " if ok else "FAIL ") + name + ("" if ok else "  -> " + str(info)[:160]))

def fresh(pg, mode="ok"):
    st.update(n=0, mode=mode, bodies=[])

def g_ping(pg):
    chk("no @everyone or @here option", pg.evaluate("![...document.getElementById('dcping').options].some(o=>/everyone|here/.test(o.value))"))
    pg.evaluate("localStorage.setItem('fcd_pingmode','everyone')"); pg.reload(); pg.wait_for_timeout(300)
    v = pg.evaluate("[document.getElementById('dcping').value, localStorage.getItem('fcd_pingmode')]")
    chk("@everyone is not remembered", v == ["", None], v)
    pg.evaluate("localStorage.setItem('fcd_pingmode','here')"); pg.reload(); pg.wait_for_timeout(300)
    chk("@here is not remembered", pg.evaluate("document.getElementById('dcping').value") == "")
    pg.evaluate("localStorage.setItem('fcd_pingmode','role')"); pg.reload(); pg.wait_for_timeout(300)
    chk("role ping is remembered", pg.evaluate("document.getElementById('dcping').value") == "role")
    pg.evaluate("localStorage.removeItem('fcd_pingmode')"); pg.reload(); pg.wait_for_timeout(300)

def g_post(pg):
    pg.evaluate("u=>{hookNow=u}", URL)
    fresh(pg); r = pg.evaluate("async t=>{const x=await Promise.allSettled([dcPost(t),dcPost(t)]);return x.map(y=>y.status+':'+(y.reason&&y.reason.message||''))}", T)
    chk("double tap posts once", r[0].startswith("fulfilled") and "Already posting" in r[1] and st["n"] == 2, (r, st["n"]))
    fresh(pg, "429second"); r = pg.evaluate(CALL, T)
    chk("429 on message 2 is retried", r == "ok" and st["n"] == 3, (r, st["n"]))
    fresh(pg, "failsecond"); r = pg.evaluate(CALL, T)
    chk("half post says so", r.startswith("The picture posted, but the breakdown did not"), r)
    fresh(pg, "all429"); r = pg.evaluate(CALL, T)
    chk("all 429 gives a plain error", "Discord" in r and "TypeError" not in r, r)
    fresh(pg); r = pg.evaluate(CALL, T)
    chk("posting works again after failures", r == "ok", r)
    pg.evaluate("hookNow=''"); r = pg.evaluate(CALL, T)
    chk("no link gives a plain error", "link" in r.lower(), r)
    pg.evaluate("u=>{hookNow=u}", URL)
    r = pg.evaluate("async()=>{try{await dcPost('## C\\n### x\\n'+'line\\n'.repeat(900));return 'ok'}catch(e){return e.message}}")
    chk("very long breakdown is cut, not failed", r == "ok", r)

def g_excel(pg):
    for name, expr in [("6 MB file refused", "new ArrayBuffer(6e6)"), ("empty file refused", "new ArrayBuffer(0)"), ("random bytes refused", "new Uint8Array(2000).map((_,i)=>i*7%256).buffer")]:
        r = pg.evaluate("async()=>{try{await readSheet(" + expr + ");return 'ok'}catch(e){return e.message}}")
        chk(name, r != "ok", r)  # the Post button wraps this in a plain message

def g_secrets(pg):
    pg.evaluate("u=>{hookNow=u}", URL); fresh(pg); pg.evaluate(CALL, T)
    pg.evaluate("document.getElementById('logbox')&&0")
    txt = pg.evaluate("document.body.innerText")
    chk("webhook link not shown in the Log", TOKEN not in txt)
    rep = pg.evaluate("typeof bugText==='function'?bugText():''") if pg.evaluate("typeof bugText") == "function" else ""
    chk("webhook link not in bug report", TOKEN not in rep)


NASTY = ["@everyone", "@here", "<@&999999999999999999>", "[click me](http://evil.example)", "```evil```", "x" * 3000, "_under_score_", "**bold**"]
def g_names(pg):
    pg.evaluate("u=>{hookNow=u}", URL); pg.evaluate("document.getElementById('dcping').value=''")
    fresh(pg)
    js = "async a=>{const f=n=>Math.round(n).toLocaleString('en-US');const sh={clan:'Clan',game:'Game',date:'12 Nov',any:true,items:a.map((x,i)=>({rk:i+1,name:x,role:'@here',n:100+i,b:50,points:'100'}))};try{await dcPost(dcBreakdown(sh,f));return 'ok'}catch(e){return e.message}}"
    r = pg.evaluate(js, NASTY)
    chk("nasty names still post", r == "ok", r)
    ok = all(b.get("allowed_mentions", {}).get("parse") == [] and b.get("allowed_mentions", {}).get("roles") == [] for b in st["bodies"])
    chk("nasty names can't ping anyone", ok and len(st["bodies"]) >= 1, [b.get("allowed_mentions") for b in st["bodies"]])
    chk("every message is under 2000 characters", all(len(b.get("content", "")) <= 2000 for b in st["bodies"]), [len(b.get("content", "")) for b in st["bodies"]])
    fresh(pg); big = ["Player%d" % i for i in range(200)]
    r = pg.evaluate(js, big)
    chk("200-player clan posts, messages under 2000", r == "ok" and all(len(b.get("content", "")) <= 2000 for b in st["bodies"]), (r, [len(b.get("content", "")) for b in st["bodies"]]))

def g_role(pg):
    pg.evaluate("u=>{hookNow=u}", URL)
    pg.evaluate("()=>{const s=document.getElementById('dcping');s.value='role';document.getElementById('dcrole').value='abc'}")
    fresh(pg); r = pg.evaluate(CALL, T)
    chk("bad role id is refused, nothing sent", "role ID" in r and st["n"] == 0, (r, st["n"]))
    pg.evaluate("document.getElementById('dcrole').value='<@&123456789012345678>'")
    fresh(pg); r = pg.evaluate(CALL, T)
    first, second = (st["bodies"] + [{}, {}])[:2]
    chk("role ping goes on the first message only", r == "ok" and first.get("content", "").startswith("<@&123456789012345678>") and not second.get("content", "").startswith("<@&") and first["allowed_mentions"]["roles"] == ["123456789012345678"] and second["allowed_mentions"]["roles"] == [], (r, first.get("allowed_mentions"), second.get("allowed_mentions")))
    pg.evaluate("document.getElementById('dcping').value=''")

GROUPS = {"ping": g_ping, "post": g_post, "excel": g_excel, "secrets": g_secrets, "names": g_names, "role": g_role}
want = sys.argv[1:] or list(GROUPS)
bad = [w for w in want if w not in GROUPS]
if bad: sys.exit("Unknown group: %s. Use: %s" % (", ".join(bad), " ".join(GROUPS)))
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)[:100])); pg.route("https://discord.com/**", route)
    pg.goto("file://" + os.path.join(ROOT, "index.html")); pg.wait_for_timeout(400)
    for w in want: GROUPS[w](pg)
    chk("no page errors", not errs, errs); b.close()
print(("FAILED " if not all(out) else "ALL PASS ") + "%d/%d" % (sum(out), len(out)))
sys.exit(0 if all(out) else 1)
