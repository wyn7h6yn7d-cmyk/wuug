-- Whole-workspace pause + company-wide access (all roles) gated on invoice or trial.

alter table public.organizations
  add column if not exists access_paused boolean not null default false;

comment on column public.organizations.access_paused is
  'Platform admin: when true, every user in this workspace is blocked (except platform admins).';

-- Extend billing trigger to cover access_paused
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
     or new.access_paused is distinct from old.access_paused
  then
    if not public.is_platform_admin() then
      raise exception 'Only platform administrators can change subscription or billing fields.';
    end if;
  end if;
  return new;
end;
$$;

-- Return pause flag in admin list
create or replace function public.admin_list_organizations()
returns table (
  id uuid,
  name text,
  subscription_status text,
  subscription_ends_at timestamptz,
  invoice_paid_at timestamptz,
  subscription_activated_at timestamptz,
  access_paused boolean,
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
    o.access_paused,
    (select count(*)::bigint from public.profiles p where p.organization_id = o.id)
  from public.organizations o
  where public.is_platform_admin();
$$;

-- Replace RPC with access_paused parameter (drops old 5-arg overload name conflict in some PG versions)
drop function if exists public.admin_update_organization_subscription(uuid, text, timestamptz, timestamptz, boolean);

create or replace function public.admin_update_organization_subscription(
  p_org_id uuid,
  p_subscription_status text,
  p_subscription_ends_at timestamptz,
  p_invoice_paid_at timestamptz,
  p_clear_invoice boolean default false,
  p_access_paused boolean default false
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
    access_paused = p_access_paused,
    updated_at = now()
  where id = p_org_id;
end;
$$;

grant execute on function public.admin_update_organization_subscription(uuid, text, timestamptz, timestamptz, boolean, boolean) to authenticated;
