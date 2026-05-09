import { SidebarNav } from "./sidebar-nav";
import { TopBar } from "./top-bar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F7FAFF] p-3 sm:p-6">
      <div className="mx-auto grid w-full max-w-[1600px] gap-4 lg:grid-cols-[256px_1fr] lg:gap-6">
        <SidebarNav />
        <div className="min-w-0">
          <TopBar />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
