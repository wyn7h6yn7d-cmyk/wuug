"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Copy, Mail, Plus, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { toast } from "@/components/ui/toast";
import type { AppRole } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/client";
import {
  createTeamInvitationAction,
  resendTeamInvitationEmailAction,
} from "@/app/(platform)/team/actions";

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
  organizationId: _organizationId,
  inviterProfileId: _inviterProfileId,
  members,
  invitations,
  appOrigin,
  inviteEmailEnabled,
}: {
  role: AppRole;
  organizationId: string;
  inviterProfileId: string;
  members: MemberRow[];
  invitations: InviteRow[];
  appOrigin: string;
  inviteEmailEnabled: boolean;
}) {
  void role;
  void _organizationId;
  void _inviterProfileId;

  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [inviteEmail, setInviteEmail] = React.useState("");
  const [localInvites, setLocalInvites] = React.useState<InviteRow[]>(invitations);

  React.useEffect(() => {
    setLocalInvites(invitations);
  }, [invitations]);

  function inviteUrlForToken(token: string | null): string | null {
    if (!token) return null;
    return `${appOrigin.replace(/\/$/, "")}/register?invite=${encodeURIComponent(token)}`;
  }

  async function copyInviteUrlHidden(token: string | null) {
    const link = inviteUrlForToken(token);
    if (!link) {
      toast("No invite token.");
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      toast("Invite link copied to clipboard.");
    } catch {
      toast("Could not copy link.");
    }
  }

  async function createInvitation() {
    setBusy(true);
    setError(null);
    try {
      const email = inviteEmail.trim().toLowerCase();
      if (!email) {
        setError("Email is required.");
        return;
      }

      const fd = new FormData();
      fd.set("email", email);
      const result = await createTeamInvitationAction(fd);

      if (result.ok && result.emailSent) {
        toast(`Invitation sent to ${email}.`);
        setInviteOpen(false);
        setInviteEmail("");
        router.refresh();
        return;
      }

      if (result.ok && !result.emailSent && result.fallbackInviteUrl) {
        try {
          await navigator.clipboard.writeText(result.fallbackInviteUrl);
          if (result.reason === "email_not_configured") {
            toast(
              "Invite saved. Add RESEND_API_KEY and RESEND_FROM_EMAIL to send mail automatically—the link was copied for you to paste manually.",
            );
          } else {
            toast(
              `Email could not be sent (${result.message ?? "provider error"}). The invite link was copied to your clipboard.`,
            );
          }
        } catch {
          toast("Invite saved but clipboard failed. Check Resend configuration.");
        }
        setInviteOpen(false);
        setInviteEmail("");
        router.refresh();
        return;
      }

      toast("Invitation could not be completed.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function resendInvitationEmail(invitationId: string) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("invitation_id", invitationId);
      const result = await resendTeamInvitationEmailAction(fd);

      if (result.ok && result.emailSent) {
        toast("Invitation email sent again.");
        return;
      }

      if (result.ok && !result.emailSent && result.fallbackInviteUrl) {
        try {
          await navigator.clipboard.writeText(result.fallbackInviteUrl);
          toast(
            result.reason === "email_not_configured"
              ? "Email not configured—link copied to clipboard."
              : `Email failed. Link copied (${result.message ?? ""}).`,
          );
        } catch {
          toast("Could not send email or copy link.");
        }
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : "Resend failed.");
    } finally {
      setBusy(false);
    }
  }

  async function revokeInvitation(id: string) {
    setBusy(true);
    try {
      const { error: delErr } = await supabase.from("invitations").delete().eq("id", id);
      if (delErr) {
        toast("Could not revoke invitation.");
        return;
      }
      setLocalInvites((prev) => prev.filter((i) => i.id !== id));
      toast("Invitation revoked.");
      router.refresh();
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

      {!inviteEmailEnabled ? (
        <p className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-fg-soft">
          <span className="font-medium text-fg">Email delivery is off.</span> Set{" "}
          <code className="rounded bg-surface/80 px-1 text-xs">RESEND_API_KEY</code> and{" "}
          <code className="rounded bg-surface/80 px-1 text-xs">RESEND_FROM_EMAIL</code> in your deployment (e.g. Vercel)
          to send invites automatically. Until then, use{" "}
          <span className="font-medium text-fg">Copy link</span>—the URL is not shown on screen.
        </p>
      ) : null}

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
              localInvites.map((inv) => (
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
                      {inviteEmailEnabled ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => resendInvitationEmail(inv.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                        >
                          <Mail className="h-4 w-4" />
                          Resend email
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          aria-label={`Copy invite link for ${inv.email}`}
                          onClick={() => copyInviteUrlHidden(inv.token)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                        >
                          <Copy className="h-4 w-4" />
                          Copy link
                        </button>
                      )}
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
              ))
            )}
          </div>
        </GlassCard>
      </div>

      {inviteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[#E5EAF3] bg-white p-6 shadow-[0_18px_44px_rgba(66,86,122,0.18)]">
            <div className="text-lg font-semibold text-slate-900">Invite team member</div>
            <div className="mt-1 text-sm text-slate-600">
              {inviteEmailEnabled ? (
                <>
                  We&apos;ll email <span className="font-medium">one invitation link</span> to the address below. The
                  full URL is not shown on this page.
                </>
              ) : (
                <>
                  We&apos;ll save the invite. With email delivery off, the sign-up link is copied to your clipboard
                  after you create the invite—nothing is shown on screen.
                </>
              )}{" "}
              The invite email must match the address they use to register.
            </div>

            <label className="mt-4 block">
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
                {busy ? "Working…" : inviteEmailEnabled ? "Send invitation email" : "Create invitation"}
              </GradientButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
