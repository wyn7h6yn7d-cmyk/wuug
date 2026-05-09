import {
  AlertTriangle,
  ArrowRight,
  Bell,
  PauseCircle,
  ShieldAlert,
  Sparkles,
  Timer,
  UserRound,
} from "lucide-react";
import { getPlatformSession } from "@/lib/platform-session";
import { CommandBar } from "@/components/command-center/command-bar";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { PressableLink } from "@/components/ui/pressable-link";
import { InsightCard } from "@/components/command-center/insight-card";
import { PageHeader } from "@/components/ui/page-header";
import { PulseBadge } from "@/components/command-center/pulse-badge";
import { RadarVisual, type RadarBlip } from "@/components/command-center/radar-visual";

type SignalKind = "stuck" | "at_risk" | "due_soon" | "missing_owner";

type Signal = {
  id: string;
  kind: SignalKind;
  title: string;
  meta: string;
  href: string;
};

const kindMeta: Record<SignalKind, {
  label: string;
  tone: "warn" | "risk" | "accent" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  color: NonNullable<RadarBlip["tone"]>;
}> = {
  stuck: { label: "Stuck", tone: "warn", icon: PauseCircle, color: "orange" },
  at_risk: { label: "At risk", tone: "risk", icon: AlertTriangle, color: "rose" },
  due_soon: { label: "Due soon", tone: "accent", icon: Timer, color: "blue" },
  missing_owner: { label: "Missing owner", tone: "neutral", icon: UserRound, color: "neutral" },
};

const chips = [
  { key: "critical", label: "Show critical risks" },
  { key: "today", label: "Promises expiring today" },
  { key: "stuck", label: "Stuck for 5+ days" },
  { key: "owner", label: "Find missing owners" },
];

