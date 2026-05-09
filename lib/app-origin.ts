/** Public site URL for invite links (emails, redirects). */
export function getAppOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (!raw) return "http://localhost:3000";
  const t = raw.replace(/\/+$/, "");
  return t.startsWith("http") ? t : `https://${t}`;
}

export function isInviteEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}
