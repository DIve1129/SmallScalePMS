import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Patient = {
  patient_id: number;
  first_name: string | null;
  last_name: string | null;
  dob?: string | null;
};

export default function PatientsIndex({
  patients,
  search,
}: {
  patients: Patient[];
  search?: string;
}) {
  const [term, setTerm] = useState(search ?? '');

  useEffect(() => setTerm(search ?? ''), [search]);

  const inputClass =
    'w-full max-w-2xl rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';

  const buttonClass =
    'rounded-md border border-border bg-background px-5 py-3 text-sm text-foreground transition hover:bg-accent';

  const primaryButton =
    'rounded-md bg-muted px-5 py-3 text-sm text-foreground transition hover:bg-accent';

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Patients', href: '/patients' }]}>
      <Head title="Patients" />

      <div className="p-6 space-y-6 text-foreground">
        {/* Search bar row */}
        <div className="flex items-center gap-3">
          <input
            className={inputClass}
            placeholder="Search patient by first name, last name, or patient ID..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />

          <Link
            href="/patients"
            data={{ search: term }}
            className={buttonClass}
            preserveScroll
          >
            Search
          </Link>

          <Link
            href="/patients/create"
            className={primaryButton}
          >
            Add Patient
          </Link>
        </div>

        {/* Results box */}
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          {/* Header */}
          <div className="grid grid-cols-12 bg-muted px-5 py-4 text-sm font-medium text-foreground">
            <div className="col-span-4">Patient Name</div>
            <div className="col-span-3">DOB</div>
            <div className="col-span-2">System Patient ID</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {patients?.length ? (
              patients.map((p) => {
                const fullName =
                  `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || '-';

                return (
                  <div
                    key={p.patient_id}
                    className="grid grid-cols-12 items-center px-5 py-4 text-sm text-foreground transition hover:bg-accent"
                  >
                    <div className="col-span-4">{fullName}</div>
                    <div className="col-span-3">{p.dob ?? '-'}</div>
                    <div className="col-span-2">{p.patient_id}</div>

                    <div className="col-span-3 flex justify-end gap-2">
                      <Link
                        href={`/patients/${p.patient_id}`}
                        className="rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground transition hover:bg-accent"
                      >
                        View
                      </Link>

                      <Link
                        href={`/patients/${p.patient_id}/appointments`}
                        className="rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground transition hover:bg-accent"
                      >
                        Appointments
                      </Link>

                      <Link
                        href={`/patients/${p.patient_id}/billing`}
                        className="rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground transition hover:bg-accent"
                      >
                        Billing
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-10 text-sm text-muted-foreground">
                No matching patients found.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}