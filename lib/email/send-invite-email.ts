function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends workspace invite via [Resend](https://resend.com). Set RESEND_API_KEY and RESEND_FROM_EMAIL in production.
 */
export async function sendInviteEmail(params: {
  to: string;
  inviteUrl: string;
  organizationName: string;
  inviterName?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Wuug <onboarding@resend.dev>";

  const { to, inviteUrl, organizationName, inviterName } = params;
  const subject = `You're invited to ${organizationName} on Wuug`;
  const safeOrg = escapeHtml(organizationName);
  const safeInviter = inviterName ? escapeHtml(inviterName) : "";
  const href = inviteUrl.replace(/"/g, "&quot;");
  const html = `<!DOCTYPE html>
<html><body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#111;max-width:560px">
<p>You've been invited to join <strong>${safeOrg}</strong> on Wuug${safeInviter ? ` by ${safeInviter}` : ""}.</p>
<p><a href="${href}" style="display:inline-block;margin-top:12px;padding:12px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:12px;font-weight:600">Accept invitation</a></p>
<p style="font-size:13px;color:#555;margin-top:24px">If the button doesn't work, copy this link into your browser:</p>
<p style="font-size:12px;word-break:break-all;color:#333">${escapeHtml(inviteUrl)}</p>
</body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text.slice(0, 500) || res.statusText };
  }

  return { ok: true };
}
