import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";

export default function ManagerPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Command Center" subtitle="Coming soon. This will become the manager cockpit." />
      <SurfaceCard className="p-6 text-sm text-slate-600">
        This view is temporarily simplified to keep the build stable.
      </SurfaceCard>
    </div>
  );
}
