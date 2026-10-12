"""Python Unicode-character audit for the latest 100 Japanese disease guides.

Full-width and half-width characters each count as one Python character.
Exclude JSON formatting, citation URLs, field names and other metadata.
"""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent / 'content'
new = []
for batch in range(1, 6):
    new.extend(json.loads(
        (root / f'disease_guides_more_0{batch}.json').read_text(encoding='utf-8')
    )['records'])

assert len(new) == 100
assert len({x['id'] for x in new}) == 100

sections = ('overview', 'dailyLife', 'currentState')
counts = [sum(len(record[key]) for key in sections) for record in new]
assert min(counts) >= 130
assert max(counts) <= 1000

total = sum(counts)
print(f'Python文字数確認済み: 新規100疾患の本文合計 {total}文字')
print(f'1件あたり 最小{min(counts)}文字 / 最大{max(counts)}文字 / 平均{total / 100:.2f}文字')
print('全角・半角とも純粋な文字数として計測。出典URL、疾患名、JSON構造は除外しました。')
