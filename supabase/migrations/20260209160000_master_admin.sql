-- Master administrator: kennethalto95@gmail.com must stay owner + platform_admin and cannot be banned.
-- No other admin (or RPC) can revoke those protections.

create or replace function public.is_master_admin_profile(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = p_user_id
      and lower(trim(p.email)) = lower(trim('kennethalto95@gmail.com'))
  );
$$;

grant execute on function public.is_master_admin_profile(uuid) to authenticated;

-- Harden profile trigger: master row cannot lose owner, platform_admin, or gain a ban (any session).
create or replace function public.profiles_restrict_sensitive_updates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_master_admin_profile(old.id) then
    if new.role is distinct from old.role and new.role <> 'owner' then
      raise exception 'The master administrator must remain workspace owner.';
    end if;
    if new.platform_admin is distinct from old.platform_admin and coalesce(new.platform_admin, false) is not true then
      raise exception 'The master administrator must keep platform admin access.';
    end if;
    if new.banned_at is distinct from old.banned_at and new.banned_at is not null then
      raise exception 'The master administrator cannot be banned.';
    end if;
  end if;

  if new.platform_admin is distinct from old.platform_admin
     or new.banned_at is distinct from old.banned_at
     or new.ban_reason is distinct from old.ban_reason
  then
    if not public.is_platform_admin() then
      raise exception 'Only platform administrators can change bans or admin flags.';
    end if;
  end if;

  if new.role is distinct from old.role then
    if new.role in ('owner', 'manager') and not public.is_platform_admin() then
      raise exception 'Only platform administrators can grant manager or owner access.';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.admin_update_user_role(
  p_user_id uuid,
  p_role text,
  p_force_billing boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_ok boolean;
begin
  if not public.is_platform_admin() then
    raise exception 'not_platform_admin';
  end if;
  if public.is_master_admin_profile(p_user_id) and p_role <> 'owner' then
    raise exception 'The master administrator must remain owner.';
  end if;
  if p_role not in ('owner', 'manager', 'member') then
    raise exception 'invalid_role';
  end if;

  select organization_id into v_org_id from public.profiles where id = p_user_id;
  if v_org_id is null then
    raise exception 'user_has_no_org';
  end if;

  if p_role in ('owner', 'manager') and not coalesce(p_force_billing, false) then
    select
      (o.invoice_paid_at is not null
        and (o.subscription_ends_at is null or o.subscription_ends_at > now())
        and o.subscription_status in ('trial', 'active'))
    into v_ok
    from public.organizations o
    where o.id = v_org_id;

    if not coalesce(v_ok, false) then
      raise exception 'billing_required: mark invoice paid and extend subscription before promoting to manager.';
    end if;
  end if;

  update public.profiles
  set role = p_role, updated_at = now()
  where id = p_user_id;
end;
$$;

create or replace function public.admin_set_platform_admin(p_user_id uuid, p_is_admin boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'not_platform_admin';
  end if;
  if public.is_master_admin_profile(p_user_id) and not coalesce(p_is_admin, false) then
    raise exception 'Cannot remove platform admin from the master administrator.';
  end if;
  update public.profiles
  set platform_admin = p_is_admin, updated_at = now()
  where id = p_user_id;
end;
$$;

create or replace function public.admin_set_ban(
  p_user_id uuid,
  p_banned boolean,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'not_platform_admin';
  end if;
  if public.is_master_admin_profile(p_user_id) and coalesce(p_banned, false) then
    raise exception 'The master administrator cannot be banned.';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'cannot_ban_self';
  end if;
  update public.profiles
  set
    banned_at = case when p_banned then now() else null end,
    ban_reason = case when p_banned then nullif(trim(p_reason), '') else null end,
    updated_at = now()
  where id = p_user_id;
end;
$$;

update public.profiles
set
  role = 'owner',
  platform_admin = true,
  banned_at = null,
  ban_reason = null,
  updated_at = now()
where lower(trim(email)) = lower(trim('kennethalto95@gmail.com'));
