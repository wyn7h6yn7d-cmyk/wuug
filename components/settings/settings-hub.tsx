"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/command-center/glass-card";
import { useAuth } from "@/components/providers/auth-provider";
import { PageHeader } from "@/components/ui/page-header";
import { PressableLink } from "@/components/ui/pressable-link";
import { toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  type WuugUserSettings,
  parseWuugSettings,
} from "@/lib/wuug-user-settings";

const SECTIONS = [
  { id: "team", label: "Team roles" },
  { id: "notifications", label: "Notification rules" },
  { id: "integrations", label: "Integrations" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function SettingsSwitchRow({
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
  htmlFor,
}: {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (next: boolean) => void;
  htmlFor: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-token-soft bg-surface/50 px-4 py-3.5">
      <div className="min-w-0">
        <p id={htmlFor} className="text-sm font-semibold text-fg">
          {label}
        </p>
        {description ? <p className="mt-1 text-xs leading-relaxed text-fg-soft">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-labelledby={htmlFor}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-[rgb(var(--accent)/0.55)]" : "bg-fg-muted/20",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ease-out",
            checked && "translate-x-[22px]",
          )}
        />
      </button>
    </div>
  );
}

export function SettingsHub() {
  const { user, role, isLoading } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  const [selected, setSelected] = React.useState<SectionId>("team");
  const [prefs, setPrefs] = React.useState<WuugUserSettings>(() => parseWuugSettings(user?.user_metadata));
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (user) setPrefs(parseWuugSettings(user.user_metadata));
  }, [user?.id, user?.user_metadata]);

  const canManageTeam = role === "owner" || role === "manager";

  const persist = React.useCallback(
    async (next: WuugUserSettings) => {
      setSaving(true);
      try {
        const { data, error } = await supabase.auth.updateUser({
          data: { wuug_settings: next },
        });
        if (error) {
          if (user) setPrefs(parseWuugSettings(user.user_metadata));
          toast(error.message || "Couldn’t save settings.");
          return;
        }
        if (data.user) {
          setPrefs(parseWuugSettings(data.user.user_metadata));
        }
      } catch {
        if (user) setPrefs(parseWuugSettings(user.user_metadata));
        toast("Couldn’t save settings.");
      } finally {
        setSaving(false);
      }
    },
    [supabase.auth, user],
  );

  const patchPrefs = (partial: Partial<WuugUserSettings>) => {
    const next = { ...prefs, ...partial };
    setPrefs(next);
    void persist(next);
  };

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "—";

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="Settings"
          subtitle="Workspace preferences, team access, and how Wuug reaches you."
        />
        <div className="flex items-center gap-2">
          <PressableLink href="/tasks" variant="secondary" size="sm">
            Open tasks
          </PressableLink>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-fg">Settings</h2>
          <p className="mt-2 text-sm text-fg-soft">
            Pick a section to review or change. Notification and integration choices are saved to your account.
          </p>

          <ul className="mt-4 list-none space-y-2 p-0" aria-label="Settings sections">
            {SECTIONS.map((item) => {
              const isSelected = selected === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelected(item.id)}
                    className={cn(
                      "w-full cursor-pointer rounded-[22px] border px-4 py-3.5 text-left text-sm font-semibold transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                      isSelected
                        ? "border-[rgb(var(--accent)/0.45)] bg-[rgb(var(--accent)/0.14)] text-fg shadow-[0_10px_28px_rgba(99,102,241,0.15)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.35)]"
                        : "border-token-soft bg-surface/80 text-fg hover:border-[rgb(var(--accent)/0.28)] hover:bg-surface",
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 space-y-4 rounded-2xl border border-token-soft bg-surface/60 p-4">
            {selected === "team" ? (
              <>
                <h3 className="text-sm font-semibold text-fg">Team roles</h3>
                <p className="text-sm leading-relaxed text-fg-soft">
                  Roles control who can invite people, edit clients, and see the full workspace. Your current role is{" "}
                  <span className="font-medium text-fg">{roleLabel}</span>.
                </p>
                {canManageTeam ? (
                  <>
                    <p className="text-sm leading-relaxed text-fg-soft">
                      Open Team to invite members, resend invitations, and change roles between Owner, Manager, and
                      Member.
                    </p>
                    <PressableLink href="/team" variant="primary" size="sm">
                      Open Team
                    </PressableLink>
                  </>
                ) : (
                  <p className="text-sm leading-relaxed text-fg-soft">
                    Only owners and managers can change roles. Ask a workspace admin if you need different access.
                  </p>
                )}
              </>
            ) : null}

            {selected === "notifications" ? (
              <>
                <h3 className="text-sm font-semibold text-fg">Notification rules</h3>
                <p className="text-sm text-fg-soft">
                  These preferences apply to in-app and email-style nudges as we roll them out. Stored on your account.
                </p>
                <div className="space-y-2">
                  <SettingsSwitchRow
                    htmlFor="pref-task-due"
                    label="Tasks & deadlines"
                    description="Reminders when work is due or reassigned to you."
                    checked={prefs.notify_task_due}
                    disabled={saving || isLoading}
                    onCheckedChange={(v) => patchPrefs({ notify_task_due: v })}
                  />
                  <SettingsSwitchRow
                    htmlFor="pref-client"
                    label="Client activity"
                    description="Highlights when clients you own move stage or need attention."
                    checked={prefs.notify_client_activity}
                    disabled={saving || isLoading}
                    onCheckedChange={(v) => patchPrefs({ notify_client_activity: v })}
                  />
                  <SettingsSwitchRow
                    htmlFor="pref-digest"
                    label="Weekly summary"
                    description="A single recap of progress and risks in your workspace."
                    checked={prefs.notify_weekly_summary}
                    disabled={saving || isLoading}
                    onCheckedChange={(v) => patchPrefs({ notify_weekly_summary: v })}
                  />
                </div>
              </>
            ) : null}

            {selected === "integrations" ? (
              <>
                <h3 className="text-sm font-semibold text-fg">Integrations</h3>
                <p className="text-sm text-fg-soft">
                  Turn on the tools you use. OAuth connections are enabled per workspace as we ship connectors; your
                  choices here tell Wuug what to prioritize.
                </p>
                <div className="space-y-2">
                  <SettingsSwitchRow
                    htmlFor="int-cal"
                    label="Google Calendar"
                    description="Plan to sync deadlines and meetings with Wuug."
                    checked={prefs.integration_google_calendar}
                    disabled={saving || isLoading}
                    onCheckedChange={(v) => patchPrefs({ integration_google_calendar: v })}
                  />
                  <SettingsSwitchRow
                    htmlFor="int-slack"
                    label="Slack"
                    description="Optional alerts and digests in a channel you choose."
                    checked={prefs.integration_slack}
                    disabled={saving || isLoading}
                    onCheckedChange={(v) => patchPrefs({ integration_slack: v })}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-token-soft/80 pt-4">
                  <a
                    href="https://calendar.google.com/calendar/u/0/r"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-token-soft bg-surface/80 px-3.5 py-2 text-xs font-semibold text-fg-muted hover:text-fg"
                  >
                    Google Calendar
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                  <a
                    href="https://slack.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-token-soft bg-surface/80 px-3.5 py-2 text-xs font-semibold text-fg-muted hover:text-fg"
                  >
                    Slack
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                </div>
              </>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-fg">Shortcuts</h3>
          <p className="mt-2 text-sm text-fg-soft">Jump to common workflows.</p>
          <div className="mt-4 grid gap-2">
            <PressableLink href="/tasks" variant="primary" fullWidth>
              Tasks
            </PressableLink>
            <PressableLink href="/clients" variant="secondary" fullWidth>
              Clients
            </PressableLink>
            <PressableLink href="/radar" variant="ghost" fullWidth>
              Radar
            </PressableLink>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
