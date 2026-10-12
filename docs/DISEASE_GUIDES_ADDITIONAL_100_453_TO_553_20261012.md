# 疾患詳細ページの追加：453件から553件（2026年10月12日）

## 追加した内容

既存の詳細解説 **453疾患** と重ならない **100疾患・病型** に対し、独立した記事原稿を追加した。

- すべての対象が、Supabase `public.disease_catalog` に実際に公開登録された正式日本語病名・IDであることを突合済み。
- 「どんな病気？」「暮らしとの関係」「医療と研究の現在地」の3項目を執筆。新規100件の本文は合計 **19,006文字**。
- 記事は `content/disease_guides_researched_01.json`〜`04.json` の4分割、既存記事を上書きせずに追加。
- 疾患群や病型の原典との関連を確認した記事：**72件**。NANDO分類と、難病情報センターの関連疾患／親疾患の公式解説を参照。原典の適用範囲が疾患群である場合は文章を一般的な範囲にとどめた。
- Orphanetの特定疾患の個別解説URLを付した記事：**28件**。このうちDBと照合済みのORPHA番号があるものはその番号でリンクを作成。残る6件はOrphanetの個別疾患名・ページを調べたうえで参考資料としてリンクした。これら6件のDB疾患概念の紐付けは自動確定していない。
- 3D点灯星と疾患紹介から、既存の共通ページ `/disease/?id=<disease-id>` で表示可能。
- 全記事数は **553件**。1,241個の疾患概念に対し、未執筆は **688件**。既存の星の点灯判定、投稿、集計、内部紹介ロジック、研究用データは変更していない。

## 内容の事実性と限界

