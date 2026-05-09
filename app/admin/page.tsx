import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminPanel, type AdminInviteRow, type AdminOrgRow, type AdminProfileRow } from "@/components/admin/admin-panel";
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

  if (!profile?.platform_admin) redirect("/");

  const [profilesRes, orgsRes, invitesRes] = await Promise.all([
    supabase.rpc("admin_list_profiles"),
    supabase.rpc("admin_list_organizations"),
    supabase.rpc("admin_list_invitations"),
  ]);

  const err = profilesRes.error ?? orgsRes.error ?? invitesRes.error;

  return (
    <AdminPanel
      profiles={(profilesRes.data ?? []) as AdminProfileRow[]}
      organizations={(orgsRes.data ?? []) as AdminOrgRow[]}
      invitations={(invitesRes.data ?? []) as AdminInviteRow[]}
      loadError={err?.message ?? null}
    />
  );
}
