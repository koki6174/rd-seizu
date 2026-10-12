# 新たな100疾患の解説（453→553件）

資料整理日：2026年10月12日

## この追加の対象と方法

- 同日の`main`に登録されていた**453疾患の原稿**と重複しない**100疾患**を、公開`disease_catalog`のIDで選定した。
- Orphanetの疾患別情報とOrphadataのHPO（Human Phenotype Ontology）症状データが存在する候補から、**84件は英語疾患名の一致、16件は類義表現による候補**として記録した。
- 重要：疾患概念の対応関係がすべて医学的に確定したわけではない。16件は特に`requires_concept_review: true`、他の84件も研究用クロスウォークの`pending`状態のままであり、**解説掲載を理由に座標用の疾患ID対応を自動承認しない**。
- 各記事は日本語で独自執筆し、`overview`（どんな病気？）、`dailyLife`（暮らしとの関係）、`currentState`（医療と研究の現在地）の3つを設けた。
- 参考文献には各疾患の[Orphanet個別概要](https://www.orpha.net/)とHPOに基づく疾患別症状一覧を登録。一般向けの医療情報として、全員の予後や一律の治療効果を断定しない。
- **監査区分**：出典にリンクした編集原稿。疾患名・ID・ORPHA番号・HPO件数・出典URL形式の機械的照合は実施するが、すべての原典本文を独立専門家が査読したものではない。臨床の診断・治療判断に利用しない。
- OrphadataのHPOデータに関する表示・再利用では[OrphadataのCC BY 4.0ライセンス案内](https://sciences.orphadata.com/phenotypes/)を参照。サイトの文章は原文からの長文転載を避けた独自要約。

## サイトへの導線

`/disease/?id=<catalog-id>`で従来と共通の詳細ページを表示する。光が灯っている星から選択すると「この病気について知る」へ進め、ランダム紹介で該当疾患が表示された場合も同じURLを使う。未点灯星の病名は星のクリックで開示しない。

## この100疾患の対照表

| No. | 正式な日本語病名 | カタログID | 医学情報の参照先 | 疾患概念照合 |
|---:|---|---|---|---|
| 1 | シュワルツ・ヤンペル（Schwartz-Jampel）症候群 | `shoman-11-21` | [ORPHA:800](https://www.orpha.net/en/disease/detail/800) | 英名一致候補 |
| 2 | スミス・レムリ・オピッツ症候群 | `nando-310-4` | [ORPHA:818](https://www.orpha.net/en/disease/detail/818) | 英名一致候補 |
| 3 | コルネリア・デランゲ症候群 | `nando-310-3` | [ORPHA:199](https://www.orpha.net/en/disease/detail/199) | 英名一致候補 |
| 4 | 先端巨大症 | `shoman-5-3` | [ORPHA:963](https://www.orpha.net/en/disease/detail/963) | 英名一致候補 |
| 5 | シェーグレン・ラルソン症候群 | `nando-160-4-2` | [ORPHA:816](https://www.orpha.net/en/disease/detail/816) | 英名一致候補 |
| 6 | チェディアック・東症候群 | `nando-65-30` | [ORPHA:167](https://www.orpha.net/en/disease/detail/167) | 英名一致候補 |
| 7 | ネイルパテラ症候群 | `nando-315-1` | [ORPHA:2614](https://www.orpha.net/en/disease/detail/2614) | 英名一致候補 |
| 8 | エカルディ・グティエール症候群 | `nando-325-3` | [ORPHA:51](https://www.orpha.net/en/disease/detail/51) | 英名一致候補 |
| 9 | Farber病 | `nando-19-9` | [ORPHA:333](https://www.orpha.net/en/disease/detail/333) | 英名一致候補 |
| 10 | 小児交互性片麻痺 | `shoman-11-25` | [ORPHA:2131](https://www.orpha.net/en/disease/detail/2131) | 英名一致候補 |
| 11 | 劇症型 | `nando-48-3` | [ORPHA:464343](https://www.orpha.net/en/disease/detail/464343) | 英名一致候補 |
| 12 | 急性肝不全（昏睡型） | `shoman-12-9` | [ORPHA:90062](https://www.orpha.net/en/disease/detail/90062) | 英名一致候補 |
| 13 | 酸性リパーゼ欠損症 | `nando-19-28` | [ORPHA:275761](https://www.orpha.net/en/disease/detail/275761) | 英名一致候補 |
| 14 | ナイミーヘン染色体不安定症候群 | `nando-65-12` | [ORPHA:647](https://www.orpha.net/en/disease/detail/647) | 英名一致候補 |
| 15 | 先天性修正大血管転位症 | `shoman-4-37` | [ORPHA:216694](https://www.orpha.net/en/disease/detail/216694) | 英名一致候補 |
| 16 | 線毛機能不全症候群 | `shoman-3-5` | [ORPHA:244](https://www.orpha.net/en/disease/detail/244) | 英名一致候補 |
| 17 | Krabbe病（若年型） | `nando-19-6-2` | [ORPHA:206443](https://www.orpha.net/en/disease/detail/206443) | 英名一致候補 |
| 18 | 混合型PNH | `nando-62-3` | [ORPHA:447](https://www.orpha.net/en/disease/detail/447) | 英名一致候補 |
| 19 | RIDDLE症候群 | `nando-65-16` | [ORPHA:420741](https://www.orpha.net/en/disease/detail/420741) | 英名一致候補 |
| 20 | グルカゴノーマ | `shoman-5-33` | [ORPHA:97280](https://www.orpha.net/en/disease/detail/97280) | 英名一致候補 |
| 21 | ムコリピドーシスIII型 | `nando-19-21-2` | [ORPHA:577](https://www.orpha.net/en/disease/detail/577) | 英名一致候補 |
| 22 | 先天性気管狭窄症 | `nando-330-1` | [ORPHA:141127](https://www.orpha.net/en/disease/detail/141127) | 英名一致候補 |
| 23 | 遺伝性出血性末梢血管拡張症 | `shoman-16-2` | [ORPHA:774](https://www.orpha.net/en/disease/detail/774) | 英名一致候補 |
| 24 | X連鎖無ガンマグロブリン血症 | `nando-65-23` | [ORPHA:47](https://www.orpha.net/en/disease/detail/47) | 英名一致候補 |
| 25 | レット（Rett）症候群 | `shoman-11-5` | [ORPHA:778](https://www.orpha.net/en/disease/detail/778) | 英名一致候補 |
| 26 | 真性多血症 | `shoman-9-11` | [ORPHA:729](https://www.orpha.net/en/disease/detail/729) | 英名一致候補 |
| 27 | 完全型房室中隔欠損症 | `shoman-4-44` | [ORPHA:1329](https://www.orpha.net/en/disease/detail/1329) | 英名一致候補 |
| 28 | ペリツェウス・メルツバッハ病 | `nando-139-1` | [ORPHA:702](https://www.orpha.net/en/disease/detail/702) | 英名一致候補 |
| 29 | 脊髄小脳失調症７型 | `nando-18-2-7` | [ORPHA:94147](https://www.orpha.net/en/disease/detail/94147) | 英名一致候補 |
| 30 | OTC欠損症 | `nando-251-2` | [ORPHA:664](https://www.orpha.net/en/disease/detail/664) | 英名一致候補 |
| 31 | 特発性肺ヘモジデローシス | `shoman-3-8` | [ORPHA:99931](https://www.orpha.net/en/disease/detail/99931) | 英名一致候補 |
| 32 | ICF症候群 | `nando-65-14` | [ORPHA:2268](https://www.orpha.net/en/disease/detail/2268) | 英名一致候補 |
| 33 | クリグラー・ナジャー（Crigler-Najjar）症候群 | `shoman-12-19` | [ORPHA:205](https://www.orpha.net/en/disease/detail/205) | 英名一致候補 |
| 34 | α1-アンチトリプシン欠損症 | `shoman-8-15` | [ORPHA:60](https://www.orpha.net/en/disease/detail/60) | 英名一致候補 |
| 35 | 天疱瘡（落葉状） | `nando-35-2` | [ORPHA:79481](https://www.orpha.net/en/disease/detail/79481) | 英名一致候補 |
| 36 | 細網異形成症 | `nando-65-2` | [ORPHA:33355](https://www.orpha.net/en/disease/detail/33355) | 英名一致候補 |
| 37 | 特発性肺線維症 | `nando-85-1` | [ORPHA:2032](https://www.orpha.net/en/disease/detail/2032) | 英名一致候補 |
| 38 | 下垂体性巨人症 | `shoman-5-2` | [ORPHA:99725](https://www.orpha.net/en/disease/detail/99725) | 英名一致候補 |
| 39 | 脊髄小脳失調症６型 | `nando-18-2-2` | [ORPHA:98758](https://www.orpha.net/en/disease/detail/98758) | 英名一致候補 |
| 40 | Sandhoff病 | `nando-19-5-2` | [ORPHA:796](https://www.orpha.net/en/disease/detail/796) | 英名一致候補 |
| 41 | 原発性高シュウ酸尿症Ⅰ型 | `nando-234-5` | [ORPHA:93598](https://www.orpha.net/en/disease/detail/93598) | 英名一致候補 |
| 42 | 道化師様魚鱗癬 | `nando-160-2` | [ORPHA:457](https://www.orpha.net/en/disease/detail/457) | 英名一致候補 |
| 43 | Scheie症候群 | `nando-19-11` | [ORPHA:93474](https://www.orpha.net/en/disease/detail/93474) | 英名一致候補 |
| 44 | Hurler／Scheie症候群 | `nando-19-12` | [ORPHA:93476](https://www.orpha.net/en/disease/detail/93476) | 英名一致候補 |
| 45 | ゲルストマン・ストロイスラー・シャインカー病 | `nando-23-2-2` | [ORPHA:356](https://www.orpha.net/en/disease/detail/356) | 英名一致候補 |
| 46 | 皮質下嚢胞をもつ大頭型白質脳症 | `nando-308-1` | [ORPHA:2478](https://www.orpha.net/en/disease/detail/2478) | 英名一致候補 |
| 47 | ウォルマン病 | `nando-19-28-1` | [ORPHA:75233](https://www.orpha.net/en/disease/detail/75233) | 英名一致候補 |
| 48 | アカタラセミア | `nando-234-6` | [ORPHA:926](https://www.orpha.net/en/disease/detail/926) | 英名一致候補 |
| 49 | 中心性輪紋状脈絡膜ジストロフィー | `nando-301-6` | [ORPHA:75377](https://www.orpha.net/en/disease/detail/75377) | 英名一致候補 |
| 50 | 慢性炎症性脱髄性多発神経炎 | `shoman-11-37` | [ORPHA:2932](https://www.orpha.net/en/disease/detail/2932) | 英名一致候補 |
| 51 | ベッカー型筋ジストロフィー | `nando-113-1-2` | [ORPHA:98895](https://www.orpha.net/en/disease/detail/98895) | 英名一致候補 |
| 52 | 脊髄小脳失調症３型 | `nando-18-2-1` | [ORPHA:98757](https://www.orpha.net/en/disease/detail/98757) | 英名一致候補 |
| 53 | Stargardt病 | `nando-301-2` | [ORPHA:827](https://www.orpha.net/en/disease/detail/827) | 英名一致候補 |
| 54 | 心内膜線維弾性症 | `shoman-4-18` | [ORPHA:2022](https://www.orpha.net/en/disease/detail/2022) | 英名一致候補 |
| 55 | デュシェンヌ型筋ジストロフィー | `duchenne-muscular-dystrophy` | [ORPHA:98896](https://www.orpha.net/en/disease/detail/98896) | 英名一致候補 |
| 56 | 水疱性類天疱瘡 | `nando-162-1` | [ORPHA:703](https://www.orpha.net/en/disease/detail/703) | 英名一致候補 |
| 57 | 天疱瘡（紅斑性） | `nando-35-5` | [ORPHA:79480](https://www.orpha.net/en/disease/detail/79480) | 英名一致候補 |
| 58 | 寒冷凝集素症 | `nando-61-2` | [ORPHA:56425](https://www.orpha.net/en/disease/detail/56425) | 英名一致候補 |
| 59 | 混合型 | `nando-61-4` | [ORPHA:90036](https://www.orpha.net/en/disease/detail/90036) | 英名一致候補 |
| 60 | 先天性魚鱗癬様紅皮症 | `nando-160-3-1` | [ORPHA:79394](https://www.orpha.net/en/disease/detail/79394) | 英名一致候補 |
| 61 | エヴァンズ症候群 | `nando-61-5` | [ORPHA:1959](https://www.orpha.net/en/disease/detail/1959) | 英名一致候補 |
| 62 | IMAge症候群 | `nando-82-3` | [ORPHA:85173](https://www.orpha.net/en/disease/detail/85173) | 英名一致候補 |
| 63 | 多巣性運動ニューロパチー | `nando-14-2` | [ORPHA:641](https://www.orpha.net/en/disease/detail/641) | 英名一致候補 |
| 64 | 痙攣重積型急性脳症 | `shoman-11-33` | [ORPHA:363549](https://www.orpha.net/en/disease/detail/363549) | 英名一致候補 |
| 65 | ファロー（Fallot）四徴症 | `shoman-4-33` | [ORPHA:3303](https://www.orpha.net/en/disease/detail/3303) | 英名一致候補 |
| 66 | 常染色体優性表皮融解性魚鱗癬 | `nando-160-1-1` | [ORPHA:312](https://www.orpha.net/en/disease/detail/312) | 英名一致候補 |
| 67 | 脊髄小脳失調症３１型 | `nando-18-2-4` | [ORPHA:217012](https://www.orpha.net/en/disease/detail/217012) | 英名一致候補 |
| 68 | 特発性再生不良性貧血 | `nando-60-1` | [ORPHA:88](https://www.orpha.net/en/disease/detail/88) | 英名一致候補 |
| 69 | 新生児ヘモクロマトーシス | `shoman-12-10` | [ORPHA:446](https://www.orpha.net/en/disease/detail/446) | 英名一致候補 |
| 70 | 微絨毛封入体病 | `shoman-12-2` | [ORPHA:2290](https://www.orpha.net/en/disease/detail/2290) | 英名一致候補 |
| 71 | 意味性認知症 | `nando-127-2` | [ORPHA:100069](https://www.orpha.net/en/disease/detail/100069) | 英名一致候補 |
| 72 | 後天性表皮水疱症 | `nando-162-3` | [ORPHA:46487](https://www.orpha.net/en/disease/detail/46487) | 英名一致候補 |
| 73 | アルギニン血症 | `nando-251-5` | [ORPHA:90](https://www.orpha.net/en/disease/detail/90) | 英名一致候補 |
| 74 | 先天性中枢性低換気症候群 | `shoman-3-3` | [ORPHA:661](https://www.orpha.net/en/disease/detail/661) | 英名一致候補 |
| 75 | ガラクトシアリドーシス | `nando-19-20` | [ORPHA:351](https://www.orpha.net/en/disease/detail/351) | 英名一致候補 |
| 76 | OCTN-2異常症 | `nando-316-4` | [ORPHA:158](https://www.orpha.net/en/disease/detail/158) | 英名一致候補 |
| 77 | リドル（Liddle）症候群 | `shoman-5-22` | [ORPHA:526](https://www.orpha.net/en/disease/detail/526) | 英名一致候補 |
| 78 | 表在性表皮融解性魚鱗癬 | `nando-160-1-3` | [ORPHA:455](https://www.orpha.net/en/disease/detail/455) | 英名一致候補 |
| 79 | 粘膜類天疱瘡 | `nando-162-2` | [ORPHA:46486](https://www.orpha.net/en/disease/detail/46486) | 英名一致候補 |
| 80 | 天疱瘡（腫瘍随伴性） | `nando-35-3` | [ORPHA:63455](https://www.orpha.net/en/disease/detail/63455) | 英名一致候補 |
| 81 | β-マンノシドーシス | `nando-19-23` | [ORPHA:118](https://www.orpha.net/en/disease/detail/118) | 英名一致候補 |
| 82 | アプラタキシン欠損症 | `nando-18-3-2` | [ORPHA:1168](https://www.orpha.net/en/disease/detail/1168) | 英名一致候補 |
| 83 | シスチン症（非腎型） | `nando-19-33-3` | [ORPHA:411641](https://www.orpha.net/en/disease/detail/411641) | 英名一致候補 |
| 84 | ヒアルロニダーゼ欠損症 | `nando-19-18` | [ORPHA:67041](https://www.orpha.net/en/disease/detail/67041) | 英名一致候補 |
| 85 | ロウ（Lowe）症候群 | `shoman-2-20` | [ORPHA:534](https://www.orpha.net/en/disease/detail/534) | 要概念照合 |
| 86 | Sanfilippo症候群 | `nando-19-14` | [ORPHA:581](https://www.orpha.net/en/disease/detail/581) | 要概念照合 |
| 87 | Hunter症候群 | `nando-19-13` | [ORPHA:580](https://www.orpha.net/en/disease/detail/580) | 要概念照合 |
| 88 | シムケ症候群 | `nando-65-17` | [ORPHA:1830](https://www.orpha.net/en/disease/detail/1830) | 要概念照合 |
| 89 | 先天性角化異常症 | `nando-60-4-2` | [ORPHA:1775](https://www.orpha.net/en/disease/detail/1775) | 要概念照合 |
| 90 | 糖原病Ⅰb型 | `nando-257-1-2` | [ORPHA:79259](https://www.orpha.net/en/disease/detail/79259) | 要概念照合 |
| 91 | 白質消失病 | `nando-308-2` | [ORPHA:135](https://www.orpha.net/en/disease/detail/135) | 要概念照合 |
| 92 | Niemann-Pick病B型 | `nando-19-2-2` | [ORPHA:77293](https://www.orpha.net/en/disease/detail/77293) | 要概念照合 |
| 93 | NAGS欠損症 | `nando-251-6` | [ORPHA:927](https://www.orpha.net/en/disease/detail/927) | 要概念照合 |
| 94 | 老人性トランスサイレチン型アミロイドーシス | `nando-28-1-2` | [ORPHA:330001](https://www.orpha.net/en/disease/detail/330001) | 要概念照合 |
| 95 | 新生児肝内胆汁うっ滞症 | `nando-318-1` | [ORPHA:247598](https://www.orpha.net/en/disease/detail/247598) | 要概念照合 |
| 96 | 表皮水疱症（キンドラー症候群） | `nando-36-5` | [ORPHA:2908](https://www.orpha.net/en/disease/detail/2908) | 要概念照合 |
| 97 | MHCクラスII欠損症 | `nando-65-9` | [ORPHA:572](https://www.orpha.net/en/disease/detail/572) | 要概念照合 |
| 98 | 顔面肩甲上腕型筋ジストロフィー | `nando-113-3` | [ORPHA:269](https://www.orpha.net/en/disease/detail/269) | 要概念照合 |
| 99 | 有馬症候群 | `nando-177-1` | [ORPHA:2318](https://www.orpha.net/en/disease/detail/2318) | 要概念照合 |
| 100 | ゴーハム病 | `nando-277-2` | [ORPHA:73](https://www.orpha.net/en/disease/detail/73) | 要概念照合 |

## 実装・検証

`content/disease_guides_orpha_05.json` ～ `content/disease_guides_orpha_08.json`に新しい4バッチを保存する。唯一の読み込み入口`content/disease-guides.js`で以前の453件と合わせて**553件**を読み込む。

`scripts/validate_disease_guides_orpha_next100_20261012.cjs`は既存の453件と合わせた一意性、対照表との疾患ID・正式名・ORPHA番号・HPO件数・未承認フラグの一致、全3節の存在、出典URL構造、既存の未点灯星制限を検査する。`scripts/audit_orpha_next100_text_lengths.py`は本文の日本語文字数を検算する。

**編集上の留保：** HPOはすべての人に現れる症状一覧ではない。欠測は症状がないことを意味せず、症状の頻度・経過・治療法には個人差がある。16件の候補について後日Orphanetの類義語、外部識別子、親子分類の原典で再確認し、誤対応があれば出典リンクまたは本文を修正する。
