-- Fix: invited users could not read their own profile when organization_id was null
-- (profiles_select used organization_id = get_my_organization_id(), and NULL = NULL is not true).
-- Add: accept the latest pending invitation matching the signed-in user's email when no invite
-- token is present (e.g. email confirmed on another device or /login opened without ?invite=).

-- ---------------------------------------------------------------------------
-- Profiles: always allow reading your own row; org peers still match by org id
-- ---------------------------------------------------------------------------
drop policy if exists profiles_select_same_org on public.profiles;
create policy profiles_select_same_org
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or organization_id = public.get_my_organization_id()
);

-- ---------------------------------------------------------------------------
-- Accept newest pending invite for JWT email (no token required)
-- ---------------------------------------------------------------------------
create or replace function public.accept_pending_invitation_for_user(p_full_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token text;
  v_org_id uuid;
  v_email text;
  v_role text;
  v_jwt_email text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  v_jwt_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  if v_jwt_email = '' then
    raise exception 'missing_email';
  end if;

  select i.token, i.organization_id, i.email, i.role
    into v_token, v_org_id, v_email, v_role
  from public.invitations i
  where lower(i.email) = v_jwt_email
    and i.accepted_at is null
    and (i.expires_at is null or i.expires_at > now())
  order by i.created_at desc
  limit 1
  for update;

  if v_org_id is null then
    return null;
  end if;

  insert into public.profiles (id, organization_id, full_name, email, role)
  values (
    auth.uid(),
    v_org_id,
    coalesce(nullif(p_full_name, ''), split_part(v_email, '@', 1)),
    v_email,
    'member'
  )
  on conflict (id) do update set
    organization_id = excluded.organization_id,
    full_name = excluded.full_name,
    email = excluded.email,
    role = 'member',
    updated_at = now();

  update public.invitations
    set accepted_at = now()
  where token = v_token
    and accepted_at is null;

  return v_role;
end;
$$;

grant execute on function public.accept_pending_invitation_for_user(text) to authenticated;
