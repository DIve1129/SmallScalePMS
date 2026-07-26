import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

/* Defines the structure of an individual recent activity record. */
type ActivityItem = {
    id: number;
    patient: string;
    doctor: string;
    status: string;
    time: string;
};

/* Defines the data received by the dashboard page from the controller. */
type DashboardProps = {
    stats?: {
        total_patients: number;
        today_revenue: number;
        pending_claims: number;
    };
    recent_activity?: ActivityItem[];
};

/* Displays the main clinical, financial, and operational dashboard. */
export default function Dashboard({
    stats,
    recent_activity = [],
}: DashboardProps) {
    /* Uses zero as the default when dashboard statistics are unavailable. */
    const totalPatients = stats?.total_patients ?? 0;
    const todayRevenue = stats?.today_revenue ?? 0;
    const pendingClaims = stats?.pending_claims ?? 0;

    return (
        <AppSidebarLayout
            breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}
        >
            <Head title="Dashboard" />

            <div className="min-h-full space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                {/* Displays the dashboard page title and supporting description. */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-foreground">
                        Clinical &amp; Financial Command Center
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                        Real-time facility operations snapshot
                    </p>
                </div>

                {/* Displays the primary dashboard statistics. */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Displays the total number of registered patients. */}
                    <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-border dark:bg-card">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-muted-foreground">
                                    Total Registered Patients
                                </span>

                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-foreground">
                                        {totalPatients}
                                    </span>

                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        +4 this week
                                    </span>
                                </div>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-muted">
                                👥
                            </div>
                        </div>
                    </div>

                    {/* Displays the total revenue received today. */}
                    <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-border dark:bg-card">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-muted-foreground">
                                    Today&apos;s Gross Revenue
                                </span>

                                <div className="mt-3">
                                    <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-foreground">
                                        Rs {todayRevenue.toFixed(2)}
                                    </span>

                                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-muted-foreground">
                                        From scheduled visits
                                    </p>
                                </div>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl dark:bg-muted">
                                💳
                            </div>
                        </div>
                    </div>

                    {/* Displays the number of claims awaiting billing processing. */}
                    <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-border dark:bg-card">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-muted-foreground">
                                    Pending Billing Claims
                                </span>

                                <div className="mt-3">
                                    <span className="text-3xl font-semibold tracking-tight text-amber-600 dark:text-amber-400">
                                        {pendingClaims}
                                    </span>

                                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-muted-foreground">
                                        Awaiting processing
                                    </p>
                                </div>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl dark:bg-muted">
                                📄
                            </div>
                        </div>
                    </div>
                </div>

                {/* Displays the dashboard shortcuts, activity log, and reports. */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Provides quick access to frequently used system pages. */}
                    <div className="space-y-4 rounded-xl border border-blue-100 bg-white p-6 shadow-sm lg:col-span-5 dark:border-border dark:bg-card">
                        <div className="border-b border-blue-100 pb-3 dark:border-border">
                            <h2 className="text-sm font-semibold tracking-wider text-slate-700 uppercase dark:text-foreground">
                                System Direct Access
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
                                Quickly access frequently used clinic functions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {/* Opens the appointment creation page. */}
                            <Link
                                href="/appointments/create"
                                className="group flex min-h-[110px] flex-col justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-[#EAF5FF] hover:shadow-sm dark:border-border dark:bg-muted dark:hover:border-border dark:hover:bg-accent"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-800 dark:text-foreground">
                                        Book Visit
                                    </span>

                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm dark:bg-background">
                                        📅
                                    </span>
                                </div>

                                <span className="mt-3 text-xs font-medium text-slate-500 group-hover:text-[#2563EB] dark:text-muted-foreground dark:group-hover:text-accent-foreground">
                                    New Appointment
                                </span>
                            </Link>

                            {/* Opens the patient registration page. */}
                            <Link
                                href="/patients/create"
                                className="group flex min-h-[110px] flex-col justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-[#EAF5FF] hover:shadow-sm dark:border-border dark:bg-muted dark:hover:border-border dark:hover:bg-accent"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-800 dark:text-foreground">
                                        Intake Patient
                                    </span>

                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm dark:bg-background">
                                        👤
                                    </span>
                                </div>

                                <span className="mt-3 text-xs font-medium text-slate-500 group-hover:text-[#2563EB] dark:text-muted-foreground dark:group-hover:text-accent-foreground">
                                    Registration Form
                                </span>
                            </Link>

                            {/* Opens the billing management page. */}
                            <Link
                                href="/billing"
                                className="group flex min-h-[110px] flex-col justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-[#EAF5FF] hover:shadow-sm dark:border-border dark:bg-muted dark:hover:border-border dark:hover:bg-accent"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-800 dark:text-foreground">
                                        Open Billing
                                    </span>

                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm dark:bg-background">
                                        💳
                                    </span>
                                </div>

                                <span className="mt-3 text-xs font-medium text-slate-500 group-hover:text-[#2563EB] dark:text-muted-foreground dark:group-hover:text-accent-foreground">
                                    Process Vouchers
                                </span>
                            </Link>

                            {/* Opens the insurance carrier management page. */}
                            <Link
                                href="/insurance"
                                className="group flex min-h-[110px] flex-col justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-[#EAF5FF] hover:shadow-sm dark:border-border dark:bg-muted dark:hover:border-border dark:hover:bg-accent"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-800 dark:text-foreground">
                                        Carriers
                                    </span>

                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm dark:bg-background">
                                        🛡️
                                    </span>
                                </div>

                                <span className="mt-3 text-xs font-medium text-slate-500 group-hover:text-[#2563EB] dark:text-muted-foreground dark:group-hover:text-accent-foreground">
                                    Insurance Panel
                                </span>
                            </Link>
                        </div>
                    </div>
                                        {/* Displays the most recent patient encounter activity. */}
                    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm lg:col-span-7 dark:border-border dark:bg-card">
                        <div className="mb-4 border-b border-blue-100 pb-3 dark:border-border">
                            <h2 className="text-sm font-semibold tracking-wider text-slate-700 uppercase dark:text-foreground">
                                Live Encounter Activity Log
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
                                Recent clinical and appointment activity.
                            </p>
                        </div>

                        <div className="divide-y divide-blue-50 text-sm dark:divide-border">
                            {recent_activity.length ? (
                                recent_activity.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-800 dark:text-foreground">
                                                {item.patient}
                                            </p>

                                            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-muted-foreground">
                                                {item.doctor}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <span className="block text-xs text-slate-500 dark:text-muted-foreground">
                                                {item.time}
                                            </span>

                                            <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#2563EB] uppercase dark:bg-muted dark:text-foreground">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg bg-slate-50 py-8 text-center text-sm text-slate-500 dark:bg-muted dark:text-muted-foreground">
                                    No tracking entries processed today.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Provides access to the clinic's management reports. */}
                    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm lg:col-span-12 dark:border-border dark:bg-card">
                        <div className="mb-5 border-b border-blue-100 pb-3 dark:border-border">
                            <h2 className="text-sm font-semibold tracking-wider text-slate-700 uppercase dark:text-foreground">
                                Management Reports
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                                Generate operational and financial reports for
                                the clinic.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* Opens the revenue collection report. */}
                            <Link
                                href="/reports/revenue"
                                className="group flex min-h-[180px] flex-col justify-between rounded-xl border border-blue-100 border-l-4 border-l-[#2563EB] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-border dark:border-l-blue-500 dark:bg-background dark:hover:border-border"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#2563EB] uppercase dark:bg-muted dark:text-blue-400">
                                                Financial
                                            </span>

                                            <h3 className="mt-3 font-semibold text-slate-900 dark:text-foreground">
                                                Revenue Collection Report
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-muted-foreground">
                                        View payments collected for individual
                                        services within a selected
                                        date-of-service range.
                                    </p>
                                </div>

                                <div className="mt-5 text-sm font-semibold text-[#2563EB] transition group-hover:translate-x-1 dark:text-blue-400">
                                    View Report →
                                </div>
                            </Link>

                            {/* Opens the outstanding patient balance report. */}
                            <Link
                                href="/reports/outstanding"
                                className="group flex min-h-[180px] flex-col justify-between rounded-xl border border-blue-100 border-l-4 border-l-amber-500 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-border dark:border-l-amber-500 dark:bg-background dark:hover:border-border"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-amber-700 uppercase dark:bg-muted dark:text-amber-400">
                                                Receivables
                                            </span>

                                            <h3 className="mt-3 font-semibold text-slate-900 dark:text-foreground">
                                                Outstanding Balance Report
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-muted-foreground">
                                        View unpaid and partially paid service
                                        balances within a selected
                                        date-of-service range.
                                    </p>
                                </div>

                                <div className="mt-5 text-sm font-semibold text-[#2563EB] transition group-hover:translate-x-1 dark:text-blue-400">
                                    View Report →
                                </div>
                            </Link>

                            {/* Opens the appointment summary report. */}
                            <Link
                                href="/reports/appointments"
                                className="group flex min-h-[180px] flex-col justify-between rounded-xl border border-blue-100 border-l-4 border-l-emerald-500 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-border dark:border-l-emerald-500 dark:bg-background dark:hover:border-border"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-emerald-700 uppercase dark:bg-muted dark:text-emerald-400">
                                                Operations
                                            </span>

                                            <h3 className="mt-3 font-semibold text-slate-900 dark:text-foreground">
                                                Appointment Summary Report
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-muted-foreground">
                                        Review appointment volumes and statuses
                                        within a selected date-of-service range.
                                    </p>
                                </div>

                                <div className="mt-5 text-sm font-semibold text-[#2563EB] transition group-hover:translate-x-1 dark:text-blue-400">
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