原典として [難病情報センター](https://www.nanbyou.or.jp/)、[NANDO/DBCLS](https://github.com/NanbyoData/nando)、[Orphanet](https://www.orpha.net/en) を利用。

**検証済みの範囲**：正式な疾患IDと日本語病名、参照先ホスト・URL形式、公開カタログとの対応、全記事の節と参考文献の存在、既存記事とのID非重複、極端に断定的な予後・治癒表現の機械的検出。難病情報センターの代表的な出典先とOrphanetの一部の個別ページについては実際にページを開き、内容・疾患概念を確認。

**未完了の範囲**：100記事の文章それぞれの全センテンスについて、専門領域別の最新診療ガイドラインと逐語照合すること、および臨床専門家の独立査読。とくに、疾患のサブタイプでは親疾患から治療可能性を一律に推論しないこと。医学的な断定や薬剤承認状況は更新が必要なことがある。これは**出典に結び付けた一般向け編集原稿**であり、診断・治療の判断材料ではない。

詳細画面には短い注意文「病状や治療は一人ひとり異なるため、この文章を診断・治療の判断に使わないでください。」を維持。利用者の要望により、医学専門家による個別監修の有無を示す長い断り書きは掲載していない。

## 技術的な検証

`scripts/validate_disease_guides_553.cjs` に以下の検証を追加。

- 旧453件・新100件の件数、全553件の一意性。
- 日本語名・IDがDBのエビデンススナップショット `content/disease_guides_researched_catalog_20261012.json` と一致すること。
- 72件の公式NANDO分類データへの参照、28件のOrphanet個別疾患解説への参照。
- URLを HTTPS の公式情報源に制限。GitHubについてはNANDO原典の正確なパスだけをUI表示可能に変更。
- タイトル、3節の本文長、既存の医療に関する注意文、ローダーの総数を検証。

## 追加した詳細記事一覧

| # | 病名（DB正式名称） | 解説ページ | 主な根拠 |
|---:|---|---|---|
| 1 | デュシェンヌ型筋ジストロフィー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=duchenne-muscular-dystrophy) | 疾患群・病型の公式資料 |
| 2 | 遺伝性ATTRアミロイドーシス | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=hereditary-attr-amyloidosis) | 疾患群・病型の公式資料 |
| 3 | 脱髄型CMT | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-10-1) | 疾患群・病型の公式資料 |
| 4 | 軸索型CMT | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-10-2) | 疾患群・病型の公式資料 |
| 5 | 中間型CMT | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-10-3) | 疾患群・病型の公式資料 |
| 6 | 再発寛解型MS | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-1-1) | 疾患群・病型の公式資料 |
| 7 | 一次性進行型MS | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-1-2) | 疾患群・病型の公式資料 |
| 8 | 二次性進行型MS | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-1-3) | 疾患群・病型の公式資料 |
| 9 | 視神経脊髄炎 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-2) | 疾患群・病型の公式資料 |
| 10 | Baló病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-3) | 疾患群・病型の公式資料 |
| 11 | 皮質性小脳萎縮症 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-1-1) | 疾患群・病型の公式資料 |
| 12 | 脊髄小脳失調症３型 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-1) | 疾患群・病型の公式資料 |
| 13 | 脊髄小脳失調症６型 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-2) | 疾患群・病型の公式資料 |
| 14 | 歯状核赤核淡蒼球ルイ体萎縮症 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-3) | 疾患群・病型の公式資料 |
| 15 | 脊髄小脳失調症３１型 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-4) | 疾患群・病型の公式資料 |
| 16 | 脊髄小脳失調症７型 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-7) | 疾患群・病型の公式資料 |
| 17 | 家族性CJD | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-23-2-1) | 疾患群・病型の公式資料 |
| 18 | ゲルストマン・ストロイスラー・シャインカー病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-23-2-2) | 疾患群・病型の公式資料 |
| 19 | 多巣性運動ニューロパチー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-14-2) | 疾患群・病型の公式資料 |
| 20 | Niemann-Pick病A型 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-2-1) | 疾患群・病型の公式資料 |
| 21 | Niemann-Pick病B型 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-2-2) | 疾患群・病型の公式資料 |
| 22 | Tay-Sachs病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-5-1) | 疾患群・病型の公式資料 |
| 23 | Sandhoff病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-5-2) | 疾患群・病型の公式資料 |
| 24 | Hunter症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-13) | 疾患群・病型の公式資料 |
| 25 | Sanfilippo症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-14) | 疾患群・病型の公式資料 |
| 26 | Morquio症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-15) | 疾患群・病型の公式資料 |
| 27 | Pompe病（乳児型） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-27-1) | 疾患群・病型の公式資料 |
| 28 | Pompe病（成人型） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-27-3) | 疾患群・病型の公式資料 |
| 29 | 慢性進行性外眼筋麻痺症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-1) | 疾患群・病型の公式資料 |
| 30 | ミトコンドリア脳筋症・乳酸アシドーシス・脳卒中様発作症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-3) | 疾患群・病型の公式資料 |
| 31 | ミトコンドリア異常を伴うミオクローヌスてんかん | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-4) | 疾患群・病型の公式資料 |
| 32 | 副腎白質ジストロフィー（小児大脳型） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-20-1) | 疾患群・病型の公式資料 |
| 33 | ネマリンミオパチー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-1) | 疾患群・病型の公式資料 |
| 34 | ミニコア病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-3) | 疾患群・病型の公式資料 |
| 35 | ミオチュブラーミオパチー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-4) | 疾患群・病型の公式資料 |
| 36 | 中心核ミオパチー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-5) | 疾患群・病型の公式資料 |
| 37 | 全タイプ１繊維ミオパチー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-7) | 疾患群・病型の公式資料 |
| 38 | ベッカー型筋ジストロフィー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-1-2) | 疾患群・病型の公式資料 |
| 39 | 肢帯型筋ジストロフィー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-2) | 疾患群・病型の公式資料 |
| 40 | 顔面肩甲上腕型筋ジストロフィー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-3) | 疾患群・病型の公式資料 |
| 41 | 福山型先天性筋ジストロフィー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-6) | 疾患群・病型の公式資料 |
| 42 | 筋強直性ジストロフィー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-7) | 疾患群・病型の公式資料 |
| 43 | 先天性ミオトニー（トムゼン病（優性遺伝）） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-114-1-1) | 疾患群・病型の公式資料 |
| 44 | 先天性ミオトニー（ベッカー病（劣性遺伝）） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-114-1-2) | 疾患群・病型の公式資料 |
| 45 | ナトリウムチャネルミオトニー(カリウム惹起性ミオトニー) | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-114-2) | 疾患群・病型の公式資料 |
| 46 | 先天性パラミオトニー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-114-3) | 疾患群・病型の公式資料 |
| 47 | 遺伝性低カリウム性周期性四肢麻痺 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-115-1) | 疾患群・病型の公式資料 |
| 48 | 縁取り空胞を伴う遠位型ミオパチー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-30-2) | 疾患群・病型の公式資料 |
| 49 | 古典型エーラス・ダンロス症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-1) | 疾患群・病型の公式資料 |
| 50 | 関節型エーラス・ダンロス症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-2) | 疾患群・病型の公式資料 |
| 51 | 血管型エーラス・ダンロス症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-3) | 疾患群・病型の公式資料 |
| 52 | 後側彎型エーラス・ダンロス症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-4) | 疾患群・病型の公式資料 |
| 53 | 家族性寒冷蕁麻疹 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-106-1) | 疾患群・病型の公式資料 |
| 54 | CINCA症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-106-3) | 疾患群・病型の公式資料 |
| 55 | 全身型若年性特発性関節炎 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-107-1) | 疾患群・病型の公式資料 |
| 56 | 関節型若年性特発性関節炎 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-107-2) | 疾患群・病型の公式資料 |
| 57 | 先天性非典型溶血性尿毒症症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-109-1) | 疾患群・病型の公式資料 |
| 58 | 後天性非典型溶血性尿毒症症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-109-2) | 疾患群・病型の公式資料 |
| 59 | 温式自己免疫性溶血性貧血 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-61-1) | 疾患群・病型の公式資料 |
| 60 | 寒冷凝集素症 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-61-2) | 疾患群・病型の公式資料 |
| 61 | エヴァンズ症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-61-5) | 疾患群・病型の公式資料 |
| 62 | 古典的PNH | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-62-1) | 疾患群・病型の公式資料 |
| 63 | 骨髄不全型PNH | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-62-2) | 疾患群・病型の公式資料 |
| 64 | 先天性血栓性血小板減少性紫斑病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-64-1) | 疾患群・病型の公式資料 |
| 65 | 後天性原発性血栓性血小板減少性紫斑病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-64-2) | 疾患群・病型の公式資料 |
| 66 | X連鎖重症複合免疫不全症 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-1) | 疾患群・病型の公式資料 |
| 67 | 21-水酸化酵素欠損症 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-81-3) | 疾患群・病型の公式資料 |
| 68 | Allgrove症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-82-5) | 疾患群・病型の公式資料 |
| 69 | 特発性肺線維症 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-85-1) | 疾患群・病型の公式資料 |
| 70 | 小腸型クローン病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-96-1) | 疾患群・病型の公式資料 |
| 71 | 潰瘍性大腸炎（直腸炎型） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-97-3) | 疾患群・病型の公式資料 |
| 72 | 好酸球性食道炎 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-98-2) | 疾患群・病型の公式資料 |
| 73 | 意味性認知症 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-127-2) | 疾患別Orphanet資料 |
| 74 | 常染色体優性表皮融解性魚鱗癬 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-160-1-1) | 疾患別Orphanet資料 |
| 75 | 表在性表皮融解性魚鱗癬 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-160-1-3) | 疾患別Orphanet資料 |
| 76 | 水疱性類天疱瘡 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-162-1) | 疾患別Orphanet資料 |
| 77 | 粘膜類天疱瘡 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-162-2) | 疾患別Orphanet資料 |
| 78 | Scheie症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-11) | 疾患別Orphanet資料 |
| 79 | Hurler／Scheie症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-12) | 疾患別Orphanet資料 |
| 80 | ガラクトシアリドーシス | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-20) | 疾患別Orphanet資料 |
| 81 | β-マンノシドーシス | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-23) | 疾患別Orphanet資料 |
| 82 | ウォルマン病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-28-1) | 疾患別Orphanet資料 |
| 83 | シスチン症（非腎型） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-33-3) | 疾患別Orphanet資料 |
| 84 | 孤発性クロイツフェルト・ヤコブ病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-23-1) | 疾患別Orphanet資料 |
| 85 | 原発性高シュウ酸尿症Ⅰ型 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-234-5) | 疾患別Orphanet資料 |
| 86 | アカタラセミア | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-234-6) | 疾患別Orphanet資料 |
| 87 | Stargardt病 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-301-2) | 疾患別Orphanet資料 |
| 88 | 中心性輪紋状脈絡膜ジストロフィー | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-301-6) | 疾患別Orphanet資料 |
| 89 | 皮質下嚢胞をもつ大頭型白質脳症 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-308-1) | 疾患別Orphanet資料 |
| 90 | 天疱瘡（落葉状） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-35-2) | 疾患別Orphanet資料 |
| 91 | 天疱瘡（腫瘍随伴性） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-35-3) | 疾患別Orphanet資料 |
| 92 | 天疱瘡（紅斑性） | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-35-5) | 疾患別Orphanet資料 |
| 93 | 特発性再生不良性貧血 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-60-1) | 疾患別Orphanet資料 |
| 94 | 細網異形成症 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-2) | 疾患別Orphanet資料 |
| 95 | 道化師様魚鱗癬 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-160-2) | 疾患別Orphanet資料 |
| 96 | シェーグレン・ラルソン症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-160-4-2) | 疾患別Orphanet資料 |
| 97 | KID症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-160-4-3) | 疾患別Orphanet資料 |
| 98 | 多発関節弛緩型エーラス・ダンロス症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-5) | 疾患別Orphanet資料 |
| 99 | 皮膚脆弱型エーラス・ダンロス症候群 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-6) | 疾患別Orphanet資料 |
| 100 | 遺伝性高カリウム性周期性四肢麻痺 | [詳細](https://koki6174.github.io/rd-seizu/disease/?id=nando-115-2) | 疾患別Orphanet資料 |

### 今後の課題

未執筆688件の中には細分化された病型や小児慢性疾患群が含まれる。単に親疾患の文章を流用すると不正確になるため、各疾患概念の粒度・外部ID・臨床所見を先に確認し、疾病特異的な出典が得られるものから進める。
