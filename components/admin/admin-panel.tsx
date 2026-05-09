"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, CreditCard, ShieldCheck, UserRound } from "lucide-react";
import { GlassCard } from "@/components/command-center/glass-card";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "@/components/ui/toast";
import {
  adminDeleteInvitationAction,
  adminSetBanAction,
  adminSetPlatformAdminAction,
  adminUpdateOrgSubscriptionAction,
  adminUpdateUserRoleAction,
  bootstrapWorkspaceIfMissingAction,
} from "@/app/admin/actions";
import { isMasterAdminEmail } from "@/lib/master-admin";

export type AdminProfileRow = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  organization_id: string | null;
  organization_name: string | null;
  platform_admin: boolean;
  banned_at: string | null;
  ban_reason: string | null;
  subscription_status: string | null;
  subscription_ends_at: string | null;
  invoice_paid_at: string | null;
  created_at: string | null;
};

export type AdminOrgRow = {
  id: string;
  name: string;
  subscription_status: string;
  subscription_ends_at: string | null;
  invoice_paid_at: string | null;
  subscription_activated_at: string | null;
  access_paused: boolean;
  member_count: number;
};

export type AdminInviteRow = {
  id: string;
  organization_id: string;
  organization_name: string;
  email: string;
  role: string;
  created_at: string | null;
  expires_at: string | null;
  accepted_at: string | null;
};

type Tab = "users" | "workspaces" | "invitations";

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function subscriptionStatusClass(status: string | null | undefined): string {
  switch (status) {
    case "active":
      return "border-emerald-500/35 bg-emerald-500/[0.12] text-emerald-800 dark:text-emerald-200";
    case "trial":
      return "border-amber-500/35 bg-amber-500/[0.12] text-amber-900 dark:text-amber-200";
    case "past_due":
      return "border-orange-500/35 bg-orange-500/[0.12] text-orange-900 dark:text-orange-200";
    case "expired":
    case "suspended":
      return "border-rose-500/35 bg-rose-500/[0.12] text-rose-800 dark:text-rose-200";
    default:
      return "border-token-soft bg-surface/60 text-fg-muted";
  }
}

