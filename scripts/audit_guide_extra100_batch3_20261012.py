"""Verify lengths and duplicate safeguards for exactly 100 new disease guides.

This checks published editorial payloads (3 fields per disease) but does NOT
validate individual medical claims against clinical practice guidelines.
"""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent / "content"
rows = []
for batch in range(13, 17):
    payload = json.loads(
        (root / f"disease_guides_extra_{batch}.json").read_text(encoding="utf-8")
    )
    assert payload["part"] == batch
    assert len(payload["records"]) == 25
    rows += payload["records"]

assert len(rows) == len({record["id"] for record in rows}) == 100
totals = [
    sum(len(row[key]) for key in ("overview", "dailyLife", "currentState"))
    for row in rows
]
assert min(totals) >= 150
assert max(totals) <= 700
print(
    f"検証済み：新規{len(rows)}疾患、本文合計{sum(totals)}文字。"
    f" 最短{min(totals)}、最長{max(totals)}、平均{sum(totals)/100:.1f}文字。"
)
