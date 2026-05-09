"use client";

import * as React from "react";
import { Copy, Plus, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { toast } from "@/components/ui/toast";
import type { AppRole } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/client";

type MemberRow = {
  id: string;
  full_name: string;
  email: string;
  role: AppRole;
  created_at: string;
};

type InviteRow = {
  id: string;
  email: string;
  role: "manager" | "member";
  token: string | null;
  created_at: string;
  expires_at: string | null;
  accepted_at: string | null;
};

export function TeamPageClient({
  role,
  organizationId,
  inviterProfileId,
  members,
  invitations,
  appOrigin,
}: {
  role: AppRole;
  organizationId: string;
  inviterProfileId: string;
  members: MemberRow[];
  invitations: InviteRow[];
  appOrigin: string;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  void role;
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [inviteEmail, setInviteEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const inviteRole = "member" as const;
  const [localInvites, setLocalInvites] = React.useState<InviteRow[]>(invitations);

  async function createInvitation() {
    setBusy(true);
    setError(null);
    try {
      const email = inviteEmail.trim().toLowerCase();
      if (!email) {
        setError("Email is required.");
        return;
      }

      const token =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error: insertError } = await supabase
        .from("invitations")
        .insert({
          organization_id: organizationId,
          email,
          role: inviteRole,
          invited_by: inviterProfileId,
          token,
          expires_at: expiresAt,
        })
        .select("id,email,role,token,created_at,expires_at,accepted_at")
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      const link = `${appOrigin.replace(/\/$/, "")}/register?invite=${encodeURIComponent(token)}`;

      try {
        await navigator.clipboard.writeText(link);
        toast("Invitation created. Link copied.");
      } catch {
        toast("Invitation created.");
      }

      setLocalInvites((prev) => [data as InviteRow, ...prev]);
      setInviteOpen(false);
      setInviteEmail("");
      setFirstName("");
      setLastName("");
    } finally {
      setBusy(false);
    }
  }

  async function revokeInvitation(id: string) {
    setBusy(true);
    try {
      const { error } = await supabase.from("invitations").delete().eq("id", id);
      if (error) {
        toast("Could not revoke invitation.");
        return;
      }
      setLocalInvites((prev) => prev.filter((i) => i.id !== id));
      toast("Invitation revoked.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <PageHeader title="Team" subtitle="Create team members, assign responsibilities, and track access." />
          <GradientButton onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4" />
            Invite team member
          </GradientButton>
        </div>
      </FadeIn>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <GlassCard className="p-6">
          <div className="text-sm font-semibold text-slate-900">Team members</div>
          <div className="mt-3 space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex flex-col justify-between gap-2 rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03] md:flex-row md:items-center"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">{m.full_name}</div>
                  <div className="text-xs text-slate-500">{m.email}</div>
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  {m.role === "owner" || m.role === "manager" ? "Manager" : "Team Member"}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="text-sm font-semibold text-slate-900">Pending invitations</div>
          <div className="mt-3 space-y-2">
            {localInvites.length === 0 ? (
              <div className="text-sm text-slate-600">No pending invitations.</div>
            ) : (
              localInvites.map((inv) => {
                const link = inv.token
                  ? `${appOrigin.replace(/\/$/, "")}/register?invite=${encodeURIComponent(inv.token)}`
                  : null;
                return (
                  <div
                    key={inv.id}
                    className="rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03]"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{inv.email}</div>
                        <div className="text-xs text-slate-500">
                          Role: {inv.role === "manager" ? "Manager" : "Team Member"}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {link ? (
                          <button
                            type="button"
                            disabled={busy}
                            aria-label={`Copy invite link for ${inv.email}`}
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(link);
                                toast("Invite link copied to clipboard.");
                              } catch {
                                toast("Could not copy link.");
                              }
                            }}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                          >
                            <Copy className="h-4 w-4" />
                            Copy invite link
                          </button>
                        ) : null}
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => revokeInvitation(inv.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>

      {inviteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-y-auto rounded-[28px] border border-[#E5EAF3] bg-white p-6 shadow-[0_18px_44px_rgba(66,86,122,0.18)] max-h-[85vh]">
            <div className="text-lg font-semibold text-slate-900">Invite team member</div>
            <div className="mt-1 text-sm text-slate-600">
              We’ll create an invite and copy the link to your clipboard once. The URL is never shown on screen—use{" "}
              <span className="font-medium">Copy invite link</span> under Pending invitations if you need it again. Wuug
              does <span className="font-medium">not</span> email it. The invite email must match the address they use to
              sign up.
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">First name</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Last name</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none"
                />
              </label>
            </div>

            <label className="mt-3 block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                type="email"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none"
              />
            </label>

            <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              New invites join as <span className="font-semibold text-slate-800">Team Member</span>. Promoting someone
              to manager is done in the platform <span className="font-semibold">Admin</span> panel after billing is
              confirmed.
            </p>

            {error ? (
              <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
                {error}
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setError(null);
                  setInviteOpen(false);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <GradientButton disabled={busy} onClick={() => createInvitation()}>
                {busy ? "Creating…" : "Create invitation"}
              </GradientButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

