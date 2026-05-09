-- Wuug Supabase schema (production-ready)
-- Team-based business command center with roles: owner, manager, member.
-- Run in Supabase SQL editor.

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================================
-- Tables
-- ============================================================================

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  industry text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.organizations is 'A Wuug workspace/company.';

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  role text not null check (role in ('owner', 'manager', 'member')) default 'member',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.profiles is 'User profile scoped to an organization. Drives role-based access.';

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  contact_name text,
  email text,
  phone text,
  status text default 'active',
  health text default 'healthy',
  priority text default 'normal',
  note text,
  owner_id uuid references public.profiles(id) on delete set null,
  next_step text,
  next_step_due_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.clients is 'Clients/leads. Members read clients they own; managers/owners read all in org.';

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  status text default 'not_started',
  progress int default 0 check (progress >= 0 and progress <= 100),
  deadline date,
  next_milestone text,
  next_step text,
  next_step_due_at timestamptz,
  risk_reason text,
  owner_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.projects is 'Projects. Members read projects they own; managers/owners read all in org.';

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  status text default 'planned',
  priority text default 'medium',
  due_at timestamptz,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.tasks is 'Tasks. Members read/update tasks assigned to them; managers/owners can manage all.';

create table if not exists public.promises (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  status text default 'active',
  due_at timestamptz,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.promises is 'Promise register. Members can update promises assigned to them.';

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  promise_id uuid references public.promises(id) on delete cascade,
  body text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);
comment on table public.notes is 'Notes attached to entities. Members can insert notes for assigned/owned entities.';

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  type text not null,
  entity_type text,
  entity_id uuid,
  title text not null,
  description text,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  status text,
  completed_at timestamptz,
  created_at timestamptz default now()
);
comment on table public.activity_log is 'Append-only activity stream for reporting/export. Managers/owners only for full access.';

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  type text,
  read_at timestamptz,
  created_at timestamptz default now()
);
comment on table public.notifications is 'In-app notifications scoped to a user inside an org.';

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  email text not null,
  role text not null check (role in ('manager', 'member')),
  invited_by uuid references public.profiles(id) on delete set null,
  token text unique,
  accepted_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);
comment on table public.invitations is 'Invitations for onboarding team members into an organization.';

-- ============================================================================
-- updated_at triggers
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'organizations_set_updated_at') then
    create trigger organizations_set_updated_at before update on public.organizations
    for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'profiles_set_updated_at') then
    create trigger profiles_set_updated_at before update on public.profiles
    for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'clients_set_updated_at') then
    create trigger clients_set_updated_at before update on public.clients
    for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'projects_set_updated_at') then
    create trigger projects_set_updated_at before update on public.projects
    for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'tasks_set_updated_at') then
    create trigger tasks_set_updated_at before update on public.tasks
    for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'promises_set_updated_at') then
    create trigger promises_set_updated_at before update on public.promises
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- ============================================================================
-- Helper functions (RLS) + onboarding RPCs
-- ============================================================================
-- Defined AFTER tables to avoid missing-relation errors on first run.

-- SECURITY DEFINER is used only where necessary to avoid RLS recursion.
-- All functions are scoped to auth.uid() and return derived info.

create or replace function public.get_my_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.organization_id
  from public.profiles p
  where p.id = auth.uid()
$$;

create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
$$;

create or replace function public.is_manager_or_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.get_my_role() in ('owner', 'manager'), false)
$$;

-- Create a new workspace (organization + owner profile) for the authenticated user.
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

grant execute on function public.create_workspace(text, text) to authenticated;

-- Public, token-scoped read for invite-based registration.
create or replace function public.get_invitation_public(p_token text)
returns table (
  organization_id uuid,
  organization_name text,
  email text,
  role text,
  expires_at timestamptz,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    i.organization_id,
    o.name as organization_name,
    i.email,
    i.role,
    i.expires_at,
    i.created_at
  from public.invitations i
  join public.organizations o on o.id = i.organization_id
  where i.token = p_token
    and i.accepted_at is null
    and (i.expires_at is null or i.expires_at > now())
  limit 1
$$;

grant execute on function public.get_invitation_public(text) to anon, authenticated;

-- Accept an invitation and create the caller's profile in the invited org.
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
    case when v_role = 'manager' then 'manager' else 'member' end
  )
  on conflict (id) do update set
    organization_id = excluded.organization_id,
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role,
    updated_at = now();

  update public.invitations
    set accepted_at = now()
  where token = p_token
    and accepted_at is null;

  return v_role;
end;
$$;

grant execute on function public.accept_invitation(text, text) to authenticated;

