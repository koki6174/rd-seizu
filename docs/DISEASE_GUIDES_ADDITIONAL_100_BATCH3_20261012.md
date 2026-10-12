# ねのね・病気の解説 第3回追加100疾患（2026-10-12）

## 既存ページを先に確認した結果

- GitHub `content/disease-guides.js`の既存データファイル14本には、重複のない**353疾患**が収録されていた。
- 内訳：指定難病の登録対象348件と個別疾患5件。疾患ごとに概要、暮らしとの関係、医療・研究の現在地、参考資料の共通ページがある。
- まだ説明のない残り888件の多くは、指定難病の内部病型と小児慢性特定疾病の疾患群。無作為に同じ親疾患の文章をコピーするのは避けた。
- 今回は医学的な区別が説明できる**100件**を新たに選定し、100件とも実際の `disease_catalog`のID・日本語名称・公開状態を照合した。既存353件と重複しない。

## 今回の文章・出典と公開範囲

25件ずつ4ファイルに収録：
- `content/disease_guides_extra_13.json`（神経・末梢神経・プリオン病等）
- `content/disease_guides_extra_14.json`（ライソゾーム・ミトコンドリア・副腎白質ジストロフィー等）
- `content/disease_guides_extra_15.json`（先天性筋疾患・筋ジストロフィー・筋チャネル病・結合組織等）
- `content/disease_guides_extra_16.json`（自己炎症・血液・免疫・腎・呼吸・消化管等）

**100疾患×3項目 = 本文合計18961文字**（正式病名、見出し、参照先URLを除き、Unicode文字数で集計）。合計453疾患について`/disease/?id=<catalog-id>`で詳細表示できる。

