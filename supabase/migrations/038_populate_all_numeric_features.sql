-- Rebuild all 1,241 catalog concept feature rows whenever sourced facts are updated.
-- The 34 numeric taxonomy entries are source-backed categorical observations.
-- HPO, gene, inheritance, and onset features are NULL when unknown, NEVER
-- assumed negative or absent due to source incompleteness.
create or replace function public.refresh_disease_numeric_profiles()
returns integer
language plpgsql
security definer
set search_path=''
as $fn$
declare updated_count integer;
begin
with recursive
 pediatric_names(group_name,idx,mapped_group) as (values
  ('悪性新生物',1,16),
  ('慢性腎疾患',2,7),
  ('慢性呼吸器疾患',3,10),
  ('慢性心疾患',4,5),
  ('内分泌疾患',5,9),
  ('膠原病',6,3),
  ('糖尿病',7,9),
  ('先天性代謝異常',8,2),
  ('血液疾患',9,6),
  ('免疫疾患',10,4),
  ('神経・筋疾患',11,1),
  ('慢性消化器疾患',12,13),
  ('染色体又は遺伝子に変化を伴う症候群',13,14),
  ('皮膚疾患群',14,3),
  ('骨系統疾患',15,8),
  ('脈管系疾患',16,5)
 ),
 ancestors(disease_id,parent_id,depth) as (
  select id,parent_disease_id,0 from public.disease_catalog
  union all
  select a.disease_id,p.parent_disease_id,a.depth+1
  from ancestors a
  join public.disease_catalog p on p.id=a.parent_id
  where a.depth<10
 ),
 depths as (
  select disease_id,max(depth)::smallint as parent_depth
  from ancestors group by disease_id
 ),
 children as (
  select parent_disease_id,count(*)::integer as n_children
  from public.disease_catalog
  where parent_disease_id is not null group by parent_disease_id
 ),
 hpo as (
  select disease_id,
   jsonb_object_agg(hpo_id,weight order by hpo_id) as sparse,
   count(*)::integer as n
  from (
   select a.disease_id,a.hpo_id,
     (case
       when lower(coalesce(a.frequency_raw,'')) like '%excluded%' then null
       when lower(coalesce(a.frequency_raw,'')) like '%obligate%' then 1.0
       when lower(coalesce(a.frequency_raw,'')) like '%very frequent%' then .90
       when lower(coalesce(a.frequency_raw,'')) like '%frequent%' then .60
       when lower(coalesce(a.frequency_raw,'')) like '%occasional%' then .25
       when lower(coalesce(a.frequency_raw,'')) like '%very rare%' then .07
       else .35 end)::real as weight
   from public.disease_hpo_annotations a
   where a.hpo_id ~ '^HP:[0-9]{7}$'
  ) observed
  where weight is not null
  group by disease_id
 ),
 genes as (
  select disease_id,jsonb_object_agg(gene_symbol,1 order by gene_symbol) as sparse,
         count(*)::integer as n
  from (
   select distinct disease_id,gene_symbol
   from public.disease_orpha_genes
   where lower(association_type) like '%disease-causing%'
   and gene_symbol is not null and length(trim(gene_symbol))>0
  ) causal
  group by disease_id
 ),
 inheritance as (
   select disease_id,jsonb_object_agg(inheritance_name,1 order by inheritance_name) sparse,
          count(*)::integer n
   from (
     select distinct disease_id,inheritance_name
     from public.disease_orpha_inheritance
     where inheritance_name is not null and length(trim(inheritance_name))>0
   ) z group by disease_id
 ),
 onset as (
   select disease_id,jsonb_object_agg(onset_name,1 order by onset_name) sparse,
          count(*)::integer n
   from (
     select distinct disease_id,onset_name
     from public.disease_orpha_onset
     where onset_name is not null and length(trim(onset_name))>0
   ) z group by disease_id
 ),
 features as (
  select d.id as disease_id,
    coalesce(f.nando_class_id::integer,pn.mapped_group,17) as gcode,
    pn.idx as pediatric_index,
    d.concept_kind='disease_subtype' as subtype,
    coalesce(de.parent_depth,0) as hierarchy_depth,
    coalesce(ch.n_children,0) as nchildren,
    (f.nando_class_id is not null or f.pediatric_group is not null) as has_source_class,
    (case when f.nando_class_id is not null then f.class_source_url
          when f.pediatric_group is not null then f.class_source_url
          else null end) as source_url,
    m.orpha_code,
    (case when me.disease_id is not null then 'mondo_triangulated'
          when pe.disease_id is not null then 'parent_corroborated'
          when m.disease_id is not null then 'prior_corroborated'
          else 'none' end) as clinical_identity,
    h.sparse as hpo_sparse,h.n as n_hpo,
    ge.sparse as genes_sparse,ge.n as n_genes,
    inh.sparse as inheritance_sparse,inh.n as n_inheritance,
    ons.sparse as onset_sparse,ons.n as n_onset
  from public.disease_catalog d
  left join public.disease_feature_profiles f on f.disease_id=d.id
  left join pediatric_names pn on pn.group_name=f.pediatric_group
  left join depths de on de.disease_id=d.id
  left join children ch on ch.parent_disease_id=d.id
  left join public.disease_orpha_mappings m on m.disease_id=d.id
  left join public.disease_orpha_review_evidence pe on pe.disease_id=d.id
  left join public.disease_orpha_mondo_evidence me on me.disease_id=d.id
  left join hpo h on h.disease_id=d.id
  left join genes ge on ge.disease_id=d.id
  left join inheritance inh on inh.disease_id=d.id
  left join onset ons on ons.disease_id=d.id
 )
 insert into public.disease_numeric_feature_profiles
 (disease_id,taxonomy_vector,taxonomy_group_code,taxonomy_evidence_source,
 taxonomy_parent_depth,n_children,is_subtype,has_source_class,orpha_code,
 medical_identity_evidence,hpo_sparse_weights,causal_gene_sparse,
 inheritance_observed,onset_observed,hpo_term_count,causal_gene_count,
 inheritance_term_count,onset_term_count,observed_mask,feature_version,updated_at)
 select x.disease_id,
  array(select (
   case when ix between 1 and 17 then (case when ix=x.gcode then 2.0 else 0.0 end)
        when ix between 18 and 33 then (case when ix-17=x.pediatric_index then .45 else 0.0 end)
        when ix=34 then (case when x.subtype then .4 else 0.0 end)
   end)::real
   from generate_series(1,34) ix order by ix),
  x.gcode,x.source_url,x.hierarchy_depth,x.nchildren,
  case when x.subtype then 1 else 0 end,
  x.has_source_class,x.orpha_code,x.clinical_identity,
  x.hpo_sparse,x.genes_sparse,x.inheritance_sparse,x.onset_sparse,
  x.n_hpo,x.n_genes,x.n_inheritance,x.n_onset,
  jsonb_build_object(
   'taxonomy_class_observed',x.has_source_class,
   'hpo_annotation_observed',x.n_hpo is not null,
   'causal_gene_annotated',x.n_genes is not null,
   'inheritance_annotated',x.n_inheritance is not null,
   'onset_annotated',x.n_onset is not null,
   'clinical_identity_corroborated',x.orpha_code is not null),
  'all-concepts-taxonomy34-clinical-sparse-v1',now()
 from features x
 on conflict(disease_id) do update set
 taxonomy_vector=excluded.taxonomy_vector,
 taxonomy_group_code=excluded.taxonomy_group_code,
 taxonomy_evidence_source=excluded.taxonomy_evidence_source,
 taxonomy_parent_depth=excluded.taxonomy_parent_depth,
 n_children=excluded.n_children,
 is_subtype=excluded.is_subtype,
 has_source_class=excluded.has_source_class,
 orpha_code=excluded.orpha_code,
 medical_identity_evidence=excluded.medical_identity_evidence,
 hpo_sparse_weights=excluded.hpo_sparse_weights,
 causal_gene_sparse=excluded.causal_gene_sparse,
 inheritance_observed=excluded.inheritance_observed,
 onset_observed=excluded.onset_observed,
 hpo_term_count=excluded.hpo_term_count,
 causal_gene_count=excluded.causal_gene_count,
 inheritance_term_count=excluded.inheritance_term_count,
 onset_term_count=excluded.onset_term_count,
 observed_mask=excluded.observed_mask,
 feature_version=excluded.feature_version,
 updated_at=excluded.updated_at;
get diagnostics updated_count=row_count;
if (select count(*) from public.disease_numeric_feature_profiles) <>
   (select count(*) from public.disease_catalog) then
  raise exception 'Numeric features missing disease catalog rows';
end if;
return updated_count;
end $fn$;
revoke all on function public.refresh_disease_numeric_profiles() from public,anon,authenticated;
select public.refresh_disease_numeric_profiles();