-- Accept newest pending invite for the signed-in user's email (no token; e.g. after email confirm on another device).
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

grant execute on function public.accept_pending_invitation_for_user(text) to authenticated;

-- ============================================================================
-- RLS
-- ============================================================================

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.promises enable row level security;
alter table public.notes enable row level security;
alter table public.activity_log enable row level security;
alter table public.notifications enable row level security;
alter table public.invitations enable row level security;

-- Profiles: users can read their own profile; org members can read profiles in same org.
drop policy if exists profiles_select_same_org on public.profiles;
create policy profiles_select_same_org
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or organization_id = public.get_my_organization_id()
);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Organizations: select own org; update own org only for manager/owner.
drop policy if exists organizations_select_own on public.organizations;
create policy organizations_select_own
on public.organizations for select
to authenticated
using (id = public.get_my_organization_id());

drop policy if exists organizations_update_manager on public.organizations;
create policy organizations_update_manager
on public.organizations for update
to authenticated
using (public.is_manager_or_owner() and id = public.get_my_organization_id())
with check (public.is_manager_or_owner() and id = public.get_my_organization_id());

-- Clients: managers/owners see all in org; members see only owned.
drop policy if exists clients_select on public.clients;
create policy clients_select
on public.clients for select
to authenticated
using (
  organization_id = public.get_my_organization_id()
  and (public.is_manager_or_owner() or owner_id = auth.uid())
);

drop policy if exists clients_insert on public.clients;
create policy clients_insert
on public.clients for insert
to authenticated
with check (organization_id = public.get_my_organization_id());

drop policy if exists clients_update on public.clients;
create policy clients_update
on public.clients for update
to authenticated
using (
  organization_id = public.get_my_organization_id()
  and (public.is_manager_or_owner() or owner_id = auth.uid())
)
with check (organization_id = public.get_my_organization_id());

drop policy if exists clients_delete on public.clients;
create policy clients_delete
on public.clients for delete
to authenticated
using (organization_id = public.get_my_organization_id() and public.is_manager_or_owner());

-- Projects: managers/owners see all in org; members see only owned.
drop policy if exists projects_select on public.projects;
create policy projects_select
on public.projects for select
to authenticated
using (
  organization_id = public.get_my_organization_id()
  and (public.is_manager_or_owner() or owner_id = auth.uid())
);

drop policy if exists projects_insert on public.projects;
create policy projects_insert
on public.projects for insert
to authenticated
with check (organization_id = public.get_my_organization_id());

drop policy if exists projects_update on public.projects;
create policy projects_update
on public.projects for update
to authenticated
using (
  organization_id = public.get_my_organization_id()
  and (public.is_manager_or_owner() or owner_id = auth.uid())
)
with check (organization_id = public.get_my_organization_id());

drop policy if exists projects_delete on public.projects;
create policy projects_delete
on public.projects for delete
to authenticated
using (organization_id = public.get_my_organization_id() and public.is_manager_or_owner());

-- Tasks: managers/owners see all in org; members see only assigned.
drop policy if exists tasks_select on public.tasks;
create policy tasks_select
on public.tasks for select
to authenticated
using (
  organization_id = public.get_my_organization_id()
  and (public.is_manager_or_owner() or assigned_to = auth.uid())
);

drop policy if exists tasks_insert on public.tasks;
create policy tasks_insert
on public.tasks for insert
to authenticated
with check (organization_id = public.get_my_organization_id());

drop policy if exists tasks_update on public.tasks;
create policy tasks_update
on public.tasks for update
to authenticated
using (
  organization_id = public.get_my_organization_id()
  and (public.is_manager_or_owner() or assigned_to = auth.uid())
)
with check (organization_id = public.get_my_organization_id());

drop policy if exists tasks_delete on public.tasks;
create policy tasks_delete
on public.tasks for delete
to authenticated
using (organization_id = public.get_my_organization_id() and public.is_manager_or_owner());

-- Promises: managers/owners see all in org; members see only assigned.
drop policy if exists promises_select on public.promises;
create policy promises_select
on public.promises for select
to authenticated
using (
  organization_id = public.get_my_organization_id()
  and (public.is_manager_or_owner() or assigned_to = auth.uid())
);

drop policy if exists promises_insert on public.promises;
create policy promises_insert
on public.promises for insert
to authenticated
with check (organization_id = public.get_my_organization_id());

drop policy if exists promises_update on public.promises;
create policy promises_update
on public.promises for update
to authenticated
using (
  organization_id = public.get_my_organization_id()
  and (public.is_manager_or_owner() or assigned_to = auth.uid())
)
with check (organization_id = public.get_my_organization_id());

