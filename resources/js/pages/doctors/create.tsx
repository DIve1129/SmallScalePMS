import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateDoctor() {
  const { data, setData, post, processing, errors } = useForm({
    doctor_code: '',
    first_name: '',
    last_name: '',
    speciality: '',
    slmc_number: '',
    phone: '',
    email: '',
    status: 'Active',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/doctors');
  }

  const inputClass =
    'w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';

  const labelClass = 'mb-2 block text-sm font-medium text-foreground';

  const buttonPrimary =
    'rounded-md bg-muted px-6 py-2 text-sm text-foreground transition hover:bg-accent disabled:opacity-50';

  const buttonSecondary =
    'rounded-md border border-border bg-background px-6 py-2 text-sm text-foreground transition hover:bg-accent';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Doctors', href: '/doctors' },
        { title: 'Add Doctor', href: '/doctors/create' },
      ]}
    >
      <Head title="Add Doctor" />

      <div className="p-6 max-w-3xl space-y-6 text-foreground">
        <h1 className="text-2xl font-semibold text-foreground">
          Add New Doctor
        </h1>

        <form onSubmit={submit} className="space-y-5">
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
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={processing} className={buttonPrimary}>
              {processing ? 'Saving...' : 'Save Doctor'}
            </button>

            <Link href="/doctors" className={buttonSecondary}>
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