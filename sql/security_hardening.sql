-- ============================================================
--  WorkMate security hardening
--  Run once in Supabase Dashboard > SQL Editor.
--  Safe to run again: policies are replaced by name.
-- ============================================================

begin;

-- Profiles contain availability, biography and visa-expiry data. Keep owners,
-- genuine employers, applicants and conversation peers able to read the rows
-- they need, but remove anonymous access.
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Permitted users can view profiles" on public.profiles;

create policy "Permitted users can view profiles"
  on public.profiles for select
  to authenticated
  using (
    auth.uid() = id
    or exists (
      select 1
      from public.jobs j
      where j.posted_by = auth.uid()
    )
    or exists (
      select 1
      from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.user_id = profiles.id
        and j.posted_by = auth.uid()
    )
    or exists (
      select 1
      from public.conversations c
      where (c.participant_a = auth.uid() and c.participant_b = profiles.id)
         or (c.participant_b = auth.uid() and c.participant_a = profiles.id)
    )
  );

-- A job conversation must target that job's poster. A staff conversation can
-- only be started by an employer who has posted at least one job.
drop policy if exists "Authenticated users can create conversations" on public.conversations;
drop policy if exists "Users can create permitted conversations" on public.conversations;

create policy "Users can create permitted conversations"
  on public.conversations for insert
  to authenticated
  with check (
    auth.uid() = participant_a
    and participant_b <> auth.uid()
    and (
      (
        job_id is not null
        and exists (
          select 1
          from public.jobs j
          where j.id = conversations.job_id
            and j.posted_by = conversations.participant_b
            and j.is_active is true
        )
      )
      or
      (
        job_id is null
        and exists (
          select 1
          from public.jobs j
          where j.posted_by = auth.uid()
        )
      )
    )
  );

-- Limit browser clients to the exact fields each workflow is meant to change.
-- RLS still decides which rows the signed-in user may update.
revoke update on public.applications from anon, authenticated;
grant update (status) on public.applications to authenticated;

revoke update on public.conversations from anon, authenticated;
grant update (last_message, last_message_at) on public.conversations to authenticated;

revoke update on public.messages from anon, authenticated;
grant update (read) on public.messages to authenticated;

-- Public images stay public, but uploads must be authenticated, user-scoped
-- images no larger than 5 MB.
update storage.buckets
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']::text[]
where id in ('job-images', 'avatars');

drop policy if exists "Give anon users access to JPG images in folder g4eh6w_0" on storage.objects;
drop policy if exists "Public can view job images" on storage.objects;
drop policy if exists "Users can upload job images" on storage.objects;
drop policy if exists "Users can update job images" on storage.objects;
drop policy if exists "Users can delete job images" on storage.objects;
drop policy if exists "Public can view avatars" on storage.objects;
drop policy if exists "Users can upload avatars" on storage.objects;
drop policy if exists "Users can update avatars" on storage.objects;
drop policy if exists "Users can delete avatars" on storage.objects;

create policy "Public can view job images"
  on storage.objects for select
  to public
  using (bucket_id = 'job-images');

create policy "Users can upload job images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'job-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update job images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'job-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'job-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete job images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'job-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Public can view avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "Users can upload avatars"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update avatars"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete avatars"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Resumes and legacy DM attachments may contain personal information. Keep the
-- existing objects, make both buckets private, and authorize only the owner or
-- the directly related employer/conversation participant.
update storage.buckets
set public = false,
    file_size_limit = 10485760,
    allowed_mime_types = array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp',
      'text/plain'
    ]::text[]
where id in ('resumes', 'dm-files');

drop policy if exists "resume read" on storage.objects;
drop policy if exists "resume upload" on storage.objects;
drop policy if exists "Resume owners and employers can read" on storage.objects;
drop policy if exists "Users can upload their resumes" on storage.objects;
drop policy if exists "Users can update their resumes" on storage.objects;
drop policy if exists "Users can delete their resumes" on storage.objects;

create policy "Resume owners and employers can read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'resumes'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1
        from public.applications a
        join public.jobs j on j.id = a.job_id
        where j.posted_by = auth.uid()
          and a.resume_url is not null
          and right(a.resume_url, length(name)) = name
      )
    )
  );

create policy "Users can upload their resumes"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their resumes"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their resumes"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "dm-files read" on storage.objects;
drop policy if exists "dm-files upload" on storage.objects;
drop policy if exists "Conversation participants can read DM files" on storage.objects;
drop policy if exists "Conversation participants can upload DM files" on storage.objects;
drop policy if exists "Conversation participants can update DM files" on storage.objects;
drop policy if exists "Conversation participants can delete DM files" on storage.objects;

create policy "Conversation participants can read DM files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'dm-files'
    and exists (
      select 1
      from public.conversations c
      where c.id = case
        when (storage.foldername(name))[1] ~ '^[0-9]+$'
          then ((storage.foldername(name))[1])::bigint
        else null
      end
      and auth.uid() in (c.participant_a, c.participant_b)
    )
  );

create policy "Conversation participants can upload DM files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'dm-files'
    and exists (
      select 1
      from public.conversations c
      where c.id = case
        when (storage.foldername(name))[1] ~ '^[0-9]+$'
          then ((storage.foldername(name))[1])::bigint
        else null
      end
      and auth.uid() in (c.participant_a, c.participant_b)
    )
  );

create policy "Conversation participants can update DM files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'dm-files'
    and exists (
      select 1
      from public.conversations c
      where c.id = case
        when (storage.foldername(name))[1] ~ '^[0-9]+$'
          then ((storage.foldername(name))[1])::bigint
        else null
      end
      and auth.uid() in (c.participant_a, c.participant_b)
    )
  )
  with check (
    bucket_id = 'dm-files'
    and exists (
      select 1
      from public.conversations c
      where c.id = case
        when (storage.foldername(name))[1] ~ '^[0-9]+$'
          then ((storage.foldername(name))[1])::bigint
        else null
      end
      and auth.uid() in (c.participant_a, c.participant_b)
    )
  );

create policy "Conversation participants can delete DM files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'dm-files'
    and exists (
      select 1
      from public.conversations c
      where c.id = case
        when (storage.foldername(name))[1] ~ '^[0-9]+$'
          then ((storage.foldername(name))[1])::bigint
        else null
      end
      and auth.uid() in (c.participant_a, c.participant_b)
    )
  );

commit;

-- The frontend uploads public images to:
--
--   job-images/<uid>/jobs/<generated-name>.<ext>
--   avatars/<uid>/avatar.<ext>
