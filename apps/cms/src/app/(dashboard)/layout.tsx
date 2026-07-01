export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] max-w-[1120px] mx-auto">
      {/* Sidebar placeholder */}
      <aside className="w-[var(--sidebar-w)] shrink-0 bg-white border-e border-gray-100 min-h-screen flex flex-col">
        <div className="flex items-center justify-center p-5 border-b border-gray-100">
          <img src="https://roohbakhshac.ir/logo.png" alt="روح‌بخش" className="h-12 object-contain" />
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 min-w-0 p-6">{children}</main>
    </div>
  );
}
