# 医学的3D星図：50疾患への拡充（2026-10-11）

## 結果

国内カタログ全1,241件は維持したまま、**HPO症状・原因遺伝子・遺伝形式・発症時期を特徴量化した3D星図を17疾患→50疾患へ拡張**した。

- 既存の疾患ID/ORPHAcode確認済み17疾患を維持。
- NANDO日本語/英語病名・親疾患と、Orphadata/Orphapacketの病名・公式祖先分類を**独立した階層経路（最大3段階）で照合できた33疾患**を追加。
- 追加33件：親ラベル（同義語を含む）一致までの最短距離が1段12件、2段12件、3段9件。既存17とのコード衝突・重複なし。
- 最終50疾患に約1,884件のHPO症状関連付けを登録。遺伝関連／遺伝形式／発症時期の出典付き情報も登録。
- NANDO＋Orphanetの系統ラベルが一致することは、**医師による個別の医学的レビューや臨床的妥当性の証明ではない**。追加33件は「出典間で一致を検証した疾患概念」として研究表示にのみ採用。
- 元の1,241件の分類ベース星図、参加機能、投稿データ、ランダム紹介、Coming Soon、累積週次表示は変更しない。
- 未確認のORPHA候補は未承認のまま。133件の初期厳密一致候補のうち、44件は既存17＋追加33に含まれ、**残り89件が追加概念照合待ち**。

## どのように照合したか

照合用資料：`data/orpha_ancestor_chain_audit_v1.json`（133件の全件調査）、`data/orphadata_verified_batch_04.json`（22件）、`data/orphadata_verified_batch_05.json`（11件）。

各候補に対して：

1. NANDOの日本語病名と、同じ疾患に付与された英語優先名を確認。
2. Orphadataの一意なORPHAcodeの英語優先名と**厳密一致**。
3. NANDOの親疾患の英語名・正式同義語が、対象ORPHAcodeの`Parents`にある**直近～3世代の祖先疾患の名称または公式同義語**に一致するか確認。
4. ORPHAcodeの重複割当てがないことを確認。実データと照合済みのIDのみ`disease_orpha_mappings`に登録。
5. 付与済みのORPHAcodeから症状ID/遺伝子の原典証拠を取り込み、陽性・未注釈・否定を混同しない。患者情報や直接入力されたコメントはこの処理に含まない。

`disease_orpha_review_evidence`に、疾患ID・ORPHAcode・対応した親疾患名・祖先のコードと深さを記録。公開用のランダム紹介基準や個人のログを混入させない。

## 数値特徴量とモデル比較

HPOの頻度情報、原因関連遺伝子、遺伝形式、発症時期を**出典付き・非欠損の部分のみ**数値特徴量化し、PCAとUMAPで3D化、FCM（m=2, 5クラスター）で解析した。

| 検証項目 | 50疾患：PCA | 50疾患：UMAP |
| --- | ---: | ---: |
| 元の特徴量数 | 1,067 | 1,067 |
| Trustworthiness | 0.8171 | **0.8818** |
| 7-NN近傍保存率 | 0.5143 | **0.6543** |
| FCM所属度の平均最大値 | **0.7913** | 0.7489 |
| FCMシルエット係数 | **0.5041** | 0.4779 |

UMAPのseed安定性はProcrustes正規化後**0.8468**。3Dの近傍保存率が良いことを優先し、試作座標にはUMAPを採用。**FCMの所属度やシルエットについてはPCAが優る項目があるため、UMAPが全面的に優秀という結論ではない。**

医学的根拠が未承認の89候補でも同じ比較を別途実施したが、**その座標は公開RPCにも参加者向け星図にも追加しない**。

### カバレッジ

50疾患に対して、HPO表現型の観測語彙969、原因遺伝子83、遺伝形式7種類、発症時期8種類。遺伝子情報があるのは36/50疾患、遺伝形式41/50疾患。各観測されていない項目は医学的な不存在を意味しない。

## 本番3D描画との関係

- `public.disease_embedding_coordinates`：**1,241件**、従来のNANDO等のカテゴリーによる試験3D配置。
- `public.disease_clinical_embedding_pilot`：**50件**、臨床特徴量によるUMAP＋FCMの研究配置。
- `public.get_clinical_pilot_positions()`：50件を返す。NANDO通常配置は変更なし。
- `/lab/`の「症状のつながり」モードでは、ハードコードした旧17件説明を廃止し、取得した疾患数に応じた説明を表示。
- 投稿に関係しない「まだ光の灯っていない星」も暗い星として残す。既存の光の演出を維持。

## 再現性

`scripts/audit_orpha_ancestor_chain.cjs`：NANDOとORPHApacketの照合（原典のGitHubを取得して実行）

`scripts/compare_clinical_embedding_v3.py`：50件（照合済み）／89件（未承認）のモデル比較

`data/clinical_verified_comparison_v3.json`：50件の研究用3D座標

`data/clinical_pending_unreviewed_comparison_v3.json`：**未承認のため表示に使用しない89件**の候補座標

`supabase/migrations/029_source_parent_corrob_22.sql`／`031_parent_synonym_corrob_11.sql`：追加33件の疾患IDと症状情報を反映

`supabase/migrations/032_clinical_50_verified_umap_fcm.sql`：50件の座標更新

## 次の段階

**残り89候補の医学的な疾患概念の確認**、HPOの症状頻度・発症年齢の欠測検証、病型ごとの同一性の突合、原典に基づく追加照合が必要。ハードコードした臓器カテゴリの星団がある通常モードと、HPO実測データに基づく50件の研究モードは両立させる。

資料出典：
[NANDO/DBCLS](https://github.com/NanbyoData/nando),
[Orphanet ORPHApacket](https://github.com/Orphanet/orphapacket),
[Human Phenotype Ontology](https://hpo.jax.org/),
[UMAP](https://umap-learn.readthedocs.io/)。
