-- ねのね「見えない病気の星図」展示用 初期DB
-- Supabase SQL Editorで一度だけ実行してください。

create table public.interactions (
  id uuid primary key default gen_random_uuid(),
  disease_id text not null check (char_length(disease_id) between 1 and 80),
  interest_type text not null check (interest_type in ('first', 'learn', 'known')),
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  disease_id text not null check (char_length(disease_id) between 1 and 80),
  question_text text not null check (char_length(question_text) between 1 and 100),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index interactions_disease_id_idx on public.interactions (disease_id);
create index interactions_created_at_idx on public.interactions (created_at);
create index questions_created_at_idx on public.questions (created_at);

alter table public.interactions enable row level security;
alter table public.questions enable row level security;

revoke all on table public.interactions from anon, authenticated;
revoke all on table public.questions from anon, authenticated;

grant select, insert on table public.interactions to anon;
grant insert on table public.questions to anon;

create policy "public can read interaction counts source"
on public.interactions
for select
to anon
using (true);

create policy "public can submit interactions"
on public.interactions
for insert
to anon
with check (true);

create policy "public can submit questions"
on public.questions
for insert
to anon
with check (approved = false);

-- questionsにはSELECT権限を与えません。
-- したがって公開サイトから自由記述本文を読み出すことはできません。
