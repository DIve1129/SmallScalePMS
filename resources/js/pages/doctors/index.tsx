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

      <div className="p-6 space-y-6 text-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Doctors</h1>
            <p className="text-sm text-muted-foreground">
              Manage doctor records (basic)
            </p>
          </div>

          <Link
            href="/doctors/create"
            className="rounded-md bg-muted px-5 py-3 text-sm text-foreground transition hover:bg-accent"
          >
            + Add Doctor
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <div className="grid grid-cols-12 bg-muted px-5 py-4 text-sm font-medium text-foreground">
            <div className="col-span-2">Doctor ID</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Specialty</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-border">
            {doctors?.length ? (
              doctors.map((d) => (
                <div
                  key={d.doctor_id}
                  className="grid grid-cols-12 items-center px-5 py-4 text-sm text-foreground transition hover:bg-accent"
                >
                  <div className="col-span-2">{d.doctor_id}</div>

                  <div className="col-span-3">
                    {d.first_name} {d.last_name}
                  </div>

                  <div className="col-span-3">{d.speciality ?? '-'}</div>

                  <div className="col-span-2">
                    <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground">
                      {d.status ?? 'Active'}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-end gap-2">
                    <a
                      href={`/doctors/${d.doctor_id}`}
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground transition hover:bg-accent"
                    >
                      View
                    </a>

                    <Link
                      href={`/doctors/${d.doctor_id}/edit`}
                      className="rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 transition hover:bg-blue-500/20"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-muted-foreground">
                No doctors found.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}