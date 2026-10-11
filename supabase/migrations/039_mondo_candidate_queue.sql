-- A separate private review queue for full-catalog source correspondence.
-- MONDO hasDbXref(NANDO) is not a formal disease identity assertion.
create table if not exists public.disease_mondo_orpha_review_queue (
 disease_id text primary key references public.disease_catalog(id) on delete restrict,
 orpha_code integer unique not null,
 mondo_id text not null check (mondo_id ~ '^MONDO:[0-9]+$'),
 modern_nando_refs text[] not null,
 orpha_disorder_type text not null,
 has_positive_hpo boolean not null default false,
 observed_hpo_count integer,
 observed_gene_count integer,
 review_status text not null default 'pending'
   check(review_status in ('pending','approved','rejected')),
 source_release text not null,
 source_evidence jsonb not null,
 created_at timestamptz not null default now()
);
alter table public.disease_mondo_orpha_review_queue enable row level security;
revoke all on public.disease_mondo_orpha_review_queue from anon,authenticated;
comment on table public.disease_mondo_orpha_review_queue is
 'Independent ontology evidence candidate queue, not a clinically approved ORPHA link. Group/subtype granularity remains to be reviewed.';
