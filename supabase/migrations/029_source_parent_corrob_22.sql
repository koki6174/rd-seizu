-- Evidence-backed ORPHA crosswalk expansion on 2026-10-11.
-- 22 exact canonical English names, each with NANDO's parent independently
-- present in the Orphapacket ancestor path at depth 1..3.
-- Source-corroborated for a visualization, NOT independently clinician reviewed.
-- All 111+ other lexical matches are left pending.
create table if not exists public.disease_orpha_review_evidence(
 disease_id text primary key references public.disease_catalog(id),
 orpha_code integer not null unique check(orpha_code>0),
 nando_parent_en text not null,
 orpha_ancestor_en text not null,
 orpha_ancestor_code integer not null,
 ancestor_depth integer not null check(ancestor_depth between 1 and 3),
 review_type text not null default 'independent_taxonomy_parent_corroboration_not_clinician',
 source_commit text not null,
 reviewed_at timestamptz not null default now()
);
alter table public.disease_orpha_review_evidence enable row level security;
revoke all on public.disease_orpha_review_evidence from anon,authenticated;

insert into public.disease_orpha_review_evidence
(disease_id,orpha_code,nando_parent_en,orpha_ancestor_en,orpha_ancestor_code,ancestor_depth,source_commit)
values
 ('nando-111-2',597,'Congenital myopathy','Congenital myopathy',97245,2),
 ('nando-111-6',2020,'Congenital myopathy','Congenital myopathy',97245,1),
 ('nando-113-1-2',98895,'Muscular dystrophy','Muscular dystrophy',98473,3),
 ('nando-113-4',261,'Muscular dystrophy','Muscular dystrophy',98473,2),
 ('nando-113-5',270,'Muscular dystrophy','Muscular dystrophy',98473,2),
 ('nando-254-1',79276,'Porphyria','Porphyria',738,3),
 ('nando-254-2',79273,'Porphyria','Porphyria',738,3),
 ('nando-254-3',79473,'Porphyria','Porphyria',738,3),
 ('nando-254-5',101330,'Porphyria','Porphyria',738,3),
 ('nando-254-6',79277,'Porphyria','Porphyria',738,2),
 ('nando-254-8',95159,'Porphyria','Porphyria',738,2),
 ('nando-282-3',98870,'Congenital dyserythropoietic anemia','Congenital dyserythropoietic anemia',85,1),
 ('nando-30-1',45448,'Distal myopathy','Distal myopathy',599,2),
 ('nando-30-3',98897,'Distal myopathy','Distal myopathy',599,2),
 ('nando-61-2',56425,'Autoimmune hemolytic anemia','Autoimmune hemolytic anemia',98375,2),
 ('nando-61-4',90036,'Autoimmune hemolytic anemia','Autoimmune hemolytic anemia',98375,1),
 ('nando-61-5',1959,'Autoimmune hemolytic anemia','Autoimmune hemolytic anemia',98375,1),
 ('nando-85-1',2032,'Idiopathic interstitial pneumonia','Idiopathic interstitial pneumonia',98300,1),
 ('nando-85-2-2',79126,'Idiopathic interstitial pneumonia','Idiopathic interstitial pneumonia',98300,1),
 ('nando-85-2-3',1302,'Idiopathic interstitial pneumonia','Idiopathic interstitial pneumonia',98300,1),
 ('nando-85-2-6',79128,'Idiopathic interstitial pneumonia','Idiopathic interstitial pneumonia',98300,1),
 ('nando-9-1',2388,'Neuroacanthocytosis','Neuroacanthocytosis',263440,1)
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
 if n<>22 then
  raise exception 'Refusing ORPHA import: expected 22 independently parent-corroborated identities; observed %',n;
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
 if n<>22 then raise exception 'Failed to materialize all parent-corroborated ORPHA mappings: %',n;end if;
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