drop policy if exists promises_delete on public.promises;
create policy promises_delete
on public.promises for delete
to authenticated
using (organization_id = public.get_my_organization_id() and public.is_manager_or_owner());

-- Notes: org-scoped select; insert only when created_by=self and entity is assigned/owned (or manager/owner).
drop policy if exists notes_select_same_org on public.notes;
create policy notes_select_same_org
on public.notes for select
to authenticated
using (organization_id = public.get_my_organization_id());

drop policy if exists notes_insert_assigned on public.notes;
create policy notes_insert_assigned
on public.notes for insert
to authenticated
with check (
  organization_id = public.get_my_organization_id()
  and created_by = auth.uid()
  and (
    public.is_manager_or_owner()
    or (client_id is not null and exists (select 1 from public.clients c where c.id = notes.client_id and c.owner_id = auth.uid()))
    or (project_id is not null and exists (select 1 from public.projects p where p.id = notes.project_id and p.owner_id = auth.uid()))
    or (task_id is not null and exists (select 1 from public.tasks t where t.id = notes.task_id and t.assigned_to = auth.uid()))
    or (promise_id is not null and exists (select 1 from public.promises pr where pr.id = notes.promise_id and pr.assigned_to = auth.uid()))
  )
);

-- Activity log: managers/owners only for select (full export/report). Inserts allowed within org.
drop policy if exists activity_select_manager on public.activity_log;
create policy activity_select_manager
on public.activity_log for select
to authenticated
using (organization_id = public.get_my_organization_id() and public.is_manager_or_owner());

drop policy if exists activity_insert_same_org on public.activity_log;
create policy activity_insert_same_org
on public.activity_log for insert
to authenticated
with check (organization_id = public.get_my_organization_id());

-- Notifications: users can select/update their own notifications.
drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own
on public.notifications for select
to authenticated
using (organization_id = public.get_my_organization_id() and user_id = auth.uid());

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own
on public.notifications for update
to authenticated
using (organization_id = public.get_my_organization_id() and user_id = auth.uid())
with check (organization_id = public.get_my_organization_id() and user_id = auth.uid());

-- Invitations: only managers/owners can create/read/update within org.
drop policy if exists invitations_select_manager on public.invitations;
create policy invitations_select_manager
on public.invitations for select
to authenticated
using (organization_id = public.get_my_organization_id() and public.is_manager_or_owner());

drop policy if exists invitations_insert_manager on public.invitations;
create policy invitations_insert_manager
on public.invitations for insert
to authenticated
with check (organization_id = public.get_my_organization_id() and public.is_manager_or_owner());

drop policy if exists invitations_update_manager on public.invitations;
create policy invitations_update_manager
on public.invitations for update
to authenticated
using (organization_id = public.get_my_organization_id() and public.is_manager_or_owner())
with check (organization_id = public.get_my_organization_id() and public.is_manager_or_owner());

drop policy if exists invitations_delete_manager on public.invitations;
create policy invitations_delete_manager
on public.invitations for delete
to authenticated
using (organization_id = public.get_my_organization_id() and public.is_manager_or_owner());

-- ============================================================================
-- Indexes
-- ============================================================================

-- organization_id on all org-scoped tables
create index if not exists idx_profiles_organization_id on public.profiles (organization_id);
create index if not exists idx_clients_organization_id on public.clients (organization_id);
create index if not exists idx_projects_organization_id on public.projects (organization_id);
create index if not exists idx_tasks_organization_id on public.tasks (organization_id);
create index if not exists idx_promises_organization_id on public.promises (organization_id);
create index if not exists idx_notes_organization_id on public.notes (organization_id);
create index if not exists idx_activity_log_organization_id on public.activity_log (organization_id);
create index if not exists idx_notifications_organization_id on public.notifications (organization_id);
create index if not exists idx_invitations_organization_id on public.invitations (organization_id);

-- owner/assignment
create index if not exists idx_clients_owner_id on public.clients (owner_id);
create index if not exists idx_projects_owner_id on public.projects (owner_id);
create index if not exists idx_tasks_assigned_to on public.tasks (assigned_to);
create index if not exists idx_promises_assigned_to on public.promises (assigned_to);
create index if not exists idx_activity_log_assigned_to on public.activity_log (assigned_to);

-- due dates and activity timestamps
create index if not exists idx_tasks_due_at on public.tasks (due_at);
create index if not exists idx_promises_due_at on public.promises (due_at);
create index if not exists idx_activity_log_created_at on public.activity_log (created_at);

-- status where useful
create index if not exists idx_tasks_status on public.tasks (status);
create index if not exists idx_projects_status on public.projects (status);
create index if not exists idx_promises_status on public.promises (status);
