import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] max-w-[1400px] mx-auto">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6">{children}</main>
    </div>
  );
}
