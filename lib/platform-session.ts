import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export type PlatformSession = {
  supabase: SupabaseClient;
  user: User | null;
};

/** One Supabase client + one getUser per request (layout + page share this). */
export const getPlatformSession = cache(async (): Promise<PlatformSession> => {
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user ?? null };
});
