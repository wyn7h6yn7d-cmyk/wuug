-- Master admin email must pass is_platform_admin() in SQL (RPCs use it in WHERE).
-- The app already allows this email via canAccessAdminPanel; align the database.

create or replace function public.is_master_admin_session()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    lower(trim(coalesce(
      (select p.email from public.profiles p where p.id = auth.uid()),
      auth.jwt() ->> 'email',
      ''
    ))) = lower(trim('kennethalto95@gmail.com'));
$$;

grant execute on function public.is_master_admin_session() to authenticated;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(
      (select p.platform_admin from public.profiles p where p.id = auth.uid()),
      false
    )
    or public.is_master_admin_session();
$$;
