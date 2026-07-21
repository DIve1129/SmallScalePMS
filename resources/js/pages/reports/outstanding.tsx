import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type OutstandingRow = {
    row_id: string;
    appointment_id: number;
    patient: string;
    doctor: string;
    dos: string;
    service: string;
    charge: number;
    paid: number;
    outstanding: number;
};

type OutstandingSummary = {
    total_charges: number;
    total_paid: number;
    total_outstanding: number;
    outstanding_services: number;
};

type OutstandingReportProps = {
    rows: OutstandingRow[];
    filters: {
        from: string;
        to: string;
    };
    summary: OutstandingSummary;
};

export default function OutstandingReport({
    rows = [],
    filters,
    summary,
}: OutstandingReportProps) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);
    const [filterError, setFilterError] = useState('');

    const formatCurrency = (value: number | string) => {
        const amount = Number(value ?? 0);

        return `Rs ${amount.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (value: string) => {
        if (!value) {
            return '-';
        }

        const dateOnly = value.split('T')[0].split(' ')[0];

        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(`${dateOnly}T00:00:00`));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFilterError('');

        if (!from || !to) {
            setFilterError(
                'Please select both the From DOS and To DOS.',
            );
            return;
        }

        if (from > to) {
            setFilterError(
                'The From DOS cannot be later than the To DOS.',
            );
            return;
        }

        router.get(
            '/reports/outstanding',
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
        setFilterError('');

        router.get(
            '/reports/outstanding',
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
                    title: 'Outstanding Balance Report',
                    href: '/reports/outstanding',
                },
            ]}
        >
            <Head title="Outstanding Balance Report" />

            <div className="space-y-6 p-6 text-foreground">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Outstanding Balance Report
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            View unpaid and partially paid services within a
                            selected date-of-service range.
                        </p>
                    </div>

                    <Link
                        href="/dashboard"
                        className="inline-flex w-fit rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
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
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
                                onChange={(event) =>
                                    setTo(event.target.value)
                                }
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
                            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
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

                {/* Summary cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Total Outstanding
                        </p>

                        <p className="mt-2 text-2xl font-semibold text-yellow-500">
                            {formatCurrency(summary.total_outstanding)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Total Charges
                        </p>

                        <p className="mt-2 text-2xl font-semibold">
                            {formatCurrency(summary.total_charges)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Amount Paid
                        </p>

                        <p className="mt-2 text-2xl font-semibold">
                            {formatCurrency(summary.total_paid)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Outstanding Services
                        </p>

                        <p className="mt-2 text-2xl font-semibold">
                            {summary.outstanding_services}
                        </p>
                    </div>
                </div>

                {/* Report table */}
                <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                    <div className="border-b border-border p-5">
                        <h2 className="font-semibold">
                            Outstanding Balance Details
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Each unpaid or partially paid service is displayed
                            as a separate row.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px] text-left text-sm">
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
                                        Charge
                                    </th>

                                    <th className="px-5 py-3 text-right font-medium">
                                        Paid
                                    </th>

                                    <th className="px-5 py-3 text-right font-medium">
                                        Outstanding
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

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {formatDate(row.dos)}
                                            </td>

                                            <td className="px-5 py-4">
                                                {row.service}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-right">
                                                {formatCurrency(row.charge)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-right">
                                                {formatCurrency(row.paid)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-yellow-500">
                                                {formatCurrency(
                                                    row.outstanding,
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-12 text-center text-muted-foreground"
                                        >
                                            No outstanding balances were found
                                            for the selected DOS range.
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
                                            Totals
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold">
                                            {formatCurrency(
                                                summary.total_charges,
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold">
                                            {formatCurrency(
                                                summary.total_paid,
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-yellow-500">
                                            {formatCurrency(
                                                summary.total_outstanding,
                                            )}
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