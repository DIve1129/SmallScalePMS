import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

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

export default function Dashboard({
    stats,
    recent_activity = [],
}: DashboardProps) {
    const totalPatients = stats?.total_patients ?? 0;
    const todayRevenue = stats?.today_revenue ?? 0;
    const pendingClaims = stats?.pending_claims ?? 0;

    return (
        <AppSidebarLayout
            breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}
        >
            <Head title="Dashboard" />

            <div className="space-y-6 p-6 text-foreground">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-semibold">
                        Clinical & Financial Command Center
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Real-time facility operations snapshot
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Total Registered Patients
                        </span>

                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-semibold tracking-tight">
                                {totalPatients}
                            </span>

                            <span className="text-xs font-medium text-green-500">
                                +4 this week
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Today's Gross Revenue
                        </span>

                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-semibold tracking-tight">
                                Rs {todayRevenue.toFixed(2)}
                            </span>

                            <span className="text-xs font-medium text-muted-foreground">
                                from scheduled visits
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Pending Billing Claims
                        </span>

                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-semibold tracking-tight text-yellow-500">
                                {pendingClaims}
                            </span>

                            <span className="text-xs font-medium text-muted-foreground">
                                awaiting processing
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Quick Shortcuts */}
                    <div className="space-y-4 rounded-lg border border-border bg-background p-6 lg:col-span-5">
                        <h3 className="border-b border-border pb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                            System Direct Access
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="/appointments/create"
                                className="flex flex-col justify-between rounded-md border border-border bg-muted/30 p-4 text-sm font-medium transition hover:bg-accent"
                            >
                                <span>📅 Book Visit</span>

                                <span className="mt-2 text-xs text-muted-foreground">
                                    New Appointment
                                </span>
                            </a>

                            <a
                                href="/patients/create"
                                className="flex flex-col justify-between rounded-md border border-border bg-muted/30 p-4 text-sm font-medium transition hover:bg-accent"
                            >
                                <span>👤 Intake Patient</span>

                                <span className="mt-2 text-xs text-muted-foreground">
                                    Registration Form
                                </span>
                            </a>

                            <a
                                href="/billing"
                                className="flex flex-col justify-between rounded-md border border-border bg-muted/30 p-4 text-sm font-medium transition hover:bg-accent"
                            >
                                <span>💳 Open Billing</span>

                                <span className="mt-2 text-xs text-muted-foreground">
                                    Process Vouchers
                                </span>
                            </a>

                            <a
                                href="/insurance"
                                className="flex flex-col justify-between rounded-md border border-border bg-muted/30 p-4 text-sm font-medium transition hover:bg-accent"
                            >
                                <span>🛡️ Carriers</span>

                                <span className="mt-2 text-xs text-muted-foreground">
                                    Insurance Panel
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="rounded-lg border border-border bg-background p-6 lg:col-span-7">
                        <h3 className="mb-4 border-b border-border pb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                            Live Encounter Activity Log
                        </h3>

                        <div className="divide-y divide-border text-sm">
                            {recent_activity.length ? (
                                recent_activity.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {item.patient}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {item.doctor}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <span className="block text-xs text-muted-foreground">
                                                {item.time}
                                            </span>

                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    No tracking entries processed today.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Management Reports */}
                    <div className="rounded-lg border border-border bg-background p-6 shadow-sm lg:col-span-12">
                        <div className="mb-4 border-b border-border pb-3">
                            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                Management Reports
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Generate operational and financial reports for the clinic.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* Revenue Report */}
                            <Link
                                href="/reports/revenue"
                                className="group flex min-h-[170px] flex-col justify-between rounded-lg border border-border bg-muted/20 p-5 transition hover:border-primary/50 hover:bg-accent"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-semibold">
                                            Revenue Collection Report
                                        </h3>
                                    </div>

                                    <p className="mt-3 text-sm text-muted-foreground">
                                        View payments collected for individual services within a
                                        selected date-of-service range.
                                    </p>
                                </div>

                                <div className="mt-5 text-sm font-medium text-primary">
                                    View Report →
                                </div>
                            </Link>

                            {/* Outstanding Balance Report */}
                            <Link
                                href="/reports/outstanding"
                                className="group flex min-h-[170px] flex-col justify-between rounded-lg border border-border bg-muted/20 p-5 transition hover:border-primary/50 hover:bg-accent"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-semibold">
                                            Outstanding Balance Report
                                        </h3>
                                    </div>

                                    <p className="mt-3 text-sm text-muted-foreground">
                                        View unpaid and partially paid service balances within a
                                        selected date-of-service range.
                                    </p>
                                </div>

                                <div className="mt-5 text-sm font-medium text-primary">
                                    View Report →
                                </div>
                            </Link>

                            {/* Appointment Summary Report */}
                            <Link
                                href="/reports/appointments"
                                className="group flex min-h-[170px] flex-col justify-between rounded-lg border border-border bg-muted/20 p-5 transition hover:border-primary/50 hover:bg-accent"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-semibold">
                                            Appointment Summary Report
                                        </h3>
                                    </div>

                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Review appointment volumes and statuses within a selected
                                        date-of-service range.
                                    </p>
                                </div>

                                <div className="mt-5 text-sm font-medium text-primary">
                                    View Report →
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}