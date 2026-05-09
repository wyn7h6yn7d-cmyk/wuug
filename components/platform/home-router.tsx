"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export function HomeRouter() {
  const { role, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;
    if (role === "owner" || role === "manager") router.replace("/manager");
    if (role === "member") router.replace("/my-day");
  }, [isLoading, role, router, user]);

  return null;
}

