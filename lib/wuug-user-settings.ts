import type { User } from "@supabase/supabase-js";

/** Persisted on the auth user as `user_metadata.wuug_settings` (no DB migration). */
export type WuugUserSettings = {
  notify_task_due: boolean;
  notify_client_activity: boolean;
  notify_weekly_summary: boolean;
  integration_google_calendar: boolean;
  integration_slack: boolean;
};

export const WUUG_SETTINGS_DEFAULTS: WuugUserSettings = {
  notify_task_due: true,
  notify_client_activity: true,
  notify_weekly_summary: true,
  integration_google_calendar: false,
  integration_slack: false,
};

export function parseWuugSettings(metadata: User["user_metadata"] | undefined): WuugUserSettings {
  if (!metadata || typeof metadata !== "object") {
    return { ...WUUG_SETTINGS_DEFAULTS };
  }
  const raw = (metadata as { wuug_settings?: Partial<WuugUserSettings> }).wuug_settings;
  if (!raw || typeof raw !== "object") {
    return { ...WUUG_SETTINGS_DEFAULTS };
  }
  return { ...WUUG_SETTINGS_DEFAULTS, ...raw };
}
