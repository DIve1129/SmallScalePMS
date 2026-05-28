import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

type Appointment = {
  appointment_id: number;
  patient_id: number | string;
  doctor_id: string;
  app_reason: string;
  scheduled_at: string;
  status: string;
};

type Patient = {
  patient_id: number;
  first_name: string;
  last_name: string;
};

export default function EditAppointment({
  appointment,
  patients = [],
}: {
  appointment: Appointment;
  patients?: Patient[];
}) {
  const { data, setData, put, processing, errors } = useForm({
    patient_id: String(appointment.patient_id ?? ''),
    doctor_id: appointment.doctor_id ?? '',
    app_reason: appointment.app_reason ?? '',
    scheduled_at: appointment.scheduled_at
      ? appointment.scheduled_at.slice(0, 16)
      : '',
    status: appointment.status ?? 'Scheduled',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(`/appointments/${appointment.appointment_id}`);
  }

  const inputClass =
    'w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';

  const labelClass = 'mb-2 block text-sm font-medium text-foreground';

  const selectClass =
    'w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';

  const buttonPrimary =
    'rounded-md bg-muted px-5 py-3 text-sm text-foreground transition hover:bg-accent disabled:opacity-50';

  const buttonSecondary =
    'rounded-md border border-border bg-background px-5 py-3 text-sm text-foreground transition hover:bg-accent';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Appointments', href: '/appointments' },
        {
          title: 'Edit Appointment',
          href: `/appointments/${appointment.appointment_id}/edit`,
        },
      ]}
    >
      <Head title="Edit Appointment" />

      <div className="p-6 space-y-6 text-foreground">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Edit Appointment</h1>
          <p className="text-sm text-muted-foreground">
            Update appointment details and status.
          </p>
        </div>

        <form onSubmit={submit} className="max-w-3xl space-y-6">
          <div>
            <label className={labelClass}>Patient</label>
            <select
              value={data.patient_id}
              onChange={(e) => setData('patient_id', e.target.value)}
              className={selectClass}
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.patient_id} - {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
            {errors.patient_id && (
              <p className="mt-2 text-sm text-red-500">{errors.patient_id}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Doctor ID</label>
            <input
              type="text"
              value={data.doctor_id}
              onChange={(e) => setData('doctor_id', e.target.value)}
              className={inputClass}
            />
            {errors.doctor_id && (
              <p className="mt-2 text-sm text-red-500">{errors.doctor_id}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Appointment Type / Reason</label>
            <input
              type="text"
              value={data.app_reason}
              onChange={(e) => setData('app_reason', e.target.value)}
              className={inputClass}
            />
            {errors.app_reason && (
              <p className="mt-2 text-sm text-red-500">{errors.app_reason}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              className={selectClass}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-show">No-show</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Ongoing">Ongoing</option>
            </select>
            {errors.status && (
              <p className="mt-2 text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              {data.status === 'Rescheduled' ? 'New Date & Time' : 'Date & Time'}
            </label>
            <input
              type="datetime-local"
              value={data.scheduled_at}
              onChange={(e) => setData('scheduled_at', e.target.value)}
              className={inputClass}
            />
            {errors.scheduled_at && (
              <p className="mt-2 text-sm text-red-500">{errors.scheduled_at}</p>
            )}
          </div>

          {data.status === 'Rescheduled' && (
            <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400">
              Appointment will be marked as rescheduled and saved with the new
              date/time.
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={processing} className={buttonPrimary}>
              {processing ? 'Updating...' : 'Update Appointment'}
            </button>

            <Link href="/appointments" className={buttonSecondary}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}