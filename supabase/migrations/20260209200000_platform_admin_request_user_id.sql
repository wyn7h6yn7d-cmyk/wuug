-- Some PostgREST / SECURITY DEFINER paths leave auth.uid() null while request.jwt.claims
-- still has "sub". Align gates with the same user id the API sees.

create or replace function public.request_user_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_claims text;
  v_sub text;
begin
  if auth.uid() is not null then
    return auth.uid();
  end if;

  v_claims := nullif(trim(coalesce(current_setting('request.jwt.claims', true), '')), '');
  if v_claims is null then
    return null;
  end if;

  v_sub := v_claims::jsonb ->> 'sub';
  if v_sub is null or btrim(v_sub) = '' then
    return null;
  end if;

  begin
    return v_sub::uuid;
  exception
    when invalid_text_representation then
      return null;
  end;
end;
$$;

grant execute on function public.request_user_id() to authenticated;

create or replace function public.is_platform_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  uid uuid := public.request_user_id();
  pe text;
begin
  if uid is not null and coalesce((select p.platform_admin from public.profiles p where p.id = uid), false) then
    return true;
  end if;

  if uid is not null and exists (
    select 1
    from auth.users u
    where u.id = uid
      and lower(trim(coalesce(u.email, ''))) = lower(trim('kennethalto95@gmail.com'))
  ) then
    return true;
  end if;

  if uid is not null then
    pe := nullif(trim((select p.email from public.profiles p where p.id = uid)), '');
    if pe is not null and lower(pe) = lower(trim('kennethalto95@gmail.com')) then
      return true;
    end if;
  end if;

  if lower(trim(coalesce(auth.jwt() ->> 'email', ''))) = lower(trim('kennethalto95@gmail.com')) then
    return true;
  end if;

  if lower(trim(coalesce(auth.jwt() #>> '{user_metadata,email}', ''))) = lower(trim('kennethalto95@gmail.com')) then
    return true;
  end if;

  return false;
end;
$$;

-- Keep helper in sync (triggers / future callers).
create or replace function public.is_master_admin_session()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  uid uuid := public.request_user_id();
begin
  if uid is not null and exists (
    select 1
    from auth.users u
    where u.id = uid
      and lower(trim(coalesce(u.email, ''))) = lower(trim('kennethalto95@gmail.com'))
  ) then
    return true;
  end if;

  if uid is not null then
    if lower(trim(coalesce(nullif(trim((select p.email from public.profiles p where p.id = uid)), ''), '')))
      = lower(trim('kennethalto95@gmail.com')) then
      return true;
    end if;
  end if;

  if lower(trim(coalesce(auth.jwt() ->> 'email', ''))) = lower(trim('kennethalto95@gmail.com')) then
    return true;
  end if;

  if lower(trim(coalesce(auth.jwt() #>> '{user_metadata,email}', ''))) = lower(trim('kennethalto95@gmail.com')) then
    return true;
  end if;

  return false;
end;
$$;

-- Read-only: helps debug empty admin UI (callable by any logged-in user; data is coarse).
create or replace function public.admin_session_diagnostic()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'auth_uid', auth.uid(),
    'request_user_id', public.request_user_id(),
    'jwt_claims_sub',
      (nullif(trim(coalesce(current_setting('request.jwt.claims', true), '')), '')::jsonb ->> 'sub'),
    'jwt_claims_present', length(coalesce(current_setting('request.jwt.claims', true), '')) > 0,
    'is_platform_admin', public.is_platform_admin(),
    'profiles_row_count', (select count(*) from public.profiles),
    'organizations_row_count', (select count(*) from public.organizations),
    'auth_users_email', (select u.email from auth.users u where u.id = public.request_user_id())
  );
$$;

grant execute on function public.admin_session_diagnostic() to authenticated;
