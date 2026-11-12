# Patch note: builds the wiki pages from the repo docs. Run by .github/workflows/wiki.yml with the wiki folder as the argument.
import re, sys, shutil
W = sys.argv[1]
REPO = "https://github.com/Ginger-Hermit/Fishing-cat-data/blob/main/"
RAW = "https://raw.githubusercontent.com/Ginger-Hermit/Fishing-cat-data/main/"
LINKS = {"CHANGELOG.md": "Changelog", "STATUS.md": "Status", "README.md": "Home",
         "developer/HOW_IT_WAS_BUILT.md": "How-it-was-built", "developer/STRESS_TEST_LOG.md": "Stress-test-log",
         "developer/SECURITY.md": "Security", "developer/FAQ.md": "FAQ", "CLAUDE.md": "AI-rules"}
def fix(t):
    def f(m):
        u = m.group(1)
        if re.match(r'(https?:|#|mailto:)', u) or not re.search(r'[./]', u): return m.group(0)
        if re.search(r'\.(png|jpe?g|gif)$', u): return "](" + RAW + u + ")"
        return "](" + (LINKS.get(u) or REPO + u) + ")"
    return re.sub(r'\]\(([^)]+)\)', f, t)
def put(name, text): open(f"{W}/{name}.md", "w").write(fix(text).rstrip("\n") + "\n")
def whole(src, name): put(name, open(src).read())
def sections(src):
    parts = re.split(r'(?m)^(?=## )', open(src).read())
    return {p.split("\n", 1)[0][3:].strip(): p.split("\n", 1)[1] for p in parts[1:]}
def block(src, head):
    m = re.search(r'(?m)^## ' + re.escape(head) + r'\n(.*?)(?=^## |\Z)', open(src).read(), re.S)
    return m.group(1).strip() if m else ""
def latest(n=3):
    L = open("CHANGELOG.md").read().split("\n"); out = []
    for i, l in enumerate(L):
        if re.match(r'^\d+ \w+ 20\d\d .*\u00b7 (New|Changed)', l):
            nxt = next((x for x in L[i + 1:] if x.strip()), "")
            out.append("- **" + l.split(" (")[0] + ":** " + nxt)
        if len(out) == n: break
    return "\n".join(out)
home = open("developer/WIKI_HOME.md").read()
status = "**Next**\n" + block("STATUS.md", "Next") + "\n\n**Not tested yet**\n" + block("STATUS.md", "Not tested")
put("Home", home.replace("{{STATUS}}", status).replace("{{LATEST}}", latest()))
whole("STATUS.md", "Status"); whole("CHANGELOG.md", "Changelog")
whole("developer/HOW_IT_WAS_BUILT.md", "How-it-was-built"); whole("developer/STRESS_TEST_LOG.md", "Stress-test-log")
whole("developer/SECURITY.md", "Security"); whole("developer/FAQ.md", "FAQ")
put("AI-rules", "# Rules for the AI\n\nThe rules the AI follows on every change.\n" + open("CLAUDE.md").read().split("\n", 1)[1].replace("@STATUS.md\n", ""))
R = {"How to use it": "How-to-use", "What you get": "What-you-get", "Features": "Features", "Privacy": "Privacy",
     "Known limits": "Known-limits", "Licence": "Licence", "For developers": "For-developers",
     "Tests (for developers, optional)": "Tests", "Read the code (quick guide)": "Read-the-code"}
for h, body in sections("README.md").items():
    if h in R and h != "Licence": put(R[h], "# " + h + "\n" + body)
put("Licence", "# Licence\n\n" + open("LICENSE").read())
S = {"What broke": "What-broke", "Lessons for future projects": "Lessons-learnt", "A checklist to copy into the next project": "Project-checklist"}
for h, body in sections("developer/STRESS_TEST_LOG.md").items():
    name = re.sub(r'^\d+\.\s*', '', h)
    if name in S: put(S[name], "# " + name + "\n" + body)
open(f"{W}/_Sidebar.md", "w").write("""**Pages**

- [Home](Home)
- [Status](Status)
- [Changelog](Changelog)

**Using it**

- [How to use it](How-to-use)
- [What you get](What-you-get)
- [Features](Features)
- [Privacy](Privacy)
- [Security](Security)
- [Known limits](Known-limits)
- [FAQ](FAQ)
- [Licence](Licence)

**Developers**

- [For developers](For-developers)
- [Read the code](Read-the-code)
- [Tests](Tests)
- [AI rules](AI-rules)
- [How it was built](How-it-was-built)
- [Stress test log](Stress-test-log)
- [What broke](What-broke)
- [Lessons learnt](Lessons-learnt)
- [Project checklist](Project-checklist)
""")
