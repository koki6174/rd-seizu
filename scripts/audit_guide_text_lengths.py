"""Count Japanese disease guide characters with Python's Unicode string length.

Uses raw character count (full/halfwidth both count as one character);
excludes ID, sources, headings and JSON formatting from the article total.
"""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent / "content"
records = []
for part in (1, 2):
    records.extend(json.loads(
        (root / f"disease_guides_top50_part{part}.json").read_text(encoding="utf-8")
    )["records"])

assert len(records) == 50
assert len({r["id"] for r in records}) == 50

fields = ("overview", "dailyLife", "currentState")
totals = [
    sum(len(record[field]) for field in fields) for record in records
]
assert min(totals) >= 170, f"Too brief to serve as three-section guide: {min(totals)}"
assert max(totals) <= 450, f"Article exceeded compact display budget: {max(totals)}"

total = sum(totals)
print(f"確認済み：{len(records)}疾患、本文合計{total}文字（全角・半角とも1文字）")
print(f"記事本文文字数の最小{min(totals)}、最大{max(totals)}、平均{total/len(records):.2f}")
