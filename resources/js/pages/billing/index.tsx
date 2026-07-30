import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Appointment = {
  appointment_id: number;
  patient_id?: number | string | null;
  patient_name?: string | null;
  doctor_name?: string | null;
  appointment_date?: string | null;
  appointment_reason?: string | null;
  total_amount?: number | string | null;
  balance?: number | string | null;
  responsibility?: string | null;
  claim_status?: string | null;
};

function formatCurrency(amount: number | string | null | undefined) {
  const value = Number(amount ?? 0);

  return `Rs ${value.toFixed(2)}`;
}

function getLocalDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getClaimStatusClasses(status: string | null | undefined) {
  switch (status) {
    case 'Billed':
      return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400';

    case 'Closed':
      return 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400';

    case 'Pending':
    default:
      return 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400';
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
  const today = getLocalDate();

  const [fromDate, setFromDate] = useState(from ?? today);
  const [toDate, setToDate] = useState(to ?? today);

  useEffect(() => {
    setFromDate(from ?? getLocalDate());
  }, [from]);

  useEffect(() => {
    setToDate(to ?? getLocalDate());
  }, [to]);

  return (
    <AppSidebarLayout
      breadcrumbs={[
        {
          title: 'Billing',
          href: '/billing',
        },
      ]}
    >
      <Head title="Billing" />

      <div className="space-y-6 bg-[#F8FAFC] p-6 text-slate-800 dark:bg-background dark:text-foreground">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-foreground">
            Billing Module
          </h1>

          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            Billing queue for completed and no-show appointments
          </p>
        </div>

        {/* Date filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="billing-from-date"
              className="text-sm text-slate-500 dark:text-muted-foreground"
            >
              From
            </label>

            <input
              id="billing-from-date"
              type="date"
              value={fromDate}
              onChange={(event) => {
                setFromDate(event.target.value);
              }}
              className="w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="billing-to-date"
              className="text-sm text-slate-500 dark:text-muted-foreground"
            >
              To
            </label>

            <input
              id="billing-to-date"
              type="date"
              value={toDate}
              onChange={(event) => {
                setToDate(event.target.value);
              }}
              className="w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:border-border dark:bg-background dark:text-foreground"
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
                },
              );
            }}
            className="h-[46px] rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] dark:bg-primary dark:text-primary-foreground"
          >
            Filter
          </button>
        </div>

        {/* Billing table */}
        <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-border dark:bg-card">
          <div className="grid grid-cols-12 bg-[#EAF5FF] px-5 py-4 text-sm font-medium text-slate-900 dark:bg-muted dark:text-foreground">
            <div className="col-span-1">Appointment ID</div>
            <div className="col-span-1">Patient ID</div>
            <div className="col-span-2">Patient Name</div>
            <div className="col-span-1">Doctor</div>
            <div className="col-span-2">Date of Service</div>
            <div className="col-span-1">Service</div>
            <div className="col-span-1">Bill Amount</div>
            <div className="col-span-1">Balance</div>
            <div className="col-span-1">Responsibility</div>
            <div className="col-span-1">Claim Status</div>
          </div>

          <div className="divide-y divide-blue-100 dark:divide-border">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="grid grid-cols-12 px-5 py-4 text-sm transition hover:bg-[#EAF5FF] dark:hover:bg-accent"
                >
                  <div className="col-span-1">
                    {appointment.appointment_id}
                  </div>

                  <div className="col-span-1">
                    {appointment.patient_id ?? '-'}
                  </div>

                  <div className="col-span-2">
                    {appointment.patient_name ?? '-'}
                  </div>

                  <div className="col-span-1">
                    {appointment.doctor_name ?? '-'}
                  </div>

                  <div className="col-span-2">
                    {appointment.appointment_date ?? '-'}
                  </div>

                  <div className="col-span-1">
                    {appointment.appointment_reason ?? '-'}
                  </div>

                  <div className="col-span-1">
                    {formatCurrency(appointment.total_amount)}
                  </div>

                  <div className="col-span-1 font-medium">
                    {formatCurrency(appointment.balance)}
                  </div>

                  <div className="col-span-1">
                    {appointment.responsibility ?? 'Patient'}
                  </div>

                  <div className="col-span-1">
                    <span
                      className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${getClaimStatusClasses(
                        appointment.claim_status,
                      )}`}
                    >
                      {appointment.claim_status ?? 'Pending'}
                    </span>
                  </div>

                  {/* Row actions */}
                  <div className="col-span-12 mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/billing/${appointment.appointment_id}/payment`}
                      className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                    >
                      Payment
                    </Link>

                    <Link
                      href={`/billing/${appointment.appointment_id}/bill`}
                      className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                    >
                      Bill
                    </Link>

                    <Link
                      href={`/billing/${appointment.appointment_id}/claim/clinicaldata`}
                      className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                    >
                      Add Clinical Data
                    </Link>

                    <Link
                      href={`/billing/${appointment.appointment_id}/edit`}
                      className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[#EAF5FF] hover:text-[#2563EB] dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-accent"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-slate-500 dark:text-muted-foreground">
                No billable appointments found.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}