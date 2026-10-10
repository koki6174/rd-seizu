-- Weekly reporting: added 2026-10-10.
-- Keeps historical public.interactions and public.questions untouched.
create table if not exists public.weekly_editorial (
  week_start date primary key check (extract(isodow from week_start) = 1),
  featured_question text check (featured_question is null or char_length(featured_question) <= 180),
  growth_note text check (growth_note is null or char_length(growth_note) <= 240),
  approved boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.weekly_editorial enable row level security;
revoke all on table public.weekly_editorial from anon, authenticated;
grant select on table public.weekly_editorial to anon;

create policy "Anyone can read approved weekly editorial"
on public.weekly_editorial for select to anon using (approved = true);

-- Event counts, not unique participant counts. Invoker permissions preserve RLS.
create function public.get_weekly_constellation(p_week_start date)
returns table (
  interest_count bigint,
  previous_interest_count bigint,
  first_count bigint,
  learn_count bigint,
  known_count bigint,
  disease_count bigint,
  top_disease_id text,
  top_disease_count bigint,
  daily_counts jsonb
)
language sql stable security invoker set search_path = ''
as $function$
  with bounds as (
    select (p_week_start::timestamp at time zone 'Asia/Tokyo') as week_begin,
      ((p_week_start + 7)::timestamp at time zone 'Asia/Tokyo') as week_end,
      ((p_week_start - 7)::timestamp at time zone 'Asia/Tokyo') as previous_begin
  ),
  current_events as (
    select i.disease_id, i.interest_type, i.created_at
    from public.interactions i cross join bounds b
    where i.created_at >= b.week_begin and i.created_at < b.week_end
  ),
  totals as (
    select count(*) as interest_count,
      count(*) filter (where interest_type = 'first') as first_count,
      count(*) filter (where interest_type = 'learn') as learn_count,
      count(*) filter (where interest_type = 'known') as known_count,
      count(distinct disease_id) as disease_count
    from current_events
  ),
  top_disease as (
    select disease_id, count(*) as n
    from current_events group by disease_id
    order by n desc, disease_id asc limit 1
  ),
  by_day as (
    select ((created_at at time zone 'Asia/Tokyo')::date - p_week_start) as day_idx,
      count(*) as n from current_events group by 1
  )
  select t.interest_count,
    (select count(*) from public.interactions i cross join bounds b
      where i.created_at >= b.previous_begin and i.created_at < b.week_begin),
    t.first_count, t.learn_count, t.known_count, t.disease_count,
    (select disease_id from top_disease),
    coalesce((select n from top_disease), 0),
    (select coalesce(jsonb_agg(
      jsonb_build_object('day', days.d, 'count', coalesce(by_day.n, 0))
      order by days.d), '[]'::jsonb)
      from generate_series(0,6) as days(d)
      left join by_day on by_day.day_idx = days.d)
  from totals t;
$function$;
revoke all on function public.get_weekly_constellation(date) from public, anon, authenticated;
grant execute on function public.get_weekly_constellation(date) to anon;
comment on function public.get_weekly_constellation(date)
is 'Returns aggregate interest event counts for a Monday-start JST week; no raw questions or user identifiers.';
