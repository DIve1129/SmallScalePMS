import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Doctor = {
  doctor_id: number;
  doctor_code?: string | null;
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
    doctor_code: doctor.doctor_code ?? '',
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
    'w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';

  const labelClass = 'mb-2 block text-sm font-medium text-foreground';

  const buttonPrimary =
    'rounded-md bg-muted px-5 py-3 text-sm text-foreground transition hover:bg-accent disabled:opacity-50';

  const buttonSecondary =
    'rounded-md border border-border bg-background px-5 py-3 text-sm text-foreground transition hover:bg-accent';

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Doctors', href: '/doctors' }]}>
      <Head title="Edit Doctor" />

      <div className="p-6 text-foreground">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Doctor
          </h1>

          <Link
            href={`/doctors/${doctor.doctor_id}`}
            className={buttonSecondary}
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={submit} className="space-y-6 max-w-3xl">
          <Field
            label="Doctor Code"
            value={data.doctor_code}
            onChange={(v) => setData('doctor_code', v)}
            error={errors.doctor_code}
          />

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

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={processing} className={buttonPrimary}>
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
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}