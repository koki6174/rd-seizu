-- Private contact inbox for the public exhibition website.
-- Anonymous visitors can invoke a bounded submission RPC; they cannot read messages.
create table if not exists public.contact_messages (
 id uuid primary key default gen_random_uuid(),
 message text not null check (char_length(message) between 3 and 2000),
 reply_email text check (reply_email is null or char_length(reply_email) between 3 and 254),
 contact_token_hash text not null,
 status text not null default 'new' check (status in ('new','reviewed','closed')),
 created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_idx
 on public.contact_messages (created_at desc);
create index if not exists contact_messages_token_idx
 on public.contact_messages (contact_token_hash,created_at desc);
alter table public.contact_messages enable row level security;
revoke all on table public.contact_messages from public, anon, authenticated;
comment on table public.contact_messages is
 'Private exhibition contact inbox. Read only through project-owner Supabase dashboard; no public SELECT policies.';

create or replace function public.submit_contact(
 p_contact_token uuid,
 p_message text,
 p_email text default null,
 p_website text default null
)
returns jsonb language plpgsql volatile security definer set search_path = ''
as $fn$
declare
 v_message text := pg_catalog.btrim(coalesce(p_message, ''));
 v_email text := nullif(pg_catalog.btrim(coalesce(p_email, '')), '');
 v_hash text;
 v_now timestamptz := pg_catalog.clock_timestamp();
 v_recent integer;
 v_day integer;
begin
 -- Honeypot: populated only by automated form fillers.
 if pg_catalog.length(coalesce(p_website,'')) > 0 then
  return pg_catalog.jsonb_build_object('ok',false,'reason','invalid');
 end if;
 if p_contact_token is null or
    pg_catalog.char_length(v_message) not between 3 and 2000 or
    (v_email is not null and
      (pg_catalog.char_length(v_email) > 254 or
       v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'))
 then
   return pg_catalog.jsonb_build_object('ok',false,'reason','invalid');
 end if;

 v_hash := pg_catalog.md5(p_contact_token::text);
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_hash, 20261012));
 select count(*)::integer into v_recent
 from public.contact_messages
 where contact_token_hash=v_hash and created_at>=v_now-interval '1 minute';
 select count(*)::integer into v_day
 from public.contact_messages
 where contact_token_hash=v_hash and created_at>=v_now-interval '24 hours';
 if v_recent>=1 or v_day>=3 then
   return pg_catalog.jsonb_build_object('ok',false,'reason','rate_limited');
 end if;

 insert into public.contact_messages(message,reply_email,contact_token_hash,created_at)
 values(v_message,v_email,v_hash,v_now);
 return pg_catalog.jsonb_build_object('ok',true);
end
$fn$;

revoke all on function public.submit_contact(uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_contact(uuid,text,text,text) to anon;
comment on function public.submit_contact(uuid,text,text,text) is
 'Bounded public contact ingestion: length validation, honeypot, 1/min and 3/24h per browser token. Rotating tokens bypasses these caps, so monitor abuse and add server-side challenge if needed.';
