-- Five independently checked ORPHA identifiers, verified against
-- Orphanet's disorder-level official disease pages on 2026-10-10.
-- This migration does NOT auto-approve name-matched candidates generally.
with source(disease_id,orpha_code,name_en) as (values
 ('als','803','Amyotrophic lateral sclerosis'),
 ('duchenne-muscular-dystrophy','98896','Duchenne muscular dystrophy'),
 ('fabry-disease','324','Fabry disease'),
 ('gaucher-disease','355','Gaucher disease'),
 ('huntington-disease','399','Huntington disease')
)
insert into public.disease_orpha_match_candidates
 (disease_id,orpha_code,orpha_name_en,match_basis,review_status,source_version)
select disease_id,orpha_code,name_en,
 'verified_external_identifier','approved','Orphadata 2026-07'
from source
on conflict(disease_id,orpha_code) do update set
 review_status='approved',
 match_basis='verified_external_identifier';

insert into public.disease_external_mappings
 (source_name,source_id,disease_id,link_type)
select 'ORPHA',c.orpha_code,c.disease_id,'verified_official_orphanet_page'
from public.disease_orpha_match_candidates c
where c.review_status='approved'
  and (c.disease_id,c.orpha_code) in (
   ('als','803'),('duchenne-muscular-dystrophy','98896'),
   ('fabry-disease','324'),('gaucher-disease','355'),
   ('huntington-disease','399')
  )
on conflict(source_name,source_id) do nothing;
