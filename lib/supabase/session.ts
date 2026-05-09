import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname === "/signup" || pathname === "/register";
}

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== "production") {
      const missing = [
        !url ? "NEXT_PUBLIC_SUPABASE_URL" : null,
        !anonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : null,
      ]
        .filter(Boolean)
        .join(", ");
      console.error(`Supabase session refresh disabled: missing env var(s): ${missing}.`);
    }
    return NextResponse.next({ request: { headers: request.headers } });
  }

  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    // Refresh session if needed; if Supabase is misconfigured/unreachable,
    // we don't want to take down the entire site (especially auth pages).
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && isAuthRoute(request.nextUrl.pathname)) {
      const nextUrl = request.nextUrl.clone();
      nextUrl.pathname = "/";
      return NextResponse.redirect(nextUrl);
    }

    return response;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Supabase session refresh failed; skipping middleware.", err);
    }
    return NextResponse.next({ request: { headers: request.headers } });
  }
}

