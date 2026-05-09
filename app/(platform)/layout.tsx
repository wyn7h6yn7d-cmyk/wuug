import { AppShell } from "@/components/layout/app-shell";
import { getPlatformSession } from "@/lib/platform-session";
import { assertWorkspaceAccess } from "@/lib/workspace-gate";
import { redirect } from "next/navigation";

export default async function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getPlatformSession();
  if (!user) redirect("/");

  await assertWorkspaceAccess();

  return <AppShell>{children}</AppShell>;
}
