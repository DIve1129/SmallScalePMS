import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

type PatientLite = {
  patient_id: number;
  first_name: string | null;
  last_name: string | null;
};

// Added a Doctor type definition
type DoctorLite = {
  doctor_id: number;
  first_name: string | null;
  last_name: string | null;
};

type ChargeMaster = {
  billing_id: number;
  service_name: string;
  amount: number | string;
};

export default function AppointmentCreate({
  patients,
  doctors = [], // 1. Added doctors array to received props
  chargeMasters = [],
}: {
  patients: PatientLite[];
  doctors?: DoctorLite[]; // Included in type definition
  chargeMasters?: ChargeMaster[];
}) {
  const { data, setData, post, processing, errors } = useForm({
    patient_id: '',
    doctor_id: '',
    app_reason: '',
    scheduled_at: '',
    status: 'Scheduled',
    amount_1: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/appointments');
  }

  const inputClass =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';

  const selectClass = inputClass;

  const labelClass = 'mb-2 block text-sm font-medium text-foreground';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Appointments', href: '/appointments' },
        { title: 'New Appointment', href: '/appointments/create' },
      ]}
    >
      <Head title="New Appointment" />

      <div className="p-6 text-foreground">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              New Appointment
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill appointment details and save
            </p>
          </div>

          <Link
            href="/appointments"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-accent"
          >
            Back
          </Link>
        </div>

        <form
          onSubmit={submit}
          className="max-w-xl space-y-5 rounded-lg border border-border bg-background p-6"
        >
          <h2 className="text-lg font-medium text-foreground">
            Appointment Details
          </h2>

          {/* Patient */}
          <div>
            <label className={labelClass}>Patient</label>

            <div className="flex gap-2">
              <select
                className={selectClass}
                value={data.patient_id}
                onChange={(e) => setData('patient_id', e.target.value)}
              >
                <option value="">Select a patient...</option>

                {patients.map((p) => {
                  const fullName =
                    `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() ||
                    `Patient #${p.patient_id}`;

                  return (
                    <option key={p.patient_id} value={p.patient_id}>
                      {p.patient_id} - {fullName}
                    </option>
                  );
                })}
              </select>

              <Link
                href="/patients/create"
                className="whitespace-nowrap rounded-md border border-border bg-muted px-4 py-2 text-sm text-foreground transition hover:bg-accent"
              >
                New Patient
              </Link>
            </div>

            {errors.patient_id && (
              <div className="mt-2 text-xs text-red-500">
                {errors.patient_id}
              </div>
            )}
          </div>

          {/* Doctor Dropdown (Swapped from Field to select element) */}
          <div>
            <label className={labelClass}>Doctor</label>
            <select
              className={selectClass}
              value={data.doctor_id}
              onChange={(e) => setData('doctor_id', e.target.value)}
            >
              <option value="">Select a doctor...</option>
              {doctors.map((d) => {
                const docFullName =
                  `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim() ||
                  `Doctor #${d.doctor_id}`;

                return (
                  <option key={d.doctor_id} value={d.doctor_id}>
                    {d.doctor_id} - {docFullName}
                  </option>
                );
              })}
            </select>
            {errors.doctor_id && (
              <div className="mt-2 text-xs text-red-500">
                {errors.doctor_id}
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className={labelClass}>Reason</label>
            <select
              className={selectClass}
              value={data.app_reason}
              onChange={(e) => {
                const selected = chargeMasters.find(
                  (c) => c.service_name === e.target.value
                );

                setData((current) => ({
                  ...current,
                  app_reason: e.target.value,
                  amount_1: selected ? String(selected.amount) : '',
                }));
              }}
            >
              <option value="">Select service...</option>
              {chargeMasters.map((c) => (
                <option key={c.billing_id} value={c.service_name}>
                  {c.service_name} - Rs{' '}
                  {Number(c.amount ?? 0).toFixed(2)}
                </option>
              ))}
            </select>
            {errors.app_reason && (
              <div className="mt-2 text-xs text-red-500">
                {errors.app_reason}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className={labelClass}>Base Amount</label>
            <input
              type="number"
              step="0.01"
              readOnly
              className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground"
              value={data.amount_1}
              placeholder="Auto-filled from selected service"
            />
            {errors.amount_1 && (
              <div className="mt-2 text-xs text-red-500">
                {errors.amount_1}
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Scheduled Date & Time</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={data.scheduled_at}
              onChange={(e) => setData('scheduled_at', e.target.value)}
            />
            {errors.scheduled_at && (
              <div className="mt-2 text-xs text-red-500">
                {errors.scheduled_at}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={selectClass}
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <div className="mt-2 text-xs text-red-500">
                {errors.status}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md border border-border bg-muted px-4 py-2 text-sm text-foreground transition hover:bg-accent disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save Appointment'}
            </button>

            <Link
              href="/appointments"
              className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-accent"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}