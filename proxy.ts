import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/register",
    "/manager/:path*",
    "/my-day/:path*",
    "/team/:path*",
    "/clients/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/radar/:path*",
    "/promises/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
  ],
};
