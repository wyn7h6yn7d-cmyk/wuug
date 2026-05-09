import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, Clock3, Sparkles, ListChecks } from "lucide-react";
import { CommandBar } from "@/components/command-center/command-bar";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { PulseBadge } from "@/components/command-center/pulse-badge";
import { BentoGrid, BentoItem } from "@/components/command-center/bento-grid";
import { RadarVisual } from "@/components/command-center/radar-visual";

const commandChips = [
  { key: "email", label: "Draft an email to Nordic OÜ" },
  { key: "next", label: "What’s the next best step?" },
  { key: "radar", label: "Show the risk radar" },
  { key: "plan", label: "Create a 25‑minute plan" },
];

const nextBestAction = {
  title: "Send proposal to Nordic OÜ",
  context: "Due today 11:00 • Waiting for approval before development starts",
  why: "If this goes out today, you unlock forward momentum and reduce two linked risks.",
};

const waitingMe = [
  { label: "2 approvals", meta: "design variants", tone: "warn" as const },
  { label: "1 decision", meta: "project direction", tone: "neutral" as const },
  { label: "1 review", meta: "contract draft", tone: "warn" as const },
];

const waitingClient = [
  { label: "3 replies", meta: "from clients", tone: "calm" as const },
  { label: "2 approvals", meta: "deadlines", tone: "warn" as const },
];

const promises = [
  { label: "4 promises", meta: "due within 7 days", tone: "warn" as const },
  { label: "2 promises", meta: "overdue", tone: "risk" as const },
];

const timeline = [
  { time: "09:30", title: "Meeting: Greenfield OÜ", meta: "30 min" },
  { time: "11:00", title: "Proposal: Nordic OÜ", meta: "today’s focus" },
  { time: "14:00", title: "Call: Lumen OÜ", meta: "clarify scope" },
];

const noNextStep = [
  { label: "Põhjanael Studio", meta: "last contact 8 days ago" },
  { label: "Wave OÜ", meta: "project has no owner" },
  { label: "Buildit OÜ", meta: "waiting for input" },
];

