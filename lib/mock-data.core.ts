import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageCircleMore,
  PhoneCall,
  Send,
} from "lucide-react";

// NOTE: This file is intentionally Supabase-free.
// It provides deterministic, role-aware mock data for the app.

export type Role = "manager" | "member";
export type ISODateString = string;

export type UserStatus = "focused" | "healthy" | "busy" | "needs_attention";
export type ClientHealth = "healthy" | "waiting" | "at_risk" | "high_priority" | "no_next_step";
export type ClientStatus = "active" | "lead" | "paused";
export type ProjectStatus = "not_started" | "in_progress" | "waiting_on_client" | "done" | "at_risk";
export type TaskStatus = "planned" | "in_progress" | "waiting_on_client" | "done" | "overdue";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type PromiseStatus = "active" | "due_today" | "due_soon" | "completed" | "overdue";
export type ActivityType = "task" | "project" | "promise" | "client" | "note";

export type MetricTone = "blue" | "violet" | "orange" | "neutral" | "green";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  status: UserStatus;
  activeTasksCount: number;
  overdueTasksCount: number;
  assignedClientsCount: number;
};

export type Client = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  status: ClientStatus;
  health: ClientHealth;
  ownerId: string;
  nextStep: string;
  nextStepDueAt: ISODateString | null;
  activeProjectsCount: number;
  promisesCount: number;
  notes: string;
};

export type Project = {
  id: string;
  name: string;
  clientId: string;
  ownerId: string;
  status: ProjectStatus;
  progress: number;
  deadline: ISODateString | null;
  nextMilestone: string;
  nextStep: string;
  riskReason: string | null;
};

export type Task = {
  id: string;
  title: string;
  clientId?: string;
  projectId?: string;
  assignedTo: string;
  createdBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: ISODateString;
  completedAt?: ISODateString | null;
  notes: string;
};

export type Promise = {
  id: string;
  title: string;
  clientId: string;
  projectId?: string;
  assignedTo: string;
  status: PromiseStatus;
  dueAt: ISODateString;
  completedAt?: ISODateString | null;
  notes: string;
};

export type ActivityLogItem = {
  id: string;
  date: ISODateString;
  type: ActivityType;
  title: string;
  clientOrProject: string;
  assignedTo: string;
  status: string;
  completedAt?: ISODateString | null;
  notes: string;
};

export type RadarTone = "neutral" | "blue" | "violet" | "orange" | "green" | "red";

export type RadarItem = {
  id: string;
  tone: RadarTone;
  type: "client" | "project" | "task" | "promise";
  title: string;
  subtitle: string;
  dueAt?: ISODateString;
  ownerId?: string;
  clientId?: string;
  projectId?: string;
};

export type ReportFilters = {
  from?: ISODateString;
  to?: ISODateString;
  teamMemberId?: string;
  status?: string;
  type?: ActivityType;
};

// Deterministic "today" for predictable filtering.
const BASE_NOW = "2026-05-09T08:30:00.000Z";

function addDaysIso(baseIso: ISODateString, days: number, hourUtc = 9, minuteUtc = 0): ISODateString {
  const d = new Date(baseIso);
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hourUtc, minuteUtc, 0, 0);
  return d.toISOString();
}

