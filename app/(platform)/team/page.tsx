import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tiim" subtitle="Peagi. Siin tuleb töökoormuse ja rollide ülevaade." />
      <SurfaceCard className="p-6 text-sm text-slate-600">
        See vaade on ajutiselt lihtsustatud, et hoida build stabiilne.
      </SurfaceCard>
    </div>
  );
}
