# みんなでつくる「見えない病気の星図」

名古屋大学ComoNe「ねのねプログラム」応募用の、GitHub Pagesで動作する静的Webプロトタイプです。希少疾患を知り、問いを残し、関心をつなぐ体験を、外部送信なしで試せます。

## 使い方

ローカルでは、フォルダを簡易HTTPサーバーで開いてください（例：`python -m http.server 8000`）。`http://localhost:8000` にアクセスします。`index.html` を直接開くとブラウザの安全制限によりJSONを読み込めないことがあります。

応募画像用の固定表示は、`?demo=screenshot` を付けて開きます。例：`http://localhost:8000/?demo=screenshot`

## GitHub Pages 公開

1. このフォルダの内容をGitHubリポジトリのルートへ配置します。
2. GitHubの **Settings → Pages** で、公開元を対象ブランチの `/(root)` に設定します。
3. 表示されたURLへアクセスし、星図、詳細、関心、問い、リセットを確認します。

ビルド工程・外部API・ログイン・分析タグはありません。`.nojekyll` はGitHub Pagesの不要な変換を抑止します。

## 安全性とデータ

- 疾患情報は `content/diseases.sample.json` の応募用仮文です。正式公開前に専門的な内容確認が必要です。
- 診断、治療判断、医療相談を提供しません。
- 関心と問いは `localStorage` のみに保存し、外部送信しません。
- 問いは100文字までです。個人情報らしい入力には警告を出しますが、正式運用では別途モデレーション設計が必要です。

## ファイル

- `index.html` — ページ構造と安全表示
- `styles.css` — レスポンシブ・キーボードフォーカス・reduced-motion対応
- `script.js` — SVG星図、詳細、localStorage、入力保護、スクリーンショットモード
- `content/` — 提供された疾患・問いのサンプルデータ


## Supabase連携（展示版）

参加者の関心と問いを全来場者で共有するため、展示版ではSupabaseを利用します。

- 公開用設定: `config.js`
- DB初期化SQL: `supabase/migrations/001_initial.sql`
- `sb_publishable_...` はブラウザ公開用キーです。RLSを前提に公開コードで使用します。
- Secret key / service_role key はリポジトリへ保存しません。
- 自由記述の問いはINSERTのみ許可し、公開サイトからSELECTできない設計です。


## 今週の星図（週次レポート）

週次集計・A4印刷・過去週へのリンクに対応したページを `/weekly/` に追加しました。運用方法とデータ保全については [docs/WEEKLY_REPORT.md](docs/WEEKLY_REPORT.md) を参照してください。
