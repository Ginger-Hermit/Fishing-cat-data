# UI break test: every tab x phone/tablet/wide x light/dark x normal/big text. Finds sideways scroll, cut-off buttons,
# tiny tap targets, text overflow, page errors. Fast (~20 s). Run: python3 tools/ui_break.py [shots]  (shots = save pictures to /tmp/ui_shots)
import sys, os, re, asyncio
from playwright.async_api import async_playwright
URL = "file://" + os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html"))
TABS = ["t0", "t1", "t3", "t6", "t4", "t5"]
SIZES = [("phone-s", 320, 568), ("phone", 390, 844), ("phone-sideways", 844, 390), ("tablet", 768, 1024), ("wide", 1600, 900)]
JUNK = "W" * 300 + " " + "😀" * 60 + " \u202eRTL " + "<b>x</b>" * 20
CHECK = r"""() => {
  const out = [], W = innerWidth;
  if (document.documentElement.scrollWidth > W + 2) out.push("sideways scroll " + (document.documentElement.scrollWidth - W) + "px");
  for (const e of document.querySelectorAll("button,a,input,select,textarea,label,h1,h2,h3,p,td,th")) {
    const r = e.getBoundingClientRect(); if (!r.width || !r.height || e.offsetParent === null) continue;
    const n = (e.id || e.textContent || e.tagName).trim().slice(0, 22);
    if (r.right > W + 2 || r.left < -2) out.push("off-screen: " + n);
    else if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX === "visible" && e.clientWidth > 0 && !e.closest("table,.xl,[class*=scroll]")) out.push("text spills: " + n);
    if (/^(BUTTON|A)$/.test(e.tagName) && (r.height < (e.tagName === "A" ? 24 : 32) || r.width < 24) && e.textContent.trim()) out.push("tiny tap target: " + n + " " + Math.round(r.width) + "x" + Math.round(r.height));
  }
  // low contrast text (WCAG AA 4.5, large 3)
  const lum = c => { const [r,g,b] = c.map(v => { v/=255; return v<=.03928 ? v/12.92 : Math.pow((v+.055)/1.055,2.4); }); return .2126*r+.7152*g+.0722*b; };
  const rgba = s => (s.match(/[\d.]+/g) || []).map(Number);
  const bgOf = e => { for (let x = e; x; x = x.parentElement) { const c = rgba(getComputedStyle(x).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] > .9)) return c; } return [255,255,255]; };
  const seen = new Set();
  for (const e of document.querySelectorAll("button,a,label,h1,h2,h3,p,li,td,th,span,summary")) {
    if (e.offsetParent === null || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const st = getComputedStyle(e), fg = rgba(st.color); if (fg.length < 3 || (fg.length > 3 && fg[3] < .5)) continue;
    const a = lum(fg), b = lum(bgOf(e)), ratio = (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    const big = parseFloat(st.fontSize) >= 24 || (parseFloat(st.fontSize) >= 18.6 && +st.fontWeight >= 700);
    const n = (e.id || e.textContent).trim().slice(0, 22);
    if (ratio < (big ? 3 : 4.5) && !seen.has(n) && !e.disabled) { seen.add(n); out.push("low contrast " + ratio.toFixed(1) + ": " + n); }
  }
  // text clipped by its own box, and tap targets covered by something else
  for (const e of document.querySelectorAll("button,a,input,select,label,h1,h2,h3,p,li,td,th")) {
    if (e.offsetParent === null) continue;
    const st = getComputedStyle(e), n = (e.id || e.textContent || e.tagName).trim().slice(0, 22);
    if (/hidden|clip/.test(st.overflowY) && e.scrollHeight > e.clientHeight + 3 && e.clientHeight > 0 && e.tagName !== "SELECT") out.push("text clipped: " + n);
    if (/^(BUTTON|A|INPUT|SELECT)$/.test(e.tagName)) {
      const r = e.getBoundingClientRect(); if (r.width < 1 || r.bottom < 0 || r.top > innerHeight) continue;
      const top = document.elementFromPoint(Math.min(Math.max(r.left + r.width/2, 0), innerWidth-1), Math.min(Math.max(r.top + r.height/2, 0), innerHeight-1));
      if (top && top !== e && !e.contains(top) && !top.contains(e) && (/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(top.tagName) || /fixed|absolute/.test(getComputedStyle(top).position))) out.push("covered by " + (top.id || top.tagName) + ": " + n);
    }
  }
  return out;
}"""
async def main():
    shots = len(sys.argv) > 1 and sys.argv[1] == "shots"
    if shots: os.makedirs("/tmp/ui_shots", exist_ok=True)
    bad = set(); n = 0
    async with async_playwright() as p:
        exe = "/opt/pw-browsers/chromium"; b = await p.chromium.launch(args=["--no-sandbox"], **({"executable_path": exe} if os.path.exists(exe) else {}))
        for sname, w, h in SIZES:
            for scheme in ("light", "dark"):
                c = await b.new_context(viewport={"width": w, "height": h}, color_scheme=scheme)
                pg = await c.new_page(); errs = []
                pg.on("pageerror", lambda e: errs.append(str(e)[:80])); pg.on("console", lambda m: errs.append("console: " + m.text[:80]) if m.type == "error" else None)
                await pg.goto(URL)
                for big, px in (("normal", "16px"), ("big", "28px")):
                    await pg.evaluate(f"document.documentElement.style.fontSize='{px}'")
                    for t in TABS:
                        await pg.evaluate(f"document.getElementById('{t}').click()")
                        n += 1
                        for m in await pg.evaluate(CHECK): bad.add(f"{sname}/{scheme}/{big}/{t}: {m}")
                        if shots and big == "big" and scheme == "dark": await pg.screenshot(path=f"/tmp/ui_shots/{sname}-{t}.png")
                    # press every visible enabled button once with nothing loaded
                    for i in range(await pg.locator("button:visible").count()):
                        try: await pg.locator("button:visible").nth(i).click(timeout=200, no_wait_after=True)
                        except Exception: pass
                    # junk in every box, mash tabs fast, keyboard walk
                    await pg.evaluate("(J)=>document.querySelectorAll('input[type=text],input[type=password],input:not([type]),textarea').forEach(e=>{e.value=J;e.dispatchEvent(new Event('input',{bubbles:true}))})", JUNK)
                    for i in range(40): await pg.evaluate(f"document.getElementById('{TABS[i % 6]}').click()")
                    for t in TABS:
                        await pg.evaluate(f"document.getElementById('{t}').click()")
                        for m in await pg.evaluate(CHECK): bad.add(f"{sname}/{scheme}/{big}/{t}: {m}{" [after junk]" if re.match("sideways|off-screen|text", m) else ""}")
                        for _ in range(12):
                            await pg.keyboard.press("Tab")
                            f = await pg.evaluate("()=>{const e=document.activeElement;if(!e||e===document.body)return null;const r=e.getBoundingClientRect();const o=getComputedStyle(e);return {n:(e.id||e.textContent||e.tagName).trim().slice(0,20),off:r.width>0&&(r.right<0||r.left>innerWidth),ring:o.outlineStyle!=='none'||o.boxShadow!=='none'}}")
                            if f and f["off"]: bad.add(f"{sname}/{scheme}/{big}/{t}: keyboard focus off-screen: {f['n']}")
                for e in errs: bad.add(f"{sname}/{scheme}: PAGE ERROR {e}")
                await c.close()
        await b.close()
    print(f"{n} screens checked")
    uniq = {}
    for m in bad:
        cfg, msg = m.split(": ", 1); uniq.setdefault((cfg.split("/")[-1] if "PAGE" not in m else "", msg), []).append(cfg)
    for (tab, msg), cfgs in sorted(uniq.items()): print("PROBLEM", tab, msg, f"({len(cfgs)} of {len(SIZES)*4} setups)")
    print("UI ALL OK" if not bad else f"{len(uniq)} different problems")
asyncio.run(main())
