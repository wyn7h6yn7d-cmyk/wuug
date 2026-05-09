import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, Clock3, Sparkles, ListChecks } from "lucide-react";
import { CommandBar } from "@/components/command-center/command-bar";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { PulseBadge } from "@/components/command-center/pulse-badge";
import { BentoGrid, BentoItem } from "@/components/command-center/bento-grid";
import { RadarVisual } from "@/components/command-center/radar-visual";

const commandChips = [
  { key: "email", label: "Kirjuta e-kiri Nordic OÜ-le" },
  { key: "next", label: "Mis on järgmine parim samm?" },
  { key: "radar", label: "Näita riskiradarit" },
  { key: "plan", label: "Tee päevaplaan 25 minutiga" },
];

const nextBestAction = {
  title: "Saada pakkumine Nordic OÜ-le",
  context: "Tähtaeg täna 11:00 • Ootab kinnitust enne arenduse alustamist",
  why: "Kui see läheb täna välja, avad reaalse liikumise ja vähendad 2 seotud riski.",
};

const waitingMe = [
  { label: "2 kinnitamist", meta: "disainivariandid", tone: "warn" as const },
  { label: "1 otsus", meta: "projektisuund", tone: "neutral" as const },
  { label: "1 ülevaatus", meta: "lepingu mustand", tone: "warn" as const },
];

const waitingClient = [
  { label: "3 vastust", meta: "kliendilt", tone: "calm" as const },
  { label: "2 kinnitust", meta: "tähtaegadele", tone: "warn" as const },
];

const promises = [
  { label: "4 lubadust", meta: "aegumas 7 päeva", tone: "warn" as const },
  { label: "2 lubadust", meta: "hilinenud", tone: "risk" as const },
];

const timeline = [
  { time: "09:30", title: "Kohtumine: Greenfield OÜ", meta: "30 min" },
  { time: "11:00", title: "Pakkumine: Nordic OÜ", meta: "tänane fookus" },
  { time: "14:00", title: "Kõne: Lumen OÜ", meta: "täpsusta ulatus" },
];

const noNextStep = [
  { label: "Põhjanael Stuudio", meta: "viimane kontakt 8 päeva" },
  { label: "Wave OÜ", meta: "projektil pole omanikku" },
  { label: "Buildit OÜ", meta: "ootab sisendit" },
];

export function TodaysPulseView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Tere, Eleonora
            </h1>
            <PulseBadge label="Tänane pulss" tone="calm" />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Sul on täna <span className="font-semibold text-slate-900">3 asja</span>, mis päriselt loevad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GradientButton variant="secondary">
            <Sparkles className="h-4 w-4" />
            Tee plaan
          </GradientButton>
          <GradientButton>
            <ListChecks className="h-4 w-4" />
            Ava fookus
          </GradientButton>
        </div>
      </div>

      <GlassCard className="p-5">
        <CommandBar
          placeholder="Küsi wuugilt või otsi klienti, projekti, tegevust…"
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
                        <h2 className="text-xl font-semibold text-slate-900">Järgmine parim tegevus</h2>
                        <PulseBadge label="AI soovitus" tone="neutral" />
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
                      Ava <ArrowRight className="h-4 w-4" />
                    </GradientButton>
                    <GradientButton size="sm" variant="secondary">
                      <CheckCircle2 className="h-4 w-4" />
                      Märgi tehtuks
                    </GradientButton>
                    <GradientButton size="sm" variant="ghost">
                      Lükka edasi
                    </GradientButton>
                    <GradientButton size="sm" variant="secondary">
                      <Mail className="h-4 w-4" />
                      Loo e-kiri AI-ga
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
                      6 asja on vaikse riskiga — tõsta need enne, kui muutuvad kiireks tulekahjuks.
                    </p>
                  </div>
                  <PulseBadge label="Tähelepanu" tone="warn" />
                </div>

                <div className="mt-4 grid items-center gap-4 md:grid-cols-[180px_1fr]">
                  <RadarVisual
                    className="mx-auto max-w-[220px]"
                    blips={[
                      { id: "a", x: 0.25, y: 0.35, tone: "orange" },
                      { id: "b", x: 0.62, y: 0.28, tone: "violet" },
                      { id: "c", x: 0.42, y: 0.64, tone: "blue" },
                      { id: "d", x: 0.75, y: 0.62, tone: "orange" },
                    ]}
                  />
                  <div className="space-y-2">
                    {[
                      { label: "Seisab", meta: "5 klienti", tone: "warn" as const },
                      { label: "Riskis", meta: "2 projekti", tone: "risk" as const },
                      { label: "Aegub", meta: "4 lubadust", tone: "warn" as const },
                      { label: "Omanik puudub", meta: "3 kirjet", tone: "neutral" as const },
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
                        Ava radar <ArrowRight className="h-4 w-4" />
                      </GradientButton>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>

            <BentoItem className="xl:col-span-4">
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-slate-900">Ootab meid</h3>
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
                <h3 className="text-base font-semibold text-slate-900">Ootab klienti</h3>
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
                <h3 className="text-base font-semibold text-slate-900">Lubadused</h3>
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
                <h3 className="text-base font-semibold text-slate-900">Tänane ajajoon</h3>
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
                        Ava <ArrowRight className="h-4 w-4" />
                      </GradientButton>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </BentoItem>

            <BentoItem className="xl:col-span-5">
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-slate-900">Ilma järgmise sammuta</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Need vajavad ühte otsust — isegi kui see on “oota”.
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
                        Lisa samm
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
                  Ütle üks lause — ma vormistan tegevused, lubadused ja sõnumid.
                </p>
              </div>
              <PulseBadge label="AI" tone="neutral" />
            </div>

            <div className="mt-4 space-y-2">
              {[
                "Koosta e-kiri Nordic OÜ-le: pakkumine + järgmine samm.",
                "Tuvasta 3 kirjet, millel puudub omanik, ja määra vastutaja.",
                "Koosta 25-minutiline päevaplaan koos 2 pausiga.",
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
                Tee plaan
              </GradientButton>
              <GradientButton variant="secondary">Ava soovitused</GradientButton>
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}

