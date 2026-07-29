import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type Insurance = {
  insurance_code: number;
  insurance_name: string;
  insurance_address: string;
  phone: string;
};

export default function InsuranceIndex({
  insurances = [],
}: {
  insurances?: Insurance[];
}) {
  return (
    <AppSidebarLayout
      breadcrumbs={[{ title: 'Insurances', href: '/insurance' }]}
    >
      <Head title="Insurances" />

      <div className="space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
              Insurances
            </h1>

            <p className="text-sm text-slate-500 dark:text-muted-foreground">
              Manage insurance providers.
            </p>
          </div>

          <Link
            href="/insurance/create"
            className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] dark:bg-primary dark:text-primary-foreground"
          >
            + Add Insurance
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
          <div className="grid grid-cols-12 bg-[#EAF5FF] px-5 py-4 text-sm font-medium text-slate-900 dark:bg-muted dark:text-foreground">
            <div className="col-span-2">Code</div>
            <div className="col-span-2">Insurance Name</div>
            <div className="col-span-4">Address</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-2">Action</div>
          </div>

          <div className="divide-y divide-blue-100 dark:divide-border">
            {insurances.length ? (
              insurances.map((i) => (
                <div
                  key={i.insurance_code}
                  className="grid grid-cols-12 items-center px-5 py-4 text-sm text-slate-800 transition hover:bg-[#EAF5FF] dark:text-foreground dark:hover:bg-accent"
                >
                  <div className="col-span-2">
                    {i.insurance_code}
                  </div>

                  <div className="col-span-2">
                    {i.insurance_name}
                  </div>

                  <div className="col-span-4">
                    {i.insurance_address ?? '-'}
                  </div>

                  <div className="col-span-2">
                    {i.phone}
                  </div>
                  <div className="col-span-2">
                    <Link
                      href={route('insurance.edit', i.insurance_code)}
                      className="inline-flex items-center rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EAF5FF] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                  >
                      Edit
                  </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-slate-500 dark:text-muted-foreground">
                No insurance providers found.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}