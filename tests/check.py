# Auto check for index.html: syntax, eval/exec, missing ids, unused code, risky patterns (zip bomb, no timeout, Discord escaping). Run: python3 -I tests/check.py
import re, subprocess, sys, tempfile, os
s = open("index.html", encoding="utf-8").read() + "<style>" + open("style.css", encoding="utf-8").read() + "</style><script>" + open("app.js", encoding="utf-8").read() + "</script>"
if re.search(r"<script(?![^>]*src)|<style|\sstyle=\"", open("index.html", encoding="utf-8").read()): print("FAIL code or style inside index.html; it belongs in app.js or style.css") or sys.exit(1)
bad = []
js = "\n".join(re.findall(r'<script(?![^>]*src)[^>]*>([\s\S]*?)</script>', s))
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
    f.write(js)
r = subprocess.run(["node", "--check", f.name], capture_output=True, text=True)
os.unlink(f.name)
if r.returncode: bad.append("Syntax error: " + r.stderr.strip()[:300])
if re.search(r'\b(eval|exec)\s*\(', s): bad.append("Found eval( or exec(")
ids = set(re.findall(r'\bid="([^"]+)"', s))
IDS_MADE_BY_CODE = {"pv"}  # created inside the recording pop-up
for i in sorted(set(re.findall(r'\$\("([^"]+)"\)', s)) - ids - IDS_MADE_BY_CODE):
    bad.append('Missing id: ' + i)
for n in sorted(set(re.findall(r'(?:function|const|let|var)\s+([A-Za-z_$][\w$]*)', s))):
    if len(re.findall(r'(?<![\w$.])' + re.escape(n) + r'(?![\w$])', s)) <= 1:
        bad.append("Unused code (delete it): " + n)
# Risky-pattern scan: known bug shapes. A safe line that trips it goes in SAFE (a unique bit of that line).
SAFE = ['innerHTML = list.map(x => `<button class="tab', 'localStorage.setItem("fcd_prev"', 'JSON.parse(localStorage.getItem("fcd_prev"))',
        'localStorage.setItem("fcd_art"', 'blk("+", fresh.slice(0, 30).map((x) => x.name', '(b.billDate ? " \\u00b7 " + dcMd(b.billDate)']
hdr = open("_headers", encoding="utf-8").read()
for i, l in enumerate(s.split("\n"), 1):
    if any(k in l for k in SAFE): continue
    w = "Line %d: " % i
    if ".xlsx.load(" in l and "zipCheck(" not in l: bad.append(w + "Excel file opened without zipCheck (zip bomb)")
    if re.search(r'<=?\s*[\w.]+\.(rowCount|columnCount|actualRowCount)\b', l): bad.append(w + "loop over row/column count without a Math.min cap")
    if re.search(r'\bfetch\(', l) and "signal" not in l and "function postJson" not in l: bad.append(w + "fetch without a time limit (signal)")
    if re.search(r'innerHTML\s*[+]?=\s*[^;]*(\+|\$\{)', l): bad.append(w + "innerHTML built from variables")
    if re.search(r'localStorage\.(get|set)Item', l) and "try" not in l: bad.append(w + "saved setting used without try")
    if re.search(r'"(\*\*|##|\\n-#|\\n\*\*|\\n###)', l):
        for m in re.finditer(r'[\w\]]+\.(name|supplier|clan|game|role|billDate|currency)\b|\bg\[0\]', l):
            if not re.search(r'(dcMd|dcCode|clean|nameOf|tidy)\(\s*$', l[:m.start()]): bad.append(w + "Discord text without dcMd: " + m.group(0))
for h in sorted(set(re.findall(r'(?:postJson|fetch)\(\s*"https://([^/"]+)', s))):
    if h not in hdr: bad.append("Website not in _headers connect-src: " + h)
print("\n".join(bad) if bad else "All checks passed")
sys.exit(1 if bad else 0)