export function TodaysPulseView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Today
            </h1>
            <PulseBadge label="Today pulse" tone="calm" />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            You have <span className="font-semibold text-slate-900">3 things</span> that truly matter today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/tasks">
            <GradientButton variant="secondary">
              <Sparkles className="h-4 w-4" />
              Create plan
            </GradientButton>
          </Link>
          <Link href="/tasks">
            <GradientButton>
              <ListChecks className="h-4 w-4" />
              Open focus
            </GradientButton>
          </Link>
        </div>
      </div>

      <GlassCard className="p-5">
        <CommandBar
          placeholder="Ask wuug or search clients, projects, tasks…"
          chips={commandChips}
        />
      </GlassCard>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <BentoGrid>
            <BentoItem className="xl:col-span-7">
              <GlassCard className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-slate-900">Next best action</h2>
                        <PulseBadge label="AI suggestion" tone="neutral" />
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{nextBestAction.why}</p>
                    </div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-[22px] border border-white/70 bg-white/60 shadow-sm ring-1 ring-slate-900/[0.03]">
                      <Clock3 className="h-5 w-5 text-slate-700" />
                    </span>
                  </div>

                  <div className="rounded-[24px] border border-white/70 bg-white/55 p-4 shadow-sm ring-1 ring-slate-900/[0.03]">
                    <p className="text-base font-semibold text-slate-900">{nextBestAction.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{nextBestAction.context}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <GradientButton size="sm">
                      Open <ArrowRight className="h-4 w-4" />
                    </GradientButton>
                    <GradientButton size="sm" variant="secondary">
                      <CheckCircle2 className="h-4 w-4" />
                      Mark done
                    </GradientButton>
                    <GradientButton size="sm" variant="ghost">
                      Snooze
                    </GradientButton>
                    <GradientButton size="sm" variant="secondary">
                      <Mail className="h-4 w-4" />
                      Draft email with AI
                    </GradientButton>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>

            <BentoItem className="xl:col-span-5">
              <GlassCard className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Risk Radar</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      6 items have quiet risk — lift them before they turn into a fire drill.
                    </p>
                  </div>
                  <PulseBadge label="Attention" tone="warn" />
                </div>

                <div className="mt-4 grid items-center gap-4 md:grid-cols-[180px_1fr]">
                  <RadarVisual
                    className="mx-auto max-w-[220px]"
                    blips={[
                      { id: "a", angle: 200, distance: 0.6, tone: "orange" },
                      { id: "b", angle: 50, distance: 0.55, tone: "violet" },
                      { id: "c", angle: 130, distance: 0.4, tone: "blue" },
                      { id: "d", angle: 320, distance: 0.7, tone: "orange" },
                    ]}
                  />
                  <div className="space-y-2">
                    {[
                      { label: "Stuck", meta: "5 clients", tone: "warn" as const },
                      { label: "At risk", meta: "2 projects", tone: "risk" as const },
                      { label: "Due soon", meta: "4 promises", tone: "warn" as const },
                      { label: "Missing owner", meta: "3 items", tone: "neutral" as const },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03]"
                      >
                        <div className="font-semibold text-slate-900">{item.label}</div>
                        <PulseBadge label={item.meta} tone={item.tone} />
                      </div>
                    ))}
                    <Link href="/radar" className="block">
                      <GradientButton className="w-full" variant="secondary">
                        Open radar <ArrowRight className="h-4 w-4" />
                      </GradientButton>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>

            <BentoItem className="xl:col-span-4">
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-slate-900">Waiting on us</h3>
                <div className="mt-3 space-y-2">
                  {waitingMe.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03]"
                    >
                      <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                      <PulseBadge label={item.meta} tone={item.tone} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </BentoItem>

            <BentoItem className="xl:col-span-4">
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-slate-900">Waiting on client</h3>
                <div className="mt-3 space-y-2">
                  {waitingClient.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03]"
                    >
                      <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                      <PulseBadge label={item.meta} tone={item.tone} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </BentoItem>

            <BentoItem className="xl:col-span-4">
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-slate-900">Promises</h3>
                <div className="mt-3 space-y-2">
                  {promises.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03]"
                    >
                      <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                      <PulseBadge label={item.meta} tone={item.tone} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </BentoItem>

            <BentoItem className="xl:col-span-7">
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-slate-900">Today timeline</h3>
                <div className="mt-4 space-y-2">
                  {timeline.map((item) => (
                    <div
                      key={item.time}
                      className="grid gap-2 rounded-[24px] border border-white/70 bg-white/55 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03] md:grid-cols-[70px_1fr_auto]"
                    >
                      <div className="text-sm font-semibold text-slate-900">{item.time}</div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{item.title}</div>
                        <div className="truncate text-xs text-slate-500">{item.meta}</div>
                      </div>
                      <GradientButton variant="ghost" size="sm" className="justify-self-start md:justify-self-end">
                        Open <ArrowRight className="h-4 w-4" />
                      </GradientButton>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </BentoItem>

            <BentoItem className="xl:col-span-5">
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-slate-900">No next step</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Each needs a single decision — even if it’s “wait”.
                </p>
                <div className="mt-3 space-y-2">
                  {noNextStep.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03]"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                        <div className="text-xs text-slate-500">{item.meta}</div>
                      </div>
                      <GradientButton variant="secondary" size="sm">
                        Add step
                      </GradientButton>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </BentoItem>
          </BentoGrid>
        </div>

        <aside className="xl:sticky xl:top-6 xl:h-fit">
          <GlassCard className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">wuug assistant</div>
                <p className="mt-1 text-sm text-slate-600">
                  Say one sentence — I’ll format actions, promises, and messages.
                </p>
              </div>
              <PulseBadge label="AI" tone="neutral" />
            </div>

            <div className="mt-4 space-y-2">
              {[
                "Draft an email to Nordic OÜ: proposal + next step.",
                "Find 3 items missing an owner and assign responsibility.",
                "Create a 25‑minute plan with two breaks.",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="w-full rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 text-left text-sm text-slate-700 shadow-sm ring-1 ring-slate-900/[0.03] hover:bg-white/75"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              <GradientButton>
                <Sparkles className="h-4 w-4" />
                Create plan
              </GradientButton>
              <GradientButton variant="secondary">Open suggestions</GradientButton>
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}

