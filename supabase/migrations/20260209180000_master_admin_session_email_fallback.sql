-- is_master_admin_session: match master email on profile OR JWT (not chained coalesce).
-- Fixes: empty-string profiles.email skipping JWT; stale/wrong profile email; OAuth email in user_metadata.

create or replace function public.is_master_admin_session()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    lower(trim(coalesce(
      nullif(trim((select p.email from public.profiles p where p.id = auth.uid())), ''),
      ''
    ))) = lower(trim('kennethalto95@gmail.com'))
    or lower(trim(coalesce(auth.jwt() ->> 'email', ''))) = lower(trim('kennethalto95@gmail.com'))
    or lower(trim(coalesce(auth.jwt() #>> '{user_metadata,email}', ''))) = lower(trim('kennethalto95@gmail.com'));
$$;

-- Source of truth for login is auth.users; keep platform_admin in sync for the master email.
update public.profiles p
set
  platform_admin = true,
  updated_at = now()
from auth.users u
where p.id = u.id
  and lower(trim(coalesce(u.email, ''))) = lower(trim('kennethalto95@gmail.com'));
