import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return <AppShell>{children}</AppShell>;
}
