"""Audit Unicode lengths in additional 100 Japanese disease-guide articles.

This is plain len(str): one full-width or half-width character counts as one.
"""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent/'content'
articles=[]
for i in range(1,5):
    data=json.loads((root/f'disease_guides_orpha_{i:02d}.json').read_text(encoding='utf-8'))
    assert len(data['records'])==25
    articles.extend(data['records'])
assert len(articles)==100 and len({r['id'] for r in articles})==100
sections=('overview','dailyLife','currentState')
lengths=[sum(len(r[key]) for key in sections) for r in articles]
assert min(lengths)>=140, f"Insufficient detail: {min(lengths)}"
assert max(lengths)<=500, f"Too long: {max(lengths)}"
assert all(all(len(r[key])>=35 for key in sections) for r in articles)
print(f"確認済み：追加100疾患、本文計{sum(lengths)}文字（全角・半角含む純粋な文字数）")
print(f"1疾患あたり最短{min(lengths)}文字、最長{max(lengths)}文字、平均{sum(lengths)/100:.1f}文字")
