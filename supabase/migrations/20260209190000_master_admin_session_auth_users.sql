-- Match master admin by auth.users.email (same source as login). Does not rely on JWT
-- claim shape or profiles.email, which can still fail for some clients/sessions.

create or replace function public.is_master_admin_session()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from auth.users u
      where u.id = auth.uid()
        and lower(trim(coalesce(u.email, ''))) = lower(trim('kennethalto95@gmail.com'))
    )
    or lower(trim(coalesce(
      nullif(trim((select p.email from public.profiles p where p.id = auth.uid())), ''),
      ''
    ))) = lower(trim('kennethalto95@gmail.com'))
    or lower(trim(coalesce(auth.jwt() ->> 'email', ''))) = lower(trim('kennethalto95@gmail.com'))
    or lower(trim(coalesce(auth.jwt() #>> '{user_metadata,email}', ''))) = lower(trim('kennethalto95@gmail.com'));
$$;
