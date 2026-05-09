import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { ArrowRight } from "lucide-react";

export default function MyDayPage() {
  return <MyDayServer />;
}

async function MyDayServer() {
  const supabase = createClient(await cookies());
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  let tasks: { id: string; title: string; status: string | null; due_at: string | null }[] = [];
  let promises: { id: string; title: string; status: string | null; due_at: string | null }[] = [];

  if (user) {
    const [tRes, pRes] = await Promise.all([
      supabase
        .from("tasks")
        .select("id,title,status,due_at")
        .eq("assigned_to", user.id)
        .neq("status", "done")
        .order("due_at", { ascending: true, nullsFirst: false })
        .limit(10),
      supabase
        .from("promises")
        .select("id,title,status,due_at")
        .eq("assigned_to", user.id)
        .neq("status", "done")
        .order("due_at", { ascending: true, nullsFirst: false })
        .limit(8),
    ]);
    tasks = (tRes.data ?? []) as typeof tasks;
    promises = (pRes.data ?? []) as typeof promises;
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="My Day" subtitle="What you own today — pulled from live tasks and promises." />

      <div className="grid gap-4 lg:grid-cols-2">
        <SurfaceCard className="p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">My tasks</h2>
            <Link href="/tasks">
              <GradientButton className="!py-2 !text-xs">
                Open tasks <ArrowRight className="h-3.5 w-3.5" />
              </GradientButton>
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {tasks.length === 0 ? (
              <li className="text-sm text-slate-600">No open tasks assigned to you.</li>
            ) : (
              tasks.map((t) => (
                <li
                  key={t.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
                >
                  <div className="font-medium">{t.title}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {(t.status ?? "").replaceAll("_", " ")}
                    {t.due_at ? ` · due ${new Date(t.due_at).toLocaleString()}` : ""}
                  </div>
                </li>
              ))
            )}
          </ul>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">My promises</h2>
            <Link href="/promises">
              <GradientButton variant="secondary" className="!py-2 !text-xs">
                Open promises <ArrowRight className="h-3.5 w-3.5" />
              </GradientButton>
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {promises.length === 0 ? (
              <li className="text-sm text-slate-600">No active promises assigned to you.</li>
            ) : (
              promises.map((p) => (
                <li
                  key={p.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
                >
                  <div className="font-medium">{p.title}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {(p.status ?? "active").replaceAll("_", " ")}
                    {p.due_at ? ` · due ${new Date(p.due_at).toLocaleString()}` : ""}
                  </div>
                </li>
              ))
            )}
          </ul>
        </SurfaceCard>
      </div>

      <SurfaceCard className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Clients & projects</h2>
            <p className="mt-1 text-sm text-slate-600">Jump to your portfolio.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/clients">
              <GradientButton variant="secondary" className="!py-2 !text-xs">
                My clients
              </GradientButton>
            </Link>
            <Link href="/projects">
              <GradientButton variant="secondary" className="!py-2 !text-xs">
                My projects
              </GradientButton>
            </Link>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
