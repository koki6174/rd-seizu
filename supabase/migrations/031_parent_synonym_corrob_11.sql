-- Second ORPHA crosswalk expansion: exact NANDO parent matches ORPHA ancestor name OR official synonym.
-- Additional 11 distinct canonical English labels, independently supported by NANDO vs ORPHA parent/synonym hierarchy.
-- Source-corroborated for a visualization, NOT independently clinician reviewed.
-- Remaining 89 lexical source candidates (and others) are kept unapproved.
create table if not exists public.disease_orpha_review_evidence(
 disease_id text primary key references public.disease_catalog(id),
 orpha_code integer not null unique check(orpha_code>0),
 nando_parent_en text not null,
 orpha_ancestor_en text not null,
 orpha_ancestor_code integer not null,
 ancestor_depth integer not null check(ancestor_depth between 1 and 3),
 review_type text not null default 'independent_taxonomy_parent_corroboration_not_clinician',
 source_commit text not null default '7a631b4369d8ee85695edf5c099d256a3461665d',
 reviewed_at timestamptz not null default now()
);
alter table public.disease_orpha_review_evidence enable row level security;
revoke all on public.disease_orpha_review_evidence from anon,authenticated;

alter table public.disease_orpha_review_evidence
 add column if not exists orpha_ancestor_matching_term text;
alter table public.disease_orpha_review_evidence
 add column if not exists orpha_parent_match_type text;

insert into public.disease_orpha_review_evidence
(disease_id,orpha_code,nando_parent_en,orpha_ancestor_en,orpha_ancestor_code,ancestor_depth,orpha_ancestor_matching_term,orpha_parent_match_type)
values
 ('nando-106-2',575,'Cryopyrin-associated periodic syndrome','NLRP3-associated autoinflammatory disease',208650,1,'Cryopyrin associated periodic syndrome','official_synonym'),
 ('nando-234-1-1',912,'Peroxisomal Disorder','Peroxisomal disease',68373,2,'Peroxisomal disease','preferred_label'),
 ('nando-234-1-2',44,'Peroxisomal Disorder','Peroxisomal disease',68373,2,'Peroxisomal disease','preferred_label'),
 ('nando-234-1-3',772,'Peroxisomal Disorder','Peroxisomal disease',68373,2,'Peroxisomal disease','preferred_label'),
 ('nando-234-2-1',2971,'Peroxisomal Disorder','Peroxisomal disease',68373,3,'Peroxisomal disease','preferred_label'),
 ('nando-234-6',926,'Peroxisomal Disorder','Peroxisomal disease',68373,2,'Peroxisomal disease','preferred_label'),
 ('nando-309-2',501,'Progressive myoclonus epilepsy','Progressive myoclonic epilepsy',98261,1,'Progressive myoclonus epilepsy','official_synonym'),
 ('nando-65-10',906,'Primary Immunodeficiency Syndrome','Primary immunodeficiency',101997,3,'Primary immunodeficiency','preferred_label'),
 ('nando-65-21',79124,'Primary Immunodeficiency Syndrome','Primary immunodeficiency',101997,3,'Primary immunodeficiency','preferred_label'),
 ('nando-65-43',1334,'Primary Immunodeficiency Syndrome','Primary immunodeficiency',101997,3,'Primary immunodeficiency','preferred_label'),
 ('nando-87-2',199241,'Pulmonary Veno-Occlusive Disease / Pulmonary Capillary Hemangiomatosis','Pulmonary veno-occlusive disease and/or pulmonary capillary hemangiomatosis',431353,1,'Pulmonary veno-occlusive disease and/or pulmonary capillary haemangiomatosis','official_synonym')
on conflict(disease_id) do nothing;

