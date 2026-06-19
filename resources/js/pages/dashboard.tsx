import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head } from '@inertiajs/react';

type ActivityItem = {
  id: number;
  patient: string;
  doctor: string;
  status: string;
  time: string;
};

type DashboardProps = {
  stats?: {
    total_patients: number;
    today_revenue: number;
    pending_claims: number;
  };
  recent_activity?: ActivityItem[];
};

export default function Dashboard({ stats, recent_activity = [] }: DashboardProps) {
  // Safe fallbacks for display metrics
  const totalPatients = stats?.total_patients ?? 0;
  const todayRevenue = stats?.today_revenue ?? 0;
  const pendingClaims = stats?.pending_claims ?? 0;

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
      <Head title="Dashboard" />

      <div className="space-y-6 p-6 text-foreground">
        {/* Row 1: Title */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clinical & Financial Command Center</h1>
          <p className="text-sm text-muted-foreground">Real-time facility operations snapshot</p>
        </div>

        {/* Row 2: Top 3 Cards Mapping over those empty layout slots */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Registered Patients</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight">{totalPatients}</span>
              <span className="text-xs font-medium text-green-500">+4 this week</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Today's Gross Revenue</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight">Rs {todayRevenue.toFixed(2)}</span>
              <span className="text-xs font-medium text-muted-foreground">from scheduled visits</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending Billing Claims</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-yellow-500">{pendingClaims}</span>
              <span className="text-xs font-medium text-muted-foreground">awaiting processing</span>
            </div>
          </div>
        </div>

        {/* Row 3: Large Bottom Layout Splitting Container */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Quick Shortcuts Grid (Left Box - 5 Columns Wide) */}
          <div className="rounded-lg border border-border bg-background p-6 lg:col-span-5 space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
              System Direct Access
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="/appointments/create" className="flex flex-col justify-between p-4 rounded-md border border-border bg-muted/30 hover:bg-accent transition text-sm font-medium">
                <span>📅 Book Visit</span>
                <span className="text-xs text-muted-foreground mt-2">New Appointment</span>
              </a>
              <a href="/patients/create" className="flex flex-col justify-between p-4 rounded-md border border-border bg-muted/30 hover:bg-accent transition text-sm font-medium">
                <span>👤 Intake Patient</span>
                <span className="text-xs text-muted-foreground mt-2">Registration Form</span>
              </a>
              <a href="/billing" className="flex flex-col justify-between p-4 rounded-md border border-border bg-muted/30 hover:bg-accent transition text-sm font-medium">
                <span>💳 Open Billing</span>
                <span className="text-xs text-muted-foreground mt-2">Process Vouchers</span>
              </a>
              <a href="/insurance" className="flex flex-col justify-between p-4 rounded-md border border-border bg-muted/30 hover:bg-accent transition text-sm font-medium">
                <span>🛡️ Carriers</span>
                <span className="text-xs text-muted-foreground mt-2">Insurance Panel</span>
              </a>
            </div>
          </div>

          {/* Live System Activity Queue (Right Box - 7 Columns Wide) */}
          <div className="rounded-lg border border-border bg-background p-6 lg:col-span-7">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mb-4">
              Live Encounter Activity Log
            </h3>
            <div className="divide-y divide-border text-sm">
              {recent_activity.length ? (
                recent_activity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.patient}</p>
                      <p className="text-xs text-muted-foreground">{item.doctor}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">{item.time}</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground text-sm">
                  No tracking entries processed today.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </AppSidebarLayout>
  );
}