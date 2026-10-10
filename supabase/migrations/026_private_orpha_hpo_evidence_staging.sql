-- ORPHA crosswalk candidates remain private until domain review.
-- Exact English names alone are insufficient to assert identity of disease groups/subtypes.
create table if not exists public.disease_orpha_evidence_staging(
 disease_id text primary key references public.disease_catalog(id) on delete restrict,
 orpha_code integer not null unique check(orpha_code>0),
 orpha_label text not null,match_method text not null,
 review_status text not null default 'unreviewed'
  check(review_status in ('unreviewed','needs_review','reviewed','rejected')),
 hpo_annotations jsonb not null default '[]'::jsonb,
 gene_associations jsonb not null default '[]'::jsonb,
 inheritance_terms text[] not null default '{}',
 onset_terms text[] not null default '{}',
 source_commit text not null,source_license text not null default 'CC BY 4.0',
 created_at timestamptz not null default now()
);
alter table public.disease_orpha_evidence_staging enable row level security;
revoke all on public.disease_orpha_evidence_staging from anon,authenticated;
comment on table public.disease_orpha_evidence_staging is
 'HPO and Orphadata source evidence for unreviewed exact-label candidates; no anonymous access.';