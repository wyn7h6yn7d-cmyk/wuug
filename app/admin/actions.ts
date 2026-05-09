"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { canAccessAdminPanel, isMasterAdminEmail } from "@/lib/master-admin";

async function requireAdmin() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("platform_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!canAccessAdminPanel(Boolean(profile?.platform_admin), user.email)) {
    throw new Error("Admin only.");
  }

  return { supabase, userId: user.id };
}

export async function adminUpdateUserRoleAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "member");
  const force = formData.get("force_billing") === "on";

  const { error } = await supabase.rpc("admin_update_user_role", {
    p_user_id: userId,
    p_role: role,
    p_force_billing: force,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function adminSetPlatformAdminAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const isAdmin = formData.get("is_admin") === "on";

  const { error } = await supabase.rpc("admin_set_platform_admin", {
    p_user_id: userId,
    p_is_admin: isAdmin,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function adminSetBanAction(formData: FormData) {
  const { supabase, userId } = await requireAdmin();
  const targetId = String(formData.get("user_id") ?? "");
  if (targetId === userId) throw new Error("You can’t change your own ban state here.");

  const banned = formData.get("banned") === "on";
  const reason = String(formData.get("reason") ?? "").trim();

  const { error } = await supabase.rpc("admin_set_ban", {
    p_user_id: targetId,
    p_banned: banned,
    p_reason: reason || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function adminUpdateOrgSubscriptionAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const orgId = String(formData.get("organization_id") ?? "");
  const status = String(formData.get("subscription_status") ?? "trial");
  const endsRaw = String(formData.get("subscription_ends_at") ?? "").trim();
  const invoiceRaw = String(formData.get("invoice_paid_at") ?? "").trim();
  const clearInvoice = formData.get("clear_invoice") === "on";
  const markPaidNow = formData.get("mark_paid_now") === "on";
  const existingInvoice = String(formData.get("invoice_paid_at_existing") ?? "").trim();

  const endsAt = endsRaw ? new Date(endsRaw).toISOString() : null;

  let invoiceAt: string | null = null;
  let clear = clearInvoice;

  if (clearInvoice) {
    invoiceAt = null;
    clear = true;
  } else if (markPaidNow) {
    invoiceAt = new Date().toISOString();
    clear = false;
  } else if (invoiceRaw) {
    invoiceAt = new Date(invoiceRaw).toISOString();
    clear = false;
  } else if (existingInvoice) {
    invoiceAt = new Date(existingInvoice).toISOString();
    clear = false;
  } else {
    invoiceAt = null;
    clear = false;
  }

  const accessPaused = formData.get("access_paused") === "on";

  const { error } = await supabase.rpc("admin_update_organization_subscription", {
    p_org_id: orgId,
    p_subscription_status: status,
    p_subscription_ends_at: endsAt,
    p_invoice_paid_at: invoiceAt,
    p_clear_invoice: clear,
    p_access_paused: accessPaused,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function adminDeleteInvitationAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("invitation_id") ?? "");

  const { error } = await supabase.rpc("admin_delete_invitation", {
    p_invitation_id: id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

/**
 * Empty DB: auth user exists but signup/onboarding never created organizations + profiles.
 * Creates the first workspace via create_workspace; master email gets owner + platform_admin on profile.
 */
export async function bootstrapWorkspaceIfMissingAction(formData: FormData) {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Not signed in.");

  const { data: existing } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (existing) throw new Error("You already have a profile.");

  if (!canAccessAdminPanel(false, user.email)) {
    throw new Error("Only platform administrators can seed an empty database from here.");
  }

  const orgName = String(formData.get("organization_name") ?? "").trim() || "My workspace";
  const fullName =
    String(formData.get("full_name") ?? "").trim() ||
    (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "") ||
    user.email.split("@")[0] ||
    "Owner";

  const { error: rpcError } = await supabase.rpc("create_workspace", {
    p_organization_name: orgName,
    p_full_name: fullName,
  });
  if (rpcError) throw new Error(rpcError.message);

  if (isMasterAdminEmail(user.email)) {
    const { error: upErr } = await supabase
      .from("profiles")
      .update({ role: "owner", platform_admin: true })
      .eq("id", user.id);
    if (upErr) throw new Error(upErr.message);
  }

  revalidatePath("/admin");
  revalidatePath("/manager");
  revalidatePath("/my-day");
}
