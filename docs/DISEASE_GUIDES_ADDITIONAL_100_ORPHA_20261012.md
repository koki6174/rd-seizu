# 追加100疾患の解説ページ｜2026年10月12日（ORPHA/HPO）

## 対応状況

既存の**353疾患**に重複しない**100疾患**を追加し、解説を**計453疾患**とする。4分割のJSONファイル `content/disease_guides_extra_13.json`～`16.json`に保存し、共通の詳細ページ `/disease/?id=<catalog_id>`を利用する。今回の100件の3節本文は計**19,227文字**。

対象疾患の正式ID・日本語病名・英語名とORPHAcodeは、Supabase `disease_catalog` と既存の疾患外部識別子対応テーブルを照合し、`content/disease_guides_extra_13_16_catalog_snapshot.json`に固定した。各疾患のHPO表現型と遺伝子注釈の出典情報も同じ監査用スナップショットに保存した。疾患名の一致と症状注釈の確認を、個々の文章の医学的妥当性の証明と混同しない。

## 内容と出典

各疾患を以下の3つの視点で個別に要約した。

- **どんな病気？**：定義・病因・病型と代表的な症状。乳児型・成人型・類似病名を混同しない。
- **暮らしとの関係**：本人の困りごとを一律に決めつけず、運動・食事・視覚・聴覚・コミュニケーションなどの配慮を具体化。
- **医療と研究の現在地**：診断や日常の健康管理、疾患ごとに利用される専門的な治療・リハビリなどを一般向けに記述。効果や予後を断定しない。

主要な出典は各記事の**Orphanet個別疾患ページ**（`ORPHAcode`）および同じ `ORPHAcode` の**Orphanet HPO症状ページ**。和名の照合にはNANDO/DBCLSの正式カタログも使用した。

