import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type Doctor = {
  doctor_id: number;
  first_name: string;
  last_name: string;
  speciality?: string | null;
  status?: string | null;
};

export default function DoctorsIndex({ doctors }: { doctors: Doctor[] }) {
  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Doctors', href: '/doctors' }]}>
      <Head title="Doctors" />

      <div className="space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
        {/* Page heading */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
              Doctors
            </h1>

            <p className="text-sm text-slate-500 dark:text-muted-foreground">
              Manage doctor records.
            </p>
          </div>

          <Link
            href="/doctors/create"
            className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] dark:bg-primary dark:text-primary-foreground"
          >
            + Add Doctor
          </Link>
        </div>

        {/* Doctors table */}
        <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
          <div className="grid grid-cols-12 bg-[#EAF5FF] px-5 py-4 text-sm font-medium text-slate-900 dark:bg-muted dark:text-foreground">
            <div className="col-span-2">Doctor ID</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Specialty</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-blue-100 dark:divide-border">
            {doctors?.length ? (
              doctors.map((d) => (
                <div
                  key={d.doctor_id}
                  className="grid grid-cols-12 items-center px-5 py-4 text-sm text-slate-800 transition hover:bg-[#EAF5FF] dark:text-foreground dark:hover:bg-accent"
                >
                  <div className="col-span-2">{d.doctor_id}</div>

                  <div className="col-span-3">
                    {d.first_name} {d.last_name}
                  </div>

                  <div className="col-span-3">
                    {d.speciality ?? '-'}
                  </div>

                  <div className="col-span-2">
                    <span className="rounded-full border border-blue-100 bg-[#EAF5FF] px-3 py-1 text-xs text-[#2563EB] dark:border-border dark:bg-muted dark:text-foreground">
                      {d.status ?? 'Active'}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-end gap-2">
                    <a
                      href={`/doctors/${d.doctor_id}`}
                      className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                    >
                      View
                    </a>

                    <Link
                      href={`/doctors/${d.doctor_id}/edit`}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-600 transition hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-slate-500 dark:text-muted-foreground">
                No doctors found.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}