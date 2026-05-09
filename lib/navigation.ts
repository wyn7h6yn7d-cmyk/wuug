import {
  BarChart3,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  ListTodo,
  Radar,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function getNavigationForRole(role: "owner" | "manager" | "member"): NavigationItem[] {
  const base: NavigationItem[] = [
    { href: "/", label: "My Day", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/tasks", label: "Tasks", icon: ListTodo },
    { href: "/radar", label: "Radar", icon: Radar },
    { href: "/promises", label: "Promises", icon: Handshake },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  if (role === "member") return base;

  return [
    ...base.slice(0, 6),
    { href: "/reports", label: "Reports", icon: BarChart3 },
    ...base.slice(6),
  ];
}
