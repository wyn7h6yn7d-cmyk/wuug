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
  { id: "people", label: "People & invitations" },
  { id: "account", label: "Profile & email" },
  { id: "security", label: "Password" },
  { id: "notifications", label: "Notification rules" },
  { id: "integrations", label: "Integrations" },
  { id: "danger", label: "Data & deletion" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ?? "";

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

function inputClass(disabled?: boolean) {
  return cn(
    "mt-1.5 w-full rounded-2xl border border-token-soft bg-surface/80 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-soft focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] focus:ring-offset-2 focus:ring-offset-[var(--background)]",
    disabled && "cursor-not-allowed opacity-60",
  );
}

export function SettingsHub() {
  const { user, profile, organization, role, platformAdmin, isLoading, refreshProfile } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  const [selected, setSelected] = React.useState<SectionId>("people");
  const [prefs, setPrefs] = React.useState<WuugUserSettings>(() => parseWuugSettings(user?.user_metadata));
  const [saving, setSaving] = React.useState(false);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingEmail, setSavingEmail] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);

  const [fullName, setFullName] = React.useState("");
  const [emailInput, setEmailInput] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  React.useEffect(() => {
    if (user) setPrefs(parseWuugSettings(user.user_metadata));
  }, [user?.id, user?.user_metadata]);

  React.useEffect(() => {
    setFullName(profile?.full_name?.trim() ?? "");
    setEmailInput(profile?.email?.trim() ?? user?.email?.trim() ?? "");
  }, [profile?.full_name, profile?.email, user?.email]);

  const canManageTeam = role === "owner" || role === "manager";
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "—";
  const orgLabel = organization?.name?.trim() || "your workspace";

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

  async function saveProfileName() {
    if (!user?.id) return;
    const next = fullName.trim();
    if (!next) {
      toast("Name can’t be empty.");
      return;
    }
    setSavingProfile(true);
    try {
      const { error: profileErr } = await supabase.from("profiles").update({ full_name: next }).eq("id", user.id);
      if (profileErr) {
        toast(profileErr.message || "Couldn’t update profile.");
        return;
      }
      const { error: authErr } = await supabase.auth.updateUser({ data: { full_name: next } });
      if (authErr) {
        toast(authErr.message || "Couldn’t sync name to your session.");
        return;
      }
      await refreshProfile();
      toast("Profile updated.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveEmail() {
    const next = emailInput.trim().toLowerCase();
    const current = (profile?.email ?? user?.email ?? "").trim().toLowerCase();
    if (!next || next === current) {
      toast("Enter a new email address.");
      return;
    }
    setSavingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: next });
      if (error) {
        toast(error.message || "Couldn’t start email change.");
        return;
      }
      toast("If confirmations are enabled, check both inboxes to confirm the change.");
    } finally {
      setSavingEmail(false);
    }
  }

  async function savePassword() {
    if (newPassword.length < 8) {
      toast("Use at least 8 characters for your password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passwords don’t match.");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast(error.message || "Couldn’t update password.");
        return;
      }
      setNewPassword("");
      setConfirmPassword("");
      toast("Password updated.");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="Settings"
          subtitle="People, your profile, security, notifications, and workspace data."
        />
        <div className="flex flex-wrap items-center gap-2">
          {platformAdmin ? (
            <PressableLink href="/admin" variant="primary" size="sm">
              Admin panel
            </PressableLink>
          ) : null}
          <PressableLink href="/team" variant={platformAdmin ? "secondary" : "primary"} size="sm">
            Team & invites
          </PressableLink>
          <PressableLink href="/tasks" variant="secondary" size="sm">
            Tasks
          </PressableLink>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-fg">Settings</h2>
          <p className="mt-2 text-sm text-fg-soft">
            Choose a section. Profile and password changes apply to your login; notification toggles are stored on your
            account.
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
            {selected === "people" ? (
              <>
                <h3 className="text-sm font-semibold text-fg">People & invitations</h3>
                <p className="text-sm leading-relaxed text-fg-soft">
                  Add teammates to <span className="font-medium text-fg">{orgLabel}</span> with an email invite and a
                  secure signup link. Your role: <span className="font-medium text-fg">{roleLabel}</span>.
                </p>
                {canManageTeam ? (
                  <>
                    <p className="text-sm leading-relaxed text-fg-soft">
                      Open <span className="font-medium text-fg">Team</span>, enter their email, choose Manager or
                      Member, then copy the invite link and send it to them.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <PressableLink href="/team" variant="primary" size="sm">
                        Invite teammates
                      </PressableLink>
                      <PressableLink href="/manager" variant="secondary" size="sm">
                        Command Center
                      </PressableLink>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed text-fg-soft">
                      Only owners and managers can send invitations. Ask an admin to open Team and create an invite for
                      you.
                    </p>
                    <PressableLink href="/team" variant="secondary" size="sm">
                      About team access
                    </PressableLink>
                  </>
                )}
              </>
            ) : null}

            {selected === "account" ? (
              <>
                <h3 className="text-sm font-semibold text-fg">Profile & email</h3>
                <p className="text-sm text-fg-soft">
                  Your display name appears across Wuug. Email is used to sign in; changing it may require confirmation
                  links from Supabase.
                </p>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-fg-muted">Full name</label>
                  <input
                    className={inputClass(isLoading)}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => void saveProfileName()}
                    disabled={savingProfile || isLoading}
                    className="mt-3 rounded-2xl bg-[rgb(var(--accent))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(99,102,241,0.35)] disabled:opacity-50"
                  >
                    {savingProfile ? "Saving…" : "Save name"}
                  </button>
                </div>
                <div className="border-t border-token-soft/80 pt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-fg-muted">Email</label>
                  <input
                    type="email"
                    className={inputClass(isLoading)}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => void saveEmail()}
                    disabled={savingEmail || isLoading}
                    className="mt-3 rounded-2xl border border-token-soft bg-surface/80 px-4 py-2.5 text-sm font-semibold text-fg disabled:opacity-50"
                  >
                    {savingEmail ? "Updating…" : "Request email change"}
                  </button>
                </div>
              </>
            ) : null}

            {selected === "security" ? (
              <>
                <h3 className="text-sm font-semibold text-fg">Password</h3>
                <p className="text-sm text-fg-soft">
                  You’re signed in, so you can set a new password without the old one. Use at least 8 characters.
                </p>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-fg-muted">New password</label>
                  <input
                    type="password"
                    className={inputClass(isLoading)}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    className={inputClass(isLoading)}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void savePassword()}
                  disabled={savingPassword || isLoading}
                  className="rounded-2xl bg-[rgb(var(--accent))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(99,102,241,0.35)] disabled:opacity-50"
                >
                  {savingPassword ? "Updating…" : "Update password"}
                </button>
              </>
            ) : null}

            {selected === "notifications" ? (
              <>
                <h3 className="text-sm font-semibold text-fg">Notification rules</h3>
                <p className="text-sm text-fg-soft">
                  These preferences apply as in-app and email nudges roll out. Stored on your account.
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
                  Tell us which connectors matter; OAuth is enabled per workspace as we ship them.
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

            {selected === "danger" ? (
              <>
                <h3 className="text-sm font-semibold text-fg">Data & deletion</h3>
                <p className="text-sm leading-relaxed text-fg-soft">
                  Deleting an account removes your login and should unlink personal data from this workspace. That
                  requires a server-side step so we don’t leave orphaned records.
                </p>
                <div className="rounded-2xl border border-red-500/35 bg-red-500/10 px-4 py-3">
                  <p className="text-sm font-semibold text-fg">Delete account</p>
                  <p className="mt-1 text-xs leading-relaxed text-fg-soft">
                    {SUPPORT_EMAIL
                      ? `Email ${SUPPORT_EMAIL} from your registered address and ask to delete your Wuug account. We’ll confirm and remove access.`
                      : "Set NEXT_PUBLIC_SUPPORT_EMAIL in your deployment to show a contact address here. Until then, ask your workspace owner to remove your access or contact whoever runs this Wuug instance."}
                  </p>
                  {SUPPORT_EMAIL ? (
                    <a
                      href={`mailto:${encodeURIComponent(SUPPORT_EMAIL)}?subject=${encodeURIComponent("Delete my Wuug account")}`}
                      className="mt-3 inline-flex rounded-2xl border border-red-500/40 bg-surface/80 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400"
                    >
                      Email support
                    </a>
                  ) : null}
                </div>
                <p className="text-xs text-fg-soft">
                  To stop using Wuug immediately, use <span className="font-medium text-fg">Log out</span> in the header
                  menu.
                </p>
              </>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-fg">Shortcuts</h3>
          <p className="mt-2 text-sm text-fg-soft">Common places in your workspace.</p>
          <div className="mt-4 grid gap-2">
            <PressableLink href="/team" variant="primary" fullWidth>
              Team & invites
            </PressableLink>
            <PressableLink href="/tasks" variant="secondary" fullWidth>
              Tasks
            </PressableLink>
            <PressableLink href="/clients" variant="secondary" fullWidth>
              Clients
            </PressableLink>
            {role !== "member" ? (
              <PressableLink href="/radar" variant="ghost" fullWidth>
                Radar
              </PressableLink>
            ) : (
              <PressableLink href="/my-day" variant="ghost" fullWidth>
                My Day
              </PressableLink>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
