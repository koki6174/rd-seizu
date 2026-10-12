"""Audit Unicode character count and coverage of new 100 disease detail guides."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "content"
articles = []
for i in range(5, 9):
    articles += json.loads(
        (root / f"disease_guides_orpha_{i:02d}.json").read_text(encoding="utf-8")
    )["records"]

assert len(articles) == 100
assert len({x["id"] for x in articles}) == 100
fields = ("overview", "dailyLife", "currentState")
lengths = [sum(len(x[k]) for k in fields) for x in articles]
sections = [len(x[k]) for x in articles for k in fields]
assert min(sections) >= 35
assert min(lengths) >= 130
print(f"追加100疾患の本文：{sum(lengths):,}文字、平均{sum(lengths)/100:.1f}文字/疾患")
print(f"本文の最小{min(lengths)}文字、最大{max(lengths)}文字（Python len）")
