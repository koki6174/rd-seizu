# 小児慢性特定疾病の解説100件を追加（553 → 653件）

**資料確認日：2026年10月12日**

## 対象と元データ

現在の`main`に存在する553件の解説IDと重複しない、公開`disease_catalog`の`shoman-*`分類から新規100件を追加した。疾患名とローカル疾患IDはSupabaseの原本100件に対して完全一致を検証し、`content/disease_guides_shoman_100_catalog_snapshot.json`に保存した。

- 腎臓・呼吸器・洞不全症候群：25件
- 心臓の不整脈・心筋・冠動脈など：25件
- 先天性心疾患・術後循環：25件
- 下垂体・甲状腺・副腎・性腺を中心とする内分泌疾患：25件

**新規100件の本文：16,905文字**（3本文の合計、文字数はPythonの`len`でCI再確認する）。
1件につき`overview`（概要）、`dailyLife`（暮らし）、`currentState`（医療・研究の現状）を日本語で個別に執筆した。データは`content/disease_guides_shoman_01.json`〜`04.json`。

## 出典・確認レベルと公開上の限界

一次資料：[小児慢性特定疾病情報センター：疾患群別一覧](https://www.shouman.jp/disease/search/group/)／[対象疾病一覧](https://www.shouman.jp/disease/search/disease_list)。

- **21件**は、疾患別解説の実在するURLを確認した（`sourceScope: condition_specific`）。
- **79件**は小児慢性特定疾病情報センターの**疾患群別一覧／分類**で名称を確認した。疾患別本文との逐語的なファクトチェックまで終わっていないため、記事レコードに`needsIndividualSourceReview: true`を付け、疾患別原典確認が必要なことを記録した。
- この区分は「公的資料に基づく執筆草稿」であり、個々の記事の医学的妥当性を専門医が独立確認したという意味ではない。情報を確認できない特定の治療効果、数値予後、生存率、薬の用量などは掲載していない。
- `shoman-*`は**小児慢性特定疾病の分類上の概念**であり、病型や背景原因を複数含む場合がある。特定の病型・年齢・治療適応を分類全体へ外挿しない。

**技術的検証は医学的な査読ではない。** 高い正確性が必要なページは疾患別解説と最新ガイドラインで追加確認し、改訂を継続する。

## 表示・導線

`/disease/?id=shoman-2-12`のように、既存の共通詳細ページに読込まれる。メインの3D星図では**点灯した星のみクリック可能**という制約を維持する。ランダム紹介で対象となった場合も同じURLを使用する。ユーザーの投稿内容、DB権限、研究用144疾患の非公開アクセス条件は変えていない。

`content/disease-guides.js`に4データファイルを追加し、全653件をIDによって重複排除して確認する。不要な医学的断定や研究用データの公開を追加しない。

## 追加100件の目録

| # | 疾患名 | 公開ページ | 出典の粒度 |
|---:|---|---|---|
| 1 | ネフローゼ症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-1) | 分類原典まで確認 |
| 2 | 慢性糸球体腎炎 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-2) | 分類原典まで確認 |
| 3 | 慢性尿細管間質性腎炎（尿路奇形が原因のものを除く。） | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-3) | 分類原典まで確認 |
| 4 | 慢性腎盂腎炎 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-4) | 分類原典まで確認 |
| 5 | アミロイド腎 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-5) | 分類原典まで確認 |
| 6 | 家族性若年性高尿酸血症性腎症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-6) | 分類原典まで確認 |
| 7 | 腎血管性高血圧 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-8) | 分類原典まで確認 |
| 8 | 腎静脈血栓症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-9) | 分類原典まで確認 |
| 9 | 腎動静脈瘻 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-10) | 分類原典まで確認 |
| 10 | 尿細管性アシドーシス | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-11) | 疾患別の公式原典を確認 |
| 11 | ギッテルマン（Gitelman）症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-12) | 疾患別の公式原典を確認 |
| 12 | バーター（Bartter）症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-13) | 分類原典まで確認 |
| 13 | 腎尿管結石 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-14) | 疾患別の公式原典を確認 |
| 14 | 慢性腎不全 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-15) | 分類原典まで確認 |
| 15 | 腎奇形 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-16) | 分類原典まで確認 |
| 16 | 尿路奇形 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-17) | 分類原典まで確認 |
| 17 | 萎縮腎（尿路奇形が原因のものを除く。） | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-18) | 分類原典まで確認 |
| 18 | ファンコーニ（Fanconi）症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-2-19) | 分類原典まで確認 |
| 19 | 気道狭窄 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-3-1) | 分類原典まで確認 |
| 20 | 気管支喘息 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-3-2) | 分類原典まで確認 |
| 21 | 間質性肺疾患 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-3-4) | 分類原典まで確認 |
| 22 | 気管支拡張症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-3-7) | 疾患別の公式原典を確認 |
| 23 | 慢性肺疾患 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-3-9) | 分類原典まで確認 |
| 24 | 先天性嚢胞性肺疾患 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-3-12) | 分類原典まで確認 |
| 25 | 洞不全症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-1) | 疾患別の公式原典を確認 |
| 26 | モビッツ（Mobitz）2型ブロック | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-2) | 分類原典まで確認 |
| 27 | 完全房室ブロック | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-3) | 疾患別の公式原典を確認 |
| 28 | 脚ブロック | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-4) | 分類原典まで確認 |
| 29 | 多源性心室期外収縮 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-5) | 分類原典まで確認 |
| 30 | 上室頻拍 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-6) | 分類原典まで確認 |
| 31 | 心室頻拍 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-7) | 分類原典まで確認 |
| 32 | 心房粗動 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-8) | 分類原典まで確認 |
| 33 | 心房細動 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-9) | 分類原典まで確認 |
| 34 | 心室細動 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-10) | 分類原典まで確認 |
| 35 | QT延長症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-11) | 疾患別の公式原典を確認 |
| 36 | 不整脈源性右室心筋症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-13) | 分類原典まで確認 |
| 37 | 心筋緻密化障害 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-14) | 分類原典まで確認 |
| 38 | 拡張型心筋症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-15) | 分類原典まで確認 |
| 39 | 心室瘤 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-17) | 分類原典まで確認 |
| 40 | 心臓腫瘍 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-19) | 分類原典まで確認 |
| 41 | 慢性心筋炎 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-20) | 分類原典まで確認 |
| 42 | 慢性心膜炎 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-21) | 分類原典まで確認 |
| 43 | 収縮性心膜炎 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-22) | 分類原典まで確認 |
| 44 | 先天性心膜欠損症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-23) | 疾患別の公式原典を確認 |
| 45 | 乳児特発性僧帽弁腱索断裂 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-24) | 分類原典まで確認 |
| 46 | 冠動脈起始異常 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-25) | 分類原典まで確認 |
| 47 | 川崎病性冠動脈瘤 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-26) | 分類原典まで確認 |
| 48 | 冠動脈狭窄症（川崎病によるものを除く。） | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-27) | 分類原典まで確認 |
| 49 | 虚血性心疾患 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-28) | 分類原典まで確認 |
| 50 | 肺動脈閉鎖症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-32) | 分類原典まで確認 |
| 51 | 両大血管左室起始症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-35) | 分類原典まで確認 |
| 52 | エプスタイン（Ebstein）病 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-38) | 分類原典まで確認 |
| 53 | 大動脈肺動脈窓 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-40) | 疾患別の公式原典を確認 |
| 54 | 三心房心 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-41) | 疾患別の公式原典を確認 |
| 55 | 動脈管開存症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-42) | 疾患別の公式原典を確認 |
| 56 | 心房中隔欠損症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-43) | 分類原典まで確認 |
| 57 | 心室中隔欠損症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-45) | 疾患別の公式原典を確認 |
| 58 | 肺静脈還流異常症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-46) | 分類原典まで確認 |
| 59 | 肺静脈狭窄症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-47) | 分類原典まで確認 |
| 60 | 左室右房交通症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-48) | 分類原典まで確認 |
| 61 | 右室二腔症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-49) | 疾患別の公式原典を確認 |
| 62 | 肺動脈弁下狭窄症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-50) | 分類原典まで確認 |
| 63 | 大動脈弁下狭窄症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-51) | 分類原典まで確認 |
| 64 | 肺動脈狭窄症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-52) | 分類原典まで確認 |
| 65 | 肺動脈弁欠損 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-53) | 疾患別の公式原典を確認 |
| 66 | 肺動脈上行大動脈起始症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-54) | 分類原典まで確認 |
| 67 | 一側肺動脈欠損 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-55) | 分類原典まで確認 |
| 68 | 大動脈狭窄症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-56) | 分類原典まで確認 |
| 69 | 大動脈弓閉塞症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-57) | 分類原典まで確認 |
| 70 | 血管輪 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-58) | 疾患別の公式原典を確認 |
| 71 | 大動脈瘤 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-59) | 分類原典まで確認 |
| 72 | 心臓弁膜症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-63) | 分類原典まで確認 |
| 73 | 僧帽弁弁上輪 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-64) | 分類原典まで確認 |
| 74 | 内臓錯位症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-65) | 分類原典まで確認 |
| 75 | フォンタン（Fontan）術後症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-4-66) | 疾患別の公式原典を確認 |
| 76 | 下垂体機能低下症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-1) | 分類原典まで確認 |
| 77 | 成長ホルモン分泌不全性低身長症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-4) | 分類原典まで確認 |
| 78 | 成長ホルモン不応性症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-5) | 分類原典まで確認 |
| 79 | 高プロラクチン血症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-6) | 疾患別の公式原典を確認 |
| 80 | 抗利尿ホルモン（ADH）不適切分泌症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-7) | 疾患別の公式原典を確認 |
| 81 | 尿崩症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-8) | 分類原典まで確認 |
| 82 | 中枢性塩喪失症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-9) | 疾患別の公式原典を確認 |
| 83 | 甲状腺機能亢進症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-10) | 分類原典まで確認 |
| 84 | 甲状腺機能低下症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-11) | 分類原典まで確認 |
| 85 | 腺腫様甲状腺腫 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-13) | 疾患別の公式原典を確認 |
| 86 | 副甲状腺機能亢進症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-14) | 疾患別の公式原典を確認 |
| 87 | 自己免疫性多内分泌腺症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-16) | 分類原典まで確認 |
| 88 | クッシング（Cushing）症候群 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-18) | 分類原典まで確認 |
| 89 | 慢性副腎皮質機能低下症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-19) | 分類原典まで確認 |
| 90 | アルドステロン症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-20) | 分類原典まで確認 |
| 91 | 見かけの鉱質コルチコイド過剰症候群（AME症候群） | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-21) | 分類原典まで確認 |
| 92 | 低アルドステロン症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-23) | 分類原典まで確認 |
| 93 | 偽性低アルドステロン症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-24) | 分類原典まで確認 |
| 94 | 先天性副腎過形成症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-25) | 分類原典まで確認 |
| 95 | 思春期早発症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-26) | 分類原典まで確認 |
| 96 | エストロゲン過剰症（思春期早発症を除く。） | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-27) | 分類原典まで確認 |
| 97 | アンドロゲン過剰症（思春期早発症を除く。） | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-28) | 分類原典まで確認 |
| 98 | 低ゴナドトロピン性性腺機能低下症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-29) | 分類原典まで確認 |
| 99 | 高ゴナドトロピン性性腺機能低下症 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-30) | 分類原典まで確認 |
| 100 | 性分化疾患 | [記事を見る](https://koki6174.github.io/rd-seizu/disease/?id=shoman-5-31) | 分類原典まで確認 |

## 再現テスト

- `scripts/validate_disease_guides_shoman100_20261012.cjs`：元553件＋新100件の重複、疾患名・IDの一致、出典URLドメインと疾患別・分類別の区分、表示導線を検査する。
- `scripts/audit_guide_shoman100_20261012.py`：全角・半角を同じ1文字として純粋な本文文字数をPythonで検証する。
- `.github/workflows/validate.yml`：既存の解説・セキュリティ回帰テストに上記を加え、GitHub Pages公開前に実行する。
