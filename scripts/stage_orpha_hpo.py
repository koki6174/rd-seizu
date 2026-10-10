#!/usr/bin/env python3
"""Stage Orphadata/HPO mappings without publishing unverified disease identities.

File: scripts/stage_orpha_hpo.py
Run: python scripts/stage_orpha_hpo.py --output /tmp/orpha-review
Prerequisites: Python 3.11+, network, mapping snapshot in data/.

An exact English string match is only a candidate; it is NOT an approved
ORPHA crosswalk. Medical phenotype rows are keyed by ORPHA IDs and held
separately until review. This script never touches the live Supabase DB.
"""
from __future__ import annotations

import argparse
import collections
import csv
import hashlib
import json
import re
import time
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

URLS = {
    "orpha_alignments": "https://www.orphadata.com/data/xml/en_product1.xml",
    "orpha_phenotypes": "https://www.orphadata.com/data/xml/en_product4.xml",
    "hpo_annotations": "https://github.com/obophenotype/human-phenotype-ontology/releases/latest/download/phenotype.hpoa",
}
RELEASE = "2026-07 Orphadata; HPO latest at execution"
OUTPUT_COLUMNS = ["disease_id", "name_ja", "name_en", "orpha_code",
                  "orpha_name_en", "match_basis", "review_status",
                  "orpha_hpo_terms", "hpo_positive_terms", "orpha_synonym_match"]

def namekey(value: str) -> str:
    # Do not discard disease type numbers, inheritance or subtype qualifiers.
    value = unicodedata.normalize("NFKC", value or "").lower().strip()
    value = re.sub(r"\s+", " ", value)
    return value.strip(" .")

def tag(element: ET.Element) -> str:
    return element.tag.rsplit("}", 1)[-1]

def child(element: ET.Element | None, target: str) -> ET.Element | None:
    if element is None:
        return None
    return next((v for v in element if tag(v) == target), None)

def text_child(element: ET.Element | None, target: str) -> str:
    part = child(element, target)
    return (part.text or "").strip() if part is not None else ""

def nested(element: ET.Element, *parts: str) -> ET.Element | None:
    for part in parts:
        element = child(element, part)
        if element is None:
            return None
    return element

def get_file(url: str, dest: Path) -> str:
    if dest.exists() and dest.stat().st_size > 20000:
        return hashlib.sha256(dest.read_bytes()).hexdigest()
    error = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "NENONE-research-etl/1.0"})
            with urllib.request.urlopen(req, timeout=180) as stream, dest.open("wb") as f:
                while True:
                    block = stream.read(1024 * 512)
                    if not block:
                        break
                    f.write(block)
            if dest.stat().st_size < 20000:
                raise ValueError(f"Unexpectedly small official download: {url}")
            return hashlib.sha256(dest.read_bytes()).hexdigest()
        except Exception as exc:
            error = exc
            dest.unlink(missing_ok=True)
            time.sleep(3 * (attempt + 1))
    raise RuntimeError(f"Could not download {url}: {error}")

def parse_orpha_alignments(path: Path) -> dict[str, dict]:
    entries = {}
    for _, node in ET.iterparse(path, events=("end",)):
        if tag(node) != "Disorder":
            continue
        code = text_child(node, "OrphaCode") or text_child(node, "Orphacode")
        name = text_child(node, "Name")
        if not code.isdigit() or not name:
            node.clear()
            continue
        synonyms = set()
        syn_list = child(node, "SynonymList")
        if syn_list is not None:
            for synonym in syn_list:
                if tag(synonym) == "Synonym" and synonym.text:
                    synonyms.add(synonym.text.strip())
        kind_node = child(node, "DisorderGroup")
        kind = text_child(kind_node, "Name")
        # Additional xrefs are retained only for future review, not automatic merge.
        xrefs = collections.defaultdict(set)
        ref_list = child(node, "ExternalReferenceList")
        if ref_list is not None:
            for xref in ref_list:
                if tag(xref) != "ExternalReference":
                    continue
                source, reference = text_child(xref, "Source"), text_child(xref, "Reference")
                if source and reference:
                    xrefs[source].add(reference)
        entries[code] = {
            "name": name, "synonyms": sorted(synonyms),
            "category": kind,
            "xrefs": {k: sorted(v) for k, v in xrefs.items()},
        }
        node.clear()
    if len(entries) < 5000:
        raise ValueError(f"Orphadata: too few parsed disorders ({len(entries)})")
    return entries

def parse_orpha_hpo(path: Path) -> dict[str, dict]:
    by_orpha = {}
    for _, node in ET.iterparse(path, events=("end",)):
        if tag(node) != "Disorder":
            continue
        code = text_child(node, "OrphaCode") or text_child(node, "Orphacode")
        if not code.isdigit():
            node.clear()
            continue
        terms = set()
        hpo_assoc = child(node, "HPODisorderAssociationList")
        if hpo_assoc is not None:
            for assoc in hpo_assoc:
                if tag(assoc) != "HPODisorderAssociation":
                    continue
                hpo = child(assoc, "HPO")
                hp_id = text_child(hpo, "HPOId")
                if re.fullmatch(r"HP:\d{7}", hp_id):
                    terms.add(hp_id)
        by_orpha[code] = {"terms": sorted(terms), "count": len(terms)}
        node.clear()
    if len(by_orpha) < 1000:
        raise ValueError(f"Orphadata: too few disease-phenotype records ({len(by_orpha)})")
    return by_orpha

