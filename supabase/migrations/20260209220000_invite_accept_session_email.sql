-- JWT ->> 'email' is often empty in server-side SSR sessions; use auth.users first
-- (same idea as is_master_admin_session / master admin email fallback).

create or replace function public.accept_invitation(p_token text, p_full_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_email text;
  v_role text;
  v_session_email text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select i.organization_id, i.email, i.role
    into v_org_id, v_email, v_role
  from public.invitations i
  where i.token = p_token
    and i.accepted_at is null
    and (i.expires_at is null or i.expires_at > now())
  for update;

  if v_org_id is null then
    raise exception 'invalid_or_expired_invite';
  end if;

  v_session_email := lower(trim(coalesce(
    nullif(trim(coalesce(
      (select u.email::text from auth.users u where u.id = auth.uid()),
      ''
    )), ''),
    nullif(trim(coalesce(auth.jwt() ->> 'email', '')), ''),
    nullif(trim(coalesce(auth.jwt() #>> '{user_metadata,email}', '')), ''),
    ''
  )));

  if v_session_email = '' or lower(v_email) <> v_session_email then
    raise exception 'invite_email_mismatch';
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
  where token = p_token
    and accepted_at is null;

  return v_role;
end;
$$;

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
  v_session_email text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  v_session_email := lower(trim(coalesce(
    nullif(trim(coalesce(
      (select u.email::text from auth.users u where u.id = auth.uid()),
      ''
    )), ''),
    nullif(trim(coalesce(auth.jwt() ->> 'email', '')), ''),
    nullif(trim(coalesce(auth.jwt() #>> '{user_metadata,email}', '')), ''),
    ''
  )));

  if v_session_email = '' then
    raise exception 'missing_email';
  end if;

  select i.token, i.organization_id, i.email, i.role
    into v_token, v_org_id, v_email, v_role
  from public.invitations i
  where lower(i.email) = v_session_email
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
