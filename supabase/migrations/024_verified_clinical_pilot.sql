-- Separate verified HPO research cohort from the original taxonomy map.
create table if not exists public.disease_clinical_embedding_pilot (
 disease_id text primary key references public.disease_catalog(id),
 x numeric not null check(x between -30 and 30),
 y numeric not null check(y between -30 and 30),
 z numeric not null check(z between -30 and 30),
 fcm_cluster integer not null check(fcm_cluster between 1 and 20),
 membership numeric not null check(membership between 0 and 1),
 annotated_hpo integer not null check(annotated_hpo>=0),
 annotated_causal_genes integer not null check(annotated_causal_genes>=0),
 model_version text not null,
 created_at timestamptz default now()
);
alter table public.disease_clinical_embedding_pilot enable row level security;
revoke all on public.disease_clinical_embedding_pilot from anon,authenticated;
create or replace function public.get_clinical_pilot_positions()
returns jsonb language sql stable security definer set search_path=''
as $$
 select coalesce(jsonb_agg(jsonb_build_object(
 'id',p.disease_id,'x',p.x,'y',p.y,'z',p.z,
 'membership',p.membership,'cluster',p.fcm_cluster,
 'nHpo',p.annotated_hpo,'nGene',p.annotated_causal_genes
 ) order by p.disease_id),'[]'::jsonb)
 from public.disease_clinical_embedding_pilot p
 join public.disease_catalog d on d.id=p.disease_id where d.published;
$$;
revoke all on function public.get_clinical_pilot_positions() from public,anon,authenticated;
grant execute on function public.get_clinical_pilot_positions() to anon;
