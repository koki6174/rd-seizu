# ORPHAcode × HPO対応付け：精度優先の拡張検証（2026-10-10）

## 目的

疾患カタログ1,241件を、Orphadata/Orphanet（ORPHAcode）およびHPOの症状情報と統合し、数値ベクトル化と3D UMAP・PCA・FCMを比較できる実データ基盤を構築する。**病名の類似は医学的な疾患同一性と同じではないため、候補と確認済みを明確に分離する。**

既存の本番参加ページ `/admin/` と `/weekly/` は変更せず、試作 `/lab/` の3D回転速度のみ改善する。

## 出典

- [Orphadata Science 2026-07](https://sciences.orphadata.com/phenotypes/)：ORPHAcode×HPO症状。CC BY 4.0。
- [Orphanet/orphapacket](https://github.com/Orphanet/orphapacket)：希少疾患の名称・HPO症状・遺伝子関連・遺伝形式・発症時期・疫学のまとまったJSON。取得リビジョンをファイルごとに保存。
- [HPO phenotype.hpoa仕様](https://github.com/obophenotype/human-phenotype-ontology/blob/master/docs/annotations/phenotype_hpoa.md)：症状ID、頻度、発症時期とともに陽性・否定の区別が可能。**OMIM由来のIEA注釈には別途再利用制限がある**ため、今回の取り込みはOrphanetがCC BY 4.0で配布する症状アノテーションを使用。
- [MONDOの対応付け仕様](https://mondo.readthedocs.io/en/latest/editors-guide/mappings/)：exact・broad・narrow・relatedを区別する必要がある。

Orphadata ScienceのCC BY 4.0条件に従い、加工があることを明示し、引用元を残す。**分類座標や研究用クラスタリングの結果が元のOrphadataデータを正確に再現する保証はなく、Orphanetは当プロジェクトの出力を保証しない。**

## 対応精度と監査

2026-10-10に実行した公開病名とOrphapacketの精密照合では、

| 結果 | 疾患・病型候補数 |
|---|---:|
| 検索用の全件 | **1,241** |
| 英語の出典名あり | **852** |
| Orphapacketの英語名・同義語との重複しない単独候補 | **275** |
| 同義語の衝突・疾患群を含みレビュー必須 | **56** |
| 英語名があるが合致なし | **521** |
| 英語名未登録 | **389** |

※単独候補275は**医学的に確認済みの275疾患ではない**。疾病群・病型が別の階層に属する例や、別名による曖昧な対応を含む。正規化日本語名だけでの大量統合、編集距離による自動同一視は禁止。

既に独立した臨床研究モードでは17疾患を手作業で検証済み。別途、72件の自動単独候補は元の症状・遺伝子情報付きで `disease_orpha_candidate_profiles` に保存していた。今回さらに正確な英語の**第一優先名**が一致し、Orphanet側が `Disease`、HPO注釈が存在する疾患に絞り、`disease_orpha_evidence_staging` を新設した。審査前のレコードを診療上の確定対応として公開しない。

## 自動取得と照合手順

`scripts/stage_orpha_hpo_evidence.cjs` はOrphanet/orphapacketの原本JSONを読み、
単一のORPHAcode・完全一致の英語優先名・Disease属性・HPO注釈有りをすべて検証する。

- 出典コードとファイルのORPHAcodeが違う場合は除外
- 名前が異なる場合は翻訳せず除外
- 診療領域だけが一致する、親子疾患、型が違う、単なる同義語候補は自動認定しない
- ORPHAcodeが複数疾患IDで重複する場合は除外
- HPO term ID、原語ラベル、頻度を出典付きで保存する
- 遺伝子関連は病因・感受性・修飾などの**役割文字列を保持**し、全てを「原因遺伝子」として1にしない
- 遺伝形式と発症年齢もある場合だけ保存する
- **欠損はNULL/未調査**として扱い、「特徴なし」の0に置き換えない

成果は `data/orpha_hpo_exact_source_*.json` に、出典のコミットIDとともに保存する（GitHub Actions実行時に生成）。これらは**未レビューの候補**であり、運営の確認を経ずに公開用の本格的な症状空間へ移さない。

公開する3D星図は、医学的な関係を過度に主張しない。モデル評価として、近傍保持率・embedding安定性・欠損率・既知の疾患群の一貫性を検討する。症状由来のベクトルは単純な臓器系One-hotとは別物として管理する。

## 今後のデータ整備

- 389件の「英語名なし」について、NANDOの英文ラベルと既存病名IDを確認して再照合。ただし病名の翻訳だけでORPHAcodeを確定しない。
- 56件の同名衝突や疾患群の範囲の差を「exact / broad / narrow / related」で人手レビューする。
- 未レビューの症状データを医学的に裏付ける際は、元疾患の定義・英語名・親子関係・ORPHAcode・資料日付を比較する。
- 3D全件の医学的クラスタリングを完成と称するのは、十分な特長量被覆率と外的妥当性を検証してからにする。

## UI

3D試作の自動回転速度は1.35→2.5、指での回転応答は1.15→1.35に調整。既存の公開サイトの星図・投稿・位置・識別子は変更しない。
