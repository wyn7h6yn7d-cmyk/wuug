import type { SupabaseClient } from "@supabase/supabase-js";

export type PromiseRow = {
  id: string;
  organization_id: string | null;
  client_id: string;
  project_id: string | null;
  title: string;
  status: string | null;
  due_at: string | null;
  assigned_to: string | null;
  created_by: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type PromiseHydrated = PromiseRow & {
  client?: { id: string; name: string } | null;
  project?: { id: string; name: string } | null;
  assignee?: { id: string; full_name: string; avatar_url: string | null } | null;
};

export async function fetchPromises(supabase: SupabaseClient, opts?: { includeDone?: boolean }) {
  const includeDone = opts?.includeDone ?? false;

  const q = supabase
    .from("promises")
    .select(
      `
      id,
      organization_id,
      client_id,
      project_id,
      title,
      status,
      due_at,
      assigned_to,
      created_by,
      completed_at,
      notes,
      created_at,
      updated_at,
      client:clients(id,name),
      project:projects(id,name),
      assignee:profiles!promises_assigned_to_fkey(id,full_name,avatar_url)
    `,
    )
    .order("due_at", { ascending: true, nullsFirst: false });

  if (!includeDone) q.neq("status", "done");

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as PromiseHydrated[];
}

export async function fetchPromiseLookups(supabase: SupabaseClient) {
  const [{ data: clients, error: e1 }, { data: projects, error: e2 }, { data: profiles, error: e3 }] = await Promise.all([
    supabase.from("clients").select("id,name").order("name", { ascending: true }),
    supabase.from("projects").select("id,name,client_id").order("name", { ascending: true }),
    supabase.from("profiles").select("id,full_name,avatar_url,role").order("full_name", { ascending: true }),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  if (e3) throw e3;
  return {
    clients: (clients ?? []) as { id: string; name: string }[],
    projects: (projects ?? []) as { id: string; name: string; client_id: string | null }[],
    profiles: (profiles ?? []) as { id: string; full_name: string; avatar_url: string | null; role: string }[],
  };
}

export async function insertPromiseActivity(
  supabase: SupabaseClient,
  input: {
    organization_id: string;
    title: string;
    entity_id?: string;
    client_id?: string | null;
    project_id?: string | null;
    assigned_to?: string | null;
    created_by?: string | null;
    status?: string | null;
    completed_at?: string | null;
    description?: string | null;
  },
) {
  const { error } = await supabase.from("activity_log").insert({
    organization_id: input.organization_id,
    type: "promise",
    entity_type: "promise",
    entity_id: input.entity_id ?? null,
    title: input.title,
    description: input.description ?? null,
    client_id: input.client_id ?? null,
    project_id: input.project_id ?? null,
    assigned_to: input.assigned_to ?? null,
    created_by: input.created_by ?? null,
    status: input.status ?? null,
    completed_at: input.completed_at ?? null,
  });

  if (error) throw error;
}
