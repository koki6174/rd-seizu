# 追加100件の疾患別解説（2026-10-12）

## 現状と対象

追加前に既存記事を確認し、初期50件・後続300件・点灯星3件の合計**353件**がGitHubの`content/disease-guides.js`から読み込まれていることを確認しました。重複しない個別疾患・病型100件を追加し、**453件**に拡張しました。

100件はSupabaseで名称・ID・ORPHAcodeの対応付けと実際のHPO症状注釈がある疾患概念を候補にして選定。複数の病名を混同するリスクがある「劇症型」「混合型」などの名称だけの病型は候補から除外しました。最終的に100件すべてについて、源データに含まれるORPHAcodeと個別の病名を一対一で照合した研究用スナップショットを`content/disease_guides_ontology100_candidates_20261012.json`に保存しています。

## 医学情報の参照と限界

- データ：**Orphanet / Orphadata、Human Phenotype Ontology (HPO)、NANDO**。各記事末尾に、対応するOrphanet疾患別ページおよびHPO症状一覧のリンクを設置。
- 対応：`disease_orpha_mappings`で実際に照合できているORPHAcodeのみ選定し、HPO陽性注釈を持つ病型に限る。親疾患の名称だけから症状・病因を無条件に転用していない。
- 原稿：各疾患について独自に「どんな病気？」「暮らしとの関係」「医療と研究の現在地」を執筆。新規100件の3本文合計は**18100文字**（Unicode上の文字数、見出し・参照情報を除く）。
- **検証上の注意：各100件のOrphanet解説本文を1ページずつ全文精読して独立レビューしたものではない。** データベースの正式なID・症状注釈に基づく出典付きの編集原稿。医療上の細かな表現、最新の治療適応については医学的な確認がなお必要。
- 特定の治療が全病型・全員に適用されると誤解されないように記述。余命、生存率、処方用量は掲載しない。記載されていないHPO症状を「存在しない」とは判断しない。
- Orphadataの情報は[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)の対象で、出典のクレジットと原典リンクを保持。

## UI

共通の`/disease/?id=<catalog-id>`の詳細ページは、従来の概要・暮らし・医療の3セクションと参考文献表示を維持。光る星を選択したときと、ランダムで対象疾患に出会ったときに同じ導線が利用できます。**光っていない星をタップしても病名は見えません**。研究用3D星図の非公開認証・週次ポスター・投稿DBは変更していません。

## 追加100件一覧

