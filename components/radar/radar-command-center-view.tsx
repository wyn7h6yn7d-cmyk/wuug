import Link from "next/link";
import { ArrowRight, Sparkles, UserRound, Timer, AlertTriangle, PauseCircle } from "lucide-react";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { PulseBadge } from "@/components/command-center/pulse-badge";
import { RadarVisual } from "@/components/command-center/radar-visual";
import { BentoGrid, BentoItem } from "@/components/command-center/bento-grid";

type RadarItem = {
  title: string;
  meta: string;
  tag: "Seisab" | "Riskis" | "Aegub" | "Omanik puudub";
  tone: "warn" | "risk" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
};

const items: RadarItem[] = [
  {
    title: "Nordic OÜ",
    meta: "pole liikunud 6 päeva • järgmine samm: pakkumine",
    tag: "Seisab",
    tone: "warn",
    icon: PauseCircle,
  },
  {
    title: "Projekt: Veebilehe arendus",
    meta: "tähtaeg 11. juuni • ootab kinnitust",
    tag: "Riskis",
    tone: "risk",
    icon: AlertTriangle,
  },
  {
    title: "Lubadus: saata lepingu mustand",
    meta: "aegub homme • klient: Scandium Kinnisvara",
    tag: "Aegub",
    tone: "warn",
    icon: Timer,
  },
  {
    title: "Uus päring: Wave OÜ",
    meta: "omanik määramata • vajab vastutajat",
    tag: "Omanik puudub",
    tone: "neutral",
    icon: UserRound,
  },
];

const tagTone: Record<RadarItem["tag"], "calm" | "warn" | "risk" | "neutral"> = {
  Seisab: "warn",
  Riskis: "risk",
  Aegub: "warn",
  "Omanik puudub": "neutral",
};

export function RadarCommandCenterView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Radar</h1>
            <PulseBadge label="Attention center" tone="warn" />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Siin on asjad, mis vajavad tähelepanu enne kui need muutuvad probleemiks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GradientButton variant="secondary">
            <Sparkles className="h-4 w-4" />
            AI soovitused
          </GradientButton>
          <Link href="/" className="hidden md:block">
            <GradientButton>
              Ava tänane pulss <ArrowRight className="h-4 w-4" />
            </GradientButton>
          </Link>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-5">
          <GlassCard className="p-6">
            <div className="grid items-center gap-4 md:grid-cols-[220px_1fr]">
              <RadarVisual
                className="mx-auto max-w-[240px]"
                blips={[
                  { id: "a", x: 0.22, y: 0.38, tone: "orange" },
                  { id: "b", x: 0.62, y: 0.26, tone: "violet" },
                  { id: "c", x: 0.42, y: 0.66, tone: "blue" },
                  { id: "d", x: 0.78, y: 0.64, tone: "orange" },
                  { id: "e", x: 0.52, y: 0.46, tone: "neutral" },
                ]}
              />
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <PulseBadge label="Seisab: 5" tone="warn" />
                  <PulseBadge label="Riskis: 2" tone="risk" />
                  <PulseBadge label="Aegub: 4" tone="warn" />
                  <PulseBadge label="Omanik puudub: 3" tone="neutral" />
                </div>
                <p className="text-sm text-slate-600">
                  Eesmärk pole “rohkem tööd”, vaid <span className="font-semibold text-slate-900">vähem üllatusi</span>.
                  Vali üks kaart ja tee üks otsus.
                </p>
                <div className="flex flex-wrap gap-2">
                  <GradientButton size="sm">Vaata kriitilisi</GradientButton>
                  <GradientButton size="sm" variant="secondary">
                    Vaata seisvaid
                  </GradientButton>
                </div>
              </div>
            </div>
          </GlassCard>

          <BentoGrid>
            <BentoItem className="xl:col-span-12">
              <GlassCard className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Signaalid</h2>
                    <p className="mt-1 text-sm text-slate-600">Kaardid, mitte tabelid. Selge, tegutsetav, rahulik.</p>
                  </div>
                  <PulseBadge label="Mock-andmed" tone="neutral" />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article
                        key={`${item.tag}-${item.title}`}
                        className="rounded-[26px] border border-white/70 bg-white/55 p-4 shadow-sm ring-1 ring-slate-900/[0.03] hover:-translate-y-0.5 hover:bg-white/70"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-[22px] border border-white/70 bg-white/60 shadow-sm ring-1 ring-slate-900/[0.03]">
                              <Icon className="h-5 w-5 text-slate-700" />
                            </span>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-slate-900">{item.title}</div>
                              <div className="mt-1 truncate text-xs text-slate-500">{item.meta}</div>
                            </div>
                          </div>
                          <PulseBadge label={item.tag} tone={tagTone[item.tag]} />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <GradientButton size="sm">Ava</GradientButton>
                          <GradientButton size="sm" variant="secondary">
                            Tee järgmine samm
                          </GradientButton>
                          <GradientButton size="sm" variant="ghost">
                            Lükka edasi
                          </GradientButton>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </GlassCard>
            </BentoItem>
          </BentoGrid>
        </div>

        <aside className="xl:sticky xl:top-6 xl:h-fit">
          <GlassCard className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">AI soovitab</div>
                <p className="mt-1 text-sm text-slate-600">
                  Kui valid ühe signaali, annan 2-3 mikro-sammu ja pakun valmis sõnumi kliendile.
                </p>
              </div>
              <PulseBadge label="wuug AI" tone="neutral" />
            </div>

            <div className="mt-4 space-y-2">
              {[
                "Nordic OÜ: kirjuta 2-lõiguline “kas kinnitame täna?” e-kiri.",
                "Projekt riskis: tee 3 valikuga otsus ja lukusta uus tähtaeg.",
                "Omanik puudub: määra vastutaja ja lisa 1. samm 5 minutiga.",
              ].map((rec) => (
                <button
                  key={rec}
                  type="button"
                  className="w-full rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 text-left text-sm text-slate-700 shadow-sm ring-1 ring-slate-900/[0.03] hover:bg-white/75"
                >
                  {rec}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              <GradientButton>
                <Sparkles className="h-4 w-4" />
                Tee plaan
              </GradientButton>
              <GradientButton variant="secondary">Loo sõnum</GradientButton>
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}

