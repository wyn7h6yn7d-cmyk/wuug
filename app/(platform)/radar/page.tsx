import { FeaturePage } from "@/components/ui/feature-page";
import { pageHighlights } from "@/lib/mock-data";

export default function RadarPage() {
  return (
    <FeaturePage
      title="Radar"
      subtitle="Vaata, mis kipub ununema enne kui tekib probleem."
      highlights={pageHighlights.radar}
    />
  );
}
