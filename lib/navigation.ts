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
  if (role === "member") {
    return [
      { href: "/my-day", label: "My Day", icon: LayoutDashboard },
      { href: "/clients", label: "My Clients", icon: Users },
      { href: "/projects", label: "My Projects", icon: FolderKanban },
      { href: "/tasks", label: "My Tasks", icon: ListTodo },
      { href: "/promises", label: "Promises", icon: Handshake },
      { href: "/settings", label: "Settings", icon: Settings },
    ];
  }

  return [
    { href: "/manager", label: "Command Center", icon: LayoutDashboard },
    { href: "/team", label: "Team", icon: Users },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/tasks", label: "Tasks", icon: ListTodo },
    { href: "/radar", label: "Radar", icon: Radar },
    { href: "/promises", label: "Promises", icon: Handshake },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
}
