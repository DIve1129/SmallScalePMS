import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Insurance = {
    insurance_code: number;
    insurance_name: string;
    insurance_address: string | null;
    phone: string;
};

type EditInsuranceProps = {
    insurance: Insurance;
};

export default function EditInsurance({
    insurance,
}: EditInsuranceProps) {
    const { data, setData, put, processing, errors } = useForm({
        insurance_name: insurance.insurance_name ?? '',
        insurance_address: insurance.insurance_address ?? '',
        phone: insurance.phone ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/insurance/${insurance.insurance_code}`, {
            preserveScroll: true,
        });
    };

    const inputClass =
        'mt-2 w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:placeholder:text-muted-foreground';

    const labelClass =
        'text-sm font-medium text-slate-700 dark:text-foreground';

    const errorClass = 'mt-1 text-sm text-red-500';

    const buttonPrimary =
        'inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary dark:text-primary-foreground';

    const buttonSecondary =
        'inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent';

    return (
        <AppSidebarLayout
            breadcrumbs={[
                {
                    title: 'Insurance',
                    href: '/insurance',
                },
                {
                    title: 'Edit Insurance',
                    href: `/insurance/${insurance.insurance_code}/edit`,
                },
            ]}
        >
            <Head title="Edit Insurance" />

            <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-900 dark:bg-background dark:text-foreground">
                <div className="mx-auto max-w-3xl">
                    {/* Page header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                                Edit Insurance
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                                Update the selected insurance provider's
                                information.
                            </p>
                        </div>

                        <Link
                            href="/insurance"
                            className={buttonSecondary}
                        >
                            Back to Insurance
                        </Link>
                    </div>

                    {/* Edit form */}
                    <form
                        onSubmit={submit}
                        className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
                    >
                        <div className="mb-6 border-b border-blue-100 pb-4 dark:border-border">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                                Insurance Information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                                Edit the details below and save your changes.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Insurance code */}
                            <div>
                                <label
                                    htmlFor="insurance_code"
                                    className={labelClass}
                                >
                                    Insurance Code
                                </label>

                                <input
                                    id="insurance_code"
                                    type="text"
                                    value={insurance.insurance_code}
                                    disabled
                                    className="mt-2 w-full cursor-not-allowed rounded-lg border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none dark:border-border dark:bg-muted dark:text-muted-foreground"
                                />

                                <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
                                    The insurance code cannot be changed.
                                </p>
                            </div>

                            {/* Insurance name */}
                            <div>
                                <label
                                    htmlFor="insurance_name"
                                    className={labelClass}
                                >
                                    Insurance Name
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="insurance_name"
                                    type="text"
                                    value={data.insurance_name}
                                    onChange={(event) =>
                                        setData(
                                            'insurance_name',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="Enter insurance name"
                                    maxLength={100}
                                    required
                                    autoFocus
                                />

                                {errors.insurance_name && (
                                    <p className={errorClass}>
                                        {errors.insurance_name}
                                    </p>
                                )}
                            </div>

                            {/* Insurance address */}
                            <div>
                                <label
                                    htmlFor="insurance_address"
                                    className={labelClass}
                                >
                                    Insurance Address
                                </label>

                                <textarea
                                    id="insurance_address"
                                    value={data.insurance_address}
                                    onChange={(event) =>
                                        setData(
                                            'insurance_address',
                                            event.target.value,
                                        )
                                    }
                                    className={`${inputClass} min-h-28 resize-y`}
                                    placeholder="Enter insurance address"
                                    maxLength={255}
                                    rows={4}
                                />

                                {errors.insurance_address && (
                                    <p className={errorClass}>
                                        {errors.insurance_address}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className={labelClass}
                                >
                                    Phone
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(event) =>
                                        setData(
                                            'phone',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="Enter phone number"
                                    maxLength={20}
                                    required
                                />

                                {errors.phone && (
                                    <p className={errorClass}>
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form actions */}
                        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-blue-100 pt-5 sm:flex-row sm:justify-end dark:border-border">
                            <Link
                                href="/insurance"
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
                                    : 'Update Insurance'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}