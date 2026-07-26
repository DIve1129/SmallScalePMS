import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

type Appointment = {
    appointment_id: number;
    patient_id: number | string;
    doctor_id: string;
    app_reason: string;
    scheduled_at: string;
    status: string;
};

type Patient = {
    patient_id: number;
    first_name: string;
    last_name: string;
};

/* Displays the appointment edit form and submits appointment updates. */
export default function EditAppointment({
    appointment,
    patients = [],
}: {
    appointment: Appointment;
    patients?: Patient[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        patient_id: String(appointment.patient_id ?? ''),
        doctor_id: appointment.doctor_id ?? '',
        app_reason: appointment.app_reason ?? '',
        scheduled_at: appointment.scheduled_at
            ? appointment.scheduled_at.slice(0, 16)
            : '',
        status: appointment.status ?? 'Scheduled',
    });

    /* Submits the updated appointment information to the server. */
    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(`/appointments/${appointment.appointment_id}`);
    }

    const inputClass =
        'w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-ring dark:focus:ring-ring/30';

    const labelClass =
        'mb-2 block text-sm font-medium text-slate-700 dark:text-foreground';

    const selectClass =
        'w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-ring dark:focus:ring-ring/30';

    const buttonPrimary =
        'rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90';

    const buttonSecondary =
        'rounded-lg border border-blue-100 bg-white px-5 py-3 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground';

    return (
        <AppSidebarLayout
            breadcrumbs={[
                { title: 'Appointments', href: '/appointments' },
                {
                    title: 'Edit Appointment',
                    href: `/appointments/${appointment.appointment_id}/edit`,
                },
            ]}
        >
            <Head title="Edit Appointment" />

            <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    {/* Displays the page heading. */}
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                            Edit Appointment
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                            Update appointment details and status.
                        </p>
                    </div>

                    {/* Displays the appointment update form. */}
                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
                    >
                        <div>
                            <label className={labelClass}>Patient</label>

                            <select
                                value={data.patient_id}
                                onChange={(event) =>
                                    setData('patient_id', event.target.value)
                                }
                                className={selectClass}
                            >
                                <option value="">Select patient</option>

                                {patients.map((patient) => (
                                    <option
                                        key={patient.patient_id}
                                        value={patient.patient_id}
                                    >
                                        {patient.patient_id} -{' '}
                                        {patient.first_name}{' '}
                                        {patient.last_name}
                                    </option>
                                ))}
                            </select>

                            {errors.patient_id && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.patient_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Doctor ID</label>

                            <input
                                type="text"
                                value={data.doctor_id}
                                onChange={(event) =>
                                    setData('doctor_id', event.target.value)
                                }
                                className={inputClass}
                            />

                            {errors.doctor_id && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.doctor_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Appointment Type / Reason
                            </label>

                            <input
                                type="text"
                                value={data.app_reason}
                                onChange={(event) =>
                                    setData('app_reason', event.target.value)
                                }
                                className={inputClass}
                            />

                            {errors.app_reason && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.app_reason}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Status</label>

                            <select
                                value={data.status}
                                onChange={(event) =>
                                    setData('status', event.target.value)
                                }
                                className={selectClass}
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="No-show">No-show</option>
                                <option value="Rescheduled">Rescheduled</option>
                                <option value="Ongoing">Ongoing</option>
                            </select>

                            {errors.status && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                {data.status === 'Rescheduled'
                                    ? 'New Date & Time'
                                    : 'Date & Time'}
                            </label>

                            <input
                                type="datetime-local"
                                value={data.scheduled_at}
                                onChange={(event) =>
                                    setData(
                                        'scheduled_at',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />

                            {errors.scheduled_at && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.scheduled_at}
                                </p>
                            )}
                        </div>

                        {data.status === 'Rescheduled' && (
                            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
                                Appointment will be marked as rescheduled and
                                saved with the new date/time.
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className={buttonPrimary}
                            >
                                {processing
                                    ? 'Updating...'
                                    : 'Update Appointment'}
                            </button>

                            <Link
                                href="/appointments"
                                className={buttonSecondary}
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}