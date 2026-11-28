# UI break test: every tab x phone/tablet/wide x light/dark x normal/big text. Finds sideways scroll, cut-off buttons,
# tiny tap targets, text overflow, page errors. Fast (~20 s). Run: python3 tools/ui_break.py [shots]  (shots = save pictures to /tmp/ui_shots)
import sys, os, asyncio
from playwright.async_api import async_playwright
URL = "file://" + os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html"))
TABS = ["t0", "t1", "t3", "t6", "t4", "t5"]
SIZES = [("phone-s", 320, 568), ("phone", 390, 844), ("phone-sideways", 844, 390), ("tablet", 768, 1024), ("wide", 1600, 900)]
JUNK = "W" * 300 + " " + "😀" * 60 + " \u202eRTL " + "<b>x</b>" * 20
CHECK = """() => {
  const out = [], W = innerWidth;
  if (document.documentElement.scrollWidth > W + 2) out.push("sideways scroll " + (document.documentElement.scrollWidth - W) + "px");
  for (const e of document.querySelectorAll("button,a,input,select,textarea,label,h1,h2,h3,p,td,th")) {
    const r = e.getBoundingClientRect(); if (!r.width || !r.height || e.offsetParent === null) continue;
    const n = (e.id || e.textContent || e.tagName).trim().slice(0, 22);
    if (r.right > W + 2 || r.left < -2) out.push("off-screen: " + n);
    else if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX === "visible" && e.clientWidth > 0 && !e.closest("table,.xl,[class*=scroll]")) out.push("text spills: " + n);
    if (/^(BUTTON|A)$/.test(e.tagName) && (r.height < (e.tagName === "A" ? 24 : 32) || r.width < 24) && e.textContent.trim()) out.push("tiny tap target: " + n + " " + Math.round(r.width) + "x" + Math.round(r.height));
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
                        for m in await pg.evaluate(CHECK): bad.add(f"{sname}/{scheme}/{big}/{t}: {m}{" [after junk]" if not m.startswith("tiny") else ""}")
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
