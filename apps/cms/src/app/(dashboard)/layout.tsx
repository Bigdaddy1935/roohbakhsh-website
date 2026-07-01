export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Sidebar placeholder */}
      <aside className="w-[var(--sidebar-w)] shrink-0 bg-white border-e border-gray-100 min-h-screen" />
      {/* Main */}
      <main className="flex-1 min-w-0 p-6">{children}</main>
    </div>
  );
}
