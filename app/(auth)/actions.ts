"use server";

import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  void formData;
  redirect("/");
}

export async function signUp(formData: FormData) {
  void formData;
  redirect("/");
}

export async function signOut() {
  redirect("/");
}

