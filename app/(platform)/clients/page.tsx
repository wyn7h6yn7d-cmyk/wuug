import { getPlatformSession } from "@/lib/platform-session";
import { ClientsPageClient } from "@/components/clients/clients-page-client";
import type { AppRole } from "@/lib/permissions";

export default async function ClientsPage() {
  const { supabase, user } = await getPlatformSession();

  // Platform layout already enforces auth, but keep this safe.
  if (!user) {
    return <ClientsPageClient initialClients={[]} owners={[]} role={"member"} profileId={""} />;
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, organization_id, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = ((profileRow?.role as AppRole | undefined) ?? "member") as AppRole;
  const profileId = profileRow?.id ?? user.id;

  // Owners list for manager UI.
  const { data: ownerRows } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .order("full_name", { ascending: true });

  const owners =
    ownerRows?.map((p) => ({
      id: p.id as string,
      label: `${p.full_name}${p.role ? ` • ${p.role}` : ""}`,
    })) ?? [];

  let query = supabase
    .from("clients")
    .select("id,name,contact_name,email,phone,status,health,priority,note,next_step,next_step_due_at,owner_id,created_at")
    .order("created_at", { ascending: false });

  if (role === "member") {
    query = query.eq("owner_id", profileId);
  }

  const { data: clientRows } = await query;

  return (
    <ClientsPageClient
      initialClients={(clientRows ?? []) as Parameters<typeof ClientsPageClient>[0]["initialClients"]}
      owners={owners}
      role={role}
      profileId={profileId}
    />
  );
}
