import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PatientCreate() {
  const { data, setData, post, processing, errors } = useForm({
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
    post('/patients');
  };

  const inputClass =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring';

  const labelClass = 'block text-sm font-medium text-foreground mb-2';

  const buttonPrimary =
    'rounded-md bg-muted px-4 py-2 text-sm text-foreground transition hover:bg-accent disabled:opacity-60';

  const buttonSecondary =
    'rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-accent';

  return (
    <AppSidebarLayout
      breadcrumbs={[
        { title: 'Patients', href: '/patients' },
        { title: 'Add Patient', href: '/patients/create' },
      ]}
    >
      <Head title="Add Patient" />

      <div className="p-6 text-foreground">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Add Patient</h1>
            <p className="text-sm text-muted-foreground">Demographic details</p>
          </div>

          <Link href="/patients" className={buttonSecondary}>
            Back
          </Link>
        </div>

        <form className="max-w-xl rounded-lg border border-border bg-background p-6 space-y-5" onSubmit={submit}>
          <h2 className="text-lg font-medium text-foreground">Demographic</h2>

          <Field
            label="Chart Number"
            value={data.patient_id}
            onChange={(v) => setData('patient_id', v)}
            error={errors.patient_id}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First Name"
              value={data.first_name}
              onChange={(v) => setData('first_name', v)}
              error={errors.first_name}
            />
            <Field
              label="Last Name"
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
              value={data.age}
              onChange={(v) => setData('age', v)}
              error={errors.age}
            />
          </div>

          <Field label="NIC" value={data.nic} onChange={(v) => setData('nic', v)} error={errors.nic} />
          <Field label="Address" value={data.address} onChange={(v) => setData('address', v)} error={errors.address} />
          <Field label="Phone" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} />
          <Field label="Email" value={data.email} onChange={(v) => setData('email', v)} error={errors.email} />

          <div className="pt-4 border-t border-border space-y-5">
            <Field
              label="Insurance Name"
              value={data.insurance_name}
              onChange={(v) => setData('insurance_name', v)}
              error={errors.insurance_name}
            />
            <Field
              label="Insurance ID"
              value={data.insurance_id}
              onChange={(v) => setData('insurance_id', v)}
              error={errors.insurance_id}
            />
          </div>

          <div className="pt-4 border-t border-border">
            <label className={labelClass}>Notes</label>
            <textarea
              className={`${inputClass} min-h-[90px]`}
              placeholder="Notes..."
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
            />
            {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={processing} className={buttonPrimary}>
              {processing ? 'Saving...' : 'Save'}
            </button>

            <Link href="/patients" className={buttonSecondary}>
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
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <input
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}