do $$
declare n integer;
begin
 select count(*) into n
 from public.disease_orpha_review_evidence e
 join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id
 join public.disease_catalog d on d.id=e.disease_id
 where e.orpha_code=s.orpha_code
  and lower(trim(d.name_en))=lower(trim(s.orpha_label))
  and e.review_type='independent_taxonomy_parent_corroboration_not_clinician'
  and e.source_commit=s.source_commit;
 if n<>33 then
  raise exception 'Refusing ORPHA import: expected 33 independently parent-corroborated identities; observed %',n;
 end if;
 if exists(select 1 from public.disease_orpha_review_evidence e
  join public.disease_orpha_mappings m on m.orpha_code=e.orpha_code and m.disease_id<>e.disease_id) then
  raise exception 'ORPHAcode already belongs to a different published disease';
 end if;
end $$;

insert into public.disease_orpha_mappings
 (disease_id,orpha_code,orpha_label,source_synonym,match_method,source_release)
select s.disease_id,s.orpha_code,s.orpha_label,null,'exact_label',
 'Orphapacket commit 7a631b4369d8ee85695edf5c099d256a3461665d'
from public.disease_orpha_review_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
on conflict(disease_id) do nothing;

do $$
declare n integer;
begin
 select count(*) into n from public.disease_orpha_review_evidence e
 join public.disease_orpha_mappings m on m.disease_id=e.disease_id and m.orpha_code=e.orpha_code;
 if n<>33 then raise exception 'Failed to materialize all 33 parent-corroborated ORPHA mappings: %',n;end if;
end $$;

insert into public.disease_external_mappings(source_name,source_id,disease_id,link_type)
select 'ORPHA',e.orpha_code::text,e.disease_id,'exact_name_and_parent_hierarchy_source_corroborated'
from public.disease_orpha_review_evidence e
on conflict(source_name,source_id) do nothing;

insert into public.disease_hpo_annotations
 (disease_id,orpha_code,hpo_id,hpo_label_en,frequency_raw,source_release,evidence_source)
select s.disease_id,s.orpha_code,term.obj->>'id',term.obj->>'label',
 term.obj->>'frequency','Orphapacket source commit 7a631b4369d8ee85695edf5c099d256a3461665d',
 'ORPHApacket phenotype evidence; taxonomy source-corroborated identity'
from public.disease_orpha_review_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
cross join lateral jsonb_array_elements(s.hpo_annotations) as term(obj)
where term.obj->>'id' ~ '^HP:[0-9]{7}$'
 and coalesce(lower(term.obj->>'frequency'),'') not like '%excluded%'
on conflict(disease_id,hpo_id) do nothing;

insert into public.disease_orpha_genes(disease_id,orpha_code,gene_symbol,association_type,source_release)
select distinct s.disease_id,s.orpha_code,g.obj->>'symbol',g.obj->>'association',
 'Orphapacket source commit 7a631b4369d8ee85695edf5c099d256a3461665d'
from public.disease_orpha_review_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
cross join lateral jsonb_array_elements(s.gene_associations) as g(obj)
where coalesce(g.obj->>'symbol','')<>'' and coalesce(g.obj->>'association','')<>''
on conflict do nothing;

insert into public.disease_orpha_inheritance(disease_id,orpha_code,inheritance_name,source_release)
select distinct s.disease_id,s.orpha_code,value,
 'Orphapacket source commit 7a631b4369d8ee85695edf5c099d256a3461665d'
from public.disease_orpha_review_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
cross join lateral unnest(s.inheritance_terms) value
where length(trim(value))>0
on conflict do nothing;

insert into public.disease_orpha_onset(disease_id,orpha_code,onset_name,source_release)
select distinct s.disease_id,s.orpha_code,value,
 'Orphapacket source commit 7a631b4369d8ee85695edf5c099d256a3461665d'
from public.disease_orpha_review_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
cross join lateral unnest(s.onset_terms) value
where length(trim(value))>0
on conflict do nothing;

update public.disease_orpha_evidence_staging s set review_status='reviewed'
from public.disease_orpha_review_evidence e
where s.disease_id=e.disease_id and s.orpha_code=e.orpha_code and s.review_status='unreviewed';
