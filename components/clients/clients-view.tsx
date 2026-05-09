"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { ChevronRight, Search } from "lucide-react";

const metricToneStyles = {
  blue: "from-blue-100 to-blue-50 text-blue-700",
  violet: "from-violet-100 to-violet-50 text-violet-700",
  orange: "from-orange-100 to-orange-50 text-orange-700",
  neutral: "from-slate-100 to-slate-50 text-slate-700",
};

export type ClientsViewClient = {
  id: string;
  name: string;
  initials: string;
  contactName: string;
  contactEmail: string;
  status: string;
  statusTone: "blue" | "violet" | "orange" | "green" | "neutral";
  nextStep: string;
  due: string;
  owner: string;
  hasNextStep: boolean;
  note: string;
  activeProject: string;
};

type ClientsViewProps = {
  clients: ClientsViewClient[];
  metrics: {
    active: number;
    needsResponse: number;
    highPriority: number;
    noNextStep: number;
  };
};

export function ClientsView({ clients, metrics }: ClientsViewProps) {
  const selectedClient = clients[0];
  const clientMetrics = [
    { title: "Aktiivsed kliendid", value: String(metrics.active), tone: "blue" as const },
    { title: "Vajavad vastust", value: String(metrics.needsResponse), tone: "violet" as const },
    { title: "Kõrge prioriteet", value: String(metrics.highPriority), tone: "orange" as const },
    { title: "Ilma järgmise sammuta", value: String(metrics.noNextStep), tone: "neutral" as const },
  ];

  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader title="Kliendid" subtitle="Kõik kliendid ja nende järgmised sammud ühes selges vaates." />
      </FadeIn>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {clientMetrics.map((metric, index) => (
          <FadeIn key={metric.title} delay={0.04 * index}>
            <GlassCard className="space-y-2 p-5">
              <p className="text-sm text-slate-500">{metric.title}</p>
              <div
                className={
                  "inline-flex rounded-2xl bg-gradient-to-r px-4 py-2 text-lg font-semibold " +
                  metricToneStyles[metric.tone]
                }
              >
                {metric.value}
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <FadeIn delay={0.1}>
          <GlassCard className="p-5">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/70 bg-white/55 px-3 py-2 shadow-sm ring-1 ring-slate-900/[0.03]">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Otsi klienti..."
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              {clients.map((client) => (
                <article
                  key={client.id}
                  className="grid gap-3 rounded-2xl border border-white/70 bg-white/55 p-3 shadow-sm ring-1 ring-slate-900/[0.03] lg:grid-cols-[1.7fr_1.4fr_0.9fr_1.3fr_1fr_0.9fr_0.6fr] lg:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{client.name}</p>
                    {!client.hasNextStep ? <StatusBadge label="Järgmine samm puudub" tone="orange" className="mt-2" /> : null}
                  </div>
                  <div className="min-w-0 text-sm text-slate-700">
                    <p className="truncate font-medium text-slate-900">{client.contactName}</p>
                    <p className="truncate text-slate-600">{client.contactEmail || "—"}</p>
                  </div>
                  <StatusBadge label={client.status} tone={client.statusTone} />
                  <div className="text-sm text-slate-800">{client.hasNextStep ? client.nextStep : "-"}</div>
                  <div className="text-sm text-slate-700">{client.due}</div>
                  <div className="text-sm text-slate-700">{client.owner}</div>
                  <GradientButton size="sm" variant="secondary">Ava</GradientButton>
                </article>
              ))}
            </div>
          </GlassCard>
        </FadeIn>

        {selectedClient ? (
          <FadeIn delay={0.15}>
            <GlassCard className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(99,102,241,0.18)_0%,rgba(168,85,247,0.12)_45%,rgba(20,184,166,0.12)_100%)] text-sm font-semibold text-slate-800 ring-1 ring-white/70">
                  {selectedClient.initials}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedClient.name}</h3>
                  <StatusBadge label={selectedClient.status} tone={selectedClient.statusTone} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm ring-1 ring-slate-900/[0.03]">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Järgmine samm</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{selectedClient.nextStep || "—"}</p>
                <p className="mt-1 text-xs text-slate-600">{selectedClient.due}</p>
              </div>

              <button className="inline-flex w-full items-center justify-center gap-1 rounded-[22px] bg-[linear-gradient(90deg,rgba(99,102,241,1)_0%,rgba(168,85,247,1)_45%,rgba(20,184,166,1)_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(99,102,241,0.22)] hover:opacity-95 active:scale-[0.99]">
                Ava tegevus <ChevronRight className="h-4 w-4" />
              </button>
            </GlassCard>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
}
