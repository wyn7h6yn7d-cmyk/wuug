"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Sparkles, X } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { dueSoonItems, focusModeTask, taskGroups, taskMetrics } from "@/lib/mock-data";

const metricToneStyles = {
  blue: "from-blue-100 to-blue-50 text-blue-700",
  violet: "from-violet-100 to-violet-50 text-violet-700",
  orange: "from-orange-100 to-orange-50 text-orange-700",
  green: "from-emerald-100 to-emerald-50 text-emerald-700",
  neutral: "from-slate-100 to-slate-50 text-slate-700",
};

export function TasksView() {
  const [focusModeOpen, setFocusModeOpen] = useState(false);

  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <PageHeader title="Tegevused" subtitle="Kõik sinu ülesanded ühes selges vaates." />
          <button
            onClick={() => setFocusModeOpen(true)}
            className="inline-flex h-fit items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <Sparkles className="h-4 w-4" />
            Fookusrežiim
          </button>
        </div>
      </FadeIn>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {taskMetrics.map((metric, index) => (
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
            {taskGroups.map((group) => (
              <section key={group.title}>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-800">{group.title}</h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                    {group.items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.items.map((task) => (
                    <article
                      key={`${group.title}-${task.title}`}
                      className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 lg:grid-cols-[auto_1.5fr_1fr_0.9fr_0.9fr_auto_auto] lg:items-center"
                    >
                      <span className={`rounded-xl p-2 ${task.iconTone}`}>
                        <task.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{task.title}</p>
                        <p className="truncate text-sm text-slate-500">{task.context}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Tähtaeg</p>
                        <p className="text-sm text-slate-600">{task.due}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Staatus</p>
                        <StatusBadge label={task.status} tone={task.statusTone} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 lg:hidden">Prioriteet</p>
                        <span
                          className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${task.priorityTone}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {task.priority}
                        </span>
                      </div>
                      <button className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-100">
                        Ava
                      </button>
                      <button
                        className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                        aria-label="Rohkem valikuid"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
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
              <h3 className="text-lg font-semibold text-slate-900">Fookus</h3>
              <p className="mt-2 text-sm text-slate-600">
                Sul on täna 8 ülesannet. Alusta kõige olulisemast.
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400" />
              </div>
              <p className="mt-2 text-xs text-slate-500">8 / 8</p>
            </SurfaceCard>
          </FadeIn>

          <FadeIn delay={0.18}>
            <SurfaceCard>
              <h3 className="text-lg font-semibold text-slate-900">Peagi tähtajad</h3>
              <div className="mt-3 space-y-2">
                {dueSoonItems.map((item) => (
                  <div
                    key={item.title}
                    className="grid grid-cols-[64px_1fr] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="rounded-xl bg-white p-2 text-center">
                      <p className="text-xs font-semibold text-slate-500">{item.date}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{item.title}</p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </FadeIn>

          <FadeIn delay={0.22}>
            <SurfaceCard>
              <h3 className="text-lg font-semibold text-slate-900">Kiirtoimingud</h3>
              <div className="mt-3 space-y-2">
                {["Lisa uus tegevus", "Loo korduv tegevus", "Impordi ülesanded", "Vaata minu kalendrit"].map(
                  (action) => (
                    <button
                      key={action}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      {action}
                    </button>
                  ),
                )}
              </div>
            </SurfaceCard>
          </FadeIn>
        </div>
      </div>

      <AnimatePresence>
        {focusModeOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-xl rounded-[28px] border border-[#E5EAF3] bg-white p-6 shadow-[0_16px_40px_rgba(66,86,122,0.2)]"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xl font-semibold text-slate-900">Järgmine parim tegevus</h4>
                <button
                  onClick={() => setFocusModeOpen(false)}
                  aria-label="Sulge fookusrežiim"
                  className="rounded-xl border border-slate-200 p-2 text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-base font-semibold text-blue-700">{focusModeTask.title}</p>
                <p className="mt-1 text-sm text-blue-600">{focusModeTask.context}</p>
                <div className="mt-3 flex items-center gap-2">
                  <StatusBadge label={focusModeTask.status} tone="blue" />
                  <span className="text-sm text-blue-700">{focusModeTask.due}</span>
                </div>
              </div>
              <button
                onClick={() => setFocusModeOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white"
              >
                Ava tegevus
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
