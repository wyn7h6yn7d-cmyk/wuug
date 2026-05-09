import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { ArrowRight } from "lucide-react";

export default function ManagerPage() {
  return <ManagerServer />;
}

async function ManagerServer() {
  const supabase = createClient(await cookies());
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  let openTasks = 0;
  let activePromises = 0;
  let clientCount = 0;
  let recent: { title: string; type: string; at: string }[] = [];

  if (user) {
    const [tC, pC, cC, log] = await Promise.all([
      supabase.from("tasks").select("id", { count: "exact", head: true }).neq("status", "done"),
      supabase.from("promises").select("id", { count: "exact", head: true }).neq("status", "done"),
      supabase.from("clients").select("id", { count: "exact", head: true }),
      supabase
        .from("activity_log")
        .select("title,type,created_at")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);
    openTasks = tC.count ?? 0;
    activePromises = pC.count ?? 0;
    clientCount = cC.count ?? 0;
    recent =
      log.data?.map((r) => ({
        title: r.title as string,
        type: (r.type as string) ?? "",
        at: r.created_at as string,
      })) ?? [];
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Command Center"
        subtitle="Live workspace snapshot — open work, promises, and latest activity."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SurfaceCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Open tasks</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{openTasks}</div>
          <Link href="/tasks" className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:underline">
            Manage tasks <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </SurfaceCard>
        <SurfaceCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active promises</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{activePromises}</div>
          <Link href="/promises" className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:underline">
            Promise register <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </SurfaceCard>
        <SurfaceCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Clients</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{clientCount}</div>
          <Link href="/clients" className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:underline">
            View clients <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SurfaceCard className="p-6">
          <h2 className="text-base font-semibold text-slate-900">Quick links</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/team">
              <GradientButton className="!py-2 !text-xs">Team</GradientButton>
            </Link>
            <Link href="/projects">
              <GradientButton variant="secondary" className="!py-2 !text-xs">
                Projects
              </GradientButton>
            </Link>
            <Link href="/radar">
              <GradientButton variant="secondary" className="!py-2 !text-xs">
                Radar
              </GradientButton>
            </Link>
            <Link href="/reports">
              <GradientButton variant="secondary" className="!py-2 !text-xs">
                Reports
              </GradientButton>
            </Link>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <h2 className="text-base font-semibold text-slate-900">Recent activity</h2>
          <ul className="mt-4 space-y-2">
            {recent.length === 0 ? (
              <li className="text-sm text-slate-600">No activity yet.</li>
            ) : (
              recent.map((r, i) => (
                <li key={`${r.at}-${i}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <div className="font-medium text-slate-900">{r.title}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {r.type}
                    {r.at ? ` · ${new Date(r.at).toLocaleString()}` : ""}
                  </div>
                </li>
              ))
            )}
          </ul>
          <Link href="/reports" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
            Full reports →
          </Link>
        </SurfaceCard>
      </div>
    </div>
  );
}
