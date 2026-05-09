import { quickAddItems, stalledItems, todayTasks, topMetrics, focusInsights } from "@/lib/mock-data";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { ChevronRight } from "lucide-react";

const metricToneStyles = {
  blue: "from-blue-100 to-blue-50 text-blue-700",
  violet: "from-violet-100 to-violet-50 text-violet-700",
  orange: "from-orange-100 to-orange-50 text-orange-700",
  neutral: "from-slate-100 to-slate-50 text-slate-700",
};

export function DashboardView() {
  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader title="Tere, Eleonora 👋" subtitle="Siin on sinu tänane töölaud." />
      </FadeIn>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topMetrics.map((metric, index) => (
          <FadeIn key={metric.title} delay={0.05 * index}>
            <SurfaceCard className="space-y-2 p-5">
              <p className="text-sm text-slate-500">{metric.title}</p>
              <div
                className={`inline-flex rounded-2xl bg-gradient-to-r px-4 py-2 text-lg font-semibold ${metricToneStyles[metric.tone]}`}
              >
                {metric.value}
              </div>
            </SurfaceCard>
          </FadeIn>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <FadeIn delay={0.1}>
          <SurfaceCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Minu töölaud</h2>
              <button className="text-sm font-medium text-blue-600">Vaata kõiki</button>
            </div>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.title}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="rounded-xl bg-white p-2 text-slate-600">
                      <task.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">{task.title}</p>
                      <p className="truncate text-sm text-slate-500">{task.context}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-500">{task.due}</p>
                    <StatusBadge label={task.status} tone={task.tone} />
                    <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                      Ava <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </FadeIn>

        <div className="space-y-4">
          <FadeIn delay={0.15}>
            <SurfaceCard>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Kiirlisa</h3>
              <div className="space-y-2">
                {quickAddItems.map((item) => (
                  <button
                    key={item}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </SurfaceCard>
          </FadeIn>

          <FadeIn delay={0.2}>
            <SurfaceCard>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Fookus täna</h3>
              <ul className="space-y-3">
                {focusInsights.map((insight) => (
                  <li key={insight} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                    {insight}
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.25}>
        <SurfaceCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Seisvad asjad</h2>
            <StatusBadge label="Vajab tähelepanu" tone="orange" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {stalledItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <item.icon className="mb-2 h-5 w-5 text-slate-500" />
                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{item.title}</p>
                <p className="mt-2 text-xs text-slate-500">{item.helper}</p>
              </article>
            ))}
          </div>
        </SurfaceCard>
      </FadeIn>
    </div>
  );
}
