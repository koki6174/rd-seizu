-- Keep all published disease names searchable without exposing internal selection metadata.
-- Preserve aggregated anonymous comments and event counts only.
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
 order by d.name_ja),'[]'::jsonb)
 from public.disease_catalog d
 left join (
  select disease_id,count(*) as total,
   count(*) filter(where kind='share') as shared,
   count(*) filter(where kind='discover') as discovered
  from public.star_entries group by disease_id
 ) s on s.disease_id=d.id
 where d.published
$$;
revoke execute on function public.get_public_stars() from public,anon,authenticated;
grant execute on function public.get_public_stars() to anon;
