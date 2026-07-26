import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/* Defines the patient information displayed on the patient list page. */
type Patient = {
    patient_id: number;
    first_name: string | null;
    last_name: string | null;
    dob?: string | null;
};

/* Displays the searchable patient directory and patient-related actions. */
export default function PatientsIndex({
    patients,
    search,
}: {
    patients: Patient[];
    search?: string;
}) {
    const [term, setTerm] = useState(search ?? '');

    /* Keeps the local search input synchronized with the current URL search value. */
    useEffect(() => {
        setTerm(search ?? '');
    }, [search]);

    const inputClass = `
        w-full max-w-2xl
        rounded-lg border border-blue-100
        bg-white px-4 py-3
        text-sm text-slate-800
        outline-none transition
        placeholder:text-slate-400
        focus:border-[#2563EB]
        focus:ring-2 focus:ring-blue-100
        dark:border-border
        dark:bg-background
        dark:text-foreground
        dark:placeholder:text-muted-foreground
        dark:focus:border-ring
        dark:focus:ring-ring/30
    `;

    const searchButtonClass = `
        inline-flex items-center justify-center
        rounded-lg border border-blue-100
        bg-white px-5 py-3
        text-sm font-medium text-[#2563EB]
        transition-colors
        hover:bg-[#EAF5FF]
        hover:text-[#1D4ED8]
        dark:border-border
        dark:bg-background
        dark:text-foreground
        dark:hover:bg-accent
        dark:hover:text-accent-foreground
    `;

    const primaryButtonClass = `
        inline-flex items-center justify-center
        rounded-lg
        bg-[#2563EB] px-5 py-3
        text-sm font-semibold text-white
        shadow-sm transition-colors
        hover:bg-[#1D4ED8]
        dark:bg-primary
        dark:text-primary-foreground
        dark:hover:bg-primary/90
    `;

    return (
        <AppSidebarLayout
            breadcrumbs={[{ title: 'Patients', href: '/patients' }]}
        >
            <Head title="Patients" />

            <div className="min-h-full space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                {/* Displays the patient directory heading and supporting description. */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-foreground">
                        Patient Directory
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                        Search, review, and manage registered clinic patients.
                    </p>
                </div>

                {/* Displays the patient search controls and registration shortcut. */}
                <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <input
                            className={inputClass}
                            placeholder="Search patient by first name, last name, or patient ID..."
                            value={term}
                            onChange={(event) => setTerm(event.target.value)}
                        />

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/patients"
                                data={{ search: term }}
                                className={searchButtonClass}
                                preserveScroll
                            >
                                Search
                            </Link>

                            <Link
                                href="/patients/create"
                                className={primaryButtonClass}
                            >
                                Add Patient
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Displays all matching patient records. */}
                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
                    {/* Displays the patient table heading. */}
                    <div className="hidden grid-cols-12 border-b border-blue-100 bg-blue-50/70 px-5 py-4 text-xs font-semibold tracking-wider text-slate-600 uppercase md:grid dark:border-border dark:bg-muted dark:text-muted-foreground">
                        <div className="col-span-4">Patient Name</div>
                        <div className="col-span-3">Date of Birth</div>
                        <div className="col-span-2">Patient ID</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    {/* Displays individual patient records or the empty state. */}
                    <div className="divide-y divide-blue-50 dark:divide-border">
                        {patients?.length ? (
                            patients.map((patient) => {
                                const fullName =
                                    `${patient.first_name ?? ''} ${
                                        patient.last_name ?? ''
                                    }`.trim() || '-';

                                const initials =
                                    `${patient.first_name?.charAt(0) ?? ''}${
                                        patient.last_name?.charAt(0) ?? ''
                                    }`.toUpperCase() || 'P';

                                return (
                                    <div
                                        key={patient.patient_id}
                                        className="grid grid-cols-1 gap-4 px-5 py-5 text-sm transition-colors hover:bg-blue-50/40 md:grid-cols-12 md:items-center dark:hover:bg-accent/50"
                                    >
                                        {/* Displays the patient name. */}
                                        <div className="flex items-center gap-3 md:col-span-4">

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-slate-900 dark:text-foreground">
                                                    {fullName}
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500 md:hidden dark:text-muted-foreground">
                                                    Patient ID:{' '}
                                                    {patient.patient_id}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Displays the patient's date of birth. */}
                                        <div className="md:col-span-3">
                                            <span className="mr-2 text-xs font-semibold text-slate-500 uppercase md:hidden dark:text-muted-foreground">
                                                DOB:
                                            </span>

                                            <span className="text-slate-700 dark:text-foreground">
                                                {patient.dob ?? '-'}
                                            </span>
                                        </div>

                                        {/* Displays the system patient identifier. */}
                                        <div className="hidden md:col-span-2 md:block">
                                            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-muted dark:text-foreground">
                                                #{patient.patient_id}
                                            </span>
                                        </div>

                                        {/* Displays patient-specific action links. */}
                                        <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                                            <Link
                                                href={`/patients/${patient.patient_id}`}
                                                className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-medium text-slate -700 transition-colors hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                                            >
                                                View
                                            </Link>

                                            <Link
                                                href={`/patients/${patient.patient_id}/appointments`}
                                                className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                                            >
                                                Appointments
                                            </Link>

                                            <Link
                                                href={`/patients/${patient.patient_id}/billing`}
                                                className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                                            >
                                                Billing
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-5 py-14 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl dark:bg-muted">
                                    👤
                                </div>

                                <h2 className="mt-4 font-semibold text-slate-900 dark:text-foreground">
                                    No matching patients found
                                </h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                                    Try changing the search term or register a
                                    new patient.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}