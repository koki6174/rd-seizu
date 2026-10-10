-- NANDO source-term identity and disease subtype hierarchy.
-- Do not rename existing IDs or delete any participation logs.
alter table public.disease_catalog
 add column if not exists parent_disease_id text references public.disease_catalog(id);

create table if not exists public.disease_external_mappings(
 source_name text not null,
 source_id text not null,
 disease_id text not null references public.disease_catalog(id),
 link_type text not null default 'exact_name',
 created_at timestamptz not null default now(),
 primary key(source_name,source_id)
);
alter table public.disease_external_mappings enable row level security;
revoke all on table public.disease_external_mappings from anon,authenticated;
create index if not exists disease_external_mappings_disease_id_idx
 on public.disease_external_mappings(disease_id);

-- Fix apparent English translation inconsistencies in NANDO source,
-- after cross-checking the clinically distinct Japanese labels.
update public.disease_catalog
set name_en='autosomal recessive spinocerebellar degeneration',
    aliases=array_remove(aliases,'autosomal dominant spinocerebellar degeneration')
where id='nando-18-3' and name_ja='常染色体劣性遺伝性脊髄小脳変性症';

update public.disease_catalog
set name_en='type I biliary atresia',
    aliases=array_remove(aliases,'type II biliary atresia')
where id='nando-296-1' and name_ja='Ⅰ型胆道閉鎖症';
