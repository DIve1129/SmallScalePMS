import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Appointment = {
    appointment_id: number;
    patient_id: number;
    patient_name: string;
    age?: number | null;
    doctor_name: string;
    appointment_type: string;
    appointment_datetime: string;
    status: string;
};

/**
 * Returns the browser's current local date in YYYY-MM-DD format.
 *
 * This avoids the UTC conversion performed by toISOString(),
 * which can return the previous date shortly after midnight
 * in Sri Lanka.
 */
function getLocalDate(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/* Displays appointments and filters them by the selected date range. */
export default function AppointmentsIndex({
    appointments = [],
    from,
    to,
}: {
    appointments?: Appointment[];
    from?: string;
    to?: string;
}) {
    const today = getLocalDate();

    const [fromDate, setFromDate] = useState(from ?? today);
    const [toDate, setToDate] = useState(to ?? today);

    /* Keeps the local date fields aligned with the returned filters. */
    useEffect(() => {
        setFromDate(from ?? getLocalDate());
    }, [from]);

    useEffect(() => {
        setToDate(to ?? getLocalDate());
    }, [to]);

    const rows = appointments ?? [];

    const inputClass =
        'w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-ring dark:focus:ring-ring/30';

    const buttonClass =
        'h-[46px] rounded-lg border border-blue-100 bg-white px-5 py-3 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground';

    return (
        <AppSidebarLayout
            breadcrumbs={[
                {
                    title: 'Appointments',
                    href: '/appointments',
                },
            ]}
        >
            <Head title="Appointments" />

            <div className="min-h-full space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                {/* Displays the page heading and appointment action. */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                            Appointments
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                            View appointments by date range and create new
                            appointments.
                        </p>
                    </div>

                    <Link
                        href="/appointments/create"
                        className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                    >
                        + New Appointment
                    </Link>
                </div>

                {/* Displays the appointment date filters. */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="appointment-from-date"
                            className="text-sm font-medium text-slate-700 dark:text-foreground"
                        >
                            From
                        </label>

                        <input
                            id="appointment-from-date"
                            type="date"
                            value={fromDate}
                            onChange={(event) =>
                                setFromDate(event.target.value)
                            }
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="appointment-to-date"
                            className="text-sm font-medium text-slate-700 dark:text-foreground"
                        >
                            To
                        </label>

                        <input
                            id="appointment-to-date"
                            type="date"
                            value={toDate}
                            onChange={(event) =>
                                setToDate(event.target.value)
                            }
                            className={inputClass}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            router.get(
                                '/appointments',
                                {
                                    from: fromDate,
                                    to: toDate,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                },
                            );
                        }}
                        className={buttonClass}
                    >
                        Filter
                    </button>
                </div>

                {/* Displays the appointment records. */}
                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
                    {/* Displays the appointment table headings. */}
                    <div className="grid grid-cols-13 border-b border-blue-100 bg-blue-50/70 px-5 py-4 text-sm font-semibold text-slate-700 dark:border-border dark:bg-muted dark:text-foreground">
                        <div className="col-span-2">
                            System Patient ID
                        </div>

                        <div className="col-span-3">
                            Patient Name
                        </div>

                        <div className="col-span-2">
                            Doctor
                        </div>

                        <div className="col-span-2">
                            Status
                        </div>

                        <div className="col-span-2">
                            Appointment Type
                        </div>

                        <div className="col-span-1">
                            Time
                        </div>

                        <div className="col-span-1 text-right">
                            Action
                        </div>
                    </div>

                    {/* Displays appointment rows or the empty message. */}
                    <div className="divide-y divide-blue-50 dark:divide-border">
                        {rows.length > 0 ? (
                            rows.map((appointment) => (
                                <div
                                    key={appointment.appointment_id}
                                    className="grid grid-cols-13 items-center px-5 py-4 text-sm text-slate-800 transition hover:bg-blue-50/40 dark:text-foreground dark:hover:bg-accent/50"
                                >
                                    <div className="col-span-2">
                                        {appointment.patient_id}
                                    </div>

                                    <div className="col-span-3">
                                        {appointment.patient_name}
                                    </div>

                                    <div className="col-span-2">
                                        {appointment.doctor_name}
                                    </div>

                                    <div className="col-span-2">
                                        <span
                                            className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${
                                                appointment.status ===
                                                'Completed'
                                                    ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                                                    : appointment.status ===
                                                        'Cancelled'
                                                      ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                                                      : appointment.status ===
                                                          'No-show'
                                                        ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                                        : appointment.status ===
                                                            'Rescheduled'
                                                          ? 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                                          : 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                            }`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </div>

                                    <div className="col-span-2">
                                        {appointment.appointment_type}
                                    </div>

                                    <div className="col-span-1">
                                        {appointment.appointment_datetime}
                                    </div>

                                    <div className="col-span-1 flex justify-end">
                                        <Link
                                            href={`/appointments/${appointment.appointment_id}/edit`}
                                            className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-10 text-sm text-slate-500 dark:text-muted-foreground">
                                No appointments found for the selected date
                                range.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}