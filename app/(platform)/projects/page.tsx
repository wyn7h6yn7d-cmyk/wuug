import { FeaturePage } from "@/components/ui/feature-page";
import { pageHighlights } from "@/lib/mock-data";

export default function ProjectsPage() {
  return (
    <FeaturePage
      title="Projektid"
      subtitle="Jälgi edenemist, riske ja järgmisi samme ühes vaates."
      highlights={pageHighlights.projects}
    />
  );
}
