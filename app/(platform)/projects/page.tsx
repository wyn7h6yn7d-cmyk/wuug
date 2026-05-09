import { SectionPlaceholderView } from "@/components/platform/section-placeholder-view";

export default function ProjectsPage() {
  return (
    <SectionPlaceholderView
      title="Projektid"
      subtitle="Projektid uues command-center vaates — selge, rahulik, tegutsetav."
      highlights={[
        "2 projekti on vaikse riskiga",
        "3 projekti ootavad kliendi kinnitust",
        "1 projekt vajab omanikku",
      ]}
    />
  );
}
