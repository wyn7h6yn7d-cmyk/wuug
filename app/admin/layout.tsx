import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";
import { OrbBackground } from "@/components/command-center/orb-background";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("platform_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.platform_admin) redirect("/");

  return (
    <div className="relative min-h-screen bg-app text-fg">
      <OrbBackground />
      <div className="relative border-b border-token-soft bg-surface/40 backdrop-blur">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-4">
            <BrandLogo />
            <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Admin Panel
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/my-day"
              className="rounded-2xl border border-token-soft bg-surface/80 px-4 py-2 text-sm font-semibold text-fg hover:bg-surface"
            >
              Open app
            </Link>
            <Link
              href="/settings"
              className="rounded-2xl border border-token-soft bg-surface/80 px-4 py-2 text-sm font-semibold text-fg hover:bg-surface"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
      <div className="relative mx-auto max-w-[1680px] px-4 py-8 lg:px-6">{children}</div>
    </div>
  );
}
