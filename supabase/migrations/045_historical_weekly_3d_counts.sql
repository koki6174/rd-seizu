-- Historical weekly snapshot uses the same Tokyo-Monday cutoff as
-- get_cumulative_constellation(). Neither today's state nor future comments
-- are allowed to leak into previous weeks.
create or replace function public.get_weekly_constellation_stars(p_week_start date)
returns jsonb
language plpgsql stable security definer
set search_path=''
as $$
declare out_json jsonb;
begin
 if p_week_start is null
   or p_week_start < date '2020-01-01'
   or p_week_start > ((now() at time zone 'Asia/Tokyo')::date+7)
   or extract(isodow from p_week_start)<>1 then
   raise exception 'Invalid weekly snapshot date' using errcode='22023';
 end if;
 with cutoff as (
  select (p_week_start::timestamp at time zone 'Asia/Tokyo') as dt
 ), events as (
  select i.disease_id, 'legacy'::text kind from public.interactions i
  cross join cutoff t
  where i.created_at<t.dt and i.disease_id not like '\_\_%'
  union all
  select e.disease_id,e.kind from public.star_entries e cross join cutoff t
  where e.created_at<t.dt
 ), active as (
  select d.id,
   count(*)::integer total,
   count(*) filter(where e.kind='share')::integer shared,
   count(*) filter(where e.kind='discover')::integer discovered
  from events e
  join public.disease_catalog d on d.id=e.disease_id and d.published
  group by d.id
 )
 select coalesce(jsonb_agg(jsonb_build_object(
    'id',a.id,'total',a.total,'shared',a.shared,'discovered',a.discovered
 ) order by a.id),'[]'::jsonb)
 into out_json from active a;
 return out_json;
end
$$;
revoke all on function public.get_weekly_constellation_stars(date)
 from public,anon,authenticated;
grant execute on function public.get_weekly_constellation_stars(date) to anon,authenticated;
comment on function public.get_weekly_constellation_stars(date) is
 'Public anonymized disease-level cumulative counts at Tokyo Monday 00:00, consistent with weekly poster totals; no comments or visitor identifiers.';
