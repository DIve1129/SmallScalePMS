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

  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Appointments', href: '/appointments' },
      { title: 'Edit Appointment', href: `/appointments/${appointment.appointment_id}/edit` },
    ]}>
      <Head title="Edit Appointment" />

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Edit Appointment</h1>
          <p className="text-sm text-white/60">
            Update appointment details and status.
          </p>
        </div>

        <form onSubmit={submit} className="max-w-3xl space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white/70">Patient</label>
            <select
              value={data.patient_id}
              onChange={(e) => setData('patient_id', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            >
              <option value="" className="bg-black">Select patient</option>
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id} className="bg-black">
                  {p.patient_id} - {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
            {errors.patient_id && <p className="mt-2 text-sm text-red-400">{errors.patient_id}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Doctor ID</label>
            <input
              type="text"
              value={data.doctor_id}
              onChange={(e) => setData('doctor_id', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
            {errors.doctor_id && <p className="mt-2 text-sm text-red-400">{errors.doctor_id}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Appointment Type / Reason</label>
            <input
              type="text"
              value={data.app_reason}
              onChange={(e) => setData('app_reason', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
            {errors.app_reason && <p className="mt-2 text-sm text-red-400">{errors.app_reason}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Status</label>
            <select
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            >
              <option value="Scheduled" className="bg-black">Scheduled</option>
              <option value="Completed" className="bg-black">Completed</option>
              <option value="Cancelled" className="bg-black">Cancelled</option>
              <option value="No-show" className="bg-black">No-show</option>
              <option value="Rescheduled" className="bg-black">Rescheduled</option>
            </select>
            {errors.status && <p className="mt-2 text-sm text-red-400">{errors.status}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              {data.status === 'Rescheduled' ? 'New Date & Time' : 'Date & Time'}
            </label>
            <input
              type="datetime-local"
              value={data.scheduled_at}
              onChange={(e) => setData('scheduled_at', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
            {errors.scheduled_at && <p className="mt-2 text-sm text-red-400">{errors.scheduled_at}</p>}
          </div>

          {data.status === 'Rescheduled' && (
            <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
              Appointment will be marked as rescheduled and saved with the new date/time.
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-white/10 px-5 py-3 text-sm hover:bg-white/20 disabled:opacity-50"
            >
              {processing ? 'Updating...' : 'Update Appointment'}
            </button>

            <Link
              href="/appointments"
              className="rounded-md border border-white/10 px-5 py-3 text-sm hover:bg-white/5"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}