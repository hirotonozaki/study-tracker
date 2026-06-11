-- ============================================================
-- Study Tracker — Supabase schema
-- study_records: 学習記録（1行 = ある日・ある科目の学習1件）
-- Supabase ダッシュボードの SQL Editor に貼って実行してください。
-- ============================================================

create table if not exists public.study_records (
  id          uuid        primary key default gen_random_uuid(),
  subject     text        not null,                       -- 科目名
  minutes     integer     not null check (minutes > 0),   -- 学習時間（分）
  studied_on  date        not null default current_date,  -- 学習日
  memo        text,                                       -- メモ（任意）
  created_at  timestamptz not null default now()
);

-- 並び替え・集計でよく使う列にインデックス
create index if not exists idx_study_records_studied_on
  on public.study_records (studied_on desc);
create index if not exists idx_study_records_subject
  on public.study_records (subject);

-- ============================================================
-- Row Level Security (RLS)
-- ※このデモはログイン無しの単一ユーザー想定のため anon に許可しています。
--   本番では Supabase Auth を導入し、user_id 列を追加して
--   「自分の記録だけ」に絞るポリシーへ置き換えます（README参照）。
-- ============================================================
alter table public.study_records enable row level security;

create policy "Public read"   on public.study_records for select using (true);
create policy "Public insert" on public.study_records for insert with check (true);
create policy "Public update" on public.study_records for update using (true) with check (true);
create policy "Public delete" on public.study_records for delete using (true);
