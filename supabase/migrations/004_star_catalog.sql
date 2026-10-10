-- This migration was applied in stages to the connected Supabase project on 2026-10-10.
-- Existing interactions and questions are preserved without deletion.
create table if not exists public.disease_catalog (
 id text primary key,
 name_ja text not null,
 name_en text,
 source_url text,
 aliases text[] not null default '{}',
 prevalence_note text,
 prevalence_region text,
 prevalence_year integer,
 treatment_note text,
 source_reviewed_at date,
 medical_review_status text not null default 'pending',
 published boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.star_entries (
 id uuid primary key default gen_random_uuid(),
 device_hash text not null,
 entry_day date not null,
 disease_id text not null references public.disease_catalog(id),
 kind text not null check(kind in ('share','discover')),
 comment_text text,
 comment_approved boolean not null default false,
 created_at timestamptz not null default now(),
 unique(device_hash,entry_day)
);
alter table public.disease_catalog enable row level security;
alter table public.star_entries enable row level security;
revoke all on table public.disease_catalog from anon,authenticated;
revoke all on table public.star_entries from anon,authenticated;
grant select on table public.disease_catalog to anon;
create policy "Public names can be read" on public.disease_catalog for select to anon using (published);
insert into public.disease_catalog(id,name_ja,name_en,source_url,published,medical_review_status)
values
('als','筋萎縮性側索硬化症（ALS）','Amyotrophic lateral sclerosis','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('sma','脊髄性筋萎縮症（SMA）','Spinal muscular atrophy','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('duchenne-muscular-dystrophy','デュシェンヌ型筋ジストロフィー','Duchenne muscular dystrophy','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('huntington-disease','ハンチントン病','Huntington disease','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('fabry-disease','ファブリー病','Fabry disease','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('gaucher-disease','ゴーシェ病','Gaucher disease','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('pompe-disease','ポンペ病','Pompe disease','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('wilson-disease','ウィルソン病','Wilson disease','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('hereditary-attr-amyloidosis','遺伝性ATTRアミロイドーシス','Hereditary transthyretin amyloidosis','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('pulmonary-arterial-hypertension','肺動脈性肺高血圧症','Pulmonary arterial hypertension','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('systemic-sclerosis','全身性強皮症','Systemic sclerosis','https://www.nanbyou.or.jp/',true,'name-only-unreviewed'),
('primary-biliary-cholangitis','原発性胆汁性胆管炎','Primary biliary cholangitis','https://www.nanbyou.or.jp/',true,'name-only-unreviewed')
on conflict(id) do nothing;
