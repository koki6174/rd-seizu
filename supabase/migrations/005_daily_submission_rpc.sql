-- Public RPCs: no raw device IDs or unapproved comments are returned.
-- One entry per random browser token per Japan-local calendar day.
create or replace function public.daily_star_status(p_device_token text)
returns boolean language plpgsql stable security definer set search_path=''
as $$
begin
 if p_device_token is null or p_device_token !~* '^[0-9a-f-]{36}$' then return false; end if;
 return exists(select 1 from public.star_entries
   where device_hash=md5(p_device_token)
   and entry_day=(now() at time zone 'Asia/Tokyo')::date);
end
$$;
revoke execute on function public.daily_star_status(text) from public,anon,authenticated;
grant execute on function public.daily_star_status(text) to anon;

create or replace function public.submit_star(
 p_device_token text, p_disease_id text, p_kind text, p_comment text default null)
returns jsonb language plpgsql volatile security definer set search_path=''
as $$
declare v_new_id uuid;
declare v_comment text := nullif(btrim(coalesce(p_comment,'')),'');
begin
 if p_device_token is null or p_device_token !~* '^[0-9a-f-]{36}$'
   then return jsonb_build_object('ok',false,'reason','invalid_device'); end if;
 if p_kind is null or p_kind not in ('share','discover')
   then return jsonb_build_object('ok',false,'reason','invalid_kind'); end if;
 if v_comment is not null and (char_length(v_comment)>140 or
   position('http' in lower(v_comment))>0 or position('@' in v_comment)>0)
   then return jsonb_build_object('ok',false,'reason','invalid_comment'); end if;
 if not exists(select 1 from public.disease_catalog where id=p_disease_id and published)
   then return jsonb_build_object('ok',false,'reason','invalid_disease'); end if;
 insert into public.star_entries(device_hash,entry_day,disease_id,kind,comment_text)
 values(md5(p_device_token),(now() at time zone 'Asia/Tokyo')::date,p_disease_id,p_kind,v_comment)
 on conflict(device_hash,entry_day) do nothing returning id into v_new_id;
 if v_new_id is null
   then return jsonb_build_object('ok',false,'reason','already_submitted'); end if;
 return jsonb_build_object('ok',true,'day',(now() at time zone 'Asia/Tokyo')::date);
end
$$;
revoke execute on function public.submit_star(text,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_star(text,text,text,text) to anon;

create or replace function public.get_public_stars()
returns jsonb language sql stable security definer set search_path=''
as $$
 select coalesce(jsonb_agg(jsonb_build_object(
  'id',d.id,'name',d.name_ja,'nameEn',d.name_en,
  'total',coalesce(s.total,0),'shared',coalesce(s.shared,0),
  'discovered',coalesce(s.discovered,0),
  'comments',coalesce((
    select jsonb_agg(jsonb_build_object('text',x.comment_text))
    from (
      select e.comment_text from public.star_entries e
      where e.disease_id=d.id and e.comment_approved=true and e.comment_text is not null
      order by e.created_at desc limit 5
    ) x), '[]'::jsonb))
 order by d.name_ja), '[]'::jsonb)
 from public.disease_catalog d
 left join (
  select disease_id, count(*) as total,
   count(*) filter(where kind='share') as shared,
   count(*) filter(where kind='discover') as discovered
  from public.star_entries group by disease_id
 ) s on s.disease_id=d.id
 where d.published
$$;
revoke execute on function public.get_public_stars() from public,anon,authenticated;
grant execute on function public.get_public_stars() to anon;
