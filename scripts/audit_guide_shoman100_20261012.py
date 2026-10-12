"""Audit length of the 100 additional Japanese articles (Python Unicode len).

Every full-width or half-width character counts as one code point. Only
overview, dailyLife and currentState bodies are counted. Filenames and
metadata are excluded.
"""
from pathlib import Path
import json
root = Path(__file__).resolve().parent.parent / "content"
rows = [
    item
    for n in range(1, 5)
    for item in json.loads(
        (root / f"disease_guides_shoman_{n:02}.json").read_text(encoding="utf-8")
    )["records"]
]
assert len(rows) == 100
assert len({r["id"] for r in rows}) == 100
counts = [sum(len(r[key]) for key in ("overview", "dailyLife", "currentState")) for r in rows]
assert min(counts) >= 125, f"Short disease explanation: {min(counts)}"
total = sum(counts)
print(f"Python検証済み：100疾患 / 本文計{total:,}文字（全角・半角とも1文字）")
print(f"最小{min(counts)}文字、最大{max(counts)}文字、平均{total/100:.2f}文字")
