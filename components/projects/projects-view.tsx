import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { projectColumns, projectMetrics, projectsBoard, selectedProject } from "@/lib/mock-data";
import { ChevronRight } from "lucide-react";

const metricToneStyles = {
  blue: "from-blue-100 to-blue-50 text-blue-700",
  violet: "from-violet-100 to-violet-50 text-violet-700",
  orange: "from-orange-100 to-orange-50 text-orange-700",
  green: "from-emerald-100 to-emerald-50 text-emerald-700",
  neutral: "from-slate-100 to-slate-50 text-slate-700",
};

export function ProjectsView() {
  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader
          title="Projektid"
          subtitle="Lihtne ülevaade aktiivsetest projektidest ja järgmistest sammudest."
        />
      </FadeIn>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {projectMetrics.map((metric, index) => (
          <FadeIn key={metric.title} delay={0.04 * index}>
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
          <SurfaceCard className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                Kõik projektid
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                Kõik kliendid
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                Staatus
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                Vastutaja
              </button>
            </div>

            <div className="grid gap-3 xl:grid-cols-4">
              {projectColumns.map((column) => {
                const items = projectsBoard.filter((project) => project.column === column.key);
                return (
                  <div key={column.key} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">{column.label}</h3>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">
                        {items.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {items.map((project) => (
                        <article
                          key={project.title}
                          className="rounded-2xl border border-slate-200 bg-white p-3 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(66,86,122,0.08)]"
                        >
                          <h4 className="text-sm font-semibold text-slate-800">{project.title}</h4>
                          <p className="mt-0.5 text-xs text-slate-500">{project.client}</p>
                          <p className="mt-2 text-xs text-slate-500">Tähtaeg: {project.deadline}</p>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{project.progress}%</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {project.hasNextStep ? (
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                {project.nextStep}
                              </span>
                            ) : (
                              <StatusBadge label="Järgmine samm puudub" tone="orange" />
                            )}
                            <StatusBadge label={project.status} tone={project.statusTone} />
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </SurfaceCard>
        </FadeIn>

        <FadeIn delay={0.16}>
          <SurfaceCard className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{selectedProject.title}</h3>
              <p className="text-sm text-slate-500">{selectedProject.client}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Edenemine</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{selectedProject.progress}%</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400"
                  style={{ width: `${selectedProject.progress}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>Eeldatav valmimine: {selectedProject.expectedFinish}</p>
              <p className="mt-1">Järgmine verstapost: {selectedProject.nextMilestone}</p>
              <p className="mt-1">Vastutaja: {selectedProject.owner}</p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Kontrollnimekiri</p>
              <ul className="mt-2 space-y-2">
                {selectedProject.checklist.map((item, index) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-blue-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-blue-500">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button className="inline-flex w-full items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(97,107,255,0.28)] hover:opacity-95 active:scale-[0.99]">
              Ava projekt <ChevronRight className="h-4 w-4" />
            </button>
          </SurfaceCard>
        </FadeIn>
      </div>
    </div>
  );
}
