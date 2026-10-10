-- Unreviewed EXACT preferred-label candidate evidence: never promote to confirmed mapping automatically.
-- Source: Orphanet / ORPHApacket, © INSERM 1999, CC BY 4.0.
create table if not exists public.disease_orpha_candidate_profiles (
 disease_id text primary key references public.disease_catalog(id) on delete restrict,
 orpha_code integer not null unique check (orpha_code > 0),
 original_label text not null,
 match_method text not null check (match_method='exact_preferred_label_unique'),
 review_status text not null default 'unreviewed' check (review_status in ('unreviewed','under_review','rejected','verified')),
 hpo_annotations jsonb not null default '[]'::jsonb,
 gene_associations jsonb not null default '[]'::jsonb,
 inheritance_terms text[] not null default '{}'::text[],
 onset_terms text[] not null default '{}'::text[],
 source_commit text not null,
 source_license text not null default 'CC BY 4.0, Orphanet/INSERM',
 x numeric not null check(x between -30 and 30),
 y numeric not null check(y between -30 and 30),
 z numeric not null check(z between -30 and 30),
 cluster smallint,
 membership numeric check(membership between 0 and 1),
 created_at timestamptz not null default now()
);
alter table public.disease_orpha_candidate_profiles enable row level security;
revoke all on public.disease_orpha_candidate_profiles from anon,authenticated;

-- Expose only the visualization coordinates, never candidate gene/HPO evidence or confidence
-- as medically verified data. The title/description on /lab/ must say unreviewed.
create or replace function public.get_provisional_hpo_positions()
returns jsonb language sql stable security definer set search_path=''
as $$
 select coalesce(jsonb_agg(jsonb_build_object(
  'id',m.disease_id,'x',m.x,'y',m.y,'z',m.z)
  order by m.disease_id),'[]'::jsonb)
 from public.disease_orpha_candidate_profiles m
 join public.disease_catalog d on d.id=m.disease_id
 where d.published and m.review_status in ('unreviewed','under_review','verified')
$$;
revoke all on function public.get_provisional_hpo_positions() from public,anon,authenticated;
grant execute on function public.get_provisional_hpo_positions() to anon;
