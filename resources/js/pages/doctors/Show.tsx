import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

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

export default function Show({ doctor }: { doctor: Doctor }) {
  const buttonSecondary =
    'rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent';

  const buttonPrimary =
    'rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1D4ED8] dark:bg-primary dark:text-primary-foreground';

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Doctors', href: '/doctors' }]}>
      <Head title="Doctor Details" />

      <div className="min-h-full bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
        <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
            Doctor Details
          </h1>

          <div className="flex gap-2">
            <Link href="/doctors" className={buttonSecondary}>
              Back
            </Link>

            <Link
              href={`/doctors/${doctor.doctor_id}/edit`}
              className={buttonPrimary}
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Doctor information */}
        <div className="max-w-3xl space-y-6 rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
          <Field label="First Name" value={doctor.first_name} />
          <Field label="Last Name" value={doctor.last_name} />
          <Field label="Speciality" value={doctor.speciality} />
          <Field label="SLMC Number" value={doctor.slmc_number} />
          <Field label="Phone" value={doctor.phone} />
          <Field label="Email" value={doctor.email} />
          <Field label="Status" value={doctor.status ?? 'Active'} />
        </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-foreground">
        {label}
      </label>

      <div className="w-full rounded-lg border border-blue-100 bg-[#F8FAFC] px-4 py-3 text-slate-800 dark:border-border dark:bg-background dark:text-foreground">
        {value || '-'}
      </div>
    </div>
  );
}