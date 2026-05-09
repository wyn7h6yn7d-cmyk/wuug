import { FeaturePage } from "@/components/ui/feature-page";
import { pageHighlights } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <FeaturePage
      title="Seaded"
      subtitle="Kohanda töölauda, teavitusi ja meeskonna töövoogu."
      highlights={pageHighlights.settings}
    />
  );
}
