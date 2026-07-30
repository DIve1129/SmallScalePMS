import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

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
    'w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground dark:focus:ring-ring';

  const labelClass =
    'mb-2 block text-sm font-medium text-slate-700 dark:text-foreground';

  const buttonPrimary =
    'rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground';

  const buttonSecondary =
    'rounded-lg border border-blue-100 bg-white px-6 py-3 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Doctors', href: '/doctors' },
        { title: 'Add Doctor', href: '/doctors/create' },
      ]}
    >
      <Head title="Add Doctor" />

      <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-foreground">
            Add New Doctor
          </h1>

          <form
            onSubmit={submit}
            className="space-y-5 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card"
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
              <button
                type="submit"
                disabled={processing}
                className={buttonPrimary}
              >
                {processing ? 'Saving...' : 'Save Doctor'}
              </button>

              <Link href="/doctors" className={buttonSecondary}>
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