import { SectionPlaceholderView } from "@/components/platform/section-placeholder-view";

export default function RadarPage() {
  return (
    <SectionPlaceholderView
      title="Radar"
      subtitle="Risk signals and stuck points — wiring to data next."
      highlights={["At-risk projects", "Overdue tasks", "Clients without next step"]}
    />
  );
}
