-- Totals are cumulative through the specified Japan-local Monday 00:00.
-- Synthetic integration-test rows in legacy interactions are excluded.
create or replace function public.get_cumulative_constellation(p_week_start date)
returns jsonb language sql stable security definer set search_path=''
as $$
with evt as (
 select disease_id,created_at,'legacy'::text as kind from public.interactions where disease_id not like '\_\_%'
 union all
 select disease_id,created_at,kind from public.star_entries
), d as (
 select (p_week_start::timestamp at time zone 'Asia/Tokyo') as cutoff,
        ((p_week_start-7)::timestamp at time zone 'Asia/Tokyo') as prev
)
select jsonb_build_object(
 'total', count(*) filter (where e.created_at<d.cutoff),
 'week_added', count(*) filter(where e.created_at>=d.prev and e.created_at<d.cutoff),
 'previous_total',count(*) filter(where e.created_at<d.prev),
 'active_diseases',count(distinct e.disease_id) filter(where e.created_at<d.cutoff),
 'shared',count(*) filter(where e.created_at<d.cutoff and e.kind='share'),
 'discovered',count(*) filter(where e.created_at<d.cutoff and e.kind='discover')
)
from d left join evt e on true
$$;
revoke execute on function public.get_cumulative_constellation(date) from public,anon,authenticated;
grant execute on function public.get_cumulative_constellation(date) to anon;
