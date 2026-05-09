"use client";

import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { ConfirmModal } from "@/components/clients/client-modals";
import { toast } from "@/components/ui/toast";

type AppRole = "owner" | "manager" | "member";

export type ProjectRow = {
  id: string;
  client_id: string | null;
  name: string;
  status: string | null;
  progress: number | null;
  deadline: string | null;
  next_step: string | null;
  next_step_due_at: string | null;
  risk_reason: string | null;
  owner_id: string | null;
  created_at: string | null;
};

export type ProjectLookup = {
  clients: { id: string; name: string }[];
  owners: { id: string; label: string }[];
};

type ProjectFormValues = {
  name: string;
  client_id: string;
  owner_id: string;
  status: string;
  progress: string;
  deadline: string;
  next_step: string;
  next_step_due_date: string;
  risk_reason: string;
};

function isoDateToInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function inputDateToTimestamptz(dateStr: string) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T12:00:00.000Z`);
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none";

function ProjectModal({
  open,
  title,
  submitLabel,
  lookups,
  initialValues,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  submitLabel: string;
  lookups: ProjectLookup;
  initialValues: ProjectFormValues;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void | Promise<void>;
}) {
  const [values, setValues] = React.useState<ProjectFormValues>(initialValues);

  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => setValues(initialValues), 0);
    return () => window.clearTimeout(id);
  }, [initialValues, open]);

  const set =
    (key: keyof ProjectFormValues) =>
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
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
            type="button"
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
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Project name</span>
              <input value={values.name} onChange={set("name")} className={inputClass} placeholder="e.g. Website refresh" required />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Client</span>
              <select value={values.client_id} onChange={set("client_id")} className={inputClass}>
                <option value="">No client</option>
                {lookups.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Status</span>
              <select value={values.status} onChange={set("status")} className={inputClass}>
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="waiting_on_client">Waiting on client</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Progress</span>
              <input value={values.progress} onChange={set("progress")} className={inputClass} placeholder="0-100" inputMode="numeric" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Deadline</span>
              <input value={values.deadline} onChange={set("deadline")} className={inputClass} type="date" />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Owner</span>
            <select value={values.owner_id} onChange={set("owner_id")} className={inputClass}>
              <option value="">Unassigned</option>
              {lookups.owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Next step</span>
              <input value={values.next_step} onChange={set("next_step")} className={inputClass} placeholder="e.g. Send estimate" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Next step due date</span>
              <input value={values.next_step_due_date} onChange={set("next_step_due_date")} className={inputClass} type="date" />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Risk reason</span>
            <textarea
              value={values.risk_reason}
              onChange={set("risk_reason")}
              className={inputClass}
              placeholder="What could block this project?"
              rows={3}
            />
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
              {busy ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProjectsPageClient({
  initialProjects,
  role,
  profileId,
  organizationId,
  lookups,
}: {
  initialProjects: ProjectRow[];
  role: AppRole;
  profileId: string;
  organizationId: string;
  lookups: ProjectLookup;
}) {
  const supabase = React.useMemo(() => createClient(), []);

  const [projects, setProjects] = React.useState<ProjectRow[]>(initialProjects);
  const [selectedId, setSelectedId] = React.useState<string>(initialProjects[0]?.id ?? "");

  const selected = React.useMemo(() => projects.find((p) => p.id === selectedId) ?? null, [projects, selectedId]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create");
  const [modalBusy, setModalBusy] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteBusy, setDeleteBusy] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const canManage = role !== "member";

  const openCreate = () => {
    setModalMode("create");
    setModalError(null);
    setModalOpen(true);
  };

  const openEdit = () => {
    if (!selected) return;
    setModalMode("edit");
    setModalError(null);
    setModalOpen(true);
  };

  const baseInitial: ProjectFormValues =
    modalMode === "edit" && selected
      ? {
          name: selected.name ?? "",
          client_id: selected.client_id ?? "",
          owner_id: selected.owner_id ?? "",
          status: selected.status ?? "not_started",
          progress: selected.progress == null ? "" : String(selected.progress),
          deadline: selected.deadline ?? "",
          next_step: selected.next_step ?? "",
          next_step_due_date: isoDateToInput(selected.next_step_due_at),
          risk_reason: selected.risk_reason ?? "",
        }
      : {
          name: "",
          client_id: "",
          owner_id: profileId,
          status: "not_started",
          progress: "0",
          deadline: "",
          next_step: "",
          next_step_due_date: "",
          risk_reason: "",
        };

  async function writeActivity(input: { title: string; entity_id?: string; project_id?: string; client_id?: string | null; status?: string | null }) {
    await supabase.from("activity_log").insert({
      organization_id: organizationId,
      type: "project",
      entity_type: "project",
      entity_id: input.entity_id ?? null,
      title: input.title,
      description: null,
      client_id: input.client_id ?? null,
      project_id: input.project_id ?? null,
      assigned_to: null,
      created_by: profileId,
      status: input.status ?? null,
      completed_at: null,
    });
  }

  const submit = async (values: ProjectFormValues) => {
    setModalBusy(true);
    setModalError(null);
    try {
      const progressNum = values.progress.trim() === "" ? null : Math.max(0, Math.min(100, Number(values.progress)));
      const nextStepDueAt = inputDateToTimestamptz(values.next_step_due_date);
      const clientId = values.client_id || null;
      const ownerId = values.owner_id || null;

      if (modalMode === "create") {
        const { data, error } = await supabase
          .from("projects")
          .insert({
            organization_id: organizationId,
            client_id: clientId,
            name: values.name,
            status: values.status,
            progress: Number.isFinite(progressNum as number) ? (progressNum as number) : null,
            deadline: values.deadline || null,
            next_step: values.next_step || null,
            next_step_due_at: nextStepDueAt,
            risk_reason: values.risk_reason || null,
            owner_id: ownerId,
            created_by: profileId,
          })
          .select("id,client_id,name,status,progress,deadline,next_step,next_step_due_at,risk_reason,owner_id,created_at")
          .single();

        if (error) throw error;
        const row = data as unknown as ProjectRow;
        setProjects((prev) => [row, ...prev]);
        setSelectedId(row.id);
        await writeActivity({ title: `Created project: ${row.name}`, entity_id: row.id, project_id: row.id, client_id: row.client_id, status: row.status });
        toast("Project created");
      } else if (selected) {
        const { data, error } = await supabase
          .from("projects")
          .update({
            client_id: clientId,
            name: values.name,
            status: values.status,
            progress: Number.isFinite(progressNum as number) ? (progressNum as number) : null,
            deadline: values.deadline || null,
            next_step: values.next_step || null,
            next_step_due_at: nextStepDueAt,
            risk_reason: values.risk_reason || null,
            owner_id: ownerId,
          })
          .eq("id", selected.id)
          .select("id,client_id,name,status,progress,deadline,next_step,next_step_due_at,risk_reason,owner_id,created_at")
          .single();

        if (error) throw error;
        const row = data as unknown as ProjectRow;
        setProjects((prev) => prev.map((p) => (p.id === row.id ? row : p)));
        await writeActivity({ title: `Updated project: ${row.name}`, entity_id: row.id, project_id: row.id, client_id: row.client_id, status: row.status });
        toast("Project updated");
      }

      setModalOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save project";
      setModalError(msg);
    } finally {
      setModalBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      const { error } = await supabase.from("projects").delete().eq("id", selected.id);
      if (error) throw error;

      const deletedId = selected.id;
      const deletedName = selected.name;
      setProjects((prev) => prev.filter((p) => p.id !== deletedId));
      setSelectedId((prev) => {
        if (prev !== deletedId) return prev;
        const next = projects.find((p) => p.id !== deletedId)?.id ?? "";
        return next;
      });

      await writeActivity({ title: `Deleted project: ${deletedName}`, entity_id: deletedId, project_id: deletedId, client_id: selected.client_id, status: null });
      toast("Project deleted");
      setDeleteOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete project";
      setDeleteError(msg);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <PageHeader title="Projects" subtitle="Create, track, and update status in one place." />
          <div className="flex items-center gap-2">
            {canManage ? (
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                New project
              </button>
            ) : null}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
          <SurfaceCard className="p-4">
            <div className="text-sm font-semibold text-slate-900">All projects</div>
            <div className="mt-3 space-y-2">
              {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
                  No projects yet.
                </div>
              ) : (
                projects.map((p) => {
                  const active = p.id === selectedId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      className={[
                        "w-full rounded-2xl border px-4 py-3 text-left transition",
                        active ? "border-slate-300 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">{p.name}</div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            {(p.status ?? "not_started").replaceAll("_", " ")} • {p.progress ?? 0}%
                          </div>
                        </div>
                        <div className="text-xs font-medium text-slate-500">{p.deadline ?? ""}</div>
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
                    <div className="text-lg font-semibold text-slate-900">{selected.name}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Status: {(selected.status ?? "not_started").replaceAll("_", " ")} • Progress: {selected.progress ?? 0}%
                    </div>
                  </div>
                  {canManage ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={openEdit}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError(null);
                          setDeleteOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold text-slate-500">Next step</div>
                    <div className="mt-1 text-sm text-slate-900">{selected.next_step ?? "—"}</div>
                    <div className="mt-1 text-xs text-slate-500">Due: {isoDateToInput(selected.next_step_due_at) || "—"}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold text-slate-500">Risk</div>
                    <div className="mt-1 text-sm text-slate-900">{selected.risk_reason ?? "—"}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-600">Select a project.</div>
            )}
          </SurfaceCard>
        </div>
      </FadeIn>

      <ProjectModal
        open={modalOpen}
        title={modalMode === "create" ? "New project" : "Edit project"}
        submitLabel={modalMode === "create" ? "Create" : "Save"}
        lookups={lookups}
        initialValues={baseInitial}
        busy={modalBusy}
        error={modalError}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete project"
        description={`Delete “${selected?.name ?? "this project"}”? This can’t be undone.`}
        confirmLabel="Delete"
        busy={deleteBusy}
        error={deleteError}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

