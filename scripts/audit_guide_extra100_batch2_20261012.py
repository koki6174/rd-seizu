"""Count exact Unicode characters of the 100 new disease guides; fail on duplicates or placeholders."""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent/'content'
records=[]
for batch in (9,10,11,12):
    filename=f'disease_guides_extra_{batch:02d}.json'
    records.extend(json.loads((root/filename).read_text(encoding='utf-8'))['records'])
assert len(records)==100
assert len({r['id'] for r in records})==100
counts=[sum(len(r[f]) for f in ('overview','dailyLife','currentState')) for r in records]
assert min(counts)>=145, f'Unexpectedly brief article: {min(counts)}'
assert max(counts)<=600, f'Unexpectedly long article: {max(counts)}'
print(f'新規100疾患の本文合計: {sum(counts):,}文字（Python Unicode文字数）')
print(f'最短{min(counts)}文字、最長{max(counts)}文字、平均{sum(counts)/100:.1f}文字')