- [Orphanet / Orphadata](https://www.orpha.net/)
- [Orphadata Sciences](https://sciences.orphadata.com/)
- [Human Phenotype Ontology](https://hpo.jax.org/)
- [NANDO / DBCLS](https://github.com/NanbyoData/nando)

**ファクトチェックの範囲**：国内DBの病名・ID、ORPHAcodeの一意性、疾患別のHPO注釈の存在、正式ソースURL形式、各記事の重複・本文長・出典先は自動照合済み。医学的解説文は資料ベースの編集原稿であり、**一文ごとの独立した専門家確認や掲載先Webページの最新記載との照合は未完了**。Orphanet個別ページの一部はアクセス制限によって自動取得できないため、公式ソースとの照合は取得済みのデータベース注釈も利用した。全100件を完全な医学的監修済み記事として扱わない。

既存の指定難病記事には番号索引を使ったものもあるが、今回は100件すべてが個別ORPHAcodeを持つので、番号索引だけでなく**疾患固有のOrphanet URL**を少なくとも2件ずつ記録した。本文の逐語転載ではなく独自の短い文章で構成した。

## 安全性と公開導線

- 従来の「この病気について知る」リンクと詳細ページの構成を維持。ランダム紹介や3Dの**点灯済み星だけ**から、存在する記事へ遷移する。
- 病名だけが同じ別病型への誘導はせず、**疾患IDを完全一致**して対応付ける。
- 暗い星は引き続き選択不可。コメント、投稿、抽選、研究用アクセス制限、患者情報は変更しない。
- 簡単な安全注意文「病状や治療は一人ひとり異なるため、この文章を診断・治療の判断に使わないでください。」を維持し、不要な定型句を増やさない。
- 医学解説は編集原稿として出典の更新・個別チェックが必要。

## 今回追加した100疾患

| No. | 疾患名 | ORPHAcode | 3節詳細ページ | 公式疾患情報 |
|---:|---|---:|---|---|
| 1 | リー脳症 | 506 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-2) | [Orphanet](https://www.orpha.net/en/disease/detail/506) |
| 2 | 硫黄欠乏性毛髪発育異常症 | 33364 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-160-4-9) | [Orphanet](https://www.orpha.net/en/disease/detail/33364) |
| 3 | GM1ガングリオシドーシス | 354 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-4) | [Orphanet](https://www.orpha.net/en/disease/detail/354) |
| 4 | α-マンノシドーシス（乳児型） | 309282 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-22-1) | [Orphanet](https://www.orpha.net/en/disease/detail/309282) |
| 5 | 有棘赤血球舞踏病 | 2388 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-9-1) | [Orphanet](https://www.orpha.net/en/disease/detail/2388) |
| 6 | Niemann-Pick病C型 | 646 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-3) | [Orphanet](https://www.orpha.net/en/disease/detail/646) |
| 7 | 神経線維腫症Ⅰ型 | 636 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-34-1) | [Orphanet](https://www.orpha.net/en/disease/detail/636) |
| 8 | 皮膚筋炎 | 221 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-50-1) | [Orphanet](https://www.orpha.net/en/disease/detail/221) |
| 9 | 自己免疫性リンパ増殖症候群 | 3261 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-32) | [Orphanet](https://www.orpha.net/en/disease/detail/3261) |
| 10 | Krabbe病（乳児型） | 206436 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-6-1) | [Orphanet](https://www.orpha.net/en/disease/detail/206436) |
| 11 | シュワッハマン・ダイアモンド症候群 | 811 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-36) | [Orphanet](https://www.orpha.net/en/disease/detail/811) |
| 12 | ブルーム症候群 | 125 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-13) | [Orphanet](https://www.orpha.net/en/disease/detail/125) |
| 13 | 免疫グロブリン性アミロイドーシス | 85443 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-28-1-1) | [Orphanet](https://www.orpha.net/en/disease/detail/85443) |
| 14 | ムコリピドーシスII型 | 576 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-21-1) | [Orphanet](https://www.orpha.net/en/disease/detail/576) |
| 15 | Hurler症候群 | 93473 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-10) | [Orphanet](https://www.orpha.net/en/disease/detail/93473) |
| 16 | 多発性筋炎 | 732 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-50-3) | [Orphanet](https://www.orpha.net/en/disease/detail/732) |
| 17 | 先天性筋線維タイプ不均等症 | 2020 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-6) | [Orphanet](https://www.orpha.net/en/disease/detail/2020) |
| 18 | IgG4関連腎臓病 | 449395 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-300-5) | [Orphanet](https://www.orpha.net/en/disease/detail/449395) |
| 19 | ウィスコット・オルドリッチ症候群 | 906 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-10) | [Orphanet](https://www.orpha.net/en/disease/detail/906) |
| 20 | シスチン症 | 213 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-33) | [Orphanet](https://www.orpha.net/en/disease/detail/213) |
| 21 | ツェルベーガー症候群 | 912 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-234-1-1) | [Orphanet](https://www.orpha.net/en/disease/detail/912) |
| 22 | アラン・ハーンドン・タドリー症候群 | 59 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-139-5) | [Orphanet](https://www.orpha.net/en/disease/detail/59) |
| 23 | GM1ガングリオシドーシス（乳児型） | 79255 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-4-1) | [Orphanet](https://www.orpha.net/en/disease/detail/79255) |
| 24 | 非典型的レット症候群 | 3095 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-156-2) | [Orphanet](https://www.orpha.net/en/disease/detail/3095) |
| 25 | 白血球接着不全症 | 2968 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-35) | [Orphanet](https://www.orpha.net/en/disease/detail/2968) |
| 26 | アルギニノコハク酸尿症 | 23 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-251-4) | [Orphanet](https://www.orpha.net/en/disease/detail/23) |
| 27 | 常染色体劣性多発性嚢胞腎 | 731 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-67-2) | [Orphanet](https://www.orpha.net/en/disease/detail/731) |
| 28 | 急性間欠性ポルフィリン症 | 79276 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-254-1) | [Orphanet](https://www.orpha.net/en/disease/detail/79276) |
| 29 | 先天性骨髄性ポルフィリン症 | 79277 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-254-6) | [Orphanet](https://www.orpha.net/en/disease/detail/79277) |
| 30 | Gaucher病１型 | 77259 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-1-1) | [Orphanet](https://www.orpha.net/en/disease/detail/77259) |
| 31 | Krabbe病 | 487 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-6) | [Orphanet](https://www.orpha.net/en/disease/detail/487) |
| 32 | 副腎白質ジストロフィー（副腎脊髄ニューロパチー） | 139399 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-20-3) | [Orphanet](https://www.orpha.net/en/disease/detail/139399) |
| 33 | 異染性白質ジストロフィー（成人型） | 309271 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-7-3) | [Orphanet](https://www.orpha.net/en/disease/detail/309271) |
| 34 | 異型ポルフィリン症 | 79473 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-254-3) | [Orphanet](https://www.orpha.net/en/disease/detail/79473) |
| 35 | 異染性白質ジストロフィー | 512 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-7) | [Orphanet](https://www.orpha.net/en/disease/detail/512) |
| 36 | Krabbe病（成人型） | 206448 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-6-3) | [Orphanet](https://www.orpha.net/en/disease/detail/206448) |
| 37 | ネザートン症候群 | 634 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-18) | [Orphanet](https://www.orpha.net/en/disease/detail/634) |
| 38 | エメリー・ドレイフス型筋ジストロフィー | 261 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-4) | [Orphanet](https://www.orpha.net/en/disease/detail/261) |
| 39 | α-マンノシドーシス | 61 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-22) | [Orphanet](https://www.orpha.net/en/disease/detail/61) |
| 40 | アスパルチルグルコサミン尿症 | 93 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-25) | [Orphanet](https://www.orpha.net/en/disease/detail/93) |
| 41 | 葉状魚鱗癬 | 313 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-160-3-2) | [Orphanet](https://www.orpha.net/en/disease/detail/313) |
| 42 | シアリドーシス（Ⅰ型） | 812 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-19-1) | [Orphanet](https://www.orpha.net/en/disease/detail/812) |
| 43 | CPT2欠損症 | 157 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-316-2) | [Orphanet](https://www.orpha.net/en/disease/detail/157) |
| 44 | 脊髄小脳失調症１型 | 98755 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-5) | [Orphanet](https://www.orpha.net/en/disease/detail/98755) |
| 45 | Gaucher病３型 | 77261 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-1-3) | [Orphanet](https://www.orpha.net/en/disease/detail/77261) |
| 46 | タナトフォリック骨異形成症１型 | 1860 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-275-1) | [Orphanet](https://www.orpha.net/en/disease/detail/1860) |
| 47 | ヘルマンスキー・パドラック症候群 | 79430 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-164-1) | [Orphanet](https://www.orpha.net/en/disease/detail/79430) |
| 48 | シスチン症（中間型） | 411634 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-33-2) | [Orphanet](https://www.orpha.net/en/disease/detail/411634) |
| 49 | 晩発性皮膚ポルフィリン症 | 101330 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-254-5) | [Orphanet](https://www.orpha.net/en/disease/detail/101330) |
| 50 | 肝中心静脈閉鎖症を伴う免疫不全症 | 79124 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-21) | [Orphanet](https://www.orpha.net/en/disease/detail/79124) |
| 51 | ビオチニダーゼ欠損症 | 79241 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-255-2) | [Orphanet](https://www.orpha.net/en/disease/detail/79241) |
| 52 | Muckle-Wells症候群 | 575 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-106-2) | [Orphanet](https://www.orpha.net/en/disease/detail/575) |
| 53 | ビタミンE単独欠乏性失調症 | 96 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-3-1) | [Orphanet](https://www.orpha.net/en/disease/detail/96) |
| 54 | 異染性白質ジストロフィー（若年型） | 309263 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-7-2) | [Orphanet](https://www.orpha.net/en/disease/detail/309263) |
| 55 | 肝性骨髄性ポルフィリン症 | 95159 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-254-8) | [Orphanet](https://www.orpha.net/en/disease/detail/95159) |
| 56 | 毛細血管拡張性運動失調症 | 100 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-11) | [Orphanet](https://www.orpha.net/en/disease/detail/100) |
| 57 | グリセリ症候群 | 381 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-164-3) | [Orphanet](https://www.orpha.net/en/disease/detail/381) |
| 58 | 異染性白質ジストロフィー（後期乳児型） | 309256 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-7-1) | [Orphanet](https://www.orpha.net/en/disease/detail/309256) |
| 59 | 眼咽頭遠位型ミオパチー | 98897 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-30-3) | [Orphanet](https://www.orpha.net/en/disease/detail/98897) |
| 60 | 多系統萎縮症（小脳型・MSA-C） | 227510 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-17-1) | [Orphanet](https://www.orpha.net/en/disease/detail/227510) |
| 61 | タナトフォリック骨異形成症２型 | 93274 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-275-2) | [Orphanet](https://www.orpha.net/en/disease/detail/93274) |
| 62 | ラフォラ病 | 501 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-309-2) | [Orphanet](https://www.orpha.net/en/disease/detail/501) |
| 63 | リンパ球性間質性肺炎 | 79128 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-85-2-6) | [Orphanet](https://www.orpha.net/en/disease/detail/79128) |
| 64 | Gaucher病２型 | 77260 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-1-2) | [Orphanet](https://www.orpha.net/en/disease/detail/77260) |
| 65 | 致死性家族性不眠症 | 466 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-23-2-3) | [Orphanet](https://www.orpha.net/en/disease/detail/466) |
| 66 | IgG4関連涙腺・眼窩および唾液腺病変 | 79078 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-300-4) | [Orphanet](https://www.orpha.net/en/disease/detail/79078) |
| 67 | 急性間質性肺炎 | 79126 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-85-2-2) | [Orphanet](https://www.orpha.net/en/disease/detail/79126) |
| 68 | Danon病 | 34587 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-29) | [Orphanet](https://www.orpha.net/en/disease/detail/34587) |
| 69 | 周期性好中球減少症 | 2686 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-34) | [Orphanet](https://www.orpha.net/en/disease/detail/2686) |
| 70 | シアリドーシス（Ⅱ型） | 87876 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-19-2) | [Orphanet](https://www.orpha.net/en/disease/detail/87876) |
| 71 | フコシドーシス | 349 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-24) | [Orphanet](https://www.orpha.net/en/disease/detail/349) |
| 72 | 遺伝性コプロポルフィリン症 | 79273 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-254-2) | [Orphanet](https://www.orpha.net/en/disease/detail/79273) |
| 73 | 慢性皮膚粘膜カンジダ症 | 1334 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-43) | [Orphanet](https://www.orpha.net/en/disease/detail/1334) |
| 74 | 多系統萎縮症（パーキンソン型・MSA-P） | 98933 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-17-2) | [Orphanet](https://www.orpha.net/en/disease/detail/98933) |
| 75 | α-マンノシドーシス（若年成人型） | 309288 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-22-2) | [Orphanet](https://www.orpha.net/en/disease/detail/309288) |
| 76 | 遊離シアル酸蓄積症 | 834 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-19-30) | [Orphanet](https://www.orpha.net/en/disease/detail/834) |
| 77 | 新生児型副腎白質ジストロフィー | 44 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-234-1-2) | [Orphanet](https://www.orpha.net/en/disease/detail/44) |
| 78 | アシル CoA オキシダーゼ欠損症 | 2971 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-234-2-1) | [Orphanet](https://www.orpha.net/en/disease/detail/2971) |
| 79 | プリンヌクレオシドホスホリラーゼ欠損症 | 760 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-5) | [Orphanet](https://www.orpha.net/en/disease/detail/760) |
| 80 | 後天性全身性脂肪萎縮症 | 79086 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-265-2) | [Orphanet](https://www.orpha.net/en/disease/detail/79086) |
| 81 | オーメン症候群 | 39041 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-4) | [Orphanet](https://www.orpha.net/en/disease/detail/39041) |
| 82 | 脊髄小脳失調症２型 | 98756 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-6) | [Orphanet](https://www.orpha.net/en/disease/detail/98756) |
| 83 | 脊髄小脳失調症３６型 | 276198 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-18-2-8) | [Orphanet](https://www.orpha.net/en/disease/detail/276198) |
| 84 | 乳児レフサム病 | 772 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-234-1-3) | [Orphanet](https://www.orpha.net/en/disease/detail/772) |
| 85 | 特発性器質化肺炎 | 1302 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-85-2-3) | [Orphanet](https://www.orpha.net/en/disease/detail/1302) |
| 86 | 眼咽頭筋型筋ジストロフィー | 270 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-113-5) | [Orphanet](https://www.orpha.net/en/disease/detail/270) |
| 87 | 常染色体優性多発性嚢胞腎 | 730 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-67-1) | [Orphanet](https://www.orpha.net/en/disease/detail/730) |
| 88 | 天疱瘡（増殖性） | 79479 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-35-4) | [Orphanet](https://www.orpha.net/en/disease/detail/79479) |
| 89 | セントラルコア病 | 597 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-111-2) | [Orphanet](https://www.orpha.net/en/disease/detail/597) |
| 90 | 肺毛細血管腫症 | 199241 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-87-2) | [Orphanet](https://www.orpha.net/en/disease/detail/199241) |
| 91 | 大脳優位型アレキサンダー病 | 363717 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-131-1) | [Orphanet](https://www.orpha.net/en/disease/detail/363717) |
| 92 | 慢性肉芽腫症 | 379 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-65-37) | [Orphanet](https://www.orpha.net/en/disease/detail/379) |
| 93 | 三好型ミオパチー | 45448 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-30-1) | [Orphanet](https://www.orpha.net/en/disease/detail/45448) |
| 94 | 好酸球性胃腸炎 | 2070 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-98-3) | [Orphanet](https://www.orpha.net/en/disease/detail/2070) |
| 95 | 急性発症ジストニア・パーキンソニズム | 71517 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-120-12-1) | [Orphanet](https://www.orpha.net/en/disease/detail/71517) |
| 96 | 延髄・脊髄優位型アレキサンダー病 | 363722 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-131-2) | [Orphanet](https://www.orpha.net/en/disease/detail/363722) |
| 97 | レーバー病 | 104 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-21-5) | [Orphanet](https://www.orpha.net/en/disease/detail/104) |
| 98 | 自己免疫性肺胞蛋白症 | 747 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-229-1) | [Orphanet](https://www.orpha.net/en/disease/detail/747) |
| 99 | ホロカルボキシラーゼ合成酵素欠損症 | 79242 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-255-1) | [Orphanet](https://www.orpha.net/en/disease/detail/79242) |
| 100 | 先天性赤血球形成異常性貧血 Type III | 98870 | [解説](https://koki6174.github.io/rd-seizu/disease/?id=nando-282-3) | [Orphanet](https://www.orpha.net/en/disease/detail/98870) |

## 今後の確認

疾患固有の薬物療法や治療の承認状況は国によって異なるため、更新が必要になった際は国内の診療ガイドライン・薬事承認情報を別途照合する。希少疾患のすべての症状を一つの記事で網羅できるわけではない。特に病型間で臨床像が異なる疾患は、親疾患と個別の病型を分けて見直す。
