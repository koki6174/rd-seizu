-- All 1,241 catalog concepts receive a typed numeric taxonomy vector.
-- Only measured/annotated clinical signals are stored. Absent evidence is NULL.
-- NOT a 1,241-disease clinical HPO model; not a diagnosis tool.
create table if not exists public.disease_numeric_feature_profiles (
  disease_id text primary key references public.disease_catalog(id) on delete restrict,
  taxonomy_vector real[] not null check(array_length(taxonomy_vector,1)=34),
  taxonomy_group_code smallint not null check(taxonomy_group_code between 1 and 17),
  taxonomy_evidence_source text,
  taxonomy_parent_depth smallint not null check(taxonomy_parent_depth between 0 and 10),
  n_children integer not null check(n_children>=0),
  is_subtype smallint not null check(is_subtype in (0,1)),
  has_source_class boolean not null,
  orpha_code integer,
  medical_identity_evidence text not null check (medical_identity_evidence in
    ('none','prior_corroborated','parent_corroborated','mondo_triangulated')),
  hpo_sparse_weights jsonb,
  causal_gene_sparse jsonb,
  inheritance_observed jsonb,
  onset_observed jsonb,
  hpo_term_count integer check(hpo_term_count is null or hpo_term_count>=0),
  causal_gene_count integer check(causal_gene_count is null or causal_gene_count>=0),
  inheritance_term_count integer check(inheritance_term_count is null or inheritance_term_count>=0),
  onset_term_count integer check(onset_term_count is null or onset_term_count>=0),
  observed_mask jsonb not null,
  feature_version text not null default 'all-concepts-taxonomy34-clinical-sparse-v1',
  updated_at timestamptz not null default now()
);
alter table public.disease_numeric_feature_profiles enable row level security;
revoke all on public.disease_numeric_feature_profiles from anon,authenticated;
create index if not exists disease_numeric_clinical_idx
  on public.disease_numeric_feature_profiles(medical_identity_evidence);
comment on table public.disease_numeric_feature_profiles is
 'Research-only vectors for all 1,241 disease concepts; taxonomy34 complete but sparse HPO/gene/onset masks distinguish not-annotated from absent phenotype. No private participant data or internal sampling rules.';
