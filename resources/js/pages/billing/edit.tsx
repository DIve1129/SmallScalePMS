import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, useForm } from '@inertiajs/react';

type Appointment = {
  appointment_id: number;
  patient_id?: number | string | null;
  patient_name?: string | null;
  doctor_id?: number | string | null;
  appointment_reason?: string | null;
  additional_services?: string | null;
  notes?: string | null;
  additional_charge?: number | string | null;
  responsibility?: string | null;
  claim_status?: string | null;
  status?: string | null;
};

export default function BillingEdit({ appointment }: { appointment: Appointment }) {
  const { data, setData, put, processing, errors } = useForm({
    appointment_reason: appointment.appointment_reason ?? '',
    additional_services: appointment.additional_services ?? '',
    notes: appointment.notes ?? '',
    additional_charge: appointment.additional_charge ?? 0,
    responsibility: appointment.responsibility ?? 'Patient',
    claim_status: appointment.claim_status ?? 'Pending',
    status: appointment.status ?? 'Ongoing',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(`/billing/${appointment.appointment_id}`);
  }

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Billing', href: '/billing' }, { title: 'Edit Visit', href: '#' }]}>
      <Head title="Edit Billing Visit" />

      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit Billing Visit</h1>
          <p className="text-sm text-white/60">
            Update the visit details before billing is finalized.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-lg border border-white/10 p-6">
          <div>
            <label className="mb-2 block text-sm text-white/70">Appointment Reason</label>
            <input
              type="text"
              value={data.appointment_reason}
              onChange={(e) => setData('appointment_reason', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
            {errors.appointment_reason && <p className="mt-1 text-sm text-red-400">{errors.appointment_reason}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Additional Services</label>
            <input
              type="text"
              value={data.additional_services}
              onChange={(e) => setData('additional_services', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
            {errors.additional_services && <p className="mt-1 text-sm text-red-400">{errors.additional_services}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Notes</label>
            <textarea
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
              rows={5}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
            {errors.notes && <p className="mt-1 text-sm text-red-400">{errors.notes}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Additional Charge</label>
            <input
              type="number"
              step="0.01"
              value={data.additional_charge}
              onChange={(e) => setData('additional_charge', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
            {errors.additional_charge && <p className="mt-1 text-sm text-red-400">{errors.additional_charge}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Responsibility</label>
            <select
              value={data.responsibility}
              onChange={(e) => setData('responsibility', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            >
              <option value="Patient">Patient</option>
              <option value="Insurance">Insurance</option>
            </select>
            {errors.responsibility && <p className="mt-1 text-sm text-red-400">{errors.responsibility}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Claim Status</label>
            <select
              value={data.claim_status}
              onChange={(e) => setData('claim_status', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Ready to Bill">Ready to Bill</option>
              <option value="Billed out">Billed</option>
            </select>
            {errors.claim_status && <p className="mt-1 text-sm text-red-400">{errors.claim_status}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Appointment Status</label>
            <select
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="No-show">No-show</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-400">{errors.status}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-white/10 px-5 py-3 text-sm hover:bg-white/20 disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}