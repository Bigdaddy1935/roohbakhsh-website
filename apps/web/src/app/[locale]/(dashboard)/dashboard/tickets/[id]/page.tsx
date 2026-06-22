import DashboardShell from "@/components/dashboard/DashboardShell";
import TicketDetail from "@/components/dashboard/pages/TicketDetail";

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <DashboardShell>
      <TicketDetail id={id} />
    </DashboardShell>
  );
}
