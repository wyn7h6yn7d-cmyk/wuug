import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";

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
          <Link href="/tasks">
            <GradientButton variant="secondary">Open tasks</GradientButton>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-slate-600">
            This view is part of wuug’s new command-center direction. In the next phase we’ll connect it to real data.
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
            <Link href="/tasks">
              <GradientButton>Create plan</GradientButton>
            </Link>
            <Link href="/clients">
              <GradientButton variant="secondary">Draft message</GradientButton>
            </Link>
            <Link href="/radar">
              <GradientButton variant="ghost">Open radar</GradientButton>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

