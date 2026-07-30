import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Doctor = {
  doctor_id: number;
  //doctor_code?: string | null;
  first_name: string;
  last_name: string;
  speciality?: string | null;
  slmc_number?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: string | null;
};

export default function Edit({ doctor }: { doctor: Doctor }) {
  const { data, setData, put, processing, errors } = useForm({
    //doctor_code: doctor.doctor_code ?? '',
    first_name: doctor.first_name ?? '',
    last_name: doctor.last_name ?? '',
    speciality: doctor.speciality ?? '',
    slmc_number: doctor.slmc_number ?? '',
    phone: doctor.phone ?? '',
    email: doctor.email ?? '',
    status: doctor.status ?? 'Active',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    put(`/doctors/${doctor.doctor_id}`);
  };

  const inputClass =
    'w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring';

  const labelClass =
    'mb-2 block text-sm font-medium text-slate-700 dark:text-foreground';

  const buttonPrimary =
    'rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground';

  const buttonSecondary =
    'rounded-lg border border-blue-100 bg-white px-5 py-3 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent';

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Doctors', href: '/doctors' }]}>
      <Head title="Edit Doctor" />

      <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
        {/*/Justify the Form */}
        <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
            Edit Doctor
          </h1>

          <Link
            href={`/doctors/${doctor.doctor_id}`}
            className={buttonSecondary}
          >
            Cancel
          </Link>
        </div>

        {/* Doctor form */}
        <form
          onSubmit={submit}
          className="max-w-3xl space-y-6 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
        >
          
          <Field
            label="First Name"
            value={data.first_name}
            onChange={(v) => setData('first_name', v)}
            error={errors.first_name}
          />

          <Field
            label="Last Name"
            value={data.last_name}
            onChange={(v) => setData('last_name', v)}
            error={errors.last_name}
          />

          <Field
            label="Speciality"
            value={data.speciality}
            onChange={(v) => setData('speciality', v)}
            error={errors.speciality}
          />

          <Field
            label="SLMC Number"
            value={data.slmc_number}
            onChange={(v) => setData('slmc_number', v)}
            error={errors.slmc_number}
          />

          <Field
            label="Phone"
            value={data.phone}
            onChange={(v) => setData('phone', v)}
            error={errors.phone}
          />

          <Field
            label="Email"
            value={data.email}
            onChange={(v) => setData('email', v)}
            error={errors.email}
          />

          <div>
            <label className={labelClass}>Status</label>

            <select
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              className={inputClass}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          {/* Form actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={processing}
              className={buttonPrimary}
            >
              {processing ? 'Updating...' : 'Update Doctor'}
            </button>

            <Link
              href={`/doctors/${doctor.doctor_id}`}
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

function Field({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-foreground">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring"
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}