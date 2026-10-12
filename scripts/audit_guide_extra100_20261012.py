"""Audit new Japanese article character lengths with Python unicode counting."""
import json
from pathlib import Path

root=Path(__file__).resolve().parent.parent/'content'
new=[]
for batch in range(5,9):
    new.extend(json.loads((root/f'disease_guides_extra_0{batch}.json').read_text(encoding='utf-8'))['records'])
assert len(new)==100
counts=[sum(len(x[k]) for k in ('overview','dailyLife','currentState')) for x in new]
assert min(counts)>=140
assert max(counts)<=650
total=sum(counts)
print(f'100疾患の記事本文：{total}文字（全角・半角とも1文字としてPython検証済み）')
print(f'最短{min(counts)}文字／最長{max(counts)}文字／平均{total/100:.2f}文字')
