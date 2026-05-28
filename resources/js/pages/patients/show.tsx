import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type Patient = {
  patient_id: number | string;
  first_name?: string | null;
  last_name?: string | null;
  dob?: string | null;
  age?: number | string | null;
  nic?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  insurance_name?: string | null;
  insurance_id?: string | null;
  notes?: string | null;
};

export default function PatientShow({ patient }: { patient: Patient }) {
  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Patients', href: '/patients' },
        { title: `Patient #${patient.patient_id}`, href: `/patients/${patient.patient_id}` },
      ]}
    >
      <Head title="Patient Details" />
                <div className="p-6 text-foreground">
                <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                    Patient Details
                    </h1>
                    <p className="text-sm text-muted-foreground">
                    Demographic and insurance information
                    </p>
                </div>

                <div className="flex gap-3">
                    <Link
                    href="/patients"
                    className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-accent"
                    >
                    Back
                    </Link>

                    <Link
                    href={`/patients/${patient.patient_id}/edit`}
                    className="rounded-md bg-muted px-4 py-2 text-sm text-foreground transition hover:bg-accent"
                    >
                    Edit
                    </Link>
                </div>
                </div>
        <div className="max-w-3xl space-y-6 rounded-lg border border-border bg-background p-6">
          <h2 className="text-lg font-medium text-foreground">Demographic</h2>

          <Field label="Chart Number" value={patient.patient_id} />

          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" value={patient.first_name} />
            <Field label="Last Name" value={patient.last_name} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="DOB" value={patient.dob} />
            <Field label="Age" value={patient.age} />
          </div>

          <Field label="NIC" value={patient.nic} />
          <Field label="Address" value={patient.address} />
          <Field label="Phone" value={patient.phone} />
          <Field label="Email" value={patient.email} />

          <div className="border-t border-border pt-4 space-y-6">
            <Field label="Insurance Name" value={patient.insurance_name} />
            <Field label="Insurance ID" value={patient.insurance_id} />
          </div>

          <div className="border-t border-border pt-4">
            <Field label="Notes" value={patient.notes} large />
          </div>
        </div>
    </div>
    </AppSidebarLayout>
  );
}

function Field({
  label,
  value,
  large = false,
}: {
  label: string;
  value?: string | number | null;
  large?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <div
        className={`w-full rounded-md border border-border bg-muted px-4 py-3 text-sm text-foreground ${
          large ? 'min-h-[90px]' : ''
        }`}
      >
        {value || '-'}
      </div>
    </div>
  );
}