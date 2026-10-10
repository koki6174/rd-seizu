-- MONDO 2026-10-06 cross-source evidence for 70 NANDO-Orphanet candidates.
-- MONDO hasDbXref (NANDO) is NOT ontology equivalence.
-- Requires: three-way preferred-name equality, MONDO skos:exactMatch ORPHA,
-- unique ORPHAcode and legacy NANDO disease name.
-- This is source-backed RESEARCH identity only, not clinical sign-off.
create table if not exists public.disease_orpha_mondo_evidence (
 disease_id text primary key references public.disease_catalog(id),
 orpha_code integer not null unique check(orpha_code>0),
 mondo_id text not null check(mondo_id ~ '^MONDO:[0-9]+$'),
 modern_nando_ids text[] not null,
 canonical_english text not null,
 source_sha text not null default '9bfccbe9217cdfa6a225058bfa6e4bd55512b432',
 mapping_status text not null default 'source_triangulated_not_clinician_verified',
 checked_at timestamptz not null default now()
);
alter table public.disease_orpha_mondo_evidence enable row level security;
revoke all on public.disease_orpha_mondo_evidence from anon,authenticated;

insert into public.disease_orpha_mondo_evidence
(disease_id,orpha_code,mondo_id,modern_nando_ids,canonical_english)
values
('nando-127-2',100069,'MONDO:0010857',array['NANDO:1200550'],'Semantic dementia'),
('nando-139-5',59,'MONDO:0010354',array['NANDO:1200580','NANDO:2201292'],'Allan-Herndon-Dudley syndrome'),
('nando-14-2',641,'MONDO:0018979',array['NANDO:1200031'],'Multifocal motor neuropathy'),
('nando-156-2',3095,'MONDO:0017746',array['NANDO:1200605'],'Atypical Rett syndrome'),
('nando-160-1-1',312,'MONDO:0020702',array['NANDO:1200611','NANDO:2200988'],'Autosomal dominant epidermolytic ichthyosis'),
('nando-160-1-3',455,'MONDO:0007813',array['NANDO:1200613','NANDO:2200990'],'Superficial epidermolytic ichthyosis'),
('nando-160-3-2',313,'MONDO:0017778',array['NANDO:1200617'],'Lamellar ichthyosis'),
('nando-160-4-9',33364,'MONDO:0018053',array['NANDO:1200627'],'Trichothiodystrophy'),
('nando-162-1',703,'MONDO:0019082',array['NANDO:1200632','NANDO:1200633'],'bullous pemphigoid'),
('nando-162-2',46486,'MONDO:0018746',array['NANDO:1200634'],'mucous membrane pemphigoid'),
('nando-164-1',79430,'MONDO:0019312',array['NANDO:1200638'],'Hermansky-Pudlak syndrome'),
('nando-164-3',381,'MONDO:0018306',array['NANDO:1200640'],'Griscelli syndrome'),
('nando-18-2-4',217012,'MONDO:0007296',array['NANDO:1200044'],'spinocerebellar ataxia type 31'),
('nando-18-2-6',98756,'MONDO:0008458',array['NANDO:1200046'],'spinocerebellar ataxia type 2'),
('nando-18-2-8',276198,'MONDO:0013594',array['NANDO:1200048'],'spinocerebellar ataxia type 36'),
('nando-19-19-1',812,'MONDO:0019346',array['NANDO:1200117','NANDO:2201191'],'Sialidosis type 1'),
('nando-19-19-2',87876,'MONDO:0009738',array['NANDO:1200118','NANDO:1200120','NANDO:2201192','NANDO:2201193'],'Sialidosis type 2'),
('nando-19-20',351,'MONDO:0009737',array['NANDO:1200119','NANDO:2200557'],'Galactosialidosis'),
('nando-19-21-1',576,'MONDO:0009650',array['NANDO:1200124','NANDO:2200567'],'Mucolipidosis Type II'),
('nando-19-22',61,'MONDO:0009561',array['NANDO:1200126'],'Alpha-mannosidosis'),
('nando-19-23',118,'MONDO:0009562',array['NANDO:1200129','NANDO:2201190'],'Beta-mannosidosis'),
('nando-19-24',349,'MONDO:0009254',array['NANDO:1200130','NANDO:2200553'],'Fucosidosis'),
('nando-19-25',93,'MONDO:0008830',array['NANDO:1200133','NANDO:2200555'],'Aspartylglucosaminuria'),
('nando-19-29',34587,'MONDO:0010281',array['NANDO:1200145','NANDO:1200222'],'Danon disease'),
('nando-19-3',646,'MONDO:0018982',array['NANDO:1200063'],'Niemann-Pick disease Type C'),
('nando-19-30',834,'MONDO:0019366',array['NANDO:1200146','NANDO:2200572'],'Free sialic acid storage disease'),
('nando-19-33',213,'MONDO:0016239',array['NANDO:1200161','NANDO:2200571'],'Cystinosis'),
('nando-19-4',354,'MONDO:0018149',array['NANDO:1200066','NANDO:2200558'],'GM1 Gangliosidosis'),
('nando-19-5-2',796,'MONDO:0010006',array['NANDO:1200072','NANDO:2201200'],'Sandhoff disease'),
('nando-19-6',487,'MONDO:0009499',array['NANDO:1200074','NANDO:2200564'],'Krabbe disease'),
('nando-19-7',512,'MONDO:0018868',array['NANDO:1200078','NANDO:2200560'],'Metachromatic leukodystrophy'),
('nando-21-2',506,'MONDO:0009723',array['NANDO:1200175','NANDO:2200527'],'Leigh syndrome'),
('nando-21-5',104,'MONDO:0010788',array['NANDO:1200178','NANDO:1200940'],'Leber hereditary optic neuropathy'),
('nando-229-1',747,'MONDO:0012579',array['NANDO:1200747','NANDO:1200748'],'Autoimmune pulmonary alveolar proteinosis'),
('nando-23-1',204,'MONDO:0016079',array['NANDO:1200187'],'Sporadic Creutzfeldt-Jakob disease'),
('nando-23-2-2',356,'MONDO:0007656',array['NANDO:1200190'],'Gerstmann-Straussler-Scheinker syndrome'),
('nando-23-2-3',466,'MONDO:0010808',array['NANDO:1200191'],'fatal familial insomnia'),
('nando-251-4',23,'MONDO:0008815',array['NANDO:1200806','NANDO:2200481'],'Argininosuccinic aciduria'),
('nando-255-1',79242,'MONDO:0009666',array['NANDO:1200821'],'Holocarboxylase synthetase deficiency'),
('nando-255-2',79241,'MONDO:0009665',array['NANDO:1200822'],'Biotinidase deficiency'),
('nando-265-2',79086,'MONDO:0019193',array['NANDO:1200860'],'Acquired generalized lipodystrophy'),
('nando-28-1-1',85443,'MONDO:0019438',array['NANDO:1200211'],'AL amyloidosis'),
('nando-301-2',827,'MONDO:0019353',array['NANDO:1200933'],'Stargardt disease'),
('nando-301-6',75377,'MONDO:0008982',array['NANDO:1200939'],'Central areolar choroidal dystrophy'),
('nando-308-1',2478,'MONDO:0011391',array['NANDO:1200950','NANDO:2200837'],'Megalencephalic leukoencephalopathy with subcortical cysts'),
('nando-316-2',157,'MONDO:0015515',array['NANDO:1200971','NANDO:2200510','NANDO:2201133','NANDO:2201134'],'Carnitine Palmitoyltransferase II deficiency'),
('nando-316-3',159,'MONDO:0008918',array['NANDO:1200972','NANDO:2200511'],'Carnitine-acylcarnitine translocase deficiency'),
('nando-35-2',79481,'MONDO:0019324',array['NANDO:1200230'],'pemphigus foliaceus'),
('nando-35-3',63455,'MONDO:0018974',array['NANDO:1200231'],'Paraneoplastic pemphigus'),
('nando-35-4',79479,'MONDO:0019322',array['NANDO:1200232'],'pemphigus vegetans'),
('nando-35-5',79480,'MONDO:0019323',array['NANDO:1200233'],'Pemphigus erythematosus'),
('nando-48-3',464343,'MONDO:0018737',array['NANDO:1200270'],'Catastrophic antiphospholipid syndrome'),
('nando-50-1',221,'MONDO:0016367',array['NANDO:1200274'],'Dermatomyositis'),
('nando-50-3',732,'MONDO:0019127',array['NANDO:1200276'],'Polymyositis'),
('nando-60-1',88,'MONDO:0012197',array['NANDO:1200296','NANDO:2201276'],'Idiopathic aplastic anemia'),
('nando-65-13',125,'MONDO:0008876',array['NANDO:1200333','NANDO:2200707'],'Bloom syndrome'),
('nando-65-18',634,'MONDO:0009735',array['NANDO:1200338','NANDO:1200619','NANDO:2200993'],'Netherton syndrome'),
('nando-65-2',33355,'MONDO:0009973',array['NANDO:1200322','NANDO:2200695'],'Reticular dysgenesis'),
('nando-65-32',3261,'MONDO:0017979',array['NANDO:1200352','NANDO:2200726'],'Autoimmune lymphoproliferative syndrome'),
('nando-65-34',2686,'MONDO:0008090',array['NANDO:1200354','NANDO:2200746'],'Cyclic neutropenia'),
('nando-65-35',2968,'MONDO:0017570',array['NANDO:1200355','NANDO:2200755'],'Leukocyte adhesion deficiency'),
('nando-65-36',811,'MONDO:0009833',array['NANDO:1200356','NANDO:2200756'],'Shwachman-Diamond syndrome'),
('nando-65-37',379,'MONDO:0018305',array['NANDO:1200357','NANDO:2200757'],'Chronic granulomatous disease'),
('nando-65-4',39041,'MONDO:0011338',array['NANDO:1200324','NANDO:2200697'],'Omenn syndrome'),
('nando-65-5',760,'MONDO:0013171',array['NANDO:1200325','NANDO:2200698'],'Purine nucleoside phosphorylase deficiency'),
('nando-67-1',730,'MONDO:0004691',array['NANDO:1200368','NANDO:2200153'],'Autosomal Dominant Polycystic Kidney Disease'),
('nando-67-2',731,'MONDO:0009889',array['NANDO:1200369','NANDO:2200154'],'Autosomal Recessive Polycystic Kidney Disease'),
('nando-98-3',2070,'MONDO:0016129',array['NANDO:1200457'],'Eosinophilic gastroenteritis'),
('systemic-sclerosis',90291,'MONDO:0005100',array['NANDO:1200277','NANDO:2200429'],'Systemic sclerosis'),
('wilson-disease',905,'MONDO:0010200',array['NANDO:1200655','NANDO:2200579'],'Wilson disease')
on conflict(disease_id) do nothing;

