import { CreditDashboard } from "@/components/dashboard/credit-dashboard";
import { SiteShell } from "@/components/layout/site-shell";

export default function DashboardPage() {
  return (
    <SiteShell>
      <CreditDashboard />
    </SiteShell>
  );
}
