# 2026年10月12日：解説を253件から353件へ増やす追加100疾患

## 対象の決定と実装

既存記事をすべて調べ、現在公開ページが存在する**253疾患**（優先50＋追加100＋点灯3＋追加100）と重ならない100件を選択。

- 指定難病番号248～348から、既存記事のある271、300、306番を除いた**98疾患**。
- 既存カタログに独立した病名・IDがある**ゴーシェ病**（`gaucher-disease`）と**ポンペ病**（`pompe-disease`）を**2疾患**。
- 指定難病の番号・ID・日本語名はSupabase本番`public.disease_catalog`と照合し、`content/disease_guides_extra_20261012_batch2_catalog_snapshot.json`へ保存。
- 3節（概要・暮らしとの関係・医療と研究の現在地）を100件とも独立した文章で作成。**本文合計18,085文字**（説明文のみ、病名・出典は含まず）。
- 元のカテゴリ別星図1,241疾患、点灯星の選択条件、ランダム紹介、投稿テーブル・プライバシー、研究用144件の星図は変更しない。
- 説明文は`content/disease_guides_extra_09.json`から`12.json`に収録。既存共通の`/disease/?id=<id>`ページへ統合し、記事のある点灯星とランダム紹介の「この病気について知る」導線に自動反映。
- 記事の対象は**合計353疾患**。残り888疾患は未執筆。

## 出典・確認した範囲

