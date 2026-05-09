export type PromiseStatus = "active" | "due_today" | "due_soon" | "overdue" | "completed";

function isSameLocalDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function derivePromiseStatus({
  dueAt,
  completedAt,
  now = new Date(),
}: {
  dueAt: string | Date | null;
  completedAt: string | Date | null;
  now?: Date;
}): PromiseStatus {
  if (completedAt) return "completed";
  if (!dueAt) return "active";

  const due = typeof dueAt === "string" ? new Date(dueAt) : dueAt;
  const dueTime = due.getTime();
  const nowTime = now.getTime();

  if (Number.isNaN(dueTime)) return "active";
  if (dueTime < nowTime) return "overdue";
  if (isSameLocalDate(due, now)) return "due_today";

  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  if (dueTime - nowTime <= sevenDaysMs) return "due_soon";

  return "active";
}

export function promiseStatusLabel(status: PromiseStatus) {
  switch (status) {
    case "overdue":
      return "Overdue";
    case "due_today":
      return "Due today";
    case "due_soon":
      return "Due soon";
    case "completed":
      return "Completed";
    case "active":
    default:
      return "Active";
  }
}

