-- ============================================================
--  WorkMate — Supabase セットアップSQL (完全版)
--  Supabase Dashboard > SQL Editor に貼り付けて「Run」
-- ============================================================

-- ── 0. jobs ───────────────────────────────────────────────────
--   ※ saved_jobs / applications が参照するため最初に作成
create table if not exists jobs (
  id            bigserial primary key,
  title         text not null,
  company       text not null,
  location      text,
  salary        text,
  english_level text default '英語初級OK',
  description   text,
  image_url     text,
  posted_by     uuid references auth.users(id) on delete set null,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

alter table jobs enable row level security;

create policy "Anyone can view jobs"
  on jobs for select using (true);

create policy "Authenticated users can insert jobs"
  on jobs for insert with check (auth.uid() = posted_by);

create policy "Job posters can update their jobs"
  on jobs for update using (auth.uid() = posted_by);

create policy "Job posters can delete their jobs"
  on jobs for delete using (auth.uid() = posted_by);

-- ── 1. profiles ──────────────────────────────────────────────
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  english_level text default 'Basic',
  availability  text,
  bio           text,
  visa_expiry   date,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- ── 2. saved_jobs ─────────────────────────────────────────────
create table if not exists saved_jobs (
  id         bigserial primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  job_id     bigint references jobs(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, job_id)
);

alter table saved_jobs enable row level security;

create policy "Users can view their own saved jobs"
  on saved_jobs for select using (auth.uid() = user_id);

create policy "Users can insert their own saved jobs"
  on saved_jobs for insert with check (auth.uid() = user_id);

create policy "Users can delete their own saved jobs"
  on saved_jobs for delete using (auth.uid() = user_id);

-- ── 3. applications ───────────────────────────────────────────
create table if not exists applications (
  id         bigserial primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  job_id     bigint references jobs(id) on delete cascade not null,
  status     text default 'pending' check (status in ('pending','viewed','accepted','rejected')),
  message    text,
  created_at timestamptz default now(),
  unique(user_id, job_id)
);

alter table applications enable row level security;

-- 求職者：自分の応募を閲覧
create policy "Users can view their own applications"
  on applications for select using (auth.uid() = user_id);

-- 求職者：応募を送信
create policy "Users can insert their own applications"
  on applications for insert with check (auth.uid() = user_id);

-- 求人投稿者：自分の求人への応募を閲覧できる
create policy "Job posters can view applications to their jobs"
  on applications for select
  using (
    exists (
      select 1 from jobs j
      where j.id = job_id and j.posted_by = auth.uid()
    )
  );

-- 求人投稿者：採用/不採用ステータスを更新できる
create policy "Job posters can update application status"
  on applications for update
  using (
    exists (
      select 1 from jobs j
      where j.id = job_id and j.posted_by = auth.uid()
    )
  );

-- ── 4. conversations ──────────────────────────────────────────
create table if not exists conversations (
  id              bigserial primary key,
  job_id          bigint references jobs(id) on delete set null,  -- null = スタッフDM
  participant_a   uuid references auth.users(id) on delete cascade not null,
  participant_b   uuid references auth.users(id) on delete cascade not null,
  company_name    text,
  job_title       text,
  last_message    text,
  last_message_at timestamptz default now(),
  created_at      timestamptz default now(),
  unique(participant_a, participant_b, job_id)
);

-- job_id が null のスタッフDM：同じペアで重複しないよう部分ユニークインデックス
-- (participant_a, participant_b) と (participant_b, participant_a) を同一視する
create unique index if not exists conversations_staff_dm_unique
  on conversations (
    least(participant_a::text, participant_b::text),
    greatest(participant_a::text, participant_b::text)
  )
  where job_id is null;

alter table conversations enable row level security;

create policy "Participants can view their conversations"
  on conversations for select
  using (auth.uid() = participant_a or auth.uid() = participant_b);

create policy "Authenticated users can create conversations"
  on conversations for insert with check (auth.uid() = participant_a);

create policy "Participants can update their conversations"
  on conversations for update
  using (auth.uid() = participant_a or auth.uid() = participant_b);

-- ── 5. messages ───────────────────────────────────────────────
create table if not exists messages (
  id              bigserial primary key,
  conversation_id bigint references conversations(id) on delete cascade not null,
  sender_id       uuid references auth.users(id) on delete cascade not null,
  text            text not null,
  read            boolean default false,
  created_at      timestamptz default now()
);

alter table messages enable row level security;

create policy "Conversation participants can view messages"
  on messages for select
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  );

create policy "Authenticated users can insert messages"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  );

-- ── 6. messages 既読更新ポリシー ─────────────────────────────
create policy "Participants can update message read status"
  on messages for update
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  );

-- ── 7. Realtime 有効化 ────────────────────────────────────────
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table jobs;
alter publication supabase_realtime add table applications;

-- ── 7. 新規ユーザー登録時にプロフィールを自動生成 ─────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
--  ストレージバケット設定（Dashboard で手動作成が必要）
--  Storage > New bucket:
--    1. 名前: job-images   Public: ON  (求人画像)
--    2. 名前: avatars      Public: ON  (プロフィール写真)
--
--  バケット作成後、以下のポリシーを各バケットに設定:
--    job-images:
--      INSERT: authenticated ユーザーが自分のフォルダにアップロード可
--      SELECT: 全員が閲覧可 (Public)
--    avatars:
--      INSERT/UPDATE: authenticated ユーザーが自分の uid フォルダのみ
--      SELECT: 全員が閲覧可 (Public)
--
--  Google OAuth 設定:
--    Authentication > Providers > Google > Enable
--    Redirect URL: https://zkquchdaizdjrvlsncbs.supabase.co/auth/v1/callback
-- ============================================================
