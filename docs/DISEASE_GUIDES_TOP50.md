# 「この病気について知る」：ランダム紹介上位50件の解説

## 確認方法（2026-10-11）

- 対象はSupabase `disease_catalog.discovery_rank` の**1〜50位をその時点で昇順に取得した50疾患**。患者数そのものやランダム抽選の内部ルールをユーザー画面に開示するものではない。
- 原典は[難病情報センター・一般向け疾患解説](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) と[厚生労働省・2026年4月時点の指定難病概要／診断基準](https://www.mhlw.go.jp/stf/newpage_53881.html)。両資料に照らし、概要・暮らし・医療の現在地の3節を**長文の転載ではなく、独自の一般向け文章として要約**。
- 個別疾患にリンク可能な場合は難病情報センターの該当する**個別疾患ページ**を出典に使用（現在48件）。分類範囲が複数の病型を含む場合は、特定の病型だけの情報を一般化せず、公式索引および厚労省の総括資料を参照する。
- 各疾患の`references`に公的資料へのリンク、`reviewStatus`に**出典照合済みの編集草稿**という状態、`reviewedAt`に確認日を記録。
- 薬の個別用量、予後の数値、生存率、自己診断法、万能な治療法などは掲載しない。
- `医療専門家による個別監修は未実施`。公的資料の内容を基にしていても、文章の完全な臨床的正確性を保証するものではない。専門家レビュー後の状態へ誤って格上げしない。

## 公開導線

1. 光が灯った3D星をタップ → 病名・コメントなどのカード → **「この病気について知る」**。
2. ランダム紹介で優先疾患が出現 → 病名の下に短い概要 → **同じ「この病気について知る」**。
3. 両方が`/rd-seizu/disease/?id=<catalog-id>`の**同一記事ページ**を開く。URLを共有可能。
4. 上位50件以外は未確認の説明文を捏造せず、導線を非表示にする。APIのランダム抽選条件・疾患検索・投票制限を変更しない。
5. 未点灯の3D星は、以前の仕様どおりクリックで病名を表示しない。研究専用星図も公開導線には載せない。

記事はスマートフォンでの閲覧を中心にし、疾患名→概要→暮らし→医療と研究→参考資料の順に配置した。文章は50疾患分で計10439文字（3本文フィールドの合計、各`id`・参照情報は除外）。

## 出典索引

| 紹介順 | 疾患名 | DBのID | 難病情報センター（個別ページ、または一般向け索引） |
| ---: | --- | --- | --- |
| 1 | 潰瘍性大腸炎 | `mhlw-0097` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/62) |
| 2 | パーキンソン病 | `mhlw-0006` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/169) |
| 3 | 全身性エリテマトーデス | `mhlw-0049` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/53) |
| 4 | クローン病 | `mhlw-0096` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/81) |
| 5 | 好酸球性副鼻腔炎 | `mhlw-0306` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4537) |
| 6 | 後縦靱帯骨化症 | `mhlw-0069` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/98) |
| 7 | 重症筋無力症 | `mhlw-0011` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/120) |
| 8 | 皮膚筋炎／多発性筋炎 | `mhlw-0050` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4079) |
| 9 | 全身性強皮症 | `systemic-sclerosis` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4026) |
| 10 | 脊髄小脳変性症(多系統萎縮症を除く。) | `mhlw-0018` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4881) |
| 11 | 多発性硬化症／視神経脊髄炎 | `mhlw-0013` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/3806) |
| 12 | 特発性間質性肺炎 | `mhlw-0085` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/156) |
| 13 | シェーグレン症候群 | `mhlw-0053` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/111) |
| 14 | 網膜色素変性症 | `mhlw-0090` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/196) |
| 15 | 下垂体前葉機能低下症 | `mhlw-0078` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4017) |
| 16 | 特発性大腿骨頭壊死症 | `mhlw-0071` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/160) |
| 17 | 特発性拡張型心筋症 | `mhlw-0057` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/3985) |
| 18 | 免疫性血小板減少症 | `mhlw-0063` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/157) |
| 19 | サルコイドーシス | `mhlw-0084` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/110) |
| 20 | 原発性胆汁性胆管炎 | `primary-biliary-cholangitis` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/93) |
| 21 | IgＡ 腎症 | `mhlw-0066` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/41) |
| 22 | ベーチェット病 | `mhlw-0056` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/187) |
| 23 | 一次性ネフローゼ症候群 | `mhlw-0222` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4516) |
| 24 | もやもや病 | `mhlw-0022` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/47) |
| 25 | 多発性嚢胞腎 | `mhlw-0067` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/146) |
| 26 | 進行性核上性麻痺 | `mhlw-0005` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4114) |
| 27 | 顕微鏡的多発血管炎 | `mhlw-0043` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/86) |
| 28 | 混合性結合組織病 | `mhlw-0052` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/105) |
| 29 | 多系統萎縮症 | `mhlw-0017` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 30 | 筋萎縮性側索硬化症（ALS） | `als` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/52) |
| 31 | 好酸球性多発血管炎性肉芽腫症 | `mhlw-0045` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/3879) |
| 32 | 再生不良性貧血 | `mhlw-0060` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/106) |
| 33 | 全身性アミロイドーシス | `mhlw-0028` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/45) |
| 34 | 自己免疫性肝炎 | `mhlw-0095` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/113) |
| 35 | 黄色靱帯骨化症 | `mhlw-0068` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/58) |
| 36 | 筋ジストロフィー | `mhlw-0113` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4522) |
| 37 | 慢性血栓塞栓性肺高血圧症 | `mhlw-0088` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/192) |
| 38 | 強直性脊椎炎 | `mhlw-0271` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4847) |
| 39 | 慢性炎症性脱髄性多発神経炎／多巣性運動ニューロパチー | `mhlw-0014` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4089) |
| 40 | 成人発症スチル病 | `mhlw-0054` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/132) |
| 41 | 肺動脈性肺高血圧症 | `pulmonary-arterial-hypertension` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/171) |
| 42 | 高安動脈炎 | `mhlw-0040` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/141) |
| 43 | 広範脊柱管狭窄症 | `mhlw-0070` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/101) |
| 44 | 悪性関節リウマチ | `mhlw-0046` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/43) |
| 45 | ＩｇＧ４関連疾患 | `mhlw-0300` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4504) |
| 46 | 肥大型心筋症 | `mhlw-0058` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/177) |
| 47 | 大脳皮質基底核変性症 | `mhlw-0007` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/142) |
| 48 | 下垂体性成長ホルモン分泌亢進症 | `mhlw-0077` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/3922) |
| 49 | 類天疱瘡（後天性表皮水疱症を含む。） | `mhlw-0162` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/4525) |
| 50 | 神経線維腫症 | `mhlw-0034` | [一般向けの疾患別解説](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |

## データ管理・修正方法

`content/disease_guides_top50_part1.json`、`content/disease_guides_top50_part2.json` の3節を修正するだけで、トップの短い紹介と詳細ページが同時に更新される。

`scripts/validate_disease_guides.cjs` は、登録済み50件の順位・ID・本文の存在・参照先のHTTPS/公式ドメイン・ランダム紹介と詳細へのリンク・未点灯星クリック抑制を検査する。

出典のURLの存在と正しい疾患名の対応は照合したが、個々の段落について医療従事者による独立した査読は行っていない。医学的な見解が変わる項目は、情報更新日と原典を確認して改訂する。
