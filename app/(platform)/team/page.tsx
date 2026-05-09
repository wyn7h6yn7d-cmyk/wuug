import { getPlatformSession } from "@/lib/platform-session";
import { AccessRestricted } from "@/components/access/access-restricted";
import { TeamMemberHub } from "@/components/team/team-member-hub";
import { TeamPageClient } from "@/components/team/team-page-client";
import type { AppRole } from "@/lib/permissions";
import { canAccessAdminPanel } from "@/lib/master-admin";

export default async function TeamPage() {
  const { supabase, user } = await getPlatformSession();
  if (!user) {
    return (
      <AccessRestricted
        backHref="/login"
        title="Sign in required"
        subtitle="You need to be signed in to open Team."
        ctaLabel="Back to sign in"
      />
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, organization_id, role, platform_admin")
    .eq("id", user.id)
    .maybeSingle();

  const role = ((profile?.role as AppRole | undefined) ?? "member") as AppRole;
  const organizationId = profile?.organization_id ?? null;
  const profileId = profile?.id ?? user.id;

  if (!organizationId) {
    const canOpenAdmin = canAccessAdminPanel(Boolean(profile?.platform_admin), user.email);
    return (
      <AccessRestricted
        backHref="/my-day"
        title="No workspace linked"
        subtitle={
          canOpenAdmin
            ? "Your account has no company on file yet (no organization_id). Open Platform admin and use Create your first workspace, or complete signup so create_workspace runs."
            : "Your account has no company on file yet. Ask an owner or manager to invite you to their workspace."
        }
        ctaLabel="Back to My Day"
        secondaryHref={canOpenAdmin ? "/admin" : undefined}
        secondaryLabel={canOpenAdmin ? "Platform admin" : undefined}
      />
    );
  }

  if (role === "member") {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .maybeSingle();
    const organizationName = org?.name?.trim() || "your workspace";
    return <TeamMemberHub organizationName={organizationName} />;
  }

  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("full_name", { ascending: true });

  const { data: pendingInvites } = await supabase
    .from("invitations")
    .select("id,email,role,token,created_at,expires_at,accepted_at")
    .is("accepted_at", null)
    .order("created_at", { ascending: false });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "http://localhost:3000";

  const origin = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

  return (
    <TeamPageClient
      role={role}
      organizationId={organizationId}
      inviterProfileId={profileId}
      members={(members ?? []) as any[]}
      invitations={(pendingInvites ?? []) as any[]}
      appOrigin={origin}
    />
  );
}
