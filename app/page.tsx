import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingHero } from "@/components/landing/landing-hero";

export default async function LandingPage() {
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/app");

  return <LandingHero />;
}
