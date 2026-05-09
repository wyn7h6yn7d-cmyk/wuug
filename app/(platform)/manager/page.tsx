import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowRight,
  Clock,
  Handshake,
  ListTodo,
  Radar as RadarIcon,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CommandBar } from "@/components/command-center/command-bar";
import { GlassCard } from "@/components/command-center/glass-card";
import { PressableLink } from "@/components/ui/pressable-link";
import { InsightCard } from "@/components/command-center/insight-card";
import { NextBestAction } from "@/components/command-center/next-best-action";
import { PageHeader } from "@/components/ui/page-header";
import { PulseBadge } from "@/components/command-center/pulse-badge";
import { RadarVisual } from "@/components/command-center/radar-visual";

const heroChips = [
  { key: "today", label: "What needs attention today?" },
  { key: "stuck", label: "Show stuck clients" },
  { key: "team", label: "Who is overloaded?" },
  { key: "draft", label: "Draft next status" },
];

export default async function ManagerPage() {
  const supabase = createClient(await cookies());
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  let openTasks = 0;
  let activePromises = 0;
  let clientCount = 0;
  let unassignedTasks = 0;
  let overdueTasks = 0;
  let recent: { title: string; type: string; at: string }[] = [];
  let topTask: { id: string; title: string; due_at: string | null } | null = null;

  if (user) {
    const todayIso = new Date().toISOString();
    const [tCount, pCount, cCount, unassigned, overdue, log, nba] = await Promise.all([
      supabase.from("tasks").select("id", { count: "exact", head: true }).neq("status", "done"),
      supabase.from("promises").select("id", { count: "exact", head: true }).neq("status", "done"),
      supabase.from("clients").select("id", { count: "exact", head: true }),
      supabase.from("tasks").select("id", { count: "exact", head: true }).is("assigned_to", null),
      supabase.from("tasks").select("id", { count: "exact", head: true }).neq("status", "done").lt("due_at", todayIso),
      supabase
        .from("activity_log")
        .select("title,type,created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("tasks")
        .select("id,title,due_at,priority,status")
        .neq("status", "done")
        .order("priority", { ascending: true })
        .order("due_at", { ascending: true, nullsFirst: false })
        .limit(1)
        .maybeSingle(),
    ]);

    openTasks = tCount.count ?? 0;
    activePromises = pCount.count ?? 0;
    clientCount = cCount.count ?? 0;
    unassignedTasks = unassigned.count ?? 0;
    overdueTasks = overdue.count ?? 0;
    recent =
      log.data?.map((r) => ({
        title: r.title as string,
        type: (r.type as string) ?? "",
        at: r.created_at as string,
      })) ?? [];
    if (nba.data) {
      topTask = {
        id: nba.data.id as string,
        title: nba.data.title as string,
        due_at: (nba.data.due_at as string | null) ?? null,
      };
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow="Command center"
        title="Operations cockpit"
        subtitle="Live radar across clients, projects, tasks and promises — one screen, one decision at a time."
      />

      <CommandBar chips={heroChips} />

      <div className="grid gap-4 xl:grid-cols-12 xl:gap-5">
        {/* NBA hero */}
        <div className="xl:col-span-7">
          {topTask ? (
            <NextBestAction
              subject={topTask.title}
              due={topTask.due_at ? `Due ${new Date(topTask.due_at).toLocaleString()}` : "No due date set"}
              reason="Auto-prioritized by urgency and risk."
              ctaHref="/tasks"
            />
          ) : (
            <NextBestAction
              subject="Pick up the radar"
              due="Whenever you're ready"
              reason="No critical task right now. Keep momentum on Radar."
              ctaHref="/radar"
            />
          )}
        </div>

        {/* Radar mini */}
        <div className="xl:col-span-5">
          <GlassCard className="h-full p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-token-soft bg-surface/70 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-soft">
                  <RadarIcon className="h-3.5 w-3.5" /> Risk Radar
                </span>
              </div>
              <Link href="/radar" className="text-xs font-semibold text-[rgb(var(--accent))] hover:underline">
                Open radar →
              </Link>
            </div>
            <div className="mt-3 grid items-center gap-3 sm:grid-cols-[180px_1fr]">
              <div className="mx-auto w-full max-w-[200px]">
                <RadarVisual
                  blips={[
                    { id: "a", angle: 200, distance: 0.85, tone: "rose", size: "lg" },
                    { id: "b", angle: 70, distance: 0.5, tone: "orange" },
                    { id: "c", angle: 320, distance: 0.7, tone: "violet" },
                    { id: "d", angle: 130, distance: 0.4, tone: "blue", size: "sm" },
                  ]}
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-xl border border-token-soft bg-surface/70 px-3 py-2">
                  <span className="text-fg-muted">Overdue tasks</span>
                  <span className="font-semibold text-[rgb(var(--risk))]">{overdueTasks}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-token-soft bg-surface/70 px-3 py-2">
                  <span className="text-fg-muted">Unassigned tasks</span>
                  <span className="font-semibold text-[rgb(var(--warn))]">{unassignedTasks}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-token-soft bg-surface/70 px-3 py-2">
                  <span className="text-fg-muted">Active promises</span>
                  <span className="font-semibold text-fg">{activePromises}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Stat strip */}
        <div className="xl:col-span-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InsightCard icon={ListTodo} tone="accent" label="Open tasks" value={openTasks} meta="across the org" />
            <InsightCard icon={Handshake} tone="calm" label="Active promises" value={activePromises} meta="commitments live" />
            <InsightCard icon={Users} tone="neutral" label="Clients" value={clientCount} meta="in your workspace" />
            <InsightCard icon={ShieldAlert} tone="risk" label="Overdue" value={overdueTasks} meta="needs attention" />
          </div>
        </div>

        {/* Activity */}
        <div className="xl:col-span-7">
          <GlassCard className="h-full p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-fg">Recent activity</h2>
                <p className="mt-1 text-sm text-fg-soft">Live log of changes across your workspace.</p>
              </div>
              <PressableLink href="/reports" variant="secondary" size="sm">
                Reports <ArrowRight className="h-4 w-4" />
              </PressableLink>
            </div>
            <ul className="mt-4 space-y-2">
              {recent.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-token-soft bg-surface/60 px-4 py-3 text-sm text-fg-soft">
                  No activity yet. Create a task or promise to see it here.
                </li>
              ) : (
                recent.map((r, i) => (
                  <li
                    key={`${r.at}-${i}`}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-token-soft bg-surface/70 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-fg">{r.title}</div>
                      <div className="text-xs text-fg-soft">
                        {r.type}
                        {r.at ? ` · ${new Date(r.at).toLocaleString()}` : ""}
                      </div>
                    </div>
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-fg-soft" />
                  </li>
                ))
              )}
            </ul>
          </GlassCard>
        </div>

        <div className="xl:col-span-5">
          <GlassCard className="h-full p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-fg">Wuug suggests</h2>
                <p className="mt-1 text-sm text-fg-soft">Tap a suggestion — Wuug drafts the next steps.</p>
              </div>
              <PulseBadge label="Wuug AI" tone="accent" />
            </div>
            <div className="mt-4 space-y-2">
              {[
                "Rebalance overloaded teammates: 2 candidates suggested.",
                "Draft a “can we confirm today?” email to stuck clients.",
                "Auto-assign 3 unassigned tasks based on workload.",
              ].map((rec) => (
                <button
                  key={rec}
                  type="button"
                  className="w-full rounded-2xl border border-token-soft bg-surface/70 px-4 py-3 text-left text-sm text-fg-muted hover:border-[rgb(var(--accent)/0.35)] hover:text-fg"
                >
                  {rec}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PressableLink href="/team" variant="primary" size="sm">
                <Users className="h-4 w-4" /> Team
              </PressableLink>
              <PressableLink href="/projects" variant="secondary" size="sm">
                Projects
              </PressableLink>
              <PressableLink href="/promises" variant="secondary" size="sm">
                Promises
              </PressableLink>
              <PressableLink href="/radar" variant="ghost" size="sm">
                <Sparkles className="h-4 w-4" /> Radar
              </PressableLink>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
