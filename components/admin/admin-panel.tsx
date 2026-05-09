"use client";

import * as React from "react";
import { GlassCard } from "@/components/command-center/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "@/components/ui/toast";
import {
  adminDeleteInvitationAction,
  adminSetBanAction,
  adminSetPlatformAdminAction,
  adminUpdateOrgSubscriptionAction,
  adminUpdateUserRoleAction,
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

export function AdminPanel({
  signedInUserId,
  signedInEmail,
  profiles,
  organizations,
  invitations,
  loadError,
}: {
  signedInUserId: string;
  signedInEmail: string;
  profiles: AdminProfileRow[];
  organizations: AdminOrgRow[];
  invitations: AdminInviteRow[];
  loadError: string | null;
}) {
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
        <GlassCard className="overflow-x-auto p-4 md:p-6">
          <h2 className="text-lg font-semibold text-fg">Registered users</h2>
          <p className="mt-1 text-sm text-fg-soft">
            Promote to manager only when the workspace has an invoice on file and an active subscription window (or use
            force).
          </p>
          {!loadError && profiles.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4">
              <p className="text-sm font-semibold text-fg">No rows returned</p>
              <p className="mt-1 text-sm text-fg-soft">
                Admin RPCs only return rows when <code className="rounded bg-surface/80 px-1">is_platform_admin()</code>{" "}
                is true for your session. Common causes: empty or stale{" "}
                <code className="rounded bg-surface/80 px-1">profiles.email</code> hiding your JWT email, or OAuth email
                only in <code className="rounded bg-surface/80 px-1">user_metadata</code>.                 Run the latest SQL in{" "}
                <code className="rounded bg-surface/80 px-1">supabase/migrations/</code> through{" "}
                <code className="rounded bg-surface/80 px-1">20260209190000_master_admin_session_auth_users.sql</code>{" "}
                (<code className="rounded bg-surface/80 px-1">supabase db push</code> or paste in the SQL editor), then
                refresh. Open <span className="font-medium text-fg">Workspaces</span> too — if every tab is empty, your
                session still is not seen as platform admin. If only Users is empty, check{" "}
                <code className="rounded bg-surface/80 px-1">select count(*) from public.profiles</code> in SQL (no rows
                means nothing to list).
              </p>
            </div>
          ) : null}
          <table className="mt-4 w-full min-w-[920px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                <th className="border-b border-token-soft pb-2 pr-3">User</th>
                <th className="border-b border-token-soft pb-2 pr-3">Workspace</th>
                <th className="border-b border-token-soft pb-2 pr-3">Billing</th>
                <th className="border-b border-token-soft pb-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profilesOrdered.map((p) => {
                const master = isMasterAdminEmail(p.email);
                const isYou = p.id === signedInUserId;
                return (
                  <tr
                    key={p.id}
                    className={`align-top ${isYou ? "bg-[rgb(var(--accent)/0.06)] ring-1 ring-[rgb(var(--accent)/0.2)] ring-inset" : ""}`}
                  >
                    <td className="border-b border-token-soft/60 py-3 pr-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold text-fg">{p.full_name}</div>
                        {isYou ? (
                          <span className="rounded-md bg-[rgb(var(--accent)/0.2)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fg">
                            You
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs text-fg-soft">{p.email}</div>
                      <div className="mt-1 text-xs text-fg-muted">
                        Role: <span className="font-medium text-fg">{p.role}</span>
                        {master ? (
                          <span className="ml-2 rounded-md bg-violet-500/25 px-1.5 py-0.5 font-medium text-violet-800 dark:text-violet-200">
                            Master admin
                          </span>
                        ) : null}
                        {p.platform_admin ? (
                          <span className="ml-2 rounded-md bg-amber-500/20 px-1.5 py-0.5 text-amber-800 dark:text-amber-200">
                            Admin
                          </span>
                        ) : null}
                        {p.banned_at ? (
                          <span className="ml-2 text-rose-600 dark:text-rose-400">Banned</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="border-b border-token-soft/60 py-3 pr-3 text-fg-soft">
                      {p.organization_name ?? "—"}
                    </td>
                    <td className="border-b border-token-soft/60 py-3 pr-3 text-xs text-fg-soft">
                      <div>Status: {p.subscription_status ?? "—"}</div>
                      <div>Ends: {p.subscription_ends_at ? new Date(p.subscription_ends_at).toLocaleString() : "—"}</div>
                      <div>Paid: {p.invoice_paid_at ? new Date(p.invoice_paid_at).toLocaleString() : "—"}</div>
                    </td>
                    <td className="border-b border-token-soft/60 py-3">
                      {master ? (
                        <p className="max-w-xs text-xs leading-relaxed text-fg-soft">
                          This account is locked as <span className="font-medium text-fg">owner</span> and{" "}
                          <span className="font-medium text-fg">platform admin</span>. Role, admin flag, and ban controls
                          are disabled here and enforced in the database.
                        </p>
                      ) : (
                        <>
                          <form
                            className="mb-3 flex flex-wrap items-end gap-2"
                            action={(fd) => runAction(adminUpdateUserRoleAction, fd)}
                          >
                            <input type="hidden" name="user_id" value={p.id} />
                            <label className="text-xs font-medium text-fg-muted">
                              Role
                              <select
                                name="role"
                                defaultValue={p.role}
                                className="mt-1 block rounded-xl border border-token-soft bg-surface/80 px-2 py-1.5 text-sm text-fg"
                              >
                                <option value="member">member</option>
                                <option value="manager">manager</option>
                                <option value="owner">owner</option>
                              </select>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-fg-soft">
                              <input type="checkbox" name="force_billing" className="rounded border-token-soft" />
                              Force (ignore invoice)
                            </label>
                            <button
                              type="submit"
                              className="rounded-xl bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white"
                            >
                              Save role
                            </button>
                          </form>
                          <form
                            className="mb-3 flex flex-wrap items-end gap-2"
                            action={(fd) => runAction(adminSetPlatformAdminAction, fd)}
                          >
                            <input type="hidden" name="user_id" value={p.id} />
                            <label className="flex items-center gap-1.5 text-xs text-fg-soft">
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
                              className="rounded-xl border border-token-soft bg-surface/80 px-3 py-1.5 text-xs font-semibold text-fg"
                            >
                              Save admin flag
                            </button>
                          </form>
                          <form className="flex flex-col gap-2" action={(fd) => runAction(adminSetBanAction, fd)}>
                            <input type="hidden" name="user_id" value={p.id} />
                            <label className="flex items-center gap-1.5 text-xs text-fg-soft">
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
                              className="w-full max-w-xs rounded-xl border border-token-soft bg-surface/80 px-2 py-1.5 text-xs text-fg"
                            />
                            <button
                              type="submit"
                              className="w-fit rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300"
                            >
                              Update ban
                            </button>
                          </form>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
