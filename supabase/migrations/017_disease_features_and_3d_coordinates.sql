-- Constellation research-stage 3D model, 2026-10-10.
-- Unknown epidemiology, heredity, prognosis or treatment is represented as NULL.
-- No star entry, comment, anonymous token or editorial data is modified.
create table if not exists public.disease_feature_profiles (
  disease_id text primary key references public.disease_catalog(id) on delete restrict,
  nando_class_id smallint check(nando_class_id between 1 and 15),
  pediatric_group text,
  parent_disease_id text references public.disease_catalog(id),
  hereditary_pattern text,
  onset_category text,
  prevalence_per_100k numeric,
  prevalence_region text,
  prevalence_year integer,
  treatment_status text,
  nando_source_id text,
  class_source_url text,
  source_version text,
  updated_at timestamptz not null default now()
);
create index if not exists disease_feature_profiles_group_idx on public.disease_feature_profiles(nando_class_id);
create index if not exists disease_feature_profiles_pediatric_idx on public.disease_feature_profiles(pediatric_group);
alter table public.disease_feature_profiles enable row level security;
revoke all on public.disease_feature_profiles from anon,authenticated;

create table if not exists public.disease_embedding_coordinates (
  disease_id text primary key references public.disease_catalog(id) on delete restrict,
  x numeric not null check(x between -30 and 30),
  y numeric not null check(y between -30 and 30),
  z numeric not null check(z between -30 and 30),
  group_label text,
  fuzzy_cluster smallint,
  membership_strength numeric check(membership_strength between 0 and 1),
  coverage_kind text not null,
  model_version text not null,
  created_at timestamptz not null default now()
);
alter table public.disease_embedding_coordinates enable row level security;
revoke all on public.disease_embedding_coordinates from anon,authenticated;

create or replace function public.get_constellation_positions()
returns jsonb language sql stable security definer set search_path=''
as $$
 select coalesce(jsonb_agg(
   jsonb_build_object('id',m.disease_id,'x',m.x,'y',m.y,'z',m.z,
   'cluster',m.group_label,'coverage',m.coverage_kind)
   order by m.disease_id), '[]'::jsonb)
 from public.disease_embedding_coordinates m
 join public.disease_catalog d on d.id=m.disease_id
 where d.published
$$;
revoke all on function public.get_constellation_positions() from public,anon,authenticated;
grant execute on function public.get_constellation_positions() to anon;
comment on public.disease_feature_profiles is
 'Curated categorical pilot profiles. NULL = unknown/not assessed, never an absence assertion.';
comment on public.disease_embedding_coordinates is
 'Exploratory stable 3D positions; geometric distances are not validated biomedical similarity scores.';
