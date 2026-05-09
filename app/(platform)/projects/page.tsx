import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ProjectsPageClient, type ProjectRow, type ProjectLookup } from "@/components/projects/projects-page-client";
import type { AppRole } from "@/lib/permissions";

export default async function ProjectsPage() {
  const supabase = createClient(await cookies());
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return (
      <ProjectsPageClient
        initialProjects={[]}
        role={"member"}
        profileId={""}
        organizationId={""}
        lookups={{ clients: [], owners: [] }}
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

  const [{ data: projects }, { data: clients }, { data: owners }] = await Promise.all([
    supabase
      .from("projects")
      .select("id,client_id,name,status,progress,deadline,next_step,next_step_due_at,risk_reason,owner_id,created_at")
      .order("created_at", { ascending: false }),
    supabase.from("clients").select("id,name").order("name", { ascending: true }),
    supabase.from("profiles").select("id,full_name,role").order("full_name", { ascending: true }),
  ]);

  const lookups: ProjectLookup = {
    clients: (clients ?? []).map((c) => ({ id: c.id as string, name: c.name as string })),
    owners:
      owners?.map((p) => ({
        id: p.id as string,
        label: `${p.full_name}${p.role ? ` • ${p.role}` : ""}`,
      })) ?? [],
  };

  let initialProjects = (projects ?? []) as unknown as ProjectRow[];

  if (role === "member") {
    initialProjects = initialProjects.filter((p) => p.owner_id === profileId);
  }

  return (
    <ProjectsPageClient
      initialProjects={initialProjects}
      role={role}
      profileId={profileId}
      organizationId={organizationId}
      lookups={lookups}
    />
  );
}
