# HPO・Orphadataの医学的特徴量ベース星図：120疾患への拡張（2026-10-11）

## 何が変わったか

従来の全1,241疾患の星図は、**NANDOの臓器系カテゴリーと小児慢性疾患の群を元にした34次元分類ベクトルをPCAで3次元に変換し、FCM13群に分けてから表示上の位置調整**を行う試験モデル。

- 17次元：NANDO由来の大分類16領域＋未分類（うち既存データ988概念）
- 16次元：小児慢性疾患の領域群（既存データ233概念）
- 1次元：親疾患に対する病型・サブタイプのフラグ
- PCA3成分の累積説明分散：約**48.6%**
- 元の1,241件のうち20件は分類データ未整備。親・下位病型関係、重なり避けの微調整を使う。**これは症状や遺伝子で疾患間距離を推定したモデルではない。**

今回の拡張では、別表示の「症状のつながり」研究用3D星図を**50疾患→120疾患**へ拡大した。

## 70疾患に追加した独立した照合根拠

MONDO 2026年10月6日リリースに含まれる2種のSSSOMを使った。

1. MONDO→NANDO：`oboInOwl:hasDbXref`、手動キュレーション。
2. MONDO→Orphanet：`skos:exactMatch`、ORPHAcodeが同一。
3. MONDO、旧NANDOレコード、Orphadataの**英語優先病名が正規化後の厳密一致**。
4. 同じORPHAcodeを別の国内病名に割り当てず、すでに照合した50疾患を除外。
5. 出典・MONDO:ID・現行NANDO:ID・ORPHAcode・照合方法を個別に記録。

**重要：`hasDbXref`はオントロジーの同一性を意味せず、旧NANDOの識別子と現行NANDOの識別子が直接一致するわけでもない。** これは出典間の照合根拠であり、疾患概念の医学的な完全同一性を保証しない。医師の独立レビューは未実施。

照合の結果：
- 旧来の臨床情報付き・出典照合済み疾患：50件
- 今回、上記の厳密な3者の名前一致＋MONDO照合で追加：**70件**
- 合計：**120件**
- 元の133件の未承認候補のうち、照合済み17や前回の追加33と今回の70を除いた候補：**19件**。これらは表示に使用しない。

DBの出典：`public.disease_orpha_mondo_evidence`は厳密な参照対応70件を保持（anon読み取り不可）。`disease_orpha_mappings`に120件、`disease_hpo_annotations`に**4,487件**の関連付け。未承認候補のプロファイルは使用しない。

## 新しい数値特徴量とPCA/UMAP/FCM

120疾患の入力は**2,077次元**。観測された医学データのみを使用した。

| 項目 | 入力の数 |
|---|---:|
| HPO症状（頻度情報を加味） | 1,873次元 |
| 原因関連遺伝子 | 188次元 |
| 遺伝形式 | 8次元 |
| 発症時期 | 8次元 |
| 合計 | **2,077次元** |

120件すべてにHPO症状注釈があるが、原因関連遺伝子の注釈があるのは76/120件。遺伝形式は96/120件。未注釈は「存在しない」ではない。原典由来の測定欠損は非注釈として扱い、欠損を生理学的陰性と断定しない。

PCA・UMAPで3D化し、FCM（m=2、今回は5クラスター）を比較した。

| 評価指標 | PCA | UMAP |
|---|---:|---:|
| Trustworthiness（3D近傍の保存） | 0.8091 | **0.9070** |
| 7NNの一致率 | 0.3190 | **0.5595** |
| UMAP乱数seed間の安定性（Procrustes整合後） | - | **0.9085** |
| FCM平均最大所属度 | 0.6572 | **0.6797** |
| FCMシルエット係数 | 0.3207 | **0.3926** |

このデータと試験用の重み設定においてはUMAP+FCMが適していた。**ただし、評価は同じ観測データの内部構造であり、臨床的な同質性の外部検証ではない。**

## 表示・既存データ保護

- `public.disease_embedding_coordinates`：これまでと同じ全1,241件のカテゴリー星図。
- `public.disease_clinical_embedding_pilot`：新しい120疾患の研究用UMAP星図。
- `/lab/`の「症状のつながり」モードから120件の星を操作可能（既存のUIコードは自動的に人数ではなく疾患件数を取得）。
- 参加記録、星の明滅の判断、病名検索、ランダム紹介、週次レポート、Coming Soonは変更していない。

## 再現コードと出典

- `scripts/audit_mondo_nando_orpha.cjs`：MONDO 2026-10-06公式SSSOMの2ファイルとOrphapacket由来の候補133件を一対一照合する。
- `data/orpha_mondo_crosswalk_evidence_v1.json`：70個のMONDO、現行NANDO、ORPHAcodeの照合証拠。
- `data/orphadata_verified_batch_06.json`：追加70件の症状・遺伝子・発症時期等の出典スナップショット。
- `scripts/compare_clinical_embedding_v4.py`／`data/clinical_model_comparison_summary_v4.json`：120件と未確認19件を分離したPCA/UMAP/FCM。
- `supabase/migrations/034_mondo_nando_orpha_70_source_triaged.sql`：70件の照合・特徴量を安全に追加。
- `supabase/migrations/035_clinical_120_umap_fcm.sql`：120件の医療3D座標を厳密なORPHAcode突合で反映。

公的出典： [MONDO](https://github.com/monarch-initiative/mondo)、[Orphanet／Orphadata](https://sciences.orphadata.com/)、[NANDO/DBCLS](https://github.com/NanbyoData/nando) と [HPO](https://hpo.jax.org/)。

### 次に必要なこと

残り19候補について、ORPHA/MONDO/NANDOの用語の非完全一致、疾患概念粒度、親子分類、疾患同義語などを個別に再確認する。さらに、**残る1,121疾患については医学的特徴量のデータが十分に揃っていない**。最新NANDOとMONDOの公式IDをまず全件へ接続し、HPOや病因・遺伝形式が存在する分を増やす。全1,241件を臨床的に関連した単一UMAPに無条件で混ぜず、欠測マスクや情報量カバレッジを検証する。
