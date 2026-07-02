"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

const CONTAINER_PADDING = 24;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const asideRef = useRef<HTMLElement>(null);
  const [contentPaddingTop, setContentPaddingTop] = useState(0);

  useEffect(() => {
    function update() {
      const asideEl = asideRef.current;
      if (!asideEl) return;
      const asideHeight = asideEl.offsetHeight;
      const availableHeight = window.innerHeight - CONTAINER_PADDING * 2;
      const extraOffset = Math.max(0, (availableHeight - asideHeight) / 2);
      setContentPaddingTop(extraOffset);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="min-h-screen flex items-start max-w-[1400px] mx-auto py-6">
      <Sidebar ref={asideRef} />
      <main
        className="flex-1 min-w-0 pb-6 px-6 md:px-10"
        style={{ paddingTop: contentPaddingTop }}
      >
        {children}
      </main>
    </div>
  );
}
