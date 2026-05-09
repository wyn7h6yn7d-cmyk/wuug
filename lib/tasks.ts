import type { SupabaseClient } from "@supabase/supabase-js";

export type TaskStatus =
  | "planned"
  | "in_progress"
  | "waiting_on_client"
  | "done"
  | "snoozed";

export type TaskPriority = "low" | "medium" | "high";

export type TaskRow = {
  id: string;
  organization_id: string | null;
  client_id: string | null;
  project_id: string | null;
  title: string;
  status: TaskStatus | string | null;
  priority: TaskPriority | string | null;
  due_at: string | null;
  assigned_to: string | null;
  created_by: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TaskHydrated = TaskRow & {
  client?: { id: string; name: string } | null;
  project?: { id: string; name: string } | null;
  assignee?: { id: string; full_name: string; avatar_url: string | null } | null;
};

export type TaskFormInput = {
  title: string;
  client_id: string | null;
  project_id: string | null;
  assigned_to: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_at: string | null;
  notes: string;
};

export function isDone(task: Pick<TaskRow, "status">) {
  return task.status === "done";
}

export function priorityRank(priority: TaskRow["priority"]): number {
  switch (priority) {
    case "high":
      return 0;
    case "medium":
      return 1;
    case "low":
      return 2;
    default:
      return 3;
  }
}

export function dueRank(dueAtIso: string | null): number {
  if (!dueAtIso) return Number.POSITIVE_INFINITY;
  const t = Date.parse(dueAtIso);
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
}

export function sortTasksByPriorityAndDue(a: TaskRow, b: TaskRow) {
  const pr = priorityRank(a.priority) - priorityRank(b.priority);
  if (pr !== 0) return pr;
  const dr = dueRank(a.due_at) - dueRank(b.due_at);
  if (dr !== 0) return dr;
  return String(a.title).localeCompare(String(b.title));
}

export function isOverdue(task: Pick<TaskRow, "due_at" | "status">, now = new Date()) {
  if (task.status === "done") return false;
  if (!task.due_at) return false;
  const due = new Date(task.due_at);
  return Number.isFinite(due.getTime()) && due.getTime() < now.getTime();
}

export function isDueToday(task: Pick<TaskRow, "due_at" | "status">, now = new Date()) {
  if (task.status === "done") return false;
  if (!task.due_at) return false;
  const due = new Date(task.due_at);
  if (!Number.isFinite(due.getTime())) return false;
  const a = due.toISOString().slice(0, 10);
  const b = now.toISOString().slice(0, 10);
  return a === b;
}

export async function fetchTasks(supabase: SupabaseClient, opts?: { includeDone?: boolean }) {
  const includeDone = opts?.includeDone ?? false;

  const q = supabase
    .from("tasks")
    .select(
      `
      id,
      organization_id,
      client_id,
      project_id,
      title,
      status,
      priority,
      due_at,
      assigned_to,
      created_by,
      completed_at,
      notes,
      created_at,
      updated_at,
      client:clients(id,name),
      project:projects(id,name),
      assignee:profiles!tasks_assigned_to_fkey(id,full_name,avatar_url)
    `,
    );

  if (!includeDone) q.neq("status", "done");

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as TaskHydrated[];
}

export async function fetchTaskLookups(supabase: SupabaseClient) {
  const [{ data: clients, error: clientsError }, { data: projects, error: projectsError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      supabase.from("clients").select("id,name").order("name", { ascending: true }),
      supabase.from("projects").select("id,name,client_id").order("name", { ascending: true }),
      supabase.from("profiles").select("id,full_name,avatar_url,role").order("full_name", { ascending: true }),
    ]);

  if (clientsError) throw clientsError;
  if (projectsError) throw projectsError;
  if (profilesError) throw profilesError;

  return {
    clients: (clients ?? []) as { id: string; name: string }[],
    projects: (projects ?? []) as { id: string; name: string; client_id: string | null }[],
    profiles: (profiles ?? []) as { id: string; full_name: string; avatar_url: string | null; role: string }[],
  };
}

export async function insertTaskActivity(
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
    type: "task",
    entity_type: "task",
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

