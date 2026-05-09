import { SectionPlaceholderView } from "@/components/platform/section-placeholder-view";

export default function PromisesPage() {
  return (
    <SectionPlaceholderView
      title="Promises"
      subtitle="Promise register — wiring to Supabase next."
      highlights={["Due soon", "Overdue promises", "Owner + notes"]}
    />
  );
}

