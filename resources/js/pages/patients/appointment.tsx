import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type AppointmentRow = {
    appointment_id: number;
    patient_id: number | string;
    appointment_type: string;
    appointment_datetime: string;
    status?: string | null;
};

/* Displays all appointments linked to the selected patient. */
export default function PatientAppointments({
    patientId,
    appointments = [],
}: {
    patientId: number | string;
    appointments: AppointmentRow[];
}) {
    return (
        <AppSidebarLayout
            breadcrumbs={[
                { title: 'Patients', href: '/patients' },
                {
                    title: `Patient #${patientId}`,
                    href: `/patients/${patientId}`,
                },
                {
                    title: 'Appointments',
                    href: `/patients/${patientId}/appointments`,
                },
            ]}
        >
            <Head title={`Patient ${patientId} Appointments`} />

            <div className="min-h-full space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                {/* Displays the page heading and navigation actions. */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                            Patient Appointments
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                            Showing all appointments for Patient ID: {patientId}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/appointments/create"
                            className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                        >
                            + New Appointment
                        </Link>

                        <Link
                            href="/patients"
                            className="rounded-lg border border-blue-100 bg-white px-5 py-3 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                        >
                            Back to Patients
                        </Link>
                    </div>
                </div>

                {/* Displays the patient's appointment records. */}
                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
                    {/* Displays the appointment table headings. */}
                    <div className="grid grid-cols-12 border-b border-blue-100 bg-blue-50/70 px-5 py-4 text-sm font-semibold text-slate-700 dark:border-border dark:bg-muted dark:text-foreground">
                        <div className="col-span-2">Patient ID</div>
                        <div className="col-span-4">Appointment Type</div>
                        <div className="col-span-4">Time</div>
                        <div className="col-span-2">Status</div>
                    </div>

                    {/* Displays appointment rows or the empty message. */}
                    <div className="divide-y divide-blue-50 dark:divide-border">
                        {appointments.length ? (
                            appointments.map((appointment) => (
                                <div
                                    key={appointment.appointment_id}
                                    className="grid grid-cols-12 items-center px-5 py-4 text-sm text-slate-800 transition hover:bg-blue-50/40 dark:text-foreground dark:hover:bg-accent/50"
                                >
                                    <div className="col-span-2">
                                        {appointment.patient_id}
                                    </div>

                                    <div className="col-span-4">
                                        {appointment.appointment_type}
                                    </div>

                                    <div className="col-span-4">
                                        {appointment.appointment_datetime}
                                    </div>

                                    <div className="col-span-2">
                                        {appointment.status ?? '-'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-10 text-sm text-slate-500 dark:text-muted-foreground">
                                No appointments found for this patient.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}