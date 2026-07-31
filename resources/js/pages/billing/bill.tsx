import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head } from '@inertiajs/react';

type Bill = {
    appointment_id?: number | string | null;

    patient_name?: string | null;
    age?: number | string | null;
    doctor_name?: string | null;
    date_of_service?: string | null;

    appointment_reason?: string | null;
    service_2?: string | null;
    service_3?: string | null;

    amount_1?: number | string | null;
    amount_2?: number | string | null;
    amount_3?: number | string | null;

    payment_1?: number | string | null;
    payment_2?: number | string | null;
    payment_3?: number | string | null;
};

function money(value: number | string | null | undefined) {
    return Number(value ?? 0).toFixed(2);
}

export default function BillShow({ bill }: { bill: Bill }) {
    const rows = [
        {
            service: bill.appointment_reason,
            charge: Number(bill.amount_1 ?? 0),
            payment: Number(bill.payment_1 ?? 0),
        },
        {
            service: bill.service_2,
            charge: Number(bill.amount_2 ?? 0),
            payment: Number(bill.payment_2 ?? 0),
        },
        {
            service: bill.service_3,
            charge: Number(bill.amount_3 ?? 0),
            payment: Number(bill.payment_3 ?? 0),
        },
    ].filter((row) => row.service || row.charge > 0);

    const totalCharge = rows.reduce((sum, row) => sum + row.charge, 0);
    const totalPayment = rows.reduce((sum, row) => sum + row.payment, 0);
    const balance = Math.max(totalCharge - totalPayment, 0);

    return (
        <AppSidebarLayout
            breadcrumbs={[
                { title: 'Billing', href: '/billing' },
                { title: 'Bill', href: '#' },
            ]}
        >
            <Head title="Patient Bill" />

            <div className="bg-[#F8FAFC] p-6 dark:bg-background">
                {/* Download action */}
                <div className="mx-auto mb-4 flex max-w-4xl justify-end">
                    <a
                        href={`/billing/${bill.appointment_id}/download`}
                        className="rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                    >
                        Download PDF
                    </a>
                </div>

                {/* Patient bill */}
                <div className="mx-auto max-w-4xl rounded-xl border border-blue-100 bg-white p-8 text-slate-800 shadow-sm dark:border-border dark:bg-card dark:text-foreground">
                    {/* Patient information */}
                    <div className="mb-10 space-y-2 text-base">
                        <p>
                            <span className="font-semibold text-slate-900 dark:text-foreground">Patient Name:</span> {bill.patient_name ?? '-'}
                        </p>

                        <p>
                            <span className="font-semibold text-slate-900 dark:text-foreground">Age:</span> {bill.age ?? '-'}
                        </p>

                        <p>
                            <span className="font-semibold text-slate-900 dark:text-foreground">Doctor:</span> {bill.doctor_name ?? '-'}
                        </p>

                        <p>
                            <span className="font-semibold text-slate-900 dark:text-foreground">Date:</span> {bill.date_of_service ?? '-'}
                        </p>
                    </div>

                    {/* Service charges */}
                    <div className="overflow-hidden rounded-xl border border-blue-100 dark:border-border">
                        <div className="grid grid-cols-12 border-b border-blue-100 bg-[#EAF5FF] px-5 py-3 font-semibold text-slate-900 dark:border-border dark:bg-muted dark:text-foreground">
                            <div className="col-span-8">Service</div>
                            <div className="col-span-4 text-right">Charge</div>
                        </div>

                        <div className="divide-y divide-blue-100 dark:divide-border">
                            {rows.length ? (
                                rows.map((row, index) => (
                                    <div key={index} className="grid grid-cols-12 px-5 py-3 transition hover:bg-[#EAF5FF] dark:hover:bg-accent">
                                        <div className="col-span-8">{row.service}</div>

                                        <div className="col-span-4 text-right">Rs {money(row.charge)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-5 py-8 text-sm text-slate-500 dark:text-muted-foreground">No services found.</div>
                            )}
                        </div>
                    </div>

                    {/* Bill summary */}
                    <div className="mt-8 ml-auto max-w-sm space-y-3 text-base">
                        <div className="flex justify-between">
                            <span className="font-semibold text-slate-900 dark:text-foreground">Total Charge:</span>

                            <span>Rs {money(totalCharge)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-semibold text-slate-900 dark:text-foreground">Payment:</span>

                            <span>Rs {money(totalPayment)}</span>
                        </div>

                        <div className="flex justify-between border-t border-blue-100 pt-3 text-lg font-semibold text-slate-900 dark:border-border dark:text-foreground">
                            <span>Balance:</span>
                            <span>Rs {money(balance)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
