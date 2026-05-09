/** Immutable platform owner — protected in DB (see supabase migrations). */
export const MASTER_ADMIN_EMAIL = "kennethalto95@gmail.com";

export function isMasterAdminEmail(email: string | null | undefined): boolean {
  return (email ?? "").trim().toLowerCase() === MASTER_ADMIN_EMAIL;
}

/** Sidebar / menus: platform admins or master email (e.g. profile flag not loaded yet). */
export function canAccessAdminPanel(platformAdmin: boolean, email: string | null | undefined): boolean {
  return platformAdmin || isMasterAdminEmail(email);
}