export function AdminPanel({
  signedInUserId,
  signedInEmail,
  profiles,
  organizations,
  invitations,
  loadError,
  showWorkspaceBootstrap,
  sessionDiagnostic,
  sessionDiagnosticError,
}: {
  signedInUserId: string;
  signedInEmail: string;
  profiles: AdminProfileRow[];
  organizations: AdminOrgRow[];
  invitations: AdminInviteRow[];
  loadError: string | null;
  /** True when all admin RPCs returned empty — usually no org/profile rows yet (empty public schema). */
  showWorkspaceBootstrap: boolean;
  sessionDiagnostic: Record<string, unknown> | null;
  sessionDiagnosticError: string | null;
}) {
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>("users");

  const profilesOrdered = React.useMemo(() => {
    const mine = profiles.filter((p) => p.id === signedInUserId);
    const rest = profiles.filter((p) => p.id !== signedInUserId);
    return [...mine, ...rest];
  }, [profiles, signedInUserId]);

  async function runAction(fn: (fd: FormData) => Promise<void>, fd: FormData) {
    try {
      await fn(fd);
      toast("Saved.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Platform admin"
        subtitle="Users, billing, subscriptions, and access. The master account (kennethalto95@gmail.com) is always owner and platform admin and cannot be demoted, stripped of admin, or banned. Other admins cannot change that."
      />

      <GlassCard className="flex flex-col gap-1 border border-[rgb(var(--accent)/0.25)] bg-[rgb(var(--accent)/0.08)] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Your session</p>
          <p className="mt-1 text-sm font-medium text-fg">{signedInEmail || "—"}</p>
        </div>
        <p className="text-xs text-fg-soft">
          This is the account you are signed in with. Your row is listed first on the Users tab when it appears in the
          directory.
        </p>
      </GlassCard>

      {loadError ? (
        <GlassCard className="border border-orange-500/40 bg-orange-500/10 p-4">
          <p className="text-sm font-semibold text-fg">Could not load admin data</p>
          <p className="mt-1 text-sm text-fg-soft">{loadError}</p>
          <p className="mt-2 text-xs text-fg-soft">
            Apply the SQL migration in <code className="rounded bg-surface/80 px-1">supabase/migrations/</code> for
            platform admin RPCs and columns.
          </p>
        </GlassCard>
      ) : null}

      {sessionDiagnosticError ? (
        <GlassCard className="border border-rose-500/35 bg-rose-500/10 p-4">
          <p className="text-sm font-semibold text-fg">Session diagnostic unavailable</p>
          <p className="mt-1 text-xs text-fg-soft">{sessionDiagnosticError}</p>
          <p className="mt-2 text-xs text-fg-soft">
            Run <code className="rounded bg-surface/80 px-1">20260209200000_platform_admin_request_user_id.sql</code> on
            your Supabase project (adds <code className="rounded bg-surface/80 px-1">admin_session_diagnostic</code>),
            then refresh.
          </p>
        </GlassCard>
      ) : null}

      {showWorkspaceBootstrap ? (
        <GlassCard className="border border-emerald-500/35 bg-emerald-500/10 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-fg">Create your first workspace</h2>
          <p className="mt-1 text-sm text-fg-soft">
            Admin lists are empty because <code className="rounded bg-surface/80 px-1">public.profiles</code> and{" "}
            <code className="rounded bg-surface/80 px-1">public.organizations</code> have no rows yet (only{" "}
            <code className="rounded bg-surface/80 px-1">auth.users</code>). That is not a git or migration problem — you
            still need the first workspace. Submit once (same RPC as signup); then this page will show data.
          </p>
          <form
            className="mt-4 flex max-w-lg flex-col gap-3"
            action={async (fd) => {
              try {
                await bootstrapWorkspaceIfMissingAction(fd);
                toast("Workspace created.");
                router.refresh();
              } catch (e) {
                toast(e instanceof Error ? e.message : "Something went wrong.");
              }
            }}
          >
            <label className="text-xs font-medium text-fg-muted">
              Company / workspace name
              <input
                name="organization_name"
                placeholder="e.g. KG Wuug OÜ"
                className="mt-1 w-full rounded-xl border border-token-soft bg-surface/80 px-3 py-2 text-sm text-fg"
              />
            </label>
            <label className="text-xs font-medium text-fg-muted">
              Your name
              <input
                name="full_name"
                placeholder="Full name"
                className="mt-1 w-full rounded-xl border border-token-soft bg-surface/80 px-3 py-2 text-sm text-fg"
              />
            </label>
            <button
              type="submit"
              className="w-fit rounded-2xl bg-[rgb(var(--accent))] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Create workspace and profile
            </button>
          </form>
        </GlassCard>
      ) : null}

      {sessionDiagnostic ? (
        <GlassCard className="border border-token-soft bg-surface/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Server diagnostic</p>
          <p className="mt-1 text-xs text-fg-soft">
            From your live session (not the SQL editor).{" "}
            <span className="font-medium text-fg">is_platform_admin</span> must be true for lists to load. If{" "}
            <span className="font-medium text-fg">auth_uid</span> is null but{" "}
            <span className="font-medium text-fg">request_user_id</span> is set, this migration fixed that gap.
          </p>
          <pre className="mt-3 max-h-48 overflow-auto rounded-xl border border-token-soft bg-surface/80 p-3 text-[11px] leading-relaxed text-fg-soft">
            {JSON.stringify(sessionDiagnostic, null, 2)}
          </pre>
        </GlassCard>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["users", "Users"],
            ["workspaces", "Workspaces"],
            ["invitations", "Invitations"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              tab === id
                ? "border-[rgb(var(--accent)/0.45)] bg-[rgb(var(--accent)/0.14)] text-fg"
                : "border-token-soft bg-surface/70 text-fg-soft hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "users" ? (
        <GlassCard className="p-5 md:p-8" solid>
          <div className="relative">
            <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full bg-[rgb(var(--accent)/0.12)] blur-3xl" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-muted">Directory</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-fg md:text-2xl">Registered users</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-soft">
                Promote to manager only when the workspace has an invoice on file and an active subscription window—or use{" "}
                <span className="font-medium text-fg">force</span> to override.
              </p>
            </div>
          </div>

          {!loadError && profiles.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4">
              <p className="text-sm font-semibold text-fg">No rows returned</p>
              <p className="mt-1 text-sm text-fg-soft">
                {showWorkspaceBootstrap ? (
                  <>
                    There are no rows in <code className="rounded bg-surface/80 px-1">public.profiles</code> yet. Use the
                    green <span className="font-medium text-fg">Create your first workspace</span> section above —{" "}
                    <span className="font-medium text-fg">commit/push does not insert database rows</span>.
                  </>
                ) : (
                  <>
                    Admin RPCs only return data when <code className="rounded bg-surface/80 px-1">is_platform_admin()</code>{" "}
                    is true for your session. If the <span className="font-medium text-fg">Server diagnostic</span> shows{" "}
                    <code className="rounded bg-surface/80 px-1">is_platform_admin: false</code>, apply migrations through{" "}
                    <code className="rounded bg-surface/80 px-1">20260209200000_platform_admin_request_user_id.sql</code> on
                    Supabase and refresh.
                  </>
                )}
              </p>
            </div>
          ) : null}

          <div className="mt-8 space-y-5">
            {profilesOrdered.map((p) => {
              const master = isMasterAdminEmail(p.email);
              const isYou = p.id === signedInUserId;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "relative overflow-hidden rounded-[22px] border bg-surface/50 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition dark:bg-[rgb(var(--surface-strong)/0.45)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
                    "border-token-soft",
                    isYou &&
                      "border-[rgb(var(--accent)/0.4)] shadow-[0_12px_40px_rgb(var(--accent)/0.12)] ring-1 ring-[rgb(var(--accent)/0.2)]",
                  )}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent)/0.35)] to-transparent opacity-80" />

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div
                        className={cn(
                          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-bold tracking-tight text-fg shadow-inner",
                          "bg-gradient-to-br from-[rgb(var(--accent)/0.35)] via-[rgb(var(--accent-2)/0.22)] to-[rgb(var(--accent-3)/0.2)]",
                          "ring-1 ring-white/20 dark:ring-white/10",
                        )}
                        aria-hidden
                      >
                        {initialsFromName(p.full_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 gap-y-1">
                          <h3 className="text-base font-semibold tracking-tight text-fg md:text-lg">{p.full_name}</h3>
                          {isYou ? (
                            <span className="rounded-full bg-[rgb(var(--accent)/0.2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fg ring-1 ring-[rgb(var(--accent)/0.25)]">
                              You
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1 rounded-full border border-token-soft bg-surface/70 px-2.5 py-0.5 text-[11px] font-medium capitalize text-fg-soft">
                            <UserRound className="h-3 w-3 opacity-70" strokeWidth={2} />
                            {p.role}
                          </span>
                          {master ? (
                            <span className="rounded-full border border-violet-400/35 bg-violet-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-violet-200">
                              Master admin
                            </span>
                          ) : null}
                          {p.platform_admin && !master ? (
                            <span className="rounded-full border border-amber-500/35 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200">
                              Admin
                            </span>
                          ) : null}
                          {p.banned_at ? (
                            <span className="rounded-full border border-rose-500/40 bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300">
                              Banned
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1.5 truncate text-sm text-fg-soft">{p.email}</p>
                      </div>
                    </div>

                    <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col lg:gap-3">
                      <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-2xl border border-token-soft/80 bg-surface/40 p-4 dark:bg-[rgb(var(--surface)/0.5)]">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                          <Building2 className="h-3.5 w-3.5" strokeWidth={2} />
                          Workspace
                        </div>
                        <p className="text-sm font-medium text-fg">{p.organization_name ?? "—"}</p>
                      </div>
                      <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-2xl border border-token-soft/80 bg-surface/40 p-4 dark:bg-[rgb(var(--surface)/0.5)]">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                          <CreditCard className="h-3.5 w-3.5" strokeWidth={2} />
                          Billing
                        </div>
                        <span
                          className={cn(
                            "w-fit rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                            subscriptionStatusClass(p.subscription_status),
                          )}
                        >
                          {p.subscription_status ?? "—"}
                        </span>
                        <dl className="mt-1 space-y-1 text-xs text-fg-soft">
                          <div className="flex justify-between gap-4">
                            <dt className="text-fg-muted">Ends</dt>
                            <dd className="text-right font-medium text-fg">
                              {p.subscription_ends_at ? new Date(p.subscription_ends_at).toLocaleString() : "—"}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-fg-muted">Paid</dt>
                            <dd className="text-right font-medium text-fg">
                              {p.invoice_paid_at ? new Date(p.invoice_paid_at).toLocaleString() : "—"}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 lg:max-w-md">
                      {master ? (
                        <div className="flex gap-3 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/15 to-[rgb(var(--accent)/0.08)] p-4 ring-1 ring-violet-400/10">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/25 text-violet-200">
                            <ShieldCheck className="h-5 w-5" strokeWidth={2} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-fg">Protected master account</p>
                            <p className="mt-1 text-xs leading-relaxed text-fg-soft">
                              Locked as <span className="font-medium text-fg">owner</span> and{" "}
                              <span className="font-medium text-fg">platform admin</span>. Role, admin flag, and ban
                              controls are enforced in the database—not editable here.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 rounded-2xl border border-token-soft/80 bg-surface/30 p-4 dark:bg-[rgb(var(--surface)/0.35)]">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Controls</p>
                          <form
                            className="flex flex-wrap items-end gap-3 border-b border-token-soft/50 pb-4"
                            action={(fd) => runAction(adminUpdateUserRoleAction, fd)}
                          >
                            <input type="hidden" name="user_id" value={p.id} />
                            <label className="text-xs font-medium text-fg-muted">
                              Role
                              <select
                                name="role"
                                defaultValue={p.role}
                                className="mt-1.5 block min-w-[8.5rem] rounded-xl border border-token-soft bg-surface/90 px-3 py-2 text-sm text-fg shadow-sm"
                              >
                                <option value="member">member</option>
                                <option value="manager">manager</option>
                                <option value="owner">owner</option>
                              </select>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 pb-2 text-xs text-fg-soft">
                              <input type="checkbox" name="force_billing" className="rounded border-token-soft" />
                              Force (ignore invoice)
                            </label>
                            <button
                              type="submit"
                              className="rounded-xl bg-[rgb(var(--accent))] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_24px_rgb(var(--accent)/0.35)]"
                            >
                              Save role
                            </button>
                          </form>
                          <form
                            className="flex flex-wrap items-center gap-3 border-b border-token-soft/50 pb-4"
                            action={(fd) => runAction(adminSetPlatformAdminAction, fd)}
                          >
                            <input type="hidden" name="user_id" value={p.id} />
                            <label className="flex cursor-pointer items-center gap-2 text-xs text-fg-soft">
                              <input
                                type="checkbox"
                                name="is_admin"
                                defaultChecked={p.platform_admin}
                                className="rounded border-token-soft"
                              />
                              Platform admin
                            </label>
                            <button
                              type="submit"
                              className="rounded-xl border border-token-soft bg-surface/90 px-4 py-2 text-xs font-semibold text-fg shadow-sm"
                            >
                              Save admin flag
                            </button>
                          </form>
                          <form className="flex flex-col gap-2" action={(fd) => runAction(adminSetBanAction, fd)}>
                            <input type="hidden" name="user_id" value={p.id} />
                            <label className="flex cursor-pointer items-center gap-2 text-xs text-fg-soft">
                              <input
                                type="checkbox"
                                name="banned"
                                defaultChecked={Boolean(p.banned_at)}
                                className="rounded border-token-soft"
                              />
                              Banned
                            </label>
                            <input
                              name="reason"
                              placeholder="Ban note (optional)"
                              defaultValue={p.ban_reason ?? ""}
                              className="w-full rounded-xl border border-token-soft bg-surface/90 px-3 py-2 text-xs text-fg"
                            />
                            <button
                              type="submit"
                              className="w-fit rounded-xl border border-rose-500/45 bg-rose-500/12 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300"
                            >
                              Update ban
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      ) : null}

      {tab === "workspaces" ? (
        <GlassCard className="space-y-6 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-fg">Workspaces & billing</h2>
          <p className="text-sm text-fg-soft">
            Changes apply to the <span className="font-medium text-fg">entire company</span> — every member, manager,
            and owner is blocked when billing fails, trial ends without payment, or you pause access. Data is kept;
            turn billing back on or un-pause to restore login.
          </p>
          <div className="space-y-8">
            {organizations.map((o) => (
              <form
                key={o.id}
                className="rounded-2xl border border-token-soft bg-surface/50 p-4"
                action={(fd) => runAction(adminUpdateOrgSubscriptionAction, fd)}
              >
                <input type="hidden" name="organization_id" value={o.id} />
                <input type="hidden" name="invoice_paid_at_existing" value={o.invoice_paid_at ?? ""} />
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-base font-semibold text-fg">{o.name}</div>
                    <div className="text-xs text-fg-soft">{o.member_count} members</div>
                  </div>
                  <button
                    type="submit"
                    className="mt-2 rounded-2xl bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white md:mt-0"
                  >
                    Save workspace
                  </button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-xs font-medium text-fg-muted">
                    Status
                    <select
                      name="subscription_status"
                      defaultValue={o.subscription_status}
                      className="mt-1 w-full rounded-xl border border-token-soft bg-surface/80 px-2 py-2 text-sm text-fg"
                    >
                      <option value="trial">trial</option>
                      <option value="active">active</option>
                      <option value="past_due">past_due</option>
                      <option value="expired">expired</option>
                      <option value="suspended">suspended</option>
                    </select>
                  </label>
                  <label className="text-xs font-medium text-fg-muted">
                    Subscription ends (local)
                    <input
                      type="datetime-local"
                      name="subscription_ends_at"
                      defaultValue={toLocalInput(o.subscription_ends_at)}
                      className="mt-1 w-full rounded-xl border border-token-soft bg-surface/80 px-2 py-2 text-sm text-fg"
                    />
                  </label>
                  <label className="text-xs font-medium text-fg-muted">
                    Invoice paid at (optional)
                    <input
                      type="datetime-local"
                      name="invoice_paid_at"
                      defaultValue={toLocalInput(o.invoice_paid_at)}
                      className="mt-1 w-full rounded-xl border border-token-soft bg-surface/80 px-2 py-2 text-sm text-fg"
                    />
                  </label>
                  <div className="flex flex-col justify-end gap-2 text-xs text-fg-soft">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="mark_paid_now" className="rounded border-token-soft" />
                      Mark paid now
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="clear_invoice" className="rounded border-token-soft" />
                      Clear invoice date
                    </label>
                    <label className="mt-2 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-fg">
                      <input
                        type="checkbox"
                        name="access_paused"
                        defaultChecked={Boolean(o.access_paused)}
                        className="mt-0.5 rounded border-token-soft"
                      />
                      <span>
                        <span className="font-semibold">Pause entire workspace</span> — block{" "}
                        <span className="font-medium">all</span> users in this company (not only managers) until
                        unchecked.
                      </span>
                    </label>
                  </div>
                </div>
              </form>
            ))}
          </div>
        </GlassCard>
      ) : null}

      {tab === "invitations" ? (
        <GlassCard className="overflow-x-auto p-4 md:p-6">
          <h2 className="text-lg font-semibold text-fg">Invitations</h2>
          <p className="mt-1 text-sm text-fg-soft">Revoke pending invites (manager invites are blocked from the Team UI).</p>
          <table className="mt-4 w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                <th className="border-b border-token-soft pb-2 pr-3">Email</th>
                <th className="border-b border-token-soft pb-2 pr-3">Workspace</th>
                <th className="border-b border-token-soft pb-2 pr-3">Role</th>
                <th className="border-b border-token-soft pb-2 pr-3">Status</th>
                <th className="border-b border-token-soft pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((i) => (
                <tr key={i.id}>
                  <td className="border-b border-token-soft/60 py-3 pr-3 font-medium text-fg">{i.email}</td>
                  <td className="border-b border-token-soft/60 py-3 pr-3 text-fg-soft">{i.organization_name}</td>
                  <td className="border-b border-token-soft/60 py-3 pr-3 text-fg-soft">{i.role}</td>
                  <td className="border-b border-token-soft/60 py-3 pr-3 text-xs text-fg-soft">
                    {i.accepted_at ? "Accepted" : "Pending"}
                    {i.expires_at ? ` · expires ${new Date(i.expires_at).toLocaleString()}` : ""}
                  </td>
                  <td className="border-b border-token-soft/60 py-3">
                    {!i.accepted_at ? (
                      <form action={(fd) => runAction(adminDeleteInvitationAction, fd)}>
                        <input type="hidden" name="invitation_id" value={i.id} />
                        <button
                          type="submit"
                          className="rounded-xl border border-token-soft bg-surface/80 px-3 py-1.5 text-xs font-semibold text-fg"
                        >
                          Revoke
                        </button>
                      </form>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      ) : null}
    </div>
  );
}
