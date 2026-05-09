export type ReportRow = {
  date: string; // YYYY-MM-DD
  type: "Tasks" | "Projects" | "Promises" | "Clients" | "Notes";
  title: string;
  clientProject: string;
  assignedTo: string;
  status: string;
  completedAt: string;
  notes: string;
};

export type ReportFilters = {
  dateFrom: string;
  dateTo: string;
  teamMember: string;
  status: string;
  type: "All" | ReportRow["type"];
};

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function filterReports(rows: ReportRow[], filters: ReportFilters) {
  return rows.filter((row) => {
    if (filters.type !== "All" && row.type !== filters.type) return false;
    if (filters.teamMember && row.assignedTo !== filters.teamMember) return false;
    if (filters.status && row.status !== filters.status) return false;

    if (filters.dateFrom && isIsoDate(row.date) && row.date < filters.dateFrom) return false;
    if (filters.dateTo && isIsoDate(row.date) && row.date > filters.dateTo) return false;

    return true;
  });
}

const CSV_HEADERS = [
  "Date",
  "Type",
  "Title",
  "Client/Project",
  "Assigned To",
  "Status",
  "Completed At",
  "Notes",
] as const;

function csvEscape(value: string) {
  const normalized = value ?? "";
  const needsQuotes = /[",\r\n]/.test(normalized);
  const escaped = normalized.replaceAll('"', '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function exportRowsToCsv(rows: ReportRow[]) {
  const lines: string[] = [];
  lines.push(CSV_HEADERS.join(","));

  for (const row of rows) {
    lines.push(
      [
        row.date,
        row.type,
        row.title,
        row.clientProject,
        row.assignedTo,
        row.status,
        row.completedAt,
        row.notes,
      ]
        .map((cell) => csvEscape(String(cell ?? "")))
        .join(","),
    );
  }

  return lines.join("\r\n");
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

