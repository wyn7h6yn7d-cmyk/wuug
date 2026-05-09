"use client";

import * as React from "react";
import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/permissions";
import { canAssignOwner } from "@/lib/permissions";
import { ClientFormModal, ConfirmModal, type ClientFormValues, type OwnerOption } from "@/components/clients/client-modals";

type ClientRow = {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  health: string | null;
  priority: string | null;
  note: string | null;
  next_step: string | null;
  next_step_due_at: string | null;
  owner_id: string | null;
  created_at: string;
};

function formatDue(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function statusToneFor(row: ClientRow): "green" | "violet" | "orange" | "neutral" {
  if (row.priority === "high") return "orange";
  if (row.status === "waiting") return "violet";
  if (row.health === "at_risk" || row.health === "needs_attention") return "orange";
  if (row.status === "active") return "green";
  return "neutral";
}

function statusLabelFor(row: ClientRow) {
  if (row.priority === "high") return "High priority";
  if (row.status === "waiting") return "Waiting";
  if (row.status === "paused") return "Paused";
  if (row.status === "closed") return "Closed";
  return "Active";
}

export function ClientsPageClient({
  initialClients,
  owners,
  role,
  profileId,
}: {
  initialClients: ClientRow[];
  owners: OwnerOption[];
  role: AppRole;
  profileId: string;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [clients, setClients] = React.useState<ClientRow[]>(initialClients);
  const [selectedId, setSelectedId] = React.useState<string | null>(initialClients[0]?.id ?? null);

  const selected = React.useMemo(
    () => clients.find((c) => c.id === selectedId) ?? null,
    [clients, selectedId],
  );

  const [busy, setBusy] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [confirmError, setConfirmError] = React.useState<string | null>(null);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const metrics = React.useMemo(() => {
    const active = clients.length;
    const needsResponse = clients.filter((c) => c.status === "waiting").length;
    const highPriority = clients.filter((c) => c.priority === "high").length;
    const noNextStep = clients.filter((c) => !c.next_step || c.next_step.trim().length === 0).length;
    return { active, needsResponse, highPriority, noNextStep };
  }, [clients]);

  const canManageOwner = canAssignOwner(role);

  const newDefaults: ClientFormValues = {
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    status: "active",
    health: "healthy",
    priority: "normal",
    owner_id: canManageOwner ? (owners[0]?.id ?? profileId) : profileId,
    note: "",
    next_step: "",
    next_step_due_date: "",
  };

  const editDefaults: ClientFormValues = selected
    ? {
        name: selected.name ?? "",
        contact_name: selected.contact_name ?? "",
        email: selected.email ?? "",
        phone: selected.phone ?? "",
        status: selected.status ?? "active",
        health: selected.health ?? "healthy",
        priority: selected.priority ?? "normal",
        owner_id: selected.owner_id ?? profileId,
        note: selected.note ?? "",
        next_step: selected.next_step ?? "",
        next_step_due_date: selected.next_step_due_at ? selected.next_step_due_at.slice(0, 10) : "",
      }
    : newDefaults;

  // Note: we keep a simple optimistic UI for now (no explicit refetch).

  async function logActivity(action: string, title: string, description?: string, clientId?: string) {
    await supabase.from("activity_log").insert({
      type: "client",
      title,
      description: description ?? null,
      entity_type: "client",
      entity_id: clientId ?? null,
      status: action,
      assigned_to: null,
      client_id: clientId ?? null,
    });
  }

  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <PageHeader title={role === "member" ? "My Clients" : "Clients"} subtitle="All clients, owners, and next steps in one clean view." />
          <GradientButton onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New client
          </GradientButton>
        </div>
      </FadeIn>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Active clients", value: String(metrics.active), tone: "blue" as const },
          { title: "Waiting for response", value: String(metrics.needsResponse), tone: "violet" as const },
          { title: "High priority", value: String(metrics.highPriority), tone: "orange" as const },
          { title: "No next step", value: String(metrics.noNextStep), tone: "neutral" as const },
        ].map((metric, index) => (
          <FadeIn key={metric.title} delay={0.04 * index}>
            <GlassCard className="space-y-2 p-5">
              <p className="text-sm text-slate-500">{metric.title}</p>
              <div className="inline-flex rounded-2xl bg-gradient-to-r px-4 py-2 text-lg font-semibold text-slate-700">
                {metric.value}
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <FadeIn delay={0.1}>
          <GlassCard className="p-5">
            {clients.length === 0 ? (
              <div className="rounded-[26px] border border-white/70 bg-white/55 p-6 text-sm text-slate-700 shadow-sm ring-1 ring-slate-900/[0.03]">
                No clients yet. Create your first one.
              </div>
            ) : (
              <div className="space-y-2">
                {clients.map((client) => {
                  const hasNext = Boolean(client.next_step && client.next_step.trim().length > 0);
                  const isActive = client.id === selectedId;
                  return (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => setSelectedId(client.id)}
                      className={
                        "w-full text-left rounded-2xl border border-white/70 bg-white/55 p-3 shadow-sm ring-1 ring-slate-900/[0.03] hover:bg-white/70 " +
                        "flex flex-col gap-3 lg:grid lg:gap-3 lg:grid-cols-[1.7fr_1.4fr_0.9fr_1.3fr_1fr] lg:items-center " +
                        (isActive ? "outline outline-2 outline-blue-200" : "hover:bg-white/70")
                      }
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">{client.name}</p>
                        {!hasNext ? <StatusBadge label="No next step" tone="orange" className="mt-2" /> : null}
                      </div>
                      <div className="min-w-0 text-sm text-slate-700">
                        <p className="truncate font-medium text-slate-900">{client.contact_name ?? "—"}</p>
                        <p className="truncate text-slate-600">{client.email ?? "—"}</p>
                      </div>
                      <div className="justify-self-start">
                        <StatusBadge label={statusLabelFor(client)} tone={statusToneFor(client)} />
                      </div>
                      <div className="text-sm text-slate-800">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 lg:hidden">
                          Next step
                        </span>
                        <div className="mt-1 lg:mt-0">{hasNext ? client.next_step : "—"}</div>
                      </div>
                      <div className="text-sm text-slate-700">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 lg:hidden">
                          Due
                        </span>
                        <div className="mt-1 lg:mt-0">{formatDue(client.next_step_due_at)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.15}>
          <GlassCard className="space-y-4 p-6">
            {selected ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(99,102,241,0.18)_0%,rgba(168,85,247,0.12)_45%,rgba(20,184,166,0.12)_100%)] text-sm font-semibold text-slate-800 ring-1 ring-white/70">
                      {initials(selected.name)}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{selected.name}</h3>
                      <StatusBadge label={statusLabelFor(selected)} tone={statusToneFor(selected)} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditOpen(true)}
                      className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
                      aria-label="Edit client"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteOpen(true)}
                      className="rounded-2xl border border-slate-200 bg-white p-2 text-rose-700 hover:bg-rose-50"
                      aria-label="Delete client"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm ring-1 ring-slate-900/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selected.contact_name ?? "—"}</p>
                  <p className="text-sm text-slate-600">{selected.email ?? "—"}</p>
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm ring-1 ring-slate-900/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next step</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selected.next_step ?? "—"}</p>
                  <p className="mt-1 text-xs text-slate-600">{formatDue(selected.next_step_due_at)}</p>
                </div>

                <button className="inline-flex w-full items-center justify-center gap-1 rounded-[22px] bg-[linear-gradient(90deg,rgba(99,102,241,1)_0%,rgba(168,85,247,1)_45%,rgba(20,184,166,1)_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(99,102,241,0.22)] hover:opacity-95 active:scale-[0.99]">
                  Open action <ChevronRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="text-sm text-slate-700">Select a client to see details.</div>
            )}
          </GlassCard>
        </FadeIn>
      </div>

      <ClientFormModal
        open={createOpen}
        title="New client"
        owners={owners}
        hideOwner={!canManageOwner}
        initialValues={newDefaults}
        submitLabel="Create"
        busy={busy}
        error={formError}
        onClose={() => {
          setFormError(null);
          setCreateOpen(false);
        }}
        onSubmit={async (values) => {
          setBusy(true);
          setFormError(null);
          try {
            const nextDue = values.next_step_due_date ? new Date(values.next_step_due_date).toISOString() : null;
            const { data, error } = await supabase
              .from("clients")
              .insert({
                name: values.name,
                contact_name: values.contact_name || null,
                email: values.email || null,
                phone: values.phone || null,
                status: values.status,
                health: values.health,
                priority: values.priority,
                note: values.note || null,
                next_step: values.next_step || null,
                next_step_due_at: nextDue,
                owner_id: (canManageOwner ? values.owner_id : profileId) || null,
              })
              .select(
                "id,name,contact_name,email,phone,status,health,priority,note,next_step,next_step_due_at,owner_id,created_at",
              )
              .single();

            if (error) {
              setFormError(error.message);
              return;
            }

            await logActivity("created", "Client created", values.name, data?.id);

            setCreateOpen(false);
            toast("Client created");
            setClients((prev) => [data as ClientRow, ...prev]);
            setSelectedId((data as ClientRow).id);
          } finally {
            setBusy(false);
          }
        }}
      />

      <ClientFormModal
        open={editOpen}
        title="Edit client"
        owners={owners}
        hideOwner={!canManageOwner}
        initialValues={editDefaults}
        submitLabel="Save"
        busy={busy}
        error={formError}
        onClose={() => {
          setFormError(null);
          setEditOpen(false);
        }}
        onSubmit={async (values) => {
          if (!selected) return;
          setBusy(true);
          setFormError(null);
          try {
            const nextDue = values.next_step_due_date ? new Date(values.next_step_due_date).toISOString() : null;
            const { data, error } = await supabase
              .from("clients")
              .update({
                name: values.name,
                contact_name: values.contact_name || null,
                email: values.email || null,
                phone: values.phone || null,
                status: values.status,
                health: values.health,
                priority: values.priority,
                note: values.note || null,
                next_step: values.next_step || null,
                next_step_due_at: nextDue,
                owner_id: (canManageOwner ? values.owner_id : selected.owner_id) || null,
              })
              .eq("id", selected.id)
              .select(
                "id,name,contact_name,email,phone,status,health,priority,note,next_step,next_step_due_at,owner_id,created_at",
              )
              .single();

            if (error) {
              setFormError(error.message);
              return;
            }

            await logActivity("updated", "Client updated", values.name, selected.id);

            setEditOpen(false);
            toast("Client updated");
            setClients((prev) => prev.map((c) => (c.id === selected.id ? (data as ClientRow) : c)));
          } finally {
            setBusy(false);
          }
        }}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete client"
        description="This will permanently delete the client. This action cannot be undone."
        confirmLabel="Delete"
        busy={busy}
        error={confirmError}
        onClose={() => {
          setConfirmError(null);
          setDeleteOpen(false);
        }}
        onConfirm={async () => {
          if (!selected) return;
          setBusy(true);
          setConfirmError(null);
          try {
            const { error } = await supabase.from("clients").delete().eq("id", selected.id);
            if (error) {
              setConfirmError(error.message);
              return;
            }
            await logActivity("deleted", "Client deleted", selected.name, selected.id);
            toast("Client deleted");
            setDeleteOpen(false);
            setClients((prev) => prev.filter((c) => c.id !== selected.id));
            setSelectedId((prev) => {
              if (prev !== selected.id) return prev;
              const remaining = clients.filter((c) => c.id !== selected.id);
              return remaining[0]?.id ?? null;
            });
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}

