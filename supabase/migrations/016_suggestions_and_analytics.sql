-- Suggestions are private pending editorial verification.
create table if not exists public.disease_suggestions (
 id uuid primary key default gen_random_uuid(),
 suggested_name text not null check(char_length(suggested_name) between 2 and 80),
 device_hash text not null, request_day date not null,
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 reviewed_disease_id text references public.disease_catalog(id),
 created_at timestamptz not null default now(), reviewed_at timestamptz,
 unique(device_hash,request_day)
);
create index if not exists disease_suggestions_status_created_idx on public.disease_suggestions(status,created_at);
alter table public.disease_suggestions enable row level security;
revoke all on table public.disease_suggestions from anon,authenticated;
create or replace function public.suggest_missing_disease(p_device_token text,p_name text)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_name text := pg_catalog.btrim(coalesce(p_name,''));
declare v_id uuid;
begin
 if p_device_token is null or p_device_token !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
 then return jsonb_build_object('ok',false,'reason','invalid_device'); end if;
 if char_length(v_name)<2 or char_length(v_name)>80 or v_name ~ '[[:cntrl:]]'
 or v_name ~* '(https?://|www\\.|@)' or v_name !~ '[[:alpha:]ぁ-んァ-ヶ一-龯々]'
 then return jsonb_build_object('ok',false,'reason','invalid_name'); end if;
 insert into public.disease_suggestions(suggested_name,device_hash,request_day)
 values(v_name,pg_catalog.md5(p_device_token),(now() at time zone 'Asia/Tokyo')::date)
 on conflict(device_hash,request_day) do nothing returning id into v_id;
 if v_id is null then return jsonb_build_object('ok',false,'reason','daily_limit'); end if;
 return jsonb_build_object('ok',true,'status','pending');
end
$$;
revoke all on function public.suggest_missing_disease(text,text) from public,anon,authenticated;
grant execute on function public.suggest_missing_disease(text,text) to anon;

-- Ephemeral session analytics: never store device hashes, disease IDs, search text, comments or IPs.
create table if not exists public.exhibition_analytics (
 id bigint generated always as identity primary key,
 session_id uuid not null,event_type text not null,section text,route text,
 duration_seconds integer check(duration_seconds between 0 and 3600),
 created_at timestamptz not null default now()
);
create index if not exists exhibition_analytics_created_type_idx on public.exhibition_analytics(created_at,event_type);
alter table public.exhibition_analytics enable row level security;
revoke all on table public.exhibition_analytics from anon,authenticated;
create or replace function public.record_exhibition_event(
 p_session_id uuid,p_event_type text,p_section text default null,
 p_duration_seconds integer default null,p_route text default null)
returns boolean language plpgsql volatile security definer set search_path=''
as $$
begin
 if p_session_id is null or
 p_event_type not in ('visit','screen_exit','page_exit','path_share','path_discover',
   'random_draw','disease_select','search_no_result','suggest_open','suggest_sent','submit_success','star_view') or
 (p_section is not null and p_section not in ('home','sky','choose','disease','comment','done','weekly')) or
 (p_route is not null and p_route not in ('share','discover')) or
 (p_duration_seconds is not null and (p_duration_seconds<0 or p_duration_seconds>3600))
 then return false;end if;
 insert into public.exhibition_analytics(session_id,event_type,section,route,duration_seconds)
 values(p_session_id,p_event_type,p_section,p_route,p_duration_seconds);
 return true;
end
$$;
revoke all on function public.record_exhibition_event(uuid,text,text,integer,text) from public,anon,authenticated;
grant execute on function public.record_exhibition_event(uuid,text,text,integer,text) to anon;
comment on table public.exhibition_analytics is
 'Session-scoped aggregate analysis; no device ID, disease names or free text. Purge after 90 days.';