export default async function RadarPage() {
  const { supabase, user } = await getPlatformSession();

  const signals: Signal[] = [];
  let stuckCount = 0;
  let atRiskCount = 0;
  let dueCount = 0;
  let missingCount = 0;

  if (user) {
    const now = new Date();
    const nowMs = now.getTime();
    const todayIso = now.toISOString();
    const weekAhead = new Date(nowMs + 7 * 24 * 3600 * 1000).toISOString();

    const [unassigned, overdue, dueSoon, stuckClients, atRiskProjects] = await Promise.all([
      supabase
        .from("tasks")
        .select("id,title,client_id,clients(name)")
        .neq("status", "done")
        .is("assigned_to", null)
        .limit(8),
      supabase
        .from("tasks")
        .select("id,title,due_at,clients(name)")
        .neq("status", "done")
        .lt("due_at", todayIso)
        .order("due_at", { ascending: true })
        .limit(8),
      supabase
        .from("promises")
        .select("id,title,due_at,clients(name)")
        .neq("status", "done")
        .gte("due_at", todayIso)
        .lte("due_at", weekAhead)
        .order("due_at", { ascending: true })
        .limit(8),
      supabase
        .from("clients")
        .select("id,name,next_step,next_step_due_at,updated_at")
        .or(`next_step.is.null,next_step.eq.""`)
        .limit(6),
      supabase
        .from("projects")
        .select("id,name,status,risk_reason,deadline")
        .or("status.eq.at_risk,status.eq.waiting_on_client")
        .limit(6),
    ]);

    (unassigned.data ?? []).forEach((t) => {
      missingCount++;
      signals.push({
        id: `u-${t.id}`,
        kind: "missing_owner",
        title: t.title as string,
        meta: "Task has no owner",
        href: "/tasks",
      });
    });

    (overdue.data ?? []).forEach((t) => {
      atRiskCount++;
      const daysLate = t.due_at ? Math.max(1, Math.floor((nowMs - Date.parse(t.due_at as string)) / 86400000)) : 0;
      signals.push({
        id: `o-${t.id}`,
        kind: "at_risk",
        title: t.title as string,
        meta: `Overdue by ${daysLate}d`,
        href: "/tasks",
      });
    });

    (dueSoon.data ?? []).forEach((p) => {
      dueCount++;
      signals.push({
        id: `p-${p.id}`,
        kind: "due_soon",
        title: p.title as string,
        meta: p.due_at ? `Due ${new Date(p.due_at as string).toLocaleDateString()}` : "Due this week",
        href: "/promises",
      });
    });

    (stuckClients.data ?? []).forEach((c) => {
      stuckCount++;
      const days =
        c.updated_at && Date.parse(c.updated_at as string)
          ? Math.max(1, Math.floor((nowMs - Date.parse(c.updated_at as string)) / 86400000))
          : null;
      signals.push({
        id: `c-${c.id}`,
        kind: "stuck",
        title: c.name as string,
        meta: days ? `No activity for ${days}d · no next step` : "No next step set",
        href: "/clients",
      });
    });

    (atRiskProjects.data ?? []).forEach((p) => {
      atRiskCount++;
      signals.push({
        id: `pr-${p.id}`,
        kind: "at_risk",
        title: `Project: ${p.name}`,
        meta: p.risk_reason ? (p.risk_reason as string) : (p.status as string)?.replaceAll("_", " "),
        href: "/projects",
      });
    });

  }

  // Spread blips around the radar based on signal kinds
  const blips: RadarBlip[] = signals.slice(0, 14).map((s, idx) => ({
    id: s.id,
    angle: (idx * 47) % 360,
    distance: 0.35 + ((idx * 13) % 60) / 100,
    tone: kindMeta[s.kind].color,
    size: s.kind === "at_risk" ? "lg" : s.kind === "due_soon" ? "md" : "sm",
  }));

  const total = stuckCount + atRiskCount + dueCount + missingCount;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow="Risk radar"
        title="Radar"
        subtitle="Live signals across your workspace. The goal isn't more work — fewer surprises."
      />

      <CommandBar chips={chips} />

      <div className="grid gap-4 xl:grid-cols-12 xl:gap-5">
        {/* Centerpiece radar */}
        <div className="xl:col-span-7">
          <GlassCard className="relative overflow-hidden p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent)/0.10)] px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
                  <ShieldAlert className="h-3.5 w-3.5" /> Live signals
                </span>
              </div>
              <PulseBadge label={`${total} active`} tone={atRiskCount > 0 ? "risk" : "accent"} />
            </div>

            <div className="mt-4 grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <SeverityRow label="Critical / at risk" tone="risk" count={atRiskCount} />
                  <SeverityRow label="Stuck" tone="warn" count={stuckCount} />
                  <SeverityRow label="Due soon" tone="accent" count={dueCount} />
                  <SeverityRow label="Missing owner" tone="neutral" count={missingCount} />
                </div>
                <p className="mt-4 text-sm text-fg-soft">
                  Pick one signal and resolve it in two minutes. Wuug will draft the next step for you.
                </p>
              </div>
              <div className="relative mx-auto w-full max-w-[300px]">
                <RadarVisual blips={blips} />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="xl:col-span-5">
          <GlassCard className="h-full p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-fg">Wuug recommends</h2>
                <p className="mt-1 text-sm text-fg-soft">AI-generated micro-steps for the highest-impact signals.</p>
              </div>
              <PulseBadge label="Wuug AI" tone="accent" />
            </div>
            <div className="mt-4 space-y-2">
              {[
                { title: "Reach out to stuck clients", body: "Draft 3 short follow-ups in your tone.", tone: "accent" as const },
                { title: "Lock new deadlines on at-risk projects", body: "Propose 3 reschedules and pick one.", tone: "risk" as const },
                { title: "Auto-assign missing owners", body: "Suggest owners by workload + recent activity.", tone: "warn" as const },
              ].map((rec) => (
                <button
                  key={rec.title}
                  type="button"
                  className="group flex w-full items-start gap-3 rounded-2xl border border-token-soft bg-surface/70 px-4 py-3 text-left hover:border-[rgb(var(--accent)/0.45)]"
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-token-soft bg-surface/80 text-[rgb(var(--accent))]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-fg">{rec.title}</span>
                    <span className="mt-0.5 block text-xs text-fg-soft">{rec.body}</span>
                  </span>
                  <ArrowRight className="mt-0.5 h-4 w-4 text-fg-soft group-hover:text-fg" />
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <GradientButton size="sm">
                <Sparkles className="h-4 w-4" /> Build my plan
              </GradientButton>
              <GradientButton size="sm" variant="secondary">
                Draft message
              </GradientButton>
            </div>
          </GlassCard>
        </div>

        {/* Stat strip */}
        <div className="xl:col-span-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InsightCard icon="alert-triangle" tone="risk" label="At risk" value={atRiskCount} meta="immediate attention" />
            <InsightCard icon="pause-circle" tone="warn" label="Stuck" value={stuckCount} meta="quiet for days" />
            <InsightCard icon="timer" tone="accent" label="Due soon" value={dueCount} meta="this week" />
            <InsightCard icon="user-round" tone="neutral" label="No owner" value={missingCount} meta="needs assignee" />
          </div>
        </div>

        {/* Signal feed */}
        <div className="xl:col-span-12">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-fg">Signals</h2>
              <PulseBadge label="Cards, not tables" tone="neutral" />
            </div>
            {signals.length === 0 ? (
              <p className="mt-4 text-sm text-fg-soft">All quiet on the radar — keep momentum.</p>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {signals.slice(0, 12).map((s) => {
                  const meta = kindMeta[s.kind];
                  const Icon = meta.icon;
                  return (
                    <article
                      key={s.id}
                      className="group rounded-3xl border border-token-soft bg-surface/70 p-4 tactile hover:border-[rgb(var(--accent)/0.35)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-token-soft bg-surface/80 text-fg">
                            <Icon className="h-4.5 w-4.5" />
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-fg">{s.title}</div>
                            <div className="mt-0.5 truncate text-xs text-fg-soft">{s.meta}</div>
                          </div>
                        </div>
                        <PulseBadge label={meta.label} tone={meta.tone} />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <PressableLink href={s.href} variant="primary" size="sm">
                          Open <ArrowRight className="h-4 w-4" />
                        </PressableLink>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center gap-1.5 rounded-2xl border border-token-soft bg-surface/70 px-3 text-xs font-semibold text-fg-muted hover:text-fg"
                        >
                          <Bell className="h-3.5 w-3.5" /> Snooze
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center gap-1.5 rounded-2xl border border-[rgb(var(--accent-2)/0.35)] bg-[rgb(var(--accent-2)/0.10)] px-3 text-xs font-semibold text-[rgb(var(--accent-2))]"
                        >
                          <Sparkles className="h-3.5 w-3.5" /> Draft
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function SeverityRow({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "risk" | "warn" | "accent" | "neutral";
}) {
  const colorMap: Record<typeof tone, string> = {
    risk: "rgb(var(--risk))",
    warn: "rgb(var(--warn))",
    accent: "rgb(var(--accent))",
    neutral: "rgb(var(--fg-soft))",
  };
  return (
    <div className="flex items-center justify-between rounded-2xl border border-token-soft bg-surface/70 px-3.5 py-2.5">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: colorMap[tone] }} />
        <span className="text-sm text-fg-muted">{label}</span>
      </div>
      <span className="text-base font-semibold" style={{ color: colorMap[tone] }}>
        {count}
      </span>
    </div>
  );
}
