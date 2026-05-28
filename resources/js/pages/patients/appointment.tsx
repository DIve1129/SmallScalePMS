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
        { title: `Patient #${patientId}`, href: `/patients/${patientId}` },
        { title: 'Appointments', href: `/patients/${patientId}/appointments` },
      ]}
    >
      <Head title={`Patient ${patientId} Appointments`} />

      <div className="p-6 space-y-6 text-foreground">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Patient Appointments
            </h1>
            <p className="text-sm text-muted-foreground">
              Showing all appointments for Patient ID: {patientId}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/appointments/create`}
              className="rounded-md bg-muted px-5 py-3 text-sm text-foreground transition hover:bg-accent"
            >
              + New Appointment
            </Link>

            <Link
              href="/patients"
              className="rounded-md border border-border bg-background px-5 py-3 text-sm text-foreground transition hover:bg-accent"
            >
              Back to Patients
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          <div className="grid grid-cols-12 bg-muted px-5 py-4 text-sm font-medium text-foreground">
            <div className="col-span-2">Patient ID</div>
            <div className="col-span-4">Appointment Type</div>
            <div className="col-span-4">Time</div>
            <div className="col-span-2">Status</div>
          </div>

          <div className="divide-y divide-border">
            {appointments.length ? (
              appointments.map((a) => (
                <div
                  key={a.appointment_id}
                  className="grid grid-cols-12 items-center px-5 py-4 text-sm text-foreground transition hover:bg-accent"
                >
                  <div className="col-span-2">{a.patient_id}</div>
                  <div className="col-span-4">{a.appointment_type}</div>
                  <div className="col-span-4">{a.appointment_datetime}</div>
                  <div className="col-span-2">{a.status ?? '-'}</div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-muted-foreground">
                No appointments found for this patient.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}