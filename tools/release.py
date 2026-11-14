#!/usr/bin/env python3
"""Does all the paperwork for a change to index.html, in one command. Run from the repo folder, BEFORE committing:

  python3 tools/release.py --title "Short title" --tag Changed --meaning "One plain sentence." \
      --see "Where to look." --change "First thing" --change "Second thing"

It bumps the version (version.txt, BUILD, STATUS.md), adds the entry to CHANGELOG.md, replaces the patch note, fills in the code link of the previous entry, and runs tests/check.py.
"""
import argparse, datetime, json, re, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("--title", required=True); ap.add_argument("--tag", default="Changed", choices=["New", "Changed", "Fixed", "Removed"])
ap.add_argument("--meaning", required=True); ap.add_argument("--see")
ap.add_argument("--change", action="append"); ap.add_argument("--note")
a = ap.parse_args()

now = datetime.datetime.now(datetime.timezone.utc)
old = open("version.txt", encoding="utf-8").read().strip()
day = max(now.strftime("%Y-%m-%d"), old[:10])   # never go backwards: the owner's local date can be a day ahead of world time
shown = datetime.date.fromisoformat(day).strftime("%d %b %Y").lstrip("0")
m = re.fullmatch(r"(\d+)\.(\d+)\.(\d+)", old)
new = "%s.%s.%d" % (m[1], m[2], int(m[3]) + 1) if m else "1.1.1"   # version is major.minor.patch: every release adds 1 to the last number
head = subprocess.run(["git", "log", "--format=%h", "-1"], capture_output=True, text=True).stdout.strip()
q = lambda t: json.dumps(t, ensure_ascii=False)
REPO = "https://github.com/Ginger-Hermit/Fishing-cat-data/commit/"

def once(s, old_text, new_text, what):
    if s.count(old_text) != 1: sys.exit("release.py: could not find exactly one " + what)
    return s.replace(old_text, new_text)

j = open("app.js", encoding="utf-8").read()
j = once(j, 'const BUILD = "%s";' % old, 'const BUILD = "%s";' % new, "BUILD line")
jl = j.split("\n"); jl[0] = "// Patch note: %s" % (a.note or a.meaning)
open("app.js", "w", encoding="utf-8").write("\n".join(jl))
s = open("index.html", encoding="utf-8").read()
lines = s.split("\n")
if not lines[1].startswith("<!-- Patch note:"): sys.exit("release.py: patch note line not found")
lines[1] = "<!-- Patch note: %s -->" % (a.note or a.meaning)
open("index.html", "w", encoding="utf-8").write("\n".join(lines))
open("version.txt", "w", encoding="utf-8").write(new + "\n")

# CHANGELOG.md, Keep a Changelog layout: one "## [version] - date" heading per version, short lines under Added/Changed/Fixed/Removed.
# The heading links to a compare page (everything between two versions). .github/workflows/release.yml makes the tag and Release.
c = open("CHANGELOG.md", encoding="utf-8").read()
k = c.index("\n## ")
kind = {"New": "🟢 Added", "Changed": "🔵 Changed", "Fixed": "🟠 Fixed", "Removed": "🔴 Removed"}[a.tag]
block = "\n## [%s] - %s · [code](%s/compare/v%s...v%s)\n\n### %s\n\n- **%s** · %s\n" % (new, day, REPO.rsplit("/commit/", 1)[0], old, new, kind, a.title, a.meaning)
open("CHANGELOG.md", "w", encoding="utf-8").write(c[:k] + block + c[k:])

st = open("STATUS.md", encoding="utf-8").read()
st, n = re.subn(r"Page version [\w.-]+", "Page version " + new, st, count=1)
st = re.sub(r"Last updated: [^.]*\.", "Last updated: %s." % shown, st, count=1)
if n != 1: sys.exit("release.py: 'Page version' not found in STATUS.md")
open("STATUS.md", "w", encoding="utf-8").write(st)
print("Version", old, "->", new)
sys.exit(subprocess.run([sys.executable, "-I", "tests/check.py"]).returncode)
