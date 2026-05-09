"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=1");

  // Route by role.
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login?error=1");

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profileRow?.role as string | undefined) ?? "member";
  redirect(role === "member" ? "/my-day" : "/manager");
}

export async function signUp(formData: FormData) {
  const organizationName = String(formData.get("organization_name") ?? "");
  const fullName = String(formData.get("full_name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = createClient(await cookies());

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
        organization_name: organizationName || null,
      },
    },
  });

  if (error) redirect("/signup?error=1");

  // If email confirmations are enabled, there may be no session yet.
  if (!data.session) redirect("/login?created=1");

  const { error: workspaceError } = await supabase.rpc("create_workspace", {
    p_organization_name: organizationName,
    p_full_name: fullName,
  });

  if (workspaceError) {
    await supabase.auth.signOut();
    redirect("/signup?error=1");
  }

  redirect("/manager");
}

export async function signOut() {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/login");
}

