-- Daily cumulative exhibition snapshot. Historical days show totals at next JST
-- midnight; today's date uses the last completed JST hour boundary.
-- Only anonymous aggregates are returned, never comments or visitor identifiers.
create or replace function public.get_daily_constellation(p_day date)
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $fn$
declare
 v_cutoff timestamptz;
 v_start timestamptz;
 v_result jsonb;
begin
 if p_day is null
   or p_day < date '2026-10-01'
   or p_day > (pg_catalog.statement_timestamp() at time zone 'Asia/Tokyo')::date
 then
   raise exception 'Invalid daily archive date' using errcode='22023';
 end if;
 v_start := p_day::timestamp at time zone 'Asia/Tokyo';
 v_cutoff := least(
   (pg_catalog.date_trunc(
      'hour', pg_catalog.statement_timestamp() at time zone 'Asia/Tokyo'
    ) at time zone 'Asia/Tokyo'),
   (p_day+1)::timestamp at time zone 'Asia/Tokyo'
 );
 with events as (
   select i.disease_id, i.created_at, 'legacy'::text as kind
   from public.interactions i
   where i.disease_id !~ '^__'
   union all
   select e.disease_id, e.created_at, e.kind
   from public.star_entries e
 ), valid_events as (
   select e.disease_id,e.created_at,e.kind
   from events e
   inner join public.disease_catalog d on d.id=e.disease_id and d.published
   where e.created_at < v_cutoff
 ), active as (
   select v.disease_id as id,
     count(*)::integer as total,
     count(*) filter(where v.kind='share')::integer as shared,
     count(*) filter(where v.kind='discover')::integer as discovered
   from valid_events v
   group by v.disease_id
 ), metrics as (
   select count(*)::integer as total,
     count(*) filter(where created_at>=v_start)::integer as day_added,
     count(distinct disease_id)::integer as active_diseases,
     count(*) filter(where kind='share')::integer as shared,
     count(*) filter(where kind='discover')::integer as discovered
   from valid_events
 )
 select jsonb_build_object(
   'date',p_day,
   'as_of',v_cutoff,
   'total',m.total,
   'day_added',m.day_added,
   'active_diseases',m.active_diseases,
   'shared',m.shared,
   'discovered',m.discovered,
   'stars',(select coalesce(jsonb_agg(jsonb_build_object(
      'id',a.id,'total',a.total,'shared',a.shared,'discovered',a.discovered
    ) order by a.id),'[]'::jsonb) from active a)
 ) into v_result
 from metrics m;
 return v_result;
end;
$fn$;

revoke all on function public.get_daily_constellation(date)
 from public,anon,authenticated;
grant execute on function public.get_daily_constellation(date) to anon;
comment on function public.get_daily_constellation(date) is
 'Read-only daily JST aggregates and star illumination. Today shows hourly cutoff on the hour (Asia/Tokyo); historical dates use following JST midnight. No visitor or comment data.';

do $check$
begin
 if not has_function_privilege('anon','public.get_daily_constellation(date)','EXECUTE') then
   raise exception 'Daily exhibition archive RPC not accessible to visitors';
 end if;
end;
$check$;
