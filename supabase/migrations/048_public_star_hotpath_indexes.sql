-- Keep public 1,241-disease constellation RPC efficient as legitimate
-- interactions grow. These indexes do not grant read/write permissions.
-- The approved-comment partial index supports get_public_stars()'s
-- per-disease 5 most recent publicly moderated comments.
create index if not exists star_entries_public_comments_by_disease_idx
 on public.star_entries(disease_id,created_at desc)
 where comment_approved = true and comment_text is not null;

-- The public aggregated counters and historical week snapshots use these
-- lookup paths, without directly granting access to individual records.
create index if not exists star_entries_disease_id_idx
 on public.star_entries(disease_id);
create index if not exists star_entries_created_at_idx
 on public.star_entries(created_at);

-- Child-disease hierarchy is used when building public star metadata.
create index if not exists disease_catalog_parent_disease_idx
 on public.disease_catalog(parent_disease_id)
 where parent_disease_id is not null;

do $$
begin
 if has_table_privilege('anon','public.star_entries','SELECT') then
   raise exception 'Index creation must not expose private submission rows';
 end if;
end $$;
