"use client";

import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-start max-w-[1400px] mx-auto py-4 md:py-12 px-3 md:px-6 gap-4">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-12 pt-2 md:pt-0">
        {children}
      </main>
    </div>
  );
}
