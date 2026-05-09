-- Platform admin, bans, subscription/billing, and admin RPCs.
-- Run in Supabase SQL editor or via supabase db push.

-- ---------------------------------------------------------------------------
-- Columns
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists platform_admin boolean not null default false,
  add column if not exists banned_at timestamptz,
  add column if not exists ban_reason text;

alter table public.organizations
  add column if not exists subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'past_due', 'expired', 'suspended')),
  add column if not exists subscription_ends_at timestamptz,
  add column if not exists invoice_paid_at timestamptz,
  add column if not exists subscription_activated_at timestamptz;

comment on column public.profiles.platform_admin is 'Wuug platform super-admin (billing, bans, role changes).';
comment on column public.organizations.subscription_status is 'Workspace billing state; expired/suspended blocks app access.';
comment on column public.organizations.subscription_ends_at is 'When set and in the past, workspace loses access (unless platform admin user).';
comment on column public.organizations.invoice_paid_at is 'Last recorded paid invoice; required to promote users to manager unless admin forces.';

-- Grandfather existing workspaces (full access until you change them in Admin).
update public.organizations
set
  subscription_status = 'active',
  subscription_ends_at = coalesce(subscription_ends_at, now() + interval '3650 days'),
  invoice_paid_at = coalesce(invoice_paid_at, now())
where subscription_ends_at is null and invoice_paid_at is null;

-- ---------------------------------------------------------------------------
-- Platform admin helper
-- ---------------------------------------------------------------------------
create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.platform_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_platform_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Triggers: block self-serve changes to sensitive fields
-- ---------------------------------------------------------------------------
create or replace function public.profiles_restrict_sensitive_updates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
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

drop trigger if exists profiles_restrict_sensitive_updates_trigger on public.profiles;
create trigger profiles_restrict_sensitive_updates_trigger
before update on public.profiles
for each row execute function public.profiles_restrict_sensitive_updates();

create or replace function public.organizations_restrict_billing_updates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.subscription_status is distinct from old.subscription_status
     or new.subscription_ends_at is distinct from old.subscription_ends_at
     or new.invoice_paid_at is distinct from old.invoice_paid_at
     or new.subscription_activated_at is distinct from old.subscription_activated_at
  then
    if not public.is_platform_admin() then
      raise exception 'Only platform administrators can change subscription or billing fields.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists organizations_restrict_billing_updates_trigger on public.organizations;
create trigger organizations_restrict_billing_updates_trigger
before update on public.organizations
for each row execute function public.organizations_restrict_billing_updates();

create or replace function public.invitations_enforce_manager_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'manager' and not public.is_platform_admin() then
    raise exception 'Manager access is assigned in the Admin panel after billing is confirmed. Invite as Team Member.';
  end if;
  return new;
end;
$$;

drop trigger if exists invitations_enforce_manager_rules_trigger on public.invitations;
create trigger invitations_enforce_manager_rules_trigger
before insert on public.invitations
for each row execute function public.invitations_enforce_manager_rules();

