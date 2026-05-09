import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatusBadge } from "@/components/ui/status-badge";

type FeaturePageProps = {
  title: string;
  subtitle: string;
  highlights: string[];
};

export function FeaturePage({ title, subtitle, highlights }: FeaturePageProps) {
  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader title={title} subtitle={subtitle} />
      </FadeIn>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <FadeIn delay={0.08}>
          <SurfaceCard>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mb-5 text-sm text-slate-500">
              This view is ready as a UI foundation. In the next phase we’ll connect it to real data.
            </p>
            <div className="space-y-3">
              {highlights.map((item) => (
                <article key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-700">{item}</p>
                </article>
              ))}
            </div>
          </SurfaceCard>
        </FadeIn>
        <FadeIn delay={0.12}>
          <SurfaceCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Ready to connect</h3>
              <StatusBadge label="Mock data" tone="violet" />
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="rounded-2xl bg-blue-50 p-3">Reusable cards and status badges</li>
              <li className="rounded-2xl bg-violet-50 p-3">Consistent navigation and top bar across pages</li>
              <li className="rounded-2xl bg-emerald-50 p-3">Ready mock data structure in `lib/mock-data.ts`</li>
            </ul>
          </SurfaceCard>
        </FadeIn>
      </div>
    </div>
  );
}
