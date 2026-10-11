# 現在点灯している星の疾患解説（2026年10月11日時点）

公開済みの`get_public_stars()`で、点灯済みかつ既存150疾患の解説がないものを確認したところ、以下の**3疾患**でした。疾患IDが異なる場合は親疾患や似た疾患の説明を流用していません。

| 疾患 | カタログID | 医学上の照合点 | 解説 |
| --- | --- | --- | --- |
| 孤発性クロイツフェルト・ヤコブ病 | `nando-23-1` | プリオン病の**孤発性**の病型であり、遺伝性・獲得性CJDと区別する | `/disease/?id=nando-23-1` |
| ファブリー病 | `fabry-disease` | ライソゾーム病の一疾患。原因・症状・特異的治療は病型を特定して記述 | `/disease/?id=fabry-disease` |
| CACT欠損症 | `nando-316-3` | SLC25A20に関係する**CACT欠損症**。CPT2欠損症や原発性カルニチン欠乏症と混同しない | `/disease/?id=nando-316-3` |

3件それぞれの「どんな病気？」「暮らしとの関係」「医療と研究の現在地」を`content/disease_guides_currently_lit_20261011.json`に保存。出典は以下。

### 孤発性クロイツフェルト・ヤコブ病
- https://www.nanbyou.or.jp/entry/80
- https://www.nanbyou.or.jp/entry/385

### ファブリー病
- https://www.ncchd.go.jp/hospital/sickness/children/010.html
- https://www.nanbyou.or.jp/entry/4063
- https://www.orpha.net/en/disease/detail/324

### CACT欠損症
- https://www.shouman.jp/disease/details/08_03_043/
- https://www.nanbyou.or.jp/entry/5429
- https://www.ncbi.nlm.nih.gov/books/NBK582032/

疾病コンセプト名はSupabase`disease_catalog`の原表記と一致した。各出典は疾患単位の説明で、一般索引ページに依存しない。医学的なリスク、遺伝形式、生活上の注意が原因不明の型と異なる場合には親疾患から引き継がない。

既存の`content/disease-guides.js`で6ファイルの150疾患にこの3件を追加し、**計153疾患**を共通の詳細ページ`/disease/?id=<id>`から閲覧できるようにした。点灯済みの3D星から表示した名前とカタログIDで解説を取得するため、追加の3件にも自動的に「この病気について知る」が表示される。一般のランダム紹介の抽選条件や未点灯星の表示制約は変更していない。

`scripts/validate_disease_guides_currently_lit.cjs`は今回の3件の出典と既存150件のID重複、登録件数153、UI統合を自動確認する。

**注記：** これは**2026-10-11の公開星図スナップショット**に対応する。今後新しい星が点灯したら、必ずしも自動で病気の説明が生成・公開されるわけではない。追加時には疾患単位で原典と対応付けを確認する必要がある。
