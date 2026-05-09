import { SectionPlaceholderView } from "@/components/platform/section-placeholder-view";

export default function TasksPage() {
  return (
    <SectionPlaceholderView
      title="Tasks"
      subtitle="Task workflow UI is being stabilized."
      highlights={["Assignment", "Due buckets", "Priority + status"]}
    />
  );
}
