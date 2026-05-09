import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { radarMetrics, radarSections, radarSuggestions } from "@/lib/mock-data";

const metricToneStyles = {
  blue: "from-blue-100 to-blue-50 text-blue-700",
  violet: "from-violet-100 to-violet-50 text-violet-700",
  orange: "from-orange-100 to-orange-50 text-orange-700",
  green: "from-emerald-100 to-emerald-50 text-emerald-700",
  neutral: "from-slate-100 to-slate-50 text-slate-700",
};

const sectionTones = {
  blue: "border-blue-100 bg-blue-50/60",
  violet: "border-violet-100 bg-violet-50/60",
  orange: "border-orange-100 bg-orange-50/60",
  neutral: "border-slate-200 bg-slate-50/70",
  green: "border-emerald-100 bg-emerald-50/60",
};

export function RadarView() {
  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader
          title="Radar"
          subtitle="Asjad, mis vajavad tähelepanu enne kui need probleemiks muutuvad."
        />
      </FadeIn>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {radarMetrics.map((metric, index) => (
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
          <div className="grid gap-4 md:grid-cols-2">
            {radarSections.map((section, index) => (
              <SurfaceCard key={section.title} className="p-5">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                  </div>
                  <StatusBadge label={`${section.items.length}`} tone={section.tone} />
                </div>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <article
                      key={`${section.title}-${item.name}`}
                      className={`rounded-2xl border p-3 ${sectionTones[section.tone]}`}
                    >
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.meta}</p>
                      <p className="mt-2 text-xs font-medium text-slate-700">{item.action}</p>
                    </article>
                  ))}
                </div>
                {index === 1 ? (
                  <p className="mt-3 text-xs text-orange-600">
                    Riskid on esitatud pehme hoiatusena, et säilitada rahulik töövaade.
                  </p>
                ) : null}
              </SurfaceCard>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.16}>
          <SurfaceCard>
            <h3 className="text-lg font-semibold text-slate-900">wuug soovitab</h3>
            <div className="mt-3 space-y-2">
              {radarSuggestions.map((suggestion) => (
                <p key={suggestion} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                  {suggestion}
                </p>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <button className="w-full rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                Lisa järgmine samm
              </button>
              <button className="w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
                Saada meeldetuletus
              </button>
              <button className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                Määra vastutaja
              </button>
            </div>
          </SurfaceCard>
        </FadeIn>
      </div>
    </div>
  );
}
