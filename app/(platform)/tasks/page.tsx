import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TasksPageClient, type TaskLookups } from "@/components/tasks/tasks-page-client";
import { fetchTaskLookups, fetchTasks } from "@/lib/tasks";
import type { AppRole } from "@/lib/permissions";

export default async function TasksPage() {
  const supabase = createClient(await cookies());
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const emptyLookups: TaskLookups = { clients: [], projects: [], profiles: [] };

  if (!user) {
    return <TasksPageClient initialTasks={[]} role="member" profileId="" organizationId="" lookups={emptyLookups} />;
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, organization_id, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = ((profileRow?.role as AppRole | undefined) ?? "member") as AppRole;
  const profileId = profileRow?.id ?? user.id;
  const organizationId = profileRow?.organization_id ?? "";

  const initialTasks = await fetchTasks(supabase, { includeDone: true }).catch(() => []);
  const lookupsRaw = await fetchTaskLookups(supabase).catch(() => null);

  const lookups: TaskLookups = lookupsRaw
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
    <TasksPageClient
      initialTasks={initialTasks}
      role={role}
      profileId={profileId}
      organizationId={organizationId}
      lookups={lookups}
    />
  );
}
