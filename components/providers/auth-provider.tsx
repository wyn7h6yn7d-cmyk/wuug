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
    const currentUser = user ?? (await supabase.auth.getUser()).data.user ?? null;
    if (!currentUser) {
      setProfile(null);
      setOrganization(null);
      return;
    }

    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select("id, organization_id, full_name, email, avatar_url, role")
      .eq("id", currentUser.id)
      .maybeSingle();

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

    const { data: orgRow } = await supabase
      .from("organizations")
      .select("id, name, logo_url, industry")
      .eq("id", nextProfile.organization_id)
      .maybeSingle();

    setOrganization((orgRow as Organization) ?? null);
  }, [supabase, user]);

  React.useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;
      setUser(session?.user ?? null);

      if (session?.user) {
        await refreshProfile();
      } else {
        setProfile(null);
        setOrganization(null);
      }

      if (!cancelled) setIsLoading(false);
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
    if (!user) router.replace("/login");
  }, [isLoading, pathname, router, user]);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setOrganization(null);
    router.replace("/login");
  }, [router, supabase]);

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

