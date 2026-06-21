import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardHome from "@/components/dashboard/pages/DashboardHome";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHome />
    </DashboardShell>
  );
}
