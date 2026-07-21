import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type RevenueRow = {
    row_id: string;
    appointment_id: number;
    patient: string;
    doctor: string;
    dos: string;
    service: string;
    payment: number;
};

type RevenueReportProps = {
    rows: RevenueRow[];
    filters: {
        from: string;
        to: string;
    };
    totalRevenue: number;
};

export default function RevenueReport({
    rows,
    filters,
    totalRevenue,
}: RevenueReportProps) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);
    const [filterError, setFilterError] = useState('');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        if (!date) {
            return '-';
        }

        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(new Date(`${date}T00:00:00`));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFilterError('');

        if (!from || !to) {
            setFilterError('Please select both the From Date and To Date.');
            return;
        }

        if (from > to) {
            setFilterError('The From Date cannot be later than the To Date.');
            return;
        }

        router.get(
            '/reports/revenue',
            {
                from,
                to,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleReset = () => {
        router.get(
            '/reports/revenue',
            {},
            {
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <AppSidebarLayout
            breadcrumbs={[
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                },
                {
                    title: 'Revenue Report',
                    href: '/reports/revenue',
                },
            ]}
        >
            <Head title="Revenue Report" />

            <div className="space-y-6 p-6 text-foreground">
                {/* Page heading */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Revenue Collection Report
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Payments collected for services provided within the
                            selected date-of-service range.
                        </p>
                    </div>

                    <Link
                        href="/dashboard"
                        className="inline-flex w-fit items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Report Filters
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end"
                    >
                        <div>
                            <label
                                htmlFor="from"
                                className="mb-1 block text-sm font-medium"
                            >
                                From DOS
                            </label>

                            <input
                                id="from"
                                type="date"
                                value={from}
                                onChange={(event) =>
                                    setFrom(event.target.value)
                                }
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="to"
                                className="mb-1 block text-sm font-medium"
                            >
                                To DOS
                            </label>

                            <input
                                id="to"
                                type="date"
                                value={to}
                                min={from}
                                onChange={(event) => setTo(event.target.value)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
                        >
                            Generate Report
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                        >
                            Reset
                        </button>
                    </form>

                    {filterError && (
                        <p className="mt-3 text-sm text-red-500">
                            {filterError}
                        </p>
                    )}
                </div>

                {/* Report summary */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Total Revenue Collected
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {formatCurrency(totalRevenue)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Paid Service Entries
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {rows.length}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            DOS Range
                        </p>

                        <p className="mt-2 text-base font-semibold">
                            {formatDate(filters.from)} –{' '}
                            {formatDate(filters.to)}
                        </p>
                    </div>
                </div>

                {/* Revenue table */}
                <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                    <div className="border-b border-border p-5">
                        <h2 className="font-semibold">
                            Revenue Collection Details
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Each service and its corresponding payment are
                            displayed as a separate row.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="border-b border-border bg-muted/40">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Patient
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Doctor
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        DOS
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Service
                                    </th>

                                    <th className="px-5 py-3 text-right font-medium">
                                        Payment
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {rows.length > 0 ? (
                                    rows.map((row) => (
                                        <tr
                                            key={row.row_id}
                                            className="transition hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-4 font-medium">
                                                {row.patient}
                                            </td>

                                            <td className="px-5 py-4">
                                                {row.doctor}
                                            </td>

                                            <td className="px-5 py-4">
                                                {formatDate(row.dos)}
                                            </td>

                                            <td className="px-5 py-4">
                                                {row.service}
                                            </td>

                                            <td className="px-5 py-4 text-right font-medium">
                                                {formatCurrency(row.payment)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-12 text-center text-muted-foreground"
                                        >
                                            No collected revenue was found for
                                            the selected DOS range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            {rows.length > 0 && (
                                <tfoot className="border-t border-border bg-muted/40">
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-4 text-right font-semibold"
                                        >
                                            Total Revenue
                                        </td>

                                        <td className="px-5 py-4 text-right text-base font-semibold">
                                            {formatCurrency(totalRevenue)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}