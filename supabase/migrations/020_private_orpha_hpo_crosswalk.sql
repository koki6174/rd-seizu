-- All external mapping candidates remain private until manually reviewed.
create table if not exists public.disease_orpha_match_candidates (
 disease_id text not null references public.disease_catalog(id),
 orpha_code text not null,
 orpha_name_en text not null,
 match_basis text not null,
 review_status text not null default 'pending',
 source_version text not null,
 created_at timestamptz default now(),
 primary key(disease_id,orpha_code),
 constraint review_status_valid check(review_status in ('pending','approved','rejected'))
);
alter table public.disease_orpha_match_candidates enable row level security;
revoke all on public.disease_orpha_match_candidates from anon,authenticated;
create table if not exists public.disease_hpo_annotations (
 disease_id text not null references public.disease_catalog(id),
 orpha_code text not null,
 hpo_id text not null,
 evidence_reference text,
 frequency text,
 qualifier text,
 source_version text not null,
 primary key(disease_id,orpha_code,hpo_id,source_version)
);
alter table public.disease_hpo_annotations enable row level security;
revoke all on public.disease_hpo_annotations from anon,authenticated;
