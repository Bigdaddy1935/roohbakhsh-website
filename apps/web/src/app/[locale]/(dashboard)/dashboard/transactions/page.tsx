import DashboardShell from "@/components/dashboard/DashboardShell";
import Transactions from "@/components/dashboard/pages/Transactions";

export default function TransactionsPage() {
  return (
    <DashboardShell>
      <Transactions />
    </DashboardShell>
  );
}