function isBefore(a: ISODateString, b: ISODateString): boolean {
  return new Date(a).getTime() < new Date(b).getTime();
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function getClientName(clientId?: string): string {
  if (!clientId) return "—";
  return clients.find((c) => c.id === clientId)?.name ?? "—";
}

function getProjectName(projectId?: string): string {
  if (!projectId) return "—";
  return projects.find((p) => p.id === projectId)?.name ?? "—";
}

function getUserName(userId?: string): string {
  if (!userId) return "—";
  return users.find((u) => u.id === userId)?.fullName ?? "—";
}

export const users: User[] = [
  {
    id: "usr_eleonora",
    fullName: "Eleonora Kalmet",
    email: "eleonora@wuug.demo",
    role: "manager",
    avatarUrl: "https://api.dicebear.com/8.x/lorelei/svg?seed=Eleonora%20Kalmet",
    status: "focused",
    activeTasksCount: 0,
    overdueTasksCount: 0,
    assignedClientsCount: 0,
  },
  {
    id: "usr_martin",
    fullName: "Martin Tamm",
    email: "martin@wuug.demo",
    role: "member",
    avatarUrl: "https://api.dicebear.com/8.x/lorelei/svg?seed=Martin%20Tamm",
    status: "healthy",
    activeTasksCount: 0,
    overdueTasksCount: 0,
    assignedClientsCount: 0,
  },
  {
    id: "usr_katrin",
    fullName: "Katrin Laan",
    email: "katrin@wuug.demo",
    role: "member",
    avatarUrl: "https://api.dicebear.com/8.x/lorelei/svg?seed=Katrin%20Laan",
    status: "needs_attention",
    activeTasksCount: 0,
    overdueTasksCount: 0,
    assignedClientsCount: 0,
  },
  {
    id: "usr_siim",
    fullName: "Siim Mets",
    email: "siim@wuug.demo",
    role: "member",
    avatarUrl: "https://api.dicebear.com/8.x/lorelei/svg?seed=Siim%20Mets",
    status: "busy",
    activeTasksCount: 0,
    overdueTasksCount: 0,
    assignedClientsCount: 0,
  },
];

export const clients: Client[] = [
  {
    id: "cli_nordic",
    name: "Nordic OÜ",
    contactName: "Martin Pärn",
    email: "martin.parn@nordic.example",
    phone: "+372 5551 2040",
    status: "active",
    health: "waiting",
    ownerId: "usr_martin",
    nextStep: "Send revised proposal and confirm scope",
    nextStepDueAt: addDaysIso(BASE_NOW, 0, 11, 0),
    activeProjectsCount: 2,
    promisesCount: 2,
    notes: "Prefers concise email updates. Decision-maker joins calls on Fridays.",
  },
  {
    id: "cli_greenfield",
    name: "Greenfield OÜ",
    contactName: "Katri Saar",
    email: "katri.saar@greenfield.example",
    phone: "+372 5558 6612",
    status: "active",
    health: "healthy",
    ownerId: "usr_katrin",
    nextStep: "Quick alignment call on deliverables and invoice schedule",
    nextStepDueAt: addDaysIso(BASE_NOW, 0, 14, 0),
    activeProjectsCount: 1,
    promisesCount: 1,
    notes: "Wants weekly progress summary. Keep milestones visible and simple.",
  },
  {
    id: "cli_ruumdisain",
    name: "Ruum Disain OÜ",
    contactName: "Joonas Kask",
    email: "joonas.kask@ruumdisain.example",
    phone: "+372 5340 1199",
    status: "active",
    health: "at_risk",
    ownerId: "usr_siim",
    nextStep: "Request final approval on design direction",
    nextStepDueAt: addDaysIso(BASE_NOW, 0, 16, 0),
    activeProjectsCount: 1,
    promisesCount: 2,
    notes: "Feedback arrives late; set a decision deadline and send reminders.",
  },
  {
    id: "cli_lumen",
    name: "Lumen OÜ",
    contactName: "Liisa Oja",
    email: "liisa.oja@lumen.example",
    phone: "+372 5666 7721",
    status: "active",
    health: "high_priority",
    ownerId: "usr_eleonora",
    nextStep: "Internal review before client workshop",
    nextStepDueAt: addDaysIso(BASE_NOW, 0, 17, 30),
    activeProjectsCount: 1,
    promisesCount: 1,
    notes: "Strategic client. Always confirm the next step before ending a meeting.",
  },
  {
    id: "cli_scandium",
    name: "Scandium Kinnisvara",
    contactName: "Priit Noor",
    email: "priit.noor@scandium.example",
    phone: "+372 512 9001",
    status: "lead",
    health: "no_next_step",
    ownerId: "usr_eleonora",
    nextStep: "Assign owner and schedule discovery call",
    nextStepDueAt: null,
    activeProjectsCount: 0,
    promisesCount: 1,
    notes: "Inbound lead from referral. Needs fast response and clear owner.",
  },
  {
    id: "cli_pohjanael",
    name: "Põhjanael Stuudio",
    contactName: "Mari Lõhmus",
    email: "mari.lohmus@pohjanael.example",
    phone: "+372 5888 1212",
    status: "active",
    health: "no_next_step",
    ownerId: "usr_martin",
    nextStep: "Define next SEO sprint tasks",
    nextStepDueAt: null,
    activeProjectsCount: 1,
    promisesCount: 0,
    notes: "Last meeting went well. Needs a concrete next step to keep momentum.",
  },
];

export const projects: Project[] = [
  {
    id: "prj_nordic_web",
    name: "Platform website refresh",
    clientId: "cli_nordic",
    ownerId: "usr_martin",
    status: "in_progress",
    progress: 62,
    deadline: addDaysIso(BASE_NOW, 33, 12, 0),
    nextMilestone: "Design approval",
    nextStep: "Send v2 design for approval",
    riskReason: null,
  },
  {
    id: "prj_ruum_portfolio",
    name: "Portfolio site redesign",
    clientId: "cli_ruumdisain",
    ownerId: "usr_siim",
    status: "at_risk",
    progress: 28,
    deadline: addDaysIso(BASE_NOW, 38, 12, 0),
    nextMilestone: "Visual direction locked",
    nextStep: "Request final approval",
    riskReason: "No approval on direction; timeline slipping",
  },
  {
    id: "prj_lumen_ux",
    name: "Mobile app UX sprint",
    clientId: "cli_lumen",
    ownerId: "usr_eleonora",
    status: "in_progress",
    progress: 74,
    deadline: addDaysIso(BASE_NOW, 40, 12, 0),
    nextMilestone: "Prototype walkthrough",
    nextStep: "Run internal QA before workshop",
    riskReason: null,
  },
];

export const tasks: Task[] = [
  {
    id: "tsk_001",
    title: "Send revised proposal",
    clientId: "cli_nordic",
    projectId: "prj_nordic_web",
    assignedTo: "usr_martin",
    createdBy: "usr_eleonora",
    status: "in_progress",
    priority: "high",
    dueAt: addDaysIso(BASE_NOW, 0, 11, 0),
    completedAt: null,
    notes: "Include two scope options and a clear timeline. Keep it one page.",
  },
  {
    id: "tsk_002",
    title: "Client alignment call",
    clientId: "cli_greenfield",
    assignedTo: "usr_katrin",
    createdBy: "usr_eleonora",
    status: "planned",
    priority: "medium",
    dueAt: addDaysIso(BASE_NOW, 0, 14, 0),
    completedAt: null,
    notes: "Confirm deliverables, review invoice schedule, set next step.",
  },
  {
    id: "tsk_003",
    title: "Request final approval on design direction",
    clientId: "cli_ruumdisain",
    projectId: "prj_ruum_portfolio",
    assignedTo: "usr_siim",
    createdBy: "usr_eleonora",
    status: "waiting_on_client",
    priority: "high",
    dueAt: addDaysIso(BASE_NOW, 0, 16, 0),
    completedAt: null,
    notes: "Send 2 options + a single question: pick A or B by end of day.",
  },
  {
    id: "tsk_004",
    title: "Internal QA review before workshop",
    clientId: "cli_lumen",
    projectId: "prj_lumen_ux",
    assignedTo: "usr_eleonora",
    createdBy: "usr_eleonora",
    status: "planned",
    priority: "critical",
    dueAt: addDaysIso(BASE_NOW, 0, 17, 30),
    completedAt: null,
    notes: "Check flows for edge cases; prepare top 5 discussion points.",
  },
  {
    id: "tsk_005",
    title: "Assign discovery owner + schedule call",
    clientId: "cli_scandium",
    assignedTo: "usr_eleonora",
    createdBy: "usr_eleonora",
    status: "overdue",
    priority: "high",
    dueAt: addDaysIso(BASE_NOW, -1, 15, 0),
    completedAt: null,
    notes: "Owner must be explicit before scheduling and follow-ups.",
  },
];

export const promises: Promise[] = [
  {
    id: "prm_001",
    title: "Send proposal v2 (scope options)",
    clientId: "cli_nordic",
    projectId: "prj_nordic_web",
    assignedTo: "usr_martin",
    status: "due_today",
    dueAt: addDaysIso(BASE_NOW, 0, 11, 0),
    completedAt: null,
    notes: "Explicitly confirm next step and decision deadline.",
  },
  {
    id: "prm_002",
    title: "Provide 2 design directions for approval",
    clientId: "cli_ruumdisain",
    projectId: "prj_ruum_portfolio",
    assignedTo: "usr_siim",
    status: "due_today",
    dueAt: addDaysIso(BASE_NOW, 0, 16, 0),
    completedAt: null,
    notes: "Attach references + summary of trade-offs.",
  },
];

export const activityLog: ActivityLogItem[] = [
  {
    id: "act_001",
    date: addDaysIso(BASE_NOW, 0, 9, 10),
    type: "task",
    title: "Proposal drafted (v2)",
    clientOrProject: "Nordic OÜ · Platform website refresh",
    assignedTo: "usr_martin",
    status: "in_progress",
    completedAt: null,
    notes: "Need final pricing numbers and scope option table.",
  },
  {
    id: "act_002",
    date: addDaysIso(BASE_NOW, -2, 11, 0),
    type: "project",
    title: "Project marked at risk",
    clientOrProject: "Ruum Disain OÜ · Portfolio site redesign",
    assignedTo: "usr_siim",
    status: "at_risk",
    completedAt: null,
    notes: "Waiting on approval; add decision deadline.",
  },
];

function recomputeUserRollups(): void {
  for (const u of users) {
    const userTasks = tasks.filter((t) => t.assignedTo === u.id);
    const active = userTasks.filter((t) => t.status !== "done").length;
    const overdue = userTasks.filter((t) => t.status === "overdue").length;
    const assignedClients = unique([
      ...clients.filter((c) => c.ownerId === u.id).map((c) => c.id),
      ...userTasks.map((t) => t.clientId).filter(Boolean),
      ...promises.filter((p) => p.assignedTo === u.id).map((p) => p.clientId),
      ...projects.filter((p) => p.ownerId === u.id).map((p) => p.clientId),
    ] as string[]).length;

    u.activeTasksCount = active;
    u.overdueTasksCount = overdue;
    u.assignedClientsCount = assignedClients;
  }
}

recomputeUserRollups();

export function getCurrentUser(role: Role): User {
  return users.find((u) => u.role === role) ?? users[0]!;
}

export function getDataForRole(role: Role, userId: string) {
  if (role === "manager") return { users, clients, projects, tasks, promises, activityLog };

  const memberTasks = tasks.filter((t) => t.assignedTo === userId);
  const memberPromises = promises.filter((p) => p.assignedTo === userId);
  const memberProjects = projects.filter((p) => p.ownerId === userId);
  const touchedClientIds = unique(
    [
      ...clients.filter((c) => c.ownerId === userId).map((c) => c.id),
      ...memberTasks.map((t) => t.clientId).filter(Boolean),
      ...memberPromises.map((p) => p.clientId),
      ...memberProjects.map((p) => p.clientId),
    ].filter(Boolean) as string[],
  );

  return {
    users: users.filter((u) => u.id === userId),
    clients: clients.filter((c) => touchedClientIds.includes(c.id)),
    projects: memberProjects,
    tasks: memberTasks,
    promises: memberPromises,
    activityLog: activityLog.filter((a) => a.assignedTo === userId),
  };
}

function calcTaskStats(list: Task[]) {
  const total = list.length;
  const open = list.filter((t) => t.status !== "done").length;
  const overdue = list.filter((t) => t.status === "overdue").length;
  const dueToday = list.filter((t) => t.dueAt.slice(0, 10) === BASE_NOW.slice(0, 10) && t.status !== "done").length;
  return { total, open, overdue, dueToday };
}

function calcPromiseStats(list: Promise[]) {
  const total = list.length;
  const open = list.filter((p) => p.status !== "completed").length;
  const overdue = list.filter((p) => p.status === "overdue").length;
  const dueToday = list.filter((p) => p.status === "due_today").length;
  return { total, open, overdue, dueToday };
}

export function getManagerStats() {
  return {
    asOf: BASE_NOW,
    tasks: calcTaskStats(tasks),
    promises: calcPromiseStats(promises),
    clients: {
      total: clients.length,
      highPriority: clients.filter((c) => c.health === "high_priority").length,
      atRisk: clients.filter((c) => c.health === "at_risk").length,
      noNextStep: clients.filter((c) => c.health === "no_next_step" || !c.nextStepDueAt).length,
    },
    projects: {
      total: projects.length,
      atRisk: projects.filter((p) => p.status === "at_risk").length,
      waitingOnClient: projects.filter((p) => p.status === "waiting_on_client").length,
      done: projects.filter((p) => p.status === "done").length,
    },
  };
}

export function getMemberStats(userId: string) {
  return {
    asOf: BASE_NOW,
    tasks: calcTaskStats(tasks.filter((t) => t.assignedTo === userId)),
    promises: calcPromiseStats(promises.filter((p) => p.assignedTo === userId)),
    clients: { total: clients.filter((c) => c.ownerId === userId).length },
    projects: { total: projects.filter((p) => p.ownerId === userId).length },
  };
}

export function getTeamPulse() {
  recomputeUserRollups();
  return {
    asOf: BASE_NOW,
    teamSize: users.length,
    members: users.map((u) => ({
      ...u,
      loadScore: clamp(u.activeTasksCount * 10 + u.overdueTasksCount * 25, 0, 100),
    })),
  };
}

export function getRadarItems(): RadarItem[] {
  const overdueTasks = tasks
    .filter((t) => t.status === "overdue" || (t.status !== "done" && isBefore(t.dueAt, BASE_NOW)))
    .map<RadarItem>((t) => ({
      id: `rad_task_${t.id}`,
      tone: "red",
      type: "task",
      title: t.title,
      subtitle: `${getClientName(t.clientId)} · ${getProjectName(t.projectId)} · ${getUserName(t.assignedTo)}`,
      dueAt: t.dueAt,
      ownerId: t.assignedTo,
      clientId: t.clientId,
      projectId: t.projectId,
    }));

  const missingNextStepClients = clients
    .filter((c) => c.health === "no_next_step" || !c.nextStepDueAt)
    .map<RadarItem>((c) => ({
      id: `rad_client_${c.id}`,
      tone: "neutral",
      type: "client",
      title: c.name,
      subtitle: "Missing a clear next step",
      ownerId: c.ownerId,
      clientId: c.id,
      dueAt: c.nextStepDueAt ?? undefined,
    }));

  return [...overdueTasks, ...missingNextStepClients].slice(0, 24);
}

export function filterReports(filters: ReportFilters = {}) {
  const fromMs = filters.from ? new Date(filters.from).getTime() : null;
  const toMs = filters.to ? new Date(filters.to).getTime() : null;

  return activityLog.filter((row) => {
    const rowMs = new Date(row.date).getTime();
    if (fromMs !== null && rowMs < fromMs) return false;
    if (toMs !== null && rowMs > toMs) return false;
    if (filters.teamMemberId && row.assignedTo !== filters.teamMemberId) return false;
    if (filters.type && row.type !== filters.type) return false;
    if (filters.status && row.status !== filters.status) return false;
    return true;
  });
}

function csvEscape(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  const needsQuotes = /[",\n\r]/.test(raw);
  const escaped = raw.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function exportRowsToCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (!rows.length) return "";
  const keys: string[] = [];
  for (const row of rows) for (const k of Object.keys(row)) if (!keys.includes(k)) keys.push(k);
  const header = keys.map(csvEscape).join(",");
  const lines = rows.map((row) => keys.map((k) => csvEscape(row[k])).join(","));
  return [header, ...lines].join("\n");
}

// ---------------------------------------------------------------------------
// UI-oriented exports used by existing components
// ---------------------------------------------------------------------------

export const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/clients", label: "Clients" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" },
  { href: "/radar", label: "Radar" },
  { href: "/promises", label: "Promises" },
  { href: "/settings", label: "Settings" },
];

