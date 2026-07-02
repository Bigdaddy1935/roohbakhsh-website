import type { Metadata } from "next";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/QueryProvider";
import "@/core/styles/globals.css";

export const metadata: Metadata = {
  title: "پنل مدیریت | آکادمی روح‌بخش",
  description: "پنل مدیریت محتوای آکادمی بین‌المللی اسلامی روح‌بخش",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
