-- ============================================================
--  WorkMate — 追加マイグレーション SQL
--  既に SUPABASE_SETUP.sql を実行済みの場合はこちらを実行
--  Supabase Dashboard > SQL Editor に貼り付けて「Run」
-- ============================================================

-- ── jobs に is_active フラグを追加 ────────────────────────────
alter table jobs add column if not exists is_active boolean default true;

-- ── messages の既読フラグ更新ポリシーを追加 ───────────────────
-- (会話参加者がメッセージを既読にできる)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'messages'
      and policyname = 'Participants can update message read status'
  ) then
    execute $policy$
      create policy "Participants can update message read status"
        on messages for update
        using (
          exists (
            select 1 from conversations c
            where c.id = messages.conversation_id
              and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
          )
        )
    $policy$;
  end if;
end $$;

-- ── Realtime: jobs テーブルを追加（未追加の場合）────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'jobs'
  ) then
    alter publication supabase_realtime add table jobs;
  end if;
end $$;

-- ── 確認クエリ ────────────────────────────────────────────────
select column_name, data_type
from information_schema.columns
where table_name = 'jobs' and column_name = 'is_active';
