-- Clinical research 3D API must never be callable using a public/anon key.
-- Owner access is provisioned via authenticated Supabase user ID after onboarding.
-- At initial migration no user has been authorized: deny by default.
create table if not exists public.clinical_research_viewers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enrolled_at timestamptz not null default now()
);
alter table public.clinical_research_viewers enable row level security;
revoke all on table public.clinical_research_viewers from public,anon,authenticated;

-- Retire the previously exposed research-only RPC.
revoke all on function public.get_clinical_pilot_positions()
  from public,anon,authenticated;
-- Supabase may maintain custom grants on the old RPC. Explicitly keep it
-- inaccessible through the public API; service_role is not needed by browser.
create or replace function public.get_private_clinical_positions()
returns jsonb
language plpgsql stable security definer
set search_path=''
as $fn$
declare output jsonb;
begin
 if (select auth.uid()) is null or not exists (
   select 1 from public.clinical_research_viewers v where v.user_id=(select auth.uid())
 ) then
   raise exception 'Access denied: private research preview'
     using errcode='42501';
 end if;
 select coalesce(jsonb_agg(jsonb_build_object(
   'id', p.disease_id,'x',p.x,'y',p.y,'z',p.z,
   'membership',p.membership,'cluster',p.fcm_cluster,
   'nHpo',p.annotated_hpo,'nGene',p.annotated_causal_genes
 ) order by p.disease_id),'[]'::jsonb)
 into output
 from public.disease_clinical_embedding_pilot p
 join public.disease_catalog d on d.id=p.disease_id
 where d.published;
 return output;
end
$fn$;
revoke all on function public.get_private_clinical_positions()
 from public,anon,authenticated;
grant execute on function public.get_private_clinical_positions()
 to authenticated;

comment on function public.get_private_clinical_positions() is
 'Viewer whitelist required. A public git repository and prior snapshot files are NOT protected by this function; restrict repo/files separately if needed.';
