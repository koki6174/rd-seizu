# 研究用3D星図のアクセス制限

メインの1,241件の展示は公開したまま、研究用のHPO・遺伝子ベースの3Dビューのリンクを来場者向けUIから取り除き、Supabase Authのログイン＋**明示的な1アカウント許可リスト**で研究用RPCを保護する。

## 公開状態

- 一般来場者のトップページから研究用ページへのリンクは表示しない。
- `/clinical/`へURLを直接入力しても、未認証・許可リスト外のユーザーには研究3D座標を提供しない。
- 従来の `get_clinical_pilot_positions()` は `anon`、`authenticated`、`PUBLIC`からの実行権限を廃止。
- 置き換えた `get_private_clinical_positions()` は「Supabaseの署名付き認証済みユーザー」かつ `clinical_research_viewers` に登録済みのUUIDにだけデータを返す。
- 許可リストは初期状態で**0人**。必要なユーザー以外に自動登録しない。メール認証しただけでは閲覧権限なし。
- `noindex,nofollow,noarchive,nosnippet` は検索への露出を下げるだけで、セキュリティ制御ではない。**本当の閲覧制限はDB/RPCの認可**で行う。

## 運営者アカウントの初期登録手順（1度だけ）

1. Supabase AuthでメールOTPログインを有効にし、`https://koki6174.github.io/rd-seizu/clinical/` をAuthentication → URL Configuration → Redirect URLsに登録する。
2. 開発者本人が専用URLを開き、本人が所有するメールアドレスでログインする。Supabase Authに新しい認証ユーザーが作成される。
3. プロジェクト管理者がSupabase SQL Editorで、その**実際のユーザーのUUID**を確認し、次を実行する。

```sql
-- ログイン成功後、対象メールはプロジェクト管理者が実物と突き合わせる
select id, email, created_at from auth.users order by created_at desc;

-- 本人確認したUUIDを以下へ入力（他人のメールから推定しない）
insert into public.clinical_research_viewers(user_id)
values ('<OWN_SUPABASE_AUTH_USER_UUID>'::uuid)
on conflict (user_id) do nothing;
```

4. 許可されたユーザーが再読み込みすると医学的特徴量の研究3Dが表示される。許可リスト外のユーザーはログインしても403。
5. 権限を取り消す場合は、Supabase SQL EditorからそのUUIDに対する許可リストの行を削除する。

**注意：現時点では閲覧者のアカウントUUIDが未提供であり、上記の個別登録は未完了。したがって研究ビューは全員に対してロックされた状態。**

## 公開GitHubリポジトリとの関係

この機能は**ウェブの研究用ビューとSupabaseの生きた研究RPCへのアクセス制限**である。GitHubリポジトリが公開のため、以前コミットした研究用JSON座標、HPOのソース情報、過去のコミット履歴そのものは公開状態にあり、隠しリンクや認証では取り消せない。

研究情報そのものを第三者にも見せない必要がある場合は、今後の生成物を**別の非公開GitHubリポジトリや非公開ストレージに移す**必要がある。公開GitHub上の既存のコピーや履歴は別途整理が必要。

## 週次3Dと非点灯星

`get_weekly_constellation_stars(p_week_start)`は累積レポートの`get_cumulative_constellation()`と**同一の「日本時間の指定週月曜00:00より前」**のカットオフを使う。投稿・過去の記録から疾患ごとの匿名件数だけを返し、コメント・個人識別情報を渡さない。

`weekly/`の3Dでは全1,241件の分類座標は暗い点としてそのまま維持し、指定時点までに参加があった疾患のみ光らせる。違う週に移動すると、その週のデータで再描画する。印刷時にはその3Dの視点の静止画像をA4週次レポート内に含める。

トップページと週次の**未点灯の星はクリック・タップしても病名を表示しない**。疾病検索・投稿フォームにおける疾患名の選択は別の動作であり従来通り利用できる。
