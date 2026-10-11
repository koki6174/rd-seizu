-- Prelaunch security hardening: bounded anonymous analytics ingestion.
-- The per-session cap is a guard against accidental traffic floods, NOT
-- strong anti-bot protection: unauthenticated clients can rotate session UUIDs.
-- For robust protection, use server-side Turnstile verification and edge rate limits.
create index if not exists exhibition_analytics_session_created_idx
  on public.exhibition_analytics(session_id,created_at desc);

create or replace function public.record_exhibition_event(
  p_session_id uuid,
  p_event_type text,
  p_section text default null,
  p_duration_seconds integer default null,
  p_route text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_now timestamptz := pg_catalog.clock_timestamp();
  v_recent_count integer;
  v_daily_count integer;
begin
  -- This is strictly an allowlisted analytics protocol, not free-form text.
  if p_session_id is null
     or p_event_type is null
     or p_event_type not in (
       'visit','screen_exit','page_exit','path_share','path_discover',
       'random_draw','disease_select','search_no_result','suggest_open',
       'suggest_sent','submit_success','star_view'
     )
     or (p_section is not null and p_section not in
       ('home','sky','choose','disease','comment','done','weekly'))
     or (p_route is not null and p_route not in ('share','discover'))
     or (p_duration_seconds is not null
       and (p_duration_seconds < 0 or p_duration_seconds > 3600))
  then
    return false;
  end if;

  -- Serialize counts only for this session, avoiding races across concurrent
  -- browser requests. The advisory key contains no personal information.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_session_id::text, 471123)
  );
  select count(*)::integer into v_recent_count
  from public.exhibition_analytics
  where session_id=p_session_id and created_at>=v_now-interval '1 minute';

  if v_recent_count>=60 then return false; end if;

  select count(*)::integer into v_daily_count
  from public.exhibition_analytics
  where session_id=p_session_id and created_at>=v_now-interval '24 hours';

  if v_daily_count>=300 then return false; end if;

  insert into public.exhibition_analytics
    (session_id,event_type,section,route,duration_seconds)
  values(p_session_id,p_event_type,p_section,p_route,p_duration_seconds);
  return true;
end;
$fn$;

-- Preserve only the intended browser access after CREATE OR REPLACE.
revoke all on function public.record_exhibition_event(uuid,text,text,integer,text)
 from public,anon,authenticated;
grant execute on function public.record_exhibition_event(uuid,text,text,integer,text)
 to anon;
comment on function public.record_exhibition_event(uuid,text,text,integer,text) is
 'Validated aggregate UX event ingestion; max 60/session/min, 300/session/24h. UUID rotation still bypasses these caps; use a real server-side challenge for public launch.';

do $$
begin
 if not has_function_privilege('anon',
 'public.record_exhibition_event(uuid,text,text,integer,text)','EXECUTE')
 then raise exception 'Visitor analytics RPC inaccessible';end if;
 if has_table_privilege('anon','public.exhibition_analytics','INSERT')
 then raise exception 'Anonymous analytics direct insert must be denied';end if;
end $$;
