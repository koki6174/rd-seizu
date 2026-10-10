# Orphadata全件照合の一次監査（2026-10-10）

## 対象と結果
**Orphanet/ORPHApacketの各公開レコードを走査し、現在の公開疾患DB 1,241件との病名照合候補を一括抽出した。**
本監査の候補は**機械抽出段階であり、自動承認・自動公開・医療的等価性の証明ではない**。

| 照合結果 | 件数 |
|---|---:|
| 対象カタログ | **1,241** |
| 英語名あり | **852** |
| 英語名なし（まず公式英名が必要） | **389** |
| ORPHA名または公式同義語に一意に一致した候補 | **275** |
| 重複や概念上の判断が必要 | **56** |
| 今回の厳格条件では一致なし | **521** |
| 上記275件のうちORPHA側 `Disease` | **183** |
| 上記183件のうちHPO症状あり | **167** |
| 上記167件のうち正式ラベル自体が完全一致 | **133** |

同一ORPHAcodeが複数の日本語疾患IDへ対応する**4組（8レコード）**を発見。
自動的に同じ病気として扱わず、いずれも `review_required` に移した。
一般的な「疾患」と広い「Clinical group」、細分類「Clinical subtype」を同じレベルに置かない。
症状注釈のある候補でも、確実に同等の疾患概念なのか専門確認が必要。

## どのように調べたか
- 出典：[Orphanet/Orphapacket](https://github.com/Orphanet/orphapacket)、CC BY 4.0。
- `json/ORPHApacket_*.json`を1ファイルずつ解析（**10,104レコード**）。
- 同一性判定は英語正式病名またはOrphanetの明示的同義語による**NFKC・大文字小文字・空白の正規化完全一致**のみ。
- 編集距離・疾患名の機械翻訳・曖昧な症状の似かよりによるマッチングはしない。
- 疾患名が一致していても、別のORPHAcodeにまたがる場合や複数のカタログ行に対応する場合は要審査にする。
- ソースcommitのSHAは`data/orpha_matching_summary.json`の`upstream_commit`に記録する。
- ユーザーデータ・病名検索履歴・内部紹介アルゴリズムはこの照合に一切使わない。

## 生成ファイルと利用
- `data/orpha_matching_names_public.json`：公開中の日本語・英語病名とIDのみ。
- `data/orpha_matching_candidates.json`：各行の候補ORPHAcode・一致根拠・注意点。
- `data/orpha_matching_summary.json`：全件集計。
- `scripts/build_orpha_candidates.cjs`：完全一致の候補作成アルゴリズム。
- `.github/workflows/orpha-audit.yml`：Orphapacketを公式GitHubから取得・監査・候補だけ出力。

**このツール自体には本番Supabaseを書き換える権限を与えていない**。
現段階でDBに正式に登録されているORPHAcodeは、別途原典を確認した17疾患のまま。
今後は`Disease`型の正式名称完全一致かつ一意な候補を優先して二次確認し、出典付きで段階的に追加する。

## 限界
同名なのに別の概念、病名の年代違い、日本語の広い分類とOrphadataの狭い病型は自動対応できない。
英語名が登録されていない389疾患はまず根拠に基づく英語表記を収集する。
さらにHPO `phenotype.hpoa`とOrphadataの注釈の同一性・医学的近傍の意味を検証する。
