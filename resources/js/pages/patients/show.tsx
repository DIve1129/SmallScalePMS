import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type Patient = {
    patient_id: number | string;
    first_name?: string | null;
    last_name?: string | null;
    dob?: string | null;
    age?: number | string | null;
    nic?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    insurance_name?: string | null;
    insurance_id?: string | null;
    notes?: string | null;
};

/* Displays the selected patient's demographic and insurance information. */
export default function PatientShow({ patient }: { patient: Patient }) {
    return (
        <AppSidebarLayout
            breadcrumbs={[
                { title: 'Patients', href: '/patients' },
                {
                    title: `Patient #${patient.patient_id}`,
                    href: `/patients/${patient.patient_id}`,
                },
            ]}
        >
            <Head title="Patient Details" />

            <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                <div className="mx-auto w-full max-w-3xl">
                    {/* Displays the page heading and patient actions. */}
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">Patient Details</h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">Demographic and insurance information</p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href="/patients"
                                className="rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                            >
                                Back
                            </Link>

                            <Link
                                href={`/patients/${patient.patient_id}/edit`}
                                className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                            >
                                Edit
                            </Link>
                        </div>
                    </div>

                    {/* Displays the patient's demographic and insurance fields. */}
                    <div className="space-y-6 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">Demographic</h2>

                        <Field label="Chart Number" value={patient.patient_id} />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="First Name" value={patient.first_name} />

                            <Field label="Last Name" value={patient.last_name} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="DOB" value={patient.dob} />
                            <Field label="Age" value={patient.age} />
                        </div>

                        <Field label="NIC" value={patient.nic} />
                        <Field label="Address" value={patient.address} />
                        <Field label="Phone" value={patient.phone} />
                        <Field label="Email" value={patient.email} />

                        <div className="space-y-6 border-t border-blue-100 pt-4 dark:border-border">
                            <Field label="Insurance Name" value={patient.insurance_name} />

                            <Field label="Insurance ID" value={patient.insurance_id} />
                        </div>

                        <div className="border-t border-blue-100 pt-4 dark:border-border">
                            <Field label="Notes" value={patient.notes} large />
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}

/* Displays a read-only patient information field. */
function Field({ label, value, large = false }: { label: string; value?: string | number | null; large?: boolean }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-foreground">{label}</label>

            <div
                className={`w-full rounded-lg border border-blue-100 bg-[#F8FBFF] px-4 py-3 text-sm text-slate-800 dark:border-border dark:bg-muted dark:text-foreground ${
                    large ? 'min-h-[90px]' : ''
                }`}
            >
                {value || '-'}
            </div>
        </div>
    );
}