export const topMetrics = [
  { title: "Today", value: `${calcTaskStats(tasks).dueToday} tasks`, tone: "blue" as const },
  { title: "Waiting on client", value: `${tasks.filter((t) => t.status === "waiting_on_client").length} items`, tone: "violet" as const },
  { title: "At risk", value: `${projects.filter((p) => p.status === "at_risk").length} projects`, tone: "orange" as const },
  { title: "No next step", value: `${clients.filter((c) => c.health === "no_next_step" || !c.nextStepDueAt).length} clients`, tone: "neutral" as const },
];

export const todayTasks = [
  {
    icon: Send,
    title: "Send revised proposal",
    context: "Nordic OÜ",
    due: "Today 11:00",
    status: "In progress",
    tone: "blue" as const,
  },
  {
    icon: PhoneCall,
    title: "Client alignment call",
    context: "Greenfield OÜ",
    due: "Today 14:00",
    status: "Planned",
    tone: "neutral" as const,
  },
  {
    icon: MessageCircleMore,
    title: "Request final approval",
    context: "Ruum Disain OÜ",
    due: "Today 16:00",
    status: "Waiting on client",
    tone: "violet" as const,
  },
  {
    icon: AlertTriangle,
    title: "Internal QA review",
    context: "Lumen OÜ",
    due: "Today 17:30",
    status: "High priority",
    tone: "orange" as const,
  },
];

