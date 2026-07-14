"use client";

import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-start max-w-[1400px] mx-auto py-12">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-12 px-6 md:px-10">
        {children}
      </main>
    </div>
  );
}
