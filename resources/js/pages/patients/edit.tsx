import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

type Patient = {
    patient_id: string;
    first_name: string;
    last_name: string;
    dob?: string | null;
    age?: string | number | null;
    nic?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    insurance_name?: string | null;
    insurance_id?: string | null;
    notes?: string | null;
};

/* Displays the patient edit form and submits updated patient information. */
export default function PatientEdit({ patient }: { patient: Patient }) {
    const { data, setData, put, processing, errors } = useForm({
        patient_id: String(patient.patient_id ?? ''),
        first_name: patient.first_name ?? '',
        last_name: patient.last_name ?? '',
        dob: patient.dob ?? '',
        age: String(patient.age ?? ''),
        nic: patient.nic ?? '',
        address: patient.address ?? '',
        phone: patient.phone ?? '',
        email: patient.email ?? '',
        insurance_name: patient.insurance_name ?? '',
        insurance_id: patient.insurance_id ?? '',
        notes: patient.notes ?? '',
    });

    /* Submits the updated patient information to the server. */
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/patients/${patient.patient_id}`);
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
                {
                    title: 'Edit Patient',
                    href: `/patients/${patient.patient_id}/edit`,
                },
            ]}
        >
            <Head title="Edit Patient" />

            <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
                <div className="mx-auto w-full max-w-3xl">
                    {/* Displays the page heading and back action. */}
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                                Edit Patient
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                                Demographic details
                            </p>
                        </div>

                        <Link href="/patients" className={buttonSecondary}>
                            Back
                        </Link>
                    </div>

                    {/* Displays the editable patient information form. */}
                    <form
                        className="space-y-5 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
                        onSubmit={submit}
                    >
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                            Demographic
                        </h2>

                        <Field
                            label="Chart Number (optional)"
                            placeholder="Leave blank to auto-generate"
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
                                placeholder="YYYY-MM-DD"
                                value={data.dob}
                                onChange={(value) => setData('dob', value)}
                                error={errors.dob}
                            />

                            <Field
                                label="Age"
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

                        <Field
                            label="Phone"
                            value={data.phone}
                            onChange={(value) => setData('phone', value)}
                            error={errors.phone}
                        />

                        <Field
                            label="Email"
                            value={data.email}
                            onChange={(value) => setData('email', value)}
                            error={errors.email}
                        />

                        <div className="space-y-5 border-t border-blue-100 pt-4 dark:border-border">
                            <Field
                                label="Insurance Name"
                                value={data.insurance_name}
                                onChange={(value) =>
                                    setData('insurance_name', value)
                                }
                                error={errors.insurance_name}
                            />

                            <Field
                                label="Insurance ID"
                                value={data.insurance_id}
                                onChange={(value) =>
                                    setData('insurance_id', value)
                                }
                                error={errors.insurance_id}
                            />
                        </div>

                        <div className="border-t border-blue-100 pt-4 dark:border-border">
                            <label className={labelClass}>Notes</label>

                            <textarea
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

/* Displays a reusable editable patient form field. */
function Field({
    label,
    placeholder,
    value,
    onChange,
    error,
}: {
    label: string;
    placeholder?: string;
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