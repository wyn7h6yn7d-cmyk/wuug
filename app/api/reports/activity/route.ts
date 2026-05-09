import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

type ReportTypeFilter = "All" | "Tasks" | "Projects" | "Promises" | "Clients" | "Notes";

function isoStartOfDay(dateISO: string) {
  return `${dateISO}T00:00:00.000Z`;
}

function isoEndOfDay(dateISO: string) {
  return `${dateISO}T23:59:59.999Z`;
}

function mapTypeFilterToEntityType(type: ReportTypeFilter) {
  switch (type) {
    case "Tasks":
      return "task";
    case "Projects":
      return "project";
    case "Promises":
      return "promise";
    case "Clients":
      return "client";
    case "Notes":
      return "note";
    case "All":
    default:
      return null;
  }
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";
  const teamMemberId = url.searchParams.get("teamMemberId") ?? "";
  const status = url.searchParams.get("status") ?? "";
  const type = (url.searchParams.get("type") ?? "All") as ReportTypeFilter;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, organization_id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile?.organization_id) {
    return NextResponse.json({ error: "Profile missing organization" }, { status: 400 });
  }

  if (profile.role !== "owner" && profile.role !== "manager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const entityType = mapTypeFilterToEntityType(type);

  let query = supabase
    .from("activity_log")
    .select(
      [
        "id",
        "created_at",
        "type",
        "entity_type",
        "title",
        "description",
        "status",
        "completed_at",
        "assigned_to",
        "client_id",
        "project_id",
        "clients(name)",
        "projects(name)",
        "profiles!activity_log_assigned_to_fkey(id, full_name)",
      ].join(","),
    )
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false })
    .limit(5000);

  if (from) query = query.gte("created_at", isoStartOfDay(from));
  if (to) query = query.lte("created_at", isoEndOfDay(to));
  if (teamMemberId) query = query.eq("assigned_to", teamMemberId);
  if (status) query = query.eq("status", status);
  if (entityType) query = query.eq("entity_type", entityType);

  const { data: rows, error: rowsError } = await query;

  if (rowsError) {
    return NextResponse.json({ error: rowsError.message }, { status: 500 });
  }

  const { data: members, error: membersError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("organization_id", profile.organization_id)
    .order("full_name", { ascending: true });

  if (membersError) {
    return NextResponse.json({ error: membersError.message }, { status: 500 });
  }

  return NextResponse.json({ rows: rows ?? [], members: members ?? [] });
}