def parse_hpoa(path: Path) -> tuple[dict[str, set[str]], int, int]:
    # HPO documentation notes OMIM-based IEA annotations have reuse restrictions.
    # Only directly traceable non-IEA annotations with ORPHA IDs are included.
    positives = collections.defaultdict(set)
    considered = 0
    excluded = 0
    with path.open(encoding="utf-8-sig", errors="replace") as file:
        reader = csv.reader((line for line in file if not line.startswith("#")), delimiter="\t")
        for row in reader:
            if len(row) < 11 or row[0] in ("database_id", "DatabaseID"):
                continue
            if not re.fullmatch(r"(ORPHA|ORPHANET):\d+", row[0], re.I):
                continue
            considered += 1
            qualifier, hp_id, reference, evidence = row[2], row[3], row[4], row[5]
            if (qualifier == "NOT" or row[10] != "P" or evidence.upper() == "IEA" or
                    reference.upper().startswith(("OMIM:", "MIM:")):
                excluded += 1
                continue
            if re.fullmatch(r"HP:\d{7}", hp_id):
                positives[row[0].split(":")[1]].add(hp_id)
    if considered < 1000:
        raise ValueError(f"HPOA seems malformed or contains too few ORPHA records ({considered})")
    return positives, considered, excluded

def generate_candidates(catalog: list[dict], nomenclature: dict,
                        orpha_hpo: dict, hpoa: dict) -> tuple[list[dict], dict]:
    labels = collections.defaultdict(set)
    synonyms = collections.defaultdict(set)
    for code, item in nomenclature.items():
        labels[namekey(item["name"])].add(code)
        for word in item["synonyms"]:
            synonyms[namekey(word)].add(code)
    candidates, unmatched = [], []
    for row in catalog:
        # Search only English labels and Latin-script aliases.
        words = [row.get("name_en") or ""]
        words += [s for s in (row.get("aliases") or []) if re.search(r"[a-zA-Z]{3}", s)]
        hits = collections.defaultdict(set)
        for term in words:
            k = namekey(term)
            if len(k) < 6:
                continue
            for code in labels.get(k, []):
                hits[code].add("exact_preferred_english")
            for code in synonyms.get(k, []):
                hits[code].add("exact_english_synonym")
        if not hits:
            unmatched.append(row["id"])
            continue
        for code, reason in hits.items():
            typ = "unique_exact_english" if len(hits) == 1 and (
                "exact_preferred_english" in reason) else "review_required"
            candidates.append({
                "disease_id": row["id"],
                "name_ja": row.get("name_ja", ""),
                "name_en": row.get("name_en", ""),
                "orpha_code": code,
                "orpha_name_en": nomenclature[code]["name"],
                "match_basis": typ,
                "review_status": "pending",
                "orpha_hpo_terms": orpha_hpo.get(code, {}).get("count", 0),
                "hpo_positive_terms": len(hpoa.get(code, set())),
                "orpha_synonym_match": "exact_english_synonym" in reason,
            })
    summary = {
        "total_catalog": len(catalog),
        "catalog_with_english": sum(bool(x.get("name_en")) for x in catalog),
        "orpha_disorders": len(nomenclature),
        "orpha_disorders_with_phenotypes": len(orpha_hpo),
        "matched_catalog": len(set(c["disease_id"] for c in candidates)),
        "multiple_candidates_diseases": sum(
            n > 1 for n in collections.Counter(c["disease_id"] for c in candidates).values()),
        "candidate_pairs": len(candidates),
        "unique_exact_english_candidates": sum(c["match_basis"] == "unique_exact_english" for c in candidates),
        "approved_pairs": 0,
        "unmatched_catalog": len(unmatched),
        "unmatched_ids": unmatched,
        "note": "No candidate is automatically approved. Parent diseases vs subtypes need clinical concept review."
    }
    return candidates, summary

def run() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="out/orpha-hpo")
    parser.add_argument("--skip-download", action="store_true")
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    cache = output / "raw"
    cache.mkdir(exist_ok=True)
    source_hashes = {}
    for kind, url in URLS.items():
        filename = cache / ("phenotype.hpoa" if kind == "hpo_annotations" else
                            ("en_product1.xml" if kind == "orpha_alignments" else "en_product4.xml"))
        if args.skip_download:
            if not filename.exists():
                raise FileNotFoundError(filename)
            source_hashes[kind] = hashlib.sha256(filename.read_bytes()).hexdigest()
        else:
            source_hashes[kind] = get_file(url, filename)
    cat_data = json.loads(Path("data/orpha_mapping_catalog.json").read_text("utf-8"))
    catalog = cat_data["catalog"]
    assert len(catalog) == 1241
    nomenclature = parse_orpha_alignments(cache / "en_product1.xml")
    orpha_hpo = parse_orpha_hpo(cache / "en_product4.xml")
    hpoa, seen, omitted = parse_hpoa(cache / "phenotype.hpoa")
    candidates, report = generate_candidates(catalog, nomenclature, orpha_hpo, hpoa)
    report.update({"source_urls": URLS, "source_sha256": source_hashes,
                   "hpo_orpha_annotation_rows_seen": seen,
                   "omim_iea_or_negative_hpo_annotations_excluded": omitted,
                   "source_release": RELEASE})
    with (output / "orpha_candidates.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        writer.writerows(candidates)
    (output / "matching_report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), "utf-8")
    print(json.dumps({k: v for k, v in report.items() if k not in ("unmatched_ids","source_sha256")},
                     ensure_ascii=False, indent=2))

if __name__ == "__main__":
    run()
