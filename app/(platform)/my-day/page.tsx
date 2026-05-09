import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, Clock, Handshake, ListTodo, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CommandBar } from "@/components/command-center/command-bar";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { InsightCard } from "@/components/command-center/insight-card";
import { NextBestAction } from "@/components/command-center/next-best-action";
import { PageHeader } from "@/components/ui/page-header";
import { PulseBadge } from "@/components/command-center/pulse-badge";

const chips = [
  { key: "plan", label: "Plan my day" },
  { key: "next", label: "What should I do next?" },
  { key: "draft", label: "Draft a follow-up" },
  { key: "blocked", label: "Where am I blocked?" },
];

export default function MyDayPage() {
  return <MyDayServer />;
}

async function MyDayServer() {
  const supabase = createClient(await cookies());
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  type Item = { id: string; title: string; status: string | null; due_at: string | null };
  let tasks: Item[] = [];
  let promises: Item[] = [];
  let waiting: Item[] = [];
  let topTask: Item | null = null;

  if (user) {
    const [tRes, pRes, wRes] = await Promise.all([
      supabase
        .from("tasks")
        .select("id,title,status,due_at,priority")
        .eq("assigned_to", user.id)
        .neq("status", "done")
        .order("priority", { ascending: true })
        .order("due_at", { ascending: true, nullsFirst: false })
        .limit(8),
      supabase
        .from("promises")
        .select("id,title,status,due_at")
        .eq("assigned_to", user.id)
        .neq("status", "done")
        .order("due_at", { ascending: true, nullsFirst: false })
        .limit(6),
      supabase
        .from("tasks")
        .select("id,title,status,due_at")
        .eq("assigned_to", user.id)
        .eq("status", "waiting_on_client")
        .limit(5),
    ]);
    tasks = (tRes.data ?? []) as Item[];
    promises = (pRes.data ?? []) as Item[];
    waiting = (wRes.data ?? []) as Item[];
    topTask = tasks[0] ?? null;
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow="Personal cockpit"
        title="My Day"
        subtitle="Your focus today — pulled live from tasks, promises, and waiting items."
      />

      <CommandBar chips={chips} />

      <div className="grid gap-4 xl:grid-cols-12 xl:gap-5">
        <div className="xl:col-span-7">
          {topTask ? (
            <NextBestAction
              subject={topTask.title}
              due={topTask.due_at ? `Due ${new Date(topTask.due_at).toLocaleString()}` : "Today"}
              reason="Top of your queue right now."
              ctaHref="/tasks"
            />
          ) : (
            <NextBestAction
              subject="Nothing urgent — clear horizon"
              due="No deadlines pressing"
              reason="Take a moment to plan, reach out to clients, or open Radar."
              ctaHref="/radar"
            />
          )}
        </div>

        <div className="xl:col-span-5">
          <GlassCard className="h-full p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-fg">Today’s focus</h2>
              <PulseBadge label={`${tasks.length} open`} tone="accent" />
            </div>
            <ul className="mt-3 space-y-2">
              {tasks.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-token-soft bg-surface/60 px-4 py-3 text-sm text-fg-soft">
                  No open tasks assigned to you. Enjoy the calm — or help a teammate.
                </li>
              ) : (
                tasks.slice(0, 5).map((t) => (
                  <li
                    key={t.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-token-soft bg-surface/70 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-fg">{t.title}</div>
                      <div className="text-xs text-fg-soft">
                        {(t.status ?? "").replaceAll("_", " ")}
                        {t.due_at ? ` · due ${new Date(t.due_at).toLocaleString()}` : ""}
                      </div>
                    </div>
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-fg-soft" />
                  </li>
                ))
              )}
            </ul>
            <Link href="/tasks">
              <GradientButton variant="secondary" size="sm" className="mt-3">
                Open all tasks <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </Link>
          </GlassCard>
        </div>

        <div className="xl:col-span-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InsightCard icon={ListTodo} tone="accent" label="My tasks" value={tasks.length} meta="open and assigned" />
            <InsightCard
              icon={Handshake}
              tone="calm"
              label="My promises"
              value={promises.length}
              meta="active commitments"
            />
            <InsightCard icon={Clock} tone="warn" label="Waiting on client" value={waiting.length} meta="blocked items" />
            <InsightCard icon={Sparkles} tone="neutral" label="Drafts ready" value="—" meta="AI suggestions live" />
          </div>
        </div>

        <div className="xl:col-span-7">
          <GlassCard className="h-full p-6">
            <h2 className="text-base font-semibold text-fg">My promises</h2>
            <ul className="mt-3 space-y-2">
              {promises.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-token-soft bg-surface/60 px-4 py-3 text-sm text-fg-soft">
                  No active promises assigned to you.
                </li>
              ) : (
                promises.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-token-soft bg-surface/70 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-fg">{p.title}</div>
                      <div className="text-xs text-fg-soft">
                        {(p.status ?? "active").replaceAll("_", " ")}
                        {p.due_at ? ` · due ${new Date(p.due_at).toLocaleString()}` : ""}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </GlassCard>
        </div>

        <div className="xl:col-span-5">
          <GlassCard className="h-full p-6">
            <h2 className="text-base font-semibold text-fg">Waiting on client</h2>
            <ul className="mt-3 space-y-2">
              {waiting.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-token-soft bg-surface/60 px-4 py-3 text-sm text-fg-soft">
                  Nothing blocked right now.
                </li>
              ) : (
                waiting.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-2xl border border-token-soft bg-surface/70 px-4 py-3 text-sm text-fg"
                  >
                    {t.title}
                  </li>
                ))
              )}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/clients">
                <GradientButton variant="secondary" size="sm">
                  My clients
                </GradientButton>
              </Link>
              <Link href="/projects">
                <GradientButton variant="secondary" size="sm">
                  My projects
                </GradientButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
