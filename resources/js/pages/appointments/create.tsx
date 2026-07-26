import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

type PatientLite = {
    patient_id: number;
    first_name: string | null;
    last_name: string | null;
};

type DoctorLite = {
    doctor_id: number;
    first_name: string | null;
    last_name: string | null;
};

type ChargeMaster = {
    billing_id: number;
    service_name: string;
    amount: number | string;
};

/* Displays the appointment creation form and submits a new appointment. */
export default function AppointmentCreate({
    patients,
    doctors = [],
    chargeMasters = [],
}: {
    patients: PatientLite[];
    doctors?: DoctorLite[];
    chargeMasters?: ChargeMaster[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        doctor_id: '',
        app_reason: '',
        scheduled_at: '',
        status: 'Scheduled',
        amount_1: '',
    });

    /* Submits the appointment information to the server. */
    function submit(event: React.FormEvent) {
        event.preventDefault();
        post('/appointments');
    }

    const inputClass =
        'w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-ring dark:focus:ring-ring/30';

    const selectClass = inputClass;

    const labelClass =
        'mb-2 block text-sm font-medium text-slate-700 dark:text-foreground';

    const buttonPrimary =
        'rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90';

    const buttonSecondary =
        'rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground';

    return (
        <AppSidebarLayout
            breadcrumbs={[
                { title: 'Appointments', href: '/appointments' },
                {
                    title: 'New Appointment',
                    href: '/appointments/create',
                },
            ]}
        >
            <Head title="New Appointment" />

            <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                <div className="mx-auto w-full max-w-3xl">
                    {/* Displays the page heading and back action. */}
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                                New Appointment
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                                Fill appointment details and save
                            </p>
                        </div>

                        <Link
                            href="/appointments"
                            className={buttonSecondary}
                        >
                            Back
                        </Link>
                    </div>

                    {/* Displays the new appointment form. */}
                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
                    >
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                            Appointment Details
                        </h2>

                        {/* Selects the patient for the appointment. */}
                        <div>
                            <label className={labelClass}>Patient</label>

                            <div className="flex gap-2">
                                <select
                                    className={selectClass}
                                    value={data.patient_id}
                                    onChange={(event) =>
                                        setData(
                                            'patient_id',
                                            event.target.value,
                                        )
                                    }
                                >
                                    <option value="">
                                        Select a patient...
                                    </option>

                                    {patients.map((patient) => {
                                        const fullName =
                                            `${patient.first_name ?? ''} ${
                                                patient.last_name ?? ''
                                            }`.trim() ||
                                            `Patient #${patient.patient_id}`;

                                        return (
                                            <option
                                                key={patient.patient_id}
                                                value={patient.patient_id}
                                            >
                                                {patient.patient_id} -{' '}
                                                {fullName}
                                            </option>
                                        );
                                    })}
                                </select>

                                <Link
                                    href="/patients/create"
                                    className="whitespace-nowrap rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                                >
                                    New Patient
                                </Link>
                            </div>

                            {errors.patient_id && (
                                <div className="mt-2 text-xs text-red-500">
                                    {errors.patient_id}
                                </div>
                            )}
                        </div>

                        {/* Selects the attending doctor. */}
                        <div>
                            <label className={labelClass}>Doctor</label>

                            <select
                                className={selectClass}
                                value={data.doctor_id}
                                onChange={(event) =>
                                    setData(
                                        'doctor_id',
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="">Select a doctor...</option>

                                {doctors.map((doctor) => {
                                    const doctorFullName =
                                        `${doctor.first_name ?? ''} ${
                                            doctor.last_name ?? ''
                                        }`.trim() ||
                                        `Doctor #${doctor.doctor_id}`;

                                    return (
                                        <option
                                            key={doctor.doctor_id}
                                            value={doctor.doctor_id}
                                        >
                                            {doctor.doctor_id} -{' '}
                                            {doctorFullName}
                                        </option>
                                    );
                                })}
                            </select>

                            {errors.doctor_id && (
                                <div className="mt-2 text-xs text-red-500">
                                    {errors.doctor_id}
                                </div>
                            )}
                        </div>

                        {/* Selects the appointment service and amount. */}
                        <div>
                            <label className={labelClass}>Reason</label>

                            <select
                                className={selectClass}
                                value={data.app_reason}
                                onChange={(event) => {
                                    const selected =
                                        chargeMasters.find(
                                            (charge) =>
                                                charge.service_name ===
                                                event.target.value,
                                        );

                                    setData((current) => ({
                                        ...current,
                                        app_reason: event.target.value,
                                        amount_1: selected
                                            ? String(selected.amount)
                                            : '',
                                    }));
                                }}
                            >
                                <option value="">Select service...</option>

                                {chargeMasters.map((charge) => (
                                    <option
                                        key={charge.billing_id}
                                        value={charge.service_name}
                                    >
                                        {charge.service_name} - Rs{' '}
                                        {Number(
                                            charge.amount ?? 0,
                                        ).toFixed(2)}
                                    </option>
                                ))}
                            </select>

                            {errors.app_reason && (
                                <div className="mt-2 text-xs text-red-500">
                                    {errors.app_reason}
                                </div>
                            )}
                        </div>

                        {/* Displays the selected service amount. */}
                        <div>
                            <label className={labelClass}>
                                Base Amount
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                readOnly
                                className="w-full rounded-lg border border-blue-100 bg-[#F8FBFF] px-3 py-2 text-sm text-slate-800 outline-none dark:border-border dark:bg-muted dark:text-foreground"
                                value={data.amount_1}
                                placeholder="Auto-filled from selected service"
                            />

                            {errors.amount_1 && (
                                <div className="mt-2 text-xs text-red-500">
                                    {errors.amount_1}
                                </div>
                            )}
                        </div>

                        {/* Selects the appointment date and time. */}
                        <div>
                            <label className={labelClass}>
                                Scheduled Date & Time
                            </label>

                            <input
                                type="datetime-local"
                                className={inputClass}
                                value={data.scheduled_at}
                                onChange={(event) =>
                                    setData(
                                        'scheduled_at',
                                        event.target.value,
                                    )
                                }
                            />

                            {errors.scheduled_at && (
                                <div className="mt-2 text-xs text-red-500">
                                    {errors.scheduled_at}
                                </div>
                            )}
                        </div>

                        {/* Selects the initial appointment status. */}
                        <div>
                            <label className={labelClass}>Status</label>

                            <select
                                className={selectClass}
                                value={data.status}
                                onChange={(event) =>
                                    setData('status', event.target.value)
                                }
                            >
                                <option value="Scheduled">
                                    Scheduled
                                </option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">
                                    Completed
                                </option>
                                <option value="Cancelled">
                                    Cancelled
                                </option>
                            </select>

                            {errors.status && (
                                <div className="mt-2 text-xs text-red-500">
                                    {errors.status}
                                </div>
                            )}
                        </div>

                        {/* Displays the form actions. */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={buttonPrimary}
                            >
                                {processing
                                    ? 'Saving...'
                                    : 'Save Appointment'}
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