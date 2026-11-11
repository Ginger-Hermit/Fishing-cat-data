# Auto check for index.html: syntax, eval/exec, missing ids, unused code. Run: python3 -I tests/check.py
import re, subprocess, sys, tempfile, os
s = open("index.html", encoding="utf-8").read()
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
print("\n".join(bad) if bad else "All checks passed")
sys.exit(1 if bad else 0)
