import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

type AppointmentRow = {
  appointment_id: number;
  patient_id: number | string;
  appointment_type: string;
  appointment_datetime: string;
  status?: string | null;
};

export default function PatientAppointments({
  patientId,
  appointments = [],
}: {
  patientId: number | string;
  appointments: AppointmentRow[];
}) {
  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Patients', href: '/patients' },
        { title: `Patient #${patientId}`, href: `/patients/${patientId}` }, // optional page later
        { title: 'Appointments', href: `/patients/${patientId}/appointments` },
      ]}
    >
      <Head title={`Patient ${patientId} Appointments`} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Patient Appointments</h1>
            <p className="text-sm text-white/60">
              Showing all appointments for Patient ID: {patientId}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/appointments/create`}
              className="rounded-md bg-white/10 px-5 py-3 text-sm hover:bg-white/20"
            >
              + New Appointment
            </Link>

            <Link
              href="/patients"
              className="rounded-md border border-white/10 px-5 py-3 text-sm hover:bg-white/5"
            >
              Back to Patients
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 bg-white/5 px-5 py-4 text-sm font-medium">
            <div className="col-span-2">Patient ID</div>
            <div className="col-span-4">Appointment Type</div>
            <div className="col-span-4">Time</div>
            <div className="col-span-2">Status</div>
          </div>

          <div className="divide-y divide-white/10">
            {appointments.length ? (
              appointments.map((a) => (
                <div
                  key={a.appointment_id}
                  className="grid grid-cols-12 items-center px-5 py-4 text-sm hover:bg-white/5"
                >
                  <div className="col-span-2">{a.patient_id}</div>
                  <div className="col-span-4">{a.appointment_type}</div>
                  <div className="col-span-4">{a.appointment_datetime}</div>
                  <div className="col-span-2">{a.status ?? '-'}</div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-white/60">
                No appointments found for this patient.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}
