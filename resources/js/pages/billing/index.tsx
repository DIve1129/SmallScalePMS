import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Appointment = {
  appointment_id: number;
  patient_id?: number | string | null;
  patient_name?: string | null;
  doctor_id?: number | string | null;
  appointment_date?: string | null;
  appointment_reason?: string | null;
  bill_amount?: number | string | null;
  balance?: number | string | null;
  responsibility?: string | null;
  claim_status?: string | null;
};

function formatCurrency(amount: number | string | null | undefined) {
  const value = Number(amount ?? 0);
  return `Rs ${value.toFixed(2)}`;
}

function formatBalance(amount: number | string | null | undefined) {
  const value = Number(amount ?? 0);
  return value.toFixed(2);
}

function getClaimStatusClasses(status: string | null | undefined) {
  switch (status) {
    case 'Billed':
      return 'border-blue-500/20 bg-blue-500/15 text-blue-400';
    case 'Closed':
      return 'border-green-500/20 bg-green-500/15 text-green-400';
    case 'Pending':
    default:
      return 'border-yellow-500/20 bg-yellow-500/15 text-yellow-400';
  }
}

export default function BillingIndex({
  appointments = [],
  from,
  to,
}: {
  appointments?: Appointment[];
  from?: string;
  to?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState(from ?? today);
  const [toDate, setToDate] = useState(to ?? today);

  useEffect(() => {
    setFromDate(from ?? today);
  }, [from, today]);

  useEffect(() => {
    setToDate(to ?? today);
  }, [to, today]);

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Billing', href: '/billing' }]}>
      <Head title="Billing" />

      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Billing Module</h1>
          <p className="text-sm text-white/60">
            Billing queue for completed and no-show appointments
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/70">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/70">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              router.get(
                '/billing',
                {
                  from: fromDate,
                  to: toDate,
                },
                {
                  preserveState: true,
                  preserveScroll: true,
                }
              );
            }}
            className="h-[46px] rounded-md border border-white/10 px-5 py-3 text-sm hover:bg-white/5"
          >
            Filter
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="grid grid-cols-12 bg-white/5 px-5 py-4 text-sm font-medium">
            <div className="col-span-1">Appointment ID</div>
            <div className="col-span-1">Patient ID</div>
            <div className="col-span-2">Patient Name</div>
            <div className="col-span-1">Doctor ID</div>
            <div className="col-span-2">Date of Service</div>
            <div className="col-span-1">Service</div>
            <div className="col-span-1">Bill Amount</div>
            <div className="col-span-1">Balance</div>
            <div className="col-span-1">Responsibility</div>
            <div className="col-span-1">Claim Status</div>
          </div>

          <div className="divide-y divide-white/10">
            {appointments.length ? (
              appointments.map((a) => (
                <div
                  key={a.appointment_id}
                  className="grid grid-cols-12 px-5 py-4 text-sm hover:bg-white/5"
                >
                  <div className="col-span-1">{a.appointment_id}</div>
                  <div className="col-span-1">{a.patient_id ?? '-'}</div>
                  <div className="col-span-2">{a.patient_name ?? '-'}</div>
                  <div className="col-span-1">{a.doctor_id ?? '-'}</div>
                  <div className="col-span-2">{a.appointment_date ?? '-'}</div>
                  <div className="col-span-1">{a.appointment_reason ?? '-'}</div>
                  <div className="col-span-1">{formatCurrency(a.bill_amount)}</div>
                  <div className="col-span-1">{formatBalance(a.balance)}</div>
                  <div className="col-span-1">{a.responsibility ?? 'Patient'}</div>
                  <div className="col-span-1">
                    <span
                      className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${getClaimStatusClasses(
                        a.claim_status
                      )}`}
                    >
                      {a.claim_status ?? 'Pending'}
                    </span>
                  </div>

                  <div className="col-span-12 mt-4 flex gap-2">
                    <Link
                      href={`/billing/${a.appointment_id}/payment`}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                    >
                      Payment
                    </Link>

                    <Link
                      href={`/billing/${a.appointment_id}/bill`}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                    >
                      Bill
                    </Link>

                    <Link
                      href={`/billing/${a.appointment_id}/claim/edit`}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                    >
                      Add Clinical Data
                    </Link>
                    <Link
                      href={`/billing/${a.appointment_id}/edit`}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-white/60">
                No billable appointments found.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}