# 2025年度 指定難病病名の参考一覧

このCSVは次の公開データを収録・参照したものです（文字数の修正なし）。

- 元データ：**136s/intractable-disease**（CC BY 4.0）
- 原典：厚生労働省 [指定難病一覧・令和8年4月時点、告示番号1〜348](https://www.mhlw.go.jp/stf/newpage_53881.html)
- 公開データ：<https://github.com/136s/intractable-disease/blob/main/intractable_disease.csv>
- 収録件数：348（1〜348の連続した告示番号）
- 収録バージョン：二次公開CSV 2025年4月時点（2026年版の全件差分検証は未完了）
- 加工：UTF-8 BOMの除去、既存サイトの12疾患と照合して7件を同一IDに統合。新規は `mhlw-0001` 形式のID。
- CSV原本の氏名・患者個人データは含まれません。病名・番号のみです。
- 再配布と編集は原著作者の表示を条件とするCC BY 4.0を遵守してください。

**取り込みルール：** 病名は一般向け候補検索に使います。医学的説明・有病率・治療の詳細は別途出典と監修が必要で、未入力（NULL）のままです。生存率は収集・公開しません。

## その他の検索候補と紹介ランク

- [NANDO/DBCLS](https://github.com/NanbyoData/nando) 小児慢性関連疾患の分類一覧（`shoman_class.json`、CC BY 4.0）から病名検索を233候補拡充。`nando_shoman_class_source.json` に原始データのコピー。
- 本データには分類名や広い疾患群も含まれます。医療情報の提供前に疾患単位での確認が必要です。
- ランダムの基準は[難病情報センター・2024年度末の受給者証所持者数](https://www.nanbyou.or.jp/entry/5354)。
- `official_2024_top50_certificate_holders.csv` は2024年度末における受給者証所持者数の上位50（指定難病番号と件数）。患者の総数や疫学上の有病率とは違います。
