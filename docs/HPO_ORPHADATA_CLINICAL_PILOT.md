# HPO × Orphadata：疾患同一性を確認した臨床特徴量の試験（2026-10-10）

## 今回の実データ対応

| 内容 | DB照合後の件数 |
|---|---:|
| 対象の疾患カタログ | **1,241** |
| ORPHAcodeを根拠付きで対応付けた疾患 | **17** |
| 英語病名の完全一致 | 14 |
| Orphadataの同義語による完全一致 | 2 |
| ハイフン等の表記差を人手で確認 | 1 |
| HPO表現型アノテーション | **764** |
| HPO用語IDの種類 | **474** |
| 遺伝子と疾患の関連記録 | **53**（原因・修飾・感受性関連の区別を保持） |
| 遺伝形式に関する項目 | **23** |
| 発症年齢の分類記録 | **36** |
| HPO＋原因遺伝子を使った3D埋め込み | **17件** |

**大事な留保：臨床特徴量を1,241疾患すべてに整備したわけではありません。**
残りの1,224疾患は、公開元IDでの同一性確認が終わるまで、従来のNANDO分類ベース星図にのみ配置しています。
最初の17件は整合性を評価するための限定的なテストコホートです。

## 出典・バージョン

- [Orphanet / Orphapacket](https://github.com/Orphanet/orphapacket) : 2026-06-29の各レコード作成日時、CC BY 4.0の公開科学データ。
- [Orphadata Science：Phenotypes](https://sciences.orphadata.com/phenotypes/) : 疾患にHPO IDと頻度を付与。
- [Orphadata Science：Genes](https://sciences.orphadata.com/genes/) : 遺伝子関連を区別する。
- [HPOアノテーション形式](https://github.com/obophenotype/human-phenotype-ontology/blob/master/docs/annotations/phenotype_hpoa.md) : 否定・頻度・発症などの定義。
- [Orphadata Science：Alignments](https://sciences.orphadata.com/alignments/) : 公開元間のID統合に用いる。
- [MONDO](https://mondo.monarchinitiative.org/) : 強制的な名前寄せではなく、等価・上位・下位概念を区別する候補。

この17疾患のHPO注釈はOrphadata/Orphapacket由来です。**HPO本家の全量`phenotype.hpoa`を直接取り込んだわけではありません。**
病名・遺伝子名・症状名・患者数を自動翻訳したり、未確認の数値を生成したりしていません。

### 厳密な照合

- 対応付けには `disease_catalog.id` ↔ `ORPHAcode` を用いて、原典の病名・厳密な同義語で検証。
- 意味的に近いだけの病名や広い疾患群の名前一致では、自動的に等価としない。
- `Ataxia telangiectasia` ↔ `Ataxia-telangiectasia` は表記差を個別確認した例。
- `Pompe disease` と `Glycogen storage disease due to acid maltase deficiency` はOrphadata側の明示的な同義語で対応。
- 親疾患とサブタイプの双方に異なるORPHAcodeがある場合、決して同じIDに統合しない。
- `disease_orpha_mappings` に照合方法、照合元ラベル、ORPHAcode、版を保持する。

### 症状・遺伝・時期の欠損

`disease_hpo_annotations`は原典HPO IDと頻度文字列を保存。明示的に否定された症状は陽性例に混ぜない。
HPO IDが登録されていない症状は**不存在ではなく未評価**。
`disease_orpha_genes`は原典の `Disease-causing`、`Modifying`、`Major susceptibility` などの関連タイプを残す。
多因子や複数の遺伝形式がある疾患の記録を一つの0/1値に潰さない。

## PCA＋FCMの第二段階

入力：上記17疾患、**506次元**（陽性HPO ID 474＋原因遺伝子32）。
症状の頻度表記に基づく重みと、文献注釈頻度の逆頻度重みを付与した。
遺伝子は「原因となる遺伝子」という証拠がある場合のみ補助成分へ使用し、感受性遺伝子・修飾遺伝子は陽性の病因指標と混同していない。

データブロックを正規化し、中心化したGram行列に対して3主成分の固有分解を実施（カーネルPCAに相当）。
さらに3D座標に対して **FCM：4クラスター、ファジー指数 m=2** を適用した。

| 指標 | 実測 |
|---|---:|
| 第1軸 | 12.22% |
| 第2軸 | 7.87% |
| 第3軸 | 7.57% |
| 累積寄与率 | 約27.66% |
| FCM更新 | 37回 |

ゴーシェ病とその病型など、既知の疾患同士で症状が共有される関係が一部確認された。
ただし**対象17疾患の小さな非無作為サンプル**なので、座標・FCMは医学的な近傍の定量評価ではなく研究仮説である。
試験モデルの低い累積寄与率も、3D距離の誇張に注意する理由となる。

資料：`scripts/build_hpo_pilot.cjs`、`data/clinical_hpo_pca_fcm_17.json`、
`data/orphadata_verified_batch_01.json` から `03.json`。
GitHub CIで座標・特徴数の再現性を確認する。

## 3Dサイトでの表示

`/lab/` ではボタンで切り替える。
- **「すべての星」**：以前の1,241疾患。未投稿も暗い星として残り、投稿済みだけ発光。
- **「症状のつながり（試験中）」**：厳密な出典照合が終わった17疾患だけを症状・原因遺伝子に基づき配置する。未照合の1,224疾患はこの比較モードでは表示しない。

両モードとも3D回転・星の選択・コメント閲覧を保つ。
回転速度を1.35（従来0.50）へ変更し、ドラッグ速度も若干速めた。
**`/admin/` の一般向け星図、Coming Soonトップ、週次レポートには影響させない。**

## 次に必要な研究

1. Orphadata `en_product1`の識別子マッピング、MONDOのSSSOMの`exactMatch`を利用し、残る1,224件を候補抽出。誤対応の可能性がある`closeMatch`、`broadMatch`等は自動承認しない。
2. HPO本家の `phenotype.hpoa` とOrphadataの注釈の重複・出典の違いを検証。データセット内の`NOT`や複数論文の重複を尊重する。
3. 症状情報がない疾患を「症状が0個の疾患」として扱わないよう、被覆率・欠損マスクを維持する。
4. ある程度の疾患がそろった時点で、3D UMAP／近傍保全率／クラスタリング安定性を比較する。試験17件の結果を1,241件へ安易に一般化しない。
5. 実機Safariで回転・再描画・発熱・表示切替を確認する。

**現時点の到達点：HPOとOrphadataの実際の症状・遺伝子情報による、厳密に照合した17疾患の第二段階クラスタリング。**
