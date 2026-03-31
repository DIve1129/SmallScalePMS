import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

/**
 * We receive patients from the controller to show in a dropdown.
 */
type PatientLite = {
  patient_id: number;
  first_name: string | null;
  last_name: string | null;
};

export default function AppointmentCreate({ patients }: { patients: PatientLite[] }) {
  /**
   * useForm is Inertia's helper for forms.
   * - data: your form values
   * - setData: update values when typing
   * - post: submit to backend
   * - processing: true while saving
   * - errors: validation errors from Laravel
   */
  const { data, setData, post, processing, errors } = useForm({
    patient_id: '',
    doctor_id: '',
    app_reason: '',
    scheduled_at: '',
    status: 'Scheduled',
  });

  /**
   * When user clicks "Save", submit the form to POST /appointments
   */
  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/appointments');
  }

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Appointments', href: '/appointments' },
        { title: 'New Appointment', href: '/appointments/create' },
      ]}
    >
      <Head title="New Appointment" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">New Appointment</h1>
            <p className="text-sm text-white/60">Fill appointment details and save</p>
          </div>

          <Link
            href="/appointments"
            className="rounded-md border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Back
          </Link>
        </div>

        {/* Form card (same style as Add Patient) */}
        <form
          onSubmit={submit}
          className="max-w-xl rounded-lg border border-white/10 bg-white/[0.02] p-6 space-y-5"
        >
          <h2 className="text-lg font-medium">Appointment Details</h2>

          {/* Patient dropdown */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Patient</label>
            <select
              className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
              value={data.patient_id}
              onChange={(e) => setData('patient_id', e.target.value)}
            >
              <option value="">Select a patient...</option>
              {patients.map((p) => {
                const fullName =
                  `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || `Patient #${p.patient_id}`;
                return (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.patient_id} - {fullName}
                  </option>
                );
              })}
            </select>
            {errors.patient_id && <div className="mt-2 text-xs text-red-400">{errors.patient_id}</div>}
          </div>

          {/* Doctor ID */}
          <Field
            label="Doctor ID"
            placeholder="Example D_ID"
            value={data.doctor_id}
            onChange={(v) => setData('doctor_id', v)}
            error={errors.doctor_id}
          />

          {/* Reason */}
          <Field
            label="Reason"
            placeholder="Checkup / Consultation / Follow-up"
            value={data.app_reason}
            onChange={(v) => setData('app_reason', v)}
            error={errors.app_reason}
          />

          {/* Date & Time */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Scheduled Date & Time</label>
            <input
              type="datetime-local"
              className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
              value={data.scheduled_at}
              onChange={(e) => setData('scheduled_at', e.target.value)}
            />
            {errors.scheduled_at && <div className="mt-2 text-xs text-red-400">{errors.scheduled_at}</div>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Status</label>
            <select
              className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.status && <div className="mt-2 text-xs text-red-400">{errors.status}</div>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save Appointment'}
            </button>

            <Link
              href="/appointments"
              className="rounded-md border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}

/**
 * Reusable input (same idea as Add Patient page)
 */
function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-white/70 mb-2">{label}</label>
      <input
        className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
    </div>
  );
}
