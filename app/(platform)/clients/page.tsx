import { FeaturePage } from "@/components/ui/feature-page";
import { pageHighlights } from "@/lib/mock-data";

export default function ClientsPage() {
  return (
    <FeaturePage
      title="Kliendid"
      subtitle="Halda kliendisuhteid ilma liigse CRM-i keerukuseta."
      highlights={pageHighlights.clients}
    />
  );
}
