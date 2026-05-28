import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

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

export default function Show({ doctor }: { doctor: Doctor }) {
  const boxClass =
    'w-full rounded-md border border-border bg-background px-4 py-3 text-foreground';

  const labelClass = 'mb-2 block text-sm font-medium text-foreground';

  const buttonSecondary =
    'rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-accent';

  const buttonPrimary =
    'rounded-md bg-muted px-4 py-2 text-sm text-foreground transition hover:bg-accent';

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Doctors', href: '/doctors' }]}>
      <Head title="Doctor Details" />

      <div className="p-6 text-foreground">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
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

        <div className="space-y-6 max-w-3xl">
          <Field label="Doctor Code" value={doctor.doctor_code} />
          <Field label="First Name" value={doctor.first_name} />
          <Field label="Last Name" value={doctor.last_name} />
          <Field label="Speciality" value={doctor.speciality} />
          <Field label="SLMC Number" value={doctor.slmc_number} />
          <Field label="Phone" value={doctor.phone} />
          <Field label="Email" value={doctor.email} />
          <Field label="Status" value={doctor.status ?? 'Active'} />
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
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground">
        {value || '-'}
      </div>
    </div>
  );
}