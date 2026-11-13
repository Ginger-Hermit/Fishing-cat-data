"""Posts new Roblox game events to Discord. Run daily by .github/workflows/events.yml.
Reads events/settings.json, remembers posted events in events/seen.json.
First run only records existing events, so old ones never post."""
import json, os, sys, urllib.request
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
UA = {"User-Agent": "game-events-bot/1.0", "Content-Type": "application/json"}

def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.load(r)

def when(s):
    return datetime.fromisoformat(s).strftime("%a %d %b, %H:%M UTC") if s else "not recorded"

def main():
    cfg = json.load(open(os.path.join(HERE, "settings.json")))
    seen_path = os.path.join(HERE, "seen.json")
    seen = json.load(open(seen_path))
    first_run = not seen
    uni = get(f"https://apis.roblox.com/universes/v1/places/{cfg['game']}/universe")["universeId"]
    events = get(f"https://apis.roblox.com/virtual-events/v1/universes/{uni}/virtual-events?limit=25").get("data", [])
    now = datetime.now(timezone.utc)
    hook = os.environ.get("DISCORD_WEBHOOK", "")
    if not first_run and not hook.startswith("https://discord.com/api/webhooks/"):
        sys.exit("No Discord link saved. Add the DISCORD_WEBHOOK secret.")
    posted = 0
    for e in events:
        eid = str(e.get("id"))
        if eid in seen:
            continue
        seen.append(eid)
        end = (e.get("eventTime") or {}).get("endUtc")
        if first_run or (end and datetime.fromisoformat(end) < now) or posted >= cfg["max_posts_a_day"]:
            continue
        t = e.get("eventTime") or {}
        card = {"title": e.get("displayTitle") or e.get("title") or "New event",
                "description": (e.get("displayDescription") or "")[:500],
                "color": int(cfg["colour"].lstrip("#"), 16),
                "url": f"https://www.roblox.com/games/{cfg['game']}",
                "author": {"name": f"New {cfg['game_name']} event"},
                "fields": [{"name": "Starts", "value": when(t.get("startUtc")), "inline": True},
                           {"name": "Ends", "value": when(t.get("endUtc")), "inline": True}]}
        body = json.dumps({"embeds": [card], "allowed_mentions": {"parse": []}}).encode()
        urllib.request.urlopen(urllib.request.Request(hook, body, UA), timeout=30)
        posted += 1
        print("posted:", card["title"])
    json.dump(seen[-500:], open(seen_path, "w"))
    print("first run: saved", len(seen), "old events, posted none" if first_run else f"new posts: {posted}")

main()
