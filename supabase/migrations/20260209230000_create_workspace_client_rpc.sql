-- Reliable client creation: set organization_id from the caller's profile inside the database.
-- Avoids RLS edge cases where direct INSERT with_check (organization_id = get_my_organization_id()) fails.

create or replace function public.create_workspace_client(
  p_name text,
  p_contact_name text default null,
  p_email text default null,
  p_phone text default null,
  p_status text default 'active',
  p_health text default 'healthy',
  p_priority text default 'normal',
  p_note text default null,
  p_next_step text default null,
  p_next_step_due_at timestamptz default null,
  p_owner_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_uid uuid;
  v_role text;
  v_owner uuid;
  v_new_id uuid;
  v_name text;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;

  v_name := trim(coalesce(p_name, ''));
  if v_name = '' then
    raise exception 'name_required';
  end if;

  select p.organization_id, p.role
    into v_org, v_role
  from public.profiles p
  where p.id = v_uid;

  if v_org is null then
    raise exception 'no_organization';
  end if;

  if coalesce(v_role, 'member') = 'member' then
    v_owner := v_uid;
  else
    v_owner := coalesce(p_owner_id, v_uid);
  end if;

  if not exists (
    select 1 from public.profiles p where p.id = v_owner and p.organization_id = v_org
  ) then
    raise exception 'invalid_owner';
  end if;

  insert into public.clients (
    organization_id,
    name,
    contact_name,
    email,
    phone,
    status,
    health,
    priority,
    note,
    next_step,
    next_step_due_at,
    owner_id,
    created_by
  ) values (
    v_org,
    v_name,
    nullif(trim(coalesce(p_contact_name, '')), ''),
    nullif(trim(coalesce(p_email, '')), ''),
    nullif(trim(coalesce(p_phone, '')), ''),
    coalesce(nullif(trim(coalesce(p_status, '')), ''), 'active'),
    coalesce(nullif(trim(coalesce(p_health, '')), ''), 'healthy'),
    coalesce(nullif(trim(coalesce(p_priority, '')), ''), 'normal'),
    nullif(trim(coalesce(p_note, '')), ''),
    nullif(trim(coalesce(p_next_step, '')), ''),
    p_next_step_due_at,
    v_owner,
    v_uid
  )
  returning id into v_new_id;

  return v_new_id;
end;
$$;

-- 9× text (name … next_step), then due_at, then owner_id — not 10× text.
grant execute on function public.create_workspace_client(
  text, text, text, text, text, text, text, text, text, timestamptz, uuid
) to authenticated;
