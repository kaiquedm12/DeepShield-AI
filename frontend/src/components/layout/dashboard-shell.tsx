import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({
  current,
  children,
}: {
  current?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar current={current} />
      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
