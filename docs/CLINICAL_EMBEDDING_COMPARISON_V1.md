# 疾患間の医学的関連性：PCA／UMAP／FCMの比較実験

実行日：2026年10月10日。臨床情報はOrphanet/Orphadataの出典付きスナップショット。
**本実験は疾患分類を探索する研究用試作であり、診断・医療判断には使用しない。**

## 疾患IDの対応付け

- 国内カタログは1,241件。病名はNANDOなどの和名、英語別名、疾患階層が混在。
- 既存のOrphanet ORPHAcode照合済み疾患は**17件**。そのうち**11件**は下記の厳密一致候補群にも存在。
- Orphadataの英語優先病名を正規化し、同一の疾患概念型（Disease）の一意一致として得られた**133件**は、**未承認候補**として別管理。重複したORPHAcodeがないこと、元データと病名が一致することを検証している。
- 133件中、照合済み17件との重複は11件。残り**122件は未承認**。**この122件は医学的な照合が完了したとは扱わない**。
- 133件は数値化・性能評価まで実施するが、本番の参加者向け星図には載せない。
- 既存の17件を新しく照合・承認したわけではない。17件のみが現在の試作「症状のつながり」表示対象。

## 34次元分類ベースから実際の臨床特徴ベクトルへ

HPO・Orphadataの**陽性症状**、Orphanetが原因関連とする遺伝子、遺伝形式、発症時期を使用。

| 特徴量ブロック | 重み | 照合済み17件：観測語彙 / 該当件数 | 未承認133件：観測語彙 / 該当件数 |
|---|---:|---|---|
| HPO症状と出現頻度 | 1.00 | 474 / 17 | 1,990 / 133 |
| 原因関連遺伝子 | 0.40 | 32 / 12 | 215 / 86 |
| 遺伝形式 | 0.22 | 7 / 17 | 8 / 102 |
| 発症時期 | 0.18 | 8 / 17 | 8 / 133 |
| **合計** | - | **521次元** | **2,221次元** |

- HPO頻度はObligate、Very frequent、Frequent、Occasional、Very rareを段階的に数値化。
- 臨床遺伝子情報は`disease-causing`に限定し、`susceptibility`や`modifying`は原因として扱わない。
- 症状・遺伝子は出現症例数に基づくIDF重みを適用し、各ブロックでL2正規化。重みは**探索用の仮設定**であり臨床的検証はされていない。
- 症状が記載されていない場合は**「存在しない」ではなく「未注釈」**。欠損割合・出典を併記し、医学的な陰性の推論には使用しない。
- 患者数、有病率、未確認治療情報は無理に数値化していない。

## モデル比較の結果

いずれもPCAかUMAPで3次元座標を作成し、その**3次元座標に対してFCM（m=2）**を実行。FCMは単独で3次元への次元削減はしない。学習と評価は同一データ。

| データ | 次元削減 | Trustworthiness | k-NN近傍の一致率 | 乱数seed安定性 | FCM所属度平均 |
|---|---|---:|---:|---:|---:|
| 照合済み17 | PCA | 0.771 | 0.635 | 1.000 | 0.787 |
| 照合済み17 | **UMAP** | **0.810** | **0.647** | 0.844 | **0.854** |
| 未承認候補133 | PCA | 0.821 | 0.333 | 1.000 | 0.650 |
| 未承認候補133 | **UMAP** | **0.913** | **0.567** | 0.876 | **0.675** |

評価指標：元データをコサイン距離としてk近傍を評価し、trustworthinessとk-NN一致率を算出。乱数seed安定性は3回のUMAPにProcrustes整合を適用し、平均disparityを使う。FCMは17件でk=3、133件でk=5。PCAは同一入力で決定的。

**今回の選択：UMAP + FCM。** 17件では近傍保存率の差は小さい（0.039）ため、医学的な優越性を主張する結果ではない。133件では約0.093のTrustworthiness改善を示すが、未承認候補であり公開・医学的利用はしない。

## 3D星図への適用

- 照合済み17件の座標のみ `disease_clinical_embedding_pilot`へアップデート。DBのORPHAcodeと疾患IDの両方を一致検証した後、migration `028`で反映。
- すでにある `/lab/` の「症状のつながり」モードが、追加の画面改修なしで最新版の17件を取得する。
- 1,241件の分類ベース星図は従来の座標を**一切上書きしていない**。投稿・コメント・明るさ・ランダム抽選は変更なし。
- 133件の候補群の3D座標は**評価用JSONだけ**に保存。未承認の疾患IDを公開3D APIに流さない。

## 再現手順

```bash
python -m pip install numpy==2.1.3 scipy==1.15.3 scikit-learn==1.6.1 umap-learn==0.5.7
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 NUMBA_NUM_THREADS=1 \
  python scripts/compare_clinical_embedding.py --output data
```

元データは `data/orphadata_verified_batch_01..03.json` と
`data/orpha_hpo_exact_source_01..07.json`。GitHub Actionsの`clinical-compare.yml`で検算。

出力：

- `data/clinical_verified_comparison_v1.json`（照合済み17件）
- `data/clinical_staged_unreviewed_comparison_v1.json`（未承認133件、研究内部候補）
- `data/clinical_model_comparison_summary_v1.json`（比較結果）
- `supabase/migrations/028_update_verified_clinical_umap_coordinates.sql`（照合済み17件への安全な適用）

**注意：** GitHubリポジトリは公開であり、`data`フォルダの臨床候補比較結果もコードとして閲覧可能。ただし来場者サイトの参加画面・公開APIへは反映しない。

## 次の品質課題

1. 残る122件の個別対応をNANDO／Orphanet／MONDO等の外部識別子と疾患階層で再照合し、病型・疾患群と単一疾患の混同を防ぐ。
2. 既存の別系統の候補マッピングとの重複・矛盾を、同一`disease_id`、`ORPHAcode`を軸に一元管理する。
3. 疾患の症状アノテーションが多いほど近傍配置が有利になるなどの**出典カバレッジ差**を検証。
4. UMAPのseed安定性に加え、leave-one-outやブロック重み変更に対する近傍安定性を評価。
5. 公式コード確認済みの症状・遺伝学的疾患が増えてから、「1,241疾患の医学的クラスタリング」としての本番適用を判断する。

資料： [Orphadata Science](https://sciences.orphadata.com/orphanet-scientific-knowledge-files/)、
[Human Phenotype Ontology](https://obophenotype.github.io/human-phenotype-ontology/annotations/phenotype_hpoa/)、
[UMAP論文・ドキュメント](https://umap-learn.readthedocs.io/en/latest/parameters.html)。
