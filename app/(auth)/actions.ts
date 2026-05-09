"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function encodeErr(message: string) {
  const trimmed = message.trim().slice(0, 180);
  return encodeURIComponent(trimmed);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const inviteToken = String(formData.get("invite") ?? "").trim();

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const inviteQ = inviteToken ? `&invite=${encodeURIComponent(inviteToken)}` : "";
    redirect(`/login?error=1&msg=${encodeErr(error.message)}${inviteQ}`);
  }

  // Route by role.
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login?error=1");

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .maybeSingle();

  const meta = user.user_metadata as { full_name?: string } | undefined;
  const fullName =
    typeof meta?.full_name === "string" && meta.full_name.trim()
      ? meta.full_name.trim()
      : email.split("@")[0] ?? "Member";

  if (!profileRow?.organization_id) {
    if (inviteToken) {
      const { error: acceptError } = await supabase.rpc("accept_invitation", {
        p_token: inviteToken,
        p_full_name: fullName,
      });
      if (acceptError) {
        const inviteQ = `&invite=${encodeURIComponent(inviteToken)}`;
        redirect(`/login?error=1&msg=${encodeErr(acceptError.message)}${inviteQ}`);
      }
    } else {
      await supabase.rpc("accept_pending_invitation_for_user", {
        p_full_name: fullName,
      });
    }
  }

  const { data: profileAfter } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profileAfter?.role as string | undefined) ?? "member";
  redirect(role === "member" ? "/my-day" : "/manager");
}

export async function signUp(formData: FormData) {
  const organizationName = String(formData.get("organization_name") ?? "");
  const firstName = String(formData.get("first_name") ?? "");
  const lastName = String(formData.get("last_name") ?? "");
  const fullName = [firstName, lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
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

  if (error) redirect(`/signup?error=1&msg=${encodeErr(error.message)}`);

  // If email confirmations are enabled, there may be no session yet.
  if (!data.session) redirect("/login?confirm=1");

  const { error: workspaceError } = await supabase.rpc("create_workspace", {
    p_organization_name: organizationName,
    p_full_name: fullName,
  });

  if (workspaceError) {
    await supabase.auth.signOut();
    redirect(`/signup?error=1&msg=${encodeErr(workspaceError.message)}`);
  }

  redirect("/manager");
}

export async function signOut() {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/");
}