export const quickAddItems = ["New client", "New project", "New task", "New promise"];

export const focusInsights = [
  "Start with the Nordic OÜ proposal — due today.",
  "Make sure every client has a concrete next step.",
  "At-risk projects should be reviewed before end of day.",
];

export const stalledItems = [
  {
    title: "Clients missing next step",
    value: String(clients.filter((c) => c.health === "no_next_step" || !c.nextStepDueAt).length),
    helper: "Add a dated next step for each client.",
    icon: Clock3,
    tone: "neutral" as const,
  },
  {
    title: "Projects at risk",
    value: String(projects.filter((p) => p.status === "at_risk").length),
    helper: "Remove blockers before deadlines slip.",
    icon: CalendarClock,
    tone: "orange" as const,
  },
  {
    title: "Promises due today",
    value: String(promises.filter((p) => p.status === "due_today").length),
    helper: "Deliver promises before the client reminds you.",
    icon: CheckCircle2,
    tone: "violet" as const,
  },
];

export const onboardingSteps = ["Add company info", "Import clients", "Add your first project", "Add tasks and promises", "Open your dashboard"];
export const workflowStatuses = ["Not started", "In progress", "Waiting on client", "Done"];
export const integrations = ["Google Calendar", "Gmail", "Outlook", "Slack", "Zapier"];