| # | 疾患 | DB ID | 照合に用いた出典 | 解説URL |
|---:|---|---|---|---|
| 1 | リー脳症 | `nando-21-2` | [Orphanet (506)](https://www.orpha.net/en/disease/detail/506) | [記事](../disease/?id=nando-21-2) |
| 2 | 硫黄欠乏性毛髪発育異常症 | `nando-160-4-9` | [Orphanet (33364)](https://www.orpha.net/en/disease/detail/33364) | [記事](../disease/?id=nando-160-4-9) |
| 3 | GM1ガングリオシドーシス | `nando-19-4` | [Orphanet (354)](https://www.orpha.net/en/disease/detail/354) | [記事](../disease/?id=nando-19-4) |
| 4 | α-マンノシドーシス（乳児型） | `nando-19-22-1` | [Orphanet (309282)](https://www.orpha.net/en/disease/detail/309282) | [記事](../disease/?id=nando-19-22-1) |
| 5 | 有棘赤血球舞踏病 | `nando-9-1` | [Orphanet (2388)](https://www.orpha.net/en/disease/detail/2388) | [記事](../disease/?id=nando-9-1) |
| 6 | Niemann-Pick病C型 | `nando-19-3` | [Orphanet (646)](https://www.orpha.net/en/disease/detail/646) | [記事](../disease/?id=nando-19-3) |
| 7 | 神経線維腫症Ⅰ型 | `nando-34-1` | [Orphanet (636)](https://www.orpha.net/en/disease/detail/636) | [記事](../disease/?id=nando-34-1) |
| 8 | 皮膚筋炎 | `nando-50-1` | [Orphanet (221)](https://www.orpha.net/en/disease/detail/221) | [記事](../disease/?id=nando-50-1) |
| 9 | 自己免疫性リンパ増殖症候群 | `nando-65-32` | [Orphanet (3261)](https://www.orpha.net/en/disease/detail/3261) | [記事](../disease/?id=nando-65-32) |
| 10 | Krabbe病（乳児型） | `nando-19-6-1` | [Orphanet (206436)](https://www.orpha.net/en/disease/detail/206436) | [記事](../disease/?id=nando-19-6-1) |
| 11 | シュワッハマン・ダイアモンド症候群 | `nando-65-36` | [Orphanet (811)](https://www.orpha.net/en/disease/detail/811) | [記事](../disease/?id=nando-65-36) |
| 12 | ブルーム症候群 | `nando-65-13` | [Orphanet (125)](https://www.orpha.net/en/disease/detail/125) | [記事](../disease/?id=nando-65-13) |
| 13 | 免疫グロブリン性アミロイドーシス | `nando-28-1-1` | [Orphanet (85443)](https://www.orpha.net/en/disease/detail/85443) | [記事](../disease/?id=nando-28-1-1) |
| 14 | ムコリピドーシスII型 | `nando-19-21-1` | [Orphanet (576)](https://www.orpha.net/en/disease/detail/576) | [記事](../disease/?id=nando-19-21-1) |
| 15 | Hurler症候群 | `nando-19-10` | [Orphanet (93473)](https://www.orpha.net/en/disease/detail/93473) | [記事](../disease/?id=nando-19-10) |
| 16 | 多発性筋炎 | `nando-50-3` | [Orphanet (732)](https://www.orpha.net/en/disease/detail/732) | [記事](../disease/?id=nando-50-3) |
| 17 | 先天性筋線維タイプ不均等症 | `nando-111-6` | [Orphanet (2020)](https://www.orpha.net/en/disease/detail/2020) | [記事](../disease/?id=nando-111-6) |
| 18 | IgG4関連腎臓病 | `nando-300-5` | [Orphanet (449395)](https://www.orpha.net/en/disease/detail/449395) | [記事](../disease/?id=nando-300-5) |
| 19 | ウィスコット・オルドリッチ症候群 | `nando-65-10` | [Orphanet (906)](https://www.orpha.net/en/disease/detail/906) | [記事](../disease/?id=nando-65-10) |
| 20 | シスチン症 | `nando-19-33` | [Orphanet (213)](https://www.orpha.net/en/disease/detail/213) | [記事](../disease/?id=nando-19-33) |
| 21 | ツェルベーガー症候群 | `nando-234-1-1` | [Orphanet (912)](https://www.orpha.net/en/disease/detail/912) | [記事](../disease/?id=nando-234-1-1) |
| 22 | アラン・ハーンドン・タドリー症候群 | `nando-139-5` | [Orphanet (59)](https://www.orpha.net/en/disease/detail/59) | [記事](../disease/?id=nando-139-5) |
| 23 | GM1ガングリオシドーシス（乳児型） | `nando-19-4-1` | [Orphanet (79255)](https://www.orpha.net/en/disease/detail/79255) | [記事](../disease/?id=nando-19-4-1) |
| 24 | 非典型的レット症候群 | `nando-156-2` | [Orphanet (3095)](https://www.orpha.net/en/disease/detail/3095) | [記事](../disease/?id=nando-156-2) |
| 25 | 白血球接着不全症 | `nando-65-35` | [Orphanet (2968)](https://www.orpha.net/en/disease/detail/2968) | [記事](../disease/?id=nando-65-35) |
| 26 | アルギニノコハク酸尿症 | `nando-251-4` | [Orphanet (23)](https://www.orpha.net/en/disease/detail/23) | [記事](../disease/?id=nando-251-4) |
| 27 | 常染色体劣性多発性嚢胞腎 | `nando-67-2` | [Orphanet (731)](https://www.orpha.net/en/disease/detail/731) | [記事](../disease/?id=nando-67-2) |
| 28 | 急性間欠性ポルフィリン症 | `nando-254-1` | [Orphanet (79276)](https://www.orpha.net/en/disease/detail/79276) | [記事](../disease/?id=nando-254-1) |
| 29 | 先天性骨髄性ポルフィリン症 | `nando-254-6` | [Orphanet (79277)](https://www.orpha.net/en/disease/detail/79277) | [記事](../disease/?id=nando-254-6) |
| 30 | Gaucher病１型 | `nando-19-1-1` | [Orphanet (77259)](https://www.orpha.net/en/disease/detail/77259) | [記事](../disease/?id=nando-19-1-1) |
| 31 | Krabbe病 | `nando-19-6` | [Orphanet (487)](https://www.orpha.net/en/disease/detail/487) | [記事](../disease/?id=nando-19-6) |
| 32 | 副腎白質ジストロフィー（副腎脊髄ニューロパチー） | `nando-20-3` | [Orphanet (139399)](https://www.orpha.net/en/disease/detail/139399) | [記事](../disease/?id=nando-20-3) |
| 33 | 異染性白質ジストロフィー（成人型） | `nando-19-7-3` | [Orphanet (309271)](https://www.orpha.net/en/disease/detail/309271) | [記事](../disease/?id=nando-19-7-3) |
| 34 | 異型ポルフィリン症 | `nando-254-3` | [Orphanet (79473)](https://www.orpha.net/en/disease/detail/79473) | [記事](../disease/?id=nando-254-3) |
| 35 | 異染性白質ジストロフィー | `nando-19-7` | [Orphanet (512)](https://www.orpha.net/en/disease/detail/512) | [記事](../disease/?id=nando-19-7) |
| 36 | Krabbe病（成人型） | `nando-19-6-3` | [Orphanet (206448)](https://www.orpha.net/en/disease/detail/206448) | [記事](../disease/?id=nando-19-6-3) |
| 37 | ネザートン症候群 | `nando-65-18` | [Orphanet (634)](https://www.orpha.net/en/disease/detail/634) | [記事](../disease/?id=nando-65-18) |
| 38 | エメリー・ドレイフス型筋ジストロフィー | `nando-113-4` | [Orphanet (261)](https://www.orpha.net/en/disease/detail/261) | [記事](../disease/?id=nando-113-4) |
| 39 | α-マンノシドーシス | `nando-19-22` | [Orphanet (61)](https://www.orpha.net/en/disease/detail/61) | [記事](../disease/?id=nando-19-22) |
| 40 | アスパルチルグルコサミン尿症 | `nando-19-25` | [Orphanet (93)](https://www.orpha.net/en/disease/detail/93) | [記事](../disease/?id=nando-19-25) |
| 41 | 葉状魚鱗癬 | `nando-160-3-2` | [Orphanet (313)](https://www.orpha.net/en/disease/detail/313) | [記事](../disease/?id=nando-160-3-2) |
| 42 | シアリドーシス（Ⅰ型） | `nando-19-19-1` | [Orphanet (812)](https://www.orpha.net/en/disease/detail/812) | [記事](../disease/?id=nando-19-19-1) |
| 43 | CPT2欠損症 | `nando-316-2` | [Orphanet (157)](https://www.orpha.net/en/disease/detail/157) | [記事](../disease/?id=nando-316-2) |
| 44 | 脊髄小脳失調症１型 | `nando-18-2-5` | [Orphanet (98755)](https://www.orpha.net/en/disease/detail/98755) | [記事](../disease/?id=nando-18-2-5) |
| 45 | Gaucher病３型 | `nando-19-1-3` | [Orphanet (77261)](https://www.orpha.net/en/disease/detail/77261) | [記事](../disease/?id=nando-19-1-3) |
| 46 | タナトフォリック骨異形成症１型 | `nando-275-1` | [Orphanet (1860)](https://www.orpha.net/en/disease/detail/1860) | [記事](../disease/?id=nando-275-1) |
| 47 | ヘルマンスキー・パドラック症候群 | `nando-164-1` | [Orphanet (79430)](https://www.orpha.net/en/disease/detail/79430) | [記事](../disease/?id=nando-164-1) |
| 48 | シスチン症（中間型） | `nando-19-33-2` | [Orphanet (411634)](https://www.orpha.net/en/disease/detail/411634) | [記事](../disease/?id=nando-19-33-2) |
| 49 | 晩発性皮膚ポルフィリン症 | `nando-254-5` | [Orphanet (101330)](https://www.orpha.net/en/disease/detail/101330) | [記事](../disease/?id=nando-254-5) |
| 50 | 肝中心静脈閉鎖症を伴う免疫不全症 | `nando-65-21` | [Orphanet (79124)](https://www.orpha.net/en/disease/detail/79124) | [記事](../disease/?id=nando-65-21) |
| 51 | ビオチニダーゼ欠損症 | `nando-255-2` | [Orphanet (79241)](https://www.orpha.net/en/disease/detail/79241) | [記事](../disease/?id=nando-255-2) |
| 52 | Muckle-Wells症候群 | `nando-106-2` | [Orphanet (575)](https://www.orpha.net/en/disease/detail/575) | [記事](../disease/?id=nando-106-2) |
| 53 | ビタミンE単独欠乏性失調症 | `nando-18-3-1` | [Orphanet (96)](https://www.orpha.net/en/disease/detail/96) | [記事](../disease/?id=nando-18-3-1) |
| 54 | 異染性白質ジストロフィー（若年型） | `nando-19-7-2` | [Orphanet (309263)](https://www.orpha.net/en/disease/detail/309263) | [記事](../disease/?id=nando-19-7-2) |
| 55 | 肝性骨髄性ポルフィリン症 | `nando-254-8` | [Orphanet (95159)](https://www.orpha.net/en/disease/detail/95159) | [記事](../disease/?id=nando-254-8) |
| 56 | 毛細血管拡張性運動失調症 | `nando-65-11` | [Orphanet (100)](https://www.orpha.net/en/disease/detail/100) | [記事](../disease/?id=nando-65-11) |
| 57 | グリセリ症候群 | `nando-164-3` | [Orphanet (381)](https://www.orpha.net/en/disease/detail/381) | [記事](../disease/?id=nando-164-3) |
| 58 | 異染性白質ジストロフィー（後期乳児型） | `nando-19-7-1` | [Orphanet (309256)](https://www.orpha.net/en/disease/detail/309256) | [記事](../disease/?id=nando-19-7-1) |
| 59 | 眼咽頭遠位型ミオパチー | `nando-30-3` | [Orphanet (98897)](https://www.orpha.net/en/disease/detail/98897) | [記事](../disease/?id=nando-30-3) |
| 60 | 多系統萎縮症（小脳型・MSA-C） | `nando-17-1` | [Orphanet (227510)](https://www.orpha.net/en/disease/detail/227510) | [記事](../disease/?id=nando-17-1) |
| 61 | タナトフォリック骨異形成症２型 | `nando-275-2` | [Orphanet (93274)](https://www.orpha.net/en/disease/detail/93274) | [記事](../disease/?id=nando-275-2) |
| 62 | ラフォラ病 | `nando-309-2` | [Orphanet (501)](https://www.orpha.net/en/disease/detail/501) | [記事](../disease/?id=nando-309-2) |
| 63 | リンパ球性間質性肺炎 | `nando-85-2-6` | [Orphanet (79128)](https://www.orpha.net/en/disease/detail/79128) | [記事](../disease/?id=nando-85-2-6) |
| 64 | Gaucher病２型 | `nando-19-1-2` | [Orphanet (77260)](https://www.orpha.net/en/disease/detail/77260) | [記事](../disease/?id=nando-19-1-2) |
| 65 | 致死性家族性不眠症 | `nando-23-2-3` | [Orphanet (466)](https://www.orpha.net/en/disease/detail/466) | [記事](../disease/?id=nando-23-2-3) |
| 66 | IgG4関連涙腺・眼窩および唾液腺病変 | `nando-300-4` | [Orphanet (79078)](https://www.orpha.net/en/disease/detail/79078) | [記事](../disease/?id=nando-300-4) |
| 67 | 急性間質性肺炎 | `nando-85-2-2` | [Orphanet (79126)](https://www.orpha.net/en/disease/detail/79126) | [記事](../disease/?id=nando-85-2-2) |
| 68 | Danon病 | `nando-19-29` | [Orphanet (34587)](https://www.orpha.net/en/disease/detail/34587) | [記事](../disease/?id=nando-19-29) |
| 69 | 周期性好中球減少症 | `nando-65-34` | [Orphanet (2686)](https://www.orpha.net/en/disease/detail/2686) | [記事](../disease/?id=nando-65-34) |
| 70 | シアリドーシス（Ⅱ型） | `nando-19-19-2` | [Orphanet (87876)](https://www.orpha.net/en/disease/detail/87876) | [記事](../disease/?id=nando-19-19-2) |
| 71 | フコシドーシス | `nando-19-24` | [Orphanet (349)](https://www.orpha.net/en/disease/detail/349) | [記事](../disease/?id=nando-19-24) |
| 72 | 遺伝性コプロポルフィリン症 | `nando-254-2` | [Orphanet (79273)](https://www.orpha.net/en/disease/detail/79273) | [記事](../disease/?id=nando-254-2) |
| 73 | 慢性皮膚粘膜カンジダ症 | `nando-65-43` | [Orphanet (1334)](https://www.orpha.net/en/disease/detail/1334) | [記事](../disease/?id=nando-65-43) |
| 74 | 多系統萎縮症（パーキンソン型・MSA-P） | `nando-17-2` | [Orphanet (98933)](https://www.orpha.net/en/disease/detail/98933) | [記事](../disease/?id=nando-17-2) |
| 75 | α-マンノシドーシス（若年成人型） | `nando-19-22-2` | [Orphanet (309288)](https://www.orpha.net/en/disease/detail/309288) | [記事](../disease/?id=nando-19-22-2) |
| 76 | 遊離シアル酸蓄積症 | `nando-19-30` | [Orphanet (834)](https://www.orpha.net/en/disease/detail/834) | [記事](../disease/?id=nando-19-30) |
| 77 | 新生児型副腎白質ジストロフィー | `nando-234-1-2` | [Orphanet (44)](https://www.orpha.net/en/disease/detail/44) | [記事](../disease/?id=nando-234-1-2) |
| 78 | アシル CoA オキシダーゼ欠損症 | `nando-234-2-1` | [Orphanet (2971)](https://www.orpha.net/en/disease/detail/2971) | [記事](../disease/?id=nando-234-2-1) |
| 79 | プリンヌクレオシドホスホリラーゼ欠損症 | `nando-65-5` | [Orphanet (760)](https://www.orpha.net/en/disease/detail/760) | [記事](../disease/?id=nando-65-5) |
| 80 | 後天性全身性脂肪萎縮症 | `nando-265-2` | [Orphanet (79086)](https://www.orpha.net/en/disease/detail/79086) | [記事](../disease/?id=nando-265-2) |
| 81 | オーメン症候群 | `nando-65-4` | [Orphanet (39041)](https://www.orpha.net/en/disease/detail/39041) | [記事](../disease/?id=nando-65-4) |
| 82 | 脊髄小脳失調症２型 | `nando-18-2-6` | [Orphanet (98756)](https://www.orpha.net/en/disease/detail/98756) | [記事](../disease/?id=nando-18-2-6) |
| 83 | 脊髄小脳失調症３６型 | `nando-18-2-8` | [Orphanet (276198)](https://www.orpha.net/en/disease/detail/276198) | [記事](../disease/?id=nando-18-2-8) |
| 84 | 乳児レフサム病 | `nando-234-1-3` | [Orphanet (772)](https://www.orpha.net/en/disease/detail/772) | [記事](../disease/?id=nando-234-1-3) |
| 85 | 特発性器質化肺炎 | `nando-85-2-3` | [Orphanet (1302)](https://www.orpha.net/en/disease/detail/1302) | [記事](../disease/?id=nando-85-2-3) |
| 86 | 眼咽頭筋型筋ジストロフィー | `nando-113-5` | [Orphanet (270)](https://www.orpha.net/en/disease/detail/270) | [記事](../disease/?id=nando-113-5) |
| 87 | 常染色体優性多発性嚢胞腎 | `nando-67-1` | [Orphanet (730)](https://www.orpha.net/en/disease/detail/730) | [記事](../disease/?id=nando-67-1) |
| 88 | 天疱瘡（増殖性） | `nando-35-4` | [Orphanet (79479)](https://www.orpha.net/en/disease/detail/79479) | [記事](../disease/?id=nando-35-4) |
| 89 | セントラルコア病 | `nando-111-2` | [Orphanet (597)](https://www.orpha.net/en/disease/detail/597) | [記事](../disease/?id=nando-111-2) |
| 90 | 肺毛細血管腫症 | `nando-87-2` | [Orphanet (199241)](https://www.orpha.net/en/disease/detail/199241) | [記事](../disease/?id=nando-87-2) |
| 91 | 大脳優位型アレキサンダー病 | `nando-131-1` | [Orphanet (363717)](https://www.orpha.net/en/disease/detail/363717) | [記事](../disease/?id=nando-131-1) |
| 92 | 慢性肉芽腫症 | `nando-65-37` | [Orphanet (379)](https://www.orpha.net/en/disease/detail/379) | [記事](../disease/?id=nando-65-37) |
| 93 | 三好型ミオパチー | `nando-30-1` | [Orphanet (45448)](https://www.orpha.net/en/disease/detail/45448) | [記事](../disease/?id=nando-30-1) |
| 94 | 好酸球性胃腸炎 | `nando-98-3` | [Orphanet (2070)](https://www.orpha.net/en/disease/detail/2070) | [記事](../disease/?id=nando-98-3) |
| 95 | 急性発症ジストニア・パーキンソニズム | `nando-120-12-1` | [Orphanet (71517)](https://www.orpha.net/en/disease/detail/71517) | [記事](../disease/?id=nando-120-12-1) |
| 96 | 延髄・脊髄優位型アレキサンダー病 | `nando-131-2` | [Orphanet (363722)](https://www.orpha.net/en/disease/detail/363722) | [記事](../disease/?id=nando-131-2) |
| 97 | レーバー病 | `nando-21-5` | [Orphanet (104)](https://www.orpha.net/en/disease/detail/104) | [記事](../disease/?id=nando-21-5) |
| 98 | 自己免疫性肺胞蛋白症 | `nando-229-1` | [Orphanet (747)](https://www.orpha.net/en/disease/detail/747) | [記事](../disease/?id=nando-229-1) |
| 99 | ホロカルボキシラーゼ合成酵素欠損症 | `nando-255-1` | [Orphanet (79242)](https://www.orpha.net/en/disease/detail/79242) | [記事](../disease/?id=nando-255-1) |
| 100 | 先天性赤血球形成異常性貧血 Type III | `nando-282-3` | [Orphanet (98870)](https://www.orpha.net/en/disease/detail/98870) | [記事](../disease/?id=nando-282-3) |

## 自動検証

`scripts/validate_disease_guides_orpha100_20261012.cjs`：既存353件との重複、100の疾患ID・日本語名・ORPHAcode・HPO数の照合、本文・参考リンク・153/253/353件以前のテストと共存、未点灯星選択禁止をテスト。`scripts/audit_orpha100_text_lengths.py`で全角・半角を含む原稿文字数をPythonで確認。

出典：[Orphanet](https://www.orpha.net/en/disease) / [Orphadata](https://sciences.orphadata.com/orphanet-scientific-knowledge-files/) / [HPO](https://hpo.jax.org/) / [NANDO](https://github.com/NanbyoData/nando)。
