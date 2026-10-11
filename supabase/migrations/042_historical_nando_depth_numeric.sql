-- Structural, explicitly source-derived depth for historical NANDO subtype IDs.
-- This expresses NANDO path specificity, not phenotype severity or inheritance.
alter table public.disease_numeric_feature_profiles
add column if not exists nando_id_subtype_depth smallint
generated always as (
  case when disease_id like 'nando-%'
       then greatest(array_length(string_to_array(substring(disease_id from 7),'-'),1)-1,0)::smallint
       else 0::smallint end
) stored;
comment on column public.disease_numeric_feature_profiles.nando_id_subtype_depth is
 'Number of subtype steps encoded in historical NANDO ID; taxonomy structural depth, not disease severity.';
