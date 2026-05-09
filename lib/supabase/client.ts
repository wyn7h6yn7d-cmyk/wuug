import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(raw: string) {
  const trimmed = raw.trim().replace(/\/+$/, "");
  try {
    const u = new URL(trimmed);
    return u.origin;
  } catch {
    return trimmed;
  }
}

export function createClient() {
  const urlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = urlRaw ? normalizeSupabaseUrl(urlRaw) : undefined;

  if (!url || !anonKey) {
    // During builds / preview environments we still want Next to compile + prerender.
    // Call sites should gracefully handle unauthenticated / empty data.
    return {
      auth: {
        async getSession() {
          return { data: { session: null }, error: null };
        },
        async getUser() {
          return { data: { user: null }, error: null };
        },
        onAuthStateChange() {
          return { data: { subscription: { unsubscribe() {} } } };
        },
        async signOut() {},
        async updateUser() {
          return {
            data: { user: null },
            error: { message: "Supabase auth is not configured in this environment." } as Error,
          };
        },
      },
      from() {
        return {
          select() {
            return this;
          },
          eq() {
            return this;
          },
          neq() {
            return this;
          },
          order() {
            return this;
          },
          limit() {
            return this;
          },
          is() {
            return this;
          },
          or() {
            return this;
          },
          gte() {
            return this;
          },
          lte() {
            return this;
          },
          maybeSingle: async () => ({ data: null, error: null }),
        };
      },
    } as unknown as SupabaseClient;
  }

  return createBrowserClient(url, anonKey);
}

