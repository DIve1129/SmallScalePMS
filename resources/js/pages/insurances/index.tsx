import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type Insurance = {
  insurance_code: number;
  insurance_name: string;
  insurance_address: string;
  phone: string;
};

export default function InsuranceIndex({
  insurances = []
}: {
  insurances?: Insurance[];
}) {

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Insurances', href: '/insurance' }]}>
      <Head title="Insurances" />

      <div className="p-6 space-y-6">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Insurances</h1>
            <p className="text-sm text-white/60">
              Manage insurance providers.
            </p>
          </div>

          <Link
            href="/insurance/create"
            className="rounded-md bg-white/10 px-5 py-3 text-sm hover:bg-white/20"
          >
            + Add Insurance
          </Link>
        </div>

        <div className="rounded-lg border border-white/10 overflow-hidden">

          <div className="grid grid-cols-12 bg-white/5 px-5 py-4 text-sm font-medium">
            <div className="col-span-2">Code</div>
            <div className="col-span-4">Insurance Name</div>
            <div className="col-span-4">Address</div>
            <div className="col-span-2">Phone</div>
          </div>

          <div className="divide-y divide-white/10">

            {insurances.length ? (
              insurances.map((i) => (

                <div
                  key={i.insurance_code}
                  className="grid grid-cols-12 items-center px-5 py-4 text-sm hover:bg-white/5"
                >
                  <div className="col-span-2">{i.insurance_code}</div>
                  <div className="col-span-4">{i.insurance_name}</div>
                  <div className="col-span-4">{i.insurance_address ?? '-'}</div>
                  <div className="col-span-2">{i.phone}</div>
                </div>

              ))
            ) : (
              <div className="px-5 py-10 text-sm text-white/60">
                No insurance providers found.
              </div>
            )}

          </div>
        </div>

      </div>

    </AppSidebarLayout>
  );
}