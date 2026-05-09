import { SectionPlaceholderView } from "@/components/platform/section-placeholder-view";

export default function SettingsPage() {
  return (
    <SectionPlaceholderView
      title="Settings"
      subtitle="Preferences, team, integrations — coming next."
      highlights={["Team roles", "Notification rules", "Integrations"]}
    />
  );
}
