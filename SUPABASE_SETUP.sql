-- ============================================================
--  WorkMate — Supabase セットアップSQL
--  Supabase Dashboard > SQL Editor に貼り付けて実行してください
-- ============================================================

-- ── 1. profiles ──────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  english_level text default 'Basic',
  availability text,
  bio text,
  visa_expiry date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
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
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id bigint references jobs(id) on delete cascade not null,
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
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id bigint references jobs(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending','viewed','accepted','rejected')),
  message text,
  created_at timestamptz default now(),
  unique(user_id, job_id)
);

alter table applications enable row level security;

create policy "Users can view their own applications"
  on applications for select using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on applications for insert with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on applications for update using (auth.uid() = user_id);

-- ── 4. conversations ──────────────────────────────────────────
create table if not exists conversations (
  id bigserial primary key,
  job_id bigint references jobs(id) on delete set null,
  participant_a uuid references auth.users(id) on delete cascade not null,
  participant_b uuid references auth.users(id) on delete cascade not null,
  company_name text,
  job_title text,
  last_message text,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(participant_a, participant_b, job_id)
);

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
  id bigserial primary key,
  conversation_id bigint references conversations(id) on delete cascade not null,
  sender_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  read boolean default false,
  created_at timestamptz default now()
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

-- ── 6. Realtime 有効化 ────────────────────────────────────────
-- Supabase Dashboard > Database > Replication で
-- messages テーブルの Realtime を ON にしてください。
-- または以下を実行:
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;

-- ── 7. profile auto-create trigger ───────────────────────────
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
--  完了！次は Google OAuth を Supabase Dashboard で設定:
--  Authentication > Providers > Google > Enable
--  Client ID と Client Secret を Google Cloud Console から取得
--  Redirect URL: https://zkquchdaizdjrvlsncbs.supabase.co/auth/v1/callback
-- ============================================================
