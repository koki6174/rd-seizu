# HPO・Orphadata 対応付け：実行監査（2026-10-10）

## 実行結果（2026年10月10日）

GitHub Actionsで公式ソースを実際にダウンロードして照合した結果。

| 指標 | 件数 |
|---|---:|
| 国内カタログ候補 | 1,241 |
| 英語名称あり | 852 |
| Orphadata 2026-07 のORPHA概念 | 11,645 |
| Orphadata 2026-07 のHPO情報付きORPHA概念 | 4,357 |
| 英語の完全一致・公式同義語一致から得た候補ペア | **328** |
| 候補のある国内カタログ疾患 | **328** |
| 候補に関わるORPHAcode | **324** |
| 英語優先名が完全一致し、かつ他の国内候補とORPHAcodeを共有しない候補（要確認） | **264** |
| 多義性・別名・共有コードなどの要確認候補 | **64** |
| 照合候補がない国内カタログ項目 | **913** |
| source-onlyで保存したORPHA症状プロファイル | **324** |
| source-onlyのHPO症状ID関連付け | **8,881** |
| HPO症状の記載がある候補ORPHAコード | **239** |
| 公式疾患ページで個別確認して承認したORPHAコード | **5** |

**注意：** 328は疾患の同一性が確認された件数ではない。英語名の一致は誤統合リスクがあるため `disease_orpha_match_candidates.review_status=pending` として非公開で保存。
患者向けDBの疾患ID・星・コメント・投稿記録は変更しない。検証中の医療情報を公開画面に表示しない。

## 対応付け方法

1. [Orphadata 2026年7月版](https://sciences.orphadata.com/alignments/) の `en_product1.xml` からORPHAcode、英語優先名、公式同義語を取得。
2. 国内カタログの英語名・英語別名をUnicode NFKC/空白処理で正規化。疾患番号、病型、遺伝形式や修飾語を削らずに**厳密一致**のみ候補化。
3. 同一ORPHAcodeに複数の国内IDが一致した場合、自動統合しない。
4. [Orphadata HPO](https://sciences.orphadata.com/phenotypes/) の `en_product4.xml` からHPO IDをORPHAcode単位で取得。明示的な「Excluded（0%）」を陽性症状に含めない。
5. [HPO公式 phenotype.hpoa](https://obophenotype.github.io/human-phenotype-ontology/annotations/phenotype_hpoa/) を用いてORPHA注釈の存在をクロスチェック。OMIM由来等の再利用制限がある注釈を無断転記しない。
6. ORPHAcodeだけの中間表 `orpha_hpo_source_profiles` にHPO IDを保存。国内の疾患に紐付けるのは、疾患概念が確認された後に限る。

### 重要な同一性の衝突

以下の4つのORPHAcodeで、**合計8件の国内病名ID**が同じORPHAcodeに候補一致。

- ORPHA:98907：ドルフマン・シャナリン症候群／中性脂肪蓄積症
- ORPHA:585：多発性スルファターゼ欠損症／マルチプルサルファターゼ欠損症
- ORPHA:264580：糖原病IXa型／IXc型（**別病型が同じORPHAcodeに対応しており、安易な統合は禁物**）
- ORPHA:1775：先天性角化異常症／先天性角化不全症

**これらの重複は自動解消しない。** ORPHAcodeとNANDOのコード粒度が異なる可能性を個別審査する。

## 確認済みの5例

公式Orphanetの疾患ページで、表記・疾患粒度・ORPHAcodeを直接確認して対応付けたもの：

| 日本語名 | ORPHAcode | 公式ページ |
|---|---|---|
| 筋萎縮性側索硬化症（ALS） | 803 | https://www.orpha.net/en/disease/detail/803 |
| デュシェンヌ型筋ジストロフィー | 98896 | https://www.orpha.net/en/disease/detail/98896 |
| ファブリー病 | 324 | https://www.orpha.net/en/disease/detail/324 |
| ゴーシェ病 | 355 | https://www.orpha.net/en/disease/detail/355 |
| ハンチントン病 | 399 | https://www.orpha.net/en/disease/detail/399 |

`disease_external_mappings`にこの5件のORPHAリンクを登録。
HPO症状情報が国内IDへ既に登録されていた場合は上書きせず、欠けている情報だけ補完する。

## 残っている作業

1. 要確認候補64件を優先して人手照合。特に親疾患／病型の概念粒度を確認。
2. 厳密一致候補の未承認264件についても、少なくとも対照可能な外部識別子や公式ページで裏付けを取る。
3. 英語名のない389件、および一致しなかった疾患群をNANDO・MONDO・Orphadata外部参照（OMIM等）で照合。
4. Orphadata遺伝子ファイル（product6）、自然歴・遺伝形式、発症時期を取り込み、出典と関係の型を保存。
5. 症状の頻度、記載なし、明示的な陰性を区別した特徴ベクトルを作成。
6. その後PCA、UMAP、FCMの妥当性・近傍の保存率を評価し、星図座標を再計算する。

## 実行方法

```bash
python scripts/stage_orpha_hpo.py --output /tmp/orpha-review
```

あるいは GitHub Actions の `Clinical crosswalk staging (private review)` で自動的に取得と照合を実施。
成果物（照合候補CSV・監査JSON・ORPHA別HPO ID）は GitHub Actions に7日間だけ保持。
**内部の候補対応とクラスタリング方式は来場者向けのWeb UIへ表示しない。**

### DB

- `disease_orpha_match_candidates`：328件の候補と承認ステータス。匿名SELECT不可。
- `orpha_hpo_source_profiles`：ORPHAcode別の陽性HPO ID情報。匿名SELECT不可。
- `disease_external_mappings`：正式に承認したORPHAリンクのみ。
- `disease_hpo_annotations`：正式に承認した疾患との関連付け。既存の登録に矛盾する上書きをしない。

## データ使用条件

- Orphadata Science：**CC BY 4.0**。出典を明記。
- HPO `phenotype.hpoa`：注釈の由来によりOMIM等の再利用条件が異なる。出典・根拠を確認して使用する。
- この検証用ID対応は医学的評価・診断に使わない。未承認の疾患のデータは本番クラスタリングに混入させない。
