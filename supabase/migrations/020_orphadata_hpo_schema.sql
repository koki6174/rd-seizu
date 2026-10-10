-- Manually verified ORPHA disease identities; source data are CC BY 4.0.
-- HPO identifiers, frequency text, gene roles and onset are source-backed;
-- missing values do not mean clinical absence.
create table if not exists public.disease_orpha_mappings (
 disease_id text primary key references public.disease_catalog(id) on delete restrict,
 orpha_code integer not null unique check(orpha_code>0),
 orpha_label text not null,source_synonym text,
 match_method text not null check(match_method in ('exact_label','exact_synonym','punctuation_verified')),
 source_release text not null,
 reviewed_at timestamptz not null default now()
);
create table if not exists public.disease_hpo_annotations (
 disease_id text not null references public.disease_catalog(id) on delete restrict,
 orpha_code integer not null,hpo_id text not null check(hpo_id ~ '^HP:[0-9]{7}$'),
 hpo_label_en text,frequency_raw text,source_release text not null,
 evidence_source text not null default 'Orphadata ORPHApacket phenotypes',
 primary key(disease_id,hpo_id)
);
create index if not exists disease_hpo_annotations_hpo_idx
 on public.disease_hpo_annotations(hpo_id);
create table if not exists public.disease_orpha_genes (
 disease_id text not null references public.disease_catalog(id) on delete restrict,
 orpha_code integer not null,gene_symbol text not null,association_type text not null,
 source_release text not null,primary key(disease_id,gene_symbol,association_type)
);
create table if not exists public.disease_orpha_inheritance (
 disease_id text not null references public.disease_catalog(id) on delete restrict,
 orpha_code integer not null,inheritance_name text not null,source_release text not null,
 primary key(disease_id,inheritance_name)
);
create table if not exists public.disease_orpha_onset (
 disease_id text not null references public.disease_catalog(id) on delete restrict,
 orpha_code integer not null,onset_name text not null,source_release text not null,
 primary key(disease_id,onset_name)
);
do $$
declare t text;
begin
 foreach t in array array['disease_orpha_mappings','disease_hpo_annotations','disease_orpha_genes',
 'disease_orpha_inheritance','disease_orpha_onset'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from anon,authenticated',t);
 end loop;
end $$;
