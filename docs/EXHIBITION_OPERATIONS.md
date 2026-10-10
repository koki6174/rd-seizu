# 展示運営：病名の申請とUX分析（2026-10-10）

## 構成・公開状況

- `/` : Coming Soon。既存QRリンクを変更しない。
- `/admin/` : 参加型星図（**管理者認証画面ではない**）。
- `/weekly/` : 累積週次レポート、A4横向き印刷。不要な画面内説明は表示しない。
- `/privacy/` : 収集項目、目的、利用状況記録を停止する設定。
- `disease_catalog` : 公開検索用の日本語疾患・病型候補1,241件は維持。

## 未掲載病名を申請する流れ

1. 参加者が「伝えたい想いがある」を選び、疾患名を探す。
2. 「探している病名がない場合」から病名（2〜80文字）を入力。
3. クライアントとDB側で最低限のフォーマット検証を行う（URL、メール形式、改行不可）。
4. `suggest_missing_disease`（SECURITY DEFINER）で`disease_suggestions`に`status='pending'`を保存。
5. 投稿した画面には「運営に申請しました」と表示。**申請しただけでは病名の星は作らない。**
6. 同じブラウザ識別子での申請は、日本時間の日付単位で1回。**別端末・ローカルデータ削除は防げない**。
7. 運営が疾病名か、別名か、複数疾病の説明文や悪意ある文字列かを確認してからカタログに登録する。

自由記述コメント`star_entries`とは**別の非公開テーブル**で管理。匿名読み取り権限・直接書き込み権限はなし。公開JavaScriptにservice_role keyを置かない。

### Supabase SQL Editorで承認待ちを確認

```sql
select id, suggested_name, created_at, status
from public.disease_suggestions
where status = 'pending'
order by created_at desc;
```

申請された病名の表記揺れ・同義語を既存`disease_catalog`と照合し、問題がなければ運営者が**手動で**登録・承認する。UI上のメール・プッシュ通知はまだない。ユーザーが通知メールの宛先と送信サービスを設定後に実装可能。

承認・却下は運営者がSQL Editor / Table Editorで行う。例（UUIDを置換）：
```sql
update public.disease_suggestions
set status='rejected', reviewed_at=now()
where id='00000000-0000-0000-0000-000000000000'
  and status='pending';
```

## 展示分析のデータ設計

`exhibition_analytics` は**閲覧セッション単位**で、訪問した画面・経路・有効滞在秒数・再抽選などを記録する。

| event_type | 意味 |
|---|---|
| `visit` | 来訪（新しいセッション） |
| `screen_exit` | セクションまたは投稿ステップから離れた際の有効滞在秒数 |
| `page_exit` | ページを閉じた／遷移したとき |
| `path_share` | 「伝えたい」選択 |
| `path_discover` | 「知らない星に出会う」選択 |
| `random_draw` | ランダム紹介（再抽選を含む） |
| `disease_select` | 自分で検索して病名を選択 |
| `search_no_result` | 疾患名の検索結果0件（検索語は保存しない） |
| `suggest_open` / `suggest_sent` | 未掲載病名の提案を開いた／申請した |
| `submit_success` | 星を灯す投稿の完了 |
| `star_view` | 既存の星を開いた |

区切りは`home`,`sky`,`choose`,`disease`,`comment`,`done`,`weekly`。
ブラウザがバックグラウンドになっている時間は計測せず、表示中の有効時間を集計する。
30秒ごとに中間的な記録を保存し、ページ離脱時は`keepalive`で送信を試みる。**ネットワーク断やブラウザの強制終了では一部欠ける**。
詳細イベントは非公開。IPアドレス、端末ID、病名、検索語、コメントを分析テーブルへ保存しない。
セッション識別子は毎回新規発行し、既存の参加用ブラウザ識別子とは紐づけない。
`/privacy/` で任意の行動計測を停止できる（停止しても投稿は可能）。

### 訪問・経路・再抽選の確認（SQL Editor）

```sql
select
 date(created_at at time zone 'Asia/Tokyo') as day,
 count(*) filter(where event_type='visit') as visits,
 count(*) filter(where event_type='path_share') as chose_share,
 count(*) filter(where event_type='path_discover') as chose_discover,
 count(*) filter(where event_type='random_draw') as random_draws,
 count(*) filter(where event_type='search_no_result') as searches_without_match,
 count(*) filter(where event_type='suggest_sent') as disease_requests,
 count(*) filter(where event_type='submit_success') as completed_stars
from public.exhibition_analytics
group by 1 order by 1 desc;
```

### ステップごとの平均有効滞在秒数

```sql
select section, count(*) as segments,
 round(avg(duration_seconds)::numeric,1) as avg_segment_seconds,
 round(sum(duration_seconds)::numeric,0) as total_active_seconds
from public.exhibition_analytics
where event_type='screen_exit'
group by section
order by total_active_seconds desc;
```

滞在は30秒ごとに分割されるので、`avg_segment_seconds`は**1人あたり滞在時間とは違う**。ユーザーの目安とするならセッションごとに加算する：
```sql
with by_session as (
 select session_id, section, sum(duration_seconds) as seconds
 from public.exhibition_analytics
 where event_type='screen_exit'
 group by session_id,section
)
select section, round(avg(seconds)::numeric,1) as avg_session_seconds
from by_session group by section;
```

### 上位50疾患の「飽和」を判断する

```sql
select
 count(*) filter(where d.discovery_rank is not null) as top50_diseases,
 count(*) filter(where d.discovery_rank is not null and s.posts>0) as top50_lit,
 coalesce(sum(s.posts) filter(where d.discovery_rank is not null),0) as top50_posts,
 coalesce(sum(s.posts) filter(where d.discovery_rank is null),0) as other_posts
from public.disease_catalog d
left join (select disease_id,count(*) as posts from public.star_entries
           where kind='discover' group by disease_id) s
on s.disease_id=d.id
where d.published;
```

「紹介抽選回数」と「実際の投稿数」は異なる。どの疾患がランダム抽選されたかという詳細ログは**個人の興味を追跡しない設計**なので現状取得しない。閲覧されたページの秒数は概算であり、行動を直接の個人プロフィールにしない。

## 法務・削除ルール

個人情報保護委員会のガイドラインでは、Cookie等による閲覧履歴は個人関連情報となり得る。
今回は利用目的の表示、任意行動計測の停止、データ最小化、匿名の書込専用RPC、RLSを用意したが、**これだけで法的な適合性を保証しない**。
イベントを第三者に提供したり個人データと結びつけるときは追加検討が必要。
利用者の行動分析データは90日を目安に削除。現段階ではDBの自動削除ジョブを未設定なので運営が定期実行する。

```sql
delete from public.exhibition_analytics
where created_at < now() - interval '90 days';
```

`disease_suggestions`は審査後も不要な自由記述を長期間保持しない。展示前に運営権限と通知先を設定すること。
