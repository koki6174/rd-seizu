# 追加100件：Orphadata・HPOの根拠に基づく病型別解説（2026-10-12）

## 公開前の現状調査

最新の`main`を読み、既存の記事が**353件**（優先50＋追加300＋現在点灯の3）あることを確認した。指定難病番号付き348疾患は既に解説済み。新たに作成する100件は、この353件と重複しない**NANDOの疾患下位分類**から選んだ。追加後の合計は**453件**。

## 選定と医学情報の参照

原典：**2026年7月版 Orphanet/Orphadata Science**の疾患分類と、[Orphadata HPO症状データ](https://sciences.orphadata.com/phenotypes/)（CC BY 4.0）。

- `disease_catalog`の正式日本語名と疾病IDがあり、既存の研究用`disease_orpha_mappings`に**疾患IDとORPHAcodeの一対一照合**があること
- `disease_hpo_annotations`に**少なくとも20件のHPO注釈**を持つこと（HPO情報がないものは特徴の裏付けが弱いため優先しない）
- NANDO日本語表示の「劇症型」のように単独では対象病態を判別しづらいエントリを除外すること
- HPO件数の多い順で上記条件を満たす100件を選定。文章は名称だけでなく、病型・年齢・主要な症状と治療上の制約を区別して編集した。
- 出典の識別子・HPO注釈（`frequency_raw`を含む原データ）を`content/disease_guides_orpha100_evidence_snapshot.json`に保持。**注釈が少ない＝症状がない、という意味ではない。** Negative/excludedな注釈を陽性症状として扱ってはならない。

一次情報：
- [Orphadata Science 2026年7月版](https://sciences.orphadata.com/orphanet-scientific-knowledge-files/)
- [Orphadata Science：臨床徴候・HPO](https://sciences.orphadata.com/phenotypes/)
- [Orphanet nomenclature・ORPHAcode](https://www.orphacode.org/pack-nomenclature/)
- [NANDOの病名・病型オントロジー](https://github.com/NanbyoData/nando)
- [難病情報センター：一般向け解説](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral)

各記事の参考リンクに疾患固有の`ORPHAcode`へ向かうURLを付けた。`ORPHAcode`の対応付けは元DBの照合に基づくが、**サイトから個別100ページすべてにHTTPアクセスできることは未確認**。アクセスできない場合は上記のOrphadataから識別子で調べる必要がある。

## 文章と公開上の位置づけ

各疾患に以下の3節を執筆した。

- どんな病気？（病態・特徴・病型との相違）
- 暮らしとの関係（生活への影響・必要な支援）
- 医療と研究の現在地（診断・治療上の選択肢と限界）

新しい100件の3節合計は**21,824文字**。各記事の日付は2026年10月12日。以前の353件は既存の資料確認日を保持するように、詳細ページの日付をデータ連動にした。

これは**公表済みオントロジー・HPO症状・一般的な医学的知識を突き合わせた編集原稿**であり、個別100件それぞれについて臨床専門家の査読や治療指針のすべての最新版照合を終えたものではない。薬の用量・余命・断定的な治療効果は載せない。研究用の`medical_identity_evidence`も専門医による診断の確証と同義ではない。

## 既存サイトとの統合と検証

`content/disease-guides.js`のローダーに`disease_guides_orpha100_part1.json`〜`part5.json`を追加し、453件を厳密に要求する。共通の`/disease/?id=...`から全記事を閲覧できる。

光が灯った星の詳細とランダム紹介は従来の「この病気について知る」を使う。未点灯の星のクリック抑制、一般投稿・コメント、非公開研究用星図の権限は変更しない。

自動検証：
- 353件との重複なし、新規100件の正式カタログID・日本語名・ORPHAcodeとHPO証拠の一致
- 各記事の3節、出典URLのHTTPS・許可ドメイン、記事の日付と既存注意書き
- ローダー453件、点灯した星の公開ルールと既存の全バッチの回帰チェック

## 新規100件・病型の索引

| # | 疾患・病型 | NANDOカタログID | 詳細解説 | Orphanet識別子 | HPO注釈件数 |
|---:|---|---|---|---|---:|
| 1 | リー脳症 | `nando-21-2` | [記事](../disease/?id=nando-21-2) | [ORPHA:506](https://www.orpha.net/en/disease/detail/506) | 98 |
| 2 | 硫黄欠乏性毛髪発育異常症 | `nando-160-4-9` | [記事](../disease/?id=nando-160-4-9) | [ORPHA:33364](https://www.orpha.net/en/disease/detail/33364) | 91 |
| 3 | GM1ガングリオシドーシス | `nando-19-4` | [記事](../disease/?id=nando-19-4) | [ORPHA:354](https://www.orpha.net/en/disease/detail/354) | 90 |
| 4 | α-マンノシドーシス（乳児型） | `nando-19-22-1` | [記事](../disease/?id=nando-19-22-1) | [ORPHA:309282](https://www.orpha.net/en/disease/detail/309282) | 88 |
| 5 | 有棘赤血球舞踏病 | `nando-9-1` | [記事](../disease/?id=nando-9-1) | [ORPHA:2388](https://www.orpha.net/en/disease/detail/2388) | 86 |
| 6 | Niemann-Pick病C型 | `nando-19-3` | [記事](../disease/?id=nando-19-3) | [ORPHA:646](https://www.orpha.net/en/disease/detail/646) | 82 |
| 7 | 神経線維腫症Ⅰ型 | `nando-34-1` | [記事](../disease/?id=nando-34-1) | [ORPHA:636](https://www.orpha.net/en/disease/detail/636) | 77 |
| 8 | 皮膚筋炎 | `nando-50-1` | [記事](../disease/?id=nando-50-1) | [ORPHA:221](https://www.orpha.net/en/disease/detail/221) | 76 |
| 9 | 自己免疫性リンパ増殖症候群 | `nando-65-32` | [記事](../disease/?id=nando-65-32) | [ORPHA:3261](https://www.orpha.net/en/disease/detail/3261) | 72 |
| 10 | Krabbe病（乳児型） | `nando-19-6-1` | [記事](../disease/?id=nando-19-6-1) | [ORPHA:206436](https://www.orpha.net/en/disease/detail/206436) | 70 |
| 11 | シュワッハマン・ダイアモンド症候群 | `nando-65-36` | [記事](../disease/?id=nando-65-36) | [ORPHA:811](https://www.orpha.net/en/disease/detail/811) | 69 |
| 12 | ブルーム症候群 | `nando-65-13` | [記事](../disease/?id=nando-65-13) | [ORPHA:125](https://www.orpha.net/en/disease/detail/125) | 67 |
| 13 | 免疫グロブリン性アミロイドーシス | `nando-28-1-1` | [記事](../disease/?id=nando-28-1-1) | [ORPHA:85443](https://www.orpha.net/en/disease/detail/85443) | 64 |
| 14 | ムコリピドーシスII型 | `nando-19-21-1` | [記事](../disease/?id=nando-19-21-1) | [ORPHA:576](https://www.orpha.net/en/disease/detail/576) | 63 |
| 15 | Hurler症候群 | `nando-19-10` | [記事](../disease/?id=nando-19-10) | [ORPHA:93473](https://www.orpha.net/en/disease/detail/93473) | 60 |
| 16 | 多発性筋炎 | `nando-50-3` | [記事](../disease/?id=nando-50-3) | [ORPHA:732](https://www.orpha.net/en/disease/detail/732) | 60 |
| 17 | 先天性筋線維タイプ不均等症 | `nando-111-6` | [記事](../disease/?id=nando-111-6) | [ORPHA:2020](https://www.orpha.net/en/disease/detail/2020) | 59 |
| 18 | IgG4関連腎臓病 | `nando-300-5` | [記事](../disease/?id=nando-300-5) | [ORPHA:449395](https://www.orpha.net/en/disease/detail/449395) | 58 |
| 19 | ウィスコット・オルドリッチ症候群 | `nando-65-10` | [記事](../disease/?id=nando-65-10) | [ORPHA:906](https://www.orpha.net/en/disease/detail/906) | 57 |
| 20 | シスチン症 | `nando-19-33` | [記事](../disease/?id=nando-19-33) | [ORPHA:213](https://www.orpha.net/en/disease/detail/213) | 56 |
| 21 | ツェルベーガー症候群 | `nando-234-1-1` | [記事](../disease/?id=nando-234-1-1) | [ORPHA:912](https://www.orpha.net/en/disease/detail/912) | 55 |
| 22 | アラン・ハーンドン・タドリー症候群 | `nando-139-5` | [記事](../disease/?id=nando-139-5) | [ORPHA:59](https://www.orpha.net/en/disease/detail/59) | 54 |
| 23 | GM1ガングリオシドーシス（乳児型） | `nando-19-4-1` | [記事](../disease/?id=nando-19-4-1) | [ORPHA:79255](https://www.orpha.net/en/disease/detail/79255) | 54 |
| 24 | 非典型的レット症候群 | `nando-156-2` | [記事](../disease/?id=nando-156-2) | [ORPHA:3095](https://www.orpha.net/en/disease/detail/3095) | 53 |
| 25 | 白血球接着不全症 | `nando-65-35` | [記事](../disease/?id=nando-65-35) | [ORPHA:2968](https://www.orpha.net/en/disease/detail/2968) | 52 |
| 26 | アルギニノコハク酸尿症 | `nando-251-4` | [記事](../disease/?id=nando-251-4) | [ORPHA:23](https://www.orpha.net/en/disease/detail/23) | 51 |
| 27 | 常染色体劣性多発性嚢胞腎 | `nando-67-2` | [記事](../disease/?id=nando-67-2) | [ORPHA:731](https://www.orpha.net/en/disease/detail/731) | 51 |
| 28 | 急性間欠性ポルフィリン症 | `nando-254-1` | [記事](../disease/?id=nando-254-1) | [ORPHA:79276](https://www.orpha.net/en/disease/detail/79276) | 50 |
| 29 | 先天性骨髄性ポルフィリン症 | `nando-254-6` | [記事](../disease/?id=nando-254-6) | [ORPHA:79277](https://www.orpha.net/en/disease/detail/79277) | 50 |
| 30 | Gaucher病１型 | `nando-19-1-1` | [記事](../disease/?id=nando-19-1-1) | [ORPHA:77259](https://www.orpha.net/en/disease/detail/77259) | 49 |
| 31 | Krabbe病 | `nando-19-6` | [記事](../disease/?id=nando-19-6) | [ORPHA:487](https://www.orpha.net/en/disease/detail/487) | 49 |
| 32 | 副腎白質ジストロフィー（副腎脊髄ニューロパチー） | `nando-20-3` | [記事](../disease/?id=nando-20-3) | [ORPHA:139399](https://www.orpha.net/en/disease/detail/139399) | 49 |
| 33 | 異染性白質ジストロフィー（成人型） | `nando-19-7-3` | [記事](../disease/?id=nando-19-7-3) | [ORPHA:309271](https://www.orpha.net/en/disease/detail/309271) | 48 |
| 34 | 異型ポルフィリン症 | `nando-254-3` | [記事](../disease/?id=nando-254-3) | [ORPHA:79473](https://www.orpha.net/en/disease/detail/79473) | 48 |
| 35 | 異染性白質ジストロフィー | `nando-19-7` | [記事](../disease/?id=nando-19-7) | [ORPHA:512](https://www.orpha.net/en/disease/detail/512) | 45 |
| 36 | Krabbe病（成人型） | `nando-19-6-3` | [記事](../disease/?id=nando-19-6-3) | [ORPHA:206448](https://www.orpha.net/en/disease/detail/206448) | 44 |
| 37 | ネザートン症候群 | `nando-65-18` | [記事](../disease/?id=nando-65-18) | [ORPHA:634](https://www.orpha.net/en/disease/detail/634) | 44 |
| 38 | エメリー・ドレイフス型筋ジストロフィー | `nando-113-4` | [記事](../disease/?id=nando-113-4) | [ORPHA:261](https://www.orpha.net/en/disease/detail/261) | 43 |
| 39 | α-マンノシドーシス | `nando-19-22` | [記事](../disease/?id=nando-19-22) | [ORPHA:61](https://www.orpha.net/en/disease/detail/61) | 43 |
| 40 | アスパルチルグルコサミン尿症 | `nando-19-25` | [記事](../disease/?id=nando-19-25) | [ORPHA:93](https://www.orpha.net/en/disease/detail/93) | 43 |
| 41 | 葉状魚鱗癬 | `nando-160-3-2` | [記事](../disease/?id=nando-160-3-2) | [ORPHA:313](https://www.orpha.net/en/disease/detail/313) | 42 |
| 42 | シアリドーシス（Ⅰ型） | `nando-19-19-1` | [記事](../disease/?id=nando-19-19-1) | [ORPHA:812](https://www.orpha.net/en/disease/detail/812) | 42 |
| 43 | CPT2欠損症 | `nando-316-2` | [記事](../disease/?id=nando-316-2) | [ORPHA:157](https://www.orpha.net/en/disease/detail/157) | 42 |
| 44 | 脊髄小脳失調症１型 | `nando-18-2-5` | [記事](../disease/?id=nando-18-2-5) | [ORPHA:98755](https://www.orpha.net/en/disease/detail/98755) | 40 |
| 45 | Gaucher病３型 | `nando-19-1-3` | [記事](../disease/?id=nando-19-1-3) | [ORPHA:77261](https://www.orpha.net/en/disease/detail/77261) | 40 |
| 46 | タナトフォリック骨異形成症１型 | `nando-275-1` | [記事](../disease/?id=nando-275-1) | [ORPHA:1860](https://www.orpha.net/en/disease/detail/1860) | 40 |
| 47 | ヘルマンスキー・パドラック症候群 | `nando-164-1` | [記事](../disease/?id=nando-164-1) | [ORPHA:79430](https://www.orpha.net/en/disease/detail/79430) | 39 |
| 48 | シスチン症（中間型） | `nando-19-33-2` | [記事](../disease/?id=nando-19-33-2) | [ORPHA:411634](https://www.orpha.net/en/disease/detail/411634) | 39 |
| 49 | 晩発性皮膚ポルフィリン症 | `nando-254-5` | [記事](../disease/?id=nando-254-5) | [ORPHA:101330](https://www.orpha.net/en/disease/detail/101330) | 39 |
| 50 | 肝中心静脈閉鎖症を伴う免疫不全症 | `nando-65-21` | [記事](../disease/?id=nando-65-21) | [ORPHA:79124](https://www.orpha.net/en/disease/detail/79124) | 39 |
| 51 | ビオチニダーゼ欠損症 | `nando-255-2` | [記事](../disease/?id=nando-255-2) | [ORPHA:79241](https://www.orpha.net/en/disease/detail/79241) | 38 |
| 52 | Muckle-Wells症候群 | `nando-106-2` | [記事](../disease/?id=nando-106-2) | [ORPHA:575](https://www.orpha.net/en/disease/detail/575) | 37 |
| 53 | ビタミンE単独欠乏性失調症 | `nando-18-3-1` | [記事](../disease/?id=nando-18-3-1) | [ORPHA:96](https://www.orpha.net/en/disease/detail/96) | 37 |
| 54 | 異染性白質ジストロフィー（若年型） | `nando-19-7-2` | [記事](../disease/?id=nando-19-7-2) | [ORPHA:309263](https://www.orpha.net/en/disease/detail/309263) | 37 |
| 55 | 肝性骨髄性ポルフィリン症 | `nando-254-8` | [記事](../disease/?id=nando-254-8) | [ORPHA:95159](https://www.orpha.net/en/disease/detail/95159) | 37 |
| 56 | 毛細血管拡張性運動失調症 | `nando-65-11` | [記事](../disease/?id=nando-65-11) | [ORPHA:100](https://www.orpha.net/en/disease/detail/100) | 37 |
| 57 | グリセリ症候群 | `nando-164-3` | [記事](../disease/?id=nando-164-3) | [ORPHA:381](https://www.orpha.net/en/disease/detail/381) | 36 |
| 58 | 異染性白質ジストロフィー（後期乳児型） | `nando-19-7-1` | [記事](../disease/?id=nando-19-7-1) | [ORPHA:309256](https://www.orpha.net/en/disease/detail/309256) | 36 |
| 59 | 眼咽頭遠位型ミオパチー | `nando-30-3` | [記事](../disease/?id=nando-30-3) | [ORPHA:98897](https://www.orpha.net/en/disease/detail/98897) | 36 |
| 60 | 多系統萎縮症（小脳型・MSA-C） | `nando-17-1` | [記事](../disease/?id=nando-17-1) | [ORPHA:227510](https://www.orpha.net/en/disease/detail/227510) | 35 |
| 61 | タナトフォリック骨異形成症２型 | `nando-275-2` | [記事](../disease/?id=nando-275-2) | [ORPHA:93274](https://www.orpha.net/en/disease/detail/93274) | 35 |
| 62 | ラフォラ病 | `nando-309-2` | [記事](../disease/?id=nando-309-2) | [ORPHA:501](https://www.orpha.net/en/disease/detail/501) | 35 |
| 63 | リンパ球性間質性肺炎 | `nando-85-2-6` | [記事](../disease/?id=nando-85-2-6) | [ORPHA:79128](https://www.orpha.net/en/disease/detail/79128) | 34 |
| 64 | Gaucher病２型 | `nando-19-1-2` | [記事](../disease/?id=nando-19-1-2) | [ORPHA:77260](https://www.orpha.net/en/disease/detail/77260) | 33 |
| 65 | 致死性家族性不眠症 | `nando-23-2-3` | [記事](../disease/?id=nando-23-2-3) | [ORPHA:466](https://www.orpha.net/en/disease/detail/466) | 33 |
| 66 | IgG4関連涙腺・眼窩および唾液腺病変 | `nando-300-4` | [記事](../disease/?id=nando-300-4) | [ORPHA:79078](https://www.orpha.net/en/disease/detail/79078) | 33 |
| 67 | 急性間質性肺炎 | `nando-85-2-2` | [記事](../disease/?id=nando-85-2-2) | [ORPHA:79126](https://www.orpha.net/en/disease/detail/79126) | 33 |
| 68 | Danon病 | `nando-19-29` | [記事](../disease/?id=nando-19-29) | [ORPHA:34587](https://www.orpha.net/en/disease/detail/34587) | 32 |
| 69 | 周期性好中球減少症 | `nando-65-34` | [記事](../disease/?id=nando-65-34) | [ORPHA:2686](https://www.orpha.net/en/disease/detail/2686) | 32 |
| 70 | シアリドーシス（Ⅱ型） | `nando-19-19-2` | [記事](../disease/?id=nando-19-19-2) | [ORPHA:87876](https://www.orpha.net/en/disease/detail/87876) | 31 |
| 71 | フコシドーシス | `nando-19-24` | [記事](../disease/?id=nando-19-24) | [ORPHA:349](https://www.orpha.net/en/disease/detail/349) | 31 |
| 72 | 遺伝性コプロポルフィリン症 | `nando-254-2` | [記事](../disease/?id=nando-254-2) | [ORPHA:79273](https://www.orpha.net/en/disease/detail/79273) | 31 |
| 73 | 慢性皮膚粘膜カンジダ症 | `nando-65-43` | [記事](../disease/?id=nando-65-43) | [ORPHA:1334](https://www.orpha.net/en/disease/detail/1334) | 31 |
| 74 | 多系統萎縮症（パーキンソン型・MSA-P） | `nando-17-2` | [記事](../disease/?id=nando-17-2) | [ORPHA:98933](https://www.orpha.net/en/disease/detail/98933) | 30 |
| 75 | α-マンノシドーシス（若年成人型） | `nando-19-22-2` | [記事](../disease/?id=nando-19-22-2) | [ORPHA:309288](https://www.orpha.net/en/disease/detail/309288) | 30 |
| 76 | 遊離シアル酸蓄積症 | `nando-19-30` | [記事](../disease/?id=nando-19-30) | [ORPHA:834](https://www.orpha.net/en/disease/detail/834) | 30 |
| 77 | 新生児型副腎白質ジストロフィー | `nando-234-1-2` | [記事](../disease/?id=nando-234-1-2) | [ORPHA:44](https://www.orpha.net/en/disease/detail/44) | 29 |
| 78 | アシル CoA オキシダーゼ欠損症 | `nando-234-2-1` | [記事](../disease/?id=nando-234-2-1) | [ORPHA:2971](https://www.orpha.net/en/disease/detail/2971) | 29 |
| 79 | プリンヌクレオシドホスホリラーゼ欠損症 | `nando-65-5` | [記事](../disease/?id=nando-65-5) | [ORPHA:760](https://www.orpha.net/en/disease/detail/760) | 29 |
| 80 | 後天性全身性脂肪萎縮症 | `nando-265-2` | [記事](../disease/?id=nando-265-2) | [ORPHA:79086](https://www.orpha.net/en/disease/detail/79086) | 28 |
| 81 | オーメン症候群 | `nando-65-4` | [記事](../disease/?id=nando-65-4) | [ORPHA:39041](https://www.orpha.net/en/disease/detail/39041) | 28 |
| 82 | 脊髄小脳失調症２型 | `nando-18-2-6` | [記事](../disease/?id=nando-18-2-6) | [ORPHA:98756](https://www.orpha.net/en/disease/detail/98756) | 27 |
| 83 | 脊髄小脳失調症３６型 | `nando-18-2-8` | [記事](../disease/?id=nando-18-2-8) | [ORPHA:276198](https://www.orpha.net/en/disease/detail/276198) | 27 |
| 84 | 乳児レフサム病 | `nando-234-1-3` | [記事](../disease/?id=nando-234-1-3) | [ORPHA:772](https://www.orpha.net/en/disease/detail/772) | 27 |
| 85 | 特発性器質化肺炎 | `nando-85-2-3` | [記事](../disease/?id=nando-85-2-3) | [ORPHA:1302](https://www.orpha.net/en/disease/detail/1302) | 27 |
| 86 | 眼咽頭筋型筋ジストロフィー | `nando-113-5` | [記事](../disease/?id=nando-113-5) | [ORPHA:270](https://www.orpha.net/en/disease/detail/270) | 26 |
| 87 | 常染色体優性多発性嚢胞腎 | `nando-67-1` | [記事](../disease/?id=nando-67-1) | [ORPHA:730](https://www.orpha.net/en/disease/detail/730) | 26 |
| 88 | 天疱瘡（増殖性） | `nando-35-4` | [記事](../disease/?id=nando-35-4) | [ORPHA:79479](https://www.orpha.net/en/disease/detail/79479) | 25 |
| 89 | セントラルコア病 | `nando-111-2` | [記事](../disease/?id=nando-111-2) | [ORPHA:597](https://www.orpha.net/en/disease/detail/597) | 24 |
| 90 | 肺毛細血管腫症 | `nando-87-2` | [記事](../disease/?id=nando-87-2) | [ORPHA:199241](https://www.orpha.net/en/disease/detail/199241) | 23 |
| 91 | 大脳優位型アレキサンダー病 | `nando-131-1` | [記事](../disease/?id=nando-131-1) | [ORPHA:363717](https://www.orpha.net/en/disease/detail/363717) | 22 |
| 92 | 慢性肉芽腫症 | `nando-65-37` | [記事](../disease/?id=nando-65-37) | [ORPHA:379](https://www.orpha.net/en/disease/detail/379) | 22 |
| 93 | 三好型ミオパチー | `nando-30-1` | [記事](../disease/?id=nando-30-1) | [ORPHA:45448](https://www.orpha.net/en/disease/detail/45448) | 21 |
| 94 | 好酸球性胃腸炎 | `nando-98-3` | [記事](../disease/?id=nando-98-3) | [ORPHA:2070](https://www.orpha.net/en/disease/detail/2070) | 21 |
| 95 | 急性発症ジストニア・パーキンソニズム | `nando-120-12-1` | [記事](../disease/?id=nando-120-12-1) | [ORPHA:71517](https://www.orpha.net/en/disease/detail/71517) | 20 |
| 96 | 延髄・脊髄優位型アレキサンダー病 | `nando-131-2` | [記事](../disease/?id=nando-131-2) | [ORPHA:363722](https://www.orpha.net/en/disease/detail/363722) | 20 |
| 97 | レーバー病 | `nando-21-5` | [記事](../disease/?id=nando-21-5) | [ORPHA:104](https://www.orpha.net/en/disease/detail/104) | 20 |
| 98 | 自己免疫性肺胞蛋白症 | `nando-229-1` | [記事](../disease/?id=nando-229-1) | [ORPHA:747](https://www.orpha.net/en/disease/detail/747) | 20 |
| 99 | ホロカルボキシラーゼ合成酵素欠損症 | `nando-255-1` | [記事](../disease/?id=nando-255-1) | [ORPHA:79242](https://www.orpha.net/en/disease/detail/79242) | 20 |
| 100 | 先天性赤血球形成異常性貧血 Type III | `nando-282-3` | [記事](../disease/?id=nando-282-3) | [ORPHA:98870](https://www.orpha.net/en/disease/detail/98870) | 20 |
