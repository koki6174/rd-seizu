# 病気の詳細解説：追加100疾患（2026-10-12）

## 今回の結果

2026年10月12日現在、既存の153件に指定難病番号146～247のうち未作成の100件を追加し、**全253件**の詳細ページを共通の`/disease/?id=<catalog-id>`に統合した。

選定は以下のとおり：
- 現行DB `public.disease_catalog`で公開中の指定難病番号146〜247を対象とする。
- 162（類天疱瘡）と222（一次性ネフローゼ症候群）は既存記事があるので除外する。
- 100件すべての疾患ID・日本語のDB正式名称・指定難病番号をSQLで照合して確定した。抽出時のSQL照合表は`content/disease_guides_extra_20261012_catalog_snapshot.json`。
- 記事本文は**概要、暮らしとの関係、医療と研究の現在地**。新規100件で合計**18570文字**（全角と半角を各1文字として、文章フィールドのみ）。出典、病名、JSON構文等は除外。
- 表示側は既存のスター詳細とランダム紹介から同じ記事へ進める。未点灯星の選択不可、コメント承認、投稿の1日1回ルールには触れていない。

## 一次資料・編集上の注意

使用した主な公的情報源：
- [難病情報センター：病気の解説（一般利用者向け）](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral)
- [厚生労働省：令和8年4月時点の指定難病の概要・診断基準](https://www.mhlw.go.jp/stf/newpage_53881.html)

80件は難病情報センターの実在する**対応する疾患の個別解説URLを確認**。残り20件は総合索引を参照し、個別URLを推測して作らない。疾患によって解説の根拠の粒度が異なり、80件の直接リンクがあることは**100件すべての文言を医学的に逐語検証した証拠ではない**。全原稿は公的情報を参照した一般向け編集草稿であり、医学専門職による独立の査読を経たという表示はしない。

原稿は、病型の異なる疾患（例：マルファン症候群／ロイス・ディーツ症候群、エーラス・ダンロス症候群、肺胞蛋白症、てんかん症候群）を一律の症状・治療として扱わず、生存率、平均余命、具体的な薬の用量、個別診療判断を記載しない方針で作成。

前のユーザー要望どおり、「医療専門家による個別監修は未実施です。」というページ文言は再追加しない。診断や治療に利用しない旨の注意書きは維持する。

## 実装・検証

- `content/disease_guides_extra_05.json`〜`08.json` に100件の原稿を保存。
- `content/disease-guides.js` は11ファイル・計253件を読み込み、重複・不完全なレコードを拒否する。
- `scripts/validate_disease_guides_extra100_20261012.cjs` はDB ID・日本語名・指定難病番号・重複・原典の許可ドメイン・UIの未点灯星ガードを検証する。
- `scripts/audit_guide_extra100_20261012.py` は100件の日本語本文の文字数をPythonで確認する。
- 前回の153件についてのテストは維持する。
- 原稿追加は安全なテキスト表示の既存機構を使い、DBの個人投稿情報や非公開研究データを使わない。

## 今回追加した100件の一覧

| 記事通番 | 疾患名 | 指定難病番号 | 詳細ページ | 医学的な情報源 |
|---:|---|---:|---|---|
| 154 | 大田原症候群 | 146 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0146) | [疾患別原典](https://www.nanbyou.or.jp/entry/4381) |
| 155 | 早期ミオクロニー脳症 | 147 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0147) | [疾患別原典](https://www.nanbyou.or.jp/entry/4705) |
| 156 | 遊走性焦点発作を伴う乳児てんかん | 148 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0148) | [疾患別原典](https://www.nanbyou.or.jp/entry/4717) |
| 157 | 片側痙攣・片麻痺・てんかん症候群 | 149 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0149) | [疾患別原典](https://www.nanbyou.or.jp/entry/4408) |
| 158 | 環状20番染色体症候群 | 150 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0150) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 159 | ラスムッセン脳炎 | 151 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0151) | [疾患別原典](https://www.nanbyou.or.jp/entry/4339) |
| 160 | ＰＣＤＨ19関連症候群 | 152 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0152) | [疾患別原典](https://www.nanbyou.or.jp/entry/4642) |
| 161 | 難治頻回部分発作重積型急性脳炎 | 153 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0153) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 162 | 睡眠時棘徐波活性化を示す発達性てんかん性脳症及びてんかん性脳症 | 154 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0154) | [疾患別原典](https://www.nanbyou.or.jp/entry/4654) |
| 163 | ランドウ・クレフナー症候群 | 155 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0155) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 164 | レット症候群 | 156 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0156) | [疾患別原典](https://www.nanbyou.or.jp/entry/4366) |
| 165 | スタージ・ウェーバー症候群 | 157 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0157) | [疾患別原典](https://www.nanbyou.or.jp/entry/4307) |
| 166 | 結節性硬化症 | 158 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0158) | [疾患別原典](https://www.nanbyou.or.jp/entry/4384) |
| 167 | 色素性乾皮症 | 159 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0159) | [疾患別原典](https://www.nanbyou.or.jp/entry/112) |
| 168 | 先天性魚鱗癬 | 160 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0160) | [疾患別原典](https://www.nanbyou.or.jp/entry/139) |
| 169 | 家族性良性慢性天疱瘡 | 161 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0161) | [疾患別原典](https://www.nanbyou.or.jp/entry/4489) |
| 170 | 特発性後天性全身性無汗症 | 163 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0163) | [疾患別原典](https://www.nanbyou.or.jp/entry/4390) |
| 171 | 眼皮膚白皮症 | 164 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0164) | [疾患別原典](https://www.nanbyou.or.jp/entry/4492) |
| 172 | 肥厚性皮膚骨膜症 | 165 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0165) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 173 | 弾性線維性仮性黄色腫 | 166 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0166) | [疾患別原典](https://www.nanbyou.or.jp/entry/4579) |
| 174 | マルファン症候群／ロイス・ディーツ症候群 | 167 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0167) | [疾患別原典](https://www.nanbyou.or.jp/entry/4792) |
| 175 | エーラス・ダンロス症候群 | 168 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0168) | [疾患別原典](https://www.nanbyou.or.jp/entry/4801) |
| 176 | メンケス病 | 169 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0169) | [疾患別原典](https://www.nanbyou.or.jp/entry/4729) |
| 177 | オクシピタル・ホーン症候群 | 170 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0170) | [疾患別原典](https://www.nanbyou.or.jp/entry/4555) |
| 178 | ウィルソン病 | 171 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=wilson-disease) | [疾患別原典](https://www.nanbyou.or.jp/entry/4543) |
| 179 | 低ホスファターゼ症 | 172 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0172) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 180 | VATER症候群 | 173 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0173) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 181 | 那須・ハコラ病 | 174 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0174) | [疾患別原典](https://www.nanbyou.or.jp/entry/4256) |
| 182 | ウィーバー症候群 | 175 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0175) | [疾患別原典](https://www.nanbyou.or.jp/entry/4684) |
| 183 | コフィン・ローリー症候群 | 176 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0176) | [疾患別原典](https://www.nanbyou.or.jp/entry/4666) |
| 184 | ジュベール症候群関連疾患 | 177 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0177) | [疾患別原典](https://www.nanbyou.or.jp/entry/4552) |
| 185 | モワット・ウィルソン症候群 | 178 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0178) | [疾患別原典](https://www.nanbyou.or.jp/entry/4594) |
| 186 | ウィリアムズ症候群 | 179 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0179) | [疾患別原典](https://www.nanbyou.or.jp/entry/4765) |
| 187 | ＡＴＲ－Ｘ症候群 | 180 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0180) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 188 | クルーゾン症候群 | 181 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0181) | [疾患別原典](https://www.nanbyou.or.jp/entry/4672) |
| 189 | アペール症候群 | 182 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0182) | [疾患別原典](https://www.nanbyou.or.jp/entry/4678) |
| 190 | ファイファー症候群 | 183 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0183) | [疾患別原典](https://www.nanbyou.or.jp/entry/4675) |
| 191 | アントレー・ビクスラー症候群 | 184 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0184) | [疾患別原典](https://www.nanbyou.or.jp/entry/4669) |
| 192 | コフィン・シリス症候群 | 185 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0185) | [疾患別原典](https://www.nanbyou.or.jp/entry/4762) |
| 193 | ロスムンド・トムソン症候群 | 186 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0186) | [疾患別原典](https://www.nanbyou.or.jp/entry/4471) |
| 194 | 歌舞伎症候群 | 187 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0187) | [疾患別原典](https://www.nanbyou.or.jp/entry/4663) |
| 195 | 多脾症候群 | 188 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0188) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 196 | 無脾症候群 | 189 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0189) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 197 | 鰓耳腎症候群 | 190 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0190) | [疾患別原典](https://www.nanbyou.or.jp/entry/4387) |
| 198 | ウェルナー症候群 | 191 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0191) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 199 | コケイン症候群 | 192 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0192) | [疾患別原典](https://www.nanbyou.or.jp/entry/4435) |
| 200 | プラダー・ウィリ症候群 | 193 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0193) | [疾患別原典](https://www.nanbyou.or.jp/entry/4768) |
| 201 | ソトス症候群 | 194 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0194) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 202 | ヌーナン症候群 | 195 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0195) | [疾患別原典](https://www.nanbyou.or.jp/entry/4865) |
| 203 | ヤング・シンプソン症候群 | 196 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0196) | [疾患別原典](https://www.nanbyou.or.jp/entry/4759) |
| 204 | １p36欠失症候群 | 197 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0197) | [疾患別原典](https://www.nanbyou.or.jp/entry/4495) |
| 205 | ４p欠失症候群 | 198 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0198) | [疾患別原典](https://www.nanbyou.or.jp/entry/4804) |
| 206 | ５p欠失症候群 | 199 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0199) | [疾患別原典](https://www.nanbyou.or.jp/entry/4862) |
| 207 | 第14番染色体父親性ダイソミー症候群 | 200 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0200) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 208 | アンジェルマン症候群 | 201 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0201) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 209 | スミス・マギニス症候群 | 202 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0202) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 210 | 22q11.2欠失症候群 | 203 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0203) | [疾患別原典](https://www.nanbyou.or.jp/entry/5317) |
| 211 | エマヌエル症候群 | 204 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0204) | [疾患別原典](https://www.nanbyou.or.jp/entry/4609) |
| 212 | 脆弱Ｘ症候群関連疾患 | 205 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0205) | [疾患別原典](https://www.nanbyou.or.jp/entry/4615) |
| 213 | 脆弱X症候群 | 206 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0206) | [疾患別原典](https://www.nanbyou.or.jp/entry/4612) |
| 214 | 総動脈幹遺残症 | 207 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0207) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 215 | 修正大血管転位症 | 208 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0208) | [疾患別原典](https://www.nanbyou.or.jp/entry/4474) |
| 216 | 完全大血管転位症 | 209 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0209) | [疾患別原典](https://www.nanbyou.or.jp/entry/4477) |
| 217 | 単心室症 | 210 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0210) | [疾患別原典](https://www.nanbyou.or.jp/entry/4369) |
| 218 | 左心低形成症候群 | 211 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0211) | [疾患別原典](https://www.nanbyou.or.jp/entry/4372) |
| 219 | 三尖弁閉鎖症 | 212 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0212) | [疾患別原典](https://www.nanbyou.or.jp/entry/4480) |
| 220 | 心室中隔欠損を伴わない肺動脈閉鎖症 | 213 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0213) | [疾患別原典](https://www.nanbyou.or.jp/entry/4483) |
| 221 | 心室中隔欠損を伴う肺動脈閉鎖症 | 214 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0214) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 222 | ファロー四徴症 | 215 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0215) | [疾患別原典](https://www.nanbyou.or.jp/entry/4741) |
| 223 | 両大血管右室起始症 | 216 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0216) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 224 | エプスタイン病 | 217 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0217) | [疾患別原典](https://www.nanbyou.or.jp/entry/4486) |
| 225 | アルポート症候群 | 218 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0218) | [疾患別原典](https://www.nanbyou.or.jp/entry/4348) |
| 226 | ギャロウェイ・モワト症候群 | 219 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0219) | [疾患別原典](https://www.nanbyou.or.jp/entry/4468) |
| 227 | 急速進行性糸球体腎炎 | 220 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0220) | [疾患別原典](https://www.nanbyou.or.jp/entry/74) |
| 228 | 抗糸球体基底膜腎炎 | 221 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0221) | [疾患別原典](https://www.nanbyou.or.jp/entry/4378) |
| 229 | 一次性膜性増殖性糸球体腎炎 | 223 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0223) | [疾患別原典](https://www.nanbyou.or.jp/entry/4423) |
| 230 | 紫斑病性腎炎 | 224 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0224) | [疾患別原典](https://www.nanbyou.or.jp/entry/4657) |
| 231 | 先天性腎性尿崩症 | 225 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0225) | [疾患別原典](https://www.nanbyou.or.jp/entry/5539) |
| 232 | 間質性膀胱炎（ハンナ型） | 226 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0226) | [疾患別原典](https://www.nanbyou.or.jp/entry/4429) |
| 233 | オスラー病 | 227 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0227) | [疾患別原典](https://www.nanbyou.or.jp/entry/4351) |
| 234 | 閉塞性細気管支炎 | 228 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0228) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 235 | 肺胞蛋白症（自己免疫性又は先天性） | 229 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0229) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 236 | 肺胞低換気症候群 | 230 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0230) | [疾患別原典](https://www.nanbyou.or.jp/entry/172) |
| 237 | α1－アンチトリプシン欠乏症 | 231 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0231) | [疾患別原典](https://www.nanbyou.or.jp/entry/4738) |
| 238 | カーニー複合 | 232 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0232) | [疾患別原典](https://www.nanbyou.or.jp/entry/4753) |
| 239 | ウォルフラム症候群 | 233 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0233) | [疾患別原典](https://www.nanbyou.or.jp/entry/4789) |
| 240 | ペルオキシソーム病（副腎白質ジストロフィーを除く。） | 234 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0234) | [疾患別原典](https://www.nanbyou.or.jp/entry/4621) |
| 241 | 副甲状腺機能低下症 | 235 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0235) | [疾患別原典](https://www.nanbyou.or.jp/entry/4426) |
| 242 | 偽性副甲状腺機能低下症 | 236 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0236) | [公式索引](https://www.nanbyou.or.jp/entry/category/sickdescriptiongeneral) |
| 243 | 副腎皮質刺激ホルモン不応症 | 237 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0237) | [疾患別原典](https://www.nanbyou.or.jp/entry/4357) |
| 244 | ビタミンＤ抵抗性くる病/骨軟化症 | 238 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0238) | [疾患別原典](https://www.nanbyou.or.jp/entry/4558) |
| 245 | ビタミンＤ依存性くる病/骨軟化症 | 239 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0239) | [疾患別原典](https://www.nanbyou.or.jp/entry/4561) |
| 246 | フェニルケトン尿症 | 240 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0240) | [疾患別原典](https://www.nanbyou.or.jp/entry/4747) |
| 247 | 高チロシン血症1型 | 241 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0241) | [疾患別原典](https://www.nanbyou.or.jp/entry/4690) |
| 248 | 高チロシン血症2型 | 242 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0242) | [疾患別原典](https://www.nanbyou.or.jp/entry/4693) |
| 249 | 高チロシン血症3型 | 243 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0243) | [疾患別原典](https://www.nanbyou.or.jp/entry/4696) |
| 250 | メープルシロップ尿症 | 244 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0244) | [疾患別原典](https://www.nanbyou.or.jp/entry/4813) |
| 251 | プロピオン酸血症 | 245 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0245) | [疾患別原典](https://www.nanbyou.or.jp/entry/5323) |
| 252 | メチルマロン酸血症 | 246 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0246) | [疾患別原典](https://www.nanbyou.or.jp/entry/4861) |
| 253 | イソ吉草酸血症 | 247 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0247) | [疾患別原典](https://www.nanbyou.or.jp/entry/4816) |
