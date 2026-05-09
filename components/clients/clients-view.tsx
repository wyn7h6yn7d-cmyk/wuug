import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { clientMetrics, clientsList } from "@/lib/mock-data";
import { ChevronRight, Search } from "lucide-react";

const metricToneStyles = {
  blue: "from-blue-100 to-blue-50 text-blue-700",
  violet: "from-violet-100 to-violet-50 text-violet-700",
  orange: "from-orange-100 to-orange-50 text-orange-700",
  neutral: "from-slate-100 to-slate-50 text-slate-700",
};

const selectedClient = clientsList[0];

export function ClientsView() {
  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader
          title="Kliendid"
          subtitle="Kõik kliendid ja nende järgmised sammud ühes selges vaates."
        />
      </FadeIn>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {clientMetrics.map((metric, index) => (
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
          <SurfaceCard className="p-5">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Otsi klienti..."
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  Kõik staatused
                </button>
                <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  Kõik vastutajad
                </button>
                <button className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                  Ainult tähelepanu vajavad
                </button>
              </div>
            </div>

            <div className="mb-2 hidden grid-cols-[1.7fr_1.4fr_0.9fr_1.3fr_1fr_0.9fr_0.6fr] gap-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:grid">
              <p>Klient</p>
              <p>Kontakt</p>
              <p>Staatus</p>
              <p>Järgmine samm</p>
              <p>Tähtaeg</p>
              <p>Vastutaja</p>
              <p />
            </div>

            <div className="space-y-2">
              {clientsList.map((client) => (
                <article
                  key={client.name}
                  className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 lg:grid-cols-[1.7fr_1.4fr_0.9fr_1.3fr_1fr_0.9fr_0.6fr] lg:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{client.name}</p>
                    {!client.hasNextStep ? (
                      <StatusBadge
                        label="Järgmine samm puudub"
                        tone="orange"
                        className="mt-2"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 text-sm text-slate-600">
                    <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Kontakt</p>
                    <p className="truncate font-medium text-slate-700">{client.contactName}</p>
                    <p className="truncate text-slate-500">{client.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Staatus</p>
                    <StatusBadge label={client.status} tone={client.statusTone} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Järgmine samm</p>
                    <p className="text-sm text-slate-700">{client.hasNextStep ? client.nextStep : "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Tähtaeg</p>
                    <p className="text-sm text-slate-600">{client.due}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Vastutaja</p>
                    <p className="text-sm text-slate-600">{client.owner}</p>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-100">
                    Ava
                  </button>
                </article>
              ))}
            </div>
          </SurfaceCard>
        </FadeIn>

        <FadeIn delay={0.15}>
          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-violet-100 to-teal-100 text-sm font-semibold text-slate-700">
                {selectedClient.initials}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selectedClient.name}</h3>
                <StatusBadge label={selectedClient.status} tone={selectedClient.statusTone} />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Kontakt</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{selectedClient.contactName}</p>
              <p className="text-sm text-slate-500">{selectedClient.contactEmail}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Märkus</p>
              <p className="mt-1 text-sm text-slate-600">{selectedClient.note}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Aktiivne projekt
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">{selectedClient.activeProject}</p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Järgmine samm</p>
              <p className="mt-1 text-sm font-semibold text-blue-700">{selectedClient.nextStep}</p>
              <p className="mt-1 text-xs text-blue-600">{selectedClient.due}</p>
            </div>

            <button className="inline-flex w-full items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(97,107,255,0.28)]">
              Ava tegevus <ChevronRight className="h-4 w-4" />
            </button>
          </SurfaceCard>
        </FadeIn>
      </div>
    </div>
  );
}
