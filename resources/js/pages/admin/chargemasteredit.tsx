import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type ChargeMaster = {
    id: number;
    service_code: string;
    service_name: string;
    amount: number | string;
    status: string;
};

type EditChargeMasterProps = {
    chargeMaster: ChargeMaster;
};

/* Displays the charge master edit form and submits service updates. */
export default function EditChargeMaster({
    chargeMaster,
}: EditChargeMasterProps) {
    const { data, setData, put, processing, errors } = useForm({
        service_code: chargeMaster.service_code ?? '',
        service_name: chargeMaster.service_name ?? '',
        amount: String(chargeMaster.amount ?? ''),
        status: chargeMaster.status ?? 'Active',
    });

    /* Submits the updated charge master information. */
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/admin/charge-master/${chargeMaster.id}`, {
            preserveScroll: true,
        });
    };

    const inputClass =
        'mt-1 block w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-ring dark:focus:ring-ring/30';

    const labelClass =
        'text-sm font-medium text-slate-700 dark:text-foreground';

    const buttonPrimary =
        'rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90';

    const buttonSecondary =
        'rounded-lg border border-blue-100 bg-white px-5 py-3 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] hover:text-[#1D4ED8] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground';

    return (
        <AppLayout>
            <Head title="Edit Charge Master" />

            <div className="min-h-full flex-1 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    {/* Displays the page breadcrumb. */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-muted-foreground">
                        <Link
                            href="/admin"
                            className="transition hover:text-[#2563EB] dark:hover:text-foreground"
                        >
                            Admin
                        </Link>

                        <span>&gt;</span>

                        <span className="text-slate-800 dark:text-foreground">
                            Edit Charge Master
                        </span>
                    </div>

                    {/* Displays the page heading. */}
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                            Edit Charge Master
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                            Update the service details, amount, and status.
                        </p>
                    </div>

                    {/* Displays the charge master update form. */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
                    >
                        <div>
                            <label
                                htmlFor="service_code"
                                className={labelClass}
                            >
                                Service Code
                            </label>

                            <input
                                id="service_code"
                                type="text"
                                value={data.service_code}
                                onChange={(event) =>
                                    setData(
                                        'service_code',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                required
                            />

                            {errors.service_code && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.service_code}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="service_name"
                                className={labelClass}
                            >
                                Service Name
                            </label>

                            <input
                                id="service_name"
                                type="text"
                                value={data.service_name}
                                onChange={(event) =>
                                    setData(
                                        'service_name',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                required
                            />

                            {errors.service_name && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.service_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="amount" className={labelClass}>
                                Amount
                            </label>

                            <input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.amount}
                                onChange={(event) =>
                                    setData('amount', event.target.value)
                                }
                                className={inputClass}
                                required
                            />

                            {errors.amount && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="status" className={labelClass}>
                                Status
                            </label>

                            <select
                                id="status"
                                value={data.status}
                                onChange={(event) =>
                                    setData('status', event.target.value)
                                }
                                className={inputClass}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            {errors.status && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Displays the form actions. */}
                        <div className="flex justify-end gap-3 border-t border-blue-100 pt-6 dark:border-border">
                            <Link
                                href="/admin"
                                className={buttonSecondary}
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className={buttonPrimary}
                            >
                                {processing
                                    ? 'Updating...'
                                    : 'Update Service'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}