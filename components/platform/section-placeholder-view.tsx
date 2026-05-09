import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { PulseBadge } from "@/components/command-center/pulse-badge";
import { PageHeader } from "@/components/ui/page-header";

type SectionPlaceholderViewProps = {
  title: string;
  subtitle: string;
  highlights: string[];
};

export function SectionPlaceholderView({ title, subtitle, highlights }: SectionPlaceholderViewProps) {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <PageHeader title={title} subtitle={subtitle} />
        <div className="flex items-center gap-2">
          <PulseBadge label="Mock-andmed" tone="neutral" />
          <GradientButton variant="secondary">Lisa uus</GradientButton>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-slate-600">
            See vaade on osa uuest wuug command-center suunast. Järgmises etapis seome selle päris andmetega.
          </p>
          <div className="mt-4 space-y-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-900/[0.03]"
              >
                {item}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">AI tööriistad</h3>
          <p className="mt-2 text-sm text-slate-600">
            Siia koondame soovitused ja 1-kliki toimingud, et vältida “rohkem tabeleid” tunnet.
          </p>
          <div className="mt-4 grid gap-2">
            <GradientButton>Tee plaan</GradientButton>
            <GradientButton variant="secondary">Loo sõnum</GradientButton>
            <GradientButton variant="ghost">Vaata radarit</GradientButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

