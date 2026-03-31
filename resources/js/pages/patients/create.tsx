import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PatientCreate() {
  const { data, setData, post, processing, errors } = useForm({
    // chart number (optional - backend can generate)
    patient_id: '',
    first_name: '',
    last_name: '',
    dob: '',
    age: '',
    nic: '',
    address: '',
    phone: '',
    email: '',
    insurance_name: '',
    insurance_id: '',
    notes: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/patients'); // or post(route('patients.store')) if route() helper is set up
  };

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Patients', href: '/patients' },
        { title: 'Add Patient', href: '/patients/create' },
      ]}
    >
      <Head title="Add Patient" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Add Patient</h1>
            <p className="text-sm text-white/60">Demographic details</p>
          </div>

          <Link
            href="/patients"
            className="rounded-md border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Back
          </Link>
        </div>

        {/* ✅ REAL FORM */}
        <form
          onSubmit={submit}
          className="max-w-xl rounded-lg border border-white/10 bg-white/[0.02] p-6 space-y-5"
        >
          <h2 className="text-lg font-medium">Demographic</h2>

          <Field
            label="Chart Number (optional)"
            placeholder="Leave blank to auto-generate"
            value={data.patient_id}
            onChange={(v) => setData('patient_id', v)}
            error={errors.patient_id}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First Name"
              placeholder="First name"
              value={data.first_name}
              onChange={(v) => setData('first_name', v)}
              error={errors.first_name}
            />
            <Field
              label="Last Name"
              placeholder="Last name"
              value={data.last_name}
              onChange={(v) => setData('last_name', v)}
              error={errors.last_name}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="DOB"
              placeholder="YYYY-MM-DD"
              value={data.dob}
              onChange={(v) => setData('dob', v)}
              error={errors.dob}
            />
            <Field
              label="Age"
              placeholder="Age"
              value={data.age}
              onChange={(v) => setData('age', v)}
              error={errors.age}
            />
          </div>

          <Field
            label="NIC"
            placeholder="NIC"
            value={data.nic}
            onChange={(v) => setData('nic', v)}
            error={errors.nic}
          />
          <Field
            label="Address"
            placeholder="Address"
            value={data.address}
            onChange={(v) => setData('address', v)}
            error={errors.address}
          />
          <Field
            label="Phone"
            placeholder="Phone"
            value={data.phone}
            onChange={(v) => setData('phone', v)}
            error={errors.phone}
          />
          <Field
            label="Email"
            placeholder="Email"
            value={data.email}
            onChange={(v) => setData('email', v)}
            error={errors.email}
          />

          <div className="pt-4 border-t border-white/10 space-y-5">
            <Field
              label="Insurance Name"
              placeholder="Insurance name"
              value={data.insurance_name}
              onChange={(v) => setData('insurance_name', v)}
              error={errors.insurance_name}
            />
            <Field
              label="Insurance ID"
              placeholder="Insurance ID"
              value={data.insurance_id}
              onChange={(v) => setData('insurance_id', v)}
              error={errors.insurance_id}
            />
          </div>

          <div className="pt-4 border-t border-white/10">
            <label className="block text-sm text-white/70 mb-2">Notes</label>
            <textarea
              className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm outline-none min-h-[90px]"
              placeholder="Notes..."
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
            />
            {errors.notes && <p className="mt-1 text-xs text-red-400">{errors.notes}</p>}
          </div>

          {/* ✅ REAL BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-60"
            >
              {processing ? 'Saving...' : 'Save'}
            </button>

            <Link
              href="/patients"
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
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
