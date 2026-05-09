import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AdminPanel,
  type AdminInviteRow,
  type AdminOrgRow,
  type AdminProfileRow,
} from "@/components/admin/admin-panel";
import { canAccessAdminPanel } from "@/lib/master-admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("platform_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!canAccessAdminPanel(Boolean(profile?.platform_admin), user.email)) {
    redirect("/");
  }

  const [profilesRes, orgsRes, invitesRes, diagRes] = await Promise.all([
    supabase.rpc("admin_list_profiles"),
    supabase.rpc("admin_list_organizations"),
    supabase.rpc("admin_list_invitations"),
    supabase.rpc("admin_session_diagnostic"),
  ]);

  const rpcErrors = [profilesRes.error, orgsRes.error, invitesRes.error].filter(
    (e): e is NonNullable<typeof e> => e != null,
  );
  const err = rpcErrors.length ? rpcErrors.map((e) => e.message).join(" · ") : null;

  const profiles = (profilesRes.data ?? []) as AdminProfileRow[];
  const organizations = (orgsRes.data ?? []) as AdminOrgRow[];
  const invitations = (invitesRes.data ?? []) as AdminInviteRow[];
  const allListsEmpty = profiles.length === 0 && organizations.length === 0 && invitations.length === 0;

  return (
    <AdminPanel
      signedInUserId={user.id}
      signedInEmail={user.email ?? ""}
      profiles={profiles}
      organizations={organizations}
      invitations={invitations}
      loadError={err}
      sessionDiagnostic={
        allListsEmpty && !err ? ((diagRes.data ?? null) as Record<string, unknown> | null) : null
      }
      sessionDiagnosticError={allListsEmpty && !err ? (diagRes.error?.message ?? null) : null}
    />
  );
}
