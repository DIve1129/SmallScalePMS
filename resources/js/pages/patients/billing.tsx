import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type BillingRow = {
    appointment_id: number;
    patient_id: number | string;
    dos: string | null;
    service: string | null;
    amount: number | string;
    balance: number | string;
};

/* Formats billing values as Sri Lankan rupees. */
function money(value: number | string) {
    return `Rs ${Number(value ?? 0).toFixed(2)}`;
}

/* Displays billing records for the selected patient. */
export default function PatientBilling({ patientId, billings = [] }: { patientId: number | string; billings: BillingRow[] }) {
    return (
        <AppSidebarLayout
            breadcrumbs={[
                { title: 'Patients', href: '/patients' },
                {
                    title: `Patient #${patientId}`,
                    href: `/patients/${patientId}`,
                },
                {
                    title: 'Billing',
                    href: `/patients/${patientId}/billing`,
                },
            ]}
        >
            <Head title={`Patient ${patientId} Billing`} />

            <div className="min-h-full space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                {/* Displays the page heading and back navigation. */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">Patient Billing</h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">Showing billing records for Patient ID: {patientId}</p>
                    </div>

                    <Link
                        href="/patients"
                        className="rounded-lg border border-blue-100 bg-white px-5 py-3 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                    >
                        Back to Patients
                    </Link>
                </div>

                {/* Displays the patient's billing records. */}
                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
                    {/* Displays the billing table headings. */}
                    <div className="grid grid-cols-12 border-b border-blue-100 bg-blue-50/70 px-5 py-4 text-sm font-semibold text-slate-700 dark:border-border dark:bg-muted dark:text-foreground">
                        <div className="col-span-2">DOS</div>
                        <div className="col-span-4">Service</div>
                        <div className="col-span-2">Amount</div>
                        <div className="col-span-2">Balance Left</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Displays individual billing records or the empty state. */}
                    <div className="divide-y divide-blue-50 dark:divide-border">
                        {billings.length ? (
                            billings.map((billing) => (
                                <div
                                    key={billing.appointment_id}
                                    className="grid grid-cols-12 items-center px-5 py-4 text-sm text-slate-800 transition hover:bg-blue-50/40 dark:text-foreground dark:hover:bg-accent/50"
                                >
                                    <div className="col-span-2">{billing.dos ?? '-'}</div>

                                    <div className="col-span-4">{billing.service ?? '-'}</div>

                                    <div className="col-span-2">{money(billing.amount)}</div>

                                    <div className="col-span-2">{money(billing.balance)}</div>

                                    <div className="col-span-2 flex justify-end gap-2 whitespace-nowrap">
                                        <Link
                                            href={`/billing/${billing.appointment_id}/viewclinicaldata`}
                                            className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                                        >
                                            Clinical Data
                                        </Link>

                                        <Link
                                            href={`/billing/${billing.appointment_id}/bill`}
                                            className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                                        >
                                            Bill
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-10 text-sm text-slate-500 dark:text-muted-foreground">
                                No billing records found for this patient.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