do $$
declare matched integer;
begin
 select count(*) into matched
 from public.disease_orpha_mondo_evidence e
 join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
 join public.disease_catalog d on d.id=e.disease_id
 where regexp_replace(lower(d.name_en),'[[:space:]]+','','g')=regexp_replace(lower(s.orpha_label),'[[:space:]]+','','g')
 and regexp_replace(lower(e.canonical_english),'[[:space:]]+','','g')=regexp_replace(lower(s.orpha_label),'[[:space:]]+','','g');
 if matched<>70 then raise exception 'Only %/70 corroborated candidate identities matched', matched; end if;
 if exists(select 1 from public.disease_orpha_mondo_evidence e
 join public.disease_orpha_mappings m on m.orpha_code=e.orpha_code and m.disease_id<>e.disease_id) then
   raise exception 'Potential ORPHA collision against established identity';
 end if;
end $$;

insert into public.disease_orpha_mappings
(disease_id,orpha_code,orpha_label,source_synonym,match_method,source_release)
select s.disease_id,s.orpha_code,s.orpha_label,null,'exact_label',
 'MONDO 2026-10-06 and Orphapacket June 2026; source corroborated, not clinician-reviewed'
from public.disease_orpha_mondo_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
on conflict(disease_id) do nothing;

do $$
declare mapped integer;
begin
 select count(*) into mapped from public.disease_orpha_mondo_evidence e
 join public.disease_orpha_mappings m on m.disease_id=e.disease_id and m.orpha_code=e.orpha_code;
 if mapped<>70 then raise exception 'Only %/70 recorded disease IDs have the same ORPHAcode',mapped;end if;
