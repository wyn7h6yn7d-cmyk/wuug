import { Check, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { promiseMetrics, promiseSections } from "@/lib/mock-data";

const metricToneStyles = {
  blue: "from-blue-100 to-blue-50 text-blue-700",
  violet: "from-violet-100 to-violet-50 text-violet-700",
  orange: "from-orange-100 to-orange-50 text-orange-700",
  green: "from-emerald-100 to-emerald-50 text-emerald-700",
  neutral: "from-slate-100 to-slate-50 text-slate-700",
};

export function PromisesView() {
  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader title="Lubadused" subtitle="Kõik kliendile antud lubadused ühes kohas." />
      </FadeIn>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {promiseMetrics.map((metric, index) => (
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
          <SurfaceCard className="space-y-5 p-5">
            {promiseSections.map((section) => (
              <section key={section.title}>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-800">{section.title}</h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                    {section.items.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {section.items.map((item) => (
                    <article
                      key={`${section.title}-${item.title}`}
                      className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 lg:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_auto_auto] lg:items-center"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{item.title}</p>
                        <p className="truncate text-sm text-slate-500">{item.client}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Vastutaja</p>
                        <p className="text-sm text-slate-600">{item.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Tähtaeg</p>
                        <p className="text-sm text-slate-600">{item.due}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Staatus</p>
                        <StatusBadge label={item.status} tone={item.statusTone} />
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100">
                          <Check className="h-4 w-4" />
                          Märgi tehtuks
                        </button>
                        <button
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                          aria-label="Ava lubadus"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </SurfaceCard>
        </FadeIn>

        <div className="space-y-4">
          <FadeIn delay={0.14}>
            <SurfaceCard>
              <h3 className="text-lg font-semibold text-slate-900">Mis on lubadus?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Lubadus on konkreetne asi, mille oled kliendile lubanud kindlaks ajaks teha.
              </p>
            </SurfaceCard>
          </FadeIn>

          <FadeIn delay={0.18}>
            <SurfaceCard>
              <h3 className="text-lg font-semibold text-slate-900">Kiirlisa lubadus</h3>
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Klient"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Lubadus"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Tähtaeg"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Vastutaja"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
                <button className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white">
                  Lisa lubadus
                </button>
              </div>
            </SurfaceCard>
          </FadeIn>

          <FadeIn delay={0.22}>
            <SurfaceCard>
              <h3 className="text-lg font-semibold text-slate-900">Kliendi usaldus</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                  Roheline: kõik lubadused korras
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-700">
                  Kollane: aegumas
                </div>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-red-700">
                  Punane: hilinenud
                </div>
              </div>
            </SurfaceCard>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
