import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { PromisesPageClient, type PromiseLookups } from "@/components/promises/promises-page-client";
import { fetchPromiseLookups, fetchPromises } from "@/lib/promises";
import type { AppRole } from "@/lib/permissions";

export default async function PromisesPage() {
  const supabase = createClient(await cookies());
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const emptyLookups: PromiseLookups = { clients: [], projects: [], profiles: [] };

  if (!user) {
    return (
      <PromisesPageClient
        initialPromises={[]}
        role="member"
        profileId=""
        organizationId=""
        lookups={emptyLookups}
      />
    );
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, organization_id, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = ((profileRow?.role as AppRole | undefined) ?? "member") as AppRole;
  const profileId = profileRow?.id ?? user.id;
  const organizationId = profileRow?.organization_id ?? "";

  const initialPromises = await fetchPromises(supabase, { includeDone: true }).catch(() => []);
  const lookupsRaw = await fetchPromiseLookups(supabase).catch(() => null);

  const lookups: PromiseLookups = lookupsRaw
    ? {
        clients: lookupsRaw.clients,
        projects: lookupsRaw.projects,
        profiles: lookupsRaw.profiles.map((p) => ({
          id: p.id,
          full_name: p.full_name,
          role: p.role,
        })),
      }
    : emptyLookups;

  return (
    <PromisesPageClient
      initialPromises={initialPromises}
      role={role}
      profileId={profileId}
      organizationId={organizationId}
      lookups={lookups}
    />
  );
}
