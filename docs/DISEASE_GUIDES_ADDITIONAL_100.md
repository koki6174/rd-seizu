# 病気の解説：既存50件に100件追加（2026-10-11）

## 作業対象

既存の優先50件に加え、Supabase `disease_catalog`の公開済み・指定難病番号付きの疾患から、**既存50件と重複しない100件**を選定しました。新規100件は指定難病番号の昇順です。選定したIDと病名の完全な対照表は`content/disease_guides_extra_catalog_snapshot.json`です。

全体：**150疾患の解説ページ**。新規100件の本文合計：**18186文字**（概要・暮らし・医療の本文のみ）。新規記事に共有の短い紹介と記事のURLが利用できます。

## 出典・確認範囲と品質の注意

各記事は3分野について専門用語を減らしながら作成した**一般向けの編集草稿**です。疾患IDと名称については実際のSupabaseの公開疾患リストと突き合わせています。

参照先は原則として：
1. [厚生労働省：指定難病の概要・診断基準](https://www.mhlw.go.jp/stf/newpage_53881.html)
2. [難病情報センター：病気の解説（一般利用者向け）](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral)

今回追加した19件は難病情報センターの**疾患別一般向けページの正確なURL**も調べて紐付けしました。その他の疾患は、存在確認のできていない個別URLを推測で生成せず、公式索引へ案内しています。したがって、全100件の個別文章を一段落ずつ医学専門家が独立照合したという意味ではありません。重要な疾患・内容は公開後も原典の改訂に合わせて確認し、誤解しやすい表現を更新してください。

内容は原因遺伝子が一つに限らない**疾患群を無理に単一病型として説明しない**ことに留意し、特定の治療法の効果・適応をすべての患者に当てはめないよう記述しました。生存率・余命・個別薬の投与量は掲載していません。

## UIへの反映

- `content/disease-guides.js`：優先50件＋新規100件、計150件のファイルを読み込む。
- `/disease/?id=...`：本文3項目＋公式情報への参考リンク。注意書きの「医療専門家による個別監修は未実施です。」を依頼により削除し、個人差と医学的判断についての一般的な注意は残す。
- 点灯済み3D星の詳細、およびランダム紹介で該当する病名：従来と同じ「この病気について知る」への導線。
- 未点灯星はタップしても病名が表示されないまま。ランダム紹介の抽選仕様も一切変更しない。

## 追加100疾患の一覧

| No. | 疾患 | カタログID | 公式情報 |
|---:|---|---|---|
| 51 | 球脊髄性筋萎縮症 | `mhlw-0001` | [疾患別ページ](https://www.nanbyou.or.jp/entry/73) |
| 52 | 脊髄性筋萎縮症（SMA） | `sma` | [疾患別ページ](https://www.nanbyou.or.jp/entry/135) |
| 53 | 原発性側索硬化症 | `mhlw-0004` | [疾患別ページ](https://www.nanbyou.or.jp/entry/92) |
| 54 | ハンチントン病 | `huntington-disease` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 55 | 神経有棘赤血球症 | `mhlw-0009` | [疾患別ページ](https://www.nanbyou.or.jp/entry/4051) |
| 56 | シャルコー・マリー・トゥース病 | `mhlw-0010` | [疾患別ページ](https://www.nanbyou.or.jp/entry/3773) |
| 57 | 先天性筋無力症候群 | `mhlw-0012` | [疾患別ページ](https://www.nanbyou.or.jp/entry/3965) |
| 58 | 封入体筋炎 | `mhlw-0015` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 59 | クロウ・深瀬症候群 | `mhlw-0016` | [疾患別ページ](https://www.nanbyou.or.jp/entry/82) |
| 60 | ライソゾーム病 | `mhlw-0019` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 61 | 副腎白質ジストロフィー | `mhlw-0020` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 62 | ミトコンドリア病 | `mhlw-0021` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 63 | プリオン病 | `mhlw-0023` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 64 | 亜急性硬化性全脳炎 | `mhlw-0024` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 65 | 進行性多巣性白質脳症 | `mhlw-0025` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 66 | HTLV-1関連脊髄症 | `mhlw-0026` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 67 | 特発性基底核石灰化症 | `mhlw-0027` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 68 | ウルリッヒ病 | `mhlw-0029` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 69 | 遠位型ミオパチー | `mhlw-0030` | [疾患別ページ](https://www.nanbyou.or.jp/entry/4002) |
| 70 | ベスレムミオパチー | `mhlw-0031` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 71 | 自己貪食空胞性ミオパチー | `mhlw-0032` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 72 | シュワルツ・ヤンペル症候群 | `mhlw-0033` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 73 | 天疱瘡 | `mhlw-0035` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 74 | 表皮水疱症 | `mhlw-0036` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 75 | 膿疱性乾癬（汎発型） | `mhlw-0037` | [疾患別ページ](https://www.nanbyou.or.jp/entry/168) |
| 76 | スティーヴンス・ジョンソン症候群 | `mhlw-0038` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 77 | 中毒性表皮壊死症 | `mhlw-0039` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 78 | 巨細胞性動脈炎 | `mhlw-0041` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 79 | 結節性多発動脈炎 | `mhlw-0042` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 80 | 多発血管炎性肉芽腫症 | `mhlw-0044` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 81 | バージャー病 | `mhlw-0047` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 82 | 原発性抗リン脂質抗体症候群 | `mhlw-0048` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 83 | 再発性多発軟骨炎 | `mhlw-0055` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 84 | 拘束型心筋症 | `mhlw-0059` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 85 | 自己免疫性溶血性貧血 | `mhlw-0061` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 86 | 発作性夜間ヘモグロビン尿症 | `mhlw-0062` | [疾患別ページ](https://www.nanbyou.or.jp/entry/3784) |
| 87 | 血栓性血小板減少性紫斑病 | `mhlw-0064` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 88 | 原発性免疫不全症候群 | `mhlw-0065` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 89 | 下垂体性ADH分泌異常症 | `mhlw-0072` | [疾患別ページ](https://www.nanbyou.or.jp/entry/3988) |
| 90 | 下垂体性TSH分泌亢進症 | `mhlw-0073` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 91 | 下垂体性PRL分泌亢進症 | `mhlw-0074` | [疾患別ページ](https://www.nanbyou.or.jp/entry/4045) |
| 92 | クッシング病 | `mhlw-0075` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 93 | 下垂体性ゴナドトロピン分泌亢進症 | `mhlw-0076` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 94 | 家族性高コレステロール血症（ホモ接合体） | `mhlw-0079` | [疾患別ページ](https://www.nanbyou.or.jp/entry/65) |
| 95 | 甲状腺ホルモン不応症 | `mhlw-0080` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 96 | 先天性副腎皮質酵素欠損症 | `mhlw-0081` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 97 | 先天性副腎低形成症 | `mhlw-0082` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 98 | アジソン病 | `mhlw-0083` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 99 | 肺静脈閉塞症／肺毛細血管腫症 | `mhlw-0087` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 100 | リンパ脈管筋腫症 | `mhlw-0089` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 101 | バッド・キアリ症候群 | `mhlw-0091` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 102 | 特発性門脈圧亢進症 | `mhlw-0092` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 103 | 原発性硬化性胆管炎 | `mhlw-0094` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 104 | 好酸球性消化管疾患 | `mhlw-0098` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 105 | 慢性特発性偽性腸閉塞症 | `mhlw-0099` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 106 | 巨大膀胱短小結腸腸管蠕動不全症 | `mhlw-0100` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 107 | 腸管神経節細胞僅少症 | `mhlw-0101` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 108 | ルビンシュタイン・テイビ症候群 | `mhlw-0102` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 109 | CFC症候群 | `mhlw-0103` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 110 | コステロ症候群 | `mhlw-0104` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 111 | チャージ症候群 | `mhlw-0105` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 112 | クリオピリン関連周期熱症候群 | `mhlw-0106` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 113 | 若年性特発性関節炎 | `mhlw-0107` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 114 | TNF受容体関連周期性症候群 | `mhlw-0108` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 115 | 非典型溶血性尿毒症症候群 | `mhlw-0109` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 116 | ブラウ症候群 | `mhlw-0110` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 117 | 先天性ミオパチー | `mhlw-0111` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 118 | マリネスコ・シェーグレン症候群 | `mhlw-0112` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 119 | 非ジストロフィー性ミオトニー症候群 | `mhlw-0114` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 120 | 遺伝性周期性四肢麻痺 | `mhlw-0115` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 121 | アトピー性脊髄炎 | `mhlw-0116` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 122 | 脊髄空洞症 | `mhlw-0117` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 123 | 脊髄髄膜瘤 | `mhlw-0118` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 124 | アイザックス症候群 | `mhlw-0119` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 125 | 遺伝性ジストニア | `mhlw-0120` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 126 | 脳内鉄沈着神経変性症 | `mhlw-0121` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 127 | 脳表ヘモジデリン沈着症 | `mhlw-0122` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 128 | ＨＴＲＡ１関連脳小血管病 | `mhlw-0123` | [疾患別ページ](https://www.nanbyou.or.jp/entry/4549) |
| 129 | 皮質下梗塞と白質脳症を伴う常染色体優性脳動脈症 | `mhlw-0124` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 130 | 神経軸索スフェロイド形成を伴う遺伝性びまん性白質脳症 | `mhlw-0125` | [疾患別ページ](https://www.nanbyou.or.jp/entry/4498) |
| 131 | ペリー病 | `mhlw-0126` | [疾患別ページ](https://www.nanbyou.or.jp/entry/4702) |
| 132 | 前頭側頭葉変性症 | `mhlw-0127` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 133 | ビッカースタッフ脳幹脳炎 | `mhlw-0128` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 134 | 痙攣重積型（二相性）急性脳症 | `mhlw-0129` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 135 | 先天性無痛無汗症 | `mhlw-0130` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 136 | アレキサンダー病 | `mhlw-0131` | [疾患別ページ](https://www.nanbyou.or.jp/entry/4345) |
| 137 | 先天性核上性球麻痺 | `mhlw-0132` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 138 | メビウス症候群 | `mhlw-0133` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 139 | 中隔視神経形成異常症/ドモルシア症候群 | `mhlw-0134` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 140 | アイカルディ症候群 | `mhlw-0135` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 141 | 片側巨脳症 | `mhlw-0136` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 142 | 限局性皮質異形成 | `mhlw-0137` | [疾患別ページ](https://www.nanbyou.or.jp/entry/4458) |
| 143 | 神経細胞移動異常症 | `mhlw-0138` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 144 | 先天性大脳白質形成不全症 | `mhlw-0139` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 145 | ドラベ症候群 | `mhlw-0140` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 146 | 海馬硬化を伴う内側側頭葉てんかん | `mhlw-0141` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 147 | ミオクロニー欠神てんかん | `mhlw-0142` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 148 | ミオクロニー脱力発作を伴うてんかん | `mhlw-0143` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 149 | レノックス・ガストー症候群 | `mhlw-0144` | [公式解説索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 150 | ウエスト症候群 | `mhlw-0145` | [疾患別ページ](https://www.nanbyou.or.jp/entry/4414) |

## 検証

`scripts/validate_disease_guides_extra.cjs`：150件の一意なカタログID、追加100件の名称と公開済みカタログIDの一致、公式出典URL、記事本文、注意文の変更を自動検証する。
前回の`scripts/validate_disease_guides.cjs`とPython文字数確認も維持する。
