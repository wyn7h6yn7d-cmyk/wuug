import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { FadeIn } from "@/components/ui/fade-in";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  integrations,
  settingsCompany,
  settingsNotificationToggles,
  settingsUsers,
  workflowStatuses,
} from "@/lib/mock-data";

export function SettingsView() {
  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader title="Seaded" subtitle="Kohanda töölauda, teavitusi ja meeskonna töövoogu." />
      </FadeIn>

      <div className="grid gap-4">
        <FadeIn delay={0.05}>
          <SurfaceCard>
            <h2 className="text-lg font-semibold text-slate-900">Ettevõte</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Ettevõtte nimi</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{settingsCompany.name}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Logo</p>
                <div className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-violet-100 to-teal-100 text-xs font-semibold text-slate-700">
                  {settingsCompany.logo}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Valdkond</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{settingsCompany.industry}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Ajavöönd</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{settingsCompany.timezone}</p>
              </div>
            </div>
          </SurfaceCard>
        </FadeIn>

        <FadeIn delay={0.08}>
          <SurfaceCard>
            <h2 className="text-lg font-semibold text-slate-900">Kasutajad</h2>
            <div className="mt-4 space-y-2">
              {settingsUsers.map((user) => (
                <div
                  key={user.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-700">
                      {user.name.slice(0, 1)}
                    </span>
                    <p className="text-sm font-medium text-slate-700">{user.name}</p>
                  </div>
                  <StatusBadge label={user.role} tone={user.role === "Omanik" ? "blue" : "neutral"} />
                </div>
              ))}
            </div>
          </SurfaceCard>
        </FadeIn>

        <div className="grid gap-4 lg:grid-cols-2">
          <FadeIn delay={0.11}>
            <SurfaceCard>
              <h2 className="text-lg font-semibold text-slate-900">Teavitused</h2>
              <div className="mt-4 space-y-2">
                {settingsNotificationToggles.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <p className="text-sm text-slate-700">{item.label}</p>
                    <button
                      className={`relative h-6 w-11 rounded-full transition ${
                        item.enabled ? "bg-blue-500" : "bg-slate-300"
                      }`}
                      aria-label={item.label}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                          item.enabled ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </FadeIn>

          <FadeIn delay={0.14}>
            <SurfaceCard>
              <h2 className="text-lg font-semibold text-slate-900">Töövoog</h2>
              <div className="mt-4 space-y-2">
                {workflowStatuses.map((status) => (
                  <div
                    key={status}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {status}
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </FadeIn>
        </div>

        <FadeIn delay={0.18}>
          <SurfaceCard>
            <h2 className="text-lg font-semibold text-slate-900">Integratsioonid</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((integration) => (
                <div
                  key={integration}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm font-medium text-slate-700">{integration}</p>
                  <StatusBadge label="Tulekul" tone="violet" />
                </div>
              ))}
            </div>
          </SurfaceCard>
        </FadeIn>
      </div>
    </div>
  );
}
