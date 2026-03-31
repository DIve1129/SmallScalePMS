import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Appointment = {
  appointment_id: number;
  patient_id: number;
  patient_name: string;
  age?: number | null;
  appointment_type: string;
  appointment_datetime: string;
  status: string;
};

export default function AppointmentsIndex({
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

  useEffect(() => setFromDate(from ?? today), [from]);
  useEffect(() => setToDate(to ?? today), [to]);

  const rows = appointments ?? [];

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Appointments', href: '/appointments' }]}>
      <Head title="Appointments" />

      <div className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Appointments</h1>
            <p className="text-sm text-white/60">
              View appointments by date range and create new appointments.
            </p>
          </div>

          <Link
            href="/appointments/create"
            className="rounded-md bg-white/10 px-5 py-3 text-sm hover:bg-white/20"
          >
            + New Appointment
          </Link>
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
                '/appointments',
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
          <div className="grid grid-cols-13 bg-white/5 px-5 py-4 text-sm font-medium">
            <div className="col-span-2">System Patient ID</div>
            <div className="col-span-3">Patient Name</div>
            <div className="col-span-2">Doctor</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Appointment Type</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <div className="divide-y divide-white/10">
            {rows.length ? (
              rows.map((a) => (
                <div
                  key={a.appointment_id}
                  className="grid grid-cols-13 items-center px-5 py-4 text-sm hover:bg-white/5"
                >
                  <div className="col-span-2">{a.patient_id}</div>
                  <div className="col-span-3">{a.patient_name}</div>
                  <div className="col-span-2">-</div>

                  <div className="col-span-2">
                    <span
                      className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${
                        a.status === 'Completed'
                          ? 'border-green-500/20 bg-green-500/15 text-green-400'
                          : a.status === 'Cancelled'
                            ? 'border-red-500/20 bg-red-500/15 text-red-400'
                            : a.status === 'No-show'
                              ? 'border-yellow-500/20 bg-yellow-500/15 text-yellow-400'
                              : a.status === 'Rescheduled'
                                ? 'border-purple-500/20 bg-purple-500/15 text-purple-400'
                                : 'border-blue-500/20 bg-blue-500/15 text-blue-400'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  <div className="col-span-2">{a.appointment_type}</div>
                  <div className="col-span-1">{a.appointment_datetime}</div>

                  <div className="col-span-1 flex justify-end">
                    <Link
                      href={`/appointments/${a.appointment_id}/edit`}
                      className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-white/60">
                No appointments found for the selected date range.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}