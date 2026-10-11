-- Security review 2026-10-11.
-- Retire legacy public table access after migration to moderated RPC-only writes.
-- All existing rows are retained: cumulative weekly reports still use them.
-- No new publicly writable tables are added.

-- The retired weekly statistics routine historically used invoker privileges
-- to read interactions. Preserve its read-only aggregate API while closing
-- direct access to per-row events.
alter function public.get_weekly_constellation(date) security definer;
alter function public.get_weekly_constellation(date) set search_path = '';

-- These old public permissions allowed arbitrary per-row historical count
-- manipulation and disclosure of the legacy question text. The current
-- visitor app uses submit_star / suggest_missing_disease RPCs instead.
revoke all on table public.interactions from anon, authenticated, public;
revoke all on table public.questions from anon, authenticated, public;

drop policy if exists "public can read interaction counts source" on public.interactions;
drop policy if exists "public can submit interactions" on public.interactions;
drop policy if exists "public can submit questions" on public.questions;

-- Research prototypes are not supposed to be queryable anonymously.
-- The only allowed live clinical API is the authenticated, whitelist-checked
-- get_private_clinical_positions() introduced in 044.
revoke all on function public.get_provisional_hpo_positions()
 from public, anon, authenticated;
revoke all on function public.get_clinical_pilot_positions()
 from public, anon, authenticated;

-- Event-trigger helper must not be exposed as an application RPC.
revoke all on function public.rls_auto_enable()
 from public, anon, authenticated;

-- Default grants for functions created by either project migration owner:
-- explicit GRANT EXECUTE will be needed for any new public-facing RPC.
alter default privileges for role postgres in schema public
 revoke execute on functions from public, anon, authenticated;
-- Database migration role cannot modify supabase_admin's default grants.
-- Apply the equivalent separately using a supabase_admin-authorized session
-- if future migrations create RPCs under that role. Current functions are
-- explicitly audited and protected by the revokes above.

-- Assert that all essential visitor RPCs remain executable without a login.
do $$
declare rp text;
begin
 foreach rp in array array[
  'public.get_public_stars()',
  'public.get_constellation_positions()',
  'public.pick_discovery_disease(text)',
  'public.daily_star_status(text)',
  'public.submit_star(text,text,text,text)',
  'public.suggest_missing_disease(text,text)',
  'public.get_cumulative_constellation(date)',
  'public.get_weekly_constellation_stars(date)',
  'public.get_weekly_constellation(date)'
 ] loop
  if not has_function_privilege('anon', rp, 'EXECUTE') then
   raise exception 'Required visitor RPC lost during hardening: %',rp;
  end if;
 end loop;

 if has_table_privilege('anon','public.interactions','SELECT')
    or has_table_privilege('anon','public.interactions','INSERT')
    or has_table_privilege('anon','public.questions','INSERT')
    or has_function_privilege('anon','public.get_provisional_hpo_positions()','EXECUTE')
    or has_function_privilege('anon','public.get_clinical_pilot_positions()','EXECUTE')
 then
  raise exception 'Legacy public grants remain open';
 end if;
end $$;
