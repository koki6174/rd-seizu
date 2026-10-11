-- Keep clinical HPO/UMAP constellation truly inaccessible to anonymous
-- users. The link is also removed from public navigation, but hiding a link
-- must never be treated as access control.
create table if not exists public.clinical_constellation_owners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.clinical_constellation_owners enable row level security;
revoke all on public.clinical_constellation_owners from public,anon,authenticated;
comment on table public.clinical_constellation_owners is
 'Private owner allowlist. Populate with one verified Supabase Auth UUID via dashboard after provisioning account. Empty by default: deny everyone.';

create or replace function public.get_clinical_pilot_positions()
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $func$
begin
  if auth.uid() is null or not exists (
    select 1 from public.clinical_constellation_owners owner
    where owner.user_id=auth.uid()
  ) then
    raise exception 'Research visualization restricted' using errcode='42501';
  end if;
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id',p.disease_id,'x',p.x,'y',p.y,'z',p.z,
      'membership',p.membership,'cluster',p.fcm_cluster,
      'nHpo',p.annotated_hpo,'nGene',p.annotated_causal_genes
    ) order by p.disease_id),'[]'::jsonb)
    from public.disease_clinical_embedding_pilot p
    join public.disease_catalog d on d.id=p.disease_id
    where d.published
  );
end $func$;
revoke all on function public.get_clinical_pilot_positions() from public,anon,authenticated;
grant execute on function public.get_clinical_pilot_positions() to authenticated;

-- The weekly report uses midnight JST at the selected Monday, as does
-- get_cumulative_constellation(). Return only lit disease IDs and counts.
-- No browser tokens, raw comments, user IDs, or dark-star disease names.
create or replace function public.get_cumulative_constellation_lights(p_week_start date)
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $func$
declare result jsonb;
begin
  if p_week_start is null
     or extract(isodow from p_week_start)<>1
     or p_week_start > ((now() at time zone 'Asia/Tokyo')::date
                        - (extract(isodow from (now() at time zone 'Asia/Tokyo')::date)::int - 1))
  then
    raise exception 'Invalid report week' using errcode='22023';
  end if;
  with evt as (
    select i.disease_id,i.created_at,'legacy'::text as kind
    from public.interactions i where i.disease_id !~ '^__'
    union all
    select e.disease_id,e.created_at,e.kind from public.star_entries e
  ), cutoff as (
    select (p_week_start::timestamp at time zone 'Asia/Tokyo') as until_time
  ), grouped as (
    select evt.disease_id,
      count(*)::int as total,
      count(*) filter (where kind='share')::int as shared,
      count(*) filter (where kind='discover')::int as discovered,
      count(*) filter (where kind='legacy')::int as legacy
    from evt cross join cutoff
    join public.disease_catalog d on d.id=evt.disease_id and d.published
    where evt.created_at<cutoff.until_time
    group by evt.disease_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',disease_id,'total',total,'shared',shared,
    'discovered',discovered,'legacy',legacy
  ) order by disease_id),'[]'::jsonb)
  into result from grouped;
  return result;
end $func$;
revoke all on function public.get_cumulative_constellation_lights(date) from public,anon,authenticated;
grant execute on function public.get_cumulative_constellation_lights(date) to anon,authenticated;