原典は[厚生労働省：指定難病の概要・診断基準](https://www.mhlw.go.jp/stf/newpage_53881.html)と難病情報センターの**番号別公式索引**：

- [201～250](https://www.nanbyou.or.jp/entry/5476)
- [251～300](https://www.nanbyou.or.jp/entry/5477)
- [301～348](https://www.nanbyou.or.jp/entry/5478)

上記の番号別索引は疾患ごとに**「病気の解説」「概要・診断基準等」への導線**を掲載しています。このため出典を検証できなかった個別記事URLを捏造せず、未特定の疾病については**疾患名を実際に確認できる公式索引**へリンクしています。

個別解説ページが特定できた例：グルタル酸血症1型、家族性地中海熱、進行性骨化性線維異形成症、進行性家族性肝内胆汁うっ滞症、ロウ症候群。またゴーシェ病・ポンペ病は難病情報センターのライソゾーム病解説と米国NIH・NCBI GeneReviewsの個別疾患ページを参照。

出典と病名の照合、疾患ごとの概要・生活・治療の文章生成は実施しましたが、**全100件の一文一文について専門家による独立した査読や個別の原典ページとの逐語照合までは実施していません。** そのため編集原稿の状態は`official_index_crosschecked_editorial_draft`（個別疾患は`official_disease_specific_sources_checked_editorial_draft`）。将来の自動医学情報更新には独立のレビュー工程が必要です。

稀少疾患の病型を混同せず、一般向けの文章として説明しています。個別の薬の用量、断定的な予後、根拠のない生存率は書いていません。以前の依頼により個別監修の有無を表示する文言は追加せず、**「病状や治療は一人ひとり異なるため、この文章を診断・治療の判断に使わないでください。」** は維持。

## 記事一覧

| 記事番号 | 正式病名 | 指定難病番号 | 詳細ページ | 公式情報へのリンク |
|---:|---|---:|---|---|
| 254 | グルコーストランスポーター1欠損症 | 248 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0248) | [原典](https://www.nanbyou.or.jp/entry/5476) |
| 255 | グルタル酸血症1型 | 249 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0249) | [原典](https://www.nanbyou.or.jp/entry/4831) |
| 256 | グルタル酸血症2型 | 250 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0250) | [原典](https://www.nanbyou.or.jp/entry/5476) |
| 257 | 尿素サイクル異常症 | 251 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0251) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 258 | リジン尿性蛋白不耐症 | 252 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0252) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 259 | 先天性葉酸吸収不全 | 253 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0253) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 260 | ポルフィリン症 | 254 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0254) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 261 | 複合カルボキシラーゼ欠損症 | 255 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0255) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 262 | 筋型糖原病 | 256 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0256) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 263 | 肝型糖原病 | 257 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0257) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 264 | ガラクトース－１－リン酸ウリジルトランスフェラーゼ欠損症 | 258 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0258) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 265 | レシチンコレステロールアシルトランスフェラーゼ欠損症 | 259 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0259) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 266 | シトステロール血症 | 260 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0260) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 267 | タンジール病 | 261 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0261) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 268 | 原発性高カイロミクロン血症 | 262 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0262) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 269 | 脳腱黄色腫症 | 263 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0263) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 270 | 無βリポタンパク血症 | 264 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0264) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 271 | 脂肪萎縮症 | 265 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0265) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 272 | 家族性地中海熱 | 266 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0266) | [原典](https://www.nanbyou.or.jp/entry/4447) |
| 273 | 高ＩｇＤ症候群 | 267 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0267) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 274 | 中條・西村症候群 | 268 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0268) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 275 | 化膿性無菌性関節炎・壊疽性膿皮症・アクネ症候群 | 269 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0269) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 276 | 慢性再発性多発性骨髄炎 | 270 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0270) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 277 | 進行性骨化性線維異形成症 | 272 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0272) | [原典](https://www.nanbyou.or.jp/entry/216) |
| 278 | 肋骨異常を伴う先天性側弯症 | 273 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0273) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 279 | 骨形成不全症 | 274 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0274) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 280 | タナトフォリック骨異形成症 | 275 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0275) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 281 | 軟骨無形成症 | 276 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0276) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 282 | リンパ管腫症/ゴーハム病 | 277 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0277) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 283 | 巨大リンパ管奇形（頚部顔面病変） | 278 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0278) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 284 | 巨大静脈奇形（頚部口腔咽頭びまん性病変） | 279 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0279) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 285 | 巨大動静脈奇形（頚部顔面又は四肢病変） | 280 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0280) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 286 | クリッペル・トレノネー・ウェーバー症候群 | 281 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0281) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 287 | 先天性赤血球形成異常性貧血 | 282 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0282) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 288 | 後天性赤芽球癆 | 283 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0283) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 289 | ダイアモンド・ブラックファン貧血 | 284 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0284) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 290 | ファンコニ貧血 | 285 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0285) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 291 | 遺伝性鉄芽球性貧血 | 286 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0286) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 292 | エプスタイン症候群 | 287 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0287) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 293 | 自己免疫性後天性凝固因子欠乏症 | 288 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0288) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 294 | クロンカイト・カナダ症候群 | 289 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0289) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 295 | 非特異性多発性小腸潰瘍症 | 290 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0290) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 296 | ヒルシュスプルング病（全結腸型又は小腸型） | 291 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0291) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 297 | 総排泄腔外反症 | 292 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0292) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 298 | 総排泄腔遺残 | 293 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0293) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 299 | 先天性横隔膜ヘルニア | 294 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0294) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 300 | 乳幼児肝巨大血管腫 | 295 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0295) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 301 | 胆道閉鎖症 | 296 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0296) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 302 | アラジール症候群 | 297 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0297) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 303 | 遺伝性膵炎 | 298 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0298) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 304 | 嚢胞性線維症 | 299 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0299) | [原典](https://www.nanbyou.or.jp/entry/5477) |
| 305 | 黄斑ジストロフィー | 301 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0301) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 306 | レーベル遺伝性視神経症 | 302 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0302) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 307 | アッシャー症候群 | 303 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0303) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 308 | 若年発症型両側性感音難聴 | 304 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0304) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 309 | 遅発性内リンパ水腫 | 305 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0305) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 310 | カナバン病 | 307 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0307) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 311 | 進行性白質脳症 | 308 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0308) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 312 | 進行性ミオクローヌスてんかん | 309 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0309) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 313 | 先天異常症候群 | 310 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0310) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 314 | 先天性三尖弁狭窄症 | 311 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0311) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 315 | 先天性僧帽弁狭窄症 | 312 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0312) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 316 | 先天性肺静脈狭窄症 | 313 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0313) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 317 | 左肺動脈右肺動脈起始症 | 314 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0314) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 318 | ネイルパテラ症候群（爪膝蓋骨症候群）／ＬＭＸ１Ｂ関連腎症 | 315 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0315) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 319 | カルニチン回路異常症 | 316 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0316) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 320 | 三頭酵素欠損症 | 317 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0317) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 321 | シトリン欠損症 | 318 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0318) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 322 | セピアプテリン還元酵素（ＳＲ）欠損症 | 319 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0319) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 323 | 先天性グリコシルホスファチジルイノシトール（GPI）欠損症 | 320 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0320) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 324 | 非ケトーシス型高グリシン血症 | 321 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0321) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 325 | β―ケトチオラーゼ欠損症 | 322 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0322) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 326 | 芳香族L－アミノ酸脱炭酸酵素欠損症 | 323 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0323) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 327 | メチルグルタコン酸尿症 | 324 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0324) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 328 | 遺伝性自己炎症疾患 | 325 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0325) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 329 | 大理石骨病 | 326 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0326) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 330 | 特発性血栓症（遺伝性血栓性素因によるものに限る。） | 327 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0327) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 331 | 前眼部形成異常 | 328 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0328) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 332 | 無虹彩症 | 329 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0329) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 333 | 先天性気管狭窄症／先天性声門下狭窄症 | 330 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0330) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 334 | 特発性多中心性キャッスルマン病 | 331 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0331) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 335 | 膠様滴状角膜ジストロフィー | 332 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0332) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 336 | ハッチンソン・ギルフォード症候群 | 333 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0333) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 337 | 脳クレアチン欠乏症候群 | 334 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0334) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 338 | ネフロン癆 | 335 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0335) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 339 | 家族性低βリポタンパク血症1（ホモ接合体） | 336 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0336) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 340 | ホモシスチン尿症 | 337 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0337) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 341 | 進行性家族性肝内胆汁うっ滞症 | 338 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0338) | [原典](https://www.nanbyou.or.jp/entry/22457) |
| 342 | ＭＥＣＰ２重複症候群 | 339 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0339) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 343 | 線毛機能不全症候群（カルタゲナー症候群を含む。） | 340 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0340) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 344 | ＴＲＰＶ４異常症 | 341 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0341) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 345 | LMNB1 関連大脳白質脳症 | 342 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0342) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 346 | PURA 関連神経発達異常症 | 343 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0343) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 347 | 極長鎖アシル-CoA 脱水素酵素欠損症 | 344 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0344) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 348 | 乳児発症 STING 関連血管炎 | 345 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0345) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 349 | 原発性肝外門脈閉塞症 | 346 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0346) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 350 | 出血性線溶異常症 | 347 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0347) | [原典](https://www.nanbyou.or.jp/entry/5478) |
| 351 | ロウ症候群 | 348 | [記事](https://koki6174.github.io/rd-seizu/disease/?id=mhlw-0348) | [原典](https://www.nanbyou.or.jp/entry/28624) |
| 352 | ゴーシェ病 | — | [記事](https://koki6174.github.io/rd-seizu/disease/?id=gaucher-disease) | [原典](https://www.nanbyou.or.jp/entry/4063) |
| 353 | ポンペ病 | — | [記事](https://koki6174.github.io/rd-seizu/disease/?id=pompe-disease) | [原典](https://www.nanbyou.or.jp/entry/4063) |

## テスト

- `scripts/validate_disease_guides_extra100_batch2_20261012.cjs`：253既存＋100新規の**353一意ID**、カタログ正確一致、98件の番号と例外、公式URL形式、文章3節、未点灯星のクリック禁止を確認。
- `scripts/audit_guide_extra100_batch2_20261012.py`：100記事の文字数・重複を検証。
- 既存の3種類の疾患ID検証スクリプトも回帰テストとして維持。
- GitHub Pagesでは静的JSONを配信し、ブラウザ側で表示する。DBスキーマや投稿権限の変更はない。
