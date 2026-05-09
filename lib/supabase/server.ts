import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function normalizeSupabaseUrl(raw: string) {
  const trimmed = raw.trim().replace(/\/+$/, "");
  try {
    const u = new URL(trimmed);
    return u.origin;
  } catch {
    return trimmed;
  }
}

export function createClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const urlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = urlRaw ? normalizeSupabaseUrl(urlRaw) : undefined;

  if (!url || !anonKey) {
    return {
      auth: {
        async getUser() {
          return { data: { user: null }, error: null };
        },
      },
    } as unknown as SupabaseClient;
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // `setAll` can be called from Server Component context where cookies are read-only.
        }
      },
    },
  });
}

