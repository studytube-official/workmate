-- ════════════════════════════════════════════════════════════
--  先着20店舗「永久無料（Founding Member）」機能
--  Supabase ダッシュボード → SQL Editor に貼り付けて Run する
-- ════════════════════════════════════════════════════════════

-- ① profiles に永久無料フラグを追加
alter table public.profiles
  add column if not exists founding_member boolean not null default false;

-- ② 先着20店舗を「原子的に」確定する関数
--    投稿時に呼ばれ、20枠が空いていればその店を Founding Member にする
--    返り値: 'granted'（今なった） / 'already'（既にメンバー） / 'full'（満枠）
create or replace function public.claim_founding_member()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  already boolean;
  cnt int;
begin
  if auth.uid() is null then
    return 'full';
  end if;

  select founding_member into already
    from public.profiles where id = auth.uid();
  if already is true then
    return 'already';
  end if;

  -- 同時に複数店が投稿しても先着判定が崩れないようロックで直列化
  perform pg_advisory_xact_lock(987654321);

  select count(*) into cnt
    from public.profiles where founding_member = true;

  if cnt < 20 then
    update public.profiles set founding_member = true where id = auth.uid();
    return 'granted';
  end if;

  return 'full';
end;
$$;

-- ③ 残り枠数を返す関数（未ログインの訪問者にも表示するため anon にも許可）
create or replace function public.founding_slots_remaining()
returns int
language sql
security definer
set search_path = public
as $$
  select greatest(0, 20 - (select count(*) from public.profiles where founding_member = true));
$$;

-- ④ 実行権限
grant execute on function public.claim_founding_member()    to authenticated;
grant execute on function public.founding_slots_remaining() to anon, authenticated;

-- ════════════════════════════════════════════════════════════
--  運用メモ
--  ・特定の店を手動で永久無料にしたい場合:
--      update public.profiles set founding_member = true where id = '<対象のuser id>';
--  ・現在のメンバーを確認:
--      select id, display_name, founding_member from public.profiles where founding_member = true;
--  ・枠数を20以外にしたい場合は ② ③ の「20」を書き換えて再実行
-- ════════════════════════════════════════════════════════════
