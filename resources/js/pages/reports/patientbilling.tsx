import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';

type PatientOption = {
    patient_id: string;
    name: string;
};

type SelectedPatient = {
    patient_id: string;
    name: string;
    phone: string | null;
    insurance_name: string | null;
    insurance_id: string | null;
};

type BillingRow = {
    row_id: string;
    appointment_id: number;
    dos: string;
    service: string;
    charge: number;
    paid: number;
    outstanding: number;
};

type ReportFilters = {
    patient_id: string | null;
};

type ReportSummary = {
    total_charges: number;
    total_payments: number;
    outstanding_balance: number;
    service_count: number;
};

type PatientBillingReportProps = {
    patients: PatientOption[];
    selectedPatient: SelectedPatient | null;
    rows: BillingRow[];
    filters: ReportFilters;
    summary: ReportSummary;
};

function formatCurrency(value: number | string) {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
    }).format(amount);
}

function formatDate(date: string) {
    if (!date || date === '-') {
        return '-';
    }

    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(new Date(`${date}T00:00:00`));
}

export default function PatientBillingReport({ patients = [], selectedPatient, rows = [], filters, summary }: PatientBillingReportProps) {
    const [patientId, setPatientId] = useState(filters.patient_id ?? '');

    const [searchTerm, setSearchTerm] = useState('');
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const filteredPatients = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            return patients;
        }

        return patients.filter((patient) => {
            return patient.name.toLowerCase().includes(search) || String(patient.patient_id).toLowerCase().includes(search);
        });
    }, [patients, searchTerm]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError('');

        if (!patientId) {
            setFormError('Please select a patient before generating the report.');

            return;
        }

        router.get(
            '/reports/patientbilling',
            {
                patient_id: patientId,
            },
            {
                preserveScroll: true,
                replace: true,

                onStart: () => {
                    setIsLoading(true);
                },

                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    const handleReset = () => {
        setPatientId('');
        setSearchTerm('');
        setFormError('');

        router.get(
            '/reports/patientbilling',
            {},
            {
                preserveScroll: true,
                replace: true,

                onStart: () => {
                    setIsLoading(true);
                },

                onFinish: () => {
                    setIsLoading(false);
                },
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
                    title: 'Patient Billing Summary',
                    href: '/reports/patientbilling',
                },
            ]}
        >
            <Head title="Patient Billing Summary Report" />

            <div className="min-h-full space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                {/* Page heading */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">Patient Billing Summary Report</h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                            Select a patient to review their consolidated charges, payments, and outstanding balances.
                        </p>
                    </div>

                    <Link
                        href="/dashboard"
                        className="inline-flex w-fit items-center rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Patient report filter */}
                <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase dark:text-foreground">Patient Selection</h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                            Search by patient name or patient ID, then select the required patient.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:items-end">
                        <div>
                            <label htmlFor="patient-search" className="mb-2 block text-sm font-medium text-slate-700 dark:text-foreground">
                                Search Patient
                            </label>

                            <input
                                id="patient-search"
                                type="text"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Enter name or patient ID"
                                className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-800 transition outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring"
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label htmlFor="patient-id" className="mb-2 block text-sm font-medium text-slate-700 dark:text-foreground">
                                Select Patient
                            </label>

                            <select
                                id="patient-id"
                                value={patientId}
                                onChange={(event) => setPatientId(event.target.value)}
                                className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-800 transition outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring"
                            >
                                <option value="">Select a patient</option>

                                {filteredPatients.map((patient) => (
                                    <option key={patient.patient_id} value={patient.patient_id}>
                                        {patient.name} — {patient.patient_id}
                                    </option>
                                ))}
                            </select>

                            {searchTerm && filteredPatients.length === 0 && (
                                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">No patients match your search.</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? 'Loading...' : 'Generate Report'}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isLoading}
                                className="rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] disabled:cursor-not-allowed disabled:opacity-60 dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                            >
                                Reset
                            </button>
                        </div>
                    </form>

                    {formError && <p className="mt-3 text-sm text-red-500">{formError}</p>}
                </div>

                {selectedPatient ? (
                    <>
                        {/* Selected patient details */}
                        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-muted-foreground">
                                        Selected Patient
                                    </p>

                                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-foreground">{selectedPatient.name}</h2>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">Patient ID: {selectedPatient.patient_id}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                    <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-muted">
                                        <p className="text-xs text-slate-500 dark:text-muted-foreground">Phone</p>

                                        <p className="mt-1 font-medium text-slate-800 dark:text-foreground">
                                            {selectedPatient.phone || 'Not provided'}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-muted">
                                        <p className="text-xs text-slate-500 dark:text-muted-foreground">Insurance</p>

                                        <p className="mt-1 font-medium text-slate-800 dark:text-foreground">
                                            {selectedPatient.insurance_name || 'Self-pay / Not provided'}
                                        </p>

                                        {selectedPatient.insurance_id && (
                                            <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
                                                ID: {selectedPatient.insurance_id}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Report totals */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
                                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-muted-foreground">
                                    Total Charges
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-foreground">
                                    {formatCurrency(summary.total_charges)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
                                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-muted-foreground">
                                    Total Payments
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(summary.total_payments)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
                                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-muted-foreground">
                                    Outstanding Balance
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-amber-600 dark:text-amber-400">
                                    {formatCurrency(summary.outstanding_balance)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
                                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-muted-foreground">
                                    Service Entries
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-[#2563EB] dark:text-blue-400">{summary.service_count}</p>
                            </div>
                        </div>

                        {/* Billing records */}
                        <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
                            <div className="border-b border-blue-100 p-5 dark:border-border">
                                <h2 className="font-semibold text-slate-900 dark:text-foreground">Patient Billing Details</h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                                    Each billed service is shown as a separate report entry.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="border-b border-blue-100 bg-[#EAF5FF] text-slate-900 dark:border-border dark:bg-muted dark:text-foreground">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">Date of Service</th>

                                            <th className="px-5 py-3 font-medium">Service</th>

                                            <th className="px-5 py-3 text-right font-medium">Total Charge</th>

                                            <th className="px-5 py-3 text-right font-medium">Amount Paid</th>

                                            <th className="px-5 py-3 text-right font-medium">Outstanding Balance</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-blue-100 dark:divide-border">
                                        {rows.length > 0 ? (
                                            rows.map((row) => (
                                                <tr
                                                    key={row.row_id}
                                                    className="text-slate-800 transition hover:bg-[#EAF5FF] dark:text-foreground dark:hover:bg-accent"
                                                >
                                                    <td className="px-5 py-4">{formatDate(row.dos)}</td>

                                                    <td className="px-5 py-4 font-medium">{row.service}</td>

                                                    <td className="px-5 py-4 text-right">{formatCurrency(row.charge)}</td>

                                                    <td className="px-5 py-4 text-right">{formatCurrency(row.paid)}</td>

                                                    <td className="px-5 py-4 text-right font-semibold">{formatCurrency(row.outstanding)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-5 py-12 text-center text-slate-500 dark:text-muted-foreground">
                                                    No billing records were found for this patient.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                    {rows.length > 0 && (
                                        <tfoot className="border-t border-blue-100 bg-[#EAF5FF] text-slate-900 dark:border-border dark:bg-muted dark:text-foreground">
                                            <tr>
                                                <td colSpan={2} className="px-5 py-4 text-right font-semibold">
                                                    Report Totals
                                                </td>

                                                <td className="px-5 py-4 text-right font-semibold">{formatCurrency(summary.total_charges)}</td>

                                                <td className="px-5 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {formatCurrency(summary.total_payments)}
                                                </td>

                                                <td className="px-5 py-4 text-right font-semibold text-amber-600 dark:text-amber-400">
                                                    {formatCurrency(summary.outstanding_balance)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Initial empty state */
                    <div className="rounded-xl border border-dashed border-blue-200 bg-white px-6 py-16 text-center shadow-sm dark:border-border dark:bg-card">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF5FF] text-2xl dark:bg-muted">👤</div>

                        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-foreground">Select a patient</h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-muted-foreground">
                            Search for a patient above and generate the report to view their consolidated billing history.
                        </p>
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
