# Supabase setup

1. Supabase Dashboardで対象プロジェクトを開く。
2. SQL Editorを開く。
3. `supabase/migrations/001_initial.sql` 全文を貼り付けて Run。
4. Table Editorで `interactions` と `questions` が作成されたことを確認する。
5. GitHub Pages側は `config.js` のPublishable keyで接続する。

## Security

- `interactions`: 匿名ユーザーはSELECT/INSERTのみ。UPDATE/DELETE不可。
- `questions`: 匿名ユーザーはINSERTのみ。SELECT/UPDATE/DELETE不可。
- 自由記述は `approved=false` 固定で投稿される。
- Secret key / service_role keyは公開コードへ置かない。
