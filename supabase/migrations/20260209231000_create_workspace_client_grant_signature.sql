-- Repair: first migration used GRANT with 10× text; the function has 9× text + timestamptz + uuid.
-- Safe to re-run if grant already applied.

grant execute on function public.create_workspace_client(
  text, text, text, text, text, text, text, text, text, timestamptz, uuid
) to authenticated;
