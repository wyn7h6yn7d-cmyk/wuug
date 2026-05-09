import { SectionPlaceholderView } from "@/components/platform/section-placeholder-view";

export default function MyDayPage() {
  return (
    <SectionPlaceholderView
      title="My Day"
      subtitle="Your focus, next steps, and promises for today."
      highlights={[
        "Personalized focus queue (coming next)",
        "Promises due + follow-ups (coming next)",
        "Export / share your day (coming next)",
      ]}
    />
  );
}