出典：難病情報センターの該当指定難病・病型の公式解説と、[NANDOの国内難病病型分類データ](https://github.com/NanbyoData/nando/blob/master/data/nanbyo.json)。疾患群の公式解説へ直接紐づけたものが87件あり、個別病型だけを対象とした独立した出典ではない場合がある。このときもリンク名を「疾患群の公式解説」とし、**個々の細分類まで独立に医学的査読済みという主張はしない**。細分類と実際の公開病名の対応はDBとNANDOで確認。

**注意**：公開できる編集原稿の医学的照合範囲は病型の分類と代表的症状・治療上の違いまで。症状と治療には個人差があり、医療専門家による独立した個別監修や、全100件に対する個別の原著論文の精査を完了したものではない。患者向けの診断・治療ガイドとして使わない。生存率・余命予測・個別薬剤用量は書かない。

## 参照元データと自動検証

- 疾患IDと名称の照合履歴：`content/disease_guides_extra_20261012_batch3_catalog_snapshot.json`
- 重複、公開DBの正式病名、文字数、HTTPSと許可ソース、星図との導線：`scripts/validate_disease_guides_extra100_batch3_20261012.cjs`
- 100本文のUnicode文字数：`scripts/audit_guide_extra100_batch3_20261012.py`
- ローダーのガード件数を353→453に、ブラウザのファイル参照バージョンを4→5に変更。既存の説明は保持。
- **未点灯の星は引き続きタップしても病名を開示しない**。医学的特徴量による研究用の非公開ページも変更しない。

## 新規100件の公開記事

| 番号 | 病気・病型 | カタログID | 記事 |
|---:|---|---|---|
| 1 | デュシェンヌ型筋ジストロフィー | `duchenne-muscular-dystrophy` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=duchenne-muscular-dystrophy) |
| 2 | 遺伝性ATTRアミロイドーシス | `hereditary-attr-amyloidosis` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=hereditary-attr-amyloidosis) |
| 3 | 脱髄型CMT | `nando-10-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-10-1) |
| 4 | 軸索型CMT | `nando-10-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-10-2) |
| 5 | 中間型CMT | `nando-10-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-10-3) |
| 6 | 再発寛解型MS | `nando-13-1-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-1-1) |
| 7 | 一次性進行型MS | `nando-13-1-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-1-2) |
| 8 | 二次性進行型MS | `nando-13-1-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-1-3) |
| 9 | 視神経脊髄炎 | `nando-13-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-2) |
| 10 | Baló病 | `nando-13-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-13-3) |
| 11 | 多系統萎縮症（小脳型・MSA-C） | `nando-17-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-17-1) |
| 12 | 多系統萎縮症（パーキンソン型・MSA-P） | `nando-17-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-17-2) |
| 13 | 皮質性小脳萎縮症 | `nando-18-1-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-1-1) |
| 14 | 脊髄小脳失調症３型 | `nando-18-2-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-1) |
| 15 | 脊髄小脳失調症６型 | `nando-18-2-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-2) |
| 16 | 歯状核赤核淡蒼球ルイ体萎縮症 | `nando-18-2-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-3) |
| 17 | 脊髄小脳失調症３１型 | `nando-18-2-4` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-4) |
| 18 | 脊髄小脳失調症１型 | `nando-18-2-5` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-5) |
| 19 | 脊髄小脳失調症２型 | `nando-18-2-6` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-6) |
| 20 | 脊髄小脳失調症７型 | `nando-18-2-7` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-7) |
| 21 | 脊髄小脳失調症３６型 | `nando-18-2-8` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-8) |
| 22 | 家族性CJD | `nando-23-2-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-23-2-1) |
| 23 | ゲルストマン・ストロイスラー・シャインカー病 | `nando-23-2-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-23-2-2) |
| 24 | 致死性家族性不眠症 | `nando-23-2-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-23-2-3) |
| 25 | 多巣性運動ニューロパチー | `nando-14-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-14-2) |
| 26 | Gaucher病１型 | `nando-19-1-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-1-1) |
| 27 | Gaucher病２型 | `nando-19-1-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-1-2) |
| 28 | Gaucher病３型 | `nando-19-1-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-1-3) |
| 29 | Niemann-Pick病A型 | `nando-19-2-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-2-1) |
| 30 | Niemann-Pick病B型 | `nando-19-2-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-2-2) |
| 31 | Niemann-Pick病C型 | `nando-19-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-3) |
| 32 | GM1ガングリオシドーシス | `nando-19-4` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-4) |
| 33 | Tay-Sachs病 | `nando-19-5-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-5-1) |
| 34 | Sandhoff病 | `nando-19-5-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-5-2) |
| 35 | Krabbe病 | `nando-19-6` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-6) |
| 36 | 異染性白質ジストロフィー | `nando-19-7` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-7) |
| 37 | Hurler症候群 | `nando-19-10` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-10) |
| 38 | Hunter症候群 | `nando-19-13` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-13) |
| 39 | Sanfilippo症候群 | `nando-19-14` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-14) |
| 40 | Morquio症候群 | `nando-19-15` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-15) |
| 41 | Pompe病（乳児型） | `nando-19-27-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-27-1) |
| 42 | Pompe病（成人型） | `nando-19-27-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-27-3) |
| 43 | シスチン症 | `nando-19-33` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-33) |
| 44 | 慢性進行性外眼筋麻痺症候群 | `nando-21-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-1) |
| 45 | リー脳症 | `nando-21-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-2) |
| 46 | ミトコンドリア脳筋症・乳酸アシドーシス・脳卒中様発作症候群 | `nando-21-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-3) |
| 47 | ミトコンドリア異常を伴うミオクローヌスてんかん | `nando-21-4` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-4) |
| 48 | レーバー病 | `nando-21-5` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-5) |
| 49 | 副腎白質ジストロフィー（小児大脳型） | `nando-20-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-20-1) |
| 50 | 副腎白質ジストロフィー（副腎脊髄ニューロパチー） | `nando-20-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-20-3) |
| 51 | ネマリンミオパチー | `nando-111-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-1) |
| 52 | セントラルコア病 | `nando-111-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-2) |
| 53 | ミニコア病 | `nando-111-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-3) |
| 54 | ミオチュブラーミオパチー | `nando-111-4` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-4) |
| 55 | 中心核ミオパチー | `nando-111-5` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-5) |
| 56 | 先天性筋線維タイプ不均等症 | `nando-111-6` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-6) |
| 57 | 全タイプ１繊維ミオパチー | `nando-111-7` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-7) |
| 58 | ベッカー型筋ジストロフィー | `nando-113-1-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-1-2) |
| 59 | 肢帯型筋ジストロフィー | `nando-113-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-2) |
| 60 | 顔面肩甲上腕型筋ジストロフィー | `nando-113-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-3) |
| 61 | エメリー・ドレイフス型筋ジストロフィー | `nando-113-4` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-4) |
| 62 | 眼咽頭筋型筋ジストロフィー | `nando-113-5` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-5) |
| 63 | 福山型先天性筋ジストロフィー | `nando-113-6` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-6) |
| 64 | 筋強直性ジストロフィー | `nando-113-7` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-7) |
| 65 | 先天性ミオトニー（トムゼン病（優性遺伝）） | `nando-114-1-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-114-1-1) |
| 66 | 先天性ミオトニー（ベッカー病（劣性遺伝）） | `nando-114-1-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-114-1-2) |
| 67 | ナトリウムチャネルミオトニー(カリウム惹起性ミオトニー) | `nando-114-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-114-2) |
| 68 | 先天性パラミオトニー | `nando-114-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-114-3) |
| 69 | 遺伝性低カリウム性周期性四肢麻痺 | `nando-115-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-115-1) |
| 70 | 三好型ミオパチー | `nando-30-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-30-1) |
| 71 | 縁取り空胞を伴う遠位型ミオパチー | `nando-30-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-30-2) |
| 72 | 古典型エーラス・ダンロス症候群 | `nando-168-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-1) |
| 73 | 関節型エーラス・ダンロス症候群 | `nando-168-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-2) |
| 74 | 血管型エーラス・ダンロス症候群 | `nando-168-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-3) |
| 75 | 後側彎型エーラス・ダンロス症候群 | `nando-168-4` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-168-4) |
| 76 | 家族性寒冷蕁麻疹 | `nando-106-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-106-1) |
| 77 | Muckle-Wells症候群 | `nando-106-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-106-2) |
| 78 | CINCA症候群 | `nando-106-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-106-3) |
| 79 | 全身型若年性特発性関節炎 | `nando-107-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-107-1) |
| 80 | 関節型若年性特発性関節炎 | `nando-107-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-107-2) |
| 81 | 先天性非典型溶血性尿毒症症候群 | `nando-109-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-109-1) |
| 82 | 後天性非典型溶血性尿毒症症候群 | `nando-109-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-109-2) |
| 83 | 温式自己免疫性溶血性貧血 | `nando-61-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-61-1) |
| 84 | 寒冷凝集素症 | `nando-61-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-61-2) |
| 85 | エヴァンズ症候群 | `nando-61-5` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-61-5) |
| 86 | 古典的PNH | `nando-62-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-62-1) |
| 87 | 骨髄不全型PNH | `nando-62-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-62-2) |
| 88 | 先天性血栓性血小板減少性紫斑病 | `nando-64-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-64-1) |
| 89 | 後天性原発性血栓性血小板減少性紫斑病 | `nando-64-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-64-2) |
| 90 | X連鎖重症複合免疫不全症 | `nando-65-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-1) |
| 91 | ウィスコット・オルドリッチ症候群 | `nando-65-10` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-10) |
| 92 | 毛細血管拡張性運動失調症 | `nando-65-11` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-11) |
| 93 | 常染色体優性多発性嚢胞腎 | `nando-67-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-67-1) |
| 94 | 常染色体劣性多発性嚢胞腎 | `nando-67-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-67-2) |
| 95 | 21-水酸化酵素欠損症 | `nando-81-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-81-3) |
| 96 | Allgrove症候群 | `nando-82-5` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-82-5) |
| 97 | 特発性肺線維症 | `nando-85-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-85-1) |
| 98 | 小腸型クローン病 | `nando-96-1` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-96-1) |
| 99 | 潰瘍性大腸炎（直腸炎型） | `nando-97-3` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-97-3) |
| 100 | 好酸球性食道炎 | `nando-98-2` | [詳細を表示](https://koki6174.github.io/rd-seizu/disease/?id=nando-98-2) |
