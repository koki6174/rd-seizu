-- Source-only HPO phenotypes: keyed by ORPHAcode, not linked to local disease_id
-- until an expert approves disease_orpha_match_candidates.
create table if not exists public.orpha_hpo_source_profiles (
  orpha_code text primary key,
  positive_hpo_ids text[] not null default '{}',
  source_version text not null,
  reviewed_disease_link boolean not null default false,
  imported_at timestamptz not null default now()
);
alter table public.orpha_hpo_source_profiles enable row level security;
revoke all on public.orpha_hpo_source_profiles from anon,authenticated;
comment on table public.orpha_hpo_source_profiles is
 'Private source-level HPO terms from Orphadata CC BY 4.0; not assigned to local disease concepts until an approved ORPHA mapping exists.';
