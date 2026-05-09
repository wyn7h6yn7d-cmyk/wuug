import { GlassCard } from "@/components/command-center/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { PressableLink } from "@/components/ui/pressable-link";

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
          <PressableLink href="/tasks" variant="secondary" size="sm">
            Open tasks
          </PressableLink>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use the shortcuts below to keep work moving while we finish this area.
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
          <h3 className="text-lg font-semibold text-slate-900">AI tools</h3>
          <p className="mt-2 text-sm text-slate-600">
            This is where we’ll collect suggestions and one-click actions—without turning the product into “more tables”.
          </p>
          <div className="mt-4 grid gap-2">
            <PressableLink href="/tasks" variant="primary" fullWidth>
              Create plan
            </PressableLink>
            <PressableLink href="/clients" variant="secondary" fullWidth>
              Draft message
            </PressableLink>
            <PressableLink href="/radar" variant="ghost" fullWidth>
              Open radar
            </PressableLink>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
