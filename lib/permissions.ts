export type AppRole = "owner" | "manager" | "member";

function isManager(role: AppRole) {
  return role === "owner" || role === "manager";
}

export function canViewTeam(role: AppRole) {
  return isManager(role);
}

export function canViewReports(role: AppRole) {
  return isManager(role);
}

export function canViewAllClients(role: AppRole) {
  return isManager(role);
}

export function canAssignOwner(role: AppRole) {
  return isManager(role);
}

export function canCreateTeamMember(role: AppRole) {
  return isManager(role);
}

export function canExportCsv(role: AppRole) {
  return isManager(role);
}

export function canViewAllProjects(role: AppRole) {
  return isManager(role);
}

export function canViewAllTasks(role: AppRole) {
  return isManager(role);
}

