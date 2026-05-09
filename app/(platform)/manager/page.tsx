import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";

export default function ManagerPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Juht" subtitle="Peagi. Siin tuleb juhtpaneel ja ülevaated." />
      <SurfaceCard className="p-6 text-sm text-slate-600">
        See vaade on ajutiselt lihtsustatud, et hoida build stabiilne.
      </SurfaceCard>
    </div>
  );
}
