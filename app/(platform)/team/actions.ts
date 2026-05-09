"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getAppOrigin } from "@/lib/app-origin";
import { sendInviteEmail } from "@/lib/email/send-invite-email";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/permissions";

async function requireManagerSession() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, organization_id, role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const orgId = profile?.organization_id ?? null;
  const role = (profile?.role as AppRole | undefined) ?? "member";
  if (!orgId) throw new Error("No workspace linked.");
  if (role !== "owner" && role !== "manager") {
    throw new Error("Only owners and managers can invite.");
  }

  return {
    supabase,
    userId: user.id,
    organizationId: orgId,
    inviterName: profile?.full_name?.trim() || undefined,
  };
}

export type TeamInviteResult =
  | { ok: true; emailSent: true }
  | {
      ok: true;
      emailSent: false;
      reason: "email_not_configured" | "email_provider_error";
      message?: string;
      /** For clipboard only when email was not sent (never render this string in the UI). */
      fallbackInviteUrl?: string;
    };

export async function createTeamInvitationAction(formData: FormData): Promise<TeamInviteResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) throw new Error("Email is required.");

  const { supabase, userId, organizationId, inviterName } = await requireManagerSession();

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", organizationId)
    .maybeSingle();
  const organizationName = org?.name?.trim() || "Workspace";

  const token = randomUUID();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase.from("invitations").insert({
    organization_id: organizationId,
    email,
    role: "member",
    invited_by: userId,
    token,
    expires_at: expiresAt,
  });

  if (insertError) throw new Error(insertError.message);

  const inviteUrl = `${getAppOrigin().replace(/\/$/, "")}/register?invite=${encodeURIComponent(token)}`;

  const sent = await sendInviteEmail({
    to: email,
    inviteUrl,
    organizationName,
    inviterName,
  });

  revalidatePath("/team");

  if (sent.ok) {
    return { ok: true, emailSent: true };
  }

  if (sent.error === "RESEND_API_KEY is not set") {
    return {
      ok: true,
      emailSent: false,
      reason: "email_not_configured",
      fallbackInviteUrl: inviteUrl,
    };
  }

  return {
    ok: true,
    emailSent: false,
    reason: "email_provider_error",
    message: sent.error,
    fallbackInviteUrl: inviteUrl,
  };
}

export async function resendTeamInvitationEmailAction(formData: FormData): Promise<TeamInviteResult> {
  const invitationId = String(formData.get("invitation_id") ?? "").trim();
  if (!invitationId) throw new Error("Missing invitation.");

  const { supabase, organizationId, inviterName } = await requireManagerSession();

  const { data: inv, error: invErr } = await supabase
    .from("invitations")
    .select("id, email, token, accepted_at, organization_id")
    .eq("id", invitationId)
    .maybeSingle();

  if (invErr || !inv?.token || inv.organization_id !== organizationId) {
    throw new Error("Invitation not found.");
  }
  if (inv.accepted_at) throw new Error("Invitation already accepted.");

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", organizationId)
    .maybeSingle();
  const organizationName = org?.name?.trim() || "Workspace";

  const inviteUrl = `${getAppOrigin().replace(/\/$/, "")}/register?invite=${encodeURIComponent(inv.token)}`;

  const sent = await sendInviteEmail({
    to: inv.email,
    inviteUrl,
    organizationName,
    inviterName,
  });

  revalidatePath("/team");

  if (sent.ok) {
    return { ok: true, emailSent: true };
  }

  if (sent.error === "RESEND_API_KEY is not set") {
    return {
      ok: true,
      emailSent: false,
      reason: "email_not_configured",
      fallbackInviteUrl: inviteUrl,
    };
  }

  return {
    ok: true,
    emailSent: false,
    reason: "email_provider_error",
    message: sent.error,
    fallbackInviteUrl: inviteUrl,
  };
}