-- ---------------------------------------------------------------------------
-- New workspaces: trial window (adjust in Admin / billing integration later)
-- ---------------------------------------------------------------------------
create or replace function public.create_workspace(p_organization_name text, p_full_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_email text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  v_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  if v_email = '' then
    raise exception 'missing_email';
  end if;

  insert into public.organizations (name)
  values (coalesce(nullif(p_organization_name, ''), 'My workspace'))
  returning id into v_org_id;

  update public.organizations
  set
    subscription_status = 'trial',
    subscription_ends_at = now() + interval '14 days',
    invoice_paid_at = null,
    subscription_activated_at = now()
  where id = v_org_id;

  insert into public.profiles (id, organization_id, full_name, email, role)
  values (
    auth.uid(),
    v_org_id,
    coalesce(nullif(p_full_name, ''), split_part(v_email, '@', 1)),
    v_email,
    'manager'
  )
  on conflict (id) do update set
    organization_id = excluded.organization_id,
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role,
    updated_at = now();
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin RPCs
-- ---------------------------------------------------------------------------
create or replace function public.admin_list_profiles()
returns table (
  id uuid,
  full_name text,
  email text,
  role text,
  organization_id uuid,
  organization_name text,
  platform_admin boolean,
  banned_at timestamptz,
  ban_reason text,
  subscription_status text,
  subscription_ends_at timestamptz,
  invoice_paid_at timestamptz,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.full_name,
    p.email,
    p.role,
    p.organization_id,
    o.name,
    p.platform_admin,
    p.banned_at,
    p.ban_reason,
    o.subscription_status,
    o.subscription_ends_at,
    o.invoice_paid_at,
    p.created_at
  from public.profiles p
  left join public.organizations o on o.id = p.organization_id
  where public.is_platform_admin();
$$;

grant execute on function public.admin_list_profiles() to authenticated;

create or replace function public.admin_list_organizations()
returns table (
  id uuid,
  name text,
  subscription_status text,
  subscription_ends_at timestamptz,
  invoice_paid_at timestamptz,
  subscription_activated_at timestamptz,
  member_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    o.id,
    o.name,
    o.subscription_status,
    o.subscription_ends_at,
    o.invoice_paid_at,
    o.subscription_activated_at,
    (select count(*)::bigint from public.profiles p where p.organization_id = o.id)
  from public.organizations o
  where public.is_platform_admin();
$$;

grant execute on function public.admin_list_organizations() to authenticated;

create or replace function public.admin_list_invitations()
returns table (
  id uuid,
  organization_id uuid,
  organization_name text,
  email text,
  role text,
  created_at timestamptz,
  expires_at timestamptz,
  accepted_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    i.id,
    i.organization_id,
    o.name,
    i.email,
    i.role,
    i.created_at,
    i.expires_at,
    i.accepted_at
  from public.invitations i
  join public.organizations o on o.id = i.organization_id
  where public.is_platform_admin();
$$;

grant execute on function public.admin_list_invitations() to authenticated;

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

grant execute on function public.admin_update_user_role(uuid, text, boolean) to authenticated;

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
  update public.profiles
  set platform_admin = p_is_admin, updated_at = now()
  where id = p_user_id;
end;
$$;

grant execute on function public.admin_set_platform_admin(uuid, boolean) to authenticated;

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

grant execute on function public.admin_set_ban(uuid, boolean, text) to authenticated;

create or replace function public.admin_update_organization_subscription(
  p_org_id uuid,
  p_subscription_status text,
  p_subscription_ends_at timestamptz,
  p_invoice_paid_at timestamptz,
  p_clear_invoice boolean default false
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
  if p_subscription_status not in ('trial', 'active', 'past_due', 'expired', 'suspended') then
    raise exception 'invalid_status';
  end if;

  update public.organizations
  set
    subscription_status = p_subscription_status,
    subscription_ends_at = p_subscription_ends_at,
    invoice_paid_at = case
      when p_clear_invoice then null
      when p_invoice_paid_at is not null then p_invoice_paid_at
      else invoice_paid_at
    end,
    subscription_activated_at = case
      when p_clear_invoice then subscription_activated_at
      when p_invoice_paid_at is not null then coalesce(subscription_activated_at, now())
      else subscription_activated_at
    end,
    updated_at = now()
  where id = p_org_id;
end;
$$;

grant execute on function public.admin_update_organization_subscription(uuid, text, timestamptz, timestamptz, boolean) to authenticated;

create or replace function public.admin_delete_invitation(p_invitation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'not_platform_admin';
  end if;
  delete from public.invitations where id = p_invitation_id;
end;
$$;

grant execute on function public.admin_delete_invitation(uuid) to authenticated;

-- Invites always create workspace members; managers are assigned in Admin after billing.
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
  v_jwt_email text;
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

  v_jwt_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  if v_jwt_email = '' or lower(v_email) <> v_jwt_email then
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

-- ---------------------------------------------------------------------------
-- Seed platform admin (change email if needed)
-- ---------------------------------------------------------------------------
update public.profiles
set platform_admin = true, updated_at = now()
where lower(email) = lower('kennethalto95@gmail.com');
