-- Preset comments can be displayed immediately. Free-written comments
-- remain review-required. Never publish unmoderated sensitive medical text.
create or replace function public.submit_star(
 p_device_token text, p_disease_id text, p_kind text, p_comment text default null)
returns jsonb language plpgsql volatile security definer set search_path = ''
as $$
declare v_new_id uuid;
 v_comment text := nullif(btrim(coalesce(p_comment,'')),'');
 v_preapproved boolean := false;
begin
 if p_device_token is null or
    p_device_token !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
 then return jsonb_build_object('ok',false,'reason','invalid_device'); end if;
 if p_kind is null or p_kind not in ('share','discover')
 then return jsonb_build_object('ok',false,'reason','invalid_kind'); end if;
 if v_comment is not null and (
   char_length(v_comment)>140 or position('http' in lower(v_comment))>0
   or position('@' in v_comment)>0
   or v_comment ~ '0[0-9]{1,3}[-ー ]?[0-9]{2,4}[-ー ]?[0-9]{3,4}'
 )
 then return jsonb_build_object('ok',false,'reason','invalid_comment'); end if;
 if not exists(select 1 from public.disease_catalog d
               where d.id=p_disease_id and d.published)
 then return jsonb_build_object('ok',false,'reason','invalid_disease'); end if;
 v_preapproved := v_comment in (
   'この病気のことをもっと知りたい',
   '少しでも多くの人に知ってほしい',
   '研究や支援が進んでほしい',
   '知るきっかけになりました'
 );
 insert into public.star_entries
 (device_hash,entry_day,disease_id,kind,comment_text,comment_approved)
 values(md5(p_device_token),(now() at time zone 'Asia/Tokyo')::date,
   p_disease_id,p_kind,v_comment,coalesce(v_preapproved,false))
 on conflict(device_hash,entry_day) do nothing
 returning id into v_new_id;
 if v_new_id is null then
   return jsonb_build_object('ok',false,'reason','already_submitted');
 end if;
 return jsonb_build_object('ok',true,
   'day',(now() at time zone 'Asia/Tokyo')::date,
   'comment_public',coalesce(v_preapproved,false),
   'comment_review_pending',v_comment is not null and not coalesce(v_preapproved,false));
end
$$;
revoke execute on function public.submit_star(text,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_star(text,text,text,text) to anon;
