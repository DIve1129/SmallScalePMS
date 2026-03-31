import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Patient = {
  patient_id: number;
  first_name: string | null;
  last_name: string | null;
  dob?: string | null; // keep optional until you actually add it to DB
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

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Patients', href: '/patients' }]}>
      <Head title="Patients" />

      <div className="p-6 space-y-6">
        {/* Search bar row */}
        <div className="flex items-center gap-3">
          <input
            className="w-full max-w-2xl rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            placeholder="Search patient by first name, last name, or patient ID..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />

          {/* If you truly don't want search yet, you can remove data={{ search: term }} */}
          <Link
            href="/patients"
            data={{ search: term }}
            className="rounded-md border border-white/10 px-5 py-3 text-sm hover:bg-white/5"
            preserveScroll
          >
            Search
          </Link>

          <Link
            href="/patients/create"
            className="rounded-md bg-white/10 px-5 py-3 text-sm hover:bg-white/20"
          >
            Add Patient
          </Link>
        </div>

        {/* Results box */}
        <div className="rounded-lg border border-white/10 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 bg-white/5 px-5 py-4 text-sm font-medium">
            <div className="col-span-4">Patient Name</div>
            <div className="col-span-3">DOB</div>
            <div className="col-span-2">System Patient ID</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/10">
            {patients?.length ? (
              patients.map((p) => {
                const fullName =
                  `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || '-';

                return (
                  <div
                    key={p.patient_id}
                    className="grid grid-cols-12 items-center px-5 py-4 text-sm hover:bg-white/5"
                  >
                    <div className="col-span-4">{fullName}</div>

                    <div className="col-span-3">{p.dob ?? '-'}</div>

                    <div className="col-span-2">{p.patient_id}</div>

                    {/* ✅ Actions */}
                    <div className="col-span-3 flex justify-end gap-2">
                      <Link
                        href={`/patients/${p.patient_id}`}
                        className="rounded-md border border-white/10 px-3 py-1 text-xs hover:bg-white/5"
                      >
                        View
                      </Link>

                      <Link
                        href={`/patients/${p.patient_id}/appointments`}
                        className="rounded-md border border-white/10 px-3 py-1 text-xs hover:bg-white/5"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `/patients/${p.patient_id}/appointments`;}}
                      >
                        Appointments
                      </Link>

                      <Link
                        href={`/patients/${p.patient_id}/billing`}
                        className="rounded-md border border-white/10 px-3 py-1 text-xs hover:bg-white/5"
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

