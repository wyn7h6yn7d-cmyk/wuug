import Link from "next/link";
import { ArrowRight, Sparkles, UserRound, Timer, AlertTriangle, PauseCircle } from "lucide-react";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { PulseBadge } from "@/components/command-center/pulse-badge";
import { RadarVisual } from "@/components/command-center/radar-visual";
import { BentoGrid, BentoItem } from "@/components/command-center/bento-grid";

type RadarItem = {
  title: string;
  meta: string;
  tag: "Stuck" | "At risk" | "Due soon" | "Missing owner";
  tone: "warn" | "risk" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
};

const items: RadarItem[] = [
  {
    title: "Nordic OÜ",
    meta: "no activity for 6 days • next step: proposal",
    tag: "Stuck",
    tone: "warn",
    icon: PauseCircle,
  },
  {
    title: "Project: Website build",
    meta: "deadline Jun 11 • waiting for approval",
    tag: "At risk",
    tone: "risk",
    icon: AlertTriangle,
  },
  {
    title: "Promise: send contract draft",
    meta: "due tomorrow • client: Scandium Real Estate",
    tag: "Due soon",
    tone: "warn",
    icon: Timer,
  },
  {
    title: "New lead: Wave OÜ",
    meta: "no owner assigned • needs an assignee",
    tag: "Missing owner",
    tone: "neutral",
    icon: UserRound,
  },
];

const tagTone: Record<RadarItem["tag"], "calm" | "warn" | "risk" | "neutral"> = {
  Stuck: "warn",
  "At risk": "risk",
  "Due soon": "warn",
  "Missing owner": "neutral",
};

export function RadarCommandCenterView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Radar</h1>
            <PulseBadge label="Attention center" tone="warn" />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            These are the items that need attention before they become problems.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GradientButton variant="secondary">
            <Sparkles className="h-4 w-4" />
            AI suggestions
          </GradientButton>
          <Link href="/app" className="hidden md:block">
            <GradientButton>
              Open today pulse <ArrowRight className="h-4 w-4" />
            </GradientButton>
          </Link>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-5">
          <GlassCard className="p-6">
            <div className="grid items-center gap-4 md:grid-cols-[220px_1fr]">
              <RadarVisual
                className="mx-auto max-w-[240px]"
                blips={[
                  { id: "a", angle: 200, distance: 0.7, tone: "orange" },
                  { id: "b", angle: 50, distance: 0.6, tone: "violet" },
                  { id: "c", angle: 130, distance: 0.45, tone: "blue" },
                  { id: "d", angle: 320, distance: 0.75, tone: "orange" },
                  { id: "e", angle: 250, distance: 0.3, tone: "neutral" },
                ]}
              />
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <PulseBadge label="Stuck: 5" tone="warn" />
                  <PulseBadge label="At risk: 2" tone="risk" />
                  <PulseBadge label="Due soon: 4" tone="warn" />
                  <PulseBadge label="Missing owner: 3" tone="neutral" />
                </div>
                <p className="text-sm text-slate-600">
                  The goal isn’t “more work” — it’s <span className="font-semibold text-slate-900">fewer surprises</span>.
                  Pick one card and make one decision.
                </p>
                <div className="flex flex-wrap gap-2">
                  <GradientButton size="sm">View critical</GradientButton>
                  <GradientButton size="sm" variant="secondary">
                    View stuck
                  </GradientButton>
                </div>
              </div>
            </div>
          </GlassCard>

          <BentoGrid>
            <BentoItem className="xl:col-span-12">
              <GlassCard className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Signals</h2>
                    <p className="mt-1 text-sm text-slate-600">Cards, not tables. Clear, actionable, calm.</p>
                  </div>
                  <PulseBadge label="Mock data" tone="neutral" />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article
                        key={`${item.tag}-${item.title}`}
                        className="rounded-[26px] border border-white/70 bg-white/55 p-4 shadow-sm ring-1 ring-slate-900/[0.03] hover:-translate-y-0.5 hover:bg-white/70"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-[22px] border border-white/70 bg-white/60 shadow-sm ring-1 ring-slate-900/[0.03]">
                              <Icon className="h-5 w-5 text-slate-700" />
                            </span>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-slate-900">{item.title}</div>
                              <div className="mt-1 truncate text-xs text-slate-500">{item.meta}</div>
                            </div>
                          </div>
                          <PulseBadge label={item.tag} tone={tagTone[item.tag]} />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link href="/clients">
                            <GradientButton size="sm">Open</GradientButton>
                          </Link>
                          <GradientButton size="sm" variant="secondary">
                            Add next step
                          </GradientButton>
                          <GradientButton size="sm" variant="ghost">
                            Snooze
                          </GradientButton>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </GlassCard>
            </BentoItem>
          </BentoGrid>
        </div>

        <aside className="xl:sticky xl:top-6 xl:h-fit">
          <GlassCard className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">wuug suggests</div>
                <p className="mt-1 text-sm text-slate-600">
                  Pick one signal and I’ll propose 2–3 micro-steps and a ready-to-send message.
                </p>
              </div>
              <PulseBadge label="wuug AI" tone="neutral" />
            </div>

            <div className="mt-4 space-y-2">
              {[
                "Nordic OÜ: draft a short “can we confirm today?” email.",
                "At-risk project: propose 3 options and lock a new deadline.",
                "Missing owner: assign responsibility and add the first step in 5 minutes.",
              ].map((rec) => (
                <button
                  key={rec}
                  type="button"
                  className="w-full rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 text-left text-sm text-slate-700 shadow-sm ring-1 ring-slate-900/[0.03] hover:bg-white/75"
                >
                  {rec}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              <GradientButton>
                <Sparkles className="h-4 w-4" />
                Create plan
              </GradientButton>
              <GradientButton variant="secondary">Draft message</GradientButton>
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}

