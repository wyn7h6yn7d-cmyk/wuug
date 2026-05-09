import { FeaturePage } from "@/components/ui/feature-page";
import { pageHighlights } from "@/lib/mock-data";

export default function PromisesPage() {
  return (
    <FeaturePage
      title="Lubadused"
      subtitle="Hoia kliendile antud lubadused nähtaval ja kontrolli all."
      highlights={pageHighlights.promises}
    />
  );
}
