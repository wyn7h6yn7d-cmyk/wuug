import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isMasterAdminEmail } from "@/lib/master-admin";

/**
 * Blocks normal app usage when the user is banned, the workspace is paused,
 * subscription/billing rules fail, or the trial ended without payment.
 * Applies to every role (member, manager, owner) in the company.
 * Platform admins bypass these checks so they can fix billing.
 */
export async function assertWorkspaceAccess() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("platform_admin, banned_at, ban_reason, organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return;

  if (profile.banned_at) {
    const q = profile.ban_reason ? `?reason=${encodeURIComponent(profile.ban_reason)}` : "";
    redirect(`/account-suspended${q}`);
  }

  if (profile.platform_admin || isMasterAdminEmail(user.email)) return;

  if (!profile.organization_id) return;

  const { data: org } = await supabase
    .from("organizations")
    .select("subscription_status, subscription_ends_at, invoice_paid_at, access_paused")
    .eq("id", profile.organization_id)
    .maybeSingle();

  if (!org) return;

  // Manual kill-switch: entire workspace (every account) blocked
  const accessPaused = Boolean((org as { access_paused?: boolean }).access_paused);
  if (accessPaused) {
    redirect("/subscription-expired");
  }

  const now = Date.now();
  const endsMs = org.subscription_ends_at ? new Date(org.subscription_ends_at).getTime() : null;
  const hasEnd = endsMs !== null && !Number.isNaN(endsMs);
  const endInFuture = !hasEnd || endsMs > now;

  const blockedStatus =
    org.subscription_status === "expired" ||
    org.subscription_status === "suspended" ||
    org.subscription_status === "past_due";

  const expiredByDate = hasEnd && endsMs <= now;

  // Company-wide billing: not just managers — everyone needs a paid invoice OR a valid trial window.
  const inTrial = org.subscription_status === "trial";
  const trialAllowsAccess = inTrial && endInFuture;
  const hasPaidInvoice = Boolean(org.invoice_paid_at);
  const billingAllowsAccess = hasPaidInvoice || trialAllowsAccess;

  if (blockedStatus || expiredByDate || !billingAllowsAccess) {
    redirect("/subscription-expired");
  }
}