end $$;

insert into public.disease_external_mappings(source_name,source_id,disease_id,link_type)
select 'ORPHA',e.orpha_code::text,e.disease_id,'source_triangulated_mondo_nando_not_clinician_verified'
from public.disease_orpha_mondo_evidence e
on conflict(source_name,source_id) do nothing;

insert into public.disease_hpo_annotations
(disease_id,orpha_code,hpo_id,hpo_label_en,frequency_raw,source_release,evidence_source)
select s.disease_id,s.orpha_code,ph.obj->>'id',ph.obj->>'label',ph.obj->>'frequency',
 'Orphapacket June 2026','MONDO/NANDO/ORPHA triangulated source-only clinical evidence'
from public.disease_orpha_mondo_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
cross join lateral jsonb_array_elements(s.hpo_annotations) ph(obj)
where ph.obj->>'id' ~ '^HP:[0-9]{7}$'
and lower(coalesce(ph.obj->>'frequency','')) not like '%excluded%'
on conflict(disease_id,hpo_id) do nothing;

insert into public.disease_orpha_genes(disease_id,orpha_code,gene_symbol,association_type,source_release)
select distinct s.disease_id,s.orpha_code,g.obj->>'symbol',g.obj->>'association',
'Orphapacket June 2026'
from public.disease_orpha_mondo_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
cross join lateral jsonb_array_elements(s.gene_associations) g(obj)
where length(coalesce(g.obj->>'symbol',''))>0 and length(coalesce(g.obj->>'association',''))>0
on conflict do nothing;

insert into public.disease_orpha_inheritance(disease_id,orpha_code,inheritance_name,source_release)
select distinct s.disease_id,s.orpha_code,t, 'Orphapacket June 2026'
from public.disease_orpha_mondo_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
cross join lateral unnest(s.inheritance_terms) t
where length(trim(t))>0
on conflict do nothing;

insert into public.disease_orpha_onset(disease_id,orpha_code,onset_name,source_release)
select distinct s.disease_id,s.orpha_code,t, 'Orphapacket June 2026'
from public.disease_orpha_mondo_evidence e
join public.disease_orpha_evidence_staging s on s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
cross join lateral unnest(s.onset_terms) t
where length(trim(t))>0
on conflict do nothing;

-- Staged evidence is only marked reviewed when EXACT same local and ORPHA IDs match.
update public.disease_orpha_evidence_staging s
set review_status='reviewed'
from public.disease_orpha_mondo_evidence e
where s.disease_id=e.disease_id and s.orpha_code=e.orpha_code
 and s.review_status='unreviewed';
