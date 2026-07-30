import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

/* Defines an insurance record received from the Laravel controller. */
type Insurance = {
    insurance_code: string;
    insurance_name: string;
};

/* Defines the properties received by the patient creation page. */
type PatientCreateProps = {
    insurances: Insurance[];
};

/* Displays the patient creation form and submits new patient information. */
export default function PatientCreate({
    insurances = [],
}: PatientCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        first_name: '',
        last_name: '',
        dob: '',
        age: '',
        nic: '',
        address: '',
        phone: '',
        email: '',
        insurance_id: '',
        notes: '',
    });

    /* Submits the new patient information to the server. */
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/patients');
    };

    const inputClass = `
        w-full rounded-lg
        border border-blue-100
        bg-white px-3 py-2
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

    const labelClass =
        'mb-2 block text-sm font-medium text-slate-700 dark:text-foreground';

    const buttonPrimary = `
        rounded-lg
        bg-[#2563EB] px-4 py-2
        text-sm font-semibold text-white
        transition
        hover:bg-[#1D4ED8]
        disabled:cursor-not-allowed
        disabled:opacity-60
        dark:bg-primary
        dark:text-primary-foreground
        dark:hover:bg-primary/90
    `;

    const buttonSecondary = `
        rounded-lg
        border border-blue-100
        bg-white px-4 py-2
        text-sm font-medium text-[#2563EB]
        transition
        hover:bg-[#EAF5FF]
        hover:text-[#1D4ED8]
        dark:border-border
        dark:bg-background
        dark:text-foreground
        dark:hover:bg-accent
        dark:hover:text-accent-foreground
    `;

    return (
        <AppSidebarLayout
            breadcrumbs={[
                { title: 'Patients', href: '/patients' },
                { title: 'Add Patient', href: '/patients/create' },
            ]}
        >
            <Head title="Add Patient" />

            <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                <div className="mx-auto w-full max-w-3xl">
                    {/* Displays the page heading and back action. */}
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                                Add Patient
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                                Demographic details
                            </p>
                        </div>

                        <Link href="/patients" className={buttonSecondary}>
                            Back
                        </Link>
                    </div>

                    {/* Displays the new patient registration form. */}
                    <form
                        className="space-y-5 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
                        onSubmit={submit}
                    >
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                            Demographic
                        </h2>

                        <Field
                            label="Chart Number"
                            value={data.patient_id}
                            onChange={(value) =>
                                setData('patient_id', value)
                            }
                            error={errors.patient_id}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field
                                label="First Name"
                                value={data.first_name}
                                onChange={(value) =>
                                    setData('first_name', value)
                                }
                                error={errors.first_name}
                            />

                            <Field
                                label="Last Name"
                                value={data.last_name}
                                onChange={(value) =>
                                    setData('last_name', value)
                                }
                                error={errors.last_name}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field
                                label="DOB"
                                type="date"
                                value={data.dob}
                                onChange={(value) => setData('dob', value)}
                                error={errors.dob}
                            />

                            <Field
                                label="Age"
                                type="number"
                                value={data.age}
                                onChange={(value) => setData('age', value)}
                                error={errors.age}
                            />
                        </div>

                        <Field
                            label="NIC"
                            value={data.nic}
                            onChange={(value) => setData('nic', value)}
                            error={errors.nic}
                        />

                        <Field
                            label="Address"
                            value={data.address}
                            onChange={(value) => setData('address', value)}
                            error={errors.address}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field
                                label="Phone"
                                type="tel"
                                value={data.phone}
                                onChange={(value) => setData('phone', value)}
                                error={errors.phone}
                            />

                            <Field
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                error={errors.email}
                            />
                        </div>

                        {/* Displays insurance options loaded from the database. */}
                        <div className="space-y-5 border-t border-blue-100 pt-4 dark:border-border">
                            <div>
                                <label
                                    htmlFor="insurance_id"
                                    className={labelClass}
                                >
                                    Insurance
                                </label>

                                <select
                                    id="insurance_id"
                                    value={data.insurance_id}
                                    onChange={(event) =>
                                        setData(
                                            'insurance_id',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">
                                        Select an insurance
                                    </option>

                                    {insurances.map((insurance) => (
                                        <option
                                            key={insurance.insurance_code}
                                            value={insurance.insurance_code}
                                        >
                                            {insurance.insurance_name}
                                        </option>
                                    ))}
                                </select>

                                {errors.insurance_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.insurance_id}
                                    </p>
                                )}

                                {insurances.length === 0 && (
                                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                                        No insurance records are currently
                                        available.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-blue-100 pt-4 dark:border-border">
                            <label htmlFor="notes" className={labelClass}>
                                Notes
                            </label>

                            <textarea
                                id="notes"
                                className={`${inputClass} min-h-[90px] resize-y`}
                                placeholder="Notes..."
                                value={data.notes}
                                onChange={(event) =>
                                    setData('notes', event.target.value)
                                }
                            />

                            {errors.notes && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={buttonPrimary}
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </button>

                            <Link
                                href="/patients"
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

/* Displays a reusable patient form field. */
function Field({
    label,
    placeholder,
    type = 'text',
    value,
    onChange,
    error,
}: {
    label: string;
    placeholder?: string;
    type?: 'text' | 'date' | 'number' | 'email' | 'tel';
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-foreground">
                {label}
            </label>

            <input
                type={type}
                className="
                    w-full rounded-lg
                    border border-blue-100
                    bg-white px-3 py-2
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
                "
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />

            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}