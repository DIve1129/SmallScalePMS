import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';

type MonthlyComparisonItem = {
    key: 'previous' | 'selected' | 'next';
    month: string;
    count: number;
};

type StatusSummaryItem = {
    status: string;
    count: number;
};

type AppointmentSummary = {
    previous_count: number;
    selected_count: number;
    next_count: number;
    change_from_previous: number | null;
    change_to_next: number | null;
};

type AppointmentReportProps = {
    filters: {
        month: string;
    };
    monthlyComparison: MonthlyComparisonItem[];
    summary: AppointmentSummary;
    statusSummary: StatusSummaryItem[];
};

type ChartPoint = MonthlyComparisonItem & {
    x: number;
    y: number;
};

export default function AppointmentReport({
    filters,
    monthlyComparison = [],
    summary,
    statusSummary = [],
}: AppointmentReportProps) {
    const [month, setMonth] = useState(filters.month);
    const [filterError, setFilterError] = useState('');

    /*
     * SVG chart dimensions.
     */
    const chartWidth = 800;
    const chartHeight = 220;
    const leftPadding = 60;
    const rightPadding = 30;
    const topPadding = 25;
    const bottomPadding = 45;

    const chartPoints = useMemo<ChartPoint[]>(() => {
        const maximumCount = Math.max(
            ...monthlyComparison.map((item) => Number(item.count)),
            1,
        );

        const usableWidth =
            chartWidth - leftPadding - rightPadding;

        const usableHeight =
            chartHeight - topPadding - bottomPadding;

        return monthlyComparison.map((item, index) => {
            const x =
                monthlyComparison.length === 1
                    ? leftPadding + usableWidth / 2
                    : leftPadding +
                      (index * usableWidth) /
                          (monthlyComparison.length - 1);

            const y =
                topPadding +
                usableHeight -
                (Number(item.count) / maximumCount) * usableHeight;

            return {
                ...item,
                x,
                y,
            };
        });
    }, [monthlyComparison]);

    const chartLine = chartPoints
        .map((point) => `${point.x},${point.y}`)
        .join(' ');

    const maximumCount = Math.max(
        ...monthlyComparison.map((item) => Number(item.count)),
        1,
    );

    const gridValues = [
        maximumCount,
        Math.round(maximumCount * 0.75),
        Math.round(maximumCount * 0.5),
        Math.round(maximumCount * 0.25),
        0,
    ];

    const formatChange = (value: number | null) => {
        if (value === null) {
            return 'Not available';
        }

        if (value > 0) {
            return `+${value.toFixed(2)}%`;
        }

        return `${value.toFixed(2)}%`;
    };

    const getChangeClass = (value: number | null) => {
        if (value === null || value === 0) {
            return 'text-muted-foreground';
        }

        return value > 0 ? 'text-green-500' : 'text-red-500';
    };

    const getChangeDescription = (value: number | null) => {
        if (value === null) {
            return 'Cannot calculate because the comparison month has no appointments.';
        }

        if (value > 0) {
            return 'Appointment volume increased.';
        }

        if (value < 0) {
            return 'Appointment volume decreased.';
        }

        return 'Appointment volume remained unchanged.';
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFilterError('');

        if (!month) {
            setFilterError('Please select a month.');
            return;
        }

        router.get(
            '/reports/appointments',
            {
                month,
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
            '/reports/appointments',
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
                    title: 'Appointment Summary Report',
                    href: '/reports/appointments',
                },
            ]}
        >
            <Head title="Appointment Summary Report" />

            <div className="space-y-6 p-6 text-foreground">
                {/* Page header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Appointment Summary Report
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Compare appointment volumes for the previous,
                            selected, and next month.
                        </p>
                    </div>

                    <Link
                        href="/dashboard"
                        className="inline-flex w-fit rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Filter */}
                <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Report Filter
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end"
                    >
                        <div>
                            <label
                                htmlFor="month"
                                className="mb-1 block text-sm font-medium"
                            >
                                Select Month
                            </label>

                            <input
                                id="month"
                                type="month"
                                value={month}
                                onChange={(event) =>
                                    setMonth(event.target.value)
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Previous Month
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {summary.previous_count}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {monthlyComparison[0]?.month ?? '-'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-primary/50 bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Selected Month
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {summary.selected_count}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {monthlyComparison[1]?.month ?? '-'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Next Month Scheduled
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {summary.next_count}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {monthlyComparison[2]?.month ?? '-'}
                        </p>
                    </div>
                </div>

                {/* Percentage changes */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Change From Previous Month
                        </p>

                        <p
                            className={`mt-2 text-2xl font-semibold ${getChangeClass(
                                summary.change_from_previous,
                            )}`}
                        >
                            {formatChange(
                                summary.change_from_previous,
                            )}
                        </p>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {getChangeDescription(
                                summary.change_from_previous,
                            )}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Change To Next Month
                        </p>

                        <p
                            className={`mt-2 text-2xl font-semibold ${getChangeClass(
                                summary.change_to_next,
                            )}`}
                        >
                            {formatChange(summary.change_to_next)}
                        </p>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {getChangeDescription(
                                summary.change_to_next,
                            )}
                        </p>
                    </div>
                </div>

                {/* Appointment trend graph */}
                <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
                    <div className="mb-5">
                        <h2 className="font-semibold">
                            Appointment Volume Comparison
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            The next-month figure represents appointments
                            already scheduled in the system.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <svg
                            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                            className="min-w-[600px] w-full"
                            role="img"
                            aria-label="Appointment volume comparison chart"
                        >
                            {/* Horizontal grid lines */}
                            {gridValues.map((value, index) => {
                                const usableHeight =
                                    chartHeight -
                                    topPadding -
                                    bottomPadding;

                                const y =
                                    topPadding +
                                    (index * usableHeight) /
                                        (gridValues.length - 1);

                                return (
                                    <g key={`${value}-${index}`}>
                                        <line
                                            x1={leftPadding}
                                            y1={y}
                                            x2={
                                                chartWidth -
                                                rightPadding
                                            }
                                            y2={y}
                                            stroke="currentColor"
                                            strokeOpacity="0.15"
                                            strokeWidth="1"
                                        />

                                        <text
                                            x={leftPadding - 15}
                                            y={y + 5}
                                            textAnchor="end"
                                            className="fill-muted-foreground text-[12px]"
                                        >
                                            {value}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Axis titles */}
                            <text
                                x="18"
                                y={chartHeight / 2}
                                textAnchor="middle"
                                transform={`rotate(-90 18 ${
                                    chartHeight / 2
                                })`}
                                className="fill-muted-foreground text-[12px]"
                            >
                                Appointment count
                            </text>

                            {/* Connecting line */}
                            {chartPoints.length > 1 && (
                                <polyline
                                    points={chartLine}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-primary"
                                />
                            )}

                            {/* Data points and labels */}
                            {chartPoints.map((point) => (
                                <g key={point.key}>
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r={
                                            point.key === 'selected'
                                                ? 7
                                                : 5
                                        }
                                        fill="currentColor"
                                        className={
                                            point.key === 'selected'
                                                ? 'text-primary'
                                                : 'text-foreground'
                                        }
                                    />

                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="10"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeOpacity={
                                            point.key === 'selected'
                                                ? '0.45'
                                                : '0'
                                        }
                                        strokeWidth="2"
                                        className="text-primary"
                                    />

                                    <text
                                        x={point.x}
                                        y={point.y - 12}
                                        textAnchor="middle"
                                        className="fill-foreground text-[14px] font-semibold"
                                    >
                                        {point.count}
                                    </text>

                                    <text
                                        x={point.x}
                                        y={chartHeight - 30}
                                        textAnchor="middle"
                                        className="fill-muted-foreground text-[13px]"
                                    >
                                        {point.month}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>

                {/* Selected-month status summary */}
                <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                    <div className="border-b border-border p-5">
                        <h2 className="font-semibold">
                            Selected-Month Status Summary
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Appointment totals grouped by their current
                            status.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px] text-left text-sm">
                            <thead className="border-b border-border bg-muted/40">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Appointment Status
                                    </th>

                                    <th className="px-5 py-3 text-right font-medium">
                                        Count
                                    </th>

                                    <th className="px-5 py-3 text-right font-medium">
                                        Percentage
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {statusSummary.length > 0 ? (
                                    statusSummary.map((item) => {
                                        const percentage =
                                            summary.selected_count > 0
                                                ? (item.count /
                                                      summary.selected_count) *
                                                  100
                                                : 0;

                                        return (
                                            <tr
                                                key={item.status}
                                                className="transition hover:bg-muted/30"
                                            >
                                                <td className="px-5 py-4 font-medium">
                                                    {item.status}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    {item.count}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    {percentage.toFixed(
                                                        2,
                                                    )}
                                                    %
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-5 py-12 text-center text-muted-foreground"
                                        >
                                            No appointments were found for
                                            the selected month.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            {statusSummary.length > 0 && (
                                <tfoot className="border-t border-border bg-muted/40">
                                    <tr>
                                        <td className="px-5 py-4 font-semibold">
                                            Total
                                        </td>

                                        <td className="px-5 py-4 text-right font-semibold">
                                            {summary.selected_count}
                                        </td>

                                        <td className="px-5 py-4 text-right font-semibold">
                                            100.00%
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