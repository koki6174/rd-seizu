-- Strict research-only promotion for 24 SOURCE-CORROBORATED subtypes.
-- Each: NANDO legacy concept_kind disease_subtype, ORPHA Clinical subtype,
-- 3-way exact English preferred name, independently curated MONDO NANDO and
-- MONDO exact ORPHA xrefs. Still NOT a clinician's individual diagnosis review.
-- All remaining 51 extra candidates stay unapproved in private staging.
do $$
declare n integer;
begin
 with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
 select count(*) into n from intended i
 join public.disease_mondo_orpha_review_queue q
 on q.disease_id=i.disease_id and q.orpha_code=i.orpha_code
 join public.disease_catalog d on d.id=i.disease_id
 join public.disease_orpha_evidence_staging s
 on s.disease_id=i.disease_id and s.orpha_code=i.orpha_code
 where q.orpha_disorder_type='Clinical subtype'
   and d.concept_kind='disease_subtype'
   and q.has_positive_hpo
   and jsonb_array_length(s.hpo_annotations)>0
   and lower(trim(d.name_en))=lower(trim(s.orpha_label));
 if n<>24 then raise exception 'Refusing research import: %/24 subtype concepts corroborated',n;end if;
 if exists (
   with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
   select 1 from intended i
   join public.disease_orpha_mappings m on m.orpha_code=i.orpha_code
   where m.disease_id<>i.disease_id) then
   raise exception 'Refusing ORPHA identity collision';
 end if;
end $$;

with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
insert into public.disease_orpha_mondo_evidence
(disease_id,orpha_code,mondo_id,modern_nando_ids,canonical_english,
 source_sha,mapping_status)
select q.disease_id,q.orpha_code,q.mondo_id,q.modern_nando_refs,d.name_en,
 '9bfccbe9217cdfa6a225058bfa6e4bd55512b432',
 'source_matched_clinical_subtype_not_independently_clinician_reviewed'
from intended i
join public.disease_mondo_orpha_review_queue q on q.disease_id=i.disease_id and q.orpha_code=i.orpha_code
join public.disease_catalog d on d.id=i.disease_id
on conflict(disease_id) do nothing;

with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
insert into public.disease_orpha_mappings(disease_id,orpha_code,orpha_label,
 source_synonym,match_method,source_release)
select s.disease_id,s.orpha_code,s.orpha_label,null,'exact_label',
 'MONDO 2026-10 and ORPHApacket; same clinical subtype category; not clinician-reviewed'
from intended i
join public.disease_orpha_evidence_staging s on s.disease_id=i.disease_id and s.orpha_code=i.orpha_code
on conflict(disease_id) do nothing;

with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
insert into public.disease_external_mappings(source_name,source_id,disease_id,link_type)
select 'ORPHA',i.orpha_code::text,i.disease_id,'source_matched_clinical_subtype_not_clinician_reviewed'
from intended i
on conflict(source_name,source_id) do nothing;

with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
insert into public.disease_hpo_annotations
(disease_id,orpha_code,hpo_id,hpo_label_en,frequency_raw,source_release,evidence_source)
select i.disease_id,i.orpha_code,h.obj->>'id',h.obj->>'label',h.obj->>'frequency',
 'ORPHApacket source 2026','3-way exact ontology crosswalk; same clinical subtype; research'
from intended i join public.disease_orpha_evidence_staging s
on s.disease_id=i.disease_id and s.orpha_code=i.orpha_code
cross join lateral jsonb_array_elements(s.hpo_annotations) h(obj)
where h.obj->>'id' ~ '^HP:[0-9]{7}$'
and lower(coalesce(h.obj->>'frequency','')) not like '%excluded%'
on conflict(disease_id,hpo_id) do nothing;

with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
insert into public.disease_orpha_genes(disease_id,orpha_code,gene_symbol,association_type,source_release)
select distinct i.disease_id,i.orpha_code,g.obj->>'symbol',g.obj->>'association',
 'ORPHApacket source 2026'
from intended i join public.disease_orpha_evidence_staging s
on s.disease_id=i.disease_id and s.orpha_code=i.orpha_code
cross join lateral jsonb_array_elements(s.gene_associations) g(obj)
where length(trim(coalesce(g.obj->>'symbol','')))>0
and length(trim(coalesce(g.obj->>'association','')))>0
on conflict do nothing;

with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
insert into public.disease_orpha_inheritance(disease_id,orpha_code,inheritance_name,source_release)
select distinct i.disease_id,i.orpha_code,v,'ORPHApacket source 2026'
from intended i join public.disease_orpha_evidence_staging s
on s.disease_id=i.disease_id and s.orpha_code=i.orpha_code
cross join lateral unnest(s.inheritance_terms) v
where length(trim(v))>0
on conflict do nothing;

with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
insert into public.disease_orpha_onset(disease_id,orpha_code,onset_name,source_release)
select distinct i.disease_id,i.orpha_code,v,'ORPHApacket source 2026'
from intended i join public.disease_orpha_evidence_staging s
on s.disease_id=i.disease_id and s.orpha_code=i.orpha_code
cross join lateral unnest(s.onset_terms) v
where length(trim(v))>0
on conflict do nothing;

with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
update public.disease_mondo_orpha_review_queue q set review_status='approved'
from intended i where q.disease_id=i.disease_id and q.orpha_code=i.orpha_code;

with intended(disease_id,orpha_code) as (values
 ('nando-131-1',363717),
 ('nando-131-2',363722),
 ('nando-17-1',227510),
 ('nando-17-2',98933),
 ('nando-19-10',93473),
 ('nando-19-11',93474),
 ('nando-19-12',93476),
 ('nando-19-22-1',309282),
 ('nando-19-22-2',309288),
 ('nando-19-28-1',75233),
 ('nando-19-33-2',411634),
 ('nando-19-33-3',411641),
 ('nando-19-4-1',79255),
 ('nando-19-6-1',206436),
 ('nando-19-6-3',206448),
 ('nando-19-7-1',309256),
 ('nando-19-7-2',309263),
 ('nando-19-7-3',309271),
 ('nando-20-3',139399),
 ('nando-234-5',93598),
 ('nando-275-1',1860),
 ('nando-275-2',93274),
 ('nando-300-4',79078),
 ('nando-300-5',449395)
)
update public.disease_orpha_evidence_staging s set review_status='reviewed'
from intended i where s.disease_id=i.disease_id and s.orpha_code=i.orpha_code;

do $$
declare n integer;
begin
 select count(*) into n from public.disease_orpha_mappings;
 if n<>144 then raise exception 'Expected 144 source crosswalks, got %',n;end if;
 if (select count(*) from public.disease_mondo_orpha_review_queue where review_status='approved')<>24 then
  raise exception 'Source subtype review status count not 24';
 end if;
end $$;
-- Updates numeric profiles with strictly observed evidence and a null-aware mask.
select public.refresh_disease_numeric_profiles();
