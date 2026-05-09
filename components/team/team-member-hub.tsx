import { GlassCard } from "@/components/command-center/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { PressableLink } from "@/components/ui/pressable-link";

export function TeamMemberHub({ organizationName }: { organizationName: string }) {
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Team & invitations"
        subtitle={`Invitations to ${organizationName} are managed by workspace admins.`}
      />
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-fg">Who can invite people?</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-soft">
          Your role is <span className="font-medium text-fg">Member</span>. Owners and managers can open the Team page,
          add emails, and copy an invite link to share with new teammates.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fg-soft">
          Ask an owner or manager to send an invite, or forward them these steps:{" "}
          <span className="font-medium text-fg">Team → Invite teammate → copy link</span>.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <PressableLink href="/settings" variant="primary" size="sm">
            Workspace settings
          </PressableLink>
          <PressableLink href="/my-day" variant="secondary" size="sm">
            Back to My Day
          </PressableLink>
        </div>
      </GlassCard>
    </div>
  );
}
