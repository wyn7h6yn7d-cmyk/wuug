"use client";

import * as React from "react";
import { Check, Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { ConfirmModal } from "@/components/clients/client-modals";
import { toast } from "@/components/ui/toast";
import { insertTaskActivity, sortTasksByPriorityAndDue, type TaskHydrated } from "@/lib/tasks";

type AppRole = "owner" | "manager" | "member";

export type TaskLookups = {
  clients: { id: string; name: string }[];
  projects: { id: string; name: string; client_id: string | null }[];
  profiles: { id: string; full_name: string; role: string }[];
};

type TaskFormValues = {
  title: string;
  client_id: string;
  project_id: string;
  assigned_to: string;
  status: string;
  priority: string;
  due_at: string;
  notes: string;
};

function toDatetimeLocal(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(s: string) {
  if (!s) return null;
  const d = new Date(s);
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none";

function TaskModal({
  open,
  title,
  submitLabel,
  lookups,
  initialValues,
  busy,
  error,
  hideAssignee,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  submitLabel: string;
  lookups: TaskLookups;
  initialValues: TaskFormValues;
  busy: boolean;
  error: string | null;
  hideAssignee: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
}) {
  const [values, setValues] = React.useState<TaskFormValues>(initialValues);

  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => setValues(initialValues), 0);
    return () => window.clearTimeout(id);
  }, [initialValues, open]);

  const set =
    (key: keyof TaskFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
    };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] border border-[#E5EAF3] bg-white p-6 shadow-[0_18px_44px_rgba(66,86,122,0.18)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
            disabled={busy}
          >
            Close
          </button>
        </div>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values);
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Title</span>
            <input value={values.title} onChange={set("title")} className={inputClass} required placeholder="What needs doing?" />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Client</span>
              <select value={values.client_id} onChange={set("client_id")} className={inputClass}>
                <option value="">None</option>
                {lookups.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Project</span>
              <select value={values.project_id} onChange={set("project_id")} className={inputClass}>
                <option value="">None</option>
                {lookups.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {hideAssignee ? null : (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Assignee</span>
              <select value={values.assigned_to} onChange={set("assigned_to")} className={inputClass}>
                <option value="">Unassigned</option>
                {lookups.profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} {p.role ? `• ${p.role}` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Status</span>
              <select value={values.status} onChange={set("status")} className={inputClass}>
                <option value="planned">Planned</option>
                <option value="in_progress">In progress</option>
                <option value="waiting_on_client">Waiting on client</option>
                <option value="snoozed">Snoozed</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Priority</span>
              <select value={values.priority} onChange={set("priority")} className={inputClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Due</span>
              <input type="datetime-local" value={values.due_at} onChange={set("due_at")} className={inputClass} />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Notes</span>
            <textarea value={values.notes} onChange={set("notes")} className={inputClass} rows={3} />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              disabled={busy}
            >
              {busy ? "Saving…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TasksPageClient({
  initialTasks,
  role,
  profileId,
  organizationId,
  lookups,
}: {
  initialTasks: TaskHydrated[];
  role: AppRole;
  profileId: string;
  organizationId: string;
  lookups: TaskLookups;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const canManage = role !== "member";

  const [tasks, setTasks] = React.useState<TaskHydrated[]>(() =>
    [...initialTasks].sort(sortTasksByPriorityAndDue),
  );
  const [selectedId, setSelectedId] = React.useState<string>(initialTasks[0]?.id ?? "");

  const selected = React.useMemo(() => tasks.find((t) => t.id === selectedId) ?? null, [tasks, selectedId]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create");
  const [modalBusy, setModalBusy] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteBusy, setDeleteBusy] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const [showDone, setShowDone] = React.useState(false);

  const visibleTasks = React.useMemo(
    () => (showDone ? tasks : tasks.filter((t) => t.status !== "done")),
    [showDone, tasks],
  );

  const baseInitial: TaskFormValues =
    modalMode === "edit" && selected
      ? {
          title: selected.title ?? "",
          client_id: selected.client_id ?? "",
          project_id: selected.project_id ?? "",
          assigned_to: selected.assigned_to ?? "",
          status: (selected.status as string) ?? "planned",
          priority: (selected.priority as string) ?? "medium",
          due_at: toDatetimeLocal(selected.due_at),
          notes: selected.notes ?? "",
        }
      : {
          title: "",
          client_id: "",
          project_id: "",
          assigned_to: canManage ? "" : profileId,
          status: "planned",
          priority: "medium",
          due_at: "",
          notes: "",
        };

  async function logTask(title: string, row: TaskHydrated, extra?: { completed_at?: string | null }) {
    await insertTaskActivity(supabase, {
      organization_id: organizationId,
      title,
      entity_id: row.id,
      client_id: row.client_id,
      project_id: row.project_id,
      assigned_to: row.assigned_to,
      created_by: profileId,
      status: row.status,
      completed_at: extra?.completed_at ?? row.completed_at ?? null,
    });
  }

  const submit = async (values: TaskFormValues) => {
    setModalBusy(true);
    setModalError(null);
    try {
      const clientId = values.client_id || null;
      const projectId = values.project_id || null;
      const assignedTo = canManage ? values.assigned_to || null : profileId;
      const dueAt = fromDatetimeLocal(values.due_at);
      const completedAt = values.status === "done" ? new Date().toISOString() : null;

      if (modalMode === "create") {
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            organization_id: organizationId,
            client_id: clientId,
            project_id: projectId,
            title: values.title,
            status: values.status,
            priority: values.priority,
            due_at: dueAt,
            assigned_to: assignedTo,
            created_by: profileId,
            completed_at: completedAt,
            notes: values.notes || null,
          })
          .select(
            `id,organization_id,client_id,project_id,title,status,priority,due_at,assigned_to,created_by,completed_at,notes,created_at,updated_at,client:clients(id,name),project:projects(id,name),assignee:profiles!tasks_assigned_to_fkey(id,full_name,avatar_url)`,
          )
          .single();

        if (error) throw error;
        const row = data as unknown as TaskHydrated;
        setTasks((prev) => [...prev, row].sort(sortTasksByPriorityAndDue));
        setSelectedId(row.id);
        await logTask(`Created task: ${row.title}`, row);
        toast("Task created");
      } else if (selected) {
        const { data, error } = await supabase
          .from("tasks")
          .update({
            client_id: clientId,
            project_id: projectId,
            title: values.title,
            status: values.status,
            priority: values.priority,
            due_at: dueAt,
            assigned_to: assignedTo,
            completed_at: completedAt,
            notes: values.notes || null,
          })
          .eq("id", selected.id)
          .select(
            `id,organization_id,client_id,project_id,title,status,priority,due_at,assigned_to,created_by,completed_at,notes,created_at,updated_at,client:clients(id,name),project:projects(id,name),assignee:profiles!tasks_assigned_to_fkey(id,full_name,avatar_url)`,
          )
          .single();

        if (error) throw error;
        const row = data as unknown as TaskHydrated;
        setTasks((prev) => prev.map((t) => (t.id === row.id ? row : t)).sort(sortTasksByPriorityAndDue));
        await logTask(`Updated task: ${row.title}`, row);
        toast("Task updated");
      }

      setModalOpen(false);
    } catch (e) {
      setModalError(e instanceof Error ? e.message : "Could not save task");
    } finally {
      setModalBusy(false);
    }
  };

  const markDone = async (row: TaskHydrated) => {
    try {
      const completedAt = new Date().toISOString();
      const { data, error } = await supabase
        .from("tasks")
        .update({ status: "done", completed_at: completedAt })
        .eq("id", row.id)
        .select(
          `id,organization_id,client_id,project_id,title,status,priority,due_at,assigned_to,created_by,completed_at,notes,created_at,updated_at,client:clients(id,name),project:projects(id,name),assignee:profiles!tasks_assigned_to_fkey(id,full_name,avatar_url)`,
        )
        .single();
      if (error) throw error;
      const updated = data as unknown as TaskHydrated;
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      await logTask(`Completed task: ${updated.title}`, updated, { completed_at: completedAt });
      toast("Marked done");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update");
    }
  };

  const confirmDelete = async () => {
    if (!selected || !canManage) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", selected.id);
      if (error) throw error;
      const name = selected.title;
      const id = selected.id;
      let nextFirst = "";
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== id);
        nextFirst = next[0]?.id ?? "";
        return next;
      });
      setSelectedId((sid) => (sid === id ? nextFirst : sid));
      await insertTaskActivity(supabase, {
        organization_id: organizationId,
        title: `Deleted task: ${name}`,
        entity_id: id,
        client_id: selected.client_id,
        project_id: selected.project_id,
        assigned_to: selected.assigned_to,
        created_by: profileId,
      });
      toast("Task deleted");
      setDeleteOpen(false);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <PageHeader
            title="Tasks"
            subtitle={canManage ? "All tasks in your workspace." : "Tasks assigned to you."}
          />
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
              Show done
            </label>
            <button
              type="button"
              onClick={() => {
                setModalMode("create");
                setModalError(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              New task
            </button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
          <SurfaceCard className="p-4">
            <div className="text-sm font-semibold text-slate-900">List</div>
            <div className="mt-3 max-h-[min(70vh,560px)] space-y-2 overflow-y-auto">
              {visibleTasks.length === 0 ? (
                <p className="text-sm text-slate-600">No tasks yet. Create one above.</p>
              ) : (
                visibleTasks.map((t) => {
                  const active = t.id === selectedId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      className={[
                        "w-full rounded-2xl border px-3 py-3 text-left text-sm transition",
                        active ? "border-slate-300 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="font-medium text-slate-900">{t.title}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {(t.status ?? "").replaceAll("_", " ")} · {t.priority ?? "medium"}
                        {t.assignee?.full_name ? ` · ${t.assignee.full_name}` : ""}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            {selected ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{selected.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {selected.client?.name ? `${selected.client.name}` : "No client"}
                      {selected.project?.name ? ` · ${selected.project.name}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selected.status !== "done" ? (
                      <button
                        type="button"
                        onClick={() => void markDone(selected)}
                        className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                      >
                        <Check className="h-4 w-4" />
                        Done
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setModalMode("edit");
                        setModalError(null);
                        setModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    {canManage ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError(null);
                          setDeleteOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
                {selected.notes ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
                    {selected.notes}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-slate-600">Select a task.</p>
            )}
          </SurfaceCard>
        </div>
      </FadeIn>

      <TaskModal
        open={modalOpen}
        title={modalMode === "create" ? "New task" : "Edit task"}
        submitLabel={modalMode === "create" ? "Create" : "Save"}
        lookups={lookups}
        initialValues={baseInitial}
        busy={modalBusy}
        error={modalError}
        hideAssignee={!canManage}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete task"
        description={`Delete “${selected?.title ?? "this task"}”?`}
        confirmLabel="Delete"
        busy={deleteBusy}
        error={deleteError}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
