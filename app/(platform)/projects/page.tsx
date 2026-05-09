import { SectionPlaceholderView } from "@/components/platform/section-placeholder-view";

export default function ProjectsPage() {
  return (
    <SectionPlaceholderView
      title="Projects"
      subtitle="Projects in a calm command-center view — clear, actionable, lightweight."
      highlights={[
        "2 projects have quiet risk",
        "3 projects are waiting on client approval",
        "1 project needs an owner",
      ]}
    />
  );
}
