import { FeaturePage } from "@/components/ui/feature-page";
import { pageHighlights } from "@/lib/mock-data";

export default function TasksPage() {
  return (
    <FeaturePage
      title="Tegevused"
      subtitle="Kõik järgmised sammud prioriteetselt ja selgelt."
      highlights={pageHighlights.tasks}
    />
  );
}
