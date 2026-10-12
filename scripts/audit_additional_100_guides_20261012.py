"""Audit 100 Japanese rare disease detailed pages against prior 453 and source crosswalk.
Unicode code points (all full- and half-width characters) are counted with Python len().
The audit checks provenance and consistency; it is NOT a substitute for clinical review.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
DATA = ROOT / "data"

def read(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))

historic_files = [
    *(f"disease_guides_top50_part{i}.json" for i in (1, 2)),
    *(f"disease_guides_extra_{i:02}.json" for i in range(1, 13)),
    "disease_guides_currently_lit_20261011.json",
    *(f"disease_guides_orpha_{i:02}.json" for i in range(1, 5)),
]
new_files = [f"disease_guides_extra_{i:02}.json" for i in range(13, 17)]
historic = [record for name in historic_files for record in read(CONTENT / name)["records"]]
added = [record for name in new_files for record in read(CONTENT / name)["records"]]
source = read(DATA / "guide_candidate_audit_20261012.json")
exclusions = {"nando-48-3", "nando-61-4", "nando-62-3"}
candidates = [r for r in source["candidates"] if r["id"] not in exclusions]
original_ids = [r["id"] for r in historic]
new_ids = [r["id"] for r in added]
assert len(historic) == len(set(original_ids)) == 453
assert len(added) == len(set(new_ids)) == 100
assert len(original_ids + new_ids) == len(set(original_ids + new_ids)) == 553
assert len(candidates) == 100
assert new_ids == [r["id"] for r in candidates], "candidate order / catalog ID mismatch"

all_orpha_codes = [r["orphaCode"] for r in added]
assert len(set(all_orpha_codes)) == 100, "Duplicated ORPHAcode"
old_codes = {r["orphaCode"] for r in historic if r.get("orphaCode")}
assert not old_codes.intersection(all_orpha_codes), "ORPHAcode reused by existing article"

counts = []
no_hpo = 0
for row, src in zip(added, candidates):
    assert row["name"] == src["name"], f"Japanese catalog label mismatch: {src['id']}"
    assert row["orphaCode"] == src["orphaCode"]
    assert row["evidenceHpoCount"] == src["hpo"]
    assert row["reviewStatus"] == "cross_database_sourced_editorial_draft"
    assert row["reviewedAt"] == "2026-10-12"
    assert 1 <= len(row["references"]) <= 2
    for ref in row["references"]:
        url = urlparse(ref["url"])
        assert url.scheme == "https" and url.hostname == "www.orpha.net"
        assert re.match(r"^/en/disease/(detail|sign)/[0-9]+$", url.path)
        assert url.path.endswith("/" + str(row["orphaCode"]))
    if src["hpo"] == 0:
        no_hpo += 1
        assert len(row["references"]) == 1, "Cannot invent disease-specific HPO annotations"
    else:
        assert len(row["references"]) == 2
    text_fields = [row[k] for k in ("overview", "dailyLife", "currentState")]
    assert all(isinstance(t, str) and len(t) >= 35 for t in text_fields), row["id"]
    assert not any(re.search(r"余命は[0-9]+|生存率は[0-9]+|絶対に治る|必ず発症", t)
                   for t in text_fields), row["id"]
    counts.append(sum(len(t) for t in text_fields))

loader = (CONTENT / "disease-guides.js").read_text(encoding="utf-8")
assert "map.size!==553" in loader
for name in new_files:
    assert "'" + name + "'" in loader, f"Loader missing {name}"
assert not any(phrase in loader.lower() for phrase in ("private_key", "service_role"))
assert source["existing"] == 453
assert source["availableSourceCandidates"] == 103

print(f"確認済み：新規{len(added)}疾患／既存{len(historic)}疾患／合計{len(added) + len(historic)}疾患")
print(f"Python文字数検証済：新規100疾患の3本文合計{sum(counts)}文字（全角・半角とも各1文字）")
print(f"本文長：最小{min(counts)}文字、最大{max(counts)}文字、平均{sum(counts)/len(counts):.1f}文字")
print(f"HPO注釈あり：{len(added)-no_hpo}件／個別HPO注釈未取得：{no_hpo}件")
print("安全性：ID/ORPHA重複なし、疾患名一致、既存453件を保持、出典ホスト検証済み")
print("臨床的な注意：医師・独立専門家による各本文の査読を実施した証明ではありません")
