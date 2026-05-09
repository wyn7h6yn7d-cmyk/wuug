"use client";

import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "owner" | "manager" | "member";

export type Profile = {
  id: string;
  organization_id: string | null;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: UserRole;
};

export type Organization = {
  id: string;
  name: string;
  logo_url: string | null;
  industry: string | null;
};

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  organization: Organization | null;
  role: UserRole | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname === "/signup" || pathname === "/register";
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = window.setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    promise.then(
      (value) => {
        window.clearTimeout(t);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(t);
        reject(err);
      },
    );
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const supabase = React.useMemo(() => createClient(), []);

  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [organization, setOrganization] = React.useState<Organization | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const role = profile?.role ?? null;

  const refreshProfile = React.useCallback(async () => {
    try {
      // Always read the session user from Supabase — avoids stale React `user` during auth transitions.
      const {
        data: { user: currentUser },
      } = await withTimeout(supabase.auth.getUser(), 6000, "auth.getUser");
      if (!currentUser) {
        setProfile(null);
        setOrganization(null);
        return;
      }

      const { data: profileRow, error: profileError } = await withTimeout(
        supabase
          .from("profiles")
          .select("id, organization_id, full_name, email, avatar_url, role")
          .eq("id", currentUser.id)
          .maybeSingle(),
        6000,
        "profiles.select",
      );

      if (profileError || !profileRow) {
        setProfile(null);
        setOrganization(null);
        return;
      }

      const nextProfile = profileRow as Profile;
      setProfile(nextProfile);

      if (!nextProfile.organization_id) {
        setOrganization(null);
        return;
      }

      const { data: orgRow } = await withTimeout(
        supabase
          .from("organizations")
          .select("id, name, logo_url, industry")
          .eq("id", nextProfile.organization_id)
          .maybeSingle(),
        6000,
        "organizations.select",
      );

      setOrganization((orgRow as Organization) ?? null);
    } catch {
      // Avoid indefinite loading if the network is down / Supabase is unreachable.
      setProfile(null);
      setOrganization(null);
    }
  }, [supabase]);

  React.useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await withTimeout(supabase.auth.getSession(), 6000, "auth.getSession");

        if (cancelled) return;
        setUser(session?.user ?? null);

        if (session?.user) {
          await refreshProfile();
        } else {
          setProfile(null);
          setOrganization(null);
        }
      } catch {
        if (cancelled) return;
        setUser(null);
        setProfile(null);
        setOrganization(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void bootstrap();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setIsLoading(true);
      if (session?.user) {
        void refreshProfile().finally(() => setIsLoading(false));
      } else {
        setProfile(null);
        setOrganization(null);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [refreshProfile, supabase]);

  React.useEffect(() => {
    if (isLoading) return;
    if (isAuthRoute(pathname)) return;
    // Send unauthenticated users to the public landing page (not /login).
    if (!user) router.replace("/");
  }, [isLoading, pathname, router, user]);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    // Full navigation avoids a race: the "no user" effect would otherwise redirect to /login while still on a platform route.
    window.location.assign("/");
  }, [supabase]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      organization,
      role,
      isLoading,
      signOut,
      refreshProfile,
    }),
    [isLoading, organization, profile, refreshProfile, role, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

